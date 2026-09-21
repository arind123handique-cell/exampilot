import type { CivilKnowledgeConcept, CivilKnowledgeSubject } from '../../../types/civilKnowledge';
import { CIVIL_FORMULA_BANK } from '../banks/formulaBank';
import { CIVIL_CONCEPT_TRAP_BANK } from '../banks/conceptTrapBank';

export const GEOTECHNICAL_CONCEPTS: CivilKnowledgeConcept[] = [
  {
    id: 'ck-geo-001',
    slug: 'terzaghi-effective-stress-consolidation',
    title: 'Effective Stress Principle & Terzaghi 1D Consolidation Theory',
    branchId: 'geotechnical',
    branchName: 'Geotechnical & Foundation Engineering',
    subject: 'Geotechnical Engineering',
    unit: 'Unit 4: Soil Permeability & Consolidation',
    chapter: 'Chapter 4.2: One-Dimensional Consolidation',
    topic: 'Terzaghi 1D Consolidation Theory',
    subtopic: 'Excess Pore Pressure Dissipation, Time Factor & Settlement',
    difficulty: 'GATE_IES',
    keywords: ['Terzaghi', 'effective stress', 'consolidation', 'pore pressure', 'C_v', 'T_v', 'settlement'],
    theory: {
      summary: 'Karl Terzaghi\'s seminal consolidation theory explaining the time-dependent expulsion of pore water from saturated cohesive soils under sustained static overburden load.',
      definitions: [
        'Total Stress (sigma): Total vertical overburden weight per unit area including soil solids and water (sigma = gamma * z).',
        'Pore Water Pressure (u): Pressure of water filling the soil voids (u = gamma_w * h_w). Does not contribute to shear strength.',
        'Effective Stress (sigma\'): Intergranular contact stress carried by the soil skeleton: sigma\' = sigma - u.',
        'Primary Consolidation: Time-dependent reduction in volume of a saturated soil mass due to expulsion of water from void spaces.',
        'Coefficient of Consolidation (Cv): Parameter indicating the rate at which saturated clay undergoes consolidation: Cv = k / (m_v * gamma_w).'
      ],
      principlesAndLaws: [
        'Terzaghi Effective Stress Law: All measurable consequences of stress change (such as compression, distortion, and change in shear resistance) are exclusively due to changes in effective stress sigma\'.',
        'Hydrodynamic Spring Analogy: When load is suddenly applied to saturated clay, water carries 100% of the load instantaneously as excess pore water pressure (u_i = delta_sigma). Over time, as water drains through microscopic pore channels, excess pore pressure dissipates to zero and load transfers to the soil spring skeleton.'
      ],
      governingAssumptions: [
        'The clay stratum is homogeneous, completely saturated (S = 100%), and laterally confined.',
        'Water and soil solids are virtually incompressible compared to the skeletal volume decrease.',
        'Flow of water is strictly laminar and obeys Darcy\'s Law (v = k · i) vertically in one dimension.',
        'The coefficient of permeability k and coefficient of volume compressibility m_v remain constant during the consolidation process.'
      ],
      detailedExplanation: 'Terzaghi\'s one-dimensional consolidation partial differential equation is:\n   du / dt = C_v · (d²u / dz²)\nwhere u is excess pore water pressure at depth z and time t.\n\nDimensionless Time Factor (Tv):\n   T_v = (C_v · t) / (d_drainage)²\nwhere d_drainage is the maximum drainage path length:\n- Two-way drainage (permeable sand layers above and below clay of thickness H): d = H / 2\n- One-way drainage (impermeable rock at bottom, sand on top): d = H\n\nFor degree of consolidation U <= 60%:\n   T_v = (pi / 4) · (U / 100)²\nFor U > 60%:\n   T_v = 1.781 - 0.933 · log10(100 - U%).',
      derivationSteps: [
        '1. Consider a soil prism of cross-section A and thickness dz.',
        '2. Rate of inflow = v_z · A; Rate of outflow = [v_z + (dv_z/dz)dz] · A.',
        '3. Net volumetric loss of water: dV/dt = - (dv_z/dz) · A · dz.',
        '4. By Darcy\'s law, v_z = -k · (dh/dz) = -(k / gamma_w) · (du/dz)  =>  dv_z/dz = -(k / gamma_w) · (d²u/dz²).',
        '5. Volume change of soil skeleton: dV/dt = - m_v · (d_sigma\'/dt) · A · dz = - m_v · (- du/dt) · A · dz.',
        '6. Equating water expulsion to soil volume loss: (k / gamma_w) · (d²u/dz²) = m_v · (du/dt).',
        '7. Defining C_v = k / (m_v · gamma_w), we get: du / dt = C_v · (d²u / dz²).'
      ],
      applications: [
        'Predicting post-construction foundation settlement of buildings, bridges, and embankments over clay layers.',
        'Designing prefabricated vertical drains (PVDs) and preloading surcharges to accelerate ground improvement.'
      ],
      limitations: [
        'Assumes constant k and m_v, whereas in reality void ratio decreases and k reduces during consolidation.',
        'Does not account for secondary compression (creep of clay skeleton under constant effective stress).'
      ],
      comparisons: [
        {
          aspect: 'Drainage Condition Impact on Time',
          itemA: { label: 'Two-Way Drainage (d = H/2)', value: 'Time required is t_2 = (Tv * H^2) / (4 Cv). 4 times faster consolidation!' },
          itemB: { label: 'One-Way Drainage (d = H)', value: 'Time required is t_1 = (Tv * H^2) / Cv. Takes 4 times longer.' }
        }
      ]
    },
    diagrams: [
      {
        id: 'diag-geo-001',
        title: 'Terzaghi Consolidation Drainage Paths & Stress Dissipation',
        format: 'ASCII',
        content: `
       TWO-WAY DRAINAGE (d = H/2)                  ONE-WAY DRAINAGE (d = H)
   =================================          =================================
   ////// Permeable Sand Layer /////          ////// Permeable Sand Layer /////
   ---------------------------------          ---------------------------------
   ^                                          ^
   |  <--- Water drains upward                |  <--- Water drains upward
   |                                          |
   H  Clay Layer                              H  Clay Layer
   |                                          |
   |  <--- Water drains downward              |  (Impermeable rock below: no drainage)
   v                                          v
   ---------------------------------          =================================
   ////// Permeable Sand Layer /////          XXXXXXXX Impervious Rock XXXXXXXX
   =================================          =================================
   Drainage Path: d = H / 2                   Drainage Path: d = H
   Time taken: t_2 = (Tv * H^2) / (4 Cv)      Time taken: t_1 = 4 * t_2 (4X SLOWER!)
        `,
        caption: 'Drainage boundary conditions and their exponential impact on consolidation duration.'
      }
    ],
    formulas: [CIVIL_FORMULA_BANK[6], CIVIL_FORMULA_BANK[7]],
    codeProvisions: [
      {
        standard: 'IS 2720 (Part 15):1986',
        clauseOrTable: 'Cl. 6.2',
        title: 'Laboratory 1D Consolidation Test (Oedometer)',
        provisionText: 'Determines pre-consolidation pressure, compression index Cc, and coefficient of consolidation Cv over standard pressure increments 25, 50, 100, 200, 400, 800 kPa.',
        isMandatory: true
      },
      {
        standard: 'IS 1904:2021',
        clauseOrTable: 'Table 1',
        title: 'Permissible Total and Differential Settlement',
        provisionText: 'For isolated footings on clay: maximum total settlement is 65 mm (isolated) and 100 mm (raft). For buildings on sand: 40 mm (isolated) and 65 mm (raft).',
        isMandatory: true
      }
    ],
    workedExamples: [
      {
        id: 'we-geo-001',
        title: 'Consolidation Time Calculation for Clay Layer',
        problemStatement: 'A 4.0 m thick saturated clay stratum in the field has drainage at both top and bottom surfaces. Laboratory oedometer testing on a sample of the clay yielded a coefficient of consolidation C_v = 2.5 x 10^-3 cm^2/s. How many days will it take for the clay layer to reach 50% consolidation?',
        givenData: {
          'Clay thickness (H)': '4.0 m = 400 cm',
          'Drainage condition': 'Two-way drainage (d = H / 2 = 200 cm)',
          'Degree of consolidation (U)': '50% (U = 0.50)',
          'Coefficient of consolidation (C_v)': '2.5 x 10^-3 cm^2/s'
        },
        governingFormulas: [
          'For U <= 60%: T_v = (pi / 4) * (U / 100)^2',
          't = (T_v * d^2) / C_v'
        ],
        stepByStepSolution: [
          'Step 1: Compute dimensionless time factor T_v for U = 50%:\nT_v = (pi / 4) * (0.50)^2 = (3.14159 / 4) * 0.25 = 0.19635.',
          'Step 2: Determine drainage path length d:\nSince permeable boundaries exist at top and bottom: d = H / 2 = 400 cm / 2 = 200 cm.',
          'Step 3: Calculate time in seconds:\nt = (0.19635 * (200 cm)^2) / (2.5 x 10^-3 cm^2/s) = (0.19635 * 40000) / 0.0025 = 7854 / 0.0025 = 3,141,600 seconds.',
          'Step 4: Convert seconds to days:\nt_days = 3,141,600 / (86,400 s/day) = 36.36 days.'
        ],
        finalAnswer: 'Time to 50% consolidation = 36.4 days',
        answerUnit: 'days',
        takeaway: 'Notice that if the drainage were one-way, the drainage path would double (d = 400 cm) and the required time would quadruple to 145.4 days.',
        examProvenance: 'GATE Civil 2022 / UPSC ESE'
      }
    ],
    conceptTraps: [CIVIL_CONCEPT_TRAP_BANK[0]],
    quickRevisionFacts: [
      'Terzaghi effective stress: sigma\' = sigma - u. Water depth above ground does NOT change effective stress.',
      'Time factor Tv = (pi/4) * U² for U <= 60%. At U = 50%, Tv ≈ 0.197. At U = 90%, Tv ≈ 0.848.',
      'Drainage time varies with d²: two-way drainage consolidates 4x faster than one-way drainage.'
    ],
    prerequisites: ['Soil Permeability & Darcy\'s Law', 'Phase Relationships of Soil'],
    relatedConceptSlugs: ['shallow-foundation-bearing-capacity', 'pile-group-settlement', 'soil-liquefaction'],
    downstreamApplications: ['Building Foundation Settlement Analysis', 'Highway Embankment Preloading']
  }
];

