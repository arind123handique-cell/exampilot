/**
 * Structural validator for every theory module.
 *
 * The syllabus modules are the largest content surface in the app and the only
 * one with no test behind it: 10 000-plus lines of hand-written data where a
 * benchmark example whose stated answer is not among its own options is a
 * student-facing bug that nothing else would catch.
 *
 * This checks the invariants that can be verified without re-deriving the
 * physics — answer present in options, keys resolvable, ids unique, worked
 * examples complete. Arithmetic is verified separately where it is generated
 * (recipes) and was checked by hand where it is authored (modules).
 *
 * The merged export is checked for completeness against its three sources, so a
 * mistake in the merge cannot hide a module from this check. Everything printed
 * below is what the app really ships.
 *
 * Usage: node scripts/validate-knowledge-modules.mjs
 */
const { TOPIC_KNOWLEDGE_MODULES, BASE_KNOWLEDGE_MODULES } = await import('../src/data/topicKnowledge.ts');
const { FOUNDATION_CIVIL_MODULES } = await import('../src/data/foundationCivilModules.ts');
const { INFRASTRUCTURE_CIVIL_MODULES } = await import('../src/data/infrastructureCivilModules.ts');

const modules = TOPIC_KNOWLEDGE_MODULES;
const expectedCount =
  BASE_KNOWLEDGE_MODULES.length + FOUNDATION_CIVIL_MODULES.length + INFRASTRUCTURE_CIVIL_MODULES.length;

const failures = [];
const warnings = [];
if (modules.length !== expectedCount) {
  failures.push(
    `merge in topicKnowledge.ts is incomplete: ${modules.length} modules exported but ${expectedCount} exist across the three source files`
  );
}
const MODULE_IDS = new Set();
const QUESTION_IDS = new Set();
const STEMS = new Set();
/** id -> modules, and normalised stem -> modules, for the cross-module reuse report. */
const ID_TO_MODULES = new Map();
const STEM_TO_MODULES = new Map();

const require_ = (condition, message) => {
  if (!condition) failures.push(message);
  return Boolean(condition);
};

const normaliseStem = (stem) => stem.replace(/\s+/g, ' ').trim().toLowerCase().slice(0, 90);

