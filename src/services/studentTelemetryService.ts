import { UserProfile, TestSubmission, MockTest } from '../types';
import { db, isFirebaseConfigured } from '../firebase/config';
import { collection, getDocs, doc, getDoc, query, orderBy, limit, deleteDoc } from 'firebase/firestore';
import { notifyDataSync } from './questionBankSyncService';

export interface StudentProfileSummary {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
  targetExam: string;
  targetYear: number;
  registeredDate: string;
  lastActiveDate: string;
  dailyHoursGoal: number;
  testsAttempted: number;
  totalScoreSum: number;
  maxScoreSum: number;
  averageAccuracy: number;
  latestScore: number;
  latestMaxScore: number;
  latestExamTitle: string;
  latestDate: string;
  readinessScore: number;
  subjectMastery: Record<string, number>;
  submissions: TestSubmission[];
}

/*
 * REMOVED DURING AUDIT (see docs/DEPLOYMENT.md and the audit notes).
 *
 * These four were hard-coded sample students with realistic names, emails and
 * scores. They were seeded into the Admin Studio roster, so an administrator
 * could not tell fabricated aspirants from real ones — and their "percentile",
 * "readiness" and "mastery" numbers were invented.
 *
 * The roster is now built only from real profiles (local session + Firestore).
 * The block is retained, commented, purely so the removal is visible in history;
 * it should be deleted once version control is in place.
 *
 * const BASELINE_STUDENTS: StudentProfileSummary[] = [
  {
    uid: 'std-assam-001',
    email: 'rahul.das@assam.gov.in',
    displayName: 'Rahul Das',
    targetExam: 'Assam DWR (Water Resources) Paper II',
    targetYear: 2026,
    registeredDate: '02 Jan 2026',
    lastActiveDate: '11 Jan 2026',
    dailyHoursGoal: 4,
    testsAttempted: 4,
    totalScoreSum: 312.5,
    maxScoreSum: 400,
    averageAccuracy: 82,
    latestScore: 84.75,
    latestMaxScore: 100,
    latestExamTitle: 'Assam DWR 2026 Paper II (Official Mock)',
    latestDate: '11 Jan 2026, 04:30 PM',
    readinessScore: 86,
    subjectMastery: {
      'Assam History & Heritage': 90,
      'Indian Polity & Constitution': 84,
      'Physical & Assam Geography': 82,
      'General English': 78,
      'Quantitative Aptitude': 80
    },
    submissions: [
      {
        id: 'sub-dwr-01',
        testId: 'mock-dwr-2026',
        userId: 'std-assam-001',
        submittedAt: '2026-01-11T16:30:00.000Z',
        timeSpentSeconds: 6240,
        totalScore: 84.75,
        maxScore: 100,
        accuracy: 88,
        percentile: 94,
        totalAttempted: 94,
        correctCount: 86,
        incorrectCount: 8,
        unattemptedCount: 6,
        answers: {}
      },
      {
        id: 'sub-dwr-02',
        testId: 'mock-gs-100',
        userId: 'std-assam-001',
        submittedAt: '2026-01-08T11:15:00.000Z',
        timeSpentSeconds: 5800,
        totalScore: 78.5,
        maxScore: 100,
        accuracy: 81,
        percentile: 89,
        totalAttempted: 90,
        correctCount: 80,
        incorrectCount: 10,
        unattemptedCount: 10,
        answers: {}
      }
    ]
  },
  {
    uid: 'std-apsc-002',
    email: 'priya.sarma@gmail.com',
    displayName: 'Priya Sarma',
    targetExam: 'APSC AE Civil Engineering',
    targetYear: 2026,
    registeredDate: '15 Dec 2025',
    lastActiveDate: '10 Jan 2026',
    dailyHoursGoal: 5,
    testsAttempted: 5,
    totalScoreSum: 742,
    maxScoreSum: 1000,
    averageAccuracy: 76,
    latestScore: 154,
    latestMaxScore: 200,
    latestExamTitle: 'APSC AE Civil Engineering (Advt 31/2025 Paper II)',
    latestDate: '10 Jan 2026, 06:10 PM',
    readinessScore: 78,
    subjectMastery: {
      'Structural Analysis & RCC': 85,
      'Soil Mechanics & Foundations': 78,
      'Fluid Mechanics & Hydraulics': 74,
      'Environmental Engineering': 80,
      'CPM & Construction Management': 82
    },
    submissions: [
      {
        id: 'sub-ce-01',
        testId: 'mock-civil-100',
        userId: 'std-apsc-002',
        submittedAt: '2026-01-10T18:10:00.000Z',
        timeSpentSeconds: 6800,
        totalScore: 154,
        maxScore: 200,
        accuracy: 79,
        percentile: 88,
        totalAttempted: 92,
        correctCount: 80,
        incorrectCount: 12,
        unattemptedCount: 8,
        answers: {}
      }
    ]
  },
  {
    uid: 'std-assam-003',
    email: 'bhaskar.bora@outlook.com',
    displayName: 'Bhaskar Bora',
    targetExam: 'Assam DWR (Water Resources) Paper II',
    targetYear: 2026,
    registeredDate: '05 Jan 2026',
    lastActiveDate: '09 Jan 2026',
    dailyHoursGoal: 3,
    testsAttempted: 3,
    totalScoreSum: 228.25,
    maxScoreSum: 300,
    averageAccuracy: 77,
    latestScore: 76.25,
    latestMaxScore: 100,
    latestExamTitle: 'Assam DWR 2026 Paper II (Official Mock)',
    latestDate: '09 Jan 2026, 02:45 PM',
    readinessScore: 74,
    subjectMastery: {
      'Assam History & Heritage': 82,
      'Indian Polity & Constitution': 76,
      'Physical & Assam Geography': 78,
      'General English': 70,
      'Quantitative Aptitude': 72
    },
    submissions: [
      {
        id: 'sub-dwr-03',
        testId: 'mock-dwr-2026',
        userId: 'std-assam-003',
        submittedAt: '2026-01-09T14:45:00.000Z',
        timeSpentSeconds: 6600,
        totalScore: 76.25,
        maxScore: 100,
        accuracy: 78,
        percentile: 82,
        totalAttempted: 88,
        correctCount: 78,
        incorrectCount: 10,
        unattemptedCount: 12,
        answers: {}
      }
    ]
  },
  {
    uid: 'std-ese-004',
    email: 'ananya.kashyap@nits.ac.in',
    displayName: 'Ananya Kashyap',
    targetExam: 'UPSC ESE / IES Civil',
    targetYear: 2026,
    registeredDate: '20 Nov 2025',
    lastActiveDate: '11 Jan 2026',
    dailyHoursGoal: 6,
    testsAttempted: 6,
    totalScoreSum: 932,
    maxScoreSum: 1200,
    averageAccuracy: 84,
    latestScore: 168,
    latestMaxScore: 200,
    latestExamTitle: 'UPSC ESE Civil Advanced Paper',
    latestDate: '11 Jan 2026, 08:20 PM',
    readinessScore: 91,
    subjectMastery: {
      'Structural Analysis & RCC': 92,
      'Soil Mechanics & Geotechnical': 88,
      'Hydrology & Water Resources': 90,
      'Transportation & Highways': 85,
      'Surveying & Geomatics': 86
    },
    submissions: [
      {
        id: 'sub-ese-01',
        testId: 'mock-ies-civil',
        userId: 'std-ese-004',
        submittedAt: '2026-01-11T20:20:00.000Z',
        timeSpentSeconds: 7100,
        totalScore: 168,
        maxScore: 200,
        accuracy: 86,
        percentile: 96,
        totalAttempted: 95,
        correctCount: 86,
        incorrectCount: 9,
        unattemptedCount: 5,
        answers: {}
      }
    ]
  }
];
*/

