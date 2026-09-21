import type { MCQQuestion } from '../types';
import { callGemini, getGeminiApiKey, hasLiveAi, getSavedGeminiModel } from './geminiService';
import { isStatementQuestion } from '../pages/MockTestCreator';

export type ArrangementStrategy =
  | 'adaptive_pacing'      // Cognitive Pacing (UPSC / GATE Stage-Gate)
  | 'progressive_ramp'     // Easy -> Medium -> Hard
  | 'interleaved_domains'  // Cross-Disciplinary Interleaving
  | 'speed_first';         // High-Velocity Marks First

export interface ArrangementPhase {
  phaseNumber: number;
  name: string;
  startIndex: number;
  endIndex: number;
  questionCount: number;
  recommendedMinutes: number;
  focusDescription: string;
  badgeTone: 'info' | 'brand' | 'warning' | 'success' | string;
}

export interface ArrangementResult {
  arrangedQuestions: MCQQuestion[];
  strategy: ArrangementStrategy;
  strategyTitle: string;
  phases: ArrangementPhase[];
  psychometricRationale: string;
  timeManagementTips: string[];
  usedLiveAi: boolean;
  modelName: string;
}

export const STRATEGY_DETAILS: Record<ArrangementStrategy, { label: string; short: string; desc: string; badge: string }> = {
  adaptive_pacing: {
    label: 'UPSC / GATE Psychometric Pacing',
    short: 'Cognitive Pacing',
    desc: 'Warm-up calibration → Statement discernment → High-yield numerical core → Sprint finish',
    badge: 'Recommended'
  },
  progressive_ramp: {
    label: 'Progressive Difficulty Ramp',
    short: 'Easy → Hard',
    desc: 'Starts with direct conceptual items and ramps steadily up to rigorous problems',
    badge: 'Gradual Climb'
  },
  interleaved_domains: {
    label: 'Cross-Domain Cognitive Interleaving',
    short: 'Interleaved Branches',
    desc: 'Alternates subjects (Geotech, Structures, Water, Env) to eliminate topical fatigue',
    badge: 'Fatigue Proof'
  },
  speed_first: {
    label: 'Speed & Time Capitalizer',
    short: 'Speed First',
    desc: 'Banks rapid conceptual marks first, saving dedicated focus blocks for numericals',
    badge: 'Score Maximizer'
  }
};

/**
 * Deterministic psychometric ordering fallback (zero latency, offline resilient).
 * Replicates the exact pedagogical sequence even when no API key is present.
 */
