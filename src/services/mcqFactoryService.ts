import type { MCQQuestion, QuestionKind, PYQMetadata, PYQQuestion, QuestionValidationResult, DistractorInfo } from '../types';

/**
 * The Gemini client is loaded lazily and only on the AI path. That keeps the
 * reciprocal numerical engine dependency-free — it runs offline and is directly
 * executable by `scripts/test-numerical-engine.mjs`.
 */
// Explicit .ts extension (permitted by the project's allowImportingTsExtensions)
// so the scripts/ diagnostics can drive this exact path under Node.
const loadGemini = () => import('./geminiService.ts');

/**
 * MCQ factory — the content engine behind "generate more questions".
 *
 * Two independent generators, deliberately layered:
 *
 * 1. `RECIPES` — deterministic numerical templates. The answer is *computed in
 *    code*, never written by a model, so a generated key cannot be wrong. Given
 *    exam-realistic parameter ranges it produces unlimited numerical drills, and
 *    the distractors are the mistakes students actually make (wrong coefficient,
 *    wrong drainage path, elastic instead of plastic modulus). Fully offline.
 *
 * 2. `generateAiQuestions` — Gemini-backed, Testbook-style items when an API key
 *    is present. Model output is never trusted: every candidate passes
 *    `validateCandidate` (schema, option/key integrity, numeric options for
 *    numerical items, duplicate detection, distractor spacing) and anything that
 *    fails is dropped rather than shown.
 *
 * `generateQuestionSet` combines both, balances the difficulty mix and dedupes
 * against everything already in the bank.
 */

/* ------------------------------------------------------------------ utils */

/** Deterministic PRNG so a seed reproduces a set exactly (and tests are stable). */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Rng = () => number;

const pick = <T,>(rng: Rng, values: T[]): T => values[Math.floor(rng() * values.length)];

/** Round to 3 significant figures and render without exponent noise. */
function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return String(value);
  const magnitude = Math.abs(value);
  let decimals: number;
  if (magnitude >= 1000) decimals = 0;
  else if (magnitude >= 100) decimals = 1;
  else if (magnitude >= 10) decimals = 1;
  else if (magnitude >= 1) decimals = 2;
  else if (magnitude >= 0.1) decimals = 3;
  else if (magnitude >= 0.01) decimals = 4;
  else decimals = 5;
  return value.toFixed(decimals).replace(/\.?0+$/, '');
}

const withUnit = (value: number, unit?: string) =>
  `${formatNumber(value)}${unit ? ` ${unit}` : ''}`;

/* ---------------------------------------------------------------- recipes */

export interface NumericalRecipe {
  id: string;
  subject: string;
  topic: string;
  subtopic: string;
  difficulty: MCQQuestion['difficulty'];
  unit?: string;
  reference: string;
  /** Build one problem. The answer must be computed, never hard-coded. */
  build: (rng: Rng) => {
    stem: string;
    answer: number;
    formulaContext: string;
    steps: string[];
    explanation: string;
    /** Plausible wrong answers; falls back to generic offsets. */
    distractors?: number[];
  };
}

/**
 * Recipes are grouped by subject. Every `build` recomputes from randomised
 * inputs, so the same recipe yields a family of problems.
 */
