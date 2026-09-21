import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Building2,
  Layers,
  Mountain,
  Compass,
  Crown,
  MapPin,
  ShieldCheck,
  Droplets,
  Activity,
  Crosshair,
  Wrench,
  Briefcase,
  TrendingUp,
  Search,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Clock,
  Award,
  FileText,
  Flame,
  Bookmark,
  Send,
  Zap,
  CheckCircle,
  XCircle,
  Scale,
  FolderOpen,
  Folder,
  Sliders,
  Play
} from 'lucide-react';
import {
  TOPIC_KNOWLEDGE_MODULES,
  CIVIL_KNOWLEDGE_MODULES,
  GS_KNOWLEDGE_MODULES
} from '../data/topicKnowledge';
import { getCombinedModules } from '../services/aiKnowledgeStore';
import { getUserSyllabusProgress, saveUserSyllabusProgress } from '../services/firestore';
import { KnowledgeModule, TopicQuestion } from '../types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

interface SyllabusExplorerPageProps {
  onStartTopicPractice?: (topicTitle: string) => void;
  onAskTutorAboutTopic?: (topicTitle: string) => void;
  initialTopicId?: string;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Building2,
  Layers,
  Mountain,
  Compass,
  Crown,
  MapPin,
  ShieldCheck,
  Droplets,
  Activity,
  Crosshair,
  Wrench,
  Briefcase,
  TrendingUp,
  BookOpen
};

// Unit organization for Civil Engineering
const CIVIL_UNITS = [
  {
    name: 'Structural Engineering',
    moduleIds: ['civil-som', 'civil-rcc', 'civil-steel', 'civil-structural-analysis', 'civil-prestressed']
  },
  {
    name: 'Geotechnical Engineering',
    moduleIds: ['civil-geotech']
  },
  {
    name: 'Water Resources & Fluid Mechanics',
    moduleIds: ['civil-fluids', 'civil-hydrology-irrigation']
  },
  {
    name: 'Environmental Engineering',
    moduleIds: ['civil-env']
  },
  {
    name: 'Transportation Engineering',
    moduleIds: ['civil-transport']
  },
  {
    name: 'Surveying & Geomatics',
    moduleIds: ['civil-surveying']
  },
  {
    name: 'Construction Management & Building Materials',
    moduleIds: ['civil-bldg-materials', 'civil-cpm-pert', 'civil-estimating-costing']
  }
];

// Unit organization for General Studies
const GS_UNITS = [
  {
    name: 'Indian Polity & Governance',
    moduleIds: ['gs-polity']
  },
  {
    name: 'Assam History, Art & Culture',
    moduleIds: ['gs-assam-history']
  },
  {
    name: 'Geography of India & Assam',
    moduleIds: ['gs-assam-geography']
  },
  {
    name: 'Economy & Development',
    moduleIds: ['gs-economy']
  },
  {
    name: 'Indian & World History',
    moduleIds: ['gs-india-history']
  },
  {
    name: 'Science & Technology',
    moduleIds: ['gs-science']
  },
  {
    name: 'Quantitative Aptitude & Reasoning',
    moduleIds: ['gs-aptitude']
  }
];

