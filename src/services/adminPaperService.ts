import { PYQPaper, MockTest, MCQQuestion } from '../types';
import { db, isFirebaseConfigured } from '../firebase/config';
import { doc, setDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';
import { notifyDataSync } from './questionBankSyncService';
import {
  fetchMockTestsFromSupabase,
  fetchDeletedMockTestIdsFromSupabase,
  saveMockTestToSupabase,
  deleteMockTestFromSupabase,
  restoreDeletedMockTestsInSupabase
} from './supabaseMockTestService';

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

  // If paper/mock was previously marked deleted, un-blacklist it
  const deletedMocks = getDeletedMockIds();
  const deletedPapers = getDeletedPaperIds();
  if (deletedMocks.has(mockTest.id) || deletedMocks.has(paper.id) || deletedPapers.has(paper.id)) {
    deletedMocks.delete(mockTest.id);
    deletedMocks.delete(paper.id);
    deletedPapers.delete(paper.id);
    deletedPapers.delete(mockTest.id);
    setLocal(STORAGE_KEY_DELETED_MOCKS, Array.from(deletedMocks));
    setLocal(STORAGE_KEY_DELETED_PAPERS, Array.from(deletedPapers));
  }

  // Sync to Supabase PostgreSQL in background
  saveMockTestToSupabase(mockTest, userId).catch((err) => {
    console.warn('[ExamPilot] Supabase mock test publish notice:', err);
  });

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

  // Sync to Supabase PostgreSQL in background
  saveMockTestToSupabase(mockTest).catch((err) => {
    console.warn('[ExamPilot] Supabase mock update notice:', err);
  });

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

const STORAGE_KEY_DELETED_MOCKS = 'exampilot_deleted_mock_ids';
const STORAGE_KEY_DELETED_PAPERS = 'exampilot_deleted_paper_ids';

export function getDeletedMockIds(): Set<string> {
  const raw = getLocal<string[]>(STORAGE_KEY_DELETED_MOCKS, []);
  return new Set(Array.isArray(raw) ? raw : []);
}

export function getDeletedPaperIds(): Set<string> {
  const raw = getLocal<string[]>(STORAGE_KEY_DELETED_PAPERS, []);
  return new Set(Array.isArray(raw) ? raw : []);
}

export function restoreDeletedMockTests(): void {
  localStorage.removeItem(STORAGE_KEY_DELETED_MOCKS);
  localStorage.removeItem(STORAGE_KEY_DELETED_PAPERS);
  restoreDeletedMockTestsInSupabase().catch(() => {});
  notifyDataSync('mocks');
  notifyDataSync('papers');
  window.dispatchEvent(new CustomEvent('exampilot_papers_updated', { detail: { restored: true } }));
}

/**
 * Delete an admin-published paper or mock test from storage, Supabase, & Firestore
 */
export async function deleteAdminPublishedPaper(paperId: string): Promise<void> {
  if (!paperId) return;

  // 1. Add to persistent deleted blacklists
  const deletedMocks = getDeletedMockIds();
  const deletedPapers = getDeletedPaperIds();
  deletedMocks.add(paperId);
  deletedPapers.add(paperId);

  // 2. Look up existing published paper record to delete matching IDs
  const existing = getLocal<PublishedPaperRecord[]>(STORAGE_KEY_PAPERS, []);
  const target = existing.find(
    (r) => r.id === paperId || r.mockTest?.id === paperId || r.paper?.id === paperId
  );

  if (target) {
    if (target.id) {
      deletedMocks.add(target.id);
      deletedPapers.add(target.id);
    }
    if (target.mockTest?.id) deletedMocks.add(target.mockTest.id);
    if (target.paper?.id) deletedPapers.add(target.paper.id);
  }

  setLocal(STORAGE_KEY_DELETED_MOCKS, Array.from(deletedMocks));
  setLocal(STORAGE_KEY_DELETED_PAPERS, Array.from(deletedPapers));

  // 3. Remove from local published records and custom mocks
  const updated = existing.filter(
    (r) => r.id !== paperId && r.mockTest?.id !== paperId && r.paper?.id !== paperId
  );
  setLocal(STORAGE_KEY_PAPERS, updated);

  const customMocks = getLocal<MockTest[]>(STORAGE_KEY_MOCKS, []);
  setLocal(STORAGE_KEY_MOCKS, customMocks.filter((m) => m.id !== paperId));

  // 4. Sync deletion to Supabase PostgreSQL in background across all tables
  deleteMockTestFromSupabase(paperId).catch((err) => {
    console.warn('[ExamPilot] Supabase delete notice:', err);
  });
  if (target?.id && target.id !== paperId) {
    deleteMockTestFromSupabase(target.id).catch(() => {});
  }
  if (target?.mockTest?.id && target.mockTest.id !== paperId) {
    deleteMockTestFromSupabase(target.mockTest.id).catch(() => {});
  }
  if (target?.paper?.id && target.paper.id !== paperId) {
    deleteMockTestFromSupabase(target.paper.id).catch(() => {});
  }

  // 5. Sync deletion to Cloud Firestore non-blocking with timeout so UI never hangs
  if (isFirebaseConfigured && db) {
    (async () => {
      try {
        const pId = target?.paper?.id || target?.id || paperId;
        const mId = target?.mockTest?.id || target?.id || paperId;

        const deletePromise = Promise.allSettled([
          deleteDoc(doc(db, 'published_papers', pId)),
          deleteDoc(doc(db, 'custom_mock_tests', mId))
        ]);

        const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 2000));
        await Promise.race([deletePromise, timeoutPromise]);

        if (target?.paper?.questions && Array.isArray(target.paper.questions)) {
          for (const q of target.paper.questions) {
            if (q && q.id) {
              deleteDoc(doc(db, 'questions', q.id)).catch(() => {});
            }
          }
        }
      } catch (err) {
        console.warn('[ExamPilot] Firestore delete notice:', err);
      }
    })();
  }

  // 6. Broadcast real-time deletion across tabs
  notifyDataSync('papers', { paperId });
  notifyDataSync('mocks', { paperId });
  notifyDataSync('questions');
  window.dispatchEvent(new CustomEvent('exampilot_papers_updated', { detail: { paperId } }));
}

