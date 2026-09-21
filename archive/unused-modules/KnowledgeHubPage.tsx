import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Copy,
  Check,
  Building2,
  Layers,
  Droplets,
  ShieldCheck,
  Compass,
  Briefcase,
  AlertTriangle,
  FileText,
  Calculator,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Flame,
  HelpCircle,
  Hash,
  Scale,
  Sparkles,
  Bookmark,
  ListFilter,
  CheckCircle2,
  X,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import { CivilKnowledgeService } from '../services/civilKnowledgeService';
import type {
  CivilKnowledgeConcept,
  CivilBranchId,
  CivilDifficultyLevel
} from '../types/civilKnowledge';

interface KnowledgeHubPageProps {
  onStartPractice?: (topicId: string, paper?: 'civil' | 'gs') => void;
  onAskTutor?: (topicTitle: string) => void;
}

type HubMode = 'textbook' | 'formulas' | 'definitions' | 'quick-revision' | 'traps' | 'symbols';

const BRANCH_CONFIG: Record<
  CivilBranchId,
  { name: string; short: string; icon: React.FC<{ className?: string }>; color: string }
> = {
  'structural-mechanics': {
    name: 'Structural Mechanics & Design',
    short: 'Structural',
    icon: Building2,
    color: 'from-blue-600 to-indigo-700'
  },
  'geotechnical': {
    name: 'Geotechnical & Foundations',
    short: 'Geotech',
    icon: Layers,
    color: 'from-amber-600 to-orange-700'
  },
  'water-resources': {
    name: 'Water Resources & Fluids',
    short: 'Water / Fluids',
    icon: Droplets,
    color: 'from-cyan-600 to-blue-700'
  },
  'environmental': {
    name: 'Environmental & Public Health',
    short: 'Environmental',
    icon: ShieldCheck,
    color: 'from-emerald-600 to-teal-700'
  },
  'transportation': {
    name: 'Transportation & Highways',
    short: 'Transportation',
    icon: Compass,
    color: 'from-violet-600 to-purple-700'
  },
  'geomatics-management': {
    name: 'Geomatics, Materials & Management',
    short: 'Geomatics & Mgmt',
    icon: Briefcase,
    color: 'from-rose-600 to-pink-700'
  }
};

