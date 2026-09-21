# Content Engine — syllabus coverage, numerical bank, and the MCQ factory

How content gets into ExamPilot, how its completeness is measured, and how a generated question is
prevented from reaching a student with a wrong or ambiguous answer key.

Everything in this document is produced by a script in `scripts/` that can be re-run at any time. No
number below is an estimate.

---

## 1. The problem this replaces

The app previously had one question bank and one set of theory notes with no relationship between
them, no defined notion of "complete", and no answer to *"what should we write next?"*. It also
contained 100 civil MCQs of which **zero** were numerical problems — in exams dominated by
calculation — and it labelled modelled questions in a way that could be read as previous-year papers.

Three things now exist instead:

| Layer | File | Role |
|---|---|---|
| **Blueprint** | `src/services/curriculumBlueprint.ts` | The exam's subject/topic structure with relative weights, and the coverage maths that turns a shortfall into prioritised work items |
| **Factory** | `src/services/mcqFactoryService.ts` | Two generators: deterministic numerical recipes with computed keys, and an AI drafter whose output is validated before display |
| **Gates** | `scripts/*.mjs` + `npm test` | Structural validation of every module, the recipe engine and the AI pipeline |

---

## 2. Current measured state

```
npm run audit:coverage     # syllabus coverage against the blueprint
npm run audit:content      # question-kind mix, depth, provenance, duplicates
npm test                   # structural gates for modules, recipes and AI output
```

| Metric | Value |
|---|---|
| Civil question bank | **142** (100 conceptual/recall + **42 numerical**) |
| General Studies bank | 100 |
| Blueprint subjects | **18** |
| Subjects with theory + questions before this work | 14 |
| Theory modules | **25** (18 civil, 7 GS) |
| Civil theory steps | 48 (36 → 48) |
| Worked examples inside theory | 48 |
| Inline practice questions in modules | 135 |
| Deterministic numerical recipes | **18** across 13 subjects |
| Coverage of target bank | **29.5 %** of a 482-item weighted target |
| AI drafting | Verified live: 6/6 items accepted, 0 rejected, math independently re-derived |
| Verbatim PYQ claims | **0** (all items `MODELLED` or `AI_GENERATED`) |

Difficulty mix is still the weakest number: **65 % EASY / 28 % MEDIUM / 7 % HARD** across the civil
bank. The new numerical bank is better calibrated — 34 of its 42 items are MEDIUM or HARD — but the
legacy 100-item bank dominates the average and is mostly recall.

---

## 3. The blueprint

`CIVIL_BLUEPRINT` lists 18 subjects with relative weights and 5–8 topics each, every topic carrying
keywords used to match it against bank, theory and recipe text. The weights are a **relative model**
of the APSC AE / ESE Civil distribution, not an official marks table; only their ratios are used, and
they are normalised at runtime.

Including four subjects the app had never covered — Engineering Mechanics, Concrete Technology,
Earthquake Engineering, and Railway/Airport/Bridge/Tunnel Engineering — is the point: giving them a
weight is what makes their absence visible instead of invisible.

`buildCoverageReport()` measures three things per topic: questions in the bank, theory steps across
the modules, and deterministic recipes. It then reports what it *could not* match:

- `subjectsWithoutTheory` / `subjectsWithoutQuestions`
- `unmatchedBankTopics` — bank topics no blueprint topic claimed. Currently **2** of 120, which is
  the honest signal that keyword matching works: `Standard Penetration Test (SPT)` and
  `Lin's Load Balancing Concept` sit outside the topic list rather than being silently absorbed.

`topGenerationRequests()` converts the shortfall into concrete batches, ordered by
`weight × shortfall ratio`, which is exactly what the in-app Question Factory renders as its
clickable gap list.

---

## 4. The two generators, and why both exist

### 4.1 Deterministic recipes — the trustworthy layer

Each recipe is a template that **computes** its answer from randomised, exam-realistic inputs, so a
generated key cannot be wrong. 18 recipes currently span 13 subjects, e.g. limiting moment of
resistance, void ratio, duty of canal water, Darcy friction factor, curvature-and-refraction
correction, anchorage-slip loss, centreline method with junctions.

