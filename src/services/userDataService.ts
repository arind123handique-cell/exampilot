/**
 * USER DATA SERVICE (Supabase-backed)
 *
 * Formerly src/services/firestore.ts. Cloud persistence for:
 *   - student profiles           → public.profiles
 *   - mock-test submissions      → public.app_docs ('test_submissions')
 *   - full question-bank seeding → public.questions
 *
 * Every function is LocalStorage-first and cloud-best-effort with a hard
 * timeout, exactly like the Firestore implementation it replaced: the UI never
 * waits on the network and falls back to the local cache when Supabase is
 * unreachable, unsigned-in, or unconfigured.
 *
 * Requires the 20260926_auth_and_docs.sql migration to be applied.
 */
import { UserProfile, TestSubmission } from '../types';
import { ALL_QUESTIONS } from '../data/mockData';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { batchSaveQuestionsToSupabase } from './supabaseQuestionService';

// Local storage caching helpers for offline resiliency
const STORAGE_PREFIX = 'exampilot_';

function getLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.error('LocalStorage cache write error:', e);
  }
}

function withTimeout<T>(promise: PromiseLike<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    )
  ]);
}

// ----------------------------------------------------
// 1. User Profile & Preferences (Stored in Supabase: profiles/{uid})
// ----------------------------------------------------
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const cached = getLocal<UserProfile | null>(`profile_${uid}`, null);
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await withTimeout(
        supabase
          .from('profiles')
          .select('data')
          .eq('uid', uid)
          .limit(1),
        2500,
        'getUserProfile'
      );
      if (!error && data && data.length > 0) {
        const profile = data[0].data as UserProfile;
        setLocal(`profile_${uid}`, profile);
        return profile;
      }
    } catch (err: any) {
      console.warn('[ExamPilot] Supabase getUserProfile notice (using local cache):', err.message || err);
    }
  }
  return cached;
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  setLocal(`profile_${profile.uid}`, profile);
  if (isSupabaseConfigured && supabase) {
    try {
      // Non-blocking sync with timeout so auth and UI transitions stay
      // instantaneous — mirrors the old fire-and-forget Firestore setDoc.
      withTimeout(
        supabase
          .from('profiles')
          .upsert(
            {
              uid: profile.uid,
              data: JSON.parse(JSON.stringify(profile)),
              updated_at: new Date().toISOString()
            },
            { onConflict: 'uid' }
          ),
        2500,
        'saveUserProfile'
      ).catch((err) => {
        console.warn('[ExamPilot] Supabase saveUserProfile sync notice:', err.message || err);
      });
    } catch (err) {
      console.warn('[ExamPilot] Supabase saveUserProfile error:', err);
    }
  }
}

/**
 * Full student roster for admin dashboards / telemetry.
 * Used by studentTelemetryService (replaces Firestore `getDocs(collection(users))`).
 */
export async function listAllProfiles(): Promise<UserProfile[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  try {
    const { data, error } = await withTimeout(
      supabase.from('profiles').select('data').limit(2000),
      3500,
      'listAllProfiles'
    );
    if (error || !data) {
      console.warn('[ExamPilot] Supabase listAllProfiles notice:', error?.message || 'no data');
      return [];
    }
    return data.map((row) => row.data as UserProfile).filter((p) => p && p.uid);
  } catch (err: any) {
    console.warn('[ExamPilot] Supabase listAllProfiles notice:', err.message || err);
    return [];
  }
}

/** Cloud delete for an admin-removed student (owner-only RLS may reject; callers tolerate that). */
export async function deleteProfile(uid: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await withTimeout(
      supabase.from('profiles').delete().eq('uid', uid),
      2500,
      'deleteProfile'
    );
    if (error) {
      console.warn('[ExamPilot] Supabase deleteProfile notice:', error.message);
      return false;
    }
    localStorage.removeItem(`exampilot_profile_${uid}`);
    return true;
  } catch (err: any) {
    console.warn('[ExamPilot] Supabase deleteProfile notice:', err.message || err);
    return false;
  }
}

// ----------------------------------------------------
// 2. Mock Test Submissions (Stored in Supabase: app_docs/test_submissions)
// ----------------------------------------------------
export async function submitMockTest(submission: TestSubmission): Promise<void> {
  const localKey = `submissions_${submission.userId}`;
  const existing = getLocal<TestSubmission[]>(localKey, []);
  const updated = [submission, ...existing];
  setLocal(localKey, updated);

  // The cloud write is best-effort and deliberately NOT awaited.
  //
  // The write promise settles on server acknowledgement, so when the backend is
  // unreachable the await can stay pending for a long time. It used to sit on
  // the exam-submit critical path, which meant a student who finished a paper
  // was left staring at the exam screen instead of getting their score.
  // The local write above is the source of truth for the UI; Supabase catches
  // up on its own or times out harmlessly.
  if (isSupabaseConfigured && supabase) {
    void Promise.race([
      supabase
        .from('app_docs')
        .upsert({
          collection: 'test_submissions',
          doc_id: submission.id,
          user_id: submission.userId || null,
          sort_key: submission.submittedAt || new Date().toISOString(),
          data: JSON.parse(JSON.stringify(submission)),
          updated_at: new Date().toISOString()
        }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Supabase submission write timeout')), 4000)
      )
    ]).catch((err) => {
      console.warn('[ExamPilot] submitMockTest cloud sync notice:', err?.message || err);
    });
  }
}

// ----------------------------------------------------
// 3. Question Bank Seeding (Stored in Supabase: questions)
// ----------------------------------------------------

/**
 * Push the entire static question bank into the Supabase `questions` table.
 * Replaces the per-document Firestore seeder (996 individual writes → chunked
 * bulk upserts).
 */
export async function seedSupabaseQuestions(): Promise<{ success: boolean; count: number }> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, count: 0 };
  }

  try {
    const result = await batchSaveQuestionsToSupabase(ALL_QUESTIONS, 200);
    if (result.success) {
      return { success: true, count: result.inserted };
    }
    return { success: result.inserted > 0, count: result.inserted };
  } catch (err) {
    console.warn('[ExamPilot] seedSupabaseQuestions error:', err);
    return { success: false, count: 0 };
  }
}
