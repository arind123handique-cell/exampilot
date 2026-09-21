/**
 * Why did the raw AI response fail to parse?
 *
 * `live-ai-draft.mjs` writes the raw model output to `live-ai-raw.txt` whenever it
 * cannot be parsed. This explains the failure precisely, because the classes of
 * damage need different fixes and they look identical from the error message:
 *
 *   1. truncated      — valid prefix, cut off mid-object (MAX_TOKENS)
 *   2. control chars  — literal newlines inside string values (repairable)
 *   3. quote damage   — an unescaped quote destroys the structure (not repairable)
 *   4. trailing prose — JSON followed by commentary (sliceable)
 *   5. wrapper prose  — commentary around the JSON (fence/slice extraction)
 *
 * Usage: node scripts/diagnose-raw-ai.mjs [path]
 */
import { readFileSync } from 'node:fs';

const path = process.argv[2] ?? 'live-ai-raw.txt';
const text = readFileSync(path, 'utf8');

const ESCAPE = String.fromCharCode(92);

/** The shipped repair, mirrored here so the diagnosis reflects the real code. */
const escapeControlCharsInStrings = (input) => {
  let out = '';
  let inString = false;
  let escaped = false;
  for (const character of input) {
    if (escaped) {
      out += character;
      escaped = false;
      continue;
    }
    if (character === ESCAPE) {
      out += character;
      escaped = true;
      continue;
    }
    if (character === '"') {
      inString = !inString;
      out += character;
      continue;
    }
    if (inString) {
      const code = character.charCodeAt(0);
      if (character === '\n') { out += ESCAPE + 'n'; continue; }
      if (character === '\r') { out += ESCAPE + 'r'; continue; }
      if (character === '\t') { out += ESCAPE + 't'; continue; }
      if (code < 32) { out += ESCAPE + 'u' + code.toString(16).padStart(4, '0'); continue; }
    }
    out += character;
  }
  return out;
};

const tryParse = (candidate) => {
  try {
    return { ok: true, value: JSON.parse(candidate) };
  } catch (error) {
    return { ok: false, error: error.message };
  }
};

console.log(`file: ${path}`);
console.log(`size: ${text.length} chars, ${text.split('\n').length} lines`);
console.log('');

const direct = tryParse(text);
console.log('1. parses as-is          :', direct.ok ? 'YES' : `no — ${direct.error.slice(0, 110)}`);

const repairedText = escapeControlCharsInStrings(text);
const repaired = tryParse(repairedText);
console.log('2. after control-char fix:', repaired.ok ? 'YES' : `no — ${repaired.error.slice(0, 110)}`);

const start = text.search(/[[{]/);
const end = Math.max(text.lastIndexOf(']'), text.lastIndexOf('}'));
const sliced = start !== -1 && end > start ? text.slice(start, end + 1) : '';
const slicedFixed = tryParse(sliced);
const sliceRepaired = tryParse(escapeControlCharsInStrings(sliced));
console.log(
  '3. first{ … last} slice  :',
  slicedFixed.ok ? 'YES' : sliceRepaired.ok ? 'YES after control-char fix' : `no — ${(slicedFixed.error ?? '').slice(0, 90)}`
);

/* ---- structural damage report ---- */

let inString = false;
let escaped = false;
let quotes = 0;
let rawControlInString = 0;
let depth = 0;
let maxDepth = 0;

for (const character of text) {
  if (escaped) { escaped = false; continue; }
  if (character === ESCAPE) { escaped = true; continue; }
  if (character === '"') { quotes += 1; inString = !inString; continue; }
  if (inString) {
    if (character === '\n' || character === '\r' || character === '\t' || character.charCodeAt(0) < 32) {
      rawControlInString += 1;
    }
    continue;
  }
  if (character === '{' || character === '[') { depth += 1; maxDepth = Math.max(maxDepth, depth); }
  if (character === '}' || character === ']') depth -= 1;
}

console.log('');
console.log('---- structural damage ----');
console.log(`quotes                 : ${quotes} (${quotes % 2 === 0 ? 'balanced' : 'UNBALANCED — structure broken beyond JSON repair'})`);
console.log(`ends inside a string   : ${inString ? 'YES' : 'no'}`);
console.log(`unclosed brackets      : ${depth > 0 ? depth + ' — response was truncated' : 'none'}`);
console.log(`max nesting depth      : ${maxDepth}`);
console.log(`raw control chars in strings : ${rawControlInString}`);

/* ---- leakage report ---- */

const LEAK = /(let me (re-?read|reconsider|think|check|try)|i cannot (generate|provide|create)|as an ai\b|the prompt (says|asks|requires)|wait,|hmm,|let's (check|verify|reconsider)|i need to (make sure|ensure)|this is a critical point)/gi;
const leaks = text.match(LEAK) ?? [];
console.log(`model reasoning leaks  : ${leaks.length}${leaks.length ? ` — ${[...new Set(leaks.map((l) => l.toLowerCase()))].slice(0, 6).join(' | ')}` : ''}`);

const tail = text.slice(Math.max(0, end + 1)).trim();
console.log(`trailing prose after JSON: ${tail ? `${tail.length} chars — ${JSON.stringify(tail.slice(0, 90))}…` : 'none'}`);

const heads = text.slice(0, start).trim();
console.log(`prose before JSON      : ${heads ? JSON.stringify(heads.slice(0, 90)) : 'none'}`);

console.log('');
console.log('---- verdict ----');
if (direct.ok) console.log('  The payload is fine; the failure was in the caller.');
else if (repaired.ok || sliceRepaired.ok) console.log('  Repairable: the shipped extractor should have handled this — check its fallback order.');
else if (quotes % 2 !== 0) console.log('  Unrecoverable: an unescaped quote broke the structure. Retry the batch; a smaller batch is less likely to leak.');
else if (depth > 0) console.log('  Truncated: raise the output budget or reduce the batch size.');
else console.log('  Damaged in a way this tool does not classify — inspect the raw file.');
