import type { AiChatMessage, MCQQuestion } from '../types';

/**
 * Shared Gemini client for live AI features (AI Tutor, MCQ Deep Dive).
 *
 * API key resolution order:
 * 1. Key saved by the user in the AI Ingestion Studio (localStorage)
 * 2. VITE_GEMINI_API_KEY environment variable
 *
 * When no key is available, callers must fall back to their built-in
 * offline engines so the app keeps working in demo mode.
 */

const GEMINI_KEY_STORAGE = 'exampilot_gemini_key';
const GEMINI_MODEL_STORAGE = 'exampilot_gemini_model';
const GEMINI_ENDPOINT_ROOT = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * A hard-coded model name is a time bomb, and this file was one.
 *
 * It shipped pinned to `gemini-1.5-flash`. Google shut the 1.5 family down (and
 * the 2.0 family on 1 June 2026), after which every live call returned 404 — and
 * because `callGeminiJson` swallows errors and the callers fall back to their
 * offline engines, the outage was completely invisible: the app simply never
 * used AI again. It took a live run against the API to surface it.
 *
 * So the name is now configurable and, when the API says a model does not exist,
 * the next candidate is tried and the one that worked is cached for the session.
 * The defaults are the current GA flash models, most recent first.
 */
export function cleanModelName(model: string): string {
  if (!model) return '';
  return model.trim().replace(/^models\//i, '');
}

export const DEFAULT_GEMINI_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  // Retired by Google. Kept last purely as a historical probe: a 404 here just
  // moves on to nothing, and it is never reached while a live model answers.
  'gemini-1.5-flash'
];

/** Model that actually answered, remembered so later calls skip the probe. */
let activeModel: string | null = null;

export function getSavedGeminiModel(): string {
  try {
    const stored = localStorage.getItem(GEMINI_MODEL_STORAGE);
    if (stored) return cleanModelName(stored);
  } catch {}
  const envModel = String((import.meta as any).env?.VITE_GEMINI_MODEL ?? '').trim();
  return cleanModelName(envModel) || DEFAULT_GEMINI_MODELS[0];
}

/** Models to try, most preferred first: user override, env, then the defaults. */
function candidateModels(): string[] {
  let stored = '';
  try {
    stored = localStorage.getItem(GEMINI_MODEL_STORAGE) ?? '';
  } catch {
    // localStorage unavailable — fall through to env/defaults
  }
  const envModel = String((import.meta as any).env?.VITE_GEMINI_MODEL ?? '').trim();
  const preferred = cleanModelName(stored) || cleanModelName(envModel);
  const rawList = preferred ? [preferred, ...DEFAULT_GEMINI_MODELS] : DEFAULT_GEMINI_MODELS;
  return [...new Set(rawList.map(cleanModelName).filter(Boolean))];
}

/** The model currently in use, for diagnostics and the settings UI. */
export function getActiveGeminiModel(): string | null {
  return activeModel;
}

/** Model candidates in resolution order, for diagnostics. */
export function getGeminiModelCandidates(): string[] {
  return activeModel ? [activeModel, ...candidateModels()] : candidateModels();
}

/** Google returns the useful detail inside the JSON error body. */
function extractApiMessage(body: string): string {
  try {
    return String(JSON.parse(body)?.error?.message ?? '').slice(0, 200);
  } catch {
    return body.slice(0, 200);
  }
}

export function getGeminiApiKey(): string {
  try {
    const stored = localStorage.getItem(GEMINI_KEY_STORAGE);
    if (stored && stored.trim()) return stored.trim();
  } catch {
    // localStorage unavailable (SSR/private mode) - ignore
  }
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  return envKey && String(envKey).trim() ? String(envKey).trim() : '';
}

export function setGeminiApiKey(key: string): void {
  try {
    const trimmed = key.trim();
    if (trimmed) {
      localStorage.setItem(GEMINI_KEY_STORAGE, trimmed);
    } else {
      localStorage.removeItem(GEMINI_KEY_STORAGE);
    }
  } catch {}
}

