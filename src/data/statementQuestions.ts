import type { MCQQuestion } from '../types';

/**
 * STATEMENT-BASED CIVIL ENGINEERING QUESTION BANK
 * Covers UPSC ESE (IES), GATE CE, and State PSC (APSC AE) pattern:
 * - Two-statement items: "1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"
 * - Statement (I) & Statement (II) (Assertion & Reasoning)
 * - Three-statement combination items ("1 and 2 only", "2 and 3 only", "1, 2 and 3")
 */
export const STATEMENT_BASED_QUESTIONS: MCQQuestion[] = [
  /* ==========================================================================
     GEOTECHNICAL & FOUNDATION ENGINEERING
     ========================================================================== */
  {
    id: 'stmt-geo-001',
    questionNumber: 401,
    examId: 'upsc-ies-civil',
    subject: 'Geotechnical Engineering',
    topic: 'Effective Stress & Water Table',
    subtopic: 'Capillarity and Submergence',
        stem: 'Consider the following statements regarding effective stress in soils:\nStatement 1: A rise of water table up to the ground surface reduces the effective vertical stress at any depth in the soil.\nStatement 2: When water floods above the ground level, the effective stress at any point in the submerged soil increases with the height of the floodwater.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'A',
    formulaContext: "sigma' = sigma - u = (gamma_sat * z) - (gamma_w * z) = gamma' * z",
    explanation: 'Statement 1 is correct: As the water table rises to ground level, the total stress becomes gamma_sat * z and pore pressure u = gamma_w * z, so effective stress reduces from dry/moist state to submerged stress gamma\' * z.\nStatement 2 is incorrect: An increase in water depth above ground level increases total stress sigma and pore water pressure u by the exact same amount (gamma_w * Delta_hw). Thus, Delta_sigma\' = Delta_sigma - Delta_u = 0. Surcharge of water above ground produces NO change in effective stress.',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'Terzaghi & Peck: Soil Mechanics in Engineering Practice',
    pyqExam: 'UPSC ESE / GATE CE'
  },
  {
    id: 'stmt-geo-002',
    questionNumber: 402,
    examId: 'upsc-ies-civil',
    subject: 'Geotechnical Engineering',
    topic: 'Soil Permeability & Seepage',
    subtopic: 'Quick Sand Condition',
        stem: 'Consider the following statements regarding quicksand condition:\nStatement 1: Quicksand is not a special type of sand, but a hydraulic condition occurring when seepage flows vertically upward.\nStatement 2: The critical hydraulic gradient i_cr depends on the specific gravity of soil solids and the void ratio of the soil.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'C',
    formulaContext: 'i_cr = (G - 1) / (1 + e) = gamma\' / gamma_w',
    explanation: 'Both statements are correct.\nStatement 1: Quicksand (boiling) is a hydrodynamic state occurring in cohesionless soils when upward seepage force equals submerged weight of soil, reducing effective stress and shear strength to zero.\nStatement 2: The critical gradient is given by i_cr = (G - 1)/(1 + e). For quartz sand with G = 2.65 and e = 0.65, i_cr = 1.65 / 1.65 = 1.0.',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'IS 2720 & Ranjan and Rao: Basic and Applied Soil Mechanics',
    pyqExam: 'UPSC ESE / APSC AE'
  },
  {
    id: 'stmt-geo-003',
    questionNumber: 403,
    examId: 'upsc-ies-civil',
    subject: 'Geotechnical Engineering',
    topic: 'Consolidation of Soils',
    subtopic: 'Terzaghi 1D Consolidation',
        stem: 'Statement (I): In a two-way drainage condition, a clay layer consolidates four times faster than in a one-way drainage condition of the same thickness.\nStatement (II): The time required for a given degree of consolidation is inversely proportional to the square of the maximum drainage path length.\nWhich one of the following is correct?',
    options: [
      { id: 'A', text: 'Both Statement (I) and Statement (II) are individually true and Statement (II) is the correct explanation of Statement (I)' },
      { id: 'B', text: 'Both Statement (I) and Statement (II) are individually true but Statement (II) is NOT the correct explanation of Statement (I)' },
      { id: 'C', text: 'Statement (I) is true but Statement (II) is false' },
      { id: 'D', text: 'Statement (I) is false but Statement (II) is true' }
    ],
    correctOption: 'C',
    formulaContext: 't = (T_v * d^2) / C_v',
    explanation: 'Statement (I) is true: For two-way drainage, d = H/2, so t_2 = T_v * (H/2)^2 / C_v = (T_v * H^2) / (4 C_v). For one-way drainage, d = H, so t_1 = (T_v * H^2) / C_v = 4 * t_2. Therefore, two-way drainage is 4 times faster.\nStatement (II) is false: The time required is directly proportional (not inversely proportional) to the square of the drainage path length: t proportional to d^2.',
    difficulty: 'HARD',
    sourceType: 'MODELLED',
    questionType: 'ASSERTION_REASON',
    referenceSource: 'Terzaghi 1D Consolidation Theory',
    pyqExam: 'UPSC ESE Civil'
  },
  {
    id: 'stmt-geo-004',
    questionNumber: 404,
    examId: 'gate-ce',
    subject: 'Geotechnical Engineering',
    topic: 'Compaction of Soils',
    subtopic: 'Proctor Test & Soil Structure',
        stem: 'Consider the following statements regarding the compaction characteristics of cohesive soils:\nStatement 1: For a given soil compacted at the same energy, compaction dry of optimum results in a flocculated structure, whereas compaction wet of optimum yields a dispersed structure.\nStatement 2: Soil compacted dry of optimum possesses higher permeability and lower shear strength than the same soil compacted wet of optimum.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'A',
    formulaContext: 'Dry of OMC: Flocculated; Wet of OMC: Dispersed',
    explanation: 'Statement 1 is correct: Dry of optimum, repulsive forces are lower due to lower moisture content, producing edge-to-face flocculated structure. Wet of optimum, thicker diffuse double layers generate high repulsion, producing parallel dispersed orientation.\nStatement 2 is incorrect: Soil compacted dry of optimum has HIGHER shear strength and lower compressibility at low stress levels compared to wet of optimum, but it has higher permeability due to larger inter-aggregate pores. However, saying it has lower shear strength is incorrect (it has higher strength dry of optimum).',
    difficulty: 'HARD',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'Lambe: Soil Structure and Engineering Properties',
    pyqExam: 'GATE CE / UPSC ESE'
  },
  {
    id: 'stmt-geo-005',
    questionNumber: 405,
    examId: 'upsc-ies-civil',
    subject: 'Geotechnical Engineering',
    topic: 'Earth Pressure Theories',
    subtopic: 'Rankine vs Coulomb Theories',
        stem: 'Consider the following statements regarding lateral earth pressure theories:\nStatement 1: Rankine\'s theory considers the back of the retaining wall to be smooth and vertical.\nStatement 2: Coulomb\'s wedge theory accounts for wall friction and is applicable to retaining walls with inclined backs.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'C',
    formulaContext: 'Rankine: delta = 0; Coulomb: delta > 0',
    explanation: 'Both statements are correct.\nRankine\'s theory considers state of plastic equilibrium in a semi-infinite soil mass, assuming smooth (zero friction, delta = 0) vertical back.\nCoulomb\'s wedge theory considers equilibrium of a sliding wedge bounded by planar failure surfaces, accounting for wall friction delta and sloping wall batter.',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'IS 4651 & Bowles: Foundation Analysis and Design',
    pyqExam: 'UPSC ESE / State PSC'
  },
  {
    id: 'stmt-geo-006',
    questionNumber: 406,
    examId: 'apsc-ae-civil',
    subject: 'Geotechnical Engineering',
    topic: 'Bearing Capacity of Shallow Foundations',
    subtopic: 'Terzaghi Bearing Capacity',
        stem: 'Consider the following statements regarding Terzaghi\'s bearing capacity theory:\nStatement 1: Terzaghi\'s bearing capacity factors N_c, N_q, and N_gamma depend only on the angle of internal friction (phi) of the soil.\nStatement 2: For pure cohesive soil (phi = 0), Terzaghi\'s factors are N_c = 5.7, N_q = 1.0, and N_gamma = 0 for a strip footing.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'C',
    formulaContext: 'q_ult = c*N_c + q*N_q + 0.5*gamma*B*N_gamma; For phi=0: N_c=5.7, N_q=1, N_gamma=0',
    explanation: 'Both statements are correct. Terzaghi\'s bearing capacity factors N_c, N_q, N_gamma are dimensionless parameters determined solely by the friction angle phi. When phi = 0 (undrained clay), N_q = 1, N_c = (N_q - 1)*cot(phi) -> 5.7 (Prandtl-Terzaghi limit), and N_gamma = 0.',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'IS 6403:1981',
    pyqExam: 'APSC AE / SSC JE'
  },
  {
    id: 'stmt-geo-007',
    questionNumber: 407,
    examId: 'upsc-ies-civil',
    subject: 'Geotechnical Engineering',
    topic: 'Deep Foundations',
    subtopic: 'Negative Skin Friction',
        stem: 'Statement (I): Negative skin friction decreases the load carrying capacity of a pile and may lead to structural failure of the pile shaft.\nStatement (II): Negative skin friction is developed when the surrounding consolidating soil layer settles more than the pile itself.\nWhich one of the following is correct?',
    options: [
      { id: 'A', text: 'Both Statement (I) and Statement (II) are individually true and Statement (II) is the correct explanation of Statement (I)' },
      { id: 'B', text: 'Both Statement (I) and Statement (II) are individually true but Statement (II) is NOT the correct explanation of Statement (I)' },
      { id: 'C', text: 'Statement (I) is true but Statement (II) is false' },
      { id: 'D', text: 'Statement (I) is false but Statement (II) is true' }
    ],
    correctOption: 'A',
    formulaContext: 'Q_n = P * alpha * c_u * L_c  (cohesive fill)',
    explanation: 'Both statements are true and Statement (II) is the correct explanation. When newly placed fill or soft compressible clay consolidates around an end-bearing pile, the downward movement of the soil relative to the pile mobilizes downward shearing resistance (negative skin friction), acting as an additional downward load on the pile rather than resisting it.',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'ASSERTION_REASON',
    referenceSource: 'IS 2911 (Part 1/Sec 1)',
    pyqExam: 'UPSC ESE Civil'
  },
  {
    id: 'stmt-geo-008',
    questionNumber: 408,
    examId: 'upsc-ies-civil',
    subject: 'Geotechnical Engineering',
    topic: 'Slope Stability',
    subtopic: 'Swedish Circle & Taylor Stability Number',
        stem: 'Consider the following statements regarding stability of earth slopes:\nStatement 1: Taylor\'s stability number S_n is a dimensionless parameter that is directly proportional to the critical height of an embankment.\nStatement 2: For an infinite slope in cohesionless dry sand, the factor of safety depends on the slope angle and the angle of shearing resistance, and is independent of the slope height.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'B',
    formulaContext: 'S_n = c / (gamma * H_c) ; FOS_infinite = tan(phi) / tan(beta)',
    explanation: 'Statement 1 is incorrect: Taylor\'s stability number is S_n = c / (gamma * H_c). Thus, S_n is INVERSELY proportional to the critical height H_c, not directly proportional.\nStatement 2 is correct: For dry cohesionless infinite slope, shear strength is tau = sigma * tan(phi) = gamma * z * cos^2(beta) * tan(phi), and shear stress is tau_mob = gamma * z * sin(beta) * cos(beta). Hence FOS = tan(phi) / tan(beta), which is completely independent of depth z or slope height H.',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'Taylor Fundamentals of Soil Mechanics',
    pyqExam: 'UPSC ESE / GATE'
  },

  /* ==========================================================================
     STRENGTH OF MATERIALS & STRUCTURAL ANALYSIS
     ========================================================================== */
  {
    id: 'stmt-som-001',
    questionNumber: 409,
    examId: 'upsc-ies-civil',
    subject: 'Strength of Materials',
    topic: 'Principal Stresses & Mohr Circle',
    subtopic: 'Pure Shear State',
        stem: 'Consider the following statements regarding pure shear state of stress (tau_xy = q, sigma_x = sigma_y = 0):\nStatement 1: The center of the Mohr\'s circle of stress lies at the origin of the sigma-tau coordinate system.\nStatement 2: The principal stresses are equal in magnitude and of opposite sign, acting on planes inclined at 45 degrees to the shear planes.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'C',
    formulaContext: "Center = ((sigma_x+sigma_y)/2, 0) = (0, 0); sigma_1,2 = +/- q at theta = 45 deg",
    explanation: 'Both statements are correct. In pure shear, center of Mohr circle is at ((0+0)/2, 0) = (0, 0), and radius R = q. Thus, principal stresses are sigma_1 = +q (tensile) and sigma_2 = -q (compressive) acting on planes at theta = 45 deg and 135 deg to the pure shear planes.',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'Gere & Timoshenko: Mechanics of Materials',
    pyqExam: 'UPSC ESE / APSC AE'
  },
  {
    id: 'stmt-som-002',
    questionNumber: 410,
    examId: 'gate-ce',
    subject: 'Strength of Materials',
    topic: 'Deflection of Beams',
    subtopic: 'Macaulay and Moment-Area Theorems',
        stem: 'Consider the following statements regarding Mohr\'s Moment-Area Theorems:\nStatement 1: The first moment-area theorem states that the change in slope between two points on the elastic curve is equal to the area of the M/EI diagram between those points.\nStatement 2: The second moment-area theorem gives the deflection of a point on the elastic curve measured relative to the tangent drawn at another point.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'C',
    formulaContext: 'theta_B - theta_A = Area(M/EI); t_BA = x_bar * Area(M/EI)',
    explanation: 'Both statements are correct.\nTheorem 1: theta_BA = int(M/EI dx) = Area of M/EI diagram between A and B.\nTheorem 2: Tangential deviation t_BA is the moment of the M/EI diagram between A and B about point B, which gives the vertical deviation of point B from the tangent drawn at A.',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'Bhavikatti: Structural Analysis',
    pyqExam: 'GATE CE'
  },
  {
    id: 'stmt-som-003',
    questionNumber: 411,
    examId: 'upsc-ies-civil',
    subject: 'Strength of Materials',
    topic: 'Columns & Struts',
    subtopic: 'Euler Buckling Load',
        stem: 'Statement (I): For a column of fixed length and cross-section, the Euler crippling load is maximum when both ends are fixed.\nStatement (II): The effective length of a column with both ends fixed is half of its actual unsupported length.\nWhich one of the following is correct?',
    options: [
      { id: 'A', text: 'Both Statement (I) and Statement (II) are individually true and Statement (II) is the correct explanation of Statement (I)' },
      { id: 'B', text: 'Both Statement (I) and Statement (II) are individually true but Statement (II) is NOT the correct explanation of Statement (I)' },
      { id: 'C', text: 'Statement (I) is true but Statement (II) is false' },
      { id: 'D', text: 'Statement (I) is false but Statement (II) is true' }
    ],
    correctOption: 'A',
    formulaContext: 'P_cr = (pi^2 * E * I) / (L_eff)^2 ; For fixed-fixed: L_eff = L/2 => P_cr = 4*(pi^2*EI)/L^2',
    explanation: 'Both statements are true and Statement (II) correctly explains Statement (I). Euler buckling load is inversely proportional to L_eff^2. For both ends fixed, L_eff = 0.5 L (or 0.65 L for design), which is the minimum possible effective length, yielding P_cr = 4 * pi^2 * E * I / L^2 (four times the hinged-hinged column).',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'ASSERTION_REASON',
    referenceSource: 'IS 800:2007, Table 11',
    pyqExam: 'UPSC ESE / State AE'
  },
  {
    id: 'stmt-sa-001',
    questionNumber: 412,
    examId: 'gate-ce',
    subject: 'Structural Analysis',
    topic: 'Indeterminacy & Energy Methods',
    subtopic: 'Castigliano Theorems',
        stem: 'Consider the following statements regarding Castigliano\'s theorems:\nStatement 1: Castigliano\'s First Theorem is applicable to linearly elastic structures only, while the Second Theorem is applicable to both linear and non-linear elastic structures.\nStatement 2: The partial derivative of total strain energy with respect to a concentrated load gives the deflection at the point of application of the load in the direction of the load.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'B',
    formulaContext: 'delta_i = dU / dP_i (Castigliano 2nd theorem for linear elastic structures)',
    explanation: 'Statement 1 is incorrect: Castigliano\'s First Theorem (dU/ddelta = P) applies to both linear and non-linear elastic structures where strain energy is expressed in terms of displacements. Castigliano\'s Second Theorem (dU/dP = delta) applies ONLY to linearly elastic structures where Hooke\'s law holds.\nStatement 2 is correct: By Castigliano\'s 2nd theorem, dU/dP_i yields the displacement delta_i collinear with load P_i.',
    difficulty: 'HARD',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'Reddy: Basic Structural Analysis',
    pyqExam: 'GATE CE'
  },
  {
    id: 'stmt-sa-002',
    questionNumber: 413,
    examId: 'upsc-ies-civil',
    subject: 'Structural Analysis',
    topic: 'Influence Line Diagrams',
    subtopic: 'Muller-Breslau Principle',
        stem: 'Consider the following statements regarding the Muller-Breslau principle:\nStatement 1: The Muller-Breslau principle is valid for determinate as well as indeterminate structures, provided the material obeys Hooke\'s law.\nStatement 2: For indeterminate beams and frames, the influence line diagram obtained by the Muller-Breslau principle consists of straight line segments.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'A',
    formulaContext: 'Muller-Breslau: ILD = Deflected shape due to unit stress-resultant displacement',
    explanation: 'Statement 1 is correct: Muller-Breslau principle is based on Betti-Maxwell reciprocal theorem and applies to all structures conforming to linear elasticity.\nStatement 2 is incorrect: For statically determinate structures, the ILD consists of straight lines. For statically indeterminate structures, the ILD is curved because the deflected shape of continuous members under applied internal release is non-linear.',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'Vazirani & Ratwani: Analysis of Structures',
    pyqExam: 'UPSC ESE / GATE'
  },

  /* ==========================================================================
     REINFORCED CONCRETE STRUCTURES & PRESTRESSED CONCRETE (IS 456 & IS 1343)
     ========================================================================== */
  {
    id: 'stmt-rcc-001',
    questionNumber: 414,
    examId: 'upsc-ies-civil',
    subject: 'Reinforced Concrete Structures',
    topic: 'Limit State Design — Flexure',
    subtopic: 'Under-reinforced vs Over-reinforced Sections',
        stem: 'Consider the following statements regarding under-reinforced RCC beams designed by Limit State Method:\nStatement 1: The steel reinforcement yields before the concrete reaches its ultimate compressive strain of 0.0035.\nStatement 2: The section provides ample warning prior to failure through excessive cracking and large deflections.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'C',
    formulaContext: 'x_u < x_u,max ; epsilon_st >= (0.87*f_y / E_s) + 0.002',
    explanation: 'Both statements are correct. In an under-reinforced section, the area of tensile steel is less than the balanced steel area (A_st < A_st,lim). Tensile steel yields first, causing neutral axis to shift upward, leading to wide flexural cracks and ductile deflection before compressive crushing of concrete.',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'IS 456:2000, Cl. 38.1',
    pyqExam: 'UPSC ESE / APSC AE'
  },
  {
    id: 'stmt-rcc-002',
    questionNumber: 415,
    examId: 'gate-ce',
    subject: 'Reinforced Concrete Structures',
    topic: 'Shear and Torsion',
    subtopic: 'Nominal Shear Stress & Maximum Shear Stress',
        stem: 'Statement (I): In RCC beams, if the nominal shear stress tau_v exceeds tau_c,max, the section must be redesigned by increasing its cross-sectional dimensions.\nStatement (II): Provision of heavy shear reinforcement cannot prevent brittle diagonal compression failure of the web concrete if tau_v exceeds tau_c,max.\nWhich one of the following is correct?',
    options: [
      { id: 'A', text: 'Both Statement (I) and Statement (II) are individually true and Statement (II) is the correct explanation of Statement (I)' },
      { id: 'B', text: 'Both Statement (I) and Statement (II) are individually true but Statement (II) is NOT the correct explanation of Statement (I)' },
      { id: 'C', text: 'Statement (I) is true but Statement (II) is false' },
      { id: 'D', text: 'Statement (I) is false but Statement (II) is true' }
    ],
    correctOption: 'A',
    formulaContext: 'tau_c,max = 0.62 * sqrt(f_ck) (IS 456 Table 20)',
    explanation: 'Both statements are true and Statement (II) is the correct explanation. tau_c,max is governed by the compressive strength of web concrete along diagonal compression struts. If tau_v exceeds tau_c,max, concrete crushes diagonally before steel yields, regardless of stirrup area. Hence, IS 456 Cl. 40.2.3 mandates redesigning cross-section by increasing width or depth.',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'ASSERTION_REASON',
    referenceSource: 'IS 456:2000, Cl. 40.2.3 & Table 20',
    pyqExam: 'GATE CE / UPSC ESE'
  },
  {
    id: 'stmt-rcc-003',
    questionNumber: 416,
    examId: 'upsc-ies-civil',
    subject: 'Reinforced Concrete Structures',
    topic: 'Bond and Development Length',
    subtopic: 'Development Length Provisions',
        stem: 'Consider the following statements regarding development length L_d as per IS 456:2000:\nStatement 1: The design bond stress tau_bd is 60% higher for deformed bars (HYSD) than for plain mild steel bars in tension.\nStatement 2: For bars in compression, the design bond stress value is further increased by 25%.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'C',
    formulaContext: 'L_d = (phi * 0.87 * f_y) / (4 * tau_bd); HYSD: +60%; Compression: +25%',
    explanation: 'Both statements are correct as per IS 456:2000 Cl. 26.2.1.1:\n1. For deformed bars conforming to IS 1786, design bond stress tau_bd values are increased by 60% due to mechanical interlock of ribs.\n2. For bars in compression, bond stress is increased by 25% due to Poisson lateral expansion of the bar under compression tightening the bond.',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'IS 456:2000, Cl. 26.2.1.1',
    pyqExam: 'UPSC ESE / State PSC'
  },
  {
    id: 'stmt-psc-001',
    questionNumber: 417,
    examId: 'upsc-ies-civil',
    subject: 'Prestressed Concrete',
    topic: 'Losses of Prestress',
    subtopic: 'Pre-tensioning vs Post-tensioning',
        stem: 'Consider the following statements regarding loss of prestress:\nStatement 1: Loss of prestress due to elastic shortening of concrete occurs in pre-tensioned members, but is zero in post-tensioned members if all tendons are tensioned simultaneously.\nStatement 2: Loss of prestress due to anchorage slip occurs in pre-tensioned concrete members.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'A',
    formulaContext: 'Loss_elastic = m * f_c ; Post-tensioned simultaneous: 0',
    explanation: 'Statement 1 is correct: In pre-tensioning, concrete shortens elastically when tendons are cut, transferring stress. In post-tensioned members, if all cables are jacked together, elastic shortening occurs during jacking and is compensated before locking.\nStatement 2 is incorrect: Anchorage slip occurs ONLY in post-tensioned members when wedges slip into anchor cones (Delta_s = 2 to 5 mm). In pre-tensioning, tendons are bonded directly to concrete along transmission length; there are no end anchorage fixtures left in the finished element.',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'IS 1343:2012 & Krishna Raju: Prestressed Concrete',
    pyqExam: 'UPSC ESE / GATE'
  },

  /* ==========================================================================
     DESIGN OF STEEL STRUCTURES (IS 800:2007)
     ========================================================================== */
  {
    id: 'stmt-stl-001',
    questionNumber: 418,
    examId: 'upsc-ies-civil',
    subject: 'Design of Steel Structures',
    topic: 'Connections',
    subtopic: 'High Strength Friction Grip (HSFG) Bolts',
        stem: 'Consider the following statements regarding High Strength Friction Grip (HSFG) bolts:\nStatement 1: Load transfer in HSFG bolting takes place through friction mobilized between the faying surfaces of connected plates, not through bearing and shearing of the bolt shank.\nStatement 2: HSFG bolted joints are prone to stress concentration around bolt holes and exhibit significant slip under working loads.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'A',
    formulaContext: 'V_nsf = mu_f * n_e * K_h * F_o',
    explanation: 'Statement 1 is correct: Clamping force F_o induced by tightening HSFG bolts creates high friction resistance across contact surfaces. Until slip occurs, the bolt shank does not touch the hole periphery.\nStatement 2 is incorrect: HSFG joints exhibit NO slip under service loads (hence called friction grip / non-slip joints) and stress concentration around holes is much lower because the load is transferred over the entire contact area rather than concentrated at hole edges.',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'IS 800:2007, Cl. 10.4',
    pyqExam: 'UPSC ESE / State PSC'
  },
  {
    id: 'stmt-stl-002',
    questionNumber: 419,
    examId: 'gate-ce',
    subject: 'Design of Steel Structures',
    topic: 'Plastic Analysis',
    subtopic: 'Shape Factor and Plastic Hinges',
        stem: 'Consider the following statements regarding the plastic analysis of steel sections:\nStatement 1: The shape factor for a standard rectangular cross-section is 1.50, and for a diamond section is 2.0.\nStatement 2: The number of plastic hinges required to transform a structure with indeterminacy D_s into a mechanism is exactly equal to D_s.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'A',
    formulaContext: 'Shape Factor S = Z_p / Z_e ; Hinges for mechanism N = D_s + 1',
    explanation: 'Statement 1 is correct: Shape factor S = Z_p / Z_e. For rectangle: S = (b*d^2 / 4) / (b*d^2 / 6) = 1.50. For diamond/rhombus: S = 2.0. For circle: 1.70. For I-section: 1.12-1.18.\nStatement 2 is incorrect: A structure of indeterminacy D_s requires (D_s + 1) plastic hinges for complete collapse mechanism (or fewer for partial collapse). Having D_s hinges merely reduces the structure to a determinate state.',
    difficulty: 'HARD',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'IS 800:2007 Annex B & Subramanian: Design of Steel Structures',
    pyqExam: 'GATE CE / UPSC ESE'
  },
  {
    id: 'stmt-stl-003',
    questionNumber: 420,
    examId: 'upsc-ies-civil',
    subject: 'Design of Steel Structures',
    topic: 'Compression Members',
    subtopic: 'Slenderness Ratio Limits',
        stem: 'Statement (I): Lacing bars in built-up compression members are designed to resist a transverse shear force equal to 2.5% of the total axial compressive load.\nStatement (II): Transverse shear in built-up columns arises from accidental eccentricities, initial crookedness, and lateral vibrations.\nWhich one of the following is correct?',
    options: [
      { id: 'A', text: 'Both Statement (I) and Statement (II) are individually true and Statement (II) is the correct explanation of Statement (I)' },
      { id: 'B', text: 'Both Statement (I) and Statement (II) are individually true but Statement (II) is NOT the correct explanation of Statement (I)' },
      { id: 'C', text: 'Statement (I) is true but Statement (II) is false' },
      { id: 'D', text: 'Statement (I) is false but Statement (II) is true' }
    ],
    correctOption: 'A',
    formulaContext: 'V_t = 0.025 * P (IS 800:2007 Cl. 7.6.6.1)',
    explanation: 'Both statements are true and Statement (II) is the correct explanation. IS 800:2007 Cl. 7.6.6.1 specifies that the lacing system must be proportioned to resist a transverse shear force V_t = 2.5% of the axial compressive force, divided equally among the parallel planes of lacing, to account for initial curvature and secondary bending.',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'ASSERTION_REASON',
    referenceSource: 'IS 800:2007, Cl. 7.6.6.1',
    pyqExam: 'UPSC ESE / State AE'
  },

  /* ==========================================================================
     FLUID MECHANICS, HYDRAULICS & OPEN CHANNEL FLOW
     ========================================================================== */
  {
    id: 'stmt-fmc-001',
    questionNumber: 421,
    examId: 'gate-ce',
    subject: 'Fluid Mechanics & Hydraulics',
    topic: 'Fluid Statics & Buoyancy',
    subtopic: 'Metacentric Height & Stability',
        stem: 'Consider the following statements regarding the stability of floating bodies:\nStatement 1: A floating body is in stable equilibrium if its metacentre (M) lies above its centre of gravity (G).\nStatement 2: An increase in metacentric height improves the dynamic stability of a floating ship, but causes uncomfortably quick rolling with short time period.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'C',
    formulaContext: 'GM = (I / V_disp) - BG ; T = 2*pi * sqrt(k^2 / (g*GM))',
    explanation: 'Both statements are correct.\nStatement 1: When M is above G (GM > 0), the righting couple restores the tilted body to equilibrium.\nStatement 2: Rolling period T = 2*pi*sqrt(k^2/(g*GM)). Larger GM increases righting moment (greater stability against overturning), but shortens period T, causing rapid jerky oscillations (uncomfortable for passengers). Hence passenger ships maintain smaller GM (0.3 to 0.6 m) for gentle rolling.',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'Modi & Seth: Hydraulics and Fluid Mechanics',
    pyqExam: 'GATE CE / UPSC ESE'
  },
  {
    id: 'stmt-fmc-002',
    questionNumber: 422,
    examId: 'upsc-ies-civil',
    subject: 'Fluid Mechanics & Hydraulics',
    topic: 'Open Channel Flow',
    subtopic: 'Most Economical Rectangular Channel',
        stem: 'Consider the following statements regarding a hydraulically most efficient rectangular open channel:\nStatement 1: The hydraulic radius R is equal to half of the depth of flow (R = y / 2).\nStatement 2: The bottom width of the channel is equal to twice the depth of flow (B = 2y).\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'C',
    formulaContext: 'R = A / P = (B*y) / (B + 2y); dP/dy = 0 => B = 2y => R = y/2',
    explanation: 'Both statements are correct. For a given cross-sectional area A = B*y, wetted perimeter P = B + 2y = (A/y) + 2y. Minimizing P gives dP/dy = -A/y^2 + 2 = 0 => B = 2y. Then hydraulic radius R = A / P = (2y^2) / (4y) = y / 2.',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'Subramanya: Flow in Open Channels',
    pyqExam: 'APSC AE / UPSC ESE'
  },
  {
    id: 'stmt-fmc-003',
    questionNumber: 423,
    examId: 'gate-ce',
    subject: 'Fluid Mechanics & Hydraulics',
    topic: 'Open Channel Flow',
    subtopic: 'Hydraulic Jump & Specific Energy',
        stem: 'Statement (I): A hydraulic jump in an open channel occurs only when supercritical flow transitions into subcritical flow.\nStatement (II): Supercritical flow has a Froude number greater than 1, and energy dissipation occurs across the jump due to turbulence and eddy formation.\nWhich one of the following is correct?',
    options: [
      { id: 'A', text: 'Both Statement (I) and Statement (II) are individually true and Statement (II) is the correct explanation of Statement (I)' },
      { id: 'B', text: 'Both Statement (I) and Statement (II) are individually true but Statement (II) is NOT the correct explanation of Statement (I)' },
      { id: 'C', text: 'Statement (I) is true but Statement (II) is false' },
      { id: 'D', text: 'Statement (I) is false but Statement (II) is true' }
    ],
    correctOption: 'A',
    formulaContext: 'Fr_1 > 1.0 to Fr_2 < 1.0; Delta_E = (y_2 - y_1)^3 / (4 * y_1 * y_2)',
    explanation: 'Both statements are true and Statement (II) correctly explains Statement (I). A hydraulic jump is a standing wave phenomenon where high-velocity shooting (supercritical, Fr1 > 1) flow abruptly rises to tranquil (subcritical, Fr2 < 1) flow, accompanied by significant loss of mechanical energy Delta_E into heat and sound.',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'ASSERTION_REASON',
    referenceSource: 'Chow: Open-Channel Hydraulics',
    pyqExam: 'GATE CE / UPSC ESE'
  },
  {
    id: 'stmt-fmc-004',
    questionNumber: 424,
    examId: 'upsc-ies-civil',
    subject: 'Fluid Mechanics & Hydraulics',
    topic: 'Boundary Layer Theory',
    subtopic: 'Separation of Boundary Layer',
        stem: 'Consider the following statements regarding boundary layer separation:\nStatement 1: Boundary layer separation occurs only in the presence of an adverse pressure gradient (dp/dx > 0).\nStatement 2: The point of separation on a solid surface is characterized by a velocity gradient (du/dy) at y = 0 being equal to zero.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'C',
    formulaContext: 'Separation criterion: (du/dy)_{y=0} = 0 under dp/dx > 0',
    explanation: 'Both statements are correct. When flow encounters an adverse pressure gradient (pressure increasing in flow direction, dp/dx > 0), fluid particles near the boundary lose kinetic energy. Eventually, wall shear stress tau_0 = mu*(du/dy)_{y=0} becomes zero (point of separation), beyond which backflow occurs ((du/dy)_{y=0} < 0).',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'Schlichting: Boundary Layer Theory',
    pyqExam: 'UPSC ESE / GATE'
  },

  /* ==========================================================================
     HYDROLOGY & WATER RESOURCES ENGINEERING
     ========================================================================== */
  {
    id: 'stmt-hyd-001',
    questionNumber: 425,
    examId: 'upsc-ies-civil',
    subject: 'Water Resources Engineering',
    topic: 'Surface Water Hydrology',
    subtopic: 'Unit Hydrograph Theory',
        stem: 'Consider the following statements regarding Sherman\'s Unit Hydrograph (UH) theory:\nStatement 1: The unit hydrograph assumes that the catchment response is strictly linear and time-invariant.\nStatement 2: The rainfall excess is assumed to be uniformly distributed throughout the specified unit duration D over the entire watershed.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'C',
    formulaContext: 'UH: Direct Runoff Hydrograph resulting from 1 cm (or 1 mm) of rainfall excess',
    explanation: 'Both statements are fundamental postulates of Unit Hydrograph theory formulated by L.K. Sherman (1932):\n1. Linear response (proportionality and superposition) and time invariance (catchment parameters do not change with time).\n2. Uniform areal distribution of rainfall excess over the basin and uniform intensity throughout duration D.',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'Subramanya: Engineering Hydrology',
    pyqExam: 'UPSC ESE / APSC AE'
  },
  {
    id: 'stmt-hyd-002',
    questionNumber: 426,
    examId: 'gate-ce',
    subject: 'Water Resources Engineering',
    topic: 'Irrigation Engineering',
    subtopic: 'Duty, Delta and Water Requirements',
        stem: 'Consider the following statements regarding irrigation efficiency and soil moisture:\nStatement 1: Duty of water (D in hectares/cumec) is inversely proportional to the delta (Delta in metres) for a given base period.\nStatement 2: Available water for plant growth is the moisture held in the root zone between Field Capacity and Permanent Wilting Point.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'C',
    formulaContext: 'Delta = (8.64 * B) / D ; RAM = FC - PWP',
    explanation: 'Both statements are correct.\nStatement 1: Delta = (8.64 * B) / D, where B is base period in days and D is duty in ha/cumec. Thus Delta is inversely proportional to D.\nStatement 2: Gravitational water drains away rapidly; moisture retained against gravity at Field Capacity down to the Permanent Wilting Point is the capillary water available for crop consumption.',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'Punmia: Irrigation and Water Power Engineering',
    pyqExam: 'GATE CE / State PSC'
  },
  {
    id: 'stmt-hyd-003',
    questionNumber: 427,
    examId: 'upsc-ies-civil',
    subject: 'Water Resources Engineering',
    topic: 'Canal Design',
    subtopic: 'Kennedy vs Lacey Regime Theory',
        stem: 'Statement (I): Lacey\'s regime theory considers silt to be kept in suspension by eddies generated from the entire wetted perimeter of the channel.\nStatement (II): Kennedy\'s theory assumes that silt is kept in suspension solely by upward eddies generated from the bed of the canal.\nWhich one of the following is correct?',
    options: [
      { id: 'A', text: 'Both Statement (I) and Statement (II) are individually true and Statement (II) is the correct explanation of Statement (I)' },
      { id: 'B', text: 'Both Statement (I) and Statement (II) are individually true but Statement (II) is NOT the correct explanation of Statement (I)' },
      { id: 'C', text: 'Statement (I) is true but Statement (II) is false' },
      { id: 'D', text: 'Statement (I) is false but Statement (II) is true' }
    ],
    correctOption: 'B',
    formulaContext: 'Lacey: P = 4.75 * sqrt(Q); Kennedy: V_0 = 0.55 * m * y^0.64',
    explanation: 'Both Statement (I) and Statement (II) are individually true facts. Kennedy (1895) on Upper Bari Doab Canal assumed eddies arise only from channel bed, ignoring side friction. Gerald Lacey (1929) showed that eddies are generated along the entire semi-elliptical wetted boundary (bed and sides), giving true regime dimensions P = 4.75*sqrt(Q). Statement (II) does not explain Statement (I), they are distinct hypotheses.',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'ASSERTION_REASON',
    referenceSource: 'Garg: Irrigation Engineering and Hydraulic Structures',
    pyqExam: 'UPSC ESE / APSC AE'
  },

  /* ==========================================================================
     ENVIRONMENTAL ENGINEERING
     ========================================================================== */
  {
    id: 'stmt-env-001',
    questionNumber: 428,
    examId: 'upsc-ies-civil',
    subject: 'Environmental Engineering',
    topic: 'Water Quality & Treatment',
    subtopic: 'BOD and COD',
        stem: 'Consider the following statements regarding BOD and COD of wastewater:\nStatement 1: The Chemical Oxygen Demand (COD) of a wastewater sample is always greater than or equal to its ultimate Biochemical Oxygen Demand (BOD_u).\nStatement 2: The standard 5-day BOD at 20 deg C represents approximately 68% of the ultimate carbonaceous BOD for typical domestic sewage.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'C',
    formulaContext: 'BOD_5 = BOD_u * (1 - 10^(-k*5)) ; COD >= BOD_u',
    explanation: 'Both statements are correct.\nStatement 1: COD measures oxygen required to chemically oxidize both biodegradable and non-biodegradable organic matter using strong oxidizing agent (K2Cr2O7 in acid), whereas BOD oxidizes only biodegradable matter. Hence COD >= BOD_u.\nStatement 2: With standard deoxygenation constant k = 0.1 day^-1 (base 10), BOD_5 = BOD_u * (1 - 10^(-0.1*5)) = BOD_u * (1 - 0.316) = 0.684 * BOD_u (~68%).',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'Metcalf & Eddy: Wastewater Engineering',
    pyqExam: 'UPSC ESE / GATE'
  },
  {
    id: 'stmt-env-002',
    questionNumber: 429,
    examId: 'gate-ce',
    subject: 'Environmental Engineering',
    topic: 'Sewage Treatment',
    subtopic: 'Activated Sludge Process (ASP)',
        stem: 'Consider the following statements regarding the Activated Sludge Process (ASP):\nStatement 1: The Food-to-Microorganism ratio (F/M) is inversely related to the Mean Cell Residence Time (sludge age theta_c).\nStatement 2: Bulking of activated sludge is primarily caused by excessive growth of filamentous bacteria or low dissolved oxygen in the aeration tank.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'C',
    formulaContext: 'F/M = (Q * S_0) / (V * X) ; 1 / theta_c = Y * q - k_d',
    explanation: 'Both statements are correct.\nStatement 1: Lower F/M ratio corresponds to endogenous respiration phase with low substrate, low growth rate, and high sludge age (theta_c).\nStatement 2: Sludge bulking occurs when flocs fail to settle compact in secondary clarifier (Sludge Volume Index SVI > 150 mL/g) due to overgrowth of filamentous microorganisms under low DO, nutrient deficiency, or low pH.',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'Peavy, Rowe & Tchobanoglous: Environmental Engineering',
    pyqExam: 'GATE CE'
  },
  {
    id: 'stmt-env-003',
    questionNumber: 430,
    examId: 'upsc-ies-civil',
    subject: 'Environmental Engineering',
    topic: 'Air Pollution',
    subtopic: 'Plume Behavior & Inversion',
        stem: 'Statement (I): A looping plume occurs during super-adiabatic atmospheric lapse rate conditions under strong solar insolation and light winds.\nStatement (II): A super-adiabatic environmental lapse rate represents an extremely unstable atmosphere with rapid convective mixing.\nWhich one of the following is correct?',
    options: [
      { id: 'A', text: 'Both Statement (I) and Statement (II) are individually true and Statement (II) is the correct explanation of Statement (I)' },
      { id: 'B', text: 'Both Statement (I) and Statement (II) are individually true but Statement (II) is NOT the correct explanation of Statement (I)' },
      { id: 'C', text: 'Statement (I) is true but Statement (II) is false' },
      { id: 'D', text: 'Statement (I) is false but Statement (II) is true' }
    ],
    correctOption: 'A',
    formulaContext: 'ELR > ALR (Super-adiabatic: highly unstable, looping plume)',
    explanation: 'Both statements are true and Statement (II) is the correct explanation. When Environmental Lapse Rate (ELR) is greater than Dry Adiabatic Lapse Rate (DALR = 9.8 deg C/km), the atmosphere is super-adiabatic and highly unstable. Large convective thermals carry the effluent up and down in wide looping motions, creating high ground-level pollutant concentrations close to stack.',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'ASSERTION_REASON',
    referenceSource: 'Rao & Rao: Air Pollution',
    pyqExam: 'UPSC ESE Civil'
  },

  /* ==========================================================================
     TRANSPORTATION & HIGHWAY ENGINEERING
     ========================================================================== */
  {
    id: 'stmt-tr-001',
    questionNumber: 431,
    examId: 'upsc-ies-civil',
    subject: 'Transportation Engineering',
    topic: 'Geometric Design of Highways',
    subtopic: 'Sight Distances (SSD & OSD)',
        stem: 'Consider the following statements regarding Stopping Sight Distance (SSD) as per IRC:\nStatement 1: SSD is directly proportional to the vehicle speed and inversely proportional to the coefficient of longitudinal friction.\nStatement 2: The brake reaction time recommended by IRC:73 for design of SSD is 2.5 seconds.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'C',
    formulaContext: 'SSD = 0.278 * v * t + v^2 / (254 * f) ; t = 2.5 s',
    explanation: 'Both statements are correct. Stopping Sight Distance consists of lag distance (0.278*v*t) and braking distance (v^2 / (254*f)). Thus it increases with speed v and decreases with higher friction f. IRC:73 recommends perception-reaction time t = 2.5 seconds based on PIEV theory.',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'IRC:73-2023 & Khanna & Justo: Highway Engineering',
    pyqExam: 'APSC AE / UPSC ESE'
  },
  {
    id: 'stmt-tr-002',
    questionNumber: 432,
    examId: 'gate-ce',
    subject: 'Transportation Engineering',
    topic: 'Highway Geometric Design',
    subtopic: 'Superelevation and Transition Curves',
        stem: 'Consider the following statements regarding superelevation on horizontal curves:\nStatement 1: As per IRC, the maximum superelevation is limited to 7% for plain and rolling terrain and 10% for hilly snow-free terrain.\nStatement 2: For design of mixed traffic conditions, IRC recommends that superelevation should be designed to fully counteract the centrifugal force at 75% of the design speed, neglecting friction.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'C',
    formulaContext: 'e = (0.75 * V)^2 / (127 * R) = V^2 / (225 * R); e_max = 7% or 10%',
    explanation: 'Both statements are correct as per IRC:73 / IRC:38:\n1. e_max = 7% for plain/rolling terrain, 10% for hilly terrain not affected by snow, and 4% in built-up urban areas.\n2. To accommodate slow bullock carts and fast motor vehicles, e is designed for 75% of design speed with lateral friction f = 0, giving practical formula e = V^2 / (225*R).',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'IRC:73 & IRC:38',
    pyqExam: 'GATE CE / State PSC'
  },
  {
    id: 'stmt-tr-003',
    questionNumber: 433,
    examId: 'upsc-ies-civil',
    subject: 'Transportation Engineering',
    topic: 'Railway Engineering',
    subtopic: 'Cant Deficiency and Negative Superelevation',
        stem: 'Statement (I): Negative cant occurs when a turnout diverges from the outer rail of a main curved railway track.\nStatement (II): On a turnout taking off from the outer rail, the superelevation provided for the main track produces a negative cant on the turnout branch.\nWhich one of the following is correct?',
    options: [
      { id: 'A', text: 'Both Statement (I) and Statement (II) are individually true and Statement (II) is the correct explanation of Statement (I)' },
      { id: 'B', text: 'Both Statement (I) and Statement (II) are individually true but Statement (II) is NOT the correct explanation of Statement (I)' },
      { id: 'C', text: 'Statement (I) is true but Statement (II) is false' },
      { id: 'D', text: 'Statement (I) is false but Statement (II) is true' }
    ],
    correctOption: 'A',
    formulaContext: 'Negative cant = e_main - D_cant',
    explanation: 'Both statements are true and Statement (II) is the correct explanation. In Indian Railways, when a branch line takes off towards the outer side of a main track curve, the outer rail of the main track (which is raised for superelevation) becomes the inner rail of the turnout curve, forcing centrifugal force and cant in opposite directions (negative cant). Speed on the turnout must be severely restricted.',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'ASSERTION_REASON',
    referenceSource: 'Saxena & Arora: Railway Engineering',
    pyqExam: 'UPSC ESE Civil'
  },

  /* ==========================================================================
     SURVEYING & GEOMATICS
     ========================================================================== */
  {
    id: 'stmt-sur-001',
    questionNumber: 434,
    examId: 'upsc-ies-civil',
    subject: 'Surveying & Geomatics',
    topic: 'Levelling',
    subtopic: 'Curvature and Refraction Corrections',
        stem: 'Consider the following statements regarding earth curvature and atmospheric refraction in levelling:\nStatement 1: The correction for earth\'s curvature is always subtractive from the staff reading.\nStatement 2: The combined correction for curvature and refraction is C_comb = 0.0673 * D^2 (in metres, where D is distance in kilometres).\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'C',
    formulaContext: 'C_c = - d^2 / (2R) = - 0.0785 * D^2; C_r = + 0.0112 * D^2; C_comb = - 0.0673 * D^2',
    explanation: 'Both statements are correct.\nCurvature makes staff readings appear larger than true level, so curvature correction is always subtractive (C_c = - 0.0785 D^2). Refraction bends line of sight downward, making staff reading smaller (+ 0.0112 D^2). The combined correction is - 0.0673 D^2 metres (subtractive from staff reading).',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'Punmia: Surveying Vol. I & II',
    pyqExam: 'APSC AE / SSC JE'
  },
  {
    id: 'stmt-sur-002',
    questionNumber: 435,
    examId: 'gate-ce',
    subject: 'Surveying & Geomatics',
    topic: 'Compass Surveying',
    subtopic: 'Local Attraction and Magnetic Declination',
        stem: 'Consider the following statements regarding compass surveying:\nStatement 1: If the difference between Fore Bearing and Back Bearing of a line is exactly 180 degrees, it guarantees that both end stations are free from local attraction.\nStatement 2: Isogonic lines are imaginary lines on a map connecting points of equal magnetic declination.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'B',
    formulaContext: '|BB - FB| = 180 deg; Agonic: 0 declination; Isogonic: Equal declination',
    explanation: 'Statement 1 is incorrect: If |BB - FB| = 180 deg, both stations may be free from local attraction, OR both stations may be affected by the EXACT SAME magnitude and sign of local attraction.\nStatement 2 is correct: Isogonic lines connect points of equal magnetic declination. The line connecting points of zero declination is called an Agonic line.',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'Bannister, Raymond & Baker: Surveying',
    pyqExam: 'GATE CE / UPSC ESE'
  },
  {
    id: 'stmt-sur-003',
    questionNumber: 436,
    examId: 'upsc-ies-civil',
    subject: 'Surveying & Geomatics',
    topic: 'Photogrammetry & Remote Sensing',
    subtopic: 'Relief Displacement',
        stem: 'Statement (I): Relief displacement on a vertical aerial photograph is radial from the principal point.\nStatement (II): Relief displacement is directly proportional to the height of the ground object above the datum and its radial distance from the principal point.\nWhich one of the following is correct?',
    options: [
      { id: 'A', text: 'Both Statement (I) and Statement (II) are individually true and Statement (II) is the correct explanation of Statement (I)' },
      { id: 'B', text: 'Both Statement (I) and Statement (II) are individually true but Statement (II) is NOT the correct explanation of Statement (I)' },
      { id: 'C', text: 'Statement (I) is true but Statement (II) is false' },
      { id: 'D', text: 'Statement (I) is false but Statement (II) is true' }
    ],
    correctOption: 'A',
    formulaContext: 'd = (r * h) / H',
    explanation: 'Both statements are true and Statement (II) is the correct explanation. In vertical aerial photographs, perspective geometry causes vertical relief h to displace images radially outward from the nadir/principal point by distance d = (r * h) / H, where r is the radial distance from the principal point and H is flying height above datum.',
    difficulty: 'HARD',
    sourceType: 'MODELLED',
    questionType: 'ASSERTION_REASON',
    referenceSource: 'Lillesand & Kiefer: Remote Sensing and Image Interpretation',
    pyqExam: 'UPSC ESE / GATE'
  },

  /* ==========================================================================
     BUILDING MATERIALS & CONSTRUCTION MANAGEMENT (CPM / PERT)
     ========================================================================== */
  {
    id: 'stmt-mat-001',
    questionNumber: 437,
    examId: 'upsc-ies-civil',
    subject: 'Building Materials & Construction',
    topic: 'Cement & Pozzolanas',
    subtopic: 'Pozzolanic Reaction',
        stem: 'Consider the following statements regarding pozzolanic materials in concrete:\nStatement 1: Pozzolanas possess cementitious properties on their own when mixed with water.\nStatement 2: Pozzolanas react with calcium hydroxide [Ca(OH)2] liberated during Portland cement hydration to form secondary C-S-H gel.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'B',
    formulaContext: 'Pozzolan + Ca(OH)2 + H2O -> C-S-H gel',
    explanation: 'Statement 1 is incorrect: Pozzolanas (fly ash, silica fume, rice husk ash) have NO cementitious value by themselves.\nStatement 2 is correct: In finely divided form and in presence of water, siliceous/aluminous minerals in pozzolana chemically react with free lime Ca(OH)2 at ordinary temperatures to form insoluble cementitious calcium silicate hydrate (C-S-H gel), reducing permeability and improving long-term durability.',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'IS 3812 & Neville: Properties of Concrete',
    pyqExam: 'UPSC ESE / State AE'
  },
  {
    id: 'stmt-cpm-001',
    questionNumber: 438,
    examId: 'gate-ce',
    subject: 'Construction Management',
    topic: 'Project Scheduling',
    subtopic: 'CPM vs PERT',
        stem: 'Consider the following statements regarding project management techniques:\nStatement 1: Critical Path Method (CPM) is an activity-oriented deterministic technique suited for repetitive construction projects.\nStatement 2: In a PERT network, the probability of completing a project along the critical path on its expected completion date T_e is exactly 50%.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'C',
    formulaContext: 'PERT beta distribution: Z = (T_s - T_e) / sigma ; at T_s = T_e, Z = 0 => P = 50%',
    explanation: 'Both statements are correct.\nStatement 1: CPM was developed for industrial plants with known deterministic task durations and cost-time trade-off. It is activity-oriented.\nStatement 2: PERT assumes a normal distribution for project duration based on the Central Limit Theorem. When scheduled date T_s equals expected date T_e, standard normal deviate Z = 0, which corresponds to cumulative normal probability of 50%.',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'Punmia & Khandelwal: Project Planning with PERT and CPM',
    pyqExam: 'GATE CE / UPSC ESE'
  },
  {
    id: 'stmt-cpm-002',
    questionNumber: 439,
    examId: 'upsc-ies-civil',
    subject: 'Construction Management',
    topic: 'Network Analysis',
    subtopic: 'Total Float, Free Float and Independent Float',
        stem: 'Statement (I): Independent float of an activity can never be negative.\nStatement (II): Independent float represents the excess time available when the preceding activity finishes at its latest possible time and the succeeding activity starts at its earliest possible time.\nWhich one of the following is correct?',
    options: [
      { id: 'A', text: 'Both Statement (I) and Statement (II) are individually true and Statement (II) is the correct explanation of Statement (I)' },
      { id: 'B', text: 'Both Statement (I) and Statement (II) are individually true but Statement (II) is NOT the correct explanation of Statement (I)' },
      { id: 'C', text: 'Statement (I) is true but Statement (II) is false' },
      { id: 'D', text: 'Statement (I) is false but Statement (II) is true' }
    ],
    correctOption: 'D',
    formulaContext: 'F_ID = (E_j - L_i) - t_ij ; If negative, taken as 0',
    explanation: 'Statement (I) is false: Mathematically, Independent Float F_ID = (E_j - L_i) - t_ij. If L_i + t_ij > E_j, the value can be negative (though practically it is reported as zero, its computed value CAN be negative).\nStatement (II) is true: Independent float is the float available without affecting preceding or succeeding activities, assuming the predecessor finishes at latest time L_i and successor starts at earliest time E_j.',
    difficulty: 'HARD',
    sourceType: 'MODELLED',
    questionType: 'ASSERTION_REASON',
    referenceSource: 'Srinath: PERT and CPM Principles',
    pyqExam: 'UPSC ESE Civil'
  },

  /* ==========================================================================
     GENERAL STUDIES & ENGINEERING ETHICS
     ========================================================================== */
  {
    id: 'stmt-gs-001',
    questionNumber: 440,
    examId: 'apsc-cce-gs',
    subject: 'General Studies',
    topic: 'Indian Polity & Governance',
    subtopic: 'Fundamental Rights & Writs',
        stem: 'Consider the following statements regarding the writ jurisdiction in India:\nStatement 1: The writ of Habeas Corpus can be issued against both public authorities and private individuals.\nStatement 2: The writ of Quo-Warranto can be sought only by an aggrieved person who has suffered personal legal injury.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'A',
    formulaContext: 'Article 32 & 226',
    explanation: 'Statement 1 is correct: Habeas Corpus ("to have the body of") can be issued against arbitrary detention by state authorities as well as private individuals.\nStatement 2 is incorrect: The writ of Quo-Warranto can be sought by ANY interested citizen, not necessarily an aggrieved person, because it inquires into the legality of a person holding a public office.',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'Laxmikanth: Indian Polity',
    pyqExam: 'UPSC CSE / APSC CCE'
  },
  {
    id: 'stmt-gs-002',
    questionNumber: 441,
    examId: 'apsc-cce-gs',
    subject: 'General Studies',
    topic: 'Environment & Climate Change',
    subtopic: 'Greenhouse Gases & Global Warming Potential',
        stem: 'Consider the following statements regarding greenhouse gases:\nStatement 1: Water vapour is the most abundant natural greenhouse gas in Earth\'s atmosphere.\nStatement 2: Sulfur hexafluoride (SF6) has one of the highest Global Warming Potentials (GWP) among all synthetic gases evaluated by the IPCC.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'C',
    formulaContext: 'SF6 GWP_100 ≈ 23,500 relative to CO2',
    explanation: 'Both statements are correct.\nStatement 1: Water vapour is responsible for the largest share (approx. 36-70%) of the natural greenhouse effect.\nStatement 2: SF6, used in electrical switchgear, has a 100-year GWP of 23,500 times that of CO2 and an atmospheric lifetime exceeding 3,000 years.',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'IPCC AR6 Assessment Report',
    pyqExam: 'UPSC Prelims / APSC GS'
  },

  /* ==========================================================================
     ADDITIONAL COMPREHENSIVE STATEMENT-BASED MCQs (UPSC ESE / GATE CE)
     ========================================================================== */
  {
    id: 'stmt-geo-009',
    questionNumber: 442,
    examId: 'upsc-ies-civil',
    subject: 'Geotechnical Engineering',
    topic: 'Soil Classification & Plasticity',
    subtopic: 'Casagrande A-Line Chart',
        stem: 'Consider the following statements regarding Casagrande\'s Plasticity Chart as per IS 1498:\nStatement 1: Soils plotting above the A-line are categorized as inorganic clays, whereas soils plotting below the A-line are inorganic silts or organic soils.\nStatement 2: The equation of the A-line is I_p = 0.73 * (w_L - 20), where w_L is the liquid limit in percent.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'C',
    formulaContext: 'A-Line: I_p = 0.73 * (w_L - 20) ; U-Line: I_p = 0.9 * (w_L - 8)',
    explanation: 'Both statements are correct as per IS 1498 (ISCS):\\nStatement 1: The A-line cleanly separates inorganic clays (CH, CI, CL) lying above from silts (MH, MI, ML) and organic soils (OH, OI, OL) lying below.\\nStatement 2: The standard A-line equation is I_p = 0.73 * (w_L - 20). If I_p is between 4 and 7% and w_L is between 12% and 25%, a dual symbol CL-ML is used.',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'IS 1498:1970',
    pyqExam: 'APSC AE / UPSC ESE'
  },
  {
    id: 'stmt-geo-010',
    questionNumber: 443,
    examId: 'gate-ce',
    subject: 'Geotechnical Engineering',
    topic: 'Shear Strength of Soils',
    subtopic: 'Triaxial Test Types',
        stem: 'Consider the following statements regarding triaxial shear tests:\nStatement 1: An Unconsolidated Undrained (UU) test on a saturated clay yields an angle of shearing resistance phi_u equal to zero under total stress analysis.\nStatement 2: In a Consolidated Drained (CD) triaxial test, excess pore water pressure is allowed to dissipate completely during both the consolidation and shearing stages.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'C',
    formulaContext: 'UU test saturated clay: phi_u = 0, tau_f = c_u = q_u / 2',
    explanation: 'Both statements are correct.\\nStatement 1: For 100% saturated clay in UU test without drainage, any increase in cell pressure sigma_3 is carried entirely by pore water pressure (Delta_u = Delta_sigma_3). Hence the Mohr effective stress circles are identical, giving horizontal total stress failure envelope with phi_u = 0.\\nStatement 2: CD (slow) test allows full drainage throughout, so pore pressure u remains zero and total stress equals effective stress at all times.',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'Bishop & Henkel: The Measurement of Soil Properties',
    pyqExam: 'GATE CE / UPSC ESE'
  },
  {
    id: 'stmt-geo-011',
    questionNumber: 444,
    examId: 'upsc-ies-civil',
    subject: 'Geotechnical Engineering',
    topic: 'Deep Foundations',
    subtopic: 'Pile Group Efficiency',
        stem: 'Statement (I): For a friction pile group driven into loose sand, the group efficiency can be greater than 100%.\nStatement (II): Driving of displacement piles into loose cohesionless sand compacts and densifies the surrounding sand mass, increasing its angle of internal friction.\nWhich one of the following is correct?',
    options: [
      { id: 'A', text: 'Both Statement (I) and Statement (II) are individually true and Statement (II) is the correct explanation of Statement (I)' },
      { id: 'B', text: 'Both Statement (I) and Statement (II) are individually true but Statement (II) is NOT the correct explanation of Statement (I)' },
      { id: 'C', text: 'Statement (I) is true but Statement (II) is false' },
      { id: 'D', text: 'Statement (I) is false but Statement (II) is true' }
    ],
    correctOption: 'A',
    formulaContext: 'eta_g = Q_g / (n * Q_single) > 1.0 (in loose sands)',
    explanation: 'Both statements are true and Statement (II) is the correct explanation. When piles are driven into loose sand at standard spacing (2.5D to 3D), vibrations and lateral displacement compact the soil mass between the piles, substantially raising the density index and friction angle phi, so group capacity exceeds the sum of individual capacities (eta_g > 100%). In clays, however, eta_g is always <= 100%.',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'ASSERTION_REASON',
    referenceSource: 'IS 2911 & Tomlinson: Pile Design and Construction',
    pyqExam: 'UPSC ESE Civil'
  },
  {
    id: 'stmt-rcc-004',
    questionNumber: 445,
    examId: 'upsc-ies-civil',
    subject: 'Reinforced Concrete Structures',
    topic: 'Columns & Compression Members',
    subtopic: 'Helical Reinforcement in Columns',
        stem: 'Consider the following statements regarding helically reinforced RCC columns as per IS 456:2000:\nStatement 1: The load carrying capacity of a column with helical reinforcement is 5% greater than that of an otherwise identical column with lateral ties.\nStatement 2: The ratio of the volume of helical reinforcement to the volume of the core must be at least 0.36 * (A_g / A_c - 1) * (f_ck / f_y).\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'C',
    formulaContext: 'P_u = 1.05 * (0.4 f_ck A_c + 0.67 f_y A_sc) ; V_h / V_c >= 0.36(A_g/A_c - 1)(f_ck/f_y)',
    explanation: 'Both statements are correct as per IS 456:2000 Cl. 39.4.1. Helical spirals provide continuous lateral triaxial confinement to the core concrete, enhancing both compressive strength and ductility, allowing a 5% strength enhancement if the minimum volume ratio criteria is met.',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'IS 456:2000, Cl. 39.4',
    pyqExam: 'APSC AE / State PSC'
  },
  {
    id: 'stmt-rcc-005',
    questionNumber: 446,
    examId: 'gate-ce',
    subject: 'Reinforced Concrete Structures',
    topic: 'Slabs & Footings',
    subtopic: 'Punching Shear (Two-way Shear)',
        stem: 'Consider the following statements regarding two-way shear (punching shear) in isolated footings and flat slabs:\nStatement 1: The critical section for two-way punching shear is located at a distance of d/2 from the periphery of the column face, where d is effective depth.\nStatement 2: As per IS 456:2000, the allowable shear stress in two-way punching shear is k_s * 0.25 * sqrt(f_ck), where k_s = (0.5 + beta_c) <= 1.0.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'C',
    formulaContext: 'tau_c = k_s * 0.25 * sqrt(f_ck); Critical perimeter at d/2',
    explanation: 'Both statements are correct as per IS 456:2000 Cl. 31.6.3 and Cl. 34.2.4. One-way shear is checked at distance d from column face, whereas two-way (punching) shear is checked along a perimeter at distance d/2 from column face.',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'IS 456:2000, Cl. 31.6',
    pyqExam: 'GATE CE / UPSC ESE'
  },
  {
    id: 'stmt-psc-002',
    questionNumber: 447,
    examId: 'upsc-ies-civil',
    subject: 'Prestressed Concrete',
    topic: 'Load Balancing Concept',
    subtopic: 'Parabolic Tendon Profile',
        stem: 'Consider the following statements regarding the load balancing concept in prestressed concrete beams:\nStatement 1: For a simply supported beam carrying a uniformly distributed load w, a parabolic cable with central sag h produces a uniform upward vertical thrust equal to (8 * P * h) / L^2.\nStatement 2: When the upward thrust exactly balances the downward gravity load, the concrete beam experiences only uniform axial compression across its entire span.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'C',
    formulaContext: 'w_up = (8 * P * h) / L^2 ; Net stress = P / A',
    explanation: 'Both statements are correct as formulated by T.Y. Lin. Cable tension P along parabolic profile acts like an inverted suspension cable, exerting upward uniform load w_up = 8*P*h / L^2. When w_up = w_ext, transverse shear and bending moments vanish completely, leaving only uniform direct compressive stress sigma = P/A.',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'T.Y. Lin: Design of Prestressed Concrete Structures',
    pyqExam: 'UPSC ESE / GATE'
  },
  {
    id: 'stmt-stl-004',
    questionNumber: 448,
    examId: 'gate-ce',
    subject: 'Design of Steel Structures',
    topic: 'Beams & Girders',
    subtopic: 'Web Buckling vs Web Crippling',
        stem: 'Consider the following statements regarding web failure modes in steel I-beams as per IS 800:2007:\nStatement 1: Web buckling occurs due to diagonal compression under concentrated flange loads acting as a column over a dispersion angle of 45 degrees.\nStatement 2: Web crippling occurs due to localized yielding of the web at the junction of the web and root of flange radius over a dispersion angle of 1:2.5.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'C',
    formulaContext: 'Web Buckling: 45 deg dispersion; Web Crippling: 1:2.5 (1 vertical to 2.5 horizontal) dispersion',
    explanation: 'Both statements are correct as per IS 800:2007 Cl. 8.7.3 and Cl. 8.7.4. Web buckling is an elastic or inelastic buckling of web treated as a strut of width (b1 + n1) with 45 degree dispersion. Web crippling is localized bearing crushing/yielding of the web toe at slope 1:2.5.',
    difficulty: 'HARD',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'IS 800:2007, Cl. 8.7',
    pyqExam: 'GATE CE / UPSC ESE'
  },
  {
    id: 'stmt-stl-005',
    questionNumber: 449,
    examId: 'upsc-ies-civil',
    subject: 'Design of Steel Structures',
    topic: 'Tension Members',
    subtopic: 'Shear Lag Effect',
        stem: 'Statement (I): In a single angle tension member connected by one leg only, the net effective cross-sectional area is less than the actual net area of the section.\nStatement (II): Shear lag causes non-uniform stress distribution across the cross-section, with higher stresses in the connected leg and lower stresses in the outstanding leg.\nWhich one of the following is correct?',
    options: [
      { id: 'A', text: 'Both Statement (I) and Statement (II) are individually true and Statement (II) is the correct explanation of Statement (I)' },
      { id: 'B', text: 'Both Statement (I) and Statement (II) are individually true but Statement (II) is NOT the correct explanation of Statement (I)' },
      { id: 'C', text: 'Statement (I) is true but Statement (II) is false' },
      { id: 'D', text: 'Statement (I) is false but Statement (II) is true' }
    ],
    correctOption: 'A',
    formulaContext: 'A_net,eff = A_nc + beta * A_go (IS 800:2007 Cl. 6.3.3)',
    explanation: 'Both statements are true and Statement (II) is the correct explanation. When an angle member is connected through only one leg, load is transferred into that leg directly, but stress must transfer into the outstanding leg via in-plane shear strains. Because shear rigidity is finite, the outstanding leg lags behind in taking load (shear lag), reducing net effective tensile capacity.',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'ASSERTION_REASON',
    referenceSource: 'IS 800:2007, Cl. 6.3.3',
    pyqExam: 'UPSC ESE / State AE'
  },
  {
    id: 'stmt-fmc-005',
    questionNumber: 450,
    examId: 'gate-ce',
    subject: 'Fluid Mechanics & Hydraulics',
    topic: 'Pipe Flow & Energy Losses',
    subtopic: 'Darcy-Weisbach vs Hazen-Williams',
        stem: 'Consider the following statements regarding friction losses in pipe flow:\nStatement 1: The Darcy-Weisbach head loss equation is dimensionally homogeneous and applicable to any Newtonian fluid in laminar or turbulent flow.\nStatement 2: The Darcy friction factor f for fully turbulent flow in rough pipes depends only on the relative roughness (epsilon / D) and is independent of Reynolds number.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'C',
    formulaContext: 'h_f = (f * L * v^2) / (2 * g * D); Fully rough: 1/sqrt(f) = 2*log10(3.7*D/epsilon)',
    explanation: 'Both statements are correct.\\nStatement 1: Darcy-Weisbach equation h_f = f*L*V^2 / (2*g*D) is mathematically rigorous and valid for all fluids.\\nStatement 2: In the fully rough turbulent regime (von Karman complete turbulence), viscous sublayer is completely submerged by surface asperities; hence friction factor curves on the Moody chart become horizontal lines governed solely by relative roughness epsilon/D.',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'Moody Chart & Streeter: Fluid Mechanics',
    pyqExam: 'GATE CE / UPSC ESE'
  },
  {
    id: 'stmt-fmc-006',
    questionNumber: 451,
    examId: 'upsc-ies-civil',
    subject: 'Fluid Mechanics & Hydraulics',
    topic: 'Hydraulic Machinery',
    subtopic: 'Turbines & Specific Speed',
        stem: 'Consider the following statements regarding hydraulic turbines:\nStatement 1: A Pelton wheel is an impulse turbine suited for high heads and low discharges, having a low specific speed (8 to 30 rpm).\nStatement 2: A Kaplan turbine is an axial flow reaction turbine with adjustable runner blades, ideal for low heads and large discharges.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'C',
    formulaContext: 'N_s = (N * sqrt(P)) / H^(5/4) ; Pelton: N_s < 30; Kaplan: N_s > 300',
    explanation: 'Both statements are correct.\\nPelton turbine uses purely kinetic impulse energy of water jets from nozzles under high head (H > 250 m), with specific speed N_s between 8 and 30 (single jet).\\nKaplan turbine is an axial reaction turbine with variable-pitch blades providing flat high efficiency over varying discharges under low heads (H < 30 m), with N_s from 300 to 1000 rpm.',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'Jagdish Lal: Hydraulic Machines',
    pyqExam: 'APSC AE / State PSC'
  },
  {
    id: 'stmt-env-004',
    questionNumber: 452,
    examId: 'upsc-ies-civil',
    subject: 'Environmental Engineering',
    topic: 'Water Filtration',
    subtopic: 'Slow Sand vs Rapid Sand Filters',
        stem: 'Consider the following statements regarding water filtration:\nStatement 1: The rate of filtration in a Rapid Sand Filter is approximately 20 to 30 times higher than that of a Slow Sand Filter.\nStatement 2: Slow sand filters require chemical coagulants like alum for efficient turbidity removal before filtration.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'A',
    formulaContext: 'SSF: 100-200 L/m2/h; RSF: 3000-6000 L/m2/h (~30 times higher)',
    explanation: 'Statement 1 is correct: Slow Sand Filter operates at 100 to 200 L/m^2/hr, while Rapid Sand Filter operates at 3,000 to 6,000 L/m^2/hr (approx. 30 times higher rate).\\nStatement 2 is incorrect: Slow sand filters rely on physical straining and biological action of the Schmutzdecke layer and do NOT use coagulants (coagulants would rapidly blind the surface sand pores). Coagulation and flocculation are mandatory only for Rapid Sand Filters.',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'Garg: Water Supply Engineering',
    pyqExam: 'UPSC ESE / APSC AE'
  },
  {
    id: 'stmt-env-005',
    questionNumber: 453,
    examId: 'gate-ce',
    subject: 'Environmental Engineering',
    topic: 'Disinfection of Water',
    subtopic: 'Break-point Chlorination',
        stem: 'Statement (I): Break-point chlorination ensures that both combined residual chlorine and free residual chlorine are present in treated drinking water.\nStatement (II): Beyond the break-point, any additional chlorine added to water appears directly as free available residual chlorine (HOCl and OCl-).\nWhich one of the following is correct?',
    options: [
      { id: 'A', text: 'Both Statement (I) and Statement (II) are individually true and Statement (II) is the correct explanation of Statement (I)' },
      { id: 'B', text: 'Both Statement (I) and Statement (II) are individually true but Statement (II) is NOT the correct explanation of Statement (I)' },
      { id: 'C', text: 'Statement (I) is true but Statement (II) is false' },
      { id: 'D', text: 'Statement (I) is false but Statement (II) is true' }
    ],
    correctOption: 'D',
    formulaContext: 'Cl2 + H2O <-> HOCl + H+ + Cl- ; Beyond break point: free residual',
    explanation: 'Statement (I) is false: At break point, all ammonia chloramines are oxidized to nitrogen gas (N2, N2O). Beyond break-point, residual chlorine exists as FREE residual chlorine (hypochlorous acid HOCl and hypochlorite ion OCl-), NOT combined chloramines.\\nStatement (II) is true: Once demand and ammonia are consumed, the residual curve rises linearly with 100% of added chlorine appearing as free residual.',
    difficulty: 'HARD',
    sourceType: 'MODELLED',
    questionType: 'ASSERTION_REASON',
    referenceSource: 'Fair, Geyer & Okun: Water and Wastewater Engineering',
    pyqExam: 'GATE CE / UPSC ESE'
  },
  {
    id: 'stmt-tr-004',
    questionNumber: 454,
    examId: 'gate-ce',
    subject: 'Transportation Engineering',
    topic: 'Pavement Design',
    subtopic: 'Flexible vs Rigid Pavements',
        stem: 'Consider the following statements regarding pavement design:\nStatement 1: Flexible pavements transfer vehicular wheel loads to the subgrade primarily through grain-to-grain contact and aggregate interlock.\nStatement 2: Rigid pavements transfer wheel loads primarily through beam / slab action (flexural rigidity) across a wide area of the foundation.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'C',
    formulaContext: 'Flexible: Stress distribution cone; Rigid: Westergaard flexural modulus k',
    explanation: 'Both statements are correct.\\nStatement 1: Flexible pavements consist of layered granular/bituminous materials with low tensile strength, distributing wheel loads through grain-to-grain stress distribution layers downward to subgrade.\\nStatement 2: Rigid pavements (PQC) have high modulus of elasticity and flexural strength, bridging over subgrade weaknesses via slab action.',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'IRC:37 & IRC:58 & Yoder: Principles of Pavement Design',
    pyqExam: 'GATE CE / State PSC'
  },
  {
    id: 'stmt-tr-005',
    questionNumber: 455,
    examId: 'upsc-ies-civil',
    subject: 'Transportation Engineering',
    topic: 'Traffic Engineering',
    subtopic: 'Greenshields Macroscopic Stream Model',
        stem: 'Consider the following statements regarding Greenshields\' linear traffic flow model (v = v_f * (1 - k / k_j)):\nStatement 1: The maximum traffic capacity (flow rate q_max) occurs when the speed is equal to half the free-flow speed (v_f / 2).\nStatement 2: The density at maximum capacity is equal to half the jam density (k_j / 2).\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'C',
    formulaContext: 'q_max = (v_f * k_j) / 4 ; at v = v_f/2 and k = k_j/2',
    explanation: 'Both statements are correct. Flow q = v * k = v_f * (k - k^2 / k_j). Setting dq/dk = 0 gives k_opt = k_j / 2, and substituting back gives v_opt = v_f / 2. The maximum flow rate (capacity) is q_max = (v_f * k_j) / 4.',
    difficulty: 'EASY',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'Kadiyali: Traffic Engineering and Transport Planning',
    pyqExam: 'GATE CE / UPSC ESE'
  },
  {
    id: 'stmt-sur-004',
    questionNumber: 456,
    examId: 'upsc-ies-civil',
    subject: 'Surveying & Geomatics',
    topic: 'Theodolite & Adjustments',
    subtopic: 'Errors and Elimination by Face Left/Right',
        stem: 'Consider the following statements regarding theodolite adjustments:\nStatement 1: Taking the mean of face left and face right observations completely eliminates error due to collimation axis not being perpendicular to the horizontal axis.\nStatement 2: Taking the mean of face left and face right observations eliminates the error caused by the horizontal axis not being perpendicular to the vertical axis.\nWhich of the above statements is/are correct?',
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: 'Both 1 and 2' },
      { id: 'D', text: 'Neither 1 nor 2' }
    ],
    correctOption: 'C',
    formulaContext: 'Two-face observation eliminates: collimation error, horizontal axis tilt, index error',
    explanation: 'Both statements are correct. Face left and face right reversals (transiting the telescope and revolving 180 degrees) invert the instrument geometry, so collimation line error, horizontal axis error, and vertical circle index error reverse in algebraic sign and cancel out when averaged. Note: Plate bubble leveling error cannot be eliminated by double centering.',
    difficulty: 'MEDIUM',
    sourceType: 'MODELLED',
    questionType: 'STATEMENT_BASED',
    referenceSource: 'Punmia: Surveying Vol. II',
    pyqExam: 'UPSC ESE / State PSC'
  }

];
