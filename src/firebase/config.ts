import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

// Firebase project credentials — loaded exclusively from environment variables.
// Copy .env.example → .env and fill in your Firebase Console values.
// NEVER hardcode credentials here — any value here is visible in the browser bundle.
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
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
  console.info('[ExamPilot] Running in Offline Local Mode — set VITE_FIREBASE_* variables in .env to enable cloud sync.');
}

export { app, auth, db, analytics };
