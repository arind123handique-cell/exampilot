/**
 * STUDENT AI CREDENTIALS (bring your own key)
 *
 * A student can point the AI features at whichever provider they already pay
 * for, instead of the app assuming one vendor. This module owns three things
 * that were previously scattered and inconsistent:
 *
 *   1. The provider registry — the single list of who can be used, what their
 *      endpoint is, and what their keys look like. `aiProviderManagement.ts`
 *      already listed OpenAI/Anthropic/Groq/OpenRouter but never made a call to
 *      any of them, so that admin screen was decorative. Anything registered
 *      here is actually wired up in `aiProvider.ts`.
 *   2. Storage — a student's keys, per provider, in localStorage and (when
 *      signed in) their own `app_docs` row.
 *   3. Activation — handing the chosen key to whichever client speaks to that
 *      provider.
 *
 * Model names are NOT hardcoded as the source of truth. This codebase already
 * shipped pinned to `gemini-1.5-flash`; Google retired it and, because the
 * callers fall back to offline engines on failure, the app just silently stopped
 * using AI with no error anywhere. So `suggestedModels` is only a starting
 * point — `listProviderModels()` asks the provider what it actually serves, and
 * the UI always allows a free-text override.
 */

import { getCloudDoc, setCloudDoc, deleteCloudDoc } from './supabaseDocStore';
import { setGeminiApiKey, setGeminiModel } from './geminiService';

export type AiProviderId = 'gemini' | 'openrouter' | 'nvidia' | 'openai' | 'groq';

/**
 * `gemini` has its own client (generativelanguage.googleapis.com, different
 * request shape and multimodal support). Everything else speaks the
 * OpenAI chat-completions dialect, so one client covers all of them.
 */
export type ProviderKind = 'gemini' | 'openai-compatible';

export interface AiProviderDescriptor {
  id: AiProviderId;
  label: string;
  kind: ProviderKind;
  /** OpenAI-compatible base URL ending in /v1. Empty for Gemini. */
  baseUrl: string;
  /** Shown in the input as a hint about the shape of the key. */
  keyPlaceholder: string;
  signupUrl: string;
  /** First suggestions only — the real list comes from the provider. */
  suggestedModels: string[];
  supportsVision: boolean;
  freeTierNote: string;
}

export const AI_PROVIDERS: Record<AiProviderId, AiProviderDescriptor> = {
  gemini: {
    id: 'gemini',
    label: 'Google Gemini',
    kind: 'gemini',
    baseUrl: '',
    keyPlaceholder: 'AIzaSy…',
    signupUrl: 'https://aistudio.google.com/app/apikey',
    suggestedModels: ['gemini-2.5-flash', 'gemini-2.0-flash'],
    supportsVision: true,
    freeTierNote: 'Free tier with a generous rate limit. Also the only provider here that can read an uploaded PDF.'
  },
  openrouter: {
    id: 'openrouter',
    label: 'OpenRouter',
    kind: 'openai-compatible',
    baseUrl: 'https://openrouter.ai/api/v1',
    keyPlaceholder: 'sk-or-v1-…',
    signupUrl: 'https://openrouter.ai/keys',
    suggestedModels: [],
    supportsVision: false,
    freeTierNote: 'One key, hundreds of models. Many carry a ":free" suffix — great for trying an exam paper at no cost.'
  },
  nvidia: {
    id: 'nvidia',
    label: 'NVIDIA NIM',
    kind: 'openai-compatible',
    baseUrl: 'https://integrate.api.nvidia.com/v1',
    keyPlaceholder: 'nvapi-…',
    signupUrl: 'https://build.nvidia.com',
    suggestedModels: [],
    supportsVision: false,
    freeTierNote: 'Free hosted inference across 80+ open models, no card required.'
  },
  openai: {
    id: 'openai',
    label: 'OpenAI',
    kind: 'openai-compatible',
    baseUrl: 'https://api.openai.com/v1',
    keyPlaceholder: 'sk-…',
    signupUrl: 'https://platform.openai.com/api-keys',
    suggestedModels: ['gpt-4o-mini', 'gpt-4o'],
    supportsVision: false,
    freeTierNote: 'Paid — a key needs billing set up before it will answer.'
  },
  groq: {
    id: 'groq',
    label: 'Groq',
    kind: 'openai-compatible',
    baseUrl: 'https://api.groq.com/openai/v1',
    keyPlaceholder: 'gsk_…',
    signupUrl: 'https://console.groq.com/keys',
    suggestedModels: [],
    supportsVision: false,
    freeTierNote: 'Free developer tier, very fast token throughput.'
  }
};

