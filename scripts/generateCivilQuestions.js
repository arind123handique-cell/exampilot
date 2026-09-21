const fs = require('fs');
const path = require('path');

const questions = [];

function addQ(q) {
  questions.push({
    ...q,
    id: `ce-q-${String(q.questionNumber).padStart(3, '0')}`,
    examId: 'apsc-ae-civil',
    pyqExam: q.pyqExam || `Testbook Model / APSC AE Civil ${q.pyqYear || 2024}`
  });
}

// 1 - 15: RCC & Prestressed
addQ({
  questionNumber: 1,
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
  pyqYear: 2024
});

addQ({
  questionNumber: 2,
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
  pyqYear: 2023
});

addQ({
  questionNumber: 3,
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
  pyqYear: 2022
});

addQ({
  questionNumber: 4,
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
  pyqYear: 2024
});

addQ({
  questionNumber: 5,
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
  pyqYear: 2023
});

addQ({
  questionNumber: 6,
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
  pyqYear: 2021
});

addQ({
  questionNumber: 7,
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
  pyqYear: 2024
});

addQ({
  questionNumber: 8,
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
  pyqYear: 2022
});

addQ({
  questionNumber: 9,
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
  pyqYear: 2024
});

addQ({
  questionNumber: 10,
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
  pyqYear: 2023
});

addQ({
  questionNumber: 11,
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
  pyqYear: 2021
});

addQ({
  questionNumber: 12,
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
  pyqYear: 2024
});

addQ({
  questionNumber: 13,
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
  pyqYear: 2023
});

addQ({
  questionNumber: 14,
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
  pyqYear: 2024
});

addQ({
  questionNumber: 15,
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
  pyqYear: 2022
});

// Structural Analysis (16 - 27)
addQ({
  questionNumber: 16,
  subject: 'Structural Analysis',
  topic: 'Determinate & Indeterminate Structures',
  subtopic: 'Static Indeterminacy of Trusses',
  stem: 'A 2D pin-jointed plane truss has m members and j joints. The degree of external and internal static indeterminacy (Ds) is given by:',
  options: [
    { id: 'A', text: 'Ds = m - (2j - 3)' },
    { id: 'B', text: 'Ds = m + r - 2j' },
    { id: 'C', text: 'Ds = 2j - m - 3' },
    { id: 'D', text: 'Ds = m + 3 - 2j' }
  ],
  correctOption: 'B',
  formulaContext: 'Ds = (m + r) - 2j',
  explanation: 'For a 2D pin-jointed truss, total unknowns are m member forces plus r support reactions. Total equations of equilibrium are 2 per joint (2j). Hence static indeterminacy Ds = m + r - 2j.',
  referenceSource: 'Structural Analysis by Hibbeler',
  difficulty: 'EASY',
  pyqYear: 2024
});

addQ({
  questionNumber: 17,
  subject: 'Structural Analysis',
  topic: 'Kinematic Indeterminacy',
  subtopic: 'Degrees of Freedom in Fixed Beam',
  stem: 'What is the kinematic indeterminacy (degrees of freedom) of a fixed beam AB of span L, neglecting axial deformations?',
  options: [
    { id: 'A', text: '0' },
    { id: 'B', text: '1' },
    { id: 'C', text: '2' },
    { id: 'D', text: '3' }
  ],
  correctOption: 'A',
  formulaContext: 'Dk = 0 for fixed beam with axial deformation neglected',
  explanation: 'Both ends A and B are fixed supports, where translations (Δx = 0, Δy = 0) and rotation (θ = 0) are completely restrained. Neglecting axial deformations, all joint displacements are zero, so Dk = 0.',
  referenceSource: 'Theory of Structures by Ramamrutham',
  difficulty: 'EASY',
  pyqYear: 2023
});

addQ({
  questionNumber: 18,
  subject: 'Structural Analysis',
  topic: 'Moment Distribution Method',
  subtopic: 'Carry-Over Factor',
  stem: 'In Moment Distribution Method, the carry-over factor to a far end that is fixed is:',
  options: [
    { id: 'A', text: '0' },
    { id: 'B', text: '0.50' },
    { id: 'C', text: '0.75' },
    { id: 'D', text: '1.00' }
  ],
  correctOption: 'B',
  formulaContext: 'Carry Over Factor (COF) = +0.5 to a fixed far end; 0 to a hinged end',
  explanation: 'When a moment M is applied at the near end of a prismatic member with the far end fixed, a moment of M/2 with the same sign is induced at the fixed far end. Hence the carry-over factor is +1/2 or 0.50.',
  referenceSource: 'Structural Analysis by C.K. Wang',
  difficulty: 'EASY',
  pyqYear: 2022
});

