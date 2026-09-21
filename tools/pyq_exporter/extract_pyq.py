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
2. Pulls the text layer with PyMuPDF. If a page has no usable text it is
   rendered to an image and OCR'd with Gemini vision (same provider the app's
   admin PDF ingestor uses).
3. Asks Gemini to structure the paper into MCQs: stem, options A-D, the correct
   key, a worked explanation, and a subject/topic.
4. Validates and de-duplicates, then groups the questions into **sub-heads**
   from their extracted subject/topic (see --group) and builds a MockTest whose
   `sections` are those sub-heads.
5. Writes:
     pyq-inbox/out/<slug>.json     raw + validated extraction (the source of truth)
     src/data/pyq/generated.ts     the app's question bank, regenerated from out/
 6. Syncs validated papers to Firestore when a service account is available.
 7. Commits the result. Pushing requires an explicit --push.


The git push is deliberately opt-in: a mis-OCR'd answer key should never be
published to a public repo without a human looking at the summary first.

Examples
--------
    extract_pyq.py --inspect                       # diagnose text vs scanned, no API calls
    extract_pyq.py                                 # import everything in the inbox
    extract_pyq.py --push                          # ...and publish
    extract_pyq.py --rebuild                       # regenerate generated.ts only
    extract_pyq.py --from-json pyq-inbox/out/x.json # import an already-extracted paper
    extract_pyq.py --group topic                   # group sub-heads by topic instead of auto
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

# Windows consoles default to cp1252 and blow up on the arrows/emoji below.
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
# Mirrors DEFAULT_GEMINI_MODELS in src/services/geminiService.ts — most recent GA
# flash models first, older ones as fallbacks for 404/429/503.
GEMINI_MODELS = [
    "gemini-3.5-flash-lite",
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
    "gemini-3.8-flash",
]

# A page yielding less than this many characters is treated as scanned/imagery.
MIN_TEXT_CHARS_PER_PAGE = 80
# Pages per Gemini request when OCR-ing images (token + payload sanity).
IMAGE_BATCH_PAGES = 4
# Characters per Gemini request when structuring an extracted text layer.
TEXT_CHUNK_CHARS = 12000
VALID_OPTION_IDS = ("A", "B", "C", "D")
MIN_EXPLANATION_CHARS = 12
GENERIC_EXPLANATION_PATTERNS = (
    re.compile(r"^official answer key:\s*\([A-D]\)\.?$", re.I),
    re.compile(r"^official answer is\s*\([A-D]\)\.?$", re.I),
    re.compile(r"^answer:\s*[A-D]\.?$", re.I),
    re.compile(r"^(?:n/?a|not available|not provided|see solution|no explanation)$", re.I),
)


