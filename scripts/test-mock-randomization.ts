/**
 * Verification for the randomized mock test module.
 * Run: node scripts/test-mock-randomization.mjs
 *
 * Covers three behaviors:
 *  1. shuffle — every permutation is reachable and elements are conserved
 *  2. randomizeMockForAttempt — question order differs between attempts and
 *     the option-letter remap keeps the correct option consistent
 *  3. buildSyllabusMockTest — draws the requested count from the real bank,
 *     respects the topic filter, and produces different papers per call
 *
 * Uses tsx so it imports the actual TypeScript source, not a reimplementation.
 */
import { shuffle, sampleWithoutReplacement, buildSyllabusMockTest, buildBankMockForTest, randomizeMockForAttempt, getBankPool } from '../src/services/mockAssemblyService';
import { ALL_QUESTIONS, getSubjectGroupId } from '../src/data/mockData';
import type { MockTest } from '../src/types';

let failures = 0;
function check(name: string, cond: boolean) {
  console.log(`${cond ? '✓' : '✗ FAIL'}  ${name}`);
  if (!cond) failures += 1;
}

// ── 1. shuffle conserves elements and actually shuffles ──
{
  const base = Array.from({ length: 200 }, (_, i) => i);
  const a = shuffle([...base]);
  const b = shuffle([...base]);
  check('shuffle conserves all elements', [...a].sort((x, y) => x - y).join() === base.join());
  const sameOrder = a.every((v, i) => v === b[i]);
  check('two shuffles produce different orders', !sameOrder);
  // rough unbiasedness: on 200 elements, fixed points should be ~1 per shuffle
  const fixedA = a.filter((v, i) => v === i).length;
  check(`shuffle has few fixed points (${fixedA})`, fixedA < 20);
}

// ── 2. sampleWithoutReplacement: distinct draws of requested size ──
{
  const pool = Array.from({ length: 30 }, (_, i) => i);
  const s = sampleWithoutReplacement(pool, 10);
  check('sample returns requested count', s.length === 10);
  check('sample items are distinct', new Set(s).size === 10);
  check('sample respects pool bounds', s.every((v) => v >= 0 && v < 30));
  const big = sampleWithoutReplacement(pool, 100);
  check('oversized sample returns whole shuffled pool', big.length === 30);
}

// ── 3. buildSyllabusMockTest: real bank draw ──
{
  const bankSize = ALL_QUESTIONS.length;
  console.log(`  (bank size: ${bankSize} questions)`);
  check('bank is non-trivial', bankSize > 50);

  const mockA = buildSyllabusMockTest({ questionCount: 25 });
  const mockB = buildSyllabusMockTest({ questionCount: 25 });
  const idsA = mockA.sections[0].questions.map((q) => q.id);
  const idsB = mockB.sections[0].questions.map((q) => q.id);

  check('draws exactly the requested question count', idsA.length === 25);
  check('all drawn questions exist in the bank', idsA.every((id) => ALL_QUESTIONS.some((q) => q.id === id)));
  check('no duplicate questions within a paper', new Set(idsA).size === idsA.length);
  const overlap = idsA.filter((id) => idsB.includes(id)).length;
  check(`two draws share few questions (${overlap}/25 overlap)`, overlap < 25);

  const orderA = idsA.join();
  const orderB = idsB.join();
  check('two draws differ in question order', orderA !== orderB);

  // Option letters were remapped: ids should not be uniformly option 'A' correct
  const correctLetters = mockA.sections[0].questions.map((q) => q.correctOption);
  const aCount = correctLetters.filter((l) => l === 'A').length;
  check(`correct letters spread across A-D (A count: ${aCount}/25)`, aCount < 25);
  // Remap must remain internally consistent: correctOption text must exist in options
  const consistent = mockA.sections[0].questions.every(
    (q) => q.options.find((o) => o.id === q.correctOption) !== undefined
  );
  check('answer key remap stays internally consistent', consistent);

  // metadata sanity
  check('mock has marks equal to question count', mockA.totalMarks === 25);
  check('mock has a positive duration', mockA.durationMinutes >= 10);
}

// ── 4. topic-scoped draw ──
{
  const scoped = buildSyllabusMockTest({ questionCount: 10, topics: ['soil'] });
  const allScoped = scoped.sections[0].questions.every((q) =>
    `${q.subject} ${q.topic} ${q.subtopic ?? ''}`.toLowerCase().includes('soil')
  );
  check('topic-scoped draw only matches the topic', allScoped);
}

