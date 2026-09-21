import type { ConceptTrapItem } from '../../../types/civilKnowledge';

export const CIVIL_CONCEPT_TRAP_BANK: ConceptTrapItem[] = [
  {
    id: 'trap-geo-001',
    subject: 'Geotechnical Engineering',
    topic: 'Effective Stress & Surcharge from Submerged Water Pool',
    branch: 'Geotechnical & Foundations',
    trapTitle: 'Water Table Rising Above Ground Surface',
    commonMistake: 'Candidates add the depth of water ponded above ground (h_w * gamma_w) to the effective stress in the soil below.',
    correctConcept: 'Water standing above the ground surface increases total stress sigma and pore water pressure u by the exact same amount (+h_w * gamma_w). Since sigma\' = sigma - u, the effective stress at every depth in the soil remains completely unchanged!',
    whyCandidatesFail: 'Confusing total surcharge load (e.g. soil surcharge) with water surcharge. Soil surcharge has solid particles and transmits effective stress; pure water transmits only neutral hydrostatic pressure.',
    examTrapExample: 'A lake depth increases by 2 m over a clay bed. What is the increase in effective vertical stress 5 m below the lake bed? Answer: Exactly 0 kN/m².',
    preventionRule: 'Always calculate sigma and u separately from their basic hydrostatic definitions before subtracting.'
  },
  {
    id: 'trap-fluids-001',
    subject: 'Fluid Mechanics & Hydraulics',
    topic: 'Darcy-Weisbach f vs Fanning Friction Factor f\'',
    branch: 'Water Resources & Fluids',
    trapTitle: 'Fanning Friction Factor vs Darcy Friction Factor',
    commonMistake: 'Using h_f = f * L * V^2 / (2 g D) when the question provides the Fanning friction factor f\'.',
    correctConcept: 'The Darcy friction factor f is 4 times the Fanning friction coefficient f\' (f = 4 f\'). In Chezy\'s formula or European hydraulics textbooks, f\' is often quoted. If f\' is given, head loss is h_f = 4 f\' L V^2 / (2 g D). In laminar pipe flow, Darcy f = 64 / Re, whereas Fanning f\' = 16 / Re.',
    whyCandidatesFail: 'Missing the factor of 4 leads to an answer that is exactly 1/4th or 4x the correct value, both of which are always placed among the MCQ options.',
    preventionRule: 'Check the laminar flow relation: if f = 64/Re it is Darcy; if f = 16/Re it is Fanning.'
  },
  {
    id: 'trap-fluids-002',
    subject: 'Fluid Mechanics & Hydraulics',
    topic: 'Alternate Depths vs Sequent (Conjugate) Depths',
    branch: 'Water Resources & Fluids',
    trapTitle: 'Confusing Alternate Depths with Sequent Depths',
    commonMistake: 'Using the Bélanger hydraulic jump equation to find alternate depths, or vice-versa.',
    correctConcept: 'Alternate depths belong to a Specific Energy curve (E = y + q^2 / (2gy^2)) at the same specific energy E. Sequent (or conjugate) depths belong to a Specific Force curve (F = q^2/(gy) + y^2/2) across a hydraulic jump where energy is lost but momentum is conserved.',
    whyCandidatesFail: 'Both describe two depths (one subcritical, one supercritical) for the same discharge, but alternate depths conserve energy (no jump), while sequent depths conserve momentum (jump with energy loss).',
    preventionRule: 'Equal Specific Energy -> Alternate Depths. Equal Specific Force / Momentum -> Sequent Depths.'
  },
  {
    id: 'trap-rcc-001',
    subject: 'Reinforced Concrete Structures',
    topic: 'Minimum Shear Reinforcement in Slabs vs Beams',
    branch: 'Structural & Mechanics',
    trapTitle: 'Shear Reinforcement in Solid Slabs',
    commonMistake: 'Providing shear stirrups in a residential solid roof slab when nominal shear stress tau_v exceeds tau_c.',
    correctConcept: 'As per IS 456:2000 Cl. 40.2.1.1, solid slabs SHALL NOT be provided with shear reinforcement because of the difficulty in placing stirrups in thin elements. If tau_v exceeds k * tau_c, the only allowable design remedy is to increase the thickness (depth) of the slab.',
    whyCandidatesFail: 'Applying beam design rules (where stirrups are mandatory if tau_v > tau_c) to slabs.',
    preventionRule: 'For solid slabs: shear capacity is k * tau_c. If tau_v > k * tau_c -> increase slab depth. Never specify stirrups.'
  },
  {
    id: 'trap-trans-001',
    subject: 'Transportation Engineering',
    topic: 'Super-Elevation Design Speed for Mixed Traffic',
    branch: 'Transportation & Highways',
    trapTitle: 'Designing Super-Elevation Without Speed Reduction',
    commonMistake: 'Using e = V^2 / (127 R) to determine the design super-elevation for an Indian highway.',
    correctConcept: 'Per IRC:73, Indian highways carry mixed traffic (slow bullock carts, tractors, fast cars). Super-elevation is designed by completely neglecting lateral friction (f = 0) and evaluating for 75% of the design speed: e = (0.75 V)^2 / (127 R) = V^2 / (225 R). Then check if e <= e_max (7% for plain terrain).',
    whyCandidatesFail: 'V^2 / (127 R) is the equilibrium super-elevation formula; V^2 / (225 R) is the IRC practical design formula for mixed traffic.',
    preventionRule: 'When asked for "design super-elevation as per IRC", ALWAYS use e = V^2 / (225 R).'
  },

  /* ==========================================================================
     BHAVIKATTI: BASIC CIVIL ENGINEERING CONCEPT TRAPS
     ========================================================================== */
  {
    id: 'trap-surv-simpson',
    subject: 'Surveying & Geomatics',
    topic: 'Simpson\'s 1/3rd Rule Segment Constraint',
    branch: 'Geomatics, Materials & Management',
    trapTitle: 'Applying Simpson\'s Rule to Even Number of Ordinates',
    commonMistake: 'Directly applying Simpson\'s formula when a survey table lists an even number of offsets/ordinates.',
    correctConcept: 'Simpson\'s 1/3rd rule requires dividing the area into pairs of parabolic strips. It works ONLY when the number of strips n is EVEN, which mathematically requires that the number of ordinates (offsets) is ODD. If n is odd (even ordinates), Simpson\'s rule MUST be applied to the first (n-1) strips and the single remaining strip computed via Trapezoidal Rule.',
    whyCandidatesFail: 'Missing the parity condition: even intervals = odd ordinates.',
    examTrapExample: 'Given 8 offsets at 5 m intervals. Can Simpson\'s 1/3rd rule be applied directly to all 8 offsets? Answer: No, 8 offsets form 7 intervals (odd); apply Simpson to first 7 offsets (6 intervals) and Trapezoidal to the 7th-to-8th offset.',
    preventionRule: 'Check count of ordinates: must be ODD. If EVEN, split off the last strip.'
  },
  {
    id: 'trap-bldg-queen-closer',
    subject: 'Building Construction & Planning',
    topic: 'Position of Queen Closer in Brickwork',
    branch: 'Geomatics, Materials & Management',
    trapTitle: 'Placing Queen Closer at the Wall Corner',
    commonMistake: 'Placing the Queen Closer at the outer corner edge of a brick wall in an English or Flemish bond.',
    correctConcept: 'In English or Flemish bond, the Queen Closer is ALWAYS placed IMMEDIATELY NEXT to the corner Quoin Header in heading courses. It must never be placed at the very corner because the 45 mm cut brick would easily chip off and fail structurally.',
    whyCandidatesFail: 'Assuming closers start the course at the corner edge.',
    preventionRule: 'Course sequence: Quoin Header -> Queen Closer -> Next Headers.'
  },
  {
    id: 'trap-bldg-truss-king',
    subject: 'Building Construction & Planning',
    topic: 'King Post Roof Truss Member Force Sense',
    branch: 'Geomatics, Materials & Management',
    trapTitle: 'Assuming the King Post is in Compression',
    commonMistake: 'Selecting "Compression" when asked for the type of internal force in the central vertical King Post member.',
    correctConcept: 'Under gravity dead and snow/live loads, the central vertical King Post acts as a TENSION HANGER, preventing the long bottom horizontal tie beam from sagging in the middle. The principal rafters and inclined struts are in compression.',
    whyCandidatesFail: 'The word "post" customarily signifies a vertical compression column, tricking candidates in competitive examinations.',
    preventionRule: 'King Post = Tension member. Bottom Tie Beam = Tension member. Rafters & Struts = Compression.'
  }
];
