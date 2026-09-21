import { MockTest, MockSection, PYQPaper, MCQQuestion } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { batchSaveQuestionsToSupabase } from './supabaseQuestionService';

const STORAGE_KEY_CACHED_MOCKS = 'exampilot_admin_published_mocks';
const STORAGE_KEY_DELETED_MOCKS = 'exampilot_deleted_mock_ids';

export interface CustomMockTestRow {
  id: string;
  exam_id: string;
  title: string;
  paper_name: string;
  duration_minutes: number;
  total_marks: number;
  negative_marks_per_incorrect: number;
  sections: MockSection[] | any;
  published_at?: string;
  published_by?: string;
  source?: string;
}

/**
 * Transforms a Supabase custom_mock_tests row into an application MockTest
 */
export function rowToMockTest(row: CustomMockTestRow): MockTest {
  let parsedSections: MockSection[] = [];
  if (Array.isArray(row.sections)) {
    parsedSections = row.sections;
  } else if (typeof row.sections === 'string') {
    try {
      parsedSections = JSON.parse(row.sections);
    } catch {
      parsedSections = [];
    }
  }

  return {
    id: row.id,
    title: row.title || 'Mock Test',
    examId: row.exam_id || 'general',
    paperName: row.paper_name || row.title || 'CBT Paper',
    durationMinutes: Number(row.duration_minutes) || 120,
    totalMarks: Number(row.total_marks) || 100,
    negativeMarksPerIncorrect: row.negative_marks_per_incorrect !== undefined ? Number(row.negative_marks_per_incorrect) : 0.25,
    sections: parsedSections
  };
}

/**
 * Transforms an application MockTest into a Supabase custom_mock_tests row
 */
export function mockTestToRow(
  test: MockTest,
  publishedBy = 'admin',
  source = 'admin-studio'
): CustomMockTestRow {
  return {
    id: test.id,
    exam_id: test.examId || 'general',
    title: test.title,
    paper_name: test.paperName || test.title,
    duration_minutes: test.durationMinutes || 120,
    total_marks: test.totalMarks || 100,
    negative_marks_per_incorrect: test.negativeMarksPerIncorrect ?? 0.25,
    sections: test.sections || [],
    published_at: new Date().toISOString(),
    published_by: publishedBy,
    source
  };
}

/**
 * Fetch all blacklisted / deleted mock test IDs from Supabase
 */
export async function fetchDeletedMockTestIdsFromSupabase(): Promise<Set<string>> {
  if (!isSupabaseConfigured || !supabase) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_DELETED_MOCKS);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch {
      return new Set();
    }
  }

  try {
    const { data, error } = await supabase
      .from('deleted_mock_tests')
      .select('id');

    if (error) {
      console.warn('[SupabaseMockService] Failed to fetch deleted mock IDs:', error.message);
      const raw = localStorage.getItem(STORAGE_KEY_DELETED_MOCKS);
      return new Set(raw ? JSON.parse(raw) : []);
    }

    const ids = new Set((data || []).map((row: { id: string }) => row.id));

    // Also include any locally marked deleted IDs as a fallback union
    try {
      const localRaw = localStorage.getItem(STORAGE_KEY_DELETED_MOCKS);
      if (localRaw) {
        const localList: string[] = JSON.parse(localRaw);
        localList.forEach((id) => ids.add(id));
      }
    } catch {}

    // Save unified set back to localStorage
    try {
      localStorage.setItem(STORAGE_KEY_DELETED_MOCKS, JSON.stringify(Array.from(ids)));
    } catch {}

    return ids;
  } catch (err) {
    console.warn('[SupabaseMockService] Error fetching deleted mock IDs:', err);
    try {
      const raw = localStorage.getItem(STORAGE_KEY_DELETED_MOCKS);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch {
      return new Set();
    }
  }
}

/**
 * Fetch all mock tests from Supabase PostgreSQL
 */
export async function fetchMockTestsFromSupabase(): Promise<MockTest[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  try {
    const [mockRes, deletedIds] = await Promise.all([
      supabase.from('custom_mock_tests').select('*').order('published_at', { ascending: false }),
      fetchDeletedMockTestIdsFromSupabase()
    ]);

    if (mockRes.error) {
      console.warn('[SupabaseMockService] Query error:', mockRes.error.message);
      return [];
    }

    const rows: CustomMockTestRow[] = mockRes.data || [];
    const tests = rows
      .filter((r) => !deletedIds.has(r.id))
      .map(rowToMockTest);

    // Cache to localStorage for instant offline access
    try {
      localStorage.setItem(STORAGE_KEY_CACHED_MOCKS, JSON.stringify(tests));
    } catch {}

    return tests;
  } catch (err) {
    console.warn('[SupabaseMockService] Fetch exception:', err);
    return [];
  }
}

/**
 * Save or publish a mock test to Supabase PostgreSQL (both custom_mock_tests and published_papers)
 */
