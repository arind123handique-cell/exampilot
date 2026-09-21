/**
 * Phase 1.9d — convert hand-rolled card wrappers to the <Card> primitive.
 *
 * A `div` is treated as a card when its className contains, as standalone
 * tokens, `bg-card` + `border` + a `rounded-*` radius + `border-line`
 * (i.e. exactly what <Card variant="default"> already renders).
 *
 * Such an element becomes `<Card flush className="…">`, where `flush` disables
 * Card's default padding so the page keeps its own deliberate padding — this
 * matters because `p-6` next to Card's `p-4 sm:p-5` would lose at the `sm`
 * breakpoint (media-query utilities follow base utilities in Tailwind's order).
 * Redundant surface/border/radius/shadow classes are stripped; everything else
 * (layout, position, interaction, hover) is preserved verbatim.
 *
 * The scanner is a small JSX-aware tokenizer rather than a regex, because the
 * closing `</div>` must be matched by nesting depth — and a naive regex cannot
 * do that across `{items.map(…)}` expressions. It tracks strings, template
 * literals, comments and brace depth only for the purpose of finding tag ends.
 *
 * Usage: node scripts/migrate-cards-to-primitives.mjs [--dry] [--verbose]
 */
import { readFileSync, writeFileSync } from 'node:fs';

const FILES = [
  'src/pages/SyllabusExplorerPage.tsx',
  'src/pages/MockTestPage.tsx',
  'src/pages/McqPracticePage.tsx',
  'src/pages/AiIngestionStudioPage.tsx',
  'src/pages/OnboardingPage.tsx',
  'src/pages/PyqArchivePage.tsx',
  'src/pages/AiTutorPage.tsx'
];

const DRY = process.argv.includes('--dry');
const VERBOSE = process.argv.includes('--verbose');

/** Classes that <Card variant="default" flush> already provides. */
const STRIP = new Set([
  'bg-card',
  'border',
  'border-line',
  'border-academic-border',
  'shadow-sm',
  'shadow',
  'shadow-md',
  'shadow-card'
]);

const isRadius = (token) => /^rounded(-(none|sm|md|lg|xl|2xl|3xl|full))?$/.test(token);

/** Container-scale radius. `rounded` / `rounded-md` are chip scale, not card scale. */
const isContainerRadius = (token) => /^rounded-(lg|xl|2xl|3xl)$/.test(token);

const isCardClassName = (className) => {
  const tokens = className.split(/\s+/);
  return (
    tokens.includes('bg-card') &&
    tokens.includes('border') &&
    tokens.some(isContainerRadius) &&
    // Monospace chips (`Q.12`, clause numbers) are inline code, not cards.
    !tokens.includes('font-mono') &&
    (tokens.includes('border-line') || tokens.includes('border-academic-border'))
  );
};

const lineOf = (source, index) => source.slice(0, index).split('\n').length;

/** Scan a JSX file for card elements, recording both tag spans. */
function findCardsWithClose(source) {
  const results = [];
  const stack = [];
  let i = 0;

  while (i < source.length) {
    const ch = source[i];
    const next = source[i + 1];

    if (ch === '/' && next === '/') { i = source.indexOf('\n', i); if (i === -1) break; continue; }
    if (ch === '/' && next === '*') { const e = source.indexOf('*/', i + 2); i = e === -1 ? source.length : e + 2; continue; }
    if (ch === '"' || ch === "'" || ch === '`') {
      const quote = ch; i += 1;
      while (i < source.length) {
        if (source[i] === '\\') i += 2;
        else if (source[i] === quote) { i += 1; break; }
        else i += 1;
      }
      continue;
    }

    const isClose = source.startsWith('</div', i);
    const isOpen = !isClose && source.startsWith('<div', i) && /[\s/>]/.test(source[i + 4] ?? '');
    if (!isClose && !isOpen) { i += 1; continue; }

    let j = i + (isClose ? 5 : 4);
    let braceDepth = 0;
    let selfClosing = false;
    while (j < source.length) {
      const c = source[j];
      if (c === '"' || c === "'" || c === '`') {
        const quote = c; j += 1;
        while (j < source.length) {
          if (source[j] === '\\') j += 2;
          else if (source[j] === quote) { j += 1; break; }
          else j += 1;
        }
        continue;
      }
      if (c === '{') braceDepth += 1;
      else if (c === '}') braceDepth -= 1;
      else if (c === '>' && braceDepth === 0) { selfClosing = source[j - 1] === '/'; break; }
      j += 1;
    }
    const tagEnd = j + 1;

    if (isClose) {
      const open = stack.pop();
      if (open?.convertible) { open.closeStart = i; open.closeEnd = tagEnd; results.push(open); }
      i = tagEnd;
      continue;
    }

    const tag = source.slice(i, tagEnd);
    const classMatch = tag.match(/className="([^"{]*)"/);
    const convertible = !selfClosing && Boolean(classMatch) && isCardClassName(classMatch[1]);
    if (selfClosing) { i = tagEnd; continue; }
    stack.push({
      convertible,
      className: classMatch ? classMatch[1] : null,
      rawTag: tag,
      openStart: i,
      openEnd: tagEnd,
      closeStart: null,
      closeEnd: null,
      line: lineOf(source, i)
    });
    i = tagEnd;
  }

  return { results };
}

