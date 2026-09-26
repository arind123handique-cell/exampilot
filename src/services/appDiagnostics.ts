/**
 * APP DIAGNOSTICS
 *
 * One place every failure in the app is recorded, so "something broke somewhere"
 * becomes a list you can actually read instead of a toast that scrolled away.
 *
 * The problem this solves is specific. `geminiService`, `supabaseDocStore` and
 * `aiIngestionService` all swallow errors on purpose — they are best-effort and
 * fall back to an offline engine, which is right for the user but means a
 * failure leaves almost no trace. Several of those traces were console-only.
 * This module is where they go instead, alongside the errors nobody catches at
 * all: unhandled promise rejections and `window.onerror`.
 *
 * Nothing is sent anywhere. Events live in a bounded in-memory ring buffer, so
 * a page reload clears them and no student data leaves the browser.
 */

export type DiagnosticLevel = 'info' | 'warn' | 'error';

export interface DiagnosticEvent {
  id: number;
  at: string;
  level: DiagnosticLevel;
  /** Where it came from, e.g. 'pdf.parse' or 'supabase.app_docs'. */
  scope: string;
  message: string;
  /** Extra fields. Never store a file body or an API key here. */
  detail?: Record<string, unknown>;
  stack?: string;
}

const MAX_EVENTS = 300;
const listeners = new Set<(events: DiagnosticEvent[]) => void>();

let events: DiagnosticEvent[] = [];
let nextId = 1;
let installed = false;

/** Keeps a detail object printable without ever throwing on a circular ref. */
function safeDetail(detail?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!detail) return undefined;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(detail)) {
    if (v === undefined) continue;
    if (typeof v === 'function') continue;
    out[k] = typeof v === 'object' ? safeStringify(v) : v;
  }
  return Object.keys(out).length ? out : undefined;
}

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value)?.slice(0, 300) ?? String(value);
  } catch {
    return '[unserialisable]';
  }
}

function push(event: Omit<DiagnosticEvent, 'id' | 'at'>): DiagnosticEvent {
  const full: DiagnosticEvent = {
    id: nextId++,
    at: new Date().toISOString(),
    ...event
  };
  // Newest first: the failure you just hit should be at the top.
  events = [full, ...events].slice(0, MAX_EVENTS);

  const line = `[${full.level.toUpperCase()}] ${full.scope}: ${full.message}`;
  if (full.level === 'error') console.error(line, full.detail ?? '');
  else if (full.level === 'warn') console.warn(line, full.detail ?? '');
  else console.info(line, full.detail ?? '');

  listeners.forEach((fn) => {
    try {
      fn(events);
    } catch {
      // A broken listener must never break the app.
    }
  });
  return full;
}

export function logEvent(
  scope: string,
  message: string,
  detail?: Record<string, unknown>
): DiagnosticEvent {
  return push({ level: 'info', scope, message, detail: safeDetail(detail) });
}

export function logWarn(
  scope: string,
  message: string,
  detail?: Record<string, unknown>
): DiagnosticEvent {
  return push({ level: 'warn', scope, message, detail: safeDetail(detail) });
}

/**
 * Records a failure. Safe to call from a catch block with anything — a string,
 * an Error, or an unknown throwable — and safe to call with no arguments.
 */
export function reportFailure(
  scope: string,
  error?: unknown,
  detail?: Record<string, unknown>
): DiagnosticEvent {
  let message = 'Unknown failure';
  let stack: string | undefined;

  if (error instanceof Error) {
    message = error.message || error.name || 'Error';
    stack = error.stack;
  } else if (typeof error === 'string' && error.trim()) {
    message = error.trim();
  } else if (error && typeof error === 'object') {
    const e = error as { message?: unknown; status?: unknown; name?: unknown };
    message =
      (typeof e.message === 'string' && e.message) ||
      (typeof e.name === 'string' && e.name) ||
      safeStringify(error);
    if (typeof e.status === 'number') detail = { ...detail, httpStatus: e.status };
  } else if (error !== undefined && error !== null) {
    message = safeStringify(error);
  }

  return push({ level: 'error', scope, message, detail: safeDetail(detail), stack });
}

/* ------------------------------------------------------------ subscribers */

export function getDiagnostics(): DiagnosticEvent[] {
  return events;
}

export function subscribeDiagnostics(fn: (events: DiagnosticEvent[]) => void): () => void {
  listeners.add(fn);
  // The immediate first call is guarded too. Without this a subscriber that
  // throws would escape subscribeDiagnostics itself, taking down the caller
  // rather than just being skipped.
  try {
    fn(events);
  } catch {
    /* a broken listener must never break the app */
  }
  return () => {
    listeners.delete(fn);
  };
}

export function clearDiagnostics(): void {
  events = [];
  listeners.forEach((fn) => {
    try {
      fn(events);
    } catch {
      /* ignore */
    }
  });
}

export function countByLevel(level: DiagnosticLevel): number {
  return events.filter((e) => e.level === level).length;
}

/** JSON suitable for pasting into a bug report. */
export function exportDiagnostics(): string {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      counts: {
        error: countByLevel('error'),
        warn: countByLevel('warn'),
        info: countByLevel('info')
      },
      events
    },
    null,
    2
  );
}

/* --------------------------------------------------------- global capture */

/**
 * Wires the two things nobody can catch by hand: uncaught exceptions and
 * unhandled promise rejections. Idempotent, so it is safe to call from
 * StrictMode's double-invoked effects.
 */
export function installGlobalDiagnostics(): void {
  if (installed || typeof window === 'undefined') return;
  installed = true;

  window.addEventListener('error', (event) => {
    reportFailure('window.onerror', event.error ?? event.message, {
      source: event.filename,
      line: event.lineno,
      column: event.colno
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    reportFailure('window.unhandledrejection', event.reason, {
      // A rejection with no reason is itself worth seeing.
      emptyReason: event.reason === undefined || event.reason === null
    });
  });
}