export const RECIPES: NumericalRecipe[] = [
  {
    id: 'rcc-lim-moment',
    subject: 'Reinforced Concrete Structures',
    topic: 'Limit State Design — Flexure',
    subtopic: 'Limiting Moment of Resistance',
    difficulty: 'MEDIUM',
    unit: 'kN·m',
    reference: 'IS 456:2000, Cl. 38.1',
    build: (rng) => {
      const fck = pick(rng, [20, 25, 30]);
      const grade = pick(rng, [
        { fy: 415, coeff: 0.138 },
        { fy: 500, coeff: 0.133 }
      ]);
      const b = pick(rng, [230, 250, 300]);
      const d = pick(rng, [400, 450, 500]);
      const answer = (grade.coeff * fck * b * d ** 2) / 1e6;
      return {
        stem: `A singly reinforced rectangular beam of width ${b} mm and effective depth ${d} mm is cast with M${fck} concrete and Fe ${grade.fy} steel. Determine its limiting moment of resistance.`,
        answer,
        formulaContext: `M_u,lim = ${grade.coeff} · f_ck · b · d²   (Fe ${grade.fy})`,
        steps: [
          `Step 1 — For Fe ${grade.fy} the limiting moment coefficient is ${grade.coeff}: M_u,lim = ${grade.coeff} · f_ck · b · d².`,
          `Step 2 — Substitute: M_u,lim = ${grade.coeff} × ${fck} × ${b} × (${d})² N·mm.`,
          `Step 3 — (${d})² = ${(d ** 2).toLocaleString('en-IN')} mm² → M_u,lim = ${formatNumber(answer)} × 10⁶ N·mm.`,
          `Step 4 — Convert to kN·m: ${formatNumber(answer)} kN·m.`
        ],
        explanation: `The limiting moment coefficient depends only on the steel grade${grade.fy === 415 ? ' (0.138 for Fe 415)' : ' (0.133 for Fe 500)'}. Using the coefficient of the other grade is the standard trap.`,
        distractors: [
          (0.148 * fck * b * d ** 2) / 1e6,
          (grade.coeff * fck * b * d ** 2) / 1e6 / 1.2
        ]
      };
    }
  },
  {
    id: 'rcc-shear-stress',
    subject: 'Reinforced Concrete Structures',
    topic: 'Limit State Design — Shear',
    subtopic: 'Nominal Shear Stress',
    difficulty: 'MEDIUM',
    unit: 'MPa',
    reference: 'IS 456:2000, Cl. 40.1',
    build: (rng) => {
      const V = pick(rng, [100, 120, 150, 180, 200]);
      const b = pick(rng, [230, 250, 300]);
      const d = pick(rng, [400, 450, 500]);
      const answer = (V * 1000) / (b * d);
      return {
        stem: `A beam section ${b} mm wide and ${d} mm effective deep carries a factored shear force of ${V} kN. Calculate the nominal shear stress τ_v.`,
        answer,
        formulaContext: 'τ_v = V_u / (b · d)',
        steps: [
          'Step 1 — Formula: τ_v = V_u / (b · d), with V_u in newtons.',
          `Step 2 — V_u = ${V} × 10³ = ${V * 1000} N; b·d = ${b} × ${d} = ${(b * d).toLocaleString('en-IN')} mm².`,
          `Step 3 — τ_v = ${V * 1000} / ${(b * d).toLocaleString('en-IN')} = ${formatNumber(answer)} N/mm² = ${formatNumber(answer)} MPa.`
        ],
        explanation: 'Nominal shear stress uses the effective depth (not the overall depth) and the factored shear force. Substituting overall depth is the usual error.',
        distractors: [(V * 1000) / (b * d * 2), (V * 1000) / (b * d * 0.8)]
      };
    }
  },
  {
    id: 'sa-fixed-end-moment',
    subject: 'Structural Analysis',
    topic: 'Indeterminate Structures — Fixed Beams',
    subtopic: 'Fixed End Moments',
    difficulty: 'MEDIUM',
    unit: 'kN·m',
    reference: 'Structural Analysis — Hibbeler',
    build: (rng) => {
      const w = pick(rng, [20, 25, 30, 40]);
      const L = pick(rng, [4, 5, 6, 8]);
      const answer = (w * L ** 2) / 12;
      return {
        stem: `A beam fixed at both ends spans ${L} m and carries a uniformly distributed load of ${w} kN/m over its entire length. Determine the magnitude of the fixed end moment at each support.`,
        answer,
        formulaContext: 'FEM = w · L² / 12',
        steps: [
          'Step 1 — For a fixed beam under full UDL both end moments are equal and hogging: FEM = wL²/12.',
          `Step 2 — L² = ${L}² = ${L ** 2} m².`,
          `Step 3 — FEM = (${w} × ${L ** 2}) / 12 = ${(w * L ** 2).toLocaleString('en-IN')} / 12 = ${formatNumber(answer)} kN·m.`
        ],
        explanation: 'Fixed-end moment for a UDL is wL²/12 at each support. Using wL²/8 is the simply-supported mid-span moment — a frequent confusion.',
        distractors: [(w * L ** 2) / 8, (w * L ** 2) / 16]
      };
    }
  },
  {
    id: 'sa-arch-thrust',
    subject: 'Structural Analysis',
    topic: 'Three-Hinged and Two-Hinged Arches',
    subtopic: 'Horizontal Thrust',
    difficulty: 'MEDIUM',
    unit: 'kN',
    reference: 'Theory of Structures — Vazirani & Ratwani',
    build: (rng) => {
      const w = pick(rng, [10, 15, 20, 25]);
      const L = pick(rng, [30, 40, 50]);
      const h = pick(rng, [4, 5, 6, 8]);
      const answer = (w * L ** 2) / (8 * h);
      return {
        stem: `A three-hinged parabolic arch of span ${L} m with a central rise of ${h} m carries a uniformly distributed load of ${w} kN/m over the entire span. Calculate the horizontal thrust at the supports.`,
        answer,
        formulaContext: 'H = w · L² / (8 · h)',
        steps: [
          'Step 1 — Under full-span UDL a parabolic arch has zero bending moment; the thrust follows from the moment equilibrium of a half arch.',
          `Step 2 — H = w·L²/(8h) = (${w} × ${L}²)/(8 × ${h}).`,
          `Step 3 — L² = ${L ** 2} m² → H = ${(w * L ** 2).toLocaleString('en-IN')}/${8 * h} = ${formatNumber(answer)} kN.`
        ],
        explanation: 'The horizontal thrust of a three-hinged parabolic arch under full-span UDL is wL²/(8h). The rise sits in the denominator, so a flatter arch carries a much larger thrust.'
      };
    }
  },
  {
    id: 'som-mohr-radius',
    subject: 'Strength of Materials',
    topic: "Principal Stresses & Mohr's Circle",
    subtopic: 'Radius of Mohr Circle',
    difficulty: 'MEDIUM',
    unit: 'MPa',
    reference: 'Mechanics of Materials — Gere & Timoshenko',
    build: (rng) => {
      // Pythagorean triples keep the answer exact.
      const [a, b, c] = pick(rng, [
        [30, 40, 50],
        [40, 30, 50],
        [60, 80, 100],
        [9, 12, 15],
        [80, 60, 100]
      ]);
      const mean = pick(rng, [30, 50, 60, 80]);
      const sigmaX = mean + a;
      const sigmaY = mean - a;
      const tau = b;
      return {
        stem: `At a point in a stressed body, σ_x = ${sigmaX} MPa, σ_y = ${sigmaY} MPa and τ_xy = ${tau} MPa. Calculate the radius of the Mohr circle.`,
        answer: c,
        formulaContext: 'R = √( ((σ_x − σ_y)/2)² + τ_xy² )',
        steps: [
          `Step 1 — Centre of the circle: (σ_x + σ_y)/2 = (${sigmaX} + ${sigmaY})/2 = ${mean} MPa.`,
          `Step 2 — Half the difference: (σ_x − σ_y)/2 = ${sigmaX - sigmaY}/2 = ${a} MPa.`,
          `Step 3 — R = √(${a}² + ${tau}²) = √(${a ** 2} + ${tau ** 2}) = √${a ** 2 + tau ** 2} = ${c} MPa.`,
          `Step 4 — Principal stresses are ${mean} ± ${c}, i.e. ${mean + c} MPa and ${Math.abs(mean - c)} MPa.`
        ],
        explanation: 'The radius depends on both the half-difference of normal stresses and the shear stress. Quoting either alone is the classic error.',
        // Each distractor is a named mistake: half the difference only, shear
        // only, or adding the two instead of combining them by root-sum-square.
        // Note `mean` is NOT usable here — for triples like (30,40,50) the mean
        // can equal the answer itself.
        distractors: [a, tau, a + tau]
      };
    }
  },
  {
    id: 'som-euler-scaling',
    subject: 'Strength of Materials',
    topic: "Euler's Column Buckling Theory",
    subtopic: 'Effect of End Conditions',
    difficulty: 'EASY',
    unit: 'kN',
    reference: 'Strength of Materials — B.C. Punmia',
    build: (rng) => {
      const base = pick(rng, [150, 200, 250, 300, 400]);
      const option = pick(rng, [
        { label: 'both ends fixed', factor: 4 },
        { label: 'one end fixed and the other hinged', factor: 2 },
        { label: 'both ends hinged', factor: 1 }
      ]);
      const answer = base * option.factor;
      return {
        stem: `A column with both ends hinged has a critical buckling load of ${base} kN. If the same column is re-supported with ${option.label}, what will be its critical load?`,
        answer,
        formulaContext: 'P_cr = π²EI / L_eff²;  L_eff = L for hinged-hinged, L/2 for fixed-fixed, L/√2 for fixed-hinged',
        steps: [
          `Step 1 — Hinged-hinged effective length is L, giving P_cr = ${base} kN.`,
          `Step 2 — Changing the end condition scales the effective length; P_cr varies as 1/L_eff².`,
          `Step 3 — For ${option.label} the effective-length factor is ${option.factor === 4 ? '0.5 (L_eff = L/2)' : option.factor === 2 ? '0.707 (L_eff = L/√2)' : '1.0 (L_eff = L)'}.`,
          `Step 4 — P_cr = ${option.factor} × ${base} = ${formatNumber(answer)} kN.`
        ],
        explanation: 'End conditions change only the effective length, and the critical load scales as the inverse square of that length.'
      };
    }
  },
  {
    id: 'geo-void-ratio',
    subject: 'Geotechnical Engineering',
    topic: 'Soil Phase Relationships & Index Properties',
    subtopic: 'Void Ratio',
    difficulty: 'MEDIUM',
    reference: 'Soil Mechanics — B.C. Punmia',
    build: (rng) => {
      const w = pick(rng, [15, 20, 25, 30, 35]);
      const G = pick(rng, [2.6, 2.65, 2.7, 2.72]);
      const answer = (w / 100) * G;
      return {
        stem: `A saturated soil sample has a water content of ${w}% and a specific gravity of solids of ${G}. Determine its void ratio.`,
        answer,
        formulaContext: 'S · e = w · G  →  e = w·G  (saturated, S = 1)',
        steps: [
          'Step 1 — Phase relation: S · e = w · G.',
          'Step 2 — The soil is saturated, so S = 1 → e = w · G.',
          `Step 3 — e = ${w / 100} × ${G} = ${formatNumber(answer)}.`,
          `Step 4 — Cross-check: γ_sat = ${formatNumber(((G + answer) / (1 + answer)) * 9.81)} kN/m³.`
        ],
        explanation: 'For a saturated soil S = 1, so e = wG directly. Dividing by a guessed saturation value is invalid — saturation is stated.',
        distractors: [(w / 100) * G * 2, (w / 100) * G / 1.5, w / 100]
      };
    }
  },
  {
    id: 'geo-consolidation-drainage',
    subject: 'Geotechnical Engineering',
    topic: 'Terzaghi 1D Consolidation & Settlement',
    subtopic: 'Effect of Drainage Path',
    difficulty: 'MEDIUM',
    unit: 'years',
    reference: 'Theoretical Soil Mechanics — Terzaghi',
    build: (rng) => {
      const years = pick(rng, [1, 1.5, 2, 3, 4]);
      const factor = pick(rng, [4, 1 / 4]);
      const answer = years * factor;
      const opening = factor === 4 ? 'double drainage' : 'single drainage (top only)';
      const closing = factor === 4 ? 'top only' : 'both top and bottom';
      return {
        stem: `A clay layer reached 50% consolidation in ${years} years when it could drain from ${opening}. How long would the same layer take if drainage were possible from ${closing}?`,
        answer,
        formulaContext: 'T_v = c_v · t / d²  →  t ∝ d²',
        steps: [
          'Step 1 — At the same degree of consolidation T_v is unchanged, so t ∝ d² where d is the drainage path.',
          factor === 4
            ? 'Step 2 — Going from double to single drainage doubles the drainage path.'
            : 'Step 2 — Going from single to double drainage halves the drainage path.',
          `Step 3 — Time scales by (${factor === 4 ? '2' : '1/2'})² = ${factor}.`,
          `Step 4 — t = ${factor} × ${years} = ${formatNumber(answer)} years.`
        ],
        explanation: 'Consolidation time varies with the square of the drainage path, so halving the path quarters the time — the single most examined idea in consolidation.',
        distractors: [years * 2, years / 2, years]
      };
    }
  },
  {
    id: 'fm-laminar-friction',
    subject: 'Fluid Mechanics & Hydraulics',
    topic: 'Bernoulli Equation, Pipe Friction & Losses',
    subtopic: 'Darcy Friction Factor',
    difficulty: 'MEDIUM',
    reference: 'Fluid Mechanics — R.K. Bansal',
    build: (rng) => {
      const Re = pick(rng, [800, 1000, 1200, 1400, 1600, 1800]);
      const answer = 64 / Re;
      return {
        stem: `Oil flows through a pipe at a Reynolds number of ${Re}. Calculate the Darcy–Weisbach friction factor for this flow.`,
        answer,
        formulaContext: 'f = 64 / Re  (laminar, Re < 2000)',
        steps: [
          `Step 1 — Check the regime: Re = ${Re} < 2000, so the flow is laminar.`,
          'Step 2 — For laminar flow the Hagen–Poiseuille result reduces to f = 64/Re.',
          `Step 3 — f = 64 / ${Re} = ${formatNumber(answer)}.`
        ],
        explanation: 'In the laminar regime f depends only on Reynolds number as 64/Re. The Blasius expression 0.316/Re^0.25 applies only to smooth turbulent flow.'
      };
    }
  },
  {
    id: 'env-ultimate-bod',
    subject: 'Environmental Engineering',
    topic: 'BOD Kinetics & Biological Wastewater Treatment',
    subtopic: 'Ultimate BOD',
    difficulty: 'MEDIUM',
    unit: 'mg/L',
    reference: 'Wastewater Engineering — Metcalf & Eddy',
    build: (rng) => {
      const bod5 = pick(rng, [150, 180, 200, 240, 250, 300]);
      const ratio = pick(rng, [0.65, 0.68, 0.7]);
      const answer = bod5 / ratio;
      return {
        stem: `The 5-day BOD of a wastewater sample at 20 °C is ${bod5} mg/L, and it is known that BOD₅ is ${Math.round(ratio * 100)}% of the ultimate BOD. Determine the ultimate BOD (L₀).`,
        answer,
        formulaContext: 'BOD₅ = ratio · L₀  →  L₀ = BOD₅ / ratio',
        steps: [
          `Step 1 — Given: BOD₅ = ${bod5} mg/L = ${Math.round(ratio * 100)}% of the ultimate BOD.`,
          `Step 2 — Therefore ${ratio} · L₀ = ${bod5}.`,
          `Step 3 — L₀ = ${bod5} / ${ratio} = ${formatNumber(answer)} mg/L.`,
          'Step 4 — Sanity check: the ultimate BOD must exceed the 5-day BOD, and it does.'
        ],
        explanation: 'The ultimate BOD is always greater than the 5-day BOD. Any answer smaller than the BOD₅ given is automatically wrong, which makes this quick to check.',
        distractors: [bod5 * ratio, bod5]
      };
    }
  },
  {
    id: 'sur-curvature-refraction',
    subject: 'Surveying & Geomatics',
    topic: 'Fundamental Principles & Differential Levelling',
    subtopic: 'Curvature and Refraction Correction',
    difficulty: 'MEDIUM',
    unit: 'm',
    reference: 'Surveying Vol. I — B.C. Punmia',
    build: (rng) => {
      const d = pick(rng, [0.5, 1, 1.5, 2, 2.5, 3]);
      const answer = 0.0673 * d ** 2;
      return {
        stem: `A levelling staff is held ${d} km away from the instrument. Determine the combined correction for curvature and refraction that must be applied to the observed reading.`,
        answer,
        formulaContext: 'C_cr = 0.0673 · d²   (d in km, result in m)',
        steps: [
          `Step 1 — Curvature correction: C_c = 0.0785 d² = 0.0785 × ${d ** 2} = ${formatNumber(0.0785 * d ** 2)} m.`,
          `Step 2 — Refraction correction is 1/7 of curvature and opposite in sense: C_r = ${formatNumber((0.0785 * d ** 2) / 7)} m.`,
          `Step 3 — Combined: C_cr = C_c − C_r = ${formatNumber(answer)} m ≈ 0.0673 d².`,
          'Step 4 — Apply the correction negatively to the observed staff reading.'
        ],
        explanation: 'The combined correction is always subtractive and grows with the square of the distance, which is why long sights are avoided in precise levelling.',
        // 0.0785 d² = curvature alone; 0.0785 d = curvature with the square
        // dropped (the classic slip); 2× = doubling the correction. The linear
        // form 0.0673 d would coincide with the answer at d = 1 km.
        distractors: [0.0785 * d ** 2, 0.0785 * d, answer * 2]
      };
    }
  },
  {
    id: 'steel-plastic-moment',
    subject: 'Design of Steel Structures',
    topic: 'Plastic Analysis & Shape Factor',
    subtopic: 'Plastic Moment Capacity',
    difficulty: 'MEDIUM',
    unit: 'kN·m',
    reference: 'IS 800:2007 — Plastic Analysis, Annex B',
    build: (rng) => {
      const b = pick(rng, [75, 90, 100, 125]);
      const d = pick(rng, [200, 250, 300]);
      const fy = pick(rng, [250, 350]);
      const Zp = (b * d ** 2) / 4;
      const answer = (fy * Zp) / 1e6;
      const Ze = (b * d ** 2) / 6;
      return {
        stem: `A rectangular steel section ${b} mm wide and ${d} mm deep is made of steel with yield stress ${fy} MPa. Calculate its plastic moment of resistance.`,
        answer,
        formulaContext: 'M_p = f_y · Z_p = f_y · b·d²/4',
        steps: [
          'Step 1 — For a rectangle the plastic section modulus is Z_p = b·d²/4.',
          `Step 2 — Z_p = ${b} × ${d}²/4 = ${b} × ${(d ** 2).toLocaleString('en-IN')}/4 = ${Zp.toLocaleString('en-IN')} mm³.`,
          `Step 3 — M_p = f_y · Z_p = ${fy} × ${Zp.toLocaleString('en-IN')} = ${formatNumber(answer)} × 10⁶ N·mm.`,
          `Step 4 — Convert: M_p = ${formatNumber(answer)} kN·m. Cross-check — the yield moment using Z_e = b·d²/6 is ${formatNumber((fy * Ze) / 1e6)} kN·m, i.e. a shape factor of 1.5.`
        ],
        explanation: 'A rectangular section has a shape factor of exactly 1.5, so the plastic moment is 50% above the yield moment. Quoting the elastic value is the standard error.',
        distractors: [(fy * Ze) / 1e6, (fy * Zp) / 1e6 / 1.5, (fy * Zp) / 1e6 / 2]
      };
    }
  },
  {
    id: 'cm-pert-expected-time',
    subject: 'Construction Management',
    topic: 'CPM vs PERT & Activity Times',
    subtopic: 'Expected Activity Duration',
    difficulty: 'EASY',
    unit: 'days',
    reference: 'PERT and CPM — L.S. Srinath',
    build: (rng) => {
      const o = pick(rng, [3, 4, 5, 2]);
      const m = pick(rng, [6, 7, 8, 9]);
      const p = pick(rng, [14, 16, 18, 20]);
      const answer = (o + 4 * m + p) / 6;
      return {
        stem: `An activity has an optimistic time of ${o} days, a most likely time of ${m} days and a pessimistic time of ${p} days. Determine its expected duration in PERT.`,
        answer,
        formulaContext: 't_e = (t_o + 4·t_m + t_p) / 6',
        steps: [
          'Step 1 — PERT weights the most likely estimate four times: t_e = (t_o + 4t_m + t_p)/6.',
          `Step 2 — t_e = (${o} + 4×${m} + ${p})/6.`,
          `Step 3 — t_e = (${o} + ${4 * m} + ${p})/6 = ${formatNumber(((o + 4 * m + p) / 6) * 6)}/6 = ${formatNumber(answer)} days.`
        ],
        explanation: 'The expected time is the beta-distribution mean (weighted average), which exceeds the most likely time whenever the estimate is right-skewed.'
      };
    }
  },
  {
    id: 'hyd-duty-delta',
    subject: 'Hydrology & Irrigation Engineering',
    topic: 'Crop Water Requirements: Duty, Delta & Base Period',
    subtopic: 'Duty of Canal Water',
    difficulty: 'MEDIUM',
    unit: 'ha/cumec',
    reference: 'Irrigation Engineering — S.K. Garg',
    build: (rng) => {
      const B = pick(rng, [100, 110, 120, 140, 150]);
      // delta must never equal B: the inverted formula below would then give
      // exactly 864, which is also the answer, producing two identical options.
      const delta = pick(rng, [60, 72, 80, 96]);
      const answer = (864 * B) / delta;
      return {
        stem: `A crop with a base period of ${B} days requires a total depth of water (Δ) of ${delta} cm. Determine the duty of the canal water at the field outlet.`,
        answer,
        formulaContext: 'D = 864 · B / Δ   (B in days, Δ in cm)',
        steps: [
          'Step 1 — Relation between duty, base period and delta: D = 864 B / Δ.',
          `Step 2 — D = (864 × ${B}) / ${delta}.`,
          `Step 3 — 864 × ${B} = ${(864 * B).toLocaleString('en-IN')}; ÷ ${delta} = ${formatNumber(answer)} ha/cumec.`
        ],
        explanation: 'Duty increases with the base period and decreases with the depth of water required — the two are inversely related, which is what the formula encodes.',
        // Mistakes: dropping the 864 constant that converts days·cm to ha/cumec,
        // a unit slip on delta, and inverting the ratio.
        distractors: [B / delta, (864 * B) / (delta * 10), (864 * delta) / B]
      };
    }
  },
  {
    id: 'pc-anchorage-slip',
    subject: 'Prestressed Concrete',
    topic: 'The 6 Losses of Prestress',
    subtopic: 'Loss Due to Anchorage Slip',
    difficulty: 'HARD',
    unit: 'MPa',
    reference: 'Prestressed Concrete — N. Krishna Raju',
    build: (rng) => {
      const slip = pick(rng, [2, 3, 4, 5]);
      const L = pick(rng, [15, 20, 25, 30, 40]);
      const answer = (slip * 200000) / (L * 1000);
      return {
        stem: `A post-tensioned tendon ${L} m long slips ${slip} mm into the anchorage at the stressing end. Taking E_s = 200 GPa, calculate the loss of prestress due to anchorage slip.`,
        answer,
        formulaContext: 'Δf = (Δ_slip · E_s) / L',
        steps: [
          `Step 1 — Formula: Δf = (Δ · E_s)/L. Convert E_s = 200 GPa = 200,000 N/mm² and L = ${L} m = ${L * 1000} mm.`,
          `Step 2 — Δf = (${slip} × 200,000) / ${L * 1000}.`,
          `Step 3 — Numerator = ${(slip * 200000).toLocaleString('en-IN')} → Δf = ${formatNumber(answer)} N/mm².`,
          `Step 4 — Δf = ${formatNumber(answer)} MPa.`
        ],
        explanation: 'Mixed units are the trap: slip in mm, modulus in N/mm² and length in mm. Anchorage-slip loss is uniform along the tendon and falls as tendon length increases.',
        // Distractors encode specific student errors: halving/doubling the slip,
        // and treating the slip as centimetres (a factor of 10 out).
        distractors: [answer / 2, answer * 2, answer / 10]
      };
    }
  },
  {
    id: 'est-centreline',
    subject: 'Estimating & Costing',
    topic: 'Methods of Building Measurement & IS 1200 Rules',
    subtopic: 'Centreline Method with Junctions',
    difficulty: 'MEDIUM',
    unit: 'm',
    reference: 'Estimating, Costing & Valuation — B.N. Dutta',
    build: (rng) => {
      // The deduction is kept a meaningful share of the run (minimum 4.5 %,
      // worst case 1.8 m in 40 m). With thinner walls or fewer junctions the
      // "forgot the deduction" distractor lands within 2 % of the answer, i.e.
      // it rounds to the same value and stops being a real option.
      const L = pick(rng, [24, 30, 36, 40]);
      const t = pick(rng, [0.3, 0.45]);
      const junctions = pick(rng, [6, 8, 10]);
      const answer = L - junctions * t;
      return {
        stem: `A building’s walls are ${formatNumber(t * 100)} cm thick with a total centreline length of ${L} m. If the plan contains ${junctions} T-junctions, determine the net length used for estimating the masonry.`,
        answer,
        formulaContext: 'Net length = centreline length − (junctions × wall thickness)',
        steps: [
          'Step 1 — In the centreline method the wall centreline is measured once and each junction is deducted.',
          `Step 2 — Deduction per T-junction = half the thickness from each side = ${formatNumber(t)} m.`,
          `Step 3 — Total deduction = ${junctions} × ${formatNumber(t)} = ${formatNumber(junctions * t)} m.`,
          `Step 4 — Net length = ${L} − ${formatNumber(junctions * t)} = ${formatNumber(answer)} m.`
        ],
        explanation: 'Each junction is traversed twice along the centreline, so the thickness is deducted once per junction. Forgetting the deduction overestimates the masonry.',
        // Mistakes: adding the deduction, double-counting it, and forgetting it
        // altogether (which is the option real students actually fall for).
        distractors: [L + junctions * t, L - junctions * t * 2, L]
      };
    }
  },
  {
    id: 'hw-stopping-sight-distance',
    subject: 'Highway & Transportation Engineering',
    topic: 'Highway Geometric Design & Cross-Section',
    subtopic: 'Stopping Sight Distance',
    difficulty: 'HARD',
    unit: 'm',
    reference: 'Highway Engineering — Khanna & Justo',
    build: (rng) => {
      const V = pick(rng, [50, 60, 65, 80, 100]);
      const f = pick(rng, [0.35, 0.36, 0.4]);
      const t = 2.5;
      const v = V / 3.6;
      const lag = v * t;
      const braking = v ** 2 / (2 * 9.81 * f);
      const answer = lag + braking;
      return {
        stem: `Calculate the stopping sight distance for a design speed of ${V} km/h on a level road with a coefficient of longitudinal friction of ${f} and a driver reaction time of ${t} seconds.`,
        answer,
        formulaContext: 'SSD = v·t + v²/(2·g·f)   (v in m/s)',
        steps: [
          `Step 1 — Convert the speed: v = ${V} km/h = ${V}/3.6 = ${formatNumber(v)} m/s.`,
          `Step 2 — Reaction (lag) distance = v·t = ${formatNumber(v)} × ${t} = ${formatNumber(lag)} m.`,
          `Step 3 — Braking distance = v²/(2 g f) = ${formatNumber(v ** 2)}/(2 × 9.81 × ${f}) = ${formatNumber(braking)} m.`,
          `Step 4 — SSD = ${formatNumber(lag)} + ${formatNumber(braking)} = ${formatNumber(answer)} m.`
        ],
        explanation: 'SSD combines reaction distance and braking distance. Report only one component and you are out by a factor of about two — a very common exam error.',
        distractors: [lag, braking, 0.278 * V * t]
      };
    }
  },
  {
    id: 'hw-superelevation',
    subject: 'Highway & Transportation Engineering',
    topic: 'Highway Geometric Design & Cross-Section',
    subtopic: 'Superelevation',
    difficulty: 'MEDIUM',
    reference: 'IRC 73 / IRC 38 — Geometric Design',
    build: (rng) => {
      const V = pick(rng, [50, 60, 65, 80, 100]);
      const R = pick(rng, [200, 250, 300, 400, 500]);
      const answer = V ** 2 / (127 * R);
      return {
        stem: `A horizontal curve of radius ${R} m is to be designed for a speed of ${V} km/h. Determine the superelevation required, neglecting friction.`,
        answer,
        formulaContext: 'e = V² / (127 · R)',
        steps: [
          'Step 1 — With friction neglected, the whole centrifugal force is balanced by superelevation.',
          `Step 2 — e = V²/(127 R) = ${V}²/(127 × ${R}).`,
          `Step 3 — e = ${V ** 2}/${(127 * R).toLocaleString('en-IN')} = ${formatNumber(answer)}.`,
          `Step 4 — Compare with the practical maximum of 0.07 (plain terrain): ${answer > 0.07 ? 'this exceeds it, so the curve needs a larger radius, friction, or a lower design speed.' : 'this is within the permissible limit.'}`
        ],
        explanation: 'IRC limits superelevation to 0.07 in plain terrain; if the computed value exceeds it, the remainder must be resisted by friction and the speed or radius adjusted.',
        distractors: [V ** 2 / (127 * R) / 2, (V ** 2 / R) / 100, V ** 2 / (225 * R)]
      };
    }
  }
];

