import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import {
  UserProfile,
  StudyPlan,
  SyllabusTopic,
  MCQQuestion,
  TestSubmission,
  AiChatMessage,
  DailyGoal,
  MockTest
} from '../types';
import {
  INITIAL_SYLLABUS_TOPICS,
  ALL_QUESTIONS,
  INITIAL_DAILY_GOALS,
  INITIAL_MILESTONES
} from '../data/mockData';
import { getCombinedQuestions } from './aiKnowledgeStore';

// Local storage caching helpers for offline resiliency
const STORAGE_PREFIX = 'exampilot_';

function getLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.error('LocalStorage cache write error:', e);
  }
}

// ----------------------------------------------------
// 1. User Profile & Preferences (Stored in Firestore: users/{uid})
// ----------------------------------------------------
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const cached = getLocal<UserProfile | null>(`profile_${uid}`, null);
  if (isFirebaseConfigured && db) {
    try {
      const userRef = doc(db, 'users', uid);
      const snapshot = await Promise.race([
        getDoc(userRef),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Firestore read timeout')), 2500))
      ]);
      if (snapshot && snapshot.exists()) {
        const data = snapshot.data() as UserProfile;
        setLocal(`profile_${uid}`, data);
        return data;
      }
    } catch (err: any) {
      console.warn('[ExamPilot] Firestore getUserProfile notice (using local cache):', err.message || err);
    }
  }
  return cached;
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  setLocal(`profile_${profile.uid}`, profile);
  if (isFirebaseConfigured && db) {
    try {
      const userRef = doc(db, 'users', profile.uid);
      // Non-blocking sync with timeout so auth and UI transitions are instantaneous (0ms)
      Promise.race([
        setDoc(userRef, profile, { merge: true }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore write timeout')), 2500))
      ]).catch((err) => {
        console.warn('[ExamPilot] Firestore saveUserProfile sync notice:', err.message || err);
      });
    } catch (err) {
      console.warn('[ExamPilot] Firestore saveUserProfile error:', err);
    }
  }
}

// ----------------------------------------------------
// 2. Syllabus Module Progress (Stored in Firestore: syllabus_progress/{userId})
// ----------------------------------------------------
export interface UserSyllabusProgress {
  completedModules: Record<string, boolean>;
  bookmarkedModules: Record<string, boolean>;
  lastUpdated: string;
}

export async function getUserSyllabusProgress(userId: string): Promise<{
  completedModules: Record<string, boolean>;
  bookmarkedModules: Record<string, boolean>;
}> {
  const localKey = `syllabus_progress_${userId}`;
  const cached = getLocal<UserSyllabusProgress | null>(localKey, null);

  if (isFirebaseConfigured && db) {
    try {
      const progressRef = doc(db, 'syllabus_progress', userId);
      const snapshot = await getDoc(progressRef);
      if (snapshot.exists()) {
        const data = snapshot.data() as UserSyllabusProgress;
        setLocal(localKey, data);
        return {
          completedModules: data.completedModules || {},
          bookmarkedModules: data.bookmarkedModules || {}
        };
      }
    } catch (err) {
      console.warn('Firestore getUserSyllabusProgress error, reading cache:', err);
    }
  }

  if (cached) {
    return {
      completedModules: cached.completedModules || {},
      bookmarkedModules: cached.bookmarkedModules || {}
    };
  }

  // Baseline default for newly enrolled students
  return {
    completedModules: { 'civil-som': true, 'gs-assam-geography': true, 'gs-polity': true },
    bookmarkedModules: {}
  };
}

export async function saveUserSyllabusProgress(
  userId: string,
  completedModules: Record<string, boolean>,
  bookmarkedModules: Record<string, boolean>
): Promise<void> {
  const progress: UserSyllabusProgress = {
    completedModules,
    bookmarkedModules,
    lastUpdated: new Date().toISOString()
  };

  setLocal(`syllabus_progress_${userId}`, progress);

  if (isFirebaseConfigured && db) {
    try {
      const progressRef = doc(db, 'syllabus_progress', userId);
      await setDoc(progressRef, progress, { merge: true });
    } catch (err) {
      console.warn('Firestore saveUserSyllabusProgress error:', err);
    }
  }
}

// ----------------------------------------------------
// 3. MCQ Practice State (Stored in Firestore: practice_states/{userId})
// ----------------------------------------------------
export interface UserPracticeState {
  userAnswers: Record<string, 'A' | 'B' | 'C' | 'D'>;
  flaggedQuestions: Record<string, boolean>;
  lastUpdated: string;
}