export function setGeminiModel(model: string): void {
  try {
    const cleaned = cleanModelName(model);
    if (cleaned) {
      localStorage.setItem(GEMINI_MODEL_STORAGE, cleaned);
      activeModel = cleaned;
    } else {
      localStorage.removeItem(GEMINI_MODEL_STORAGE);
      activeModel = null;
    }
  } catch {}
}

export function hasLiveAi(): boolean {
  return Boolean(getGeminiApiKey());
}

export interface AiReply {
  content: string;
  formula?: string;
  citations?: string[];
}

export async function callGemini(
  apiKey: string,
  prompt: string,
  opts: { json?: boolean; maxOutputTokens?: number; specificModel?: string } = {}
): Promise<string | null> {
  const candidateList = opts.specificModel
    ? [cleanModelName(opts.specificModel), ...candidateModels()]
    : (activeModel ? [activeModel, ...candidateModels()] : candidateModels());
  const models = [...new Set(candidateList.map(cleanModelName).filter(Boolean))];
  let lastError: Error | null = null;

  const baseConfig: Record<string, unknown> = {
    temperature: opts.json ? 0.4 : 0.4,
    maxOutputTokens: opts.maxOutputTokens ?? 2048,
    ...(opts.json ? { responseMimeType: 'application/json' } : {})
  };

  for (const rawModel of [...new Set(models)]) {
    const model = cleanModelName(rawModel);
    // Thinking is left ON deliberately, even for JSON extraction.
    //
    // Turning it off on the 2.5 family was tempting — it cut one run from 72 s to
    // 27 s and stopped the truncation that thinking tokens cause — but across the
    // live runs it correlated with a much worse failure: with no scratchpad, the
    // model wrote its reasoning into the *answer text* instead ("Let me re-read
    // the prompt: …"), which broke the JSON with unbalanced quotes and lost the
    // whole batch. Both unparseable runs were 2.5-flash with thinking disabled;
    // the clean runs were with it enabled. Slower and correct beats fast and
    // discarded, so the truncation is handled by the output budget instead.
    const response = await fetch(`${GEMINI_ENDPOINT_ROOT}/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: baseConfig
      })
    });

    if (response.ok) {
      activeModel = model;
      const data = await response.json();
      const candidate = data?.candidates?.[0];
      const parts = candidate?.content?.parts;
      const text = Array.isArray(parts)
        ? parts.map((p: any) => p?.text).filter(Boolean).join('\n').trim()
        : '';
      // finishReason "MAX_TOKENS" is the difference between "the model wrote
      // nonsense" and "we cut the model off mid-sentence" — without it, a
      // truncated JSON payload looks like a prompt problem.
      lastDiagnostics = {
        model,
        finishReason: candidate?.finishReason ?? null,
        rawText: text || null,
        error: null
      };
      // A shut-down model can also return 200 with an empty payload; treat that
      // as a failed candidate rather than a successful empty answer.
      if (text) return text;
      lastError = new Error(`Gemini returned an empty response for model "${model}"`);
      continue;
    }

    const body = await response.text().catch(() => '');
    const detail = extractApiMessage(body);

    // Worth trying the next candidate:
    //  404 — this model name no longer exists (the failure that hid for months)
    //  429 — rate limited on this model
    //  503 — the model is overloaded; the current GA flash model returns this
    //        under demand spikes, and the older ones usually still answer
    if (response.status === 404 || response.status === 429 || response.status === 503) {
      lastError = new Error(
        `Gemini model "${model}" unavailable (${response.status})${detail ? `: ${detail}` : ''}`
      );
      continue;
    }

    throw new Error(
      `Gemini API error: ${response.status} ${response.statusText}${detail ? ` — ${detail}` : ''}`
    );
  }

  throw lastError ?? new Error('Gemini API error: no usable model name');
}

export async function callGeminiMultimodal(
  apiKey: string,
  prompt: string,
  fileBase64: string,
  mimeType: string = 'application/pdf',
  opts: { json?: boolean; maxOutputTokens?: number; specificModel?: string } = {}
): Promise<string | null> {
  const candidateList = opts.specificModel
    ? [cleanModelName(opts.specificModel), ...candidateModels()]
    : (activeModel ? [activeModel, ...candidateModels()] : candidateModels());
  const models = [...new Set(candidateList.map(cleanModelName).filter(Boolean))];
  let lastError: Error | null = null;

  const baseConfig: Record<string, unknown> = {
    temperature: 0.2,
    maxOutputTokens: opts.maxOutputTokens ?? 16000,
    ...(opts.json ? { responseMimeType: 'application/json' } : {})
  };

  const cleanBase64 = fileBase64.includes(',') ? fileBase64.split(',')[1] : fileBase64;

  const parts: any[] = [
    { text: prompt },
    {
      inlineData: {
        mimeType: mimeType || 'application/pdf',
        data: cleanBase64
      }
    }
  ];

  for (const rawModel of [...new Set(models)]) {
    const model = cleanModelName(rawModel);
    try {
      const response = await fetch(`${GEMINI_ENDPOINT_ROOT}/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: baseConfig
        })
      });

      if (response.ok) {
        activeModel = model;
        const data = await response.json();
        const candidate = data?.candidates?.[0];
        const resParts = candidate?.content?.parts;
        const text = Array.isArray(resParts)
          ? resParts.map((p: any) => p?.text).filter(Boolean).join('\n').trim()
          : '';
        lastDiagnostics = {
          model,
          finishReason: candidate?.finishReason ?? null,
          rawText: text || null,
          error: null
        };
        if (text) return text;
        lastError = new Error(`Gemini returned an empty response for model "${model}"`);
        continue;
      }

      const body = await response.text().catch(() => '');
      const detail = extractApiMessage(body);
      if (response.status === 404 || response.status === 429 || response.status === 503) {
        lastError = new Error(
          `Gemini model "${model}" unavailable (${response.status})${detail ? `: ${detail}` : ''}`
        );
        continue;
      }
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}${detail ? ` — ${detail}` : ''}`);
    } catch (err: any) {
      lastError = err;
    }
  }

  if (lastError) {
    lastAiError = lastError.message;
    console.warn('[ExamPilot] Gemini Multimodal Error:', lastError.message);
  }
  return null;
}

async function callGeminiText(
  apiKey: string,
  prompt: string,
  maxOutputTokens = 1200
): Promise<string | null> {
  return callGemini(apiKey, prompt, { maxOutputTokens });
}

/**
 * Models may append metadata lines (FORMULA:/REFS:); strip them out of the
 * visible content and surface them as structured fields instead.
 */
function parseAiReply(raw: string): AiReply {
  const lines = raw.split('\n');
  const contentLines: string[] = [];
  let formula: string | undefined;
  const citations: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^FORMULA:\s*/i.test(trimmed)) {
      const value = trimmed.replace(/^FORMULA:\s*/i, '');
      if (value && !/^none$/i.test(value)) formula = value;
      continue;
    }
    if (/^REFS?:\s*/i.test(trimmed)) {
      const value = trimmed.replace(/^REFS?:\s*/i, '');
      if (value && !/^none$/i.test(value)) {
        value
          .split(/[;,|]/)
          .map((c) => c.trim())
          .filter(Boolean)
          .forEach((c) => citations.push(c));
      }
      continue;
    }
    contentLines.push(line);
  }

  return { content: contentLines.join('\n').trim(), formula, citations: citations.length ? citations : undefined };
}

const TUTOR_SYSTEM_PROMPT = `You are ExamPilot AI, a syllabus-aware technical tutor for Indian competitive engineering & civil services examinations (UPSC ESE/IES, APSC AE, SSC JE, GATE).

