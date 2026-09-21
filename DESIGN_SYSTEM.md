# ExamPilot AI — Design System v2

> Supersedes the original Stitch theme export (kept below in §7 for reference).
> Source of truth for tokens is [`src/index.css`](src/index.css) + [`tailwind.config.js`](tailwind.config.js).

## 1. Principles

1. **Tokens, never raw colours.** Components reference semantic tokens (`bg-card`, `text-muted`,
   `border-line`). A raw palette class like `text-slate-500` is a bug — it cannot theme itself.
2. **Two themes from one source.** Light and dark differ only in token values, never in markup.
3. **Density with air.** Exam prep is information-dense, but every panel gets a real heading, a real
   next action, and enough padding to breathe.
4. **Every state is designed.** Loading, empty, error and success all have a representation:
   `Skeleton`, `EmptyState`, toasts, and semantic badges.
5. **Reachable one-handed.** Primary destinations live in a bottom bar on mobile; nothing critical sits
   behind a hamburger.
6. **Keyboard is a first-class input.** `⌘K` / `Ctrl+K` reaches every module; focus is always visible.

## 2. Colour tokens

Defined as space-separated RGB channels so Tailwind can compose alpha —
`rgb(var(--ink) / <alpha-value>)` — which keeps `bg-card/80` and friends working.

| Token | Utility | Light | Dark | Use |
|---|---|---|---|---|
| `--bg-canvas` | `bg-canvas` | `#f6f7fb` | `#070b14` | App background |
| `--bg-surface` | `bg-card` | `#ffffff` | `#0f1522` | Cards, sidebar, header |
| `--bg-raised` | `bg-raised` | `#fafbfe` | `#151c2c` | Popovers, menus, dropdowns |
| `--bg-subtle` | `bg-subtle` | `#f1f5f9` | `#161d2c` | Inset panels, hover fills |
| `--bg-subtle-2` | `bg-subtle-strong` | `#e2e8f0` | `#1f283b` | Track fills, pressed states |
| `--line` | `border-line` | `#e2e8f0` | `#242d40` | Hairline borders |
| `--line-strong` | `border-line-strong` | `#cbd5e1` | `#34415c` | Emphasis borders, dashed empties |
| `--ink` | `text-ink` | `#0b1c30` | `#e8edf7` | Primary text |
| `--ink-2` | `text-ink-soft` | `#1e293b` | `#cbd5e1` | Secondary text |
| `--muted` | `text-muted` | `#64748b` | `#8b98ad` | Labels, meta |
| `--muted-faint` | `text-muted-faint` | `#94a3b8` | `#6a7689` | Captions, hints |
| `--accent` | `bg-primary` / `text-primary` | `#4f46e5` | `#6366f1` | Brand, primary actions |
| `--accent-strong` | `bg-primary-dark` | `#3525cd` | `#4f46e5` | Hover/pressed brand |
| `--accent-soft` | `bg-primary-fixed` | `#eef2ff` | `#1b2238` | Selected nav, soft chips |
| `--accent-soft-line` | `border-primary-fixed-dim` | `#c7d2fe` | `#344068` | Soft chip borders |
| `--bg-inverse` | `bg-inverse` | `#0f172a` | `#2a3548` | Code blocks, dark CTAs, user chat bubbles |
| `--bg-inverse-hover` | `bg-inverse-hover` | `#1e293b` | `#37445a` | Hover/pressed on inverted panels |
| `--line-inverse` | `border-inverse-line` | `#334155` | `#475569` | Borders on inverted panels |
| `--ok-soft` / `--ok-line` / `--ok-ink` | `bg-success-surface` / `border-success-border` / `text-success-text` | `#ecfdf5` / `#a7f3d0` / `#059669` | dark greens | Success panels & text |
| `--warn-soft` / `--warn-line` / `--warn-ink` | `bg-warning-surface` / `border-warning-border` / `text-warning-text` | `#fffbeb` / `#fde68a` / `#b45309` | dark ambers | Warning panels & text |
| `--bad-soft` / `--bad-line` / `--bad-ink` | `bg-danger-surface` / `border-danger-border` / `text-danger-text` | `#fff1f2` / `#fecdd3` / `#be123c` | dark roses | Error panels & text |
| `--info-soft` / `--info-line` / `--info-ink` | `bg-info-surface` / `border-info-border` / `text-info-text` | `#f0f9ff` / `#bae6fd` / `#0369a1` | dark skies | Informational panels & text |
| `--shadow` | `shadow-card`, `shadow-pop` | `#0f172a` | `#000000` | Elevation tint |

`success` / `warning` / `danger` / `info` each expose `DEFAULT` (solid accent, for bars and dots),
`surface`, `border` and `text` — use the `text` variant on the `surface` fill so contrast holds in both
themes.

Legacy aliases (`surface`, `on-surface`, `academic.*`, `primary.*`) are mapped onto the same variables
so unmigrated screens still theme correctly.

## 3. Typography

- **Display** — Geist: screen titles, metric values, section headings. `font-display`.
- **Body** — Inter: prose, labels, controls. `font-sans` (default).
- **Numbers** — always `.tabular-nums` for scores, timers, percentages and streak counts so digits
  do not shift as values change.

Scale in use: `text-2xl` screen title · `text-sm/base` section title · `text-xs` body/controls in dense
panels · `text-[11px]` meta · `text-[10px]` uppercase eyebrows (`tracking-wider`, `font-semibold`).

## 4. Shape, spacing & elevation

- Radii: `rounded-lg` (chips/inputs), `rounded-xl` (buttons, list rows), `rounded-2xl` (cards, dialogs),
  `rounded-full` (badges, avatars).
