import React, { useState, useMemo } from 'react';
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
  Tag
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { UNIVERSAL_EXAMS, CIVIL_SUBJECTS } from '@/services/universalTaxonomy';
import { getMasterQuestionPool } from '@/services/adminMockMakerService';
import { getAllCombinedMockTests } from '@/services/adminPaperService';
import { MOCK_TESTS } from '@/data/mockData';
import { AdminSectionId } from '../AdminSidebar';

interface ExamsCoursesSectionProps {
  onNavigate: (section: AdminSectionId, payload?: any) => void;
}

export const ExamsCoursesSection: React.FC<ExamsCoursesSectionProps> = ({ onNavigate }) => {
  const [selectedExamId, setSelectedExamId] = useState<string>(UNIVERSAL_EXAMS[0]?.id || 'apsc-ae-civil');
  const allTests = useMemo(() => getAllCombinedMockTests(MOCK_TESTS), []);
  const allQuestions = useMemo(() => getMasterQuestionPool(), []);

  const selectedExam = useMemo(() => {
    return UNIVERSAL_EXAMS.find((e) => e.id === selectedExamId) || UNIVERSAL_EXAMS[0];
  }, [selectedExamId]);

  // Associated mock tests for selected exam
  const associatedTests = useMemo(() => {
    return allTests.filter((t) => t.examId?.toLowerCase().includes(selectedExamId.toLowerCase()));
  }, [allTests, selectedExamId]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <Card flush className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-line bg-gradient-to-r from-card via-card to-subtle/50">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-base sm:text-lg text-ink">
              Examination Curricula & Syllabus Blueprints
            </h2>
            <Badge tone="brand" size="sm">Universal Taxonomy</Badge>
          </div>
          <p className="text-xs text-muted">
            Manage supported state and national competitive engineering examinations, scoring matrices, and branch domains.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => onNavigate('test-maker', { examId: selectedExamId })}
          iconLeft={<Plus className="w-3.5 h-3.5" />}
        >
          Create Test for Exam
        </Button>
      </Card>

      {/* Two Column Layout: Exam Catalog on Left, Blueprint Details on Right */}
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
          {/* Blueprint Detail Card */}
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
                Core Curriculum Subjects
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CIVIL_SUBJECTS.slice(0, 6).map((sub) => (
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
                  No mock tests currently assigned to this examination code.
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
    </div>
  );
};
