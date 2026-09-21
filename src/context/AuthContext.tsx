import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  Auth,
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth, db, isFirebaseConfigured } from '../firebase/config';
import { UserProfile, UserPreferences } from '../types';
import { getUserProfile, saveUserProfile } from '../services/firestore';

interface AuthContextType {
  firebaseUser: User | null;
  user: UserProfile | null;
  loading: boolean;
  isDemoMode: boolean;
  error: string | null;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
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
 * Thrown by every cloud sign-in path when the build shipped without Firebase
 * configuration (e.g. VITE_FIREBASE_* not set on the host).
 *
 * This must be an ERROR, never a silent return. The earlier `if (!auth) return;`
 * resolved successfully, so the UI showed "Signed In with Google!" while nothing
 * had happened — which made a missing build-time env var look like a broken
 * Google login.
 */
export const FIREBASE_NOT_CONFIGURED_MESSAGE =
  'Cloud sign-in is unavailable on this deployment: the Firebase configuration is missing from the build. ' +
  'Vite inlines VITE_* variables at BUILD time, so set VITE_FIREBASE_API_KEY (plus AUTH_DOMAIN, PROJECT_ID, ' +
  'MESSAGING_SENDER_ID, APP_ID) in your hosting provider\u2019s environment settings and redeploy. ' +
  'See docs/DEPLOYMENT.md.';

function requireAuth(): Auth {
  if (!auth) {
    const err: any = new Error(FIREBASE_NOT_CONFIGURED_MESSAGE);
    err.code = 'exampilot/firebase-not-configured';
    throw err;
  }
  return auth;
}

export const formatAuthError = (err: any): string => {
  const code = err?.code || '';
  const msg = err?.message || '';

  if (code === 'exampilot/firebase-not-configured') {
    return FIREBASE_NOT_CONFIGURED_MESSAGE;
  }

  // The classic post-deploy failure: the domain is not on Firebase's allowlist.
  if (code === 'auth/unauthorized-domain') {
    const host = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
    return (
      `This domain (${host}) is not authorised for Firebase sign-in. In the Firebase Console open ` +
      `Authentication \u2192 Settings \u2192 Authorized domains, add "${host}", then retry.`
    );
  }

  if (code === 'auth/popup-blocked') {
    return 'Your browser blocked the sign-in popup. Allow popups for this site (or use email sign-in) and try again.';
  }

  if (code === 'auth/cancelled-popup-request') {
    return 'Another sign-in attempt was already in progress. Please try again.';
  }

  if (code === 'auth/configuration-not-found' || msg.includes('configuration-not-found') || msg.includes('CONFIGURATION_NOT_FOUND')) {
    return "Firebase Authentication is not activated for project 'exampilot-6836c'. In the Firebase Console, go to Build > Authentication, click 'Get Started', and enable Email/Password and Google sign-in.";
  }
  if (code === 'auth/operation-not-allowed' || msg.includes('operation-not-allowed')) {
    return "This sign-in method is currently disabled in your Firebase project. Go to Firebase Console > Authentication > Sign-in method and enable it.";
  }
  if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
    return "Incorrect email or password. Please verify your credentials or create a new account.";
  }
  if (code === 'auth/email-already-in-use') {
    return "An account with this email address already exists. Please sign in instead.";
  }
  if (code === 'auth/weak-password') {
    return "Password is too weak. Please use at least 6 characters.";
  }
  if (code === 'auth/popup-closed-by-user') {
    return "Sign-in popup was closed before completing.";
  }
  if (code === 'auth/network-request-failed') {
    return "Network connection issue. Please check your internet connection.";
  }
  return msg || 'Authentication request failed. Please check credentials and try again.';
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize or restore session
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

