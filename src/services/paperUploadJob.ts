/**
 * PAPER UPLOAD JOB (survives tab switches)
 *
 * "My Papers" lives behind a tab, and that tab is the only thing that mounts
 * `StudentPaperSolver`. Switching away therefore unmounts the component and
 * throws away its `busy` / `status` state — so the spinner disappears, the
 * selected file vanishes, and the extraction, which is still running, becomes
 * invisible. From the student's side the upload looks cancelled. The paper may
 * even land in their account with no confirmation ever shown.
 *
 * The job is held at module scope instead, so it outlives the component. Any
 * number of `StudentPaperSolver` mounts can subscribe to the same job, and the
 * extraction carries on regardless of which tab is on screen. The student can
 * leave, do a test, come back, and the result is waiting.
 */

import { useEffect, useState } from 'react';
import { parseExamPdfWithGemini, readFileAsBase64, MAX_INLINE_UPLOAD_BYTES } from './pdfParserService';
import { saveStudentPaper } from './studentPaperService';
import { reportFailure, logEvent } from './appDiagnostics';
import type { StudentPaper } from './studentPaperService';

export interface UploadOutcome {
  title: string;
  questionCount: number;
  addedToBank: number;
  duplicateCount: number;
  aiDerivedKeyCount: number;
}

export interface PaperUploadJobState {
  /** True while a file is being read, parsed or saved. */
  busy: boolean;
  /** Human-readable progress line, or null when idle. */
  status: string | null;
  fileName: string | null;
  /** Monotonic id so a completed job is announced once, not on every render. */
  runId: number;
  outcome: UploadOutcome | null;
  error: string | null;
}

export interface StartUploadInput {
  userId: string;
  file: File;
  title: string;
  year: string;
  subject: string;
  /** Called when the job finishes, so the mounted panel can refresh its list. */
  onCompleted?: (paper: StudentPaper) => void;
}

const IDLE: PaperUploadJobState = {
  busy: false,
  status: null,
  fileName: null,
  runId: 0,
  outcome: null,
  error: null
};

let state: PaperUploadJobState = IDLE;
const listeners = new Set<(s: PaperUploadJobState) => void>();

function setState(next: Partial<PaperUploadJobState>) {
  state = { ...state, ...next };
  listeners.forEach((fn) => {
    try {
      fn(state);
    } catch {
      // A listener must not be able to break the extraction.
    }
  });
}

export function getUploadJob(): PaperUploadJobState {
  return state;
}

export function subscribeUploadJob(fn: (s: PaperUploadJobState) => void): () => void {
  listeners.add(fn);
  // Guarded for the same reason as the diagnostics subscriber: a throwing
  // listener must not escape the subscribe call and unmount the panel.
  try {
    fn(state);
  } catch {
    /* ignore */
  }
  return () => {
    listeners.delete(fn);
  };
}

/** Clears a finished/failed job so the panel returns to its idle state. */
export function dismissUploadJob(): void {
  if (state.busy) return;
  setState({ outcome: null, error: null, status: null, fileName: null });
}

/**
 * Runs an extraction. Deliberately not tied to a component: see the note above.
 * Throwing is avoided entirely — every failure becomes `state.error` plus a
 * diagnostics event, because a rejection here would land in the unhandled
 * rejection handler with no context about which paper failed.
 */
export async function startPaperUpload(input: StartUploadInput): Promise<void> {
  if (state.busy) {
    logEvent('paper.upload', 'ignored a second upload while one was already running');
    return;
  }

  const { file } = input;
  const runId = state.runId + 1;
  const startedAt = Date.now();

  setState({
    busy: true,
    status: 'Reading the file…',
    fileName: file.name,
    runId,
    outcome: null,
    error: null
  });

  logEvent('paper.upload', 'upload started', {
    runId,
    fileName: file.name,
    sizeBytes: file.size,
    sizeMb: Number((file.size / (1024 * 1024)).toFixed(3)),
    type: file.type || 'unknown'
  });

  try {
    if (file.size > MAX_INLINE_UPLOAD_BYTES) {
      throw new Error(
        `"${file.name}" is ${(file.size / (1024 * 1024)).toFixed(1)} MB, over the ` +
          `${(MAX_INLINE_UPLOAD_BYTES / (1024 * 1024)).toFixed(0)} MB limit for in-app extraction.`
      );
    }

    const { base64, mimeType } = await readFileAsBase64(file);
    const parsedYear = Number(input.year) || new Date().getFullYear();
    const examName = input.title.trim() || file.name.replace(/\.[a-z0-9]+$/i, '');

    const questions = await parseExamPdfWithGemini(
      base64,
      mimeType,
      {
        examName,
        year: parsedYear,
        paperType: 'Question Paper',
        subject: input.subject.trim() || 'General Studies',
        durationMinutes: 120,
        totalMarks: 0,
        negativeMarksPerIncorrect: 0.25,
        // Provenance unknown: a key the model does not report as printed is
        // treated as model-derived, never as an official one.
        keySource: 'auto'
      },
      (step) => setState({ status: step })
    );

    if (questions.length === 0) {
      throw new Error('The extractor finished but returned no questions.');
    }

    setState({ status: 'Checking the question bank for repeats…' });
    const result = await saveStudentPaper({
      userId: input.userId || '',
      title: examName,
      examName,
      year: parsedYear,
      subject: input.subject.trim() || 'General Studies',
      questions
    });

    const outcome: UploadOutcome = {
      title: examName,
      questionCount: result.paper.questionCount,
      addedToBank: result.addedToBank,
      duplicateCount: result.paper.duplicateCount,
      aiDerivedKeyCount: result.paper.aiDerivedKeyCount
    };

    setState({ busy: false, status: null, outcome });
    input.onCompleted?.(result.paper);

    logEvent('paper.upload', 'upload succeeded', {
      runId,
      fileName: file.name,
      elapsedMs: Date.now() - startedAt,
      ...outcome
    });
  } catch (err: any) {
    const message = err?.message || 'Extraction failed. Please try again.';
    setState({ busy: false, status: null, error: message });
    reportFailure('paper.upload', err, {
      runId,
      fileName: file.name,
      sizeMb: Number((file.size / (1024 * 1024)).toFixed(3)),
      elapsedMs: Date.now() - startedAt
    });
  }
}

/** Subscribes a component to the shared job. */
export function useUploadJob(): PaperUploadJobState {
  const [job, setJob] = useState<PaperUploadJobState>(getUploadJob);
  useEffect(() => subscribeUploadJob(setJob), []);
  return job;
}

/** Resets the job to idle. Test-only; production clears via `dismissUploadJob`. */
export function clearUploadJobForTest(): void {
  state = IDLE;
  listeners.forEach((fn) => {
    try {
      fn(state);
    } catch {
      /* ignore */
    }
  });
}
