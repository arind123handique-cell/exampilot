import type { MCQQuestion } from '../types';

/**
 * EXAMVEDA SOIL MECHANICS & FOUNDATION ENGINEERING QUESTION BANK
 * Sourced directly from https://www.examveda.com/civil-engineering/practice-mcq-question-on-soil-mechanics-and-foundation/
 * Covers Permeability, Seepage, Consolidation, Shear Strength, Earth Pressure, Bearing Capacity, and Piles.
 */
export const EXAMVEDA_SOIL_QUESTIONS: MCQQuestion[] = [
  {
    "id": "ev-soil-001",
    "questionNumber": 1,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Permeability & Seepage",
    "subtopic": "Flow Nets & Darcy Flow",
    "stem": "The hydraulic head that would produce a quick condition in a sand stratum of thickness 1.5 m, specific gravity 2.67 and voids ratio 0.67 is equal to",
    "options": [
      {
        "id": "A",
        "text": "1.0m"
      },
      {
        "id": "B",
        "text": "1.5m"
      },
      {
        "id": "C",
        "text": "2.0m"
      },
      {
        "id": "D",
        "text": "3m"
      }
    ],
    "correctOption": "B",
    "formulaContext": "icr = (G - 1) / (1 + e) = γ_sub / γ_w",
    "explanation": "According to standard Soil Mechanics principles (icr = (G - 1) / (1 + e) = γ_sub / γ_w), Option (B) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "NUMERICAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2024
  },
  {
    "id": "ev-soil-002",
    "questionNumber": 2,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Consolidation & Settlement",
    "subtopic": "Terzaghi 1D Consolidation",
    "stem": "Clay layer A with single drainage and coefficient of consolidation Cv takes 6 months to achieve 50% consolidation. The time taken by clay layer B of the same thickness with double drainage and coefficient of consolidation Cv/2 to achieve the same degree of consolidation is",
    "options": [
      {
        "id": "A",
        "text": "3 months"
      },
      {
        "id": "B",
        "text": "6 months"
      },
      {
        "id": "C",
        "text": "12 months"
      },
      {
        "id": "D",
        "text": "24 months"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Tv = (Cv · t) / d²",
    "explanation": "According to standard Soil Mechanics principles (Tv = (Cv · t) / d²), Option (A) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "NUMERICAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2023
  },
  {
    "id": "ev-soil-003",
    "questionNumber": 3,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Consolidation & Settlement",
    "subtopic": "Terzaghi 1D Consolidation",
    "stem": "Degree of consolidation is",
    "options": [
      {
        "id": "A",
        "text": "directly proportional to time and inversely proportional to drainage path"
      },
      {
        "id": "B",
        "text": "directly proportional to time and inversely proportional to square of drainage path"
      },
      {
        "id": "C",
        "text": "directly proportional to drainage path and inversely proportional to time"
      },
      {
        "id": "D",
        "text": "directly proportional to square of drainage path and inversely proportional to time"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "Solution: The degree of consolidation in soil mechanics is a measure of how much a soil sample has consolidated over time due to applied pressure. It is directly proportional to time because the consolidation process continues as time progresses. It is inversely proportional to the square of the drainage path because longer drainage paths result in slower consolidation. Therefore, Option B correctly describes the relationship between the degree of consolidation, time, and drainage path.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2022
  },
  {
    "id": "ev-soil-004",
    "questionNumber": 4,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Compaction & Field Control",
    "subtopic": "Compaction Curves & Relative Density",
    "stem": "Select the correct range of density index, I_D (density index)",
    "options": [
      {
        "id": "A",
        "text": "I_D (density index) > 0"
      },
      {
        "id": "B",
        "text": "I_D (density index) >= 0"
      },
      {
        "id": "C",
        "text": "0 < I_D (density index) < 1"
      },
      {
        "id": "D",
        "text": "0 <= I_D (density index) <= 1"
      }
    ],
    "correctOption": "D",
    "formulaContext": "ID = (emax - e) / (emax - emin) · 100%",
    "explanation": "According to standard Soil Mechanics principles (ID = (emax - e) / (emax - emin) · 100%), Option (D) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2021
  },
  {
    "id": "ev-soil-005",
    "questionNumber": 5,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "For a loose sand sample and a dense sand sample consolidated to the same effective stress",
    "options": [
      {
        "id": "A",
        "text": "ultimate strength is same and also peak strength is same"
      },
      {
        "id": "B",
        "text": "ultimate strength is different but peak strength is same"
      },
      {
        "id": "C",
        "text": "ultimate strength is same but peak strength of dense sand is greater than that of loose sand"
      },
      {
        "id": "D",
        "text": "ultimate strength is same but peak"
      }
    ],
    "correctOption": "C",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (C) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2020
  },
  {
    "id": "ev-soil-006",
    "questionNumber": 6,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Consolidation & Settlement",
    "subtopic": "Terzaghi 1D Consolidation",
    "stem": "Within the consolidation process of a saturated clay",
    "options": [
      {
        "id": "A",
        "text": "a gradual increase in neutral pressure and a gradual decrease in effective pressure takes place and sum of the two is constant"
      },
      {
        "id": "B",
        "text": "a gradual decrease in neutral pressure and a gradual increase in effective pressure takes place and sum of the two is constant"
      },
      {
        "id": "C",
        "text": "both neutral pressure and effective pressure decrease"
      },
      {
        "id": "D",
        "text": "both neutral pressure and effective pressure increase"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "Solution: Understanding Consolidation in Saturated Clay: Imagine squeezing a sponge soaked in water. The water needs time to escape. Consolidation is similar; it's the process of water slowly leaving saturated clay under pressure. Neutral pressure is the pressure of the water in the soil pores. Effective pressure is the pressure that the soil particles themselves carry. During consolidation, the total pressure stays the same. It's like the total amount of water in the sponge plus the sponge itself. As the water escapes (reducing neutral pressure), the soil particles take on more of the load (increasing effective pressure). Therefore, the sum of neutral pressure and effective pressure remains constant. The Correct Answer: Based on the above explanation, option B is correct. It accurately describes the reduction in neutral pressure and corresponding increase in effective pressure during consolidation, while maintaining a constant sum.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "HARD",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2024
  },
  {
    "id": "ev-soil-007",
    "questionNumber": 7,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Shallow Foundations & Bearing Capacity",
    "subtopic": "Terzaghi Bearing Capacity",
    "stem": "Rise of water table in cohesionless soils upto ground surface reduces the net ultimate bearing capacity approximately by",
    "options": [
      {
        "id": "A",
        "text": "25%"
      },
      {
        "id": "B",
        "text": "50%"
      },
      {
        "id": "C",
        "text": "75%"
      },
      {
        "id": "D",
        "text": "90%"
      }
    ],
    "correctOption": "B",
    "formulaContext": "qult = c·Nc + q·Nq + 0.5·γ·B·Nγ",
    "explanation": "According to standard Soil Mechanics principles (qult = c·Nc + q·Nq + 0.5·γ·B·Nγ), Option (B) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2023
  },
  {
    "id": "ev-soil-008",
    "questionNumber": 8,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Shallow Foundations & Bearing Capacity",
    "subtopic": "Terzaghi Bearing Capacity",
    "stem": "Terzaghi’s bearing capacity factors N_c, N_q and N_γ are functions of",
    "options": [
      {
        "id": "A",
        "text": "cohesion only"
      },
      {
        "id": "B",
        "text": "angle of internal friction only"
      },
      {
        "id": "C",
        "text": "both cohesion and angle of internal friction"
      },
      {
        "id": "D",
        "text": "none of the above"
      }
    ],
    "correctOption": "B",
    "formulaContext": "qult = c·Nc + q·Nq + 0.5·γ·B·Nγ",
    "explanation": "According to standard Soil Mechanics principles (qult = c·Nc + q·Nq + 0.5·γ·B·Nγ), Option (B) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2022
  },
  {
    "id": "ev-soil-009",
    "questionNumber": 9,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Phase Relations & Soil Properties",
    "subtopic": "Three Phase System (e, n, w, S, G)",
    "stem": "Valid range for S, the degree of saturation of soil in percentage is",
    "options": [
      {
        "id": "A",
        "text": "S > 0"
      },
      {
        "id": "B",
        "text": "S < 0"
      },
      {
        "id": "C",
        "text": "0 < S < 100"
      },
      {
        "id": "D",
        "text": "0 <= S <= 100"
      }
    ],
    "correctOption": "D",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (D) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2021
  },
  {
    "id": "ev-soil-010",
    "questionNumber": 10,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Classification & Atterberg Limits",
    "subtopic": "Atterberg Consistency Limits",
    "stem": "If the natural water content of soil mass lies between its liquid limit and plastic limit, the soil mass is said to be in",
    "options": [
      {
        "id": "A",
        "text": "liquid state"
      },
      {
        "id": "B",
        "text": "plastic state"
      },
      {
        "id": "C",
        "text": "semi-solid state"
      },
      {
        "id": "D",
        "text": "solid state"
      }
    ],
    "correctOption": "B",
    "formulaContext": "S · e = w · G ; γd = γ / (1 + w) = (G · γw) / (1 + e)",
    "explanation": "According to standard Soil Mechanics principles (S · e = w · G ; γd = γ / (1 + w) = (G · γw) / (1 + e)), Option (B) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2020
  },
  {
    "id": "ev-soil-011",
    "questionNumber": 11,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Permeability & Seepage",
    "subtopic": "Flow Nets & Darcy Flow",
    "stem": "The flownet for an earthen dam with 30 m water depth consists of 25 potential drops and 5 flow channels. The coefficient of permeability of dam material is 0.03 mm/sec. The discharge per meter length of dam is",
    "options": [
      {
        "id": "A",
        "text": "0.00018 m³ /sec"
      },
      {
        "id": "B",
        "text": "0.0045 m³ /sec"
      },
      {
        "id": "C",
        "text": "0.18 m³ /sec"
      },
      {
        "id": "D",
        "text": "0.1125 m³ /sec"
      }
    ],
    "correctOption": "A",
    "formulaContext": "q = k · H · (Nf / Nd)",
    "explanation": "According to standard Soil Mechanics principles (q = k · H · (Nf / Nd)), Option (A) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "NUMERICAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2024
  },
  {
    "id": "ev-soil-012",
    "questionNumber": 12,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Permeability & Seepage",
    "subtopic": "Flow Nets & Darcy Flow",
    "stem": "The average coefficient of permeability of natural deposits",
    "options": [
      {
        "id": "A",
        "text": "Parallel to stratification is always greater than that perpendicular to stratification"
      },
      {
        "id": "B",
        "text": "Parallel to stratification is always less than that perpendicular to stratification"
      },
      {
        "id": "C",
        "text": "Is always same in both directions"
      },
      {
        "id": "D",
        "text": "Parallel to stratification may or may not be greater than that perpendicular to stratification"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (A) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2023
  },
  {
    "id": "ev-soil-013",
    "questionNumber": 13,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Phase Relations & Soil Properties",
    "subtopic": "Three Phase System (e, n, w, S, G)",
    "stem": "For proper field control, which of the following methods is best suited for quick determination of water content of a soil mass ?",
    "options": [
      {
        "id": "A",
        "text": "oven drying method"
      },
      {
        "id": "B",
        "text": "sand bath method"
      },
      {
        "id": "C",
        "text": "alcohol method"
      },
      {
        "id": "D",
        "text": "calcium carbide method"
      }
    ],
    "correctOption": "D",
    "formulaContext": "S · e = w · G ; γd = γ / (1 + w) = (G · γw) / (1 + e)",
    "explanation": "According to standard Soil Mechanics principles (S · e = w · G ; γd = γ / (1 + w) = (G · γw) / (1 + e)), Option (D) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2022
  },
  {
    "id": "ev-soil-014",
    "questionNumber": 14,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Permeability & Seepage",
    "subtopic": "Flow Nets & Darcy Flow",
    "stem": "Which of the following methods is more suitable for the determination of permeability of clayey soil ?",
    "options": [
      {
        "id": "A",
        "text": "constant head method"
      },
      {
        "id": "B",
        "text": "falling head method"
      },
      {
        "id": "C",
        "text": "horizontal permeability test"
      },
      {
        "id": "D",
        "text": "none of the above"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (B) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2021
  },
  {
    "id": "ev-soil-015",
    "questionNumber": 15,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Phase Relations & Soil Properties",
    "subtopic": "Three Phase System (e, n, w, S, G)",
    "stem": "If the water content of a fully saturated soil mass is 100%, then the voids ratio of the sample is",
    "options": [
      {
        "id": "A",
        "text": "less than specific gravity of soil"
      },
      {
        "id": "B",
        "text": "equal to specific gravity of soil"
      },
      {
        "id": "C",
        "text": "greater than specific gravity of soil"
      },
      {
        "id": "D",
        "text": "independent of specific gravity of soil"
      }
    ],
    "correctOption": "B",
    "formulaContext": "S · e = w · G ; γd = γ / (1 + w) = (G · γw) / (1 + e)",
    "explanation": "According to standard Soil Mechanics principles (S · e = w · G ; γd = γ / (1 + w) = (G · γw) / (1 + e)), Option (B) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "FORMULA_RECALL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2020
  },
  {
    "id": "ev-soil-016",
    "questionNumber": 16,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Clay Mineralogy & Soil Structure",
    "subtopic": "Mineral Lattice & Microstructure",
    "stem": "Dispersed type of soil structure is an arrangement comprising particles having",
    "options": [
      {
        "id": "A",
        "text": "face to face or parallel orientation"
      },
      {
        "id": "B",
        "text": "edge to edge orientation"
      },
      {
        "id": "C",
        "text": "edge to face orientation"
      },
      {
        "id": "D",
        "text": "all of the above"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (A) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "HARD",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2024
  },
  {
    "id": "ev-soil-017",
    "questionNumber": 17,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Permeability & Seepage",
    "subtopic": "Flow Nets & Darcy Flow",
    "stem": "Physical properties of a permeant which influence permeability are",
    "options": [
      {
        "id": "A",
        "text": "viscosity only"
      },
      {
        "id": "B",
        "text": "unit weight only"
      },
      {
        "id": "C",
        "text": "both viscosity and unit weight"
      },
      {
        "id": "D",
        "text": "none of the above"
      }
    ],
    "correctOption": "C",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (C) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2023
  },
  {
    "id": "ev-soil-018",
    "questionNumber": 18,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Shear Strength of Soil",
    "subtopic": "Mohr-Coulomb Failure Criterion",
    "stem": "A cylindrical specimen of saturated soil failed under an axial vertical stress of 100 kN/m² when it was laterally un-confmed. The failure plane was inclined to the horizontal plane at an angle of 45°. The values of cohesion and angle of internal friction for the soil are respectively",
    "options": [
      {
        "id": "A",
        "text": "0.5 N/mm² and 30°"
      },
      {
        "id": "B",
        "text": "0.05 N/mm² and 0°"
      },
      {
        "id": "C",
        "text": "0.2 N/mm² and 0°"
      },
      {
        "id": "D",
        "text": "0.05 N/mm² and 45°"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (B) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "NUMERICAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2022
  },
  {
    "id": "ev-soil-019",
    "questionNumber": 19,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Phase Relations & Soil Properties",
    "subtopic": "Three Phase System (e, n, w, S, G)",
    "stem": "If the volume of voids is equal to the volume of solids in a soil mass, then the values of porosity and voids ratio respectively are",
    "options": [
      {
        "id": "A",
        "text": "1.0 and 0.0"
      },
      {
        "id": "B",
        "text": "0.0 and 1.0"
      },
      {
        "id": "C",
        "text": "0.5 and 1.0"
      },
      {
        "id": "D",
        "text": "1.0 and 0.5"
      }
    ],
    "correctOption": "C",
    "formulaContext": "S · e = w · G ; γd = γ / (1 + w) = (G · γw) / (1 + e)",
    "explanation": "According to standard Soil Mechanics principles (S · e = w · G ; γd = γ / (1 + w) = (G · γw) / (1 + e)), Option (C) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "NUMERICAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2021
  },
  {
    "id": "ev-soil-020",
    "questionNumber": 20,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "Unconfmed compressive strength test is",
    "options": [
      {
        "id": "A",
        "text": "undrained test"
      },
      {
        "id": "B",
        "text": "drained test"
      },
      {
        "id": "C",
        "text": "consolidated undrained test"
      },
      {
        "id": "D",
        "text": "consolidated drained test"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (A) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2020
  },
  {
    "id": "ev-soil-021",
    "questionNumber": 21,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Shear Strength of Soil",
    "subtopic": "Mohr-Coulomb Failure Criterion",
    "stem": "In a triaxial compression test when drainage is allowed during the first stage (i. e. application of cell pressure) only and not during the second stage (i.e. application of deviator stress at constant cell pressure), the test is known as",
    "options": [
      {
        "id": "A",
        "text": "consolidated drained test"
      },
      {
        "id": "B",
        "text": "consolidated undrained test"
      },
      {
        "id": "C",
        "text": "unconsolidated drained test"
      },
      {
        "id": "D",
        "text": "unconsolidated undrained test"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (B) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2024
  },
  {
    "id": "ev-soil-022",
    "questionNumber": 22,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Consolidation & Settlement",
    "subtopic": "Terzaghi 1D Consolidation",
    "stem": "A normally consolidated clay settled 10 mm when effective stress was increased from 100 kN/m² to 200 kN/m² . If the effective stress is further increased from²00 kN/m² to 400 kN/m² , then the settlement of the same clay is",
    "options": [
      {
        "id": "A",
        "text": "10 mm"
      },
      {
        "id": "B",
        "text": "20 mm"
      },
      {
        "id": "C",
        "text": "40 mm"
      },
      {
        "id": "D",
        "text": "none of the above"
      }
    ],
    "correctOption": "A",
    "formulaContext": "ΔH = H0 · [Cc / (1 + e0)] · log10(σ1' / σ0')",
    "explanation": "According to standard Soil Mechanics principles (ΔH = H0 · [Cc / (1 + e0)] · log10(σ1' / σ0')), Option (A) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "NUMERICAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2023
  },
  {
    "id": "ev-soil-023",
    "questionNumber": 23,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "The total discharge from two wells situated near to each other is",
    "options": [
      {
        "id": "A",
        "text": "sum of the discharges from individual wells"
      },
      {
        "id": "B",
        "text": "less than the sum of the discharges from individual wells"
      },
      {
        "id": "C",
        "text": "greater than the sum of the discharges from individual wells"
      },
      {
        "id": "D",
        "text": "equal to larger of the two discharges from individual wells"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (B) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2022
  },
  {
    "id": "ev-soil-024",
    "questionNumber": 24,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Permeability & Seepage",
    "subtopic": "Flow Nets & Darcy Flow",
    "stem": "Direct measurement of permeability of the specimen at any stage of loading can be made",
    "options": [
      {
        "id": "A",
        "text": "only in fixed ring type consolido-meter"
      },
      {
        "id": "B",
        "text": "only in floating ring type consolido-meter"
      },
      {
        "id": "C",
        "text": "both (A) and (B)"
      },
      {
        "id": "D",
        "text": "none of the above"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (A) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2021
  },
  {
    "id": "ev-soil-025",
    "questionNumber": 25,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Shallow Foundations & Bearing Capacity",
    "subtopic": "Terzaghi Bearing Capacity",
    "stem": "The rise of water table below the foundation influences the bearing capacity of soil mainly by reducing",
    "options": [
      {
        "id": "A",
        "text": "cohesion and effective angle of shearing resistance"
      },
      {
        "id": "B",
        "text": "cohesion and effective unit weight of soil"
      },
      {
        "id": "C",
        "text": "effective unit weight of soil and effective angle of shearing resistance"
      },
      {
        "id": "D",
        "text": "effective angle of shearing resistance"
      }
    ],
    "correctOption": "B",
    "formulaContext": "qult = c·Nc + q·Nq + 0.5·γ·B·Nγ",
    "explanation": "According to standard Soil Mechanics principles (qult = c·Nc + q·Nq + 0.5·γ·B·Nγ), Option (B) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2020
  },
  {
    "id": "ev-soil-026",
    "questionNumber": 26,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Earth Pressure & Retaining Walls",
    "subtopic": "Rankine and Coulomb Theories",
    "stem": "A retaining wall 6m high supports a backfill with a surcharge angle of 10°. The back of the wall is inclined to the vertical at a positive batter angle of 5°. If the angle of wall friction is 7°, then the resultant active earth pressure will act at a distance of 2 m above the base and inclined to the horizontal at an angle of",
    "options": [
      {
        "id": "A",
        "text": "7°"
      },
      {
        "id": "B",
        "text": "10°"
      },
      {
        "id": "C",
        "text": "12°"
      },
      {
        "id": "D",
        "text": "17°"
      }
    ],
    "correctOption": "C",
    "formulaContext": "Ka = (1 - sin φ) / (1 + sin φ) ; Kp = (1 + sin φ) / (1 - sin φ)",
    "explanation": "According to standard Soil Mechanics principles (Ka = (1 - sin φ) / (1 + sin φ) ; Kp = (1 + sin φ) / (1 - sin φ)), Option (C) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "HARD",
    "sourceType": "MODELLED",
    "questionType": "NUMERICAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2024
  },
  {
    "id": "ev-soil-027",
    "questionNumber": 27,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "The total and effective stresses at a depth of 5 m below the top level of water in a swimming pool are respectively",
    "options": [
      {
        "id": "A",
        "text": "Zero and zero"
      },
      {
        "id": "B",
        "text": "0.5 kg/cm² and zero"
      },
      {
        "id": "C",
        "text": "0.5 kg/cm² and 0.5 kg/cm²"
      },
      {
        "id": "D",
        "text": "1.0 kg/cm² and 0.5 kg/cm²"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (B) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "NUMERICAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2023
  },
  {
    "id": "ev-soil-028",
    "questionNumber": 28,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Permeability & Seepage",
    "subtopic": "Flow Nets & Darcy Flow",
    "stem": "Due to a rise in temperature, the viscosity and the unit weight of the percolating fluid are reduced to 60% and 90% respectively. If other things remain constant, the coefficient of permeability",
    "options": [
      {
        "id": "A",
        "text": "increases by 25%"
      },
      {
        "id": "B",
        "text": "increases by 50%"
      },
      {
        "id": "C",
        "text": "increases by 33.3%"
      },
      {
        "id": "D",
        "text": "decreases by 33.3%"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (B) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2022
  },
  {
    "id": "ev-soil-029",
    "questionNumber": 29,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Classification & Atterberg Limits",
    "subtopic": "Atterberg Consistency Limits",
    "stem": "At liquid limit, all soils possess",
    "options": [
      {
        "id": "A",
        "text": "same shear strength of small magnitude"
      },
      {
        "id": "B",
        "text": "same shear strength of large magnitude"
      },
      {
        "id": "C",
        "text": "different shear strengths of small magnitude"
      },
      {
        "id": "D",
        "text": "different shear strengths of large magnitude"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (A) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2021
  },
  {
    "id": "ev-soil-030",
    "questionNumber": 30,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "Sensitivity of a soil can be defined as",
    "options": [
      {
        "id": "A",
        "text": "percentage of volume change of soil under saturated condition"
      },
      {
        "id": "B",
        "text": "ratio of compressive strength of unconfined undisturbed soil to that of soil in a remoulded state"
      },
      {
        "id": "C",
        "text": "ratio of volume of voids to volume of solids"
      },
      {
        "id": "D",
        "text": "none of the above"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (B) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2020
  },
  {
    "id": "ev-soil-031",
    "questionNumber": 31,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "Valid range for n, the percentage voids, is",
    "options": [
      {
        "id": "A",
        "text": "0 < n < 100"
      },
      {
        "id": "B",
        "text": "0 <= n <= 100"
      },
      {
        "id": "C",
        "text": "n > 0"
      },
      {
        "id": "D",
        "text": "n < 0"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (A) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2024
  },
  {
    "id": "ev-soil-032",
    "questionNumber": 32,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Earth Pressure & Retaining Walls",
    "subtopic": "Rankine and Coulomb Theories",
    "stem": "Rankine’s theory of earth pressure assumes that the back of the wall is",
    "options": [
      {
        "id": "A",
        "text": "plane and smooth"
      },
      {
        "id": "B",
        "text": "plane and rough"
      },
      {
        "id": "C",
        "text": "vertical and smooth"
      },
      {
        "id": "D",
        "text": "vertical and rough"
      }
    ],
    "correctOption": "C",
    "formulaContext": "Ka = (1 - sin φ) / (1 + sin φ) ; Kp = (1 + sin φ) / (1 - sin φ)",
    "explanation": "According to standard Soil Mechanics principles (Ka = (1 - sin φ) / (1 + sin φ) ; Kp = (1 + sin φ) / (1 - sin φ)), Option (C) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2023
  },
  {
    "id": "ev-soil-033",
    "questionNumber": 33,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "The most suitable method for drainage of fine grained cohesive soils is",
    "options": [
      {
        "id": "A",
        "text": "well ppint system"
      },
      {
        "id": "B",
        "text": "vacuum method"
      },
      {
        "id": "C",
        "text": "deep well system"
      },
      {
        "id": "D",
        "text": "electroosmosis method"
      }
    ],
    "correctOption": "D",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (D) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2022
  },
  {
    "id": "ev-soil-034",
    "questionNumber": 34,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Compaction & Field Control",
    "subtopic": "Compaction Curves & Relative Density",
    "stem": "With the increase in the amount of compaction energy",
    "options": [
      {
        "id": "A",
        "text": "optimum water content increases but maximum dry density decreases"
      },
      {
        "id": "B",
        "text": "optimum water content decreases but maximum dry density increases"
      },
      {
        "id": "C",
        "text": "both optimum water content and maximum dry density increase"
      },
      {
        "id": "D",
        "text": "both optimum water content and maximum dry density decrease[ES 93]"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (B) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2021
  },
  {
    "id": "ev-soil-035",
    "questionNumber": 35,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "In a deposit of normally consolidated clay",
    "options": [
      {
        "id": "A",
        "text": "effective stress increases with depth but water content of soil and un-drained strength decrease with depth"
      },
      {
        "id": "B",
        "text": "effective stress and water content increase with depth but undrained strength decreases with depth"
      },
      {
        "id": "C",
        "text": "effective stress and undrained strength increase with depth but water content decreases with depth"
      },
      {
        "id": "D",
        "text": "effective stress, water content and undrained strength decrease with depth"
      }
    ],
    "correctOption": "C",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (C) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2020
  },
  {
    "id": "ev-soil-036",
    "questionNumber": 36,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Phase Relations & Soil Properties",
    "subtopic": "Three Phase System (e, n, w, S, G)",
    "stem": "Which of the following methods is most accurate for the determination of the water content of soil ?",
    "options": [
      {
        "id": "A",
        "text": "oven drying method"
      },
      {
        "id": "B",
        "text": "sand bath method"
      },
      {
        "id": "C",
        "text": "calcium carbide method"
      },
      {
        "id": "D",
        "text": "pycnometer method"
      }
    ],
    "correctOption": "A",
    "formulaContext": "S · e = w · G ; γd = γ / (1 + w) = (G · γw) / (1 + e)",
    "explanation": "According to standard Soil Mechanics principles (S · e = w · G ; γd = γ / (1 + w) = (G · γw) / (1 + e)), Option (A) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "HARD",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2024
  },
  {
    "id": "ev-soil-037",
    "questionNumber": 37,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Compaction & Field Control",
    "subtopic": "Compaction Curves & Relative Density",
    "stem": "The maximum dry density upto which any soil can be compacted depends upon",
    "options": [
      {
        "id": "A",
        "text": "moisture content only"
      },
      {
        "id": "B",
        "text": "amount of compaction energy only"
      },
      {
        "id": "C",
        "text": "both moisture content and amount of compaction energy"
      },
      {
        "id": "D",
        "text": "none of the above"
      }
    ],
    "correctOption": "C",
    "formulaContext": "S · e = w · G ; γd = γ / (1 + w) = (G · γw) / (1 + e)",
    "explanation": "According to standard Soil Mechanics principles (S · e = w · G ; γd = γ / (1 + w) = (G · γw) / (1 + e)), Option (C) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2023
  },
  {
    "id": "ev-soil-038",
    "questionNumber": 38,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Classification & Atterberg Limits",
    "subtopic": "Atterberg Consistency Limits",
    "stem": "Toughness index is defined as the ratio of",
    "options": [
      {
        "id": "A",
        "text": "plasticity index to consistency index"
      },
      {
        "id": "B",
        "text": "plasticity index to flow index"
      },
      {
        "id": "C",
        "text": "liquidity index to flow index"
      },
      {
        "id": "D",
        "text": "consistency index to liquidity index"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (B) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "FORMULA_RECALL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2022
  },
  {
    "id": "ev-soil-039",
    "questionNumber": 39,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Consolidation & Settlement",
    "subtopic": "Terzaghi 1D Consolidation",
    "stem": "The value of compression index for a remoulded sample whose liquid limit is 50% is",
    "options": [
      {
        "id": "A",
        "text": "0.028"
      },
      {
        "id": "B",
        "text": "0.28"
      },
      {
        "id": "C",
        "text": "0.36"
      },
      {
        "id": "D",
        "text": "0.036"
      }
    ],
    "correctOption": "B",
    "formulaContext": "ΔH = H0 · [Cc / (1 + e0)] · log10(σ1' / σ0')",
    "explanation": "According to standard Soil Mechanics principles (ΔH = H0 · [Cc / (1 + e0)] · log10(σ1' / σ0')), Option (B) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2021
  },
  {
    "id": "ev-soil-040",
    "questionNumber": 40,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Compaction & Field Control",
    "subtopic": "Compaction Curves & Relative Density",
    "stem": "For better strength and stability, the fine grained soils and coarse grained soils are compacted respectively as",
    "options": [
      {
        "id": "A",
        "text": "dry of OMC and wet of OMC"
      },
      {
        "id": "B",
        "text": "wet of OMC and dry of OMC"
      },
      {
        "id": "C",
        "text": "wet of OMC and wet of OMC"
      },
      {
        "id": "D",
        "text": "dry of OMC and dry of OMC where OMC is optimum moisture content"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (B) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2020
  },
  {
    "id": "ev-soil-041",
    "questionNumber": 41,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Permeability & Seepage",
    "subtopic": "Flow Nets & Darcy Flow",
    "stem": "If the permeability of a soil is 0.8 mm/sec, the type of soil is",
    "options": [
      {
        "id": "A",
        "text": "gravel"
      },
      {
        "id": "B",
        "text": "sand"
      },
      {
        "id": "C",
        "text": "silt"
      },
      {
        "id": "D",
        "text": "clay"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (B) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "NUMERICAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2024
  },
  {
    "id": "ev-soil-042",
    "questionNumber": 42,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Shear Strength of Soil",
    "subtopic": "Mohr-Coulomb Failure Criterion",
    "stem": "A tri-axial shear test is preferred to direct shear test, because",
    "options": [
      {
        "id": "A",
        "text": "It can be performed under all three drainage conditions with complete control"
      },
      {
        "id": "B",
        "text": "Precise measurement of pore pressure and change in volume during test, is not possible"
      },
      {
        "id": "C",
        "text": "Stress distribution on the failure plane, is non uniform"
      },
      {
        "id": "D",
        "text": "None of these"
      }
    ],
    "correctOption": "A",
    "formulaContext": "τf = c' + σ' tan φ' ; qu = 2 · cu (for φ = 0)",
    "explanation": "According to standard Soil Mechanics principles (τf = c' + σ' tan φ' ; qu = 2 · cu (for φ = 0)), Option (A) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2023
  },
  {
    "id": "ev-soil-043",
    "questionNumber": 43,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Shallow Foundations & Bearing Capacity",
    "subtopic": "Terzaghi Bearing Capacity",
    "stem": "Contact pressure beneath a rigid footing resting on cohesive soil is",
    "options": [
      {
        "id": "A",
        "text": "less at edges compared to middle"
      },
      {
        "id": "B",
        "text": "more at edges compared to middle"
      },
      {
        "id": "C",
        "text": "uniform throughout"
      },
      {
        "id": "D",
        "text": "none of the above"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (B) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2022
  },
  {
    "id": "ev-soil-044",
    "questionNumber": 44,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Shear Strength of Soil",
    "subtopic": "Mohr-Coulomb Failure Criterion",
    "stem": "Select the incorrect statement. Effective angle of shearing resistance",
    "options": [
      {
        "id": "A",
        "text": "increases as the size of particles increases"
      },
      {
        "id": "B",
        "text": "increases as the soil gradation im-proves"
      },
      {
        "id": "C",
        "text": "is limited to a maximum value of 45°"
      },
      {
        "id": "D",
        "text": "is rarely more than 30° for fine grained soil"
      }
    ],
    "correctOption": "C",
    "formulaContext": "τf = c' + σ' tan φ' ; qu = 2 · cu (for φ = 0)",
    "explanation": "According to standard Soil Mechanics principles (τf = c' + σ' tan φ' ; qu = 2 · cu (for φ = 0)), Option (C) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "ASSERTION_REASON",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2021
  },
  {
    "id": "ev-soil-045",
    "questionNumber": 45,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Permeability & Seepage",
    "subtopic": "Flow Nets & Darcy Flow",
    "stem": "Which of the following methods is best suited for determination of permeability of coarse-grained soils ?",
    "options": [
      {
        "id": "A",
        "text": "constant head method"
      },
      {
        "id": "B",
        "text": "falling head method"
      },
      {
        "id": "C",
        "text": "both the above"
      },
      {
        "id": "D",
        "text": "none of the above"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (A) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2020
  },
  {
    "id": "ev-soil-046",
    "questionNumber": 46,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Compaction & Field Control",
    "subtopic": "Compaction Curves & Relative Density",
    "stem": "If the sand in-situ is in its densest state, then the relative density of sand is",
    "options": [
      {
        "id": "A",
        "text": "zero"
      },
      {
        "id": "B",
        "text": "1"
      },
      {
        "id": "C",
        "text": "between 0 and 1"
      },
      {
        "id": "D",
        "text": "greater than 1"
      }
    ],
    "correctOption": "B",
    "formulaContext": "ID = (emax - e) / (emax - emin) · 100%",
    "explanation": "Solution: Relative Density is like a special scale that tells us how \"compact\" or \"dense\" sand is. It's a very important property for sandy soils (soils without much clay) because it helps engineers know how stable the soil is. This special scale for Relative Density goes from 0 to 1 , representing the two extreme states of sand packing: 1. Zero (0): If the sand is in its absolute loosest state . This means the sand particles are as spread out as possible, with the maximum amount of empty space (voids) between them. In this scenario, the Relative Density is 0 . 2. One (1): If the sand is in its absolute densest state . This means the sand particles are packed together as tightly as possible, with the minimum amount of empty space (voids) between them. In this scenario, the Relative Density is 1 . 3. Between 0 and 1: If the sand is in any state somewhere between the loosest and densest conditions (which is typically what we find in nature), then its Relative Density will be a value between 0 and 1 (e.g., 0.3, 0.6, 0.8, etc.). Now, let's look at our question: \"If the sand in-situ is in its densest state ...\" The question clearly states that the sand is already in its most densely packed possible state . As we just learned, when sand is in this extreme densest condition, its Relative Density is 1 . Therefore, the correct answer is Option B: 1 .",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "HARD",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2024
  },
  {
    "id": "ev-soil-047",
    "questionNumber": 47,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Phase Relations & Soil Properties",
    "subtopic": "Three Phase System (e, n, w, S, G)",
    "stem": "A soil has a bulk density of 22 kN/m³ and water content 10%. The dry density of soil is",
    "options": [
      {
        "id": "A",
        "text": "18.6 kN/m³"
      },
      {
        "id": "B",
        "text": "20.0 kN/m³"
      },
      {
        "id": "C",
        "text": "22.0 kN/m³"
      },
      {
        "id": "D",
        "text": "23.2 kN/m³"
      }
    ],
    "correctOption": "B",
    "formulaContext": "S · e = w · G ; γd = γ / (1 + w) = (G · γw) / (1 + e)",
    "explanation": "According to standard Soil Mechanics principles (S · e = w · G ; γd = γ / (1 + w) = (G · γw) / (1 + e)), Option (B) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "NUMERICAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2023
  },
  {
    "id": "ev-soil-048",
    "questionNumber": 48,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Earth Pressure & Retaining Walls",
    "subtopic": "Rankine and Coulomb Theories",
    "stem": "Coefficient of earth pressure at rest is",
    "options": [
      {
        "id": "A",
        "text": "less than active earth pressure but greater than passive earth pressure"
      },
      {
        "id": "B",
        "text": "greater than active earth pressure but less than passive earth pressure"
      },
      {
        "id": "C",
        "text": "greater than both the active earth pressure and passive earth pressure"
      },
      {
        "id": "D",
        "text": "less than both the active and passive earth pressures"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Ka = (1 - sin φ) / (1 + sin φ) ; Kp = (1 + sin φ) / (1 - sin φ)",
    "explanation": "According to standard Soil Mechanics principles (Ka = (1 - sin φ) / (1 + sin φ) ; Kp = (1 + sin φ) / (1 - sin φ)), Option (B) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2022
  },
  {
    "id": "ev-soil-049",
    "questionNumber": 49,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Classification & Atterberg Limits",
    "subtopic": "Atterberg Consistency Limits",
    "stem": "When the plastic limit of a soil is greater than the liquid limit, then the plasticity index is reported as",
    "options": [
      {
        "id": "A",
        "text": "negative"
      },
      {
        "id": "B",
        "text": "zero"
      },
      {
        "id": "C",
        "text": "non-plastic (NP)"
      },
      {
        "id": "D",
        "text": "1"
      }
    ],
    "correctOption": "C",
    "formulaContext": "IP = wL - wP ; IT = IP / IF",
    "explanation": "Solution: Option A: negative This option is incorrect. The plasticity index cannot be negative. It is either zero or non-plastic (NP) in such cases. Option B: zero This option is incorrect. Zero is used when the plastic limit is equal to the liquid limit, not when it is greater. Option C: non-plastic (NP) This is the correct option. When the plastic limit exceeds the liquid limit, the soil is considered non-plastic, and the plasticity index is reported as NP. Option D: 1 This option is incorrect. The plasticity index is not arbitrarily set to 1 in any standard soil mechanics context. In conclusion, the correct answer is Option C: non-plastic (NP) , as this correctly represents the condition when the plastic limit is greater than the liquid limit in soil mechanics.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2021
  },
  {
    "id": "ev-soil-050",
    "questionNumber": 50,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Phase Relations & Soil Properties",
    "subtopic": "Three Phase System (e, n, w, S, G)",
    "stem": "Voids ratio of a soil mass can",
    "options": [
      {
        "id": "A",
        "text": "never be greater than unity"
      },
      {
        "id": "B",
        "text": "be zero"
      },
      {
        "id": "C",
        "text": "take any value greater than zero"
      },
      {
        "id": "D",
        "text": "take values between 0 and 1 only"
      }
    ],
    "correctOption": "C",
    "formulaContext": "S · e = w · G ; γd = γ / (1 + w) = (G · γw) / (1 + e)",
    "explanation": "According to standard Soil Mechanics principles (S · e = w · G ; γd = γ / (1 + w) = (G · γw) / (1 + e)), Option (C) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "FORMULA_RECALL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2020
  },
  {
    "id": "ev-soil-051",
    "questionNumber": 51,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "Effective stress is",
    "options": [
      {
        "id": "A",
        "text": "the stress at particles contact"
      },
      {
        "id": "B",
        "text": "a physical parameter that can be measured"
      },
      {
        "id": "C",
        "text": "important because it is a function of engineering properties of soil"
      },
      {
        "id": "D",
        "text": "all of the above"
      }
    ],
    "correctOption": "D",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "Solution: Effective stress: It is the stress transmitted through soil particles at their points of contact. This is critical in understanding the behavior of soils under load. A physical parameter that can be measured: Effective stress is a measurable quantity calculated as the total stress minus pore water pressure. Importance: Effective stress is a key parameter because it governs the engineering properties of soil, such as shear strength, compressibility, and permeability. Since all the statements are correct, Option D: all of the above is the correct answer.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2024
  },
  {
    "id": "ev-soil-052",
    "questionNumber": 52,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Shallow Foundations & Bearing Capacity",
    "subtopic": "Terzaghi Bearing Capacity",
    "stem": "In the plate loading test for determining the bearing capacity of soil, the size of square bearing plate should be",
    "options": [
      {
        "id": "A",
        "text": "less than 300 mm"
      },
      {
        "id": "B",
        "text": "between 300 mm and 750 mm"
      },
      {
        "id": "C",
        "text": "between 750 mm and 1 m"
      },
      {
        "id": "D",
        "text": "greater than 1 m"
      }
    ],
    "correctOption": "B",
    "formulaContext": "qult = c·Nc + q·Nq + 0.5·γ·B·Nγ",
    "explanation": "According to standard Soil Mechanics principles (qult = c·Nc + q·Nq + 0.5·γ·B·Nγ), Option (B) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2023
  },
  {
    "id": "ev-soil-053",
    "questionNumber": 53,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Classification & Atterberg Limits",
    "subtopic": "Atterberg Consistency Limits",
    "stem": "The clay mineral with the largest swelling and shrinkage characteristics is",
    "options": [
      {
        "id": "A",
        "text": "kaolinite"
      },
      {
        "id": "B",
        "text": "illite"
      },
      {
        "id": "C",
        "text": "montmorillonite"
      },
      {
        "id": "D",
        "text": "none of the above"
      }
    ],
    "correctOption": "C",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (C) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2022
  },
  {
    "id": "ev-soil-054",
    "questionNumber": 54,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Classification & Atterberg Limits",
    "subtopic": "Atterberg Consistency Limits",
    "stem": "If the material of the base of the Casagrande liquid limit device on which the cup containing soil paste drops is softer than the standard hard rubber, then",
    "options": [
      {
        "id": "A",
        "text": "The liquid limit of soil always increases"
      },
      {
        "id": "B",
        "text": "The liquid limit of soil always decreases"
      },
      {
        "id": "C",
        "text": "The liquid limit of soil may increase"
      },
      {
        "id": "D",
        "text": "The liquid limit of soil may decrease"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (A) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2021
  },
  {
    "id": "ev-soil-055",
    "questionNumber": 55,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Classification & Atterberg Limits",
    "subtopic": "Atterberg Consistency Limits",
    "stem": "According to Atterberg, the soil is said to be of medium plasticity if the plasticity index PI is",
    "options": [
      {
        "id": "A",
        "text": "0 < PI < 7"
      },
      {
        "id": "B",
        "text": "7< PI < 17"
      },
      {
        "id": "C",
        "text": "17 < PI < 27"
      },
      {
        "id": "D",
        "text": "PI > 27"
      }
    ],
    "correctOption": "B",
    "formulaContext": "IP = wL - wP ; IT = IP / IF",
    "explanation": "Solution: According to Atterberg, the soil is said to be of medium plasticity if the plasticity index (PI) is 7 < PI < 17 . The plasticity index (PI) is a measure of the plasticity of a soil and is calculated as the difference between the liquid limit (LL) and the plastic limit (PL). Soils with a PI between 7 and 17 are considered to have medium plasticity. This range indicates moderate changes in consistency with changes in moisture content. Therefore, the correct option is 7 < PI < 17 .",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2020
  },
  {
    "id": "ev-soil-056",
    "questionNumber": 56,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "Which of the following is a measure of particle size range ?",
    "options": [
      {
        "id": "A",
        "text": "effective size"
      },
      {
        "id": "B",
        "text": "uniformity coefficient"
      },
      {
        "id": "C",
        "text": "coefficient of curvature"
      },
      {
        "id": "D",
        "text": "none of the above"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (B) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "HARD",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2024
  },
  {
    "id": "ev-soil-057",
    "questionNumber": 57,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "Sand particles are made of",
    "options": [
      {
        "id": "A",
        "text": "rock minerals"
      },
      {
        "id": "B",
        "text": "kaolinite"
      },
      {
        "id": "C",
        "text": "illite"
      },
      {
        "id": "D",
        "text": "montmorillonite"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "Solution: Sand particles are made of rock minerals. Sand primarily consists of small fragments of weathered rock and minerals, predominantly quartz, which is a durable and resistant mineral. Kaolinite, illite, and montmorillonite are types of clay minerals, which are much finer in particle size compared to sand and have different properties and compositions. Therefore, the correct answer is that sand particles are composed of rock minerals.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2023
  },
  {
    "id": "ev-soil-058",
    "questionNumber": 58,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "Uniformity coefficient of a soil is",
    "options": [
      {
        "id": "A",
        "text": "always less than 1"
      },
      {
        "id": "B",
        "text": "always equal to 1"
      },
      {
        "id": "C",
        "text": "equal to or less than 1"
      },
      {
        "id": "D",
        "text": "equal to or gi eater than 1"
      }
    ],
    "correctOption": "D",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (D) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2022
  },
  {
    "id": "ev-soil-059",
    "questionNumber": 59,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Consolidation & Settlement",
    "subtopic": "Terzaghi 1D Consolidation",
    "stem": "Coefficient of consolidation of a soil is affected by",
    "options": [
      {
        "id": "A",
        "text": "compressibility"
      },
      {
        "id": "B",
        "text": "permeability"
      },
      {
        "id": "C",
        "text": "both compressibility and permeability"
      },
      {
        "id": "D",
        "text": "none of the above"
      }
    ],
    "correctOption": "C",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "Solution: The coefficient of consolidation of a soil is affected by both compressibility and permeability. The coefficient of consolidation ( C v ​) is a measure used in soil mechanics to describe how fast a soil consolidates under load. Compressibility influences how much volume change occurs in the soil when a load is applied. Permeability determines the rate at which water can flow through the soil pores, affecting how quickly excess pore water pressure dissipates. Therefore, the coefficient of consolidation is dependent on both these properties, making Option C the correct answer.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2021
  },
  {
    "id": "ev-soil-060",
    "questionNumber": 60,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "The ratio of volume of voids to the total volume of soil mass is called",
    "options": [
      {
        "id": "A",
        "text": "air content"
      },
      {
        "id": "B",
        "text": "porosity"
      },
      {
        "id": "C",
        "text": "percentage air voids"
      },
      {
        "id": "D",
        "text": "voids ratio"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (B) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "FORMULA_RECALL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2020
  },
  {
    "id": "ev-soil-061",
    "questionNumber": 61,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "A grillage foundation",
    "options": [
      {
        "id": "A",
        "text": "Is provided for heavily loaded isolated columns"
      },
      {
        "id": "B",
        "text": "Is treated as spread foundation"
      },
      {
        "id": "C",
        "text": "Consists of two sets of perpendicularly placed steel beams"
      },
      {
        "id": "D",
        "text": "All the above"
      }
    ],
    "correctOption": "D",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (D) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2024
  },
  {
    "id": "ev-soil-062",
    "questionNumber": 62,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "Residual soils are formed by",
    "options": [
      {
        "id": "A",
        "text": "glaciers"
      },
      {
        "id": "B",
        "text": "wind"
      },
      {
        "id": "C",
        "text": "water"
      },
      {
        "id": "D",
        "text": "none of the above"
      }
    ],
    "correctOption": "D",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "Solution: Residual soils are formed by the weathering and decomposition of rocks at the same place where they originally existed . They remain at their place of formation and are not transported by external agents. Agents such as glaciers, wind, and water are responsible for transporting soils from one location to another, producing transported soils rather than residual soils. Therefore, residual soils are not formed by glaciers, wind, or water , making Option D the correct answer.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2023
  },
  {
    "id": "ev-soil-063",
    "questionNumber": 63,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Consolidation & Settlement",
    "subtopic": "Terzaghi 1D Consolidation",
    "stem": "A 600 mm square bearing plate settles by 15 mm in plate load test on a cohesionless soil under an intensity of loading of 0.2 N/ram² . The settlement of a prototype shallow footing 1 m square under the same intensity of loading is",
    "options": [
      {
        "id": "A",
        "text": "15 mm"
      },
      {
        "id": "B",
        "text": "Between 15 mm and 25 mm"
      },
      {
        "id": "C",
        "text": "25 mm"
      },
      {
        "id": "D",
        "text": "Greater than 25 mm"
      }
    ],
    "correctOption": "B",
    "formulaContext": "ΔH = H0 · [Cc / (1 + e0)] · log10(σ1' / σ0')",
    "explanation": "According to standard Soil Mechanics principles (ΔH = H0 · [Cc / (1 + e0)] · log10(σ1' / σ0')), Option (B) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "NUMERICAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2022
  },
  {
    "id": "ev-soil-064",
    "questionNumber": 64,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Consolidation & Settlement",
    "subtopic": "Terzaghi 1D Consolidation",
    "stem": "A 300 mm square bearing plate settles by 15 mm in a plate load test on a cohesive soil when the intensity of loading is 0.2 N/mm² . The settlement of a prototype shallow footing 1 m square under the same intensity of loading is",
    "options": [
      {
        "id": "A",
        "text": "15 mm"
      },
      {
        "id": "B",
        "text": "30 mm"
      },
      {
        "id": "C",
        "text": "50 mm"
      },
      {
        "id": "D",
        "text": "167 mm"
      }
    ],
    "correctOption": "C",
    "formulaContext": "ΔH = H0 · [Cc / (1 + e0)] · log10(σ1' / σ0')",
    "explanation": "According to standard Soil Mechanics principles (ΔH = H0 · [Cc / (1 + e0)] · log10(σ1' / σ0')), Option (C) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "NUMERICAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2021
  },
  {
    "id": "ev-soil-065",
    "questionNumber": 65,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Earth Pressure & Retaining Walls",
    "subtopic": "Rankine and Coulomb Theories",
    "stem": "The angle that Coulomb’s failure envelope makes with the horizontal is called",
    "options": [
      {
        "id": "A",
        "text": "cohesion"
      },
      {
        "id": "B",
        "text": "angle of internal friction"
      },
      {
        "id": "C",
        "text": "angle of repose"
      },
      {
        "id": "D",
        "text": "none of the above"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (B) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2020
  },
  {
    "id": "ev-soil-066",
    "questionNumber": 66,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "Which one of the following clays behaves like a dense sand ?",
    "options": [
      {
        "id": "A",
        "text": "over-consolidated ciay with a high over-consolidation ratio"
      },
      {
        "id": "B",
        "text": "over-consolidated clay with a low over-consolidation ratio"
      },
      {
        "id": "C",
        "text": "normally consolidated clay"
      },
      {
        "id": "D",
        "text": "under-consolidated clay"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (A) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "HARD",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2024
  },
  {
    "id": "ev-soil-067",
    "questionNumber": 67,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Classification & Atterberg Limits",
    "subtopic": "Atterberg Consistency Limits",
    "stem": "Which of the following soils has more plasticity index ?",
    "options": [
      {
        "id": "A",
        "text": "sand"
      },
      {
        "id": "B",
        "text": "silt"
      },
      {
        "id": "C",
        "text": "clay"
      },
      {
        "id": "D",
        "text": "gravel"
      }
    ],
    "correctOption": "C",
    "formulaContext": "IP = wL - wP ; IT = IP / IF",
    "explanation": "According to standard Soil Mechanics principles (IP = wL - wP ; IT = IP / IF), Option (C) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2023
  },
  {
    "id": "ev-soil-068",
    "questionNumber": 68,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "The admixture of coarser particles like sand or silt to clay causes",
    "options": [
      {
        "id": "A",
        "text": "decrease in liquid limit and increase in plasticity index"
      },
      {
        "id": "B",
        "text": "decrease in liquid limit and no change in plasticity index"
      },
      {
        "id": "C",
        "text": "decrease in both liquid limit and plasticity index"
      },
      {
        "id": "D",
        "text": "increase in both liquid limit and plasticity index"
      }
    ],
    "correctOption": "C",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (C) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2022
  },
  {
    "id": "ev-soil-069",
    "questionNumber": 69,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Permeability & Seepage",
    "subtopic": "Flow Nets & Darcy Flow",
    "stem": "Coefficient of permeability of soil",
    "options": [
      {
        "id": "A",
        "text": "does not depend upon temperature"
      },
      {
        "id": "B",
        "text": "increases with the increase in temperature"
      },
      {
        "id": "C",
        "text": "increases with the decrease in temperature"
      },
      {
        "id": "D",
        "text": "none of the above"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (B) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2021
  },
  {
    "id": "ev-soil-070",
    "questionNumber": 70,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Consolidation & Settlement",
    "subtopic": "Terzaghi 1D Consolidation",
    "stem": "The ultimate consolidation settlement of a soil is",
    "options": [
      {
        "id": "A",
        "text": "directly proportional to the voids ratio"
      },
      {
        "id": "B",
        "text": "directly proportional to the compression index"
      },
      {
        "id": "C",
        "text": "inversely proportional to the compression index"
      },
      {
        "id": "D",
        "text": "none of the above"
      }
    ],
    "correctOption": "B",
    "formulaContext": "ΔH = H0 · [Cc / (1 + e0)] · log10(σ1' / σ0')",
    "explanation": "According to standard Soil Mechanics principles (ΔH = H0 · [Cc / (1 + e0)] · log10(σ1' / σ0')), Option (B) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2020
  },
  {
    "id": "ev-soil-071",
    "questionNumber": 71,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "Which of the following statements is correct?",
    "options": [
      {
        "id": "A",
        "text": "Uniformity coefficient represents the shape of the particle size distribution curve."
      },
      {
        "id": "B",
        "text": "For a well graded soil, both uniformity coefficient and coefficient of curvature are nearly unity."
      },
      {
        "id": "C",
        "text": "A soil is said to be well graded if it has most of the particles of about the same size"
      },
      {
        "id": "D",
        "text": "none of the above"
      }
    ],
    "correctOption": "D",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (D) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "ASSERTION_REASON",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2024
  },
  {
    "id": "ev-soil-072",
    "questionNumber": 72,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Shear Strength of Soil",
    "subtopic": "Mohr-Coulomb Failure Criterion",
    "stem": "In a consolidated drained test on a normally consolidated clay, the volume of the soil sample during shear",
    "options": [
      {
        "id": "A",
        "text": "decreases"
      },
      {
        "id": "B",
        "text": "increases"
      },
      {
        "id": "C",
        "text": "remains unchanged"
      },
      {
        "id": "D",
        "text": "first increases and then decreases"
      }
    ],
    "correctOption": "A",
    "formulaContext": "τf = c' + σ' tan φ' ; qu = 2 · cu (for φ = 0)",
    "explanation": "Solution: The correct answer is (A) decreases. Here's why: A consolidated drained (CD) test means we're testing a soil that is: * Consolidated: The soil has been compressed and excess pore water pressure has dissipated. * Drained: Water is allowed to escape freely during the shearing process. A normally consolidated clay is a clay that has never experienced a stress greater than its current stress. When a normally consolidated clay is sheared under drained conditions, the soil particles tend to rearrange themselves into a denser configuration. This rearrangement and compression of the soil structure causes the overall volume of the soil sample to decrease . Because water is allowed to drain, this volume change can occur. Therefore, the answer is decreases .",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2023
  },
  {
    "id": "ev-soil-073",
    "questionNumber": 73,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Shear Strength of Soil",
    "subtopic": "Mohr-Coulomb Failure Criterion",
    "stem": "The effect of cohesion on a soil is to",
    "options": [
      {
        "id": "A",
        "text": "reduce both the active earth pressure intensity and passive earth pressure intensity"
      },
      {
        "id": "B",
        "text": "increase both the active earth pressure intensity and passive earth pressure intensity"
      },
      {
        "id": "C",
        "text": "reduce the active earth pressure in-tensity but to increase the passive earth pressure intensity"
      },
      {
        "id": "D",
        "text": "increase the active earth pressure in-tensity but to reduce the passive earth pressure intensity [GATE 99]"
      }
    ],
    "correctOption": "C",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (C) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2022
  },
  {
    "id": "ev-soil-074",
    "questionNumber": 74,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "The hydrometer method of sedimentation analysis differs from the pipette analysis mainly in",
    "options": [
      {
        "id": "A",
        "text": "the principle of test"
      },
      {
        "id": "B",
        "text": "the method of taking observations"
      },
      {
        "id": "C",
        "text": "the method of preparation of soil suspension"
      },
      {
        "id": "D",
        "text": "all of the above"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (B) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2021
  },
  {
    "id": "ev-soil-075",
    "questionNumber": 75,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "Rise of water table above the ground surface causes",
    "options": [
      {
        "id": "A",
        "text": "Equal increase in pore water pressure and total stress"
      },
      {
        "id": "B",
        "text": "Equal decrease in pore water pressure and total stress"
      },
      {
        "id": "C",
        "text": "Increase in pore water pressure but decrease in total stress"
      },
      {
        "id": "D",
        "text": "Decrease in pore water pressure but increase in total stress"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (A) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2020
  },
  {
    "id": "ev-soil-076",
    "questionNumber": 76,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Shear Strength of Soil",
    "subtopic": "Mohr-Coulomb Failure Criterion",
    "stem": "Shear strength of a soil is a unique function of",
    "options": [
      {
        "id": "A",
        "text": "effective stress only"
      },
      {
        "id": "B",
        "text": "total stress only"
      },
      {
        "id": "C",
        "text": "both effective stress and total stress"
      },
      {
        "id": "D",
        "text": "none of the above"
      }
    ],
    "correctOption": "C",
    "formulaContext": "τf = c' + σ' tan φ' ; qu = 2 · cu (for φ = 0)",
    "explanation": "Solution: In soil mechanics, the shear strength of a soil is a unique function of both effective stress and total stress . The shear strength of soil depends on both the effective stress and the total stress acting on the soil mass. Effective stress refers to the stress carried by the soil grains themselves, while total stress includes the stress carried by both the soil grains and the pore water. Therefore, the correct option is both effective stress and total stress .",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "HARD",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2024
  },
  {
    "id": "ev-soil-077",
    "questionNumber": 77,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Phase Relations & Soil Properties",
    "subtopic": "Three Phase System (e, n, w, S, G)",
    "stem": "If the degree of saturation of a partially saturated soil is 60%, then air content of the soil is",
    "options": [
      {
        "id": "A",
        "text": "40%"
      },
      {
        "id": "B",
        "text": "60%"
      },
      {
        "id": "C",
        "text": "80%"
      },
      {
        "id": "D",
        "text": "100%"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (A) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2023
  },
  {
    "id": "ev-soil-078",
    "questionNumber": 78,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Phase Relations & Soil Properties",
    "subtopic": "Three Phase System (e, n, w, S, G)",
    "stem": "Water content of soil can",
    "options": [
      {
        "id": "A",
        "text": "never be greater than 100 %"
      },
      {
        "id": "B",
        "text": "take values only from 0 % to 100 %"
      },
      {
        "id": "C",
        "text": "be less than 0 %"
      },
      {
        "id": "D",
        "text": "be greater than 100 %"
      }
    ],
    "correctOption": "D",
    "formulaContext": "S · e = w · G ; γd = γ / (1 + w) = (G · γw) / (1 + e)",
    "explanation": "According to standard Soil Mechanics principles (S · e = w · G ; γd = γ / (1 + w) = (G · γw) / (1 + e)), Option (D) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2022
  },
  {
    "id": "ev-soil-079",
    "questionNumber": 79,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "Compressibility of sandy soils is",
    "options": [
      {
        "id": "A",
        "text": "almost equal to that of clayey soils"
      },
      {
        "id": "B",
        "text": "much greater than that of clayey soils"
      },
      {
        "id": "C",
        "text": "much less than that of clayey soils"
      },
      {
        "id": "D",
        "text": "none of the above"
      }
    ],
    "correctOption": "C",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (C) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2021
  },
  {
    "id": "ev-soil-080",
    "questionNumber": 80,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "A fully saturated soil is said to be",
    "options": [
      {
        "id": "A",
        "text": "one phase system"
      },
      {
        "id": "B",
        "text": "two phase system with soil and air"
      },
      {
        "id": "C",
        "text": "two phase system with soil and water"
      },
      {
        "id": "D",
        "text": "three phase system"
      }
    ],
    "correctOption": "C",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (C) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2020
  },
  {
    "id": "ev-soil-081",
    "questionNumber": 81,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Consolidation & Settlement",
    "subtopic": "Terzaghi 1D Consolidation",
    "stem": "Terzaghi’s theory of one dimensional consolidation assumes",
    "options": [
      {
        "id": "A",
        "text": "Soil is homogeneous and fully saturated"
      },
      {
        "id": "B",
        "text": "Water and soil particles are incompressible"
      },
      {
        "id": "C",
        "text": "Deformation of the soil, is entirely due to change in volume"
      },
      {
        "id": "D",
        "text": "All the above"
      }
    ],
    "correctOption": "D",
    "formulaContext": "qult = c·Nc + q·Nq + 0.5·γ·B·Nγ",
    "explanation": "According to standard Soil Mechanics principles (qult = c·Nc + q·Nq + 0.5·γ·B·Nγ), Option (D) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2024
  },
  {
    "id": "ev-soil-082",
    "questionNumber": 82,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "Pick up the correct statement from the following:",
    "options": [
      {
        "id": "A",
        "text": "The dry density reduces by addition of water after attaining optimum moisture content"
      },
      {
        "id": "B",
        "text": "The line joining the peak of three moisture content graphs obtained by using three compactive energies, is called line of optimus"
      },
      {
        "id": "C",
        "text": "Well graded coarse grained soils can be compacted to a very high density as compared to fine grained soils"
      },
      {
        "id": "D",
        "text": "All the above"
      }
    ],
    "correctOption": "D",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (D) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "ASSERTION_REASON",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2023
  },
  {
    "id": "ev-soil-083",
    "questionNumber": 83,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "Pick up the correct statement from the following:",
    "options": [
      {
        "id": "A",
        "text": "The object of classifying soils is to arrange them into groups according to their properties and behaviour"
      },
      {
        "id": "B",
        "text": "A soil classification system is meant to provide an accepted and systematic method of describing the various types of soils eliminating personal factors"
      },
      {
        "id": "C",
        "text": "The first category of soil classification is based on grain size of the soil"
      },
      {
        "id": "D",
        "text": "All the above"
      }
    ],
    "correctOption": "D",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (D) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "ASSERTION_REASON",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2022
  },
  {
    "id": "ev-soil-084",
    "questionNumber": 84,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "Coefficient of compressibility is",
    "options": [
      {
        "id": "A",
        "text": "constant for any type of soil"
      },
      {
        "id": "B",
        "text": "different for different types of soils and also different for a soil under different states of consolidation"
      },
      {
        "id": "C",
        "text": "different for different types of soils but same for a soil under different states of consolidation"
      },
      {
        "id": "D",
        "text": "independent of type of soil but depends on the stress history of soil"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (B) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2021
  },
  {
    "id": "ev-soil-085",
    "questionNumber": 85,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Consolidation & Settlement",
    "subtopic": "Terzaghi 1D Consolidation",
    "stem": "Coefficient of consolidation for clays normally",
    "options": [
      {
        "id": "A",
        "text": "decreases with increase in liquid limit"
      },
      {
        "id": "B",
        "text": "increases with increase in liquid limit"
      },
      {
        "id": "C",
        "text": "first increases and then decreases with increase in liquid limit"
      },
      {
        "id": "D",
        "text": "remains constant at all liquid limits"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (A) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2020
  },
  {
    "id": "ev-soil-086",
    "questionNumber": 86,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "Select the incorrect statement.",
    "options": [
      {
        "id": "A",
        "text": "In a direct shear box test, the plane of shear failure is predetermined"
      },
      {
        "id": "B",
        "text": "Better control is achieved on the drainage of the soil in a tri-axial compression test"
      },
      {
        "id": "C",
        "text": "Stress distribution on the failure plane in the case of tri-axial compression test is uniform"
      },
      {
        "id": "D",
        "text": "Unconfined compression test can be carried out on all types of soils"
      }
    ],
    "correctOption": "D",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "Solution: The correct answer is Option D: Unconfined compression test can be carried out on all types of soils. Here's why: Option A: In a direct shear box test, the plane of shear failure is predetermined - This is correct. The shear force is applied along a specific horizontal plane, so the failure is forced to occur along that plane. Option B: Better control is achieved on the drainage of the soil in a tri-axial compression test - This is also correct. In a triaxial test, you can control whether the soil is allowed to drain or not, giving you better control over drainage conditions compared to, say, a direct shear test. Option C: Stress distribution on the failure plane in the case of tri-axial compression test is uniform - This is correct. Triaxial test are designed to applied uniform stresses. Option D: Unconfined compression test can be carried out on all types of soils - This is incorrect. An unconfined compression test is a special case of a triaxial test where the confining pressure is zero. It's only suitable for cohesive soils (like clays) that can stand on their own without lateral support. Granular soils (like sands) and very loose soils will collapse under their own weight in an unconfined state, so you can't perform this test on them.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "HARD",
    "sourceType": "MODELLED",
    "questionType": "ASSERTION_REASON",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2024
  },
  {
    "id": "ev-soil-087",
    "questionNumber": 87,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "Select the correct statement.",
    "options": [
      {
        "id": "A",
        "text": "A uniform soil has more strength and stability than a non-uniform soil."
      },
      {
        "id": "B",
        "text": "A uniform soil has less strength and stability than a non-uniform soil."
      },
      {
        "id": "C",
        "text": "Uniformity coefficient does not affect strength and stability."
      },
      {
        "id": "D",
        "text": "Uniformity coefficient of a poorly graded soil is more than that of a well graded soil."
      }
    ],
    "correctOption": "B",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (B) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "ASSERTION_REASON",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2023
  },
  {
    "id": "ev-soil-088",
    "questionNumber": 88,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "Select the incorrect statement.",
    "options": [
      {
        "id": "A",
        "text": "Bearing capacity of a soil depends upon the amount and direction of load."
      },
      {
        "id": "B",
        "text": "Bearing capacity of a soil depends on the type of soil."
      },
      {
        "id": "C",
        "text": "Bearing capacity of a soil depends upon shape and size of footing."
      },
      {
        "id": "D",
        "text": "Bearing capacity of a soil is indepen-dent of rate of loading."
      }
    ],
    "correctOption": "D",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "Solution: The bearing capacity of soil is influenced by various factors: Option A: Bearing capacity of a soil depends upon the amount and direction of load. This is correct because different loads and directions can affect the soil's ability to support structures. Option B: Bearing capacity of a soil depends on the type of soil. This is correct because different soil types have different strength and stability characteristics. Option C: Bearing capacity of a soil depends upon shape and size of footing. This is correct because the distribution of load through different shapes and sizes of footings impacts the soil's capacity. Option D: Bearing capacity of a soil is independent of rate of loading. This is incorrect because the rate of loading can affect the soil's strength and stability, influencing its bearing capacity. Therefore, the incorrect statement is Option D: Bearing capacity of a soil is independent of rate of loading .",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "ASSERTION_REASON",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2022
  },
  {
    "id": "ev-soil-089",
    "questionNumber": 89,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "Select the correct statement.",
    "options": [
      {
        "id": "A",
        "text": "coefficient of compressibility of an over-consolidated clay is less than that of a normally consolidated clay"
      },
      {
        "id": "B",
        "text": "coefficient of compressibility of an over-consolidated clay is greater than that of a normally consolidated clay"
      },
      {
        "id": "C",
        "text": "coefficient of compressibility is cons-tant for any clay"
      },
      {
        "id": "D",
        "text": "none of the above"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (A) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "ASSERTION_REASON",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2021
  },
  {
    "id": "ev-soil-090",
    "questionNumber": 90,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "Select the incorrect statement.",
    "options": [
      {
        "id": "A",
        "text": "Effective cohesion of a soil can never have a negative value."
      },
      {
        "id": "B",
        "text": "Effective angle of internal friction for coarse grained soils is rarely below 30°"
      },
      {
        "id": "C",
        "text": "Effective angle of internal friction for a soil increases as state of compact-ness increases."
      },
      {
        "id": "D",
        "text": "Effective angle of internal friction is a complicated function of mineralogy and clay size content."
      }
    ],
    "correctOption": "A",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "Solution: Option A: Effective cohesion of a soil can never have a negative value. This statement is incorrect . While effective cohesion typically has a positive value, it can be negative in certain conditions . For example, in unsaturated soils where negative pore pressure exists (matric suction), the effective cohesion can become negative. Therefore, it is not correct to say that effective cohesion can never be negative. Option B: Effective angle of internal friction for coarse-grained soils is rarely below 30°. This statement is correct . Coarse-grained soils such as sand and gravel generally have an effective angle of internal friction that is above 30°. It would be rare to find coarse-grained soils with an angle of internal friction below this value, as the frictional resistance is typically quite high in such soils. Option C: Effective angle of internal friction for a soil increases as state of compactness increases. This statement is correct . As the state of compactness increases, the soil particles interlock more tightly, making it harder to shear the soil. This results in an increase in the effective angle of internal friction , which reflects the improved resistance to shear forces. Option D: Effective angle of internal friction is a complicated function of mineralogy and clay size content. This statement is correct . The effective angle of internal friction is indeed influenced by the mineralogy of the soil (the type and texture of the particles) and the clay size content . The properties of the soil particles and their interactions significantly affect the angle of internal friction. Therefore, the correct answer is Option A: Effective cohesion of a soil can never have a negative value as it is the only incorrect statement in this case.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "ASSERTION_REASON",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2020
  },
  {
    "id": "ev-soil-091",
    "questionNumber": 91,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "Select the correct statement.",
    "options": [
      {
        "id": "A",
        "text": "The greater the viscosity, the greater is permeability."
      },
      {
        "id": "B",
        "text": "The greater the unit weight, the greater is permeability."
      },
      {
        "id": "C",
        "text": "The greater the unit weight, the smaller is permeability."
      },
      {
        "id": "D",
        "text": "Unit weight does not affect per-meability."
      }
    ],
    "correctOption": "C",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "Solution: Option A: \"The greater the viscosity, the greater is permeability.\" This statement is incorrect because viscosity refers to the resistance of a fluid to flow, not to the soil's ability to transmit water. Permeability is determined by factors such as pore size and connectivity within the soil, rather than by the viscosity of the fluid. Option B: \"The greater the unit weight, the greater is permeability.\" This statement is incorrect because, as discussed earlier, higher unit weight (density) usually results in smaller pore spaces within the soil, leading to decreased permeability, not increased permeability. Option C: The greater the unit weight, the smaller is permeability. Permeability refers to the ability of a soil to transmit water or other fluids through it. Unit weight (also known as density) affects permeability. The greater the unit weight of soil, the smaller is its permeability. This is because denser soil has smaller pore spaces between particles, which restricts the movement of water or fluids through the soil mass. Option D: \"Unit weight does not affect permeability.\" This statement is incorrect. As explained previously, unit weight (density) does affect permeability. Higher unit weight typically results in smaller pore spaces and decreased permeability. Therefore, the correct statement is Option C: \"The greater the unit weight, the smaller is permeability.\".",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "ASSERTION_REASON",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2024
  },
  {
    "id": "ev-soil-092",
    "questionNumber": 92,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "Select the correct statement.",
    "options": [
      {
        "id": "A",
        "text": "Unit weight of dry soil is greater than unit weight of wet soil."
      },
      {
        "id": "B",
        "text": "For dry soils, dry unit weight is less than total unit weight."
      },
      {
        "id": "C",
        "text": "Unit weight of soil increases due to submergence in water."
      },
      {
        "id": "D",
        "text": "Unit weight of soil decreases due to submergence in water."
      }
    ],
    "correctOption": "D",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (D) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "ASSERTION_REASON",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2023
  },
  {
    "id": "ev-soil-093",
    "questionNumber": 93,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "A plane inclined at an angle ‘φ’ to the horizontal at which the soil is expected to stay in the absence of any lateral support, is known as",
    "options": [
      {
        "id": "A",
        "text": "Natural slope line"
      },
      {
        "id": "B",
        "text": "Repose line"
      },
      {
        "id": "C",
        "text": "The φ line"
      },
      {
        "id": "D",
        "text": "All the above"
      }
    ],
    "correctOption": "D",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (D) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2022
  },
  {
    "id": "ev-soil-094",
    "questionNumber": 94,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "Quick sand is a",
    "options": [
      {
        "id": "A",
        "text": "type of sand"
      },
      {
        "id": "B",
        "text": "flow condition occurring in cohesive soils"
      },
      {
        "id": "C",
        "text": "flow condition occurring in cohesionless soils"
      },
      {
        "id": "D",
        "text": "flow condition occurring in both cohesive and cohesionless soils"
      }
    ],
    "correctOption": "C",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (C) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2021
  },
  {
    "id": "ev-soil-095",
    "questionNumber": 95,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "Time factor for a clay layer is",
    "options": [
      {
        "id": "A",
        "text": "a dimensional parameter"
      },
      {
        "id": "B",
        "text": "directly proportional to permeability of soil"
      },
      {
        "id": "C",
        "text": "inversely proportional to drainage path"
      },
      {
        "id": "D",
        "text": "independent of thickness of clay layer"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (B) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2020
  },
  {
    "id": "ev-soil-096",
    "questionNumber": 96,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "The slope of isochrone at any point at a given time indicates the rate of change of",
    "options": [
      {
        "id": "A",
        "text": "effective stress with time"
      },
      {
        "id": "B",
        "text": "effective stress with depth"
      },
      {
        "id": "C",
        "text": "pore water pressure with depth"
      },
      {
        "id": "D",
        "text": "pore water pressure with time"
      }
    ],
    "correctOption": "C",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (C) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "HARD",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2024
  },
  {
    "id": "ev-soil-097",
    "questionNumber": 97,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Phase Relations & Soil Properties",
    "subtopic": "Three Phase System (e, n, w, S, G)",
    "stem": "When the degree of saturation is zero, the soil mass under consideration represents",
    "options": [
      {
        "id": "A",
        "text": "one phase system"
      },
      {
        "id": "B",
        "text": "two phase system with soil and air"
      },
      {
        "id": "C",
        "text": "two phase system with soil and water"
      },
      {
        "id": "D",
        "text": "three phase system"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (B) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2023
  },
  {
    "id": "ev-soil-098",
    "questionNumber": 98,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "Hydrometer readings are corrected for:",
    "options": [
      {
        "id": "A",
        "text": "Temperature correction"
      },
      {
        "id": "B",
        "text": "Meniscus correction"
      },
      {
        "id": "C",
        "text": "Dispersing agent correction"
      },
      {
        "id": "D",
        "text": "Temperature, meniscus and dispersing agent corrections"
      }
    ],
    "correctOption": "D",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (D) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2022
  },
  {
    "id": "ev-soil-099",
    "questionNumber": 99,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Shallow Foundations & Bearing Capacity",
    "subtopic": "Terzaghi Bearing Capacity",
    "stem": "During the first stage of triaxial test when the cell pressure is increased from 0.10 N/mm² to 0.26 N/mm² , the pore water pressure increases from 0.07 N/mm² to 0.15 N/mm² . Skempton’s pore pressure parameter B is",
    "options": [
      {
        "id": "A",
        "text": "0.5"
      },
      {
        "id": "B",
        "text": "-0.5"
      },
      {
        "id": "C",
        "text": "2.0"
      },
      {
        "id": "D",
        "text": "-2.0"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "According to standard Soil Mechanics principles (Standard Soil Mechanics Relationship), Option (A) is the correct statement/result for this condition under Indian Standard (IS) geotechnical specifications.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2021
  },
  {
    "id": "ev-soil-100",
    "questionNumber": 100,
    "examId": "apsc-ae-civil",
    "subject": "Geotechnical Engineering",
    "topic": "Soil Mechanics Principles",
    "subtopic": "General Geotechnical Fundamentals",
    "stem": "Inorganic soils with low compressibility are represented by",
    "options": [
      {
        "id": "A",
        "text": "MH"
      },
      {
        "id": "B",
        "text": "SL"
      },
      {
        "id": "C",
        "text": "ML"
      },
      {
        "id": "D",
        "text": "CH"
      }
    ],
    "correctOption": "C",
    "formulaContext": "Standard Soil Mechanics Relationship",
    "explanation": "Solution: The correct answer is C: ML . Let's break down why: Soil Classification : In soil mechanics, we use a system to classify different types of soil. This helps us predict how the soil will behave. Inorganic vs. Organic Soils : Inorganic soils are made of minerals, like sand, silt, and clay. Organic soils contain a lot of decomposed plant and animal matter. Compressibility : Compressibility refers to how much a soil's volume decreases under pressure. Low compressibility means the soil doesn't shrink much when you put weight on it. The Options Explained : MH : This represents inorganic silts with high compressibility. SL : This is not a standard soil classification symbol. ML : This represents inorganic silts with low compressibility. This is exactly what the question is asking for! CH : This represents inorganic clays with high compressibility. Therefore , ML (inorganic silts with low compressibility) is the right answer.",
    "referenceSource": "ExamVeda Geotechnical Question Bank / IS 1498 & IS 6403",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "ExamVeda / UPSC ESE / GATE Soil Mechanics",
    "pyqYear": 2020
  }
];
