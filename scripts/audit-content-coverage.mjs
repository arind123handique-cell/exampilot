/**
 * Content quality audit for the question bank.
 *
 * Two different questions live in this repo and it is worth keeping them apart:
 *   - "Does the paper's syllabus have anything behind it?"   → scripts/coverage-report.mjs
 *   - "Is the content that exists any good?"                 → this script
 *
 * Since every question now carries an authoritative `questionType`, this audit
 * reports the field as the number, then checks the *necessary* conditions a
 * NUMERICAL item must satisfy — it has to ask for a computed value and offer
 * four numeric options — and quotes any item that fails them.
 *
 * Only that direction is checked. The converse ("this text reads numerical but
 * is declared FORMULA_RECALL") is not decidable from the text: a recall item
 * asking for x_u,max/d legitimately has four numeric options. Treating that as
 * a defect would tune the check until it agreed with the field and told us
 * nothing, so this script deliberately does not do it.
 *
 * Usage: node scripts/audit-content-coverage.mjs
 */
const { CIVIL_ENGINEERING_QUESTIONS: CORE } = await import('../src/data/civilQuestions.ts');
const { NUMERICAL_CIVIL_QUESTIONS: NUMERICAL } = await import('../src/data/numericalQuestions.ts');
const { GENERAL_STUDIES_QUESTIONS: GS } = await import('../src/data/generalStudiesQuestions.ts');
const { TOPIC_KNOWLEDGE_MODULES } = await import('../src/data/topicKnowledge.ts');

const civil = [...CORE, ...NUMERICAL];
const modules = TOPIC_KNOWLEDGE_MODULES.filter((module) => module.category === 'civil');

/* ---- independent text heuristic, deliberately not reading questionType ---- */

/** Does the stem ask the candidate to produce a value? */
const ASKS_FOR_VALUE =
  /\b(calculate|compute|determine|evaluate|estimate|find|solve|how much|how many|how long|how fast|what will be|what would be|what is the .{0,30}(value|magnitude|amount|depth|area|force|radius|length|number|degree|reaction|period|stress|load|duty|scour|cant|result|answer))\b/i;

/** Options that are quantities — currency prefixes and Indian digit grouping included. */
const numericOptions = (question) =>
  (question.options ?? []).filter((option) => /^\s*(?:₹|rs\.?|inr)?\s*[-\d.(]/.test(option.text)).length;

/** Necessary conditions for a NUMERICAL item, judged from the text alone. */
const satisfiesNumericalShape = (question) =>
  ASKS_FOR_VALUE.test(question.stem ?? '') && numericOptions(question) === 4;

const group = (list, key) => {
  const map = new Map();
  for (const item of list) map.set(item[key], (map.get(item[key]) ?? 0) + 1);
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
};

const pad = (value, width) => String(value).padEnd(width);

/* ----------------------------------- question kinds, field vs text ------- */

console.log('==================== QUESTION BANK ====================');
console.log(`civil bank           : ${civil.length}  (${CORE.length} conceptual/recall + ${NUMERICAL.length} numerical)`);
console.log(`general studies bank : ${GS.length}`);
console.log(`combined             : ${civil.length + GS.length}`);

console.log('\n---- declared questionType (civil) ----');
for (const [kind, count] of group(civil, 'questionType')) {
  console.log(`  ${String(count).padStart(4)}  ${kind}`);
}

const declaredNumerical = civil.filter((q) => q.questionType === 'NUMERICAL');
const mislabelled = declaredNumerical.filter((q) => !satisfiesNumericalShape(q));

console.log('\n---- NUMERICAL items: shape check ----');
console.log('  rule: must ask for a computed value and offer four numeric options');
console.log(`  declared NUMERICAL   : ${declaredNumerical.length}`);
console.log(`  satisfy the rule     : ${declaredNumerical.length - mislabelled.length}/${declaredNumerical.length}`);
if (mislabelled.length) {
  console.log(`\n  ! ${mislabelled.length} item(s) declared NUMERICAL fail the shape rule:`);
  for (const question of mislabelled.slice(0, 8)) {
    console.log(`    ${question.id}: ${question.stem.slice(0, 110)}…`);
  }
}

/* ------------------------------------------------------------- depth ---- */

console.log('\n---- solution depth ----');
const withSteps = civil.filter((q) => (q.solutionSteps ?? []).length >= 2);
const withFormula = civil.filter((q) => q.formulaContext);
const withUnit = civil.filter((q) => q.answerUnit);
const withReference = civil.filter((q) => q.referenceSource);
console.log(`  multi-step solution : ${withSteps.length}/${civil.length}`);
console.log(`  formulaContext      : ${withFormula.length}/${civil.length}`);
console.log(`  answerUnit          : ${withUnit.length}/${civil.length}`);
console.log(`  referenceSource     : ${withReference.length}/${civil.length}`);
console.log(
  `  avg explanation     : ${Math.round(civil.reduce((sum, q) => sum + (q.explanation?.length ?? 0), 0) / civil.length)} chars`
);

console.log('\n---- difficulty mix ----');
for (const [level, count] of group(civil, 'difficulty')) {
  console.log(`  ${String(count).padStart(4)}  ${level}  (${Math.round((count / civil.length) * 100)}%)`);
}
const numericalHard = declaredNumerical.filter((q) => q.difficulty !== 'EASY').length;
console.log(`  numerical items not EASY: ${numericalHard}/${declaredNumerical.length}`);

/* ------------------------------------------------------- provenance ---- */

console.log('\n---- provenance (must never claim a verbatim PYQ) ----');
for (const [kind, count] of group(civil, 'sourceType')) {
  console.log(`  ${String(count).padStart(4)}  ${kind}`);
}
const claimedPyq = civil.filter((q) =>
  ['PYQ', 'PREVIOUS_YEAR', 'VERBATIM'].includes(String(q.sourceType ?? '').toUpperCase())
);
console.log(`  items claiming verbatim previous-year provenance: ${claimedPyq.length}`);
const years = civil.filter((q) => q.pyqYear).length;
console.log(`  items carrying a pyqYear field: ${years} (modelled-paper context only, not a verbatim claim)`);

/* -------------------------------------------------------- duplicates ---- */

const normalise = (stem) => stem.replace(/\s+/g, ' ').trim().toLowerCase().slice(0, 90);
const seen = new Map();
for (const question of civil) {
  const key = normalise(question.stem);
  if (seen.has(key)) {
    console.log(`\n  ! duplicate stem: ${seen.get(key)} and ${question.id}`);
  } else {
    seen.set(key, question.id);
  }
}

/* ------------------------------------------------------------- theory ---- */

console.log('\n==================== THEORY CONTENT ====================');
const steps = modules.reduce((sum, module) => sum + (module.steps?.length ?? 0), 0);
const examples = modules.reduce(
  (sum, module) => sum + (module.steps ?? []).filter((step) => step.benchmarkExample).length,
  0
);
const inline = modules.reduce((sum, module) => sum + (module.topicQuestions ?? []).length, 0);
const inlineNumerical = modules.reduce(
  (sum, module) => sum + (module.topicQuestions ?? []).filter((q) => satisfiesNumericalShape(q)).length,
  0
);
console.log(`civil modules        : ${modules.length}`);
console.log(`theory steps         : ${steps}`);
console.log(`worked examples      : ${examples}`);
console.log(`inline questions     : ${inline} (${inlineNumerical} read as numerical)`);
console.log(`distinct subjects    : ${new Set(modules.map((module) => module.subject)).size}`);

console.log('\nFor syllabus-by-subject coverage against the exam blueprint, run:');
console.log('  node scripts/coverage-report.mjs --requests');