export const AI_PROVIDER_IDS = Object.keys(AI_PROVIDERS) as AiProviderId[];

export interface ProviderEntry {
  apiKey: string;
  model: string;
  updatedAt: string;
}

export interface AiCredentialStore {
  activeProvider: AiProviderId;
  entries: Partial<Record<AiProviderId, ProviderEntry>>;
}

const STORAGE_KEY = 'exampilot_ai_credentials_v1';
/** app_docs collection. Not in the admin-content allow-list, so under the
 *  20260927 RLS policy it is readable/writable only by the owning uid. */
const ACCOUNT_COLLECTION = 'ai_credentials';

function emptyStore(): AiCredentialStore {
  return { activeProvider: 'gemini', entries: {} };
}

function isProviderId(value: unknown): value is AiProviderId {
  return typeof value === 'string' && value in AI_PROVIDERS;
}

/** Drops anything that is not a well-formed entry so a corrupted or
 *  hand-edited localStorage value cannot break the app at startup.
 *  Exported for the test suite, which feeds it hostile input directly. */
export function sanitiseForTest(raw: unknown): AiCredentialStore {
  return sanitise(raw);
}

function sanitise(raw: unknown): AiCredentialStore {
  if (!raw || typeof raw !== 'object') return emptyStore();
  const obj = raw as Partial<AiCredentialStore>;
  const store = emptyStore();
  if (isProviderId(obj.activeProvider)) store.activeProvider = obj.activeProvider;

  const entries = obj.entries;
  if (entries && typeof entries === 'object') {
    for (const id of AI_PROVIDER_IDS) {
      const entry = (entries as Record<string, unknown>)[id];
      if (!entry || typeof entry !== 'object') continue;
      const e = entry as Partial<ProviderEntry>;
      const apiKey = typeof e.apiKey === 'string' ? e.apiKey.trim() : '';
      if (!apiKey) continue;
      store.entries[id] = {
        apiKey,
        model: typeof e.model === 'string' ? e.model.trim() : '',
        updatedAt: typeof e.updatedAt === 'string' ? e.updatedAt : new Date().toISOString()
      };
    }
  }
  return store;
}

export function getCredentialStore(): AiCredentialStore {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    cache = raw ? sanitise(JSON.parse(raw)) : emptyStore();
  } catch {
    cache = emptyStore();
  }
  return cache;
}

/**
 * `hasLiveAi()` and `providerLabel()` are called from render, so the store is
 * read far more often than it changes. Cached, and invalidated on every write.
 */
let cache: AiCredentialStore | null = null;

/** Drops the cached store so the next read comes from localStorage again. */
export function invalidateCredentialCache(): void {
  cache = null;
}

// A key saved in one tab should be honoured in another, not wait for a reload.
if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY || event.key === null) invalidateCredentialCache();
  });
}

function persist(store: AiCredentialStore): void {
  cache = store;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Private mode / quota — the app still works for this session.
  }
}

/**
 * Hands the active key to the client that will use it.
 *
 * Gemini is mirrored into `geminiService` rather than reimplemented: the tutor,
 * deep dive, mock generator and the PDF reader all read the key from there, so
 * one call makes every existing Gemini feature use the student's key instead of
 * an app-level one.
 */
export function activateCredential(store: AiCredentialStore = getCredentialStore()): void {
  const entry = store.entries[store.activeProvider];
  if (store.activeProvider === 'gemini' && entry) {
    setGeminiApiKey(entry.apiKey);
    if (entry.model) setGeminiModel(entry.model);
  }
}

export interface SaveCredentialInput {
  provider: AiProviderId;
  apiKey: string;
  model?: string;
  /** Set false to store the key without switching to it. */
  makeActive?: boolean;
}

export function saveCredential(input: SaveCredentialInput): AiCredentialStore {
  const store = getCredentialStore();
  const apiKey = input.apiKey.trim();
  if (!apiKey) return store;

  store.entries[input.provider] = {
    apiKey,
    model: (input.model ?? '').trim(),
    updatedAt: new Date().toISOString()
  };
  if (input.makeActive !== false) store.activeProvider = input.provider;

  persist(store);
  activateCredential(store);
  return store;
}

export function setActiveProvider(provider: AiProviderId): AiCredentialStore {
  const store = getCredentialStore();
  if (!isProviderId(provider)) return store;
  store.activeProvider = provider;
  persist(store);
  activateCredential(store);
  return store;
}

