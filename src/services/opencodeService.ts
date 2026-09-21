/**
 * OPENCODE AI SERVICE
 *
 * Provides client integration for OpenCode (local server, CLI daemon, or remote endpoint).
 * OpenCode exposes a standard OpenAI-compatible API surface (/v1/chat/completions, /v1/models)
 * typically listening on http://localhost:4096 or custom host/port.
 *
 * Supports local models (Qwen 2.5 Coder, DeepSeek, Llama 3) and remote providers via OpenCode.
 */

export interface OpenCodeConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

const OPENCODE_STORAGE_KEYS = {
  baseUrl: 'exampilot_opencode_base',
  apiKey: 'exampilot_opencode_key',
  model: 'exampilot_opencode_model'
};

const DEFAULT_OPENCODE_BASE = 'http://localhost:4096/v1';
const DEFAULT_OPENCODE_MODEL = 'opencode/qwen-2.5-coder:32b';

export const POPULAR_OPENCODE_MODELS = [
  'opencode/qwen-2.5-coder:32b',
  'opencode/deepseek-r1',
  'opencode/claude-3-5-sonnet',
  'opencode/gpt-4o',
  'qwen2.5-coder:7b',
  'llama3.1:8b',
  'deepseek-chat'
];

function readStorage(key: string): string {
  try {
    return localStorage.getItem(key) || '';
  } catch {
    return '';
  }
}

function writeStorage(key: string, value: string): void {
  try {
    if (value) {
      localStorage.setItem(key, value);
    } else {
      localStorage.removeItem(key);
    }
  } catch {}
}

/**
 * Returns current OpenCode service configuration
 */
export function getOpenCodeConfig(): OpenCodeConfig {
  const env = (import.meta as any).env || {};
  const baseUrl =
    readStorage(OPENCODE_STORAGE_KEYS.baseUrl) ||
    env.VITE_OPENCODE_BASE_URL ||
    DEFAULT_OPENCODE_BASE;
  const apiKey =
    readStorage(OPENCODE_STORAGE_KEYS.apiKey) ||
    env.VITE_OPENCODE_API_KEY ||
    '';
  const model =
    readStorage(OPENCODE_STORAGE_KEYS.model) ||
    env.VITE_OPENCODE_MODEL ||
    DEFAULT_OPENCODE_MODEL;

  return {
    baseUrl: baseUrl.replace(/\/$/, ''),
    apiKey: apiKey.trim(),
    model: model.trim()
  };
}

/**
 * Saves OpenCode service configuration
 */
export function setOpenCodeConfig(config: Partial<OpenCodeConfig>): void {
  if (config.baseUrl !== undefined) {
    writeStorage(OPENCODE_STORAGE_KEYS.baseUrl, config.baseUrl.trim().replace(/\/$/, ''));
  }
  if (config.apiKey !== undefined) {
    writeStorage(OPENCODE_STORAGE_KEYS.apiKey, config.apiKey.trim());
  }
  if (config.model !== undefined) {
    writeStorage(OPENCODE_STORAGE_KEYS.model, config.model.trim());
  }
}

/**
 * Checks if OpenCode configuration exists or default endpoint is active
 */
export function hasOpenCodeConfig(): boolean {
  const cfg = getOpenCodeConfig();
  return Boolean(cfg.baseUrl);
}

/**
 * Tests the connection to the OpenCode service.
 * Supports both OpenAI-compatible gateways and native `opencode serve` CLI daemon.
 */
