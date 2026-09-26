import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { UserProfile, UserPreferences } from '../types';
import { getUserProfile, saveUserProfile } from '../services/userDataService';

interface AuthContextType {
  /** Raw Supabase Auth user (session identity), null when signed out. */
  authUser: User | null;
  user: UserProfile | null;
  loading: boolean;
  isDemoMode: boolean;
  error: string | null;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<{ needsConfirmation: boolean }>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  /** Completes a password-recovery link flow by setting a new password. */
  completePasswordRecovery: (newPassword: string) => Promise<void>;
  /** True while the browser holds a password-recovery session (reset link clicked). */
  recoveryMode: boolean;
  clearRecoveryMode: () => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  updateStats: (stats: Partial<UserProfile['stats']>) => Promise<void>;
  recordActivity: (deltaQuestions: number, deltaCorrect: number, deltaHours?: number) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_SESSION_CACHE_KEY = 'exampilot_active_user';

export const BASELINE_USER_STATS: UserProfile['stats'] = {
  readinessScore: 0,
  questionsAttempted: 0,
  accuracyRate: 0,
  studyStreakDays: 1,
  totalStudyHours: 0
};

/**
 * Thrown by every cloud sign-in path when the build shipped without Supabase
 * configuration (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY not set on the host).
 *
 * This must be an ERROR, never a silent return — a missing build-time env var
 * must not masquerade as a working sign-in.
 */
export const SUPABASE_NOT_CONFIGURED_MESSAGE =
  'Cloud sign-in is unavailable on this deployment: the Supabase configuration is missing from the build. ' +
  'Vite inlines VITE_* variables at BUILD time, so set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY ' +
  'in your hosting provider\u2019s environment settings and redeploy.';

function requireAuth() {
  if (!isSupabaseConfigured || !supabase) {
    const err: any = new Error(SUPABASE_NOT_CONFIGURED_MESSAGE);
    err.code = 'exampilot/supabase-not-configured';
    throw err;
  }
  return supabase;
}

export const formatAuthError = (err: any): string => {
  const msg = String(err?.message || '');
  const code = String(err?.code || '');

  if (code === 'exampilot/supabase-not-configured') {
    return SUPABASE_NOT_CONFIGURED_MESSAGE;
  }

  if (msg.includes('Invalid login credentials')) {
    return 'Incorrect email or password. Please verify your credentials or create a new account.';
  }
  if (msg.includes('Email not confirmed')) {
    return 'Please confirm your email first. Check your inbox for the confirmation link, then sign in again.';
  }
  if (msg.includes('User already registered') || code === 'user_already_exists') {
    return 'An account with this email address already exists. Please sign in instead.';
  }
  if (msg.includes('Password should be at least') || code === 'weak_password') {
    return 'Password is too weak. Please use at least 6 characters.';
  }
  if (msg.includes('Signups not allowed')) {
    return 'Sign-ups are currently disabled on this deployment. Contact your administrator.';
  }
  if (msg.includes('For security purposes') || msg.includes('rate limit') || code === 'over_email_send_rate_limit') {
    return 'Too many attempts. Please wait a minute before trying again.';
  }
  if (msg.includes('provider') && msg.includes('not enabled')) {
    return 'This sign-in provider is not enabled in Supabase. Enable it under Authentication \u2192 Providers.';
  }
  if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || code === 'retryable') {
    return 'Network connection issue. Please check your internet connection.';
  }
  if (msg.includes('both password and token') || msg.includes('otp')) {
    return 'This password reset link has expired or was already used. Please request a new one.';
  }
  return msg || 'Authentication request failed. Please check credentials and try again.';
};

function defaultProfileFromAuth(u: User): UserProfile {
  const meta = (u.user_metadata || {}) as Record<string, any>;
  return {
    uid: u.id,
    email: u.email || null,
    displayName: meta.display_name || meta.name || 'Aspirant',
    photoURL: meta.avatar_url || meta.picture || null,
    isAnonymous: false,
    preferences: {
      examId: 'apsc-ae-civil',
      examName: 'APSC Assistant Engineer (Civil)',
      advtNumber: 'Advt 31/2025',
      targetYear: 2026,
      dailyHoursGoal: 4,
      currentStream: 'Civil Engineering',
      level: 'intermediate',
      onboarded: true
    },
    stats: { ...BASELINE_USER_STATS },
    createdAt: new Date().toISOString()
  };
}

/**
 * Compact modal rendered by the provider itself when a password-recovery link
 * lands (Supabase fires PASSWORD_RECOVERY with a temporary session). Keeps the
 * recovery flow working without depending on any particular page route.
 */