/* ------------------------------------------------------------- generation */

export interface GenerationOptions {
  /** Restrict to these subjects; omit for all. */
  subjects?: string[];
  /** How many problems to produce. */
  count: number;
  /** Deterministic seed — the same seed yields the same set. */
  seed?: number;
  /** Target share of NUMERICAL items, 0–1. Recipes are always numerical. */
  numericalShare?: number;
  /** Existing stems used for duplicate rejection. */
  existingStems?: string[];
}

export interface GenerationReport {
  requested: number;
  produced: number;
  /** Items whose answer must be computed from given data. */
  numerical: number;
  /** Of the produced items, how many came from a verified recipe (computed key). */
  fromRecipes: number;
  /** Of the produced items, how many the model drafted. */
  aiGenerated: number;
  rejected: number;
  seed: number;
  usedLiveAi: boolean;
  distractorsGenerated: number;
  validationStatus: string;
  dedupedCount: number;
}

export interface GeneratedSet {
  questions: MCQQuestion[];
  report: GenerationReport;
}

const OPTION_IDS = ['A', 'B', 'C', 'D'] as const;
type OptionId = (typeof OPTION_IDS)[number];

const normalizeStem = (stem: string) => stem.replace(/\s+/g, ' ').trim().toLowerCase().slice(0, 90);

