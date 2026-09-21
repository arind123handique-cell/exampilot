import React, { useState, useEffect, useMemo } from 'react';
import {
  Layers,
  Search,
  Plus,
  Edit2,
  Edit3,
  Trash2,
  Copy,
  CheckCircle2,
  Clock,
  Eye,
  RefreshCw,
  Sparkles,
  FileText,
  UploadCloud,
  ChevronRight,
  HelpCircle,
  AlertTriangle,
  Globe,
  EyeOff,
  Send,
  Radio,
  X
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ConfirmationModal } from '../ConfirmationModal';
import { MockTestSectionEditor } from '@/components/admin/MockTestSectionEditor';
import { PdfPaperIngestor } from '@/components/admin/PdfPaperIngestor';
import {
  getAllCombinedMockTests,
  getAdminPublishedMockTests,
  updateAdminPublishedMockTest,
  deleteAdminPublishedPaper,
  publishAdminPaper,
  fetchAndSyncMockTests,
  toggleMockTestPublishStatus,
  renameMockTestInSupabase
} from '@/services/adminPaperService';
import { subscribeToMockTestChanges } from '@/services/supabaseMockTestService';
import { MOCK_TESTS } from '@/data/mockData';
import { MockTest, PYQPaper } from '@/types';
import { useToast } from '@/context/ToastContext';
import { AdminSectionId } from '../AdminSidebar';

interface MockTestsSectionProps {
  onNavigate: (section: AdminSectionId, payload?: any) => void;
  initialSelectedMockId?: string;
}

