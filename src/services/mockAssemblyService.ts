/**
 * MOCK ASSEMBLY SERVICE
 *
 * Three responsibilities, all randomized:
 *
 * 1. Per-test bank draws (`buildBankMockForTest`): when the student starts an
 *    assigned paper, this service re-assembles the attempt by drawing questions
 *    AT RANDOM from the full question bank, scoped to the syllabus subject
 *    groups and topics that paper actually covers (derived from its own
 *    authored questions). Section names and sizes are preserved, so a
 *    "Geotechnical & Foundation" sub-head stays a geotechnical sub-head — it
 *    just gets a fresh selection each attempt. The authored questions are part
 *    of the pool, and sections can never steal another section's authored
 *    material, so every section always fills to its authored count.
 *
 * 2. Per-attempt randomization (`randomizeMockForAttempt`): shuffles question
 *    order within each section AND remaps each question's option letters so a
 *    bank key of "B" lands on a random letter. Answers, drafts and review are
 *    keyed by question id, so remapping is invisible downstream — but the UI's
 *    promise of "randomized options" is now actually kept.
 *
 * 3. Standalone builders (`buildSyllabusMockTest` / `buildTopicMockTest`):
 *    powers the Random Test Builder card: a fresh paper stratified across the
 *    canonical syllabus subject groups (`SUBJECT_GROUPS` in mockData.ts),
 *    optionally scoped to topic keywords.
 *
 * Randomness uses Math.random (not crypto): this is exam UX, not security, and
 * a Fisher–Yates shuffle is unbiased regardless.
 */
import { MockTest, MockSection, MCQQuestion, MCQOption } from '../types';
import {
  ALL_QUESTIONS,
  getQuestionsBySubjectGroup,
  getSubjectGroupId,
  SUBJECT_GROUPS
} from '../data/mockData';
import { getCombinedQuestions } from './aiKnowledgeStore';

/** Unbiased in-place Fisher–Yates shuffle. Returns the same array for chaining. */
export function shuffle<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = items[i];
    items[i] = items[j];
    items[j] = tmp;
  }
  return items;
}

/** Draws `count` distinct items without mutating the input pool. */
export function sampleWithoutReplacement<T>(items: T[], count: number): T[] {
  if (count >= items.length) return shuffle([...items]);
  return shuffle([...items]).slice(0, Math.max(0, count));
}

/**
 * The deduped pool every draw pulls from: static bank ∪ locally learned
 * AI-generated questions, restricted to well-formed 4-option MCQs.
 * `typeof window` guard keeps Node-side tooling (tests/CLI) from throwing on
 * localStorage — there simply are no learned questions outside the browser.
 */
export function getBankPool(): MCQQuestion[] {
  const learned = typeof window !== 'undefined' ? getCombinedQuestions('all') : [];
  const merged = [...learned, ...ALL_QUESTIONS];
  return [...new Map(merged.map((q) => [q.id, q])).values()].filter(
    (q) => Array.isArray(q.options) && q.options.length === 4
  );
}

const OPTION_IDS: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D'];

/** Remaps one question's options to random letters, keeping the key correct. */
function remapOptionLetters(q: MCQQuestion): MCQQuestion {
  const letters = shuffle([...OPTION_IDS]);
  const options: MCQOption[] = q.options.map((opt, i) => ({
    id: letters[i],
    text: opt.text
  }));
  const correctText = q.options.find((o) => o.id === q.correctOption)?.text;
  const correctOption =
    correctText !== undefined
      ? options.find((o) => o.text === correctText)?.id ?? q.correctOption
      : q.correctOption;

  return { ...q, options, correctOption };
}

/**
 * Randomizes one mock attempt: question order per section + option letters per
 * question. Each question is deep-cloned so the shared bank is never mutated.
 */