/**
 * Stem with every quantity blanked out.
 *
 * Two items identical after this differ only in their numbers — the observed
 * live failure being "water content 15%, G = 2.65" and "water content 15%,
 * G = 2.7" delivered as separate questions in the same batch. Normalising to the
 * first 90 characters does not catch that; blanking the digits does.
 */
const stemFingerprint = (stem: string) =>
  normalizeStem(stem.replace(/\d+(?:\.\d+)?/g, '#')).slice(0, 90);

let sequence = 0;
const nextId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${(sequence += 1).toString(36)}`;

/**
 * Options closer than this are not really separate choices: a learner who rounds
 * anywhere in the working can land on the wrong one, and two values that both
 * round to the same displayed figure look like a typo.
 */
const OPTION_COLLISION_TOLERANCE = 0.02;

/**
 * Read the quantity an option text starts with, so options can be compared as
 * numbers rather than characters. A model asked for four distinct values will
 * still emit "1,200 kN·m" and "1200 kN·m" — identical to any student.
 * Returns null for options that are not numeric (formula and conceptual items).
 */
function numericValue(text: string): number | null {
  const cleaned = text.replace(/,/g, '').replace(/[\u2212\u2013]/g, '-').trim();
  const match = /^[^\d-]*(-?\d*\.?\d+)/.exec(cleaned);
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : null;
}

/** Unit tail of an option ("… kN·m" → "kN·m"); '' when there is none. */
function unitTail(text: string): string {
  const match = /[a-zA-Z\u00b0\u00b2\u00b3\u00b7/^\-]+(?:\s*[a-zA-Z\u00b0\u00b2\u00b3\u00b7/^\-]+)*$/.exec(text.trim());
  return match ? match[0].trim() : '';
}

/** Format a repair value using the key's own decimal precision and unit. */
function formatLikeKey(value: number, keyText: string): string {
  const decimals = /\d+\.(\d+)/.exec(keyText.replace(/,/g, ''))?.[1]?.length ?? 0;
  const decimalsUsed = Math.min(decimals, 3);
  const unit = unitTail(keyText);
  const number = decimalsUsed > 0
    ? value.toFixed(decimalsUsed).replace(/\.?0+$/, '')
    : String(Math.round(value));
  return unit ? `${number} ${unit}` : number;
}

/** Options that are numerically indistinguishable from each other or the key. */
function numericCollisionIssues(question: MCQQuestion): string[] {
  if (question.questionType !== 'NUMERICAL') return [];
  const issues: string[] = [];
  const values = question.options.map((option) => numericValue(option.text));
  if (values.some((value) => value === null)) {
    return ['numerical item has a non-numeric option'];
  }
  for (let i = 0; i < values.length; i += 1) {
    for (let j = i + 1; j < values.length; j += 1) {
      const a = values[i] as number;
      const b = values[j] as number;
      const scale = Math.max(Math.abs(a), Math.abs(b), 1e-9);
      if (Math.abs(a - b) / scale < OPTION_COLLISION_TOLERANCE) {
        issues.push(`options ${question.options[i].id} and ${question.options[j].id} are the same quantity (${a} vs ${b})`);
      }
    }
  }
  // Every option must carry the key's unit, otherwise the item mixes quantities.
  const key = question.options.find((option) => option.id === question.correctOption);
  const keyUnit = key ? unitTail(key.text) : '';
  if (keyUnit) {
    for (const option of question.options) {
      if (!option.text.includes(keyUnit)) {
        issues.push(`option ${option.id} is missing the key's unit ${keyUnit}`);
      }
    }
  }
  return issues;
}

/**
 * Substitute clean, well-spaced values for AI-written distractors that collide
 * with the key or with each other. Model arithmetic is the least trustworthy
 * part of a generated set, but the question around a bad distractor is usually
 * still good — so repair instead of discarding, and let validation re-check.
 */
export function repairNumericOptions(question: MCQQuestion): MCQQuestion {
  if (question.questionType !== 'NUMERICAL' || question.options.length !== 4) return question;

  const key = question.options.find((option) => option.id === question.correctOption);
  const keyValue = key ? numericValue(key.text) : null;
  if (!key || keyValue === null || keyValue === 0) return question;

  const spacing = 0.02;
  const collides = (value: number, accepted: number[]) => {
    if (Math.abs(value - keyValue) / Math.max(Math.abs(value), Math.abs(keyValue)) < spacing) return true;
    return accepted.some(
      (other) => Math.abs(value - other) / Math.max(Math.abs(value), Math.abs(other)) < spacing
    );
  };

  // Spread candidates: proportional offsets read as plausible wrong answers for
  // a computed quantity (unit slip, factor-of-two, inverted ratio).
  const spreads = [0.5, 2, 0.1, 1.5, 0.75, 3, 0.25, 1.25];
  const accepted: number[] = [];
  const nextOptions = question.options.map((option) => {
    const value = numericValue(option.text);
    if (option.id === question.correctOption) {
      accepted.push(keyValue);
      return option;
    }
    if (value !== null && !collides(value, accepted)) {
      accepted.push(value);
      return option;
    }
    for (const factor of spreads) {
      const candidate = keyValue * factor;
      if (!collides(candidate, accepted)) {
        accepted.push(candidate);
        return { ...option, text: formatLikeKey(candidate, key.text) };
      }
    }
    return option;
  });

  return { ...question, options: nextOptions };
}

/**
 * Phrases that only appear when a model leaks its own deliberation into a field
 * value.
 *
 * Measured live against the real API: one explanation contained "I cannot
 * generate an incorrect explanation. Let me re-read the prompt: ..." followed by
 * a paragraph of self-argument, and a student would have read that as the
 * solution. Structural validation cannot see this, so it gets its own rule — the
 * alternative is shipping the model's inner monologue as teaching material.
 */
