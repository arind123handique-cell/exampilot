import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Lock,
  Mail,
  User as UserIcon,
  LogOut,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Flag,
  Eye,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Trophy,
  AlertTriangle,
  Flame,
  ChevronRight,
  BookOpen,
  Layers,
  Sparkles,
  FileCheck,
  Check,
  Award,
  BarChart2,
  X,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { StatTile } from '../components/ui/StatTile';
import { EmptyState } from '../components/ui/EmptyState';
import { useFocusTrap } from '../hooks/useFocusTrap';
import {
  MOCK_TESTS,
  MOCK_TEST_DWR_2026,
  MOCK_TEST_CIVIL_100,
  MOCK_TEST_GS_100,
  MOCK_TEST_IES_CIVIL
} from '../data/mockData';
import { getAllCombinedMockTests, getAdminPublishedMockTests } from '../services/adminPaperService';
import { submitMockTest } from '../services/firestore';
import { isFirebaseConfigured } from '../firebase/config';
import { MockTest, MCQQuestion, TestSubmission } from '../types';
import { StudentProfileDossier } from '../components/admin/StudentProfileDossier';
import { StudentProfileSummary } from '../services/studentTelemetryService';
import { QuestionStemFormatter } from '../components/ui/QuestionStemFormatter';
import { CartoonMascot, MascotCharacter } from '../components/student/CartoonMascot';
import { useRealtimeSync } from '../services/questionBankSyncService';
import {
  saveTestDraft,
  getLocalTestDrafts,
  deleteTestDraft,
  type TestDraft
} from '../services/testSessionService';

interface StudentTestRecord {
  id: string;
  mockTitle: string;
  examId: string;
  date: string;
  totalScore: number;
  maxScore: number;
  accuracy: number;
  totalAttempted: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  submission: TestSubmission;
  mock: MockTest;
}

const STUDENT_RECORDS_KEY = 'exampilot_student_records';