export async function getUserPracticeState(userId: string): Promise<{
  userAnswers: Record<string, 'A' | 'B' | 'C' | 'D'>;
  flaggedQuestions: Record<string, boolean>;
}> {
  const localKey = `practice_state_${userId}`;
  const cached = getLocal<UserPracticeState | null>(localKey, null);

  if (isFirebaseConfigured && db) {
    try {
      const practiceRef = doc(db, 'practice_states', userId);
      const snapshot = await getDoc(practiceRef);
      if (snapshot.exists()) {
        const data = snapshot.data() as UserPracticeState;
        setLocal(localKey, data);
        return {
          userAnswers: data.userAnswers || {},
          flaggedQuestions: data.flaggedQuestions || {}
        };
      }
    } catch (err) {
      console.warn('Firestore getUserPracticeState error, reading cache:', err);
    }
  }

  return {
    userAnswers: cached?.userAnswers || {},
    flaggedQuestions: cached?.flaggedQuestions || {}
  };
}

export async function saveUserPracticeState(
  userId: string,
  userAnswers: Record<string, 'A' | 'B' | 'C' | 'D'>,
  flaggedQuestions: Record<string, boolean>
): Promise<void> {
  const state: UserPracticeState = {
    userAnswers,
    flaggedQuestions,
    lastUpdated: new Date().toISOString()
  };

  setLocal(`practice_state_${userId}`, state);

  if (isFirebaseConfigured && db) {
    try {
      const practiceRef = doc(db, 'practice_states', userId);
      await setDoc(practiceRef, state, { merge: true });
    } catch (err) {
      console.warn('Firestore saveUserPracticeState error:', err);
    }
  }
}

// ----------------------------------------------------
// 4. Custom Mock Tests (Stored in Firestore: custom_mock_tests/{testId})
// ----------------------------------------------------
export async function saveCustomMockTest(userId: string, test: MockTest): Promise<void> {
  setLocal(`custom_mock_test_${userId}`, test);

  if (isFirebaseConfigured && db) {
    try {
      const testRef = doc(db, 'custom_mock_tests', test.id);
      await setDoc(testRef, {
        ...test,
        createdByUserId: userId,
        createdAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore saveCustomMockTest error:', err);
    }
  }
}

export async function getCustomMockTests(userId: string): Promise<MockTest[]> {
  const localKey = `custom_mock_test_${userId}`;
  const cached = getLocal<MockTest | null>(localKey, null);

  if (isFirebaseConfigured && db) {
    try {
      const q = query(
        collection(db, 'custom_mock_tests'),
        where('createdByUserId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(d => d.data() as MockTest);
      }
    } catch (err) {
      console.warn('Firestore getCustomMockTests error, reading cache:', err);
    }
  }

  return cached ? [cached] : [];
}

// ----------------------------------------------------
// 5. Syllabus Explorer Topics
// ----------------------------------------------------
export async function getSyllabusTopics(examId: string): Promise<SyllabusTopic[]> {
  const localKey = `syllabus_${examId}`;
  const cached = getLocal<SyllabusTopic[] | null>(localKey, null);

  if (isFirebaseConfigured && db) {
    try {
      const syllabusRef = collection(db, 'syllabus', examId, 'topics');
      const snapshot = await getDocs(syllabusRef);
      if (!snapshot.empty) {
        const topics = snapshot.docs.map(d => d.data() as SyllabusTopic);
        setLocal(localKey, topics);
        return topics;
      }
    } catch (err) {
      console.warn('Firestore getSyllabusTopics error:', err);
    }
  }

  if (cached && cached.length > 0) return cached;
  setLocal(localKey, INITIAL_SYLLABUS_TOPICS);
  return INITIAL_SYLLABUS_TOPICS;
}

export async function toggleSubtopicCompletion(
  examId: string,
  topicId: string,
  subtopicId: string,
  completed: boolean
): Promise<SyllabusTopic[]> {
  const topics = await getSyllabusTopics(examId);
  const updated = topics.map(topic => {
    if (topic.id !== topicId) return topic;
    const updatedSubs = topic.subtopics.map(sub => {
      if (sub.id !== subtopicId) return sub;
      return { ...sub, completed, masteryLevel: completed ? Math.min(100, sub.masteryLevel + 15) : Math.max(20, sub.masteryLevel - 15) };
    });
    const completedCount = updatedSubs.filter(s => s.completed).length;
    return {
      ...topic,
      completedSubtopics: completedCount,
      subtopics: updatedSubs
    };
  });

  setLocal(`syllabus_${examId}`, updated);

  if (isFirebaseConfigured && db) {
    try {
      const target = updated.find(t => t.id === topicId);
      if (target) {
        await setDoc(doc(db, 'syllabus', examId, 'topics', topicId), target, { merge: true });
      }
    } catch (err) {
      console.warn('Firestore toggleSubtopicCompletion error:', err);
    }
  }

  return updated;
}

// ----------------------------------------------------
// 6. Study Plan & Daily Goals (Stored in Firestore: study_plans/{userId})
// ----------------------------------------------------
export async function getStudyPlan(userId: string, examId: string): Promise<StudyPlan> {
  const localKey = `study_plan_${userId}`;
  const cached = getLocal<StudyPlan | null>(localKey, null);

  if (isFirebaseConfigured && db) {
    try {
      const planRef = doc(db, 'study_plans', userId);
      const snapshot = await getDoc(planRef);
      if (snapshot.exists()) {
        const data = snapshot.data() as StudyPlan;
        setLocal(localKey, data);
        return data;
      }
    } catch (err) {
      console.warn('Firestore getStudyPlan error:', err);
    }
  }

  if (cached) return cached;

  const defaultPlan: StudyPlan = {
    userId,
    examId,
    weeklyTargetHours: 28,
    dailyGoals: INITIAL_DAILY_GOALS,
    milestones: INITIAL_MILESTONES,
    generatedAt: new Date().toISOString()
  };
  setLocal(localKey, defaultPlan);
  return defaultPlan;
}

export async function updateDailyGoal(
  userId: string,
  goalId: string,
  status: DailyGoal['status'],
  examId: string = 'apsc-ae-civil'
): Promise<DailyGoal[]> {
  const plan = await getStudyPlan(userId, examId);
  const updatedGoals = plan.dailyGoals.map(g => (g.id === goalId ? { ...g, status } : g));
  const updatedPlan = { ...plan, dailyGoals: updatedGoals };

  setLocal(`study_plan_${userId}`, updatedPlan);

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'study_plans', userId), updatedPlan, { merge: true });
    } catch (err) {
      console.warn('Firestore updateDailyGoal error:', err);
    }
  }

  return updatedGoals;
}

