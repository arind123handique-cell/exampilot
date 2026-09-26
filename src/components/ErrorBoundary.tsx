import React from 'react';
import { reportFailure } from '../services/appDiagnostics';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  info?: string;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // A crash unmounts the whole tree, so this is the only place it can be
    // recorded — the Diagnostics panel itself is gone at this point.
    reportFailure('react.ErrorBoundary', error, {
      componentStack: (info.componentStack || '').split('\n').slice(0, 12).join(' | ')
    });
    this.setState({ info: info.componentStack || undefined });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-canvas p-6 text-ink">
          <div className="mx-auto max-w-2xl rounded-2xl border border-danger-border bg-danger-surface p-6">
            <h1 className="font-display text-lg font-bold text-danger-text">Something went wrong</h1>
            <p className="mt-2 text-xs text-danger-text/80">{this.state.error?.message}</p>
            <pre className="mt-4 max-h-64 overflow-auto rounded-xl bg-card p-3 text-[11px] font-mono text-ink">
              {this.state.error?.stack}
              {this.state.info}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-xl bg-danger px-4 py-2 text-xs font-semibold text-white"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
