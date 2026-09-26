import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Upload,
  FileText,
  Sparkles,
  Trash2,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Layers,
  Copy,
  AlertCircle
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { useToast } from '../../context/ToastContext';
import { hasLiveAi } from '../../services/geminiService';
import { MAX_INLINE_UPLOAD_BYTES } from '../../services/pdfParserService';
import { startPaperUpload, useUploadJob } from '../../services/paperUploadJob';
import { reportFailure } from '../../services/appDiagnostics';
import {
  StudentPaper,
  listStudentPapers,
  saveStudentPaper,
  deleteStudentPaper
} from '../../services/studentPaperService';

interface StudentPaperSolverProps {
  userId?: string;
}

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return iso;
  }
};

const formatSize = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

/**
 * "My Papers" — the student uploads a question paper, gets the answers with
 * explanations immediately, and can revisit every answer in the portal later.
 * Questions that are already in the question bank are never added twice.
 */
export const StudentPaperSolver: React.FC<StudentPaperSolverProps> = ({ userId }) => {
  const { success: toastSuccess, error: toastError } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [subject, setSubject] = useState('General Studies');

  // Busy/status live in a module-level job, not here. This component is only
  // mounted while the Papers tab is open, so keeping them in local state meant a
  // tab switch threw away the spinner and progress of a running extraction.
  const { busy, status, outcome, error: jobError, runId } = useUploadJob();
  const [papers, setPapers] = useState<StudentPaper[]>([]);
  const [loadingPapers, setLoadingPapers] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [verifyOnly, setVerifyOnly] = useState(false);
  const [aiReady, setAiReady] = useState(() => hasLiveAi());

  const refreshPapers = useCallback(async () => {
    if (!userId) {
      setPapers([]);
      return;
    }
    setLoadingPapers(true);
    try {
      setPapers(await listStudentPapers(userId));
    } finally {
      setLoadingPapers(false);
    }
  }, [userId]);

  useEffect(() => {
    void refreshPapers();
  }, [refreshPapers]);

  // The "only show answers to verify" filter is per paper.
  useEffect(() => {
    setVerifyOnly(false);
  }, [expandedId]);

  const handleSolve = () => {
    // The key may have been added after this section mounted.
    setAiReady(hasLiveAi());
    if (!file) {
      toastError('No paper selected', 'Choose a PDF (or image) of the question paper first.');
      return;
    }
    if (!hasLiveAi()) {
      toastError('Gemini key required', 'Add your Gemini API key to extract answers and explanations.');
      return;
    }

    const selected = file;
    setFile(null);
    void startPaperUpload({
      userId: userId || '',
      file: selected,
      title,
      year,
      subject,
      onCompleted: () => {
        void refreshPapers();
      }
    });
  };

  // The job outlives this component, so its result is announced on the way back
  // in rather than from inside the extraction itself.
  const announcedRun = useRef<number>(-1);
  useEffect(() => {
    if (!runId || announcedRun.current === runId) return;
    announcedRun.current = runId;

    if (jobError) {
      toastError('Could not solve the paper', jobError);
      return;
    }
    if (outcome) {
      toastSuccess(
        'Paper solved',
        `${outcome.questionCount} question(s) answered · ${outcome.addedToBank} added to the bank` +
          (outcome.duplicateCount > 0 ? ` · ${outcome.duplicateCount} repeat(s) skipped` : '') +
          (outcome.aiDerivedKeyCount > 0
            ? ` · ${outcome.aiDerivedKeyCount} answer(s) solved by AI — verify them`
            : '')
      );
    }
  }, [runId, jobError, outcome, toastError, toastSuccess]);

  useEffect(() => {
    if (!jobError) return;
    reportFailure('paper.upload.ui', jobError, { surfacedInUi: true });
  }, [jobError]);

  const handleDelete = async (paper: StudentPaper) => {
    if (!userId) return;
    await deleteStudentPaper(paper.id, userId);
    if (expandedId === paper.id) setExpandedId(null);
    await refreshPapers();
    toastSuccess('Paper removed', `"${paper.title}" is no longer in your portal.`);
  };

  const oversized = Boolean(file && file.size > MAX_INLINE_UPLOAD_BYTES);

  return (
    <div className="space-y-6 animate-fadeIn">
      <Card flush className="p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-ink">Solve a Question Paper</h2>
            <p className="text-xs text-muted mt-1 max-w-3xl">
              Upload a question paper you have with you. Every multiple-choice question is read out of
              the file and answered with a full explanation, right here in your portal. Questions that
              are not already in the question bank are added to it; repeats are skipped so the bank
              stays clean.
            </p>
          </div>
        </div>
      </Card>

      {!aiReady && (
        <Card flush className="p-4 border-warning/40 bg-warning-surface">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-warning" />
            <p className="text-xs text-warning-text">
              Paper solving needs a Gemini API key. Add one from the Gemini AI button in the top bar
              to extract answers and explanations.
            </p>
          </div>
        </Card>
      )}

      <Card flush className="p-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block space-y-1.5 sm:col-span-2">
            <span className="text-xs font-semibold text-ink-soft">Paper name / exam</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. APSC AE Civil 2025 — Paper I"
              className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-primary"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-ink-soft">Year</span>
            <input
              value={year}
              onChange={(e) => setYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
              inputMode="numeric"
              placeholder={String(new Date().getFullYear())}
              className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-primary"
            />
          </label>
        </div>

        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-ink-soft">Subject</span>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="General Studies"
            className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-primary sm:max-w-sm"
          />
        </label>

        <div className="space-y-2">
          <input
            id="student-paper-file"
            type="file"
            accept="application/pdf,image/png,image/jpeg"
            className="sr-only"
            onChange={(e) => {
              const picked = e.target.files?.[0] ?? null;
              setFile(picked);
              if (picked && !title) {
                setTitle(picked.name.replace(/\.[a-z0-9]+$/i, '').replace(/[_-]+/g, ' '));
              }
            }}
          />
          <label
            htmlFor="student-paper-file"
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-line-strong bg-subtle px-4 py-4 transition hover:border-primary/50 hover:bg-subtle-strong"
          >
            <FileText className="w-5 h-5 flex-shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink truncate">
                {file ? file.name : 'Choose a PDF or image of the question paper'}
              </p>
              <p className="text-[11px] text-muted">
                {file
                  ? `${formatSize(file.size)} · maximum ${formatSize(MAX_INLINE_UPLOAD_BYTES)}`
                  : 'Scanned papers work best — text layers, images and diagrams are all read.'}
              </p>
            </div>
            <span className="rounded-lg border border-line px-2.5 py-1 text-xs font-semibold text-muted">
              Browse
            </span>
          </label>
          {oversized && (
            <p className="text-[11px] text-danger-text">
              This file is larger than the {formatSize(MAX_INLINE_UPLOAD_BYTES)} browser limit. Split or
              compress it, or use the CLI importer for large scans.
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="primary"
            onClick={handleSolve}
            loading={busy}
            disabled={busy || !file || !aiReady || oversized}
            icon={<Sparkles className="w-4 h-4" />}
          >
            {busy ? 'Solving…' : 'Solve & save paper'}
          </Button>
          {status && (
            <span className="flex items-center gap-2 text-xs text-muted">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              {status}
            </span>
          )}
        </div>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" />
          <h3 className="font-display font-bold text-sm text-ink">My Papers</h3>
          {papers.length > 0 && (
            <span className="rounded-full bg-primary-fixed px-2 py-0.5 text-[10px] font-bold text-primary">
              {papers.length}
            </span>
          )}
        </div>

        {loadingPapers && papers.length === 0 ? (
          <Card flush className="p-6">
            <p className="text-xs text-muted">Loading your papers…</p>
          </Card>
        ) : papers.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-6 h-6" />}
            title="No papers yet"
            description="Upload a question paper above — its answers and explanations stay here for revision, and the new questions join the question bank."
          />
        ) : (
          papers.map((paper) => {
            const expanded = expandedId === paper.id;
            return (
              <Card key={paper.id} flush className="overflow-hidden">
                <div className="flex items-center gap-3 p-4">
                  <button
                    onClick={() => setExpandedId(expanded ? null : paper.id)}
                    className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
                    aria-expanded={expanded}
                  >
                    {expanded ? (
                      <ChevronDown className="w-4 h-4 flex-shrink-0 text-primary" />
                    ) : (
                      <ChevronRight className="w-4 h-4 flex-shrink-0 text-muted" />
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">{paper.title}</p>
                      <p className="text-[11px] text-muted">
                        {formatDate(paper.createdAt)} · {paper.questionCount} question
                        {paper.questionCount === 1 ? '' : 's'} · {paper.newToBankCount} new to the bank
                        {paper.duplicateCount > 0 ? ` · ${paper.duplicateCount} repeat skipped` : ''}
                        {paper.aiDerivedKeyCount > 0 ? ` · ${paper.aiDerivedKeyCount} to verify` : ''}
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDelete(paper)}
                    className="rounded-lg p-1.5 text-muted-faint transition hover:bg-danger-surface hover:text-danger-text"
                    title="Remove this paper from your portal"
                    aria-label={`Remove ${paper.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {expanded && (
                  <div className="space-y-3 border-t border-line bg-subtle/30 p-4">
                    {paper.aiDerivedKeyCount > 0 && (
                      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-warning/40 bg-warning-surface px-3 py-2">
                        <p className="text-[11px] text-warning-text">
                          <AlertCircle className="mr-1 inline w-3.5 h-3.5" />
                          {paper.aiDerivedKeyCount} answer
                          {paper.aiDerivedKeyCount === 1 ? ' was' : 's were'} solved by AI, not printed on
                          the paper. Check them against the official key.
                        </p>
                        <button
                          onClick={() => setVerifyOnly((prev) => !prev)}
                          className="text-[11px] font-bold text-primary hover:underline"
                        >
                          {verifyOnly ? 'Show all questions' : 'Show only these'}
                        </button>
                      </div>
                    )}
                    {paper.questions
                      .filter((q) => !verifyOnly || q.answerKeySource !== 'PRINTED')
                      .map((q, idx) => (
                      <div key={q.id || idx} className="rounded-xl border border-line bg-card p-4">
                        <div className="flex items-start gap-2">
                          <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-primary-fixed text-[10px] font-bold text-primary">
                            {q.number || idx + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium leading-relaxed text-ink">{q.stem}</p>
                            {q.answerKeySource !== 'PRINTED' && (
                              <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-warning/40 bg-warning-surface px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-warning-text">
                                <AlertCircle className="w-3 h-3" />
                                AI-solved · {q.keyConfidence.toLowerCase()} confidence
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-3 space-y-1.5 pl-7">
                          {q.options.map((opt) => {
                            const isCorrect = opt.id === q.correctOption;
                            return (
                              <div
                                key={opt.id}
                                className={`flex items-start gap-2 rounded-lg border px-2.5 py-1.5 text-xs ${
                                  isCorrect
                                    ? 'border-success-border bg-success-surface text-success-text'
                                    : 'border-line bg-surface text-muted'
                                }`}
                              >
                                <span className="font-bold">{opt.id}</span>
                                <span className="min-w-0 flex-1 whitespace-pre-wrap">{opt.text}</span>
                                {isCorrect && <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />}
                              </div>
                            );
                          })}
                        </div>

                        {q.explanation && (
                          <div className="mt-3 rounded-lg border border-line bg-subtle px-3 py-2 pl-7">
                            <p className="text-[11px] font-bold uppercase tracking-wide text-primary">
                              Why this is correct
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-ink-soft whitespace-pre-wrap">
                              {q.explanation}
                            </p>
                          </div>
                        )}

                        {q.alreadyInBank && (
                          <p className="mt-2 flex items-center gap-1.5 pl-7 text-[11px] text-muted-faint">
                            <Copy className="w-3 h-3" />
                            Already in the question bank — not added again.
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
