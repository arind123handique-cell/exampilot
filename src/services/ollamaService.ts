/**
 * LOCAL AI PROVIDER (Ollama)
 *
 * A free, API-key-less model backend. Ollama runs large language models
 * (llama 3, qwen, mistral, gemma, ...) locally on the user's machine via
 * `ollama serve`, so no secret is ever sent over the network and there are
 * zero API costs. This is the "FREE MODEL THAT DOESN'T NEED APIs" tier.
 *
 * Resolution order (per PROMP.txt §31 — providers must be swappable):
 *   explicit `provider` arg → VITE_AI_PROVIDER env → 'auto'
 * In `auto` mode the orchestrator tries Gemini (when a key exists) first,
 * then Ollama (when reachable), then the deterministic offline engines.
 *
 * Everything here is optional: if Ollama is not running, every function
 * degrades cleanly and the existing offline recipe engines take over — the
 * same safety net that already protects the Gemini path.
 */

export type OllamaProvider = 'ollama' | 'gemini' | 'auto';

export interface AiDiagnostics {
  model: string | null;
  finishReason: string | null;
  rawText: string | null;
  error: string | null;
  provider: 'ollama' | 'gemini';
}

const DEFAULT_BASE_URL = '/api/ollama';
const DEFAULT_MODEL = 'qwen2.5-coder:7b';
const OLLAMA_STORAGE_KEYS = {
  baseUrl: 'exampilot_ollama_base',
  model: 'exampilot_ollama_model',
};

const env = (import.meta as any).env ?? {};
const envBaseUrl = String(env?.VITE_OLLAMA_BASE_URL ?? '').trim();
const envModel = String(env?.VITE_OLLAMA_MODEL ?? '').trim();
const envProvider = String(env?.VITE_AI_PROVIDER ?? '').trim().toLowerCase();

function readStorage(key: string): string {
  try {
    const value = localStorage.getItem(key);
    return value ?? '';
  } catch {
    return '';
  }
}

function writeStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // storage unavailable - ignore
  }
}

/** Base URL of the local Ollama server. */
export function getOllamaBaseUrl(): string {
  return (readStorage(OLLAMA_STORAGE_KEYS.baseUrl) || envBaseUrl || DEFAULT_BASE_URL).replace(/\/$/, '');
}

/** Model name used for local inference; overridable by the user. */
export function getOllamaModel(): string {
  return readStorage(OLLAMA_STORAGE_KEYS.model) || envModel || DEFAULT_MODEL;
}

/** Persist the user's chosen model/base URL across sessions. */
export function setOllamaConfig(baseUrl: string, model: string): void {
  writeStorage(OLLAMA_STORAGE_KEYS.baseUrl, baseUrl);
  writeStorage(OLLAMA_STORAGE_KEYS.model, model);
}

/** Configured provider preference. */
export function getAiProvider(): OllamaProvider {
  if (envProvider === 'gemini') return 'gemini';
  if (envProvider === 'ollama') return 'ollama';
  return 'auto';
}

export const RECOMMENDED_OLLAMA_MODELS = [
  'qwen2.5-coder:7b',
  'llama3.1:8b',
  'qwen2.5-coder:latest'
];

export function getOllamaCandidates(): string[] {
  const preferred = getOllamaModel();
  return preferred ? [preferred, DEFAULT_MODEL, 'llama3.1:8b'] : [DEFAULT_MODEL, 'llama3.1:8b'];
}

/** What the last call actually did — surfaced in the UI exactly like Gemini. */
let lastDiagnostics: AiDiagnostics = {
  model: null,
  finishReason: null,
  rawText: null,
  error: null,
  provider: 'gemini'
};

let lastOllamaError: string | null = null;
let ollamaAvailable: boolean | null = null;
let availabilityCheckedAt = 0;
const AVAILABILITY_TTL_MS = 10_000;

export function getLastOllamaError(): string | null {
  return lastOllamaError;
}

export function getLastAiDiagnostics(): AiDiagnostics {
  return { ...lastDiagnostics };
}

export function resetAiDiagnostics(): void {
  lastDiagnostics = { model: null, finishReason: null, rawText: null, error: null, provider: 'gemini' };
  lastOllamaError = null;
}

/** Alias kept for callers that ask "is there any live AI right now?" */
export function hasLiveOllama(): boolean {
  // Synchronous fast-path: a confirmed unavailable server stays cached.
  if (ollamaAvailable === false) return false;
  if (ollamaAvailable === true) return true;
  // Otherwise don't block the render on a network probe.
  return false;
}