Rules:
- Ground every answer in official Indian standards (IS 456:2000, IS 800:2007, IS 1343, IS 13920, IRC codes) or standard textbooks (Modi & Seth, Terzaghi, CPHEEO) whenever relevant.
- Be concise, structured and exam-oriented: use short headings, numbered steps and bullet points in plain text (the UI renders plain text with line breaks).
- Always include the key formula in plain text notation.
- Finish with one high-yield exam trap or takeaway.
- If asked to generate MCQs, output exactly the requested number with options A-D and mark the correct option with an asterisk.

Output contract (very important):
- After the main answer, append at most two metadata lines:
  FORMULA: <single most important formula in plain text, or NONE>
  REFS: <comma-separated standard/code references, or NONE>
- These two lines will be hidden from the user and shown as structured chips.`;

export async function generateTutorReply(
  userText: string,
  history: AiChatMessage[] = [],
  examName?: string
): Promise<AiReply | null> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return null;

  const historyText = history
    .slice(-8)
    .map((m) => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content}`)
    .join('\n\n');

  const prompt = `${TUTOR_SYSTEM_PROMPT}

${examName ? `Target exam: ${examName}.` : ''}

${historyText ? `Conversation so far:\n${historyText}\n\n` : ''}Student question: ${userText}`;

  const raw = await callGeminiText(apiKey, prompt, 1400);
  if (!raw) return null;
  return parseAiReply(raw);
}