export const GEOTECHNICAL_SUBJECTS: CivilKnowledgeSubject[] = [
  {
    id: 'subj-soil-mech',
    name: 'Soil Mechanics & Geotechnical Engineering',
    branchId: 'geotechnical',
    branchName: 'Geotechnical & Foundation Engineering',
    description: 'Soil classification, permeability, seepage, consolidation, compaction, shear strength, and earth pressure.',
    weightageRank: 3,
    totalConcepts: 22,
    standardCodes: ['IS 1498:1970', 'IS 2720 (Parts 1-40)'],
    units: [
      {
        id: 'u-sm-1',
        unitNumber: 1,
        title: 'Permeability, Seepage & Consolidation',
        subject: 'Soil Mechanics & Geotechnical Engineering',
        chapters: [
          {
            id: 'ch-sm-1',
            chapterNumber: 1,
            title: 'Effective Stress & Consolidation Settlement',
            subject: 'Soil Mechanics & Geotechnical Engineering',
            unit: 'Permeability, Seepage & Consolidation',
            overview: 'Terzaghi 1D consolidation theory, time factor, drainage path length, and secondary compression.',
            conceptSlugs: ['terzaghi-effective-stress-consolidation']
          }
        ]
      }
    ]
  },
  {
    id: 'subj-found-engg',
    name: 'Foundation Engineering',
    branchId: 'geotechnical',
    branchName: 'Geotechnical & Foundation Engineering',
    description: 'Bearing capacity of shallow footings, pile foundations, well foundations, retaining walls, and slope stability.',
    weightageRank: 4,
    totalConcepts: 16,
    standardCodes: ['IS 6403:1981', 'IS 2911 (Part 1-4)', 'IS 1904:2021'],
    units: [
      {
        id: 'u-fe-1',
        unitNumber: 1,
        title: 'Shallow & Deep Foundations',
        subject: 'Foundation Engineering',
        chapters: [
          {
            id: 'ch-fe-1',
            chapterNumber: 1,
            title: 'Bearing Capacity of Shallow Foundations',
            subject: 'Foundation Engineering',
            unit: 'Shallow & Deep Foundations',
            overview: 'Terzaghi, Meyerhof, and IS 6403 bearing capacity formulas, water table effects, and settlement limits.',
            conceptSlugs: ['terzaghi-effective-stress-consolidation']
          }
        ]
      }
    ]
  }
];
