import type { CivilKnowledgeConcept, CivilKnowledgeSubject } from '../../../types/civilKnowledge';
import { CIVIL_FORMULA_BANK } from '../banks/formulaBank';
import { CIVIL_CONCEPT_TRAP_BANK } from '../banks/conceptTrapBank';

export const STRUCTURAL_CONCEPTS: CivilKnowledgeConcept[] = [
  {
    id: 'ck-som-001',
    slug: 'euler-buckling-columns',
    title: 'Euler Buckling Theory & Effective Lengths of Columns',
    branchId: 'structural-mechanics',
    branchName: 'Structural Mechanics & Design',
    subject: 'Strength of Materials',
    unit: 'Unit 5: Columns & Struts',
    chapter: 'Chapter 5.1: Elastic Column Stability',
    topic: 'Euler Critical Load Theory',
    subtopic: 'Derivation, Effective Lengths & Slenderness Limits',
    difficulty: 'GATE_IES',
    keywords: ['Euler buckling', 'critical load', 'effective length', 'slenderness ratio', 'P_cr', 'IS 800'],
    theory: {
      summary: 'Leonhard Euler\'s fundamental theory governing the elastic bifurcation buckling of long slender compressive members subjected to axial loads.',
      definitions: [
        'Critical Buckling Load (P_cr): The maximum axial compressive force that a column can carry while remaining straight in stable equilibrium.',
        'Slenderness Ratio (lambda): The ratio of the column\'s effective length (L_e) to its least radius of gyration (r_min), given by lambda = L_e / r_min.',
        'Radius of Gyration (r): The geometric distance from the axis of rotation at which the entire cross-sectional area may be assumed concentrated: r = sqrt(I / A).'
      ],
      principlesAndLaws: [
        'Euler-Bernoulli Beam-Column Principle: The lateral restoring bending moment M(x) = -E·I·(d²y/dx²) balances the external destabilizing moment P·y.',
        'Governing Differential Equation: d²y/dx² + (P / EI) y = 0, whose general sinusoidal solution is y(x) = C1 sin(kx) + C2 cos(kx), where k = sqrt(P / EI).'
      ],
      governingAssumptions: [
        'The column is initially perfectly straight and of uniform cross-section throughout its length.',
        'The material is perfectly homogeneous, isotropic, and linear elastic (obeys Hooke\'s law up to buckling).',
        'The compressive load is purely axial and passes through the centroid of the cross-section.',
        'The column fails solely by lateral elastic bending (buckling), with no local crushing or shear yielding.',
        'Shortening of the column due to direct axial compression is neglected.'
      ],
      detailedExplanation: 'Euler\'s formula establishes that a slender column does not fail by material crushing; instead, at a critical load P_cr, multiple equilibrium paths emerge (bifurcation). For loads P < P_cr, the straight configuration is stable; at P = P_cr, neutral equilibrium occurs; and for P > P_cr, lateral deflection amplifies catastrophically until collapse.\n\nThe effective length L_e represents the distance between two consecutive points of zero bending moment (points of contraflexure) on the buckled column profile. It depends entirely on end boundary restraints.',
      derivationSteps: [
        '1. Set up equilibrium: For a pin-ended column of length L, bending moment at distance x is M = -P·y.',
        '2. Substitute into flexure differential equation: EI (d²y/dx²) = -P·y  =>  d²y/dx² + (P/EI) y = 0.',
        '3. Solve 2nd order ODE: y(x) = C1 · sin[x · sqrt(P/EI)] + C2 · cos[x · sqrt(P/EI)].',
        '4. Apply boundary condition at x = 0 (y = 0): C2 = 0.',
        '5. Apply boundary condition at x = L (y = 0): C1 · sin[L · sqrt(P/EI)] = 0.',
        '6. For a non-trivial buckled shape (C1 ≠ 0): sin[L · sqrt(P/EI)] = 0  =>  L · sqrt(P/EI) = n·pi (n = 1, 2, ...).',
        '7. The fundamental buckling mode (n = 1) yields: P_cr = pi² · E · I / L².'
      ],
      applications: [
        'Design of compression members in steel trusses, transmission towers, and bridge piers.',
        'Formulation of column strength curves in IS 800:2007 (Perry-Robertson formula) and IS 456:2000.'
      ],
      limitations: [
        'Overestimates capacity for short and medium columns where crushing/yielding occurs before elastic buckling.',
        'Valid only when critical stress sigma_cr = P_cr / A <= proportional limit sigma_p of the material.'
      ],
      comparisons: [
        {
          aspect: 'Boundary End Conditions',
          itemA: { label: 'Both Ends Hinged (Pinned)', value: 'Le = 1.0 L; P_cr = pi²EI / L²' },
          itemB: { label: 'Both Ends Fixed (Clamped)', value: 'Le = 0.5 L; P_cr = 4 pi²EI / L²' }
        },
        {
          aspect: 'One Fixed, One Free (Cantilever)',
          itemA: { label: 'Cantilever Column', value: 'Le = 2.0 L; P_cr = pi²EI / (4 L²)' },
          itemB: { label: 'One Fixed, One Pinned (Propped)', value: 'Le = 0.707 L; P_cr = 2 pi²EI / L²' }
        }
      ]
    },
    diagrams: [
      {
        id: 'diag-euler-001',
        title: 'Euler Column Buckling Modes & Contraflexure Points',
        format: 'ASCII',
        content: `
   BOTH ENDS PINNED          BOTH ENDS FIXED           ONE FIXED, ONE FREE
      P                         P                         P
      |                         |                         |
    [---]                     =======                   (free)
    /   \\                     |  |  |                     | )
   |     | (Le = L)           )  |  ( (Le = 0.5 L)        |  ) (Le = 2 L)
    \\   /                     |  |  |                     |   )
    [---]                     =======                   ======= (fixed base)
      ^                         ^                         ^
  Contraflexure at:         Contraflexure at:         Contraflexure at:
  Supports (x=0, x=L)       L/4 and 3L/4              Virtual base (-L)
        `,
        caption: 'Deflection profiles and effective lengths Le for classical Euler boundary conditions.'
      }
    ],
    formulas: [CIVIL_FORMULA_BANK[0]],
    codeProvisions: [
      {
        standard: 'IS 800:2007',
        clauseOrTable: 'Table 11',
        title: 'Effective Length of Prismatic Compression Members',
        provisionText: 'For effectively held in position and restrained against rotation at both ends, design effective length is 0.65 L (theoretical 0.5 L). For held in position at both ends but restrained against rotation at one end only, design effective length is 0.80 L (theoretical 0.7 L).',
        isMandatory: true,
        notes: 'Practical construction connections never achieve 100% ideal rigidity, hence design values exceed theoretical values.'
      }
    ],
    workedExamples: [
      {
        id: 'we-som-001',
        title: 'Critical Buckling Load of a Pin-Ended Steel Strut',
        problemStatement: 'A solid circular steel column of diameter 50 mm and length 3.0 m is hinged at both ends. Taking Young\'s modulus E = 200 GPa, determine the Euler critical buckling load and the critical stress.',
        givenData: {
          'Diameter (d)': '50 mm = 0.05 m',
          'Length (L)': '3.0 m',
          'End conditions': 'Both ends hinged (Le = L = 3.0 m)',
          'Modulus (E)': '200 GPa = 2 x 10^11 Pa'
        },
        governingFormulas: [
          'I = pi * d^4 / 64',
          'A = pi * d^2 / 4',
          'P_cr = pi^2 * E * I / Le^2',
          'sigma_cr = P_cr / A'
        ],
        stepByStepSolution: [
          'Step 1: Compute least moment of inertia I:\nI = pi * (0.05)^4 / 64 = 3.06796 x 10^-7 m^4.',
          'Step 2: Compute cross-sectional area A:\nA = pi * (0.05)^2 / 4 = 1.9635 x 10^-3 m^2.',
          'Step 3: Compute Euler critical load P_cr:\nP_cr = (pi^2 * 2 x 10^11 * 3.06796 x 10^-7) / (3.0)^2 = 6.0558 x 10^5 / 9 = 67287 N = 67.29 kN.',
          'Step 4: Compute critical stress sigma_cr:\nsigma_cr = 67287 N / (1.9635 x 10^-3 m^2) = 34.27 x 10^6 Pa = 34.27 MPa.'
        ],
        finalAnswer: 'Critical Buckling Load = 67.29 kN, Critical Stress = 34.27 MPa',
        answerUnit: 'kN',
        takeaway: 'Since 34.27 MPa is well below the yield strength of structural steel (250 MPa), the strut fails by pure elastic buckling, confirming the validity of Euler\'s equation.',
        examProvenance: 'APSC AE Civil 2023 / UPSC ESE'
      }
    ],
    conceptTraps: [
      {
        id: 'trap-som-eul',
        subject: 'Strength of Materials',
        topic: 'Euler Theory',
        branch: 'Structural & Mechanics',
        trapTitle: 'Applying Euler Formula to Short Columns',
        commonMistake: 'Calculating load capacity of a short column using Euler\'s formula.',
        correctConcept: 'Euler\'s formula is invalid for slenderness ratio lambda < lambda_critical (approx. 89 for mild steel). Short columns crush by yielding at P_cr = A · f_y.',
        whyCandidatesFail: 'Euler formula gives infinite load as L -> 0, which violates material yield strength.',
        preventionRule: 'Always check if lambda >= pi * sqrt(E / f_y) before applying Euler\'s formula.'
      }
    ],
    quickRevisionFacts: [
      'Euler formula: P_cr = pi²EI / Le².',
      'Least radius of gyration r_min = sqrt(I_min / A); Slenderness ratio lambda = Le / r_min.',
      'Rankine-Gordon empirical formula bridges short and long columns: 1 / P_R = 1 / P_c + 1 / P_E.'
    ],
    prerequisites: ['Centroids and Moments of Inertia', 'Bending of Beams', 'Differential Equations'],
    relatedConceptSlugs: ['rcc-short-slender-columns', 'steel-compression-members', 'effective-lengths-is800'],
    downstreamApplications: ['Design of Truss Struts', 'Tall Building Columns', 'Bridge Piers']
  },

  {
    id: 'ck-rcc-001',
    slug: 'limit-state-flexure-beams',
    title: 'Limit State Design of Singly & Doubly Reinforced Concrete Beams',
    branchId: 'structural-mechanics',
    branchName: 'Structural Mechanics & Design',
    subject: 'Reinforced Concrete Structures',
    unit: 'Unit 2: Limit State of Collapse — Flexure',
    chapter: 'Chapter 2.1: Singly Reinforced Rectangular Beams',
    topic: 'Flexural Stress Block & Moment Capacity',
    subtopic: 'Neutral Axis Depth, Limiting Moment & Steel Ratios',
    difficulty: 'STATE_AE_JE',
    keywords: ['IS 456:2000', 'limit state', 'stress block', 'xu_max', 'Mu_lim', 'under-reinforced', 'over-reinforced'],
    theory: {
      summary: 'Comprehensive flexural limit state mechanics according to IS 456:2000, detailing the parabolic-rectangular concrete stress block, neutral axis criteria, and ductile section design.',
      definitions: [
        'Characteristic Compressive Strength (fck): Compressive strength of 150 mm cubes at 28 days below which not more than 5% test results are expected to fall.',
        'Balanced Section: A section where the maximum strain in concrete reaches 0.0035 at the exact same instant that the tension steel strain reaches 0.002 + 0.87 fy / Es.',
        'Under-Reinforced Section: A section where steel yields (strain > 0.002 + 0.87 fy / Es) before concrete crushes, ensuring ductile, warning-rich failure.'
      ],
      principlesAndLaws: [
        'Bernoulli Hypothesis: Plane sections normal to the axis remain plane after bending (linear strain distribution across section depth).',
        'Concrete Tensile Strength Neglected: Tensile stresses are assumed to be resisted entirely by the steel reinforcement.',
        'Design Stress-Strain for Concrete: Parabolic from strain 0 to 0.002 (peak design stress 0.447 fck = 0.67 fck / 1.5), and constant rectangular from 0.002 to ultimate failure strain 0.0035.'
      ],
      governingAssumptions: [
        'Maximum compressive strain in concrete at outermost fiber is taken as 0.0035 in bending.',
        'Tensile strength of concrete is ignored in flexure calculations.',
        'Design yield strength of steel in tension is 0.87 fy (gamma_m = 1.15).',
        'Maximum strain in tension steel at failure shall not be less than 0.87 fy / Es + 0.002.'
      ],
      detailedExplanation: 'In Limit State Method (LSM) as codified in IS 456:2000, safety is ensured at ultimate collapse loads. Integrating the parabolic-rectangular stress block yields:\n- Total compressive force: C = 0.36 · fck · b · xu\n- Line of action of compressive force: 0.42 · xu from the extreme compressive fiber\n- Total tensile force: T = 0.87 · fy · Ast\n- Lever arm: z = d - 0.42 · xu\n\nEquating C = T gives the actual neutral axis depth xu = (0.87 fy Ast) / (0.36 fck b). If xu < xu_max, the beam is under-reinforced; if xu = xu_max, balanced. If xu > xu_max, IS 456 requires redesigning as a doubly reinforced beam or increasing the depth, as over-reinforced beams suffer sudden brittle failure without warning.',
      applications: [
        'Slab and beam design in residential, commercial, and industrial RCC frames.',
        'Highway and railway bridge girder flexural sizing.'
      ],
      limitations: [
        'Does not apply directly to deep beams (span/depth ratio < 2.0 for simply supported or < 2.5 for continuous), where plane sections do not remain plane.'
      ],
      comparisons: [
        {
          aspect: 'Failure Mode',
          itemA: { label: 'Under-Reinforced Beam (xu < xu_max)', value: 'Ductile failure; tension steel yields first, large deflections and wide cracks give advance warning' },
          itemB: { label: 'Over-Reinforced Beam (xu > xu_max)', value: 'Brittle failure; concrete crushes suddenly in compression without warning. Strictly prohibited by IS 456' }
        }
      ]
    },
    diagrams: [
      {
        id: 'diag-rcc-001',
        title: 'IS 456 Limit State Strain and Stress Blocks',
        format: 'ASCII',
        content: `
   CROSS SECTION             STRAIN DIAGRAM                STRESS BLOCK
       b
   +-------+                     0.0035                   0.447 fck
   |       |                    +------+                 +----------+
   |       | xu                 |     /                  |          |
 --+-------+-------          ---+--- / ---            ---+----------+---
   |       |                    |   / (NA)               |  parabola/
   |       |                    |  /                     +---------/
   |   O O | Ast                | /                      C = 0.36 fck b xu (at 0.42 xu)
   +-------+                    |/
       d                        +-------                 T = 0.87 fy Ast (at d)
                          >= 0.002 + 0.87fy/Es
        `,
        caption: 'Linear strain compatibility and IS 456 parabolic-rectangular equivalent stress block.'
      }
    ],
    formulas: [CIVIL_FORMULA_BANK[3], CIVIL_FORMULA_BANK[4], CIVIL_FORMULA_BANK[5]],
    codeProvisions: [
      {
        standard: 'IS 456:2000',
        clauseOrTable: 'Cl. 38.1 & Annex G',
        title: 'Assumptions for Limit State of Collapse (Flexure)',
        provisionText: 'The maximum strain in concrete at the outermost compression fiber is 0.0035. The relationship between compressive stress-strain in concrete may be assumed to be rectangle-parabola. Total compression C = 0.36 fck b xu acting at 0.42 xu from extreme fiber.',
        isMandatory: true
      },
      {
        standard: 'IS 456:2000',
        clauseOrTable: 'Cl. 26.5.1.1',
        title: 'Minimum and Maximum Tension Reinforcement in Beams',
        provisionText: 'Minimum Ast / (b · d) = 0.85 / fy. Maximum tension reinforcement Ast shall not exceed 0.04 b · D (4% of gross area).',
        isMandatory: true
      }
    ],
    workedExamples: [
      {
        id: 'we-rcc-001',
        title: 'Moment of Resistance of a Singly Reinforced Rectangular Beam',
        problemStatement: 'A rectangular reinforced concrete beam has width b = 250 mm and effective depth d = 450 mm. It is reinforced with 3 bars of 20 mm diameter of Fe 415 grade steel. The concrete grade is M20. Determine the depth of the neutral axis and the factored moment of resistance.',
        givenData: {
          'Width (b)': '250 mm',
          'Effective depth (d)': '450 mm',
          'Concrete grade': 'M20 (fck = 20 N/mm^2)',
          'Steel grade': 'Fe 415 (fy = 415 N/mm^2, xu_max/d = 0.48)',
          'Tension steel (Ast)': '3 bars of 20 mm dia = 3 * pi * 20^2 / 4 = 942.48 mm^2'
        },
        governingFormulas: [
          'xu = (0.87 * fy * Ast) / (0.36 * fck * b)',
          'xu_max = 0.48 * d',
          'Mu = 0.87 * fy * Ast * (d - 0.42 * xu)'
        ],
        stepByStepSolution: [
          'Step 1: Calculate Limiting Neutral Axis depth xu_max:\nxu_max = 0.48 * 450 mm = 216.0 mm.',
          'Step 2: Calculate actual Neutral Axis depth xu by equating C = T:\nxu = (0.87 * 415 * 942.48) / (0.36 * 20 * 250) = 340282 / 1800 = 189.05 mm.',
          'Step 3: Check section type:\nSince xu (189.05 mm) < xu_max (216.0 mm), the section is UNDER-REINFORCED. Steel yields before concrete crushes.',
          'Step 4: Compute Factored Moment of Resistance Mu:\nLever arm z = d - 0.42 * xu = 450 - (0.42 * 189.05) = 450 - 79.40 = 370.60 mm.\nMu = 0.87 * fy * Ast * z = 340282 N * 370.60 mm = 1.2611 x 10^8 N·mm = 126.11 kN·m.'
        ],
        finalAnswer: 'xu = 189.05 mm (Under-reinforced), Mu = 126.11 kN·m',
        answerUnit: 'kN·m',
        takeaway: 'Under-reinforced sections fail progressively with clear visual crack formation. Moment capacity is governed by steel yielding.',
        examProvenance: 'GATE Civil / APSC AE Civil 2024'
      }
    ],
    conceptTraps: [CIVIL_CONCEPT_TRAP_BANK[3]],
    quickRevisionFacts: [
      'xu_max / d ratios: 0.53 (Fe 250), 0.48 (Fe 415), 0.46 (Fe 500).',
      'Mu_lim = Q · fck · b · d², where Q = 0.148 (Fe 250), 0.138 (Fe 415), 0.133 (Fe 500).',
      'Minimum steel: Ast_min = (0.85 · b · d) / fy. Maximum steel: 4% of gross area (0.04 b D).'
    ],
    prerequisites: ['Hooke\'s Law & Beam Bending', 'Characteristic Strengths of Materials'],
    relatedConceptSlugs: ['rcc-shear-and-torsion', 'rcc-two-way-slabs', 'steel-plastic-analysis'],
    downstreamApplications: ['RCC Frame Design', 'Bridge Deck Slab Design']
  }
];

