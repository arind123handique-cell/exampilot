import { PYQPaper, MockTest, MCQQuestion } from '../types';
import { db, isFirebaseConfigured } from '../firebase/config';
import { doc, setDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';
import { notifyDataSync } from './questionBankSyncService';

const STORAGE_KEY_PAPERS = 'exampilot_admin_published_papers';
const STORAGE_KEY_MOCKS = 'exampilot_admin_published_mocks';

export interface PublishedPaperRecord {
  id: string;
  paper: PYQPaper;
  mockTest: MockTest;
  publishedAt: string;
  publishedBy?: string;
}

function getLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error('LocalStorage read error:', key, err);
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('LocalStorage write error:', key, err);
  }
}

/**
 * Get all admin-published papers from persistent local storage
 */
export function getAdminPublishedPapers(): PYQPaper[] {
  const records = getLocal<PublishedPaperRecord[]>(STORAGE_KEY_PAPERS, []);
  return records.map((r) => r.paper);
}

/**
 * Get all admin-published mock tests from persistent local storage
 */
export function getAdminPublishedMockTests(): MockTest[] {
  const records = getLocal<PublishedPaperRecord[]>(STORAGE_KEY_PAPERS, []);
  return records.map((r) => r.mockTest);
}

/**
 * Publish a new previous year paper & CBT mock test to both local storage & Cloud Firestore
 */
export async function publishAdminPaper(
  paper: PYQPaper,
  mockTest: MockTest,
  userId?: string
): Promise<void> {
  const record: PublishedPaperRecord = {
    id: paper.id,
    paper,
    mockTest,
    publishedAt: new Date().toISOString(),
    publishedBy: userId || 'admin'
  };

  const existing = getLocal<PublishedPaperRecord[]>(STORAGE_KEY_PAPERS, []);
  const updated = [record, ...existing.filter((r) => r.id !== paper.id)];
  setLocal(STORAGE_KEY_PAPERS, updated);

  // Sync to Cloud Firestore if connected
  if (isFirebaseConfigured && db) {
    try {
      // 1. Save paper record
      await setDoc(doc(db, 'published_papers', paper.id), {
        ...paper,
        publishedAt: record.publishedAt,
        publishedBy: record.publishedBy
      });

      // 2. Save mock test
      await setDoc(doc(db, 'custom_mock_tests', mockTest.id), {
        ...mockTest,
        publishedAt: record.publishedAt,
        publishedBy: record.publishedBy
      });

      // 3. Batch save all questions to questions/{id}
      for (const q of paper.questions) {
        await setDoc(doc(db, 'questions', q.id), q);
      }
    } catch (err) {
      console.warn('[ExamPilot] Firestore paper publish sync notice:', err);
    }
  }

  // Notify all tabs and components in real time
  notifyDataSync('papers', { paperId: paper.id });
  notifyDataSync('mocks', { mockId: mockTest.id });
  notifyDataSync('questions', { count: paper.questions.length });
  window.dispatchEvent(new CustomEvent('exampilot_papers_updated', { detail: { paperId: paper.id } }));
}

/**
 * Update an existing mock test (sub-heads, questions, answers, explanations)
 */
export async function updateAdminPublishedMockTest(mockTest: MockTest): Promise<void> {
  // 1. Check if it's attached to a published paper record
  const records = getLocal<PublishedPaperRecord[]>(STORAGE_KEY_PAPERS, []);
  let foundInRecords = false;

  const allQuestions = mockTest.sections.flatMap((s) => s.questions);
  const updatedRecords = records.map((rec) => {
    if (rec.mockTest.id === mockTest.id || rec.id === mockTest.id || rec.paper.id === mockTest.id) {
      foundInRecords = true;
      return {
        ...rec,
        mockTest,
        paper: {
          ...rec.paper,
          totalQuestions: allQuestions.length,
          questions: allQuestions
        }
      };
    }
    return rec;
  });

  if (foundInRecords) {
    setLocal(STORAGE_KEY_PAPERS, updatedRecords);
  } else {
    // Save to custom mocks list
    const customMocks = getLocal<MockTest[]>(STORAGE_KEY_MOCKS, []);
    const updatedMocks = [mockTest, ...customMocks.filter((m) => m.id !== mockTest.id)];
    setLocal(STORAGE_KEY_MOCKS, updatedMocks);
  }

  // Sync to Cloud Firestore if connected
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'custom_mock_tests', mockTest.id), {
        ...mockTest,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      for (const q of allQuestions) {
        await setDoc(doc(db, 'questions', q.id), q, { merge: true });
      }
    } catch (err) {
      console.warn('[ExamPilot] Firestore mock update notice:', err);
    }
  }

  // Real-time broadcast
  notifyDataSync('mocks', { mockId: mockTest.id });
  notifyDataSync('questions', { count: allQuestions.length });
  notifyDataSync('papers', { mockId: mockTest.id });
  window.dispatchEvent(new CustomEvent('exampilot_papers_updated', { detail: { mockId: mockTest.id } }));
}

/**
 * Delete an admin-published paper from storage & Firestore
 */
export async function deleteAdminPublishedPaper(paperId: string): Promise<void> {
  const existing = getLocal<PublishedPaperRecord[]>(STORAGE_KEY_PAPERS, []);
  const target = existing.find((r) => r.id === paperId);
  const updated = existing.filter((r) => r.id !== paperId);
  setLocal(STORAGE_KEY_PAPERS, updated);

  // Also check custom mocks
  const customMocks = getLocal<MockTest[]>(STORAGE_KEY_MOCKS, []);
  setLocal(STORAGE_KEY_MOCKS, customMocks.filter((m) => m.id !== paperId));

  if (isFirebaseConfigured && db && target) {
    try {
      await deleteDoc(doc(db, 'published_papers', paperId));
      await deleteDoc(doc(db, 'custom_mock_tests', target.mockTest.id));
      for (const q of target.paper.questions) {
        await deleteDoc(doc(db, 'questions', q.id));
      }
    } catch (err) {
      console.warn('[ExamPilot] Firestore delete error:', err);
    }
  }

  notifyDataSync('papers', { paperId });
  notifyDataSync('mocks', { paperId });
  notifyDataSync('questions');
  window.dispatchEvent(new CustomEvent('exampilot_papers_updated', { detail: { paperId } }));
}

/**
 * Helper to combine base static papers with all dynamically published admin papers
 */
export function getAllCombinedPapers(basePapers: PYQPaper[]): PYQPaper[] {
  const adminPapers = getAdminPublishedPapers();
  const adminIds = new Set(adminPapers.map((p) => p.id));
  const baseFiltered = basePapers.filter((p) => !adminIds.has(p.id));
  return [...adminPapers, ...baseFiltered];
}

/**
 * Helper to combine base static mock tests with all dynamically published admin mock tests
 */
export function getAllCombinedMockTests(baseMocks: MockTest[]): MockTest[] {
  const adminMocks = getAdminPublishedMockTests();
  const customMocks = getLocal<MockTest[]>(STORAGE_KEY_MOCKS, []);
  const allDynamic = [...adminMocks, ...customMocks];

  const dynamicIds = new Set(allDynamic.map((m) => m.id));
  const baseFiltered = baseMocks.filter((m) => !dynamicIds.has(m.id));
  return [...allDynamic, ...baseFiltered];
}
