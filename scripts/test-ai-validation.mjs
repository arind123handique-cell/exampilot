/**
 * Offline test for the AI question pathway.
 *
 * The user-facing promise is "the AI writes Testbook-style MCQs". A model will
 * reliably return well-written stems and unreliable arithmetic, so the risk is
 * not that generation fails — it is that a *plausible-looking* item with a
 * broken option set reaches a student. This test feeds recorded-style payloads
 * through the exact shipped pipeline (`normaliseAiQuestion` →
 * `repairNumericOptions` → `validateCandidate`) with no API key and no network,
 * and asserts what a student would see for each defect class.
 *
 * Usage: node scripts/test-ai-validation.mjs
 */
const { normaliseAiQuestion, repairNumericOptions, validateCandidate } = await import(
  '../src/services/mcqFactoryService.ts'
);

const request = {
  subject: 'Reinforced Concrete Structures',
  topic: 'Limit State Design — Flexure',
  count: 3,
  examName: 'APSC AE Civil'
};

const failures = [];
let checks = 0;

const check = (name, condition, detail = '') => {
  checks += 1;
  if (!condition) failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
};

/**
 * Run one raw payload item through the real pipeline, as generateAiQuestions
 * does. `seen` is threaded through so the duplicate-stem rule is exercised the
 * way it actually runs — against the set built so far.
 */
/**
 * Mirrors the caller contract in `generateAiQuestions`: an accepted item
 * registers both its normalised stem and its digit-blanked fingerprint, which is
 * what makes the near-duplicate rule work. Registering only one of the two would
 * make this test pass against behaviour the app does not have.
 */
const seenKeys = (stem) => [
  stem.replace(/\s+/g, ' ').trim().toLowerCase().slice(0, 90),
  stem.replace(/\d+(?:\.\d+)?/g, '#').replace(/\s+/g, ' ').trim().toLowerCase().slice(0, 90)
];

const pipeline = (raw, index = 0, seen = new Set()) => {
  const parsed = normaliseAiQuestion(raw, request, index);
  if (!parsed) return { question: null, issues: ['normalise returned null'] };
  const question = repairNumericOptions(parsed);
  const issues = validateCandidate(question, seen);
  if (!issues.length) for (const key of seenKeys(question.stem)) seen.add(key);
  return { question, issues };
};

const baseNumerical = {
  stem: 'A rectangular beam 250 mm wide and 450 mm deep uses M20 concrete and Fe415 steel. Determine the limiting moment of resistance.',
  subject: 'Reinforced Concrete Structures',
  topic: 'Limit State Design — Flexure',
  difficulty: 'MEDIUM',
  questionType: 'NUMERICAL',
  options: ['111.8 kN·m', '98.4 kN·m', '125.6 kN·m', '86.2 kN·m'],
  correctOption: 'A',
  explanation: 'Limiting moment uses the limiting neutral axis depth, so the concrete governs rather than the steel.',
  formulaContext: 'M_u,lim = 0.138 f_ck b d²',
  solutionSteps: ['Step 1 — compute x_u,max/d.', 'Step 2 — substitute into M_u,lim.'],
  answerUnit: 'kN·m',
  referenceSource: 'IS 456:2000, Cl. 38.1'
};

/* 1. a clean item survives untouched, and the key still points at the right value */
{
  const { question, issues } = pipeline(baseNumerical);
  check('clean numerical item is accepted', question !== null && issues.length === 0, issues.join('; '));
  check('clean item keeps 4 options', question?.options.length === 4);
  const key = question?.options.find((o) => o.id === question.correctOption);
  check('key value is preserved', key?.text === '111.8 kN·m', `got ${key?.text}`);
}

/* 2. the defect the prompt alone cannot prevent: same quantity, different text */
{
  const { question, issues } = pipeline({
    ...baseNumerical,
    options: ['111.8 kN·m', '1,11.8 kN·m', '125.6 kN·m', '86.2 kN·m']
  });
  // "1,11.8" parses as 111.8 — the learner sees the answer twice.
  const texts = question?.options.map((o) => o.text) ?? [];
  const values = texts.map((t) => Number(t.replace(/,/g, '').replace(/[^\d.-].*$/, '')));
  check('comma-formatted duplicate is repaired away', new Set(values).size === 4, JSON.stringify(texts));
  check('repaired item validates', question !== null && issues.length === 0, issues.join('; '));
}

/* 3. a distractor that is the key restated */
{
  const { question, issues } = pipeline({
    ...baseNumerical,
    options: ['111.8 kN·m', '111.80 kN·m', '125.6 kN·m', '86.2 kN·m']
  });
  const key = question?.options.find((o) => o.id === question.correctOption);
  const others = question?.options.filter((o) => o.id !== question.correctOption) ?? [];
  check('key is untouched by repair', key?.text === '111.8 kN·m', `got ${key?.text}`);
  check(
    'restated key is replaced, not shipped',
    others.every((o) => o.text !== '111.80 kN·m'),
    JSON.stringify(others.map((o) => o.text))
  );
  check('repaired item validates', issues.length === 0, issues.join('; '));
}

/* 4. repair must preserve units and option identity */
{
  const { question } = pipeline({
    ...baseNumerical,
    options: ['111.8 kN·m', '111.82 kN·m', '111.81 kN·m', '111.79 kN·m']
  });
  const others = question.options.filter((o) => o.id !== question.correctOption);
  check('repaired options keep the unit', others.every((o) => o.text.includes('kN·m')), JSON.stringify(others.map((o) => o.text)));
  check('option ids stay ABCD', question.options.map((o) => o.id).join('') === 'ABCD');
  check('repaired options are distinct', new Set(question.options.map((o) => o.text)).size === 4);
}

