import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Trophy,
  BarChart2,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowUpRight,
  Filter,
  Copy,
  Check,
  Mail,
  RefreshCw,
  Eye,
  GraduationCap,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../../context/ToastContext';
import {
  getAllStudentProfilesWithScores,
  deleteStudentUser,
  StudentProfileSummary
} from '../../services/studentTelemetryService';
import { useRealtimeSync } from '../../services/questionBankSyncService';
import { StudentProfileDossier } from './StudentProfileDossier';

export const AdminUsersAndScoresView: React.FC = () => {
  const { success: toastSuccess, error: toastError } = useToast();
  const [students, setStudents] = useState<StudentProfileSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [examFilter, setExamFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<StudentProfileSummary | null>(null);
  const [copiedUid, setCopiedUid] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<StudentProfileSummary | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await getAllStudentProfilesWithScores();
      setStudents(data);
    } catch (err) {
      console.error('Failed to load student profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Real-time synchronization across tabs and events
  useRealtimeSync(['users', 'all'], () => {
    loadStudents();
  });

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      const ok = await deleteStudentUser(userToDelete.uid);
      if (ok) {
        toastSuccess('User Deleted', `Account "${userToDelete.displayName}" has been permanently removed.`);
        setUserToDelete(null);
        await loadStudents();
      } else {
        toastError('Delete Failed', 'Could not delete user account.');
      }
    } catch (err: any) {
      toastError('Delete Error', err.message || 'Failed to remove user');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyUid = (uid: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(uid);
    setCopiedUid(uid);
    setTimeout(() => setCopiedUid(null), 2000);
  };

  // Filter students based on search and exam filter
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.uid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.targetExam.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesExam =
      examFilter === 'all' ||
      s.targetExam.toLowerCase().includes(examFilter.toLowerCase());

    return matchesSearch && matchesExam;
  });

  // Calculate platform aggregate stats
  const totalStudents = students.length;
  const totalAttempts = students.reduce((acc, s) => acc + s.testsAttempted, 0);
  const totalScoreAccum = students.reduce((acc, s) => acc + s.totalScoreSum, 0);
  const totalMaxAccum = students.reduce((acc, s) => acc + s.maxScoreSum, 0);
  const platformAvgScore = totalAttempts > 0 ? (totalScoreAccum / totalAttempts).toFixed(1) : '0.0';
  const platformAvgAccuracy =
    totalStudents > 0
      ? Math.round(students.reduce((acc, s) => acc + s.averageAccuracy, 0) / totalStudents)
      : 0;

  // If a student is selected, render their full dossier
  if (selectedStudent) {
    return (
      <div className="space-y-6">
        <StudentProfileDossier
          student={selectedStudent}
          onBack={() => setSelectedStudent(null)}
          isSelfProfile={false}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn">
      {/* ── Header Banner ── */}
      <Card flush className="p-6 bg-gradient-to-r from-indigo-500/10 via-card to-card border-indigo-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge tone="brand" size="md">
                Admin Control Room
              </Badge>
              <span className="text-xs text-muted font-mono">Telemetry & User Auditing</span>
            </div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-ink mt-1">
              Registered Students &amp; Mock Test Scores
            </h2>
            <p className="text-xs text-muted max-w-2xl">
              Inspect student login details, registration telemetry, latest examination attempts, and click "View Profile" to examine individual candidate score dossiers.
            </p>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={loadStudents}
            disabled={loading}
            icon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
          >
            Refresh Telemetry
          </Button>
        </div>
      </Card>

      {/* ── KPI Metric Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card flush className="p-4 border-line space-y-2">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Enrolled Aspirants</span>
            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="font-display font-bold text-2xl text-ink">
            {totalStudents}
          </div>
          <div className="text-[11px] text-muted">Active credentials in database</div>
        </Card>

        <Card flush className="p-4 border-line space-y-2">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Attempts</span>
            <BarChart2 className="w-4 h-4 text-primary" />
          </div>
          <div className="font-display font-bold text-2xl text-ink">
            {totalAttempts}
          </div>
          <div className="text-[11px] text-muted">CBT mock submissions recorded</div>
        </Card>

        <Card flush className="p-4 border-line space-y-2">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Platform Avg Score</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="font-display font-bold text-2xl text-amber-500">
            {platformAvgScore}
          </div>
          <div className="text-[11px] text-muted">Average marks scored per test</div>
        </Card>

        <Card flush className="p-4 border-line space-y-2">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Accuracy</span>
            <CheckCircle2 className="w-4 h-4 text-success-text" />
          </div>
          <div className="font-display font-bold text-2xl text-success-text">
            {platformAvgAccuracy}%
          </div>
          <div className="text-[11px] text-muted">Correct answer efficiency</div>
        </Card>
      </div>

      {/* ── Filter & Search Toolbar ── */}
      <Card flush className="p-4 border-line">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name, email, UID, or exam target..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-line bg-canvas text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Exam Filter Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-muted" />
            <select
              value={examFilter}
              onChange={(e) => setExamFilter(e.target.value)}
              className="text-xs rounded-xl border border-line bg-canvas text-ink px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="all">All Target Exams</option>
              <option value="dwr">Assam DWR (Water Resources)</option>
              <option value="apsc">APSC AE / Civil</option>
              <option value="upsc">UPSC ESE / IES</option>
              <option value="ssc">SSC JE</option>
            </select>
          </div>
        </div>
      </Card>

      {/* ── Student Profiles Table ── */}
      <Card flush className="border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-line bg-subtle text-muted uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Student &amp; Credentials</th>
                <th className="py-3.5 px-4">Target Exam</th>
                <th className="py-3.5 px-4 text-center">Attempts</th>
                <th className="py-3.5 px-4 text-right">Latest Mock Score</th>
                <th className="py-3.5 px-4 text-center">Accuracy</th>
                <th className="py-3.5 px-4 text-center">Readiness</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-600" />
                    Loading enrolled students and test scores...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted">
                    No students matched your search criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std) => {
                  const hasAttempts = std.testsAttempted > 0;
                  const initials = std.displayName
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();

                  return (
                    <tr
                      key={std.uid}
                      className="hover:bg-subtle/50 transition cursor-pointer group"
                      onClick={() => setSelectedStudent(std)}
                    >
                      {/* Student & Credentials */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-xs flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition">
                            {initials || 'ST'}
                          </div>
                          <div className="space-y-0.5">
                            <div className="font-semibold text-ink group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition flex items-center gap-1.5">
                              <span>{std.displayName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-muted">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3 text-muted-faint" />
                                {std.email}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-muted-faint font-mono">
                              <span>UID: {std.uid}</span>
                              <button
                                onClick={(e) => handleCopyUid(std.uid, e)}
                                className="hover:text-indigo-600 p-0.5 transition"
                                title="Copy UID"
                              >
                                {copiedUid === std.uid ? (
                                  <Check className="w-2.5 h-2.5 text-success-text" />
                                ) : (
                                  <Copy className="w-2.5 h-2.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Target Exam */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold text-[10px] inline-block">
                            {std.targetExam}
                          </span>
                          <div className="text-[10px] text-muted">
                            Target: {std.targetYear} • Joined {std.registeredDate}
                          </div>
                        </div>
                      </td>

                      {/* Attempts */}
                      <td className="py-3 px-4 text-center">
                        <span className="font-mono font-bold text-ink">
                          {std.testsAttempted}
                        </span>
                        <div className="text-[10px] text-muted">Tests</div>
                      </td>

                      {/* Latest Mock Score */}
                      <td className="py-3 px-4 text-right">
                        {hasAttempts ? (
                          <div className="space-y-0.5">
                            <div className="font-display font-bold text-sm text-primary">
                              {std.latestScore} / {std.latestMaxScore}
                            </div>
                            <div className="text-[10px] text-muted truncate max-w-[140px] ml-auto" title={std.latestExamTitle}>
                              {std.latestExamTitle}
                            </div>
                            <div className="text-[9px] text-muted-faint">{std.latestDate}</div>
                          </div>
                        ) : (
                          <span className="text-muted-faint italic text-[11px]">No tests yet</span>
                        )}
                      </td>

                      {/* Accuracy */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full font-bold text-[11px] ${
                            std.averageAccuracy >= 80
                              ? 'bg-success-surface text-success-text'
                              : std.averageAccuracy >= 60
                              ? 'bg-amber-500/15 text-amber-600'
                              : 'bg-subtle text-muted'
                          }`}
                        >
                          {std.averageAccuracy}%
                        </span>
                      </td>

                      {/* Readiness */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400">
                          <GraduationCap className="w-3.5 h-3.5" />
                          <span>{std.readinessScore}%</span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedStudent(std)}
                            className="hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition"
                            iconRight={<ArrowUpRight className="w-3 h-3" />}
                          >
                            View Profile
                          </Button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setUserToDelete(std);
                            }}
                            className="p-1.5 rounded-lg border border-line text-muted hover:text-danger-text hover:bg-danger-surface hover:border-danger-border transition"
                            title={`Delete student account ${std.displayName}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── User Deletion Confirmation Modal ── */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <Card flush className="w-full max-w-md p-6 space-y-4 shadow-2xl border-danger-border/40">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-danger-surface text-danger-text flex items-center justify-center flex-shrink-0 border border-danger-border">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-base text-ink">
                  Delete Student Account?
                </h3>
                <p className="text-xs text-muted">
                  Are you sure you want to delete <strong className="text-ink">{userToDelete.displayName}</strong> ({userToDelete.email})?
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-danger-surface/40 border border-danger-border/30 text-xs text-muted space-y-1">
              <p className="font-semibold text-danger-text">⚠️ This action is permanent:</p>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                <li>All mock test submission ledgers will be erased</li>
                <li>Score dossiers and readiness metrics will be removed</li>
                <li>Student credentials will be revoked from ExamPilot</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-line">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUserToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={confirmDeleteUser}
                disabled={isDeleting}
                className="bg-danger hover:bg-danger-hover text-white font-semibold shadow-sm shadow-danger/20"
                icon={<Trash2 className="w-3.5 h-3.5" />}
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
export default AdminUsersAndScoresView;