def has_meaningful_explanation(value) -> bool:
    text = str(value or "").strip()
    return len(text) >= MIN_EXPLANATION_CHARS and not any(
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
    """Minimal .env reader — enough for KEY=VALUE, ignores comments/blank lines."""
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
    except Exception as exc:  # pragma: no cover - defensive
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


def read_pdf(pdf_path: Path, max_pages: int | None = None) -> dict:
    """
    Returns {"mode": "text"|"scanned", "text": str, "images": [(mime, bytes)], "pages": n}

    Text pages are read via PyMuPDF. Pages with no text layer are rendered to PNG
    so Gemini can OCR them.
    """
    try:
        import pymupdf as fitz  # PyMuPDF (the `fitz` alias is deprecated)
    except ImportError:
        try:
            import fitz  # older PyMuPDF builds only expose this name
        except ImportError:
            die("PyMuPDF is required. Install it with:  pip install pymupdf")

    doc = fitz.open(pdf_path)
    page_count = doc.page_count
    if max_pages:
        page_count = min(page_count, max_pages)

    texts, images = [], []
    text_pages = 0

    for index in range(page_count):
        page = doc.load_page(index)
        page_text = (page.get_text() or "").strip()
        if len(page_text) >= MIN_TEXT_CHARS_PER_PAGE:
            texts.append(page_text)
            text_pages += 1
        else:
            # Scanned/imagery page — rasterise for the vision model.
            pixmap = page.get_pixmap(dpi=150)
            images.append(("image/png", pixmap.tobytes("png")))

    doc.close()

    mode = "text" if text_pages >= max(1, page_count // 2) else "scanned"
    return {
        "mode": mode,
        "text": "\n\n".join(texts).strip(),
        "images": images,
        "pages": page_count,
        "text_pages": text_pages,
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
                    "temperature": 0.2,
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
            with urllib.request.urlopen(request, timeout=180) as response:
                body = json.loads(response.read().decode("utf-8", errors="replace"))
        except urllib.error.HTTPError as exc:
            detail = ""
            try:
                detail = json.loads(exc.read().decode("utf-8", errors="replace")).get("error", {}).get("message", "")
            except Exception:
                pass
            # A retired/overloaded model is worth retrying with the next name.
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


QUESTION_SCHEMA = """[
  {
    "questionNumber": 1,
    "stem": "Full question text. Preserve technical terms, code clauses and names. For 'Match the following', lay the two lists out on separate lines.",
    "options": [
      { "id": "A", "text": "..." },
      { "id": "B", "text": "..." },
      { "id": "C", "text": "..." },
      { "id": "D", "text": "..." }
    ],
    "correctOption": "A",
    "explanation": "Concise worked justification for the key.",
    "subject": "Civil Engineering",
    "topic": "Soil Mechanics",
    "difficulty": "MEDIUM",
    "questionType": "CONCEPTUAL"
  }
]"""


def build_prompt(meta: dict, source: str) -> str:
    origin = "the attached page images of an official question paper" if source == "image" else "the extracted text of an official question paper"
    return f"""You are an exam-paper digitizer and subject-matter examiner.

Paper: {meta['examName']} ({meta['year']}) — {meta['paperType']}

From {origin}, do the following:
1. OCR / read the content faithfully. Ignore headers, footers, page numbers, instructions and advertisements.
2. Extract EVERY multiple-choice question (MCQ). Never invent, merge or renumber questions.
3. For each question produce:
   - questionNumber: the number printed on the paper, else sequential order.
   - stem: the complete question text. For "Match the following", put 'a. X   1. Y' pairs on separate lines.
   - options: exactly four entries with ids "A","B","C","D" (strip the leading "(A)" from the text).
   - correctOption: the printed key if the paper shows one; otherwise work out the authoritative answer.
   - explanation: a short, high-yield justification (one or two sentences, cite a standard/clause when apt).
   - subject: coarse subject, e.g. "Civil Engineering" or "General Studies".
   - topic: the specific sub-head, e.g. "Soil Mechanics", "Indian Polity", "Assam History".
   - difficulty: "EASY" | "MEDIUM" | "HARD".
   - questionType: "CONCEPTUAL" | "NUMERICAL" | "FORMULA_RECALL".

Return ONLY a valid JSON array matching exactly this shape (no markdown fences, no commentary):
{QUESTION_SCHEMA}

If a question is illegible or has fewer than four options, skip it rather than guessing.
"""


def extract_from_source(source: dict, meta: dict, api_key: str, models: list) -> list:
    """Runs Gemini over the extracted text or the rendered images, in batches."""
    collected: list = []

    if source["mode"] == "text" and source["text"]:
        chunks = [
            source["text"][i : i + TEXT_CHUNK_CHARS]
            for i in range(0, len(source["text"]), TEXT_CHUNK_CHARS)
        ]
        for index, chunk in enumerate(chunks):
            log(f"    structuring text chunk {index + 1}/{len(chunks)} …")
            prompt = build_prompt(meta, "text")
            raw = gemini_generate(
                [{"text": prompt}, {"text": f"--- PAPER TEXT (part {index + 1}) ---\n{chunk}"}],
                api_key,
                models,
            )
            parsed = lenient_json(raw)
            if isinstance(parsed, list):
                collected.extend(parsed)
            else:
                warn(f"chunk {index + 1} did not return a JSON array; skipped")
    else:
        images = source["images"]
        batches = [images[i : i + IMAGE_BATCH_PAGES] for i in range(0, len(images), IMAGE_BATCH_PAGES)]
        if not batches:
            warn("no text and no rendered pages — nothing to extract")
        for index, batch in enumerate(batches):
            log(f"    OCR image batch {index + 1}/{len(batches)} ({len(batch)} pages) …")
            parts = [{"text": build_prompt(meta, "image")}]
            for mime, blob in batch:
                parts.append(
                    {
                        "inlineData": {
                            "mimeType": mime,
                            "data": base64.b64encode(blob).decode("ascii"),
                        }
                    }
                )
            raw = gemini_generate(parts, api_key, models)
            parsed = lenient_json(raw)
            if isinstance(parsed, list):
                collected.extend(parsed)
            else:
                warn(f"image batch {index + 1} did not return a JSON array; skipped")

    return collected


# ── Validation, de-duplication, grouping ─────────────────────────────────────


def validate_questions(raw_list: list, meta: dict) -> tuple:
    """Returns (questions, rejected_count). Questions are fully normalised."""
    out, rejected = [], 0
    seen_stems = set()
    exam_slug = meta["slug"]

    for entry in raw_list:
        if not isinstance(entry, dict):
            rejected += 1
            continue
        stem = str(entry.get("stem") or "").strip()
        if len(stem) < 12:
            rejected += 1
            continue

        options = []
        raw_options = entry.get("options")
        if isinstance(raw_options, list):
            for idx, opt in enumerate(raw_options[:4]):
                text = str(opt.get("text") if isinstance(opt, dict) else opt or "").strip()
                options.append({"id": VALID_OPTION_IDS[idx], "text": text})
        if len(options) != 4 or any(not o["text"] for o in options):
            rejected += 1
            continue

        key = str(entry.get("correctOption") or "").strip().upper()[:1]
        if key not in VALID_OPTION_IDS:
            rejected += 1
            continue

        fingerprint = re.sub(r"[^a-z0-9]+", "", stem.lower())[:180]
        if fingerprint in seen_stems:
            rejected += 1  # duplicate
            continue
        seen_stems.add(fingerprint)

        difficulty = str(entry.get("difficulty") or "").strip().upper()
        if difficulty not in ("EASY", "MEDIUM", "HARD"):
            difficulty = "MEDIUM"
        q_type = str(entry.get("questionType") or "").strip().upper()
        if q_type not in ("CONCEPTUAL", "NUMERICAL", "FORMULA_RECALL"):
            q_type = "CONCEPTUAL"

        explanation = str(entry.get("explanation") or "").strip()
        if not has_meaningful_explanation(explanation):
            rejected += 1
            continue

        try:
            question_number = int(entry.get("questionNumber") or 0)
        except (TypeError, ValueError):
            question_number = 0
        if question_number < 1:
            question_number = len(out) + 1

        out.append(
            {
                "stem": stem,
                "options": options,
                "correctOption": key,
                "explanation": explanation,
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
    Groups questions into sub-heads.

    Decision: sub-heads come from the extracted subject/topic rather than the
    paper's printed section titles, because papers are frequently a single
    undifferentiated run of 100 questions.

    'auto' prefers `subject` when the paper spans several subjects, and falls back
    to the finer-grained `topic` when it does not. Groups with a single question
    are folded into a 'General' bucket so a 100-question paper does not produce
    100 one-question sections.
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

    # Fold singletons away unless that would destroy the whole grouping.
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
        "durationMinutes": max(30, int(round(total * 1.2))),
        "totalMarks": total,
        "negativeMarksPerIncorrect": 0.25,
        "sections": built_sections,
    }
    return paper, mock


def rebuild_generated_ts(inbox: Path, dry_run: bool = False) -> tuple:
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
        questions = payload.get("questions") or []
        if meta.get("slug") and questions:
            sections = group_into_sections(questions, meta.get("group") or "auto")
            paper, mock = build_paper_and_mock(meta, sections)
            papers.append(paper)
            mocks.append(mock)
            counter += len(paper["questions"])

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


# ── Firestore (optional) ─────────────────────────────────────────────────────


def to_firestore_value(value):
    """Converts a Python value to a Firestore REST typed value."""
    if value is None:
        return {"nullValue": None}
    if isinstance(value, bool):
        return {"booleanValue": value}
    if isinstance(value, int):
        return {"integerValue": str(value)}
    if isinstance(value, float):
        return {"doubleValue": value}
    if isinstance(value, str):
        return {"stringValue": value}
    if isinstance(value, list):
        return {"arrayValue": {"values": [to_firestore_value(v) for v in value]}}
    if isinstance(value, dict):
        return {"mapValue": {"fields": {k: to_firestore_value(v) for k, v in value.items() if v is not None}}}
    return {"stringValue": str(value)}


def firestore_sync(papers: list, mocks: list, service_account_path: str | None) -> None:
    """
    Best-effort mirror of the import into Firestore catalogs.

    Uses a service account, which bypasses security rules, so this works even
    though the rules now require an `admin` custom claim for browser writes.
    """
    if not service_account_path:
        log("  Firestore sync skipped (no --firebase / service account). Repo files are the source of truth.")
        return

    account_file = Path(service_account_path)
    if not account_file.is_file():
        warn(f"service account not found at {account_file} — skipping Firestore sync")
        return

    try:
        import requests
        from google.auth.transport.requests import Request as GoogleRequest
        from google.oauth2 import service_account
    except ImportError:
        warn("google-auth and requests are required for Firestore sync: pip install google-auth requests")
        return

    try:
        credentials = service_account.Credentials.from_service_account_file(
            str(account_file), scopes=["https://www.googleapis.com/auth/datastore"]
        )
        credentials.refresh(GoogleRequest())
        project_id = json.loads(account_file.read_text(encoding="utf-8"))["project_id"]
    except Exception as exc:
        warn(f"could not authenticate with the service account: {exc}")
        return

    base = f"https://firestore.googleapis.com/v1/projects/{project_id}/databases/(default)/documents"
    headers = {"Authorization": f"Bearer {credentials.token}", "Content-Type": "application/json"}
    written = 0
    failures = 0

    def put(collection: str, doc_id: str, payload: dict) -> bool:
        url = f"{base}/{collection}/{doc_id}"
        body = json.dumps({"fields": {k: to_firestore_value(v) for k, v in payload.items() if v is not None}})
        try:
            response = requests.patch(url, headers=headers, data=body, timeout=30)
            if response.status_code >= 400:
                warn(f"{collection}/{doc_id}: HTTP {response.status_code} {response.text[:160]}")
                return False
            return True
        except Exception as exc:
            warn(f"{collection}/{doc_id}: {exc}")
            return False

    for paper, mock in zip(papers, mocks):
        ok = put("published_papers", paper["id"], {**paper, "source": "pyq-exporter"})
        ok = put("custom_mock_tests", mock["id"], {**mock, "source": "pyq-exporter"}) and ok
        for question in paper["questions"]:
            ok = put("questions", question["id"], question) and ok
        if ok:
            written += 1
        else:
            failures += 1

    log(f"  Firestore sync: {written} paper(s) mirrored, {failures} failed")


# ── Git ──────────────────────────────────────────────────────────────────────


def git(args: list, check: bool = False) -> subprocess.CompletedProcess:
    identity = []
    result = subprocess.run(["git", "config", "user.email"], cwd=REPO_ROOT, capture_output=True, text=True)
    if result.returncode != 0 or not (result.stdout or "").strip():
        # No global identity on this machine — supply a one-off author so an
        # automated import never fails on an unset user.email.
        identity = [
            "-c",
            f"user.name={os.environ.get('PYQ_GIT_NAME', 'ExamPilot PYQ Bot')}",
            "-c",
            f"user.email={os.environ.get('PYQ_GIT_EMAIL', 'pyq-bot@users.noreply.github.com')}",
            "-c",
            "commit.gpgsign=false",
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
    parser.add_argument("--subject", help="default subject when the model does not give one")
    parser.add_argument("--group", choices=["auto", "subject", "topic"], default="auto", help="how sub-heads are derived")
    parser.add_argument("--model", help="pin a Gemini model instead of auto-rotating")
    parser.add_argument("--api-key", help="Gemini API key (default: GEMINI_API_KEY from the environment or .env)")
    parser.add_argument("--max-pages", type=int, help="only read the first N pages (debugging)")
    parser.add_argument("--push", action="store_true", help="git push after committing (off by default)")
    parser.add_argument("--no-commit", action="store_true", help="write files but do not commit")
    parser.add_argument("--firebase", "--database", nargs="?", const="", help="path to a service account JSON for the Firestore sync")
    parser.add_argument("--no-database", action="store_true", help="skip Firestore sync even if a service account is available")
    parser.add_argument("--rebuild", action="store_true", help="regenerate src/data/pyq/generated.ts from pyq-inbox/out only")
    parser.add_argument("--from-json", help="import an already-extracted JSON instead of calling Gemini")
    parser.add_argument("--dry-run", action="store_true", help="parse and report, but write/commit nothing")
    parser.add_argument("--inspect", action="store_true", help="report whether each PDF is text or scanned, then exit")
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

    # ── Rebuild-only fast path ──
    if args.rebuild:
        log("Rebuilding src/data/pyq/generated.ts from pyq-inbox/out …")
        rebuild_generated_ts(inbox, dry_run=args.dry_run)
        return 0

    pdfs = find_pdfs(inbox)

    # ── Diagnostics ──
    if args.inspect:
        if not pdfs:
            die(f"no PDFs found in {inbox}")
        log(f"Inspecting {len(pdfs)} PDF(s):\n")
        for pdf in pdfs:
            source = read_pdf(pdf, args.max_pages)
            rate = len(source["text"]) // max(1, source["pages"])
            log(
                f"  {pdf.name}\n"
                f"    pages={source['pages']}  text_pages={source['text_pages']}  "
                f"chars/page≈{rate}  mode={source['mode']}"
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
            source = read_pdf(pdf, args.max_pages)
            meta = derive_meta(pdf, args, source["mode"])
            log(
                f"  {source['pages']} pages, mode={source['mode']}"
                f" ({source['text_pages']} with a text layer)"
            )
            try:
                raw_questions = extract_from_source(source, meta, api_key, models)
            except RuntimeError as exc:
                warn(f"extraction failed for {pdf.name}: {exc}")
                continue
            payloads.append(
                {
                    "meta": meta,
                    "questions": raw_questions,
                }
            )

    if not payloads:
        die("nothing was extracted")

    # ── Validate, persist per-paper JSON ──
    out_dir.mkdir(parents=True, exist_ok=True)
    written_json = []
    total_kept = 0

    for payload in payloads:
        meta = payload["meta"]
        questions, rejected = validate_questions(payload["questions"], meta)
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

    # ── Regenerate the app-facing data module ──
    log("\nRegenerating src/data/pyq/generated.ts …")
    papers, mocks = rebuild_generated_ts(inbox, dry_run=args.dry_run)

    if args.dry_run:
        log("\nDry run complete — nothing written.")
        return 0

    # ── Optional Firestore mirror ──
    service_account = args.firebase
    if service_account == "":
        service_account = os.environ.get("FIREBASE_SERVICE_ACCOUNT") or str(inbox / "serviceAccount.json")
    if service_account:
        log("\nSyncing to Firestore …")
        firestore_sync(papers, mocks, service_account)

    # ── Commit / push ──
    if not args.no_commit:
        log("\nCommitting …")
        commit_paths = [GENERATED_TS, *written_json]
        commit_and_push(
            commit_paths,
            f"Import {len(payloads)} PYQ paper(s) from pyq-inbox ({total_kept} questions)",
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
