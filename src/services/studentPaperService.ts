/**
 * STUDENT PAPER SERVICE
 *
 * Backs the portal's "My Papers" section: a student uploads a question paper,
 * gets answers with explanations, and can revisit them later.
 *
 * Three responsibilities:
 *  1. Duplicate control — a question already in the bank (or repeated inside the
 *     same paper) is never added twice. Only the answer/explanation of an
 *     unseen question is pushed to `questions`; every question the student
 *     uploaded is still kept in their own paper for review.
 *  2. Persistence — papers live in the `student_papers` collection of
 *     `app_docs`, which is owner-scoped by RLS, with a LocalStorage mirror so
 *     the list still renders offline.
 *  3. Bank sync — fresh questions are bulk-upserted into the Supabase
 *     `questions` table with a `stem_hash` fingerprint for later checks.
 *
 * Requires the 20260926 + 20260927 migrations.
 */
import { MCQQuestion } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { stemHash, batchSaveQuestionsToSupabase } from './supabaseQuestionService';
import { setCloudDoc, queryCloudDocs, deleteCloudDoc } from './supabaseDocStore';
import { getCombinedQuestions } from './aiKnowledgeStore';

export interface StudentPaperQuestion {
  id: string;
  number: number;
  stem: string;
  options: { id: 'A' | 'B' | 'C' | 'D'; text: string }[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  subject: string;
  topic: string;
  difficulty: string;
  /** True when this question was already in the bank, so it was not re-added. */
  alreadyInBank: boolean;
  /** 'PRINTED' when the paper shows the key, 'MODEL_DERIVED' when AI solved it. */
  answerKeySource: 'PRINTED' | 'MODEL_DERIVED';
  keyConfidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface StudentPaper {
  id: string;
  userId: string;
  title: string;
  examName: string;
  year: number | null;
  subject: string;
  createdAt: string;
  questionCount: number;
  newToBankCount: number;
  duplicateCount: number;
  /** Questions whose answer the model solved rather than read off the paper. */
  aiDerivedKeyCount: number;
  questions: StudentPaperQuestion[];
}

const PAPER_COLLECTION = 'student_papers';
const HASH_CACHE_KEY = 'exampilot_bank_hashes';
const HASH_CACHE_TTL_MS = 15 * 60 * 1000;
const MAX_BANK_ROWS = 3000;

function localKey(userId: string): string {
  return `exampilot_student_papers_${userId || 'guest'}`;
}

function readLocalPapers(userId: string): StudentPaper[] {
  try {
    const raw = localStorage.getItem(localKey(userId));
    return raw ? (JSON.parse(raw) as StudentPaper[]) : [];
  } catch {
    return [];
  }
}

function writeLocalPapers(userId: string, papers: StudentPaper[]): void {
  try {
    localStorage.setItem(localKey(userId), JSON.stringify(papers));
  } catch (err) {
    console.warn('[StudentPaperService] local write failed:', err);
  }
}

/**
 * Fingerprints of every question the bank already holds — the Supabase rows and
 * the statically bundled bank. Fetched once and cached for a short window, so
 * uploading a second paper does not re-download the whole bank.
 */
let bankHashesPromise: Promise<Set<string>> | null = null;

export function invalidateBankHashCache(): void {
  bankHashesPromise = null;
  try {
    sessionStorage.removeItem(HASH_CACHE_KEY);
  } catch {
    // ignore
  }
}

function readHashCache(): Set<string> | null {
  try {
    const raw = sessionStorage.getItem(HASH_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.at || Date.now() - parsed.at > HASH_CACHE_TTL_MS || !Array.isArray(parsed.hashes)) {
      return null;
    }
    return new Set(parsed.hashes as string[]);
  } catch {
    return null;
  }
}

function writeHashCache(hashes: Set<string>): void {
  try {
    sessionStorage.setItem(HASH_CACHE_KEY, JSON.stringify({ at: Date.now(), hashes: Array.from(hashes) }));
  } catch {
    // ignore — a full sessionStorage is not a reason to fail an upload
  }
}

export async function getBankHashes(): Promise<Set<string>> {
  const cached = readHashCache();
  if (cached) return cached;
  if (bankHashesPromise) return bankHashesPromise;

  bankHashesPromise = (async () => {
    const hashes = new Set<string>();

    // The statically bundled + learned bank (fast, local).
    try {
      getCombinedQuestions().forEach((q) => {
        const h = stemHash(q.stem);
        if (h) hashes.add(h);
      });
    } catch (err) {
      console.warn('[StudentPaperService] local bank scan failed:', err);
    }

    // Everything published through Supabase.
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await Promise.race([
          supabase.from('questions').select('stem_hash, stem').limit(MAX_BANK_ROWS),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('bank scan timeout')), 6000)
          )
        ]);
        if (error) throw new Error(error.message);
        (data || []).forEach((row: any) => {
          const h = row?.stem_hash || stemHash(row?.stem || '');
          if (h) hashes.add(h);
        });
      } catch (err: any) {
        // A failed scan must not silently turn every question into a "new"
        // one — the local bank above is still checked, and the notice is logged.
        console.warn('[StudentPaperService] bank scan notice:', err?.message || err);
      }
    }

    writeHashCache(hashes);
    return hashes;
  })();

  try {
    return await bankHashesPromise;
  } finally {
    bankHashesPromise = null;
  }
}

export interface PaperPartition {
  /** Questions that are not already in the bank (deduped within the paper too). */
  fresh: MCQQuestion[];
  /** stem hash -> the question it duplicates, for reporting. */
  duplicates: { question: MCQQuestion; hash: string }[];
}

