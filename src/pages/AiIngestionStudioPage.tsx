import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Cpu,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowRight,
  ShieldCheck,
  Zap,
  Building2,
  Layers,
  Crown,
  Trash2,
  ExternalLink,
  Key,
  HelpCircle,
  Copy,
  Check,
  Flame,
  Clock,
  Send,
  XCircle,
  FolderOpen
} from 'lucide-react';
import {
  POPULAR_ESE_TOPICS,
  ingestTopicWithEseQuestions,
  IngestionResult
} from '../services/aiIngestionService';
import {
  getLearnedModules,
  saveLearnedModule,
  deleteLearnedModule,
  getLearnedStats
} from '../services/aiKnowledgeStore';
import { KnowledgeModule, MCQQuestion } from '../types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { QuestionFactoryPanel } from '../components/factory/QuestionFactoryPanel';

interface AiIngestionStudioPageProps {
  onNavigateToSyllabus?: (topicId: string) => void;
  onNavigateToPractice?: (topicTitle: string) => void;
}

export const AiIngestionStudioPage: React.FC<AiIngestionStudioPageProps> = ({
  onNavigateToSyllabus,
  onNavigateToPractice
}) => {
  const [topicInput, setTopicInput] = useState('');
  const [category, setCategory] = useState<'civil' | 'gs'>('civil');
  const [targetLevel, setTargetLevel] = useState<'UPSC_ESE' | 'APSC_AE' | 'GATE_CONCEPTUAL'>('UPSC_ESE');
  const [questionCount, setQuestionCount] = useState<number>(3);
   const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
     return localStorage.getItem('exampilot_gemini_key') || '';
   });
   const [showKeyModal, setShowKeyModal] = useState(false);
   const [showOllamaModal, setShowOllamaModal] = useState(false);
   const [ollamaBaseUrl, setOllamaBaseUrl] = useState<string>(() => {
     return localStorage.getItem('exampilot_ollama_base') || 'http://127.0.0.1:11434';
   });
   const [ollamaModel, setOllamaModel] = useState<string>(() => {
     return localStorage.getItem('exampilot_ollama_model') || 'qwen2.5-coder:7b';
   });

  // Generation status state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [generatedResult, setGeneratedResult] = useState<IngestionResult | null>(null);

  // Result interaction state
  const [resultTab, setResultTab] = useState<'mcqs' | 'theory' | 'formulas'>('mcqs');
  const [userAnswers, setUserAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({});
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  // Archive of learned modules
  const [learnedModules, setLearnedModules] = useState<KnowledgeModule[]>(() => getLearnedModules());
  const [stats, setStats] = useState(() => getLearnedStats());

  const refreshArchive = () => {
    setLearnedModules(getLearnedModules());
    setStats(getLearnedStats());
  };

  useEffect(() => {
    const handleUpdate = () => refreshArchive();
    window.addEventListener('exampilot_learned_update', handleUpdate);
    return () => window.removeEventListener('exampilot_learned_update', handleUpdate);
  }, []);

  const handleSaveApiKey = (key: string) => {
    setGeminiApiKey(key);
    localStorage.setItem('exampilot_gemini_key', key);
    setShowKeyModal(false);
  };

  const handleSaveOllama = (url: string, model: string) => {
    localStorage.setItem('exampilot_ollama_base', url);
    localStorage.setItem('exampilot_ollama_model', model);
    setShowOllamaModal(false);
  };

  const handleSelectPreset = (preset: typeof POPULAR_ESE_TOPICS[0]) => {
    setTopicInput(preset.query);
    setCategory(preset.category);
  };

  const handleStartIngestion = async () => {
    const query = topicInput.trim();
    if (!query) return;

    setIsGenerating(true);
    setGenerationStep(1);
    setGeneratedResult(null);
    setUserAnswers({});
    setExpandedSolutions({});

    try {
      const result = await ingestTopicWithEseQuestions({
        topicQuery: query,
        category,
        targetLevel,
        questionCount,
        apiKey: geminiApiKey || undefined,
        onProgress: (step, msg) => {
          setGenerationStep(step);
          setStatusMessage(msg);
        }
      });

      // Save to application learning store
      await saveLearnedModule(result.module, result.questions);
      setGeneratedResult(result);
      refreshArchive();
    } catch (err: any) {
      console.error('Ingestion failed:', err);
      alert(`Synthesis failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteModule = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this learned module and its questions?')) {
      await deleteLearnedModule(id);
      if (generatedResult?.module.id === id) {
        setGeneratedResult(null);
      }
      refreshArchive();
    }
  };

  const handleAnswerQuestion = (qId: string, opt: 'A' | 'B' | 'C' | 'D') => {
    setUserAnswers((prev) => ({ ...prev, [qId]: opt }));
    setExpandedSolutions((prev) => ({ ...prev, [qId]: true }));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormula(text);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  return (
    <div className="flex flex-col w-full h-full bg-canvas text-ink overflow-y-auto font-sans">
      {/* ---------------- Header & Model Status ---------------- */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-5 bg-card border-b border-line shadow-sm">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold font-display text-ink tracking-tight">
                  AI Curricular Ingestion & UPSC ESE Studio
                </h1>
                <Badge tone="brand" size="md" caps={false}>
                  Model v2.5 • Continuous Learning Engine
                </Badge>
              </div>
              <p className="text-xs text-muted mt-0.5">
                Synthesize exhaustive syllabus topics, codal provisions & authentic UPSC ESE / IES multi-statement MCQs.
              </p>
            </div>
          </div>

          {/* Quick Metrics & API Key Config Button */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-subtle border border-line px-3 py-1.5 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-semibold text-ink-soft">
                {stats.totalTopics} Topics Learned ({stats.totalQuestions} ESE MCQs)
              </span>
            </div>

             <button
               onClick={() => setShowKeyModal(true)}
               className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line bg-card hover:bg-subtle text-ink-soft text-xs font-semibold transition-all shadow-xs"
             >
               <Key className="w-3.5 h-3.5 text-primary" />
               <span>{geminiApiKey ? 'Gemini Key Configured' : 'Configure Gemini API'}</span>
             </button>

             <button
               onClick={() => setShowOllamaModal(true)}
               className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-success-border bg-success-surface hover:bg-success/10 text-success-text text-xs font-semibold transition-all shadow-xs"
             >
               <Cpu className="w-3.5 h-3.5" />
               <span>Free Local Model (Ollama)</span>
             </button>
           </div>
        </div>
      </section>

      {/* ---------------- Main Studio Body ---------------- */}
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Step 1: Synthesis Control Center */}
        <Card flush className="p-5 sm:p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-base font-bold text-ink">
                1. Specify Curricular Topic & Target Rigor
              </h2>
            </div>
            <span className="text-xs font-mono text-muted-faint uppercase tracking-wider">
              UPSC ESE / IES SPECIFICATION PIPELINE
            </span>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-ink-soft uppercase tracking-wider">
              High-Yield Recommended ESE Topics (Click to Load):
            </span>
            <div className="flex flex-wrap gap-2">
              {POPULAR_ESE_TOPICS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all text-left ${
                    topicInput === preset.query
                      ? 'bg-primary text-white border-primary shadow-xs'
                      : 'bg-subtle hover:bg-subtle-strong text-ink-soft border-line'
                  }`}
                >
                  <span className="font-semibold">{preset.query}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Input Bar */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-ink-soft uppercase tracking-wider">
              Or Type Any Custom Engineering or General Studies Topic:
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="e.g. Seismic Zone Factors & Ductile Detailing per IS 13920, Plastic Analysis of Frames, Lacey Scour Depth..."
                className="w-full sm:flex-1 h-11 px-4 rounded-xl border border-line-strong text-xs sm:text-sm text-ink placeholder:text-muted-faint focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim transition-all"
              />

              <button
                onClick={handleStartIngestion}
                disabled={isGenerating || !topicInput.trim()}
                className={`h-11 px-6 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                  isGenerating || !topicInput.trim()
                    ? 'bg-line text-muted-faint cursor-not-allowed'
                    : 'bg-primary hover:bg-primary-dark text-white shadow-primary/20'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Synthesize Topic & ESE MCQs</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Configuration Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-line">
            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-ink-soft">Curricular Stream:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCategory('civil')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    category === 'civil'
                      ? 'bg-primary-fixed border-primary-fixed-dim text-primary shadow-xs'
                      : 'bg-subtle border-line text-ink-soft'
                  }`}
                >
                  Civil Engineering (Paper II)
                </button>
                <button
                  type="button"
                  onClick={() => setCategory('gs')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    category === 'gs'
                      ? 'bg-success-surface border-success-border text-success-text shadow-xs'
                      : 'bg-subtle border-line text-ink-soft'
                  }`}
                >
                  General Studies (Paper I)
                </button>
              </div>
            </div>

            {/* Target Exam Standard */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-ink-soft">Target Standard:</span>
              <select
                value={targetLevel}
                onChange={(e) => setTargetLevel(e.target.value as any)}
                className="h-9 px-3 rounded-lg border border-line-strong text-xs text-ink bg-card focus:outline-none focus:border-primary"
              >
                <option value="UPSC_ESE">UPSC ESE / IES (Hard, Multi-Statement)</option>
                <option value="APSC_AE">State PSC (APSC AE) Technical Exam</option>
                <option value="GATE_CONCEPTUAL">GATE Deep Analytical Concept</option>
              </select>
            </div>

            {/* Questions to Generate */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-ink-soft">Calibrated MCQs to Synthesize:</span>
              <div className="flex gap-2">
                {[3, 5, 8].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setQuestionCount(cnt)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      questionCount === cnt
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'bg-subtle border-line text-ink-soft hover:bg-subtle-strong'
                    }`}
                  >
                    {cnt} Questions
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Live Multi-Step Synthesis Pipeline Indicator */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-indigo-900 text-white rounded-2xl p-6 shadow-xl flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-sm font-bold tracking-wide">
                    AI Ingestion Engine Active • Step {generationStep} of 4
                  </span>
                </div>
                <span className="text-xs text-indigo-200 font-mono">Calibrating to UPSC ESE Benchmarks</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 bg-indigo-950 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-400 via-indigo-300 to-primary-light"
                  animate={{ width: `${(generationStep / 4) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              {/* Status text */}
              <div className="flex items-center justify-between text-xs text-indigo-200">
                <span>{statusMessage}</span>
                <span className="font-mono">{Math.round((generationStep / 4) * 100)}% Complete</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generated Result Preview */}
        {generatedResult && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border-2 border-primary/40 p-6 shadow-lg flex flex-col gap-5"
          >
            {/* Header & Success Banner */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-4">
              <div className="flex flex-col gap-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <Badge
                    tone="success"
                    size="md"
                    caps={false}
                    icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  >
                    Successfully Ingested & Learned
                  </Badge>
                  <span className="text-xs text-muted-faint">•</span>
                  <span className="text-xs font-mono text-primary font-semibold">
                     {generatedResult.source === 'GEMINI_AI'
                       ? 'Generated via Google Gemini AI'
                       : generatedResult.source === 'LOCAL_AI'
                       ? 'Generated via local AI model (free, no API key)'
                       : 'Generated via Built-in ESE Model'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-ink mt-1">
                  {generatedResult.module.title}
                </h2>
                <p className="text-xs sm:text-sm text-ink-soft">
                  {generatedResult.module.summary}
                </p>
              </div>

              {/* Action Buttons to navigate to other screens */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => onNavigateToSyllabus?.(generatedResult.module.id)}
                  className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Explore in Syllabus Explorer</span>
                </button>

                <button
                  onClick={() => onNavigateToPractice?.(generatedResult.module.title)}
                  className="px-3.5 py-2 rounded-xl bg-subtle-strong hover:bg-line text-ink font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <Play className="w-4 h-4 text-primary" />
                  <span>Practice in MCQ Engine</span>
                </button>
              </div>
            </div>

            {/* Sub-Tabs for Result */}
            <div className="flex items-center gap-2 border-b border-line pb-2 overflow-x-auto">
              <button
                onClick={() => setResultTab('mcqs')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  resultTab === 'mcqs'
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-subtle-strong text-ink-soft hover:bg-line'
                }`}
              >
                <span>Synthesized UPSC ESE MCQs</span>
                <span className="px-1.5 py-0.2 rounded bg-white/20 text-[10px] font-mono">
                  {generatedResult.questions.length}
                </span>
              </button>

              <button
                onClick={() => setResultTab('theory')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  resultTab === 'theory'
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-subtle-strong text-ink-soft hover:bg-line'
                }`}
              >
                Curricular Theory & Code Specs
              </button>

              <button
                onClick={() => setResultTab('formulas')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  resultTab === 'formulas'
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-subtle-strong text-ink-soft hover:bg-line'
                }`}
              >
                Formulas & Callout Traps
              </button>
            </div>

            {/* TAB: UPSC ESE MCQs */}
            {resultTab === 'mcqs' && (
              <div className="flex flex-col gap-4">
                {generatedResult.questions.map((q, idx) => {
                  const selectedOpt = userAnswers[q.id];
                  const isAnswered = !!selectedOpt;
                  const isCorrect = selectedOpt === q.correctOption;
                  const showSolution = expandedSolutions[q.id];

                  return (
                    <div
                      key={q.id}
                      className={`p-5 rounded-xl border transition-all ${
                        isAnswered
                          ? isCorrect
                            ? 'bg-success-surface border-success-border'
                            : 'bg-danger-surface border-danger-border'
                          : 'bg-subtle/70 border-line'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs text-muted mb-2">
                        <span className="font-bold text-primary">UPSC ESE Problem {idx + 1}</span>
                        <div className="flex items-center gap-2">
                          <Badge tone="danger" bordered={false}>
                            {q.difficulty}
                          </Badge>
                          <span className="font-mono text-[10px] text-muted-faint">{q.pyqExam}</span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm font-semibold text-ink leading-relaxed mb-4 whitespace-pre-line">
                        {q.stem}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                        {q.options.map((opt) => {
                          const isSelected = selectedOpt === opt.id;
                          const isThisCorrect = opt.id === q.correctOption;

                          let btnStyle = 'bg-card border-line text-ink-soft hover:border-primary-fixed-dim';

                          if (isAnswered) {
                            if (isThisCorrect) {
                              btnStyle = 'bg-success-surface border-success-border text-success-text font-bold';
                            } else if (isSelected && !isThisCorrect) {
                              btnStyle = 'bg-danger-surface border-danger-border text-danger-text font-semibold';
                            } else {
                              btnStyle = 'bg-card/60 border-line text-muted-faint opacity-60';
                            }
                          }

                          return (
                            <button
                              key={opt.id}
                              onClick={() => handleAnswerQuestion(q.id, opt.id as any)}
                              disabled={isAnswered}
                              className={`p-3 rounded-lg border text-left text-xs flex items-start gap-2.5 transition-all ${btnStyle}`}
                            >
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0 ${
                                  isAnswered && isThisCorrect
                                    ? 'bg-emerald-600 text-white'
                                    : isAnswered && isSelected
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-subtle-strong text-ink-soft'
                                }`}
                              >
                                {opt.id}
                              </span>
                              <span className="leading-snug">{opt.text}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Feedback banner */}
                      {isAnswered && (
                        <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-line">
                          <div className="flex items-center gap-1.5 font-bold">
                            {isCorrect ? (
                              <span className="text-success-text flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4 text-success-text" />
                                <span>Correct! (+2.0 Marks)</span>
                              </span>
                            ) : (
                              <span className="text-danger-text flex items-center gap-1">
                                <XCircle className="w-4 h-4 text-danger-text" />
                                <span>Incorrect (-0.50 Penalty)</span>
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() =>
                              setExpandedSolutions((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                            }
                            className="text-primary hover:text-primary font-semibold text-xs"
                          >
                            {showSolution ? 'Hide Solution' : 'View Step-by-Step Solution'}
                          </button>
                        </div>
                      )}

                      {/* Solution */}
                      {isAnswered && showSolution && (
                        <Card flush className="mt-3 p-3.5 text-xs text-ink-soft flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-[11px] text-muted font-mono">
                            <span>Correct Answer: Option {q.correctOption}</span>
                            {q.formulaContext && <span>Equation: {q.formulaContext}</span>}
                          </div>
                          <p className="leading-relaxed text-ink">{q.explanation}</p>
                        </Card>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB: Theory */}
            {resultTab === 'theory' && (
              <div className="flex flex-col gap-4 text-xs sm:text-sm text-ink-soft">
                <div className="p-4 rounded-xl bg-subtle border border-line flex flex-col gap-2">
                  <span className="font-bold text-ink">Governing Specifications & Code Reference:</span>
                  <span className="font-mono text-primary font-semibold">{generatedResult.module.codeClause}</span>
                  <p className="mt-1 leading-relaxed">{generatedResult.module.fullDescription}</p>
                </div>

                {generatedResult.module.comparisonGrid && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-subtle border border-line flex flex-col gap-1.5">
                      <span className="font-bold text-ink">{generatedResult.module.comparisonGrid.titleLeft}</span>
                      <span className="font-mono text-primary font-bold">{generatedResult.module.comparisonGrid.valueLeft}</span>
                      <p className="text-xs text-ink-soft">{generatedResult.module.comparisonGrid.descLeft}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-subtle border border-line flex flex-col gap-1.5">
                      <span className="font-bold text-ink">{generatedResult.module.comparisonGrid.titleRight}</span>
                      <span className="font-mono text-primary font-bold">{generatedResult.module.comparisonGrid.valueRight}</span>
                      <p className="text-xs text-ink-soft">{generatedResult.module.comparisonGrid.descRight}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: Formulas */}
            {resultTab === 'formulas' && (
              <div className="flex flex-col gap-4">
                {generatedResult.module.steps
                  .filter((s) => s.formulaOrCode)
                  .map((step, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-subtle border border-line flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-ink">{step.stepTitle}</span>
                        <button
                          onClick={() => handleCopy(step.formulaOrCode || '')}
                          className="flex items-center gap-1 text-xs text-primary font-semibold"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copiedFormula === step.formulaOrCode ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="p-3 bg-inverse text-emerald-300 font-mono text-xs rounded-lg overflow-x-auto">
                        {step.formulaOrCode}
                      </div>
                    </div>
                  ))}

                {generatedResult.module.callouts && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    <div className="p-4 rounded-xl bg-subtle border border-line">
                      <span className="text-xs font-bold text-ink block mb-1">📌 Core Postulate:</span>
                      <p className="text-xs text-ink-soft">{generatedResult.module.callouts.corePostulate}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-danger-surface border border-danger-border">
                      <span className="text-xs font-bold text-danger-text block mb-1">⚠️ Common Exam Trap:</span>
                      <p className="text-xs text-danger-text">{generatedResult.module.callouts.examTrap}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Step 2: Learned Curriculum Archive Table */}
        <Card flush className="p-5 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-primary" />
              <h2 className="text-base font-bold text-ink">
                Learned Curriculum Archive ({learnedModules.length} Modules Active)
              </h2>
            </div>
            <span className="text-xs text-muted">
              Permanently available across Syllabus Explorer & Practice Bank
            </span>
          </div>

          {learnedModules.length === 0 ? (
            <EmptyState
              icon={<Cpu className="h-5 w-5" />}
              title="No synthesized topics yet"
              description="Pick a preset topic above, or type your own, to synthesize a module with step-wise theory, codal provisions and UPSC ESE MCQs."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {learnedModules.map((mod) => (
                <div
                  key={mod.id}
                  className="p-4 rounded-xl border border-line bg-subtle/50 hover:bg-subtle transition-all flex flex-col justify-between gap-3 shadow-xs"
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[11px] text-muted">
                      <span className="font-bold text-primary uppercase tracking-wider">{mod.subject}</span>
                      <Badge tone="brand" bordered={false} caps={false}>
                        {(mod.topicQuestions || []).length} ESE MCQs
                      </Badge>
                    </div>

                    <h3 className="text-sm font-bold text-ink leading-tight">
                      {mod.title.split(':')[0]}
                    </h3>
                    <p className="text-xs text-muted line-clamp-2">
                      {mod.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-line text-xs">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onNavigateToSyllabus?.(mod.id)}
                        className="px-2.5 py-1 rounded-lg bg-primary text-white font-semibold text-[11px] hover:bg-primary-dark transition-colors"
                      >
                        Study
                      </button>

                      <button
                        onClick={() => onNavigateToPractice?.(mod.title)}
                        className="px-2.5 py-1 rounded-lg bg-line hover:bg-line-strong text-ink-soft font-semibold text-[11px] transition-colors"
                      >
                        Practice
                      </button>
                    </div>

                    <button
                      onClick={(e) => handleDeleteModule(mod.id, e)}
                      className="p-1 text-muted-faint hover:text-danger-text transition-colors"
                      title="Delete module"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Blueprint-driven MCQ generation, mounted beside the topic ingestion flow */}
        <QuestionFactoryPanel
          existingStems={generatedResult?.questions.map((question) => question.stem) ?? []}
        />
      </div>

       {/* API Key Modal */}
       {showKeyModal && (
         <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
           <Card flush className="p-6 max-w-md w-full shadow-2xl flex flex-col gap-4">
             <div className="flex items-center gap-2">
               <Key className="w-5 h-5 text-primary" />
               <h3 className="text-base font-bold text-ink">Configure Google Gemini API Key</h3>
             </div>
             <p className="text-xs text-ink-soft leading-relaxed">
               (Optional) Enter your Gemini API key to allow dynamic real-time synthesis of custom topics. If left blank, the app will continue to use its built-in offline ESE Engineering Synthesis Model.
             </p>
             <input
               type="password"
               value={geminiApiKey}
               onChange={(e) => setGeminiApiKey(e.target.value)}
               placeholder="AIzaSy..."
               className="w-full h-10 px-3 rounded-lg border border-line-strong text-xs font-mono focus:border-primary focus:outline-none"
             />
             <div className="flex items-center justify-end gap-2 pt-2">
               <button
                 onClick={() => setShowKeyModal(false)}
                 className="px-4 py-2 rounded-lg text-xs font-semibold text-ink-soft hover:bg-subtle-strong"
               >
                 Cancel
               </button>
               <button
                 onClick={() => handleSaveApiKey(geminiApiKey)}
                 className="px-4 py-2 rounded-lg text-xs font-bold bg-primary hover:bg-primary-dark text-white shadow-xs"
               >
                 Save Key
               </button>
             </div>
           </Card>
         </div>
       )}

       {/* Ollama Local Model Modal */}
       {showOllamaModal && (
         <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
           <Card flush className="p-6 max-w-md w-full shadow-2xl flex flex-col gap-4">
             <div className="flex items-center gap-2">
               <Cpu className="w-5 h-5 text-success" />
               <h3 className="text-base font-bold text-ink">Configure Free Local Model (Ollama)</h3>
             </div>
             <div className="flex flex-col gap-2">
               <p className="text-xs text-ink-soft leading-relaxed">
                 Run a local LLM via Ollama for real-time synthesis with no API key and no cost. Highly recommended: <code className="px-1 py-0.5 bg-subtle rounded text-ink font-semibold">qwen2.5-coder:7b</code> (Q4_K_M quantization).
               </p>
               <div className="flex flex-wrap gap-1.5">
                 <span className="text-[11px] text-muted-faint self-center">Presets:</span>
                 <button
                   type="button"
                   onClick={() => setOllamaModel('qwen2.5-coder:7b')}
                   className="px-2 py-1 rounded-md text-[11px] font-semibold bg-primary-fixed text-primary border border-primary-fixed-dim hover:bg-primary-fixed-dim transition"
                 >
                   ⚡ Qwen2.5-Coder 7B (Q4_K_M)
                 </button>
                 <button
                   type="button"
                   onClick={() => setOllamaModel('llama3.1:8b')}
                   className="px-2 py-1 rounded-md text-[11px] font-medium bg-subtle text-ink-soft hover:bg-subtle-strong transition"
                 >
                   Llama 3.1 8B
                 </button>
               </div>
             </div>
             <input
               type="url"
               value={ollamaBaseUrl}
               onChange={(e) => setOllamaBaseUrl(e.target.value)}
               placeholder="http://127.0.0.1:11434"
               className="w-full h-10 px-3 rounded-lg border border-line-strong text-xs font-mono focus:border-success focus:outline-none"
             />
             <input
               type="text"
               value={ollamaModel}
               onChange={(e) => setOllamaModel(e.target.value)}
               placeholder="qwen2.5-coder:7b"
               className="w-full h-10 px-3 rounded-lg border border-line-strong text-xs font-mono focus:border-success focus:outline-none"
             />
             <div className="flex items-center justify-end gap-2 pt-2">
               <button
                 onClick={() => setShowOllamaModal(false)}
                 className="px-4 py-2 rounded-lg text-xs font-semibold text-ink-soft hover:bg-subtle-strong"
               >
                 Cancel
               </button>
               <button
                 onClick={() => handleSaveOllama(ollamaBaseUrl, ollamaModel)}
                 className="px-4 py-2 rounded-lg text-xs font-bold bg-success hover:bg-success/80 text-white shadow-xs"
               >
                 Save Local Config
               </button>
             </div>
           </Card>
         </div>
       )}
     </div>
   );
 };

export default AiIngestionStudioPage;
