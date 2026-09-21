import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { submitMockTest, saveCustomMockTest, getCustomMockTests } from '../services/firestore';
import {
  CIVIL_ENGINEERING_QUESTIONS,
  GENERAL_STUDIES_QUESTIONS,
  MOCK_TEST_DWR_2026,
  MOCK_TEST_CIVIL_100,
  MOCK_TEST_GS_100,
  MOCK_TEST_IES_CIVIL,
  getQuestionsBySubjectGroup
} from '../data/mockData';
import { getAdminPublishedMockTests } from '../services/adminPaperService';
import { MCQQuestion, MockTest, TestSubmission } from '../types';
import { ActiveTab } from '../components/layout/navConfig';
import { useToast } from '../context/ToastContext';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { Card } from '../components/ui/Card';
import {
  arrangeQuestionsWithGemini,
  ArrangementStrategy,
  ArrangementResult,
  STRATEGY_DETAILS
} from '../services/aiArrangementService';
import { hasLiveAi } from '../services/geminiService';
import { GeminiKeyModal } from '../components/gemini/GeminiKeyModal';
import {
  ClipboardList, PlayCircle, Trophy, CheckCircle2, XCircle, Clock,
  Flag, ChevronLeft, ChevronRight, AlertTriangle, RotateCcw,
  Loader2, Plus, BookOpen, BarChart2, Eye, Target, Zap, RefreshCw,
  CheckSquare, Circle, Sparkles, Compass, Brain, ListOrdered, Layers,
  Save, History, FileText, Check
} from 'lucide-react';
import { GoogleFormQuestionBuilder } from '../components/forms/GoogleFormQuestionBuilder';
import {
  saveTestDraft,
  deleteTestDraft,
  saveTestSubmissionRecord,
  TestDraft,
  TestSubmissionRecord,
  QuestionAnswerRecord
} from '../services/testSessionService';
import { TestHistoryLedger } from '../components/student/TestHistoryLedger';
import { DetailedQuestionReviewModal } from '../components/student/DetailedQuestionReviewModal';

// ─── helpers ──────────────────────────────────────────────────────────────────

const SUBJECT_OPTIONS = [
  { id: 'cpm-management', label: 'CPM & Construction Management', color: 'bg-teal-500' },
  { id: 'geotechnical', label: 'Soil Mechanics & Foundation (ExamVeda)', color: 'bg-amber-500' },
  { id: 'structural', label: 'Structural / SOM / RCC', color: 'bg-blue-500' },
  { id: 'water-resources', label: 'Hydraulics & Water Resources', color: 'bg-cyan-500' },
  { id: 'environmental', label: 'Environmental Engineering', color: 'bg-green-500' },
  { id: 'transportation', label: 'Transportation Engineering', color: 'bg-red-500' },
  { id: 'surveying', label: 'Surveying & Geomatics', color: 'bg-purple-500' },
  { id: 'building-materials', label: 'Building Materials & Concrete', color: 'bg-emerald-500' },
  { id: 'general-studies', label: 'General Studies & Assam GK (2026 Paper)', color: 'bg-orange-500' },
];

/**
 * Legacy subject-pill ids → canonical SUBJECT_GROUPS ids (see mockData.ts).
 * Filtering is by EXACT group membership so a Hydraulics mock never pulls in
 * Structures/GS questions through loose keyword overlap.
 */
const LEGACY_SUBJECT_GROUP_MAP: Record<string, string> = {
  'cpm-management': 'construction-mgmt',
  geotechnical: 'geotechnical',
  structural: 'structures',
  'water-resources': 'hydraulics-water',
  environmental: 'environmental',
  transportation: 'transportation',
  surveying: 'surveying',
  'building-materials': 'materials',
  'general-studies': 'general-studies'
};

const QN_OPTIONS = [5, 10, 25, 50, 100] as const;
const TIME_PRESETS = [
  { label: '1 min / Q', multiplier: 1 },
  { label: '1.5 min / Q', multiplier: 1.5 },
  { label: '2 min / Q', multiplier: 2 },
] as const;
const DIFFICULTY_OPTIONS = ['Easy', 'Mixed', 'Hard'] as const;

export const PATTERN_OPTIONS = [
  {
    id: 'all',
    label: 'Balanced Mix',
    desc: 'Standard, Statement 1 & 2, and Numerical mix',
    badge: 'Exam Standard'
  },
  {
    id: 'statement',
    label: 'Statement-Based (1 & 2)',
    desc: 'Statement 1 & 2, Assertion-Reason, 3-Statement items',
    badge: 'UPSC / GATE'
  },
  {
    id: 'numerical',
    label: 'Numerical & Calculations',
    desc: 'Formulas, numerical compute-the-answer items',
    badge: 'Problem Solving'
  },
  {
    id: 'conceptual',
    label: 'Standard Conceptual',
    desc: 'Direct conceptual, definitions & code rules',
    badge: 'Speed Drill'
  },
] as const;

export type QuestionPattern = typeof PATTERN_OPTIONS[number]['id'];

export function isStatementQuestion(stem: string, qType?: string): boolean {
  if (qType === 'STATEMENT_BASED' || qType === 'ASSERTION_REASON') return true;
  return /Statement\s*(\d+|\([IVXLCDM]+\))|Consider\s+the\s+following\s+statements/i.test(stem);
}

interface FormattedQuestionStemProps {
  stem: string;
  compact?: boolean;
}

interface ParsedStatement {
  label: string;
  text: string;
}

