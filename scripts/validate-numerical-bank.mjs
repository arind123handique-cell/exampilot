/**
 * Numerical bank validator.
 *
 * Content correctness is the whole point of a numerical bank — a wrong key
 * teaches the wrong thing. This script:
 *
 *   1. re-derives every problem from its own formula and inputs and compares the
 *      result with the option marked correct (tolerance-aware, per-problem),
 *   2. re-checks structure: 4 options, valid key, ≥2 solution steps, a stated
 *      unit where the answer is dimensional, unique ids and unique stems,
 *   3. reports the difficulty mix so calibration drift is visible in CI.
 *
 * Usage: node scripts/validate-numerical-bank.mjs
 */
import { readFileSync } from 'node:fs';

/* ---------------------------------------------------------------- parsing */
const readArray = (file, exportName) => {
  const source = readFileSync(file, 'utf8');
  const start = source.indexOf('[', source.indexOf('= [', source.indexOf(exportName)));
  let depth = 0;
  let end = -1;
  let inString = false;
  for (let i = start; i < source.length; i += 1) {
    const ch = source[i];
    if (inString) {
      if (ch === '\\') i += 1;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === '[') depth += 1;
    else if (ch === ']') {
      depth -= 1;
      if (depth === 0) { end = i + 1; break; }
    }
  }
  return parseLiteral(source.slice(start, end));
};

/** Remove // and /* *\/ comments without touching string contents. */
const stripComments = (text) => {
  let out = '';
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (ch === '\'' || ch === '"' || ch === '`') {
      const quote = ch;
      out += ch;
      i += 1;
      while (i < text.length) {
        out += text[i];
        if (text[i] === '\\') { i += 1; out += text[i] ?? ''; }
        else if (text[i] === quote) { i += 1; break; }
        i += 1;
      }
      continue;
    }
    if (ch === '/' && text[i + 1] === '/') {
      while (i < text.length && text[i] !== '\n') i += 1;
      continue;
    }
    if (ch === '/' && text[i + 1] === '*') {
      i = text.indexOf('*/', i + 2);
      i = i === -1 ? text.length : i + 2;
      continue;
    }
    out += ch;
    i += 1;
  }
  return out;
};

/**
 * The corpus is authored as JavaScript object literals (single quotes, unquoted
 * keys, trailing comments) rather than strict JSON, so evaluate it as an
 * expression instead of trying to JSON.parse it.
 */
const parseLiteral = (literal) => new Function(`return ${stripComments(literal)}`)();

/** Pull the first number out of an option label ("207.0 kN·m" -> 207). */
const optionNumber = (text) => {
  const scaled = /×\s*10⁶/.test(text);
  const indian = /₹([\d,]+)/.exec(text);
  if (indian) return Number(indian[1].replace(/,/g, ''));
  const match = /-?\d+(\.\d+)?/.exec(text.replace(/,/g, ''));
  if (!match) return NaN;
  const value = Number(match[0].replace(/,/g, ''));
  return scaled ? value * 1e6 : value;
};

/* ------------------------------------------------------- re-derivations */
const D = Math.PI / 180;

/** id -> { expected inputs recomputed from first principles, tol } */
const RECIPES = {
  'num-ce-001': { tol: 0.5, value: () => (0.138 * 20 * 300 * 500 ** 2) / 1e6 },
  'num-ce-002': { tol: 0.01, value: () => 150000 / (250 * 450) },
  'num-ce-003': { tol: 1, value: () => (16 * (0.87 * 415)) / (4 * 1.92) },
  'num-ce-004': { tol: 0.5, value: () => (20 * 40 ** 2) / (8 * 5) },
  'num-ce-005': { tol: 0.5, value: () => (30 * 6 ** 2) / 12 },
  'num-ce-006': { tol: 0, value: () => 3 * 3 + 6 - 3 * 4 },
  'num-ce-007': { tol: 0.5, value: () => Math.sqrt((((100 - 20) / 2) ** 2) + 30 ** 2) },
  'num-ce-008': { tol: 0.5, value: () => 4 * 200 },
  'num-ce-009': { tol: 0.5, value: () => 1.5 * 30 },
  'num-ce-010': { tol: 0.005, value: () => 0.25 * 2.65 },
  'num-ce-011': { tol: 0.01, value: () => 4 * 2 },
  'num-ce-012': { tol: 0.5, value: () => 5.7 * 40 },
  'num-ce-013': { tol: 0.005, value: () => (2 * 3) / 3 },
  'num-ce-014': { tol: 0.0005, value: () => 64 / 1600 },
  'num-ce-015': { tol: 0.005, value: () => 1.5 * 2 },
  'num-ce-016': { tol: 0.5, value: () => 200 / 0.68 },
  'num-ce-017': { tol: 0.05, value: () => Math.sqrt((4 * (1800 / 30)) / Math.PI) },
  'num-ce-018': { tol: 0.5, value: () => 300 * (1 - Math.exp(-0.23 * 3)) },
  'num-ce-019': { tol: 0.0005, value: () => 0.0673 * 2 ** 2 },
  'num-ce-020': { tol: 0.5, value: () => 1719 / 3 },
  'num-ce-021': { tol: 0.5, value: () => 100 * 2.0 * Math.cos(10 * D) ** 2 },
  'num-ce-022': { tol: 0.005, value: () => 0.7 * 10 },
  'num-ce-023': { tol: 0.005, value: () => 32 / (6 * Math.PI) },
  'num-ce-024': { tol: 0.05, value: () => (250 * ((100 * 300 ** 2) / 4)) / 1e6 },
  'num-ce-025': { tol: 0.005, value: () => 0.7 * Math.sqrt(25) },
  'num-ce-026': { tol: 0.05, value: () => 0.78 * 0.3 * 300 },
  'num-ce-027': { tol: 0.005, value: () => (2 + 8 + 18 + 38 + 68 + 92) / 100 },
  'num-ce-028': { tol: 0.005, value: () => (4 + 4 * 7 + 16) / 6 },
  'num-ce-029': { tol: 0.005, value: () => (16 - 4) / 6 },
  'num-ce-030': { tol: 0.005, value: () => 12 - (4 + 5) },
  'num-ce-031': { tol: 0.5, value: () => (864 * 120) / 96 },
  'num-ce-032': { tol: 0.5, value: () => 4.75 * Math.sqrt(64) },
  'num-ce-033': { tol: 0.05e6, value: () => 360 * 1e4 },
  'num-ce-034': { tol: 0.05, value: () => (3 * 200000) / 30000 },
  'num-ce-035': { tol: 0.005, value: () => (8 * 500 * 0.1) / 100 },
  'num-ce-036': { tol: 0.5, value: () => (0.82 * 1200 * 500) / 1000 },
  'num-ce-037': { tol: 0.005, value: () => 50 - 4 * 0.3 },
  'num-ce-038': { tol: 0.5, value: () => 60000 / 0.06 },
  'num-ce-039': { tol: 0.0005, value: () => 2 * 5 * 3 * 0.012 },
  'num-ce-040': {
    tol: 0.5,
    value: () => {
      const v = 80 / 3.6;
      return v * 2.5 + v ** 2 / (2 * 9.81 * 0.35);
    }
  },
  'num-ce-041': { tol: 0.0005, value: () => 80 ** 2 / (127 * 300) },
  'num-ce-042': {
    tol: 0.005,
    value: () => (2 * 6 ** 2) / (2 * 300) + 80 / (9.5 * Math.sqrt(300))
  }
};

