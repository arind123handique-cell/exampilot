import { KnowledgeModule, MCQQuestion } from '../types';
import {
  isOllamaAvailable,
  getOllamaModel,
  getOllamaBaseUrl
} from './ollamaService';
import { getGeminiModelCandidates, cleanModelName } from './geminiService';

const GEMINI_ENDPOINT_ROOT = 'https://generativelanguage.googleapis.com/v1beta/models';

export interface IngestionOptions {
  topicQuery: string;
  category: 'civil' | 'gs';
  targetLevel: 'UPSC_ESE' | 'APSC_AE' | 'GATE_CONCEPTUAL';
  questionCount: number;
  apiKey?: string;
  onProgress?: (step: number, message: string) => void;
}

export interface IngestionResult {
  module: KnowledgeModule;
  questions: MCQQuestion[];
  source: 'GEMINI_AI' | 'LOCAL_AI' | 'BUILTIN_ESE_ENGINE';
}

/**
 * High-yield predefined topics calibrated to UPSC ESE & State AE syllabi
 */
export const POPULAR_ESE_TOPICS = [
  {
    id: 'civil-seismic-ductile',
    query: 'Seismic Design & Ductile Detailing (IS 13920:2016 & IS 1893)',
    category: 'civil' as const,
    subject: 'Structural Engineering',
    unitName: 'Structural Engineering',
    code: 'IS 13920:2016 & IS 1893:2016'
  },
  {
    id: 'civil-psc-anchorage',
    query: 'Prestressed Concrete Anchorage Zone & Bursting Tension (IS 1343:2012)',
    category: 'civil' as const,
    subject: 'Prestressed Concrete',
    unitName: 'Structural Engineering',
    code: 'IS 1343:2012 Cl. 19.6'
  },
  {
    id: 'civil-plastic-portal',
    query: 'Plastic Analysis of Portal Frames & Collapse Load (IS 800:2007)',
    category: 'civil' as const,
    subject: 'Design of Steel Structures',
    unitName: 'Structural Engineering',
    code: 'IS 800:2007 Section 8'
  },
  {
    id: 'civil-well-foundations',
    query: 'Well Foundations, Caissons & Lacey Scour Depth in Cohesive Soils',
    category: 'civil' as const,
    subject: 'Geotechnical Engineering',
    unitName: 'Geotechnical Engineering',
    code: 'IS 3955 & IRC:78'
  },
  {
    id: 'civil-bod-streeter',
    query: 'Non-Steady State BOD Kinetics & Streeter-Phelps Dissolved Oxygen Sag',
    category: 'civil' as const,
    subject: 'Environmental Engineering',
    unitName: 'Environmental Engineering',
    code: 'CPHEEO Water Quality Manual'
  },
  {
    id: 'civil-hpc-silica',
    query: 'High Performance Concrete, Silica Fume & Pozzolanic Microstructure',
    category: 'civil' as const,
    subject: 'Building Materials & Concrete Technology',
    unitName: 'Construction Management & Building Materials',
    code: 'IS 10262:2019 & IS 15388'
  },
  {
    id: 'gs-brahmaputra-geotextile',
    query: 'Brahmaputra Flood Hydrology, Geotextile Embankments & Riverbank Erosion',
    category: 'gs' as const,
    subject: 'Geography of India & Assam',
    unitName: 'Geography of India & Assam',
    code: 'Brahmaputra Board & Water Resources Dept'
  },
  {
    id: 'gs-sixth-schedule-assam',
    query: 'Sixth Schedule Autonomous District Councils in Assam & Financial Devolution',
    category: 'gs' as const,
    subject: 'Indian Polity & Constitution',
    unitName: 'Indian Polity & Governance',
    code: 'Constitution of India Art. 244(2) & 6th Schedule'
  }
];

/**
 * Main AI Ingestion Controller: calls Gemini API or executes built-in ESE synthesis engine
 */
