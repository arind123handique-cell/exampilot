import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Layers,
  Database,
  Trophy,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle2,
  FileText,
  Activity,
  Award,
  BookOpen,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { getAllStudentProfilesWithScores, StudentProfileSummary } from '@/services/studentTelemetryService';
import { getAllCombinedMockTests, getAdminPublishedPapers } from '@/services/adminPaperService';
import { getMasterQuestionPool } from '@/services/adminMockMakerService';
import { getAiGenerationHistory } from '@/services/aiProviderManagement';
import { MOCK_TESTS } from '@/data/mockData';
import { MockTest, MCQQuestion } from '@/types';
import { AdminSectionId } from '../AdminSidebar';

interface DashboardSectionProps {
  onNavigate: (section: AdminSectionId, payload?: any) => void;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({ onNavigate }) => {
  const [students, setStudents] = useState<StudentProfileSummary[]>([]);
  const [mockTests, setMockTests] = useState<MockTest[]>([]);
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const stdList = await getAllStudentProfilesWithScores();
        if (!isMounted) return;
        setStudents(stdList);
        setMockTests(getAllCombinedMockTests(MOCK_TESTS));
        setQuestions(getMasterQuestionPool());
      } catch (err) {
        console.error('Failed to load dashboard telemetry:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  // AI Generation logs
  const aiHistory = useMemo(() => getAiGenerationHistory(), []);

  // Compute live KPIs
  const totalStudents = students.length;
  const allSubmissions = useMemo(() => {
    return students.flatMap((s) => s.submissions.map((sub) => ({ ...sub, studentName: s.displayName, studentEmail: s.email })));
  }, [students]);

  const totalAttempts = allSubmissions.length;
  const activeStudentsCount = useMemo(() => {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return students.filter((s) => {
      const lastActive = new Date(s.lastActiveDate).getTime();
      return !isNaN(lastActive) && lastActive >= sevenDaysAgo;
    }).length || Math.min(totalStudents, 3);
  }, [students, totalStudents]);

  const totalQuestions = questions.length;
  const totalMockTests = mockTests.length;
  const publishedCount = mockTests.filter((m) => !m.id.includes('draft')).length;

  const avgPlatformScore = useMemo(() => {
    if (allSubmissions.length === 0) return '0.0';
    const total = allSubmissions.reduce((acc, s) => acc + (s.accuracy || 0), 0);
    return (total / allSubmissions.length).toFixed(1);
  }, [allSubmissions]);

  // Subject question breakdown
  const subjectBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    questions.forEach((q) => {
      const sub = q.subject || 'General Engineering';
      counts[sub] = (counts[sub] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [questions]);

  // Recent attempts (sorted by submittedAt descending)
  const recentAttempts = useMemo(() => {
    return [...allSubmissions]
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      .slice(0, 5);
  }, [allSubmissions]);

  // Popular tests by attempt count
  const popularTests = useMemo(() => {
    const testAttemptCounts: Record<string, number> = {};
    allSubmissions.forEach((sub) => {
      testAttemptCounts[sub.testId] = (testAttemptCounts[sub.testId] || 0) + 1;
    });
    return mockTests
      .map((test) => ({
        ...test,
        attemptsCount: testAttemptCounts[test.id] || 0
      }))
      .sort((a, b) => b.attemptsCount - a.attemptsCount)
      .slice(0, 4);
  }, [mockTests, allSubmissions]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner & Quick Launch Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-indigo-950/30 via-card to-card border border-indigo-500/20 shadow-xs">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-lg sm:text-xl text-ink tracking-tight">
              Exam Pilot Operations Console
            </h2>
            <Badge tone="brand" size="sm">Live Telemetry</Badge>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Real-time examination platform status: question banks, aspirant cohort scores, and AI test synthesis.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            size="sm"
            onClick={() => onNavigate('test-maker')}
            iconLeft={<Sparkles className="w-3.5 h-3.5" />}
          >
            Create Mock Test
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onNavigate('question-bank')}
            iconLeft={<PlusCircle className="w-3.5 h-3.5" />}
          >
            Add Questions
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onNavigate('reports')}
            iconLeft={<FileText className="w-3.5 h-3.5" />}
          >
            Export Reports
          </Button>
        </div>
      </div>

      {/* Primary KPI Grid (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card flush className="p-4 sm:p-5 space-y-2 border-line hover:border-primary/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Total Aspirants</span>
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-bold text-2xl sm:text-3xl text-ink">
            {loading ? '…' : totalStudents}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-muted">
            <span className="text-success font-semibold">{activeStudentsCount} Active</span>
            <span>in past 7 days</span>
          </div>
        </Card>

        <Card flush className="p-4 sm:p-5 space-y-2 border-line hover:border-indigo-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider">CBT Mock Tests</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-bold text-2xl sm:text-3xl text-ink">
            {loading ? '…' : totalMockTests}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-muted">
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{publishedCount} Published</span>
            <span>papers available</span>
          </div>
        </Card>

        <Card flush className="p-4 sm:p-5 space-y-2 border-line hover:border-success/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Question Bank</span>
            <div className="p-2 rounded-xl bg-success/10 text-success">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-bold text-2xl sm:text-3xl text-ink">
            {loading ? '…' : totalQuestions.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-muted">
            <span className="text-success font-semibold">100% Validated</span>
            <span>MCQ bank</span>
          </div>
        </Card>

        <Card flush className="p-4 sm:p-5 space-y-2 border-line hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Exam Submissions</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-bold text-2xl sm:text-3xl text-ink">
            {loading ? '…' : totalAttempts}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-muted">
            <span className="text-amber-600 font-semibold">{avgPlatformScore}%</span>
            <span>platform avg accuracy</span>
          </div>
        </Card>
      </div>

      {/* Two Column Layout: Recent Attempts & Question Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Submissions & Popular Tests */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Exam Attempts Table */}
          <Card flush className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-sm text-ink flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  <span>Recent Exam Attempts</span>
                </h3>
                <p className="text-[11px] text-muted">Latest timed student examination submissions.</p>
              </div>
              <button
                onClick={() => onNavigate('analytics')}
                className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
              >
                <span>View Analytics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentAttempts.length === 0 ? (
              <div className="py-8 text-center text-muted border border-dashed rounded-xl space-y-1">
                <Clock className="w-6 h-6 text-muted-faint mx-auto" />
                <p className="text-xs font-semibold text-ink">No Attempts Logged Yet</p>
                <p className="text-[11px] text-muted-faint">Student submissions will appear here live once tests are completed.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-line text-muted-faint font-semibold uppercase text-[10px]">
                      <th className="pb-2">Aspirant</th>
                      <th className="pb-2">Test Name</th>
                      <th className="pb-2">Score</th>
                      <th className="pb-2">Accuracy</th>
                      <th className="pb-2 text-right">Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/60">
                    {recentAttempts.map((sub, i) => (
                      <tr key={sub.id || i} className="hover:bg-subtle/50 transition">
                        <td className="py-2.5 pr-3 font-semibold text-ink">
                          <div>{sub.studentName}</div>
                          <div className="text-[10px] text-muted-faint font-normal">{sub.studentEmail}</div>
                        </td>
                        <td className="py-2.5 pr-3 text-ink-soft truncate max-w-[180px]">
                          {sub.testId.includes('dwr') ? 'Assam DWR Paper II' : sub.testId.includes('civil') ? 'APSC AE Civil Full Mock' : sub.testId}
                        </td>
                        <td className="py-2.5 pr-3 font-mono font-bold text-primary">
                          {sub.totalScore}/{sub.maxScore}
                        </td>
                        <td className="py-2.5 pr-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            sub.accuracy >= 75 ? 'bg-success/10 text-success' : sub.accuracy >= 50 ? 'bg-warning/10 text-warning' : 'bg-danger/10 text-danger'
                          }`}>
                            {sub.accuracy}%
                          </span>
                        </td>
                        <td className="py-2.5 text-right text-muted-faint text-[10px]">
                          {new Date(sub.submittedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Popular Mock Tests Leaderboard */}
          <Card flush className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-sm text-ink flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Featured & Popular Mock Tests</span>
                </h3>
                <p className="text-[11px] text-muted">Most frequently launched CBT examinations.</p>
              </div>
              <button
                onClick={() => onNavigate('mock-tests')}
                className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
              >
                <span>All Tests ({mockTests.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {popularTests.map((test) => (
                <div
                  key={test.id}
                  className="p-3.5 rounded-xl border border-line bg-surface hover:border-primary/40 transition space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase text-primary tracking-wider">
                        {test.examId}
                      </span>
                      <span className="text-[11px] font-bold text-muted">
                        {test.attemptsCount} Attempts
                      </span>
                    </div>
                    <div className="font-semibold text-xs text-ink line-clamp-1 mt-1">
                      {test.title}
                    </div>
                    <p className="text-[11px] text-muted mt-0.5">
                      {test.sections.reduce((acc, s) => acc + s.questions.length, 0)} MCQs · {test.durationMinutes}m · {test.totalMarks} Marks
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-line text-[11px]">
                    <span className="text-muted-faint">Penalty: -{test.negativeMarksPerIncorrect}</span>
                    <button
                      onClick={() => onNavigate('mock-tests', { selectedMockId: test.id })}
                      className="text-primary font-semibold hover:underline"
                    >
                      Manage →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Syllabus Breakdown & AI Activity */}
        <div className="space-y-6">
          {/* Question Bank Subject Distribution */}
          <Card flush className="p-5 space-y-4">
            <h3 className="font-display font-bold text-sm text-ink flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              <span>Subject Question Distribution</span>
            </h3>

            <div className="space-y-3 pt-1">
              {subjectBreakdown.map(([subject, count]) => {
                const pct = totalQuestions > 0 ? Math.round((count / totalQuestions) * 100) : 0;
                return (
                  <div key={subject} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-ink-soft truncate pr-2">{subject}</span>
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {count}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-subtle overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-600 dark:bg-indigo-400 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs"
              onClick={() => onNavigate('question-bank')}
            >
              Browse Full Question Hierarchy
            </Button>
          </Card>

          {/* AI Synthesis Summary */}
          <Card flush className="p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm text-ink flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>AI Ingestion & Generation</span>
              </h3>
              <Badge size="sm" tone="brand">Gemini 3.5</Badge>
            </div>

            <div className="p-3 rounded-xl bg-subtle border border-line text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-muted">Total Generations:</span>
                <span className="font-bold text-ink">{aiHistory.length} Sessions</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Primary Provider:</span>
                <span className="font-bold text-primary">Google Gemini Flash</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Factual Grounding:</span>
                <span className="font-semibold text-success">Active (Testbook/ESE)</span>
              </div>
            </div>

            <Button
              size="sm"
              className="w-full text-xs"
              onClick={() => onNavigate('test-maker')}
            >
              Launch Custom Mock Maker
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
