import { KnowledgeModule, MCQQuestion, TopicQuestion } from '../types';
import { TOPIC_KNOWLEDGE_MODULES } from '../data/topicKnowledge';
import { CIVIL_ENGINEERING_QUESTIONS, GENERAL_STUDIES_QUESTIONS, ALL_QUESTIONS } from '../data/mockData';
import { isSupabaseConfigured } from './supabaseClient';
import { batchSaveQuestionsToSupabase, deleteQuestionFromSupabase } from './supabaseQuestionService';
import { setCloudDoc, deleteCloudDoc } from './supabaseDocStore';

const STORAGE_KEY_MODULES = 'exampilot_ai_learned_modules';
const STORAGE_KEY_QUESTIONS = 'exampilot_ai_learned_questions';

function getLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error('LocalStorage read error for key:', key, e);
    return fallback;
  }
}

function setLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('LocalStorage write error for key:', key, e);
  }
}

/**
 * Retrieve all AI-synthesized and learned modules from storage
 */
export function getLearnedModules(): KnowledgeModule[] {
  return getLocal<KnowledgeModule[]>(STORAGE_KEY_MODULES, []);
}

/**
 * Retrieve all AI-synthesized UPSC ESE / IES questions from storage
 */
export function getLearnedQuestions(): MCQQuestion[] {
  return getLocal<MCQQuestion[]>(STORAGE_KEY_QUESTIONS, []);
}

/**
 * Save an AI-synthesized module and its associated UPSC ESE level MCQs into the learning store
 */
export async function saveLearnedModule(
  module: KnowledgeModule,
  newQuestions: MCQQuestion[]
): Promise<void> {
  const existingModules = getLearnedModules();
  const existingQuestions = getLearnedQuestions();

  // Map MCQQuestion to TopicQuestion for immediate in-module practice
  const topicQuestions: TopicQuestion[] = newQuestions.map((q) => ({
    id: q.id,
    stem: q.stem,
    options: q.options as { id: 'A' | 'B' | 'C' | 'D'; text: string }[],
    correctOption: q.correctOption,
    explanation: q.explanation,
    formulaContext: q.formulaContext,
    difficulty: q.difficulty,
    examSource: q.pyqExam || q.referenceSource || 'UPSC ESE / IES Examination',
    topic: q.topic,
    subtopic: q.subtopic
  }));

  const enrichedModule: KnowledgeModule = {
    ...module,
    topicQuestions: [...(module.topicQuestions || []), ...topicQuestions],
    practiceQuestionIds: Array.from(new Set([...module.practiceQuestionIds, ...newQuestions.map((q) => q.id)]))
  };

  // Upsert module
  const updatedModules = [
    enrichedModule,
    ...existingModules.filter((m) => m.id !== module.id)
  ];
  setLocal(STORAGE_KEY_MODULES, updatedModules);

  // Upsert questions
  const newQIds = new Set(newQuestions.map((q) => q.id));
  const updatedQuestions = [
    ...newQuestions,
    ...existingQuestions.filter((q) => !newQIds.has(q.id))
  ];
  setLocal(STORAGE_KEY_QUESTIONS, updatedQuestions);

  // Sync to Supabase if configured
  if (isSupabaseConfigured) {
    try {
      await setCloudDoc('learned_modules', module.id, enrichedModule, {
        sortKey: new Date().toISOString()
      });
      await batchSaveQuestionsToSupabase(newQuestions);
    } catch (err) {
      console.warn('Supabase sync failed for learned module, cached locally:', err);
    }
  }

  // Dispatch custom storage event for immediate cross-component sync
  window.dispatchEvent(new Event('exampilot_learned_update'));
}

/**
 * Remove an AI-learned module and clean up its questions
 */
export async function deleteLearnedModule(moduleId: string): Promise<void> {
  const existingModules = getLearnedModules();
  const target = existingModules.find((m) => m.id === moduleId);
  const updatedModules = existingModules.filter((m) => m.id !== moduleId);
  setLocal(STORAGE_KEY_MODULES, updatedModules);

  if (target) {
    const qIdsToRemove = new Set(target.practiceQuestionIds || []);
    const existingQuestions = getLearnedQuestions();
    const updatedQuestions = existingQuestions.filter((q) => !qIdsToRemove.has(q.id));
    setLocal(STORAGE_KEY_QUESTIONS, updatedQuestions);

    if (isSupabaseConfigured) {
      try {
        await deleteCloudDoc('learned_modules', moduleId);
        await Promise.allSettled(
          Array.from(qIdsToRemove).map((qId) => deleteQuestionFromSupabase(qId))
        );
      } catch (err) {
        console.warn('Supabase delete failed:', err);
      }
    }
  }

  window.dispatchEvent(new Event('exampilot_learned_update'));
}

/**
 * Returns merged array of standard pre-configured modules + all AI-learned modules.
 * This powers SyllabusExplorerPage so learned topics appear immediately!
 */
export function getCombinedModules(): KnowledgeModule[] {
  const learned = getLearnedModules();
  const learnedIds = new Set(learned.map((m) => m.id));
  const staticFiltered = TOPIC_KNOWLEDGE_MODULES.filter((m) => !learnedIds.has(m.id));
  return [...learned, ...staticFiltered];
}

/**
 * Returns merged array of standard MCQs + all AI-generated UPSC ESE MCQs.
 * This powers McqPracticePage and MockTestPage!
 */
export function getCombinedQuestions(paper?: 'civil' | 'gs' | 'all'): MCQQuestion[] {
  const learned = getLearnedQuestions();

  let baseQuestions = ALL_QUESTIONS;
  if (paper === 'civil') {
    baseQuestions = CIVIL_ENGINEERING_QUESTIONS;
  } else if (paper === 'gs') {
    baseQuestions = GENERAL_STUDIES_QUESTIONS;
  }

  const learnedFiltered = learned.filter((q) => {
    if (!paper || paper === 'all') return true;
    if (paper === 'civil') {
      return q.examId?.includes('civil') || q.subject?.toLowerCase().includes('structural') || q.subject?.toLowerCase().includes('civil');
    }
    return q.examId?.includes('upsc') || q.subject?.toLowerCase().includes('polity') || q.subject?.toLowerCase().includes('history') || q.subject?.toLowerCase().includes('geography');
  });

  const learnedIds = new Set(learnedFiltered.map((q) => q.id));
  const baseFiltered = baseQuestions.filter((q) => !learnedIds.has(q.id));

  return [...learnedFiltered, ...baseFiltered];
}

/**
 * Statistics on learned material for progress dashboard
 */
export function getLearnedStats(): {
  totalTopics: number;
  totalQuestions: number;
  subjects: string[];
} {
  const learnedModules = getLearnedModules();
  const learnedQuestions = getLearnedQuestions();
  const subjects = Array.from(new Set(learnedModules.map((m) => m.subject)));

  return {
    totalTopics: learnedModules.length,
    totalQuestions: learnedQuestions.length,
    subjects
  };
}