export function randomizeMockForAttempt(mock: MockTest): MockTest {
  const sections = mock.sections.map((sec) => {
    const ordered = shuffle([...sec.questions]).map((q) =>
      remapOptionLetters(JSON.parse(JSON.stringify(q)) as MCQQuestion)
    );

    // Section totals stay honest if a section has fewer questions than its
    // advertised count (e.g. an admin draft that was edited down).
    return {
      ...sec,
      totalQuestions: ordered.length,
      questions: ordered
    };
  });

  return { ...mock, sections };
}

// ---------------------------------------------------------------------------
// Per-test bank draw (scoping helpers)
// ---------------------------------------------------------------------------

interface Scope {
  groups: Set<string>;
  topics: Set<string>;
}

/** Strips a leading "6. " / "6) " numbering from authored subject strings. */
function stripNumberPrefix(s: string): string {
  return s.replace(/^\s*\d+[.)]\s*/, '');
}

/**
 * Topical keys from a section name, e.g.
 * "Module 6: Soil Mechanics (Q57-72)" → ["soil mechanics"],
 * "Unit II: History of India & History of Assam (Q13-27)"
 *   → ["history of india", "history of assam"].
 * Generic names ("General", "Misc") yield nothing — they would match
 * half the bank.
 */
function sectionNameKeys(name: string): string[] {
  const cleaned = name
    .replace(/\(Q[^)]*\)/gi, ' ')
    .replace(/^(module|unit|section|part|paper|block)\s*[\divxlc]+\s*[:\-–]\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
  if (cleaned.length < 4) return [];
  const stop = new Set(['general', 'mixed', 'misc', 'miscellaneous', 'objective', 'paper']);
  return cleaned
    .split(/[&/,;]/)
    .map((p) => p.trim())
    .filter((p) => p.length >= 4 && !stop.has(p));
}

/**
 * Collects the syllabus subject groups + topic/subtopic strings of a set,
 * enriched with the section name's topical keys. Groups are resolved with
 * strict mapping first, then a number-stripped subject retry so authored
 * strings like "6. Soil Mechanics" still land in `geotechnical` instead of
 * falling into the catch-all `other` bucket.
 */
function collectScope(questions: MCQQuestion[], sectionName?: string): Scope {
  const groups = new Set<string>();
  const topics = new Set<string>();
  for (const q of questions) {
    groups.add(getSubjectGroupId(q));
    const stripped = stripNumberPrefix(q.subject);
    if (stripped !== q.subject) {
      groups.add(getSubjectGroupId({ subject: stripped, topic: q.topic, subtopic: q.subtopic }));
    }
    const topic = q.topic.trim().toLowerCase();
    if (topic) topics.add(topic);
    const subtopic = (q.subtopic ?? '').trim().toLowerCase();
    if (subtopic) topics.add(subtopic);
  }
  if (sectionName) {
    for (const key of sectionNameKeys(sectionName)) topics.add(key);
  }
  return { groups, topics };
}

/**
 * One scope key against one bank question.
 *
 * Multi-word keys ("soil mechanics", "history of india") match as substrings
 * of subject+topic+subtopic — they are specific enough. Single-word keys
 * ("statics", "dynamics", "kinetics") only match a SUBJECT substring or an
 * exact topic/subtopic equality: as free substring topic matches they leak
 * questions from an unrelated syllabus ("statics" → fluid statics,
 * "kinetics" → bacterial kinetics in Environmental Engineering).
 */
function keyMatchesQuestion(key: string, q: MCQQuestion): boolean {
  const subject = (q.subject || '').toLowerCase();
  const topic = (q.topic || '').toLowerCase();
  const subtopic = (q.subtopic ?? '').toLowerCase();
  if (key.includes(' ')) {
    return `${subject} ${topic} ${subtopic}`.includes(key);
  }
  return subject.includes(key) || topic === key || subtopic === key;
}

function topicMatches(q: MCQQuestion, topics: Set<string>): boolean {
  if (topics.size === 0) return false;
  for (const t of topics) {
    if (keyMatchesQuestion(t, q)) return true;
  }
  return false;
}

