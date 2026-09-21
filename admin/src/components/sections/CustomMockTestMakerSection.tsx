import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  Database,
  Layers,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Plus,
  Trash2,
  Edit2,
  Eye,
  Check,
  X,
  Search,
  BookOpen,
  Clock,
  ShieldCheck,
  Award,
  Globe,
  Shuffle,
  ChevronRight,
  Info
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  CustomMockMakerConfig,
  QuestionSourceMode,
  GenerationResult,
  QuestionQcReport,
  assembleCustomMockQuestions,
  finalizeAndPublishCustomMock,
  evaluateQuestionQc,
  getMasterQuestionPool
} from '@/services/adminMockMakerService';
import {
  getAllSyllabusBlueprints,
  getSyllabusBlueprintById,
  SyllabusBlueprint,
  SyllabusModule
} from '@/services/syllabusBlueprintService';
import { CIVIL_SUBJECTS, UNIVERSAL_EXAMS } from '@/services/universalTaxonomy';
import { MCQQuestion, MockTest } from '@/types';
import { useToast } from '@/context/ToastContext';
import { AdminSectionId } from '../AdminSidebar';

interface CustomMockTestMakerSectionProps {
  onNavigate: (section: AdminSectionId, payload?: any) => void;
  initialPayload?: any;
}

const PRESET_COUNTS = [10, 15, 25, 50, 100] as const;

