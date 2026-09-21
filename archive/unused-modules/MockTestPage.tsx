import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import {
  MOCK_TESTS,
  MOCK_TEST_DWR_2026,
  MOCK_TEST_CIVIL_100,
  MOCK_TEST_GS_100,
  MOCK_TEST_IES_CIVIL,
  CIVIL_ENGINEERING_QUESTIONS,
  GENERAL_STUDIES_QUESTIONS
} from '../data/mockData';
import { getAllCombinedMockTests, getAdminPublishedMockTests } from '../services/adminPaperService';
import { submitMockTest, saveCustomMockTest, getCustomMockTests } from '../services/firestore';
import { MCQQuestion, TestSubmission, MockTest } from '../types';
import {
  Timer,
  Flag,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Trophy,
  ArrowRight,
  ArrowLeft,
  X,
  FileCheck,
  BookOpen,
  Layers,
  Sparkles,
  BrainCircuit,
  KeyRound,
  Wand2,
  AlertCircle,
  Play,
  Shield,
  ChartBar,
  Target,
  RefreshCw,
  Brain,
  Clock,
  FileText,
  Activity
} from 'lucide-react';
import {
  generateMockTestQuestions,
  hasLiveAi,
  providerLabel,
  getOllamaStatus,
  getLastAiError,
  getLastAiDiagnostics
} from '../services/aiProvider';
import { POPULAR_ESE_TOPICS } from '../services/aiIngestionService';
import { generateNumericalSet, generateQuestionSet } from '../services/mcqFactoryService';
import { generateBlueprint, generateAdaptiveMock, calculateSubjectMastery, generateRemediationPlan } from '../services/curriculumBlueprint';
import { ExamBlueprint, MockTestConfig } from '../types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { QuestionStemFormatter } from '../components/ui/QuestionStemFormatter';
import { useToast } from '../context/ToastContext';
import { useFocusTrap } from '../hooks/useFocusTrap';

const AI_MOCK_STORAGE_KEY = 'exampilot_ai_mock_test';

function loadStoredAiMock(): MockTest | null {
  try {
    const raw = localStorage.getItem(AI_MOCK_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === 'object' &&
      Array.isArray(parsed.sections) &&
      parsed.sections.every((s: any) => Array.isArray(s.questions) && s.questions.length > 0)
    ) {
      return parsed as MockTest;
    }
  } catch {
    // corrupted storage - ignore
  }
  return null;
}

function saveStoredAiMock(test: MockTest | null, userId?: string) {
  try {
    if (test) localStorage.setItem(AI_MOCK_STORAGE_KEY, JSON.stringify(test));
    else localStorage.removeItem(AI_MOCK_STORAGE_KEY);
  } catch {
    // storage unavailable - ignore
  }

  if (test && userId) {
    saveCustomMockTest(userId, test).catch((e) => {
      console.warn('Firestore saveCustomMockTest error:', e);
    });
  }
}

