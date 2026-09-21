export type ExamId = string;

export interface UniversalSubTopicNode {
  id: string;
  name: string;
  concepts: string[];
}

export interface UniversalTopicNode {
  id: string;
  name: string;
  subtopics: UniversalSubTopicNode[];
  weight?: number;
}

export interface UniversalDomainNode {
  id: string;
  name: string;
  topics: UniversalTopicNode[];
}

export interface UniversalSubjectNode {
  id: string;
  name: string;
  domains: UniversalDomainNode[];
}

export interface UniversalExamEntry {
  id: string;
  name: string;
  category: string;
  color: string;
  totalMarks: number;
  durationHours: number;
  description: string;
}

export interface UserPreferences {
  examId: ExamId;
  examName: string;
  advtNumber?: string;
  targetYear: number;
  dailyHoursGoal: number;
  currentStream?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  onboarded: boolean;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous?: boolean;
  preferences: UserPreferences;
  stats: {
    readinessScore: number;
    questionsAttempted: number;
    accuracyRate: number;
    studyStreakDays: number;
    totalStudyHours: number;
  };
  createdAt: string;
}

export interface SubTopic {
  id: string;
  title: string;
  completed: boolean;
  notesCount: number;
  pyqCount: number;
  masteryLevel: number; // 0 - 100
}

export interface SyllabusTopic {
  id: string;
  code: string;
  title: string;
  subject: string;
  weightage: 'HIGH_YIELD' | 'MEDIUM' | 'LOW';
  expectedMarks: number;
  completedSubtopics: number;
  totalSubtopics: number;
  subtopics: SubTopic[];
  overview?: string;
}

export interface DailyGoal {
  id: string;
  title: string;
  subject: string;
  topicId: string;
  minutes: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  type: 'READING' | 'PRACTICE' | 'REVISION' | 'MOCK';
}

export interface StudyMilestone {
  id: string;
  title: string;
  dateRange: string;
  completed: boolean;
  progressPercent: number;
  targetTopics: string[];
}

export interface StudyPlan {
  userId: string;
  examId: string;
  weeklyTargetHours: number;
  dailyGoals: DailyGoal[];
  milestones: StudyMilestone[];
  generatedAt: string;
}