/* 5. structural rejects — these cannot be repaired, so they must be dropped */
{
  const duplicateText = pipeline({
    ...baseNumerical,
    questionType: 'CONCEPTUAL',
    options: ['Creep', 'Creep', 'Shrinkage', 'Fatigue'],
    stem: 'Which of the following is a time-dependent deformation of concrete under sustained load?',
    correctOption: 'A'
  });
  check('duplicate option text is rejected', duplicateText.issues.some((i) => i.includes('duplicate option text')));
}
{
  const filler = pipeline({
    ...baseNumerical,
    questionType: 'CONCEPTUAL',
    options: ['Creep', 'Shrinkage', 'Fatigue', 'All of the above'],
    stem: 'Which of the following affect the long-term deflection of a reinforced concrete beam?'
  });
  check(
    'all-of-the-above filler is rejected',
    filler.issues.some((i) => i.includes('all/none of the above')),
    filler.issues.join('; ')
  );
}
{
  const seen = new Set();
  const first = pipeline(baseNumerical, 0, seen);
  const second = pipeline(baseNumerical, 1, seen);
  check('first copy of a stem is accepted', first.issues.length === 0, first.issues.join('; '));
  check(
    'duplicate stem is rejected',
    second.issues.some((i) => i.includes('duplicate stem')),
    second.issues.join('; ')
  );
}
{
  // Observed live: the same item twice with the numbers slightly changed.
  const seen = new Set();
  const first = pipeline(
    {
      ...baseNumerical,
      stem: 'A saturated soil sample has a water content of 15% and a specific gravity of solids of 2.65. Determine its void ratio.',
      questionType: 'NUMERICAL',
      options: ['0.397', '0.265', '0.560', '0.150'],
      correctOption: 'A'
    },
    0,
    seen
  );
  const tweaked = pipeline(
    {
      ...baseNumerical,
      stem: 'A saturated soil sample has a water content of 15% and a specific gravity of solids of 2.7. Determine its void ratio.',
      questionType: 'NUMERICAL',
      options: ['0.405', '0.270', '0.560', '0.150'],
      correctOption: 'A'
    },
    1,
    seen
  );
  check('first variant is accepted', first.issues.length === 0, first.issues.join('; '));
  check(
    'same stem with different numbers is rejected as a near-duplicate',
    tweaked.issues.some((i) => i.includes('near-duplicate')),
    tweaked.issues.join('; ')
  );
}
{
  const { issues } = pipeline({ ...baseNumerical, options: ['111.8 kN·m', '98.4', '125.6 kN·m', '86.2 kN·m'] });
  check(
    'option missing the key unit is rejected',
    issues.some((i) => i.includes('missing the key')), issues.join('; ')
  );
}
{
  const { issues } = pipeline({ ...baseNumerical, solutionSteps: ['Step 1 — substitute.'] });
  check('numerical item without working steps is rejected', issues.some((i) => i.includes('working steps')));
}
{
  const { issues } = pipeline({
    ...baseNumerical,
    options: ['Very high', 'Moderate', 'Low', 'Negligible'],
    correctOption: 'A'
  });
  check('non-numeric options on a numerical item are rejected', issues.length > 0, issues.join('; '));
}
{
  const { issues } = pipeline({ ...baseNumerical, explanation: 'Because.' });
  check('thin explanation is rejected', issues.some((i) => i.includes('explanation too thin')));
}
{
  // Observed live: the model argued with itself inside the answer field.
  const leaked = pipeline({
    ...baseNumerical,
    explanation:
      'I cannot generate an incorrect explanation. Let me re-read the prompt: "Distractors must come from realistic student mistakes". Therefore the solution should use the stress block.\nThe limiting moment is 111.8 kN·m.'
  });
  check(
    'leaked model reasoning is rejected',
    leaked.issues.some((i) => i.includes('reasoning leaked')),
    leaked.issues.join('; ')
  );
}
{
  const leakedStep = pipeline({
    ...baseNumerical,
    solutionSteps: ['Step 1 — Hmm, let me reconsider the neutral axis depth.', 'Step 2 — substitute the values.']
  });
  check('leaked reasoning in a solution step is rejected', leakedStep.issues.some((i) => i.includes('reasoning leaked')));
}
{
  const parsed = normaliseAiQuestion({ ...baseNumerical, correctOption: 'E' }, request, 0);
  check('a key outside ABCD is dropped at normalisation', parsed === null);
}
{
  const parsed = normaliseAiQuestion({ ...baseNumerical, exactSource: undefined, difficulty: 'IMPOSSIBLE' }, request, 0);
  check('unknown difficulty degrades to MEDIUM rather than throwing', parsed?.difficulty === 'MEDIUM');
}
{
  const parsed = normaliseAiQuestion(baseNumerical, request, 0);
  check('model output is never labelled as a PYQ', parsed?.sourceType === 'AI_GENERATED');
  check(
    'key parsed from "Option B" wording',
    normaliseAiQuestion({ ...baseNumerical, correctOption: 'B) 98.4 kN·m' }, request, 0)?.correctOption === 'B'
  );
}

/* 6. repair must be idempotent — running it twice cannot drift the options */
{
  const once = repairNumericOptions(normaliseAiQuestion(baseNumerical, request, 0));
  const twice = repairNumericOptions(once);
  check(
    'repair is idempotent',
    JSON.stringify(once.options) === JSON.stringify(twice.options),
    `${JSON.stringify(once.options)} vs ${JSON.stringify(twice.options)}`
  );
}

console.log('checks run :', checks);
console.log('failures   :', failures.length);
if (failures.length) {
  console.error('');
  for (const failure of failures) console.error('  \u2717', failure);
  process.exit(1);
}
console.log('\n\u2713 AI question pipeline rejects or repairs every seeded defect');
