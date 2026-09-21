import React, { useState, useEffect, useMemo } from 'react';
import {
  Cpu,
  Sparkles,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  History,
  Eye,
  Trash2,
  RefreshCw,
  ExternalLink,
  Lock,
  Zap,
  Globe,
  Server
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ConfirmationModal } from '../ConfirmationModal';
import {
  getAiProviders,
  saveAiProviderConfig,
  getActiveAiProviderId,
  setActiveAiProvider,
  getAiGenerationHistory,
  clearAiGenerationHistory,
  AiProviderConfig,
  AiProviderType,
  AiGenerationHistoryItem
} from '@/services/aiProviderManagement';
import { useToast } from '@/context/ToastContext';

export const AiManagementSection: React.FC = () => {
  const { success: toastSuccess, error: toastError } = useToast();
  const [providers, setProviders] = useState<Record<AiProviderType, AiProviderConfig>>(() => getAiProviders());
  const [activeProviderId, setActiveProviderId] = useState<AiProviderType>(() => getActiveAiProviderId());
  const [history, setHistory] = useState<AiGenerationHistoryItem[]>(() => getAiGenerationHistory());

  // Key visibility toggles
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [inspectingItem, setInspectingItem] = useState<AiGenerationHistoryItem | null>(null);
  const [isClearHistoryOpen, setIsClearHistoryOpen] = useState(false);

  useEffect(() => {
    const handleHistoryUpdate = () => setHistory(getAiGenerationHistory());
    window.addEventListener('exampilot_ai_history_updated', handleHistoryUpdate);
    return () => window.removeEventListener('exampilot_ai_history_updated', handleHistoryUpdate);
  }, []);

  const handleUpdateProvider = (id: AiProviderType, updates: Partial<AiProviderConfig>) => {
    const current = providers[id];
    const updated = { ...current, ...updates };
    setProviders((prev) => ({ ...prev, [id]: updated }));
    saveAiProviderConfig(updated);
    toastSuccess('Configuration Saved', `${updated.name} settings updated.`);
  };

  const handleSetActive = (id: AiProviderType) => {
    setActiveProviderId(id);
    setActiveAiProvider(id);
    toastSuccess('Primary Engine Updated', `${providers[id].name} is now the primary AI engine.`);
  };

  const handleClearHistory = () => {
    clearAiGenerationHistory();
    setHistory([]);
    setIsClearHistoryOpen(false);
    toastSuccess('History Cleared', 'AI generation logs reset.');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <Card flush className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-primary/20 bg-gradient-to-r from-indigo-950/20 via-card to-card">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-base sm:text-lg text-ink flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" />
              <span>AI Provider & Model Management</span>
            </h2>
            <Badge tone="brand" size="sm">Gemini 3.5 Primary</Badge>
          </div>
          <p className="text-xs text-muted">
            Configure generative models, API keys, and execution parameters. API keys are stored securely in admin storage and never exposed to candidates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge tone="success" size="sm">
            Primary: {providers[activeProviderId]?.name} ({providers[activeProviderId]?.defaultModel})
          </Badge>
        </div>
      </Card>

      {/* Provider Cards Grid */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-xs uppercase text-muted tracking-wider px-1">
          Configured AI Providers ({Object.keys(providers).length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {(Object.keys(providers) as AiProviderType[]).map((pId) => {
            const p = providers[pId];
            const isPrimary = activeProviderId === pId;
            const isVisible = Boolean(showKey[pId]);

            return (
              <Card
                key={pId}
                flush
                className={`p-5 space-y-4 border transition ${
                  isPrimary
                    ? 'border-primary shadow-xs bg-gradient-to-b from-primary/5 to-card'
                    : 'border-line bg-surface hover:border-line-strong'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-bold text-sm text-ink">{p.name}</h4>
                      {isPrimary && <Badge size="sm" tone="brand">Default</Badge>}
                    </div>
                    <p className="text-[11px] text-muted mt-0.5">{p.notes}</p>
                  </div>

                  <button
                    onClick={() => handleSetActive(pId)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${
                      isPrimary
                        ? 'bg-primary text-white shadow-2xs'
                        : 'bg-subtle text-muted hover:text-ink'
                    }`}
                  >
                    {isPrimary ? 'Active Primary' : 'Set as Primary'}
                  </button>
                </div>

                {/* Model Selector */}
                <div className="space-y-1.5 text-xs">
                  <label className="font-semibold text-muted text-[11px]">Selected Model</label>
                  <select
                    value={p.defaultModel}
                    onChange={(e) => handleUpdateProvider(pId, { defaultModel: e.target.value })}
                    className="w-full h-8 px-2.5 rounded-lg border border-line bg-card text-xs text-ink font-mono"
                  >
                    {p.models.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* API Key Input */}
                {pId !== 'ollama' ? (
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-muted text-[11px]">API Key</label>
                      <button
                        type="button"
                        onClick={() => setShowKey({ ...showKey, [pId]: !isVisible })}
                        className="text-[10px] text-primary hover:underline font-medium"
                      >
                        {isVisible ? 'Hide Key' : 'Show Key'}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={isVisible ? 'text' : 'password'}
                        value={p.apiKey}
                        onChange={(e) => handleUpdateProvider(pId, { apiKey: e.target.value })}
                        placeholder={`Enter ${p.name} API Key...`}
                        className="w-full h-8 pl-3 pr-8 rounded-lg border border-line bg-card text-xs text-ink font-mono focus:border-primary focus:outline-none"
                      />
                      <Key className="absolute right-2.5 top-2 w-3.5 h-3.5 text-muted-faint" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5 text-xs">
                    <label className="font-semibold text-muted text-[11px]">Ollama Local Endpoint</label>
                    <input
                      type="text"
                      value={p.endpoint || 'http://127.0.0.1:11434'}
                      onChange={(e) => handleUpdateProvider(pId, { endpoint: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-lg border border-line bg-card text-xs text-ink font-mono"
                    />
                  </div>
                )}

                {/* Status Indicator */}
                <div className="flex items-center justify-between pt-2 border-t border-line text-[11px]">
                  <span className="text-muted-faint">Status:</span>
                  <span className={`font-semibold flex items-center gap-1 ${
                    p.isConfigured ? 'text-success' : 'text-muted'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${p.isConfigured ? 'bg-success' : 'bg-muted'}`} />
                    <span>{p.isConfigured ? 'Configured & Ready' : 'Key Not Set'}</span>
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* AI Generation History Table */}
      <Card flush className="space-y-4 p-5 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-display font-bold text-sm text-ink flex items-center gap-2">
              <History className="w-4 h-4 text-primary" />
              <span>AI Generation & Synthesis History ({history.length})</span>
            </h3>
            <p className="text-[11px] text-muted">
              Complete audit ledger of every question generation request dispatched to AI models.
            </p>
          </div>

          {history.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsClearHistoryOpen(true)}
              iconLeft={<Trash2 className="w-3.5 h-3.5 text-danger" />}
            >
              Clear Logs
            </Button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="py-10 text-center text-xs text-muted border border-dashed rounded-xl space-y-1">
            <Sparkles className="w-6 h-6 text-muted-faint mx-auto" />
            <p className="font-semibold text-ink">No Generation Logs Recorded</p>
            <p className="text-[11px] text-muted-faint">Logs appear here each time a Custom Mock Test is synthesized via AI.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-line bg-subtle/50 text-[10px] font-bold text-muted uppercase tracking-wider">
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3">Subject & Topic</th>
                  <th className="py-3 px-3">Model</th>
                  <th className="py-3 px-3">MCQs</th>
                  <th className="py-3 px-3">Duration</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-subtle/40 transition">
                    <td className="py-3 px-3 text-[11px] text-muted-faint whitespace-nowrap">
                      {new Date(item.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-3 font-semibold text-ink max-w-[200px] truncate">
                      <div>{item.topic}</div>
                      <div className="text-[10px] text-muted-faint font-normal">{item.subject}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-primary">
                      {item.model}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-ink">
                      {item.questionCount}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-muted">
                      {(item.executionTimeMs / 1000).toFixed(1)}s
                    </td>
                    <td className="py-3 px-3">
                      <Badge size="sm" tone={item.status === 'SUCCESS' ? 'success' : 'danger'}>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setInspectingItem(item)}
                        iconLeft={<Eye className="w-3.5 h-3.5" />}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Inspect Item Modal */}
      {inspectingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-3xl rounded-2xl bg-card border border-line shadow-2xl p-6 my-8 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-line">
              <div>
                <Badge tone="brand" size="sm">{inspectingItem.provider} · {inspectingItem.model}</Badge>
                <h3 className="font-display font-bold text-base text-ink mt-1">
                  Generation Log: {inspectingItem.topic}
                </h3>
                <p className="text-xs text-muted">
                  {new Date(inspectingItem.timestamp).toLocaleString()} · Took {(inspectingItem.executionTimeMs / 1000).toFixed(1)}s
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={() => setInspectingItem(null)}>
                Close
              </Button>
            </div>

            {inspectingItem.errorMessage && (
              <div className="p-3 rounded-xl bg-danger/10 border border-danger/20 text-xs text-danger-text">
                <strong>Error:</strong> {inspectingItem.errorMessage}
              </div>
            )}

            {inspectingItem.generatedQuestions.length > 0 ? (
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase text-muted tracking-wider">
                  Generated Questions ({inspectingItem.generatedQuestions.length})
                </h4>
                {inspectingItem.generatedQuestions.map((q, idx) => (
                  <div key={q.id || idx} className="p-3.5 rounded-xl border border-line bg-surface space-y-2 text-xs">
                    <div className="font-bold text-ink flex items-center gap-2">
                      <span>Q{idx + 1}.</span>
                      <span>{q.stem}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      {q.options.map((opt) => (
                        <div
                          key={opt.id}
                          className={`p-2 rounded-lg border ${
                            opt.id === q.correctOption ? 'bg-success-surface border-success-border font-bold text-success-text' : 'bg-card border-line text-muted'
                          }`}
                        >
                          {opt.id}. {opt.text}
                        </div>
                      ))}
                    </div>
                    <div className="p-2 rounded-lg bg-subtle text-[11px] text-muted">
                      <strong>Solution:</strong> {q.explanation}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-muted">No individual question objects stored for this log.</div>
            )}
          </div>
        </div>
      )}

      {/* Clear History Confirmation Modal */}
      <ConfirmationModal
        isOpen={isClearHistoryOpen}
        onClose={() => setIsClearHistoryOpen(false)}
        onConfirm={handleClearHistory}
        title="Clear AI Generation History?"
        message="Are you sure you want to erase all AI generation logs? This will delete the audit trail of past synthesis sessions."
        confirmText="Clear All Logs"
        tone="danger"
      />
    </div>
  );
};
