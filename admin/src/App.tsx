import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { AdminSidebar, AdminSectionId } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';
import { GlobalSearchModal } from './components/GlobalSearchModal';

// 10 Admin Sections
import { DashboardSection } from './components/sections/DashboardSection';
import { StudentsSection } from './components/sections/StudentsSection';
import { MockTestsSection } from './components/sections/MockTestsSection';
import { CustomMockTestMakerSection } from './components/sections/CustomMockTestMakerSection';
import { QuestionBankSection } from './components/sections/QuestionBankSection';
import { ExamsCoursesSection } from './components/sections/ExamsCoursesSection';
import { ResultsAnalyticsSection } from './components/sections/ResultsAnalyticsSection';
import { AiManagementSection } from './components/sections/AiManagementSection';
import { ReportsSection } from './components/sections/ReportsSection';
import { SettingsSection } from './components/sections/SettingsSection';

import {
  AdminRoleType,
  AdminRoleDefinition,
  getCurrentAdminRole,
  setCurrentAdminRole
} from '@/services/adminRoleService';
import { verifyAdminPasscode } from '@/services/adminAuth';
import { getAllStudentProfilesWithScores } from '@/services/studentTelemetryService';
import { getAllCombinedMockTests } from '@/services/adminPaperService';
import { getMasterQuestionPool } from '@/services/adminMockMakerService';
import { MOCK_TESTS } from '@/data/mockData';
import { getStudentDomainUrl } from '@/config/domainConfig';
import { useRealtimeSync } from '@/services/questionBankSyncService';
import { ShieldCheck, Lock, ArrowRight, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const AdminApp: React.FC = () => {
  const { success: toastSuccess, error: toastError, info: toastInfo } = useToast();

  // Authentication & Session Gate
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('exampilot_admin_session') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Layout & Navigation State
  const [activeSection, setActiveSection] = useState<AdminSectionId>('dashboard');
  const [navigationPayload, setNavigationPayload] = useState<any>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Role state
  const [currentRole, setCurrentRole] = useState<AdminRoleDefinition>(() => getCurrentAdminRole());

  // Entity Counts for sidebar badges
  const [counts, setCounts] = useState({
    students: 0,
    mockTests: 0,
    questions: 0
  });

  const refreshCounts = useCallback(async () => {
    try {
      const [studentsList, allTests, allQuestions] = await Promise.all([
        getAllStudentProfilesWithScores(),
        Promise.resolve(getAllCombinedMockTests(MOCK_TESTS)),
        Promise.resolve(getMasterQuestionPool())
      ]);
      setCounts({
        students: studentsList.length,
        mockTests: allTests.length,
        questions: allQuestions.length
      });
    } catch (e) {
      console.warn('[AdminApp] Error loading counts:', e);
    }
  }, []);

  useEffect(() => {
    if (isAdminUnlocked) {
      refreshCounts();
    }
  }, [isAdminUnlocked, refreshCounts]);

  // Realtime multi-tab synchronization
  useRealtimeSync(['all', 'papers', 'mocks', 'questions', 'users'], () => {
    refreshCounts();
  });

  // Global hotkeys (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Unlock verification
  const handleVerifyPasscode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!passcode.trim()) {
      setAuthError('Please enter the administrative security passcode.');
      return;
    }

    setIsVerifying(true);
    setAuthError(null);

    try {
      const result = await verifyAdminPasscode(passcode.trim());
      if (result.ok) {
        sessionStorage.setItem('exampilot_admin_session', 'true');
        setIsAdminUnlocked(true);
        toastSuccess('Session Authenticated', 'Welcome to ExamPilot Enterprise Admin');
      } else {
        setAuthError(result.error || 'Incorrect passcode entered.');
        toastError('Authentication Failed', result.error || 'Invalid passcode');
      }
    } catch (err: any) {
      setAuthError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Lock session
  const handleLockSession = () => {
    sessionStorage.removeItem('exampilot_admin_session');
    setIsAdminUnlocked(false);
    setPasscode('');
    toastInfo('Session Locked', 'Administrator session ended.');
  };

  // Switch role
  const handleRoleChange = (roleType: AdminRoleType) => {
    setCurrentAdminRole(roleType);
    setCurrentRole(getCurrentAdminRole());
  };

  // Navigation handler
  const handleNavigate = (section: AdminSectionId, payload?: any) => {
    setActiveSection(section);
    setNavigationPayload(payload || null);
    setIsMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Return to student site
  const handleReturnToStudent = () => {
    window.location.href = getStudentDomainUrl();
  };

  return (
    <AuthProvider>
      <AnimatedBackground />

      {!isAdminUnlocked ? (
        /* PASSCODE AUTHENTICATION GATE */
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative z-10">
          <div className="w-full max-w-md bg-card/95 backdrop-blur-md border border-line rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-primary text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-ink tracking-tight">
                ExamPilot Administration
              </h2>
              <p className="text-xs sm:text-sm text-muted">
                Enterprise Examination &amp; Curriculum Management Gate
              </p>
            </div>

            {authError && (
              <div className="p-3.5 rounded-xl bg-danger/10 border border-danger/20 text-xs text-danger-text flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-danger flex-shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleVerifyPasscode} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  Administrative Passcode
                </label>
                <div className="relative">
                  <input
                    type={showPasscode ? 'text' : 'password'}
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter admin security passcode..."
                    className="w-full px-4 py-2.5 rounded-xl border border-line bg-surface text-ink text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none pr-10"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode(!showPasscode)}
                    className="absolute right-3 top-3 text-muted hover:text-ink transition"
                    tabIndex={-1}
                  >
                    {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-muted-faint mt-1.5">
                  No default passcode. Set <code className="font-mono text-muted">VITE_ADMIN_PASSCODE_SHA256</code> to unlock.
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full py-2.5 text-sm font-semibold shadow-md shadow-primary/20"
                disabled={isVerifying}
              >
                {isVerifying ? 'Verifying Authorization...' : 'Unlock Admin Studio'}
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </form>

            <div className="pt-4 border-t border-line text-center">
              <button
                type="button"
                onClick={handleReturnToStudent}
                className="text-xs text-muted hover:text-primary transition font-medium"
              >
                &larr; Return to Student Portal
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* MODERN ENTERPRISE ADMIN WORKSPACE */
        <div className="min-h-screen flex bg-background text-ink antialiased relative z-10">
          {/* Collapsible Desktop Sidebar & Mobile Drawer */}
          <AdminSidebar
            activeSection={activeSection}
            onSelectSection={handleNavigate}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            isMobileOpen={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
            currentRole={currentRole}
            onLockSession={handleLockSession}
            counts={counts}
          />

          {/* Main App Body */}
          <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
            {/* Top Modern Header */}
            <AdminHeader
              activeSection={activeSection}
              onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
              onOpenSearch={() => setIsSearchOpen(true)}
              currentRole={currentRole}
              onChangeRole={handleRoleChange}
              onLockSession={handleLockSession}
              onNavigate={handleNavigate}
            />

            {/* Dynamic Section Viewport */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              {activeSection === 'dashboard' && (
                <DashboardSection onNavigate={handleNavigate} />
              )}

              {activeSection === 'students' && (
                <StudentsSection initialSelectedUid={navigationPayload?.uid} />
              )}

              {activeSection === 'mock-tests' && (
                <MockTestsSection
                  onNavigate={handleNavigate}
                  initialSelectedMockId={navigationPayload?.mockId}
                />
              )}

              {activeSection === 'test-maker' && (
                <CustomMockTestMakerSection
                  onNavigate={handleNavigate}
                  initialPayload={navigationPayload}
                />
              )}

              {activeSection === 'question-bank' && (
                <QuestionBankSection />
              )}

              {activeSection === 'exams-courses' && (
                <ExamsCoursesSection onNavigate={handleNavigate} />
              )}

              {activeSection === 'analytics' && (
                <ResultsAnalyticsSection />
              )}

              {activeSection === 'ai' && (
                <AiManagementSection />
              )}

              {activeSection === 'reports' && (
                <ReportsSection onNavigate={handleNavigate} />
              )}

              {activeSection === 'settings' && (
                <SettingsSection
                  currentRole={currentRole}
                  onChangeRole={handleRoleChange}
                  onLockSession={handleLockSession}
                  onNavigate={handleNavigate}
                  onShowToast={(msg, type) => {
                    if (type === 'error') toastError(msg);
                    else toastSuccess(msg);
                  }}
                />
              )}
            </main>
          </div>

          {/* Unified Global Search Modal (⌘K) */}
          <GlobalSearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onNavigate={(sec, payload) => handleNavigate(sec as AdminSectionId, payload)}
          />
        </div>
      )}
    </AuthProvider>
  );
};

export default AdminApp;