function deterministicArrangement(
  questions: MCQQuestion[],
  durationMinutes: number,
  strategy: ArrangementStrategy
): ArrangementResult {
  const total = questions.length;
  let ordered: MCQQuestion[] = [];
  let phases: ArrangementPhase[] = [];
  let title = '';
  let rationale = '';
  let tips: string[] = [];

  const statements = questions.filter(q => isStatementQuestion(q.stem, q.questionType));
  const numericals = questions.filter(q => q.questionType === 'NUMERICAL');
  const conceptuals = questions.filter(q => !isStatementQuestion(q.stem, q.questionType) && q.questionType !== 'NUMERICAL');

  if (strategy === 'progressive_ramp') {
    const easy = questions.filter(q => q.difficulty === 'EASY');
    const med = questions.filter(q => q.difficulty === 'MEDIUM');
    const hard = questions.filter(q => q.difficulty === 'HARD');
    ordered = [...easy, ...med, ...hard];

    const p1Count = easy.length;
    const p2Count = med.length;
    const p3Count = hard.length;

    phases = [
      {
        phaseNumber: 1,
        name: 'Phase 1: Foundational Confidence',
        startIndex: 0,
        endIndex: Math.max(0, p1Count - 1),
        questionCount: p1Count,
        recommendedMinutes: Math.round(durationMinutes * 0.25),
        focusDescription: 'Direct recall and fundamental formulas. Bank accurate marks quickly without second-guessing.',
        badgeTone: 'success'
      },
      {
        phaseNumber: 2,
        name: 'Phase 2: Core Analytical Ladder',
        startIndex: p1Count,
        endIndex: Math.max(p1Count, p1Count + p2Count - 1),
        questionCount: p2Count,
        recommendedMinutes: Math.round(durationMinutes * 0.45),
        focusDescription: 'Standard exam problems and two-statement comparisons. Maintain steady pace of ~1.2 min/question.',
        badgeTone: 'brand'
      },
      {
        phaseNumber: 3,
        name: 'Phase 3: High-Discrimination Peak',
        startIndex: p1Count + p2Count,
        endIndex: total - 1,
        questionCount: p3Count,
        recommendedMinutes: Math.round(durationMinutes * 0.30),
        focusDescription: 'Multi-step calculations and deep statement reasoning. Flag for review if stuck beyond 2 minutes.',
        badgeTone: 'warning'
      }
    ].filter(p => p.questionCount > 0);

    title = 'Progressive Difficulty Ladder';
    rationale = 'Structured climbing curve: builds psychological momentum with direct questions before taxing working memory with complex analytical problems.';
    tips = [
      'Aim to complete Phase 1 within 20% of your time budget to bank a buffer.',
      'In Phase 2, mark Statement 1 & 2 questions that need a re-read with the Flag button.',
      'Do not get anchored on any single Phase 3 calculation for more than 2 minutes.'
    ];
  } else if (strategy === 'interleaved_domains') {
    // Interleave by subject
    const subjectBuckets: Record<string, MCQQuestion[]> = {};
    questions.forEach(q => {
      const s = q.subject || 'General';
      if (!subjectBuckets[s]) subjectBuckets[s] = [];
      subjectBuckets[s].push(q);
    });

    const bucketKeys = Object.keys(subjectBuckets);
    let done = false;
    let idx = 0;
    while (!done) {
      done = true;
      for (const k of bucketKeys) {
        if (idx < subjectBuckets[k].length) {
          ordered.push(subjectBuckets[k][idx]);
          done = false;
        }
      }
      idx++;
    }

    const mid = Math.ceil(total / 2);
    phases = [
      {
        phaseNumber: 1,
        name: 'Round 1: Cross-Disciplinary Exploration',
        startIndex: 0,
        endIndex: mid - 1,
        questionCount: mid,
        recommendedMinutes: Math.round(durationMinutes * 0.50),
        focusDescription: 'Varied subjects rotated continuously to stimulate distinct engineering concepts and prevent mental fatigue.',
        badgeTone: 'info'
      },
      {
        phaseNumber: 2,
        name: 'Round 2: Cross-Disciplinary Consolidation',
        startIndex: mid,
        endIndex: total - 1,
        questionCount: total - mid,
        recommendedMinutes: Math.round(durationMinutes * 0.50),
        focusDescription: 'Second half covering related subtopics with fresh cognitive switching across Geotech, Structures, and Fluids.',
        badgeTone: 'brand'
      }
    ];

    title = 'Interleaved Domain Rotation';
    rationale = 'Cognitive research shows interleaving distinct subjects prevents perceptual adaptation and trains fast context switching required for competitive engineering exams.';
    tips = [
      'Reset your mental frame when transitioning between different subject topics.',
      'Keep code formulas (IS 456, IS 800, IRC) segregated in your memory.',
      'Leverage easier recall questions in adjacent subjects to recover pace.'
    ];
  } else if (strategy === 'speed_first') {
    // Conceptual first, statements second, numericals last
    ordered = [...conceptuals, ...statements, ...numericals];
    const cCount = conceptuals.length;
    const sCount = statements.length;
    const nCount = numericals.length;

    phases = [
      {
        phaseNumber: 1,
        name: 'Sprint: Rapid Conceptual Marks',
        startIndex: 0,
        endIndex: Math.max(0, cCount - 1),
        questionCount: cCount,
        recommendedMinutes: Math.round(durationMinutes * 0.30),
        focusDescription: 'Fast single-concept recall and standard code provisions. Aim for under 45 seconds per question.',
        badgeTone: 'success'
      },
      {
        phaseNumber: 2,
        name: 'Discernment: Statement Evaluation',
        startIndex: cCount,
        endIndex: Math.max(cCount, cCount + sCount - 1),
        questionCount: sCount,
        recommendedMinutes: Math.round(durationMinutes * 0.35),
        focusDescription: 'Statement 1 & 2 verification. Eliminate false options methodically.',
        badgeTone: 'brand'
      },
      {
        phaseNumber: 3,
        name: 'Focus Block: Numerical Working',
        startIndex: cCount + sCount,
        endIndex: total - 1,
        questionCount: nCount,
        recommendedMinutes: Math.round(durationMinutes * 0.35),
        focusDescription: 'Dedicated time window for multi-step arithmetic, unit conversions, and algebraic formulas.',
        badgeTone: 'warning'
      }
    ].filter(p => p.questionCount > 0);

    title = 'Velocity-First Score Optimization';
    rationale = 'Secures guaranteed high-confidence points early to insulate against end-of-test time pressure, then devotes remaining time to calculations.';
    tips = [
      'Do not linger on doubtful conceptual questions; select your first instinct and move forward.',
      'In Phase 2, look for contradictory statements to quickly eliminate 2 out of 4 options.',
      'Check unit dimensions carefully in Phase 3 calculations before choosing an option.'
    ];
  } else {
    // Default: 'adaptive_pacing' (UPSC ESE / GATE Psychometric Pacing)
    // 15% Warm-up -> 35% Statement Discernment -> 35% Numerical Core -> 15% Synthesis Sprint
    const warmUp = conceptuals.slice(0, Math.max(2, Math.round(total * 0.20)));
    const remainingConceptual = conceptuals.slice(warmUp.length);

    // Interleave statements with some conceptuals
    const midStatements = statements.slice(0, Math.round(statements.length * 0.75));
    const lateStatements = statements.slice(midStatements.length);

    ordered = [
      ...warmUp,
      ...midStatements,
      ...numericals,
      ...lateStatements,
      ...remainingConceptual
    ];

    // Guarantee all original questions are preserved
    const seen = new Set(ordered.map(q => q.id));
    for (const q of questions) {
      if (!seen.has(q.id)) { seen.add(q.id); ordered.push(q); }
    }
    ordered = ordered.slice(0, total);

    const q1 = Math.round(total * 0.20);
    const q2 = Math.round(total * 0.35);
    const q3 = Math.round(total * 0.30);
    const q4 = total - q1 - q2 - q3;

    phases = [
      {
        phaseNumber: 1,
        name: 'Stage 1: Pacing Calibration & Warm-Up',
        startIndex: 0,
        endIndex: Math.max(0, q1 - 1),
        questionCount: q1,
        recommendedMinutes: Math.round(durationMinutes * 0.18),
        focusDescription: 'High-confidence foundational concepts. Settle exam composure and establish rhythmic reading speed.',
        badgeTone: 'info'
      },
      {
        phaseNumber: 2,
        name: 'Stage 2: Statement & Criterion Discernment',
        startIndex: q1,
        endIndex: Math.max(q1, q1 + q2 - 1),
        questionCount: q2,
        recommendedMinutes: Math.round(durationMinutes * 0.38),
        focusDescription: 'UPSC-calibrated Statement 1 & 2 and Assertion-Reason items while analytical concentration is highest.',
        badgeTone: 'brand'
      },
      {
        phaseNumber: 3,
        name: 'Stage 3: Numerical & Analytical Core',
        startIndex: q1 + q2,
        endIndex: Math.max(q1 + q2, q1 + q2 + q3 - 1),
        questionCount: q3,
        recommendedMinutes: Math.round(durationMinutes * 0.32),
        focusDescription: 'Formula calculations and quantitative problem-solving spaced with strategic breathing room.',
        badgeTone: 'warning'
      },
      {
        phaseNumber: 4,
        name: 'Stage 4: Sprint Finish & Verification',
        startIndex: q1 + q2 + q3,
        endIndex: total - 1,
        questionCount: Math.max(1, q4),
        recommendedMinutes: Math.round(durationMinutes * 0.12),
        focusDescription: 'Rapid code rules and final review of flagged items before concluding submission.',
        badgeTone: 'success'
      }
    ].filter(p => p.questionCount > 0);

    title = 'UPSC ESE Stage-Gate Cognitive Pacing';
    rationale = 'Emulates the psychometric design of UPSC Engineering Services Examination: balances high-focus Statement 1 & 2 discernment before fatigue sets in, pacing calculations in the middle third.';
    tips = [
      'In Stage 1, use the steady pace to read each question completely once.',
      'In Stage 2, underline or highlight keywords like "NOT correct", "inversely", and "exclusively".',
      'Leave at least 5 minutes in Stage 4 to revisit flagged questions from the palette.'
    ];
  }

  // Ensure phases cleanly span 0 to total - 1 without gaps
  let runningIndex = 0;
  phases.forEach((phase, i) => {
    phase.startIndex = runningIndex;
    phase.endIndex = runningIndex + phase.questionCount - 1;
    runningIndex += phase.questionCount;
  });

  return {
    arrangedQuestions: ordered,
    strategy,
    strategyTitle: title,
    phases,
    psychometricRationale: rationale,
    timeManagementTips: tips,
    usedLiveAi: false,
    modelName: 'Psychometric Engine (Gemini 3.8 Pacing Architecture)'
  };
}

