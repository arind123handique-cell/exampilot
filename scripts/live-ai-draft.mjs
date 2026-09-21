/**
 * Live AI drafter — runs the real prompt against the live model and reports what
 * actually comes back.
 *
 * The offline test (`test-ai-validation.mjs`) proves the *validator* handles
 * every defect class, but it cannot tell you whether the prompt produces usable
 * questions in the first place, or which defects the model actually makes. This
 * script does, and it is deliberately verbose about failures: a silently
 * swallowed 404 is exactly how this app's live AI path went dark.
 *
 * Usage:
 *   GEMINI_API_KEY=... node scripts/live-ai-draft.mjs
 *   GEMINI_API_KEY=... node scripts/live-ai-draft.mjs --topic "Slope Stability" --count 6
 *   GEMINI_API_KEY=... node scripts/live-ai-draft.mjs --combined   # the shipped entry point
 *   GEMINI_API_KEY=... node scripts/live-ai-draft.mjs --dry        # print the prompt only
 *
 * The key is read from GEMINI_API_KEY or VITE_GEMINI_API_KEY and injected through
 * the same resolution path the browser uses (localStorage), so this exercises
 * the shipped code rather than a copy of it.
 */
import { writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};

const apiKey = (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '').trim();
const count = Number(flag('count', 6));
const topic = flag('topic', null);
const dry = args.includes('--dry');

if (!apiKey && !dry) {
  console.error('No key. Set GEMINI_API_KEY (or VITE_GEMINI_API_KEY), or run with --dry to inspect the prompt.');
  process.exit(2);
}

// The service resolves the key through localStorage first, then import.meta.env.
// Node has neither, so stand localStorage up before the module is imported.
if (apiKey) {
  globalThis.localStorage = {
    getItem: (key) => (key === 'exampilot_gemini_key' ? apiKey : null),
    setItem: () => {},
    removeItem: () => {}
  };
}

const { buildAiPrompt, normaliseAiQuestion, repairNumericOptions, validateCandidate } = await import(
  '../src/services/mcqFactoryService.ts'
);
const {
  callGeminiJson,
  getActiveGeminiModel,
  getGeminiModelCandidates,
  getLastAiDiagnostics,
  getLastAiError,
  hasLiveAi
} = await import('../src/services/geminiService.ts');

const request = {
  subject: flag('subject', 'Geotechnical Engineering'),
  topic: topic ?? 'Slope Stability & Soil Improvement',
  count,
  kinds: ['NUMERICAL', 'FORMULA_RECALL', 'CONCEPTUAL'],
  difficultyMix: { EASY: 0.2, MEDIUM: 0.55, HARD: 0.25 },
  examName: 'APSC AE / UPSC ESE Civil'
};

const prompt = buildAiPrompt(request);

/* -------------------------------------------------- shipped entry point --- */

if (args.includes('--combined')) {
  const { generateQuestionSet } = await import('../src/services/mcqFactoryService.ts');
  const startedCombined = Date.now();
  const set = await generateQuestionSet({
    count,
    seed: 20260920,
    subjects: [request.subject],
    aiSubject: request.subject,
    aiTopic: request.topic
  });
  console.log('============ GENERATEQUESTIONSSET (shipped path) ============');
  console.log('requested          :', set.report.requested);
  console.log('produced           :', set.report.produced);
  console.log('  numerical        :', set.report.numerical, '(computed keys, no AI needed)');
  console.log('  AI drafted       :', set.report.aiGenerated);
  console.log('rejected           :', set.report.rejected);
  console.log('live AI used       :', set.report.usedLiveAi);
  console.log('model              :', getActiveGeminiModel() ?? '(none)');
  console.log('AI error           :', getLastAiError() ?? '(none)');
  console.log('wall clock         :', ((Date.now() - startedCombined) / 1000).toFixed(1), 's');
  console.log('');
  for (const [index, question] of set.questions.entries()) {
    const key = question.options.find((option) => option.id === question.correctOption);
    console.log(`  [${index + 1}] ${question.sourceType} · ${question.difficulty} · ${question.questionType}`);
    console.log(`      ${question.stem.replace(/\s+/g, ' ').slice(0, 150)}`);
    console.log(`      key ${key?.id}: ${key?.text}`);
  }
  writeFileSync('live-ai-combined.json', JSON.stringify({ report: set.report, questions: set.questions }, null, 2));
  console.log('\n  written to live-ai-combined.json');
  process.exit(0);
}

console.log('================= LIVE AI DRAFTER =================');
console.log('key present        :', hasLiveAi() ? 'yes' : 'no');
console.log('model candidates   :', getGeminiModelCandidates().join(' → '));
console.log('request            :', `${request.count} × ${request.subject} / ${request.topic}`);
console.log('prompt length      :', prompt.length, 'chars');
console.log('');

if (dry) {
  console.log('---- prompt (dry run) ----');
  console.log(prompt);
  process.exit(0);
}

// Match the budget the factory uses; reasoning tokens count against it.
const started = Date.now();
const payload = await callGeminiJson(prompt, { maxOutputTokens: 16000 });
const latencyMs = Date.now() - started;

console.log('model that answered:', getActiveGeminiModel() ?? '(none)');
console.log('latency            :', latencyMs, 'ms');
console.log('error              :', getLastAiError() ?? '(none)');
console.log('');

