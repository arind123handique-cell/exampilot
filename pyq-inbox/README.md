# PYQ Inbox

Drop previous-year question paper **PDFs** in this folder, then run the importer. It extracts
MCQs (with answer keys, worked explanations, and for math papers: formula context + step-by-step
solutions), groups them by sub-head, writes them into the app's question bank, and makes a git commit.

## Run it

**Windows** — double-click `import-pyq.bat`, or from a terminal:

```bat
pyq-inbox\import-pyq.bat
```

**Math / formula-heavy papers:**

```bat
pyq-inbox\import-pyq.bat --math
```

**Any OS / npm:**

```bash
npm run pyq:import
npm run pyq:import -- --math
```

## What happens

1. Every PDF here is read. Pages with a text layer are read directly; fully scanned pages are
   rendered to PNG and OCR'd with Gemini Vision.
2. **Hybrid detection**: if a significant fraction of text-layer pages also contain embedded
   raster images (formula images, figures, graphs), the **entire PDF is re-rendered at high DPI**
   so no formula is lost — even if the PDF has a text layer.
3. `--math` or `--force-image` renders **every page** as a high-DPI (220 DPI) image — the safest
   choice for technical / engineering papers.
4. Gemini structures the paper into MCQs: stem, options A–D, the correct key, a worked explanation,
   and a subject/topic. In math mode, it also extracts:
   - `formulaContext` — the primary formula used (e.g. `σ = P/A`)
   - `solutionSteps` — numbered step-by-step solution
   - `referenceSource` — IS / ASCE code clause reference
   - Unicode math symbols: `∫ ∂ ∑ √ σ μ θ ≤ ≥ ≠ ² ³ π` etc.
   - LaTeX for complex expressions: `$$\frac{d^2y}{dx^2}$$`
5. Questions are validated and **grouped into sub-heads** from their extracted subject/topic.
6. Two things are written:
   - `pyq-inbox/out/<slug>.json` — the validated extraction (the source of truth)
   - `src/data/pyq/generated.ts` — regenerated from everything in `out/`, imported by the app
7. A **local commit** is created. It is **not pushed** unless you ask for it.

Students then see the paper under **Mock Tests**, with the sub-heads as its sections.

## Flags

| Command | What it does |
|---|---|
| `import-pyq.bat` | Import everything in the inbox |
| `import-pyq.bat --math` | **Math mode**: high-DPI, Unicode math prompt, step-by-step solutions, relaxed validation for formulas |
| `import-pyq.bat --force-image` | Render ALL pages as images (safe default for PDFs with embedded diagrams) |
| `import-pyq.bat --math --push` | Math paper + publish to GitHub |
| `import-pyq.bat --push` | Also `git push` (publish) |
| `import-pyq.bat --inspect` | Report text vs scanned per PDF (shows embedded formula pages too) — **no API calls** |
| `import-pyq.bat --dry-run` | Parse and summarise, write nothing |
| `import-pyq.bat --rebuild` | Regenerate `generated.ts` from `out/` without re-parsing |
| `import-pyq.bat --group topic` | Derive sub-heads from topic (default is `auto`) |
| `import-pyq.bat --exam "APSC AE Civil" --year 2025` | Override the metadata guessed from the filename |
| `import-pyq.bat --from-json out\paper.json` | Import a hand-corrected JSON instead of re-OCRing |
| `import-pyq.bat --supabase` | Also mirror into Supabase (reads SUPABASE_URL/SUPABASE_ANON_KEY from .env) |
| `import-pyq.bat --no-database` | Skip the database sync even if credentials are available |
| `import-pyq.bat --dpi 300` | Override the rasterisation DPI (default: 150 normal, 220 with --math) |

## Math mode details

Use `--math` for any paper that contains:

- Equations or formulas (e.g. `∫ f(x) dx`, `σ = P/A`, `Q = AV`)
- Diagrams, graphs, or structural drawings used as question context
- Match-the-following tables with symbols
- Numerical calculation questions
- Any question where the answer is a number or expression

`--math` automatically enables `--force-image` (every page is rendered as a 220 DPI image),
switches to a math-aware Gemini prompt that:
- Outputs Greek symbols and math operators as Unicode
- Falls back to `$$...$$` LaTeX for complex multi-line expressions
- Generates `formulaContext`, `solutionSteps`, `referenceSource` fields per question
- Accepts shorter stems (`≥ 5 chars`) for formula questions like `Find σ if ε = 0.002`
- Sets default difficulty to HARD for NUMERICAL / FORMULA_RECALL questions

Supported `questionType` values in math mode:
| Type | When used |
|---|---|
| `CONCEPTUAL` | Fact or theory, no calculation |
| `NUMERICAL` | Requires arithmetic / algebra to obtain a numeric answer |
| `FORMULA_RECALL` | Asks to identify or complete a formula |
| `DIAGRAM_BASED` | Involves a figure, graph or circuit |
| `MATCH` | Match-the-following table |

## API key

OCR and structuring use Gemini, so a key is required. Add it to `pyq-inbox/.env`:

```
GEMINI_API_KEY=your_key_here
```

This file is git-ignored and stays on this computer. The importer also checks the repository-root
`.env` as a fallback. `VITE_GEMINI_API_KEY` is honoured when neither local key is present.

## Why it does not push automatically

A mis-OCR'd answer key is worse than no answer key. The run prints the sub-head breakdown and
rejected-question count so you can sanity-check it, then you publish with `--push`. If a paper
comes out wrong, fix `out/<slug>.json` and run `--from-json`, or delete that JSON and re-run.

## Supabase (optional)

Repository files are the source of truth and need no credentials. To also mirror into the
`questions`, `published_papers` and `custom_mock_tests` tables, pass `--supabase` — the URL and
anon key are read from `SUPABASE_URL` / `SUPABASE_ANON_KEY` (or their `VITE_` variants) in the
repository-root `.env`:

```
SUPABASE_URL=https://beahwfkpgplnccrszjvl.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...
```

The sync is stdlib-only (no extra pip installs) and fails the run if any table rejects a write,
so a schema mismatch can never silently drop a paper.

> The `published_papers` and `custom_mock_tests` tables must exist before the first sync — run
> `supabase/migrations/20260921_init_papers.sql` in the Supabase SQL Editor. The `questions`
> table is created by `supabase/migrations/20260921_init_questions.sql`.
