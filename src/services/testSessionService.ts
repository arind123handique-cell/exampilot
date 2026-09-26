/**
 * TEST SESSION SERVICE
 *
 * Manages test drafts (in-progress mock tests) and completed test submissions.
 * Provides dual persistence:
 * 1. Supabase (app_docs collections: 'test_drafts' and 'test_submissions')
 * 2. LocalStorage (offline-first fallback with instant caching)
 */
import { getCloudDoc, setCloudDoc, deleteCloudDoc, queryCloudDocs } from './supabaseDocStore';
import { isSupabaseConfigured } from './supabaseClient';
import type { MCQQuestion, MockSection } from '../types';

export interface TestDraft {
  id: string;
  userId: string;
  testTitle: string;
  topics: string[];
  questions: MCQQuestion[];
  /**
   * Full section snapshot of the live attempt (bank-drawn questions included).
   * Present on drafts saved after randomization was introduced; resume must
   * prefer this over the authored mock's sections, because the drawn question
   * ids do not exist in the original paper. Optional for older drafts.
   */
  sections?: MockSection[];
  userAnswers: Record<string, 'A' | 'B' | 'C' | 'D'>;
  flaggedQuestions: string[];
  timeRemainingSeconds: number;
  currentQuestionIndex: number;
  createdAt: string;
  lastSavedAt: string;
}

export interface QuestionAnswerRecord {
  selected: 'A' | 'B' | 'C' | 'D' | null;
  isCorrect: boolean;
  correctOption: 'A' | 'B' | 'C' | 'D';
  timeSeconds?: number;
  flagged?: boolean;
}

export interface TestSubmissionRecord {
  id: string;
  testId: string;
  userId: string;
  testTitle: string;
  topics: string[];
  submittedAt: string;
  timeSpentSeconds: number;
  totalScore: number;
  maxScore: number;
  accuracy: number;
  totalAttempted: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  questions: MCQQuestion[];
  answers: Record<string, QuestionAnswerRecord>;
}

const STORAGE_KEYS = {
  draftsPrefix: 'exampilot_test_drafts_',
  submissionsPrefix: 'exampilot_test_history_'
};

function getUserIdKey(userId?: string): string {
  return userId && userId.trim() ? userId.trim() : 'student_candidate';
}

function notifyUpdate(): void {
  try {
    window.dispatchEvent(new CustomEvent('exampilot_test_records_updated'));
  } catch {}
}

function readLocalStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocalStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn('[TestSessionService] localStorage write error:', err);
  }
}

// ── Test Drafts (In-Progress Tests) ──────────────────────────────────────────

/**
 * Saves or updates an in-progress mock test draft
 */
export async function saveTestDraft(draft: TestDraft): Promise<void> {
  const userKey = getUserIdKey(draft.userId);
  const storageKey = `${STORAGE_KEYS.draftsPrefix}${userKey}`;

  // 1. Update local cache
  const existingDrafts = readLocalStorage<TestDraft[]>(storageKey, []);
  const filtered = existingDrafts.filter(d => d.id !== draft.id);
  const updated = [draft, ...filtered];
  writeLocalStorage(storageKey, updated);
  notifyUpdate();  // 2. Sync to Supabase if connected

  if (draft.userId) {
    try {
      await setCloudDoc('test_drafts', draft.id, draft, {
        userId: draft.userId,
        sortKey: draft.lastSavedAt
      });
    } catch (err) {
      console.warn('[TestSessionService] Supabase saveTestDraft error, cached locally:', err);
    }
  }
}

/**
 * Synchronously retrieves cached drafts from local storage (instant render)
 */
export function getLocalTestDrafts(userId?: string): TestDraft[] {
  const userKey = getUserIdKey(userId);
  const storageKey = `${STORAGE_KEYS.draftsPrefix}${userKey}`;
  return readLocalStorage<TestDraft[]>(storageKey, []);
}

/**
 * Synchronously retrieves cached submissions from local storage (instant render)
 */
export function getLocalTestSubmissions(userId?: string): TestSubmissionRecord[] {
  const userKey = getUserIdKey(userId);
  const storageKey = `${STORAGE_KEYS.submissionsPrefix}${userKey}`;
  return readLocalStorage<TestSubmissionRecord[]>(storageKey, []);
}

/**
 * Retrieves all saved drafts for a user
 */
export async function getTestDrafts(userId?: string): Promise<TestDraft[]> {
  const userKey = getUserIdKey(userId);
  const storageKey = `${STORAGE_KEYS.draftsPrefix}${userKey}`;
  const localDrafts = getLocalTestDrafts(userId);

  if (isSupabaseConfigured) {
    try {
      const cloudDrafts = await queryCloudDocs<TestDraft>('test_drafts', {
        userId: userKey,
        orderBySortKey: true,
        descending: true,
        limit: 25
      });
      if (cloudDrafts.length > 0) {
        writeLocalStorage(storageKey, cloudDrafts);
        return cloudDrafts;
      }
    } catch (err) {
      console.warn('[TestSessionService] Supabase getTestDrafts error, using local:', err);
    }
  }

  return localDrafts;
}

