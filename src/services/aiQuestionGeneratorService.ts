import { MCQQuestion, MCQOption, QuestionKind } from '../types';
import { callGemini, getGeminiApiKey, getSavedGeminiModel } from './geminiService';
import { callOpenCode, getOpenCodeConfig } from './opencodeService';
import { CIVIL_ENGINEERING_QUESTIONS } from '../data/mockData';

export interface GenerateQuestionsOptions {
  topic: string;
  count: number;
  questionType?: 'all' | 'STATEMENT_BASED' | 'NUMERICAL' | 'CONCEPTUAL' | 'ASSERTION_REASON';
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD' | 'MIXED';
  examContext?: string;
  sourceMode?: 'offline' | 'online';
  aiEngine?: 'gemini' | 'opencode';
  onProgress?: (completed: number, total: number) => void;
}

export interface GeneratedQuestionItem {
  id: string;
  stem: string;
  options: MCQOption[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  formulaContext?: string;
  referenceSource?: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  questionType: QuestionKind;
  topic: string;
  subject: string;
}

/**
 * Normalizes raw model output options into standard [{ id: 'A'|'B'|'C'|'D', text: string }]
 */
function normalizeOptions(rawOptions: any): MCQOption[] {
  const letters: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
  const result: MCQOption[] = [];

  if (Array.isArray(rawOptions)) {
    for (let i = 0; i < 4; i++) {
      const item = rawOptions[i];
      const letter = letters[i];
      if (typeof item === 'string') {
        // Strip leading "A)", "A.", "(A)", etc.
        const cleaned = item.replace(/^\(?[A-Da-d]\)?[\.\:\-\s]+/, '').trim();
        result.push({ id: letter, text: cleaned || `Option ${letter}` });
      } else if (item && typeof item === 'object') {
        const text = item.text || item.option || item.label || item.value || '';
        const cleaned = String(text).replace(/^\(?[A-Da-d]\)?[\.\:\-\s]+/, '').trim();
        result.push({ id: letter, text: cleaned || `Option ${letter}` });
      } else {
        result.push({ id: letter, text: `Option ${letter}` });
      }
    }
  } else if (rawOptions && typeof rawOptions === 'object') {
    for (const letter of letters) {
      const val = rawOptions[letter] || rawOptions[letter.toLowerCase()] || `Option ${letter}`;
      const cleaned = String(val).replace(/^\(?[A-Da-d]\)?[\.\:\-\s]+/, '').trim();
      result.push({ id: letter, text: cleaned });
    }
  } else {
    for (const letter of letters) {
      result.push({ id: letter, text: `Option ${letter}` });
    }
  }

  return result;
}

/**
 * Extracts and cleans JSON from raw Gemini markdown code fences
 */
function parseJsonArray(text: string): any[] {
  let cleaned = text.trim();
  // Strip code fences if present
  const fenced = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) {
    cleaned = fenced[1].trim();
  }

  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && Array.isArray(parsed.questions)) return parsed.questions;
    if (parsed && Array.isArray(parsed.items)) return parsed.items;
    return [];
  } catch (err) {
    // If trailing comma or partial truncation, attempt regex match of objects
    const matches = cleaned.match(/\{[\s\S]*?\}(?=\s*,\s*\{|\s*\])/g);
    if (matches && matches.length > 0) {
      const items: any[] = [];
      for (const m of matches) {
        try {
          items.push(JSON.parse(m));
        } catch {}
      }
      return items;
    }
    return [];
  }
}

/**
 * Fallback offline generator for key civil engineering topics (e.g. CPM/PERT, Soil, SOM)
 * when Gemini API key is absent or offline.
 */