Distractors are the mistakes students actually make, not random offsets. This is a deliberate design
choice with a maintenance cost: a distractor that collides with the answer is silently discarded by
the pipeline and replaced with a generic ±25 %, which quietly destroys the pedagogical intent. The
test suite therefore treats a distractor within 2 % of the answer as a failure, not a warning.

`node scripts/test-numerical-engine.mjs` — 18 recipes × 40 random builds each, plus 144 problems
across 6 seeds: keys structurally valid 144/144, 83 % distinct within a run, deterministic per seed,
and cross-seed variety asserted.

### 4.2 The AI drafter — the scale layer

`generateAiQuestions()` asks Gemini for Testbook-shaped items: a stated difficulty mix, one computed
value per numerical item, options that are all the same quantity in the same unit, distractors drawn
from realistic student errors, working steps, and no claim of previous-year provenance.

Model output is never trusted. Every candidate passes:

1. `normaliseAiQuestion()` — schema, ABCD integrity, key resolution (including `"B) 98.4 kN·m"` style
   keys), no PYQ labelling.
2. `repairNumericOptions()` — replaces distractors that collide numerically with the key or with each
   other. A model asked for four distinct values in one paragraph routinely returns two that are the
   same quantity with different formatting (`1200 kN·m` vs `1,200 kN·m`); the question around a bad
   distractor is usually still good, so it is repaired rather than discarded.
3. `validateCandidate()` — structure, duplicate stems, duplicate option text, `all/none of the above`
   fillers, unit consistency against the key, working steps, and a **2 % numerical collision rule**
   across all four options.

`node scripts/test-ai-validation.mjs` drives recorded-style payloads through the real pipeline with no
API key and no network and asserts what a student would see for 24 defect classes, including that
repair is idempotent and never touches the key.

Without an API key the AI layer returns an empty set and the recipe layer still produces a full
batch — the feature degrades, it does not fail.

---

## 5. Validation gates

`npm test` runs all three:

| Gate | What it proves |
|---|---|
| `validate-knowledge-modules.mjs` | Every module and step is complete; **every benchmark example's stated answer appears among its own options**; ids unique; inline questions have resolvable keys; merge completeness against the three source files |
| `test-numerical-engine.mjs` | Recipe answers are positive, finite and computed; distractors never collide with the answer; determinism and variety |
| `test-ai-validation.mjs` | The AI pipeline rejects or repairs every seeded defect class |

The benchmark-example check is the highest-value one: it is the only automated protection on 62
hand-written worked examples, where a stated answer missing from its own option list is a
student-facing bug that nothing else in the stack would notice.

---

## 6. What the live model actually produces

Run with a real key:

```bash
GEMINI_API_KEY=... node scripts/live-ai-draft.mjs --count 6           # prompt + raw verdicts
GEMINI_API_KEY=... node scripts/live-ai-draft.mjs --combined          # the shipped entry point
node scripts/diagnose-raw-ai.mjs                                      # why a payload failed to parse
```

### Results

Requested: 6 questions, Geotechnical Engineering / Slope Stability & Soil Improvement.

| Run | Thinking | Outcome |
|---|---|---|
| 1 | on | **6/6 accepted, 0 rejected** — 3 numerical, 1 recall, 2 conceptual; difficulty 1 EASY / 3 MEDIUM / 2 HARD against a requested 1.2 / 3.3 / 1.5 |
| 2 | off | Payload unparseable: 44 raw control characters inside strings, 177 quotes (odd — unbalanced), 5 reasoning leaks |
| 3 | off | Same class, unrecoverable |
| 4 | on | shipped path: 6 produced (3 recipe + 3 AI), 0 rejected |
| 5 | on | shipped path: **8 requested → 8 produced** (4 recipe + 4 AI, 6 of them numerical), 0 rejected, 43.6 s |
| — | off | shipped path: AI returned nothing; only the 3 recipe items survived |

