import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Award,
  Layers,
  Database,
  Clock,
  Plus,
  Edit2,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Tag,
  FileText,
  Sparkles,
  ShieldCheck,
  Download,
  Trash2
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { UNIVERSAL_EXAMS, CIVIL_SUBJECTS, APSC_PHED_CIVIL_SUBJECTS, getExamHierarchy } from '@/services/universalTaxonomy';
import { getMasterQuestionPool } from '@/services/adminMockMakerService';
import { getAllCombinedMockTests } from '@/services/adminPaperService';
import {
  getAllSyllabusBlueprints,
  SyllabusBlueprint,
  deleteSyllabusBlueprint,
  APSC_PHED_AE_CIVIL_2025_SYLLABUS
} from '@/services/syllabusBlueprintService';
import { SyllabusImportModal } from '../SyllabusImportModal';
import { MOCK_TESTS } from '@/data/mockData';
import { AdminSectionId } from '../AdminSidebar';

interface ExamsCoursesSectionProps {
  onNavigate: (section: AdminSectionId, payload?: any) => void;
}

export const ExamsCoursesSection: React.FC<ExamsCoursesSectionProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'taxonomy' | 'syllabi'>('syllabi');
  const [selectedExamId, setSelectedExamId] = useState<string>('apsc-phed-ae-civil-2025');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [syllabi, setSyllabi] = useState<SyllabusBlueprint[]>(() => getAllSyllabusBlueprints());
  const [selectedSyllabusId, setSelectedSyllabusId] = useState<string>(APSC_PHED_AE_CIVIL_2025_SYLLABUS.id);

  const allTests = useMemo(() => getAllCombinedMockTests(MOCK_TESTS), []);
  const allQuestions = useMemo(() => getMasterQuestionPool(), []);

  const refreshSyllabi = () => {
    setSyllabi(getAllSyllabusBlueprints());
  };

  useEffect(() => {
    const handleUpdate = () => refreshSyllabi();
    window.addEventListener('exampilot_syllabi_updated', handleUpdate);
    return () => window.removeEventListener('exampilot_syllabi_updated', handleUpdate);
  }, []);

  const selectedExam = useMemo(() => {
    return UNIVERSAL_EXAMS.find((e) => e.id === selectedExamId) || UNIVERSAL_EXAMS[0];
  }, [selectedExamId]);

  const selectedSyllabus = useMemo(() => {
    return syllabi.find((s) => s.id === selectedSyllabusId) || syllabi[0] || APSC_PHED_AE_CIVIL_2025_SYLLABUS;
  }, [syllabi, selectedSyllabusId]);

  // Associated mock tests for selected exam
  const associatedTests = useMemo(() => {
    return allTests.filter((t) => t.examId?.toLowerCase().includes(selectedExamId.toLowerCase()));
  }, [allTests, selectedExamId]);

  // Active subjects for selected exam
  const activeExamSubjects = useMemo(() => {
    const hierarchy = getExamHierarchy(selectedExamId);
    if (hierarchy?.subjects && hierarchy.subjects.length > 0) {
      return hierarchy.subjects;
    }
    return CIVIL_SUBJECTS;
  }, [selectedExamId]);

  const handleDeleteCustomSyllabus = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this custom syllabus blueprint?')) {
      await deleteSyllabusBlueprint(id);
      refreshSyllabi();
      if (selectedSyllabusId === id) {
        setSelectedSyllabusId(APSC_PHED_AE_CIVIL_2025_SYLLABUS.id);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <Card flush className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-line bg-gradient-to-r from-card via-card to-subtle/50">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-base sm:text-lg text-ink">
              Examination Curricula &amp; Syllabus Blueprints
            </h2>
            <Badge tone="brand" size="sm">Official Framework</Badge>
          </div>
          <p className="text-xs text-muted">
            Official state commission syllabi (such as APSC PHED AE Civil 2025), custom blueprints, and 1-click mock test generator.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsImportModalOpen(true)}
            iconLeft={<Plus className="w-3.5 h-3.5" />}
          >
            Add Custom Syllabus
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => onNavigate('test-maker', { syllabusId: selectedSyllabus.id, examId: selectedExamId })}
            iconLeft={<Sparkles className="w-3.5 h-3.5" />}
          >
            Create Mock from Syllabus
          </Button>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-line pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('syllabi')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'syllabi'
              ? 'bg-primary text-white shadow-sm'
              : 'text-muted hover:text-ink hover:bg-subtle'
          }`}
        >
          <FileText className="w-4 h-4" />
          Official Syllabus Blueprints
          <Badge tone={activeTab === 'syllabi' ? 'brand' : 'default'} className="ml-1 text-[10px]">
            {syllabi.length}
          </Badge>
        </button>

        <button
          onClick={() => setActiveTab('taxonomy')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'taxonomy'
              ? 'bg-primary text-white shadow-sm'
              : 'text-muted hover:text-ink hover:bg-subtle'
          }`}
        >
          <Award className="w-4 h-4" />
          Examination Catalog &amp; Taxonomy ({UNIVERSAL_EXAMS.length})
        </button>
      </div>

      {/* TAB 1: SYLLABUS BLUEPRINTS VIEW */}
      {activeTab === 'syllabi' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Registered Syllabi List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-display font-bold text-sm text-ink flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>Available Syllabi ({syllabi.length})</span>
              </h3>
              <Button size="sm" variant="ghost" className="text-xs" onClick={() => setIsImportModalOpen(true)}>
                + New
              </Button>
            </div>

            <div className="space-y-2">
              {syllabi.map((syl) => {
                const isSelected = syl.id === selectedSyllabusId;
                return (
                  <div
                    key={syl.id}
                    onClick={() => setSelectedSyllabusId(syl.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition space-y-2 relative ${
                      isSelected
                        ? 'bg-primary/5 border-primary shadow-xs ring-1 ring-primary'
                        : 'bg-card border-line hover:border-line-strong'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                            {syl.examAgency}
                          </span>
                          {syl.isOfficial && (
                            <Badge tone="success" className="text-[9px] px-1.5 py-0">
                              Official APSC 31/2025
                            </Badge>
                          )}
                        </div>
                        <h4 className="font-semibold text-xs text-ink mt-1 line-clamp-2">{syl.title}</h4>
                      </div>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      ) : !syl.isOfficial ? (
                        <button
                          onClick={(e) => handleDeleteCustomSyllabus(syl.id, e)}
                          className="text-muted hover:text-danger-text p-1"
                          title="Delete custom syllabus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      ) : null}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-muted-faint pt-1.5 border-t border-line/60">
                      <span>{syl.modules.length} Modules · {syl.totalQuestions} MCQs</span>
                      <span className="font-semibold text-primary">{syl.durationMinutes} mins</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Syllabus Detailed Inspector */}
          <div className="lg:col-span-2 space-y-5">
            <Card flush className="p-6 space-y-5 border-line">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-line">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge tone="brand" size="sm">{selectedSyllabus.examAgency}</Badge>
                    {selectedSyllabus.isOfficial && (
                      <Badge tone="success" size="sm">Verified Official Notice</Badge>
                    )}
                    {selectedSyllabus.advertNo && (
                      <span className="text-xs font-mono text-muted">{selectedSyllabus.advertNo}</span>
                    )}
                  </div>
                  <h3 className="font-display font-bold text-lg text-ink mt-1.5">
                    {selectedSyllabus.title}
                  </h3>
                  <p className="text-xs text-muted">
                    {selectedSyllabus.paper} &bull; {selectedSyllabus.standard}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => onNavigate('test-maker', { syllabusId: selectedSyllabus.id })}
                    iconLeft={<Sparkles className="w-3.5 h-3.5" />}
                  >
                    Create Mock Test
                  </Button>
                </div>
              </div>

              {/* Spec Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-subtle border border-line text-center">
                  <div className="font-display font-bold text-xl text-ink">{selectedSyllabus.fullMarks}</div>
                  <div className="text-[10px] text-muted uppercase font-semibold">Full Marks</div>
                </div>
                <div className="p-3.5 rounded-xl bg-subtle border border-line text-center">
                  <div className="font-display font-bold text-xl text-ink">{selectedSyllabus.durationMinutes}m</div>
                  <div className="text-[10px] text-muted uppercase font-semibold">Exam Duration</div>
                </div>
                <div className="p-3.5 rounded-xl bg-subtle border border-line text-center">
                  <div className="font-display font-bold text-xl text-primary">{selectedSyllabus.totalQuestions}</div>
                  <div className="text-[10px] text-muted uppercase font-semibold">Objective MCQs</div>
                </div>
                <div className="p-3.5 rounded-xl bg-subtle border border-line text-center">
                  <div className="font-display font-bold text-xl text-rose-500">
                    -{selectedSyllabus.negativeMarksPerIncorrect}
                  </div>
                  <div className="text-[10px] text-muted uppercase font-semibold">Negative Marking</div>
                </div>
              </div>

              {/* Modules & Topics Breakdown */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-xs text-ink uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-primary" />
                    <span>Syllabus Modules &amp; Prescribed Topics ({selectedSyllabus.modules.length})</span>
                  </h4>
                  <span className="text-[11px] text-muted font-medium">
                    Total {selectedSyllabus.modules.flatMap((m) => m.topics).length} Curriculum Topics
                  </span>
                </div>

                <div className="space-y-3">
                  {selectedSyllabus.modules.map((mod, idx) => (
                    <div
                      key={mod.id}
                      className="p-4 rounded-xl border border-line bg-surface hover:border-primary/40 transition space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-bold text-xs text-ink">{mod.name}</span>
                          {mod.description && (
                            <p className="text-[11px] text-muted mt-0.5">{mod.description}</p>
                          )}
                        </div>
                        <Badge tone="brand" className="text-[10px]">
                          ~{mod.suggestedWeight || Math.round(100 / selectedSyllabus.modules.length)} Questions
                        </Badge>
                      </div>

                      {/* Topics pills */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {mod.topics.map((t, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded-md bg-subtle/70 border border-line text-[11px] text-ink"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: UNIVERSAL EXAM CATALOG & TAXONOMY VIEW */}
      {activeTab === 'taxonomy' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Exam Catalog List */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-sm text-ink flex items-center gap-2 px-1">
              <Award className="w-4 h-4 text-primary" />
              <span>Target Examinations ({UNIVERSAL_EXAMS.length})</span>
            </h3>

            <div className="space-y-2">
              {UNIVERSAL_EXAMS.map((exam) => {
                const isSelected = exam.id === selectedExamId;
                const testCount = allTests.filter((t) => t.examId?.includes(exam.id)).length;

                return (
                  <div
                    key={exam.id}
                    onClick={() => setSelectedExamId(exam.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition space-y-2 ${
                      isSelected
                        ? 'bg-primary/5 border-primary shadow-xs'
                        : 'bg-card border-line hover:border-line-strong'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                          {exam.category}
                        </span>
                        <h4 className="font-semibold text-xs text-ink mt-0.5">{exam.name}</h4>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-muted-faint pt-1 border-t border-line/60">
                      <span>{exam.totalMarks} Marks · {exam.durationHours} hrs</span>
                      <span className="font-semibold text-primary">{testCount} Tests</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Exam Blueprint & Associated Subjects */}
          <div className="lg:col-span-2 space-y-5">
            <Card flush className="p-6 space-y-5 border-primary/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-line">
                <div>
                  <Badge tone="brand" size="sm">{selectedExam.category}</Badge>
                  <h3 className="font-display font-bold text-lg text-ink mt-1.5">{selectedExam.name}</h3>
                  <p className="text-xs text-muted mt-0.5">{selectedExam.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onNavigate('test-maker', { examId: selectedExam.id })}
                  >
                    New Mock Test
                  </Button>
                </div>
              </div>

              {/* Spec Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-subtle border border-line text-center">
                  <div className="font-display font-bold text-xl text-ink">{selectedExam.totalMarks}</div>
                  <div className="text-[10px] text-muted uppercase font-semibold">Standard Marks</div>
                </div>
                <div className="p-3.5 rounded-xl bg-subtle border border-line text-center">
                  <div className="font-display font-bold text-xl text-ink">{selectedExam.durationHours} hrs</div>
                  <div className="text-[10px] text-muted uppercase font-semibold">Standard Duration</div>
                </div>
                <div className="p-3.5 rounded-xl bg-subtle border border-line text-center">
                  <div className="font-display font-bold text-xl text-primary">{associatedTests.length}</div>
                  <div className="text-[10px] text-muted uppercase font-semibold">Live CBT Tests</div>
                </div>
                <div className="p-3.5 rounded-xl bg-subtle border border-line text-center">
                  <div className="font-display font-bold text-xl text-success">
                    {allQuestions.filter((q) => q.examId?.includes(selectedExam.id)).length || '1,000+'}
                  </div>
                  <div className="text-[10px] text-muted uppercase font-semibold">Question Pool</div>
                </div>
              </div>

              {/* Associated Subjects Breakdown */}
              <div className="space-y-3 pt-2">
                <h4 className="font-display font-bold text-xs text-ink uppercase tracking-wider">
                  Core Curriculum Modules ({activeExamSubjects.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeExamSubjects.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-3 rounded-xl border border-line bg-surface flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-semibold text-ink truncate">{sub.name}</div>
                        <div className="text-[10px] text-muted truncate">
                          {sub.domains.length} Units · {sub.domains.flatMap((d) => d.topics).length} Topics
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-muted flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Associated Live CBT Tests */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-xs text-ink uppercase tracking-wider">
                    Associated Published CBT Tests ({associatedTests.length})
                  </h4>
                </div>

                {associatedTests.length === 0 ? (
                  <div className="p-6 text-center text-xs text-muted border border-dashed rounded-xl">
                    No mock tests currently assigned to this examination code. Click &ldquo;Create Test for Exam&rdquo; to build one.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {associatedTests.map((t) => (
                      <div
                        key={t.id}
                        className="p-3 rounded-xl border border-line bg-surface hover:border-primary/40 transition flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-xs text-ink">{t.title}</div>
                          <div className="text-[11px] text-muted">
                            {t.sections.reduce((acc, s) => acc + s.questions.length, 0)} MCQs · {t.durationMinutes}m · {t.totalMarks} Marks
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onNavigate('mock-tests', { selectedMockId: t.id })}
                        >
                          Manage
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Syllabus Ingestion / Add Modal */}
      <SyllabusImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSyllabusSaved={(saved) => {
          refreshSyllabi();
          setSelectedSyllabusId(saved.id);
        }}
      />
    </div>
  );
};
