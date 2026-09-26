import { MCQQuestion } from '../types';
import { callGeminiMultimodal, getGeminiApiKey, getLastAiDiagnostics } from './geminiService';

export interface ExamPaperMeta {
  examName: string;
  year: number;
  paperType: string;
  subject: string;
  durationMinutes: number;
  totalMarks: number;
  negativeMarksPerIncorrect: number;
  examId?: string;
  /**
   * How to read an answer key the model does not report the source of.
   * 'printed' (default) suits the admin workflow, where the paper is an
   * official one. 'auto' suits student uploads of unknown provenance, and
   * treats a missing label as model-derived. The model's own per-question
   * label always wins over this.
   */
  keySource?: 'printed' | 'auto';
}

export interface ExtractedQuestionRaw {
  questionNumber?: number;
  stem: string;
  options: { id: 'A' | 'B' | 'C' | 'D'; text: string }[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
  subject?: string;
  topic?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  questionType?: 'CONCEPTUAL' | 'NUMERICAL' | 'FORMULA_RECALL';
  /** 'printed' when the paper itself shows the key, 'model_derived' when solved. */
  keySource?: 'printed' | 'model_derived';
  keyConfidence?: 'high' | 'medium' | 'low';
}

/**
 * Read a browser File object as Base64 string
 */
export function readFileAsBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve({
        base64,
        mimeType: file.type || 'application/pdf'
      });
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Clean and repair JSON string returned by Gemini
 */
function cleanAndParseJson(text: string): any {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();

  // If wrapped in an object like { questions: [...] }
  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && Array.isArray(parsed.questions)) return parsed.questions;
    if (parsed && Array.isArray(parsed.data)) return parsed.data;
    return parsed;
  } catch (err) {
    // Attempt relaxed array extraction using brackets
    const firstBracket = cleaned.indexOf('[');
    const lastBracket = cleaned.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket > firstBracket) {
      const sub = cleaned.substring(firstBracket, lastBracket + 1);
      return JSON.parse(sub);
    }
    throw err;
  }
}

/**
 * Largest paper we send to Gemini as inline data.
 *
 * The whole file travels base64-encoded inside a single generateContent call,
 * and the API rejects a request over ~20 MB. A scanned 100-question paper
 * crosses that easily, so the limit is checked up front with an actionable
 * message instead of an opaque HTTP 400.
 */
export const MAX_INLINE_UPLOAD_BYTES = 15 * 1024 * 1024;

/** Rough byte length of a base64 payload without decoding it. */
function approxBase64Bytes(base64: string): number {
  const clean = base64.includes(',') ? base64.split(',')[1] : base64;
  return Math.floor((clean.length * 3) / 4);
}