// ----------------------------------------------------
// 7. Practice Attempts Telemetry (Stored in Firestore: practice_attempts/{id})
// ----------------------------------------------------
export interface PracticeAttempt {
  id: string;
  userId: string;
  questionId: string;
  subject: string;
  topic: string;
  selectedOption: 'A' | 'B' | 'C' | 'D';
  correctOption: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
  timeSeconds: number;
  timestamp: string;
}

export async function recordPracticeAttempt(attempt: PracticeAttempt): Promise<void> {
  const localKey = `practice_attempts_${attempt.userId}`;
  const existing = getLocal<PracticeAttempt[]>(localKey, []);
  const updated = [attempt, ...existing.filter(a => a.questionId !== attempt.questionId)].slice(0, 500);
  setLocal(localKey, updated);

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'practice_attempts', attempt.id), attempt);
    } catch (err) {
      console.warn('Firestore recordPracticeAttempt error:', err);
    }
  }
}

export async function getPracticeAttempts(userId: string): Promise<PracticeAttempt[]> {
  const localKey = `practice_attempts_${userId}`;
  const cached = getLocal<PracticeAttempt[]>(localKey, []);

  if (isFirebaseConfigured && db) {
    try {
      const q = query(
        collection(db, 'practice_attempts'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(100)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(d => d.data() as PracticeAttempt);
      }
    } catch (err) {
      console.warn('Firestore getPracticeAttempts error:', err);
    }
  }

  return cached;
}

// ----------------------------------------------------
// 8. MCQ Questions & Practice (Stored in Firestore: questions/{id})
// ----------------------------------------------------
export async function getQuestions(
  paper: 'civil' | 'gs' | 'all' = 'civil',
  topicId?: string
): Promise<MCQQuestion[]> {
  const combinedFallback = getCombinedQuestions(paper);

  if (isFirebaseConfigured && db) {
    try {
      const qRef = collection(db, 'questions');
      const examTarget = paper === 'gs' ? 'upsc-cse' : 'apsc-ae-civil';
      const qConstraint = topicId
        ? query(qRef, where('topic', '==', topicId), limit(100))
        : paper !== 'all'
        ? query(qRef, where('examId', '==', examTarget), limit(100))
        : query(qRef, limit(200));

      const snapshot = await getDocs(qConstraint);
      if (!snapshot.empty) {
        const firestoreQuestions = snapshot.docs.map(d => d.data() as MCQQuestion);
        const firestoreIds = new Set(firestoreQuestions.map(q => q.id));
        const merged = [
          ...firestoreQuestions,
          ...combinedFallback.filter(q => !firestoreIds.has(q.id))
        ];
        return topicId
          ? merged.filter(q => q.topic.toLowerCase().includes(topicId.toLowerCase()))
          : merged;
      }
    } catch (err) {
      console.warn('Firestore getQuestions error:', err);
    }
  }

  if (topicId) {
    return combinedFallback.filter(q => q.topic.toLowerCase().includes(topicId.toLowerCase()));
  }
  return combinedFallback;
}

/**
 * Seed all questions into Cloud Firestore
 */
export async function seedFirestoreQuestions(): Promise<{ success: boolean; count: number }> {
  if (!isFirebaseConfigured || !db) {
    return { success: false, count: 0 };
  }

  let count = 0;
  for (const q of ALL_QUESTIONS) {
    try {
      await setDoc(doc(db, 'questions', q.id), q);
      count++;
    } catch (err) {
      console.warn(`Failed to seed question ${q.id}:`, err);
    }
  }
  return { success: true, count };
}

// ----------------------------------------------------
// 9. Mock Test Submissions (Stored in Firestore: test_submissions/{id})
// ----------------------------------------------------
export async function submitMockTest(submission: TestSubmission): Promise<void> {
  const localKey = `submissions_${submission.userId}`;
  const existing = getLocal<TestSubmission[]>(localKey, []);
  const updated = [submission, ...existing];
  setLocal(localKey, updated);

  // The cloud write is best-effort and deliberately NOT awaited.
  //
  // Firestore's write promise settles on server acknowledgement, so when the
  // backend is unreachable the await can stay pending for a long time. It used to
  // sit on the exam-submit critical path, which meant a student who finished a
  // paper was left staring at the exam screen instead of getting their score.
  // The local write above is the source of truth for the UI; Firestore catches up
  // on its own or times out harmlessly.
  if (isFirebaseConfigured && db) {
    void Promise.race([
      setDoc(doc(db, 'test_submissions', submission.id), submission),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Firestore submission write timeout')), 4000)
      )
    ]).catch((err) => {
      console.warn('[ExamPilot] submitMockTest cloud sync notice:', err?.message || err);
    });
  }
}

