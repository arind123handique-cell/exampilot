import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, AlertTriangle, Info, X, AlertCircle } from 'lucide-react';
import { cx } from '../utils/cn';

type ToastTone = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  tone: ToastTone;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  push: (toast: Omit<Toast, 'id'>) => string;
  dismiss: (id: string) => void;
  success: (title: string, description?: string) => string;
  error: (title: string, description?: string) => string;
  info: (title: string, description?: string) => string;
  warning: (title: string, description?: string) => string;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TONE_ICON: Record<ToastTone, React.ReactNode> = {
  success: <CheckCircle2 className="h-4 w-4 flex-shrink-0" />,
  error: <AlertCircle className="h-4 w-4 flex-shrink-0" />,
  warning: <AlertTriangle className="h-4 w-4 flex-shrink-0" />,
  info: <Info className="h-4 w-4 flex-shrink-0" />,
};

const TONE_CLASS: Record<ToastTone, string> = {
  success: 'border-success-border bg-success-surface text-success-text',
  error: 'border-danger-border bg-danger-surface text-danger-text',
  warning: 'border-warning-border bg-warning-surface text-warning-text',
  info: 'border-primary-fixed-dim bg-primary-fixed text-primary',
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const entry: Toast = { ...toast, id, duration: toast.duration ?? (toast.tone === 'error' ? 5000 : 3500) };
      setToasts((prev) => [...prev, entry]);
      if (entry.duration && entry.duration > 0) {
        window.setTimeout(() => dismiss(id), entry.duration);
      }
      return id;
    },
    [dismiss]
  );

  const success = useCallback((title: string, description?: string) => push({ tone: 'success', title, description }), [push]);
  const error = useCallback((title: string, description?: string) => push({ tone: 'error', title, description }), [push]);
  const info = useCallback((title: string, description?: string) => push({ tone: 'info', title, description }), [push]);
  const warning = useCallback((title: string, description?: string) => push({ tone: 'warning', title, description }), [push]);

  return (
    <ToastContext.Provider value={{ toasts, push, dismiss, success, error, info, warning }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

const ToastViewport: React.FC<{ toasts: Toast[]; onDismiss: (id: string) => void }> = ({ toasts, onDismiss }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Announce to screen readers via aria-live region
  const node = (
    <div
      aria-live="polite"
      aria-relevant="additions"
      className="pointer-events-none fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-[80] flex flex-col items-center gap-2 px-4 sm:bottom-4 sm:items-end sm:px-6"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={cx(
            'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border p-3.5 shadow-pop backdrop-blur animate-fadeIn',
            TONE_CLASS[toast.tone]
          )}
        >
          <span className="mt-0.5">{TONE_ICON[toast.tone]}</span>
          <div className="min-w-0 flex-1 space-y-0.5">
            <p className="text-xs font-semibold leading-snug text-inherit">{toast.title}</p>
            {toast.description && <p className="text-[11px] leading-relaxed opacity-80">{toast.description}</p>}
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
            className="rounded-lg p-1.5 opacity-60 transition hover:bg-black/10 hover:opacity-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );

  if (!mounted) return null;
  return createPortal(node, document.body);
};
