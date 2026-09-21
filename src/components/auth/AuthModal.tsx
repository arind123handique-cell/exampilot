import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { isFirebaseConfigured } from '../../firebase/config';
import { X, Mail, Lock, User, AlertCircle, Sparkles, CheckCircle2, KeyRound, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useToast } from '../../context/ToastContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin'
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    resetPassword,
    error,
    clearError
  } = useAuth();
  const focusTrapRef = useFocusTrap(isOpen);
  const { success: toastSuccess } = useToast();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
        toastSuccess('Welcome back!', 'Signed in successfully.');
        onClose();
      } else if (mode === 'signup') {
        await signUpWithEmail(email, password, name);
        toastSuccess('Account Created!', 'Welcome to ExamPilot.');
        onClose();
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setSuccessMsg('Password reset email sent! Check your inbox.');
      }
    } catch (err) {
      // error is handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    clearError();
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
      toastSuccess('Signed in with Google', 'Welcome to ExamPilot.');
      onClose();
    } catch (err) {
      // handled
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={focusTrapRef}
        role="dialog"
        aria-modal="true"
        aria-label={mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Reset password'}
        className="bg-card rounded-2xl shadow-2xl border border-line w-full max-w-md overflow-hidden relative"
      >
        {/* Top Header */}
        <div className="p-6 pb-4 border-b border-line flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-primary/25">
              EP
            </div>
            <div>
              <h3 className="font-display font-semibold text-ink text-base">
                {mode === 'signin' && 'Sign in to ExamPilot'}
                {mode === 'signup' && 'Create Aspirant Account'}
                {mode === 'forgot' && 'Reset Password'}
              </h3>
              <p className="text-xs text-muted">
                {mode === 'signin' && 'Access syllabus tracking & test analytics'}
                {mode === 'signup' && 'Personalized study plan & AI tutor access'}
                {mode === 'forgot' && 'Enter your email to receive recovery instructions'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-lg text-muted-faint hover:text-ink-soft hover:bg-subtle-strong transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Firebase Config Notice */}
        <div className="px-6 py-2.5 bg-subtle border-b border-line flex items-center justify-between text-xs">
          <span className="text-ink-soft flex items-center gap-1.5 font-medium">
            <KeyRound className="w-3.5 h-3.5 text-primary" />
            Backend Connection:
          </span>
          {isFirebaseConfigured ? (
            <span className="px-2 py-0.5 rounded-full bg-success-surface text-success-text font-medium text-[11px] flex items-center gap-1 border border-success-border">
              <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
              Live Firebase Connected
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-subtle text-muted font-medium text-[11px] flex items-center gap-1 border border-line">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-faint"></span>
              Local Cache Mode
            </span>
          )}
        </div>

        {/* Mode Switcher Tabs */}
        {mode !== 'forgot' && (
          <div className="flex border-b border-line bg-subtle/30 px-6 pt-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                clearError();
              }}
              className={`flex-1 py-2.5 text-center border-b-2 transition ${
                mode === 'signin'
                  ? 'border-primary text-primary font-bold bg-card shadow-2xs rounded-t-lg'
                  : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                clearError();
              }}
              className={`flex-1 py-2.5 text-center border-b-2 transition ${
                mode === 'signup'
                  ? 'border-primary text-primary font-bold bg-card shadow-2xs rounded-t-lg'
                  : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              Create Free Account
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-danger-surface border border-danger-border text-danger-text text-xs space-y-2.5">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed font-medium">{error}</span>
              </div>
              {error.includes('Incorrect email or password') && (
                <div className="pt-1 flex items-center justify-between gap-2 border-t border-danger-border/50">
                  <span className="text-[11px] text-muted">New aspirant without an account?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      clearError();
                    }}
                    className="text-[11px] font-bold text-primary hover:underline"
                  >
                    Click to Create Account ↗
                  </button>
                </div>
              )}
              {(error.includes('Firebase Authentication is not activated') || error.includes('Firebase Console')) && (
                <div className="pt-1 flex flex-wrap items-center gap-2 border-t border-danger-border/50">
                  <a
                    href="https://console.firebase.google.com/project/exampilot-6836c/authentication"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg bg-danger-text/10 px-2.5 py-1 text-[11px] font-bold text-danger-text hover:bg-danger-text/20 transition underline"
                  >
                    <span>Firebase Console</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg bg-success-surface border border-success-border text-success-text text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Social / 1-Click Buttons */}
          <div className="space-y-2">
            <Button
              variant="secondary"
              fullWidth
              loading={isGoogleLoading}
              disabled={isSubmitting}
              onClick={handleGoogleAuth}
              className="justify-center gap-2.5 shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Continue with Google
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-line"></div>
            <span className="text-[11px] text-muted-faint uppercase font-medium">Or with email</span>
            <div className="flex-1 h-px bg-line"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-medium text-ink-soft mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-muted-faint absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full h-9 pl-9 pr-3 rounded-lg border border-line focus:border-primary focus:ring-2 focus:ring-primary/10 text-xs text-ink placeholder-muted-faint transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-medium text-ink-soft mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-faint absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aspirant@exampilot.ai"
                  className="w-full h-9 pl-9 pr-3 rounded-lg border border-line focus:border-primary focus:ring-2 focus:ring-primary/10 text-xs text-ink placeholder-muted-faint transition"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-medium text-ink-soft">Password</label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-primary hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted-faint absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-9 pl-9 pr-3 rounded-lg border border-line focus:border-primary focus:ring-2 focus:ring-primary/10 text-xs text-ink placeholder-muted-faint transition"
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={isSubmitting}
              disabled={isGoogleLoading}
              className="shadow-md shadow-primary/20"
            >
              {mode === 'signin' ? 'Sign In to Dashboard' : mode === 'signup' ? 'Create Free Account' : 'Send Recovery Link'}
            </Button>
          </form>

          {/* Bottom Switcher */}
          <div className="pt-2 text-center text-xs text-muted">
            {mode === 'signin' && (
              <p>
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    setMode('signup');
                    clearError();
                  }}
                  className="text-primary font-semibold hover:underline"
                >
                  Sign Up
                </button>
              </p>
            )}
            {mode === 'signup' && (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setMode('signin');
                    clearError();
                  }}
                  className="text-primary font-semibold hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
            {mode === 'forgot' && (
              <p>
                Remembered your password?{' '}
                <button
                  onClick={() => {
                    setMode('signin');
                    clearError();
                  }}
                  className="text-primary font-semibold hover:underline"
                >
                  Back to Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
