# PYQ Inbox

Drop previous-year question paper **PDFs** in this folder, then run the importer. It extracts
the MCQs (with answer keys and explanations), files them under sub-heads, writes them into the
app's question bank, and makes a git commit.

## Run it

**Windows** — double-click `import-pyq.bat`, or from a terminal:

```bat
pyq-inbox\import-pyq.bat
```

**Any OS / npm:**

```bash
npm run pyq:import
```

## What happens

1. Every PDF here is read. Pages with a real text layer are read directly; pages that are
   scanned images are rendered and OCR'd with Gemini vision.
2. Gemini structures the paper into MCQs: stem, options A–D, the correct key, a short
   explanation, and a subject/topic.
3. Questions are validated (exactly 4 options, valid key, no duplicates) and **grouped into
   sub-heads** from their extracted subject/topic.
4. Two things are written:
   - `pyq-inbox/out/<slug>.json` — the validated extraction (the source of truth)
   - `src/data/pyq/generated.ts` — regenerated from everything in `out/`, imported by the app
5. A **local commit** is created. It is **not pushed** unless you ask for it.

Students then see the paper under **Mock Tests**, with the sub-heads as its sections.

## Flags

Everything after the script name is passed straight through:

| Command | What it does |
|---|---|
| `import-pyq.bat` | Import everything in the inbox |
| `import-pyq.bat --push` | Also `git push` (publish) |
| `import-pyq.bat --inspect` | Report text vs scanned per PDF — **no API calls** |
| `import-pyq.bat --dry-run` | Parse and summarise, write nothing |
| `import-pyq.bat --rebuild` | Regenerate `generated.ts` from `out/` without re-parsing |
| `import-pyq.bat --group topic` | Derive sub-heads from topic (default is `auto`) |
| `import-pyq.bat --exam "APSC AE Civil" --year 2025` | Override the metadata guessed from the filename |
| `import-pyq.bat --from-json out\paper.json` | Import a hand-corrected JSON instead of re-OCRing |
| `import-pyq.bat --firebase serviceAccount.json` | Also mirror into Firestore |

## API key

OCR and structuring use Gemini, so a key is required. Add it to `.env` in the repo root:

```
GEMINI_API_KEY=your_key_here
```

Get one at <https://aistudio.google.com/apikey>. `VITE_GEMINI_API_KEY` is also honoured.

## Why it does not push automatically

A mis-OCR'd answer key is worse than no answer key. The run prints the sub-head breakdown and
rejected-question count so you can sanity-check it, then you publish with `--push`. If a paper
comes out wrong, fix `out/<slug>.json` and run `--from-json`, or delete that JSON and re-run.

## Firestore (optional)

Repository files are the source of truth and need no credentials. To also mirror into the
`questions`, `published_papers` and `custom_mock_tests` collections, download a Firebase
**service account** key into this folder as `serviceAccount.json` and pass `--firebase`.

> `serviceAccount.json` is git-ignored. Never commit it.

Requires `pip install google-auth requests`.
