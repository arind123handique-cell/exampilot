/**
 * OPENAI-COMPATIBLE AI CLIENT
 *
 * OpenRouter, NVIDIA NIM, OpenAI and Groq all expose the same
 * `POST {base}/chat/completions` dialect, so one client covers all four. This
 * is what makes those providers real in the app: `aiProviderManagement.ts`
 * listed them but never called them, so choosing one there did nothing.
 *
 * Error handling follows the same rule the Gemini client uses: never throw on a
 * failed call, record the reason, and return null so the caller can fall back to
 * its offline engine. A silently swallowed failure is how the retired
 * `gemini-1.5-flash` model went unnoticed for so long.
 */

import { AI_PROVIDERS, type AiProviderId } from './aiCredentials';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface CompatCallOptions {
  provider: AiProviderId;
  apiKey: string;
  model: string;
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
  /** Ask for strict JSON where the model supports it. */
  json?: boolean;
  signalMs?: number;
}

export interface CompatCallResult {
  text: string | null;
  model: string | null;
  finishReason: string | null;
  error: string | null;
}

let lastError: string | null = null;
let lastModel: string | null = null;
let lastFinishReason: string | null = null;

export function getLastCompatError(): string | null {
  return lastError;
}

export function getLastCompatModel(): string | null {
  return lastModel;
}

export function getLastCompatFinishReason(): string | null {
  return lastFinishReason;
}

/** OpenAI-compatible gateways put the useful part in `error.message`. */
function extractErrorMessage(body: string, fallback: string): string {
  try {
    const parsed = JSON.parse(body);
    const message = parsed?.error?.message ?? parsed?.message;
    if (typeof message === 'string' && message.trim()) return message.trim().slice(0, 240);
  } catch {
    // Not JSON — fall through to the raw slice below.
  }
  return body.trim().slice(0, 240) || fallback;
}

/**
 * Extracts a JSON object from a model response.
 *
 * Wrapped in ```json fences is the single most common deviation, so fences are
 * stripped before parsing. Returns null rather than throwing on malformed
 * output — the caller decides whether to retry or fall back.
 */
export function parseJsonLoose<T>(raw: string): T | null {
  if (!raw) return null;
  const text = raw.trim();
  try {
    return JSON.parse(text) as T;
  } catch {
    // continue
  }
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    try {
      return JSON.parse(fenced[1].trim()) as T;
    } catch {
      // continue
    }
  }
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(text.slice(firstBrace, lastBrace + 1)) as T;
    } catch {
      // continue
    }
  }
  return null;
}

export async function callOpenAiCompat(opts: CompatCallOptions): Promise<CompatCallResult> {
  const descriptor = AI_PROVIDERS[opts.provider];
  const apiKey = opts.apiKey.trim();
  const model = opts.model.trim();

  lastError = null;
  lastModel = null;
  lastFinishReason = null;

  if (!descriptor || descriptor.kind !== 'openai-compatible') {
    lastError = 'Unsupported provider for this client.';
    return { text: null, model: null, finishReason: null, error: lastError };
  }
  if (!apiKey) {
    lastError = 'No API key configured.';
    return { text: null, model: null, finishReason: null, error: lastError };
  }
  if (!model) {
    lastError = 'No model selected.';
    return { text: null, model: null, finishReason: null, error: lastError };
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };
  if (opts.provider === 'openrouter') {
    const origin = typeof location !== 'undefined' ? location.origin : '';
    headers['HTTP-Referer'] = origin;
    headers['X-Title'] = 'ExamPilot AI';
  }

  const body: Record<string, unknown> = {
    model,
    messages: opts.messages,
    temperature: opts.temperature ?? 0.4
  };
  if (opts.maxTokens && opts.maxTokens > 0) body.max_tokens = opts.maxTokens;
  if (opts.json) body.response_format = { type: 'json_object' };

  try {
    const res = await fetch(`${descriptor.baseUrl}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(opts.signalMs ?? 60000)
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      lastError = extractErrorMessage(text, `${descriptor.label} returned ${res.status}.`);
      return { text: null, model, finishReason: null, error: lastError };
    }

    const payload = await res.json();
    const choice = Array.isArray(payload?.choices) ? payload.choices[0] : null;
    const content = choice?.message?.content;
    const finishReason = typeof choice?.finish_reason === 'string' ? choice.finish_reason : null;

    lastModel = typeof payload?.model === 'string' ? payload.model : model;
    lastFinishReason = finishReason;

    if (typeof content !== 'string' || !content.trim()) {
      // A truncated response arrives here: empty content with a length stop.
      const truncated = finishReason === 'length';
      lastError = truncated
        ? 'The model ran out of output space before finishing. Try a shorter request or a different model.'
        : `${descriptor.label} returned an empty response.`;
      return { text: null, model: lastModel, finishReason, error: lastError };
    }

    return { text: content, model: lastModel, finishReason, error: null };
  } catch (err: any) {
    if (err?.name === 'TimeoutError' || err?.name === 'AbortError') {
      lastError = `${descriptor.label} did not respond in time.`;
    } else {
      // A browser CORS rejection surfaces as an opaque "Failed to fetch" — say
      // so plainly, because it is usually the provider or an ad blocker.
      lastError = err?.message || `Could not reach ${descriptor.label}.`;
    }
    return { text: null, model, finishReason: null, error: lastError };
  }
}

/** JSON-mode convenience wrapper used by the mock generator. */
export async function callOpenAiCompatJson<T>(
  opts: Omit<CompatCallOptions, 'json'>
): Promise<T | null> {
  const result = await callOpenAiCompat({ ...opts, json: true });
  if (!result.text) return null;
  return parseJsonLoose<T>(result.text);
}
