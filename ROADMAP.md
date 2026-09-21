# ExamPilot AI — Product Roadmap

> Turning a solid syllabus-engine prototype into an AI-first exam-prep product that can win competitive
> aspirants against Unacademy, Testbook, and Adda247 — without out-spending them on catalog size.

**Strategy: AI-first differentiation. Execution order: UI/UX overhaul first, then feature depth.**
Last updated: September 2026.

---

## 1. Vision & positioning

Unacademy and Testbook win on **breadth**: thousands of hours of video, hundreds of test series, tens of
thousands of questions, star faculty, and price-anchored subscriptions. A new entrant cannot win that game —
content catalogs are a capital race, and video is a cost center (CDN + faculty).

ExamPilot should win on the three things catalogs structurally cannot do:

| Pillar | What it means | Why incumbents are slow here |
|---|---|---|
| **1. Understands *you*** | A diagnostic + adaptive engine that models per-subtopic mastery, decay over time, and predicted score — and derives every screen from that model | Their personalization is recommendation-lite, bolted onto a content store |
| **2. Explains, doesn't just answer** | Syllabus-grounded tutor with citations to official clauses/references, step-wise derivations, traps, and instant drill generation | Their AI is a chatbot layer, not the product spine |
| **3. Gets out of the way** | Sub-second, offline-capable, low-data, keyboard- and thumb-native, installable | Their apps are heavy, ad-cluttered, and online-only |

**Positioning line:** *"The study engine that knows exactly what you don't know — and fixes it today."*

**Non-goals (for now):** live video classes, faculty marketplace, 10,000-question bulk dumps. Those are
incumbent-shaped. We revisit only if a pillar above is fully built.

---

## 2. Where the product is today (code audit)

> **Reality check (audit, Sept 2026).** The screens listed in §2 "Functional modules" below are **not
> reachable**. `App.tsx` renders only `StudentPortal` (every route except `/admin`) and
> `AdminPortalPage`; the Syllabus Explorer, Knowledge Hub, MCQ Practice, Study Plan, AI Tutor,
> PYQ Archive, Progress Analytics, Onboarding and MockTestPage were all orphaned and now live in
> `archive/unused-modules/`. So the *shipped* deliverable is a CBT mock-test portal + admin
> ingestion studio — the content engine behind it is real, the surrounding product is not yet built.
> Treat the module lists in this file as a backlog, not a description of what exists.
> Also open at audit time: the build was broken by 3 type errors (fixed), the exam did not survive a
> refresh (fixed), and mock tests revealed answers mid-exam (fixed).

Assessed from the current repository (`src/`, ~25k LOC, 77 project files):

**Strong**
- Real syllabus domain modeling — `SyllabusTopic`, `SubTopic`, `KnowledgeModule`, `KnowledgeStep`,
  weightage/expected-marks, mastery levels (`src/types/index.ts`).
- A genuinely differentiated asset: **syllabus-grounded knowledge modules** (10k lines across
  `src/data/topicKnowledge.ts` + 6.8k lines of questions in `civilQuestions.ts` / `generalStudiesQuestions.ts`).
- Working AI layer: `geminiService.ts` (tutor + generation) and `aiIngestionService.ts` (764 lines of
  ingestion/synthesis) — this is the seed of pillar 2.
- Functional modules: onboarding, study plan, syllabus explorer, knowledge hub, MCQ practice, full mock test
  with palette, PYQ archive, AI tutor, ingestion studio, analytics.
- Firebase auth/Firestore with a graceful demo-mode fallback (no backend required to try the product).

**Weak — and the reason it feels "dull" and thin**
1. **No design system in code.** `DESIGN_SYSTEM.md` describes tokens, but pages hand-roll
   `bg-white` / `text-slate-500` / `border-academic-border` (≈700 occurrences of ad-hoc utilities, 96 bare
   `bg-white`). There is no shared component layer, so every screen drifts in spacing, radius, and hierarchy.
   **`src/components/` contains only `layout/` and `auth/` — zero `ui/` primitives.**
2. **Light-mode only, no theming.** Aspirants study at night; there is no dark mode, no contrast control.
3. **No routing.** Navigation is a `useState<ActiveTab>` in `App.tsx`; no URLs, so no deep links, no
   "share this question", no back button, no SEO, no browser history, no resumable state after refresh.
4. **Navigation is a flat 10-item list** in `AppLayout.tsx` — undifferentiated weight, no grouping, mobile is
   a hamburger drawer, and the primary mobile surface has no tab bar.
