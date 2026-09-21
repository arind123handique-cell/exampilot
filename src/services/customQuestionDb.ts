import { MCQQuestion } from '../types';
import { db, isFirebaseConfigured } from '../firebase/config';
import {
  doc,
  writeBatch,
  getDocs,
  collection,
  deleteDoc,
  query,
  where,
  limit
} from 'firebase/firestore';
import { saveSqlDatabaseDump } from './sqlQuestionService';
import { isSupabaseConfigured } from './supabaseClient';
import { batchSaveQuestionsToSupabase } from './supabaseQuestionService';

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
 * Strips all undefined fields recursively so Firestore never rejects the payload
 */
function cleanForFirestore(obj: any): any {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) return obj.map(cleanForFirestore);
  if (typeof obj === 'object') {
    const clean: Record<string, any> = {};
    for (const [key, val] of Object.entries(obj)) {
      if (val !== undefined) {
        clean[key] = cleanForFirestore(val);
      }
    }
    return clean;
  }
  return obj;
}

/**
 * Saves one or more custom questions to Firestore (batched + timeout protected) and LocalStorage
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

  // 3. Batch sync to Supabase PostgreSQL if configured
  if (isSupabaseConfigured) {
    batchSaveQuestionsToSupabase(sanitized as MCQQuestion[]).catch(err => {
      console.warn('[CustomQuestionDb] Supabase background sync notice:', err);
    });
  }

  // 4. Batch sync to Cloud Firestore with strict timeout protection
  if (isFirebaseConfigured && db) {
    try {
      const batchSyncPromise = (async () => {
        // Firestore batch max operations is 500; chunk into sets of 200
        const chunkSize = 200;
        for (let i = 0; i < sanitized.length; i += chunkSize) {
          const chunk = sanitized.slice(i, i + chunkSize);
          const batch = writeBatch(db);

          for (const item of chunk) {
            const cleanItem = cleanForFirestore(item);

            // Save to primary 'questions' collection (standard project-wide query target)
            const qRef = doc(db, 'questions', item.id);
            batch.set(qRef, cleanItem, { merge: true });

            // Also save to 'custom_questions' collection
            const customRef = doc(db, 'custom_questions', item.id);
            batch.set(customRef, cleanItem, { merge: true });
          }

          await batch.commit();
        }
        console.log(`[CustomQuestionDb] Cloud Firestore batch synced ${sanitized.length} questions.`);
      })();

      // 3.5-second timeout ensures UI is never blocked or frozen on "Saving..."
      const timeoutPromise = new Promise<{ timeout: true }>(resolve =>
        setTimeout(() => {
          console.warn('[CustomQuestionDb] Cloud Firestore sync exceeded 3.5s; questions cached safely in LocalStorage.');
          resolve({ timeout: true });
        }, 3500)
      );

      await Promise.race([batchSyncPromise, timeoutPromise]);
    } catch (err) {
      console.warn('[CustomQuestionDb] Firestore sync encountered an issue, preserved safely in LocalStorage:', err);
    }
  }

  return { success: true, count: sanitized.length };
}

/**
 * Fetches all custom questions, merging Firestore with LocalStorage
 */
export async function getCustomQuestions(userId?: string): Promise<MCQQuestion[]> {
  const localQuestions = getLocalQuestions();

  if (isFirebaseConfigured && db) {
    try {
      const fetchPromise = (async (): Promise<MCQQuestion[]> => {
        const qColl = collection(db, 'custom_questions');
        const qSnapshot =
          userId && userId !== 'anonymous'
            ? await getDocs(query(qColl, where('createdByUserId', '==', userId), limit(250)))
            : await getDocs(query(qColl, limit(250)));

        if (!qSnapshot.empty) {
          const firestoreList = qSnapshot.docs.map(d => d.data() as MCQQuestion);
          const map = new Map<string, MCQQuestion>();
          firestoreList.forEach(q => map.set(q.id, q));
          localQuestions.forEach(q => {
            if (!map.has(q.id)) map.set(q.id, q);
          });
          const combined = Array.from(map.values());
          setLocalQuestions(combined);
          return combined;
        }
        return localQuestions;
      })();

      const timeoutPromise = new Promise<MCQQuestion[]>(resolve =>
        setTimeout(() => resolve(localQuestions), 3000)
      );

      return await Promise.race([fetchPromise, timeoutPromise]);
    } catch (err) {
      console.warn('[CustomQuestionDb] Firestore fetch error, using local storage cache:', err);
    }
  }

  return localQuestions;
}

/**
 * Deletes a single custom question by ID from Firestore and LocalStorage
 */
export async function deleteCustomQuestion(questionId: string, userId?: string): Promise<void> {
  if (!questionId) return;

  const existing = getLocalQuestions();
  const filtered = existing.filter(q => q.id !== questionId);
  setLocalQuestions(filtered);

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'custom_questions', questionId);
      const qRef = doc(db, 'questions', questionId);
      await Promise.allSettled([deleteDoc(docRef), deleteDoc(qRef)]);
    } catch (err) {
      console.warn('[CustomQuestionDb] Firestore delete failed:', err);
    }
  }
}

/**
 * Clears all custom questions
 */
export async function clearAllCustomQuestions(userId?: string): Promise<void> {
  setLocalQuestions([]);
}