addQ({
  questionNumber: 19,
  subject: 'Structural Analysis',
  topic: 'Slope Deflection Method',
  subtopic: 'Standard Equations',
  stem: 'In a prismatic beam AB with span L, flexural rigidity EI, and end rotations θA and θB with sinking Δ, the slope deflection equation for end moment MAB is:',
  options: [
    { id: 'A', text: 'MAB = M_F_AB + (2EI/L) · [2θA + θB - 3Δ/L]' },
    { id: 'B', text: 'MAB = M_F_AB + (4EI/L) · [θA + θB - Δ/L]' },
    { id: 'C', text: 'MAB = M_F_AB + (2EI/L) · [θA + 2θB - 3Δ/L]' },
    { id: 'D', text: 'MAB = M_F_AB + (3EI/L) · [θA - Δ/L]' }
  ],
  correctOption: 'A',
  formulaContext: 'MAB = M_F_AB + (2EI/L) · [2θA + θB - 3Δ/L]',
  explanation: 'The classic slope-deflection equation derives directly from superposition of fixed-end moment, near-end rotation (4EI/L · θA), far-end rotation (2EI/L · θB), and relative chord rotation (-6EI/L² · Δ). Factoring out 2EI/L yields MAB = M_F_AB + (2EI/L)[2θA + θB - 3Δ/L].',
  referenceSource: 'Elementary Structural Analysis by Norris & Wilbur',
  difficulty: 'MEDIUM',
  pyqYear: 2024
});

addQ({
  questionNumber: 20,
  subject: 'Structural Analysis',
  topic: 'Influence Line Diagrams',
  subtopic: 'Müller-Breslau Principle',
  stem: 'Müller-Breslau’s Principle for constructing influence lines is applicable to:',
  options: [
    { id: 'A', text: 'Statically determinate structures only' },
    { id: 'B', text: 'Statically indeterminate structures only' },
    { id: 'C', text: 'Both statically determinate and indeterminate structures' },
    { id: 'D', text: 'Pin-jointed trusses only' }
  ],
  correctOption: 'C',
  formulaContext: 'Based on Betti’s reciprocal theorem; ILD shape = deflected shape upon unit displacement release',
  explanation: 'Müller-Breslau principle is rooted in Maxwell-Betti reciprocal theorem and applies to all linear elastic structures, whether determinate or indeterminate. For determinate beams the ILD consists of straight line segments; for indeterminate beams it is curved.',
  referenceSource: 'Structural Analysis by Devdas Menon',
  difficulty: 'EASY',
  pyqYear: 2023
});

addQ({
  questionNumber: 21,
  subject: 'Structural Analysis',
  topic: 'Energy Theorems',
  subtopic: 'Castigliano’s Second Theorem',
  stem: 'Castigliano’s second theorem states that the partial derivative of total strain energy (U) with respect to an applied load (Pi) yields:',
  options: [
    { id: 'A', text: 'The force in member i' },
    { id: 'B', text: 'The deflection (Δi) at the point and in the direction of load Pi' },
    { id: 'C', text: 'The slope at the point of load Pi' },
    { id: 'D', text: 'The reaction at the nearest support' }
  ],
  correctOption: 'B',
  formulaContext: '∂U / ∂Pi = Δi',
  explanation: 'Castigliano’s theorem of least work / deflection states that in any linear elastic structure, ∂U/∂Pi = Δi, giving the displacement under load Pi along its line of action.',
  referenceSource: 'Strength of Materials by Timoshenko',
  difficulty: 'EASY',
  pyqYear: 2021
});

addQ({
  questionNumber: 22,
  subject: 'Structural Analysis',
  topic: 'Energy Methods',
  subtopic: 'Unit Load Method for Deflection',
  stem: 'In the unit load method for determining beam deflection, the expression for deflection Δ at any point is:',
  options: [
    { id: 'A', text: 'Δ = ∫ (M · m / EI) dx' },
    { id: 'B', text: 'Δ = ∫ (M² / 2EI) dx' },
    { id: 'C', text: 'Δ = ∫ (m² / EI) dx' },
    { id: 'D', text: 'Δ = ∫ (M · m / 2EI) dx' }
  ],
  correctOption: 'A',
  formulaContext: 'Δ = ∫ (M · m / EI) dx',
  explanation: 'Based on virtual work principle: 1 · Δ = ∫ (m · ε) dx = ∫ m · (M / EI) dx = ∫ (M · m / EI) dx, where M is bending moment from actual loads and m is bending moment due to a fictitious unit load applied at the desired deflection point.',
  referenceSource: 'Structural Analysis by Hibbeler',
  difficulty: 'MEDIUM',
  pyqYear: 2024
});

addQ({
  questionNumber: 23,
  subject: 'Structural Analysis',
  topic: 'Arches',
  subtopic: 'Three-Hinged Parabolic Arch',
  stem: 'A three-hinged parabolic arch of span L and central rise h is subjected to a uniformly distributed load w over its entire span. The horizontal thrust (H) at the supports is:',
  options: [
    { id: 'A', text: 'w · L² / (8 · h)' },
    { id: 'B', text: 'w · L² / (16 · h)' },
    { id: 'C', text: 'w · L / (8 · h)' },
    { id: 'D', text: 'w · L² / (4 · h)' }
  ],
  correctOption: 'A',
  formulaContext: 'H = w · L² / (8 · h)',
  explanation: 'Taking moments about the crown hinge C: Mc = (wL/2) · (L/2) - (w · (L/2)² / 2) - H · h = 0 => H · h = wL²/8 => H = wL² / (8h). For a parabolic arch under full UDL, bending moment is identically zero everywhere!',
  referenceSource: 'Theory of Structures by Punmia',
  difficulty: 'EASY',
  pyqYear: 2023
});

