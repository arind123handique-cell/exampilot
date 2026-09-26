import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  Sparkles,
  Database,
  Layers,
  ArrowRight,
  ExternalLink,
  Trash2,
  Play,
  Calendar,
  CheckCircle2,
  CloudUpload,
  UserCheck,
  Users,
  LogOut
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { GeminiKeyModal } from '../components/gemini/GeminiKeyModal';
import { hasLiveAi } from '../services/geminiService';
import { PdfPaperIngestor } from '../components/admin/PdfPaperIngestor';
import { QuestionDatabaseManager } from '../components/admin/QuestionDatabaseManager';
import { AdminUsersAndScoresView } from '../components/admin/AdminUsersAndScoresView';
import { MockTestSectionEditor } from '../components/admin/MockTestSectionEditor';
import { PyqAiMockGeneratorModal } from '../components/admin/PyqAiMockGeneratorModal';
import { AiIngestionStudioPage } from './AiIngestionStudioPage';
import {
  getAdminPublishedPapers,
  deleteAdminPublishedPaper,
  getAdminPublishedMockTests
} from '../services/adminPaperService';
import { useRealtimeSync } from '../services/questionBankSyncService';
import { PYQPaper, MockTest } from '../types';
import { useToast } from '../context/ToastContext';
import { verifyAdminPasscode } from '../services/adminAuth';

interface AdminPortalPageProps {
  onSwitchToStudentPortal: () => void;
  onLaunchMockTest?: (mock: MockTest) => void;
}

type AdminTab = 'pdf-ocr' | 'ai-studio' | 'database' | 'published' | 'subheads-editor' | 'users-scores';