    if (isFirebaseConfigured && auth) {
      const authInstance = auth;
      const unsubscribe = onAuthStateChanged(authInstance, async (fbUser) => {
        setFirebaseUser(fbUser);
        if (fbUser) {
          // Reject anonymous sessions if any exist
          if (fbUser.isAnonymous) {
            try {
              await signOut(authInstance);
            } catch {
              // ignore
            }
            setUser(null);
            localStorage.removeItem(USER_SESSION_CACHE_KEY);
            setLoading(false);
            return;
          }

          try {
            const profile = await getUserProfile(fbUser.uid);
            if (profile) {
              setUser(profile);
              localStorage.setItem(USER_SESSION_CACHE_KEY, JSON.stringify(profile));
            } else {
              // Create authentic user profile document in Firestore
              const newProfile: UserProfile = {
                uid: fbUser.uid,
                email: fbUser.email,
                displayName: fbUser.displayName || 'Aspirant',
                photoURL: fbUser.photoURL || null,
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
              await saveUserProfile(newProfile);
              setUser(newProfile);
              localStorage.setItem(USER_SESSION_CACHE_KEY, JSON.stringify(newProfile));
            }
          } catch (err: any) {
            console.error('Error syncing profile with Cloud Firestore:', err);
            setError(err.message || 'Failed to fetch user profile');
          }
        } else {
          // If no active Firebase user, user must authenticate
          setUser(null);
          localStorage.removeItem(USER_SESSION_CACHE_KEY);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setUser(null);
      localStorage.removeItem(USER_SESSION_CACHE_KEY);
      setLoading(false);
    }
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
      const authInstance = requireAuth();
      await timeoutPromise(signInWithEmailAndPassword(authInstance, email, pass), 8000, 'Sign in timed out. Please check network connection.');
    } catch (err: any) {
      const friendlyMsg = formatAuthError(err);
      setError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    setError(null);
    try {
      const authInstance = requireAuth();
      const cred = await timeoutPromise(createUserWithEmailAndPassword(authInstance, email, pass), 10000, 'Sign up timed out. Please check network connection.');
      if (cred.user && name) {
        try { await updateProfile(cred.user, { displayName: name }); } catch { /* ignore */ }
      }
      const newProfile: UserProfile = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: name || cred.user.displayName || 'Aspirant',
        photoURL: cred.user.photoURL || null,
        isAnonymous: false,
        preferences: {
          examId: 'apsc-ae-civil',
          examName: 'APSC Assistant Engineer (Civil)',
          advtNumber: 'Advt 31/2025',
          targetYear: 2026,
          dailyHoursGoal: 4,
          currentStream: 'Civil Engineering',
          level: 'beginner',
          onboarded: false
        },
        stats: { ...BASELINE_USER_STATS },
        createdAt: new Date().toISOString()
      };
      await saveUserProfile(newProfile);
      setUser(newProfile);
      localStorage.setItem(USER_SESSION_CACHE_KEY, JSON.stringify(newProfile));
    } catch (err: any) {
      const friendlyMsg = formatAuthError(err);
      setError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  const signInWithGoogle = async () => {
    setError(null);
    try {
      const authInstance = requireAuth();
      const provider = new GoogleAuthProvider();
      const result = await timeoutPromise(signInWithPopup(authInstance, provider), 45000, 'Google sign-in popup was closed or timed out.');
      const profile = await getUserProfile(result.user.uid);
      if (profile) {
        setUser(profile);
        localStorage.setItem(USER_SESSION_CACHE_KEY, JSON.stringify(profile));
      } else {
        const newProfile: UserProfile = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName || 'Aspirant',
          photoURL: result.user.photoURL || null,
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
        await saveUserProfile(newProfile);
        setUser(newProfile);
        localStorage.setItem(USER_SESSION_CACHE_KEY, JSON.stringify(newProfile));
      }
    } catch (err: any) {
      const friendlyMsg = formatAuthError(err);
      setError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    setUser(null);
    setFirebaseUser(null);
    localStorage.removeItem(USER_SESSION_CACHE_KEY);
  };

  const resetPassword = async (email: string) => {
    setError(null);
    try {
      await sendPasswordResetEmail(requireAuth(), email);
    } catch (err: any) {
      const friendlyMsg = formatAuthError(err);
      setError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

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
        firebaseUser,
        user,
        loading,
        isDemoMode: false,
        error,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        logout,
        resetPassword,
        updatePreferences,
        updateStats,
        recordActivity,
        clearError
      }}
    >
      {children}
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