/**
 * Retrieves a single draft by ID
 */
export async function getTestDraft(draftId: string, userId?: string): Promise<TestDraft | null> {
  const drafts = await getTestDrafts(userId);
  const match = drafts.find(d => d.id === draftId);
  if (match) return match;

  if (isSupabaseConfigured) {
    try {
      const cloudDraft = await getCloudDoc<TestDraft>('test_drafts', draftId);
      if (cloudDraft) return cloudDraft;
    } catch (err) {
      console.warn('[TestSessionService] Supabase getTestDraft error:', err);
    }
  }

  return null;
}

/**
 * Deletes a draft (e.g. on test submission or explicit discard)
 */
export async function deleteTestDraft(draftId: string, userId?: string): Promise<void> {
  const userKey = getUserIdKey(userId);
  const storageKey = `${STORAGE_KEYS.draftsPrefix}${userKey}`;

  // 1. Remove from local cache
  const existingDrafts = readLocalStorage<TestDraft[]>(storageKey, []);
  const updated = existingDrafts.filter(d => d.id !== draftId);
  writeLocalStorage(storageKey, updated);
  notifyUpdate();

  // 2. Remove from Supabase
  if (isSupabaseConfigured) {
    try {
      await deleteCloudDoc('test_drafts', draftId);
    } catch (err) {
      console.warn('[TestSessionService] Supabase deleteTestDraft error:', err);
    }
  }
}

// ── Test Submissions & History Ledger ────────────────────────────────────────

/**
 * Records a completed test submission permanently
 */
export async function saveTestSubmissionRecord(record: TestSubmissionRecord): Promise<void> {
  const userKey = getUserIdKey(record.userId);
  const storageKey = `${STORAGE_KEYS.submissionsPrefix}${userKey}`;

  // 1. Write to local cache
  const existing = readLocalStorage<TestSubmissionRecord[]>(storageKey, []);
  const filtered = existing.filter(r => r.id !== record.id);
  const updated = [record, ...filtered];
  writeLocalStorage(storageKey, updated);
  notifyUpdate();

  // 2. Sync to Supabase
  if (isSupabaseConfigured && record.userId) {
    try {
      await setCloudDoc('test_submissions', record.id, record, {
        userId: record.userId,
        sortKey: record.submittedAt
      });
    } catch (err) {
      console.warn('[TestSessionService] Supabase saveTestSubmission error, cached locally:', err);
    }
  }
}

/**
 * Retrieves all completed test submissions for a user (history ledger)
 */
export async function getTestSubmissionRecords(userId?: string): Promise<TestSubmissionRecord[]> {
  const userKey = getUserIdKey(userId);
  const storageKey = `${STORAGE_KEYS.submissionsPrefix}${userKey}`;
  const localHistory = readLocalStorage<TestSubmissionRecord[]>(storageKey, []);

  if (isSupabaseConfigured) {
    try {
      const cloudHistory = await queryCloudDocs<TestSubmissionRecord>('test_submissions', {
        userId: userKey,
        orderBySortKey: true,
        descending: true,
        limit: 100
      });
      if (cloudHistory.length > 0) {
        writeLocalStorage(storageKey, cloudHistory);
        return cloudHistory;
      }
    } catch (err) {
      console.warn('[TestSessionService] Supabase getTestSubmissions error, using local:', err);
    }
  }

  return localHistory;
}

/**
 * Retrieves a single test submission for detailed mistake review
 */
export async function getTestSubmissionById(
  id: string,
  userId?: string
): Promise<TestSubmissionRecord | null> {
  const history = await getTestSubmissionRecords(userId);
  const match = history.find(h => h.id === id);
  if (match) return match;

  if (isSupabaseConfigured) {
    try {
      const cloudRecord = await getCloudDoc<TestSubmissionRecord>('test_submissions', id);
      if (cloudRecord) return cloudRecord;
    } catch (err) {
      console.warn('[TestSessionService] Supabase getTestSubmissionById error:', err);
    }
  }

  return null;
}

/**
 * Deletes a test submission from history
 */
export async function deleteTestSubmissionRecord(id: string, userId?: string): Promise<void> {
  const userKey = getUserIdKey(userId);
  const storageKey = `${STORAGE_KEYS.submissionsPrefix}${userKey}`;

  const existing = readLocalStorage<TestSubmissionRecord[]>(storageKey, []);
  const updated = existing.filter(r => r.id !== id);
  writeLocalStorage(storageKey, updated);
  notifyUpdate();

  if (isSupabaseConfigured) {
    try {
      await deleteCloudDoc('test_submissions', id);
    } catch (err) {
      console.warn('[TestSessionService] Supabase deleteTestSubmission error:', err);
    }
  }
}