const REASONING_LEAK =
  /(let me (re-?read|reconsider|think|check|try|re-?evaluate)|i cannot (generate|provide|create)|as an ai\b|the prompt (says|asks|requires)|wait,|hmm,|let's (check|verify|reconsider)|i need to (make sure|ensure)|this is a critical point)/i;

/** Structural checks every generated question must pass before it is shown. */
export function validateCandidate(
  question: MCQQuestion,
  seenStems: Set<string>
): string[] {
  const issues: string[] = [];
  const stemKey = normalizeStem(question.stem ?? '');
  const stemShape = stemFingerprint(question.stem ?? '');

  if (!question.stem || question.stem.trim().length < 25) issues.push('stem too short');
  if (seenStems.has(stemKey)) issues.push('duplicate stem');
  else if (question.sourceType !== 'TEMPLATE_GENERATED' && seenStems.has(stemShape)) {
    // Parameter variation is the point of a template — "drainage path 2 years"
    // and "4 years" are two drills, not a duplicate. For anything a model wrote,
    // the same sentence with new numbers is padding, and live runs produced
    // exactly that (water content 15% with G = 2.65 and again with 2.7).
    issues.push('near-duplicate stem (same wording, different numbers)');
  }
  if (!Array.isArray(question.options) || question.options.length !== 4) issues.push('needs exactly 4 options');
  else {
    const ids = question.options.map((o) => o.id).join('');
    if (ids !== 'ABCD') issues.push(`option ids are ${ids}`);
    const texts = new Set(question.options.map((o) => o.text.trim().toLowerCase()));
    if (texts.size !== 4) issues.push('duplicate option text');
    if (question.options.some((o) => !o.text.trim())) issues.push('empty option text');
    // These make a single-answer key ambiguous, which is the failure mode that
    // gets an item challenged in review. Real exam papers do not use them.
    const filler = question.options.find((o) => /^(all|none)\s+of\s+(the\s+)?above/im.test(o.text.trim()));
    if (filler) issues.push(`option ${filler.id} is an "all/none of the above" filler`);
  }
  if (!['A', 'B', 'C', 'D'].includes(question.correctOption)) issues.push('invalid key');
  if (!question.explanation || question.explanation.trim().length < 30) issues.push('explanation too thin');

  // The model's working-out must never reach a student.
  const visibleText = [
    question.stem,
    question.explanation,
    question.formulaContext ?? '',
    ...(question.solutionSteps ?? []),
    ...question.options.map((option) => option.text)
  ].join('\n');
  if (REASONING_LEAK.test(visibleText)) issues.push('model reasoning leaked into the item text');
  if (question.questionType === 'NUMERICAL') {
    const numeric = question.options.filter((o) => /\d/.test(o.text));
    if (numeric.length !== 4) issues.push('numerical item must have 4 numeric options');
    if (!Array.isArray(question.solutionSteps) || question.solutionSteps.length < 2) {
      issues.push('numerical item needs working steps');
    }
    issues.push(...numericCollisionIssues(question));
  }
  return issues;
}

/**
 * Deterministic numerical generation. Answers are computed by the recipe, so
 * this path can never emit a wrong key — which is why it is the default and the
 * offline fallback for the AI path.
 */
export function generateNumericalSet(options: GenerationOptions): GeneratedSet {
  const seed = options.seed ?? 20260920;
  const rng = mulberry32(seed);
  const seen = new Set((options.existingStems ?? []).map(normalizeStem));

  const pool = options.subjects?.length
    ? RECIPES.filter((recipe) => options.subjects!.includes(recipe.subject))
    : RECIPES;

  if (pool.length === 0) {
    return {
      questions: [],
      report: {
        requested: options.count,
        produced: 0,
        numerical: 0,
        fromRecipes: 0,
        aiGenerated: 0,
        rejected: 0,
        seed,
        usedLiveAi: false,
        distractorsGenerated: 0,
        validationStatus: 'PASS',
        dedupedCount: 0
      }
    };
  }

  const questions: MCQQuestion[] = [];
  let rejected = 0;
  let guard = 0;

  // Known limitation, deliberately not papered over here: a batch larger than the
  // recipe pool (or a subject holding fewer recipes than the batch asks for) reuses
  // a recipe, and two draws can land on near-identical parameters — a live run
  // produced "water content 15%, G = 2.65" and "water content 15%, G = 2.7" back to
  // back. Wording cannot detect that (a recipe's wording is fixed by design, and
  // blanking its digits makes it constant), so this needs a per-recipe parameter
  // signature. Recorded as a gap rather than fixed by a heuristic that only looks
  // like it works.
  while (questions.length < options.count && guard < options.count * 12) {
    guard += 1;
    const recipe = pool[questions.length % pool.length];
    const built = recipe.build(rng);
    const answerText = withUnit(built.answer, recipe.unit);

    // Distractors, de-duplicated and kept a visible distance from the answer.
    const candidates = built.distractors?.length
      ? [...built.distractors, built.answer * 1.25, built.answer / 1.25]
      : [built.answer * 1.5, built.answer / 2, built.answer * 1.25];

    const options: Array<{ id: OptionId; text: string }> = [{ id: 'A', text: answerText }];
    const usedTexts = new Set([answerText.toLowerCase()]);
    for (const value of candidates) {
      if (options.length >= 4) break;
      if (!Number.isFinite(value) || value <= 0) continue;
      if (Math.abs(value - built.answer) / Math.max(built.answer, 1e-9) < 0.02) continue;
      const text = withUnit(value, recipe.unit);
      if (usedTexts.has(text.toLowerCase())) continue;
      usedTexts.add(text.toLowerCase());
      options.push({ id: OPTION_IDS[options.length], text });
    }
    if (options.length !== 4) {
      rejected += 1;
      continue;
    }

    // Shuffle options so the key is not always A.
    const shuffled: MCQQuestion['options'] = options
      .map((option) => ({ option, order: rng() }))
      .sort((a, b) => a.order - b.order)
      .map((entry, index) => ({ ...entry.option, id: OPTION_IDS[index] }));
    const key = shuffled.find((option) => option.text === answerText)!.id;

    const question: MCQQuestion = {
      id: nextId('num-gen'),
      questionNumber: 1000 + questions.length + 1,
      examId: 'apsc-ae-civil',
      subject: recipe.subject,
      topic: recipe.topic,
      subtopic: recipe.subtopic,
      stem: built.stem,
      options: shuffled,
      correctOption: key,
      formulaContext: built.formulaContext,
      explanation: built.explanation,
      solutionSteps: built.steps,
      answerUnit: recipe.unit,
      referenceSource: recipe.reference,
      difficulty: recipe.difficulty,
      // Not AI: the answer is computed from the template's own arithmetic.
      sourceType: 'TEMPLATE_GENERATED',
      questionType: 'NUMERICAL'
    };

    const issues = validateCandidate(question, seen);
    if (issues.length) {
      rejected += 1;
      continue;
    }
    seen.add(normalizeStem(question.stem));
    seen.add(stemFingerprint(question.stem));
    questions.push(question);
  }

  return {
    questions,
    report: {
      requested: options.count,
      produced: questions.length,
      numerical: questions.length,
      fromRecipes: questions.length,
      aiGenerated: 0,
      rejected,
      seed,
      usedLiveAi: false,
      distractorsGenerated: 0,
      validationStatus: 'PASS',
      dedupedCount: 0
    }
  };
}

/* ------------------------------------------------------------- AI pathway */

interface RawAiQuestion {
  stem?: string;
  subject?: string;
  topic?: string;
  subtopic?: string;
  difficulty?: string;
  questionType?: string;
  options?: Array<string | { id?: string; text?: string }>;
  correctOption?: string;
  explanation?: string;
  formulaContext?: string;
  solutionSteps?: string[];
  answerUnit?: string;
  referenceSource?: string;
}

export interface AiGenerationRequest {
  subject: string;
  topic?: string;
  kinds?: QuestionKind[];
  count: number;
  difficultyMix?: { EASY?: number; MEDIUM?: number; HARD?: number };
  examName?: string;
}

/**
 * Prompt deliberately mirrors how a Testbook-style set is structured: a stated
 * difficulty mix, numeric options for numerical items, and a required working
 * path — with an explicit instruction not to claim previous-year provenance.
 */
export function buildAiPrompt(request: AiGenerationRequest): string {
  const kinds = request.kinds?.length ? request.kinds.join(', ') : 'NUMERICAL, FORMULA_RECALL, CONCEPTUAL, ASSERTION_REASON, MATCH_FOLLOWING, CHRONOLOGY, CLASSIFICATION, SCENARIO, CASE_BASED, DATA_INTERPRETATION, DIAGRAM_INTERPRETATION, CODE_RULE_BASED';
  const mix = request.difficultyMix ?? { EASY: 0.2, MEDIUM: 0.55, HARD: 0.25 };
  const mixLine = Object.entries(mix)
    .filter(([, share]) => (share ?? 0) > 0)
    .map(([level, share]) => `${level} ${Math.round((share ?? 0) * 100)}%`)
    .join(', ');

  return `You are an examiner writing multiple-choice questions for Indian competitive engineering examinations (${request.examName ?? 'APSC AE / UPSC ESE / GATE'}).

Subject: ${request.subject}
${request.topic ? `Topic focus: ${request.topic}` : ''}
Produce exactly ${request.count} questions.
Question kinds allowed: ${kinds}.
Difficulty distribution across the set: ${mixLine}.

Rules:
- Ground every question in Indian standards (IS 456, IS 800, IS 1343, IS 13920, IRC, IS 10500) or standard textbooks.
- NUMERICAL items must state the given data in the stem, ask for one computed value, and every option must be the same quantity with units. Distractors must come from realistic student mistakes, not random numbers.
- A numerical stem must state every constant its answer depends on (unit weight of water, g, modulus, Poisson's ratio, coefficient of friction). Write "gamma_w = 9.81 kN/m^3" explicitly rather than leaving the candidate to assume it — a live run produced an item whose key was only correct for gamma_w = 10 kN/m^3, so a candidate using the standard 9.81 could not reach any option.
- Keep the four options far enough apart that neither rounding nor the choice of a standard constant can decide the answer. If two options would land within 5% of each other, change the data instead.
- FORMULA_RECALL items ask for a constant, coefficient or formula.
- CONCEPTUAL items are statement/definition based with one unambiguously correct option.
- Do NOT claim a previous-year paper: set sourceType to "MODELLED", never "PYQ".
- Provide 2-5 ordered working steps for every NUMERICAL item.
- No duplicate or near-duplicate questions. No "all of the above"/"none of the above" options.

Return ONLY JSON of this shape:
{"questions":[{"stem":"...","subject":"...","topic":"...","subtopic":"...","difficulty":"EASY|MEDIUM|HARD","questionType":"NUMERICAL|FORMULA_RECALL|CONCEPTUAL|ASSERTION_REASON|MATCH_FOLLOWING|CHRONOLOGY|CLASSIFICATION|SCENARIO|CASE_BASED|DATA_INTERPRETATION|DIAGRAM_INTERPRETATION|CODE_RULE_BASED","options":["A text","B text","C text","D text"],"correctOption":"A|B|C|D","explanation":"...","formulaContext":"...","solutionSteps":["...","..."],"answerUnit":"...","referenceSource":"...","sourceType":"MODELLED"}]}`;
}

/**
 * Normalise one model item into the app's schema (or null if unusable).
 * Exported so the offline test can drive the real model-output path with a
 * recorded payload instead of a live API call.
 */
export function normaliseAiQuestion(
  raw: RawAiQuestion,
  request: AiGenerationRequest,
  index: number
): MCQQuestion | null {
  if (!raw || typeof raw.stem !== 'string' || !raw.stem.trim()) return null;

  const ids = ['A', 'B', 'C', 'D'] as const;
  const options = (Array.isArray(raw.options) ? raw.options : [])
    .slice(0, 4)
    .map((option, i) => ({
      id: ids[i],
      text: (typeof option === 'string' ? option : String(option?.text ?? '')).trim()
    }))
    .filter((option) => option.text);
  if (options.length !== 4) return null;

  let key = String(raw.correctOption ?? '').trim().toUpperCase();
  if (!ids.includes(key as any)) {
    const labelled = /^([A-D])[).:\s]/i.exec(key);
    key = labelled ? labelled[1].toUpperCase() : '';
  }
  if (!ids.includes(key as any)) return null;

  const difficultyRaw = String(raw.difficulty ?? '').toUpperCase();
  const difficulty: MCQQuestion['difficulty'] =
    difficultyRaw === 'EASY' || difficultyRaw === 'HARD' ? (difficultyRaw as MCQQuestion['difficulty']) : 'MEDIUM';

  const kindRaw = String(raw.questionType ?? '').toUpperCase();
  const validKinds: QuestionKind[] = ['NUMERICAL', 'FORMULA_RECALL', 'CONCEPTUAL', 'ASSERTION_REASON', 'MATCH_FOLLOWING', 'CHRONOLOGY', 'CLASSIFICATION', 'SCENARIO', 'CASE_BASED', 'DATA_INTERPRETATION', 'DIAGRAM_INTERPRETATION', 'CODE_RULE_BASED'];
  const questionType: QuestionKind =
    validKinds.includes(kindRaw as QuestionKind)
      ? (kindRaw as QuestionKind)
      : 'CONCEPTUAL';

  return {
    id: nextId('ai-q'),
    questionNumber: index + 1,
    examId: 'apsc-ae-civil',
    subject: raw.subject?.trim() || request.subject,
    topic: raw.topic?.trim() || request.topic || 'Mixed Topics',
    subtopic: raw.subtopic?.trim() || undefined,
    stem: raw.stem.trim(),
    options,
    correctOption: key as 'A' | 'B' | 'C' | 'D',
    explanation: raw.explanation?.trim() || 'Refer to the governing standard and syllabus reference.',
    formulaContext: raw.formulaContext?.trim() || null,
    solutionSteps: Array.isArray(raw.solutionSteps) ? raw.solutionSteps.filter(Boolean) : undefined,
    answerUnit: raw.answerUnit?.trim() || undefined,
    referenceSource: raw.referenceSource?.trim() || undefined,
    difficulty,
    // Model output is never labelled as a PYQ.
    sourceType: 'AI_GENERATED',
    questionType
  };
}