/** Ranks topic-matching candidates first, then the rest — both shuffled. */
function preferTopicMatches(candidates: MCQQuestion[], topics: Set<string>): MCQQuestion[] {
  if (topics.size === 0) return shuffle(candidates);
  const matched: MCQQuestion[] = [];
  const rest: MCQQuestion[] = [];
  for (const q of candidates) (topicMatches(q, topics) ? matched : rest).push(q);
  return [...shuffle(matched), ...shuffle(rest)];
}

/**
 * Assembles one attempt's paper by drawing randomly from the question bank,
 * scoped to the syllabus footprint of the given (authored) mock test.
 *
 * Per section, priority tiers fill the authored count:
 *   1. Fresh bank questions in this section's subject groups that also match
 *      its topics (most precise: syllabus + topic).
 *   2. Fresh bank questions in this section's subject groups (syllabus-aligned).
 *   3. Fresh bank questions anywhere that match the section's topics — the
 *      section name contributes keys too ("Module 6: Soil Mechanics" →
 *      "soil mechanics"), so sections whose subject string falls into the
 *      catch-all `other` bucket (numbered subjects like "6. Soil Mechanics",
 *      generic subjects like "Civil Engineering") still draw topically
 *      correct questions instead of arbitrary `other` ones.
 *   4. The section's own authored questions — always in scope, so the count
 *      is reached even when the bank has no fresh topical match. Other
 *      sections never consume them (tiers 1–3 exclude ALL authored ids).
 *
 * Non-authored bank questions deliberately rank ABOVE authored ones: a
 * section's own questions trivially match its own topics, so topic-matching
 * alone would rank them first and every attempt would redraw the same paper.
 *
 * Never mutates the input mock; returned questions are fresh objects.
 */
export function buildBankMockForTest(mock: MockTest): MockTest {
  if (!mock.sections || mock.sections.length === 0) return mock;
  // Mocks the Random Test Builder already drew from the bank are scoped and
  // fresh — re-drawing them would silently widen a topic-scoped paper back to
  // its whole subject group.
  if (mock.id.startsWith('mock-random-')) return mock;

  const pool = getBankPool();
  const authoredIds = new Set(mock.sections.flatMap((s) => s.questions.map((q) => q.id)));
  const usedIds = new Set<string>();

  const sections: MockSection[] = mock.sections.map((sec) => {
    const secScope = collectScope(sec.questions, sec.name);
    const realGroups = new Set([...secScope.groups].filter((g) => g !== 'other'));
    const want = sec.questions.length;
    if (want === 0) return { ...sec, totalQuestions: 0, questions: [] };

    const picked: MCQQuestion[] = [];
    const take = (candidates: MCQQuestion[]) => {
      for (const q of candidates) {
        if (picked.length >= want) break;
        if (usedIds.has(q.id)) continue;
        picked.push(q);
        usedIds.add(q.id);
      }
    };

    const fresh = pool.filter((q) => !authoredIds.has(q.id) && !usedIds.has(q.id));
    const inRealGroup = fresh.filter((q) => realGroups.has(getSubjectGroupId(q)));
    const topical = fresh.filter((q) => topicMatches(q, secScope.topics));

    // Tier 1: syllabus + topic aligned.
    take(preferTopicMatches(inRealGroup.filter((q) => topicMatches(q, secScope.topics)), secScope.topics));

    // Tier 2: syllabus aligned.
    take(shuffle(inRealGroup));

    // Tier 3: topic aligned anywhere (covers `other`-bucket sections and
    // niche groups that ran out of fresh questions).
    take(shuffle(topical));

    // Tier 4: the section's own authored questions (guarantees the count even
    // for admin-only content that is not in the static bank).
    if (picked.length < want) {
      take(shuffle(sec.questions.filter((q) => !usedIds.has(q.id))));
    }

    return { ...sec, totalQuestions: picked.length, questions: picked };
  });

  return { ...mock, sections };
}

// ---------------------------------------------------------------------------
// Standalone random-test builders (Random Test Builder card)
// ---------------------------------------------------------------------------