export const STRUCTURAL_SUBJECTS: CivilKnowledgeSubject[] = [
  {
    id: 'subj-engg-mech',
    name: 'Engineering Mechanics',
    branchId: 'structural-mechanics',
    branchName: 'Structural Mechanics & Design',
    description: 'Statics, dynamics, rigid body equilibrium, trusses, friction, centroids, and moments of inertia.',
    weightageRank: 8,
    totalConcepts: 12,
    standardCodes: ['IS 875 (Part 1-5)'],
    units: [
      {
        id: 'u-em-1',
        unitNumber: 1,
        title: 'Statics & Rigid Body Equilibrium',
        subject: 'Engineering Mechanics',
        chapters: [
          {
            id: 'ch-em-1',
            chapterNumber: 1,
            title: 'Equilibrium & Force Systems',
            subject: 'Engineering Mechanics',
            unit: 'Statics & Rigid Body Equilibrium',
            overview: 'Free body diagrams, equations of equilibrium, Lami\'s theorem, and determinate trusses.',
            conceptSlugs: ['euler-buckling-columns']
          }
        ]
      }
    ]
  },
  {
    id: 'subj-som',
    name: 'Strength of Materials',
    branchId: 'structural-mechanics',
    branchName: 'Structural Mechanics & Design',
    description: 'Stress-strain behavior, Mohr\'s circle, thin cylinders, bending, shear, torsion, and column buckling.',
    weightageRank: 1,
    totalConcepts: 18,
    standardCodes: ['IS 2062:2011', 'IS 456:2000'],
    units: [
      {
        id: 'u-som-1',
        unitNumber: 1,
        title: 'Stresses, Strains & Elastic Constants',
        subject: 'Strength of Materials',
        chapters: [
          {
            id: 'ch-som-1',
            chapterNumber: 1,
            title: 'Axial Stress & Elastic Constants',
            subject: 'Strength of Materials',
            unit: 'Stresses, Strains & Elastic Constants',
            overview: 'Hooke\'s law, Young\'s modulus, shear modulus, bulk modulus, and Poisson\'s ratio.',
            conceptSlugs: ['euler-buckling-columns']
          }
        ]
      }
    ]
  },
  {
    id: 'subj-rcc',
    name: 'Reinforced Concrete Structures',
    branchId: 'structural-mechanics',
    branchName: 'Structural Mechanics & Design',
    description: 'Limit state design of beams, slabs, columns, footings, retain walls, and ductile detailing per IS 456 & IS 13920.',
    weightageRank: 2,
    totalConcepts: 24,
    standardCodes: ['IS 456:2000', 'IS 13920:2016', 'SP 16', 'SP 34'],
    units: [
      {
        id: 'u-rcc-1',
        unitNumber: 1,
        title: 'Limit State of Collapse — Flexure',
        subject: 'Reinforced Concrete Structures',
        chapters: [
          {
            id: 'ch-rcc-1',
            chapterNumber: 1,
            title: 'Beams in Flexure (Singly & Doubly Reinforced)',
            subject: 'Reinforced Concrete Structures',
            unit: 'Limit State of Collapse — Flexure',
            overview: 'Stress block parameters, neutral axis depth, moment of resistance, and balanced/under-reinforced sections.',
            conceptSlugs: ['limit-state-flexure-beams']
          }
        ]
      }
    ]
  }
];