if (!payload) {
  const diagnostics = getLastAiDiagnostics();
  console.error('The model produced nothing usable.');
  console.error(`  model          : ${diagnostics.model ?? '(none)'}`);
  console.error(`  finish reason  : ${diagnostics.finishReason ?? '(unknown)'}`);
  console.error(`  raw length     : ${diagnostics.rawText?.length ?? 0} chars`);
  console.error(`  error          : ${diagnostics.error ?? '(none)'}`);
  if (diagnostics.rawText) {
    writeFileSync('live-ai-raw.txt', diagnostics.rawText);
    console.error('  raw response written to live-ai-raw.txt — head:');
    console.error('  ' + diagnostics.rawText.slice(0, 600).replace(/\n/g, '\n  '));
    console.error('  … tail:');
    console.error('  ' + diagnostics.rawText.slice(-400).replace(/\n/g, '\n  '));
  }
  process.exit(1);
}

const items = Array.isArray(payload) ? payload : payload.questions ?? [];
console.log('items returned     :', items.length);
console.log('');

/* ------------------------------------------------- per-item verdicts ---- */

const seen = new Set();
const accepted = [];
const rejections = [];
const repairs = [];

for (const [index, rawItem] of items.entries()) {
  const label = `#${index + 1}`;
  const parsed = normaliseAiQuestion(rawItem, request, index);
  if (!parsed) {
    rejections.push({ label, reason: 'failed normalisation (schema/key/options)', stem: rawItem?.stem ?? '' });
    continue;
  }
  const repaired = repairNumericOptions(parsed);
  if (JSON.stringify(repaired.options) !== JSON.stringify(parsed.options)) {
    repairs.push({
      label,
      reason: 'colliding numeric options replaced',
      before: parsed.options.map((o) => o.text),
      after: repaired.options.map((o) => o.text)
    });
  }
  const issues = validateCandidate(repaired, seen);
  if (issues.length) {
    rejections.push({ label, reason: issues.join('; '), stem: repaired.stem.slice(0, 120) });
    continue;
  }
  seen.add(repaired.stem.replace(/\s+/g, ' ').trim().toLowerCase().slice(0, 90));
  accepted.push(repaired);
}

console.log('---- accepted ----');
console.log(`  ${accepted.length}/${items.length} survive validation unchanged`);
for (const [index, question] of accepted.entries()) {
  console.log(`\n  [${index + 1}] ${question.difficulty} · ${question.questionType} · ${question.topic}`);
  console.log(`      ${question.stem.replace(/\s+/g, ' ').slice(0, 220)}`);
  console.log(`      ${question.options.map((o) => `${o.id}:${o.text}`).join('  ')}`);
  console.log(`      key: ${question.correctOption}   unit: ${question.answerUnit ?? '-'}   steps: ${question.solutionSteps?.length ?? 0}`);
}

if (repairs.length) {
  console.log('\n---- repaired before validation ----');
  for (const repair of repairs) {
    console.log(`  ${repair.label}: ${repair.reason}`);
    console.log(`      was : ${repair.before.join('  ')}`);
    console.log(`      now : ${repair.after.join('  ')}`);
  }
}

if (rejections.length) {
  console.log('\n---- rejected ----');
  for (const rejection of rejections) {
    console.log(`  ${rejection.label}: ${rejection.reason}`);
    if (rejection.stem) console.log(`      ${rejection.stem.replace(/\s+/g, ' ')}…`);
  }
}

/* ------------------------------------------------------------- scoring --- */

const byKind = (kind) => accepted.filter((question) => question.questionType === kind).length;
const numericShaped = accepted.filter(
  (question) => question.questionType === 'NUMERICAL' && /^\s*[-₹\d(]/.test(question.options[0].text)
);
const yieldRate = items.length ? Math.round((accepted.length / items.length) * 100) : 0;

console.log('\n---- summary ----');
console.log(`  usable yield        : ${yieldRate}%  (${accepted.length}/${items.length})`);
console.log(`  kinds               : ${byKind('NUMERICAL')} numerical · ${byKind('FORMULA_RECALL')} recall · ${byKind('CONCEPTUAL')} conceptual`);
console.log(`  numerical options ok: ${numericShaped.length}/${byKind('NUMERICAL')}`);
console.log(
  `  difficulty          : ${accepted.filter((q) => q.difficulty === 'EASY').length} EASY / ${accepted.filter((q) => q.difficulty === 'MEDIUM').length} MEDIUM / ${accepted.filter((q) => q.difficulty === 'HARD').length} HARD`
);
console.log(`  with working steps  : ${accepted.filter((q) => (q.solutionSteps ?? []).length >= 2).length}/${accepted.length}`);
console.log(`  with a unit         : ${accepted.filter((q) => q.answerUnit).length}/${accepted.length}`);

writeFileSync(
  'live-ai-draft.json',
  JSON.stringify(
    {
      request,
      model: getActiveGeminiModel(),
      finishReason: getLastAiDiagnostics().finishReason,
      latencyMs,
      rawItems: items,
      accepted,
      rejections,
      repairs
    },
    null,
    2
  )
);
console.log('\n  raw payload + verdicts written to live-ai-draft.json');
