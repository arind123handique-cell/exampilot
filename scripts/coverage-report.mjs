/**
 * Curriculum coverage report — what the app teaches and drills, measured against
 * the exam blueprint in `src/services/curriculumBlueprint.ts`.
 *
 * This is the audit that decides what to generate next, so it reports both sides
 * of the ledger: subjects the blueprint expects but the bank does not cover, and
 * bank content no blueprint topic could claim (which usually means a naming or
 * topic mismatch rather than a real gap).
 *
 * Usage:
 *   node scripts/coverage-report.mjs            # full report
 *   node scripts/coverage-report.mjs --requests # + next generation work items
 *   node scripts/coverage-report.mjs --json     # machine-readable
 */
const { CIVIL_ENGINEERING_QUESTIONS } = await import('../src/data/civilQuestions.ts');
const { NUMERICAL_CIVIL_QUESTIONS } = await import('../src/data/numericalQuestions.ts');
const { TOPIC_KNOWLEDGE_MODULES } = await import('../src/data/topicKnowledge.ts');
const { RECIPES } = await import('../src/services/mcqFactoryService.ts');
const { buildCoverageReport, topGenerationRequests, summariseCoverage } = await import(
  '../src/services/curriculumBlueprint.ts'
);

const questions = [...CIVIL_ENGINEERING_QUESTIONS, ...NUMERICAL_CIVIL_QUESTIONS];
const modules = TOPIC_KNOWLEDGE_MODULES.filter((module) => module.category === 'civil');
const recipes = RECIPES.map((recipe) => ({
  subject: recipe.subject,
  topic: recipe.topic,
  subtopic: recipe.subtopic
}));

const report = buildCoverageReport({ questions, modules, recipes });

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ ...report, requests: topGenerationRequests(report, 10) }, null, 2));
  process.exit(0);
}

const pad = (value, width) => String(value).padEnd(width);

console.log('================= CURRICULUM COVERAGE =================');
console.log(summariseCoverage(report));
console.log(`blueprint subjects     : ${report.summary.blueprintSubjects}`);
console.log(`theory steps (civil)   : ${report.summary.totalTheorySteps}`);
console.log(`deterministic recipes  : ${report.summary.totalRecipes}`);

console.log('\n---- subject ledger (bank questions vs weighted target) ----');
console.log(
  `  ${pad('subject', 42)}${pad('q', 5)}${pad('num', 5)}${pad('steps', 6)}${pad('rec', 5)}${pad('target', 8)}status`
);
for (const entry of report.subjects) {
  const status = entry.deficit === 0 ? 'ok' : `short by ${entry.deficit}`;
  console.log(
    `  ${pad(entry.subject, 42)}${pad(entry.questions, 5)}${pad(entry.numerical, 5)}${pad(entry.theorySteps, 6)}${pad(
      entry.recipes,
      5
    )}${pad(entry.target, 8)}${status}${entry.topicsCovered < entry.topicsTotal ? `  (${entry.topicsCovered}/${entry.topicsTotal} topics)` : ''}`
  );
}

console.log('\n---- subjects with NO theory module ----');
if (report.summary.subjectsWithoutTheory.length === 0) console.log('  none');
for (const subject of report.summary.subjectsWithoutTheory) console.log('  • ' + subject);

console.log('\n---- subjects with NO questions ----');
if (report.summary.subjectsWithoutQuestions.length === 0) console.log('  none');
for (const subject of report.summary.subjectsWithoutQuestions) console.log('  • ' + subject);

console.log('\n---- 15 highest-priority topic gaps ----');
for (const gap of report.gaps.slice(0, 15)) {
  console.log(`  [${String(gap.priority).padStart(7)}] ${pad(gap.subject, 40)} ${pad(gap.topic, 46)} ${gap.reason}`);
}

console.log(`\n---- bank topics no blueprint topic claimed (${report.unmatchedBankTopics.length}) ----`);
if (report.unmatchedBankTopics.length === 0) console.log('  none');
for (const entry of report.unmatchedBankTopics.slice(0, 15)) {
  console.log(`  ${String(entry.count).padStart(3)}×  ${pad(entry.subject, 42)} ${entry.topic}`);
}
if (report.unmatchedBankTopics.length > 15) {
  console.log(`  … and ${report.unmatchedBankTopics.length - 15} more`);
}

if (process.argv.includes('--requests')) {
  console.log('\n---- next generation work items ----');
  for (const request of topGenerationRequests(report, 10)) {
    console.log(`  ${String(request.count).padStart(3)} MCQs  ${pad(request.subject, 40)} ${pad(request.topic, 46)} ${request.reason}`);
  }
}