/**
 * Splits questions into "new to the bank" and "already known", collapsing
 * repeats inside the same upload as well. Pure — takes the known-hash set so
 * it can be tested without touching the network.
 */
export function dedupeAgainstHashes(
  questions: MCQQuestion[],
  known: Set<string>
): PaperPartition {
  const fresh: MCQQuestion[] = [];
  const duplicates: PaperPartition['duplicates'] = [];
  const seenInThisPaper = new Set<string>();

  for (const q of questions) {
    const hash = stemHash(q.stem);
    if (!hash) continue;
    if (known.has(hash) || seenInThisPaper.has(hash)) {
      duplicates.push({ question: q, hash });
      continue;
    }
    seenInThisPaper.add(hash);
    fresh.push(q);
  }

  return { fresh, duplicates };
}

/**
 * Splits extracted questions into "new to the bank" and "already known",
 * collapsing repeats inside the same upload as well.
 */
export async function partitionAgainstBank(questions: MCQQuestion[]): Promise<PaperPartition> {
  return dedupeAgainstHashes(questions, await getBankHashes());
}

function toPaperQuestion(q: MCQQuestion, alreadyInBank: boolean): StudentPaperQuestion {
  const printed = q.answerKeySource === 'PRINTED';
  return {
    id: q.id,
    number: q.questionNumber || 0,
    stem: q.stem,
    options: (q.options || []).map((o) => ({ id: o.id, text: o.text })),
    correctOption: q.correctOption,
    explanation: q.explanation || '',
    subject: q.subject || 'General Studies',
    topic: q.topic || 'General',
    difficulty: q.difficulty || 'MEDIUM',
    alreadyInBank,
    answerKeySource: printed ? 'PRINTED' : 'MODEL_DERIVED',
    keyConfidence: q.keyConfidence || (printed ? 'HIGH' : 'LOW')
  };
}

export interface SavePaperInput {
  userId: string;
  title: string;
  examName: string;
  year: number | null;
  subject: string;
  questions: MCQQuestion[];
}

export interface SavePaperResult {
  paper: StudentPaper;
  /** How many of the fresh questions actually reached the Supabase bank. */
  addedToBank: number;
  bankSynced: boolean;
}

/**
 * Saves the student's paper (all of it, for review) and pushes only the
 * not-yet-seen questions into the shared question bank.
 */
export async function saveStudentPaper(input: SavePaperInput): Promise<SavePaperResult> {
  const { userId, questions } = input;
  if (!userId) throw new Error('Sign in to save an uploaded paper.');

  const { fresh, duplicates } = await partitionAgainstBank(questions);
  const duplicateHashes = new Set(duplicates.map((d) => d.hash));
  const createdAt = new Date().toISOString();
  const paperId = `sp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  const paper: StudentPaper = {
    id: paperId,
    userId,
    title: input.title || input.examName || 'Uploaded paper',
    examName: input.examName || 'Uploaded paper',
    year: input.year ?? null,
    subject: input.subject || 'General Studies',
    createdAt,
    questionCount: questions.length,
    newToBankCount: fresh.length,
    duplicateCount: duplicates.length,
    aiDerivedKeyCount: questions.filter((q) => q.answerKeySource !== 'PRINTED').length,
    questions: questions.map((q) => toPaperQuestion(q, duplicateHashes.has(stemHash(q.stem))))
  };

  // Local mirror first: the list must render even with no network.
  const existing = readLocalPapers(userId).filter((p) => p.id !== paper.id);
  writeLocalPapers(userId, [paper, ...existing].slice(0, 50));

  // Push the unseen questions into the shared bank.
  let addedToBank = 0;
  let bankSynced = false;
  if (fresh.length > 0) {
    const result = await batchSaveQuestionsToSupabase(fresh, 100);
    addedToBank = result.inserted;
    bankSynced = result.inserted > 0;
    if (addedToBank > 0) {
      // New fingerprints are in the bank now — refresh the cached set so a
      // second upload in the same session does not re-add them.
      invalidateBankHashCache();
    }
  }

  // Cloud copy of the paper for cross-device review.
  await setCloudDoc(PAPER_COLLECTION, paper.id, paper, {
    userId,
    sortKey: createdAt
  });

  return { paper, addedToBank, bankSynced };
}

/** The student's papers, newest first. Falls back to the LocalStorage mirror. */
export async function listStudentPapers(userId: string): Promise<StudentPaper[]> {
  const local = readLocalPapers(userId);
  if (!userId || !isSupabaseConfigured) return local;

  const cloud = await queryCloudDocs<StudentPaper>(PAPER_COLLECTION, {
    userId,
    orderBySortKey: true,
    descending: true,
    limit: 50
  });

  if (cloud.length === 0) return local;

  // Merge so a paper saved offline is not hidden by the cloud copy.
  const byId = new Map<string, StudentPaper>();
  [...cloud, ...local].forEach((p) => {
    if (p?.id && !byId.has(p.id)) byId.set(p.id, p);
  });
  const merged = Array.from(byId.values()).sort((a, b) =>
    String(b.createdAt).localeCompare(String(a.createdAt))
  );
  writeLocalPapers(userId, merged.slice(0, 50));
  return merged.slice(0, 50);
}

/** Removes a paper from the portal (cloud + local). Bank questions are kept. */
export async function deleteStudentPaper(paperId: string, userId: string): Promise<void> {
  writeLocalPapers(userId, readLocalPapers(userId).filter((p) => p.id !== paperId));
  if (isSupabaseConfigured) {
    await deleteCloudDoc(PAPER_COLLECTION, paperId);
  }
}
