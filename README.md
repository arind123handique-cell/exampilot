# ExamPilot AI Platform

> Intelligent, syllabus-aware study and exam preparation platform for competitive civil services & state engineering examinations (e.g. UPSC, State PSCs, SSC, GATE).

This project was synchronized from Google Stitch:
- **Stitch Project URL**: [https://stitch.withgoogle.com/projects/6042422095099894981](https://stitch.withgoogle.com/projects/6042422095099894981)
- **Design System Theme**: Academic Precision (`#4F46E5` Royal Indigo, Geist + Inter typography, high-density structured layout)

> 📍 **Product direction & roadmap**: see [`ROADMAP.md`](ROADMAP.md) — AI-first differentiation, phased plan,
> and the current phase status. Design tokens and component rules live in [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md).
> How content is measured, generated and validated lives in [`CONTENT_ENGINE.md`](CONTENT_ENGINE.md).

### Try it

```bash
npm install
npm run dev        # http://localhost:3000 — runs fully in demo mode without any keys
```

- Light/dark/system theming is available from the header toggle.
- Press `⌘K` / `Ctrl+K` to jump to any module.

### Content tooling

```bash
npm test                 # structural gates: knowledge modules, numerical engine, AI pipeline
npm run audit:coverage   # syllabus coverage against the exam blueprint + next work items
npm run audit:content    # question-kind mix, solution depth, provenance, duplicates
```

`npm test` needs no API key and no network. Live AI question drafting is optional — the in-app
**Question Factory** (AI Ingestion Studio) falls back to the verified-recipe layer when no Gemini key
is configured, so a generated set is always available and its answer keys are always computed.

## 🌐 Universal Exam Support

ExamPilot AI now supports **any examination** — not just Civil Engineering. The architecture scales to UPSC, SSC, GATE, State PSCs, Teaching exams, Law, Management, and any custom exam.

### Architecture layers (per PROMP.txt)

| Layer | File | PROMP.txt § |
|---|---|---|
| **Universal Taxonomy** | `src/services/universalTaxonomy.ts` | §4–6 |
| **Knowledge Engine** | `src/services/knowledgeEngine.ts` | §7, §11–14, §42–44 |
| **Research Engine** | `src/services/researchEngine.ts` | §8–9, §52 |
| **Question Engine** | `src/services/mcqFactoryService.ts` | §16–24 |
| **Mock Blueprint & Adaptive** | `src/services/curriculumBlueprint.ts` | §25–38 |

- `ExamId` is now `string` — any exam ID works without modifying the type system.
- `UNIVERSAL_EXAMS` seeds 7 exams: APSC AE Civil, UPSC CSE, GATE CS, GATE ME, SSC CG, SSC CH, plus Civil and GS originals.
- Question types expanded: Assertion-Reason, Match-the-Following, Chronology, Classification, Scenario, Case-Based, Data Interpretation, Diagram Interpretation, Code/Rule-Based.
- Deterministic numerical recipes (18+) compute answers in code — never trust a model's answer key.
- Anti-hallucination pipeline: every entity gets `verification_status` (verified/supported/inferred/unverified/conflicting/needs_review).
- Knowledge graph: 9 relationship types (`prerequisite_of`, `depends_on`, `related_to`, `part_of`, `explains`, `applied_in`, `contrasts_with`, `derived_from`, `tested_by`).
- Auto gap detection: 8-priority queue identifies syllabus topics with no knowledge, incomplete topics, concepts without sources, concepts without questions, missing hard questions, duplicate-heavy areas, and weak user concepts.
- Adaptive mock engine: considers mastery, recent accuracy, difficulty, topic, question type, response time, and previous errors.
- AI remediation: theory → medium → hard → mini-test → retest flow.
- Study plan generator: allocates learning/practice/revision/mock hours across available days.

---

## 🎨 Local Design Showcase

An interactive preview gallery has been compiled in `stitch-screens/`:
- **Open Gallery**: Open [`stitch-screens/index.html`](stitch-screens/index.html) in any browser to switch between all screens and toggle between Desktop & Mobile viewports.

### Screen Inventory

| File | Title | Description |
|---|---|---|
| [`00-logo.svg`](stitch-screens/00-logo.svg) | Brand Logo | Official ExamPilot vector brandmark |
| [`01-onboarding.html`](stitch-screens/01-onboarding.html) | Onboarding (Base) | Exam selection, target year & preparation level setup |
| [`02-onboarding-desktop.html`](stitch-screens/02-onboarding-desktop.html) | Onboarding (Desktop) | Full desktop multi-step exam onboarding wizard |
| [`03-personalized-study-plan.html`](stitch-screens/03-personalized-study-plan.html) | Personalized Study Plan | Adaptive study roadmap, syllabus pacing & daily tasks |
| [`04-syllabus-explorer.html`](stitch-screens/04-syllabus-explorer.html) | Syllabus Explorer & Topics | Hierarchical syllabus tree with weightages & revision notes |
| [`05-mcq-practice-assessment.html`](stitch-screens/05-mcq-practice-assessment.html) | MCQ Practice & Assessment | Timed question engine with instant explanations & formulas |
| [`06-full-mock-test-simulation.html`](stitch-screens/06-full-mock-test-simulation.html) | Full Mock Test Simulation | Strict exam simulation environment with question palette |
| [`07-previous-papers-archive.html`](stitch-screens/07-previous-papers-archive.html) | PYQ & Question Archive | Historical exam papers, topic filters & difficulty ratings |
| [`08-syllabus-aware-ai-tutor.html`](stitch-screens/08-syllabus-aware-ai-tutor.html) | Syllabus-Aware AI Tutor | Interactive AI co-pilot grounded in official syllabus |
| [`09-progress-analytics.html`](stitch-screens/09-progress-analytics.html) | Progress & Exam Readiness | Analytics dashboard, radar competency charts & predictions |
| [`10-mobile-platform.html`](stitch-screens/10-mobile-platform.html) | Mobile Platform Experience | Mobile responsive viewport implementation |

---

## 📐 Design System Specs

See [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) for design tokens, colour palette, typographic scales,
spacing metrics, the `src/components/ui/` component catalogue, and theming rules.

Semantic tokens live in `src/index.css` (light + dark) and are surfaced as Tailwind colours in
`tailwind.config.js`:

```tsx
<Card>
  <CardHeader title="Today's targets" subtitle="Tap a row to advance its status" icon={<ListChecks />} />
  <Badge tone="brand">Adaptive plan</Badge>
  <Button variant="secondary" icon={<BookOpen className="h-3.5 w-3.5" />}>Syllabus explorer</Button>
</Card>
```

**Rule:** never hard-code palette colours (`bg-white`, `text-slate-500`) in new code — use semantic
tokens (`bg-card`, `text-muted`, `border-line`) so light and dark mode both work.
