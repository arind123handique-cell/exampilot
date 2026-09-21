import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Plus, Trash2, Copy, Save, PlayCircle, Database,
  CheckCircle2, X, AlertCircle, RefreshCw, Layers, CheckSquare,
  BookOpen, HelpCircle, ChevronDown, ChevronUp, Tag, AlertTriangle,
  Globe, Download, Code2, Table, FileText, Check, Zap, Settings, Bot
} from 'lucide-react';
import { MCQQuestion, MCQOption, QuestionKind } from '../../types';
import {
  generateAiQuestionsOnTopic,
  GeneratedQuestionItem,
  toMCQQuestion
} from '../../services/aiQuestionGeneratorService';
import {
  saveCustomQuestions,
  getCustomQuestions,
  deleteCustomQuestion
} from '../../services/customQuestionDb';
import {
  downloadSqlDumpFile,
  copySqlToClipboard,
  generateFullSqlDump
} from '../../services/sqlQuestionService';
import {
  getOpenCodeConfig,
  setOpenCodeConfig,
  testOpenCodeConnection,
  POPULAR_OPENCODE_MODELS
} from '../../services/opencodeService';
import { hasLiveAi, getSavedGeminiModel } from '../../services/geminiService';
import { GeminiKeyModal } from '../gemini/GeminiKeyModal';
import { useToast } from '../../context/ToastContext';

interface GoogleFormQuestionBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchTest: (questions: MCQQuestion[], testTitle: string) => void;
  userId?: string;
  initialTopic?: string;
}

const DEFAULT_BLANK_QUESTION: GeneratedQuestionItem = {
  id: '',
  stem: '',
  options: [
    { id: 'A', text: '' },
    { id: 'B', text: '' },
    { id: 'C', text: '' },
    { id: 'D', text: '' }
  ],
  correctOption: 'A',
  explanation: '',
  formulaContext: '',
  referenceSource: 'ExamVeda / Verified Online Source',
  difficulty: 'MEDIUM',
  questionType: 'CONCEPTUAL',
  topic: 'Civil Engineering',
  subject: 'Civil Engineering'
};

const QUICK_TOPIC_PILLS = [
  'Irrigation & Hydrology (Duty, Delta, Canal)',
  'CPM & PERT Floats',
  'Soil Consolidation & Seepage',
  'RCC IS 456 Shear & Flexure',
  'SOM Mohr Circle & Stresses',
  'Fluid Open Channel Flow'
];

