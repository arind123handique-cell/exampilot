/**
 * Phase 1.9 — Design System v2 token migration.
 *
 * Rewrites legacy Tailwind palette utilities (bg-white, text-slate-500,
 * border-academic-border, …) in JSX className strings to semantic tokens
 * (bg-card, text-muted, border-line, …) so components theme themselves and the
 * temporary dark-mode bridge in src/index.css can be deleted.
 *
 * Notes
 * - Single pass over one combined regex, so replacements never cascade.
 * - Alternation is sorted longest-first because JS alternation is first-match.
 * - `(?![0-9a-zA-Z/-])` stops a short token from matching a longer one
 *   (e.g. `bg-indigo-50` must not consume `bg-indigo-500` or `bg-indigo-50/40`).
 * - Raw palette classes that are intentionally theme-independent (solid
 *   saturated accents on brand surfaces, translucent white overlays on
 *   gradients) are deliberately NOT mapped.
 *
 * Usage: node scripts/migrate-design-tokens.mjs [--dry]
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';

const MAP = {
  /* ---- gradient stops ---- */
  'from-indigo-50/80': 'from-primary-fixed/80',
  'to-sky-50/80': 'to-info-surface/80',
  'to-indigo-700': 'to-primary-dark',
  'to-indigo-400': 'to-primary-light',

  /* ---- inverted panels: code blocks, dark CTAs, overlays ---- */
  'bg-slate-900/60': 'bg-black/60',
  'bg-slate-900': 'bg-inverse',
  'bg-slate-800': 'bg-inverse-hover',
  'border-slate-800': 'border-inverse-line',

  /* ---- white surfaces ---- */
  'bg-white/95': 'bg-card/95',
  'bg-white/60': 'bg-card/60',
  'bg-white': 'bg-card',
  'bg-surface': 'bg-canvas',

  /* ---- neutral fills ---- */
  'bg-slate-50/80': 'bg-subtle/80',
  'bg-slate-50/70': 'bg-subtle/70',
  'bg-slate-50/50': 'bg-subtle/50',
  'bg-slate-50': 'bg-subtle',
  'bg-slate-100/70': 'bg-subtle-strong/70',
  'bg-slate-100': 'bg-subtle-strong',
  'bg-slate-200/80': 'bg-line/80',
  'bg-slate-200/70': 'bg-line/70',
  'bg-slate-200/60': 'bg-line/60',
  'bg-slate-200': 'bg-line',
  'bg-slate-300': 'bg-line-strong',

  /* ---- brand fills ---- */
  'bg-indigo-50/60': 'bg-primary-fixed',
  'bg-indigo-50/50': 'bg-primary-fixed',
  'bg-indigo-50/40': 'bg-primary-fixed',
  'bg-indigo-50/30': 'bg-primary-fixed',
  'bg-indigo-50/20': 'bg-primary-fixed',
  'bg-indigo-50': 'bg-primary-fixed',
  'bg-indigo-100/50': 'bg-primary-fixed',
  'bg-indigo-100': 'bg-primary-fixed',
  'bg-indigo-700': 'bg-primary-dark',
  'bg-indigo-600': 'bg-primary',
  'bg-indigo-500': 'bg-primary-light',

  /* ---- status fills ---- */
  'bg-emerald-50/80': 'bg-success-surface',
  'bg-emerald-50/70': 'bg-success-surface',
  'bg-emerald-50/40': 'bg-success-surface',
  'bg-emerald-50': 'bg-success-surface',
  'bg-emerald-100/90': 'bg-success-surface',
  'bg-emerald-100/80': 'bg-success-surface',
  'bg-emerald-100/70': 'bg-success-surface',
  'bg-emerald-100': 'bg-success-surface',
  'bg-rose-50/80': 'bg-danger-surface',
  'bg-rose-50/30': 'bg-danger-surface',
  'bg-rose-50': 'bg-danger-surface',
  'bg-rose-100/90': 'bg-danger-surface',
  'bg-rose-100': 'bg-danger-surface',
  'bg-amber-50/70': 'bg-warning-surface',
  'bg-amber-50': 'bg-warning-surface',
  'bg-amber-100': 'bg-warning-surface',
  'bg-sky-50': 'bg-info-surface',

  /* ---- exact-match status accents (Tailwind 500 == token DEFAULT) ---- */
  'bg-emerald-500': 'bg-success',
  'bg-rose-500': 'bg-danger',
  'bg-amber-500': 'bg-warning',
  'bg-sky-500': 'bg-info',
  'fill-amber-500': 'fill-warning',

  /* ---- secondary accent (merged into brand) ---- */
  'bg-purple-100': 'bg-primary-fixed',
  'bg-purple-50': 'bg-primary-fixed',
  'bg-purple-700': 'bg-primary-dark',
  'bg-purple-600': 'bg-primary',
  'bg-purple-500': 'bg-primary-light',

  /* ---- text ---- */
  'text-on-surface': 'text-ink',
  'text-slate-900': 'text-ink',
  'text-slate-800': 'text-ink',
  'text-slate-700': 'text-ink-soft',
  'text-slate-600': 'text-ink-soft',
  'text-slate-500': 'text-muted',
  'text-slate-400': 'text-muted-faint',
  'text-slate-300': 'text-muted-faint',
  'text-indigo-900': 'text-primary',
  'text-indigo-800': 'text-primary',
  'text-indigo-700': 'text-primary',
  'text-indigo-600': 'text-primary',
  'text-indigo-500': 'text-primary',
  'text-emerald-950': 'text-success-text',
  'text-emerald-900': 'text-success-text',
  'text-emerald-800': 'text-success-text',
  'text-emerald-700': 'text-success-text',
  'text-emerald-600': 'text-success-text',
  'text-emerald-500': 'text-success',
  'text-rose-950': 'text-danger-text',
  'text-rose-900': 'text-danger-text',
  'text-rose-800': 'text-danger-text',
  'text-rose-700': 'text-danger-text',
  'text-rose-600': 'text-danger-text',
  'text-rose-500': 'text-danger',
  'text-amber-900': 'text-warning-text',
  'text-amber-800': 'text-warning-text',
  'text-amber-700': 'text-warning-text',
  'text-amber-600': 'text-warning-text',
  'text-amber-500': 'text-warning-text',
  'text-sky-700': 'text-info-text',
  'text-purple-800': 'text-primary',
  'text-purple-700': 'text-primary',
  'text-purple-600': 'text-primary',
  'text-purple-400': 'text-primary-light',
  'placeholder-slate-400': 'placeholder-muted-faint',

  /* ---- borders ---- */
  'border-academic-border-subtle': 'border-line-strong',
  'border-academic-border': 'border-line',
  'border-slate-200/80': 'border-line',
  'border-slate-200/60': 'border-line',
  'border-slate-200': 'border-line',
  'border-slate-100': 'border-line',
  'border-slate-300': 'border-line-strong',
  'border-indigo-100': 'border-primary-fixed-dim',
  'border-indigo-200': 'border-primary-fixed-dim',
  'border-indigo-300': 'border-primary-fixed-dim',
  'border-indigo-400': 'border-primary-fixed-dim',
  'border-indigo-500/40': 'border-primary/40',
  'border-indigo-500': 'border-primary',
  'border-indigo-600': 'border-primary',
  'border-emerald-200': 'border-success-border',
  'border-emerald-300': 'border-success-border',
  'border-emerald-500': 'border-success-border',
  'border-amber-100': 'border-warning-border',
  'border-amber-200': 'border-warning-border',
  'border-amber-300': 'border-warning-border',
  'border-rose-200': 'border-danger-border',
  'border-rose-300': 'border-danger-border',
  'border-rose-400': 'border-danger-border',
  'border-rose-500': 'border-danger-border',
  'border-sky-200': 'border-info-border',
  'border-purple-200': 'border-primary-fixed-dim',
  'border-purple-300': 'border-primary-fixed-dim',
  'border-purple-400': 'border-primary-fixed-dim',

  /* ---- icon fills / strokes ---- */
  'fill-indigo-700': 'fill-primary',
  'fill-indigo-600': 'fill-primary',
  'fill-indigo-200': 'fill-primary-fixed-dim',
  'fill-indigo-100': 'fill-primary-fixed-dim',
  'fill-slate-500': 'fill-muted',
  'fill-slate-100': 'fill-line',
  'stroke-slate-300': 'stroke-line-strong',
  'stroke-indigo-400': 'stroke-primary-light',

  /* ---- rings & shadows ---- */
  'ring-indigo-100': 'ring-primary-fixed-dim',
  'shadow-indigo-600/20': 'shadow-primary/20',
  'shadow-purple-600/20': 'shadow-primary/20',

  /* ---- legacy aliases ---- */
  'academic-border-subtle': 'line-strong',
  'academic-border': 'line',
  'academic-muted': 'muted',
  'academic-ink': 'ink',
  'academic-card': 'card'
};

const tokens = Object.keys(MAP).sort((a, b) => b.length - a.length);
const pattern = new RegExp(`(${tokens.map((t) => t.replace(/[/]/g, '\\/')).join('|')})(?![0-9a-zA-Z/-])`, 'g');

const dryRun = process.argv.includes('--dry');

const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (extname(full) === '.tsx') out.push(full);
  }
  return out;
};

let totalHits = 0;
const touched = [];

for (const file of walk('src')) {
  const before = readFileSync(file, 'utf8');
  let hits = 0;
  const after = before.replace(pattern, (match) => {
    hits += 1;
    return MAP[match];
  });

  if (hits > 0) {
    totalHits += hits;
    touched.push([file, hits]);
    if (!dryRun) writeFileSync(file, after);
  }
}

touched.sort((a, b) => b[1] - a[1]);
for (const [file, hits] of touched) console.log(String(hits).padStart(5), file);
console.log(`\n${dryRun ? '[dry run] ' : ''}${totalHits} replacements across ${touched.length} files`);
