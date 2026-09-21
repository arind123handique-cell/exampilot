/**
 * ADMIN CUSTOM MOCK TEST MAKER & QUALITY CONTROL SERVICE
 *
 * Provides:
 * 1. Question Bank query engine with hierarchical topic & difficulty filtering
 * 2. AI Question Generation with factual grounding (Testbook / official exam patterns)
 * 3. Hybrid synthesizer (exact bank + AI question split)
 * 4. Automated AI Quality Control (QC) validation
 * 5. Test assembly, database save & live paper publishing
 */

import { MCQQuestion, MockTest, MockSection, PYQPaper } from '../types';
import { ALL_QUESTIONS, CIVIL_ENGINEERING_QUESTIONS, GENERAL_STUDIES_QUESTIONS } from '../data/mockData';
import { saveCustomQuestions } from './customQuestionDb';
import { publishAdminPaper, getAdminPublishedPapers, getAllCombinedMockTests } from './adminPaperService';
import { getActiveAiProvider, logAiGeneration } from './aiProviderManagement';
import { generateMockTestQuestions, hasLiveAi } from './geminiService';

export type QuestionSourceMode = 'QUESTION_BANK' | 'AI_GENERATED' | 'HYBRID';

export interface DifficultyDistribution {
  easyPercent: number;
  mediumPercent: number;
  hardPercent: number;
}

export interface CustomMockMakerConfig {
  testTitle: string;
  examId: string;
  branch: 'civil' | 'gs' | 'mechanical' | 'electrical' | 'all';
  subject: string;
  selectedTopics: string[];
  customTopicInput?: string;
  description: string;
  instructions: string;
  totalQuestionCount: number;
  sourceMode: QuestionSourceMode;
  bankQuestionCount: number;
  aiQuestionCount: number;
  difficultyDistribution: DifficultyDistribution;
  examLevel: 'Basic' | 'Intermediate' | 'Advanced' | 'Competitive' | 'UPSC_ESE' | 'State_PSC' | 'SSC_JE' | 'GATE' | 'Custom';
  durationMinutes: number;
  marksPerQuestion: number;
  negativeMarksPerQuestion: number;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  enableFactualGrounding: boolean;
  groundingSources: string[];
}

export interface QuestionQcReport {
  questionId: string;
  passed: boolean;
  hasValidAnswer: boolean;
  hasPlausibleDistractors: boolean;
  hasExplanation: boolean;
  isDuplicate: boolean;
  matchesTopic: boolean;
  issues: string[];
  suggestions: string[];
}

export interface GenerationResult {
  questions: MCQQuestion[];
  qcReports: Record<string, QuestionQcReport>;
  overallQualityScore: number;
  bankCount: number;
  aiCount: number;
  sourceMode: QuestionSourceMode;
}

/**
 * Normalizes text for fuzzy duplicate detection
 */
