import { readFileSync } from 'node:fs';

const readArray = (file, exportName) => {
  const source = readFileSync(file, 'utf8');
  const start = source.indexOf('[', source.indexOf('= [', source.indexOf(exportName)));
  let depth = 0;
  let end = -1;
  let inString = false;
  for (let i = start; i < source.length; i += 1) {
    const ch = source[i];
    if (inString) { if (ch === '\\') i += 1; else if (ch === '"') inString = false; continue; }
    if (ch === '"') inString = true;
    else if (ch === '[') depth += 1;
    else if (ch === ']') { depth -= 1; if (depth === 0) { end = i + 1; break; } }
  }
  return JSON.parse(source.slice(start, end));
};

const modules = readArray('src/data/topicKnowledge.ts', 'TOPIC_KNOWLEDGE_MODULES').filter(
  (m) => m.category === 'civil'
);
const civilQ = readArray('src/data/civilQuestions.ts', 'CIVIL_ENGINEERING_QUESTIONS');

console.log('########## ALL 36 BENCHMARK EXAMPLES (question + solution length) ##########');
let i = 0;
for (const m of modules) {
  for (const s of m.steps ?? []) {
    if (!s.benchmarkExample) continue;
    i += 1;
    const e = s.benchmarkExample;
    console.log(`\n[${i}] ${m.subject} / ${s.stepTitle}`);
    console.log(`Q: ${e.question}`);
    console.log(`   steps=${(e.stepByStepSolution ?? []).length}`);
  }
}

console.log('\n\n########## 12 INLINE topicQuestions ##########');
let j = 0;
for (const m of modules) {
  for (const q of m.topicQuestions ?? []) {
    j += 1;
    if (j > 12) break;
    console.log(`\n[${j}] ${m.subject} | ${q.difficulty} | ${q.examSource ?? '-'}`);
    console.log(`Q: ${q.stem}`);
    console.log(`O: ${(q.options ?? []).map((o) => o.text).join(' | ')}`);
    console.log(`A: ${q.correctOption}`);
  }
  if (j > 12) break;
}

console.log('\n\n########## 6 civil MCQ stems in full ##########');
for (const q of civilQ.slice(20, 26)) {
  console.log(`\n[${q.subject} | ${q.difficulty} | ${q.pyqYear ?? '-'}]`);
  console.log(`Q: ${q.stem}`);
  console.log(`O: ${q.options.map((o) => `${o.id}) ${o.text}`).join('   ')}`);
  console.log(`formulaContext: ${q.formulaContext ?? '-'}`);
}