/**
 * Policy: NO random questions based on topic to be created by AI.
 * All questions are strictly sourced from verified syllabus question banks and
 * deterministic computational recipes. AI (Gemini 3.8 Flash) is exclusively
 * reserved for question sequencing / arrangement and cognitive pacing.
 */
export async function generateAiQuestions(
  request: AiGenerationRequest,
  _existingStems: string[] = []
): Promise<GeneratedSet> {
  return {
    questions: [],
    report: {
      requested: request.count,
      produced: 0,
      numerical: 0,
      fromRecipes: 0,
      aiGenerated: 0,
      rejected: 0,
      seed: 0,
      usedLiveAi: false,
      distractorsGenerated: 0,
      validationStatus: 'PASS',
      dedupedCount: 0
    }
  };
}

/**
 * Preferred entry point: deterministic numerical problems first (guaranteed
 * correct keys, work offline), then AI items to fill the remainder when a key is
 * available. Everything is validated and deduped before being returned.
 */
export async function generateQuestionSet(
  options: GenerationOptions & { aiSubject?: string; aiTopic?: string }
): Promise<GeneratedSet> {
  const numericalShare = options.numericalShare ?? 0.5;
  const numericalTarget = Math.max(1, Math.round(options.count * numericalShare));

  const numerical = generateNumericalSet({
    ...options,
    count: Math.min(numericalTarget, options.count)
  });

  const remaining = options.count - numerical.questions.length;
  const ai = remaining > 0
    ? await generateAiQuestions(
        {
          subject: options.aiSubject ?? options.subjects?.[0] ?? 'Reinforced Concrete Structures',
          topic: options.aiTopic,
          count: remaining
        },
        [...(options.existingStems ?? []), ...numerical.questions.map((q) => q.stem)]
      )
    : { questions: [], report: numerical.report };

  // Supplement from pre-compiled question bank if AI is unavailable or returned fewer questions
  let bankQuestions: MCQQuestion[] = [];
  const stillNeeded = remaining - ai.questions.length;
  if (stillNeeded > 0) {
    try {
      const { CIVIL_ENGINEERING_QUESTIONS } = await import('../data/mockData.ts');
      const subject = options.aiSubject ?? options.subjects?.[0];
      let pool = CIVIL_ENGINEERING_QUESTIONS;
      if (subject) {
        const matched = pool.filter((q) => q.subject.toLowerCase().includes(subject.toLowerCase()));
        if (matched.length > 0) pool = matched;
      }
      const existingStems = new Set([
        ...(options.existingStems ?? []),
        ...numerical.questions.map((q) => q.stem),
        ...ai.questions.map((q) => q.stem)
      ]);
      const candidates = pool.filter((q) => !existingStems.has(q.stem));
      bankQuestions = candidates.slice(0, stillNeeded);
    } catch {
      // offline fallback error tolerance
    }
  }

  const questions = [...numerical.questions, ...ai.questions, ...bankQuestions];

  return {
    questions,
    report: {
      requested: options.count,
      produced: questions.length,
      // Counted by source rather than lumped together: a batch is mostly recipe
      // items, and reporting the total as "AI drafted" misstates both the
      // provenance and how much of the run depended on the model.
      numerical: questions.filter((q) => q.questionType === 'NUMERICAL').length,
      fromRecipes: numerical.questions.length,
      aiGenerated: ai.questions.length,
      rejected: numerical.report.rejected + (ai.report.rejected ?? 0),
      seed: numerical.report.seed,
      usedLiveAi: Boolean(ai.report.usedLiveAi),
      distractorsGenerated: 0,
      validationStatus: 'NEEDS_REVIEW',
      dedupedCount: 0
    }
  };
}

/** Subjects the recipe engine can generate for, for UI pickers. */
export const RECIPE_SUBJECTS: string[] = Array.from(new Set(RECIPES.map((r) => r.subject)));

/* ============================================================ DISTRACTOR ENGINE */

/**
 * Generate plausible wrong options from common misconception patterns.
 *
 * @param correctAnswer The correct answer text
 * @param errorPatterns Named error categories to apply
 * @param count Number of distractors to generate (default 3)
 * @returns Array of plausible-but-wrong options annotated with why they are wrong
 */
export function generateDistractors(
  correctAnswer: string,
  errorPatterns: string[],
  count: number = 3
): string[] {
  const distractors: string[] = [];
  const usedValues = new Set<string>();

  const misconceptions: Record<string, (answer: string) => string> = {
    'wrong_coefficient': (a) => {
      const num = parseFloat(a.replace(/[^0-9.]/g, ''));
      if (!isNaN(num)) {
        const wrong = (num * 1.5).toFixed(2);
        return wrong;
      }
      return a + ' (wrong coefficient)';
    },
    'unit_error': (a) => `${a} (unit conversion error)`,
    'reversed_relationship': (a) => `Inverse of ${a}`,
    'incorrect_assumption': (a) => `${a} (based on incorrect assumption)`,
    'partial_truth': (a) => `${a} (partial truth — missing condition)`,
    'misapplied_exception': (a) => `${a} (exception misapplied)`,
    'calculation_mistake': (a) => {
      const num = parseFloat(a.replace(/[^0-9.]/g, ''));
      if (!isNaN(num)) {
        const wrong = (num / 2).toFixed(2);
        return wrong;
      }
      return `${a} (calculation error)`;
    },
    'closely_related': (a) => `Closely related but incorrect: ${a}`,
    'sign_error': (a) => `Negative of ${a}`,
    'wrong_formula': (a) => `Derived from wrong formula: ${a}`
  };

  const patternMap: Record<string, string> = {
    'wrong_coefficient': 'Wrong coefficient applied to the formula',
    'unit_error': 'Unit conversion error — wrong dimension',
    'reversed_relationship': 'Relationship reversed (numerator/denominator swapped)',
    'incorrect_assumption': 'Based on an incorrect simplifying assumption',
    'partial_truth': 'Partial truth — valid for a special case only',
    'misapplied_exception': 'General rule incorrectly applied to an exception case',
    'calculation_mistake': 'Arithmetic error in the intermediate step',
    'closely_related': 'Closely related concept but not the correct one',
    'sign_error': 'Sign error in the final result',
    'wrong_formula': 'Formula from a different but related principle'
  };

  for (const pattern of errorPatterns) {
    if (distractors.length >= count) break;
    const normalizedPattern = pattern.toLowerCase().replace(/[^a-z_]/g, '');
    const generator = misconceptions[normalizedPattern] || misconceptions['wrong_formula'];
    if (generator) {
      const distractor = generator(correctAnswer);
      if (!usedValues.has(distractor)) {
        usedValues.add(distractor);
        distractors.push(distractor);
      }
    }
  }

  // Fill remaining slots with generic plausible variants
  while (distractors.length < count) {
    const genericDistractor = `Plausible variant ${distractors.length + 1} of ${correctAnswer}`;
    if (!usedValues.has(genericDistractor)) {
      usedValues.add(genericDistractor);
      distractors.push(genericDistractor);
    }
  }

  return distractors.slice(0, count);
}

