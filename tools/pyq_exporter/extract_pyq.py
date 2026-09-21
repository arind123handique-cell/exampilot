#!/usr/bin/env python3
"""
PYQ EXPORTER — previous-year question papers -> repository question bank.

Drop one or more PDFs into `pyq-inbox/` and run:

    pyq-inbox\\import-pyq.bat                 (Windows, double-click or shell)
    python tools/pyq_exporter/extract_pyq.py  (any platform)
    npm run pyq:import

What it does
------------
1. Reads every PDF in the inbox.
2. Pulls the text layer with PyMuPDF. Pages with no text layer (or ALL pages when
   --force-image / --math is set) are rendered to high-DPI PNG images so Gemini
   Vision can OCR them — including embedded formula images and diagrams.
3. Hybrid mode: for PDFs that have BOTH a text layer AND embedded images, every
   page is rendered at high DPI and sent as an image; the text layer is NOT used
   (guarantees formulas are not lost).
4. Asks Gemini to structure the paper into MCQs. Math mode uses a richer prompt
   that outputs Unicode math notation (∫, √, σ, ≤ …) and fills extra fields:
   formulaContext, solutionSteps, referenceSource.
5. Validates and de-duplicates, then groups the questions into sub-heads from
   their extracted subject/topic (see --group) and builds a MockTest whose
   `sections` are those sub-heads.
   Validation is relaxed for NUMERICAL and FORMULA_RECALL questions — shorter
   stems and shorter explanations are accepted because a formula *is* the answer.
6. Writes:
      pyq-inbox/out/<slug>.json     raw + validated extraction (the source of truth)
      src/data/pyq/generated.ts     the app's question bank, regenerated from out/
7. Syncs validated papers to Supabase when --supabase is passed (or SUPABASE_URL/
   SUPABASE_ANON_KEY are set).
8. Commits the result. Pushing requires an explicit --push.

The git push is deliberately opt-in: a mis-OCR'd answer key should never be
published without a human checking the summary first.

Examples
--------
    extract_pyq.py --inspect                            # diagnose text vs scanned, no API calls
    extract_pyq.py                                      # import everything in the inbox
    extract_pyq.py --math                               # math-heavy paper (formulas, diagrams)
    extract_pyq.py --force-image                        # always render pages as images
    extract_pyq.py --push                               # import and publish
    extract_pyq.py --rebuild                            # regenerate generated.ts only
    extract_pyq.py --rebuild --supabase                 # ...and mirror into Supabase
    extract_pyq.py --from-json pyq-inbox/out/x.json     # import an already-extracted paper
    extract_pyq.py --group topic                        # group sub-heads by topic instead of auto
    extract_pyq.py --exam "APSC AE Civil" --year 2025   # override metadata guessed from filename
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import re
import subprocess
import sys
import unicodedata
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

# Windows consoles default to cp1252 and blow up on arrows/emoji/math symbols.
try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

# ── Paths ────────────────────────────────────────────────────────────────────
TOOLS_DIR = Path(__file__).resolve().parent
REPO_ROOT = TOOLS_DIR.parent.parent
DEFAULT_INBOX = REPO_ROOT / "pyq-inbox"
GENERATED_TS = REPO_ROOT / "src" / "data" / "pyq" / "generated.ts"

# ── Gemini ───────────────────────────────────────────────────────────────────
GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models"
# Most-recent GA flash models first; older ones as fallbacks for 404/429/503.
GEMINI_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
    "gemini-3.8-flash",
    "gemini-3.5-flash-lite",
]

# ── PDF reading ───────────────────────────────────────────────────────────────
# A page yielding fewer than this many chars is treated as scanned/imagery.
MIN_TEXT_CHARS_PER_PAGE = 80
# DPI used for rasterising normal pages.
NORMAL_DPI = 150
# DPI used when --math or --force-image is active (captures fine formula detail).
MATH_DPI = 220
# Pages per Gemini vision call (token + payload limit).
IMAGE_BATCH_PAGES = 3
# Characters per Gemini text call.
TEXT_CHUNK_CHARS = 12000
# If this fraction of pages contain embedded images, force full image mode.
EMBEDDED_IMAGE_RATIO_THRESHOLD = 0.25

VALID_OPTION_IDS = ("A", "B", "C", "D")
MIN_EXPLANATION_CHARS = 12
# Shorter threshold accepted for math-type questions.
MIN_MATH_EXPLANATION_CHARS = 6
MIN_STEM_CHARS = 12
# For NUMERICAL / FORMULA_RECALL a stem like "Find σ if ε = 0.002" is valid.
MIN_MATH_STEM_CHARS = 5

GENERIC_EXPLANATION_PATTERNS = (
    re.compile(r"^official answer key:\s*\([A-D]\)\.?$", re.I),
    re.compile(r"^official answer is\s*\([A-D]\)\.?$", re.I),
    re.compile(r"^answer:\s*[A-D]\.?$", re.I),
    re.compile(r"^(?:n/?a|not available|not provided|see solution|no explanation)$", re.I),
)


def has_meaningful_explanation(value, math_mode: bool = False) -> bool:
    text = str(value or "").strip()
    min_len = MIN_MATH_EXPLANATION_CHARS if math_mode else MIN_EXPLANATION_CHARS
    return len(text) >= min_len and not any(
        pattern.fullmatch(text) for pattern in GENERIC_EXPLANATION_PATTERNS
    )


# ── Small helpers ────────────────────────────────────────────────────────────


def log(msg: str) -> None:
    print(msg, flush=True)


def warn(msg: str) -> None:
    print(f"  ! {msg}", flush=True)


def die(msg: str, code: int = 1):
    print(f"\nERROR: {msg}\n", file=sys.stderr, flush=True)
    sys.exit(code)


def load_env(path: Path) -> dict:
    """Minimal .env reader — KEY=VALUE, ignores comments and blank lines."""
    env: dict = {}
    if not path.is_file():
        return env
    try:
        for raw in path.read_text(encoding="utf-8", errors="replace").splitlines():
            line = raw.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            env[key.strip()] = value.strip().strip('"').strip("'")
    except Exception as exc:
        warn(f"could not read {path.name}: {exc}")
    return env


def slugify(text: str, max_len: int = 60) -> str:
    text = unicodedata.normalize("NFKD", str(text))
    text = text.encode("ascii", "ignore").decode("ascii").lower()
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return text[:max_len] or "paper"


def lenient_json(text: str):
    """Parse model output that may be fenced or wrapped; mirrors the app's parser."""
    if not text:
        return None
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?", "", cleaned).strip()
        cleaned = re.sub(r"```$", "", cleaned).strip()

    for candidate in (cleaned,):
        try:
            return json.loads(candidate)
        except Exception:
            pass

    # Object wrapper -> take the first list-valued field.
    start, end = cleaned.find("{"), cleaned.rfind("}")
    if start != -1 and end > start:
        try:
            obj = json.loads(cleaned[start : end + 1])
            for key in ("questions", "data", "items", "result"):
                if isinstance(obj.get(key), list):
                    return obj[key]
        except Exception:
            pass

    # Bare array.
    start, end = cleaned.find("["), cleaned.rfind("]")
    if start != -1 and end > start:
        try:
            return json.loads(cleaned[start : end + 1])
        except Exception:
            return None
    return None