5. **Persistence is shallow.** Progress lives in Firestore documents or ephemeral demo state; nothing is
   offline-first or locally durable (a refresh mid-test is a risk).
6. **Feedback is bare.** Spinners and stat cards, but no skeletons, no empty states, no toasts, no
   optimistic UI, no celebratory moments, no reduced-motion handling.
7. **Accessibility gaps.** Icon-only buttons rely on `title`, no focus management in modals/drawers, no
   `aria-live` for timers/scores, no keyboard shortcuts.
8. **No test suite** and no CI typecheck gate.
9. **AI keys via `import.meta.env`** call the provider from the browser — the key is public in the bundle.
   A backend proxy is required before any paid/scale launch.
10. **Single-market assumptions** — no i18n, no currency/payment, no low-bandwidth strategy.

**Verdict:** the *brain* (syllabus model + AI ingestion) is ahead of the *body* (interface, reliability,
distribution). Fix the body first — it is the cheapest, most visible win and it is a prerequisite for the AI
features to be believable.

---

## 3. Gap matrix vs incumbents

Legend: ❌ missing · ⚠️ partial · ✅ competitive

### 3.1 Learning experience

| Capability | Us | Unacademy | Testbook | Target phase |
|---|---|---|---|---|
| Structured syllabus tree w/ weightage | ✅ | ⚠️ | ⚠️ | — |
| Step-wise theory + exam traps | ✅ | ⚠️ (video) | ⚠️ | — |
| Adaptive per-subtopic mastery model | ⚠️ (static field) | ❌ | ⚠️ | **P2** |
| Spaced-revision scheduler (decay-aware) | ❌ | ⚠️ | ⚠️ | **P2** |
| Notes, highlights, bookmarks | ❌ | ⚠️ | ⚠️ | **P3** |
| Doubt solving (peer + AI, with SLA) | ⚠️ (AI only) | ✅ | ✅ | **P4** |
| Video / live classes | ❌ | ✅ | ✅ | Out of scope |
| Voice-first tutoring (ask out loud) | ❌ | ❌ | ❌ | **P2** *(differentiator)* |

### 3.2 Assessment & analytics

| Capability | Us | Incumbents | Target phase |
|---|---|---|---|
| Full mock with palette + negative marking | ✅ | ✅ | — |
| PYQ archive with frequency tags | ✅ | ✅ | — |
| All-India rank / percentile vs cohort | ❌ (mock value) | ✅ | **P3** |
| Benchmark comparison (your score vs toppers) | ❌ | ⚠️ | **P3** |
| Predicted score / readiness with confidence | ⚠️ | ⚠️ | **P2** |
| Question-level time telemetry + speed analytics | ⚠️ | ✅ | **P2** |
| Weak-area auto-drill generation | ⚠️ | ⚠️ | **P2** *(make it automatic)* |

### 3.3 Platform & commercial

| Capability | Us | Incumbents | Target phase |
|---|---|---|---|
| Installable PWA / offline tests | ❌ | ⚠️ | **P3** |
| Deep links & shareable questions | ❌ | ✅ | **P1** |
| Dark mode / theming | ❌ | ⚠️ | **P1** |
| Notifications & streaks nudge | ⚠️ (streak only) | ✅ | **P3** |
| Payments / subscriptions | ❌ | ✅ | **P3** |
| Multi-language | ❌ | ⚠️ | **P4** |
| Low-bandwidth / low-end device budget | ❌ | ⚠️ | **P4** |
| Group study / cohorts / challenges | ❌ | ⚠️ | **P4** |

**Read of the matrix:** we are already credible on *content structure and testing*. The two big holes are
**personalization depth (P2)** and **distribution/platform credibility (P1, P3)**. That is exactly the order below.

---

## 4. Phased plan

Each phase is independently shippable, has a hard exit criterion, and leaves the app usable if the next phase
never starts.

### Phase 1 — Design system v2 + shell overhaul  ← **IN PROGRESS**

**Goal:** the product *looks and feels* like a 2026 product, and stops fighting the user on mobile.