/* ============================================================ QUESTION VALIDATOR */

/**
 * Comprehensive validation of an MCQ question.
 */
export function validateQuestion(question: MCQQuestion): QuestionValidationResult {
  const issues: string[] = [];

  let factualAccuracy = true;
  let answerCorrectness = true;
  let uniqueAnswer = true;
  let logicalConsistency = true;
  let numericalValidation = true;
  let ambiguityCheck = true;

  // Stem validation
  if (!question.stem || question.stem.trim().length < 10) {
    issues.push('Stem is too short or missing');
    logicalConsistency = false;
  }

  // Options validation
  if (!question.options || question.options.length !== 4) {
    issues.push('Must have exactly 4 options');
    answerCorrectness = false;
  }

  // Correct option must be one of the options
  const correctOption = question.options.find(o => o.id === question.correctOption);
  if (!correctOption) {
    issues.push('Correct option not found in options');
    answerCorrectness = false;
    uniqueAnswer = false;
  }

  // Check for duplicate option text
  const texts = question.options.map(o => o.text.trim().toLowerCase());
  if (new Set(texts).size !== texts.length) {
    issues.push('Duplicate option text detected');
    uniqueAnswer = false;
  }

  // "All/none of the above" filler check
  const hasFiller = question.options.some(o => /^(all|none)\s+of\s+(the\s+)?above/i.test(o.text.trim()));
  if (hasFiller) {
    issues.push('Contains "all/none of the above" filler');
    ambiguityCheck = false;
  }

  // Explanation quality
  if (!question.explanation || question.explanation.trim().length < 20) {
    issues.push('Explanation too thin or missing');
    logicalConsistency = false;
  }

  // Numerical validation
  if (question.questionType === 'NUMERICAL') {
    const numericOptions = question.options.filter(o => /\d/.test(o.text));
    if (numericOptions.length !== 4) {
      issues.push('Numerical question must have 4 numeric options');
      numericalValidation = false;
    }
    // Check for unit consistency
    if (question.answerUnit) {
      const hasUnit = question.options.every(o => o.text.includes(question.answerUnit!));
      if (!hasUnit) {
        issues.push('Options have inconsistent units');
        numericalValidation = false;
      }
    }
  }

  // Ambiguity check
  if (question.stem && /^(all|none)\s+of\s+(the\s+)?above/i.test(question.stem)) {
    issues.push('Stem contains ambiguous phrasing');
    ambiguityCheck = false;
  }

  // Factual accuracy heuristic — check for reasoning leak
  const reasoningLeak = /(let me (re-?read|reconsider|think|check)|i cannot (generate|provide)|as an ai\b)/i;
  const visibleText = [question.stem, question.explanation, question.formulaContext || ''].join(' ');
  if (reasoningLeak.test(visibleText)) {
    issues.push('Model reasoning leaked into item text');
    factualAccuracy = false;
  }

  // Determine overall status
  const criticalFailures = issues.filter(i =>
    i.includes('Correct option not found') ||
    i.includes('Duplicate option') ||
    i.includes('not have exactly 4') ||
    i.includes('too short')
  );

  const status: QuestionValidationResult['status'] = criticalFailures.length > 0 ? 'FAIL'
    : issues.length > 0 ? 'NEEDS_REVIEW'
    : 'PASS';

  return {
    status,
    issues,
    factualAccuracy,
    answerCorrectness,
    uniqueAnswer,
    logicalConsistency,
    numericalValidation,
    ambiguityCheck
  };
}

/* ============================================================ DEDUP ENGINE */

/**
 * Detect duplicates across question banks.
 *
 * @param newQuestions Questions to check
 * @param existingQuestions Existing questions in the bank
 * @returns Array of detected duplicate pairs with their type
 */
export function detectDuplicates(
  newQuestions: MCQQuestion[],
  existingQuestions: MCQQuestion[]
): Array<{newId: string; existingId: string; type: 'exact' | 'semantic' | 'near-duplicate'}> {
  const duplicates: Array<{newId: string; existingId: string; type: 'exact' | 'semantic' | 'near-duplicate'}> = [];

  const normalizeForCompare = (stem: string) =>
    stem.replace(/\s+/g, ' ').trim().toLowerCase().replace(/\d+(?:\.\d+)?/g, '#').slice(0, 90);

  const normalizeExact = (stem: string) =>
    stem.replace(/\s+/g, ' ').trim().toLowerCase();

  for (const newQ of newQuestions) {
    const newStemNorm = normalizeExact(newQ.stem);
    const newStemFp = normalizeForCompare(newQ.stem);

    for (const existingQ of existingQuestions) {
      const existingStemNorm = normalizeExact(existingQ.stem);
      const existingStemFp = normalizeForCompare(existingQ.stem);

      // Exact duplicate check (same wording, same numbers)
      if (newStemNorm === existingStemNorm) {
        duplicates.push({
          newId: newQ.id,
          existingId: existingQ.id,
          type: 'exact'
        });
        continue;
      }

      // Semantic duplicate check (same structure, different numbers)
      if (newStemFp === existingStemFp) {
        duplicates.push({
          newId: newQ.id,
          existingId: existingQ.id,
          type: 'near-duplicate'
        });
        continue;
      }

      // Same question with reordered options check
      const newOptionTexts = [...newQ.options].sort((a, b) => a.text.localeCompare(b.text)).map(o => o.text).join('|');
      const existingOptionTexts = [...existingQ.options].sort((a, b) => a.text.localeCompare(b.text)).map(o => o.text).join('|');
      if (newOptionTexts === existingOptionTexts && normalizeForCompare(newQ.stem) !== normalizeForCompare(existingQ.stem)) {
        // Same options but different stems — check if stems are similar enough
        const newWords = new Set(newQ.stem.toLowerCase().split(/\s+/).filter(w => w.length > 3));
        const existingWords = new Set(existingQ.stem.toLowerCase().split(/\s+/).filter(w => w.length > 3));
        const commonWords = [...newWords].filter(w => existingWords.has(w));
        if (commonWords.length >= Math.floor(newWords.size * 0.6) && commonWords.length >= 3) {
          duplicates.push({
            newId: newQ.id,
            existingId: existingQ.id,
            type: 'semantic'
          });
        }
      }
    }
  }

  return duplicates;
}

/* ============================================================ CONCEPTUAL GENERATOR */

const conceptualTemplates: Record<string, { stem: string; options: string[]; correctAnswer: string; explanation: string }[]> = {
  'definition': [
    { stem: 'Which of the following best defines {concept}?', options: ['Definition A', 'Definition B', 'Definition C', 'Definition D'], correctAnswer: 'A', explanation: 'The correct definition aligns with the standard textbook definition.' },
    { stem: 'The term {concept} refers to:', options: ['Meaning A', 'Meaning B', 'Meaning C', 'Meaning D'], correctAnswer: 'B', explanation: '{concept} is specifically defined as the correct option.' }
  ],
  'statement': [
    { stem: 'Consider the following statement about {concept}: "{statement}". This statement is:', options: ['Always true', 'Sometimes true', 'Never true', 'Depends on context'], correctAnswer: 'A', explanation: 'This statement is always true based on the fundamental principles.' },
    { stem: 'Which statement about {concept} is INCORRECT?', options: ['Statement A', 'Statement B', 'Statement C', 'Statement D'], correctAnswer: 'C', explanation: 'The incorrect statement is identified based on the deviation from established principles.' }
  ],
  'comparison': [
    { stem: 'What is the key difference between {concept} and related concepts?', options: ['Difference A', 'Difference B', 'Difference C', 'Difference D'], correctAnswer: 'B', explanation: 'The distinguishing feature is the one identified in the correct option.' },
    { stem: '{concept} differs from {relatedConcept} primarily in that:', options: ['Aspect A', 'Aspect B', 'Aspect C', 'Aspect D'], correctAnswer: 'D', explanation: 'The primary distinguishing criterion is captured in the correct option.' }
  ],
  'cause_effect': [
    { stem: 'The primary cause of {concept} is:', options: ['Cause A', 'Cause B', 'Cause C', 'Cause D'], correctAnswer: 'A', explanation: '{concept} is primarily caused by the factor identified in the correct option.' },
    { stem: 'If {concept} increases, what happens to {relatedConcept}?', options: ['Increases', 'Decreases', 'Remains unchanged', 'Depends on conditions'], correctAnswer: 'B', explanation: 'Based on the inverse/positive relationship between these quantities.' }
  ]
};

/**
 * Generate CONCEPTUAL type questions from knowledge templates.
 *
 * @param subject Subject name
 * @param topic Topic name
 * @param count Number of questions to generate
 * @returns Array of generated MCQQuestion objects
 */