/** Removes one provider's key from this device (and, separately, the account). */
export function forgetCredential(provider: AiProviderId): AiCredentialStore {
  const store = getCredentialStore();
  delete store.entries[provider];
  if (store.activeProvider === provider) {
    // Fall back to any provider that still has a key, else the Gemini slot so
    // the UI has something sensible selected.
    const next = AI_PROVIDER_IDS.find((id) => store.entries[id]);
    store.activeProvider = next ?? 'gemini';
  }
  persist(store);
  activateCredential(store);
  return store;
}

export function getActiveEntry(): ProviderEntry | null {
  const store = getCredentialStore();
  return store.entries[store.activeProvider] ?? null;
}

export function hasConfiguredKey(provider: AiProviderId): boolean {
  return Boolean(getCredentialStore().entries[provider]?.apiKey);
}

/**
 * Renders a key safe to put on screen: enough to recognise, not enough to use.
 * Anything shorter than 8 characters is fully masked, because a short key would
 * otherwise be exposed by showing its tail.
 */
export function maskKey(key: string): string {
  const trimmed = key.trim();
  if (!trimmed) return '';
  if (trimmed.length <= 8) return '•'.repeat(Math.max(trimmed.length, 6));
  return `${'•'.repeat(8)}${trimmed.slice(-4)}`;
}

/* ------------------------------------------------------------- account sync */

/**
 * Pulls the student's saved keys from their account into this device.
 *
 * Local wins on conflict: a student who just typed a key on this device should
 * not have it silently replaced by a stale copy from another one.
 */
export async function pullCredentialFromAccount(userId: string): Promise<boolean> {
  const remote = await getCloudDoc<AiCredentialStore>(ACCOUNT_COLLECTION, userId);
  if (!remote) return false;
  const incoming = sanitise(remote);
  if (!Object.keys(incoming.entries).length) return false;

  const local = getCredentialStore();
  let changed = false;
  for (const id of AI_PROVIDER_IDS) {
    const remoteEntry = incoming.entries[id];
    if (remoteEntry && !local.entries[id]) {
      local.entries[id] = remoteEntry;
      changed = true;
    }
  }
  if (changed) {
    persist(local);
    activateCredential(local);
  }
  return changed;
}

/** Best-effort push to the account. Failure is not surfaced: the key is already
 *  saved locally, and this is a convenience for cross-device use. */
export async function pushCredentialToAccount(userId: string): Promise<boolean> {
  const store = getCredentialStore();
  if (!Object.keys(store.entries).length) return false;
  return setCloudDoc(ACCOUNT_COLLECTION, userId, store, { userId });
}

export async function removeCredentialFromAccount(userId: string): Promise<boolean> {
  return deleteCloudDoc(ACCOUNT_COLLECTION, userId);
}

/* ------------------------------------------------------------- model lookup */

export interface ModelListResult {
  models: string[];
  error?: string;
}

/**
 * Asks the provider which models it currently serves.
 *
 * The suggested lists above are a convenience only. Providers rename and retire
 * models constantly, and a stale hardcoded name is exactly the failure that
 * made this app look like it had no AI at all.
 */
export async function listProviderModels(
  provider: AiProviderId,
  apiKey: string
): Promise<ModelListResult> {
  const descriptor = AI_PROVIDERS[provider];
  const key = apiKey.trim();
  if (!descriptor || !key) return { models: [], error: 'No API key provided.' };
  if (descriptor.kind === 'gemini') {
    return { models: [...descriptor.suggestedModels] };
  }

  try {
    const res = await fetch(`${descriptor.baseUrl}/models`, {
      method: 'GET',
      headers: buildHeaders(provider, key),
      signal: AbortSignal.timeout(15000)
    });
    if (!res.ok) {
      return { models: [], error: `Provider returned ${res.status}. Check the key.` };
    }
    const body = await res.json();
    const raw: unknown[] = Array.isArray(body?.data) ? body.data : [];
    const models: string[] = raw
      .map((m) => String((m as { id?: unknown })?.id ?? ''))
      .filter((id) => id.length > 0);
    if (!models.length) return { models: [], error: 'Provider returned no models.' };
    // Free tiers first — that is what a student is usually after.
    models.sort((a, b) => Number(b.includes(':free')) - Number(a.includes(':free')));
    return { models };
  } catch (err: any) {
    return { models: [], error: err?.message || 'Could not reach the provider.' };
  }
}

function buildHeaders(provider: AiProviderId, apiKey: string): Record<string, string> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };
  if (provider === 'openrouter') {
    // OpenRouter uses these for dashboard attribution; harmless elsewhere.
    const origin = typeof location !== 'undefined' ? location.origin : '';
    headers['HTTP-Referer'] = origin;
    headers['X-Title'] = 'ExamPilot AI';
  }
  return headers;
}
