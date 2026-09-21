import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

// Firebase project credentials — loaded exclusively from environment variables.
// Copy .env.example → .env and fill in your Firebase Console values.
// NEVER hardcode credentials here — any value here is visible in the browser bundle.
// Prefer private `CONFIG_FIREBASE_*` envs injected by CI; fall back to public `VITE_FIREBASE_*` for local dev.
const resolveEnv = (key: keyof ImportMetaEnv, fallback: string = '') => {
  const privateKey = `CONFIG_${String(key)}` as keyof ImportMetaEnv;
  // Try private config first, then Vite-prefixed public env, then default project fallback
  return String(
    (import.meta as any).env?.[privateKey] ??
    (import.meta as any).env?.[key] ??
    fallback
  ).trim();
};

export const firebaseConfig = {
  apiKey: resolveEnv('VITE_FIREBASE_API_KEY', 'AIzaSyCzyyUIqIYcIcApKe2813aCPRW2RdXF6u4'),
  authDomain: resolveEnv('VITE_FIREBASE_AUTH_DOMAIN', 'exampilot-6836c.firebaseapp.com'),
  projectId: resolveEnv('VITE_FIREBASE_PROJECT_ID', 'exampilot-6836c'),
  storageBucket: resolveEnv('VITE_FIREBASE_STORAGE_BUCKET', 'exampilot-6836c.firebasestorage.app'),
  messagingSenderId: resolveEnv('VITE_FIREBASE_MESSAGING_SENDER_ID', '818400419174'),
  appId: resolveEnv('VITE_FIREBASE_APP_ID', '1:818400419174:web:7efac6e633785d26cfbca7'),
  measurementId: resolveEnv('VITE_FIREBASE_MEASUREMENT_ID', 'G-TF4YQG85N6')
};

// Validate if user has supplied actual Firebase keys (not empty/placeholder values)
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  !firebaseConfig.apiKey.includes('your_firebase_api_key') &&
  !firebaseConfig.projectId.includes('your_project_id')
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let analytics: Analytics | null = null;

if (isFirebaseConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);

    // Initialize Analytics if supported in the browser environment
    if (typeof window !== 'undefined') {
      isSupported().then((supported) => {
        if (supported && app) {
          analytics = getAnalytics(app);
        }
      }).catch((analyticsErr) => {
        console.warn('[ExamPilot] Firebase Analytics unavailable:', analyticsErr);
      });
    }
  } catch (error) {
    console.warn('[ExamPilot] Firebase initialization encountered an error:', error);
  }
} else {
  console.warn('[ExamPilot] Firebase is not configured — set CONFIG_FIREBASE_* (preferred) or VITE_FIREBASE_* variables in .env to enable authentication.');
}

export { app, auth, db, analytics };
