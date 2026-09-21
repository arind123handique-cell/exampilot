import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  signInAnonymously
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
  signInAsGuest: (name?: string) => Promise<void>;
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

export const formatAuthError = (err: any): string => {
  const code = err?.code || '';
  const msg = err?.message || '';

  if (code === 'auth/configuration-not-found' || msg.includes('configuration-not-found') || msg.includes('CONFIGURATION_NOT_FOUND')) {
    return "Firebase Authentication is not activated for project 'exampilot-6836c'. In the Firebase Console, go to Build > Authentication, click 'Get Started', and enable Email/Password (or Anonymous). Alternatively, click 'Continue as Guest' below.";
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
  return msg || 'Authentication request failed. Please try again or continue in Guest mode.';
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize or restore session
  useEffect(() => {
    // Clean up any legacy demo keys
    try {
      localStorage.removeItem('exampilot_demo_user');
    } catch {
      // ignore
    }

    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        setFirebaseUser(fbUser);
        if (fbUser) {
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
                isAnonymous: fbUser.isAnonymous,
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
          // If no active auth user, check for cached session or create guest session
          const cached = localStorage.getItem(USER_SESSION_CACHE_KEY);
          if (cached) {
            try {
              setUser(JSON.parse(cached));
            } catch {
              setUser(null);
            }
          } else {
            // Attempt seamless anonymous session for cloud persistence
            let anonCred = null;
            if (auth) {
              try {
                anonCred = await signInAnonymously(auth);
              } catch (anonErr) {
                console.warn('[ExamPilot] Anonymous sign-in not enabled on Firebase project; creating standard local session:', anonErr);
              }
            }

            if (anonCred && anonCred.user) {
              const guestProfile: UserProfile = {
                uid: anonCred.user.uid,
                email: null,
                displayName: 'Civil Engineering Aspirant',
                photoURL: null,
                isAnonymous: true,
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
              await saveUserProfile(guestProfile);
              setUser(guestProfile);
              localStorage.setItem(USER_SESSION_CACHE_KEY, JSON.stringify(guestProfile));
            } else {
              const offlineProfile: UserProfile = {
                uid: 'user-' + Date.now().toString(36),
                email: null,
                displayName: 'Civil Engineering Aspirant',
                photoURL: null,
                isAnonymous: true,
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
              await saveUserProfile(offlineProfile);
              setUser(offlineProfile);
              localStorage.setItem(USER_SESSION_CACHE_KEY, JSON.stringify(offlineProfile));
            }
          }
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
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
    if (!auth) return;

    try {
      await timeoutPromise(signInWithEmailAndPassword(auth, email, pass), 8000, 'Sign in timed out. Please check network connection.');
    } catch (err: any) {
      const friendlyMsg = formatAuthError(err);
      setError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    setError(null);
    if (!auth) return;

    try {
      const cred = await timeoutPromise(createUserWithEmailAndPassword(auth, email, pass), 10000, 'Sign up timed out. Please check network connection.');
      if (cred.user && name) {
        try {
          await updateProfile(cred.user, { displayName: name });
        } catch {
          // ignore display name update error
        }
      }
      const newProfile: UserProfile = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: name || cred.user.displayName || 'Aspirant',
        photoURL: cred.user.photoURL || null,
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
    if (!auth) return;

    try {
      const provider = new GoogleAuthProvider();
      const result = await timeoutPromise(signInWithPopup(auth, provider), 45000, 'Google sign-in popup was closed or timed out.');
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

  const signInAsGuest = async (name: string = 'Aspirant') => {
    setError(null);
    if (auth) {
      try {
        const cred = await signInAnonymously(auth);
        if (cred.user) {
          if (name) {
            try {
              await updateProfile(cred.user, { displayName: name });
            } catch {
              // ignore
            }
          }
          const guestProfile: UserProfile = {
            uid: cred.user.uid,
            email: null,
            displayName: name,
            photoURL: null,
            isAnonymous: true,
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
          await saveUserProfile(guestProfile);
          setUser(guestProfile);
          localStorage.setItem(USER_SESSION_CACHE_KEY, JSON.stringify(guestProfile));
          return;
        }
      } catch (anonErr) {
        console.warn('Anonymous sign-in not available, using offline guest session:', anonErr);
      }
    }

    const offlineUser: UserProfile = {
      uid: 'user-' + Date.now().toString(36),
      email: null,
      displayName: name,
      photoURL: null,
      isAnonymous: true,
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
    await saveUserProfile(offlineUser);
    setUser(offlineUser);
    localStorage.setItem(USER_SESSION_CACHE_KEY, JSON.stringify(offlineUser));
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
    if (!isFirebaseConfigured || !auth) {
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
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
        signInAsGuest,
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
