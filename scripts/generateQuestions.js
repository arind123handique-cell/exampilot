const fs = require('fs');
const path = require('path');

// ==========================================
// 100 CIVIL ENGINEERING QUESTIONS
// ==========================================
const civilQuestions = [
  // RCC & Pre-stressed (1-15)
  {
    id: 'ce-q-001',
    questionNumber: 1,
    examId: 'apsc-ae-civil',
    subject: 'Reinforced Concrete Structures',
    topic: 'Limit State Design — Flexure',
    subtopic: 'Limiting Neutral Axis Depth',
    stem: 'As per IS 456:2000, what is the limiting depth of neutral axis (xu,max / d) for Fe 500 grade steel in limit state design of flexural members?',
    options: [
      { id: 'A', text: '0.53' },
      { id: 'B', text: '0.48' },
      { id: 'C', text: '0.46' },
      { id: 'D', text: '0.44' }
    ],
    correctOption: 'C',
    formulaContext: 'xu,max / d = 0.0035 / (0.0055 + 0.87 * fy / Es)',
    explanation: 'According to IS 456:2000 Clause 38.1 Note, linear strain compatibility gives xu,max/d = 0.53 for Fe 250, 0.48 for Fe 415, 0.46 for Fe 500, and 0.44 for Fe 550.',
    referenceSource: 'IS 456:2000, Clause 38.1',
    difficulty: 'EASY',
    pyqYear: 2024,
    pyqExam: 'Testbook Model / APSC AE Civil 2024'
  },
  {
    id: 'ce-q-002',
    questionNumber: 2,
    examId: 'apsc-ae-civil',
    subject: 'Reinforced Concrete Structures',
    topic: 'Shear and Bond',
    subtopic: 'Development Length',
    stem: 'The development length (Ld) of a tension reinforcing bar of nominal diameter φ is given by IS 456:2000 as:',
    options: [
      { id: 'A', text: 'Ld = (φ · σs) / (2 · τbd)' },
      { id: 'B', text: 'Ld = (φ · σs) / (4 · τbd)' },
      { id: 'C', text: 'Ld = (φ · σs) / (8 · τbd)' },
      { id: 'D', text: 'Ld = (2 · φ · σs) / (3 · τbd)' }
    ],
    correctOption: 'B',
    formulaContext: 'Ld = (φ · σs) / (4 · τbd)',
    explanation: 'Per IS 456:2000 Cl. 26.2.1, equating tensile bar force (π/4 φ² σs) to bond resistance (π φ Ld τbd) yields Ld = (φ · σs) / (4 · τbd). For deformed bars (HYSD), τbd is increased by 60%. For bars in compression, τbd is increased by 25%.',
    referenceSource: 'IS 456:2000 Cl. 26.2.1',
    difficulty: 'EASY',
    pyqYear: 2023,
    pyqExam: 'Testbook Model / APSC AE Civil 2023'
  },
  {
    id: 'ce-q-003',
    questionNumber: 3,
    examId: 'apsc-ae-civil',
    subject: 'Reinforced Concrete Structures',
    topic: 'Beams & Slabs',
    subtopic: 'Minimum Tensile Reinforcement',
    stem: 'As per IS 456:2000, the minimum area of tension reinforcement in a rectangular beam shall not be less than:',
    options: [
      { id: 'A', text: 'As / (b · d) = 0.85 / fy' },
      { id: 'B', text: 'As / (b · d) = 0.40 / fy' },
      { id: 'C', text: 'As / (b · D) = 0.12%' },
      { id: 'D', text: 'As / (b · d) = 0.04 · b · d' }
    ],
    correctOption: 'A',
    formulaContext: 'As,min / (b · d) = 0.85 / fy',
    explanation: 'IS 456:2000 Clause 26.5.1.1 specifies that the minimum area of tension reinforcement in beams is As,min = (0.85 · b · d) / fy, where b is width of beam, d is effective depth, and fy is characteristic steel strength.',
    referenceSource: 'IS 456:2000 Cl. 26.5.1.1',
    difficulty: 'EASY',
    pyqYear: 2022,
    pyqExam: 'Testbook Model / APSC AE Civil 2022'
  },
  {
    id: 'ce-q-004',
    questionNumber: 4,
    examId: 'apsc-ae-civil',
    subject: 'Reinforced Concrete Structures',
    topic: 'Shear Design',
    subtopic: 'Critical Section for Shear',
    stem: 'In a simply supported RCC beam resting on masonry support subjected to uniformly distributed load, the critical section for checking nominal shear stress (τv) is located at a distance of:',
    options: [
      { id: 'A', text: 'd/2 from the face of support' },
      { id: 'B', text: 'd from the face of support' },
      { id: 'C', text: 'At the center of support' },
      { id: 'D', text: '2d from the face of support' }
    ],
    correctOption: 'B',
    formulaContext: 'Critical section distance = effective depth (d) from support face',
    explanation: 'According to IS 456:2000 Clause 31.6.2 and 22.6.2, when the reaction in the direction of the applied shear introduces compression into the end regions of the member, the critical section for shear is taken at a distance d (effective depth) from the face of the support.',
    referenceSource: 'IS 456:2000 Cl. 22.6.2 & 31.6.2',
    difficulty: 'MEDIUM',
    pyqYear: 2024,
    pyqExam: 'Testbook Model / APSC AE Civil 2024'
  },
  {
    id: 'ce-q-005',
    questionNumber: 5,
    examId: 'apsc-ae-civil',
    subject: 'Reinforced Concrete Structures',
    topic: 'Shear Reinforcement',
    subtopic: 'Maximum Stirrup Spacing',
    stem: 'As per IS 456:2000, the maximum spacing of vertical shear stirrups along the axis of the beam shall not exceed:',
    options: [
      { id: 'A', text: '0.75 d or 300 mm, whichever is less' },
      { id: 'B', text: 'd or 300 mm, whichever is less' },
      { id: 'C', text: '0.75 d or 450 mm, whichever is less' },
      { id: 'D', text: '0.50 d or 300 mm, whichever is less' }
    ],
    correctOption: 'A',
    formulaContext: 'Spacing Sv ≤ min(0.75 d, 300 mm)',
    explanation: 'Clause 26.5.1.5 of IS 456:2000 states that the spacing of stirrups measured along the member axis shall not exceed 0.75 d for vertical stirrups and d for inclined stirrups at 45°, where d is the effective depth, but in no case shall it exceed 300 mm.',
    referenceSource: 'IS 456:2000 Cl. 26.5.1.5',
    difficulty: 'EASY',
    pyqYear: 2023,
    pyqExam: 'Testbook Model / APSC AE Civil 2023'
  },
  {
    id: 'ce-q-006',
    questionNumber: 6,
    examId: 'apsc-ae-civil',
    subject: 'Reinforced Concrete Structures',
    topic: 'Slab Design',
    subtopic: 'Maximum Bar Diameter in Slabs',
    stem: 'The diameter of reinforcing bars in a slab shall not exceed what fraction of the total thickness of the slab as per IS 456:2000?',
    options: [
      { id: 'A', text: 'One-fourth (1/4) of total thickness' },
      { id: 'B', text: 'One-eighth (1/8) of total thickness' },
      { id: 'C', text: 'One-tenth (1/10) of total thickness' },
      { id: 'D', text: 'One-sixth (1/6) of total thickness' }
    ],
    correctOption: 'B',
    formulaContext: 'φ_bar ≤ D_slab / 8',
    explanation: 'According to IS 456:2000 Clause 26.5.2.2, the diameter of reinforcing bars shall not exceed one-eighth of the total thickness of the slab.',
    referenceSource: 'IS 456:2000 Cl. 26.5.2.2',
    difficulty: 'EASY',
    pyqYear: 2021,
    pyqExam: 'Testbook Model / APSC AE Civil 2021'
  },
  {
    id: 'ce-q-007',
    questionNumber: 7,
    examId: 'apsc-ae-civil',
    subject: 'Reinforced Concrete Structures',
    topic: 'Durability & Concrete Mix',
    subtopic: 'Minimum Grade for Severe Exposure',
    stem: 'As per IS 456:2000 Table 5, what is the minimum grade of concrete recommended for reinforced concrete (RCC) exposed to "Severe" environmental conditions?',
    options: [
      { id: 'A', text: 'M 20' },
      { id: 'B', text: 'M 25' },
      { id: 'C', text: 'M 30' },
      { id: 'D', text: 'M 35' }
    ],
    correctOption: 'C',
    formulaContext: 'Severe exposure min grade = M 30; Plain concrete min grade = M 20',
    explanation: 'Per IS 456 Table 5, minimum grades for RCC under environmental exposure conditions are: Mild (M20), Moderate (M25), Severe (M30), Very Severe (M35), and Extreme (M40).',
    referenceSource: 'IS 456:2000 Table 5',
    difficulty: 'MEDIUM',
    pyqYear: 2024,
    pyqExam: 'Testbook Model / APSC AE Civil 2024'
  },
  {
    id: 'ce-q-008',
    questionNumber: 8,
    examId: 'apsc-ae-civil',
    subject: 'Reinforced Concrete Structures',
    topic: 'Limit State Philosophy',
    subtopic: 'Partial Safety Factors',
    stem: 'In the limit state of collapse, the partial safety factors for concrete (γc) and steel (γs) are taken as:',
    options: [
      { id: 'A', text: '1.15 and 1.50 respectively' },
      { id: 'B', text: '1.50 and 1.15 respectively' },
      { id: 'C', text: '1.50 and 1.00 respectively' },
      { id: 'D', text: '1.20 and 1.15 respectively' }
    ],
    correctOption: 'B',
    formulaContext: 'γc = 1.50, γs = 1.15 (Collapse)',
    explanation: 'Concrete has higher variability in material preparation and compaction on site compared to factory-controlled steel. Hence IS 456 adopts γc = 1.50 and γs = 1.15 in Limit State of Collapse (Clause 36.4.2).',
    referenceSource: 'IS 456:2000 Cl. 36.4.2',
    difficulty: 'EASY',
    pyqYear: 2022,
    pyqExam: 'Testbook Model / APSC AE Civil 2022'
  },
  {
    id: 'ce-q-009',
    questionNumber: 9,
    examId: 'apsc-ae-civil',
    subject: 'Reinforced Concrete Structures',
    topic: 'Flexural Failure Modes',
    subtopic: 'Under-reinforced Beam Characteristics',
    stem: 'An under-reinforced RCC beam section is designed because:',
    options: [
      { id: 'A', text: 'It undergoes sudden, brittle failure without prior warning' },
      { id: 'B', text: 'Steel yields before concrete crushes, giving ample ductile deflection and crack warning' },
      { id: 'C', text: 'It requires maximum amount of steel and minimizes beam depth' },
      { id: 'D', text: 'Neutral axis depth exceeds the limiting neutral axis depth' }
    ],
    correctOption: 'B',
    formulaContext: 'xu < xu,max; εs ≥ 0.87 fy / Es + 0.002 before εc reaches 0.0035',
    explanation: 'Under-reinforced sections ensure that the tensile steel reaches its yield point long before concrete reaches its ultimate crushing strain (0.0035). This produces large visible cracks and deflections, ensuring ductile failure and safety.',
    referenceSource: 'IS 456:2000 Cl. 38.1',
    difficulty: 'EASY',
    pyqYear: 2024,
    pyqExam: 'Testbook Model / APSC AE Civil 2024'
  },
  {
    id: 'ce-q-010',
    questionNumber: 10,
    examId: 'apsc-ae-civil',
    subject: 'Reinforced Concrete Structures',
    topic: 'Columns',
    subtopic: 'Minimum Eccentricity Check',
    stem: 'As per IS 456:2000, all columns shall be designed for minimum eccentricity emin given by:',
    options: [
      { id: 'A', text: 'emin = L/500 + D/30, subject to a minimum of 20 mm' },
      { id: 'B', text: 'emin = L/300 + D/20, subject to a minimum of 25 mm' },
      { id: 'C', text: 'emin = L/500 + D/50, subject to a minimum of 15 mm' },
      { id: 'D', text: 'emin = L/250 + D/30, subject to a minimum of 20 mm' }
    ],
    correctOption: 'A',
    formulaContext: 'emin = max(L/500 + D/30, 20 mm)',
    explanation: 'IS 456:2000 Clause 25.4 specifies that all columns shall be designed for an unsupported length L and lateral dimension D with minimum eccentricity emin = unsupported length/500 + lateral dimension/30, subject to a minimum of 20 mm.',
    referenceSource: 'IS 456:2000 Cl. 25.4',
    difficulty: 'MEDIUM',
    pyqYear: 2023,
    pyqExam: 'Testbook Model / APSC AE Civil 2023'
  },
  {
    id: 'ce-q-011',
    questionNumber: 11,
    examId: 'apsc-ae-civil',
    subject: 'Reinforced Concrete Structures',
    topic: 'Columns',
    subtopic: 'Short vs Slender Column Criteria',
    stem: 'A reinforced concrete column is classified as a "Short Column" if the ratio of effective length (Leff) to its least lateral dimension (D or b) is:',
    options: [
      { id: 'A', text: 'Greater than 12' },
      { id: 'B', text: 'Less than 12' },
      { id: 'C', text: 'Between 12 and 18' },
      { id: 'D', text: 'Less than 3' }
    ],
    correctOption: 'B',
    formulaContext: 'Slenderness ratio λ = Leff / b < 12 => Short Column',
    explanation: 'Clause 25.1.2 of IS 456 defines a short column as one where both effective length ratios (Lex / D and Ley / b) are less than 12. If either ratio is 12 or more, it is considered a slender (long) column.',
    referenceSource: 'IS 456:2000 Cl. 25.1.2',
    difficulty: 'EASY',
    pyqYear: 2021,
    pyqExam: 'Testbook Model / APSC AE Civil 2021'
  },
  {
    id: 'ce-q-012',
    questionNumber: 12,
    examId: 'apsc-ae-civil',
    subject: 'Reinforced Concrete Structures',
    topic: 'Detailing of Reinforcement',
    subtopic: 'Nominal Cover for Footing',
    stem: 'As per IS 456:2000, what is the minimum nominal clear cover required for footing reinforcement cast directly against earth?',
    options: [
      { id: 'A', text: '25 mm' },
      { id: 'B', text: '40 mm' },
      { id: 'C', text: '50 mm' },
      { id: 'D', text: '75 mm' }
    ],
    correctOption: 'C',
    formulaContext: 'Footing nominal cover = 50 mm (if directly against earth without blinding layer, 75 mm)',
    explanation: 'Clause 26.4.2.2 and Table 16 specify that the minimum nominal cover for footings is 50 mm. When concrete is placed directly against untreated soil, cover is commonly increased to 75 mm.',
    referenceSource: 'IS 456:2000 Cl. 26.4.2.2',
    difficulty: 'EASY',
    pyqYear: 2024,
    pyqExam: 'Testbook Model / APSC AE Civil 2024'
  },
  {
    id: 'ce-q-013',
    questionNumber: 13,
    examId: 'apsc-ae-civil',
    subject: 'Reinforced Concrete Structures',
    topic: 'Bond & Anchorage',
    subtopic: 'Deformed Bars Bond Stress Increment',
    stem: 'For deformed bars conforming to IS 1786 (HYSD bars), the design bond stress values given in IS 456:2000 for plain bars in tension shall be increased by:',
    options: [
      { id: 'A', text: '25%' },
      { id: 'B', text: '40%' },
      { id: 'C', text: '50%' },
      { id: 'D', text: '60%' }
    ],
    correctOption: 'D',
    formulaContext: 'τbd(deformed) = 1.60 · τbd(plain)',
    explanation: 'IS 456:2000 Clause 26.2.1.1 states: For deformed bars conforming to IS 1786, the design bond stress values for plain bars shall be increased by 60%.',
    referenceSource: 'IS 456:2000 Cl. 26.2.1.1',
    difficulty: 'EASY',
    pyqYear: 2023,
    pyqExam: 'Testbook Model / APSC AE Civil 2023'
  },
  {
    id: 'ce-q-014',
    questionNumber: 14,
    examId: 'apsc-ae-civil',
    subject: 'Prestressed Concrete',
    topic: 'Prestressing Losses',
    subtopic: 'Losses in Pre-tensioned vs Post-tensioned',
    stem: 'Which of the following losses of prestress does NOT occur in pre-tensioned concrete members?',
    options: [
      { id: 'A', text: 'Elastic shortening of concrete' },
      { id: 'B', text: 'Shrinkage of concrete' },
      { id: 'C', text: 'Friction between tendon and duct' },
      { id: 'D', text: 'Creep of concrete' }
    ],
    correctOption: 'C',
    formulaContext: 'Friction loss occurs only in curved post-tensioned ducts (IS 1343)',
    explanation: 'In pre-tensioning, tendons are stressed before concrete is poured and there are no ducts or curved profiles involving duct friction. Hence friction and wobble losses occur strictly in post-tensioned members.',
    referenceSource: 'IS 1343:2012 Prestressed Concrete Code',
    difficulty: 'MEDIUM',
    pyqYear: 2024,
    pyqExam: 'Testbook Model / APSC AE Civil 2024'
  },
  {
    id: 'ce-q-015',
    questionNumber: 15,
    examId: 'apsc-ae-civil',
    subject: 'Reinforced Concrete Structures',
    topic: 'Torsion Design',
    subtopic: 'Equivalent Bending Moment',
    stem: 'As per IS 456:2000, under combined bending moment (M) and twisting moment (T), the equivalent bending moment (Me1) is expressed as:',
    options: [
      { id: 'A', text: 'Me1 = M + T · (1 + D/b) / 1.7' },
      { id: 'B', text: 'Me1 = M + T · (1 + b/D)' },
      { id: 'C', text: 'Me1 = M + (T / 1.7)' },
      { id: 'D', text: 'Me1 = √(M² + T²)' }
    ],
    correctOption: 'A',
    formulaContext: 'Me1 = M + Mt = M + T · (1 + D/b) / 1.7',
    explanation: 'Clause 41.4.2 of IS 456 specifies that longitudinal reinforcement in members subjected to combined bending and torsion shall be designed for an equivalent bending moment Me1 = M + Mt, where Mt = T · (1 + D/b) / 1.7.',
    referenceSource: 'IS 456:2000 Cl. 41.4.2',
    difficulty: 'HARD',
    pyqYear: 2022,
    pyqExam: 'Testbook Model / APSC AE Civil 2022'
  }
];

// Add questions 16 to 100 dynamically or with comprehensive verified data
console.log('Base questions count:', civilQuestions.length);
