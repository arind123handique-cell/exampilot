/**
 * AI PROVIDER ORCHESTRATOR
 *
 * Per PROMP.txt §31 (AI Model Routing) and §50 (Master Orchestrator), the app
 * must not be hard-wired to a single provider. This module is the thin
 * orchestrator that decides WHO answers each request and presents a single
 * surface to the UI.
 *
 * Selection order (`VITE_AI_PROVIDER = auto`, the default):
 *   1. Google Gemini       — when VITE_GEMINI_API_KEY / stored key exists.
 *   2. Local Ollama model   — FREE, NO API KEY, runs on 127.0.0.1:11434.
 *   3. Deterministic offline engines (recipe factory + builtin ESE engine).
 *
 * Gemini is preferred only because the user explicitly paid for it; Ollama is the
 * free tier that keeps the AI features alive for everyone else. Every route
 * returns `null`/empty on failure so the caller always has a recoverable state.
 */

import type { AiChatMessage, MCQQuestion } from '../types';
import type { MockGenOptions, AiReply } from './geminiService';

import {
  generateTutorReply as generateGeminiTutorReply,
  generateMcqDeepDive as generateGeminiDeepDive,
  generateMockTestQuestions as generateGeminiMock,
  hasLiveAi as hasGeminiKey,
  getActiveGeminiModel,
  getGeminiModelCandidates,
  getLastAiError as getGeminiError,
  getLastAiDiagnostics as getGeminiDiagnostics
} from './geminiService';

import {
  isOllamaAvailable,
  hasLiveOllama,
  isModelPulled,
  getOllamaModel,
  getActiveOllamaModel,
  getOllamaCandidates,
  getLastOllamaError,
  getLastOllamaDiagnostics,
  callOllamaText,
  callOllamaJson,
  getOllamaStatus
} from './ollamaService';

import {
  getActiveEntry,
  getCredentialStore,
  AI_PROVIDERS,
  type AiProviderId
} from './aiCredentials';

import {
  callOpenAiCompat,
  callOpenAiCompatJson,
  getLastCompatError,
  getLastCompatFinishReason,
  getLastCompatModel
} from './openAiCompatClient';

export type AiProvider = AiProviderId | 'ollama' | 'offline';

export { MockGenOptions, AiReply };

/**
 * The student's own key, if they configured one in their profile.
 *
 * A student key takes precedence over the app-level Gemini key: they asked for
 * that provider, and billing should follow their choice. Returns null when they
 * have not set one up, which leaves the original Gemini → Ollama → offline
 * chain untouched.
 */
function resolveUserCredential(): { provider: AiProviderId; apiKey: string; model: string } | null {
  const store = getCredentialStore();
  const entry = store.entries[store.activeProvider];
  if (!entry?.apiKey) return null;
  const model = entry.model?.trim() || AI_PROVIDERS[store.activeProvider]?.suggestedModels[0] || '';
  // No model means we cannot build a request; treat it as unconfigured rather
  // than firing calls that will fail for a reason the UI already shows.
  if (!model) return null;
  return { provider: store.activeProvider, apiKey: entry.apiKey, model };
}

/** Which provider is currently in charge of answering. */
export function getActiveProvider(): AiProvider {
  const user = resolveUserCredential();
  if (user) return user.provider;
  if (hasGeminiKey()) return 'gemini';
  if (hasLiveOllama()) return 'ollama';
  return 'offline';
}

export function hasLiveAi(): boolean {
  if (resolveUserCredential()) return true;
  return hasGeminiKey() || hasLiveOllama();
}

export { hasLiveOllama };

/** Diagnostics stitched together from whichever provider answered. */
export function getActiveModel(): string | null {
  const user = resolveUserCredential();
  if (user) return user.provider === 'gemini' ? getActiveGeminiModel() ?? user.model : user.model;
  if (hasGeminiKey()) return getActiveGeminiModel();
  if (hasLiveOllama()) return getActiveOllamaModel();
  return null;
}

export function getModelCandidates(): string[] {
  if (hasGeminiKey()) return getGeminiDiagnostics().model
    ? [getGeminiDiagnostics().model!]
    : [];
  return getOllamaCandidates();
}

export function getLastAiError(): string | null {
  const user = resolveUserCredential();
  if (user && user.provider !== 'gemini') return getLastCompatError();
  if (user) return getGeminiError();
  if (hasGeminiKey()) return getGeminiError();
  return getLastOllamaError();
}

export function getLastAiDiagnostics() {
  const g = getGeminiDiagnostics();
  const o = getLastOllamaDiagnostics();
  const provider = hasGeminiKey() ? 'gemini' : 'ollama';
  return provider === 'gemini'
    ? { ...g, provider: 'gemini' as const }
    : { ...o, provider: 'ollama' as const };
}

export {
  getOllamaStatus,
  isOllamaAvailable,
  isModelPulled
};

