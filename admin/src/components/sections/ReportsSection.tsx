import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Download,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Users,
  Layers,
  BarChart2,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Clock,
  ArrowUpDown
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { getAllStudentProfilesWithScores, StudentProfileSummary } from '@/services/studentTelemetryService';
import { getAllCombinedMockTests } from '@/services/adminPaperService';
import { getMasterQuestionPool } from '@/services/adminMockMakerService';
import { MOCK_TESTS } from '@/data/mockData';
import { CIVIL_SUBJECTS, SSC_CGL_SUBJECTS } from '@/services/universalTaxonomy';
import { MockTest, MCQQuestion } from '@/types';
import { AdminSectionId } from '../AdminSidebar';

interface ReportsSectionProps {
  onNavigate: (section: AdminSectionId, payload?: any) => void;
}

type ReportTab = 'coverage' | 'telemetry' | 'tests' | 'exports';

export const ReportsSection: React.FC<ReportsSectionProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<ReportTab>('coverage');
  const [students, setStudents] = useState<StudentProfileSummary[]>([]);
  const [mockTests, setMockTests] = useState<MockTest[]>([]);
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [coverageFilter, setCoverageFilter] = useState<'all' | 'low' | 'good'>('all');

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const std = await getAllStudentProfilesWithScores();
        if (!isMounted) return;
        setStudents(std);
        setMockTests(getAllCombinedMockTests(MOCK_TESTS));
        setQuestions(getMasterQuestionPool());
      } catch (err) {
        console.error('Failed to load reports data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute coverage by subject & topic
  const coverageData = useMemo(() => {
    const topicCounts: Record<string, { subject: string; branch: string; count: number }> = {};

    // Seed from Civil Engineering subjects
    CIVIL_SUBJECTS.forEach(subj => {
      subj.domains.forEach(dom => {
        dom.topics.forEach(t => {
          topicCounts[t.name] = {
            subject: subj.name,
            branch: subj.id === 'sub-gs' ? 'General Studies' : 'Civil Engineering',
            count: 0
          };
        });
      });
    });

    // Seed from SSC / General Studies subjects
    SSC_CGL_SUBJECTS.forEach(subj => {
      subj.domains.forEach(dom => {
        dom.topics.forEach(t => {
          topicCounts[t.name] = {
            subject: subj.name,
            branch: 'General Studies',
            count: 0
          };
        });
      });
    });

    // Count actual questions
    questions.forEach(q => {
      const topic = q.topic || 'General';
      const subj = q.subject || 'General';
      if (!topicCounts[topic]) {
        topicCounts[topic] = {
          subject: subj,
          branch: subj.toLowerCase().includes('civil') || subj.toLowerCase().includes('fluid') || subj.toLowerCase().includes('soil')
            ? 'Civil Engineering'
            : 'General Studies',
          count: 0
        };
      }
      topicCounts[topic].count += 1;
    });

    return Object.entries(topicCounts).map(([topic, data]) => ({
      topic,
      subject: data.subject,
      branch: data.branch,
      count: data.count,
      targetBenchmark: 25,
      percentage: Math.min(100, Math.round((data.count / 25) * 100)),
      status: data.count >= 20 ? 'adequate' : data.count >= 10 ? 'moderate' : 'critical'
    }));
  }, [questions]);

  // Filtered coverage items
  const filteredCoverage = useMemo(() => {
    return coverageData.filter(item => {
      const matchSearch =
        item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchQuery.toLowerCase());

      const matchBranch =
        selectedBranch === 'all' ||
        (selectedBranch === 'civil' && item.branch.toLowerCase().includes('civil')) ||
        (selectedBranch === 'gs' && (item.branch.toLowerCase().includes('general') || item.branch.toLowerCase().includes('assam')));

      const matchCoverage =
        coverageFilter === 'all' ||
        (coverageFilter === 'low' && item.count < 10) ||
        (coverageFilter === 'good' && item.count >= 20);

      return matchSearch && matchBranch && matchCoverage;
    });
  }, [coverageData, searchQuery, selectedBranch, coverageFilter]);

  // Flat list of all student submissions
  const allSubmissions = useMemo(() => {
    const list: Array<{
      studentName: string;
      studentEmail: string;
      targetExam: string;
      testId: string;
      testTitle: string;
      score: number;
      maxScore: number;
      accuracy: number;
      percentile: number;
      submittedAt: string;
      timeSpent: number;
    }> = [];

    students.forEach(std => {
      (std.submissions || []).forEach(sub => {
        const mock = mockTests.find(m => m.id === sub.testId);
        list.push({
          studentName: std.displayName,
          studentEmail: std.email,
          targetExam: std.targetExam,
          testId: sub.testId,
          testTitle: mock?.title || sub.testId,
          score: sub.totalScore,
          maxScore: sub.maxScore || 100,
          accuracy: sub.accuracy,
          percentile: sub.percentile || 0,
          submittedAt: sub.submittedAt,
          timeSpent: sub.timeSpentSeconds
        });
      });
    });

    return list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }, [students, mockTests]);

  // Export CSV functions
  const downloadCsv = (filename: string, csvContent: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportStudentTelemetryCsv = () => {
    const headers = ['Student Name', 'Email', 'Target Exam', 'Test Name', 'Score', 'Max Score', 'Accuracy (%)', 'Percentile', 'Time Spent (min)', 'Date'];
    const rows = allSubmissions.map(s => [
      `"${s.studentName}"`,
      `"${s.studentEmail}"`,
      `"${s.targetExam}"`,
      `"${s.testTitle}"`,
      s.score,
      s.maxScore,
      s.accuracy,
      s.percentile,
      Math.round(s.timeSpent / 60),
      `"${new Date(s.submittedAt).toLocaleString()}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadCsv(`exampilot_student_telemetry_${new Date().toISOString().slice(0, 10)}.csv`, csvContent);
  };

  const exportQuestionBankCsv = () => {
    const headers = ['ID', 'Question', 'Subject', 'Topic', 'Difficulty', 'Correct Answer', 'Option A', 'Option B', 'Option C', 'Option D', 'PYQ Exam', 'PYQ Year'];
    const rows = questions.map(q => [
      `"${q.id}"`,
      `"${q.stem.replace(/"/g, '""')}"`,
      `"${q.subject || ''}"`,
      `"${q.topic || ''}"`,
      `"${q.difficulty || 'Medium'}"`,
      `"${q.options.find(o => o.id === q.correctAnswerId)?.text.replace(/"/g, '""') || ''}"`,
      `"${q.options[0]?.text.replace(/"/g, '""') || ''}"`,
      `"${q.options[1]?.text.replace(/"/g, '""') || ''}"`,
      `"${q.options[2]?.text.replace(/"/g, '""') || ''}"`,
      `"${q.options[3]?.text.replace(/"/g, '""') || ''}"`,
      `"${q.pyqExam || ''}"`,
      `"${q.pyqYear || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadCsv(`exampilot_questions_${new Date().toISOString().slice(0, 10)}.csv`, csvContent);
  };

  const exportMockTestsCsv = () => {
    const headers = ['Test ID', 'Title', 'Exam', 'Duration (Min)', 'Total Questions', 'Sections Count', 'Is Published'];
    const rows = mockTests.map(m => [
      `"${m.id}"`,
      `"${m.title.replace(/"/g, '""')}"`,
      `"${m.examCategory || 'Competitive'}"`,
      m.durationMinutes,
      m.totalQuestions,
      m.sections?.length || 0,
      m.isPublished ? 'Yes' : 'No'
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadCsv(`exampilot_mock_tests_${new Date().toISOString().slice(0, 10)}.csv`, csvContent);
  };

  const exportCoverageCsv = () => {
    const headers = ['Branch', 'Subject', 'Topic', 'Current Question Count', 'Target Benchmark', 'Coverage %', 'Status'];
    const rows = filteredCoverage.map(c => [
      `"${c.branch}"`,
      `"${c.subject}"`,
      `"${c.topic}"`,
      c.count,
      c.targetBenchmark,
      c.percentage,
      `"${c.status}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadCsv(`exampilot_curriculum_coverage_${new Date().toISOString().slice(0, 10)}.csv`, csvContent);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface border border-line p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold font-display text-ink flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Audit Reports & Data Exports
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Real-time curriculum coverage, student telemetry, CBT test logs, and raw dataset downloads
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            className="text-xs"
            onClick={exportStudentTelemetryCsv}
          >
            <Download className="w-3.5 h-3.5 mr-1 text-primary" />
            Student CSV
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs"
            onClick={exportQuestionBankCsv}
          >
            <Download className="w-3.5 h-3.5 mr-1 text-emerald-500" />
            Questions CSV
          </Button>
          <Button
            size="sm"
            variant="primary"
            className="text-xs"
            onClick={() => onNavigate('test-maker')}
          >
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            Fill Coverage Gap
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-line pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('coverage')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'coverage'
              ? 'bg-primary text-white shadow-sm'
              : 'text-muted hover:text-ink hover:bg-subtle'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Syllabus Coverage Audit
          <Badge tone={activeTab === 'coverage' ? 'brand' : 'default'} className="ml-1 text-[10px]">
            {filteredCoverage.length}
          </Badge>
        </button>

        <button
          onClick={() => setActiveTab('telemetry')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'telemetry'
              ? 'bg-primary text-white shadow-sm'
              : 'text-muted hover:text-ink hover:bg-subtle'
          }`}
        >
          <Users className="w-4 h-4" />
          Student Attempts Telemetry
          <Badge tone={activeTab === 'telemetry' ? 'brand' : 'default'} className="ml-1 text-[10px]">
            {allSubmissions.length}
          </Badge>
        </button>

        <button
          onClick={() => setActiveTab('tests')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'tests'
              ? 'bg-primary text-white shadow-sm'
              : 'text-muted hover:text-ink hover:bg-subtle'
          }`}
        >
          <Layers className="w-4 h-4" />
          CBT Test Performance Audit
          <Badge tone={activeTab === 'tests' ? 'brand' : 'default'} className="ml-1 text-[10px]">
            {mockTests.length}
          </Badge>
        </button>

        <button
          onClick={() => setActiveTab('exports')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'exports'
              ? 'bg-primary text-white shadow-sm'
              : 'text-muted hover:text-ink hover:bg-subtle'
          }`}
        >
          <Download className="w-4 h-4" />
          Export Hub
        </button>
      </div>

      {/* TAB 1: CURRICULUM COVERAGE AUDIT */}
      {activeTab === 'coverage' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-card p-4 rounded-xl border border-line">
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Filter by subject or topic name..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-line bg-surface text-xs focus:ring-1 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <select
                value={selectedBranch}
                onChange={e => setSelectedBranch(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-line bg-surface text-xs text-ink outline-none"
              >
                <option value="all">All Disciplines</option>
                <option value="civil">Civil Engineering</option>
                <option value="gs">General Studies & Assam</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={coverageFilter}
                onChange={e => setCoverageFilter(e.target.value as any)}
                className="w-full px-3 py-1.5 rounded-lg border border-line bg-surface text-xs text-ink outline-none"
              >
                <option value="all">All Coverage</option>
                <option value="low">Under-resourced (&lt; 10 Qs)</option>
                <option value="good">Adequate (&ge; 20 Qs)</option>
              </select>
              <Button size="sm" variant="outline" onClick={exportCoverageCsv} title="Download filtered report">
                <Download className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Coverage Table */}
          <Card className="overflow-hidden border-line">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-subtle/50 text-muted font-semibold border-b border-line">
                    <th className="py-3 px-4">Topic / Taxonomy Node</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4 text-center">Available Qs</th>
                    <th className="py-3 px-4">Coverage Progress</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filteredCoverage.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-muted">
                        No taxonomy topics found matching current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredCoverage.slice(0, 50).map(item => (
                      <tr key={item.topic} className="hover:bg-subtle/30 transition">
                        <td className="py-3 px-4">
                          <span className="font-semibold text-ink block">{item.topic}</span>
                          <span className="text-[10px] text-muted">{item.branch}</span>
                        </td>
                        <td className="py-3 px-4 text-muted font-medium">{item.subject}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-bold text-ink text-sm">{item.count}</span>
                          <span className="text-[10px] text-muted ml-0.5">/ {item.targetBenchmark}</span>
                        </td>
                        <td className="py-3 px-4 w-48">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 rounded-full bg-subtle overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  item.status === 'adequate'
                                    ? 'bg-emerald-500'
                                    : item.status === 'moderate'
                                    ? 'bg-amber-500'
                                    : 'bg-rose-500'
                                }`}
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-mono text-muted w-8">{item.percentage}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {item.status === 'adequate' ? (
                            <Badge tone="success" className="text-[10px]">
                              Adequate
                            </Badge>
                          ) : item.status === 'moderate' ? (
                            <Badge tone="warning" className="text-[10px]">
                              Moderate
                            </Badge>
                          ) : (
                            <Badge tone="danger" className="text-[10px]">
                              Deficit
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-[11px] text-primary hover:text-primary-hover"
                            onClick={() => onNavigate('test-maker', { topic: item.topic, subject: item.subject })}
                          >
                            <Sparkles className="w-3 h-3 mr-1" />
                            Generate Qs
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {filteredCoverage.length > 50 && (
              <div className="p-3 text-center text-xs text-muted border-t border-line bg-subtle/20">
                Showing top 50 of {filteredCoverage.length} topics. Use the search filter to narrow down results.
              </div>
            )}
          </Card>
        </div>
      )}

      {/* TAB 2: STUDENT ATTEMPTS TELEMETRY */}
      {activeTab === 'telemetry' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-4 rounded-xl border border-line">
            <p className="text-xs text-muted">
              Live submission records submitted by candidates in exam mode.
            </p>
            <Button size="sm" variant="outline" onClick={exportStudentTelemetryCsv} className="text-xs">
              <Download className="w-3.5 h-3.5 mr-1" />
              Download All Attempts CSV ({allSubmissions.length})
            </Button>
          </div>

          <Card className="overflow-hidden border-line">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-subtle/50 text-muted font-semibold border-b border-line">
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Test Attempted</th>
                    <th className="py-3 px-4 text-center">Score</th>
                    <th className="py-3 px-4 text-center">Accuracy</th>
                    <th className="py-3 px-4 text-center">Duration</th>
                    <th className="py-3 px-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {allSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-muted">
                        No student test submissions recorded yet. Submissions appear as students complete tests.
                      </td>
                    </tr>
                  ) : (
                    allSubmissions.slice(0, 30).map((sub, idx) => (
                      <tr key={idx} className="hover:bg-subtle/30 transition">
                        <td className="py-3 px-4">
                          <span className="font-semibold text-ink block">{sub.studentName}</span>
                          <span className="text-[10px] text-muted">{sub.studentEmail}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-ink block">{sub.testTitle}</span>
                          <span className="text-[10px] text-muted">{sub.targetExam}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-bold text-ink text-sm">{sub.score}</span>
                          <span className="text-[10px] text-muted"> / {sub.maxScore}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge
                            tone={sub.accuracy >= 75 ? 'success' : sub.accuracy >= 50 ? 'warning' : 'danger'}
                            className="text-[10px]"
                          >
                            {sub.accuracy}%
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-muted">
                          {Math.round(sub.timeSpent / 60)} min
                        </td>
                        <td className="py-3 px-4 text-right text-muted text-[11px]">
                          {new Date(sub.submittedAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {allSubmissions.length > 30 && (
              <div className="p-3 text-center text-xs text-muted border-t border-line bg-subtle/20">
                Showing recent 30 submissions. Use "Download All Attempts CSV" to export complete telemetry.
              </div>
            )}
          </Card>
        </div>
      )}

      {/* TAB 3: CBT TEST PERFORMANCE AUDIT */}
      {activeTab === 'tests' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-4 rounded-xl border border-line">
            <p className="text-xs text-muted">
              Inventory of all active CBT Mock Tests, section counts and duration metrics.
            </p>
            <Button size="sm" variant="outline" onClick={exportMockTestsCsv} className="text-xs">
              <Download className="w-3.5 h-3.5 mr-1" />
              Download Mock Tests Directory ({mockTests.length})
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockTests.map(test => {
              const testAttempts = allSubmissions.filter(s => s.testId === test.id);
              const avgScore = testAttempts.length
                ? Math.round(testAttempts.reduce((acc, curr) => acc + curr.score, 0) / testAttempts.length)
                : 0;

              return (
                <Card key={test.id} className="p-5 border-line flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge tone={test.isPublished ? 'success' : 'default'} className="text-[10px]">
                        {test.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                      <span className="text-[11px] font-mono text-muted flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {test.durationMinutes}m
                      </span>
                    </div>

                    <h3 className="font-semibold text-sm text-ink line-clamp-2">{test.title}</h3>
                    <p className="text-xs text-muted mt-1">{test.examCategory || 'Competitive Examination'}</p>
                  </div>

                  <div className="pt-3 border-t border-line grid grid-cols-3 text-center gap-2 text-xs">
                    <div>
                      <span className="block text-[10px] text-muted">Questions</span>
                      <span className="font-bold text-ink">{test.totalQuestions}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-muted">Attempts</span>
                      <span className="font-bold text-ink">{testAttempts.length}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-muted">Avg Score</span>
                      <span className="font-bold text-ink">{avgScore}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs"
                      onClick={() => onNavigate('mock-tests')}
                    >
                      Inspect in CBT Manager
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: EXPORT HUB */}
      {activeTab === 'exports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border-line space-y-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-ink">Candidate Telemetry & Scores</h3>
              <p className="text-xs text-muted mt-1">
                Download raw exam performance records including scores, accuracy percentage, time spent per test, and timestamps for all candidates.
              </p>
            </div>
            <div className="pt-3 border-t border-line flex items-center justify-between">
              <span className="text-xs font-mono text-muted">{allSubmissions.length} records ready</span>
              <Button size="sm" variant="primary" onClick={exportStudentTelemetryCsv}>
                <Download className="w-3.5 h-3.5 mr-1" />
                Export Telemetry CSV
              </Button>
            </div>
          </Card>

          <Card className="p-6 border-line space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-ink">Universal Question Bank Dump</h3>
              <p className="text-xs text-muted mt-1">
                Full export of active question database containing stems, options, correct answers, topic nodes, and difficulty ratings.
              </p>
            </div>
            <div className="pt-3 border-t border-line flex items-center justify-between">
              <span className="text-xs font-mono text-muted">{questions.length} questions ready</span>
              <Button size="sm" variant="primary" onClick={exportQuestionBankCsv}>
                <Download className="w-3.5 h-3.5 mr-1" />
                Export Questions CSV
              </Button>
            </div>
          </Card>

          <Card className="p-6 border-line space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-ink">Curriculum Gap & Topic Audit</h3>
              <p className="text-xs text-muted mt-1">
                Detailed table of question inventory per syllabus unit, benchmarking topic counts against target thresholds.
              </p>
            </div>
            <div className="pt-3 border-t border-line flex items-center justify-between">
              <span className="text-xs font-mono text-muted">{coverageData.length} topics evaluated</span>
              <Button size="sm" variant="primary" onClick={exportCoverageCsv}>
                <Download className="w-3.5 h-3.5 mr-1" />
                Export Coverage Audit
              </Button>
            </div>
          </Card>

          <Card className="p-6 border-line space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-ink">CBT Mock Tests Catalog</h3>
              <p className="text-xs text-muted mt-1">
                List of all configured mock tests, duration settings, published status, and sectional blueprint configurations.
              </p>
            </div>
            <div className="pt-3 border-t border-line flex items-center justify-between">
              <span className="text-xs font-mono text-muted">{mockTests.length} tests ready</span>
              <Button size="sm" variant="primary" onClick={exportMockTestsCsv}>
                <Download className="w-3.5 h-3.5 mr-1" />
                Export Mock Catalog
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