/**
 * Fetch all registered students and their mock test score telemetry.
 *
 * Returns ONLY real data: the locally cached active session plus, when Firestore
 * is configured, the `users` collection. No fabricated aspirants.
 */
export async function getAllStudentProfilesWithScores(): Promise<StudentProfileSummary[]> {
  const mapByUid = new Map<string, StudentProfileSummary>();

  // 1. Load Local Storage Active Student Records
  try {
    const cachedUserRaw = localStorage.getItem('exampilot_active_user');
    if (cachedUserRaw) {
      const activeUser = JSON.parse(cachedUserRaw) as UserProfile;
      if (activeUser && activeUser.uid) {
        const studentRecordsRaw = localStorage.getItem(`exampilot_student_records_${activeUser.uid}`);
        const pastRecords = studentRecordsRaw ? JSON.parse(studentRecordsRaw) : [];

        const submissions: TestSubmission[] = pastRecords.map((r: any) => r.submission).filter(Boolean);
        const testsAttempted = pastRecords.length;
        const totalScoreSum = pastRecords.reduce((acc: number, r: any) => acc + (r.totalScore || 0), 0);
        const maxScoreSum = pastRecords.reduce((acc: number, r: any) => acc + (r.maxScore || 100), 0);
        const avgAccuracy = testsAttempted > 0
          ? Math.round(pastRecords.reduce((acc: number, r: any) => acc + (r.accuracy || 0), 0) / testsAttempted)
          : (activeUser.stats?.accuracyRate || 0);

        const latestRecord = pastRecords[0];

        // Derive subject mastery from the questions this student actually answered —
        // previously these numbers were invented with `Math.max(65, avgAccuracy)`, so
        // they said nothing about the candidate.
        const subjectTally: Record<string, { correct: number; attempted: number }> = {};
        pastRecords.forEach((r: any) => {
          const sub = r.submission;
          const mock = r.mock;
          if (!sub || !mock?.sections) return;
          mock.sections.forEach((sec: any) => {
            (sec.questions || []).forEach((q: any) => {
              const ans = sub.answers?.[q.id];
              if (!ans || !ans.selected) return;
              const key = q.subject || 'General';
              const entry = subjectTally[key] ?? { correct: 0, attempted: 0 };
              entry.attempted += 1;
              if (ans.isCorrect) entry.correct += 1;
              subjectTally[key] = entry;
            });
          });
        });
        const subjectMastery: Record<string, number> = {};
        Object.entries(subjectTally).forEach(([key, v]) => {
          subjectMastery[key] = v.attempted > 0 ? Math.round((v.correct / v.attempted) * 100) : 0;
        });

        const studentSummary: StudentProfileSummary = {
          uid: activeUser.uid,
          email: activeUser.email || `${activeUser.displayName?.toLowerCase().replace(/\s+/g, '') || 'student'}@exampilot.ai`,
          displayName: activeUser.displayName || 'Enrolled Student',
          photoURL: activeUser.photoURL,
          targetExam: activeUser.preferences?.examName || 'Assam DWR & APSC AE Civil',
          targetYear: activeUser.preferences?.targetYear || 2026,
          registeredDate: activeUser.createdAt
            ? new Date(activeUser.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'Recent',
          lastActiveDate: latestRecord ? latestRecord.date : 'Active Today',
          dailyHoursGoal: activeUser.preferences?.dailyHoursGoal || 4,
          testsAttempted,
          totalScoreSum,
          maxScoreSum,
          averageAccuracy: avgAccuracy,
          latestScore: latestRecord ? latestRecord.totalScore : 0,
          latestMaxScore: latestRecord ? latestRecord.maxScore : 100,
          latestExamTitle: latestRecord ? latestRecord.mockTitle : 'No exams submitted yet',
          latestDate: latestRecord ? latestRecord.date : 'Pending',
          readinessScore: activeUser.stats?.readinessScore || avgAccuracy,
          subjectMastery,
          submissions
        };

        mapByUid.set(activeUser.uid, studentSummary);
      }
    }
  } catch (err) {
    console.warn('[ExamPilot] Local student telemetry notice:', err);
  }

  // 2. Sync from Cloud Firestore if configured
  if (isFirebaseConfigured && db) {
    try {
      const usersSnap = await Promise.race([
        getDocs(collection(db, 'users')),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2500))
      ]);

      if (usersSnap && !usersSnap.empty) {
        usersSnap.docs.forEach((d) => {
          const u = d.data() as UserProfile;
          if (u && u.uid && !mapByUid.has(u.uid)) {
            mapByUid.set(u.uid, {
              uid: u.uid,
              email: u.email || 'student@exampilot.ai',
              displayName: u.displayName || 'Enrolled Aspirant',
              photoURL: u.photoURL,
              targetExam: u.preferences?.examName || 'APSC & State Exams',
              targetYear: u.preferences?.targetYear || 2026,
              registeredDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active',
              lastActiveDate: 'Recent',
              dailyHoursGoal: u.preferences?.dailyHoursGoal || 4,
              testsAttempted: 0,
              totalScoreSum: 0,
              maxScoreSum: 0,
              averageAccuracy: u.stats?.accuracyRate || 0,
              latestScore: 0,
              latestMaxScore: 100,
              latestExamTitle: 'Enrolled Aspirant',
              latestDate: 'Pending',
              readinessScore: u.stats?.readinessScore || 65,
              subjectMastery: {},
              submissions: []
            });
          }
        });
      }
    } catch (err) {
      console.warn('[ExamPilot] Firestore users telemetry query notice:', err);
    }
  }

  // Filter out any deleted students
  const deletedUids = getDeletedUserUids();
  return Array.from(mapByUid.values()).filter((s) => !deletedUids.has(s.uid));
}