- Spacing rhythm: 4 / 8 / 12 / 16 / 20 / 24 px. Card padding `p-4 sm:p-5`; page padding `p-4 sm:p-6 lg:p-7`.
- Elevation is tokenised and theme-aware: `shadow-card` (resting), `shadow-card-hover` (hover),
  `shadow-pop` (menus/dialogs). Never hand-write a box-shadow; dark mode re-maps these automatically.
- Minimum hit target 40×40px (`Button` `md`/`icon` sizes); 44px on the mobile bottom bar.

## 5. Components (`src/components/ui/`)

Screens rebuilt on primitives: **Study Plan** (`StudyPlanPage`) and **Progress Analytics**
(`ProgressAnalyticsPage`). Every screen now uses `<Card>`, `<Badge>` and `<EmptyState>` where those shapes
occur — 34 card wrappers and 12 badges were converted by `scripts/migrate-cards-to-primitives.mjs`, a
JSX-aware codemod that matches closing tags by nesting depth and preserves every other attribute on the tag.
Residual hand-rolled buttons are the remaining conversion target.

**Not every pill is a badge.** Before reaching for `<Badge>`, check which shape you actually have:

| Shape | Example | Primitive |
|---|---|---|
| Status/label pill | `HARD`, `High Yield`, `Step-by-Step Mode` | `<Badge>` |
| Inline code chip | `Q.12`, `IS 456 Cl. 26.2`, `PYQ 2019` | *none yet* — monospace span; a `CodeChip` primitive is the eventual home |
| Eyebrow label | `OVERALL READINESS` | plain span, no background |
| Legend dot + label | `● Strong` | coloured `h-2 w-2 rounded-full` span |
| Metric chip | `+14 marks`, `12 ESE MCQs` | `<Badge caps={false}>` or a `<StatTile>` if it is a headline number |

Badge forces uppercase by default, so pass `caps={false}` for sentence-case content — otherwise “Accuracy
33%” renders as “ACCURACY 33%”.

| Component | Variants / notes |
|---|---|
| `Card` (+ `CardHeader`) | `default · raised · interactive · plain`, `flush` to opt out of padding |
| `Button` | `primary · secondary · outline · ghost · danger · success` × `sm · md · lg · icon`, `loading`, `fullWidth`, `icon`/`iconRight` |
| `Badge` (+ `WeightageBadge`, `StatusBadge`) | tones `neutral · subtle · brand · success · warning · danger · info`; sizes `xs · sm · md`; `caps` (uppercase + letter-spacing, default on) and `bordered` (hairline, default on) can be switched off for sentence-case or flat chips. `WeightageBadge` maps syllabus weightage for you; `StatusBadge` maps a status string + tone map |
| `ProgressRing` | SVG dial with `brand · success · warning · danger` tones and caption |
| `Skeleton` / `PageSkeleton` | Shimmering placeholders; `PageSkeleton` = whole-dashboard skeleton |
| `EmptyState` | Icon + title + description + one or two actions. Required on every empty surface |
| `StatTile` | Label, value+unit, optional progress bar and hint — the dashboard building block |
| `ThemeToggle` | Click to flip light/dark; right-click or ArrowDown opens the light · dark · system menu |

Compose with `cx()` from `src/utils/cn.ts`.

## 6. Theming mechanics

- `ThemeProvider` (`src/context/ThemeContext.tsx`) resolves `light | dark | system`, persists the choice
  to `localStorage['exampilot.theme']`, listens for OS changes while in `system`, and mirrors the result
  to `<html data-theme="light|dark">`.
- An inline script in `index.html` applies the persisted theme **before first paint** — no flash.
- Tailwind is configured with `darkMode: ['class', '[data-theme="dark"]']`, so `dark:` variants also work
  where a token cannot express the intent.
- `prefers-reduced-motion` globally collapses animation and transition durations.

### Migration (complete for colour tokens)

All screens were converted from raw palette utilities to semantic tokens by
`scripts/migrate-design-tokens.mjs` (1,200 replacements across 14 files) — a single-pass, boundary-safe
rewriter that refuses to let a short token consume a longer one (`bg-indigo-50` never eats
`bg-indigo-500`). The temporary dark-mode bridge in `src/index.css` was deleted once the sweep finished.

Re-run with `node scripts/migrate-design-tokens.mjs --dry` to audit; add new mappings to `MAP` if the
palette ever creeps back in.

**Raw palette classes are allowed only where the colour is intentionally theme-independent:**

- solid saturated accents on brand surfaces — `bg-emerald-600`, `bg-rose-700`, `bg-amber-600`
- light tints that must stay light on a dark panel — `text-indigo-200`, `text-emerald-300`
- translucent white over brand gradients — `bg-white/20`, `border-white/30`, `text-white/75`
- page scrims — `bg-black/60`

Everything else must be a token. Two consolidation notes from the sweep: neutral fills collapsed from
four Tailwind greys to two (`bg-subtle`, `bg-subtle-strong`), and secondary text is now three levels
(`text-ink-soft`, `text-muted`, `text-muted-faint`) instead of four.

## 7. Original Stitch / Material theme (reference only)

- Theme name: *Academic Precision* — `#4F46E5` Royal Indigo, Geist + Inter, light-mode dashboard.
- Stitch project: `6042422095099894981`. Static screen exports remain in `stitch-screens/`.
- Reference palette (now expressed through the tokens above): ink `#0F172A`, success `#10B981`,
  warning `#F59E0B`, error `#F43F5E`, canvas `#F8FAFC`, borders `#E2E8F0` / `#CBD5E1`.
