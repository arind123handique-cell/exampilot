import type { CivilKnowledgeConcept, CivilKnowledgeSubject } from '../../../types/civilKnowledge';
import { CIVIL_FORMULA_BANK } from '../banks/formulaBank';
import { CIVIL_CONCEPT_TRAP_BANK } from '../banks/conceptTrapBank';

export const WATER_RESOURCES_CONCEPTS: CivilKnowledgeConcept[] = [
  {
    id: 'ck-hyd-001',
    slug: 'hydraulic-jump-energy-dissipation',
    title: 'Hydraulic Jump Mechanics & Energy Dissipation in Open Channels',
    branchId: 'water-resources',
    branchName: 'Water Resources & Fluid Mechanics',
    subject: 'Fluid Mechanics & Hydraulics',
    unit: 'Unit 3: Rapidly Varied Flow (RVF)',
    chapter: 'Chapter 3.1: The Hydraulic Jump',
    topic: 'Hydraulic Jump Mechanics',
    subtopic: 'Bélanger Equation, Sequent Depths & Jump Still Basin Design',
    difficulty: 'GATE_IES',
    keywords: ['hydraulic jump', 'Bélanger equation', 'sequent depth', 'energy dissipation', 'Froude number', 'spillway'],
    theory: {
      summary: 'Comprehensive analysis of the stationary hydraulic jump: a rapid transition from supercritical (Fr1 > 1) to subcritical (Fr2 < 1) open channel flow with severe energy dissipation.',
      definitions: [
        'Hydraulic Jump: An abrupt, turbulent standing surge formed when high-velocity supercritical flow is forced to transition into low-velocity subcritical flow.',
        'Initial Depth (y1): Depth of the supercritical flow entering immediately upstream of the jump toe.',
        'Sequent (Conjugate) Depth (y2): Depth of the calm subcritical flow immediately downstream of the jump roller.',
        'Specific Force (F): The sum of momentum flux per unit weight and hydrostatic thrust across the section: F = Q²/(g·A) + A·z_bar.'
      ],
      principlesAndLaws: [
        'Conservation of Momentum: Because internal hydraulic turbulence dissipates large amounts of mechanical energy, energy conservation cannot be directly applied across the jump. Instead, linear momentum conservation is applied, asserting that Specific Force F1 = F2.',
        'Bélanger Equation for Rectangular Channels: Equating specific force at sections 1 and 2 yields the exact quadratic solution relating the sequent depths: y2 / y1 = 0.5 · [sqrt(1 + 8 · Fr1²) - 1].'
      ],
      governingAssumptions: [
        'The open channel is prismatic, horizontal, and rectangular in cross-section.',
        'The length of the jump is relatively short, so boundary friction forces along the bed and walls are negligible compared to the sudden change in momentum.',
        'Velocity distribution is uniform and pressure distributions at the jump entrance (1) and exit (2) are purely hydrostatic.',
        'Flow is steady with no aeration affecting density.'
      ],
      detailedExplanation: 'Energy head loss in a rectangular jump is given by:\n   Delta_E = E1 - E2 = (y2 - y1)³ / (4 · y1 · y2)\n\nRelative energy dissipation (Delta_E / E1) increases rapidly with upstream Froude number:\n- Fr1 = 1.0 to 1.7: Undular jump (standing wavelets, < 5% energy loss).\n- Fr1 = 1.7 to 2.5: Weak jump (smooth surface, little turbulence, 5-15% loss).\n- Fr1 = 2.5 to 4.5: Oscillating jump (pulsating jet, irregular waves, avoid in design).\n- Fr1 = 4.5 to 9.0: Steady jump (stable, highly effective, 45-70% energy loss — ideal for stilling basins).\n- Fr1 > 9.0: Strong / Choppy jump (violent spray, rough bed, > 70% loss, requires massive baffle blocks).',
      derivationSteps: [
        '1. Specific force equation for rectangular channel of unit width: F = q²/(g·y) + y²/2.',
        '2. Momentum balance across jump: q²/(g·y1) + y1²/2 = q²/(g·y2) + y2²/2.',
        '3. Rearrange terms: q²/g · [1/y1 - 1/y2] = (y2² - y1²)/2  =>  q²/g · [(y2 - y1)/(y1·y2)] = (y2 - y1)(y2 + y1)/2.',
        '4. Divide both sides by (y2 - y1) ≠ 0: q² / (g · y1 · y2) = (y1 + y2) / 2.',
        '5. Express q in terms of upstream Froude number Fr1: q = V1 · y1 = Fr1 · sqrt(g · y1) · y1  =>  q² = Fr1² · g · y1³.',
        '6. Substitute q²: Fr1² · g · y1³ / (g · y1 · y2) = (y1 + y2) / 2  =>  Fr1² · (y1 / y2) = 0.5 (1 + y2/y1).',
        '7. Let r = y2 / y1: Fr1² / r = 0.5 (1 + r)  =>  r² + r - 2 Fr1² = 0.',
        '8. Quadratic formula solution (discarding negative root): y2 / y1 = 0.5 · [sqrt(1 + 8 Fr1²) - 1].'
      ],
      applications: [
        'Stilling basins at the foot of spillways and barrages to protect riverbeds from catastrophic downstream scour.',
        'Aeration of water supply and chemical flash mixing in wastewater treatment plants.'
      ],
      limitations: [
        'Bélanger\'s formula applies strictly to rectangular channels. For trapezoidal, triangular, or circular channels, numerical roots of F1 = F2 must be solved.'
      ],
      comparisons: [
        {
          aspect: 'Sequent Depths vs Alternate Depths',
          itemA: { label: 'Sequent (Conjugate) Depths', value: 'Depths across a hydraulic jump having identical Specific Force (F1 = F2). Energy is lost (E1 > E2).' },
          itemB: { label: 'Alternate Depths', value: 'Depths in smooth flow having identical Specific Energy (E1 = E2). No energy is lost.' }
        }
      ]
    },
    diagrams: [
      {
        id: 'diag-jump-001',
        title: 'Hydraulic Jump Cross-Section and Specific Force / Energy Curve',
        format: 'ASCII',
        content: `
                 Energy Head Loss Delta_E = (y2 - y1)^3 / (4 y1 y2)
                    <-------------------->
   E1 = y1 + V1^2/2g                           E2 = y2 + V2^2/2g
   -----------------\\
                     \\     Turbulent Roller
                      \\   ~~~~~~~~~~~~~~~~~~
                       \\ ~~~~~~~~~~~~~~~~~~~~
                        ~~~~~~~~~~~~~~~~~~~~~~------------------- (y2: Subcritical)
   (y1: Supercritical)   \\~~~~~~~~~~~~~~~~~~~
   -----------------------+
   =====[ TOE ]==================================================
           <-------------- Jump Length Lj ≈ 5 to 7 y2 ----------->
        `,
        caption: 'Hydraulic jump profile showing turbulent roller, conjugate depths y1 and y2, and head loss Delta_E.'
      }
    ],
    formulas: [CIVIL_FORMULA_BANK[8], CIVIL_FORMULA_BANK[9], CIVIL_FORMULA_BANK[10], CIVIL_FORMULA_BANK[11]],
    codeProvisions: [
      {
        standard: 'IS 4997:1968',
        clauseOrTable: 'Cl. 5.1 & Table 1',
        title: 'Criteria for Design of Hydraulic Jump Type Stilling Basins',
        provisionText: 'USBR Type II basins are recommended for high spillways with Fr1 > 4.5 and V1 > 15 m/s. USBR Type III basins with chute blocks, baffle piers, and end sills are recommended for Fr1 > 4.5 and V1 <= 15 m/s to shorten the basin length by up to 60%.',
        isMandatory: true
      }
    ],
    workedExamples: [
      {
        id: 'we-jump-001',
        title: 'Calculation of Post-Jump Depth and Energy Loss',
        problemStatement: 'Water discharges over an overflow spillway into a horizontal rectangular concrete channel of width 6.0 m. At the toe of the spillway, flow depth is measured as 0.40 m and velocity is 12.0 m/s. Determine the post-jump sequent depth y2, the Froude number after the jump, and the power dissipated by the jump.',
        givenData: {
          'Channel width (B)': '6.0 m',
          'Upstream depth (y1)': '0.40 m',
          'Upstream velocity (V1)': '12.0 m/s',
          'Gravitational acceleration (g)': '9.81 m/s^2',
          'Water density (rho)': '1000 kg/m^3'
        },
        governingFormulas: [
          'Fr1 = V1 / sqrt(g * y1)',
          'y2 / y1 = 0.5 * [sqrt(1 + 8 * Fr1^2) - 1]',
          'Delta_E = (y2 - y1)^3 / (4 * y1 * y2)',
          'Power = rho * g * Q * Delta_E (Watts)'
        ],
        stepByStepSolution: [
          'Step 1: Compute upstream Froude number Fr1:\nFr1 = 12.0 / sqrt(9.81 * 0.40) = 12.0 / sqrt(3.924) = 12.0 / 1.9809 = 6.058.',
          'Step 2: Calculate sequent depth y2 using Bélanger equation:\ny2 / y1 = 0.5 * [sqrt(1 + 8 * (6.058)^2) - 1] = 0.5 * [sqrt(1 + 293.58) - 1] = 0.5 * [sqrt(294.58) - 1]\ny2 / y1 = 0.5 * (17.163 - 1) = 0.5 * 16.163 = 8.082\ny2 = 0.40 m * 8.082 = 3.233 m.',
          'Step 3: Calculate energy loss Delta_E:\nNumerator: (y2 - y1)^3 = (3.233 - 0.40)^3 = (2.833)^3 = 22.738 m^3.\nDenominator: 4 * y1 * y2 = 4 * 0.40 * 3.233 = 5.173 m^2.\nDelta_E = 22.738 / 5.173 = 4.395 m.',
          'Step 4: Compute discharge Q and power dissipated:\nQ = B * y1 * V1 = 6.0 * 0.40 * 12.0 = 28.80 m^3/s.\nPower = 1000 * 9.81 * 28.80 * 4.395 = 1,241,690 Watts = 1,241.7 kW = 1.24 MW.'
        ],
        finalAnswer: 'Sequent Depth y2 = 3.23 m, Energy Head Loss = 4.40 m, Power Dissipated = 1.24 MW',
        answerUnit: 'm & MW',
        takeaway: 'Because Fr1 = 6.06 falls into the range 4.5 - 9.0, a highly stable and effective steady hydraulic jump forms, dissipating over 1.2 Megawatts of destructive kinetic energy.',
        examProvenance: 'GATE Civil 2023 / UPSC ESE'
      }
    ],
    conceptTraps: [CIVIL_CONCEPT_TRAP_BANK[1], CIVIL_CONCEPT_TRAP_BANK[2]],
    quickRevisionFacts: [
      'Bélanger equation: y2/y1 = 0.5 * [sqrt(1 + 8 Fr1²) - 1].',
      'Head loss in jump: Delta_E = (y2 - y1)³ / (4 · y1 · y2).',
      'Jump occurs ONLY when upstream flow is supercritical (Fr1 > 1).'
    ],
    prerequisites: ['Specific Energy & Critical Depth', 'Momentum Conservation in Fluid Flow'],
    relatedConceptSlugs: ['gradually-varied-flow-profiles', 'spillway-design', 'sediment-transport'],
    downstreamApplications: ['Dam Stilling Basin Sizing', 'Irrigation Barrage Design']
  }
];

