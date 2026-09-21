import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Eye,
  Trash2,
  CheckCircle2,
  XCircle,
  Mail,
  Trophy,
  BarChart2,
  Copy,
  Check,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Download,
  AlertCircle
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ConfirmationModal } from '../ConfirmationModal';
import { StudentProfileDossier } from '@/components/student/StudentProfileDossier';
import {
  getAllStudentProfilesWithScores,
  deleteStudentUser,
  StudentProfileSummary
} from '@/services/studentTelemetryService';
import { useToast } from '@/context/ToastContext';

interface StudentsSectionProps {
  initialSelectedUid?: string;
}

export const StudentsSection: React.FC<StudentsSectionProps> = ({ initialSelectedUid }) => {
  const { success: toastSuccess, error: toastError } = useToast();
  const [students, setStudents] = useState<StudentProfileSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [examFilter, setExamFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [sortBy, setSortBy] = useState<'registered' | 'tests' | 'score' | 'readiness'>('registered');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selected student for Profile Dossier modal
  const [inspectingStudent, setInspectingStudent] = useState<StudentProfileSummary | null>(null);

  // Inactive state overrides (local soft-disable toggle)
  const [inactiveUids, setInactiveUids] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem('exampilot_inactive_students');
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Delete modal state
  const [studentToDelete, setStudentToDelete] = useState<StudentProfileSummary | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedUid, setCopiedUid] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const list = await getAllStudentProfilesWithScores();
      setStudents(list);

      if (initialSelectedUid) {
        const found = list.find((s) => s.uid === initialSelectedUid);
        if (found) setInspectingStudent(found);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
      toastError('Load Error', 'Failed to retrieve registered student roster.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [initialSelectedUid]);

  const toggleStudentStatus = (uid: string) => {
    setInactiveUids((prev) => {
      const next = new Set(prev);
      if (next.has(uid)) {
        next.delete(uid);
        toastSuccess('Account Activated', 'Student access has been re-enabled.');
      } else {
        next.add(uid);
        toastSuccess('Account Deactivated', 'Student access is temporarily disabled.');
      }
      localStorage.setItem('exampilot_inactive_students', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;
    setIsDeleting(true);
    try {
      const success = await deleteStudentUser(studentToDelete.uid);
      if (success) {
        setStudents((prev) => prev.filter((s) => s.uid !== studentToDelete.uid));
        toastSuccess('Student Removed', `${studentToDelete.displayName} was removed from the database.`);
      } else {
        toastError('Delete Failed', 'Could not remove student account.');
      }
    } catch (err) {
      toastError('Delete Error', 'An unexpected error occurred during removal.');
    } finally {
      setIsDeleting(false);
      setStudentToDelete(null);
    }
  };

  const handleCopyUid = (uid: string) => {
    navigator.clipboard.writeText(uid);
    setCopiedUid(uid);
    setTimeout(() => setCopiedUid(null), 2000);
  };

  // Export CSV
  const handleExportCsv = () => {
    if (students.length === 0) return;
    const headers = ['UID', 'DisplayName', 'Email', 'TargetExam', 'RegisteredDate', 'TestsAttempted', 'AverageAccuracy', 'TotalScore'];
    const rows = students.map((s) => [
      `"${s.uid}"`,
      `"${s.displayName}"`,
      `"${s.email}"`,
      `"${s.targetExam}"`,
      `"${s.registeredDate}"`,
      s.testsAttempted,
      `${s.averageAccuracy}%`,
      s.totalScoreSum
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `exampilot_students_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toastSuccess('CSV Exported', `Downloaded ${students.length} student records.`);
  };

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    let result = [...students];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.displayName?.toLowerCase().includes(q) ||
          s.email?.toLowerCase().includes(q) ||
          s.uid?.toLowerCase().includes(q)
      );
    }

    // Exam filter
    if (examFilter !== 'ALL') {
      result = result.filter((s) => s.targetExam?.toLowerCase().includes(examFilter.toLowerCase()));
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      result = result.filter((s) => {
        const isInactive = inactiveUids.has(s.uid);
        return statusFilter === 'INACTIVE' ? isInactive : !isInactive;
      });
    }

    // Sorting
    result.sort((a, b) => {
      let valA: any = 0;
      let valB: any = 0;

      if (sortBy === 'registered') {
        valA = new Date(a.registeredDate).getTime() || 0;
        valB = new Date(b.registeredDate).getTime() || 0;
      } else if (sortBy === 'tests') {
        valA = a.testsAttempted || 0;
        valB = b.testsAttempted || 0;
      } else if (sortBy === 'score') {
        valA = a.averageAccuracy || 0;
        valB = b.averageAccuracy || 0;
      } else if (sortBy === 'readiness') {
        valA = a.readinessScore || 0;
        valB = b.readinessScore || 0;
      }

      return sortOrder === 'desc' ? valB - valA : valA - valB;
    });

    return result;
  }, [students, searchQuery, examFilter, statusFilter, sortBy, sortOrder, inactiveUids]);

  // Paginated students
  const paginatedStudents = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredStudents.slice(startIndex, startIndex + pageSize);
  }, [filteredStudents, page, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Action & Filter Toolbar */}
      <Card flush className="p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                placeholder="Search candidates by name, email, or UID..."
                className="w-full h-9 pl-9 pr-3 rounded-xl border border-line bg-surface text-xs text-ink placeholder:text-muted-faint focus:border-primary focus:outline-none"
              />
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={loadData}
              title="Refresh roster from database"
              iconLeft={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
            >
              Sync
            </Button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportCsv}
              iconLeft={<Download className="w-3.5 h-3.5" />}
            >
              Export CSV
            </Button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-line/60 flex-wrap text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-muted-faint font-semibold uppercase text-[10px]">Filter Exam:</span>
            {['ALL', 'Assam DWR', 'Civil', 'General Studies'].map((opt) => (
              <button
                key={opt}
                onClick={() => { setExamFilter(opt); setPage(1); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  examFilter === opt
                    ? 'bg-primary text-white shadow-2xs font-semibold'
                    : 'bg-subtle text-muted hover:text-ink'
                }`}
              >
                {opt === 'ALL' ? 'All Aspirants' : opt}
              </button>
            ))}

            <span className="text-muted-faint font-semibold uppercase text-[10px] ml-2">Status:</span>
            {(['ALL', 'ACTIVE', 'INACTIVE'] as const).map((st) => (
              <button
                key={st}
                onClick={() => { setStatusFilter(st); setPage(1); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  statusFilter === st
                    ? 'bg-indigo-600 text-white shadow-2xs font-semibold'
                    : 'bg-subtle text-muted hover:text-ink'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <span className="text-muted-faint text-[10px] uppercase font-semibold">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-8 px-2 rounded-lg border border-line bg-surface text-xs text-ink"
            >
              <option value="registered">Registered Date</option>
              <option value="tests">Tests Attempted</option>
              <option value="score">Avg Accuracy</option>
              <option value="readiness">Readiness Score</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1.5 rounded-lg border border-line bg-surface text-muted hover:text-ink transition"
              title={`Switch to ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </Card>

      {/* Aspirants Table Card */}
      <Card flush className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-line bg-subtle/50 text-[10px] font-bold text-muted uppercase tracking-wider">
                <th className="py-3 px-4">Candidate Profile</th>
                <th className="py-3 px-3">Target Exam</th>
                <th className="py-3 px-3">Tests Taken</th>
                <th className="py-3 px-3">Accuracy</th>
                <th className="py-3 px-3">Readiness</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted">
                    <RefreshCw className="w-6 h-6 text-primary animate-spin mx-auto mb-2" />
                    <p className="text-xs font-semibold">Loading student roster...</p>
                  </td>
                </tr>
              ) : paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted">
                    <Users className="w-8 h-8 text-muted-faint mx-auto mb-2" />
                    <p className="text-xs font-semibold text-ink">No candidates match your search filter</p>
                    <p className="text-[11px] text-muted-faint">Try resetting filters to view all enrolled aspirants.</p>
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((std) => {
                  const isInactive = inactiveUids.has(std.uid);
                  return (
                    <tr key={std.uid} className="hover:bg-subtle/40 transition group">
                      {/* Candidate Identity */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-primary text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-2xs">
                            {std.displayName?.charAt(0).toUpperCase() || 'S'}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-ink truncate flex items-center gap-1.5">
                              <span>{std.displayName}</span>
                              {std.testsAttempted >= 3 && (
                                <Trophy className="w-3 h-3 text-amber-500 flex-shrink-0" />
                              )}
                            </div>
                            <div className="text-[11px] text-muted truncate flex items-center gap-2">
                              <span>{std.email}</span>
                              <span>•</span>
                              <button
                                onClick={() => handleCopyUid(std.uid)}
                                className="font-mono text-[10px] text-muted-faint hover:text-ink inline-flex items-center gap-0.5"
                                title="Click to copy UID"
                              >
                                <span>{std.uid.slice(0, 8)}…</span>
                                {copiedUid === std.uid ? <Check className="w-2.5 h-2.5 text-success" /> : <Copy className="w-2.5 h-2.5" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Target Exam */}
                      <td className="py-3 px-3 text-ink-soft">
                        <div className="truncate max-w-[160px] font-medium">{std.targetExam}</div>
                        <div className="text-[10px] text-muted-faint">Class of {std.targetYear}</div>
                      </td>

                      {/* Tests Taken */}
                      <td className="py-3 px-3 font-mono font-bold text-ink">
                        {std.testsAttempted}
                      </td>

                      {/* Accuracy */}
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          std.averageAccuracy >= 75 ? 'bg-success/10 text-success' : std.averageAccuracy >= 50 ? 'bg-warning/10 text-warning' : 'bg-danger/10 text-danger'
                        }`}>
                          {std.averageAccuracy}%
                        </span>
                      </td>

                      {/* Readiness */}
                      <td className="py-3 px-3 font-mono font-semibold text-primary">
                        {std.readinessScore}%
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <button
                          onClick={() => toggleStudentStatus(std.uid)}
                          className="flex items-center gap-1 text-[11px] font-semibold transition"
                          title="Click to toggle active status"
                        >
                          {isInactive ? (
                            <Badge size="sm" tone="neutral">Inactive</Badge>
                          ) : (
                            <Badge size="sm" tone="success">Active</Badge>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setInspectingStudent(std)}
                            title="Inspect detailed profile dossier and test logs"
                            iconLeft={<Eye className="w-3.5 h-3.5" />}
                          >
                            Dossier
                          </Button>
                          <button
                            onClick={() => setStudentToDelete(std)}
                            className="p-1.5 rounded-lg text-muted hover:text-danger-text hover:bg-danger/10 transition"
                            title="Remove student user"
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

        {/* Pagination Bar */}
        <div className="p-4 border-t border-line bg-subtle/30 flex items-center justify-between text-xs flex-wrap gap-3">
          <div className="text-muted">
            Showing <strong>{paginatedStudents.length}</strong> of <strong>{filteredStudents.length}</strong> candidates
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-line bg-surface text-muted hover:text-ink disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-line bg-surface text-muted hover:text-ink disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* Student Profile Dossier Modal */}
      {inspectingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-5xl rounded-2xl bg-card border border-line shadow-2xl p-6 my-8 max-h-[90vh] overflow-y-auto space-y-4">
            <StudentProfileDossier
              student={inspectingStudent}
              onBack={() => setInspectingStudent(null)}
              isSelfProfile={false}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(studentToDelete)}
        onClose={() => setStudentToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title={`Permanently Remove Candidate?`}
        message={`Are you sure you want to delete "${studentToDelete?.displayName}" (${studentToDelete?.email})? All test submissions, accuracy metrics, and score records will be permanently erased.`}
        confirmText="Remove Candidate"
        tone="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
