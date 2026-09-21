import React, { useState, useEffect } from 'react';
import {
  History, PlayCircle, BookOpen, Trash2, Clock, CheckCircle2,
  XCircle, AlertCircle, Search, RefreshCw, BarChart2, Plus, Sparkles,
  ChevronRight, ArrowRight, ShieldCheck, HelpCircle
} from 'lucide-react';
import {
  getTestDrafts,
  getTestSubmissionRecords,
  deleteTestDraft,
  deleteTestSubmissionRecord,
  getLocalTestDrafts,
  getLocalTestSubmissions,
  TestDraft,
  TestSubmissionRecord
} from '../../services/testSessionService';
import { DetailedQuestionReviewModal } from './DetailedQuestionReviewModal';

interface Props {
  userId?: string;
  onResumeDraft: (draft: TestDraft) => void;
  onStartNewTest: () => void;
}

export const TestHistoryLedger: React.FC<Props> = ({
  userId,
  onResumeDraft,
  onStartNewTest
}) => {
  const [drafts, setDrafts] = useState<TestDraft[]>(() => getLocalTestDrafts(userId));
  const [submissions, setSubmissions] = useState<TestSubmissionRecord[]>(() => getLocalTestSubmissions(userId));
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReviewSubmission, setSelectedReviewSubmission] = useState<TestSubmissionRecord | null>(null);

  useEffect(() => {
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener('exampilot_test_records_updated', handleUpdate);
    return () => {
      window.removeEventListener('exampilot_test_records_updated', handleUpdate);
    };
  }, [userId]);

  const loadData = async () => {
    const localD = getLocalTestDrafts(userId);
    const localS = getLocalTestSubmissions(userId);
    if (localD.length > 0) setDrafts(localD);
    if (localS.length > 0) setSubmissions(localS);

    try {
      const [dList, sList] = await Promise.all([
        getTestDrafts(userId),
        getTestSubmissionRecords(userId)
      ]);
      setDrafts(dList || localD);
      setSubmissions(sList || localS);
    } catch (e) {
      console.warn('Failed to load test records:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDraft = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Discard this saved test draft?')) {
      await deleteTestDraft(id, userId);
      setDrafts(prev => prev.filter(d => d.id !== id));
    }
  };

  const handleDeleteSubmission = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this test record from your history?')) {
      await deleteTestSubmissionRecord(id, userId);
      setSubmissions(prev => prev.filter(s => s.id !== id));
    }
  };

  // Filter submissions based on search
  const filteredSubmissions = submissions.filter(s => {
    const q = searchQuery.toLowerCase();
    const titleMatch = s.testTitle.toLowerCase().includes(q);
    const topicMatch = s.topics.some(t => t.toLowerCase().includes(q));
    return titleMatch || topicMatch;
  });

  // Calculate aggregates
  const totalCompleted = submissions.length;
  const avgAccuracy = totalCompleted > 0
    ? Math.round(submissions.reduce((acc, cur) => acc + cur.accuracy, 0) / totalCompleted)
    : 0;
  const totalQuestionsSolved = submissions.reduce((acc, cur) => acc + cur.totalAttempted, 0);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-6xl mx-auto w-full">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <History className="h-4 w-4" />
            </div>
            <h1 className="text-lg font-black text-ink">My Test Records &amp; Review Ledger</h1>
          </div>
          <p className="text-xs text-muted">
            All your historical mock exam attempts, detailed mistake reviews, and saved in-progress test drafts.
          </p>
        </div>

        <button
          type="button"
          onClick={onStartNewTest}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-primary-dark transition"
        >
          <Plus className="h-4 w-4" />
          <span>New Mock Test</span>
        </button>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-line bg-card p-4 space-y-1 shadow-2xs">
          <span className="text-[11px] font-semibold text-muted block">Tests Completed</span>
          <span className="text-2xl font-black text-ink">{totalCompleted}</span>
          <span className="text-[10px] text-muted block">Permanent history records</span>
        </div>

        <div className="rounded-2xl border border-line bg-card p-4 space-y-1 shadow-2xs">
          <span className="text-[11px] font-semibold text-muted block">Average Accuracy</span>
          <span className={`text-2xl font-black ${avgAccuracy >= 70 ? 'text-success-text' : avgAccuracy >= 40 ? 'text-amber-500' : 'text-danger-text'}`}>
            {avgAccuracy}%
          </span>
          <span className="text-[10px] text-muted block">Across all attempted topics</span>
        </div>

        <div className="rounded-2xl border border-line bg-card p-4 space-y-1 shadow-2xs">
          <span className="text-[11px] font-semibold text-muted block">Questions Solved</span>
          <span className="text-2xl font-black text-primary">{totalQuestionsSolved}</span>
          <span className="text-[10px] text-muted block">Total MCQs attempted</span>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-1 shadow-2xs">
          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 block">Saved In-Progress Drafts</span>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{drafts.length}</span>
          <span className="text-[10px] text-muted block">Ready to resume anytime</span>
        </div>
      </div>

      {/* ── Active In-Progress Drafts Section ─────────────────────────────────── */}
      {drafts.length > 0 && (
        <div className="rounded-2xl border-2 border-amber-500/30 bg-amber-500/5 p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-ping" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                In-Progress Test Drafts ({drafts.length})
              </h2>
            </div>
            <span className="text-[11px] text-muted">Auto-saved session states</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {drafts.map(draft => {
              const answeredCount = Object.keys(draft.userAnswers || {}).length;
              return (
                <div
                  key={draft.id}
                  className="rounded-xl border border-amber-500/30 bg-card p-4 flex flex-col justify-between gap-3 shadow-xs hover:border-amber-500 transition"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-ink line-clamp-1">{draft.testTitle}</h3>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteDraft(draft.id, e)}
                        className="p-1 rounded-lg text-muted hover:text-danger-text hover:bg-danger-surface transition"
                        title="Discard Draft"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                      <span>{answeredCount} of {draft.questions.length} answered</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {formatTime(draft.timeRemainingSeconds)} left
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {draft.topics.map(t => (
                        <span key={t} className="rounded-md bg-raised px-1.5 py-0.5 text-[10px] font-medium text-ink-soft">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onResumeDraft(draft)}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 text-xs shadow-xs transition"
                  >
                    <PlayCircle className="h-4 w-4" />
                    <span>Resume Test Draft</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Historical Completed Submissions Ledger ────────────────────────── */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink">
            Completed Test Attempts ({submissions.length})
          </h2>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search topic or title..."
              className="w-full rounded-xl border border-line bg-card pl-8 pr-3 py-1.5 text-xs text-ink placeholder:text-muted focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-muted text-xs gap-2">
            <RefreshCw className="h-4 w-4 animate-spin text-primary" />
            <span>Loading your test records...</span>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="rounded-2xl border border-line bg-card p-10 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <History className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-ink">No Test Submissions Yet</h3>
            <p className="text-xs text-muted max-w-md mx-auto">
              Launch a mock test from the creator, test your civil engineering knowledge, and your scores, mistakes, and solutions will be permanently archived here for review.
            </p>
            <button
              type="button"
              onClick={onStartNewTest}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-primary-dark transition"
            >
              <Plus className="h-4 w-4" /> Start Your First Mock Test
            </button>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredSubmissions.map(sub => {
              const formattedDate = new Date(sub.submittedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={sub.id}
                  className="rounded-2xl border border-line bg-card p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs hover:border-line-strong transition"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-ink">{sub.testTitle}</h3>
                      <span className="text-[11px] text-muted flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {formattedDate}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                      <span>{sub.totalAttempted} / {sub.questions.length} Attempted</span>
                      <span>·</span>
                      <span className="text-success-text font-semibold">{sub.correctCount} Correct</span>
                      <span>·</span>
                      <span className="text-danger-text font-semibold">{sub.incorrectCount} Incorrect</span>
                      <span>·</span>
                      <span>Time: {formatTime(sub.timeSpentSeconds)}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {sub.topics.map(t => (
                        <span key={t} className="rounded-md bg-raised px-2 py-0.5 text-[10px] font-medium text-ink-soft">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Score & Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-line/60">
                    <div className="text-right">
                      <div className="text-sm font-black text-ink">
                        {sub.totalScore.toFixed(1)} <span className="text-xs font-normal text-muted">/ {sub.maxScore}</span>
                      </div>
                      <div className={`text-xs font-bold ${sub.accuracy >= 70 ? 'text-success-text' : sub.accuracy >= 40 ? 'text-amber-500' : 'text-danger-text'}`}>
                        {sub.accuracy}% Accuracy
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedReviewSubmission(sub)}
                        className="flex items-center gap-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 px-3.5 py-2 text-xs font-bold transition shadow-2xs"
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>Review Mistakes</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDeleteSubmission(sub.id, e)}
                        className="p-2 rounded-xl text-muted hover:text-danger-text hover:bg-danger-surface transition"
                        title="Delete Record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detailed Review Modal */}
      <DetailedQuestionReviewModal
        submission={selectedReviewSubmission}
        isOpen={Boolean(selectedReviewSubmission)}
        onClose={() => setSelectedReviewSubmission(null)}
      />
    </div>
  );
};