export async function generateMcqDeepDive(question: MCQQuestion): Promise<AiReply | null> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return null;

  const optionsText = question.options
    .map((o) => `${o.id}) ${o.text}`)
    .join('\n');

  const prompt = `${TUTOR_SYSTEM_PROMPT}

A student just attempted this ${question.difficulty} level question from ${question.pyqExam || 'a competitive exam'}:

Subject: ${question.subject}
Topic: ${question.topic}${question.subtopic ? ` / ${question.subtopic}` : ''}

Question:
${question.stem}

Options:
${optionsText}

Correct option: ${question.correctOption}
Existing working notes: ${question.explanation || '(none)'}

Produce an "AI Deep Dive" that goes beyond the existing notes:
1) Concept foundation - the principle/codal clause being tested.
2) Elimination logic - why each wrong option fails (brief, one line each).
3) Worked solution - step-by-step numerical or logical derivation.
4) Exam trap - the single most likely mistake an aspirant makes here.
Keep it under 280 words, plain text with clear line breaks.`;

  const raw = await callGeminiText(apiKey, prompt, 1000);
  if (!raw) return null;
  return parseAiReply(raw);
}

// ---------------------------------------------------------------------------
// AI-Generated Custom Mock Tests
// ---------------------------------------------------------------------------

/**
 * Reason the last AI call produced nothing, or null if it succeeded.
 *
 * Swallowing errors is right for the product — callers must degrade to the
 * offline engine — but it is how a total outage stayed invisible for months, so
 * the reason is now recorded and surfaced in the UI instead of only the console.
 */
let lastAiError: string | null = null;

export function getLastAiError(): string | null {
  return lastAiError;
}

/** What the most recent call actually did — model, finish reason, raw text. */
export interface AiDiagnostics {
  model: string | null;
  finishReason: string | null;
  rawText: string | null;
  error: string | null;
}

let lastDiagnostics: AiDiagnostics = { model: null, finishReason: null, rawText: null, error: null };

/**
 * Diagnostics for the last AI call. Exists because a swallowed failure is how
 * this path stayed dead for months: "AI unavailable" must be inspectable, down
 * to the raw payload and whether the model was truncated.
 */
export function getLastAiDiagnostics(): AiDiagnostics {
  return { ...lastDiagnostics, error: lastAiError };
}

/**
 * Generic JSON-mode call, used by the question factory.
 *
 * Returns null (never throws) when no key is configured or the model returns
 * something unparseable, so callers can fall back to the deterministic offline
 * generator instead of failing the user's request.
 */
/**
 * Output ceiling for a JSON batch call.
 *
 * Larger than it looks necessary because the current models are reasoning
 * models: on Gemini 2.5/3.x the *thinking* tokens are billed against
 * `maxOutputTokens`, not on top of it. A first live run against the real API
 * asked for 6 questions with a 6 000-token budget and got 3 100 characters back,
 * cut off inside question 3 — roughly 800 tokens of JSON plus ~5 200 tokens of
 * reasoning. Generation therefore starts high, and a truncated response is
 * retried with double the budget rather than thrown away.
 */
const JSON_OUTPUT_TOKENS = 16000;
const JSON_OUTPUT_TOKENS_MAX = 32000;