export interface KeyProvenance {
  keyPrinted: boolean;
  answerKeySource: 'PRINTED' | 'MODEL_DERIVED';
  keyConfidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

/**
 * Decides how much to trust an extracted answer key.
 *
 * Only a key the model explicitly reports as printed counts as official. A
 * missing label is resolved from the caller's declaration: 'printed' keeps the
 * admin workflow (official papers) working, 'auto' is the conservative choice
 * for uploads of unknown provenance and treats silence as model-derived.
 */
export function deriveKeyProvenance(
  rawKeySource: string | undefined,
  rawKeyConfidence: string | undefined,
  declared: 'printed' | 'auto' = 'printed'
): KeyProvenance {
  const keyPrinted = rawKeySource ? rawKeySource === 'printed' : declared === 'printed';
  if (keyPrinted) {
    return { keyPrinted, answerKeySource: 'PRINTED', keyConfidence: 'HIGH' };
  }
  const reported = String(rawKeyConfidence || '').toLowerCase();
  const keyConfidence: 'HIGH' | 'MEDIUM' | 'LOW' =
    reported === 'high' || reported === 'medium' || reported === 'low'
      ? (reported.toUpperCase() as 'HIGH' | 'MEDIUM' | 'LOW')
      : 'LOW';
  return { keyPrinted, answerKeySource: 'MODEL_DERIVED', keyConfidence };
}

/**
 * Multimodal Gemini OCR & MCQ Extractor
 * Reads whole exam paper PDF or images, performs OCR, and structures questions into standard MCQ objects.
 */
export async function parseExamPdfWithGemini(
  fileBase64: string,
  mimeType: string,
  meta: ExamPaperMeta,
  onProgress?: (status: string) => void
): Promise<MCQQuestion[]> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('Gemini API Key is required for PDF OCR parsing. Please configure your key.');
  }

  const approxBytes = approxBase64Bytes(fileBase64);
  if (approxBytes > MAX_INLINE_UPLOAD_BYTES) {
    const sizeMb = (approxBytes / (1024 * 1024)).toFixed(1);
    const limitMb = (MAX_INLINE_UPLOAD_BYTES / (1024 * 1024)).toFixed(0);
    throw new Error(
      `This paper is ${sizeMb} MB, over the ${limitMb} MB limit for browser extraction ` +
        '(the file is sent to the AI in one request). Compress or split the paper, or run ' +
        '`npm run pyq:import` on the inbox for large scans.'
    );
  }

  onProgress?.('Uploading PDF to Gemini AI OCR engine...');

  const prompt = `You are an expert exam paper digitizer, OCR specialist, and subject matter evaluator.
Analyze the attached official examination question paper PDF/document for: "${meta.examName} (${meta.year}) — ${meta.paperType}".

TASK:
1. Perform high-fidelity OCR across the document. Extract ALL multiple-choice questions (MCQs).
2. For each question:
   - Identify the exact original question number (questionNumber).
   - Transcribe the complete question text/stem accurately, preserving technical terms, acts, codes, names, or statements.
   - IMPORTANT: For "Match the following" questions, format the two columns clearly with line breaks:
     Match the following :
     a. [Item from List I]        1. [Item from List II]
     b. [Item from List I]        2. [Item from List II]
     c. [Item from List I]        3. [Item from List II]
     d. [Item from List I]        4. [Item from List II]
     Select the correct answer using the codes given below.
   - Extract the 4 options labeled (A), (B), (C), (D) with clean option texts (omit the leading "(A)" from the text string).
   - Identify the correct option key ('A', 'B', 'C', or 'D') and report HOW you got it:
     * If the paper prints an answer key (a key column, marked options, or a key section at the end), copy it and set "keySource": "printed", "keyConfidence": "high".
     * If no key is printed, solve the question yourself, set "keySource": "model_derived", and set "keyConfidence" to "high", "medium" or "low" depending on how certain you are.
     Never report "printed" for a key you worked out yourself. Accuracy of the label matters more than the answer.
   - Provide a concise, high-yield official explanation justifying the answer.
   - Identify the subject (e.g. "${meta.subject}", "General Studies", "Civil Engineering") and specific topic (e.g. "Assam History", "Soil Mechanics", "Indian Polity").
   - Classify difficulty as "EASY", "MEDIUM", or "HARD".

OUTPUT FORMAT:
Return a strictly valid JSON array of objects with this exact structure:
[
  {
    "questionNumber": 1,
    "stem": "Question text here...",
    "options": [
      { "id": "A", "text": "First option" },
      { "id": "B", "text": "Second option" },
      { "id": "C", "text": "Third option" },
      { "id": "D", "text": "Fourth option" }
    ],
    "correctOption": "A",
    "explanation": "Why this option is correct...",
    "subject": "${meta.subject}",
    "topic": "Topic Name",
    "difficulty": "MEDIUM",
    "keySource": "printed",
    "keyConfidence": "high"
  }
]

IMPORTANT: Do not output any conversational filler or markdown fences outside the JSON. Return only the JSON array.`;

  onProgress?.('Gemini is performing OCR & extracting multiple-choice questions...');

  const responseText = await callGeminiMultimodal(apiKey, prompt, fileBase64, mimeType, {
    json: true,
    maxOutputTokens: 16000
  });

  if (!responseText) {
    throw new Error('Gemini OCR returned an empty response. Verify your API key or document format.');
  }

  // A long paper runs out of output budget mid-JSON. The partial payload then
  // fails to parse with a misleading "unexpected end of JSON" error, so the
  // truncation is detected and reported as what it actually is.
  const diagnostics = getLastAiDiagnostics();
  if (diagnostics.finishReason === 'MAX_TOKENS') {
    throw new Error(
      'The paper is too long to extract in one pass — the response was cut off before the ' +
        'question list finished. Split the paper into smaller parts (or use `npm run pyq:import` ' +
        'for the CLI importer, which chunks and validates).'
    );
  }

  onProgress?.('Validating extracted questions and schemas...');

  let rawList: ExtractedQuestionRaw[];
  try {
    rawList = cleanAndParseJson(responseText);
  } catch (err: any) {
    console.error('Failed to parse Gemini response as JSON:', responseText);
    throw new Error(`Failed to parse extracted questions JSON: ${err.message || err}`);
  }

  if (!Array.isArray(rawList) || rawList.length === 0) {
    throw new Error('No valid questions could be extracted from the document. Ensure the PDF contains legible MCQ text.');
  }

  // Map to full MCQQuestion objects
  const timestamp = Date.now();
  const examSlug = meta.examName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 20);

  const parsedQuestions: MCQQuestion[] = rawList.map((raw, idx) => {
    const qNum = raw.questionNumber || (idx + 1);
    const validOptions = (raw.options && raw.options.length === 4)
      ? raw.options.map((opt, oIdx) => ({
          id: (['A', 'B', 'C', 'D'][oIdx] || 'A') as 'A' | 'B' | 'C' | 'D',
          text: String(opt.text || opt).trim()
        }))
      : [
          { id: 'A' as const, text: raw.options?.[0]?.text || 'Option A' },
          { id: 'B' as const, text: raw.options?.[1]?.text || 'Option B' },
          { id: 'C' as const, text: raw.options?.[2]?.text || 'Option C' },
          { id: 'D' as const, text: raw.options?.[3]?.text || 'Option D' }
        ];

    const correctKey: 'A' | 'B' | 'C' | 'D' = ['A', 'B', 'C', 'D'].includes(raw.correctOption)
      ? raw.correctOption
      : 'A';

    // The model reports where each key came from. Only a reported "printed"
    // key earns the official PYQ label; anything else is model-derived, and
    // under 'auto' a missing label is treated the same conservative way.
    const { keyPrinted, answerKeySource, keyConfidence } = deriveKeyProvenance(
      raw.keySource,
      raw.keyConfidence,
      meta.keySource
    );

    return {
      id: `pyq-${examSlug}-${timestamp}-q${String(qNum).padStart(3, '0')}`,
      stem: raw.stem || `Question ${qNum}`,
      options: validOptions,
      correctOption: correctKey,
      explanation: raw.explanation || (keyPrinted
        ? `Official answer key: (${correctKey}).`
        : `Derived answer: (${correctKey}). Verify against the official key.`),
      subject: raw.subject || meta.subject || 'General Studies',
      topic: raw.topic || meta.paperType || meta.examName,
      difficulty: raw.difficulty || 'MEDIUM',
      questionType: raw.questionType || 'CONCEPTUAL',
      sourceType: keyPrinted ? 'PYQ' : 'AI_GENERATED',
      answerKeySource,
      keyConfidence,
      pyqYear: meta.year,
      examId: meta.examId || examSlug,
      questionNumber: qNum
    };
  });

  onProgress?.(`Successfully extracted ${parsedQuestions.length} verified questions!`);
  return parsedQuestions;
}