function loadStudentRecords(uid: string): StudentTestRecord[] {
  try {
    const raw = localStorage.getItem(`${STUDENT_RECORDS_KEY}_${uid}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStudentRecords(uid: string, records: StudentTestRecord[]): void {
  try {
    localStorage.setItem(`${STUDENT_RECORDS_KEY}_${uid}`, JSON.stringify(records));
  } catch {}
}

export const StudentPortal: React.FC = () => {
  const {
    user,
    firebaseUser,
    loading: authLoading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    logout,
    error: authError,
    clearError
  } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();

  // ── Mascot Character Buddy State ──
  const [mascotChar, setMascotChar] = useState<MascotCharacter>('owl');

  // ── Auth Form State ──
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);

  // ── Student Tabs (Mock Tests vs Review vs Profile vs Analytics) ──
  const [studentTab, setStudentTab] = useState<'tests' | 'review' | 'profile' | 'analytics'>('tests');

  // ── Question palette drawer (the desktop aside is hidden below lg) ──
  const [showPaletteMobile, setShowPaletteMobile] = useState(false);

  // ── Published Mock Tests List with Real-time Cross-tab Sync ──
  const [availableMocks, setAvailableMocks] = useState<MockTest[]>(() => getAllCombinedMockTests(MOCK_TESTS));

  useRealtimeSync(['mocks', 'papers', 'all'], () => {
    setAvailableMocks(getAllCombinedMockTests(MOCK_TESTS));
  });

  useEffect(() => {
    const handleUpdate = () => {
      setAvailableMocks(getAllCombinedMockTests(MOCK_TESTS));
    };
    window.addEventListener('exampilot_papers_updated', handleUpdate);
    return () => window.removeEventListener('exampilot_papers_updated', handleUpdate);
  }, []);

  const handleGoogleSignIn = async () => {
    setIsAuthSubmitting(true);
    try {
      await signInWithGoogle();
      toastSuccess('Signed In with Google!', 'Welcome to ExamPilot Student Portal.');
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
      toastError('Google Sign-In Failed', err.message || 'Please use email credentials or retry.');
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  // ── Active CBT Exam State ──
  const [activeMock, setActiveMock] = useState<MockTest | null>(null);
  const [allQuestions, setAllQuestions] = useState<{ question: MCQQuestion; sectionName: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D' | null>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  // ── Test Review State ──
  const [currentResult, setCurrentResult] = useState<TestSubmission | null>(null);
  const [pastRecords, setPastRecords] = useState<StudentTestRecord[]>([]);
  const [reviewingRecord, setReviewingRecord] = useState<StudentTestRecord | null>(null);

  // ── Resumable in-progress attempt (survives refresh / tab close) ──
  const [resumableDraft, setResumableDraft] = useState<TestDraft | null>(null);
  const draftStartedAtRef = useRef<string>(new Date().toISOString());

  // Load user records and any unfinished draft upon login
  useEffect(() => {
    if (!user?.uid) return;
    setPastRecords(loadStudentRecords(user.uid));
    const drafts = getLocalTestDrafts(user.uid);
    setResumableDraft(drafts.length > 0 ? drafts[0] : null);
  }, [user?.uid]);

  // ── Real analytics, derived only from this student's own submissions ──
  // (No cohort percentile and no estimated mastery: we show only what the
  // answers actually measured.)
  const analytics = useMemo(() => {
    let attempted = 0;
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;
    let totalTimeSeconds = 0;
    const subjectTally: Record<string, { correct: number; attempted: number }> = {};

    pastRecords.forEach((rec) => {
      const sub = rec.submission;
      if (!sub) return;
      attempted += sub.totalAttempted || 0;
      correct += sub.correctCount || 0;
      incorrect += sub.incorrectCount || 0;
      unattempted += sub.unattemptedCount || 0;
      totalTimeSeconds += sub.timeSpentSeconds || 0;

      rec.mock.sections.forEach((sec) => {
        sec.questions.forEach((q) => {
          const ans = sub.answers?.[q.id];
          if (!ans || !ans.selected) return;
          const key = q.subject || 'General';
          const entry = subjectTally[key] ?? { correct: 0, attempted: 0 };
          entry.attempted += 1;
          if (ans.isCorrect) entry.correct += 1;
          subjectTally[key] = entry;
        });
      });
    });

    const subjects = Object.entries(subjectTally)
      .map(([name, v]) => ({
        name,
        attempted: v.attempted,
        accuracy: v.attempted > 0 ? Math.round((v.correct / v.attempted) * 100) : 0
      }))
      .sort((a, b) => b.attempted - a.attempted);

    const trend = [...pastRecords].reverse().map((r) => ({
      id: r.id,
      label: r.date,
      title: r.mockTitle,
      scorePct: r.maxScore > 0 ? Math.round((r.totalScore / r.maxScore) * 100) : 0
    }));

    return {
      attempts: pastRecords.length,
      attempted,
      correct,
      incorrect,
      unattempted,
      totalTimeSeconds,
      overallAccuracy: attempted > 0 ? Math.round((correct / attempted) * 100) : 0,
      subjects,
      trend,
      weakest: subjects
        .filter((s) => s.attempted >= 3)
        .slice()
        .sort((a, b) => a.accuracy - b.accuracy)
        .slice(0, 5)
    };
  }, [pastRecords]);

  // Derived student profile summary for personal dossier inspection
  const myProfileSummary: StudentProfileSummary = useMemo(() => {
    const submissions: TestSubmission[] = pastRecords.map((r) => r.submission).filter(Boolean);
    const testsAttempted = pastRecords.length;
    const totalScoreSum = pastRecords.reduce((acc, r) => acc + (r.totalScore || 0), 0);
    const maxScoreSum = pastRecords.reduce((acc, r) => acc + (r.maxScore || 100), 0);
    const avgAccuracy = testsAttempted > 0
      ? Math.round(pastRecords.reduce((acc, r) => acc + (r.accuracy || 0), 0) / testsAttempted)
      : (user?.stats?.accuracyRate || 82);

    const latestRecord = pastRecords[0];

    return {
      uid: user?.uid || 'std-active-aspirant',
      email: user?.email || `${user?.displayName?.toLowerCase().replace(/\s+/g, '') || 'student'}@exampilot.ai`,
      displayName: user?.displayName || 'Registered Aspirant',
      photoURL: user?.photoURL,
      targetExam: user?.preferences?.examName || 'Assam DWR & APSC AE Civil',
      targetYear: user?.preferences?.targetYear || 2026,
      registeredDate: user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'Active Aspirant',
      lastActiveDate: latestRecord ? latestRecord.date : 'Active Today',
      dailyHoursGoal: user?.preferences?.dailyHoursGoal || 4,
      testsAttempted,
      totalScoreSum,
      maxScoreSum,
      averageAccuracy: avgAccuracy,
      latestScore: latestRecord ? latestRecord.totalScore : 0,
      latestMaxScore: latestRecord ? latestRecord.maxScore : 100,
      latestExamTitle: latestRecord ? latestRecord.mockTitle : 'No exams submitted yet',
      latestDate: latestRecord ? latestRecord.date : 'Pending',
      // Honest: readiness is the measured accuracy, not an invented uplift.
      readinessScore: avgAccuracy,
      // Real per-subject accuracy from answered questions (empty until there is data).
      subjectMastery: analytics.subjects.reduce<Record<string, number>>((acc, s) => {
        acc[s.name] = s.accuracy;
        return acc;
      }, {}),
      submissions
    };
  }, [user, pastRecords, analytics]);

  // Keep a ref to the latest handleSubmitExam so the timer interval never
  // captures a stale closure. The ref is updated before the timer fires.
  const handleSubmitExamRef = useRef<(() => Promise<void>) | null>(null);

  // ── Per-question time telemetry ──
  // Every submission previously logged a flat `timeSeconds: 60`, so any pacing
  // insight was fiction. Time is now accrued against the question actually open.
  const questionStartRef = useRef<number>(Date.now());
  const timeSpentRef = useRef<Record<string, number>>({});

  // ── Modal accessibility (focus trap + dialog semantics) ──
  const submitModalRef = useFocusTrap(showConfirmSubmit);
  const cancelModalRef = useFocusTrap(showConfirmCancel);

  // ── Timer Countdown for Active CBT Exam ──
  useEffect(() => {
    if (!activeMock || currentResult) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Call via ref to always use the latest function with latest state
          handleSubmitExamRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeMock, currentResult]);

  // ── Accrue time against each question as the student moves through the paper ──
  useEffect(() => {
    if (!activeMock || currentResult) return;
    const id = allQuestions[currentIndex]?.question.id;
    const startedAt = Date.now();
    questionStartRef.current = startedAt;
    return () => {
      if (!id) return;
      const elapsed = Math.max(0, Math.round((Date.now() - startedAt) / 1000));
      if (elapsed > 0) timeSpentRef.current[id] = (timeSpentRef.current[id] ?? 0) + elapsed;
    };
  }, [currentIndex, activeMock, currentResult, allQuestions]);

  // ── Autosave the in-progress exam so a refresh never destroys an attempt ──
  useEffect(() => {
    if (!activeMock || allQuestions.length === 0 || currentResult || !user?.uid) return;

    const handle = setTimeout(() => {
      const answeredOnly: Record<string, 'A' | 'B' | 'C' | 'D'> = {};
      Object.entries(selectedAnswers).forEach(([id, val]) => {
        if (val) answeredOnly[id] = val;
      });

      saveTestDraft({
        id: activeMock.id,
        userId: user.uid,
        testTitle: activeMock.title,
        topics: activeMock.sections.map((s) => s.name),
        questions: allQuestions.map((a) => a.question),
        userAnswers: answeredOnly,
        flaggedQuestions: Object.keys(flagged).filter((id) => flagged[id]),
        timeRemainingSeconds: timeLeft,
        currentQuestionIndex: currentIndex,
        createdAt: draftStartedAtRef.current,
        lastSavedAt: new Date().toISOString()
      }).catch((err: unknown) => {
        console.warn('[StudentPortal] Draft autosave failed:', err);
      });
    }, 1500);

    return () => clearTimeout(handle);
  }, [activeMock, allQuestions, selectedAnswers, flagged, currentIndex, timeLeft, currentResult, user?.uid]);

  // ── Warn before leaving the page mid-exam ──
  useEffect(() => {
    if (!activeMock || currentResult) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [activeMock, currentResult]);

  // ── Start Exam Handler with Unique Randomization Per Student Attempt ──
  const handleStartMock = (mock: MockTest) => {
    const flat: { question: MCQQuestion; sectionName: string }[] = [];

    mock.sections.forEach((sec) => {
      sec.questions.forEach((q) => {
        // Deep clone question to avoid mutating shared bank
        const qCopy: MCQQuestion = JSON.parse(JSON.stringify(q));

        // Find the text of the original correct option
        const originalCorrectOpt = qCopy.options.find((o) => o.id === qCopy.correctOption);
        const correctText = originalCorrectOpt ? originalCorrectOpt.text : '';

        // Shuffle options uniquely for this attempt
        const shuffledOptions = [...qCopy.options];
        for (let i = shuffledOptions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
        }

        const letters: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
        let newCorrectLetter: 'A' | 'B' | 'C' | 'D' = 'A';

        const remappedOptions = shuffledOptions.map((opt, idx) => {
          const assignedId = letters[idx];
          if (opt.text === correctText) {
            newCorrectLetter = assignedId;
          }
          return {
            ...opt,
            id: assignedId
          };
        });

        qCopy.options = remappedOptions;
        qCopy.correctOption = newCorrectLetter;

        flat.push({ question: qCopy, sectionName: sec.name });
      });
    });

    // Shuffle the question sequence so every student's exam is unique
    for (let i = flat.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [flat[i], flat[j]] = [flat[j], flat[i]];
    }

    // Renumber sequentially
    flat.forEach((item, index) => {
      item.question.questionNumber = index + 1;
    });

    setActiveMock(mock);
    setAllQuestions(flat);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setFlagged({});
    setTimeLeft(mock.durationMinutes * 60);
    setCurrentResult(null);
    setReviewingRecord(null);
    setStudentTab('tests');
    setShowPaletteMobile(false);
    timeSpentRef.current = {};
    questionStartRef.current = Date.now();
    draftStartedAtRef.current = new Date().toISOString();
    void deleteTestDraft(mock.id, user?.uid);
    setResumableDraft(null);
    toastSuccess(
      `Exam Started: ${mock.title}`,
      `🎲 Unique Randomized Sequence · ${flat.length} Questions · ${mock.durationMinutes} Minutes`
    );
  };

  // ── Resume a previously autosaved attempt ──
  const handleResumeDraft = () => {
    const draft = resumableDraft;
    if (!draft) return;

    const mock = availableMocks.find((m) => m.id === draft.id);
    if (!mock) {
      toastError('Cannot Resume Attempt', 'The original mock test is no longer available.');
      void deleteTestDraft(draft.id, user?.uid);
      setResumableDraft(null);
      return;
    }

    const flat = draft.questions.map((q) => {
      const sec = mock.sections.find((s) => s.questions.some((x) => x.id === q.id));
      return { question: q, sectionName: sec?.name ?? 'General' };
    });

    setActiveMock(mock);
    setAllQuestions(flat);
    setSelectedAnswers(draft.userAnswers || {});
    setFlagged(Object.fromEntries((draft.flaggedQuestions || []).map((id) => [id, true])));
    setCurrentIndex(Math.min(draft.currentQuestionIndex || 0, Math.max(0, flat.length - 1)));
    setTimeLeft(draft.timeRemainingSeconds || mock.durationMinutes * 60);
    setCurrentResult(null);
    setReviewingRecord(null);
    setStudentTab('tests');
    setShowPaletteMobile(false);
    timeSpentRef.current = {};
    questionStartRef.current = Date.now();
    draftStartedAtRef.current = draft.createdAt || new Date().toISOString();
    toastSuccess(
      'Exam Resumed',
      `Restored ${flat.length} questions with ${Math.max(0, Math.round((draft.timeRemainingSeconds || 0) / 60))} minutes remaining.`
    );
  };

  // ── Submit Exam Handler ──
  const handleSubmitExam = async () => {
    if (!activeMock || allQuestions.length === 0) return;
    setShowConfirmSubmit(false);

    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    const marksPerQ = activeMock.totalMarks / allQuestions.length;
    const penaltyPerQ = activeMock.negativeMarksPerIncorrect;

    // Flush the question currently on screen before tallying its time.
    const onScreenId = allQuestions[currentIndex]?.question.id;
    if (onScreenId) {
      const elapsed = Math.max(0, Math.round((Date.now() - questionStartRef.current) / 1000));
      if (elapsed > 0) timeSpentRef.current[onScreenId] = (timeSpentRef.current[onScreenId] ?? 0) + elapsed;
      questionStartRef.current = Date.now();
    }

    const answerAudit: Record<string, { selected: 'A' | 'B' | 'C' | 'D' | null; isCorrect: boolean; timeSeconds: number; flagged?: boolean }> = {};

    allQuestions.forEach(({ question: q }) => {
      const chosen = selectedAnswers[q.id] || null;
      const isCorrect = chosen === q.correctOption;
      if (!chosen) {
        unattemptedCount++;
      } else if (isCorrect) {
        correctCount++;
      } else {
        incorrectCount++;
      }
      answerAudit[q.id] = {
        selected: chosen,
        isCorrect,
        timeSeconds: timeSpentRef.current[q.id] ?? 0,
        flagged: Boolean(flagged[q.id])
      };
    });

    const rawScore = correctCount * marksPerQ - incorrectCount * penaltyPerQ;
    const finalScore = Math.max(0, Math.round(rawScore * 100) / 100);
    const attemptedCount = correctCount + incorrectCount;
    const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;
    const timeSpent = activeMock.durationMinutes * 60 - timeLeft;

    const submission: TestSubmission = {
      id: `sub-${Date.now()}`,
      testId: activeMock.id,
      userId: user?.uid || 'guest',
      submittedAt: new Date().toISOString(),
      timeSpentSeconds: timeSpent,
      totalScore: finalScore,
      maxScore: activeMock.totalMarks,
      accuracy,
      // A cohort percentile cannot be computed without other candidates' scores.
      // The previous value was a formula dressed up as a rank; 0 keeps the field
      // literal and the UI no longer renders it.
      percentile: 0,
      totalAttempted: attemptedCount,
      correctCount,
      incorrectCount,
      unattemptedCount,
      answers: answerAudit
    };

    // Persist the submission, but never let it gate the result screen.
    // Racing a short timeout guarantees the scorecard still appears even if a
    // backend call hangs (this is what previously froze submit indefinitely).
    try {
      await Promise.race([
        submitMockTest(submission),
        new Promise((resolve) => setTimeout(resolve, 3000))
      ]);
    } catch (err) {
      console.warn('[StudentPortal] submission persist notice:', err);
    }

    // Save to Local Student Records
    const record: StudentTestRecord = {
      id: submission.id,
      mockTitle: activeMock.title,
      examId: activeMock.examId,
      date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      totalScore: finalScore,
      maxScore: activeMock.totalMarks,
      accuracy,
      totalAttempted: attemptedCount,
      totalQuestions: allQuestions.length,
      timeSpentSeconds: timeSpent,
      submission,
      mock: activeMock
    };

    if (user?.uid) {
      const updatedRecords = [record, ...pastRecords];
      setPastRecords(updatedRecords);
      saveStudentRecords(user.uid, updatedRecords);
    }

    void deleteTestDraft(activeMock.id, user?.uid);
    setResumableDraft(null);
    setShowPaletteMobile(false);
    setCurrentResult(submission);
    setStudentTab('review');

    // Celebration Confetti
    try {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } catch {}

    toastSuccess('Mock Test Submitted!', `Score: ${finalScore} / ${activeMock.totalMarks} (${accuracy}% Accuracy)`);
  };

  // ── Cancel Exam Handler ──
  const handleCancelExam = () => {
    const cancelledMockId = activeMock?.id;
    setActiveMock(null);
    setAllQuestions([]);
    setSelectedAnswers({});
    setFlagged({});
    setTimeLeft(0);
    setShowConfirmCancel(false);
    setShowConfirmSubmit(false);
    setStudentTab('tests');
    setShowPaletteMobile(false);
    if (cancelledMockId) void deleteTestDraft(cancelledMockId, user?.uid);
    setResumableDraft(null);
    toastSuccess('Test Cancelled', 'You have exited the mock examination session.');
  };

  // Update ref every render so the interval timer always calls the latest handleSubmitExam
  // (this avoids the stale closure issue where expired timers see stale selectedAnswers)
  handleSubmitExamRef.current = handleSubmitExam;

  // ── Authentication Submit Handler ──
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsAuthSubmitting(true);
    try {
      if (authMode === 'signin') {
        await signInWithEmail(email, password);
        toastSuccess('Welcome Back!', 'Logged into your Student Account.');
      } else {
        await signUpWithEmail(email, password, name);
        toastSuccess('Account Created!', 'Welcome to ExamPilot Student Portal.');
      }
    } catch (err: any) {
      toastError('Authentication Failed', err.message || 'Check your credentials.');
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. UN-AUTHENTICATED: STUDENT CREDENTIAL LOGIN SCREEN
  // Show login if: no signed-in user
  // ─────────────────────────────────────────────────────────────────────────────
  const isAuthenticated = Boolean(user);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-indigo-50/50 via-canvas to-amber-50/30 dark:from-indigo-950/20 dark:via-canvas dark:to-slate-900/50 text-ink">
        <div className="w-full max-w-md space-y-4">
          {/* Animated Mascot Welcome Banner */}
          <div className="flex justify-center">
            <CartoonMascot
              character={mascotChar}
              state="welcoming"
              size="md"
              onCharacterChange={(c) => setMascotChar(c)}
            />
          </div>

          {/* Brand header */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-indigo-500 text-lg font-extrabold text-white shadow-md shadow-primary/30 mb-1">
              EP
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              Student Examination Portal
            </h1>
            <p className="text-xs text-muted">
              Choose your mascot buddy, sign in with Google or credentials to take your unique mock test!
            </p>
          </div>

          <Card flush className="p-6 sm:p-7 space-y-4 shadow-xl border-line-strong rounded-3xl bg-card/95 backdrop-blur">
{/* Self-diagnosing deployment notice — a silent failure here previously
                 looked like "Google login is broken". */}
            {!isFirebaseConfigured && (
              <div className="flex items-start gap-2 rounded-xl border border-danger-border bg-danger-surface p-3 text-xs text-danger-text">
                <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="font-semibold">Sign-in unavailable</p>
                  <p>
                    Firebase is not configured for this deployment, so account
                    sign-in cannot complete. Set the VITE_FIREBASE_* environment
                    variables and redeploy.
                  </p>
                </div>
              </div>
            )}

            {/* Google Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isAuthSubmitting}
              className="w-full h-11 px-4 rounded-2xl border border-line bg-surface hover:bg-subtle transition font-semibold text-xs text-ink flex items-center justify-center gap-3 shadow-xs active:scale-[0.99]"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex py-0.5 items-center">
              <div className="flex-grow border-t border-line"></div>
              <span className="flex-shrink mx-3 text-[10px] text-muted-faint uppercase font-bold tracking-wider">
                Or with student credentials
              </span>
              <div className="flex-grow border-t border-line"></div>
            </div>

            {/* Mode Switcher */}
            <div className="flex rounded-xl bg-subtle p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setAuthMode('signin'); clearError(); }}
                className={`flex-1 py-1.5 rounded-lg transition ${authMode === 'signin' ? 'bg-card text-ink shadow-2xs' : 'text-muted hover:text-ink'}`}
              >
                Student Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); clearError(); }}
                className={`flex-1 py-1.5 rounded-lg transition ${authMode === 'signup' ? 'bg-card text-ink shadow-2xs' : 'text-muted hover:text-ink'}`}
              >
                Register Student
              </button>
            </div>

            {/* Error banner */}
            {authError && (
              <div className="p-3 rounded-xl bg-danger-surface border border-danger-border text-xs text-danger-text flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">Student Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-muted absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full h-10 pl-10 pr-3.5 rounded-xl border border-line bg-surface text-xs text-ink placeholder:text-muted-faint focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">Email Address / Student ID</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full h-10 pl-10 pr-3.5 rounded-xl border border-line bg-surface text-xs text-ink placeholder:text-muted-faint focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-10 pl-10 pr-3.5 rounded-xl border border-line bg-surface text-xs text-ink placeholder:text-muted-faint focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isAuthSubmitting}
                className="w-full h-11 bg-primary text-white font-bold shadow-md shadow-primary/25 mt-2"
              >
                {isAuthSubmitting
                  ? 'Verifying Credentials...'
                  : authMode === 'signin'
                  ? 'Sign In to Student Portal'
                  : 'Register Student Account'}
              </Button>
            </form>

            <div className="pt-3 border-t border-line text-center text-xs text-muted">
              Official Examination Platform · Session protected
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Past the auth gate, `user` is guaranteed non-null. Bind it once so the
  // authenticated JSX below is type-safe (TS can't narrow through `isAuthenticated`).
  const currentUser = user!;

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. ACTIVE CBT EXAM SESSION (TIMED TEST IN PROGRESS)
  // ─────────────────────────────────────────────────────────────────────────────
  if (activeMock && allQuestions.length > 0 && !currentResult) {
    const currentQ = allQuestions[currentIndex]?.question;
    const currentSecName = allQuestions[currentIndex]?.sectionName;

    // Shared by the desktop sidebar and the mobile drawer, so the two can never drift.
    const paletteContent = (
      <>
        <div className="grid grid-cols-5 gap-1.5">
          {allQuestions.map(({ question: q }, idx) => {
            const isAnswered = Boolean(selectedAnswers[q.id]);
            const isFlagged = Boolean(flagged[q.id]);
            const isCurrent = idx === currentIndex;

            // Exam mode: the palette must not leak correctness either.
            let colorClass = 'bg-subtle text-muted hover:bg-subtle-strong border-line';
            if (isCurrent) {
              colorClass = 'border-primary ring-2 ring-primary/40 text-primary font-bold bg-primary-fixed/30';
            } else if (isFlagged) {
              colorClass = 'bg-amber-500/15 border-amber-500/30 text-amber-600 font-bold';
            } else if (isAnswered) {
              colorClass = 'bg-primary-fixed border-primary-fixed-dim text-primary font-bold';
            }

            return (
              <button
                key={q.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  setShowPaletteMobile(false);
                }}
                aria-current={isCurrent ? 'true' : undefined}
                aria-label={`Go to question ${idx + 1}${isFlagged ? ', flagged for review' : ''}${isAnswered ? ', answered' : ', not answered'}`}
                className={`h-9 rounded-lg border text-xs font-mono transition flex items-center justify-center ${colorClass}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <div className="pt-4 border-t border-line text-[11px] space-y-1.5 text-muted">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-primary-fixed border border-primary-fixed-dim" />
            <span>Answered ({Object.values(selectedAnswers).filter(Boolean).length})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-amber-500/15 border border-amber-500/30" />
            <span>Flagged for Review ({Object.values(flagged).filter(Boolean).length})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-subtle border border-line" />
            <span>Unattempted ({allQuestions.length - Object.values(selectedAnswers).filter(Boolean).length})</span>
          </div>
        </div>
      </>
    );
    const formatTime = (secs: number) => {
      const h = Math.floor(secs / 3600);
      const m = Math.floor((secs % 3600) / 60);
      const s = secs % 60;
      if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    return (
      <div className="h-screen w-screen flex flex-col bg-canvas text-ink overflow-hidden">
        {/* CBT Top Bar */}
        <header className="h-14 border-b border-line bg-card flex items-center justify-between px-4 sm:px-6 flex-shrink-0 z-20">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-sm text-ink truncate max-w-xs sm:max-w-md">
              {activeMock.title}
            </span>
            <span className="hidden sm:inline px-2 py-0.5 rounded bg-subtle text-muted text-[11px] font-medium">
              {allQuestions.length} Questions · {activeMock.totalMarks} Marks
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Question palette — the sidebar is hidden on small screens */}
            <button
              type="button"
              onClick={() => setShowPaletteMobile(true)}
              aria-label="Open question palette"
              className="lg:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-line text-xs text-muted hover:text-ink transition"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Palette</span>
            </button>

            {/* Cancel Test Option */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowConfirmCancel(true)}
              className="border-danger/40 text-danger-text hover:bg-danger-surface transition"
              icon={<X className="w-3.5 h-3.5" />}
            >
              <span className="hidden sm:inline">Cancel Test</span>
              <span className="sm:hidden">Cancel</span>
            </Button>

            {/* Timer */}
            <div
              role="timer"
              aria-live="polite"
              aria-label={`Time remaining ${formatTime(timeLeft)}`}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-mono font-bold ${
                timeLeft < 300 ? 'bg-danger-surface border-danger-border text-danger-text animate-pulse' : 'bg-subtle border-line text-ink'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(timeLeft)}</span>
            </div>

            <Button
              size="sm"
              onClick={() => setShowConfirmSubmit(true)}
              className="bg-primary text-white shadow-sm font-semibold"
            >
              Submit Test
            </Button>
          </div>
        </header>

        {/* Exam Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Question area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="flex items-center justify-between text-xs text-muted pb-2 border-b border-line">
              <span className="font-bold text-primary">
                Question {currentIndex + 1} of {allQuestions.length}
              </span>
              <span>{currentSecName}</span>
              <span className="font-mono text-ink font-semibold">
                +{activeMock.totalMarks / allQuestions.length} / -{activeMock.negativeMarksPerIncorrect}
              </span>
            </div>

            {currentQ && (
              <div className="space-y-6">
                <QuestionStemFormatter stem={currentQ.stem} />

                {/* Options A, B, C, D — exam mode: show selection only, never correctness */}
                <div className="space-y-2.5 max-w-2xl">
                  {currentQ.options.map((opt) => {
                    const isSelected = selectedAnswers[currentQ.id] === opt.id;

                    return (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: opt.id }))}
                        aria-pressed={isSelected}
                        className={`w-full p-4 rounded-xl border-2 text-left text-xs sm:text-sm font-medium transition flex items-center gap-3 ${
                          isSelected
                            ? 'border-primary bg-primary-fixed/30 text-ink font-semibold ring-2 ring-primary/30'
                            : 'border-line hover:border-line-strong bg-card text-ink'
                        }`}
                      >
                        <span className={`w-7 h-7 rounded-lg font-mono font-bold flex items-center justify-center text-xs flex-shrink-0 ${isSelected ? 'bg-primary text-white' : 'bg-subtle text-muted'}`}>
                          {opt.id}
                        </span>
                        <span className="flex-1">{opt.text}</span>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <p className="max-w-2xl text-[11px] text-muted flex items-start gap-1.5" role="note">
                  <Lock className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span>Exam mode — correct answers and solutions are revealed only after you submit, under Mock Test Review.</span>
                </p>

              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-line flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setFlagged((prev) => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }))}
                  icon={<Flag className={`w-3.5 h-3.5 ${flagged[currentQ.id] ? 'fill-warning text-warning' : ''}`} />}
                >
                  {flagged[currentQ.id] ? 'Flagged for Review' : 'Mark for Review'}
                </Button>
                {selectedAnswers[currentQ.id] && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: null }))}
                  >
                    Clear Response
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  icon={<ArrowLeft className="w-3.5 h-3.5" />}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    if (currentIndex < allQuestions.length - 1) {
                      setCurrentIndex((prev) => prev + 1);
                    } else {
                      setShowConfirmSubmit(true);
                    }
                  }}
                  className="bg-primary text-white"
                  iconRight={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  {currentIndex === allQuestions.length - 1 ? 'Review & Submit' : 'Save & Next'}
                </Button>
              </div>
            </div>
          </main>

          {/* Right: Question Palette Sidebar (desktop) */}
          <aside className="w-72 border-l border-line bg-card p-4 overflow-y-auto hidden lg:flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-semibold text-xs text-ink uppercase tracking-wider">
                Question Palette ({allQuestions.length})
              </h3>
              {paletteContent}
            </div>
          </aside>
        </div>

        {/* Mobile question palette drawer */}
        {showPaletteMobile && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Question palette"
            className="fixed inset-0 z-40 lg:hidden"
          >
            <button
              type="button"
              aria-label="Close question palette"
              onClick={() => setShowPaletteMobile(false)}
              className="absolute inset-0 bg-black/60"
            />
            <div className="absolute inset-x-0 bottom-0 max-h-[70vh] space-y-4 overflow-y-auto rounded-t-3xl border-t border-line bg-card p-4 pb-8 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-xs text-ink uppercase tracking-wider">
                  Question Palette ({allQuestions.length})
                </h3>
                <button
                  type="button"
                  onClick={() => setShowPaletteMobile(false)}
                  aria-label="Close question palette"
                  className="rounded-lg p-1.5 text-muted transition hover:bg-subtle hover:text-ink"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {paletteContent}
              <Button size="sm" className="w-full" onClick={() => setShowPaletteMobile(false)}>
                Back to question
              </Button>
            </div>
          </div>
        )}

        {/* Confirm Cancel Modal */}
        {showConfirmCancel && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-test-title"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <Card ref={cancelModalRef} flush className="max-w-md w-full p-6 space-y-5 bg-card border-line shadow-2xl animate-fadeIn">
              <div className="space-y-2 text-center">
                <div className="w-12 h-12 rounded-2xl bg-danger-surface text-danger-text flex items-center justify-center mx-auto shadow-xs">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 id="cancel-test-title" className="font-display font-bold text-lg text-ink">Cancel Mock Test?</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Are you sure you want to cancel this mock test? Your progress will not be submitted, and you will return to the available tests catalog.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowConfirmCancel(false)}
                >
                  Continue Test
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-danger-text hover:bg-danger-text/90 text-white font-semibold"
                  onClick={handleCancelExam}
                >
                  Yes, Cancel Test
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Confirm Submit Modal */}
        {showConfirmSubmit && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="submit-test-title"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <Card ref={submitModalRef} flush className="max-w-md w-full p-6 space-y-5 bg-card">
              <div className="space-y-1 text-center">
                <AlertTriangle className="w-10 h-10 text-warning mx-auto" />
                <h3 id="submit-test-title" className="font-display font-bold text-lg text-ink">Submit Examination?</h3>
                <p className="text-xs text-muted">
                  Are you ready to submit your exam? You cannot change your answers after submission.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-3 rounded-xl bg-subtle border border-line">
                  <div className="font-bold text-base text-success-text">
                    {Object.values(selectedAnswers).filter(Boolean).length}
                  </div>
                  <div className="text-[10px] text-muted">Answered</div>
                </div>
                <div className="p-3 rounded-xl bg-subtle border border-line">
                  <div className="font-bold text-base text-amber-600">
                    {Object.values(flagged).filter(Boolean).length}
                  </div>
                  <div className="text-[10px] text-muted">Flagged</div>
                </div>
                <div className="p-3 rounded-xl bg-subtle border border-line">
                  <div className="font-bold text-base text-muted">
                    {allQuestions.length - Object.values(selectedAnswers).filter(Boolean).length}
                  </div>
                  <div className="text-[10px] text-muted">Unanswered</div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => setShowConfirmSubmit(false)}>
                  Continue Exam
                </Button>
                <Button size="sm" className="flex-1 bg-primary text-white font-bold" onClick={handleSubmitExam}>
                  Confirm &amp; Submit
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. AUTHENTICATED STUDENT PORTAL (MOCK TESTS & REVIEW ONLY)
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen w-screen flex flex-col bg-canvas text-ink overflow-x-hidden">
      {/* ── Top Bar ── */}
      <header className="h-14 border-b border-line bg-card/90 backdrop-blur px-4 sm:px-8 flex items-center justify-between flex-shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white shadow-sm shadow-primary/30">
            EP
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-sm font-bold tracking-tight text-ink">
                ExamPilot
              </span>
              <span className="rounded bg-primary-fixed border border-primary-fixed-dim text-primary px-1.5 py-0.2 text-[10px] font-bold">
                Student Portal
              </span>
            </div>
            <p className="text-[10px] text-muted">{currentUser.email || currentUser.displayName || 'Student'}</p>
          </div>
        </div>

        {/* Center Tabs: Mock Tests vs Mock Test Review ONLY */}
        <div className="flex items-center rounded-xl border border-line bg-surface p-0.5 text-xs font-semibold">
          <button
            onClick={() => { setStudentTab('tests'); setReviewingRecord(null); }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition ${
              studentTab === 'tests' && !reviewingRecord
                ? 'bg-primary text-white shadow-2xs font-bold'
                : 'text-muted hover:text-ink'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Mock Tests</span>
          </button>

          <button
            onClick={() => setStudentTab('review')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition ${
              (studentTab === 'review' || reviewingRecord) && studentTab !== 'profile'
                ? 'bg-primary text-white shadow-2xs font-bold'
                : 'text-muted hover:text-ink'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Mock Test Review</span>
            {pastRecords.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-primary-fixed text-primary text-[10px] font-bold">
                {pastRecords.length}
              </span>
            )}
          </button>

          <button
            onClick={() => { setStudentTab('profile'); setReviewingRecord(null); }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition ${
              studentTab === 'profile' && !reviewingRecord
                ? 'bg-primary text-white shadow-2xs font-bold'
                : 'text-muted hover:text-ink'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>My Profile</span>
          </button>

          <button
            onClick={() => { setStudentTab('analytics'); setReviewingRecord(null); }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition ${
              studentTab === 'analytics' && !reviewingRecord
                ? 'bg-primary text-white shadow-2xs font-bold'
                : 'text-muted hover:text-ink'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </button>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={logout}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-line hover:bg-danger-surface hover:text-danger-text text-xs text-muted transition"
            title="Sign out of student account"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* ── Main Student Content ── */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-6">
        {/* ── TAB 1: AVAILABLE MOCK TESTS ── */}
        {studentTab === 'tests' && !reviewingRecord && (
          <div className="space-y-6 animate-fadeIn">
            <Card flush className="p-6 bg-gradient-to-r from-indigo-500/15 via-pink-500/10 to-amber-500/15 border-indigo-500/25 rounded-3xl shadow-sm">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-indigo-600 text-white font-bold text-xs shadow-xs">
                      ⭐ Student Examination Lounge
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px] border border-emerald-500/30">
                      🎲 Per-Student Randomized Sequence
                    </span>
                  </div>
                  <h2 className="font-display font-bold text-xl sm:text-2xl text-ink">
                    Welcome back, {currentUser.displayName || 'Champion'}! 🚀
                  </h2>
                  <p className="text-xs text-muted leading-relaxed">
                    Select an assigned examination paper below to start your timed CBT test. Each attempt features uniquely shuffled questions and randomized options! Click your mascot companion to switch buddies.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <CartoonMascot
                    character={mascotChar}
                    state="idle"
                    size="md"
                    onCharacterChange={(c) => setMascotChar(c)}
                  />
                </div>
              </div>
            </Card>

            {/* Unfinished attempt — resume instead of losing it */}
            {resumableDraft && (
              <Card flush className="p-5 border-warning/40 bg-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-display font-bold text-sm text-ink">Unfinished attempt found</h3>
                    <p className="text-xs text-muted mt-0.5">
                      {resumableDraft.testTitle} — {resumableDraft.questions.length} questions,{' '}
                      {Math.max(0, Math.round(resumableDraft.timeRemainingSeconds / 60))} minutes remaining.
                      {' '}Last saved {new Date(resumableDraft.lastSavedAt).toLocaleString('en-IN')}.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      void deleteTestDraft(resumableDraft.id, user?.uid);
                      setResumableDraft(null);
                    }}
                  >
                    Discard
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleResumeDraft}
                    iconRight={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Resume Exam
                  </Button>
                </div>
              </Card>
            )}

            {/* Test Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableMocks.map((mock) => {
                const totalQs = mock.sections.reduce((n, s) => n + s.questions.length, 0);
                const is2026 = mock.id.includes('2026') || mock.title.includes('2026');
                return (
                  <Card
                    flush
                    key={mock.id}
                    className={`p-5 flex flex-col justify-between space-y-4 hover:border-primary transition ${
                      is2026 ? 'border-primary/50 bg-primary-fixed/15 shadow-xs' : ''
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        {is2026 ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold text-[10px] uppercase tracking-wider">
                            OFFICIAL 2026 PAPER
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-subtle text-muted font-bold text-[10px] uppercase tracking-wider">
                            CBT MOCK TEST
                          </span>
                        )}
                        <span className="text-xs font-mono font-bold text-primary">
                          {mock.totalMarks} Marks
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-[10px]">
                          🎲 Random Shuffled
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">
                          {mock.sections.length} Sub-heads
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-sm text-ink leading-snug">
                        {mock.title}
                      </h3>
                      <p className="text-xs text-muted line-clamp-2">
                        {mock.paperName}
                      </p>

                      <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-line text-[11px] text-center">
                        <div className="p-1.5 rounded bg-subtle">
                          <div className="font-bold text-ink">{totalQs}</div>
                          <div className="text-[9px] text-muted">Questions</div>
                        </div>
                        <div className="p-1.5 rounded bg-subtle">
                          <div className="font-bold text-ink">{mock.durationMinutes}m</div>
                          <div className="text-[9px] text-muted">Duration</div>
                        </div>
                        <div className="p-1.5 rounded bg-subtle">
                          <div className="font-bold text-danger-text">-{mock.negativeMarksPerIncorrect}</div>
                          <div className="text-[9px] text-muted">Penalty</div>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleStartMock(mock)}
                      className="w-full bg-primary hover:bg-primary-dark text-white font-bold shadow-md shadow-primary/20"
                      iconRight={<Play className="w-3.5 h-3.5" />}
                    >
                      Start CBT Mock Test
                    </Button>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB 2: MOCK TEST REVIEW & RESULTS ── */}
        {(studentTab === 'review' || (reviewingRecord && studentTab !== 'profile')) && (
          <div className="space-y-6 animate-fadeIn">
            {/* If reviewing a specific record or just submitted exam */}
            {reviewingRecord || currentResult ? (
              <div className="space-y-6">
                {/* Back button */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => { setReviewingRecord(null); setCurrentResult(null); }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to All Test Records</span>
                  </button>
                  <span className="text-xs text-muted">
                    {reviewingRecord ? reviewingRecord.mockTitle : activeMock?.title}
                  </span>
                </div>

                {/* Scorecard Banner */}
                {(() => {
                  const sub = reviewingRecord ? reviewingRecord.submission : currentResult!;
                  const targetMock = reviewingRecord ? reviewingRecord.mock : activeMock!;
                  const totalQs = targetMock.sections.reduce((n, s) => n + s.questions.length, 0);

                  return (
                    <>
                      <Card flush className="p-6 text-center space-y-5">
                        <div className="w-14 h-14 rounded-2xl bg-success-surface text-success-text flex items-center justify-center mx-auto shadow-sm">
                          <Trophy className="w-7 h-7" />
                        </div>
                        <div>
                          <Badge tone="success" size="md">
                            Mock Test Performance Scorecard
                          </Badge>
                          <h2 className="font-display font-bold text-2xl text-ink mt-2">
                            {targetMock.title}
                          </h2>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="p-3.5 rounded-xl bg-subtle border border-line">
                            <div className="text-[10px] uppercase font-bold text-muted-faint">Score</div>
                            <div className="font-display font-bold text-2xl text-primary mt-1">
                              {sub.totalScore} / {sub.maxScore}
                            </div>
                            <div className="text-[10px] text-muted">Total Marks</div>
                          </div>
                          <div className="p-3.5 rounded-xl bg-subtle border border-line">
                            <div className="text-[10px] uppercase font-bold text-muted-faint">Accuracy</div>
                            <div className="font-display font-bold text-2xl text-success-text mt-1">
                              {sub.accuracy}%
                            </div>
                            <div className="text-[10px] text-muted">{sub.correctCount} Correct</div>
                          </div>
                          <div className="p-3.5 rounded-xl bg-subtle border border-line">
                            <div className="text-[10px] uppercase font-bold text-muted-faint">Attempted</div>
                            <div className="font-display font-bold text-2xl text-ink mt-1">
                              {sub.totalAttempted} / {totalQs}
                            </div>
                            <div className="text-[10px] text-muted">{sub.incorrectCount} Incorrect</div>
                          </div>
                          <div className="p-3.5 rounded-xl bg-subtle border border-line">
                            <div className="text-[10px] uppercase font-bold text-muted-faint">Time Spent</div>
                            <div className="font-display font-bold text-2xl text-ink mt-1">
                              {Math.round(sub.timeSpentSeconds / 60)}m
                            </div>
                            <div className="text-[10px] text-muted">{sub.unattemptedCount} Unanswered</div>
                          </div>
                        </div>
                      </Card>

                      {/* Question-by-Question Solution Review */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs text-muted">
                          <h3 className="font-display font-bold text-sm text-ink flex items-center gap-2">
                            <Eye className="w-4 h-4 text-primary" />
                            <span>Question-by-Question Solution Review ({totalQs} Questions)</span>
                          </h3>
                        </div>

                        <div className="space-y-3">
                          {targetMock.sections.flatMap((s) => s.questions).map((q, idx) => {
                            const ans = sub.answers[q.id];
                            const chosen = ans?.selected;
                            const isCorrect = ans?.isCorrect;
                            const wasAttempted = Boolean(chosen);

                            return (
                              <Card flush className="p-5 space-y-3" key={q.id}>
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-center gap-2 text-xs">
                                    <span className="px-2 py-0.5 rounded bg-subtle text-ink font-mono font-bold text-[10px]">
                                      Q.{idx + 1}
                                    </span>
                                    <span className="font-semibold text-ink-soft">{q.subject}</span>
                                    <span className="text-muted-faint">•</span>
                                    <span className="text-muted">{q.topic}</span>
                                  </div>

                                  <div>
                                    {wasAttempted ? (
                                      isCorrect ? (
                                        <span className="px-2.5 py-1 rounded-full bg-success-surface text-success-text font-bold text-xs flex items-center gap-1">
                                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+{targetMock.totalMarks / totalQs})
                                        </span>
                                      ) : (
                                        <span className="px-2.5 py-1 rounded-full bg-danger-surface text-danger-text font-bold text-xs flex items-center gap-1">
                                          <XCircle className="w-3.5 h-3.5" /> Incorrect (-{targetMock.negativeMarksPerIncorrect})
                                        </span>
                                      )
                                    ) : (
                                      <span className="px-2.5 py-1 rounded-full bg-subtle text-muted font-semibold text-xs">
                                        Skipped (0.00)
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <QuestionStemFormatter stem={q.stem} />

                                {/* Options with user choice vs official key */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                  {q.options.map((opt) => {
                                    const isThisCorrect = opt.id === q.correctOption;
                                    const isThisChosen = chosen === opt.id;

                                    let optClass = 'bg-card border-line text-ink-soft';
                                    if (isThisCorrect) {
                                      optClass = 'bg-success-surface border-success-border text-success-text font-bold';
                                    } else if (isThisChosen && !isThisCorrect) {
                                      optClass = 'bg-danger-surface border-danger-border text-danger-text line-through font-semibold';
                                    }

                                    return (
                                      <div key={opt.id} className={`p-2.5 rounded-lg border flex items-center gap-2 ${optClass}`}>
                                        <span className="w-5 h-5 rounded font-mono font-bold text-center leading-5 text-[10px] bg-subtle-strong">
                                          {opt.id}
                                        </span>
                                        <span className="flex-1">{opt.text}</span>
                                        {isThisCorrect && <Check className="w-4 h-4 text-success-text flex-shrink-0" />}
                                        {isThisChosen && !isThisCorrect && <XCircle className="w-4 h-4 text-danger-text flex-shrink-0" />}
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Explanation */}
                                <div className="p-3 rounded-xl bg-subtle border border-line text-xs text-ink-soft leading-relaxed pt-2">
                                  <strong>Official Solution:</strong> {q.explanation}
                                </div>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              /* Test History Records List */
              <div className="space-y-4">
                <Card flush className="p-6">
                  <h2 className="font-display font-bold text-xl text-ink">
                    My Mock Test Records &amp; Performance
                  </h2>
                  <p className="text-xs text-muted mt-1">
                    Review all completed mock test attempts, inspect mistake logs, and study detailed official solutions.
                  </p>
                </Card>

                {pastRecords.length === 0 ? (
                  <Card flush className="p-12 text-center space-y-3 border-dashed">
                    <Award className="w-10 h-10 text-muted-faint mx-auto" />
                    <h3 className="font-semibold text-sm text-ink">No Mock Tests Taken Yet</h3>
                    <p className="text-xs text-muted max-w-sm mx-auto">
                      Choose an exam from the "Mock Tests" tab to start your first timed CBT mock exam.
                    </p>
                    <Button
                      size="sm"
                      onClick={() => setStudentTab('tests')}
                      className="bg-primary text-white mt-2"
                    >
                      Browse Available Mock Tests
                    </Button>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {pastRecords.map((rec) => (
                      <Card
                        flush
                        key={rec.id}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-primary transition"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="px-2 py-0.5 rounded bg-primary-fixed text-primary font-bold text-[10px]">
                              {rec.date}
                            </span>
                            <span className="font-semibold text-ink">{rec.mockTitle}</span>
                          </div>
                          <p className="text-xs text-muted">
                            Attempted {rec.totalAttempted} of {rec.totalQuestions} questions · Accuracy: {rec.accuracy}%
                          </p>
                        </div>

                        <div className="flex items-center gap-4 flex-shrink-0">
                          <div className="text-right">
                            <div className="font-display font-bold text-lg text-primary">
                              {rec.totalScore} / {rec.maxScore}
                            </div>
                            <div className="text-[10px] text-muted">Marks</div>
                          </div>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setReviewingRecord(rec)}
                            iconRight={<Eye className="w-3.5 h-3.5" />}
                          >
                            Review Solutions
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: STUDENT PROFILE DOSSIER ── */}
        {studentTab === 'profile' && !reviewingRecord && (
          <StudentProfileDossier
            student={myProfileSummary}
            isSelfProfile={true}
          />
        )}

        {/* ── TAB 4: REAL PERFORMANCE ANALYTICS ── */}
        {studentTab === 'analytics' && !reviewingRecord && (
          <div className="space-y-6 animate-fadeIn">
            <Card flush className="p-6">
              <h2 className="font-display font-bold text-xl text-ink">Performance Analytics</h2>
              <p className="text-xs text-muted mt-1 max-w-3xl">
                Everything here is computed from your own submitted attempts — no estimated rank and no
                guessed mastery. If a number needs a cohort of other candidates, it is not shown.
              </p>
            </Card>

            {analytics.attempts === 0 ? (
              <EmptyState
                icon={<BarChart2 className="w-6 h-6" />}
                title="No attempts to analyse yet"
                description="Submit a mock test and your accuracy, subject breakdown, pacing and score history will appear here."
                actionLabel="Browse Mock Tests"
                onAction={() => setStudentTab('tests')}
              />
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatTile
                    label="Attempts"
                    value={analytics.attempts}
                    hint="Submitted mock tests"
                    icon={<Award className="w-4 h-4" />}
                  />
                  <StatTile
                    label="Accuracy"
                    value={analytics.overallAccuracy}
                    unit="%"
                    tone={analytics.overallAccuracy >= 70 ? 'success' : analytics.overallAccuracy >= 40 ? 'warning' : 'danger'}
                    progress={analytics.overallAccuracy}
                    hint={`${analytics.correct} correct of ${analytics.attempted} attempted`}
                    icon={<CheckCircle2 className="w-4 h-4" />}
                  />
                  <StatTile
                    label="Questions Attempted"
                    value={analytics.attempted}
                    hint={`${analytics.unattempted} left unanswered`}
                    icon={<Layers className="w-4 h-4" />}
                  />
                  <StatTile
                    label="Time On Task"
                    value={Math.round(analytics.totalTimeSeconds / 60)}
                    unit="min"
                    hint="Across all attempts"
                    icon={<Clock className="w-4 h-4" />}
                  />
                </div>

                <Card flush className="p-5 space-y-4">
                  <h3 className="font-display font-bold text-sm text-ink flex items-center gap-2">
                    <Layers className="w-4 h-4 text-primary" />
                    <span>Accuracy by subject</span>
                  </h3>
                  {analytics.subjects.length === 0 ? (
                    <p className="text-xs text-muted">No answered questions yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {analytics.subjects.map((s) => (
                        <div key={s.name} className="space-y-1">
                          <div className="flex items-center justify-between text-xs gap-3">
                            <span className="font-semibold text-ink-soft truncate">{s.name}</span>
                            <span className="font-mono font-bold text-ink flex-shrink-0">
                              {s.accuracy}% <span className="font-normal text-muted">({s.attempted} q)</span>
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-subtle overflow-hidden">
                            <div
                              className={`h-full rounded-full ${s.accuracy >= 70 ? 'bg-success' : s.accuracy >= 40 ? 'bg-warning' : 'bg-danger'}`}
                              style={{ width: `${s.accuracy}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {analytics.weakest.length > 0 && (
                  <Card flush className="p-5 space-y-3">
                    <h3 className="font-display font-bold text-sm text-ink flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-warning" />
                      <span>Lowest-accuracy subjects</span>
                    </h3>
                    <ul className="space-y-2">
                      {analytics.weakest.map((s) => (
                        <li key={s.name} className="flex items-center justify-between gap-3 text-xs">
                          <span className="text-ink-soft truncate">{s.name}</span>
                          <Badge tone={s.accuracy >= 40 ? 'warning' : 'danger'} size="sm" caps={false}>
                            {s.accuracy}% over {s.attempted} q
                          </Badge>
                        </li>
                      ))}
                    </ul>
                    <p className="text-[11px] text-muted-faint">
                      A subject needs at least 3 answered questions before it is listed here.
                    </p>
                  </Card>
                )}

                <Card flush className="p-5 space-y-3">
                  <h3 className="font-display font-bold text-sm text-ink flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-primary" />
                    <span>Score history</span>
                  </h3>
                  <div className="space-y-2">
                    {analytics.trend.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between gap-3 border-b border-line pb-2 text-xs last:border-0 last:pb-0"
                      >
                        <span className="truncate text-muted max-w-[50%]">{t.title}</span>
                        <span className="font-semibold text-ink flex-shrink-0">{t.scorePct}%</span>
                        <span className="text-muted-faint flex-shrink-0">{t.label}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
export default StudentPortal;
