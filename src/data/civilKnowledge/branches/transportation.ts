import type { CivilKnowledgeConcept, CivilKnowledgeSubject } from '../../../types/civilKnowledge';
import { CIVIL_FORMULA_BANK } from '../banks/formulaBank';
import { CIVIL_CONCEPT_TRAP_BANK } from '../banks/conceptTrapBank';

export const TRANSPORTATION_CONCEPTS: CivilKnowledgeConcept[] = [
  {
    id: 'ck-trans-001',
    slug: 'highway-geometric-design-superelevation',
    title: 'Highway Geometric Design: Super-Elevation & Transition Curves (IRC:73)',
    branchId: 'transportation',
    branchName: 'Transportation & Highway Engineering',
    subject: 'Transportation Engineering',
    unit: 'Unit 1: Highway Geometric Design',
    chapter: 'Chapter 1.2: Horizontal Alignment & Super-Elevation',
    topic: 'Super-Elevation & Curve Design',
    subtopic: 'Centrifugal Ratio, IRC Mixed Traffic Design & Transition Curves',
    difficulty: 'STATE_AE_JE',
    keywords: ['IRC:73', 'super-elevation', 'stopping sight distance', 'transition curve', 'centrifugal force', 'camber'],
    theory: {
      summary: 'In-depth geometric design of highway horizontal curves in accordance with Indian Roads Congress (IRC:73 & IRC:86) standards, detailing equilibrium super-elevation, mixed-traffic design, and spiral transition curves.',
      definitions: [
        'Super-Elevation (e): Inward transverse cant or banking provided along the entire cross-section of a highway on a horizontal curve by raising the outer edge of the pavement with respect to the inner edge.',
        'Centrifugal Ratio (P/W): The ratio of outward overturning centrifugal force to the vehicle weight: P / W = v² / (g · R).',
        'Equilibrium Super-Elevation: The exact rate of banking where the lateral component of vehicle self-weight completely balances the outward centrifugal force, resulting in zero lateral friction (f = 0) and uniform tire pressure on inner and outer wheels.',
        'Transition Curve: A curve of continuously varying radius (from infinity at the tangent to R at the circular curve) inserted between a straight road and a circular curve.'
      ],
      principlesAndLaws: [
        'Dynamic Equilibrium on Curve: At speed v on radius R, centrifugal force P = m·v²/R acts outwards horizontally at the vehicle\'s center of gravity. Resolving forces parallel to the inclined road surface inclined at angle theta gives: e + f = v² / (g · R).',
        'In metric highway units (speed V in km/h, radius R in meters): e + f = V² / (127 · R).'
      ],
      governingAssumptions: [
        'Vehicles travel at the designated highway design speed without lateral skidding or overturning.',
        'Lateral friction factor f between rubber tires and bituminous/concrete surface does not exceed the safe limit of 0.15 as codified by IRC.',
        'Vehicle center of gravity height h is sufficiently small compared to track width B (b/2h > e + f) to prevent overturning prior to skidding.'
      ],
      detailedExplanation: 'IRC:73 Step-by-Step Practical Design Method for Mixed Traffic:\n1. Step 1: In Indian conditions where slow non-motorized and fast motorized vehicles share the carriageway, super-elevation is designed by completely neglecting lateral friction (f = 0) for 75% of the design speed:\n   e_design = (0.75 · V)² / (127 · R) = V² / (225 · R)\n\n2. Step 2: Check against maximum allowable limits (e_max):\n   - Plain and rolling terrain: e_max = 0.07 (7%)\n   - Hilly terrain not bound with snow: e_max = 0.10 (10%)\n   - Urban roads with frequent intersections: e_max = 0.04 (4%)\n   If e_design <= e_max, provide e_design.\n\n3. Step 3: If e_design > e_max, set e = e_max and check lateral friction f at full design speed V:\n   f = [V² / (127 · R)] - e_max\n   If f <= 0.15, the design is safe with e = e_max and f as calculated.\n\n4. Step 4: If f > 0.15, the curve cannot safely accommodate the design speed. The speed must be restricted to the safe ruling speed:\n   V_safe = sqrt[127 · R · (e_max + 0.15)].',
      derivationSteps: [
        '1. Free body diagram on tilted road: Normal reaction N, weight W downward, centrifugal force P outward, friction F inward along road plane.',
        '2. Resolve along incline: P · cos(theta) - W · sin(theta) - F = 0.',
        '3. Substitute F = f · N and N ≈ W · cos(theta) + P · sin(theta).',
        '4. For small angles: sin(theta) ≈ tan(theta) = e, cos(theta) ≈ 1.',
        '5. P - W · e - f · W = 0  =>  P / W = e + f.',
        '6. Since P / W = (m·v²/R) / (m·g) = v² / (g·R): e + f = v² / (g·R).',
        '7. Convert v (m/s) to V (km/h): v = V / 3.6  =>  v² / (g·R) = (V/3.6)² / (9.81·R) = V² / (127.13 R) ≈ V² / (127 R).'
      ],
      applications: [
        'Geometric design of National Highways, State Highways, and Expressways (IRC:73 & IRC:SP:84/87).',
        'High-speed railway track banking (cant design) to prevent rail flange climbing and passenger discomfort.'
      ],
      limitations: [
        'Providing excessively steep super-elevation on slow-moving bullock carts or trucks can cause inward overturning when stopped.'
      ],
      comparisons: [
        {
          aspect: 'Equilibrium vs Mixed Traffic Super-Elevation',
          itemA: { label: 'Equilibrium Super-Elevation', value: 'e = V² / (127 R). Friction f = 0 at full design speed V. Outer & inner wheels share equal weight.' },
          itemB: { label: 'IRC Mixed Traffic Super-Elevation', value: 'e = V² / (225 R). Evaluated for 75% speed. Standard design rule on all Indian roads.' }
        }
      ]
    },
    diagrams: [
      {
        id: 'diag-super-001',
        title: 'Vehicle Dynamic Equilibrium on Super-Elevated Road Curve',
        format: 'ASCII',
        content: `
                         Centrifugal Force P = m V^2 / R (Outward)
                                        <====[ CG ]====>
                                                |
                                                | Weight W = m g (Downward)
                  /-----------------------------v
                 /      [ VEHICLE ]
                /           |
               /   Friction | (Inward F = f*N)
              /  <----------+
             /                     Outer Edge Raised by E = e * B
            /                      |
           / theta                 |
   -------+------------------------+-----------------------------------
   Datum  <========== Carriageway Width B ==========>
        `,
        caption: 'Resolution of weight, centrifugal force, normal reaction, and tire-pavement friction.'
      }
    ],
    formulas: [CIVIL_FORMULA_BANK[13], CIVIL_FORMULA_BANK[14]],
    codeProvisions: [
      {
        standard: 'IRC:73-1980',
        clauseOrTable: 'Cl. 6.3 & Table 12',
        title: 'Maximum and Minimum Super-Elevation for Rural Highways',
        provisionText: 'The maximum super-elevation rate shall be 7% in plain and rolling terrain and 10% in mountainous and steep terrain. The minimum super-elevation shall not be less than the normal cross-slope (camber) of the pavement to ensure adequate surface drainage.',
        isMandatory: true
      },
      {
        standard: 'IRC:73-1980',
        clauseOrTable: 'Cl. 6.4 & Table 14',
        title: 'Transition Curves on Horizontal Alignment',
        provisionText: 'The transition curve should ideally be an Euler spiral (clothoid) where curvature increases linearly with arc length. The rate of change of centrifugal acceleration (C) shall lie between 0.50 and 0.80 m/s^3 as given by C = 80 / (75 + V).',
        isMandatory: true
      }
    ],
    workedExamples: [
      {
        id: 'we-trans-001',
        title: 'IRC Super-Elevation Design on a National Highway Curve',
        problemStatement: 'Design the super-elevation for a horizontal curve of radius R = 300 m on a two-lane National Highway in plain terrain with a design speed V = 80 km/h as per IRC:73 recommendations.',
        givenData: {
          'Design speed (V)': '80 km/h',
          'Curve radius (R)': '300 m',
          'Terrain': 'Plain terrain (max e = 0.07)',
          'Max lateral friction (f_max)': '0.15'
        },
        governingFormulas: [
          'Step 1 (IRC Mixed traffic): e = V^2 / (225 * R)',
          'Step 2: Compare with e_max = 0.07',
          'Step 3 (If e > e_max): Set e = 0.07 and check f = [V^2 / (127 * R)] - 0.07'
        ],
        stepByStepSolution: [
          'Step 1: Compute super-elevation for 75% design speed (neglecting friction):\ne = (80)^2 / (225 * 300) = 6400 / 67500 = 0.0948 (9.48%).',
          'Step 2: Compare with maximum allowable limit e_max:\nFor plain terrain, e_max = 0.07 (7.0%).\nSince 0.0948 > 0.07, provide maximum super-elevation: e = 0.07.',
          'Step 3: Check lateral friction f developed at full design speed (80 km/h) with e = 0.07:\nf = [V^2 / (127 * R)] - e = [(80)^2 / (127 * 300)] - 0.07 = [6400 / 38100] - 0.07 = 0.168 - 0.07 = 0.098.',
          'Step 4: Verify friction safety:\nSince f (0.098) <= f_max (0.15), the pavement is completely safe against lateral skidding with e = 0.07 (7.0%). No speed restriction is required.'
        ],
        finalAnswer: 'Design Super-Elevation e = 0.07 (7.0%), Lateral friction mobilized f = 0.098 <= 0.15 (Safe)',
        answerUnit: 'rate (-) & %',
        takeaway: 'The IRC practical design procedure safeguards both slow and fast vehicles. When 75% speed formula yields > 7%, capping at 7% and mobilizing partial friction keeps highway operations safe.',
        examProvenance: 'APSC AE Civil 2024 / UPSC ESE'
      }
    ],
    conceptTraps: [CIVIL_CONCEPT_TRAP_BANK[4]],
    quickRevisionFacts: [
      'IRC mixed traffic super-elevation: e = V² / (225 R).',
      'Maximum super-elevation: 7% (Plain/Rolling), 10% (Hilly), 4% (Urban with intersections).',
      'Length of transition curve: L = V³ / (47 * C * R), where rate of centrifugal acceleration C = 80 / (75 + V).'
    ],
    prerequisites: ['Centrifugal Force & Inertia', 'Friction Mechanics'],
    relatedConceptSlugs: ['stopping-sight-distance', 'highway-pavement-design-irc37', 'traffic-signal-webster'],
    downstreamApplications: ['Highway Alignment & Route Siting', 'Mountain Road Geometric Design']
  }
];

export const TRANSPORTATION_SUBJECTS: CivilKnowledgeSubject[] = [
  {
    id: 'subj-trans-engg',
    name: 'Transportation & Highway Engineering',
    branchId: 'transportation',
    branchName: 'Transportation & Highway Engineering',
    description: 'Highway geometric design, pavement design (IRC 37 & IRC 58), traffic engineering, railways, and airport runway design.',
    weightageRank: 8,
    totalConcepts: 22,
    standardCodes: ['IRC:73-1980', 'IRC:37:2018', 'IRC:58:2015', 'IRC:86-1983'],
    units: [
      {
        id: 'u-te-1',
        unitNumber: 1,
        title: 'Highway Geometric Design & Alignments',
        subject: 'Transportation & Highway Engineering',
        chapters: [
          {
            id: 'ch-te-1',
            chapterNumber: 1,
            title: 'Horizontal Curves & Super-Elevation (IRC:73)',
            subject: 'Transportation & Highway Engineering',
            unit: 'Highway Geometric Design & Alignments',
            overview: 'Super-elevation mechanics, IRC mixed traffic formula, transition spirals, and sight distances.',
            conceptSlugs: ['highway-geometric-design-superelevation']
          }
        ]
      }
    ]
  }
];
