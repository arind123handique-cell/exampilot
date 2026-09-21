# PYQ Exporter

CLI that turns previous-year question paper PDFs into the app's question bank.

```bash
python tools/pyq_exporter/extract_pyq.py --inbox pyq-inbox
```

End users should use `pyq-inbox/import-pyq.bat` or `npm run pyq:import` — see
[`pyq-inbox/README.md`](../../pyq-inbox/README.md).

## Pipeline

```
PDF ──▶ PyMuPDF text layer?
        ├── yes ──▶ chunk text ─────┐
        └── no  ──▶ render pages ───┤
                                    ▼
                        Gemini (structured JSON)
                                    ▼
                 validate → de-duplicate → group sub-heads
                                    ▼
        pyq-inbox/out/<slug>.json      (source of truth, per paper)
        src/data/pyq/generated.ts      (rebuilt from out/ every run)
                                    ▼
                    optional Firestore mirror → git commit → optional push
```

## Design decisions

**Why PyMuPDF + Gemini rather than Tesseract.** No local OCR was installed, and the app
already ships a Gemini multimodal pipeline (`pdfToQuestions` in the admin PDF ingestor), so
using the same provider keeps one OCR path to reason about. PyMuPDF is used purely for the
text layer and for rasterising scanned pages — it is not an OCR engine.

**Why `out/*.json` is the source of truth.** `generated.ts` is *derived*, so a bad extraction
is fixed by editing one JSON file and running `--rebuild` — no re-OCR, no API spend, and the
diff is reviewable. `generated.ts` is emitted as a JSON literal cast to the app types
(`as unknown as PYQPaper[]`), which keeps it valid TypeScript without a runtime `JSON.parse`.

**Why sub-heads come from subject/topic, not the printed section titles.** A great many Indian
state papers are one undifferentiated run of 100 questions with no sections at all. The
extractor's subject/topic is attached per question, so it always exists. `--group auto`
prefers `subject` when a paper spans several subjects and falls back to the finer `topic` when
it does not; single-question groups are folded into a `General` bucket so a 100-question paper
does not become 100 sections. A `MockTest.sections` entry *is* a sub-head.

**Why the push is opt-in.** Publishing an unverified answer key to a public repo is the one
irreversible step. `--push` is explicit and the summary is printed before it.

**Why validation rejects so aggressively.** A question is dropped unless it has a stem, exactly
four non-empty options, and a valid key — a plausible-but-wrong key is worse than a missing
question. Rejected counts are reported per paper.

**Model rotation.** Mirrors `DEFAULT_GEMINI_MODELS` in `src/services/geminiService.ts`: a
retired or overloaded model (404/429/503) falls through to the next candidate rather than
failing the run. That hard-coded-model trap is documented in `geminiService.ts` — worth keeping
the two lists in step.

## Firestore mirror

`--firebase <serviceAccount.json>` writes `questions`, `published_papers` and
`custom_mock_tests` via the Firestore REST API, converting Python values to Firestore typed
values. A service account bypasses security rules, which matters because `firestore.rules` now
requires an `admin` custom claim for browser writes. Needs `pip install google-auth requests`;
without them the sync is skipped with a message and the repo files still work.

## Requirements

- Python 3.9+ with `pymupdf` (`pip install pymupdf`) — `pypdf`, `pdfplumber`, `PIL` are
  present on this machine but unused; PyMuPDF is the one hard dependency.
- Optional: `google-auth`, `requests` for the Firestore mirror.
- Network access for the Gemini calls.

## Debugging

```bash
# Which PDFs need OCR? No API calls.
python tools/pyq_exporter/extract_pyq.py --inspect

# Only the first 5 pages, to iterate cheaply
python tools/pyq_exporter/extract_pyq.py --max-pages 5 --dry-run

# Rebuild the data module without touching Gemini
python tools/pyq_exporter/extract_pyq.py --rebuild
```
