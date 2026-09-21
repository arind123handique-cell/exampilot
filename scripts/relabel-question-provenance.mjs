/**
 * Provenance relabelling (roadmap follow-up: "drop or qualify the pyqYear fields").
 *
 * The shipped corpus is *modelled* on exam patterns — it is not a set of verbatim
 * previous-year papers (the sources are standard textbooks, and the inline module
 * questions are explicitly labelled "Testbook Model"). Presenting a bare year as
 * though it were a real PYQ is a trust problem in a market where aspirants check.
 *
 * This pass adds, without reformatting the files:
 *   "sourceType":  "MODELLED" | "AI_GENERATED" | "PYQ"
 *   "questionType": "NUMERICAL" | "FORMULA_RECALL" | "CONCEPTUAL"
 *
 * It is surgical: fields are inserted after the unique `"id"` line of each object
 * (or before `"examSource"` for inline topic questions) so the surrounding
 * generated JSON keeps its exact formatting.
 *
 * Usage: node scripts/relabel-question-provenance.mjs [--dry] [--verbose]
 */
import { readFileSync, writeFileSync } from 'node:fs';

const DRY = process.argv.includes('--dry');
const VERBOSE = process.argv.includes('--verbose');

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
  return JSON.parse(source.slice(start, end));
};

/** Everything in the shipped bank is modelled — nothing is a verbatim PYQ. */
const SOURCE_TYPE = 'MODELLED';

const NUMERIC_OPTIONS = /^\s*[\d.]/;
const FORMULA_LOOKING = /[=√∫]|\bx\b|^[A-Za-z]+\s*[-/]\s*[A-Za-z]+\s*=/;

const classify = (q) => {
  const options = q.options ?? [];
  const numericOptions = options.filter((o) => NUMERIC_OPTIONS.test(String(o.text))).length;
  if (numericOptions >= 2) return 'FORMULA_RECALL';
  const answer = options.find((o) => o.id === q.correctOption)?.text ?? '';
  if (FORMULA_LOOKING.test(String(answer))) return 'FORMULA_RECALL';
  return 'CONCEPTUAL';
};

const escapes = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const report = [];

for (const [file, exportName, mode] of [
  ['src/data/civilQuestions.ts', 'CIVIL_ENGINEERING_QUESTIONS', 'id'],
  ['src/data/generalStudiesQuestions.ts', 'GENERAL_STUDIES_QUESTIONS', 'id'],
  ['src/data/topicKnowledge.ts', 'TOPIC_KNOWLEDGE_MODULES', 'examSource']
]) {
  const questions = readArray(file, exportName);
  let output = readFileSync(file, 'utf8');
  // Preserve the file's existing line endings (the corpus mixes CRLF and LF).
  const nl = output.includes('\r\n') ? '\r\n' : '\n';
  let inserted = 0;
  const tally = { NUMERICAL: 0, FORMULA_RECALL: 0, CONCEPTUAL: 0 };

  if (mode === 'examSource') {
    // Inline practice questions live inside modules. Anchor on the 8-space `"id"`
    // line rather than on `examSource`, because many questions share the *same*
    // examSource string and a first-occurrence replace would stack every
    // insertion onto one object (duplicate keys -> TS1117).
    const inline = questions.flatMap((m) => m.topicQuestions ?? []);
    for (const q of inline) tally[classify(q)] += 1;

    const lines = output.split(nl);
    const rebuilt = [];
    for (const line of lines) {
      rebuilt.push(line);
      if (/^ {8}"id": "/.test(line)) {
        rebuilt.push(`        "sourceType": "${SOURCE_TYPE}",`);
        inserted += 1;
      }
    }
    output = rebuilt.join(nl);
  } else {
    for (const q of questions) {
      const kind = classify(q);
      tally[kind] += 1;
      const needle = `    "id": "${q.id}",`;
      if (!output.includes(needle)) {
        console.warn(`  ! anchor not found for ${q.id}`);
        continue;
      }
      output = output.replace(
        needle,
        `${needle}${nl}    "sourceType": "${SOURCE_TYPE}",${nl}    "questionType": "${kind}",`
      );
      inserted += 1;
      if (VERBOSE) console.log(`  ${file} ${q.id} -> ${kind}`);
    }
  }

  if (!DRY) writeFileSync(file, output);
  report.push({ file, inserted, tally });
}

console.log(`${DRY ? '[dry run] ' : ''}provenance applied\n`);
for (const row of report) {
  console.log(`${row.file}`);
  console.log(
    `  labelled=${row.inserted}  formula-recall=${row.tally.FORMULA_RECALL}  conceptual=${row.tally.CONCEPTUAL}  numerical=${row.tally.NUMERICAL}`
  );
}