/**
 * Generates a fresh mock test drawn randomly from the full question bank,
 * stratified across the canonical syllabus subject groups so a paper spans the
 * syllabus instead of clustering in whatever subject has the most questions.
 *
 * @param opts.title          Display title (defaults to "Random Practice Mock")
 * @param opts.paperName      Display paper name
 * @param opts.examId         Exam context ('apsc-ae-civil' | 'apsc-cce-gs' | ...)
 * @param opts.questionCount  Total questions to draw (default 50)
 * @param opts.topics         Optional syllabus topic filter (case-insensitive;
 *                            matched against subject + topic + subtopic). When
 *                            given, only matching questions are drawn.
 */
export function buildSyllabusMockTest(opts: {
  title?: string;
  paperName?: string;
  examId?: string;
  questionCount?: number;
  topics?: string[];
}): MockTest {
  const questionCount = Math.max(1, opts.questionCount ?? 50);
  const topicFilter = (opts.topics || [])
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  let pool = getBankPool();

  if (topicFilter.length) {
    const matches = (q: MCQQuestion) => {
      const haystack = `${q.subject} ${q.topic} ${q.subtopic ?? ''}`.toLowerCase();
      return topicFilter.some((needle) => haystack.includes(needle));
    };
    const filtered = pool.filter(matches);
    if (filtered.length) pool = filtered;
  }

  // Stratified draw: walk the canonical syllabus groups in order, taking a
  // proportional share from each, then top up at random from whatever is left.
  // This keeps papers syllabus-balanced even when one subject dominates the bank.
  const byGroup = new Map<string, MCQQuestion[]>();
  for (const group of SUBJECT_GROUPS) {
    const qs = getQuestionsBySubjectGroup(group.id, pool);
    if (qs.length) byGroup.set(group.id, qs);
  }

  const stratified: MCQQuestion[] = [];
  if (byGroup.size > 0) {
    const perGroup = Math.ceil(questionCount / byGroup.size);
    const used = new Set<string>();
    for (const [groupId, qs] of byGroup) {
      const take = sampleWithoutReplacement(qs, Math.min(perGroup, questionCount - stratified.length));
      take.forEach((q) => used.add(q.id));
      stratified.push(...take);
      if (stratified.length >= questionCount) break;
    }
    if (stratified.length < questionCount) {
      const remaining = pool.filter((q) => !used.has(q.id));
      stratified.push(...sampleWithoutReplacement(remaining, questionCount - stratified.length));
    }
  } else {
    stratified.push(...sampleWithoutReplacement(pool, questionCount));
  }

  // Preserve the stratified order: it *is* the attempt's question order, so no
  // second shuffle is needed (it would undo the spread across the syllabus).
  const questions = stratified.map((q, i) => remapOptionLetters({ ...q, questionNumber: i + 1 }));

  return {
    id: `mock-random-${Date.now()}`,
    title: opts.title || 'Random Syllabus Mock',
    examId: opts.examId || 'apsc-ae-civil',
    paperName: opts.paperName || 'Randomly assembled from the full question bank',
    durationMinutes: Math.max(10, Math.round(questions.length * 1.2)),
    totalMarks: questions.length,
    negativeMarksPerIncorrect: 0.25,
    sections: [
      {
        id: `sec-random-${Date.now()}`,
        name: 'Random Syllabus Draw',
        totalQuestions: questions.length,
        questions
      }
    ],
    isPublishedToStudents: true
  };
}

/**
 * Convenience wrapper: builds a random mock scoped to one syllabus topic
 * (e.g. "Limit State Design of RCC Members" or "soil-mechanics").
 */
export function buildTopicMockTest(topic: string, questionCount = 25, examId?: string): MockTest {
  const label = topic.trim() || 'Syllabus Topic';
  return buildSyllabusMockTest({
    title: `${label} — Random Topic Test`,
    paperName: `Randomly drawn from the full bank, scoped to ${label}`,
    examId,
    questionCount,
    topics: [topic]
  });
}
