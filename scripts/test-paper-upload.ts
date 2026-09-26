/**
 * Paper-upload checks.
 *
 * Two guarantees the "My Papers" section rests on, asserted here rather than
 * left to a live Gemini round-trip:
 *   1. questions that already exist in the bank (or repeat inside one upload)
 *      are never added twice;
 *   2. an answer the model solved is never labelled as an official printed key.
 *
 * Run: npx tsx scripts/test-paper-upload.ts
 */
import { stemHash, normalizeStem, questionToRow, rowToQuestion } from '../src/services/supabaseQuestionService';
import { dedupeAgainstHashes } from '../src/services/studentPaperService';
import { deriveKeyProvenance } from '../src/services/pdfParserService';
import type { MCQQuestion } from '../src/types';

let failures = 0;
function check(name: string, condition: boolean) {
  if (condition) {
    console.log(`✓  ${name}`);
  } else {
    failures++;
    console.error(`✗  ${name}`);
  }
}

function makeQuestion(id: string, stem: string): MCQQuestion {
  return {
    id,
    questionNumber: 1,
    examId: 'test',
    subject: 'General Studies',
    topic: 'General',
    stem,
    options: [
      { id: 'A', text: 'one' },
      { id: 'B', text: 'two' },
      { id: 'C', text: 'three' },
      { id: 'D', text: 'four' }
    ],
    correctOption: 'A',
    explanation: 'because',
    difficulty: 'MEDIUM'
  };
}

// ── fingerprint behaviour ──────────────────────────────────────────────────
const base = 'Which one of the following statements is TRUE regarding soil permeability?';
check('normalisation strips case and punctuation', normalizeStem(base) === normalizeStem(base.toUpperCase() + '  '));
check('normalisation collapses whitespace', normalizeStem('a   b') === normalizeStem('a b'));
check('same stem yields the same hash', stemHash(base) === stemHash(base.toUpperCase()));
check('punctuation-only difference yields the same hash', stemHash(base) === stemHash(base.replace('?', '.')));
check('different stems yield different hashes', stemHash(base) !== stemHash('Which statement is FALSE?'));
check('hash is 16 hex characters', /^[0-9a-f]{16}$/.test(stemHash(base)));
check('empty stem yields no hash', stemHash('') === '' && stemHash('   ') === '');

// ── bank rows carry the fingerprint ────────────────────────────────────────
const row = questionToRow(makeQuestion('q1', base));
check('questionToRow writes stem_hash', row.stem_hash === stemHash(base));
check('questionToRow hash matches the dedupe key', row.stem_hash === stemHash(base.toLowerCase()));

// ── dedupe against a known bank ────────────────────────────────────────────
const known = new Set([stemHash(base)]);
const bankSplit = dedupeAgainstHashes(
  [makeQuestion('q1', base), makeQuestion('q2', 'An entirely unrelated question abouthydrology?')],
  known
);
check('question already in the bank is a duplicate', bankSplit.duplicates.length === 1);
check('duplicate is the known question', bankSplit.duplicates[0].question.id === 'q1');
check('unseen question is fresh', bankSplit.fresh.length === 1 && bankSplit.fresh[0].id === 'q2');

// ── repeats inside one upload ──────────────────────────────────────────────
const withinPaper = dedupeAgainstHashes(
  [
    makeQuestion('q1', base),
    makeQuestion('q2', base.toUpperCase()),
    makeQuestion('q3', base.replace('?', '')),
    makeQuestion('q4', 'A different question entirely?')
  ],
  new Set()
);
// q1/q2/q3 are the same question written three ways; q4 is a different one.
check('repeated questions in one upload collapse to one', withinPaper.fresh.length === 2);
check('both repeats are reported as duplicates', withinPaper.duplicates.length === 2);
check('the first occurrence is the one kept', withinPaper.fresh[0].id === 'q1');
check('the distinct question survives', withinPaper.fresh.some((q) => q.id === 'q4'));

// ── no accidental over-filtering ───────────────────────────────────────────
const distinct = dedupeAgainstHashes(
  [
    makeQuestion('q1', 'The Indus Waters Treaty was signed in 1960.'),
    makeQuestion('q2', 'The Indus Waters Treaty was signed in 1961.'),
    makeQuestion('q3', 'The Indus Waters Treaty expired in 1960.')
  ],
  new Set()
);
check('near-identical but distinct questions are all kept', distinct.fresh.length === 3);

// ── answer-key provenance ──────────────────────────────────────────────────
check('a reported printed key is official', (() => {
  const p = deriveKeyProvenance('printed', 'high', 'auto');
  return p.answerKeySource === 'PRINTED' && p.keyConfidence === 'HIGH';
})());
check('a model-solved key is never official', (() => {
  const p = deriveKeyProvenance('model_derived', 'high', 'auto');
  return p.answerKeySource === 'MODEL_DERIVED';
})());
check('the model outranks the caller declaration', (() => {
  // The admin flow declares 'printed', but if the model says it solved the
  // question, the honest label wins.
  const p = deriveKeyProvenance('model_derived', 'medium', 'printed');
  return p.answerKeySource === 'MODEL_DERIVED' && p.keyConfidence === 'MEDIUM';
})());
check('auto + no label is treated as model-derived', (() => {
  const p = deriveKeyProvenance(undefined, undefined, 'auto');
  return p.answerKeySource === 'MODEL_DERIVED' && p.keyConfidence === 'LOW';
})());
check('printed declaration + no label keeps admin behaviour', (() => {
  const p = deriveKeyProvenance(undefined, undefined, 'printed');
  return p.answerKeySource === 'PRINTED';
})());
check('unparseable confidence falls back to low', (() => {
  const p = deriveKeyProvenance('model_derived', 'banana', 'auto');
  return p.keyConfidence === 'LOW';
})());

// ── provenance reaches the database ────────────────────────────────────────
const printedRow = questionToRow({ ...makeQuestion('q1', base), sourceType: 'PYQ' });
check('a PYQ row records a printed key', printedRow.answer_key_source === 'PRINTED' && printedRow.key_confidence === 'HIGH');
const solvedRow = questionToRow({ ...makeQuestion('q2', base), sourceType: 'AI_GENERATED' });
check('an AI_GENERATED row records a model-derived key', solvedRow.answer_key_source === 'MODEL_DERIVED' && solvedRow.key_confidence === 'LOW');
const explicitRow = questionToRow({
  ...makeQuestion('q3', base),
  sourceType: 'AI_GENERATED',
  answerKeySource: 'MODEL_DERIVED',
  keyConfidence: 'MEDIUM'
});
check('explicit provenance is preserved', explicitRow.answer_key_source === 'MODEL_DERIVED' && explicitRow.key_confidence === 'MEDIUM');
check('provenance survives a round trip', (() => {
  const back = rowToQuestion({ ...printedRow, options: printedRow.options });
  return back.answerKeySource === 'PRINTED' && back.keyConfidence === 'HIGH';
})());
check('a row with no provenance is read as model-derived', (() => {
  const { answer_key_source, key_confidence, ...bare } = printedRow;
  return rowToQuestion(bare as any).answerKeySource === 'MODEL_DERIVED';
})());

if (failures > 0) {
  console.error(`\n✗ ${failures} paper-upload check(s) failed`);
  process.exit(1);
}
console.log('\n✓ all paper upload checks passed');
