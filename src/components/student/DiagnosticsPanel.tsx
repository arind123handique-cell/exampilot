import React, { useEffect, useMemo, useState } from 'react';
import { Activity, AlertCircle, AlertTriangle, Info, Trash2, Copy, Check } from 'lucide-react';
import {
  subscribeDiagnostics,
  clearDiagnostics,
  exportDiagnostics,
  countByLevel,
  type DiagnosticEvent,
  type DiagnosticLevel
} from '../../services/appDiagnostics';

const LEVEL_META: Record<DiagnosticLevel, { icon: React.ElementType; label: string; className: string }> = {
  error: { icon: AlertCircle, label: 'Failures', className: 'text-danger-text bg-danger-surface border-danger-border' },
  warn: { icon: AlertTriangle, label: 'Warnings', className: 'text-warning-text bg-warning-surface border-warning-border' },
  info: { icon: Info, label: 'Steps', className: 'text-muted bg-subtle border-line' }
};

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('en-GB', { hour12: false });
  } catch {
    return iso;
  }
}

/**
 * A readable list of everything that has gone wrong in this session.
 *
 * This exists because the data layer is deliberately quiet: `supabaseDocStore`,
 * `geminiService` and `aiIngestionService` all fall back to an offline engine
 * rather than interrupt the student, which is right for them but means a broken
 * integration used to leave nothing but a console line. The events here are
 * also what a useful bug report needs, so there is a copy button rather than a
 * screenshot.
 */
export const DiagnosticsPanel: React.FC = () => {
  const [events, setEvents] = useState<DiagnosticEvent[]>([]);
  const [filter, setFilter] = useState<DiagnosticLevel | 'all'>('all');
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => subscribeDiagnostics(setEvents), []);

  const shown = useMemo(
    () => (filter === 'all' ? events : events.filter((e) => e.level === filter)),
    [events, filter]
  );

  const errors = countByLevel('error');
  const warns = countByLevel('warn');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportDiagnostics());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be blocked; the JSON is still visible below.
    }
  };

  return (
    <div className="rounded-2xl border border-line bg-card p-4 sm:p-5 shadow-card space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-ink">Diagnostics</h3>
            <p className="mt-0.5 text-xs text-muted">
              Everything that failed this session, newest first. Copy it into a bug report.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!events.length}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[11px] font-semibold text-ink-soft transition hover:border-line-strong hover:text-ink disabled:opacity-50"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-success-text" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy log'}
          </button>
          <button
            type="button"
            onClick={clearDiagnostics}
            disabled={!events.length}
            aria-label="Clear diagnostics"
            className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[11px] font-semibold text-muted transition hover:border-danger-border hover:text-danger-text disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {(['all', 'error', 'warn', 'info'] as const).map((key) => {
          const active = filter === key;
          const count =
            key === 'all' ? events.length : key === 'error' ? errors : key === 'warn' ? warns : countByLevel('info');
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide transition ${
                active ? 'bg-primary text-white' : 'bg-subtle text-muted hover:text-ink'
              }`}
            >
              {key === 'all' ? 'All' : LEVEL_META[key].label} · {count}
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line px-4 py-8 text-center">
          <p className="text-xs font-semibold text-ink-soft">
            {events.length ? 'Nothing at this level' : 'No failures recorded'}
          </p>
          <p className="mt-1 text-[11px] text-muted">
            {events.length
              ? 'Switch the filter to see other events.'
              : 'If something misbehaves, it will show up here.'}
          </p>
        </div>
      ) : (
        <ul className="max-h-96 space-y-1.5 overflow-y-auto pr-1">
          {shown.map((event) => {
            const meta = LEVEL_META[event.level];
            const Icon = meta.icon;
            const isOpen = expanded === event.id;
            return (
              <li key={event.id}>
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : event.id)}
                  className="flex w-full items-start gap-2.5 rounded-xl border border-line bg-raised px-3 py-2.5 text-left transition hover:border-line-strong"
                >
                  <span className={`mt-0.5 rounded-md border px-1.5 py-0.5 ${meta.className}`}>
                    <Icon className="h-3 w-3" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate font-mono text-[11px] font-semibold text-ink">{event.scope}</span>
                      <span className="shrink-0 font-mono text-[10px] text-muted-faint">{formatTime(event.at)}</span>
                    </span>
                    <span className="mt-0.5 block break-words text-[11.5px] text-ink-soft">{event.message}</span>
                    {isOpen && event.detail ? (
                      <pre className="mt-2 overflow-x-auto rounded-lg bg-canvas p-2 font-mono text-[10px] leading-relaxed text-muted">
                        {JSON.stringify(event.detail, null, 2)}
                      </pre>
                    ) : null}
                    {isOpen && event.stack ? (
                      <pre className="mt-2 max-h-40 overflow-auto rounded-lg bg-canvas p-2 font-mono text-[10px] leading-relaxed text-muted-faint">
                        {event.stack}
                      </pre>
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-[10.5px] leading-relaxed text-muted-faint">
        Stays in this browser tab and is cleared on reload. Nothing is uploaded anywhere.
      </p>
    </div>
  );
};

export default DiagnosticsPanel;