addQ({
  questionNumber: 24,
  subject: 'Structural Analysis',
  topic: 'Arches',
  subtopic: 'Bending Moment in Parabolic Arch',
  stem: 'For a three-hinged parabolic arch carrying a uniformly distributed load over its entire span, the bending moment at any section of the arch is:',
  options: [
    { id: 'A', text: 'Zero everywhere' },
    { id: 'B', text: 'Maximum at the quarter span' },
    { id: 'C', text: 'Maximum at the crown' },
    { id: 'D', text: 'Equal to wL²/8' }
  ],
  correctOption: 'A',
  formulaContext: 'Mx = μx - H · y = (wLx/2 - wx²/2) - (wL²/8h) · (4hx(L-x)/L²) = 0',
  explanation: 'The parabolic profile y = 4hx(L-x)/L² exactly matches the bending moment shape of a simple beam under UDL. Hence the thrust moment (H · y) exactly cancels the beam moment (μx) at every cross section, resulting in zero bending moment throughout.',
  referenceSource: 'Structural Analysis by Negi',
  difficulty: 'EASY',
  pyqYear: 2022
});

addQ({
  questionNumber: 25,
  subject: 'Structural Analysis',
  topic: 'Cables and Suspension Bridges',
  subtopic: 'Maximum Tension in Cable',
  stem: 'A flexible cable of span L and central sag h carries a uniformly distributed load w per unit horizontal length. The maximum tension in the cable occurs at:',
  options: [
    { id: 'A', text: 'The mid-span (lowest point)' },
    { id: 'B', text: 'The supports' },
    { id: 'C', text: 'Quarter-span points' },
    { id: 'D', text: 'Uniform throughout the length' }
  ],
  correctOption: 'B',
  formulaContext: 'Tmax = √(H² + V²) at support',
  explanation: 'Cable tension at any point is T = √(H² + Vy²). Since horizontal thrust H is constant throughout the cable and vertical shear Vy is maximum at the supports (V = wL/2), the resultant cable tension Tmax occurs at the supports.',
  referenceSource: 'Structural Analysis by Bhavikatti',
  difficulty: 'EASY',
  pyqYear: 2024
});

addQ({
  questionNumber: 26,
  subject: 'Structural Analysis',
  topic: 'Portal Frames',
  subtopic: 'Sway Analysis',
  stem: 'In portal frames, side sway will NOT occur if which of the following conditions is satisfied?',
  options: [
    { id: 'A', text: 'The frame is symmetrical in geometry, member properties and loading' },
    { id: 'B', text: 'The frame is subjected to unsymmetrical lateral load' },
    { id: 'C', text: 'Columns have different cross sections and unequal lengths' },
    { id: 'D', text: 'Supports are at different levels' }
  ],
  correctOption: 'A',
  formulaContext: 'No sway condition: Symmetry in frame geometry + stiffness + loading',
  explanation: 'Sway is induced by asymmetry in geometry, unequal column stiffness, uneven support levels, or unsymmetrical lateral/gravity loading. If geometry, stiffness, support levels, and loading are all perfectly symmetrical, no sway occurs.',
  referenceSource: 'Indeterminate Structural Analysis by Menon',
  difficulty: 'EASY',
  pyqYear: 2021
});

addQ({
  questionNumber: 27,
  subject: 'Structural Analysis',
  topic: 'Plastic Analysis',
  subtopic: 'Shape Factor of Rectangular Section',
  stem: 'The shape factor (S = Zp / Ze) for a rectangular cross-section of width b and depth d is:',
  options: [
    { id: 'A', text: '1.0' },
    { id: 'B', text: '1.18' },
    { id: 'C', text: '1.50' },
    { id: 'D', text: '1.70' }
  ],
  correctOption: 'C',
  formulaContext: 'Shape Factor S = Zp / Ze = (b d² / 4) / (b d² / 6) = 1.50',
  explanation: 'For a rectangular beam: Plastic section modulus Zp = (b · d/2) · (d/4) · 2 = b d² / 4. Elastic section modulus Ze = b d² / 6. Therefore, shape factor S = Zp / Ze = (b d² / 4) / (b d² / 6) = 1.50. For circular section S = 1.70, diamond S = 2.0, I-section S = 1.12 to 1.18.',
  referenceSource: 'Plastic Analysis of Structures by Baker',
  difficulty: 'EASY',
  pyqYear: 2024
});

console.log('Processed questions up to 27');
fs.writeFileSync('temp_status.json', JSON.stringify({ count: questions.length }));