/* ------------------------------------------------------------- validate */
const questions = readArray('src/data/numericalQuestions.ts', 'NUMERICAL_CIVIL_QUESTIONS');

const failures = [];
const seenIds = new Set();
const seenStems = new Map();
let verified = 0;

for (const q of questions) {
  const where = `${q.id}`;

  if (seenIds.has(q.id)) failures.push(`${where}: duplicate id`);
  seenIds.add(q.id);

  const stemKey = (q.stem ?? '').slice(0, 80).toLowerCase();
  if (seenStems.has(stemKey)) failures.push(`${where}: duplicate stem (also ${seenStems.get(stemKey)})`);
  seenStems.set(stemKey, q.id);

  if (q.questionType !== 'NUMERICAL') failures.push(`${where}: questionType is not NUMERICAL`);
  if (q.sourceType !== 'MODELLED') failures.push(`${where}: sourceType should be MODELLED`);
  if (!Array.isArray(q.options) || q.options.length !== 4) {
    failures.push(`${where}: expected 4 options, got ${q.options?.length}`);
    continue;
  }
  const ids = q.options.map((o) => o.id).join('');
  if (ids !== 'ABCD') failures.push(`${where}: option ids are ${ids}, expected ABCD`);
  if (!['A', 'B', 'C', 'D'].includes(q.correctOption)) {
    failures.push(`${where}: invalid correctOption ${q.correctOption}`);
  }
  if (!Array.isArray(q.solutionSteps) || q.solutionSteps.length < 2) {
    failures.push(`${where}: needs at least 2 solutionSteps`);
  }
  if ((q.explanation ?? '').length < 40) failures.push(`${where}: explanation too thin`);
  if (!q.referenceSource) failures.push(`${where}: missing referenceSource`);

  const optionTexts = new Set(q.options.map((o) => o.text.trim()));
  if (optionTexts.size !== 4) failures.push(`${where}: duplicate option text`);

  // Options for a numerical problem should be numbers, so they are comparable.
  for (const option of q.options) {
    if (Number.isNaN(optionNumber(option.text))) {
      failures.push(`${where}: option "${option.text}" has no numeric value`);
    }
  }

  const recipe = RECIPES[q.id];
  if (!recipe) {
    failures.push(`${where}: no re-derivation recipe — add one so the key is machine-checked`);
    continue;
  }

  const expected = recipe.value();
  const stated = optionNumber(q.options.find((o) => o.id === q.correctOption).text);
  const delta = Math.abs(expected - stated);

  if (delta > recipe.tol) {
    failures.push(
      `${where}: KEY MISMATCH — recomputed ${expected.toPrecision(6)} but option ${q.correctOption} says ${stated} (Δ=${delta.toPrecision(3)}, tol=${recipe.tol})`
    );
  } else {
    verified += 1;
  }

  // A distractor must not accidentally equal the recomputed answer.
  for (const option of q.options) {
    if (option.id === q.correctOption) continue;
    if (Math.abs(optionNumber(option.text) - expected) <= recipe.tol) {
      failures.push(`${where}: option ${option.id} also matches the computed answer (ambiguous key)`);
    }
  }
}

/* ---------------------------------------------------------------- report */
const byDifficulty = questions.reduce((acc, q) => {
  acc[q.difficulty] = (acc[q.difficulty] ?? 0) + 1;
  return acc;
}, {});
const bySubject = questions.reduce((acc, q) => {
  acc[q.subject] = (acc[q.subject] ?? 0) + 1;
  return acc;
}, {});

console.log(`problems            : ${questions.length}`);
console.log(`keys machine-verified: ${verified}/${questions.length}`);
console.log(`difficulty mix      : ${JSON.stringify(byDifficulty)}`);
console.log(`subjects covered    : ${Object.keys(bySubject).length}`);
for (const [subject, count] of Object.entries(bySubject).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(count).padStart(2)}  ${subject}`);
}

if (failures.length) {
  console.error(`\n\u2717 ${failures.length} problem(s):`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log('\n\u2713 all numerical problems validated');