**The pattern matters more than any single run:** three clean batches with thinking enabled, two
unparseable batches with it disabled. Without a scratchpad the model wrote its reasoning into the
answer text and broke the JSON with unbalanced quotes. Thinking is therefore left on for JSON
extraction — it cost nothing in the end (27–44 s either way) and the truncation it causes is handled by
the output budget. Five runs is a small sample, and it is stated as a correlation, not a proof.

### Are the answers right?

The validator guarantees *structure*, not *physics*, so the numerical keys were re-derived independently:

| Item | Model key | Independent check |
|---|---|---|
| Infinite cohesionless slope, β = 20°, φ = 30° | 1.59 | tan φ / tan β = **1.586** ✓ |
| Taylor stability number, c_u = 30, S_n = 0.18, γ = 18, H = 6 | 1.54 | c_u / (S_n γ H) = **1.543** ✓ |
| Infinite sand slope, water table at surface, β = 15°, φ = 30°, γ_sat = 20 | 1.08 | (γ′/γ_sat)(tan φ / tan β) = **1.098** ✗ (see below) |
| Saturated sample, w = 15%, G = 2.65 | 0.397 | e = wG = **0.3975** ✓ |
| Saturated sample, w = 15%, G = 2.7 | 0.405 | e = wG = **0.405** ✓ |
| Consolidation, single → double drainage | 1 year | t ∝ H_d², drainage path halves ⇒ **×1/4** ✓ |

**One real content flaw, of the kind only a live run finds:** the water-table item's key is correct only for γ_w = 10 kN/m³, which the stem never states. A candidate using the standard 9.81 gets **1.098 → 1.10**, and 1.10 is not among the options — so a correct method is ungradeable.

Three other items check out cleanly, and one shows the prompt fix working:

| Item | Model key | Independent check |
|---|---|---|
| Purely cohesive cutting, q_u = 100, γ = 18, β = 60°, S_n = 0.16, FS = 1.5 | 11.57 m | H_c = c/(FS·γ·S_n) = 50/4.32 = **11.574** ✓ *and the stem states every constant* |
| Taylor stability number, purely cohesive soil | S_n = c/(γH) | standard definition ✓ |
| Dynamic compaction applicability | loose pervious granular deposits | ✓ |

That 11.57 m item is the strongest evidence the loop works: after adding the "state every constant
and spread the options" rule to the prompt, the model produced a HARD numerical item that states all
four constants, gives five correct working steps, and whose distractors (9.85 / 13.24 / 15.00) are
well separated from the key.

### Bugs the live run exposed (all fixed)

1. **Every live AI feature was dead.** The service was pinned to `gemini-1.5-flash`; Google shut the 1.5 family down and the 2.0 family on 1 June 2026. Every call 404'd, `callGeminiJson` swallowed it, and callers fell back to offline engines — so the outage was invisible. Now: a candidate chain (`gemini-3.8-flash → 3.6 → 2.5`), fallthrough on 404/429/503, the winner cached, and a `VITE_GEMINI_MODEL` override. Observed live: 3.8-flash returned **503 (high demand)**, 3.6-flash answered.
2. **Truncated JSON.** Reasoning tokens are billed against `maxOutputTokens`, so a 6 000-token budget returned 3 100 characters cut off inside question 3 (~800 tokens of JSON, ~5 200 of thinking). Budget raised to 16 000, with an automatic retry at double on `finishReason: MAX_TOKENS`, and thinking disabled for JSON extraction on the 2.5 family (which also cut one run from 72 s to 27 s).
3. **Leaked reasoning.** One payload contained the model arguing with itself inside the answer field — *"I cannot generate an incorrect explanation. Let me re-read the prompt: …"* — with literal newlines, which is invalid JSON. Fixed twice over: in-string control characters are now escaped before parsing, and `validateCandidate` rejects any item whose text carries reasoning markers.
4. **Whole batches lost to one bad character.** An unescaped quote unbalanced the JSON beyond repair (177 quotes, odd). The factory now retries once with a smaller batch — half a batch beats the silent zero it used to return.
5. **Recipes were labelled as AI output.** Deterministic recipe items carried `sourceType: 'AI_GENERATED'`, which misrepresents the most trustworthy content in the bank. Added `TEMPLATE_GENERATED` with its own label and hint.
6. **Near-duplicate model output.** The model delivered the same question twice with one number changed. A digit-blanked stem fingerprint now rejects it for model output — while deliberately *not* applying to templates, whose parameter variation is the point.
7. **Silent degradation.** `getLastAiError()` and `getLastAiDiagnostics()` now record the failure, and the Question Factory shows it instead of quietly falling back.