| Epic | Deliverable | Status |
|---|---|---|
| 1.1 Token layer | CSS-variable semantic tokens (`--bg-canvas`, `--bg-surface`, `--line`, `--ink`, `--muted`, `--accent`) exposed as Tailwind colors; light + dark values | ✅ this session |
| 1.2 Theme | `ThemeContext` with `light \| dark \| system`, persisted to `localStorage`, respects `prefers-color-scheme`, live OS-change listener; `ThemeToggle` in header | ✅ this session |
| 1.3 Legacy bridge | Dark-mode remap for the pre-v2 utility classes so all 10 modules were theme-correct before migration | ✅ session 1 → **deleted session 2** |
| 1.4 UI primitives | `src/components/ui/`: `Card`, `Button`, `Badge`, `ProgressRing`, `Skeleton`, `EmptyState`, `StatTile` — the only sanctioned way to build a screen | ✅ session 1 |
| 1.5 Shell overhaul | Grouped navigation (Orient / Learn / Practise / Intelligence) with descriptions, collapsible rail, denser header, command palette (`⌘K` / `Ctrl+K`), mobile bottom tab bar | ✅ session 1 |
| 1.6 Reference screen | Study-plan dashboard rebuilt on the new system to fix the pattern for every other page | ✅ session 1 |
| 1.9a Token migration | All 7 remaining pages + `AuthModal` swept from raw palette utilities to semantic tokens — 1,200 replacements over 14 files via `scripts/migrate-design-tokens.mjs`; legacy bridge deleted (−13 kB CSS) | ✅ session 2 |
| 1.9b Loading states | `PageSkeleton` on the async surfaces that previously showed a bare spinner (study plan, MCQ practice) | ✅ session 2 |
| 1.9c Primitive adoption | Progress Analytics rebuilt on `StatTile` / `ProgressRing` / `Badge` / `Card` / `EmptyState` as the second reference screen | ✅ session 2 |
| 1.9d Structural consolidation | JSX-aware codemod converted **34 hand-rolled card wrappers to `<Card>`** across all 7 screens; 12 real status pills became `<Badge>`; 2 text-only empty states became `<EmptyState>`. `<Card>` is now used in 9 of 10 pages (the 10th is a thin wrapper page with no markup of its own) | ✅ session 3 |
| 1.9e Remaining hand-rolled markup | Inline mono code chips and legend dots are deliberately left as-is (see note below); convert the residual hand-rolled buttons to `<Button>` | ⏭ next |
| 1.7 Routing | Introduce a router, map `ActiveTab` → real URLs, deep-linkable modules (`/practice?topic=…`), browser back/forward, shareable links | ⏭ next |
| 1.8 Feedback pass | Toast system, empty states on the remaining lists, optimistic UI on mock submission | ⏭ next |
| 1.10 A11y & guardrails | Focus traps, ARIA for timers, keyboard tests, `tsc --noEmit` in CI | ⏭ next |

**Exit criteria:** every screen usable one-handed on a 360px viewport; zero hard-coded light-only colors in
new code; dark mode with no unreadable text; first-paint interaction under 100ms on the shell (no layout jank
on tab change); keyboard-only navigation of the whole app.

**Session 3 status:** cards, badges and empty states now go through primitives on every screen that has them.
What was deliberately *not* converted, and why: of ~90 pill-shaped elements in those screens, only 12 were
real badges — the rest are inline monospace code chips (`Q.12`, clause numbers, `PYQ 2019`) and bare
uppercase eyebrow labels with no background. Forcing them into `<Badge>` would force uppercase, drop the
monospace font and add a hairline border. If mono-chip repetition grows, it should become its own
`CodeChip` primitive rather than a Badge variant. Routing, toasts and A11y remain open — see 1.7 / 1.8 / 1.10.

---

### Content engine — coverage, numerical bank, and the MCQ factory  ← **SHIPPED**

**Goal:** answer "what should we write next?" with data instead of instinct, and make unlimited
generated practice trustworthy enough to grade a student against.

Details, measured numbers and known gaps: [`CONTENT_ENGINE.md`](CONTENT_ENGINE.md).