/**
 * Delete a mock test by ID (alias for deleteAdminPublishedPaper)
 */
export async function deleteAdminMockTest(mockId: string): Promise<void> {
  return deleteAdminPublishedPaper(mockId);
}

/**
 * Helper to combine base static papers with all dynamically published admin papers
 */
export function getAllCombinedPapers(basePapers: PYQPaper[]): PYQPaper[] {
  const deletedPaperIds = getDeletedPaperIds();
  const adminPapers = getAdminPublishedPapers().filter((p) => !deletedPaperIds.has(p.id));
  const adminIds = new Set(adminPapers.map((p) => p.id));
  const baseFiltered = (basePapers || []).filter(
    (p) => !adminIds.has(p.id) && !deletedPaperIds.has(p.id)
  );
  return [...adminPapers, ...baseFiltered];
}

/**
 * Helper to combine base static mock tests with all dynamically published admin mock tests
 */
export function getAllCombinedMockTests(baseMocks: MockTest[]): MockTest[] {
  const deletedMockIds = getDeletedMockIds();
  const adminMocks = getAdminPublishedMockTests().filter((m) => !deletedMockIds.has(m.id));
  const customMocks = getLocal<MockTest[]>(STORAGE_KEY_MOCKS, []).filter(
    (m) => !deletedMockIds.has(m.id)
  );
  const allDynamic = [...adminMocks, ...customMocks];

  const dynamicIds = new Set(allDynamic.map((m) => m.id));
  const baseFiltered = (baseMocks || []).filter(
    (m) => !dynamicIds.has(m.id) && !deletedMockIds.has(m.id)
  );
  return [...allDynamic, ...baseFiltered];
}

/**
 * Asynchronously fetch and synchronize mock tests from Supabase PostgreSQL,
 * filtering out any deleted / blacklisted mock tests across all ports and sessions.
 */
export async function fetchAndSyncMockTests(baseMocks: MockTest[]): Promise<MockTest[]> {
  try {
    const [supabaseMocks, deletedIds] = await Promise.all([
      fetchMockTestsFromSupabase(),
      fetchDeletedMockTestIdsFromSupabase()
    ]);

    // Local dynamic records
    const localAdminMocks = getAdminPublishedMockTests().filter((m) => !deletedIds.has(m.id));
    const localCustomMocks = getLocal<MockTest[]>(STORAGE_KEY_MOCKS, []).filter(
      (m) => !deletedIds.has(m.id)
    );

    const mockMap = new Map<string, MockTest>();

    // 1. Supabase tests (authoritative remote state)
    supabaseMocks.forEach((m) => {
      if (!deletedIds.has(m.id)) {
        mockMap.set(m.id, m);
      }
    });

    // 2. Include any local-only draft tests that aren't blacklisted
    [...localAdminMocks, ...localCustomMocks].forEach((m) => {
      if (!deletedIds.has(m.id) && !mockMap.has(m.id)) {
        mockMap.set(m.id, m);
      }
    });

    // 3. Base tests from code: only include if not in Supabase/local AND not blacklisted
    (baseMocks || []).forEach((m) => {
      if (!deletedIds.has(m.id) && !mockMap.has(m.id)) {
        mockMap.set(m.id, m);
      }
    });

    const combined = Array.from(mockMap.values());

    // Update local cache
    setLocal(STORAGE_KEY_MOCKS, combined);
    setLocal(STORAGE_KEY_DELETED_MOCKS, Array.from(deletedIds));

    return combined;
  } catch (err) {
    console.warn('[ExamPilot] fetchAndSyncMockTests warning, falling back to local:', err);
    return getAllCombinedMockTests(baseMocks);
  }
}