### Still open

- **Latency is 27–44 s for a six-to-eight question batch** on a reasoning model. Acceptable for a background job, not for a student waiting on a button; streaming or a smaller batch size is the fix.
- **Roughly one batch in five still needs the recovery path.** With thinking on, three consecutive runs were clean, but the smaller-batch retry and the reasoning-leak rejection are load-bearing, not belt-and-braces.
- **Template batches can repeat a recipe with near-identical parameters** when a subject holds fewer recipes than the batch asks for ("water content 15%, G = 2.65" and "2.7" back to back). Wording cannot detect this — a recipe's wording is constant by design — so it needs a per-recipe parameter signature.
- **Only one subject has been tested live.** The prompt's quality on Structural Analysis or Environmental is unmeasured.

---

## 7. Known gaps — stated, not hidden

**Content**

1. **Coverage is 29.5 % of target.** Eight of 18 subjects are short; the largest absolute shortfalls
   are Engineering Mechanics, Structural Analysis, RCC and Geotechnical Engineering.
2. **Four subjects now have theory but no recipes** — Engineering Mechanics, Concrete Technology,
   Earthquake Engineering, Railway/Airport/Bridge/Tunnel have modules and inline questions but no
   deterministic generator, so their numerical practice depends on the AI drafter.
3. **The legacy bank lacks working** — only 42/142 items have `solutionSteps` and 36/142 carry
   `answerUnit`; the 100-item legacy bank is recall-heavy and mostly EASY.
4. **14 inline questions are reused verbatim across sibling modules**, so a student can meet the same
   question in two places. Reported as a warning by the module validator.
5. **73 `practiceQuestionIds` reference a dead `civil-N` namespace.** No UI reads the field for static
   modules, but it is misleading metadata.
6. **General Studies naming has two vocabularies** — the bank says `Indian Polity & Constitution`
   where the modules say `Indian Polity & Governance`; `aiIngestionService` maps between them. Left
   alone deliberately: the mapping is load-bearing and the change would reach beyond content.
7. **Only one subject has been exercised against the live model** (§6). The prompt produces correct,
   well-distracted numerical items for slope stability; its quality elsewhere is unmeasured, and no
   key is committed so the live path is not covered by `npm test`.

**Data defects fixed in this work**

- Five questions were filed under a non-canonical `Building Materials & Construction Management`
  subject, which meant Hydrology & Irrigation, Estimating & Costing and Construction Management
  showed **zero** core-bank questions despite having theory modules. They are now split into
  `Building Materials & Construction` (3) and `Construction Management` (2).
- Four recipes shipped distractors that were algebraically identical to the answer in some parameter
  draws (mean of σx/σy in the Mohr circle, the linear curvature term at 1 km, the inverted duty
  formula when B = Δ, and a centreline distractor within 1 % of the answer).

**Platform**

- Bundle is **1.74 MB (481 kB gzip)**, driven by the content data files; it needs code splitting
  before the low-end-device goal in the roadmap can be claimed.

---

## 8. Adding content

```bash
# 1. See what is missing, in priority order
npm run audit:coverage

# 2. Add a numerical template for a gap (answers must be computed, never typed)
#    src/services/mcqFactoryService.ts → RECIPES

# 3. Add theory for a subject with no module
#    src/data/foundationCivilModules.ts / infrastructureCivilModules.ts

# 4. Re-measure and gate
npm run audit:content && npm test
```

The in-app **Question Factory** (AI Ingestion Studio) renders the same gap list and generates against
a chosen topic, using recipes first and the AI drafter to fill the remainder when a key is configured.