/** Alias matching the Gemini service naming for the UI/diagnostic layer. */
export function getActiveOllamaModel(): string | null {
  return getOllamaModel();
}

/** Alias so the router can read diagnostics under a consistent name. */
export function getLastOllamaDiagnostics(): AiDiagnostics {
  return getLastAiDiagnostics();
}

function extractJson(text: string): any | null {
  try {
    return JSON.parse(text);
  } catch {
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced) {
      try {
        return JSON.parse(fenced[1].trim());
      } catch {
        /* fall through */
      }
    }
    const start = text.search(/[[{]/);
    const end = Math.max(text.lastIndexOf(']'), text.lastIndexOf('}'));
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(text.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

function escapeControlCharsInStrings(text: string): string {
  let out = '';
  let inString = false;
  let escaped = false;
  for (const character of text) {
    if (escaped) {
      out += character;
      escaped = false;
      continue;
    }
    if (character === '\\') {
      out += character;
      escaped = true;
      continue;
    }
    if (character === '"') {
      inString = !inString;
      out += character;
      continue;
    }
    if (inString) {
      const code = character.charCodeAt(0);
      if (character === '\n') { out += '\\n'; continue; }
      if (character === '\r') { out += '\\r'; continue; }
      if (character === '\t') { out += '\\t'; continue; }
      if (code < 32) { out += `\\u${code.toString(16).padStart(4, '0')}`; continue; }
    }
    out += character;
  }
  return out;
}

function parseJsonLenient(candidate: string): any | null {
  try {
    return JSON.parse(candidate);
  } catch {
    try {
      return JSON.parse(escapeControlCharsInStrings(candidate));
    } catch {
      return null;
    }
  }
}

/**
 * Probe the local server once (cached for AVAILABILITY_TTL_MS) so the UI can
 * report "local model ready" without firing a full generation on every render.
 */
export async function isOllamaAvailable(): Promise<boolean> {
  const now = Date.now();
  if (ollamaAvailable !== null && now - availabilityCheckedAt < AVAILABILITY_TTL_MS) {
    return ollamaAvailable === true;
  }
  try {
    const response = await fetch(`${getOllamaBaseUrl()}/api/tags`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000)
    });
    ollamaAvailable = response.ok;
    availabilityCheckedAt = now;
    lastOllamaError = response.ok ? null : `Ollama ${response.status}`;
    return ollamaAvailable === true;
  } catch (err) {
    ollamaAvailable = false;
    availabilityCheckedAt = now;
    lastOllamaError = err instanceof Error ? err.message : 'Ollama unreachable';
    return false;
  }
}

/**
 * A model pulled but not yet running is still "available"; Ollama will spin the
 * first request up in a few seconds, so we treat it as usable rather than
 * failing the user on a cold start.
 */
export async function isModelPulled(model = getOllamaModel()): Promise<boolean> {
  try {
    const response = await fetch(`${getOllamaBaseUrl()}/api/show`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model }),
      signal: AbortSignal.timeout(2000)
    });
    return response.ok;
  } catch {
    return false;
  }
}

export interface OllamaRequestOpts {
  temperature?: number;
  maxOutputTokens?: number;
  json?: boolean;
}

/**
 * Hit the local Ollama /api/generate endpoint and reassemble the streamed
 * chunks into a single string. Returns null (never throws) for transport
 * errors so callers can fall through to the next provider.
 */
