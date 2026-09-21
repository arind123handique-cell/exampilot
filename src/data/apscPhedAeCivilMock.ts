import { MCQQuestion } from '../types';

/**
 * Official APSC Assistant Engineer (Civil) — PHED (Advt. No. 31/2025)
 * PAPER-II CIVIL ENGINEERING (Multiple Choice Objective Type, Bachelor Degree Standard)
 * Full 100 MCQs exactly calibrated to the 8 official syllabus modules.
 */
export const APSC_PHED_AE_CIVIL_2025_QUESTIONS: MCQQuestion[] = [
  // =========================================================================
  // MODULE 1: STATICS (Q1 - Q10)
  // =========================================================================
  {
    id: 'apsc-phed-2025-q001',
    questionNumber: 1,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '1. Statics',
    topic: 'Coplanar and multiplanar force systems',
    stem: 'If three coplanar concurrent forces acting at a point are in equilibrium, each force is proportional to the sine of the angle between the other two forces. This theorem is known as:',
    options: [
      { id: 'A', text: "Varignon's Theorem" },
      { id: 'B', text: "Lami's Theorem" },
      { id: 'C', text: "Castigliano's Theorem" },
      { id: 'D', text: "Maxwell's Reciprocal Theorem" }
    ],
    correctOption: 'B',
    explanation: "Lami's Theorem states that if three coplanar forces acting at a point are in equilibrium, each force is directly proportional to the sine of the angle between the other two forces: P/sin(α) = Q/sin(β) = R/sin(γ).",
    referenceSource: 'APSC Advt 31/2025 Syllabus · Statics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q002',
    questionNumber: 2,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '1. Statics',
    topic: 'Free body diagrams & equilibrium conditions',
    stem: 'For a rigid body subjected to a general non-coplanar (3D) force system in equilibrium, the number of independent equations of equilibrium is:',
    options: [
      { id: 'A', text: '3' },
      { id: 'B', text: '4' },
      { id: 'C', text: '6' },
      { id: 'D', text: '8' }
    ],
    correctOption: 'C',
    explanation: 'In 3D statics, there are 6 independent equilibrium equations: ΣFx = 0, ΣFy = 0, ΣFz = 0, and ΣMx = 0, ΣMy = 0, ΣMz = 0.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Statics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q003',
    questionNumber: 3,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '1. Statics',
    topic: 'Centroid and second moment of plane figures',
    stem: 'The second moment of area (moment of inertia) of a triangular cross-section of base b and height h about its centroidal axis parallel to the base is:',
    options: [
      { id: 'A', text: 'b·h³ / 12' },
      { id: 'B', text: 'b·h³ / 36' },
      { id: 'C', text: 'b·h³ / 4' },
      { id: 'D', text: 'b·h³ / 48' }
    ],
    correctOption: 'B',
    explanation: 'About the base axis, I_base = b·h³/12. By parallel axis theorem: I_G = I_base - A·(h/3)² = b·h³/12 - (b·h/2)·(h²/9) = b·h³/36.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Statics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q004',
    questionNumber: 4,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '1. Statics',
    topic: 'Centroid and second moment of plane figures',
    stem: 'The distance of the centroid of a solid hemisphere of radius R from its flat base measured along the axis of symmetry is:',
    options: [
      { id: 'A', text: '3R / 8' },
      { id: 'B', text: '4R / (3π)' },
      { id: 'C', text: 'R / 2' },
      { id: 'D', text: '3R / 4' }
    ],
    correctOption: 'A',
    explanation: 'For a solid hemisphere of radius R, the centroid lies at a distance of 3R/8 from the flat base. (Note: 4R/(3π) is for a semi-circular lamina).',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Statics',
    difficulty: 'MEDIUM'
  },
  {
    id: 'apsc-phed-2025-q005',
    questionNumber: 5,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '1. Statics',
    topic: 'Force polygons and funicular polygons',
    stem: 'In graphical statics, the funicular (or link) polygon is primarily used to determine the:',
    options: [
      { id: 'A', text: 'Line of action and location of the resultant of coplanar forces' },
      { id: 'B', text: 'Velocity of points in a mechanism' },
      { id: 'C', text: 'Acceleration profile of particles' },
      { id: 'D', text: 'Principal stresses in an elastic body' }
    ],
    correctOption: 'A',
    explanation: 'The vector polygon (force polygon) gives the magnitude and direction of the resultant, while the funicular polygon determines its unique line of action and location in space.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Statics',
    difficulty: 'MEDIUM'
  },
  {
    id: 'apsc-phed-2025-q006',
    questionNumber: 6,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '1. Statics',
    topic: 'Principle of virtual work',
    stem: 'The Principle of Virtual Work states that if a system of rigid bodies in equilibrium is subjected to virtual displacements consistent with the constraints, the total virtual work done by the active external forces is:',
    options: [
      { id: 'A', text: 'Maximum' },
      { id: 'B', text: 'Minimum' },
      { id: 'C', text: 'Equal to zero' },
      { id: 'D', text: 'Equal to total internal energy' }
    ],
    correctOption: 'C',
    explanation: 'For a mechanical system in static equilibrium, the virtual work done by all active external forces during any arbitrary virtual displacement compatible with constraints is zero (δW = 0).',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Statics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q007',
    questionNumber: 7,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '1. Statics',
    topic: 'Suspension systems and catenary cables',
    stem: 'A flexible cable of uniform weight per unit length hanging under its own weight between two supports takes the mathematical shape of a:',
    options: [
      { id: 'A', text: 'Parabola' },
      { id: 'B', text: 'Catenary' },
      { id: 'C', text: 'Hyperbola' },
      { id: 'D', text: 'Circular arc' }
    ],
    correctOption: 'B',
    explanation: 'A cable carrying a load uniform per unit length along the curve (its self-weight) forms a catenary (y = c·cosh(x/c)). When loaded uniformly along the horizontal span, it approximates a parabola.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Statics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q008',
    questionNumber: 8,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '1. Statics',
    topic: 'Suspension systems and catenary cables',
    stem: 'For a parabolic cable spanning a horizontal length L with a central dip d carrying a uniformly distributed load w per unit horizontal length, the horizontal tension H at the lowest point is:',
    options: [
      { id: 'A', text: 'w·L² / (8d)' },
      { id: 'B', text: 'w·L² / (4d)' },
      { id: 'C', text: 'w·L / (2d)' },
      { id: 'D', text: 'w·L² / (16d)' }
    ],
    correctOption: 'A',
    explanation: 'Taking moments about one of the supports for half of the cable: (w·L/2)·(L/4) - H·d = 0 => H = w·L² / (8d).',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Statics',
    difficulty: 'MEDIUM'
  },
  {
    id: 'apsc-phed-2025-q009',
    questionNumber: 9,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '1. Statics',
    topic: 'Free body diagrams & equilibrium conditions',
    stem: 'A cantilever truss with m members and j joints is statically determinate internally when the relationship between m and j is:',
    options: [
      { id: 'A', text: 'm = 2j - 3' },
      { id: 'B', text: 'm = 2j - r (where r = number of reaction components)' },
      { id: 'C', text: 'm = 3j - 6' },
      { id: 'D', text: 'm = j - 2' }
    ],
    correctOption: 'A',
    explanation: 'A 2D plane truss requires m = 2j - 3 for internal determinacy, where 3 represents the number of external equilibrium equations.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Statics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q0010',
    questionNumber: 10,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '1. Statics',
    topic: 'Centroid and second moment of plane figures',
    stem: 'The product of inertia (Ixy) of a plane cross-section having at least one axis of symmetry is:',
    options: [
      { id: 'A', text: 'Always positive' },
      { id: 'B', text: 'Always negative' },
      { id: 'C', text: 'Always zero' },
      { id: 'D', text: 'Equal to the polar moment of inertia' }
    ],
    correctOption: 'C',
    explanation: 'If a cross-section has at least one axis of symmetry, the product of inertia about orthogonal axes containing that symmetry axis is identically zero.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Statics',
    difficulty: 'MEDIUM'
  },

  // =========================================================================
  // MODULE 2: DYNAMICS (Q11 - Q18)
  // =========================================================================
  {
    id: 'apsc-phed-2025-q011',
    questionNumber: 11,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '2. Dynamics',
    topic: 'Units and Dimensions in engineering mechanics',
    stem: 'The dimensional formula of dynamic viscosity (μ) in the MLT system is:',
    options: [
      { id: 'A', text: '[M L⁻¹ T⁻¹]' },
      { id: 'B', text: '[M L⁻¹ T⁻²]' },
      { id: 'C', text: '[M L² T⁻¹]' },
      { id: 'D', text: '[M⁰ L² T⁻¹]' }
    ],
    correctOption: 'A',
    explanation: 'Dynamic viscosity μ = τ / (du/dy). Dimensions of shear stress τ = [M L⁻¹ T⁻²] and velocity gradient = [T⁻¹]. Thus [μ] = [M L⁻¹ T⁻²] / [T⁻¹] = [M L⁻¹ T⁻¹]. (SI unit: Pa·s or N·s/m²).',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Dynamics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q012',
    questionNumber: 12,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '2. Dynamics',
    topic: 'Units and Dimensions in engineering mechanics',
    stem: 'In the FLT (Force-Length-Time) system of dimensions, the dimension of mass is:',
    options: [
      { id: 'A', text: '[F L⁻¹ T²]' },
      { id: 'B', text: '[F L T⁻²]' },
      { id: 'C', text: '[F L² T⁻¹]' },
      { id: 'D', text: '[F L⁻² T]' }
    ],
    correctOption: 'A',
    explanation: 'From Newton second law F = m·a => m = F/a. Acceleration a has dimensions [L T⁻²]. Therefore [m] = [F] / [L T⁻²] = [F L⁻¹ T²].',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Dynamics',
    difficulty: 'MEDIUM'
  },
  {
    id: 'apsc-phed-2025-q013',
    questionNumber: 13,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '2. Dynamics',
    topic: 'Gravitational system vs Absolute system',
    stem: 'In the gravitational (technical) MKS system of units, the fundamental unit of force is the kilogram-force (kgf). 1 kgf is equal to approximately:',
    options: [
      { id: 'A', text: '1.0 N' },
      { id: 'B', text: '9.80665 N' },
      { id: 'C', text: '98.1 N' },
      { id: 'D', text: '0.102 N' }
    ],
    correctOption: 'B',
    explanation: '1 kgf is the gravitational force exerted on a mass of 1 kg at standard gravity (g = 9.80665 m/s²). Therefore 1 kgf = 1 kg × 9.80665 m/s² = 9.80665 N.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Dynamics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q014',
    questionNumber: 14,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '2. Dynamics',
    topic: 'MKS system & International SI Units conversions',
    stem: 'The unit of pressure in the SI system is the Pascal (Pa). One standard atmospheric pressure (1 atm) in SI units is equal to:',
    options: [
      { id: 'A', text: '1.01325 × 10⁵ Pa' },
      { id: 'B', text: '1.01325 × 10³ Pa' },
      { id: 'C', text: '760 Pa' },
      { id: 'D', text: '10.33 Pa' }
    ],
    correctOption: 'A',
    explanation: '1 standard atmosphere (atm) = 760 mm Hg = 101.325 kPa = 1.01325 × 10⁵ N/m² (Pa).',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Dynamics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q015',
    questionNumber: 15,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '2. Dynamics',
    topic: 'Units and Dimensions in engineering mechanics',
    stem: 'Which of the following physical quantities is dimensionless?',
    options: [
      { id: 'A', text: 'Specific weight' },
      { id: 'B', text: 'Specific gravity' },
      { id: 'C', text: 'Dynamic viscosity' },
      { id: 'D', text: 'Modulus of elasticity' }
    ],
    correctOption: 'B',
    explanation: 'Specific gravity is the ratio of density of a substance to that of water at 4°C. Being a ratio of identical dimensions, it is dimensionless [M⁰ L⁰ T⁰].',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Dynamics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q016',
    questionNumber: 16,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '2. Dynamics',
    topic: 'Gravitational system vs Absolute system',
    stem: 'In an absolute system of units, the fundamental quantities are independent of:',
    options: [
      { id: 'A', text: 'Temperature' },
      { id: 'B', text: 'Local acceleration due to gravity (g)' },
      { id: 'C', text: 'Time standards' },
      { id: 'D', text: 'Length standards' }
    ],
    correctOption: 'B',
    explanation: 'In absolute systems (like SI and CGS), mass is chosen as fundamental, making units independent of local variations in gravitational acceleration g.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Dynamics',
    difficulty: 'MEDIUM'
  },
  {
    id: 'apsc-phed-2025-q017',
    questionNumber: 17,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '2. Dynamics',
    topic: 'MKS system & International SI Units conversions',
    stem: 'One Joule of work in SI units is equivalent to how many ergs in the CGS absolute system?',
    options: [
      { id: 'A', text: '10⁵ ergs' },
      { id: 'B', text: '10⁷ ergs' },
      { id: 'C', text: '10⁹ ergs' },
      { id: 'D', text: '9.81 × 10⁶ ergs' }
    ],
    correctOption: 'B',
    explanation: '1 Joule = 1 N·m = (10⁵ dynes) × (10² cm) = 10⁷ dyne·cm = 10⁷ ergs.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Dynamics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q018',
    questionNumber: 18,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '2. Dynamics',
    topic: 'Units and Dimensions in engineering mechanics',
    stem: 'The dimensions of surface tension (σ) in terms of fundamental dimensions [M, L, T] are:',
    options: [
      { id: 'A', text: '[M L⁰ T⁻²]' },
      { id: 'B', text: '[M L⁻¹ T⁻²]' },
      { id: 'C', text: '[M L T⁻¹]' },
      { id: 'D', text: '[M L² T⁻²]' }
    ],
    correctOption: 'A',
    explanation: 'Surface tension is force per unit length: σ = F / L => [M L T⁻²] / [L] = [M T⁻²] or [M L⁰ T⁻²].',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Dynamics',
    difficulty: 'MEDIUM'
  },

  // =========================================================================
  // MODULE 3: KINEMATICS (Q19 - Q26)
  // =========================================================================
  {
    id: 'apsc-phed-2025-q019',
    questionNumber: 19,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '3. Kinematics',
    topic: 'Rectilinear motion (velocity, acceleration, displacement-time relations)',
    stem: 'A particle moves along a straight line such that its position is s = 2t³ - 9t² + 12t. The velocity of the particle becomes zero at time t equal to:',
    options: [
      { id: 'A', text: '1 s and 2 s' },
      { id: 'B', text: '0.5 s and 3 s' },
      { id: 'C', text: '2 s and 4 s' },
      { id: 'D', text: '1.5 s and 3.5 s' }
    ],
    correctOption: 'A',
    explanation: 'v = ds/dt = 6t² - 18t + 12 = 0 => t² - 3t + 2 = 0 => (t - 1)(t - 2) = 0 => t = 1 s and t = 2 s.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Kinematics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q020',
    questionNumber: 20,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '3. Kinematics',
    topic: 'Curvilinear motion and projectile trajectory',
    stem: 'A projectile is launched from ground level with an initial velocity u at an angle θ to the horizontal. The maximum horizontal range is achieved when θ is:',
    options: [
      { id: 'A', text: '30°' },
      { id: 'B', text: '45°' },
      { id: 'C', text: '60°' },
      { id: 'D', text: '90°' }
    ],
    correctOption: 'B',
    explanation: 'Horizontal range R = u²·sin(2θ) / g. Range is maximized when sin(2θ) = 1 => 2θ = 90° => θ = 45°.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Kinematics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q021',
    questionNumber: 21,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '3. Kinematics',
    topic: 'Curvilinear motion and projectile trajectory',
    stem: 'In normal and tangential coordinates, the normal component of acceleration of a particle moving along a plane curve of radius of curvature ρ with speed v is:',
    options: [
      { id: 'A', text: 'dv / dt' },
      { id: 'B', text: 'v² / ρ' },
      { id: 'C', text: 'v · ρ' },
      { id: 'D', text: 'd²s / dt²' }
    ],
    correctOption: 'B',
    explanation: 'The tangential acceleration reflects rate of change of speed (a_t = dv/dt), while the normal (centripetal) acceleration reflects change in direction (a_n = v² / ρ), directed towards center of curvature.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Kinematics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q022',
    questionNumber: 22,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '3. Kinematics',
    topic: 'Relative motion of particles',
    stem: 'Two vehicles A and B travel along perpendicular roads. Vehicle A moves east at 40 km/h and vehicle B moves north at 30 km/h. The magnitude of velocity of A relative to B is:',
    options: [
      { id: 'A', text: '10 km/h' },
      { id: 'B', text: '50 km/h' },
      { id: 'C', text: '70 km/h' },
      { id: 'D', text: '35 km/h' }
    ],
    correctOption: 'B',
    explanation: 'v_A/B = v_A - v_B = (40 i) - (30 j). Magnitude |v_A/B| = √(40² + (-30)²) = √(1600 + 900) = 50 km/h.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Kinematics',
    difficulty: 'MEDIUM'
  },
  {
    id: 'apsc-phed-2025-q023',
    questionNumber: 23,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '3. Kinematics',
    topic: 'Instantaneous centre of rotation',
    stem: 'For a planar rigid body in general plane motion, the number of instantaneous centres of zero velocity at any given instant is:',
    options: [
      { id: 'A', text: 'Exactly one' },
      { id: 'B', text: 'Two' },
      { id: 'C', text: 'Three' },
      { id: 'D', text: 'Infinite' }
    ],
    correctOption: 'A',
    explanation: 'At any given instant, general planar motion can be considered as pure rotation about a single unique point called the instantaneous centre of zero velocity (I-centre).',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Kinematics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q024',
    questionNumber: 24,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '3. Kinematics',
    topic: 'Instantaneous centre of rotation',
    stem: 'According to Kennedy’s (Aronhold-Kennedy) Theorem of three centres, if three bodies have relative planar motion, their three mutual instantaneous centres:',
    options: [
      { id: 'A', text: 'Form an equilateral triangle' },
      { id: 'B', text: 'Lie on a single straight line (are collinear)' },
      { id: 'C', text: 'Are coincident at the origin' },
      { id: 'D', text: 'Form a right-angled triangle' }
    ],
    correctOption: 'B',
    explanation: "Kennedy's Theorem states that the three instantaneous centres of three bodies undergoing relative planar motion must lie on a common straight line (are collinear).",
    referenceSource: 'APSC Advt 31/2025 Syllabus · Kinematics',
    difficulty: 'MEDIUM'
  },
  {
    id: 'apsc-phed-2025-q025',
    questionNumber: 25,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '3. Kinematics',
    topic: 'Rectilinear motion (velocity, acceleration, displacement-time relations)',
    stem: 'The area under an acceleration-time (a-t) curve between two time instants represents:',
    options: [
      { id: 'A', text: 'Total displacement' },
      { id: 'B', text: 'Change in velocity' },
      { id: 'C', text: 'Total distance traveled' },
      { id: 'D', text: 'Average acceleration' }
    ],
    correctOption: 'B',
    explanation: 'Since a = dv/dt, integrating gives ∫ a dt = v2 - v1 = Δv, which is the change in velocity during that interval.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Kinematics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q026',
    questionNumber: 26,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '3. Kinematics',
    topic: 'Instantaneous centre of rotation',
    stem: 'A circular cylinder of radius R rolls without slipping on a horizontal plane surface. The instantaneous centre of rotation of the cylinder is located at:',
    options: [
      { id: 'A', text: 'The geometric center of the cylinder' },
      { id: 'B', text: 'The point of contact with the horizontal surface' },
      { id: 'C', text: 'The highest point of the cylinder' },
      { id: 'D', text: 'Infinity' }
    ],
    correctOption: 'B',
    explanation: 'For pure rolling without slipping, the point of contact with the ground has zero instantaneous velocity, hence it is the instantaneous centre of rotation.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Kinematics',
    difficulty: 'MEDIUM'
  },

  // =========================================================================
  // MODULE 4: KINETICS (Q27 - Q36)
  // =========================================================================
  {
    id: 'apsc-phed-2025-q027',
    questionNumber: 27,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '4. Kinetics',
    topic: 'Mass moment of inertia of standard geometric solids',
    stem: 'The mass moment of inertia of a uniform solid circular cylinder of mass m and radius R about its longitudinal geometric axis is:',
    options: [
      { id: 'A', text: 'm · R² / 4' },
      { id: 'B', text: 'm · R² / 2' },
      { id: 'C', text: 'm · R²' },
      { id: 'D', text: '2 · m · R² / 5' }
    ],
    correctOption: 'B',
    explanation: 'For a solid uniform cylinder/disc of mass m and radius R, I_z = (1/2)·m·R² about its central axis. (2/5·m·R² applies to a solid sphere).',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Kinetics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q028',
    questionNumber: 28,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '4. Kinetics',
    topic: 'Mass moment of inertia of standard geometric solids',
    stem: 'The radius of gyration k of a thin uniform spherical shell of radius R about its diameter is:',
    options: [
      { id: 'A', text: '√(2/3) · R' },
      { id: 'B', text: '√(2/5) · R' },
      { id: 'C', text: 'R / 2' },
      { id: 'D', text: 'R / √2' }
    ],
    correctOption: 'A',
    explanation: 'Mass moment of inertia of a thin spherical shell is I = (2/3)·m·R². Since I = m·k², k = √(2/3)·R.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Kinetics',
    difficulty: 'MEDIUM'
  },
  {
    id: 'apsc-phed-2025-q029',
    questionNumber: 29,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '4. Kinetics',
    topic: 'Simple Harmonic Motion (SHM) and natural frequency',
    stem: 'The natural circular frequency (ω_n) of an undamped single degree of freedom mass-spring system having mass m and spring stiffness k is:',
    options: [
      { id: 'A', text: '√(m / k)' },
      { id: 'B', text: '√(k / m)' },
      { id: 'C', text: '2π · √(k / m)' },
      { id: 'D', text: '(1 / 2π) · √(m / k)' }
    ],
    correctOption: 'B',
    explanation: 'The governing equation is m·ẍ + k·x = 0 => ẍ + (k/m)·x = 0. Therefore the circular natural frequency ω_n = √(k/m) rad/s.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Kinetics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q030',
    questionNumber: 30,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '4. Kinetics',
    topic: 'Simple Harmonic Motion (SHM) and natural frequency',
    stem: 'In a simple harmonic motion with amplitude A and natural angular frequency ω, the maximum acceleration of the particle is:',
    options: [
      { id: 'A', text: 'A · ω' },
      { id: 'B', text: 'A · ω²' },
      { id: 'C', text: 'A² · ω' },
      { id: 'D', text: 'A / ω²' }
    ],
    correctOption: 'B',
    explanation: 'Displacement x = A·sin(ωt), velocity v = A·ω·cos(ωt), acceleration a = -A·ω²·sin(ωt). Thus maximum acceleration = A·ω² at the extreme positions.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Kinetics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q031',
    questionNumber: 31,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '4. Kinetics',
    topic: 'Linear momentum, angular momentum, and impulse equations',
    stem: 'The impulse of a force acting on a body over a finite time interval is equal to the change in:',
    options: [
      { id: 'A', text: 'Kinetic energy of the body' },
      { id: 'B', text: 'Linear momentum of the body' },
      { id: 'C', text: 'Total mechanical energy' },
      { id: 'D', text: 'Angular velocity of the body' }
    ],
    correctOption: 'B',
    explanation: 'From the impulse-momentum theorem: ∫ F dt = m·v2 - m·v1 = Δ(linear momentum).',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Kinetics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q032',
    questionNumber: 32,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '4. Kinetics',
    topic: 'Linear momentum, angular momentum, and impulse equations',
    stem: 'If no external torque acts on a rotating system about an axis, which of the following quantities remains strictly conserved?',
    options: [
      { id: 'A', text: 'Linear momentum' },
      { id: 'B', text: 'Angular momentum' },
      { id: 'C', text: 'Rotational kinetic energy' },
      { id: 'D', text: 'Moment of inertia' }
    ],
    correctOption: 'B',
    explanation: 'According to the law of conservation of angular momentum, when the net external torque ΣT = dL/dt = 0, the angular momentum L = I·ω remains constant.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Kinetics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q033',
    questionNumber: 33,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '4. Kinetics',
    topic: 'Equations of motion of rigid body rotating about a fixed axis',
    stem: 'For a rigid body rotating about a fixed principal axis of inertia with angular acceleration α, the net external torque T is given by:',
    options: [
      { id: 'A', text: 'T = I · α' },
      { id: 'B', text: 'T = (1/2) · I · α²' },
      { id: 'C', text: 'T = I · ω' },
      { id: 'D', text: 'T = m · α' }
    ],
    correctOption: 'A',
    explanation: 'Newton’s second law for rotation about a fixed axis is ΣT = I·α, where I is the mass moment of inertia about that axis and α is the angular acceleration.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Kinetics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q034',
    questionNumber: 34,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '4. Kinetics',
    topic: 'Equations of motion of rigid body rotating about a fixed axis',
    stem: "D'Alembert's Principle allows a dynamic problem to be treated as an equivalent static equilibrium problem by introducing:",
    options: [
      { id: 'A', text: 'Gyroscopic couples' },
      { id: 'B', text: 'Inertia forces (-m·a) and reversed effective moments' },
      { id: 'C', text: 'Virtual velocities' },
      { id: 'D', text: 'Potential energy gradients' }
    ],
    correctOption: 'B',
    explanation: "D'Alembert's Principle states that a body is in dynamic equilibrium when external forces are combined with the fictitious inertia force F_inertial = -m·a (and reversed effective couple -I·α).",
    referenceSource: 'APSC Advt 31/2025 Syllabus · Kinetics',
    difficulty: 'MEDIUM'
  },
  {
    id: 'apsc-phed-2025-q035',
    questionNumber: 35,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '4. Kinetics',
    topic: 'Simple Harmonic Motion (SHM) and natural frequency',
    stem: 'The period of oscillation of a simple pendulum of length L subjected to acceleration due to gravity g is:',
    options: [
      { id: 'A', text: 'T = 2π · √(g / L)' },
      { id: 'B', text: 'T = 2π · √(L / g)' },
      { id: 'C', text: 'T = (1/2π) · √(L / g)' },
      { id: 'D', text: 'T = π · √(L / 2g)' }
    ],
    correctOption: 'B',
    explanation: 'For small amplitudes, the equation of motion is θ̈ + (g/L)θ = 0. The angular frequency is ω = √(g/L), so period T = 2π/ω = 2π·√(L/g).',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Kinetics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q036',
    questionNumber: 36,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '4. Kinetics',
    topic: 'Linear momentum, angular momentum, and impulse equations',
    stem: 'In a completely inelastic collision between two moving bodies, which of the following is true?',
    options: [
      { id: 'A', text: 'Both kinetic energy and momentum are conserved' },
      { id: 'B', text: 'Momentum is conserved, but kinetic energy is not conserved' },
      { id: 'C', text: 'Kinetic energy is conserved, but momentum is not conserved' },
      { id: 'D', text: 'Neither kinetic energy nor momentum is conserved' }
    ],
    correctOption: 'B',
    explanation: 'In any collision with no external forces, total linear momentum is conserved. In an inelastic collision, the coefficient of restitution e < 1 (e = 0 for perfectly inelastic), causing loss of kinetic energy to heat/deformation.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Kinetics',
    difficulty: 'EASY'
  },

  // =========================================================================
  // MODULE 5: STRENGTH OF MATERIALS (Q37 - Q56)
  // =========================================================================
  {
    id: 'apsc-phed-2025-q037',
    questionNumber: 37,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '5. Strength of Materials',
    topic: 'Homogeneous and isotropic media & stress-strain elastic constants (E, G, K, μ)',
    stem: 'For an isotropic linear elastic material, the mathematical relationship connecting Young’s Modulus E, Shear Modulus G, and Poisson’s ratio μ is:',
    options: [
      { id: 'A', text: 'E = 2G(1 + μ)' },
      { id: 'B', text: 'E = 3G(1 - 2μ)' },
      { id: 'C', text: 'G = 2E(1 + μ)' },
      { id: 'D', text: 'E = G(1 + 2μ)' }
    ],
    correctOption: 'A',
    explanation: 'The fundamental elastic constant relation is E = 2G(1 + μ) and E = 3K(1 - 2μ).',
    referenceSource: 'APSC Advt 31/2025 Syllabus · SOM',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q038',
    questionNumber: 38,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '5. Strength of Materials',
    topic: 'Homogeneous and isotropic media & stress-strain elastic constants (E, G, K, μ)',
    stem: 'The theoretical upper limit of Poisson’s ratio (μ) for an isotropic elastic solid to ensure non-negative volumetric strain is:',
    options: [
      { id: 'A', text: '0.25' },
      { id: 'B', text: '0.33' },
      { id: 'C', text: '0.50' },
      { id: 'D', text: '1.00' }
    ],
    correctOption: 'C',
    explanation: 'From bulk modulus K = E / [3(1 - 2μ)], for K to remain positive and finite, (1 - 2μ) ≥ 0 => μ ≤ 0.5. At μ = 0.5, the material is perfectly incompressible (e.g. rubber).',
    referenceSource: 'APSC Advt 31/2025 Syllabus · SOM',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q039',
    questionNumber: 39,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '5. Strength of Materials',
    topic: 'Compound stresses, principal stresses, Mohr circle and principal strains',
    stem: 'A state of pure shear stress of magnitude τ is equivalent to a state of biaxial stress with principal stresses:',
    options: [
      { id: 'A', text: 'σ1 = τ, σ2 = τ' },
      { id: 'B', text: 'σ1 = τ, σ2 = -τ' },
      { id: 'C', text: 'σ1 = 2τ, σ2 = -2τ' },
      { id: 'D', text: 'σ1 = τ/2, σ2 = -τ/2' }
    ],
    correctOption: 'B',
    explanation: 'Pure shear on planes at 0° and 90° induces equal tensile and compressive principal stresses σ1 = +τ and σ2 = -τ on planes inclined at 45° and 135° to the shear planes.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · SOM',
    difficulty: 'MEDIUM'
  },
  {
    id: 'apsc-phed-2025-q040',
    questionNumber: 40,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '5. Strength of Materials',
    topic: 'Compound stresses, principal stresses, Mohr circle and principal strains',
    stem: 'In a Mohr circle of stress, the radius of the circle represents the:',
    options: [
      { id: 'A', text: 'Maximum normal stress' },
      { id: 'B', text: 'Maximum in-plane shear stress' },
      { id: 'C', text: 'Average normal stress' },
      { id: 'D', text: 'Octahedral normal stress' }
    ],
    correctOption: 'B',
    explanation: 'The center of Mohr circle lies at ((σx + σy)/2, 0) and the radius R = √[((σx - σy)/2)² + τxy²], which equals the maximum in-plane shear stress τ_max.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · SOM',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q041',
    questionNumber: 41,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '5. Strength of Materials',
    topic: 'Simple theories of failure (Rankine, Tresca, Von Mises, St. Venant, Mohr-Coulomb)',
    stem: 'Which theory of failure is most suitable and accurately predicts yield failure for ductile materials subjected to complex multiaxial stress states?',
    options: [
      { id: 'A', text: 'Maximum Principal Stress Theory (Rankine)' },
      { id: 'B', text: 'Maximum Distortion Energy Theory (Von Mises)' },
      { id: 'C', text: 'Maximum Principal Strain Theory (St. Venant)' },
      { id: 'D', text: 'Maximum Total Strain Energy Theory (Haigh)' }
    ],
    correctOption: 'B',
    explanation: 'The Von Mises (Maximum Distortion Energy or Octahedral Shear Stress) theory gives the best agreement with experimental yield results for ductile metals.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · SOM',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q042',
    questionNumber: 42,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '5. Strength of Materials',
    topic: 'Simple theories of failure (Rankine, Tresca, Von Mises, St. Venant, Mohr-Coulomb)',
    stem: 'For brittle materials like cast iron or unreinforced concrete, failure under static loading is best predicted by:',
    options: [
      { id: 'A', text: "Tresca's Maximum Shear Stress Theory" },
      { id: 'B', text: "Von Mises' Distortion Energy Theory" },
      { id: 'C', text: "Rankine's Maximum Principal Stress Theory" },
      { id: 'D', text: "St. Venant's Maximum Strain Theory" }
    ],
    correctOption: 'C',
    explanation: 'Rankine’s Maximum Principal Stress theory states that failure occurs when the largest principal stress reaches the ultimate tensile or compressive strength, making it ideal for brittle materials.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · SOM',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q043',
    questionNumber: 43,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '5. Strength of Materials',
    topic: 'Shear force and bending moment diagrams (SFD & BMD) for determinate beams',
    stem: 'In a beam subjected to transverse loading, the point where the bending moment is maximum or minimum corresponds to the location where the shear force:',
    options: [
      { id: 'A', text: 'Is maximum' },
      { id: 'B', text: 'Changes sign or is zero' },
      { id: 'C', text: 'Is equal to the applied load' },
      { id: 'D', text: 'Reaches inflection' }
    ],
    correctOption: 'B',
    explanation: 'Since dM/dx = V (shear force), extrema in bending moment occur where dM/dx = 0, which corresponds to points where the shear force passes through zero or changes sign.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · SOM',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q044',
    questionNumber: 44,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '5. Strength of Materials',
    topic: 'Shear force and bending moment diagrams (SFD & BMD) for determinate beams',
    stem: 'A simply supported beam of span L carries a uniformly distributed load w throughout. The maximum bending moment at mid-span is:',
    options: [
      { id: 'A', text: 'w·L² / 8' },
      { id: 'B', text: 'w·L² / 12' },
      { id: 'C', text: 'w·L² / 4' },
      { id: 'D', text: 'w·L / 8' }
    ],
    correctOption: 'A',
    explanation: 'Each reaction is w·L/2. At mid-span x = L/2, M = (w·L/2)·(L/2) - w·(L/2)·(L/4) = w·L²/8.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · SOM',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q045',
    questionNumber: 45,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '5. Strength of Materials',
    topic: 'Theory of pure bending and shear stress distribution in beam cross-sections',
    stem: 'The ratio of maximum shear stress to average shear stress in a beam of rectangular cross-section subjected to transverse shear is:',
    options: [
      { id: 'A', text: '1.25' },
      { id: 'B', text: '1.33' },
      { id: 'C', text: '1.50' },
      { id: 'D', text: '2.00' }
    ],
    correctOption: 'C',
    explanation: 'For a rectangular section, shear stress follows a parabolic distribution τ(y) = (3V / 2bd)·[1 - (2y/d)²]. At the neutral axis y = 0, τ_max = 1.5·τ_avg.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · SOM',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q046',
    questionNumber: 46,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '5. Strength of Materials',
    topic: 'Theory of pure bending and shear stress distribution in beam cross-sections',
    stem: 'In a circular cross-section beam of diameter D subjected to shear force V, the maximum shear stress occurs at the neutral axis and equals:',
    options: [
      { id: 'A', text: '(4/3) · τ_avg' },
      { id: 'B', text: '(3/2) · τ_avg' },
      { id: 'C', text: '(9/8) · τ_avg' },
      { id: 'D', text: '2 · τ_avg' }
    ],
    correctOption: 'A',
    explanation: 'For a solid circular cross-section, τ_max = (4/3)·τ_avg = 4V / (3·πR²).',
    referenceSource: 'APSC Advt 31/2025 Syllabus · SOM',
    difficulty: 'MEDIUM'
  },
  {
    id: 'apsc-phed-2025-q047',
    questionNumber: 47,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '5. Strength of Materials',
    topic: 'Deflection of beams (Macaulay, Moment-Area, Conjugate Beam methods)',
    stem: 'A cantilever beam of span L and flexural rigidity EI carries a concentrated point load P at its free tip. The maximum deflection at the free end is:',
    options: [
      { id: 'A', text: 'P·L³ / (3EI)' },
      { id: 'B', text: 'P·L³ / (8EI)' },
      { id: 'C', text: 'P·L³ / (48EI)' },
      { id: 'D', text: 'P·L² / (2EI)' }
    ],
    correctOption: 'A',
    explanation: 'By standard beam integration or moment-area method: slope θ = P·L²/(2EI) and deflection δ = P·L³/(3EI).',
    referenceSource: 'APSC Advt 31/2025 Syllabus · SOM',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q048',
    questionNumber: 48,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '5. Strength of Materials',
    topic: 'Deflection of beams (Macaulay, Moment-Area, Conjugate Beam methods)',
    stem: 'According to Mohr’s First Moment-Area Theorem, the change in slope between any two points on an elastic curve of a beam is equal to the:',
    options: [
      { id: 'A', text: 'Area of the M/(EI) diagram between those two points' },
      { id: 'B', text: 'Moment of the M/(EI) diagram about one of the points' },
      { id: 'C', text: 'Shear force divided by flexural rigidity' },
      { id: 'D', text: 'Total strain energy stored in the segment' }
    ],
    correctOption: 'A',
    explanation: "Mohr's First Theorem states that the angle between tangents at two points A and B on the deflected elastic curve equals the area of the M/(EI) diagram between A and B.",
    referenceSource: 'APSC Advt 31/2025 Syllabus · SOM',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q049',
    questionNumber: 49,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '5. Strength of Materials',
    topic: 'Theories of columns (Euler & Rankine formulas, effective length) & middle-fourth rule',
    stem: 'The effective length (Le) of a column of actual length L having one end fixed and the other end free (cantilever column) is:',
    options: [
      { id: 'A', text: '0.5 L' },
      { id: 'B', text: '0.707 L' },
      { id: 'C', text: '1.0 L' },
      { id: 'D', text: '2.0 L' }
    ],
    correctOption: 'D',
    explanation: 'For a column with one end fixed and other free, the buckled shape represents one-quarter of a complete sine wave, giving effective length Le = 2L.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · SOM',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q050',
    questionNumber: 50,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '5. Strength of Materials',
    topic: 'Theories of columns (Euler & Rankine formulas, effective length) & middle-fourth rule',
    stem: 'To avoid any tensile stress in a solid circular masonry or concrete column of diameter D subjected to an eccentric axial compressive load, the eccentricity e must not exceed (core / middle-quarter rule):',
    options: [
      { id: 'A', text: 'D / 4' },
      { id: 'B', text: 'D / 6' },
      { id: 'C', text: 'D / 8' },
      { id: 'D', text: 'D / 12' }
    ],
    correctOption: 'C',
    explanation: 'For no tension: σ = P/A - P·e·y/I ≥ 0 => e ≤ Z/A. For solid circle, Z = πD³/32, A = πD²/4 => e ≤ D/8. The kernel diameter is D/4 (middle-quarter rule).',
    referenceSource: 'APSC Advt 31/2025 Syllabus · SOM',
    difficulty: 'MEDIUM'
  },
  {
    id: 'apsc-phed-2025-q051',
    questionNumber: 51,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '5. Strength of Materials',
    topic: 'Torsion of circular shafts, combined bending direct and torsional stresses',
    stem: 'The polar section modulus (Zp) of a solid circular shaft of diameter d is:',
    options: [
      { id: 'A', text: 'π · d³ / 16' },
      { id: 'B', text: 'π · d³ / 32' },
      { id: 'C', text: 'π · d³ / 64' },
      { id: 'D', text: 'π · d⁴ / 32' }
    ],
    correctOption: 'A',
    explanation: 'Polar moment of inertia J = π·d⁴/32. Polar section modulus Zp = J / r = (π·d⁴/32) / (d/2) = π·d³ / 16.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · SOM',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q052',
    questionNumber: 52,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '5. Strength of Materials',
    topic: 'Torsion of circular shafts, combined bending direct and torsional stresses',
    stem: 'When a solid circular shaft is subjected to simultaneous bending moment M and twisting moment T, the equivalent twisting moment (Te) is given by:',
    options: [
      { id: 'A', text: 'M + T' },
      { id: 'B', text: '√(M² + T²)' },
      { id: 'C', text: 'M + √(M² + T²)' },
      { id: 'D', text: '(1/2) · [M + √(M² + T²)]' }
    ],
    correctOption: 'B',
    explanation: 'The equivalent twisting moment Te = √(M² + T²) causes the same maximum shear stress as M and T acting together. (Equivalent bending moment Me = (1/2)·[M + √(M² + T²)]).',
    referenceSource: 'APSC Advt 31/2025 Syllabus · SOM',
    difficulty: 'MEDIUM'
  },
  {
    id: 'apsc-phed-2025-q053',
    questionNumber: 53,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '5. Strength of Materials',
    topic: 'Three-pinned arch analysis and simple frame analysis',
    stem: 'A three-hinged parabolic arch of span L and central rise h carries a uniformly distributed load w over its entire horizontal span. The bending moment at any cross-section of the arch is:',
    options: [
      { id: 'A', text: 'w·L² / 8' },
      { id: 'B', text: 'Zero throughout the span' },
      { id: 'C', text: 'w·h·L / 4' },
      { id: 'D', text: 'w·L² / 12' }
    ],
    correctOption: 'B',
    explanation: 'For a three-hinged parabolic arch with UDL over its entire span, the funicular polygon coincides with the parabolic axis. Consequently, the bending moment is zero everywhere (pure axial thrust).',
    referenceSource: 'APSC Advt 31/2025 Syllabus · SOM',
    difficulty: 'MEDIUM'
  },
  {
    id: 'apsc-phed-2025-q054',
    questionNumber: 54,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '5. Strength of Materials',
    topic: 'Strain energy in elastic deformation, impact loading, fatigue, and creep',
    stem: 'The strain energy stored in a member of length L, cross-sectional area A, and elastic modulus E under an axial tensile load P is:',
    options: [
      { id: 'A', text: 'P² · L / (AE)' },
      { id: 'B', text: 'P² · L / (2AE)' },
      { id: 'C', text: 'P · L² / (2AE)' },
      { id: 'D', text: 'P² · A / (2LE)' }
    ],
    correctOption: 'B',
    explanation: 'Strain energy U = (1/2)·P·δ = (1/2)·P·(PL / AE) = P²·L / (2AE).',
    referenceSource: 'APSC Advt 31/2025 Syllabus · SOM',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q055',
    questionNumber: 55,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '5. Strength of Materials',
    topic: 'Strain energy in elastic deformation, impact loading, fatigue, and creep',
    stem: 'The stress produced in a bar by a suddenly applied load is how many times the stress produced when the same load is applied gradually?',
    options: [
      { id: 'A', text: '1.5 times' },
      { id: 'B', text: '2.0 times' },
      { id: 'C', text: '3.0 times' },
      { id: 'D', text: '4.0 times' }
    ],
    correctOption: 'B',
    explanation: 'For a suddenly applied load (without initial velocity), the impact factor is 2. The dynamic stress produced is exactly twice the static gradually applied stress: σ_sudden = 2 · σ_gradual.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · SOM',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q056',
    questionNumber: 56,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '5. Strength of Materials',
    topic: 'Uniaxial tension and compression, riveted and welded joints',
    stem: 'In a butt-welded joint subjected to tensile loading, the design strength of the weld is evaluated based on the:',
    options: [
      { id: 'A', text: 'Leg length of the weld' },
      { id: 'B', text: 'Effective throat thickness of the weld' },
      { id: 'C', text: 'Root gap only' },
      { id: 'D', text: 'Reinforcement height only' }
    ],
    correctOption: 'B',
    explanation: 'The strength of both butt and fillet welded joints is calculated over the effective throat thickness (the shortest distance from the root to the face of the weld diagram).',
    referenceSource: 'APSC Advt 31/2025 Syllabus · SOM',
    difficulty: 'MEDIUM'
  },

  // =========================================================================
  // MODULE 6: SOIL MECHANICS (Q57 - Q72)
  // =========================================================================
  {
    id: 'apsc-phed-2025-q057',
    questionNumber: 57,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '6. Soil Mechanics',
    topic: 'Origin of soils, phase relationships, void ratio, porosity, moisture content',
    stem: 'The relationship between void ratio (e) and porosity (n) of a soil mass is given by:',
    options: [
      { id: 'A', text: 'e = n / (1 - n)' },
      { id: 'B', text: 'e = n / (1 + n)' },
      { id: 'C', text: 'n = e / (1 - e)' },
      { id: 'D', text: 'e · n = 1' }
    ],
    correctOption: 'A',
    explanation: 'Since n = Vv / V and e = Vv / Vs, with V = Vs + Vv, we have n = e / (1 + e) and inversely e = n / (1 - n).',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Soil Mechanics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q058',
    questionNumber: 58,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '6. Soil Mechanics',
    topic: 'Origin of soils, phase relationships, void ratio, porosity, moisture content',
    stem: 'For a fully saturated soil sample (degree of saturation S = 100%), the product of specific gravity of soil solids (G) and moisture content (w) equals:',
    options: [
      { id: 'A', text: 'Void ratio (e)' },
      { id: 'B', text: 'Porosity (n)' },
      { id: 'C', text: 'Dry density (γd)' },
      { id: 'D', text: 'Submerged density (γsub)' }
    ],
    correctOption: 'A',
    explanation: 'From the fundamental phase relation e · S = w · G, when saturated S = 1, hence e = w · G.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Soil Mechanics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q059',
    questionNumber: 59,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '6. Soil Mechanics',
    topic: 'Soil classification (ISCS / USCS) and compaction (Standard & Modified Proctor)',
    stem: 'In the Indian Standard Soil Classification System (ISCS), a clay with liquid limit greater than 50% is classified as:',
    options: [
      { id: 'A', text: 'CL (Low plasticity clay)' },
      { id: 'B', text: 'CI (Intermediate plasticity clay)' },
      { id: 'C', text: 'CH (High plasticity clay)' },
      { id: 'D', text: 'MH (High plasticity silt)' }
    ],
    correctOption: 'C',
    explanation: 'In IS 1498: LL < 35% is low compressibility (L), 35% to 50% is intermediate (I), and LL > 50% is high compressibility (H). Clays plotting above A-line with LL > 50% are designated CH.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Soil Mechanics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q060',
    questionNumber: 60,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '6. Soil Mechanics',
    topic: 'Soil classification (ISCS / USCS) and compaction (Standard & Modified Proctor)',
    stem: 'As the compactive effort in a Proctor compaction test is increased, the maximum dry unit weight (γd,max) and Optimum Moisture Content (OMC):',
    options: [
      { id: 'A', text: 'Both increase' },
      { id: 'B', text: 'γd,max increases and OMC decreases' },
      { id: 'C', text: 'Both decrease' },
      { id: 'D', text: 'γd,max decreases and OMC increases' }
    ],
    correctOption: 'B',
    explanation: 'Increasing compactive energy shifts the compaction curve upwards and to the left, resulting in a higher maximum dry density and a lower optimum moisture content.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Soil Mechanics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q061',
    questionNumber: 61,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '6. Soil Mechanics',
    topic: 'Permeability, seepage, and construction of flow nets',
    stem: 'In a flow net consisting of orthogonal flow lines and equipotential lines with Nf flow channels and Nd potential drops, the seepage discharge Q per unit length under head H is:',
    options: [
      { id: 'A', text: 'k · H · (Nf / Nd)' },
      { id: 'B', text: 'k · H · (Nd / Nf)' },
      { id: 'C', text: 'k · H · √(Nf · Nd)' },
      { id: 'D', text: 'k · H² · (Nf / Nd)' }
    ],
    correctOption: 'A',
    explanation: 'From Darcy’s Law applied to an orthogonal flow net of curvilinear squares: Q = k · H · (Nf / Nd), where (Nf / Nd) is the shape factor of the flow net.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Soil Mechanics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q062',
    questionNumber: 62,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '6. Soil Mechanics',
    topic: 'Permeability, seepage, and construction of flow nets',
    stem: 'The critical hydraulic gradient (ic) for upward seepage through a cohesionless soil causing the "quick sand" condition is given by:',
    options: [
      { id: 'A', text: '(G - 1) / (1 + e)' },
      { id: 'B', text: '(G + 1) / (1 + e)' },
      { id: 'C', text: '(G - 1) / (1 - e)' },
      { id: 'D', text: 'G / (1 + e)' }
    ],
    correctOption: 'A',
    explanation: 'Quicksand occurs when effective stress σ’ = 0, i.e., upward seepage force equals submerged weight: i_c · γw = γsub = [(G - 1)/(1 + e)]·γw => i_c = (G - 1) / (1 + e). Typically i_c ≈ 1.0.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Soil Mechanics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q063',
    questionNumber: 63,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '6. Soil Mechanics',
    topic: 'Shear strength parameters for drained/undrained conditions (triaxial, unconfined, direct shear tests)',
    stem: 'According to the Mohr-Coulomb failure criterion, the shear strength (τf) of a soil on any plane is expressed as:',
    options: [
      { id: 'A', text: 'c + σ · tan(φ)' },
      { id: 'B', text: 'c · tan(φ) + σ' },
      { id: 'C', text: 'c + σ / tan(φ)' },
      { id: 'D', text: '√(c² + σ²)' }
    ],
    correctOption: 'A',
    explanation: 'The Mohr-Coulomb equation is τf = c + σ·tan(φ) (or in terms of effective stresses: τf = c’ + σ’·tan(φ’)), where c is cohesion and φ is angle of internal friction.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Soil Mechanics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q064',
    questionNumber: 64,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '6. Soil Mechanics',
    topic: 'Shear strength parameters for drained/undrained conditions (triaxial, unconfined, direct shear tests)',
    stem: 'In an unconfined compression test on a saturated purely cohesive clay (φu = 0), the unconfined compressive strength is qu. The undrained shear strength (cu) of the clay is:',
    options: [
      { id: 'A', text: 'qu / 2' },
      { id: 'B', text: 'qu' },
      { id: 'C', text: '2 · qu' },
      { id: 'D', text: 'qu / √3' }
    ],
    correctOption: 'A',
    explanation: 'For φ = 0, the diameter of the Mohr circle at failure is qu, so radius cu = qu / 2.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Soil Mechanics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q065',
    questionNumber: 65,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '6. Soil Mechanics',
    topic: 'Earth pressure theories: Rankine and Coulomb analytical and graphical methods',
    stem: 'According to Rankine’s Earth Pressure theory, the coefficient of active earth pressure (Ka) for a cohesionless backfill with horizontal surface and friction angle φ is:',
    options: [
      { id: 'A', text: '(1 - sin φ) / (1 + sin φ)' },
      { id: 'B', text: '(1 + sin φ) / (1 - sin φ)' },
      { id: 'C', text: 'tan²(45° + φ/2)' },
      { id: 'D', text: '1 - sin φ' }
    ],
    correctOption: 'A',
    explanation: 'Ka = (1 - sin φ) / (1 + sin φ) = tan²(45° - φ/2). Passive earth pressure coefficient Kp = 1/Ka = (1 + sin φ) / (1 - sin φ) = tan²(45° + φ/2).',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Soil Mechanics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q066',
    questionNumber: 66,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '6. Soil Mechanics',
    topic: 'Earth pressure theories: Rankine and Coulomb analytical and graphical methods',
    stem: 'For a cohesive backfill with cohesion c and unit weight γ, the depth of tensile cracks (zc) at the top of an unsupported vertical cut is given by:',
    options: [
      { id: 'A', text: '2c / (γ · √Ka)' },
      { id: 'B', text: '4c / (γ · √Ka)' },
      { id: 'C', text: 'c / (2γ · √Ka)' },
      { id: 'D', text: '2c · √Ka / γ' }
    ],
    correctOption: 'A',
    explanation: 'Active pressure pa = γ·z·Ka - 2c·√Ka. At the bottom of the tension zone pa = 0 => zc = 2c / (γ·√Ka). The total unsupported vertical cut depth is Hc = 2·zc = 4c / (γ·√Ka).',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Soil Mechanics',
    difficulty: 'MEDIUM'
  },
  {
    id: 'apsc-phed-2025-q067',
    questionNumber: 67,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '6. Soil Mechanics',
    topic: 'Soil consolidation: Terzaghi one-dimensional consolidation theory, settlement rate & ultimate settlement',
    stem: 'In Terzaghi’s one-dimensional consolidation theory, the coefficient of consolidation (Cv) is defined as:',
    options: [
      { id: 'A', text: 'k / (mv · γw)' },
      { id: 'B', text: 'k · mv / γw' },
      { id: 'C', text: 'mv / (k · γw)' },
      { id: 'D', text: 'k · γw / mv' }
    ],
    correctOption: 'A',
    explanation: 'The governing consolidation equation is ∂u/∂t = Cv·(∂²u/∂z²), where Cv = k / (mv · γw).',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Soil Mechanics',
    difficulty: 'MEDIUM'
  },
  {
    id: 'apsc-phed-2025-q068',
    questionNumber: 68,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '6. Soil Mechanics',
    topic: 'Soil consolidation: Terzaghi one-dimensional consolidation theory, settlement rate & ultimate settlement',
    stem: 'A clay layer of thickness 2H undergoes consolidation with two-way drainage (permeable layers at top and bottom). The drainage path length (d) for Terzaghi’s time factor formula is:',
    options: [
      { id: 'A', text: 'H' },
      { id: 'B', text: '2H' },
      { id: 'C', text: 'H / 2' },
      { id: 'D', text: '4H' }
    ],
    correctOption: 'A',
    explanation: 'For two-way drainage, water drains towards either the top or bottom boundary, so maximum drainage distance d = (2H) / 2 = H. For one-way drainage, d = 2H.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Soil Mechanics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q069',
    questionNumber: 69,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '6. Soil Mechanics',
    topic: 'Effective stress concept and stress distribution in soils (Boussinesq & Westergaard)',
    stem: 'According to Boussinesq’s theory for vertical stress under a concentrated surface point load Q, the vertical stress σz on the vertical axis directly under the load (r = 0) at depth z is proportional to:',
    options: [
      { id: 'A', text: '1 / z' },
      { id: 'B', text: '1 / z²' },
      { id: 'C', text: '1 / z³' },
      { id: 'D', text: '1 / z⁴' }
    ],
    correctOption: 'B',
    explanation: 'Boussinesq formula directly under the load is σz = (3Q / 2π) · (1 / z²). Hence stress is inversely proportional to z².',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Soil Mechanics',
    difficulty: 'MEDIUM'
  },
  {
    id: 'apsc-phed-2025-q070',
    questionNumber: 70,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '6. Soil Mechanics',
    topic: 'Foundation engineering: Terzaghi & Meyerhof bearing capacity of shallow footings',
    stem: 'According to Terzaghi’s bearing capacity theory, the ultimate bearing capacity (qu) of a continuous strip footing resting on a purely cohesive soil (c > 0, φ = 0) at ground surface (Df = 0) is:',
    options: [
      { id: 'A', text: '5.14 c' },
      { id: 'B', text: '5.7 c' },
      { id: 'C', text: '3.14 c' },
      { id: 'D', text: '6.28 c' }
    ],
    correctOption: 'B',
    explanation: 'Terzaghi’s general bearing capacity equation is qu = c·Nc + q·Nq + 0.5·γ·B·Nγ. For φ = 0, Terzaghi takes Nc = 5.7, Nq = 1, Nγ = 0. At surface Df = 0, qu = 5.7 c. (Prandtl gives 5.14 c).',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Soil Mechanics',
    difficulty: 'MEDIUM'
  },
  {
    id: 'apsc-phed-2025-q071',
    questionNumber: 71,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '6. Soil Mechanics',
    topic: 'Deep foundations: pile load capacity, group action, well foundations, and sheet piles',
    stem: 'Negative skin friction on a pile foundation occurs primarily when:',
    options: [
      { id: 'A', text: 'The pile moves downwards relative to the surrounding soil' },
      { id: 'B', text: 'The surrounding compressible soil settles more than the pile' },
      { id: 'C', text: 'The soil is subjected to upward seepage forces' },
      { id: 'D', text: 'The pile is driven into dense bedrock' }
    ],
    correctOption: 'B',
    explanation: 'When soft newly placed fill or compressible clay layer consolidates, the soil moves down relative to the pile shaft, dragging it downward and adding a downward load termed negative skin friction.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Soil Mechanics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q072',
    questionNumber: 72,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '6. Soil Mechanics',
    topic: 'Deep foundations: pile load capacity, group action, well foundations, and sheet piles',
    stem: 'In a group of n friction piles driven into cohesive soil, the group efficiency η is generally:',
    options: [
      { id: 'A', text: 'Always greater than 100%' },
      { id: 'B', text: 'Usually less than 100% due to overlapping stress zones' },
      { id: 'C', text: 'Exactly 100%' },
      { id: 'D', text: 'Independent of pile spacing' }
    ],
    correctOption: 'B',
    explanation: 'In cohesive soils (clays), overlapping stress bulbs cause the group capacity to be less than the sum of individual capacities (η < 1.0), unless piles are spaced widely (≥ 3 to 4 times pile diameter).',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Soil Mechanics',
    difficulty: 'MEDIUM'
  },

  // =========================================================================
  // MODULE 7: FLUID MECHANICS (Q73 - Q88)
  // =========================================================================
  {
    id: 'apsc-phed-2025-q073',
    questionNumber: 73,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '7. Fluid Mechanics',
    topic: 'Physical properties of fluids (viscosity, surface tension, capillarity, compressibility)',
    stem: 'Newton’s law of viscosity relates shear stress (τ) linearly with:',
    options: [
      { id: 'A', text: 'Velocity' },
      { id: 'B', text: 'Rate of shear deformation (velocity gradient du/dy)' },
      { id: 'C', text: 'Pressure gradient' },
      { id: 'D', text: 'Volumetric strain' }
    ],
    correctOption: 'B',
    explanation: 'Newton’s law of viscosity states that shear stress is directly proportional to velocity gradient (rate of angular strain): τ = μ · (du/dy).',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Fluid Mechanics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q074',
    questionNumber: 74,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '7. Fluid Mechanics',
    topic: 'Fluid statics: pressure measurement, hydrostatic force on plane and curved surfaces',
    stem: 'The total hydrostatic force F on a submerged plane surface of area A with centroid at depth h̄ below the free water surface is:',
    options: [
      { id: 'A', text: 'ρ · g · A · h̄' },
      { id: 'B', text: 'ρ · g · A · h̄ / 2' },
      { id: 'C', text: 'ρ · g · I_G / h̄' },
      { id: 'D', text: 'ρ · g · A² / h̄' }
    ],
    correctOption: 'A',
    explanation: 'Total pressure force F = ∫ p dA = ρ·g ∫ h dA = ρ·g·A·h̄, where h̄ is the vertical depth of the centroid of the area.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Fluid Mechanics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q075',
    questionNumber: 75,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '7. Fluid Mechanics',
    topic: 'Fluid statics: pressure measurement, hydrostatic force on plane and curved surfaces',
    stem: 'The centre of pressure of a vertical plane submerged surface always lies:',
    options: [
      { id: 'A', text: 'Above the centroid' },
      { id: 'B', text: 'Below the centroid' },
      { id: 'C', text: 'At the centroid' },
      { id: 'D', text: 'At the free liquid surface' }
    ],
    correctOption: 'B',
    explanation: 'Depth of center of pressure h_cp = h̄ + I_G / (A·h̄). Because I_G / (A·h̄) is always positive, the center of pressure is always located below the centroid.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Fluid Mechanics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q076',
    questionNumber: 76,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '7. Fluid Mechanics',
    topic: 'Buoyancy, flotation, metacentre, and stability of submerged and floating bodies',
    stem: 'A floating body is in stable rotational equilibrium when its metacentre M lies:',
    options: [
      { id: 'A', text: 'Above its centre of gravity G (GM > 0)' },
      { id: 'B', text: 'Below its centre of gravity G (GM < 0)' },
      { id: 'C', text: 'Coincident with its centre of gravity G (GM = 0)' },
      { id: 'D', text: 'Below its centre of buoyancy B' }
    ],
    correctOption: 'A',
    explanation: 'For a floating body, when metacentric height GM is positive (M lies above G), a small tilt produces a restoring righting couple, ensuring stable equilibrium.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Fluid Mechanics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q077',
    questionNumber: 77,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '7. Fluid Mechanics',
    topic: 'Fluid kinematics: continuity equation, velocity potential, stream function, flow nets',
    stem: 'If a velocity potential function φ exists for a fluid flow field, the flow must necessarily be:',
    options: [
      { id: 'A', text: 'Rotational' },
      { id: 'B', text: 'Irrotational' },
      { id: 'C', text: 'Turbulent' },
      { id: 'D', text: 'Unsteady' }
    ],
    correctOption: 'B',
    explanation: 'The curl of the gradient of any scalar function is identically zero: ∇ × (∇φ) = 0. Hence the existence of velocity potential φ guarantees that vorticity is zero (irrotational flow).',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Fluid Mechanics',
    difficulty: 'MEDIUM'
  },
  {
    id: 'apsc-phed-2025-q078',
    questionNumber: 78,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '7. Fluid Mechanics',
    topic: 'Fluid kinematics: continuity equation, velocity potential, stream function, flow nets',
    stem: 'In a 2D incompressible flow field, equipotential lines (φ = constant) and streamlines (ψ = constant) intersect each other at:',
    options: [
      { id: 'A', text: '45°' },
      { id: 'B', text: '90° (orthogonally)' },
      { id: 'C', text: '0° (tangentially)' },
      { id: 'D', text: '60°' }
    ],
    correctOption: 'B',
    explanation: 'From Cauchy-Riemann relations, (dy/dx)_φ · (dy/dx)_ψ = (-u/v)·(v/u) = -1. Therefore equipotential lines and streamlines intersect at right angles (orthogonally).',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Fluid Mechanics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q079',
    questionNumber: 79,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '7. Fluid Mechanics',
    topic: 'Fluid dynamics: Euler equation, momentum equation, and Bernoulli theorem applications',
    stem: 'Bernoulli’s equation is obtained by integrating Euler’s equation of motion along a streamline under which of the following assumptions?',
    options: [
      { id: 'A', text: 'Steady, incompressible, frictionless (inviscid) flow along a streamline' },
      { id: 'B', text: 'Unsteady, compressible, viscous flow' },
      { id: 'C', text: 'Rotational, turbulent, compressible flow' },
      { id: 'D', text: 'Non-uniform, viscous, adiabatic flow' }
    ],
    correctOption: 'A',
    explanation: 'Bernoulli’s equation p/γ + v²/(2g) + z = constant requires steady, inviscid (frictionless), incompressible flow with body forces limited to gravity.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Fluid Mechanics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q080',
    questionNumber: 80,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '7. Fluid Mechanics',
    topic: 'Rotational and irrotational flow vortices, flow measurement (Venturi, orifice, notches, weirs)',
    stem: 'In a forced vortex motion of an ideal liquid, the tangential velocity v at any radius r from the axis of rotation varies as:',
    options: [
      { id: 'A', text: 'v ∝ r' },
      { id: 'B', text: 'v ∝ 1 / r' },
      { id: 'C', text: 'v ∝ 1 / r²' },
      { id: 'D', text: 'v is constant' }
    ],
    correctOption: 'A',
    explanation: 'In a forced vortex, the fluid rotates as a solid body with constant angular velocity ω, so v = ω·r (v ∝ r). In a free vortex, v ∝ 1/r (irrotational).',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Fluid Mechanics',
    difficulty: 'MEDIUM'
  },
  {
    id: 'apsc-phed-2025-q081',
    questionNumber: 81,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '7. Fluid Mechanics',
    topic: 'Cavitation causes and prevention in hydraulic systems',
    stem: 'Cavitation in hydraulic turbines and pumps is initiated when the local absolute pressure in the liquid drops below:',
    options: [
      { id: 'A', text: 'Atmospheric pressure' },
      { id: 'B', text: 'Saturated vapour pressure of the liquid at operating temperature' },
      { id: 'C', text: 'Zero absolute pressure' },
      { id: 'D', text: 'Gauge pressure' }
    ],
    correctOption: 'B',
    explanation: 'When the local absolute pressure falls to or below the vapor pressure (pv) of the liquid at that temperature, vapor bubbles form and suddenly collapse in higher pressure regions, causing severe pitting and vibrations.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Fluid Mechanics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q082',
    questionNumber: 82,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '7. Fluid Mechanics',
    topic: 'Dimensional analysis: Buckingham Pi theorem, similitude, Reynolds & Froude model laws',
    stem: 'For dynamic similarity between a model and its prototype where gravity and inertia forces are predominant (e.g. spillways, open channels, ship wave resistance), the model design must be governed by:',
    options: [
      { id: 'A', text: 'Reynolds Model Law' },
      { id: 'B', text: 'Froude Model Law' },
      { id: 'C', text: 'Mach Model Law' },
      { id: 'D', text: 'Weber Model Law' }
    ],
    correctOption: 'B',
    explanation: 'Froude number Fr = V / √(g·L) represents the ratio of inertia force to gravity force. Open surface gravity flows require equality of Froude numbers (Fr_m = Fr_p).',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Fluid Mechanics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q083',
    questionNumber: 83,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '7. Fluid Mechanics',
    topic: 'Viscous laminar flow between parallel plates and circular pipes (Hagen-Poiseuille)',
    stem: 'In fully developed laminar flow through a circular pipe of diameter D (Hagen-Poiseuille flow), the ratio of maximum velocity at the centerline to the average velocity is:',
    options: [
      { id: 'A', text: '1.33' },
      { id: 'B', text: '1.50' },
      { id: 'C', text: '2.00' },
      { id: 'D', text: '2.50' }
    ],
    correctOption: 'C',
    explanation: 'The velocity distribution is parabolic u(r) = u_max·[1 - (r/R)²]. Integrating gives average velocity v_avg = u_max / 2, so u_max / v_avg = 2.0. (Between parallel plates, the ratio is 1.5).',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Fluid Mechanics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q084',
    questionNumber: 84,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '7. Fluid Mechanics',
    topic: 'Incompressible pipe flow: Darcy-Weisbach friction losses, minor losses, HGL and TEL',
    stem: 'The Darcy-Weisbach friction factor f for laminar flow in a circular pipe with Reynolds number Re (where Re < 2000) is given by:',
    options: [
      { id: 'A', text: '16 / Re' },
      { id: 'B', text: '64 / Re' },
      { id: 'C', text: '0.316 / Re^(0.25)' },
      { id: 'D', text: '0.079 / Re^(0.25)' }
    ],
    correctOption: 'B',
    explanation: 'From the Hagen-Poiseuille equation, head loss hf = 32μvL/(ρgD²) = (64/Re)·(L/D)·(v²/2g). Hence friction factor f = 64 / Re. (Fanning friction coefficient f’ = 16/Re).',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Fluid Mechanics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q085',
    questionNumber: 85,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '7. Fluid Mechanics',
    topic: 'Open channel flow: uniform flow (Manning & Chezy), specific energy, critical depth',
    stem: 'For critical flow in a rectangular open channel of width B carrying a discharge Q, the critical depth (yc) is given by (where q = Q/B):',
    options: [
      { id: 'A', text: '(q² / g)^(1/3)' },
      { id: 'B', text: '(q² / g)^(1/2)' },
      { id: 'C', text: 'q / √(g)' },
      { id: 'D', text: '(q / g²)^(1/3)' }
    ],
    correctOption: 'A',
    explanation: 'At critical flow Fr = 1 => v²/gy = 1. Since v = q/y, (q/y)² / (gy) = 1 => y_c³ = q²/g => y_c = (q² / g)^(1/3).',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Fluid Mechanics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q086',
    questionNumber: 86,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '7. Fluid Mechanics',
    topic: 'Open channel flow: uniform flow (Manning & Chezy), specific energy, critical depth',
    stem: 'In a rectangular open channel, the relationship between minimum specific energy (E_min) and critical depth (yc) is:',
    options: [
      { id: 'A', text: 'E_min = 1.2 yc' },
      { id: 'B', text: 'E_min = 1.5 yc' },
      { id: 'C', text: 'E_min = 2.0 yc' },
      { id: 'D', text: 'E_min = 2.5 yc' }
    ],
    correctOption: 'B',
    explanation: 'Specific energy E = y + v²/(2g). At critical depth, velocity head v_c²/(2g) = y_c / 2. Therefore E_min = y_c + y_c / 2 = 1.5 y_c.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Fluid Mechanics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q087',
    questionNumber: 87,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '7. Fluid Mechanics',
    topic: 'Gradually Varied Flow (GVF) surface profiles, hydraulic jump (standing wave flume), surges & waves',
    stem: 'A hydraulic jump in an open channel occurs when the flow transitions from:',
    options: [
      { id: 'A', text: 'Supercritical flow (Fr > 1) to subcritical flow (Fr < 1)' },
      { id: 'B', text: 'Subcritical flow (Fr < 1) to supercritical flow (Fr > 1)' },
      { id: 'C', text: 'Critical flow to uniform flow' },
      { id: 'D', text: 'Laminar flow to turbulent flow' }
    ],
    correctOption: 'A',
    explanation: 'A hydraulic jump is a rapidly varied open channel flow phenomenon where a shooting supercritical flow (Fr1 > 1) abruptly changes into a tranquil subcritical flow (Fr2 < 1) with significant energy dissipation.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Fluid Mechanics',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q088',
    questionNumber: 88,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '7. Fluid Mechanics',
    topic: 'Gradually Varied Flow (GVF) surface profiles, hydraulic jump (standing wave flume), surges & waves',
    stem: 'The sequent (conjugate) depths y1 and y2 of a hydraulic jump in a horizontal rectangular channel are related by Belanger’s equation as:',
    options: [
      { id: 'A', text: 'y2 / y1 = (1/2) · [√(1 + 8·Fr1²) - 1]' },
      { id: 'B', text: 'y2 / y1 = (1/2) · [√(1 + 8·Fr1²) + 1]' },
      { id: 'C', text: 'y2 / y1 = √(1 + 4·Fr1²)' },
      { id: 'D', text: 'y2 / y1 = 2 · Fr1²' }
    ],
    correctOption: 'A',
    explanation: "Belanger's momentum equation for a rectangular hydraulic jump gives y2/y1 = 0.5·[√(1 + 8·Fr1²) - 1].",
    referenceSource: 'APSC Advt 31/2025 Syllabus · Fluid Mechanics',
    difficulty: 'MEDIUM'
  },

  // =========================================================================
  // MODULE 8: SURVEYING (Q89 - Q100)
  // =========================================================================
  {
    id: 'apsc-phed-2025-q089',
    questionNumber: 89,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '8. Surveying',
    topic: 'General principles of surveying, sign conventions, and error theory',
    stem: 'The fundamental principle of "working from whole to part" is adopted in surveying primarily to:',
    options: [
      { id: 'A', text: 'Prevent accumulation of errors and localize discrepancies' },
      { id: 'B', text: 'Reduce the number of survey stations required' },
      { id: 'C', text: 'Allow surveying to be carried out without plotting' },
      { id: 'D', text: 'Minimize instrument calibration time' }
    ],
    correctOption: 'A',
    explanation: 'By establishing high-precision primary control stations over the entire area first and filling in details subsequently ("whole to part"), errors in local measurements do not accumulate into the main framework.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Surveying',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q090',
    questionNumber: 90,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '8. Surveying',
    topic: 'Linear measurements, chain surveying, tape corrections (temperature, pull, sag)',
    stem: 'The sag correction for a measuring tape suspended between two supports is always:',
    options: [
      { id: 'A', text: 'Negative (subtractive)' },
      { id: 'B', text: 'Positive (additive)' },
      { id: 'C', text: 'Zero at standard temperature' },
      { id: 'D', text: 'Dependent on sign of pull' }
    ],
    correctOption: 'A',
    explanation: 'Due to sag under self-weight, the tape curves into a catenary, making the measured distance along the curve greater than the horizontal chord distance. Hence the correction is always negative: Cs = - (W²·L) / (24·P²).',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Surveying',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q091',
    questionNumber: 91,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '8. Surveying',
    topic: 'Compass surveying, magnetic declination, and local attraction correction',
    stem: 'If the whole circle bearing (WCB) of a line is 295°30’, its reduced bearing (quadrantal bearing) is:',
    options: [
      { id: 'A', text: 'N 64°30’ W' },
      { id: 'B', text: 'N 25°30’ W' },
      { id: 'C', text: 'S 64°30’ W' },
      { id: 'D', text: 'N 64°30’ E' }
    ],
    correctOption: 'A',
    explanation: 'The bearing 295°30’ lies in the 4th quadrant (NW). Reduced bearing = 360°00’ - 295°30’ = N 64°30’ W.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Surveying',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q092',
    questionNumber: 92,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '8. Surveying',
    topic: 'Compass surveying, magnetic declination, and local attraction correction',
    stem: 'At any place free from local attraction, the difference between the fore bearing and back bearing of a survey line must be exactly:',
    options: [
      { id: 'A', text: '90°' },
      { id: 'B', text: '180°' },
      { id: 'C', text: '270°' },
      { id: 'D', text: '360°' }
    ],
    correctOption: 'B',
    explanation: 'Back Bearing = Fore Bearing ± 180°. A difference differing from 180° indicates the presence of local attraction or observational error.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Surveying',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q093',
    questionNumber: 93,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '8. Surveying',
    topic: 'Levelling operations, bench marks, curvature and refraction corrections',
    stem: 'The combined correction for the Earth’s curvature and atmospheric refraction for a line of sight distance d (in km) is given by (in metres):',
    options: [
      { id: 'A', text: '-0.0673 · d²' },
      { id: 'B', text: '+0.0673 · d²' },
      { id: 'C', text: '-0.0785 · d²' },
      { id: 'D', text: '+0.0112 · d²' }
    ],
    correctOption: 'A',
    explanation: 'Curvature correction Cc = -0.0785·d², refraction correction Cr = +0.0112·d². The combined correction is C = Cc + Cr = -0.0673·d² (subtractive from staff reading).',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Surveying',
    difficulty: 'MEDIUM'
  },
  {
    id: 'apsc-phed-2025-q094',
    questionNumber: 94,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '8. Surveying',
    topic: 'Levelling operations, bench marks, curvature and refraction corrections',
    stem: 'In differential levelling, reciprocal levelling is adopted when the instrument cannot be set up midway between two stations to eliminate:',
    options: [
      { id: 'A', text: 'Errors due to curvature, refraction, and collimation axis inclination' },
      { id: 'B', text: 'Errors due to temperature variations only' },
      { id: 'C', text: 'Parallax error only' },
      { id: 'D', text: 'Staff graduation errors only' }
    ],
    correctOption: 'A',
    explanation: 'Reciprocal levelling cancels errors due to Earth’s curvature, atmospheric refraction, and non-horizontal line of collimation across wide obstacles like rivers or valleys.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Surveying',
    difficulty: 'MEDIUM'
  },
  {
    id: 'apsc-phed-2025-q095',
    questionNumber: 95,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '8. Surveying',
    topic: 'Theodolite traversing, tacheometric traversing, and traverse computations (Gale table)',
    stem: 'In a closed traverse of N sides, the sum of all included interior angles should equal:',
    options: [
      { id: 'A', text: '(2N - 4) · 90°' },
      { id: 'B', text: '(2N + 4) · 90°' },
      { id: 'C', text: '(N - 2) · 360°' },
      { id: 'D', text: '(2N - 2) · 180°' }
    ],
    correctOption: 'A',
    explanation: 'For any closed polygon of N sides, the sum of interior angles is (2N - 4) right angles = (2N - 4) × 90°. The sum of exterior angles is (2N + 4) × 90°.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Surveying',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q096',
    questionNumber: 96,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '8. Surveying',
    topic: 'Theodolite traversing, tacheometric traversing, and traverse computations (Gale table)',
    stem: 'In traverse balancing by Bowditch’s Rule (compass rule), the correction to latitude or departure of any line is directly proportional to:',
    options: [
      { id: 'A', text: 'The length of that line' },
      { id: 'B', text: 'The square root of length of that line' },
      { id: 'C', text: 'The latitude of that line only' },
      { id: 'D', text: 'The departure of that line only' }
    ],
    correctOption: 'A',
    explanation: 'Bowditch’s rule assumes linear errors ∝ √l and angular errors ∝ 1/√l. The correction to latitude is (Total Error in Lat) × (length of line / Perimeter of traverse).',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Surveying',
    difficulty: 'MEDIUM'
  },
  {
    id: 'apsc-phed-2025-q097',
    questionNumber: 97,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '8. Surveying',
    topic: 'Plane table surveying methods: two-point problem and three-point problem solutions',
    stem: 'In plane table surveying, Lehmann’s method and Bessel’s method are graphical solutions for the:',
    options: [
      { id: 'A', text: 'Three-point problem (resection)' },
      { id: 'B', text: 'Two-point problem' },
      { id: 'C', text: 'Radiation method' },
      { id: 'D', text: 'Traversing method' }
    ],
    correctOption: 'A',
    explanation: 'Lehmann’s method (trial and error rule) and Bessel’s method of inscribed quadrilateral are standard graphical solutions for locating the position of the station via the Three-Point Problem.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Surveying',
    difficulty: 'MEDIUM'
  },
  {
    id: 'apsc-phed-2025-q098',
    questionNumber: 98,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '8. Surveying',
    topic: 'Contour surveying: characteristics, interpolation, and uses of contour maps',
    stem: 'Which of the following statements regarding contour lines on a topographical map is FALSE?',
    options: [
      { id: 'A', text: 'Two contour lines of different elevations can never cross each other, except in an overhanging cliff' },
      { id: 'B', text: 'Closely spaced contour lines represent a steep slope' },
      { id: 'C', text: 'Contour lines cross a valley line (thalweg) at right angles and form V-shapes pointing downstream' },
      { id: 'D', text: 'Contour lines form U-shapes pointing downhill for a ridge line' }
    ],
    correctOption: 'C',
    explanation: 'Contour lines cross a valley line at right angles and form V-shapes that point UPSTREAM (towards higher elevation), not downstream.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Surveying',
    difficulty: 'MEDIUM'
  },
  {
    id: 'apsc-phed-2025-q099',
    questionNumber: 99,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '8. Surveying',
    topic: 'Setting out direction, grades, and types of horizontal & vertical curves',
    stem: 'For a simple circular curve of radius R and deflection angle Δ, the tangent length (T) is given by:',
    options: [
      { id: 'A', text: 'R · tan(Δ / 2)' },
      { id: 'B', text: 'R · sin(Δ / 2)' },
      { id: 'C', text: '2R · sin(Δ / 2)' },
      { id: 'D', text: 'R · cos(Δ / 2)' }
    ],
    correctOption: 'A',
    explanation: 'From geometry of simple circular curves: Tangent Length T = R·tan(Δ/2), Length of Long Chord C = 2R·sin(Δ/2), and Length of Curve L = π·R·Δ / 180°.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Surveying',
    difficulty: 'EASY'
  },
  {
    id: 'apsc-phed-2025-q100',
    questionNumber: 100,
    examId: 'apsc-phed-ae-civil-2025',
    subject: '8. Surveying',
    topic: 'Setting out transition curves, compound curves, and excavation lines for building foundations',
    stem: 'The ideal shape of a horizontal transition curve used in highway and railway alignment to introduce centrifugal acceleration at a constant rate is a:',
    options: [
      { id: 'A', text: 'Cubic Parabola' },
      { id: 'B', text: 'Clothoid (Euler Spiral)' },
      { id: 'C', text: 'Lemniscate of Bernoulli' },
      { id: 'D', text: 'Circular arc' }
    ],
    correctOption: 'B',
    explanation: 'In the clothoid (Euler spiral), the curvature increases linearly with arc length (l ∝ 1/r), providing a strictly constant rate of change of centrifugal acceleration (jerk). IRC recommends the Euler spiral as the ideal transition curve.',
    referenceSource: 'APSC Advt 31/2025 Syllabus · Surveying',
    difficulty: 'MEDIUM'
  }
];
