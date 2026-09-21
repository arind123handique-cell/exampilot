# Archived modules (not part of the shipped app)

These files were moved here because **nothing in the running app reached them**. They were
left in `src/` for a long time, which made the typecheck/build surface, the documentation and
the mental model of "what this product is" all larger than the product itself.

They were **not deleted** — this repository has no version control, so moving them (rather than
`rm`) keeps the work recoverable while taking it out of the build (`tsconfig.json` only includes
`src/`).

## Why these specific files

The app entry point is `src/main.tsx` → `src/App.tsx`, which renders exactly two things:

- `src/pages/StudentPortal.tsx` (default, and every route except `/admin`)
- `src/pages/AdminPortalPage.tsx` (`/admin`)

`AdminPortalPage` renders `src/pages/AiIngestionStudioPage.tsx`. Nothing else was reachable.

| File | Reachable? |
|---|---|
| `HomePage`, `OnboardingPage`, `StudyPlanPage`, `SyllabusExplorerPage`, `McqPracticePage`, `PyqArchivePage`, `AiTutorPage`, `ProgressAnalyticsPage`, `KnowledgeHubPage` | no importers at all |
| `MockTestPage` | no importers at all |
| `MockTestCreator` + `aiArrangementService` | a closed two-file island: each only imported the other |

Verified by `tsc --noEmit` after the move — it passes, which proves no *live* module resolved
any of these paths.

## What this means for the product

The features described in `PROJECT_DOCUMENTATION.txt` / `ROADMAP.md` — Syllabus Explorer,
Knowledge Hub, MCQ Practice, Study Plan, AI Tutor, Progress Analytics, PYQ Archive,
Onboarding — **are not shipped**. The live product is a CBT mock-test portal (student) plus an
ingestion/authoring studio (admin) for it.

## Reviving one of these

Restoring a module is a deliberate product decision, not a copy-paste. Most were written against
the older 6–10 tab shell (`ActiveTab`, `AppLayout`, `useRouter`) that no longer drives the app.

1. Move the file back into `src/` (e.g. `archive/unused-modules/AiTutorPage.tsx` → `src/pages/AiTutorPage.tsx`).
2. Fix its relative imports — the `../components/...` and `../services/...` paths assumed it sat
   directly in `src/pages/`.
3. Give it a real entry point. `StudentPortal.tsx` uses local `studentTab` state; add a tab, or
   promote it to a route in `App.tsx` / `src/hooks/useRouter.ts`.
4. Re-run `npx tsc --noEmit` and `npm test`.

If a module is restored, lower it out of this folder rather than importing across the `archive/`
boundary.