export const SyllabusExplorerPage: React.FC<SyllabusExplorerPageProps> = ({
  onStartTopicPractice,
  onAskTutorAboutTopic,
  initialTopicId
}) => {
  const { user } = useAuth();
  const examId = user?.preferences?.examId || 'apsc-cce';
  const examName = user?.preferences?.examName || 'APSC CCE';
  const isCivilExam = examId.includes('civil') || examId.includes('gate-ce') || examId === 'apsc-cce';

  const [activePaper, setActivePaper] = useState<'civil' | 'gs'>(() => {
    if (initialTopicId) {
      const mod = TOPIC_KNOWLEDGE_MODULES.find((m) => m.id === initialTopicId);
      if (mod) return mod.category;
    }
    return isCivilExam ? 'civil' : 'gs';
  });
  const [selectedModuleId, setSelectedModuleId] = useState<string>(() => {
    if (initialTopicId) return initialTopicId;
    return isCivilExam ? 'civil-rcc' : 'gs-polity';
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'formulas' | 'callouts' | 'questions' | 'tutor'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'strong' | 'practice' | 'weak' | 'completed'>('all');
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);
  const { success: toastSuccess } = useToast();

  // User interactions: completions, answers, bookmarks
  const [completedModules, setCompletedModules] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('exampilot_completed_modules');
      return saved ? JSON.parse(saved) : { 'civil-som': true, 'gs-assam-geography': true, 'gs-polity': true };
    } catch {
      return {};
    }
  });

  const [bookmarkedModules, setBookmarkedModules] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('exampilot_bookmarked_modules');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [userAnswers, setUserAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({});
  const [customTutorQuery, setCustomTutorQuery] = useState('');

  // Load syllabus progress from Cloud Firestore
  useEffect(() => {
    if (!user?.uid) return;
    getUserSyllabusProgress(user.uid)
      .then(({ completedModules: loadedCompleted, bookmarkedModules: loadedBookmarked }) => {
        if (loadedCompleted && Object.keys(loadedCompleted).length > 0) {
          setCompletedModules(loadedCompleted);
        }
        if (loadedBookmarked && Object.keys(loadedBookmarked).length > 0) {
          setBookmarkedModules(loadedBookmarked);
        }
      })
      .catch((err) => {
        console.warn('Failed to load syllabus progress from Firestore:', err);
      });
  }, [user?.uid]);

  // Persist completions and bookmarks directly to Cloud Firestore
  useEffect(() => {
    if (!user?.uid) return;
    saveUserSyllabusProgress(user.uid, completedModules, bookmarkedModules);
  }, [completedModules, bookmarkedModules, user?.uid]);

  const [allModules, setAllModules] = useState<KnowledgeModule[]>(() => getCombinedModules());

  useEffect(() => {
    const handleUpdate = () => {
      setAllModules(getCombinedModules());
    };
    window.addEventListener('exampilot_learned_update', handleUpdate);
    return () => window.removeEventListener('exampilot_learned_update', handleUpdate);
  }, []);

  useEffect(() => {
    if (initialTopicId) {
      setSelectedModuleId(initialTopicId);
      const mod = allModules.find((m) => m.id === initialTopicId);
      if (mod) setActivePaper(mod.category);
    } else {
      const preferred = isCivilExam ? 'civil' : 'gs';
      setActivePaper(preferred);
      setSelectedModuleId(preferred === 'civil' ? 'civil-rcc' : 'gs-polity');
    }
  }, [initialTopicId, allModules, examId, isCivilExam]);

  const civilModules = useMemo(() => allModules.filter((m) => m.category === 'civil'), [allModules]);
  const gsModules = useMemo(() => allModules.filter((m) => m.category === 'gs'), [allModules]);

  const dynamicCivilUnits = useMemo(() => {
    const assignedIds = new Set(CIVIL_UNITS.flatMap((u) => u.moduleIds));
    const extraModules = civilModules.filter((m) => !assignedIds.has(m.id));
    if (extraModules.length === 0) return CIVIL_UNITS;

    return [
      {
        name: '✨ AI-Learned Advanced Modules',
        moduleIds: extraModules.map((m) => m.id)
      },
      ...CIVIL_UNITS
    ];
  }, [civilModules]);

  const dynamicGsUnits = useMemo(() => {
    const assignedIds = new Set(GS_UNITS.flatMap((u) => u.moduleIds));
    const extraModules = gsModules.filter((m) => !assignedIds.has(m.id));
    if (extraModules.length === 0) return GS_UNITS;

    return [
      {
        name: '✨ AI-Learned Advanced Modules',
        moduleIds: extraModules.map((m) => m.id)
      },
      ...GS_UNITS
    ];
  }, [gsModules]);

  // Current active module
  const activeModule: KnowledgeModule = useMemo(() => {
    const found = allModules.find((m) => m.id === selectedModuleId);
    if (found) return found;
    return activePaper === 'civil' ? civilModules[0] : gsModules[0];
  }, [selectedModuleId, activePaper, allModules, civilModules, gsModules]);

  // When paper changes, auto-switch active module if not in current paper
  const handlePaperSwitch = (paper: 'civil' | 'gs') => {
    setActivePaper(paper);
    if (paper === 'civil' && activeModule.category !== 'civil') {
      setSelectedModuleId('civil-rcc');
    } else if (paper === 'gs' && activeModule.category !== 'gs') {
      setSelectedModuleId('gs-polity');
    }
  };

  const handleSelectModule = (id: string) => {
    setSelectedModuleId(id);
    const mod = allModules.find((m) => m.id === id);
    if (mod) {
      setActivePaper(mod.category);
    }
  };

  // Toggle completion
  const handleToggleCompletion = (id: string) => {
    setCompletedModules((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Toggle bookmark
  const handleToggleBookmark = (id: string) => {
    const next = !bookmarkedModules[id];
    setBookmarkedModules((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
    toastSuccess(next ? 'Bookmarked' : 'Bookmark removed', allModules.find((m) => m.id === id)?.title);
  };

  // Copy formula
  const handleCopyFormula = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormula(text);
    toastSuccess('Formula copied', text.slice(0, 60));
    setTimeout(() => setCopiedFormula(null), 2200);
  };

  // Answer question
  const handleAnswerQuestion = (qId: string, opt: 'A' | 'B' | 'C' | 'D') => {
    setUserAnswers((prev) => ({ ...prev, [qId]: opt }));
    setExpandedSolutions((prev) => ({ ...prev, [qId]: true }));
  };

  // Filter modules based on search and status filter
  const matchesFilter = (m: KnowledgeModule) => {
    const isCompleted = !!completedModules[m.id];
    const status = m.masteredStatus || 'In Progress';

    if (statusFilter === 'completed' && !isCompleted) return false;
    if (statusFilter === 'strong' && status !== 'Mastered' && !isCompleted) return false;
    if (statusFilter === 'practice' && status !== 'Needs Practice' && status !== 'In Progress') return false;
    if (statusFilter === 'weak' && status !== 'Weak Area') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = m.title.toLowerCase().includes(q);
      const matchSub = m.subject.toLowerCase().includes(q);
      const matchClause = (m.codeClause || '').toLowerCase().includes(q);
      const matchUnit = (m.unitName || '').toLowerCase().includes(q);
      const matchSubtopics = (m.subtopicList || []).some((st) => st.toLowerCase().includes(q));
      return matchTitle || matchSub || matchClause || matchUnit || matchSubtopics;
    }
    return true;
  };

  // Overall readiness statistics
  const totalAllModules = allModules.length;
  const totalCompletedCount = Object.values(completedModules).filter(Boolean).length;
  const overallReadinessPercent = Math.round((totalCompletedCount / Math.max(1, totalAllModules)) * 100);

  // Paper readiness stats
  const civilCompleted = civilModules.filter((m) => completedModules[m.id]).length;
  const civilReadiness = Math.round((civilCompleted / Math.max(1, civilModules.length)) * 100);

  const gsCompleted = gsModules.filter((m) => completedModules[m.id]).length;
  const gsReadiness = Math.round((gsCompleted / Math.max(1, gsModules.length)) * 100);

  const isCurrentCompleted = !!completedModules[activeModule.id];
  const isCurrentBookmarked = !!bookmarkedModules[activeModule.id];
  const currentQuestions = activeModule.topicQuestions || [];

  return (
    <div className="flex flex-col w-full h-full bg-canvas text-ink overflow-y-auto">
      {/* ---------------- Section 1: Module Control Bar & Master Metric Header ---------------- */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-5 bg-card border-b border-line shadow-sm">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-4">
          {/* Top Row: Title, Target Exam & Master Metric Pill */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shadow-sm">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold font-display text-ink tracking-tight">
                    Syllabus Explorer
                  </h1>
                  <Badge tone="brand" size="md" caps={false}>
                    {examName} • Syllabus Matrix
                  </Badge>
                </div>
                <p className="text-xs text-muted mt-0.5">
                  Standardized Curricular Matrix • {examName} Syllabus & Topic Breakdown
                </p>
              </div>
            </div>

            {/* Master Metric Pill */}
            <div className="flex items-center gap-4 bg-subtle border border-line px-4 py-2.5 rounded-xl shadow-xs">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Overall Readiness</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">{overallReadinessPercent}%</span>
                  <span className="text-xs text-muted">
                    ({totalCompletedCount} of {totalAllModules} modules mastered)
                  </span>
                </div>
              </div>
              <div className="w-32 h-2.5 rounded-full bg-line overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallReadinessPercent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>

          {/* Bottom Row: Search Bar & Segment Filter Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="relative flex-1 min-w-[280px] max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-faint w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, codes (e.g. IS 456, Indian Polity, Surveying)..."
                className="w-full bg-subtle-strong hover:bg-subtle focus:bg-card rounded-lg pl-9 pr-4 py-2 text-xs text-ink placeholder:text-muted-faint border border-transparent focus:border-primary-fixed-dim focus:outline-none transition-all shadow-xs"
              />
            </div>

            {/* Metric Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                  statusFilter === 'all'
                    ? 'bg-inverse text-white'
                    : 'bg-subtle-strong text-ink-soft hover:bg-line'
                }`}
              >
                <span>All</span>
                <span className="font-mono text-[10px] opacity-80">{totalAllModules}</span>
              </button>

              <button
                onClick={() => setStatusFilter('strong')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  statusFilter === 'strong'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-subtle-strong text-ink-soft hover:bg-line'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-success"></span>
                <span>Strong</span>
                <span className="font-mono text-[10px] opacity-75">8</span>
              </button>

              <button
                onClick={() => setStatusFilter('practice')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  statusFilter === 'practice'
                    ? 'bg-primary-dark text-white shadow-xs'
                    : 'bg-subtle-strong text-ink-soft hover:bg-line'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-primary-light"></span>
                <span>Needs Practice</span>
                <span className="font-mono text-[10px] opacity-75">9</span>
              </button>

              <button
                onClick={() => setStatusFilter('weak')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  statusFilter === 'weak'
                    ? 'bg-rose-700 text-white shadow-xs'
                    : 'bg-subtle-strong text-ink-soft hover:bg-line'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-danger"></span>
                <span>Weak Areas</span>
                <span className="font-mono text-[10px] opacity-75">4</span>
              </button>

              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  statusFilter === 'completed'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-subtle-strong text-ink-soft hover:bg-line'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Completed</span>
                <span className="font-mono text-[10px] opacity-75">{totalCompletedCount}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Section 2: Master-Detail Split Workspace ---------------- */}
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ================= LEFT COLUMN: Syllabus Hierarchy Tree (35% -> col-span-4) ================= */}
          {/* ================= LEFT COLUMN: Syllabus Hierarchy Tree (35% -> col-span-4) ================= */}
          <aside className="lg:col-span-4 flex flex-col gap-4">
            {(() => {
              const civilCard = (
                <Card flush className="p-4" key="civil-card">
                  <div
                    onClick={() => handlePaperSwitch('civil')}
                    className="flex items-center justify-between pb-3 cursor-pointer border-b border-line"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                        <Building2 className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-ink block leading-tight">
                          {isCivilExam ? 'Civil Engineering' : 'Specialized / Technical Modules'}
                        </span>
                        <span className="text-[11px] text-muted font-medium">
                          {isCivilExam ? 'Paper II' : 'Elective Track'} • {civilModules.length} Modules
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-ink-soft">{civilReadiness}%</span>
                      <div className="w-12 h-1.5 rounded-full bg-line overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${civilReadiness}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Civil Units Stack */}
                  <div className="mt-3 flex flex-col gap-2">
                    {dynamicCivilUnits.map((unit) => {
                      const unitModules = civilModules.filter((m) => unit.moduleIds.includes(m.id) && matchesFilter(m));
                      if (unitModules.length === 0) return null;

                      return (
                        <div key={unit.name} className="flex flex-col gap-1">
                          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-subtle text-ink text-xs font-semibold">
                            <div className="flex items-center gap-1.5 truncate">
                              <FolderOpen className="w-3.5 h-3.5 text-muted-faint flex-shrink-0" />
                              <span className="truncate">{unit.name}</span>
                            </div>
                            <span className="font-mono text-[10px] text-muted-faint ml-1">
                              {unitModules.length} {unitModules.length === 1 ? 'Module' : 'Modules'}
                            </span>
                          </div>

                          {/* Sub-branches */}
                          <div className="pl-3 ml-2 flex flex-col gap-1 border-l-2 border-line">
                            {unitModules.map((mod) => {
                              const isSelected = mod.id === activeModule.id;
                              const isDone = !!completedModules[mod.id];
                              const confidence = mod.confidencePercent || 60;
                              const qCount = (mod.topicQuestions || []).length;

                              return (
                                <div
                                  key={mod.id}
                                  onClick={() => handleSelectModule(mod.id)}
                                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                                    isSelected
                                      ? 'bg-primary text-white shadow-sm font-medium'
                                      : 'hover:bg-subtle-strong text-ink-soft'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    {isDone ? (
                                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-emerald-200' : 'text-success-text'}`} />
                                    ) : (
                                      <div
                                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                          mod.masteredStatus === 'Weak Area'
                                            ? 'bg-danger'
                                            : mod.masteredStatus === 'Mastered'
                                            ? 'bg-success'
                                            : 'bg-indigo-400'
                                        }`}
                                      />
                                    )}
                                    <div className="flex flex-col min-w-0">
                                      <span className={`text-xs truncate leading-tight ${isSelected ? 'text-white font-semibold' : 'text-ink'}`}>
                                        {mod.title.split(':')[0]}
                                      </span>
                                      <span className={`text-[10px] truncate ${isSelected ? 'text-indigo-100' : 'text-muted-faint'}`}>
                                        {qCount} MCQs Available
                                      </span>
                                    </div>
                                  </div>
                                  <span
                                    className={`px-1.5 py-0.5 rounded font-mono text-[10px] flex-shrink-0 ${
                                      isSelected
                                        ? 'bg-white/20 text-white font-bold'
                                        : 'bg-subtle-strong text-ink-soft'
                                    }`}
                                  >
                                    {confidence}%
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              );

              const gsCard = (
                <Card flush className="p-4" key="gs-card">
                  <div
                    onClick={() => handlePaperSwitch('gs')}
                    className="flex items-center justify-between pb-3 cursor-pointer border-b border-line"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-success-surface flex items-center justify-center text-success-text">
                        <Crown className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-ink block leading-tight">
                          {isCivilExam ? 'General Studies' : `${examName} Core Curriculum`}
                        </span>
                        <span className="text-[11px] text-muted font-medium">
                          {isCivilExam ? 'Paper I' : 'Core Track'} • {gsModules.length} Modules
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-ink-soft">{gsReadiness}%</span>
                      <div className="w-12 h-1.5 rounded-full bg-line overflow-hidden">
                        <div className="h-full bg-success rounded-full" style={{ width: `${gsReadiness}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* GS Units Stack */}
                  <div className="mt-3 flex flex-col gap-2">
                    {dynamicGsUnits.map((unit) => {
                      const unitModules = gsModules.filter((m) => unit.moduleIds.includes(m.id) && matchesFilter(m));
                      if (unitModules.length === 0) return null;

                      return (
                        <div key={unit.name} className="flex flex-col gap-1">
                          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-subtle text-ink text-xs font-semibold">
                            <div className="flex items-center gap-1.5 truncate">
                              <FolderOpen className="w-3.5 h-3.5 text-muted-faint flex-shrink-0" />
                              <span className="truncate">{unit.name}</span>
                            </div>
                            <span className="font-mono text-[10px] text-muted-faint ml-1">{unitModules.length} Modules</span>
                          </div>

                          {/* Sub-branches */}
                          <div className="pl-3 ml-2 flex flex-col gap-1 border-l-2 border-line">
                            {unitModules.map((mod) => {
                              const isSelected = mod.id === activeModule.id;
                              const isDone = !!completedModules[mod.id];
                              const confidence = mod.confidencePercent || 60;
                              const qCount = (mod.topicQuestions || []).length;

                              return (
                                <div
                                  key={mod.id}
                                  onClick={() => handleSelectModule(mod.id)}
                                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                                    isSelected
                                      ? 'bg-emerald-700 text-white shadow-sm font-medium'
                                      : 'hover:bg-subtle-strong text-ink-soft'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    {isDone ? (
                                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-emerald-200' : 'text-success-text'}`} />
                                    ) : (
                                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isSelected ? 'bg-card' : 'bg-success'}`} />
                                    )}
                                    <div className="flex flex-col min-w-0">
                                      <span className={`text-xs truncate leading-tight ${isSelected ? 'text-white font-semibold' : 'text-ink'}`}>
                                        {mod.title.split(':')[0]}
                                      </span>
                                      <span className={`text-[10px] truncate ${isSelected ? 'text-emerald-100' : 'text-muted-faint'}`}>
                                        {qCount} MCQs Available
                                      </span>
                                    </div>
                                  </div>
                                  <span
                                    className={`px-1.5 py-0.5 rounded font-mono text-[10px] flex-shrink-0 ${
                                      isSelected
                                        ? 'bg-white/20 text-white font-bold'
                                        : 'bg-subtle-strong text-ink-soft'
                                    }`}
                                  >
                                    {confidence}%
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              );

              return isCivilExam ? (
                <>
                  {civilCard}
                  {gsCard}
                </>
              ) : (
                <>
                  {gsCard}
                  {civilCard}
                </>
              );
            })()}

            {/* Revision Matrix Fast Stat Card */}
            <div className="bg-subtle rounded-xl p-4 border border-line shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Target Metric</span>
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div className="text-sm font-bold text-ink">18 Days to Revision Cycle</div>
              <p className="text-xs text-muted leading-relaxed">
                {examName} preparation analytics prioritizes core foundation units and high-frequency syllabus areas for maximum competitive advantage.
              </p>
            </div>
          </aside>

          {/* ================= RIGHT COLUMN: Active Topic Study Detail (65% -> col-span-8) ================= */}
          <main className="lg:col-span-8 flex flex-col gap-5">
            {/* Header & Breadcrumbs Card */}
            <Card flush className="p-5 sm:p-6 flex flex-col gap-4 relative overflow-hidden">
              {/* Decorative ambient corner glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-fixed rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

              {/* Navigational Breadcrumbs Trail */}
              <div className="flex items-center gap-2 text-muted text-xs font-medium flex-wrap">
                <span className="hover:text-ink transition-colors cursor-pointer" onClick={() => handlePaperSwitch(activeModule.category)}>
                  {activeModule.category === 'civil'
                    ? (isCivilExam ? 'Civil Engineering (Paper II)' : 'Technical Modules')
                    : (isCivilExam ? 'General Studies (Paper I)' : 'Core Curriculum')}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-muted-faint" />
                <span className="hover:text-ink transition-colors">{activeModule.unitName || activeModule.subject}</span>
                <ChevronRight className="w-3.5 h-3.5 text-muted-faint" />
                <span className="text-primary font-bold">{activeModule.title.split(':')[0]}</span>
              </div>

              {/* Main Title & Bookmark Action */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex flex-col gap-1 max-w-2xl">
                  <h1 className="text-2xl font-bold font-display text-ink tracking-tight">
                    {activeModule.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
                    {activeModule.summary}
                  </p>
                </div>

                <button
                  onClick={() => handleToggleBookmark(activeModule.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all shadow-xs ${
                    isCurrentBookmarked
                      ? 'bg-warning-surface text-warning-text border-warning-border'
                      : 'bg-subtle hover:bg-subtle-strong text-ink-soft border-line'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isCurrentBookmarked ? 'fill-warning text-warning-text' : 'text-muted'}`} />
                  <span>{isCurrentBookmarked ? 'Bookmarked' : 'Save Reference'}</span>
                </button>
              </div>

              {/* Context Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="px-2.5 py-1 rounded-full bg-danger-surface text-danger-text text-[11px] font-semibold flex items-center gap-1 border border-danger-border">
                  <Flame className="w-3.5 h-3.5 text-danger-text" />
                  <span>High Exam Weightage ({examName})</span>
                </div>

                <div className="px-2.5 py-1 rounded-full bg-primary-fixed text-primary text-[11px] font-semibold flex items-center gap-1 border border-primary-fixed-dim">
                  <Activity className="w-3.5 h-3.5 text-primary" />
                  <span>Confidence: {activeModule.confidencePercent || 68}%</span>
                </div>

                <div className="px-2.5 py-1 rounded-full bg-success-surface text-success-text text-[11px] font-semibold flex items-center gap-1 border border-success-border">
                  <CheckCircle className="w-3.5 h-3.5 text-success-text" />
                  <span>{currentQuestions.length} MCQs Available</span>
                </div>

                {activeModule.codeClause && (
                  <div className="px-2.5 py-1 rounded-full bg-subtle-strong text-ink-soft text-[11px] font-mono font-semibold flex items-center gap-1 border border-line">
                    <ShieldCheck className="w-3.5 h-3.5 text-muted" />
                    <span>{activeModule.codeClause}</span>
                  </div>
                )}
              </div>

              {/* Segment Tabs */}
              <div className="flex items-center gap-1 pt-2 overflow-x-auto bg-subtle-strong p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'overview'
                      ? 'bg-card text-ink shadow-xs'
                      : 'text-ink-soft hover:text-ink hover:bg-line/60'
                  }`}
                >
                  Overview & Notes
                </button>

                <button
                  onClick={() => setActiveTab('formulas')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'formulas'
                      ? 'bg-card text-ink shadow-xs'
                      : 'text-ink-soft hover:text-ink hover:bg-line/60'
                  }`}
                >
                  Formula Sheet
                </button>

                <button
                  onClick={() => setActiveTab('callouts')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'callouts'
                      ? 'bg-card text-ink shadow-xs'
                      : 'text-ink-soft hover:text-ink hover:bg-line/60'
                  }`}
                >
                  Important Callouts
                </button>

                <button
                  onClick={() => setActiveTab('questions')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'questions'
                      ? 'bg-card text-ink shadow-xs'
                      : 'text-ink-soft hover:text-ink hover:bg-line/60'
                  }`}
                >
                  <span>Practice Questions</span>
                  <span className="px-1.5 py-0.2 rounded bg-primary-fixed text-primary font-mono text-[10px]">
                    {currentQuestions.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('tutor')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'tutor'
                      ? 'bg-card text-ink shadow-xs'
                      : 'text-ink-soft hover:text-ink hover:bg-line/60'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>AI Tutor Q&A</span>
                </button>
              </div>
            </Card>

            {/* TAB 1: Overview & Notes */}
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-5">
                {/* Quick Revision Summary Card */}
                <Card flush className="p-5 sm:p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-line pb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      <h2 className="text-base font-bold text-ink">Quick Revision Summary</h2>
                    </div>
                    <span className="text-[10px] font-mono text-muted-faint uppercase tracking-wider">
                      REVISION BLOCK • {activeModule.subject}
                    </span>
                  </div>

                  <p className="text-sm text-ink-soft leading-relaxed">
                    {activeModule.fullDescription || activeModule.summary}
                  </p>

                  {/* Core Data Comparison Grid (Side-by-Side Cards) */}
                  {activeModule.comparisonGrid && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      <div className="p-4 rounded-xl bg-subtle border border-line flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                            {activeModule.comparisonGrid.titleLeft}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-line text-ink font-mono text-[10px]">
                            {activeModule.comparisonGrid.tagLeft}
                          </span>
                        </div>
                        <div className="text-base font-bold font-mono text-ink">
                          {activeModule.comparisonGrid.valueLeft}
                        </div>
                        <p className="text-xs text-ink-soft leading-relaxed">
                          {activeModule.comparisonGrid.descLeft}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-subtle border border-line flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                            {activeModule.comparisonGrid.titleRight}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-line text-ink font-mono text-[10px]">
                            {activeModule.comparisonGrid.tagRight}
                          </span>
                        </div>
                        <div className="text-base font-bold font-mono text-ink">
                          {activeModule.comparisonGrid.valueRight}
                        </div>
                        <p className="text-xs text-ink-soft leading-relaxed">
                          {activeModule.comparisonGrid.descRight}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Technical SVG Diagram: Stress & Strain Profile for RCC Limit State */}
                  {activeModule.id === 'civil-rcc' && (
                    <div className="mt-2 p-4 rounded-xl bg-subtle border border-line flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-primary" />
                          <span>Stress-Strain Distribution at Limit State of Collapse (Flexure)</span>
                        </span>
                        <span className="text-[10px] text-muted font-mono">IS 456 Fig. 21</span>
                      </div>
                      <Card flush className="w-full p-4 flex flex-col items-center justify-center overflow-x-auto">
                        <svg className="w-full max-w-xl h-44 text-ink" fill="none" viewBox="0 0 540 160" xmlns="http://www.w3.org/2000/svg">
                          <line stroke="currentColor" strokeDasharray="4 4" strokeOpacity="0.2" strokeWidth="1.5" x1="20" x2="520" y1="80" y2="80" />
                          <text className="fill-current text-muted-faint text-[10px] font-mono" x="525" y="84">N.A.</text>
                          <rect className="fill-line stroke-line-strong" height="120" rx="3" width="45" x="50" y="20" />
                          <circle className="fill-primary" cx="72.5" cy="120" r="5" />
                          <text className="fill-current text-ink text-[11px] font-bold" x="50" y="14">Cross Section</text>
                          <text className="fill-current text-muted text-[10px]" x="60" y="138">Ast</text>
                          <line stroke="currentColor" strokeWidth="1.5" x1="180" x2="180" y1="20" y2="140" />
                          <path className="fill-primary-fixed-dim opacity-60" d="M180 80 L 230 20 L 180 20 Z" />
                          <path className="fill-primary-fixed-dim opacity-60" d="M180 80 L 140 120 L 180 120 Z" />
                          <text className="fill-current text-ink text-[11px] font-bold" x="160" y="14">Strain Profile</text>
                          <text className="fill-primary font-mono text-[10px] font-bold" x="235" y="24">εcu = 0.0035</text>
                          <text className="fill-muted font-mono text-[10px]" x="95" y="125">0.87fy/Es + 0.002</text>
                          <line stroke="currentColor" strokeWidth="1.5" x1="340" x2="340" y1="20" y2="140" />
                          <path className="fill-primary-fixed-dim stroke-primary-light" d="M340 20 H 420 V 55 Q 410 75 340 80 Z" />
                          <line className="text-primary" stroke="currentColor" strokeWidth="2" x1="340" x2="410" y1="120" y2="120" />
                          <polygon className="fill-primary" points="410,117 418,120 410,123" />
                          <line className="text-success-text" stroke="currentColor" strokeWidth="2" x1="340" x2="430" y1="46" y2="46" />
                          <polygon className="fill-emerald-700" points="430,43 438,46 430,49" />
                          <text className="fill-emerald-700 font-mono text-[10px] font-bold" x="442" y="50">C = 0.36 fck b xu</text>
                          <text className="fill-primary font-mono text-[10px] font-bold" x="424" y="124">T = 0.87 fy Ast</text>
                          <line className="text-muted-faint" stroke="currentColor" strokeDasharray="2 2" strokeWidth="1" x1="475" x2="475" y1="46" y2="120" />
                          <text className="fill-current text-ink-soft font-mono text-[10px]" x="482" y="85">z = d - 0.42xu</text>
                        </svg>
                      </Card>
                      <div className="flex flex-wrap items-center justify-between text-muted text-xs px-1 gap-2">
                        <span>Depth of neutral axis: <strong className="text-ink font-mono">xu = (0.87 fy Ast) / (0.36 fck b)</strong></span>
                        <span>Lever Arm Depth: <strong className="text-ink font-mono">0.42 xu from compression face</strong></span>
                      </div>
                    </div>
                  )}

                  {/* Generic Technical Scheme for other modules */}
                  {activeModule.id !== 'civil-rcc' && activeModule.codeClause && (
                    <div className="p-4 rounded-xl bg-subtle border border-line flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-success-text" />
                          <span>Standard Governing Specifications</span>
                        </span>
                        <span className="text-[10px] font-mono text-muted">{activeModule.codeClause}</span>
                      </div>
                      <p className="text-xs text-ink-soft">
                        Prescribed design methodology, testing procedures and safety factors as certified by the official syllabus board.
                      </p>
                    </div>
                  )}
                </Card>

                {/* Step-by-Step Learning Breakdown Modules */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-ink flex items-center gap-2 px-1">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span>Curricular Units & Step-Wise Notes</span>
                  </h3>

                  {activeModule.steps.map((step, idx) => (
                    <Card flush className="p-5 flex flex-col gap-3" key={idx}>
                      <div className="flex items-center justify-between border-b border-line pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary-fixed text-primary font-bold text-xs flex items-center justify-center">
                            {step.stepNumber}
                          </span>
                          <div>
                            <h4 className="text-sm font-bold text-ink">{step.stepTitle}</h4>
                            <span className="text-xs text-muted">{step.subtitle}</span>
                          </div>
                        </div>
                        {step.formulaOrCode && (
                          <button
                            onClick={() => handleCopyFormula(step.formulaOrCode || '')}
                            className="flex items-center gap-1 text-[11px] text-muted hover:text-primary transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Formula</span>
                          </button>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
                        {step.keyConcept}
                      </p>

                      {step.formulaOrCode && (
                        <div className="bg-inverse text-indigo-200 font-mono text-xs p-3 rounded-lg flex items-center justify-between overflow-x-auto">
                          <span>{step.formulaOrCode}</span>
                          <button
                            onClick={() => handleCopyFormula(step.formulaOrCode || '')}
                            className="ml-3 text-muted-faint hover:text-white"
                          >
                            {copiedFormula === step.formulaOrCode ? (
                              <Check className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      )}

                      {/* High Yield Facts list */}
                      {step.highYieldFacts && step.highYieldFacts.length > 0 && (
                        <div className="mt-1 flex flex-col gap-1.5">
                          <span className="text-[11px] font-bold text-ink uppercase tracking-wider">
                            High-Yield Curricular Facts
                          </span>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-ink-soft">
                            {step.highYieldFacts.map((fact, fIdx) => (
                              <li key={fIdx} className="flex items-start gap-1.5 bg-subtle p-2 rounded-lg border border-line">
                                <span className="text-primary font-bold mt-0.5">•</span>
                                <span>{fact}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Benchmark Example */}
                      {step.benchmarkExample && (
                        <div className="mt-2 bg-primary-fixed border border-primary-fixed-dim rounded-xl p-4 flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-primary" />
                              <span>Benchmark Question Example</span>
                            </span>
                            <span className="text-[10px] font-mono text-primary font-semibold">Standard Model</span>
                          </div>
                          <p className="text-xs font-semibold text-ink">
                            {step.benchmarkExample.question}
                          </p>
                          <div className="grid grid-cols-2 gap-2 my-1">
                            {(step.benchmarkExample.options || []).map((opt, oIdx) => (
                              <div
                                key={oIdx}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border ${
                                  opt === step.benchmarkExample?.correctAnswer
                                    ? 'bg-success-surface border-success-border text-success-text font-bold'
                                    : 'bg-card border-line text-ink-soft'
                                }`}
                              >
                                {opt}
                              </div>
                            ))}
                          </div>
                          {step.benchmarkExample.stepByStepSolution && (
                            <div className="text-xs text-ink-soft pt-1 flex flex-col gap-0.5">
                              <span className="font-semibold text-ink">Step-by-Step Solution:</span>
                              {step.benchmarkExample.stepByStepSolution.map((sLine, sIdx) => (
                                <p key={sIdx} className="text-ink-soft leading-snug">{sLine}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: Formula Sheet */}
            {activeTab === 'formulas' && (
              <Card flush className="p-5 sm:p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    <h2 className="text-base font-bold text-ink">High-Yield Formula Sheet</h2>
                  </div>
                  <span className="text-xs text-muted">Ready for quick exam revision</span>
                </div>

                <div className="flex flex-col gap-3">
                  {activeModule.steps
                    .filter((s) => s.formulaOrCode)
                    .map((step, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-subtle border border-line flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-ink">{step.stepTitle}</span>
                          <button
                            onClick={() => handleCopyFormula(step.formulaOrCode || '')}
                            className="flex items-center gap-1 text-xs text-primary hover:text-primary font-semibold"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>{copiedFormula === step.formulaOrCode ? 'Copied!' : 'Copy'}</span>
                          </button>
                        </div>
                        <div className="p-3 bg-inverse text-emerald-300 font-mono text-xs rounded-lg overflow-x-auto">
                          {step.formulaOrCode}
                        </div>
                        <p className="text-xs text-ink-soft mt-1">
                          {step.keyConcept}
                        </p>
                      </div>
                    ))}

                  {activeModule.callouts?.numericalShortcut && (
                    <div className="p-4 rounded-xl bg-primary-fixed border border-primary-fixed-dim flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-primary">Rapid Calculation Shortcut</span>
                        <button
                          onClick={() => handleCopyFormula(activeModule.callouts?.numericalShortcut.formula || '')}
                          className="flex items-center gap-1 text-xs text-primary hover:text-primary font-semibold"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </button>
                      </div>
                      <div className="p-3 bg-inverse text-amber-300 font-mono text-xs rounded-lg overflow-x-auto">
                        {activeModule.callouts.numericalShortcut.formula}
                      </div>
                      <p className="text-xs text-primary">
                        {activeModule.callouts.numericalShortcut.note}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* TAB 3: Important Callouts & Traps */}
            {activeTab === 'callouts' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Card A: Core Postulate 📌 */}
                <div className="p-5 rounded-xl bg-subtle border border-line shadow-xs flex flex-col gap-2 relative overflow-hidden">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                      <Scale className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-ink">Core Postulate</span>
                  </div>
                  <p className="text-xs sm:text-sm text-ink leading-relaxed pt-1">
                    {activeModule.callouts?.corePostulate || 'Essential governing theorem verified across national public service standards.'}
                  </p>
                  <span className="text-[11px] text-muted font-mono pt-1">
                    Refer {activeModule.callouts?.corePostulateRef || activeModule.codeClause || 'Standard Specification'}
                  </span>
                </div>

                {/* Card B: Common Mistake & Exam Trap ⚠️ */}
                <div className="p-5 rounded-xl bg-danger-surface border border-danger-border shadow-xs flex flex-col gap-2 relative overflow-hidden">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-danger-surface flex items-center justify-center text-danger-text">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-danger-text">Common Trap In Exams</span>
                  </div>
                  <p className="text-xs sm:text-sm text-ink leading-relaxed pt-1">
                    {activeModule.callouts?.examTrap || 'Frequently miscalculated formula parameters in competitive examinations.'}
                  </p>
                  <span className="text-[11px] text-danger-text font-semibold pt-1">
                    {activeModule.callouts?.examTrapRef || 'Frequently asked in recent State PSC examinations'}
                  </span>
                </div>

                {/* Card C: Frequently Tested Ratios ⭐ */}
                <div className="p-5 rounded-xl bg-warning-surface border border-warning-border shadow-xs flex flex-col gap-2 relative overflow-hidden">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-warning-surface flex items-center justify-center text-warning-text">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-warning-text">Frequently Tested Ratios</span>
                  </div>
                  <div className="flex flex-col gap-1.5 pt-1">
                    {(activeModule.callouts?.testedRatios || [
                      { label: 'Standard Limiting Ratio:', value: '0.48' },
                      { label: 'Safety Factor:', value: '1.50' }
                    ]).map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-0.5 border-b border-warning-border last:border-0">
                        <span className="text-ink-soft">{item.label}</span>
                        <span className="font-mono font-bold text-primary">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card D: Numerical Concept Capacity 🔢 */}
                <div className="p-5 rounded-xl bg-success-surface border border-success-border shadow-xs flex flex-col gap-2 relative overflow-hidden">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-success-surface flex items-center justify-center text-success-text">
                      <Crosshair className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-success-text">High-Speed Analytical Shortcut</span>
                  </div>
                  <div className="text-sm font-mono font-bold text-ink py-1">
                    {activeModule.callouts?.numericalShortcut.formula || 'Mu = Q · fck · b · d²'}
                  </div>
                  <p className="text-xs text-ink-soft leading-relaxed">
                    {activeModule.callouts?.numericalShortcut.note || 'Master direct coefficients to skip tedious manual derivations during paper.'}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 4: Previous Year Questions (MCQs) */}
            {activeTab === 'questions' && (
              <Card flush className="p-5 sm:p-6 flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <h2 className="text-base font-bold text-ink">
                      Topic Practice Questions ({currentQuestions.length})
                    </h2>
                  </div>
                  <span className="text-xs text-muted font-medium">
                    Verified from PSC, GATE & ESE Standards
                  </span>
                </div>

                {currentQuestions.length === 0 ? (
                  <EmptyState
                    icon={<BookOpen className="h-5 w-5" />}
                    title="No questions for this module yet"
                    description="Questions appear here once this topic has been ingested. Generate a set from the Ingestion Studio, or practise another module."
                  />
                ) : (
                  <div className="flex flex-col gap-6">
                    {currentQuestions.map((q, qIndex) => {
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
                              : 'bg-subtle/50 border-line'
                          }`}
                        >
                          {/* Question Header & Meta */}
                          <div className="flex items-center justify-between text-xs text-muted mb-2.5">
                            <span className="font-bold text-primary">Question {qIndex + 1}</span>
                            <div className="flex items-center gap-2">
                              {q.difficulty && (
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    q.difficulty === 'EASY'
                                      ? 'bg-success-surface text-success-text'
                                      : q.difficulty === 'HARD'
                                      ? 'bg-danger-surface text-danger-text'
                                      : 'bg-warning-surface text-warning-text'
                                  }`}
                                >
                                  {q.difficulty}
                                </span>
                              )}
                              <span className="font-mono text-[10px] text-muted-faint">
                                {q.examSource || 'APSC AE / GATE'}
                              </span>
                            </div>
                          </div>

                          {/* Stem */}
                          <p className="text-sm font-semibold text-ink leading-relaxed mb-4">
                            {q.stem}
                          </p>

                          {/* Options */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                            {q.options.map((opt) => {
                              const isSelected = selectedOpt === opt.id;
                              const isThisCorrect = opt.id === q.correctOption;

                              let optStyle = 'bg-card border-line text-ink-soft hover:border-primary-fixed-dim hover:bg-primary-fixed';

                              if (isAnswered) {
                                if (isThisCorrect) {
                                  optStyle = 'bg-success-surface border-success-border text-success-text font-bold shadow-xs';
                                } else if (isSelected && !isThisCorrect) {
                                  optStyle = 'bg-danger-surface border-danger-border text-danger-text font-semibold';
                                } else {
                                  optStyle = 'bg-card/60 border-line text-muted-faint opacity-60';
                                }
                              }

                              return (
                                <button
                                  key={opt.id}
                                  onClick={() => handleAnswerQuestion(q.id, opt.id as 'A' | 'B' | 'C' | 'D')}
                                  disabled={isAnswered}
                                  className={`p-3 rounded-lg border text-left text-xs flex items-start gap-2.5 transition-all ${optStyle}`}
                                >
                                  <span
                                    className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] flex-shrink-0 ${
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

                          {/* Feedback Banner */}
                          {isAnswered && (
                            <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-line">
                              <div className="flex items-center gap-1.5 font-bold">
                                {isCorrect ? (
                                  <>
                                    <CheckCircle2 className="w-4 h-4 text-success-text" />
                                    <span className="text-success-text">Correct! (+2.0 Marks)</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-4 h-4 text-danger-text" />
                                    <span className="text-danger-text">Incorrect (-0.50 Negative Marking)</span>
                                  </>
                                )}
                              </div>
                              <button
                                onClick={() =>
                                  setExpandedSolutions((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                                }
                                className="text-primary hover:text-primary font-semibold flex items-center gap-1"
                              >
                                <span>{showSolution ? 'Hide Solution' : 'View Solution & Explanation'}</span>
                                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showSolution ? 'rotate-90' : ''}`} />
                              </button>
                            </div>
                          )}

                          {/* Expanded Solution */}
                          {isAnswered && showSolution && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-3 p-3.5 rounded-lg bg-card border border-line text-xs text-ink-soft flex flex-col gap-1.5"
                            >
                              <div className="flex items-center justify-between text-[11px] text-muted-faint font-mono">
                                <span>Correct Answer: Option {q.correctOption}</span>
                                {q.formulaContext && <span>Formula: {q.formulaContext}</span>}
                              </div>
                              <p className="leading-relaxed text-ink">{q.explanation}</p>
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            )}

            {/* TAB 5: AI Tutor Q&A */}
            {activeTab === 'tutor' && (
              <Card flush className="p-5 sm:p-6 flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h2 className="text-base font-bold text-ink">
                      Syllabus AI Tutor • {activeModule.title.split(':')[0]}
                    </h2>
                  </div>
                  <span className="text-xs text-primary font-semibold">Active Assistant</span>
                </div>

                {/* Pre-configured High Yield Doubts */}
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-bold text-ink uppercase tracking-wider">
                    Frequently Asked High-Yield Queries
                  </span>
                  {(activeModule.aiTutorPrompts || [
                    {
                      question: `What are the most frequent APSC AE exam questions from ${activeModule.title}?`,
                      answerPreview: `High-yield questions center on formula derivations, code limit thresholds, and comparative criteria for ${activeModule.subject}.`
                    }
                  ]).map((prompt, pIdx) => (
                    <div key={pIdx} className="p-4 rounded-xl bg-subtle border border-line flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-primary flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-primary" />
                          <span>{prompt.question}</span>
                        </span>
                        <button
                          onClick={() => onAskTutorAboutTopic?.(`${prompt.question} (${activeModule.title})`)}
                          className="text-xs font-semibold text-primary hover:text-primary flex items-center gap-1"
                        >
                          <span>Ask in AI Tutor</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-ink-soft leading-relaxed bg-card p-3 rounded-lg border border-line">
                        {prompt.answerPreview}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Ask Custom Question Box */}
                <div className="mt-3 p-4 rounded-xl bg-primary-fixed border border-primary-fixed-dim flex flex-col gap-3">
                  <span className="text-xs font-bold text-primary">
                    Ask AI Tutor about {activeModule.title.split(':')[0]}
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customTutorQuery}
                      onChange={(e) => setCustomTutorQuery(e.target.value)}
                      placeholder={`Ask any question on ${activeModule.title.split(':')[0]}...`}
                      className="flex-1 bg-card border border-line rounded-lg px-3 py-2 text-xs text-ink focus:outline-none focus:border-primary"
                    />
                    <button
                      onClick={() => {
                        if (customTutorQuery.trim() && onAskTutorAboutTopic) {
                          onAskTutorAboutTopic(`${customTutorQuery} (Topic: ${activeModule.title})`);
                        }
                      }}
                      className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Ask AI</span>
                    </button>
                  </div>
                </div>
              </Card>
            )}

            {/* ---------------- Section 3: Sticky Interaction & Study Action Dock ---------------- */}
            <div className="sticky bottom-4 z-30 p-3 bg-card/95 backdrop-blur-md rounded-xl border border-line shadow-xl flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveTab('questions');
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-bold transition-all shadow-sm"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Practice {currentQuestions.length} MCQs on this Topic</span>
                </button>

                <button
                  onClick={() => onAskTutorAboutTopic?.(`Explain high-yield exam concepts for: ${activeModule.title}`)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-subtle-strong hover:bg-line text-primary text-xs font-bold transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask AI Tutor</span>
                </button>
              </div>

              <button
                onClick={() => handleToggleCompletion(activeModule.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-xs ${
                  isCurrentCompleted
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    : 'bg-subtle-strong hover:bg-success-surface hover:text-success-text text-ink-soft'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isCurrentCompleted ? 'Mastered & Verified ✓' : 'Mark Topic Completed'}</span>
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SyllabusExplorerPage;
