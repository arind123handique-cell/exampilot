import { MCQQuestion } from '../types';
import { saveSqlDatabaseDump } from './sqlQuestionService';
import { isSupabaseConfigured } from './supabaseClient';
import { batchSaveQuestionsToSupabase, deleteQuestionFromSupabase } from './supabaseQuestionService';
import { setCloudDocs, queryCloudDocs, deleteCloudDoc } from './supabaseDocStore';

const STORAGE_KEY = 'exampilot_custom_questions_bank';

function getLocalQuestions(): MCQQuestion[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('[CustomQuestionDb] LocalStorage read failed:', e);
    return [];
  }
}

function setLocalQuestions(questions: MCQQuestion[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
    window.dispatchEvent(new CustomEvent('exampilot_custom_questions_updated', { detail: questions }));
  } catch (e) {
    console.warn('[CustomQuestionDb] LocalStorage write failed:', e);
  }
}

/**
 * Saves one or more custom questions to Supabase (bulk + timeout protected) and LocalStorage
 */
export async function saveCustomQuestions(
  questions: MCQQuestion[],
  userId?: string
): Promise<{ success: boolean; count: number }> {
  // Filter out any questions with empty stem or no options
  const validQuestions = (questions || []).filter(
    q => q && typeof q.stem === 'string' && q.stem.trim().length > 0
  );

  if (validQuestions.length === 0) {
    return { success: true, count: 0 };
  }

  // 1. Sanitize and prepare records
  const sanitized = validQuestions.map((q, idx) => {
    const validId =
      q.id && typeof q.id === 'string' && q.id.trim().length > 0
        ? q.id.trim()
        : `custom-q-${Date.now()}-${idx + 1}-${Math.random().toString(36).slice(2, 6)}`;

    return {
      ...q,
      id: validId,
      subtopic: q.subtopic ?? null,
      codeSnippet: q.codeSnippet ?? null,
      formulaContext: q.formulaContext ?? null,
      referenceSource: q.referenceSource ?? 'ExamPilot AI Studio (Gemini 3.8 Flash)',
      solutionSteps: q.solutionSteps ?? null,
      answerUnit: q.answerUnit ?? null,
      pyqYear: q.pyqYear ?? null,
      pyqExam: q.pyqExam ?? null,
      sourceType: q.sourceType ?? 'AI_GENERATED',
      questionType: q.questionType ?? 'CONCEPTUAL',
      isCustom: true,
      createdByUserId: userId && userId.trim() ? userId : 'anonymous',
      updatedAt: new Date().toISOString()
    };
  });

  // 2. Save to LocalStorage immediately for zero-latency local availability
  const existing = getLocalQuestions();
  const existingMap = new Map<string, MCQQuestion>();
  existing.forEach(q => existingMap.set(q.id, q));
  sanitized.forEach(q => existingMap.set(q.id, q as MCQQuestion));
  const merged = Array.from(existingMap.values());
  setLocalQuestions(merged);
  saveSqlDatabaseDump(merged);

  // 3. Batch sync to Supabase `questions` (primary project-wide query target)
  if (isSupabaseConfigured) {
    batchSaveQuestionsToSupabase(sanitized as MCQQuestion[]).catch(err => {
      console.warn('[CustomQuestionDb] Supabase background sync notice:', err);
    });

    // 4. Mirror into the app_docs `custom_questions` collection — the listing
    //    source for getCustomQuestions (replaces the Firestore collection).
    setCloudDocs(
      'custom_questions',
      sanitized.map(q => ({
        id: q.id,
        data: q,
        userId: q.createdByUserId && q.createdByUserId !== 'anonymous' ? q.createdByUserId : undefined,
        sortKey: q.updatedAt
      }))
    ).catch(err => {
      console.warn('[CustomQuestionDb] Supabase custom_questions sync notice:', err);
    });
  }

  return { success: true, count: sanitized.length };
}

/**
 * Fetches all custom questions, merging Supabase with LocalStorage
 */
export async function getCustomQuestions(userId?: string): Promise<MCQQuestion[]> {
  const localQuestions = getLocalQuestions();

  if (isSupabaseConfigured) {
    try {
      const fetchPromise = queryCloudDocs<MCQQuestion>('custom_questions', {
        userId: userId && userId !== 'anonymous' ? userId : undefined,
        limit: 250
      }).then(cloudList => {
        if (cloudList.length > 0) {
          const map = new Map<string, MCQQuestion>();
          cloudList.forEach(q => map.set(q.id, q));
          localQuestions.forEach(q => {
            if (!map.has(q.id)) map.set(q.id, q);
          });
          const combined = Array.from(map.values());
          setLocalQuestions(combined);
          return combined;
        }
        return localQuestions;
      });

      const timeoutPromise = new Promise<MCQQuestion[]>(resolve =>
        setTimeout(() => resolve(localQuestions), 3000)
      );

      return await Promise.race([fetchPromise, timeoutPromise]);
    } catch (err) {
      console.warn('[CustomQuestionDb] Supabase fetch error, using local storage cache:', err);
    }
  }

  return localQuestions;
}

/**
 * Deletes a single custom question by ID from Supabase and LocalStorage
 */
export async function deleteCustomQuestion(questionId: string, userId?: string): Promise<void> {
  if (!questionId) return;

  const existing = getLocalQuestions();
  const filtered = existing.filter(q => q.id !== questionId);
  setLocalQuestions(filtered);

  if (isSupabaseConfigured) {
    try {
      await Promise.allSettled([
        deleteCloudDoc('custom_questions', questionId),
        deleteQuestionFromSupabase(questionId)
      ]);
    } catch (err) {
      console.warn('[CustomQuestionDb] Supabase delete failed:', err);
    }
  }
}

/**
 * Clears all custom questions
 */
export async function clearAllCustomQuestions(userId?: string): Promise<void> {
  setLocalQuestions([]);
}
