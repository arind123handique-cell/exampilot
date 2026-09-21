import type { MCQQuestion } from '../types';

/**
 * COMPREHENSIVE QUESTION BANK — ALL CIVIL ENGINEERING BRANCHES
 * Calibrated for APSC CCE / State AE and UPSC ESE / IES Standards.
 * Sourced & structured according to Testbook Civil Engineering Test Series,
 * IS Codes, and Standard Engineering References.
 */
export const CIVIL_IES_APSC_QUESTIONS: MCQQuestion[] = [
  /* ==========================================================================
     BRANCH 1: BUILDING MATERIALS & CONCRETE TECHNOLOGY
     ========================================================================== */
  {
    id: 'ies-apsc-bm-001',
    questionNumber: 301,
    examId: 'apsc-ae-civil',
    subject: 'Building Materials & Construction',
    topic: 'Cement & Concrete Technology',
    subtopic: 'Bogue Compounds & Hydration',
    stem: 'Which of the following Bogue compounds of Portland cement hydrates most rapidly and is primarily responsible for the initial setting time of concrete?',
    options: [
      { id: 'A', text: 'Tricalcium silicate (C3S)' },
      { id: 'B', text: 'Dicalcium silicate (C2S)' },
      { id: 'C', text: 'Tricalcium aluminate (C3A)' },
      { id: 'D', text: 'Tetracalcium aluminoferrite (C4AF)' }
    ],
    correctOption: 'C',
    formulaContext: 'Hydration Rate: C3A > C4AF > C3S > C2S',
    explanation: 'Tricalcium aluminate (C3A) hydrates within the first 24 hours, releasing high heat of hydration (~865 J/g) and causing flash set if gypsum is not added. C3S provides early strength (first 7-28 days), while C2S hydrates slowly and provides progressive ultimate strength.',
    referenceSource: 'IS 269:2015 & Shetty Concrete Technology',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'CONCEPTUAL',
    pyqExam: 'APSC AE Civil 2024 / Testbook State AE Series',
    pyqYear: 2024
  },
  {
    id: 'ies-apsc-bm-002',
    questionNumber: 302,
    examId: 'upsc-ies-civil',
    subject: 'Building Materials & Construction',
    topic: 'Concrete Mix & Testing',
    subtopic: 'Workability & Testing Methods',
    stem: 'Consider the following statements regarding the workability measurement of fresh concrete:\n1. The Slump test is suitable for medium to high workability concrete (slumps 10 mm to 200 mm).\n2. The Compacting Factor test is more sensitive and precise for very low workability concrete.\n3. The Vee-Bee Consistometer test measures the remolding effort in seconds and is best for stiff, dry mixes.\n\nWhich of the above statements are correct?',
    options: [
      { id: 'A', text: '1 and 2 only' },
      { id: 'B', text: '2 and 3 only' },
      { id: 'C', text: '1 and 3 only' },
      { id: 'D', text: '1, 2 and 3' }
    ],
    correctOption: 'D',
    formulaContext: 'Compacting Factor = (Weight of partially compacted concrete) / (Weight of fully compacted concrete)',
    explanation: 'All three statements are correct as per IS 1199 (Part 2): 2018. Slump test loses sensitivity at low workability (<10 mm) or high collapse slumps; Compacting factor test operates reliably between 0.70 to 0.98; Vee-Bee test is designed specifically for zero-slump roller-compacted or precast concrete.',
    referenceSource: 'IS 1199 (Part 2): 2018 & UPSC ESE 2022',
    difficulty: 'HARD',
    sourceType: 'MODELLED',
    questionType: 'ASSERTION_REASON',
    pyqExam: 'UPSC ESE / Testbook Advanced Civil Series',
    pyqYear: 2022
  },
  {
    id: 'ies-apsc-bm-003',
    questionNumber: 303,
    examId: 'apsc-ae-civil',
    subject: 'Building Materials & Construction',
    topic: 'Aggregates & Tests',
    subtopic: 'Flakiness and Elongation',
    stem: 'As per IS 2386 (Part 1), an aggregate particle is defined as "flaky" if its least dimension (thickness) is less than:',
    options: [
      { id: 'A', text: '0.6 times its mean sieve dimension' },
      { id: 'B', text: '0.8 times its mean sieve dimension' },
      { id: 'C', text: '1.8 times its mean sieve dimension' },
      { id: 'D', text: '0.5 times its mean sieve dimension' }
    ],
    correctOption: 'A',
    formulaContext: 'Flakiness: t < 0.6 · d_mean ; Elongation: L > 1.8 · d_mean',
    explanation: 'According to IS 2386 (Part 1), an aggregate particle is classified as flaky if its thickness is less than 0.6 (or 3/5) of its mean sieve dimension. It is elongated if its length exceeds 1.8 (or 9/5) times the mean sieve dimension.',
    referenceSource: 'IS 2386 (Part 1):1963, Cl. 4.2',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'CODE_RULE_BASED',
    pyqExam: 'APSC CCE / Testbook Civil AE Pack',
    pyqYear: 2023
  },
  {
    id: 'ies-apsc-bm-004',
    questionNumber: 304,
    examId: 'upsc-ies-civil',
    subject: 'Building Materials & Construction',
    topic: 'Timber & Defects',
    subtopic: 'Seasoning & Moisture Content',
    stem: 'In the context of timber technology, what is the Fiber Saturation Point (FSP), and what happens when timber dries below the FSP?',
    options: [
      { id: 'A', text: 'FSP is around 12% moisture; drying below it increases weight without shrinkage' },
      { id: 'B', text: 'FSP is around 25-30% moisture; drying below it initiates dimensional shrinkage and increases strength' },
      { id: 'C', text: 'FSP is 100% moisture; drying below it causes fungal decay' },
      { id: 'D', text: 'FSP is 50% moisture; drying below it reduces modulus of elasticity' },
    ],
    correctOption: 'B',
    formulaContext: 'Moisture content at FSP ≈ 25% to 30%',
    explanation: 'The Fiber Saturation Point is the moisture content (usually 25% to 30%) at which all free water from cell cavities has evaporated, while cell walls remain fully saturated. Removal of bound water below the FSP causes shrinkage, warping, and an increase in strength and elastic modulus.',
    referenceSource: 'IS 399 & UPSC ESE 2021',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'CONCEPTUAL',
    pyqExam: 'UPSC ESE / Testbook Technical Test',
    pyqYear: 2021
  },

  /* ==========================================================================
     BRANCH 2: STRENGTH OF MATERIALS (SOM)
     ========================================================================== */
  {
    id: 'ies-apsc-som-001',
    questionNumber: 305,
    examId: 'apsc-ae-civil',
    subject: 'Strength of Materials',
    topic: 'Elastic Constants',
    subtopic: 'Interrelationships of E, G, K, μ',
    stem: 'For an isotropic, linearly elastic material with Young\'s modulus E = 200 GPa and Poisson\'s ratio μ = 0.25, the Bulk Modulus (K) and Shear Modulus (G) are respectively:',
    options: [
      { id: 'A', text: 'K = 133.3 GPa, G = 80 GPa' },
      { id: 'B', text: 'K = 80 GPa, G = 133.3 GPa' },
      { id: 'C', text: 'K = 100 GPa, G = 80 GPa' },
      { id: 'D', text: 'K = 133.3 GPa, G = 100 GPa' }
    ],
    correctOption: 'A',
    formulaContext: 'E = 2G(1 + μ) = 3K(1 - 2μ)',
    explanation: '1. G = E / [2(1 + μ)] = 200 / [2(1 + 0.25)] = 200 / 2.5 = 80 GPa.\n2. K = E / [3(1 - 2μ)] = 200 / [3(1 - 0.5)] = 200 / 1.5 = 133.33 GPa.',
    referenceSource: 'Gere & Timoshenko Mechanics of Materials',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL',
    pyqExam: 'APSC AE Civil 2023 / Testbook SOM Bank',
    pyqYear: 2023
  },
  {
    id: 'ies-apsc-som-002',
    questionNumber: 306,
    examId: 'upsc-ies-civil',
    subject: 'Strength of Materials',
    topic: 'Principal Stresses & Mohr\'s Circle',
    subtopic: 'Pure Shear State',
    stem: 'A state of plane stress is represented by σx = +80 MPa, σy = -80 MPa, and τxy = 0. What is the maximum in-plane shear stress and the orientation of the maximum shear stress plane?',
    options: [
      { id: 'A', text: 'τ_max = 80 MPa at 45° to the principal axes' },
      { id: 'B', text: 'τ_max = 160 MPa at 90° to the principal axes' },
      { id: 'C', text: 'τ_max = 40 MPa at 45° to the principal axes' },
      { id: 'D', text: 'τ_max = 0 MPa' }
    ],
    correctOption: 'A',
    formulaContext: 'τ_max = (σ1 - σ2) / 2 = [80 - (-80)] / 2 = 80 MPa',
    explanation: 'The given stresses σx and σy are principal stresses (since τxy = 0). The center of Mohr\'s circle is at (σx + σy)/2 = (80 - 80)/2 = 0. The radius R = (σ1 - σ2)/2 = 80 MPa. Maximum shear stress equals the radius, τ_max = 80 MPa, occurring at 2θ = 90° on Mohr\'s circle, i.e., θ = 45° in the physical element.',
    referenceSource: 'UPSC ESE 2020 / Testbook Strength of Materials',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'CONCEPTUAL',
    pyqExam: 'UPSC ESE / Testbook Advanced Series',
    pyqYear: 2020
  },
  {
    id: 'ies-apsc-som-003',
    questionNumber: 307,
    examId: 'upsc-ies-civil',
    subject: 'Strength of Materials',
    topic: 'Columns & Struts',
    subtopic: 'Euler\'s Critical Buckling Load',
    stem: 'A solid circular steel column of diameter D and length L is fixed at both ends. If the boundary conditions are changed such that one end is fixed and the other end is hinged, by what ratio does the Euler buckling load change?',
    options: [
      { id: 'A', text: 'Reduces by a factor of 2.0' },
      { id: 'B', text: 'Decreases by approximately 49% (ratio ≈ 0.505)' },
      { id: 'C', text: 'Increases by 25%' },
      { id: 'D', text: 'Decreases to exactly 0.25 of its original value' }
    ],
    correctOption: 'B',
    formulaContext: 'P_cr = π²EI / (L_e)² ; Both fixed: L_e1 = 0.5L ; One fixed, one hinged: L_e2 = 0.707L',
    explanation: 'For both ends fixed: L_e1 = 0.5 L → P1 = π²EI / (0.5L)² = 4 π²EI / L².\nFor one fixed, one hinged: L_e2 = L / √2 ≈ 0.707L → P2 = π²EI / (0.707L)² = 2 π²EI / L².\nRatio P2 / P1 = 2 / 4 = 0.50 (a 50% decrease).',
    referenceSource: 'IS 800:2007 Cl. 7.2.2 & UPSC ESE 2022',
    difficulty: 'HARD',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL',
    pyqExam: 'UPSC ESE 2022 / Testbook Civil Master',
    pyqYear: 2022
  },

  /* ==========================================================================
     BRANCH 3: STRUCTURAL ANALYSIS
     ========================================================================== */
  {
    id: 'ies-apsc-sa-001',
    questionNumber: 308,
    examId: 'apsc-ae-civil',
    subject: 'Structural Analysis',
    topic: 'Static & Kinematic Indeterminacy',
    subtopic: 'Plane Frames',
    stem: 'A symmetrical single-bay, two-story rigid plane frame has fixed supports at the base. Neglecting axial deformations, what is the degree of kinematic indeterminacy (Dk)?',
    options: [
      { id: 'A', text: 'Dk = 4' },
      { id: 'B', text: 'Dk = 6' },
      { id: 'C', text: 'Dk = 8' },
      { id: 'D', text: 'Dk = 12' }
    ],
    correctOption: 'B',
    formulaContext: 'Dk = 3j - r - m_axial ; Joint count j = 6, r = 6 (two fixed bases), m = 6 members',
    explanation: 'Number of joints j = 6 (2 base joints + 4 elevated beam-column joints).\nFree joints = 4. Each free rigid joint in a plane frame has 3 degrees of freedom (θ, Δx, Δy).\nIf axial deformation is neglected: each story has 1 sway degree of freedom (2 total sway), plus rotation at each of the 4 elevated joints (4 θ). Total Dk = 4 + 2 = 6.\nFormula: Dk = 3(6) - 2(3) - 6 = 18 - 6 - 6 = 6.',
    referenceSource: 'Devdas Menon Structural Analysis',
    difficulty: 'HARD',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL',
    pyqExam: 'APSC AE Civil 2024 / Testbook Structural Series',
    pyqYear: 2024
  },
  {
    id: 'ies-apsc-sa-002',
    questionNumber: 309,
    examId: 'upsc-ies-civil',
    subject: 'Structural Analysis',
    topic: 'Moment Distribution Method',
    subtopic: 'Stiffness & Carry-Over Factors',
    stem: 'In the Moment Distribution Method (Hardy Cross), when a moment M is applied at the near joint A of a uniform prismatic member AB, what is the rotational stiffness and carry-over factor to far end B if B is hinged?',
    options: [
      { id: 'A', text: 'Stiffness = 4EI/L, Carry-Over Factor = 0.5' },
      { id: 'B', text: 'Stiffness = 3EI/L, Carry-Over Factor = 0' },
      { id: 'C', text: 'Stiffness = 2EI/L, Carry-Over Factor = 0.5' },
      { id: 'D', text: 'Stiffness = 4EI/L, Carry-Over Factor = -1.0' }
    ],
    correctOption: 'B',
    formulaContext: 'Far end hinged: K = 3EI/L, COF = 0 ; Far end fixed: K = 4EI/L, COF = 1/2',
    explanation: 'When the far end is hinged, it cannot resist any bending moment (M_B = 0). Thus, no moment is carried over (COF = 0). The moment required to produce unit rotation at joint A is K = 3EI/L. If far end B were fixed, stiffness would be 4EI/L with COF = +1/2.',
    referenceSource: 'Ramamrutham Structural Analysis & UPSC ESE 2019',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'CONCEPTUAL',
    pyqExam: 'UPSC ESE / Testbook Advanced Series',
    pyqYear: 2019
  },

  /* ==========================================================================
     BRANCH 4: DESIGN OF CONCRETE STRUCTURES (RCC) & PRESTRESSED CONCRETE
     ========================================================================== */
  {
    id: 'ies-apsc-rcc-001',
    questionNumber: 310,
    examId: 'apsc-ae-civil',
    subject: 'Reinforced Concrete Structures',
    topic: 'IS 456:2000 Limit State Design',
    subtopic: 'Maximum Shear Stress & Critical Section',
    stem: 'As per IS 456:2000 Clause 40.2.3, the maximum shear stress in concrete with shear reinforcement (τc,max) for M25 grade concrete is:',
    options: [
      { id: 'A', text: '2.5 MPa' },
      { id: 'B', text: '2.8 MPa' },
      { id: 'C', text: '3.1 MPa' },
      { id: 'D', text: '3.5 MPa' }
    ],
    correctOption: 'C',
    formulaContext: 'Table 20 of IS 456:2000: τc,max = 0.62 · √(fck) ; for M25: 0.62 × 5 = 3.1 N/mm²',
    explanation: 'Per IS 456:2000 Table 20:\nFor M15: 2.5 N/mm²\nFor M20: 2.8 N/mm²\nFor M25: 3.1 N/mm²\nFor M30: 3.5 N/mm²\nFor M35: 3.7 N/mm²\nIf nominal shear stress τv exceeds τc,max, the section must be redesigned (increasing depth or width), regardless of shear steel.',
    referenceSource: 'IS 456:2000, Table 20 & Cl. 40.2.3',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'CODE_RULE_BASED',
    pyqExam: 'APSC AE Civil 2024 / Testbook Civil AE',
    pyqYear: 2024
  },
  {
    id: 'ies-apsc-rcc-002',
    questionNumber: 311,
    examId: 'upsc-ies-civil',
    subject: 'Reinforced Concrete Structures',
    topic: 'Prestressed Concrete IS 1343:2012',
    subtopic: 'Prestress Losses & Load Balancing',
    stem: 'A post-tensioned prestressed concrete beam of span 12 m is prestressed with a parabolic tendon having zero eccentricity at supports and an eccentricity "e" at midspan. If the tendon carries an effective prestressing force P, what upward equivalent distributed load does the tendon exert on the concrete beam?',
    options: [
      { id: 'A', text: 'w_eq = 4 P e / L²' },
      { id: 'B', text: 'w_eq = 8 P e / L²' },
      { id: 'C', text: 'w_eq = 12 P e / L²' },
      { id: 'D', text: 'w_eq = 2 P e / L²' }
    ],
    correctOption: 'B',
    formulaContext: 'Equivalent upward load: w_eq = 8 P e / L²',
    explanation: 'By the load balancing concept (T.Y. Lin), a parabolic tendon profile with dip e acts as a suspended cable. From cable statics, the upward balancing pressure exerted on the concrete beam is w_eq = 8 P e / L². When w_eq matches the dead load of the beam, the member is subjected to pure axial compression without bending.',
    referenceSource: 'IS 1343:2012 & Krishna Raju Prestressed Concrete',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'FORMULA_RECALL',
    pyqExam: 'UPSC ESE / Testbook Advanced Series',
    pyqYear: 2023
  },

  /* ==========================================================================
     BRANCH 5: DESIGN OF STEEL STRUCTURES (IS 800:2007)
     ========================================================================== */
  {
    id: 'ies-apsc-steel-001',
    questionNumber: 312,
    examId: 'apsc-ae-civil',
    subject: 'Design of Steel Structures',
    topic: 'Compression Members',
    subtopic: 'Slenderness Ratio Limits',
    stem: 'As per IS 800:2007 Table 3, what is the maximum permissible slenderness ratio (KL/r) for a tension member in which reversal of direct stress occurs due to loads other than wind or seismic loads?',
    options: [
      { id: 'A', text: '180' },
      { id: 'B', text: '250' },
      { id: 'C', text: '350' },
      { id: 'D', text: '400' }
    ],
    correctOption: 'A',
    formulaContext: 'IS 800:2007 Table 3 — Maximum Slenderness Ratios',
    explanation: 'According to Table 3 of IS 800:2007:\n1. Compression members carrying dead and imposed load: 180.\n2. Tension member in which reversal of stress occurs due to loads other than wind/earthquake: 180.\n3. Compression member carrying loads resulting from wind/earthquake: 250.\n4. Members normally acting as ties in roof truss (reversal due to wind/earthquake): 350.',
    referenceSource: 'IS 800:2007, Table 3',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'CODE_RULE_BASED',
    pyqExam: 'APSC AE Civil 2023 / Testbook Steel Bank',
    pyqYear: 2023
  },
  {
    id: 'ies-apsc-steel-002',
    questionNumber: 313,
    examId: 'upsc-ies-civil',
    subject: 'Design of Steel Structures',
    topic: 'Plastic Analysis',
    subtopic: 'Shape Factors of Standard Sections',
    stem: 'Match List-I (Cross Section) with List-II (Shape Factor in Plastic Bending) and select the correct answer:\n\nList-I:\nA. Solid Circular Section\nB. Diamond Section (tip at top/bottom)\nC. Solid Rectangular Section\nD. Standard I-section (major axis)\n\nList-II:\n1. 1.50\n2. 1.70\n3. 2.00\n4. 1.12 to 1.15',
    options: [
      { id: 'A', text: 'A-2, B-3, C-1, D-4' },
      { id: 'B', text: 'A-3, B-2, C-1, D-4' },
      { id: 'C', text: 'A-2, B-1, C-3, D-4' },
      { id: 'D', text: 'A-1, B-3, C-2, D-4' }
    ],
    correctOption: 'A',
    formulaContext: 'Shape Factor S = Z_p / Z_e',
    explanation: 'Shape factors represent the reserve capacity between first yield and fully plastic hinge:\n- Solid Rectangle: S = 1.50\n- Solid Circle: S = 16 / (3π) ≈ 1.70\n- Diamond (Rhombus): S = 2.00\n- Triangular Section: S = 2.343\n- Standard I-Section: S ≈ 1.12 to 1.15.',
    referenceSource: 'UPSC ESE 2021 & S.K. Duggal Steel Structures',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'MATCH_FOLLOWING',
    pyqExam: 'UPSC ESE / Testbook Civil Master',
    pyqYear: 2021
  },

  /* ==========================================================================
     BRANCH 6: GEOTECHNICAL ENGINEERING & FOUNDATION DESIGN
     ========================================================================== */
  {
    id: 'ies-apsc-geo-001',
    questionNumber: 314,
    examId: 'apsc-ae-civil',
    subject: 'Geotechnical Engineering',
    topic: 'Permeability & Seepage',
    subtopic: 'Critical Hydraulic Gradient & Quicksand',
    stem: 'A cohesionless soil has a specific gravity G = 2.65 and a void ratio e = 0.65. What is the critical hydraulic gradient (ic) at which boiling or quicksand condition takes place?',
    options: [
      { id: 'A', text: '0.80' },
      { id: 'B', text: '1.00' },
      { id: 'C', text: '1.25' },
      { id: 'D', text: '0.65' }
    ],
    correctOption: 'B',
    formulaContext: 'i_c = (G - 1) / (1 + e)',
    explanation: 'The critical hydraulic gradient occurs when upward seepage pressure balances submerged unit weight (effective stress σ\' = 0):\ni_c = (G - 1) / (1 + e) = (2.65 - 1) / (1 + 0.65) = 1.65 / 1.65 = 1.00.\nFor most natural sands G ≈ 2.65 and e ≈ 0.65, meaning i_c is approximately 1.0.',
    referenceSource: 'Terzaghi Soil Mechanics & APSC AE 2024',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL',
    pyqExam: 'APSC AE Civil 2024 / Testbook Geotech Pack',
    pyqYear: 2024
  },
  {
    id: 'ies-apsc-geo-002',
    questionNumber: 315,
    examId: 'upsc-ies-civil',
    subject: 'Geotechnical Engineering',
    topic: 'Lateral Earth Pressure',
    subtopic: 'Rankine Active Earth Pressure with Cohesion',
    stem: 'A vertical retaining wall supports a cohesive soil backfill with unit weight γ = 18 kN/m³, cohesion c = 20 kPa, and friction angle φ = 0°. At what depth below the ground surface is the net active lateral earth pressure zero (tension crack depth)?',
    options: [
      { id: 'A', text: '1.11 m' },
      { id: 'B', text: '2.22 m' },
      { id: 'C', text: '3.33 m' },
      { id: 'D', text: '4.44 m' }
    ],
    correctOption: 'B',
    formulaContext: 'p_a = γ · z · K_a - 2c · √(K_a) = 0 → z_c = 2c / (γ · √(K_a))',
    explanation: 'For pure clay (φ = 0°), Rankine active pressure coefficient K_a = (1 - sin 0°)/(1 + sin 0°) = 1.0.\nThe active lateral pressure at depth z is p_a = γ · z - 2c.\nSetting p_a = 0 gives:\nz_c = 2c / γ = (2 × 20) / 18 = 40 / 18 = 2.22 m.\n(Note: The total unsupported depth of vertical cut is 2 z_c = 4.44 m).',
    referenceSource: 'K.R. Arora Soil Mechanics & UPSC ESE 2022',
    difficulty: 'HARD',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL',
    pyqExam: 'UPSC ESE / Testbook Advanced Series',
    pyqYear: 2022
  },

  /* ==========================================================================
     BRANCH 7: FLUID MECHANICS & OPEN CHANNEL HYDRAULICS
     ========================================================================== */
  {
    id: 'ies-apsc-fm-001',
    questionNumber: 316,
    examId: 'apsc-ae-civil',
    subject: 'Fluid Mechanics & Hydraulics',
    topic: 'Fluid Statics & Buoyancy',
    subtopic: 'Metacentric Height & Stability',
    stem: 'For a floating body to be in stable equilibrium, which condition regarding the Metacenter (M), Center of Gravity (G), and Center of Buoyancy (B) must be satisfied?',
    options: [
      { id: 'A', text: 'Metacenter M must lie above Center of Gravity G (GM > 0)' },
      { id: 'B', text: 'Center of Buoyancy B must lie above Center of Gravity G' },
      { id: 'C', text: 'Metacenter M must coincide with Center of Buoyancy B' },
      { id: 'D', text: 'Metacenter M must lie below Center of Gravity G' }
    ],
    correctOption: 'A',
    formulaContext: 'GM = (I / V) - BG ; Stable when GM > 0 (M above G)',
    explanation: 'For a floating body, the restoring couple is generated when the metacenter M lies above the center of gravity G (GM > 0). If M is below G (GM < 0), an overturning couple develops causing unstable equilibrium. For fully submerged bodies, stability requires B to lie above G.',
    referenceSource: 'Modi & Seth Fluid Mechanics & APSC AE 2023',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'CONCEPTUAL',
    pyqExam: 'APSC AE Civil 2023 / Testbook Fluid Mechanics',
    pyqYear: 2023
  },
  {
    id: 'ies-apsc-fm-002',
    questionNumber: 317,
    examId: 'upsc-ies-civil',
    subject: 'Fluid Mechanics & Hydraulics',
    topic: 'Open Channel Flow',
    subtopic: 'Hydraulic Jump & Energy Dissipation',
    stem: 'In a horizontal rectangular open channel, a hydraulic jump occurs with initial depth y1 = 0.5 m and upstream Froude number Fr1 = 4.0. The post-jump sequent depth y2 is:',
    options: [
      { id: 'A', text: '2.08 m' },
      { id: 'B', text: '2.59 m' },
      { id: 'C', text: '3.14 m' },
      { id: 'D', text: '1.75 m' }
    ],
    correctOption: 'B',
    formulaContext: 'y2 / y1 = 0.5 · [√(1 + 8 · Fr1²) - 1]',
    explanation: 'Applying the Belanger momentum equation for rectangular channels:\ny2 / y1 = 0.5 × [√(1 + 8 × 4²) - 1] = 0.5 × [√(1 + 128) - 1] = 0.5 × [√129 - 1]\n√129 ≈ 11.358\ny2 / y1 = 0.5 × (11.358 - 1) = 0.5 × 10.358 = 5.179\nTherefore y2 = 0.5 m × 5.179 = 2.589 m ≈ 2.59 m.',
    referenceSource: 'K. Subramanya Open Channel Flow & UPSC ESE 2023',
    difficulty: 'HARD',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL',
    pyqExam: 'UPSC ESE / Testbook Advanced Civil Series',
    pyqYear: 2023
  },

  /* ==========================================================================
     BRANCH 8: HYDROLOGY & IRRIGATION ENGINEERING
     ========================================================================== */
  {
    id: 'ies-apsc-hydro-001',
    questionNumber: 318,
    examId: 'apsc-ae-civil',
    subject: 'Hydrology & Irrigation',
    topic: 'Crop Water Requirements',
    subtopic: 'Duty, Delta & Base Period',
    stem: 'If the base period of a crop is 120 days and the total delta required is 108 cm, what is the duty of irrigation water at the field head?',
    options: [
      { id: 'A', text: '960 hectares/cumec' },
      { id: 'B', text: '1152 hectares/cumec' },
      { id: 'C', text: '864 hectares/cumec' },
      { id: 'D', text: '1200 hectares/cumec' }
    ],
    correctOption: 'A',
    formulaContext: 'Δ = (8.64 · B) / D  →  D = (8.64 · B) / Δ',
    explanation: 'Given: Base period B = 120 days, Delta Δ = 108 cm = 1.08 m.\nD = (8.64 × B) / Δ = (8.64 × 120) / 1.08 = 1036.8 / 1.08 = 960 hectares/cumec.',
    referenceSource: 'S.K. Garg Irrigation Engineering & APSC AE 2024',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL',
    pyqExam: 'APSC AE Civil 2024 / Testbook Irrigation Bank',
    pyqYear: 2024
  },
  {
    id: 'ies-apsc-hydro-002',
    questionNumber: 319,
    examId: 'upsc-ies-civil',
    subject: 'Hydrology & Irrigation',
    topic: 'Canal Design Theories',
    subtopic: 'Lacey\'s Silt Theory',
    stem: 'As per Lacey\'s regime theory for alluvium canals, if the design discharge Q is 64 m³/s, the regime wetted perimeter (P) of the stable channel is:',
    options: [
      { id: 'A', text: '38.0 m' },
      { id: 'B', text: '42.5 m' },
      { id: 'C', text: '47.5 m' },
      { id: 'D', text: '30.4 m' }
    ],
    correctOption: 'A',
    formulaContext: 'P = 4.75 · √(Q)',
    explanation: 'Lacey\'s regime equation for wetted perimeter is P = 4.75 √Q.\nFor Q = 64 m³/s:\nP = 4.75 × √64 = 4.75 × 8 = 38.0 m.\nNotice that wetted perimeter in Lacey\'s theory depends solely on discharge Q and is completely independent of the silt factor f.',
    referenceSource: 'Lacey Regime Equations & UPSC ESE 2020',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL',
    pyqExam: 'UPSC ESE / Testbook Advanced Series',
    pyqYear: 2020
  },

  /* ==========================================================================
     BRANCH 9: ENVIRONMENTAL ENGINEERING
     ========================================================================== */
  {
    id: 'ies-apsc-env-001',
    questionNumber: 320,
    examId: 'apsc-ae-civil',
    subject: 'Environmental Engineering',
    topic: 'Water Quality Parameters',
    subtopic: 'Drinking Water Standards IS 10500:2012',
    stem: 'As per IS 10500:2012, what is the acceptable limit and the permissible limit in the absence of an alternate source for Total Dissolved Solids (TDS) in drinking water?',
    options: [
      { id: 'A', text: 'Acceptable: 200 mg/L; Permissible: 500 mg/L' },
      { id: 'B', text: 'Acceptable: 500 mg/L; Permissible: 2000 mg/L' },
      { id: 'C', text: 'Acceptable: 250 mg/L; Permissible: 1000 mg/L' },
      { id: 'D', text: 'Acceptable: 100 mg/L; Permissible: 600 mg/L' }
    ],
    correctOption: 'B',
    formulaContext: 'IS 10500:2012 Table 1 — Physical and Chemical Parameters',
    explanation: 'Under IS 10500:2012:\n- TDS: Acceptable limit is 500 mg/L, Permissible limit in the absence of alternate source is 2000 mg/L.\n- Total Hardness (as CaCO3): Acceptable is 200 mg/L, Permissible is 600 mg/L.\n- Chlorides: Acceptable is 250 mg/L, Permissible is 1000 mg/L.\n- Fluoride: Acceptable is 1.0 mg/L, Permissible is 1.5 mg/L.',
    referenceSource: 'IS 10500:2012 & CPHEEO Manual',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'CODE_RULE_BASED',
    pyqExam: 'APSC CCE / Testbook Environmental Bank',
    pyqYear: 2023
  },
  {
    id: 'ies-apsc-env-002',
    questionNumber: 321,
    examId: 'upsc-ies-civil',
    subject: 'Environmental Engineering',
    topic: 'Biological Wastewater Treatment',
    subtopic: 'Activated Sludge Process Kinetics',
    stem: 'An activated sludge aeration tank has a volume of 1200 m³. It treats wastewater flowing at 3000 m³/day with an influent BOD of 200 mg/L. The Mixed Liquor Suspended Solids (MLSS) concentration in the tank is maintained at 2500 mg/L. Calculate the Food-to-Microorganism (F/M) ratio.',
    options: [
      { id: 'A', text: '0.20 kg BOD / kg MLSS·day' },
      { id: 'B', text: '0.35 kg BOD / kg MLSS·day' },
      { id: 'C', text: '0.50 kg BOD / kg MLSS·day' },
      { id: 'D', text: '0.15 kg BOD / kg MLSS·day' }
    ],
    correctOption: 'A',
    formulaContext: 'F/M = (Q · S0) / (V · X)',
    explanation: '1. Food applied per day = Q × S0 = 3000 m³/day × 200 g/m³ = 600,000 g/day = 600 kg BOD/day.\n2. Total microorganisms in tank = V × X = 1200 m³ × 2500 g/m³ = 3,000,000 g = 3000 kg MLSS.\n3. F/M = (Food) / (Microorganisms) = 600 / 3000 = 0.20 day⁻¹ (kg BOD / kg MLSS·day).\nThis falls squarely in the conventional ASP operating range (0.2 to 0.4).',
    referenceSource: 'Metcalf & Eddy Wastewater Engineering & UPSC ESE 2021',
    difficulty: 'HARD',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL',
    pyqExam: 'UPSC ESE / Testbook Advanced Series',
    pyqYear: 2021
  },

  /* ==========================================================================
     BRANCH 10: TRANSPORTATION & HIGHWAY ENGINEERING
     ========================================================================== */
  {
    id: 'ies-apsc-trans-001',
    questionNumber: 322,
    examId: 'apsc-ae-civil',
    subject: 'Transportation Engineering',
    topic: 'Geometric Design of Highways',
    subtopic: 'Superelevation for Mixed Traffic',
    stem: 'As per Indian Roads Congress (IRC 73 / IRC 86), what is the design formula for equilibrium superelevation (e) on horizontal curves when designing for mixed traffic conditions (accounting for 75% of design speed)?',
    options: [
      { id: 'A', text: 'e = V² / (127 R)' },
      { id: 'B', text: 'e = V² / (225 R)' },
      { id: 'C', text: 'e = V² / (254 R)' },
      { id: 'D', text: 'e = (0.75 V)² / (127 R)' }
    ],
    correctOption: 'B',
    formulaContext: 'e = (0.75 V)² / (127 R) = V² / [127 / (0.75)² R] = V² / (225 R)',
    explanation: 'IRC recommends designing superelevation neglecting lateral friction (f = 0) and considering 75% of design speed V (in km/h) to cater to slow mixed traffic.\ne = (0.75 V)² / (127 R) = (0.5625 V²) / (127 R) = V² / (225 R).\nMaximum values permitted are: 7% for plain and rolling terrain, 10% for hilly terrain without snow, and 4% for urban roads.',
    referenceSource: 'IRC 73:1980 & Khanna & Justo Highway Engineering',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'CODE_RULE_BASED',
    pyqExam: 'APSC AE Civil 2024 / Testbook Highway Series',
    pyqYear: 2024
  },
  {
    id: 'ies-apsc-trans-002',
    questionNumber: 323,
    examId: 'upsc-ies-civil',
    subject: 'Transportation Engineering',
    topic: 'Traffic Engineering',
    subtopic: 'Greenshields Model & Capacity',
    stem: 'A highway traffic stream obeys the Greenshields linear speed-density model with a free-flow speed of Vf = 80 km/h and a jam density of kj = 120 vehicles/km. What is the maximum traffic capacity (q_max) of this single lane?',
    options: [
      { id: 'A', text: '1800 vehicles/hour' },
      { id: 'B', text: '2400 vehicles/hour' },
      { id: 'C', text: '3600 vehicles/hour' },
      { id: 'D', text: '4800 vehicles/hour' }
    ],
    correctOption: 'B',
    formulaContext: 'q_max = (V_f · k_j) / 4',
    explanation: 'In the Greenshields linear model v = V_f (1 - k / k_j):\nFlow q = v · k = V_f (k - k² / k_j).\nMaximum flow occurs at speed v_opt = V_f / 2 = 40 km/h and density k_opt = k_j / 2 = 60 veh/km.\nTherefore q_max = (V_f / 2) × (k_j / 2) = (V_f · k_j) / 4 = (80 × 120) / 4 = 9600 / 4 = 2400 vehicles/hour.',
    referenceSource: 'Kadiyali Traffic Engineering & UPSC ESE 2022',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL',
    pyqExam: 'UPSC ESE / Testbook Traffic Pack',
    pyqYear: 2022
  },

  /* ==========================================================================
     BRANCH 11: SURVEYING & GEOMATICS / GIS
     ========================================================================== */
  {
    id: 'ies-apsc-sur-001',
    questionNumber: 324,
    examId: 'apsc-ae-civil',
    subject: 'Surveying & Geomatics',
    topic: 'Compass Surveying',
    subtopic: 'Magnetic Declination',
    stem: 'The magnetic bearing of a line AB is observed as S 42° 30\' E. If the magnetic declination at the station is 3° 15\' West, what is the True Bearing of line AB in Whole Circle Bearing (WCB)?',
    options: [
      { id: 'A', text: '134° 15\'' },
      { id: 'B', text: '140° 45\'' },
      { id: 'C', text: '137° 30\'' },
      { id: 'D', text: '144° 15\'' }
    ],
    correctOption: 'A',
    formulaContext: 'WCB = 180° - RB (in SE quadrant) ; True Bearing = Magnetic Bearing - Declination (West)',
    explanation: '1. Convert Reduced Bearing S 42° 30\' E to WCB:\nMagnetic WCB = 180° - 42° 30\' = 137° 30\'.\n2. Since declination is West, True Bearing = Magnetic Bearing - Declination (West):\nTrue Bearing = 137° 30\' - 3° 15\' = 134° 15\'.',
    referenceSource: 'B.C. Punmia Surveying Vol I & APSC AE 2023',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL',
    pyqExam: 'APSC AE Civil 2023 / Testbook Surveying Series',
    pyqYear: 2023
  },
  {
    id: 'ies-apsc-sur-002',
    questionNumber: 325,
    examId: 'upsc-ies-civil',
    subject: 'Surveying & Geomatics',
    topic: 'Leveling & Curvature Correction',
    subtopic: 'Reciprocal Leveling',
    stem: 'Reciprocal leveling is a specialized method employed when leveling across a wide river or ravine. Which of the following errors does reciprocal leveling completely eliminate?\n1. Curvature of the earth\n2. Atmospheric refraction (assuming steady atmosphere)\n3. Collimation error of the instrument\n4. Error due to non-verticality of the leveling staff',
    options: [
      { id: 'A', text: '1 and 3 only' },
      { id: 'B', text: '1, 2 and 3 only' },
      { id: 'C', text: '2, 3 and 4 only' },
      { id: 'D', text: '1, 2, 3 and 4' }
    ],
    correctOption: 'B',
    formulaContext: 'True elevation difference h = [(ha - hb) + (ha\' - hb\')] / 2',
    explanation: 'Reciprocal leveling completely eliminates errors due to:\n- Earth curvature (constant geometry)\n- Collimation error of the instrument (equal and opposite effect)\n- Atmospheric refraction (provided observations are taken simultaneously so refraction index remains constant).\nIt does NOT eliminate staff graduation errors or errors due to staff tilt.',
    referenceSource: 'UPSC ESE 2020 & Testbook Geomatics Series',
    difficulty: 'HARD',
    sourceType: 'MODELLED',
    questionType: 'ASSERTION_REASON',
    pyqExam: 'UPSC ESE / Testbook Advanced Series',
    pyqYear: 2020
  },

  /* ==========================================================================
     BRANCH 12: CONSTRUCTION MANAGEMENT, CPM/PERT & ESTIMATING COSTING
     ========================================================================== */
  {
    id: 'ies-apsc-cpm-001',
    questionNumber: 326,
    examId: 'apsc-ae-civil',
    subject: 'Construction Management & Estimating',
    topic: 'PERT & Project Scheduling',
    subtopic: 'Expected Time & Variance',
    stem: 'An activity in a PERT network has the following three time estimates:\nOptimistic time (t_o) = 4 days\nMost likely time (t_m) = 7 days\nPessimistic time (t_p) = 16 days\n\nWhat are the expected duration (t_e) and the variance (σ²) of this activity?',
    options: [
      { id: 'A', text: 't_e = 8 days, σ² = 4 days²' },
      { id: 'B', text: 't_e = 7 days, σ² = 2 days²' },
      { id: 'C', text: 't_e = 9 days, σ² = 6 days²' },
      { id: 'D', text: 't_e = 8 days, σ² = 2 days²' }
    ],
    correctOption: 'A',
    formulaContext: 't_e = (t_o + 4·t_m + t_p) / 6 ; σ² = [(t_p - t_o) / 6]²',
    explanation: '1. Expected time t_e = (4 + 4×7 + 16) / 6 = (4 + 28 + 16) / 6 = 48 / 6 = 8 days.\n2. Standard deviation σ = (t_p - t_o) / 6 = (16 - 4) / 6 = 12 / 6 = 2 days.\n3. Variance σ² = (2)² = 4 days².',
    referenceSource: 'B.C. Punmia Project Planning with PERT & CPM',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL',
    pyqExam: 'APSC AE Civil 2024 / Testbook CPM Bank',
    pyqYear: 2024
  },
  {
    id: 'ies-apsc-cpm-002',
    questionNumber: 327,
    examId: 'upsc-ies-civil',
    subject: 'Construction Management & Estimating',
    topic: 'Valuation & Real Estate Economics',
    subtopic: 'Sinking Fund & Capitalized Value',
    stem: 'A newly constructed building with an estimated useful life of 50 years produces a net annual rental income of ₹1,80,000. If the prevailing market rate of interest on capital is 6% per annum, what is the capitalized value of the property (neglecting sinking fund)?',
    options: [
      { id: 'A', text: '₹25,00,000' },
      { id: 'B', text: '₹30,00,000' },
      { id: 'C', text: '₹36,00,000' },
      { id: 'D', text: '₹18,00,000' }
    ],
    correctOption: 'B',
    formulaContext: 'Capitalized Value = Net Annual Income × Year\'s Purchase ; YP = 100 / Rate of interest',
    explanation: 'Year\'s Purchase (YP) = 1 / i = 1 / 0.06 = 16.667 (or 100 / 6).\nCapitalized Value = Net Annual Income × YP\nCapitalized Value = ₹1,80,000 × (100 / 6) = ₹1,80,000 × 16.667 = ₹30,00,000.',
    referenceSource: 'B.N. Dutta Estimating and Costing & UPSC ESE 2021',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'NUMERICAL',
    pyqExam: 'UPSC ESE / Testbook Estimating Pack',
    pyqYear: 2021
  },

  /* ==========================================================================
     ADDITIONAL HIGH-YIELD APSC AE & UPSC ESE MCQs ACROSS BRANCHES
     ========================================================================== */
  {
    id: 'ies-apsc-bm-005',
    questionNumber: 328,
    examId: 'apsc-ae-civil',
    subject: 'Building Materials & Construction',
    topic: 'Bricks & Masonry',
    subtopic: 'Compressive Strength & Water Absorption',
    stem: 'As per IS 1077, what is the minimum compressive strength and maximum 24-hour water absorption for First Class burnt clay bricks?',
    options: [
      { id: 'A', text: 'Min strength: 10.5 N/mm²; Max water absorption: 20% by dry weight' },
      { id: 'B', text: 'Min strength: 7.0 N/mm²; Max water absorption: 22% by dry weight' },
      { id: 'C', text: 'Min strength: 3.5 N/mm²; Max water absorption: 25% by dry weight' },
      { id: 'D', text: 'Min strength: 14.0 N/mm²; Max water absorption: 15% by dry weight' }
    ],
    correctOption: 'A',
    formulaContext: 'IS 1077 Table 1: Class 10.5 bricks must absorb ≤ 20% water by weight after 24h immersion',
    explanation: 'According to IS 1077:\n- First Class bricks: Compressive strength ≥ 10.5 N/mm², 24-hour water absorption ≤ 20% by dry weight.\n- Second Class bricks: Compressive strength ≥ 7.0 N/mm², water absorption ≤ 22%.\n- Common building bricks: Minimum strength ≥ 3.5 N/mm², water absorption ≤ 25%.',
    referenceSource: 'IS 1077:1992 Common Burnt Clay Building Bricks',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'CODE_RULE_BASED',
    pyqExam: 'APSC AE Civil 2024 / Testbook Materials',
    pyqYear: 2024
  },
  {
    id: 'ies-apsc-som-004',
    questionNumber: 329,
    examId: 'upsc-ies-civil',
    subject: 'Strength of Materials',
    topic: 'Deflection of Beams',
    subtopic: 'Macaulay & Moment-Area Theorems',
    stem: 'A simply supported prismatic beam of span L carries a concentrated load W at midspan. Using Mohr\'s Moment-Area theorems, what are the slope at supports (θ_A) and deflection at midspan (δ_C)?',
    options: [
      { id: 'A', text: 'θ_A = W L² / (16 EI) ; δ_C = W L³ / (48 EI)' },
      { id: 'B', text: 'θ_A = W L² / (24 EI) ; δ_C = 5 W L³ / (384 EI)' },
      { id: 'C', text: 'θ_A = W L² / (8 EI)  ; δ_C = W L³ / (24 EI)' },
      { id: 'D', text: 'θ_A = W L² / (16 EI) ; δ_C = W L³ / (32 EI)' }
    ],
    correctOption: 'A',
    formulaContext: 'θ_A = Area(M/EI between A and C) = (1/2) · (L/2) · (WL/4EI) = WL² / (16EI)',
    explanation: 'By Mohr\'s First Theorem: The slope at A relative to midspan C (where slope is zero by symmetry) equals the area of M/EI diagram between A and C:\nθ_A = (1/2) × (L/2) × (W L / 4 EI) = W L² / (16 EI).\nBy Mohr\'s Second Theorem: δ_C = moment of M/EI area about A:\nδ_C = [W L² / (16 EI)] × [(2/3) × (L/2)] = W L³ / (48 EI).',
    referenceSource: 'UPSC ESE 2021 & S. Timoshenko Strength of Materials',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'FORMULA_RECALL',
    pyqExam: 'UPSC ESE / Testbook SOM Bank',
    pyqYear: 2021
  },
  {
    id: 'ies-apsc-rcc-003',
    questionNumber: 330,
    examId: 'apsc-ae-civil',
    subject: 'Reinforced Concrete Structures',
    topic: 'Columns & Compression Members',
    subtopic: 'Minimum Eccentricity & Short Column Criteria',
    stem: 'As per IS 456:2000 Clause 25.4, all columns must be designed for a minimum eccentricity (e_min). For an unsupported length L = 3.0 m and lateral dimension D = 400 mm, what is e_min?',
    options: [
      { id: 'A', text: '19.3 mm' },
      { id: 'B', text: '20.0 mm' },
      { id: 'C', text: '23.3 mm' },
      { id: 'D', text: '25.0 mm' }
    ],
    correctOption: 'B',
    formulaContext: 'e_min = (L / 500) + (D / 30), subject to a minimum of 20 mm',
    explanation: 'Calculating formula value:\ne_min = (3000 / 500) + (400 / 30) = 6.0 + 13.33 = 19.33 mm.\nSince IS 456 mandates that e_min shall not be less than 20 mm under any circumstances, the governing design minimum eccentricity is 20.0 mm.',
    referenceSource: 'IS 456:2000, Cl. 25.4',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'CODE_RULE_BASED',
    pyqExam: 'APSC AE Civil 2024 / Testbook RCC Pack',
    pyqYear: 2024
  },
  {
    id: 'ies-apsc-geo-003',
    questionNumber: 331,
    examId: 'upsc-ies-civil',
    subject: 'Geotechnical Engineering',
    topic: 'Consolidation & Settlement',
    subtopic: 'Terzaghi 1D Consolidation Equation',
    stem: 'In Terzaghi\'s 1-D consolidation theory, if the degree of consolidation U is less than 60%, the relationship between Time Factor (Tv) and degree of consolidation (U) is given by:',
    options: [
      { id: 'A', text: 'Tv = (π / 4) · U²' },
      { id: 'B', text: 'Tv = 1.781 - 0.933 · log10(100 - U%)' },
      { id: 'C', text: 'Tv = (4 / π) · U' },
      { id: 'D', text: 'Tv = (π / 2) · U³' }
    ],
    correctOption: 'A',
    formulaContext: 'For U ≤ 60%: Tv = (π/4) · U² ; For U > 60%: Tv = 1.781 - 0.933 log10(100 - U%)',
    explanation: 'For U ≤ 60% (i.e. U ≤ 0.60), the parabolic isochrone approximation gives Tv = (π/4) U². For example at U = 50% (0.50): Tv = (π/4)(0.5)² = 0.196. For U > 60%, the logarithmic formula Tv = 1.781 - 0.933 log10(100 - U) is used.',
    referenceSource: 'UPSC ESE 2022 & Gopal Ranjan Basic Soil Mechanics',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'FORMULA_RECALL',
    pyqExam: 'UPSC ESE / Testbook Geotech Series',
    pyqYear: 2022
  },
  {
    id: 'ies-apsc-fm-003',
    questionNumber: 332,
    examId: 'apsc-ae-civil',
    subject: 'Fluid Mechanics & Hydraulics',
    topic: 'Boundary Layer Theory',
    subtopic: 'Displacement and Momentum Thickness',
    stem: 'The ratio of momentum thickness (θ) to displacement thickness (δ*) for a boundary layer velocity profile is known as the:',
    options: [
      { id: 'A', text: 'Friction coefficient' },
      { id: 'B', text: 'Shape factor (H)' },
      { id: 'C', text: 'Drag coefficient' },
      { id: 'D', text: 'Roughness factor' }
    ],
    correctOption: 'B',
    formulaContext: 'Shape factor H = δ* / θ  (or its inverse θ / δ*)',
    explanation: 'The shape factor H is defined as the ratio of displacement thickness to momentum thickness: H = δ* / θ. For a laminar Blasius boundary layer, H ≈ 2.59. For turbulent boundary layers, H drops to between 1.3 and 1.4. A higher shape factor indicates increased susceptibility to flow separation.',
    referenceSource: 'Schlichting Boundary Layer Theory & APSC AE 2023',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'CONCEPTUAL',
    pyqExam: 'APSC AE Civil 2023 / Testbook Fluid Mechanics',
    pyqYear: 2023
  },
  {
    id: 'ies-apsc-env-003',
    questionNumber: 333,
    examId: 'upsc-ies-civil',
    subject: 'Environmental Engineering',
    topic: 'Air Pollution & Meteorology',
    subtopic: 'Plume Behavior & Atmospheric Stability',
    stem: 'When an inversion layer exists both below and above the smokestack emission height, resulting in smoke dispersing horizontally within a shallow confined layer without mixing upwards or downwards, the plume behavior is termed:',
    options: [
      { id: 'A', text: 'Looping plume' },
      { id: 'B', text: 'Fanning plume' },
      { id: 'C', text: 'Trapping plume' },
      { id: 'D', text: 'Fumigation plume' }
    ],
    correctOption: 'C',
    formulaContext: 'Trapping plume occurs when stack discharges between two stable inversion layers',
    explanation: '- Trapping plume: Inversion layers both above and below the stack trap the plume within a narrow zone, causing dangerously high ground concentrations downwind.\n- Fumigation: Inversion aloft with superadiabatic (unstable) condition below, bringing pollutants straight to the ground.\n- Looping: Highly unstable atmosphere with rapid convective dispersion.\n- Fanning: Strong inversion at all heights causing thin horizontal spread.',
    referenceSource: 'Peavy & Rowe Environmental Engineering & UPSC ESE 2022',
    difficulty: 'HARD',
    sourceType: 'MODELLED',
    questionType: 'CONCEPTUAL',
    pyqExam: 'UPSC ESE / Testbook Environmental Series',
    pyqYear: 2022
  },
  {
    id: 'ies-apsc-trans-003',
    questionNumber: 334,
    examId: 'apsc-ae-civil',
    subject: 'Transportation Engineering',
    topic: 'Pavement Design IRC 37 & IRC 58',
    subtopic: 'Rigid Pavement Stresses',
    stem: 'As per Westergaard\'s analysis of concrete pavements (IRC 58), during a hot summer afternoon, where do the maximum combined stresses (wheel load + temperature warping) occur in a concrete slab?',
    options: [
      { id: 'A', text: 'Interior region of the slab' },
      { id: 'B', text: 'Edge region of the slab' },
      { id: 'C', text: 'Corner region of the slab' },
      { id: 'D', text: 'Expansion joint' }
    ],
    correctOption: 'B',
    formulaContext: 'Critical stress combination: Edge stress = σ_load + σ_warping',
    explanation: 'In the afternoon, the top of the slab is hotter than the bottom, causing the slab edges to warp downward and inducing tensile warping stress at the bottom of the slab. Wheel load at the edge also induces maximum tensile stress at the bottom. Since both stresses are additive at the edge, the EDGE region governs the thickness design under summer day conditions.',
    referenceSource: 'IRC 58:2015 & Khanna & Justo Highway Engineering',
    difficulty: 'HARD',
    sourceType: 'MODELLED',
    questionType: 'CONCEPTUAL',
    pyqExam: 'APSC AE Civil 2024 / Testbook Highway Series',
    pyqYear: 2024
  },
  {
    id: 'ies-apsc-steel-003',
    questionNumber: 335,
    examId: 'upsc-ies-civil',
    subject: 'Design of Steel Structures',
    topic: 'Connections',
    subtopic: 'High Strength Friction Grip (HSFG) Bolts',
    stem: 'Which of the following statements regarding High-Strength Friction Grip (HSFG) bolted connections as per IS 800:2007 is INCORRECT?',
    options: [
      { id: 'A', text: 'HSFG bolts transmit load across connecting plates by interfacial friction rather than bearing on the bolt shank' },
      { id: 'B', text: 'HSFG bolts are subjected to initial tensioning (pre-stressing) during installation' },
      { id: 'C', text: 'The slip factor (coefficient of friction) μ is independent of surface treatment and is fixed at 0.55' },
      { id: 'D', text: 'HSFG connections eliminate stress concentration around bolt holes and exhibit superior fatigue resistance' }
    ],
    correctOption: 'C',
    formulaContext: 'IS 800:2007 Table 8: Slip factor μ varies from 0.20 to 0.55 depending on surface condition',
    explanation: 'Statement C is incorrect: The slip factor μ heavily depends on surface preparation (Table 8 of IS 800:2007). It is 0.55 only for blast-cleaned surfaces with spray metal coating; for clean mill scale it is 0.33, and for red lead painted surfaces it drops to 0.20.',
    referenceSource: 'IS 800:2007 Cl. 10.4 & Table 8',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'CODE_RULE_BASED',
    pyqExam: 'UPSC ESE / Testbook Steel Series',
    pyqYear: 2023
  },

  /* ==========================================================================
     BRANCH 12: GATE / ESE ADVANCED STRENGTH OF MATERIALS (civilenggforall.com)
     ========================================================================== */
  {
    id: 'ies-gate-som-001',
    questionNumber: 336,
    examId: 'upsc-ies-civil',
    subject: 'Strength of Materials',
    topic: 'Flexural Stresses in Beams',
    subtopic: 'Euler-Bernoulli Bending & Section Modulus',
    stem: 'A rectangular simply supported beam having a width of 100 mm and an overall depth of 200 mm is subjected to a maximum bending moment of 20 kN·m. Based on the Euler-Bernoulli beam theory, what is the maximum bending stress induced in the extreme fibers of the beam?',
    options: [
      { id: 'A', text: '20 MPa' },
      { id: 'B', text: '30 MPa' },
      { id: 'C', text: '45 MPa' },
      { id: 'D', text: '60 MPa' }
    ],
    correctOption: 'B',
    formulaContext: 'σ_max = M / Z = 6M / (b · d²)',
    explanation: '1. Moment of inertia about the neutral axis: I = (b · d³) / 12 = (100 × 200³) / 12 = 66.67 × 10⁶ mm⁴.\n2. Distance from neutral axis to extreme fiber: y_max = d / 2 = 100 mm.\n3. Maximum bending stress: σ = (M · y_max) / I = (20 × 10⁶ N·mm × 100 mm) / (66.67 × 10⁶ mm⁴) = 30 N/mm² = 30 MPa.\nAlternatively, using Section Modulus Z = (b · d²) / 6 = (100 × 200²) / 6 = 666.67 × 10³ mm³:\nσ_max = M / Z = (20 × 10⁶) / (666.67 × 10³) = 30 MPa.',
    referenceSource: 'GATE Civil Engineering PYQ & civilenggforall.com SOM Guide Chapter 4',
    difficulty: 'MEDIUM',
    sourceType: 'PYQ',
    questionType: 'NUMERICAL',
    pyqExam: 'GATE Civil 2018 / UPSC ESE',
    pyqYear: 2018
  },
  {
    id: 'ies-gate-som-002',
    questionNumber: 337,
    examId: 'upsc-ies-civil',
    subject: 'Strength of Materials',
    topic: 'Torsion of Circular Shafts',
    subtopic: 'Torsion Equation & Diameter Scaling',
    stem: 'A solid circular shaft of diameter d transmits a torque T, inducing a maximum shear stress τ at its outer fibers. If the shaft diameter is doubled to 2d while transmitting the identical torque T, what will be the new maximum shear stress induced in the shaft?',
    options: [
      { id: 'A', text: 'τ / 2' },
      { id: 'B', text: 'τ / 4' },
      { id: 'C', text: 'τ / 8' },
      { id: 'D', text: 'τ / 16' }
    ],
    correctOption: 'C',
    formulaContext: 'Torsion formula: T / J = τ / R ⇒ τ_max = 16T / (π · d³)',
    explanation: 'From the torsion equation:\nτ_max = (T · R) / J = T · (d/2) / (π d⁴ / 32) = 16T / (π d³).\nTherefore, shear stress τ is inversely proportional to d³ (τ ∝ 1/d³).\nWhen diameter d is replaced by 2d:\nτ_new = 16T / [π (2d)³] = 16T / [8π d³] = (1/8) · τ_old.\nThe maximum torsional shear stress reduces to 1/8th (12.5%) of its original value.',
    referenceSource: 'GATE Civil Engineering PYQ & civilenggforall.com SOM Guide Chapter 6',
    difficulty: 'EASY',
    sourceType: 'PYQ',
    questionType: 'CONCEPTUAL',
    pyqExam: 'GATE Civil 2016 / UPSC ESE',
    pyqYear: 2016
  },
  {
    id: 'ies-gate-som-003',
    questionNumber: 338,
    examId: 'upsc-ies-civil',
    subject: 'Strength of Materials',
    topic: 'Columns and Struts',
    subtopic: 'Euler Buckling & Boundary Conditions',
    stem: 'Two long, slender columns A and B have identical length L, Young\'s modulus E, and uniform circular cross-section. Column A has both ends rigidly fixed (Fixed-Fixed), whereas Column B has one end fixed and the other end completely free (Fixed-Free/Cantilever). What is the ratio of their critical Euler buckling loads (P_cr,A / P_cr,B)?',
    options: [
      { id: 'A', text: '4 : 1' },
      { id: 'B', text: '8 : 1' },
      { id: 'C', text: '16 : 1' },
      { id: 'D', text: '32 : 1' }
    ],
    correctOption: 'C',
    formulaContext: 'Euler\'s critical load: P_cr = (π² · E · I) / L_eff²',
    explanation: '1. For Column A (Both ends fixed): Effective length L_eff,A = L / 2 = 0.5 L.\n   P_cr,A = π²EI / (0.5L)² = 4 π²EI / L².\n2. For Column B (One end fixed, other free): Effective length L_eff,B = 2 L.\n   P_cr,B = π²EI / (2L)² = π²EI / (4L²).\n3. Ratio: P_cr,A / P_cr,B = (4 π²EI / L²) / (π²EI / 4L²) = 4 / (1/4) = 16 : 1.\nA fixed-fixed column is 16 times stronger against elastic buckling than a cantilever column of the same dimensions.',
    referenceSource: 'GATE Civil Engineering PYQ & civilenggforall.com SOM Guide Chapter 8',
    difficulty: 'MEDIUM',
    sourceType: 'PYQ',
    questionType: 'NUMERICAL',
    pyqExam: 'GATE Civil 2021 / UPSC ESE',
    pyqYear: 2021
  },
  {
    id: 'ies-gate-som-004',
    questionNumber: 339,
    examId: 'upsc-ies-civil',
    subject: 'Strength of Materials',
    topic: 'Simple Stress & Strain',
    subtopic: 'Axial Elongation of Standard & Tapered Bars',
    stem: 'Consider the axial elongation of bars of length L and modulus of elasticity E. Which of the following statements regarding standard elongation cases is INCORRECT?',
    options: [
      { id: 'A', text: 'The elongation of a uniform prismatic bar under its own self-weight (unit weight γ) is ΔL = γL² / (2E) = WL / (2AE)' },
      { id: 'B', text: 'The elongation of a circular bar tapering linearly from diameter d1 to d2 subjected to axial pull P is ΔL = 4PL / (π · d1 · d2 · E)' },
      { id: 'C', text: 'The elongation of a rectangular plate of constant thickness t tapering linearly in width from b1 to b2 is ΔL = [PL / (E · t · (b1 - b2))] · ln(b1 / b2)' },
      { id: 'D', text: 'A vertically suspended conical bar of height L elongates under its self-weight by exactly half (1/2) the elongation of a uniform prismatic cylinder of the same height' }
    ],
    correctOption: 'D',
    formulaContext: 'Conical bar self-weight elongation: ΔL_cone = γL² / (6E) = (1/3) · ΔL_prismatic',
    explanation: 'Statement D is INCORRECT:\n- The self-weight elongation of a vertically suspended conical bar of height L is ΔL_cone = γL² / (6E).\n- The elongation of a uniform prismatic cylinder under self-weight is ΔL_cyl = γL² / (2E).\n- Therefore, ΔL_cone = (1/3) · ΔL_cyl (exactly one-third, not one-half!). Note that this elongation is independent of the apex angle and base diameter.\nStatements A, B, and C are all standard, correct formulas derived in solid mechanics.',
    referenceSource: 'civilenggforall.com SOM Guide Chapter 1.4 & Timoshenko Mechanics of Materials',
    difficulty: 'HARD',
    sourceType: 'MODELLED',
    questionType: 'ASSERTION_REASON',
    pyqExam: 'GATE Civil / UPSC ESE',
    pyqYear: 2023
  },
  {
    id: 'ies-gate-som-005',
    questionNumber: 340,
    examId: 'apsc-ae-civil',
    subject: 'Strength of Materials',
    topic: 'Shear Stress in Beams',
    subtopic: 'Shear Stress Distribution Across Cross-Sections',
    stem: 'Consider the distribution of transverse shear stress τ = (V · Q) / (I · b) across various beam cross-sections:\n1. In a solid rectangular section, τ_max occurs at the neutral axis and equals 1.5 τ_avg.\n2. In a solid circular section, τ_max occurs at the neutral axis (diameter) and equals (4/3) τ_avg ≈ 1.33 τ_avg.\n3. In a triangular section of base b and height h (base at bottom), τ_max occurs at h/2 from the apex and equals 1.5 τ_avg, whereas at the neutral axis (h/3 from base) τ = (4/3) τ_avg.\n4. In a standard I-beam section, the flanges carry more than 80% of the total vertical shear force.\n\nWhich of the above statements are correct?',
    options: [
      { id: 'A', text: '1 and 2 only' },
      { id: 'B', text: '1, 2 and 3 only' },
      { id: 'C', text: '2, 3 and 4 only' },
      { id: 'D', text: '1, 2, 3 and 4' }
    ],
    correctOption: 'B',
    formulaContext: 'Shear stress formula: τ = (V · A · ȳ) / (I · b)',
    explanation: 'Statements 1, 2, and 3 are correct:\n- Rectangular section: τ(y) is parabolic with τ_max = 1.5 · V / (b·d) at NA.\n- Circular section: τ_max = (4/3) · V / (π R²) at NA.\n- Triangular section: τ_max occurs at mid-depth (h/2 from apex) where width is b/2, giving τ_max = 1.5 τ_avg. At the neutral axis (2h/3 from apex), τ_NA = (4/3) τ_avg = 1.33 τ_avg.\nStatement 4 is FALSE: In an I-beam, the vertical web resists 90% to 98% of the total transverse shear force. The flanges resist almost entirely bending moments (axial push-pull) and carry negligible vertical shear.',
    referenceSource: 'civilenggforall.com SOM Guide Chapter 5 & IS 800 / Gere & Timoshenko',
    difficulty: 'HARD',
    sourceType: 'MODELLED',
    questionType: 'CONCEPTUAL',
    pyqExam: 'APSC AE Civil / UPSC ESE',
    pyqYear: 2024
  },
  {
    id: 'ies-gate-som-006',
    questionNumber: 341,
    examId: 'apsc-ae-civil',
    subject: 'Strength of Materials',
    topic: 'Thin Cylinders & Spheres',
    subtopic: 'Circumferential vs Longitudinal Stress & Failure Plane',
    stem: 'A thin-walled cylindrical pipe of internal diameter d and wall thickness t (with t < d/20) contains fluid at internal gauge pressure P. What is the ratio of circumferential (hoop) stress to longitudinal stress in the cylinder shell, and why do pressurized thin pipes invariably burst longitudinally rather than circumferentially?',
    options: [
      { id: 'A', text: 'Ratio is 1 : 2; because longitudinal stress produces larger axial strain' },
      { id: 'B', text: 'Ratio is 2 : 1; because hoop stress is double the longitudinal stress, inducing failure along longitudinal seams' },
      { id: 'C', text: 'Ratio is 1 : 1; failure is governed purely by internal fluid velocity' },
      { id: 'D', text: 'Ratio is 4 : 1; because shear stress on 45° planes exceeds the ultimate tensile strength' }
    ],
    correctOption: 'B',
    formulaContext: 'Circumferential stress: σ_h = P·d / (2t); Longitudinal stress: σ_L = P·d / (4t)',
    explanation: '1. Circumferential (Hoop) Stress: σ_h = P·d / (2t), acting circumferentially on longitudinal cross-sections.\n2. Longitudinal Stress: σ_L = P·d / (4t), acting axially on transverse cross-sections.\n3. Ratio: σ_h / σ_L = [P·d / (2t)] / [P·d / (4t)] = 2 : 1.\nBecause the hoop stress trying to tear the pipe along its length is twice as large as the longitudinal stress trying to pull it apart transversely, thin pipes always split open longitudinally (lengthwise) when bursting.',
    referenceSource: 'civilenggforall.com SOM Guide Chapter 9 & Rajput Strength of Materials',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'CONCEPTUAL',
    pyqExam: 'APSC AE Civil / SSC JE',
    pyqYear: 2023
  },
  {
    id: 'ies-gate-som-007',
    questionNumber: 342,
    examId: 'upsc-ies-civil',
    subject: 'Strength of Materials',
    topic: 'Strain Energy & Springs',
    subtopic: 'Close-Coiled Helical Spring Deflection & Stiffness',
    stem: 'A close-coiled helical spring is made of wire of diameter d wound into n coils of mean coil radius R. When subjected to an axial compressive load P, what are the axial deflection δ and the spring stiffness k (where G is the shear modulus of the spring material)?',
    options: [
      { id: 'A', text: 'δ = (64 P R³ n) / (G d⁴)  and  k = (G d⁴) / (64 R³ n)' },
      { id: 'B', text: 'δ = (32 P R³ n) / (G d⁴)  and  k = (G d⁴) / (32 R³ n)' },
      { id: 'C', text: 'δ = (64 P R⁴ n) / (G d³)  and  k = (G d³) / (64 R⁴ n)' },
      { id: 'D', text: 'δ = (16 P R² n) / (G d⁴)  and  k = (G d⁴) / (16 R² n)' }
    ],
    correctOption: 'A',
    formulaContext: 'Strain energy in torsion: U = (T² · L) / (2 · G · J), with T = P·R and L = 2π·R·n',
    explanation: 'In a close-coiled helical spring, the wire is primarily subjected to torsion T = P·R.\n1. Total length of wire: L = 2π·R·n. Polar moment of inertia: J = π·d⁴ / 32.\n2. Strain energy stored: U = (T² · L) / (2 G J) = [(P R)² · 2π R n] / [2 G · (π d⁴ / 32)] = (32 P² R³ n) / (G d⁴).\n3. By Castigliano\'s theorem, axial deflection δ = ∂U / ∂P = (64 P R³ n) / (G d⁴).\n4. Spring stiffness k = P / δ = (G d⁴) / (64 R³ n).\nNotice that spring stiffness is proportional to d⁴ and inversely proportional to R³ and n.',
    referenceSource: 'civilenggforall.com SOM Guide Chapter 10 & Ramamrutham Strength of Materials',
    difficulty: 'HARD',
    sourceType: 'MODELLED',
    questionType: 'FORMULA_RECALL',
    pyqExam: 'UPSC ESE / GATE Civil',
    pyqYear: 2022
  },
  {
    id: 'ies-gate-som-008',
    questionNumber: 343,
    examId: 'apsc-ae-civil',
    subject: 'Strength of Materials',
    topic: 'Elastic Constants',
    subtopic: 'Limiting Poisson\'s Ratio & Bulk Modulus',
    stem: 'If an ideal isotropic linear elastic material undergoes deformation such that its volumetric strain is identically zero (incompressible material, e.g., ideal rubber or saturated clay under undrained loading), what are the theoretical values of its Poisson\'s ratio (μ) and its Bulk Modulus (K)?',
    options: [
      { id: 'A', text: 'μ = 0 and K = 0' },
      { id: 'B', text: 'μ = 0.25 and K = E' },
      { id: 'C', text: 'μ = 0.50 and K → ∞ (infinitely rigid in hydrostatic compression)' },
      { id: 'D', text: 'μ = -1.0 and K = G' }
    ],
    correctOption: 'C',
    formulaContext: 'Volumetric strain: ε_v = [(σx + σy + σz) / E] · (1 - 2μ); K = E / [3(1 - 2μ)]',
    explanation: '1. For a triaxial stress system, volumetric strain is given by:\n   ε_v = [(σx + σy + σz) / E] · (1 - 2μ).\n2. For an incompressible material, volume change is zero (ε_v = 0) under arbitrary non-zero stresses, requiring:\n   1 - 2μ = 0 ⇒ μ = 0.5.\n3. Substituting μ = 0.5 into the bulk modulus relationship:\n   K = E / [3(1 - 2μ)] = E / [3(1 - 1)] = E / 0 → ∞.\nAn incompressible material exhibits an infinite Bulk Modulus, meaning no finite hydrostatic pressure can change its volume.',
    referenceSource: 'civilenggforall.com SOM Guide Chapter 1.5 & Practice Quiz Q1',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'CONCEPTUAL',
    pyqExam: 'APSC AE Civil / GATE Civil',
    pyqYear: 2023
  },
  {
    id: 'ies-gate-som-009',
    questionNumber: 344,
    examId: 'upsc-ies-civil',
    subject: 'Strength of Materials',
    topic: 'Deflection of Beams',
    subtopic: 'Superposition Method & Propped Cantilever',
    stem: 'A cantilever beam AB of uniform flexural rigidity EI and span L is fixed at A and carries a uniformly distributed load (UDL) of intensity w per unit length over its entire length. A rigid vertical prop is placed at the free end B to prevent any vertical deflection (δ_B = 0). What is the magnitude of the prop reaction R_B?',
    options: [
      { id: 'A', text: 'R_B = (1/2) w·L' },
      { id: 'B', text: 'R_B = (3/8) w·L' },
      { id: 'C', text: 'R_B = (5/8) w·L' },
      { id: 'D', text: 'R_B = (1/3) w·L' }
    ],
    correctOption: 'B',
    formulaContext: 'Deflection superposition: δ_net = δ_UDL(down) - δ_prop(up) = 0 ⇒ wL⁴ / (8EI) = R_B L³ / (3EI)',
    explanation: 'Using the principle of superposition at free end B:\n1. Downward tip deflection due to full UDL: δ_UDL = (w · L⁴) / (8 · E · I).\n2. Upward tip deflection due to concentrated prop reaction R_B: δ_prop = (R_B · L³) / (3 · E · I).\n3. Since end B is unyielding (net deflection = 0):\n   (w · L⁴) / (8 · E · I) = (R_B · L³) / (3 · E · I)\n   ⇒ R_B = (3/8) · w · L = 0.375 w·L.\n(The remaining reaction at fixed support A is R_A = w·L - (3/8)w·L = (5/8)w·L).',
    referenceSource: 'civilenggforall.com SOM Guide Chapter 7 & Standard GATE Civil Question',
    difficulty: 'MEDIUM',
    sourceType: 'PYQ',
    questionType: 'NUMERICAL',
    pyqExam: 'GATE Civil / UPSC ESE',
    pyqYear: 2019
  },
  {
    id: 'ies-gate-som-010',
    questionNumber: 345,
    examId: 'upsc-ies-civil',
    subject: 'Strength of Materials',
    topic: 'Principal Stresses & Mohr\'s Circle',
    subtopic: 'Pure Shear Stress State & Mohr\'s Circle Geometry',
    stem: 'An element in a structural member is subjected to a state of pure shear stress τ_xy = τ (with normal stresses σ_x = 0 and σ_y = 0). What are the principal stresses (σ1, σ2), their planes of inclination, and the radius of the resulting Mohr\'s circle of stress?',
    options: [
      { id: 'A', text: 'σ1 = +τ, σ2 = -τ; planes at 45° and 135°; Mohr\'s radius R = τ centered at origin (0, 0)' },
      { id: 'B', text: 'σ1 = +2τ, σ2 = -2τ; planes at 90°; Mohr\'s radius R = 2τ centered at origin (0, 0)' },
      { id: 'C', text: 'σ1 = +τ, σ2 = 0; planes at 30° and 60°; Mohr\'s radius R = τ/2 centered at (τ/2, 0)' },
      { id: 'D', text: 'σ1 = 0, σ2 = -τ; planes at 0° and 90°; Mohr\'s radius R = τ centered at (-τ/2, 0)' }
    ],
    correctOption: 'A',
    formulaContext: 'Principal stress: σ_1,2 = (σx + σy)/2 ± √[((σx - σy)/2)² + τxy²]; Mohr\'s Center = ((σx+σy)/2, 0)',
    explanation: 'For pure shear (σ_x = 0, σ_y = 0, τ_xy = τ):\n1. Center of Mohr\'s circle: C = ((σ_x + σ_y)/2, 0) = (0, 0).\n2. Radius of Mohr\'s circle: R = √[((0 - 0)/2)² + τ²] = τ.\n3. Principal stresses: σ_1 = +R = +τ (tensile) and σ_2 = -R = -τ (compressive).\n4. Orientation of principal planes: tan(2θ_p) = 2τ_xy / (σ_x - σ_y) = 2τ / 0 = ∞ ⇒ 2θ_p = 90°, 270° ⇒ θ_p = 45° and 135°.\nThus, pure shear induces equal tensile and compressive stresses at 45° to the shear plane (governing diagonal tension in concrete beams).',
    referenceSource: 'civilenggforall.com SOM Guide Chapter 2 & UPSC ESE / GATE Civil',
    difficulty: 'MEDIUM',
    sourceType: 'PYQ',
    questionType: 'CONCEPTUAL',
    pyqExam: 'GATE Civil 2017 / UPSC ESE',
    pyqYear: 2017
  },
  {
    id: 'ies-gate-som-011',
    questionNumber: 346,
    examId: 'apsc-ae-civil',
    subject: 'Strength of Materials',
    topic: 'Shear Force & Bending Moment Diagrams',
    subtopic: 'Differential Relations & Point of Contraflexure',
    stem: 'Regarding the mathematical relationships governing Shear Force (V), Bending Moment (M), and Distributed Load (w) along a horizontally loaded beam, which of the following statements is INCORRECT?',
    options: [
      { id: 'A', text: 'The rate of change of shear force equals the negative of the load intensity: dV/dx = -w' },
      { id: 'B', text: 'The rate of change of bending moment equals the shear force: dM/dx = V' },
      { id: 'C', text: 'A point of contraflexure (or point of inflection) is defined as a point where the bending moment is zero and changes sign, corresponding to a change in curvature of the beam' },
      { id: 'D', text: 'The maximum bending moment always occurs at a point where the shear force attains its absolute maximum value' }
    ],
    correctOption: 'D',
    formulaContext: 'dM/dx = V = 0 for stationary (maximum/minimum) bending moment',
    explanation: 'Statement D is INCORRECT:\n- Since dM/dx = V, the condition for a mathematical maximum or minimum of bending moment is dM/dx = 0, which means V = 0 (or where the shear force diagram crosses the zero axis and changes sign), NOT where shear force is maximum.\n- Statements A, B, and C are all classic, correct fundamental principles of structural beam mechanics.\n- At a point of contraflexure, M = 0 and d²y/dx² = M/(EI) = 0, indicating curvature reversal from sagging to hogging or vice-versa.',
    referenceSource: 'civilenggforall.com SOM Guide Chapter 3 & Practice Quiz Q2',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'CONCEPTUAL',
    pyqExam: 'APSC AE Civil / SSC JE',
    pyqYear: 2024
  },

  /* ==========================================================================
     BRANCH 7 (EXPANDED): OPEN CHANNEL FLOW (OCF) — UPSC ESE, APSC AE & GATE
     ========================================================================== */
  {
    id: 'ies-gate-ocf-001',
    questionNumber: 347,
    examId: 'upsc-ies-civil',
    subject: 'Fluid Mechanics & Hydraulics',
    topic: 'Open Channel Flow',
    subtopic: 'Most Economical Trapezoidal Channel Section',
    stem: 'For a trapezoidal open channel section to be hydraulically most efficient (most economical section delivering maximum discharge for a given area), which of the following geometric conditions must be satisfied?\n1. Hydraulic radius R equals half the flow depth (R = y / 2).\n2. The side slope angle with the horizontal is 60° (side slope m = 1/√3).\n3. Top width T equals twice the length of the sloping side.\n4. The cross-section forms half of a regular hexagon with a inscribed semi-circle.',
    options: [
      { id: 'A', text: '1 and 2 only' },
      { id: 'B', text: '1, 2 and 4 only' },
      { id: 'C', text: '2, 3 and 4 only' },
      { id: 'D', text: '1, 2, 3 and 4' }
    ],
    correctOption: 'D',
    formulaContext: 'R = y/2 ; θ = 60° (m = 1/√3) ; T = 2 · (Sloping Side) = 4y/√3',
    explanation: 'All four statements are exact governing criteria for the most economical trapezoidal channel:\n1. Hydraulic radius R = A / P = y / 2.\n2. Side slopes make an angle of 60° with the horizontal, meaning m = cot(60°) = 1/√3 = 0.577.\n3. Top width T = 2 × (length of sloping side) = 4y / √3.\n4. The cross-section forms half of a regular hexagon, and a semicircle drawn with center at the top water surface touches all three wetted boundaries.',
    referenceSource: 'K. Subramanya Flow in Open Channels (Ch. 3) & UPSC ESE 2023',
    difficulty: 'MEDIUM',
    sourceType: 'PYQ',
    questionType: 'CONCEPTUAL',
    pyqExam: 'UPSC ESE / Testbook Civil AE Series',
    pyqYear: 2023
  },
  {
    id: 'ies-gate-ocf-002',
    questionNumber: 348,
    examId: 'upsc-ies-civil',
    subject: 'Fluid Mechanics & Hydraulics',
    topic: 'Open Channel Flow',
    subtopic: 'Hydraulic Jump Energy Dissipation',
    stem: 'A hydraulic jump forms in a horizontal rectangular open channel. If the pre-jump initial depth is y1 = 0.20 m and the post-jump sequent depth is y2 = 1.20 m, what is the head loss (energy dissipation ΔE_L) caused by the jump?',
    options: [
      { id: 'A', text: '0.854 m' },
      { id: 'B', text: '1.042 m' },
      { id: 'C', text: '1.250 m' },
      { id: 'D', text: '0.521 m' }
    ],
    correctOption: 'B',
    formulaContext: 'ΔE_L = (y2 - y1)³ / (4 · y1 · y2)',
    explanation: 'The energy loss in a hydraulic jump in a rectangular horizontal channel is given by:\nΔE_L = (y2 - y1)³ / (4 · y1 · y2)\nGiven:\ny1 = 0.20 m\ny2 = 1.20 m\nNumerator: (y2 - y1)³ = (1.20 - 0.20)³ = (1.00)³ = 1.000 m³\nDenominator: 4 · y1 · y2 = 4 × 0.20 × 1.20 = 0.960 m²\nΔE_L = 1.000 / 0.960 = 1.04167 m ≈ 1.042 m.',
    referenceSource: 'Ven Te Chow Open-Channel Hydraulics & GATE Civil 2021',
    difficulty: 'MEDIUM',
    sourceType: 'PYQ',
    questionType: 'NUMERICAL',
    pyqExam: 'GATE Civil / UPSC ESE',
    pyqYear: 2021
  },
  {
    id: 'ies-gate-ocf-003',
    questionNumber: 349,
    examId: 'upsc-ies-civil',
    subject: 'Fluid Mechanics & Hydraulics',
    topic: 'Open Channel Flow',
    subtopic: 'Specific Energy in Non-Rectangular Channels',
    stem: 'In a symmetrical triangular open channel with side slopes 1:m (1 vertical to m horizontal), what is the ratio of the minimum specific energy (E_c) to the critical depth (y_c)?',
    options: [
      { id: 'A', text: '1.50 (or 3/2)' },
      { id: 'B', text: '1.25 (or 5/4)' },
      { id: 'C', text: '1.33 (or 4/3)' },
      { id: 'D', text: '1.75 (or 7/4)' }
    ],
    correctOption: 'B',
    formulaContext: 'Triangular channel: D_c = A_c/T_c = y_c/2 ; E_c = y_c + D_c/2 = 1.25 · y_c',
    explanation: 'For any channel shape at critical flow, V_c² / (2g) = D_c / 2, where D_c is the hydraulic depth (A_c / T_c).\nFor a triangular channel with side slopes 1:m:\n- Area A_c = m · y_c²\n- Top width T_c = 2 · m · y_c\n- Hydraulic depth D_c = (m · y_c²) / (2 · m · y_c) = y_c / 2\nTherefore velocity head at critical state is:\nV_c² / (2g) = D_c / 2 = (y_c / 2) / 2 = y_c / 4\nSpecific energy at critical state:\nE_c = y_c + V_c² / (2g) = y_c + y_c / 4 = 1.25 · y_c (or 5/4 · y_c).\n(By comparison, in a rectangular channel D_c = y_c, giving E_c = 1.50 · y_c).',
    referenceSource: 'K. Subramanya Flow in Open Channels & UPSC ESE / GATE Civil',
    difficulty: 'HARD',
    sourceType: 'PYQ',
    questionType: 'CONCEPTUAL',
    pyqExam: 'UPSC ESE / GATE Civil',
    pyqYear: 2020
  },
  {
    id: 'ies-gate-ocf-004',
    questionNumber: 350,
    examId: 'apsc-ae-civil',
    subject: 'Fluid Mechanics & Hydraulics',
    topic: 'Open Channel Flow',
    subtopic: 'Gradually Varied Flow (GVF) Profiles',
    stem: 'When a barrage or storage dam is constructed across a wide river channel having a mild bed slope (S_0 < S_c), the water level upstream is backed up such that actual depth exceeds the normal depth (y > y_n > y_c). Which type of Gradually Varied Flow (GVF) surface profile is produced upstream of the structure?',
    options: [
      { id: 'A', text: 'M1 profile (Backwater curve)' },
      { id: 'B', text: 'M2 profile (Drawdown curve)' },
      { id: 'C', text: 'S1 profile' },
      { id: 'D', text: 'H2 profile' }
    ],
    correctOption: 'A',
    formulaContext: 'dy/dx = S_0 · [1 - (y_n/y)^(10/3)] / [1 - (y_c/y)³] > 0 for y > y_n > y_c (Mild Zone 1)',
    explanation: 'On a mild slope channel (where normal depth y_n > critical depth y_c):\n- Zone 1 occurs where actual flow depth y > y_n > y_c.\n- In the GVF dynamic equation dy/dx = (S_0 - S_f) / (1 - Fr²), since y > y_n, S_f < S_0 (numerator is positive); and since y > y_c, Fr < 1 (denominator is positive).\n- Therefore, dy/dx > 0, producing an increasing depth in the downstream direction. This rising water surface is an M1 backwater profile, characteristic of reservoir pools behind dams and barrages.\n- M2 profile occurs in Zone 2 (y_n > y > y_c) as a drawdown curve before a free overfall.',
    referenceSource: 'Ven Te Chow Open-Channel Hydraulics & APSC AE Civil 2024',
    difficulty: 'MEDIUM',
    sourceType: 'PYQ',
    questionType: 'CONCEPTUAL',
    pyqExam: 'APSC AE Civil / Testbook Civil Series',
    pyqYear: 2024
  },
  {
    id: 'ies-gate-ocf-005',
    questionNumber: 351,
    examId: 'apsc-ae-civil',
    subject: 'Fluid Mechanics & Hydraulics',
    topic: 'Open Channel Flow',
    subtopic: 'Most Economical Triangular Channel Section',
    stem: 'For a symmetrical triangular open channel with side slopes 1:m (1 vertical to m horizontal) to carry maximum discharge for a given cross-sectional area (most efficient hydraulic section), what should be the side slope angle with the vertical and the hydraulic radius R?',
    options: [
      { id: 'A', text: 'Side slope angle with vertical = 45° (m = 1), and R = y / (2√2)' },
      { id: 'B', text: 'Side slope angle with vertical = 60° (m = √3), and R = y / 2' },
      { id: 'C', text: 'Side slope angle with vertical = 30° (m = 1/√3), and R = y / 4' },
      { id: 'D', text: 'Side slope angle with vertical = 45° (m = 1), and R = y / 2' }
    ],
    correctOption: 'A',
    formulaContext: 'P = 2y√(1+m²) ; dP/dm = 0 ⇒ m = 1 (θ = 45°, 2θ = 90°) ; R = y / (2√2)',
    explanation: 'For a triangular channel with flow depth y and side slopes 1:m:\n- Area A = m · y² ⇒ y = √(A/m)\n- Wetted Perimeter P = 2y√(1 + m²) = 2√(A) · √[(1 + m²) / m]\n- To minimize wetted perimeter P for maximum discharge, d/dm [(1 + m²)/m] = 0 ⇒ m = 1.\n- m = 1 means each sloping side makes an angle of 45° with the vertical (total vertex angle = 90°).\n- Hydraulic radius R = A / P = (y²) / [2y√(1 + 1²)] = y / (2√2) ≈ 0.354 y.',
    referenceSource: 'Modi & Seth Fluid Mechanics & UPSC ESE / APSC AE',
    difficulty: 'HARD',
    sourceType: 'PYQ',
    questionType: 'CONCEPTUAL',
    pyqExam: 'APSC AE Civil / UPSC ESE',
    pyqYear: 2022
  },
  {
    id: 'ies-gate-ocf-006',
    questionNumber: 352,
    examId: 'apsc-ae-civil',
    subject: 'Fluid Mechanics & Hydraulics',
    topic: 'Open Channel Flow',
    subtopic: 'Chezy and Manning Roughness Coefficients',
    stem: 'In open channel hydraulics, what is the exact relationship between Chezy\'s coefficient C and Manning\'s roughness coefficient n in SI units?',
    options: [
      { id: 'A', text: 'C = (1 / n) · R^(1/6)' },
      { id: 'B', text: 'C = (1 / n) · R^(2/3)' },
      { id: 'C', text: 'C = n · R^(1/6)' },
      { id: 'D', text: 'C = (1 / n) · R^(1/2)' }
    ],
    correctOption: 'A',
    formulaContext: 'Chezy: V = C√(R·S) ; Manning: V = (1/n) · R^(2/3) · S^(1/2) ⇒ C = (1/n) · R^(1/6)',
    explanation: 'Equating the uniform flow velocity from Chezy\'s formula and Manning\'s formula in SI units:\nChezy: V = C · R^(1/2) · S^(1/2)\nManning: V = (1 / n) · R^(2/3) · S^(1/2)\nEquating the two expressions:\nC · R^(1/2) · S^(1/2) = (1 / n) · R^(2/3) · S^(1/2)\n⇒ C = (1 / n) · R^(2/3 - 1/2) = (1 / n) · R^(1/6).\nThis shows Chezy\'s C has dimensions [L^(1/2) T^(-1)] and varies with the one-sixth power of the hydraulic radius R.',
    referenceSource: 'K. Subramanya Flow in Open Channels & APSC AE Civil 2024',
    difficulty: 'EASY',
    sourceType: 'PYQ',
    questionType: 'FORMULA_RECALL',
    pyqExam: 'APSC AE Civil / Testbook Civil AE Series',
    pyqYear: 2024
  }
];