# ── PDF reading ──────────────────────────────────────────────────────────────


def _has_embedded_images(page) -> bool:
    """Return True if a page contains raster images (formula images, figures)."""
    try:
        return len(page.get_images(full=False)) > 0
    except Exception:
        return False


def read_pdf(pdf_path: Path, max_pages: int | None = None, force_image: bool = False, dpi: int = NORMAL_DPI) -> dict:
    """
    Returns {
        "mode": "text"|"scanned"|"hybrid"|"force_image",
        "text": str,
        "images": [(mime, bytes), ...],
        "pages": int,
        "text_pages": int,
        "image_pages": int,
        "embedded_image_pages": int,
    }

    Logic:
    - force_image=True  → every page is rasterised regardless of text layer.
    - Otherwise, pages with a text layer >= MIN_TEXT_CHARS_PER_PAGE are read as
      text; fully-scanned pages are rendered to PNG.
    - If >= EMBEDDED_IMAGE_RATIO_THRESHOLD of text-layer pages also contain embedded
      raster images (formula figures, diagrams), the whole PDF is re-read in image
      mode so no formula is lost.
    """
    try:
        import pymupdf as fitz
    except ImportError:
        try:
            import fitz
        except ImportError:
            die("PyMuPDF is required. Install it with:  pip install pymupdf")

    doc = fitz.open(pdf_path)
    page_count = doc.page_count
    if max_pages:
        page_count = min(page_count, max_pages)

    # ── Pass 1: survey text / embedded-image ratio ───────────────────────────
    text_page_indices, scanned_page_indices, embedded_image_page_count = [], [], 0
    page_texts = {}

    for index in range(page_count):
        page = doc.load_page(index)
        page_text = (page.get_text() or "").strip()
        if len(page_text) >= MIN_TEXT_CHARS_PER_PAGE:
            text_page_indices.append(index)
            page_texts[index] = page_text
            if _has_embedded_images(page):
                embedded_image_page_count += 1
        else:
            scanned_page_indices.append(index)

    embedded_ratio = (
        embedded_image_page_count / max(len(text_page_indices), 1)
        if text_page_indices
        else 0.0
    )

    # ── Decide mode ──────────────────────────────────────────────────────────
    use_image_mode = (
        force_image
        or len(text_page_indices) < max(1, page_count // 2)
        or embedded_ratio >= EMBEDDED_IMAGE_RATIO_THRESHOLD
    )

    if use_image_mode:
        mode = "force_image" if force_image else ("hybrid" if text_page_indices and scanned_page_indices else "scanned")
        log(
            f"    rendering all {page_count} page(s) at {dpi} DPI"
            + (f" [{mode}: {embedded_image_page_count} text-pages have embedded formula images]" if not force_image else " [--force-image / --math]")
        )
        images = []
        for index in range(page_count):
            page = doc.load_page(index)
            pixmap = page.get_pixmap(dpi=dpi)
            images.append(("image/png", pixmap.tobytes("png")))
        doc.close()
        return {
            "mode": mode,
            "text": "",
            "images": images,
            "pages": page_count,
            "text_pages": len(text_page_indices),
            "image_pages": page_count,
            "embedded_image_pages": embedded_image_page_count,
        }

    # ── Pure text mode — render only the scanned pages ───────────────────────
    images = []
    for index in scanned_page_indices:
        page = doc.load_page(index)
        pixmap = page.get_pixmap(dpi=dpi)
        images.append(("image/png", pixmap.tobytes("png")))

    doc.close()
    combined_text = "\n\n".join(page_texts[i] for i in sorted(text_page_indices))
    return {
        "mode": "text",
        "text": combined_text.strip(),
        "images": images,
        "pages": page_count,
        "text_pages": len(text_page_indices),
        "image_pages": len(scanned_page_indices),
        "embedded_image_pages": embedded_image_page_count,
    }


# ── Gemini calls ─────────────────────────────────────────────────────────────


def gemini_generate(parts: list, api_key: str, models: list, max_output_tokens: int = 16000) -> str:
    """
    POST to generateContent, rotating through model candidates.
    Returns the model's text, or raises RuntimeError when every candidate fails.
    """
    last_error = "no model candidate produced a response"

    for model in models:
        payload = json.dumps(
            {
                "contents": [{"parts": parts}],
                "generationConfig": {
                    "temperature": 0.15,
                    "maxOutputTokens": max_output_tokens,
                    "responseMimeType": "application/json",
                },
            }
        ).encode("utf-8")

        request = urllib.request.Request(
            f"{GEMINI_ENDPOINT}/{model}:generateContent?key={api_key}",
            data=payload,
            headers={"Content-Type": "application/json"},
            method="POST",
        )

        try:
            with urllib.request.urlopen(request, timeout=240) as response:
                body = json.loads(response.read().decode("utf-8", errors="replace"))
        except urllib.error.HTTPError as exc:
            detail = ""
            try:
                detail = json.loads(exc.read().decode("utf-8", errors="replace")).get("error", {}).get("message", "")
            except Exception:
                pass
            if exc.code in (404, 429, 503):
                warn(f"{model} unavailable ({exc.code}){': ' + detail if detail else ''}")
                last_error = f"{model}: {exc.code} {detail}"
                continue
            raise RuntimeError(f"Gemini API error {exc.code}: {detail or exc.reason}") from exc
        except Exception as exc:
            last_error = str(exc)
            warn(f"{model} request failed: {exc}")
            continue

        candidates = body.get("candidates") or []
        if not candidates:
            last_error = f"{model}: response contained no candidates"
            continue
        response_parts = (candidates[0].get("content") or {}).get("parts") or []
        text = "\n".join(p.get("text", "") for p in response_parts if p.get("text")).strip()
        if text:
            return text
        last_error = f"{model}: empty response"

    raise RuntimeError(f"all Gemini models failed ({last_error})")


# ── Prompt templates ─────────────────────────────────────────────────────────

STANDARD_SCHEMA = """[
  {
    "questionNumber": 1,
    "stem": "Full question text. Preserve technical terms, code clauses and names. For 'Match the following', lay the two lists out on separate lines. If the stem references a figure, describe it first as '[Stem Figure: ...]'.",
    "options": [
      { "id": "A", "text": "Text of option A. If this option is an image/diagram, write '[Figure: one-sentence description]'" },
      { "id": "B", "text": "..." },
      { "id": "C", "text": "..." },
      { "id": "D", "text": "..." }
    ],
    "correctOption": "A",
    "explanation": "Concise worked justification for the key. For figure options: explain WHY the correct figure is right.",
    "subject": "Civil Engineering",
    "topic": "Soil Mechanics",
    "difficulty": "MEDIUM",
    "questionType": "CONCEPTUAL",
    "hasFigureOptions": false
  }
]"""

MATH_SCHEMA = """[
  {
    "questionNumber": 1,
    "stem": "Full question text. For equations use Unicode math: ∫, ∂, ∑, √, α, β, γ, δ, θ, σ, μ, ε, π, ∞, ≤, ≥, ≠, ², ³. For complex LaTeX enclose in $$...$$. Never leave a blank box — write the symbol you see. If the stem references a figure, describe it first: '[Stem Figure: simply-supported beam, span 6m, point load 10kN at mid-span]'.",
    "options": [
      { "id": "A", "text": "Exact value or expression, e.g. '42.5 kN/m²' or '2πr²'. If this option IS an image/graph/diagram, write: '[Figure: one-line description of what the image shows]'" },
      { "id": "B", "text": "..." },
      { "id": "C", "text": "..." },
      { "id": "D", "text": "..." }
    ],
    "correctOption": "A",
    "explanation": "Step-by-step justification. State the formula used, substitute values, give the result. For image options: explain WHY the correct figure/graph is right (e.g. 'the parabola opens upward because k>0'). Cite IS/ACI code clauses when applicable.",
    "formulaContext": "Primary formula: e.g. 'σ = P/A'. Include variable definitions.",
    "solutionSteps": "1. Identify given: ...\n2. Apply formula: ...\n3. Calculate: ...",
    "referenceSource": "IS 456:2000 Cl. 26.4 / ASCE 7-16 / etc. (leave blank if not applicable)",
    "subject": "Civil Engineering",
    "topic": "Structural Analysis",
    "difficulty": "HARD",
    "questionType": "DIAGRAM_BASED",
    "hasFigureOptions": true
  }
]"""

# Rules injected into every prompt (math and standard) when source is an image.
IMAGE_OPTION_RULES = """
IMAGE / FIGURE OPTIONS — MANDATORY RULES:
Some questions use diagrams, graphs, waveforms, circuits, or structural figures AS the answer
options (i.e. options A, B, C, D are four different images rather than text). Do this:

  STEP 1 — DETECT: Look at each option. Is it an image / drawing / graph rather than plain text?
  STEP 2 — DESCRIBE: If yes, write the option text as:
        "[Figure: <one clear, specific sentence describing exactly what the image shows>]"

  GOOD EXAMPLES:
    "[Figure: A sine wave with amplitude 2 and period 2π, starting at origin]"
    "[Figure: A beam with pin support at left, roller at right, UDL of w kN/m along full span]"
    "[Figure: A straight line y = 2x + 1 with positive slope crossing y-axis at 1]"
    "[Figure: A parabola opening upward with vertex at (0, -4)]"
    "[Figure: A Mohr's circle centred at (50, 0) MPa with radius 30 MPa]"
    "[Figure: A right-angled triangle, sides 3, 4, 5, angle θ at bottom-left vertex]"
    "[Figure: A stress-strain curve showing elastic region, yield point at σ_y, and fracture]"
    "[Figure: A velocity-time graph with constant positive acceleration from rest]"
    "[Figure: Circuit with resistor R and capacitor C in series, driven by voltage source V]"
    "[Figure: A T-shaped cross-section, flange 200×20mm, web 20×180mm]"
    "[Figure: A flow net with 5 flow channels and 12 equipotential drops]"
    "[Figure: Shear force diagram — zero at both ends, peak +20kN at mid-span]"
    "[Figure: A block diagram showing input → plant G(s) → output with unity feedback]"

  RULES:
    • Set hasFigureOptions: true if ANY option is a figure.
    • NEVER leave an option blank just because it is an image. Always describe it.
    • If you can only partially see an option image, write what you CAN see:
        "[Figure: partially visible — a curve with negative slope]"
    • If the STEM references a figure (e.g. "For the beam shown in Fig. 3"), describe THAT
      figure at the very start of the stem field:
        "[Stem Figure: simply-supported beam, span 8m, concentrated load 50kN at 3m from left] Find the reaction at left support."
    • The explanation MUST state WHY the correct figure is right, e.g.:
        "Option B is correct because the bending moment is zero at both simply-supported ends
         and maximum at mid-span, which matches the parabolic BMD shown."
"""


def build_prompt(meta: dict, source: str, math_mode: bool = False) -> str:
    origin = (
        "the attached page images of an official question paper"
        if source == "image"
        else "the extracted text of an official question paper"
    )
    schema = MATH_SCHEMA if math_mode else STANDARD_SCHEMA

    math_instructions = (
        """
MATHEMATICAL CONTENT RULES (apply to every question):
- READ every symbol, subscript, superscript, fraction and equation — never skip or blank them.
- Use Unicode where possible: α β γ δ ε ζ θ κ λ μ ν ξ π ρ σ τ φ ψ ω Δ Σ Ω
  ∫ ∬ ∂ ∇ √ ∛ ∞ ≤ ≥ ≠ ≈ ± × ÷ ² ³ ⁻¹ · → ↔ ⊥ ∥ ∴ ∵
- For complex expressions (matrices, multi-line integrals, continued fractions) wrap in $$ … $$
  using standard LaTeX: $$\\frac{d^2y}{dx^2} + 2\\frac{dy}{dx} + y = 0$$
- For 'Match the following': write "List I — 1. X  2. Y  3. Z | List II — a. P  b. Q  c. R"
- questionType must be one of:
    "CONCEPTUAL"     — fact/theory, no calculation
    "NUMERICAL"      — requires arithmetic/algebra to obtain a numeric answer
    "FORMULA_RECALL" — asks to identify/complete a formula or derive a result
    "DIAGRAM_BASED"  — involves a figure, graph, or circuit (describe figures in stem/options)
    "MATCH"          — match-the-following table
"""
        if math_mode
        else ""
    )

    standard_type_note = (
        '\n    - questionType: "CONCEPTUAL" | "NUMERICAL" | "FORMULA_RECALL".'
        if not math_mode
        else ""
    )

    # Image option rules apply whenever the source is visual (image mode).
    figure_rules = IMAGE_OPTION_RULES if source == "image" else ""

    return f"""You are an expert exam-paper digitizer and subject-matter examiner.

Paper: {meta['examName']} ({meta['year']}) — {meta['paperType']}

From {origin}, do the following:
1. OCR / read the content faithfully. Ignore headers, footers, page numbers, instructions and advertisements.
2. Extract EVERY multiple-choice question (MCQ). Never invent, merge or renumber questions.
3. For each question produce:
   - questionNumber: the number printed on the paper, else sequential order.
   - stem: the COMPLETE question text — preserve ALL symbols, values and units. If the stem references a figure, describe it first as "[Stem Figure: ...]".{standard_type_note}
   - options: exactly four entries with ids "A","B","C","D" (strip the leading "(A)" from the text).
     * Text options: write the exact text.
     * Image/figure options: write "[Figure: one-sentence description]".
   - correctOption: the printed key if visible; otherwise identify the authoritative answer.
   - explanation: a concise, high-yield justification. For image options: explain WHY the correct figure is right.
   - hasFigureOptions: true if ANY option is an image/graph/diagram; false otherwise.
   - subject: coarse subject, e.g. "Civil Engineering" or "Mathematics".
   - topic: the specific sub-topic, e.g. "Soil Mechanics", "Fluid Mechanics", "Indian Polity".
   - difficulty: "EASY" | "MEDIUM" | "HARD".{math_instructions}{figure_rules}

Return ONLY a valid JSON array matching exactly this shape (no markdown fences, no commentary):
{schema}

If a question is truly illegible (cannot read stem AND cannot describe any option at all), skip it.
NEVER skip a question just because its options are images — always describe the images.
"""


# ── Extraction ───────────────────────────────────────────────────────────────


def extract_from_source(source: dict, meta: dict, api_key: str, models: list, math_mode: bool = False) -> list:
    """
    Runs Gemini over the extracted text or the rendered images, in batches.
    Always prefers image mode when the source has images (force_image / hybrid / scanned).
    Falls back to text-chunking only for pure text-layer PDFs.
    """
    collected: list = []

    # Image mode (scanned, hybrid, force_image) — send page renders to Gemini Vision.
    if source["images"]:
        images = source["images"]
        batches = [images[i : i + IMAGE_BATCH_PAGES] for i in range(0, len(images), IMAGE_BATCH_PAGES)]
        if not batches:
            warn("no rendered pages to process — nothing extracted")
        for index, batch in enumerate(batches):
            log(f"    vision batch {index + 1}/{len(batches)} ({len(batch)} pages) …")
            parts = [{"text": build_prompt(meta, "image", math_mode=math_mode)}]
            for mime, blob in batch:
                parts.append(
                    {
                        "inlineData": {
                            "mimeType": mime,
                            "data": base64.b64encode(blob).decode("ascii"),
                        }
                    }
                )
            try:
                raw = gemini_generate(parts, api_key, models)
                parsed = lenient_json(raw)
                if isinstance(parsed, list):
                    collected.extend(parsed)
                else:
                    warn(f"vision batch {index + 1} did not return a JSON array; skipped")
            except RuntimeError as exc:
                warn(f"vision batch {index + 1} failed: {exc}")

    # Text-only fallback for pure text-layer PDFs.
    if not source["images"] and source["text"]:
        chunks = [
            source["text"][i : i + TEXT_CHUNK_CHARS]
            for i in range(0, len(source["text"]), TEXT_CHUNK_CHARS)
        ]
        for index, chunk in enumerate(chunks):
            log(f"    structuring text chunk {index + 1}/{len(chunks)} …")
            prompt = build_prompt(meta, "text", math_mode=math_mode)
            try:
                raw = gemini_generate(
                    [{"text": prompt}, {"text": f"--- PAPER TEXT (part {index + 1}) ---\n{chunk}"}],
                    api_key,
                    models,
                )
                parsed = lenient_json(raw)
                if isinstance(parsed, list):
                    collected.extend(parsed)
                else:
                    warn(f"text chunk {index + 1} did not return a JSON array; skipped")
            except RuntimeError as exc:
                warn(f"text chunk {index + 1} failed: {exc}")

    return collected


# ── Validation, de-duplication, grouping ─────────────────────────────────────

MATH_QUESTION_TYPES = {"NUMERICAL", "FORMULA_RECALL", "DIAGRAM_BASED", "MATCH"}
ALL_QUESTION_TYPES = {"CONCEPTUAL", "NUMERICAL", "FORMULA_RECALL", "DIAGRAM_BASED", "MATCH"}


def validate_questions(raw_list: list, meta: dict, math_mode: bool = False) -> tuple:
    """Returns (questions, rejected_count). Questions are fully normalised."""
    out, rejected = [], 0
    seen_stems = set()

    for entry in raw_list:
        if not isinstance(entry, dict):
            rejected += 1
            continue

        # ── Question type ──────────────────────────────────────────────────
        q_type = str(entry.get("questionType") or "").strip().upper()
        if q_type not in ALL_QUESTION_TYPES:
            q_type = "CONCEPTUAL"
        is_math_type = q_type in MATH_QUESTION_TYPES

        # ── Stem ──────────────────────────────────────────────────────────
        stem = str(entry.get("stem") or "").strip()
        min_stem = MIN_MATH_STEM_CHARS if (math_mode or is_math_type) else MIN_STEM_CHARS
        if len(stem) < min_stem:
            rejected += 1
            continue

        # ── Options ───────────────────────────────────────────────────────
        options = []
        raw_options = entry.get("options")
        if isinstance(raw_options, list):
            for idx, opt in enumerate(raw_options[:4]):
                text = str(opt.get("text") if isinstance(opt, dict) else opt or "").strip()
                options.append({"id": VALID_OPTION_IDS[idx], "text": text})

        # Detect figure-based options — "[Figure: ...]" is a valid non-empty option.
        def _is_valid_option_text(t: str) -> bool:
            if t:
                return True
            # "0" is a valid numeric answer; treat it as non-empty.
            return t == "0"

        def _is_figure_option(t: str) -> bool:
            return t.startswith("[Figure:") or t.startswith("[figure:")

        # If any option is a [Figure: ...] description, it counts as valid.
        # Replace truly blank options with a placeholder only if len matches.
        if len(options) != 4:
            rejected += 1
            continue

        has_figure_opts = any(_is_figure_option(o["text"]) for o in options)

        # For non-figure options: accept "0" as a valid numeric answer.
        bad_options = [
            o for o in options
            if not _is_valid_option_text(o["text"]) and not _is_figure_option(o["text"])
        ]
        if bad_options:
            if math_mode or is_math_type:
                # Replace blank non-figure options with "0" as a last resort.
                options = [
                    {"id": o["id"], "text": o["text"] if _is_valid_option_text(o["text"]) or _is_figure_option(o["text"]) else "0"}
                    for o in options
                ]
                if any(not o["text"] for o in options):
                    rejected += 1
                    continue
            else:
                rejected += 1
                continue

        # ── Answer key ────────────────────────────────────────────────────
        key = str(entry.get("correctOption") or "").strip().upper()[:1]
        if key not in VALID_OPTION_IDS:
            rejected += 1
            continue

        # ── De-duplicate ──────────────────────────────────────────────────
        # Strip math symbols for fingerprinting so "σ = 5" and "s=5" aren't both kept.
        fingerprint_text = re.sub(r"[^a-z0-9]+", "", stem.lower())[:180]
        if fingerprint_text in seen_stems:
            rejected += 1
            continue
        seen_stems.add(fingerprint_text)

        # ── Difficulty ────────────────────────────────────────────────────
        difficulty = str(entry.get("difficulty") or "").strip().upper()
        if difficulty not in ("EASY", "MEDIUM", "HARD"):
            difficulty = "HARD" if is_math_type else "MEDIUM"

        # ── Explanation ───────────────────────────────────────────────────
        explanation = str(entry.get("explanation") or "").strip()
        is_figure_q = has_figure_opts or q_type == "DIAGRAM_BASED"
        if not has_meaningful_explanation(explanation, math_mode=math_mode or is_math_type or is_figure_q):
            if math_mode or is_math_type or is_figure_q:
                formula_ctx = str(entry.get("formulaContext") or "").strip()
                steps = str(entry.get("solutionSteps") or "").strip()
                explanation = formula_ctx or steps or f"Correct answer: {key}."
            else:
                rejected += 1
                continue

        # ── Question number ───────────────────────────────────────────────
        try:
            question_number = int(entry.get("questionNumber") or 0)
        except (TypeError, ValueError):
            question_number = 0
        if question_number < 1:
            question_number = len(out) + 1

        # ── Extra fields ──────────────────────────────────────────────────
        formula_context = str(entry.get("formulaContext") or "").strip() or None
        solution_steps = str(entry.get("solutionSteps") or "").strip() or None
        reference_source = str(entry.get("referenceSource") or "").strip() or None

        # Auto-upgrade questionType for figure-option questions.
        if has_figure_opts and q_type == "CONCEPTUAL":
            q_type = "DIAGRAM_BASED"

        out.append(
            {
                "stem": stem,
                "options": options,
                "correctOption": key,
                "explanation": explanation,
                "formulaContext": formula_context,
                "solutionSteps": solution_steps,
                "referenceSource": reference_source,
                "hasFigureOptions": has_figure_opts,
                "subject": str(entry.get("subject") or meta.get("subject") or "General Studies").strip(),
                "topic": str(entry.get("topic") or meta.get("paperType") or meta["examName"]).strip(),
                "difficulty": difficulty,
                "questionType": q_type,
                "questionNumber": question_number,
            }
        )

    return out, rejected



def group_into_sections(questions: list, group_mode: str = "auto") -> list:
    """
    Groups questions into sub-heads by subject or topic.
    "auto" prefers subject when the paper spans ≥2 subjects; otherwise falls back to topic.
    Singletons are folded into a "General" bucket to avoid 100 one-question sections.
    """
    def subject_of(q):
        return q.get("subject") or "General"

    def topic_of(q):
        return q.get("topic") or q.get("subject") or "General"

    if group_mode == "subject":
        key_of = subject_of
    elif group_mode == "topic":
        key_of = topic_of
    else:
        distinct_subjects = {subject_of(q) for q in questions}
        key_of = subject_of if len(distinct_subjects) >= 2 else topic_of

    buckets: dict = {}
    for question in questions:
        buckets.setdefault(key_of(question), []).append(question)

    # Fold singletons away unless that destroys the entire grouping.
    if len(buckets) > 1:
        merged: dict = {}
        general: list = []
        for name, items in buckets.items():
            if len(items) < 2:
                general.extend(items)
            else:
                merged[name] = items
        if general:
            merged.setdefault("General", []).extend(general)
        buckets = merged

    ordered = sorted(buckets.items(), key=lambda kv: (-len(kv[1]), kv[0]))
    ordered = [(n, i) for n, i in ordered if n != "General"] + [
        (n, i) for n, i in ordered if n == "General"
    ]
    return [{"name": name, "questions": items} for name, items in ordered]


# ── Building the app objects ─────────────────────────────────────────────────


def build_paper_and_mock(meta: dict, sections: list) -> tuple:
    """Builds the PYQPaper and the MockTest whose sections are the sub-heads."""
    all_questions, counter = [], 0
    built_sections = []

    for section in sections:
        section_questions = []
        for question in section["questions"]:
            counter += 1
            section_questions.append(
                {
                    "id": f"pyq-{meta['slug']}-q{counter:03d}",
                    "questionNumber": counter,
                    "examId": meta["examId"],
                    "subject": question["subject"],
                    "topic": question["topic"],
                    "stem": question["stem"],
                    "options": question["options"],
                    "correctOption": question["correctOption"],
                    "explanation": question["explanation"],
                    # Math & diagram extras (None when not present):
                    "formulaContext": question.get("formulaContext"),
                    "solutionSteps": question.get("solutionSteps"),
                    "referenceSource": question.get("referenceSource"),
                    "hasFigureOptions": question.get("hasFigureOptions", False),
                    "difficulty": question["difficulty"],
                    "questionType": question["questionType"],
                    "sourceType": "PYQ",
                    "pyqYear": meta["year"],
                    "pyqExam": meta["examName"],
                }
            )
        built_sections.append(
            {
                "id": f"sec-{slugify(section['name'], 30)}",
                "name": section["name"],
                "totalQuestions": len(section_questions),
                "questions": section_questions,
            }
        )
        all_questions.extend(section_questions)

    total = len(all_questions)
    paper = {
        "id": f"pyq-{meta['slug']}",
        "examId": meta["examId"],
        "examName": meta["examName"],
        "year": meta["year"],
        "paperType": meta["paperType"],
        "totalQuestions": total,
        "downloadAvailable": True,
        "frequencyTags": [s["name"] for s in built_sections][:8],
        "questions": all_questions,
    }
    mock = {
        "id": f"mock-pyq-{meta['slug']}",
        "title": f"{meta['examName']} ({meta['year']}) — {meta['paperType']}",
        "examId": meta["examId"],
        "paperName": meta["paperType"],
        "durationMinutes": max(30, int(round(total * 1.5))),  # math papers need more time
        "totalMarks": total,
        "negativeMarksPerIncorrect": 0.25,
        "sections": built_sections,
    }
    return paper, mock


def rebuild_generated_ts(inbox: Path, dry_run: bool = False, math_mode: bool = False) -> tuple:
    """Regenerates src/data/pyq/generated.ts from every pyq-inbox/out/*.json."""
    out_dir = inbox / "out"
    papers, mocks = [], []
    counter = 0

    for json_path in sorted(out_dir.glob("*.json")):
        try:
            payload = json.loads(json_path.read_text(encoding="utf-8"))
        except Exception as exc:
            warn(f"skipping {json_path.name}: {exc}")
            continue
        meta = payload.get("meta") or {}
        meta.setdefault("slug", slugify(json_path.stem))
        meta.setdefault("examName", meta.get("examName") or json_path.stem)
        meta.setdefault("year", datetime.now().year)
        meta.setdefault("paperType", "Question Paper")
        meta.setdefault("examId", slugify(meta["examName"], 30))
        meta.setdefault("group", "auto")
        questions, rejected = validate_questions(payload.get("questions") or [], meta, math_mode=math_mode)
        if not questions:
            warn(f"skipping {json_path.name}: no validated questions (rejected {rejected})")
            continue
        if meta.get("slug") and questions:
            sections = group_into_sections(questions, meta.get("group") or "auto")
            paper, mock = build_paper_and_mock(meta, sections)
            papers.append(paper)
            mocks.append(mock)
            counter += len(paper["questions"])
            if rejected:
                log(f"  {json_path.name}: {rejected} invalid question(s) skipped")

    body = f"""// AUTO-GENERATED by tools/pyq_exporter/extract_pyq.py — DO NOT EDIT BY HAND.
//
// Regenerated from {len(papers)} paper(s) in pyq-inbox/out/*.json on every exporter run.
// To change anything here, fix the source JSON (or the PDF) and re-run:
//     pyq-inbox/import-pyq.bat   |   npm run pyq:rebuild
//
// Wired into src/data/mockData.ts: imported papers surface to students as mock
// tests (questions grouped under sub-heads) and in the PYQ archive.

import {{ PYQPaper, MockTest }} from '../../types';

export const GENERATED_PYQ_PAPERS = {json.dumps(papers, indent=2, ensure_ascii=False)} as unknown as PYQPaper[];

export const GENERATED_PYQ_MOCK_TESTS = {json.dumps(mocks, indent=2, ensure_ascii=False)} as unknown as MockTest[];
"""

    if dry_run:
        log(f"  (dry run) would write {GENERATED_TS.relative_to(REPO_ROOT)} — {len(papers)} paper(s), {counter} questions")
    else:
        GENERATED_TS.parent.mkdir(parents=True, exist_ok=True)
        GENERATED_TS.write_text(body, encoding="utf-8")
        log(f"  wrote {GENERATED_TS.relative_to(REPO_ROOT)} — {len(papers)} paper(s), {counter} questions")

    return papers, mocks


# ── Supabase (optional) ──────────────────────────────────────────────────────
#
# Mirrors validated papers into three tables the admin portal writes to:
# `questions`, `published_papers`, `custom_mock_tests`.
# Uses the PostgREST endpoint directly — no external deps beyond stdlib.

SUPABASE_TABLES = ("questions", "published_papers", "custom_mock_tests")


def _supabase_env() -> tuple[str, str]:
    """Returns (url, anon_key) resolved from .env / environment / repo defaults."""
    env = load_env(REPO_ROOT / ".env")
    env.update(load_env(DEFAULT_INBOX / ".env"))
    url = (
        os.environ.get("SUPABASE_URL")
        or os.environ.get("VITE_SUPABASE_URL")
        or env.get("SUPABASE_URL")
        or env.get("VITE_SUPABASE_URL")
        or ""
    ).strip()
    key = (
        os.environ.get("SUPABASE_ANON_KEY")
        or os.environ.get("VITE_SUPABASE_ANON_KEY")
        or os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
        or env.get("SUPABASE_ANON_KEY")
        or env.get("VITE_SUPABASE_ANON_KEY")
        or env.get("SUPABASE_SERVICE_ROLE_KEY")
        or ""
    ).strip()
    return url, key


def supabase_sync(papers: list, mocks: list, url: str, key: str) -> bool:
    """Mirror validated papers into the Supabase question bank; return True on success."""
    if not url or not key:
        log("  Supabase sync skipped (no URL/key). Repo files are the source of truth.")
        return True

    # Import schema_map from the same directory as this script.
    import importlib.util, sys as _sys
    _sm_path = Path(__file__).with_name("schema_map.py")
    _spec = importlib.util.spec_from_file_location("schema_map", _sm_path)
    _mod = importlib.util.module_from_spec(_spec)
    _spec.loader.exec_module(_mod)
    paper_to_row = _mod.paper_to_row
    mock_to_row = _mod.mock_to_row
    question_to_row = _mod.question_to_row

    headers = {
        "Authorization": f"Bearer {key}",
        "apikey": key,
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=minimal",
    }
    published_at = datetime.now(timezone.utc).isoformat(timespec="seconds")
    published_by = os.environ.get("PYQ_PUBLISHED_BY", "pyq-exporter")
    failures = 0

    def upsert(table: str, rows: list) -> bool:
        if not rows:
            return True
        req = urllib.request.Request(
            f"{url}/rest/v1/{table}",
            data=json.dumps(rows, ensure_ascii=False).encode("utf-8"),
            headers=headers,
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                return resp.status < 400
        except urllib.error.HTTPError as exc:
            body = exc.read().decode("utf-8", errors="replace")[:200]
            warn(f"{table}: HTTP {exc.code} {body}")
            return False
        except Exception as exc:
            warn(f"{table}: {exc}")
            return False

    for paper, mock in zip(papers, mocks):
        paper_payload = paper_to_row(
            {
                **paper,
                "publishedAt": published_at,
                "publishedBy": published_by,
                "source": "pyq-exporter",
            }
        )
        mock_payload = mock_to_row(
            {
                **mock,
                "publishedAt": published_at,
                "publishedBy": published_by,
                "source": "pyq-exporter",
            }
        )
        question_rows = [question_to_row(q) for q in paper["questions"]]
        ok = upsert("published_papers", [paper_payload])
        ok = upsert("custom_mock_tests", [mock_payload]) and ok
        ok = upsert("questions", question_rows) and ok
        if ok:
            log(f"  mirrored {paper['id']} ({len(question_rows)} questions)")
        else:
            failures += 1

    log(f"  Supabase sync: {len(papers) - failures} paper(s) mirrored, {failures} failed")
    return failures == 0


# ── Git ──────────────────────────────────────────────────────────────────────


def git(args: list, check: bool = False) -> subprocess.CompletedProcess:
    identity = []
    result = subprocess.run(["git", "config", "user.email"], cwd=REPO_ROOT, capture_output=True, text=True)
    if result.returncode != 0 or not (result.stdout or "").strip():
        identity = [
            "-c", f"user.name={os.environ.get('PYQ_GIT_NAME', 'ExamPilot PYQ Bot')}",
            "-c", f"user.email={os.environ.get('PYQ_GIT_EMAIL', 'pyq-bot@users.noreply.github.com')}",
            "-c", "commit.gpgsign=false",
        ]
    return subprocess.run(
        ["git", *identity, *args], cwd=REPO_ROOT, capture_output=True, text=True, check=check
    )


def commit_and_push(paths: list, message: str, push: bool) -> None:
    rel_paths = [str(p.relative_to(REPO_ROOT)) for p in paths if p.exists()]
    if not rel_paths:
        log("  nothing to commit")
        return

    if git(["rev-parse", "--is-inside-work-tree"]).returncode != 0:
        warn("not a git repository — skipping commit")
        return

    git(["add", "--", *rel_paths])
    staged = git(["diff", "--cached", "--name-only"])
    if not (staged.stdout or "").strip():
        log("  no changes staged (already committed)")
        return

    result = git(["commit", "-m", message])
    if result.returncode != 0:
        warn(f"commit failed: {(result.stderr or result.stdout).strip()[:300]}")
        return
    log(f"  committed: {git(['log', '--oneline', '-1']).stdout.strip()}")

    if not push:
        log("  not pushed (re-run with --push to publish)")
        return

    upstream = git(["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"])
    if upstream.returncode == 0:
        result = git(["push"])
    else:
        result = git(["push", "-u", "origin", "HEAD"])
    if result.returncode == 0:
        log("  pushed to origin")
    else:
        warn(f"push failed: {(result.stderr or result.stdout).strip()[:300]}")


# ── CLI ──────────────────────────────────────────────────────────────────────


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        prog="extract_pyq",
        description="Import previous-year question papers (PDF) into the ExamPilot question bank.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("--inbox", default=str(DEFAULT_INBOX), help="folder holding the PDFs (default: pyq-inbox)")
    parser.add_argument("--exam", help="exam name override (default: derived from the filename)")
    parser.add_argument("--year", type=int, help="paper year override")
    parser.add_argument("--paper-type", help="paper type override, e.g. 'Paper II (Technical)'")
    parser.add_argument("--subject", help="default subject when the model does not provide one")
    parser.add_argument("--group", choices=["auto", "subject", "topic"], default="auto", help="how sub-heads are derived")
    parser.add_argument("--model", help="pin a Gemini model instead of auto-rotating")
    parser.add_argument("--api-key", help="Gemini API key (default: GEMINI_API_KEY from .env or environment)")
    parser.add_argument("--max-pages", type=int, help="only read the first N pages (debugging)")
    parser.add_argument("--push", action="store_true", help="git push after committing (off by default)")
    parser.add_argument("--no-commit", action="store_true", help="write files but do not commit")
    parser.add_argument(
        "--math",
        action="store_true",
        help=(
            "Math/formula-heavy paper mode: renders ALL pages at high DPI (220), "
            "uses a math-aware Gemini prompt that outputs Unicode symbols and LaTeX, "
            "extracts formulaContext + solutionSteps + referenceSource, and relaxes "
            "the minimum stem/explanation length for NUMERICAL/FORMULA_RECALL questions."
        ),
    )
    parser.add_argument(
        "--force-image",
        action="store_true",
        help=(
            "Force every page to be rendered as an image (even text-layer PDFs). "
            "Useful when a PDF has a text layer but the questions include embedded "
            "formula images, diagrams, or graphs."
        ),
    )
    parser.add_argument(
        "--dpi",
        type=int,
        default=0,
        help=f"rasterisation DPI (default: {NORMAL_DPI} normal, {MATH_DPI} with --math)",
    )
    parser.add_argument(
        "--no-database", action="store_true", help="skip the database sync even if credentials are available"
    )
    parser.add_argument(
        "--supabase",
        nargs="?",
        const="",
        help="sync validated papers to Supabase (reads SUPABASE_URL/SUPABASE_ANON_KEY from env)",
    )
    parser.add_argument("--rebuild", action="store_true", help="regenerate src/data/pyq/generated.ts from pyq-inbox/out only")
    parser.add_argument("--from-json", help="import an already-extracted JSON instead of calling Gemini")
    parser.add_argument("--dry-run", action="store_true", help="parse and report, but write/commit nothing")
    parser.add_argument("--inspect", action="store_true", help="report text-vs-scanned stats for each PDF, then exit")
    # Kept for backwards-compat; does nothing (Firestore removed).
    parser.add_argument("--firebase", "--database", nargs="?", const="", help=argparse.SUPPRESS)
    return parser.parse_args()


def derive_meta(pdf_path: Path, args: argparse.Namespace, source_mode: str) -> dict:
    stem = pdf_path.stem
    year_match = re.search(r"(20\d{2})", stem)
    year = args.year or (int(year_match.group(1)) if year_match else datetime.now().year)

    exam_name = args.exam
    if not exam_name:
        cleaned = re.sub(r"(19|20)\d{2}", "", stem)
        cleaned = re.sub(r"[_\-]+", " ", cleaned)
        cleaned = re.sub(r"\b(pdf|paper|question|questions|engg|engineering)\b", " ", cleaned, flags=re.I)
        exam_name = re.sub(r"\s+", " ", cleaned).strip() or stem

    slug = slugify(f"{exam_name}-{year}" + (f"-{args.paper_type}" if args.paper_type else ""))
    return {
        "examName": exam_name,
        "year": year,
        "paperType": args.paper_type or "Question Paper",
        "subject": args.subject,
        "examId": slugify(exam_name, 30),
        "slug": slug,
        "group": args.group,
        "sourceFile": pdf_path.name,
        "sourceMode": source_mode,
        "mathMode": args.math,
        "extractedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
    }


def find_pdfs(inbox: Path) -> list:
    if not inbox.is_dir():
        return []
    skip = {"processed", "out"}
    return sorted(
        p
        for p in inbox.rglob("*.pdf")
        if not any(part.lower() in skip for part in p.relative_to(inbox).parts[:-1])
    )


def main() -> int:
    args = parse_args()
    inbox = Path(args.inbox).resolve()
    inbox.mkdir(parents=True, exist_ok=True)
    out_dir = inbox / "out"

    math_mode = args.math
    force_image = args.force_image or math_mode
    dpi = args.dpi or (MATH_DPI if math_mode else NORMAL_DPI)

    if math_mode:
        log("  [MATH MODE] High-DPI rendering, math-aware prompt, relaxed validation active.")
    elif force_image:
        log("  [FORCE IMAGE] All pages rendered as images.")

    # ── Rebuild-only fast path ─────────────────────────────────────────────
    if args.rebuild:
        log("Rebuilding src/data/pyq/generated.ts from pyq-inbox/out …")
        papers, mocks = rebuild_generated_ts(inbox, dry_run=args.dry_run, math_mode=math_mode)
        if not args.dry_run and not args.no_database:
            url, key = _supabase_env()
            if args.supabase is not None:
                url = url or os.environ.get("SUPABASE_URL", "")
                key = key or os.environ.get("SUPABASE_ANON_KEY", "")
            if url and key:
                log("\nSyncing to Supabase …")
                if not supabase_sync(papers, mocks, url, key):
                    die("Supabase sync failed — aborting")
        return 0

    pdfs = find_pdfs(inbox)

    # ── Diagnostics ───────────────────────────────────────────────────────
    if args.inspect:
        if not pdfs:
            die(f"no PDFs found in {inbox}")
        log(f"Inspecting {len(pdfs)} PDF(s):\n")
        for pdf in pdfs:
            source = read_pdf(pdf, args.max_pages, force_image=False, dpi=NORMAL_DPI)
            emb = source.get("embedded_image_pages", 0)
            rate = len(source["text"]) // max(1, source["pages"])
            log(
                f"  {pdf.name}\n"
                f"    pages={source['pages']}  text_pages={source['text_pages']}  "
                f"embedded_formula_pages={emb}  chars/page≈{rate}  mode={source['mode']}"
            )
        return 0

    env = load_env(REPO_ROOT / ".env")
    env.update(load_env(inbox / ".env"))
    api_key = (
        args.api_key
        or os.environ.get("GEMINI_API_KEY")
        or env.get("GEMINI_API_KEY")
        or env.get("VITE_GEMINI_API_KEY")
    )
    models = [args.model] if args.model else GEMINI_MODELS

    payloads = []

    if args.from_json:
        json_path = Path(args.from_json).resolve()
        if not json_path.is_file():
            die(f"--from-json file not found: {json_path}")
        payload = json.loads(json_path.read_text(encoding="utf-8"))
        if isinstance(payload, list):
            payload = {"meta": {}, "questions": payload}
        payload.setdefault("meta", {})
        payload["meta"].setdefault("slug", slugify(json_path.stem))
        payload["meta"].setdefault("examName", payload["meta"].get("slug", json_path.stem))
        payload["meta"].setdefault("year", args.year or datetime.now().year)
        payload["meta"].setdefault("paperType", "Question Paper")
        payload["meta"].setdefault("examId", slugify(payload["meta"]["examName"], 30))
        payload["meta"].setdefault("group", args.group)
        payload["meta"]["mathMode"] = math_mode
        payloads.append(payload)
        log(f"Loaded {len(payload.get('questions') or [])} raw question(s) from {json_path.name}")
    else:
        if not pdfs:
            die(
                f"no PDFs found in {inbox}\n\nPaste one or more question-paper PDFs into that folder, then re-run."
            )
        if not api_key:
            die(
                "no Gemini API key found.\n\n"
                "The exporter needs a key for OCR + structuring. Add it to .env at the repo root:\n"
                "    GEMINI_API_KEY=your_key_here\n"
                "Get one from https://aistudio.google.com/apikey, or pass --api-key."
            )

        for pdf in pdfs:
            log(f"\nReading {pdf.name} …")
            source = read_pdf(pdf, args.max_pages, force_image=force_image, dpi=dpi)
            meta = derive_meta(pdf, args, source["mode"])
            log(
                f"  {source['pages']} pages, mode={source['mode']}"
                f" (text={source['text_pages']}, image={source['image_pages']}"
                + (f", formula_embedded={source.get('embedded_image_pages', 0)}" if source.get('embedded_image_pages') else "")
                + ")"
            )
            try:
                raw_questions = extract_from_source(source, meta, api_key, models, math_mode=math_mode)
            except RuntimeError as exc:
                warn(f"extraction failed for {pdf.name}: {exc}")
                continue
            payloads.append({"meta": meta, "questions": raw_questions})

    if not payloads:
        die("nothing was extracted")

    # ── Validate, persist per-paper JSON ──────────────────────────────────
    out_dir.mkdir(parents=True, exist_ok=True)
    written_json = []
    total_kept = 0

    for payload in payloads:
        meta = payload["meta"]
        is_math = meta.get("mathMode", False) or math_mode
        questions, rejected = validate_questions(payload["questions"], meta, math_mode=is_math)
        sections = group_into_sections(questions, meta.get("group") or args.group)

        log(f"\n{meta['examName']} ({meta['year']}):")
        log(f"  {len(questions)} valid question(s), {rejected} rejected (malformed/duplicate)")
        for section in sections:
            log(f"    • {section['name']}: {len(section['questions'])}")

        if not questions:
            warn("no valid questions — paper skipped")
            continue

        normalized = {
            "meta": meta,
            "questions": questions,
            "stats": {
                "kept": len(questions),
                "rejected": rejected,
                "mathMode": is_math,
                "subHeads": [{"name": s["name"], "count": len(s["questions"])} for s in sections],
            },
        }
        json_path = out_dir / f"{meta['slug']}.json"
        if args.dry_run:
            log(f"  (dry run) would write {json_path.relative_to(REPO_ROOT)}")
        else:
            json_path.write_text(json.dumps(normalized, indent=2, ensure_ascii=False), encoding="utf-8")
            log(f"  wrote {json_path.relative_to(REPO_ROOT)}")
            written_json.append(json_path)
        total_kept += len(questions)

    # ── Regenerate the app-facing data module ─────────────────────────────
    log("\nRegenerating src/data/pyq/generated.ts …")
    papers, mocks = rebuild_generated_ts(inbox, dry_run=args.dry_run, math_mode=math_mode)

    if args.dry_run:
        log("\nDry run complete — nothing written.")
        return 0

    # ── Optional Supabase mirror ───────────────────────────────────────────
    if args.no_database:
        url, key = "", ""
    else:
        url, key = _supabase_env()
        if args.supabase is not None:
            url = url or os.environ.get("SUPABASE_URL", "")
            key = key or os.environ.get("SUPABASE_ANON_KEY", "")
    if url and key:
        log("\nSyncing to Supabase …")
        if not supabase_sync(papers, mocks, url, key):
            die("Supabase sync failed — aborting")

    # ── Commit / push ──────────────────────────────────────────────────────
    if not args.no_commit:
        log("\nCommitting …")
        commit_paths = [GENERATED_TS, *written_json]
        commit_and_push(
            commit_paths,
            f"Import {len(payloads)} PYQ paper(s) from pyq-inbox ({total_kept} questions)"
            + (" [math mode]" if math_mode else ""),
            push=args.push,
        )

    log(f"\nDone — {total_kept} question(s) across {len(papers)} paper(s) in the bank.")
    if not args.push:
        log("Review the summary above, then publish with:  pyq-inbox\\import-pyq.bat --push")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        die("interrupted", 130)
