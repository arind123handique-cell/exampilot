import React, { useState } from 'react';
import { Sparkles, Key, CheckCircle2, AlertCircle, X, ExternalLink, Loader2, Cpu } from 'lucide-react';
import {
  getGeminiApiKey,
  setGeminiApiKey,
  callGemini,
  getSavedGeminiModel,
  setGeminiModel,
  DEFAULT_GEMINI_MODELS,
  cleanModelName
} from '../../services/geminiService';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved?: () => void;
}

export const GeminiKeyModal: React.FC<Props> = ({ isOpen, onClose, onKeySaved }) => {
  const [keyInput, setKeyInput] = useState(() => getGeminiApiKey());
  const [modelInput, setModelInput] = useState(() => getSavedGeminiModel());
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const trapRef = useFocusTrap(isOpen);

  if (!isOpen) return null;

  const handleSave = async () => {
    const trimmed = keyInput.trim();
    const cleanModel = cleanModelName(modelInput) || DEFAULT_GEMINI_MODELS[0];
    setGeminiApiKey(trimmed);
    setGeminiModel(cleanModel);

    if (!trimmed) {
      setStatus('idle');
      onKeySaved?.();
      onClose();
      return;
    }

    setTesting(true);
    setStatus('idle');
    setErrorMsg('');

    try {
      const res = await callGemini(
        trimmed,
        'Respond with the single word "OK" in JSON format: {"status": "OK"}',
        { json: true, maxOutputTokens: 60, specificModel: cleanModel }
      );

      if (res && res.includes('OK')) {
        setStatus('success');
        onKeySaved?.();
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setStatus('error');
        setErrorMsg(`API responded, but verification on model "${cleanModel}" failed. Key may have restricted permissions.`);
      }
    } catch (e: any) {
      setStatus('error');
      setErrorMsg(e?.message || 'Connection failed. Please check the API key.');
    } finally {
      setTesting(false);
    }
  };

  const handleClear = () => {
    setKeyInput('');
    setGeminiApiKey('');
    setStatus('idle');
    onKeySaved?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div
        ref={trapRef as any}
        className="w-full max-w-md rounded-2xl border border-line bg-card p-6 shadow-pop space-y-5 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display font-bold text-ink flex items-center gap-1.5">
                <span>AI Gemini 3.8 Flash</span>
                <span className="rounded bg-primary-fixed px-1.5 py-0.2 text-[9px] font-bold text-primary">
                  PRO
                </span>
              </div>
              <p className="text-xs text-muted">Intelligent Question Arrangement Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-subtle hover:text-ink transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs leading-relaxed text-ink-soft">
          Gemini 3.8 Flash analyzes difficulty, reading density, and question formats to sequence your mock tests into an optimal exam cadence with cognitive pacing and domain interleaving.
        </p>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-ink">
            Google Gemini API Key
          </label>
          <div className="relative">
            <Key className="absolute left-3 top-3 h-4 w-4 text-muted-faint" />
            <input
              type="password"
              value={keyInput}
              onChange={(e) => {
                setKeyInput(e.target.value);
                setStatus('idle');
              }}
              placeholder="AIzaSy..."
              className="w-full rounded-xl border border-line bg-raised pl-9 pr-3.5 py-2.5 text-xs text-ink font-mono placeholder:text-muted-faint focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>
          <div className="flex items-center justify-end text-[11px] text-muted">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              Get free key <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-ink flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-primary" />
            <span>Gemini Model</span>
          </label>
          <div className="flex gap-2">
            <select
              value={DEFAULT_GEMINI_MODELS.includes(cleanModelName(modelInput)) ? cleanModelName(modelInput) : 'custom'}
              onChange={e => {
                if (e.target.value !== 'custom') {
                  setModelInput(e.target.value);
                  setStatus('idle');
                }
              }}
              className="rounded-xl border border-line bg-raised px-2.5 py-2 text-xs font-medium text-ink focus:border-primary focus:outline-none"
            >
              {DEFAULT_GEMINI_MODELS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
              <option value="custom">Custom Model...</option>
            </select>
            <input
              type="text"
              value={modelInput}
              onChange={e => {
                setModelInput(e.target.value);
                setStatus('idle');
              }}
              placeholder="e.g. gemini-3.5-flash-lite"
              className="flex-1 rounded-xl border border-line bg-raised px-3 py-2 text-xs text-ink font-mono focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>
          <p className="text-[10px] text-muted">
            Accepts <code className="text-primary font-mono font-semibold">gemini-3.5-flash-lite</code>, <code className="text-primary font-mono font-semibold">models/gemini-3.5-flash-lite</code>, 2.5-flash, etc. Leading <code className="font-mono">models/</code> is automatically handled.
          </p>
        </div>

        {status === 'success' && (
          <div className="flex items-center gap-2 rounded-xl border border-success-border bg-success-surface p-3 text-xs text-success-text">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            <span>{cleanModelName(modelInput) || 'Gemini'} verified &amp; connected successfully!</span>
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-start gap-2 rounded-xl border border-danger-border bg-danger-surface p-3 text-xs text-danger-text">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex items-center gap-2 pt-1">
          {keyInput && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-xl border border-line px-3 py-2.5 text-xs font-medium text-muted hover:border-line-strong hover:text-ink transition"
            >
              Clear
            </button>
          )}
          <div className="flex-1" />
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-line bg-raised px-4 py-2.5 text-xs font-semibold text-ink hover:bg-subtle transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={testing}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white transition hover:bg-primary-dark disabled:opacity-60 shadow-xs"
          >
            {testing ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Verifying…
              </>
            ) : (
              'Save & Verify'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