export const CustomMockTestMakerSection: React.FC<CustomMockTestMakerSectionProps> = ({
  onNavigate,
  initialPayload
}) => {
  const { success: toastSuccess, error: toastError } = useToast();

  // Wizard Step: 1: Config, 2: Topics & Mode, 3: Generation & Review, 4: Assembled
  const [step, setStep] = useState<'config' | 'topics' | 'review' | 'success'>('config');

  // Maker Configuration State
  const [config, setConfig] = useState<CustomMockMakerConfig>({
    testTitle: 'APSC AE Civil Engineering Full Mock Exam',
    examId: 'apsc-ae-civil',
    branch: 'civil',
    subject: 'Strength of Materials',
    selectedTopics: ['Stress & Strain', 'Shear Force & Bending Moment'],
    customTopicInput: '',
    description: 'Comprehensive CBT mock test calibrated to APSC AE & UPSC ESE standards with full analytical solutions.',
    instructions: '1. Test duration is 120 minutes. 2. Each correct response carries 2 marks. 3. Penalty for incorrect response is -0.25 marks.',
    totalQuestionCount: 25,
    sourceMode: 'HYBRID',
    bankQuestionCount: 15,
    aiQuestionCount: 10,
    difficultyDistribution: {
      easyPercent: 20,
      mediumPercent: 50,
      hardPercent: 30
    },
    examLevel: 'State_PSC',
    durationMinutes: 60,
    marksPerQuestion: 2,
    negativeMarksPerQuestion: 0.5,
    randomizeQuestions: true,
    randomizeOptions: true,
    enableFactualGrounding: true,
    groundingSources: ['Testbook', 'Wikipedia Engineering Standards', 'IS 456 / IRC Codes']
  });

  // Working state during generation & review
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<string>('');
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  const [publishedTest, setPublishedTest] = useState<MockTest | null>(null);

  // Review screen selection and inline editing
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<Set<string>>(new Set());
  const [editingQuestion, setEditingQuestion] = useState<MCQQuestion | null>(null);
  const [topicSearch, setTopicSearch] = useState('');

  // Available topics from taxonomy for current subject
  const availableTaxonomyTopics = useMemo(() => {
    const matchedSubject = CIVIL_SUBJECTS.find(
      (s) => s.name.toLowerCase() === config.subject.toLowerCase()
    );
    if (!matchedSubject) return [];
    return matchedSubject.domains.flatMap((d) => d.topics.map((t) => t.name));
  }, [config.subject]);

  // Topic search filter
  const filteredTaxonomyTopics = useMemo(() => {
    if (!topicSearch.trim()) return availableTaxonomyTopics;
    return availableTaxonomyTopics.filter((t) =>
      t.toLowerCase().includes(topicSearch.toLowerCase())
    );
  }, [availableTaxonomyTopics, topicSearch]);

  const handleAddCustomTopic = () => {
    if (!config.customTopicInput?.trim()) return;
    const newTopic = config.customTopicInput.trim();
    if (!config.selectedTopics.includes(newTopic)) {
      setConfig((prev) => ({
        ...prev,
        selectedTopics: [...prev.selectedTopics, newTopic],
        customTopicInput: ''
      }));
      toastSuccess('Topic Added', `"${newTopic}" added to selected topics.`);
    }
  };

  // Blueprints State
  const [blueprints, setBlueprints] = useState<SyllabusBlueprint[]>(() => getAllSyllabusBlueprints());

  useEffect(() => {
    const handleUpdate = () => {
      setBlueprints(getAllSyllabusBlueprints());
    };
    window.addEventListener('exampilot_syllabi_updated', handleUpdate);
    return () => window.removeEventListener('exampilot_syllabi_updated', handleUpdate);
  }, []);

  const activeBlueprint = useMemo(() => {
    if (!config.syllabusBlueprintId) return null;
    return blueprints.find((b) => b.id === config.syllabusBlueprintId) || null;
  }, [config.syllabusBlueprintId, blueprints]);

  const applySyllabusBlueprint = (bp: SyllabusBlueprint) => {
    const allTopics = bp.modules.flatMap((m) => m.topics);
    setConfig((prev) => ({
      ...prev,
      testTitle: `${bp.title} — Official CBT Mock Exam`,
      examId: bp.id,
      branch: bp.branch,
      subject: `All ${bp.modules.length} Syllabus Modules`,
      selectedTopics: allTopics,
      durationMinutes: bp.durationMinutes,
      totalQuestionCount: bp.totalQuestions,
      marksPerQuestion: Number((bp.fullMarks / bp.totalQuestions).toFixed(2)),
      negativeMarksPerQuestion: bp.negativeMarksPerIncorrect,
      syllabusBlueprintId: bp.id,
      syllabusModules: bp.modules.map((m) => m.id),
      bankQuestionCount: Math.round(bp.totalQuestions * 0.6),
      aiQuestionCount: Math.round(bp.totalQuestions * 0.4),
      examLevel: 'State_PSC'
    }));
  };

  const clearSyllabusBlueprint = () => {
    setConfig((prev) => ({
      ...prev,
      testTitle: 'APSC AE Civil Engineering Full Mock Exam',
      examId: 'apsc-ae-civil',
      branch: 'civil',
      subject: 'Strength of Materials',
      selectedTopics: ['Stress & Strain', 'Shear Force & Bending Moment'],
      durationMinutes: 60,
      totalQuestionCount: 25,
      marksPerQuestion: 2,
      negativeMarksPerQuestion: 0.5,
      syllabusBlueprintId: undefined,
      syllabusModules: undefined,
      bankQuestionCount: 15,
      aiQuestionCount: 10
    }));
  };

  // Synchronize payload or default official syllabus
  useEffect(() => {
    const targetId = initialPayload?.syllabusId || 'apsc-phed-ae-civil-2025';
    const bp = getSyllabusBlueprintById(targetId);
    if (bp) {
      applySyllabusBlueprint(bp);
    }
  }, [initialPayload]);

  const handleToggleModule = (moduleId: string) => {
    if (!activeBlueprint) return;
    const mod = activeBlueprint.modules.find((m) => m.id === moduleId);
    if (!mod) return;

    const currentModules = config.syllabusModules || activeBlueprint.modules.map((m) => m.id);
    const isSelected = currentModules.includes(moduleId);
    let updatedModules: string[];
    let updatedTopics: string[];

    if (isSelected) {
      updatedModules = currentModules.filter((id) => id !== moduleId);
      const modTopicsSet = new Set(mod.topics);
      updatedTopics = config.selectedTopics.filter((t) => !modTopicsSet.has(t));
    } else {
      updatedModules = [...currentModules, moduleId];
      const newTopics = mod.topics.filter((t) => !config.selectedTopics.includes(t));
      updatedTopics = [...config.selectedTopics, ...newTopics];
    }

    setConfig((prev) => ({
      ...prev,
      syllabusModules: updatedModules,
      selectedTopics: updatedTopics
    }));
  };

  const handleSelectAllModules = () => {
    if (!activeBlueprint) return;
    const allModuleIds = activeBlueprint.modules.map((m) => m.id);
    const allTopics = activeBlueprint.modules.flatMap((m) => m.topics);
    setConfig((prev) => ({
      ...prev,
      syllabusModules: allModuleIds,
      selectedTopics: allTopics
    }));
  };

  const handleDeselectAllModules = () => {
    setConfig((prev) => ({
      ...prev,
      syllabusModules: [],
      selectedTopics: []
    }));
  };

  const handleToggleTopic = (topic: string) => {
    setConfig((prev) => {
      const exists = prev.selectedTopics.includes(topic);
      return {
        ...prev,
        selectedTopics: exists
          ? prev.selectedTopics.filter((t) => t !== topic)
          : [...prev.selectedTopics, topic]
      };
    });
  };

  // Generate / Query questions
  const handleStartGeneration = async () => {
    if (!config.testTitle.trim()) {
      toastError('Validation Error', 'Please enter a test title.');
      return;
    }
    if (config.selectedTopics.length === 0) {
      toastError('Validation Error', 'Please select or add at least one topic.');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress('Initializing question synthesis engine...');

    try {
      const result = await assembleCustomMockQuestions(config, (status) => {
        setGenerationProgress(status);
      });
      setGenerationResult(result);
      setSelectedQuestionIds(new Set(result.questions.map((q) => q.id)));
      setStep('review');
      toastSuccess(
        'Questions Ready for Review',
        `Assembled ${result.questions.length} MCQs (${result.bankCount} Bank + ${result.aiCount} AI). Overall QC Score: ${result.overallQualityScore}%.`
      );
    } catch (err: any) {
      console.error('Synthesis failed:', err);
      toastError('Generation Notice', err?.message || 'Failed to synthesize questions. Check AI settings or select Bank mode.');
    } finally {
      setIsGenerating(false);
      setGenerationProgress('');
    }
  };

  // Review Actions
  const handleToggleSelectQuestion = (id: string) => {
    setSelectedQuestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (!generationResult) return;
    if (selectedQuestionIds.size === generationResult.questions.length) {
      setSelectedQuestionIds(new Set());
    } else {
      setSelectedQuestionIds(new Set(generationResult.questions.map((q) => q.id)));
    }
  };

  const handleRemoveQuestion = (id: string) => {
    if (!generationResult) return;
    setGenerationResult((prev) => {
      if (!prev) return null;
      const updated = prev.questions.filter((q) => q.id !== id);
      const reports = { ...prev.qcReports };
      delete reports[id];
      return {
        ...prev,
        questions: updated,
        qcReports: reports
      };
    });
    setSelectedQuestionIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleSaveEditedQuestion = (updated: MCQQuestion) => {
    if (!generationResult) return;
    const pool = getMasterQuestionPool();
    const newReport = evaluateQuestionQc(updated, pool);

    setGenerationResult((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        questions: prev.questions.map((q) => (q.id === updated.id ? updated : q)),
        qcReports: {
          ...prev.qcReports,
          [updated.id]: newReport
        }
      };
    });
    setEditingQuestion(null);
    toastSuccess('Question Updated', 'Changes saved and QC re-evaluated.');
  };

  // Finalize & Publish
  const handleFinalizePublish = async () => {
    if (!generationResult) return;
    const approved = generationResult.questions.filter((q) => selectedQuestionIds.has(q.id));

    if (approved.length === 0) {
      toastError('No Questions Selected', 'Please approve at least one question to publish.');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress('Saving questions to Question Bank & publishing Mock Test...');

    try {
      const mockTest = await finalizeAndPublishCustomMock(config, approved, true);
      setPublishedTest(mockTest);
      setStep('success');
      toastSuccess('Mock Test Published!', `"${mockTest.title}" with ${approved.length} MCQs is now live on CBT.`);
    } catch (err: any) {
      toastError('Publish Failed', err?.message || 'Could not publish mock test.');
    } finally {
      setIsGenerating(false);
      setGenerationProgress('');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">
      {/* Step Indicator Header */}
      <div className="flex items-center justify-between gap-2 p-4 rounded-2xl bg-card border border-line shadow-xs">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap text-xs">
          <button
            onClick={() => setStep('config')}
            className={`flex items-center gap-1.5 font-semibold transition ${
              step === 'config' ? 'text-primary' : 'text-muted hover:text-ink'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center font-bold">1</span>
            <span>Configuration</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-muted-faint" />
          <button
            onClick={() => setStep('topics')}
            className={`flex items-center gap-1.5 font-semibold transition ${
              step === 'topics' ? 'text-primary' : 'text-muted hover:text-ink'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center font-bold">2</span>
            <span>Topics & Source Mode</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-muted-faint" />
          <button
            disabled={!generationResult}
            onClick={() => setStep('review')}
            className={`flex items-center gap-1.5 font-semibold transition ${
              step === 'review' ? 'text-primary' : 'text-muted hover:text-ink disabled:opacity-40'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center font-bold">3</span>
            <span>QC & Review</span>
          </button>
        </div>

        <Button size="sm" variant="outline" onClick={() => onNavigate('mock-tests')}>
          Back to Tests
        </Button>
      </div>

      {/* STEP 1: TEST METADATA & CONFIGURATION */}
      {step === 'config' && (
        <Card flush className="p-6 space-y-6">
          <div className="space-y-1">
            <h2 className="font-display font-bold text-base text-ink flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" />
              <span>Step 1: Exam Blueprint & Test Settings</span>
            </h2>
            <p className="text-xs text-muted">
              Configure name, target examination, question count, scoring scheme, and timing rules.
            </p>
          </div>

          {/* Syllabus Blueprint Preset Selector */}
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="font-bold text-xs text-ink">Official Examination Syllabus Blueprint</span>
                  <Badge variant="primary" className="text-[10px]">CBT Ingestion Ready</Badge>
                </div>
                <p className="text-[11px] text-muted">
                  Select an official exam blueprint to auto-calibrate modules, marks, timing (-0.25 negative), and question counts.
                </p>
              </div>
              <select
                value={config.syllabusBlueprintId || 'none'}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'none') {
                    clearSyllabusBlueprint();
                  } else {
                    const bp = blueprints.find((b) => b.id === val);
                    if (bp) applySyllabusBlueprint(bp);
                  }
                }}
                className="h-9 px-3 rounded-xl border border-primary/30 bg-surface text-xs font-semibold text-primary focus:outline-none"
              >
                <option value="none">-- Custom Ad-Hoc Test (Single Subject) --</option>
                {blueprints.map((bp) => (
                  <option key={bp.id} value={bp.id}>
                    {bp.isOfficial ? '★ ' : ''}{bp.title} ({bp.totalQuestions} MCQs · {bp.durationMinutes}m)
                  </option>
                ))}
              </select>
            </div>

            {activeBlueprint && (
              <div className="p-3.5 rounded-xl bg-surface/90 border border-line flex items-center justify-between flex-wrap gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-ink">{activeBlueprint.paper}</span>
                    <Badge variant="secondary" className="text-[10px] uppercase font-bold">{activeBlueprint.standard}</Badge>
                  </div>
                  <div className="text-[11px] text-muted flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-ink">{activeBlueprint.examAgency}</span>
                    <span>•</span>
                    <span>{activeBlueprint.advertNo || 'Official Standard'}</span>
                    <span>•</span>
                    <span className="text-primary font-semibold">{activeBlueprint.modules.length} Core Modules Calibrated</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="subtle" className="font-mono text-[11px] px-2.5 py-1">
                    {activeBlueprint.totalQuestions} MCQs | {activeBlueprint.durationMinutes} min
                  </Badge>
                  <Badge variant="outline" className="font-mono text-[11px] text-danger border-danger/30 px-2.5 py-1">
                    -{activeBlueprint.negativeMarksPerIncorrect} Neg
                  </Badge>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Test Title */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-ink">Mock Test Name *</label>
              <input
                type="text"
                value={config.testTitle}
                onChange={(e) => setConfig({ ...config, testTitle: e.target.value })}
                placeholder="e.g. APSC AE Civil Engineering Full Mock Exam"
                className="w-full h-10 px-3.5 rounded-xl border border-line bg-surface text-xs text-ink placeholder:text-muted-faint focus:border-primary focus:outline-none"
              />
            </div>

            {/* Target Exam */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink">Target Examination</label>
              <select
                value={config.examId}
                onChange={(e) => setConfig({ ...config, examId: e.target.value })}
                className="w-full h-10 px-3.5 rounded-xl border border-line bg-surface text-xs text-ink"
              >
                {UNIVERSAL_EXAMS.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.name} ({exam.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Branch */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink">Discipline / Branch</label>
              <select
                value={config.branch}
                onChange={(e) => setConfig({ ...config, branch: e.target.value as any })}
                className="w-full h-10 px-3.5 rounded-xl border border-line bg-surface text-xs text-ink"
              >
                <option value="civil">Civil Engineering</option>
                <option value="gs">General Studies & English</option>
                <option value="mechanical">Mechanical Engineering</option>
                <option value="electrical">Electrical Engineering</option>
                <option value="all">Multi-Disciplinary Combined</option>
              </select>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink">Primary Subject Domain</label>
              <select
                value={config.subject}
                onChange={(e) => setConfig({ ...config, subject: e.target.value, selectedTopics: [] })}
                className="w-full h-10 px-3.5 rounded-xl border border-line bg-surface text-xs text-ink"
              >
                {activeBlueprint && (
                  <option value={`All ${activeBlueprint.modules.length} Syllabus Modules`}>
                    All {activeBlueprint.modules.length} Syllabus Modules (Balanced Distribution)
                  </option>
                )}
                {CIVIL_SUBJECTS.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
                <option value="General Studies">General Studies & Polity</option>
                <option value="Assam GK & Heritage">Assam GK & Water Resources</option>
              </select>
            </div>

            {/* Intended Exam Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink">Calibrated Exam Level</label>
              <select
                value={config.examLevel}
                onChange={(e) => setConfig({ ...config, examLevel: e.target.value as any })}
                className="w-full h-10 px-3.5 rounded-xl border border-line bg-surface text-xs text-ink"
              >
                <option value="Basic">Basic Conceptual (Diploma / Sub-Engineer)</option>
                <option value="Intermediate">Intermediate (SSC JE / State JE)</option>
                <option value="State_PSC">State PSC (APSC AE / State Assistant Engineer)</option>
                <option value="UPSC_ESE">UPSC ESE / IES Technical Standard</option>
                <option value="GATE">GATE Conceptual / Analytical</option>
                <option value="Advanced">Advanced High-Yield Competitive</option>
              </select>
            </div>
          </div>

          {/* Question Count Selector (10, 15, 25, 50, 100) */}
          <div className="space-y-2 pt-2 border-t border-line">
            <label className="text-xs font-semibold text-ink">Total Question Count</label>
            <div className="flex items-center gap-2 flex-wrap">
              {PRESET_COUNTS.map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setConfig({
                    ...config,
                    totalQuestionCount: cnt,
                    bankQuestionCount: Math.round(cnt * 0.6),
                    aiQuestionCount: Math.round(cnt * 0.4)
                  })}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    config.totalQuestionCount === cnt
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-subtle text-muted hover:text-ink'
                  }`}
                >
                  {cnt} MCQs
                </button>
              ))}
              <div className="flex items-center gap-1 ml-2">
                <span className="text-xs text-muted">Custom:</span>
                <input
                  type="number"
                  min={5}
                  max={200}
                  value={config.totalQuestionCount}
                  onChange={(e) => setConfig({
                    ...config,
                    totalQuestionCount: Number(e.target.value) || 25,
                    bankQuestionCount: Math.round((Number(e.target.value) || 25) * 0.6),
                    aiQuestionCount: Math.round((Number(e.target.value) || 25) * 0.4)
                  })}
                  className="w-16 h-8 px-2 rounded-lg border border-line bg-surface text-xs text-ink font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Timing & Scoring Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-line">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted">Duration (Mins)</label>
              <input
                type="number"
                value={config.durationMinutes}
                onChange={(e) => setConfig({ ...config, durationMinutes: Number(e.target.value) || 60 })}
                className="w-full h-9 px-3 rounded-lg border border-line bg-surface text-xs text-ink font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted">Marks / MCQ</label>
              <input
                type="number"
                step="0.5"
                value={config.marksPerQuestion}
                onChange={(e) => setConfig({ ...config, marksPerQuestion: Number(e.target.value) || 2 })}
                className="w-full h-9 px-3 rounded-lg border border-line bg-surface text-xs text-ink font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted">Negative Penalty</label>
              <input
                type="number"
                step="0.25"
                value={config.negativeMarksPerQuestion}
                onChange={(e) => setConfig({ ...config, negativeMarksPerQuestion: Number(e.target.value) || 0.5 })}
                className="w-full h-9 px-3 rounded-lg border border-line bg-surface text-xs text-ink font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted">Total Marks</label>
              <div className="h-9 px-3 rounded-lg bg-subtle border border-line flex items-center font-mono font-bold text-primary text-xs">
                {config.totalQuestionCount * config.marksPerQuestion} Marks
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-line">
            <Button
              onClick={() => setStep('topics')}
              iconRight={<ChevronRight className="w-4 h-4" />}
            >
              Continue to Topics & Source Mode
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 2: TOPIC HIERARCHY & SOURCE MODE */}
      {step === 'topics' && (
        <Card flush className="p-6 space-y-6">
          <div className="space-y-1">
            <h2 className="font-display font-bold text-base text-ink flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span>Step 2: Topic Hierarchy & Question Source Selection</span>
            </h2>
            <p className="text-xs text-muted">
              Select specific syllabus subtopics or create custom ones, and choose Question Bank, AI Generated, or Hybrid split.
            </p>
          </div>

          {/* 3 Source Modes: Question Bank, AI, Hybrid */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink">Question Sourcing Mode</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  mode: 'QUESTION_BANK' as const,
                  title: 'Question Bank Only',
                  desc: 'Retrieve verified MCQs from existing static & custom database',
                  icon: Database
                },
                {
                  mode: 'AI_GENERATED' as const,
                  title: 'AI Generated Only',
                  desc: 'Synthesize completely new MCQs with factual grounding',
                  icon: Sparkles
                },
                {
                  mode: 'HYBRID' as const,
                  title: 'Hybrid Split (Recommended)',
                  desc: 'Combine existing bank questions with fresh AI generations',
                  icon: Layers
                }
              ].map((m) => {
                const Icon = m.icon;
                const isCur = config.sourceMode === m.mode;
                return (
                  <div
                    key={m.mode}
                    onClick={() => setConfig({ ...config, sourceMode: m.mode })}
                    className={`p-4 rounded-xl border cursor-pointer transition space-y-1.5 ${
                      isCur
                        ? 'border-primary bg-primary/5 shadow-2xs'
                        : 'border-line bg-surface hover:border-line-strong'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${isCur ? 'text-primary' : 'text-muted'}`} />
                        <span className="font-bold text-xs text-ink">{m.title}</span>
                      </div>
                      {isCur && <CheckCircle2 className="w-4 h-4 text-primary" />}
                    </div>
                    <p className="text-[11px] text-muted leading-relaxed">{m.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hybrid Split Sliders (if Hybrid Mode) */}
          {config.sourceMode === 'HYBRID' && (
            <div className="p-4 rounded-xl bg-subtle border border-line space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-ink">Hybrid Distribution:</span>
                <span className="font-mono text-primary font-bold">
                  {config.bankQuestionCount} Bank Questions + {config.aiQuestionCount} AI Generated = {config.totalQuestionCount} Total
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={config.totalQuestionCount - 1}
                value={config.bankQuestionCount}
                onChange={(e) => {
                  const bCount = Number(e.target.value);
                  setConfig({
                    ...config,
                    bankQuestionCount: bCount,
                    aiQuestionCount: config.totalQuestionCount - bCount
                  });
                }}
                className="w-full accent-primary"
              />
              <div className="flex items-center justify-between text-[10px] text-muted">
                <span>More from Question Bank ({config.bankQuestionCount})</span>
                <span>More from AI Engine ({config.aiQuestionCount})</span>
              </div>
            </div>
          )}

          {/* Difficulty Percentage Distribution */}
          <div className="p-4 rounded-xl bg-subtle border border-line space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-ink">Difficulty Distribution:</span>
              <span className="font-mono text-xs">
                <strong className="text-success">{config.difficultyDistribution.easyPercent}% Easy</strong> ·{' '}
                <strong className="text-warning">{config.difficultyDistribution.mediumPercent}% Medium</strong> ·{' '}
                <strong className="text-danger">{config.difficultyDistribution.hardPercent}% Hard</strong>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setConfig({
                  ...config,
                  difficultyDistribution: { easyPercent: 30, mediumPercent: 50, hardPercent: 20 }
                })}
                className="p-2 rounded-lg border border-line bg-surface text-xs hover:border-primary text-center font-medium"
              >
                Standard (30/50/20)
              </button>
              <button
                type="button"
                onClick={() => setConfig({
                  ...config,
                  difficultyDistribution: { easyPercent: 20, mediumPercent: 40, hardPercent: 40 }
                })}
                className="p-2 rounded-lg border border-line bg-surface text-xs hover:border-primary text-center font-medium"
              >
                UPSC / High Hard (20/40/40)
              </button>
              <button
                type="button"
                onClick={() => setConfig({
                  ...config,
                  difficultyDistribution: { easyPercent: 40, mediumPercent: 40, hardPercent: 20 }
                })}
                className="p-2 rounded-lg border border-line bg-surface text-xs hover:border-primary text-center font-medium"
              >
                Beginner Friendly (40/40/20)
              </button>
            </div>
          </div>

          {/* Syllabus Modules or Single-Subject Topic Browser */}
          {activeBlueprint ? (
            <div className="space-y-4 pt-2 border-t border-line">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-ink">
                      Official Syllabus Modules ({activeBlueprint.modules.length} Modules)
                    </label>
                    <Badge variant="primary" className="text-[10px]">
                      {(config.syllabusModules || []).length} of {activeBlueprint.modules.length} Selected
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted">
                    Toggle individual modules or topics. The question assembler distributes MCQs based on official weightings.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={handleSelectAllModules}>
                    Select All Modules
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleDeselectAllModules}>
                    Clear All
                  </Button>
                </div>
              </div>

              {/* Module Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {activeBlueprint.modules.map((mod) => {
                  const isModSelected = (config.syllabusModules || []).includes(mod.id);
                  const selectedInMod = mod.topics.filter((t) => config.selectedTopics.includes(t));
                  const weight = mod.suggestedWeight || Math.round(activeBlueprint.totalQuestions / activeBlueprint.modules.length);

                  return (
                    <div
                      key={mod.id}
                      className={`p-3.5 rounded-2xl border transition space-y-2.5 ${
                        isModSelected
                          ? 'border-primary/40 bg-card shadow-xs'
                          : 'border-line bg-surface/50 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <label className="flex items-start gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isModSelected}
                            onChange={() => handleToggleModule(mod.id)}
                            className="w-4 h-4 mt-0.5 rounded accent-primary cursor-pointer"
                          />
                          <div>
                            <div className="text-xs font-bold text-ink flex items-center gap-1.5">
                              <span>{mod.name}</span>
                            </div>
                            {mod.description && (
                              <p className="text-[10px] text-muted mt-0.5 leading-snug line-clamp-1">
                                {mod.description}
                              </p>
                            )}
                          </div>
                        </label>
                        <Badge variant={isModSelected ? 'primary' : 'subtle'} className="text-[10px] font-mono shrink-0">
                          {weight} MCQs ({Math.round((weight / activeBlueprint.totalQuestions) * 100)}%)
                        </Badge>
                      </div>

                      {/* Module Topics List */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {mod.topics.map((t) => {
                          const isTopicActive = config.selectedTopics.includes(t);
                          return (
                            <button
                              key={t}
                              type="button"
                              onClick={() => handleToggleTopic(t)}
                              className={`px-2 py-0.5 rounded-md text-[10px] transition text-left flex items-center gap-1 ${
                                isTopicActive
                                  ? 'bg-primary/15 text-primary font-medium border border-primary/20'
                                  : 'bg-subtle text-muted hover:text-ink'
                              }`}
                            >
                              {isTopicActive ? <Check className="w-2.5 h-2.5" /> : <Plus className="w-2.5 h-2.5" />}
                              <span className="truncate max-w-[240px]">{t}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-muted-faint pt-1 border-t border-line/60">
                        <span>{selectedInMod.length} of {mod.topics.length} topics active</span>
                        <span>Weight: {weight} / {activeBlueprint.totalQuestions}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Topic Hierarchy Browser for Generic Subject */
            <div className="space-y-3 pt-2 border-t border-line">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-semibold text-ink">
                    Select Topics from {config.subject} Hierarchy
                  </label>
                  <p className="text-[11px] text-muted">Click to toggle topics included in question generation.</p>
                </div>
                <span className="text-xs font-mono font-bold text-primary">
                  {config.selectedTopics.length} selected
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-muted" />
                  <input
                    type="text"
                    value={topicSearch}
                    onChange={(e) => setTopicSearch(e.target.value)}
                    placeholder="Filter syllabus topics..."
                    className="w-full h-8 pl-8 pr-3 rounded-lg border border-line bg-surface text-xs text-ink placeholder:text-muted-faint"
                  />
                </div>

                {/* Add Custom Topic Input */}
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={config.customTopicInput || ''}
                    onChange={(e) => setConfig({ ...config, customTopicInput: e.target.value })}
                    placeholder="Or enter new custom topic..."
                    className="h-8 px-3 rounded-lg border border-line bg-surface text-xs text-ink placeholder:text-muted-faint w-48"
                  />
                  <Button size="sm" variant="outline" onClick={handleAddCustomTopic} iconLeft={<Plus className="w-3.5 h-3.5" />}>
                    Add
                  </Button>
                </div>
              </div>

              {/* Topic Chips */}
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 rounded-xl border border-line bg-surface">
                {filteredTaxonomyTopics.length === 0 && config.selectedTopics.length === 0 ? (
                  <div className="text-xs text-muted py-2 px-3">No topics listed for this subject. Enter a custom topic above.</div>
                ) : (
                  filteredTaxonomyTopics.map((topic) => {
                    const isSelected = config.selectedTopics.includes(topic);
                    return (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => handleToggleTopic(topic)}
                        className={`px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-primary text-white font-semibold shadow-2xs'
                            : 'bg-subtle text-muted hover:text-ink hover:bg-subtle/80'
                        }`}
                      >
                        {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        <span>{topic}</span>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Selected Topics List */}
              {config.selectedTopics.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
                  <span className="text-[10px] uppercase font-bold text-muted-faint mr-1">Active Targets:</span>
                  {config.selectedTopics.map((topic) => (
                    <span
                      key={topic}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[11px] font-medium"
                    >
                      <span>{topic}</span>
                      <button onClick={() => handleToggleTopic(topic)} className="hover:text-danger">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Factual Grounding Setting */}
          <div className="p-3.5 rounded-xl border border-line bg-surface flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="font-semibold text-xs text-ink flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-primary" />
                <span>Factual Reference Grounding (Testbook / UPSC ESE / IS Codes)</span>
              </div>
              <p className="text-[11px] text-muted">
                Calibrates generated questions using authoritative educational curricula without copyright duplication.
              </p>
            </div>
            <input
              type="checkbox"
              checked={config.enableFactualGrounding}
              onChange={(e) => setConfig({ ...config, enableFactualGrounding: e.target.checked })}
              className="w-4 h-4 accent-primary rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-line">
            <Button variant="outline" onClick={() => setStep('config')}>
              Back to Config
            </Button>
            <Button
              onClick={handleStartGeneration}
              disabled={isGenerating}
              iconLeft={<Sparkles className="w-4 h-4" />}
            >
              {isGenerating ? 'Generating MCQs…' : `Assemble & Review ${config.totalQuestionCount} Questions`}
            </Button>
          </div>

          {/* Generation Progress Banner */}
          {isGenerating && (
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center space-y-2 animate-fadeIn">
              <RefreshCw className="w-5 h-5 text-primary animate-spin mx-auto" />
              <div className="text-xs font-bold text-ink">{generationProgress}</div>
              <div className="text-[11px] text-muted">Running AI quality checks and duplicate detection algorithms...</div>
            </div>
          )}
        </Card>
      )}

      {/* STEP 3: AI QUALITY CONTROL & QUESTION REVIEW SCREEN */}
      {step === 'review' && generationResult && (
        <div className="space-y-5 animate-fadeIn">
          {/* QC Quality Banner */}
          <Card flush className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-indigo-500/30 bg-gradient-to-r from-indigo-950/20 via-card to-card">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base text-ink">
                  Question Review & Automated Quality Control
                </h3>
                <Badge
                  tone={generationResult.overallQualityScore >= 80 ? 'success' : 'warning'}
                  size="sm"
                >
                  QC Score: {generationResult.overallQualityScore}%
                </Badge>
              </div>
              <p className="text-xs text-muted">
                Inspect every MCQ stem, options, answer key, and explanation. Edit inline or reject before publishing.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button size="sm" variant="outline" onClick={handleSelectAll}>
                {selectedQuestionIds.size === generationResult.questions.length ? 'Deselect All' : 'Approve All'}
              </Button>
              <Button
                size="sm"
                onClick={handleFinalizePublish}
                disabled={isGenerating || selectedQuestionIds.size === 0}
                iconLeft={<CheckCircle2 className="w-4 h-4" />}
              >
                {isGenerating ? 'Publishing…' : `Publish ${selectedQuestionIds.size} Approved MCQs`}
              </Button>
            </div>
          </Card>

          {/* Questions Review List */}
          <div className="space-y-3">
            {generationResult.questions.map((q, idx) => {
              const isSelected = selectedQuestionIds.has(q.id);
              const qc = generationResult.qcReports[q.id];

              return (
                <Card
                  key={q.id}
                  flush
                  className={`p-4 transition border ${
                    isSelected ? 'border-line' : 'border-line/40 opacity-70 bg-subtle/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectQuestion(q.id)}
                        className="w-4 h-4 mt-1 accent-primary rounded cursor-pointer flex-shrink-0"
                      />

                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap text-xs">
                          <span className="font-mono font-bold text-ink">Q{idx + 1}.</span>
                          <Badge size="sm" tone={q.sourceType === 'AI_GENERATED' ? 'brand' : 'accent'}>
                            {q.sourceType === 'AI_GENERATED' ? 'AI Synthesized' : 'Question Bank'}
                          </Badge>
                          <Badge size="sm" tone={q.difficulty === 'HARD' ? 'danger' : q.difficulty === 'MEDIUM' ? 'warning' : 'success'}>
                            {q.difficulty}
                          </Badge>
                          <span className="text-[11px] text-muted">{q.subject} · {q.topic}</span>
                        </div>

                        {/* Stem */}
                        <p className="text-xs font-medium text-ink leading-relaxed">
                          {q.stem}
                        </p>

                        {/* 4 Options Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {q.options.map((opt) => {
                            const isCorrect = opt.id === q.correctOption;
                            return (
                              <div
                                key={opt.id}
                                className={`p-2 rounded-lg text-xs border flex items-center gap-2 ${
                                  isCorrect
                                    ? 'bg-success-surface border-success-border text-success-text font-semibold'
                                    : 'bg-surface border-line text-muted'
                                }`}
                              >
                                <span className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] ${
                                  isCorrect ? 'bg-success text-white' : 'bg-subtle text-muted'
                                }`}>
                                  {opt.id}
                                </span>
                                <span className="truncate">{opt.text}</span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Explanation */}
                        <div className="p-2.5 rounded-lg bg-subtle border border-line text-[11px] text-muted space-y-0.5">
                          <div className="font-semibold text-ink">Solution & Explanation:</div>
                          <p>{q.explanation}</p>
                          {q.referenceSource && (
                            <div className="text-[10px] text-muted-faint pt-1">
                              Source: {q.referenceSource}
                            </div>
                          )}
                        </div>

                        {/* QC Issues alert if any */}
                        {qc && !qc.passed && (
                          <div className="p-2 rounded-lg bg-danger/10 border border-danger/20 text-[11px] text-danger-text space-y-1">
                            <div className="font-bold flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>QC Notice:</span>
                            </div>
                            <ul className="list-disc list-inside space-y-0.5 pl-1">
                              {qc.issues.map((iss, i) => (
                                <li key={i}>{iss}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Question Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => setEditingQuestion(q)}
                        className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-subtle transition"
                        title="Edit question text, options, and key"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRemoveQuestion(q.id)}
                        className="p-1.5 rounded-lg text-muted hover:text-danger-text hover:bg-danger/10 transition"
                        title="Reject & remove question from mock test"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 4: SUCCESS CONFIRMATION */}
      {step === 'success' && publishedTest && (
        <Card flush className="p-8 text-center space-y-4 max-w-xl mx-auto border-success/30">
          <div className="w-12 h-12 rounded-2xl bg-success/10 text-success flex items-center justify-center mx-auto shadow-md shadow-success/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="font-display font-bold text-xl text-ink">Mock Test Successfully Published!</h2>
            <p className="text-xs text-muted">
              "{publishedTest.title}" is now permanently published to Cloud Firestore & local catalog.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-subtle border border-line text-xs space-y-1 text-left">
            <div className="flex justify-between">
              <span className="text-muted">Total Questions:</span>
              <span className="font-bold text-ink">{publishedTest.sections[0]?.questions.length} MCQs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Time Limit:</span>
              <span className="font-bold text-ink">{publishedTest.durationMinutes} Minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Max Marks:</span>
              <span className="font-bold text-primary">{publishedTest.totalMarks} Marks</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Button size="sm" onClick={() => onNavigate('mock-tests')}>
              View All Mock Tests
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setStep('config');
                setGenerationResult(null);
                setPublishedTest(null);
              }}
            >
              Create Another Test
            </Button>
          </div>
        </Card>
      )}

      {/* Inline Question Editor Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-2xl rounded-2xl bg-card border border-line shadow-2xl p-6 my-8 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <h3 className="font-display font-bold text-base text-ink">Edit Question</h3>
              <button onClick={() => setEditingQuestion(null)} className="p-1 text-muted hover:text-ink">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-ink">Question Stem</label>
                <textarea
                  rows={3}
                  value={editingQuestion.stem}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, stem: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-line bg-surface text-ink text-xs focus:border-primary focus:outline-none"
                />
              </div>

              {/* Options */}
              <div className="space-y-2">
                <label className="font-semibold text-ink">Options & Correct Key</label>
                {editingQuestion.options.map((opt, oIdx) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingQuestion({ ...editingQuestion, correctOption: opt.id })}
                      className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center transition ${
                        editingQuestion.correctOption === opt.id
                          ? 'bg-success text-white'
                          : 'bg-subtle text-muted hover:bg-subtle/80'
                      }`}
                      title="Click to set as correct answer"
                    >
                      {opt.id}
                    </button>
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => {
                        const nextOptions = [...editingQuestion.options];
                        nextOptions[oIdx] = { ...opt, text: e.target.value };
                        setEditingQuestion({ ...editingQuestion, options: nextOptions });
                      }}
                      className="flex-1 h-8 px-2.5 rounded-lg border border-line bg-surface text-xs text-ink"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-ink">Explanation</label>
                <textarea
                  rows={2}
                  value={editingQuestion.explanation}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-line bg-surface text-ink text-xs focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-line">
              <Button size="sm" variant="outline" onClick={() => setEditingQuestion(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => handleSaveEditedQuestion(editingQuestion)}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
