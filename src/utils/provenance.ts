import { MCQQuestion, QuestionKind, QuestionSourceType } from '../types';

type Provenance = {
  sourceType?: QuestionSourceType;
  questionType?: QuestionKind;
  pyqYear?: number;
  pyqExam?: string;
};

const EXAM_FAMILY: Record<string, string> = {
  'apsc-ae-civil': 'APSC AE',
  'upsc-cse': 'UPSC CSE',
  'ssc-cgl': 'SSC CGL',
  'gate-ce': 'GATE CE'
};

/**
 * Human label for where a question came from.
 *
 * Only a verbatim previous-year paper may be labelled as one. Everything else is
 * presented as modelled or AI-generated, so aspirants are never misled about
 * what they are practising.
 */
export function questionSourceLabel(question: Provenance): string {
  const { sourceType, pyqYear, pyqExam } = question;

  if (sourceType === 'PYQ') {
    return pyqExam ? `${pyqExam}${pyqYear ? ` ${pyqYear}` : ''}` : `Previous year${pyqYear ? ` ${pyqYear}` : ''}`;
  }
  if (sourceType === 'AI_GENERATED') {
    return 'AI generated';
  }
  if (sourceType === 'TEMPLATE_GENERATED') {
    return 'Generated · computed key';
  }
  // MODELLED (default for the shipped corpus)
  const year = pyqYear ? ` ${pyqYear}` : '';
  return `Modelled · ${pyqExam ? pyqExam.replace(/\s*\/?\s*(Testbook\s*)?Model\s*/i, ' ').trim() : 'exam pattern'}${year}`;
}

/** Longer explanation for a tooltip / info affordance. */
export function questionSourceHint(question: Provenance): string {
  switch (question.sourceType) {
    case 'PYQ':
      return 'Actual previous-year question.';
    case 'AI_GENERATED':
      return 'Synthesized by the AI engine, validated against the syllabus. Cross-check the key before relying on it.';
    case 'TEMPLATE_GENERATED':
      return 'Generated from a verified problem template: the answer was computed, not written, so the key is exact.';
    default:
      return 'Written to match this exam’s pattern, syllabus weightage and difficulty — not a verbatim previous-year question.';
  }
}

const KIND_LABEL: Record<QuestionKind, string> = {
  NUMERICAL: 'Numerical',
  FORMULA_RECALL: 'Formula recall',
  CONCEPTUAL: 'Conceptual',
  ASSERTION_REASON: 'Assertion-Reason',
  STATEMENT_BASED: 'Statement-Based (1 & 2)',
  MATCH_FOLLOWING: 'Match Following',
  CHRONOLOGY: 'Chronology',
  CLASSIFICATION: 'Classification',
  SCENARIO: 'Scenario',
  CASE_BASED: 'Case Based',
  DATA_INTERPRETATION: 'Data Interpretation',
  DIAGRAM_INTERPRETATION: 'Diagram Interpretation',
  CODE_RULE_BASED: 'Code/Rule Based'
};

export const questionKindLabel = (kind?: QuestionKind): string | null =>
  kind ? KIND_LABEL[kind] : null;

export const questionFamily = (examId?: string): string | null =>
  examId ? EXAM_FAMILY[examId] ?? null : null;

/** True when the answer must be computed from the given data. */
export const isNumericalQuestion = (question: Pick<MCQQuestion, 'questionType'>): boolean =>
  question.questionType === 'NUMERICAL';
