import React, { useState } from 'react';
import {
  User,
  Mail,
  Calendar,
  Clock,
  Trophy,
  Award,
  CheckCircle2,
  XCircle,
  Eye,
  BookOpen,
  ArrowLeft,
  Flame,
  ShieldCheck,
  BarChart2,
  FileText,
  Copy,
  Check
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { StudentProfileSummary } from '../../services/studentTelemetryService';
import { TestSubmission } from '../../types';

interface StudentProfileDossierProps {
  student: StudentProfileSummary;
  onBack?: () => void;
  isSelfProfile?: boolean;
}

export const StudentProfileDossier: React.FC<StudentProfileDossierProps> = ({
  student,
  onBack,
  isSelfProfile = false
}) => {
  const [copiedUid, setCopiedUid] = useState(false);
  const [inspectingSubmission, setInspectingSubmission] = useState<TestSubmission | null>(null);

  const handleCopyUid = () => {
    navigator.clipboard.writeText(student.uid);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2000);
  };

  const avgScore = student.testsAttempted > 0
    ? (student.totalScoreSum / student.testsAttempted).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* Back button */}
      {onBack && (
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Students List</span>
          </button>
          <span className="text-xs text-muted">
            Student UID: <code className="font-mono">{student.uid}</code>
          </span>
        </div>
      )}

      {/* Profile Identity Card */}
      <Card flush className="p-6 sm:p-8 bg-gradient-to-r from-indigo-950/20 via-card to-card border-indigo-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-display font-bold text-2xl flex items-center justify-center shadow-md shadow-indigo-600/30 flex-shrink-0">
              {student.photoURL ? (
                <img src={student.photoURL} alt="" className="w-full h-full rounded-2xl object-cover" />
              ) : (
                student.displayName.charAt(0).toUpperCase()
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display font-bold text-xl sm:text-2xl text-ink">
                  {student.displayName}
                </h1>
                <Badge tone="brand" size="sm">
                  {isSelfProfile ? 'Active Student Session' : 'Enrolled Aspirant'}
                </Badge>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted flex-wrap">
                <span className="flex items-center gap-1 text-ink-soft">
                  <Mail className="w-3.5 h-3.5 text-muted" />
                  <span>{student.email}</span>
                </span>
                <span className="text-muted-faint">•</span>
                <button
                  onClick={handleCopyUid}
                  className="flex items-center gap-1 font-mono text-[11px] text-muted hover:text-ink transition"
                  title="Click to copy UID"
                >
                  <span>UID: {student.uid.slice(0, 14)}...</span>
                  {copiedUid ? <Check className="w-3 h-3 text-success-text" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-1.5 text-xs text-muted">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold text-xs border border-indigo-500/20">
              🎯 {student.targetExam} ({student.targetYear})
            </span>
            <span className="text-[11px]">
              Enrolled: <strong>{student.registeredDate}</strong> · Daily Goal: <strong>{student.dailyHoursGoal} hrs/day</strong>
            </span>
          </div>
        </div>

        {/* 4 Performance Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-line">
          <div className="p-4 rounded-xl bg-subtle border border-line space-y-1">
            <div className="text-[10px] uppercase font-bold text-muted-faint">Tests Taken</div>
            <div className="font-display font-bold text-2xl text-ink">
              {student.testsAttempted}
            </div>
            <div className="text-[10px] text-muted">CBT Exam Attempts</div>
          </div>

          <div className="p-4 rounded-xl bg-subtle border border-line space-y-1">
            <div className="text-[10px] uppercase font-bold text-muted-faint">Average Score</div>
            <div className="font-display font-bold text-2xl text-indigo-600 dark:text-indigo-400">
              {avgScore}
            </div>
            <div className="text-[10px] text-muted">Marks Per Attempt</div>
          </div>

          <div className="p-4 rounded-xl bg-subtle border border-line space-y-1">
            <div className="text-[10px] uppercase font-bold text-muted-faint">Overall Accuracy</div>
            <div className={`font-display font-bold text-2xl ${student.averageAccuracy >= 75 ? 'text-success-text' : student.averageAccuracy >= 60 ? 'text-amber-600' : 'text-danger-text'}`}>
              {student.averageAccuracy}%
            </div>
            <div className="text-[10px] text-muted">Precision Rate</div>
          </div>

          <div className="p-4 rounded-xl bg-subtle border border-line space-y-1">
            <div className="text-[10px] uppercase font-bold text-muted-faint">Exam Readiness</div>
            <div className="font-display font-bold text-2xl text-primary">
              {student.readinessScore}%
            </div>
            <div className="text-[10px] text-muted">Accuracy-based, not a rank</div>
          </div>
        </div>
      </Card>

      {/* Two Column Layout: Subject Mastery & Test History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Subject Mastery Breakdown */}
        <Card flush className="p-5 space-y-4">
          <h2 className="font-display font-bold text-sm text-ink flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-indigo-500" />
            <span>Subject Mastery Profile</span>
          </h2>

          <div className="space-y-3.5 pt-1">
            {Object.keys(student.subjectMastery).length === 0 && (
              <p className="text-[11px] leading-relaxed text-muted">
                No subject breakdown yet. It is derived from the questions actually answered in
                submitted mocks, so it appears after the first attempt.
              </p>
            )}
            {Object.entries(student.subjectMastery).map(([subject, mastery]) => (
              <div key={subject} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-ink-soft truncate">{subject}</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{mastery}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-subtle overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      mastery >= 80 ? 'bg-success' : mastery >= 65 ? 'bg-indigo-500' : 'bg-warning'
                    }`}
                    style={{ width: `${mastery}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-subtle border border-line text-[11px] text-muted space-y-1 mt-4">
            <div className="font-semibold text-ink">Performance Summary:</div>
            {Object.keys(student.subjectMastery).length === 0 ? (
              <p>Not enough attempted questions yet to summarise performance.</p>
            ) : (
              (() => {
                const ranked = Object.entries(student.subjectMastery).sort((a, b) => b[1] - a[1]);
                const strongest = ranked[0];
                const weakest = ranked[ranked.length - 1];
                return (
                  <p>
                    Strongest in <strong>{strongest[0]}</strong> ({strongest[1]}%). Lowest accuracy in{' '}
                    <strong>{weakest[0]}</strong> ({weakest[1]}%) — the highest-yield place to spend the next revision block.
                  </p>
                );
              })()
            )}
          </div>
        </Card>

        {/* Right: Mock Test Attempt Ledger (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <Card flush className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-sm text-ink flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  <span>Mock Test Attempt History ({student.submissions.length})</span>
                </h2>
                <p className="text-[11px] text-muted mt-0.5">
                  Complete ledger of every timed examination submitted by this student.
                </p>
              </div>
            </div>

            {student.submissions.length === 0 ? (
              <div className="p-8 text-center space-y-2 border border-dashed rounded-xl">
                <Clock className="w-8 h-8 text-muted-faint mx-auto" />
                <p className="text-xs font-semibold text-ink">No Mock Tests Submitted Yet</p>
                <p className="text-[11px] text-muted">Test scores will appear here once the student finishes an assigned exam.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {student.submissions.map((sub, idx) => {
                  const isInspecting = inspectingSubmission?.id === sub.id;
                  return (
                    <div
                      key={sub.id}
                      className="p-4 rounded-xl border border-line bg-surface hover:border-line-strong transition space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-[10px]">
                              Attempt #{student.submissions.length - idx}
                            </span>
                            <span className="font-semibold text-ink">
                              {sub.testId.includes('dwr') ? 'Assam DWR 2026 (Paper II: GS & English)' : sub.testId.includes('civil') ? 'APSC AE Civil Engineering (Paper II)' : 'General Studies Paper I'}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted mt-1">
                            Submitted: {new Date(sub.submittedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })} · Time: {Math.round(sub.timeSpentSeconds / 60)} mins
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-display font-bold text-base text-indigo-600 dark:text-indigo-400">
                              {sub.totalScore} / {sub.maxScore}
                            </div>
                            <div className="text-[10px] text-muted">{sub.accuracy}% Accuracy</div>
                          </div>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setInspectingSubmission(isInspecting ? null : sub)}
                            iconRight={<Eye className="w-3.5 h-3.5" />}
                          >
                            {isInspecting ? 'Hide Breakdown' : 'View Scores'}
                          </Button>
                        </div>
                      </div>

                      {/* Expanded Answer Breakdown */}
                      {isInspecting && (
                        <div className="pt-3 border-t border-line space-y-3 text-xs animate-fadeIn">
                          <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div className="p-2.5 rounded-lg bg-success-surface border border-success-border text-success-text">
                              <div className="font-bold text-base">{sub.correctCount}</div>
                              <div className="text-[10px]">Correct</div>
                            </div>
                            <div className="p-2.5 rounded-lg bg-danger-surface border border-danger-border text-danger-text">
                              <div className="font-bold text-base">{sub.incorrectCount}</div>
                              <div className="text-[10px]">Incorrect</div>
                            </div>
                            <div className="p-2.5 rounded-lg bg-subtle border border-line text-muted">
                              <div className="font-bold text-base">{sub.unattemptedCount}</div>
                              <div className="text-[10px]">Unanswered</div>
                            </div>
                          </div>

                          <div className="p-3 rounded-lg bg-subtle border border-line text-[11px] text-muted">
                            Attempted: <strong>{sub.totalAttempted}</strong> · Correct:{' '}
                            <strong>{sub.correctCount}</strong> · Time:{' '}
                            <strong>{Math.round(sub.timeSpentSeconds / 60)} min</strong>
                            <span className="mt-1 block text-muted-faint">
                              A cohort percentile needs other candidates' scores, so it is not shown
                              until real cohort data exists.
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