const DELETED_USERS_STORAGE_KEY = 'exampilot_deleted_user_uids';

export function getDeletedUserUids(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_USERS_STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

/**
 * Permanently delete a student user, their test records, and scores
 */
export async function deleteStudentUser(uid: string): Promise<boolean> {
  try {
    // 1. Add to local deleted blacklist
    const deleted = getDeletedUserUids();
    deleted.add(uid);
    localStorage.setItem(DELETED_USERS_STORAGE_KEY, JSON.stringify(Array.from(deleted)));

    // 2. Remove local exam submissions for this user
    localStorage.removeItem(`exampilot_student_records_${uid}`);

    // 3. Clear active user cache if it was this user
    try {
      const cached = localStorage.getItem('exampilot_active_user');
      if (cached) {
        const u = JSON.parse(cached);
        if (u.uid === uid) {
          localStorage.removeItem('exampilot_active_user');
        }
      }
    } catch {}

    // 4. Delete from Cloud Firestore if configured
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'users', uid));
      } catch (err) {
        console.warn('[ExamPilot] Firestore user delete notice:', err);
      }
    }

    // 5. Notify all components and tabs
    notifyDataSync('users', { deletedUid: uid });
    return true;
  } catch (err) {
    console.error('Failed to delete student user:', err);
    return false;
  }
}

/**
 * Get detailed student dossier for profile inspection
 */
export async function getStudentDetailedDossier(userId: string): Promise<StudentProfileSummary | null> {
  const all = await getAllStudentProfilesWithScores();
  return all.find((s) => s.uid === userId) || null;
}