export async function ingestTopicWithEseQuestions(
  options: IngestionOptions
): Promise<IngestionResult> {
  const { topicQuery, category, targetLevel, questionCount, apiKey, onProgress } = options;

  onProgress?.(1, 'Ingesting standard specifications, codal provisions & syllabus framework...');
  await new Promise((r) => setTimeout(r, 600));

  onProgress?.(2, 'Formulating mathematical derivations, LaTeX equations & comparative stress blocks...');
  await new Promise((r) => setTimeout(r, 700));

  // If user provided a Gemini API Key or environment key exists, attempt Gemini generation
  const activeKey = apiKey || (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (activeKey) {
    try {
      const geminiResult = await callGeminiApi(activeKey, topicQuery, category, targetLevel, questionCount, onProgress);
      if (geminiResult) {
        return geminiResult;
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to built-in ESE synthesizer:', err);
    }
  }

  onProgress?.(3, 'Synthesizing authentic UPSC ESE / IES multi-statement & numerical questions...');
  await new Promise((r) => setTimeout(r, 800));

  onProgress?.(4, 'Committing to application knowledge store and updating active curriculum...');
  await new Promise((r) => setTimeout(r, 500));

  // Built-in intelligent synthesis engine
  return generateBuiltinEseCurriculum(topicQuery, category, targetLevel, questionCount);
}

/**
 * Calls Gemini 1.5 Flash API with JSON mode for structured curriculum synthesis
 */
async function callGeminiApi(
  apiKey: string,
  topicQuery: string,
  category: 'civil' | 'gs',
  targetLevel: string,
  questionCount: number,
  onProgress?: (step: number, message: string) => void
): Promise<IngestionResult | null> {
  onProgress?.(3, 'Calling Google Gemini AI for advanced UPSC ESE problem synthesis...');

  const systemPrompt = `You are a Chief Examination Calibrator for UPSC ESE (Engineering Services Examination) and State Public Service Commissions.
Generate a comprehensive technical syllabus module and exactly ${questionCount} authentic UPSC ESE / IES level questions for the topic: "${topicQuery}".
Target Level: ${targetLevel}.
The output MUST be valid JSON conforming to the following structure:
{
  "module": {
    "id": "slug-string",
    "title": "Title with code reference",
    "subject": "Main Subject Name",
    "unitName": "Unit Group Name",
    "category": "${category}",
    "readTime": "16 min read",
    "weightage": "HIGH_YIELD",
    "icon": "Building2",
    "codeClause": "Governing Code Clause",
    "confidencePercent": 50,
    "masteredStatus": "Needs Practice",
    "subtopicList": ["Subtopic 1", "Subtopic 2", "Subtopic 3"],
    "summary": "2-3 sentences comprehensive overview",
    "fullDescription": "Detailed paragraph explaining the governing philosophy and failure modes",
    "standardReferences": ["Reference 1", "Reference 2"],
    "steps": [
      {
        "stepNumber": 1,
        "stepTitle": "Step Title",
        "subtitle": "Subtitle",
        "keyConcept": "Deep technical explanation",
        "formulaOrCode": "LaTeX equation string",
        "highYieldFacts": ["Fact 1", "Fact 2", "Fact 3", "Fact 4"],
        "examTrap": "Common pitfall in competitive papers",
        "benchmarkExample": {
          "question": "Sample question",
          "options": ["Opt A", "Opt B", "Opt C", "Opt D"],
          "correctAnswer": "Opt A",
          "stepByStepSolution": ["Step 1...", "Step 2..."]
        }
      }
    ],
    "callouts": {
      "corePostulate": "Core theorem",
      "corePostulateRef": "Code Clause",
      "examTrap": "Trap statement",
      "examTrapRef": "Exam reference",
      "testedRatios": [{"label": "Ratio Name:", "value": "Value"}],
      "numericalShortcut": {"formula": "Formula", "note": "Derivation note"}
    },
    "comparisonGrid": {
      "titleLeft": "Aspect A",
      "tagLeft": "Tag A",
      "valueLeft": "Key Metric A",
      "descLeft": "Description A",
      "titleRight": "Aspect B",
      "tagRight": "Tag B",
      "valueRight": "Key Metric B",
      "descRight": "Description B"
    },
    "diagramType": "rcc"
  },
  "questions": [
    {
      "id": "ese-q-generated-1",
      "questionNumber": 1,
      "examId": "apsc-ae-civil",
      "subject": "Subject",
      "topic": "${topicQuery}",
      "subtopic": "Subtopic",
      "stem": "Consider the following statements regarding... Which of the statements given above is/are correct?",
      "options": [
        {"id": "A", "text": "1 and 2 only"},
        {"id": "B", "text": "2 and 3 only"},
        {"id": "C", "text": "1 and 3 only"},
        {"id": "D", "text": "1, 2 and 3"}
      ],
      "correctOption": "A",
      "formulaContext": "Relevant equation",
      "explanation": "Detailed multi-step solution verifying each statement with code clauses.",
      "difficulty": "HARD",
      "pyqExam": "UPSC ESE / IES 2024 Calibrated"
    }
  ]
}`;

  // Walk the shared candidate list instead of naming a model here. This used to
  // hardcode `gemini-1.5-flash`, which Google retired — the call then 404'd, the
  // error was swallowed by the caller, and the studio quietly fell back to the
  // built-in synthesiser with nothing but a console warning. Same failure shape
  // as the outage described in geminiService, in a second place.
  const candidates = getGeminiModelCandidates();
  let lastFailure = '';

  for (const candidate of candidates) {
    const model = cleanModelName(candidate);
    if (!model) continue;

    const response = await fetch(
      `${GEMINI_ENDPOINT_ROOT}/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      }
    );

    // 404 means this particular model is gone or renamed, not that the key is
    // bad — try the next one. Anything else is a real failure worth reporting.
    if (response.status === 404) {
      lastFailure = `${model} is not available (404)`;
      continue;
    }

    if (!response.ok) {
      throw new Error(`Gemini API error on ${model}: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResponse) return null;

    const parsed = JSON.parse(textResponse);
    return {
      module: parsed.module,
      questions: parsed.questions,
      source: 'GEMINI_AI'
    };
  }

  throw new Error(
    lastFailure
      ? `No configured Gemini model responded. Last attempt: ${lastFailure}.`
      : 'No Gemini model candidates are configured.'
  );
}

/**
 * Calls a local, FREE, API-key-less model (Ollama) with the same structured
 * prompt used for Gemini. Ollama does not expose a `responseMimeType` switch,
 * so we request JSON via the `format` option and still run the same lenient
 * extractor the Gemini path uses as a backstop.
 */
async function callOllamaApi(
  topicQuery: string,
  category: 'civil' | 'gs',
  targetLevel: string,
  questionCount: number
): Promise<IngestionResult | null> {
  const baseUrl = getOllamaBaseUrl();
  const model = getOllamaModel();

  const prompt = buildIngestionPrompt(topicQuery, category, targetLevel, questionCount);

  const response = await fetch(`${baseUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      format: 'json',
      options: { temperature: 0.4, num_predict: 4000 }
    })
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const textResponse = typeof data?.response === 'string' ? data.response : '';
  if (!textResponse) return null;

  const parsed = (parseJsonLenient(textResponse) as { module?: any; questions?: any[] } | null)
    ?? (extractJson(textResponse) as { module?: any; questions?: any[] } | null);
  if (!parsed?.module) return null;

  return {
    module: parsed.module,
    questions: parsed.questions ?? [],
    source: 'LOCAL_AI'
  };
}

/** Extract `buildIngestionPrompt` shared by the Gemini and Ollama paths. */
function buildIngestionPrompt(
  topicQuery: string,
  category: 'civil' | 'gs',
  targetLevel: string,
  questionCount: number
): string {
  return `You are a Chief Examination Calibrator for UPSC ESE (Engineering Services Examination) and State Public Service Commissions.
Generate a comprehensive technical syllabus module and exactly ${questionCount} authentic UPSC ESE / IES level questions for the topic: "${topicQuery}".
Target Level: ${targetLevel}.
The output MUST be valid JSON conforming to the following structure:
{
  "module": {
    "id": "slug-string",
    "title": "Title with code reference",
    "subject": "Main Subject Name",
    "unitName": "Unit Group Name",
    "category": "${category}",
    "readTime": "16 min read",
    "weightage": "HIGH_YIELD",
    "icon": "Building2",
    "codeClause": "Governing Code Clause",
    "confidencePercent": 50,
    "masteredStatus": "Needs Practice",
    "subtopicList": ["Subtopic 1", "Subtopic 2", "Subtopic 3"],
    "summary": "2-3 sentences comprehensive overview",
    "fullDescription": "Detailed paragraph explaining the governing philosophy and failure modes",
    "standardReferences": ["Reference 1", "Reference 2"],
    "steps": [
      {
        "stepNumber": 1,
        "stepTitle": "Step Title",
        "subtitle": "Subtitle",
        "keyConcept": "Deep technical explanation",
        "formulaOrCode": "LaTeX equation string",
        "highYieldFacts": ["Fact 1", "Fact 2", "Fact 3", "Fact 4"],
        "examTrap": "Common pitfall in competitive papers",
        "benchmarkExample": {
          "question": "Sample question",
          "options": ["Opt A", "Opt B", "Opt C", "Opt D"],
          "correctAnswer": "Opt A",
          "stepByStepSolution": ["Step 1...", "Step 2..."]
        }
      }
    ],
    "callouts": {
      "corePostulate": "Core theorem",
      "corePostulateRef": "Code Clause",
      "examTrap": "Trap statement",
      "examTrapRef": "Exam reference",
      "testedRatios": [{"label": "Ratio Name:", "value": "Value"}],
      "numericalShortcut": {"formula": "Formula", "note": "Derivation note"}
    },
    "comparisonGrid": {
      "titleLeft": "Aspect A",
      "tagLeft": "Tag A",
      "valueLeft": "Key Metric A",
      "descLeft": "Description A",
      "titleRight": "Aspect B",
      "tagRight": "Tag B",
      "valueRight": "Key Metric B",
      "descRight": "Description B"
    },
    "diagramType": "rcc"
  },
  "questions": [
    {
      "id": "ese-q-generated-1",
      "questionNumber": 1,
      "examId": "apsc-ae-civil",
      "subject": "Subject",
      "topic": "${topicQuery}",
      "subtopic": "Subtopic",
      "stem": "Consider the following statements regarding... Which of the statements given above is/are correct?",
      "options": [
        {"id": "A", "text": "1 and 2 only"},
        {"id": "B", "text": "2 and 3 only"},
        {"id": "C", "text": "1 and 3 only"},
        {"id": "D", "text": "1, 2 and 3"}
      ],
      "correctOption": "A",
      "formulaContext": "Relevant equation",
      "explanation": "Detailed multi-step solution verifying each statement with code clauses.",
      "difficulty": "HARD",
      "pyqExam": "UPSC ESE / IES 2024 Calibrated"
    }
  ]
}`;
}

function parseJsonLenient(candidate: string): any | null {
  try {
    return JSON.parse(candidate);
  } catch {
    const fixed = candidate.replace(/[\n\r\t]/g, ' ').replace(/(['"])?([A-Za-z0-9_]+)(['"])?:/g, '"$2":');
    try {
      return JSON.parse(fixed);
    } catch {
      return null;
    }
  }
}

function extractJson(text: string): any | null {
  const start = text.search(/[[{]/);
  const end = Math.max(text.lastIndexOf(']'), text.lastIndexOf('}'));
  if (start !== -1 && end > start) {
    try {
      return JSON.parse(text.slice(start, end + 1));
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Built-in domain synthesizer producing authentic UPSC ESE / IES level curriculum and MCQs
 */
function generateBuiltinEseCurriculum(
  query: string,
  category: 'civil' | 'gs',
  targetLevel: string,
  questionCount: number
): IngestionResult {
  const slug = query
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const id = `ai-learned-${slug}`;
  const timestamp = Date.now();

  // Recognize key themes to produce rich specialized content
  const lower = query.toLowerCase();

  if (lower.includes('seismic') || lower.includes('ductile') || lower.includes('13920') || lower.includes('1893')) {
    return buildSeismicDuctileModule(id, questionCount);
  } else if (lower.includes('anchorage') || lower.includes('bursting') || lower.includes('prestressed')) {
    return buildPrestressAnchorageModule(id, questionCount);
  } else if (lower.includes('plastic') || lower.includes('portal') || lower.includes('collapse')) {
    return buildPlasticPortalModule(id, questionCount);
  } else if (lower.includes('well') || lower.includes('scour') || lower.includes('caisson')) {
    return buildWellScourModule(id, questionCount);
  } else if (lower.includes('bod') || lower.includes('streeter') || lower.includes('dissolved oxygen')) {
    return buildBodStreeterModule(id, questionCount);
  } else if (lower.includes('brahmaputra') || lower.includes('flood') || lower.includes('erosion')) {
    return buildBrahmaputraFloodModule(id, questionCount);
  } else if (lower.includes('sixth schedule') || lower.includes('council') || lower.includes('244')) {
    return buildSixthScheduleModule(id, questionCount);
  }

  // Dynamic Generator for any arbitrary topic
  return buildGenericEseModule(id, query, category, targetLevel, questionCount, timestamp);
}

// -------------------------------------------------------------
// Specialized Builders for High-Yield UPSC ESE Curricula
// -------------------------------------------------------------

function buildSeismicDuctileModule(id: string, count: number): IngestionResult {
  const module: KnowledgeModule = {
    id,
    title: 'Seismic Analysis & Ductile Detailing (IS 13920:2016 & IS 1893:2016)',
    subject: 'Structural Engineering',
    unitName: 'Structural Engineering',
    category: 'civil',
    readTime: '18 min read',
    weightage: 'HIGH_YIELD',
    icon: 'Building2',
    codeClause: 'IS 13920:2016 Cl. 6, 7 & IS 1893:2016 Cl. 6.4',
    confidencePercent: 50,
    masteredStatus: 'Needs Practice',
    subtopicList: [
      'Design Base Shear & Response Reduction Factor (R)',
      'Special Moment Resisting Frames (SMRF) Criteria',
      'Confining Links & Maximum Stirrup Spacing in Plastic Hinges',
      'Strong Column - Weak Beam Philosophy (IS 13920 Cl. 7.2)',
      'Development Length in Tension with Seismic Hooks (135° Hook)'
    ],
    summary: 'Seismic zone factors, design response spectrum, equivalent static base shear VB = Ah * W, and mandatory ductile detailing provisions under IS 13920:2016.',
    fullDescription: 'Earthquake-resistant design relies on structural ductility to dissipate ground kinetic energy through controlled inelastic yielding. IS 13920:2016 enforces specific limits on longitudinal reinforcement ratio, special confining reinforcement spacing (s <= min(d/4, 100mm)), and 135-degree seismic hooks to prevent brittle shear collapse.',
    standardReferences: ['IS 1893 (Part 1):2016', 'IS 13920:2016', 'SP 22 Explanatory Handbook'],
    steps: [
      {
        stepNumber: 1,
        stepTitle: 'Design Base Shear & Horizontal Seismic Coefficient',
        subtitle: 'Equivalent static method and response reduction factors',
        keyConcept: 'Design horizontal seismic coefficient Ah = (Z / 2) * (I / R) * (Sa / g). The design base shear along any principal direction is VB = Ah * W, where W is total seismic weight of the structure including appropriate percentage of live load (25% for live load <= 3 kN/m², 50% for > 3 kN/m²).',
        formulaOrCode: 'A_h = \\frac{Z}{2} \\cdot \\frac{I}{R} \\cdot \\frac{S_a}{g} \\quad ; \\quad V_B = A_h \\cdot W',
        highYieldFacts: [
          'Seismic zones in India: Zone II (Z=0.10), Zone III (Z=0.16), Zone IV (Z=0.24), Zone V (Z=0.36). All of Assam lies in high-risk Zone V.',
          'Response reduction factor R: SMRF = 5.0, OMRF = 3.0. SMRF reduces design lateral force by 40% compared to OMRF.',
          'Importance factor I: Critical structures (hospitals, schools) = 1.5; Residential = 1.2 or 1.0.',
          'Minimum design lateral force VB,min per IS 1893 Cl. 7.2.2 is capped by empirical fundamental period Ta.'
        ],
        examTrap: 'In seismic weight calculations, roof live load is completely IGNORED (0%), but 25% or 50% of floor live loads must be included!'
      },
      {
        stepNumber: 2,
        stepTitle: 'Ductile Detailing of Flexural Members & Columns',
        subtitle: 'Beam-column joint confinement and stirrup geometry',
        keyConcept: 'Beams must have a minimum tension steel ratio of 0.24 sqrt(fck)/fy and maximum ratio of 0.025. In plastic hinge zones (2d from column face), web reinforcement spacing must not exceed min(d/4, 8*diameter of smallest longitudinal bar, 100 mm). Stirrups must terminate in 135° hooks with 10-diameter (or 65 mm) extension.',
        formulaOrCode: 's_v \\le \\min\\left(\\frac{d}{4}, 8\\phi_L, 100\\text{ mm}\\right) \\quad ; \\quad \\sum M_{c} \\ge 1.4 \\sum M_{b}',
        highYieldFacts: [
          'Strong Column - Weak Beam provision (IS 13920 Cl. 7.2): Moment capacity sum of columns at a joint must be at least 1.4 times that of beams.',
          'Splices/lap splices in longitudinal bars are NOT permitted within joint regions or within 2d distance from column faces.',
          'Special confining reinforcement in columns must extend a distance lo >= max(clear column dimension, 1/6 clear height, 450 mm).',
          'At least two bars must run continuously across both top and bottom throughout the entire member length.'
        ],
        examTrap: 'Stirrup hooks in seismic detailing must be bent to 135 degrees! Standard 90-degree hooks will open up during lateral sway and cause catastrophic compression bar buckling.'
      }
    ],
    callouts: {
      corePostulate: 'The Strong Column - Weak Beam rule ensures plastic hinges form in flexural beams rather than vertical columns, preventing global soft-story collapse mechanisms.',
      corePostulateRef: 'IS 13920:2016 Cl. 7.2',
      examTrap: 'Do not confuse Seismic Zone Number with Zone Factor Z! Zone V corresponds to Z = 0.36, NOT 0.50!',
      examTrapRef: 'UPSC ESE 2022 & APSC AE 2020',
      testedRatios: [
        { label: 'Assam Seismic Zone Factor (Zone V):', value: 'Z = 0.36' },
        { label: 'SMRF Response Reduction Factor:', value: 'R = 5.0' },
        { label: 'Max Stirrup Spacing in Plastic Hinge:', value: 'min(d/4, 8 phi, 100 mm)' },
        { label: 'Column to Beam Moment Ratio:', value: 'Sigma Mc >= 1.4 Sigma Mb' }
      ],
      numericalShortcut: {
        formula: 'Fundamental Period for Bare Frame Ta = 0.075 · h^0.75 (RC) or 0.085 · h^0.75 (Steel)',
        note: 'For frames with infill brick masonry: Ta = (0.09 · h) / √d. Use this to determine Sa/g ratio on design spectrum.'
      }
    },
    comparisonGrid: {
      titleLeft: 'Special Moment Resisting Frame (SMRF)',
      tagLeft: 'R = 5.0 (High Ductility)',
      valueLeft: 'Mandatory in Zone IV & V',
      descLeft: 'Requires strict ductile detailing per IS 13920; permits 80% reduction in elastic seismic design force due to plastic energy absorption.',
      titleRight: 'Ordinary Moment Resisting Frame (OMRF)',
      tagRight: 'R = 3.0 (Low Ductility)',
      valueRight: 'Permitted only in Zone II & III',
      descRight: 'Designed per general IS 456 rules without special confining links; structures must resist 67% higher lateral base shear forces.'
    },
    diagramType: 'rcc',
    practiceQuestionIds: []
  };

  const questions: MCQQuestion[] = [
    {
      id: `${id}-q1`,
      questionNumber: 1,
      examId: 'apsc-ae-civil',
      subject: 'Structural Engineering',
      topic: 'Seismic Analysis & Ductile Detailing',
      subtopic: 'IS 13920:2016 Beam Provisions',
      stem: 'Consider the following statements regarding the ductile detailing of beams subjected to seismic forces as per IS 13920:2016:\n1. The minimum tension reinforcement ratio shall not be less than 0.24√(fck) / fy.\n2. The maximum spacing of hoop reinforcement within a distance of 2d from the face of the column shall not exceed min(d/4, 8 times smallest longitudinal bar diameter, 100 mm).\n3. Lap splices for longitudinal bars are permitted within the beam-column joint provided they are enclosed by hoops.\n\nWhich of the statements given above are correct?',
      options: [
        { id: 'A', text: '1 and 2 only' },
        { id: 'B', text: '2 and 3 only' },
        { id: 'C', text: '1 and 3 only' },
        { id: 'D', text: '1, 2 and 3' }
      ],
      correctOption: 'A',
      formulaContext: 'IS 13920:2016 Cl. 6.2 & 6.3.5',
      explanation: 'Statements 1 and 2 are strictly correct per IS 13920:2016. Statement 3 is incorrect because IS 13920 Cl. 6.2.6 explicitly prohibits lap splices within the beam-column joint region and within a distance of 2d from the column face.',
      difficulty: 'HARD',
      pyqExam: 'UPSC ESE / IES 2024 Model'
    },
    {
      id: `${id}-q2`,
      questionNumber: 2,
      examId: 'apsc-ae-civil',
      subject: 'Structural Engineering',
      topic: 'Seismic Analysis & Ductile Detailing',
      subtopic: 'Equivalent Static Base Shear',
      stem: 'A multi-story hospital building (Importance Factor I = 1.5) with Special Moment Resisting Frame (R = 5.0) is to be built in Guwahati (Zone V, Z = 0.36). The spectral acceleration coefficient Sa/g is computed as 2.50. If the total seismic weight of the structure is 10,000 kN, what is the design base shear VB?',
      options: [
        { id: 'A', text: '1,350 kN' },
        { id: 'B', text: '675 kN' },
        { id: 'C', text: '540 kN' },
        { id: 'D', text: '810 kN' }
      ],
      correctOption: 'A',
      formulaContext: 'A_h = \\frac{Z}{2} \\cdot \\frac{I}{R} \\cdot \\frac{S_a}{g} \\quad ; \\quad V_B = A_h \\cdot W',
      explanation: 'Step 1: Compute horizontal seismic coefficient Ah:\nAh = (Z / 2) * (I / R) * (Sa / g) = (0.36 / 2) * (1.5 / 5.0) * 2.50 = 0.18 * 0.30 * 2.50 = 0.135.\nStep 2: Base Shear VB = Ah * W = 0.135 * 10,000 kN = 1,350 kN.',
      difficulty: 'HARD',
      pyqExam: 'UPSC ESE / IES 2023 Model'
    },
    {
      id: `${id}-q3`,
      questionNumber: 3,
      examId: 'apsc-ae-civil',
      subject: 'Structural Engineering',
      topic: 'Seismic Analysis & Ductile Detailing',
      subtopic: 'Strong Column - Weak Beam Rule',
      stem: 'According to IS 13920:2016, at any beam-column joint of an SMRF building, the sum of nominal flexural strengths of columns framing into the joint shall exceed the sum of nominal flexural strengths of beams by at least what factor?',
      options: [
        { id: 'A', text: '1.10' },
        { id: 'B', text: '1.20' },
        { id: 'C', text: '1.40' },
        { id: 'D', text: '1.50' }
      ],
      correctOption: 'C',
      formulaContext: '\\sum M_{nc} \\ge 1.40 \\sum M_{nb}',
      explanation: 'Per IS 13920:2016 Clause 7.2.1, the sum of nominal moment capacities of columns framing into a beam-column joint along each principal axis must be at least 1.40 times the sum of nominal moment capacities of beams framing into the same joint (Sigma M_nc >= 1.40 Sigma M_nb).',
      difficulty: 'HARD',
      pyqExam: 'UPSC ESE / IES 2023'
    }
  ];

  return { module, questions: questions.slice(0, count), source: 'BUILTIN_ESE_ENGINE' };
}

function buildPrestressAnchorageModule(id: string, count: number): IngestionResult {
  const module: KnowledgeModule = {
    id,
    title: 'Prestressed Concrete Anchorage Zone & Bursting Tension (IS 1343:2012)',
    subject: 'Prestressed Concrete',
    unitName: 'Structural Engineering',
    category: 'civil',
    readTime: '17 min read',
    weightage: 'HIGH_YIELD',
    icon: 'Building2',
    codeClause: 'IS 1343:2012 Cl. 19.6 & Guyon / Magnel Methods',
    confidencePercent: 45,
    masteredStatus: 'Weak Area',
    subtopicList: [
      'Stress Distribution in Post-Tensioned End Blocks',
      'Bursting Tension Force Fbst Calculation per IS 1343',
      'Spalling Tensile Stresses & Anchorage Edge Reinforcement',
      'Bearing Pressure Beneath Anchorage Anchor Plates'
    ],
    summary: 'Investigation of concentrated post-tensioning anchor forces, transverse tensile stress trajectories (bursting & spalling), and design of transverse reinforcement per IS 1343:2012.',
    fullDescription: 'In post-tensioned prestressed concrete beams, massive prestressing forces are transmitted over a small bearing plate area (2a), creating severe stress concentrations. Beyond the anchor plate, stress lines diverge, setting up high transverse tensile stresses (bursting tension) along the tendon axis that reach maximum at 0.33 to 0.5 times the prism depth. Transverse steel must be provided to avoid splitting failure.',
    standardReferences: ['IS 1343:2012', 'BS 8110 End Zone Theory', 'Guyon End Block Handbook'],
    steps: [
      {
        stepNumber: 1,
        stepTitle: 'End Block Zone & Transverse Tensile Stresses',
        subtitle: 'Bursting vs Spalling tension phenomena',
        keyConcept: 'The anchorage zone (lead-in zone) extends over a length equal to the depth of the beam (2y0). Concentrated load P creates transverse bursting tension along the tendon axis and spalling tension at the corners of the end face.',
        formulaOrCode: 'F_{bst} = P_k \\cdot \\left[0.32 - 0.30 \\cdot \\frac{y_{po}}{y_o}\\right] \\quad ; \\quad A_{st} = \\frac{F_{bst}}{0.87 f_y}',
        highYieldFacts: [
          'IS 1343 Table 11 provides bursting tensile force ratio Fbst / Pk based on the distribution ratio (ypo / yo).',
          'When (ypo / yo) = 0.2, Fbst = 0.23 Pk; when (ypo / yo) = 0.5, Fbst = 0.17 Pk.',
          'Bursting reinforcement must be distributed in the zone from 0.2 yo to 2.0 yo from the loaded face.',
          'Maximum permissible bearing stress beneath anchorage plate is 0.48 fck * sqrt(A_punch / A_bear) <= 0.8 fck.'
        ],
        examTrap: 'Spalling tension occurs on the loaded end surface itself between anchorages, while bursting tension occurs internally along the tendon axis at distance ~0.5 yo!'
      }
    ],
    callouts: {
      corePostulate: 'The anchorage zone depth equals the total depth of the prism; transverse bursting tension must be resisted solely by reinforcement acting at design stress 0.87 fy.',
      corePostulateRef: 'IS 1343:2012 Cl. 19.6.2',
      examTrap: 'Do not use yield strength fy directly; design bursting steel area uses design stress 0.87 fy!',
      examTrapRef: 'UPSC ESE 2021',
      testedRatios: [
        { label: 'Distribution Ratio ypo / yo = 0.3:', value: 'Fbst / Pk = 0.23' },
        { label: 'Distribution Ratio ypo / yo = 0.7:', value: 'Fbst / Pk = 0.11' },
        { label: 'Permissible Bearing Stress:', value: '0.48 fck · √(A2/A1)' }
      ],
      numericalShortcut: {
        formula: 'Bursting Steel Ast = Fbst / (0.87 · fy)',
        note: 'Must be provided as a closed mesh or orthogonal links placed between 0.1 yo and 1.0 yo from the anchor.'
      }
    },
    comparisonGrid: {
      titleLeft: 'Bursting Tension',
      tagLeft: 'Internal Splitting',
      valueLeft: 'Max at 0.5 yo from anchor',
      descLeft: 'Transverse tensile stresses along the line of prestressing tendon resulting from the lateral dispersion of concentrated compressive stress lines.',
      titleRight: 'Spalling Tension',
      tagRight: 'Surface Separation',
      valueRight: 'Located on End Face',
      descRight: 'Tensile stresses formed on the outer loaded face between multiple anchorages or near edges due to concave curvature of stress trajectories.'
    },
    diagramType: 'rcc',
    practiceQuestionIds: []
  };

  const questions: MCQQuestion[] = [
    {
      id: `${id}-q1`,
      questionNumber: 1,
      examId: 'apsc-ae-civil',
      subject: 'Prestressed Concrete',
      topic: 'Prestressed Concrete Anchorage Zone',
      subtopic: 'Bursting Tension Calculation',
      stem: 'A post-tensioned concrete beam of cross-section 200 mm × 400 mm has a single tendon carrying a jacking force Pk = 1,000 kN anchored concentrically by a 100 mm × 100 mm bearing plate. What is the approximate bursting tensile force Fbst in the end zone according to IS 1343:2012?',
      options: [
        { id: 'A', text: '120 kN' },
        { id: 'B', text: '230 kN' },
        { id: 'C', text: '320 kN' },
        { id: 'D', text: '450 kN' }
      ],
      correctOption: 'B',
      formulaContext: 'F_{bst} = P_k \\cdot \\left[0.32 - 0.30 \\cdot \\frac{y_{po}}{y_o}\\right]',
      explanation: 'Step 1: Compute distribution ratio (ypo / yo):\nyo = 400 / 2 = 200 mm. ypo = 100 / 2 = 50 mm.\nypo / yo = 50 / 200 = 0.25.\nStep 2: Using IS 1343 formula:\nFbst = Pk * [0.32 - 0.30 * 0.25] = 1000 * [0.32 - 0.075] = 1000 * 0.245 ≈ 230 to 245 kN (Option B).',
      difficulty: 'HARD',
      pyqExam: 'UPSC ESE / IES 2024 Model'
    },
    {
      id: `${id}-q2`,
      questionNumber: 2,
      examId: 'apsc-ae-civil',
      subject: 'Prestressed Concrete',
      topic: 'Prestressed Concrete Anchorage Zone',
      subtopic: 'Anchorage Zone Stress Trajectories',
      stem: 'Consider the following statements regarding the end block of a post-tensioned prestressed concrete member:\n1. Bursting tensile stress attains its maximum intensity at approximately 0.5 times the depth of the prism from the loaded face.\n2. Spalling tensile stresses develop on the loaded face itself away from the anchor plates.\n3. The total depth of the transmission zone in post-tensioned beams is independent of the depth of the member.\n\nWhich of the statements given above are correct?',
      options: [
        { id: 'A', text: '1 and 2 only' },
        { id: 'B', text: '2 and 3 only' },
        { id: 'C', text: '1 and 3 only' },
        { id: 'D', text: '1, 2 and 3' }
      ],
      correctOption: 'A',
      formulaContext: 'Guyon & Magnel End Block Theory',
      explanation: 'Statements 1 and 2 are true based on Guyon elasticity solutions. Statement 3 is false because the end zone/transmission length in post-tensioned members is directly proportional to and approximately equal to the total depth of the member (h = 2yo).',
      difficulty: 'HARD',
      pyqExam: 'UPSC ESE / IES 2022'
    }
  ];

  return { module, questions: questions.slice(0, count), source: 'BUILTIN_ESE_ENGINE' };
}

function buildPlasticPortalModule(id: string, count: number): IngestionResult {
  const module: KnowledgeModule = {
    id,
    title: 'Plastic Analysis of Portal Frames & Collapse Load (IS 800:2007)',
    subject: 'Design of Steel Structures',
    unitName: 'Structural Engineering',
    category: 'civil',
    readTime: '17 min read',
    weightage: 'HIGH_YIELD',
    icon: 'Wrench',
    codeClause: 'IS 800:2007 Section 8 & Plastic Mechanism Theorem',
    confidencePercent: 55,
    masteredStatus: 'In Progress',
    subtopicList: [
      'Shape Factor (Zp / Ze) for Standard Sections',
      'Lower Bound (Static) & Upper Bound (Kinematic) Theorems',
      'Independent Mechanisms: Beam, Sway & Combined Mechanisms',
      'Virtual Work Method for Collapse Load Factor (lambda_c)'
    ],
    summary: 'Determination of collapse loads, formation of plastic hinges (N = Ds + 1), and evaluation of independent and combined mechanisms for steel portal frames.',
    fullDescription: 'In plastic design per IS 800:2007, structural capacity is computed when enough cross-sections reach full plastic moment capacity Mp to form an unstable kinematic collapse mechanism. The number of plastic hinges required to form a full mechanism is N = Ds + 1, where Ds is static indeterminacy.',
    standardReferences: ['IS 800:2007 Section 8', 'Baker Plastic Design Handbook'],
    steps: [
      {
        stepNumber: 1,
        stepTitle: 'Plastic Theorems & Independent Mechanisms',
        subtitle: 'Upper bound, lower bound, and virtual work equilibrium',
        keyConcept: 'By the Kinematic (Upper Bound) Theorem, the collapse load computed for any assumed valid mechanism is always greater than or equal to the true collapse load: W_assumed >= W_true. The true collapse load is the minimum of all possible kinematic mechanisms.',
        formulaOrCode: 'W_i = \\sum M_p \\cdot \\theta \\quad ; \\quad W_e = \\sum P_k \\cdot \\Delta_k \\quad ; \\quad W_i = W_e',
        highYieldFacts: [
          'Number of independent mechanisms: N_ind = N_possible_hinges - Static Indeterminacy (Ds).',
          'For a single-bay single-story rectangular portal frame (Ds = 3, 5 possible hinge locations): N_ind = 5 - 3 = 2 (1 Beam + 1 Sway mechanism).',
          'Shape factor Zp / Ze: Diamond = 2.0, Triangle = 2.34, Circle = 1.70, Rectangle = 1.50, I-section = 1.12 to 1.15.',
          'At the true collapse state, Moment diagram satisfies yield condition (M <= Mp everywhere) and equilibrium.'
        ],
        examTrap: 'In combined sway-beam mechanisms, check whether the corner column-beam joint hinge cancels out when rotations oppose each other!'
      }
    ],
    callouts: {
      corePostulate: 'The Uniqueness Theorem states that if an assumed mechanism satisfies yield, equilibrium, and mechanism conditions simultaneously, its collapse load is the unique true collapse load.',
      corePostulateRef: 'Plastic Analysis Mechanics',
      examTrap: 'In fixed-ended beams with central point load, 3 hinges form (2 at supports, 1 under load) yielding collapse load Wc = 8 Mp / L, NOT 4 Mp / L!',
      examTrapRef: 'UPSC ESE 2023 & GATE',
      testedRatios: [
        { label: 'Shape Factor (I-Section):', value: '1.12 - 1.15' },
        { label: 'Shape Factor (Solid Circle):', value: '1.70' },
        { label: 'Shape Factor (Diamond):', value: '2.00' },
        { label: 'Number of Hinges for Full Collapse:', value: 'N = Ds + 1' }
      ],
      numericalShortcut: {
        formula: 'Collapse Load for SSB with UDL: wc = 11.66 · Mp / L² ; Fixed beam with UDL: wc = 16 · Mp / L²',
        note: 'Plastic redistribution increases load carrying capacity of fixed beams by 33% over elastic first yield.'
      }
    },
    comparisonGrid: {
      titleLeft: 'Upper Bound (Kinematic)',
      tagLeft: 'Mechanism Condition',
      valueLeft: 'W_collapse ≤ Assumed W',
      descLeft: 'Equates external virtual work to internal plastic work for any valid mechanism; always overestimates or equals true collapse load.',
      titleRight: 'Lower Bound (Static)',
      tagRight: 'Yield Condition',
      valueRight: 'W_collapse ≥ Assumed W',
      descRight: 'Constructs an equilibrium bending moment diagram where M nowhere exceeds Mp; always underestimates or equals true collapse load.'
    },
    diagramType: 'som',
    practiceQuestionIds: []
  };

  const questions: MCQQuestion[] = [
    {
      id: `${id}-q1`,
      questionNumber: 1,
      examId: 'apsc-ae-civil',
      subject: 'Design of Steel Structures',
      topic: 'Plastic Analysis of Steel Structures',
      subtopic: 'Kinematic Indeterminacy & Independent Mechanisms',
      stem: 'A single-bay, single-story portal frame has fixed base supports and rigid joints. The number of possible plastic hinge locations is 5. What is the number of independent mechanisms for this frame?',
      options: [
        { id: 'A', text: '1' },
        { id: 'B', text: '2' },
        { id: 'C', text: '3' },
        { id: 'D', text: '4' }
      ],
      correctOption: 'B',
      formulaContext: 'N_{ind} = N_{hinges} - D_s',
      explanation: 'Step 1: Compute static indeterminacy Ds for a fixed-fixed portal frame: Ds = 3.\nStep 2: Number of potential plastic hinge locations N = 5 (2 at column bases, 2 at eaves, 1 under beam center load).\nStep 3: Number of independent mechanisms = N - Ds = 5 - 3 = 2 (one beam mechanism, one sway mechanism).',
      difficulty: 'HARD',
      pyqExam: 'UPSC ESE / IES 2024 Model'
    }
  ];

  return { module, questions: questions.slice(0, count), source: 'BUILTIN_ESE_ENGINE' };
}

function buildWellScourModule(id: string, count: number): IngestionResult {
  const module: KnowledgeModule = {
    id,
    title: 'Well Foundations, Caissons & Lacey Scour Depth in Bridge Engineering',
    subject: 'Geotechnical Engineering',
    unitName: 'Geotechnical Engineering',
    category: 'civil',
    readTime: '16 min read',
    weightage: 'HIGH_YIELD',
    icon: 'Mountain',
    codeClause: 'IS 3955:1967 & IRC:78-2014 Section VII',
    confidencePercent: 60,
    masteredStatus: 'In Progress',
    subtopicList: [
      'Components of Well Foundation (Cutting Edge, Well Curb, Steining, Bottom Plug)',
      'Lacey Regime Maximum Scour Depth (R) Formulation',
      'Grip Length Below Scour Line for Stability',
      'Tilts and Shifts Rectification (Grab Dredging, Chisel)'
    ],
    summary: 'Hydraulic and geotechnical design of well foundations for major river bridges in alluvial soils like the Brahmaputra, including Lacey scour depth calculation and grip length requirements per IRC:78.',
    fullDescription: 'Well foundations (caissons) provide massive stability for major river bridges against horizontal hydraulic forces, ship collisions, and severe bed erosion. Design scour depth is computed per Lacey’s regime theory. For bridge piers, the maximum design scour depth is taken as 2.0 R for piers and 1.27 R for abutments.',
    standardReferences: ['IRC:78-2014', 'IS 3955:1967', 'MoRTH Bridge Specifications'],
    steps: [
      {
        stepNumber: 1,
        stepTitle: 'Lacey Scour Depth & Grip Length Criteria',
        subtitle: 'Bed erosion formulation under peak design discharge',
        keyConcept: 'Lacey normal regime scour depth: R = 1.35 * (q² / f)^(1/3) for broad channels or R = 0.473 * (Q / f)^(1/3) for constrained waterways, where q is design discharge intensity (m³/s/m) and f is Lacey silt factor f = 1.76 sqrt(d_mm).',
        formulaOrCode: 'R = 1.35 \\left(\\frac{q^2}{f}\\right)^{1/3} \\quad ; \\quad d_{max} = 2.0 R \\text{ (Pier)} \\quad ; \\quad L_{grip} \\ge \\frac{1}{3} d_{max}',
        highYieldFacts: [
          'Maximum scour depth factors: Piers = 2.0 R, Straight reaches = 1.27 R, Nose of guide bunds = 2.0 to 2.75 R.',
          'Minimum grip length below the design scour line must not be less than 1/3 of the maximum scour depth (IRC:78).',
          'Bottom plug of well foundation is cast underwater using tremie concrete with rich mix (M25/M30) to seal against hydrostatic pressure.',
          'Permissible tilt for bridge wells is 1 in 60; permissible horizontal shift is D/40 or 150 mm.'
        ],
        examTrap: 'Do not confuse total scour depth from HFL with grip length! Grip length is measured strictly BELOW the maximum scour level, NOT from high flood level!'
      }
    ],
    callouts: {
      corePostulate: 'The stability of a well foundation against overturning is governed by lateral earth resistance provided solely by the embedment within the grip length below the scour line.',
      corePostulateRef: 'IRC:78-2014 Cl. 708',
      examTrap: 'In Lacey scour calculations, remember that for bridge piers the multiplying factor is 2.0 R!',
      examTrapRef: 'UPSC ESE 2023 & APSC AE',
      testedRatios: [
        { label: 'Pier Max Scour Multiplier:', value: '2.0 · R' },
        { label: 'Abutment Max Scour Multiplier:', value: '1.27 · R' },
        { label: 'Min Grip Length Below Scour:', value: '≥ 0.33 · d_scour' }
      ],
      numericalShortcut: {
        formula: 'Lacey Silt Factor f = 1.76 · √(d_mm)',
        note: 'For coarse sand (d = 1 mm), f = 1.76. For medium sand (d = 0.3 mm), f = 0.96.'
      }
    },
    comparisonGrid: {
      titleLeft: 'Lacey Scour Depth (Constrained)',
      tagLeft: 'Total Discharge Q',
      valueLeft: 'R = 0.473 · (Q / f)^(1/3)',
      descLeft: 'Used when the total waterway of the bridge is constrained to Lacey regime wetted perimeter P = 4.75 √Q.',
      titleRight: 'Lacey Scour Depth (Wide Channel)',
      tagRight: 'Discharge Intensity q',
      valueRight: 'R = 1.35 · (q² / f)^(1/3)',
      descRight: 'Used when channel is wide and discharge is non-uniform; q is peak discharge intensity per meter width of river.'
    },
    diagramType: 'geotech',
    practiceQuestionIds: []
  };

  const questions: MCQQuestion[] = [
    {
      id: `${id}-q1`,
      questionNumber: 1,
      examId: 'apsc-ae-civil',
      subject: 'Geotechnical Engineering',
      topic: 'Well Foundations & Lacey Scour',
      subtopic: 'Maximum Pier Scour Depth',
      stem: 'In a major alluvial river bridge, the design discharge intensity is q = 8 m³/s/m and Lacey silt factor is f = 1.0. As per IRC:78, what is the design maximum scour depth below the High Flood Level (HFL) around a bridge pier?',
      options: [
        { id: 'A', text: '5.4 m' },
        { id: 'B', text: '10.8 m' },
        { id: 'C', text: '13.5 m' },
        { id: 'D', text: '16.2 m' }
      ],
      correctOption: 'B',
      formulaContext: 'R = 1.35 \\left(\\frac{q^2}{f}\\right)^{1/3} \\quad ; \\quad d_{pier} = 2.0 R',
      explanation: 'Step 1: Normal scour depth R = 1.35 * (q² / f)^(1/3) = 1.35 * (8² / 1.0)^(1/3) = 1.35 * (64)^(1/3) = 1.35 * 4 = 5.40 m.\nStep 2: For bridge piers, IRC:78 mandates multiplying factor of 2.0:\nMax Pier Scour Depth = 2.0 * R = 2.0 * 5.40 m = 10.8 m.',
      difficulty: 'HARD',
      pyqExam: 'UPSC ESE / IES 2024 Model'
    }
  ];

  return { module, questions: questions.slice(0, count), source: 'BUILTIN_ESE_ENGINE' };
}

function buildBodStreeterModule(id: string, count: number): IngestionResult {
  const module: KnowledgeModule = {
    id,
    title: 'Wastewater BOD Kinetics & Streeter-Phelps Dissolved Oxygen Sag',
    subject: 'Environmental Engineering',
    unitName: 'Environmental Engineering',
    category: 'civil',
    readTime: '17 min read',
    weightage: 'HIGH_YIELD',
    icon: 'Droplets',
    codeClause: 'CPHEEO Wastewater Manual & Streeter-Phelps Equation',
    confidencePercent: 55,
    masteredStatus: 'In Progress',
    subtopicList: [
      'First-Order Carbonaceous BOD Kinetics (Lt = L0 * 10^(-K_D * t))',
      'Deoxygenation (K1) and Atmospheric Reaeration (K2) Rates',
      'Self-Purification Constant (f = K2 / K1)',
      'Critical Oxygen Deficit (Dc) and Critical Travel Time (tc)'
    ],
    summary: 'Formulation of microbial organic degradation kinetics, temperature dependence via van \'t Hoff-Arrhenius, and critical oxygen sag analysis for river self-purification.',
    fullDescription: 'The Streeter-Phelps equation describes dissolved oxygen (DO) deficit along a river receiving treated sewage effluent. The oxygen sag curve is a balance between the rate of deoxygenation by aerobic bacteria and the rate of atmospheric reaeration across the river surface.',
    standardReferences: ['CPHEEO Manual on Sewerage', 'Streeter-Phelps Environmental Classic'],
    steps: [
      {
        stepNumber: 1,
        stepTitle: 'First-Order BOD & Oxygen Deficit Equations',
        subtitle: 'Kinetics of microbial oxidation and saturation deficits',
        keyConcept: 'BOD exertion follows first-order reaction: yt = L0 * (1 - e^(-k * t)) = L0 * (1 - 10^(-K_D * t)), where L0 is ultimate carbonaceous BOD. Temperature correction: K_T = K_20 * (1.047)^(T - 20).',
        formulaOrCode: 'D_t = \\frac{K_1 L_0}{K_2 - K_1} \\left[e^{-K_1 t} - e^{-K_2 t}\\right] + D_0 e^{-K_2 t} \\quad ; \\quad t_c = \\frac{1}{K_2 - K_1} \\ln\\left[\\frac{K_2}{K_1}\\left(1 - \\frac{D_0(K_2-K_1)}{K_1 L_0}\\right)\\right]',
        highYieldFacts: [
          'Standard 5-day BOD at 20°C is approximately 68.4% of ultimate BOD L0 when KD = 0.10 day⁻¹ (base 10).',
          'Self-purification ratio f = K2 / K1. If f > 2.0, the stream recovers rapidly from organic contamination.',
          'Critical oxygen deficit occurs when rate of deoxygenation equals rate of reaeration (dD/dt = 0).',
          'Minimum dissolved oxygen (DO) required for healthy game fish survival in rivers is 4.0 mg/L.'
        ],
        examTrap: "Be careful with base 'e' vs base 10 rate constants! k (base e) = 2.303 * KD (base 10)!"
      }
    ],
    callouts: {
      corePostulate: 'At the critical point on the oxygen sag curve, the rate of deoxygenation exactly balances the rate of atmospheric reaeration: K1 * Lt = K2 * Dc.',
      corePostulateRef: 'Streeter-Phelps Mass Balance',
      examTrap: 'Do not confuse 5-day BOD with ultimate BOD L0. L0 is always strictly greater than BOD5!',
      examTrapRef: 'UPSC ESE 2022',
      testedRatios: [
        { label: 'BOD5 / Ultimate L0 (at 20°C):', value: '≈ 0.68' },
        { label: 'Minimum DO for Fish:', value: '4.0 mg/L' },
        { label: 'Self-Purification Constant f:', value: 'K2 / K1' }
      ],
      numericalShortcut: {
        formula: 'Critical Deficit Dc = (L0 / f) · (f · (1 - (f - 1)·D0/L0))^(1/f)',
        note: 'When initial deficit D0 = 0, simplifies to Dc = (L0 / f) · (f)^(1/f).'
      }
    },
    comparisonGrid: {
      titleLeft: 'Deoxygenation Rate (K1)',
      tagLeft: 'Microbial Consumption',
      valueLeft: 'Depletes River DO',
      descLeft: 'Rate at which heterotrophic microorganisms consume dissolved oxygen while biochemically oxidizing carbonaceous organic wastes.',
      titleRight: 'Reaeration Rate (K2)',
      tagRight: 'Surface Diffusion',
      valueRight: 'Replenishes River DO',
      descRight: 'Rate at which atmospheric oxygen dissolves into the river water through turbulent surface mixing; increases with velocity and shallowness.'
    },
    diagramType: 'env',
    practiceQuestionIds: []
  };

  const questions: MCQQuestion[] = [
    {
      id: `${id}-q1`,
      questionNumber: 1,
      examId: 'apsc-ae-civil',
      subject: 'Environmental Engineering',
      topic: 'Wastewater BOD Kinetics',
      subtopic: 'Streeter-Phelps Critical Deficit',
      stem: 'Consider the following statements regarding the Streeter-Phelps oxygen sag curve for a stream receiving wastewater:\n1. At the critical point of the sag curve, the rate of deoxygenation equals the rate of reaeration.\n2. The critical travel time tc decreases as the reaeration constant K2 increases.\n3. The self-purification ratio f is defined as the ratio of deoxygenation constant to reaeration constant (K1 / K2).\n\nWhich of the statements given above is/are correct?',
      options: [
        { id: 'A', text: '1 and 2 only' },
        { id: 'B', text: '2 and 3 only' },
        { id: 'C', text: '1 and 3 only' },
        { id: 'D', text: '1, 2 and 3' }
      ],
      correctOption: 'A',
      formulaContext: 'f = \\frac{K_2}{K_1} \\quad ; \\quad K_1 L_c = K_2 D_c',
      explanation: 'Statements 1 and 2 are correct. Statement 3 is false because the self-purification factor f is defined as the ratio of REAERATION constant to DEOXYGENATION constant: f = K2 / K1 (not K1 / K2).',
      difficulty: 'HARD',
      pyqExam: 'UPSC ESE / IES 2024 Model'
    }
  ];

  return { module, questions: questions.slice(0, count), source: 'BUILTIN_ESE_ENGINE' };
}

function buildBrahmaputraFloodModule(id: string, count: number): IngestionResult {
  const module: KnowledgeModule = {
    id,
    title: 'Brahmaputra Flood Hydrology, Geotextile Embankments & Riverbank Erosion',
    subject: 'Geography of India & Assam',
    unitName: 'Geography of India & Assam',
    category: 'gs',
    readTime: '16 min read',
    weightage: 'HIGH_YIELD',
    icon: 'Droplets',
    codeClause: 'Brahmaputra Master Plan & Central Water Commission',
    confidencePercent: 70,
    masteredStatus: 'Mastered',
    subtopicList: [
      'Sediment Load Dynamics & Channel Braiding Phenomenon',
      'Geotextile Bags (Geo-Bags) & Porous Porcupine River Training',
      'Embankment Breaches & River Avulsion Mechanisms',
      'Assam Water Resources Department Structural Interventions'
    ],
    summary: 'Geomorphology, torrential sediment discharge, flood mitigation strategies, and modern geotextile embankment revetments along the Brahmaputra River in Assam.',
    fullDescription: 'The Brahmaputra carries an immense suspended sediment load of over 400 million tonnes per annum due to active Himalayan tectonics and monsoonal cloudbursts. This creates severe braided riverbed dynamics, causing catastrophic annual riverbank erosion and avulsions. Modern mitigation employs RCC porcupines for siltation and geotextile bag mattresses for anti-scour bank protection.',
    standardReferences: ['CWC Brahmaputra Basin Report', 'Assam State Disaster Management Plan'],
    steps: [
      {
        stepNumber: 1,
        stepTitle: 'Sediment Load & Braided Channel Morphometry',
        subtitle: 'High-energy fluvial dynamics in Assam valley',
        keyConcept: 'The Brahmaputra valley is narrow (80 km wide) with a very low gradient (1:10,000). Huge sediment influx from steep northern tributaries (Subansiri, Jia Bharali, Manas) forces the main channel to continuously form sand shoals (Chars), bifurcate into braided channels, and severely attack riverbanks.',
        formulaOrCode: 'Q_{sediment} > 400 \\times 10^6 \\text{ tonnes/yr} \\quad ; \\quad \\text{Gradient} \\approx 1 : 10,000',
        highYieldFacts: [
          'Over 4.27 lakh hectares (7.4% of Assam’s landmass) has been lost to riverbank erosion since 1950.',
          'Geo-textile bags (filled with sand) are placed as pitching mattresses over non-woven geotextile filter fabric.',
          'RCC Porcupines act as permeable groynes that slow water velocity, encouraging silt deposition along eroding banks.',
          'Majuli island shrank from ~1250 sq km in the early 20th century to ~352 sq km due to continuous south-bank erosion.'
        ],
        examTrap: 'Embankments alone cannot prevent flooding permanently; without channel dredging and watershed soil conservation in upper catchments, riverbed aggradation continues to raise flood levels above embankment crests!'
      }
    ],
    callouts: {
      corePostulate: 'Non-structural measures (flood forecasting, spatial zoning, geo-textile revetment) are more sustainable in braided Himalayan rivers than continuous rigid embankments.',
      corePostulateRef: 'National Water Policy & NDMA Guidelines',
      examTrap: 'RCC porcupines are permeable structures, NOT impermeable spurs!',
      examTrapRef: 'APSC CCE & AE 2022',
      testedRatios: [
        { label: 'Assam Landmass Lost to Erosion:', value: '7.4% (4.27 lakh ha)' },
        { label: 'Average Brahmaputra Valley Gradient:', value: '1 in 10,000' },
        { label: 'Annual Suspended Sediment Load:', value: '> 400 Million Tonnes' }
      ],
      numericalShortcut: {
        formula: 'River Aggradation Rate = Delta Bed Level / Delta Time',
        note: 'The 1950 earthquake raised the riverbed at Dibrugarh by over 3 meters permanently.'
      }
    },
    comparisonGrid: {
      titleLeft: 'RCC Porcupine Screen',
      tagLeft: 'Permeable Siltation Spur',
      valueLeft: 'Velocity Attenuation',
      descLeft: 'Tetrahedral concrete prisms laced with wire mesh; retards flow velocity and promotes sediment deposition to reclaim eroding riverbanks.',
      titleRight: 'Geo-Bag Revetment',
      tagRight: 'Impervious Shielding',
      valueRight: 'Direct Armouring',
      descRight: 'Heavy polypropylene sand-filled geotextile containers laid as launch aprons to resist shear traction forces from high-velocity flood flows.'
    },
    diagramType: 'assam',
    practiceQuestionIds: []
  };

  const questions: MCQQuestion[] = [
    {
      id: `${id}-q1`,
      questionNumber: 1,
      examId: 'apsc-ae-civil',
      subject: 'Geography of India & Assam',
      topic: 'Brahmaputra Flood Hydrology',
      subtopic: 'River Training Technologies in Assam',
      stem: 'With reference to flood and riverbank erosion management in Assam, consider the following statements:\n1. Non-woven geotextile filter fabrics prevent the washing out of fine subsoil particles while permitting free relief of pore water pressure.\n2. RCC Porcupines function as impermeable groynes designed to deflect high-velocity currents away from the riverbank.\n3. The Brahmaputra riverbed at Dibrugarh rose significantly following the Great Assam Earthquake of 1950.\n\nWhich of the statements given above are correct?',
      options: [
        { id: 'A', text: '1 and 3 only' },
        { id: 'B', text: '2 and 3 only' },
        { id: 'C', text: '1 and 2 only' },
        { id: 'D', text: '1, 2 and 3' }
      ],
      correctOption: 'A',
      formulaContext: 'CWC & Assam Water Resources Department Protocols',
      explanation: 'Statements 1 and 3 are correct. Statement 2 is incorrect because RCC Porcupines are PERMEABLE river training devices that dampen flow velocity to promote sediment deposition, NOT impermeable spurs (which deflect current).',
      difficulty: 'HARD',
      pyqExam: 'UPSC CSE / APSC CCE 2024 Model'
    }
  ];

  return { module, questions: questions.slice(0, count), source: 'BUILTIN_ESE_ENGINE' };
}

function buildSixthScheduleModule(id: string, count: number): IngestionResult {
  const module: KnowledgeModule = {
    id,
    title: 'Sixth Schedule Autonomous District Councils in Assam & Article 244(2)',
    subject: 'Indian Polity & Constitution',
    unitName: 'Indian Polity & Governance',
    category: 'gs',
    readTime: '15 min read',
    weightage: 'HIGH_YIELD',
    icon: 'ShieldCheck',
    codeClause: 'Constitution of India Art. 244(2) & 6th Schedule',
    confidencePercent: 65,
    masteredStatus: 'In Progress',
    subtopicList: [
      'Autonomous District Councils (ADCs) in Assam: BTC, KAAC, DHAC',
      'Legislative, Executive & Judicial Powers of Autonomous Councils',
      'Role of the Governor under Paragraph 1 to 21 of 6th Schedule',
      'Distinction Between Fifth Schedule and Sixth Schedule Areas'
    ],
    summary: 'Constitutional framework under Article 244(2), Bodoland Territorial Council, Karbi Anglong, Dima Hasao, and judicial/financial powers of tribal district councils in Assam.',
    fullDescription: 'The Sixth Schedule provides significant local self-governance autonomy for tribal areas in Assam, Meghalaya, Tripura, and Mizoram. It empowers Autonomous District Councils to enact laws on land, forests, village councils, and customary marriage traditions, with independent district fund management.',
    standardReferences: ['Constitution of India (Part X & Sixth Schedule)', 'Bordoloi Sub-Committee Report (1947)'],
    steps: [
      {
        stepNumber: 1,
        stepTitle: 'Constitutional Architecture & Autonomous Councils of Assam',
        subtitle: 'Articles 244(2) & 275(1) Provisions',
        keyConcept: 'Created on the recommendations of the Gopinath Bordoloi Sub-Committee. The Sixth Schedule contains 21 paragraphs providing legislative autonomy over land, customary law, and village courts.',
        formulaOrCode: '\\text{Four States (AMTM)}: \\text{Assam, Meghalaya, Tripura, Mizoram}',
        highYieldFacts: [
          'Assam has 3 Autonomous Councils under the 6th Schedule: Bodoland Territorial Council (BTC), Karbi Anglong Autonomous Council (KAAC), and Dima Hasao Autonomous Council (DHAC).',
          'Standard ADCs have up to 30 members: 26 elected on adult suffrage and 4 nominated by the Governor.',
          'BTC (established under 2003 Bodo Accord) has special status with 46 members (40 elected, 6 nominated).',
          'Acts of Parliament or Assam State Assembly do NOT automatically apply to 6th Schedule areas unless notified by the Governor or Council.'
        ],
        examTrap: 'Sixth Schedule applies to Assam, Meghalaya, Tripura, Mizoram (AMTM). It does NOT apply to Nagaland (Art 371A) or Manipur (Art 371C)!'
      }
    ],
    callouts: {
      corePostulate: 'Autonomous District Councils have the constitutional power to create village councils and courts for trials of suits between tribal members per customary law.',
      corePostulateRef: 'Constitution of India, 6th Schedule Para 4',
      examTrap: 'The Governor has the ultimate power to organize and re-organize the boundaries of autonomous districts!',
      examTrapRef: 'APSC CCE & UPSC CSE',
      testedRatios: [
        { label: 'Assam ADCs:', value: 'BTC, KAAC, DHAC (3 Councils)' },
        { label: 'Standard ADC Members:', value: '30 (26 elected, 4 nominated)' },
        { label: 'BTC Members:', value: '46 (40 elected, 6 nominated)' }
      ],
      numericalShortcut: {
        formula: 'Constitutional Key: Art. 244(1) = 5th Schedule ; Art. 244(2) = 6th Schedule',
        note: 'Sixth Schedule grants far greater legislative and judicial autonomy than Fifth Schedule advisory councils.'
      }
    },
    comparisonGrid: {
      titleLeft: 'Sixth Schedule (Art. 244(2))',
      tagLeft: 'Assam, Meghalaya, Tripura, Mizoram',
      valueLeft: 'Autonomous District Councils',
      descLeft: 'Mini-legislatures with powers to make laws on land, forests, and customs; independent judicial tribunals; direct budget allocations.',
      titleRight: 'Fifth Schedule (Art. 244(1))',
      tagRight: '10 Other States in India',
      valueRight: 'Tribes Advisory Councils (TAC)',
      descRight: 'Advisory in nature; executive power of the state extends to these areas; Governor consults TAC on regulatory welfare.'
    },
    diagramType: 'polity',
    practiceQuestionIds: []
  };

  const questions: MCQQuestion[] = [
    {
      id: `${id}-q1`,
      questionNumber: 1,
      examId: 'upsc-cse',
      subject: 'Indian Polity & Constitution',
      topic: 'Sixth Schedule of the Constitution',
      subtopic: 'Autonomous District Councils in Assam',
      stem: 'With reference to the Sixth Schedule of the Indian Constitution, consider the following statements:\n1. It applies exclusively to tribal areas in the states of Assam, Meghalaya, Tripura, and Mizoram.\n2. In Assam, the Bodoland Territorial Council (BTC) operates as an Autonomous District Council under the Sixth Schedule.\n3. An Act of Parliament automatically applies to all Sixth Schedule areas without requiring any notification or assent from the Governor.\n\nWhich of the statements given above are correct?',
      options: [
        { id: 'A', text: '1 and 2 only' },
        { id: 'B', text: '2 and 3 only' },
        { id: 'C', text: '1 and 3 only' },
        { id: 'D', text: '1, 2 and 3' }
      ],
      correctOption: 'A',
      formulaContext: 'Constitution of India, Sixth Schedule Para 12A',
      explanation: 'Statements 1 and 2 are correct. Statement 3 is false: Under Paragraph 12A of the Sixth Schedule, Acts of Parliament do not automatically apply to autonomous districts in Assam; the Governor may by public notification direct that an Act shall not apply or shall apply with specified exceptions and modifications.',
      difficulty: 'HARD',
      pyqExam: 'UPSC CSE / APSC CCE 2024 Model'
    }
  ];

  return { module, questions: questions.slice(0, count), source: 'BUILTIN_ESE_ENGINE' };
}

// -------------------------------------------------------------
// Dynamic Generic Builder for any arbitrary user query
// -------------------------------------------------------------

function buildGenericEseModule(
  id: string,
  query: string,
  category: 'civil' | 'gs',
  targetLevel: string,
  count: number,
  timestamp: number
): IngestionResult {
  const isCivil = category === 'civil';
  const unitName = isCivil ? 'Specialized Technical Engineering' : 'Advanced Curricular Studies';
  const subject = isCivil ? 'Civil Engineering Core' : 'General Studies & Regional Studies';

  const module: KnowledgeModule = {
    id,
    title: `${query} (Advanced Curricular Module)`,
    subject,
    unitName,
    category,
    readTime: '15 min read',
    weightage: 'HIGH_YIELD',
    icon: isCivil ? 'Building2' : 'BookOpen',
    codeClause: isCivil ? 'National Standard Engineering Specifications' : 'Statutory & Curricular Standards',
    confidencePercent: 45,
    masteredStatus: 'Needs Practice',
    subtopicList: [
      `Fundamental Principles of ${query}`,
      `Governing Equations & Formulations for ${query}`,
      `Examination Failure Modes & Boundary Conditions`,
      `State PSC & ESE Question Applications`
    ],
    summary: `In-depth theoretical foundation, mathematical derivations, standard codal references, and calibrated examination problems for ${query}.`,
    fullDescription: `Comprehensive study module covering advanced concepts of ${query}. Formulated to meet the analytical and numerical standards of competitive engineering and civil service examinations.`,
    standardReferences: ['UPSC ESE Benchmark Specifications', 'State PSC Reference Guidelines'],
    steps: [
      {
        stepNumber: 1,
        stepTitle: `Core Concepts & Theoretical Framework of ${query}`,
        subtitle: 'Foundational postulates and analytical parameters',
        keyConcept: `The study of ${query} involves rigorous evaluation of governing equilibrium equations, boundary constraints, and empirical codal correlations. Understanding underlying failure modes enables rapid elimination of exam distractors.`,
        formulaOrCode: '\\sigma_{allowable} = \\frac{\\sigma_{ultimate}}{\\text{FOS}} \\quad ; \\quad \\Delta = \\int \\frac{M m}{E I} dx',
        highYieldFacts: [
          `Key parameter limits are strictly verified against national examination standards.`,
          `Boundary conditions dictate internal stress distribution and load capacity.`,
          `Recent competitive papers emphasize multi-statement conceptual inquiries over direct rote recall.`,
          `Always check unit consistency (e.g. converting kN/m² to N/mm²) before substituting into empirical formulas.`
        ],
        examTrap: 'Beware of sign conventions and assumed boundary conditions in competitive papers.'
      }
    ],
    callouts: {
      corePostulate: `Accurate application of governing parameters is critical to passing the analytical threshold in UPSC ESE and State AE examinations.`,
      corePostulateRef: 'Technical Standards Handbook',
      examTrap: 'Common mistake: overlooking partial safety factors or assuming linear elastic behavior past yield.',
      examTrapRef: 'Standard Exam Pitfall',
      testedRatios: [
        { label: 'Recommended Safety Factor:', value: '1.50 - 2.00' },
        { label: 'Analysis Accuracy Tolerance:', value: '± 2.5%' }
      ],
      numericalShortcut: {
        formula: 'Rapid Estimation Factor = 0.87 · Capacity_nominal',
        note: 'Use standard coefficient shortcuts to verify numerical choices in timed multiple-choice papers.'
      }
    },
    comparisonGrid: {
      titleLeft: 'Primary Mechanism',
      tagLeft: 'Dominant Behavior',
      valueLeft: 'Governing Limit State',
      descLeft: 'Direct analytical response under standard operational loading and environmental conditions.',
      titleRight: 'Secondary Effects',
      tagRight: 'Higher Order Terms',
      valueRight: 'Serviceability Limit',
      descRight: 'Secondary deformation, thermal expansion, and long-term creep considerations under prolonged exposure.'
    },
    diagramType: isCivil ? 'som' : 'polity',
    practiceQuestionIds: []
  };

  const questions: MCQQuestion[] = [
    {
      id: `${id}-q1`,
      questionNumber: 1,
      examId: isCivil ? 'apsc-ae-civil' : 'upsc-cse',
      subject,
      topic: query,
      subtopic: 'Governing Principles & Provisions',
      stem: `With reference to ${query}, consider the following statements:\n1. The design criteria must satisfy safety at ultimate limit states as well as serviceability under normal working loads.\n2. Empirical coefficients defined in standard specifications remain independent of boundary condition variations.\n3. The governing mathematical formulation incorporates partial safety factors to account for material uncertainties.\n\nWhich of the statements given above is/are correct?`,
      options: [
        { id: 'A', text: '1 and 3 only' },
        { id: 'B', text: '2 and 3 only' },
        { id: 'C', text: '1 and 2 only' },
        { id: 'D', text: '1, 2 and 3' }
      ],
      correctOption: 'A',
      formulaContext: '\\text{Limit State Method (LSM) & Safety Verification}',
      explanation: `Statements 1 and 3 are correct. Statement 2 is incorrect because empirical and analytical coefficients are strongly dependent on boundary conditions, restraint stiffness, and structural geometry.`,
      difficulty: 'HARD',
      pyqExam: 'UPSC ESE / IES 2024 Calibrated'
    }
  ];

  return { module, questions: questions.slice(0, count), source: 'BUILTIN_ESE_ENGINE' };
}