export const WATER_RESOURCES_SUBJECTS: CivilKnowledgeSubject[] = [
  {
    id: 'subj-fluid-mech',
    name: 'Fluid Mechanics & Hydraulics',
    branchId: 'water-resources',
    branchName: 'Water Resources & Fluid Mechanics',
    description: 'Fluid statics, kinematics, dynamics, pipe flow, boundary layer, open channel flow, and hydraulic jump.',
    weightageRank: 5,
    totalConcepts: 26,
    standardCodes: ['IS 10430:2000', 'IS 4997:1968'],
    units: [
      {
        id: 'u-fm-1',
        unitNumber: 1,
        title: 'Open Channel Flow & Rapidly Varied Flow',
        subject: 'Fluid Mechanics & Hydraulics',
        chapters: [
          {
            id: 'ch-fm-1',
            chapterNumber: 1,
            title: 'Hydraulic Jumps & Energy Dissipators',
            subject: 'Fluid Mechanics & Hydraulics',
            unit: 'Open Channel Flow & Rapidly Varied Flow',
            overview: 'Bélanger equation, sequent depths, energy head loss, jump classification, and stilling basin design.',
            conceptSlugs: ['hydraulic-jump-energy-dissipation']
          }
        ]
      }
    ]
  },
  {
    id: 'subj-hydro-irrig',
    name: 'Hydrology & Irrigation Engineering',
    branchId: 'water-resources',
    branchName: 'Water Resources & Fluid Mechanics',
    description: 'Precipitation, hydrographs, flood routing, crop water requirements, canal design (Lacey/Kennedy), and gravity dams.',
    weightageRank: 6,
    totalConcepts: 20,
    standardCodes: ['IS 4410', 'IS 6512:1984'],
    units: [
      {
        id: 'u-hi-1',
        unitNumber: 1,
        title: 'Crop Water Requirements & Canal Hydraulics',
        subject: 'Hydrology & Irrigation Engineering',
        chapters: [
          {
            id: 'ch-hi-1',
            chapterNumber: 1,
            title: 'Duty, Delta & Regime Canals',
            subject: 'Hydrology & Irrigation Engineering',
            unit: 'Crop Water Requirements & Canal Hydraulics',
            overview: 'Duty-Delta-Base period relations, Kennedy and Lacey regime equations, and silt factors.',
            conceptSlugs: ['hydraulic-jump-energy-dissipation']
          }
        ]
      }
    ]
  }
];