const PasswordResetGate: React.FC<{
  onSubmit: (password: string) => Promise<void>;
  onCancel: () => void;
  error: string | null;
}> = ({ onSubmit, onCancel, error }) => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setLocalError('Both passwords must match.');
      return;
    }
    setBusy(true);
    try {
      await onSubmit(password);
    } catch {
      // surfaced via context error below
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div role="dialog" aria-modal="true" aria-label="Set a new password" className="w-full max-w-sm rounded-2xl border border-line bg-card p-5 shadow-2xl space-y-4">
        <div>
          <h3 className="font-display text-base font-semibold text-ink">Set a new password</h3>
          <p className="text-xs text-muted mt-1">
            You followed a password reset link. Choose a new password to secure your account.
          </p>
        </div>
        {(localError || error) && (
          <div className="rounded-xl border border-danger-border bg-danger-surface px-3 py-2 text-xs text-danger-text">
            {localError || error}
          </div>
        )}
        <form onSubmit={submit} className="space-y-3">
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-ink-soft">New password</span>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-primary"
              placeholder="At least 6 characters"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-ink-soft">Confirm password</span>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-primary"
              placeholder="Repeat it"
            />
          </label>
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg px-3 py-2 text-xs font-semibold text-muted hover:text-ink transition"
            >
              Later
            </button>
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
            >
              {busy ? 'Saving…' : 'Save password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [recoveryMode, setRecoveryMode] = useState<boolean>(false);

  // Initialize or restore session via Supabase Auth
  useEffect(() => {
    // Clean up any legacy demo or anonymous guest keys
    try {
      localStorage.removeItem('exampilot_demo_user');
      const cached = localStorage.getItem(USER_SESSION_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.isAnonymous) {
          localStorage.removeItem(USER_SESSION_CACHE_KEY);
        }
      }
    } catch {
      // ignore
    }

    if (isSupabaseConfigured && supabase) {
      let cancelled = false;

      const applySession = async (session: Session | null) => {
        const supaUser = session?.user ?? null;
        if (cancelled) return;
        setAuthUser(supaUser);

        if (supaUser) {
          // Reject anonymous sessions if any exist
          if (supaUser.is_anonymous) {
            // Deferred: awaiting an auth method inside the onAuthStateChange
            // callback can deadlock the GoTrue client.
            setTimeout(() => {
              supabase?.auth.signOut().catch(() => {
                // ignore
              });
            }, 0);
            if (!cancelled) {
              setUser(null);
              localStorage.removeItem(USER_SESSION_CACHE_KEY);
              setLoading(false);
            }
            return;
          }

          try {
            const profile = await getUserProfile(supaUser.id);
            if (profile) {
              if (!cancelled) setUser(profile);
              localStorage.setItem(USER_SESSION_CACHE_KEY, JSON.stringify(profile));
            } else {
              const newProfile = defaultProfileFromAuth(supaUser);
              await saveUserProfile(newProfile);
              if (!cancelled) setUser(newProfile);
              localStorage.setItem(USER_SESSION_CACHE_KEY, JSON.stringify(newProfile));
            }
          } catch (err: any) {
            console.error('Error syncing profile with Supabase:', err);
            if (!cancelled) setError(err.message || 'Failed to fetch user profile');
          }
        } else {
          // No active session → user must authenticate
          if (!cancelled) setUser(null);
          localStorage.removeItem(USER_SESSION_CACHE_KEY);
        }
        if (!cancelled) setLoading(false);
      };

      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          setRecoveryMode(true);
        }
        void applySession(session);
      });

      return () => {
        cancelled = true;
        subscription.unsubscribe();
      };
    }

    // Not configured: local-cache-only mode (clearly an error state upstream)
    setUser(null);
    localStorage.removeItem(USER_SESSION_CACHE_KEY);
    setLoading(false);
    return;
  }, []);

  const timeoutPromise = <T,>(promise: Promise<T>, ms = 8000, errorMsg = 'Authentication request timed out'): Promise<T> => {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error(errorMsg)), ms))
    ]);
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setError(null);
    try {
      const client = requireAuth();
      await timeoutPromise(
        client.auth.signInWithPassword({ email, password: pass }),
        8000,
        'Sign in timed out. Please check network connection.'
      );
    } catch (err: any) {
      const friendlyMsg = formatAuthError(err);
      setError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string): Promise<{ needsConfirmation: boolean }> => {
    setError(null);
    try {
      const client = requireAuth();
      const { data, error: signUpError } = await timeoutPromise(
        client.auth.signUp({
          email,
          password: pass,
          options: { data: { display_name: name } }
        }),
        10000,
        'Sign up timed out. Please check network connection.'
      );
      if (signUpError) throw signUpError;

      // With "Confirm email" enabled in Supabase, signUp returns a user but no
      // session — profile creation then happens on first sign-in via the auth
      // listener above. Surface that state so the UI can guide the candidate.
      const needsConfirmation = Boolean(data.user && !data.session);
      return { needsConfirmation };
    } catch (err: any) {
      const friendlyMsg = formatAuthError(err);
      setError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  const signInWithGoogle = async () => {
    setError(null);
    try {
      const client = requireAuth();
      // Full-page OAuth redirect: after Google returns, onAuthStateChange
      // fires and the profile is created/loaded by the session listener.
      const { error: oauthError } = await timeoutPromise(
        client.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: window.location.origin }
        }),
        45000,
        'Google sign-in timed out.'
      );
      if (oauthError) throw oauthError;
    } catch (err: any) {
      const friendlyMsg = formatAuthError(err);
      setError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('[ExamPilot] signOut notice:', err);
      }
    }
    setUser(null);
    setAuthUser(null);
    localStorage.removeItem(USER_SESSION_CACHE_KEY);
  };

  const resetPassword = async (email: string) => {
    setError(null);
    try {
      const client = requireAuth();
      await timeoutPromise(
        client.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin }),
        10000,
        'Password reset request timed out. Please check network connection.'
      );
    } catch (err: any) {
      const friendlyMsg = formatAuthError(err);
      setError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  const completePasswordRecovery = async (newPassword: string) => {
    setError(null);
    try {
      const client = requireAuth();
      const { error: updateError } = await timeoutPromise(
        client.auth.updateUser({ password: newPassword }),
        10000,
        'Password update timed out. Please check network connection.'
      );
      if (updateError) throw updateError;
      setRecoveryMode(false);
    } catch (err: any) {
      const friendlyMsg = formatAuthError(err);
      setError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  const clearRecoveryMode = () => setRecoveryMode(false);

  const updatePreferences = async (newPrefs: Partial<UserPreferences>) => {
    if (!user) return;
    const updatedUser: UserProfile = {
      ...user,
      preferences: {
        ...user.preferences,
        ...newPrefs
      }
    };
    setUser(updatedUser);
    localStorage.setItem(USER_SESSION_CACHE_KEY, JSON.stringify(updatedUser));
    await saveUserProfile(updatedUser);
  };

  const updateStats = async (newStats: Partial<UserProfile['stats']>) => {
    if (!user) return;
    const updatedUser: UserProfile = {
      ...user,
      stats: {
        ...user.stats,
        ...newStats
      }
    };
    setUser(updatedUser);
    localStorage.setItem(USER_SESSION_CACHE_KEY, JSON.stringify(updatedUser));
    await saveUserProfile(updatedUser);
  };

  const recordActivity = async (
    deltaQuestions: number,
    deltaCorrect: number,
    deltaHours: number = 0.05
  ) => {
    if (!user) return;
    const curStats = user.stats || BASELINE_USER_STATS;
    const totalQ = curStats.questionsAttempted + deltaQuestions;
    const prevCorrect = Math.round((curStats.accuracyRate / 100) * curStats.questionsAttempted);
    const newCorrect = prevCorrect + deltaCorrect;
    const accuracy = totalQ > 0 ? Math.round((newCorrect / totalQ) * 100) : 0;
    const hours = Math.round((curStats.totalStudyHours + deltaHours) * 10) / 10;
    const readiness = Math.min(
      100,
      Math.round(accuracy * 0.5 + Math.min(100, (totalQ / 100) * 100) * 0.5)
    );

    const updatedUser: UserProfile = {
      ...user,
      stats: {
        ...curStats,
        questionsAttempted: totalQ,
        accuracyRate: accuracy,
        totalStudyHours: hours,
        readinessScore: readiness
      }
    };
    setUser(updatedUser);
    localStorage.setItem(USER_SESSION_CACHE_KEY, JSON.stringify(updatedUser));
    await saveUserProfile(updatedUser);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        user,
        loading,
        isDemoMode: false,
        error,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        logout,
        resetPassword,
        completePasswordRecovery,
        recoveryMode,
        clearRecoveryMode,
        updatePreferences,
        updateStats,
        recordActivity,
        clearError
      }}
    >
      {children}
      {recoveryMode && (
        <PasswordResetGate
          error={error}
          onSubmit={completePasswordRecovery}
          onCancel={clearRecoveryMode}
        />
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