export const MockTestPage: React.FC<{
  onNavigateToAnalytics: () => void;
  onNavigateToStudio?: () => void;
}> = ({ onNavigateToAnalytics, onNavigateToStudio }) => {
  const { user, recordActivity } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const [selectedTestId, setSelectedTestId] = useState<string>('mock-civil-100');
  const [activeTest, setActiveTest] = useState<MockTest>(MOCK_TEST_CIVIL_100);
  const [aiMockTest, setAiMockTest] = useState<MockTest | null>(() => loadStoredAiMock());

  // Restore custom mock test from Cloud Firestore
  useEffect(() => {
    if (!user?.uid) return;
    getCustomMockTests(user.uid)
      .then((tests) => {
        if (tests && tests.length > 0 && !aiMockTest) {
          setAiMockTest(tests[0]);
        }
      })
      .catch((err) => {
        console.warn('Firestore getCustomMockTests error:', err);
      });
  }, [user?.uid]);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiCategory, setAiCategory] = useState<'civil' | 'gs'>('civil');
  const [aiCount, setAiCount] = useState<number>(25);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiProgress, setAiProgress] = useState('');
  const [aiError, setAiError] = useState<null | 'no-key' | 'failed'>(null);
  const [selectedLevel, setSelectedLevel] = useState<'mixed' | 'apsc' | 'ies'>('mixed');
  const [useExperimentalAi, setUseExperimentalAi] = useState(false);

  // Adaptive mock & blueprint state
  const [showBlueprint, setShowBlueprint] = useState(false);
  const [blueprint, setBlueprint] = useState<ExamBlueprint | null>(null);
  const [adaptiveConfig, setAdaptiveConfig] = useState<MockTestConfig | null>(null);
  const [adaptiveQuestions, setAdaptiveQuestions] = useState<MCQQuestion[]>([]);
  const [adaptiveGenerating, setAdaptiveGenerating] = useState(false);
  const [remediationPlan, setRemediationPlan] = useState<Array<{phase: string; content: string; questions: number; type: 'theory' | 'medium' | 'hard' | 'mini-test' | 'retest'}>>([]);
  const [showRemediation, setShowRemediation] = useState(false);
  const [userMastery, setUserMastery] = useState<Record<string, number>>({});

  useEffect(() => {
    let nextTest: MockTest;
    if (selectedTestId === 'ai-generated') {
      if (!aiMockTest) {
        setShowAiPanel(true);
        return;
      }
      nextTest = aiMockTest;
    } else {
      const allMocks = getAllCombinedMockTests(MOCK_TESTS);
      nextTest = allMocks.find((t) => t.id === selectedTestId) || MOCK_TEST_DWR_2026 || MOCK_TEST_CIVIL_100;
    }
    setActiveTest(nextTest);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setMarkedForReview({});
    setTimeLeft(nextTest.durationMinutes * 60);
    setIsSubmitted(false);
    setSubmissionResult(null);
  }, [selectedTestId, aiMockTest]);

  // Flatten all questions across sections — memoized so it's only rebuilt when
  // the active test changes, not on every keystroke or state update.
  const allQuestions: { question: MCQQuestion; sectionName: string; sectionId: string }[] = React.useMemo(() => {
    const flat: { question: MCQQuestion; sectionName: string; sectionId: string }[] = [];
    activeTest.sections.forEach((sec) => {
      sec.questions.forEach((q) => {
        flat.push({ question: q, sectionName: sec.name, sectionId: sec.id });
      });
    });
    return flat;
  }, [activeTest]);
  const marksPerQ = allQuestions.length > 0 ? activeTest.totalMarks / allQuestions.length : 2;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D' | null>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(activeTest.durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<TestSubmission | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const confirmTrapRef = useFocusTrap(showConfirmModal);

  const handleCancelTest = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setMarkedForReview({});
    setTimeLeft(activeTest.durationMinutes * 60);
    setIsSubmitted(false);
    setSubmissionResult(null);
    setShowConfirmCancel(false);
    toastSuccess('Mock Test Cancelled', 'Test progress has been reset.');
  };

  useEffect(() => {
    if (!showConfirmModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowConfirmModal(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showConfirmModal]);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted]);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const safeIndex = Math.min(currentIndex, allQuestions.length - 1);
  const currentItem = allQuestions[safeIndex] || allQuestions[0];
  const currentQ = currentItem.question;
  const currentAnswer = selectedAnswers[currentQ.id];
  const isMarked = Boolean(markedForReview[currentQ.id]);

  const handleSelectOption = (opt: 'A' | 'B' | 'C' | 'D') => {
    setSelectedAnswers({ ...selectedAnswers, [currentQ.id]: opt });
  };

  const handleClearResponse = () => {
    const copy = { ...selectedAnswers };
    delete copy[currentQ.id];
    setSelectedAnswers(copy);
  };

  const handleToggleReview = () => {
    setMarkedForReview({ ...markedForReview, [currentQ.id]: !isMarked });
  };

  const buildFallbackMock = (fallbackQuestions: MCQQuestion[], sourceLabel: string, fallbackTopic: string) => {
    const test: MockTest = {
      id: 'ai-generated',
      title: `${sourceLabel}: ${fallbackTopic}`,
      examId: aiCategory === 'civil' ? 'apsc-ae-civil' : 'apsc-cce-gs',
      paperName: aiCategory === 'civil' ? `${sourceLabel} Civil Mock` : `${sourceLabel} GS Mock`,
      durationMinutes: Math.max(10, Math.round(fallbackQuestions.length * 1.2)),
      totalMarks: fallbackQuestions.length * 2,
      negativeMarksPerIncorrect: 0.25,
      sections: [
        {
          id: 'ai-section-1',
          name: `${sourceLabel}: ${fallbackTopic}`,
          totalQuestions: fallbackQuestions.length,
          questions: fallbackQuestions
        }
      ]
    };
    setAiMockTest(test);
    saveStoredAiMock(test, user?.uid);
    setSelectedTestId('ai-generated');
    setShowAiPanel(false);
    toastSuccess(`${sourceLabel} mock ready`, `${fallbackQuestions.length} questions — deterministic recipes (offline)`);
  };

  const handleGenerateFallback = async () => {
    const topic = aiTopic.trim() || 'Mixed Topics';
    setAiGenerating(true);
    setAiError(null);
    setAiProgress('Generating offline recipe mock…');
    try {
      // Try full factory (recipes + AI if key exists, else recipes only)
      const result = await generateQuestionSet({
        count: aiCount,
        subjects: aiCategory === 'civil' ? undefined : undefined,
        aiSubject: topic,
        aiTopic: topic,
        numericalShare: 1 // prefer deterministic when offline
      });
      let questions = result.questions;
      if (questions.length === 0) {
        // Absolute fallback: pure numerical recipes
        const num = generateNumericalSet({ count: aiCount, seed: Date.now() % 100000 });
        questions = num.questions;
      }
      if (questions.length === 0) {
        setAiError('failed');
        toastError('Offline generation also failed', 'Try a different topic or reduce count');
        return;
      }
      buildFallbackMock(questions, 'Offline Recipe', topic);
    } catch (err) {
      console.warn('[ExamPilot] Fallback mock failed:', err);
      setAiError('failed');
    } finally {
      setAiGenerating(false);
      setAiProgress('');
    }
  };

  const handleGenerateExamMock = async () => {
    const topic = aiTopic.trim();
    if (aiGenerating) return;

    if (useExperimentalAi && hasLiveAi()) {
      await handleGenerateAiMock();
      return;
    }

    // Deterministic Exam Bank Generation (Instant, 100% Offline, Zero Failure)
    setAiGenerating(true);
    setAiError(null);
    setAiProgress('Sampling verified questions from APSC & UPSC ESE question bank…');

    try {
      let pool = aiCategory === 'civil' ? [...CIVIL_ENGINEERING_QUESTIONS] : [...GENERAL_STUDIES_QUESTIONS];

      if (topic && topic !== 'All Branches (Mixed Full Mock)') {
        const qLower = topic.toLowerCase();
        const matched = pool.filter(
          (q) =>
            q.subject.toLowerCase().includes(qLower) ||
            q.topic.toLowerCase().includes(qLower) ||
            (q.subtopic && q.subtopic.toLowerCase().includes(qLower)) ||
            q.stem.toLowerCase().includes(qLower)
        );
        if (matched.length >= 5) {
          pool = matched;
        }
      }

      if (selectedLevel === 'apsc') {
        const apscPool = pool.filter((q) => q.examId.includes('apsc') || q.difficulty !== 'HARD');
        if (apscPool.length >= 5) pool = apscPool;
      } else if (selectedLevel === 'ies') {
        const iesPool = pool.filter((q) => q.examId.includes('ies') || q.difficulty === 'HARD' || q.difficulty === 'MEDIUM');
        if (iesPool.length >= 5) pool = iesPool;
      }

      // Randomize sample
      const shuffled = pool.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, aiCount);

      if (selected.length === 0) {
        setAiError('failed');
        toastError('Not enough matching questions in bank', 'Try selecting "All Branches" or reduce count');
        return;
      }

      const label =
        selectedLevel === 'ies'
          ? 'UPSC ESE / IES Level'
          : selectedLevel === 'apsc'
          ? 'APSC AE / State PSC'
          : 'Civil Engineering Exam Bank';

      buildFallbackMock(selected, label, topic || 'Comprehensive Testbook Series');
    } catch (err) {
      console.warn('[ExamPilot] Bank mock generation failed:', err);
      setAiError('failed');
    } finally {
      setAiGenerating(false);
      setAiProgress('');
    }
  };

  const handleGenerateAiMock = async () => {
    const topic = aiTopic.trim();
    if (!topic || aiGenerating) return;
    if (!hasLiveAi()) {
      // No key — generate offline instead of blocking the user
      toastSuccess('No Gemini key — generating offline mock', 'Deterministic recipes (verified keys) — add a key in AI Studio for Gemini drafts');
      await handleGenerateFallback();
      return;
    }

    setAiGenerating(true);
    setAiError(null);
    setAiProgress('Connecting to Gemini…');

    try {
      const questions = await generateMockTestQuestions({
        topicQuery: topic,
        category: aiCategory,
        questionCount: aiCount,
        examName: user?.preferences?.examName,
        onProgress: (_b, _t, message) => setAiProgress(message)
      });

      if (questions.length === 0) {
        const diag = getLastAiDiagnostics();
        const errMsg = getLastAiError();
        console.warn('[ExamPilot] AI mock empty:', { errMsg, diag });
        // Auto-fallback to recipes so the user is not blocked
        const fallback = await generateQuestionSet({
          count: aiCount,
          aiSubject: topic,
          aiTopic: topic,
          numericalShare: 0.6
        });
        let fbQuestions = fallback.questions;
        if (fbQuestions.length === 0) {
          const num = generateNumericalSet({ count: aiCount, seed: Date.now() % 100000 });
          fbQuestions = num.questions;
        }
        if (fbQuestions.length > 0) {
          buildFallbackMock(fbQuestions, 'Offline Recipe (AI failed)', topic);
          // still surface that AI failed but we recovered
          setAiError(null);
          return;
        }
        setAiError('failed');
        return;
      }

      const test: MockTest = {
        id: 'ai-generated',
        title: `AI Mock: ${topic}`,
        examId: aiCategory === 'civil' ? 'apsc-ae-civil' : 'apsc-cce-gs',
        paperName: aiCategory === 'civil' ? 'AI Civil Engineering Mock' : 'AI General Studies Mock',
        durationMinutes: Math.max(10, Math.round(questions.length * 1.2)),
        totalMarks: questions.length * 2,
        negativeMarksPerIncorrect: 0.25,
        sections: [
          {
            id: 'ai-section-1',
            name: `AI Generated: ${topic}`,
            totalQuestions: questions.length,
            questions
          }
        ]
      };

      setAiMockTest(test);
      saveStoredAiMock(test, user?.uid);
      setSelectedTestId('ai-generated');
      setShowAiPanel(false);
    } catch (err) {
      console.warn('[ExamPilot] AI mock generation failed:', err);
      setAiError('failed');
    } finally {
      setAiGenerating(false);
      setAiProgress('');
    }
  };

  const handleSubmitTest = async () => {
    setShowConfirmModal(false);

    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    const answersRecord: TestSubmission['answers'] = {};

    allQuestions.forEach(({ question }) => {
      const ans = selectedAnswers[question.id];
      if (!ans) {
        unattempted++;
        answersRecord[question.id] = { selected: null, isCorrect: false, timeSeconds: 0 };
      } else if (ans === question.correctOption) {
        correct++;
        answersRecord[question.id] = { selected: ans, isCorrect: true, timeSeconds: 45 };
      } else {
        incorrect++;
        answersRecord[question.id] = { selected: ans, isCorrect: false, timeSeconds: 45 };
      }
    });

    const marksPerQ = activeTest.totalMarks / allQuestions.length; // 2.0 marks per question
    const grossScore = correct * marksPerQ;
    const penalty = incorrect * (marksPerQ * activeTest.negativeMarksPerIncorrect); // 0.50 mark penalty
    const totalScore = Math.max(0, Math.round((grossScore - penalty) * 100) / 100);
    const accuracy = correct + incorrect > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0;
    const percentile = Math.min(99.6, Math.round((totalScore / activeTest.totalMarks) * 100 + 10));

    const submission: TestSubmission = {
      id: 'sub-' + Date.now(),
      testId: activeTest.id,
      userId: user?.uid || 'guest',
      submittedAt: new Date().toISOString(),
      timeSpentSeconds: activeTest.durationMinutes * 60 - timeLeft,
      totalScore,
      maxScore: activeTest.totalMarks,
      accuracy,
      percentile,
      totalAttempted: correct + incorrect,
      correctCount: correct,
      incorrectCount: incorrect,
      unattemptedCount: unattempted,
      answers: answersRecord
    };

    try {
      await submitMockTest(submission);
    } catch (e) {
      console.warn('submitMockTest fallback:', e);
    }
    setSubmissionResult(submission);
    setIsSubmitted(true);
    toastSuccess(`Mock submitted — ${totalScore}/${activeTest.totalMarks}`, `${correct} correct, ${incorrect} wrong, ${accuracy}% accuracy`);

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.warn('Confetti error:', e);
    }

    // Update user stats with test activity
    try {
      const studyHours = Math.max(0.1, Math.round(((activeTest.durationMinutes * 60 - timeLeft) / 3600) * 10) / 10);
      await recordActivity(correct + incorrect, correct, studyHours);
    } catch (e) {
      console.warn('Failed to record mock activity:', e);
    }

    // Generate remediation plan directly from the current submission
    const weakTopicsSet = new Set<string>();
    allQuestions.forEach(({ question }) => {
      const ans = answersRecord[question.id];
      if (ans && !ans.isCorrect && ans.selected !== null) {
        weakTopicsSet.add(question.topic || question.subject);
      }
    });

    const weakAreas = Array.from(weakTopicsSet).slice(0, 3);
    if (weakAreas.length === 0) {
      if (accuracy < 70) {
        weakAreas.push(activeTest.paperName || 'Comprehensive Review');
      } else {
        weakAreas.push('Speed & Advanced Accuracy');
      }
    }
    const plan = generateRemediationPlan(weakAreas);
    setRemediationPlan(plan);
    setShowRemediation(true);
  };

  // Generate blueprint for the current exam
  const handleGenerateBlueprint = () => {
    const bp = generateBlueprint('apsc-ae-civil', activeTest.paperName, allQuestions.length);
    setBlueprint(bp);
    setShowBlueprint(true);
    toastSuccess('Blueprint generated', `${bp.questionCount} questions across ${bp.subjectDistribution ? Object.keys(bp.subjectDistribution).length : 0} subjects`);
  };

  // Generate adaptive mock
  const handleGenerateAdaptiveMock = () => {
    if (adaptiveGenerating) return;
    setAdaptiveGenerating(true);

    const config: MockTestConfig = {
      examId: 'apsc-ae-civil',
      paper: activeTest.paperName,
      questionCount: allQuestions.length,
      durationMinutes: activeTest.durationMinutes,
      difficulty: 'Mixed',
      questionTypes: ['NUMERICAL', 'FORMULA_RECALL', 'CONCEPTUAL'],
      negativeMarking: activeTest.negativeMarksPerIncorrect > 0,
      negativeMarksPerIncorrect: activeTest.negativeMarksPerIncorrect
    };
    setAdaptiveConfig(config);

    try {
      const questions = generateAdaptiveMock(config, userMastery);
      const test: MockTest = {
        id: 'adaptive-mock',
        title: `Adaptive Mock — ${activeTest.title}`,
        examId: 'apsc-ae-civil',
        paperName: `Adaptive: ${activeTest.paperName}`,
        durationMinutes: activeTest.durationMinutes,
        totalMarks: questions.length * 2,
        negativeMarksPerIncorrect: activeTest.negativeMarksPerIncorrect,
        sections: [{ id: 'adaptive-sec', name: 'Adaptive Mock Questions', totalQuestions: questions.length, questions }]
      };
      setAdaptiveQuestions(questions);
      setAiMockTest(test);
      saveStoredAiMock(test, user?.uid);
      setSelectedTestId('ai-generated');
      setShowBlueprint(false);
      toastSuccess('Adaptive mock generated', `${questions.length} questions tailored to your mastery profile`);
    } catch (err) {
      console.warn('[ExamPilot] Adaptive mock failed:', err);
      toastError('Adaptive generation failed', 'Try again or use standard mock');
    } finally {
      setAdaptiveGenerating(false);
    }
  };

  // Calculate mastery from stored submissions
  const handleCalculateMastery = async () => {
    try {
      const submissions = await (await import('../services/firestore')).getTestSubmissions(user?.uid || 'guest');
      const mastery = calculateSubjectMastery(submissions);
      setUserMastery(mastery);
      toastSuccess('Mastery calculated', `${Object.keys(mastery).length} subjects analyzed`);
    } catch {
      toastError('Mastery calculation failed', 'Try again later');
    }
  };

  // If submitted, display detailed 100-question score report!
  if (isSubmitted && submissionResult) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <Card flush className="p-6 sm:p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-success-surface text-success-text flex items-center justify-center mx-auto shadow-sm">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <Badge tone="success" size="md">
              Exam Evaluated & Saved to Firestore
            </Badge>
            <h2 className="font-display font-bold text-2xl text-ink mt-2">
              Performance Scorecard ({allQuestions.length} Questions)
            </h2>
            <p className="text-xs text-muted mt-1">{activeTest.title}</p>
          </div>

          {/* Primary Score Numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-subtle border border-line">
              <div className="text-[10px] uppercase font-bold text-muted-faint">Total Marks</div>
              <div className="font-display font-bold text-2xl text-primary mt-1">
                {submissionResult.totalScore} / {submissionResult.maxScore}
              </div>
              <div className="text-[10px] text-muted-faint mt-0.5">{marksPerQ} Marks / Question</div>
            </div>
            <div className="p-4 rounded-xl bg-subtle border border-line">
              <div className="text-[10px] uppercase font-bold text-muted-faint">Accuracy</div>
              <div className="font-display font-bold text-2xl text-success-text mt-1">
                {submissionResult.accuracy}%
              </div>
              <div className="text-[10px] text-success-text mt-0.5">High precision rate</div>
            </div>
            <div className="p-4 rounded-xl bg-subtle border border-line">
              <div className="text-[10px] uppercase font-bold text-muted-faint">Projected Percentile</div>
              <div className="font-display font-bold text-2xl text-primary mt-1">
                {submissionResult.percentile}%ile
              </div>
              <div className="text-[10px] text-primary mt-0.5">State rank estimate</div>
            </div>
            <div className="p-4 rounded-xl bg-subtle border border-line">
              <div className="text-[10px] uppercase font-bold text-muted-faint">Attempt Rate</div>
              <div className="font-display font-bold text-2xl text-ink mt-1">
                {submissionResult.totalAttempted} / {allQuestions.length}
              </div>
              <div className="text-[10px] text-muted-faint mt-0.5">{allQuestions.length - submissionResult.totalAttempted} skipped</div>
            </div>
          </div>

          {/* Correct / Incorrect breakdown */}
          <div className="p-4 rounded-xl bg-subtle border border-line flex flex-wrap items-center justify-around gap-2 text-xs">
            <div className="text-success-text font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-success-text" />
              <span>{submissionResult.correctCount} Correct (+{(submissionResult.correctCount * marksPerQ).toFixed(1)} marks)</span>
            </div>
            <div className="text-danger-text font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-danger-text" />
              <span>{submissionResult.incorrectCount} Incorrect (-{(submissionResult.incorrectCount * marksPerQ * activeTest.negativeMarksPerIncorrect).toFixed(2)} negative penalty)</span>
            </div>
            <div className="text-muted font-medium">
              {submissionResult.unattemptedCount} Unattempted (0 marks)
            </div>
          </div>

          {/* Remediation Section — per PROMP.txt §37 */}
          {showRemediation && remediationPlan.length > 0 && (
            <Card flush className="p-4 sm:p-5 space-y-3 border-warning-border">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-warning-text" />
                <h3 className="font-display font-bold text-sm text-ink">AI Remediation Plan</h3>
                <Badge tone="warning">{remediationPlan.length} steps</Badge>
              </div>
              <p className="text-xs text-muted">Based on your performance analysis, here is your personalized remediation path:</p>
              <div className="space-y-2">
                {remediationPlan.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-subtle border border-line">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      step.type === 'theory' ? 'bg-info-surface text-info-text' :
                      step.type === 'medium' ? 'bg-brand text-brand-text' :
                      step.type === 'hard' ? 'bg-danger-surface text-danger-text' :
                      step.type === 'mini-test' ? 'bg-warning-surface text-warning-text' :
                      'bg-success-surface text-success-text'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-ink">{step.phase}</span>
                        <Badge tone={
                          step.type === 'theory' ? 'info' :
                          step.type === 'medium' ? 'brand' :
                          step.type === 'hard' ? 'danger' :
                          step.type === 'mini-test' ? 'warning' :
                          'success'
                        } size="xs">{step.type}</Badge>
                      </div>
                      <p className="text-[11px] text-ink-soft leading-relaxed mt-0.5">{step.content}</p>
                      <span className="text-[10px] text-muted-faint mt-0.5 block">{step.questions} questions</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setSelectedAnswers({});
                setMarkedForReview({});
                setTimeLeft(activeTest.durationMinutes * 60);
                setCurrentIndex(0);
              }}
              className="px-4 py-2.5 rounded-xl border border-line hover:bg-subtle text-xs font-semibold text-ink-soft flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake This Mock</span>
            </button>
            <button
              onClick={onNavigateToAnalytics}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold shadow-md shadow-primary/20 flex items-center gap-2"
            >
              <span>View Performance Radar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4 animate-fadeIn max-w-6xl mx-auto">
      {/* Paper Switcher Tabs (Civil Mock vs GS Mock) */}
      {/* Paper Switcher Tabs */}
      <Card flush className="p-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 flex-1 flex-wrap">
          <button
            onClick={() => setSelectedTestId('mock-dwr-2026')}
            className={`flex-1 min-w-[160px] py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              selectedTestId === 'mock-dwr-2026'
                ? 'bg-primary text-white shadow-sm'
                : 'text-ink-soft hover:bg-subtle-strong'
            }`}
          >
            <Sparkles className="w-4 h-4 text-warning-text" />
            <span>Assam DWR 2026 (100 Qs)</span>
          </button>

          <button
            onClick={() => setSelectedTestId('mock-ae-wrd-2025')}
            className={`flex-1 min-w-[160px] py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              selectedTestId === 'mock-ae-wrd-2025'
                ? 'bg-primary text-white shadow-sm'
                : 'text-ink-soft hover:bg-subtle-strong'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>AE WRD 2025 (100 Qs)</span>
          </button>

          <button
            onClick={() => setSelectedTestId('mock-uto-2025')}
            className={`flex-1 min-w-[160px] py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              selectedTestId === 'mock-uto-2025'
                ? 'bg-primary text-white shadow-sm'
                : 'text-ink-soft hover:bg-subtle-strong'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>UTO Civil 2025 (100 Qs)</span>
          </button>

          {getAdminPublishedMockTests().map((adm) => (
            <button
              key={adm.id}
              onClick={() => setSelectedTestId(adm.id)}
              className={`flex-1 min-w-[160px] py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                selectedTestId === adm.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 hover:bg-indigo-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="truncate">{adm.title}</span>
            </button>
          ))}

          <button
            onClick={() => setSelectedTestId('mock-civil-100')}
            className={`flex-1 min-w-[160px] py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              selectedTestId === 'mock-civil-100'
                ? 'bg-primary text-white shadow-sm'
                : 'text-ink-soft hover:bg-subtle-strong'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>APSC AE Civil (100 Qs)</span>
          </button>

          <button
            onClick={() => setSelectedTestId('mock-ies-civil')}
            className={`flex-1 min-w-[160px] py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              selectedTestId === 'mock-ies-civil'
                ? 'bg-primary text-white shadow-sm'
                : 'text-ink-soft hover:bg-subtle-strong'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>UPSC ESE / IES Mock</span>
          </button>

          <button
            onClick={() => setSelectedTestId('mock-gs-100')}
            className={`flex-1 min-w-[160px] py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              selectedTestId === 'mock-gs-100'
                ? 'bg-primary text-white shadow-sm'
                : 'text-ink-soft hover:bg-subtle-strong'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>General Studies (100 Qs)</span>
          </button>

          <button
            onClick={() => {
              if (selectedTestId === 'ai-generated') {
                setShowAiPanel((p) => !p);
              } else if (aiMockTest) {
                setSelectedTestId('ai-generated');
              } else {
                setShowAiPanel(true);
              }
            }}
            className={`flex-1 min-w-[160px] py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              selectedTestId === 'ai-generated' || showAiPanel
                ? 'bg-primary text-white shadow-sm'
                : 'text-primary bg-primary-fixed border border-primary-fixed-dim hover:bg-primary-fixed'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>Custom Mock Generator</span>
            <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded bg-white/20 font-mono">
              Exam Bank
            </span>
          </button>
        </div>
      </Card>

      {/* Custom Exam Generator Panel (Offline-First Question Bank) */}
      {showAiPanel && (
        <div className="bg-card rounded-2xl border border-primary-fixed-dim p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary-fixed text-primary flex items-center justify-center flex-shrink-0">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm text-ink">
                  Custom Civil Engineering Exam Generator
                </h3>
                <p className="text-[11px] text-muted">
                  Instant offline sampling from verified APSC AE and UPSC ESE question banks (Testbook standards) across all 12 branches of Civil Engineering.
                </p>
              </div>
            </div>

            {aiMockTest && (
              <button
                onClick={() => {
                  setSelectedTestId('ai-generated');
                  setShowAiPanel(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-[11px] font-bold transition flex items-center gap-1.5 flex-shrink-0"
              >
                <Play className="w-3.5 h-3.5" />
                Resume Current Custom Mock ({aiMockTest.sections.reduce((n, s) => n + s.questions.length, 0)} Qs)
              </button>
            )}
          </div>

          {/* Level Selector: Mixed / APSC AE / UPSC IES */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold text-ink-soft">Target Standard:</span>
            <div className="inline-flex p-0.5 bg-subtle-strong rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSelectedLevel('mixed')}
                className={`px-3 py-1.5 rounded-md transition ${
                  selectedLevel === 'mixed' ? 'bg-card text-primary shadow-2xs' : 'text-ink-soft'
                }`}
              >
                Mixed Difficulty
              </button>
              <button
                type="button"
                onClick={() => setSelectedLevel('apsc')}
                className={`px-3 py-1.5 rounded-md transition ${
                  selectedLevel === 'apsc' ? 'bg-card text-primary shadow-2xs' : 'text-ink-soft'
                }`}
              >
                APSC CCE / AE Level
              </button>
              <button
                type="button"
                onClick={() => setSelectedLevel('ies')}
                className={`px-3 py-1.5 rounded-md transition ${
                  selectedLevel === 'ies' ? 'bg-card text-primary shadow-2xs' : 'text-ink-soft'
                }`}
              >
                UPSC ESE / IES Level
              </button>
            </div>
          </div>

          {/* Topic Input + Category + Count */}
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateExamMock()}
              placeholder="Filter by branch or topic (e.g. Geotechnical, IS 456, Fluid Mechanics)..."
              className="flex-1 min-w-[240px] h-10 px-4 rounded-xl border border-line text-xs sm:text-sm text-ink placeholder-muted-faint focus:border-primary-fixed-dim focus:ring-2 focus:ring-purple-500/10 transition"
            />

            <div className="inline-flex p-0.5 bg-subtle-strong rounded-lg text-xs font-semibold">
              <button
                onClick={() => setAiCategory('civil')}
                className={`px-3 py-1.5 rounded-md transition ${
                  aiCategory === 'civil' ? 'bg-card text-primary shadow-2xs' : 'text-ink-soft'
                }`}
              >
                Civil Engineering
              </button>
              <button
                onClick={() => setAiCategory('gs')}
                className={`px-3 py-1.5 rounded-md transition ${
                  aiCategory === 'gs' ? 'bg-card text-primary shadow-2xs' : 'text-ink-soft'
                }`}
              >
                General Studies
              </button>
            </div>

            <div className="inline-flex p-0.5 bg-subtle-strong rounded-lg text-xs font-semibold">
              {[10, 20, 30, 50].map((n) => (
                <button
                  key={n}
                  onClick={() => setAiCount(n)}
                  className={`px-3 py-1.5 rounded-md transition ${
                    aiCount === n ? 'bg-card text-primary shadow-2xs' : 'text-ink-soft'
                  }`}
                >
                  {n} Qs
                </button>
              ))}
            </div>
          </div>

          {/* Branch Preset Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
            <span className="text-muted-faint font-medium whitespace-nowrap">Civil Branches:</span>
            {[
              'All Branches (Mixed Full Mock)',
              'Building Materials & Concrete',
              'Strength of Materials (SOM)',
              'Structural Analysis',
              'Reinforced Concrete (IS 456)',
              'Design of Steel (IS 800)',
              'Geotechnical Engineering',
              'Fluid Mechanics & Hydraulics',
              'Hydrology & Irrigation',
              'Environmental Engineering',
              'Transportation & Highways',
              'Surveying & Geomatics',
              'CPM-PERT & Estimating'
            ].map((branch) => (
              <button
                key={branch}
                type="button"
                onClick={() => {
                  setAiTopic(branch === 'All Branches (Mixed Full Mock)' ? '' : branch);
                  setAiCategory('civil');
                }}
                className={`px-2.5 py-1 rounded-full text-ink-soft whitespace-nowrap border transition ${
                  aiTopic === branch || (!aiTopic && branch.startsWith('All'))
                    ? 'bg-primary text-white border-primary'
                    : 'bg-subtle-strong hover:bg-primary-fixed hover:text-primary border-transparent'
                }`}
              >
                {branch}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-[11px] text-muted">
                Format: 2 marks per correct • 0.5 penalty • {Math.max(10, Math.round(aiCount * 1.2))} min • 100% offline verified bank
              </span>
              <label className="flex items-center gap-1.5 text-[11px] text-muted-faint hover:text-ink cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={useExperimentalAi}
                  onChange={(e) => setUseExperimentalAi(e.target.checked)}
                  className="rounded border-line text-primary focus:ring-primary/20 w-3.5 h-3.5"
                />
                <span>Use experimental AI synthesis (optional)</span>
              </label>
            </div>
            <Button
              onClick={() => handleGenerateExamMock()}
              disabled={aiGenerating}
              loading={aiGenerating}
              icon={!aiGenerating ? <Wand2 className="w-4 h-4" /> : undefined}
              className="shadow-md shadow-primary/20"
            >
              {`Generate ${aiCount}-Question Mock`}
            </Button>
          </div>

          {aiGenerating && aiProgress && (
            <div className="p-3.5 rounded-xl bg-primary-fixed border border-primary-fixed-dim text-xs text-primary font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 flex-shrink-0 animate-pulse" />
              <span>{aiProgress}</span>
              <span className="text-primary-light text-[10px] ml-auto whitespace-nowrap">50 Qs may take ~1 minute</span>
            </div>
          )}

          {aiError === 'no-key' && (
            <div className="p-3.5 rounded-xl bg-warning-surface border border-warning-border text-xs text-warning-text font-medium space-y-2">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 flex-shrink-0" />
                 <span>Free mode: no Gemini key set. Start an Ollama server (<code>http://127.0.0.1:11434</code>) and pull a model, or use the offline recipe engine.</span>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={handleGenerateFallback}>
                  Generate Offline Mock
                </Button>
                {onNavigateToStudio && (
                  <Button variant="ghost" size="sm" onClick={onNavigateToStudio}>
                    Open AI Studio
                  </Button>
                )}
              </div>
            </div>
          )}

          {aiError === 'failed' && (
            <div className="p-3.5 rounded-xl bg-danger-surface border border-danger-border text-xs text-danger-text font-medium space-y-2">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  Generation failed — the model returned no valid questions.
                </span>
                <Button variant="danger" size="sm" onClick={handleGenerateAiMock}>
                  Retry AI
                </Button>
              </div>
              <p className="text-[11px] leading-relaxed opacity-80">
                {getLastAiError() ? `Detail: ${getLastAiError()}` : 'Check your Gemini key and connection.'} Try offline generation instead — verified recipes with computed keys.
              </p>
              {getLastAiDiagnostics().model && (
                <p className="text-[10px] font-mono opacity-60">
                  Model: {getLastAiDiagnostics().model} • Finish: {getLastAiDiagnostics().finishReason || 'unknown'} •{' '}
                  {getLastAiDiagnostics().rawText ? `${getLastAiDiagnostics().rawText!.slice(0, 120)}…` : 'no raw text'}
                </p>
              )}
              <div className="flex gap-2 pt-1">
                <Button variant="secondary" size="sm" onClick={handleGenerateFallback}>
                  Generate Offline Mock Instead
                </Button>
                {onNavigateToStudio && (
                  <Button variant="ghost" size="sm" onClick={onNavigateToStudio}>
                    Open AI Studio to set key
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

{/* Simulation Header */}
       <Card flush className="p-4 flex flex-wrap items-center justify-between gap-4">
         <div>
           <div className="flex items-center gap-2">
             <span className="text-[10px] font-bold uppercase tracking-wider text-muted-faint">
               Official Examination Interface
             </span>
             <span className="text-muted-faint">•</span>
             <span className="text-[10px] font-semibold text-primary">
               {allQuestions.length} Questions • {activeTest.totalMarks} Marks
             </span>
           </div>
           <h2 className="font-display font-semibold text-sm sm:text-base text-ink truncate">
             {activeTest.title}
           </h2>
         </div>

         {/* Blueprint & Adaptive Controls */}
         <div className="flex items-center gap-2 flex-wrap">
           <Button
             variant="outline"
             size="sm"
             onClick={handleGenerateBlueprint}
             icon={<ChartBar className="w-3.5 h-3.5" />}
           >
             View Blueprint
           </Button>
           <Button
             variant="secondary"
             size="sm"
             onClick={handleCalculateMastery}
             icon={<Target className="w-3.5 h-3.5" />}
           >
             Mastery
           </Button>
           <Button
             variant="primary"
             size="sm"
             onClick={handleGenerateAdaptiveMock}
             disabled={adaptiveGenerating}
             loading={adaptiveGenerating}
             icon={!adaptiveGenerating ? <Brain className="w-3.5 h-3.5" /> : undefined}
           >
             {adaptiveGenerating ? 'Generating...' : 'Adaptive Mock'}
           </Button>
            <Button variant="danger" size="sm" onClick={() => setShowConfirmCancel(true)}>
              Cancel Exam
            </Button>
            <Button variant="success" size="sm" onClick={() => setShowConfirmModal(true)}>
              Submit Exam
            </Button>
         </div>
       </Card>

       {/* Blueprint Summary Modal */}
       {showBlueprint && blueprint && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
           role="presentation"
           onMouseDown={(e) => { if (e.target === e.currentTarget) setShowBlueprint(false); }}
         >
           <Card flush className="shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-6 space-y-4">
             <div className="flex items-center justify-between">
               <h3 className="font-display font-bold text-lg text-ink">Exam Blueprint</h3>
               <button onClick={() => setShowBlueprint(false)} className="text-muted hover:text-ink">
                 <X className="w-5 h-5" />
               </button>
             </div>

             <div className="grid grid-cols-2 gap-3">
               <div className="p-3 rounded-xl bg-subtle border border-line">
                 <div className="text-[10px] uppercase font-bold text-muted-faint">Exam</div>
                 <div className="font-display font-bold text-sm text-ink mt-1">{blueprint.exam}</div>
               </div>
               <div className="p-3 rounded-xl bg-subtle border border-line">
                 <div className="text-[10px] uppercase font-bold text-muted-faint">Paper</div>
                 <div className="font-display font-bold text-sm text-ink mt-1">{blueprint.paper}</div>
               </div>
               <div className="p-3 rounded-xl bg-subtle border border-line">
                 <div className="text-[10px] uppercase font-bold text-muted-faint">Questions</div>
                 <div className="font-display font-bold text-sm text-ink mt-1">{blueprint.questionCount}</div>
               </div>
               <div className="p-3 rounded-xl bg-subtle border border-line">
                 <div className="text-[10px] uppercase font-bold text-muted-faint">Duration</div>
                 <div className="font-display font-bold text-sm text-ink mt-1">{blueprint.durationMinutes} min</div>
               </div>
             </div>

             {/* Difficulty Distribution */}
             <div>
               <h4 className="text-xs font-bold text-ink mb-2 flex items-center gap-1.5">
                 <Layers className="w-3.5 h-3.5" /> Difficulty Distribution
               </h4>
               <div className="space-y-1.5">
                 {[
                   { label: 'Easy', count: blueprint.difficultyDistribution.easy, color: 'bg-success' },
                   { label: 'Medium', count: blueprint.difficultyDistribution.medium, color: 'bg-info' },
                   { label: 'Hard', count: blueprint.difficultyDistribution.hard, color: 'bg-danger' }
                 ].map((d) => (
                   <div key={d.label} className="flex items-center gap-2">
                     <span className="text-xs text-ink-soft w-16">{d.label}</span>
                     <div className="flex-1 h-2 rounded-full bg-line overflow-hidden">
                       <div className={`h-full rounded-full ${d.color}`} style={{ width: `${blueprint.questionCount > 0 ? (d.count / blueprint.questionCount) * 100 : 0}%` }} />
                     </div>
                     <span className="text-xs font-bold text-ink w-8 text-right">{d.count}</span>
                   </div>
                 ))}
               </div>
             </div>

             {/* Subject Distribution */}
             <div>
               <h4 className="text-xs font-bold text-ink mb-2 flex items-center gap-1.5">
                 <BookOpen className="w-3.5 h-3.5" /> Subject Distribution
               </h4>
               <div className="space-y-1">
                 {Object.entries(blueprint.subjectDistribution).map(([subject, count]) => (
                   <div key={subject} className="flex items-center justify-between text-xs">
                     <span className="text-ink-soft truncate">{subject}</span>
                     <span className="font-bold text-ink">{count} Qs</span>
                   </div>
                 ))}
               </div>
             </div>

             {/* Negative Marking */}
             <div className="p-3 rounded-xl bg-subtle border border-line flex items-center justify-between">
               <div>
                 <div className="text-xs font-semibold text-ink">Negative Marking</div>
                 <div className="text-[10px] text-muted">{blueprint.negativeMarking ? `${blueprint.negativeMarksPerIncorrect} per incorrect` : 'None'}</div>
               </div>
               <Badge tone={blueprint.negativeMarking ? 'warning' : 'success'}>
                 {blueprint.negativeMarking ? 'Active' : 'Disabled'}
               </Badge>
             </div>

             <div className="flex items-center justify-between pt-2">
               <Badge tone="brand">{blueprint.label}</Badge>
               <Button variant="ghost" size="sm" onClick={() => setShowBlueprint(false)}>Close</Button>
             </div>
           </Card>
         </div>
       )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left 3 cols: Question Viewport */}
        <div className="lg:col-span-3 space-y-4">
          <Card flush className="p-6 sm:p-8 space-y-6">
            {/* Section & Question Badge */}
            <div className="flex items-center justify-between border-b border-line pb-3 text-xs">
              <span className="font-semibold text-ink-soft">{currentItem.sectionName}</span>
              <span className="text-muted-faint font-mono">
                Question {safeIndex + 1} of {allQuestions.length}
              </span>
            </div>

            {/* Stem */}
            <QuestionStemFormatter stem={currentQ.stem} />

            {currentQ.formulaContext && (
              <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 text-xs font-mono text-indigo-800 dark:text-indigo-200 flex items-center gap-2">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 flex-shrink-0">Formula:</span>
                <span>{currentQ.formulaContext}</span>
                {currentQ.answerUnit && (
                  <span className="ml-auto px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900 rounded text-indigo-700 dark:text-indigo-300 font-bold text-[11px]">{currentQ.answerUnit}</span>
                )}
              </div>
            )}

            {/* Options with Instant Feedback */}
            <div className="space-y-2.5 pt-1">
              {currentQ.options.map((opt) => {
                const isSelected = currentAnswer === opt.id;
                const hasAnswered = Boolean(currentAnswer);
                const isCorrect = opt.id === currentQ.correctOption;

                let optStyle = 'border-line hover:border-line-strong text-ink bg-card';
                let badgeStyle = 'bg-subtle-strong text-ink-soft';

                if (hasAnswered) {
                  if (isCorrect) {
                    optStyle = 'border-success-border bg-success-surface text-success-text font-bold shadow-2xs ring-2 ring-success-border/40';
                    badgeStyle = 'bg-success text-white';
                  } else if (isSelected && !isCorrect) {
                    optStyle = 'border-danger-border bg-danger-surface text-danger-text font-semibold shadow-2xs';
                    badgeStyle = 'bg-danger text-white';
                  } else {
                    optStyle = 'border-line/60 bg-card/60 text-muted opacity-70';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id as any)}
                    className={`w-full text-left p-3.5 rounded-xl border-2 transition flex items-center gap-3 ${optStyle}`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg text-xs font-bold font-mono flex items-center justify-center flex-shrink-0 ${badgeStyle}`}
                    >
                      {opt.id}
                    </span>
                    <span className="text-xs sm:text-sm flex-1">{opt.text}</span>
                    {hasAnswered && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-success-text flex-shrink-0" />
                    )}
                    {hasAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-danger-text flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Instant Answer & Detailed Explanation */}
            {Boolean(currentAnswer) && (
              <div className="p-4 rounded-2xl bg-subtle border border-line space-y-2 animate-fadeIn shadow-xs">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    {currentAnswer === currentQ.correctOption ? (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-success-surface text-success-text border border-success-border font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4" /> Correct Answer (+{marksPerQ})
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-danger-surface text-danger-text border border-danger-border font-bold text-xs">
                        <XCircle className="w-4 h-4" /> Incorrect (-{(marksPerQ * activeTest.negativeMarksPerIncorrect).toFixed(2)}) · Correct Option: {currentQ.correctOption}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-muted">
                    {currentQ.topic}
                  </span>
                </div>
                <div className="pt-2 border-t border-line text-xs sm:text-sm text-ink-soft leading-relaxed space-y-3">
                  <div className="font-bold text-ink mb-1 flex items-center gap-1.5 text-xs uppercase tracking-wider text-primary">
                    <span>Official Solution &amp; Explanation:</span>
                  </div>

                  {/* Formula context for numerical questions */}
                  {currentQ.formulaContext && (
                    <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 text-xs font-mono text-indigo-800 dark:text-indigo-200">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 mr-1">Formula:</span>
                      {currentQ.formulaContext}
                      {currentQ.answerUnit && (
                        <span className="ml-2 px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-900 rounded text-indigo-700 dark:text-indigo-300 font-bold">{currentQ.answerUnit}</span>
                      )}
                    </div>
                  )}

                  {/* Step-by-step solution for numerical problems */}
                  {currentQ.solutionSteps && currentQ.solutionSteps.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-faint">Step-by-Step Solution:</div>
                      {currentQ.solutionSteps.map((step, si) => (
                        <div key={si} className="flex items-start gap-2.5 p-2 rounded-lg bg-subtle border border-line">
                          <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{si + 1}</span>
                          <span className="text-xs text-ink leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="whitespace-pre-line text-ink">
                    {currentQ.explanation || 'Official answer verified per syllabus key.'}
                  </p>
                </div>
              </div>
            )}

            {/* Bottom Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-line">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearResponse}
                  disabled={!currentAnswer}
                  className="px-3 py-1.5 rounded-lg border border-line text-xs text-ink-soft hover:bg-subtle disabled:opacity-40"
                >
                  Clear Response
                </button>
                <button
                  onClick={handleToggleReview}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition ${
                    isMarked
                      ? 'bg-warning-surface text-warning-text border-warning-border'
                      : 'border-line text-ink-soft hover:bg-subtle'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{isMarked ? 'Marked for Review' : 'Mark for Review'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentIndex(Math.max(0, safeIndex - 1))}
                  disabled={safeIndex === 0}
                  className="px-4 py-2 rounded-xl border border-line text-xs font-semibold text-ink-soft disabled:opacity-40 hover:bg-subtle flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                <button
                  onClick={() => setCurrentIndex(Math.min(allQuestions.length - 1, safeIndex + 1))}
                  disabled={safeIndex === allQuestions.length - 1}
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold shadow-md shadow-primary/20 flex items-center gap-1"
                >
                  <span>Save & Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right 1 col: 100-Question Matrix Palette */}
        <div className="space-y-4">
          <Card flush className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-semibold text-xs text-ink uppercase tracking-wider">
                Question Palette (1–{allQuestions.length})
              </h4>
              <span className="text-[11px] font-bold text-primary">
                {Object.keys(selectedAnswers).length} / {allQuestions.length}
              </span>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] text-muted border-b border-line pb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-success"></span>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-warning"></span>
                <span>Review</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-line"></span>
                <span>Unvisited</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded border-2 border-primary"></span>
                <span>Current</span>
              </div>
            </div>

            {/* 100-Question Matrix Grid */}
            <div className="max-h-72 overflow-y-auto pr-1">
              <div className="grid grid-cols-5 gap-1.5">
                {allQuestions.map(({ question }, idx) => {
                  const ans = selectedAnswers[question.id];
                  const rev = markedForReview[question.id];
                  const isCur = idx === safeIndex;

                  let color = 'bg-subtle-strong text-ink-soft hover:bg-line';
                  if (ans) color = 'bg-success text-white font-semibold';
                  if (rev) color = 'bg-warning text-white font-semibold';

                  return (
                    <button
                      key={question.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-8 rounded text-[11px] font-mono font-bold transition flex items-center justify-center ${color} ${
                        isCur ? 'ring-2 ring-primary ring-offset-2' : ''
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-line">
              <Button
                variant="primary"
                fullWidth
                onClick={() => setShowConfirmModal(true)}
                className="bg-inverse hover:bg-inverse-hover"
              >
                Finish & Submit {allQuestions.length} Qs
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowConfirmModal(false);
          }}
        >
          <Card
            flush
            ref={confirmTrapRef as any}
            role="dialog"
            aria-modal="true"
            aria-label="Confirm submission"
            className="shadow-2xl w-full max-w-sm p-6 space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-primary-fixed text-primary flex items-center justify-center mx-auto">
              <FileCheck className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-display font-bold text-ink text-base">Submit Mock Test?</h3>
              <p className="text-xs text-muted">
                You have answered <strong className="text-ink font-semibold">{Object.keys(selectedAnswers).length}</strong> of <strong className="text-ink font-semibold">{allQuestions.length}</strong> questions. Time left: {formatTime(timeLeft)}.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Button variant="secondary" fullWidth onClick={() => setShowConfirmModal(false)}>
                Continue Exam
              </Button>
              <Button variant="primary" fullWidth onClick={handleSubmitTest} className="shadow-md shadow-primary/20">
                Confirm Submit
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showConfirmCancel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowConfirmCancel(false);
          }}
        >
          <Card
            flush
            role="dialog"
            aria-modal="true"
            aria-label="Confirm cancellation"
            className="shadow-2xl w-full max-w-sm p-6 space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-danger-surface text-danger-text flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-display font-bold text-ink text-base">Cancel Mock Test?</h3>
              <p className="text-xs text-muted">
                Are you sure you want to cancel this mock test? Your progress will be reset and you will be able to start over.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Button variant="secondary" fullWidth onClick={() => setShowConfirmCancel(false)}>
                Continue Exam
              </Button>
              <Button variant="danger" fullWidth onClick={handleCancelTest}>
                Yes, Cancel Exam
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