export async function testOpenCodeConnection(): Promise<{
  ok: boolean;
  message: string;
  models?: string[];
}> {
  const { baseUrl, apiKey } = getOpenCodeConfig();
  const cleanBase = baseUrl.replace(/\/v1\/?$/, '').replace(/\/$/, '');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  // 1. Try OpenAI-compatible /models endpoint
  try {
    const targetUrl = baseUrl.endsWith('/v1') ? `${baseUrl}/models` : `${baseUrl}/v1/models`;
    const res = await fetch(targetUrl, {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(3000)
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      const modelList = Array.isArray(data?.data)
        ? data.data.map((m: any) => m.id || m.name).filter(Boolean)
        : [];
      return {
        ok: true,
        message: `Connected successfully to OpenCode (OpenAI API mode) at ${baseUrl}`,
        models: modelList
      };
    }
  } catch {}

  // 2. Try native OpenCode serve OpenAPI documentation endpoint (/doc)
  try {
    const docRes = await fetch(`${cleanBase}/doc`, {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(3000)
    });
    if (docRes.ok) {
      return {
        ok: true,
        message: `Connected to native OpenCode daemon ("opencode serve" active at ${cleanBase})`
      };
    }
  } catch {}

  // 3. Try native OpenCode /session endpoint
  try {
    const sessionRes = await fetch(`${cleanBase}/session`, {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(3000)
    });
    if (sessionRes.ok || sessionRes.status === 405) {
      return {
        ok: true,
        message: `Connected to native OpenCode daemon at ${cleanBase}`
      };
    }
  } catch {}

  return {
    ok: false,
    message: `Cannot reach OpenCode at ${baseUrl}. Ensure "opencode serve" is running in your terminal.`
  };
}

/**
 * Calls OpenCode to generate content.
 * Resiliently handles:
 * 1. OpenAI-compatible /v1/chat/completions (Ollama, vLLM, LiteLLM, proxies)
 * 2. Native `opencode serve` CLI daemon REST API (POST /session -> POST /session/:id/message)
 */
export async function callOpenCode(
  prompt: string,
  opts: {
    json?: boolean;
    maxOutputTokens?: number;
    temperature?: number;
    model?: string;
    systemPrompt?: string;
  } = {}
): Promise<string | null> {
  const cfg = getOpenCodeConfig();
  const cleanBase = cfg.baseUrl.replace(/\/v1\/?$/, '').replace(/\/$/, '');
  const modelToUse = opts.model || cfg.model || DEFAULT_OPENCODE_MODEL;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (cfg.apiKey) {
    headers['Authorization'] = `Bearer ${cfg.apiKey}`;
  }

  // ── Attempt 1: OpenAI-compatible /chat/completions ─────────────────────────
  const openAiEndpoint = cfg.baseUrl.endsWith('/v1')
    ? `${cfg.baseUrl}/chat/completions`
    : `${cfg.baseUrl}/v1/chat/completions`;

  try {
    const messages = [];
    if (opts.systemPrompt) {
      messages.push({ role: 'system', content: opts.systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const bodyPayload: Record<string, any> = {
      model: modelToUse,
      messages,
      temperature: opts.temperature ?? 0.3,
      max_tokens: opts.maxOutputTokens ?? 4096,
      stream: false
    };

    if (opts.json) {
      bodyPayload.response_format = { type: 'json_object' };
    }

    const response = await fetch(openAiEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(bodyPayload),
      signal: AbortSignal.timeout(60000)
    });

    if (response.ok) {
      const data = await response.json();
      const choice = data?.choices?.[0];
      const content = choice?.message?.content || choice?.text || '';
      if (content) return String(content).trim();
    }
  } catch (err: any) {
    // Fall through to native opencode serve attempt
  }

  // ── Attempt 2: Native OpenCode CLI Daemon (POST /session -> /message) ───────
  try {
    // Step A: Create session
    const createRes = await fetch(`${cleanBase}/session`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ title: 'ExamPilot MCQ Generation' }),
      signal: AbortSignal.timeout(10000)
    });

    if (createRes.ok) {
      const sessionData = await createRes.json();
      const sessionId = sessionData?.id || sessionData?.session?.id;

      if (sessionId) {
        // Step B: Send prompt to session
        const msgRes = await fetch(`${cleanBase}/session/${sessionId}/message`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            parts: [{ type: 'text', text: prompt }]
          }),
          signal: AbortSignal.timeout(60000)
        });

        if (msgRes.ok) {
          const msgData = await msgRes.json();
          const parts = msgData?.parts || msgData?.message?.parts || [];
          const textParts = parts
            .filter((p: any) => p?.type === 'text' || typeof p?.text === 'string')
            .map((p: any) => p.text)
            .join('\n')
            .trim();

          if (textParts) return textParts;
          if (typeof msgData === 'string') return msgData;
          if (msgData?.content) return String(msgData.content).trim();
        }
      }
    }
  } catch (err: any) {
    console.warn('[OpenCode Service] Native daemon call attempt failed:', err);
  }

  throw new Error(
    `Cannot reach OpenCode at ${cfg.baseUrl}. Please run "opencode serve" in your terminal, verify the port, or use "Offline Generate".`
  );
}