export const GoogleFormQuestionBuilder: React.FC<GoogleFormQuestionBuilderProps> = ({
  isOpen,
  onClose,
  onLaunchTest,
  userId,
  initialTopic = ''
}) => {
  const { success: toastSuccess, error: toastError } = useToast();

  // Generator inputs
  const [topicInput, setTopicInput] = useState(initialTopic || 'Soil Mechanics');
  const [genCount, setGenCount] = useState<number>(5);
  const [genType, setGenType] = useState<'all' | 'STATEMENT_BASED' | 'NUMERICAL' | 'CONCEPTUAL'>('all');
  const [genDifficulty, setGenDifficulty] = useState<'MIXED' | 'EASY' | 'MEDIUM' | 'HARD'>('MIXED');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeGenMode, setActiveGenMode] = useState<'offline' | 'online'>('online');
  const [aiEngine, setAiEngine] = useState<'gemini' | 'opencode'>('gemini');
  const [progressMsg, setProgressMsg] = useState('');
  const [progressPercent, setProgressPercent] = useState<number>(0);

  // OpenCode Service configuration state
  const [showOpenCodeModal, setShowOpenCodeModal] = useState(false);
  const [openCodeBaseUrl, setOpenCodeBaseUrl] = useState(() => getOpenCodeConfig().baseUrl);
  const [openCodeModel, setOpenCodeModel] = useState(() => getOpenCodeConfig().model);
  const [openCodeApiKey, setOpenCodeApiKey] = useState(() => getOpenCodeConfig().apiKey);
  const [openCodeTesting, setOpenCodeTesting] = useState(false);
  const [openCodeTestResult, setOpenCodeTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  // Gemini Service configuration state
  const [showGeminiModal, setShowGeminiModal] = useState(false);
  const [currentGeminiModel, setCurrentGeminiModel] = useState(() => getSavedGeminiModel());

  // Form Questions State
  const [questions, setQuestions] = useState<GeneratedQuestionItem[]>([
    {
      ...DEFAULT_BLANK_QUESTION,
      id: `form-q-${Date.now()}-1`,
      stem: 'In Terzaghi one-dimensional consolidation theory, the time factor Tv is directly proportional to:\nStatement 1: Coefficient of consolidation cv and elapsed time t.\nStatement 2: Square of the drainage path length d².\nWhich of the above statements is/are correct?',
      options: [
        { id: 'A', text: '1 only' },
        { id: 'B', text: '2 only' },
        { id: 'C', text: 'Both 1 and 2' },
        { id: 'D', text: 'Neither 1 nor 2' }
      ],
      correctOption: 'A',
      explanation: 'The dimensionless time factor is given by Tv = (cv * t) / d². Thus, Tv is directly proportional to cv and t, and inversely proportional to d² (not directly proportional). Hence Statement 1 is correct and Statement 2 is incorrect.',
      formulaContext: 'T_v = (c_v · t) / d²',
      referenceSource: 'ExamVeda (Soil Mechanics & Foundation Engineering)',
      questionType: 'STATEMENT_BASED',
      topic: 'Soil Mechanics'
    }
  ]);

  // Database drawer state
  const [activeTab, setActiveTab] = useState<'builder' | 'database'>('builder');
  const [dbViewMode, setDbViewMode] = useState<'cards' | 'sql'>('cards');
  const [savedDbQuestions, setSavedDbQuestions] = useState<MCQQuestion[]>([]);
  const [dbSearch, setDbSearch] = useState('');
  const [loadingDb, setLoadingDb] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [highlightedIncompleteIdx, setHighlightedIncompleteIdx] = useState<number | null>(null);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [generationMode, setGenerationMode] = useState<'replace' | 'append'>('replace');

  // Sync initial topic
  useEffect(() => {
    if (initialTopic) setTopicInput(initialTopic);
  }, [initialTopic]);

  // Load database questions immediately on open and listen to live updates
  useEffect(() => {
    if (isOpen) {
      loadDatabaseQuestions();
    }

    const handleUpdate = () => {
      loadDatabaseQuestions();
    };

    window.addEventListener('exampilot_custom_questions_updated', handleUpdate);
    return () => {
      window.removeEventListener('exampilot_custom_questions_updated', handleUpdate);
    };
  }, [isOpen, userId]);

  // Also refresh database when switching to DB tab
  useEffect(() => {
    if (activeTab === 'database' && isOpen) {
      loadDatabaseQuestions();
    }
  }, [activeTab]);

  const loadDatabaseQuestions = async () => {
    setLoadingDb(true);
    try {
      const list = await getCustomQuestions(userId);
      setSavedDbQuestions(list || []);
    } catch (e) {
      console.warn('Failed to load DB questions:', e);
    } finally {
      setLoadingDb(false);
    }
  };

  if (!isOpen) return null;

  // ── OpenCode Connection & Config Handlers ─────────────────────────────────
  const handleTestOpenCode = async () => {
    setOpenCodeTesting(true);
    setOpenCodeTestResult(null);
    try {
      setOpenCodeConfig({
        baseUrl: openCodeBaseUrl,
        apiKey: openCodeApiKey,
        model: openCodeModel
      });
      const res = await testOpenCodeConnection();
      setOpenCodeTestResult({ ok: res.ok, message: res.message });
      if (res.ok) {
        toastSuccess('OpenCode Connected', res.message);
      } else {
        toastError('OpenCode Unreachable', res.message);
      }
    } catch (e: any) {
      setOpenCodeTestResult({ ok: false, message: e?.message || 'Connection test failed' });
      toastError('Connection Error', e?.message || 'Failed to connect');
    } finally {
      setOpenCodeTesting(false);
    }
  };

  const handleSaveOpenCodeSettings = () => {
    setOpenCodeConfig({
      baseUrl: openCodeBaseUrl,
      apiKey: openCodeApiKey,
      model: openCodeModel
    });
    toastSuccess('OpenCode Settings Saved', `Endpoint set to ${openCodeBaseUrl} with model ${openCodeModel}`);
    setShowOpenCodeModal(false);
  };

  // ── Generation Trigger: Offline Verified Bank vs Online AI Model ───────────
  const handleGenerateQuestions = async (mode: 'offline' | 'online' = 'online') => {
    if (!topicInput.trim()) {
      toastError('Topic Required', 'Please enter a topic for question generation.');
      return;
    }

    setActiveGenMode(mode);
    setIsGenerating(true);
    setProgressMsg(
      mode === 'offline'
        ? `Loading ${genCount} verified MCQs from ExamVeda & GATE bank...`
        : `Connecting to ${aiEngine === 'opencode' ? `OpenCode (${openCodeModel})` : 'Gemini 3.8 Flash'}...`
    );
    setProgressPercent(0);

    try {
      const result = await generateAiQuestionsOnTopic({
        topic: topicInput.trim(),
        count: genCount,
        questionType: genType,
        difficulty: genDifficulty,
        examContext: 'Civil Engineering Competitive Exams',
        sourceMode: mode,
        aiEngine: aiEngine,
        onProgress: (completed, total) => {
          setProgressMsg(
            mode === 'offline'
              ? `Extracting ${total} MCQs from verified bank (${completed}/${total})...`
              : `Sourcing ${total} MCQs via ${aiEngine === 'opencode' ? 'OpenCode' : 'Gemini 3.8'} (${completed}/${total} done)...`
          );
          setProgressPercent(Math.round((completed / total) * 100));
        }
      });

      if (result.questions.length > 0) {
        if (generationMode === 'replace') {
          // Discard previous questions and replace with fresh new questions
          setQuestions(result.questions);
          setHighlightedIncompleteIdx(null);
        } else {
          // Append mode
          setQuestions(prev => {
            const isInitialDefault =
              prev.length === 1 &&
              (prev[0].stem.includes('In Terzaghi one-dimensional consolidation theory') ||
                !prev[0].stem.trim());

            if (isInitialDefault) {
              return result.questions;
            }
            return [...prev, ...result.questions];
          });
        }

        // Smoothly scroll to the top card so the new questions are immediately in view
        setTimeout(() => {
          document.getElementById('form-card-0')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);

        if (mode === 'offline') {
          toastSuccess(
            generationMode === 'replace' ? 'Verified Offline MCQs Loaded' : 'Offline MCQs Added',
            `Loaded ${result.questions.length} questions on "${topicInput.trim()}" from ExamVeda & GATE bank ${
              generationMode === 'replace' ? '(previous discarded)' : ''
            }`
          );
        } else {
          toastSuccess(
            generationMode === 'replace' ? 'Online AI MCQs Sourced' : 'AI MCQs Added',
            `Generated ${result.questions.length} questions on "${topicInput.trim()}" using ${
              aiEngine === 'opencode' ? `OpenCode (${openCodeModel})` : 'Gemini 3.8 Flash'
            } ${generationMode === 'replace' ? '(previous discarded)' : ''}`
          );
        }
      } else {
        toastError('Generation Error', 'No questions could be generated. Please try again.');
      }
    } catch (err: any) {
      toastError(
        mode === 'offline' ? 'Offline Generation Error' : 'Online AI Generation Failed',
        err?.message || 'Error generating questions'
      );
    } finally {
      setIsGenerating(false);
      setProgressMsg('');
      setProgressPercent(0);
    }
  };

  // ── Card Manipulations ─────────────────────────────────────────────────────
  const handleUpdateStem = (index: number, text: string) => {
    setQuestions(prev => {
      const next = [...prev];
      next[index] = { ...next[index], stem: text };
      return next;
    });
    if (highlightedIncompleteIdx === index) {
      setHighlightedIncompleteIdx(null);
    }
  };

  const handleUpdateOption = (qIndex: number, optId: 'A' | 'B' | 'C' | 'D', text: string) => {
    setQuestions(prev => {
      const next = [...prev];
      const opts = next[qIndex].options.map(opt =>
        opt.id === optId ? { ...opt, text } : opt
      );
      next[qIndex] = { ...next[qIndex], options: opts };
      return next;
    });
  };

  const handleSelectCorrectOption = (qIndex: number, optId: 'A' | 'B' | 'C' | 'D') => {
    setQuestions(prev => {
      const next = [...prev];
      next[qIndex] = { ...next[qIndex], correctOption: optId };
      return next;
    });
  };

  const handleUpdateExplanation = (index: number, text: string) => {
    setQuestions(prev => {
      const next = [...prev];
      next[index] = { ...next[index], explanation: text };
      return next;
    });
  };

  const handleUpdateFormula = (index: number, text: string) => {
    setQuestions(prev => {
      const next = [...prev];
      next[index] = { ...next[index], formulaContext: text };
      return next;
    });
  };

  const handleUpdateReferenceSource = (index: number, text: string) => {
    setQuestions(prev => {
      const next = [...prev];
      next[index] = { ...next[index], referenceSource: text };
      return next;
    });
  };

  const handleUpdateType = (index: number, qType: QuestionKind) => {
    setQuestions(prev => {
      const next = [...prev];
      next[index] = { ...next[index], questionType: qType };
      return next;
    });
  };

  const handleUpdateDifficulty = (index: number, diff: 'EASY' | 'MEDIUM' | 'HARD') => {
    setQuestions(prev => {
      const next = [...prev];
      next[index] = { ...next[index], difficulty: diff };
      return next;
    });
  };

  const handleDuplicateQuestion = (index: number) => {
    const item = questions[index];
    const duplicated: GeneratedQuestionItem = {
      ...item,
      id: `form-q-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    };
    setQuestions(prev => {
      const next = [...prev];
      next.splice(index + 1, 0, duplicated);
      return next;
    });
    toastSuccess('Duplicated', `Question #${index + 1} copied.`);
  };

  const handleDeleteQuestion = (index: number) => {
    if (questions.length <= 1) {
      toastError('Cannot Delete', 'Form must contain at least 1 question.');
      return;
    }
    setQuestions(prev => prev.filter((_, i) => i !== index));
    if (highlightedIncompleteIdx === index) {
      setHighlightedIncompleteIdx(null);
    }
  };

  const handleAddBlankQuestion = () => {
    const newQ: GeneratedQuestionItem = {
      ...DEFAULT_BLANK_QUESTION,
      id: `form-q-${Date.now()}-${questions.length + 1}`,
      topic: topicInput.trim() || 'Custom Topic',
      referenceSource: 'Custom / Online Verified Bank'
    };
    setQuestions(prev => [...prev, newQ]);
    toastSuccess('Question Added', 'New blank Google Form card created at the bottom.');

    setTimeout(() => {
      const newIdx = questions.length;
      document.getElementById(`form-card-${newIdx}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleCleanBlankCards = () => {
    const nonBlank = questions.filter(q => {
      const hasStem = q.stem.trim().length > 0;
      const hasOpts = q.options.some(o => o.text.trim().length > 0);
      return hasStem || hasOpts;
    });

    if (nonBlank.length === 0) {
      toastError('Cannot Clean', 'All cards are empty. Please fill in at least one question.');
      return;
    }

    const removedCount = questions.length - nonBlank.length;
    setQuestions(nonBlank);
    toastSuccess('Cleaned', `Removed ${removedCount} completely blank card(s).`);
  };

  // ── Database & SQL Operations ──────────────────────────────────────────────
  const handleSaveToDatabase = async () => {
    const validQuestions = questions.filter(
      q => q.stem.trim().length > 0 && q.options.some(o => o.text.trim().length > 0)
    );

    if (validQuestions.length === 0) {
      toastError('Nothing to Save', 'Please fill in a question stem and options before saving.');
      return;
    }

    const incompleteIdx = questions.findIndex(q => {
      const hasStem = q.stem.trim().length > 0;
      const optsFilled = q.options.filter(o => o.text.trim().length > 0).length;
      return (hasStem && optsFilled < 2) || (!hasStem && optsFilled > 0);
    });

    if (incompleteIdx !== -1) {
      setHighlightedIncompleteIdx(incompleteIdx);
      const targetCard = document.getElementById(`form-card-${incompleteIdx}`);
      targetCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      toastError(
        `Question #${incompleteIdx + 1} Incomplete`,
        `Question #${incompleteIdx + 1} needs both a stem and at least 2 options before saving.`
      );
      return;
    }

    setIsSaving(true);
    try {
      const mcqList: MCQQuestion[] = validQuestions.map((q, idx) => toMCQQuestion(q, idx + 1));
      const result = await saveCustomQuestions(mcqList, userId);
      if (result.success) {
        toastSuccess(
          'Saved to Database',
          `Saved ${result.count} questions to Cloud Firestore & SQL Database!`
        );
        await loadDatabaseQuestions();
      }
    } catch (e: any) {
      toastError('Save Encountered an Error', e?.message || 'Could not complete save.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteFromDatabase = async (qId: string) => {
    try {
      await deleteCustomQuestion(qId, userId);
      setSavedDbQuestions(prev => prev.filter(q => q.id !== qId));
      toastSuccess('Deleted', 'Question removed from database.');
    } catch (e: any) {
      toastError('Delete Failed', e?.message || 'Could not delete question.');
    }
  };

  const handleImportQuestionFromDb = (item: MCQQuestion) => {
    const asGenItem: GeneratedQuestionItem = {
      id: item.id,
      stem: item.stem,
      options: item.options,
      correctOption: item.correctOption,
      explanation: item.explanation,
      formulaContext: item.formulaContext || '',
      referenceSource: item.referenceSource || 'ExamVeda / Verified Online Source',
      difficulty: item.difficulty,
      questionType: item.questionType || 'CONCEPTUAL',
      topic: item.topic,
      subject: item.subject
    };
    setQuestions(prev => [...prev, asGenItem]);
    toastSuccess('Imported', `Question added to your active form!`);
  };

  const handleDownloadSql = () => {
    if (savedDbQuestions.length === 0) {
      toastError('Empty Database', 'No saved questions in database to export.');
      return;
    }
    downloadSqlDumpFile(savedDbQuestions, topicInput);
    toastSuccess('SQL Downloaded', `Exported ${savedDbQuestions.length} questions to .sql file!`);
  };

  const handleCopySql = async () => {
    if (savedDbQuestions.length === 0) {
      toastError('Empty Database', 'No saved questions in database to export.');
      return;
    }
    const ok = await copySqlToClipboard(savedDbQuestions);
    if (ok) {
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2500);
      toastSuccess('SQL Copied', 'SQL schema & INSERT queries copied to clipboard!');
    }
  };

  // ── Launch Into Mock Test ──────────────────────────────────────────────────
  const handleLaunchTest = () => {
    const readyQuestions: GeneratedQuestionItem[] = [];
    const partiallyIncomplete: { index: number; reason: string }[] = [];
    let blankCardsCount = 0;

    questions.forEach((q, idx) => {
      const hasStem = q.stem.trim().length > 0;
      const filledOptions = q.options.filter(o => o.text.trim().length > 0);
      const isBlank = !hasStem && filledOptions.length === 0;

      if (isBlank) {
        blankCardsCount++;
      } else if (!hasStem) {
        partiallyIncomplete.push({
          index: idx,
          reason: `Question #${idx + 1} has options but is missing a question stem.`
        });
      } else if (filledOptions.length < 2) {
        partiallyIncomplete.push({
          index: idx,
          reason: `Question #${idx + 1} requires at least 2 non-empty options.`
        });
      } else {
        readyQuestions.push(q);
      }
    });

    if (partiallyIncomplete.length > 0) {
      const firstBad = partiallyIncomplete[0];
      setHighlightedIncompleteIdx(firstBad.index);
      document.getElementById(`form-card-${firstBad.index}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      toastError(`Question #${firstBad.index + 1} Incomplete`, firstBad.reason);
      return;
    }

    if (readyQuestions.length === 0) {
      toastError('No Questions Ready', 'Please complete at least 1 question before launching the test.');
      return;
    }

    const mcqList: MCQQuestion[] = readyQuestions.map((q, idx) => toMCQQuestion(q, idx + 1));
    const title = `${topicInput.trim() || 'Custom AI Form'} (${mcqList.length}Q)`;

    if (blankCardsCount > 0) {
      toastSuccess(
        'Launching Test',
        `Starting with ${readyQuestions.length} complete questions (${blankCardsCount} blank card(s) omitted).`
      );
    }

    onLaunchTest(mcqList, title);
    onClose();
  };

  // Card stats
  const readyCount = questions.filter(
    q => q.stem.trim().length > 0 && q.options.filter(o => o.text.trim().length > 0).length >= 2
  ).length;
  const blankCount = questions.filter(
    q => !q.stem.trim() && q.options.every(o => !o.text.trim())
  ).length;
  const incompleteCount = questions.length - readyCount - blankCount;

  const filteredDbQuestions = savedDbQuestions.filter(q =>
    q.stem.toLowerCase().includes(dbSearch.toLowerCase()) ||
    q.topic.toLowerCase().includes(dbSearch.toLowerCase()) ||
    q.explanation?.toLowerCase().includes(dbSearch.toLowerCase()) ||
    q.referenceSource?.toLowerCase().includes(dbSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative flex flex-col w-full max-w-4xl max-h-[92vh] bg-surface rounded-2xl shadow-2xl border border-line overflow-hidden"
      >
        {/* Google Form Top Decorative Colored Stripe */}
        <div className="h-3 w-full bg-gradient-to-r from-primary via-indigo-500 to-purple-600" />

        {/* Studio Navigation & Close Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-line bg-card">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-display font-bold text-ink flex items-center gap-2">
                <span>AI Question Studio &amp; Database</span>
                <span className="rounded-full bg-primary/15 text-primary text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide">
                  Google Form + SQL
                </span>
              </h2>
              <p className="text-xs text-muted">
                Source from verified online archives (ExamVeda, GATE, Sanfoundry), edit in Google Form cards, and save to SQL
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher Tabs */}
            <div className="flex rounded-lg border border-line bg-raised p-0.5">
              <button
                type="button"
                onClick={() => setActiveTab('builder')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition ${
                  activeTab === 'builder'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-muted hover:text-ink'
                }`}
              >
                <CheckSquare className="h-3.5 w-3.5" /> Form Builder ({questions.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('database')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition ${
                  activeTab === 'database'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-muted hover:text-ink'
                }`}
              >
                <Database className="h-3.5 w-3.5" /> Database SQL ({savedDbQuestions.length})
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-subtle transition"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab 1: Form Builder */}
        {activeTab === 'builder' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-surface/50">
            {/* Top Prompt Card: Local Bank & AI Engine Generation */}
            <div className="rounded-2xl border-2 border-primary/20 bg-gradient-to-b from-primary/5 to-transparent p-4 sm:p-5 space-y-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line/40 pb-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-ink">
                    Civil Question Generator
                  </span>
                  <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-muted">
                    <Globe className="h-3 w-3 text-blue-500" />
                    <span>ExamVeda · GATE · Sanfoundry · IndiaBIX</span>
                  </span>
                </div>

                {/* AI Model Selector & Settings */}
                <div className="flex items-center gap-1.5 bg-card border border-line rounded-xl px-2 py-1 shadow-2xs">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider">AI Engine:</span>
                  <select
                    value={aiEngine}
                    onChange={e => setAiEngine(e.target.value as 'gemini' | 'opencode')}
                    className="bg-transparent text-xs font-semibold text-ink border-none focus:outline-none cursor-pointer pr-1"
                  >
                    <option value="gemini">✨ Gemini ({currentGeminiModel})</option>
                    <option value="opencode">🤖 OpenCode Service</option>
                  </select>
                  {aiEngine === 'gemini' && (
                    <button
                      type="button"
                      onClick={() => setShowGeminiModal(true)}
                      className="p-1 rounded-lg text-primary hover:bg-primary/10 transition flex items-center gap-1"
                      title="Configure Gemini API Key & Model (e.g. gemini-3.5-flash-lite)"
                    >
                      <Settings className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-semibold text-primary hidden sm:inline">Config</span>
                    </button>
                  )}
                  {aiEngine === 'opencode' && (
                    <button
                      type="button"
                      onClick={() => setShowOpenCodeModal(true)}
                      className="p-1 rounded-lg text-primary hover:bg-primary/10 transition flex items-center gap-1"
                      title="Configure OpenCode endpoint, model & test connection"
                    >
                      <Settings className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-semibold text-primary hidden sm:inline">Config</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Topic input & options */}
              <div className="grid gap-3 sm:grid-cols-12">
                <div className="sm:col-span-6">
                  <label className="block text-[11px] font-semibold text-ink mb-1">
                    Specific Topic / Syllabus Area
                  </label>
                  <input
                    type="text"
                    value={topicInput}
                    onChange={e => setTopicInput(e.target.value)}
                    placeholder="e.g. CPM Network Crashing, Soil Permeability, RCC IS 456..."
                    className="w-full rounded-xl border border-line bg-card px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-ink mb-1">
                    Count
                  </label>
                  <select
                    value={genCount}
                    onChange={e => setGenCount(Number(e.target.value))}
                    className="w-full rounded-xl border border-line bg-card px-2.5 py-2 text-xs font-medium text-ink focus:border-primary focus:outline-none"
                  >
                    <option value={5}>5 MCQs</option>
                    <option value={10}>10 MCQs</option>
                    <option value={25}>25 MCQs</option>
                    <option value={50}>50 MCQs</option>
                    <option value={100}>100 MCQs (Full Mock)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-ink mb-1">
                    Format
                  </label>
                  <select
                    value={genType}
                    onChange={e => setGenType(e.target.value as any)}
                    className="w-full rounded-xl border border-line bg-card px-2.5 py-2 text-xs font-medium text-ink focus:border-primary focus:outline-none"
                  >
                    <option value="all">Balanced Mix</option>
                    <option value="STATEMENT_BASED">Statement 1 &amp; 2</option>
                    <option value="NUMERICAL">Numerical Problems</option>
                    <option value="CONCEPTUAL">Conceptual / Code</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-ink mb-1">
                    Difficulty
                  </label>
                  <select
                    value={genDifficulty}
                    onChange={e => setGenDifficulty(e.target.value as any)}
                    className="w-full rounded-xl border border-line bg-card px-2.5 py-2 text-xs font-medium text-ink focus:border-primary focus:outline-none"
                  >
                    <option value="MIXED">Mixed (UPSC/GATE)</option>
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>
              </div>

              {/* Quick Pills & Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-medium text-muted mr-1">Quick:</span>
                  {QUICK_TOPIC_PILLS.map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setTopicInput(p)}
                      className="rounded-lg border border-line bg-card px-2 py-0.5 text-[11px] text-ink-soft hover:border-primary hover:text-primary transition"
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Mode Selector: Discard & Replace vs Append */}
                  <div className="flex items-center rounded-xl border border-line bg-card p-0.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setGenerationMode('replace')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition ${
                        generationMode === 'replace'
                          ? 'bg-primary text-white font-bold shadow-xs'
                          : 'text-muted hover:text-ink'
                      }`}
                      title="Discard previous questions and load fresh new questions on click"
                    >
                      Discard &amp; Replace (Fresh)
                    </button>
                    <button
                      type="button"
                      onClick={() => setGenerationMode('append')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition ${
                        generationMode === 'append'
                          ? 'bg-primary text-white font-bold shadow-xs'
                          : 'text-muted hover:text-ink'
                      }`}
                      title="Keep previous questions and append newly generated ones"
                    >
                      + Append
                    </button>
                  </div>

                  {/* Two Buttons: Offline Generate & AI Model Generate (Online Only) */}
                  <button
                    type="button"
                    onClick={() => handleGenerateQuestions('offline')}
                    disabled={isGenerating}
                    className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 active:scale-[0.98] transition disabled:opacity-50 shadow-2xs"
                    title="Generate authentic, topic-isolated questions instantly from ExamVeda & GATE offline bank without internet"
                  >
                    {isGenerating && activeGenMode === 'offline' ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        <span>Loading Offline...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Offline Generate</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGenerateQuestions('online')}
                    disabled={isGenerating}
                    className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-primary-dark active:scale-[0.98] transition disabled:opacity-50"
                    title={`Generate online verified MCQs using ${aiEngine === 'opencode' ? `OpenCode (${openCodeModel})` : 'Gemini 3.8 Flash'}`}
                  >
                    {isGenerating && activeGenMode === 'online' ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        <span>{progressMsg || 'Sourcing from Online...'}</span>
                      </>
                    ) : (
                      <>
                        {aiEngine === 'opencode' ? <Bot className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
                        <span>AI Model Generate (Online Only)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Real-time Progress Bar for Batch Generation (especially 25, 50, 100 MCQs) */}
              {isGenerating && (
                <div className="space-y-1.5 pt-2 border-t border-line/60">
                  <div className="flex items-center justify-between text-xs font-semibold text-primary">
                    <span className="flex items-center gap-2">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      {progressMsg || `Generating ${genCount} MCQs with ${activeGenMode === 'offline' ? 'Offline Bank' : (aiEngine === 'opencode' ? `OpenCode (${openCodeModel})` : 'Gemini 3.8 Flash')}...`}
                    </span>
                    <span className="tabular-nums font-mono text-[11px]">{progressPercent}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-raised overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary via-indigo-500 to-purple-600 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: `${Math.max(progressPercent, 4)}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-[11px] text-muted">
                    {activeGenMode === 'offline'
                      ? 'Extracting verified questions strictly isolated to the chosen topic from local ExamVeda & GATE bank.'
                      : `Concurrently querying online sources via ${aiEngine === 'opencode' ? `OpenCode (${openCodeModel})` : 'Gemini 3.8 Flash'} with randomized seeds.`}
                  </p>
                </div>
              )}
            </div>

            {/* Questions List Header with Integrity Status */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink">
                  Interactive Form Questions ({questions.length})
                </h3>
                <span className="rounded-md bg-success-surface border border-success-border px-2 py-0.5 text-[10px] font-bold text-success-text">
                  {readyCount} Ready
                </span>
                {incompleteCount > 0 && (
                  <span className="rounded-md bg-danger-surface border border-danger-border px-2 py-0.5 text-[10px] font-bold text-danger-text animate-pulse">
                    {incompleteCount} Incomplete
                  </span>
                )}
                {blankCount > 0 && (
                  <span className="rounded-md bg-raised border border-line px-2 py-0.5 text-[10px] font-medium text-muted">
                    {blankCount} Blank
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {blankCount > 0 && (
                  <button
                    type="button"
                    onClick={handleCleanBlankCards}
                    className="text-xs font-medium text-muted hover:text-danger-text transition underline"
                  >
                    Remove {blankCount} blank card(s)
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleAddBlankQuestion}
                  className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Blank Card
                </button>
              </div>
            </div>

            {/* Questions List (Google Form Cards) */}
            <div className="space-y-5">
              {questions.map((q, qIndex) => {
                const isStemEmpty = !q.stem.trim();
                const filledOptionsCount = q.options.filter(o => o.text.trim().length > 0).length;
                const isCompletelyBlank = isStemEmpty && filledOptionsCount === 0;
                const isPartiallyIncomplete =
                  (isStemEmpty && filledOptionsCount > 0) || (!isStemEmpty && filledOptionsCount < 2);
                const isReady = !isStemEmpty && filledOptionsCount >= 2;
                const isHighlighted = highlightedIncompleteIdx === qIndex;

                return (
                  <div
                    key={q.id || qIndex}
                    id={`form-card-${qIndex}`}
                    className={`group relative rounded-2xl border-2 bg-card p-5 shadow-xs transition-all ${
                      isHighlighted
                        ? 'border-danger-border ring-2 ring-danger-border/30'
                        : isReady
                        ? 'border-line hover:border-primary/40 focus-within:border-primary'
                        : isCompletelyBlank
                        ? 'border-dashed border-line/80 opacity-80'
                        : 'border-warning-border/70'
                    }`}
                  >
                    {/* Google Form Card Top Bar */}
                    <div className="flex flex-wrap items-center justify-between border-b border-line/60 pb-3 mb-4 gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold text-white ${
                            isReady
                              ? 'bg-primary'
                              : isCompletelyBlank
                              ? 'bg-muted'
                              : 'bg-danger-text'
                          }`}
                        >
                          {qIndex + 1}
                        </span>

                        {/* Card Status Pill */}
                        {isReady && (
                          <span className="flex items-center gap-1 rounded-md bg-success-surface border border-success-border px-2 py-0.5 text-[10px] font-bold text-success-text">
                            <CheckCircle2 className="h-3 w-3" /> Ready
                          </span>
                        )}
                        {isCompletelyBlank && (
                          <span className="rounded-md bg-raised border border-line px-2 py-0.5 text-[10px] font-medium text-muted">
                            Blank Card
                          </span>
                        )}
                        {isPartiallyIncomplete && (
                          <span className="flex items-center gap-1 rounded-md bg-danger-surface border border-danger-border px-2 py-0.5 text-[10px] font-bold text-danger-text">
                            <AlertTriangle className="h-3 w-3" /> Incomplete
                          </span>
                        )}

                        {/* Online Verified Source Badge */}
                        <span className="flex items-center gap-1 rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                          <Globe className="h-3 w-3" />
                          <span className="truncate max-w-[170px]">
                            {q.referenceSource || 'ExamVeda / Verified Bank'}
                          </span>
                        </span>

                        <select
                          value={q.questionType}
                          onChange={e => handleUpdateType(qIndex, e.target.value as QuestionKind)}
                          className="rounded-lg border border-line bg-raised px-2 py-1 text-xs font-semibold text-ink focus:border-primary focus:outline-none"
                        >
                          <option value="STATEMENT_BASED">Statement 1 &amp; 2</option>
                          <option value="CONCEPTUAL">Conceptual</option>
                          <option value="NUMERICAL">Numerical</option>
                          <option value="ASSERTION_REASON">Assertion &amp; Reason</option>
                        </select>
                        <select
                          value={q.difficulty}
                          onChange={e => handleUpdateDifficulty(qIndex, e.target.value as any)}
                          className="rounded-lg border border-line bg-raised px-2 py-1 text-xs font-semibold text-muted focus:border-primary focus:outline-none"
                        >
                          <option value="EASY">Easy</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HARD">Hard</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleDuplicateQuestion(qIndex)}
                          className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-subtle transition"
                          title="Duplicate question"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion(qIndex)}
                          className="p-1.5 rounded-lg text-muted hover:text-danger-text hover:bg-danger-surface transition"
                          title="Delete question"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Alert for partially incomplete cards */}
                    {isPartiallyIncomplete && (
                      <div className="mb-3 rounded-lg bg-danger-surface border border-danger-border p-2.5 text-xs font-semibold text-danger-text flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                        <span>
                          {isStemEmpty
                            ? 'Please enter the Question Stem text below.'
                            : 'Please enter at least 2 multiple choice options below.'}
                        </span>
                      </div>
                    )}

                    {/* Question Stem Textarea */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-ink">
                          Question Stem
                        </label>
                        {isStemEmpty && !isCompletelyBlank && (
                          <span className="text-[10px] font-bold text-danger-text">
                            * Stem required
                          </span>
                        )}
                      </div>
                      <textarea
                        rows={3}
                        value={q.stem}
                        onChange={e => handleUpdateStem(qIndex, e.target.value)}
                        placeholder="Write problem statement, statements 1 & 2, or numerical given data..."
                        className={`w-full rounded-xl border bg-raised p-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 ${
                          isStemEmpty && !isCompletelyBlank
                            ? 'border-danger-border focus:ring-danger-border'
                            : 'border-line focus:border-primary focus:ring-primary'
                        }`}
                      />
                    </div>

                    {/* 4 Multiple Choice Options with Radio Buttons */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-ink">
                          Options <span className="text-muted font-normal">(click radio button to set correct answer)</span>
                        </label>
                        {filledOptionsCount < 2 && !isCompletelyBlank && (
                          <span className="text-[10px] font-bold text-danger-text">
                            * At least 2 options required
                          </span>
                        )}
                      </div>

                      {(['A', 'B', 'C', 'D'] as const).map(optId => {
                        const opt = q.options.find(o => o.id === optId) || { id: optId, text: '' };
                        const isCorrect = q.correctOption === optId;

                        return (
                          <div
                            key={optId}
                            className={`flex items-center gap-3 rounded-xl border px-3 py-2 transition-colors ${
                              isCorrect
                                ? 'border-success-border bg-success-surface/40'
                                : 'border-line bg-card hover:bg-raised'
                            }`}
                          >
                            {/* Radio Button for Correct Answer Key */}
                            <button
                              type="button"
                              onClick={() => handleSelectCorrectOption(qIndex, optId)}
                              className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition ${
                                isCorrect
                                  ? 'border-success-text bg-success-text text-white'
                                  : 'border-muted hover:border-primary'
                              }`}
                              title={`Mark Option ${optId} as correct answer`}
                            >
                              {isCorrect && <div className="h-2 w-2 rounded-full bg-white" />}
                            </button>

                            <span className={`w-5 text-xs font-bold ${isCorrect ? 'text-success-text' : 'text-muted'}`}>
                              {optId}.
                            </span>

                            <input
                              type="text"
                              value={opt.text}
                              onChange={e => handleUpdateOption(qIndex, optId, e.target.value)}
                              placeholder={`Option ${optId} text...`}
                              className="flex-1 bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
                            />

                            {isCorrect && (
                              <span className="flex items-center gap-1 rounded-md bg-success-surface border border-success-border px-2 py-0.5 text-[10px] font-bold text-success-text">
                                <CheckCircle2 className="h-3 w-3" /> Correct Key
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation, Formula & Verified Source */}
                    <div className="rounded-xl border border-line bg-subtle p-3 space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-semibold text-ink">
                        <span>Explanation &amp; Technical Rationale</span>
                        <span className="text-[10px] text-muted">Shown in test review</span>
                      </div>
                      <textarea
                        rows={2}
                        value={q.explanation}
                        onChange={e => handleUpdateExplanation(qIndex, e.target.value)}
                        placeholder="Explain why the selected option is correct, citing IS code or engineering formula..."
                        className="w-full rounded-lg border border-line bg-card p-2 text-xs text-ink placeholder:text-muted focus:border-primary focus:outline-none"
                      />
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-muted">Formula:</span>
                          <input
                            type="text"
                            value={q.formulaContext || ''}
                            onChange={e => handleUpdateFormula(qIndex, e.target.value)}
                            placeholder="e.g. TF = LST - EST; Tv = cv * t / d²"
                            className="flex-1 rounded-lg border border-line bg-card px-2 py-1 text-xs text-ink placeholder:text-muted focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-muted flex items-center gap-1">
                            <Globe className="h-3 w-3 text-blue-500" /> Source:
                          </span>
                          <input
                            type="text"
                            value={q.referenceSource || ''}
                            onChange={e => handleUpdateReferenceSource(qIndex, e.target.value)}
                            placeholder="e.g. ExamVeda (Soil Mechanics), GATE Civil, Sanfoundry..."
                            className="flex-1 rounded-lg border border-line bg-card px-2 py-1 text-xs text-ink placeholder:text-muted focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Add Question Button */}
            <button
              type="button"
              onClick={handleAddBlankQuestion}
              className="w-full rounded-2xl border-2 border-dashed border-line p-4 text-center text-xs font-semibold text-muted hover:border-primary hover:text-primary transition flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Another Question (Google Form Card)
            </button>
          </div>
        )}

        {/* Tab 2: Saved Questions Database (Cards & Relational SQL Views) */}
        {activeTab === 'database' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-surface/50">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                  <span>Question Database Bank (SQL &amp; Cloud)</span>
                  <span className="rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold px-2 py-0.5">
                    PostgreSQL / Supabase / SQLite
                  </span>
                </h3>
                <p className="text-xs text-muted">
                  Questions saved in Cloud Firestore &amp; SQL schema table
                </p>
              </div>

              {/* View Switcher: Cards vs SQL Table */}
              <div className="flex items-center gap-2">
                <div className="flex rounded-lg border border-line bg-raised p-0.5">
                  <button
                    type="button"
                    onClick={() => setDbViewMode('cards')}
                    className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                      dbViewMode === 'cards' ? 'bg-primary text-white shadow-xs' : 'text-muted hover:text-ink'
                    }`}
                  >
                    <Layers className="h-3 w-3" /> Cards
                  </button>
                  <button
                    type="button"
                    onClick={() => setDbViewMode('sql')}
                    className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                      dbViewMode === 'sql' ? 'bg-primary text-white shadow-xs' : 'text-muted hover:text-ink'
                    }`}
                  >
                    <Table className="h-3 w-3" /> SQL Table
                  </button>
                </div>

                <button
                  type="button"
                  onClick={loadDatabaseQuestions}
                  className="p-1.5 rounded-lg border border-line bg-card text-muted hover:text-ink transition"
                  title="Refresh Database"
                >
                  <RefreshCw className={`h-4 w-4 ${loadingDb ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* SQL Toolbar & Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-line bg-card p-3 shadow-xs">
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  value={dbSearch}
                  onChange={e => setDbSearch(e.target.value)}
                  placeholder="Filter by topic, stem, or verified source (e.g. ExamVeda, GATE)..."
                  className="w-full rounded-lg border border-line bg-raised px-3 py-1.5 text-xs text-ink placeholder:text-muted focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowSqlModal(true)}
                  disabled={savedDbQuestions.length === 0}
                  className="flex items-center gap-1.5 rounded-lg border border-line bg-raised px-3 py-1.5 text-xs font-semibold text-ink hover:border-primary hover:text-primary transition disabled:opacity-50"
                  title="View SQL DDL & INSERT statements"
                >
                  <Code2 className="h-3.5 w-3.5 text-indigo-500" /> View SQL DDL
                </button>

                <button
                  type="button"
                  onClick={handleCopySql}
                  disabled={savedDbQuestions.length === 0}
                  className="flex items-center gap-1.5 rounded-lg border border-line bg-raised px-3 py-1.5 text-xs font-semibold text-ink hover:border-primary hover:text-primary transition disabled:opacity-50"
                  title="Copy SQL INSERT queries to clipboard"
                >
                  {copiedSql ? <Check className="h-3.5 w-3.5 text-success-text" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedSql ? 'Copied SQL!' : 'Copy SQL'}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadSql}
                  disabled={savedDbQuestions.length === 0}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 text-xs font-bold shadow-xs transition disabled:opacity-50"
                  title="Download .sql file ready for PostgreSQL, MySQL, SQLite, or Supabase"
                >
                  <Download className="h-3.5 w-3.5" /> Download .sql Dump
                </button>
              </div>
            </div>

            {loadingDb ? (
              <div className="flex h-40 items-center justify-center">
                <RefreshCw className="h-6 w-6 text-primary animate-spin" />
              </div>
            ) : filteredDbQuestions.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line p-8 text-center">
                <Database className="h-8 w-8 text-muted mb-2" />
                <p className="text-sm font-semibold text-ink">No saved questions in database</p>
                <p className="text-xs text-muted mt-1 max-w-sm">
                  Generate questions in the Form Builder tab and click &quot;Save to Database&quot; to store them permanently in Firestore &amp; SQL database.
                </p>
              </div>
            ) : dbViewMode === 'sql' ? (
              /* SQL Relational Table View */
              <div className="rounded-xl border border-line bg-card overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-raised border-b border-line text-ink font-semibold">
                      <tr>
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Topic</th>
                        <th className="py-2.5 px-3">Question Stem</th>
                        <th className="py-2.5 px-3 text-center">Key</th>
                        <th className="py-2.5 px-3">Verified Source</th>
                        <th className="py-2.5 px-3">Difficulty</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {filteredDbQuestions.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-subtle/50 transition">
                          <td className="py-2 px-3 font-bold text-muted">{idx + 1}</td>
                          <td className="py-2 px-3 font-semibold text-primary truncate max-w-[120px]">
                            {item.topic}
                          </td>
                          <td className="py-2 px-3 text-ink max-w-[280px] truncate" title={item.stem}>
                            {item.stem}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <span className="rounded-md bg-success-surface border border-success-border px-1.5 py-0.5 font-bold text-success-text text-[11px]">
                              {item.correctOption}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-muted truncate max-w-[160px]">
                            <span className="flex items-center gap-1">
                              <Globe className="h-3 w-3 text-blue-500 flex-shrink-0" />
                              {item.referenceSource || 'ExamVeda / Verified Bank'}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-muted">{item.difficulty}</td>
                          <td className="py-2 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleImportQuestionFromDb(item)}
                                className="rounded-md bg-primary/10 hover:bg-primary/20 text-primary px-2 py-1 font-semibold text-[11px] transition"
                              >
                                + Add
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteFromDatabase(item.id)}
                                className="rounded-md p-1 text-muted hover:text-danger-text hover:bg-danger-surface transition"
                                title="Delete from SQL Database"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* Card View */
              <div className="space-y-3">
                {filteredDbQuestions.map((item, idx) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-line bg-card p-4 space-y-2 hover:border-primary/40 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10 text-primary text-[11px] font-bold">
                          {idx + 1}
                        </span>
                        <span className="rounded-md border border-line bg-raised px-2 py-0.5 text-[10px] font-semibold text-ink-soft">
                          {item.topic}
                        </span>
                        <span className="rounded-md border border-line bg-raised px-1.5 py-0.5 text-[10px] font-medium text-muted">
                          {item.difficulty}
                        </span>
                        <span className="rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {item.referenceSource || 'ExamVeda / Verified Bank'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleImportQuestionFromDb(item)}
                          className="flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary/20 transition"
                        >
                          <Plus className="h-3 w-3" /> Add to Active Form
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteFromDatabase(item.id)}
                          className="p-1 rounded-lg text-muted hover:text-danger-text hover:bg-danger-surface transition"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-ink leading-relaxed font-medium">
                      {item.stem}
                    </p>

                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      {item.options.map(opt => (
                        <div
                          key={opt.id}
                          className={`rounded-lg px-2 py-1 text-[11px] border ${
                            opt.id === item.correctOption
                              ? 'border-success-border bg-success-surface font-semibold text-success-text'
                              : 'border-line/60 text-muted'
                          }`}
                        >
                          <span className="font-bold">{opt.id}.</span> {opt.text}
                        </div>
                      ))}
                    </div>

                    {item.explanation && (
                      <p className="text-[11px] text-ink-soft bg-subtle rounded-lg p-2 leading-relaxed">
                        <span className="font-semibold text-ink">Explanation: </span>
                        {item.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Floating Bottom Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-card px-5 py-3.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveToDatabase}
              disabled={isSaving || readyCount === 0}
              className="flex items-center gap-1.5 rounded-xl border border-line bg-raised px-4 py-2 text-xs font-semibold text-ink hover:border-line-strong hover:bg-subtle transition disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5 text-primary" />
              {isSaving ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1" />
                  Saving to SQL &amp; Cloud...
                </>
              ) : (
                `Save to Database (${readyCount})`
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-line px-4 py-2 text-xs font-medium text-muted hover:text-ink transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleLaunchTest}
              disabled={readyCount === 0}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:opacity-95 transition disabled:opacity-50"
            >
              <PlayCircle className="h-4 w-4" />
              Start Mock Test with These Questions ({readyCount})
            </button>
          </div>
        </div>
      </motion.div>

      {/* SQL DDL & Query Preview Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-3xl bg-surface border border-line rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-line bg-card">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-indigo-500" />
                <h3 className="text-sm font-bold text-ink">SQL Database Schema &amp; INSERT Statements</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSqlModal(false)}
                className="p-1 rounded-lg text-muted hover:text-ink transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-black/90 text-green-400 font-mono text-xs leading-relaxed">
              <pre className="whitespace-pre-wrap">
                {generateFullSqlDump(savedDbQuestions)}
              </pre>
            </div>

            <div className="flex items-center justify-between px-5 py-3 border-t border-line bg-card">
              <span className="text-xs text-muted">
                {savedDbQuestions.length} records ready for PostgreSQL / Supabase / MySQL / SQLite
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="flex items-center gap-1.5 rounded-lg border border-line bg-raised px-3 py-1.5 text-xs font-semibold text-ink hover:border-primary transition"
                >
                  {copiedSql ? <Check className="h-3 w-3 text-success-text" /> : <Copy className="h-3 w-3" />}
                  {copiedSql ? 'Copied!' : 'Copy SQL'}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadSql}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 text-xs font-bold transition"
                >
                  <Download className="h-3 w-3" /> Download .sql
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OpenCode Service Settings Modal */}
      {showOpenCodeModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-surface border border-line rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-line bg-card">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink">OpenCode AI Service Settings</h3>
                  <p className="text-[11px] text-muted">Configure local/remote OpenAI-compatible LLM endpoints</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowOpenCodeModal(false)}
                className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-raised transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4 overflow-y-auto">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-ink-soft space-y-1">
                <p className="font-semibold text-primary flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" /> OpenCode Local &amp; Remote Integration
                </p>
                <p className="text-[11px] text-muted leading-relaxed">
                  Connect to your local OpenCode daemon, Ollama instance, vLLM server, or any OpenAI-compatible provider to generate high-quality Civil Engineering MCQs.
                </p>
              </div>

              {/* Endpoint Base URL */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-ink">
                  API Base URL
                </label>
                <input
                  type="text"
                  value={openCodeBaseUrl}
                  onChange={e => setOpenCodeBaseUrl(e.target.value)}
                  placeholder="http://localhost:4096/v1"
                  className="w-full rounded-xl border border-line bg-card px-3 py-2 text-xs font-mono text-ink placeholder:text-muted focus:border-primary focus:outline-none"
                />
                <p className="text-[10px] text-muted">
                  Default: <code className="text-primary font-mono">http://localhost:4096/v1</code> (Standard OpenCode daemon port)
                </p>
              </div>

              {/* Model Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-ink">
                  Model Name
                </label>
                <div className="flex gap-2">
                  <select
                    value={POPULAR_OPENCODE_MODELS.includes(openCodeModel) ? openCodeModel : 'custom'}
                    onChange={e => {
                      if (e.target.value !== 'custom') {
                        setOpenCodeModel(e.target.value);
                      }
                    }}
                    className="rounded-xl border border-line bg-card px-2.5 py-2 text-xs font-medium text-ink focus:border-primary focus:outline-none"
                  >
                    {POPULAR_OPENCODE_MODELS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                    <option value="custom">Custom Model Name...</option>
                  </select>

                  <input
                    type="text"
                    value={openCodeModel}
                    onChange={e => setOpenCodeModel(e.target.value)}
                    placeholder="Enter model identifier"
                    className="flex-1 rounded-xl border border-line bg-card px-3 py-2 text-xs font-mono text-ink placeholder:text-muted focus:border-primary focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-muted">
                  Supports Qwen 2.5 Coder, DeepSeek R1/V3, Claude 3.5 Sonnet, GPT-4o, or local Ollama tags.
                </p>
              </div>

              {/* API Key (Optional) */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-ink flex items-center justify-between">
                  <span>API Key</span>
                  <span className="text-[10px] font-normal text-muted">(Optional for local daemons)</span>
                </label>
                <input
                  type="password"
                  value={openCodeApiKey}
                  onChange={e => setOpenCodeApiKey(e.target.value)}
                  placeholder="Leave empty if local / no authorization header needed"
                  className="w-full rounded-xl border border-line bg-card px-3 py-2 text-xs font-mono text-ink placeholder:text-muted focus:border-primary focus:outline-none"
                />
              </div>

              {/* Connection Test Section */}
              <div className="pt-2 border-t border-line space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-ink">Diagnostics:</span>
                  <button
                    type="button"
                    onClick={handleTestOpenCode}
                    disabled={openCodeTesting}
                    className="flex items-center gap-1.5 rounded-lg border border-line bg-raised px-3 py-1.5 text-xs font-semibold text-ink hover:border-primary transition disabled:opacity-50"
                  >
                    {openCodeTesting ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin text-primary" />
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="h-3.5 w-3.5 text-amber-500" />
                        <span>Test Connection</span>
                      </>
                    )}
                  </button>
                </div>

                {openCodeTestResult && (
                  <div
                    className={`rounded-xl border p-2.5 text-xs flex items-start gap-2 ${
                      openCodeTestResult.ok
                        ? 'border-success-border bg-success-surface text-success-text'
                        : 'border-danger-border bg-danger-surface text-danger-text'
                    }`}
                  >
                    {openCodeTestResult.ok ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    )}
                    <span className="leading-snug">{openCodeTestResult.message}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-line bg-card">
              <button
                type="button"
                onClick={() => setShowOpenCodeModal(false)}
                className="rounded-xl border border-line bg-raised px-4 py-2 text-xs font-semibold text-ink hover:border-primary transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveOpenCodeSettings}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-primary-dark transition"
              >
                <Save className="h-3.5 w-3.5" />
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gemini API Key & Model Configuration Modal */}
      {showGeminiModal && (
        <GeminiKeyModal
          isOpen={showGeminiModal}
          onClose={() => setShowGeminiModal(false)}
          onKeySaved={() => setCurrentGeminiModel(getSavedGeminiModel())}
        />
      )}
    </div>
  );
};