export interface MCQOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface MCQQuestion {
  id: string;
  questionNumber: number;
  examId: string;
  subject: string;
  topic: string;
  subtopic?: string;
  stem: string;
  codeSnippet?: string | null;
  formulaContext?: string | null;
  options: MCQOption[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  referenceSource?: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  /**
   * Provenance. Only 'PYQ' may be presented to the aspirant as a genuine
   * previous-year question. 'MODELLED' means written to match an exam's pattern
   * and difficulty; 'AI_GENERATED' means synthesized on demand.
   */
  sourceType?: QuestionSourceType;
  /**
   * What the student actually has to do. NUMERICAL means the answer must be
   * computed from given data; FORMULA_RECALL means the options are constants or
   * formulas to be remembered; CONCEPTUAL is definitional/statement based.
   */
  questionType?: QuestionKind;
  /** Ordered working shown in the solution view for numerical problems. */
  solutionSteps?: string[];
  /** Unit of the numeric answer, e.g. 'kN·m', 'MPa', 'ha/cumec'. */
  answerUnit?: string;
  /**
   * For MODELLED items this is the exam cycle whose pattern/difficulty the
   * question was calibrated against — NOT the year it was asked. Never render it
   * without the provenance qualifier.
   */
  pyqYear?: number;
  pyqExam?: string;
}

/**
 * Where an item came from.
 *
 * TEMPLATE_GENERATED is separate from AI_GENERATED on purpose: a recipe computes
 * its answer in code from randomised inputs, so its key cannot be wrong, whereas
 * an AI-drafted item is only as good as the model that wrote it. Collapsing the
 * two into "AI generated" misrepresents the most trustworthy content in the bank
 * — and tells a student to distrust it.
 */
export type QuestionSourceType = 'PYQ' | 'MODELLED' | 'AI_GENERATED' | 'TEMPLATE_GENERATED';

export type QuestionKind = 'NUMERICAL' | 'FORMULA_RECALL' | 'CONCEPTUAL' | 'ASSERTION_REASON' | 'STATEMENT_BASED' | 'MATCH_FOLLOWING' | 'CHRONOLOGY' | 'CLASSIFICATION' | 'SCENARIO' | 'CASE_BASED' | 'DATA_INTERPRETATION' | 'DIAGRAM_INTERPRETATION' | 'CODE_RULE_BASED';

/** Difficulty levels used in mock test configuration and generation. */
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard' | 'Mixed' | 'Advanced';

/** Mastery score for a subject/domain/topic. */
export interface MasteryScore {
  subject: string;
  domain: string;
  topic: string;
  mastery: number;
  accuracy: number;
  recentAccuracy: number;
  avgTimePerQuestion: number;
  repeatedMistakes: number;
}

/** ExamBlueprint — per PROMP.txt §26. Defines the structure of an exam. */
export interface ExamBlueprint {
  exam: string;
  paper: string;
  questionCount: number;
  durationMinutes: number;
  negativeMarking: boolean;
  negativeMarksPerIncorrect: number;
  difficultyDistribution: { easy: number; medium: number; hard: number };
  subjectDistribution: Record<string, number>;
  topicDistribution: Record<string, number>;
  questionTypeDistribution: Record<string, number>;
  label?: 'official' | 'AI-generated balanced configuration';
}

/** MockTestConfig — configuration for generating a mock test. */
export interface MockTestConfig {
  examId: string;
  paper: string;
  questionCount: number;
  durationMinutes: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed' | 'Advanced';
  questionTypes: QuestionKind[];
  negativeMarking: boolean;
  negativeMarksPerIncorrect: number;
}

/** AdaptiveMockConfig — extends MockTestConfig with adaptive parameters. */
export interface AdaptiveMockConfig {
  examId: string;
  paper: string;
  questionCount: number;
  durationMinutes: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed' | 'Advanced';
  questionTypes: QuestionKind[];
  negativeMarking: boolean;
  negativeMarksPerIncorrect: number;
  masteryWeights: Record<string, number>;
  weakTopicBias: number;
  recentAccuracy: Record<string, number>;
}

/** RemediationItem — a single step in the AI remediation flow. */
export interface RemediationItem {
  phase: string;
  content: string;
  questions: number;
  type: 'theory' | 'medium' | 'hard' | 'mini-test' | 'retest';
}

/** StudyPlanItem — a week in the AI-generated study plan. */
export interface StudyPlanItem {
  week: number;
  focus: string;
  hours: number;
  activities: string[];
}

export interface MockSection {
  id: string;
  name: string;
  totalQuestions: number;
  questions: MCQQuestion[];
}

export interface MockTest {
  id: string;
  title: string;
  examId: string;
  paperName: string;
  durationMinutes: number;
  totalMarks: number;
  negativeMarksPerIncorrect: number;
  sections: MockSection[];
  isPublishedToStudents?: boolean;
}

export interface TestSubmission {
  id: string;
  testId: string;
  userId: string;
  submittedAt: string;
  timeSpentSeconds: number;
  totalScore: number;
  maxScore: number;
  accuracy: number;
  percentile: number;
  totalAttempted: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  answers: Record<string, {
    selected: 'A' | 'B' | 'C' | 'D' | null;
    isCorrect: boolean;
    timeSeconds: number;
    flagged?: boolean;
    selectedText?: string | null;
    correctText?: string | null;
  }>;
}

export interface AiChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: string[];
  formula?: string;
  suggestedDrill?: {
    topic: string;
    questionCount: number;
  };
}

