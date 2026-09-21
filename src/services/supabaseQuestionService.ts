import { MCQQuestion, MCQOption } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface QuestionRow {
  id: string;
  exam_id: string | null;
  question_number: number;
  subject: string;
  topic: string;
  subtopic: string | null;
  stem: string;
  options: MCQOption[] | string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  explanation: string | null;
  formula_context: string | null;
  solution_steps: string[] | null;
  reference_source: string | null;
  difficulty: string;
  question_type: string;
  source_type: string;
  pyq_year: number | null;
  pyq_exam: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Transforms an application MCQQuestion to a Supabase questions table row
 */
export function questionToRow(q: MCQQuestion): QuestionRow {
  const optA = q.options?.find((o) => o.id === 'A')?.text || '';
  const optB = q.options?.find((o) => o.id === 'B')?.text || '';
  const optC = q.options?.find((o) => o.id === 'C')?.text || '';
  const optD = q.options?.find((o) => o.id === 'D')?.text || '';

  return {
    id: q.id,
    exam_id: q.examId || null,
    question_number: q.questionNumber || 1,
    subject: q.subject || 'General Studies',
    topic: q.topic || 'General',
    subtopic: q.subtopic || null,
    stem: q.stem || '',
    options: q.options || [
      { id: 'A', text: optA },
      { id: 'B', text: optB },
      { id: 'C', text: optC },
      { id: 'D', text: optD }
    ],
    option_a: optA,
    option_b: optB,
    option_c: optC,
    option_d: optD,
    correct_option: q.correctOption || 'A',
    explanation: q.explanation || '',
    formula_context: q.formulaContext || null,
    solution_steps: q.solutionSteps || null,
    reference_source: q.referenceSource || 'ExamPilot Catalog',
    difficulty: q.difficulty || 'MEDIUM',
    question_type: q.questionType || 'CONCEPTUAL',
    source_type: q.sourceType || 'OFFICIAL_EXAM',
    pyq_year: q.pyqYear || null,
    pyq_exam: q.pyqExam || null,
    updated_at: new Date().toISOString()
  };
}

/**
 * Transforms a Supabase questions table row back to an application MCQQuestion
 */
export function rowToQuestion(row: QuestionRow): MCQQuestion {
  let parsedOptions: MCQOption[] = [];
  if (Array.isArray(row.options)) {
    parsedOptions = row.options;
  } else if (typeof row.options === 'string') {
    try {
      parsedOptions = JSON.parse(row.options);
    } catch {
      parsedOptions = [];
    }
  }

  if (!parsedOptions || parsedOptions.length === 0) {
    parsedOptions = [
      { id: 'A', text: row.option_a || '' },
      { id: 'B', text: row.option_b || '' },
      { id: 'C', text: row.option_c || '' },
      { id: 'D', text: row.option_d || '' }
    ];
  }

  return {
    id: row.id,
    questionNumber: row.question_number || 1,
    examId: row.exam_id || 'general',
    subject: row.subject,
    topic: row.topic,
    subtopic: row.subtopic || undefined,
    stem: row.stem,
    options: parsedOptions,
    correctOption: (row.correct_option || 'A') as 'A' | 'B' | 'C' | 'D',
    explanation: row.explanation || '',
    formulaContext: row.formula_context || undefined,
    solutionSteps: row.solution_steps || undefined,
    referenceSource: row.reference_source || undefined,
    difficulty: (row.difficulty || 'MEDIUM') as 'EASY' | 'MEDIUM' | 'HARD',
    questionType: row.question_type as any,
    sourceType: row.source_type as any,
    pyqYear: row.pyq_year || undefined,
    pyqExam: row.pyq_exam || undefined
  };
}

/**
 * Fetch questions from Supabase with optional filters
 */
export async function fetchQuestionsFromSupabase(filters?: {
  examId?: string;
  subject?: string;
  limit?: number;
}): Promise<MCQQuestion[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  try {
    let q = supabase
      .from('questions')
      .select('*')
      .order('question_number', { ascending: true });

    if (filters?.examId) {
      q = q.eq('exam_id', filters.examId);
    }
    if (filters?.subject) {
      q = q.eq('subject', filters.subject);
    }
    if (filters?.limit) {
      q = q.limit(filters.limit);
    }

    const { data, error } = await q;
    if (error) {
      console.warn('[SupabaseQuestionService] Query error:', error.message);
      return [];
    }

    return (data || []).map((row: any) => rowToQuestion(row));
  } catch (err) {
    console.warn('[SupabaseQuestionService] Fetch exception:', err);
    return [];
  }
}

/**
 * Upsert a single question to Supabase
 */
export async function saveQuestionToSupabase(question: MCQQuestion): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    return false;
  }

  try {
    const row = questionToRow(question);
    const { error } = await supabase
      .from('questions')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.warn('[SupabaseQuestionService] Upsert error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[SupabaseQuestionService] Upsert exception:', err);
    return false;
  }
}

/**
 * Bulk upsert questions in batches to Supabase
 */
export async function batchSaveQuestionsToSupabase(
  questions: MCQQuestion[],
  batchSize = 100
): Promise<{ success: boolean; inserted: number; failed: number }> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, inserted: 0, failed: questions.length };
  }

  let inserted = 0;
  let failed = 0;

  for (let i = 0; i < questions.length; i += batchSize) {
    const chunk = questions.slice(i, i + batchSize).map(questionToRow);
    try {
      const { error } = await supabase
        .from('questions')
        .upsert(chunk, { onConflict: 'id' });

      if (error) {
        console.warn(`[SupabaseQuestionService] Batch ${i} error:`, error.message);
        failed += chunk.length;
      } else {
        inserted += chunk.length;
      }
    } catch (err) {
      console.warn(`[SupabaseQuestionService] Batch ${i} exception:`, err);
      failed += chunk.length;
    }
  }

  return { success: failed === 0, inserted, failed };
}