function generateOfflineFallbackQuestions(opts: GenerateQuestionsOptions): GeneratedQuestionItem[] {
  const topicLower = (opts.topic || 'Civil Engineering').toLowerCase();
  const count = Math.max(1, Math.min(opts.count || 5, 100));

  const irrigationFallbacks: GeneratedQuestionItem[] = [
    {
      id: `ai-gen-irr-${Date.now()}-1`,
      stem: 'Consider the following statements regarding Duty, Delta, and Base Period in Irrigation Engineering:\nStatement 1: Duty of irrigation water is highest at the field and lowest at the head of the main canal.\nStatement 2: For a given crop with base period B (days) and delta Δ (metres), the duty D (ha/cumec) is given by D = 8.64 B / Δ.\nWhich of the above statements is/are correct?',
      options: [
        { id: 'A', text: '1 only' },
        { id: 'B', text: '2 only' },
        { id: 'C', text: 'Both 1 and 2' },
        { id: 'D', text: 'Neither 1 nor 2' }
      ],
      correctOption: 'C',
      explanation: 'Both statements are correct. Duty is the area irrigated per unit discharge. Due to conveyance losses (seepage and evaporation) along canal networks, discharge decreases downstream while the area irrigable remains, meaning Duty increases towards the field (outlet duty > branch duty > main canal duty). Statement 2 represents the fundamental relationship: D = 8.64 B / Δ (where Δ is in m) or D = 864 B / Δ (where Δ is in cm).',
      formulaContext: 'D = (8.64 · B) / Δ  (Δ in m, B in days, D in ha/cumec)',
      referenceSource: 'ExamVeda (Irrigation Engineering) & S.K. Garg',
      difficulty: 'EASY',
      questionType: 'STATEMENT_BASED',
      topic: 'Irrigation & Water Requirements',
      subject: 'Hydrology & Irrigation Engineering'
    },
    {
      id: `ai-gen-irr-${Date.now()}-2`,
      stem: 'A crop has a base period of 120 days and requires a total depth of water (Delta) of 108 cm. What is the duty of irrigation water at the field head?',
      options: [
        { id: 'A', text: '864 ha/cumec' },
        { id: 'B', text: '960 ha/cumec' },
        { id: 'C', text: '1080 ha/cumec' },
        { id: 'D', text: '1200 ha/cumec' }
      ],
      correctOption: 'B',
      explanation: 'Duty D = (864 * B) / Delta = (864 * 120) / 108 = 103,680 / 108 = 960 ha/cumec.',
      formulaContext: 'D = (864 · B) / Δ = (864 · 120) / 108 = 960 ha/cumec',
      referenceSource: 'APSC AE Civil 2024 & ExamVeda Irrigation',
      difficulty: 'MEDIUM',
      questionType: 'NUMERICAL',
      topic: 'Crop Water Requirements',
      subject: 'Hydrology & Irrigation Engineering'
    },
    {
      id: `ai-gen-irr-${Date.now()}-3`,
      stem: 'According to Gerald Lacey regime theory for alluvial channels, the wetted perimeter P is directly proportional to:',
      options: [
        { id: 'A', text: 'Discharge Q' },
        { id: 'B', text: 'Square root of discharge (Q^0.5)' },
        { id: 'C', text: 'Cube root of discharge (Q^0.33)' },
        { id: 'D', text: 'Silt factor f only' }
      ],
      correctOption: 'B',
      explanation: 'Lacey regime perimeter equation is P = 4.75 * sqrt(Q). Thus, wetted perimeter P is directly proportional to Q^0.5 (square root of design discharge), independent of silt factor f.',
      formulaContext: 'P = 4.75 · √Q',
      referenceSource: 'GATE Civil Engineering & ExamVeda Canal Design',
      difficulty: 'EASY',
      questionType: 'CONCEPTUAL',
      topic: 'Canal Design (Lacey Regime Theory)',
      subject: 'Hydrology & Irrigation Engineering'
    },
    {
      id: `ai-gen-irr-${Date.now()}-4`,
      stem: 'Consider the following statements regarding Kennedy and Lacey theories of canal design:\nStatement 1: Kennedy assumed that silt is kept in suspension solely by upward eddies generated from the canal bed.\nStatement 2: Lacey regime perimeter equation depends significantly on the mean particle diameter d_mm of the bed silt.\nWhich of the above statements is/are correct?',
      options: [
        { id: 'A', text: '1 only' },
        { id: 'B', text: '2 only' },
        { id: 'C', text: 'Both 1 and 2' },
        { id: 'D', text: 'Neither 1 nor 2' }
      ],
      correctOption: 'A',
      explanation: 'Statement 1 is correct: R.G. Kennedy assumed upward vertical eddies arise only from the canal bed. Statement 2 is incorrect: Lacey wetted perimeter P = 4.75 * sqrt(Q) is completely independent of silt size or silt factor f.',
      formulaContext: 'Kennedy: V_o = 0.55 · m · y^0.64 ; Lacey: P = 4.75 · √Q',
      referenceSource: 'UPSC ESE / IES Civil Paper II & ExamVeda',
      difficulty: 'MEDIUM',
      questionType: 'STATEMENT_BASED',
      topic: 'Canal Design Theories',
      subject: 'Hydrology & Irrigation Engineering'
    },
    {
      id: `ai-gen-irr-${Date.now()}-5`,
      stem: 'In a stable regime channel designed by Lacey theory carrying a discharge of 64 cumecs with a silt factor f = 1.0, what is the regime scour depth R?',
      options: [
        { id: 'A', text: '1.89 m' },
        { id: 'B', text: '2.40 m' },
        { id: 'C', text: '3.25 m' },
        { id: 'D', text: '4.75 m' }
      ],
      correctOption: 'A',
      explanation: 'Regime scour depth is given by R = 0.473 * (Q / f)^(1/3) = 0.473 * (64 / 1.0)^(1/3) = 0.473 * 4 = 1.892 m.',
      formulaContext: 'R = 0.473 · (Q / f)^(1/3) = 0.473 · (64)^(1/3) = 1.89 m',
      referenceSource: 'GATE Civil 2022 & Sanfoundry Irrigation',
      difficulty: 'HARD',
      questionType: 'NUMERICAL',
      topic: 'Lacey Scour Depth Analysis',
      subject: 'Hydrology & Irrigation Engineering'
    },
    {
      id: `ai-gen-irr-${Date.now()}-6`,
      stem: 'Which cross-drainage work is constructed when the canal bed level is higher than the High Flood Level (HFL) of the natural drainage stream?',
      options: [
        { id: 'A', text: 'Aqueduct' },
        { id: 'B', text: 'Syphon Aqueduct' },
        { id: 'C', text: 'Super Passage' },
        { id: 'D', text: 'Canal Syphon' }
      ],
      correctOption: 'A',
      explanation: 'In an Aqueduct, the canal is taken over the drainage stream, and the canal bed is strictly above the highest flood level (HFL) of the drainage, allowing free atmospheric flow under gravity beneath the canal trough.',
      formulaContext: 'Canal Bed Level > Drainage HFL → Aqueduct',
      referenceSource: 'ExamVeda (Hydraulic Structures) & B.C. Punmia',
      difficulty: 'EASY',
      questionType: 'CONCEPTUAL',
      topic: 'Cross Drainage Works',
      subject: 'Hydrology & Irrigation Engineering'
    },
    {
      id: `ai-gen-irr-${Date.now()}-7`,
      stem: 'Consider the following statements regarding soil moisture constants and irrigation:\nStatement 1: The water available for crop plant uptake is the moisture between Field Capacity (FC) and Permanent Wilting Point (PWP).\nStatement 2: Readily available moisture is typically 75% to 80% of the total available moisture capacity in the root zone.\nWhich of the above statements is/are correct?',
      options: [
        { id: 'A', text: '1 only' },
        { id: 'B', text: '2 only' },
        { id: 'C', text: 'Both 1 and 2' },
        { id: 'D', text: 'Neither 1 nor 2' }
      ],
      correctOption: 'C',
      explanation: 'Both statements are correct. Available water capacity = FC - PWP. Gravitational water drains out rapidly, while hygroscopic water below PWP is bound at tensions > 15 atmospheres, beyond plant root osmotic extraction capability. Readily available moisture (RAM) is that fraction (75-80%) which plants can extract without experiencing water stress.',
      formulaContext: 'AM = (γ_d · d / γ_w) · (FC - PWP) ; RAM ≈ 0.75 · AM',
      referenceSource: 'ExamVeda & Indian Standard IS 5529 (Irrigation)',
      difficulty: 'MEDIUM',
      questionType: 'STATEMENT_BASED',
      topic: 'Soil Moisture & Plant Growth',
      subject: 'Hydrology & Irrigation Engineering'
    },
    {
      id: `ai-gen-irr-${Date.now()}-8`,
      stem: 'The first watering given to a crop when the seedlings are a few centimetres high is termed as:',
      options: [
        { id: 'A', text: 'Paleo watering' },
        { id: 'B', text: 'Kor watering' },
        { id: 'C', text: 'Outlet watering' },
        { id: 'D', text: 'Base watering' }
      ],
      correctOption: 'B',
      explanation: 'Kor watering is the first significant watering applied when crop seedlings are a few centimetres above ground. The depth applied during this period is Kor depth (kd), and the time allowed is Kor period. Paleo watering is done prior to sowing to prepare the seedbed.',
      formulaContext: 'Kor period defines maximum design canal capacity: Q_kor = (Area · Kor Depth) / Kor Period',
      referenceSource: 'Sanfoundry (Irrigation Engineering) & IndiaBIX',
      difficulty: 'EASY',
      questionType: 'CONCEPTUAL',
      topic: 'Water Requirements of Crops',
      subject: 'Hydrology & Irrigation Engineering'
    },
    {
      id: `ai-gen-irr-${Date.now()}-9`,
      stem: 'For the elementary profile of a gravity dam of height H, specific gravity of masonry G, with no uplift pressure, what is the minimum base width B required to prevent tension at the heel?',
      options: [
        { id: 'A', text: 'B = H / G' },
        { id: 'B', text: 'B = H / √G' },
        { id: 'C', text: 'B = H / (G · μ)' },
        { id: 'D', text: 'B = H · √G' }
      ],
      correctOption: 'B',
      explanation: 'To prevent tension at the heel under full reservoir condition (resultant passing through middle third limit e <= B/6), the minimum base width without uplift is B = H / sqrt(G). When full uplift is considered (c = 1), B = H / sqrt(G - 1).',
      formulaContext: 'B_min = H / √G (without uplift) ; B_min = H / √(G - 1) (with full uplift)',
      referenceSource: 'GATE Civil & UPSC ESE (Gravity Dams)',
      difficulty: 'MEDIUM',
      questionType: 'CONCEPTUAL',
      topic: 'Gravity Dam Design',
      subject: 'Hydrology & Irrigation Engineering'
    },
    {
      id: `ai-gen-irr-${Date.now()}-10`,
      stem: 'Consider the following statements regarding canal silt control works:\nStatement 1: A Silt Excluder is constructed in the river pocket upstream of the canal head regulator to divert bed sediment away from the canal.\nStatement 2: A Silt Ejector (Extractor) is constructed on the canal bed downstream of the head regulator to remove silt that has already entered the canal.\nWhich of the above statements is/are correct?',
      options: [
        { id: 'A', text: '1 only' },
        { id: 'B', text: '2 only' },
        { id: 'C', text: 'Both 1 and 2' },
        { id: 'D', text: 'Neither 1 nor 2' }
      ],
      correctOption: 'C',
      explanation: 'Both statements are true: Silt Excluders are upstream in the river/barrage pocket to skim clear water into the head regulator while flushing heavy bed silt through under-sluices. Silt Ejectors are positioned a short distance downstream inside the canal to extract sediment via bottom tunnels.',
      formulaContext: 'Silt Excluder: Upstream river pocket; Silt Ejector: Downstream inside canal',
      referenceSource: 'ExamVeda & S.K. Garg Hydraulic Structures',
      difficulty: 'MEDIUM',
      questionType: 'STATEMENT_BASED',
      topic: 'Canal Regulators & Silt Control',
      subject: 'Hydrology & Irrigation Engineering'
    },
    {
      id: `ai-gen-irr-${Date.now()}-11`,
      stem: 'Water conveyance efficiency (ηc) of an irrigation canal network is defined as the ratio of:',
      options: [
        { id: 'A', text: 'Water delivered to the field plot to water diverted from the river/reservoir at canal head' },
        { id: 'B', text: 'Water stored in the root zone to water delivered to the plot' },
        { id: 'C', text: 'Water beneficially used by crops to water delivered to the field' },
        { id: 'D', text: 'Water stored in root zone to water needed prior to irrigation' }
      ],
      correctOption: 'A',
      explanation: 'Water Conveyance Efficiency ηc = (Wf / Wr) * 100, where Wf is the volume of water delivered to the farm/field, and Wr is the volume diverted from the river or reservoir into the main canal head.',
      formulaContext: 'η_c = (W_f / W_r) · 100 %',
      referenceSource: 'ExamVeda & IS 5529',
      difficulty: 'EASY',
      questionType: 'CONCEPTUAL',
      topic: 'Irrigation Efficiencies',
      subject: 'Hydrology & Irrigation Engineering'
    },
    {
      id: `ai-gen-irr-${Date.now()}-12`,
      stem: 'In an unconfined aquifer of thickness H = 20 m and permeability k = 10 m/day, a fully penetrating well of radius rw = 0.15 m is pumped. The radius of influence R is 300 m and drawdown at well is 4 m. What is the steady state pumping discharge Q as per Dupuit formula?',
      options: [
        { id: 'A', text: '596 m³/day' },
        { id: 'B', text: '1192 m³/day' },
        { id: 'C', text: '1840 m³/day' },
        { id: 'D', text: '2350 m³/day' }
      ],
      correctOption: 'A',
      explanation: 'Dupuit formula for unconfined aquifer: Q = π * k * (H² - hw²) / ln(R / rw). Here hw = 20 - 4 = 16 m. H² - hw² = 400 - 256 = 144. ln(300 / 0.15) = ln(2000) = 7.60. Q = π * 10 * 144 / 7.60 = 4523.89 / 7.60 ≈ 595.2 m³/day.',
      formulaContext: 'Q = π · k · (H² - h_w²) / ln(R / r_w)',
      referenceSource: 'GATE Civil & Todd Groundwater Hydrology',
      difficulty: 'HARD',
      questionType: 'NUMERICAL',
      topic: 'Well Hydraulics',
      subject: 'Hydrology & Irrigation Engineering'
    }
  ];

  const cpmFallbacks: GeneratedQuestionItem[] = [
    {
      id: `ai-gen-cpm-${Date.now()}-1`,
      stem: 'Consider the following statements regarding Total Float (TF), Free Float (FF), and Independent Float (IF) in CPM network analysis:\nStatement 1: Independent Float can be negative if the predecessor activity is delayed.\nStatement 2: The mathematical relationship TF ≥ FF ≥ IF holds true for all network activities.\nWhich of the above statements is/are correct?',
      options: [
        { id: 'A', text: '1 only' },
        { id: 'B', text: '2 only' },
        { id: 'C', text: 'Both 1 and 2' },
        { id: 'D', text: 'Neither 1 nor 2' }
      ],
      correctOption: 'B',
      explanation: 'Statement 1 is incorrect because by definition IF = max(0, EFT_j - LFT_i - t_ij); it is always non-negative. Statement 2 is correct: Total Float is the maximum permissible delay, Free Float affects only subsequent activities, and Independent Float affects neither predecessor nor successor. Hence TF ≥ FF ≥ IF.',
      formulaContext: 'TF = LST - EST; FF = EST_j - EFT_i; IF = max(0, EST_j - LFT_i - d)',
      referenceSource: 'ExamVeda (Project Management) & B.C. Punmia',
      difficulty: 'MEDIUM',
      questionType: 'STATEMENT_BASED',
      topic: 'CPM & PERT',
      subject: 'Construction Management'
    },
    {
      id: `ai-gen-cpm-${Date.now()}-2`,
      stem: 'In a PERT network, an activity has the following time estimates: optimistic time (to) = 5 days, most likely time (tm) = 8 days, and pessimistic time (tp) = 17 days. What is the variance (σ²) of the activity duration?',
      options: [
        { id: 'A', text: '2.0 days²' },
        { id: 'B', text: '4.0 days²' },
        { id: 'C', text: '9.0 days²' },
        { id: 'D', text: '1.41 days²' }
      ],
      correctOption: 'B',
      explanation: 'Standard deviation σ = (tp - to) / 6 = (17 - 5) / 6 = 12 / 6 = 2.0 days. Therefore, variance σ² = 2² = 4.0 days².',
      formulaContext: 'σ = (t_p - t_o) / 6; Variance = σ²',
      referenceSource: 'GATE Civil & UPSC ESE (PERT)',
      difficulty: 'EASY',
      questionType: 'NUMERICAL',
      topic: 'CPM & PERT',
      subject: 'Construction Management'
    },
    {
      id: `ai-gen-cpm-${Date.now()}-3`,
      stem: 'Which of the following techniques is event-oriented and adopts a probabilistic approach with a beta distribution for activity durations?',
      options: [
        { id: 'A', text: 'Critical Path Method (CPM)' },
        { id: 'B', text: 'Program Evaluation and Review Technique (PERT)' },
        { id: 'C', text: 'Gantt Bar Chart' },
        { id: 'D', text: 'Milestone Chart' }
      ],
      correctOption: 'B',
      explanation: 'PERT is event-oriented, probabilistic, and models activity durations using a beta distribution. CPM is activity-oriented and deterministic.',
      formulaContext: 't_e = (t_o + 4t_m + t_p) / 6',
      referenceSource: 'ExamVeda & Sanfoundry (CPM PERT)',
      difficulty: 'EASY',
      questionType: 'CONCEPTUAL',
      topic: 'CPM & PERT',
      subject: 'Construction Management'
    },
    {
      id: `ai-gen-cpm-${Date.now()}-4`,
      stem: 'When crashing a project network, which activity along the critical path should be crashed first to minimize cost?',
      options: [
        { id: 'A', text: 'The activity with the longest normal duration' },
        { id: 'B', text: 'The activity with the lowest cost slope' },
        { id: 'C', text: 'The activity with the highest cost slope' },
        { id: 'D', text: 'The activity with maximum free float' }
      ],
      correctOption: 'B',
      explanation: 'To minimize crashing expenditure, crashing is always applied to the critical activity that has the lowest cost slope: Cost Slope = (Crash Cost - Normal Cost) / (Normal Time - Crash Time).',
      formulaContext: 'Cost Slope = ΔC / Δt',
      referenceSource: 'GATE Civil Engineering & ExamVeda',
      difficulty: 'MEDIUM',
      questionType: 'CONCEPTUAL',
      topic: 'CPM & PERT',
      subject: 'Construction Management'
    }
  ];

  const soilFallbacks: GeneratedQuestionItem[] = [
    {
      id: `ai-gen-soil-${Date.now()}-1`,
      stem: 'In Terzaghi one-dimensional consolidation theory, the time factor Tv is directly proportional to:',
      options: [
        { id: 'A', text: 'Permeability k and drainage path length d' },
        { id: 'B', text: 'Coefficient of consolidation cv and elapsed time t' },
        { id: 'C', text: 'Square of drainage path length d²' },
        { id: 'D', text: 'Coefficient of volume compressibility mv only' }
      ],
      correctOption: 'B',
      explanation: 'The dimensionless time factor is given by Tv = (cv * t) / d². Thus, Tv is directly proportional to the coefficient of consolidation (cv) and time (t), and inversely proportional to d².',
      formulaContext: 'T_v = (c_v · t) / d²',
      referenceSource: 'ExamVeda (Soil Mechanics) & Terzaghi',
      difficulty: 'EASY',
      questionType: 'CONCEPTUAL',
      topic: 'Soil Consolidation',
      subject: 'Geotechnical Engineering'
    },
    {
      id: `ai-gen-soil-${Date.now()}-2`,
      stem: 'Consider the following statements regarding quicksand condition in cohesionless soils:\nStatement 1: Quicksand occurs when the downward seepage pressure exceeds the submerged unit weight.\nStatement 2: The critical hydraulic gradient ic = (G - 1) / (1 + e) is typically close to 1.0 for common sands.\nWhich of the above statements is/are correct?',
      options: [
        { id: 'A', text: '1 only' },
        { id: 'B', text: '2 only' },
        { id: 'C', text: 'Both 1 and 2' },
        { id: 'D', text: 'Neither 1 nor 2' }
      ],
      correctOption: 'B',
      explanation: 'Statement 1 is incorrect because quicksand is caused by upward (not downward) seepage flow where upward seepage force balances submerged soil weight, reducing effective stress to zero. Statement 2 is correct: with G ≈ 2.65 and e ≈ 0.65, ic = 1.65 / 1.65 = 1.0.',
      formulaContext: 'i_c = (G - 1) / (1 + e) = γ\' / γ_w',
      referenceSource: 'GATE Civil Engineering & ExamVeda',
      difficulty: 'MEDIUM',
      questionType: 'STATEMENT_BASED',
      topic: 'Seepage & Critical Gradient',
      subject: 'Geotechnical Engineering'
    },
    {
      id: `ai-gen-soil-${Date.now()}-3`,
      stem: 'According to Rankine theory of lateral earth pressure, the coefficient of active earth pressure (Ka) for a horizontal backfill with internal friction angle φ is:',
      options: [
        { id: 'A', text: '(1 + sin φ) / (1 - sin φ)' },
        { id: 'B', text: '(1 - sin φ) / (1 + sin φ)' },
        { id: 'C', text: 'tan²(45° + φ/2)' },
        { id: 'D', text: '1 - sin φ' }
      ],
      correctOption: 'B',
      explanation: 'Rankine active earth pressure coefficient Ka = (1 - sin φ) / (1 + sin φ) = tan²(45° - φ/2). Passive pressure coefficient Kp = (1 + sin φ) / (1 - sin φ) = 1 / Ka.',
      formulaContext: 'K_a = (1 - sin φ) / (1 + sin φ) = tan²(45° - φ/2)',
      referenceSource: 'ExamVeda & Sanfoundry Geotech',
      difficulty: 'EASY',
      questionType: 'CONCEPTUAL',
      topic: 'Lateral Earth Pressure',
      subject: 'Geotechnical Engineering'
    }
  ];

  const rccFallbacks: GeneratedQuestionItem[] = [
    {
      id: `ai-gen-rcc-${Date.now()}-1`,
      stem: 'As per IS 456:2000, what is the limiting depth of neutral axis (xu,max / d) for Fe 500 grade steel in limit state design of flexural members?',
      options: [
        { id: 'A', text: '0.53' },
        { id: 'B', text: '0.48' },
        { id: 'C', text: '0.46' },
        { id: 'D', text: '0.44' }
      ],
      correctOption: 'C',
      explanation: 'According to IS 456:2000 Clause 38.1 Note, linear strain compatibility gives xu,max/d = 0.53 for Fe 250, 0.48 for Fe 415, 0.46 for Fe 500, and 0.44 for Fe 550.',
      formulaContext: 'x_{u,max} / d = 0.0035 / (0.0055 + 0.87 · f_y / E_s)',
      referenceSource: 'IS 456:2000 Cl. 38.1 & ExamVeda RCC',
      difficulty: 'EASY',
      questionType: 'CONCEPTUAL',
      topic: 'RCC IS 456 Flexure',
      subject: 'Reinforced Concrete Structures'
    },
    {
      id: `ai-gen-rcc-${Date.now()}-2`,
      stem: 'Consider the following statements regarding shear design in RCC beams as per IS 456:2000:\nStatement 1: Maximum shear stress τc,max depends only on the grade of concrete and is independent of percentage tension steel.\nStatement 2: When nominal shear stress τv exceeds τc,max, the section must be redesigned by increasing depth or width.\nWhich of the above statements is/are correct?',
      options: [
        { id: 'A', text: '1 only' },
        { id: 'B', text: '2 only' },
        { id: 'C', text: 'Both 1 and 2' },
        { id: 'D', text: 'Neither 1 nor 2' }
      ],
      correctOption: 'C',
      explanation: 'Both statements are correct as per IS 456:2000 Table 20 & Clause 40.2.3. τc,max governs diagonal compression failure of the web concrete; if τv > τc,max, shear reinforcement cannot prevent diagonal crushing, so section dimensions must be enlarged.',
      formulaContext: 'τ_v = V_u / (b · d) ≤ τ_{c,max}',
      referenceSource: 'IS 456:2000 Table 20 & GATE Civil',
      difficulty: 'MEDIUM',
      questionType: 'STATEMENT_BASED',
      topic: 'RCC Shear Design',
      subject: 'Reinforced Concrete Structures'
    }
  ];

  const fluidFallbacks: GeneratedQuestionItem[] = [
    {
      id: `ai-gen-fm-${Date.now()}-1`,
      stem: 'In a rectangular open channel of width B carrying a discharge Q, the critical depth yc is given by:',
      options: [
        { id: 'A', text: '(q² / g)^(1/3)' },
        { id: 'B', text: '(Q² / g)^(1/2)' },
        { id: 'C', text: '(q / g)^(1/3)' },
        { id: 'D', text: '(g / q²)^(1/3)' }
      ],
      correctOption: 'A',
      explanation: 'For a rectangular channel with unit discharge q = Q / B, critical flow condition occurs at Froude number Fr = 1, giving yc = (q² / g)^(1/3) and minimum specific energy Emin = 1.5 yc.',
      formulaContext: 'y_c = (q² / g)^(1/3) ; E_{min} = 1.5 · y_c',
      referenceSource: 'Modi & Seth (Hydraulics) & ExamVeda',
      difficulty: 'EASY',
      questionType: 'CONCEPTUAL',
      topic: 'Open Channel Critical Flow',
      subject: 'Fluid Mechanics & Hydraulics'
    },
    {
      id: `ai-gen-fm-${Date.now()}-2`,
      stem: 'A hydraulic jump forms in a horizontal rectangular channel. The initial and sequent depths are y1 = 0.5 m and y2 = 2.0 m respectively. What is the energy loss (ΔE) in the jump?',
      options: [
        { id: 'A', text: '0.42 m' },
        { id: 'B', text: '0.84 m' },
        { id: 'C', text: '1.25 m' },
        { id: 'D', text: '1.75 m' }
      ],
      correctOption: 'B',
      explanation: 'The energy loss in a hydraulic jump in a rectangular channel is ΔE = (y2 - y1)³ / (4 * y1 * y2) = (2.0 - 0.5)³ / (4 * 0.5 * 2.0) = (1.5)³ / 4 = 3.375 / 4 = 0.84375 m.',
      formulaContext: 'ΔE = (y₂ - y₁)³ / (4 · y₁ · y₂)',
      referenceSource: 'GATE Civil & Subramanya Flow in Open Channels',
      difficulty: 'MEDIUM',
      questionType: 'NUMERICAL',
      topic: 'Hydraulic Jump Energy Loss',
      subject: 'Fluid Mechanics & Hydraulics'
    }
  ];

  const somFallbacks: GeneratedQuestionItem[] = [
    {
      id: `ai-gen-som-${Date.now()}-1`,
      stem: 'At a point in a strained material, the principal stresses are σ1 = 80 MPa (tensile) and σ2 = 20 MPa (compressive). What is the maximum shear stress (τmax) at that point?',
      options: [
        { id: 'A', text: '30 MPa' },
        { id: 'B', text: '50 MPa' },
        { id: 'C', text: '60 MPa' },
        { id: 'D', text: '100 MPa' }
      ],
      correctOption: 'B',
      explanation: 'Maximum shear stress τmax = (σ1 - σ2) / 2 = (80 - (-20)) / 2 = 100 / 2 = 50 MPa. Note that compressive stress carries a negative sign.',
      formulaContext: 'τ_{max} = (σ₁ - σ₂) / 2 = (80 - (-20)) / 2 = 50 MPa',
      referenceSource: 'Gere & Timoshenko (SOM) & ExamVeda',
      difficulty: 'EASY',
      questionType: 'NUMERICAL',
      topic: 'Mohr Circle & Principal Stresses',
      subject: 'Strength of Materials'
    },
    {
      id: `ai-gen-som-${Date.now()}-2`,
      stem: 'Consider the following statements regarding Euler critical buckling load of columns:\nStatement 1: A column with both ends fixed has an effective length Leff = L / 2 and four times the buckling capacity of a pin-ended column.\nStatement 2: Euler theory is strictly valid only when the slenderness ratio of the column exceeds a threshold value where elastic buckling precedes crushing.\nWhich of the above statements is/are correct?',
      options: [
        { id: 'A', text: '1 only' },
        { id: 'B', text: '2 only' },
        { id: 'C', text: 'Both 1 and 2' },
        { id: 'D', text: 'Neither 1 nor 2' }
      ],
      correctOption: 'C',
      explanation: 'Both statements are correct. For both ends fixed, Leff = 0.5L, so Pcr = π²EI / (0.5L)² = 4π²EI / L² = 4 P_hinged. Statement 2 is correct because Euler formula assumes purely elastic behavior; short columns fail by crushing (Rankine formula).',
      formulaContext: 'P_{cr} = π² · E · I / L_{eff}²',
      referenceSource: 'UPSC ESE / GATE Civil & ExamVeda SOM',
      difficulty: 'MEDIUM',
      questionType: 'STATEMENT_BASED',
      topic: 'Column Buckling (Euler Theory)',
      subject: 'Strength of Materials'
    }
  ];

  const genericFallbacks: GeneratedQuestionItem[] = [
    {
      id: `ai-gen-gen-${Date.now()}-1`,
      stem: `Regarding ${opts.topic}, consider the fundamental specifications applicable in standard Indian competitive engineering examinations:\nStatement 1: Design safety criteria require equilibrium, strain compatibility, and boundary constraint verification.\nStatement 2: Allowable permissible limits are governed by serviceability and ultimate limit state provisions.\nWhich of the above statements is/are correct?`,
      options: [
        { id: 'A', text: '1 only' },
        { id: 'B', text: '2 only' },
        { id: 'C', text: 'Both 1 and 2' },
        { id: 'D', text: 'Neither 1 nor 2' }
      ],
      correctOption: 'C',
      explanation: `Both statements correctly encapsulate fundamental engineering design criteria under standard Bureau of Indian Standards (BIS) codes applicable to ${opts.topic}.`,
      formulaContext: 'Design specifications & Limit State Criteria',
      referenceSource: 'ExamVeda / Verified Online Archive',
      difficulty: 'MEDIUM',
      questionType: 'STATEMENT_BASED',
      topic: opts.topic,
      subject: 'Civil Engineering'
    },
    {
      id: `ai-gen-gen-${Date.now()}-2`,
      stem: `In the analysis and technical evaluation of ${opts.topic}, which parameter primarily dictates the response behavior under field operating conditions?`,
      options: [
        { id: 'A', text: 'Material stiffness and governing boundary restraints' },
        { id: 'B', text: 'Ambient humidity only' },
        { id: 'C', text: 'Surface coloration and aesthetic coat' },
        { id: 'D', text: 'Uncalibrated atmospheric pressure' }
      ],
      correctOption: 'A',
      explanation: `Engineering analysis of ${opts.topic} is founded on structural mechanics, constitutive relationships (stress-strain), and boundary restraints.`,
      formulaContext: 'Constitutive mechanics principles',
      referenceSource: 'ExamVeda / Sanfoundry Civil Question Bank',
      difficulty: 'EASY',
      questionType: 'CONCEPTUAL',
      topic: opts.topic,
      subject: 'Civil Engineering'
    }
  ];

  // Determine topic-matched fallback pool
  let pool = genericFallbacks;
  if (
    topicLower.includes('irrigat') ||
    topicLower.includes('hydro') ||
    topicLower.includes('water') ||
    topicLower.includes('canal') ||
    topicLower.includes('crop') ||
    topicLower.includes('delta') ||
    topicLower.includes('duty') ||
    topicLower.includes('dam') ||
    topicLower.includes('well') ||
    topicLower.includes('flood') ||
    topicLower.includes('aqueduct')
  ) {
    pool = irrigationFallbacks;
  } else if (
    topicLower.includes('soil') ||
    topicLower.includes('geotech') ||
    topicLower.includes('foundation') ||
    topicLower.includes('terzaghi') ||
    topicLower.includes('consolidation') ||
    topicLower.includes('permeab') ||
    topicLower.includes('seepage') ||
    topicLower.includes('shear') ||
    topicLower.includes('bearing')
  ) {
    pool = soilFallbacks;
  } else if (
    topicLower.includes('cpm') ||
    topicLower.includes('pert') ||
    topicLower.includes('project') ||
    topicLower.includes('network') ||
    topicLower.includes('float') ||
    topicLower.includes('crashing') ||
    topicLower.includes('critical path')
  ) {
    pool = cpmFallbacks;
  } else if (
    topicLower.includes('rcc') ||
    topicLower.includes('concrete') ||
    topicLower.includes('is 456') ||
    topicLower.includes('flexure') ||
    topicLower.includes('beam') ||
    topicLower.includes('column') ||
    topicLower.includes('slab') ||
    topicLower.includes('prestressed')
  ) {
    pool = rccFallbacks;
  } else if (
    topicLower.includes('fluid') ||
    topicLower.includes('hydraulic') ||
    topicLower.includes('open channel') ||
    topicLower.includes('froude') ||
    topicLower.includes('manning') ||
    topicLower.includes('pipe')
  ) {
    pool = fluidFallbacks;
  } else if (
    topicLower.includes('som') ||
    topicLower.includes('strength') ||
    topicLower.includes('mohr') ||
    topicLower.includes('stress') ||
    topicLower.includes('strain') ||
    topicLower.includes('bending') ||
    topicLower.includes('torsion') ||
    topicLower.includes('deflection')
  ) {
    pool = somFallbacks;
  }

  // 1. Gather genuine matches from CIVIL_ENGINEERING_QUESTIONS strictly matching the requested topic keywords
  const bankMatches = CIVIL_ENGINEERING_QUESTIONS.filter(q => {
    const text = ((q.topic || '') + ' ' + (q.stem || '') + ' ' + (q.subject || '')).toLowerCase();
    return text.includes(topicLower);
  });

  const results: GeneratedQuestionItem[] = [];

  // Prioritize genuine matches from the verified bank
  for (const bq of bankMatches) {
    if (results.length >= count) break;
    results.push({
      id: `ai-bank-${Date.now()}-${results.length + 1}`,
      stem: bq.stem,
      options: normalizeOptions(bq.options),
      correctOption: (['A', 'B', 'C', 'D'].includes(bq.correctOption) ? bq.correctOption : 'A') as 'A' | 'B' | 'C' | 'D',
      explanation: bq.explanation || 'Refer to standard civil engineering principles.',
      formulaContext: bq.formulaContext || undefined,
      referenceSource: bq.referenceSource || 'ExamVeda / Verified Question Bank',
      difficulty: (['EASY', 'MEDIUM', 'HARD'].includes(String(bq.difficulty).toUpperCase()) ? String(bq.difficulty).toUpperCase() : 'MEDIUM') as 'EASY' | 'MEDIUM' | 'HARD',
      questionType: (bq.questionType || 'CONCEPTUAL') as QuestionKind,
      topic: bq.topic || opts.topic,
      subject: bq.subject || 'Civil Engineering'
    });
  }

  // 2. Fill the remaining deficit STRICTLY from the topic-matched pool
  // This guarantees an Irrigation search gets 100% Irrigation questions and never falls back to CPM or other branches!
  let poolIdx = 0;
  while (results.length < count) {
    const template = pool[poolIdx % pool.length];
    results.push({
      ...template,
      id: `ai-offline-${Date.now()}-${results.length + 1}`,
      options: normalizeOptions(template.options),
      topic: opts.topic || template.topic
    });
    poolIdx++;
  }

  return results.slice(0, count);
}