export const AdminPortalPage: React.FC<AdminPortalPageProps> = ({
  onSwitchToStudentPortal,
  onLaunchMockTest
}) => {
  const { success: toastSuccess, error: toastError } = useToast();
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('pdf-ocr');
  const [isGeminiModalOpen, setIsGeminiModalOpen] = useState(false);
  const [isAiGeneratorOpen, setIsAiGeneratorOpen] = useState(false);
  const [selectedMockForEditing, setSelectedMockForEditing] = useState<string | undefined>(undefined);
  const [hasKey, setHasKey] = useState(() => hasLiveAi());

  // Admin access gate
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('exampilot_admin_session') === 'true';
  });
  const [adminPasscode, setAdminPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const [publishedPapers, setPublishedPapers] = useState<PYQPaper[]>(() => getAdminPublishedPapers());

  const refreshPublished = () => {
    setPublishedPapers(getAdminPublishedPapers());
  };

  // Real-time synchronization across all tabs and storage updates
  useRealtimeSync(['papers', 'mocks', 'all'], () => {
    refreshPublished();
  });

  const handleUnlockAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setPasscodeError(null);
    try {
      // Compared against a SHA-256 digest so the passcode itself is never inlined
      // into the bundle. This is a UX gate only — firestore.rules enforces the
      // `admin` custom claim for every privileged write.
      const result = await verifyAdminPasscode(adminPasscode);
      if (result.ok) {
        setIsAdminUnlocked(true);
        sessionStorage.setItem('exampilot_admin_session', 'true');
        toastSuccess('Admin Access Granted', 'Welcome to the Exam Paper Creator & OCR Ingestion Studio.');
      } else {
        setPasscodeError(result.error);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAdminLock = () => {
    sessionStorage.removeItem('exampilot_admin_session');
    setIsAdminUnlocked(false);
    toastSuccess('Admin Session Locked', 'Signed out of Admin Studio.');
  };

  const handleDeletePaper = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from mock tests?`)) {
      await deleteAdminPublishedPaper(id);
      refreshPublished();
      toastSuccess('Paper Deleted', `"${name}" removed from database and mock tests.`);
    }
  };

  // ── Admin Security Gate ──
  if (!isAdminUnlocked) {
    return (
      <div className="min-h-screen w-full max-w-full flex flex-col justify-center items-center p-4 bg-canvas text-ink">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30 mb-2">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
              ExamPilot Admin Portal
            </h1>
            <p className="text-xs text-muted">
              Restricted area for paper authoring, PDF OCR parsing, and database synchronization.
            </p>
          </div>

          <Card flush className="p-6 sm:p-8 space-y-5 shadow-lg border-indigo-500/30">
            {passcodeError && (
              <div className="p-3 rounded-xl bg-danger-surface border border-danger-border text-xs text-danger-text">
                {passcodeError}
              </div>
            )}

            <form onSubmit={handleUnlockAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">Admin Access Passcode</label>
                <input
                  type="password"
                  required
                  autoFocus
                  value={adminPasscode}
                  onChange={(e) => { setAdminPasscode(e.target.value); setPasscodeError(null); }}
                  placeholder="Enter admin passcode"
                  className="w-full h-10 px-3.5 rounded-xl border border-line bg-surface text-xs text-ink placeholder:text-muted-faint focus:border-indigo-500 focus:outline-none"
                />
                <span className="text-[10px] text-muted-faint mt-1 block">Configured via <code>VITE_ADMIN_PASSCODE_SHA256</code> in your <code>.env</code> file.</span>
              </div>

              <Button
                type="submit"
                disabled={isVerifying}
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20"
              >
                {isVerifying ? 'Verifying…' : 'Access Admin Studio'}
              </Button>

              <p className="text-[10px] leading-relaxed text-muted-faint">
                This passcode is a local UX gate, not access control. In cloud mode the
                question bank, published papers and mock tests are write-protected in
                <code> firestore.rules</code> behind an <code>admin</code> custom claim.
              </p>
            </form>

            <div className="pt-3 border-t border-line text-center">
              <button
                type="button"
                onClick={onSwitchToStudentPortal}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                ← Return to Student Website
              </button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full max-w-full flex-col overflow-hidden bg-canvas text-ink">
      {/* ───── Dedicated Admin Top App Bar ───── */}
      <header className="z-20 flex h-14 flex-shrink-0 items-center justify-between gap-3 border-b border-indigo-500/20 bg-card/95 px-3 backdrop-blur sm:px-6 shadow-xs">
        {/* Admin Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-sm shadow-indigo-600/30">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-sm font-bold tracking-tight text-ink">
                ExamPilot
              </span>
              <span className="rounded bg-indigo-600 text-white px-1.5 py-0.2 text-[10px] font-bold tracking-wide uppercase">
                Admin Studio
              </span>
            </div>
            <p className="text-[10px] font-medium text-muted">Paper Creator & OCR Ingestion Portal</p>
          </div>
        </div>

        {/* Center: Admin Navigation Tabs */}
        <div className="flex items-center rounded-xl border border-line bg-surface p-0.5 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveAdminTab('pdf-ocr')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeAdminTab === 'pdf-ocr'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-muted hover:text-ink'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF OCR & Paper Creator</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('ai-studio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeAdminTab === 'ai-studio'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-muted hover:text-ink'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Topic Studio</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('database')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeAdminTab === 'database'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-muted hover:text-ink'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Question Bank</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('published')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeAdminTab === 'published'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-muted hover:text-ink'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Published Papers ({publishedPapers.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('subheads-editor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeAdminTab === 'subheads-editor'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-muted hover:text-ink'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Sub-heads &amp; MCQs</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('users-scores')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeAdminTab === 'users-scores'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-muted hover:text-ink'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Users &amp; Scores</span>
          </button>
        </div>

        {/* Right: Controls & Portal Switcher */}
        <div className="flex items-center gap-2">
          {/* PYQ + AI Generator Button */}
          <button
            onClick={() => setIsAiGeneratorOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-500/40 bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1.5 text-xs font-bold transition shadow-xs"
            title="Create Mock Test from PYQs & Google AI (5, 10, 25, 50, 100 MCQs)"
          >
            <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
            <span className="hidden sm:inline">PYQ + AI Generator</span>
          </button>

          {/* Gemini AI Key Button */}
          <button
            onClick={() => setIsGeminiModalOpen(true)}
            title="Configure Gemini AI Key & Model"
            className="hidden md:flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/30 px-2.5 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 transition hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Gemini AI</span>
            <span
              className={`h-1.5 w-1.5 rounded-full ${hasKey ? 'bg-success' : 'bg-muted-faint'}`}
              title={hasKey ? 'Gemini active' : 'Click to configure key'}
            />
          </button>

          <ThemeToggle />

          {/* Switch to Student Portal */}
          <button
            onClick={onSwitchToStudentPortal}
            className="flex items-center gap-1.5 rounded-xl border border-line bg-subtle hover:bg-subtle-strong px-3 py-1.5 text-xs font-semibold text-ink transition shadow-2xs"
            title="Switch to Student Examination Portal"
          >
            <span>Student Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-muted" />
          </button>

          {/* Lock Admin Session */}
          <button
            onClick={handleAdminLock}
            className="p-1.5 rounded-xl border border-line hover:bg-danger-surface hover:text-danger-text text-muted transition"
            title="Lock Admin Studio"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ───── Admin Page Content ───── */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-canvas">
        {activeAdminTab === 'pdf-ocr' && (
          <PdfPaperIngestor
            onPaperPublished={() => refreshPublished()}
            onOpenTest={(mock) => onLaunchMockTest?.(mock)}
          />
        )}

        {activeAdminTab === 'ai-studio' && (
          <AiIngestionStudioPage />
        )}

        {activeAdminTab === 'database' && (
          <QuestionDatabaseManager />
        )}

        {activeAdminTab === 'published' && (
          <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn">
            <Card flush className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="font-display font-bold text-xl text-ink">
                    Admin Published Question Papers & Mock Tests
                  </h2>
                  <p className="text-xs text-muted mt-1">
                    Manage papers created from PDF OCR or manual authoring that are currently active in the Student Portal.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setActiveAdminTab('pdf-ocr')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  icon={<FileText className="w-3.5 h-3.5" />}
                >
                  Upload New Paper
                </Button>
              </div>
            </Card>

            {publishedPapers.length === 0 ? (
              <Card flush className="p-12 text-center space-y-3 border-dashed">
                <FileText className="w-10 h-10 text-muted-faint mx-auto" />
                <h3 className="font-semibold text-sm text-ink">No Custom Published Papers Yet</h3>
                <p className="text-xs text-muted max-w-sm mx-auto">
                  Upload an examination PDF in the "PDF OCR & Paper Creator" tab to parse questions and publish a new mock test.
                </p>
                <Button
                  size="sm"
                  onClick={() => setActiveAdminTab('pdf-ocr')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white mt-2"
                >
                  Start PDF OCR Ingestion
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {publishedPapers.map((paper) => {
                  return (
                    <Card flush className="p-5 space-y-3 hover:border-line-strong transition" key={paper.id}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-[10px]">
                              {paper.year}
                            </span>
                            <span className="font-semibold text-ink">{paper.examName}</span>
                          </div>
                          <p className="text-xs text-muted mt-1">{paper.paperType}</p>
                        </div>

                        <button
                          onClick={() => handleDeletePaper(paper.id, paper.examName)}
                          className="p-1.5 rounded-lg text-muted hover:text-danger-text hover:bg-danger-surface transition"
                          title="Delete paper"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-line text-xs">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          {paper.totalQuestions} Questions Extracted
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              const mocks = getAdminPublishedMockTests();
                              const targetMock = mocks.find((m) => m.id.includes(paper.id) || m.examId.includes(paper.id));
                              if (targetMock) {
                                setSelectedMockForEditing(targetMock.id);
                              }
                              setActiveAdminTab('subheads-editor');
                            }}
                            className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold"
                          >
                            Edit Sub-heads &amp; MCQs
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const mocks = getAdminPublishedMockTests();
                              const targetMock = mocks.find((m) => m.id.includes(paper.id) || m.examId.includes(paper.id));
                              if (targetMock && onLaunchMockTest) {
                                onLaunchMockTest(targetMock);
                              } else {
                                onSwitchToStudentPortal();
                              }
                            }}
                            iconRight={<Play className="w-3 h-3" />}
                          >
                            Launch in Student CBT
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeAdminTab === 'subheads-editor' && (
          <MockTestSectionEditor
            selectedMockId={selectedMockForEditing}
            onBack={() => setActiveAdminTab('published')}
            onLaunchMock={(mock) => onLaunchMockTest?.(mock)}
          />
        )}

        {activeAdminTab === 'users-scores' && (
          <AdminUsersAndScoresView />
        )}
      </main>

      <PyqAiMockGeneratorModal
        isOpen={isAiGeneratorOpen}
        onClose={() => setIsAiGeneratorOpen(false)}
        onMockCreated={(mock) => {
          refreshPublished();
          setSelectedMockForEditing(mock.id);
          setActiveAdminTab('subheads-editor');
        }}
      />

      <GeminiKeyModal
        isOpen={isGeminiModalOpen}
        onClose={() => setIsGeminiModalOpen(false)}
        onKeySaved={() => setHasKey(hasLiveAi())}
      />
    </div>
  );
};
export default AdminPortalPage;
