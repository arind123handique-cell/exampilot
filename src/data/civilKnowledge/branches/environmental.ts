import type { CivilKnowledgeConcept, CivilKnowledgeSubject } from '../../../types/civilKnowledge';
import { CIVIL_FORMULA_BANK } from '../banks/formulaBank';
import { CIVIL_CONCEPT_TRAP_BANK } from '../banks/conceptTrapBank';

export const ENVIRONMENTAL_CONCEPTS: CivilKnowledgeConcept[] = [
  {
    id: 'ck-env-001',
    slug: 'bod-kinetics-streeter-phelps',
    title: 'Biochemical Oxygen Demand (BOD) Kinetics & River Dissolved Oxygen Sag',
    branchId: 'environmental',
    branchName: 'Environmental & Public Health Engineering',
    subject: 'Environmental Engineering',
    unit: 'Unit 2: Wastewater Engineering & Quality',
    chapter: 'Chapter 2.1: Organic Decomposition & BOD Kinetics',
    topic: 'BOD Kinetics & Streeter-Phelps Model',
    subtopic: 'First-Order Deoxygenation, Reaeration & Critical DO Deficit',
    difficulty: 'GATE_IES',
    keywords: ['BOD kinetics', 'ultimate BOD', 'Streeter-Phelps', 'oxygen sag curve', 'critical deficit', 'IS 10500'],
    theory: {
      summary: 'Mathematical formulation of organic matter decomposition in wastewater, first-order biochemical oxygen demand (BOD) exertion, and the classic Streeter-Phelps dissolved oxygen sag analysis in self-purifying rivers.',
      definitions: [
        'Biochemical Oxygen Demand (BOD): Milligrams of oxygen consumed per liter by aerobic bacteria in biochemically oxidizing organic matter over time t at a specific temperature (standard: 5 days at 20°C).',
        'Ultimate Carbonaceous BOD (L0): Total oxygen demand exerted when all carbonaceous organic matter has been completely oxidized as t -> infinity.',
        'Initial DO Deficit (D0): The difference between saturated dissolved oxygen concentration (DO_sat) and the actual initial DO of the river-waste mixture: D0 = DO_sat - DO_mix.',
        'Critical DO Deficit (Dc): The maximum oxygen deficit occurring at critical time tc where deoxygenation rate equals reaeration rate.'
      ],
      principlesAndLaws: [
        'First-Order Deoxygenation Law: The rate of biochemical oxidation of organic matter is directly proportional to the amount of unoxidized organic matter remaining at that instant: dL/dt = -K · L.',
        'Streeter-Phelps Oxygen Balance: Net rate of change of dissolved oxygen deficit in a stream equals deoxygenation rate minus reaeration rate: dD/dt = K_d · L - K_r · D.'
      ],
      governingAssumptions: [
        'Wastewater discharge mixes instantaneously and uniformly across the entire river cross-section.',
        'Flow is steady, 1-dimensional, with constant cross-sectional area and uniform velocity.',
        'Deoxygenation is purely a first-order chemical reaction driven by carbonaceous demand; nitrogenous demand (nitrification) is suppressed during the first 5-8 days.',
        'Atmospheric reaeration follows Fick\'s law of diffusion and is proportional to the prevailing oxygen deficit.'
      ],
      detailedExplanation: 'Solving the differential equation dL/dt = -k · L gives the unoxidized organic matter remaining: L_t = L_0 · e^(-k_e · t) = L_0 · 10^(-K_D · t).\nThe BOD exerted (consumed) in time t is:\n   y_t = L_0 - L_t = L_0 · [1 - 10^(-K_D · t)]\n\nTemperature correction for rate constant K_D:\n   K_(D, T) = K_(D, 20) · (1.047)^(T - 20)\n\nStreeter-Phelps Equation for DO Deficit D(t) at time of travel t:\n   D(t) = [K_d · L_0 / (K_r - K_d)] · [e^(-K_d · t) - e^(-K_r · t)] + D_0 · e^(-K_r · t)\n\nAt the critical point (dD/dt = 0), the critical time t_c is:\n   t_c = [1 / (K_r - K_d)] · ln[(K_r / K_d) · (1 - D_0 · (K_r - K_d) / (K_d · L_0))]\nand critical deficit D_c satisfies:\n   D_c = (K_d / K_r) · L_0 · e^(-K_d · t_c).',
      derivationSteps: [
        '1. Rate of organic matter decay: dL/dt = -K_d · L.',
        '2. Integrate from t = 0 (where L = L0) to time t: ln(L_t / L_0) = -K_d · t  =>  L_t = L_0 · e^(-K_d · t).',
        '3. Exerted BOD y_t = L_0 - L_t = L_0 · (1 - e^(-K_d · t)).',
        '4. Streeter-Phelps balance: dD/dt = K_d · L_t - K_r · D = K_d · L_0 · e^(-K_d · t) - K_r · D.',
        '5. Rearrange as linear 1st order ODE: dD/dt + K_r · D = K_d · L_0 · e^(-K_d · t).',
        '6. Integrating factor IF = e^(integral K_r dt) = e^(K_r · t).',
        '7. Multiply by IF and integrate to obtain the universal Streeter-Phelps deficit equation.'
      ],
      applications: [
        'Setting maximum permissible effluent discharge standards for industrial and municipal wastewater treatment plants.',
        'River water quality modeling and environmental impact assessments (EIA).'
      ],
      limitations: [
        'Does not include photosynthetic oxygen production by algae or sediment oxygen demand (SOD) from benthal sludge blankets.'
      ],
      comparisons: [
        {
          aspect: 'BOD vs COD',
          itemA: { label: 'BOD (Biochemical Oxygen Demand)', value: 'Measures only biodegradable organic matter through microbial respiration. Takes 5 days.' },
          itemB: { label: 'COD (Chemical Oxygen Demand)', value: 'Measures both biodegradable and non-biodegradable organics using potassium dichromate (K2Cr2O7) in acid. Takes 2-3 hours. COD > BOD always.' }
        }
      ]
    },
    diagrams: [
      {
        id: 'diag-sag-001',
        title: 'Streeter-Phelps Dissolved Oxygen (DO) Sag Curve in a Stream',
        format: 'ASCII',
        content: `
   DO Conc (mg/L)
     |
  Sat|======================== DO Saturated Level =========================
     |\\  D0 (Initial Deficit)
     | \\
     |  \\       Deoxygenation dominant
     |   \\                                     Reaeration dominant
     |    \\                                      /-----------------
     |     \\                                    /
     |      \\          Critical Deficit Dc     /
     |       \\             |<-------->|       /
     |        \\____________+                  /
   Min|                     \\                /
     |                       \\______________/  <--- CRITICAL POINT (t = tc)
     +-------------------------------------------------------------------->
                             Time of Travel (or Distance downstream x = V*t)
        `,
        caption: 'Classic oxygen sag curve showing initial deficit D0, minimum DO at critical time tc, and river recovery.'
      }
    ],
    formulas: [CIVIL_FORMULA_BANK[12]],
    codeProvisions: [
      {
        standard: 'CPHEEO Wastewater Manual',
        clauseOrTable: 'Ch. 3 & CPCB Standards',
        title: 'General Standards for Discharge of Environmental Pollutants into Inland Surface Water',
        provisionText: 'BOD (5 days at 20°C) shall not exceed 30 mg/L. Total Suspended Solids (TSS) shall not exceed 100 mg/L. COD shall not exceed 250 mg/L. pH must lie between 5.5 and 9.0.',
        isMandatory: true
      },
      {
        standard: 'IS 10500:2012',
        clauseOrTable: 'Table 1 & 2',
        title: 'Drinking Water Quality Limits',
        provisionText: 'Acceptable limit for Nitrate: 45 mg/L with NO relaxation (causes methemoglobinemia). Fluoride: 1.0 mg/L acceptable, 1.5 mg/L max permissible.',
        isMandatory: true
      }
    ],
    workedExamples: [
      {
        id: 'we-env-001',
        title: 'Calculation of 5-Day BOD and Ultimate BOD',
        problemStatement: 'A wastewater sample is diluted with nutrient water. In a 5-day BOD test at 20°C, the initial dissolved oxygen (DO_i) is 8.5 mg/L and the final DO after 5 days (DO_f) is 3.0 mg/L. The dilution factor is 50 (i.e. 2% wastewater concentration). Given the base-10 deoxygenation rate constant K_D = 0.10 day^-1 at 20°C, determine the 5-day BOD (BOD5) and the ultimate carbonaceous BOD (L0).',
        givenData: {
          'Initial DO': '8.5 mg/L',
          'Final DO at 5 days': '3.0 mg/L',
          'Dilution factor (DF)': '50',
          'Rate constant (K_D, base 10)': '0.10 day^-1',
          'Incubation time (t)': '5 days'
        },
        governingFormulas: [
          'BOD5 = (DO_i - DO_f) * Dilution Factor',
          'BOD5 = L0 * [1 - 10^(-K_D * t)]',
          'L0 = BOD5 / [1 - 10^(-K_D * t)]'
        ],
        stepByStepSolution: [
          'Step 1: Compute 5-day BOD of the wastewater:\nBOD5 = (8.5 - 3.0) mg/L * 50 = 5.5 mg/L * 50 = 275.0 mg/L.',
          'Step 2: Compute exertion factor [1 - 10^(-K_D * t)]:\nExponent = - (0.10 * 5) = -0.50.\n10^(-0.50) = 1 / sqrt(10) = 1 / 3.16228 = 0.31623.\nExertion factor = 1 - 0.31623 = 0.68377 (meaning 68.38% of ultimate BOD is exerted in 5 days).',
          'Step 3: Calculate ultimate carbonaceous BOD (L0):\nL0 = BOD5 / 0.68377 = 275.0 / 0.68377 = 402.18 mg/L.'
        ],
        finalAnswer: '5-Day BOD = 275.0 mg/L, Ultimate BOD L0 = 402.2 mg/L',
        answerUnit: 'mg/L',
        takeaway: 'At 20°C with standard K_D = 0.10 day^-1, the 5-day BOD represents roughly 68.4% of the ultimate BOD. The ratio L0 / BOD5 is approximately 1.46.',
        examProvenance: 'UPSC ESE 2022 / GATE Civil'
      }
    ],
    conceptTraps: [
      {
        id: 'trap-env-temp',
        subject: 'Environmental Engineering',
        topic: 'BOD Temperature Adjustment',
        branch: 'Environmental & Sanitary',
        trapTitle: 'Incorrect Temperature Exponent for BOD Rate',
        commonMistake: 'Multiplying BOD directly by temperature ratio instead of adjusting the rate constant K_D.',
        correctConcept: 'Ultimate BOD (L0) is independent of temperature! Temperature only changes the speed (rate constant K_T = K_20 * 1.047^(T-20)).',
        whyCandidatesFail: 'Confusing the chemical speed of microbial digestion with the total amount of digestible food present in the waste.',
        preventionRule: 'L0 remains constant at any temperature; only K_D changes with temperature.'
      }
    ],
    quickRevisionFacts: [
      'BOD_t = L0 * [1 - 10^(-K_D · t)]. At 20°C with K_D = 0.1 /day, BOD5 ≈ 0.684 L0.',
      'Nitrate in drinking water must NOT exceed 45 mg/L (infant blue-baby disease / methemoglobinemia).',
      'Fluoride: 1.0 - 1.5 mg/L prevents cavities; > 1.5 mg/L causes dental fluorosis; > 3.0 causes skeletal fluorosis.'
    ],
    prerequisites: ['First-Order Chemical Kinetics', 'Fluid Transport & Dispersion'],
    relatedConceptSlugs: ['activated-sludge-process', 'water-treatment-filtration', 'cpheeo-sewer-design'],
    downstreamApplications: ['Effluent Treatment Plant (ETP) Design', 'River Basin Pollution Control']
  }
];

export const ENVIRONMENTAL_SUBJECTS: CivilKnowledgeSubject[] = [
  {
    id: 'subj-env-engg',
    name: 'Environmental Engineering',
    branchId: 'environmental',
    branchName: 'Environmental & Public Health Engineering',
    description: 'Water quality parameters, water treatment, wastewater treatment, BOD kinetics, sewer design, and solid waste management.',
    weightageRank: 7,
    totalConcepts: 24,
    standardCodes: ['IS 10500:2012', 'CPHEEO Water & Sewerage Manuals', 'CPCB Standards'],
    units: [
      {
        id: 'u-env-1',
        unitNumber: 1,
        title: 'Wastewater Engineering & River Self-Purification',
        subject: 'Environmental Engineering',
        chapters: [
          {
            id: 'ch-env-1',
            chapterNumber: 1,
            title: 'BOD Kinetics & Oxygen Sag Analysis',
            subject: 'Environmental Engineering',
            unit: 'Wastewater Engineering & River Self-Purification',
            overview: 'First-order deoxygenation, ultimate BOD, Streeter-Phelps river DO sag curve, and critical deficit.',
            conceptSlugs: ['bod-kinetics-streeter-phelps']
          }
        ]
      }
    ]
  }
];