export async function callGeminiJson<T>(
  prompt: string,
  opts: { maxOutputTokens?: number; retries?: number } = {}
): Promise<T | null> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    lastAiError = 'No API key configured';
    return null;
  }

  let budget = opts.maxOutputTokens ?? JSON_OUTPUT_TOKENS;
  const attempts = opts.retries ?? 1;

  try {
    for (let attempt = 0; attempt <= attempts; attempt += 1) {
      const raw = await callGemini(apiKey, prompt, { json: true, maxOutputTokens: budget });
      if (!raw) {
        lastAiError = 'Model returned an empty response';
        return null;
      }

      const parsed = extractJson(raw) as T | null;
      if (parsed) {
        lastAiError = null;
        return parsed;
      }

      lastDiagnostics = { ...lastDiagnostics, rawText: raw };
      const truncated = lastDiagnostics.finishReason === 'MAX_TOKENS';

      // A truncated reply is a budget problem, not a prompt problem — retry
      // with more room before giving up on live generation entirely.
      if (truncated && attempt < attempts && budget < JSON_OUTPUT_TOKENS_MAX) {
        budget = Math.min(budget * 2, JSON_OUTPUT_TOKENS_MAX);
        console.warn(`Gemini reply truncated at ${budget / 2} tokens; retrying with ${budget}.`);
        continue;
      }

      lastAiError = truncated
        ? `Model response was truncated before the JSON closed (MAX_TOKENS at a ${budget}-token budget, ${raw.length} chars)`
        : `Model response was not valid JSON (finishReason ${lastDiagnostics.finishReason ?? 'unknown'}, ${raw.length} chars)`;
      return null;
    }
    return null;
  } catch (err) {
    lastAiError = err instanceof Error ? err.message : String(err);
    console.warn('callGeminiJson failed:', err);
    return null;
  }
}

export interface MockGenOptions {
  topicQuery: string;
  category: 'civil' | 'gs';
  questionCount: number;
  examName?: string;
  questionStyle?: 'mixed' | 'numerical' | 'conceptual';
  onProgress?: (currentBatch: number, totalBatches: number, message: string) => void;
}

/**
 * Escape raw control characters that appear *inside* JSON string literals.
 *
 * JSON forbids a literal newline inside a string, but models leak their own
 * reasoning into field values, and reasoning is written with real line breaks.
 * Measured live: a complete 33 225-character response carrying six perfectly
 * good questions was thrown away whole because one explanation field contained
 * 13 literal newlines. This makes such a payload parseable again instead of
 * losing the entire batch.
 */
function escapeControlCharsInStrings(text: string): string {
  let out = '';
  let inString = false;
  let escaped = false;
  for (const character of text) {
    if (escaped) {
      out += character;
      escaped = false;
      continue;
    }
    if (character === '\\') {
      out += character;
      escaped = true;
      continue;
    }
    if (character === '"') {
      inString = !inString;
      out += character;
      continue;
    }
    if (inString) {
      const code = character.charCodeAt(0);
      if (character === '\n') {
        out += '\\n';
        continue;
      }
      if (character === '\r') {
        out += '\\r';
        continue;
      }
      if (character === '\t') {
        out += '\\t';
        continue;
      }
      if (code < 32) {
        out += `\\u${code.toString(16).padStart(4, '0')}`;
        continue;
      }
    }
    out += character;
  }
  return out;
}

/** Parse, retrying once with in-string control characters escaped. */
function parseJsonLenient(candidate: string): any | null {
  try {
    return JSON.parse(candidate);
  } catch {
    try {
      return JSON.parse(escapeControlCharsInStrings(candidate));
    } catch {
      return null;
    }
  }
}