export interface PYQPaper {
  id: string;
  examName: string;
  year: number;
  paperType: string;
  totalQuestions: number;
  downloadAvailable: boolean;
  frequencyTags: string[];
  questions: MCQQuestion[];
}

export interface BenchmarkExample {
  question: string;
  options?: string[];
  correctAnswer?: string;
  stepByStepSolution: string[];
  takeaway: string;
}

export interface TopicQuestion {
  id: string;
  stem: string;
  options: { id: 'A' | 'B' | 'C' | 'D'; text: string }[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  formulaContext?: string | null;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  examSource?: string;
  /** See MCQQuestion.sourceType — 'MODELLED' items are not verbatim PYQs. */
  sourceType?: QuestionSourceType;
  topic?: string;
  subtopic?: string;
}

export interface KnowledgeStep {
  stepNumber: number;
  stepTitle: string;
  subtitle: string;
  keyConcept: string;
  pointers?: string[];
  formulaOrCode?: string;
  highYieldFacts: string[];
  examTrap?: string;
  benchmarkExample?: BenchmarkExample;
}

export interface KnowledgeModuleCallouts {
  corePostulate: string;
  corePostulateRef?: string;
  examTrap: string;
  examTrapRef?: string;
  testedRatios: { label: string; value: string }[];
  numericalShortcut: { formula: string; note: string };
}

export interface KnowledgeModuleComparisonGrid {
  titleLeft: string;
  tagLeft: string;
  valueLeft: string;
  descLeft: string;
  titleRight: string;
  tagRight: string;
  valueRight: string;
  descRight: string;
}

export interface KnowledgeModuleAiPrompt {
  question: string;
  answerPreview: string;
}

export interface KnowledgeModule {
  id: string;
  title: string;
  subject: string;
  unitName?: string;
  category: 'civil' | 'gs';
  readTime: string;
  weightage: 'HIGH_YIELD' | 'MEDIUM' | 'CORE';
  icon: string;
  codeClause?: string;
  confidencePercent?: number;
  masteredStatus?: 'Mastered' | 'Needs Practice' | 'Weak Area' | 'In Progress';
  subtopicList?: string[];
  summary: string;
  fullDescription?: string;
  syllabusCoverage?: string[];
  prerequisites?: string[];
  standardReferences: string[];
  steps: KnowledgeStep[];
  topicQuestions?: TopicQuestion[];
  practiceQuestionIds: string[];
  callouts?: KnowledgeModuleCallouts;
  comparisonGrid?: KnowledgeModuleComparisonGrid;
  aiTutorPrompts?: KnowledgeModuleAiPrompt[];
  diagramType?: 'rcc' | 'som' | 'geotech' | 'fluids' | 'highway' | 'env' | 'survey' | 'polity' | 'assam' | 'economy';
}

export interface DistractorInfo {
  optionId: string;
  reason: string;
  errorPattern: string;
}

export interface PYQMetadata {
  exam: string;
  year: number;
  paper: string;
  subject: string;
  topic: string;
  concept: string;
  source: string;
  questionType: QuestionKind;
}

export interface QuestionValidationResult {
  status: 'PASS' | 'NEEDS_REVIEW' | 'FAIL';
  issues: string[];
  factualAccuracy: boolean;
  answerCorrectness: boolean;
  uniqueAnswer: boolean;
  logicalConsistency: boolean;
  numericalValidation: boolean;
  ambiguityCheck: boolean;
}

export interface PYQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  metadata: PYQMetadata;
}

export interface DedupResult {
  newId: string;
  existingId: string;
  type: 'exact' | 'semantic' | 'near-duplicate';
}

export interface DistractorSet {
  distractors: string[];
  reasons: string[];
  errorPatterns: string[];
}

export interface GenerationReport {
  requested: number;
  produced: number;
  numerical: number;
  fromRecipes: number;
  aiGenerated: number;
  rejected: number;
  seed: number;
  usedLiveAi: boolean;
  distractorsGenerated: number;
  validationStatus: string;
  dedupedCount: number;
}

