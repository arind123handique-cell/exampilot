/**
 * TEST SESSION SERVICE
 *
 * Manages test drafts (in-progress mock tests) and completed test submissions.
 * Provides dual persistence:
 * 1. Cloud Firestore (collections: 'test_drafts' and 'test_submissions')
 * 2. LocalStorage (offline-first fallback with instant caching)
 */
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import type { MCQQuestion } from '../types';

export interface TestDraft {
  id: string;
  userId: string;
  testTitle: string;
  topics: string[];
  questions: MCQQuestion[];
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
  notifyUpdate();

  // 2. Sync to Cloud Firestore if connected
  if (isFirebaseConfigured && db) {
    try {
      const draftRef = doc(db, 'test_drafts', draft.id);
      await setDoc(draftRef, draft, { merge: true });
    } catch (err) {
      console.warn('[TestSessionService] Firestore saveTestDraft error, cached locally:', err);
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

  if (isFirebaseConfigured && db) {
    try {
      const q = query(
        collection(db, 'test_drafts'),
        where('userId', '==', userKey),
        orderBy('lastSavedAt', 'desc'),
        limit(25)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        const firestoreDrafts = snap.docs.map(d => d.data() as TestDraft);
        writeLocalStorage(storageKey, firestoreDrafts);
        return firestoreDrafts;
      }
    } catch (err) {
      console.warn('[TestSessionService] Firestore getTestDrafts error, using local:', err);
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

  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'test_drafts', draftId));
      if (snap.exists()) {
        return snap.data() as TestDraft;
      }
    } catch (err) {
      console.warn('[TestSessionService] Firestore getTestDraft error:', err);
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

  // 2. Remove from Cloud Firestore
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'test_drafts', draftId));
    } catch (err) {
      console.warn('[TestSessionService] Firestore deleteTestDraft error:', err);
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

  // 2. Sync to Cloud Firestore
  if (isFirebaseConfigured && db) {
    try {
      const subRef = doc(db, 'test_submissions', record.id);
      await setDoc(subRef, record, { merge: true });
    } catch (err) {
      console.warn('[TestSessionService] Firestore saveTestSubmission error, cached locally:', err);
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

  if (isFirebaseConfigured && db) {
    try {
      const q = query(
        collection(db, 'test_submissions'),
        where('userId', '==', userKey),
        orderBy('submittedAt', 'desc'),
        limit(100)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        const firestoreHistory = snap.docs.map(d => d.data() as TestSubmissionRecord);
        writeLocalStorage(storageKey, firestoreHistory);
        return firestoreHistory;
      }
    } catch (err) {
      console.warn('[TestSessionService] Firestore getTestSubmissions error, using local:', err);
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

  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'test_submissions', id));
      if (snap.exists()) {
        return snap.data() as TestSubmissionRecord;
      }
    } catch (err) {
      console.warn('[TestSessionService] Firestore getTestSubmissionById error:', err);
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

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'test_submissions', id));
    } catch (err) {
      console.warn('[TestSessionService] Firestore deleteTestSubmission error:', err);
    }
  }
}