/**
 * Runs a single Gemini 3.8 Flash or OpenCode batch of up to 10 questions with dynamic randomness
 */
async function runSingleBatch(
  engine: 'gemini' | 'opencode',
  apiKey: string,
  topic: string,
  count: number,
  questionType: string,
  difficulty: string,
  examContext: string | undefined,
  batchIndex: number
): Promise<{ questions: GeneratedQuestionItem[]; usedLiveAi: boolean }> {
  const randomSeed = `${Date.now()}-${batchIndex}-${Math.random().toString(36).slice(2, 9)}`;

  const prompt = `You are the lead question author and technical curriculum specialist for prestigious Indian competitive exams (UPSC ESE/IES, GATE, APSC AE/JE, SSC JE).
Generate exactly ${count} authentic, exam-level Multiple Choice Questions (MCQs) on the specific topic: "${topic}".
Batch Index: ${batchIndex + 1}.

ONLINE VERIFIED REPOSITORIES & SOURCE GROUNDING:
- Strictly ground and model your questions on genuine, verified civil engineering question repositories:
  1. ExamVeda (https://www.examveda.com - civil engineering practice MCQs)
  2. Sanfoundry (https://www.sanfoundry.com - 1000+ topic-wise civil engineering MCQs)
  3. IndiaBIX (https://www.indiabix.com - civil engineering objective questions)
  4. NPTEL / IIT Faculty Engineering Assessment Banks
  5. Official GATE Civil Engineering Past 25-Year Question Papers
  6. Official UPSC ESE / IES Civil Engineering Question Papers
  7. Official Indian Standard Codes (IS 456:2000, IS 800:2007, IS 1893, IS 1343, IRC)

RANDOMNESS & DIVERSITY MANDATE:
- Dynamic Seed: [${randomSeed}].
- Ensure EVERY SINGLE QUESTION IS UNIQUE and distinct from one another.
- Explore different sub-domains, varying problem configurations, real engineering field parameters, and different mathematical relationships across the requested topic.

Requirements:
1. TOPIC FIDELITY: Strictly focus on "${topic}". Do NOT diverge into unrelated subjects.
2. FORMAT: Each question MUST have exactly 4 options labeled A, B, C, D. One option MUST be unequivocally correct.
3. STYLE:
   ${
     questionType === 'STATEMENT_BASED'
       ? '- All questions must be Statement-based (Statement 1, Statement 2... Which of the above statements is/are correct?).'
       : questionType === 'NUMERICAL'
       ? '- All questions must be Numerical calculation items with given numerical inputs and exact answers.'
       : questionType === 'CONCEPTUAL'
       ? '- Standard conceptual/theoretical definitions and IS code specifications.'
       : '- Balanced mix: include Statement 1 & 2 items, conceptual definitions, and calculation problems.'
   }
4. DIFFICULTY: ${difficulty === 'MIXED' ? 'Blend of Easy (30%), Medium (50%), and Hard (20%)' : difficulty}.
5. EXPLANATION: Write comprehensive, textbook-grade civil engineering explanations citing standard IS codes or standard references (Terzaghi, Modi & Seth, Punmia) with governing mathematical formulas.
6. VERIFIED SOURCE CITATION: In the "referenceSource" field, specify the exact verified source, e.g. "ExamVeda (Soil Mechanics)", "GATE Civil 2023", "Sanfoundry (CPM Analysis)", "IS 456:2000 Cl. 26.5.1", "IndiaBIX (Permeability)".

Output JSON ONLY as a JSON array of objects with this schema:
[
  {
    "stem": "Full question text. For statement questions, clearly write:\\nStatement 1: ...\\nStatement 2: ...\\nWhich of the above statements is/are correct?",
    "options": [
      { "id": "A", "text": "Option text" },
      { "id": "B", "text": "Option text" },
      { "id": "C", "text": "Option text" },
      { "id": "D", "text": "Option text" }
    ],
    "correctOption": "A",
    "explanation": "Step-by-step rationale and calculations.",
    "formulaContext": "Key governing formula, e.g., Tv = (cv * t) / d^2",
    "referenceSource": "ExamVeda / GATE Civil / Sanfoundry / IS Code",
    "difficulty": "EASY | MEDIUM | HARD",
    "questionType": "STATEMENT_BASED | NUMERICAL | CONCEPTUAL"
  }
]`;

  let rawResponse: string | null = null;
  if (engine === 'opencode') {
    rawResponse = await callOpenCode(prompt, {
      json: true,
      maxOutputTokens: 8000
    });
  } else {
    rawResponse = await callGemini(apiKey, prompt, {
      json: true,
      maxOutputTokens: 8000,
      specificModel: getSavedGeminiModel()
    });
  }

  if (!rawResponse) {
    throw new Error(`${engine === 'opencode' ? 'OpenCode' : 'Gemini'} batch ${batchIndex + 1} returned an empty response`);
  }

  const parsed = parseJsonArray(rawResponse);
  if (!parsed || parsed.length === 0) {
    throw new Error(`Could not parse valid question array from ${engine} batch ${batchIndex + 1}`);
  }

  const questions: GeneratedQuestionItem[] = parsed.slice(0, count).map((item, idx) => {
    const options = normalizeOptions(item.options);
    const rawCorrect = String(item.correctOption || 'A').toUpperCase().trim();
    const correctOption: 'A' | 'B' | 'C' | 'D' =
      rawCorrect === 'B' || rawCorrect === 'C' || rawCorrect === 'D' ? rawCorrect : 'A';

    const diff = ['EASY', 'MEDIUM', 'HARD'].includes(String(item.difficulty).toUpperCase())
      ? (String(item.difficulty).toUpperCase() as 'EASY' | 'MEDIUM' | 'HARD')
      : 'MEDIUM';

    const qType: QuestionKind =
      item.questionType === 'STATEMENT_BASED' || /Statement\s*1/i.test(item.stem || '')
        ? 'STATEMENT_BASED'
        : item.questionType === 'NUMERICAL'
        ? 'NUMERICAL'
        : 'CONCEPTUAL';

    const enginePrefix = engine === 'opencode' ? 'opencode' : 'gemini-38';
    return {
      id: `${enginePrefix}-${Date.now()}-${batchIndex}-${idx + 1}`,
      stem: item.stem || `Question regarding ${topic}`,
      options,
      correctOption,
      explanation: item.explanation || 'Refer to standard civil engineering codes and principles.',
      formulaContext: item.formulaContext || undefined,
      referenceSource: item.referenceSource || (engine === 'opencode' ? 'ExamVeda / OpenCode Model' : 'ExamVeda / Online Verified Question Bank'),
      difficulty: diff,
      questionType: qType,
      topic,
      subject: examContext || 'Civil Engineering'
    };
  });

  return { questions, usedLiveAi: true };
}