/** Human-readable label shown in status badges. */
export function providerLabel(): string {
  const user = resolveUserCredential();
  if (user) return `${AI_PROVIDERS[user.provider].label} (${getActiveModel()})`;
  if (hasGeminiKey()) return `Google Gemini (${getActiveModel()})`;
  if (hasLiveOllama()) return `Local Ollama (${getOllamaModel()})`;
  return 'Offline recipes';
}

/* ------------------------------------------------------------ text path */

export async function generateTutorReply(
  userText: string,
  history: AiChatMessage[] = [],
  examName?: string
): Promise<AiReply | null> {
  const user = resolveUserCredential();
  if (user && user.provider !== 'gemini') {
    const result = await callOpenAiCompat({
      provider: user.provider,
      apiKey: user.apiKey,
      model: user.model,
      messages: [
        { role: 'system', content: TUTOR_SYSTEM_PROMPT },
        { role: 'user', content: buildTutorTurn(examName, history, userText) }
      ],
      maxTokens: 1400
    });
    if (!result.text) return null;
    return parseAiReply(result.text);
  }
  if (user || hasGeminiKey()) {
    return generateGeminiTutorReply(userText, history, examName);
  }
  // Free tier: local Ollama. Reuse the Gemini tutor system prompt so the local
  // answer keeps the same exam-oriented shape.
  const raw = await callOllamaText(buildTutorPrompt(examName, history, userText), 1400);
  if (!raw) return null;
  return parseAiReply(raw);
}

export async function generateMcqDeepDive(question: MCQQuestion): Promise<AiReply | null> {
  const user = resolveUserCredential();
  if (user && user.provider !== 'gemini') {
    const result = await callOpenAiCompat({
      provider: user.provider,
      apiKey: user.apiKey,
      model: user.model,
      messages: [
        { role: 'system', content: TUTOR_SYSTEM_PROMPT },
        { role: 'user', content: buildDeepDivePrompt(question) }
      ],
      maxTokens: 1000
    });
    if (!result.text) return null;
    return parseAiReply(result.text);
  }
  if (user || hasGeminiKey()) {
    return generateGeminiDeepDive(question);
  }
  const raw = await callOllamaText(buildDeepDivePrompt(question), 1000);
  if (!raw) return null;
  return parseAiReply(raw);
}

/* ---------------------------------------------------------- mock path */

/**
 * Generate a full mock test question set.
 *
 * Mirrors geminiService.generateMockTestQuestions but routes through the local
 * model when no Gemini key is configured, so mock generation works with ZERO
 * API keys. Throws `NO_AI_PROVIDER` when neither Gemini nor Ollama is usable so
 * the caller (MockTestPage) can fall back to deterministic recipes.
 */
export async function generateMockTestQuestions(options: MockGenOptions): Promise<MCQQuestion[]> {
  const user = resolveUserCredential();
  if (user && user.provider !== 'gemini') {
    return generateCompatMock(options, user);
  }
  if (user || hasGeminiKey()) {
    return generateGeminiMock(options);
  }
  if (!hasLiveOllama()) {
    throw new Error('NO_AI_PROVIDER');
  }

  const { topicQuery, category, questionCount, examName, onProgress } = options;
  const batchSize = 25;
  const totalBatches = Math.ceil(questionCount / batchSize);
  const collected: MCQQuestion[] = [];

  for (let batch = 0; batch < totalBatches; batch += 1) {
    const remaining = questionCount - collected.length;
    if (remaining <= 0) break;

    onProgress?.(
      batch + 1,
      totalBatches,
      `Ollama: synthesising questions ${collected.length + 1}-${collected.length + remaining} (batch ${batch + 1}/${totalBatches})…`
    );

    const prompt = buildMockPrompt(topicQuery, category, Math.min(remaining, batchSize), examName);
    const parsed = await callOllamaJson<{ questions?: unknown[] }>(prompt, { maxOutputTokens: 8192 });
    const list = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.questions) ? parsed!.questions : [];

    for (const item of list) {
      const q = normalizeGeneratedQuestion(item, collected.length, category);
      if (q) collected.push(q);
      if (collected.length >= questionCount) break;
    }
  }
  return collected;
}

/* --------------------------------------------------- shared prompt helpers */

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

function buildTutorPrompt(examName: string | undefined, history: AiChatMessage[], userText: string): string {
  return `${TUTOR_SYSTEM_PROMPT}

${buildTutorTurn(examName, history, userText)}`;
}

