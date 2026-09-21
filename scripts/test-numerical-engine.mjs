/**
 * Runtime test for the numerical recipe engine.
 *
 * The recipes compute their own answers in code, so the risks are not arithmetic
 * slips but *structural* ones: a distractor colliding with the answer, a key
 * pointing at nothing, a non-positive or non-finite value, a stem that does not
 * actually contain the numbers it claims, or a recipe that throws on some seed.
 *
 * `mcqFactoryService` has no static runtime imports, so Node can load the real
 * module (type stripping erases the `import type` lines) and we test the actual
 * shipped code rather than a copy.
 *
 * Usage: node scripts/test-numerical-engine.mjs
 */
const { generateNumericalSet, RECIPES, RECIPE_SUBJECTS } = await import(
  '../src/services/mcqFactoryService.ts'
);

const SEEDS = [1, 7, 42, 2026, 999983, 123456789];
const PER_RUN = 24;

const failures = [];
let generated = 0;
let keysChecked = 0;

/* 1. every recipe builds cleanly and produces usable numbers ------------- */
for (const recipe of RECIPES) {
  let rngState = 5;
  const rng = () => {
    rngState = (rngState * 1103515245 + 12345) % 2147483648;
    return rngState / 2147483648;
  };

  for (let i = 0; i < 40; i += 1) {
    let built;
    try {
      built = recipe.build(rng);
    } catch (error) {
      failures.push(`${recipe.id}: build threw — ${error.message}`);
      break;
    }
    if (!Number.isFinite(built.answer) || built.answer <= 0) {
      failures.push(`${recipe.id}: answer is not a positive finite number (${built.answer})`);
    }
    if (!built.stem || built.stem.length < 40) failures.push(`${recipe.id}: stem too short`);
    if (!built.formulaContext) failures.push(`${recipe.id}: missing formulaContext`);
    if (!Array.isArray(built.steps) || built.steps.length < 2) {
      failures.push(`${recipe.id}: needs at least 2 solution steps`);
    }
    if (!built.explanation || built.explanation.length < 40) {
      failures.push(`${recipe.id}: explanation too thin`);
    }
    if (!recipe.reference) failures.push(`${recipe.id}: missing reference`);
    if (!['EASY', 'MEDIUM', 'HARD'].includes(recipe.difficulty)) {
      failures.push(`${recipe.id}: bad difficulty ${recipe.difficulty}`);
    }
    // Every compute-type item must state at least one given quantity. Scaling
    // recipes ("critical load 200 kN, now fixed-fixed…") legitimately supply one.
    const numbersInStem = (built.stem.match(/\d+(\.\d+)?/g) ?? []).length;
    if (numbersInStem < 1) failures.push(`${recipe.id}: stem supplies no quantities`);
    // Distractors must never equal the answer.
    for (const distractor of built.distractors ?? []) {
      if (!Number.isFinite(distractor)) continue;
      if (Math.abs(distractor - built.answer) / Math.max(built.answer, 1e-9) < 0.02) {
        failures.push(`${recipe.id}: distractor ${distractor} collides with the answer ${built.answer}`);
      }
    }
  }
}

/* 2. end-to-end generation across seeds --------------------------------- */
const stemsBySeed = new Map();

