import type { KnowledgeModule } from '../types';

/**
 * Theory modules for the two foundation subjects the app had no coverage for.
 *
 * Engineering Mechanics and Concrete Technology were only ever referenced as
 * "prerequisites" in the existing modules — the syllabus blueprint lists both as
 * weighted subjects with no module, no questions and no practice behind them, so
 * a candidate could not open either topic anywhere in the app.
 *
 * Every worked example here was recomputed independently before being written,
 * and `scripts/validate-knowledge-modules.mjs` re-checks the structural
 * invariants (the stated answer must appear among the options, every step must
 * carry a takeaway, every inline question must have a resolvable key).
 */
export const FOUNDATION_CIVIL_MODULES: KnowledgeModule[] = [
  {
    id: 'civil-engg-mechanics',
    title: 'Engineering Mechanics — Statics, Inertia & Dynamics',
    subject: 'Engineering Mechanics',
    category: 'civil',
    readTime: '14 min read',
    weightage: 'HIGH_YIELD',
    icon: 'Compass',
    summary:
      'Equilibrium of rigid bodies and trusses, centroid and second moment of area by the parallel axis theorem, friction, and elementary dynamics — the toolkit every later subject is built on.',
    fullDescription:
      'Engineering Mechanics carries its own weight in the paper, and it is also the subject every other one borrows from: shear force diagrams, deflection of beams, lateral earth pressure and column buckling are all applications of these principles. This module covers the examinable core rather than the whole textbook.',
    subtopicList: [
      'Free body diagrams and support reactions',
      'Method of joints and method of sections',
      'Centroid of composite sections',
      'Parallel axis theorem',
      'Friction and angle of repose',
      'Projectile motion and impulse-momentum'
    ],
    syllabusCoverage: [
      'Statics — equilibrium of particles and rigid bodies, trusses',
      'Centroid and moment of inertia of plane areas',
      'Friction — laws, angle of repose, equilibrium on inclines',
      'Dynamics — rectilinear and projectile motion, impulse and momentum'
    ],
    prerequisites: ['Basic algebra and trigonometry', 'Resolution of forces'],
    standardReferences: [
      'Engineering Mechanics — S. Timoshenko & D.H. Young',
      'Engineering Mechanics — R.S. Khurmi',
      'Engineering Mechanics — Irving H. Shames'
    ],
    practiceQuestionIds: ['em-tq-1', 'em-tq-2', 'em-tq-3', 'em-tq-4'],
    steps: [
      {
        stepNumber: 1,
        stepTitle: 'Equilibrium of Rigid Bodies & Trusses',
        subtitle: 'Reactions, two-force members and joint analysis',
        keyConcept:
          'A rigid body is in equilibrium when the resultant force and resultant moment both vanish: ΣF_x = 0, ΣF_y = 0 and ΣM = 0. A support provides as many reaction components as it restrains — a roller one, a hinge two, a fixed support three. In a truss, members carry axial force only, and a simple determinate truss satisfies m = 2j − 3, where m is the number of members and j the number of joints.',
        pointers: [
          'Draw the free body diagram first; isolate the body and replace every support by its reaction components.',
          'A uniformly distributed load may be replaced by its resultant at the centroid of the loaded length — mid-span for a full-span UDL.',
          'Take moments about the support whose reaction you do not need, so that reaction drops out of the equation.',
          'Method of joints: two equilibrium equations per joint — start at a joint with only two unknown members.',
          'Method of sections: cut at most three unknown members, then take moments about the point where two of them intersect.',
          "Lami's theorem applies to exactly three coplanar concurrent forces in equilibrium: P/sin α = Q/sin β = R/sin γ."
        ],
        formulaOrCode:
          'ΣF_x = 0 ; ΣF_y = 0 ; ΣM = 0\nDeterminate simple truss: m = 2j − 3\nLami: P / sin α = Q / sin β = R / sin γ',
        highYieldFacts: [
          'Support reactions: roller = 1 (normal), hinge/pin = 2 (horizontal and vertical), fixed = 3 (plus a moment).',
          'A two-force member carries equal, opposite and collinear forces; a three-force member in equilibrium has concurrent lines of action.',
          'A structure is statically determinate when the number of unknown reactions equals the number of available equilibrium equations (3 in a plane).',
          'In the method of sections, a member in compression pushes on the joint; the sign convention must be stated before solving.',
          'The resultant of a UDL of intensity w over length L is wL, acting at L/2 from either end.'
        ],
        examTrap:
          'Forgetting the moment of a distributed load about a support, or placing the UDL resultant at the wrong point on a partially loaded span. Also common: treating a roller as though it provided a horizontal reaction.',
        benchmarkExample: {
          question:
            'A simply supported beam of span 6 m carries a uniformly distributed load of 10 kN/m over its whole span and a point load of 20 kN at 2 m from the left support. What is the reaction at the left support?',
          options: ['43.33 kN', '36.67 kN', '40.00 kN', '46.67 kN'],
          correctAnswer: '43.33 kN',
          stepByStepSolution: [
            'Step 1 — Total load: UDL resultant = 10 kN/m × 6 m = 60 kN at mid-span (3 m), plus a 20 kN point load at 2 m.',
            'Step 2 — Take moments about the right support B: R_A × 6 = 60 × 3 + 20 × 4 = 180 + 80 = 260 kN·m.',
            'Step 3 — R_A = 260 / 6 = 43.33 kN (and R_B = 80 − 43.33 = 36.67 kN as a check, which balances the total load of 80 kN).'
          ],
          takeaway:
            'Moment about the support you do not want removes that unknown immediately — the fastest route to a reaction in any beam problem.'
        }
      },
      {
        stepNumber: 2,
        stepTitle: 'Centroid & Moment of Inertia of Composite Sections',
        subtitle: 'First moment of area and the parallel axis theorem',
        keyConcept:
          'The centroid is the point about which the first moment of area vanishes: ȳ = ΣA_i y_i / ΣA_i. The second moment of area about any axis parallel to the centroidal axis is obtained by the parallel axis theorem, I = I_c + A d², where d is the distance between the two axes. Splitting a compound section into rectangles and applying the theorem to each is the standard method for T, I and L sections.',
        pointers: [
          'Divide the section into simple rectangles; record each area and the distance of its own centroid from a common reference line.',
          'Compute ȳ from the base first, then work with distances measured from the centroidal axis.',
          'For each rectangle: I about its own centroidal axis (bd³/12 or db³/12) plus A d².',
          'Take the moment of inertia about the axis the question asks for — the weaker axis for buckling, the axis of bending for flexure.',
          'Radius of gyration k = √(I/A); check that a section with large I but small A still reports a sensible k.'
        ],
        formulaOrCode:
          'ȳ = ΣA_i y_i / ΣA_i\nRectangle: I_c = b d³ / 12\nParallel axis: I = I_c + A d²\nRadius of gyration: k = √(I / A)',
        highYieldFacts: [
          'For a rectangle of width b and depth d, I about the centroidal axis parallel to b is bd³/12, and about the other centroidal axis b³d/12.',
          'Parallel axis theorem adds A d² when moving away from the centroid; you can never subtract a positive quantity from I_c.',
          'The centroid of a T-section always lies in the web side of the flange-web junction, closer to the wider flange.',
          'Both I and the radius of gyration are smallest about the centroidal axis, which is why the least second moment governs buckling.',
          'I is additive for areas that do not overlap, but the centroid must be found first.'
        ],
        examTrap:
          'Using the gross depth d in bd³/12 for a rectangle that is not symmetric about the axis of interest, or forgetting that the parallel axis term uses the area of that individual rectangle only.',
        benchmarkExample: {
          question:
            'A T-section has a flange 100 mm wide and 20 mm thick and a web 20 mm thick and 180 mm deep. Determine the second moment of area about the centroidal axis parallel to the flange.',
          options: ['22.64 × 10⁶ mm⁴', '29.16 × 10⁶ mm⁴', '18.72 × 10⁶ mm⁴', '31.05 × 10⁶ mm⁴'],
          correctAnswer: '22.64 × 10⁶ mm⁴',
          stepByStepSolution: [
            'Step 1 — Areas and centroids from the bottom: flange A₁ = 100 × 20 = 2000 mm² at y₁ = 190 mm; web A₂ = 20 × 180 = 3600 mm² at y₂ = 90 mm.',
            'Step 2 — Centroid: ȳ = (2000 × 190 + 3600 × 90) / 5600 = 704000 / 5600 = 125.71 mm from the bottom.',
            'Step 3 — Flange: I₁ = 100 × 20³/12 + 2000 × (190 − 125.71)² = 66.7 × 10³ + 8.27 × 10⁶ = 8.33 × 10⁶ mm⁴.',
            'Step 4 — Web: I₂ = 20 × 180³/12 + 3600 × (125.71 − 90)² = 9.72 × 10⁶ + 4.59 × 10⁶ = 14.31 × 10⁶ mm⁴.',
            'Step 5 — Total I = 8.33 × 10⁶ + 14.31 × 10⁶ = 22.64 × 10⁶ mm⁴.'
          ],
          takeaway:
            'The parallel axis term, not bd³/12, dominates for a flange far from the centroid — that is why an I-section is so much stiffer than a rectangle of the same area.'
        }
      },
      {
        stepNumber: 3,
        stepTitle: 'Friction and Elementary Dynamics',
        subtitle: 'Limiting equilibrium, angle of repose, projectile range',
        keyConcept:
          'At impending motion the friction force reaches its limiting value F = μN, where μ = tan φ and φ is the angle of friction, equal to the angle of repose when a body just begins to slide down an incline. In dynamics, motion with uniform acceleration is described by v = u + at, v² = u² + 2as and s = ut + ½at²; a projectile launched at angle θ has range R = u² sin 2θ / g and maximum height u² sin²θ / 2g.',
        pointers: [
          'Draw the friction force opposing the direction of impending motion — it reverses if the applied force reverses.',
          'On an incline, resolve parallel and perpendicular to the plane; the normal reaction is mg cos θ, not mg.',
          'The angle of repose equals the angle of friction: tan φ = μ, so a body stays at rest when the slope angle is below φ.',
          'For a projectile, the horizontal component of velocity is constant (no air resistance); the vertical component reduces by g each second.',
          'Range is maximum at θ = 45°, and equal ranges occur for complementary angles θ and (90° − θ).',
          'Impulse-momentum: the change in momentum equals the impulse F × t.'
        ],
        formulaOrCode:
          'Limiting friction: F = μ N ; μ = tan φ\nAngle of repose: tan φ = μ\nUniform acceleration: v² = u² + 2 a s\nProjectile range: R = u² sin 2θ / g ; H_max = u² sin²θ / 2g\nImpulse: F t = m v − m u',
        highYieldFacts: [
          'The coefficient of friction is independent of the area of contact and, to first order, of the normal load.',
          'Static friction exceeds kinetic friction, which is why the limiting case governs design and is the one examined.',
          'A body on an incline begins to slide only when the slope exceeds the angle of repose φ where tan φ = μ.',
          'For a projectile, maximum range occurs at 45° and the range is the same for θ and 90° − θ.',
          'At the top of a projectile path the vertical velocity is zero but the horizontal velocity is unchanged.'
        ],
        examTrap:
          'Using N = mg on an inclined plane instead of N = mg cos θ. In projectiles, the most frequent slip is applying g to the horizontal component or taking the range formula with sin θ instead of sin 2θ.',
        benchmarkExample: {
          question:
            'A projectile is fired with a velocity of 20 m/s at an angle of 30° to the horizontal on level ground. Taking g = 9.81 m/s², determine the horizontal range.',
          options: ['35.3 m', '40.8 m', '17.6 m', '30.6 m'],
          correctAnswer: '35.3 m',
          stepByStepSolution: [
            'Step 1 — Range formula for level ground: R = u² sin 2θ / g.',
            'Step 2 — 2θ = 60°, so R = (20)² × sin 60° / 9.81 = 400 × 0.866 / 9.81.',
            'Step 3 — R = 346.4 / 9.81 = 35.3 m.'
          ],
          takeaway:
            'Range depends on sin 2θ, so the launch angle and its complement give identical ranges — a favourite examination comparison.'
        }
      }
    ],
    topicQuestions: [
      {
        id: 'em-tq-1',
        stem: 'A simply supported beam of span 4 m carries a central point load of 40 kN. What is the reaction at each support?',
        options: [
          { id: 'A', text: '20 kN' },
          { id: 'B', text: '40 kN' },
          { id: 'C', text: '10 kN' },
          { id: 'D', text: '80 kN' }
        ],
        correctOption: 'A',
        explanation:
          'A central load is shared equally by the supports because it has no eccentricity about either one: each reaction is 40/2 = 20 kN. The reaction would differ only for an off-centre load.',
        formulaContext: 'Symmetrical load: R_A = R_B = W / 2',
        difficulty: 'EASY',
        sourceType: 'MODELLED',
        topic: 'Statics & Equilibrium',
        subtopic: 'Support reactions'
      },
      {
        id: 'em-tq-2',
        stem: 'For a rectangular section of width 150 mm and depth 300 mm, what is the second moment of area about the centroidal axis parallel to the width?',
        options: [
          { id: 'A', text: '337.5 × 10⁶ mm⁴' },
          { id: 'B', text: '675.0 × 10⁶ mm⁴' },
          { id: 'C', text: '450.0 × 10⁶ mm⁴' },
          { id: 'D', text: '1 012.5 × 10⁶ mm⁴' }
        ],
        correctOption: 'A',
        explanation:
          'I = bd³/12 = 150 × 300³/12 = 150 × 27 × 10⁶/12 = 337.5 × 10⁶ mm⁴. Using the other axis (450 × 10⁶ mm⁴) is the common error — check which dimension is cubed.',
        formulaContext: 'I = b d³ / 12',
        difficulty: 'EASY',
        sourceType: 'MODELLED',
        topic: 'Centroid & Moment of Inertia',
        subtopic: 'Rectangle about centroidal axis'
      },
      {
        id: 'em-tq-3',
        stem: 'A block rests on a plane inclined at 30°. If the coefficient of friction is 0.5, what is the condition of the block?',
        options: [
          { id: 'A', text: 'It remains at rest, since tan 30° = 0.577 exceeds the friction limit — it slides' },
          { id: 'B', text: 'It slides down, because tan 30° < μ' },
          { id: 'C', text: 'It is in limiting equilibrium, because tan 30° = μ' },
          { id: 'D', text: 'It moves up the plane' }
        ],
        correctOption: 'A',
        explanation:
          'Sliding starts when the slope exceeds the angle of repose φ = tan⁻¹ μ = tan⁻¹ 0.5 = 26.6°. Since 30° > 26.6°, the block slides — the friction available (0.5 mg cos 30°) is less than the driving component (mg sin 30°).',
        formulaContext: 'Slides when tan θ > μ',
        difficulty: 'MEDIUM',
        sourceType: 'MODELLED',
        topic: 'Friction',
        subtopic: 'Angle of repose'
      },
      {
        id: 'em-tq-4',
        stem: 'A body starting from rest moves with uniform acceleration and attains 30 m/s in 10 s. What distance does it cover in this time?',
        options: [
          { id: 'A', text: '150 m' },
          { id: 'B', text: '300 m' },
          { id: 'C', text: '75 m' },
          { id: 'D', text: '200 m' }
        ],
        correctOption: 'A',
        explanation:
          'a = (30 − 0)/10 = 3 m/s². Then s = ut + ½at² = 0 + ½ × 3 × 100 = 150 m. Equivalently, for uniform acceleration from rest the average velocity is 15 m/s for 10 s.',
        formulaContext: 's = u t + ½ a t²',
        difficulty: 'EASY',
        sourceType: 'MODELLED',
        topic: 'Dynamics & Kinematics',
        subtopic: 'Uniform acceleration'
      }
    ]
  },
  {
    id: 'civil-concrete-tech',
    title: 'Concrete Technology — Mix Design, Properties & Testing',
    subject: 'Concrete Technology',
    category: 'civil',
    readTime: '13 min read',
    weightage: 'HIGH_YIELD',
    icon: 'Boxes',
    summary:
      'Mix design by IS 10262, the relationship between characteristic strength and target mean strength, workability and modulus of elasticity of concrete, durability provisions, and quality control by destructive and non-destructive testing.',
    fullDescription:
      'Concrete Technology is examined both as a subject in its own right and as background for RCC design, and the questions are usually numerical — target mean strength, water-cement ratio, modulus of elasticity, or the interpretation of a test result. Design code numbers are treated as code-anchored; the worked examples show the arithmetic route.',
    subtopicList: [
      'Characteristic strength and target mean strength',
      'IS 10262 mix design procedure',
      'Workability tests and their selection',
      'Modulus of elasticity of concrete',
      'Durability, exposure and cover',
      'Destructive and non-destructive testing'
    ],
    syllabusCoverage: [
      'Properties of concrete — fresh and hardened',
      'Concrete mix design and grade selection',
      'Quality control and acceptance criteria',
      'Durability requirements and special concretes'
    ],
    prerequisites: ['Building Materials & Construction', 'Cement chemistry basics'],
    standardReferences: [
      'IS 10262:2019 — Concrete Mix Proportioning',
      'IS 456:2000 — Plain and Reinforced Concrete',
      'IS 516 — Methods of Tests for Strength of Concrete',
      'Concrete Technology — M.S. Shetty'
    ],
    practiceQuestionIds: ['ct-tq-1', 'ct-tq-2', 'ct-tq-3', 'ct-tq-4'],
    steps: [
      {
        stepNumber: 1,
        stepTitle: 'Characteristic Strength & Mix Design',
        subtitle: 'From f_ck to target mean strength and proportions',
        keyConcept:
          'The characteristic strength f_ck is the value below which not more than 5 % of test results are expected to fall, which is why the mix is designed for a higher target mean strength f′_ck = f_ck + 1.65 s, where s is the assumed standard deviation. IS 10262 then fixes the water-cement ratio from the durability and strength requirements, selects the water content for the required workability and nominal maximum aggregate size, and derives the cement and aggregate contents from the absolute volume concept.',
        pointers: [
          'Assumed standard deviation s is tabulated in IS 10262: M25 uses s = 5.0 N/mm², M20 uses 4.0 N/mm², M10 and M15 use 3.5 N/mm².',
          'The 1.65 factor is the normal deviate corresponding to a 5 % failure probability.',
          'Design water-cement ratio is the lower of the strength requirement and the maximum permitted by the exposure condition.',
          'Then check minimum cement content for the exposure class — mix design is a two-sided check, not a single calculation.',
          'Absolute volume method: volume of concrete = volume of cement + water + fine aggregate + coarse aggregate + entrapped air.',
          'Nominal maximum aggregate size influences the water content: larger aggregate needs less water for the same workability.'
        ],
        formulaOrCode:
          "Target mean strength: f'_ck = f_ck + 1.65 s\nWater-cement ratio from strength: check against IS 456 Table 5\nAbsolute volume: V_c + V_w + V_fa + V_ca + V_air = 1 m³",
        highYieldFacts: [
          'Assumed standard deviation (IS 10262): M10–M15 = 3.5, M20 = 4.0, M25 = 5.0 N/mm².',
          'M20 to M25 grades are the common structural grades; M15 is used for levelling courses and light work.',
          'For a severe exposure RCC member, IS 456 Table 5 requires a maximum free water-cement ratio of 0.45 and a minimum cement content of 320 kg/m³ (minimum grade M30).',
          'Durability requirements, not strength, govern the water-cement ratio in severe and very severe exposures.',
          'The 28-day cube strength is the standard measure of grade; characteristic strength is defined on 150 mm cubes tested wet.'
        ],
        examTrap:
          'Using f_ck directly as the design strength instead of the target mean strength, or applying the 1.65 factor with the wrong standard deviation. A second common slip is picking the strength-based water-cement ratio when the exposure limit is lower.',
        benchmarkExample: {
          question:
            'Concrete of grade M25 is to be designed. Taking the assumed standard deviation from IS 10262, what is the target mean strength?',
          options: ['33.25 N/mm²', '32.75 N/mm²', '30.00 N/mm²', '29.50 N/mm²'],
          correctAnswer: '33.25 N/mm²',
          stepByStepSolution: [
            'Step 1 — Grade M25, so f_ck = 25 N/mm².',
            'Step 2 — Assumed standard deviation for M25 from IS 10262 is s = 5.0 N/mm².',
            "Step 3 — f'_ck = f_ck + 1.65 s = 25 + 1.65 × 5 = 25 + 8.25 = 33.25 N/mm²."
          ],
          takeaway:
            'The mix is always proportioned for the target mean strength; the extra 1.65 s is the statistical margin that makes the characteristic value reliable.'
        }
      },
      {
        stepNumber: 2,
        stepTitle: 'Fresh & Hardened Concrete Properties',
        subtitle: 'Workability, modulus of elasticity, creep and shrinkage',
        keyConcept:
          'Workability is measured by slump (most common, suitable for medium workability), the compaction factor test (suitable for low workability and laboratory control) and the Vee-Bee consistometer (best for very dry mixes where slump reads zero). For hardened concrete, IS 456 gives the short-term modulus of elasticity as E_c = 5000 √f_ck, with creep and shrinkage acting as time-dependent strains that increase deflection beyond the short-term value.',
        pointers: [
          'Slump test — most convenient but least sensitive for very dry or very wet mixes; it is not a true measure of workability.',
          'Compaction factor test — more accurate for low workability mixes; Vee-Bee time in seconds for dry mixes.',
          'Modulus of elasticity from IS 456 is a secant value at working stress level, E_c = 5000 √f_ck.',
          'Creep increases with sustained stress and water-cement ratio, and decreases with maturity, humidity and cement content moderation.',
          'Drying shrinkage strain is of the order of 3 × 10⁻⁴ and is independent of stress.',
          'The flexural strength of concrete is roughly 0.7 √f_ck, considerably lower than the compressive strength.'
        ],
        formulaOrCode:
          'Modulus of elasticity: E_c = 5000 √f_ck  (N/mm²)\nFlexural strength: f_cr = 0.7 √f_ck\nCompaction factor = mass of partially compacted concrete / mass of fully compacted concrete',
        highYieldFacts: [
          'E_c = 5000 √f_ck gives 25 000 N/mm² for M25 and about 27 386 N/mm² for M30.',
          'Slump test is unsuitable for very dry mixes — the compaction factor or Vee-Bee test is used instead.',
          'Creep is the time-dependent strain under sustained load; it is roughly proportional to the applied stress up to service level.',
          'Shrinkage is independent of stress and is highest in the first few months of curing.',
          'Modulus of elasticity of concrete increases with age, while creep per unit stress decreases for later loading.'
        ],
        examTrap:
          'Reporting E_c for the wrong grade — the formula uses the characteristic cube strength f_ck, not the target mean strength. Also: quoting the compaction factor as a strength measure, when it only measures workability.',
        benchmarkExample: {
          question: 'What is the short-term modulus of elasticity of M30 concrete as per IS 456?',
          options: ['27 386 N/mm²', '25 000 N/mm²', '30 000 N/mm²', '26 700 N/mm²'],
          correctAnswer: '27 386 N/mm²',
          stepByStepSolution: [
            'Step 1 — For M30, f_ck = 30 N/mm².',
            'Step 2 — E_c = 5000 √f_ck = 5000 × √30.',
            'Step 3 — √30 = 5.477, so E_c = 5000 × 5.477 = 27 386 N/mm².'
          ],
          takeaway:
            'The modulus of elasticity grows only as the square root of strength, so doubling the grade raises stiffness by about 41 % — this is why deflection control is a stiffness problem, not a strength problem.'
        }
      },
      {
        stepNumber: 3,
        stepTitle: 'Testing, Quality Control & Special Concretes',
        subtitle: 'Sampling, acceptance and non-destructive evaluation',
        keyConcept:
          'Compressive strength is measured on 150 mm cubes cured and tested as specified; the result is an indicator, not an exact material constant, so acceptance is judged on a series of results rather than a single cube. When results are suspect, non-destructive tests — rebound hammer for surface hardness, ultrasonic pulse velocity for internal uniformity and voids, and core testing for direct strength — are used, in that order of increasing reliability.',
        pointers: [
          'Cube testing is the reference method; a minimum number of samples per volume of concrete is prescribed so that a genuine trend exists.',
          'Rebound hammer measures surface hardness only — it is affected by surface moisture and carbonation.',
          'Ultrasonic pulse velocity detects internal voids, cracks and honeycombing through pulse transit time across the member.',
          'Core testing is the most reliable in-situ assessment but is destructive and must be repaired afterwards.',
          'For durability: low permeability (low water-cement ratio, adequate compaction and curing) is the governing requirement.',
          'Special concretes — self-compacting, fibre-reinforced and high-performance — trade workability or toughness for changes in mix design, not in test method.'
        ],
        formulaOrCode:
          'Cube strength = failure load / face area\nAcceptance judged on groups of consecutive results, not single cubes\nUPV = path length / transit time\nExposure limits (IS 456 Table 5): severe → max w/c 0.45, min cement 320 kg/m³',
        highYieldFacts: [
          'Order of reliability for in-situ strength assessment: core test > ultrasonic pulse velocity > rebound hammer.',
          'Rebound hammer and UPV are qualitative indicators; neither replaces a core test for strength.',
          'Higher strength grade does not by itself guarantee durability — permeability and cover control it.',
          'Water-cement ratio is the single most influential factor for both strength and permeability.',
          'Self-compacting concrete is characterised by filling ability, passing ability and segregation resistance rather than slump.'
        ],
        examTrap:
          'Treating a rebound hammer reading as a strength value, or using the pulse velocity as a strength instead of a uniformity indicator. In durability questions, strength grade is often offered as the answer when the code requirement is a water-cement ratio and cement content.',
        benchmarkExample: {
          question:
            'As per IS 456, what are the maximum free water-cement ratio and minimum cement content for reinforced concrete in a severe exposure condition?',
          options: [
            '0.45 and 320 kg/m³',
            '0.50 and 300 kg/m³',
            '0.45 and 340 kg/m³',
            '0.40 and 360 kg/m³'
          ],
          correctAnswer: '0.45 and 320 kg/m³',
          stepByStepSolution: [
            'Step 1 — Identify the exposure class: severe (reinforced concrete).',
            'Step 2 — Locate the row in IS 456 Table 5 for severe exposure: maximum free water-cement ratio = 0.45.',
            'Step 3 — Same row gives minimum cement content = 320 kg/m³ and minimum grade M30.',
            'Step 4 — Read 0.50/300 as the moderate-exposure row and 0.40/360 as extreme — the option pairs are the other rows of the same table.'
          ],
          takeaway:
            'Table 5 pairs travel together: reading the water-cement ratio from one row and the cement content from another is the standard trap.'
        }
      }
    ],
    topicQuestions: [
      {
        id: 'ct-tq-1',
        stem: 'What is the target mean strength of M20 concrete if the assumed standard deviation is 4.0 N/mm²?',
        options: [
          { id: 'A', text: '26.6 N/mm²' },
          { id: 'B', text: '24.0 N/mm²' },
          { id: 'C', text: '28.0 N/mm²' },
          { id: 'D', text: '20.0 N/mm²' }
        ],
        correctOption: 'A',
        explanation: "f'_ck = f_ck + 1.65 s = 20 + 1.65 × 4.0 = 20 + 6.6 = 26.6 N/mm². Using s without the 1.65 deviate gives 24, which is the classic wrong option.",
        formulaContext: "f'_ck = f_ck + 1.65 s",
        difficulty: 'EASY',
        sourceType: 'MODELLED',
        topic: 'Concrete Ingredients & Mix Design',
        subtopic: 'Target mean strength'
      },
      {
        id: 'ct-tq-2',
        stem: 'Which test is most suitable for measuring the workability of a very dry concrete mix?',
        options: [
          { id: 'A', text: 'Vee-Bee consistometer test' },
          { id: 'B', text: 'Slump test' },
          { id: 'C', text: 'Compaction factor test' },
          { id: 'D', text: 'Flow table test' }
        ],
        correctOption: 'A',
        explanation:
          'For very dry mixes the slump is zero and the slump test cannot discriminate; the Vee-Bee consistometer measures the time for the mix to remould and is the standard choice for dry mixes. The compaction factor test suits low workability mixes in the laboratory.',
        formulaContext: 'Slump fails for very dry mixes — use Vee-Bee time',
        difficulty: 'MEDIUM',
        sourceType: 'MODELLED',
        topic: 'Fresh & Hardened Concrete Properties',
        subtopic: 'Workability tests'
      },
      {
        id: 'ct-tq-3',
        stem: 'The modulus of elasticity of M25 concrete as per IS 456 is closest to which value?',
        options: [
          { id: 'A', text: '25 000 N/mm²' },
          { id: 'B', text: '5 000 N/mm²' },
          { id: 'C', text: '50 000 N/mm²' },
          { id: 'D', text: '27 386 N/mm²' }
        ],
        correctOption: 'A',
        explanation:
          'E_c = 5000 √f_ck = 5000 × √25 = 5000 × 5 = 25 000 N/mm². Note that 27 386 N/mm² is the value for M30, not M25.',
        formulaContext: 'E_c = 5000 √f_ck',
        difficulty: 'EASY',
        sourceType: 'MODELLED',
        topic: 'Fresh & Hardened Concrete Properties',
        subtopic: 'Modulus of elasticity'
      },
      {
        id: 'ct-tq-4',
        stem: 'Which test provides the most reliable assessment of the in-situ compressive strength of hardened concrete?',
        options: [
          { id: 'A', text: 'Core extraction and testing' },
          { id: 'B', text: 'Rebound hammer test' },
          { id: 'C', text: 'Ultrasonic pulse velocity test' },
          { id: 'D', text: 'Slump test' }
        ],
        correctOption: 'A',
        explanation:
          'A core provides a direct measure of strength, whereas the rebound hammer measures only surface hardness and pulse velocity indicates uniformity and internal defects. Slump measures fresh concrete workability, not hardened strength.',
        formulaContext: 'Reliability order: core > UPV > rebound hammer',
        difficulty: 'EASY',
        sourceType: 'MODELLED',
        topic: 'Testing, Quality Control & Special Concretes',
        subtopic: 'Non-destructive testing'
      }
    ]
  }
];