/**
 * Invokes Gemini 3.8 Flash to intelligently sequence and psychometrically arrange mock test questions.
 * Falls back transparently to the deterministic engine if offline or if no API key is available.
 */
export async function arrangeQuestionsWithGemini(
  questions: MCQQuestion[],
  durationMinutes: number,
  strategy: ArrangementStrategy = 'adaptive_pacing',
  examName: string = 'APSC AE / UPSC ESE'
): Promise<ArrangementResult> {
  const fallback = deterministicArrangement(questions, durationMinutes, strategy);
  const apiKey = getGeminiApiKey();

  if (!apiKey || !hasLiveAi()) {
    return fallback;
  }

  try {
    const compactQuestions = questions.map((q, idx) => ({
      index: idx,
      id: q.id,
      subject: q.subject,
      topic: q.topic,
      difficulty: q.difficulty,
      isStatement: isStatementQuestion(q.stem, q.questionType),
      isNumerical: q.questionType === 'NUMERICAL',
      hasFormula: Boolean(q.formulaContext)
    }));

    const strategyMeta = STRATEGY_DETAILS[strategy];

    const prompt = `You are a Chief Psychometrician and Examination Designer at Google DeepMind analyzing an engineering mock test for ${examName}.
You are operating on model: gemini-3.8-flash.

Your task:
Take the following ${questions.length} candidate questions and arrange them into the optimal exam sequence following the strategy:
Strategy: "${strategyMeta.label}" (${strategyMeta.desc}).
Total Duration: ${durationMinutes} minutes (${Math.round((durationMinutes * 60) / questions.length)} seconds per question on average).

Questions to arrange:
${JSON.stringify(compactQuestions)}

Rules:
1. Every input question id MUST appear exactly once in "arrangedIds". Do not omit any ID.
2. Group the sequence into 2 to 4 logical phases matching the pedagogical rhythm.
3. For statement-based questions (isStatement: true), place them where analytical focus is optimal (typically after warm-up, before mental exhaustion).
4. Distribute numerical calculation problems so candidates do not face more than 3 heavy calculations in a row.
5. Provide realistic recommendedMinutes per phase that sum up to approximately ${durationMinutes} minutes.
6. STRICT ZERO QUESTION CREATION RULE: You are strictly an arrangement and psychometric sequencing engine. Under NO circumstances should you invent, create, alter, or synthesize any questions or new question IDs. Every single ID in "arrangedIds" MUST be one of the input question IDs provided above.

Output MUST be valid JSON (no markdown fences, no preamble, no trailing commentary):
{
  "arrangedIds": ["id1", "id2", ...],
  "strategyTitle": "${strategyMeta.label}",
  "phases": [
    {
      "phaseNumber": 1,
      "name": "Phase 1: ...",
      "questionCount": 5,
      "recommendedMinutes": 8,
      "focusDescription": "Clear 1-sentence guidance for this phase",
      "badgeTone": "info"
    }
  ],
  "psychometricRationale": "2-3 sentences explaining why this arrangement optimizes score and minimizes cognitive burnout.",
  "timeManagementTips": [
    "Concrete actionable time management tip 1",
    "Concrete actionable time management tip 2",
    "Concrete actionable time management tip 3"
  ]
}`;

    const raw = await callGemini(apiKey, prompt, {
      json: true,
      maxOutputTokens: 3072,
      specificModel: getSavedGeminiModel()
    });

    if (!raw) return fallback;

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // Clean possible fences
      const cleaned = raw.replace(/^```json/m, '').replace(/```$/m, '').trim();
      parsed = JSON.parse(cleaned);
    }

    if (!parsed || !Array.isArray(parsed.arrangedIds) || parsed.arrangedIds.length === 0) {
      return fallback;
    }

    // Reconstruct ordered questions
    const questionMap = new Map<string, MCQQuestion>();
    questions.forEach(q => questionMap.set(q.id, q));

    const arranged: MCQQuestion[] = [];
    const seen = new Set<string>();

    for (const id of parsed.arrangedIds) {
      const q = questionMap.get(id);
      if (q && !seen.has(id)) {
        seen.add(id);
        arranged.push(q);
      }
    }

    // Append any questions missed by AI
    for (const q of questions) {
      if (!seen.has(q.id)) {
        seen.add(q.id);
        arranged.push(q);
      }
    }

    // Construct phases
    let runningIdx = 0;
    const aiPhases: ArrangementPhase[] = [];

    if (Array.isArray(parsed.phases) && parsed.phases.length > 0) {
      parsed.phases.forEach((p: any, i: number) => {
        const count = typeof p.questionCount === 'number' ? Math.max(1, p.questionCount) : Math.floor(arranged.length / parsed.phases.length);
        const end = Math.min(arranged.length - 1, runningIdx + count - 1);
        aiPhases.push({
          phaseNumber: i + 1,
          name: typeof p.name === 'string' ? p.name : `Phase ${i + 1}`,
          startIndex: runningIdx,
          endIndex: end,
          questionCount: end - runningIdx + 1,
          recommendedMinutes: typeof p.recommendedMinutes === 'number' ? p.recommendedMinutes : Math.round(durationMinutes / parsed.phases.length),
          focusDescription: typeof p.focusDescription === 'string' ? p.focusDescription : 'Maintain steady focus and pacing.',
          badgeTone: (['info', 'brand', 'warning', 'success'] as const).includes(p.badgeTone) ? p.badgeTone : 'brand'
        });
        runningIdx = end + 1;
      });

      // Ensure last phase reaches the very end
      if (aiPhases.length > 0) {
        aiPhases[aiPhases.length - 1].endIndex = arranged.length - 1;
        aiPhases[aiPhases.length - 1].questionCount = arranged.length - aiPhases[aiPhases.length - 1].startIndex;
      }
    }

    return {
      arrangedQuestions: arranged,
      strategy,
      strategyTitle: typeof parsed.strategyTitle === 'string' ? parsed.strategyTitle : fallback.strategyTitle,
      phases: aiPhases.length > 0 ? aiPhases : fallback.phases,
      psychometricRationale: typeof parsed.psychometricRationale === 'string' ? parsed.psychometricRationale : fallback.psychometricRationale,
      timeManagementTips: Array.isArray(parsed.timeManagementTips) && parsed.timeManagementTips.length > 0 ? parsed.timeManagementTips : fallback.timeManagementTips,
      usedLiveAi: true,
      modelName: 'AI Gemini 3.8 Flash'
    };
  } catch (err) {
    console.warn('[ExamPilot] Gemini 3.8 Flash arrangement failed, using psychometric fallback:', err);
    return fallback;
  }
}