export const FormattedQuestionStem: React.FC<FormattedQuestionStemProps> = ({ stem, compact = false }) => {
  const isStatement = isStatementQuestion(stem);

  if (!isStatement) {
    return (
      <p className={`leading-relaxed text-ink whitespace-pre-line ${compact ? 'text-xs' : 'text-sm sm:text-base'}`}>
        {stem}
      </p>
    );
  }

  const lines = stem.split('\n').map((l) => l.trim()).filter(Boolean);
  const introLines: string[] = [];
  const statements: ParsedStatement[] = [];
  let promptText = '';

  for (const line of lines) {
    const stmtMatch = line.match(/^(Statement\s*\d+|Statement\s*\([IVXLCDM]+\)|\d+\.)\s*[:\.]?\s*(.*)$/i);
    const promptMatch = line.match(/^(Which\s+(?:of\s+the\s+above|one\s+of\s+the\s+following|of\s+the\s+statements|of\s+these).+)/i);

    if (stmtMatch) {
      statements.push({
        label: stmtMatch[1].replace(/\.$/, ''),
        text: stmtMatch[2]
      });
    } else if (promptMatch) {
      promptText = promptMatch[1];
    } else if (statements.length === 0) {
      introLines.push(line);
    } else {
      if (statements.length > 0 && !promptText) {
        statements[statements.length - 1].text += ' ' + line;
      } else {
        promptText = promptText ? promptText + ' ' + line : line;
      }
    }
  }

  return (
    <div className="space-y-3 text-left">
      {introLines.length > 0 && (
        <p className={`font-medium text-ink leading-relaxed ${compact ? 'text-xs' : 'text-sm sm:text-base'}`}>
          {introLines.join(' ')}
        </p>
      )}

      {statements.length > 0 && (
        <div className={`space-y-2.5 ${compact ? 'my-2' : 'my-3.5'}`}>
          {statements.map((st, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 rounded-xl border border-primary/25 bg-primary/5 dark:bg-primary/10 transition-colors shadow-xs ${
                compact ? 'p-2 text-xs' : 'p-3 sm:p-3.5 text-xs sm:text-sm'
              }`}
            >
              <span className="flex-shrink-0 rounded-md bg-primary px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-white shadow-xs">
                {st.label}
              </span>
              <span className="text-ink leading-relaxed flex-1 font-normal">
                {st.text}
              </span>
            </div>
          ))}
        </div>
      )}

      {promptText && (
        <div className={`font-semibold text-primary dark:text-primary-fixed leading-relaxed pt-0.5 ${compact ? 'text-xs' : 'text-xs sm:text-sm'}`}>
          {promptText}
        </div>
      )}
    </div>
  );
};

function formatTime(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0)
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface PastTest {
  id: string;
  title: string;
  score: number;
  maxScore: number;
  accuracy: number;
  date: string;
  questionCount: number;
  subjects: string[];
  result: TestSubmission;
  mock: MockTest;
}

// ─── Component ─────────────────────────────────────────────────────────────────

interface Props {
  activeTab: ActiveTab;
  setActiveTab: (t: ActiveTab) => void;
  presetMock?: MockTest | null;
  onClearPresetMock?: () => void;
}

export const MockTestCreator: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  presetMock,
  onClearPresetMock
}) => {
  // ── creator state ─────────────────────────────────────────────────────────
  const { user, recordActivity } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['geotechnical', 'structural', 'water-resources']);
  const [questionCount, setQuestionCount] = useState<number>(25);
  const [timeMultiplier, setTimeMultiplier] = useState<number>(1.5);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Mixed' | 'Hard'>('Mixed');
  const [questionPattern, setQuestionPattern] = useState<QuestionPattern>('all');
  const [testName, setTestName] = useState('');
  const [topicFocus, setTopicFocus] = useState('');
  const [generating, setGenerating] = useState(false);
  const [useGeminiArrangement, setUseGeminiArrangement] = useState(true);
  const [arrangementStrategy, setArrangementStrategy] = useState<ArrangementStrategy>('adaptive_pacing');
  const [arrangementResult, setArrangementResult] = useState<ArrangementResult | null>(null);
  const [isGeminiModalOpen, setIsGeminiModalOpen] = useState(false);
  const [isFormStudioOpen, setIsFormStudioOpen] = useState(false);
  const [hasGeminiKey, setHasGeminiKey] = useState(() => hasLiveAi());
  const [pastTests, setPastTests] = useState<PastTest[]>([]);
  const [loadingPast, setLoadingPast] = useState(false);

  // ── active test state ─────────────────────────────────────────────────────
  const [activeMock, setActiveMock] = useState<MockTest | null>(null);
  const [allQuestions, setAllQuestions] = useState<{ question: MCQQuestion; sectionName: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D' | null>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<TestSubmission | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [reviewingPast, setReviewingPast] = useState<PastTest | null>(null);
  const confirmRef = useFocusTrap(showConfirm);

  // ── draft & session persistence state ───────────────────────────────────
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [draftCreatedAt, setDraftCreatedAt] = useState<string | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [lastDraftSavedTime, setLastDraftSavedTime] = useState<string | null>(null);
  const [reviewSubmissionRecord, setReviewSubmissionRecord] = useState<TestSubmissionRecord | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // ── Launch official full test papers ────────────────────────────────────
  const handleLaunchPaper = useCallback((mock: MockTest) => {
    const flat = mock.sections.flatMap(sec => sec.questions.map(q => ({ question: q, sectionName: sec.name })));
    setActiveMock(mock);
    setAllQuestions(flat);
    setArrangementResult((mock as any)._arrangement ?? null);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setFlagged({});
    setTimeLeft(mock.durationMinutes * 60);
    setSubmitted(false);
    setSubmissionResult(null);
    setReviewingPast(null);
    setActiveDraftId(null);
    setReviewSubmissionRecord(null);
    setActiveTab('test');
    toastSuccess(`Exam Loaded: ${mock.title}`, `${flat.length} questions · ${mock.durationMinutes} min timer`);
  }, [setActiveTab, toastSuccess]);

  // ── Listen for presetMock passed from PYQ Archive or elsewhere ───────────
  useEffect(() => {
    if (presetMock) {
      handleLaunchPaper(presetMock);
      if (onClearPresetMock) onClearPresetMock();
    }
  }, [presetMock, handleLaunchPaper, onClearPresetMock]);

  // ── Load past tests from Firestore on mount / user change ─────────────────
  useEffect(() => {
    if (!user?.uid) return;
    setLoadingPast(true);
    getCustomMockTests(user.uid)
      .then((tests) => {
        // parse saved data — each entry is a MockTest + submission stored together
        const parsed: PastTest[] = (tests || []).slice(0, 20).map((t: any) => ({
          id: t.id || String(Math.random()),
          title: t.title || 'Mock Test',
          score: t._submission?.totalScore ?? 0,
          maxScore: t._submission?.maxScore ?? t.totalMarks ?? 0,
          accuracy: t._submission?.accuracy ?? 0,
          date: t._submission?.submittedAt ?? t.createdAt ?? new Date().toISOString(),
          questionCount: t.sections?.reduce((s: number, sec: any) => s + sec.questions.length, 0) ?? 0,
          subjects: t._subjects ?? [],
          result: t._submission ?? null,
          mock: t,
        })).filter((p: PastTest) => p.result !== null);
        setPastTests(parsed);
      })
      .catch(() => {})
      .finally(() => setLoadingPast(false));
  }, [user?.uid]);

  // ── timer ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab !== 'test' || submitted) return;
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(id); handleSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [activeTab, submitted]);

  // ── Escape closes confirm modal ───────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowConfirm(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // ── Save in-progress test draft ───────────────────────────────────────────
  const handleSaveDraft = useCallback(async (showToast = true) => {
    if (!activeMock || submitted || allQuestions.length === 0) return;
    setIsSavingDraft(true);
    const draftId = activeDraftId || `draft-${Date.now()}`;
    if (!activeDraftId) setActiveDraftId(draftId);

    const userAnsClean: Record<string, 'A' | 'B' | 'C' | 'D'> = {};
    Object.entries(selectedAnswers).forEach(([k, v]) => {
      if (v) userAnsClean[k] = v;
    });

    const flaggedList = Object.entries(flagged).filter(([_, v]) => v).map(([k]) => k);

    const draft: TestDraft = {
      id: draftId,
      userId: user?.uid || 'guest_candidate',
      testTitle: activeMock.title,
      topics: (activeMock as any)._subjects || [activeMock.paperName || 'Civil Engineering'],
      questions: allQuestions.map(q => q.question),
      userAnswers: userAnsClean,
      flaggedQuestions: flaggedList,
      timeRemainingSeconds: timeLeft,
      currentQuestionIndex: currentIndex,
      createdAt: draftCreatedAt || new Date().toISOString(),
      lastSavedAt: new Date().toISOString()
    };

    try {
      await saveTestDraft(draft);
      setLastDraftSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      if (showToast) {
        toastSuccess('Draft Saved', 'You can resume this test anytime from My Test Records');
      }
    } catch (err) {
      console.warn('[ExamPilot] Draft save error:', err);
      if (showToast) toastError('Save failed', 'Could not save draft locally');
    } finally {
      setIsSavingDraft(false);
    }
  }, [activeMock, submitted, allQuestions, activeDraftId, selectedAnswers, flagged, timeLeft, currentIndex, draftCreatedAt, user?.uid, toastSuccess, toastError]);

  // ── Auto-save draft every 30 seconds while test is active ─────────────────
  useEffect(() => {
    if (activeTab !== 'test' || submitted || !activeMock || allQuestions.length === 0) return;
    const interval = setInterval(() => {
      handleSaveDraft(false);
    }, 30000);
    return () => clearInterval(interval);
  }, [activeTab, submitted, activeMock, allQuestions.length, handleSaveDraft]);

  // ── Resume saved draft ───────────────────────────────────────────────────
  const handleResumeDraft = (draft: TestDraft) => {
    const mock: MockTest = {
      id: draft.id,
      title: draft.testTitle,
      examId: 'custom',
      paperName: (draft.topics && draft.topics.length > 0) ? draft.topics.join(', ') : 'Civil Engineering',
      durationMinutes: Math.ceil((draft.timeRemainingSeconds || draft.questions.length * 90) / 60),
      totalMarks: draft.questions.length * 2,
      negativeMarksPerIncorrect: 0.25,
      sections: [
        {
          id: 'sec-1',
          name: draft.testTitle,
          totalQuestions: draft.questions.length,
          questions: draft.questions
        }
      ]
    };
    (mock as any)._subjects = draft.topics;
    (mock as any)._arrangement = null;
    const flat = draft.questions.map(q => ({ question: q, sectionName: draft.testTitle }));

    const answersMap: Record<string, 'A' | 'B' | 'C' | 'D' | null> = {};
    Object.entries(draft.userAnswers || {}).forEach(([k, v]) => {
      answersMap[k] = v;
    });

    const flagMap: Record<string, boolean> = {};
    (draft.flaggedQuestions || []).forEach(qid => {
      flagMap[qid] = true;
    });

    setActiveMock(mock);
    setAllQuestions(flat);
    setCurrentIndex(Math.min(draft.currentQuestionIndex || 0, Math.max(0, flat.length - 1)));
    setSelectedAnswers(answersMap);
    setFlagged(flagMap);
    setTimeLeft(Math.max(10, draft.timeRemainingSeconds));
    setSubmitted(false);
    setSubmissionResult(null);
    setReviewingPast(null);
    setActiveDraftId(draft.id);
    setDraftCreatedAt(draft.createdAt);
    setActiveTab('test');
    toastSuccess('Test Draft Resumed', `Continuing "${draft.testTitle}" with ${Object.keys(answersMap).length} answers restored.`);
  };

  // ── Build test from question bank (with Gemini 3.8 Flash arrangement) ────
  const handleCreateTest = async () => {
    if (generating) return;
    setGenerating(true);

    try {
      const civilPool = [...CIVIL_ENGINEERING_QUESTIONS];
      const gsPool = [...GENERAL_STUDIES_QUESTIONS];

      // Step 1: Filter pool strictly by selected subjects and topic focus (zero topic drift)
      let filteredPool: MCQQuestion[] = [];
      const seenIds = new Set<string>();

      // Check if user requested a dedicated topic focus (via topicFocus input or test name)
      const explicitTopic = (topicFocus || (!testName.toLowerCase().includes('mock') ? testName : '')).trim();
      const topicLower = explicitTopic.toLowerCase();

      if (topicLower) {
        // High priority: Extract questions matching the requested topic (CPM, Soil, Assam DWR, etc.)
        const combinedPool = [...civilPool, ...gsPool];
        const topicMatches = combinedPool.filter(q => {
          const haystack = `${q.subject} ${q.topic} ${q.subtopic || ''} ${q.stem}`.toLowerCase();
          if (topicLower === 'cpm' || topicLower.includes('cpm') || topicLower.includes('pert')) {
            return /cpm|pert|critical path|float|crashing|network|slack|activity on arrow|activity on node|fulkerson/i.test(haystack);
          }
          if (topicLower.includes('soil') || topicLower.includes('geotech') || topicLower.includes('foundation') || topicLower.includes('permeab') || topicLower.includes('consolidation') || topicLower.includes('bearing capacity')) {
            return /soil|geotechnical|foundation|permeab|consolidation|bearing capacity|seepage|shear strength|quicksand|atterberg|flownet|pile|clay/i.test(haystack);
          }
          if (topicLower.includes('assam') || topicLower.includes('dwr') || topicLower.includes('ahom')) {
            return /assam|ahom|dwr|brahmaputra|maidam|chutiya|koch|sukapha|jain|buddha|weathering|earthquake|sanctuary/i.test(haystack);
          }
          return haystack.includes(topicLower);
        });

        if (topicMatches.length > 0) {
          topicMatches.forEach(q => {
            if (!seenIds.has(q.id)) {
              seenIds.add(q.id);
              filteredPool.push(q);
            }
          });
        }
      }

      if (filteredPool.length === 0) {
        // Exact subject-group matching (canonical taxonomy in mockData.ts).
        // Each selected pill contributes ONLY its own group's questions.
        const combinedPool = [...civilPool, ...gsPool];
        selectedSubjects.forEach((subj) => {
          const groupId = LEGACY_SUBJECT_GROUP_MAP[subj] || subj;
          const matched = getQuestionsBySubjectGroup(groupId, combinedPool);
          matched.forEach(q => {
            if (!seenIds.has(q.id)) { seenIds.add(q.id); filteredPool.push(q); }
          });
        });
      }

      // Step 2: question pattern filter (strictly within the selected subjects —
      // NEVER supplement from the whole bank, which injects unrelated subjects).
      if (questionPattern === 'statement') {
        const stmtMatches = filteredPool.filter(q => isStatementQuestion(q.stem, q.questionType));
        if (stmtMatches.length > 0) {
          filteredPool = stmtMatches;
        }
      } else if (questionPattern === 'numerical') {
        const numMatches = filteredPool.filter(q => q.questionType === 'NUMERICAL');
        if (numMatches.length > 0) {
          filteredPool = numMatches;
        }
      } else if (questionPattern === 'conceptual') {
        const concMatches = filteredPool.filter(q => !isStatementQuestion(q.stem, q.questionType) && q.questionType !== 'NUMERICAL');
        if (concMatches.length >= 5) filteredPool = concMatches;
      } else {
        // Balanced mix: ensure high representation of statement-based MCQs
        const stmtItems = shuffle(filteredPool.filter(q => isStatementQuestion(q.stem, q.questionType)));
        const otherItems = shuffle(filteredPool.filter(q => !isStatementQuestion(q.stem, q.questionType)));
        const targetStmt = Math.min(stmtItems.length, Math.round(questionCount * 0.45));
        const targetOther = questionCount - targetStmt;
        filteredPool = [...stmtItems.slice(0, targetStmt), ...otherItems.slice(0, targetOther)];
      }

      // Step 3: difficulty filter (applied softly if pool is adequate)
      if (difficulty === 'Easy') {
        const easyPool = filteredPool.filter(q => q.difficulty === 'EASY' || q.difficulty === 'MEDIUM');
        if (easyPool.length >= questionCount) filteredPool = easyPool;
      } else if (difficulty === 'Hard') {
        const hardPool = filteredPool.filter(q => q.difficulty === 'MEDIUM' || q.difficulty === 'HARD');
        if (hardPool.length >= questionCount) filteredPool = hardPool;
      }

      // Step 4: Strict topic fidelity — NEVER pad with unselected random subjects.
      // If pool has fewer items than questionCount, cycle strictly from the selected subjects.
      if (filteredPool.length < questionCount) {
        if (filteredPool.length > 0) {
          const base = [...filteredPool];
          let cycle = 1;
          while (filteredPool.length < questionCount) {
            for (const item of base) {
              if (filteredPool.length >= questionCount) break;
              filteredPool.push({
                ...item,
                id: `${item.id}-c${cycle}`
              });
            }
            cycle++;
          }
        }
        // NOTE: no whole-bank fallback here — an empty pool means the selected
        // subjects genuinely have no matching questions, and the toast below
        // ("Could not generate questions") tells the user to adjust filters
        // instead of silently serving unrelated subjects.
      }

      // Step 5: shuffle and pick
      let selected = shuffle(filteredPool).slice(0, questionCount);

      // Step 6: 100% verified question bank guarantee (strictly NO AI-generated questions)
      if (selected.length === 0 && filteredPool.length > 0) {
        selected = filteredPool.slice(0, questionCount);
      }

      if (selected.length === 0) {
        toastError('Could not generate questions', 'Try different subject filters');
        return;
      }

      const subjectLabels = selectedSubjects.map(s => SUBJECT_OPTIONS.find(o => o.id === s)?.label ?? s);
      const name = testName.trim() || `${subjectLabels[0] ?? 'Civil'} — ${selected.length}Q`;
      const duration = Math.round(selected.length * timeMultiplier);

      // Step 7: Apply AI Gemini 3.8 Flash Question Arrangement
      let finalArrangement: ArrangementResult | null = null;
      if (useGeminiArrangement) {
        try {
          finalArrangement = await arrangeQuestionsWithGemini(
            selected,
            duration,
            arrangementStrategy,
            subjectLabels.join(', ')
          );
          selected = finalArrangement.arrangedQuestions;
          setArrangementResult(finalArrangement);
          if (finalArrangement.usedLiveAi) {
            toastSuccess(
              'Arranged with Gemini 3.8 Flash',
              `${finalArrangement.strategyTitle} (${finalArrangement.phases.length} phases)`
            );
          } else {
            toastSuccess(
              'Cognitive Pacing Active',
              `${finalArrangement.strategyTitle}`
            );
          }
        } catch (e) {
          console.warn('[ExamPilot] Gemini arrangement failed:', e);
        }
      } else {
        setArrangementResult(null);
      }

      const mock: MockTest = {
        id: 'mt-' + Date.now(),
        title: name,
        examId: 'custom',
        paperName: subjectLabels.join(', '),
        durationMinutes: duration,
        totalMarks: selected.length * 2,
        negativeMarksPerIncorrect: 0.25,
        sections: [
          {
            id: 'sec-1',
            name: name,
            totalQuestions: selected.length,
            questions: selected,
          },
        ],
      };

      // Store subjects & arrangement metadata for past-test display
      (mock as any)._subjects = subjectLabels;
      (mock as any)._arrangement = finalArrangement;

      const flat = mock.sections.flatMap(sec => sec.questions.map(q => ({ question: q, sectionName: sec.name })));
      setActiveMock(mock);
      setAllQuestions(flat);
      setCurrentIndex(0);
      setSelectedAnswers({});
      setFlagged({});
      setTimeLeft(duration * 60);
      setSubmitted(false);
      setSubmissionResult(null);
      setReviewingPast(null);
      setActiveDraftId(null);
      setDraftCreatedAt(new Date().toISOString());
      setLastDraftSavedTime(null);
      setReviewSubmissionRecord(null);
      setActiveTab('test');
    } catch (err) {
      console.warn('[ExamPilot] Test creation failed:', err);
      toastError('Test generation failed', 'Please try again');
    } finally {
      setGenerating(false);
    }
  };

  // ── Launch from Google Form AI Question Studio ────────────────────────────
  const handleLaunchFromFormStudio = (questions: MCQQuestion[], testTitle: string) => {
    if (!questions || questions.length === 0) return;
    const duration = Math.max(5, Math.round(questions.length * timeMultiplier));
    const name = testTitle || `AI Studio — ${questions.length}Q`;

    const mock: MockTest = {
      id: 'mt-studio-' + Date.now(),
      title: name,
      examId: 'custom',
      paperName: 'AI Question Studio',
      durationMinutes: duration,
      totalMarks: questions.length * 2,
      negativeMarksPerIncorrect: 0.25,
      sections: [
        {
          id: 'sec-1',
          name: name,
          totalQuestions: questions.length,
          questions,
        },
      ],
    };

    (mock as any)._subjects = ['AI Question Studio'];
    (mock as any)._arrangement = null;

    const flat = mock.sections.flatMap(sec => sec.questions.map(q => ({ question: q, sectionName: sec.name })));
    setActiveMock(mock);
    setAllQuestions(flat);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setFlagged({});
    setTimeLeft(duration * 60);
    setSubmitted(false);
    setSubmissionResult(null);
    setReviewingPast(null);
    setActiveDraftId(null);
    setDraftCreatedAt(new Date().toISOString());
    setLastDraftSavedTime(null);
    setReviewSubmissionRecord(null);
    setActiveTab('test');
    toastSuccess('Test Started', `Playing ${questions.length} questions from AI Question Studio!`);
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (!activeMock || submitted) return;
    setShowConfirm(false);

    let correct = 0, incorrect = 0, unattempted = 0;
    const answersRecord: TestSubmission['answers'] = {};

    allQuestions.forEach(({ question: q }) => {
      const ans = selectedAnswers[q.id];
      if (!ans) {
        unattempted++;
        answersRecord[q.id] = { selected: null, isCorrect: false, timeSeconds: 0 };
      } else if (ans === q.correctOption) {
        correct++;
        answersRecord[q.id] = { selected: ans, isCorrect: true, timeSeconds: 45 };
      } else {
        incorrect++;
        answersRecord[q.id] = { selected: ans, isCorrect: false, timeSeconds: 45 };
      }
    });

    const marksPerQ = activeMock.totalMarks / allQuestions.length;
    const gross = correct * marksPerQ;
    const penalty = incorrect * marksPerQ * activeMock.negativeMarksPerIncorrect;
    const totalScore = Math.max(0, Math.round((gross - penalty) * 100) / 100);
    const accuracy = correct + incorrect > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0;
    const percentile = Math.min(99, Math.round((totalScore / activeMock.totalMarks) * 85 + 10));

    const submission: TestSubmission = {
      id: 'sub-' + Date.now(),
      testId: activeMock.id,
      userId: user?.uid || 'guest',
      submittedAt: new Date().toISOString(),
      timeSpentSeconds: activeMock.durationMinutes * 60 - timeLeft,
      totalScore,
      maxScore: activeMock.totalMarks,
      accuracy,
      percentile,
      totalAttempted: correct + incorrect,
      correctCount: correct,
      incorrectCount: incorrect,
      unattemptedCount: unattempted,
      answers: answersRecord,
    };

    setSubmissionResult(submission);
    setSubmitted(true);
    setActiveTab('results');

    // Save to centralized testSessionService (Dual Firestore + LocalStorage)
    const detailAnswers: Record<string, QuestionAnswerRecord> = {};
    allQuestions.forEach(({ question: q }) => {
      const selected = selectedAnswers[q.id] || null;
      const isCorrect = selected === q.correctOption;
      detailAnswers[q.id] = {
        selected,
        isCorrect,
        correctOption: q.correctOption,
        flagged: Boolean(flagged[q.id]),
        timeSeconds: answersRecord[q.id]?.timeSeconds || 45
      };
    });

    const subRecord: TestSubmissionRecord = {
      id: submission.id,
      testId: activeMock.id,
      userId: user?.uid || 'guest_candidate',
      testTitle: activeMock.title,
      topics: (activeMock as any)._subjects || [activeMock.paperName || 'Civil Engineering'],
      submittedAt: submission.submittedAt,
      timeSpentSeconds: submission.timeSpentSeconds,
      totalScore: submission.totalScore,
      maxScore: submission.maxScore,
      accuracy: submission.accuracy,
      totalAttempted: submission.totalAttempted,
      correctCount: submission.correctCount,
      incorrectCount: submission.incorrectCount,
      unattemptedCount: submission.unattemptedCount,
      questions: allQuestions.map(q => q.question),
      answers: detailAnswers
    };

    setReviewSubmissionRecord(subRecord);

    (async () => {
      try {
        await saveTestSubmissionRecord(subRecord);
        if (activeDraftId) {
          await deleteTestDraft(activeDraftId, user?.uid);
          setActiveDraftId(null);
        }
      } catch (e) {
        console.warn('[ExamPilot] Test session save error:', e);
      }

      // Save to Firestore
      try {
        await submitMockTest(submission);
        const toSave = {
          ...activeMock,
          _submission: submission,
          _subjects: (activeMock as any)._subjects ?? [],
          _arrangement: (activeMock as any)._arrangement ?? arrangementResult
        };
        if (user?.uid) await saveCustomMockTest(user.uid, toSave as any);
      } catch (e) {
        console.warn('[ExamPilot] Save submission error:', e);
      }

      // Record activity
      try {
        const studyH = Math.max(0.1, Math.round(((activeMock.durationMinutes * 60 - timeLeft) / 3600) * 10) / 10);
        await recordActivity(correct + incorrect, correct, studyH);
      } catch {}
    })();

    toastSuccess(`Test submitted — ${totalScore}/${activeMock.totalMarks}`, `${correct} correct · ${accuracy}% accuracy`);

    // Confetti for good scores
    if (accuracy >= 60) {
      try { confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }); } catch {}
    }

    // Reload past tests
    if (user?.uid) {
      getCustomMockTests(user.uid).then((tests) => {
        const parsed: PastTest[] = (tests || []).slice(0, 20).map((t: any) => ({
          id: t.id || String(Math.random()),
          title: t.title || 'Mock Test',
          score: t._submission?.totalScore ?? 0,
          maxScore: t._submission?.maxScore ?? t.totalMarks ?? 0,
          accuracy: t._submission?.accuracy ?? 0,
          date: t._submission?.submittedAt ?? new Date().toISOString(),
          questionCount: t.sections?.reduce((s: number, sec: any) => s + sec.questions.length, 0) ?? 0,
          subjects: t._subjects ?? [],
          result: t._submission ?? null,
          mock: t,
        })).filter((p: PastTest) => p.result !== null);
        setPastTests(parsed);
      }).catch(() => {});
    }
  }, [activeMock, submitted, allQuestions, selectedAnswers, timeLeft, user?.uid, arrangementResult, activeDraftId]);

  // ── Retake a past test ────────────────────────────────────────────────────
  const handleRetake = (past: PastTest) => {
    const mock = past.mock;
    const flat = mock.sections.flatMap(sec => sec.questions.map(q => ({ question: q, sectionName: sec.name })));
    setActiveMock(mock);
    setAllQuestions(flat);
    setArrangementResult((mock as any)._arrangement ?? null);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setFlagged({});
    setTimeLeft(mock.durationMinutes * 60);
    setSubmitted(false);
    setSubmissionResult(null);
    setReviewingPast(null);
    setActiveDraftId(null);
    setReviewSubmissionRecord(null);
    setActiveTab('test');
  };

  const handleReview = (past: PastTest) => {
    const mock = past.mock;
    const flat = mock.sections.flatMap(sec => sec.questions.map(q => ({ question: q, sectionName: sec.name })));
    setActiveMock(mock);
    setAllQuestions(flat);
    setSubmissionResult(past.result);
    setArrangementResult((mock as any)._arrangement ?? null);
    setSubmitted(true);
    setReviewingPast(past);

    const detailAnswers: Record<string, QuestionAnswerRecord> = {};
    flat.forEach(({ question: q }) => {
      const ans = past.result.answers[q.id];
      detailAnswers[q.id] = {
        selected: ans?.selected || null,
        isCorrect: ans?.isCorrect || false,
        correctOption: q.correctOption,
        timeSeconds: ans?.timeSeconds || 45
      };
    });

    setReviewSubmissionRecord({
      id: past.result.id,
      testId: mock.id,
      userId: past.result.userId || 'guest_candidate',
      testTitle: mock.title,
      topics: (mock as any)._subjects || [mock.paperName || 'Civil Engineering'],
      submittedAt: past.result.submittedAt,
      timeSpentSeconds: past.result.timeSpentSeconds,
      totalScore: past.result.totalScore,
      maxScore: past.result.maxScore,
      accuracy: past.result.accuracy,
      totalAttempted: past.result.totalAttempted,
      correctCount: past.result.correctCount,
      incorrectCount: past.result.incorrectCount,
      unattemptedCount: past.result.unattemptedCount,
      questions: flat.map(f => f.question),
      answers: detailAnswers
    });

    setActiveTab('results');
  };

  // ── Toggle subject ────────────────────────────────────────────────────────
  const toggleSubject = (id: string) => {
    setSelectedSubjects(prev =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter(s => s !== id) : prev) : [...prev, id]
    );
  };

  // ── current question shortcuts ────────────────────────────────────────────
  const currentItem = allQuestions[Math.min(currentIndex, allQuestions.length - 1)];
  const currentQ = currentItem?.question;
  const answered = Object.keys(selectedAnswers).filter(id => selectedAnswers[id] !== null && selectedAnswers[id] !== undefined).length;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;
  const marksPerQ = activeMock ? activeMock.totalMarks / Math.max(1, allQuestions.length) : 2;

  console.log('[MockTestCreator Render]', { activeTab, hasActiveMock: !!activeMock, submitted, hasResult: !!submissionResult });

  // ─── SCREEN: TEST IN PROGRESS ─────────────────────────────────────────────
  if (activeTab === 'test' && activeMock && !submitted) {
    const isLowTime = timeLeft < 120;
    const currentPhase = arrangementResult?.phases.find(
      p => currentIndex >= p.startIndex && currentIndex <= p.endIndex
    );

    return (
      <div className="flex h-full flex-col">
        {/* Test header bar */}
        <div className="flex flex-shrink-0 items-center justify-between gap-3 border-b border-line bg-card px-4 py-2">
          <div className="flex items-center gap-2 text-xs text-muted">
            <BookOpen className="h-3.5 w-3.5" />
            <span className="truncate max-w-[200px] font-medium text-ink">{activeMock.title}</span>
            <span>·</span>
            <span>{allQuestions.length} Questions</span>
            <span>·</span>
            <span>{marksPerQ * 2}M | −{(marksPerQ * activeMock.negativeMarksPerIncorrect).toFixed(2)}</span>
            {arrangementResult && (
              <>
                <span>·</span>
                <span className="hidden items-center gap-1 text-[11px] font-semibold text-primary sm:flex">
                  <Sparkles className="h-3 w-3" />
                  {arrangementResult.strategyTitle}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSaveDraft(true)}
              disabled={isSavingDraft}
              className="flex items-center gap-1.5 rounded-xl border border-line bg-raised px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-primary hover:text-primary disabled:opacity-50"
              title="Save current progress and resume anytime from My Test Records"
            >
              {isSavingDraft ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline">Save Draft</span>
              {lastDraftSavedTime && (
                <span className="text-[10px] text-muted font-normal hidden md:inline">({lastDraftSavedTime})</span>
              )}
            </button>
            <div className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-bold tabular-nums ${isLowTime ? 'border-danger-border bg-danger-surface text-danger-text animate-pulse' : 'border-line bg-raised text-ink'}`}>
              <Clock className="h-4 w-4" />
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Question area */}
          <div className="flex flex-1 flex-col overflow-y-auto p-4 sm:p-6">
            <AnimatePresence mode="wait">
              {currentQ && (
                <motion.div
                  key={currentQ.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.15 }}
                  className="mx-auto w-full max-w-3xl space-y-4 sm:space-y-5"
                >
                  {/* Question meta */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                    <span className="rounded-lg border border-line bg-raised px-2 py-0.5 font-semibold text-ink">
                      Q {currentIndex + 1} / {allQuestions.length}
                    </span>
                    {currentQ.subject && (
                      <span className="rounded-lg bg-primary-fixed px-2 py-0.5 font-medium text-primary">
                        {currentQ.subject}
                      </span>
                    )}
                    {currentPhase && (
                      <span className="flex items-center gap-1 rounded-lg border border-primary/25 bg-primary/10 px-2 py-0.5 font-semibold text-primary shadow-xs">
                        <Sparkles className="h-3 w-3 text-primary" />
                        {currentPhase.name}
                      </span>
                    )}
                    {isStatementQuestion(currentQ.stem, currentQ.questionType) && (
                      <span className="flex items-center gap-1 rounded-lg border border-indigo-500/25 bg-indigo-500/10 px-2 py-0.5 font-semibold text-indigo-600 dark:text-indigo-400 shadow-xs">
                        <CheckSquare className="h-3 w-3" /> Statement 1 & 2
                      </span>
                    )}
                    <span className={`rounded-lg px-2 py-0.5 font-medium ${currentQ.difficulty === 'HARD' ? 'bg-danger-surface text-danger-text' : currentQ.difficulty === 'EASY' ? 'bg-success-surface text-success-text' : 'bg-warning-surface text-warning-text'}`}>
                      {currentQ.difficulty}
                    </span>
                    {flagged[currentQ.id] && (
                      <span className="flex items-center gap-1 rounded-lg bg-warning-surface px-2 py-0.5 font-medium text-warning-text">
                        <Flag className="h-3 w-3" /> Flagged
                      </span>
                    )}
                  </div>

                  {/* Cognitive Pacing Guidance Banner */}
                  {currentPhase && (
                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3.5 py-2 text-xs">
                      <div className="flex items-center gap-2 text-ink-soft">
                        <Compass className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="font-medium">{currentPhase.focusDescription}</span>
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded-md shrink-0">
                        Phase Pace: ~{currentPhase.recommendedMinutes}m
                      </span>
                    </div>
                  )}

                  {/* Question stem */}
                  <Card flush className="p-5 sm:p-6">
                    <FormattedQuestionStem stem={currentQ.stem} />
                    {currentQ.formulaContext && (
                      <div className="mt-3 rounded-xl border border-line bg-subtle px-4 py-3 text-xs font-mono text-ink-soft">
                        {currentQ.formulaContext}
                      </div>
                    )}
                  </Card>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {currentQ.options.map((opt) => {
                      const selected = selectedAnswers[currentQ.id] === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: opt.id }))}
                          className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition ${
                            selected
                              ? 'border-primary bg-primary-fixed font-medium text-primary shadow-sm'
                              : 'border-line bg-card text-ink hover:border-primary/40 hover:bg-subtle'
                          }`}
                        >
                          <span className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border text-[11px] font-bold ${selected ? 'border-primary bg-primary text-white' : 'border-line text-muted-faint'}`}>
                            {opt.id}
                          </span>
                          <span className="leading-relaxed">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Actions row */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      onClick={() => setFlagged(prev => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }))}
                      className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition ${flagged[currentQ.id] ? 'border-warning-border bg-warning-surface text-warning-text' : 'border-line text-muted hover:border-line-strong hover:text-ink'}`}
                    >
                      <Flag className="h-3.5 w-3.5" />
                      {flagged[currentQ.id] ? 'Unflag' : 'Flag for review'}
                    </button>
                    {selectedAnswers[currentQ.id] && (
                      <button
                        onClick={() => setSelectedAnswers(prev => { const n = { ...prev }; delete n[currentQ.id]; return n; })}
                        className="flex items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-xs font-medium text-muted transition hover:border-line-strong hover:text-ink"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Clear response
                      </button>
                    )}
                    <div className="flex-1" />
                    <span className="text-xs text-muted">{answered} answered · {flaggedCount} flagged</span>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                      disabled={currentIndex === 0}
                      className="flex items-center gap-1.5 rounded-xl border border-line bg-raised px-4 py-2.5 text-xs font-semibold text-ink disabled:opacity-40 transition hover:border-line-strong"
                    >
                      <ChevronLeft className="h-4 w-4" /> Previous
                    </button>
                    <div className="flex-1" />
                    {currentIndex < allQuestions.length - 1 ? (
                      <button
                        onClick={() => setCurrentIndex(i => i + 1)}
                        className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-primary-dark"
                      >
                        Next <ChevronRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowConfirm(true)}
                        className="flex items-center gap-1.5 rounded-xl bg-success px-4 py-2.5 text-xs font-semibold text-white transition hover:opacity-90"
                      >
                        <CheckSquare className="h-4 w-4" /> Submit Test
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Question palette — sidebar on desktop */}
          <div className="hidden w-52 flex-shrink-0 flex-col gap-3 overflow-y-auto border-l border-line bg-card p-3 lg:flex">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-faint">Question Palette</div>
            <div className="flex flex-wrap gap-1.5">
              {allQuestions.map(({ question: q }, idx) => {
                const ans = selectedAnswers[q.id];
                const isFlagged = flagged[q.id];
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    title={`Q${idx + 1}${isFlagged ? ' — Flagged' : ''}${ans ? ' — Answered' : ''}`}
                    className={`h-8 w-8 rounded-lg border text-[11px] font-semibold transition ${
                      isActive ? 'border-primary bg-primary text-white' :
                      isFlagged ? 'border-warning-border bg-warning-surface text-warning-text' :
                      ans ? 'border-success-border bg-success-surface text-success-text' :
                      'border-line bg-raised text-muted hover:border-line-strong'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            <div className="space-y-1.5 text-[10px] text-muted">
              <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-success-surface" />Answered</div>
              <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-warning-surface" />Flagged</div>
              <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-raised border border-line" />Not visited</div>
            </div>
            <div className="flex-1" />
            <div className="flex flex-col gap-2 w-full mt-2">
              <button
                type="button"
                onClick={() => handleSaveDraft(true)}
                disabled={isSavingDraft}
                className="flex items-center justify-center gap-1.5 w-full rounded-xl border border-line bg-raised py-2 text-xs font-semibold text-ink transition hover:border-primary hover:text-primary disabled:opacity-50"
              >
                {isSavingDraft ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                <span>Save Draft</span>
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                className="w-full rounded-xl bg-success py-2.5 text-xs font-semibold text-white transition hover:opacity-90"
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>

        {/* Mobile submit button */}
        <div className="flex flex-shrink-0 items-center justify-between border-t border-line bg-card px-4 py-2 lg:hidden">
          <span className="text-xs text-muted">{answered}/{allQuestions.length} answered</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSaveDraft(true)}
              disabled={isSavingDraft}
              className="flex items-center gap-1 rounded-xl border border-line bg-raised px-3 py-2 text-xs font-semibold text-ink"
            >
              <Save className="h-3.5 w-3.5" />
              Save Draft
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              className="rounded-xl bg-success px-4 py-2 text-xs font-semibold text-white"
            >
              Submit Test
            </button>
          </div>
        </div>

        {/* Confirm modal */}
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div ref={confirmRef as any} className="w-full max-w-sm rounded-2xl border border-line bg-card p-6 shadow-pop">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning-surface text-warning-text">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display font-bold text-ink">Submit Test?</div>
                  <div className="text-xs text-muted mt-0.5">{answered} of {allQuestions.length} answered · {flaggedCount} flagged</div>
                </div>
              </div>
              <p className="text-xs text-muted mb-5">
                {allQuestions.length - answered > 0
                  ? `You have ${allQuestions.length - answered} unanswered questions. Unanswered questions receive 0 marks.`
                  : 'All questions answered. Ready to submit?'}
              </p>
              <div className="flex gap-2">
                <button onClick={() => setShowConfirm(false)} className="flex-1 rounded-xl border border-line py-2.5 text-xs font-semibold text-ink transition hover:bg-subtle">
                  Cancel
                </button>
                <button onClick={handleSubmit} className="flex-1 rounded-xl bg-success py-2.5 text-xs font-semibold text-white transition hover:opacity-90">
                  Confirm Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── SCREEN: RESULTS & REVIEW ─────────────────────────────────────────────
  if (activeTab === 'results' && submissionResult && activeMock) {
    const result = submissionResult;
    const pct = Math.round((result.totalScore / result.maxScore) * 100);
    const timeTaken = result.timeSpentSeconds;

    // Subject-wise breakdown
    const subjectMap: Record<string, { correct: number; total: number }> = {};
    allQuestions.forEach(({ question: q }) => {
      const subj = q.subject || 'General';
      if (!subjectMap[subj]) subjectMap[subj] = { correct: 0, total: 0 };
      subjectMap[subj].total++;
      if (result.answers[q.id]?.isCorrect) subjectMap[subj].correct++;
    });

    return (
      <div className="mx-auto max-w-4xl space-y-5 p-4 sm:p-6">
        {/* Score header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-line bg-card p-6 sm:p-8"
        >
          <div className="mb-6 flex flex-col items-center gap-3 text-center">
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${pct >= 60 ? 'bg-success-surface text-success-text' : pct >= 40 ? 'bg-warning-surface text-warning-text' : 'bg-danger-surface text-danger-text'}`}>
              <Trophy className="h-8 w-8" />
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-ink">{result.totalScore} / {result.maxScore}</div>
              <div className="text-sm text-muted mt-1">{activeMock.title}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Score', value: `${pct}%`, sub: `${result.totalScore}/${result.maxScore} marks`, color: 'text-primary' },
              { label: 'Accuracy', value: `${result.accuracy}%`, sub: `${result.correctCount} of ${result.totalAttempted} attempted`, color: 'text-success-text' },
              { label: 'Percentile', value: `${result.percentile}th`, sub: 'Projected rank', color: 'text-primary' },
              { label: 'Time Taken', value: formatTime(timeTaken), sub: `${result.totalAttempted} attempted`, color: 'text-ink' },
            ].map(card => (
              <div key={card.label} className="rounded-xl border border-line bg-subtle p-4">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-faint">{card.label}</div>
                <div className={`mt-1 font-display text-xl font-bold tabular-nums ${card.color}`}>{card.value}</div>
                <div className="text-[10px] text-muted mt-0.5">{card.sub}</div>
              </div>
            ))}
          </div>

          {/* Correct / Wrong bar */}
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-line bg-subtle p-3 text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-success-text">
              <CheckCircle2 className="h-4 w-4" />
              {result.correctCount} correct (+{(result.correctCount * marksPerQ).toFixed(1)})
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-danger-text">
              <XCircle className="h-4 w-4" />
              {result.incorrectCount} wrong (−{(result.incorrectCount * marksPerQ * activeMock.negativeMarksPerIncorrect).toFixed(2)})
            </span>
            <span className="text-muted">{result.unattemptedCount} skipped</span>
          </div>

          {/* Quick Review Actions */}
          <div className="mt-4 flex flex-wrap items-center gap-3 pt-3 border-t border-line">
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition"
            >
              <CheckSquare className="h-4 w-4" /> Review Mistakes & Solutions
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary/20 px-4 py-2 text-xs font-semibold text-primary transition"
            >
              <History className="h-4 w-4" /> My Test Records Ledger
            </button>
          </div>
        </motion.div>

        {/* Subject breakdown */}
        {Object.keys(subjectMap).length > 1 && (
          <div className="rounded-2xl border border-line bg-card p-4 sm:p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
              <BarChart2 className="h-4 w-4 text-muted" /> Subject-wise Breakdown
            </div>
            <div className="space-y-2">
              {Object.entries(subjectMap).map(([subj, { correct, total }]) => {
                const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
                return (
                  <div key={subj} className="flex items-center gap-3 text-xs">
                    <span className="w-40 truncate font-medium text-ink-soft">{subj}</span>
                    <div className="flex-1 rounded-full bg-subtle overflow-hidden h-2">
                      <div className={`h-2 rounded-full ${pct >= 60 ? 'bg-success' : pct >= 40 ? 'bg-warning' : 'bg-danger'}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-20 text-right font-semibold tabular-nums text-muted">{correct}/{total} ({pct}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Gemini 3.8 Flash Question Arrangement Report */}
        {arrangementResult && (
          <div className="rounded-2xl border border-line bg-card p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-ink flex items-center gap-1.5">
                    <span>AI Gemini 3.8 Flash Exam Arrangement Report</span>
                  </h3>
                  <p className="text-xs text-muted">{arrangementResult.strategyTitle}</p>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                arrangementResult.usedLiveAi
                  ? 'border-primary bg-primary-fixed text-primary'
                  : 'border-line bg-raised text-muted'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${arrangementResult.usedLiveAi ? 'bg-primary animate-pulse' : 'bg-muted'}`} />
                {arrangementResult.modelName}
              </span>
            </div>

            {/* Psychometric Rationale */}
            {arrangementResult.psychometricRationale && (
              <div className="rounded-xl border border-line bg-subtle p-3.5 text-xs leading-relaxed text-ink-soft">
                <span className="font-semibold text-ink">Psychometric Rationale: </span>
                {arrangementResult.psychometricRationale}
              </div>
            )}

            {/* Phase breakdown */}
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {arrangementResult.phases.map((phase) => {
                const phaseQuestions = allQuestions.slice(phase.startIndex, phase.endIndex + 1);
                let phaseCorrect = 0;
                phaseQuestions.forEach(({ question: q }) => {
                  if (result.answers[q.id]?.isCorrect) phaseCorrect++;
                });
                const phasePct = phaseQuestions.length > 0 ? Math.round((phaseCorrect / phaseQuestions.length) * 100) : 0;

                return (
                  <div key={phase.phaseNumber} className="rounded-xl border border-line bg-subtle p-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-ink truncate">{phase.name}</span>
                      <span className={`font-bold tabular-nums ${phasePct >= 60 ? 'text-success-text' : phasePct >= 40 ? 'text-warning-text' : 'text-danger-text'}`}>
                        {phasePct}%
                      </span>
                    </div>
                    <div className="text-[10px] text-muted">
                      Q{phase.startIndex + 1} - Q{phase.endIndex + 1} · {phaseCorrect}/{phaseQuestions.length} correct
                    </div>
                    <div className="text-[10px] text-ink-soft leading-tight">
                      {phase.focusDescription}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Time Management Tips */}
            {arrangementResult.timeManagementTips && arrangementResult.timeManagementTips.length > 0 && (
              <div className="pt-1">
                <div className="text-[11px] font-semibold text-ink mb-1.5 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary" /> Gemini 3.8 Flash Time Management Strategy
                </div>
                <div className="grid gap-1.5 sm:grid-cols-3">
                  {arrangementResult.timeManagementTips.map((tip, idx) => (
                    <div key={idx} className="rounded-lg bg-raised p-2 text-[11px] text-muted leading-tight border border-line">
                      • {tip}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Question review */}
        <div className="rounded-2xl border border-line bg-card p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink">
            <Eye className="h-4 w-4 text-muted" /> Question-by-Question Review
          </div>
          <div className="space-y-4">
            {allQuestions.map(({ question: q }, idx) => {
              const ans = result.answers[q.id];
              const isCorrect = ans?.isCorrect;
              const selected = ans?.selected;
              return (
                <div key={q.id} className={`rounded-xl border p-4 ${isCorrect ? 'border-success-border bg-success-surface/30' : selected ? 'border-danger-border bg-danger-surface/30' : 'border-line bg-subtle'}`}>
                  <div className="flex items-start gap-2 mb-2">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg border border-line bg-raised text-[11px] font-bold text-ink">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      {isStatementQuestion(q.stem, q.questionType) && (
                        <div className="mb-1.5">
                          <span className="inline-flex items-center gap-1 rounded-md border border-indigo-500/25 bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                            <CheckSquare className="h-2.5 w-2.5" /> Statement 1 & 2
                          </span>
                        </div>
                      )}
                      <FormattedQuestionStem stem={q.stem} compact />
                    </div>
                    {isCorrect ? <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-success-text" /> : selected ? <XCircle className="h-4 w-4 flex-shrink-0 text-danger-text" /> : <Circle className="h-4 w-4 flex-shrink-0 text-muted" />}
                  </div>
                  <div className="pl-8 space-y-1">
                    {q.options.map(opt => (
                      <div key={opt.id} className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs ${opt.id === q.correctOption ? 'bg-success-surface font-semibold text-success-text' : opt.id === selected && !isCorrect ? 'bg-danger-surface text-danger-text line-through' : 'text-muted'}`}>
                        <span className="font-bold">{opt.id}.</span>
                        <span>{opt.text}</span>
                        {opt.id === q.correctOption && <span className="ml-auto font-bold">✓ Correct</span>}
                      </div>
                    ))}
                    {q.explanation && (
                      <div className="mt-2 rounded-lg border border-line bg-raised p-2.5 text-[11px] text-ink-soft leading-relaxed">
                        <span className="font-semibold text-ink">Explanation: </span>{q.explanation}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center gap-3 pb-8">
          <button
            type="button"
            onClick={() => setIsReviewModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition"
          >
            <CheckSquare className="h-4 w-4" /> Review Mistakes & Explanations
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary/20 px-5 py-3 text-sm font-semibold text-primary transition"
          >
            <History className="h-4 w-4" /> View All Test Records Ledger
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('creator')}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            <Plus className="h-4 w-4" /> Create New Test
          </button>
          {activeMock && (
            <button
              type="button"
              onClick={() => handleRetake({ id: 'cur', title: activeMock.title, score: result.totalScore, maxScore: result.maxScore, accuracy: result.accuracy, date: result.submittedAt, questionCount: allQuestions.length, subjects: (activeMock as any)._subjects ?? [], result, mock: activeMock })}
              className="flex items-center gap-2 rounded-xl border border-line bg-raised px-5 py-3 text-sm font-semibold text-ink transition hover:border-line-strong"
            >
              <RotateCcw className="h-4 w-4" /> Retake This Test
            </button>
          )}
        </div>

        {/* Detailed Mistake & Solution Review Modal */}
        {reviewSubmissionRecord && (
          <DetailedQuestionReviewModal
            isOpen={isReviewModalOpen}
            onClose={() => setIsReviewModalOpen(false)}
            submission={reviewSubmissionRecord}
          />
        )}
      </div>
    );
  }

  // ─── SCREEN: HISTORY & TEST RECORDS (Candidate Portal) ────────────────────
  if (activeTab === 'history') {
    return (
      <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
        <TestHistoryLedger
          userId={user?.uid}
          onResumeDraft={handleResumeDraft}
          onStartNewTest={() => setActiveTab('creator')}
        />
        {/* Detailed Mistake & Solution Review Modal */}
        {reviewSubmissionRecord && (
          <DetailedQuestionReviewModal
            isOpen={isReviewModalOpen}
            onClose={() => setIsReviewModalOpen(false)}
            submission={reviewSubmissionRecord}
          />
        )}
      </div>
    );
  }

  // ─── SCREEN: ADMIN CONTENT STUDIO (Authoring Tier) ────────────────────────
  if (activeTab === 'admin') {
    return (
      <div className="mx-auto max-w-7xl p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-indigo-600 px-2.5 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider">
                Admin Content Tier
              </span>
              <h1 className="text-xl font-bold font-display text-ink">Question Authoring Studio & AI Generation</h1>
            </div>
            <p className="text-xs text-muted mt-1">
              Author MCQs, generate with Gemini 3.5 Flash Lite or OpenCode CLI daemon, format in Google Form style, and save to central database.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('creator')}
            className="flex items-center gap-1.5 rounded-xl border border-line bg-raised px-4 py-2 text-xs font-semibold text-ink hover:bg-subtle transition"
          >
            <ChevronLeft className="h-4 w-4" /> Return to Student Portal
          </button>
        </div>

        <GoogleFormQuestionBuilder
          isOpen={true}
          onClose={() => setActiveTab('creator')}
          onLaunchTest={handleLaunchFromFormStudio}
          userId={user?.uid}
          initialTopic={topicFocus || 'CPM & PERT'}
        />
      </div>
    );
  }

  // ─── SCREEN: CREATOR (default) ────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Page title */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Mock Test Creator</h1>
        <p className="mt-1 text-sm text-muted">Configure and launch a timed mock test from the civil engineering question bank.</p>
      </motion.div>

      {/* AI Question Studio Google Form Style Banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.03 } }}
        className="rounded-2xl border-2 border-indigo-500/25 bg-gradient-to-r from-primary/10 via-indigo-500/10 to-purple-500/10 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
              <Sparkles className="h-4 w-4" />
            </span>
            <h2 className="text-sm font-bold text-ink">AI Question Studio & Database (Google Form Style)</h2>
            <span className="rounded-full bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5">NEW</span>
          </div>
          <p className="text-xs text-muted max-w-2xl">
            Want AI to author fresh MCQs? Prompt <span className="font-semibold text-primary">Gemini 3.8 Flash</span> on any topic (CPM, Soil, RCC), customize stems &amp; options in an interactive Google Form editor, save to your persistent database, and play mock tests!
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsFormStudioOpen(true)}
          className="flex-shrink-0 flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 shadow-md transition"
        >
          <Layers className="h-4 w-4" /> Open AI Question Studio
        </button>
      </motion.div>

      {/* Official 100-Question Examination Papers (Instant Launch) */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.04 } }}
        className="rounded-2xl border border-line bg-card p-4 sm:p-5 space-y-3 shadow-xs"
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs">
              <Trophy className="h-4 w-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-ink">Official 100-Question Exam Papers (Instant CBT Launch)</h2>
                <span className="rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 text-[10px] font-bold px-2 py-0.5">
                  2026 Paper Available
                </span>
              </div>
              <p className="text-[11px] text-muted">Take complete authentic examination papers with official marking rules and timed CBT simulation.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('pyq')}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            Browse PYQ Repository & Solutions →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* Dynamically published Admin Mock Tests */}
          {getAdminPublishedMockTests().map((admMock) => (
            <div key={admMock.id} className="rounded-xl border-2 border-indigo-500/40 bg-indigo-50/15 dark:bg-indigo-950/20 p-3.5 flex flex-col justify-between hover:border-indigo-500 transition shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                    ADMIN UPLOAD
                  </span>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono font-bold">{admMock.totalMarks} Marks</span>
                </div>
                <h3 className="font-bold text-xs text-ink mt-2 line-clamp-2">
                  {admMock.title}
                </h3>
                <p className="text-[11px] text-muted mt-1">
                  {admMock.sections.reduce((n, s) => n + s.questions.length, 0)} Qs • {admMock.durationMinutes} Min • −{admMock.negativeMarksPerIncorrect} penalty
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleLaunchPaper(admMock)}
                className="mt-3 w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 flex items-center justify-center gap-1.5 shadow-sm transition"
              >
                <PlayCircle className="h-3.5 w-3.5" /> Start Admin Mock
              </button>
            </div>
          ))}

          {/* 1. Assam DWR 2026 */}
          <div className="rounded-xl border-2 border-primary/40 bg-primary-fixed/20 p-3.5 flex flex-col justify-between hover:border-primary transition shadow-xs">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">
                  NEW • 11/01/2026
                </span>
                <span className="text-[10px] text-primary font-mono font-bold">100 Marks</span>
              </div>
              <h3 className="font-bold text-xs text-ink mt-2 line-clamp-2">
                Assam DWR Paper II: GS &amp; General English
              </h3>
              <p className="text-[11px] text-muted mt-1">
                Series A • 100 Qs • 120 Min • −0.25 penalty
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleLaunchPaper(MOCK_TEST_DWR_2026)}
              className="mt-3 w-full rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-bold py-2 flex items-center justify-center gap-1.5 shadow-sm transition"
            >
              <PlayCircle className="h-3.5 w-3.5" /> Start 2026 Mock
            </button>
          </div>

          {/* 2. APSC AE Civil */}
          <div className="rounded-xl border border-line bg-surface p-3.5 flex flex-col justify-between hover:border-line-strong transition">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                  APSC Technical
                </span>
                <span className="text-[10px] text-muted font-mono font-bold">200 Marks</span>
              </div>
              <h3 className="font-bold text-xs text-ink mt-2 line-clamp-2">
                APSC AE Civil Engineering (Paper II)
              </h3>
              <p className="text-[11px] text-muted mt-1">
                Advt 31/2025 • 100 Qs • 120 Min • −0.50 penalty
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleLaunchPaper(MOCK_TEST_CIVIL_100)}
              className="mt-3 w-full rounded-lg border border-line bg-raised hover:bg-subtle text-ink text-xs font-bold py-2 flex items-center justify-center gap-1.5 transition"
            >
              <PlayCircle className="h-3.5 w-3.5 text-primary" /> Start Civil Mock
            </button>
          </div>

          {/* 3. General Studies Paper I */}
          <div className="rounded-xl border border-line bg-surface p-3.5 flex flex-col justify-between hover:border-line-strong transition">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded">
                  State PSC / CCE
                </span>
                <span className="text-[10px] text-muted font-mono font-bold">200 Marks</span>
              </div>
              <h3 className="font-bold text-xs text-ink mt-2 line-clamp-2">
                General Studies Paper I Standard
              </h3>
              <p className="text-[11px] text-muted mt-1">
                Polity &amp; History • 100 Qs • 120 Min • −0.25 penalty
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleLaunchPaper(MOCK_TEST_GS_100)}
              className="mt-3 w-full rounded-lg border border-line bg-raised hover:bg-subtle text-ink text-xs font-bold py-2 flex items-center justify-center gap-1.5 transition"
            >
              <PlayCircle className="h-3.5 w-3.5 text-primary" /> Start GS Mock
            </button>
          </div>

          {/* 4. UPSC ESE Civil */}
          <div className="rounded-xl border border-line bg-surface p-3.5 flex flex-col justify-between hover:border-line-strong transition">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                  UPSC ESE / IES
                </span>
                <span className="text-[10px] text-muted font-mono font-bold">200 Marks</span>
              </div>
              <h3 className="font-bold text-xs text-ink mt-2 line-clamp-2">
                UPSC ESE Civil Advanced Paper
              </h3>
              <p className="text-[11px] text-muted mt-1">
                Statement-Heavy • 100 Qs • 120 Min • −0.33 penalty
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleLaunchPaper(MOCK_TEST_IES_CIVIL)}
              className="mt-3 w-full rounded-lg border border-line bg-raised hover:bg-subtle text-ink text-xs font-bold py-2 flex items-center justify-center gap-1.5 transition"
            >
              <PlayCircle className="h-3.5 w-3.5 text-primary" /> Start IES Mock
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* ── Creator form (3 cols) ── */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.05 } }} className="space-y-5 lg:col-span-3">
          <div className="rounded-2xl border border-line bg-card p-5 sm:p-6 space-y-6">
            {/* Test name */}
            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">Test Name <span className="text-muted font-normal">(optional)</span></label>
              <input
                type="text"
                value={testName}
                onChange={e => setTestName(e.target.value)}
                placeholder="e.g. CPM & PERT Exam Drill — Set 1"
                className="w-full rounded-xl border border-line bg-raised px-3.5 py-2.5 text-sm text-ink placeholder:text-muted-faint focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>

            {/* Topic Focus Filter */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-ink">
                  Topic Focus <span className="text-muted font-normal">(filter specifically to CPM, Soil, SOM, etc.)</span>
                </label>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsFormStudioOpen(true)}
                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="h-3 w-3" /> AI Form Studio
                  </button>
                  {topicFocus && (
                    <button
                      type="button"
                      onClick={() => setTopicFocus('')}
                      className="text-[11px] text-primary hover:underline"
                    >
                      Clear filter
                    </button>
                  )}
                </div>
              </div>
              <input
                type="text"
                value={topicFocus}
                onChange={e => setTopicFocus(e.target.value)}
                placeholder="e.g. CPM, PERT, Soil Mechanics, Consolidation, RCC, Fluid Mechanics..."
                className="w-full rounded-xl border border-line bg-raised px-3.5 py-2.5 text-sm text-ink placeholder:text-muted-faint focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
              {/* Quick Topic Chips */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {[
                  { label: '🌟 Assam DWR 2026 (Official)', topic: 'Assam', subjId: 'general-studies' },
                  { label: '🏛️ Polity & Constitution', topic: 'Polity', subjId: 'general-studies' },
                  { label: '🔤 General English', topic: 'English', subjId: 'general-studies' },
                  { label: '🎯 CPM & PERT', topic: 'CPM', subjId: 'cpm-management' },
                  { label: '🌱 Soil Mechanics (ExamVeda)', topic: 'Soil Mechanics', subjId: 'geotechnical' },
                  { label: '💧 Permeability & Seepage', topic: 'Permeability', subjId: 'geotechnical' },
                  { label: '⏳ Consolidation', topic: 'Consolidation', subjId: 'geotechnical' },
                  { label: '🏗️ Bearing Capacity & Piles', topic: 'Bearing Capacity', subjId: 'geotechnical' },
                  { label: '📐 SOM & Elastic Constants', topic: 'Strength of Materials', subjId: 'structural' },
                  { label: '🏢 RCC (IS 456)', topic: 'RCC', subjId: 'structural' },
                  { label: '🌊 Fluid Mechanics', topic: 'Fluid Mechanics', subjId: 'water-resources' },
                  { label: '🛣️ Highway & Traffic', topic: 'Highway', subjId: 'transportation' },
                  { label: '🔭 Surveying & Geomatics', topic: 'Surveying', subjId: 'surveying' },
                ].map(chip => {
                  const isSelected = topicFocus.toLowerCase() === chip.topic.toLowerCase();
                  return (
                    <button
                      key={chip.topic}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setTopicFocus('');
                        } else {
                          setTopicFocus(chip.topic);
                          if (chip.subjId) {
                            setSelectedSubjects([chip.subjId]);
                          }
                        }
                      }}
                      className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium transition ${
                        isSelected
                          ? 'border-primary bg-primary text-white font-bold shadow-xs'
                          : 'border-line bg-card hover:border-primary/40 hover:bg-subtle text-ink-soft'
                      }`}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subjects */}
            <div>
              <label className="block text-xs font-semibold text-ink mb-2">Subjects <span className="text-muted font-normal">— select one or more</span></label>
              <div className="flex flex-wrap gap-2">
                {SUBJECT_OPTIONS.map(subj => {
                  const active = selectedSubjects.includes(subj.id);
                  return (
                    <button
                      key={subj.id}
                      onClick={() => toggleSubject(subj.id)}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition ${active ? 'border-primary bg-primary-fixed text-primary' : 'border-line bg-raised text-ink-soft hover:border-primary/40 hover:text-ink'}`}
                    >
                      <span className={`h-2 w-2 rounded-full ${active ? 'bg-primary' : subj.color}`} />
                      {subj.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question count */}
            {/* Question count */}
            <div>
              <label className="block text-xs font-semibold text-ink mb-2">Number of Questions</label>
              <div className="flex gap-2">
                {QN_OPTIONS.map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setQuestionCount(n)}
                    className={`flex-1 rounded-xl border py-2.5 text-sm font-bold transition ${questionCount === n ? 'border-primary bg-primary text-white' : 'border-line bg-raised text-ink-soft hover:border-primary/40'}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Pattern / Format */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-ink">
                  Question Pattern / Format
                </label>
                <span className="text-[11px] font-semibold text-primary">
                  {PATTERN_OPTIONS.find(p => p.id === questionPattern)?.badge}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PATTERN_OPTIONS.map((pat) => {
                  const active = questionPattern === pat.id;
                  return (
                    <button
                      key={pat.id}
                      type="button"
                      onClick={() => setQuestionPattern(pat.id)}
                      className={`flex flex-col items-start rounded-xl border p-3 text-left transition ${
                        active
                          ? 'border-primary bg-primary-fixed shadow-xs'
                          : 'border-line bg-raised hover:border-primary/40 hover:bg-subtle'
                      }`}
                    >
                      <div className="flex w-full items-center justify-between gap-1.5">
                        <span className={`text-xs font-bold ${active ? 'text-primary' : 'text-ink'}`}>
                          {pat.label}
                        </span>
                        {pat.id === 'statement' && (
                          <span className="rounded bg-indigo-500/15 px-1.5 py-0.5 text-[9px] font-bold text-indigo-600 dark:text-indigo-400">
                            UPSC / GATE
                          </span>
                        )}
                      </div>
                      <span className={`mt-1 text-[11px] leading-tight ${active ? 'text-ink-soft' : 'text-muted'}`}>
                        {pat.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time limit */}
            <div>
              <label className="block text-xs font-semibold text-ink mb-2">
                Time Limit — <span className="font-normal text-muted">{Math.round(questionCount * timeMultiplier)} minutes total</span>
              </label>
              <div className="flex gap-2">
                {TIME_PRESETS.map(tp => (
                  <button
                    key={tp.multiplier}
                    type="button"
                    onClick={() => setTimeMultiplier(tp.multiplier)}
                    className={`flex-1 rounded-xl border py-2.5 text-xs font-semibold transition ${timeMultiplier === tp.multiplier ? 'border-primary bg-primary text-white' : 'border-line bg-raised text-ink-soft hover:border-primary/40'}`}
                  >
                    {tp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-xs font-semibold text-ink mb-2">Difficulty</label>
              <div className="flex gap-2">
                {DIFFICULTY_OPTIONS.map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 rounded-xl border py-2.5 text-xs font-semibold transition ${difficulty === d ? d === 'Easy' ? 'border-success bg-success text-white' : d === 'Hard' ? 'border-danger bg-danger text-white' : 'border-primary bg-primary text-white' : 'border-line bg-raised text-ink-soft hover:border-primary/40'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Gemini 3.8 Flash Question Arrangement */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-ink">AI Question Arrangement</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary tracking-wide">
                        <Zap className="h-2.5 w-2.5" /> GEMINI 3.8 FLASH
                      </span>
                    </div>
                    <p className="text-xs text-muted mt-0.5">
                      100% Curated Exam Bank · AI sequences questions with cognitive pacing, psychometric ramps, and domain interlacing.
                    </p>
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3 w-3 flex-shrink-0" />
                      <span>Zero AI question generation — questions are drawn strictly from verified syllabus banks</span>
                    </div>
                  </div>
                </div>

                {/* Toggle switch */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={useGeminiArrangement}
                  onClick={() => setUseGeminiArrangement(!useGeminiArrangement)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    useGeminiArrangement ? 'bg-primary' : 'bg-line-strong'
                  }`}
                  title={useGeminiArrangement ? 'AI arrangement active' : 'Click to enable AI arrangement'}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      useGeminiArrangement ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {useGeminiArrangement && (
                <div className="space-y-3 pt-2 border-t border-primary/10">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-ink">Sequencing Strategy</label>
                    <button
                      type="button"
                      onClick={() => setIsGeminiModalOpen(true)}
                      className="text-[11px] font-medium text-primary hover:underline flex items-center gap-1.5"
                    >
                      <span className={`inline-block h-2 w-2 rounded-full ${hasGeminiKey ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                      {hasGeminiKey ? 'Gemini 3.8 Flash Connected' : 'API Key Setup (Fallback Active)'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(Object.keys(STRATEGY_DETAILS) as ArrangementStrategy[]).map((stKey) => {
                      const st = STRATEGY_DETAILS[stKey];
                      const isSelected = arrangementStrategy === stKey;
                      return (
                        <button
                          key={stKey}
                          type="button"
                          onClick={() => setArrangementStrategy(stKey)}
                          className={`flex items-start gap-2.5 rounded-xl border p-3 text-left transition ${
                            isSelected
                              ? 'border-primary bg-card shadow-sm ring-1 ring-primary'
                              : 'border-line/70 bg-card/60 hover:bg-card hover:border-line-strong text-ink-soft'
                          }`}
                        >
                          <div className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${isSelected ? 'bg-primary text-white' : 'bg-subtle text-muted'}`}>
                            {stKey === 'adaptive_pacing' ? <Compass className="h-3.5 w-3.5" /> :
                             stKey === 'progressive_ramp' ? <BarChart2 className="h-3.5 w-3.5" /> :
                             stKey === 'interleaved_domains' ? <Brain className="h-3.5 w-3.5" /> :
                             <Zap className="h-3.5 w-3.5" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-xs font-bold ${isSelected ? 'text-ink' : 'text-ink-soft'}`}>
                                {st.label}
                              </span>
                              <span className="text-[9px] font-semibold text-primary bg-primary/10 rounded px-1.5 py-0.5">
                                {st.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-muted leading-tight mt-1 line-clamp-2">
                              {st.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Summary + Launch */}
            <div className="rounded-xl border border-line bg-subtle p-4 flex items-center justify-between gap-4">
              <div className="text-xs text-muted space-y-0.5">
                <div>
                  <span className="font-semibold text-ink">{questionCount} questions</span> · {PATTERN_OPTIONS.find(p => p.id === questionPattern)?.label} · {Math.round(questionCount * timeMultiplier)} min · {difficulty}
                  {topicFocus && (
                    <span className="ml-1.5 inline-flex items-center gap-1 rounded bg-teal-500/15 px-2 py-0.5 text-[11px] font-bold text-teal-700 dark:text-teal-300">
                      🎯 Topic: {topicFocus}
                    </span>
                  )}
                  {useGeminiArrangement && (
                    <span className="ml-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                      · <Sparkles className="h-3 w-3" /> {STRATEGY_DETAILS[arrangementStrategy]?.badge || 'Gemini 3.8 Flash'} Paced
                    </span>
                  )}
                </div>
                <div className="text-muted-faint">
                  {topicFocus ? `Focused on: ${topicFocus}` : selectedSubjects.map(s => SUBJECT_OPTIONS.find(o => o.id === s)?.label.split(' ')[0]).join(', ')}
                </div>
              </div>
              <button
                onClick={handleCreateTest}
                disabled={generating}
                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-sm shadow-primary/25 transition hover:bg-primary-dark disabled:opacity-60"
              >
                {generating ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Arranging with AI…</>
                ) : (
                  <><PlayCircle className="h-4 w-4" /> Start Test</>
                )}
              </button>
            </div>
          </div>

          {/* Quick stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Target, label: 'Marks / Q', value: '2.00', sub: '−0.50 wrong' },
              { icon: Clock, label: 'Duration', value: `${Math.round(questionCount * timeMultiplier)}m`, sub: `${timeMultiplier} min/Q` },
              { icon: Zap, label: 'Questions', value: String(questionCount), sub: difficulty },
              { icon: CheckSquare, label: 'Pattern', value: PATTERN_OPTIONS.find(p => p.id === questionPattern)?.badge || 'Mixed', sub: PATTERN_OPTIONS.find(p => p.id === questionPattern)?.label || 'Balanced' },
            ].map(stat => (
              <div key={stat.label} className="rounded-xl border border-line bg-card p-3.5">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-faint mb-1.5">
                  <stat.icon className="h-3 w-3" /> {stat.label}
                </div>
                <div className="font-display text-lg font-bold text-ink truncate">{stat.value}</div>
                <div className="text-[10px] text-muted truncate">{stat.sub}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Past Tests (2 cols) ── */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }} className="lg:col-span-2">
          <div className="rounded-2xl border border-line bg-card p-4 sm:p-5 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                <ClipboardList className="h-4 w-4 text-muted" />
                My Past Tests
              </div>
              {loadingPast && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted" />}
            </div>

            {pastTests.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center py-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-subtle text-muted">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm font-medium text-ink">No tests yet</div>
                  <div className="text-xs text-muted mt-0.5">Create your first test to see results here</div>
                </div>
              </div>
            ) : (
              <div className="space-y-2 overflow-y-auto flex-1 pr-0.5">
                {pastTests.map(pt => {
                  const pct = pt.maxScore > 0 ? Math.round((pt.score / pt.maxScore) * 100) : 0;
                  return (
                    <div key={pt.id} className="rounded-xl border border-line bg-subtle p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="truncate text-xs font-semibold text-ink">{pt.title}</div>
                          <div className="text-[10px] text-muted mt-0.5">
                            {new Date(pt.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} · {pt.questionCount}Q
                          </div>
                        </div>
                        <div className={`rounded-lg px-2 py-0.5 text-xs font-bold tabular-nums ${pct >= 60 ? 'bg-success-surface text-success-text' : pct >= 40 ? 'bg-warning-surface text-warning-text' : 'bg-danger-surface text-danger-text'}`}>
                          {pct}%
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleReview(pt)}
                          className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-line bg-raised py-1.5 text-[11px] font-medium text-ink-soft transition hover:border-line-strong hover:text-ink"
                        >
                          <Eye className="h-3 w-3" /> Review
                        </button>
                        <button
                          onClick={() => handleRetake(pt)}
                          className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-line bg-raised py-1.5 text-[11px] font-medium text-ink-soft transition hover:border-line-strong hover:text-ink"
                        >
                          <RefreshCw className="h-3 w-3" /> Retake
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Gemini 3.8 Flash API Key Configuration Modal */}
      <GeminiKeyModal
        isOpen={isGeminiModalOpen}
        onClose={() => setIsGeminiModalOpen(false)}
        onKeySaved={() => setHasGeminiKey(hasLiveAi())}
      />

      {/* Google Form-Style AI Question Studio & Database Modal */}
      <GoogleFormQuestionBuilder
        isOpen={isFormStudioOpen}
        onClose={() => setIsFormStudioOpen(false)}
        onLaunchTest={handleLaunchFromFormStudio}
        userId={user?.uid}
        initialTopic={topicFocus || 'CPM & PERT'}
      />

      {/* Detailed Mistake & Solution Review Modal */}
      {reviewSubmissionRecord && (
        <DetailedQuestionReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          submission={reviewSubmissionRecord}
        />
      )}
    </div>
  );
};
