import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  getQuestions,
  recordPracticeAttempt,
  getUserPracticeState,
  saveUserPracticeState
} from '../services/firestore';
import { MCQQuestion } from '../types';
import {
  HelpCircle,
  Flag,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Sparkles,
  BookOpen,
  RotateCcw,
  Clock,
  ShieldCheck,
  Check,
  Layers,
  Filter,
  Grid,
  X,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Lightbulb,
  Award,
  BrainCircuit,
  KeyRound
} from 'lucide-react';
import { generateMcqDeepDive, hasLiveAi } from '../services/aiProvider';
import { PageSkeleton } from '../components/ui/Skeleton';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { QuestionStemFormatter } from '../components/ui/QuestionStemFormatter';
import { useToast } from '../context/ToastContext';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { ShareButton } from '../components/ui/ShareButton';

interface McqPracticePageProps {
  initialTopicFilter?: string;
  onAskTutor: (query: string) => void;
  onNavigateToStudio?: () => void;
}

export const McqPracticePage: React.FC<McqPracticePageProps> = ({
  initialTopicFilter,
  onAskTutor,
  onNavigateToStudio
}) => {
  const { user, recordActivity } = useAuth();
  const { success: toastSuccess } = useToast();
  const [selectedPaper, setSelectedPaper] = useState<'civil' | 'gs'>('civil');
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>(() => {
    try {
      const saved = localStorage.getItem('exampilot_practice_answers');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanationStep, setExplanationStep] = useState<number>(1);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('exampilot_practice_flagged');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [loading, setLoading] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [showQuestionPalette, setShowQuestionPalette] = useState(false);
  const paletteTrapRef = useFocusTrap(showQuestionPalette);
  const [subjectFilter, setSubjectFilter] = useState<string>('ALL');
  const [aiDeepDive, setAiDeepDive] = useState<string | null>(null);
  const [aiDeepDiveLoading, setAiDeepDiveLoading] = useState(false);
  const [aiDeepDiveError, setAiDeepDiveError] = useState<null | 'no-key' | 'failed'>(null);

  useEffect(() => {
    const fetchQ = async () => {
      setLoading(true);
      const data = await getQuestions(selectedPaper);
      setQuestions(data);
      setCurrentIndex(0);
      setSubjectFilter('ALL');
      setShowExplanation(false);
      setExplanationStep(1);
      setAiDeepDive(null);
      setAiDeepDiveError(null);
      setLoading(false);
    };
    fetchQ();
  }, [selectedPaper]);

  const resetAiDeepDive = () => {
    setAiDeepDive(null);
    setAiDeepDiveError(null);
  };

  const handleAiDeepDive = async () => {
    if (!currentQ || aiDeepDiveLoading) return;
    if (!hasLiveAi()) {
      setAiDeepDiveError('no-key');
      return;
    }
    setAiDeepDiveLoading(true);
    setAiDeepDiveError(null);
    try {
      const reply = await generateMcqDeepDive(currentQ);
      if (reply && reply.content) {
        setAiDeepDive(reply.content);
      } else {
        setAiDeepDiveError('failed');
      }
    } catch (err) {
      console.warn('[ExamPilot] AI Deep Dive failed:', err);
      setAiDeepDiveError('failed');
    } finally {
      setAiDeepDiveLoading(false);
    }
  };

  // Sync dynamically when AI Ingestion Studio learns new questions
  useEffect(() => {
    const handleUpdate = async () => {
      const data = await getQuestions(selectedPaper);
      setQuestions(data);
    };
    window.addEventListener('exampilot_learned_update', handleUpdate);
    return () => window.removeEventListener('exampilot_learned_update', handleUpdate);
  }, [selectedPaper]);

  // Handle initial topic filter navigation
  useEffect(() => {
    if (initialTopicFilter && questions.length > 0) {
      const lower = initialTopicFilter.toLowerCase();
      const matchIdx = questions.findIndex(
        (q) =>
          q.topic.toLowerCase().includes(lower) ||
          q.subject.toLowerCase().includes(lower) ||
          lower.includes(q.topic.toLowerCase())
      );
      if (matchIdx !== -1) {
        setCurrentIndex(matchIdx);
      }
    }
  }, [initialTopicFilter, questions]);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const subjects = ['ALL', ...Array.from(new Set(questions.map((q) => q.subject)))];

  const filteredQuestions =
    subjectFilter === 'ALL'
      ? questions
      : questions.filter((q) => q.subject === subjectFilter);

  const activeQuestions = filteredQuestions.length > 0 ? filteredQuestions : questions;
  const safeIndex = Math.min(currentIndex, activeQuestions.length - 1);
  const currentQ = activeQuestions[safeIndex];

  const selectedAnswer = currentQ ? userAnswers[currentQ.id] : undefined;
  const isAnswered = Boolean(selectedAnswer);
  const isCorrect = currentQ && selectedAnswer === currentQ.correctOption;
  const isFlagged = currentQ && Boolean(flaggedQuestions[currentQ.id]);

  // Load saved practice state from Cloud Firestore
  useEffect(() => {
    if (!user?.uid) return;
    getUserPracticeState(user.uid)
      .then(({ userAnswers: loadedAnswers, flaggedQuestions: loadedFlagged }) => {
        if (loadedAnswers && Object.keys(loadedAnswers).length > 0) {
          setUserAnswers((prev) => ({ ...prev, ...loadedAnswers }));
        }
        if (loadedFlagged && Object.keys(loadedFlagged).length > 0) {
          setFlaggedQuestions((prev) => ({ ...prev, ...loadedFlagged }));
        }
      })
      .catch((err) => {
        console.warn('Failed to load practice state from Firestore:', err);
      });
  }, [user?.uid]);

  // Persist answers & flagged state to Cloud Firestore
  useEffect(() => {
    if (!user?.uid) return;
    saveUserPracticeState(user.uid, userAnswers, flaggedQuestions);
  }, [userAnswers, flaggedQuestions, user?.uid]);

  const handleSelectOption = (optId: 'A' | 'B' | 'C' | 'D') => {
    if (showExplanation || !currentQ) return;
    const isAnsCorrect = optId === currentQ.correctOption;
    setUserAnswers({ ...userAnswers, [currentQ.id]: optId });
    setShowExplanation(true);
    setExplanationStep(1);
    resetAiDeepDive();

    if (user) {
      recordPracticeAttempt({
        id: `att-${Date.now()}-${currentQ.id}`,
        userId: user.uid,
        questionId: currentQ.id,
        subject: currentQ.subject,
        topic: currentQ.topic,
        selectedOption: optId,
        correctOption: currentQ.correctOption,
        isCorrect: isAnsCorrect,
        timeSeconds: timerSeconds,
        timestamp: new Date().toISOString()
      }).catch((e) => console.warn('Practice attempt log error:', e));

      recordActivity(1, isAnsCorrect ? 1 : 0).catch((e) => console.warn('Record activity error:', e));
    }
  };

  const toggleFlag = () => {
    if (!currentQ) return;
    const next = !isFlagged;
    setFlaggedQuestions({ ...flaggedQuestions, [currentQ.id]: next });
    toastSuccess(next ? 'Flagged for review' : 'Flag removed', currentQ.topic);
  };

  const handleNext = () => {
    if (safeIndex < activeQuestions.length - 1) {
      const nextIdx = safeIndex + 1;
      setCurrentIndex(nextIdx);
      const nextAnswered = Boolean(userAnswers[activeQuestions[nextIdx].id]);
      setShowExplanation(nextAnswered);
      setExplanationStep(nextAnswered ? 3 : 1);
      resetAiDeepDive();
    }
  };

  const handlePrev = () => {
    if (safeIndex > 0) {
      const prevIdx = safeIndex - 1;
      setCurrentIndex(prevIdx);
      const prevAnswered = Boolean(userAnswers[activeQuestions[prevIdx].id]);
      setShowExplanation(prevAnswered);
      setExplanationStep(prevAnswered ? 3 : 1);
      resetAiDeepDive();
    }
  };

  const jumpToQuestion = (idx: number) => {
    setCurrentIndex(idx);
    const isAns = Boolean(userAnswers[activeQuestions[idx].id]);
    setShowExplanation(isAns);
    setExplanationStep(isAns ? 3 : 1);
    setShowQuestionPalette(false);
    resetAiDeepDive();
  };

  if (loading || !currentQ) {
    return <PageSkeleton />;
  }

  const answeredCount = Object.keys(userAnswers).filter((id) =>
    activeQuestions.some((q) => q.id === id)
  ).length;
  const progressPercent = Math.round(((safeIndex + 1) / activeQuestions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Paper Switcher Tabs (Civil 100 Qs vs GS 100 Qs) */}
      <Card flush className="p-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 flex-1">
          <button
            onClick={() => setSelectedPaper('civil')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              selectedPaper === 'civil'
                ? 'bg-primary text-white shadow-sm'
                : 'text-ink-soft hover:bg-subtle-strong'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Civil Engineering (100 Qs)</span>
            <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded bg-white/20 font-mono">
              Technical Paper
            </span>
          </button>

          <button
            onClick={() => setSelectedPaper('gs')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              selectedPaper === 'gs'
                ? 'bg-primary text-white shadow-sm'
                : 'text-ink-soft hover:bg-subtle-strong'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>General Studies (100 Qs)</span>
            <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded bg-white/20 font-mono">
              India & Assam
            </span>
          </button>
        </div>
      </Card>

      {/* Interactive Sub-Header matching Stitch Screen 05 */}
      <Card flush className="p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Context / Subject */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-display font-semibold text-xs sm:text-sm text-ink truncate">
                {selectedPaper === 'civil' ? 'Civil Engineering' : 'General Studies'}
              </span>
              <Badge tone="subtle">Step-by-Step Mode</Badge>
            </div>
            <p className="text-xs text-muted truncate">
              {currentQ.subject} • {currentQ.topic}
            </p>
          </div>
        </div>

        {/* Center: Question Progress & 100-Question Quick Jump */}
        <div className="flex flex-col items-center justify-center gap-1.5 w-48 sm:w-56">
          <div className="flex items-center justify-between w-full text-xs">
            <button
              onClick={() => setShowQuestionPalette(true)}
              className="text-primary font-bold hover:underline flex items-center gap-1"
              title="Click to jump to any question"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Q.{safeIndex + 1} of {activeQuestions.length}</span>
            </button>
            <span className="text-muted font-semibold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-subtle-strong overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Right: Timer, Palette trigger & Tools */}
        <div className="flex items-center gap-2">
          <div
            role="timer"
            aria-live="off"
            aria-label={`Elapsed ${formatTimer(timerSeconds)}`}
            className="px-3 py-1.5 rounded-xl bg-subtle-strong text-ink-soft font-mono text-xs font-semibold flex items-center gap-1.5 tabular-nums"
          >
            <Clock className="w-3.5 h-3.5 text-muted" aria-hidden="true" />
            <span aria-hidden="true">{formatTimer(timerSeconds)}</span>
            <span className="sr-only">Elapsed {formatTimer(timerSeconds)}</span>
          </div>

          <Button variant="outline" size="sm" onClick={() => setShowQuestionPalette(true)} icon={<Grid className="w-3.5 h-3.5 text-primary" />}>
            <span className="hidden sm:inline">1–100 Matrix</span>
            <span className="sm:hidden">Matrix</span>
          </Button>

          <button
            onClick={toggleFlag}
            aria-pressed={isFlagged}
            aria-label={isFlagged ? 'Remove flag' : 'Flag for review'}
            className={`p-2 rounded-xl border transition ${
              isFlagged
                ? 'bg-primary-fixed text-primary border-primary-fixed-dim shadow-2xs'
                : 'border-line text-muted-faint hover:text-ink-soft hover:bg-subtle'
            }`}
            title="Flag for later review"
          >
            <Flag className={`w-4 h-4 ${isFlagged ? 'fill-current' : ''}`} />
          </button>
          <ShareButton url={`${window.location.origin}/practice?topic=${encodeURIComponent(currentQ.topic)}`} title={currentQ.topic} variant="ghost" size="sm" />
        </div>
      </Card>

      {/* Subject Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <Filter className="w-3.5 h-3.5 text-muted-faint flex-shrink-0 ml-1" />
        <span className="text-muted-faint text-xs font-medium flex-shrink-0">Subject:</span>
        {subjects.map((sub) => (
          <button
            key={sub}
            onClick={() => {
              setSubjectFilter(sub);
              setCurrentIndex(0);
            }}
            className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
              subjectFilter === sub
                ? 'bg-primary text-white font-semibold shadow-2xs'
                : 'bg-card border border-line text-ink-soft hover:bg-subtle'
            }`}
          >
            {sub === 'ALL' ? `All (${questions.length})` : sub}
          </button>
        ))}
      </div>

      {/* ---------------- Main Animated Question Box ---------------- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedPaper}-${currentQ.id}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
          className="bg-card rounded-2xl border border-line p-6 sm:p-8 shadow-sm space-y-6"
        >
          {/* Question Metadata & Tags */}
          <div className="flex items-center justify-between text-xs text-muted border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-subtle-strong font-mono font-bold text-ink-soft">
                Q.{safeIndex + 1}
              </span>
              <span className="font-semibold text-ink-soft">{currentQ.topic}</span>
              {currentQ.difficulty && (
                <Badge
                  tone={
                    currentQ.difficulty === 'HARD'
                      ? 'danger'
                      : currentQ.difficulty === 'MEDIUM'
                      ? 'warning'
                      : 'success'
                  }
                >
                  {currentQ.difficulty}
                </Badge>
              )}
              {currentQ.id.startsWith('learned-') && (
                <Badge tone="brand" icon={<Sparkles className="w-2.5 h-2.5" />}>
                  AI Ingested ESE
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              {currentQ.pyqYear && (
                <span className="text-[11px] font-mono text-muted-faint bg-subtle px-2 py-0.5 rounded border border-line">
                  {currentQ.pyqExam} {currentQ.pyqYear}
                </span>
              )}
              <span className="text-muted-faint font-mono text-[11px]">
                {answeredCount}/{activeQuestions.length} answered
              </span>
            </div>
          </div>

          {/* Question Stem */}
          <QuestionStemFormatter stem={currentQ.stem} />

          {/* Code Snippet / Formula Box if present */}
          {currentQ.formulaContext && (
            <div className="p-4 rounded-xl bg-inverse text-indigo-300 font-mono text-xs border border-inverse-line overflow-x-auto">
              <code>{currentQ.formulaContext}</code>
            </div>
          )}

          {/* Multiple Choice Options with micro-spring animations */}
          <div className="space-y-3 pt-1">
            {currentQ.options.map((opt) => {
              const isSelected = selectedAnswer === opt.id;
              const isAnswerCorrect = opt.id === currentQ.correctOption;

              let optionStyle = 'border-line bg-card hover:border-primary/50 text-ink';

              if (showExplanation) {
                if (isAnswerCorrect) {
                  optionStyle = 'border-success-border bg-success-surface text-success-text font-medium shadow-2xs';
                } else if (isSelected && !isAnswerCorrect) {
                  optionStyle = 'border-danger-border bg-danger-surface text-danger-text';
                } else {
                  optionStyle = 'border-line bg-subtle/50 text-muted-faint opacity-70';
                }
              } else if (isSelected) {
                optionStyle = 'border-primary bg-primary-fixed text-primary font-medium shadow-2xs';
              }

              return (
                <motion.button
                  key={opt.id}
                  whileHover={{ scale: 1.006 }}
                  whileTap={{ scale: 0.994 }}
                  onClick={() => handleSelectOption(opt.id as any)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between gap-3 ${optionStyle}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-lg text-xs font-bold font-mono flex items-center justify-center flex-shrink-0 transition ${
                        showExplanation && isAnswerCorrect
                          ? 'bg-emerald-600 text-white'
                          : showExplanation && isSelected && !isAnswerCorrect
                          ? 'bg-rose-600 text-white'
                          : isSelected
                          ? 'bg-primary text-white'
                          : 'bg-subtle-strong text-ink-soft'
                      }`}
                    >
                      {opt.id}
                    </span>
                    <span className="text-xs sm:text-sm leading-relaxed">{opt.text}</span>
                  </div>

                  {showExplanation && isAnswerCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-success-text flex-shrink-0" />
                  )}
                  {showExplanation && isSelected && !isAnswerCorrect && (
                    <XCircle className="w-5 h-5 text-danger-text flex-shrink-0" />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* ---------------- Step-by-Step Progressive Solution Breakdown ---------------- */}
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="p-5 rounded-2xl bg-subtle border border-line space-y-4"
            >
              {/* Solution Banner */}
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <Badge
                      tone="success"
                      size="md"
                      caps={false}
                      bordered={false}
                      icon={<Check className="w-3.5 h-3.5" />}
                    >
                      Correct Answer: Option {currentQ.correctOption}
                    </Badge>
                  ) : (
                    <Badge
                      tone="danger"
                      size="md"
                      caps={false}
                      bordered={false}
                      icon={<XCircle className="w-3.5 h-3.5" />}
                    >
                      Incorrect (Correct: Option {currentQ.correctOption})
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleAiDeepDive}
                    disabled={aiDeepDiveLoading}
                    className="text-xs text-primary font-semibold hover:underline flex items-center gap-1 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <BrainCircuit className="w-3.5 h-3.5" />
                    {aiDeepDiveLoading ? 'Thinking…' : 'AI Deep Dive'}
                  </button>
                  <button
                    onClick={() =>
                      onAskTutor(
                        `Help me understand why Option ${currentQ.correctOption} is correct for: "${currentQ.stem}"`
                      )
                    }
                    className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Ask AI Tutor
                  </button>
                </div>
              </div>

              {/* Step Selector Pills for Solution Breakdown */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-muted-faint uppercase tracking-wider">
                  Solution Steps:
                </span>
                <div className="inline-flex p-0.5 bg-line/70 rounded-lg text-xs font-semibold">
                  <button
                    onClick={() => setExplanationStep(1)}
                    className={`px-3 py-1 rounded-md transition ${
                      explanationStep === 1 ? 'bg-card text-primary shadow-2xs' : 'text-ink-soft'
                    }`}
                  >
                    1. Given & Concept
                  </button>
                  <button
                    onClick={() => setExplanationStep(2)}
                    className={`px-3 py-1 rounded-md transition ${
                      explanationStep === 2 ? 'bg-card text-primary shadow-2xs' : 'text-ink-soft'
                    }`}
                  >
                    2. Formula & Code
                  </button>
                  <button
                    onClick={() => setExplanationStep(3)}
                    className={`px-3 py-1 rounded-md transition ${
                      explanationStep === 3 ? 'bg-card text-primary shadow-2xs' : 'text-ink-soft'
                    }`}
                  >
                    3. Working & Takeaway
                  </button>
                </div>
              </div>

              {/* Step Content */}
              <Card flush className="p-4 text-xs sm:text-sm text-ink leading-relaxed">
                {explanationStep === 1 && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-primary flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" /> Step 1: Problem Identification & Given Parameters
                    </div>
                    <p className="text-xs text-ink-soft">
                      This question tests fundamental principles of <strong className="text-ink">{currentQ.topic}</strong>. The problem requires identifying governing standards, definitions, or equations relevant to this competitive exam pattern.
                    </p>
                  </div>
                )}

                {explanationStep === 2 && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-primary flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" /> Step 2: Governing Specifications & Formulas
                    </div>
                    {currentQ.formulaContext ? (
                      <div className="p-3 bg-inverse text-indigo-200 rounded-lg font-mono text-xs overflow-x-auto">
                        <code>{currentQ.formulaContext}</code>
                      </div>
                    ) : (
                      <p className="text-xs text-ink-soft italic">
                        Standard statutory provisions and conceptual definitions apply directly per official syllabus.
                      </p>
                    )}
                    {currentQ.referenceSource && (
                      <div className="text-[11px] text-muted flex items-center gap-1 pt-1">
                        <span>Standard Reference: <strong>{currentQ.referenceSource}</strong></span>
                      </div>
                    )}
                  </div>
                )}

                {explanationStep === 3 && (
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-success-text flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" /> Step 3: Detailed Solution & Mathematical Working
                    </div>
                    <div className="text-xs text-ink-soft whitespace-pre-line leading-relaxed">
                      {currentQ.explanation}
                    </div>
                    <div className="p-2.5 rounded-lg bg-primary-fixed border border-primary-fixed-dim text-xs text-primary font-medium flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>Exam Tip: Mark Option <strong>{currentQ.correctOption}</strong> to secure full +2 marks without negative marking.</span>
                    </div>
                  </div>
                )}
              </Card>

              {/* Step Navigation for Solution */}
              <div className="flex items-center justify-between pt-1">
                <button
                  disabled={explanationStep === 1}
                  onClick={() => setExplanationStep((p) => p - 1)}
                  className="text-xs font-medium text-muted hover:text-ink disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" /> Prev Step
                </button>
                <button
                  disabled={explanationStep === 3}
                  onClick={() => setExplanationStep((p) => p + 1)}
                  className="text-xs font-medium text-primary hover:underline disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
                >
                  Next Step <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* AI Deep Dive Panel */}
              {aiDeepDiveError === 'no-key' && (
                <div className="p-3.5 rounded-xl bg-warning-surface border border-warning-border text-xs text-warning-text flex items-center justify-between gap-3 flex-wrap">
                  <span className="flex items-center gap-2 font-medium">
                    <KeyRound className="w-4 h-4 flex-shrink-0" />
                    AI Deep Dive needs a Gemini API key. Add one in the AI Ingestion Studio to enable live explanations.
                  </span>
                  {onNavigateToStudio && (
                    <button
                      onClick={onNavigateToStudio}
                      className="px-3 py-1.5 rounded-lg bg-warning hover:bg-amber-600 text-white text-[11px] font-bold transition flex-shrink-0"
                    >
                      Open AI Studio
                    </button>
                  )}
                </div>
              )}

              {aiDeepDiveError === 'failed' && (
                <div className="p-3.5 rounded-xl bg-danger-surface border border-danger-border text-xs text-danger-text font-medium flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    AI request failed. Check your API key and connection, then try again.
                  </span>
                  <button
                    onClick={handleAiDeepDive}
                    className="px-3 py-1.5 rounded-lg bg-danger hover:bg-rose-600 text-white text-[11px] font-bold transition flex-shrink-0"
                  >
                    Retry
                  </button>
                </div>
              )}

              {aiDeepDiveLoading && (
                <div className="p-4 rounded-xl bg-primary-fixed border border-primary-fixed-dim text-xs text-primary flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-fixed-dim border-t-purple-600 rounded-full animate-spin flex-shrink-0"></span>
                  <span className="font-medium">Generating step-by-step AI breakdown for this question…</span>
                </div>
              )}

              {aiDeepDive && (
                <div className="p-4 rounded-xl bg-primary-fixed border border-primary-fixed-dim space-y-2">
                  <div className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <BrainCircuit className="w-4 h-4" /> AI Deep Dive
                  </div>
                  <div className="text-xs text-ink whitespace-pre-line leading-relaxed">
                    {aiDeepDive}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Bottom Control Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-line">
            <Button variant="outline" size="sm" onClick={handlePrev} disabled={safeIndex === 0} icon={<ArrowLeft className="w-4 h-4" />}>
              Previous
            </Button>

            {!showExplanation && isAnswered && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setShowExplanation(true);
                  setExplanationStep(3);
                }}
                className="bg-inverse hover:bg-inverse-hover text-white border-transparent"
              >
                Verify Solution
              </Button>
            )}

            <Button
              variant="primary"
              size="sm"
              onClick={handleNext}
              disabled={safeIndex === activeQuestions.length - 1}
              iconRight={<ArrowRight className="w-4 h-4" />}
              className="shadow-md shadow-primary/20"
            >
              Next Question
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 100-Question Matrix Jump Palette Modal */}
      {showQuestionPalette && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowQuestionPalette(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setShowQuestionPalette(false);
          }}
        >
          <Card
            flush
            ref={paletteTrapRef as any}
            role="dialog"
            aria-modal="true"
            aria-label="Question palette"
            className="shadow-2xl w-full max-w-2xl p-6 space-y-4 max-h-[85vh] flex flex-col"
          >
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <h3 className="font-display font-bold text-ink text-sm sm:text-base">
                  {selectedPaper === 'civil' ? 'Civil Engineering' : 'General Studies'} Question Matrix (1–100)
                </h3>
                <p className="text-xs text-muted">
                  Select any question number to jump directly
                </p>
              </div>
              <button
                onClick={() => setShowQuestionPalette(false)}
                aria-label="Close palette"
                className="p-1 rounded-lg text-muted-faint hover:text-ink-soft hover:bg-subtle-strong"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-[11px] text-ink-soft">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-success inline-block" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-primary-light inline-block" />
                <span>Flagged</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-line inline-block" />
                <span>Unattempted</span>
              </div>
            </div>

            {/* 10x10 Matrix Grid */}
            <div className="flex-1 overflow-y-auto grid grid-cols-10 gap-1.5 p-1">
              {activeQuestions.map((q, idx) => {
                const ans = userAnswers[q.id];
                const flagged = flaggedQuestions[q.id];
                const isCur = idx === safeIndex;

                let btnClass = 'bg-subtle-strong text-ink-soft border-line hover:bg-line';

                if (flagged) {
                  btnClass = 'bg-primary-fixed text-primary border-primary-fixed-dim font-bold';
                } else if (ans) {
                  btnClass = 'bg-success-surface text-success-text border-success-border font-bold';
                }

                if (isCur) {
                  btnClass += ' ring-2 ring-primary ring-offset-1';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => jumpToQuestion(idx)}
                    className={`h-9 rounded-lg border text-xs font-mono transition flex items-center justify-center ${btnClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-line flex items-center justify-between text-xs">
              <span className="text-muted">
                Total Questions: <strong className="text-ink">{activeQuestions.length}</strong>
              </span>
              <Button variant="primary" size="sm" onClick={() => setShowQuestionPalette(false)} className="bg-inverse hover:bg-inverse-hover">
                Close Matrix
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