for (const module of modules) {
  const where = module?.id ?? '(module with no id)';

  require_(typeof module.id === 'string' && module.id.length > 0, `${where}: missing id`);
  if (MODULE_IDS.has(module.id)) failures.push(`${where}: duplicate module id`);
  MODULE_IDS.add(module.id);

  require_(Boolean(module.title), `${where}: missing title`);
  require_(Boolean(module.subject), `${where}: missing subject`);
  require_(module.category === 'civil' || module.category === 'gs', `${where}: bad category "${module.category}"`);
  require_(Array.isArray(module.standardReferences) && module.standardReferences.length > 0, `${where}: no standard references`);
  require_((module.summary ?? '').length >= 80, `${where}: summary too thin`);
  require_(Array.isArray(module.practiceQuestionIds), `${where}: practiceQuestionIds must be an array`);
  require_(Array.isArray(module.steps) && module.steps.length > 0, `${where}: no steps`);
  require_(['HIGH_YIELD', 'MEDIUM', 'CORE'].includes(module.weightage), `${where}: bad weightage "${module.weightage}"`);

  module.steps?.forEach((step, index) => {
    const at = `${where} step ${index + 1}`;
    require_(step.stepNumber === index + 1, `${at}: stepNumber is ${step.stepNumber}`);
    require_(Boolean(step.stepTitle), `${at}: missing stepTitle`);
    require_(Boolean(step.subtitle), `${at}: missing subtitle`);
    require_((step.keyConcept ?? '').length >= 80, `${at}: keyConcept too thin`);
    require_(Array.isArray(step.highYieldFacts) && step.highYieldFacts.length >= 2, `${at}: needs at least 2 high-yield facts`);
    require_(Boolean(step.examTrap), `${at}: missing examTrap`);
    require_(Boolean(step.formulaOrCode), `${at}: missing formulaOrCode`);

    const example = step.benchmarkExample;
    if (!require_(Boolean(example), `${at}: missing benchmarkExample`)) return;
    require_(Boolean(example.question), `${at}: benchmark example has no question`);
    require_(
      Array.isArray(example.stepByStepSolution) && example.stepByStepSolution.length >= 2,
      `${at}: benchmark example needs at least 2 solution steps`
    );
    require_(Boolean(example.takeaway), `${at}: benchmark example has no takeaway`);

    if (Array.isArray(example.options) && example.options.length > 0) {
      require_(example.options.length >= 2, `${at}: benchmark example has fewer than 2 options`);
      const unique = new Set(example.options.map((option) => String(option).trim().toLowerCase()));
      if (unique.size !== example.options.length) failures.push(`${at}: benchmark example has duplicate options`);
      if (require_(Boolean(example.correctAnswer), `${at}: options present but no correctAnswer`)) {
        const answer = String(example.correctAnswer).trim().toLowerCase();
        if (!unique.has(answer)) {
          failures.push(
            `${at}: stated answer "${example.correctAnswer}" is not among its options (${example.options.join(' | ')})`
          );
        }
      }
    }
  });

  // Inline questions belong to a module, so uniqueness is enforced within the
  // module; the same question appearing in two sibling modules is reported as
  // reuse (see the cross-module check below) rather than as a hard failure.
  const moduleQuestionIds = new Set();
  const moduleStems = new Set();

  for (const question of module.topicQuestions ?? []) {
    const at = `${where} inline question ${question.id ?? '(no id)'}`;
    require_(Boolean(question.id), `${at}: missing id`);
    if (moduleQuestionIds.has(question.id)) failures.push(`${at}: duplicate id within this module`);
    moduleQuestionIds.add(question.id);
    QUESTION_IDS.add(question.id);
    if (!ID_TO_MODULES.has(question.id)) ID_TO_MODULES.set(question.id, new Set());
    ID_TO_MODULES.get(question.id).add(where);

    require_((question.stem ?? '').length >= 25, `${at}: stem too short`);
    const stemKey = normaliseStem(question.stem ?? '');
    if (moduleStems.has(stemKey)) failures.push(`${at}: duplicate stem within this module`);
    moduleStems.add(stemKey);
    STEMS.add(stemKey);
    if (!STEM_TO_MODULES.has(stemKey)) STEM_TO_MODULES.set(stemKey, new Set());
    STEM_TO_MODULES.get(stemKey).add(where);

    require_(question.options?.length === 4, `${at}: needs exactly 4 options`);
    if (question.options?.length === 4) {
      require_(question.options.map((option) => option.id).join('') === 'ABCD', `${at}: option ids are not A-D`);
      const texts = new Set(question.options.map((option) => option.text.trim().toLowerCase()));
      if (texts.size !== 4) failures.push(`${at}: duplicate option text`);
      if (!texts.has(String(question.options.find((o) => o.id === question.correctOption)?.text ?? '').trim().toLowerCase())) {
        failures.push(`${at}: correctOption ${question.correctOption} does not resolve to an option`);
      }
    }
    require_((question.explanation ?? '').length >= 40, `${at}: explanation too thin`);
    if (['PYQ', 'PREVIOUS_YEAR', 'VERBATIM'].includes(String(question.sourceType ?? '').toUpperCase())) {
      failures.push(`${at}: inline question claims PYQ provenance (sourceType ${question.sourceType})`);
    }
  }

  // practiceQuestionIds are treated as warnings: the legacy modules reference a
  // "civil-1" namespace that no longer exists in the bank, and nothing in the UI
  // reads the field for static modules. Reported so it is visible, not silently
  // tolerated.
  for (const id of module.practiceQuestionIds ?? []) {
    if (!QUESTION_IDS.has(id) && !(module.topicQuestions ?? []).some((question) => question.id === id)) {
      warnings.push(`${where}: practiceQuestionId "${id}" does not resolve to any known question`);
    }
  }
}

const steps = modules.reduce((sum, module) => sum + (module.steps?.length ?? 0), 0);
const inline = modules.reduce((sum, module) => sum + (module.topicQuestions?.length ?? 0), 0);
const withExamples = modules.reduce(
  (sum, module) => sum + (module.steps ?? []).filter((step) => step.benchmarkExample?.options?.length).length,
  0
);
const workedExamples = modules.reduce(
  (sum, module) => sum + (module.steps ?? []).filter((step) => step.benchmarkExample).length,
  0
);

console.log('modules                :', modules.length, `(${modules.filter((m) => m.category === 'civil').length} civil)`);
console.log('theory steps           :', steps);
console.log('worked examples        :', workedExamples, `(${withExamples} with options)`);
console.log('inline questions       :', inline);
console.log('distinct subjects      :', new Set(modules.map((m) => m.subject)).size);

/* cross-module duplicate questions --------------------------------------- */
const reusedIds = [...ID_TO_MODULES.entries()].filter(([, modules]) => modules.size > 1);
const reusedStems = [...STEM_TO_MODULES.entries()].filter(([, modules]) => modules.size > 1);
if (reusedIds.length) {
  warnings.push(
    `${reusedIds.length} inline question(s) are reused verbatim across sibling modules, so a student can meet the same question in two places`
  );
  for (const [id, modules] of reusedIds.slice(0, 5)) {
    warnings.push(`  ${id}: ${[...modules].join(', ')}`);
  }
}

if (warnings.length) {
  console.log(`\n! ${warnings.length} warning(s):`);
  for (const warning of warnings.slice(0, 12)) console.log('  -', warning);
  if (warnings.length > 12) console.log(`  … and ${warnings.length - 12} more`);
  console.log(`  (${reusedStems.length} distinct question texts reused; ${warnings.length} warnings total)`);
}

if (failures.length) {
  console.error(`\n\u2717 ${failures.length} failure(s):`);
  for (const failure of failures.slice(0, 40)) console.error('  -', failure);
  if (failures.length > 40) console.error(`  … and ${failures.length - 40} more`);
  process.exit(1);
}
console.log('\n\u2713 every knowledge module is structurally sound');