export async function saveMockTestToSupabase(
  test: MockTest,
  publishedBy = 'admin'
): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    return false;
  }

  try {
    const row = mockTestToRow(test, publishedBy);

    // 1. Remove from deleted_mock_tests if previously deleted
    await supabase.from('deleted_mock_tests').delete().eq('id', test.id);

    // 2. Upsert into custom_mock_tests
    const { error: mockErr } = await supabase
      .from('custom_mock_tests')
      .upsert(row, { onConflict: 'id' });

    if (mockErr) {
      console.warn('[SupabaseMockService] custom_mock_tests upsert error:', mockErr.message);
    }

    // 3. Upsert into published_papers table
    const allQuestions: MCQQuestion[] = (test.sections || []).flatMap((s) => s.questions || []);
    const paperRow = {
      id: test.id,
      exam_id: test.examId || 'general',
      exam_name: test.title,
      year: new Date().getFullYear(),
      paper_type: test.paperName || 'CBT Mock Exam',
      total_questions: allQuestions.length,
      download_available: true,
      frequency_tags: [test.examId || 'general'],
      questions: allQuestions,
      published_at: new Date().toISOString(),
      published_by: publishedBy,
      source: 'admin-studio'
    };

    const { error: paperErr } = await supabase
      .from('published_papers')
      .upsert(paperRow, { onConflict: 'id' });

    if (paperErr) {
      console.warn('[SupabaseMockService] published_papers upsert error:', paperErr.message);
    }

    // 4. Batch save questions to questions table in background
    if (allQuestions.length > 0) {
      batchSaveQuestionsToSupabase(allQuestions).catch((e) => {
        console.warn('[SupabaseMockService] Background question save notice:', e);
      });
    }

    // 5. Update local deleted blacklist cache to remove this test
    try {
      const raw = localStorage.getItem(STORAGE_KEY_DELETED_MOCKS);
      if (raw) {
        const set = new Set(JSON.parse(raw));
        set.delete(test.id);
        localStorage.setItem(STORAGE_KEY_DELETED_MOCKS, JSON.stringify(Array.from(set)));
      }
    } catch {}

    return !mockErr;
  } catch (err) {
    console.warn('[SupabaseMockService] Save exception:', err);
    return false;
  }
}

/**
 * Permanently delete a mock test from Supabase PostgreSQL across custom_mock_tests,
 * published_papers, and register it in deleted_mock_tests
 */
export async function deleteMockTestFromSupabase(
  testId: string,
  deletedBy = 'admin'
): Promise<boolean> {
  // 1. Immediately update local storage blacklist so UI is reactive
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DELETED_MOCKS);
    const set = new Set(raw ? JSON.parse(raw) : []);
    set.add(testId);
    localStorage.setItem(STORAGE_KEY_DELETED_MOCKS, JSON.stringify(Array.from(set)));
  } catch {}

  if (!isSupabaseConfigured || !supabase) {
    return true;
  }

  try {
    // 2. Add to deleted_mock_tests table so all other tabs, devices, and sessions block it
    const { error: delRecordErr } = await supabase
      .from('deleted_mock_tests')
      .upsert({ id: testId, deleted_at: new Date().toISOString(), deleted_by: deletedBy }, { onConflict: 'id' });

    if (delRecordErr) {
      console.warn('[SupabaseMockService] deleted_mock_tests record error:', delRecordErr.message);
    }

    // 3. Delete from custom_mock_tests
    const { error: mockErr } = await supabase
      .from('custom_mock_tests')
      .delete()
      .eq('id', testId);

    if (mockErr) {
      console.warn('[SupabaseMockService] custom_mock_tests delete error:', mockErr.message);
    }

    // 4. Delete from published_papers
    const { error: paperErr } = await supabase
      .from('published_papers')
      .delete()
      .eq('id', testId);

    if (paperErr) {
      console.warn('[SupabaseMockService] published_papers delete error:', paperErr.message);
    }

    return true;
  } catch (err) {
    console.warn('[SupabaseMockService] Delete exception:', err);
    return false;
  }
}

/**
 * Restore all deleted mock tests in Supabase
 */
export async function restoreDeletedMockTestsInSupabase(): Promise<boolean> {
  try {
    localStorage.removeItem(STORAGE_KEY_DELETED_MOCKS);
  } catch {}

  if (!isSupabaseConfigured || !supabase) {
    return true;
  }

  try {
    // Delete all records from deleted_mock_tests
    const { error } = await supabase
      .from('deleted_mock_tests')
      .delete()
      .neq('id', '___non_existent___');

    if (error) {
      console.warn('[SupabaseMockService] restore delete error:', error.message);
    }
    return !error;
  } catch (err) {
    console.warn('[SupabaseMockService] Restore exception:', err);
    return false;
  }
}

/**
 * Subscribe to realtime changes on custom_mock_tests and deleted_mock_tests
 */
export function subscribeToMockTestChanges(onChange: () => void): () => void {
  if (!isSupabaseConfigured || !supabase) {
    return () => {};
  }

  try {
    const channel = supabase
      .channel('mock-tests-realtime-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'custom_mock_tests' },
        () => {
          onChange();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'deleted_mock_tests' },
        () => {
          onChange();
        }
      )
      .subscribe();

    return () => {
      try {
        supabase?.removeChannel(channel);
      } catch {}
    };
  } catch (err) {
    console.warn('[SupabaseMockService] Realtime subscription error:', err);
    return () => {};
  }
}
