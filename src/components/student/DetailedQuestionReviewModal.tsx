import React, { useState } from 'react';
import {
  X, CheckCircle2, XCircle, AlertCircle, HelpCircle,
  BookOpen, Filter, Download, ArrowLeft, Tag, Layers, Clock
} from 'lucide-react';
import type { TestSubmissionRecord, QuestionAnswerRecord } from '../../services/testSessionService';

interface Props {
  submission: TestSubmissionRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onRetakeTest?: (submission: TestSubmissionRecord) => void;
}

export const DetailedQuestionReviewModal: React.FC<Props> = ({
  submission,
  isOpen,
  onClose,
  onRetakeTest
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'incorrect' | 'correct' | 'unattempted'>('all');

  if (!isOpen || !submission) return null;

  const {
    testTitle,
    submittedAt,
    timeSpentSeconds,
    totalScore,
    maxScore,
    accuracy,
    correctCount,
    incorrectCount,
    unattemptedCount,
    questions,
    answers
  } = submission;

  // Filter questions based on selected pill
  const filteredQuestions = questions.filter(q => {
    const ans = answers[q.id];
    if (filterMode === 'incorrect') {
      return ans && ans.selected !== null && !ans.isCorrect;
    }
    if (filterMode === 'correct') {
      return ans && ans.selected !== null && ans.isCorrect;
    }
    if (filterMode === 'unattempted') {
      return !ans || ans.selected === null;
    }
    return true;
  });

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  const formattedDate = new Date(submittedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-5 backdrop-blur-xs">
      <div className="flex h-full max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl border border-line bg-surface shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line bg-card px-5 py-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase">
                Detailed Mistake Review
              </span>
              <span className="text-xs text-muted flex items-center gap-1">
                <Clock className="h-3 w-3" /> {formattedDate}
              </span>
            </div>
            <h2 className="text-base font-bold text-ink">{testTitle}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-muted hover:bg-raised hover:text-ink transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scorecard Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 border-b border-line bg-raised/50 p-3 text-xs">
          <div className="rounded-xl border border-line bg-card p-2.5 text-center">
            <span className="text-[10px] font-semibold text-muted block">Score</span>
            <span className="text-sm font-black text-ink">{totalScore.toFixed(1)} / {maxScore}</span>
          </div>

          <div className="rounded-xl border border-line bg-card p-2.5 text-center">
            <span className="text-[10px] font-semibold text-muted block">Accuracy</span>
            <span className={`text-sm font-black ${accuracy >= 70 ? 'text-success-text' : accuracy >= 40 ? 'text-amber-500' : 'text-danger-text'}`}>
              {accuracy}%
            </span>
          </div>

          <div className="rounded-xl border border-success-border/40 bg-success-surface/40 p-2.5 text-center">
            <span className="text-[10px] font-semibold text-success-text block">Correct</span>
            <span className="text-sm font-black text-success-text">{correctCount}</span>
          </div>

          <div className="rounded-xl border border-danger-border/40 bg-danger-surface/40 p-2.5 text-center">
            <span className="text-[10px] font-semibold text-danger-text block">Incorrect</span>
            <span className="text-sm font-black text-danger-text">{incorrectCount}</span>
          </div>

          <div className="col-span-2 sm:col-span-1 rounded-xl border border-line bg-card p-2.5 text-center">
            <span className="text-[10px] font-semibold text-muted block">Time Spent</span>
            <span className="text-sm font-black text-ink">{formatTime(timeSpentSeconds)}</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-card/60 px-5 py-2.5">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`rounded-xl px-3 py-1 font-semibold transition ${
                filterMode === 'all'
                  ? 'bg-primary text-white shadow-2xs'
                  : 'border border-line bg-card text-ink hover:border-primary'
              }`}
            >
              All Questions ({questions.length})
            </button>

            <button
              type="button"
              onClick={() => setFilterMode('incorrect')}
              className={`rounded-xl px-3 py-1 font-semibold transition flex items-center gap-1.5 ${
                filterMode === 'incorrect'
                  ? 'bg-danger text-white shadow-2xs'
                  : 'border border-danger-border bg-danger-surface text-danger-text hover:bg-danger/20'
              }`}
            >
              <XCircle className="h-3.5 w-3.5" />
              Mistakes Only ({incorrectCount})
            </button>

            <button
              type="button"
              onClick={() => setFilterMode('correct')}
              className={`rounded-xl px-3 py-1 font-semibold transition flex items-center gap-1.5 ${
                filterMode === 'correct'
                  ? 'bg-success text-white shadow-2xs'
                  : 'border border-success-border bg-success-surface text-success-text hover:bg-success/20'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Correct ({correctCount})
            </button>

            {unattemptedCount > 0 && (
              <button
                type="button"
                onClick={() => setFilterMode('unattempted')}
                className={`rounded-xl px-3 py-1 font-semibold transition flex items-center gap-1.5 ${
                  filterMode === 'unattempted'
                    ? 'bg-muted-faint text-ink shadow-2xs'
                    : 'border border-line bg-card text-muted hover:text-ink'
                }`}
              >
                <HelpCircle className="h-3.5 w-3.5" />
                Unattempted ({unattemptedCount})
              </button>
            )}
          </div>

          <span className="text-[11px] font-medium text-muted">
            Showing {filteredQuestions.length} of {questions.length} items
          </span>
        </div>

        {/* Questions Review List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-surface/50">
          {filteredQuestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CheckCircle2 className="h-12 w-12 text-success-text mb-3" />
              <h3 className="text-sm font-bold text-ink">No questions match this filter</h3>
              <p className="text-xs text-muted mt-1">
                {filterMode === 'incorrect' ? 'Flawless performance! You made 0 mistakes in this test.' : 'Select another filter to view questions.'}
              </p>
            </div>
          ) : (
            filteredQuestions.map((q, idx) => {
              const ans = answers[q.id];
              const selectedKey = ans?.selected ?? null;
              const correctKey = (q.correctOption || 'A').toUpperCase();
              const isCorrect = ans?.isCorrect ?? false;
              const isUnattempted = selectedKey === null;

              return (
                <div
                  key={q.id || idx}
                  className={`rounded-2xl border-2 p-4 sm:p-5 space-y-4 bg-card shadow-xs transition ${
                    isUnattempted
                      ? 'border-line'
                      : isCorrect
                      ? 'border-success-border/60 bg-gradient-to-b from-success-surface/10 to-transparent'
                      : 'border-danger-border/60 bg-gradient-to-b from-danger-surface/10 to-transparent'
                  }`}
                >
                  {/* Top Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-raised text-xs font-bold text-ink">
                        Q{idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-ink-soft">
                        {q.topic || 'Civil Engineering'}
                      </span>
                      {q.referenceSource && (
                        <span className="hidden sm:inline-flex rounded-md border border-line bg-raised px-2 py-0.5 text-[10px] text-muted">
                          {q.referenceSource}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {isUnattempted ? (
                        <span className="rounded-full border border-line bg-raised px-2.5 py-0.5 text-[11px] font-semibold text-muted">
                          ⚪ Unattempted
                        </span>
                      ) : isCorrect ? (
                        <span className="flex items-center gap-1 rounded-full border border-success-border bg-success-surface px-2.5 py-0.5 text-[11px] font-bold text-success-text">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Correct (+1.0)
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 rounded-full border border-danger-border bg-danger-surface px-2.5 py-0.5 text-[11px] font-bold text-danger-text">
                          <XCircle className="h-3.5 w-3.5" /> Incorrect (-0.33)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question Stem */}
                  <div className="text-sm font-medium text-ink leading-relaxed whitespace-pre-line">
                    {q.stem}
                  </div>

                  {/* 4 Options */}
                  <div className="grid gap-2 sm:grid-cols-2 pt-1">
                    {q.options.map(opt => {
                      const isOptionSelected = selectedKey === opt.id;
                      const isOptionCorrect = correctKey === opt.id;

                      let styleClass = 'border-line bg-card text-ink hover:border-line-strong';
                      let badge = null;

                      if (isOptionSelected && isOptionCorrect) {
                        styleClass = 'border-success bg-success-surface text-success-text font-bold';
                        badge = (
                          <span className="text-[10px] font-bold text-success-text flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Your Answer (Correct)
                          </span>
                        );
                      } else if (isOptionSelected && !isOptionCorrect) {
                        styleClass = 'border-danger bg-danger-surface text-danger-text font-bold';
                        badge = (
                          <span className="text-[10px] font-bold text-danger-text flex items-center gap-1">
                            <XCircle className="h-3.5 w-3.5" /> Your Answer (Mistake)
                          </span>
                        );
                      } else if (isOptionCorrect) {
                        styleClass = 'border-success/80 bg-success-surface/50 text-success-text font-bold';
                        badge = (
                          <span className="text-[10px] font-bold text-success-text flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Correct Key
                          </span>
                        );
                      }

                      return (
                        <div
                          key={opt.id}
                          className={`rounded-xl border p-3 flex flex-col justify-between gap-1.5 transition ${styleClass}`}
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="font-bold shrink-0">{opt.id}.</span>
                            <span className="text-xs leading-normal">{opt.text}</span>
                          </div>
                          {badge}
                        </div>
                      );
                    })}
                  </div>

                  {/* Technical Explanation & Rationale */}
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2 mt-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                      <BookOpen className="h-4 w-4" />
                      <span>Technical Explanation &amp; Rationale</span>
                    </div>

                    <p className="text-xs leading-relaxed text-ink-soft">
                      {q.explanation || 'Refer to standard civil engineering codes and textbook derivations for this topic.'}
                    </p>

                    {q.formulaContext && (
                      <div className="rounded-lg bg-card border border-line p-2 text-xs font-mono text-primary font-bold">
                        Formula / Derivation: {q.formulaContext}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-line bg-card px-5 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-line bg-raised px-4 py-2 text-xs font-semibold text-ink hover:border-primary transition"
          >
            Close Review
          </button>

          {onRetakeTest && (
            <button
              type="button"
              onClick={() => onRetakeTest(submission)}
              className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-primary-dark transition"
            >
              Retake This Test
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