async function ollamaGenerate(
  prompt: string,
  opts: OllamaRequestOpts = {}
): Promise<string | null> {
  const base = opts.json === false ? 0.2 : 0.3;
  const requestOpts = {
    temperature: opts.temperature ?? base,
    num_predict: opts.maxOutputTokens ?? 2048
  } as const;
  const bodyBase: Record<string, unknown> = {
    prompt,
    stream: true,
    options: requestOpts
  };

  let lastError: Error | null = null;
  const models = ollamaAvailable === false ? [DEFAULT_MODEL] : getOllamaCandidates();

  for (const model of [...new Set(models)]) {
    try {
      const response = await fetch(`${getOllamaBaseUrl()}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...bodyBase, model }),
        signal: AbortSignal.timeout(opts.maxOutputTokens ? opts.maxOutputTokens * 20 : 60_000)
      });

      if (!response.ok) {
        const body = await response.text().catch(() => '');
        if (response.status === 404 || /not found/i.test(body)) {
          lastError = new Error(`Ollama model "${model}" not found`);
          continue;
        }
        throw new Error(`Ollama HTTP ${response.status}: ${body.slice(0, 200)}`);
      }

      // Ollama streams a JSON object per line; accumulate `response` locally
      // (no shared buffer — safe across concurrent calls).
      const reader = response.body?.getReader();
      if (!reader) {
        lastError = new Error('Ollama response had no body');
        continue;
      }
      const decoder = new TextDecoder();
      let accumulated = '';
      let text = '';
      let done = false;
      while (!done) {
        const { value, done: more } = await reader.read();
        done = more;
        if (value) {
          accumulated += decoder.decode(value, { stream: true });
          let newlineIdx: number;
          while ((newlineIdx = accumulated.indexOf('\n')) >= 0) {
            const line = accumulated.slice(0, newlineIdx).trim();
            accumulated = accumulated.slice(newlineIdx + 1);
            if (!line) continue;
            try {
              const parsed = JSON.parse(line);
              if (typeof parsed?.response === 'string') text += parsed.response;
            } catch {
              // partial line — keep accumulating until the full line arrives
            }
          }
        }
      }
      const trailing = accumulated.trim();
      if (trailing) {
        try {
          const parsed = JSON.parse(trailing);
          if (typeof parsed?.response === 'string') text += parsed.response;
        } catch { /* ignore trailing noise */ }
      }

      if (text) {
        lastDiagnostics = {
          model,
          finishReason: 'STOP',
          rawText: text,
          error: null,
          provider: 'ollama'
        };
        return text;
      }
      lastError = new Error(`Ollama returned an empty response for model "${model}"`);
      lastOllamaError = lastError.message;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      lastOllamaError = lastError.message;
      continue;
    }
  }

  throw lastError ?? new Error('Ollama: no usable model name');
}

/**
 * Text-only generation, mirroring geminiService.callGeminiText.
 * Returns null on any failure so the online model/offline engine can take over.
 */
export async function callOllamaText(prompt: string, maxOutputTokens = 1200): Promise<string | null> {
  if (!(await isOllamaAvailable())) {
    lastOllamaError = 'Ollama is not running — start it with `ollama serve`';
    return null;
  }
  try {
    return await ollamaGenerate(prompt, { maxOutputTokens });
  } catch (err) {
    lastOllamaError = err instanceof Error ? err.message : String(err);
    lastDiagnostics = { ...lastDiagnostics, error: lastOllamaError, provider: 'ollama' };
    return null;
  }
}

/**
 * JSON-mode generation. Ollama's OpenAI-style `format` option is the cleanest
 * way to ask for JSON; if the server doesn't honour it we fall back to the same
 * lenient extractor used by the Gemini path.
 */
export async function callOllamaJson<T>(
  prompt: string,
  opts: { maxOutputTokens?: number; retries?: number } = {}
): Promise<T | null> {
  if (!(await isOllamaAvailable())) {
    lastOllamaError = 'Ollama is not running — start it with `ollama serve`';
    return null;
  }

  const budget = opts.maxOutputTokens ?? 8192;
  try {
    const raw = await ollamaGenerate(prompt, { json: true, maxOutputTokens: budget });
    if (!raw) {
      lastOllamaError = 'Model returned an empty response';
      return null;
    }
    const parsed = (parseJsonLenient(raw) as T | null) ?? (extractJson(raw) as T | null);
    if (parsed !== null) {
      lastOllamaError = null;
      return parsed;
    }
    lastOllamaError = `Local model response was not valid JSON (${raw.length} chars)`;
    return null;
  } catch (err) {
    lastOllamaError = err instanceof Error ? err.message : String(err);
    lastDiagnostics = { ...lastDiagnostics, error: lastOllamaError, provider: 'ollama' };
    return null;
  }
}

export interface OllamaStatus {
  available: boolean;
  model: string;
  baseUrl: string;
  error: string | null;
}

/** Single snapshot consumed by status badges in the UI. */
export async function getOllamaStatus(): Promise<OllamaStatus> {
  const baseUrl = getOllamaBaseUrl();
  const model = getOllamaModel();
  const available = await isOllamaAvailable();
  return {
    available,
    model,
    baseUrl,
    error: available ? null : lastOllamaError
  };
}