export async function getTestSubmissions(userId: string): Promise<TestSubmission[]> {
  const localKey = `submissions_${userId}`;
  const cached = getLocal<TestSubmission[]>(localKey, []);

  if (isFirebaseConfigured && db) {
    try {
      const q = query(
        collection(db, 'test_submissions'),
        where('userId', '==', userId),
        orderBy('submittedAt', 'desc'),
        limit(20)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(d => d.data() as TestSubmission);
      }
    } catch (err) {
      console.warn('Firestore getTestSubmissions error:', err);
    }
  }

  return cached;
}

// ----------------------------------------------------
// 10. AI Tutor Chat (Stored in Firestore: ai_chats/{userId}/messages/{id})
// ----------------------------------------------------
export async function getAiChatHistory(userId: string): Promise<AiChatMessage[]> {
  const localKey = `ai_chat_${userId}`;
  const defaultHistory: AiChatMessage[] = [
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Welcome! I am your ExamPilot Syllabus-Aware AI Tutor. I am calibrated to the **APSC AE Civil Engineering (Advt 31/2025)** syllabus and IS Codes (IS 456:2000, IS 800:2007). Ask me to break down derivations, clarify doubts, or run a high-yield diagnostic quiz.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      citations: ['APSC AE Official Syllabus', 'IS 456:2000 Cl. 38.1']
    }
  ];

  if (isFirebaseConfigured && db) {
    try {
      const chatRef = collection(db, 'ai_chats', userId, 'messages');
      const q = query(chatRef, orderBy('timestamp', 'asc'), limit(50));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const msgs = snapshot.docs.map(d => d.data() as AiChatMessage);
        setLocal(localKey, msgs);
        return msgs;
      }
    } catch (err) {
      console.warn('Firestore getAiChatHistory error, reading cache:', err);
    }
  }

  return getLocal<AiChatMessage[]>(localKey, defaultHistory);
}

export async function saveAiChatMessage(userId: string, message: AiChatMessage): Promise<AiChatMessage[]> {
  const localKey = `ai_chat_${userId}`;
  const history = await getAiChatHistory(userId);
  const updated = [...history, message];
  setLocal(localKey, updated);

  if (isFirebaseConfigured && db) {
    try {
      const msgRef = doc(db, 'ai_chats', userId, 'messages', message.id);
      await setDoc(msgRef, message);
    } catch (err) {
      console.warn('Firestore saveAiChatMessage error:', err);
    }
  }

  return updated;
}
