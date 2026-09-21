import type { MCQQuestion } from '../types';

/**
 * Numerical problem bank — Civil Engineering (Paper II).
 *
 * The shipped 100-question civil bank contained **zero** compute-the-answer
 * problems: every item was conceptual or recall, so a student could never drill
 * the skill the real papers actually test. These 42 problems close that gap.
 *
 * Authoring rules followed here:
 * - The stem supplies real data and asks for a computed value.
 * - Options are unit-bearing numbers; distractors come from *plausible student
 *   errors* (wrong coefficient, wrong drainage path, cos vs cos², elastic vs
 *   plastic modulus, forget-the-T-junctions) rather than random numbers.
 * - `solutionSteps` shows the working, so review teaches instead of just scoring.
 * - `answerUnit` is carried separately for the review UI.
 * - Arithmetic is verified; `sourceType` is MODELLED because these are written to
 *   the exam's pattern — they are not verbatim previous-year questions.
 *
 * Difficulty calibration targets an exam-like mix (EASY 8 / MEDIUM 25 / HARD 9)
 * instead of the 84%-EASY profile of the original bank.
 *
 * `scripts/validate-numerical-bank.mjs` re-checks structure and recipe arithmetic.
 */
export const NUMERICAL_CIVIL_QUESTIONS: MCQQuestion[] = [
  /* ================= Reinforced Concrete Structures ================= */
  {
    id: 'num-ce-001',
    questionNumber: 201,
    examId: 'apsc-ae-civil',
    subject: 'Reinforced Concrete Structures',
    topic: 'Limit State Design — Flexure',
    subtopic: 'Limiting Moment of Resistance',
    stem: 'A singly reinforced rectangular beam of width 300 mm and effective depth 500 mm is cast with M20 concrete and Fe 415 steel. Determine its limiting moment of resistance.',
    options: [
      { id: 'A', text: '172.5 kN·m' },
      { id: 'B', text: '207.0 kN·m' },
      { id: 'C', text: '240.0 kN·m' },
      { id: 'D', text: '155.3 kN·m' }
    ],
    correctOption: 'B',
    formulaContext: 'M_u,lim = 0.138 · f_ck · b · d²  (Fe 415)',
    explanation: 'For Fe 415 the limiting moment coefficient is 0.138, giving M_u,lim = 0.138 × 20 × 300 × 500² = 207 kN·m. Options A and C use wrong limiting coefficients; D corresponds to Fe 500 (0.133).',
    solutionSteps: [
      'Step 1 — Identify the coefficient: for Fe 415, M_u,lim = 0.138 · f_ck · b · d².',
      'Step 2 — Substitute: M_u,lim = 0.138 × 20 × 300 × (500)² N·mm.',
      'Step 3 — (500)² = 250,000 mm². So M_u,lim = 0.138 × 20 × 300 × 250,000 = 207 × 10⁶ N·mm.',
      'Step 4 — Convert: 207 × 10⁶ N·mm = 207 kN·m.'
    ],
    answerUnit: 'kN·m',
    referenceSource: 'IS 456:2000, Cl. 38.1 & Annex G',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-ce-002',
    questionNumber: 202,
    examId: 'apsc-ae-civil',
    subject: 'Reinforced Concrete Structures',
    topic: 'Limit State Design — Shear',
    subtopic: 'Nominal Shear Stress',
    stem: 'A beam section 250 mm wide and 450 mm effective deep carries a factored shear force of 150 kN. Calculate the nominal shear stress τ_v.',
    options: [
      { id: 'A', text: '1.33 MPa' },
      { id: 'B', text: '2.67 MPa' },
      { id: 'C', text: '1.20 MPa' },
      { id: 'D', text: '0.67 MPa' }
    ],
    correctOption: 'A',
    formulaContext: 'τ_v = V_u / (b · d)',
    explanation: 'τ_v = 150 × 10³ / (250 × 450) = 1.33 N/mm². Option C uses overall depth 500 mm; B and D are halving/doubling errors in the denominator.',
    solutionSteps: [
      'Step 1 — Formula: τ_v = V_u / (b · d), with V_u in newtons.',
      'Step 2 — Denominator: 250 × 450 = 112,500 mm².',
      'Step 3 — τ_v = 150,000 / 112,500 = 1.333 N/mm² = 1.33 MPa.'
    ],
    answerUnit: 'MPa',
    referenceSource: 'IS 456:2000, Cl. 40.1',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-ce-003',
    questionNumber: 203,
    examId: 'apsc-ae-civil',
    subject: 'Reinforced Concrete Structures',
    topic: 'Bond, Anchorage & Development Length',
    subtopic: 'Development Length of a Deformed Bar',
    stem: 'A 16 mm diameter Fe 415 deformed bar in tension is embedded in M20 concrete. Using τ_bd = 1.2 × 1.6 N/mm² for deformed bars in tension, compute the development length required.',
    options: [
      { id: 'A', text: '376 mm' },
      { id: 'B', text: '564 mm' },
      { id: 'C', text: '752 mm' },
      { id: 'D', text: '1504 mm' }
    ],
    correctOption: 'C',
    formulaContext: 'L_d = φ · σ_s / (4 · τ_bd),  σ_s = 0.87 f_y',
    explanation: 'σ_s = 0.87 × 415 = 361.05 N/mm² and τ_bd = 1.92 N/mm², so L_d = 16 × 361.05 / (4 × 1.92) = 752 mm. Option D doubles the divisor effect by using 2τ_bd; A uses 8τ_bd.',
    solutionSteps: [
      'Step 1 — Stress in the bar: σ_s = 0.87 · f_y = 0.87 × 415 = 361.05 N/mm².',
      'Step 2 — Design bond stress for deformed bars in tension: τ_bd = 1.2 × 1.6 = 1.92 N/mm².',
      'Step 3 — L_d = φ σ_s / (4 τ_bd) = (16 × 361.05) / (4 × 1.92).',
      'Step 4 — Numerator = 5,776.8; denominator = 7.68 → L_d = 752.2 mm ≈ 752 mm.'
    ],
    answerUnit: 'mm',
    referenceSource: 'IS 456:2000, Cl. 26.2.1',
    difficulty: 'HARD',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },

  /* ===================== Structural Analysis ===================== */
  {
    id: 'num-ce-004',
    questionNumber: 204,
    examId: 'apsc-ae-civil',
    subject: 'Structural Analysis',
    topic: 'Three-Hinged and Two-Hinged Arches',
    subtopic: 'Horizontal Thrust in a Parabolic Arch',
    stem: 'A three-hinged parabolic arch of span 40 m with a central rise of 5 m carries a uniformly distributed load of 20 kN/m over the entire span. Calculate the horizontal thrust developed at the supports.',
    options: [
      { id: 'A', text: '400 kN' },
      { id: 'B', text: '800 kN' },
      { id: 'C', text: '200 kN' },
      { id: 'D', text: '1600 kN' }
    ],
    correctOption: 'B',
    formulaContext: 'H = w · L² / (8 · h)',
    explanation: 'For a three-hinged parabolic arch under full-span UDL, bending moment everywhere is zero and H = wL²/(8h) = 20 × 1600 / 40 = 800 kN. Option A uses 16h instead of 8h.',
    solutionSteps: [
      'Step 1 — Formula for full-span UDL on a parabolic arch: H = w L² / (8h).',
      'Step 2 — L² = 40² = 1600 m²; w = 20 kN/m; h = 5 m.',
      'Step 3 — H = (20 × 1600) / (8 × 5) = 32,000 / 40 = 800 kN.'
    ],
    answerUnit: 'kN',
    referenceSource: 'Theory of Structures — Vazirani & Ratwani',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-ce-005',
    questionNumber: 205,
    examId: 'apsc-ae-civil',
    subject: 'Structural Analysis',
    topic: 'Indeterminate Structures — Fixed Beams',
    subtopic: 'Fixed End Moments',
    stem: 'A beam fixed at both ends spans 6 m and carries a uniformly distributed load of 30 kN/m over its whole length. Determine the magnitude of the fixed end moment at each support.',
    options: [
      { id: 'A', text: '67.5 kN·m' },
      { id: 'B', text: '90.0 kN·m' },
      { id: 'C', text: '135.0 kN·m' },
      { id: 'D', text: '180.0 kN·m' }
    ],
    correctOption: 'B',
    formulaContext: 'FEM = w · L² / 12',
    explanation: 'FEM = wL²/12 = 30 × 36 / 12 = 90 kN·m. Option C is the simply-supported mid-span moment wL²/8, a common mix-up.',
    solutionSteps: [
      'Step 1 — For a fixed beam with full UDL, both end moments are hogging and equal: FEM = wL²/12.',
      'Step 2 — L² = 6² = 36 m².',
      'Step 3 — FEM = (30 × 36) / 12 = 1080 / 12 = 90 kN·m.'
    ],
    answerUnit: 'kN·m',
    referenceSource: 'Structural Analysis — Hibbeler',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-ce-006',
    questionNumber: 206,
    examId: 'apsc-ae-civil',
    subject: 'Structural Analysis',
    topic: 'Static and Kinematic Indeterminacy',
    subtopic: 'Degree of Static Indeterminacy',
    stem: 'A plane portal frame consists of 3 members and 4 joints, and is rigidly fixed at both column bases (6 reaction components). Determine its degree of static indeterminacy.',
    options: [
      { id: 'A', text: '0' },
      { id: 'B', text: '1' },
      { id: 'C', text: '3' },
      { id: 'D', text: '6' }
    ],
    correctOption: 'C',
    formulaContext: 'D_s = 3m + r − 3j  (plane frame)',
    explanation: 'D_s = 3(3) + 6 − 3(4) = 15 − 12 = 3. This is the classic fixed-base portal frame result: 3 redundants (one per support moment/tie).',
    solutionSteps: [
      'Step 1 — For a plane frame: D_s = 3m + r − 3j.',
      'Step 2 — m = 3 members, j = 4 joints, r = 6 reactions.',
      'Step 3 — D_s = 3×3 + 6 − 3×4 = 9 + 6 − 12 = 3.'
    ],
    referenceSource: 'Structural Analysis — Hibbeler',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },

  /* ===================== Strength of Materials ===================== */
  {
    id: 'num-ce-007',
    questionNumber: 207,
    examId: 'apsc-ae-civil',
    subject: 'Strength of Materials',
    topic: "Principal Stresses & Mohr's Circle",
    subtopic: 'Radius of Mohr Circle',
    stem: 'At a point in a stressed body, σ_x = 100 MPa, σ_y = 20 MPa and τ_xy = 30 MPa. Calculate the radius of the Mohr circle.',
    options: [
      { id: 'A', text: '30 MPa' },
      { id: 'B', text: '40 MPa' },
      { id: 'C', text: '50 MPa' },
      { id: 'D', text: '70 MPa' }
    ],
    correctOption: 'C',
    formulaContext: 'R = √( ((σ_x − σ_y)/2)² + τ_xy² )',
    explanation: 'R = √(40² + 30²) = 50 MPa. The 3-4-5 triangle makes this a favourite exam item; options A and B are the individual components.',
    solutionSteps: [
      'Step 1 — Centre of the circle: (σ_x + σ_y)/2 = (100 + 20)/2 = 60 MPa.',
      'Step 2 — Half-difference: (σ_x − σ_y)/2 = 80/2 = 40 MPa.',
      'Step 3 — R = √(40² + 30²) = √(1600 + 900) = √2500 = 50 MPa.',
      'Step 4 — Principal stresses would then be 60 ± 50, i.e. 110 MPa and 10 MPa.'
    ],
    answerUnit: 'MPa',
    referenceSource: 'Mechanics of Materials — Gere & Timoshenko',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-ce-008',
    questionNumber: 208,
    examId: 'apsc-ae-civil',
    subject: 'Strength of Materials',
    topic: "Euler's Column Buckling Theory",
    subtopic: 'Effect of End Conditions',
    stem: 'A column with both ends hinged has a critical buckling load of 200 kN. If the same column is re-supported with both ends fixed, what will be its critical load?',
    options: [
      { id: 'A', text: '100 kN' },
      { id: 'B', text: '200 kN' },
      { id: 'C', text: '400 kN' },
      { id: 'D', text: '800 kN' }
    ],
    correctOption: 'D',
    formulaContext: 'P_cr = π²EI / L_eff²,  with L_eff = L/2 for fixed-fixed',
    explanation: 'Fixed-fixed halves the effective length, and P_cr varies inversely as L_eff², so the load multiplies by (2)² = 4 → 800 kN.',
    solutionSteps: [
      'Step 1 — Hinged-hinged: L_eff = L, so P_cr = π²EI/L² = 200 kN.',
      'Step 2 — Fixed-fixed: L_eff = L/2.',
      'Step 3 — P_cr scales as 1/L_eff², a factor of (L / (L/2))² = 4.',
      'Step 4 — New critical load = 4 × 200 = 800 kN.'
    ],
    answerUnit: 'kN',
    referenceSource: 'Strength of Materials — B.C. Punmia',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-ce-009',
    questionNumber: 209,
    examId: 'apsc-ae-civil',
    subject: 'Strength of Materials',
    topic: 'Shear Stress Distribution in Beams',
    subtopic: 'Maximum vs Average Shear Stress',
    stem: 'A rectangular beam section carries an average shear stress of 30 MPa. Determine the maximum shear stress developed in the section.',
    options: [
      { id: 'A', text: '30 MPa' },
      { id: 'B', text: '45 MPa' },
      { id: 'C', text: '60 MPa' },
      { id: 'D', text: '50 MPa' }
    ],
    correctOption: 'B',
    formulaContext: 'τ_max = 1.5 · τ_avg = 1.5 · V/(b·d)  (rectangular section)',
    explanation: 'For a rectangular section the shear stress diagram is parabolic with τ_max = 3V/(2bd) = 1.5 × average. So 1.5 × 30 = 45 MPa.',
    solutionSteps: [
      'Step 1 — Shear stress in a rectangular section is parabolic, zero at the extreme fibres.',
      'Step 2 — Average stress = V/(b·d); maximum occurs at the neutral axis.',
      'Step 3 — τ_max = 1.5 × τ_avg = 1.5 × 30 = 45 MPa.'
    ],
    answerUnit: 'MPa',
    referenceSource: 'Strength of Materials — B.C. Punmia',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },

  /* ===================== Geotechnical Engineering ===================== */
  {
    id: 'num-ce-010',
    questionNumber: 210,
    examId: 'apsc-ae-civil',
    subject: 'Geotechnical Engineering',
    topic: 'Soil Phase Relationships & Index Properties',
    subtopic: 'Void Ratio of a Saturated Soil',
    stem: 'A saturated soil sample has a water content of 25% and a specific gravity of solids of 2.65. Determine its void ratio.',
    options: [
      { id: 'A', text: '0.38' },
      { id: 'B', text: '0.66' },
      { id: 'C', text: '0.94' },
      { id: 'D', text: '1.33' }
    ],
    correctOption: 'B',
    formulaContext: 'S · e = w · G  →  e = w·G/S ; for saturated soil S = 1',
    explanation: 'e = wG/S = 0.25 × 2.65 / 1.0 = 0.6625 ≈ 0.66. A saturated soil cannot have S < 1 used in the denominator by mistake — option C comes from dividing by 0.7.',
    solutionSteps: [
      'Step 1 — Phase relation: S · e = w · G.',
      'Step 2 — Fully saturated: S = 1 → e = w · G.',
      'Step 3 — e = 0.25 × 2.65 = 0.6625 ≈ 0.66.',
      'Step 4 — Check: for G = 2.65 and e = 0.6625, γ_sat ≈ ((2.65 + 0.6625)/1.6625) × 9.81 ≈ 19.5 kN/m³ — realistic.'
    ],
    referenceSource: 'Soil Mechanics — B.C. Punmia',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-ce-011',
    questionNumber: 211,
    examId: 'apsc-ae-civil',
    subject: 'Geotechnical Engineering',
    topic: 'Terzaghi 1D Consolidation & Settlement',
    subtopic: 'Effect of Drainage Path',
    stem: 'A clay layer reached 50% consolidation in 2 years when it could drain from both top and bottom. How long would the same layer take to reach 50% consolidation if drainage were possible from the top only?',
    options: [
      { id: 'A', text: '2 years' },
      { id: 'B', text: '4 years' },
      { id: 'C', text: '8 years' },
      { id: 'D', text: '16 years' }
    ],
    correctOption: 'C',
    formulaContext: 'T_v = c_v · t / d²  →  t ∝ d²',
    explanation: 'The drainage path doubles (d/2 → d), and since t ∝ d² the time becomes 2² = 4 times the original: 4 × 2 = 8 years.',
    solutionSteps: [
      'Step 1 — At the same degree of consolidation, T_v is unchanged.',
      'Step 2 — T_v = c_v t / d², so t ∝ d² (d = drainage path).',
      'Step 3 — Double drainage: d = H/2. Single drainage: d = H — the path doubles.',
      'Step 4 — Time multiplies by 2² = 4 → t = 4 × 2 = 8 years.'
    ],
    answerUnit: 'years',
    referenceSource: 'Theoretical Soil Mechanics — Terzaghi',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-ce-012',
    questionNumber: 212,
    examId: 'apsc-ae-civil',
    subject: 'Geotechnical Engineering',
    topic: 'Lateral Earth Pressure & Bearing Capacity',
    subtopic: 'Terzaghi Bearing Capacity in Clay',
    stem: 'A strip footing rests on a purely cohesive saturated clay with cohesion c = 40 kPa (φ = 0). Determine the net ultimate bearing capacity of the footing as per Terzaghi.',
    options: [
      { id: 'A', text: '114 kPa' },
      { id: 'B', text: '160 kPa' },
      { id: 'C', text: '228 kPa' },
      { id: 'D', text: '342 kPa' }
    ],
    correctOption: 'C',
    formulaContext: 'q_nu = c · N_c  (strip, φ = 0) → N_c = 5.7',
    explanation: 'For φ = 0 the Terzaghi bearing capacity factors are N_c = 5.7, N_q = 1 and N_γ = 0 for a strip footing, so q_nu = 5.7 × 40 = 228 kPa. q_nu excludes the surcharge depth term.',
    solutionSteps: [
      'Step 1 — Terzaghi strip footing: q_nu = c·N_c + γD_f(N_q − 1) + 0.5γBN_γ.',
      'Step 2 — For φ = 0 clay: N_c = 5.7, N_q = 1, N_γ = 0 → surcharge term (N_q − 1) = 0.',
      'Step 3 — q_nu = c · N_c = 40 × 5.7 = 228 kPa.'
    ],
    answerUnit: 'kPa',
    referenceSource: 'Theoretical Soil Mechanics — Terzaghi',
    difficulty: 'HARD',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },

  /* ================== Fluid Mechanics & Hydraulics ================== */
  {
    id: 'num-ce-013',
    questionNumber: 213,
    examId: 'apsc-ae-civil',
    subject: 'Fluid Mechanics & Hydraulics',
    topic: 'Hydrostatic Forces & Centre of Pressure',
    subtopic: 'Centre of Pressure of a Vertical Gate',
    stem: 'A vertical rectangular sluice gate 2 m wide and 3 m high has its top edge exactly at the water surface. Determine the depth of the centre of pressure below the water surface.',
    options: [
      { id: 'A', text: '1.50 m' },
      { id: 'B', text: '2.00 m' },
      { id: 'C', text: '2.50 m' },
      { id: 'D', text: '3.00 m' }
    ],
    correctOption: 'B',
    formulaContext: 'h_cp = h_cg + I_cg / (A · h_cg) ; for a rectangle with one edge at the surface h_cp = 2d/3',
    explanation: 'h_cp = d/2 + d/6 = 2d/3 = 2.0 m. The centre of pressure always lies below the centroid, so 1.5 m (the centroid) is wrong on principle.',
    solutionSteps: [
      'Step 1 — Centroid of the wetted rectangle: h_cg = d/2 = 1.5 m.',
      'Step 2 — I_cg = b·d³/12 = 2 × 27/12 = 4.5 m⁴; area A = 6 m².',
      'Step 3 — h_cp = h_cg + I_cg/(A·h_cg) = 1.5 + 4.5/(6 × 1.5) = 1.5 + 0.5 = 2.0 m.',
      'Step 4 — Shortcut: for a rectangle with one edge at the free surface, h_cp = 2d/3 = 2 m.'
    ],
    answerUnit: 'm',
    referenceSource: 'Fluid Mechanics — R.K. Bansal',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-ce-014',
    questionNumber: 214,
    examId: 'apsc-ae-civil',
    subject: 'Fluid Mechanics & Hydraulics',
    topic: 'Bernoulli Equation, Pipe Friction & Losses',
    subtopic: 'Darcy Friction Factor in Laminar Flow',
    stem: 'Oil flows through a pipe at a Reynolds number of 1600. Calculate the Darcy–Weisbach friction factor for this flow.',
    options: [
      { id: 'A', text: '0.016' },
      { id: 'B', text: '0.040' },
      { id: 'C', text: '0.050' },
      { id: 'D', text: '0.320' }
    ],
    correctOption: 'B',
    formulaContext: 'f = 64 / Re  (laminar, Re < 2000)',
    explanation: 'Laminar flow (Re < 2000) gives f = 64/Re = 64/1600 = 0.04. Option C is the Blasius turbulent result 0.316/Re^0.25, which is invalid at this Reynolds number.',
    solutionSteps: [
      'Step 1 — Check the regime: Re = 1600 < 2000, so the flow is laminar.',
      'Step 2 — For laminar flow the Hagen–Poiseuille result gives f = 64/Re.',
      'Step 3 — f = 64 / 1600 = 0.04.'
    ],
    referenceSource: 'Fluid Mechanics — R.K. Bansal',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-ce-015',
    questionNumber: 215,
    examId: 'apsc-ae-civil',
    subject: 'Fluid Mechanics & Hydraulics',
    topic: 'Open Channel Flow & Hydraulic Jumps',
    subtopic: 'Minimum Specific Energy',
    stem: 'In a rectangular channel the critical depth is 2.0 m. Determine the minimum specific energy of the flow.',
    options: [
      { id: 'A', text: '1.50 m' },
      { id: 'B', text: '2.00 m' },
      { id: 'C', text: '3.00 m' },
      { id: 'D', text: '4.00 m' }
    ],
    correctOption: 'C',
    formulaContext: 'E_min = (3/2) · y_c  (rectangular channel)',
    explanation: 'At critical depth the velocity head equals half the depth, so E_min = y_c + y_c/2 = 1.5 y_c = 3.0 m.',
    solutionSteps: [
      'Step 1 — Specific energy: E = y + V²/2g.',
      'Step 2 — For a rectangular channel at critical flow, V²/2g = y_c/2.',
      'Step 3 — E_min = y_c + y_c/2 = 1.5 × 2.0 = 3.0 m.'
    ],
    answerUnit: 'm',
    referenceSource: 'Flow in Open Channels — K. Subramanya',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },

  /* ==================== Environmental Engineering ==================== */
  {
    id: 'num-ce-016',
    questionNumber: 216,
    examId: 'apsc-ae-civil',
    subject: 'Environmental Engineering',
    topic: 'BOD Kinetics & Biological Wastewater Treatment',
    subtopic: 'Ultimate BOD from 5-Day BOD',
    stem: 'The 5-day BOD of a wastewater sample at 20 °C is 200 mg/L, and it is known that BOD₅ is 68% of the ultimate BOD. Determine the ultimate BOD (L₀).',
    options: [
      { id: 'A', text: '68 mg/L' },
      { id: 'B', text: '136 mg/L' },
      { id: 'C', text: '200 mg/L' },
      { id: 'D', text: '294 mg/L' }
    ],
    correctOption: 'D',
    formulaContext: 'BOD₅ = 0.68 · L₀  →  L₀ = BOD₅ / 0.68',
    explanation: 'L₀ = 200 / 0.68 = 294.1 ≈ 294 mg/L. The ultimate BOD must always exceed the 5-day BOD, which rules out options A, B and C.',
    solutionSteps: [
      'Step 1 — Given: BOD₅ = 200 mg/L = 68% of L₀.',
      'Step 2 — Therefore 0.68 · L₀ = 200.',
      'Step 3 — L₀ = 200 / 0.68 = 294.1 mg/L ≈ 294 mg/L.'
    ],
    answerUnit: 'mg/L',
    referenceSource: 'Wastewater Engineering — Metcalf & Eddy',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-ce-017',
    questionNumber: 217,
    examId: 'apsc-ae-civil',
    subject: 'Environmental Engineering',
    topic: 'Water Treatment: Sedimentation & Filtration',
    subtopic: 'Surface Area of a Sedimentation Tank',
    stem: 'A circular primary sedimentation tank treats 1800 m³/day with an intended surface overflow rate of 30 m³/m²/day. Determine the required diameter of the tank.',
    options: [
      { id: 'A', text: '4.4 m' },
      { id: 'B', text: '8.7 m' },
      { id: 'C', text: '12.4 m' },
      { id: 'D', text: '60.0 m' }
    ],
    correctOption: 'B',
    formulaContext: 'A = Q / overflow rate ;  D = √(4A/π)',
    explanation: 'A = 1800/30 = 60 m², so D = √(4 × 60/π) = 8.74 m ≈ 8.7 m. Option A is the *radius* (√(A/π) = 4.37 m) — the classic slip.',
    solutionSteps: [
      'Step 1 — Surface area from overflow rate: A = Q / SOR = 1800 / 30 = 60 m².',
      'Step 2 — For a circular tank: A = πD²/4.',
      'Step 3 — D² = 4A/π = 240/π = 76.39 → D = 8.74 m ≈ 8.7 m.',
      'Step 4 — Cross-check the trap: √(A/π) = 4.37 m is the radius, not the diameter.'
    ],
    answerUnit: 'm',
    referenceSource: 'Water Supply Engineering — S.K. Garg',
    difficulty: 'HARD',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-ce-018',
    questionNumber: 218,
    examId: 'apsc-ae-civil',
    subject: 'Environmental Engineering',
    topic: 'BOD Kinetics & Biological Wastewater Treatment',
    subtopic: 'First-Order BOD Exertion',
    stem: 'A wastewater has an ultimate BOD of 300 mg/L and a first-order deoxygenation constant k = 0.23 per day (base e at 20 °C). Calculate the BOD exerted in 3 days.',
    options: [
      { id: 'A', text: '100 mg/L' },
      { id: 'B', text: '150 mg/L' },
      { id: 'C', text: '180 mg/L' },
      { id: 'D', text: '210 mg/L' }
    ],
    correctOption: 'B',
    formulaContext: 'BOD_t = L₀ (1 − e^(−k·t))',
    explanation: 'e^(−0.69) = 0.5016, so BOD₃ = 300 × (1 − 0.5016) = 149.5 ≈ 150 mg/L. Note k·t = 0.23 × 3 = 0.69, which is close to ln 2 — half the ultimate BOD is exerted.',
    solutionSteps: [
      'Step 1 — Formula: BOD_t = L₀ (1 − e^(−k t)).',
      'Step 2 — k·t = 0.23 × 3 = 0.69.',
      'Step 3 — e^(−0.69) = 0.5016 → (1 − 0.5016) = 0.4984.',
      'Step 4 — BOD₃ = 300 × 0.4984 = 149.5 ≈ 150 mg/L.'
    ],
    answerUnit: 'mg/L',
    referenceSource: 'Wastewater Engineering — Metcalf & Eddy',
    difficulty: 'HARD',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },

  /* ===================== Surveying & Geomatics ===================== */
  {
    id: 'num-ce-019',
    questionNumber: 219,
    examId: 'apsc-ae-civil',
    subject: 'Surveying & Geomatics',
    topic: 'Fundamental Principles & Differential Levelling',
    subtopic: 'Curvature and Refraction Correction',
    stem: 'A levelling staff is held 2 km away from the instrument. Determine the combined correction for curvature and refraction that must be applied to the observed staff reading.',
    options: [
      { id: 'A', text: '0.067 m' },
      { id: 'B', text: '0.134 m' },
      { id: 'C', text: '0.269 m' },
      { id: 'D', text: '0.538 m' }
    ],
    correctOption: 'C',
    formulaContext: 'C_cr = 0.0673 · d²   (d in km, result in m)',
    explanation: 'C_cr = 0.0673 × 2² = 0.269 m, and the correction is subtractive. Curvature alone would be 0.0785d² = 0.314 m before applying the refraction allowance of 1/7.',
    solutionSteps: [
      'Step 1 — Curvature correction C_c = 0.0785 d² = 0.0785 × 4 = 0.314 m.',
      'Step 2 — Refraction correction is 1/7 of curvature and opposite in effect: C_r = 0.314/7 = 0.0449 m.',
      'Step 3 — Combined correction C_cr = C_c − C_r = 0.269 m ≈ 0.0673 d².',
      'Step 4 — Apply it as negative to the observed reading.'
    ],
    answerUnit: 'm',
    referenceSource: 'Surveying Vol. I — B.C. Punmia',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-ce-020',
    questionNumber: 220,
    examId: 'apsc-ae-civil',
    subject: 'Surveying & Geomatics',
    topic: 'Curves, Tacheometry & Total Station',
    subtopic: 'Radius of a Simple Curve',
    stem: 'A simple circular curve is designated as a 3° curve on the basis of a 30 m chord. Determine its radius.',
    options: [
      { id: 'A', text: '191 m' },
      { id: 'B', text: '286 m' },
      { id: 'C', text: '573 m' },
      { id: 'D', text: '1146 m' }
    ],
    correctOption: 'C',
    formulaContext: 'R = 1719 / D   (D = degree of curve on 30 m chord)',
    explanation: 'R = 1719/3 = 573 m. If the designation were on a 20 m chord the constant would be 1146, giving option D — reading the chord basis correctly matters.',
    solutionSteps: [
      'Step 1 — Degree of curve on a 30 m chord: R = 1719/D.',
      'Step 2 — R = 1719 / 3 = 573 m.',
      'Step 3 — Cross-check with geometry: chord = 2R sin(D/2) = 2 × 573 × sin 1.5° = 30.0 m ✓.'
    ],
    answerUnit: 'm',
    referenceSource: 'Surveying Vol. I — B.C. Punmia',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-ce-021',
    questionNumber: 221,
    examId: 'apsc-ae-civil',
    subject: 'Surveying & Geomatics',
    topic: 'Curves, Tacheometry & Total Station',
    subtopic: 'Horizontal Distance in Tacheometry',
    stem: 'A tacheometer with multiplying constant 100 and additive constant zero sights a levelling staff held vertically. The staff intercept is 2.0 m and the angle of elevation is 10°. Determine the horizontal distance from the instrument to the staff.',
    options: [
      { id: 'A', text: '188 m' },
      { id: 'B', text: '194 m' },
      { id: 'C', text: '197 m' },
      { id: 'D', text: '200 m' }
    ],
    correctOption: 'B',
    formulaContext: 'D = 100 · s · cos²θ  (for a vertical staff)',
    explanation: 'D = 100 × 2.0 × cos²10° = 194 m. Option C uses cos θ instead of cos²θ — the single most common tacheometry error.',
    solutionSteps: [
      'Step 1 — Formula: D = K·s·cos²θ + C·cosθ, with K = 100, C = 0.',
      'Step 2 — cos 10° = 0.9848 → cos²10° = 0.9698.',
      'Step 3 — D = 100 × 2.0 × 0.9698 = 193.96 m ≈ 194 m.',
      'Step 4 — Trap: using cos θ gives 196.96 m, a 3 m error at just 10° of inclination.'
    ],
    answerUnit: 'm',
    referenceSource: 'Surveying Vol. I — B.C. Punmia',
    difficulty: 'HARD',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },

  /* ==================== Design of Steel Structures ==================== */
  {
    id: 'num-ce-022',
    questionNumber: 222,
    examId: 'apsc-ae-civil',
    subject: 'Design of Steel Structures',
    topic: 'Bolted & Welded Connections',
    subtopic: 'Effective Throat Thickness of a Fillet Weld',
    stem: 'A shop fillet weld of 10 mm size is used to connect two plates. Determine the effective throat thickness of the weld.',
    options: [
      { id: 'A', text: '5.0 mm' },
      { id: 'B', text: '7.0 mm' },
      { id: 'C', text: '10.0 mm' },
      { id: 'D', text: '14.0 mm' }
    ],
    correctOption: 'B',
    formulaContext: 't_t = 0.7 · s  (shop fillet weld)',
    explanation: 'Effective throat thickness = 0.7 × size = 7 mm. A size of 10 mm is the leg length; the throat is measured perpendicular to the weld axis.',
    solutionSteps: [
      'Step 1 — Weld size s = leg length = 10 mm.',
      'Step 2 — Effective throat = 0.7 s for a fillet weld in a plane at 45°.',
      'Step 3 — t_t = 0.7 × 10 = 7 mm.'
    ],
    answerUnit: 'mm',
    referenceSource: 'IS 800:2007, Cl. 10.5.2',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-ce-023',
    questionNumber: 223,
    examId: 'apsc-ae-civil',
    subject: 'Design of Steel Structures',
    topic: 'Plastic Analysis & Shape Factor',
    subtopic: 'Shape Factor of a Solid Circular Section',
    stem: 'Determine the shape factor of a solid circular steel cross-section.',
    options: [
      { id: 'A', text: '1.27' },
      { id: 'B', text: '1.50' },
      { id: 'C', text: '1.70' },
      { id: 'D', text: '2.00' }
    ],
    correctOption: 'C',
    formulaContext: 'S = Z_p / Z_e = 16/(3π) = 1.70  (solid circle)',
    explanation: 'For a circle Z_p = d³/6 and Z_e = πd³/32, so S = 32/(6π) = 1.698 ≈ 1.70. Option B is the rectangle (1.5), and 1.27 is the diamond/typical I-section value.',
    solutionSteps: [
      'Step 1 — Plastic section modulus of a circle: Z_p = d³/6.',
      'Step 2 — Elastic section modulus: Z_e = πd³/32.',
      'Step 3 — S = Z_p/Z_e = (d³/6) ÷ (πd³/32) = 32/(6π) = 1.698 ≈ 1.70.'
    ],
    referenceSource: 'Design of Steel Structures — S.K. Duggal',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-ce-024',
    questionNumber: 224,
    examId: 'apsc-ae-civil',
    subject: 'Design of Steel Structures',
    topic: 'Plastic Analysis & Shape Factor',
    subtopic: 'Plastic Moment Capacity',
    stem: 'A rectangular steel section 100 mm wide and 300 mm deep is made of steel with yield stress 250 MPa. Calculate its plastic moment of resistance.',
    options: [
      { id: 'A', text: '281.3 kN·m' },
      { id: 'B', text: '375.0 kN·m' },
      { id: 'C', text: '450.0 kN·m' },
      { id: 'D', text: '562.5 kN·m' }
    ],
    correctOption: 'D',
    formulaContext: 'M_p = f_y · Z_p = f_y · b·d²/4',
    explanation: 'Z_p = bd²/4 = 2.25 × 10⁶ mm³, so M_p = 250 × 2.25 × 10⁶ = 562.5 kN·m. Option B is the *yield* moment f_y·Z_e (375 kN·m) — the elastic limit, not the plastic one.',
    solutionSteps: [
      'Step 1 — For a rectangle the plastic modulus Z_p = b·d²/4.',
      'Step 2 — Z_p = 100 × 300²/4 = 100 × 90,000/4 = 2.25 × 10⁶ mm³.',
      'Step 3 — M_p = f_y · Z_p = 250 × 2.25 × 10⁶ = 562.5 × 10⁶ N·mm = 562.5 kN·m.',
      'Step 4 — Cross-check with the shape factor: Z_e = bd²/6 = 1.5 × 10⁶ mm³, S = 2.25/1.5 = 1.5 ✓ (rectangle).'
    ],
    answerUnit: 'kN·m',
    referenceSource: 'IS 800:2007 — Plastic Analysis, Annex B',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },

  /* ================ Building Materials & Construction ================ */
  {
    id: 'num-ce-025',
    questionNumber: 225,
    examId: 'apsc-ae-civil',
    subject: 'Building Materials & Construction',
    topic: "Concrete Properties, Workability & Abram's Law",
    subtopic: 'Flexural Tensile Strength of Concrete',
    stem: 'Determine the characteristic flexural tensile strength (modulus of rupture) of M25 grade concrete as per IS 456:2000.',
    options: [
      { id: 'A', text: '2.5 MPa' },
      { id: 'B', text: '3.5 MPa' },
      { id: 'C', text: '4.0 MPa' },
      { id: 'D', text: '5.0 MPa' }
    ],
    correctOption: 'B',
    formulaContext: 'f_cr = 0.7 · √f_ck',
    explanation: 'f_cr = 0.7 × √25 = 0.7 × 5 = 3.5 MPa. Option D is √f_ck, which is the *direct* tensile strength, not the modulus of rupture.',
    solutionSteps: [
      'Step 1 — IS 456 gives the modulus of rupture as f_cr = 0.7 √f_ck.',
      'Step 2 — √25 = 5 MPa.',
      'Step 3 — f_cr = 0.7 × 5 = 3.5 MPa.'
    ],
    answerUnit: 'MPa',
    referenceSource: 'IS 456:2000, Cl. 6.2.2',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-ce-026',
    questionNumber: 226,
    examId: 'apsc-ae-civil',
    subject: 'Building Materials & Construction',
    topic: 'Standard Laboratory Tests on Cement',
    subtopic: 'Water for the Le-Chatelier Soundness Test',
    stem: 'The standard consistency of a cement sample is 30%. Calculate the quantity of water required to prepare the paste from a 300 g cement sample for the Le-Chatelier soundness test.',
    options: [
      { id: 'A', text: '54.0 ml' },
      { id: 'B', text: '70.2 ml' },
      { id: 'C', text: '90.0 ml' },
      { id: 'D', text: '23.4 ml' }
    ],
    correctOption: 'B',
    formulaContext: 'Water for soundness test = 0.78 · P (percent of cement mass)',
    explanation: 'Water = 0.78 × 30% = 23.4% of 300 g = 70.2 ml. Option C wrongly uses the consistency percentage P directly (30% of 300 g = 90 ml).',
    solutionSteps: [
      'Step 1 — For the Le-Chatelier test the paste is made with 0.78 P of water, where P = standard consistency.',
      'Step 2 — 0.78 × 30 = 23.4% by mass of cement.',
      'Step 3 — Water = 0.234 × 300 g = 70.2 g ≈ 70.2 ml (density of water = 1 g/ml).'
    ],
    answerUnit: 'ml',
    referenceSource: 'IS 4031 (Part 3) — Soundness of Cement',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-ce-027',
    questionNumber: 227,
    examId: 'apsc-ae-civil',
    subject: 'Building Materials & Construction',
    topic: 'Aggregates — Grading & Testing',
    subtopic: 'Fineness Modulus of Fine Aggregate',
    stem: 'A sand sample has cumulative percentages retained of 2, 8, 18, 38, 68 and 92 on the 4.75 mm, 2.36 mm, 1.18 mm, 600 µm, 300 µm and 150 µm sieves respectively. Determine its fineness modulus.',
    options: [
      { id: 'A', text: '1.13' },
      { id: 'B', text: '2.26' },
      { id: 'C', text: '3.78' },
      { id: 'D', text: '4.52' }
    ],
    correctOption: 'B',
    formulaContext: 'FM = (Σ cumulative % retained) / 100',
    explanation: 'Σ = 2 + 8 + 18 + 38 + 68 + 92 = 226, so FM = 226/100 = 2.26. Sand in the 2.2–2.6 band is medium sand, well suited to concrete.',
    solutionSteps: [
      'Step 1 — Add the cumulative percentages retained on the standard sieves: 2 + 8 + 18 + 38 + 68 + 92 = 226.',
      'Step 2 — FM = Σ / 100 = 226/100 = 2.26.',
      'Step 3 — Interpretation: FM < 2 is fine sand, 2–2.6 medium, > 3 coarse — so this is medium sand.'
    ],
    referenceSource: 'IS 383 — Coarse and Fine Aggregate Grading',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },

  /* ===================== Construction Management ===================== */
  {
    id: 'num-ce-028',
    questionNumber: 228,
    examId: 'apsc-ae-civil',
    subject: 'Construction Management',
    topic: 'CPM vs PERT & Activity Times',
    subtopic: 'Expected Activity Duration',
    stem: 'An activity has an optimistic time of 4 days, a most likely time of 7 days and a pessimistic time of 16 days. Determine its expected duration in PERT.',
    options: [
      { id: 'A', text: '7.0 days' },
      { id: 'B', text: '8.0 days' },
      { id: 'C', text: '9.0 days' },
      { id: 'D', text: '10.0 days' }
    ],
    correctOption: 'B',
    formulaContext: 't_e = (t_o + 4·t_m + t_p) / 6',
    explanation: 't_e = (4 + 4×7 + 16)/6 = 48/6 = 8 days. The expected time exceeds the most likely time whenever the distribution is skewed to the right, as here.',
    solutionSteps: [
      'Step 1 — Formula: t_e = (t_o + 4 t_m + t_p)/6.',
      'Step 2 — t_e = (4 + 28 + 16)/6.',
      'Step 3 — t_e = 48/6 = 8 days.'
    ],
    answerUnit: 'days',
    referenceSource: 'PERT and CPM — L.S. Srinath',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-ce-029',
    questionNumber: 229,
    examId: 'apsc-ae-civil',
    subject: 'Construction Management',
    topic: 'CPM vs PERT & Activity Times',
    subtopic: 'Standard Deviation of an Activity',
    stem: 'For the same activity (optimistic 4 days, most likely 7 days, pessimistic 16 days), determine the standard deviation of the activity duration.',
    options: [
      { id: 'A', text: '2.0 days' },
      { id: 'B', text: '3.0 days' },
      { id: 'C', text: '6.0 days' },
      { id: 'D', text: '12.0 days' }
    ],
    correctOption: 'A',
    formulaContext: 'σ = (t_p − t_o) / 6',
    explanation: 'σ = (16 − 4)/6 = 2 days. The variance is σ² = 4 days², which is the quantity actually summed along the critical path.',
    solutionSteps: [
      'Step 1 — Range for one standard deviation: t_o to t_p spans 6σ.',
      'Step 2 — σ = (t_p − t_o)/6 = (16 − 4)/6.',
      'Step 3 — σ = 12/6 = 2 days, so variance = 4 days².'
    ],
    answerUnit: 'days',
    referenceSource: 'PERT and CPM — L.S. Srinath',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-ce-030',
    questionNumber: 230,
    examId: 'apsc-ae-civil',
    subject: 'Construction Management',
    topic: 'Network Analysis — Floats & Critical Path',
    subtopic: 'Total Float of an Activity',
    stem: 'In a network, node 1 links to node 3 directly by an activity of 12 days, and also through node 2 by activities of 4 days (1–2) and 5 days (2–3). Determine the total float of the activity 1–2.',
    options: [
      { id: 'A', text: '0 days' },
      { id: 'B', text: '3 days' },
      { id: 'C', text: '5 days' },
      { id: 'D', text: '7 days' }
    ],
    correctOption: 'B',
    formulaContext: 'Total float = LFT − EFT (or LST − EST)',
    explanation: 'The path 1–2–3 takes 4 + 5 = 9 days against 12 days on 1–3, so activity 1–2 can be delayed by 12 − 9 = 3 days without delaying the project.',
    solutionSteps: [
      'Step 1 — Critical path is 1–3 with duration 12 days (the longest path).',
      'Step 2 — Project duration = 12 days; EFT of 1–2 = 4 days.',
      'Step 3 — For 1–2 to finish without delaying 2–3, it must complete by 12 − 5 = 7 days.',
      'Step 4 — Total float = 7 − 4 = 3 days.'
    ],
    answerUnit: 'days',
    referenceSource: 'PERT and CPM — L.S. Srinath',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },

  /* ================= Hydrology & Irrigation Engineering ================= */
  {
    id: 'num-ce-031',
    questionNumber: 231,
    examId: 'apsc-ae-civil',
    subject: 'Hydrology & Irrigation Engineering',
    topic: 'Crop Water Requirements: Duty, Delta & Base Period',
    subtopic: 'Duty of Canal Water',
    stem: 'A crop with a base period of 120 days requires a total depth of water (Δ) of 96 cm. Determine the duty of the canal water at the field outlet.',
    options: [
      { id: 'A', text: '108 ha/cumec' },
      { id: 'B', text: '960 ha/cumec' },
      { id: 'C', text: '1080 ha/cumec' },
      { id: 'D', text: '864 ha/cumec' }
    ],
    correctOption: 'C',
    formulaContext: 'D = 864 · B / Δ   (B in days, Δ in cm)',
    explanation: 'D = 864 × 120 / 96 = 1080 ha/cumec. Duty rises with base period and falls with the depth of water required — the two are inversely related.',
    solutionSteps: [
      'Step 1 — Relation between duty, base period and delta: D = 864 B / Δ.',
      'Step 2 — D = (864 × 120) / 96.',
      'Step 3 — 864 × 120 = 103,680; ÷ 96 = 1080 ha/cumec.'
    ],
    answerUnit: 'ha/cumec',
    referenceSource: 'Irrigation Engineering — S.K. Garg',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-ce-032',
    questionNumber: 232,
    examId: 'apsc-ae-civil',
    subject: 'Hydrology & Irrigation Engineering',
    topic: "Lacey's Regime Theory vs Kennedy's Silt Theory",
    subtopic: 'Wetted Perimeter by Lacey',
    stem: 'A stable regime channel carries a discharge of 64 cumecs. Calculate its wetted perimeter as per Lacey’s theory.',
    options: [
      { id: 'A', text: '24 m' },
      { id: 'B', text: '38 m' },
      { id: 'C', text: '43 m' },
      { id: 'D', text: '76 m' }
    ],
    correctOption: 'B',
    formulaContext: 'P = 4.75 · √Q',
    explanation: 'P = 4.75 × √64 = 4.75 × 8 = 38 m. Lacey’s regime equations give silt factor dependent quantities; here f = 1 was implied by the standard form.',
    solutionSteps: [
      'Step 1 — Lacey wetted perimeter: P = 4.75 √Q.',
      'Step 2 — √64 = 8.',
      'Step 3 — P = 4.75 × 8 = 38 m.'
    ],
    answerUnit: 'm',
    referenceSource: 'Irrigation Engineering — S.K. Garg',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-ce-033',
    questionNumber: 233,
    examId: 'apsc-ae-civil',
    subject: 'Hydrology & Irrigation Engineering',
    topic: 'Unit Hydrograph Theory & S-Curve Synthesis',
    subtopic: 'Volume of Direct Runoff from a Unit Hydrograph',
    stem: 'A 4-hour unit hydrograph belongs to a catchment of 360 km² and has a peak of 60 m³/s. Determine the total volume of direct runoff represented by this unit hydrograph.',
    options: [
      { id: 'A', text: '0.36 × 10⁶ m³' },
      { id: 'B', text: '3.6 × 10⁶ m³' },
      { id: 'C', text: '36 × 10⁶ m³' },
      { id: 'D', text: '3.6 × 10³ m³' }
    ],
    correctOption: 'B',
    formulaContext: 'V = A × (1 cm) ;  1 cm over 1 km² = 10⁴ m³',
    explanation: 'A unit hydrograph represents 1 cm of direct runoff. 1 cm over 1 km² = 10⁴ m³, so over 360 km² the volume = 360 × 10⁴ = 3.6 × 10⁶ m³. The peak value is not needed — it is a deliberate distractor.',
    solutionSteps: [
      'Step 1 — By definition, a unit hydrograph represents 1 cm of direct runoff over the catchment.',
      'Step 2 — 1 cm over 1 km² = 0.01 m × 10⁶ m² = 10⁴ m³.',
      'Step 3 — Over 360 km²: V = 360 × 10⁴ = 3.6 × 10⁶ m³ (3.6 Mm³).',
      'Step 4 — Cross-check the base time: V = ∫Q dt, so a 60 m³/s peak with this volume needs a base of roughly 17 hours — consistent.'
    ],
    answerUnit: 'm³',
    referenceSource: 'Engineering Hydrology — K. Subramanya',
    difficulty: 'HARD',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },

  /* ====================== Prestressed Concrete ====================== */
  {
    id: 'num-ce-034',
    questionNumber: 234,
    examId: 'apsc-ae-civil',
    subject: 'Prestressed Concrete',
    topic: 'The 6 Losses of Prestress',
    subtopic: 'Loss Due to Anchorage Slip',
    stem: 'A post-tensioned tendon 30 m long is stressed from one end and slips 3 mm into the anchorage. Taking E_s = 200 GPa, calculate the loss of prestress due to anchorage slip.',
    options: [
      { id: 'A', text: '2 MPa' },
      { id: 'B', text: '6 MPa' },
      { id: 'C', text: '20 MPa' },
      { id: 'D', text: '60 MPa' }
    ],
    correctOption: 'C',
    formulaContext: 'Δf = (Δ_slip · E_s) / L',
    explanation: 'Δf = (3 × 200,000)/30,000 = 20 MPa. Keep units consistent: millimetres for slip, N/mm² for E_s, millimetres for length.',
    solutionSteps: [
      'Step 1 — Formula: Δf = (Δ · E_s)/L, where Δ is the anchorage slip.',
      'Step 2 — Convert: E_s = 200 GPa = 200,000 N/mm²; L = 30 m = 30,000 mm.',
      'Step 3 — Δf = (3 mm × 200,000 N/mm²) / 30,000 mm = 600,000/30,000.',
      'Step 4 — Δf = 20 N/mm² = 20 MPa.'
    ],
    answerUnit: 'MPa',
    referenceSource: 'Prestressed Concrete — N. Krishna Raju',
    difficulty: 'HARD',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-ce-035',
    questionNumber: 235,
    examId: 'apsc-ae-civil',
    subject: 'Prestressed Concrete',
    topic: "Lin's Load Balancing Concept",
    subtopic: 'Upward Balanced Load',
    stem: 'A prestressed beam of 10 m span has a parabolic tendon with a prestressing force of 500 kN and a central sag of 100 mm. Determine the upward balanced load per metre from Lin’s load balancing concept.',
    options: [
      { id: 'A', text: '0.4 kN/m' },
      { id: 'B', text: '4.0 kN/m' },
      { id: 'C', text: '8.0 kN/m' },
      { id: 'D', text: '40.0 kN/m' }
    ],
    correctOption: 'B',
    formulaContext: 'w_up = 8 · P · e / L²',
    explanation: 'w_up = 8 × 500 × 0.1 / 100 = 4.0 kN/m. The tendon’s sag profile of 0.1 m must be used in metres throughout.',
    solutionSteps: [
      'Step 1 — Load balancing: a parabolic tendon exerts a uniform upward load w_up = 8Pe/L².',
      'Step 2 — P = 500 kN, e = 100 mm = 0.1 m, L = 10 m → L² = 100 m².',
      'Step 3 — w_up = (8 × 500 × 0.1)/100 = 400/100 = 4.0 kN/m.',
      'Step 4 — Balanced load equals this upward value; the beam then carries only the net downward load.'
    ],
    answerUnit: 'kN/m',
    referenceSource: 'Prestressed Concrete — N. Krishna Raju',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-ce-036',
    questionNumber: 236,
    examId: 'apsc-ae-civil',
    subject: 'Prestressed Concrete',
    topic: 'Analysis of Prestress & Effective Force',
    subtopic: 'Effective Prestressing Force After Losses',
    stem: 'A tendon of cross-sectional area 500 mm² is initially stressed to 1200 MPa. If the total losses are estimated at 18%, determine the effective prestressing force.',
    options: [
      { id: 'A', text: '460 kN' },
      { id: 'B', text: '492 kN' },
      { id: 'C', text: '520 kN' },
      { id: 'D', text: '600 kN' }
    ],
    correctOption: 'B',
    formulaContext: 'P_e = (1 − loss fraction) · P_i ;  P_i = σ_i · A_p',
    explanation: 'P_i = 1200 × 500 = 600 kN, and with 18% losses P_e = 0.82 × 600 = 492 kN. Option D is the initial force before losses.',
    solutionSteps: [
      'Step 1 — Initial prestressing force: P_i = σ_i · A_p = 1200 N/mm² × 500 mm².',
      'Step 2 — P_i = 600,000 N = 600 kN.',
      'Step 3 — Losses = 18%, so the effective force is 82% of the initial: P_e = 0.82 × 600.',
      'Step 4 — P_e = 492 kN.'
    ],
    answerUnit: 'kN',
    referenceSource: 'Prestressed Concrete — N. Krishna Raju',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },

  /* ====================== Estimating & Costing ====================== */
  {
    id: 'num-ce-037',
    questionNumber: 237,
    examId: 'apsc-ae-civil',
    subject: 'Estimating & Costing',
    topic: 'Methods of Building Measurement & IS 1200 Rules',
    subtopic: 'Centreline Method with T-Junctions',
    stem: 'A building’s walls are 30 cm thick and have a total centreline length of 50 m. If the plan contains 4 T-junctions, determine the net length used for estimating the masonry.',
    options: [
      { id: 'A', text: '45.0 m' },
      { id: 'B', text: '48.8 m' },
      { id: 'C', text: '50.0 m' },
      { id: 'D', text: '51.2 m' }
    ],
    correctOption: 'B',
    formulaContext: 'Net length = Total centreline length − (number of junctions × half wall thickness × 2)',
    explanation: 'Each junction is counted twice along the centreline, so deduct half the thickness per junction per side: 50 − 4 × 0.3 = 48.8 m. Option D adds instead of deducting.',
    solutionSteps: [
      'Step 1 — In the centreline method, the centreline of a wall is measured once and junctions are deducted.',
      'Step 2 — Deduction per T-junction = half the thickness from each side = 2 × (0.3/2) = 0.3 m.',
      'Step 3 — For 4 junctions: deduction = 4 × 0.3 = 1.2 m.',
      'Step 4 — Net length = 50 − 1.2 = 48.8 m.'
    ],
    answerUnit: 'm',
    referenceSource: 'Estimating, Costing & Valuation — B.N. Dutta',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-ce-038',
    questionNumber: 238,
    examId: 'apsc-ae-civil',
    subject: 'Estimating & Costing',
    topic: 'Valuation, Depreciation & Sinking Fund',
    subtopic: 'Capitalized Value of a Property',
    stem: 'A property yields a net annual income of ₹60,000 and the prevailing rate of interest is 6% per annum. Calculate its capitalized value.',
    options: [
      { id: 'A', text: '₹1,00,000' },
      { id: 'B', text: '₹3,60,000' },
      { id: 'C', text: '₹10,00,000' },
      { id: 'D', text: '₹12,00,000' }
    ],
    correctOption: 'C',
    formulaContext: 'Capitalized value = Net annual income / Rate of interest (as a decimal)',
    explanation: 'Capitalized value = 60,000/0.06 = ₹10,00,000. Option B is 6 × the income, i.e. dividing by 0.1 instead of 0.06.',
    solutionSteps: [
      'Step 1 — Capitalized value is the present worth of the perpetual net income.',
      'Step 2 — Rate as a decimal: 6% = 0.06.',
      'Step 3 — Capitalized value = 60,000 / 0.06 = ₹10,00,000.'
    ],
    answerUnit: '₹',
    referenceSource: 'Estimating, Costing & Valuation — B.N. Dutta',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-ce-039',
    questionNumber: 239,
    examId: 'apsc-ae-civil',
    subject: 'Estimating & Costing',
    topic: 'Methods of Building Measurement & IS 1200 Rules',
    subtopic: 'Volume of Plastering',
    stem: 'A wall 5 m long and 3 m high is to be plastered 12 mm thick on both faces. Calculate the volume of plastering work.',
    options: [
      { id: 'A', text: '0.18 m³' },
      { id: 'B', text: '0.36 m³' },
      { id: 'C', text: '0.72 m³' },
      { id: 'D', text: '3.60 m³' }
    ],
    correctOption: 'B',
    formulaContext: 'Volume = Area × Thickness',
    explanation: 'One face = 5 × 3 = 15 m²; both faces = 30 m². Volume = 30 × 0.012 = 0.36 m³. Option A forgets the second face.',
    solutionSteps: [
      'Step 1 — Area of one face: 5 m × 3 m = 15 m².',
      'Step 2 — Both faces: 2 × 15 = 30 m².',
      'Step 3 — Thickness = 12 mm = 0.012 m.',
      'Step 4 — Volume = 30 × 0.012 = 0.36 m³.'
    ],
    answerUnit: 'm³',
    referenceSource: 'IS 1200 (Part 12) — Plastering',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },

  /* ============== Highway & Transportation Engineering ============== */
  {
    id: 'num-ce-040',
    questionNumber: 240,
    examId: 'apsc-ae-civil',
    subject: 'Highway & Transportation Engineering',
    topic: 'Highway Geometric Design & Cross-Section',
    subtopic: 'Stopping Sight Distance',
    stem: 'Calculate the stopping sight distance for a design speed of 80 km/h on a level road with a coefficient of longitudinal friction of 0.35 and a driver reaction time of 2.5 seconds.',
    options: [
      { id: 'A', text: '55.6 m' },
      { id: 'B', text: '71.9 m' },
      { id: 'C', text: '127.5 m' },
      { id: 'D', text: '143.8 m' }
    ],
    correctOption: 'C',
    formulaContext: 'SSD = v·t + v²/(2·g·f)  (v in m/s)',
    explanation: 'Lag = 22.22 × 2.5 = 55.6 m; braking = 22.22²/(2 × 9.81 × 0.35) = 71.9 m; SSD = 127.5 m. Options A and B are the two components, not the total.',
    solutionSteps: [
      'Step 1 — Convert the design speed: v = 80 km/h = 80/3.6 = 22.22 m/s.',
      'Step 2 — Reaction (lag) distance = v·t = 22.22 × 2.5 = 55.56 m.',
      'Step 3 — Braking distance = v²/(2 g f) = (22.22)²/(2 × 9.81 × 0.35) = 493.8/6.867 = 71.9 m.',
      'Step 4 — SSD = 55.56 + 71.9 = 127.5 m.'
    ],
    answerUnit: 'm',
    referenceSource: 'Highway Engineering — Khanna & Justo',
    difficulty: 'HARD',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-ce-041',
    questionNumber: 241,
    examId: 'apsc-ae-civil',
    subject: 'Highway & Transportation Engineering',
    topic: 'Highway Geometric Design & Cross-Section',
    subtopic: 'Superelevation',
    stem: 'A horizontal curve of radius 300 m is to be designed for a speed of 80 km/h. Determine the superelevation required, neglecting friction.',
    options: [
      { id: 'A', text: '0.056' },
      { id: 'B', text: '0.084' },
      { id: 'C', text: '0.168' },
      { id: 'D', text: '0.210' }
    ],
    correctOption: 'C',
    formulaContext: 'e = V² / (127 · R)   (V in km/h, R in m)',
    explanation: 'e = 80²/(127 × 300) = 6400/38100 = 0.168, i.e. about 1 in 6 — above the practical maximum of 0.07, so in practice a larger radius or a lower design speed (superelevation with friction) would be needed.',
    solutionSteps: [
      'Step 1 — Formula with speed in km/h: e = V²/(127 R).',
      'Step 2 — e = (80)²/(127 × 300) = 6400/38,100.',
      'Step 3 — e = 0.168.',
      'Step 4 — Interpretation: 0.168 far exceeds the 0.07 limit, so the full centrifugal force cannot be balanced by superelevation alone.'
    ],
    referenceSource: 'IRC 73 — Geometric Design of Hill Roads',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-ce-042',
    questionNumber: 242,
    examId: 'apsc-ae-civil',
    subject: 'Highway & Transportation Engineering',
    topic: 'Highway Geometric Design & Cross-Section',
    subtopic: 'Extra Widening on Horizontal Curves',
    stem: 'A two-lane highway curves with a radius of 300 m and is designed for 80 km/h. Taking a wheelbase of 6 m, calculate the total extra widening required.',
    options: [
      { id: 'A', text: '0.12 m' },
      { id: 'B', text: '0.49 m' },
      { id: 'C', text: '0.61 m' },
      { id: 'D', text: '0.73 m' }
    ],
    correctOption: 'C',
    formulaContext: 'W_e = n·l²/(2R) + V/(9.5·√R)',
    explanation: 'Mechanical widening = 2 × 6²/(2 × 300) = 0.12 m; psychological widening = 80/(9.5√300) = 0.49 m; total = 0.61 m. Options A and B are the individual components.',
    solutionSteps: [
      'Step 1 — Mechanical widening (off-tracking) for n = 2 lanes, l = 6 m: W_m = nl²/(2R) = (2 × 36)/600 = 0.12 m.',
      'Step 2 — Psychological widening: W_ps = V/(9.5√R) = 80/(9.5 × 17.32).',
      'Step 3 — √300 = 17.32 → 9.5 × 17.32 = 164.5 → W_ps = 80/164.5 = 0.49 m.',
      'Step 4 — Total extra widening = 0.12 + 0.49 = 0.61 m.'
    ],
    answerUnit: 'm',
    referenceSource: 'Highway Engineering — Khanna & Justo',
    difficulty: 'HARD',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },

  /* ================= Geotechnical Engineering & Soil Mechanics ================= */
  {
    id: 'num-geo-001',
    questionNumber: 243,
    examId: 'apsc-ae-civil',
    subject: 'Geotechnical Engineering',
    topic: 'Soil Phase Relations & Index Properties',
    subtopic: 'Void Ratio from Porosity',
    stem: 'A soil sample has a measured porosity n = 0.40 and specific gravity G = 2.70. Compute the void ratio (e) of the soil.',
    options: [
      { id: 'A', text: '0.400' },
      { id: 'B', text: '0.667' },
      { id: 'C', text: '0.286' },
      { id: 'D', text: '1.500' }
    ],
    correctOption: 'B',
    formulaContext: 'e = n / (1 - n)',
    explanation: 'Void ratio e = n / (1 - n) = 0.40 / (1 - 0.40) = 0.40 / 0.60 = 0.667. Option C uses n / (1 + n); D inverts the formula.',
    solutionSteps: [
      'Step 1 — Formula relating void ratio and porosity: e = n / (1 - n).',
      'Step 2 — Substitute n = 0.40: e = 0.40 / (1 - 0.40).',
      'Step 3 — e = 0.40 / 0.60 = 2/3 = 0.667.'
    ],
    answerUnit: 'dimensionless',
    referenceSource: 'Soil Mechanics & Foundation Engineering — K.R. Arora',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-geo-002',
    questionNumber: 244,
    examId: 'apsc-ae-civil',
    subject: 'Geotechnical Engineering',
    topic: 'Soil Phase Relations & Index Properties',
    subtopic: 'Degree of Saturation Calculation',
    stem: 'A soil specimen has moisture content w = 20%, specific gravity G = 2.65, and void ratio e = 0.65. Determine its degree of saturation.',
    options: [
      { id: 'A', text: '68.5%' },
      { id: 'B', text: '81.5%' },
      { id: 'C', text: '92.0%' },
      { id: 'D', text: '100.0%' }
    ],
    correctOption: 'B',
    formulaContext: 'S_r · e = w · G',
    explanation: 'From phase relationship S_r = (w · G) / e = (0.20 × 2.65) / 0.65 = 0.53 / 0.65 = 0.8154 = 81.5%. Option A divides by G; C uses G = 3.0.',
    solutionSteps: [
      'Step 1 — Fundamental identity: S_r · e = w · G.',
      'Step 2 — Solve for S_r: S_r = (w · G) / e.',
      'Step 3 — Numerator: 0.20 × 2.65 = 0.53.',
      'Step 4 — S_r = 0.53 / 0.65 = 0.8154 = 81.54% ≈ 81.5%.'
    ],
    answerUnit: '%',
    referenceSource: 'Basic and Applied Soil Mechanics — Gopal Ranjan & Rao',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-geo-003',
    questionNumber: 245,
    examId: 'apsc-ae-civil',
    subject: 'Geotechnical Engineering',
    topic: 'Permeability & Seepage',
    subtopic: 'Critical Hydraulic Gradient & Quick Sand',
    stem: 'A stratum of clean sand has specific gravity G = 2.67 and void ratio e = 0.67. Calculate the critical hydraulic gradient (i_cr) at which quicksand condition initiates.',
    options: [
      { id: 'A', text: '0.85' },
      { id: 'B', text: '1.00' },
      { id: 'C', text: '1.25' },
      { id: 'D', text: '1.67' }
    ],
    correctOption: 'B',
    formulaContext: 'i_cr = (G - 1) / (1 + e)',
    explanation: 'i_cr = (G - 1) / (1 + e) = (2.67 - 1) / (1 + 0.67) = 1.67 / 1.67 = 1.00. At this gradient, upward seepage force exactly balances buoyant submerged soil weight.',
    solutionSteps: [
      'Step 1 — Critical hydraulic gradient formula: i_cr = (G - 1) / (1 + e).',
      'Step 2 — Numerator: 2.67 - 1 = 1.67.',
      'Step 3 — Denominator: 1 + 0.67 = 1.67.',
      'Step 4 — i_cr = 1.67 / 1.67 = 1.00.'
    ],
    answerUnit: 'dimensionless',
    referenceSource: 'IS 6403 & Terzaghi Geotechnical Principles',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-geo-004',
    questionNumber: 246,
    examId: 'apsc-ae-civil',
    subject: 'Geotechnical Engineering',
    topic: 'Effective Stress Principle',
    subtopic: 'Effective Vertical Stress at Depth',
    stem: 'A soil profile consists of 2 m dry sand (γ_d = 16 kN/m³) overlying 4 m saturated sand (γ_sat = 20 kN/m³). Water table is 2 m below surface. Taking γ_w = 9.81 kN/m³, compute effective vertical stress at 6 m depth.',
    options: [
      { id: 'A', text: '112.00 kPa' },
      { id: 'B', text: '72.76 kPa' },
      { id: 'C', text: '53.14 kPa' },
      { id: 'D', text: '92.38 kPa' }
    ],
    correctOption: 'B',
    formulaContext: 'σ\' = σ - u = Σ(γ · z) - γ_w · z_w',
    explanation: 'Total stress σ = (2 × 16) + (4 × 20) = 32 + 80 = 112 kPa. Pore pressure u = 4 × 9.81 = 39.24 kPa. Effective stress σ\' = 112 - 39.24 = 72.76 kPa.',
    solutionSteps: [
      'Step 1 — Total vertical stress σ: (2 m × 16 kN/m³) + (4 m × 20 kN/m³) = 32 + 80 = 112.0 kPa.',
      'Step 2 — Pore water pressure u at 6 m (head = 4 m): u = 4 m × 9.81 kN/m³ = 39.24 kPa.',
      'Step 3 — Effective vertical stress: σ\' = σ - u = 112.0 - 39.24 = 72.76 kPa.'
    ],
    answerUnit: 'kPa',
    referenceSource: 'Soil Mechanics — Lambe & Whitman',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-geo-005',
    questionNumber: 247,
    examId: 'apsc-ae-civil',
    subject: 'Geotechnical Engineering',
    topic: 'Permeability & Seepage',
    subtopic: 'Seepage Flow Net Discharge',
    stem: 'A diversion weir retains a head H = 6.0 m of water. The constructed flow net has N_f = 4 flow channels and N_d = 12 potential drops. If permeability k = 3 × 10⁻⁵ m/s, calculate seepage discharge per meter run of weir.',
    options: [
      { id: 'A', text: '6.0 × 10⁻⁵ m³/s/m' },
      { id: 'B', text: '1.8 × 10⁻⁴ m³/s/m' },
      { id: 'C', text: '2.0 × 10⁻⁵ m³/s/m' },
      { id: 'D', text: '7.2 × 10⁻⁴ m³/s/m' }
    ],
    correctOption: 'A',
    formulaContext: 'q = k · H · (N_f / N_d)',
    explanation: 'Seepage discharge q = k · H · (N_f / N_d) = (3 × 10⁻⁵) × 6 × (4 / 12) = 1.8 × 10⁻⁴ × (1/3) = 6.0 × 10⁻⁵ m³/s/m.',
    solutionSteps: [
      'Step 1 — Flow net formula: q = k · H · (N_f / N_d).',
      'Step 2 — Shape factor: N_f / N_d = 4 / 12 = 1/3.',
      'Step 3 — Multiply: q = 3 × 10⁻⁵ × 6.0 × (1/3) = 6.0 × 10⁻⁵ m³/s/m.'
    ],
    answerUnit: 'm³/s/m',
    referenceSource: 'Irrigation Engineering & Hydraulic Structures — S.K. Garg',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-geo-006',
    questionNumber: 248,
    examId: 'apsc-ae-civil',
    subject: 'Geotechnical Engineering',
    topic: 'Shallow Foundations & Bearing Capacity',
    subtopic: 'Terzaghi Bearing Capacity for Strip Footing on Clay',
    stem: 'A strip footing 2.0 m wide is founded at 1.5 m depth in saturated clay having undrained cohesion c_u = 40 kPa, φ = 0°, and γ = 18 kN/m³. For φ = 0°, N_c = 5.7, N_q = 1.0, N_γ = 0. Determine ultimate bearing capacity (q_ult).',
    options: [
      { id: 'A', text: '228.0 kPa' },
      { id: 'B', text: '255.0 kPa' },
      { id: 'C', text: '282.0 kPa' },
      { id: 'D', text: '310.0 kPa' }
    ],
    correctOption: 'B',
    formulaContext: 'q_ult = c · N_c + γ · D_f · N_q',
    explanation: 'q_ult = c · N_c + γ · D_f · N_q = (40 × 5.7) + (18 × 1.5 × 1.0) = 228 + 27 = 255 kPa. Option A neglects the surcharge term γ·Df.',
    solutionSteps: [
      'Step 1 — Terzaghi equation for strip footing: q_ult = c · N_c + γ · D_f · N_q + 0.5 · γ · B · N_γ.',
      'Step 2 — For φ = 0: N_γ = 0, N_c = 5.7, N_q = 1.0.',
      'Step 3 — Cohesion term: c · N_c = 40 × 5.7 = 228.0 kPa.',
      'Step 4 — Surcharge term: γ · D_f · N_q = 18 × 1.5 × 1.0 = 27.0 kPa.',
      'Step 5 — q_ult = 228.0 + 27.0 = 255.0 kPa.'
    ],
    answerUnit: 'kPa',
    referenceSource: 'IS 6403:1981 — Determination of Bearing Capacity of Shallow Foundations',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-geo-007',
    questionNumber: 249,
    examId: 'apsc-ae-civil',
    subject: 'Geotechnical Engineering',
    topic: 'Lateral Earth Pressure & Retaining Structures',
    subtopic: 'Rankine Active Earth Pressure Coefficient',
    stem: 'A vertical retaining wall supports cohesionless backfill with an angle of internal friction φ = 30°. Determine the Rankine active earth pressure coefficient (K_a).',
    options: [
      { id: 'A', text: '0.333' },
      { id: 'B', text: '0.500' },
      { id: 'C', text: '3.000' },
      { id: 'D', text: '0.250' }
    ],
    correctOption: 'A',
    formulaContext: 'K_a = (1 - sin φ) / (1 + sin φ)',
    explanation: 'K_a = (1 - sin 30°) / (1 + sin 30°) = (1 - 0.5) / (1 + 0.5) = 0.5 / 1.5 = 1/3 = 0.333. Option C is passive coefficient K_p = 1/K_a = 3.0.',
    solutionSteps: [
      'Step 1 — Rankine active coefficient: K_a = (1 - sin φ) / (1 + sin φ).',
      'Step 2 — sin 30° = 0.5.',
      'Step 3 — K_a = (1 - 0.5) / (1 + 0.5) = 0.5 / 1.5 = 1/3 ≈ 0.333.'
    ],
    answerUnit: 'dimensionless',
    referenceSource: 'Foundation Engineering — P.C. Varghese',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-geo-008',
    questionNumber: 250,
    examId: 'apsc-ae-civil',
    subject: 'Geotechnical Engineering',
    topic: 'Lateral Earth Pressure & Retaining Structures',
    subtopic: 'Total Active Thrust on Wall',
    stem: 'A smooth vertical wall 6.0 m high retains dry sand with unit weight γ = 18 kN/m³ and internal friction angle φ = 30° (K_a = 1/3). Calculate total active horizontal thrust per meter run of wall.',
    options: [
      { id: 'A', text: '54 kN/m' },
      { id: 'B', text: '108 kN/m' },
      { id: 'C', text: '216 kN/m' },
      { id: 'D', text: '324 kN/m' }
    ],
    correctOption: 'B',
    formulaContext: 'P_a = 0.5 · K_a · γ · H²',
    explanation: 'P_a = 0.5 × (1/3) × 18 × 6² = 0.5 × 6 × 36 = 108 kN/m acting at H/3 = 2.0 m above base. Option C forgets 0.5 factor; A uses H instead of H².',
    solutionSteps: [
      'Step 1 — Active thrust formula: P_a = 0.5 · K_a · γ · H².',
      'Step 2 — Substitute: P_a = 0.5 × (1/3) × 18 × (6.0)².',
      'Step 3 — 0.5 × 6 × 36 = 108 kN/m.'
    ],
    answerUnit: 'kN/m',
    referenceSource: 'Soil Mechanics in Engineering Practice — Terzaghi & Peck',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-geo-009',
    questionNumber: 251,
    examId: 'apsc-ae-civil',
    subject: 'Geotechnical Engineering',
    topic: 'Shear Strength of Soil',
    subtopic: 'Mohr-Coulomb Shear Strength Criterion',
    stem: 'In a direct shear test on compacted clayey sand, cohesion c = 25 kPa and friction angle φ = 24° (tan 24° = 0.445). Under an effective normal stress σ\' = 120 kPa, compute shear strength (τ_f).',
    options: [
      { id: 'A', text: '53.4 kPa' },
      { id: 'B', text: '78.4 kPa' },
      { id: 'C', text: '95.2 kPa' },
      { id: 'D', text: '112.0 kPa' }
    ],
    correctOption: 'B',
    formulaContext: 'τ_f = c + σ\' · tan φ',
    explanation: 'τ_f = c + σ\' · tan φ = 25 + (120 × 0.445) = 25 + 53.4 = 78.4 kPa. Option A is the frictional resistance alone without cohesion.',
    solutionSteps: [
      'Step 1 — Mohr-Coulomb equation: τ_f = c + σ\' · tan φ.',
      'Step 2 — Frictional component: 120 kPa × 0.445 = 53.4 kPa.',
      'Step 3 — Add cohesion: τ_f = 25.0 + 53.4 = 78.4 kPa.'
    ],
    answerUnit: 'kPa',
    referenceSource: 'IS 2720 (Part 13) — Direct Shear Test',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-geo-010',
    questionNumber: 252,
    examId: 'apsc-ae-civil',
    subject: 'Geotechnical Engineering',
    topic: 'Soil Compressibility & Consolidation',
    subtopic: 'Primary Consolidation Settlement',
    stem: 'A 4.0 m thick saturated clay layer has initial void ratio e₀ = 0.80 and compression index C_c = 0.30. Effective overburden stress increases from σ₀\' = 100 kPa to σ_f\' = 200 kPa. Calculate primary consolidation settlement.',
    options: [
      { id: 'A', text: '125 mm' },
      { id: 'B', text: '201 mm' },
      { id: 'C', text: '280 mm' },
      { id: 'D', text: '360 mm' }
    ],
    correctOption: 'B',
    formulaContext: 'S_c = [C_c · H₀ / (1 + e₀)] · log₁₀(σ_f\' / σ₀\')',
    explanation: 'S_c = [(0.30 × 4.0) / (1 + 0.80)] × log₁₀(200 / 100) = (1.20 / 1.80) × 0.3010 = 0.667 × 0.3010 = 0.2008 m = 200.8 mm ≈ 201 mm.',
    solutionSteps: [
      'Step 1 — Settlement equation: S_c = [C_c · H₀ / (1 + e₀)] · log₁₀(σ_f\' / σ₀\').',
      'Step 2 — Lead coefficient: (0.30 × 4.0) / 1.80 = 1.20 / 1.80 = 0.667 m.',
      'Step 3 — Logarithm factor: log₁₀(200 / 100) = log₁₀(2.0) = 0.3010.',
      'Step 4 — S_c = 0.667 × 0.3010 = 0.2008 m = 200.8 mm ≈ 201 mm.'
    ],
    answerUnit: 'mm',
    referenceSource: 'Geotechnical Engineering — Braja M. Das',
    difficulty: 'HARD',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-geo-011',
    questionNumber: 253,
    examId: 'apsc-ae-civil',
    subject: 'Geotechnical Engineering',
    topic: 'Soil Compressibility & Consolidation',
    subtopic: 'Coefficient of Consolidation from Laboratory Test',
    stem: 'In an oedometer test, a clay sample of thickness 20 mm with double drainage reaches 50% consolidation (T_v = 0.197) in 15 minutes. Determine the coefficient of consolidation C_v.',
    options: [
      { id: 'A', text: '2.19 × 10⁻⁴ cm²/s' },
      { id: 'B', text: '8.76 × 10⁻⁴ cm²/s' },
      { id: 'C', text: '1.31 × 10⁻³ cm²/s' },
      { id: 'D', text: '5.48 × 10⁻⁵ cm²/s' }
    ],
    correctOption: 'A',
    formulaContext: 'C_v = (T_v · d²) / t',
    explanation: 'Double drainage means drainage path d = 20 / 2 = 10 mm = 1.0 cm. Time t = 15 × 60 = 900 s. C_v = (0.197 × 1.0²) / 900 = 2.19 × 10⁻⁴ cm²/s. Option B uses single drainage (d = 2.0 cm).',
    solutionSteps: [
      'Step 1 — Drainage path length for double drainage: d = H / 2 = 20 mm / 2 = 10 mm = 1.0 cm.',
      'Step 2 — Convert time: t = 15 min × 60 s/min = 900 s.',
      'Step 3 — C_v = (T_v · d²) / t = (0.197 × 1.0²) / 900 = 0.197 / 900 = 2.189 × 10⁻⁴ cm²/s ≈ 2.19 × 10⁻⁴ cm²/s.'
    ],
    answerUnit: 'cm²/s',
    referenceSource: 'IS 2720 (Part 15) — One-dimensional Consolidation Properties',
    difficulty: 'HARD',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-geo-012',
    questionNumber: 254,
    examId: 'apsc-ae-civil',
    subject: 'Geotechnical Engineering',
    topic: 'Permeability & Seepage',
    subtopic: 'Seepage Velocity vs Discharge Velocity',
    stem: 'A saturated sand stratum has void ratio e = 0.60 and hydraulic conductivity k = 4.0 × 10⁻⁴ m/s. Under a hydraulic gradient i = 0.05, calculate the actual seepage velocity (v_s).',
    options: [
      { id: 'A', text: '2.00 × 10⁻⁵ m/s' },
      { id: 'B', text: '3.33 × 10⁻⁵ m/s' },
      { id: 'C', text: '5.33 × 10⁻⁵ m/s' },
      { id: 'D', text: '8.00 × 10⁻⁵ m/s' }
    ],
    correctOption: 'C',
    formulaContext: 'v_s = v / n,  where v = k · i and n = e / (1 + e)',
    explanation: 'Porosity n = e / (1 + e) = 0.60 / 1.60 = 0.375. Discharge velocity v = k · i = (4 × 10⁻⁴) × 0.05 = 2.0 × 10⁻⁵ m/s. Seepage velocity v_s = v / n = (2.0 × 10⁻⁵) / 0.375 = 5.33 × 10⁻⁵ m/s. Option A is discharge velocity.',
    solutionSteps: [
      'Step 1 — Porosity n = e / (1 + e) = 0.60 / 1.60 = 0.375.',
      'Step 2 — Discharge velocity (Darcy law): v = k · i = 4.0 × 10⁻⁴ × 0.05 = 2.0 × 10⁻⁵ m/s.',
      'Step 3 — Seepage velocity through pore channels: v_s = v / n = 2.0 × 10⁻⁵ / 0.375 = 5.333 × 10⁻⁵ m/s.'
    ],
    answerUnit: 'm/s',
    referenceSource: 'Soil Mechanics — Craig',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-geo-013',
    questionNumber: 255,
    examId: 'apsc-ae-civil',
    subject: 'Geotechnical Engineering',
    topic: 'Site Exploration & Deep Foundations',
    subtopic: 'SPT Dilatancy Correction',
    stem: 'During standard penetration testing in saturated fine silty sand below the water table, the recorded blow count is N_0 = 31. Determine the corrected SPT blow count (N_cor) after applying the Terzaghi-Peck dilatancy correction.',
    options: [
      { id: 'A', text: '21' },
      { id: 'B', text: '23' },
      { id: 'C', text: '26' },
      { id: 'D', text: '31' }
    ],
    correctOption: 'B',
    formulaContext: 'N_cor = 15 + 0.5 · (N_0 - 15)  [for N_0 > 15]',
    explanation: 'Dilatancy correction applies for saturated fine sands when N_0 > 15 due to transient negative pore water pressures. N_cor = 15 + 0.5 × (31 - 15) = 15 + 0.5 × 16 = 15 + 8 = 23.',
    solutionSteps: [
      'Step 1 — Check condition: N_0 = 31 > 15 in saturated fine sand.',
      'Step 2 — Formula: N_cor = 15 + 0.5 · (N_0 - 15).',
      'Step 3 — N_cor = 15 + 0.5 × (31 - 15) = 15 + 8 = 23.'
    ],
    answerUnit: 'blows/30cm',
    referenceSource: 'IS 2131:1981 — Method for Standard Penetration Test for Soils',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-geo-014',
    questionNumber: 256,
    examId: 'apsc-ae-civil',
    subject: 'Geotechnical Engineering',
    topic: 'Shear Strength of Soil',
    subtopic: 'Unconfined Compressive Strength & Undrained Cohesion',
    stem: 'An undisturbed cylindrical clay specimen fails in an unconfined compression test at an axial failure stress q_u = 140 kPa. What is the undrained shear strength (cohesion c_u) of the clay?',
    options: [
      { id: 'A', text: '35 kPa' },
      { id: 'B', text: '70 kPa' },
      { id: 'C', text: '140 kPa' },
      { id: 'D', text: '280 kPa' }
    ],
    correctOption: 'B',
    formulaContext: 'c_u = q_u / 2',
    explanation: 'For purely cohesive saturated soil in unconfined compression (φ = 0), the radius of Mohr circle equals shear strength: c_u = q_u / 2 = 140 / 2 = 70 kPa.',
    solutionSteps: [
      'Step 1 — For saturated clay (φ_u = 0), unconfined compressive strength q_u = 2 · c_u.',
      'Step 2 — Undrained cohesion c_u = q_u / 2 = 140 / 2 = 70 kPa.'
    ],
    answerUnit: 'kPa',
    referenceSource: 'IS 2720 (Part 10) — Unconfined Compression Test',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-geo-015',
    questionNumber: 257,
    examId: 'apsc-ae-civil',
    subject: 'Geotechnical Engineering',
    topic: 'Soil Phase Relations & Index Properties',
    subtopic: 'Submerged Unit Weight Calculation',
    stem: 'A soil has specific gravity G = 2.70 and void ratio e = 0.70. Taking γ_w = 9.81 kN/m³, compute the submerged (buoyant) unit weight (γ\') of the soil.',
    options: [
      { id: 'A', text: '7.85 kN/m³' },
      { id: 'B', text: '9.81 kN/m³' },
      { id: 'C', text: '15.58 kN/m³' },
      { id: 'D', text: '19.62 kN/m³' }
    ],
    correctOption: 'B',
    formulaContext: 'γ\' = [(G - 1) / (1 + e)] · γ_w',
    explanation: 'γ\' = [(G - 1) / (1 + e)] · γ_w = [(2.70 - 1) / (1 + 0.70)] × 9.81 = (1.70 / 1.70) × 9.81 = 1.00 × 9.81 = 9.81 kN/m³.',
    solutionSteps: [
      'Step 1 — Submerged unit weight formula: γ\' = [(G - 1) / (1 + e)] · γ_w.',
      'Step 2 — Numerator: 2.70 - 1 = 1.70.',
      'Step 3 — Denominator: 1 + 0.70 = 1.70.',
      'Step 4 — Ratio: 1.70 / 1.70 = 1.00.',
      'Step 5 — γ\' = 1.00 × 9.81 = 9.81 kN/m³.'
    ],
    answerUnit: 'kN/m³',
    referenceSource: 'Engineering Properties of Soils — Bowles',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  },
  {
    id: 'num-geo-016',
    questionNumber: 258,
    examId: 'apsc-ae-civil',
    subject: 'Geotechnical Engineering',
    topic: 'Shallow Foundations & Bearing Capacity',
    subtopic: 'Terzaghi Bearing Capacity for Square Footing on Sand',
    stem: 'A square footing 2.0 m × 2.0 m is placed at 1.0 m depth in dry cohesionless sand (c = 0, γ = 18 kN/m³). Bearing capacity factors are N_q = 20 and N_γ = 20. Calculate the ultimate bearing capacity (q_ult).',
    options: [
      { id: 'A', text: '360 kPa' },
      { id: 'B', text: '504 kPa' },
      { id: 'C', text: '648 kPa' },
      { id: 'D', text: '720 kPa' }
    ],
    correctOption: 'C',
    formulaContext: 'q_ult = γ · D_f · N_q + 0.4 · γ · B · N_γ',
    explanation: 'For square footing in sand (c = 0): q_ult = γ · D_f · N_q + 0.4 · γ · B · N_γ = (18 × 1.0 × 20) + (0.4 × 18 × 2.0 × 20) = 360 + 288 = 648 kPa. Option A omits the width term (surcharge only); B uses strip factor 0.5 without square correction.',
    solutionSteps: [
      'Step 1 — Terzaghi equation for square footing in sand (c = 0): q_ult = γ · D_f · N_q + 0.4 · γ · B · N_γ.',
      'Step 2 — Surcharge term: γ · D_f · N_q = 18 kN/m³ × 1.0 m × 20 = 360 kPa.',
      'Step 3 — Width term: 0.4 · γ · B · N_γ = 0.4 × 18 × 2.0 × 20 = 288 kPa.',
      'Step 4 — Total ultimate bearing capacity: q_ult = 360 + 288 = 648 kPa.'
    ],
    answerUnit: 'kPa',
    referenceSource: 'IS 6403 & Terzaghi Theory',
    difficulty: 'HARD',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL'
  }
];