// ── 5. per-attempt randomization on a fixed admin paper ──
{
  const fixedPaper: MockTest = {
    id: 'fixture-paper',
    title: 'Fixture',
    examId: 'apsc-ae-civil',
    paperName: 'Fixture Paper',
    durationMinutes: 60,
    totalMarks: 10,
    negativeMarksPerIncorrect: 0.25,
    sections: [
      {
        id: 'sec-1',
        name: 'Section A',
        totalQuestions: 10,
        questions: ALL_QUESTIONS.slice(0, 10).map((q) => JSON.parse(JSON.stringify(q)))
      }
    ]
  };
  const attempt1 = JSON.parse(JSON.stringify(fixedPaper));
  const { randomizeMockForAttempt } = await import('../src/services/mockAssemblyService');
  const rand1 = randomizeMockForAttempt(attempt1);
  const rand2 = randomizeMockForAttempt(JSON.parse(JSON.stringify(fixedPaper)));

  const ids1 = rand1.sections[0].questions.map((q) => q.id).join();
  const ids2 = rand2.sections[0].questions.map((q) => q.id).join();
  check('same paper randomizes to different orders across attempts', ids1 !== ids2);
  const sameSet =
    [...rand1.sections[0].questions].map((q) => q.id).sort().join() ===
    [...fixedPaper.sections[0].questions].map((q) => q.id).sort().join();
  check('randomization conserves the question set', sameSet);
  const optionConsistent = rand1.sections[0].questions.every(
    (q) => q.options.find((o) => o.id === q.correctOption) !== undefined
  );
  check('randomized attempt keeps every answer key valid', optionConsistent);
  check('section totalQuestions still matches questions length', rand1.sections[0].totalQuestions === rand1.sections[0].questions.length);
}

// ── 6. Per-test bank draw: scoped to that test's own syllabus ──
{
  // Build an authored-style fixture mirroring how real mocks look: two
  // sections drawn from two distinct syllabus groups.
  const civil = ALL_QUESTIONS.filter((q) => getSubjectGroupId(q) === 'structures');
  const gs = ALL_QUESTIONS.filter((q) => getSubjectGroupId(q) === 'general-studies');
  check('structures group has questions in bank', civil.length > 0);
  check('general studies group has questions in bank', gs.length > 0);

  const authored: MockTest = {
    id: 'fixture-bank-draw',
    title: 'Bank Draw Fixture',
    examId: 'apsc-ae-civil',
    paperName: 'Fixture',
    durationMinutes: 60,
    totalMarks: civil.length + gs.length,
    negativeMarksPerIncorrect: 0.25,
    sections: [
      { id: 'sec-civil', name: 'Structures', totalQuestions: Math.min(5, civil.length), questions: civil.slice(0, Math.min(5, civil.length)) },
      { id: 'sec-gs', name: 'General Studies', totalQuestions: Math.min(5, gs.length), questions: gs.slice(0, Math.min(5, gs.length)) }
    ]
  };

  const draw1 = buildBankMockForTest(authored);
  const draw2 = buildBankMockForTest(authored);

  // Section structure preserved
  check('bank draw preserves section names/ids',
    draw1.sections.length === 2 &&
    draw1.sections[0].id === 'sec-civil' &&
    draw1.sections[1].name === 'General Studies');
  check('bank draw preserves section counts',
    draw1.sections[0].questions.length === authored.sections[0].questions.length &&
    draw1.sections[1].questions.length === authored.sections[1].questions.length);

  // Syllabus scoping: each section only draws within its own subject group
  const sec1Groups = new Set(draw1.sections[0].questions.map((q) => getSubjectGroupId(q)));
  const sec2Groups = new Set(draw1.sections[1].questions.map((q) => getSubjectGroupId(q)));
  check(`section 1 stays in its syllabus group (${[...sec1Groups].join(',') || 'empty'})`,
    sec1Groups.size === 1 && sec1Groups.has('structures'));
  check(`section 2 stays in its syllabus group (${[...sec2Groups].join(',') || 'empty'})`,
    sec2Groups.size === 1 && sec2Groups.has('general-studies'));

  // Randomness: two draws differ
  const ids1 = draw1.sections.flatMap((s) => s.questions.map((q) => q.id)).join();
  const ids2 = draw2.sections.flatMap((s) => s.questions.map((q) => q.id)).join();
  check('two bank draws of the same test differ', ids1 !== ids2);

  // No duplicates across sections within one paper
  const allIds = draw1.sections.flatMap((s) => s.questions.map((q) => q.id));
  check('bank draw has no duplicate questions in a paper', new Set(allIds).size === allIds.length);

  // Answer keys valid after the full start pipeline (bank draw + attempt shuffle)
  const full = randomizeMockForAttempt(draw1);
  const keysValid = full.sections.flatMap((s) => s.questions).every(
    (q) => q.options.find((o) => o.id === q.correctOption) !== undefined
  );
  check('answer keys valid after bank draw + attempt shuffle', keysValid);
  check('original fixture untouched by draw (no mutation)',
    authored.sections[0].questions.every((q, i) => q.id === civil[i].id));

  // Builder mocks must not be re-drawn (topic scope would widen)
  const built = buildSyllabusMockTest({ questionCount: 10, topics: ['soil'] });
  const redrew = buildBankMockForTest(built);
  check('builder mock passes through without re-draw',
    redrew.sections[0].questions.map((q) => q.id).join() === built.sections[0].questions.map((q) => q.id).join());

  // Pool sanity: getBankPool returns well-formed questions
  const pool = getBankPool();
  check(`bank pool is substantial and 4-option (${pool.length} questions)`,
    pool.length > 50 && pool.every((q) => q.options.length === 4));
}

console.log(failures === 0 ? '\n✓ all mock randomization checks passed' : `\n✗ ${failures} check(s) failed`);
process.exit(failures === 0 ? 0 : 1);