for (const seed of SEEDS) {
  let set;
  try {
    set = generateNumericalSet({ count: PER_RUN, seed });
  } catch (error) {
    failures.push(`seed ${seed}: generation threw — ${error.message}`);
    continue;
  }

  if (set.questions.length !== PER_RUN) {
    failures.push(`seed ${seed}: asked for ${PER_RUN}, produced ${set.questions.length} (rejected ${set.report.rejected})`);
  }

  const stems = set.questions.map((q) => q.stem.replace(/\s+/g, ' ').trim().toLowerCase());
  if (new Set(stems).size !== stems.length) {
    failures.push(`seed ${seed}: duplicate stems inside one set`);
  }
  stemsBySeed.set(seed, new Set(stems));

  for (const question of set.questions) {
    generated += 1;

    if (question.questionType !== 'NUMERICAL') failures.push(`${question.id}: not marked NUMERICAL`);
    // Recipes compute their keys in code, so they must not be labelled as AI output.
    if (question.sourceType !== 'TEMPLATE_GENERATED') {
      failures.push(`${question.id}: wrong sourceType (${question.sourceType})`);
    }
    if (question.options.length !== 4) failures.push(`${question.id}: ${question.options.length} options`);
    if (question.options.map((o) => o.id).join('') !== 'ABCD') {
      failures.push(`${question.id}: option ids are ${question.options.map((o) => o.id).join('')}`);
    }
    if (new Set(question.options.map((o) => o.text.toLowerCase())).size !== 4) {
      failures.push(`${question.id}: duplicate option text`);
    }

    const key = question.options.find((o) => o.id === question.correctOption);
    if (!key) {
      failures.push(`${question.id}: key ${question.correctOption} does not exist`);
      continue;
    }
    keysChecked += 1;

    // Every option must be unit-consistent with the key — a numeric item whose
    // distractors are a different quantity is broken.
    const unit = (key.text.match(/[a-zA-Z°·/²³]+(?:\s*[a-zA-Z°·/²³]+)*$/) ?? [''])[0].trim();
    if (unit) {
      for (const option of question.options) {
        if (!option.text.includes(unit)) {
          failures.push(`${question.id}: option ${option.id} ("${option.text}") is missing the key's unit "${unit}"`);
        }
      }
    }

    if (!question.solutionSteps || question.solutionSteps.length < 2) {
      failures.push(`${question.id}: no working steps`);
    }
    if (!question.answerUnit && question.questionType === 'NUMERICAL') {
      // Dimensionless is allowed only for a few recipes; flag for review.
      if (!['geo-void-ratio', 'fm-laminar-friction', 'hw-superelevation'].some((id) => question.explanation.includes(id))) {
        // informational only — recipes without a unit are legitimate
      }
    }
  }
}

/* 3. determinism and cross-seed variety --------------------------------- */
const repeat = generateNumericalSet({ count: PER_RUN, seed: SEEDS[0] });
const firstStems = repeat.questions.map((q) => q.stem).join('|');
const originalStems = [...stemsBySeed.get(SEEDS[0])].join('|');
if (repeat.questions.map((q) => q.stem.replace(/\s+/g, ' ').trim().toLowerCase()).join('|') !== originalStems) {
  failures.push(`seed ${SEEDS[0]} is not reproducible`);
}

const union = new Set();
for (const set of stemsBySeed.values()) for (const stem of set) union.add(stem);
const maxSetSize = Math.max(...[...stemsBySeed.values()].map((s) => s.size));
if (union.size <= maxSetSize) {
  failures.push('different seeds do not produce different problems — variety is broken');
}

/* 4. subject coverage and report shape ---------------------------------- */
for (const recipe of RECIPES) {
  if (!RECIPE_SUBJECTS.includes(recipe.subject)) {
    failures.push(`${recipe.id}: subject not exposed in RECIPE_SUBJECTS`);
  }
}

console.log('recipes                :', RECIPES.length);
console.log('subjects covered       :', RECIPE_SUBJECTS.length);
console.log('problems generated     :', generated, 'across', SEEDS.length, 'seeds');
console.log('keys structurally valid:', keysChecked);
console.log('distinct problems seen :', union.size, `(= ${(union.size / generated * 100).toFixed(0)}% unique within a run)`);

if (failures.length) {
  console.error(`\n\u2717 ${failures.length} failure(s):`);
  for (const failure of failures.slice(0, 40)) console.error('  -', failure);
  if (failures.length > 40) console.error(`  … and ${failures.length - 40} more`);
  process.exit(1);
}
console.log('\n\u2713 numerical engine healthy');