| Epic | What shipped |
|---|---|
| C.1 Exam blueprint | 18 subjects with relative weights and 5–8 topics each, matched against bank/module/recipe text by keyword. Unmatched bank topics are reported rather than absorbed. |
| C.2 Coverage maths | `buildCoverageReport()` measures questions, theory steps and recipes per topic; `topGenerationRequests()` turns the shortfall into prioritised batches. |
| C.3 Hand-authored numerical bank | 42 compute-the-answer MCQs with verified arithmetic and worked solutions, one per civil subject — the previous bank contained **zero**. |
| C.4 Missing subjects | Theory modules for Engineering Mechanics, Concrete Technology, Earthquake Engineering and Railway/Airport/Bridge/Tunnel — four weighted subjects with nothing behind them. |
| C.5 Deterministic generator | 18 numerical recipe templates (answers computed in code, never written) across 13 subjects. |
| C.6 AI drafter | Testbook-shaped prompt, plus a validate-and-repair layer: option integrity, unit consistency, 2 % numerical collision rule, no PYQ claims. |
| C.7 In-app Question Factory | Coverage panel + targeted generation, mounted in the AI Ingestion Studio. |
| C.8 Validation gates | `npm test`: module structure (incl. every worked example's answer present in its options), recipe engine, AI pipeline. |

**Exit criteria met:** coverage is measurable and actionable; no generated question can be shown with a
key that collides with a distractor; provenance is machine-checked (`0` verbatim PYQ claims); three
structural gates run in CI-able form via `npm test`.

**Carried forward:** coverage is 29.5 % of target; four subjects have theory but no recipe template; the
legacy 100-item bank lacks working steps; the AI prompt itself has not been exercised against the live
model from this repository.

---

### Phase 2 — Adaptive intelligence engine (the moat)

**Goal:** the app stops being a content browser and starts being a coach. Every screen reads from one model.

| Epic | What ships |
|---|---|
| 2.1 Mastery model | Replace the static `masteryLevel` field with a real per-subtopic estimate: `{ attempts, recency, accuracy, difficulty weighting, confidence }`. Pure TypeScript, deterministic, unit-tested — no ML service needed at this scale. |
| 2.2 Decay & revision scheduler | SM-2-style spaced repetition over subtopics → "Revise 4 topics today (23 min)" surfaced on the dashboard and as a daily goal. |
| 2.3 Readiness forecast | Predicted score band per paper with a confidence interval and a "what moves the needle" explainer (top 5 subtopics by marginal gain). Replaces the current hand-waved `readinessScore`. |
| 2.4 Automatic weak-area drills | Weak-area detection already exists in analytics; make it generate and launch the drill in one tap, with difficulty calibrated to the estimate. |
| 2.5 Speed & stamina analytics | Per-question time telemetry captured in practice/mock → pacing advice, time-sink questions, "accuracy drops after Q60" curves. |
| 2.6 Tutor v2 (syllabus-grounded) | Retrieval over `topicKnowledge` + syllabus tree; every answer carries citations, one formula, one trap, and a one-tap drill. Streaming responses. |
| 2.7 Voice tutor | Speech-in / speech-out for hands-free revision ("explain, don't show"). Nobody in this market does this well. |
| 2.8 Onboarding diagnostic | 15-question calibrated diagnostic at onboarding so the engine has a prior on day 0 instead of day 30. |

**Exit criteria:** a new user gets a personalized "today" plan within 3 minutes of signing up; after 100
attempted questions the predicted-score band is stable and explainable; drill launch from weak-area insight is
≤1 tap.

---

### Phase 3 — Retention, trust, and money

| Epic | What ships |
|---|---|
| 3.1 All-India rank & benchmarks | Cohort-normalized percentile, topper comparison, "you beat 71% of aspirants with a similar plan". Requires honest cohort sizing. |
| 3.2 Notes / highlights / bookmarks | Per-subtopic notes with offline cache; auto-compiled revision sheet PDF. |
| 3.3 PWA + offline | Installable; practice and mock exams run fully offline and sync on reconnect; media-light by default. |
| 3.4 Notifications | Daily-plan nudge, streak protection, revision-due, exam countdown — all derived from the mastery model, all opt-in with quiet hours. |
| 3.5 Groups & challenges | Small cohorts with shared streaks and weekly leaderboards — retention without the ad-clutter. |
| 3.6 Monetization | Gated value at the right altitude: free = one exam, daily plan, limited AI; paid = unlimited AI tutor, full analytics, unlimited mocks, offline. Vendor/rails selection is a Phase-3 evaluation task. |
| 3.7 Backend proxy for AI | Move provider calls server-side (the current in-bundle key is a launch blocker), add caching + per-user quotas. |

**Exit criteria:** installable PWA with a working offline mock; ≥40% D30 retention in the pilot cohort;
AI cost per active user known and capped.

---

### Phase 4 — Future markets

Only after 1–3 are solid. Design constraints applied *now* so it is not a rewrite later: keep copy in
translation-ready keys, never hard-code currency or date formats, keep the layout resilient to +30% string
growth (German/Hindi-length strings), keep bundle weight a tracked budget.

| Epic | What ships |
|---|---|
| 4.1 i18n | `i18n` layer with Hindi + one regional language, locale-aware dates/numbers, RTL-safe layout primitives. |
| 4.2 Localised exam catalogs | State PSC / SSC / banking catalogs with per-region syllabus trees — the data model already supports this. |
| 4.3 Payments for the next market | Local rails (e.g. UPI-style instant payments, carrier billing, mobile money) selected per market at implementation time; price localization. |
| 4.4 Low-data & low-end mode | Text-first mode, aggressive image compression, sub-1MB first load, works on 2GB-RAM Android. |
| 4.5 Voice/offline-first study | Download-a-topic packs (theory + 20 MCQs, <2MB) for zero-connectivity study. |
| 4.6 Trust & compliance | Data residency/consent, exam-board disclaimers, content accuracy review pipeline for AI-generated material. |

---

## 5. Architecture decisions

| Decision | Choice | Rationale |
|---|---|---|
| Theming | CSS custom properties + Tailwind `colors` bound to `var(--…)`, plus a temporary compatibility layer for legacy utilities | Zero-dependency, no FOUC, trivial to extend; the bridge lets 10 modules theme correctly before they are migrated |
| Theme state | React context + `localStorage`, `data-theme` attribute on `<html>` | Small, testable, no library; also lets a future "high-contrast" mode slot in |
| Components | Hand-built `src/components/ui/` on tokens, `cva`-style variant props | No dependency cost; keeps bundle lean; consistent with current stack (no component lib today) |
| Routing (P1.7) | Lightweight client router, `ActiveTab` union kept as the source of truth for screens | Preserves the existing `App.tsx` contract while adding URLs, history, and deep links |
| Mastery engine (P2) | Pure deterministic TypeScript module, unit-tested, persisted per user | No ML infra needed; auditable; explainable to the aspirant (a black box kills trust in exam prep) |
| AI calls | Move behind a server proxy before scale | The current browser-side provider key is public; also enables caching, quotas, and cost control |
| Data | Keep the static curriculum as the offline seed; Firestore for user state | Preserves demo-mode (no key needed to try the product) — a real acquisition advantage |
| Quality gates | `tsc --noEmit` + unit tests for the mastery/decay engines in CI | The intelligence layer must be testable; UI regressions caught by a narrow visual smoke suite |

**Deliberately avoided for now:** a component library, a state-management library, a CSS-in-JS runtime, and a
server-rendered framework. Each adds weight before it adds value at this stage.

---

## 6. Metrics

**Phase 1 (experience):** time-to-first-interaction, Lighthouse mobile ≥ 90, tap-target failures = 0,
contrast failures = 0, screens using primitives (%).
**Phase 2 (intelligence):** % of users with a generated "today" plan, drill launches from insights, predicted
vs actual score error, tutor answers with citations (%), voice sessions/week.
**Phase 3 (business):** D1/D7/D30 retention, installs (PWA), free→paid conversion, AI cost/MAU, offline
session share.
**Phase 4 (market):** non-English session share, low-end device crash-free rate, first-load size on 3G.

---

## 7. Risks

| Risk | Mitigation |
|---|---|
| "AI-first" reads as hype without depth | Ship the mastery engine (P2) as deterministic and explainable; never show a score we cannot justify |
| Catalog envy — users still ask "where's the video?" | Position explicitly on *without a lecture*; route "explain this" to the tutor + knowledge step, not to a player |
| Content accuracy of AI-generated modules | Review pipeline + reference citations + confidence flags before anything is shown as authoritative |
| Solo-maintainer scope creep | Phase exit criteria are hard gates; no phase starts before the prior exits |
| Cost of AI at scale | Server proxy with caching + quotas (P3.7); free tier deliberately narrow |
| Half-themed UI during migration | The legacy bridge keeps dark mode coherent until P1.9 deletes it |

---

## 8. Immediate next 5 work items

1. **C.9 recipe coverage for the four new subjects** — Engineering Mechanics, Concrete Technology,
   Earthquake and Railway/Airport/Bridge/Tunnel have theory but no deterministic generator, so their
   numerical practice depends on the AI key.
2. **C.10 raise the ceiling on the C.3 numerical bank** — the blueprint ranks Structural Analysis, RCC,
   Geotechnical and Engineering Mechanics as the largest absolute shortfalls.
3. **P1.9e hand-rolled buttons** — the four large screens still hand-roll their CTAs; convert to `<Button>`
   so loading, disabled and focus states are consistent.
4. **P1.7 routing** — real URLs for every module plus deep links.
5. **P2.1 mastery model** — typed engine + unit tests, wired into practice/mock submissions. This is the
   gate on the recipe/factory work paying off: generated sets are only useful if attempts feed an estimate.

Also queued: P1.8 toasts, P1.10 a11y + CI typecheck, and **code splitting** — the bundle is 1.74 MB
(481 kB gzip), which blocks the low-end-device goal from Phase 4.
