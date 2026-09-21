import React from 'react';
import {
  LayoutDashboard,
  Users,
  Layers,
  Sparkles,
  Database,
  BookOpen,
  BarChart2,
  Cpu,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  LogOut,
  X,
  ExternalLink,
  Bot
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { AdminRoleDefinition } from '@/services/adminRoleService';
import { getStudentDomainUrl } from '@/config/domainConfig';

export type AdminSectionId =
  | 'dashboard'
  | 'students'
  | 'mock-tests'
  | 'test-maker'
  | 'question-bank'
  | 'exams-courses'
  | 'analytics'
  | 'ai'
  | 'reports'
  | 'settings';

interface NavItem {
  id: AdminSectionId;
  label: string;
  short: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeTone?: 'brand' | 'accent' | 'success' | 'warning';
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Overview Dashboard', short: 'Dashboard', icon: LayoutDashboard },
  { id: 'students', label: 'Students & Aspirants', short: 'Students', icon: Users },
  { id: 'mock-tests', label: 'CBT Mock Tests', short: 'Mock Tests', icon: Layers },
  { id: 'test-maker', label: 'Custom Test Maker', short: 'Test Maker', icon: Sparkles, badge: 'AI/Hybrid', badgeTone: 'brand' },
  { id: 'question-bank', label: 'Question Bank', short: 'Questions', icon: Database },
  { id: 'exams-courses', label: 'Exams & Courses', short: 'Exams', icon: BookOpen },
  { id: 'analytics', label: 'Results & Analytics', short: 'Analytics', icon: BarChart2 },
  { id: 'ai', label: 'AI Management & Logs', short: 'AI Studio', icon: Cpu },
  { id: 'reports', label: 'Reports & Exports', short: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings & Security', short: 'Settings', icon: Settings }
];

interface AdminSidebarProps {
  activeSection: AdminSectionId;
  onSelectSection: (id: AdminSectionId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  currentRole: AdminRoleDefinition;
  onLockSession: () => void;
  counts?: {
    students: number;
    mockTests: number;
    questions: number;
  };
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection,
  onSelectSection,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  currentRole,
  onLockSession,
  counts
}) => {
  const sidebarContent = (
    <div className="flex flex-col h-full bg-card border-r border-line select-none">
      {/* Top Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-line flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-primary text-white flex items-center justify-center shadow-md shadow-indigo-600/30 flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0 leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-sm tracking-tight text-ink">ExamPilot</span>
                <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                  Admin
                </span>
              </div>
              <p className="text-[10px] text-muted truncate">CBT Exam & Content Studio</p>
            </div>
          )}
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-muted hover:text-ink hover:bg-subtle"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Role Badge Indicator */}
      {!isCollapsed && (
        <div className="px-4 py-3 border-b border-line/60 bg-subtle/40 flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-[10px] uppercase font-bold text-muted-faint tracking-wider">Active Role</div>
            <div className="text-xs font-semibold text-ink flex items-center gap-1.5 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              <span>{currentRole.title}</span>
            </div>
          </div>
          <Badge size="sm" tone={currentRole.badgeTone}>
            RBAC
          </Badge>
        </div>
      )}

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectSection(item.id);
                onCloseMobile();
              }}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition group relative ${
                isActive
                  ? 'bg-primary text-white font-semibold shadow-xs'
                  : 'text-muted hover:text-ink hover:bg-subtle'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-muted group-hover:text-ink'}`} />
              
              {!isCollapsed && (
                <div className="flex-1 text-left flex items-center justify-between min-w-0">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.id === 'students' && counts && !item.badge && (
                    <span className={`text-[10px] font-mono ${isActive ? 'text-white/80' : 'text-muted-faint'}`}>
                      {counts.students}
                    </span>
                  )}
                  {item.id === 'mock-tests' && counts && !item.badge && (
                    <span className={`text-[10px] font-mono ${isActive ? 'text-white/80' : 'text-muted-faint'}`}>
                      {counts.mockTests}
                    </span>
                  )}
                  {item.id === 'question-bank' && counts && !item.badge && (
                    <span className={`text-[10px] font-mono ${isActive ? 'text-white/80' : 'text-muted-faint'}`}>
                      {counts.questions}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-3 border-t border-line space-y-2 bg-subtle/30 flex-shrink-0">
        <a
          href={getStudentDomainUrl()}
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-muted hover:text-primary hover:bg-subtle transition font-medium"
          title="Open student examination site in a new tab"
        >
          <ExternalLink className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span>View Student Site</span>}
        </a>

        <button
          onClick={onLockSession}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-danger-text hover:bg-danger/10 transition font-medium"
          title="Lock admin session and return to passcode screen"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span>Lock Session</span>}
        </button>

        {/* Desktop Collapse Toggle */}
        <div className="hidden lg:block pt-1">
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center p-2 rounded-xl border border-line text-muted hover:text-ink hover:bg-subtle transition"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden lg:block h-screen transition-all duration-300 flex-shrink-0 z-30 ${
          isCollapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn"
        />
      )}

      {/* Mobile Drawer Panel */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};
