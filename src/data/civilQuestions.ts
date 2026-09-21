import { MCQQuestion } from '../types';

/**
 * Complete Bank of 100 AI-Calibrated Questions for Civil Engineering (Paper II)
 * Modeled after Testbook, State PSC (APSC AE), GATE & ESE Standards.
 */
export const CIVIL_ENGINEERING_QUESTIONS: MCQQuestion[] = [
  {
    "id": "ce-q-001",
    "questionNumber": 1,
    "examId": "apsc-ae-civil",
    "subject": "Reinforced Concrete Structures",
    "topic": "Limit State Design — Flexure",
    "subtopic": "Limiting Neutral Axis Depth",
    "stem": "As per IS 456:2000, what is the limiting depth of neutral axis (xu,max / d) for Fe 500 grade steel in limit state design of flexural members?",
    "options": [
      {
        "id": "A",
        "text": "0.53"
      },
      {
        "id": "B",
        "text": "0.48"
      },
      {
        "id": "C",
        "text": "0.46"
      },
      {
        "id": "D",
        "text": "0.44"
      }
    ],
    "correctOption": "C",
    "formulaContext": "xu,max / d = 0.0035 / (0.0055 + 0.87 * fy / Es)",
    "explanation": "According to IS 456:2000 Clause 38.1 Note, linear strain compatibility gives xu,max/d = 0.53 for Fe 250, 0.48 for Fe 415, 0.46 for Fe 500, and 0.44 for Fe 550.",
    "referenceSource": "IS 456:2000, Clause 38.1",
    "difficulty": "EASY",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-002",
    "questionNumber": 2,
    "examId": "apsc-ae-civil",
    "subject": "Reinforced Concrete Structures",
    "topic": "Shear and Bond",
    "subtopic": "Development Length",
    "stem": "The development length (Ld) of a tension reinforcing bar of nominal diameter φ is given by IS 456:2000 as:",
    "options": [
      {
        "id": "A",
        "text": "Ld = (φ · σs) / (2 · τbd)"
      },
      {
        "id": "B",
        "text": "Ld = (φ · σs) / (4 · τbd)"
      },
      {
        "id": "C",
        "text": "Ld = (φ · σs) / (8 · τbd)"
      },
      {
        "id": "D",
        "text": "Ld = (2 · φ · σs) / (3 · τbd)"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Ld = (φ · σs) / (4 · τbd)",
    "explanation": "Per IS 456:2000 Cl. 26.2.1, equating tensile bar force to bond resistance yields Ld = (φ · σs) / (4 · τbd). For deformed bars (HYSD), τbd is increased by 60%. For bars in compression, τbd is increased by 25%.",
    "referenceSource": "IS 456:2000 Cl. 26.2.1",
    "difficulty": "EASY",
    "pyqYear": 2023,
    "pyqExam": "Testbook Model / APSC AE Civil 2023"
  },
  {
    "id": "ce-q-003",
    "questionNumber": 3,
    "examId": "apsc-ae-civil",
    "subject": "Reinforced Concrete Structures",
    "topic": "Beams & Slabs",
    "subtopic": "Minimum Tensile Reinforcement",
    "stem": "As per IS 456:2000, the minimum area of tension reinforcement in a rectangular beam shall not be less than:",
    "options": [
      {
        "id": "A",
        "text": "As / (b · d) = 0.85 / fy"
      },
      {
        "id": "B",
        "text": "As / (b · d) = 0.40 / fy"
      },
      {
        "id": "C",
        "text": "As / (b · D) = 0.12%"
      },
      {
        "id": "D",
        "text": "As / (b · d) = 0.04 · b · d"
      }
    ],
    "correctOption": "A",
    "formulaContext": "As,min / (b · d) = 0.85 / fy",
    "explanation": "IS 456:2000 Clause 26.5.1.1 specifies that the minimum area of tension reinforcement in beams is As,min = (0.85 · b · d) / fy, where b is width of beam, d is effective depth, and fy is characteristic steel strength.",
    "referenceSource": "IS 456:2000 Cl. 26.5.1.1",
    "difficulty": "EASY",
    "pyqYear": 2022,
    "pyqExam": "Testbook Model / APSC AE Civil 2022"
  },
  {
    "id": "ce-q-004",
    "questionNumber": 4,
    "examId": "apsc-ae-civil",
    "subject": "Reinforced Concrete Structures",
    "topic": "Shear Design",
    "subtopic": "Critical Section for Shear",
    "stem": "In a simply supported RCC beam resting on masonry support subjected to uniformly distributed load, the critical section for checking nominal shear stress (τv) is located at a distance of:",
    "options": [
      {
        "id": "A",
        "text": "d/2 from the face of support"
      },
      {
        "id": "B",
        "text": "d from the face of support"
      },
      {
        "id": "C",
        "text": "At the center of support"
      },
      {
        "id": "D",
        "text": "2d from the face of support"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Critical section distance = effective depth (d) from support face",
    "explanation": "According to IS 456:2000 Clause 31.6.2 and 22.6.2, when the reaction introduces compression into the end regions of the member, the critical section for shear is taken at a distance d (effective depth) from the face of the support.",
    "referenceSource": "IS 456:2000 Cl. 22.6.2 & 31.6.2",
    "difficulty": "MEDIUM",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-005",
    "questionNumber": 5,
    "examId": "apsc-ae-civil",
    "subject": "Reinforced Concrete Structures",
    "topic": "Shear Reinforcement",
    "subtopic": "Maximum Stirrup Spacing",
    "stem": "As per IS 456:2000, the maximum spacing of vertical shear stirrups along the axis of the beam shall not exceed:",
    "options": [
      {
        "id": "A",
        "text": "0.75 d or 300 mm, whichever is less"
      },
      {
        "id": "B",
        "text": "d or 300 mm, whichever is less"
      },
      {
        "id": "C",
        "text": "0.75 d or 450 mm, whichever is less"
      },
      {
        "id": "D",
        "text": "0.50 d or 300 mm, whichever is less"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Spacing Sv ≤ min(0.75 d, 300 mm)",
    "explanation": "Clause 26.5.1.5 of IS 456:2000 states that the spacing of stirrups measured along the member axis shall not exceed 0.75 d for vertical stirrups and d for inclined stirrups at 45°, but in no case shall it exceed 300 mm.",
    "referenceSource": "IS 456:2000 Cl. 26.5.1.5",
    "difficulty": "EASY",
    "pyqYear": 2023,
    "pyqExam": "Testbook Model / APSC AE Civil 2023"
  },
  {
    "id": "ce-q-006",
    "questionNumber": 6,
    "examId": "apsc-ae-civil",
    "subject": "Reinforced Concrete Structures",
    "topic": "Slab Design",
    "subtopic": "Maximum Bar Diameter in Slabs",
    "stem": "The diameter of reinforcing bars in a slab shall not exceed what fraction of the total thickness of the slab as per IS 456:2000?",
    "options": [
      {
        "id": "A",
        "text": "One-fourth (1/4) of total thickness"
      },
      {
        "id": "B",
        "text": "One-eighth (1/8) of total thickness"
      },
      {
        "id": "C",
        "text": "One-tenth (1/10) of total thickness"
      },
      {
        "id": "D",
        "text": "One-sixth (1/6) of total thickness"
      }
    ],
    "correctOption": "B",
    "formulaContext": "φ_bar ≤ D_slab / 8",
    "explanation": "According to IS 456:2000 Clause 26.5.2.2, the diameter of reinforcing bars shall not exceed one-eighth of the total thickness of the slab.",
    "referenceSource": "IS 456:2000 Cl. 26.5.2.2",
    "difficulty": "EASY",
    "pyqYear": 2021,
    "pyqExam": "Testbook Model / APSC AE Civil 2021"
  },
  {
    "id": "ce-q-007",
    "questionNumber": 7,
    "examId": "apsc-ae-civil",
    "subject": "Reinforced Concrete Structures",
    "topic": "Durability & Concrete Mix",
    "subtopic": "Minimum Grade for Severe Exposure",
    "stem": "As per IS 456:2000 Table 5, what is the minimum grade of concrete recommended for reinforced concrete (RCC) exposed to 'Severe' environmental conditions?",
    "options": [
      {
        "id": "A",
        "text": "M 20"
      },
      {
        "id": "B",
        "text": "M 25"
      },
      {
        "id": "C",
        "text": "M 30"
      },
      {
        "id": "D",
        "text": "M 35"
      }
    ],
    "correctOption": "C",
    "formulaContext": "Severe exposure min grade = M 30",
    "explanation": "Per IS 456 Table 5, minimum grades for RCC under environmental exposure conditions are: Mild (M20), Moderate (M25), Severe (M30), Very Severe (M35), and Extreme (M40).",
    "referenceSource": "IS 456:2000 Table 5",
    "difficulty": "MEDIUM",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-008",
    "questionNumber": 8,
    "examId": "apsc-ae-civil",
    "subject": "Reinforced Concrete Structures",
    "topic": "Limit State Philosophy",
    "subtopic": "Partial Safety Factors",
    "stem": "In the limit state of collapse, the partial safety factors for concrete (γc) and steel (γs) are taken as:",
    "options": [
      {
        "id": "A",
        "text": "1.15 and 1.50 respectively"
      },
      {
        "id": "B",
        "text": "1.50 and 1.15 respectively"
      },
      {
        "id": "C",
        "text": "1.50 and 1.00 respectively"
      },
      {
        "id": "D",
        "text": "1.20 and 1.15 respectively"
      }
    ],
    "correctOption": "B",
    "formulaContext": "γc = 1.50, γs = 1.15 (Collapse)",
    "explanation": "Concrete has higher variability in material preparation and compaction on site compared to factory-controlled steel. Hence IS 456 adopts γc = 1.50 and γs = 1.15 in Limit State of Collapse (Clause 36.4.2).",
    "referenceSource": "IS 456:2000 Cl. 36.4.2",
    "difficulty": "EASY",
    "pyqYear": 2022,
    "pyqExam": "Testbook Model / APSC AE Civil 2022"
  },
  {
    "id": "ce-q-009",
    "questionNumber": 9,
    "examId": "apsc-ae-civil",
    "subject": "Reinforced Concrete Structures",
    "topic": "Flexural Failure Modes",
    "subtopic": "Under-reinforced Beam Characteristics",
    "stem": "An under-reinforced RCC beam section is preferred in structural design because:",
    "options": [
      {
        "id": "A",
        "text": "It undergoes sudden, brittle failure without prior warning"
      },
      {
        "id": "B",
        "text": "Steel yields before concrete crushes, giving ample ductile deflection and crack warning"
      },
      {
        "id": "C",
        "text": "It requires maximum amount of steel and minimizes beam depth"
      },
      {
        "id": "D",
        "text": "Neutral axis depth exceeds the limiting neutral axis depth"
      }
    ],
    "correctOption": "B",
    "formulaContext": "xu < xu,max; εs ≥ 0.87 fy / Es + 0.002 before concrete strain reaches 0.0035",
    "explanation": "Under-reinforced sections ensure that the tensile steel reaches its yield point long before concrete reaches its ultimate crushing strain (0.0035). This produces large visible cracks and deflections, ensuring ductile failure and safety.",
    "referenceSource": "IS 456:2000 Cl. 38.1",
    "difficulty": "EASY",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-010",
    "questionNumber": 10,
    "examId": "apsc-ae-civil",
    "subject": "Reinforced Concrete Structures",
    "topic": "Columns",
    "subtopic": "Minimum Eccentricity Check",
    "stem": "As per IS 456:2000, all columns shall be designed for minimum eccentricity emin given by:",
    "options": [
      {
        "id": "A",
        "text": "emin = L/500 + D/30, subject to a minimum of 20 mm"
      },
      {
        "id": "B",
        "text": "emin = L/300 + D/20, subject to a minimum of 25 mm"
      },
      {
        "id": "C",
        "text": "emin = L/500 + D/50, subject to a minimum of 15 mm"
      },
      {
        "id": "D",
        "text": "emin = L/250 + D/30, subject to a minimum of 20 mm"
      }
    ],
    "correctOption": "A",
    "formulaContext": "emin = max(L/500 + D/30, 20 mm)",
    "explanation": "IS 456:2000 Clause 25.4 specifies that all columns shall be designed for an unsupported length L and lateral dimension D with minimum eccentricity emin = unsupported length/500 + lateral dimension/30, subject to a minimum of 20 mm.",
    "referenceSource": "IS 456:2000 Cl. 25.4",
    "difficulty": "MEDIUM",
    "pyqYear": 2023,
    "pyqExam": "Testbook Model / APSC AE Civil 2023"
  },
  {
    "id": "ce-q-011",
    "questionNumber": 11,
    "examId": "apsc-ae-civil",
    "subject": "Reinforced Concrete Structures",
    "topic": "Columns",
    "subtopic": "Short vs Slender Column Criteria",
    "stem": "A reinforced concrete column is classified as a 'Short Column' if the ratio of effective length (Leff) to its least lateral dimension (D or b) is:",
    "options": [
      {
        "id": "A",
        "text": "Greater than 12"
      },
      {
        "id": "B",
        "text": "Less than 12"
      },
      {
        "id": "C",
        "text": "Between 12 and 18"
      },
      {
        "id": "D",
        "text": "Less than 3"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Slenderness ratio λ = Leff / b < 12 => Short Column",
    "explanation": "Clause 25.1.2 of IS 456 defines a short column as one where both effective length ratios (Lex / D and Ley / b) are less than 12. If either ratio is 12 or more, it is considered a slender (long) column.",
    "referenceSource": "IS 456:2000 Cl. 25.1.2",
    "difficulty": "EASY",
    "pyqYear": 2021,
    "pyqExam": "Testbook Model / APSC AE Civil 2021"
  },
  {
    "id": "ce-q-012",
    "questionNumber": 12,
    "examId": "apsc-ae-civil",
    "subject": "Reinforced Concrete Structures",
    "topic": "Detailing of Reinforcement",
    "subtopic": "Nominal Cover for Footing",
    "stem": "As per IS 456:2000, what is the minimum nominal clear cover required for footing reinforcement cast directly against earth?",
    "options": [
      {
        "id": "A",
        "text": "25 mm"
      },
      {
        "id": "B",
        "text": "40 mm"
      },
      {
        "id": "C",
        "text": "50 mm"
      },
      {
        "id": "D",
        "text": "75 mm"
      }
    ],
    "correctOption": "C",
    "formulaContext": "Footing nominal cover = 50 mm",
    "explanation": "Clause 26.4.2.2 and Table 16 specify that the minimum nominal cover for footings is 50 mm. When concrete is placed directly against untreated soil without blinding layer, cover is commonly increased to 75 mm.",
    "referenceSource": "IS 456:2000 Cl. 26.4.2.2",
    "difficulty": "EASY",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-013",
    "questionNumber": 13,
    "examId": "apsc-ae-civil",
    "subject": "Reinforced Concrete Structures",
    "topic": "Bond & Anchorage",
    "subtopic": "Deformed Bars Bond Stress Increment",
    "stem": "For deformed bars conforming to IS 1786 (HYSD bars), the design bond stress values given in IS 456:2000 for plain bars in tension shall be increased by:",
    "options": [
      {
        "id": "A",
        "text": "25%"
      },
      {
        "id": "B",
        "text": "40%"
      },
      {
        "id": "C",
        "text": "50%"
      },
      {
        "id": "D",
        "text": "60%"
      }
    ],
    "correctOption": "D",
    "formulaContext": "τbd(deformed) = 1.60 · τbd(plain)",
    "explanation": "IS 456:2000 Clause 26.2.1.1 states: For deformed bars conforming to IS 1786, the design bond stress values for plain bars shall be increased by 60%.",
    "referenceSource": "IS 456:2000 Cl. 26.2.1.1",
    "difficulty": "EASY",
    "pyqYear": 2023,
    "pyqExam": "Testbook Model / APSC AE Civil 2023"
  },
  {
    "id": "ce-q-014",
    "questionNumber": 14,
    "examId": "apsc-ae-civil",
    "subject": "Prestressed Concrete",
    "topic": "Prestressing Losses",
    "subtopic": "Losses in Pre-tensioned vs Post-tensioned",
    "stem": "Which of the following losses of prestress does NOT occur in pre-tensioned concrete members?",
    "options": [
      {
        "id": "A",
        "text": "Elastic shortening of concrete"
      },
      {
        "id": "B",
        "text": "Shrinkage of concrete"
      },
      {
        "id": "C",
        "text": "Friction between tendon and duct"
      },
      {
        "id": "D",
        "text": "Creep of concrete"
      }
    ],
    "correctOption": "C",
    "formulaContext": "Friction loss occurs only in curved post-tensioned ducts (IS 1343)",
    "explanation": "In pre-tensioning, tendons are stressed before concrete is poured and there are no ducts or curved profiles involving duct friction. Hence friction and wobble losses occur strictly in post-tensioned members.",
    "referenceSource": "IS 1343:2012 Prestressed Concrete Code",
    "difficulty": "MEDIUM",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-015",
    "questionNumber": 15,
    "examId": "apsc-ae-civil",
    "subject": "Reinforced Concrete Structures",
    "topic": "Torsion Design",
    "subtopic": "Equivalent Bending Moment",
    "stem": "As per IS 456:2000, under combined bending moment (M) and twisting moment (T), the equivalent bending moment (Me1) is expressed as:",
    "options": [
      {
        "id": "A",
        "text": "Me1 = M + T · (1 + D/b) / 1.7"
      },
      {
        "id": "B",
        "text": "Me1 = M + T · (1 + b/D)"
      },
      {
        "id": "C",
        "text": "Me1 = M + (T / 1.7)"
      },
      {
        "id": "D",
        "text": "Me1 = √(M² + T²)"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Me1 = M + Mt = M + T · (1 + D/b) / 1.7",
    "explanation": "Clause 41.4.2 of IS 456 specifies that longitudinal reinforcement in members subjected to combined bending and torsion shall be designed for an equivalent bending moment Me1 = M + Mt, where Mt = T · (1 + D/b) / 1.7.",
    "referenceSource": "IS 456:2000 Cl. 41.4.2",
    "difficulty": "HARD",
    "pyqYear": 2022,
    "pyqExam": "Testbook Model / APSC AE Civil 2022"
  },
  {
    "id": "ce-q-016",
    "questionNumber": 16,
    "examId": "apsc-ae-civil",
    "subject": "Structural Analysis",
    "topic": "Determinate & Indeterminate Structures",
    "subtopic": "Static Indeterminacy of Trusses",
    "stem": "A 2D pin-jointed plane truss has m members, r external reaction components, and j joints. The degree of static indeterminacy (Ds) is given by:",
    "options": [
      {
        "id": "A",
        "text": "Ds = m - (2j - 3)"
      },
      {
        "id": "B",
        "text": "Ds = m + r - 2j"
      },
      {
        "id": "C",
        "text": "Ds = 2j - m - 3"
      },
      {
        "id": "D",
        "text": "Ds = m + 3 - 2j"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Ds = (m + r) - 2j",
    "explanation": "For a 2D pin-jointed truss, total unknowns are m member forces plus r support reactions. Total equations of equilibrium are 2 per joint (2j). Hence static indeterminacy Ds = m + r - 2j.",
    "referenceSource": "Structural Analysis by Hibbeler",
    "difficulty": "EASY",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-017",
    "questionNumber": 17,
    "examId": "apsc-ae-civil",
    "subject": "Structural Analysis",
    "topic": "Kinematic Indeterminacy",
    "subtopic": "Degrees of Freedom in Fixed Beam",
    "stem": "What is the kinematic indeterminacy (degrees of freedom) of a fixed beam AB of span L, neglecting axial deformations?",
    "options": [
      {
        "id": "A",
        "text": "0"
      },
      {
        "id": "B",
        "text": "1"
      },
      {
        "id": "C",
        "text": "2"
      },
      {
        "id": "D",
        "text": "3"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Dk = 0 for fixed beam with axial deformation neglected",
    "explanation": "Both ends A and B are fixed supports, where translations (Δx = 0, Δy = 0) and rotation (θ = 0) are completely restrained. Neglecting axial deformations, all joint displacements are zero, so Dk = 0.",
    "referenceSource": "Theory of Structures by Ramamrutham",
    "difficulty": "EASY",
    "pyqYear": 2023,
    "pyqExam": "Testbook Model / APSC AE Civil 2023"
  },
  {
    "id": "ce-q-018",
    "questionNumber": 18,
    "examId": "apsc-ae-civil",
    "subject": "Structural Analysis",
    "topic": "Moment Distribution Method",
    "subtopic": "Carry-Over Factor",
    "stem": "In Moment Distribution Method, the carry-over factor to a far end that is fixed is:",
    "options": [
      {
        "id": "A",
        "text": "0"
      },
      {
        "id": "B",
        "text": "0.50"
      },
      {
        "id": "C",
        "text": "0.75"
      },
      {
        "id": "D",
        "text": "1.00"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Carry Over Factor (COF) = +0.5 to a fixed far end",
    "explanation": "When a moment M is applied at the near end of a prismatic member with the far end fixed, a moment of M/2 with the same sign is induced at the fixed far end. Hence the carry-over factor is +1/2 or 0.50.",
    "referenceSource": "Structural Analysis by C.K. Wang",
    "difficulty": "EASY",
    "pyqYear": 2022,
    "pyqExam": "Testbook Model / APSC AE Civil 2022"
  },
  {
    "id": "ce-q-019",
    "questionNumber": 19,
    "examId": "apsc-ae-civil",
    "subject": "Structural Analysis",
    "topic": "Slope Deflection Method",
    "subtopic": "Standard Equations",
    "stem": "In a prismatic beam AB with span L, flexural rigidity EI, and end rotations θA and θB with sinking Δ, the slope deflection equation for end moment MAB is:",
    "options": [
      {
        "id": "A",
        "text": "MAB = M_F_AB + (2EI/L) · [2θA + θB - 3Δ/L]"
      },
      {
        "id": "B",
        "text": "MAB = M_F_AB + (4EI/L) · [θA + θB - Δ/L]"
      },
      {
        "id": "C",
        "text": "MAB = M_F_AB + (2EI/L) · [θA + 2θB - 3Δ/L]"
      },
      {
        "id": "D",
        "text": "MAB = M_F_AB + (3EI/L) · [θA - Δ/L]"
      }
    ],
    "correctOption": "A",
    "formulaContext": "MAB = M_F_AB + (2EI/L) · [2θA + θB - 3Δ/L]",
    "explanation": "The classic slope-deflection equation derives directly from superposition of fixed-end moment, near-end rotation (4EI/L · θA), far-end rotation (2EI/L · θB), and relative chord rotation (-6EI/L² · Δ). Factoring out 2EI/L yields MAB = M_F_AB + (2EI/L)[2θA + θB - 3Δ/L].",
    "referenceSource": "Elementary Structural Analysis by Norris & Wilbur",
    "difficulty": "MEDIUM",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-020",
    "questionNumber": 20,
    "examId": "apsc-ae-civil",
    "subject": "Structural Analysis",
    "topic": "Influence Line Diagrams",
    "subtopic": "Müller-Breslau Principle",
    "stem": "Müller-Breslau’s Principle for constructing influence lines is applicable to:",
    "options": [
      {
        "id": "A",
        "text": "Statically determinate structures only"
      },
      {
        "id": "B",
        "text": "Statically indeterminate structures only"
      },
      {
        "id": "C",
        "text": "Both statically determinate and indeterminate structures"
      },
      {
        "id": "D",
        "text": "Pin-jointed trusses only"
      }
    ],
    "correctOption": "C",
    "formulaContext": "Based on Betti’s reciprocal theorem",
    "explanation": "Müller-Breslau principle is rooted in Maxwell-Betti reciprocal theorem and applies to all linear elastic structures, whether determinate or indeterminate. For determinate beams the ILD consists of straight line segments; for indeterminate beams it is curved.",
    "referenceSource": "Structural Analysis by Devdas Menon",
    "difficulty": "EASY",
    "pyqYear": 2023,
    "pyqExam": "Testbook Model / APSC AE Civil 2023"
  },
  {
    "id": "ce-q-021",
    "questionNumber": 21,
    "examId": "apsc-ae-civil",
    "subject": "Structural Analysis",
    "topic": "Energy Theorems",
    "subtopic": "Castigliano’s Second Theorem",
    "stem": "Castigliano’s second theorem states that the partial derivative of total strain energy (U) with respect to an applied load (Pi) yields:",
    "options": [
      {
        "id": "A",
        "text": "The force in member i"
      },
      {
        "id": "B",
        "text": "The deflection (Δi) at the point and in the direction of load Pi"
      },
      {
        "id": "C",
        "text": "The slope at the point of load Pi"
      },
      {
        "id": "D",
        "text": "The reaction at the nearest support"
      }
    ],
    "correctOption": "B",
    "formulaContext": "∂U / ∂Pi = Δi",
    "explanation": "Castigliano’s theorem of least work / deflection states that in any linear elastic structure, ∂U/∂Pi = Δi, giving the displacement under load Pi along its line of action.",
    "referenceSource": "Strength of Materials by Timoshenko",
    "difficulty": "EASY",
    "pyqYear": 2021,
    "pyqExam": "Testbook Model / APSC AE Civil 2021"
  },
  {
    "id": "ce-q-022",
    "questionNumber": 22,
    "examId": "apsc-ae-civil",
    "subject": "Structural Analysis",
    "topic": "Energy Methods",
    "subtopic": "Unit Load Method for Deflection",
    "stem": "In the unit load method for determining beam deflection, the expression for deflection Δ at any point is:",
    "options": [
      {
        "id": "A",
        "text": "Δ = ∫ (M · m / EI) dx"
      },
      {
        "id": "B",
        "text": "Δ = ∫ (M² / 2EI) dx"
      },
      {
        "id": "C",
        "text": "Δ = ∫ (m² / EI) dx"
      },
      {
        "id": "D",
        "text": "Δ = ∫ (M · m / 2EI) dx"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Δ = ∫ (M · m / EI) dx",
    "explanation": "Based on virtual work principle: 1 · Δ = ∫ (m · ε) dx = ∫ m · (M / EI) dx = ∫ (M · m / EI) dx, where M is bending moment from actual loads and m is bending moment due to a fictitious unit load applied at the desired deflection point.",
    "referenceSource": "Structural Analysis by Hibbeler",
    "difficulty": "MEDIUM",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-023",
    "questionNumber": 23,
    "examId": "apsc-ae-civil",
    "subject": "Structural Analysis",
    "topic": "Arches",
    "subtopic": "Three-Hinged Parabolic Arch",
    "stem": "A three-hinged parabolic arch of span L and central rise h is subjected to a uniformly distributed load w over its entire span. The horizontal thrust (H) at the supports is:",
    "options": [
      {
        "id": "A",
        "text": "w · L² / (8 · h)"
      },
      {
        "id": "B",
        "text": "w · L² / (16 · h)"
      },
      {
        "id": "C",
        "text": "w · L / (8 · h)"
      },
      {
        "id": "D",
        "text": "w · L² / (4 · h)"
      }
    ],
    "correctOption": "A",
    "formulaContext": "H = w · L² / (8 · h)",
    "explanation": "Taking moments about the crown hinge C: Mc = (wL/2) · (L/2) - (w · (L/2)² / 2) - H · h = 0 => H · h = wL²/8 => H = wL² / (8h).",
    "referenceSource": "Theory of Structures by Punmia",
    "difficulty": "EASY",
    "pyqYear": 2023,
    "pyqExam": "Testbook Model / APSC AE Civil 2023"
  },
  {
    "id": "ce-q-024",
    "questionNumber": 24,
    "examId": "apsc-ae-civil",
    "subject": "Structural Analysis",
    "topic": "Arches",
    "subtopic": "Bending Moment in Parabolic Arch",
    "stem": "For a three-hinged parabolic arch carrying a uniformly distributed load over its entire span, the bending moment at any section of the arch is:",
    "options": [
      {
        "id": "A",
        "text": "Zero everywhere"
      },
      {
        "id": "B",
        "text": "Maximum at the quarter span"
      },
      {
        "id": "C",
        "text": "Maximum at the crown"
      },
      {
        "id": "D",
        "text": "Equal to wL²/8"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Mx = μx - H · y = 0",
    "explanation": "The parabolic profile y = 4hx(L-x)/L² exactly matches the bending moment shape of a simple beam under UDL. Hence the thrust moment (H · y) exactly cancels the beam moment (μx) at every cross section, resulting in zero bending moment throughout.",
    "referenceSource": "Structural Analysis by Negi",
    "difficulty": "EASY",
    "pyqYear": 2022,
    "pyqExam": "Testbook Model / APSC AE Civil 2022"
  },
  {
    "id": "ce-q-025",
    "questionNumber": 25,
    "examId": "apsc-ae-civil",
    "subject": "Structural Analysis",
    "topic": "Cables and Suspension Bridges",
    "subtopic": "Maximum Tension in Cable",
    "stem": "A flexible cable of span L and central sag h carries a uniformly distributed load w per unit horizontal length. The maximum tension in the cable occurs at:",
    "options": [
      {
        "id": "A",
        "text": "The mid-span (lowest point)"
      },
      {
        "id": "B",
        "text": "The supports"
      },
      {
        "id": "C",
        "text": "Quarter-span points"
      },
      {
        "id": "D",
        "text": "Uniform throughout the length"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Tmax = √(H² + V²) at support",
    "explanation": "Cable tension at any point is T = √(H² + Vy²). Since horizontal thrust H is constant throughout the cable and vertical shear Vy is maximum at the supports (V = wL/2), the resultant cable tension Tmax occurs at the supports.",
    "referenceSource": "Structural Analysis by Bhavikatti",
    "difficulty": "EASY",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-026",
    "questionNumber": 26,
    "examId": "apsc-ae-civil",
    "subject": "Structural Analysis",
    "topic": "Portal Frames",
    "subtopic": "Sway Analysis",
    "stem": "In portal frames, side sway will NOT occur if which of the following conditions is satisfied?",
    "options": [
      {
        "id": "A",
        "text": "The frame is symmetrical in geometry, member properties and loading"
      },
      {
        "id": "B",
        "text": "The frame is subjected to unsymmetrical lateral load"
      },
      {
        "id": "C",
        "text": "Columns have different cross sections and unequal lengths"
      },
      {
        "id": "D",
        "text": "Supports are at different levels"
      }
    ],
    "correctOption": "A",
    "formulaContext": "No sway condition: Symmetry in frame geometry + stiffness + loading",
    "explanation": "Sway is induced by asymmetry in geometry, unequal column stiffness, uneven support levels, or unsymmetrical lateral/gravity loading. If geometry, stiffness, support levels, and loading are all perfectly symmetrical, no sway occurs.",
    "referenceSource": "Indeterminate Structural Analysis by Menon",
    "difficulty": "EASY",
    "pyqYear": 2021,
    "pyqExam": "Testbook Model / APSC AE Civil 2021"
  },
  {
    "id": "ce-q-027",
    "questionNumber": 27,
    "examId": "apsc-ae-civil",
    "subject": "Structural Analysis",
    "topic": "Plastic Analysis",
    "subtopic": "Shape Factor of Rectangular Section",
    "stem": "The shape factor (S = Zp / Ze) for a rectangular cross-section of width b and depth d is:",
    "options": [
      {
        "id": "A",
        "text": "1.0"
      },
      {
        "id": "B",
        "text": "1.18"
      },
      {
        "id": "C",
        "text": "1.50"
      },
      {
        "id": "D",
        "text": "1.70"
      }
    ],
    "correctOption": "C",
    "formulaContext": "Shape Factor S = Zp / Ze = (b d² / 4) / (b d² / 6) = 1.50",
    "explanation": "For a rectangular beam: Plastic section modulus Zp = (b · d/2) · (d/4) · 2 = b d² / 4. Elastic section modulus Ze = b d² / 6. Therefore, shape factor S = Zp / Ze = (b d² / 4) / (b d² / 6) = 1.50. For circular section S = 1.70, diamond S = 2.0, I-section S = 1.12 to 1.18.",
    "referenceSource": "Plastic Analysis of Structures by Baker",
    "difficulty": "EASY",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-028",
    "questionNumber": 28,
    "examId": "apsc-ae-civil",
    "subject": "Strength of Materials",
    "topic": "Stress and Strain",
    "subtopic": "Elastic Constants Relationship",
    "stem": "The relationship connecting Young's modulus (E), Shear modulus (G), and Poisson's ratio (μ) for an isotropic elastic material is:",
    "options": [
      {
        "id": "A",
        "text": "E = 2G(1 + μ)"
      },
      {
        "id": "B",
        "text": "E = 3G(1 - 2μ)"
      },
      {
        "id": "C",
        "text": "E = 2G(1 - μ)"
      },
      {
        "id": "D",
        "text": "G = 2E(1 + μ)"
      }
    ],
    "correctOption": "A",
    "formulaContext": "E = 2G(1 + μ) and E = 3K(1 - 2μ)",
    "explanation": "From the theory of elasticity, the fundamental relationships among elastic constants are: E = 2G(1 + μ) = 3K(1 - 2μ) = 9KG / (3K + G).",
    "referenceSource": "Mechanics of Materials by Gere & Timoshenko",
    "difficulty": "EASY",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-029",
    "questionNumber": 29,
    "examId": "apsc-ae-civil",
    "subject": "Strength of Materials",
    "topic": "Elastic Constants",
    "subtopic": "Poisson's Ratio Upper Bound",
    "stem": "For a perfectly incompressible isotropic material, the theoretical value of Poisson's ratio (μ) is:",
    "options": [
      {
        "id": "A",
        "text": "0"
      },
      {
        "id": "B",
        "text": "0.25"
      },
      {
        "id": "C",
        "text": "0.33"
      },
      {
        "id": "D",
        "text": "0.50"
      }
    ],
    "correctOption": "D",
    "formulaContext": "Volumetric strain εv = (σx + σy + σz)/E · (1 - 2μ) = 0 => μ = 0.50",
    "explanation": "Volumetric strain for isotropic material is given by εv = (σx+σy+σz)/E · (1 - 2μ). For an incompressible material, volume change is zero (εv = 0), which mathematically requires (1 - 2μ) = 0 => μ = 0.50. For cork μ ≈ 0; for rubber μ ≈ 0.49 - 0.50.",
    "referenceSource": "Strength of Materials by Rajput",
    "difficulty": "EASY",
    "pyqYear": 2023,
    "pyqExam": "Testbook Model / APSC AE Civil 2023"
  },
  {
    "id": "ce-q-030",
    "questionNumber": 30,
    "examId": "apsc-ae-civil",
    "subject": "Strength of Materials",
    "topic": "Principal Stresses",
    "subtopic": "Mohr's Circle Radius",
    "stem": "In a 2D stress system with normal stresses σx and σy and shear stress τxy, the radius of Mohr's circle of stress is equal to:",
    "options": [
      {
        "id": "A",
        "text": "(σx + σy) / 2"
      },
      {
        "id": "B",
        "text": "√[((σx - σy)/2)² + τxy²]"
      },
      {
        "id": "C",
        "text": "√[((σx + σy)/2)² + τxy²]"
      },
      {
        "id": "D",
        "text": "(σx - σy) / 2"
      }
    ],
    "correctOption": "B",
    "formulaContext": "R = τmax = √[((σx - σy)/2)² + τxy²]",
    "explanation": "The center of Mohr's circle is located at ((σx + σy)/2, 0) and its radius R represents the maximum in-plane shear stress τmax = √[((σx - σy)/2)² + τxy²].",
    "referenceSource": "Strength of Materials by Sadhu Singh",
    "difficulty": "EASY",
    "pyqYear": 2022,
    "pyqExam": "Testbook Model / APSC AE Civil 2022"
  },
  {
    "id": "ce-q-031",
    "questionNumber": 31,
    "examId": "apsc-ae-civil",
    "subject": "Strength of Materials",
    "topic": "Principal Planes",
    "subtopic": "Shear Stress on Principal Planes",
    "stem": "On principal planes in a stressed body, the value of shear stress is always:",
    "options": [
      {
        "id": "A",
        "text": "Maximum"
      },
      {
        "id": "B",
        "text": "Minimum but non-zero"
      },
      {
        "id": "C",
        "text": "Zero"
      },
      {
        "id": "D",
        "text": "Equal to normal stress"
      }
    ],
    "correctOption": "C",
    "formulaContext": "τ = 0 on principal planes",
    "explanation": "By definition, principal planes are planes of zero shear stress. The normal stresses acting on these planes are known as the principal stresses (major and minor).",
    "referenceSource": "Mechanics of Solids by Popov",
    "difficulty": "EASY",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-032",
    "questionNumber": 32,
    "examId": "apsc-ae-civil",
    "subject": "Strength of Materials",
    "topic": "Shear Force & Bending Moment",
    "subtopic": "Point of Contraflexure",
    "stem": "A point of contraflexure (or inflection) in a loaded beam is a point where:",
    "options": [
      {
        "id": "A",
        "text": "Shear force is zero"
      },
      {
        "id": "B",
        "text": "Bending moment is zero or changes sign"
      },
      {
        "id": "C",
        "text": "Bending moment is maximum"
      },
      {
        "id": "D",
        "text": "Shear force changes sign"
      }
    ],
    "correctOption": "B",
    "formulaContext": "M(x) = 0 and d²M/dx² ≠ 0 (curvature changes sign)",
    "explanation": "A point of contraflexure is defined as a point along the beam span where the bending moment curve crosses zero and changes sign (from sagging to hogging or vice-versa). The beam curvature changes direction at this point.",
    "referenceSource": "Strength of Materials by B.C. Punmia",
    "difficulty": "EASY",
    "pyqYear": 2023,
    "pyqExam": "Testbook Model / APSC AE Civil 2023"
  },
  {
    "id": "ce-q-033",
    "questionNumber": 33,
    "examId": "apsc-ae-civil",
    "subject": "Strength of Materials",
    "topic": "Bending Stresses",
    "subtopic": "Flexure Formula",
    "stem": "In the simple bending theory (Euler-Bernoulli beam theory), the bending stress (σ) at a distance y from the neutral axis is given by:",
    "options": [
      {
        "id": "A",
        "text": "σ = M · y / I"
      },
      {
        "id": "B",
        "text": "σ = M · I / y"
      },
      {
        "id": "C",
        "text": "σ = I · y / M"
      },
      {
        "id": "D",
        "text": "σ = M / (I · y)"
      }
    ],
    "correctOption": "A",
    "formulaContext": "M / I = σ / y = E / R => σ = M · y / I",
    "explanation": "The classic flexure equation is M/I = σ/y = E/R. Hence bending stress σ varies linearly across the cross-section, being zero at the neutral axis and maximum at the extreme fibers (y = ymax).",
    "referenceSource": "Strength of Materials by R.K. Bansal",
    "difficulty": "EASY",
    "pyqYear": 2021,
    "pyqExam": "Testbook Model / APSC AE Civil 2021"
  },
  {
    "id": "ce-q-034",
    "questionNumber": 34,
    "examId": "apsc-ae-civil",
    "subject": "Strength of Materials",
    "topic": "Shear Stresses in Beams",
    "subtopic": "Maximum Shear Stress in Rectangular Section",
    "stem": "For a beam of rectangular cross-section of width b and depth d, the maximum shear stress (τmax) is related to the average shear stress (τavg) by:",
    "options": [
      {
        "id": "A",
        "text": "τmax = 1.20 τavg"
      },
      {
        "id": "B",
        "text": "τmax = 1.33 τavg"
      },
      {
        "id": "C",
        "text": "τmax = 1.50 τavg"
      },
      {
        "id": "D",
        "text": "τmax = 2.00 τavg"
      }
    ],
    "correctOption": "C",
    "formulaContext": "τmax = 1.50 · τavg (Rectangular); τmax = 1.33 · τavg (Circular)",
    "explanation": "The parabolic shear stress distribution for a rectangle is τ = (V / 2I) · (d²/4 - y²). At the neutral axis (y = 0), τmax = 1.5 · (V / bd) = 1.50 · τavg.",
    "referenceSource": "Mechanics of Materials by Beer & Johnston",
    "difficulty": "EASY",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-035",
    "questionNumber": 35,
    "examId": "apsc-ae-civil",
    "subject": "Strength of Materials",
    "topic": "Torsion of Circular Shafts",
    "subtopic": "Torsion Equation",
    "stem": "A solid circular shaft of diameter D is subjected to a torque T. The maximum shear stress induced at the outer surface is:",
    "options": [
      {
        "id": "A",
        "text": "16 T / (π D³)"
      },
      {
        "id": "B",
        "text": "32 T / (π D³)"
      },
      {
        "id": "C",
        "text": "64 T / (π D³)"
      },
      {
        "id": "D",
        "text": "8 T / (π D³)"
      }
    ],
    "correctOption": "A",
    "formulaContext": "τmax = T · r / J = T · (D/2) / (π D⁴ / 32) = 16 T / (π D³)",
    "explanation": "From the torsion formula T/J = τ/r, for a solid circular shaft J = π D⁴ / 32 and r = D/2. Thus τmax = 16 T / (π D³). Polar section modulus Zp = π D³ / 16.",
    "referenceSource": "Strength of Materials by S. Ramamrutham",
    "difficulty": "EASY",
    "pyqYear": 2023,
    "pyqExam": "Testbook Model / APSC AE Civil 2023"
  },
  {
    "id": "ce-q-036",
    "questionNumber": 36,
    "examId": "apsc-ae-civil",
    "subject": "Strength of Materials",
    "topic": "Deflection of Beams",
    "subtopic": "Cantilever with Point Load",
    "stem": "What is the maximum deflection at the free end of a cantilever beam of span L and flexural rigidity EI carrying a concentrated point load P at its free end?",
    "options": [
      {
        "id": "A",
        "text": "P L³ / (3 EI)"
      },
      {
        "id": "B",
        "text": "P L³ / (8 EI)"
      },
      {
        "id": "C",
        "text": "P L³ / (48 EI)"
      },
      {
        "id": "D",
        "text": "5 P L⁴ / (384 EI)"
      }
    ],
    "correctOption": "A",
    "formulaContext": "δmax = P L³ / (3 EI); θmax = P L² / (2 EI)",
    "explanation": "By moment area theorem or double integration: Deflection δ = P L³ / (3 EI). For UDL over entire span, δ = w L⁴ / (8 EI). For simply supported beam with central load, δ = P L³ / (48 EI).",
    "referenceSource": "Theory of Structures by Vazirani & Ratwani",
    "difficulty": "EASY",
    "pyqYear": 2022,
    "pyqExam": "Testbook Model / APSC AE Civil 2022"
  },
  {
    "id": "ce-q-037",
    "questionNumber": 37,
    "examId": "apsc-ae-civil",
    "subject": "Strength of Materials",
    "topic": "Columns & Struts",
    "subtopic": "Euler Buckling Load & Effective Length",
    "stem": "A long column of length L and flexural rigidity EI has both ends pinned (hinged). According to Euler's formula, the critical crippling load (Pcr) is:",
    "options": [
      {
        "id": "A",
        "text": "π² EI / L²"
      },
      {
        "id": "B",
        "text": "4 π² EI / L²"
      },
      {
        "id": "C",
        "text": "π² EI / (4 L²)"
      },
      {
        "id": "D",
        "text": "2 π² EI / L²"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Pcr = π² EI / Leff²; Leff = L (both ends hinged)",
    "explanation": "Euler crippling load Pcr = π² EI / Leff². For both ends hinged: Leff = L => Pcr = π² EI / L². For both ends fixed: Leff = L/2 => Pcr = 4 π² EI / L². For one fixed and one free: Leff = 2L => Pcr = π² EI / (4 L²). For one fixed and one hinged: Leff = L/√2 => Pcr = 2 π² EI / L².",
    "referenceSource": "Mechanics of Materials by Gere",
    "difficulty": "EASY",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-038",
    "questionNumber": 38,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Properties & Phase Relationships",
    "subtopic": "Fundamental Relationship",
    "stem": "In soil mechanics, which of the following equations correctly connects degree of saturation (S), void ratio (e), water content (w), and specific gravity (G)?",
    "options": [
      {
        "id": "A",
        "text": "S · e = w · G"
      },
      {
        "id": "B",
        "text": "S · w = e · G"
      },
      {
        "id": "C",
        "text": "S · G = w · e"
      },
      {
        "id": "D",
        "text": "w · e · S = G"
      }
    ],
    "correctOption": "A",
    "formulaContext": "S · e = w · G",
    "explanation": "By definition, S = Vw / Vv and e = Vv / Vs => S · e = Vw / Vs = (Mw / ρw) / (Ms / (G · ρw)) = (Mw / Ms) · G = w · G. Hence S · e = w · G.",
    "referenceSource": "Soil Mechanics & Foundation Engineering by K.R. Arora",
    "difficulty": "EASY",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-039",
    "questionNumber": 39,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Classification",
    "subtopic": "Plasticity Chart & A-Line Equation",
    "stem": "In the Indian Standard Soil Classification System (IS 1498), the equation of the 'A-line' on the plasticity chart separating clays from silts and organic soils is:",
    "options": [
      {
        "id": "A",
        "text": "IP = 0.73 · (wL - 20)"
      },
      {
        "id": "B",
        "text": "IP = 0.90 · (wL - 8)"
      },
      {
        "id": "C",
        "text": "IP = 0.73 · (wL - 10)"
      },
      {
        "id": "D",
        "text": "IP = 0.50 · (wL - 20)"
      }
    ],
    "correctOption": "A",
    "formulaContext": "IP = 0.73 · (wL - 20)",
    "explanation": "Arthur Casagrande's A-line equation is IP = 0.73 · (wL - 20). Inorganic clays lie above the A-line; inorganic silts and organic clays lie below the A-line. The U-line (upper limit) is IP = 0.90 · (wL - 8).",
    "referenceSource": "IS 1498:1970 Soil Classification Code",
    "difficulty": "EASY",
    "pyqYear": 2023,
    "pyqExam": "Testbook Model / APSC AE Civil 2023"
  },
  {
    "id": "ce-q-040",
    "questionNumber": 40,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Effective Stress Principle",
    "subtopic": "Terzaghi's Principle",
    "stem": "According to Terzaghi's effective stress principle, total stress (σ), effective stress (σ'), and pore water pressure (u) are related by:",
    "options": [
      {
        "id": "A",
        "text": "σ' = σ - u"
      },
      {
        "id": "B",
        "text": "σ' = σ + u"
      },
      {
        "id": "C",
        "text": "σ' = u - σ"
      },
      {
        "id": "D",
        "text": "σ' = σ / u"
      }
    ],
    "correctOption": "A",
    "formulaContext": "σ' = σ - u",
    "explanation": "The effective stress σ' is the intergranular stress transmitted across grain contacts that governs shear strength and volume compressibility: σ' = σ - u.",
    "referenceSource": "Theoretical Soil Mechanics by Terzaghi",
    "difficulty": "EASY",
    "pyqYear": 2022,
    "pyqExam": "Testbook Model / APSC AE Civil 2022"
  },
  {
    "id": "ce-q-041",
    "questionNumber": 41,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Permeability of Soils",
    "subtopic": "Constant vs Falling Head Permeameter",
    "stem": "The falling head permeability test is primarily recommended for which type of soil?",
    "options": [
      {
        "id": "A",
        "text": "Clean gravels"
      },
      {
        "id": "B",
        "text": "Coarse sands"
      },
      {
        "id": "C",
        "text": "Fine-grained soils like silts and clays"
      },
      {
        "id": "D",
        "text": "Boulders and cobbles"
      }
    ],
    "correctOption": "C",
    "formulaContext": "k = (2.303 a L / (A t)) · log10(h1 / h2)",
    "explanation": "Constant head permeameter is used for coarse-grained soils with high permeability (sands, gravels). Falling head permeameter is suitable for fine-grained soils (silts and clays) where discharge is very small.",
    "referenceSource": "Basic and Applied Soil Mechanics by Gopal Ranjan",
    "difficulty": "EASY",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-042",
    "questionNumber": 42,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Seepage & Flow Nets",
    "subtopic": "Seepage Discharge Equation",
    "stem": "In a flow net constructed with Nf flow channels and Nd equipotential drops under total head loss H, the seepage discharge per unit length through soil of permeability k is:",
    "options": [
      {
        "id": "A",
        "text": "q = k · H · (Nf / Nd)"
      },
      {
        "id": "B",
        "text": "q = k · H · (Nd / Nf)"
      },
      {
        "id": "C",
        "text": "q = k · H · (Nf · Nd)"
      },
      {
        "id": "D",
        "text": "q = k · H / (Nf + Nd)"
      }
    ],
    "correctOption": "A",
    "formulaContext": "q = k · H · (Nf / Nd)",
    "explanation": "Flow net discharge is given by q = k · H · (Nf / Nd) for square flow elements where aspect ratio b/a = 1. Shape factor is defined as (Nf / Nd).",
    "referenceSource": "Soil Mechanics by B.C. Punmia",
    "difficulty": "EASY",
    "pyqYear": 2023,
    "pyqExam": "Testbook Model / APSC AE Civil 2023"
  },
  {
    "id": "ce-q-043",
    "questionNumber": 43,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Quick Sand Condition",
    "subtopic": "Critical Hydraulic Gradient",
    "stem": "The critical hydraulic gradient (icr) at which quicksand condition or boiling occurs in a saturated cohesionless soil is given by:",
    "options": [
      {
        "id": "A",
        "text": "icr = (G - 1) / (1 + e)"
      },
      {
        "id": "B",
        "text": "icr = (G + 1) / (1 + e)"
      },
      {
        "id": "C",
        "text": "icr = (G - 1) / (1 - e)"
      },
      {
        "id": "D",
        "text": "icr = (1 + e) / (G - 1)"
      }
    ],
    "correctOption": "A",
    "formulaContext": "icr = γ' / γw = (G - 1) / (1 + e)",
    "explanation": "Quicksand occurs when upward seepage force balances submerged weight of soil particles (effective stress σ' = 0). Thus i · γw = γ' => icr = γ' / γw = (G - 1) / (1 + e). For typical soils (G ≈ 2.65, e ≈ 0.65), icr ≈ 1.0.",
    "referenceSource": "Soil Mechanics in Engineering Practice by Terzaghi & Peck",
    "difficulty": "EASY",
    "pyqYear": 2021,
    "pyqExam": "Testbook Model / APSC AE Civil 2021"
  },
  {
    "id": "ce-q-044",
    "questionNumber": 44,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Consolidation of Soils",
    "subtopic": "Time Factor and Drainage Path",
    "stem": "In Terzaghi's 1D consolidation theory, the non-dimensional time factor (Tv) is expressed as:",
    "options": [
      {
        "id": "A",
        "text": "Tv = Cv · t / d²"
      },
      {
        "id": "B",
        "text": "Tv = Cv · d² / t"
      },
      {
        "id": "C",
        "text": "Tv = k · t / Cv"
      },
      {
        "id": "D",
        "text": "Tv = mv · t / d²"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Tv = Cv · t / d²",
    "explanation": "Time factor Tv = Cv · t / d², where Cv is coefficient of consolidation, t is time, and d is length of drainage path (d = H/2 for two-way double drainage, d = H for single one-way drainage).",
    "referenceSource": "Geotechnical Engineering by C. Venkatramaiah",
    "difficulty": "EASY",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-045",
    "questionNumber": 45,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Consolidation of Soils",
    "subtopic": "Compression Index Empirical Formula",
    "stem": "For undisturbed clays of medium to low sensitivity, Skempton's empirical formula for compression index (Cc) based on liquid limit (wL in %) is:",
    "options": [
      {
        "id": "A",
        "text": "Cc = 0.009 · (wL - 10)"
      },
      {
        "id": "B",
        "text": "Cc = 0.007 · (wL - 10)"
      },
      {
        "id": "C",
        "text": "Cc = 0.009 · (wL - 20)"
      },
      {
        "id": "D",
        "text": "Cc = 0.005 · (wL - 15)"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Cc = 0.009 · (wL - 10) for undisturbed clays",
    "explanation": "Skempton's widely verified empirical relationship is: Cc = 0.009 · (wL - 10) for undisturbed clays, and Cc = 0.007 · (wL - 10) for remolded clays.",
    "referenceSource": "Soil Mechanics by Lambe & Whitman",
    "difficulty": "MEDIUM",
    "pyqYear": 2023,
    "pyqExam": "Testbook Model / APSC AE Civil 2023"
  },
  {
    "id": "ce-q-046",
    "questionNumber": 46,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Shear Strength of Soil",
    "subtopic": "Mohr-Coulomb Failure Criteria",
    "stem": "The shear strength (τf) of a soil on any plane according to Mohr-Coulomb failure criterion is represented by:",
    "options": [
      {
        "id": "A",
        "text": "τf = c + σ · tan φ"
      },
      {
        "id": "B",
        "text": "τf = c - σ · tan φ"
      },
      {
        "id": "C",
        "text": "τf = σ + c · tan φ"
      },
      {
        "id": "D",
        "text": "τf = c · σ · tan φ"
      }
    ],
    "correctOption": "A",
    "formulaContext": "τf = c + σ · tan φ (Total) or τf = c' + σ' · tan φ' (Effective)",
    "explanation": "Coulomb's shear strength equation states that shear strength comprises apparent cohesion c and frictional resistance proportional to effective normal stress σ: τf = c + σ tan φ.",
    "referenceSource": "Principles of Geotechnical Engineering by B.M. Das",
    "difficulty": "EASY",
    "pyqYear": 2022,
    "pyqExam": "Testbook Model / APSC AE Civil 2022"
  },
  {
    "id": "ce-q-047",
    "questionNumber": 47,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Shear Strength Testing",
    "subtopic": "Triaxial Drainage Conditions",
    "stem": "In a Consolidated Undrained (CU) triaxial compression test, drainage is permitted during:",
    "options": [
      {
        "id": "A",
        "text": "The application of cell pressure only"
      },
      {
        "id": "B",
        "text": "The application of deviator stress only"
      },
      {
        "id": "C",
        "text": "Both cell pressure and deviator stress stages"
      },
      {
        "id": "D",
        "text": "Neither cell pressure nor deviator stress stage"
      }
    ],
    "correctOption": "A",
    "formulaContext": "CU test: Drainage open during cell pressure consolidation, closed during shearing",
    "explanation": "In Consolidated Undrained (CU) test: Consolidation stage has drainage valve open (dissipating excess pore pressure under confining pressure σ3); during the subsequent shearing stage (application of deviator stress Δσ), the drainage valve is closed.",
    "referenceSource": "Soil Mechanics by Craig",
    "difficulty": "MEDIUM",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-048",
    "questionNumber": 48,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Lateral Earth Pressure",
    "subtopic": "Rankine's Active Pressure Coefficient",
    "stem": "For a cohesionless backfill with horizontal ground surface and angle of internal friction φ, Rankine's coefficient of active earth pressure (Ka) is:",
    "options": [
      {
        "id": "A",
        "text": "Ka = (1 - sin φ) / (1 + sin φ)"
      },
      {
        "id": "B",
        "text": "Ka = (1 + sin φ) / (1 - sin φ)"
      },
      {
        "id": "C",
        "text": "Ka = cos² φ / (1 + sin φ)"
      },
      {
        "id": "D",
        "text": "Ka = (1 - cos φ) / (1 + cos φ)"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Ka = (1 - sin φ) / (1 + sin φ) = tan²(45° - φ/2)",
    "explanation": "Rankine's active coefficient is Ka = (1 - sin φ) / (1 + sin φ) = tan²(45° - φ/2). Conversely, passive pressure coefficient Kp = 1 / Ka = (1 + sin φ) / (1 - sin φ) = tan²(45° + φ/2).",
    "referenceSource": "Foundation Engineering by Teng",
    "difficulty": "EASY",
    "pyqYear": 2023,
    "pyqExam": "Testbook Model / APSC AE Civil 2023"
  },
  {
    "id": "ce-q-049",
    "questionNumber": 49,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Bearing Capacity of Foundations",
    "subtopic": "Terzaghi's Equation for Strip Footing",
    "stem": "Terzaghi's ultimate bearing capacity (qu) equation for a continuous strip footing of width B at depth Df in soil with parameters c, γ, and bearing capacity factors Nc, Nq, Nγ is:",
    "options": [
      {
        "id": "A",
        "text": "qu = c Nc + q Nq + 0.5 γ B Nγ"
      },
      {
        "id": "B",
        "text": "qu = 1.3 c Nc + q Nq + 0.4 γ B Nγ"
      },
      {
        "id": "C",
        "text": "qu = 1.3 c Nc + q Nq + 0.3 γ B Nγ"
      },
      {
        "id": "D",
        "text": "qu = c Nc + q Nq + γ B Nγ"
      }
    ],
    "correctOption": "A",
    "formulaContext": "qu = c Nc + γ Df Nq + 0.5 γ B Nγ",
    "explanation": "For a strip footing: qu = c Nc + q Nq + 0.5 γ B Nγ. For a square footing: qu = 1.3 c Nc + q Nq + 0.4 γ B Nγ. For a circular footing: qu = 1.3 c Nc + q Nq + 0.3 γ B Nγ.",
    "referenceSource": "Theoretical Soil Mechanics by Terzaghi",
    "difficulty": "EASY",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-050",
    "questionNumber": 50,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Bearing Capacity Definitions",
    "subtopic": "Net Ultimate Bearing Capacity",
    "stem": "The net ultimate bearing capacity (qnu) of a foundation is defined in terms of gross ultimate bearing capacity (qu) and effective surcharge (q = γ Df) as:",
    "options": [
      {
        "id": "A",
        "text": "qnu = qu - γ · Df"
      },
      {
        "id": "B",
        "text": "qnu = qu + γ · Df"
      },
      {
        "id": "C",
        "text": "qnu = qu / (γ · Df)"
      },
      {
        "id": "D",
        "text": "qnu = (qu - γ · Df) / FOS"
      }
    ],
    "correctOption": "A",
    "formulaContext": "qnu = qu - q = qu - γ · Df",
    "explanation": "Net ultimate bearing capacity is the net intensity of pressure at the base of the footing in excess of the existing overburden pressure that the soil can support: qnu = qu - γ Df. Net safe bearing capacity qns = qnu / FOS.",
    "referenceSource": "Soil Mechanics by B.C. Punmia",
    "difficulty": "EASY",
    "pyqYear": 2021,
    "pyqExam": "Testbook Model / APSC AE Civil 2021"
  },
  {
    "id": "ce-q-051",
    "questionNumber": 51,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Standard Penetration Test (SPT)",
    "subtopic": "Dilatancy Correction",
    "stem": "The dilatancy correction for observed SPT N-value in fine sands and silts below water table is applied only when the corrected value for overburden (N1) exceeds 15, using the formula:",
    "options": [
      {
        "id": "A",
        "text": "N'' = 15 + 0.5 · (N' - 15)"
      },
      {
        "id": "B",
        "text": "N'' = 15 + 0.75 · (N' - 15)"
      },
      {
        "id": "C",
        "text": "N'' = 15 + 0.25 · (N' - 15)"
      },
      {
        "id": "D",
        "text": "N'' = 0.5 · (N' + 15)"
      }
    ],
    "correctOption": "A",
    "formulaContext": "N'' = 15 + 0.5 · (N' - 15) per IS 2131",
    "explanation": "As per IS 2131, negative pore water pressures during dynamic shearing increase resistance in dense saturated silts and fine sands. When N' > 15, the dilatancy correction is N'' = 15 + 0.5(N' - 15).",
    "referenceSource": "IS 2131:1981 Standard Penetration Test Code",
    "difficulty": "MEDIUM",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-052",
    "questionNumber": 52,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Pile Foundations",
    "subtopic": "Negative Skin Friction",
    "stem": "Negative skin friction on a driven pile occurs when:",
    "options": [
      {
        "id": "A",
        "text": "The surrounding soil settles more than the pile itself"
      },
      {
        "id": "B",
        "text": "The pile moves downward relative to the soil under structural load"
      },
      {
        "id": "C",
        "text": "The pile is driven into very hard bedrock"
      },
      {
        "id": "D",
        "text": "Groundwater level rises rapidly above the surface"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Downward drag force Qnf = P · L · α · c",
    "explanation": "Negative skin friction is a downward drag acting on pile shaft when consolidating compressible soil (soft clay, recent fill) settles faster than the pile, adding downward load to the pile instead of providing upward support.",
    "referenceSource": "Foundation Engineering by Bowles",
    "difficulty": "EASY",
    "pyqYear": 2023,
    "pyqExam": "Testbook Model / APSC AE Civil 2023"
  },
  {
    "id": "ce-q-053",
    "questionNumber": 53,
    "examId": "apsc-ae-civil",
    "subject": "Fluid Mechanics & Hydraulics",
    "topic": "Fluid Properties",
    "subtopic": "Kinematic Viscosity Units",
    "stem": "The CGS unit of kinematic viscosity is 'Stokes'. 1 Stokes is equal to:",
    "options": [
      {
        "id": "A",
        "text": "1 cm²/s (or 10⁻⁴ m²/s)"
      },
      {
        "id": "B",
        "text": "1 m²/s"
      },
      {
        "id": "C",
        "text": "10⁻³ m²/s"
      },
      {
        "id": "D",
        "text": "1 N·s/m²"
      }
    ],
    "correctOption": "A",
    "formulaContext": "1 Stokes = 1 cm²/s = 10⁻⁴ m²/s; Kinematic viscosity ν = μ / ρ",
    "explanation": "Kinematic viscosity is dynamic viscosity divided by fluid density (ν = μ / ρ) with dimensions [L² T⁻¹]. In SI units it is m²/s, and in CGS units 1 cm²/s = 1 Stokes = 10⁻⁴ m²/s. 1 Poise = 0.1 N·s/m² = 0.1 Pa·s.",
    "referenceSource": "Fluid Mechanics by Frank M. White",
    "difficulty": "EASY",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-054",
    "questionNumber": 54,
    "examId": "apsc-ae-civil",
    "subject": "Fluid Mechanics & Hydraulics",
    "topic": "Hydrostatics",
    "subtopic": "Center of Pressure",
    "stem": "The center of pressure for a vertical rectangular plane surface of width b and depth d submerged vertically in water with its top edge in the free surface lies at a depth of:",
    "options": [
      {
        "id": "A",
        "text": "d / 2"
      },
      {
        "id": "B",
        "text": "2d / 3"
      },
      {
        "id": "C",
        "text": "3d / 4"
      },
      {
        "id": "D",
        "text": "d / 3"
      }
    ],
    "correctOption": "B",
    "formulaContext": "hc = h̄ + IG / (A · h̄) = d/2 + (b d³ / 12) / ((b d) · (d/2)) = d/2 + d/6 = 2d/3",
    "explanation": "From the hydrostatic pressure formula for vertical submerged surfaces, hc = h̄ + IG/(A·h̄). Substituting h̄ = d/2, IG = bd³/12, and A = bd gives hc = d/2 + d/6 = 2/3 d.",
    "referenceSource": "Hydraulics & Fluid Mechanics by Modi & Seth",
    "difficulty": "EASY",
    "pyqYear": 2023,
    "pyqExam": "Testbook Model / APSC AE Civil 2023"
  },
  {
    "id": "ce-q-055",
    "questionNumber": 55,
    "examId": "apsc-ae-civil",
    "subject": "Fluid Mechanics & Hydraulics",
    "topic": "Buoyancy and Floatation",
    "subtopic": "Metacentric Height & Stability",
    "stem": "For a floating body to be in stable equilibrium, its metacentric height (GM) must be:",
    "options": [
      {
        "id": "A",
        "text": "Positive (Metacenter M lies above center of gravity G)"
      },
      {
        "id": "B",
        "text": "Zero (Metacenter M coincides with G)"
      },
      {
        "id": "C",
        "text": "Negative (Metacenter M lies below G)"
      },
      {
        "id": "D",
        "text": "Infinite"
      }
    ],
    "correctOption": "A",
    "formulaContext": "GM = BM - BG > 0 for stable equilibrium",
    "explanation": "A floating body is in stable equilibrium when GM > 0 (M lies above G), neutral when GM = 0 (M coincides with G), and unstable when GM < 0 (M lies below G, producing an upsetting moment).",
    "referenceSource": "Fluid Mechanics by A.K. Jain",
    "difficulty": "EASY",
    "pyqYear": 2022,
    "pyqExam": "Testbook Model / APSC AE Civil 2022"
  },
  {
    "id": "ce-q-056",
    "questionNumber": 56,
    "examId": "apsc-ae-civil",
    "subject": "Fluid Mechanics & Hydraulics",
    "topic": "Fluid Kinematics",
    "subtopic": "Continuity Equation",
    "stem": "The general continuity equation for steady, 3D incompressible flow in Cartesian coordinates is:",
    "options": [
      {
        "id": "A",
        "text": "∂u/∂x + ∂v/∂y + ∂w/∂z = 0"
      },
      {
        "id": "B",
        "text": "u · ∂u/∂x + v · ∂v/∂y + w · ∂w/∂z = 0"
      },
      {
        "id": "C",
        "text": "∂u/∂x - ∂v/∂y + ∂w/∂z = 0"
      },
      {
        "id": "D",
        "text": "∂²u/∂x² + ∂²v/∂y² + ∂²w/∂z² = 0"
      }
    ],
    "correctOption": "A",
    "formulaContext": "∇ · V = ∂u/∂x + ∂v/∂y + ∂w/∂z = 0",
    "explanation": "Conservation of mass for a fluid with constant density ρ leads to the divergence of velocity vector being zero: div(V) = ∂u/∂x + ∂v/∂y + ∂w/∂z = 0.",
    "referenceSource": "Fluid Mechanics by Som & Biswas",
    "difficulty": "EASY",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-057",
    "questionNumber": 57,
    "examId": "apsc-ae-civil",
    "subject": "Fluid Mechanics & Hydraulics",
    "topic": "Fluid Dynamics",
    "subtopic": "HGL and TEL Relationship",
    "stem": "The vertical distance between the Total Energy Line (TEL) and Hydraulic Gradient Line (HGL) at any cross-section of a pipe flow represents the:",
    "options": [
      {
        "id": "A",
        "text": "Pressure head (p / γ)"
      },
      {
        "id": "B",
        "text": "Velocity head (v² / 2g)"
      },
      {
        "id": "C",
        "text": "Datum head (z)"
      },
      {
        "id": "D",
        "text": "Friction head loss (hf)"
      }
    ],
    "correctOption": "B",
    "formulaContext": "TEL - HGL = v² / (2g)",
    "explanation": "Total Energy Line = p/γ + z + v²/2g. Hydraulic Gradient Line = p/γ + z. The difference between TEL and HGL is strictly the kinetic velocity head v² / (2g).",
    "referenceSource": "Fluid Mechanics by Fox & McDonald",
    "difficulty": "EASY",
    "pyqYear": 2021,
    "pyqExam": "Testbook Model / APSC AE Civil 2021"
  },
  {
    "id": "ce-q-058",
    "questionNumber": 58,
    "examId": "apsc-ae-civil",
    "subject": "Fluid Mechanics & Hydraulics",
    "topic": "Flow Measurement",
    "subtopic": "Venturimeter Discharge Coefficient",
    "stem": "The coefficient of discharge (Cd) for a standard venturimeter typically ranges between:",
    "options": [
      {
        "id": "A",
        "text": "0.60 to 0.65"
      },
      {
        "id": "B",
        "text": "0.70 to 0.75"
      },
      {
        "id": "C",
        "text": "0.80 to 0.85"
      },
      {
        "id": "D",
        "text": "0.96 to 0.98"
      }
    ],
    "correctOption": "D",
    "formulaContext": "Cd(venturi) ≈ 0.96 - 0.98 vs Cd(orifice) ≈ 0.60 - 0.65",
    "explanation": "Due to smooth streamlined gradual convergence and divergence in a venturimeter, boundary layer separation and eddy losses are minimal, yielding Cd = 0.96 to 0.98. Orifice meters have sudden contraction with vena contracta, giving Cd ≈ 0.60 - 0.65.",
    "referenceSource": "Hydraulics and Fluid Mechanics by Modi & Seth",
    "difficulty": "EASY",
    "pyqYear": 2023,
    "pyqExam": "Testbook Model / APSC AE Civil 2023"
  },
  {
    "id": "ce-q-059",
    "questionNumber": 59,
    "examId": "apsc-ae-civil",
    "subject": "Fluid Mechanics & Hydraulics",
    "topic": "Pipe Flow",
    "subtopic": "Darcy-Weisbach Equation",
    "stem": "The head loss due to friction in a pipe of length L, diameter D, carrying fluid at average velocity v is given by the Darcy-Weisbach equation as:",
    "options": [
      {
        "id": "A",
        "text": "hf = f · L · v² / (2 · g · D)"
      },
      {
        "id": "B",
        "text": "hf = 4 · f · L · v / (2 · g · D)"
      },
      {
        "id": "C",
        "text": "hf = f · L · v / (g · D)"
      },
      {
        "id": "D",
        "text": "hf = f · L² · v / (2 · g · D)"
      }
    ],
    "correctOption": "A",
    "formulaContext": "hf = f · L · v² / (2 · g · D) [where f is Darcy friction factor]",
    "explanation": "The Darcy-Weisbach equation is hf = f · L · v² / (2 g D). If Fanning friction factor f' is used, hf = 4 f' L v² / (2 g D), where f = 4 f'.",
    "referenceSource": "Fluid Mechanics by Yunus A. Cengel",
    "difficulty": "EASY",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-060",
    "questionNumber": 60,
    "examId": "apsc-ae-civil",
    "subject": "Fluid Mechanics & Hydraulics",
    "topic": "Laminar Flow in Pipes",
    "subtopic": "Hagen-Poiseuille Velocity Distribution",
    "stem": "In fully developed laminar flow through a circular pipe, the ratio of maximum centerline velocity (umax) to average cross-sectional velocity (vavg) is:",
    "options": [
      {
        "id": "A",
        "text": "1.25"
      },
      {
        "id": "B",
        "text": "1.50"
      },
      {
        "id": "C",
        "text": "2.00"
      },
      {
        "id": "D",
        "text": "2.50"
      }
    ],
    "correctOption": "C",
    "formulaContext": "umax = 2 · vavg (Circular Pipe); umax = 1.5 · vavg (Parallel Plates)",
    "explanation": "Velocity distribution across a circular pipe is parabolic: u(r) = umax · (1 - r²/R²). Integrating over the cross-section yields vavg = umax / 2, meaning maximum centerline velocity is exactly twice the average velocity (umax = 2 vavg).",
    "referenceSource": "Fluid Mechanics by Streeter & Wylie",
    "difficulty": "EASY",
    "pyqYear": 2022,
    "pyqExam": "Testbook Model / APSC AE Civil 2022"
  },
  {
    "id": "ce-q-061",
    "questionNumber": 61,
    "examId": "apsc-ae-civil",
    "subject": "Fluid Mechanics & Hydraulics",
    "topic": "Open Channel Flow",
    "subtopic": "Manning's Formula",
    "stem": "In SI units, Manning's equation for uniform flow velocity (V) in an open channel of hydraulic radius R and bed slope S is:",
    "options": [
      {
        "id": "A",
        "text": "V = (1 / n) · R^(2/3) · S^(1/2)"
      },
      {
        "id": "B",
        "text": "V = (1 / n) · R^(1/2) · S^(2/3)"
      },
      {
        "id": "C",
        "text": "V = n · R^(2/3) · S^(1/2)"
      },
      {
        "id": "D",
        "text": "V = (1 / n) · R^(3/4) · S^(1/2)"
      }
    ],
    "correctOption": "A",
    "formulaContext": "V = (1 / n) · R^(2/3) · S^(1/2)",
    "explanation": "Robert Manning's empirical formula for uniform flow velocity is V = (1/n) · R^(2/3) · S^(1/2), where n is Manning's roughness coefficient, R is hydraulic radius (Area / Wetted Perimeter), and S is longitudinal bed slope.",
    "referenceSource": "Flow in Open Channels by K. Subramanya",
    "difficulty": "EASY",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-062",
    "questionNumber": 62,
    "examId": "apsc-ae-civil",
    "subject": "Fluid Mechanics & Hydraulics",
    "topic": "Open Channel Flow",
    "subtopic": "Critical Depth in Rectangular Channel",
    "stem": "For a rectangular open channel carrying discharge q per unit width, the critical depth (yc) is given by:",
    "options": [
      {
        "id": "A",
        "text": "yc = (q² / g)^(1/3)"
      },
      {
        "id": "B",
        "text": "yc = (q / g)^(1/2)"
      },
      {
        "id": "C",
        "text": "yc = (q² / g)^(1/2)"
      },
      {
        "id": "D",
        "text": "yc = (q / g²)^(1/3)"
      }
    ],
    "correctOption": "A",
    "formulaContext": "yc = (q² / g)^(1/3); Froude number Fr = 1 at critical depth",
    "explanation": "At critical flow condition, specific energy is minimum for a given discharge, giving Froude number Fr = v / √(g yc) = 1. Substituting v = q / yc leads directly to yc³ = q² / g => yc = (q² / g)^(1/3). Minimum specific energy Emin = 1.5 yc.",
    "referenceSource": "Open Channel Hydraulics by Ven Te Chow",
    "difficulty": "EASY",
    "pyqYear": 2023,
    "pyqExam": "Testbook Model / APSC AE Civil 2023"
  },
  {
    "id": "ce-q-063",
    "questionNumber": 63,
    "examId": "apsc-ae-civil",
    "subject": "Fluid Mechanics & Hydraulics",
    "topic": "Open Channel Flow",
    "subtopic": "Hydraulic Jump Sequent Depths",
    "stem": "The relationship between pre-jump depth (y1) and post-jump sequent depth (y2) in a horizontal rectangular channel with initial Froude number Fr1 is:",
    "options": [
      {
        "id": "A",
        "text": "y2 / y1 = 0.5 · [√(1 + 8 · Fr1²) - 1]"
      },
      {
        "id": "B",
        "text": "y2 / y1 = 0.5 · [√(1 + 8 · Fr1²) + 1]"
      },
      {
        "id": "C",
        "text": "y2 / y1 = √(1 + 8 · Fr1²)"
      },
      {
        "id": "D",
        "text": "y2 / y1 = 0.5 · [√(1 + 4 · Fr1²) - 1]"
      }
    ],
    "correctOption": "A",
    "formulaContext": "y2 / y1 = 0.5 · [√(1 + 8 · Fr1²) - 1] (Belanger equation)",
    "explanation": "Applying momentum equation across the hydraulic jump in a rectangular channel yields Belanger's equation: y2 / y1 = 0.5 · (√(1 + 8 Fr1²) - 1). Energy loss in jump is ΔE = (y2 - y1)³ / (4 y1 y2).",
    "referenceSource": "Flow in Open Channels by K. Subramanya",
    "difficulty": "MEDIUM",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-064",
    "questionNumber": 64,
    "examId": "apsc-ae-civil",
    "subject": "Fluid Mechanics & Hydraulics",
    "topic": "Hydraulic Machines",
    "subtopic": "Specific Speed of Turbines",
    "stem": "The specific speed (Ns) of a hydraulic turbine generating power P under head H at rotational speed N is defined as:",
    "options": [
      {
        "id": "A",
        "text": "Ns = N · √P / H^(5/4)"
      },
      {
        "id": "B",
        "text": "Ns = N · √P / H^(3/4)"
      },
      {
        "id": "C",
        "text": "Ns = N · √Q / H^(3/4)"
      },
      {
        "id": "D",
        "text": "Ns = N · P² / H^(5/4)"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Ns(turbine) = N · √P / H^(5/4); Ns(pump) = N · √Q / H^(3/4)",
    "explanation": "Turbine specific speed is Ns = N √P / H^(5/4). For Pelton wheel: Ns = 10-35 (low). For Francis turbine: Ns = 60-300 (medium). For Kaplan turbine: Ns = 300-1000 (high specific speed under low head).",
    "referenceSource": "Hydraulic Machines by Jagdish Lal",
    "difficulty": "EASY",
    "pyqYear": 2021,
    "pyqExam": "Testbook Model / APSC AE Civil 2021"
  },
  {
    "id": "ce-q-065",
    "questionNumber": 65,
    "examId": "apsc-ae-civil",
    "subject": "Environmental Engineering",
    "topic": "Water Demand",
    "subtopic": "Population Forecasting Methods",
    "stem": "Which population forecasting method is most suitable for an old, mature, and densely populated city that has reached its saturation stage?",
    "options": [
      {
        "id": "A",
        "text": "Arithmetical increase method"
      },
      {
        "id": "B",
        "text": "Geometrical increase method"
      },
      {
        "id": "C",
        "text": "Incremental increase method"
      },
      {
        "id": "D",
        "text": "Decreasing rate of growth method"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Pn = P0 + n · x̄",
    "explanation": "Arithmetical increase method assumes a constant rate of population growth (dP/dt = constant) and is suitable for old, large, established cities nearing saturation. Geometrical increase method is suited for rapidly developing young cities.",
    "referenceSource": "Water Supply Engineering by S.K. Garg",
    "difficulty": "EASY",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-066",
    "questionNumber": 66,
    "examId": "apsc-ae-civil",
    "subject": "Environmental Engineering",
    "topic": "Water Quality Standards",
    "subtopic": "Fluoride Limits per IS 10500",
    "stem": "As per IS 10500:2012, what is the acceptable limit and permissible limit in the absence of alternate source for Fluoride in drinking water?",
    "options": [
      {
        "id": "A",
        "text": "1.0 mg/L and 1.5 mg/L respectively"
      },
      {
        "id": "B",
        "text": "0.5 mg/L and 1.0 mg/L respectively"
      },
      {
        "id": "C",
        "text": "1.5 mg/L and 2.5 mg/L respectively"
      },
      {
        "id": "D",
        "text": "0.05 mg/L and 0.1 mg/L respectively"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Acceptable limit = 1.0 mg/L; Max permissible = 1.5 mg/L",
    "explanation": "Under IS 10500:2012, acceptable Fluoride limit is 1.0 mg/L (prevents dental cavities). If fluoride exceeds 1.5 mg/L, it causes dental fluorosis (mottling of teeth) and skeletal fluorosis.",
    "referenceSource": "IS 10500:2012 Drinking Water Specification",
    "difficulty": "EASY",
    "pyqYear": 2023,
    "pyqExam": "Testbook Model / APSC AE Civil 2023"
  },
  {
    "id": "ce-q-067",
    "questionNumber": 67,
    "examId": "apsc-ae-civil",
    "subject": "Environmental Engineering",
    "topic": "Water Treatment",
    "subtopic": "Alum Coagulation Chemistry",
    "stem": "When filter alum [Al2(SO4)3 · 18 H2O] is added as a coagulant to water containing bicarbonate alkalinity, it forms an insoluble gelatinous precipitate of:",
    "options": [
      {
        "id": "A",
        "text": "Aluminium hydroxide [Al(OH)3]"
      },
      {
        "id": "B",
        "text": "Aluminium oxide [Al2O3]"
      },
      {
        "id": "C",
        "text": "Calcium sulphate [CaSO4]"
      },
      {
        "id": "D",
        "text": "Aluminium carbonate [Al2(CO3)3]"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Al2(SO4)3 + 3 Ca(HCO3)2 -> 2 Al(OH)3 ↓ + 3 CaSO4 + 6 CO2",
    "explanation": "Alum reacts with calcium bicarbonate natural alkalinity in water to produce aluminium hydroxide Al(OH)3 floc precipitate, which traps and sweeps colloidal turbidity. It releases CO2, which increases acidity and decreases water pH.",
    "referenceSource": "Environmental Engineering by Peavy, Rowe & Tchobanoglous",
    "difficulty": "MEDIUM",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-068",
    "questionNumber": 68,
    "examId": "apsc-ae-civil",
    "subject": "Environmental Engineering",
    "topic": "Water Treatment",
    "subtopic": "Sedimentation Tank Overflow Rate",
    "stem": "In a continuous flow horizontal sedimentation tank of length L, width B, and depth H treating discharge Q, the surface overflow rate (SOR or Vo) is:",
    "options": [
      {
        "id": "A",
        "text": "Vo = Q / (B · L)"
      },
      {
        "id": "B",
        "text": "Vo = Q / (B · H)"
      },
      {
        "id": "C",
        "text": "Vo = Q / (L · H)"
      },
      {
        "id": "D",
        "text": "Vo = Q / (B · L · H)"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Vo = Q / (B · L) = Q / Plan Area",
    "explanation": "Surface overflow rate (SOR) is defined as discharge divided by plan surface area: Vo = Q / (B · L). Particles having settling velocity Vs ≥ Vo are 100% removed, while particles with Vs < Vo have removal efficiency η = (Vs / Vo) · 100%.",
    "referenceSource": "Water Supply Engineering by B.C. Punmia",
    "difficulty": "EASY",
    "pyqYear": 2022,
    "pyqExam": "Testbook Model / APSC AE Civil 2022"
  },
  {
    "id": "ce-q-069",
    "questionNumber": 69,
    "examId": "apsc-ae-civil",
    "subject": "Environmental Engineering",
    "topic": "Filtration",
    "subtopic": "Rapid vs Slow Sand Filters",
    "stem": "Compared to a slow sand filter, a rapid sand filter has a rate of filtration that is approximately:",
    "options": [
      {
        "id": "A",
        "text": "30 times higher (3000 - 6000 L/m²/hr vs 100 - 200 L/m²/hr)"
      },
      {
        "id": "B",
        "text": "Equal"
      },
      {
        "id": "C",
        "text": "10 times lower"
      },
      {
        "id": "D",
        "text": "2 times higher"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Rapid Sand Filter rate = 3000 - 6000 L/hr/m²; Slow Sand Filter = 100 - 200 L/hr/m²",
    "explanation": "Rapid sand filters use coarser sand (effective size 0.45 - 0.70 mm) and operate at filtration rates of 3000 to 6000 L/m²/hr (about 30 times faster than slow sand filters). They require chemical coagulation pretreatment and backwashing.",
    "referenceSource": "Water and Wastewater Technology by Hammer",
    "difficulty": "EASY",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-070",
    "questionNumber": 70,
    "examId": "apsc-ae-civil",
    "subject": "Environmental Engineering",
    "topic": "Disinfection",
    "subtopic": "Breakpoint Chlorination",
    "stem": "In water treatment, 'Breakpoint Chlorination' signifies the point where:",
    "options": [
      {
        "id": "A",
        "text": "All chlorine added is completely absorbed without any residual"
      },
      {
        "id": "B",
        "text": "All combined chlorine (chloramines) and organic matter are oxidized, and free available residual chlorine begins to appear"
      },
      {
        "id": "C",
        "text": "Water pipes break due to high chemical corrosion"
      },
      {
        "id": "D",
        "text": "Chlorine demand reaches infinity"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Breakpoint: Free available chlorine (HOCl + OCl⁻) appears linearly with dosage",
    "explanation": "Up to the breakpoint, applied chlorine is consumed oxidising reducing compounds and forming chloramines. At the dip (breakpoint), chloramines are completely destroyed by oxidation. Beyond breakpoint, added chlorine appears as free residual chlorine (HOCl and OCl⁻).",
    "referenceSource": "Water Supply Engineering by S.K. Garg",
    "difficulty": "MEDIUM",
    "pyqYear": 2023,
    "pyqExam": "Testbook Model / APSC AE Civil 2023"
  },
  {
    "id": "ce-q-071",
    "questionNumber": 71,
    "examId": "apsc-ae-civil",
    "subject": "Environmental Engineering",
    "topic": "Wastewater Characteristics",
    "subtopic": "BOD 5-Day Kinetics",
    "stem": "The 5-day Biochemical Oxygen Demand (BOD5) at 20°C of domestic wastewater is approximately what percentage of its ultimate carbonaceous BOD (L0)?",
    "options": [
      {
        "id": "A",
        "text": "50%"
      },
      {
        "id": "B",
        "text": "68%"
      },
      {
        "id": "C",
        "text": "85%"
      },
      {
        "id": "D",
        "text": "99%"
      }
    ],
    "correctOption": "B",
    "formulaContext": "BOD5 = L0 · (1 - 10^(-k · 5)) ≈ 0.68 · L0 for k = 0.1 day⁻¹ (base 10)",
    "explanation": "Using first-order deoxygenation kinetics with standard deoxygenation constant k = 0.10 day⁻¹ (base 10) at 20°C: BOD5 = L0 · (1 - 10^(-0.1 · 5)) = L0 · (1 - 10^-0.5) = L0 · (1 - 0.316) ≈ 0.684 · L0 (approximately 68%).",
    "referenceSource": "Wastewater Engineering by Metcalf & Eddy",
    "difficulty": "EASY",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-072",
    "questionNumber": 72,
    "examId": "apsc-ae-civil",
    "subject": "Environmental Engineering",
    "topic": "Sewer Design",
    "subtopic": "Self-Cleansing Velocity",
    "stem": "To prevent deposition of suspended solids and silting in sanitary sewers, the minimum self-cleansing velocity recommended is approximately:",
    "options": [
      {
        "id": "A",
        "text": "0.20 to 0.30 m/s"
      },
      {
        "id": "B",
        "text": "0.60 to 0.75 m/s"
      },
      {
        "id": "C",
        "text": "2.5 to 3.0 m/s"
      },
      {
        "id": "D",
        "text": "5.0 m/s"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Vmin = 0.60 - 0.75 m/s; Vmax (non-scouring) = 2.5 - 3.0 m/s",
    "explanation": "A minimum flow velocity of 0.60 m/s at present peak flow (and 0.75 m/s at design full flow) is required to scour silt and organic debris. Maximum velocity is limited to 2.5 - 3.0 m/s to prevent abrasive erosion of sewer pipes.",
    "referenceSource": "Manual on Sewerage & Sewage Treatment (CPHEEO)",
    "difficulty": "EASY",
    "pyqYear": 2023,
    "pyqExam": "Testbook Model / APSC AE Civil 2023"
  },
  {
    "id": "ce-q-073",
    "questionNumber": 73,
    "examId": "apsc-ae-civil",
    "subject": "Environmental Engineering",
    "topic": "Biological Treatment",
    "subtopic": "Activated Sludge Process (ASP) F/M Ratio",
    "stem": "In a conventional Activated Sludge Process (ASP), the food-to-microorganism ratio (F/M ratio) expressed in kg BOD per day per kg MLSS is typically maintained between:",
    "options": [
      {
        "id": "A",
        "text": "0.2 to 0.4"
      },
      {
        "id": "B",
        "text": "0.01 to 0.05"
      },
      {
        "id": "C",
        "text": "1.0 to 2.0"
      },
      {
        "id": "D",
        "text": "5.0 to 10.0"
      }
    ],
    "correctOption": "A",
    "formulaContext": "F/M = (Q · S0) / (V · X) ≈ 0.2 to 0.4 day⁻¹",
    "explanation": "In conventional aeration tanks, F/M ratio is maintained around 0.2 to 0.4 kg BOD/kg MLSS/day with a sludge retention time (sludge age) of 5 to 15 days, ensuring stable bio-oxidation and good sludge settling.",
    "referenceSource": "Wastewater Engineering by Metcalf & Eddy",
    "difficulty": "MEDIUM",
    "pyqYear": 2022,
    "pyqExam": "Testbook Model / APSC AE Civil 2022"
  },
  {
    "id": "ce-q-074",
    "questionNumber": 74,
    "examId": "apsc-ae-civil",
    "subject": "Environmental Engineering",
    "topic": "Onsite Sanitation",
    "subtopic": "Septic Tank Detention Time",
    "stem": "As per IS 2470, the liquid detention period for standard domestic septic tanks is usually designed for:",
    "options": [
      {
        "id": "A",
        "text": "2 to 4 hours"
      },
      {
        "id": "B",
        "text": "12 to 24 hours"
      },
      {
        "id": "C",
        "text": "3 to 5 days"
      },
      {
        "id": "D",
        "text": "7 to 10 days"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Septic tank detention period = 12 - 24 hours",
    "explanation": "IS 2470 recommends a liquid detention time of 12 to 24 hours (commonly 24 hours) to allow solids settling, flotation of scum, and initiation of anaerobic sludge digestion.",
    "referenceSource": "IS 2470 (Part 1):1985 Code of Practice for Septic Tanks",
    "difficulty": "EASY",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-075",
    "questionNumber": 75,
    "examId": "apsc-ae-civil",
    "subject": "Surveying & Geomatics",
    "topic": "Principles of Surveying",
    "subtopic": "Whole to Part Principle",
    "stem": "The fundamental principle of 'working from whole to part' is adopted in surveying primarily to:",
    "options": [
      {
        "id": "A",
        "text": "Distribute work among more surveyors"
      },
      {
        "id": "B",
        "text": "Prevent accumulation of local errors and localize measurement errors"
      },
      {
        "id": "C",
        "text": "Minimize the number of instruments required"
      },
      {
        "id": "D",
        "text": "Survey the perimeter before taking any inside readings"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Working from whole to part localizes errors and prevents catastrophic error propagation",
    "explanation": "By establishing a primary, highly accurate network of major control points covering the entire area first and then filling in minor details, errors occurring in minor measurements remain confined locally and do not magnify.",
    "referenceSource": "Surveying Vol. 1 by B.C. Punmia",
    "difficulty": "EASY",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-076",
    "questionNumber": 76,
    "examId": "apsc-ae-civil",
    "subject": "Surveying & Geomatics",
    "topic": "Linear Measurements",
    "subtopic": "Sag Correction for Tape",
    "stem": "The correction for sag in a surveying tape suspended between two supports is:",
    "options": [
      {
        "id": "A",
        "text": "Always additive (+)"
      },
      {
        "id": "B",
        "text": "Always subtractive (-)"
      },
      {
        "id": "C",
        "text": "Positive or negative depending on pull applied"
      },
      {
        "id": "D",
        "text": "Zero for steel tapes"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Cs = - W² · L / (24 · P²)",
    "explanation": "A suspended tape sags into a catenary curve, so the curved distance along the tape is always longer than the true straight chord distance between supports. The measured distance is too long, so the sag correction is ALWAYS negative (-).",
    "referenceSource": "Surveying Vol. 1 by K.R. Arora",
    "difficulty": "EASY",
    "pyqYear": 2023,
    "pyqExam": "Testbook Model / APSC AE Civil 2023"
  },
  {
    "id": "ce-q-077",
    "questionNumber": 77,
    "examId": "apsc-ae-civil",
    "subject": "Surveying & Geomatics",
    "topic": "Compass Surveying",
    "subtopic": "Local Attraction Detection",
    "stem": "In compass surveying, a line is confirmed to be free from local attraction if the difference between its Fore Bearing (FB) and Back Bearing (BB) is exactly:",
    "options": [
      {
        "id": "A",
        "text": "90°"
      },
      {
        "id": "B",
        "text": "180°"
      },
      {
        "id": "C",
        "text": "270°"
      },
      {
        "id": "D",
        "text": "360°"
      }
    ],
    "correctOption": "B",
    "formulaContext": "|FB - BB| = 180°",
    "explanation": "For any line AB, the back bearing and fore bearing must differ by exactly 180° if both station A and station B are free from magnetic disturbances (local attraction).",
    "referenceSource": "Surveying and Levelling by N.N. Basak",
    "difficulty": "EASY",
    "pyqYear": 2022,
    "pyqExam": "Testbook Model / APSC AE Civil 2022"
  },
  {
    "id": "ce-q-078",
    "questionNumber": 78,
    "examId": "apsc-ae-civil",
    "subject": "Surveying & Geomatics",
    "topic": "Levelling",
    "subtopic": "Arithmetical Checks in Levelling",
    "stem": "Which of the following arithmetical checks is applicable to both Height of Instrument (HI) method and Rise & Fall method of levelling?",
    "options": [
      {
        "id": "A",
        "text": "Σ BS - Σ FS = Last RL - First RL"
      },
      {
        "id": "B",
        "text": "Σ Rise - Σ Fall = Last RL - First RL"
      },
      {
        "id": "C",
        "text": "Σ BS - Σ FS = Σ Rise - Σ Fall = Last RL - First RL"
      },
      {
        "id": "D",
        "text": "Σ IS - Σ FS = Last RL - First RL"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Σ BS - Σ FS = Last RL - First RL (universal check)",
    "explanation": "The check Σ BS - Σ FS = Last RL - First RL applies to both methods. The Rise and Fall method has the complete three-part check: Σ BS - Σ FS = Σ Rise - Σ Fall = Last RL - First RL, making it superior for checking intermediate sights.",
    "referenceSource": "Surveying by Duggal",
    "difficulty": "EASY",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-079",
    "questionNumber": 79,
    "examId": "apsc-ae-civil",
    "subject": "Surveying & Geomatics",
    "topic": "Levelling",
    "subtopic": "Curvature and Refraction Correction",
    "stem": "In precise levelling over a sight distance of d (in km), the combined correction for curvature and refraction (in meters) is given by:",
    "options": [
      {
        "id": "A",
        "text": "C = -0.0673 · d²"
      },
      {
        "id": "B",
        "text": "C = +0.0785 · d²"
      },
      {
        "id": "C",
        "text": "C = -0.0112 · d²"
      },
      {
        "id": "D",
        "text": "C = -0.0562 · d²"
      }
    ],
    "correctOption": "A",
    "formulaContext": "C = Cc + Cr = -0.0785 d² + 0.0112 d² = -0.0673 d² (m)",
    "explanation": "Earth's curvature increases staff reading (Cc = -0.0785 d²), while atmospheric refraction bends light downward decreasing staff reading (Cr = +0.0112 d² = Cc/7). Combined correction is C = -0.0673 d² meters.",
    "referenceSource": "Higher Surveying by A.M. Chandra",
    "difficulty": "EASY",
    "pyqYear": 2023,
    "pyqExam": "Testbook Model / APSC AE Civil 2023"
  },
  {
    "id": "ce-q-080",
    "questionNumber": 80,
    "examId": "apsc-ae-civil",
    "subject": "Surveying & Geomatics",
    "topic": "Contouring",
    "subtopic": "Contour Characteristics",
    "stem": "Contour lines can cross each other only in the rare case of:",
    "options": [
      {
        "id": "A",
        "text": "A vertical cliff"
      },
      {
        "id": "B",
        "text": "An overhanging cliff or a natural cave"
      },
      {
        "id": "C",
        "text": "A ridge line"
      },
      {
        "id": "D",
        "text": "A saddle point"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Contours cross each other ONLY at overhanging cliffs and caves",
    "explanation": "Contour lines can never cross or intersect except in the case of an overhanging cliff or a cave where two different elevations occur at the same plan coordinates. In a vertical cliff, contour lines unite to form a single line.",
    "referenceSource": "Surveying by Punmia",
    "difficulty": "EASY",
    "pyqYear": 2021,
    "pyqExam": "Testbook Model / APSC AE Civil 2021"
  },
  {
    "id": "ce-q-081",
    "questionNumber": 81,
    "examId": "apsc-ae-civil",
    "subject": "Surveying & Geomatics",
    "topic": "Theodolite & Traverse",
    "subtopic": "Bowditch's Rule",
    "stem": "Bowditch's rule for balancing a closed traverse is applied when:",
    "options": [
      {
        "id": "A",
        "text": "Linear measurements and angular measurements are of equal precision"
      },
      {
        "id": "B",
        "text": "Angular measurements are more precise than linear measurements"
      },
      {
        "id": "C",
        "text": "Linear measurements are more precise than angular measurements"
      },
      {
        "id": "D",
        "text": "Only astronomical bearings are observed"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Correction to Latitude = (Total Latitude Error) · (Length of side / Perimeter of traverse)",
    "explanation": "Bowditch's (compass) rule assumes that accidental errors in linear measurements are proportional to √L and in angular measurements are proportional to 1/√L. It balances traverse by distributing errors in latitude and departure proportional to side lengths.",
    "referenceSource": "Surveying Vol. 2 by Punmia",
    "difficulty": "EASY",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-082",
    "questionNumber": 82,
    "examId": "apsc-ae-civil",
    "subject": "Surveying & Geomatics",
    "topic": "Curves",
    "subtopic": "Degree of Curve Definition",
    "stem": "For a 30-meter chord or arc definition, the degree of circular curve (D in degrees) is related to radius of curve (R in meters) by:",
    "options": [
      {
        "id": "A",
        "text": "D = 1718.9 / R"
      },
      {
        "id": "B",
        "text": "D = 1145.9 / R"
      },
      {
        "id": "C",
        "text": "D = 572.9 / R"
      },
      {
        "id": "D",
        "text": "D = 2000 / R"
      }
    ],
    "correctOption": "A",
    "formulaContext": "D = 1718.9 / R (for 30m chain); D = 1145.9 / R (for 20m chain)",
    "explanation": "For an arc length of 30 m: Arc = R · (D · π / 180) => 30 = R · D · 0.017453 => D = 30 / (0.017453 · R) = 1718.87 / R ≈ 1719 / R. For 20m arc, D = 1146 / R.",
    "referenceSource": "Surveying by Kanetkar & Kulkarni",
    "difficulty": "EASY",
    "pyqYear": 2023,
    "pyqExam": "Testbook Model / APSC AE Civil 2023"
  },
  {
    "id": "ce-q-083",
    "questionNumber": 83,
    "examId": "apsc-ae-civil",
    "subject": "Highway & Transportation Engineering",
    "topic": "Highway Planning",
    "subtopic": "Nagpur Road Plan Pattern",
    "stem": "The First 20-Year Road Development Plan (Nagpur Road Plan 1943-1963) recommended which road network pattern for India?",
    "options": [
      {
        "id": "A",
        "text": "Star and Grid pattern"
      },
      {
        "id": "B",
        "text": "Radial and Circular pattern"
      },
      {
        "id": "C",
        "text": "Hexagonal pattern"
      },
      {
        "id": "D",
        "text": "Gridiron pattern"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Target road density = 16 km per 100 sq km area",
    "explanation": "Nagpur Road Congress classified roads into NH, SH, MDR, ODR, and VR, adopting the 'Star and Grid' pattern with an overall target road density of 16 km / 100 km².",
    "referenceSource": "Highway Engineering by Khanna & Justo",
    "difficulty": "EASY",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-084",
    "questionNumber": 84,
    "examId": "apsc-ae-civil",
    "subject": "Highway & Transportation Engineering",
    "topic": "Geometric Design",
    "subtopic": "Stopping Sight Distance (SSD)",
    "stem": "As per IRC guidelines, what is the design perception-reaction time (t) assumed in the calculation of Stopping Sight Distance (SSD) under PIEV theory?",
    "options": [
      {
        "id": "A",
        "text": "2.5 seconds"
      },
      {
        "id": "B",
        "text": "2.0 seconds"
      },
      {
        "id": "C",
        "text": "1.5 seconds"
      },
      {
        "id": "D",
        "text": "0.75 seconds"
      }
    ],
    "correctOption": "A",
    "formulaContext": "SSD = 0.278 · v · t + v² / (254 · f); t = 2.5 s",
    "explanation": "IRC recommends a perception-reaction time of 2.5 seconds for SSD calculations based on PIEV (Perception, Intellection, Emotion, Volition) theory. For Overtaking Sight Distance (OSD), reaction time is taken as 2.0 seconds.",
    "referenceSource": "IRC:73-1980 Geometric Design Standards",
    "difficulty": "EASY",
    "pyqYear": 2023,
    "pyqExam": "Testbook Model / APSC AE Civil 2023"
  },
  {
    "id": "ce-q-085",
    "questionNumber": 85,
    "examId": "apsc-ae-civil",
    "subject": "Highway & Transportation Engineering",
    "topic": "Geometric Design",
    "subtopic": "Super-elevation for Mixed Traffic",
    "stem": "As per IRC recommendations for mixed traffic on plain and rolling terrain, super-elevation (e) is designed by neglecting lateral friction and considering what percentage of design speed (V)?",
    "options": [
      {
        "id": "A",
        "text": "75% of design speed (e = V² / 225 R)"
      },
      {
        "id": "B",
        "text": "100% of design speed (e = V² / 127 R)"
      },
      {
        "id": "C",
        "text": "50% of design speed"
      },
      {
        "id": "D",
        "text": "90% of design speed"
      }
    ],
    "correctOption": "A",
    "formulaContext": "e = (0.75 V)² / (127 R) = V² / (225 R)",
    "explanation": "To accommodate slow-moving bullock carts and fast motor vehicles on Indian roads, IRC designs super-elevation to fully counter centrifugal force at 75% of design speed (f = 0): e = (0.75 V)² / (127 R) = V² / (225 R). Maximum e is capped at 7% for plain/rolling terrain.",
    "referenceSource": "Highway Engineering by Khanna & Justo",
    "difficulty": "EASY",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-086",
    "questionNumber": 86,
    "examId": "apsc-ae-civil",
    "subject": "Highway & Transportation Engineering",
    "topic": "Geometric Design",
    "subtopic": "Maximum Super-elevation Limits",
    "stem": "As per IRC, what is the maximum permissible super-elevation (emax) on horizontal curves in plain and rolling terrain?",
    "options": [
      {
        "id": "A",
        "text": "7.0% (1 in 14.3)"
      },
      {
        "id": "B",
        "text": "10.0% (1 in 10)"
      },
      {
        "id": "C",
        "text": "4.0% (1 in 25)"
      },
      {
        "id": "D",
        "text": "12.0% (1 in 8.3)"
      }
    ],
    "correctOption": "A",
    "formulaContext": "emax = 7% (plain/rolling), 10% (hilly without snow), 4% (urban with frequent intersections)",
    "explanation": "IRC caps super-elevation at 7% (0.07) for plain and rolling terrain. In hilly terrain not bound by snow, it is 10%. In urban areas with frequent intersections, it is limited to 4% to prevent toppling of slow tall vehicles.",
    "referenceSource": "IRC:73 Guidelines",
    "difficulty": "EASY",
    "pyqYear": 2022,
    "pyqExam": "Testbook Model / APSC AE Civil 2022"
  },
  {
    "id": "ce-q-087",
    "questionNumber": 87,
    "examId": "apsc-ae-civil",
    "subject": "Highway & Transportation Engineering",
    "topic": "Geometric Design",
    "subtopic": "Extra Widening on Curves",
    "stem": "The total extra widening (We) required on a two-lane horizontal curve of radius R with wheelbase l and design speed V (in km/h) is:",
    "options": [
      {
        "id": "A",
        "text": "We = (n · l² / (2 · R)) + (V / (9.5 · √R))"
      },
      {
        "id": "B",
        "text": "We = (n · l / (2 · R)) + (V / (225 · R))"
      },
      {
        "id": "C",
        "text": "We = (n · l² / R) + (V / (9.5 · √R))"
      },
      {
        "id": "D",
        "text": "We = n · l² / (2 · R)"
      }
    ],
    "correctOption": "A",
    "formulaContext": "We = Wm + Wps = (n · l² / (2 · R)) + (V / (9.5 · √R))",
    "explanation": "Total extra widening consists of Mechanical widening (off-tracking of rear axle Wm = n l² / 2R) plus Psychological widening (for driver ease and transverse clearances Wps = V / 9.5 √R).",
    "referenceSource": "Highway Engineering by Kadiyali",
    "difficulty": "EASY",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-088",
    "questionNumber": 88,
    "examId": "apsc-ae-civil",
    "subject": "Highway & Transportation Engineering",
    "topic": "Geometric Design",
    "subtopic": "Ideal Transition Curve",
    "stem": "The ideal shape of a transition curve adopted in Indian highway engineering practice is:",
    "options": [
      {
        "id": "A",
        "text": "Clothoid (Euler's Spiral)"
      },
      {
        "id": "B",
        "text": "Cubic Parabola"
      },
      {
        "id": "C",
        "text": "Lemniscate"
      },
      {
        "id": "D",
        "text": "Circular Arc"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Transition curve: Radius R is inversely proportional to length L (L · R = Constant)",
    "explanation": "IRC recommends the Euler spiral (clothoid) because the rate of change of centrifugal acceleration is strictly uniform throughout, and radius decreases linearly with curve length from infinity to circular radius R.",
    "referenceSource": "Highway Engineering by Khanna & Justo",
    "difficulty": "EASY",
    "pyqYear": 2021,
    "pyqExam": "Testbook Model / APSC AE Civil 2021"
  },
  {
    "id": "ce-q-089",
    "questionNumber": 89,
    "examId": "apsc-ae-civil",
    "subject": "Highway & Transportation Engineering",
    "topic": "Pavement Materials",
    "subtopic": "California Bearing Ratio (CBR) Test",
    "stem": "In the standard CBR test on subgrade soil, what is the standard load on crushed stone corresponding to 2.5 mm plunger penetration?",
    "options": [
      {
        "id": "A",
        "text": "1370 kg (13.44 kN)"
      },
      {
        "id": "B",
        "text": "2055 kg (20.15 kN)"
      },
      {
        "id": "C",
        "text": "1000 kg (9.81 kN)"
      },
      {
        "id": "D",
        "text": "3000 kg (29.43 kN)"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Standard load at 2.5 mm = 1370 kg (70 kg/cm²); Standard load at 5.0 mm = 2055 kg (105 kg/cm²)",
    "explanation": "CBR (%) = (Test load / Standard load) · 100. The standard loads on high quality crushed stone are 1370 kg for 2.5 mm penetration and 2055 kg for 5.0 mm penetration. Usually CBR at 2.5 mm is higher and taken as design CBR.",
    "referenceSource": "IS 2720 (Part 16) CBR Test Code",
    "difficulty": "MEDIUM",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-090",
    "questionNumber": 90,
    "examId": "apsc-ae-civil",
    "subject": "Highway & Transportation Engineering",
    "topic": "Pavement Design",
    "subtopic": "Flexible vs Rigid Pavements",
    "stem": "Wheel load stresses in a flexible pavement are transferred to underlying layers predominantly through:",
    "options": [
      {
        "id": "A",
        "text": "Grain-to-grain contact pressure distribution"
      },
      {
        "id": "B",
        "text": "Slab flexural bending action"
      },
      {
        "id": "C",
        "text": "Shear membrane action only"
      },
      {
        "id": "D",
        "text": "Tension in bitumen layers"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Flexible pavement: Grain-to-grain contact; Rigid pavement: Slab flexural rigidity",
    "explanation": "Flexible pavements distribute concentrated wheel loads downward over larger areas through inter-granular particle contact and friction, reducing stress intensity. Rigid pavements (PQC) carry loads through flexural slab action.",
    "referenceSource": "IRC:37-2018 Guidelines for Flexible Pavement Design",
    "difficulty": "EASY",
    "pyqYear": 2023,
    "pyqExam": "Testbook Model / APSC AE Civil 2023"
  },
  {
    "id": "ce-q-091",
    "questionNumber": 91,
    "examId": "apsc-ae-civil",
    "subject": "Design of Steel Structures",
    "topic": "General Design Requirements",
    "subtopic": "Partial Safety Factors in IS 800:2007",
    "stem": "As per IS 800:2007 Table 5, the partial safety factor for material strength against yielding (γm0) and against ultimate tensile strength (γm1) are:",
    "options": [
      {
        "id": "A",
        "text": "1.10 and 1.25 respectively"
      },
      {
        "id": "B",
        "text": "1.15 and 1.50 respectively"
      },
      {
        "id": "C",
        "text": "1.25 and 1.10 respectively"
      },
      {
        "id": "D",
        "text": "1.00 and 1.25 respectively"
      }
    ],
    "correctOption": "A",
    "formulaContext": "γm0 = 1.10 (yielding); γm1 = 1.25 (ultimate tension / rupture)",
    "explanation": "Per IS 800:2007 Table 5, resistance governed by yielding of cross-section uses γm0 = 1.10; resistance governed by ultimate rupture at net section uses γm1 = 1.25; shop welds use γmw = 1.25, and field welds use γmw = 1.50.",
    "referenceSource": "IS 800:2007 Table 5",
    "difficulty": "EASY",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-092",
    "questionNumber": 92,
    "examId": "apsc-ae-civil",
    "subject": "Design of Steel Structures",
    "topic": "Tension Members",
    "subtopic": "Net Section Rupture & Shear Lag",
    "stem": "When a single angle tension member is connected to a gusset plate by only one leg, the phenomenon causing non-uniform stress distribution across the angle section is known as:",
    "options": [
      {
        "id": "A",
        "text": "Shear lag effect"
      },
      {
        "id": "B",
        "text": "P-Delta effect"
      },
      {
        "id": "C",
        "text": "Wobble effect"
      },
      {
        "id": "D",
        "text": "Poisson expansion"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Tdn = 0.9 · Anc · fu / γm1 + β · Ago · fy / γm0 (IS 800 Cl. 6.3.3)",
    "explanation": "Because tensile load is transferred through the connected leg, the outstanding leg does not participate fully at the connection. The resulting non-uniform tensile stress concentration is called the 'Shear Lag Effect'.",
    "referenceSource": "Design of Steel Structures by S.K. Duggal",
    "difficulty": "EASY",
    "pyqYear": 2023,
    "pyqExam": "Testbook Model / APSC AE Civil 2023"
  },
  {
    "id": "ce-q-093",
    "questionNumber": 93,
    "examId": "apsc-ae-civil",
    "subject": "Design of Steel Structures",
    "topic": "Compression Members",
    "subtopic": "Maximum Slenderness Ratio Limits",
    "stem": "As per IS 800:2007 Table 3, what is the maximum permissible slenderness ratio (λ = kL/r) for a member carrying compressive loads resulting from dead loads and superimposed live loads?",
    "options": [
      {
        "id": "A",
        "text": "180"
      },
      {
        "id": "B",
        "text": "250"
      },
      {
        "id": "C",
        "text": "300"
      },
      {
        "id": "D",
        "text": "350"
      }
    ],
    "correctOption": "A",
    "formulaContext": "λmax = 180 (Dead Load + Imposed Load compression)",
    "explanation": "IS 800 Table 3 specifies: A member carrying compressive loads from dead loads and imposed loads shall have slenderness ratio λ ≤ 180. For wind/earthquake compression, λ ≤ 250. For members acting solely in tension (hangers), λ ≤ 400.",
    "referenceSource": "IS 800:2007 Table 3",
    "difficulty": "EASY",
    "pyqYear": 2022,
    "pyqExam": "Testbook Model / APSC AE Civil 2022"
  },
  {
    "id": "ce-q-094",
    "questionNumber": 94,
    "examId": "apsc-ae-civil",
    "subject": "Design of Steel Structures",
    "topic": "Welded Connections",
    "subtopic": "Effective Throat Thickness of Fillet Weld",
    "stem": "For a standard fillet weld with an angle between fusion faces of 90°, the effective throat thickness (t) is related to leg size (s) by:",
    "options": [
      {
        "id": "A",
        "text": "t = 0.70 · s"
      },
      {
        "id": "B",
        "text": "t = 0.50 · s"
      },
      {
        "id": "C",
        "text": "t = 0.60 · s"
      },
      {
        "id": "D",
        "text": "t = 1.00 · s"
      }
    ],
    "correctOption": "A",
    "formulaContext": "t = k · s, where k = 0.70 for 60°-90° fusion angle",
    "explanation": "Per IS 800:2007 Clause 10.5.3, effective throat thickness is t = k · s. For angles between fusion faces: 60°-90°: k = 0.70; 91°-100°: k = 0.65; 101°-106°: k = 0.60; 107°-113°: k = 0.55; 114°-120°: k = 0.50.",
    "referenceSource": "IS 800:2007 Cl. 10.5.3",
    "difficulty": "EASY",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-095",
    "questionNumber": 95,
    "examId": "apsc-ae-civil",
    "subject": "Design of Steel Structures",
    "topic": "Bolted Connections",
    "subtopic": "Minimum Pitch and Edge Distance",
    "stem": "As per IS 800:2007, the minimum pitch distance between centers of fasteners shall not be less than:",
    "options": [
      {
        "id": "A",
        "text": "2.5 times the nominal diameter of fastener (2.5 d)"
      },
      {
        "id": "B",
        "text": "1.5 times the diameter"
      },
      {
        "id": "C",
        "text": "3.0 times the diameter"
      },
      {
        "id": "D",
        "text": "50 mm"
      }
    ],
    "correctOption": "A",
    "formulaContext": "pmin = 2.5 · d",
    "explanation": "Clause 10.2.2 of IS 800 specifies that the distance between centers of fasteners (pitch) shall not be less than 2.5 times the nominal diameter of the fastener to avoid bearing failure between adjacent holes.",
    "referenceSource": "IS 800:2007 Cl. 10.2.2",
    "difficulty": "EASY",
    "pyqYear": 2021,
    "pyqExam": "Testbook Model / APSC AE Civil 2021"
  },
  {
    "id": "ce-q-096",
    "questionNumber": 96,
    "examId": "apsc-ae-civil",
    "subject": "Building Materials & Construction Management",
    "topic": "Cement & Concrete",
    "subtopic": "Bogue Compounds Hydration",
    "stem": "Which Bogue compound in Portland cement is responsible for early strength development within the first 7 to 14 days?",
    "options": [
      {
        "id": "A",
        "text": "Tricalcium Silicate (C3S - Alite)"
      },
      {
        "id": "B",
        "text": "Dicalcium Silicate (C2S - Belite)"
      },
      {
        "id": "C",
        "text": "Tricalcium Aluminate (C3A - Celite)"
      },
      {
        "id": "D",
        "text": "Tetracalcium Aluminoferrite (C4AF - Felite)"
      }
    ],
    "correctOption": "A",
    "formulaContext": "C3S imparts early strength; C2S imparts progressive late strength after 28 days",
    "explanation": "C3S (Alite, 3CaO·SiO2) hydrates rapidly and contributes to early strength up to 14 days. C2S hydrates slowly and imparts progressive long-term strength. C3A causes flash setting and produces the highest heat of hydration.",
    "referenceSource": "Concrete Technology by M.S. Shetty",
    "difficulty": "EASY",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-097",
    "questionNumber": 97,
    "examId": "apsc-ae-civil",
    "subject": "Building Materials & Construction Management",
    "topic": "Cement Testing",
    "subtopic": "Setting Times of OPC per IS 4031",
    "stem": "As per Indian Standards, the initial and final setting times for Ordinary Portland Cement (OPC) shall be:",
    "options": [
      {
        "id": "A",
        "text": "Not less than 30 minutes and not more than 600 minutes (10 hours)"
      },
      {
        "id": "B",
        "text": "Not less than 60 minutes and not more than 300 minutes"
      },
      {
        "id": "C",
        "text": "Not less than 15 minutes and not more than 120 minutes"
      },
      {
        "id": "D",
        "text": "Not less than 45 minutes and not more than 720 minutes"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Initial setting ≥ 30 mins; Final setting ≤ 600 mins (10 hrs) (Vicat apparatus)",
    "explanation": "Per IS 269 and IS 4031: Initial setting time (measured with 1 mm square needle) must be ≥ 30 minutes. Final setting time (measured with annular collar needle) must be ≤ 600 minutes (10 hours).",
    "referenceSource": "IS 269:2015 Specification for OPC",
    "difficulty": "EASY",
    "pyqYear": 2023,
    "pyqExam": "Testbook Model / APSC AE Civil 2023"
  },
  {
    "id": "ce-q-098",
    "questionNumber": 98,
    "examId": "apsc-ae-civil",
    "subject": "Building Materials & Construction Management",
    "topic": "Concrete Technology",
    "subtopic": "Workability Measurement",
    "stem": "For very low workability concrete (such as stiff dry mixes used for road roller-compacted concrete), the most appropriate test is:",
    "options": [
      {
        "id": "A",
        "text": "Vee-Bee consistometer test"
      },
      {
        "id": "B",
        "text": "Slump cone test"
      },
      {
        "id": "C",
        "text": "Compacting factor test"
      },
      {
        "id": "D",
        "text": "Flow table test"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Very low workability: Vee-Bee test (time in seconds); High workability: Slump test",
    "explanation": "Slump test is unreliable for dry/lean mixes. Compacting factor test is suitable for low-to-medium workability. Vee-Bee consistometer measures the time (in seconds) required for vibration to transform a conical slump into a flat surface, ideal for stiff dry mixes.",
    "referenceSource": "Concrete Technology by Gambhir",
    "difficulty": "MEDIUM",
    "pyqYear": 2022,
    "pyqExam": "Testbook Model / APSC AE Civil 2022"
  },
  {
    "id": "ce-q-099",
    "questionNumber": 99,
    "examId": "apsc-ae-civil",
    "subject": "Building Materials & Construction Management",
    "topic": "Network Analysis (CPM/PERT)",
    "subtopic": "Expected Time Duration in PERT",
    "stem": "In PERT analysis, given optimistic time (to), most likely time (tm), and pessimistic time (tp), the expected activity time (te) assuming a Beta distribution is:",
    "options": [
      {
        "id": "A",
        "text": "te = (to + 4 · tm + tp) / 6"
      },
      {
        "id": "B",
        "text": "te = (to + tm + tp) / 3"
      },
      {
        "id": "C",
        "text": "te = (to + 2 · tm + tp) / 4"
      },
      {
        "id": "D",
        "text": "te = (to + 6 · tm + tp) / 8"
      }
    ],
    "correctOption": "A",
    "formulaContext": "te = (to + 4 · tm + tp) / 6; Variance σ² = ((tp - to) / 6)²",
    "explanation": "PERT assumes a Beta probability distribution for activity duration. The weighted mean is te = (to + 4 tm + tp) / 6, and standard deviation is σ = (tp - to) / 6.",
    "referenceSource": "Project Management with CPM/PERT by Punmia & Khandelwal",
    "difficulty": "EASY",
    "pyqYear": 2024,
    "pyqExam": "Testbook Model / APSC AE Civil 2024"
  },
  {
    "id": "ce-q-100",
    "questionNumber": 100,
    "examId": "apsc-ae-civil",
    "subject": "Building Materials & Construction Management",
    "topic": "CPM Project Scheduling",
    "subtopic": "Total Float Definition",
    "stem": "In Critical Path Method (CPM), the 'Total Float' of an activity represents:",
    "options": [
      {
        "id": "A",
        "text": "The maximum time by which an activity can be delayed without delaying project completion date"
      },
      {
        "id": "B",
        "text": "The time by which an activity can be delayed without delaying the start of succeeding activity"
      },
      {
        "id": "C",
        "text": "The float that affects preceding activities only"
      },
      {
        "id": "D",
        "text": "The minimum contingency reserve duration"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Total Float = LFT - EFT = LST - EST; Free Float = EST(j) - EFT(ij)",
    "explanation": "Total Float is the total margin of time available to delay an activity without extending the project completion deadline. Free float delays neither the project nor succeeding activities. Critical activities have Total Float = 0.",
    "referenceSource": "Construction Planning & Management by U.K. Shrivastava",
    "difficulty": "EASY",
    "pyqYear": 2023,
    "pyqExam": "Testbook Model / APSC AE Civil 2023"
  }
];