/** Superseded first attempt — kept out of the pipeline. */
function _unusedFindCards(source) {
  const found = [];
  const stack = [];
  let i = 0;

  while (i < source.length) {
    const ch = source[i];
    const next = source[i + 1];

    // Skip comments and string-ish regions so tag-like text inside them is ignored.
    if (ch === '/' && next === '/') {
      i = source.indexOf('\n', i);
      if (i === -1) break;
      continue;
    }
    if (ch === '/' && next === '*') {
      const end = source.indexOf('*/', i + 2);
      i = end === -1 ? source.length : end + 2;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      const quote = ch;
      i += 1;
      while (i < source.length) {
        if (source[i] === '\\') i += 2;
        else if (source[i] === quote) { i += 1; break; }
        else i += 1;
      }
      continue;
    }

    // A div open or close tag?
    const isClose = source.startsWith('</div', i);
    const isOpen = !isClose && source.startsWith('<div', i) && /[\s/>]/.test(source[i + 4] ?? '');

    if (!isClose && !isOpen) {
      i += 1;
      continue;
    }

    // Walk to the end of the tag, respecting nested braces and quotes.
    let j = i + (isClose ? 5 : 4);
    let braceDepth = 0;
    let selfClosing = false;
    while (j < source.length) {
      const c = source[j];
      if (c === '"' || c === "'" || c === '`') {
        const quote = c;
        j += 1;
        while (j < source.length) {
          if (source[j] === '\\') j += 2;
          else if (source[j] === quote) { j += 1; break; }
          else j += 1;
        }
        continue;
      }
      if (c === '{') braceDepth += 1;
      else if (c === '}') braceDepth -= 1;
      else if (c === '>' && braceDepth === 0) {
        selfClosing = source[j - 1] === '/';
        break;
      }
      j += 1;
    }
    const tagEnd = j + 1;

    if (isClose) {
      const open = stack.pop();
      if (open?.convertible) found.push(open);
      i = tagEnd;
      continue;
    }

    // Extract a plain (non-template) className attribute, if any.
    const tag = source.slice(i, tagEnd);
    const classMatch = tag.match(/className="([^"{]*)"/);
    const convertible = !selfClosing && Boolean(classMatch) && isCardClassName(classMatch[1]);

    stack.push({
      convertible,
      openStart: i,
      openEnd: tagEnd,
      className: classMatch ? classMatch[1] : null,
      line: lineOf(source, i),
      closeStart: null
    });

    if (selfClosing) stack.pop();
    else if (convertible) {
      const entry = stack[stack.length - 1];
      // closing tag position is recorded when popped, so stash the entry
      entry.pending = true;
      closingPositions.set(entry, null);
    }
    i = tagEnd;
  }

  // Second pass is unnecessary: record close offsets while popping instead.
  return found;
}

let totalCards = 0;
const needsImport = [];

for (const file of FILES) {
  const source = readFileSync(file, 'utf8');
  const { results } = findCardsWithClose(source);

  if (results.length === 0) {
    console.log(`   0  ${file}`);
    continue;
  }

  const edits = [];
  for (const card of results) {
    const kept = card.className.split(/\s+/).filter((t) => t && !STRIP.has(t) && !isRadius(t));
    const className = kept.join(' ');

    // Preserve every other attribute on the tag (onClick, style, ref, aria-*,
    // spread props …). Only the element name and className are rewritten.
    const otherAttributes = card.rawTag
      .replace(/^<div/, '') // element name
      .replace(/className="[^"]*"/, '') // the attribute we rewrite
      .replace(/\s+/g, ' ') // collapse the resulting gaps
      .replace(/>$/, '') // closing bracket
      .trim();

    const openTag = `<Card flush${className ? ` className="${className}"` : ''}${
      otherAttributes ? ` ${otherAttributes}` : ''
    }>`;

    edits.push({ start: card.openStart, end: card.openEnd, text: openTag });
    edits.push({ start: card.closeStart, end: card.closeEnd, text: '</Card>' });

    if (VERBOSE) {
      console.log(`\n${file}:${card.line}`);
      console.log(`  - ${card.rawTag}`);
      console.log(`  + ${openTag}`);
    }
  }

  // Apply back-to-front so earlier offsets stay valid.
  edits.sort((a, b) => b.start - a.start);
  let output = source;
  for (const edit of edits) {
    output = output.slice(0, edit.start) + edit.text + output.slice(edit.end);
  }

  const openCount = (output.match(/<Card flush/g) || []).length;
  const closeCount = (output.match(/<\/Card>/g) || []).length;
  if (openCount !== closeCount) {
    throw new Error(`${file}: unbalanced Card tags (${openCount} open / ${closeCount} close) — aborting`);
  }

  const hasCardImport = /from '\.\.\/components\/ui\/Card'/.test(output);
  if (!hasCardImport) needsImport.push(file);

  totalCards += results.length;
  console.log(`${String(results.length).padStart(5)}  ${file}`);
  if (!DRY) writeFileSync(file, output);
}

console.log(`\n${DRY ? '[dry run] ' : ''}${totalCards} card wrappers converted`);
if (needsImport.length) {
  console.log('\nFiles missing the Card import (add manually):');
  for (const file of needsImport) console.log(' -', file);
}
