import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  User,
  LogOut,
  RefreshCw,
  Clock,
  Layers,
  Users
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Badge } from '@/components/ui/Badge';
import { AdminRoleDefinition, ADMIN_ROLES, AdminRoleType } from '@/services/adminRoleService';
import { getActiveAiProvider } from '@/services/aiProviderManagement';
import { getStudentDomainUrl } from '@/config/domainConfig';
import { AdminSectionId } from './AdminSidebar';

interface AdminHeaderProps {
  activeSection: AdminSectionId;
  onOpenMobileSidebar: () => void;
  onOpenSearch: () => void;
  currentRole: AdminRoleDefinition;
  onChangeRole: (role: AdminRoleType) => void;
  onLockSession: () => void;
  onNavigate: (section: AdminSectionId) => void;
}

const SECTION_TITLES: Record<AdminSectionId, { title: string; subtitle: string }> = {
  dashboard: { title: 'Overview Dashboard', subtitle: 'Live telemetry and real application health' },
  students: { title: 'Students & Aspirants', subtitle: 'Enrolled candidate roster and performance dossiers' },
  'mock-tests': { title: 'CBT Mock Tests', subtitle: 'Published examination papers and subheads' },
  'test-maker': { title: 'Custom Mock Test Maker', subtitle: 'Hierarchical topic builder & factual AI engine' },
  'question-bank': { title: 'Question Bank Manager', subtitle: 'Universal taxonomy hierarchy & bulk import' },
  'exams-courses': { title: 'Exams & Courses', subtitle: 'Target examinations and syllabus blueprints' },
  analytics: { title: 'Results & Analytics', subtitle: 'Cohort scores, mastery heatmaps and error diagnosis' },
  ai: { title: 'AI Provider Management', subtitle: 'Model endpoints, generation parameters and audit logs' },
  reports: { title: 'Reports & Exports', subtitle: 'Curriculum coverage audit and telemetry downloads' },
  settings: { title: 'Settings & Security', subtitle: 'Role-based access permissions and cloud synchronization' }
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeSection,
  onOpenMobileSidebar,
  onOpenSearch,
  currentRole,
  onChangeRole,
  onLockSession,
  onNavigate
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const aiProvider = getActiveAiProvider();

  const sectionMeta = SECTION_TITLES[activeSection] || {
    title: 'Admin Studio',
    subtitle: 'Examination Management'
  };

  return (
    <header className="h-16 border-b border-line bg-card/95 backdrop-blur px-4 sm:px-6 flex items-center justify-between gap-3 z-20 flex-shrink-0">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl border border-line text-muted hover:text-ink hover:bg-subtle transition flex-shrink-0"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[11px] text-muted-faint font-medium">
            <span>Admin</span>
            <span>/</span>
            <span className="text-muted truncate">{sectionMeta.title}</span>
          </div>
          <h1 className="font-display font-bold text-sm sm:text-base text-ink tracking-tight truncate">
            {sectionMeta.title}
          </h1>
        </div>
      </div>

      {/* Center/Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-line bg-surface hover:border-primary/50 text-xs text-muted hover:text-ink transition shadow-2xs group"
          title="Search database (Ctrl+K or Cmd+K)"
        >
          <Search className="w-3.5 h-3.5 text-muted group-hover:text-primary transition" />
          <span className="text-muted-faint">Quick search...</span>
          <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[9px] font-mono bg-subtle rounded border border-line text-muted">
            ⌘K
          </kbd>
        </button>

        {/* AI Engine Status Pill */}
        <div
          onClick={() => onNavigate('ai')}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-xs font-semibold text-primary cursor-pointer hover:bg-primary/15 transition"
          title="Active AI Provider & Model (Click to configure)"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span className="text-[11px] font-medium">{aiProvider.defaultModel}</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsProfileOpen(false);
            }}
            className="relative p-2 rounded-xl border border-line text-muted hover:text-ink hover:bg-subtle transition"
            title="System Alerts & Activity"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-card border border-line shadow-2xl p-4 space-y-3 animate-scaleIn z-50">
              <div className="flex items-center justify-between pb-2 border-b border-line">
                <div className="font-display font-bold text-xs text-ink">System Notifications</div>
                <span className="text-[10px] text-muted-faint">Real-time sync</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-subtle border border-line space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-ink">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                    <span>Universal Taxonomy Loaded</span>
                  </div>
                  <p className="text-[11px] text-muted">
                    Full civil engineering & GS syllabus hierarchy active for test synthesis.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-subtle border border-line space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-ink">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span>AI Engine Active</span>
                  </div>
                  <p className="text-[11px] text-muted">
                    {aiProvider.name} ({aiProvider.defaultModel}) ready for factual grounding.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNotificationsOpen(false)}
                className="w-full text-center text-[10px] text-primary font-semibold hover:underline pt-1"
              >
                Dismiss Alerts
              </button>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Admin Profile & Role Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-line hover:border-line-strong bg-surface transition"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <div className="text-xs font-semibold text-ink truncate">Admin Console</div>
              <div className="text-[10px] text-muted truncate">{currentRole.title}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted hidden sm:block" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-card border border-line shadow-2xl p-3 space-y-3 animate-scaleIn z-50">
              <div className="pb-2 border-b border-line">
                <div className="text-xs font-bold text-ink">Signed in as Administrator</div>
                <div className="text-[11px] text-muted mt-0.5">Role: {currentRole.title}</div>
              </div>

              {/* Role Switcher */}
              <div className="space-y-1.5">
                <div className="text-[10px] uppercase font-bold text-muted-faint tracking-wider">
                  Switch Admin Persona
                </div>
                {(Object.keys(ADMIN_ROLES) as AdminRoleType[]).map((rKey) => {
                  const role = ADMIN_ROLES[rKey];
                  const isCur = currentRole.id === rKey;
                  return (
                    <button
                      key={rKey}
                      onClick={() => {
                        onChangeRole(rKey);
                        setIsProfileOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                        isCur
                          ? 'bg-primary text-white font-semibold'
                          : 'text-muted hover:text-ink hover:bg-subtle'
                      }`}
                    >
                      <span className="truncate">{role.title}</span>
                      {isCur && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-line space-y-1">
                <a
                  href={getStudentDomainUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-muted hover:text-primary hover:bg-subtle transition font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Student Portal</span>
                </a>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onLockSession();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-danger-text hover:bg-danger/10 transition font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Lock Admin Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