export const MockTestsSection: React.FC<MockTestsSectionProps> = ({
  onNavigate,
  initialSelectedMockId
}) => {
  const { success: toastSuccess, error: toastError } = useToast();
  const [mockTests, setMockTests] = useState<MockTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState<'all' | 'civil' | 'gs'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'hidden'>('all');

  // Preview & Editor Modals
  const [previewingTest, setPreviewingTest] = useState<MockTest | null>(null);
  const [editingMockId, setEditingMockId] = useState<string | null>(initialSelectedMockId || null);
  const [isPdfIngestorOpen, setIsPdfIngestorOpen] = useState(false);

  // Rename modal state
  const [renamingTest, setRenamingTest] = useState<MockTest | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newPaperName, setNewPaperName] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);

  // Delete modal state
  const [testToDelete, setTestToDelete] = useState<MockTest | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const all = await fetchAndSyncMockTests(MOCK_TESTS);
      setMockTests(all);
    } catch (err) {
      console.error('Failed to load mock tests:', err);
      setMockTests(getAllCombinedMockTests(MOCK_TESTS));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToMockTestChanges(() => {
      loadData();
    });
    return unsubscribe;
  }, []);

  const handleTogglePushToStudents = async (test: MockTest) => {
    const currentStatus = test.isPublishedToStudents !== false;
    const nextStatus = !currentStatus;

    // Optimistic UI update
    setMockTests((prev) =>
      prev.map((t) => (t.id === test.id ? { ...t, isPublishedToStudents: nextStatus } : t))
    );

    try {
      await toggleMockTestPublishStatus(test.id, nextStatus, 'admin');
      if (nextStatus) {
        toastSuccess(
          'Pushed to Students!',
          `"${test.title}" is now LIVE on the Student Portal.`
        );
      } else {
        toastSuccess(
          'Hidden from Students',
          `"${test.title}" is now HIDDEN/DRAFT. Students cannot access it.`
        );
      }
    } catch (err) {
      console.warn('Toggle push status error:', err);
      toastError('Action Failed', 'Could not update student publication status.');
      loadData();
    }
  };

  const handleOpenRename = (test: MockTest) => {
    setRenamingTest(test);
    setNewTitle(test.title);
    setNewPaperName(test.paperName || test.title);
  };

  const handleSaveRename = async () => {
    if (!renamingTest || !newTitle.trim()) return;
    setIsRenaming(true);
    try {
      const cleanTitle = newTitle.trim();
      const cleanPaper = newPaperName.trim() || cleanTitle;
      const success = await renameMockTestInSupabase(renamingTest.id, cleanTitle, cleanPaper);

      if (success) {
        setMockTests((prev) =>
          prev.map((t) =>
            t.id === renamingTest.id
              ? { ...t, title: cleanTitle, paperName: cleanPaper }
              : t
          )
        );
        toastSuccess('Mock Test Renamed', `Updated to "${cleanTitle}".`);
        setRenamingTest(null);
      } else {
        toastError('Rename Failed', 'Could not update test name.');
      }
    } catch (err: any) {
      toastError('Rename Failed', err.message || 'An error occurred.');
    } finally {
      setIsRenaming(false);
    }
  };

  const handleDuplicateTest = async (test: MockTest) => {
    try {
      const copyId = `mock-copy-${Date.now()}`;
      const duplicated: MockTest = {
        ...test,
        id: copyId,
        title: `${test.title} (Copy)`,
        sections: test.sections.map((sec, idx) => ({
          ...sec,
          id: `sec-copy-${Date.now()}-${idx}`
        }))
      };

      const paperRecord: PYQPaper = {
        id: copyId,
        examName: duplicated.title,
        year: new Date().getFullYear(),
        paperType: 'Custom Mock Copy',
        totalQuestions: duplicated.sections.reduce((acc, s) => acc + s.questions.length, 0),
        downloadAvailable: false,
        frequencyTags: [test.examId],
        questions: duplicated.sections.flatMap((s) => s.questions)
      };

      await publishAdminPaper(paperRecord, duplicated, 'admin');
      loadData();
      toastSuccess('Test Duplicated', `Created "${duplicated.title}".`);
    } catch (err) {
      toastError('Duplication Failed', 'Could not duplicate mock test.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!testToDelete) return;
    const targetId = testToDelete.id;
    const targetTitle = testToDelete.title;

    // Instantly close modal and remove from state
    setTestToDelete(null);
    setMockTests((prev) => prev.filter((t) => t.id !== targetId));
    toastSuccess('Test Deleted', `"${targetTitle}" removed from catalog.`);

    try {
      await deleteAdminPublishedPaper(targetId);
      await loadData();
    } catch (err) {
      console.warn('Delete error:', err);
    }
  };

  // Filter tests
  const filteredTests = useMemo(() => {
    let result = [...mockTests];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title?.toLowerCase().includes(q) ||
          t.paperName?.toLowerCase().includes(q) ||
          t.examId?.toLowerCase().includes(q)
      );
    }

    if (branchFilter !== 'all') {
      if (branchFilter === 'civil') {
        result = result.filter((t) => !t.examId?.includes('dwr') && !t.title?.toLowerCase().includes('general studies'));
      } else if (branchFilter === 'gs') {
        result = result.filter((t) => t.examId?.includes('dwr') || t.title?.toLowerCase().includes('general studies'));
      }
    }

    if (statusFilter !== 'all') {
      result = result.filter((t) => {
        const isLive = t.isPublishedToStudents !== false;
        if (statusFilter === 'live') return isLive;
        if (statusFilter === 'hidden') return !isLive;
        return true;
      });
    }

    return result;
  }, [mockTests, searchQuery, branchFilter, statusFilter]);

  // If editing a mock test's sub-heads and sections
  if (editingMockId) {
    return (
      <div className="space-y-4 animate-fadeIn">
        <MockTestSectionEditor
          selectedMockId={editingMockId}
          onBack={() => {
            setEditingMockId(null);
            loadData();
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Toolbar */}
      <Card flush className="p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search mock tests by title, exam, or paper name..."
                className="w-full h-9 pl-9 pr-3 rounded-xl border border-line bg-surface text-xs text-ink placeholder:text-muted-faint focus:border-primary focus:outline-none"
              />
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={loadData}
              title="Refresh test list"
              iconLeft={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
            >
              Sync
            </Button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              onClick={() => onNavigate('test-maker')}
              iconLeft={<Sparkles className="w-3.5 h-3.5" />}
            >
              Custom Mock Maker
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsPdfIngestorOpen(true)}
              iconLeft={<UploadCloud className="w-3.5 h-3.5" />}
            >
              PDF OCR Ingestor
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-line/60 flex-wrap text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-muted-faint font-semibold uppercase text-[10px]">Branch:</span>
            {(['all', 'civil', 'gs'] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBranchFilter(b)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  branchFilter === b
                    ? 'bg-primary text-white shadow-2xs font-semibold'
                    : 'bg-subtle text-muted hover:text-ink'
                }`}
              >
                {b === 'all' ? 'All Disciplines' : b === 'civil' ? 'Civil Engineering' : 'General Studies'}
              </button>
            ))}

            <span className="text-muted-faint font-semibold uppercase text-[10px] ml-2">Status:</span>
            {(['all', 'live', 'hidden'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  statusFilter === st
                    ? 'bg-indigo-600 text-white shadow-2xs font-semibold'
                    : 'bg-subtle text-muted hover:text-ink'
                }`}
              >
                {st === 'all' ? 'All Tests' : st === 'live' ? 'Live to Students' : 'Draft / Hidden'}
              </button>
            ))}
          </div>

          <div className="text-xs text-muted">
            Total <strong>{filteredTests.length}</strong> Mock Tests
          </div>
        </div>
      </Card>

      {/* Mock Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-16 text-center text-muted">
            <RefreshCw className="w-6 h-6 text-primary animate-spin mx-auto mb-2" />
            <p className="text-xs font-semibold">Loading mock test catalog...</p>
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="col-span-full py-16 text-center text-muted border border-dashed rounded-2xl">
            <Layers className="w-8 h-8 text-muted-faint mx-auto mb-2" />
            <p className="text-xs font-semibold text-ink">No mock tests match your filter</p>
            <p className="text-[11px] text-muted-faint mt-1">Try changing filters or click Custom Mock Maker to create one.</p>
          </div>
        ) : (
          filteredTests.map((test) => {
            const totalQ = test.sections.reduce((acc, s) => acc + s.questions.length, 0);
            const isLive = test.isPublishedToStudents !== false;

            return (
              <Card
                key={test.id}
                flush
                className="p-5 flex flex-col justify-between border-line hover:border-primary/50 transition shadow-2xs space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] uppercase tracking-wider">
                      {test.examId}
                    </span>
                    {isLive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px] border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live to Students
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold text-[11px] border border-amber-500/30">
                        <EyeOff className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                        Draft / Hidden
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-sm text-ink line-clamp-2">
                      {test.title}
                    </h3>
                    <p className="text-[11px] text-muted line-clamp-2 mt-1">
                      {test.paperName}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-subtle/60 border border-line text-center text-xs">
                    <div>
                      <div className="font-bold text-ink font-mono">{totalQ}</div>
                      <div className="text-[9px] uppercase font-semibold text-muted-faint">MCQs</div>
                    </div>
                    <div>
                      <div className="font-bold text-ink font-mono">{test.durationMinutes}m</div>
                      <div className="text-[9px] uppercase font-semibold text-muted-faint">Duration</div>
                    </div>
                    <div>
                      <div className="font-bold text-primary font-mono">{test.totalMarks}</div>
                      <div className="text-[9px] uppercase font-semibold text-muted-faint">Marks</div>
                    </div>
                  </div>

                  <div className="text-[11px] text-muted-faint flex items-center justify-between">
                    <span>Sub-heads: {test.sections.length}</span>
                    <span>Negative: -{test.negativeMarksPerIncorrect}</span>
                  </div>
                </div>

                {/* Card Action Controls */}
                <div className="pt-3 border-t border-line flex items-center justify-between gap-1 flex-wrap">
                  <div className="flex items-center gap-1 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPreviewingTest(test)}
                      title="Inspect mock test sections and questions"
                      iconLeft={<Eye className="w-3.5 h-3.5" />}
                    >
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingMockId(test.id)}
                      title="Edit subheads, scoring rules, and questions"
                      iconLeft={<Edit2 className="w-3.5 h-3.5" />}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenRename(test)}
                      title="Rename mock test title and paper description"
                      iconLeft={<Edit3 className="w-3.5 h-3.5 text-primary" />}
                    >
                      Rename
                    </Button>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Push to Students / Hide Toggle Button */}
                    {isLive ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTogglePushToStudents(test)}
                        className="text-amber-700 dark:text-amber-300 border-amber-500/40 hover:bg-amber-500/10 text-xs font-semibold"
                        title="Hide this mock test from students"
                        iconLeft={<EyeOff className="w-3.5 h-3.5 text-amber-500" />}
                      >
                        Hide
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleTogglePushToStudents(test)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
                        title="Push this mock test live to student portal"
                        iconLeft={<Send className="w-3.5 h-3.5" />}
                      >
                        Push
                      </Button>
                    )}

                    <button
                      onClick={() => handleDuplicateTest(test)}
                      className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-subtle transition"
                      title="Duplicate this mock test"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setTestToDelete(test)}
                      className="p-1.5 rounded-lg text-muted hover:text-danger-text hover:bg-danger/10 transition"
                      title="Delete mock test permanently from catalog and student portal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Test Preview Modal */}
      {previewingTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-4xl rounded-2xl bg-card border border-line shadow-2xl p-6 my-8 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-line">
              <div>
                <Badge tone="brand" size="sm">{previewingTest.examId}</Badge>
                <h2 className="font-display font-bold text-lg text-ink mt-1">
                  {previewingTest.title}
                </h2>
                <p className="text-xs text-muted">{previewingTest.paperName}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => setPreviewingTest(null)}>
                Close Preview
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-3 text-center text-xs">
              <div className="p-3 rounded-xl bg-subtle border border-line">
                <div className="font-bold text-ink">{previewingTest.sections.reduce((acc, s) => acc + s.questions.length, 0)}</div>
                <div className="text-[10px] text-muted">Total Questions</div>
              </div>
              <div className="p-3 rounded-xl bg-subtle border border-line">
                <div className="font-bold text-ink">{previewingTest.durationMinutes} min</div>
                <div className="text-[10px] text-muted">Time Limit</div>
              </div>
              <div className="p-3 rounded-xl bg-subtle border border-line">
                <div className="font-bold text-primary">{previewingTest.totalMarks}</div>
                <div className="text-[10px] text-muted">Max Marks</div>
              </div>
              <div className="p-3 rounded-xl bg-subtle border border-line">
                <div className="font-bold text-danger">-{previewingTest.negativeMarksPerIncorrect}</div>
                <div className="text-[10px] text-muted">Negative Marks</div>
              </div>
            </div>

            {/* Sections & Questions */}
            <div className="space-y-4">
              <h3 className="font-display font-bold text-sm text-ink">Sub-heads & Structure</h3>
              {previewingTest.sections.map((sec, sIdx) => (
                <div key={sec.id} className="p-4 rounded-xl border border-line bg-surface space-y-3">
                  <div className="flex items-center justify-between font-semibold text-xs text-ink">
                    <span>Part {sIdx + 1}: {sec.name}</span>
                    <span className="text-muted font-mono">{sec.questions.length} MCQs</span>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2 divide-y divide-line/40">
                    {sec.questions.slice(0, 5).map((q, qIdx) => (
                      <div key={q.id} className="pt-2 text-xs text-muted">
                        <span className="font-bold text-ink mr-2">Q{qIdx + 1}.</span>
                        <span className="text-ink-soft">{q.stem}</span>
                        <span className="ml-2 text-[10px] text-success font-semibold">(Key: {q.correctOption})</span>
                      </div>
                    ))}
                    {sec.questions.length > 5 && (
                      <div className="pt-2 text-[11px] text-muted-faint text-center font-medium">
                        + {sec.questions.length - 5} more questions in this section
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PDF Paper Ingestor Modal */}
      {isPdfIngestorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-5xl rounded-2xl bg-card border border-line shadow-2xl p-6 my-8 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-line">
              <h2 className="font-display font-bold text-base text-ink">Official PDF Exam Ingestion & OCR</h2>
              <Button size="sm" variant="outline" onClick={() => { setIsPdfIngestorOpen(false); loadData(); }}>
                Done
              </Button>
            </div>
            <PdfPaperIngestor
              onPaperPublished={() => {
                loadData();
                setIsPdfIngestorOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(testToDelete)}
        onClose={() => setTestToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Permanently Delete Mock Test?"
        message={`Are you sure you want to delete "${testToDelete?.title}"? All associated published paper records and custom mock mappings will be permanently removed.`}
        confirmText="Delete Test"
        tone="danger"
        isLoading={isDeleting}
      />

      {/* Rename Mock Test Modal */}
      {renamingTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-2xl bg-card border border-line shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Edit3 className="w-4 h-4" />
                </div>
                <h2 className="font-display font-bold text-base text-ink">Rename Mock Test</h2>
              </div>
              <button
                onClick={() => setRenamingTest(null)}
                className="p-1 rounded-lg text-muted hover:text-ink hover:bg-subtle transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Mock Test Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Civil Engineering Full Mock Exam (Paper 14)"
                  className="w-full h-10 px-3 rounded-xl border border-line bg-surface text-xs text-ink placeholder:text-muted-faint focus:border-primary focus:outline-none"
                />
                <p className="text-[11px] text-muted-faint mt-1">
                  The primary title shown to students in their exam lounge.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Paper Name / Description
                </label>
                <input
                  type="text"
                  value={newPaperName}
                  onChange={(e) => setNewPaperName(e.target.value)}
                  placeholder="e.g. Paper II — Technical Paper (100 MCQs)"
                  className="w-full h-10 px-3 rounded-xl border border-line bg-surface text-xs text-ink placeholder:text-muted-faint focus:border-primary focus:outline-none"
                />
                <p className="text-[11px] text-muted-faint mt-1">
                  Subtitle describing exam paper series, code, or syllabus.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setRenamingTest(null)}
                disabled={isRenaming}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveRename}
                disabled={!newTitle.trim() || isRenaming}
                iconLeft={isRenaming ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              >
                {isRenaming ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