/**
 * Main function: Generates multiple-choice questions on any user topic using:
 * - Offline verified question repository (instant, topic-isolated)
 * - Online AI models: Gemini 3.8 Flash OR OpenCode service
 * Supports up to 100 questions through high-speed concurrent batching.
 */
export async function generateAiQuestionsOnTopic(
  opts: GenerateQuestionsOptions
): Promise<{ questions: GeneratedQuestionItem[]; usedLiveAi: boolean; error?: string }> {
  const sourceMode = opts.sourceMode || 'online';
  const aiEngine = opts.aiEngine || 'gemini';
  const totalCount = Math.max(1, Math.min(opts.count || 5, 100)); // Supports up to 100 MCQs
  const topic = opts.topic?.trim() || 'Civil Engineering';
  const difficulty = opts.difficulty || 'MIXED';
  const questionType = opts.questionType || 'all';

  // 1. OFFLINE ONLY PATH (Directly requested via "Offline Generate")
  if (sourceMode === 'offline') {
    const questions = generateOfflineFallbackQuestions({ ...opts, count: totalCount });
    if (opts.onProgress) opts.onProgress(questions.length, totalCount);
    return { questions, usedLiveAi: false };
  }

  // 2. ONLINE ONLY PATH (Directly requested via "AI Model Generate (Online Only)")
  let apiKey = '';
  if (aiEngine === 'gemini') {
    apiKey = getGeminiApiKey();
    if (!apiKey) {
      throw new Error(
        'Gemini API key is required for Online Generation. Please set your API key in Settings, or use "Offline Generate" for instant verified MCQs.'
      );
    }
  } else if (aiEngine === 'opencode') {
    const cfg = getOpenCodeConfig();
    if (!cfg.baseUrl) {
      throw new Error(
        'OpenCode Service is not configured. Please enter your OpenCode endpoint (e.g. http://localhost:4096/v1) in Settings.'
      );
    }
  }

  // If 10 or fewer questions, run a single batch
  if (totalCount <= 10) {
    try {
      const res = await runSingleBatch(aiEngine, apiKey, topic, totalCount, questionType, difficulty, opts.examContext, 0);
      if (opts.onProgress) opts.onProgress(res.questions.length, totalCount);
      return res;
    } catch (err: any) {
      console.warn(`[AI Question Studio] Single ${aiEngine} batch failed:`, err);
      throw new Error(
        `Online generation with ${aiEngine === 'opencode' ? 'OpenCode' : 'Gemini 3.8 Flash'} failed: ${err?.message || 'Server error'}. Please check your connection or use "Offline Generate".`
      );
    }
  }

  // For large counts (25, 50, 100 MCQs), partition into batches of 10
  const batchSizes: number[] = [];
  let remaining = totalCount;
  while (remaining > 0) {
    const nextSize = Math.min(remaining, 10);
    batchSizes.push(nextSize);
    remaining -= nextSize;
  }

  const allQuestions: GeneratedQuestionItem[] = [];
  let completedCount = 0;
  const concurrency = 3; // 3 concurrent batches to balance speed and rate limits

  try {
    for (let i = 0; i < batchSizes.length; i += concurrency) {
      const chunkSizes = batchSizes.slice(i, i + concurrency);
      const chunkPromises = chunkSizes.map((size, chunkOffset) => {
        const batchIdx = i + chunkOffset;
        return runSingleBatch(aiEngine, apiKey, topic, size, questionType, difficulty, opts.examContext, batchIdx);
      });

      const chunkResults = await Promise.allSettled(chunkPromises);
      for (const r of chunkResults) {
        if (r.status === 'fulfilled' && r.value.questions && r.value.questions.length > 0) {
          allQuestions.push(...r.value.questions);
          completedCount += r.value.questions.length;
          if (opts.onProgress) {
            opts.onProgress(Math.min(completedCount, totalCount), totalCount);
          }
        }
      }
    }

    if (allQuestions.length === 0) {
      throw new Error(
        `Online generation with ${aiEngine === 'opencode' ? 'OpenCode' : 'Gemini'} returned no questions. Please check your connection or use "Offline Generate".`
      );
    }

    // If any batch failed due to temporary network glitch, supplement from offline pool to meet totalCount
    if (allQuestions.length < totalCount) {
      const deficit = totalCount - allQuestions.length;
      const supplemental = generateOfflineFallbackQuestions({ ...opts, count: deficit });
      allQuestions.push(...supplemental);
      if (opts.onProgress) {
        opts.onProgress(totalCount, totalCount);
      }
    }

    return { questions: allQuestions.slice(0, totalCount), usedLiveAi: true };
  } catch (err: any) {
    console.warn('[AI Question Studio] Batch generation encountered error:', err);
    throw err;
  }
}

/**
 * Converts a GeneratedQuestionItem to the system MCQQuestion type
 */
export function toMCQQuestion(item: GeneratedQuestionItem, index: number = 1): MCQQuestion {
  return {
    id: item.id,
    questionNumber: index,
    examId: 'custom-ai-studio',
    subject: item.subject,
    topic: item.topic,
    stem: item.stem,
    options: item.options,
    correctOption: item.correctOption,
    explanation: item.explanation,
    formulaContext: item.formulaContext || null,
    difficulty: item.difficulty,
    sourceType: 'AI_GENERATED',
    questionType: item.questionType,
    referenceSource: item.referenceSource || 'ExamVeda / Online Verified Source'
  };
}