function extractJson(text: string): any | null {
  const direct = parseJsonLenient(text);
  if (direct !== null) return direct;

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) {
    const inner = parseJsonLenient(fenced[1].trim());
    if (inner !== null) return inner;
  }

  const start = text.search(/[[{]/);
  const end = Math.max(text.lastIndexOf(']'), text.lastIndexOf('}'));
  if (start !== -1 && end > start) {
    return parseJsonLenient(text.slice(start, end + 1));
  }
  return null;
}

function normalizeGeneratedQuestion(
  raw: any,
  index: number,
  category: 'civil' | 'gs'
): MCQQuestion | null {
  if (!raw || typeof raw.stem !== 'string' || !raw.stem.trim()) return null;

  const optionIds = ['A', 'B', 'C', 'D'];
  const rawOptions = Array.isArray(raw.options) ? raw.options : [];
  const options = rawOptions
    .slice(0, 4)
    .map((o: any, i: number) => ({
      id: optionIds[i],
      text: (typeof o === 'string' ? o : String(o?.text ?? '')).trim()
    }))
    .filter((o: { text: string }) => o.text);

  if (options.length !== 4) return null;

  let correct = String(raw.correctOption ?? '').trim().toUpperCase().slice(0, 1);
  if (!optionIds.includes(correct)) {
    const correctText =
      typeof raw.correctOption === 'string' && raw.correctOption.trim().length > 1
        ? raw.correctOption.trim()
        : null;
    correct = correctText
      ? options.find((o: { id: string; text: string }) => o.text === correctText)?.id ?? ''
      : '';
  }
  if (!optionIds.includes(correct)) return null;

  const diffRaw = String(raw.difficulty ?? '').toUpperCase();
  const difficulty: MCQQuestion['difficulty'] =
    diffRaw === 'EASY' || diffRaw === 'HARD' ? (diffRaw as MCQQuestion['difficulty']) : 'MEDIUM';

  return {
    id: `ai-mock-${Date.now()}-${index + 1}`,
    questionNumber: index + 1,
    examId: category === 'civil' ? 'apsc-ae-civil' : 'apsc-cce-gs',
    subject: typeof raw.subject === 'string' && raw.subject.trim() ? raw.subject.trim() : 'AI Generated',
    topic: typeof raw.topic === 'string' && raw.topic.trim() ? raw.topic.trim() : 'Mixed Topics',
    subtopic: typeof raw.subtopic === 'string' && raw.subtopic.trim() ? raw.subtopic.trim() : undefined,
    stem: raw.stem.trim(),
    formulaContext: typeof raw.formulaContext === 'string' && raw.formulaContext.trim() ? raw.formulaContext.trim() : null,
    options,
    correctOption: correct as 'A' | 'B' | 'C' | 'D',
    explanation:
      typeof raw.explanation === 'string' && raw.explanation.trim()
        ? raw.explanation.trim()
        : 'Refer to the governing standard provisions and syllabus references.',
    difficulty,
    pyqExam: 'AI Generated Mock',
    questionType: raw.questionType || (raw.formulaContext || raw.solutionSteps ? 'NUMERICAL' : 'CONCEPTUAL'),
    solutionSteps: Array.isArray(raw.solutionSteps) ? raw.solutionSteps.filter((s: any) => typeof s === 'string') : undefined,
    answerUnit: typeof raw.answerUnit === 'string' && raw.answerUnit.trim() ? raw.answerUnit.trim() : undefined
  };
}

/**
 * Generates a fresh exam-calibrated MCQ set for a custom mock test.
 * Batches requests (25 questions per call) to stay within output token limits.
 * Throws on API failure; returns a possibly-shorter list if the model
 * produced invalid questions (all questions are strictly validated).
 */
export async function generateMockTestQuestions(options: MockGenOptions): Promise<MCQQuestion[]> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) throw new Error('NO_GEMINI_KEY');

  const { topicQuery, category, questionCount, examName, questionStyle = 'mixed', onProgress } = options;
  const isNumerical = questionStyle === 'numerical';
  const batchSize = 25;
  const totalBatches = Math.ceil(questionCount / batchSize);
  const collected: MCQQuestion[] = [];

  for (let batch = 0; batch < totalBatches; batch++) {
    const remaining = questionCount - collected.length;
    if (remaining <= 0) break;

    onProgress?.(
      batch + 1,
      totalBatches,
      `Synthesizing ${isNumerical ? 'numerical calculation problems' : 'questions'} ${collected.length + 1}–${collected.length + remaining} (batch ${batch + 1}/${totalBatches})…`
    );

    const prompt = `You are a Chief Examination Calibrator for Indian competitive examinations (UPSC ESE/IES, APSC AE, SSC JE, GATE, APSC CCE).
Generate exactly ${remaining} fresh, high-quality, single-correct-answer MCQ questions for the topic: "${topicQuery}" (${category === 'civil' ? 'Civil Engineering technical paper' : 'General Studies — India & Assam'}).
${examName ? `Calibrate style and difficulty to the ${examName} examination pattern.` : ''}

${isNumerical ? `
CRITICAL INSTRUCTION — ALL QUESTIONS MUST BE STRICTLY NUMERICAL CALCULATION PROBLEMS:
- Each question stem MUST supply concrete numerical input parameters with engineering units (e.g. soil bulk unit weight γ = 18 kN/m³, depth Df = 1.5 m, cohesion c = 25 kPa, friction angle φ = 30°, discharge Q = 12 m³/s, bed slope S = 1/2500, Manning n = 0.015, beam b = 300 mm, d = 500 mm).
- The question stem must require computing a quantitative engineering answer.
- All 4 option choices (A, B, C, D) must be unit-bearing numerical values (e.g. '142.5 kPa', '648 kN/m²', '0.065 m³/s', '207 kN·m'). Distractors must reflect plausible formula or arithmetic student errors.
- "formulaContext" must provide the exact governing equation (e.g. 'q_ult = c·N_c + γ·D_f·N_q + 0.4·γ·B·N_γ', 'i_cr = (G-1)/(1+e)', 'e = (w·G)/S_r').
- "explanation" must demonstrate the complete step-by-step mathematical substitution and units conversion.
- "questionType" must be "NUMERICAL".
` : `
Rules:
- Mix difficulties: ~20% EASY, ~50% MEDIUM, ~30% HARD.
- Each question has exactly 4 options (ids A, B, C, D) with exactly one correct option.
- Include numerical problems where relevant; every number in the explanation must be verified.
- Explanations must solve step by step and cite the governing code clause / standard / source.
- Distribute across varied subtopics of the topic; no duplicate or trivially similar questions.
- Cover different aspects than typical recycled question banks; be original but authentic.
`}

Output MUST be valid JSON exactly matching this shape (no markdown fences, no commentary):
{
  "questions": [
    {
      "stem": "full question text with given parameters and units",
      "subject": "${category === 'civil' ? 'Civil Engineering' : 'General Studies'}",
      "topic": "${topicQuery}",
      "subtopic": "specific subtopic",
      "options": [ {"id": "A", "text": "..."}, {"id": "B", "text": "..."}, {"id": "C", "text": "..."}, {"id": "D", "text": "..."} ],
      "correctOption": "A",
      "difficulty": "MEDIUM",
      "questionType": "NUMERICAL",
      "formulaContext": "governing formula or standard equation",
      "answerUnit": "physical unit of answer",
      "explanation": "step-by-step mathematical solution with substitution and unit conversion"
    }
  ]
}`;

    const raw = await callGemini(apiKey, prompt, { json: true, maxOutputTokens: 8192 });
    if (!raw) continue;

    const parsed = extractJson(raw);
    const list = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.questions)
      ? parsed.questions
      : [];

    for (const item of list) {
      const q = normalizeGeneratedQuestion(item, collected.length, category);
      if (q) collected.push(q);
      if (collected.length >= questionCount) break;
    }
  }

  return collected;
}