function normalizeForComparison(text: string): string {
  return (text || '')
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Get all available questions across static and dynamic databases
 */
export function getMasterQuestionPool(): MCQQuestion[] {
  try {
    const published = getAdminPublishedPapers().flatMap((p) => p.questions);
    const custom = (() => {
      try {
        const raw = localStorage.getItem('exampilot_custom_questions_bank');
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    })();

    const map = new Map<string, MCQQuestion>();
    [...published, ...custom, ...ALL_QUESTIONS].forEach((q) => {
      if (q && q.id && !map.has(q.id)) {
        map.set(q.id, q);
      }
    });
    return Array.from(map.values());
  } catch (err) {
    console.warn('[AdminMockMakerService] Pool load error:', err);
    return ALL_QUESTIONS;
  }
}

/**
 * Performs comprehensive AI Quality Control on a question
 */
export function evaluateQuestionQc(q: MCQQuestion, existingPool: MCQQuestion[] = []): QuestionQcReport {
  const issues: string[] = [];
  const suggestions: string[] = [];

  // 1. Answer Key Check
  const validKeys = ['A', 'B', 'C', 'D'];
  const hasValidAnswer = validKeys.includes(q.correctOption);
  if (!hasValidAnswer) {
    issues.push(`Invalid correct option key "${q.correctOption}". Must be A, B, C, or D.`);
  }

  // 2. Options & Distractors Check
  let hasPlausibleDistractors = true;
  if (!q.options || q.options.length < 4) {
    hasPlausibleDistractors = false;
    issues.push(`Question has only ${q.options ? q.options.length : 0} options. Exactly 4 options required.`);
  } else {
    const texts = q.options.map((o) => normalizeForComparison(o.text));
    const unique = new Set(texts);
    if (unique.size < q.options.length) {
      hasPlausibleDistractors = false;
      issues.push('Question contains duplicate option choices.');
    }
    const emptyOptions = q.options.filter((o) => !o.text || o.text.trim().length === 0);
    if (emptyOptions.length > 0) {
      hasPlausibleDistractors = false;
      issues.push(`${emptyOptions.length} option(s) are blank.`);
    }
  }

  // 3. Explanation Check
  const hasExplanation = Boolean(q.explanation && q.explanation.trim().length >= 15);
  if (!hasExplanation) {
    issues.push('Explanation is missing or too brief (minimum 15 characters required).');
    suggestions.push('Provide step-by-step rationale for why the correct answer is valid.');
  }

  // 4. Duplicate Check
  let isDuplicate = false;
  const normalizedStem = normalizeForComparison(q.stem);
  if (normalizedStem.length > 10) {
    for (const other of existingPool) {
      if (other.id !== q.id && normalizeForComparison(other.stem) === normalizedStem) {
        isDuplicate = true;
        issues.push(`Duplicate stem found in existing database (matches ID: ${other.id}).`);
        break;
      }
    }
  }

  // 5. Stem length check
  if (!q.stem || q.stem.trim().length < 10) {
    issues.push('Question stem is too short or empty.');
  }

  const matchesTopic = Boolean(q.subject && q.topic);
  const passed = hasValidAnswer && hasPlausibleDistractors && hasExplanation && !isDuplicate && issues.length === 0;

  return {
    questionId: q.id,
    passed,
    hasValidAnswer,
    hasPlausibleDistractors,
    hasExplanation,
    isDuplicate,
    matchesTopic,
    issues,
    suggestions
  };
}

/**
 * Filter questions from question bank matching criteria
 */
export function queryQuestionBank(
  pool: MCQQuestion[],
  config: {
    branch?: string;
    subject?: string;
    topics?: string[];
    count: number;
    distribution: DifficultyDistribution;
    examLevel?: string;
  }
): MCQQuestion[] {
  let filtered = [...pool];

  // Branch filter
  if (config.branch && config.branch !== 'all') {
    if (config.branch === 'civil') {
      filtered = filtered.filter(
        (q) => !q.examId?.includes('dwr') && !q.subject?.toLowerCase().includes('general')
      );
    } else if (config.branch === 'gs') {
      filtered = filtered.filter(
        (q) => q.examId?.includes('dwr') || q.subject?.toLowerCase().includes('general') || q.subject?.toLowerCase().includes('polity')
      );
    }
  }

  // Subject filter
  if (config.subject && config.subject !== 'ALL') {
    const subQuery = config.subject.toLowerCase();
    filtered = filtered.filter((q) => q.subject && q.subject.toLowerCase().includes(subQuery));
  }

  // Topic filter
  if (config.topics && config.topics.length > 0) {
    const topicNorms = config.topics.map((t) => t.toLowerCase());
    const matched = filtered.filter((q) => {
      const qTopic = (q.topic || '').toLowerCase();
      const qSubtopic = (q.subtopic || '').toLowerCase();
      const qStem = (q.stem || '').toLowerCase();
      return topicNorms.some(
        (t) => qTopic.includes(t) || qSubtopic.includes(t) || qStem.includes(t)
      );
    });
    // If strict topic filter has matches, use it; otherwise fallback to subject pool
    if (matched.length >= config.count / 2) {
      filtered = matched;
    }
  }

  // Split by difficulty target
  const easyTarget = Math.round((config.distribution.easyPercent / 100) * config.count);
  const hardTarget = Math.round((config.distribution.hardPercent / 100) * config.count);
  const mediumTarget = Math.max(0, config.count - easyTarget - hardTarget);

  const easyPool = filtered.filter((q) => q.difficulty === 'EASY');
  const medPool = filtered.filter((q) => q.difficulty === 'MEDIUM');
  const hardPool = filtered.filter((q) => q.difficulty === 'HARD');

  const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

  const selectedEasy = shuffle(easyPool).slice(0, easyTarget);
  const selectedMed = shuffle(medPool).slice(0, mediumTarget);
  const selectedHard = shuffle(hardPool).slice(0, hardTarget);

  const selectedSet = new Set([...selectedEasy, ...selectedMed, ...selectedHard].map((q) => q.id));
  const remainingNeeded = config.count - selectedSet.size;

  if (remainingNeeded > 0) {
    const unused = shuffle(filtered.filter((q) => !selectedSet.has(q.id)));
    selectedSet.add(unused.slice(0, remainingNeeded).map((q) => q.id).join(','));
  }

  const finalPool = filtered.filter((q) => selectedSet.has(q.id));
  return shuffle(finalPool).slice(0, config.count);
}

/**
 * Generate questions using configured AI provider with factual grounding
 */
export async function generateAiQuestionsForMaker(
  config: CustomMockMakerConfig,
  countNeeded: number
): Promise<{ questions: MCQQuestion[]; provider: string; model: string; executionTimeMs: number }> {
  const startTime = Date.now();
  const provider = getActiveAiProvider();
  const activeTopics = config.selectedTopics.length > 0
    ? config.selectedTopics.join(', ')
    : config.subject || 'Civil Engineering Core Concepts';

  const groundingPrompt = config.enableFactualGrounding
    ? `Reference factual patterns calibrated from official examination syllabi (such as Testbook, UPSC ESE, APSC AE, IS 456 / IRC / CPWD specifications, and Wikipedia reference benchmarks). Do not copy copyrighted text verbatim; create novel, original questions grounded in authoritative curriculum facts.`
    : `Use authoritative textbook engineering definitions and competitive exam patterns.`;

  const examLevelLabel = config.examLevel.replace(/_/g, ' ');

  try {
    const generated = await generateMockTestQuestions({
      topicQuery: `${config.subject}: ${activeTopics}`,
      category: config.branch === 'gs' ? 'gs' : 'civil',
      questionCount: countNeeded,
      examName: `${config.testTitle} (${examLevelLabel}) — ${groundingPrompt}`,
      questionStyle: config.difficultyDistribution.hardPercent > 40 ? 'numerical' : 'mixed'
    });

    const executionTimeMs = Date.now() - startTime;

    // Stamp provenance metadata
    const stampedQuestions: MCQQuestion[] = (generated || []).map((q, idx) => ({
      ...q,
      id: `ai-custom-${Date.now()}-${idx + 1}-${Math.random().toString(36).slice(2, 5)}`,
      subject: config.subject || q.subject || 'Engineering',
      topic: config.selectedTopics[idx % Math.max(1, config.selectedTopics.length)] || q.topic || 'General',
      examId: config.examId,
      sourceType: 'AI_GENERATED',
      referenceSource: `${provider.name} (${provider.defaultModel}) · Grounded Fact Engine`,
      difficulty: q.difficulty || (idx % 3 === 0 ? 'HARD' : idx % 2 === 0 ? 'MEDIUM' : 'EASY')
    }));

    // Log to AI generation history
    logAiGeneration({
      topic: activeTopics,
      subject: config.subject,
      branch: config.branch,
      examLevel: config.examLevel,
      provider: provider.id,
      model: provider.defaultModel,
      questionCount: stampedQuestions.length,
      mode: config.sourceMode === 'HYBRID' ? 'HYBRID' : 'AI_GENERATED',
      executionTimeMs,
      status: stampedQuestions.length > 0 ? 'SUCCESS' : 'FAILED',
      promptSnippet: `Topic: ${activeTopics} | Count: ${countNeeded} | Level: ${examLevelLabel}`,
      generatedQuestions: stampedQuestions
    });

    return {
      questions: stampedQuestions,
      provider: provider.name,
      model: provider.defaultModel,
      executionTimeMs
    };
  } catch (err: any) {
    const executionTimeMs = Date.now() - startTime;
    console.error('[AdminMockMakerService] AI generation error:', err);

    logAiGeneration({
      topic: activeTopics,
      subject: config.subject,
      branch: config.branch,
      examLevel: config.examLevel,
      provider: provider.id,
      model: provider.defaultModel,
      questionCount: 0,
      mode: config.sourceMode === 'HYBRID' ? 'HYBRID' : 'AI_GENERATED',
      executionTimeMs,
      status: 'FAILED',
      errorMessage: err?.message || 'Unknown generation error',
      promptSnippet: `Topic: ${activeTopics} | Count: ${countNeeded}`,
      generatedQuestions: []
    });

    throw err;
  }
}

/**
 * Main Orchestrator: Assemble Questions based on selected Source Mode
 */
export async function assembleCustomMockQuestions(
  config: CustomMockMakerConfig,
  onProgress?: (step: string) => void
): Promise<GenerationResult> {
  const masterPool = getMasterQuestionPool();
  let bankQuestions: MCQQuestion[] = [];
  let aiQuestions: MCQQuestion[] = [];

  const targetCount = config.totalQuestionCount;

  if (config.sourceMode === 'QUESTION_BANK') {
    onProgress?.('Querying existing question bank...');
    bankQuestions = queryQuestionBank(masterPool, {
      branch: config.branch,
      subject: config.subject,
      topics: config.selectedTopics,
      count: targetCount,
      distribution: config.difficultyDistribution,
      examLevel: config.examLevel
    });

    // If bank pool falls short, supplement with closest questions
    if (bankQuestions.length < targetCount) {
      const needed = targetCount - bankQuestions.length;
      const seen = new Set(bankQuestions.map((q) => q.id));
      const backup = masterPool.filter((q) => !seen.has(q.id)).slice(0, needed);
      bankQuestions.push(...backup);
    }
  } else if (config.sourceMode === 'AI_GENERATED') {
    onProgress?.('Synthesizing questions via AI engine with factual grounding...');
    const result = await generateAiQuestionsForMaker(config, targetCount);
    aiQuestions = result.questions;
  } else if (config.sourceMode === 'HYBRID') {
    const bankTarget = Math.min(targetCount, Math.max(1, config.bankQuestionCount || Math.floor(targetCount / 2)));
    const aiTarget = targetCount - bankTarget;

    onProgress?.(`Extracting ${bankTarget} questions from bank and synthesizing ${aiTarget} via AI...`);

    bankQuestions = queryQuestionBank(masterPool, {
      branch: config.branch,
      subject: config.subject,
      topics: config.selectedTopics,
      count: bankTarget,
      distribution: config.difficultyDistribution,
      examLevel: config.examLevel
    });

    const aiResult = await generateAiQuestionsForMaker(config, aiTarget);
    aiQuestions = aiResult.questions;
  }

  // Combine and de-duplicate
  const combined = [...bankQuestions, ...aiQuestions];
  const seenIds = new Set<string>();
  const seenStems = new Set<string>();
  const finalQuestions: MCQQuestion[] = [];

  for (const q of combined) {
    const norm = normalizeForComparison(q.stem);
    if (!seenIds.has(q.id) && !seenStems.has(norm)) {
      seenIds.add(q.id);
      seenStems.add(norm);
      finalQuestions.push(q);
    }
  }

  // Run AI Quality Control on all questions
  onProgress?.('Running automated AI Quality Control checks...');
  const qcReports: Record<string, QuestionQcReport> = {};
  let passedCount = 0;

  finalQuestions.forEach((q) => {
    const report = evaluateQuestionQc(q, masterPool);
    qcReports[q.id] = report;
    if (report.passed) passedCount++;
  });

  const overallQualityScore = finalQuestions.length > 0
    ? Math.round((passedCount / finalQuestions.length) * 100)
    : 100;

  return {
    questions: finalQuestions,
    qcReports,
    overallQualityScore,
    bankCount: bankQuestions.length,
    aiCount: aiQuestions.length,
    sourceMode: config.sourceMode
  };
}

/**
 * Saves approved questions to the Question Bank and constructs/publishes the Mock Test
 */
export async function finalizeAndPublishCustomMock(
  config: CustomMockMakerConfig,
  approvedQuestions: MCQQuestion[],
  saveToQuestionBank: boolean = true
): Promise<MockTest> {
  // 1. Save new questions to custom database
  if (saveToQuestionBank) {
    await saveCustomQuestions(approvedQuestions, 'admin');
  }

  // 2. Build MockSections (default: single cohesive section or split by topics)
  const sectionId = `sec-${Date.now()}`;
  const mockSection: MockSection = {
    id: sectionId,
    name: `${config.subject || 'Comprehensive'} Section (${approvedQuestions.length} Questions)`,
    totalQuestions: approvedQuestions.length,
    questions: config.randomizeQuestions
      ? [...approvedQuestions].sort(() => Math.random() - 0.5)
      : approvedQuestions
  };

  const mockTestId = `mock-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const newMockTest: MockTest = {
    id: mockTestId,
    title: config.testTitle,
    examId: config.examId,
    paperName: `${config.subject} — ${config.examLevel.replace(/_/g, ' ')} (${approvedQuestions.length} MCQs)`,
    durationMinutes: config.durationMinutes,
    totalMarks: approvedQuestions.length * config.marksPerQuestion,
    negativeMarksPerIncorrect: config.negativeMarksPerQuestion,
    sections: [mockSection]
  };

  // 3. Build PYQPaper record for cloud & local storage publication
  const paperRecord: PYQPaper = {
    id: mockTestId,
    examName: config.testTitle,
    year: new Date().getFullYear(),
    paperType: config.examLevel.replace(/_/g, ' '),
    totalQuestions: approvedQuestions.length,
    downloadAvailable: false,
    frequencyTags: [config.branch, config.subject, ...config.selectedTopics].filter(Boolean),
    questions: approvedQuestions
  };

  // 4. Publish in real-time
  await publishAdminPaper(paperRecord, newMockTest, 'admin');

  return newMockTest;
}
