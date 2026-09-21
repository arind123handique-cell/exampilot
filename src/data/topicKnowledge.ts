import type { KnowledgeModule } from '../types';
// Explicit .ts extensions (permitted by the project's allowImportingTsExtensions)
// keep these three data modules loadable by the offline tooling in scripts/ as
// well as by Vite — both only ever import types otherwise.
import { FOUNDATION_CIVIL_MODULES } from './foundationCivilModules.ts';
import { INFRASTRUCTURE_CIVIL_MODULES } from './infrastructureCivilModules.ts';

export const BASE_KNOWLEDGE_MODULES: KnowledgeModule[] = [
  {
    "id": "civil-rcc",
    "title": "RCC Limit State Design & IS 456:2000",
    "subject": "Reinforced Concrete Structures",
    "category": "civil",
    "readTime": "15 min read",
    "weightage": "HIGH_YIELD",
    "icon": "Building2",
    "summary": "Limit state design philosophy, stress block parameters, shear reinforcement, bond & anchorage, torsion, and deflection control under IS 456:2000.",
    "prerequisites": [
      "Engineering Mechanics",
      "Concrete Technology"
    ],
    "standardReferences": [
      "IS 456:2000 Cl. 38, 39, 40",
      "SP 16 Design Aids"
    ],
    "practiceQuestionIds": [
      "ce-q-001",
      "ce-q-002",
      "ce-q-003",
      "ce-q-004",
      "ce-q-005",
      "ce-q-006",
      "ce-q-007",
      "ce-q-008",
      "ce-q-009",
      "ce-q-010",
      "ce-q-011",
      "ce-q-012",
      "ce-q-013",
      "ce-q-015"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "stepTitle": "LSM Assumptions & Rectangular Stress Block",
        "subtitle": "Parabolic-rectangular stress profile and strain limits",
        "keyConcept": "IS 456:2000 assumes plane sections remain plane after bending. The concrete compressive stress block is parabolic up to 0.002 strain and rectangular up to ultimate strain of 0.0035. Compressive force C = 0.36 f_ck b x_u acting at 0.42 x_u from the top fiber. Tension force T = 0.87 f_y A_st at steel centroid.",
        "formulaOrCode": "C = 0.36 f_{ck} b x_u \\quad ; \\quad T = 0.87 f_y A_{st} \\quad ; \\quad \\frac{x_{u,max}}{d} = \\frac{0.0035}{0.0055 + \\frac{0.87 f_y}{E_s}}",
        "highYieldFacts": [
          "Limiting neutral axis depth ratio x_u,max / d: Fe 250 = 0.53, Fe 415 = 0.48, Fe 500 = 0.46.",
          "Tensile strain in steel at failure must not be less than (0.87 f_y / E_s) + 0.002.",
          "Limiting moment of resistance: Fe 250 = 0.148 f_ck b d^2; Fe 415 = 0.138 f_ck b d^2; Fe 500 = 0.133 f_ck b d^2.",
          "Partial safety factor for concrete is gamma_c = 1.5; for steel gamma_s = 1.15."
        ],
        "examTrap": "In LSM, limiting neutral axis depth x_u,max / d depends ONLY on the yield strength of steel (f_y), NOT on concrete grade f_ck.",
        "benchmarkExample": {
          "question": "A singly reinforced rectangular beam (b = 250 mm, d = 450 mm) uses M20 concrete and Fe 415 steel. Calculate its limiting moment of resistance.",
          "options": [
            "92.4 kN\u00b7m",
            "111.8 kN\u00b7m",
            "125.6 kN\u00b7m",
            "139.8 kN\u00b7m"
          ],
          "correctAnswer": "111.8 kN\u00b7m",
          "stepByStepSolution": [
            "Step 1: Formula for Fe 415: M_u,lim = 0.138 * f_ck * b * d^2.",
            "Step 2: Substitute values: M_u,lim = 0.138 * 20 * 250 * (450)^2.",
            "Step 3: Calculate: 0.138 * 20 * 250 * 202,500 = 139,725,000 N\u00b7mm = 111.78 kN\u00b7m (approx 111.8 kN\u00b7m)."
          ],
          "takeaway": "Direct exam formula: M_u,lim = 0.138 * f_ck * b * d^2 for Fe 415."
        },
        "pointers": [
          "Limiting neutral axis depth ratio x_u,max / d: Fe 250 = 0.53, Fe 415 = 0.48, Fe 500 = 0.46.",
          "Tensile strain in steel at failure must not be less than (0.87 f_y / E_s) + 0.002.",
          "Limiting moment of resistance: Fe 250 = 0.148 f_ck b d^2; Fe 415 = 0.138 f_ck b d^2; Fe 500 = 0.133 f_ck b d^2.",
          "Partial safety factor for concrete is gamma_c = 1.5; for steel gamma_s = 1.15."
        ]
      },
      {
        "stepNumber": 2,
        "stepTitle": "Shear Design & Diagonal Cracking",
        "subtitle": "Nominal shear stress, concrete capacity, and stirrup spacing",
        "keyConcept": "Diagonal tension creates 45-degree cracks in concrete near supports where shear force is maximum. Concrete resists nominal shear stress tau_c, and any excess shear (V_us = V_u - tau_c * b * d) must be carried by vertical or inclined shear reinforcement.",
        "formulaOrCode": "\\tau_v = \\frac{V_u}{b d} \\le \\tau_{c,max} \\quad ; \\quad V_{us} = \\frac{0.87 f_y A_{sv} d}{s_v}",
        "highYieldFacts": [
          "Maximum shear stress tau_c,max for M20 = 2.8 N/mm\u00b2, M25 = 3.1 N/mm\u00b2, M30 = 3.5 N/mm\u00b2.",
          "Minimum shear reinforcement formula: (A_sv / (b * s_v)) >= 0.4 / (0.87 f_y).",
          "Maximum spacing of vertical stirrups: minimum of 0.75 d or 300 mm.",
          "If tau_v > tau_c,max, the section must be redesigned by increasing depth or width."
        ],
        "examTrap": "If nominal shear stress tau_v exceeds tau_c,max, no amount of stirrup reinforcement is permitted; the section MUST be resized.",
        "benchmarkExample": {
          "question": "What is the maximum permissible vertical stirrup spacing in an RCC beam with effective depth 400 mm?",
          "options": [
            "200 mm",
            "300 mm",
            "350 mm",
            "400 mm"
          ],
          "correctAnswer": "300 mm",
          "stepByStepSolution": [
            "Step 1: Check IS 456 Cl. 26.5.1.5: Max spacing = min(0.75 d, 300 mm).",
            "Step 2: 0.75 * 400 = 300 mm.",
            "Step 3: Comparing 300 mm and 300 mm gives 300 mm."
          ],
          "takeaway": "Vertical stirrups: min(0.75d, 300 mm); Inclined stirrups: min(d, 300 mm)."
        },
        "pointers": [
          "Maximum shear stress tau_c,max for M20 = 2.8 N/mm\u00b2, M25 = 3.1 N/mm\u00b2, M30 = 3.5 N/mm\u00b2.",
          "Minimum shear reinforcement formula: (A_sv / (b * s_v)) >= 0.4 / (0.87 f_y).",
          "Maximum spacing of vertical stirrups: minimum of 0.75 d or 300 mm.",
          "If tau_v > tau_c,max, the section must be redesigned by increasing depth or width."
        ]
      },
      {
        "stepNumber": 3,
        "stepTitle": "Bond, Anchorage & Serviceability Deflection",
        "subtitle": "Development length L_d and basic span-to-depth ratios",
        "keyConcept": "Development length L_d ensures sufficient embedment length to prevent bond slippage. Deflection of beams is controlled via span-to-effective depth ratios per Cl. 23.2.1.",
        "formulaOrCode": "L_d = \\frac{\\phi (0.87 f_y)}{4 \\tau_{bd}} \\quad ; \\quad \\frac{\\text{Span}}{d} \\le \\text{Basic Ratio} \\times k_t",
        "highYieldFacts": [
          "For HYSD/TMT bars, increase design bond stress tau_bd by 60%.",
          "For bars in compression, increase tau_bd by 25%.",
          "Basic span-to-depth ratios for spans up to 10 m: Cantilever = 7, Simply Supported = 20, Continuous = 26.",
          "For spans > 10 m, multiply by (10 / Span in meters), except cantilevers."
        ],
        "examTrap": "For bars in compression with HYSD, both 1.6 and 1.25 factors apply multiplicatively: tau_bd * 1.6 * 1.25 = 2.0 * tau_bd.",
        "benchmarkExample": {
          "question": "What is the basic span-to-effective depth ratio for a simply supported beam of 8 m span?",
          "options": [
            "7",
            "20",
            "26",
            "30"
          ],
          "correctAnswer": "20",
          "stepByStepSolution": [
            "Step 1: Refer to IS 456 Cl. 23.2.1.",
            "Step 2: Cantilever = 7; Simply Supported = 20; Continuous = 26.",
            "Step 3: Since span is 8 m (<= 10 m), basic ratio is 20."
          ],
          "takeaway": "Memory aid: 7 (Cantilever) -> 20 (Simply Supported) -> 26 (Continuous)."
        },
        "pointers": [
          "For HYSD/TMT bars, increase design bond stress tau_bd by 60%.",
          "For bars in compression, increase tau_bd by 25%.",
          "Basic span-to-depth ratios for spans up to 10 m: Cantilever = 7, Simply Supported = 20, Continuous = 26.",
          "For spans > 10 m, multiply by (10 / Span in meters), except cantilevers."
        ]
      }
    ],
    "fullDescription": "Comprehensive module covering fundamental and advanced concepts of RCC Limit State Design & IS 456:2000 tailored for competitive civil engineering examinations (GATE, ESE, SSC JE, State AE/JE). Includes key principles, governing IS/IRC code formulas, exam traps, and benchmark problems.",
    "syllabusCoverage": [
      "Core Principles of Reinforced Concrete Structures",
      "Governing Specifications & Code Clauses",
      "High-Yield Problem Solving & Formula Derivations",
      "Previous Year Questions (PYQs) & Exam Pitfalls"
    ],
    "topicQuestions": [
      {
        "id": "ce-q-001",
        "sourceType": "MODELLED",
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
        "explanation": "According to IS 456:2000 Clause 38.1 Note, linear strain compatibility gives xu,max/d = 0.53 for Fe 250, 0.48 for Fe 415, 0.46 for Fe 500, and 0.44 for Fe 550.",
        "formulaContext": "xu,max / d = 0.0035 / (0.0055 + 0.87 * fy / Es)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Limit State Design \u2014 Flexure",
        "subtopic": "Limiting Neutral Axis Depth"
      },
      {
        "id": "ce-q-002",
        "sourceType": "MODELLED",
        "stem": "The development length (Ld) of a tension reinforcing bar of nominal diameter \u03c6 is given by IS 456:2000 as:",
        "options": [
          {
            "id": "A",
            "text": "Ld = (\u03c6 \u00b7 \u03c3s) / (2 \u00b7 \u03c4bd)"
          },
          {
            "id": "B",
            "text": "Ld = (\u03c6 \u00b7 \u03c3s) / (4 \u00b7 \u03c4bd)"
          },
          {
            "id": "C",
            "text": "Ld = (\u03c6 \u00b7 \u03c3s) / (8 \u00b7 \u03c4bd)"
          },
          {
            "id": "D",
            "text": "Ld = (2 \u00b7 \u03c6 \u00b7 \u03c3s) / (3 \u00b7 \u03c4bd)"
          }
        ],
        "correctOption": "B",
        "explanation": "Per IS 456:2000 Cl. 26.2.1, equating tensile bar force to bond resistance yields Ld = (\u03c6 \u00b7 \u03c3s) / (4 \u00b7 \u03c4bd). For deformed bars (HYSD), \u03c4bd is increased by 60%. For bars in compression, \u03c4bd is increased by 25%.",
        "formulaContext": "Ld = (\u03c6 \u00b7 \u03c3s) / (4 \u00b7 \u03c4bd)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2023",
        "topic": "Shear and Bond",
        "subtopic": "Development Length"
      },
      {
        "id": "ce-q-003",
        "sourceType": "MODELLED",
        "stem": "As per IS 456:2000, the minimum area of tension reinforcement in a rectangular beam shall not be less than:",
        "options": [
          {
            "id": "A",
            "text": "As / (b \u00b7 d) = 0.85 / fy"
          },
          {
            "id": "B",
            "text": "As / (b \u00b7 d) = 0.40 / fy"
          },
          {
            "id": "C",
            "text": "As / (b \u00b7 D) = 0.12%"
          },
          {
            "id": "D",
            "text": "As / (b \u00b7 d) = 0.04 \u00b7 b \u00b7 d"
          }
        ],
        "correctOption": "A",
        "explanation": "IS 456:2000 Clause 26.5.1.1 specifies that the minimum area of tension reinforcement in beams is As,min = (0.85 \u00b7 b \u00b7 d) / fy, where b is width of beam, d is effective depth, and fy is characteristic steel strength.",
        "formulaContext": "As,min / (b \u00b7 d) = 0.85 / fy",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2022",
        "topic": "Beams & Slabs",
        "subtopic": "Minimum Tensile Reinforcement"
      },
      {
        "id": "ce-q-004",
        "sourceType": "MODELLED",
        "stem": "In a simply supported RCC beam resting on masonry support subjected to uniformly distributed load, the critical section for checking nominal shear stress (\u03c4v) is located at a distance of:",
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
        "explanation": "According to IS 456:2000 Clause 31.6.2 and 22.6.2, when the reaction introduces compression into the end regions of the member, the critical section for shear is taken at a distance d (effective depth) from the face of the support.",
        "formulaContext": "Critical section distance = effective depth (d) from support face",
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Shear Design",
        "subtopic": "Critical Section for Shear"
      },
      {
        "id": "ce-q-005",
        "sourceType": "MODELLED",
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
        "explanation": "Clause 26.5.1.5 of IS 456:2000 states that the spacing of stirrups measured along the member axis shall not exceed 0.75 d for vertical stirrups and d for inclined stirrups at 45\u00b0, but in no case shall it exceed 300 mm.",
        "formulaContext": "Spacing Sv \u2264 min(0.75 d, 300 mm)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2023",
        "topic": "Shear Reinforcement",
        "subtopic": "Maximum Stirrup Spacing"
      },
      {
        "id": "ce-q-006",
        "sourceType": "MODELLED",
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
        "explanation": "According to IS 456:2000 Clause 26.5.2.2, the diameter of reinforcing bars shall not exceed one-eighth of the total thickness of the slab.",
        "formulaContext": "\u03c6_bar \u2264 D_slab / 8",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2021",
        "topic": "Slab Design",
        "subtopic": "Maximum Bar Diameter in Slabs"
      },
      {
        "id": "ce-q-007",
        "sourceType": "MODELLED",
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
        "explanation": "Per IS 456 Table 5, minimum grades for RCC under environmental exposure conditions are: Mild (M20), Moderate (M25), Severe (M30), Very Severe (M35), and Extreme (M40).",
        "formulaContext": "Severe exposure min grade = M 30",
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Durability & Concrete Mix",
        "subtopic": "Minimum Grade for Severe Exposure"
      },
      {
        "id": "ce-q-008",
        "sourceType": "MODELLED",
        "stem": "In the limit state of collapse, the partial safety factors for concrete (\u03b3c) and steel (\u03b3s) are taken as:",
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
        "explanation": "Concrete has higher variability in material preparation and compaction on site compared to factory-controlled steel. Hence IS 456 adopts \u03b3c = 1.50 and \u03b3s = 1.15 in Limit State of Collapse (Clause 36.4.2).",
        "formulaContext": "\u03b3c = 1.50, \u03b3s = 1.15 (Collapse)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2022",
        "topic": "Limit State Philosophy",
        "subtopic": "Partial Safety Factors"
      },
      {
        "id": "ce-q-009",
        "sourceType": "MODELLED",
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
        "explanation": "Under-reinforced sections ensure that the tensile steel reaches its yield point long before concrete reaches its ultimate crushing strain (0.0035). This produces large visible cracks and deflections, ensuring ductile failure and safety.",
        "formulaContext": "xu < xu,max; \u03b5s \u2265 0.87 fy / Es + 0.002 before concrete strain reaches 0.0035",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Flexural Failure Modes",
        "subtopic": "Under-reinforced Beam Characteristics"
      },
      {
        "id": "ce-q-010",
        "sourceType": "MODELLED",
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
        "explanation": "IS 456:2000 Clause 25.4 specifies that all columns shall be designed for an unsupported length L and lateral dimension D with minimum eccentricity emin = unsupported length/500 + lateral dimension/30, subject to a minimum of 20 mm.",
        "formulaContext": "emin = max(L/500 + D/30, 20 mm)",
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / APSC AE Civil 2023",
        "topic": "Columns",
        "subtopic": "Minimum Eccentricity Check"
      },
      {
        "id": "ce-q-011",
        "sourceType": "MODELLED",
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
        "explanation": "Clause 25.1.2 of IS 456 defines a short column as one where both effective length ratios (Lex / D and Ley / b) are less than 12. If either ratio is 12 or more, it is considered a slender (long) column.",
        "formulaContext": "Slenderness ratio \u03bb = Leff / b < 12 => Short Column",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2021",
        "topic": "Columns",
        "subtopic": "Short vs Slender Column Criteria"
      },
      {
        "id": "ce-q-012",
        "sourceType": "MODELLED",
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
        "explanation": "Clause 26.4.2.2 and Table 16 specify that the minimum nominal cover for footings is 50 mm. When concrete is placed directly against untreated soil without blinding layer, cover is commonly increased to 75 mm.",
        "formulaContext": "Footing nominal cover = 50 mm",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Detailing of Reinforcement",
        "subtopic": "Nominal Cover for Footing"
      },
      {
        "id": "ce-q-013",
        "sourceType": "MODELLED",
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
        "explanation": "IS 456:2000 Clause 26.2.1.1 states: For deformed bars conforming to IS 1786, the design bond stress values for plain bars shall be increased by 60%.",
        "formulaContext": "\u03c4bd(deformed) = 1.60 \u00b7 \u03c4bd(plain)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2023",
        "topic": "Bond & Anchorage",
        "subtopic": "Deformed Bars Bond Stress Increment"
      },
      {
        "id": "ce-q-015",
        "sourceType": "MODELLED",
        "stem": "As per IS 456:2000, under combined bending moment (M) and twisting moment (T), the equivalent bending moment (Me1) is expressed as:",
        "options": [
          {
            "id": "A",
            "text": "Me1 = M + T \u00b7 (1 + D/b) / 1.7"
          },
          {
            "id": "B",
            "text": "Me1 = M + T \u00b7 (1 + b/D)"
          },
          {
            "id": "C",
            "text": "Me1 = M + (T / 1.7)"
          },
          {
            "id": "D",
            "text": "Me1 = \u221a(M\u00b2 + T\u00b2)"
          }
        ],
        "correctOption": "A",
        "explanation": "Clause 41.4.2 of IS 456 specifies that longitudinal reinforcement in members subjected to combined bending and torsion shall be designed for an equivalent bending moment Me1 = M + Mt, where Mt = T \u00b7 (1 + D/b) / 1.7.",
        "formulaContext": "Me1 = M + Mt = M + T \u00b7 (1 + D/b) / 1.7",
        "difficulty": "HARD",
        "examSource": "Testbook Model / APSC AE Civil 2022",
        "topic": "Torsion Design",
        "subtopic": "Equivalent Bending Moment"
      }
    ],
    "unitName": "Structural Engineering",
    "codeClause": "IS 456:2000 Clause 38.1",
    "confidencePercent": 68,
    "masteredStatus": "In Progress",
    "diagramType": "rcc",
    "subtopicList": [
      "Limit State Philosophy & Strain Compatibility",
      "Rectangular & Flanged Beams",
      "Shear & Bond Detailing",
      "Axial Compression Members (Columns)",
      "Isolated Footings & Retaining Walls"
    ],
    "comparisonGrid": {
      "titleLeft": "Concrete Characteristics",
      "tagLeft": "\u03b3m = 1.50",
      "valueLeft": "fcd = 0.45 fck",
      "descLeft": "Accounts for 0.67 factor for size effect in structures, then divided by partial safety factor of 1.50.",
      "titleRight": "Steel Reinforcement",
      "tagRight": "\u03b3m = 1.15",
      "valueRight": "fsd = 0.87 fy",
      "descRight": "Strict quality control in industrial manufacture allows a lower partial safety factor compared to site-cast concrete."
    },
    "callouts": {
      "corePostulate": "Maximum compressive strain in concrete at the outer compression fiber in bending is taken as 0.0035, irrespective of concrete grade.",
      "corePostulateRef": "IS 456:2000 Cl. 38.1(b)",
      "examTrap": "Do not confuse characteristic strength fck (5% tolerance) with design strength 0.45 fck in stress block calculations. 0.67 is structural reduction!",
      "examTrapRef": "Frequently asked in APSC 2018, 2020",
      "testedRatios": [
        {
          "label": "Fe 250 (Mild Steel):",
          "value": "xu,max / d = 0.53"
        },
        {
          "label": "Fe 415 (HYSD):",
          "value": "xu,max / d = 0.48"
        },
        {
          "label": "Fe 500 (TMT):",
          "value": "xu,max / d = 0.46"
        }
      ],
      "numericalShortcut": {
        "formula": "Mu,lim = Q \u00b7 fck \u00b7 b \u00b7 d\u00b2",
        "note": "Where Q = 0.148 for Fe 250, 0.138 for Fe 415, and 0.133 for Fe 500. Master these coefficients to skip 90-second manual derivation during paper."
      }
    },
    "aiTutorPrompts": [
      {
        "question": "Why is the concrete design strength taken as 0.45 fck instead of 0.67 fck?",
        "answerPreview": "Characteristic cylinder strength is 0.8 fck (cube). Size effect reduces strength in structures to 0.67 fck. Applying partial safety factor \u03b3c = 1.5 gives 0.67/1.5 = 0.446 \u2248 0.45 fck."
      },
      {
        "question": "What happens if xu exceeds xu,max in a beam design?",
        "answerPreview": "The section becomes over-reinforced. Concrete reaches failure strain (0.0035) before steel yields, causing sudden brittle failure without warning. IS 456 mandates limiting moment to Mu,lim."
      },
      {
        "question": "How is development length Ld calculated?",
        "answerPreview": "Ld = (0.87 * fy * phi) / (4 * tau_bd). For deformed bars (HYSD), tau_bd is increased by 60%. For compression, it is increased by 25%."
      }
    ]
  },
  {
    "id": "civil-structural-analysis",
    "title": "Structural Analysis: Indeterminacy, Arches & Matrix Methods",
    "subject": "Structural Analysis",
    "category": "civil",
    "readTime": "16 min read",
    "weightage": "HIGH_YIELD",
    "icon": "GitBranch",
    "summary": "Static and kinematic indeterminacy, moment distribution method, slope deflection equations, three-hinged and two-hinged arches, and stiffness matrices.",
    "prerequisites": [
      "Strength of Materials",
      "Engineering Mechanics"
    ],
    "standardReferences": [
      "Negi Structural Analysis",
      "Ramamrutham",
      "Punmia"
    ],
    "practiceQuestionIds": [
      "ce-q-016",
      "ce-q-017",
      "ce-q-018",
      "ce-q-019",
      "ce-q-020",
      "ce-q-021",
      "ce-q-022",
      "ce-q-023",
      "ce-q-024",
      "ce-q-025",
      "ce-q-026",
      "ce-q-027"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "stepTitle": "Static & Kinematic Indeterminacy",
        "subtitle": "Degrees of redundancy and degrees of freedom in trusses and frames",
        "keyConcept": "Static Indeterminacy (D_s) equals total unknown reaction forces and internal member forces minus available equations of equilibrium. Kinematic Indeterminacy (D_k) represents independent joint displacements (rotations and translations).",
        "formulaOrCode": "\\text{Truss: } D_s = m + r - 2j \\quad ; \\quad \\text{Rigid Frame (2D): } D_s = 3m + r - 3j - c",
        "highYieldFacts": [
          "For a 2D pin-jointed truss: Equilibrium at each joint yields 2 equations (Sigma F_x = 0, Sigma F_y = 0).",
          "For a 2D rigid-jointed frame: Each joint has 3 degrees of freedom (u, v, theta).",
          "If axial deformations are neglected in a rigid frame, subtract number of members m: D_k = 3j - r - m.",
          "Internal hinge in a beam releases 1 moment equilibrium equation (Sigma M = 0)."
        ],
        "examTrap": "Candidates often forget to check whether axial deformation is neglected or considered. If axially rigid, D_k decreases by the number of members m.",
        "benchmarkExample": {
          "question": "A fixed-fixed beam has a single internal hinge at midspan. Determine its degree of static indeterminacy (D_s).",
          "options": [
            "1",
            "2",
            "3",
            "4"
          ],
          "correctAnswer": "1",
          "stepByStepSolution": [
            "Step 1: Total reactions for two fixed supports: r = 3 + 3 = 6.",
            "Step 2: Equilibrium equations available: 3 (Sigma F_x = 0, Sigma F_y = 0, Sigma M = 0).",
            "Step 3: Internal hinge provides 1 additional release condition (Sigma M_hinge = 0).",
            "Step 4: D_s = r - (3 + c) = 6 - (3 + 1) = 2. For purely vertical loads: D_s = 4 - 2 - 1 = 1."
          ],
          "takeaway": "Each internal hinge reduces static indeterminacy by 1."
        },
        "pointers": [
          "For a 2D pin-jointed truss: Equilibrium at each joint yields 2 equations (Sigma F_x = 0, Sigma F_y = 0).",
          "For a 2D rigid-jointed frame: Each joint has 3 degrees of freedom (u, v, theta).",
          "If axial deformations are neglected in a rigid frame, subtract number of members m: D_k = 3j - r - m.",
          "Internal hinge in a beam releases 1 moment equilibrium equation (Sigma M = 0)."
        ]
      },
      {
        "stepNumber": 2,
        "stepTitle": "Moment Distribution & Slope Deflection",
        "subtitle": "Hardy Cross method, stiffness factors, carry-over factors, and sway analysis",
        "keyConcept": "The Moment Distribution Method is an iterative displacement technique where unbalanced joint moments are distributed among connecting members in proportion to their relative rotational stiffness k.",
        "formulaOrCode": "k = \\frac{4EI}{L} \\text{ (Far end fixed)} \\quad ; \\quad k = \\frac{3EI}{L} \\text{ (Far end hinged)} \\quad ; \\quad \\text{COF} = +0.5",
        "highYieldFacts": [
          "Carry-over factor (COF) to a fixed far end in prismatic member is +0.5.",
          "Carry-over factor to a hinged far end is ZERO.",
          "Distribution Factor DF_i = k_i / Sigma k (sum of DF at any rigid joint must equal 1.0).",
          "Slope Deflection Equation: M_AB = M_F,AB + (2EI/L) * [2 theta_A + theta_B - 3 delta/L]."
        ],
        "examTrap": "When the far end is hinged, its stiffness is 3EI/L (75% of fixed far end). If you use 4EI/L, distribution factors will be completely incorrect!",
        "benchmarkExample": {
          "question": "A member AB of span L has end A rigid and far end B hinged. What is the rotational stiffness at A?",
          "options": [
            "2EI / L",
            "3EI / L",
            "4EI / L",
            "6EI / L"
          ],
          "correctAnswer": "3EI / L",
          "stepByStepSolution": [
            "Step 1: When far end is fixed, M = 4EI/L * theta.",
            "Step 2: When far end is hinged, end moment required to produce unit rotation theta is M = 3EI/L * theta.",
            "Step 3: Hence, rotational stiffness is 3EI / L."
          ],
          "takeaway": "Stiffness: Fixed far end = 4EI/L; Hinged far end = 3EI/L."
        },
        "pointers": [
          "Carry-over factor (COF) to a fixed far end in prismatic member is +0.5.",
          "Carry-over factor to a hinged far end is ZERO.",
          "Distribution Factor DF_i = k_i / Sigma k (sum of DF at any rigid joint must equal 1.0).",
          "Slope Deflection Equation: M_AB = M_F,AB + (2EI/L) * [2 theta_A + theta_B - 3 delta/L]."
        ]
      },
      {
        "stepNumber": 3,
        "stepTitle": "Three-Hinged & Two-Hinged Arches",
        "subtitle": "Horizontal thrust, bending moments, and parabolic arch under UDL",
        "keyConcept": "An arch converts vertical downward gravitational loading into lateral compressive thrust, dramatically reducing flexural moments compared to equivalent straight beams.",
        "formulaOrCode": "H = \\frac{w L^2}{8 h} \\quad \\text{(Parabolic arch under uniform load } w\\text{)} \\quad ; \\quad B.M._x = M_0 - H y = 0",
        "highYieldFacts": [
          "A three-hinged arch is statically determinate (D_s = 0); temperature changes cause NO stress in a 3-hinged arch.",
          "A two-hinged arch is indeterminate to first degree (D_s = 1); temperature rise increases horizontal thrust H.",
          "Under uniform load w across the entire span, bending moment at EVERY section of a parabolic arch is identically ZERO!",
          "Normal thrust N = V_x sin(theta) + H cos(theta); Radial shear Q = V_x cos(theta) - H sin(theta)."
        ],
        "examTrap": "A three-hinged arch has NO temperature stresses because the crown hinge rises or falls freely to accommodate thermal expansion.",
        "benchmarkExample": {
          "question": "A three-hinged parabolic arch of span 40 m and central rise 5 m carries a UDL of 20 kN/m over the entire span. Calculate the horizontal thrust at supports.",
          "options": [
            "200 kN",
            "400 kN",
            "800 kN",
            "1000 kN"
          ],
          "correctAnswer": "800 kN",
          "stepByStepSolution": [
            "Step 1: Formula for horizontal thrust: H = (w * L^2) / (8 * h).",
            "Step 2: Substitute values: H = (20 * 40^2) / (8 * 5).",
            "Step 3: H = (20 * 1600) / 40 = 32,000 / 40 = 800 kN."
          ],
          "takeaway": "Parabolic Arch under full UDL: H = wL\u00b2 / 8h, Bending moment everywhere = 0."
        },
        "pointers": [
          "A three-hinged arch is statically determinate (D_s = 0); temperature changes cause NO stress in a 3-hinged arch.",
          "A two-hinged arch is indeterminate to first degree (D_s = 1); temperature rise increases horizontal thrust H.",
          "Under uniform load w across the entire span, bending moment at EVERY section of a parabolic arch is identically ZERO!",
          "Normal thrust N = V_x sin(theta) + H cos(theta); Radial shear Q = V_x cos(theta) - H sin(theta)."
        ]
      }
    ],
    "fullDescription": "Comprehensive module covering fundamental and advanced concepts of Structural Analysis: Indeterminacy, Arches & Matrix Methods tailored for competitive civil engineering examinations (GATE, ESE, SSC JE, State AE/JE). Includes key principles, governing IS/IRC code formulas, exam traps, and benchmark problems.",
    "syllabusCoverage": [
      "Core Principles of Structural Analysis",
      "Governing Specifications & Code Clauses",
      "High-Yield Problem Solving & Formula Derivations",
      "Previous Year Questions (PYQs) & Exam Pitfalls"
    ],
    "topicQuestions": [
      {
        "id": "ce-q-016",
        "sourceType": "MODELLED",
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
        "explanation": "For a 2D pin-jointed truss, total unknowns are m member forces plus r support reactions. Total equations of equilibrium are 2 per joint (2j). Hence static indeterminacy Ds = m + r - 2j.",
        "formulaContext": "Ds = (m + r) - 2j",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Determinate & Indeterminate Structures",
        "subtopic": "Static Indeterminacy of Trusses"
      },
      {
        "id": "ce-q-017",
        "sourceType": "MODELLED",
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
        "explanation": "Both ends A and B are fixed supports, where translations (\u0394x = 0, \u0394y = 0) and rotation (\u03b8 = 0) are completely restrained. Neglecting axial deformations, all joint displacements are zero, so Dk = 0.",
        "formulaContext": "Dk = 0 for fixed beam with axial deformation neglected",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2023",
        "topic": "Kinematic Indeterminacy",
        "subtopic": "Degrees of Freedom in Fixed Beam"
      },
      {
        "id": "ce-q-018",
        "sourceType": "MODELLED",
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
        "explanation": "When a moment M is applied at the near end of a prismatic member with the far end fixed, a moment of M/2 with the same sign is induced at the fixed far end. Hence the carry-over factor is +1/2 or 0.50.",
        "formulaContext": "Carry Over Factor (COF) = +0.5 to a fixed far end",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2022",
        "topic": "Moment Distribution Method",
        "subtopic": "Carry-Over Factor"
      },
      {
        "id": "ce-q-019",
        "sourceType": "MODELLED",
        "stem": "In a prismatic beam AB with span L, flexural rigidity EI, and end rotations \u03b8A and \u03b8B with sinking \u0394, the slope deflection equation for end moment MAB is:",
        "options": [
          {
            "id": "A",
            "text": "MAB = M_F_AB + (2EI/L) \u00b7 [2\u03b8A + \u03b8B - 3\u0394/L]"
          },
          {
            "id": "B",
            "text": "MAB = M_F_AB + (4EI/L) \u00b7 [\u03b8A + \u03b8B - \u0394/L]"
          },
          {
            "id": "C",
            "text": "MAB = M_F_AB + (2EI/L) \u00b7 [\u03b8A + 2\u03b8B - 3\u0394/L]"
          },
          {
            "id": "D",
            "text": "MAB = M_F_AB + (3EI/L) \u00b7 [\u03b8A - \u0394/L]"
          }
        ],
        "correctOption": "A",
        "explanation": "The classic slope-deflection equation derives directly from superposition of fixed-end moment, near-end rotation (4EI/L \u00b7 \u03b8A), far-end rotation (2EI/L \u00b7 \u03b8B), and relative chord rotation (-6EI/L\u00b2 \u00b7 \u0394). Factoring out 2EI/L yields MAB = M_F_AB + (2EI/L)[2\u03b8A + \u03b8B - 3\u0394/L].",
        "formulaContext": "MAB = M_F_AB + (2EI/L) \u00b7 [2\u03b8A + \u03b8B - 3\u0394/L]",
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Slope Deflection Method",
        "subtopic": "Standard Equations"
      },
      {
        "id": "ce-q-020",
        "sourceType": "MODELLED",
        "stem": "M\u00fcller-Breslau\u2019s Principle for constructing influence lines is applicable to:",
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
        "explanation": "M\u00fcller-Breslau principle is rooted in Maxwell-Betti reciprocal theorem and applies to all linear elastic structures, whether determinate or indeterminate. For determinate beams the ILD consists of straight line segments; for indeterminate beams it is curved.",
        "formulaContext": "Based on Betti\u2019s reciprocal theorem",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2023",
        "topic": "Influence Line Diagrams",
        "subtopic": "M\u00fcller-Breslau Principle"
      },
      {
        "id": "ce-q-021",
        "sourceType": "MODELLED",
        "stem": "Castigliano\u2019s second theorem states that the partial derivative of total strain energy (U) with respect to an applied load (Pi) yields:",
        "options": [
          {
            "id": "A",
            "text": "The force in member i"
          },
          {
            "id": "B",
            "text": "The deflection (\u0394i) at the point and in the direction of load Pi"
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
        "explanation": "Castigliano\u2019s theorem of least work / deflection states that in any linear elastic structure, \u2202U/\u2202Pi = \u0394i, giving the displacement under load Pi along its line of action.",
        "formulaContext": "\u2202U / \u2202Pi = \u0394i",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2021",
        "topic": "Energy Theorems",
        "subtopic": "Castigliano\u2019s Second Theorem"
      },
      {
        "id": "ce-q-022",
        "sourceType": "MODELLED",
        "stem": "In the unit load method for determining beam deflection, the expression for deflection \u0394 at any point is:",
        "options": [
          {
            "id": "A",
            "text": "\u0394 = \u222b (M \u00b7 m / EI) dx"
          },
          {
            "id": "B",
            "text": "\u0394 = \u222b (M\u00b2 / 2EI) dx"
          },
          {
            "id": "C",
            "text": "\u0394 = \u222b (m\u00b2 / EI) dx"
          },
          {
            "id": "D",
            "text": "\u0394 = \u222b (M \u00b7 m / 2EI) dx"
          }
        ],
        "correctOption": "A",
        "explanation": "Based on virtual work principle: 1 \u00b7 \u0394 = \u222b (m \u00b7 \u03b5) dx = \u222b m \u00b7 (M / EI) dx = \u222b (M \u00b7 m / EI) dx, where M is bending moment from actual loads and m is bending moment due to a fictitious unit load applied at the desired deflection point.",
        "formulaContext": "\u0394 = \u222b (M \u00b7 m / EI) dx",
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Energy Methods",
        "subtopic": "Unit Load Method for Deflection"
      },
      {
        "id": "ce-q-023",
        "sourceType": "MODELLED",
        "stem": "A three-hinged parabolic arch of span L and central rise h is subjected to a uniformly distributed load w over its entire span. The horizontal thrust (H) at the supports is:",
        "options": [
          {
            "id": "A",
            "text": "w \u00b7 L\u00b2 / (8 \u00b7 h)"
          },
          {
            "id": "B",
            "text": "w \u00b7 L\u00b2 / (16 \u00b7 h)"
          },
          {
            "id": "C",
            "text": "w \u00b7 L / (8 \u00b7 h)"
          },
          {
            "id": "D",
            "text": "w \u00b7 L\u00b2 / (4 \u00b7 h)"
          }
        ],
        "correctOption": "A",
        "explanation": "Taking moments about the crown hinge C: Mc = (wL/2) \u00b7 (L/2) - (w \u00b7 (L/2)\u00b2 / 2) - H \u00b7 h = 0 => H \u00b7 h = wL\u00b2/8 => H = wL\u00b2 / (8h).",
        "formulaContext": "H = w \u00b7 L\u00b2 / (8 \u00b7 h)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2023",
        "topic": "Arches",
        "subtopic": "Three-Hinged Parabolic Arch"
      },
      {
        "id": "ce-q-024",
        "sourceType": "MODELLED",
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
            "text": "Equal to wL\u00b2/8"
          }
        ],
        "correctOption": "A",
        "explanation": "The parabolic profile y = 4hx(L-x)/L\u00b2 exactly matches the bending moment shape of a simple beam under UDL. Hence the thrust moment (H \u00b7 y) exactly cancels the beam moment (\u03bcx) at every cross section, resulting in zero bending moment throughout.",
        "formulaContext": "Mx = \u03bcx - H \u00b7 y = 0",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2022",
        "topic": "Arches",
        "subtopic": "Bending Moment in Parabolic Arch"
      },
      {
        "id": "ce-q-025",
        "sourceType": "MODELLED",
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
        "explanation": "Cable tension at any point is T = \u221a(H\u00b2 + Vy\u00b2). Since horizontal thrust H is constant throughout the cable and vertical shear Vy is maximum at the supports (V = wL/2), the resultant cable tension Tmax occurs at the supports.",
        "formulaContext": "Tmax = \u221a(H\u00b2 + V\u00b2) at support",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Cables and Suspension Bridges",
        "subtopic": "Maximum Tension in Cable"
      },
      {
        "id": "ce-q-026",
        "sourceType": "MODELLED",
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
        "explanation": "Sway is induced by asymmetry in geometry, unequal column stiffness, uneven support levels, or unsymmetrical lateral/gravity loading. If geometry, stiffness, support levels, and loading are all perfectly symmetrical, no sway occurs.",
        "formulaContext": "No sway condition: Symmetry in frame geometry + stiffness + loading",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2021",
        "topic": "Portal Frames",
        "subtopic": "Sway Analysis"
      },
      {
        "id": "ce-q-027",
        "sourceType": "MODELLED",
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
        "explanation": "For a rectangular beam: Plastic section modulus Zp = (b \u00b7 d/2) \u00b7 (d/4) \u00b7 2 = b d\u00b2 / 4. Elastic section modulus Ze = b d\u00b2 / 6. Therefore, shape factor S = Zp / Ze = (b d\u00b2 / 4) / (b d\u00b2 / 6) = 1.50. For circular section S = 1.70, diamond S = 2.0, I-section S = 1.12 to 1.18.",
        "formulaContext": "Shape Factor S = Zp / Ze = (b d\u00b2 / 4) / (b d\u00b2 / 6) = 1.50",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Plastic Analysis",
        "subtopic": "Shape Factor of Rectangular Section"
      }
    ],
    "unitName": "Structural Engineering",
    "codeClause": "Matrix & Energy Methods / IS 875",
    "confidencePercent": 45,
    "masteredStatus": "Weak Area",
    "diagramType": "som",
    "subtopicList": [
      "Static (Ds) & Kinematic (Dk) Indeterminacy",
      "Moment Distribution Method (Hardy Cross)",
      "Slope Deflection Equations",
      "Influence Line Diagrams & Muller-Breslau Principle",
      "Three-Hinged vs Two-Hinged Arches"
    ],
    "comparisonGrid": {
      "titleLeft": "Force / Flexibility Method",
      "tagLeft": "Unknowns = Ds",
      "valueLeft": "Compatibility Equations",
      "descLeft": "Best suited when static indeterminacy is low (e.g. propped cantilever Ds=1). Matrix flexibility [F] used.",
      "titleRight": "Displacement / Stiffness Method",
      "tagRight": "Unknowns = Dk",
      "valueRight": "Equilibrium Equations",
      "descRight": "Best suited for modern computer analysis (FEA). Unknowns are nodal displacements. Matrix stiffness [K] used."
    },
    "callouts": {
      "corePostulate": "Muller-Breslau principle states that the influence line for any internal stress resultant is proportional to the deflected shape obtained by removing that restraint and applying a unit displacement.",
      "corePostulateRef": "Structural Analysis Theorem",
      "examTrap": "In a three-hinged parabolic arch under full UDL, bending moment is ZERO at every section! In a two-hinged arch, horizontal thrust is H = (integral M y dx) / (integral y\u00b2 dx).",
      "examTrapRef": "GATE & State AE Favorite",
      "testedRatios": [
        {
          "label": "Carry Over Factor (Far End Fixed):",
          "value": "+0.50"
        },
        {
          "label": "Carry Over Factor (Far End Hinged):",
          "value": "0.00"
        },
        {
          "label": "Bending Stiffness (Far End Fixed):",
          "value": "4EI / L"
        },
        {
          "label": "Bending Stiffness (Far End Hinged):",
          "value": "3EI / L"
        }
      ],
      "numericalShortcut": {
        "formula": "Kinematic Indeterminacy (Plane Frame) = 3j - r + m_axial",
        "note": "Neglecting axial deformation reduces Dk significantly: Dk = 3j - r - m."
      }
    },
    "aiTutorPrompts": [
      {
        "question": "How do you apply the Muller-Breslau principle to draw ILD?",
        "answerPreview": "To obtain the ILD for any stress resultant (shear, moment, reaction), remove the corresponding constraint and introduce a unit deformation. The resulting deflected shape is the ILD to some scale."
      },
      {
        "question": "What is Castigliano's Second Theorem?",
        "answerPreview": "The partial derivative of total strain energy with respect to a concentrated load gives the deflection in the direction of that load: Delta_i = dU / dP_i."
      }
    ]
  },
  {
    "id": "civil-som",
    "title": "Strength of Materials: Stresses, Mohr's Circle & Columns",
    "subject": "Strength of Materials",
    "category": "civil",
    "readTime": "18 min read",
    "weightage": "HIGH_YIELD",
    "icon": "Layers",
    "summary": "Stress-strain curves, Mohr's circle, pure bending, torsion in circular shafts, and Euler's column buckling theory.",
    "prerequisites": [
      "Engineering Mechanics",
      "Calculus"
    ],
    "standardReferences": [
      "Timoshenko & Gere",
      "Bansal SOM"
    ],
    "practiceQuestionIds": [
      "ce-q-028",
      "ce-q-029",
      "ce-q-030",
      "ce-q-031",
      "ce-q-032",
      "ce-q-033",
      "ce-q-034",
      "ce-q-035",
      "ce-q-036",
      "ce-q-037"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "stepTitle": "Principal Stresses & Mohr's Circle Transformation",
        "subtitle": "2D stress state, principal planes, and maximum shear stress",
        "keyConcept": "At any point in a stressed material, there exist planes on which shear stress vanishes (principal planes). The normal stresses on these planes are maximum and minimum principal stresses. Mohr's circle represents these relations graphically.",
        "formulaOrCode": "\\sigma_{1,2} = \\frac{\\sigma_x + \\sigma_y}{2} \\pm \\sqrt{\\left(\\frac{\\sigma_x - \\sigma_y}{2}\\right)^2 + \\tau_{xy}^2} \\quad ; \\quad \\tau_{max} = \\frac{\\sigma_1 - \\sigma_2}{2}",
        "highYieldFacts": [
          "Center of Mohr's circle = ((sigma_x + sigma_y)/2, 0).",
          "Radius of Mohr's circle = tau_max = sqrt(((sigma_x - sigma_y)/2)^2 + tau_xy^2).",
          "The angle between principal planes and maximum shear stress planes is always 45 degrees.",
          "Normal stress on maximum shear stress plane = (sigma_1 + sigma_2) / 2."
        ],
        "examTrap": "For pure shear stress tau_xy with zero normal stresses, Mohr's circle is centered at origin with radius tau. The principal stresses are +tau and -tau at 45 degrees.",
        "benchmarkExample": {
          "question": "If sigma_x = 100 MPa, sigma_y = 20 MPa, and tau_xy = 30 MPa, find the radius of Mohr's circle.",
          "options": [
            "30 MPa",
            "40 MPa",
            "50 MPa",
            "60 MPa"
          ],
          "correctAnswer": "50 MPa",
          "stepByStepSolution": [
            "Step 1: (sigma_x - sigma_y) / 2 = (100 - 20) / 2 = 40 MPa.",
            "Step 2: Radius R = sqrt(40^2 + 30^2) = sqrt(1600 + 900) = sqrt(2500) = 50 MPa.",
            "Step 3: Radius equals maximum shear stress tau_max = 50 MPa."
          ],
          "takeaway": "Radius of Mohr's circle = sqrt(((sigma_x - sigma_y)/2)^2 + tau_xy^2)."
        },
        "pointers": [
          "Center of Mohr's circle = ((sigma_x + sigma_y)/2, 0).",
          "Radius of Mohr's circle = tau_max = sqrt(((sigma_x - sigma_y)/2)^2 + tau_xy^2).",
          "The angle between principal planes and maximum shear stress planes is always 45 degrees.",
          "Normal stress on maximum shear stress plane = (sigma_1 + sigma_2) / 2."
        ]
      },
      {
        "stepNumber": 2,
        "stepTitle": "Pure Bending & Shear Stress Distribution",
        "subtitle": "Flexural formula, neutral axis, and cross-sectional shear patterns",
        "keyConcept": "In pure bending, longitudinal strain varies linearly with distance from the neutral axis. Shear stress varies parabolically across rectangular, circular, and I-sections.",
        "formulaOrCode": "\\frac{M}{I} = \\frac{\\sigma}{y} = \\frac{E}{R} \\quad ; \\quad \\tau = \\frac{V Q}{I b}",
        "highYieldFacts": [
          "Rectangular section: tau_max = 1.5 tau_avg (at neutral axis).",
          "Circular section: tau_max = (4/3) tau_avg = 1.33 tau_avg (at neutral axis).",
          "Triangular section: tau_max = 1.5 tau_avg (at h/2 from vertex; at NA, tau = 1.33 tau_avg).",
          "In an I-section, the web resists ~85-90% of shear force, while flanges resist ~85% of bending moment."
        ],
        "examTrap": "In a triangular cross-section, maximum shear stress occurs at mid-depth (h/2 from vertex), NOT at the neutral axis (2h/3 from vertex)!",
        "benchmarkExample": {
          "question": "A solid circular shaft experiences an average shear stress of 30 MPa. What is the maximum shear stress across its cross-section?",
          "options": [
            "30 MPa",
            "40 MPa",
            "45 MPa",
            "60 MPa"
          ],
          "correctAnswer": "40 MPa",
          "stepByStepSolution": [
            "Step 1: Ratio for solid circular section: tau_max = (4/3) * tau_avg.",
            "Step 2: Substitute: tau_max = (4/3) * 30 = 40 MPa."
          ],
          "takeaway": "Circle: tau_max = 1.33 * tau_avg; Rectangle: tau_max = 1.5 * tau_avg."
        },
        "pointers": [
          "Rectangular section: tau_max = 1.5 tau_avg (at neutral axis).",
          "Circular section: tau_max = (4/3) tau_avg = 1.33 tau_avg (at neutral axis).",
          "Triangular section: tau_max = 1.5 tau_avg (at h/2 from vertex; at NA, tau = 1.33 tau_avg).",
          "In an I-section, the web resists ~85-90% of shear force, while flanges resist ~85% of bending moment."
        ]
      },
      {
        "stepNumber": 3,
        "stepTitle": "Euler's Column Buckling Theory",
        "subtitle": "Effective length factors and critical load for slender columns",
        "keyConcept": "Long slender columns fail by elastic buckling rather than direct material crushing. Euler's critical load depends on flexural rigidity EI and effective length L_e.",
        "formulaOrCode": "P_{cr} = \\frac{\\pi^2 E I}{(L_e)^2} = \\frac{\\pi^2 E A}{\\lambda^2} \\quad ; \\quad \\lambda = \\frac{L_e}{r_{min}}",
        "highYieldFacts": [
          "Both ends hinged: L_e = L (P_cr = P).",
          "Both ends fixed: L_e = L / 2 (P_cr = 4P).",
          "One fixed, one hinged: L_e = L / sqrt(2) = 0.707 L (P_cr = 2P).",
          "One fixed, one free: L_e = 2 L (P_cr = P / 4)."
        ],
        "examTrap": "Changing from hinged-hinged to fixed-fixed quadruples the critical load (4P), not doubles, because L_e is halved and load is inversely proportional to L_e squared.",
        "benchmarkExample": {
          "question": "A column with both ends hinged has critical buckling load 200 kN. If both ends are fixed, what is its critical load?",
          "options": [
            "200 kN",
            "400 kN",
            "800 kN",
            "1600 kN"
          ],
          "correctAnswer": "800 kN",
          "stepByStepSolution": [
            "Step 1: Effective length for fixed ends: L_e = L / 2.",
            "Step 2: P_cr is inversely proportional to (L_e)^2.",
            "Step 3: New P_cr = 4 * 200 kN = 800 kN."
          ],
          "takeaway": "Fixed-Fixed column capacity = 4 * Hinged-Hinged capacity."
        },
        "pointers": [
          "Both ends hinged: L_e = L (P_cr = P).",
          "Both ends fixed: L_e = L / 2 (P_cr = 4P).",
          "One fixed, one hinged: L_e = L / sqrt(2) = 0.707 L (P_cr = 2P).",
          "One fixed, one free: L_e = 2 L (P_cr = P / 4)."
        ]
      }
    ],
    "fullDescription": "Comprehensive module covering fundamental and advanced concepts of Strength of Materials: Stresses, Mohr's Circle & Columns tailored for competitive civil engineering examinations (GATE, ESE, SSC JE, State AE/JE). Includes key principles, governing IS/IRC code formulas, exam traps, and benchmark problems.",
    "syllabusCoverage": [
      "Core Principles of Strength of Materials",
      "Governing Specifications & Code Clauses",
      "High-Yield Problem Solving & Formula Derivations",
      "Previous Year Questions (PYQs) & Exam Pitfalls"
    ],
    "topicQuestions": [
      {
        "id": "ce-q-028",
        "sourceType": "MODELLED",
        "stem": "The relationship connecting Young's modulus (E), Shear modulus (G), and Poisson's ratio (\u03bc) for an isotropic elastic material is:",
        "options": [
          {
            "id": "A",
            "text": "E = 2G(1 + \u03bc)"
          },
          {
            "id": "B",
            "text": "E = 3G(1 - 2\u03bc)"
          },
          {
            "id": "C",
            "text": "E = 2G(1 - \u03bc)"
          },
          {
            "id": "D",
            "text": "G = 2E(1 + \u03bc)"
          }
        ],
        "correctOption": "A",
        "explanation": "From the theory of elasticity, the fundamental relationships among elastic constants are: E = 2G(1 + \u03bc) = 3K(1 - 2\u03bc) = 9KG / (3K + G).",
        "formulaContext": "E = 2G(1 + \u03bc) and E = 3K(1 - 2\u03bc)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Stress and Strain",
        "subtopic": "Elastic Constants Relationship"
      },
      {
        "id": "ce-q-029",
        "sourceType": "MODELLED",
        "stem": "For a perfectly incompressible isotropic material, the theoretical value of Poisson's ratio (\u03bc) is:",
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
        "explanation": "Volumetric strain for isotropic material is given by \u03b5v = (\u03c3x+\u03c3y+\u03c3z)/E \u00b7 (1 - 2\u03bc). For an incompressible material, volume change is zero (\u03b5v = 0), which mathematically requires (1 - 2\u03bc) = 0 => \u03bc = 0.50. For cork \u03bc \u2248 0; for rubber \u03bc \u2248 0.49 - 0.50.",
        "formulaContext": "Volumetric strain \u03b5v = (\u03c3x + \u03c3y + \u03c3z)/E \u00b7 (1 - 2\u03bc) = 0 => \u03bc = 0.50",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2023",
        "topic": "Elastic Constants",
        "subtopic": "Poisson's Ratio Upper Bound"
      },
      {
        "id": "ce-q-030",
        "sourceType": "MODELLED",
        "stem": "In a 2D stress system with normal stresses \u03c3x and \u03c3y and shear stress \u03c4xy, the radius of Mohr's circle of stress is equal to:",
        "options": [
          {
            "id": "A",
            "text": "(\u03c3x + \u03c3y) / 2"
          },
          {
            "id": "B",
            "text": "\u221a[((\u03c3x - \u03c3y)/2)\u00b2 + \u03c4xy\u00b2]"
          },
          {
            "id": "C",
            "text": "\u221a[((\u03c3x + \u03c3y)/2)\u00b2 + \u03c4xy\u00b2]"
          },
          {
            "id": "D",
            "text": "(\u03c3x - \u03c3y) / 2"
          }
        ],
        "correctOption": "B",
        "explanation": "The center of Mohr's circle is located at ((\u03c3x + \u03c3y)/2, 0) and its radius R represents the maximum in-plane shear stress \u03c4max = \u221a[((\u03c3x - \u03c3y)/2)\u00b2 + \u03c4xy\u00b2].",
        "formulaContext": "R = \u03c4max = \u221a[((\u03c3x - \u03c3y)/2)\u00b2 + \u03c4xy\u00b2]",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2022",
        "topic": "Principal Stresses",
        "subtopic": "Mohr's Circle Radius"
      },
      {
        "id": "ce-q-031",
        "sourceType": "MODELLED",
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
        "explanation": "By definition, principal planes are planes of zero shear stress. The normal stresses acting on these planes are known as the principal stresses (major and minor).",
        "formulaContext": "\u03c4 = 0 on principal planes",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Principal Planes",
        "subtopic": "Shear Stress on Principal Planes"
      },
      {
        "id": "ce-q-032",
        "sourceType": "MODELLED",
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
        "explanation": "A point of contraflexure is defined as a point along the beam span where the bending moment curve crosses zero and changes sign (from sagging to hogging or vice-versa). The beam curvature changes direction at this point.",
        "formulaContext": "M(x) = 0 and d\u00b2M/dx\u00b2 \u2260 0 (curvature changes sign)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2023",
        "topic": "Shear Force & Bending Moment",
        "subtopic": "Point of Contraflexure"
      },
      {
        "id": "ce-q-033",
        "sourceType": "MODELLED",
        "stem": "In the simple bending theory (Euler-Bernoulli beam theory), the bending stress (\u03c3) at a distance y from the neutral axis is given by:",
        "options": [
          {
            "id": "A",
            "text": "\u03c3 = M \u00b7 y / I"
          },
          {
            "id": "B",
            "text": "\u03c3 = M \u00b7 I / y"
          },
          {
            "id": "C",
            "text": "\u03c3 = I \u00b7 y / M"
          },
          {
            "id": "D",
            "text": "\u03c3 = M / (I \u00b7 y)"
          }
        ],
        "correctOption": "A",
        "explanation": "The classic flexure equation is M/I = \u03c3/y = E/R. Hence bending stress \u03c3 varies linearly across the cross-section, being zero at the neutral axis and maximum at the extreme fibers (y = ymax).",
        "formulaContext": "M / I = \u03c3 / y = E / R => \u03c3 = M \u00b7 y / I",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2021",
        "topic": "Bending Stresses",
        "subtopic": "Flexure Formula"
      },
      {
        "id": "ce-q-034",
        "sourceType": "MODELLED",
        "stem": "For a beam of rectangular cross-section of width b and depth d, the maximum shear stress (\u03c4max) is related to the average shear stress (\u03c4avg) by:",
        "options": [
          {
            "id": "A",
            "text": "\u03c4max = 1.20 \u03c4avg"
          },
          {
            "id": "B",
            "text": "\u03c4max = 1.33 \u03c4avg"
          },
          {
            "id": "C",
            "text": "\u03c4max = 1.50 \u03c4avg"
          },
          {
            "id": "D",
            "text": "\u03c4max = 2.00 \u03c4avg"
          }
        ],
        "correctOption": "C",
        "explanation": "The parabolic shear stress distribution for a rectangle is \u03c4 = (V / 2I) \u00b7 (d\u00b2/4 - y\u00b2). At the neutral axis (y = 0), \u03c4max = 1.5 \u00b7 (V / bd) = 1.50 \u00b7 \u03c4avg.",
        "formulaContext": "\u03c4max = 1.50 \u00b7 \u03c4avg (Rectangular); \u03c4max = 1.33 \u00b7 \u03c4avg (Circular)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Shear Stresses in Beams",
        "subtopic": "Maximum Shear Stress in Rectangular Section"
      },
      {
        "id": "ce-q-035",
        "sourceType": "MODELLED",
        "stem": "A solid circular shaft of diameter D is subjected to a torque T. The maximum shear stress induced at the outer surface is:",
        "options": [
          {
            "id": "A",
            "text": "16 T / (\u03c0 D\u00b3)"
          },
          {
            "id": "B",
            "text": "32 T / (\u03c0 D\u00b3)"
          },
          {
            "id": "C",
            "text": "64 T / (\u03c0 D\u00b3)"
          },
          {
            "id": "D",
            "text": "8 T / (\u03c0 D\u00b3)"
          }
        ],
        "correctOption": "A",
        "explanation": "From the torsion formula T/J = \u03c4/r, for a solid circular shaft J = \u03c0 D\u2074 / 32 and r = D/2. Thus \u03c4max = 16 T / (\u03c0 D\u00b3). Polar section modulus Zp = \u03c0 D\u00b3 / 16.",
        "formulaContext": "\u03c4max = T \u00b7 r / J = T \u00b7 (D/2) / (\u03c0 D\u2074 / 32) = 16 T / (\u03c0 D\u00b3)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2023",
        "topic": "Torsion of Circular Shafts",
        "subtopic": "Torsion Equation"
      },
      {
        "id": "ce-q-036",
        "sourceType": "MODELLED",
        "stem": "What is the maximum deflection at the free end of a cantilever beam of span L and flexural rigidity EI carrying a concentrated point load P at its free end?",
        "options": [
          {
            "id": "A",
            "text": "P L\u00b3 / (3 EI)"
          },
          {
            "id": "B",
            "text": "P L\u00b3 / (8 EI)"
          },
          {
            "id": "C",
            "text": "P L\u00b3 / (48 EI)"
          },
          {
            "id": "D",
            "text": "5 P L\u2074 / (384 EI)"
          }
        ],
        "correctOption": "A",
        "explanation": "By moment area theorem or double integration: Deflection \u03b4 = P L\u00b3 / (3 EI). For UDL over entire span, \u03b4 = w L\u2074 / (8 EI). For simply supported beam with central load, \u03b4 = P L\u00b3 / (48 EI).",
        "formulaContext": "\u03b4max = P L\u00b3 / (3 EI); \u03b8max = P L\u00b2 / (2 EI)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2022",
        "topic": "Deflection of Beams",
        "subtopic": "Cantilever with Point Load"
      },
      {
        "id": "ce-q-037",
        "sourceType": "MODELLED",
        "stem": "A long column of length L and flexural rigidity EI has both ends pinned (hinged). According to Euler's formula, the critical crippling load (Pcr) is:",
        "options": [
          {
            "id": "A",
            "text": "\u03c0\u00b2 EI / L\u00b2"
          },
          {
            "id": "B",
            "text": "4 \u03c0\u00b2 EI / L\u00b2"
          },
          {
            "id": "C",
            "text": "\u03c0\u00b2 EI / (4 L\u00b2)"
          },
          {
            "id": "D",
            "text": "2 \u03c0\u00b2 EI / L\u00b2"
          }
        ],
        "correctOption": "A",
        "explanation": "Euler crippling load Pcr = \u03c0\u00b2 EI / Leff\u00b2. For both ends hinged: Leff = L => Pcr = \u03c0\u00b2 EI / L\u00b2. For both ends fixed: Leff = L/2 => Pcr = 4 \u03c0\u00b2 EI / L\u00b2. For one fixed and one free: Leff = 2L => Pcr = \u03c0\u00b2 EI / (4 L\u00b2). For one fixed and one hinged: Leff = L/\u221a2 => Pcr = 2 \u03c0\u00b2 EI / L\u00b2.",
        "formulaContext": "Pcr = \u03c0\u00b2 EI / Leff\u00b2; Leff = L (both ends hinged)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Columns & Struts",
        "subtopic": "Euler Buckling Load & Effective Length"
      }
    ],
    "unitName": "Structural Engineering",
    "codeClause": "Mechanics of Deformable Solids",
    "confidencePercent": 80,
    "masteredStatus": "Mastered",
    "diagramType": "som",
    "subtopicList": [
      "Elastic Constants (E, G, K, mu)",
      "Mohr's Circle & Principal Stresses",
      "SFD & BMD for Determinate Beams",
      "Bending & Shear Stresses in Sections",
      "Torsion of Circular Shafts",
      "Euler's Column Buckling"
    ],
    "comparisonGrid": {
      "titleLeft": "Pure Bending Theory",
      "tagLeft": "Bernoulli-Euler",
      "valueLeft": "\u03c3 / y = M / I = E / R",
      "descLeft": "Stresses vary linearly across the beam depth with zero stress at the neutral axis. Plane sections remain plane.",
      "titleRight": "Torsion of Shafts",
      "tagRight": "Coulomb Theory",
      "valueRight": "T / J = \u03c4 / r = G\u03b8 / L",
      "descRight": "Shear stress varies linearly from zero at center to maximum at outer radius. Polar moment of inertia J = pi*D^4 / 32."
    },
    "callouts": {
      "corePostulate": "Relationships between elastic constants: E = 2G(1 + mu) = 3K(1 - 2mu) = 9KG / (3K + G). For isotropic materials, Poisson's ratio mu lies between 0 and 0.5.",
      "corePostulateRef": "Elasticity Fundamentals",
      "examTrap": "In a rectangular section, max shear stress is 1.5 * tau_avg at the neutral axis. In a triangular section, max shear stress is 1.5 * tau_avg at h/2, NOT at the neutral axis (h/3)!",
      "examTrapRef": "APSC AE 2018, SSC JE 2021",
      "testedRatios": [
        {
          "label": "Columns Both Ends Hinged:",
          "value": "Le = 1.0 L"
        },
        {
          "label": "Columns Both Ends Fixed:",
          "value": "Le = 0.5 L (design 0.65L)"
        },
        {
          "label": "One Fixed, One Free:",
          "value": "Le = 2.0 L"
        },
        {
          "label": "One Fixed, One Hinged:",
          "value": "Le = 0.707 L (design 0.8L)"
        }
      ],
      "numericalShortcut": {
        "formula": "Euler Buckling Load Pcr = (pi\u00b2 \u00b7 E \u00b7 I) / Le\u00b2",
        "note": "Euler formula applies only to long/slender columns where slenderness ratio lambda > 89 for mild steel."
      }
    },
    "aiTutorPrompts": [
      {
        "question": "How do you find the center and radius of Mohr's Circle?",
        "answerPreview": "Center is at ((sigma_x + sigma_y)/2, 0). Radius is R = sqrt(((sigma_x - sigma_y)/2)^2 + tau_xy^2). The maximum in-plane shear stress equals the radius R."
      },
      {
        "question": "What is the core or kern of a section?",
        "answerPreview": "The region within which a compressive load can act without causing any tensile stresses anywhere in the cross-section. For a rectangle b x d, kern is a rhombus with diagonals b/3 and d/3."
      }
    ]
  },
  {
    "id": "civil-geotech",
    "title": "Geotechnical Engineering: Consolidation & Bearing Capacity",
    "subject": "Geotechnical Engineering",
    "category": "civil",
    "readTime": "16 min read",
    "weightage": "HIGH_YIELD",
    "icon": "Mountain",
    "summary": "Soil phase relations, 1D Terzaghi consolidation, Mohr-Coulomb shear strength, Rankine earth pressure, and Terzaghi shallow bearing capacity.",
    "prerequisites": [
      "Fluid Mechanics",
      "Mechanics of Solids"
    ],
    "standardReferences": [
      "Terzaghi & Peck",
      "IS 6403 Bearing Capacity"
    ],
    "practiceQuestionIds": [
      "ce-q-038",
      "ce-q-039",
      "ce-q-040",
      "ce-q-041",
      "ce-q-042",
      "ce-q-043",
      "ce-q-044",
      "ce-q-045",
      "ce-q-046",
      "ce-q-047",
      "ce-q-048",
      "ce-q-049",
      "ce-q-050",
      "ce-q-051",
      "ce-q-052"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "stepTitle": "Soil Phase Relations & Index Properties",
        "subtitle": "Void ratio, degree of saturation, unit weights, and Casagrande chart",
        "keyConcept": "Soil consists of solids, water, and air voids. The fundamental relation is S * e = w * G. On the Casagrande plasticity chart, the A-line separates clays from silts.",
        "formulaOrCode": "S \\cdot e = w \\cdot G \\quad ; \\quad I_p = 0.73 (w_L - 20) \\quad ; \\quad \\gamma_{sat} = \\frac{G + e}{1 + e} \\gamma_w",
        "highYieldFacts": [
          "Void ratio e can exceed 1.0; porosity n is strictly between 0 and 100%.",
          "Submerged unit weight gamma_sub = ((G - 1) / (1 + e)) * gamma_w.",
          "Soils above the A-line are inorganic clays (CL, CI, CH); below are inorganic silts (ML, MI, MH) or organic soils.",
          "Toughness index = I_p / Flow Index (I_f)."
        ],
        "examTrap": "If soil falls in the plasticity index range 4 <= I_p <= 7 near the A-line, it receives dual classification CL-ML.",
        "benchmarkExample": {
          "question": "A saturated soil has water content 25% and G = 2.65. What is its void ratio?",
          "options": [
            "0.55",
            "0.66",
            "0.75",
            "0.85"
          ],
          "correctAnswer": "0.66",
          "stepByStepSolution": [
            "Step 1: Saturated implies S = 1.0.",
            "Step 2: S * e = w * G => 1.0 * e = 0.25 * 2.65.",
            "Step 3: e = 0.6625 (approx 0.66)."
          ],
          "takeaway": "S * e = w * G connects the core soil index properties."
        },
        "pointers": [
          "Void ratio e can exceed 1.0; porosity n is strictly between 0 and 100%.",
          "Submerged unit weight gamma_sub = ((G - 1) / (1 + e)) * gamma_w.",
          "Soils above the A-line are inorganic clays (CL, CI, CH); below are inorganic silts (ML, MI, MH) or organic soils.",
          "Toughness index = I_p / Flow Index (I_f)."
        ]
      },
      {
        "stepNumber": 2,
        "stepTitle": "Terzaghi 1D Consolidation & Settlement",
        "subtitle": "Pore water dissipation, coefficient of consolidation, and drainage length",
        "keyConcept": "Consolidation settlement occurs due to gradual dissipation of excess pore water pressure in saturated cohesive soils under sustained static loads.",
        "formulaOrCode": "T_v = \\frac{c_v t}{d^2} \\quad ; \\quad S_f = \\frac{C_c H_0}{1 + e_0} \\log_{10}\\left(\\frac{\\sigma'_0 + \\Delta \\sigma'}{\\sigma'_0}\\right)",
        "highYieldFacts": [
          "Double drainage path d = H / 2; Single drainage path d = H.",
          "Consolidation time t is proportional to d^2. Single drainage takes 4 times longer than double drainage!",
          "Compression index formula: C_c = 0.009 * (w_L - 10) for undisturbed clays.",
          "Coefficient of volume compressibility m_v = a_v / (1 + e_0)."
        ],
        "examTrap": "Single drainage takes 4 TIMES as long as double drainage because drainage distance is squared in T_v = c_v * t / d^2.",
        "benchmarkExample": {
          "question": "A clay layer consolidates 50% in 2 years with double drainage. How long would it take if drainage is from top only?",
          "options": [
            "2 years",
            "4 years",
            "8 years",
            "16 years"
          ],
          "correctAnswer": "8 years",
          "stepByStepSolution": [
            "Step 1: t_single / t_double = (H)^2 / (H / 2)^2 = 4.",
            "Step 2: t_single = 4 * 2 years = 8 years."
          ],
          "takeaway": "Single drainage takes 4x longer than double drainage."
        },
        "pointers": [
          "Double drainage path d = H / 2; Single drainage path d = H.",
          "Consolidation time t is proportional to d^2. Single drainage takes 4 times longer than double drainage!",
          "Compression index formula: C_c = 0.009 * (w_L - 10) for undisturbed clays.",
          "Coefficient of volume compressibility m_v = a_v / (1 + e_0)."
        ]
      },
      {
        "stepNumber": 3,
        "stepTitle": "Lateral Earth Pressure & Bearing Capacity",
        "subtitle": "Rankine's active/passive states and Terzaghi's bearing capacity equation",
        "keyConcept": "Rankine earth pressure determines active (wall moves away) and passive (wall pushed into soil) pressures. Terzaghi's bearing capacity formula determines ultimate bearing capacity of shallow footings.",
        "formulaOrCode": "K_a = \\frac{1 - \\sin \\phi}{1 + \\sin \\phi} \\quad ; \\quad q_{ult} = c N_c + q N_q + 0.5 \\gamma B N_\\gamma",
        "highYieldFacts": [
          "For phi = 30 degrees: K_a = 1/3, K_p = 3.",
          "Depth of tension crack in clay: z_0 = 2c / (gamma * sqrt(K_a)).",
          "For a strip footing on purely cohesive clay (phi = 0): N_c = 5.7, N_q = 1.0, N_gamma = 0; q_net,ult = 5.7 c.",
          "For circular footing: q_ult = 1.3 c N_c + q N_q + 0.3 gamma B N_gamma."
        ],
        "examTrap": "Critical unsupported excavation depth in clay is 2 * z_0 = 4c / gamma, which is twice the tension crack depth.",
        "benchmarkExample": {
          "question": "What is the net ultimate bearing capacity of a strip footing founded on purely cohesive clay with cohesion c = 40 kPa per Terzaghi?",
          "options": [
            "120 kPa",
            "200 kPa",
            "228 kPa",
            "256 kPa"
          ],
          "correctAnswer": "228 kPa",
          "stepByStepSolution": [
            "Step 1: For strip footing on clay (phi = 0): q_net,ult = c * N_c.",
            "Step 2: Terzaghi N_c for strip footing = 5.7.",
            "Step 3: q_net,ult = 40 * 5.7 = 228 kPa."
          ],
          "takeaway": "Pure clay strip footing: q_net,ult = 5.7 c (Skempton uses N_c = 5.0 to 7.5 depending on depth)."
        },
        "pointers": [
          "For phi = 30 degrees: K_a = 1/3, K_p = 3.",
          "Depth of tension crack in clay: z_0 = 2c / (gamma * sqrt(K_a)).",
          "For a strip footing on purely cohesive clay (phi = 0): N_c = 5.7, N_q = 1.0, N_gamma = 0; q_net,ult = 5.7 c.",
          "For circular footing: q_ult = 1.3 c N_c + q N_q + 0.3 gamma B N_gamma."
        ]
      }
    ],
    "fullDescription": "Comprehensive module covering fundamental and advanced concepts of Geotechnical Engineering: Consolidation & Bearing Capacity tailored for competitive civil engineering examinations (GATE, ESE, SSC JE, State AE/JE). Includes key principles, governing IS/IRC code formulas, exam traps, and benchmark problems.",
    "syllabusCoverage": [
      "Core Principles of Geotechnical Engineering",
      "Governing Specifications & Code Clauses",
      "High-Yield Problem Solving & Formula Derivations",
      "Previous Year Questions (PYQs) & Exam Pitfalls"
    ],
    "topicQuestions": [
      {
        "id": "ce-q-038",
        "sourceType": "MODELLED",
        "stem": "In soil mechanics, which of the following equations correctly connects degree of saturation (S), void ratio (e), water content (w), and specific gravity (G)?",
        "options": [
          {
            "id": "A",
            "text": "S \u00b7 e = w \u00b7 G"
          },
          {
            "id": "B",
            "text": "S \u00b7 w = e \u00b7 G"
          },
          {
            "id": "C",
            "text": "S \u00b7 G = w \u00b7 e"
          },
          {
            "id": "D",
            "text": "w \u00b7 e \u00b7 S = G"
          }
        ],
        "correctOption": "A",
        "explanation": "By definition, S = Vw / Vv and e = Vv / Vs => S \u00b7 e = Vw / Vs = (Mw / \u03c1w) / (Ms / (G \u00b7 \u03c1w)) = (Mw / Ms) \u00b7 G = w \u00b7 G. Hence S \u00b7 e = w \u00b7 G.",
        "formulaContext": "S \u00b7 e = w \u00b7 G",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Soil Properties & Phase Relationships",
        "subtopic": "Fundamental Relationship"
      },
      {
        "id": "ce-q-039",
        "sourceType": "MODELLED",
        "stem": "In the Indian Standard Soil Classification System (IS 1498), the equation of the 'A-line' on the plasticity chart separating clays from silts and organic soils is:",
        "options": [
          {
            "id": "A",
            "text": "IP = 0.73 \u00b7 (wL - 20)"
          },
          {
            "id": "B",
            "text": "IP = 0.90 \u00b7 (wL - 8)"
          },
          {
            "id": "C",
            "text": "IP = 0.73 \u00b7 (wL - 10)"
          },
          {
            "id": "D",
            "text": "IP = 0.50 \u00b7 (wL - 20)"
          }
        ],
        "correctOption": "A",
        "explanation": "Arthur Casagrande's A-line equation is IP = 0.73 \u00b7 (wL - 20). Inorganic clays lie above the A-line; inorganic silts and organic clays lie below the A-line. The U-line (upper limit) is IP = 0.90 \u00b7 (wL - 8).",
        "formulaContext": "IP = 0.73 \u00b7 (wL - 20)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2023",
        "topic": "Soil Classification",
        "subtopic": "Plasticity Chart & A-Line Equation"
      },
      {
        "id": "ce-q-040",
        "sourceType": "MODELLED",
        "stem": "According to Terzaghi's effective stress principle, total stress (\u03c3), effective stress (\u03c3'), and pore water pressure (u) are related by:",
        "options": [
          {
            "id": "A",
            "text": "\u03c3' = \u03c3 - u"
          },
          {
            "id": "B",
            "text": "\u03c3' = \u03c3 + u"
          },
          {
            "id": "C",
            "text": "\u03c3' = u - \u03c3"
          },
          {
            "id": "D",
            "text": "\u03c3' = \u03c3 / u"
          }
        ],
        "correctOption": "A",
        "explanation": "The effective stress \u03c3' is the intergranular stress transmitted across grain contacts that governs shear strength and volume compressibility: \u03c3' = \u03c3 - u.",
        "formulaContext": "\u03c3' = \u03c3 - u",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2022",
        "topic": "Effective Stress Principle",
        "subtopic": "Terzaghi's Principle"
      },
      {
        "id": "ce-q-041",
        "sourceType": "MODELLED",
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
        "explanation": "Constant head permeameter is used for coarse-grained soils with high permeability (sands, gravels). Falling head permeameter is suitable for fine-grained soils (silts and clays) where discharge is very small.",
        "formulaContext": "k = (2.303 a L / (A t)) \u00b7 log10(h1 / h2)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Permeability of Soils",
        "subtopic": "Constant vs Falling Head Permeameter"
      },
      {
        "id": "ce-q-042",
        "sourceType": "MODELLED",
        "stem": "In a flow net constructed with Nf flow channels and Nd equipotential drops under total head loss H, the seepage discharge per unit length through soil of permeability k is:",
        "options": [
          {
            "id": "A",
            "text": "q = k \u00b7 H \u00b7 (Nf / Nd)"
          },
          {
            "id": "B",
            "text": "q = k \u00b7 H \u00b7 (Nd / Nf)"
          },
          {
            "id": "C",
            "text": "q = k \u00b7 H \u00b7 (Nf \u00b7 Nd)"
          },
          {
            "id": "D",
            "text": "q = k \u00b7 H / (Nf + Nd)"
          }
        ],
        "correctOption": "A",
        "explanation": "Flow net discharge is given by q = k \u00b7 H \u00b7 (Nf / Nd) for square flow elements where aspect ratio b/a = 1. Shape factor is defined as (Nf / Nd).",
        "formulaContext": "q = k \u00b7 H \u00b7 (Nf / Nd)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2023",
        "topic": "Seepage & Flow Nets",
        "subtopic": "Seepage Discharge Equation"
      },
      {
        "id": "ce-q-043",
        "sourceType": "MODELLED",
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
        "explanation": "Quicksand occurs when upward seepage force balances submerged weight of soil particles (effective stress \u03c3' = 0). Thus i \u00b7 \u03b3w = \u03b3' => icr = \u03b3' / \u03b3w = (G - 1) / (1 + e). For typical soils (G \u2248 2.65, e \u2248 0.65), icr \u2248 1.0.",
        "formulaContext": "icr = \u03b3' / \u03b3w = (G - 1) / (1 + e)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2021",
        "topic": "Quick Sand Condition",
        "subtopic": "Critical Hydraulic Gradient"
      },
      {
        "id": "ce-q-044",
        "sourceType": "MODELLED",
        "stem": "In Terzaghi's 1D consolidation theory, the non-dimensional time factor (Tv) is expressed as:",
        "options": [
          {
            "id": "A",
            "text": "Tv = Cv \u00b7 t / d\u00b2"
          },
          {
            "id": "B",
            "text": "Tv = Cv \u00b7 d\u00b2 / t"
          },
          {
            "id": "C",
            "text": "Tv = k \u00b7 t / Cv"
          },
          {
            "id": "D",
            "text": "Tv = mv \u00b7 t / d\u00b2"
          }
        ],
        "correctOption": "A",
        "explanation": "Time factor Tv = Cv \u00b7 t / d\u00b2, where Cv is coefficient of consolidation, t is time, and d is length of drainage path (d = H/2 for two-way double drainage, d = H for single one-way drainage).",
        "formulaContext": "Tv = Cv \u00b7 t / d\u00b2",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Consolidation of Soils",
        "subtopic": "Time Factor and Drainage Path"
      },
      {
        "id": "ce-q-045",
        "sourceType": "MODELLED",
        "stem": "For undisturbed clays of medium to low sensitivity, Skempton's empirical formula for compression index (Cc) based on liquid limit (wL in %) is:",
        "options": [
          {
            "id": "A",
            "text": "Cc = 0.009 \u00b7 (wL - 10)"
          },
          {
            "id": "B",
            "text": "Cc = 0.007 \u00b7 (wL - 10)"
          },
          {
            "id": "C",
            "text": "Cc = 0.009 \u00b7 (wL - 20)"
          },
          {
            "id": "D",
            "text": "Cc = 0.005 \u00b7 (wL - 15)"
          }
        ],
        "correctOption": "A",
        "explanation": "Skempton's widely verified empirical relationship is: Cc = 0.009 \u00b7 (wL - 10) for undisturbed clays, and Cc = 0.007 \u00b7 (wL - 10) for remolded clays.",
        "formulaContext": "Cc = 0.009 \u00b7 (wL - 10) for undisturbed clays",
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / APSC AE Civil 2023",
        "topic": "Consolidation of Soils",
        "subtopic": "Compression Index Empirical Formula"
      },
      {
        "id": "ce-q-046",
        "sourceType": "MODELLED",
        "stem": "The shear strength (\u03c4f) of a soil on any plane according to Mohr-Coulomb failure criterion is represented by:",
        "options": [
          {
            "id": "A",
            "text": "\u03c4f = c + \u03c3 \u00b7 tan \u03c6"
          },
          {
            "id": "B",
            "text": "\u03c4f = c - \u03c3 \u00b7 tan \u03c6"
          },
          {
            "id": "C",
            "text": "\u03c4f = \u03c3 + c \u00b7 tan \u03c6"
          },
          {
            "id": "D",
            "text": "\u03c4f = c \u00b7 \u03c3 \u00b7 tan \u03c6"
          }
        ],
        "correctOption": "A",
        "explanation": "Coulomb's shear strength equation states that shear strength comprises apparent cohesion c and frictional resistance proportional to effective normal stress \u03c3: \u03c4f = c + \u03c3 tan \u03c6.",
        "formulaContext": "\u03c4f = c + \u03c3 \u00b7 tan \u03c6 (Total) or \u03c4f = c' + \u03c3' \u00b7 tan \u03c6' (Effective)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2022",
        "topic": "Shear Strength of Soil",
        "subtopic": "Mohr-Coulomb Failure Criteria"
      },
      {
        "id": "ce-q-047",
        "sourceType": "MODELLED",
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
        "explanation": "In Consolidated Undrained (CU) test: Consolidation stage has drainage valve open (dissipating excess pore pressure under confining pressure \u03c33); during the subsequent shearing stage (application of deviator stress \u0394\u03c3), the drainage valve is closed.",
        "formulaContext": "CU test: Drainage open during cell pressure consolidation, closed during shearing",
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Shear Strength Testing",
        "subtopic": "Triaxial Drainage Conditions"
      },
      {
        "id": "ce-q-048",
        "sourceType": "MODELLED",
        "stem": "For a cohesionless backfill with horizontal ground surface and angle of internal friction \u03c6, Rankine's coefficient of active earth pressure (Ka) is:",
        "options": [
          {
            "id": "A",
            "text": "Ka = (1 - sin \u03c6) / (1 + sin \u03c6)"
          },
          {
            "id": "B",
            "text": "Ka = (1 + sin \u03c6) / (1 - sin \u03c6)"
          },
          {
            "id": "C",
            "text": "Ka = cos\u00b2 \u03c6 / (1 + sin \u03c6)"
          },
          {
            "id": "D",
            "text": "Ka = (1 - cos \u03c6) / (1 + cos \u03c6)"
          }
        ],
        "correctOption": "A",
        "explanation": "Rankine's active coefficient is Ka = (1 - sin \u03c6) / (1 + sin \u03c6) = tan\u00b2(45\u00b0 - \u03c6/2). Conversely, passive pressure coefficient Kp = 1 / Ka = (1 + sin \u03c6) / (1 - sin \u03c6) = tan\u00b2(45\u00b0 + \u03c6/2).",
        "formulaContext": "Ka = (1 - sin \u03c6) / (1 + sin \u03c6) = tan\u00b2(45\u00b0 - \u03c6/2)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2023",
        "topic": "Lateral Earth Pressure",
        "subtopic": "Rankine's Active Pressure Coefficient"
      },
      {
        "id": "ce-q-049",
        "sourceType": "MODELLED",
        "stem": "Terzaghi's ultimate bearing capacity (qu) equation for a continuous strip footing of width B at depth Df in soil with parameters c, \u03b3, and bearing capacity factors Nc, Nq, N\u03b3 is:",
        "options": [
          {
            "id": "A",
            "text": "qu = c Nc + q Nq + 0.5 \u03b3 B N\u03b3"
          },
          {
            "id": "B",
            "text": "qu = 1.3 c Nc + q Nq + 0.4 \u03b3 B N\u03b3"
          },
          {
            "id": "C",
            "text": "qu = 1.3 c Nc + q Nq + 0.3 \u03b3 B N\u03b3"
          },
          {
            "id": "D",
            "text": "qu = c Nc + q Nq + \u03b3 B N\u03b3"
          }
        ],
        "correctOption": "A",
        "explanation": "For a strip footing: qu = c Nc + q Nq + 0.5 \u03b3 B N\u03b3. For a square footing: qu = 1.3 c Nc + q Nq + 0.4 \u03b3 B N\u03b3. For a circular footing: qu = 1.3 c Nc + q Nq + 0.3 \u03b3 B N\u03b3.",
        "formulaContext": "qu = c Nc + \u03b3 Df Nq + 0.5 \u03b3 B N\u03b3",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Bearing Capacity of Foundations",
        "subtopic": "Terzaghi's Equation for Strip Footing"
      },
      {
        "id": "ce-q-050",
        "sourceType": "MODELLED",
        "stem": "The net ultimate bearing capacity (qnu) of a foundation is defined in terms of gross ultimate bearing capacity (qu) and effective surcharge (q = \u03b3 Df) as:",
        "options": [
          {
            "id": "A",
            "text": "qnu = qu - \u03b3 \u00b7 Df"
          },
          {
            "id": "B",
            "text": "qnu = qu + \u03b3 \u00b7 Df"
          },
          {
            "id": "C",
            "text": "qnu = qu / (\u03b3 \u00b7 Df)"
          },
          {
            "id": "D",
            "text": "qnu = (qu - \u03b3 \u00b7 Df) / FOS"
          }
        ],
        "correctOption": "A",
        "explanation": "Net ultimate bearing capacity is the net intensity of pressure at the base of the footing in excess of the existing overburden pressure that the soil can support: qnu = qu - \u03b3 Df. Net safe bearing capacity qns = qnu / FOS.",
        "formulaContext": "qnu = qu - q = qu - \u03b3 \u00b7 Df",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2021",
        "topic": "Bearing Capacity Definitions",
        "subtopic": "Net Ultimate Bearing Capacity"
      },
      {
        "id": "ce-q-051",
        "sourceType": "MODELLED",
        "stem": "The dilatancy correction for observed SPT N-value in fine sands and silts below water table is applied only when the corrected value for overburden (N1) exceeds 15, using the formula:",
        "options": [
          {
            "id": "A",
            "text": "N'' = 15 + 0.5 \u00b7 (N' - 15)"
          },
          {
            "id": "B",
            "text": "N'' = 15 + 0.75 \u00b7 (N' - 15)"
          },
          {
            "id": "C",
            "text": "N'' = 15 + 0.25 \u00b7 (N' - 15)"
          },
          {
            "id": "D",
            "text": "N'' = 0.5 \u00b7 (N' + 15)"
          }
        ],
        "correctOption": "A",
        "explanation": "As per IS 2131, negative pore water pressures during dynamic shearing increase resistance in dense saturated silts and fine sands. When N' > 15, the dilatancy correction is N'' = 15 + 0.5(N' - 15).",
        "formulaContext": "N'' = 15 + 0.5 \u00b7 (N' - 15) per IS 2131",
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Standard Penetration Test (SPT)",
        "subtopic": "Dilatancy Correction"
      },
      {
        "id": "ce-q-052",
        "sourceType": "MODELLED",
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
        "explanation": "Negative skin friction is a downward drag acting on pile shaft when consolidating compressible soil (soft clay, recent fill) settles faster than the pile, adding downward load to the pile instead of providing upward support.",
        "formulaContext": "Downward drag force Qnf = P \u00b7 L \u00b7 \u03b1 \u00b7 c",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2023",
        "topic": "Pile Foundations",
        "subtopic": "Negative Skin Friction"
      }
    ],
    "unitName": "Geotechnical Engineering",
    "codeClause": "IS 1498, IS 2720, IS 6403",
    "confidencePercent": 55,
    "masteredStatus": "In Progress",
    "diagramType": "geotech",
    "subtopicList": [
      "Three-Phase Soil Relationships (e, n, w, S, G)",
      "Plasticity Chart & USCS/IS Classification",
      "Darcy's Law, Permeability & Seepage",
      "Terzaghi 1D Consolidation Theory",
      "Mohr-Coulomb Shear Strength & Triaxial",
      "Rankine & Coulomb Earth Pressure",
      "Terzaghi Bearing Capacity & Pile Groups"
    ],
    "comparisonGrid": {
      "titleLeft": "Active Earth Pressure",
      "tagLeft": "Wall moves OUT",
      "valueLeft": "Ka = (1 - sin\u03c6) / (1 + sin\u03c6)",
      "descLeft": "Minimum lateral earth pressure developed when retaining wall deflects away from the retained backfill.",
      "titleRight": "Passive Earth Pressure",
      "tagRight": "Wall pushes IN",
      "valueRight": "Kp = (1 + sin\u03c6) / (1 - sin\u03c6) = 1/Ka",
      "descRight": "Maximum lateral earth resistance developed when retaining structure is forced into the soil mass."
    },
    "callouts": {
      "corePostulate": "Terzaghi's effective stress principle: total stress sigma = sigma' + u. All physical responses (compression, shearing resistance, consolidation) depend strictly on effective stress sigma'.",
      "corePostulateRef": "Terzaghi Soil Mechanics",
      "examTrap": "Quick sand condition is NOT a type of soil! It is a hydraulic boiling phenomenon in cohesionless sands when upward hydraulic gradient reaches critical value icr = (G - 1) / (1 + e) \u2248 1.0.",
      "examTrapRef": "APSC AE 2020 & ESE",
      "testedRatios": [
        {
          "label": "A-line Plasticity Equation:",
          "value": "IP = 0.73 \u00b7 (wL - 20)"
        },
        {
          "label": "Compression Index (Undisturbed):",
          "value": "Cc = 0.009 \u00b7 (wL - 10)"
        },
        {
          "label": "Converse-Labarre Pile Efficiency:",
          "value": "eta = 1 - theta(n-1)m + m-1..."
        },
        {
          "label": "Safe Bearing Capacity:",
          "value": "q_safe = (q_net_ult / FOS) + gamma*Df"
        }
      ],
      "numericalShortcut": {
        "formula": "Terzaghi Strip Footing qu = c \u00b7 Nc + q \u00b7 Nq + 0.5 \u00b7 gamma \u00b7 B \u00b7 Ngamma",
        "note": "For circular footings multiply c*Nc by 1.3 and gamma*B*Ngamma by 0.6. For square footings multiply c*Nc by 1.3 and gamma*B*Ngamma by 0.8."
      }
    },
    "aiTutorPrompts": [
      {
        "question": "How do you distinguish between clays and silts on the plasticity chart?",
        "answerPreview": "Plot the soil with (Liquid Limit, Plasticity Index). Points plotting ABOVE the A-line (IP = 0.73(wL - 20)) are inorganic clays (CL, CI, CH). Points BELOW the A-line are silts (ML, MI, MH) or organic soils."
      },
      {
        "question": "What is the difference between direct shear test and triaxial test?",
        "answerPreview": "In direct shear, failure plane is predetermined horizontally and stress distribution is non-uniform with no pore pressure control. In triaxial, failure occurs along the weakest natural plane with precise pore pressure measurement (UU, CU, CD)."
      }
    ]
  },
  {
    "id": "gs-assam-history",
    "title": "History & Heritage of Assam: Ahom Era & Freedom Movement",
    "subject": "Assam History & Culture",
    "category": "gs",
    "readTime": "20 min read",
    "weightage": "HIGH_YIELD",
    "icon": "Crown",
    "summary": "Ancient Pragjyotisha-Kamarupa, the 600-year Ahom Kingdom (1228\u20131826), Battle of Saraighat, Paik system, Treaty of Yandabo, and Assam's vanguard martyrs in the Freedom Struggle.",
    "prerequisites": [
      "General Indian History overview"
    ],
    "standardReferences": [
      "Edward Gait: A History of Assam",
      "Dr. S.L. Baruah: Comprehensive History of Assam"
    ],
    "practiceQuestionIds": [
      "gs-q-081",
      "gs-q-082",
      "gs-q-083",
      "gs-q-084",
      "gs-q-085",
      "gs-q-086",
      "gs-q-087",
      "gs-q-088",
      "gs-q-089",
      "gs-q-090"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "stepTitle": "Pre-Ahom Kamarupa & Ancient Dynasties",
        "subtitle": "Pragjyotisha, Varman dynasty, and Kumar Bhaskaravarman",
        "keyConcept": "Ancient Assam was known as Pragjyotisha in the Epics and Kamarupa in Sanskrit literature (Allahabad Pillar Inscription of Samudragupta mentions Kamarupa as a frontier kingdom). The Varman dynasty (4th-7th century CE) established sovereignty, peaking under Kumar Bhaskaravarman.",
        "formulaOrCode": "\\text{Dynastic Sequence: Varman } \\to \\text{Salasthambha (Mlechha) } \\to \\text{Pala Dynasty}",
        "highYieldFacts": [
          "Pushyavarman founded the Varman dynasty (~350 CE).",
          "Kumar Bhaskaravarman was a close ally of Emperor Harshavardhana of Kannauj and hosted Chinese Buddhist monk Hiuen Tsang (Xuanzang) in 643 CE.",
          "Hiuen Tsang recorded Kamarupa in his travelogue 'Si-Yu-Ki', noting flourishing education and silk weaving.",
          "Bhagadatta, king of Pragjyotisha, fought on the Kaurava side in the Mahabharata."
        ],
        "examTrap": "Kumar Bhaskaravarman was contemporary to Harshavardhana of Kannauj, NOT Chandragupta Maurya.",
        "benchmarkExample": {
          "question": "Which Chinese pilgrim visited Kamarupa in the 7th century during the reign of Kumar Bhaskaravarman?",
          "options": [
            "Fa-Hien",
            "Hiuen Tsang (Xuanzang)",
            "I-Tsing",
            "Al-Biruni"
          ],
          "correctAnswer": "Hiuen Tsang (Xuanzang)",
          "stepByStepSolution": [
            "Step 1: Bhaskaravarman ruled in the early 7th century CE.",
            "Step 2: Xuanzang visited India during Harshavardhana's reign and spent months in Kamarupa in 643 CE.",
            "Step 3: Documented in 'Si-Yu-Ki'."
          ],
          "takeaway": "Hiuen Tsang visited Kamarupa in 643 CE upon Bhaskaravarman's invitation."
        }
      },
      {
        "stepNumber": 2,
        "stepTitle": "The Ahom Kingdom (1228\u20131826) & Administrative System",
        "subtitle": "Sukapha's arrival, Paik System, Buranjis, and administrative hierarchy",
        "keyConcept": "Chaolung Sukapha crossed the Patkai hills in 1228 CE, establishing the Ahom capital at Charaideo in 1253. Ahoms ruled for nearly 600 years through their unique administrative, economic, and military system known as the Paik system.",
        "formulaOrCode": "\\text{Paik Structure: 4 Paiks (later 3) = 1 Got} \\quad ; \\quad 20 = \\text{Bora}, \\quad 100 = \\text{Saikia}, \\quad 1000 = \\text{Hazarika}",
        "highYieldFacts": [
          "Sukapha arrived in 1228 CE; capital established at Charaideo (now a UNESCO World Heritage Site).",
          "Paik System: Every able-bodied adult male (aged 15 to 50) was registered as a Paik, providing compulsory state labor and military service in rotation.",
          "Officers hierarchy: Bora (20 paiks), Saikia (100 paiks), Hazarika (1,000 paiks), Phukan / Rajkhowa (commanders).",
          "Suhungmung (Dihingia Raja) created the 3rd minister post 'Barpatragohain', adopted Hindu title 'Swarganarayan', and introduced Saka era.",
          "Buranjis: Official state historical chronicles written in Ahom and Assamese language."
        ],
        "examTrap": "The office of Barpatragohain was NOT created by Sukapha; it was added by King Suhungmung in the early 16th century.",
        "benchmarkExample": {
          "question": "Which Ahom king introduced the third minister position 'Barpatragohain'?",
          "options": [
            "Chaolung Sukapha",
            "Suhungmung (Dihingia Raja)",
            "Pratap Singha",
            "Rudra Singha"
          ],
          "correctAnswer": "Suhungmung (Dihingia Raja)",
          "stepByStepSolution": [
            "Step 1: The original council included Borgohain and Burhagohain.",
            "Step 2: Suhungmung created Barpatragohain for Konseng.",
            "Step 3: Suhungmung also expanded the kingdom and introduced Saka era."
          ],
          "takeaway": "Suhungmung created Barpatragohain and took title Swarganarayan."
        }
      },
      {
        "stepNumber": 3,
        "stepTitle": "Lachit Borphukan & The Battle of Saraighat (1671)",
        "subtitle": "Naval war on the Brahmaputra, Ram Singh, and defense of Kamrup",
        "keyConcept": "The Battle of Saraighat (1671) was the decisive naval conflict on the Brahmaputra River between the Mughal fleet under Raja Ram Singh I of Amber and Ahom forces led by General Lachit Borphukan, preserving Assam's independence.",
        "formulaOrCode": "\\text{Saraighat (1671): Ahom Naval Guerrilla Tactics} > \\text{Mughal Heavy Artillery}",
        "highYieldFacts": [
          "Chakradhwaj Singha appointed Lachit as Borphukan in 1667 to liberate Guwahati.",
          "Famous quote: 'Dexot koi Momai dangor nohoi' (My uncle is not greater than my motherland).",
          "Ahom light Bachari boats outmaneuvered heavy Mughal ships on the Brahmaputra river.",
          "Lachit Maidam is situated at Hoolungapara near Jorhat.",
          "Saraighat Bridge (first rail-cum-road bridge over Brahmaputra) was inaugurated in 1962 near this site."
        ],
        "examTrap": "Saraighat occurred in 1671. Mir Jumla's earlier invasion occurred in 1662-63 under Jayadhwaj Singha.",
        "benchmarkExample": {
          "question": "Who was the Ahom King during the historic Battle of Saraighat in 1671?",
          "options": [
            "Jayadhwaj Singha",
            "Chakradhwaj Singha",
            "Rudra Singha",
            "Gadadhar Singha"
          ],
          "correctAnswer": "Chakradhwaj Singha",
          "stepByStepSolution": [
            "Step 1: Chakradhwaj Singha resolved to liberate Guwahati and appointed Lachit Borphukan.",
            "Step 2: War concluded decisively at Saraighat in 1671.",
            "Step 3: Chakradhwaj Singha passed away shortly before final climax, but was the sovereign who initiated the campaign."
          ],
          "takeaway": "Chakradhwaj Singha initiated the war; Lachit Borphukan commanded the forces."
        }
      },
      {
        "stepNumber": 4,
        "stepTitle": "Treaty of Yandabo (1826) & Assam's Freedom Martyrs",
        "subtitle": "Peasant uprisings, Phulaguri, Patharughat, and Quit India martyrs",
        "keyConcept": "Following Burmese invasions (Maanor Din), the British annexed Assam under the Treaty of Yandabo on 24 February 1826. Assam actively fought British colonial exploitation through peasant revolts and the national freedom movement.",
        "formulaOrCode": "1826 \\text{ (Yandabo)} \\to 1858 \\text{ (Maniram Dewan)} \\to 1861 \\text{ (Phulaguri)} \\to 1894 \\text{ (Patharughat)} \\to 1942 \\text{ (Quit India)}",
        "highYieldFacts": [
          "Treaty of Yandabo (24 Feb 1826) ceded Assam to the British East India Company.",
          "Maniram Dewan and Piyali Baruah were hanged on 26 February 1858 in Jorhat for the 1857 uprising.",
          "Phulaguri Dhawa (1861): First peasant uprising in Assam against British ban on poppy and proposed betel nut tax.",
          "Patharughat Revolt (1894): Over 140 peasants martyred in police firing during tax protest ('Assam's Jallianwala Bagh').",
          "Kushal Konwar: The only martyr in all of India hanged during the Quit India Movement (15 June 1943 at Jorhat Jail).",
          "Kanaklata Barua (17-year-old) and Mukunda Kakati martyred on 20 September 1942 at Gohpur police station."
        ],
        "examTrap": "Kushal Konwar was the ONLY person in India executed by hanging during the 1942 Quit India Movement.",
        "benchmarkExample": {
          "question": "Which peasant uprising in Assam in 1894 is commemorated as 'Assam's Jallianwala Bagh'?",
          "options": [
            "Phulaguri Dhawa",
            "Patharughat Peasant Uprising",
            "Rangiya Revolt",
            "Lachima Uprising"
          ],
          "correctAnswer": "Patharughat Peasant Uprising",
          "stepByStepSolution": [
            "Step 1: In 1894 at Patharughat (Darrang), peasants protested 70-80% land revenue hikes.",
            "Step 2: Police fired into the unarmed gathering, killing 140 peasants.",
            "Step 3: Commemorated as the Jallianwala Bagh of Assam."
          ],
          "takeaway": "Patharughat (1894) = Land revenue protest; Phulaguri (1861) = First peasant uprising."
        }
      }
    ],
    "topicQuestions": [
      {
        "id": "gs-q-081",
        "sourceType": "MODELLED",
        "stem": "Chaolung Sukapha, the founding monarch of the Ahom Kingdom that ruled the Brahmaputra valley for six centuries, crossed the Patkai hills into Assam in:",
        "options": [
          {
            "id": "A",
            "text": "1228 AD"
          },
          {
            "id": "B",
            "text": "1206 AD"
          },
          {
            "id": "C",
            "text": "1336 AD"
          },
          {
            "id": "D",
            "text": "1526 AD"
          }
        ],
        "correctOption": "A",
        "explanation": "Chaolung Sukapha, a Tai prince from Mong Mao, led his followers across the Patkai mountain range into the upper Brahmaputra valley in 1228 AD and established his first permanent royal capital at Charaideo in 1253 AD.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Assam History",
        "subtopic": "Ahom Kingdom Founder"
      },
      {
        "id": "gs-q-082",
        "sourceType": "MODELLED",
        "stem": "The legendary Battle of Saraighat (1671), celebrated for naval guerrilla tactics on the Brahmaputra river where the Ahom army decisively defeated Mughal forces under Ram Singh, was commanded by:",
        "options": [
          {
            "id": "A",
            "text": "Lachit Borphukan"
          },
          {
            "id": "B",
            "text": "Atan Burhagohain"
          },
          {
            "id": "C",
            "text": "Chilarai"
          },
          {
            "id": "D",
            "text": "Badan Chandra Borphukan"
          }
        ],
        "correctOption": "A",
        "explanation": "Ahom General Lachit Borphukan famously commanded the Ahom forces at the Battle of Saraighat in 1671. His supreme dedication is immortalized by his proverb: 'My uncle is not greater than my country' (Dekhotkoi momai dangor nohoi).",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Assam History",
        "subtopic": "Battle of Saraighat 1671"
      },
      {
        "id": "gs-q-083",
        "sourceType": "MODELLED",
        "stem": "The historic Treaty of Yandaboo, which concluded the First Anglo-Burmese War and marked the formal beginning of British colonial administration in Assam, was signed on:",
        "options": [
          {
            "id": "A",
            "text": "February 24, 1826"
          },
          {
            "id": "B",
            "text": "August 15, 1826"
          },
          {
            "id": "C",
            "text": "June 23, 1857"
          },
          {
            "id": "D",
            "text": "March 12, 1832"
          }
        ],
        "correctOption": "A",
        "explanation": "The Treaty of Yandaboo was signed on February 24, 1826 between General Sir Archibald Campbell on behalf of the British and Governor of Legaing Maha Min Hla Kyaw Htin of the Burmese Kingdom, ceding Assam, Manipur, and Arakan to the British.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2023",
        "topic": "Assam History",
        "subtopic": "Treaty of Yandaboo 1826"
      },
      {
        "id": "gs-q-084",
        "sourceType": "MODELLED",
        "stem": "Which of the following major rivers is a NORTH-BANK tributary of the Brahmaputra River in Assam?",
        "options": [
          {
            "id": "A",
            "text": "Subansiri"
          },
          {
            "id": "B",
            "text": "Dhansiri"
          },
          {
            "id": "C",
            "text": "Kopili"
          },
          {
            "id": "D",
            "text": "Diphlu"
          }
        ],
        "correctOption": "A",
        "explanation": "North-bank tributaries of the Brahmaputra include Subansiri, Jia Bharali (Kameng), Manas, Beki, Sankosh, and Puthimari. South-bank tributaries include Burhi Dihing, Disang, Dikhow, Dhansiri, and Kopili.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Assam Geography",
        "subtopic": "Brahmaputra Tributaries"
      },
      {
        "id": "gs-q-085",
        "sourceType": "MODELLED",
        "stem": "Following the notification of Raimona and Dihing Patkai in 2021, Assam currently has how many designated National Parks?",
        "options": [
          {
            "id": "A",
            "text": "7 National Parks"
          },
          {
            "id": "B",
            "text": "5 National Parks"
          },
          {
            "id": "C",
            "text": "6 National Parks"
          },
          {
            "id": "D",
            "text": "8 National Parks"
          }
        ],
        "correctOption": "A",
        "explanation": "Assam boasts 7 National Parks: 1. Kaziranga, 2. Manas, 3. Nameri, 4. Orang, 5. Dibru-Saikhowa, 6. Raimona National Park (Kokrajhar), and 7. Dihing Patkai National Park (Dibrugarh-Tinsukia). This gives Assam the third highest count in India after Madhya Pradesh and Andaman & Nicobar.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Assam Ecology",
        "subtopic": "Number of National Parks in Assam"
      },
      {
        "id": "gs-q-086",
        "sourceType": "MODELLED",
        "stem": "Kaziranga National Park, inscribed as a UNESCO World Heritage Site in 1985, hosts approximately what fraction of the world's total population of the Great Indian One-Horned Rhinoceros (Rhinoceros unicornis)?",
        "options": [
          {
            "id": "A",
            "text": "Two-thirds (around 70%)"
          },
          {
            "id": "B",
            "text": "One-third"
          },
          {
            "id": "C",
            "text": "Half (50%)"
          },
          {
            "id": "D",
            "text": "95%"
          }
        ],
        "correctOption": "A",
        "explanation": "Kaziranga National Park is home to over 2,600 one-horned rhinos, representing more than two-thirds of the planet's surviving population.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2023",
        "topic": "Wildlife & Ecology",
        "subtopic": "Kaziranga National Park Rhinos"
      },
      {
        "id": "gs-q-087",
        "sourceType": "MODELLED",
        "stem": "Majuli, which became India's first river island district in 2016, is situated between the Brahmaputra River and which tributary channel to its north?",
        "options": [
          {
            "id": "A",
            "text": "Kherkutia Xuti (joining Subansiri)"
          },
          {
            "id": "B",
            "text": "Barak River"
          },
          {
            "id": "C",
            "text": "Dhansiri"
          },
          {
            "id": "D",
            "text": "Manas"
          }
        ],
        "correctOption": "A",
        "explanation": "Majuli is bounded by the Brahmaputra River to the south and south-west and by the Subansiri River and Kherkutia Xuti (an anabranch of the Brahmaputra) to the north. It is the spiritual epicenter of Srimanta Sankaradeva's Neo-Vaishnavite Satra culture.",
        "formulaContext": null,
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Geography & Culture",
        "subtopic": "Majuli River Island"
      },
      {
        "id": "gs-q-088",
        "sourceType": "MODELLED",
        "stem": "In the Assamese cultural calendar, which Bihu marks the onset of the Assamese New Year and spring seeding season, celebrated with joyous Bihu dance and Dhol beats?",
        "options": [
          {
            "id": "A",
            "text": "Rongali (Bohag) Bihu"
          },
          {
            "id": "B",
            "text": "Kongali (Kati) Bihu"
          },
          {
            "id": "C",
            "text": "Bhogali (Magh) Bihu"
          },
          {
            "id": "D",
            "text": "Kati Bihu"
          }
        ],
        "correctOption": "A",
        "explanation": "Rongali or Bohag Bihu (in mid-April) marks the vernal equinox and Assamese New Year celebration with music and feasting. Kongali (Kati) Bihu in October is a somber observance of prayer for crops; Bhogali (Magh) Bihu in January is the harvest feast with Mejis.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Culture & Festivals",
        "subtopic": "Bihu Festivals Cycle"
      },
      {
        "id": "gs-q-089",
        "sourceType": "MODELLED",
        "stem": "Who is historically credited with the discovery of the indigenous wild Camellia sinensis var. assamica tea plant growing in upper Assam in 1823 with the assistance of Singpho Chief Bessa Gam?",
        "options": [
          {
            "id": "A",
            "text": "Robert Bruce"
          },
          {
            "id": "B",
            "text": "Lord Bentinck"
          },
          {
            "id": "C",
            "text": "David Scott"
          },
          {
            "id": "D",
            "text": "Nathaniel Wallich"
          }
        ],
        "correctOption": "A",
        "explanation": "Major Robert Bruce, a Scottish adventurer and merchant, noticed wild tea plants in 1823 near Sivasagar through Singpho chief Bessa Gam. His brother Charles Alexander Bruce subsequently cultivated the first tea nurseries.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2023",
        "topic": "Assam Economy",
        "subtopic": "Discovery of Assam Tea"
      },
      {
        "id": "gs-q-090",
        "sourceType": "MODELLED",
        "stem": "The Digboi Refinery in upper Assam, which commenced commercial operations in 1901 and holds the distinction of being Asia's oldest operating oil refinery, is operated by:",
        "options": [
          {
            "id": "A",
            "text": "Indian Oil Corporation Limited (IOCL)"
          },
          {
            "id": "B",
            "text": "Oil and Natural Gas Corporation (ONGC)"
          },
          {
            "id": "C",
            "text": "Oil India Limited (OIL)"
          },
          {
            "id": "D",
            "text": "Bharat Petroleum (BPCL)"
          }
        ],
        "correctOption": "A",
        "explanation": "Crude oil was discovered in Digboi in 1889 by the Assam Railways and Trading Company (AR&T). The Digboi refinery was commissioned in December 1901 by the Assam Oil Company, and is today operated by the Assam Oil Division of Indian Oil Corporation Limited (IOCL).",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Industry & Resources",
        "subtopic": "Digboi Oil Refinery"
      }
    ],
    "unitName": "Assam History, Art & Culture",
    "codeClause": "Assam Buranjis & DHAS Archives",
    "confidencePercent": 65,
    "masteredStatus": "In Progress",
    "diagramType": "assam",
    "subtopicList": [
      "Ancient Kamarupa: Varman Dynasty & Bhaskaravarman",
      "Establishment of Ahom Rule by Chaolung Sukaphaa (1228 AD)",
      "Ahom Administration: Paik System & Khel Organization",
      "Battle of Saraighat (1671 AD) & Lachit Borphukan",
      "Srimanta Sankardeva, Neo-Vaishnavite Movement & Sattriya Culture",
      "Treaty of Yandabo (1826 AD) & British Annexation",
      "Peasant Uprisings: Phulaguri Dhawa (1861) & Patharughat (1894)"
    ],
    "comparisonGrid": {
      "titleLeft": "Battle of Saraighat (1671 AD)",
      "tagLeft": "Naval Warfare",
      "valueLeft": "Lachit Borphukan vs Ram Singh",
      "descLeft": "Decisive naval encounter on the Brahmaputra; Lachit Borphukan used combined earthen ramparts and guerilla river flotillas to rout the Mughal forces.",
      "titleRight": "Battle of Itakhuli (1682 AD)",
      "tagRight": "Final Expulsion",
      "valueRight": "Dihingia Alun Barbarua",
      "descRight": "Ended Mughal ambitions in Assam permanently; pushed Mughal boundary westward to the Manas river, where it remained until British annexation."
    },
    "callouts": {
      "corePostulate": "Chaolung Sukaphaa crossed the Patkai range and entered Assam in 1228 AD, establishing the first Ahom capital at Charaideo in 1253 AD and commencing six centuries of unbroken dynasty rule.",
      "corePostulateRef": "Ahom Buranjis",
      "examTrap": "Phulaguri Dhawa (October 1861) in Nagaon district was the FIRST peasant uprising against British rule in Assam, triggered by bans on betel-nut cultivation and proposed opium taxation. Patharughat was in 1894!",
      "examTrapRef": "APSC CCE & State Exams",
      "testedRatios": [
        {
          "label": "Ahom Paik Unit (Got):",
          "value": "4 paiks (reduced to 3 by Momai Tamuli)"
        },
        {
          "label": "Treaty of Yandabo Signed:",
          "value": "24 February 1826"
        },
        {
          "label": "Neo-Vaishnavism Founder:",
          "value": "Srimanta Sankardeva (1449 - 1568)"
        },
        {
          "label": "First Ahom Ruler to Accept Hinduism:",
          "value": "Jayadhwaj Singha"
        }
      ],
      "numericalShortcut": {
        "formula": "Assam Peasant Revolts Chronology: Phulaguri (1861) -> Patharughat (1894)",
        "note": "Patharughat in Darrang is remembered as the 'Jallianwala Bagh of Assam' where over 140 peasants protesting British land taxes were killed in police firing."
      }
    },
    "aiTutorPrompts": [
      {
        "question": "How was the Ahom Paik system structured?",
        "answerPreview": "Every male subject between 15 and 50 was a Paik. Initially, 4 paiks formed a 'Got' (later 3). One paik from each Got rendered mandatory state service (army, dyke building, irrigation) in rotation while the remaining members tended his agricultural land."
      },
      {
        "question": "What is the significance of Srimanta Sankardeva's Sattra institution?",
        "answerPreview": "Sattras are democratic socio-religious and cultural monasteries propagating Ekasarana Dharma. They house the Namghar (prayer hall) and serve as preservation centers for Sattriya dance, Borgeet, Ankiya Naat, and mask making."
      }
    ]
  },
  {
    "id": "gs-assam-geography",
    "title": "Geography of India & Assam: Physiography & National Parks",
    "subject": "Geography of India & Assam",
    "category": "gs",
    "readTime": "18 min read",
    "weightage": "HIGH_YIELD",
    "icon": "MapPin",
    "summary": "Physiography of Assam, Brahmaputra & Barak drainage systems, Majuli island, the 7 National Parks, Ramsar wetland Deepor Beel, and mineral resources.",
    "prerequisites": [
      "Basic Physical Geography"
    ],
    "standardReferences": [
      "Majid Husain",
      "Taher & Ahmed: Geography of Assam"
    ],
    "practiceQuestionIds": [
      "gs-q-037",
      "gs-q-038",
      "gs-q-039",
      "gs-q-040",
      "gs-q-041",
      "gs-q-042",
      "gs-q-043",
      "gs-q-044",
      "gs-q-045",
      "gs-q-046",
      "gs-q-047",
      "gs-q-048",
      "gs-q-049",
      "gs-q-050",
      "gs-q-051",
      "gs-q-052"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "stepTitle": "Physiographic Units & River Drainage",
        "subtitle": "Brahmaputra Valley, Barak Valley, Karbi-Barail hills, and tributaries",
        "keyConcept": "Assam comprises 78,438 km\u00b2 divided into the Brahmaputra Valley, the Barak Valley, and the Central Assam Hills (Karbi Anglong & Dima Hasao). The Karbi Anglong plateau is geologically an ancient part of the Indian Peninsular Shield.",
        "formulaOrCode": "\\text{Brahmaputra Length} \\approx 2,880 \\text{ km (916 km in India)} \\quad ; \\quad \\text{NW-2: Sadiya to Dhubri (891 km)}",
        "highYieldFacts": [
          "Brahmaputra originates as Yarlung Tsangpo near Lake Manasarovar in Tibet, cuts Namcha Barwa, enters Arunachal as Siang/Dihang, and joins Dibang and Lohit at Kobo.",
          "North-Bank Tributaries: Subansiri (largest), Kameng (Jia Bharali), Manas, Beki, Sankosh.",
          "South-Bank Tributaries: Burhi Dihing, Disang, Dikhow, Dhansiri, Kopili, Krishnai.",
          "Majuli: World's largest inhabited freshwater river island, first river island district in India (2016).",
          "Barak River originates in Manipur hills, flows through Cachar, Karimganj, and enters Bangladesh as Surma and Kushiyara."
        ],
        "examTrap": "Karbi Anglong and Meghalaya Plateau are NOT part of the Himalayas; they belong to the ancient Gondwanaland Peninsular Shield!",
        "benchmarkExample": {
          "question": "Which is the largest tributary of the Brahmaputra River?",
          "options": [
            "Manas",
            "Subansiri",
            "Burhi Dihing",
            "Kopili"
          ],
          "correctAnswer": "Subansiri",
          "stepByStepSolution": [
            "Step 1: Subansiri originates in Tibet and contributes over 8% of Brahmaputra's total discharge.",
            "Step 2: It is the single largest tributary in length and flow volume."
          ],
          "takeaway": "Subansiri = Largest tributary; NW-2 = Brahmaputra (Sadiya to Dhubri, 891 km)."
        }
      },
      {
        "stepNumber": 2,
        "stepTitle": "The 7 National Parks & Protected Biodiversity",
        "subtitle": "Kaziranga, Manas, Raimona, Dihing Patkai, and Deepor Beel",
        "keyConcept": "Assam has 7 National Parks and 2 UNESCO Natural World Heritage Sites (Kaziranga and Manas). Assam ranks 3rd in India in number of National Parks.",
        "formulaOrCode": "7 \\text{ NPs: Kaziranga, Manas, Dibru-Saikhowa, Nameri, Orang, Raimona (6th), Dihing Patkai (7th)}",
        "highYieldFacts": [
          "Kaziranga National Park (1985 UNESCO Site): Holds two-thirds of world's Great One-Horned Rhinos.",
          "Manas National Park (1985 UNESCO Site): Biosphere reserve, Project Tiger, home to Pygmy Hog and Golden Langur.",
          "Raimona NP (6th, June 2021) in Kokrajhar - famous for Golden Langur.",
          "Dihing Patkai NP (7th, June 2021) - lowland tropical rainforest known as the 'Amazon of the East'.",
          "Orang National Park: Known as 'Mini Kaziranga'.",
          "Deepor Beel: Only designated Ramsar Wetland site in Assam (2002)."
        ],
        "examTrap": "Deepor Beel is the ONLY Ramsar site in Assam. Son Beel in Karimganj is the largest tectonic lake, but not a Ramsar site.",
        "benchmarkExample": {
          "question": "Which National Park in Assam is known as the 'Amazon of the East'?",
          "options": [
            "Dibru-Saikhowa",
            "Nameri",
            "Dihing Patkai",
            "Raimona"
          ],
          "correctAnswer": "Dihing Patkai",
          "stepByStepSolution": [
            "Step 1: Dihing Patkai spans Dibrugarh and Tinsukia districts.",
            "Step 2: Its dense virgin rainforest earned the title 'Amazon of the East'.",
            "Step 3: Declared 7th National Park in June 2021."
          ],
          "takeaway": "Dihing Patkai = 7th NP / 'Amazon of the East'."
        }
      }
    ],
    "topicQuestions": [
      {
        "id": "gs-q-037",
        "sourceType": "MODELLED",
        "stem": "With reference to earthquake seismic waves, which of the following statements is correct?",
        "options": [
          {
            "id": "A",
            "text": "Primary waves (P-waves) are longitudinal and can travel through solids, liquids, and gases"
          },
          {
            "id": "B",
            "text": "Secondary waves (S-waves) can travel through both liquids and solids"
          },
          {
            "id": "C",
            "text": "Surface waves travel faster than P-waves"
          },
          {
            "id": "D",
            "text": "S-waves are longitudinal compressional waves"
          }
        ],
        "correctOption": "A",
        "explanation": "P-waves (Primary waves) are longitudinal compressional waves capable of travelling through solid, liquid, and gaseous media. S-waves (Secondary waves) are transverse shear waves that can travel ONLY through solid materials, creating the S-wave shadow zone beyond 105\u00b0.",
        "formulaContext": null,
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Physical Geography",
        "subtopic": "Earthquake Waves"
      },
      {
        "id": "gs-q-038",
        "sourceType": "MODELLED",
        "stem": "In which layer of the Earth's atmosphere is the protective Ozone layer (Ozonosphere) primarily concentrated?",
        "options": [
          {
            "id": "A",
            "text": "Stratosphere"
          },
          {
            "id": "B",
            "text": "Troposphere"
          },
          {
            "id": "C",
            "text": "Mesosphere"
          },
          {
            "id": "D",
            "text": "Thermosphere"
          }
        ],
        "correctOption": "A",
        "explanation": "The stratosphere (extending from roughly 12 km to 50 km above surface) contains the ozone layer, which absorbs lethal solar ultraviolet-B (UV-B) radiation.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2023",
        "topic": "Atmospheric Science",
        "subtopic": "Atmospheric Layers & Ozone"
      },
      {
        "id": "gs-q-039",
        "sourceType": "MODELLED",
        "stem": "The periodic reversal of wind direction in the Indian subcontinent known as the Indian Monsoon is heavily influenced by the seasonal heating and low-pressure formation over:",
        "options": [
          {
            "id": "A",
            "text": "The Tibetan Plateau and northwestern Indian plains"
          },
          {
            "id": "B",
            "text": "The Deccan Plateau"
          },
          {
            "id": "C",
            "text": "The Southern Ocean"
          },
          {
            "id": "D",
            "text": "The Bay of Bengal"
          }
        ],
        "correctOption": "A",
        "explanation": "Intense summer heating of the high-altitude Tibetan Plateau acts as a thermal engine, creating a strong low pressure and upper-tropospheric easterly jet stream that pulls the moisture-laden Southwest Monsoon winds from the Indian Ocean.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Climatology",
        "subtopic": "Indian Monsoon Mechanisms"
      },
      {
        "id": "gs-q-040",
        "sourceType": "MODELLED",
        "stem": "Under the Indus Waters Treaty (1960) mediated by the World Bank, India has unrestricted rights to the waters of which three Eastern Rivers?",
        "options": [
          {
            "id": "A",
            "text": "Ravi, Beas, and Sutlej"
          },
          {
            "id": "B",
            "text": "Indus, Jhelum, and Chenab"
          },
          {
            "id": "C",
            "text": "Jhelum, Chenab, and Ravi"
          },
          {
            "id": "D",
            "text": "Sutlej, Chenab, and Indus"
          }
        ],
        "correctOption": "A",
        "explanation": "The Indus Waters Treaty allocated the three 'Eastern Rivers' (Sutlej, Beas, Ravi) exclusively to India, while the three 'Western Rivers' (Indus, Jhelum, Chenab) were allocated primarily to Pakistan, with India having specified run-of-the-river usage rights.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Indian Drainage Systems",
        "subtopic": "Indus Water Treaty 1960"
      },
      {
        "id": "gs-q-041",
        "sourceType": "MODELLED",
        "stem": "Which pair of major Indian rivers flows westward through geological rift valleys between mountain ranges and empties into the Arabian Sea without forming deltas?",
        "options": [
          {
            "id": "A",
            "text": "Narmada and Tapti"
          },
          {
            "id": "B",
            "text": "Godavari and Krishna"
          },
          {
            "id": "C",
            "text": "Mahanadi and Cauvery"
          },
          {
            "id": "D",
            "text": "Sabarmati and Mahi"
          }
        ],
        "correctOption": "A",
        "explanation": "The Narmada (flowing between Vindhya and Satpura ranges) and Tapti (flowing south of Satpura) occupy tectonic rift valleys and drain westward into the Arabian Sea, forming estuaries rather than extensive alluvial deltas.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2023",
        "topic": "Indian Drainage Systems",
        "subtopic": "West Flowing Rift Valley Rivers"
      },
      {
        "id": "gs-q-042",
        "sourceType": "MODELLED",
        "stem": "Black soil (Regur soil), celebrated for commercial cotton cultivation in the Deccan trap region, is predominantly derived from the weathering of:",
        "options": [
          {
            "id": "A",
            "text": "Basaltic lava rocks"
          },
          {
            "id": "B",
            "text": "Granite and gneiss"
          },
          {
            "id": "C",
            "text": "Sandstone and shale"
          },
          {
            "id": "D",
            "text": "Limestone and dolomite"
          }
        ],
        "correctOption": "A",
        "explanation": "Black soils are formed from the decomposition of volcanic basaltic lava of the Deccan Trap. Rich in montmorillonite clay mineral, they exhibit remarkable water retention, swelling when wet and cracking self-ploughing fissures when dry.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Soil Geography",
        "subtopic": "Black Cotton / Regur Soil"
      },
      {
        "id": "gs-q-043",
        "sourceType": "MODELLED",
        "stem": "The Chhota Nagpur Plateau, frequently described as the 'Ruhr of India' due to its vast concentration of coal, iron ore, and mica, is spread across which primary states?",
        "options": [
          {
            "id": "A",
            "text": "Jharkhand, West Bengal, Odisha, and Chhattisgarh"
          },
          {
            "id": "B",
            "text": "Maharashtra and Madhya Pradesh"
          },
          {
            "id": "C",
            "text": "Karnataka and Tamil Nadu"
          },
          {
            "id": "D",
            "text": "Rajasthan and Gujarat"
          }
        ],
        "correctOption": "A",
        "explanation": "The Chhota Nagpur Plateau in eastern India covers much of Jharkhand and adjacent portions of West Bengal, Odisha, and Chhattisgarh. It contains India's premier coalfields (Jharia, Raniganj, Bokaro) and iron ore deposits.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2022",
        "topic": "Mineral Resources",
        "subtopic": "Chhota Nagpur Plateau"
      },
      {
        "id": "gs-q-044",
        "sourceType": "MODELLED",
        "stem": "Which forest type occupies the largest geographical percentage of India's total forest cover?",
        "options": [
          {
            "id": "A",
            "text": "Tropical Deciduous Forests (Monsoon Forests)"
          },
          {
            "id": "B",
            "text": "Tropical Wet Evergreen Forests"
          },
          {
            "id": "C",
            "text": "Montane Temperate Forests"
          },
          {
            "id": "D",
            "text": "Mangrove Tidal Forests"
          }
        ],
        "correctOption": "A",
        "explanation": "Tropical Deciduous Forests (divided into Moist and Dry Deciduous) are the most widespread in India, covering over 60% of the total forested area. Dominant species include Teak, Sal, Shisham, and Mahua.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Biogeography & Forestry",
        "subtopic": "Most Widespread Forest Type"
      },
      {
        "id": "gs-q-045",
        "sourceType": "MODELLED",
        "stem": "Deepor Beel, a permanent freshwater lake and major wildlife haven designated as Assam's sole Ramsar site, is located in which district?",
        "options": [
          {
            "id": "A",
            "text": "Kamrup Metropolitan (Guwahati)"
          },
          {
            "id": "B",
            "text": "Nagaon"
          },
          {
            "id": "C",
            "text": "Jorhat"
          },
          {
            "id": "D",
            "text": "Dibrugarh"
          }
        ],
        "correctOption": "A",
        "explanation": "Deepor Beel is a sprawling riverine wetland in Kamrup Metropolitan district southwest of Guwahati city. It was designated as a Ramsar site in November 2002 for its biological and ecological importance.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2023",
        "topic": "Ecology & Wetlands",
        "subtopic": "Ramsar Convention Deepor Beel"
      },
      {
        "id": "gs-q-046",
        "sourceType": "MODELLED",
        "stem": "According to Conservation International criteria, how many global Biodiversity Hotspots are found wholly or partially within India's borders?",
        "options": [
          {
            "id": "A",
            "text": "4 Hotspots (Himalaya, Western Ghats, Indo-Burma, Sundaland)"
          },
          {
            "id": "B",
            "text": "2 Hotspots"
          },
          {
            "id": "C",
            "text": "6 Hotspots"
          },
          {
            "id": "D",
            "text": "8 Hotspots"
          }
        ],
        "correctOption": "A",
        "explanation": "India represents four globally recognized biodiversity hotspots: 1. The Himalayas, 2. The Western Ghats (and Sri Lanka), 3. Indo-Burma (including Northeast India), and 4. Sundaland (including Nicobar Islands).",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Biodiversity Conservation",
        "subtopic": "Biodiversity Hotspots in India"
      },
      {
        "id": "gs-q-047",
        "sourceType": "MODELLED",
        "stem": "Which was the first Biosphere Reserve established in India under UNESCO's Man and the Biosphere (MAB) Programme in 1986?",
        "options": [
          {
            "id": "A",
            "text": "Nilgiri Biosphere Reserve"
          },
          {
            "id": "B",
            "text": "Nanda Devi Biosphere Reserve"
          },
          {
            "id": "C",
            "text": "Sundarbans Biosphere Reserve"
          },
          {
            "id": "D",
            "text": "Gulf of Mannar Biosphere Reserve"
          }
        ],
        "correctOption": "A",
        "explanation": "The Nilgiri Biosphere Reserve, located at the tri-junction of Tamil Nadu, Kerala, and Karnataka in the Western Ghats, was the first biosphere reserve designated in India in 1986.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2022",
        "topic": "Conservation Reserves",
        "subtopic": "First Biosphere Reserve in India"
      },
      {
        "id": "gs-q-048",
        "sourceType": "MODELLED",
        "stem": "India's flagship conservation initiative 'Project Tiger' was launched in which year and from which National Park?",
        "options": [
          {
            "id": "A",
            "text": "1973 from Jim Corbett National Park (Uttarakhand)"
          },
          {
            "id": "B",
            "text": "1972 from Kaziranga National Park"
          },
          {
            "id": "C",
            "text": "1980 from Ranthambore National Park"
          },
          {
            "id": "D",
            "text": "1985 from Kanha National Park"
          }
        ],
        "correctOption": "A",
        "explanation": "Project Tiger was launched on April 1, 1973 by the Government of India under Prime Minister Indira Gandhi from Jim Corbett National Park, following the enactment of the Wildlife (Protection) Act, 1972.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2023",
        "topic": "Wildlife Conservation",
        "subtopic": "Project Tiger Inception"
      },
      {
        "id": "gs-q-049",
        "sourceType": "MODELLED",
        "stem": "Under the landmark Paris Agreement adopted at COP21 in 2015, nations committed to holding the increase in global average temperature to:",
        "options": [
          {
            "id": "A",
            "text": "Well below 2.0\u00b0C above pre-industrial levels and pursuing efforts to limit it to 1.5\u00b0C"
          },
          {
            "id": "B",
            "text": "Below 3.0\u00b0C by 2100"
          },
          {
            "id": "C",
            "text": "Zero degree change from 2000 levels"
          },
          {
            "id": "D",
            "text": "Below 4.0\u00b0C with economic offsets"
          }
        ],
        "correctOption": "A",
        "explanation": "Article 2 of the Paris Agreement sets the goal of holding global warming 'well below 2\u00b0C above pre-industrial levels and pursuing efforts to limit the temperature increase to 1.5\u00b0C'.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Climate Change",
        "subtopic": "Paris Agreement COP21 Goals"
      },
      {
        "id": "gs-q-050",
        "sourceType": "MODELLED",
        "stem": "The National Air Quality Index (AQI) in India monitors atmospheric concentrations of how many criteria air pollutants?",
        "options": [
          {
            "id": "A",
            "text": "8 pollutants (PM10, PM2.5, NO2, SO2, CO, O3, NH3, and Pb)"
          },
          {
            "id": "B",
            "text": "5 pollutants"
          },
          {
            "id": "C",
            "text": "12 pollutants"
          },
          {
            "id": "D",
            "text": "6 pollutants"
          }
        ],
        "correctOption": "A",
        "explanation": "The Central Pollution Control Board (CPCB) computes the National AQI across 8 pollutants: Particulate Matter (PM10 and PM2.5), Nitrogen Dioxide (NO2), Sulphur Dioxide (SO2), Carbon Monoxide (CO), Ozone (O3), Ammonia (NH3), and Lead (Pb).",
        "formulaContext": null,
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / State PSC GS Paper I 2023",
        "topic": "Environmental Pollution",
        "subtopic": "National Air Quality Index (AQI)"
      },
      {
        "id": "gs-q-051",
        "sourceType": "MODELLED",
        "stem": "The convergence zone of the warm Gulf Stream and the cold Labrador Current off the coast of Newfoundland (Grand Banks) creates world-famous:",
        "options": [
          {
            "id": "A",
            "text": "Rich commercial fishing grounds and dense navigational fogs"
          },
          {
            "id": "B",
            "text": "Tropical cyclones and warm lagoons"
          },
          {
            "id": "C",
            "text": "Deserts on adjacent landmasses"
          },
          {
            "id": "D",
            "text": "Volcanic island arcs"
          }
        ],
        "correctOption": "A",
        "explanation": "The mixing of warm and cold currents produces upwelling of deep nutrient-rich waters that nourish abundant marine plankton, creating exceptional fishing grounds. It also causes condensation and hazardous maritime fog.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Oceanography",
        "subtopic": "Ocean Currents Fishing Grounds"
      },
      {
        "id": "gs-q-052",
        "sourceType": "MODELLED",
        "stem": "What is the primary scientific cause of large-scale 'Coral Bleaching' events witnessed in coral reef systems worldwide?",
        "options": [
          {
            "id": "A",
            "text": "Expulsion of photosynthetic symbiotic algae (zooxanthellae) due to thermal sea surface temperature rise"
          },
          {
            "id": "B",
            "text": "Deposition of industrial heavy metal toxins"
          },
          {
            "id": "C",
            "text": "Attack by crown-of-thorns starfish only"
          },
          {
            "id": "D",
            "text": "Overfishing of reef sharks"
          }
        ],
        "correctOption": "A",
        "explanation": "Corals maintain an obligate mutualistic relationship with microscopic dinoflagellate algae (zooxanthellae). Sustained elevated sea water temperatures cause metabolic stress, causing corals to expel the algae and turn stark white, leading to starvation and death.",
        "formulaContext": null,
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Marine Ecosystems",
        "subtopic": "Coral Bleaching Cause"
      }
    ],
    "unitName": "Geography of India & Assam",
    "codeClause": "Survey of India & Assam Forest Dept",
    "confidencePercent": 75,
    "masteredStatus": "Mastered",
    "diagramType": "assam",
    "subtopicList": [
      "Physiographic Divisions: Karbi Hills, Barail & Brahmaputra Valley",
      "Brahmaputra River Basin & North/South Bank Tributaries",
      "Monsoons of India & Flood Hydrology of Assam",
      "7 National Parks of Assam & UNESCO Sites",
      "Deepor Beel Ramsar Wetland & Biodiversity",
      "Forest Cover, Soils & Mineral Resources"
    ],
    "comparisonGrid": {
      "titleLeft": "North-Bank Tributaries",
      "tagLeft": "Himalayan Glacier Origin",
      "valueLeft": "Subansiri, Jia Bharali, Manas",
      "descLeft": "Torrential mountain courses; carry massive boulder and silt loads; steep gradient; cause extensive seasonal flooding and braiding.",
      "titleRight": "South-Bank Tributaries",
      "tagRight": "Meghalaya & Naga Hills",
      "valueRight": "Dhansiri, Kopili, Kulsi",
      "descRight": "Rain-fed streams; gentler gradients; deep meandering channels; carry less coarse sediment compared to north-bank tributaries."
    },
    "callouts": {
      "corePostulate": "Assam has 7 National Parks: Kaziranga (UNESCO World Heritage), Manas (UNESCO World Heritage & Tiger Reserve), Nameri, Orang (Rajiv Gandhi), Dibru-Saikhowa, Raimona (declared 2021), and Dihing Patkai (Amazon of the East, declared 2021).",
      "corePostulateRef": "Assam Forest Department Records",
      "examTrap": "Deepor Beel is the ONLY Ramsar site (wetland of international importance) in Assam, located southwest of Guwahati in Kamrup Metropolitan district.",
      "examTrapRef": "APSC CCE 2022 & 2023",
      "testedRatios": [
        {
          "label": "Kaziranga Rhino Population:",
          "value": "Hosts > 70% of world's Great One-horned Rhinos"
        },
        {
          "label": "Largest Inhabited River Island:",
          "value": "Majuli (Guinness Record)"
        },
        {
          "label": "Smallest Inhabited River Island:",
          "value": "Umananda (Peacock Island, Guwahati)"
        },
        {
          "label": "Longest River Bridge in India:",
          "value": "Bhupen Hazarika Setu (Dhola-Sadiya, 9.15 km)"
        }
      ],
      "numericalShortcut": {
        "formula": "Brahmaputra Origin: Chemayungdung Glacier (Tibet) -> Yarlung Tsangpo -> Siang/Dihang -> Brahmaputra",
        "note": "At Kobo near Sadiya, the Siang joins the Dibang and Lohit to officially form the river Brahmaputra."
      }
    },
    "aiTutorPrompts": [
      {
        "question": "Why does the Brahmaputra river cause chronic recurrent floods in Assam?",
        "answerPreview": "High rainfall during South-West monsoons (> 250 cm), fragile seismically active young Himalayan catchment generating colossal sediment loads (over 400 million tonnes/year), shallow braided riverbed, narrow bottlenecks at Pandu, and inadequate drainage gradients."
      },
      {
        "question": "What are the key wildlife species protected in Raimona and Dihing Patkai National Parks?",
        "answerPreview": "Raimona National Park (Kokrajhar) is famous for the endemic Golden Langur. Dihing Patkai (Dibrugarh & Tinsukia) is India's largest lowland rainforest, harboring the Hoolock Gibbon, Slow Loris, White-winged Wood Duck, and wild elephants."
      }
    ]
  },
  {
    "id": "gs-polity",
    "title": "Indian Polity: Constitution, Fundamental Rights & 6th Schedule",
    "subject": "Indian Polity & Governance",
    "category": "gs",
    "readTime": "16 min read",
    "weightage": "HIGH_YIELD",
    "icon": "ShieldCheck",
    "summary": "Preamble basic structure, Fundamental Rights (Articles 12-35), DPSP, Supreme Court & High Court writs, and the Sixth Schedule Autonomous District Councils.",
    "prerequisites": [
      "Basic Political Science"
    ],
    "standardReferences": [
      "M. Laxmikanth: Indian Polity",
      "D.D. Basu"
    ],
    "practiceQuestionIds": [
      "gs-q-001",
      "gs-q-002",
      "gs-q-003",
      "gs-q-004",
      "gs-q-005",
      "gs-q-006",
      "gs-q-007",
      "gs-q-008",
      "gs-q-009",
      "gs-q-010",
      "gs-q-011",
      "gs-q-012",
      "gs-q-013",
      "gs-q-014",
      "gs-q-015",
      "gs-q-016",
      "gs-q-017",
      "gs-q-018"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "stepTitle": "Fundamental Rights & Constitutional Writs",
        "subtitle": "Articles 12 to 35, Article 32 remedies, and judicial review",
        "keyConcept": "Part III guarantees six fundamental freedoms. Dr. Ambedkar called Article 32 the 'Heart and Soul of the Constitution' empowering the Supreme Court (Art 32) and High Courts (Art 226) to issue prerogative writs.",
        "formulaOrCode": "\\text{5 Writs: Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo-Warranto}",
        "highYieldFacts": [
          "Habeas Corpus: To have the body of; protects against unlawful detention.",
          "Mandamus: Directs public authority to perform statutory duty; cannot issue against President or Governor.",
          "Certiorari: Quashes orders passed by inferior courts exceeding jurisdiction.",
          "Right to Property was removed by the 44th Amendment (1978) and made a legal right under Article 300A.",
          "Articles 20 and 21 CANNOT be suspended even during a National Emergency (Article 352)."
        ],
        "examTrap": "Article 226 writ jurisdiction of High Courts is WIDER than Article 32 of Supreme Court because High Courts can enforce ordinary legal rights as well.",
        "benchmarkExample": {
          "question": "Which Fundamental Rights cannot be suspended during National Emergency under Article 352?",
          "options": [
            "Articles 14 and 19",
            "Articles 19 and 20",
            "Articles 20 and 21",
            "Articles 21 and 22"
          ],
          "correctAnswer": "Articles 20 and 21",
          "stepByStepSolution": [
            "Step 1: 44th Amendment 1978 introduced protection for Articles 20 and 21.",
            "Step 2: Article 20 (protection in respect of conviction) and Article 21 (right to life and liberty) cannot be suspended under any emergency."
          ],
          "takeaway": "Articles 20 & 21 are non-derogable under all circumstances."
        }
      },
      {
        "stepNumber": 2,
        "stepTitle": "Sixth Schedule & Autonomous District Councils",
        "subtitle": "Tribal administration in Assam, Meghalaya, Tripura, and Mizoram (AMTM)",
        "keyConcept": "The Sixth Schedule provides for administration of tribal areas in Assam, Meghalaya, Tripura, and Mizoram (AMTM) through Autonomous District Councils (ADCs) with legislative, executive, and judicial powers.",
        "formulaOrCode": "\\text{Sixth Schedule States} = \\text{Assam, Meghalaya, Tripura, Mizoram (AMTM)}",
        "highYieldFacts": [
          "3 ADCs in Assam: Bodoland Territorial Council (BTC), Dima Hasao Autonomous Council, Karbi Anglong Autonomous Council.",
          "ADCs have up to 30 members (26 elected, 4 nominated by Governor).",
          "ADCs make laws on land allotment, forests, village administration, and customs subject to Governor's assent.",
          "Manipur and Nagaland are NOT under the Sixth Schedule."
        ],
        "examTrap": "Manipur and Nagaland are not covered by the Sixth Schedule. Sixth Schedule applies strictly to AMTM.",
        "benchmarkExample": {
          "question": "Which of the following states is NOT governed under the Sixth Schedule?",
          "options": [
            "Assam",
            "Meghalaya",
            "Manipur",
            "Mizoram"
          ],
          "correctAnswer": "Manipur",
          "stepByStepSolution": [
            "Step 1: Remember mnemonic AMTM (Assam, Meghalaya, Tripura, Mizoram).",
            "Step 2: Manipur is governed through Article 371C, not the Sixth Schedule."
          ],
          "takeaway": "Sixth Schedule = AMTM. Manipur has Hill Areas Committee under Art 371C."
        }
      }
    ],
    "topicQuestions": [
      {
        "id": "gs-q-001",
        "sourceType": "MODELLED",
        "stem": "Which of the following sets of words was added to the Preamble of the Indian Constitution by the 42nd Constitutional Amendment Act, 1976?",
        "options": [
          {
            "id": "A",
            "text": "Socialist, Secular, and Integrity"
          },
          {
            "id": "B",
            "text": "Sovereign, Democratic, and Republic"
          },
          {
            "id": "C",
            "text": "Liberty, Equality, and Fraternity"
          },
          {
            "id": "D",
            "text": "Justice, Liberty, and Dignity"
          }
        ],
        "correctOption": "A",
        "explanation": "The 42nd Constitutional Amendment Act, 1976 amended the Preamble by adding three words: 'Socialist', 'Secular', and 'Integrity'. The Preamble has been amended only once in Indian constitutional history.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Preamble of the Constitution",
        "subtopic": "42nd Amendment Amendments"
      },
      {
        "id": "gs-q-002",
        "sourceType": "MODELLED",
        "stem": "In which landmark judgement did the Supreme Court of India unanimously declare the 'Right to Privacy' as a fundamental right under Article 21?",
        "options": [
          {
            "id": "A",
            "text": "Justice K.S. Puttaswamy (Retd.) v. Union of India (2017)"
          },
          {
            "id": "B",
            "text": "Maneka Gandhi v. Union of India (1978)"
          },
          {
            "id": "C",
            "text": "Kesavananda Bharati v. State of Kerala (1973)"
          },
          {
            "id": "D",
            "text": "A.K. Gopalan v. State of Madras (1950)"
          }
        ],
        "correctOption": "A",
        "explanation": "In Justice K.S. Puttaswamy v. Union of India (2017), a nine-judge constitution bench unanimously ruled that the right to privacy is an intrinsic part of the right to life and personal liberty guaranteed under Article 21 of Part III of the Constitution.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2023",
        "topic": "Fundamental Rights",
        "subtopic": "Article 21 & Right to Privacy"
      },
      {
        "id": "gs-q-003",
        "sourceType": "MODELLED",
        "stem": "With reference to the writ jurisdiction of courts in India, which of the following statements is correct?",
        "options": [
          {
            "id": "A",
            "text": "The writ jurisdiction of the High Court under Article 226 is wider than that of the Supreme Court under Article 32"
          },
          {
            "id": "B",
            "text": "The Supreme Court can issue writs for legal rights other than fundamental rights"
          },
          {
            "id": "C",
            "text": "High Courts can issue writs only for the enforcement of fundamental rights"
          },
          {
            "id": "D",
            "text": "Writs can only be issued against government officials, never against tribunals"
          }
        ],
        "correctOption": "A",
        "explanation": "Under Article 32, the Supreme Court can issue writs ONLY for the enforcement of Fundamental Rights. Under Article 226, High Courts can issue writs not only for Fundamental Rights but also 'for any other purpose' (ordinary legal rights). Hence the High Court's writ jurisdiction is wider in scope.",
        "formulaContext": null,
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Judiciary & Writs",
        "subtopic": "Writ Jurisdiction Comparison"
      },
      {
        "id": "gs-q-004",
        "sourceType": "MODELLED",
        "stem": "Article 44 of the Directive Principles of State Policy (DPSP) in the Indian Constitution directs the State to secure for all citizens:",
        "options": [
          {
            "id": "A",
            "text": "A Uniform Civil Code throughout the territory of India"
          },
          {
            "id": "B",
            "text": "Organization of Village Panchayats"
          },
          {
            "id": "C",
            "text": "Separation of judiciary from the executive"
          },
          {
            "id": "D",
            "text": "Promotion of international peace and security"
          }
        ],
        "correctOption": "A",
        "explanation": "Article 44 states: 'The State shall endeavour to secure for the citizens a uniform civil code throughout the territory of India.' Village Panchayats are under Article 40, separation of judiciary under Article 50, and international peace under Article 51.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2023",
        "topic": "Directive Principles of State Policy",
        "subtopic": "Article 44 Uniform Civil Code"
      },
      {
        "id": "gs-q-005",
        "sourceType": "MODELLED",
        "stem": "Fundamental Duties in Part IV-A (Article 51A) of the Constitution were incorporated upon the recommendation of which committee?",
        "options": [
          {
            "id": "A",
            "text": "Swaran Singh Committee"
          },
          {
            "id": "B",
            "text": "Sarkaria Commission"
          },
          {
            "id": "C",
            "text": "Verma Committee"
          },
          {
            "id": "D",
            "text": "Balwant Rai Mehta Committee"
          }
        ],
        "correctOption": "A",
        "explanation": "The Sardar Swaran Singh Committee (1976) recommended the inclusion of Fundamental Duties. The 42nd Amendment Act added 10 duties in 1976, and the 86th Amendment Act in 2002 added the 11th duty (education for children aged 6-14).",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2022",
        "topic": "Fundamental Duties",
        "subtopic": "Swaran Singh Committee"
      },
      {
        "id": "gs-q-006",
        "sourceType": "MODELLED",
        "stem": "As per Article 61 of the Indian Constitution, the resolution for impeaching the President of India must be passed by what majority in each House of Parliament?",
        "options": [
          {
            "id": "A",
            "text": "A majority of not less than two-thirds of the total membership of the House"
          },
          {
            "id": "B",
            "text": "A majority of not less than two-thirds of members present and voting"
          },
          {
            "id": "C",
            "text": "A simple majority of the total membership"
          },
          {
            "id": "D",
            "text": "An absolute majority of members present and voting"
          }
        ],
        "correctOption": "A",
        "explanation": "Article 61 specifies the most stringent majority requirement in the Indian Constitution: the impeachment resolution must be passed by a majority of not less than two-thirds of the TOTAL membership of the House (not just present and voting).",
        "formulaContext": null,
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Union Executive",
        "subtopic": "Impeachment of the President"
      },
      {
        "id": "gs-q-007",
        "sourceType": "MODELLED",
        "stem": "Under which Article of the Indian Constitution is the Governor of a State empowered to promulgate ordinances during the recess of the State Legislature?",
        "options": [
          {
            "id": "A",
            "text": "Article 213"
          },
          {
            "id": "B",
            "text": "Article 123"
          },
          {
            "id": "C",
            "text": "Article 163"
          },
          {
            "id": "D",
            "text": "Article 161"
          }
        ],
        "correctOption": "A",
        "explanation": "Article 213 empowers the Governor to promulgate ordinances when the state legislative assembly is not in session. Article 123 grants corresponding ordinance-making power to the President of India.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2023",
        "topic": "State Executive",
        "subtopic": "Governor's Ordinance Making Power"
      },
      {
        "id": "gs-q-008",
        "sourceType": "MODELLED",
        "stem": "If a Money Bill passed by the Lok Sabha is transmitted to the Rajya Sabha, within how many days must the Rajya Sabha return it with or without recommendations?",
        "options": [
          {
            "id": "A",
            "text": "14 days"
          },
          {
            "id": "B",
            "text": "30 days"
          },
          {
            "id": "C",
            "text": "60 days"
          },
          {
            "id": "D",
            "text": "180 days (6 months)"
          }
        ],
        "correctOption": "A",
        "explanation": "Under Article 109, the Rajya Sabha has restricted powers regarding Money Bills. It must return the Bill within 14 days. If not returned within 14 days, the Bill is deemed to have been passed by both Houses in the form passed by the Lok Sabha.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Parliament",
        "subtopic": "Money Bill Procedure"
      },
      {
        "id": "gs-q-009",
        "sourceType": "MODELLED",
        "stem": "Who among the following presides over a Joint Sitting of both Houses of Parliament convened under Article 108?",
        "options": [
          {
            "id": "A",
            "text": "Speaker of the Lok Sabha"
          },
          {
            "id": "B",
            "text": "Chairman of the Rajya Sabha (Vice President)"
          },
          {
            "id": "C",
            "text": "President of India"
          },
          {
            "id": "D",
            "text": "Leader of the House in Lok Sabha"
          }
        ],
        "correctOption": "A",
        "explanation": "Under Article 118(4), a joint sitting of Parliament is presided over by the Speaker of the Lok Sabha (or in their absence, the Deputy Speaker, or Deputy Chairman of Rajya Sabha). The Chairman of Rajya Sabha (Vice President) never presides because he is not a member of Parliament.",
        "formulaContext": null,
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / State PSC GS Paper I 2022",
        "topic": "Parliament",
        "subtopic": "Joint Sitting Provisions"
      },
      {
        "id": "gs-q-010",
        "sourceType": "MODELLED",
        "stem": "A constitutional amendment bill that seeks to alter the federal provisions of the Constitution (such as representation of states in Parliament) requires:",
        "options": [
          {
            "id": "A",
            "text": "Special majority of Parliament and ratification by legislatures of not less than one-half of the States by simple majority"
          },
          {
            "id": "B",
            "text": "Two-thirds majority of both Houses only without state involvement"
          },
          {
            "id": "C",
            "text": "Simple majority of Parliament"
          },
          {
            "id": "D",
            "text": "Three-fourths majority of both Houses and all States"
          }
        ],
        "correctOption": "A",
        "explanation": "Article 368(2) specifies that amendments affecting federal structure (election of President, distribution of legislative powers between Union and States, representation of States in Parliament, Supreme Court/High Court powers) require special majority in Parliament plus ratification by legislatures of at least 50% of the States.",
        "formulaContext": null,
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Amendment of Constitution",
        "subtopic": "Article 368 Scope"
      },
      {
        "id": "gs-q-011",
        "sourceType": "MODELLED",
        "stem": "The historic doctrine of 'Basic Structure' of the Indian Constitution was propounded by the Supreme Court in:",
        "options": [
          {
            "id": "A",
            "text": "Kesavananda Bharati v. State of Kerala (1973)"
          },
          {
            "id": "B",
            "text": "Golaknath v. State of Punjab (1967)"
          },
          {
            "id": "C",
            "text": "Minerva Mills v. Union of India (1980)"
          },
          {
            "id": "D",
            "text": "Shankari Prasad v. Union of India (1951)"
          }
        ],
        "correctOption": "A",
        "explanation": "In Kesavananda Bharati (1973), a 13-judge bench held by a 7-6 majority that Parliament's amending power under Article 368 is not unlimited and cannot alter, damage, or destroy the 'basic structure' of the Constitution.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2023",
        "topic": "Constitutional Law",
        "subtopic": "Basic Structure Doctrine"
      },
      {
        "id": "gs-q-012",
        "sourceType": "MODELLED",
        "stem": "The 73rd Constitutional Amendment Act, 1992 added the Eleventh Schedule to the Constitution containing how many functional items for Panchayats?",
        "options": [
          {
            "id": "A",
            "text": "29 functional items"
          },
          {
            "id": "B",
            "text": "18 functional items"
          },
          {
            "id": "C",
            "text": "12 functional items"
          },
          {
            "id": "D",
            "text": "35 functional items"
          }
        ],
        "correctOption": "A",
        "explanation": "The 11th Schedule (added by the 73rd Amendment) contains 29 functional subjects placed within the purview of Panchayats. The 12th Schedule (added by the 74th Amendment for Municipalities) contains 18 functional items.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Local Self Government",
        "subtopic": "73rd Amendment & 11th Schedule"
      },
      {
        "id": "gs-q-013",
        "sourceType": "MODELLED",
        "stem": "Under the Tenth Schedule (Anti-Defection Law) of the Constitution, questions regarding disqualification on grounds of defection are decided by:",
        "options": [
          {
            "id": "A",
            "text": "The Chairman or the Speaker of the respective House"
          },
          {
            "id": "B",
            "text": "The President of India on advice of the Election Commission"
          },
          {
            "id": "C",
            "text": "The Supreme Court of India directly"
          },
          {
            "id": "D",
            "text": "The Attorney General of India"
          }
        ],
        "correctOption": "A",
        "explanation": "Paragraph 6 of the Tenth Schedule states that any question regarding disqualification arising out of defection shall be referred to and decided by the Chairman (Rajya Sabha/Legislative Council) or the Speaker (Lok Sabha/Legislative Assembly). In Kihoto Hollohan (1992), this decision was made subject to judicial review.",
        "formulaContext": null,
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / State PSC GS Paper I 2023",
        "topic": "Parliament & State Legislatures",
        "subtopic": "Anti-Defection Law (10th Schedule)"
      },
      {
        "id": "gs-q-014",
        "sourceType": "MODELLED",
        "stem": "By which Constitutional Amendment was the phrase 'internal disturbance' replaced with 'armed rebellion' as a ground for proclaiming National Emergency under Article 352?",
        "options": [
          {
            "id": "A",
            "text": "44th Constitutional Amendment Act, 1978"
          },
          {
            "id": "B",
            "text": "42nd Constitutional Amendment Act, 1976"
          },
          {
            "id": "C",
            "text": "38th Constitutional Amendment Act, 1975"
          },
          {
            "id": "D",
            "text": "52nd Constitutional Amendment Act, 1985"
          }
        ],
        "correctOption": "A",
        "explanation": "The 44th Amendment Act of 1978 introduced crucial safeguards to prevent misuse of emergency provisions, substituting 'armed rebellion' for the vague term 'internal disturbance' under Article 352.",
        "formulaContext": null,
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / State PSC GS Paper I 2022",
        "topic": "Emergency Provisions",
        "subtopic": "National Emergency Grounds"
      },
      {
        "id": "gs-q-015",
        "sourceType": "MODELLED",
        "stem": "How many times has a Financial Emergency been declared in India under Article 360 since the adoption of the Constitution?",
        "options": [
          {
            "id": "A",
            "text": "Never"
          },
          {
            "id": "B",
            "text": "Once (during 1991 balance of payments crisis)"
          },
          {
            "id": "C",
            "text": "Twice"
          },
          {
            "id": "D",
            "text": "Three times"
          }
        ],
        "correctOption": "A",
        "explanation": "A Financial Emergency under Article 360 of the Constitution has NEVER been declared in India so far.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2021",
        "topic": "Emergency Provisions",
        "subtopic": "Financial Emergency Status"
      },
      {
        "id": "gs-q-016",
        "sourceType": "MODELLED",
        "stem": "The audit reports of the Comptroller and Auditor General of India (CAG) submitted under Article 151 are examined by which Parliamentary Committee?",
        "options": [
          {
            "id": "A",
            "text": "Public Accounts Committee (PAC)"
          },
          {
            "id": "B",
            "text": "Estimates Committee"
          },
          {
            "id": "C",
            "text": "Committee on Public Undertakings (COPU)"
          },
          {
            "id": "D",
            "text": "Business Advisory Committee"
          }
        ],
        "correctOption": "A",
        "explanation": "The Public Accounts Committee (PAC) examines the audit reports of the CAG. The CAG acts as a 'guide, friend, and philosopher' to the PAC.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Constitutional Bodies",
        "subtopic": "Comptroller and Auditor General (CAG)"
      },
      {
        "id": "gs-q-017",
        "sourceType": "MODELLED",
        "stem": "Under Article 280 of the Indian Constitution, the Finance Commission is constituted by the President of India every:",
        "options": [
          {
            "id": "A",
            "text": "Fifth year (or earlier)"
          },
          {
            "id": "B",
            "text": "Third year"
          },
          {
            "id": "C",
            "text": "Sixth year"
          },
          {
            "id": "D",
            "text": "Seventh year"
          }
        ],
        "correctOption": "A",
        "explanation": "Article 280 mandates that the President shall, at the expiration of every fifth year or at such earlier time as he considers necessary, constitute a Finance Commission consisting of a Chairman and four other members.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2023",
        "topic": "Constitutional Bodies",
        "subtopic": "Finance Commission Composition"
      },
      {
        "id": "gs-q-018",
        "sourceType": "MODELLED",
        "stem": "The Election Commission of India, which originally operated as a single-member body, became a permanent multi-member body consisting of the Chief Election Commissioner and two Election Commissioners in:",
        "options": [
          {
            "id": "A",
            "text": "October 1993"
          },
          {
            "id": "B",
            "text": "January 1950"
          },
          {
            "id": "C",
            "text": "December 1976"
          },
          {
            "id": "D",
            "text": "August 1989"
          }
        ],
        "correctOption": "A",
        "explanation": "The Election Commission was made a multi-member body briefly in 1989 and permanently functioning with 1 CEC and 2 ECs since October 1, 1993 under the Chief Election Commissioner and other Election Commissioners (Conditions of Service) Amendment Act.",
        "formulaContext": null,
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Constitutional Bodies",
        "subtopic": "Election Commission Multi-Member Status"
      }
    ],
    "unitName": "Indian Polity & Governance",
    "codeClause": "Constitution of India Art. 1 - 395",
    "confidencePercent": 72,
    "masteredStatus": "Mastered",
    "diagramType": "polity",
    "subtopicList": [
      "Preamble & Basic Structure Doctrine",
      "Fundamental Rights (Articles 12-35) & Writs (Art. 32 & 226)",
      "Directive Principles of State Policy & Fundamental Duties",
      "Union & State Executive (President, PM, Governor, CM)",
      "Supreme Court & High Courts Jurisdiction",
      "73rd/74th Constitutional Amendments & Sixth Schedule ADCs in Assam"
    ],
    "comparisonGrid": {
      "titleLeft": "Supreme Court Writs (Art. 32)",
      "tagLeft": "Fundamental Right Itself",
      "valueLeft": "Enforcement of FRs Only",
      "descLeft": "Article 32 is called the 'Heart and Soul' of the Constitution by Dr. B.R. Ambedkar; Supreme Court cannot refuse to grant relief for FR violations.",
      "titleRight": "High Court Writs (Art. 226)",
      "tagRight": "Discretionary Jurisdiction",
      "valueRight": "FRs + Any Other Purpose",
      "descRight": "Article 226 gives wider jurisdiction than Art. 32, allowing High Courts to issue writs for both Fundamental Rights and common legal rights."
    },
    "callouts": {
      "corePostulate": "The 42nd Amendment Act 1976 amended the Preamble by adding three words: 'Socialist', 'Secular', and 'Integrity'. The Preamble has been amended only once in Indian constitutional history.",
      "corePostulateRef": "42nd Constitutional Amendment Act, 1976",
      "examTrap": "Sixth Schedule applies ONLY to tribal areas in four Northeastern states: Assam, Meghalaya, Tripura, and Mizoram (AMTM). It does NOT apply to Manipur, Nagaland, or Arunachal Pradesh!",
      "examTrapRef": "APSC CCE & AE 2020",
      "testedRatios": [
        {
          "label": "Assam 6th Schedule Councils:",
          "value": "BTC, KAAC, and DHAC"
        },
        {
          "label": "ADC Council Members:",
          "value": "30 members (26 elected, 4 nominated)"
        },
        {
          "label": "Anti-Defection Law:",
          "value": "10th Schedule (52nd Amendment 1985)"
        },
        {
          "label": "Right to Education:",
          "value": "Article 21A (86th Amendment 2002)"
        }
      ],
      "numericalShortcut": {
        "formula": "Emergency Articles: 352 (National) -> 356 (State) -> 360 (Financial)",
        "note": "Grounds for National Emergency: War, External Aggression, Armed Rebellion. The 44th Amendment 1978 substituted 'Armed Rebellion' for 'Internal Disturbance'."
      }
    },
    "aiTutorPrompts": [
      {
        "question": "What is the Kesavananda Bharati basic structure doctrine?",
        "answerPreview": "In 1973, a 13-judge bench ruled that while Parliament can amend any part of the Constitution under Article 368, it cannot destroy or alter the 'basic structure' (e.g. supremacy of constitution, secularism, separation of powers, judicial review)."
      },
      {
        "question": "What are the 5 types of constitutional writs?",
        "answerPreview": "1. Habeas Corpus (release illegal detainee), 2. Mandamus (command official to perform duty), 3. Prohibition (halt lower court proceedings), 4. Certiorari (quash lower court order), 5. Quo-Warranto (prevent usurping public office)."
      }
    ]
  },
  {
    "id": "civil-fluids",
    "title": "Fluid Mechanics & Open Channel Flow",
    "subject": "Fluid Mechanics & Hydraulics",
    "category": "civil",
    "readTime": "16 min read",
    "weightage": "HIGH_YIELD",
    "icon": "Droplets",
    "summary": "Fluid statics, hydrostatic thrust, Bernoulli equation, boundary layer theory, Darcy-Weisbach pipe friction, Manning open channel hydraulics, and hydraulic jumps.",
    "prerequisites": [
      "Engineering Mechanics",
      "Calculus"
    ],
    "standardReferences": [
      "Modi & Seth",
      "Subramanya Open Channel Flow"
    ],
    "practiceQuestionIds": [
      "ce-q-053",
      "ce-q-054",
      "ce-q-055",
      "ce-q-056",
      "ce-q-057",
      "ce-q-058",
      "ce-q-059",
      "ce-q-060",
      "ce-q-061",
      "ce-q-062",
      "ce-q-063",
      "ce-q-064"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "stepTitle": "Hydrostatic Forces & Center of Pressure",
        "subtitle": "Total thrust on submerged plane surfaces and depth of center of pressure",
        "keyConcept": "Hydrostatic pressure increases linearly with depth (p = rho * g * h). Total hydrostatic thrust on a submerged plane surface equals pressure at centroid times area: F = rho * g * A * h_bar. Center of pressure always lies BELOW the centroid.",
        "formulaOrCode": "h_{cp} = \\bar{h} + \\frac{I_G \\sin^2 \\theta}{A \\bar{h}} \\quad ; \\quad F = \\rho g A \\bar{h}",
        "highYieldFacts": [
          "For a vertical surface (theta = 90 deg): h_cp = h_bar + I_G / (A * h_bar).",
          "For a vertical rectangular plate of height d with top edge at free surface: h_cp = 2/3 d.",
          "For a vertical triangle with base at free surface: h_cp = d / 2; with vertex at surface: h_cp = 3/4 d.",
          "Metacentric height GM = BM - BG = (I / V) - BG. For stable equilibrium of floating bodies, GM > 0 (M must be above G)."
        ],
        "examTrap": "Center of pressure NEVER lies above the centroid for submerged plane surfaces. As depth increases, h_cp approaches h_bar asymptotically.",
        "benchmarkExample": {
          "question": "A vertical rectangular sluice gate of width 2 m and height 3 m has its top edge at the water surface. Find the depth of the center of pressure.",
          "options": [
            "1.5 m",
            "2.0 m",
            "2.25 m",
            "2.5 m"
          ],
          "correctAnswer": "2.0 m",
          "stepByStepSolution": [
            "Step 1: Centroid is at mid-depth: h_bar = 3 / 2 = 1.5 m.",
            "Step 2: For a vertical rectangle with top edge at surface: h_cp = (2/3) * d.",
            "Step 3: h_cp = (2/3) * 3 = 2.0 m."
          ],
          "takeaway": "Vertical rectangle with top at free surface: h_cp = 2/3 * depth."
        },
        "pointers": [
          "For a vertical surface (theta = 90 deg): h_cp = h_bar + I_G / (A * h_bar).",
          "For a vertical rectangular plate of height d with top edge at free surface: h_cp = 2/3 d.",
          "For a vertical triangle with base at free surface: h_cp = d / 2; with vertex at surface: h_cp = 3/4 d.",
          "Metacentric height GM = BM - BG = (I / V) - BG. For stable equilibrium of floating bodies, GM > 0 (M must be above G)."
        ]
      },
      {
        "stepNumber": 2,
        "stepTitle": "Bernoulli Equation, Pipe Friction & Losses",
        "subtitle": "Conservation of energy, Darcy-Weisbach formula, and minor losses",
        "keyConcept": "Bernoulli's theorem states that along a streamline of an inviscid, incompressible, steady flow, total mechanical energy (pressure + velocity + datum heads) is constant. In real pipes, energy is lost due to boundary friction and geometry changes.",
        "formulaOrCode": "\\frac{p_1}{\\rho g} + \\frac{v_1^2}{2g} + z_1 = \\frac{p_2}{\\rho g} + \\frac{v_2^2}{2g} + z_2 + h_f \\quad ; \\quad h_f = \\frac{f L v^2}{2 g D}",
        "highYieldFacts": [
          "For laminar flow in circular pipes (Re < 2000): Darcy friction factor f = 64 / Re.",
          "Fanning friction coefficient f' = f / 4 = 16 / Re.",
          "Head loss at sudden expansion: h_L = (v_1 - v_2)^2 / (2g).",
          "Head loss at pipe entrance: h_L = 0.5 v^2 / (2g); at pipe exit: h_L = v^2 / (2g)."
        ],
        "examTrap": "Check whether the question uses Darcy friction factor 'f' (h_f = fLv\u00b2/2gD) or Chezy/Fanning coefficient 'f'' (h_f = 4f'Lv\u00b2/2gD). Darcy f is 4 times Fanning f'.",
        "benchmarkExample": {
          "question": "In laminar flow through a pipe, what is the value of the Darcy friction factor f when Reynolds number is 1600?",
          "options": [
            "0.01",
            "0.02",
            "0.04",
            "0.08"
          ],
          "correctAnswer": "0.04",
          "stepByStepSolution": [
            "Step 1: Formula for Darcy friction factor in laminar flow: f = 64 / Re.",
            "Step 2: Substitute Re = 1600: f = 64 / 1600 = 4 / 100 = 0.04."
          ],
          "takeaway": "Laminar Darcy f = 64 / Re; Fanning f' = 16 / Re."
        },
        "pointers": [
          "For laminar flow in circular pipes (Re < 2000): Darcy friction factor f = 64 / Re.",
          "Fanning friction coefficient f' = f / 4 = 16 / Re.",
          "Head loss at sudden expansion: h_L = (v_1 - v_2)^2 / (2g).",
          "Head loss at pipe entrance: h_L = 0.5 v^2 / (2g); at pipe exit: h_L = v^2 / (2g)."
        ]
      },
      {
        "stepNumber": 3,
        "stepTitle": "Open Channel Flow & Hydraulic Jumps",
        "subtitle": "Manning's equation, critical flow, and jump energy dissipation",
        "keyConcept": "Open channel flow has a free surface subject to atmospheric pressure. The flow is classified by Froude number Fr: subcritical (Fr < 1), critical (Fr = 1), and supercritical (Fr > 1). A hydraulic jump is a rapid transition from supercritical to subcritical flow.",
        "formulaOrCode": "Fr = \\frac{v}{\\sqrt{g y}} \\quad ; \\quad \\frac{y_2}{y_1} = \\frac{1}{2}\\left(\\sqrt{1 + 8 Fr_1^2} - 1\\right) \\quad ; \\quad \\Delta E = \\frac{(y_2 - y_1)^3}{4 y_1 y_2}",
        "highYieldFacts": [
          "At critical flow (Fr = 1): Specific energy E is minimum for a given discharge; discharge is maximum for a given specific energy.",
          "Critical depth in rectangular channel: y_c = (q^2 / g)^(1/3); Minimum specific energy E_min = 1.5 y_c.",
          "Hydraulic jump occurs ONLY when upstream flow is supercritical (Fr_1 > 1).",
          "Belanger's equation relates conjugate/sequent depths y_1 and y_2."
        ],
        "examTrap": "Sequent depths (or conjugate depths) belong to hydraulic jumps with equal specific force. Alternate depths belong to equal specific energy. Do not interchange them!",
        "benchmarkExample": {
          "question": "In a rectangular channel, what is the minimum specific energy E_min for critical depth y_c = 2.0 m?",
          "options": [
            "2.0 m",
            "2.5 m",
            "3.0 m",
            "4.0 m"
          ],
          "correctAnswer": "3.0 m",
          "stepByStepSolution": [
            "Step 1: In a rectangular channel at critical flow, E_min = y_c + v_c^2 / (2g) = y_c + y_c / 2 = 1.5 y_c.",
            "Step 2: E_min = 1.5 * 2.0 = 3.0 m."
          ],
          "takeaway": "Rectangular channel: E_min = 1.5 * y_c."
        },
        "pointers": [
          "At critical flow (Fr = 1): Specific energy E is minimum for a given discharge; discharge is maximum for a given specific energy.",
          "Critical depth in rectangular channel: y_c = (q^2 / g)^(1/3); Minimum specific energy E_min = 1.5 y_c.",
          "Hydraulic jump occurs ONLY when upstream flow is supercritical (Fr_1 > 1).",
          "Belanger's equation relates conjugate/sequent depths y_1 and y_2."
        ]
      }
    ],
    "fullDescription": "Comprehensive module covering fundamental and advanced concepts of Fluid Mechanics & Open Channel Flow tailored for competitive civil engineering examinations (GATE, ESE, SSC JE, State AE/JE). Includes key principles, governing IS/IRC code formulas, exam traps, and benchmark problems.",
    "syllabusCoverage": [
      "Core Principles of Fluid Mechanics & Hydraulics",
      "Governing Specifications & Code Clauses",
      "High-Yield Problem Solving & Formula Derivations",
      "Previous Year Questions (PYQs) & Exam Pitfalls"
    ],
    "topicQuestions": [
      {
        "id": "ce-q-053",
        "sourceType": "MODELLED",
        "stem": "The CGS unit of kinematic viscosity is 'Stokes'. 1 Stokes is equal to:",
        "options": [
          {
            "id": "A",
            "text": "1 cm\u00b2/s (or 10\u207b\u2074 m\u00b2/s)"
          },
          {
            "id": "B",
            "text": "1 m\u00b2/s"
          },
          {
            "id": "C",
            "text": "10\u207b\u00b3 m\u00b2/s"
          },
          {
            "id": "D",
            "text": "1 N\u00b7s/m\u00b2"
          }
        ],
        "correctOption": "A",
        "explanation": "Kinematic viscosity is dynamic viscosity divided by fluid density (\u03bd = \u03bc / \u03c1) with dimensions [L\u00b2 T\u207b\u00b9]. In SI units it is m\u00b2/s, and in CGS units 1 cm\u00b2/s = 1 Stokes = 10\u207b\u2074 m\u00b2/s. 1 Poise = 0.1 N\u00b7s/m\u00b2 = 0.1 Pa\u00b7s.",
        "formulaContext": "1 Stokes = 1 cm\u00b2/s = 10\u207b\u2074 m\u00b2/s; Kinematic viscosity \u03bd = \u03bc / \u03c1",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Fluid Properties",
        "subtopic": "Kinematic Viscosity Units"
      },
      {
        "id": "ce-q-054",
        "sourceType": "MODELLED",
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
        "explanation": "From the hydrostatic pressure formula for vertical submerged surfaces, hc = h\u0304 + IG/(A\u00b7h\u0304). Substituting h\u0304 = d/2, IG = bd\u00b3/12, and A = bd gives hc = d/2 + d/6 = 2/3 d.",
        "formulaContext": "hc = h\u0304 + IG / (A \u00b7 h\u0304) = d/2 + (b d\u00b3 / 12) / ((b d) \u00b7 (d/2)) = d/2 + d/6 = 2d/3",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2023",
        "topic": "Hydrostatics",
        "subtopic": "Center of Pressure"
      },
      {
        "id": "ce-q-055",
        "sourceType": "MODELLED",
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
        "explanation": "A floating body is in stable equilibrium when GM > 0 (M lies above G), neutral when GM = 0 (M coincides with G), and unstable when GM < 0 (M lies below G, producing an upsetting moment).",
        "formulaContext": "GM = BM - BG > 0 for stable equilibrium",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2022",
        "topic": "Buoyancy and Floatation",
        "subtopic": "Metacentric Height & Stability"
      },
      {
        "id": "ce-q-056",
        "sourceType": "MODELLED",
        "stem": "The general continuity equation for steady, 3D incompressible flow in Cartesian coordinates is:",
        "options": [
          {
            "id": "A",
            "text": "\u2202u/\u2202x + \u2202v/\u2202y + \u2202w/\u2202z = 0"
          },
          {
            "id": "B",
            "text": "u \u00b7 \u2202u/\u2202x + v \u00b7 \u2202v/\u2202y + w \u00b7 \u2202w/\u2202z = 0"
          },
          {
            "id": "C",
            "text": "\u2202u/\u2202x - \u2202v/\u2202y + \u2202w/\u2202z = 0"
          },
          {
            "id": "D",
            "text": "\u2202\u00b2u/\u2202x\u00b2 + \u2202\u00b2v/\u2202y\u00b2 + \u2202\u00b2w/\u2202z\u00b2 = 0"
          }
        ],
        "correctOption": "A",
        "explanation": "Conservation of mass for a fluid with constant density \u03c1 leads to the divergence of velocity vector being zero: div(V) = \u2202u/\u2202x + \u2202v/\u2202y + \u2202w/\u2202z = 0.",
        "formulaContext": "\u2207 \u00b7 V = \u2202u/\u2202x + \u2202v/\u2202y + \u2202w/\u2202z = 0",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Fluid Kinematics",
        "subtopic": "Continuity Equation"
      },
      {
        "id": "ce-q-057",
        "sourceType": "MODELLED",
        "stem": "The vertical distance between the Total Energy Line (TEL) and Hydraulic Gradient Line (HGL) at any cross-section of a pipe flow represents the:",
        "options": [
          {
            "id": "A",
            "text": "Pressure head (p / \u03b3)"
          },
          {
            "id": "B",
            "text": "Velocity head (v\u00b2 / 2g)"
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
        "explanation": "Total Energy Line = p/\u03b3 + z + v\u00b2/2g. Hydraulic Gradient Line = p/\u03b3 + z. The difference between TEL and HGL is strictly the kinetic velocity head v\u00b2 / (2g).",
        "formulaContext": "TEL - HGL = v\u00b2 / (2g)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2021",
        "topic": "Fluid Dynamics",
        "subtopic": "HGL and TEL Relationship"
      },
      {
        "id": "ce-q-058",
        "sourceType": "MODELLED",
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
        "explanation": "Due to smooth streamlined gradual convergence and divergence in a venturimeter, boundary layer separation and eddy losses are minimal, yielding Cd = 0.96 to 0.98. Orifice meters have sudden contraction with vena contracta, giving Cd \u2248 0.60 - 0.65.",
        "formulaContext": "Cd(venturi) \u2248 0.96 - 0.98 vs Cd(orifice) \u2248 0.60 - 0.65",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2023",
        "topic": "Flow Measurement",
        "subtopic": "Venturimeter Discharge Coefficient"
      },
      {
        "id": "ce-q-059",
        "sourceType": "MODELLED",
        "stem": "The head loss due to friction in a pipe of length L, diameter D, carrying fluid at average velocity v is given by the Darcy-Weisbach equation as:",
        "options": [
          {
            "id": "A",
            "text": "hf = f \u00b7 L \u00b7 v\u00b2 / (2 \u00b7 g \u00b7 D)"
          },
          {
            "id": "B",
            "text": "hf = 4 \u00b7 f \u00b7 L \u00b7 v / (2 \u00b7 g \u00b7 D)"
          },
          {
            "id": "C",
            "text": "hf = f \u00b7 L \u00b7 v / (g \u00b7 D)"
          },
          {
            "id": "D",
            "text": "hf = f \u00b7 L\u00b2 \u00b7 v / (2 \u00b7 g \u00b7 D)"
          }
        ],
        "correctOption": "A",
        "explanation": "The Darcy-Weisbach equation is hf = f \u00b7 L \u00b7 v\u00b2 / (2 g D). If Fanning friction factor f' is used, hf = 4 f' L v\u00b2 / (2 g D), where f = 4 f'.",
        "formulaContext": "hf = f \u00b7 L \u00b7 v\u00b2 / (2 \u00b7 g \u00b7 D) [where f is Darcy friction factor]",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Pipe Flow",
        "subtopic": "Darcy-Weisbach Equation"
      },
      {
        "id": "ce-q-060",
        "sourceType": "MODELLED",
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
        "explanation": "Velocity distribution across a circular pipe is parabolic: u(r) = umax \u00b7 (1 - r\u00b2/R\u00b2). Integrating over the cross-section yields vavg = umax / 2, meaning maximum centerline velocity is exactly twice the average velocity (umax = 2 vavg).",
        "formulaContext": "umax = 2 \u00b7 vavg (Circular Pipe); umax = 1.5 \u00b7 vavg (Parallel Plates)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2022",
        "topic": "Laminar Flow in Pipes",
        "subtopic": "Hagen-Poiseuille Velocity Distribution"
      },
      {
        "id": "ce-q-061",
        "sourceType": "MODELLED",
        "stem": "In SI units, Manning's equation for uniform flow velocity (V) in an open channel of hydraulic radius R and bed slope S is:",
        "options": [
          {
            "id": "A",
            "text": "V = (1 / n) \u00b7 R^(2/3) \u00b7 S^(1/2)"
          },
          {
            "id": "B",
            "text": "V = (1 / n) \u00b7 R^(1/2) \u00b7 S^(2/3)"
          },
          {
            "id": "C",
            "text": "V = n \u00b7 R^(2/3) \u00b7 S^(1/2)"
          },
          {
            "id": "D",
            "text": "V = (1 / n) \u00b7 R^(3/4) \u00b7 S^(1/2)"
          }
        ],
        "correctOption": "A",
        "explanation": "Robert Manning's empirical formula for uniform flow velocity is V = (1/n) \u00b7 R^(2/3) \u00b7 S^(1/2), where n is Manning's roughness coefficient, R is hydraulic radius (Area / Wetted Perimeter), and S is longitudinal bed slope.",
        "formulaContext": "V = (1 / n) \u00b7 R^(2/3) \u00b7 S^(1/2)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Open Channel Flow",
        "subtopic": "Manning's Formula"
      },
      {
        "id": "ce-q-062",
        "sourceType": "MODELLED",
        "stem": "For a rectangular open channel carrying discharge q per unit width, the critical depth (yc) is given by:",
        "options": [
          {
            "id": "A",
            "text": "yc = (q\u00b2 / g)^(1/3)"
          },
          {
            "id": "B",
            "text": "yc = (q / g)^(1/2)"
          },
          {
            "id": "C",
            "text": "yc = (q\u00b2 / g)^(1/2)"
          },
          {
            "id": "D",
            "text": "yc = (q / g\u00b2)^(1/3)"
          }
        ],
        "correctOption": "A",
        "explanation": "At critical flow condition, specific energy is minimum for a given discharge, giving Froude number Fr = v / \u221a(g yc) = 1. Substituting v = q / yc leads directly to yc\u00b3 = q\u00b2 / g => yc = (q\u00b2 / g)^(1/3). Minimum specific energy Emin = 1.5 yc.",
        "formulaContext": "yc = (q\u00b2 / g)^(1/3); Froude number Fr = 1 at critical depth",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2023",
        "topic": "Open Channel Flow",
        "subtopic": "Critical Depth in Rectangular Channel"
      },
      {
        "id": "ce-q-063",
        "sourceType": "MODELLED",
        "stem": "The relationship between pre-jump depth (y1) and post-jump sequent depth (y2) in a horizontal rectangular channel with initial Froude number Fr1 is:",
        "options": [
          {
            "id": "A",
            "text": "y2 / y1 = 0.5 \u00b7 [\u221a(1 + 8 \u00b7 Fr1\u00b2) - 1]"
          },
          {
            "id": "B",
            "text": "y2 / y1 = 0.5 \u00b7 [\u221a(1 + 8 \u00b7 Fr1\u00b2) + 1]"
          },
          {
            "id": "C",
            "text": "y2 / y1 = \u221a(1 + 8 \u00b7 Fr1\u00b2)"
          },
          {
            "id": "D",
            "text": "y2 / y1 = 0.5 \u00b7 [\u221a(1 + 4 \u00b7 Fr1\u00b2) - 1]"
          }
        ],
        "correctOption": "A",
        "explanation": "Applying momentum equation across the hydraulic jump in a rectangular channel yields Belanger's equation: y2 / y1 = 0.5 \u00b7 (\u221a(1 + 8 Fr1\u00b2) - 1). Energy loss in jump is \u0394E = (y2 - y1)\u00b3 / (4 y1 y2).",
        "formulaContext": "y2 / y1 = 0.5 \u00b7 [\u221a(1 + 8 \u00b7 Fr1\u00b2) - 1] (Belanger equation)",
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Open Channel Flow",
        "subtopic": "Hydraulic Jump Sequent Depths"
      },
      {
        "id": "ce-q-064",
        "sourceType": "MODELLED",
        "stem": "The specific speed (Ns) of a hydraulic turbine generating power P under head H at rotational speed N is defined as:",
        "options": [
          {
            "id": "A",
            "text": "Ns = N \u00b7 \u221aP / H^(5/4)"
          },
          {
            "id": "B",
            "text": "Ns = N \u00b7 \u221aP / H^(3/4)"
          },
          {
            "id": "C",
            "text": "Ns = N \u00b7 \u221aQ / H^(3/4)"
          },
          {
            "id": "D",
            "text": "Ns = N \u00b7 P\u00b2 / H^(5/4)"
          }
        ],
        "correctOption": "A",
        "explanation": "Turbine specific speed is Ns = N \u221aP / H^(5/4). For Pelton wheel: Ns = 10-35 (low). For Francis turbine: Ns = 60-300 (medium). For Kaplan turbine: Ns = 300-1000 (high specific speed under low head).",
        "formulaContext": "Ns(turbine) = N \u00b7 \u221aP / H^(5/4); Ns(pump) = N \u00b7 \u221aQ / H^(3/4)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2021",
        "topic": "Hydraulic Machines",
        "subtopic": "Specific Speed of Turbines"
      }
    ],
    "unitName": "Water Resources & Fluid Mechanics",
    "codeClause": "Fluid Mechanics & Hydraulics Handbook",
    "confidencePercent": 62,
    "masteredStatus": "In Progress",
    "diagramType": "fluids",
    "subtopicList": [
      "Fluid Properties & Newton's Law of Viscosity",
      "Hydrostatic Pressure, Buoyancy & Metacenter",
      "Continuity & Velocity Potential / Stream Function",
      "Bernoulli Equation & Flow Measurement (Venturi/Orifice)",
      "Pipe Flow Friction (Darcy-Weisbach & Moody)",
      "Open Channel Flow & Hydraulic Jump"
    ],
    "comparisonGrid": {
      "titleLeft": "Laminar Pipe Flow",
      "tagLeft": "Re < 2000",
      "valueLeft": "f = 64 / Re",
      "descLeft": "Viscous forces dominate; parabolic velocity profile u = u_max(1 - r\u00b2/R\u00b2); maximum velocity is exactly 2 times average velocity.",
      "titleRight": "Turbulent Pipe Flow",
      "tagRight": "Re > 4000",
      "valueRight": "1/\u221af = 2 log(R/k) + 1.74",
      "descRight": "Inertia forces dominate; flat logarithmic / 1/7th power velocity profile; friction factor depends on relative pipe roughness."
    },
    "callouts": {
      "corePostulate": "For stable equilibrium of a submerged body, center of buoyancy B must lie above center of gravity G. For a floating body, metacentric height GM = (I / V) - BG must be positive.",
      "corePostulateRef": "Fluid Statics Principles",
      "examTrap": "Piezometric head is the sum of pressure head and elevation datum head (p/gamma + z). The Hydraulic Gradient Line (HGL) represents piezometric head, NOT total head!",
      "examTrapRef": "GATE & PSC Trap",
      "testedRatios": [
        {
          "label": "Hydraulic Jump Sequent Depth:",
          "value": "y2/y1 = 0.5 \u00b7 (\u221a(1 + 8Fr1\u00b2) - 1)"
        },
        {
          "label": "Energy Loss in Hydraulic Jump:",
          "value": "\u0394E = (y2 - y1)\u00b3 / (4 \u00b7 y1 \u00b7 y2)"
        },
        {
          "label": "Most Efficient Rectangular Channel:",
          "value": "R = y / 2  (Width B = 2y)"
        },
        {
          "label": "Most Efficient Trapezoidal Channel:",
          "value": "R = y / 2  (Side slope 60\u00b0)"
        }
      ],
      "numericalShortcut": {
        "formula": "Critical Depth in Rectangular Channel yc = (q\u00b2 / g)^(1/3)",
        "note": "At critical flow, Froude number Fr = 1.0, and specific energy is minimum: E_min = 1.5 yc."
      }
    },
    "aiTutorPrompts": [
      {
        "question": "What is the physical meaning of stream function psi and velocity potential phi?",
        "answerPreview": "Equipotential lines (phi = const) and streamlines (psi = const) intersect orthogonally everywhere. The difference between two streamlines equals the volumetric flow rate per unit thickness: q = psi2 - psi1."
      },
      {
        "question": "How do you calculate the head loss in sudden enlargement?",
        "answerPreview": "Loss due to sudden expansion is h_e = (v1 - v2)^2 / (2g). If expanding into a large reservoir (v2 = 0), exit loss = v1^2 / (2g)."
      }
    ]
  },
  {
    "id": "civil-env",
    "title": "Environmental Engineering: Water Treatment & BOD",
    "subject": "Environmental Engineering",
    "category": "civil",
    "readTime": "16 min read",
    "weightage": "HIGH_YIELD",
    "icon": "Activity",
    "summary": "Water quality parameters, plain sedimentation, coagulation-flocculation, rapid sand filtration, disinfection, BOD kinetics, activated sludge, and sewer design.",
    "prerequisites": [
      "Chemistry",
      "Fluid Mechanics"
    ],
    "standardReferences": [
      "S.K. Garg Environmental Engineering",
      "Peavy & Rowe"
    ],
    "practiceQuestionIds": [
      "ce-q-065",
      "ce-q-066",
      "ce-q-067",
      "ce-q-068",
      "ce-q-069",
      "ce-q-070",
      "ce-q-071",
      "ce-q-072",
      "ce-q-073",
      "ce-q-074"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "stepTitle": "Water Quality Parameters & Permissible Limits (IS 10500)",
        "subtitle": "Turbidity, hardness, fluorides, nitrates, and MPN coliforms",
        "keyConcept": "Potable water must meet Indian Standard IS 10500:2012 specifications for physical, chemical, and bacteriological standards to safeguard public health.",
        "formulaOrCode": "\\text{Total Hardness (mg/L as } CaCO_3) = 2.5 [Ca^{2+}] + 4.12 [Mg^{2+}]",
        "highYieldFacts": [
          "Fluoride: Desirable = 1.0 mg/L; Max = 1.5 mg/L (Deficiency causes dental caries; excess causes skeletal fluorosis).",
          "Nitrate: Permissible limit = 45 mg/L (Excess causes Methemoglobinemia or 'Blue Baby Disease' in infants).",
          "Turbidity limit: 1 NTU (acceptable), 5 NTU (cause for rejection). Measured by Nephelometer.",
          "E. Coli coliform in 100 mL treated drinking water must be ZERO (undetectable)."
        ],
        "examTrap": "Blue Baby syndrome is caused by excess NITRATE (> 45 mg/L), NOT nitrite or ammonia.",
        "benchmarkExample": {
          "question": "What is the permissible limit of nitrate in drinking water per IS 10500?",
          "options": [
            "10 mg/L",
            "20 mg/L",
            "45 mg/L",
            "100 mg/L"
          ],
          "correctAnswer": "45 mg/L",
          "stepByStepSolution": [
            "Step 1: Check IS 10500 standards for nitrate (NO3-).",
            "Step 2: Acceptable limit is 45 mg/L with no relaxation allowed."
          ],
          "takeaway": "Nitrate limit = 45 mg/L; Fluoride = 1.0 - 1.5 mg/L; Arsenic = 0.01 mg/L."
        },
        "pointers": [
          "Fluoride: Desirable = 1.0 mg/L; Max = 1.5 mg/L (Deficiency causes dental caries; excess causes skeletal fluorosis).",
          "Nitrate: Permissible limit = 45 mg/L (Excess causes Methemoglobinemia or 'Blue Baby Disease' in infants).",
          "Turbidity limit: 1 NTU (acceptable), 5 NTU (cause for rejection). Measured by Nephelometer.",
          "E. Coli coliform in 100 mL treated drinking water must be ZERO (undetectable)."
        ]
      },
      {
        "stepNumber": 2,
        "stepTitle": "Water Treatment Train: Sedimentation, Coagulation & Filtration",
        "subtitle": "Stokes law settling, alum chemistry, and rapid sand backwashing",
        "keyConcept": "Surface water undergoes aeration -> coagulation & flocculation (alum) -> sedimentation -> rapid sand filtration -> chlorination. Settling of discrete particles is governed by Stokes' Law.",
        "formulaOrCode": "v_s = \\frac{g (G - 1) d^2}{18 \\nu} \\quad ; \\quad \\text{Surface Overflow Rate } (SOR) = \\frac{Q}{A_s}",
        "highYieldFacts": [
          "Particles with settling velocity v_s >= SOR are 100% removed in an ideal sedimentation tank.",
          "Common coagulant: Alum (Al2(SO4)3 . 18 H2O); optimal pH range = 6.5 to 8.5.",
          "Rapid Sand Filter filtration rate: 3,000 to 6,000 L/m\u00b2/hour (approx 30 times faster than Slow Sand Filter).",
          "Slow Sand Filter cleans via bacterial biological layer known as 'Schmutzdecke'; requires scraping top layer."
        ],
        "examTrap": "In an ideal sedimentation tank, removal efficiency depends ONLY on surface overflow rate (Q / A_s) and is completely independent of tank depth!",
        "benchmarkExample": {
          "question": "In an ideal sedimentation tank, the percentage removal of discrete particles depends on:",
          "options": [
            "Depth of tank",
            "Surface overflow rate",
            "Length of tank only",
            "Volume of tank"
          ],
          "correctAnswer": "Surface overflow rate",
          "stepByStepSolution": [
            "Step 1: Fraction removed f = v_s / v_0 = v_s / (Q / A_s).",
            "Step 2: Here A_s is surface area (L * B).",
            "Step 3: Depth 'H' cancels out in retention time calculations."
          ],
          "takeaway": "Sedimentation removal efficiency depends on Surface Overflow Rate (Q/A_s), NOT depth."
        },
        "pointers": [
          "Particles with settling velocity v_s >= SOR are 100% removed in an ideal sedimentation tank.",
          "Common coagulant: Alum (Al2(SO4)3 . 18 H2O); optimal pH range = 6.5 to 8.5.",
          "Rapid Sand Filter filtration rate: 3,000 to 6,000 L/m\u00b2/hour (approx 30 times faster than Slow Sand Filter).",
          "Slow Sand Filter cleans via bacterial biological layer known as 'Schmutzdecke'; requires scraping top layer."
        ]
      },
      {
        "stepNumber": 3,
        "stepTitle": "BOD Kinetics & Biological Wastewater Treatment",
        "subtitle": "First-order deoxygenation, 5-day BOD, and Activated Sludge Process",
        "keyConcept": "Biochemical Oxygen Demand (BOD) measures the oxygen consumed by microorganisms while decomposing biodegradable organic matter. Standard laboratory test is 5-day BOD at 20 degrees Celsius (BOD_5).",
        "formulaOrCode": "BOD_t = L_0 (1 - 10^{-k t}) \\quad ; \\quad \\text{or } BOD_t = L_0 (1 - e^{-k' t}) \\quad ; \\quad BOD_5 \\approx 0.68 L_0",
        "highYieldFacts": [
          "BOD_5 at 20 deg C equals approximately 68% (or two-thirds) of ultimate BOD (L_0).",
          "Chemical Oxygen Demand (COD) > BOD always, because COD oxidizes both biodegradable and non-biodegradable organics using strong dichromate reagent.",
          "F/M ratio (Food-to-Microorganism) in conventional Activated Sludge Process = 0.2 to 0.4 day^-1.",
          "Sludge Volume Index (SVI) between 80 and 150 mL/g indicates good settling characteristics."
        ],
        "examTrap": "BOD rate constant 'k' depends on temperature: k_T = k_20 * (1.047)^(T - 20). It increases at higher temperatures, meaning oxygen is consumed faster!",
        "benchmarkExample": {
          "question": "If the 5-day BOD of a wastewater sample at 20\u00b0C is 200 mg/L and BOD_5 is 68% of ultimate BOD, what is the ultimate BOD (L_0)?",
          "options": [
            "240 mg/L",
            "294 mg/L",
            "320 mg/L",
            "400 mg/L"
          ],
          "correctAnswer": "294 mg/L",
          "stepByStepSolution": [
            "Step 1: BOD_5 = 0.68 * L_0.",
            "Step 2: L_0 = 200 / 0.68 = 294.1 mg/L = ~294 mg/L."
          ],
          "takeaway": "Ultimate BOD L_0 = BOD_5 / 0.68."
        },
        "pointers": [
          "BOD_5 at 20 deg C equals approximately 68% (or two-thirds) of ultimate BOD (L_0).",
          "Chemical Oxygen Demand (COD) > BOD always, because COD oxidizes both biodegradable and non-biodegradable organics using strong dichromate reagent.",
          "F/M ratio (Food-to-Microorganism) in conventional Activated Sludge Process = 0.2 to 0.4 day^-1.",
          "Sludge Volume Index (SVI) between 80 and 150 mL/g indicates good settling characteristics."
        ]
      }
    ],
    "fullDescription": "Comprehensive module covering fundamental and advanced concepts of Environmental Engineering: Water Treatment & BOD tailored for competitive civil engineering examinations (GATE, ESE, SSC JE, State AE/JE). Includes key principles, governing IS/IRC code formulas, exam traps, and benchmark problems.",
    "syllabusCoverage": [
      "Core Principles of Environmental Engineering",
      "Governing Specifications & Code Clauses",
      "High-Yield Problem Solving & Formula Derivations",
      "Previous Year Questions (PYQs) & Exam Pitfalls"
    ],
    "topicQuestions": [
      {
        "id": "ce-q-065",
        "sourceType": "MODELLED",
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
        "explanation": "Arithmetical increase method assumes a constant rate of population growth (dP/dt = constant) and is suitable for old, large, established cities nearing saturation. Geometrical increase method is suited for rapidly developing young cities.",
        "formulaContext": "Pn = P0 + n \u00b7 x\u0304",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Water Demand",
        "subtopic": "Population Forecasting Methods"
      },
      {
        "id": "ce-q-066",
        "sourceType": "MODELLED",
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
        "explanation": "Under IS 10500:2012, acceptable Fluoride limit is 1.0 mg/L (prevents dental cavities). If fluoride exceeds 1.5 mg/L, it causes dental fluorosis (mottling of teeth) and skeletal fluorosis.",
        "formulaContext": "Acceptable limit = 1.0 mg/L; Max permissible = 1.5 mg/L",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2023",
        "topic": "Water Quality Standards",
        "subtopic": "Fluoride Limits per IS 10500"
      },
      {
        "id": "ce-q-067",
        "sourceType": "MODELLED",
        "stem": "When filter alum [Al2(SO4)3 \u00b7 18 H2O] is added as a coagulant to water containing bicarbonate alkalinity, it forms an insoluble gelatinous precipitate of:",
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
        "explanation": "Alum reacts with calcium bicarbonate natural alkalinity in water to produce aluminium hydroxide Al(OH)3 floc precipitate, which traps and sweeps colloidal turbidity. It releases CO2, which increases acidity and decreases water pH.",
        "formulaContext": "Al2(SO4)3 + 3 Ca(HCO3)2 -> 2 Al(OH)3 \u2193 + 3 CaSO4 + 6 CO2",
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Water Treatment",
        "subtopic": "Alum Coagulation Chemistry"
      },
      {
        "id": "ce-q-068",
        "sourceType": "MODELLED",
        "stem": "In a continuous flow horizontal sedimentation tank of length L, width B, and depth H treating discharge Q, the surface overflow rate (SOR or Vo) is:",
        "options": [
          {
            "id": "A",
            "text": "Vo = Q / (B \u00b7 L)"
          },
          {
            "id": "B",
            "text": "Vo = Q / (B \u00b7 H)"
          },
          {
            "id": "C",
            "text": "Vo = Q / (L \u00b7 H)"
          },
          {
            "id": "D",
            "text": "Vo = Q / (B \u00b7 L \u00b7 H)"
          }
        ],
        "correctOption": "A",
        "explanation": "Surface overflow rate (SOR) is defined as discharge divided by plan surface area: Vo = Q / (B \u00b7 L). Particles having settling velocity Vs \u2265 Vo are 100% removed, while particles with Vs < Vo have removal efficiency \u03b7 = (Vs / Vo) \u00b7 100%.",
        "formulaContext": "Vo = Q / (B \u00b7 L) = Q / Plan Area",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2022",
        "topic": "Water Treatment",
        "subtopic": "Sedimentation Tank Overflow Rate"
      },
      {
        "id": "ce-q-069",
        "sourceType": "MODELLED",
        "stem": "Compared to a slow sand filter, a rapid sand filter has a rate of filtration that is approximately:",
        "options": [
          {
            "id": "A",
            "text": "30 times higher (3000 - 6000 L/m\u00b2/hr vs 100 - 200 L/m\u00b2/hr)"
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
        "explanation": "Rapid sand filters use coarser sand (effective size 0.45 - 0.70 mm) and operate at filtration rates of 3000 to 6000 L/m\u00b2/hr (about 30 times faster than slow sand filters). They require chemical coagulation pretreatment and backwashing.",
        "formulaContext": "Rapid Sand Filter rate = 3000 - 6000 L/hr/m\u00b2; Slow Sand Filter = 100 - 200 L/hr/m\u00b2",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Filtration",
        "subtopic": "Rapid vs Slow Sand Filters"
      },
      {
        "id": "ce-q-070",
        "sourceType": "MODELLED",
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
        "explanation": "Up to the breakpoint, applied chlorine is consumed oxidising reducing compounds and forming chloramines. At the dip (breakpoint), chloramines are completely destroyed by oxidation. Beyond breakpoint, added chlorine appears as free residual chlorine (HOCl and OCl\u207b).",
        "formulaContext": "Breakpoint: Free available chlorine (HOCl + OCl\u207b) appears linearly with dosage",
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / APSC AE Civil 2023",
        "topic": "Disinfection",
        "subtopic": "Breakpoint Chlorination"
      },
      {
        "id": "ce-q-071",
        "sourceType": "MODELLED",
        "stem": "The 5-day Biochemical Oxygen Demand (BOD5) at 20\u00b0C of domestic wastewater is approximately what percentage of its ultimate carbonaceous BOD (L0)?",
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
        "explanation": "Using first-order deoxygenation kinetics with standard deoxygenation constant k = 0.10 day\u207b\u00b9 (base 10) at 20\u00b0C: BOD5 = L0 \u00b7 (1 - 10^(-0.1 \u00b7 5)) = L0 \u00b7 (1 - 10^-0.5) = L0 \u00b7 (1 - 0.316) \u2248 0.684 \u00b7 L0 (approximately 68%).",
        "formulaContext": "BOD5 = L0 \u00b7 (1 - 10^(-k \u00b7 5)) \u2248 0.68 \u00b7 L0 for k = 0.1 day\u207b\u00b9 (base 10)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Wastewater Characteristics",
        "subtopic": "BOD 5-Day Kinetics"
      },
      {
        "id": "ce-q-072",
        "sourceType": "MODELLED",
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
        "explanation": "A minimum flow velocity of 0.60 m/s at present peak flow (and 0.75 m/s at design full flow) is required to scour silt and organic debris. Maximum velocity is limited to 2.5 - 3.0 m/s to prevent abrasive erosion of sewer pipes.",
        "formulaContext": "Vmin = 0.60 - 0.75 m/s; Vmax (non-scouring) = 2.5 - 3.0 m/s",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2023",
        "topic": "Sewer Design",
        "subtopic": "Self-Cleansing Velocity"
      },
      {
        "id": "ce-q-073",
        "sourceType": "MODELLED",
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
        "explanation": "In conventional aeration tanks, F/M ratio is maintained around 0.2 to 0.4 kg BOD/kg MLSS/day with a sludge retention time (sludge age) of 5 to 15 days, ensuring stable bio-oxidation and good sludge settling.",
        "formulaContext": "F/M = (Q \u00b7 S0) / (V \u00b7 X) \u2248 0.2 to 0.4 day\u207b\u00b9",
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / APSC AE Civil 2022",
        "topic": "Biological Treatment",
        "subtopic": "Activated Sludge Process (ASP) F/M Ratio"
      },
      {
        "id": "ce-q-074",
        "sourceType": "MODELLED",
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
        "explanation": "IS 2470 recommends a liquid detention time of 12 to 24 hours (commonly 24 hours) to allow solids settling, flotation of scum, and initiation of anaerobic sludge digestion.",
        "formulaContext": "Septic tank detention period = 12 - 24 hours",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Onsite Sanitation",
        "subtopic": "Septic Tank Detention Time"
      }
    ],
    "unitName": "Environmental Engineering",
    "codeClause": "IS 10500:2012, CPHEEO Manual",
    "confidencePercent": 28,
    "masteredStatus": "Weak Area",
    "diagramType": "env",
    "subtopicList": [
      "Water Quality Standards (IS 10500:2012)",
      "Stokes' Law & Discrete Settling in Clarifiers",
      "Rapid Sand vs Slow Sand Filters",
      "Disinfection Chemistry & Breakpoint Chlorination",
      "BOD Kinetics & Streeter-Phelps DO Sag",
      "Activated Sludge Process (F/M, SVI, theta_c)",
      "Air Pollution & Plume Behavior"
    ],
    "comparisonGrid": {
      "titleLeft": "Slow Sand Filter",
      "tagLeft": "Biological Purification",
      "valueLeft": "Rate: 100 - 200 L/hr/m\u00b2",
      "descLeft": "Requires no chemical coagulants; relies on biologically active Schmutzdecke layer; cleaned by scraping sand surface.",
      "titleRight": "Rapid Sand Filter",
      "tagRight": "Mechanical Interception",
      "valueRight": "Rate: 3000 - 6000 L/hr/m\u00b2",
      "descRight": "Requires chemical coagulation & flocculation pretreatment; coarse sand media; cleaned by high-pressure backwashing."
    },
    "callouts": {
      "corePostulate": "IS 10500:2012 standards: Fluoride permissible limit is 1.0 mg/L (> 1.5 causes dental/skeletal fluorosis); Nitrate limit is 45 mg/L (> 45 causes infant blue baby disease); Arsenic is 0.01 mg/L.",
      "corePostulateRef": "IS 10500:2012 Drinking Water Specification",
      "examTrap": "Standard BOD is evaluated at 20\u00b0C over 5 days: BOD5 = (DO_initial - DO_final) * Dilution Factor. BOD5 is roughly 68% of ultimate carbonaceous BOD (L0).",
      "examTrapRef": "APSC AE 2020 & GATE Civil",
      "testedRatios": [
        {
          "label": "Stokes Settling Velocity:",
          "value": "vs = g(rho_s - rho)d\u00b2 / (18 mu)"
        },
        {
          "label": "Surface Overflow Rate (SOR):",
          "value": "v0 = Q / A_surface"
        },
        {
          "label": "Sludge Volume Index (SVI):",
          "value": "SVI = (settled volume in mL) / MLSS (g)"
        },
        {
          "label": "Good Settling Sludge:",
          "value": "SVI between 50 and 150 mL/g"
        }
      ],
      "numericalShortcut": {
        "formula": "Streeter-Phelps Critical Deficit Dc = (K1 / K2) \u00b7 L0 \u00b7 e^(-K1 \u00b7 tc)",
        "note": "Occurs when rate of microbial deoxygenation equals rate of atmospheric reaeration. Downstream point is most critical for aquatic survival."
      }
    },
    "aiTutorPrompts": [
      {
        "question": "What is breakpoint chlorination?",
        "answerPreview": "Adding chlorine to water first oxidizes reducing compounds, then reacts with ammonia to form chloramines. At the breakpoint, all chloramines are completely oxidized. Any chlorine added past this point appears as free residual chlorine (HOCl + OCl-)."
      },
      {
        "question": "Explain plume dispersion patterns based on environmental lapse rate (ELR).",
        "answerPreview": "Superadiabatic (ELR > DALR) produces Looping; Neutral produces Coning; Subadiabatic/Inversion produces Fanning; Inversion below stack and unstable above produces Lofting (safest for ground); Unstable below and inversion above produces Fumigation (most hazardous)."
      }
    ]
  },
  {
    "id": "civil-surveying",
    "title": "Surveying & Geomatics: Levelling, Curves & Total Station",
    "subject": "Surveying & Geomatics",
    "category": "civil",
    "readTime": "15 min read",
    "weightage": "CORE",
    "icon": "Crosshair",
    "summary": "Principles of surveying, differential and reciprocal levelling, tacheometric surveying, horizontal and vertical curves, Total Station, and GPS/GIS fundamentals.",
    "prerequisites": [
      "Basic Trigonometry",
      "Geometry"
    ],
    "standardReferences": [
      "B.C. Punmia Surveying Vol I & II",
      "Duggal"
    ],
    "practiceQuestionIds": [
      "ce-q-075",
      "ce-q-076",
      "ce-q-077",
      "ce-q-078",
      "ce-q-079",
      "ce-q-080",
      "ce-q-081",
      "ce-q-082"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "stepTitle": "Fundamental Principles & Differential Levelling",
        "subtitle": "Working from whole to part, curvature/refraction corrections, and reciprocal levelling",
        "keyConcept": "The two fundamental principles of surveying are: (1) Work from whole to part (to prevent accumulation of errors), and (2) Locate a point by at least two independent measurements. In levelling, curvature makes objects appear lower, while refraction makes them appear higher.",
        "formulaOrCode": "C_c = -0.0785 d^2 \\quad ; \\quad C_r = +0.0112 d^2 \\quad ; \\quad C_{combined} = -0.0673 d^2 \\text{ (in meters, } d \\text{ in km)}",
        "highYieldFacts": [
          "Combined correction for curvature and refraction: C = 0.0673 * d\u00b2 (subtractive from staff reading).",
          "Distance to visible horizon: d = sqrt(h / 0.0673) = 3.855 * sqrt(h) (with h in meters, d in km).",
          "Reciprocal levelling eliminates: (1) Curvature error, (2) Refraction error (if readings are simultaneous), and (3) Collimation axis tilt error.",
          "In Rise and Fall method, an independent arithmetic check is available on intermediate sights: Sigma BS - Sigma FS = Sigma Rise - Sigma Fall = Last RL - First RL."
        ],
        "examTrap": "Reciprocal levelling eliminates curvature, refraction, and collimation error, but does NOT eliminate errors due to staff non-verticality or graduation defects!",
        "benchmarkExample": {
          "question": "What is the combined curvature and refraction correction for a sight distance of 2 km?",
          "options": [
            "0.135 m",
            "0.269 m",
            "0.314 m",
            "0.538 m"
          ],
          "correctAnswer": "0.269 m",
          "stepByStepSolution": [
            "Step 1: Formula: C = 0.0673 * d^2.",
            "Step 2: d = 2 km => d^2 = 4.",
            "Step 3: C = 0.0673 * 4 = 0.2692 m = 0.269 m (subtractive)."
          ],
          "takeaway": "Combined correction = 0.0673 * d\u00b2 meters."
        },
        "pointers": [
          "Combined correction for curvature and refraction: C = 0.0673 * d\u00b2 (subtractive from staff reading).",
          "Distance to visible horizon: d = sqrt(h / 0.0673) = 3.855 * sqrt(h) (with h in meters, d in km).",
          "Reciprocal levelling eliminates: (1) Curvature error, (2) Refraction error (if readings are simultaneous), and (3) Collimation axis tilt error.",
          "In Rise and Fall method, an independent arithmetic check is available on intermediate sights: Sigma BS - Sigma FS = Sigma Rise - Sigma Fall = Last RL - First RL."
        ]
      },
      {
        "stepNumber": 2,
        "stepTitle": "Tacheometry, Curves & Total Station",
        "subtitle": "Stadia constants, degree of curve, and electronic distance measurement (EDM)",
        "keyConcept": "Tacheometry determines horizontal distance and elevations optically using stadia hairs without chaining. Modern Total Stations integrate electronic theodolite, EDM, and microprocessor data storage.",
        "formulaOrCode": "D = k \\cdot s + c = \\left(\\frac{f}{i}\\right) s + (f + d) \\quad ; \\quad R = \\frac{1719}{D^\\circ} \\text{ (for 30m chord)}",
        "highYieldFacts": [
          "For an anallatic telescope, the multiplying constant k = f / i = 100, and additive constant c = (f + d) = 0.",
          "Degree of curve for 30 m chain: R = 1718.9 / D = ~1719 / D.",
          "Degree of curve for 20 m chain: R = 1146 / D.",
          "Total Station uses phase shift or pulse time-of-flight infrared laser to measure slope distances with millimeter precision."
        ],
        "examTrap": "Anallatic lens makes additive constant ZERO (c = 0), so distance simplifies strictly to D = 100 * s.",
        "benchmarkExample": {
          "question": "What is the radius of a 3-degree curve based on a 30-meter chord?",
          "options": [
            "382 m",
            "573 m",
            "860 m",
            "1146 m"
          ],
          "correctAnswer": "573 m",
          "stepByStepSolution": [
            "Step 1: Radius formula for 30 m chord: R = 1719 / D.",
            "Step 2: R = 1719 / 3 = 573 m."
          ],
          "takeaway": "30 m chord: R = 1719 / D; 20 m chord: R = 1146 / D."
        },
        "pointers": [
          "For an anallatic telescope, the multiplying constant k = f / i = 100, and additive constant c = (f + d) = 0.",
          "Degree of curve for 30 m chain: R = 1718.9 / D = ~1719 / D.",
          "Degree of curve for 20 m chain: R = 1146 / D.",
          "Total Station uses phase shift or pulse time-of-flight infrared laser to measure slope distances with millimeter precision."
        ]
      }
    ],
    "fullDescription": "Comprehensive module covering fundamental and advanced concepts of Surveying & Geomatics: Levelling, Curves & Total Station tailored for competitive civil engineering examinations (GATE, ESE, SSC JE, State AE/JE). Includes key principles, governing IS/IRC code formulas, exam traps, and benchmark problems.",
    "syllabusCoverage": [
      "Core Principles of Surveying & Geomatics",
      "Governing Specifications & Code Clauses",
      "High-Yield Problem Solving & Formula Derivations",
      "Previous Year Questions (PYQs) & Exam Pitfalls"
    ],
    "topicQuestions": [
      {
        "id": "ce-q-075",
        "sourceType": "MODELLED",
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
        "explanation": "By establishing a primary, highly accurate network of major control points covering the entire area first and then filling in minor details, errors occurring in minor measurements remain confined locally and do not magnify.",
        "formulaContext": "Working from whole to part localizes errors and prevents catastrophic error propagation",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Principles of Surveying",
        "subtopic": "Whole to Part Principle"
      },
      {
        "id": "ce-q-076",
        "sourceType": "MODELLED",
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
        "explanation": "A suspended tape sags into a catenary curve, so the curved distance along the tape is always longer than the true straight chord distance between supports. The measured distance is too long, so the sag correction is ALWAYS negative (-).",
        "formulaContext": "Cs = - W\u00b2 \u00b7 L / (24 \u00b7 P\u00b2)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2023",
        "topic": "Linear Measurements",
        "subtopic": "Sag Correction for Tape"
      },
      {
        "id": "ce-q-077",
        "sourceType": "MODELLED",
        "stem": "In compass surveying, a line is confirmed to be free from local attraction if the difference between its Fore Bearing (FB) and Back Bearing (BB) is exactly:",
        "options": [
          {
            "id": "A",
            "text": "90\u00b0"
          },
          {
            "id": "B",
            "text": "180\u00b0"
          },
          {
            "id": "C",
            "text": "270\u00b0"
          },
          {
            "id": "D",
            "text": "360\u00b0"
          }
        ],
        "correctOption": "B",
        "explanation": "For any line AB, the back bearing and fore bearing must differ by exactly 180\u00b0 if both station A and station B are free from magnetic disturbances (local attraction).",
        "formulaContext": "|FB - BB| = 180\u00b0",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2022",
        "topic": "Compass Surveying",
        "subtopic": "Local Attraction Detection"
      },
      {
        "id": "ce-q-078",
        "sourceType": "MODELLED",
        "stem": "Which of the following arithmetical checks is applicable to both Height of Instrument (HI) method and Rise & Fall method of levelling?",
        "options": [
          {
            "id": "A",
            "text": "\u03a3 BS - \u03a3 FS = Last RL - First RL"
          },
          {
            "id": "B",
            "text": "\u03a3 Rise - \u03a3 Fall = Last RL - First RL"
          },
          {
            "id": "C",
            "text": "\u03a3 BS - \u03a3 FS = \u03a3 Rise - \u03a3 Fall = Last RL - First RL"
          },
          {
            "id": "D",
            "text": "\u03a3 IS - \u03a3 FS = Last RL - First RL"
          }
        ],
        "correctOption": "A",
        "explanation": "The check \u03a3 BS - \u03a3 FS = Last RL - First RL applies to both methods. The Rise and Fall method has the complete three-part check: \u03a3 BS - \u03a3 FS = \u03a3 Rise - \u03a3 Fall = Last RL - First RL, making it superior for checking intermediate sights.",
        "formulaContext": "\u03a3 BS - \u03a3 FS = Last RL - First RL (universal check)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Levelling",
        "subtopic": "Arithmetical Checks in Levelling"
      },
      {
        "id": "ce-q-079",
        "sourceType": "MODELLED",
        "stem": "In precise levelling over a sight distance of d (in km), the combined correction for curvature and refraction (in meters) is given by:",
        "options": [
          {
            "id": "A",
            "text": "C = -0.0673 \u00b7 d\u00b2"
          },
          {
            "id": "B",
            "text": "C = +0.0785 \u00b7 d\u00b2"
          },
          {
            "id": "C",
            "text": "C = -0.0112 \u00b7 d\u00b2"
          },
          {
            "id": "D",
            "text": "C = -0.0562 \u00b7 d\u00b2"
          }
        ],
        "correctOption": "A",
        "explanation": "Earth's curvature increases staff reading (Cc = -0.0785 d\u00b2), while atmospheric refraction bends light downward decreasing staff reading (Cr = +0.0112 d\u00b2 = Cc/7). Combined correction is C = -0.0673 d\u00b2 meters.",
        "formulaContext": "C = Cc + Cr = -0.0785 d\u00b2 + 0.0112 d\u00b2 = -0.0673 d\u00b2 (m)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2023",
        "topic": "Levelling",
        "subtopic": "Curvature and Refraction Correction"
      },
      {
        "id": "ce-q-080",
        "sourceType": "MODELLED",
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
        "explanation": "Contour lines can never cross or intersect except in the case of an overhanging cliff or a cave where two different elevations occur at the same plan coordinates. In a vertical cliff, contour lines unite to form a single line.",
        "formulaContext": "Contours cross each other ONLY at overhanging cliffs and caves",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2021",
        "topic": "Contouring",
        "subtopic": "Contour Characteristics"
      },
      {
        "id": "ce-q-081",
        "sourceType": "MODELLED",
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
        "explanation": "Bowditch's (compass) rule assumes that accidental errors in linear measurements are proportional to \u221aL and in angular measurements are proportional to 1/\u221aL. It balances traverse by distributing errors in latitude and departure proportional to side lengths.",
        "formulaContext": "Correction to Latitude = (Total Latitude Error) \u00b7 (Length of side / Perimeter of traverse)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Theodolite & Traverse",
        "subtopic": "Bowditch's Rule"
      },
      {
        "id": "ce-q-082",
        "sourceType": "MODELLED",
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
        "explanation": "For an arc length of 30 m: Arc = R \u00b7 (D \u00b7 \u03c0 / 180) => 30 = R \u00b7 D \u00b7 0.017453 => D = 30 / (0.017453 \u00b7 R) = 1718.87 / R \u2248 1719 / R. For 20m arc, D = 1146 / R.",
        "formulaContext": "D = 1718.9 / R (for 30m chain); D = 1145.9 / R (for 20m chain)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2023",
        "topic": "Curves",
        "subtopic": "Degree of Curve Definition"
      }
    ],
    "unitName": "Surveying & Geomatics",
    "codeClause": "Survey of India Specifications",
    "confidencePercent": 70,
    "masteredStatus": "Mastered",
    "diagramType": "survey",
    "subtopicList": [
      "Survey Principles (Whole to Part) & Chain Errors",
      "Compass Traversing, WCB/QB & Declination",
      "Levelling: Collimation vs Rise-Fall & Reciprocal",
      "Contouring Characteristics & Interpolation",
      "Theodolite Traverse & Bowditch Rule",
      "Simple Circular & Vertical Curves",
      "Total Station, GNSS & GIS Applications"
    ],
    "comparisonGrid": {
      "titleLeft": "Height of Instrument Method",
      "tagLeft": "Faster Computation",
      "valueLeft": "HI = RL + BS",
      "descLeft": "Rapid arithmetic for multiple intermediate sights; check: \u03a3BS - \u03a3FS = Last RL - First RL. No check on intermediate sights.",
      "titleRight": "Rise and Fall Method",
      "tagRight": "Complete Check",
      "valueRight": "\u03a3Rise - \u03a3Fall = \u0394RL",
      "descRight": "Calculates every point relative to preceding point; checks all readings including intermediate sights: \u03a3BS - \u03a3FS = \u03a3Rise - \u03a3Fall = Last RL - First RL."
    },
    "callouts": {
      "corePostulate": "Combined correction for earth curvature and atmospheric refraction is C = 0.0673 * d\u00b2 (meters), where d is distance in kilometers. This correction is ALWAYS subtractive from the staff reading.",
      "corePostulateRef": "Levelling Physics",
      "examTrap": "Reciprocal levelling completely eliminates errors due to curvature, collimation tilt, and average refraction, but does NOT eliminate variations in refraction between shots!",
      "examTrapRef": "APSC AE 2020",
      "testedRatios": [
        {
          "label": "Curvature Correction:",
          "value": "Cc = -0.0785 \u00b7 d\u00b2 (m)"
        },
        {
          "label": "Refraction Correction:",
          "value": "Cr = +0.0112 \u00b7 d\u00b2 (m)"
        },
        {
          "label": "Tacheometric Multiplying Const:",
          "value": "k = f / i = 100"
        },
        {
          "label": "Tacheometric Additive Const:",
          "value": "c = f + d = 0 (analytic)"
        }
      ],
      "numericalShortcut": {
        "formula": "Bowditch Correction to Latitude = e_L \u00b7 (l / Sigma_l)",
        "note": "Applicable when linear and angular measurements are of equal precision. Transit rule is used when angular measurements are more precise."
      }
    },
    "aiTutorPrompts": [
      {
        "question": "How do you correct for local attraction in compass surveying?",
        "answerPreview": "Find a line whose fore bearing and back bearing differ by exactly 180 degrees. The stations at its ends are free from local attraction. Use these unaffected stations to correct successive bearings in the traverse."
      },
      {
        "question": "What are the key contour characteristics for cliffs and valleys?",
        "answerPreview": "Contours forming V-shapes with the apex pointing uphill represent a Valley line (stream). U-shapes pointing downhill indicate a Ridge line. Contours crossing each other indicate an Overhanging Cliff or Cave."
      }
    ]
  },
  {
    "id": "civil-steel",
    "title": "Design of Steel Structures & IS 800:2007 LSM",
    "subject": "Design of Steel Structures",
    "category": "civil",
    "readTime": "16 min read",
    "weightage": "HIGH_YIELD",
    "icon": "Wrench",
    "summary": "Limit state design of steel per IS 800:2007, high-strength friction grip (HSFG) bolts, fillet welds, plastic analysis, and member design.",
    "prerequisites": [
      "Strength of Materials",
      "Structural Analysis"
    ],
    "standardReferences": [
      "IS 800:2007",
      "N. Subramanian Steel Structures"
    ],
    "practiceQuestionIds": [
      "ce-q-091",
      "ce-q-092",
      "ce-q-093",
      "ce-q-094",
      "ce-q-095",
      "ce-q-027"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "stepTitle": "Bolted & Welded Connections",
        "subtitle": "Bearing bolts, HSFG slip-critical bolts, and fillet weld throat thickness",
        "keyConcept": "Connections are designed for ultimate limit states. Bearing bolts resist force via shear and bearing on plate. HSFG bolts clamp plates together with high pretension, resisting shear entirely by interface friction without slip.",
        "formulaOrCode": "t_t = k \\cdot s = 0.7 s \\text{ (for 90}^\\circ\\text{ fusion angle)} \\quad ; \\quad f_{wd} = \\frac{f_u}{\\sqrt{3} \\gamma_{mw}}",
        "highYieldFacts": [
          "Design strength of fillet weld per unit length: P_dw = (f_u / (sqrt(3) * gamma_mw)) * t_t.",
          "Partial safety factor for shop welds gamma_mw = 1.25; for field welds gamma_mw = 1.50.",
          "Effective throat thickness t_t = k * s, where k = 0.70 for fusion angle 60-90 degrees.",
          "Minimum pitch of bolts = 2.5 * nominal diameter d.",
          "Minimum edge distance = 1.5 * hole diameter d_0 (for machine flame cut edges); 1.7 * d_0 (for hand flame cut edges)."
        ],
        "examTrap": "Safety factor for field welds is 1.50 (20% higher than shop weld 1.25), reducing field weld strength!",
        "benchmarkExample": {
          "question": "For a 10 mm fillet weld connecting plates in a workshop (gamma_mw = 1.25, f_u = 410 MPa), what is the effective throat thickness?",
          "options": [
            "5.0 mm",
            "7.0 mm",
            "8.5 mm",
            "10.0 mm"
          ],
          "correctAnswer": "7.0 mm",
          "stepByStepSolution": [
            "Step 1: Effective throat thickness t_t = k * size.",
            "Step 2: For standard 90-degree weld, k = 0.70.",
            "Step 3: t_t = 0.70 * 10 mm = 7.0 mm."
          ],
          "takeaway": "Throat thickness = 0.7 * weld size."
        },
        "pointers": [
          "Design strength of fillet weld per unit length: P_dw = (f_u / (sqrt(3) * gamma_mw)) * t_t.",
          "Partial safety factor for shop welds gamma_mw = 1.25; for field welds gamma_mw = 1.50.",
          "Effective throat thickness t_t = k * s, where k = 0.70 for fusion angle 60-90 degrees.",
          "Minimum pitch of bolts = 2.5 * nominal diameter d.",
          "Minimum edge distance = 1.5 * hole diameter d_0 (for machine flame cut edges); 1.7 * d_0 (for hand flame cut edges)."
        ]
      },
      {
        "stepNumber": 2,
        "stepTitle": "Plastic Analysis & Shape Factor",
        "subtitle": "Plastic hinges, collapse mechanisms, and section shape factors",
        "keyConcept": "Plastic theory relies on the ductility of structural steel. When the entire cross section yields under flexure, a plastic hinge forms with moment capacity M_p = Z_p * f_y. The ratio of plastic section modulus to elastic modulus is the Shape Factor.",
        "formulaOrCode": "\\text{Shape Factor } S = \\frac{M_p}{M_y} = \\frac{Z_p}{Z_e} \\quad ; \\quad W_c = \\text{Collapse Load via Virtual Work}",
        "highYieldFacts": [
          "Shape factor for Rectangular section = 1.50.",
          "Shape factor for Solid circular section = 1.70 (16 / 3pi).",
          "Shape factor for Diamond/Rhombus = 2.0.",
          "Shape factor for standard I-section (major axis) = 1.12 to 1.15.",
          "Number of plastic hinges required for complete collapse = D_s + 1."
        ],
        "examTrap": "Shape factor represents reserve plastic strength. An I-section has the lowest shape factor (~1.14) because most material is already situated in extreme flanges!",
        "benchmarkExample": {
          "question": "What is the shape factor for a solid circular steel cross-section?",
          "options": [
            "1.15",
            "1.50",
            "1.70",
            "2.00"
          ],
          "correctAnswer": "1.70",
          "stepByStepSolution": [
            "Step 1: Z_p for solid circle = d^3 / 6.",
            "Step 2: Z_e for solid circle = pi * d^3 / 32.",
            "Step 3: Shape factor = (d^3 / 6) / (pi * d^3 / 32) = 32 / (6 * pi) = 1.697 = ~1.70."
          ],
          "takeaway": "Shape Factors: Diamond (2.0) > Circle (1.70) > Triangle (2.34) > Rectangle (1.50) > I-Section (1.14)."
        },
        "pointers": [
          "Shape factor for Rectangular section = 1.50.",
          "Shape factor for Solid circular section = 1.70 (16 / 3pi).",
          "Shape factor for Diamond/Rhombus = 2.0.",
          "Shape factor for standard I-section (major axis) = 1.12 to 1.15.",
          "Number of plastic hinges required for complete collapse = D_s + 1."
        ]
      }
    ],
    "fullDescription": "Comprehensive module covering fundamental and advanced concepts of Design of Steel Structures & IS 800:2007 LSM tailored for competitive civil engineering examinations (GATE, ESE, SSC JE, State AE/JE). Includes key principles, governing IS/IRC code formulas, exam traps, and benchmark problems.",
    "syllabusCoverage": [
      "Core Principles of Design of Steel Structures",
      "Governing Specifications & Code Clauses",
      "High-Yield Problem Solving & Formula Derivations",
      "Previous Year Questions (PYQs) & Exam Pitfalls"
    ],
    "topicQuestions": [
      {
        "id": "ce-q-091",
        "sourceType": "MODELLED",
        "stem": "As per IS 800:2007 Table 5, the partial safety factor for material strength against yielding (\u03b3m0) and against ultimate tensile strength (\u03b3m1) are:",
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
        "explanation": "Per IS 800:2007 Table 5, resistance governed by yielding of cross-section uses \u03b3m0 = 1.10; resistance governed by ultimate rupture at net section uses \u03b3m1 = 1.25; shop welds use \u03b3mw = 1.25, and field welds use \u03b3mw = 1.50.",
        "formulaContext": "\u03b3m0 = 1.10 (yielding); \u03b3m1 = 1.25 (ultimate tension / rupture)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "General Design Requirements",
        "subtopic": "Partial Safety Factors in IS 800:2007"
      },
      {
        "id": "ce-q-092",
        "sourceType": "MODELLED",
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
        "explanation": "Because tensile load is transferred through the connected leg, the outstanding leg does not participate fully at the connection. The resulting non-uniform tensile stress concentration is called the 'Shear Lag Effect'.",
        "formulaContext": "Tdn = 0.9 \u00b7 Anc \u00b7 fu / \u03b3m1 + \u03b2 \u00b7 Ago \u00b7 fy / \u03b3m0 (IS 800 Cl. 6.3.3)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2023",
        "topic": "Tension Members",
        "subtopic": "Net Section Rupture & Shear Lag"
      },
      {
        "id": "ce-q-093",
        "sourceType": "MODELLED",
        "stem": "As per IS 800:2007 Table 3, what is the maximum permissible slenderness ratio (\u03bb = kL/r) for a member carrying compressive loads resulting from dead loads and superimposed live loads?",
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
        "explanation": "IS 800 Table 3 specifies: A member carrying compressive loads from dead loads and imposed loads shall have slenderness ratio \u03bb \u2264 180. For wind/earthquake compression, \u03bb \u2264 250. For members acting solely in tension (hangers), \u03bb \u2264 400.",
        "formulaContext": "\u03bbmax = 180 (Dead Load + Imposed Load compression)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2022",
        "topic": "Compression Members",
        "subtopic": "Maximum Slenderness Ratio Limits"
      },
      {
        "id": "ce-q-094",
        "sourceType": "MODELLED",
        "stem": "For a standard fillet weld with an angle between fusion faces of 90\u00b0, the effective throat thickness (t) is related to leg size (s) by:",
        "options": [
          {
            "id": "A",
            "text": "t = 0.70 \u00b7 s"
          },
          {
            "id": "B",
            "text": "t = 0.50 \u00b7 s"
          },
          {
            "id": "C",
            "text": "t = 0.60 \u00b7 s"
          },
          {
            "id": "D",
            "text": "t = 1.00 \u00b7 s"
          }
        ],
        "correctOption": "A",
        "explanation": "Per IS 800:2007 Clause 10.5.3, effective throat thickness is t = k \u00b7 s. For angles between fusion faces: 60\u00b0-90\u00b0: k = 0.70; 91\u00b0-100\u00b0: k = 0.65; 101\u00b0-106\u00b0: k = 0.60; 107\u00b0-113\u00b0: k = 0.55; 114\u00b0-120\u00b0: k = 0.50.",
        "formulaContext": "t = k \u00b7 s, where k = 0.70 for 60\u00b0-90\u00b0 fusion angle",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Welded Connections",
        "subtopic": "Effective Throat Thickness of Fillet Weld"
      },
      {
        "id": "ce-q-095",
        "sourceType": "MODELLED",
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
        "explanation": "Clause 10.2.2 of IS 800 specifies that the distance between centers of fasteners (pitch) shall not be less than 2.5 times the nominal diameter of the fastener to avoid bearing failure between adjacent holes.",
        "formulaContext": "pmin = 2.5 \u00b7 d",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2021",
        "topic": "Bolted Connections",
        "subtopic": "Minimum Pitch and Edge Distance"
      },
      {
        "id": "ce-q-027",
        "sourceType": "MODELLED",
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
        "explanation": "For a rectangular beam: Plastic section modulus Zp = (b \u00b7 d/2) \u00b7 (d/4) \u00b7 2 = b d\u00b2 / 4. Elastic section modulus Ze = b d\u00b2 / 6. Therefore, shape factor S = Zp / Ze = (b d\u00b2 / 4) / (b d\u00b2 / 6) = 1.50. For circular section S = 1.70, diamond S = 2.0, I-section S = 1.12 to 1.18.",
        "formulaContext": "Shape Factor S = Zp / Ze = (b d\u00b2 / 4) / (b d\u00b2 / 6) = 1.50",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Plastic Analysis",
        "subtopic": "Shape Factor of Rectangular Section"
      }
    ],
    "unitName": "Structural Engineering",
    "codeClause": "IS 800:2007 LSM",
    "confidencePercent": 20,
    "masteredStatus": "Weak Area",
    "diagramType": "som",
    "subtopicList": [
      "Limit State Design Philosophy (IS 800:2007)",
      "Bolted Connections (Bearing & HSFG)",
      "Fillet & Butt Welds (Throat Thickness t = ks)",
      "Tension Members & Shear Lag Effect",
      "Compression Members & Lacing / Battening Rules",
      "Plastic Analysis: Shape Factors & Collapse Mechanisms"
    ],
    "comparisonGrid": {
      "titleLeft": "Lacing System (IS 800 Cl. 7.6)",
      "tagLeft": "Transverse Shear 2.5%",
      "valueLeft": "\u03bb_lace \u2264 145",
      "descLeft": "Inclined bars at 40\u00b0 to 70\u00b0; designed for transverse shear equal to 2.5% of axial column load.",
      "titleRight": "Battening System (IS 800 Cl. 7.7)",
      "tagRight": "Bending & Shear",
      "valueRight": "Effective \u03bb + 10%",
      "descRight": "Horizontal plates connecting column components; effective slenderness of column is increased by 10% to account for shear deformation."
    },
    "callouts": {
      "corePostulate": "Effective throat thickness of fillet weld is t = k * s, where k = 0.70 for angle between fusion faces 60\u00b0 to 90\u00b0. Fillet weld is always designed for shear on effective throat area.",
      "corePostulateRef": "IS 800:2007 Cl. 10.5.3",
      "examTrap": "Maximum slenderness ratio lambda = L/r limits per IS 800 Table 3: Tension member with wind/earthquake reversal = 350; Compression flange of beam = 300; Compression member under dead/live load = 180.",
      "examTrapRef": "APSC AE 2020 & SSC JE",
      "testedRatios": [
        {
          "label": "Shape Factor (Diamond Section):",
          "value": "S = 2.00"
        },
        {
          "label": "Shape Factor (Triangular Section):",
          "value": "S = 2.34"
        },
        {
          "label": "Shape Factor (Circular Section):",
          "value": "S = 1.70"
        },
        {
          "label": "Shape Factor (Rectangular Section):",
          "value": "S = 1.50"
        },
        {
          "label": "Shape Factor (I-Section):",
          "value": "S = 1.12 to 1.15"
        }
      ],
      "numericalShortcut": {
        "formula": "Plastic Collapse Load (SSB with Point Load W) Wc = 4 \u00b7 Mp / L",
        "note": "For fixed beam with central point load Wc = 8 Mp / L. For fixed beam with uniform load w_c = 16 Mp / L\u00b2."
      }
    },
    "aiTutorPrompts": [
      {
        "question": "What is the shear lag effect in tension members?",
        "answerPreview": "When an angle section is connected through only one leg, the connected leg carries stress directly while the unconnected leg lags behind in taking stress. IS 800 accounts for this via net effective area Anet = A1 + A2 * k."
      },
      {
        "question": "What are High Strength Friction Grip (HSFG) bolts?",
        "answerPreview": "HSFG bolts (Grade 8.8 or 10.9) are tightened to a pre-determined high tension. Load is transmitted purely through friction between the clamping contact surfaces, preventing any bearing or slip at working loads."
      }
    ]
  },
  {
    "id": "civil-cpm-pert",
    "title": "Construction Planning: CPM, PERT & Building Materials",
    "subject": "Construction Management",
    "category": "civil",
    "readTime": "15 min read",
    "weightage": "CORE",
    "icon": "Briefcase",
    "summary": "Network diagramming, Critical Path Method (CPM), floats, PERT probabilistic distribution, crashing, cement chemistry, and contracts.",
    "prerequisites": [
      "Basic Mathematics",
      "Management Concepts"
    ],
    "standardReferences": [
      "B.C. Punmia Project Planning",
      "Duggal Building Materials"
    ],
    "practiceQuestionIds": [
      "ce-q-099",
      "ce-q-100",
      "ce-q-083",
      "ce-q-075"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "stepTitle": "CPM vs PERT & Activity Times",
        "subtitle": "Deterministic vs probabilistic models, critical path, and beta distribution",
        "keyConcept": "CPM is activity-oriented and deterministic, suitable for repetitive construction projects. PERT is event-oriented and probabilistic, suitable for R&D projects where durations are uncertain, modeled by Beta Distribution.",
        "formulaOrCode": "t_e = \\frac{t_o + 4 t_m + t_p}{6} \\quad ; \\quad \\sigma = \\frac{t_p - t_o}{6} \\quad ; \\quad V = \\sigma^2",
        "highYieldFacts": [
          "Critical path is the longest path through the network; it dictates minimum project completion time.",
          "Total Float TF = LST - EST = LFT - EFT (measures delay without affecting overall project completion).",
          "Free Float FF = EST of successor - EFT of current activity (delay without affecting successor start).",
          "Independent Float IF = EST of successor - LFT of predecessor - duration.",
          "Hierarchy: Total Float >= Free Float >= Independent Float."
        ],
        "examTrap": "Total float affects the whole project. Free float affects only the succeeding activity. Independent float affects neither preceding nor succeeding activities.",
        "benchmarkExample": {
          "question": "An activity in PERT has optimistic time 4 days, most likely 7 days, and pessimistic 16 days. What is its expected duration t_e?",
          "options": [
            "7.5 days",
            "8.0 days",
            "9.0 days",
            "10.0 days"
          ],
          "correctAnswer": "8.0 days",
          "stepByStepSolution": [
            "Step 1: Formula: t_e = (t_o + 4*t_m + t_p) / 6.",
            "Step 2: t_e = (4 + 4*7 + 16) / 6 = (4 + 28 + 16) / 6.",
            "Step 3: t_e = 48 / 6 = 8.0 days."
          ],
          "takeaway": "PERT expected time t_e = (t_o + 4t_m + t_p) / 6."
        },
        "pointers": [
          "Critical path is the longest path through the network; it dictates minimum project completion time.",
          "Total Float TF = LST - EST = LFT - EFT (measures delay without affecting overall project completion).",
          "Free Float FF = EST of successor - EFT of current activity (delay without affecting successor start).",
          "Independent Float IF = EST of successor - LFT of predecessor - duration.",
          "Hierarchy: Total Float >= Free Float >= Independent Float."
        ]
      }
    ],
    "fullDescription": "Comprehensive module covering fundamental and advanced concepts of Construction Planning: CPM, PERT & Building Materials tailored for competitive civil engineering examinations (GATE, ESE, SSC JE, State AE/JE). Includes key principles, governing IS/IRC code formulas, exam traps, and benchmark problems.",
    "syllabusCoverage": [
      "Core Principles of Construction Management",
      "Governing Specifications & Code Clauses",
      "High-Yield Problem Solving & Formula Derivations",
      "Previous Year Questions (PYQs) & Exam Pitfalls"
    ],
    "topicQuestions": [
      {
        "id": "ce-q-099",
        "sourceType": "MODELLED",
        "stem": "In PERT analysis, given optimistic time (to), most likely time (tm), and pessimistic time (tp), the expected activity time (te) assuming a Beta distribution is:",
        "options": [
          {
            "id": "A",
            "text": "te = (to + 4 \u00b7 tm + tp) / 6"
          },
          {
            "id": "B",
            "text": "te = (to + tm + tp) / 3"
          },
          {
            "id": "C",
            "text": "te = (to + 2 \u00b7 tm + tp) / 4"
          },
          {
            "id": "D",
            "text": "te = (to + 6 \u00b7 tm + tp) / 8"
          }
        ],
        "correctOption": "A",
        "explanation": "PERT assumes a Beta probability distribution for activity duration. The weighted mean is te = (to + 4 tm + tp) / 6, and standard deviation is \u03c3 = (tp - to) / 6.",
        "formulaContext": "te = (to + 4 \u00b7 tm + tp) / 6; Variance \u03c3\u00b2 = ((tp - to) / 6)\u00b2",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Network Analysis (CPM/PERT)",
        "subtopic": "Expected Time Duration in PERT"
      },
      {
        "id": "ce-q-100",
        "sourceType": "MODELLED",
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
        "explanation": "Total Float is the total margin of time available to delay an activity without extending the project completion deadline. Free float delays neither the project nor succeeding activities. Critical activities have Total Float = 0.",
        "formulaContext": "Total Float = LFT - EFT = LST - EST; Free Float = EST(j) - EFT(ij)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2023",
        "topic": "CPM Project Scheduling",
        "subtopic": "Total Float Definition"
      },
      {
        "id": "ce-q-083",
        "sourceType": "MODELLED",
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
        "explanation": "Nagpur Road Congress classified roads into NH, SH, MDR, ODR, and VR, adopting the 'Star and Grid' pattern with an overall target road density of 16 km / 100 km\u00b2.",
        "formulaContext": "Target road density = 16 km per 100 sq km area",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Highway Planning",
        "subtopic": "Nagpur Road Plan Pattern"
      },
      {
        "id": "ce-q-075",
        "sourceType": "MODELLED",
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
        "explanation": "By establishing a primary, highly accurate network of major control points covering the entire area first and then filling in minor details, errors occurring in minor measurements remain confined locally and do not magnify.",
        "formulaContext": "Working from whole to part localizes errors and prevents catastrophic error propagation",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Principles of Surveying",
        "subtopic": "Whole to Part Principle"
      }
    ],
    "unitName": "Construction Management & Building Materials",
    "codeClause": "IS 14580, CPWD Works Manual",
    "confidencePercent": 60,
    "masteredStatus": "In Progress",
    "diagramType": "som",
    "subtopicList": [
      "Network Logic, Dummy Activities & Fulkerson's Rule",
      "Critical Path Method (CPM): Total, Free & Independent Float",
      "PERT Probabilistic 3-Time Estimates & Variance",
      "Normal Distribution Probability of Schedule Completion",
      "Project Crashing, Cost Slopes & Optimum Duration"
    ],
    "comparisonGrid": {
      "titleLeft": "Critical Path Method (CPM)",
      "tagLeft": "Deterministic",
      "valueLeft": "Activity-Oriented",
      "descLeft": "Single time estimate; used in construction and repetitive infrastructure projects; emphasis on time-cost trade-off and crashing.",
      "titleRight": "PERT",
      "tagRight": "Probabilistic",
      "valueRight": "Event-Oriented",
      "descRight": "Three time estimates (to, tm, tp); beta distribution of activity times; used for R&D and non-repetitive projects where durations are uncertain."
    },
    "callouts": {
      "corePostulate": "Critical path is the longest sequence of activities connecting the project start to completion; all activities on the critical path have ZERO total float.",
      "corePostulateRef": "Operations Research Standards",
      "examTrap": "Total Float (LF_j - ES_i - t_ij) affects preceding and succeeding activities; Free Float (ES_j - ES_i - t_ij) affects ONLY succeeding activities; Independent Float affects neither!",
      "examTrapRef": "GATE & State AE Favorite",
      "testedRatios": [
        {
          "label": "PERT Expected Time:",
          "value": "te = (to + 4 \u00b7 tm + tp) / 6"
        },
        {
          "label": "PERT Standard Deviation:",
          "value": "sigma = (tp - to) / 6"
        },
        {
          "label": "PERT Variance:",
          "value": "sigma\u00b2 = ((tp - to) / 6)\u00b2"
        },
        {
          "label": "Cost Slope Formula:",
          "value": "Cost Slope = (Cc - Cn) / (Tn - Tc)"
        }
      ],
      "numericalShortcut": {
        "formula": "Standard Normal Deviate Z = (Ts - Te) / sigma_critical_path",
        "note": "Look up Z in standard normal table: Z = 0 -> 50% probability; Z = +1 -> 84.1% probability; Z = +2 -> 97.7% probability."
      }
    },
    "aiTutorPrompts": [
      {
        "question": "How do you decide which activity to crash first in project compression?",
        "answerPreview": "Always crash critical activities only (non-critical crashing wastes money without reducing project duration), starting with the critical activity that has the MINIMUM cost slope."
      },
      {
        "question": "What are the rules for dummy activities in network diagrams?",
        "answerPreview": "Dummies have zero duration and consume zero resources. They are used exclusively to maintain grammatical network logic and prevent multiple activities from sharing identical start and finish nodes."
      }
    ]
  },
  {
    "id": "gs-india-history",
    "title": "History of India: Ancient, Medieval & Freedom Struggle",
    "subject": "Indian History",
    "category": "gs",
    "readTime": "20 min read",
    "weightage": "HIGH_YIELD",
    "icon": "BookOpen",
    "summary": "Indus Valley Civilization, Vedic period, Mauryan Empire, Gupta Golden Age, Delhi Sultanate, Mughal architecture, 1857 Revolt, and the Indian National Movement (1885\u20131947).",
    "prerequisites": [
      "Basic Social Science"
    ],
    "standardReferences": [
      "Bipan Chandra: India's Struggle for Independence",
      "Spectrum Modern India",
      "NCERT"
    ],
    "practiceQuestionIds": [
      "gs-q-019",
      "gs-q-020",
      "gs-q-021",
      "gs-q-022",
      "gs-q-023",
      "gs-q-024",
      "gs-q-025",
      "gs-q-026",
      "gs-q-027",
      "gs-q-028",
      "gs-q-029",
      "gs-q-030",
      "gs-q-031",
      "gs-q-032",
      "gs-q-033",
      "gs-q-034",
      "gs-q-035",
      "gs-q-036"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "stepTitle": "Ancient India: Harappa to Guptas",
        "subtitle": "Urban planning, Ashokan edicts, and classical golden age",
        "keyConcept": "The Indus Valley Civilization was an advanced Bronze Age urban culture characterized by grid-pattern streets, Great Bath (Mohenjo-daro), and maritime trade (Lothal dockyard). The Mauryan Empire under Ashoka introduced Dhamma edicts, and the Gupta era represented a classical age in science and literature.",
        "formulaOrCode": "\\text{Harappa (1921: Dayaram Sahni)} \\to \\text{Mohenjo-daro (1922: R.D. Banerjee)} \\to \\text{Ashoka (261 BCE Kalinga)}",
        "highYieldFacts": [
          "Lothal (Gujarat) had the world's earliest known tidal dockyard.",
          "Ashoka's Kalinga War (261 BCE, Rock Edict XIII) led him to renounce Digvijaya in favor of Dhammavijaya.",
          "Chandragupta II (Vikramaditya) patronized the Navaratnas, including Kalidasa, Varahamihira, and Amarasimha.",
          "Aryabhata composed 'Aryabhatiya' establishing the earth rotates on its axis and calculating pi."
        ],
        "examTrap": "Rock Edict XIII describes the sorrow of the Kalinga War, NOT Rock Edict I or Pillar Edicts.",
        "benchmarkExample": {
          "question": "Which Major Rock Edict of Emperor Ashoka describes his conquest and tragic remorse over the Kalinga War?",
          "options": [
            "Major Rock Edict V",
            "Major Rock Edict VIII",
            "Major Rock Edict X",
            "Major Rock Edict XIII"
          ],
          "correctAnswer": "Major Rock Edict XIII",
          "stepByStepSolution": [
            "Step 1: Major Rock Edict XIII explicitly details the slaughter, deportations, and Ashoka's profound grief after Kalinga in 261 BCE.",
            "Step 2: It records his conversion from warfare to Dhamma."
          ],
          "takeaway": "Ashoka's Kalinga War = Major Rock Edict XIII."
        }
      },
      {
        "stepNumber": 2,
        "stepTitle": "Indian Freedom Movement (1885\u20131947)",
        "subtitle": "Founding of INC, Partition of Bengal, Non-Cooperation, and Quit India",
        "keyConcept": "The Indian National Congress was founded in 1885 by A.O. Hume. The national movement progressed from Moderates (prayer, petition) to Extremists (Swadeshi 1905) to the mass Gandhian era (Non-Cooperation 1920, Civil Disobedience 1930, Quit India 1942).",
        "formulaOrCode": "1885 \\text{ (INC)} \\to 1905 \\text{ (Swadeshi)} \\to 1920 \\text{ (NCM)} \\to 1930 \\text{ (Dandi)} \\to 1942 \\text{ (Quit India)}",
        "highYieldFacts": [
          "First President of INC was W.C. Bonnerjee (Bombay, Dec 1885; 72 delegates).",
          "1905: Partition of Bengal by Lord Curzon sparked the Swadeshi and Boycott Movement.",
          "1916: Lucknow Pact united Moderates and Extremists, and INC with Muslim League.",
          "1930: Dandi March (12 March to 6 April 1930) broke the Salt Law, launching Civil Disobedience.",
          "1942: Gandhi gave the clarion call 'Do or Die' at the Gowalia Tank maidan, Bombay."
        ],
        "examTrap": "Gandhi presided over ONLY ONE session of the Indian National Congress: the 1924 Belgaum session!",
        "benchmarkExample": {
          "question": "In which session did Mahatma Gandhi serve as the President of the Indian National Congress?",
          "options": [
            "1920 Calcutta",
            "1924 Belgaum",
            "1929 Lahore",
            "1931 Karachi"
          ],
          "correctAnswer": "1924 Belgaum",
          "stepByStepSolution": [
            "Step 1: Mahatma Gandhi was elected INC President only once.",
            "Step 2: This occurred at the 39th session held in Belgaum (Karnataka) in December 1924."
          ],
          "takeaway": "Mahatma Gandhi = 1924 Belgaum Session only."
        }
      }
    ],
    "topicQuestions": [
      {
        "id": "gs-q-019",
        "sourceType": "MODELLED",
        "stem": "At which Indus Valley Civilization site has an artificial brick dockyard connected to the Sabarmati river basin been excavated?",
        "options": [
          {
            "id": "A",
            "text": "Lothal (Gujarat)"
          },
          {
            "id": "B",
            "text": "Mohenjodaro (Sindh)"
          },
          {
            "id": "C",
            "text": "Kalibangan (Rajasthan)"
          },
          {
            "id": "D",
            "text": "Rakhigarhi (Haryana)"
          }
        ],
        "correctOption": "A",
        "explanation": "Lothal, located in Gujarat at the head of the Gulf of Cambay, served as a major maritime port and trading centre of the Harappan civilization, featuring a massive tidal dockyard.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Ancient India",
        "subtopic": "Indus Valley Civilization Lothal"
      },
      {
        "id": "gs-q-020",
        "sourceType": "MODELLED",
        "stem": "The famous 'Gayatri Mantra' addressed to deity Savitr is composed in which Mandala of the Rigveda?",
        "options": [
          {
            "id": "A",
            "text": "Mandala 3"
          },
          {
            "id": "B",
            "text": "Mandala 1"
          },
          {
            "id": "C",
            "text": "Mandala 9"
          },
          {
            "id": "D",
            "text": "Mandala 10"
          }
        ],
        "correctOption": "A",
        "explanation": "The Gayatri Mantra is found in Mandala 3, Sukta 62, Verse 10 of the Rigveda, attributed to sage Vishwamitra. Mandala 9 is dedicated entirely to Soma, and Mandala 10 contains the Purusha Sukta.",
        "formulaContext": null,
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / State PSC GS Paper I 2023",
        "topic": "Ancient India",
        "subtopic": "Rigveda & Gayatri Mantra"
      },
      {
        "id": "gs-q-021",
        "sourceType": "MODELLED",
        "stem": "Gautama Buddha delivered his first sermon, known as the 'Dharmachakrapravartana' (Turning of the Wheel of Law), at:",
        "options": [
          {
            "id": "A",
            "text": "Sarnath (near Varanasi)"
          },
          {
            "id": "B",
            "text": "Bodh Gaya"
          },
          {
            "id": "C",
            "text": "Kushinagar"
          },
          {
            "id": "D",
            "text": "Lumbini"
          }
        ],
        "correctOption": "A",
        "explanation": "Buddha attained enlightenment under the Bodhi tree at Bodh Gaya and delivered his first sermon to his five former companions at the Deer Park in Sarnath. He passed away (Mahaparinirvana) at Kushinagar.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2022",
        "topic": "Ancient India",
        "subtopic": "Buddhism & First Sermon"
      },
      {
        "id": "gs-q-022",
        "sourceType": "MODELLED",
        "stem": "Vardhamana Mahavira was the which number Tirthankara in the Jain religious tradition?",
        "options": [
          {
            "id": "A",
            "text": "24th Tirthankara"
          },
          {
            "id": "B",
            "text": "1st Tirthankara"
          },
          {
            "id": "C",
            "text": "23rd Tirthankara"
          },
          {
            "id": "D",
            "text": "20th Tirthankara"
          }
        ],
        "correctOption": "A",
        "explanation": "Rishabhanatha (Adinatha) was the first Tirthankara, Parshvanatha was the 23rd Tirthankara, and Vardhamana Mahavira was the 24th and last Tirthankara of the current cosmic age.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2021",
        "topic": "Ancient India",
        "subtopic": "Jainism Tirthankaras"
      },
      {
        "id": "gs-q-023",
        "sourceType": "MODELLED",
        "stem": "Which Major Rock Edict of Emperor Ashoka provides an authentic first-person account of the tragic devastation of the Kalinga War and his transformation to Dhamma?",
        "options": [
          {
            "id": "A",
            "text": "Major Rock Edict XIII"
          },
          {
            "id": "B",
            "text": "Major Rock Edict I"
          },
          {
            "id": "C",
            "text": "Major Rock Edict VII"
          },
          {
            "id": "D",
            "text": "Pillar Edict VII"
          }
        ],
        "correctOption": "A",
        "explanation": "Major Rock Edict XIII explicitly describes Ashoka's remorse over the slaughter, death, and deportation of thousands during the Kalinga war (261 BC), marking his decisive shift from Bherighosha (war drum) to Dhammaghosha.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Ancient India",
        "subtopic": "Mauryan Empire & Ashokan Inscriptions"
      },
      {
        "id": "gs-q-024",
        "sourceType": "MODELLED",
        "stem": "The celebrated astronomer-mathematician Aryabhata, author of Aryabhatiya and Surya Siddhanta, flourished during the reign of which dynasty?",
        "options": [
          {
            "id": "A",
            "text": "Gupta Dynasty"
          },
          {
            "id": "B",
            "text": "Mauryan Dynasty"
          },
          {
            "id": "C",
            "text": "Kushan Dynasty"
          },
          {
            "id": "D",
            "text": "Vardhana Dynasty"
          }
        ],
        "correctOption": "A",
        "explanation": "Aryabhata (476-550 AD) lived during the Gupta period in Kusumapura (Pataliputra), calculating the value of pi (3.1416), proposing that the Earth rotates on its axis, and accurately explaining solar and lunar eclipses.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2023",
        "topic": "Ancient India",
        "subtopic": "Gupta Golden Age"
      },
      {
        "id": "gs-q-025",
        "sourceType": "MODELLED",
        "stem": "Which Sultan of Delhi implemented comprehensive price control and market regulation systems (Shahna-i-Mandi) to maintain a massive standing army at low cost?",
        "options": [
          {
            "id": "A",
            "text": "Alauddin Khilji"
          },
          {
            "id": "B",
            "text": "Balban"
          },
          {
            "id": "C",
            "text": "Muhammad bin Tughlaq"
          },
          {
            "id": "D",
            "text": "Feroz Shah Tughlaq"
          }
        ],
        "correctOption": "A",
        "explanation": "Alauddin Khilji (1296-1316) instituted strict price controls, grain storage depots, and intelligence officers (Barids and Munhiyans) to fix prices of food grains, textiles, and cattle in Delhi.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Medieval India",
        "subtopic": "Delhi Sultanate Market Reforms"
      },
      {
        "id": "gs-q-026",
        "sourceType": "MODELLED",
        "stem": "The greatest ruler of the Tuluva dynasty of Vijayanagara, Krishna Deva Raya (1509-1529), authored the classic Telugu political treatise named:",
        "options": [
          {
            "id": "A",
            "text": "Amuktamalyada"
          },
          {
            "id": "B",
            "text": "Manucharitam"
          },
          {
            "id": "C",
            "text": "Rayavachakamu"
          },
          {
            "id": "D",
            "text": "Madura Vijayam"
          }
        ],
        "correctOption": "A",
        "explanation": "Emperor Krishna Deva Raya composed 'Amuktamalyada' in Telugu and 'Jambavati Kalyanam' in Sanskrit. His court was famously adorned by the Ashtadiggajas (eight eminent Telugu poets).",
        "formulaContext": null,
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / State PSC GS Paper I 2022",
        "topic": "Medieval India",
        "subtopic": "Vijayanagara Empire"
      },
      {
        "id": "gs-q-027",
        "sourceType": "MODELLED",
        "stem": "The Mansabdari system, the cornerstone of military and civil administration in the Mughal Empire, was introduced by Emperor:",
        "options": [
          {
            "id": "A",
            "text": "Akbar (1571)"
          },
          {
            "id": "B",
            "text": "Babur"
          },
          {
            "id": "C",
            "text": "Humayun"
          },
          {
            "id": "D",
            "text": "Shah Jahan"
          }
        ],
        "correctOption": "A",
        "explanation": "Akbar introduced the Mansabdari system in 1571. Every officer held a rank (Mansab) characterized by two numbers: 'Zat' (personal rank determining salary status) and 'Sawar' (number of cavalrymen required to maintain).",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Medieval India",
        "subtopic": "Mughal Administration"
      },
      {
        "id": "gs-q-028",
        "sourceType": "MODELLED",
        "stem": "Who among the following led the 1857 Revolt against British rule from Jagdishpur in Bihar?",
        "options": [
          {
            "id": "A",
            "text": "Kunwar Singh"
          },
          {
            "id": "B",
            "text": "Nana Saheb"
          },
          {
            "id": "C",
            "text": "Maulvi Ahmadullah"
          },
          {
            "id": "D",
            "text": "Bakht Khan"
          }
        ],
        "correctOption": "A",
        "explanation": "Kunwar Singh, the octogenarian Zamindar of Jagdishpur (Arrah, Bihar), was one of the most valiant military leaders of the 1857 revolt. Nana Saheb led at Kanpur, Begum Hazrat Mahal at Lucknow, and Khan Bahadur Khan at Bareilly.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2023",
        "topic": "Modern India",
        "subtopic": "Revolt of 1857 Leaders"
      },
      {
        "id": "gs-q-029",
        "sourceType": "MODELLED",
        "stem": "Raja Ram Mohan Roy founded the 'Brahmo Sabha' (later Brahmo Samaj) in 1828 and successfully campaigned for the legal abolition of Sati, which was enacted under Governor-General:",
        "options": [
          {
            "id": "A",
            "text": "Lord William Bentinck (Regulation XVII of 1829)"
          },
          {
            "id": "B",
            "text": "Lord Dalhousie"
          },
          {
            "id": "C",
            "text": "Lord Canning"
          },
          {
            "id": "D",
            "text": "Lord Wellesley"
          }
        ],
        "correctOption": "A",
        "explanation": "The Bengal Sati Regulation XVII was enacted on December 4, 1829 by Governor-General Lord William Bentinck, declaring the practice of Sati or burning alive of widows illegal and punishable by criminal courts.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Modern India",
        "subtopic": "Social Reform Movements"
      },
      {
        "id": "gs-q-030",
        "sourceType": "MODELLED",
        "stem": "The first session of the Indian National Congress was held in December 1885 at Bombay under the presidency of:",
        "options": [
          {
            "id": "A",
            "text": "Womesh Chandra Bonnerjee"
          },
          {
            "id": "B",
            "text": "Dadabhai Naoroji"
          },
          {
            "id": "C",
            "text": "Allan Octavian Hume"
          },
          {
            "id": "D",
            "text": "Surendranath Banerjee"
          }
        ],
        "correctOption": "A",
        "explanation": "The first INC session took place at Gokuldas Tejpal Sanskrit College, Bombay in December 1885, presided over by W.C. Bonnerjee and attended by 72 delegates. A.O. Hume served as general secretary.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2022",
        "topic": "National Movement",
        "subtopic": "Formation of Indian National Congress"
      },
      {
        "id": "gs-q-031",
        "sourceType": "MODELLED",
        "stem": "The Partition of Bengal announced by Lord Curzon took effect on October 16, 1905, leading immediately to which mass national protest movement?",
        "options": [
          {
            "id": "A",
            "text": "Swadeshi and Boycott Movement"
          },
          {
            "id": "B",
            "text": "Non-Cooperation Movement"
          },
          {
            "id": "C",
            "text": "Quit India Movement"
          },
          {
            "id": "D",
            "text": "Civil Disobedience Movement"
          }
        ],
        "correctOption": "A",
        "explanation": "The partition sparked the Swadeshi and Boycott Movement, officially proclaimed at the Calcutta Town Hall on August 7, 1905. People observed October 16 as a day of national mourning, tying Rakhis and singing Vande Mataram.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "National Movement",
        "subtopic": "Partition of Bengal 1905"
      },
      {
        "id": "gs-q-032",
        "sourceType": "MODELLED",
        "stem": "The Indian Councils Act, 1909 (Morley-Minto Reforms) is famously known for introducing which controversial political provision?",
        "options": [
          {
            "id": "A",
            "text": "Separate electorates for Muslims"
          },
          {
            "id": "B",
            "text": "Dyarchy in the provincial executive"
          },
          {
            "id": "C",
            "text": "Bicameralism at the Centre"
          },
          {
            "id": "D",
            "text": "Direct elections for all citizens"
          }
        ],
        "correctOption": "A",
        "explanation": "The 1909 Act introduced communal representation for Muslims through separate electorates, institutionalizing religious separatism in Indian electoral politics.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2023",
        "topic": "National Movement",
        "subtopic": "Morley-Minto Reforms 1909"
      },
      {
        "id": "gs-q-033",
        "sourceType": "MODELLED",
        "stem": "Mahatma Gandhi abruptly called off the nationwide Non-Cooperation Movement in February 1922 following which violent incident?",
        "options": [
          {
            "id": "A",
            "text": "Chauri Chaura Incident (Gorakhpur)"
          },
          {
            "id": "B",
            "text": "Jallianwala Bagh Massacre"
          },
          {
            "id": "C",
            "text": "Kakori Train Robbery"
          },
          {
            "id": "D",
            "text": "Chittagong Armoury Raid"
          }
        ],
        "correctOption": "A",
        "explanation": "On February 4, 1922, an agitated crowd clashed with police and set fire to the Chauri Chaura police station in Gorakhpur district (UP), killing 22 policemen. Committed to absolute non-violence (Ahimsa), Gandhi suspended the movement on February 12 via the Bardoli resolution.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "National Movement",
        "subtopic": "Non-Cooperation Movement Suspension"
      },
      {
        "id": "gs-q-034",
        "sourceType": "MODELLED",
        "stem": "Mahatma Gandhi launched the Civil Disobedience Movement on March 12, 1930 with the historic Dandi March, walking 240 miles from Sabarmati Ashram to Dandi in:",
        "options": [
          {
            "id": "A",
            "text": "24 days"
          },
          {
            "id": "B",
            "text": "12 days"
          },
          {
            "id": "C",
            "text": "30 days"
          },
          {
            "id": "D",
            "text": "40 days"
          }
        ],
        "correctOption": "A",
        "explanation": "Accompanied by 78 chosen ashram followers, Gandhi walked 240 miles from Sabarmati to coastal Dandi in 24 days, breaking the colonial salt law on morning of April 6, 1930 by picking up a lump of natural salt.",
        "formulaContext": null,
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / State PSC GS Paper I 2023",
        "topic": "National Movement",
        "subtopic": "Civil Disobedience & Dandi March"
      },
      {
        "id": "gs-q-035",
        "sourceType": "MODELLED",
        "stem": "Which of the following was a key feature introduced by the Government of India Act, 1935?",
        "options": [
          {
            "id": "A",
            "text": "Introduction of Provincial Autonomy and abolition of dyarchy in the provinces"
          },
          {
            "id": "B",
            "text": "Establishment of a Constituent Assembly"
          },
          {
            "id": "C",
            "text": "Partition of British India"
          },
          {
            "id": "D",
            "text": "Grant of complete independence (Purna Swaraj)"
          }
        ],
        "correctOption": "A",
        "explanation": "The 1935 Act abolished dyarchy in the provinces and established 'Provincial Autonomy', giving provinces separate legal identity and responsible government. It also proposed an All-India Federation and introduced dyarchy at the Centre.",
        "formulaContext": null,
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Constitutional History",
        "subtopic": "Government of India Act 1935"
      },
      {
        "id": "gs-q-036",
        "sourceType": "MODELLED",
        "stem": "The historic resolution for the 'Quit India Movement' with Mahatma Gandhi's mantra 'Do or Die' (Karo ya Maro) was passed by the AICC at Gowalia Tank Maidan on:",
        "options": [
          {
            "id": "A",
            "text": "August 8, 1942"
          },
          {
            "id": "B",
            "text": "July 14, 1942"
          },
          {
            "id": "C",
            "text": "September 15, 1942"
          },
          {
            "id": "D",
            "text": "January 26, 1942"
          }
        ],
        "correctOption": "A",
        "explanation": "The All-India Congress Committee met at Gowalia Tank (now August Kranti Maidan) in Bombay and ratified the Quit India resolution on August 8, 1942. The British launched 'Operation Zero Hour' before dawn on August 9, arresting all top national leaders.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "National Movement",
        "subtopic": "Quit India Movement 1942"
      }
    ],
    "unitName": "Indian & World History",
    "codeClause": "National Archives & NCERT History",
    "confidencePercent": 58,
    "masteredStatus": "In Progress",
    "diagramType": "polity",
    "subtopicList": [
      "Indus Valley Civilization & Town Planning",
      "Mauryan Empire & Ashoka's Edicts",
      "Gupta Golden Age & Classical Literature",
      "Mughal Administration & Mansabdari System",
      "1857 Revolt: Key Leaders & Suppression",
      "INC Formation & Moderates vs Extremists",
      "Gandhian Movements (NCM, CDM, Quit India)"
    ],
    "comparisonGrid": {
      "titleLeft": "Non-Cooperation Movement",
      "tagLeft": "1920 - 1922",
      "valueLeft": "Boycott of Titles & Courts",
      "descLeft": "Launched following Rowlatt Act & Jallianwala Bagh massacre; called off by Mahatma Gandhi after violent Chauri Chaura incident in February 1922.",
      "titleRight": "Civil Disobedience Movement",
      "tagRight": "1930 - 1934",
      "valueRight": "Defiance of Salt Law",
      "descRight": "Initiated with historic Dandi March from Sabarmati to Dandi (March 12 - April 6, 1930); direct defiance of colonial laws and refusal to pay land revenue."
    },
    "callouts": {
      "corePostulate": "Government of India Act 1935 established Provincial Autonomy, abolished Dyarchy in the provinces, and provided the primary structural framework for the 1950 Indian Constitution.",
      "corePostulateRef": "GoI Act 1935",
      "examTrap": "The Indian National Congress was founded in December 1885 at Bombay by retired civil servant A.O. Hume. W.C. Bonnerjee presided over the first session, NOT A.O. Hume!",
      "examTrapRef": "Modern Indian History Standards",
      "testedRatios": [
        {
          "label": "Jallianwala Bagh Massacre:",
          "value": "13 April 1919 (General Dyer)"
        },
        {
          "label": "Poona Pact Signed:",
          "value": "24 September 1932 (Gandhi & Ambedkar)"
        },
        {
          "label": "Quit India Resolution Passed:",
          "value": "8 August 1942 (Gowalia Tank, Bombay)"
        },
        {
          "label": "Cabinet Mission Arrived:",
          "value": "March 1946 (Pethick-Lawrence, Cripps, Alexander)"
        }
      ],
      "numericalShortcut": {
        "formula": "Key Gandhian Satyagrahas: Champaran (1917) -> Ahmedabad (1918) -> Kheda (1918)",
        "note": "Champaran was India's first civil disobedience against tinkathia indigo system; Ahmedabad mill strike was first hunger strike; Kheda was first non-cooperation."
      }
    },
    "aiTutorPrompts": [
      {
        "question": "What was the Cabinet Mission Grouping Scheme and why did Assam oppose it?",
        "answerPreview": "The 1946 Cabinet Mission proposed grouping provinces: Group C comprised Bengal and Assam. Gopinath Bordoloi vehemently opposed this because it would force Assam into a Muslim-majority grouping, stripping its indigenous cultural identity. He persuaded Gandhi and the Congress Working Committee to reject it."
      },
      {
        "question": "What were the main causes of the Revolt of 1857?",
        "answerPreview": "Military discontent (greased cartridges with cow and pig fat), political annexation policies (Lord Dalhousie's Doctrine of Lapse), economic exploitation of traditional artisans and peasants, and socio-religious interference by colonial authorities."
      }
    ]
  },
  {
    "id": "gs-economy",
    "title": "Indian & Assam Economy: Macroeconomics & State Resources",
    "subject": "Economy & Development",
    "category": "gs",
    "readTime": "16 min read",
    "weightage": "CORE",
    "icon": "TrendingUp",
    "summary": "National income accounting, RBI monetary policy instruments, GST framework, and key sectors of Assam's economy (Tea industry, Digboi petroleum, agriculture, Muga silk).",
    "prerequisites": [
      "Basic Economics"
    ],
    "standardReferences": [
      "Ramesh Singh: Indian Economy",
      "Assam Economic Survey"
    ],
    "practiceQuestionIds": [
      "gs-q-053",
      "gs-q-054",
      "gs-q-055",
      "gs-q-056",
      "gs-q-057",
      "gs-q-058",
      "gs-q-059",
      "gs-q-060",
      "gs-q-061",
      "gs-q-062",
      "gs-q-063",
      "gs-q-064",
      "gs-q-065",
      "gs-q-066"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "stepTitle": "Monetary Policy & Fiscal Architecture",
        "subtitle": "Repo rate, CRR, SLR, FRBM Act, and Goods & Services Tax",
        "keyConcept": "Monetary policy is governed by the Reserve Bank of India (RBI) through policy rates to control liquidity and maintain inflation targets (4% +/- 2%). Fiscal policy is managed by the Union and State governments via taxation and expenditure.",
        "formulaOrCode": "\\text{Repo Rate: Rate at which RBI lends short-term to banks against government collateral}",
        "highYieldFacts": [
          "Cash Reserve Ratio (CRR): Percentage of net demand and time liabilities (NDTL) banks must hold in cash with RBI without earning interest.",
          "Statutory Liquidity Ratio (SLR): Percentage banks must invest in approved government securities, gold, or cash.",
          "GST (101st Amendment Act, 2016): One nation, one tax destination-based consumption tax.",
          "Assam was the FIRST state in India to ratify the GST Bill (August 2016)."
        ],
        "examTrap": "Assam was the FIRST state in the entire country to pass the GST Constitutional Amendment Bill in its legislative assembly!",
        "benchmarkExample": {
          "question": "Which was the first state in India to ratify the GST Constitutional Amendment Act in 2016?",
          "options": [
            "Gujarat",
            "Assam",
            "Maharashtra",
            "Bihar"
          ],
          "correctAnswer": "Assam",
          "stepByStepSolution": [
            "Step 1: Following parliamentary passage of the 122nd Constitutional Amendment Bill,",
            "Step 2: The Assam Legislative Assembly ratified it on 12 August 2016, becoming the first state in India to do so."
          ],
          "takeaway": "Assam = 1st State to ratify GST Act (August 2016)."
        }
      },
      {
        "stepNumber": 2,
        "stepTitle": "Economy of Assam: Tea, Petroleum & Handloom",
        "subtitle": "Assam tea output, Digboi refinery (Asia's oldest), and Muga silk GI tag",
        "keyConcept": "Assam contributes over 50% of India's total tea production. Digboi in Tinsukia district is Asia's oldest operating oil refinery (commissioned 1901). Assam's golden Muga silk holds a Geographical Indication (GI) tag.",
        "formulaOrCode": "\\text{Assam Tea Output} > 50\\% \\text{ of India's National Tea Production}",
        "highYieldFacts": [
          "Robert Bruce discovered wild tea plants in Assam in 1823.",
          "Digboi Refinery: First oil well in Asia drilled in 1889; refinery established in 1901.",
          "Assam has 4 oil refineries: Digboi (1901), Guwahati/Noonmati (1962), Bongaigaon (1979), Numaligarh (1999).",
          "Muga Silk ('Antheraea assamensis'): Golden-yellow endemic silk produced only in Assam; received GI tag in 2007."
        ],
        "examTrap": "The first public sector refinery in independent India was Guwahati (Noonmati) Refinery, inaugurated on 1 Jan 1962 with Romanian collaboration. Digboi was set up earlier in 1901 under British rule.",
        "benchmarkExample": {
          "question": "Asia's oldest operating oil refinery, commissioned in 1901, is located in which town of Assam?",
          "options": [
            "Bongaigaon",
            "Numaligarh",
            "Digboi",
            "Guwahati"
          ],
          "correctAnswer": "Digboi",
          "stepByStepSolution": [
            "Step 1: Oil was discovered in Digboi in 1889.",
            "Step 2: The Assam Oil Company established the Digboi refinery in 1901.",
            "Step 3: It remains the world's oldest continuously operating oil well and refinery."
          ],
          "takeaway": "Digboi = Asia's oldest refinery (1901); Numaligarh = Accord Refinery."
        }
      }
    ],
    "topicQuestions": [
      {
        "id": "gs-q-053",
        "sourceType": "MODELLED",
        "stem": "In national income accounting in India, 'National Income' strictly refers to:",
        "options": [
          {
            "id": "A",
            "text": "Net National Product at Factor Cost (NNP at FC)"
          },
          {
            "id": "B",
            "text": "Gross Domestic Product at Market Prices (GDP at MP)"
          },
          {
            "id": "C",
            "text": "Gross National Product at Factor Cost (GNP at FC)"
          },
          {
            "id": "D",
            "text": "Net Domestic Product at Market Prices (NDP at MP)"
          }
        ],
        "correctOption": "A",
        "explanation": "National Income (NI) = NNP at Factor Cost = GNP at MP - Depreciation - Net Indirect Taxes (Indirect taxes - Subsidies). It measures the net domestic and foreign factor earnings accrued to normal residents of a country.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "National Income Accounting",
        "subtopic": "National Income Definition"
      },
      {
        "id": "gs-q-054",
        "sourceType": "MODELLED",
        "stem": "Under the flexible inflation targeting framework adopted by the Reserve Bank of India, monetary policy targets which inflation metric within a band of 4% (+/- 2%)?",
        "options": [
          {
            "id": "A",
            "text": "Consumer Price Index Combined (CPI-C)"
          },
          {
            "id": "B",
            "text": "Wholesale Price Index (WPI)"
          },
          {
            "id": "C",
            "text": "GDP Deflator"
          },
          {
            "id": "D",
            "text": "Index of Industrial Production (IIP)"
          }
        ],
        "correctOption": "A",
        "explanation": "Under the amended RBI Act (1934), the Monetary Policy Framework Agreement specifies headline Consumer Price Index (CPI-Combined) as the nominal anchor for inflation targeting at 4% with an allowable tolerance band of +/- 2% (2% to 6%).",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2023",
        "topic": "Inflation & Price Indices",
        "subtopic": "Inflation Targeting Framework"
      },
      {
        "id": "gs-q-055",
        "sourceType": "MODELLED",
        "stem": "The Monetary Policy Committee (MPC) of the Reserve Bank of India consists of how many members, and who is its ex-officio Chairperson?",
        "options": [
          {
            "id": "A",
            "text": "6 members, chaired by the Governor of the Reserve Bank of India"
          },
          {
            "id": "B",
            "text": "5 members, chaired by the Union Finance Minister"
          },
          {
            "id": "C",
            "text": "7 members, chaired by the Chief Economic Advisor"
          },
          {
            "id": "D",
            "text": "6 members, chaired by the Deputy Governor in charge of monetary policy"
          }
        ],
        "correctOption": "A",
        "explanation": "The MPC comprises six members: three internal RBI officials (Governor as ex-officio Chair, Deputy Governor in charge of monetary policy, and one officer) plus three independent external experts appointed by the Central Government.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Banking & Monetary Policy",
        "subtopic": "Monetary Policy Committee Composition"
      },
      {
        "id": "gs-q-056",
        "sourceType": "MODELLED",
        "stem": "If the Reserve Bank of India decides to increase the Cash Reserve Ratio (CRR), what is the immediate effect on commercial banks?",
        "options": [
          {
            "id": "A",
            "text": "It decreases the lending capacity and liquidity of commercial banks"
          },
          {
            "id": "B",
            "text": "It increases commercial bank profitability and credit creation"
          },
          {
            "id": "C",
            "text": "It lowers interest rates on consumer loans"
          },
          {
            "id": "D",
            "text": "It has no impact on money supply in the economy"
          }
        ],
        "correctOption": "A",
        "explanation": "Cash Reserve Ratio is the specified minimum fraction of Net Demand and Time Liabilities (NDTL) that commercial banks must maintain as cash reserves with the RBI. Raising CRR impounds liquidity, reducing credit availability and controlling inflation.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2023",
        "topic": "Monetary Policy Instruments",
        "subtopic": "Cash Reserve Ratio (CRR)"
      },
      {
        "id": "gs-q-057",
        "sourceType": "MODELLED",
        "stem": "The 'Fiscal Deficit' in the Union Budget of India is defined as:",
        "options": [
          {
            "id": "A",
            "text": "Total Budgetary Expenditure minus Total Receipts excluding Borrowings"
          },
          {
            "id": "B",
            "text": "Revenue Expenditure minus Revenue Receipts"
          },
          {
            "id": "C",
            "text": "Fiscal Deficit minus Interest Payments"
          },
          {
            "id": "D",
            "text": "Total Expenditure minus Tax Revenue only"
          }
        ],
        "correctOption": "A",
        "explanation": "Fiscal Deficit = Total Expenditure - (Revenue Receipts + Non-debt Capital Receipts). It reflects the total net borrowing requirement of the government from domestic and external sources during the financial year.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Public Finance & Budgeting",
        "subtopic": "Fiscal Deficit Formula"
      },
      {
        "id": "gs-q-058",
        "sourceType": "MODELLED",
        "stem": "The Goods and Services Tax (GST) was introduced in India with effect from July 1, 2017 through which Constitutional Amendment Act?",
        "options": [
          {
            "id": "A",
            "text": "101st Constitutional Amendment Act, 2016"
          },
          {
            "id": "B",
            "text": "100th Constitutional Amendment Act, 2015"
          },
          {
            "id": "C",
            "text": "102nd Constitutional Amendment Act, 2018"
          },
          {
            "id": "D",
            "text": "103rd Constitutional Amendment Act, 2019"
          }
        ],
        "correctOption": "A",
        "explanation": "The 101st Constitutional Amendment Act, 2016 enabled the concurrent taxation of goods and services by Parliament and State Legislatures (Article 246A) and established the constitutional GST Council (Article 279A).",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2022",
        "topic": "Taxation System",
        "subtopic": "GST Constitutional Basis"
      },
      {
        "id": "gs-q-059",
        "sourceType": "MODELLED",
        "stem": "NITI Aayog (National Institution for Transforming India), which replaced the six-decade-old Planning Commission on January 1, 2015, functions as a:",
        "options": [
          {
            "id": "A",
            "text": "Policy think tank promoting cooperative federalism"
          },
          {
            "id": "B",
            "text": "Constitutional body with powers to allocate central funds"
          },
          {
            "id": "C",
            "text": "Statutory financial regulator under Parliament"
          },
          {
            "id": "D",
            "text": "Judicial dispute resolution body between states"
          }
        ],
        "correctOption": "A",
        "explanation": "NITI Aayog was established by an executive cabinet resolution on January 1, 2015. Unlike the Planning Commission, it possesses no mandate to disburse financial grants, serving strictly as a strategic and technical think tank promoting cooperative federalism.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Economic Planning",
        "subtopic": "NITI Aayog Establishment"
      },
      {
        "id": "gs-q-060",
        "sourceType": "MODELLED",
        "stem": "India's Second Five-Year Plan (1956-1961), which laid foundational emphasis on rapid industrialization and heavy basic capital goods industries, was based on the model developed by:",
        "options": [
          {
            "id": "A",
            "text": "Prasanta Chandra Mahalanobis"
          },
          {
            "id": "B",
            "text": "Harrod and Domar"
          },
          {
            "id": "C",
            "text": "C. Rangarajan"
          },
          {
            "id": "D",
            "text": "Amartya Sen and Jagdish Bhagwati"
          }
        ],
        "correctOption": "A",
        "explanation": "The Second Plan was based on the celebrated Feldman-Mahalanobis two-sector / four-sector economic growth model, emphasizing heavy public sector investments in steel, machinery, power, and capital infrastructure.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2023",
        "topic": "Planning History",
        "subtopic": "Second Five Year Plan Model"
      },
      {
        "id": "gs-q-061",
        "sourceType": "MODELLED",
        "stem": "In India's Balance of Payments (BoP), which of the following transactions is recorded under the 'Capital Account' rather than the 'Current Account'?",
        "options": [
          {
            "id": "A",
            "text": "Foreign Direct Investment (FDI) inflows"
          },
          {
            "id": "B",
            "text": "Merchandise export of petroleum products"
          },
          {
            "id": "C",
            "text": "Software service exports (IT invisibles)"
          },
          {
            "id": "D",
            "text": "Remittances sent home by non-resident Indians (unilateral transfers)"
          }
        ],
        "correctOption": "A",
        "explanation": "The Current Account encompasses merchandise trade (exports/imports of goods), service trade (invisibles), income, and unilateral transfers/remittances. The Capital Account records asset ownership transactions such as Foreign Direct Investment (FDI), Foreign Portfolio Investment (FPI), and external commercial borrowings.",
        "formulaContext": null,
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "External Sector",
        "subtopic": "Current Account Deficit Components"
      },
      {
        "id": "gs-q-062",
        "sourceType": "MODELLED",
        "stem": "The Expert Group on Poverty Estimation headed by Suresh Tendulkar (2009) departed from earlier nutritional norms by anchoring the poverty line calculation on:",
        "options": [
          {
            "id": "A",
            "text": "Per capita private consumption expenditure on food, education, and health"
          },
          {
            "id": "B",
            "text": "Strictly minimum daily caloric intake of 2400 kcal in rural areas"
          },
          {
            "id": "C",
            "text": "Ownership of permanent agricultural land"
          },
          {
            "id": "D",
            "text": "Formal household income reported on income tax returns"
          }
        ],
        "correctOption": "A",
        "explanation": "The Tendulkar Committee shifted away from purely calorie-based thresholds to Monthly Per Capita Consumer Expenditure (MPCE) using basket valuations that included essential health, schooling, and transport expenditures.",
        "formulaContext": null,
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / State PSC GS Paper I 2023",
        "topic": "Poverty & Social Welfare",
        "subtopic": "Tendulkar Committee Methodology"
      },
      {
        "id": "gs-q-063",
        "sourceType": "MODELLED",
        "stem": "For domestic commercial banks operating in India, the overall mandatory Priority Sector Lending (PSL) target set by the RBI is what percentage of Adjusted Net Bank Credit (ANBC)?",
        "options": [
          {
            "id": "A",
            "text": "40% of ANBC"
          },
          {
            "id": "B",
            "text": "25% of ANBC"
          },
          {
            "id": "C",
            "text": "50% of ANBC"
          },
          {
            "id": "D",
            "text": "18% of ANBC"
          }
        ],
        "correctOption": "A",
        "explanation": "Domestic scheduled commercial banks and foreign banks with 20 or more branches must allocate 40% of Adjusted Net Bank Credit (ANBC) or credit equivalent of off-balance sheet exposure to priority sectors (Agriculture, MSME, Education, Housing, Renewable Energy).",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Banking Regulations",
        "subtopic": "Priority Sector Lending Targets"
      },
      {
        "id": "gs-q-064",
        "sourceType": "MODELLED",
        "stem": "The Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA), 2005 legally guarantees how many days of wage employment in a financial year to every rural household?",
        "options": [
          {
            "id": "A",
            "text": "100 days of unskilled manual labour"
          },
          {
            "id": "B",
            "text": "150 days of skilled labour"
          },
          {
            "id": "C",
            "text": "200 days of agricultural labour"
          },
          {
            "id": "D",
            "text": "75 days of rural public works"
          }
        ],
        "correctOption": "A",
        "explanation": "MGNREGA provides a statutory legal right to at least 100 days of guaranteed wage employment per financial year to adult members of any rural household willing to do public work-related unskilled manual work.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Employment Schemes",
        "subtopic": "MGNREGA Statutory Guarantee"
      },
      {
        "id": "gs-q-065",
        "sourceType": "MODELLED",
        "stem": "Under the Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) scheme, eligible landholding farmer families receive income support of:",
        "options": [
          {
            "id": "A",
            "text": "Rs 6,000 per year paid in three equal installments of Rs 2,000"
          },
          {
            "id": "B",
            "text": "Rs 10,000 per year paid in two equal installments"
          },
          {
            "id": "C",
            "text": "Rs 5,000 per month directly into bank accounts"
          },
          {
            "id": "D",
            "text": "Rs 12,000 annually tied to crop sowing receipts"
          }
        ],
        "correctOption": "A",
        "explanation": "PM-KISAN is a central sector scheme providing direct financial assistance of Rs 6,000 per year in three equal four-monthly installments of Rs 2,000 each into the Aadhaar-linked bank accounts of beneficiary farmers.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2023",
        "topic": "Agricultural Schemes",
        "subtopic": "PM-KISAN Cash Benefit"
      },
      {
        "id": "gs-q-066",
        "sourceType": "MODELLED",
        "stem": "Under the 'Automatic Route' of Foreign Direct Investment (FDI) in India:",
        "options": [
          {
            "id": "A",
            "text": "Non-resident investors do not require prior approval from the Government or Reserve Bank of India"
          },
          {
            "id": "B",
            "text": "Prior approval of the Union Cabinet is mandatory before remittance"
          },
          {
            "id": "C",
            "text": "Investments can only be made through state-owned public financial institutions"
          },
          {
            "id": "D",
            "text": "FDI is capped at a maximum of 26% across all sectors"
          }
        ],
        "correctOption": "A",
        "explanation": "Under the Automatic Route, foreign investors do not need prior government or RBI approval; they simply notify the RBI within 30 days of receiving inward remittances and issuing shares.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2022",
        "topic": "Foreign Investment",
        "subtopic": "FDI Automatic Route"
      }
    ],
    "unitName": "Economy & Development",
    "codeClause": "Economic Survey & Assam Budget 2024-25",
    "confidencePercent": 48,
    "masteredStatus": "Needs Practice",
    "diagramType": "economy",
    "subtopicList": [
      "National Income Accounting: GDP, GVA, NNP & Real vs Nominal",
      "Inflation Indices: CPI vs WPI & Monetary Policy Committee",
      "Fiscal Policy: Revenue, Fiscal & Primary Deficit (FRBM Act)",
      "Five Year Plans & NITI Aayog Governance",
      "Assam Petroleum Industry (Digboi, Numaligarh)",
      "Assam Tea Industry & Coal Reserves",
      "Assam State Budget Initiatives (Orunodoi, Asom Mala)"
    ],
    "comparisonGrid": {
      "titleLeft": "Consumer Price Index (CPI)",
      "tagLeft": "Retail Inflation",
      "valueLeft": "Target: 4% \u00b1 2%",
      "descLeft": "Measures price changes of basket of goods and services purchased by households; base year 2012; official metric used by RBI MPC.",
      "titleRight": "Wholesale Price Index (WPI)",
      "tagRight": "Wholesale / Producer",
      "valueRight": "Goods Only (No Services)",
      "descRight": "Measures price changes at wholesale level; base year 2011-12; weighted towards manufactured products, primary articles, and fuel."
    },
    "callouts": {
      "corePostulate": "Digboi in Tinsukia district of Assam is Asia's oldest operating oil refinery and the birthplace of the Indian petroleum industry (first commercial oil drilled in 1889, commissioned in 1901).",
      "corePostulateRef": "Indian Petroleum History",
      "examTrap": "Primary Deficit = Fiscal Deficit - Interest Payments. A zero primary deficit means that government borrowing is used ENTIRELY to service interest payments on past debt!",
      "examTrapRef": "State PSC & UPSC Civil Services",
      "testedRatios": [
        {
          "label": "Assam Share in India's Tea:",
          "value": "> 50% of national production"
        },
        {
          "label": "Numaligarh Refinery Expansion:",
          "value": "From 3 MMTPA to 9 MMTPA"
        },
        {
          "label": "FRBM Act Fiscal Deficit Limit:",
          "value": "Target of 3% of GDP"
        },
        {
          "label": "First Five-Year Plan Model:",
          "value": "Harrod-Domar Growth Model"
        }
      ],
      "numericalShortcut": {
        "formula": "Monetary Policy Transmission: Repo Rate Up -> Bank Lending Rates Up -> Credit Growth Down -> Inflation Cools",
        "note": "Repo rate is the rate at which RBI lends short-term funds to commercial banks against government securities."
      }
    },
    "aiTutorPrompts": [
      {
        "question": "What is the difference between Gross Domestic Product (GDP) and Gross Value Added (GVA)?",
        "answerPreview": "GDP = GVA + Taxes on Products - Subsidies on Products. GVA measures output from the producer side across sectors (Agriculture, Industry, Services), whereas GDP measures total economic output from the expenditure side."
      },
      {
        "question": "What are the major socio-economic schemes in Assam's latest budget?",
        "answerPreview": "1. Orunodoi 2.0 (monthly direct benefit cash transfer to women heads of underprivileged families), 2. Asom Mala (comprehensive state highway upgradation), 3. Nijut Moina scheme (financial assistance to girls for pursuing higher education to eliminate child marriage), 4. Mukhya Mantri Lok Sevak Asoni."
      }
    ]
  },
  {
    "id": "civil-bldg-materials",
    "title": "Building Materials: Cement, Concrete & Masonry",
    "subject": "Building Materials & Construction",
    "category": "civil",
    "readTime": "22 min read",
    "weightage": "HIGH_YIELD",
    "icon": "Layers",
    "summary": "Chemical composition of cement, Bogue's compounds, Vicat and Le-Chatelier tests, concrete mix design, Abram's w/c law, workability, aggregates, bricks, and timber.",
    "fullDescription": "Building Materials and Concrete Technology forms the foundation of all civil engineering construction and represents 12-15% of questions in competitive exams (GATE, ESE, SSC JE, State PSCs). Understanding the chemical kinetics of Bogue compounds, hydration heat, workability measurement, aggregate gradation, and durability criteria is crucial for civil engineers.",
    "syllabusCoverage": [
      "Portland Cement Chemistry (C3S, C2S, C3A, C4AF, Bogue Compounds)",
      "Field & Laboratory Tests on Cement (Fineness, Consistency, Setting Time, Soundness, Compressive Strength)",
      "Types of Cement (OPC, Rapid Hardening, Low Heat, Blast Furnace Slag, PPC, Sulfate Resisting)",
      "Concrete Technology & Workability (Slump Test, Compaction Factor, Vee-Bee Consistometer, Flow Table)",
      "Water-Cement Ratio & Abram's Law, Compressive & Flexural Strength (f_cr = 0.7 sqrt(f_ck))",
      "Coarse & Fine Aggregates (Fineness Modulus, Flakiness & Elongation Indices, Abrasion, Bulking of Sand)",
      "Common Bricks & Clay Products (Class I, II, III, Water Absorption, Efflorescence, Compressive Strength)",
      "Timber & Wood Products (Structure, Defects, Seasoning, Preservation, Plywood, Veneers)"
    ],
    "prerequisites": [
      "Engineering Chemistry",
      "Basic Materials Science"
    ],
    "standardReferences": [
      "IS 269:2015 OPC",
      "IS 456:2000 Concrete",
      "IS 383 Aggregates",
      "M.S. Shetty Concrete Technology"
    ],
    "practiceQuestionIds": [
      "ce-q-096",
      "ce-q-097",
      "ce-q-098",
      "ce-q-007",
      "ce-q-012"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "stepTitle": "Portland Cement Chemistry & Bogue's Compounds",
        "subtitle": "Tricalcium silicate, Dicalcium silicate, Tricalcium aluminate, and Gypsum kinetics",
        "keyConcept": "When raw materials (calcareous and argillaceous) are fused at 1400-1500\u00b0C in a rotary kiln, four principal chemical compounds known as Bogue's Compounds are formed: C3S (Alite), C2S (Belite), C3A (Celite), and C4AF (Felite). Gypsum (CaSO4.2H2O) is interground at 2-3% during final clinker milling specifically to retard flash setting by reacting with C3A.",
        "pointers": [
          "Decreasing order of compound percentage in OPC: C3S (45-55%) > C2S (20-30%) > C3A (8-12%) > C4AF (6-10%).",
          "C3S (Alite) hydrates rapidly, responsible for early strength development (first 7 to 28 days) and has high heat of hydration (~500 J/g).",
          "C2S (Belite) hydrates slowly, responsible for progressive ultimate long-term strength (after 28 days to years); produces lowest heat of hydration (~260 J/g).",
          "C3A (Celite) reacts fastest with water within 24 hours, generates highest heat of hydration (~865 J/g); susceptible to sulfate attack.",
          "C4AF (Felite) has poorest cementing value, responsible for dark grayish color of cement, lowest heat generation (~420 J/g).",
          "Gypsum (2-3%) forms calcium sulfo-aluminate crystals on C3A particle surfaces, preventing instant flash setting."
        ],
        "formulaOrCode": "\\text{Bogue Formulae:}\\quad C_3S = 4.071(CaO) - 7.600(SiO_2) - 6.718(Al_2O_3) - 1.430(Fe_2O_3) - 2.852(SO_3)",
        "highYieldFacts": [
          "Heat of hydration order: C3A (865 J/g) > C3S (500 J/g) > C4AF (420 J/g) > C2S (260 J/g).",
          "Rate of hydration order: C4AF > C3A > C3S > C2S.",
          "Rate of early strength development: C3A > C3S > C4AF > C2S.",
          "Ultimate strength contribution: C2S = C3S (equal ultimate strength, but C2S takes 1 year to reach it)."
        ],
        "examTrap": "Do not confuse rate of hydration (C4AF fastest) with heat of hydration (C3A highest)! Also note that Rapid Hardening Cement is manufactured by increasing C3S content and grinding finer, NOT by adding CaCl2.",
        "benchmarkExample": {
          "question": "Which Bogue compound is primarily responsible for the ultimate long-term strength of Portland cement after 28 days?",
          "options": [
            "Tricalcium silicate (C3S)",
            "Dicalcium silicate (C2S)",
            "Tricalcium aluminate (C3A)",
            "Tetracalcium aluminoferrite (C4AF)"
          ],
          "correctAnswer": "Dicalcium silicate (C2S)",
          "stepByStepSolution": [
            "Step 1: Understand strength evolution across curing age.",
            "Step 2: C3S hydrates rapidly and achieves maximum strength contribution in the first 7 to 28 days.",
            "Step 3: C2S hydrates slowly and steadily, continuing strength gain from 28 days up to several years.",
            "Step 4: Therefore, progressive ultimate long-term strength is attributed to C2S (Belite)."
          ],
          "takeaway": "Early strength = C3S; Long-term progressive strength = C2S; Flash set = C3A."
        }
      },
      {
        "stepNumber": 2,
        "stepTitle": "Standard Laboratory Tests on Cement",
        "subtitle": "Vicat apparatus, Le-Chatelier mold, Autoclave test, and fineness measurement",
        "keyConcept": "Standard testing of cement enforces rigorous consistency, setting time, and volumetric soundness controls prior to site utilization.",
        "pointers": [
          "Standard Consistency (P): Tested using Vicat apparatus with a 10 mm diameter plunger. Defined as moisture percentage when plunger penetrates 33-35 mm from top (5-7 mm from bottom) of standard Vicat mold.",
          "Initial Setting Time: Tested using Vicat needle (1 mm square). Water added = 0.85 P. Must not be less than 30 minutes for OPC.",
          "Final Setting Time: Tested using Vicat needle with annular collar (5 mm diameter). Water added = 0.85 P. Must not exceed 600 minutes (10 hours) for OPC.",
          "Soundness Test (Free Lime): Measured using Le-Chatelier split-cylinder mold. Expansion must not exceed 10 mm for OPC.",
          "Soundness Test (Magnesia + Lime): Autoclave test is mandatory if Magnesia content exceeds 3%. Expansion must not exceed 0.8%.",
          "Fineness Test: Sieve method (90 micron sieve, residue must not exceed 10% for OPC, 5% for RHC) or Blaine air-permeability apparatus (specific surface >= 225 m2/kg for OPC, >= 325 m2/kg for RHC)."
        ],
        "formulaOrCode": "\\text{Water for Setting Time} = 0.85 P \\quad ; \\quad \\text{Water for Soundness} = 0.78 P \\quad ; \\quad \\text{Water for Compressive Strength} = \\frac{P}{4} + 3.0 \\%",
        "highYieldFacts": [
          "Le-Chatelier test measures uncombined free lime only; it CANNOT detect excess Magnesia soundness.",
          "Autoclave test measures unsoundness due to both Magnesia and Lime.",
          "Standard sand used for compressive strength testing in India is Ennore Sand (IS 650) in 1:3 ratio with cement.",
          "Vicat plunger dimensions: 10 mm diameter, 50 mm length; needle: 1 mm square."
        ],
        "examTrap": "Water percentage for tests: Consistency = P; Setting Time = 0.85 P; Soundness = 0.78 P; Compressive strength of mortar cubes = (P/4 + 3.0)%. Candidates often confuse 0.85P and 0.78P!",
        "benchmarkExample": {
          "question": "If standard consistency of a cement sample is P = 30%, calculate the quantity of water required for preparing the paste for the Le-Chatelier soundness test.",
          "options": [
            "21.0%",
            "23.4%",
            "25.5%",
            "27.0%"
          ],
          "correctAnswer": "23.4%",
          "stepByStepSolution": [
            "Step 1: Identify standard water requirement formula for Le-Chatelier soundness test: Water = 0.78 P.",
            "Step 2: Given P = 30%.",
            "Step 3: Water = 0.78 * 30% = 23.4%."
          ],
          "takeaway": "Soundness water = 0.78 P; Setting time water = 0.85 P."
        }
      },
      {
        "stepNumber": 3,
        "stepTitle": "Concrete Properties, Workability & Abram's Law",
        "subtitle": "Slump test values, compaction factor, Vee-Bee time, and strength relationships",
        "keyConcept": "Concrete workability describes the ease with which fresh concrete can be mixed, placed, compacted, and finished without segregation or bleeding. Hardened concrete strength is governed by Abram's Law, which asserts strength depends inversely and strictly on water-cement ratio for fully compacted mixes.",
        "pointers": [
          "Abram's Law: Compressive strength S = A / B^(w/c), where A and B are empirical constants.",
          "Flexural Strength (Modulus of Rupture): f_cr = 0.7 * sqrt(f_ck) MPa per IS 456:2000 Cl. 6.2.2.",
          "Short-term Modulus of Elasticity of Concrete: E_c = 5000 * sqrt(f_ck) MPa per IS 456:2000.",
          "Long-term Modulus of Elasticity accounting for creep: E_ce = E_c / (1 + theta), where theta is creep coefficient (2.2 at 7 days, 1.6 at 28 days, 1.1 at 1 year).",
          "Slump Test: Standard frustum cone (bottom dia 200 mm, top dia 100 mm, height 300 mm) compacted in 4 layers with 25 tamping strokes each. Types of slump: True slump, Shear slump (indicates lack of cohesion), Collapse slump.",
          "Compaction Factor Test: Highly sensitive for low to very low workability mixes. Ratio of weight of partially compacted concrete to fully compacted concrete (ranges 0.75 to 0.95).",
          "Vee-Bee Consistometer: Expressed in Vee-Bee seconds; ideal for dry, very low workability mixes (stiff concrete for pavement roller compaction)."
        ],
        "formulaOrCode": "f_{cr} = 0.7 \\sqrt{f_{ck}} \\quad ; \\quad E_c = 5000 \\sqrt{f_{ck}} \\quad ; \\quad \\text{Compaction Factor} = \\frac{W_{\\text{partial}}}{W_{\\text{fully}}}",
        "highYieldFacts": [
          "1% air voids in compacted concrete reduces compressive strength by approximately 5% to 6%!",
          "Creep coefficient theta: 7 days = 2.2; 28 days = 1.6; 1 year = 1.1.",
          "Bulking of fine aggregate is maximum (up to 20-30% volume increase) at 4% to 5% moisture content due to surface tension menisci pushing particles apart. Completely submerged sand exhibits ZERO bulking.",
          "Standard slump values: Mass concrete = 25-50 mm; Normal beams/slabs = 50-100 mm; Heavily reinforced sections/pumped concrete = 100-150 mm."
        ],
        "examTrap": "In IS 456:1978, E_c was 5700 sqrt(f_ck). In IS 456:2000, it was revised to 5000 sqrt(f_ck). Always use 5000 sqrt(f_ck) for current exams!",
        "benchmarkExample": {
          "question": "What is the characteristic flexural tensile strength (modulus of rupture) of M25 grade concrete as per IS 456:2000?",
          "options": [
            "2.5 N/mm\u00b2",
            "3.5 N/mm\u00b2",
            "4.2 N/mm\u00b2",
            "5.0 N/mm\u00b2"
          ],
          "correctAnswer": "3.5 N/mm\u00b2",
          "stepByStepSolution": [
            "Step 1: Formula for modulus of rupture: f_cr = 0.7 * sqrt(f_ck).",
            "Step 2: For M25 concrete, f_ck = 25 N/mm\u00b2.",
            "Step 3: f_cr = 0.7 * sqrt(25) = 0.7 * 5 = 3.5 N/mm\u00b2."
          ],
          "takeaway": "f_cr = 0.7 * sqrt(f_ck); for M25 it is exactly 3.5 N/mm\u00b2."
        }
      }
    ],
    "topicQuestions": [
      {
        "id": "ce-q-096",
        "sourceType": "MODELLED",
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
        "explanation": "C3S (Alite, 3CaO\u00b7SiO2) hydrates rapidly and contributes to early strength up to 14 days. C2S hydrates slowly and imparts progressive long-term strength. C3A causes flash setting and produces the highest heat of hydration.",
        "formulaContext": "C3S imparts early strength; C2S imparts progressive late strength after 28 days",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Cement & Concrete",
        "subtopic": "Bogue Compounds Hydration"
      },
      {
        "id": "ce-q-097",
        "sourceType": "MODELLED",
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
        "explanation": "Per IS 269 and IS 4031: Initial setting time (measured with 1 mm square needle) must be \u2265 30 minutes. Final setting time (measured with annular collar needle) must be \u2264 600 minutes (10 hours).",
        "formulaContext": "Initial setting \u2265 30 mins; Final setting \u2264 600 mins (10 hrs) (Vicat apparatus)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2023",
        "topic": "Cement Testing",
        "subtopic": "Setting Times of OPC per IS 4031"
      },
      {
        "id": "ce-q-098",
        "sourceType": "MODELLED",
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
        "explanation": "Slump test is unreliable for dry/lean mixes. Compacting factor test is suitable for low-to-medium workability. Vee-Bee consistometer measures the time (in seconds) required for vibration to transform a conical slump into a flat surface, ideal for stiff dry mixes.",
        "formulaContext": "Very low workability: Vee-Bee test (time in seconds); High workability: Slump test",
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / APSC AE Civil 2022",
        "topic": "Concrete Technology",
        "subtopic": "Workability Measurement"
      },
      {
        "id": "ce-q-007",
        "sourceType": "MODELLED",
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
        "explanation": "Per IS 456 Table 5, minimum grades for RCC under environmental exposure conditions are: Mild (M20), Moderate (M25), Severe (M30), Very Severe (M35), and Extreme (M40).",
        "formulaContext": "Severe exposure min grade = M 30",
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Durability & Concrete Mix",
        "subtopic": "Minimum Grade for Severe Exposure"
      },
      {
        "id": "ce-q-012",
        "sourceType": "MODELLED",
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
        "explanation": "Clause 26.4.2.2 and Table 16 specify that the minimum nominal cover for footings is 50 mm. When concrete is placed directly against untreated soil without blinding layer, cover is commonly increased to 75 mm.",
        "formulaContext": "Footing nominal cover = 50 mm",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Detailing of Reinforcement",
        "subtopic": "Nominal Cover for Footing"
      }
    ],
    "unitName": "Construction Management & Building Materials",
    "codeClause": "IS 10262:2019, IS 269:2015, IS 383:2016",
    "confidencePercent": 75,
    "masteredStatus": "Mastered",
    "diagramType": "rcc",
    "subtopicList": [
      "Cement Chemistry & Bogue's Compounds (C3S, C2S, C3A, C4AF)",
      "Physical Testing of Cement (Vicat, Le Chatelier, Autoclave)",
      "Concrete Workability: Slump, Compaction Factor & Vee-Bee",
      "Bulking of Sand & Aggregate Grading",
      "Chemical Admixtures (Plasticizers, Retarders, Accelerators)",
      "Concrete Mix Proportioning (IS 10262:2019)"
    ],
    "comparisonGrid": {
      "titleLeft": "Tricalcium Silicate (C3S)",
      "tagLeft": "50% to 60% of OPC",
      "valueLeft": "Rapid Hydration",
      "descLeft": "Responsible for early strength development (7-day strength); produces high early heat of hydration; best for rapid-hardening cements.",
      "titleRight": "Dicalcium Silicate (C2S)",
      "tagRight": "15% to 25% of OPC",
      "valueRight": "Progressive Strength",
      "descRight": "Hydrates very slowly; responsible for progressive long-term strength gain after 28 days; low heat of hydration; highly resistant to chemical attack."
    },
    "callouts": {
      "corePostulate": "Standard consistency of cement is determined by Vicat apparatus using a 10 mm diameter plunger penetrating to a depth of 33-35 mm from the top (5-7 mm from bottom) of the Vicat mold.",
      "corePostulateRef": "IS 4031 (Part 4)",
      "examTrap": "Le Chatelier apparatus measures soundness due to UNBURNT FREE LIME only (limit <= 10 mm). Unsoundness due to MAGNESIA must be measured using the Autoclave test (limit <= 0.8%)!",
      "examTrapRef": "APSC AE 2018 & SSC JE",
      "testedRatios": [
        {
          "label": "Initial Setting Time (OPC):",
          "value": "\u2265 30 minutes"
        },
        {
          "label": "Final Setting Time (OPC):",
          "value": "\u2264 600 minutes (10 hrs)"
        },
        {
          "label": "Bulking of Sand (Peak):",
          "value": "15% - 30% at 4% - 5% moisture"
        },
        {
          "label": "Target Mean Strength:",
          "value": "f'ck = fck + 1.65 \u00b7 s"
        }
      ],
      "numericalShortcut": {
        "formula": "Compaction Factor = (Mass of partially compacted concrete) / (Mass of fully compacted concrete)",
        "note": "Compaction factor values: 0.85 (low workability), 0.92 (medium workability), 0.95 (high workability). More precise than slump for dry mixes."
      }
    },
    "aiTutorPrompts": [
      {
        "question": "Why does sand show bulking at 4-5% moisture?",
        "answerPreview": "Moisture creates thin surface-tension meniscus films around sand particles that push grains apart, increasing bulk volume by up to 30%. When completely flooded, the meniscus films break and volume returns to normal."
      },
      {
        "question": "How do superplasticizers increase workability without adding water?",
        "answerPreview": "Superplasticizers (polycarboxylate ethers) disperse cement particle flocs through electrostatic repulsion and steric hindrance, freeing trapped water to lubricate the mix."
      }
    ]
  },
  {
    "id": "civil-hydrology-irrigation",
    "title": "Hydrology & Water Resources: Hydrographs & Canal Design",
    "subject": "Hydrology & Irrigation Engineering",
    "category": "civil",
    "readTime": "20 min read",
    "weightage": "HIGH_YIELD",
    "icon": "Droplets",
    "summary": "Hydrologic cycle, Unit Hydrographs, S-curves, Duty-Delta-Base period, canal design (Lacey's vs Kennedy's theories), and gravity dam stability.",
    "fullDescription": "Hydrology and Irrigation Engineering deals with rainfall-runoff estimation, flood routing, crop water requirements, design of stable unlined canals in alluvial soils, and stability analysis of hydraulic structures. It accounts for 10-12% of civil engineering competitive exams.",
    "syllabusCoverage": [
      "Hydrologic Cycle, Precipitation & Rain Gauge Networks (Arithmetic Mean, Thiessen Polygon, Isohyetal Method)",
      "Infiltration Indices (Phi-index, W-index, Horton Equation)",
      "Runoff & Hydrograph Analysis (Base Flow Separation, Unit Hydrograph Theory, S-Curve Method, Synthetic UH)",
      "Water Requirements of Crops (Duty, Delta, Base Period, Consumptive Use, Irrigation Efficiencies)",
      "Canal Design in Alluvial Soils (Kennedy's Silt Theory vs Lacey's Regime Theory)",
      "Gravity Dams (Forces, Elementary & Practical Profiles, Failure Modes, Factor of Safety)",
      "Seepage Below Hydraulic Structures (Bligh Creep Theory, Lane Weighted Creep, Khosla Theory of Independent Variables)"
    ],
    "prerequisites": [
      "Fluid Mechanics",
      "Open Channel Hydraulics"
    ],
    "standardReferences": [
      "Subramanya Engineering Hydrology",
      "S.K. Garg Irrigation Engineering & Hydraulic Structures",
      "Lacey's Regime Papers"
    ],
    "practiceQuestionIds": [
      "ce-q-061",
      "ce-q-062",
      "ce-q-063",
      "ce-q-064",
      "ce-q-057",
      "ce-q-058"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "stepTitle": "Crop Water Requirements: Duty, Delta & Base Period",
        "subtitle": "Fundamental relationships, Kor watering, Paleo irrigation, and water efficiencies",
        "keyConcept": "Duty (D) is the area of crop in hectares that can be irrigated by a continuous discharge of 1 cumec throughout the base period (B days). Delta (Delta) is total depth of water required by the crop over its base period. The core mathematical identity connects volume of water supplied to area irrigated.",
        "pointers": [
          "Core Formula: Delta (meters) = (8.64 * B) / D, where B is in days and D is in hectares/cumec.",
          "If Delta is expressed in centimeters: Delta (cm) = (864 * B) / D.",
          "Duty increases downstream: Duty is lowest at canal head/divergence and highest at the farmer's field (outlet) because water conveyance losses decrease towards the tail end.",
          "Paleo Irrigation: First watering applied to land before sowing crop seeds to prepare moist seedbeds.",
          "Kor Watering: First watering given to a crop when plants are a few centimeters high; requires maximum depth in minimum time (Kor depth and Kor period determine design canal capacity!).",
          "Consumptive Irrigation Requirement (CIR) = Consumptive use (Cu) - Effective rainfall (Re)."
        ],
        "formulaOrCode": "\\Delta (m) = \\frac{8.64 \\times B (\\text{days})}{D (\\text{ha/cumec})} \\quad ; \\quad \\Delta (cm) = \\frac{864 \\times B}{D} \\quad ; \\quad CIR = C_u - R_e",
        "highYieldFacts": [
          "Rice has the highest Delta (~120 cm; base period ~120 days; duty ~860 ha/cumec).",
          "Sugarcane has highest total water requirement (~180 cm; base period 360 days).",
          "1 cumec-day of water = 1 m3/s * 86,400 s = 86,400 m3 = 8.64 hectare-meters.",
          "Water conveyance efficiency eta_c = (Water delivered to field / Water diverted into canal) * 100."
        ],
        "examTrap": "Duty is inversely proportional to Delta. Where water losses are high (canal head), Duty is minimum. At the field outlet, Duty is maximum. Do not reverse this!",
        "benchmarkExample": {
          "question": "A crop with a base period of 120 days requires a total depth of water (Delta) of 96 cm. Find the duty of canal water at the field outlet in hectares/cumec.",
          "options": [
            "860 ha/cumec",
            "1080 ha/cumec",
            "1200 ha/cumec",
            "1440 ha/cumec"
          ],
          "correctAnswer": "1080 ha/cumec",
          "stepByStepSolution": [
            "Step 1: Formula for Delta in cm: Delta = (864 * B) / D.",
            "Step 2: Rearrange for Duty D: D = (864 * B) / Delta.",
            "Step 3: Substitute values: D = (864 * 120) / 96.",
            "Step 4: D = 103,680 / 96 = 1080 ha/cumec."
          ],
          "takeaway": "Duty D = 864 * B / Delta(cm) = 864 * 120 / 96 = 1080 ha/cumec."
        }
      },
      {
        "stepNumber": 2,
        "stepTitle": "Lacey's Regime Theory vs Kennedy's Silt Theory",
        "subtitle": "Regime conditions, silt factor, wetted perimeter, and bed slope formulas",
        "keyConcept": "Kennedy assumed silt is held in suspension only by vertical eddies generated from the canal bed (neglecting side friction). Gerald Lacey established that silt is generated from the whole wetted perimeter (bed and sides), formulating empirical relationships for true regime channels where silt charge and silt grade are in equilibrium.",
        "pointers": [
          "Lacey's Silt Factor: f = 1.76 * sqrt(d_mm), where d_mm is average particle diameter in mm.",
          "Regime Velocity: V = [ (Q * f^2) / 140 ]^(1/6).",
          "Hydraulic Radius: R = (5/2) * (V^2 / f).",
          "Wetted Perimeter: P = 4.75 * sqrt(Q). Note: Lacey's wetted perimeter depends strictly on discharge Q and is completely independent of silt factor f!",
          "Regime Bed Slope: S = [ f^(5/3) ] / [ 3340 * Q^(1/6) ].",
          "Lacey's Regime states: Initial regime (only bed slope adjusts), True regime (slope, perimeter, and depth adjust freely), Final regime (channel reaches ultimate equilibrium)."
        ],
        "formulaOrCode": "f = 1.76 \\sqrt{d_{mm}} \\quad ; \\quad P = 4.75 \\sqrt{Q} \\quad ; \\quad V = \\left(\\frac{Q f^2}{140}\\right)^{1/6} \\quad ; \\quad S = \\frac{f^{5/3}}{3340 Q^{1/6}}",
        "highYieldFacts": [
          "Lacey's wetted perimeter P = 4.75 * sqrt(Q) is independent of silt factor f.",
          "Lacey's cross section in regime is semi-elliptical in shape (approaching parabolic).",
          "Kennedy used Kutter's formula for velocity, whereas Lacey derived independent flow equations.",
          "For standard medium silt (d = 0.32 mm), Lacey's silt factor f = 1.0."
        ],
        "examTrap": "Candidates frequently think wetted perimeter depends on silt factor. It does NOT! P = 4.75 sqrt(Q). Silt factor affects velocity, depth, and bed slope, but NOT perimeter.",
        "benchmarkExample": {
          "question": "Calculate the wetted perimeter of a stable regime channel carrying a discharge of 64 cumecs as per Lacey's theory.",
          "options": [
            "19.0 m",
            "28.5 m",
            "38.0 m",
            "47.5 m"
          ],
          "correctAnswer": "38.0 m",
          "stepByStepSolution": [
            "Step 1: Formula for wetted perimeter: P = 4.75 * sqrt(Q).",
            "Step 2: Q = 64 cumecs => sqrt(64) = 8.",
            "Step 3: P = 4.75 * 8 = 38.0 m."
          ],
          "takeaway": "P = 4.75 * sqrt(Q) = 4.75 * 8 = 38 m."
        }
      },
      {
        "stepNumber": 3,
        "stepTitle": "Unit Hydrograph Theory & S-Curve Synthesis",
        "subtitle": "Sherman's principles of linearity, time invariance, and derivation of longer/shorter durations",
        "keyConcept": "A Unit Hydrograph (UH) is the direct runoff hydrograph (DRH) resulting from 1 cm (or 1 mm) of excess rainfall occurring uniformly over the entire watershed at a constant rate for a specified unit duration D hours. It obeys two fundamental postulates: Linear Response (proportionality) and Time Invariance.",
        "pointers": [
          "Linearity Postulate: If rainfall excess of depth R cm occurs in D hours, direct runoff ordinates equal R * (UH ordinates).",
          "Time Invariance: Runoff response for a given rainfall pattern is identical whenever it occurs.",
          "Area Under Unit Hydrograph: Volume under DRH = Area of catchment A * 1 cm rainfall excess = 10,000 * A m3.",
          "S-Curve Hydrograph: Represents continuous cumulative direct runoff generated from a continuous rainfall excess of 1 cm every D hours. Equilibrium discharge S_e = 2.778 * A / D (cumecs, with A in km2, D in hours).",
          "To convert a D-hour UH to a T-hour UH: Use S-curve method by lagging S-curve by T hours and multiplying ordinate differences by (D / T)."
        ],
        "formulaOrCode": "V = 0.01 \\times A \\text{ (m}^3\\text{)} \\quad ; \\quad S_e = \\frac{2.778 \\times A (\\text{km}^2)}{D (\\text{hr})} \\quad ; \\quad UH_{T} = \\frac{D}{T} (S_t - S_{t-T})",
        "highYieldFacts": [
          "Unit Hydrograph is valid only for catchments between 50 km2 and 5000 km2. For smaller catchments (<50 km2), overland flow dominates. For larger (>5000 km2), spatial rainfall uniformity breaks down.",
          "Base flow must always be deducted from flood hydrograph to obtain Direct Runoff Hydrograph (DRH).",
          "Peak of UH is inversely related to unit duration D (shorter duration produces sharper, higher peak)."
        ],
        "examTrap": "The Unit Hydrograph accounts ONLY for Direct Runoff (surface runoff + interflow). Base flow is NOT part of the Unit Hydrograph and must be subtracted before analysis!",
        "benchmarkExample": {
          "question": "A 4-hour unit hydrograph of a catchment of area 360 km\u00b2 has a peak of 60 m\u00b3/s. What is the total volume of direct runoff represented by this unit hydrograph?",
          "options": [
            "1.8 \u00d7 10^6 m\u00b3",
            "3.6 \u00d7 10^6 m\u00b3",
            "7.2 \u00d7 10^6 m\u00b3",
            "14.4 \u00d7 10^6 m\u00b3"
          ],
          "correctAnswer": "3.6 \u00d7 10^6 m\u00b3",
          "stepByStepSolution": [
            "Step 1: By definition, a unit hydrograph represents 1 cm (0.01 m) of rainfall excess over the entire catchment.",
            "Step 2: Catchment Area A = 360 km\u00b2 = 360 * 10^6 m\u00b2.",
            "Step 3: Volume V = Depth * Area = 0.01 m * (360 * 10^6 m\u00b2) = 3.60 * 10^6 m\u00b3."
          ],
          "takeaway": "Direct runoff volume for 1 cm UH is always Area(m\u00b2) * 0.01 m."
        }
      }
    ],
    "topicQuestions": [
      {
        "id": "ce-q-061",
        "sourceType": "MODELLED",
        "stem": "In SI units, Manning's equation for uniform flow velocity (V) in an open channel of hydraulic radius R and bed slope S is:",
        "options": [
          {
            "id": "A",
            "text": "V = (1 / n) \u00b7 R^(2/3) \u00b7 S^(1/2)"
          },
          {
            "id": "B",
            "text": "V = (1 / n) \u00b7 R^(1/2) \u00b7 S^(2/3)"
          },
          {
            "id": "C",
            "text": "V = n \u00b7 R^(2/3) \u00b7 S^(1/2)"
          },
          {
            "id": "D",
            "text": "V = (1 / n) \u00b7 R^(3/4) \u00b7 S^(1/2)"
          }
        ],
        "correctOption": "A",
        "explanation": "Robert Manning's empirical formula for uniform flow velocity is V = (1/n) \u00b7 R^(2/3) \u00b7 S^(1/2), where n is Manning's roughness coefficient, R is hydraulic radius (Area / Wetted Perimeter), and S is longitudinal bed slope.",
        "formulaContext": "V = (1 / n) \u00b7 R^(2/3) \u00b7 S^(1/2)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Open Channel Flow",
        "subtopic": "Manning's Formula"
      },
      {
        "id": "ce-q-062",
        "sourceType": "MODELLED",
        "stem": "For a rectangular open channel carrying discharge q per unit width, the critical depth (yc) is given by:",
        "options": [
          {
            "id": "A",
            "text": "yc = (q\u00b2 / g)^(1/3)"
          },
          {
            "id": "B",
            "text": "yc = (q / g)^(1/2)"
          },
          {
            "id": "C",
            "text": "yc = (q\u00b2 / g)^(1/2)"
          },
          {
            "id": "D",
            "text": "yc = (q / g\u00b2)^(1/3)"
          }
        ],
        "correctOption": "A",
        "explanation": "At critical flow condition, specific energy is minimum for a given discharge, giving Froude number Fr = v / \u221a(g yc) = 1. Substituting v = q / yc leads directly to yc\u00b3 = q\u00b2 / g => yc = (q\u00b2 / g)^(1/3). Minimum specific energy Emin = 1.5 yc.",
        "formulaContext": "yc = (q\u00b2 / g)^(1/3); Froude number Fr = 1 at critical depth",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2023",
        "topic": "Open Channel Flow",
        "subtopic": "Critical Depth in Rectangular Channel"
      },
      {
        "id": "ce-q-063",
        "sourceType": "MODELLED",
        "stem": "The relationship between pre-jump depth (y1) and post-jump sequent depth (y2) in a horizontal rectangular channel with initial Froude number Fr1 is:",
        "options": [
          {
            "id": "A",
            "text": "y2 / y1 = 0.5 \u00b7 [\u221a(1 + 8 \u00b7 Fr1\u00b2) - 1]"
          },
          {
            "id": "B",
            "text": "y2 / y1 = 0.5 \u00b7 [\u221a(1 + 8 \u00b7 Fr1\u00b2) + 1]"
          },
          {
            "id": "C",
            "text": "y2 / y1 = \u221a(1 + 8 \u00b7 Fr1\u00b2)"
          },
          {
            "id": "D",
            "text": "y2 / y1 = 0.5 \u00b7 [\u221a(1 + 4 \u00b7 Fr1\u00b2) - 1]"
          }
        ],
        "correctOption": "A",
        "explanation": "Applying momentum equation across the hydraulic jump in a rectangular channel yields Belanger's equation: y2 / y1 = 0.5 \u00b7 (\u221a(1 + 8 Fr1\u00b2) - 1). Energy loss in jump is \u0394E = (y2 - y1)\u00b3 / (4 y1 y2).",
        "formulaContext": "y2 / y1 = 0.5 \u00b7 [\u221a(1 + 8 \u00b7 Fr1\u00b2) - 1] (Belanger equation)",
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Open Channel Flow",
        "subtopic": "Hydraulic Jump Sequent Depths"
      },
      {
        "id": "ce-q-064",
        "sourceType": "MODELLED",
        "stem": "The specific speed (Ns) of a hydraulic turbine generating power P under head H at rotational speed N is defined as:",
        "options": [
          {
            "id": "A",
            "text": "Ns = N \u00b7 \u221aP / H^(5/4)"
          },
          {
            "id": "B",
            "text": "Ns = N \u00b7 \u221aP / H^(3/4)"
          },
          {
            "id": "C",
            "text": "Ns = N \u00b7 \u221aQ / H^(3/4)"
          },
          {
            "id": "D",
            "text": "Ns = N \u00b7 P\u00b2 / H^(5/4)"
          }
        ],
        "correctOption": "A",
        "explanation": "Turbine specific speed is Ns = N \u221aP / H^(5/4). For Pelton wheel: Ns = 10-35 (low). For Francis turbine: Ns = 60-300 (medium). For Kaplan turbine: Ns = 300-1000 (high specific speed under low head).",
        "formulaContext": "Ns(turbine) = N \u00b7 \u221aP / H^(5/4); Ns(pump) = N \u00b7 \u221aQ / H^(3/4)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2021",
        "topic": "Hydraulic Machines",
        "subtopic": "Specific Speed of Turbines"
      },
      {
        "id": "ce-q-057",
        "sourceType": "MODELLED",
        "stem": "The vertical distance between the Total Energy Line (TEL) and Hydraulic Gradient Line (HGL) at any cross-section of a pipe flow represents the:",
        "options": [
          {
            "id": "A",
            "text": "Pressure head (p / \u03b3)"
          },
          {
            "id": "B",
            "text": "Velocity head (v\u00b2 / 2g)"
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
        "explanation": "Total Energy Line = p/\u03b3 + z + v\u00b2/2g. Hydraulic Gradient Line = p/\u03b3 + z. The difference between TEL and HGL is strictly the kinetic velocity head v\u00b2 / (2g).",
        "formulaContext": "TEL - HGL = v\u00b2 / (2g)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2021",
        "topic": "Fluid Dynamics",
        "subtopic": "HGL and TEL Relationship"
      },
      {
        "id": "ce-q-058",
        "sourceType": "MODELLED",
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
        "explanation": "Due to smooth streamlined gradual convergence and divergence in a venturimeter, boundary layer separation and eddy losses are minimal, yielding Cd = 0.96 to 0.98. Orifice meters have sudden contraction with vena contracta, giving Cd \u2248 0.60 - 0.65.",
        "formulaContext": "Cd(venturi) \u2248 0.96 - 0.98 vs Cd(orifice) \u2248 0.60 - 0.65",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2023",
        "topic": "Flow Measurement",
        "subtopic": "Venturimeter Discharge Coefficient"
      }
    ],
    "unitName": "Water Resources & Fluid Mechanics",
    "codeClause": "IS 6512:1984, CWC Guidelines",
    "confidencePercent": 50,
    "masteredStatus": "Needs Practice",
    "diagramType": "fluids",
    "subtopicList": [
      "Hydrologic Cycle, Precipitation & Infiltration Indices (phi, W)",
      "Sherman's Unit Hydrograph & S-Curve Technique",
      "Canal Design: Lacey's Regime vs Kennedy Silt Theory",
      "Gravity Dam Stability & Elementary Profile",
      "Diversion Headworks & Khosla's Independent Variables"
    ],
    "comparisonGrid": {
      "titleLeft": "Kennedy's Silt Theory",
      "tagLeft": "Bed Eddies Only",
      "valueLeft": "vc = 0.55 \u00b7 m \u00b7 y^0.64",
      "descLeft": "Assumes silt is held in suspension only by vertical eddies generated from the horizontal canal bed. Critical velocity ratio m used.",
      "titleRight": "Lacey's Regime Theory",
      "tagRight": "All Wetted Perimeter",
      "valueRight": "v = (f\u00b2\u00b7q / 140)^(1/6)",
      "descRight": "Assumes silt-supporting eddies are generated from the entire wetted perimeter. P = 4.75 \u221aQ, S = f^(5/3) / (3340 Q^(1/6))."
    },
    "callouts": {
      "corePostulate": "A Unit Hydrograph represents the direct runoff hydrograph resulting from 1 cm (or 1 unit) of effective rainfall occurring uniformly over a catchment at a constant rate during a specified duration.",
      "corePostulateRef": "Sherman (1932)",
      "examTrap": "Duty D (ha/cumec) and Delta \u0394 (meters) relationship is \u0394 = (8.64 \u00b7 B) / D, where B is the base period in days. Delta is MAXIMUM at the head of the main canal!",
      "examTrapRef": "APSC AE & SSC JE",
      "testedRatios": [
        {
          "label": "Lacey's Silt Factor:",
          "value": "f = 1.76 \u00b7 \u221ad_mm"
        },
        {
          "label": "Lacey's Wetted Perimeter:",
          "value": "P = 4.75 \u00b7 \u221aQ"
        },
        {
          "label": "Lacey's Hydraulic Radius:",
          "value": "R = (5/2) \u00b7 (v\u00b2 / f)"
        },
        {
          "label": "Gravity Dam Elementary Base:",
          "value": "B = H / \u221a(G - c)"
        }
      ],
      "numericalShortcut": {
        "formula": "Khosla's Exit Gradient GE = (H / d) \u00b7 (1 / (pi \u00b7 \u221alambda))",
        "note": "Where lambda = (1 + \u221a(1 + alpha\u00b2)) / 2 and alpha = b / d. To prevent piping, exit gradient must be safe (e.g. 1/5 to 1/6 for fine sand)."
      }
    },
    "aiTutorPrompts": [
      {
        "question": "How do you derive an S-curve from a Unit Hydrograph?",
        "answerPreview": "An S-curve is formed by adding a series of identical Unit Hydrographs of duration D spaced at intervals of D. It gives the continuous equilibrium runoff under constant 1 cm/D rainfall rate."
      },
      {
        "question": "What are the causes of waterlogging in agricultural soils?",
        "answerPreview": "Over-irrigation, seepage from unlined canals, inadequate surface/subsurface drainage, and obstruction of natural drainage pathways raise the water table into the root zone, suffocating crops."
      }
    ]
  },
  {
    "id": "civil-prestressed",
    "title": "Prestressed Concrete: Systems, Losses & Load Balancing",
    "subject": "Prestressed Concrete",
    "category": "civil",
    "readTime": "18 min read",
    "weightage": "MEDIUM",
    "icon": "Layers",
    "summary": "High-strength materials, pre-tensioning vs post-tensioning, Freyssinet and Magnel systems, 6 types of prestress loss, and Lin's load balancing concept.",
    "fullDescription": "Prestressed Concrete introduces engineered compressive stresses into concrete prior to service loads to neutralize tensile bending stresses. IS 1343:2012 governs prestressed structural members used in long-span bridges, flyovers, and industrial roof girders.",
    "syllabusCoverage": [
      "Principles & Philosophy of Prestressing (High strength concrete M30/M40+, High tensile steel 1500-1800 MPa)",
      "Pre-tensioning (Hoyer System) vs Post-tensioning (Freyssinet, Magnel-Blaton, Gifford-Udall, Lee-McCall)",
      "Losses of Prestress: Elastic Shortening, Friction & Wobble Effect, Anchorage Slip",
      "Time-Dependent Losses: Creep of Concrete, Shrinkage of Concrete, Relaxation of Steel",
      "Stress Calculations at Transfer and Service Loads (Kern points, P/A +/- Pe/Z +/- M/Z)",
      "Lin's Load Balancing Concept (Parabolic, Bent, and Straight Tendons)"
    ],
    "prerequisites": [
      "Mechanics of Materials",
      "RCC IS 456"
    ],
    "standardReferences": [
      "IS 1343:2012 Prestressed Concrete",
      "N. Krishna Raju Prestressed Concrete",
      "T.Y. Lin Design of Prestressed Concrete"
    ],
    "practiceQuestionIds": [
      "ce-q-014",
      "ce-q-001",
      "ce-q-002",
      "ce-q-003",
      "ce-q-012"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "stepTitle": "Materials & Systems of Prestressing",
        "subtitle": "High-tensile wire strands, Hoyer system, and mechanical anchorages",
        "keyConcept": "Prestressing requires high-strength concrete (minimum M40 for pre-tensioning, M30 for post-tensioning per IS 1343) and high-tensile steel (f_u = 1500 to 1800 MPa). Mild steel cannot be used because prestress losses (~150 to 200 MPa) would completely wipe out any prestrain!",
        "pointers": [
          "Pre-tensioning: Tendons tensioned against external abutments BEFORE concrete is poured. Prestress transferred entirely by BOND stress when concrete cures.",
          "Post-tensioning: Tendons inserted in ducts and tensioned AFTER concrete achieves strength. Prestress transferred through end anchorages.",
          "Freyssinet System: Uses conical central female cone and male grooved plug wedging 12 to 24 high-tensile wires simultaneously.",
          "Magnel-Blaton System: Uses flat steel wedge plates holding pairs of wires in sandwich plates.",
          "Lee-McCall System: Uses high-strength alloy steel bars with threaded nut anchorages (no friction loss in straight bar).",
          "Gifford-Udall System: Single wire tensioning system using split conical wedges."
        ],
        "formulaOrCode": "\\text{Minimum Concrete Grade (IS 1343:2012):}\\quad \\text{Pre-tensioned} \\ge M40 \\quad ; \\quad \\text{Post-tensioned} \\ge M30",
        "highYieldFacts": [
          "Mild steel CANNOT be used in prestressing because creep and shrinkage losses (~15-20%) exceed total elastic strain of mild steel!",
          "Transmission length in pre-tensioned members is embedment length needed to develop full prestress by bond (typically 50 to 100 bar diameters).",
          "Prestressing reduces diagonal tension shear cracks by creating horizontal compression that flattens principal stress trajectories."
        ],
        "examTrap": "Minimum concrete grade: Pre-tensioned = M40; Post-tensioned = M30. Candidates often reverse these two numbers!",
        "benchmarkExample": {
          "question": "What is the minimum grade of concrete permitted by IS 1343:2012 for post-tensioned prestressed concrete members?",
          "options": [
            "M20",
            "M25",
            "M30",
            "M40"
          ],
          "correctAnswer": "M30",
          "stepByStepSolution": [
            "Step 1: Check IS 1343:2012 requirements for concrete grades.",
            "Step 2: For pre-tensioned concrete, minimum grade is M40.",
            "Step 3: For post-tensioned concrete, minimum grade is M30."
          ],
          "takeaway": "Minimum grade: Pre-tensioned = M40; Post-tensioned = M30."
        }
      },
      {
        "stepNumber": 2,
        "stepTitle": "The 6 Losses of Prestress",
        "subtitle": "Immediate losses (elastic, friction, slip) and time-dependent losses (creep, shrinkage, relaxation)",
        "keyConcept": "Prestressing force decreases over time due to 6 distinct mechanisms. Total loss is typically 18-20% in pre-tensioned members and 15-18% in post-tensioned members.",
        "pointers": [
          "Loss due to Elastic Shortening: Loss = m * f_c (where m = E_s / E_c is modular ratio, f_c is concrete stress at tendon level). For post-tensioned members tensioned simultaneously, elastic shortening loss is ZERO!",
          "Loss due to Friction & Wobble: P_x = P_0 * (1 - mu * alpha - k * x), where mu is curvature friction coefficient, alpha is angular change, k is wobble coefficient.",
          "Loss due to Anchorage Slip: Loss = (Delta_L / L) * E_s.",
          "Loss due to Creep of Concrete: Loss = m * theta * f_c (where theta is creep coefficient).",
          "Loss due to Shrinkage of Concrete: Loss = epsilon_cs * E_s. For pre-tensioned: epsilon_cs = 0.0003; for post-tensioned: epsilon_cs = 0.0002 / log10(t + 2).",
          "Loss due to Relaxation of Steel: 2% to 5% of initial prestress depending on initial stress ratio."
        ],
        "formulaOrCode": "\\text{Elastic Loss} = m f_c \\quad ; \\quad \\text{Slip Loss} = \\frac{\\Delta L}{L} E_s \\quad ; \\quad \\text{Shrinkage Loss} = \\epsilon_{cs} E_s",
        "highYieldFacts": [
          "Elastic shortening loss occurs in PRE-TENSIONED members, but is ZERO in post-tensioned members if all cables are tensioned simultaneously!",
          "Friction loss occurs ONLY in post-tensioned members with curved ducts; ZERO in straight pre-tensioned wires.",
          "Anchorage slip occurs ONLY in post-tensioned members; ZERO in pre-tensioned members."
        ],
        "examTrap": "Which losses occur ONLY in post-tensioned? Friction loss and Anchorage slip loss! Which occurs ONLY in pre-tensioning? Elastic shortening (when post-tensioned cables are tensioned all at once).",
        "benchmarkExample": {
          "question": "A post-tensioned cable of length 30 m experiences an anchorage slip of 3 mm at the jacking end. If Es = 200 GPa, what is the loss of stress due to anchorage slip?",
          "options": [
            "10 MPa",
            "20 MPa",
            "30 MPa",
            "40 MPa"
          ],
          "correctAnswer": "20 MPa",
          "stepByStepSolution": [
            "Step 1: Formula for loss of stress: Delta_sigma = (Delta_L / L) * E_s.",
            "Step 2: Delta_L = 3 mm, L = 30 m = 30,000 mm.",
            "Step 3: Strain loss = 3 / 30,000 = 1 / 10,000 = 0.0001.",
            "Step 4: Stress loss = 0.0001 * (200,000 N/mm\u00b2) = 20 N/mm\u00b2 = 20 MPa."
          ],
          "takeaway": "Slip loss = (Delta_L / L) * E_s = (3 / 30000) * 200,000 = 20 MPa."
        }
      },
      {
        "stepNumber": 3,
        "stepTitle": "Lin's Load Balancing Concept",
        "subtitle": "Equivalent upward transverse forces from curved and draped tendons",
        "keyConcept": "T.Y. Lin introduced the elegant concept that a draped or parabolic prestressing tendon exerts a continuous upward vertical force along its span that can directly counterbalance downward gravitational external loads, transforming the beam into an axial compression member under balanced load.",
        "pointers": [
          "Parabolic Cable with sag 'e': Upward uniform load exerted by tendon is w_up = (8 * P * e) / L\u00b2.",
          "If external load w_ext exactly equals w_up, the section is subjected to pure axial compression with zero bending moment everywhere!",
          "Bent Tendon with central eccentricity 'e': Exerts an upward concentrated load at the kink point: W_up = (4 * P * e) / L.",
          "Under balanced load condition, net deflection at midspan is identically ZERO."
        ],
        "formulaOrCode": "w_{up} = \\frac{8 P e}{L^2} \\quad (\\text{Parabolic Cable}) \\quad ; \\quad W_{up} = \\frac{4 P e}{L} \\quad (\\text{Bent Cable at Midspan})",
        "highYieldFacts": [
          "When w_ext = w_up, the beam behaves as an axially loaded column with uniform stress f = P / A.",
          "Resultant concrete stress at any fiber: f = (P/A) +/- (P*e/Z) -/+ (M_dead/Z) -/+ (M_live/Z).",
          "Kern distance for rectangular section (b x D): k_top = k_bottom = D / 6."
        ],
        "examTrap": "In w_up = 8Pe / L\u00b2, 'e' is the central sag/eccentricity measured from the chord connecting the cable ends, NOT the total depth of the beam!",
        "benchmarkExample": {
          "question": "A prestressed concrete beam of span 10 m carries a parabolic tendon with prestressing force P = 500 kN and central sag e = 100 mm (0.1 m). What is the upward balanced load w_up?",
          "options": [
            "2 kN/m",
            "4 kN/m",
            "8 kN/m",
            "10 kN/m"
          ],
          "correctAnswer": "4 kN/m",
          "stepByStepSolution": [
            "Step 1: Formula for upward load: w_up = (8 * P * e) / L\u00b2.",
            "Step 2: P = 500 kN, e = 0.1 m, L = 10 m.",
            "Step 3: w_up = (8 * 500 * 0.1) / (10)\u00b2 = 400 / 100 = 4.0 kN/m."
          ],
          "takeaway": "w_up = 8 P e / L\u00b2 = 8 * 500 * 0.1 / 100 = 4.0 kN/m."
        }
      }
    ],
    "topicQuestions": [
      {
        "id": "ce-q-014",
        "sourceType": "MODELLED",
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
        "explanation": "In pre-tensioning, tendons are stressed before concrete is poured and there are no ducts or curved profiles involving duct friction. Hence friction and wobble losses occur strictly in post-tensioned members.",
        "formulaContext": "Friction loss occurs only in curved post-tensioned ducts (IS 1343)",
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Prestressing Losses",
        "subtopic": "Losses in Pre-tensioned vs Post-tensioned"
      },
      {
        "id": "ce-q-001",
        "sourceType": "MODELLED",
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
        "explanation": "According to IS 456:2000 Clause 38.1 Note, linear strain compatibility gives xu,max/d = 0.53 for Fe 250, 0.48 for Fe 415, 0.46 for Fe 500, and 0.44 for Fe 550.",
        "formulaContext": "xu,max / d = 0.0035 / (0.0055 + 0.87 * fy / Es)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Limit State Design \u2014 Flexure",
        "subtopic": "Limiting Neutral Axis Depth"
      },
      {
        "id": "ce-q-002",
        "sourceType": "MODELLED",
        "stem": "The development length (Ld) of a tension reinforcing bar of nominal diameter \u03c6 is given by IS 456:2000 as:",
        "options": [
          {
            "id": "A",
            "text": "Ld = (\u03c6 \u00b7 \u03c3s) / (2 \u00b7 \u03c4bd)"
          },
          {
            "id": "B",
            "text": "Ld = (\u03c6 \u00b7 \u03c3s) / (4 \u00b7 \u03c4bd)"
          },
          {
            "id": "C",
            "text": "Ld = (\u03c6 \u00b7 \u03c3s) / (8 \u00b7 \u03c4bd)"
          },
          {
            "id": "D",
            "text": "Ld = (2 \u00b7 \u03c6 \u00b7 \u03c3s) / (3 \u00b7 \u03c4bd)"
          }
        ],
        "correctOption": "B",
        "explanation": "Per IS 456:2000 Cl. 26.2.1, equating tensile bar force to bond resistance yields Ld = (\u03c6 \u00b7 \u03c3s) / (4 \u00b7 \u03c4bd). For deformed bars (HYSD), \u03c4bd is increased by 60%. For bars in compression, \u03c4bd is increased by 25%.",
        "formulaContext": "Ld = (\u03c6 \u00b7 \u03c3s) / (4 \u00b7 \u03c4bd)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2023",
        "topic": "Shear and Bond",
        "subtopic": "Development Length"
      },
      {
        "id": "ce-q-003",
        "sourceType": "MODELLED",
        "stem": "As per IS 456:2000, the minimum area of tension reinforcement in a rectangular beam shall not be less than:",
        "options": [
          {
            "id": "A",
            "text": "As / (b \u00b7 d) = 0.85 / fy"
          },
          {
            "id": "B",
            "text": "As / (b \u00b7 d) = 0.40 / fy"
          },
          {
            "id": "C",
            "text": "As / (b \u00b7 D) = 0.12%"
          },
          {
            "id": "D",
            "text": "As / (b \u00b7 d) = 0.04 \u00b7 b \u00b7 d"
          }
        ],
        "correctOption": "A",
        "explanation": "IS 456:2000 Clause 26.5.1.1 specifies that the minimum area of tension reinforcement in beams is As,min = (0.85 \u00b7 b \u00b7 d) / fy, where b is width of beam, d is effective depth, and fy is characteristic steel strength.",
        "formulaContext": "As,min / (b \u00b7 d) = 0.85 / fy",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2022",
        "topic": "Beams & Slabs",
        "subtopic": "Minimum Tensile Reinforcement"
      },
      {
        "id": "ce-q-012",
        "sourceType": "MODELLED",
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
        "explanation": "Clause 26.4.2.2 and Table 16 specify that the minimum nominal cover for footings is 50 mm. When concrete is placed directly against untreated soil without blinding layer, cover is commonly increased to 75 mm.",
        "formulaContext": "Footing nominal cover = 50 mm",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Detailing of Reinforcement",
        "subtopic": "Nominal Cover for Footing"
      }
    ],
    "unitName": "Structural Engineering",
    "codeClause": "IS 1343:2012 Cl. 6, 19",
    "confidencePercent": 55,
    "masteredStatus": "Needs Practice",
    "diagramType": "rcc",
    "subtopicList": [
      "Prestressing Systems (Freyssinet, Magnel, Gifford-Udall)",
      "Losses of Prestress (Elastic, Creep, Shrinkage, Relaxation)",
      "Load Balancing Parabolic Profile",
      "End Block Anchorage Zone Stresses"
    ],
    "comparisonGrid": {
      "titleLeft": "Pre-Tensioning System",
      "tagLeft": "Losses \u2248 18%",
      "valueLeft": "fci \u2265 40 MPa",
      "descLeft": "Tendons tensioned before concrete is placed; stress transferred purely through bond length. High initial strength required.",
      "titleRight": "Post-Tensioning System",
      "tagRight": "Losses \u2248 15%",
      "valueRight": "fci \u2265 30 MPa",
      "descRight": "Tendons jacked through ducts against hardened concrete; anchored mechanically by wedges or bearing plates."
    },
    "callouts": {
      "corePostulate": "Loss of prestress due to elastic shortening occurs in pre-tensioning always; in post-tensioning it occurs ONLY if tendons are tensioned sequentially one by one.",
      "corePostulateRef": "IS 1343:2012 Cl. 19.5.2",
      "examTrap": "In load balancing, an upward parabolic tendon provides a uniform upward load w_up = 8 P e / L\u00b2. Do not forget that eccentricity e is measured at midspan!",
      "examTrapRef": "APSC AE 2020 & GATE Civil",
      "testedRatios": [
        {
          "label": "Elastic Shortening Loss (Pre):",
          "value": "m \u00b7 fc = (Es / Ec) \u00b7 fc"
        },
        {
          "label": "Shrinkage Strain (Pre-tensioned):",
          "value": "0.0003"
        },
        {
          "label": "Shrinkage Strain (Post-tensioned):",
          "value": "0.0002 / log10(t + 2)"
        }
      ],
      "numericalShortcut": {
        "formula": "Friction & Wobble Loss = P0 \u00b7 (mu \u00b7 alpha + k \u00b7 x)",
        "note": "Where mu = coefficient of friction, alpha = cumulative angle change, and k = wobble factor per meter length."
      }
    },
    "aiTutorPrompts": [
      {
        "question": "How does the load balancing method work for parabolic tendons?",
        "answerPreview": "A parabolic tendon with sag e under prestress P exerts an upward uniform force w = 8 P e / L\u00b2. If designed to equal the dead load, the beam is free from bending moments and deflection under self-weight."
      },
      {
        "question": "What causes anchorage slip loss?",
        "answerPreview": "When the prestressing jack releases, the wedges slide slightly into the duct before gripping, causing loss Delta L. Loss in stress = (Delta L * Es) / L."
      }
    ]
  },
  {
    "id": "civil-estimating-costing",
    "title": "Estimating, Costing & Valuation: Methods & Contracts",
    "subject": "Estimating & Costing",
    "category": "civil",
    "readTime": "18 min read",
    "weightage": "CORE",
    "icon": "Briefcase",
    "summary": "Building estimating methods (center line, long-short wall), rate analysis, standard specifications, valuation (sinking fund, depreciation, capitalized value), and contracts.",
    "fullDescription": "Estimating, Costing, and Valuation bridges structural engineering with financial execution. It deals with quantitative takeoff, rate analysis based on CPWD/State PWD schedules, depreciation valuation methods, and standard contract tendering procedures.",
    "syllabusCoverage": [
      "Methods of Building Estimation (Center Line Method, Long Wall-Short Wall Method)",
      "Units of Measurement per IS 1200 (Excavation, Concrete, Formwork, Brickwork, Plastering, Steel)",
      "Analysis of Rates (Labor Constants, Material Constants, Contractor Profit 10%, Water Charges 1.5%)",
      "Valuation Principles (Capitalized Value, Year's Purchase, Scrap Value, Salvage Value)",
      "Depreciation Methods (Straight Line Method, Constant Percentage Method, Sinking Fund Method)",
      "Contracts & Tendering (Lump Sum, Item Rate, Percentage Rate, Cost Plus, EMD 1-2%, Security Deposit 10%)"
    ],
    "prerequisites": [
      "Building Construction",
      "Basic Economics"
    ],
    "standardReferences": [
      "IS 1200 Method of Measurement",
      "B.N. Dutta Estimating and Costing in Civil Engineering",
      "CPWD Works Manual"
    ],
    "practiceQuestionIds": [
      "ce-ec-q1",
      "ce-ec-q2",
      "ce-ec-q3",
      "ce-ec-q4"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "stepTitle": "Methods of Building Measurement & IS 1200 Rules",
        "subtitle": "Center line method, Long wall-Short wall method, and deduction rules",
        "keyConcept": "In the Center Line Method, total center line length of walls is calculated and multiplied by width and height for quantity takeoff. When walls intersect (T-junctions), half the wall thickness (d/2) must be subtracted from the total center line length for EACH junction to avoid double-counting.",
        "pointers": [
          "Center line reduction for T-junction: Net length = Total centerline length - (N * d / 2), where N is number of T-junctions and d is wall thickness.",
          "For an L-junction (corner): NO reduction is made (corners fit exactly).",
          "For a cross junction (X-junction): Subtract 2 * (d / 2) = d.",
          "Long Wall-Short Wall Method: Long wall length out-to-out = Center line length + 2 * (d / 2) = C/L + d. Short wall in-to-in = C/L - d.",
          "IS 1200 Deductions for Masonry Openings: (1) No deduction for openings up to 0.1 m\u00b2 (1000 cm\u00b2); (2) Deduction for openings 0.1 m\u00b2 to 0.5 m\u00b2 for masonry only (no deduction for lintel bearing); (3) For openings > 0.5 m\u00b2, full deduction made for both face and lintel bearing."
        ],
        "formulaOrCode": "\\text{Net Length (C/L)} = L_{\\text{total}} - \\left(N_{\\text{T-junctions}} \\times \\frac{d}{2}\\right) \\quad ; \\quad L_{\\text{Long}} = L_{cl} + d \\quad ; \\quad L_{\\text{Short}} = L_{cl} - d",
        "highYieldFacts": [
          "Plastering deductions per IS 1200: No deduction for opening < 0.5 m\u00b2; 50% deduction for opening 0.5 m\u00b2 to 3 m\u00b2 (deducted from one face only); 100% deduction for opening > 3 m\u00b2 (deducted from both faces, jambs added).",
          "Units of measurement: Earthwork in excavation = m\u00b3; Brickwork in superstructure = m\u00b3; Half-brick wall / partition wall = m\u00b2; Damp Proof Course (DPC) = m\u00b2; Steel reinforcement = quintals / tonnes.",
          "Standard dry mortar required for 1 m\u00b3 of brick masonry = 0.30 m\u00b3 (~30%)."
        ],
        "examTrap": "For L-corners, reduction is ZERO. Only T-junctions require (d/2) reduction. If there are 2 T-junctions, subtract 2 * (d/2) = d.",
        "benchmarkExample": {
          "question": "In a building plan, the total centerline length of 30 cm thick walls is 50 m. If the plan contains 4 T-junctions, what is the net length used for estimating masonry?",
          "options": [
            "48.8 m",
            "49.4 m",
            "50.0 m",
            "50.6 m"
          ],
          "correctAnswer": "49.4 m",
          "stepByStepSolution": [
            "Step 1: Formula: Net length = Total length - (N * d / 2).",
            "Step 2: N = 4 T-junctions, wall thickness d = 30 cm = 0.30 m.",
            "Step 3: Reduction = 4 * (0.30 / 2) = 4 * 0.15 = 0.60 m.",
            "Step 4: Net length = 50.0 - 0.60 = 49.4 m."
          ],
          "takeaway": "Net C/L = Total C/L - N * (d/2) = 50 - 4*(0.15) = 49.4 m."
        }
      },
      {
        "stepNumber": 2,
        "stepTitle": "Valuation, Depreciation & Sinking Fund",
        "subtitle": "Capitalized value, year's purchase, straight line vs sinking fund depreciation",
        "keyConcept": "Valuation determines the present financial worth of an engineering asset. Capitalized value is the capital sum that would fetch the net annual income if invested at the prevailing rate of interest. Sinking fund is the periodic reserve deposited into an interest-bearing account to recover the replacement cost at the end of the structure's economic life.",
        "pointers": [
          "Year's Purchase (YP): The capital amount required to produce Re 1 as net annual income: YP = 100 / Rate of interest = 1 / i.",
          "Capitalized Value (CV): CV = Net Annual Income * Year's Purchase = Net Income / i.",
          "Net Annual Income = Gross Annual Income - Outgoings (Taxes, repairs 10-15%, management, sinking fund).",
          "Scrap Value: Value of dismantled material at the end of utility life (typically 10% of total cost).",
          "Salvage Value: Value of asset at end of life without being dismantled (can be positive or zero).",
          "Annual Sinking Fund Deposit: I_s = (S * i) / [ (1 + i)^n - 1 ], where S = Total replacement cost - Scrap value.",
          "Straight Line Depreciation: Annual depreciation D = (Original Cost C - Scrap Value S) / Useful Life n."
        ],
        "formulaOrCode": "CV = \\frac{\\text{Net Annual Income}}{i} \\quad ; \\quad YP = \\frac{1}{i} \\quad ; \\quad I_s = \\frac{S \\cdot i}{(1 + i)^n - 1}",
        "highYieldFacts": [
          "Scrap value is usually assumed to be 10% of the original construction cost.",
          "Constant Percentage Method (Declining Balance): Value decreases at a constant rate p = 1 - (S / C)^(1/n). It CANNOT be used when scrap value S = 0.",
          "Outgoings typically range between 20% and 30% of gross rent."
        ],
        "examTrap": "Constant percentage depreciation method FAILS if scrap value S is zero because (0 / C)^(1/n) equals zero and p becomes 100% in the first year!",
        "benchmarkExample": {
          "question": "A property produces a net annual income of Rs 60,000. If the prevailing market rate of interest is 6% per annum, calculate the capitalized value of the property.",
          "options": [
            "Rs 3,60,000",
            "Rs 6,00,000",
            "Rs 10,00,000",
            "Rs 12,00,000"
          ],
          "correctAnswer": "Rs 10,00,000",
          "stepByStepSolution": [
            "Step 1: Formula for Capitalized Value: CV = Net Income / Rate of interest (i).",
            "Step 2: i = 6% = 0.06.",
            "Step 3: CV = 60,000 / 0.06 = 1,000,000 = Rs 10,00,000."
          ],
          "takeaway": "Capitalized Value = Net Annual Income / interest rate = 60,000 / 0.06 = Rs 10 Lakhs."
        }
      }
    ],
    "topicQuestions": [
      {
        "id": "ce-ec-q1",
        "sourceType": "MODELLED",
        "stem": "While calculating the centerline length of walls for an excavation estimate, what deduction is made for each T-junction of wall thickness 't'?",
        "options": [
          {
            "id": "A",
            "text": "No deduction is made"
          },
          {
            "id": "B",
            "text": "Deduction of half the wall thickness (t / 2)"
          },
          {
            "id": "C",
            "text": "Deduction of full wall thickness (t)"
          },
          {
            "id": "D",
            "text": "Deduction of twice the wall thickness (2t)"
          }
        ],
        "correctOption": "B",
        "formulaContext": "\\text{Reduction per T-junction} = \\frac{t}{2}",
        "explanation": "At a T-junction, the cross wall joins the main wall. Because the centerline of the main wall already accounts for its half-thickness, exactly half the thickness of the intersecting wall (t/2) is deducted for each T-junction to prevent duplicate measurement.",
        "difficulty": "EASY",
        "examSource": "SSC JE / CPWD Standards"
      },
      {
        "id": "ce-ec-q2",
        "sourceType": "MODELLED",
        "stem": "As per IS 1200, no deduction is made for openings in plastering measurements when the opening area does not exceed:",
        "options": [
          {
            "id": "A",
            "text": "0.1 m\u00b2"
          },
          {
            "id": "B",
            "text": "0.5 m\u00b2"
          },
          {
            "id": "C",
            "text": "1.0 m\u00b2"
          },
          {
            "id": "D",
            "text": "3.0 m\u00b2"
          }
        ],
        "correctOption": "B",
        "formulaContext": "\\text{Opening } \\le 0.5 \\text{ m}^2 \\implies \\text{No deduction for plastering}",
        "explanation": "According to IS 1200 (Part XII), for openings up to 0.5 m\u00b2, no deduction is made for plastering, and at the same time, no addition is made for jambs, sills, and soffits. For openings between 0.5 m\u00b2 and 3.0 m\u00b2, deduction is made for one face only.",
        "difficulty": "MEDIUM",
        "examSource": "State AE / GATE Testbook"
      },
      {
        "id": "ce-ec-q3",
        "sourceType": "MODELLED",
        "stem": "The scrap value of a building is generally assumed to be what percentage of its original construction cost?",
        "options": [
          {
            "id": "A",
            "text": "2% to 3%"
          },
          {
            "id": "B",
            "text": "5%"
          },
          {
            "id": "C",
            "text": "10%"
          },
          {
            "id": "D",
            "text": "20%"
          }
        ],
        "correctOption": "C",
        "formulaContext": "\\text{Scrap Value } (S) = 10\\% \\text{ of Total Capital Cost}",
        "explanation": "Scrap value represents the salvage value of dismantled components (bricks, steel, timber) at the end of its functional life, net of dismantling costs. Standard valuation convention takes scrap value as 10% of the original construction cost.",
        "difficulty": "EASY",
        "examSource": "CPWD Valuation Manual / ESE"
      },
      {
        "id": "ce-ec-q4",
        "sourceType": "MODELLED",
        "stem": "The Earnest Money Deposit (EMD) submitted by a contractor along with the tender document is typically what percentage of the estimated project cost?",
        "options": [
          {
            "id": "A",
            "text": "1% to 2%"
          },
          {
            "id": "B",
            "text": "5%"
          },
          {
            "id": "C",
            "text": "10%"
          },
          {
            "id": "D",
            "text": "15%"
          }
        ],
        "correctOption": "A",
        "formulaContext": "\\text{EMD} = 1\\% \\text{ to } 2\\% \\quad ; \\quad \\text{Security Deposit} = 10\\%",
        "explanation": "Earnest Money Deposit (EMD) is deposited as a guarantee that the bidder will not withdraw their offer before tender validity expires. Standard public works convention fixes EMD at 1% to 2% of the estimated cost. Security deposit (10%) is deducted after tender award.",
        "difficulty": "EASY",
        "examSource": "State PWD / Testbook"
      }
    ],
    "unitName": "Construction Management & Building Materials",
    "codeClause": "IS 1200 (Part 1-28), CPWD Valuation Manual",
    "confidencePercent": 65,
    "masteredStatus": "In Progress",
    "diagramType": "rcc",
    "subtopicList": [
      "Centerline vs Longwall-Shortwall Estimating",
      "IS 1200 Rules for Deductions in Plastering & Masonry",
      "Detailed Rate Analysis & Labor Constants",
      "Tenders, Contracts & Earnest Money Deposit (EMD)",
      "Valuation: Sinking Fund, Scrap Value & Capitalized Value"
    ],
    "comparisonGrid": {
      "titleLeft": "Centerline Method",
      "tagLeft": "Rapid Calculation",
      "valueLeft": "L_net = L_total - n \u00b7 (t / 2)",
      "descLeft": "Total centerline of all walls calculated; for each T-junction, subtract half wall thickness (t/2); no deduction for L-corners.",
      "titleRight": "Longwall-Shortwall Method",
      "tagRight": "CPWD Standard",
      "valueRight": "Out-to-Out & In-to-In",
      "descRight": "Longwall length increases by wall thickness at each footing step; shortwall length decreases by wall thickness; precise and step-wise."
    },
    "callouts": {
      "corePostulate": "Under IS 1200 (Part XII), for plastering openings up to 0.5 m\u00b2, NO deduction is made and no addition is made for jambs/soffits. For openings between 0.5 m\u00b2 and 3.0 m\u00b2, deduction is made for one face only.",
      "corePostulateRef": "IS 1200:1992 Method of Measurement",
      "examTrap": "Scrap value represents dismantled structural material value at the end of life (conventionally taken as 10% of total construction cost). Salvage value is the asset value without dismantling!",
      "examTrapRef": "CPWD Valuation & State PSC",
      "testedRatios": [
        {
          "label": "Earnest Money Deposit (EMD):",
          "value": "1% to 2% of estimate"
        },
        {
          "label": "Security Deposit (SD):",
          "value": "10% of tender amount"
        },
        {
          "label": "Contingencies Allowance:",
          "value": "3% to 5% of cost"
        },
        {
          "label": "Work-Charged Establishment:",
          "value": "1.5% to 2%"
        }
      ],
      "numericalShortcut": {
        "formula": "Annual Sinking Fund Installment I = (S \u00b7 i) / ((1 + i)^n - 1)",
        "note": "Where S is the net replacement amount needed (Total cost - Scrap value), i is the rate of interest, and n is utility life in years."
      }
    },
    "aiTutorPrompts": [
      {
        "question": "How do deductions work for masonry openings as per IS 1200?",
        "answerPreview": "No deduction is made for openings up to 0.1 m2, ends of beams/lintels up to 500 cm2 cross-section, or bed plates/wall plates up to 10 cm depth."
      },
      {
        "question": "What is the difference between item rate contracts and percentage rate contracts?",
        "answerPreview": "In item rate contracts, contractors quote specific unit rates for individual schedule items. In percentage rate contracts, contractors quote a single uniform percentage above or below the official schedule of rates (CPWD SOR)."
      }
    ]
  },
  {
    "id": "civil-transport",
    "title": "Highway & Transportation Engineering: Geometric Design & Pavements",
    "subject": "Highway & Transportation Engineering",
    "category": "civil",
    "readTime": "16 min read",
    "weightage": "HIGH_YIELD",
    "icon": "Compass",
    "summary": "Geometric design per IRC 73 (camber, SSD, OSD, superelevation), flexible pavement design per IRC 37, rigid pavements per IRC 58, and Webster traffic signal timing.",
    "prerequisites": [
      "Surveying",
      "Geotechnical Engineering"
    ],
    "standardReferences": [
      "IRC:73-1980",
      "IRC:37-2018",
      "IRC:58-2015"
    ],
    "practiceQuestionIds": [
      "ce-q-083",
      "ce-q-084",
      "ce-q-085",
      "ce-q-086",
      "ce-q-087",
      "ce-q-088",
      "ce-q-089",
      "ce-q-090"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "stepTitle": "Highway Geometric Design & Cross-Section",
        "subtitle": "Camber, lane widths, and sight distance criteria",
        "keyConcept": "Geometric design ensures safe and comfortable vehicular transit at design speed. Camber provides lateral drainage to prevent hydroplaning; Sight distance provides safe stopping and overtaking sight lines.",
        "formulaOrCode": "SSD = 0.278 V t + \\frac{V^2}{254(f \\pm 0.01n)} \\quad ; \\quad e + f = \\frac{V^2}{127 R}",
        "highYieldFacts": [
          "Reaction time for stopping sight distance (SSD) per PIEV theory is 2.5 seconds.",
          "Reaction time for overtaking sight distance (OSD) is 2.0 seconds.",
          "Intermediate Sight Distance (ISD) is taken as twice the Stopping Sight Distance (2 * SSD).",
          "Maximum superelevation: 7% for plain/rolling terrain, 10% for hilly terrain, 4% for urban roads."
        ],
        "examTrap": "For a two-way two-lane road, sight distance required is SSD. For a two-way single-lane road, minimum required sight distance is 2 * SSD!",
        "benchmarkExample": {
          "question": "Calculate the stopping sight distance for a design speed of 80 km/h on a level road with coefficient of friction 0.35 and reaction time 2.5 s.",
          "options": [
            "102.5 m",
            "127.6 m",
            "145.2 m",
            "168.0 m"
          ],
          "correctAnswer": "127.6 m",
          "stepByStepSolution": [
            "Step 1: Lag distance = 0.278 * V * t = 0.278 * 80 * 2.5 = 55.6 m.",
            "Step 2: Braking distance = V\u00b2 / (254 * f) = (80)\u00b2 / (254 * 0.35) = 6400 / 88.9 = 72.0 m.",
            "Step 3: Total SSD = 55.6 + 72.0 = 127.6 m."
          ],
          "takeaway": "SSD = Lag Distance + Braking Distance."
        },
        "pointers": [
          "Reaction time for stopping sight distance (SSD) per PIEV theory is 2.5 seconds.",
          "Reaction time for overtaking sight distance (OSD) is 2.0 seconds.",
          "Intermediate Sight Distance (ISD) is taken as twice the Stopping Sight Distance (2 * SSD).",
          "Maximum superelevation: 7% for plain/rolling terrain, 10% for hilly terrain, 4% for urban roads."
        ]
      },
      {
        "stepNumber": 2,
        "stepTitle": "Pavement Design: Flexible (IRC 37) vs Rigid (IRC 58)",
        "subtitle": "CBR method, cumulative standard axles, and Westergaard stresses",
        "keyConcept": "Flexible pavements distribute wheel loads by grain-to-grain contact across layers; thickness is designed using California Bearing Ratio (CBR) and cumulative standard axles (CSA). Rigid pavements distribute load through slab flexural action; thickness is determined by Westergaard wheel load and temperature warping stresses.",
        "formulaOrCode": "N = \\frac{365 \\cdot [(1+r)^n - 1] \\cdot A \\cdot D \\cdot F}{r} \\quad ; \\quad \\sigma_c = \\frac{3 P}{h^2} \\left[1 - \\left(\\frac{a\\sqrt{2}}{l}\\right)^{0.6}\\right]",
        "highYieldFacts": [
          "IRC 37 designs flexible pavements based on horizontal tensile strain at bottom of bituminous layer and vertical compressive strain on subgrade.",
          "Radius of relative stiffness in rigid pavements: l = [E h\u00b3 / (12 (1 - mu\u00b2) k)]^(1/4).",
          "Critical stress combination in rigid pavement: Summer mid-day = Edge load stress + Warping stress.",
          "Dowel bars transfer shear across transverse expansion joints; tie bars hold longitudinal joints together."
        ],
        "examTrap": "Dowel bars are designed for shear transfer and must be bonded on one half and debonded (greased) on the other half to allow expansion. Tie bars are fully bonded deformed bars!",
        "benchmarkExample": {
          "question": "In a rigid pavement, what is the purpose of providing tie bars across longitudinal joints?",
          "options": [
            "To transfer wheel loads from one slab to another",
            "To prevent two adjacent slabs from opening apart or separating laterally",
            "To absorb temperature warping moments",
            "To allow thermal expansion along the road length"
          ],
          "correctAnswer": "To prevent two adjacent slabs from opening apart or separating laterally",
          "stepByStepSolution": [
            "Step 1: Check IS & IRC guidelines for rigid pavement joints.",
            "Step 2: Dowel bars transfer wheel loads across transverse joints.",
            "Step 3: Tie bars are deformed steel bars designed purely in tension to tie two adjacent slabs together across longitudinal joints."
          ],
          "takeaway": "Dowel bars = Shear load transfer (transverse joints); Tie bars = Tension restraint (longitudinal joints)."
        },
        "pointers": [
          "IRC 37 designs flexible pavements based on horizontal tensile strain at bottom of bituminous layer and vertical compressive strain on subgrade.",
          "Radius of relative stiffness in rigid pavements: l = [E h\u00b3 / (12 (1 - mu\u00b2) k)]^(1/4).",
          "Critical stress combination in rigid pavement: Summer mid-day = Edge load stress + Warping stress.",
          "Dowel bars transfer shear across transverse expansion joints; tie bars hold longitudinal joints together."
        ]
      }
    ],
    "topicQuestions": [
      {
        "id": "ce-q-083",
        "sourceType": "MODELLED",
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
        "explanation": "Nagpur Road Congress classified roads into NH, SH, MDR, ODR, and VR, adopting the 'Star and Grid' pattern with an overall target road density of 16 km / 100 km\u00b2.",
        "formulaContext": "Target road density = 16 km per 100 sq km area",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Highway Planning",
        "subtopic": "Nagpur Road Plan Pattern"
      },
      {
        "id": "ce-q-084",
        "sourceType": "MODELLED",
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
        "explanation": "IRC recommends a perception-reaction time of 2.5 seconds for SSD calculations based on PIEV (Perception, Intellection, Emotion, Volition) theory. For Overtaking Sight Distance (OSD), reaction time is taken as 2.0 seconds.",
        "formulaContext": "SSD = 0.278 \u00b7 v \u00b7 t + v\u00b2 / (254 \u00b7 f); t = 2.5 s",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2023",
        "topic": "Geometric Design",
        "subtopic": "Stopping Sight Distance (SSD)"
      },
      {
        "id": "ce-q-085",
        "sourceType": "MODELLED",
        "stem": "As per IRC recommendations for mixed traffic on plain and rolling terrain, super-elevation (e) is designed by neglecting lateral friction and considering what percentage of design speed (V)?",
        "options": [
          {
            "id": "A",
            "text": "75% of design speed (e = V\u00b2 / 225 R)"
          },
          {
            "id": "B",
            "text": "100% of design speed (e = V\u00b2 / 127 R)"
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
        "explanation": "To accommodate slow-moving bullock carts and fast motor vehicles on Indian roads, IRC designs super-elevation to fully counter centrifugal force at 75% of design speed (f = 0): e = (0.75 V)\u00b2 / (127 R) = V\u00b2 / (225 R). Maximum e is capped at 7% for plain/rolling terrain.",
        "formulaContext": "e = (0.75 V)\u00b2 / (127 R) = V\u00b2 / (225 R)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Geometric Design",
        "subtopic": "Super-elevation for Mixed Traffic"
      },
      {
        "id": "ce-q-086",
        "sourceType": "MODELLED",
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
        "explanation": "IRC caps super-elevation at 7% (0.07) for plain and rolling terrain. In hilly terrain not bound by snow, it is 10%. In urban areas with frequent intersections, it is limited to 4% to prevent toppling of slow tall vehicles.",
        "formulaContext": "emax = 7% (plain/rolling), 10% (hilly without snow), 4% (urban with frequent intersections)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2022",
        "topic": "Geometric Design",
        "subtopic": "Maximum Super-elevation Limits"
      },
      {
        "id": "ce-q-087",
        "sourceType": "MODELLED",
        "stem": "The total extra widening (We) required on a two-lane horizontal curve of radius R with wheelbase l and design speed V (in km/h) is:",
        "options": [
          {
            "id": "A",
            "text": "We = (n \u00b7 l\u00b2 / (2 \u00b7 R)) + (V / (9.5 \u00b7 \u221aR))"
          },
          {
            "id": "B",
            "text": "We = (n \u00b7 l / (2 \u00b7 R)) + (V / (225 \u00b7 R))"
          },
          {
            "id": "C",
            "text": "We = (n \u00b7 l\u00b2 / R) + (V / (9.5 \u00b7 \u221aR))"
          },
          {
            "id": "D",
            "text": "We = n \u00b7 l\u00b2 / (2 \u00b7 R)"
          }
        ],
        "correctOption": "A",
        "explanation": "Total extra widening consists of Mechanical widening (off-tracking of rear axle Wm = n l\u00b2 / 2R) plus Psychological widening (for driver ease and transverse clearances Wps = V / 9.5 \u221aR).",
        "formulaContext": "We = Wm + Wps = (n \u00b7 l\u00b2 / (2 \u00b7 R)) + (V / (9.5 \u00b7 \u221aR))",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Geometric Design",
        "subtopic": "Extra Widening on Curves"
      },
      {
        "id": "ce-q-088",
        "sourceType": "MODELLED",
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
        "explanation": "IRC recommends the Euler spiral (clothoid) because the rate of change of centrifugal acceleration is strictly uniform throughout, and radius decreases linearly with curve length from infinity to circular radius R.",
        "formulaContext": "Transition curve: Radius R is inversely proportional to length L (L \u00b7 R = Constant)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2021",
        "topic": "Geometric Design",
        "subtopic": "Ideal Transition Curve"
      },
      {
        "id": "ce-q-089",
        "sourceType": "MODELLED",
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
        "explanation": "CBR (%) = (Test load / Standard load) \u00b7 100. The standard loads on high quality crushed stone are 1370 kg for 2.5 mm penetration and 2055 kg for 5.0 mm penetration. Usually CBR at 2.5 mm is higher and taken as design CBR.",
        "formulaContext": "Standard load at 2.5 mm = 1370 kg (70 kg/cm\u00b2); Standard load at 5.0 mm = 2055 kg (105 kg/cm\u00b2)",
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / APSC AE Civil 2024",
        "topic": "Pavement Materials",
        "subtopic": "California Bearing Ratio (CBR) Test"
      },
      {
        "id": "ce-q-090",
        "sourceType": "MODELLED",
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
        "explanation": "Flexible pavements distribute concentrated wheel loads downward over larger areas through inter-granular particle contact and friction, reducing stress intensity. Rigid pavements (PQC) carry loads through flexural slab action.",
        "formulaContext": "Flexible pavement: Grain-to-grain contact; Rigid pavement: Slab flexural rigidity",
        "difficulty": "EASY",
        "examSource": "Testbook Model / APSC AE Civil 2023",
        "topic": "Pavement Design",
        "subtopic": "Flexible vs Rigid Pavements"
      }
    ],
    "unitName": "Transportation Engineering",
    "codeClause": "IRC:73-1980, IRC:37-2018, IRC:58-2015",
    "confidencePercent": 40,
    "masteredStatus": "Needs Practice",
    "diagramType": "highway",
    "subtopicList": [
      "Camber, Right of Way & Kerbs",
      "Sight Distances (SSD, OSD, ISD)",
      "Horizontal Curves & Superelevation (e + f = v\u00b2 / 127R)",
      "Transition Spiral Curves & Widening",
      "Flexible Pavements (CBR & IRC 37)",
      "Rigid Pavements (Westergaard Stresses & IRC 58)",
      "Traffic Studies & Webster Traffic Signals"
    ],
    "comparisonGrid": {
      "titleLeft": "Flexible Pavements (IRC 37)",
      "tagLeft": "Layered Deflection",
      "valueLeft": "CBR & Cumulative Axles",
      "descLeft": "Load transferred by grain-to-grain contact pressure down to subgrade; low flexural strength; repairs easy; life 15 years.",
      "titleRight": "Rigid Pavements (IRC 58)",
      "tagRight": "Slab Flexural Action",
      "valueRight": "Westergaard Modulus k",
      "descRight": "High flexural strength slab action; wheel load + temperature warping stresses critical; dowel and tie bars at joints; life 30-40 years."
    },
    "callouts": {
      "corePostulate": "Maximum permissible superelevation as per IRC 73: 7% for plain and rolling terrain, 10% for hilly roads not bound by snow, and 4% for urban roads with frequent intersections.",
      "corePostulateRef": "IRC:73-1980 Geometric Design",
      "examTrap": "Stopping Sight Distance SSD = 0.278 V t + V\u00b2 / (254(f \u00b1 0.01n)). For two-way traffic on a single-lane road, minimum design sight distance is 2 * SSD!",
      "examTrapRef": "APSC AE 2018, 2020",
      "testedRatios": [
        {
          "label": "Mechanical Widening:",
          "value": "Wm = n \u00b7 l\u00b2 / (2 \u00b7 R)"
        },
        {
          "label": "Psychological Widening:",
          "value": "Wps = V / (9.5 \u00b7 \u221aR)"
        },
        {
          "label": "Equilibrium Superelevation:",
          "value": "e_eq = V\u00b2 / (127 \u00b7 R)  (f = 0)"
        },
        {
          "label": "Camber for Heavy Rain (Bituminous):",
          "value": "2.5% (1 in 40)"
        }
      ],
      "numericalShortcut": {
        "formula": "Webster Optimum Signal Cycle C0 = (1.5 \u00b7 L + 5) / (1 - Y)",
        "note": "Where L is total lost time per cycle and Y = sum of (qi / si) for critical approaches. Minimizes total delay to vehicles."
      }
    },
    "aiTutorPrompts": [
      {
        "question": "How is superelevation designed for mixed traffic conditions in India?",
        "answerPreview": "Per IRC, design for 75% of design speed neglecting friction: e = (0.75 V)^2 / (127 R) = V^2 / (225 R). If e <= 0.07, provide this value. If e > 0.07, cap at 0.07 and check lateral friction f."
      },
      {
        "question": "What is the critical combination of stresses in rigid pavement design?",
        "answerPreview": "During summer mid-day: Wheel load stress at edge + Warping stress (tension at bottom) = Maximum edge stress. During winter midnight: Corner wheel load + Warping stress = Maximum corner stress."
      }
    ]
  },
  {
    "id": "gs-science",
    "title": "General Science & Technology: Physics, Chemistry, Biology & Space Missions",
    "subject": "General Science & Technology",
    "category": "gs",
    "readTime": "14 min read",
    "weightage": "MEDIUM",
    "icon": "Activity",
    "summary": "Core concepts across Optics, Mechanics, Acids & Bases, Cell Biology, Environmental Ecology (biomagnification, ozone), and landmark ISRO space missions.",
    "prerequisites": [
      "Secondary School Science"
    ],
    "standardReferences": [
      "NCERT Class 9-12 Science",
      "ISRO Mission Updates"
    ],
    "practiceQuestionIds": [
      "gs-q-067",
      "gs-q-068",
      "gs-q-069",
      "gs-q-070",
      "gs-q-071",
      "gs-q-072",
      "gs-q-073",
      "gs-q-074",
      "gs-q-075",
      "gs-q-076",
      "gs-q-077",
      "gs-q-078",
      "gs-q-079",
      "gs-q-080"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "stepTitle": "Physics Fundamentals: Optics & Mechanics",
        "subtitle": "Light propagation, lenses, TIR, and Newton's laws",
        "keyConcept": "Optics principles govern optical fiber communications, eye corrections, and atmospheric phenomena like mirages. Total Internal Reflection occurs when light travels from denser to rarer medium at an incident angle greater than the critical angle.",
        "formulaOrCode": "n_1 \\sin \\theta_1 = n_2 \\sin \\theta_2 \\quad ; \\quad P = \\frac{1}{f} \\text{ (Diopters)}",
        "highYieldFacts": [
          "Optical fibers transmit data by continuous Total Internal Reflection (TIR) through high refractive index silica core.",
          "Myopia (nearsightedness) is corrected using a concave (diverging) lens.",
          "Hypermetropia (farsightedness) is corrected using a convex (converging) lens.",
          "Acceleration due to gravity g is maximum at the poles and minimum at the equator."
        ],
        "examTrap": "Do not confuse dispersion with total internal reflection. A rainbow is formed by a combination of refraction, dispersion, and internal reflection within raindrops.",
        "benchmarkExample": {
          "question": "A person cannot clearly see objects situated closer than 50 cm. What lens power is required to enable reading at the normal near point of 25 cm?",
          "options": [
            "+2.0 D",
            "+1.5 D",
            "-2.0 D",
            "+4.0 D"
          ],
          "correctAnswer": "+2.0 D",
          "stepByStepSolution": [
            "Step 1: Lens formula: 1/f = 1/v - 1/u.",
            "Step 2: Object distance u = -25 cm = -0.25 m. Image distance v = -50 cm = -0.50 m.",
            "Step 3: 1/f = -1/0.50 - (-1/0.25) = -2.0 + 4.0 = +2.0 D."
          ],
          "takeaway": "Presbyopia/Hypermetropia correction requires positive diopter (convex) lens."
        },
        "pointers": [
          "Optical fibers transmit data by continuous Total Internal Reflection (TIR) through high refractive index silica core.",
          "Myopia (nearsightedness) is corrected using a concave (diverging) lens.",
          "Hypermetropia (farsightedness) is corrected using a convex (converging) lens.",
          "Acceleration due to gravity g is maximum at the poles and minimum at the equator."
        ]
      }
    ],
    "topicQuestions": [
      {
        "id": "gs-q-067",
        "sourceType": "MODELLED",
        "stem": "The recoil of a rifle upon firing a bullet is a direct practical demonstration of:",
        "options": [
          {
            "id": "A",
            "text": "Newton's Third Law of Motion and Conservation of Linear Momentum"
          },
          {
            "id": "B",
            "text": "Newton's First Law of Inertia only"
          },
          {
            "id": "C",
            "text": "Law of Gravitation"
          },
          {
            "id": "D",
            "text": "Bernoulli's Principle"
          }
        ],
        "correctOption": "A",
        "explanation": "Total linear momentum of the system before firing is zero. Upon firing, the forward momentum of the bullet (+m\u00b7v) must be balanced by an equal and opposite backward momentum of the gun (-M\u00b7V), causing rifle recoil.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Physics",
        "subtopic": "Conservation of Momentum"
      },
      {
        "id": "gs-q-068",
        "sourceType": "MODELLED",
        "stem": "High-speed optical fiber communication networks transmit optical data signals through core fibers based on the principle of:",
        "options": [
          {
            "id": "A",
            "text": "Total Internal Reflection (TIR)"
          },
          {
            "id": "B",
            "text": "Optical Dispersion"
          },
          {
            "id": "C",
            "text": "Light Polarization"
          },
          {
            "id": "D",
            "text": "Diffraction of light rays"
          }
        ],
        "correctOption": "A",
        "explanation": "In optical fibers, light enters the core (refractive index n1) surrounded by cladding (refractive index n2 < n1) at an angle greater than the critical angle, undergoing continuous Total Internal Reflection with near-zero transmission loss.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Physics & Optics",
        "subtopic": "Total Internal Reflection Applications"
      },
      {
        "id": "gs-q-069",
        "sourceType": "MODELLED",
        "stem": "Which of the following electromagnetic radiations possesses the highest frequency and shortest wavelength?",
        "options": [
          {
            "id": "A",
            "text": "Gamma Rays"
          },
          {
            "id": "B",
            "text": "X-Rays"
          },
          {
            "id": "C",
            "text": "Ultraviolet radiation"
          },
          {
            "id": "D",
            "text": "Microwaves"
          }
        ],
        "correctOption": "A",
        "explanation": "In the electromagnetic spectrum, Gamma rays have the highest frequencies (> 10\u00b9\u2079 Hz) and shortest wavelengths (< 10\u207b\u00b9\u00b2 m), carrying the highest photon energies. Radio waves have the longest wavelengths.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2023",
        "topic": "Physics",
        "subtopic": "Electromagnetic Wave Spectrum"
      },
      {
        "id": "gs-q-070",
        "sourceType": "MODELLED",
        "stem": "Human gastric juice secreted in the stomach contains hydrochloric acid (HCl) having a highly acidic pH typically around:",
        "options": [
          {
            "id": "A",
            "text": "1.5 to 2.5"
          },
          {
            "id": "B",
            "text": "5.5 to 6.5"
          },
          {
            "id": "C",
            "text": "7.4 (neutral)"
          },
          {
            "id": "D",
            "text": "8.5 to 9.5"
          }
        ],
        "correctOption": "A",
        "explanation": "Gastric acid secreted by parietal cells in stomach lining has a pH of approximately 1.5 to 2.0. This intense acidity activates pepsinogen into active protease pepsin and eliminates ingested pathogens.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Chemistry",
        "subtopic": "pH Scale & Gastric Acid"
      },
      {
        "id": "gs-q-071",
        "sourceType": "MODELLED",
        "stem": "The common domestic chemical known as 'Baking Soda' used in culinary baking is chemically:",
        "options": [
          {
            "id": "A",
            "text": "Sodium Bicarbonate (NaHCO3)"
          },
          {
            "id": "B",
            "text": "Sodium Carbonate decahydrate (Na2CO3\u00b710H2O)"
          },
          {
            "id": "C",
            "text": "Sodium Hydroxide (NaOH)"
          },
          {
            "id": "D",
            "text": "Calcium Oxychloride (CaOCl2)"
          }
        ],
        "correctOption": "A",
        "explanation": "Baking Soda is Sodium Bicarbonate (NaHCO3). Washing soda is Sodium Carbonate (Na2CO3\u00b710H2O), Caustic soda is Sodium Hydroxide (NaOH), and Bleaching powder is Calcium Hypochlorite/Oxychloride (CaOCl2).",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2023",
        "topic": "Chemistry",
        "subtopic": "Common Chemical Compounds"
      },
      {
        "id": "gs-q-072",
        "sourceType": "MODELLED",
        "stem": "Why is the organelle 'Mitochondria' commonly referred to as the 'Powerhouse of the Cell'?",
        "options": [
          {
            "id": "A",
            "text": "It generates cellular energy in the form of Adenosine Triphosphate (ATP) via oxidative phosphorylation"
          },
          {
            "id": "B",
            "text": "It synthesizes structural proteins for the cell membrane"
          },
          {
            "id": "C",
            "text": "It stores genetic chromosomal information"
          },
          {
            "id": "D",
            "text": "It digests cellular wastes through hydrolytic enzymes"
          }
        ],
        "correctOption": "A",
        "explanation": "Mitochondria are sites of cellular respiration (Krebs cycle and electron transport chain), generating over 90% of cellular energy currency in the form of ATP molecules.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Biology & Cell Science",
        "subtopic": "Mitochondria Powerhouse"
      },
      {
        "id": "gs-q-073",
        "sourceType": "MODELLED",
        "stem": "The double helical three-dimensional molecular model of DNA was discovered in 1953 by:",
        "options": [
          {
            "id": "A",
            "text": "James Watson and Francis Crick"
          },
          {
            "id": "B",
            "text": "Gregor Mendel"
          },
          {
            "id": "C",
            "text": "Robert Hooke"
          },
          {
            "id": "D",
            "text": "Louis Pasteur"
          }
        ],
        "correctOption": "A",
        "explanation": "James Watson and Francis Crick published the double helix structure of DNA in Nature in April 1953, utilizing Rosalind Franklin and Maurice Wilkins' X-ray crystallography diffraction data.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2022",
        "topic": "Genetics",
        "subtopic": "DNA Double Helix Discovery"
      },
      {
        "id": "gs-q-074",
        "sourceType": "MODELLED",
        "stem": "In the human ABO and Rh blood grouping system, individuals with which blood group are considered 'Universal Donors'?",
        "options": [
          {
            "id": "A",
            "text": "O Negative (O -ve)"
          },
          {
            "id": "B",
            "text": "AB Positive (AB +ve)"
          },
          {
            "id": "C",
            "text": "O Positive (O +ve)"
          },
          {
            "id": "D",
            "text": "A Negative (A -ve)"
          }
        ],
        "correctOption": "A",
        "explanation": "O-negative red blood cells contain neither A nor B surface antigens, nor the Rh(D) antigen. Hence they trigger no antibody-mediated hemolytic reactions in recipients, making O-negative the universal donor blood.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2023",
        "topic": "Human Biology",
        "subtopic": "Universal Donor Blood Group"
      },
      {
        "id": "gs-q-075",
        "sourceType": "MODELLED",
        "stem": "Deficiency of Vitamin C (Ascorbic Acid) in the human diet causes which deficiency disease characterized by bleeding gums and delayed wound healing?",
        "options": [
          {
            "id": "A",
            "text": "Scurvy"
          },
          {
            "id": "B",
            "text": "Rickets"
          },
          {
            "id": "C",
            "text": "Beriberi"
          },
          {
            "id": "D",
            "text": "Pellagra"
          }
        ],
        "correctOption": "A",
        "explanation": "Vitamin C is a vital cofactor for collagen biosynthesis. Scurvy results from severe Vitamin C deficiency. Vitamin D deficiency causes Rickets; Vitamin B1 (Thiamine) deficiency causes Beriberi; Niacin (B3) deficiency causes Pellagra.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Health & Nutrition",
        "subtopic": "Vitamin Deficiency Diseases"
      },
      {
        "id": "gs-q-076",
        "sourceType": "MODELLED",
        "stem": "Malaria is caused by the protozoan parasite Plasmodium and transmitted to humans via the bite of infected:",
        "options": [
          {
            "id": "A",
            "text": "Female Anopheles mosquito"
          },
          {
            "id": "B",
            "text": "Female Aedes aegypti mosquito"
          },
          {
            "id": "C",
            "text": "Culex mosquito"
          },
          {
            "id": "D",
            "text": "Tsetse fly"
          }
        ],
        "correctOption": "A",
        "explanation": "Malaria is transmitted by the female Anopheles mosquito. Aedes aegypti transmits Dengue, Chikungunya, and Zika. Culex transmits Filariasis (Elephantiasis) and Japanese Encephalitis.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Human Health & Diseases",
        "subtopic": "Malaria Transmission Vector"
      },
      {
        "id": "gs-q-077",
        "sourceType": "MODELLED",
        "stem": "How do mRNA-based vaccines (such as Pfizer-BioNTech and Moderna COVID-19 vaccines) stimulate protective immune responses?",
        "options": [
          {
            "id": "A",
            "text": "By instructing host cells to synthesize the harmless viral spike protein to trigger neutralizing antibodies"
          },
          {
            "id": "B",
            "text": "By injecting weakened live coronavirus directly into muscle cells"
          },
          {
            "id": "C",
            "text": "By altering the permanent nuclear genomic DNA of human cells"
          },
          {
            "id": "D",
            "text": "By introducing synthetic pre-formed monoclonal antibodies"
          }
        ],
        "correctOption": "A",
        "explanation": "mRNA vaccines deliver synthetic messenger RNA encoding the viral spike protein wrapped in lipid nanoparticles. Ribosomes in host cells translate the mRNA into the viral protein, triggering robust humoral and cellular immune memory without entering the cell nucleus.",
        "formulaContext": null,
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / State PSC GS Paper I 2023",
        "topic": "Biotechnology & Vaccines",
        "subtopic": "mRNA Vaccine Platform"
      },
      {
        "id": "gs-q-078",
        "sourceType": "MODELLED",
        "stem": "The colossal energy generation in the core of the Sun and other stars is powered by which nuclear process?",
        "options": [
          {
            "id": "A",
            "text": "Nuclear Fusion (hydrogen nuclei fusing into helium under extreme heat and gravitational pressure)"
          },
          {
            "id": "B",
            "text": "Controlled Nuclear Fission of heavy Uranium isotopes"
          },
          {
            "id": "C",
            "text": "Spontaneous Radioactive Alpha Decay"
          },
          {
            "id": "D",
            "text": "Chemical combustion of compressed hydrogen gas"
          }
        ],
        "correctOption": "A",
        "explanation": "The Sun operates via the proton-proton chain nuclear fusion reaction, where four hydrogen nuclei (protons) fuse to produce a helium-4 nucleus, with mass defect converted into immense energy per Einstein's equation E = m c\u00b2.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Nuclear Science",
        "subtopic": "Nuclear Fission vs Fusion"
      },
      {
        "id": "gs-q-079",
        "sourceType": "MODELLED",
        "stem": "India's Chandrayaan-3 achieved historic soft-landing near the lunar south pole on August 23, 2023. What official name was designated for the landing site?",
        "options": [
          {
            "id": "A",
            "text": "Shiv Shakti Point"
          },
          {
            "id": "B",
            "text": "Tiranga Point"
          },
          {
            "id": "C",
            "text": "Jawahar Point"
          },
          {
            "id": "D",
            "text": "Atal Point"
          }
        ],
        "correctOption": "A",
        "explanation": "Prime Minister Narendra Modi announced that the Chandrayaan-3 lander touch-down site on the Moon is named 'Shiv Shakti Point', August 23 was designated 'National Space Day', and the Chandrayaan-2 crash site was named 'Tiranga Point'.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Space Science & Technology",
        "subtopic": "Chandrayaan-3 Landing Site"
      },
      {
        "id": "gs-q-080",
        "sourceType": "MODELLED",
        "stem": "Unlike classical computer bits that represent either 0 or 1, a quantum bit (Qubit) in quantum computing can exist in both 0 and 1 states simultaneously due to:",
        "options": [
          {
            "id": "A",
            "text": "Quantum Superposition"
          },
          {
            "id": "B",
            "text": "Quantum Tunneling"
          },
          {
            "id": "C",
            "text": "Wave Diffraction"
          },
          {
            "id": "D",
            "text": "Photoelectric Effect"
          }
        ],
        "correctOption": "A",
        "explanation": "Quantum computers exploit two counter-intuitive quantum phenomena: Superposition (qubit being in linear combination of state |0\u27e9 and |1\u27e9 simultaneously) and Entanglement (instant correlated states between qubits).",
        "formulaContext": null,
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / State PSC GS Paper I 2023",
        "topic": "Modern Computing",
        "subtopic": "Quantum Supremacy & Qubits"
      }
    ],
    "unitName": "Science & Technology",
    "codeClause": "NCERT Science & ISRO Mission Archives",
    "confidencePercent": 65,
    "masteredStatus": "In Progress",
    "diagramType": "env",
    "subtopicList": [
      "Optics: Reflection, Refraction & Total Internal Reflection",
      "Newton's Laws of Motion & Gravitation",
      "Chemistry: Acids, Bases, pH & Corrosion Prevention",
      "Cell Biology, Organ Systems & Communicable Diseases",
      "Ecology: Biomagnification & Ozone Layer Depletion",
      "ISRO Space Missions (Chandrayaan, Aditya-L1, Gaganyaan)"
    ],
    "comparisonGrid": {
      "titleLeft": "Total Internal Reflection (TIR)",
      "tagLeft": "Optical Fibers & Mirages",
      "valueLeft": "\u03b8_i > \u03b8_critical",
      "descLeft": "Occurs when light travels from a denser to a rarer optical medium and angle of incidence exceeds critical angle; 100% of light energy is reflected.",
      "titleRight": "Refraction of Light",
      "tagRight": "Snell's Law",
      "valueRight": "n1 \u00b7 sin \u03b81 = n2 \u00b7 sin \u03b82",
      "descRight": "Bending of light wavefront caused by change in propagation velocity as light passes across an interface between differing optical media."
    },
    "callouts": {
      "corePostulate": "Biomagnification refers to the progressive increase in the concentration of toxic, non-biodegradable persistent chemicals (such as DDT and methylmercury) at each successive trophic level in an ecological food chain.",
      "corePostulateRef": "Ecological Principles",
      "examTrap": "Myopia (short-sightedness, image focused in front of retina) is corrected by a CONCAVE (diverging) lens. Hypermetropia (far-sightedness, image behind retina) is corrected by a CONVEX (converging) lens!",
      "examTrapRef": "General Science PSC Standards",
      "testedRatios": [
        {
          "label": "Power of Lens Formula:",
          "value": "P = 1 / f (in meters), unit: Diopter (D)"
        },
        {
          "label": "Ozone Layer Location:",
          "value": "Stratosphere (15 km - 35 km altitude)"
        },
        {
          "label": "Chandrayaan-3 Landing Site:",
          "value": "Shiv Shakti Point (Lunar South Pole)"
        },
        {
          "label": "Aditya-L1 Target Orbit:",
          "value": "Halo Orbit around Sun-Earth L1 Lagrangian Point"
        }
      ],
      "numericalShortcut": {
        "formula": "Snell's Law of Refraction: sin i / sin r = v1 / v2 = n2 / n1",
        "note": "Critical angle equation for total internal reflection: sin(theta_c) = 1 / n, where n is the refractive index of the denser medium."
      }
    },
    "aiTutorPrompts": [
      {
        "question": "How does an optical fiber transmit communication signals?",
        "answerPreview": "Optical fibers consist of a high refractive index glass core surrounded by a lower refractive index cladding. Light pulses introduced at an angle exceeding the critical angle undergo continuous Total Internal Reflection (TIR) with minimal attenuation over long distances."
      },
      {
        "question": "What is the Montreal Protocol and why was it enacted?",
        "answerPreview": "The Montreal Protocol (1987) is an international treaty designed to protect the stratospheric ozone layer by phasing out the production of Chlorofluorocarbons (CFCs) and Halons, which release catalytic chlorine radicals that destroy ozone molecules."
      }
    ]
  },
  {
    "id": "gs-aptitude",
    "title": "Quantitative Aptitude & Mental Ability: Percentages, Profit/Loss & Reasoning",
    "subject": "Quantitative Aptitude & Reasoning",
    "category": "gs",
    "readTime": "15 min read",
    "weightage": "MEDIUM",
    "icon": "Crosshair",
    "summary": "Arithmetic shortcuts for percentages, profit-loss, simple & compound interest, speed-time-distance, time-work, and logical deduction.",
    "prerequisites": [
      "Basic Arithmetic"
    ],
    "standardReferences": [
      "Standard Quantitative Reasoning Handbook"
    ],
    "practiceQuestionIds": [
      "gs-q-091",
      "gs-q-092",
      "gs-q-093",
      "gs-q-094",
      "gs-q-095",
      "gs-q-096",
      "gs-q-097",
      "gs-q-098",
      "gs-q-099",
      "gs-q-100"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "stepTitle": "Arithmetic Shortcuts: Percentages & Interest",
        "subtitle": "Product constancy, compound interest difference, and successive discount",
        "keyConcept": "Percentages and fractions provide rapid computation tools for PSC prelims. The difference between Compound Interest and Simple Interest over 2 years simplifies to P * (R/100)\u00b2.",
        "formulaOrCode": "D_2 = P \\cdot \\left(\\frac{R}{100}\\right)^2 \\quad ; \\quad \\text{Net} = a + b + \\frac{ab}{100}",
        "highYieldFacts": [
          "If price of an article rises by R%, consumption reduction to keep expenditure constant is (R / (100 + R)) * 100%.",
          "Difference between CI and SI for 2 years is P * (R/100)\u00b2.",
          "Difference between CI and SI for 3 years is P * (R/100)\u00b2 * (3 + R/100).",
          "Two successive discounts of d1% and d2% equal an effective discount of (d1 + d2 - d1*d2/100)%."
        ],
        "examTrap": "If speed increases by 25% (1/4), time taken decreases by 1/(4+1) = 1/5 = 20%, NOT by 25%!",
        "benchmarkExample": {
          "question": "The difference between simple interest and compound interest compounded annually on a sum of money for 2 years at 10% per annum is Rs. 65. What is the principal sum?",
          "options": [
            "Rs. 5,500",
            "Rs. 6,000",
            "Rs. 6,500",
            "Rs. 7,200"
          ],
          "correctAnswer": "Rs. 6,500",
          "stepByStepSolution": [
            "Step 1: Formula for 2-year CI - SI difference: D2 = P * (R/100)\u00b2.",
            "Step 2: 65 = P * (10/100)\u00b2 = P * (1/100).",
            "Step 3: P = 65 * 100 = Rs. 6,500."
          ],
          "takeaway": "Direct exam shortcut: P = D2 * (100 / R)\u00b2."
        },
        "pointers": [
          "If price of an article rises by R%, consumption reduction to keep expenditure constant is (R / (100 + R)) * 100%.",
          "Difference between CI and SI for 2 years is P * (R/100)\u00b2.",
          "Difference between CI and SI for 3 years is P * (R/100)\u00b2 * (3 + R/100).",
          "Two successive discounts of d1% and d2% equal an effective discount of (d1 + d2 - d1*d2/100)%."
        ]
      }
    ],
    "topicQuestions": [
      {
        "id": "gs-q-091",
        "sourceType": "MODELLED",
        "stem": "If the seven-digit number 5432A71 is completely divisible by 11, what is the value of single digit A?",
        "options": [
          {
            "id": "A",
            "text": "4"
          },
          {
            "id": "B",
            "text": "6"
          },
          {
            "id": "C",
            "text": "5"
          },
          {
            "id": "D",
            "text": "8"
          }
        ],
        "correctOption": "A",
        "explanation": "Sum of digits in odd places (1st, 3rd, 5th, 7th from right): 1 + A + 3 + 5 = 9 + A. Sum of digits in even places (2nd, 4th, 6th): 7 + 2 + 4 = 13. For divisibility by 11: (13) - (9 + A) = 0 => 4 - A = 0 => A = 4. Checking: 5432471 / 11 = 493,861.",
        "formulaContext": "|Sum(odd places) - Sum(even places)| is 0 or multiple of 11",
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Number Systems",
        "subtopic": "Divisibility Rule for 11"
      },
      {
        "id": "gs-q-092",
        "sourceType": "MODELLED",
        "stem": "A trader marks up the price of an article by 20% and then offers a discount of 10% on the marked price. What is his net percentage gain?",
        "options": [
          {
            "id": "A",
            "text": "8% gain"
          },
          {
            "id": "B",
            "text": "10% gain"
          },
          {
            "id": "C",
            "text": "12% gain"
          },
          {
            "id": "D",
            "text": "5% gain"
          }
        ],
        "correctOption": "A",
        "explanation": "Using successive percentage formula: Net Change = a + b + (a \u00b7 b) / 100 = (+20) + (-10) + (20 \u00b7 -10) / 100 = 10 - 2 = +8% net profit. Alternatively, let CP = 100. MP = 120. SP = 120 - 12 = 108. Profit = 8%.",
        "formulaContext": "Net % = a + b + (a \u00b7 b) / 100",
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2023",
        "topic": "Percentages",
        "subtopic": "Successive Percentage Change"
      },
      {
        "id": "gs-q-093",
        "sourceType": "MODELLED",
        "stem": "What single discount percentage is equivalent to two successive discounts of 20% and 10%?",
        "options": [
          {
            "id": "A",
            "text": "28%"
          },
          {
            "id": "B",
            "text": "30%"
          },
          {
            "id": "C",
            "text": "25%"
          },
          {
            "id": "D",
            "text": "18%"
          }
        ],
        "correctOption": "A",
        "explanation": "Equivalent Discount = d1 + d2 - (d1 \u00b7 d2 / 100) = 20 + 10 - (20 \u00b7 10 / 100) = 30 - 2 = 28%. If marked price is Rs 100, after 20% discount price is Rs 80; 10% discount on Rs 80 reduces price by Rs 8 to Rs 72. Total discount = 100 - 72 = Rs 28 (28%).",
        "formulaContext": "D_eq = d1 + d2 - (d1 \u00b7 d2 / 100)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Profit & Loss",
        "subtopic": "Single Equivalent Discount"
      },
      {
        "id": "gs-q-094",
        "sourceType": "MODELLED",
        "stem": "The difference between compound interest and simple interest on a certain principal sum P at 10% per annum for 2 years is Rs 150. What is the principal sum P?",
        "options": [
          {
            "id": "A",
            "text": "Rs 15,000"
          },
          {
            "id": "B",
            "text": "Rs 12,000"
          },
          {
            "id": "C",
            "text": "Rs 18,000"
          },
          {
            "id": "D",
            "text": "Rs 20,000"
          }
        ],
        "correctOption": "A",
        "explanation": "For 2 years, the difference between CI and SI is given by: D = P \u00b7 (R / 100)\u00b2 => 150 = P \u00b7 (10 / 100)\u00b2 => 150 = P \u00b7 (1/100) => P = 150 \u00b7 100 = Rs 15,000.",
        "formulaContext": "CI - SI (2 years) = P \u00b7 (R / 100)\u00b2",
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Simple & Compound Interest",
        "subtopic": "Two-Year CI-SI Difference"
      },
      {
        "id": "gs-q-095",
        "sourceType": "MODELLED",
        "stem": "In what ratio must tea worth Rs 60 per kg be mixed with tea worth Rs 65 per kg so that the resulting mixture is worth Rs 62 per kg?",
        "options": [
          {
            "id": "A",
            "text": "3 : 2"
          },
          {
            "id": "B",
            "text": "2 : 3"
          },
          {
            "id": "C",
            "text": "4 : 1"
          },
          {
            "id": "D",
            "text": "5 : 2"
          }
        ],
        "correctOption": "A",
        "explanation": "By rule of alligation: Quantity of Cheaper / Quantity of Dearer = (Dearer Price - Mean Price) / (Mean Price - Cheaper Price) = (65 - 62) / (62 - 60) = 3 / 2. Therefore the required mixing ratio is 3 : 2.",
        "formulaContext": "Ratio = (Price2 - Mean) / (Mean - Price1)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2022",
        "topic": "Ratio & Alligation",
        "subtopic": "Rule of Alligation"
      },
      {
        "id": "gs-q-096",
        "sourceType": "MODELLED",
        "stem": "A can complete a piece of civil drafting work in 12 days, and B can complete the same work in 24 days. Working together, how many days will they take to finish the work?",
        "options": [
          {
            "id": "A",
            "text": "8 days"
          },
          {
            "id": "B",
            "text": "6 days"
          },
          {
            "id": "C",
            "text": "10 days"
          },
          {
            "id": "D",
            "text": "9 days"
          }
        ],
        "correctOption": "A",
        "explanation": "Combined rate per day = 1/12 + 1/24 = (2 + 1) / 24 = 3/24 = 1/8 of total work. Hence together they complete the entire work in 1 / (1/8) = 8 days. Shortcut: (A \u00b7 B) / (A + B) = (12 \u00b7 24) / 36 = 288 / 36 = 8 days.",
        "formulaContext": "Time = (A \u00b7 B) / (A + B)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Time and Work",
        "subtopic": "Combined Work Efficiency"
      },
      {
        "id": "gs-q-097",
        "sourceType": "MODELLED",
        "stem": "Two trains 140 m and 160 m long are running towards each other on parallel tracks at speeds of 60 km/h and 48 km/h respectively. In how many seconds will they completely cross each other?",
        "options": [
          {
            "id": "A",
            "text": "10 seconds"
          },
          {
            "id": "B",
            "text": "12 seconds"
          },
          {
            "id": "C",
            "text": "15 seconds"
          },
          {
            "id": "D",
            "text": "8 seconds"
          }
        ],
        "correctOption": "A",
        "explanation": "Total distance to cross = sum of lengths = 140 + 160 = 300 m. Since moving in opposite directions, Relative Speed = 60 + 48 = 108 km/h = 108 \u00b7 (5/18) = 30 m/s. Time to cross = Distance / Relative Speed = 300 / 30 = 10 seconds.",
        "formulaContext": "Time = (L1 + L2) / (S1 + S2)",
        "difficulty": "MEDIUM",
        "examSource": "Testbook Model / State PSC GS Paper I 2023",
        "topic": "Time, Speed & Distance",
        "subtopic": "Relative Speed of Trains"
      },
      {
        "id": "gs-q-098",
        "sourceType": "MODELLED",
        "stem": "The average age of 24 students in a study group is 15 years. When the teacher's age is included, the average increases by 1 year. What is the teacher's age?",
        "options": [
          {
            "id": "A",
            "text": "40 years"
          },
          {
            "id": "B",
            "text": "38 years"
          },
          {
            "id": "C",
            "text": "42 years"
          },
          {
            "id": "D",
            "text": "35 years"
          }
        ],
        "correctOption": "A",
        "explanation": "Total age of 24 students = 24 \u00b7 15 = 360 years. When teacher is added, total persons = 25 and new average = 16 years. Total age = 25 \u00b7 16 = 400 years. Teacher's age = 400 - 360 = 40 years. Shortcut: New Member Age = Old Average + New Count \u00b7 Increase = 15 + 25 \u00b7 1 = 40 years.",
        "formulaContext": "New Member Age = Old Avg + (Total Count \u00b7 Change)",
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Averages",
        "subtopic": "Average Age with Inclusion"
      },
      {
        "id": "gs-q-099",
        "sourceType": "MODELLED",
        "stem": "Statements: (1) All engineers are graduates. (2) Some graduates are researchers. Conclusions: I. Some researchers are graduates. II. All engineers are researchers. Which conclusion(s) logically follow?",
        "options": [
          {
            "id": "A",
            "text": "Only Conclusion I follows"
          },
          {
            "id": "B",
            "text": "Only Conclusion II follows"
          },
          {
            "id": "C",
            "text": "Both I and II follow"
          },
          {
            "id": "D",
            "text": "Neither I nor II follows"
          }
        ],
        "correctOption": "A",
        "explanation": "Statement 2 'Some graduates are researchers' immediately converts to 'Some researchers are graduates' (Conclusion I is valid). There is no middle term distribution guaranteeing that all engineers are researchers, so Conclusion II does not follow.",
        "formulaContext": null,
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2023",
        "topic": "Logical Reasoning",
        "subtopic": "Syllogism Deductions"
      },
      {
        "id": "gs-q-100",
        "sourceType": "MODELLED",
        "stem": "What is the next number in the logical sequence: 3, 7, 15, 31, 63, ?",
        "options": [
          {
            "id": "A",
            "text": "127"
          },
          {
            "id": "B",
            "text": "125"
          },
          {
            "id": "C",
            "text": "128"
          },
          {
            "id": "D",
            "text": "120"
          }
        ],
        "correctOption": "A",
        "explanation": "Pattern: Each number is obtained by multiplying the previous number by 2 and adding 1 (2n + 1), or adding successive powers of 2 (+4, +8, +16, +32, +64). Hence next number = 63 \u00b7 2 + 1 = 126 + 1 = 127 (or 63 + 64 = 127).",
        "formulaContext": "an = 2 \u00b7 an-1 + 1",
        "difficulty": "EASY",
        "examSource": "Testbook Model / State PSC GS Paper I 2024",
        "topic": "Logical Reasoning",
        "subtopic": "Number Series Progression"
      }
    ],
    "unitName": "Quantitative Aptitude & Reasoning",
    "codeClause": "Standard Mathematical Reasoning Framework",
    "confidencePercent": 82,
    "masteredStatus": "Mastered",
    "diagramType": "som",
    "subtopicList": [
      "Number Systems, Divisibility Rules & HCF/LCM",
      "Percentages, Successive Discounts & Profit-Loss",
      "Simple vs Compound Interest Formulas",
      "Time, Speed, Distance & Relative Velocity",
      "Time and Work, Unitary Method & Pipes-Cisterns",
      "Logical Syllogisms & Direction Sense"
    ],
    "comparisonGrid": {
      "titleLeft": "Simple Interest (SI)",
      "tagLeft": "Linear Growth",
      "valueLeft": "SI = (P \u00b7 R \u00b7 T) / 100",
      "descLeft": "Interest is calculated solely on original principal each year; interest amount remains constant throughout the loan term.",
      "titleRight": "Compound Interest (CI)",
      "tagRight": "Exponential Growth",
      "valueRight": "A = P \u00b7 (1 + R/100)^T",
      "descRight": "Interest is added back to principal at compounding intervals; interest earns interest; 2-year difference between CI and SI is P*(R/100)\u00b2."
    },
    "callouts": {
      "corePostulate": "For any two numbers A and B: Product of the two numbers is equal to the product of their HCF and LCM: A * B = HCF(A, B) * LCM(A, B).",
      "corePostulateRef": "Number Theory Fundamentals",
      "examTrap": "If speed increases by a fraction x/y, the time taken for the same travel distance decreases by x / (x + y), NOT by x/y!",
      "examTrapRef": "Speed-Time Aptitude Trap",
      "testedRatios": [
        {
          "label": "Difference CI - SI (2 Years):",
          "value": "D2 = P \u00b7 (R / 100)\u00b2"
        },
        {
          "label": "Difference CI - SI (3 Years):",
          "value": "D3 = P \u00b7 (R/100)\u00b2 \u00b7 (3 + R/100)"
        },
        {
          "label": "Price Increase R% -> Consumption Cut:",
          "value": "(R / (100 + R)) \u00b7 100%"
        },
        {
          "label": "Relative Speed (Opposite Direction):",
          "value": "S1 + S2"
        }
      ],
      "numericalShortcut": {
        "formula": "Time & Work: If A does work in 'a' days and B in 'b' days, together they take (a \u00b7 b) / (a + b) days",
        "note": "For three workers A, B, C: Time together = (a \u00b7 b \u00b7 c) / (ab + bc + ca) days."
      }
    },
    "aiTutorPrompts": [
      {
        "question": "How do you quickly solve upstream and downstream boat speed problems?",
        "answerPreview": "Speed in still water = (Downstream speed + Upstream speed) / 2. Speed of stream current = (Downstream speed - Upstream speed) / 2."
      },
      {
        "question": "What is the shortcut for successive percentage changes of +a% and +b%?",
        "answerPreview": "Net percentage change = (a + b + (a * b) / 100)%. For a discount of d1% and d2%, effective discount is (d1 + d2 - (d1 * d2) / 100)%."
      }
    ]
  }
];

/**
 * Modules for the subjects the original set never covered. They live in their
 * own files so this data file stays a data file, and are merged here so every
 * consumer keeps importing a single array.
 */
export const TOPIC_KNOWLEDGE_MODULES: KnowledgeModule[] = [
  ...BASE_KNOWLEDGE_MODULES,
  ...FOUNDATION_CIVIL_MODULES,
  ...INFRASTRUCTURE_CIVIL_MODULES
];

export const CIVIL_KNOWLEDGE_MODULES = TOPIC_KNOWLEDGE_MODULES.filter(m => m.category === 'civil');
export const GS_KNOWLEDGE_MODULES = TOPIC_KNOWLEDGE_MODULES.filter(m => m.category === 'gs');