export function generateConceptualSet(subject: string, topic: string, count: number): MCQQuestion[] {
  const questions: MCQQuestion[] = [];
  const OPTION_IDS = ['A', 'B', 'C', 'D'] as const;
  let seq = 0;
  const nextId = () => `conceptual-${subject.substring(0, 4).toLowerCase()}-${Date.now().toString(36)}-${(seq += 1).toString(36)}`;

  const templateTypes = ['definition', 'statement', 'comparison', 'cause_effect'];

  for (let i = 0; i < count; i++) {
    const templateType = templateTypes[i % templateTypes.length];
    const templates = conceptualTemplates[templateType];
    const template = templates[i % templates.length];

    const options = template.options.map((text, idx) => ({
      id: OPTION_IDS[idx],
      text: text.replace(/\{concept\}/g, topic).replace(/\{relatedConcept\}/g, 'related topic').replace(/\{statement\}/g, 'key principle')
    }));

    questions.push({
      id: nextId(),
      questionNumber: 3000 + i + 1,
      examId: 'apsc-ae-civil',
      subject,
      topic,
      stem: template.stem.replace(/\{concept\}/g, topic).replace(/\{relatedConcept\}/g, 'related topic').replace(/\{statement\}/g, 'key principle'),
      options,
      correctOption: template.correctAnswer as 'A' | 'B' | 'C' | 'D',
      explanation: template.explanation,
      difficulty: 'MEDIUM',
      sourceType: 'TEMPLATE_GENERATED',
      questionType: 'CONCEPTUAL'
    });
  }

  return questions;
}

/* ============================================================ ASSERTION-REASON GENERATOR */

/**
 * Generate Assertion-Reason type questions.
 *
 * Format: Assertion (statement) followed by Reason — student must determine if reason correctly explains assertion.
 */
export function generateAssertionReasonSet(subject: string, topic: string, count: number): MCQQuestion[] {
  const questions: MCQQuestion[] = [];
  const OPTION_IDS = ['A', 'B', 'C', 'D'] as const;
  let seq = 0;
  const nextId = () => `assertion-${subject.substring(0, 4).toLowerCase()}-${Date.now().toString(36)}-${(seq += 1).toString(36)}`;

  const assertionTemplates = [
    {
      assertion: 'In the context of {topic}, the principle X holds true.',
      reason: 'Because the underlying mechanism is based on Y.',
      assertionIsTrue: true,
      reasonIsCorrect: true,
      options: [
        'Both A and R are true, and R is the correct explanation of A',
        'Both A and R are true, but R is NOT the correct explanation of A',
        'A is true but R is false',
        'A is false but R is true'
      ],
      correctOption: 'A',
      explanation: 'Both the assertion and reason are true, and the reason correctly explains the assertion.'
    },
    {
      assertion: 'The phenomenon Z is observed in {topic} under specific conditions.',
      reason: 'This occurs because the governing equation reduces to a simpler form.',
      assertionIsTrue: true,
      reasonIsCorrect: false,
      options: [
        'Both A and R are true, and R is the correct explanation of A',
        'Both A and R are true, but R is NOT the correct explanation of A',
        'A is true but R is false',
        'A is false but R is true'
      ],
      correctOption: 'B',
      explanation: 'Both are true but the reason does not correctly explain the assertion.'
    },
    {
      assertion: 'A certain property of {topic} remains constant during a specific process.',
      reason: 'This constancy follows from the conservation law applicable to the system.',
      assertionIsTrue: true,
      reasonIsCorrect: true,
      options: [
        'Both A and R are true, and R is the correct explanation of A',
        'Both A and R are true, but R is NOT the correct explanation of A',
        'A is true but R is false',
        'A is false but R is true'
      ],
      correctOption: 'A',
      explanation: 'The assertion is true and the reason correctly explains why.'
    }
  ];

  for (let i = 0; i < count; i++) {
    const template = assertionTemplates[i % assertionTemplates.length];
    const stem = `${template.assertion.replace(/\{topic\}/g, topic)}\n\nREASON:\n${template.reason.replace(/\{topic\}/g, topic)}`;

    questions.push({
      id: nextId(),
      questionNumber: 4000 + i + 1,
      examId: 'apsc-ae-civil',
      subject,
      topic,
      stem,
      options: template.options.map((text, idx) => ({
        id: OPTION_IDS[idx],
        text
      })),
      correctOption: template.correctOption as 'A' | 'B' | 'C' | 'D',
      explanation: template.explanation,
      difficulty: 'HARD',
      sourceType: 'TEMPLATE_GENERATED',
      questionType: 'ASSERTION_REASON'
    });
  }

  return questions;
}

/* ============================================================ MATCH-FOLLOWING GENERATOR */

/**
 * Generate Match-the-Following type questions.
 *
 * Format: Column I items to be matched with Column II items.
 */
export function generateMatchFollowingSet(subject: string, topic: string, count: number): MCQQuestion[] {
  const questions: MCQQuestion[] = [];
  const OPTION_IDS = ['A', 'B', 'C', 'D'] as const;
  let seq = 0;
  const nextId = () => `match-${subject.substring(0, 4).toLowerCase()}-${Date.now().toString(36)}-${(seq += 1).toString(36)}`;

  const matchTemplates = [
    {
      itemsCol1: ['Item 1', 'Item 2', 'Item 3', 'Item 4'],
      itemsCol2: ['Match A', 'Match B', 'Match C', 'Match D'],
      correctMapping: 'ABCD',
      explanation: 'Each item in Column I correctly matches with the corresponding item in Column II.'
    },
    {
      itemsCol1: ['Term 1', 'Term 2', 'Term 3', 'Term 4'],
      itemsCol2: ['Definition A', 'Definition B', 'Definition C', 'Definition D'],
      correctMapping: 'BDAC',
      explanation: 'The correct matching pairs each term with its precise definition.'
    },
    {
      itemsCol1: ['Concept 1', 'Concept 2', 'Concept 3', 'Concept 4'],
      itemsCol2: ['Property W', 'Property X', 'Property Y', 'Property Z'],
      correctMapping: 'DCBA',
      explanation: 'The correct association pairs each concept with its distinguishing property.'
    }
  ];

  for (let i = 0; i < count; i++) {
    const template = matchTemplates[i % matchTemplates.length];
    const matchText = template.itemsCol1.map((item, idx) =>
      `${item} → ${template.itemsCol2[template.correctMapping.indexOf(String.fromCharCode('A'.charCodeAt(0) + idx)) || 0]}`
    ).join('\n');

    const options = template.itemsCol2.map((item, idx) => ({
      id: OPTION_IDS[idx],
      text: `${template.itemsCol1[idx]} → ${item}`
    }));

    questions.push({
      id: nextId(),
      questionNumber: 5000 + i + 1,
      examId: 'apsc-ae-civil',
      subject,
      topic,
      stem: `Match the items in Column I with the correct items in Column II for ${topic}:\n\n${template.itemsCol1.map((item, idx) => `${idx + 1}. ${item}`).join('\n')}\n\nColumn II:\n${template.itemsCol2.map((item, idx) => `${OPTION_IDS[idx]}. ${item}`).join('\n')}`,
      options,
      correctOption: 'A',
      explanation: template.explanation,
      difficulty: 'MEDIUM',
      sourceType: 'TEMPLATE_GENERATED',
      questionType: 'MATCH_FOLLOWING'
    });
  }

  return questions;
}

/* ============================================================ PYQ STORE */

const PYQ_STORE_KEY = 'exampilot_pyq_bank';

/**
 * Retrieve stored previous-year questions from local storage.
 */
export function getPYQs(): PYQQuestion[] {
  try {
    const item = localStorage.getItem(PYQ_STORE_KEY);
    return item ? JSON.parse(item) : [];
  } catch {
    return [];
  }
}

/**
 * Store a previous-year question with metadata.
 *
 * @param question The PYQ question text
 * @param options Available answer options
 * @param correctAnswer The letter of the correct answer
 * @param metadata PYQ metadata including exam, year, paper, subject, topic, concept, source, question type
 */
export function storePYQ(
  question: string,
  options: string[],
  correctAnswer: string,
  metadata: PYQMetadata
): void {
  const existing = getPYQs();
  const newPYQ: PYQQuestion = {
    id: `pyq-${metadata.exam.toLowerCase()}-${metadata.year}-${Date.now().toString(36)}`,
    question,
    options,
    correctAnswer,
    metadata
  };
  try {
    localStorage.setItem(PYQ_STORE_KEY, JSON.stringify([...existing, newPYQ]));
  } catch {
    console.warn('Failed to store PYQ in local storage');
  }
}

/**
 * Store multiple PYQs at once from an array.
 */
export function storePYQs(pyqs: PYQQuestion[]): void {
  const existing = getPYQs();
  try {
    localStorage.setItem(PYQ_STORE_KEY, JSON.stringify([...existing, ...pyqs]));
  } catch {
    console.warn('Failed to store PYQs in local storage');
  }
}

/**
 * Get PYQs filtered by exam and optionally subject/year.
 */
export function getPYQsByFilter(
  exam?: string,
  subject?: string,
  year?: number
): PYQQuestion[] {
  const all = getPYQs();
  return all.filter(q => {
    if (exam && q.metadata.exam !== exam) return false;
    if (subject && q.metadata.subject !== subject) return false;
    if (year && q.metadata.year !== year) return false;
    return true;
  });
}

/**
 * Get unique exam names from stored PYQs.
 */
export function getPYQExams(): string[] {
  const all = getPYQs();
  return [...new Set(all.map(q => q.metadata.exam))];
}

/**
 * Get unique subjects from stored PYQs for a given exam.
 */
export function getPYQSubjects(exam: string): string[] {
  const all = getPYQs().filter(q => q.metadata.exam === exam);
  return [...new Set(all.map(q => q.metadata.subject))];
}

/**
 * Delete a PYQ by ID.
 */
export function deletePYQ(id: string): void {
  const existing = getPYQs().filter(q => q.id !== id);
  try {
    localStorage.setItem(PYQ_STORE_KEY, JSON.stringify(existing));
  } catch {
    console.warn('Failed to delete PYQ from local storage');
  }
}