/** The user turn on its own, for providers that take a real system message. */
function buildTutorTurn(examName: string | undefined, history: AiChatMessage[], userText: string): string {
  const historyText = history
    .slice(-8)
    .map((m) => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content}`)
    .join('\n\n');

  return `${examName ? `Target exam: ${examName}.` : ''}
${historyText ? `Conversation so far:\n${historyText}\n\n` : ''}
Student question: ${userText}`.trim();
}

/**
 * Mock generation through the student's own OpenAI-compatible provider.
 *
 * Batched the same way the Ollama path is: asking for 100 questions in one
 * response reliably truncates, and a truncated response is the failure that
 * quietly produces half a mock test.
 */
async function generateCompatMock(
  options: MockGenOptions,
  credential: { provider: AiProviderId; apiKey: string; model: string }
): Promise<MCQQuestion[]> {
  const { topicQuery, category, questionCount, examName, onProgress } = options;
  const batchSize = 20;
  const totalBatches = Math.ceil(questionCount / batchSize);
  const collected: MCQQuestion[] = [];
  const sourceLabel = `${AI_PROVIDERS[credential.provider].label} Draft`;

  for (let batch = 0; batch < totalBatches; batch += 1) {
    const remaining = questionCount - collected.length;
    if (remaining <= 0) break;

    onProgress?.(
      batch + 1,
      totalBatches,
      `${AI_PROVIDERS[credential.provider].label}: writing questions ${collected.length + 1}-${collected.length + remaining} (batch ${batch + 1}/${totalBatches})…`
    );

    const prompt = buildMockPrompt(topicQuery, category, Math.min(remaining, batchSize), examName);
    const parsed = await callOpenAiCompatJson<{ questions?: unknown[] }>({
      provider: credential.provider,
      apiKey: credential.apiKey,
      model: credential.model,
      messages: [{ role: 'user', content: prompt }],
      maxTokens: 8192
    });

    if (!parsed) {
      // Surface the real reason rather than returning a short mock that looks
      // like a model quality problem.
      throw new Error(getLastCompatError() || 'The model did not return usable questions.');
    }

    const list = Array.isArray(parsed) ? parsed : Array.isArray(parsed.questions) ? parsed.questions : [];
    for (const item of list) {
      const q = normalizeGeneratedQuestion(item, collected.length, category, sourceLabel);
      if (q) collected.push(q);
      if (collected.length >= questionCount) break;
    }
  }
  return collected;
}

function buildDeepDivePrompt(question: MCQQuestion): string {
  const optionsText = question.options
    .map((o) => `${o.id}) ${o.text}`)
    .join('\n');

  return `${TUTOR_SYSTEM_PROMPT}

A student just attempted this ${question.difficulty} level question from ${question.pyqExam || 'a competitive exam'}:
Subject: ${question.subject}
Topic: ${question.topic}${question.subtopic ? ` / ${question.subtopic}` : ''}
Question: ${question.stem}
Options: ${optionsText}
Correct option: ${question.correctOption}
Existing working notes: ${question.explanation || '(none)'}

Produce an "AI Deep Dive":
1) Concept foundation - the principle/codal clause being tested.
2) Elimination logic - why each wrong option fails (brief, one line each).
3) Worked solution - step-by-step derivation.
4) Exam trap - the single most likely mistake.
Keep it under 280 words, plain text with clear line breaks.`;
}

function buildMockPrompt(
  topicQuery: string,
  category: 'civil' | 'gs',
  count: number,
  examName?: string
): string {
  const subject = category === 'civil' ? 'Civil Engineering technical paper' : 'General Studies — India & Assam';
  return `You are an examiner writing multiple-choice questions for Indian competitive examinations (UPSC ESE/IES, APSC AE, SSC JE, GATE).
Generate exactly ${count} fresh, high-quality, single-correct-answer MCQ questions for the topic: "${topicQuery}" (${subject}).
${examName ? `Calibrate style and difficulty to the ${examName} examination pattern.` : ''}

Rules:
- Mix difficulties: ~20% EASY, ~50% MEDIUM, ~30% HARD.
- Each question has exactly 4 options (ids A, B, C, D) with exactly one correct option.
- Include numerical problems where relevant; every number in the explanation must be verified.
- Explanations must solve step by step and cite the governing code clause / standard / source.
- Distribute across varied subtopics; no duplicate or trivially similar questions.

Output MUST be valid JSON exactly matching this shape (no markdown fences, no commentary):
{
  "questions": [
    {
      "stem": "full question text",
      "subject": "subject name",
      "topic": "topic name",
      "subtopic": "specific subtopic",
      "options": [ {"id": "A", "text": "..."}, {"id": "B", "text": "..."}, {"id": "C", "text": "..."}, {"id": "D", "text": "..."} ],
      "correctOption": "A",
      "difficulty": "EASY",
      "formulaContext": "governing formula or code clause (or empty string)",
      "explanation": "step-by-step solution with references"
    }
  ]
}`;
}

function normalizeGeneratedQuestion(
  raw: any,
  index: number,
  category: 'civil' | 'gs',
  sourceLabel = 'Local Model Draft'
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
    subject: typeof raw.subject === 'string' && raw.subject.trim() ? raw.subject.trim() : 'Local Model',
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
    pyqExam: sourceLabel
  };
}

/* Mirrors the parser in geminiService so the free path emits the same chips. */
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

// Keep the Gemini diagnostic type re-exported for the existing scripts/UI.
export { getActiveGeminiModel, hasGeminiKey };