export interface WebContentGenOptions {
  content: string;
  sourceUrlOrName?: string;
  topicTitle?: string;
  category?: 'civil' | 'gs';
  questionCount: number;
  questionStyle?: 'mixed' | 'numerical' | 'conceptual';
  onProgress?: (current: number, total: number, message: string) => void;
}

/**
 * Synthesizes high-accuracy MCQs strictly grounded in web / Wikipedia / engineering text content.
 */
export async function generateQuestionsFromWebContent(options: WebContentGenOptions): Promise<MCQQuestion[]> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) throw new Error('NO_GEMINI_KEY');

  const { content, sourceUrlOrName, topicTitle, category = 'civil', questionCount, questionStyle = 'mixed', onProgress } = options;
  const isNumerical = questionStyle === 'numerical';
  const batchSize = 25;
  const totalBatches = Math.ceil(questionCount / batchSize);
  const collected: MCQQuestion[] = [];

  for (let batch = 0; batch < totalBatches; batch++) {
    const remaining = questionCount - collected.length;
    if (remaining <= 0) break;

    onProgress?.(
      batch + 1,
      totalBatches,
      `Analyzing web material & synthesizing ${isNumerical ? 'numerical calculation problems' : 'MCQs'} ${collected.length + 1}–${collected.length + remaining} (batch ${batch + 1}/${totalBatches})…`
    );

    const prompt = `You are a Chief Examination Calibrator for Indian engineering and competitive examinations (APSC AE, UPSC ESE, SSC JE, GATE).
The user has provided authentic source material from the web, Wikipedia, or an engineering technical portal:
Source: ${sourceUrlOrName || 'Web / Wikipedia Reference'}
Topic: ${topicTitle || 'Technical Syllabus Topic'}
Domain: ${category === 'civil' ? 'Civil Engineering technical paper' : 'General Studies & Assam GK'}

SOURCE MATERIAL CONTENT:
"""
${content.slice(0, 10000)}
"""

Task:
Generate exactly ${remaining} fresh, rigorous, single-correct-answer MCQ questions grounded strictly on the facts, concepts, definitions, empirical values, or formulas mentioned in or directly relevant to the source material above.

${isNumerical ? `
CRITICAL INSTRUCTION — ALL QUESTIONS MUST BE STRICTLY NUMERICAL COMPUTATION PROBLEMS:
- Every question MUST require a numerical calculation using formulas, parameters, or quantitative engineering principles derived from or directly relevant to the source material above.
- The question stem MUST supply concrete numerical input parameters with physical units (e.g. dimensions, loads, pressures, discharge, void ratio, cohesion, friction angle, slope, unit weights, flow velocities).
- All 4 option choices (A, B, C, D) must be unit-bearing numerical values (e.g. '142.5 kPa', '648 kN/m²', '0.065 m³/s', '207 kN·m'). Distractors must reflect plausible formula or arithmetic student errors.
- "formulaContext" must provide the exact governing equation (e.g. 'q_ult = c·N_c + γ·D_f·N_q + 0.4·γ·B·N_γ', 'i_cr = (G-1)/(1+e)', 'e = (w·G)/S_r').
- "explanation" must demonstrate the complete step-by-step mathematical substitution and units conversion.
- "questionType" must be "NUMERICAL".
` : `
Rules:
- NEVER mix unrelated disciplines. If the text is Civil Engineering, all questions must be Civil Engineering. If General Studies, all questions must be General Studies.
- Mix difficulties: ~20% EASY, ~50% MEDIUM, ~30% HARD.
- Each question has exactly 4 options (ids A, B, C, D) with exactly one correct option.
- Explanations must provide clear step-by-step reasoning citing the concepts from the source material.
- Distribute across varied parts of the provided text.
`}

Output MUST be valid JSON exactly matching this shape (no markdown fences, no commentary):
{
  "questions": [
    {
      "stem": "full question text with given numerical parameters and units",
      "subject": "${category === 'civil' ? 'Civil Engineering' : 'General Studies'}",
      "topic": "${topicTitle || 'Web Sourced Subject'}",
      "subtopic": "specific concept from text",
      "options": [ {"id": "A", "text": "..."}, {"id": "B", "text": "..."}, {"id": "C", "text": "..."}, {"id": "D", "text": "..."} ],
      "correctOption": "A",
      "difficulty": "MEDIUM",
      "questionType": "NUMERICAL",
      "formulaContext": "key formula, standard code or clause mentioned",
      "answerUnit": "physical unit of answer",
      "explanation": "comprehensive step-by-step mathematical solution citing the source content"
    }
  ]
}`;

    const raw = await callGemini(apiKey, prompt, { json: true, maxOutputTokens: 8192 });
    if (!raw) continue;

    const parsed = extractJson(raw);
    const list = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.questions)
      ? parsed.questions
      : [];

    for (const item of list) {
      const q = normalizeGeneratedQuestion(item, collected.length, category);
      if (q) {
        q.topic = topicTitle || q.topic;
        q.pyqExam = sourceUrlOrName ? `Web: ${sourceUrlOrName.slice(0, 30)}` : 'Wikipedia / Web Sourced';
        collected.push(q);
      }
      if (collected.length >= questionCount) break;
    }
  }

  return collected;
}