/**
 * Text-based parser for pasted question text / OCR transcripts
 */
export function parseRawExamText(rawText: string, meta: ExamPaperMeta): MCQQuestion[] {
  const lines = rawText.split('\n');
  const questions: MCQQuestion[] = [];
  let currentStem = '';
  let currentOptions: { id: 'A' | 'B' | 'C' | 'D'; text: string }[] = [];
  let currentKey: 'A' | 'B' | 'C' | 'D' = 'A';
  let currentExp = '';
  let currentNum = 1;

  const timestamp = Date.now();
  const examSlug = meta.examName.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 15);

  const saveCurrent = () => {
    if (currentStem.trim() && currentOptions.length >= 2) {
      // Pad to 4 options if fewer
      while (currentOptions.length < 4) {
        const nextId = ['A', 'B', 'C', 'D'][currentOptions.length] as 'A' | 'B' | 'C' | 'D';
        currentOptions.push({ id: nextId, text: `Option ${nextId}` });
      }
      questions.push({
        id: `pyq-text-${examSlug}-${timestamp}-q${String(currentNum).padStart(3, '0')}`,
        stem: currentStem.trim(),
        options: currentOptions.slice(0, 4),
        correctOption: currentKey,
        explanation: currentExp.trim() || `Official answer is (${currentKey}).`,
        subject: meta.subject || 'General Studies',
        topic: meta.paperType || meta.examName,
        difficulty: 'MEDIUM',
        questionType: 'CONCEPTUAL',
        sourceType: 'PYQ',
        pyqYear: meta.year,
        examId: meta.examId || examSlug,
        questionNumber: currentNum
      });
      currentNum++;
    }
    currentStem = '';
    currentOptions = [];
    currentKey = 'A';
    currentExp = '';
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const qMatch = trimmed.match(/^(?:Q\.?|Question)?\s*(\d+)[\.\:\)]\s*(.*)/i);
    const optMatch = trimmed.match(/^\(?([A-Da-d])\)[\.\:\s]\s*(.*)/);
    const keyMatch = trimmed.match(/^(?:Answer|Ans|Key)[\:\s]+([A-Da-d])/i);
    const expMatch = trimmed.match(/^(?:Explanation|Exp)[\:\s]+(.*)/i);

    if (qMatch && (!optMatch || trimmed.length > 50)) {
      saveCurrent();
      currentStem = qMatch[2] || trimmed;
    } else if (optMatch) {
      const optId = optMatch[1].toUpperCase() as 'A' | 'B' | 'C' | 'D';
      currentOptions.push({ id: optId, text: optMatch[2] || '' });
    } else if (keyMatch) {
      currentKey = keyMatch[1].toUpperCase() as 'A' | 'B' | 'C' | 'D';
    } else if (expMatch) {
      currentExp = expMatch[1];
    } else {
      if (currentOptions.length === 0) {
        currentStem += (currentStem ? ' ' : '') + trimmed;
      } else {
        // Append to last option
        const last = currentOptions[currentOptions.length - 1];
        if (last) last.text += ' ' + trimmed;
      }
    }
  }

  saveCurrent();
  return questions;
}
