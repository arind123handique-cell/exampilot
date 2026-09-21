import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { isFirebaseConfigured } from '../../firebase/config';
import { LogOut, LogIn, UserRound, ShieldCheck, ClipboardList, Sparkles, History, GraduationCap, Archive } from 'lucide-react';
import { ActiveTab } from './navConfig';
import { ThemeToggle } from '../ui/ThemeToggle';
import { hasLiveAi } from '../../services/geminiService';
import { GeminiKeyModal } from '../gemini/GeminiKeyModal';

export type { ActiveTab };

interface AppLayoutProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAuth: () => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  activeTab,
  setActiveTab,
  onOpenAuth,
  children,
}) => {
  const { user, logout } = useAuth();
  const [isGeminiModalOpen, setIsGeminiModalOpen] = useState(false);
  const [hasKey, setHasKey] = useState(() => hasLiveAi());

  const isAdminRole = activeTab === 'admin';

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-canvas text-ink">
      {/* ───── Top App Bar ───── */}
      <header className="z-20 flex h-14 flex-shrink-0 items-center justify-between gap-3 border-b border-line bg-card/90 px-3 backdrop-blur sm:px-6">
        {/* Brand */}
        <button
          onClick={() => setActiveTab('creator')}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          aria-label="Go to Mock Test Creator"
        >
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white shadow-sm shadow-primary/30">
            EP
          </div>
          <div className="hidden sm:block text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-display text-sm font-bold tracking-tight text-ink">
                ExamPilot
              </span>
              <span className="rounded border border-primary-fixed-dim bg-primary-fixed px-1.5 py-0.5 text-[10px] font-bold text-primary">
                Student
              </span>
            </div>
            <p className="text-[11px] font-medium text-muted">CBT Mock Test & PYQ Portal</p>
          </div>
        </button>

        {/* Center: Student Navigation Tabs */}
        {activeTab === 'test' ? (
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-warning-border bg-warning-surface px-2.5 py-1">
              <span className="h-2 w-2 animate-pulse rounded-full bg-warning" />
              <span className="text-xs font-semibold text-warning-text">Live CBT Test</span>
            </div>
            <div className="flex items-center rounded-xl border border-line bg-surface p-0.5 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('history')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-muted hover:text-ink transition"
                title="View in-progress drafts and previous test records"
              >
                <History className="h-3.5 w-3.5" />
                <span>My Test Records</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center rounded-xl border border-line bg-surface p-0.5 text-xs font-semibold">
            {/* Student: Mock Creator */}
            <button
              onClick={() => setActiveTab('creator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                activeTab === 'creator'
                  ? 'bg-primary text-white shadow-2xs'
                  : 'text-muted hover:text-ink'
              }`}
            >
              <ClipboardList className="h-3.5 w-3.5" />
              <span>Create Mock</span>
            </button>

            {/* Student: PYQ Papers Repository */}
            <button
              onClick={() => setActiveTab('pyq')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                activeTab === 'pyq'
                  ? 'bg-primary text-white shadow-2xs'
                  : 'text-muted hover:text-ink'
              }`}
            >
              <Archive className="h-3.5 w-3.5" />
              <span>PYQ Papers</span>
              <span className="rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 text-[10px] font-bold px-1.5 py-0.5">
                2026
              </span>
            </button>

            {/* Student: Test Records & History */}
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                activeTab === 'history'
                  ? 'bg-primary text-white shadow-2xs'
                  : 'text-muted hover:text-ink'
              }`}
            >
              <History className="h-3.5 w-3.5" />
              <span>My Test Records</span>
            </button>
          </div>
        )}

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Admin Portal Switch Button */}
          <button
            onClick={() => setActiveTab('admin')}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/30 px-2.5 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 transition hover:bg-indigo-100 dark:hover:bg-indigo-900/50 shadow-2xs"
            title="Open Admin Portal to create mock tests & OCR question papers"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">Admin Portal</span>
          </button>
          {/* Gemini AI Key Button */}
          <button
            onClick={() => setIsGeminiModalOpen(true)}
            title="Configure Gemini AI Key & Model"
            className="hidden md:flex items-center gap-1.5 rounded-xl border border-primary/25 bg-primary/5 px-2.5 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary-fixed"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Gemini AI</span>
            <span
              className={`h-1.5 w-1.5 rounded-full ${hasKey ? 'bg-success' : 'bg-muted-faint'}`}
              title={hasKey ? 'Gemini active' : 'Click to configure key'}
            />
          </button>

          <ThemeToggle />

          {/* Firebase sync badge */}
          {isFirebaseConfigured && (
            <span className="hidden items-center gap-1 rounded-full border border-success-border bg-success-surface px-2 py-0.5 text-[11px] font-medium text-success-text sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Cloud Sync
            </span>
          )}

          {/* User / Auth */}
          {user ? (
            <div className="flex items-center gap-1.5">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-subtle text-xs font-bold text-ink-soft">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="h-full w-full object-cover" />
                ) : user.displayName ? (
                  <span>{user.displayName.charAt(0).toUpperCase()}</span>
                ) : (
                  <UserRound className="h-4 w-4" />
                )}
              </div>
              <button
                onClick={logout}
                title="Sign out"
                aria-label="Sign out"
                className="rounded-lg p-1.5 text-muted-faint transition hover:bg-danger-surface hover:text-danger-text"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-dark"
            >
              <LogIn className="h-3.5 w-3.5" />
              Sign in
            </button>
          )}
        </div>
      </header>

      {/* ───── Page Content ───── */}
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 overflow-y-auto bg-canvas focus:outline-none"
      >
        {children}
      </main>

      <GeminiKeyModal
        isOpen={isGeminiModalOpen}
        onClose={() => setIsGeminiModalOpen(false)}
        onKeySaved={() => setHasKey(hasLiveAi())}
      />
    </div>
  );
};
