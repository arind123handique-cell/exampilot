import React, { useCallback, useEffect, useState } from 'react';
import {
  Cpu,
  Key,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import {
  AI_PROVIDERS,
  AI_PROVIDER_IDS,
  getCredentialStore,
  saveCredential,
  forgetCredential,
  setActiveProvider,
  maskKey,
  listProviderModels,
  pushCredentialToAccount,
  pullCredentialFromAccount,
  type AiProviderId,
  type AiCredentialStore
} from '../../services/aiCredentials';
import { callOpenAiCompat } from '../../services/openAiCompatClient';
import { hasLiveAi, providerLabel } from '../../services/aiProvider';

interface Props {
  userId?: string;
}

/**
 * Lets a student point the AI features at their own provider and key.
 *
 * The key is stored in this browser first and only pushed to their account when
 * they are signed in, so the app still works offline and a student on a shared
 * computer is not silently writing secrets to a database. What the panel is
 * careful about:
 *
 *  - A saved key is never rendered back in full, only masked with its last four
 *    characters, so a screenshot of the profile page leaks nothing usable.
 *  - Saving is not the same as verifying. "Test connection" makes one real call
 *    and reports what the provider actually said, because a key that looks fine
 *    and a key that works are different claims.
 *  - The model list is fetched from the provider rather than hardcoded. The
 *    suggested lists go stale, and a retired model name fails in a way that
 *    looks like "AI is broken".
 */
export const StudentAiSettings: React.FC<Props> = ({ userId }) => {
  const [store, setStore] = useState<AiCredentialStore>(() => getCredentialStore());
  const [selected, setSelected] = useState<AiProviderId>(() => getCredentialStore().activeProvider);
  const [keyInput, setKeyInput] = useState('');
  const [modelInput, setModelInput] = useState('');
  const [remoteModels, setRemoteModels] = useState<string[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<{ kind: 'success' | 'error'; message: string } | null>(null);
  const [syncing, setSyncing] = useState(false);

  const descriptor = AI_PROVIDERS[selected];
  const savedEntry = store.entries[selected];

  // A saved key is shown masked only; the field starts empty so the plaintext
  // never sits in the DOM after a re-render.
  useEffect(() => {
    setKeyInput('');
    setModelInput(savedEntry?.model ?? '');
    setRemoteModels([]);
    setStatus(null);
  }, [selected, savedEntry?.model]);

  // Pull any keys this student saved on another device, once, when signed in.
  useEffect(() => {
    let cancelled = false;
    if (!userId) return;
    pullCredentialFromAccount(userId)
      .then((changed) => {
        if (!cancelled && changed) setStore(getCredentialStore());
      })
      .catch(() => {
        // Offline or signed out — the local copy is authoritative.
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const handleLoadModels = useCallback(async () => {
    const key = keyInput.trim() || savedEntry?.apiKey || '';
    if (!key) {
      setStatus({ kind: 'error', message: 'Enter a key first, then load the models it can reach.' });
      return;
    }
    setLoadingModels(true);
    setStatus(null);
    const result = await listProviderModels(selected, key);
    setLoadingModels(false);
    if (result.error) {
      setStatus({ kind: 'error', message: result.error });
      return;
    }
    setRemoteModels(result.models);
    if (!modelInput && result.models.length) setModelInput(result.models[0]);
    setStatus({ kind: 'success', message: `${result.models.length} models available.` });
  }, [keyInput, savedEntry?.apiKey, selected, modelInput]);

  const handleTest = useCallback(async () => {
    const key = keyInput.trim() || savedEntry?.apiKey || '';
    const model = modelInput.trim() || savedEntry?.model || '';
    if (!key) {
      setStatus({ kind: 'error', message: 'Enter an API key to test.' });
      return;
    }
    if (descriptor.kind === 'gemini') {
      setStatus({
        kind: 'success',
        message: 'Gemini keys are verified when you save — switch to Save & test to check it.'
      });
      return;
    }
    if (!model) {
      setStatus({ kind: 'error', message: 'Pick a model first.' });
      return;
    }
    setTesting(true);
    setStatus(null);
    const result = await callOpenAiCompat({
      provider: selected,
      apiKey: key,
      model,
      messages: [{ role: 'user', content: 'Reply with the single word OK.' }],
      maxTokens: 16
    });
    setTesting(false);
    if (result.error) {
      setStatus({ kind: 'error', message: result.error });
      return;
    }
    setStatus({ kind: 'success', message: `Connected — ${descriptor.label} answered on ${result.model}.` });
  }, [keyInput, savedEntry?.apiKey, savedEntry?.model, modelInput, selected, descriptor]);

  const handleSave = useCallback(async () => {
    const key = keyInput.trim();
    if (!key && !savedEntry) {
      setStatus({ kind: 'error', message: 'Enter an API key to save.' });
      return;
    }
    const next = saveCredential({
      provider: selected,
      apiKey: key || savedEntry!.apiKey,
      model: modelInput.trim() || savedEntry?.model || '',
      makeActive: true
    });
    setStore(next);
    setKeyInput('');

    if (userId) {
      setSyncing(true);
      await pushCredentialToAccount(userId).catch(() => false);
      setSyncing(false);
    }
    setStatus({ kind: 'success', message: `${descriptor.label} saved and set as your AI provider.` });
  }, [keyInput, modelInput, savedEntry, selected, descriptor, userId]);

  const handleForget = useCallback(async () => {
    const next = forgetCredential(selected);
    setStore(next);
    setKeyInput('');
    setModelInput('');
    setStatus({ kind: 'success', message: `${descriptor.label} key removed from this device.` });
    if (userId) {
      setSyncing(true);
      await pushCredentialToAccount(userId).catch(() => false);
      setSyncing(false);
    }
  }, [selected, descriptor, userId]);

  const handleActivate = useCallback((id: AiProviderId) => {
    const next = setActiveProvider(id);
    setStore(next);
  }, []);

  const modelOptions = remoteModels.length
    ? remoteModels
    : descriptor.suggestedModels;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-line bg-card p-4 sm:p-5 shadow-card">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-display text-sm font-bold text-ink">Your AI provider</h3>
            <p className="mt-0.5 text-xs leading-relaxed text-muted">
              Use your own API key for the AI tutor, question deep dives and mock generation. Your key is
              stored in this browser and, when you are signed in, in your own account — never shared with
              other students.
            </p>
            <p className="mt-2 text-[11px] font-medium text-ink-soft">
              Currently answering:{' '}
              <span className="text-primary">{hasLiveAi() ? providerLabel() : 'offline built-in engine'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Provider picker */}
      <div className="grid gap-2 sm:grid-cols-2">
        {AI_PROVIDER_IDS.map((id) => {
          const p = AI_PROVIDERS[id];
          const entry = store.entries[id];
          const isActive = store.activeProvider === id && entry;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setSelected(id)}
              className={`rounded-xl border p-3 text-left transition ${
                selected === id
                  ? 'border-primary bg-primary/5'
                  : 'border-line bg-card hover:border-line-strong'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-ink">{p.label}</span>
                {isActive ? (
                  <span className="rounded-full bg-success-surface px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-success-text">
                    Active
                  </span>
                ) : entry ? (
                  <span className="rounded-full bg-subtle px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-muted">
                    Saved
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-[10.5px] leading-relaxed text-muted">{p.freeTierNote}</p>
              {entry ? (
                <p className="mt-1.5 font-mono text-[10px] text-muted-faint">
                  {maskKey(entry.apiKey)}
                  {entry.model ? ` · ${entry.model}` : ''}
                </p>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Key + model */}
      <div className="rounded-2xl border border-line bg-card p-4 sm:p-5 shadow-card space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-ink">
            {descriptor.label} API key
          </label>
          <div className="relative">
            <Key className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-faint" />
            <input
              type="password"
              value={keyInput}
              onChange={(e) => {
                setKeyInput(e.target.value);
                setStatus(null);
              }}
              placeholder={savedEntry ? maskKey(savedEntry.apiKey) : descriptor.keyPlaceholder}
              autoComplete="off"
              spellCheck={false}
              className="w-full rounded-xl border border-line bg-raised py-2.5 pl-9 pr-3.5 font-mono text-xs text-ink placeholder:font-sans placeholder:text-muted-faint focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-faint">
              {savedEntry ? 'Leave blank to keep the saved key.' : 'Stored only for your account.'}
            </span>
            <a
              href={descriptor.signupUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              Get a key <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-ink">Model</label>
          <div className="flex flex-col gap-2 sm:flex-row">
            {modelOptions.length > 0 ? (
              <select
                value={modelInput}
                onChange={(e) => {
                  setModelInput(e.target.value);
                  setStatus(null);
                }}
                className="rounded-xl border border-line bg-raised px-2.5 py-2 text-xs font-medium text-ink focus:border-primary focus:outline-none"
              >
                <option value="">Select a model…</option>
                {modelOptions.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
                {modelInput && !modelOptions.includes(modelInput) ? (
                  <option value={modelInput}>{modelInput}</option>
                ) : null}
              </select>
            ) : null}
            <input
              type="text"
              value={modelInput}
              onChange={(e) => {
                setModelInput(e.target.value);
                setStatus(null);
              }}
              placeholder="e.g. google/gemini-2.5-flash"
              spellCheck={false}
              className="flex-1 rounded-xl border border-line bg-raised px-3 py-2 font-mono text-xs text-ink placeholder:font-sans placeholder:text-muted-faint focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
            {descriptor.kind !== 'gemini' ? (
              <button
                type="button"
                onClick={handleLoadModels}
                disabled={loadingModels}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-line px-3 py-2 text-xs font-semibold text-ink-soft transition hover:border-line-strong hover:text-ink disabled:opacity-60"
              >
                {loadingModels ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                Load models
              </button>
            ) : null}
          </div>
          <p className="text-[10px] leading-relaxed text-muted">
            {descriptor.kind === 'gemini'
              ? 'Models are provided by Google. If a model is retired the app falls back to the next one.'
              : 'Model names change often, so “Load models” asks the provider what it actually serves instead of trusting a built-in list.'}
          </p>
        </div>

        {status ? (
          <div
            className={`flex items-start gap-2 rounded-xl border p-3 text-xs ${
              status.kind === 'success'
                ? 'border-success-border bg-success-surface text-success-text'
                : 'border-danger-border bg-danger-surface text-danger-text'
            }`}
          >
            {status.kind === 'success' ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            )}
            <span>{status.message}</span>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          {savedEntry ? (
            <button
              type="button"
              onClick={() => handleActivate(selected)}
              disabled={store.activeProvider === selected}
              className="inline-flex items-center gap-1.5 rounded-xl border border-line px-3 py-2.5 text-xs font-semibold text-ink transition hover:border-line-strong disabled:opacity-50"
            >
              <Cpu className="h-3.5 w-3.5" />
              {store.activeProvider === selected ? 'In use' : 'Use this provider'}
            </button>
          ) : null}
          {savedEntry ? (
            <button
              type="button"
              onClick={handleForget}
              className="inline-flex items-center gap-1.5 rounded-xl border border-line px-3 py-2.5 text-xs font-semibold text-muted transition hover:border-danger-border hover:text-danger-text"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove key
            </button>
          ) : null}
          <div className="flex-1" />
          <button
            type="button"
            onClick={handleTest}
            disabled={testing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-primary/40 px-4 py-2.5 text-xs font-semibold text-primary transition hover:bg-primary/5 disabled:opacity-60"
          >
            {testing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Test connection
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={syncing}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-primary-dark disabled:opacity-60"
          >
            {syncing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Save &amp; use
          </button>
        </div>
      </div>

      <div className="flex items-start gap-2.5 rounded-xl border border-line bg-subtle/40 p-3.5">
        <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
        <p className="text-[11px] leading-relaxed text-muted">
          Calls go straight from your browser to {descriptor.label}. This app never proxies them, so your key
          is only ever seen by the provider you chose. Removing the key deletes it from this device and from
          your account.
        </p>
      </div>
    </div>
  );
};

export default StudentAiSettings;