export const KnowledgeHubPage: React.FC<KnowledgeHubPageProps> = ({
  onStartPractice,
  onAskTutor
}) => {
  const toast = useToast();

  const [activeMode, setActiveMode] = useState<HubMode>('textbook');
  const [selectedBranch, setSelectedBranch] = useState<CivilBranchId | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<CivilDifficultyLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showTocModal, setShowTocModal] = useState(false);

  const stats = useMemo(() => CivilKnowledgeService.getKnowledgeBaseStats(), []);
  const branches = useMemo(() => CivilKnowledgeService.getBranches(), []);

  // Filtered concepts based on search and branch
  const filteredConcepts = useMemo(() => {
    const results = CivilKnowledgeService.searchConcepts({
      query: searchQuery,
      branchId: selectedBranch,
      difficulty: selectedDifficulty
    });
    return results.map((r) => r.concept);
  }, [searchQuery, selectedBranch, selectedDifficulty]);

  // Current active concept slug
  const [activeSlug, setActiveSlug] = useState<string>(() => {
    return filteredConcepts[0]?.slug || 'euler-buckling-columns';
  });

  // Active concept data
  const currentConcept: CivilKnowledgeConcept | undefined = useMemo(() => {
    return (
      CivilKnowledgeService.getConceptBySlug(activeSlug) ||
      filteredConcepts[0]
    );
  }, [activeSlug, filteredConcepts]);

  // Index of current concept in filtered list
  const currentIndex = useMemo(() => {
    if (!currentConcept) return 0;
    const idx = filteredConcepts.findIndex((c) => c.slug === currentConcept.slug);
    return idx >= 0 ? idx : 0;
  }, [currentConcept, filteredConcepts]);

  const prevConcept = filteredConcepts[currentIndex - 1];
  const nextConcept = filteredConcepts[currentIndex + 1];

  const relatedConcepts = useMemo(() => {
    if (!currentConcept) return [];
    return CivilKnowledgeService.getRelatedConcepts(currentConcept.slug);
  }, [currentConcept]);

  // Filtered Banks
  const formulas = useMemo(() => CivilKnowledgeService.searchFormulas(searchQuery), [searchQuery]);
  const definitions = useMemo(() => CivilKnowledgeService.searchDefinitions(searchQuery), [searchQuery]);
  const quickRevisions = useMemo(() => CivilKnowledgeService.searchQuickRevision(searchQuery), [searchQuery]);
  const traps = useMemo(() => CivilKnowledgeService.searchConceptTraps(searchQuery), [searchQuery]);
  const symbols = useMemo(() => CivilKnowledgeService.searchSymbols(searchQuery), [searchQuery]);

  const handleCopy = (text: string, id: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied to Clipboard', `${label} copied successfully.`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors pb-24">
      {/* ------------------------------------------------------------------
          1. Sleek Top App Header (No nested sidebar, clean digital textbook look)
          ------------------------------------------------------------------ */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold tracking-wide mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Comprehensive Civil Engineering Theory Repository
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Digital Engineering Textbook
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                Structured textbook theory, derivations, IS/IRC code provisions, worked examples, and searchable formula banks.
              </p>
            </div>

            {/* Mode Switcher Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60 backdrop-blur-sm self-start md:self-auto">
              <button
                onClick={() => setActiveMode('textbook')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeMode === 'textbook'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Textbook
              </button>

              <button
                onClick={() => setActiveMode('formulas')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeMode === 'formulas'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                Formulas ({stats.totalFormulas})
              </button>

              <button
                onClick={() => setActiveMode('definitions')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeMode === 'definitions'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Glossary ({stats.totalDefinitions})
              </button>

              <button
                onClick={() => setActiveMode('quick-revision')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeMode === 'quick-revision'
                    ? 'bg-amber-600 text-white shadow-sm shadow-amber-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Revision ({stats.totalQuickRevisionFacts})
              </button>

              <button
                onClick={() => setActiveMode('traps')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeMode === 'traps'
                    ? 'bg-rose-600 text-white shadow-sm shadow-rose-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                Traps ({stats.totalConceptTraps})
              </button>

              <button
                onClick={() => setActiveMode('symbols')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeMode === 'symbols'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                Units ({stats.totalSymbols})
              </button>
            </div>
          </div>

          {/* ------------------------------------------------------------------
              2. Branch Ribbon Bar (Replaces side panel with intuitive top tabs)
              ------------------------------------------------------------------ */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <button
              onClick={() => setSelectedBranch('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedBranch === 'all'
                  ? 'bg-white text-slate-900 font-bold shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All Branches ({stats.totalBranches})
            </button>

            {branches.map((b) => {
              const cfg = BRANCH_CONFIG[b.id];
              const IconComp = cfg?.icon || BookOpen;
              const isSelected = selectedBranch === b.id;

              return (
                <button
                  key={b.id}
                  onClick={() => setSelectedBranch(b.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-500/40'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  {cfg?.short || b.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          3. Horizontal Search & Table-of-Contents Strip
          ------------------------------------------------------------------ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search theory, formulas (e.g. Euler, IS 456, Sequent Depth, Terzaghi)..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-slate-100"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowTocModal(true)}
              className="text-xs font-semibold flex items-center gap-1.5"
            >
              <ListFilter className="w-3.5 h-3.5 text-blue-500" />
              Table of Contents ({filteredConcepts.length})
            </Button>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as CivilDifficultyLevel | 'all')}
              className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 outline-none font-medium"
            >
              <option value="all">All Difficulties</option>
              <option value="FUNDAMENTAL">Fundamental</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="GATE_IES">GATE & UPSC ESE</option>
              <option value="STATE_AE_JE">APSC & State AE</option>
            </select>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          4. Single-Canvas Main Area (No side panel eating horizontal space)
          ------------------------------------------------------------------ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* ================================================================
            MODE 1: FULL-WIDTH TEXTBOOK READER
            ================================================================ */}
        {activeMode === 'textbook' && currentConcept && (
          <div className="space-y-6">
            {/* Top Reader Navigation Bar: Prev / Next / Jump */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center justify-between gap-4">
              <button
                disabled={!prevConcept}
                onClick={() => prevConcept && setActiveSlug(prevConcept.slug)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  prevConcept
                    ? 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous:</span> {prevConcept ? prevConcept.title.slice(0, 24) + '...' : 'First Chapter'}
              </button>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span className="font-mono text-blue-600 dark:text-blue-400">
                  {currentIndex + 1} / {filteredConcepts.length}
                </span>
                <span className="hidden md:inline">• {currentConcept.subject}</span>
              </div>

              <button
                disabled={!nextConcept}
                onClick={() => nextConcept && setActiveSlug(nextConcept.slug)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  nextConcept
                    ? 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40'
                    : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                }`}
              >
                <span className="hidden sm:inline">Next:</span> {nextConcept ? nextConcept.title.slice(0, 24) + '...' : 'End'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Main Textbook Chapter Article */}
            <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-sm space-y-8">
              {/* Header Details */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-6">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
                  <span>{currentConcept.branchName}</span>
                  <span>•</span>
                  <span>{currentConcept.subject}</span>
                  <span>•</span>
                  <span>{currentConcept.unit}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                  {currentConcept.title}
                </h1>

                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <Badge tone="brand" bordered className="text-xs font-bold">
                    {currentConcept.difficulty}
                  </Badge>
                  <Badge tone="success" bordered className="text-xs font-bold">
                    {currentConcept.topic}
                  </Badge>
                  {currentConcept.codeProvisions.map((cp) => (
                    <Badge key={cp.clauseOrTable} tone="info" bordered className="text-xs font-mono font-bold">
                      {cp.standard} ({cp.clauseOrTable})
                    </Badge>
                  ))}
                </div>

                {/* Quick Action Toolbar */}
                <div className="flex flex-wrap gap-2.5 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleCopy(currentConcept.theory.detailedExplanation, currentConcept.id, 'Theory')}
                    className="text-xs"
                  >
                    {copiedId === currentConcept.id ? <Check className="w-3.5 h-3.5 text-emerald-500 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                    Copy Theory
                  </Button>

                  {currentConcept.formulas.length > 0 && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleCopy(currentConcept.formulas.map((f) => `${f.name}: ${f.plainText}`).join('\n'), currentConcept.id + '-f', 'Formulas')}
                      className="text-xs"
                    >
                      <Calculator className="w-3.5 h-3.5 mr-1.5" />
                      Copy Formulas
                    </Button>
                  )}

                  <Button
                    size="sm"
                    onClick={() => onStartPractice?.(currentConcept.topic)}
                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                    Practice Questions on Topic
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAskTutor?.(`Explain ${currentConcept.title} step-by-step with exam tips and formulas`)}
                    className="text-xs"
                  >
                    <HelpCircle className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
                    Ask AI Tutor
                  </Button>
                </div>
              </div>

              {/* Section 1: Executive Overview & Formal Definitions */}
              <section className="space-y-4">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  1. Fundamental Concept & Definitions
                </h2>
                <p className="text-base text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {currentConcept.theory.summary}
                </p>

                {currentConcept.theory.definitions.length > 0 && (
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2.5">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Formal Technical Definitions</div>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-800 dark:text-slate-200">
                      {currentConcept.theory.definitions.map((def, idx) => (
                        <li key={idx} className="leading-relaxed">{def}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>

              {/* Section 2: Diagrams & Visuals */}
              {currentConcept.diagrams.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-indigo-500" />
                      2. Schematic Diagrams & Engineering Sketches
                    </h2>
                    <span className="text-xs text-slate-400 font-mono">Copyable ASCII Text</span>
                  </div>

                  {currentConcept.diagrams.map((diag) => (
                    <div key={diag.id} className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950 text-slate-100 shadow-md">
                      <div className="bg-slate-900 px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
                        <span className="text-xs font-bold text-slate-200">{diag.title}</span>
                        <button
                          onClick={() => handleCopy(diag.content, diag.id, 'Diagram')}
                          className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 bg-slate-800 px-2.5 py-1 rounded"
                        >
                          {copiedId === diag.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          Copy Diagram
                        </button>
                      </div>
                      <pre className="p-4 sm:p-6 text-xs sm:text-sm font-mono overflow-x-auto text-emerald-400 leading-tight">
                        {diag.content}
                      </pre>
                      {diag.caption && (
                        <div className="p-3 bg-slate-900/60 border-t border-slate-800 text-xs text-slate-400 italic">
                          Figure Note: {diag.caption}
                        </div>
                      )}
                    </div>
                  ))}
                </section>
              )}

              {/* Section 3: Principles & Governing Assumptions */}
              <section className="space-y-4">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <Scale className="w-5 h-5 text-blue-500" />
                  3. Governing Principles & Assumptions
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 sm:p-5 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-2">
                    <h3 className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                      Fundamental Principles & Laws
                    </h3>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                      {currentConcept.theory.principlesAndLaws.map((p, idx) => (
                        <li key={idx} className="leading-relaxed">• {p}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 sm:p-5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 space-y-2">
                    <h3 className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                      Governing Theoretical Assumptions
                    </h3>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                      {currentConcept.theory.governingAssumptions.map((a, idx) => (
                        <li key={idx} className="leading-relaxed">• {a}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 4: Detailed Physics & Mathematical Derivations */}
              <section className="space-y-4">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <Hash className="w-5 h-5 text-indigo-500" />
                  4. Engineering Theory & Mathematical Derivations
                </h2>

                <div className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line font-serif">
                  {currentConcept.theory.detailedExplanation}
                </div>

                {currentConcept.theory.derivationSteps && currentConcept.theory.derivationSteps.length > 0 && (
                  <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Step-by-Step Derivation Sequence
                    </div>
                    <div className="space-y-2 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                      {currentConcept.theory.derivationSteps.map((step, idx) => (
                        <div key={idx} className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* Section 5: Governing Formulas & Variable Units */}
              {currentConcept.formulas.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <Calculator className="w-5 h-5 text-emerald-500" />
                    5. Governing Formulas & Variable Definitions
                  </h2>

                  {currentConcept.formulas.map((formula) => (
                    <div key={formula.id} className="p-5 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-base text-emerald-900 dark:text-emerald-200">{formula.name}</span>
                        <button
                          onClick={() => handleCopy(formula.plainText, formula.id, 'Formula')}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:underline"
                        >
                          {copiedId === formula.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          Copy Equation
                        </button>
                      </div>

                      <div className="p-3.5 bg-slate-900 text-emerald-400 font-mono text-center rounded-lg text-sm sm:text-base font-bold overflow-x-auto shadow-inner">
                        {formula.plainText}
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm">
                          <thead>
                            <tr className="border-b border-emerald-200 dark:border-emerald-800 text-slate-500">
                              <th className="pb-1.5 font-bold">Symbol</th>
                              <th className="pb-1.5 font-bold">Variable</th>
                              <th className="pb-1.5 font-bold">SI Unit</th>
                              <th className="pb-1.5 font-bold">Dimensions</th>
                              <th className="pb-1.5 font-bold">Typical Range</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-emerald-100 dark:divide-emerald-900/40">
                            {formula.variables.map((v) => (
                              <tr key={v.symbol} className="text-slate-700 dark:text-slate-300">
                                <td className="py-2 font-bold font-mono text-blue-600 dark:text-blue-400">{v.symbol}</td>
                                <td className="py-2">{v.name}</td>
                                <td className="py-2 font-mono font-bold text-emerald-600 dark:text-emerald-400">{v.siUnit}</td>
                                <td className="py-2 font-mono text-slate-400">{v.dimensionalFormula}</td>
                                <td className="py-2 text-slate-500">{v.typicalRange || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </section>
              )}

              {/* Section 6: Indian Standards (IS / IRC) Provisions */}
              {currentConcept.codeProvisions.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <ShieldCheck className="w-5 h-5 text-indigo-500" />
                    6. Indian Standard (IS / IRC) Code Specifications
                  </h2>

                  <div className="space-y-3">
                    {currentConcept.codeProvisions.map((cp, idx) => (
                      <div key={idx} className="p-4 sm:p-5 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-xs font-extrabold text-indigo-700 dark:text-indigo-300">
                            {cp.standard} — {cp.clauseOrTable}
                          </span>
                          {cp.isMandatory && (
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300">
                              Mandatory Code Provision
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">{cp.title}</h3>
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{cp.provisionText}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Section 7: Worked Numerical Examples */}
              {currentConcept.workedExamples.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <Calculator className="w-5 h-5 text-blue-500" />
                    7. Step-by-Step Worked Numerical Example
                  </h2>

                  {currentConcept.workedExamples.map((ex) => (
                    <div key={ex.id} className="p-5 sm:p-6 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/20 dark:bg-blue-950/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{ex.title}</h3>
                        {ex.examProvenance && (
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                            {ex.examProvenance}
                          </span>
                        )}
                      </div>

                      <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                        <span className="font-bold text-slate-900 dark:text-slate-100">Problem Statement: </span>
                        {ex.problemStatement}
                      </div>

                      <div className="space-y-2">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Solution Steps:</div>
                        {ex.stepByStepSolution.map((s, idx) => (
                          <div key={idx} className="p-2.5 bg-white dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line font-mono">
                            {s}
                          </div>
                        ))}
                      </div>

                      <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Final Evaluated Result:</span>
                        <span className="font-mono font-extrabold text-emerald-900 dark:text-emerald-100 text-base">{ex.finalAnswer}</span>
                      </div>

                      <div className="text-xs text-slate-500 dark:text-slate-400 italic">
                        💡 <span className="font-semibold text-slate-700 dark:text-slate-300">Exam Takeaway: </span>
                        {ex.takeaway}
                      </div>
                    </div>
                  ))}
                </section>
              )}

              {/* Section 8: Concept Traps & Pitfalls */}
              {currentConcept.conceptTraps.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-lg sm:text-xl font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2 border-b border-rose-200 dark:border-rose-900/40 pb-2">
                    <AlertTriangle className="w-5 h-5" />
                    8. High-Risk Examination Traps & Candidate Pitfalls
                  </h2>

                  {currentConcept.conceptTraps.map((trap) => (
                    <div key={trap.id} className="p-5 rounded-xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-3">
                      <h3 className="font-bold text-base text-rose-900 dark:text-rose-200">{trap.trapTitle}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-lg border border-rose-200 dark:border-rose-900/60">
                          <span className="font-bold text-rose-600 block mb-1">❌ What Candidates Do Wrong:</span>
                          <p className="text-slate-700 dark:text-slate-300">{trap.commonMistake}</p>
                        </div>
                        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-lg border border-emerald-200 dark:border-emerald-900/60">
                          <span className="font-bold text-emerald-600 block mb-1">✓ Correct Physics / Code Rule:</span>
                          <p className="text-slate-700 dark:text-slate-300">{trap.correctConcept}</p>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-rose-900 dark:text-rose-200 pt-1">
                        🛡️ Prevention Rule: <span className="font-normal text-slate-700 dark:text-slate-300">{trap.preventionRule}</span>
                      </div>
                    </div>
                  ))}
                </section>
              )}

              {/* Section 9: Interlinked Related Concepts */}
              {relatedConcepts.length > 0 && (
                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Interlinked Civil Engineering Concepts (Cross-Domain Navigation)
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {relatedConcepts.map((rc) => (
                      <button
                        key={rc.slug}
                        onClick={() => setActiveSlug(rc.slug)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-800 dark:text-slate-200 transition-all shadow-sm"
                      >
                        <Bookmark className="w-3.5 h-3.5 text-blue-500" />
                        {rc.title}
                        <ArrowRight className="w-3 h-3 ml-1 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Bottom Next/Prev Bar */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <button
                disabled={!prevConcept}
                onClick={() => prevConcept && setActiveSlug(prevConcept.slug)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                  prevConcept
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-500'
                    : 'opacity-40 cursor-not-allowed border-transparent'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Chapter
              </button>

              <button
                disabled={!nextConcept}
                onClick={() => nextConcept && setActiveSlug(nextConcept.slug)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  nextConcept
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                    : 'opacity-40 cursor-not-allowed bg-slate-300 text-slate-500'
                }`}
              >
                Next Chapter
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================
            MODE 2: FORMULA BANK
            ================================================================ */}
        {activeMode === 'formulas' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-500" />
                Civil Engineering Formula Bank ({formulas.length})
              </h2>
              <span className="text-xs text-slate-400">Searchable across all subjects</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formulas.map((f) => (
                <Card key={f.id} className="p-5 flex flex-col justify-between border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                          {f.subject} • {f.topic}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{f.name}</h3>
                      </div>
                      {f.codeRef && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200">
                          {f.codeRef}
                        </span>
                      )}
                    </div>

                    <div className="p-3.5 bg-slate-900 text-emerald-400 font-mono text-center rounded-lg text-sm font-bold overflow-x-auto shadow-inner">
                      {f.plainText}
                    </div>

                    <div className="space-y-1">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Variables & SI Units</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {f.variables.map((v) => (
                          <div key={v.symbol} className="p-1.5 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-100 dark:border-slate-800">
                            <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">{v.symbol}</span>: {v.name} ({v.siUnit})
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">Difficulty: {f.difficulty}</span>
                    <button
                      onClick={() => handleCopy(f.plainText, f.id, 'Formula')}
                      className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-500 font-semibold"
                    >
                      {copiedId === f.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      Copy Equation
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================
            MODE 3: DEFINITION GLOSSARY
            ================================================================ */}
        {activeMode === 'definitions' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Technical Definition Bank ({definitions.length})
              </h2>
              <span className="text-xs text-slate-400">Authoritative civil engineering terminology</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {definitions.map((d) => (
                <Card key={d.id} className="p-5 space-y-3 border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        {d.subject} • {d.topic}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{d.term}</h3>
                    </div>
                    {d.codeReference && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200">
                        {d.codeReference}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                    "{d.formalDefinition}"
                  </p>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Engineering Context: </span>
                    {d.context}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-[11px]">
                    <span className="text-slate-400">Keywords: {d.keyKeywords.join(', ')}</span>
                    <button
                      onClick={() => handleCopy(`${d.term}: ${d.formalDefinition}`, d.id, 'Definition')}
                      className="text-blue-600 hover:text-blue-500 font-semibold inline-flex items-center gap-1"
                    >
                      {copiedId === d.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      Copy
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================
            MODE 4: QUICK REVISION CARDS
            ================================================================ */}
        {activeMode === 'quick-revision' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                High-Yield Quick Revision Bank ({quickRevisions.length})
              </h2>
              <span className="text-xs text-slate-400">Rapid memory recall for APSC AE & UPSC ESE</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickRevisions.map((qr) => (
                <Card key={qr.id} className="p-5 space-y-2.5 border-slate-200 dark:border-slate-800 bg-amber-50/20 dark:bg-amber-950/10 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                      {qr.subject} • {qr.topic}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100">
                      {qr.examSignificance}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-medium leading-relaxed">
                    {qr.highYieldFact}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-amber-200/50 dark:border-amber-900/40 text-[11px]">
                    <div className="flex gap-1.5 flex-wrap">
                      {qr.tags.map((t) => (
                        <span key={t} className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px]">
                          #{t}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => handleCopy(qr.highYieldFact, qr.id, 'Revision Note')}
                      className="text-blue-600 hover:text-blue-500 font-semibold inline-flex items-center gap-1"
                    >
                      {copiedId === qr.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      Copy
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================
            MODE 5: CONCEPT TRAP RADAR
            ================================================================ */}
        {activeMode === 'traps' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                Exam Pitfalls & Concept Trap Bank ({traps.length})
              </h2>
              <span className="text-xs text-slate-400">Common exam blunders and prevention rules</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {traps.map((trap) => (
                <Card key={trap.id} className="p-5 space-y-3 border-rose-200 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                        {trap.subject} • {trap.topic}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{trap.trapTitle}</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div className="p-3.5 bg-white dark:bg-slate-900 rounded-lg border border-rose-200 dark:border-rose-900/60">
                      <span className="font-bold text-rose-600 block mb-1">❌ What Candidates Do Wrong:</span>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{trap.commonMistake}</p>
                    </div>

                    <div className="p-3.5 bg-white dark:bg-slate-900 rounded-lg border border-emerald-200 dark:border-emerald-900/60">
                      <span className="font-bold text-emerald-600 block mb-1">✓ Correct Physics / Code Specification:</span>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{trap.correctConcept}</p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-rose-200/50 dark:border-rose-900/40 text-xs">
                    <span className="font-bold text-rose-900 dark:text-rose-200">
                      🛡️ Prevention Rule: <span className="font-normal text-slate-700 dark:text-slate-300">{trap.preventionRule}</span>
                    </span>
                    <button
                      onClick={() => handleCopy(`${trap.trapTitle}\nMistake: ${trap.commonMistake}\nCorrect: ${trap.correctConcept}`, trap.id, 'Trap')}
                      className="text-blue-600 hover:text-blue-500 font-semibold inline-flex items-center gap-1"
                    >
                      {copiedId === trap.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      Copy
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================
            MODE 6: SYMBOLS & SI UNITS DIRECTORY
            ================================================================ */}
        {activeMode === 'symbols' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-500" />
                Standard Symbols, SI Units & Dimensional Formulas ({symbols.length})
              </h2>
              <span className="text-xs text-slate-400">Complete dimensional analysis dictionary</span>
            </div>

            <Card className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                    <tr>
                      <th className="p-3.5 font-bold">Symbol</th>
                      <th className="p-3.5 font-bold">Quantity Name</th>
                      <th className="p-3.5 font-bold">SI Unit</th>
                      <th className="p-3.5 font-bold">Dimensional Formula</th>
                      <th className="p-3.5 font-bold">Subject</th>
                      <th className="p-3.5 font-bold">Engineering Formula Context</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {symbols.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors text-slate-700 dark:text-slate-300">
                        <td className="p-3.5 font-bold font-mono text-blue-600 dark:text-blue-400 text-base">{s.symbol}</td>
                        <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100">{s.name}</td>
                        <td className="p-3.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">{s.siUnit}</td>
                        <td className="p-3.5 font-mono text-indigo-600 dark:text-indigo-400">{s.dimensionalFormula}</td>
                        <td className="p-3.5 text-xs">{s.subject}</td>
                        <td className="p-3.5 text-xs text-slate-500 dark:text-slate-400 font-mono">{s.typicalContext}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------
          5. Floating Table of Contents Modal (Clean popover, no permanent side panel)
          ------------------------------------------------------------------ */}
      {showTocModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListFilter className="w-5 h-5 text-blue-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Digital Textbook — Table of Contents
                </h3>
              </div>
              <button
                onClick={() => setShowTocModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2 max-h-[60vh]">
              {filteredConcepts.map((c, idx) => {
                const isCurrent = c.slug === currentConcept?.slug;
                const IconComp = BRANCH_CONFIG[c.branchId]?.icon || BookOpen;

                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveSlug(c.slug);
                      setActiveMode('textbook');
                      setShowTocModal(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                      isCurrent
                        ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-500 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-blue-300'
                    }`}
                  >
                    <div className={`p-2 rounded-lg mt-0.5 ${isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                          {c.subject}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          Ch {idx + 1}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">{c.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{c.unit}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
              Select any chapter to read directly on the full canvas.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeHubPage;
