import type { KnowledgeModule } from '../types';

/**
 * Theory modules for the two infrastructure-side subjects the app had no
 * coverage for.
 *
 * Earthquake Engineering and Railway/Airport/Bridge/Tunnel Engineering are both
 * weighted in the syllabus blueprint and both previously returned nothing at all
 * — no module, no question, no practice. They are also the two subjects where a
 * candidate most often meets *code-number* questions, so the high-yield facts
 * here stick to provisions that are stable across editions.
 *
 * Arithmetic in the worked examples was recomputed independently before being
 * written; `scripts/validate-knowledge-modules.mjs` re-checks the structure.
 */
export const INFRASTRUCTURE_CIVIL_MODULES: KnowledgeModule[] = [
  {
    id: 'civil-earthquake',
    title: 'Earthquake Engineering — Seismic Design & Ductile Detailing',
    subject: 'Earthquake Engineering',
    category: 'civil',
    readTime: '14 min read',
    weightage: 'HIGH_YIELD',
    icon: 'Activity',
    summary:
      'Seismology and structural dynamics essentials, the IS 1893 seismic coefficient method for design base shear, and the ductile detailing and retrofitting rules that let a structure survive the design earthquake.',
    fullDescription:
      'Earthquake Engineering questions are usually one of three kinds: a seismology definition, a base shear calculation, or a ductile detailing rule from IS 13920. The design philosophy that ties them together — no collapse under a strong earthquake, serviceability under a moderate one, and ductility as the mechanism that delivers both — is what the marks are really testing.',
    subtopicList: [
      'Seismic terminology: focus, epicentre, magnitude, intensity',
      'Natural period and damping of structures',
      'Seismic zone factors and importance factors',
      'Design base shear by the seismic coefficient method',
      'Ductile detailing of beams and columns (IS 13920)',
      'Seismic retrofitting techniques'
    ],
    syllabusCoverage: [
      'Earthquake magnitude, intensity and seismic zoning of India',
      'Structural dynamics — free and forced vibration, natural period, damping',
      'Seismic analysis and design per IS 1893',
      'Ductile detailing per IS 13920 and retrofitting of existing structures'
    ],
    prerequisites: ['Engineering Mechanics', 'Structural Analysis', 'RCC Design'],
    standardReferences: [
      'IS 1893 (Part 1) — Criteria for Earthquake Resistant Design of Structures',
      'IS 13920 — Ductile Design and Detailing of Reinforced Concrete Structures',
      'Earthquake Resistant Design of Structures — Pankaj Agarwal & Manish Shrikhande'
    ],
    practiceQuestionIds: ['eq-tq-1', 'eq-tq-2', 'eq-tq-3', 'eq-tq-4'],
    steps: [
      {
        stepNumber: 1,
        stepTitle: 'Seismology & Structural Dynamics Essentials',
        subtitle: 'Magnitude, intensity, natural period and damping',
        keyConcept:
          'Magnitude is a measure of the energy released at the focus and is a single number for an event; intensity describes the effect at a location and decreases with distance. Every structure has a natural period of vibration T = 2π √(m/k), and IS 1893 permits the approximate estimate T = 0.075 h^0.75 for a reinforced concrete frame without infill, where h is the height in metres. Resonance — the condition to be avoided — occurs when the predominant period of the ground motion approaches the natural period of the structure.',
        pointers: [
          'Magnitude is instrument-based and unique per event; intensity is location-dependent and reported in MSK or MMI scale.',
          'The Richter scale is logarithmic: each unit increase represents roughly a thirty-fold rise in released energy.',
          'Stiffness raises the natural frequency and shortens the period; adding mass lengthens it.',
          'IS 1893 approximate period for RC frames: T = 0.075 h^0.75 with h in metres.',
          'Damping in concrete structures is typically taken as 5 % of critical; steel frames around 2–3 %.',
          'Long-period structures attract lower spectral acceleration on soft soils, which is why soil type enters the design coefficient.'
        ],
        formulaOrCode:
          'Natural period: T = 2π √(m/k)\nIS 1893 empirical (RC frame): T = 0.075 h^0.75\nCritical damping ratio: concrete 5 %, steel 2–3 %\nFrequency: f = 1 / T',
        highYieldFacts: [
          'Magnitude is energy-based and unique; intensity varies from place to place for the same earthquake.',
          'IS 1893 divides India into seismic zones II, III, IV and V with zone factors 0.10, 0.16, 0.24 and 0.36.',
          'Approximate natural period of an RC frame without infill: T = 0.075 h^0.75 for h in metres.',
          'Resonance occurs when the structure\'s natural period matches the predominant period of ground shaking.',
          'Damping has little effect on the natural period but strongly reduces amplitude near resonance.'
        ],
        examTrap:
          'Confusing magnitude with intensity — an earthquake has one magnitude but many intensity values. In period calculations the most common slip is using the height in centimetres, or forgetting the 0.75 exponent and treating the relation as linear.',
        benchmarkExample: {
          question: 'What is the approximate natural period of a reinforced concrete frame building 16 m tall, as per IS 1893?',
          options: ['0.60 s', '0.45 s', '0.75 s', '0.90 s'],
          correctAnswer: '0.60 s',
          stepByStepSolution: [
            'Step 1 — Use the IS 1893 empirical relation for an RC frame without infill: T = 0.075 h^0.75.',
            'Step 2 — With h = 16 m, h^0.75 = 16^(3/4) = 8.',
            'Step 3 — T = 0.075 × 8 = 0.60 s.'
          ],
          takeaway:
            'The empirical formula needs the height in metres only — no mass or stiffness data — which is why it is the standard quick estimate in design office checks.'
        }
      },
      {
        stepNumber: 2,
        stepTitle: 'Seismic Design Base Shear (IS 1893)',
        subtitle: 'Zone factor, importance factor, response reduction and Sa/g',
        keyConcept:
          'The design horizontal seismic coefficient A_h combines the zone factor Z, the importance factor I, the response reduction factor R and the average spectral acceleration coefficient S_a/g: A_h = (Z/2) × (I/R) × (S_a/g). The design base shear is then V_B = A_h W, where W is the seismic weight of the building — generally the dead load plus a fraction of the imposed load. The factor of two in Z/2 converts the zone factor, which corresponds to a 50-year return period, to the design level.',
        pointers: [
          'Zone factor Z: 0.10 for zone II, 0.16 for III, 0.24 for IV and 0.36 for zone V.',
          'Importance factor I: 1.0 for ordinary buildings and 1.5 for important structures such as hospitals and schools.',
          'Response reduction factor R: 3.0 for ordinary RC moment-resisting frames and 5.0 for special moment-resisting frames — higher R means more ductility and therefore lower design force.',
          'S_a/g depends on the natural period, soil type and damping; it is read from the IS 1893 spectra.',
          'Seismic weight W includes dead load, a specified fraction of live load and the mass of permanent equipment.',
          'Base shear is distributed along the height, with a larger share to upper storeys through the vertical distribution factor.'
        ],
        formulaOrCode:
          'A_h = (Z / 2) × (I / R) × (S_a / g)\nV_B = A_h × W\nZ: II 0.10, III 0.16, IV 0.24, V 0.36\nR: OMRF 3.0, SMRF 5.0',
        highYieldFacts: [
          'Zone factors in IS 1893 are 0.10, 0.16, 0.24 and 0.36 for zones II, III, IV and V respectively.',
          'Higher response reduction factor R reduces the design seismic force — ductility is bought with detailing, not with strength.',
          'Design base shear is a storey shear at the base and a force demand on the foundation.',
          'Soft storeys and plan irregularities raise the force locally; IS 1893 requires a factor for the irregularity.',
          'The ductile detailing of IS 13920 is what justifies using R = 5.0 rather than 3.0.'
        ],
        examTrap:
          'Forgetting to halve Z, or using Z instead of Z/2 in the coefficient. Another frequent error is treating R as a multiplier that increases the design force — it always reduces it, because it credits the structure for ductility.',
        benchmarkExample: {
          question:
            'A four-storey reinforced concrete special moment-resisting frame in seismic zone V has a seismic weight of 1000 kN. Taking I = 1.0 and S_a/g = 2.5, determine the design base shear.',
          options: ['90 kN', '180 kN', '45 kN', '60 kN'],
          correctAnswer: '90 kN',
          stepByStepSolution: [
            'Step 1 — Zone V gives Z = 0.36; a special moment-resisting frame gives R = 5.0; the building is ordinary, so I = 1.0.',
            'Step 2 — A_h = (Z/2) × (I/R) × (S_a/g) = (0.36/2) × (1.0/5.0) × 2.5 = 0.18 × 0.2 × 2.5 = 0.09.',
            'Step 3 — V_B = A_h × W = 0.09 × 1000 = 90 kN.',
            'Step 4 — Using Z = 0.36 without halving gives 180 kN, which is the standard wrong option.'
          ],
          takeaway:
            'Read the coefficient as four independent factors. The halving of Z is the single most forgotten step in this calculation.'
        }
      },
      {
        stepNumber: 3,
        stepTitle: 'Ductile Detailing & Seismic Retrofitting',
        subtitle: 'Confinement, strong column–weak beam, and strengthening methods',
        keyConcept:
          'Ductility is produced by confinement: closely spaced closed hoops, adequate lap length away from the joint, and detailing that keeps the plastic hinges in the beams rather than the columns. IS 13920 therefore requires a minimum column dimension, limits the spacing of confining links in the special confinement zone near a joint, and requires that beams be weaker in flexure than the columns framing into them — the strong column–weak beam hierarchy. Where an existing structure does not satisfy these rules, retrofitting adds strength or displacement capacity by jacketing, external bracing, base isolation or added shear walls.',
        pointers: [
          'Confining links in the special confinement zone: spacing not greater than the least of one quarter of the smallest column dimension, six times the smallest longitudinal bar diameter, and 100 mm.',
          'Laps in column bars are located in the middle half of the storey and are generally avoided in the joint region.',
          'Strong column–weak beam: the flexural capacity of columns framing into a joint should exceed that of the beams, so hinges form in beams.',
          'Minimum column dimension as specified by IS 13920, with a larger value for taller buildings, ensures a stiff, stable member.',
          'Concrete jacketing, steel caging and fibre wrapping increase shear capacity and confinement; base isolation reduces the demand transferred to the superstructure.',
          'Retrofitting is assessed against the same performance objectives as new construction.'
        ],
        formulaOrCode:
          'Confining link spacing (confinement zone) ≤ min( b/4 , 6 d_b , 100 mm )\nwhere b = smallest column dimension, d_b = smallest longitudinal bar diameter',
        highYieldFacts: [
          'Ductile detailing is what allows the response reduction factor R = 5.0 to be used instead of 3.0.',
          'Plastic hinges are designed to form in beams, not columns — hence the strong column–weak beam requirement.',
          'Confinement spacing is governed by the least of b/4, 6d_b and 100 mm in the special confinement zone.',
          'Laps must not be located in the joint or in the plastic hinge region of a member.',
          'Base isolation lengthens the period of the structure and thereby reduces the spectral acceleration it attracts.'
        ],
        examTrap:
          'Computing the link spacing from the largest column dimension or from the larger longitudinal bar, instead of the smallest of each — the governing value is always the smallest. Also frequent: assuming R = 5 can be claimed without actually detailing to IS 13920.',
        benchmarkExample: {
          question:
            'A column 450 mm × 450 mm is detailed to IS 13920 with a smallest longitudinal bar of 20 mm diameter. What is the minimum permissible spacing of confining links in the special confinement zone?',
          options: ['100 mm', '112.5 mm', '120 mm', '150 mm'],
          correctAnswer: '100 mm',
          stepByStepSolution: [
            'Step 1 — The spacing must satisfy the least of three limits: b/4, 6d_b and 100 mm.',
            'Step 2 — b/4 = 450/4 = 112.5 mm.',
            'Step 3 — 6 d_b = 6 × 20 = 120 mm.',
            'Step 4 — The governing spacing is the least of 112.5 mm, 120 mm and 100 mm, i.e. 100 mm.'
          ],
          takeaway:
            'Two of the three limits here are non-governing — examiners offer 112.5 mm and 120 mm precisely because candidates stop at the first limit they compute.'
        }
      }
    ],
    topicQuestions: [
      {
        id: 'eq-tq-1',
        stem: 'Which of the following correctly distinguishes earthquake magnitude from intensity?',
        options: [
          { id: 'A', text: 'Magnitude is a single value per event; intensity varies with location' },
          { id: 'B', text: 'Magnitude varies with location; intensity is single per event' },
          { id: 'C', text: 'Both are independent of distance from the epicentre' },
          { id: 'D', text: 'Both are measured on the MSK scale' }
        ],
        correctOption: 'A',
        explanation:
          'Magnitude measures the energy released at the focus and is unique for one earthquake. Intensity describes the observed effect at a place and therefore decreases with distance from the epicentre.',
        formulaContext: 'Magnitude = energy (unique) ; Intensity = effect (location-wise)',
        difficulty: 'EASY',
        sourceType: 'MODELLED',
        topic: 'Seismology & Structural Dynamics',
        subtopic: 'Magnitude vs intensity'
      },
      {
        id: 'eq-tq-2',
        stem: 'As per IS 1893, what is the zone factor for seismic zone V?',
        options: [
          { id: 'A', text: '0.36' },
          { id: 'B', text: '0.24' },
          { id: 'C', text: '0.16' },
          { id: 'D', text: '0.10' }
        ],
        correctOption: 'A',
        explanation:
          'The zone factors are 0.10 (zone II), 0.16 (III), 0.24 (IV) and 0.36 (zone V). In the seismic coefficient they enter as Z/2.',
        formulaContext: 'Z: II 0.10, III 0.16, IV 0.24, V 0.36',
        difficulty: 'EASY',
        sourceType: 'MODELLED',
        topic: 'Seismic Design Principles & Codes',
        subtopic: 'Zone factor'
      },
      {
        id: 'eq-tq-3',
        stem: 'A building in zone IV, ordinary importance (I = 1.0), is a special moment-resisting frame (R = 5.0) with S_a/g = 2.5 and seismic weight 800 kN. What is the design base shear?',
        options: [
          { id: 'A', text: '48 kN' },
          { id: 'B', text: '96 kN' },
          { id: 'C', text: '192 kN' },
          { id: 'D', text: '24 kN' }
        ],
        correctOption: 'A',
        explanation:
          'A_h = (0.24/2) × (1.0/5.0) × 2.5 = 0.12 × 0.2 × 2.5 = 0.06, so V_B = 0.06 × 800 = 48 kN. Dropping the Z/2 halving gives 96 kN, the standard wrong option.',
        formulaContext: 'V_B = (Z/2)(I/R)(S_a/g) W',
        difficulty: 'MEDIUM',
        sourceType: 'MODELLED',
        topic: 'Seismic Design Principles & Codes',
        subtopic: 'Base shear calculation'
      },
      {
        id: 'eq-tq-4',
        stem: 'In ductile detailing of a reinforced concrete frame, plastic hinges are deliberately designed to form:',
        options: [
          { id: 'A', text: 'In the beams near the joints' },
          { id: 'B', text: 'In the columns above the joints' },
          { id: 'C', text: 'In the beam-column joint core' },
          { id: 'D', text: 'In the foundation' }
        ],
        correctOption: 'A',
        explanation:
          'The strong column–weak beam hierarchy forces hinges into the beams, which are more tolerant of large rotations and easier to inspect. A hinge in a column risks a soft-storey collapse mechanism.',
        formulaContext: 'Strong column–weak beam: hinges in beams',
        difficulty: 'MEDIUM',
        sourceType: 'MODELLED',
        topic: 'Ductile Detailing & Retrofitting',
        subtopic: 'Plastic hinge location'
      }
    ]
  },
  {
    id: 'civil-railway-airport',
    title: 'Railway, Airport, Bridge & Tunnel Engineering',
    subject: 'Railway, Airport, Bridge & Tunnel Engineering',
    category: 'civil',
    readTime: '13 min read',
    weightage: 'MEDIUM',
    icon: 'Train',
    summary:
      'Railway track geometry including cant and cant deficiency, airport runway length correction for elevation and temperature, and the hydraulics of bridge waterways and tunnels.',
    fullDescription:
      'This subject is examined through standard formulae rather than long derivations: equilibrium cant, runway length correction, Lacey scour depth and maximum flood discharge for waterway design. The arithmetic is short, so the marks depend on knowing which correction applies and in which order.',
    subtopicList: [
      'Permanent way, gauges and rail components',
      'Cant, cant deficiency and negative superelevation',
      'Creep and sleeper density',
      'Orientation and geometric design of runways',
      'Runway length correction for elevation and temperature',
      'Bridge waterway, afflux and scour depth',
      'Tunnel shapes, ventilation and construction methods'
    ],
    syllabusCoverage: [
      'Railway engineering — track components, geometric design, points and crossings',
      'Airport engineering — planning, runway orientation and geometric design',
      'Bridge engineering — waterway, scour, afflux and pier design',
      'Tunnel engineering — alignment, ventilation and methods of tunnelling'
    ],
    prerequisites: ['Surveying & Geomatics', 'Fluid Mechanics & Hydraulics'],
    standardReferences: [
      'Railway Engineering — Saxena & Arora',
      'Airport Planning and Design — Khanna, Arora & Jain',
      'Bridge Engineering — S. Ponnuswamy',
      'Irrigation and Water Power Engineering — B.C. Punmia'
    ],
    practiceQuestionIds: ['raf-tq-1', 'raf-tq-2', 'raf-tq-3', 'raf-tq-4'],
    steps: [
      {
        stepNumber: 1,
        stepTitle: 'Railway Track Geometry — Cant & Curves',
        subtitle: 'Equilibrium cant, cant deficiency and speed on curves',
        keyConcept:
          'On a curve, the outer rail is raised above the inner rail by the cant e so that the resultant of weight and centrifugal force is perpendicular to the sleeper. The equilibrium cant in millimetres is e = G V² / (127 R), with gauge G in mm, speed V in km/h and radius R in metres. If the actual cant differs from the equilibrium value, the difference is cant deficiency (for speeds above the equilibrium value) or cant excess (below it), and the maximum permissible values cap the speed on the curve.',
        pointers: [
          'Equilibrium cant uses the design speed, not the maximum permissible speed — the two can differ on the same curve.',
          'Maximum cant is limited to 165 mm for broad gauge (BG) and 140 mm for metre gauge (MG) to avoid load transfer problems at low speeds.',
          'Cant deficiency is limited to about 75 mm and cant excess to about 65 mm on BG.',
          'Negative superelevation arises where a curve continues through a turnout and the cant direction conflicts with the turnout direction.',
          'Speed on a curve is often governed by cant deficiency rather than by the equilibrium cant itself.',
          'Creep is longitudinal movement of rails due to braking, traction and heavy gradients.'
        ],
        formulaOrCode:
          'Equilibrium cant: e = G V² / (127 R)\nG in mm (BG 1750, MG 1000), V in km/h, R in m\nMaximum cant: BG 165 mm, MG 140 mm\nCant deficiency limit on BG: about 75 mm',
        highYieldFacts: [
          'Broad gauge has a track gauge of 1676 mm; the centre-to-centre distance used in the cant formula is 1750 mm because the rail head centres are outside the gauge lines.',
          'Maximum cant: 165 mm for BG and 140 mm for MG.',
          'Cant deficiency is the difference between the equilibrium cant and the actual cant, and it limits the permissible speed on a curve.',
          'A turnout taken on a curve requires negative superelevation.',
          'Larger radius reduces the required cant for the same speed, since cant varies inversely with radius.'
        ],
        examTrap:
          'Substituting the maximum cant (165 mm) as the answer when the question asks for the equilibrium cant, or using the gauge as 1676 mm instead of the rail-centre distance 1750 mm.',
        benchmarkExample: {
          question:
            'A broad gauge track has a curve of radius 800 m and the design speed is 100 km/h. Taking G = 1750 mm, determine the equilibrium cant, correct to one decimal place.',
          options: ['172.2 mm', '165.0 mm', '185.0 mm', '150.0 mm'],
          correctAnswer: '172.2 mm',
          stepByStepSolution: [
            'Step 1 — Equilibrium cant formula: e = G V² / (127 R).',
            'Step 2 — Substitute: e = 1750 × (100)² / (127 × 800) = 1 750 × 10 000 / 101 600.',
            'Step 3 — e = 17 500 000 / 101 600 = 172.2 mm.',
            'Step 4 — Note this exceeds the maximum cant of 165 mm, so the curve cannot be laid with the full equilibrium cant; the residual 7.2 mm becomes cant deficiency.'
          ],
          takeaway:
            'The equilibrium value and the maximum allowed value are different quantities — an answer above 165 mm on BG must be capped, and that cap is itself a favourite question.'
        }
      },
      {
        stepNumber: 2,
        stepTitle: 'Airport Runway Length Correction',
        subtitle: 'Elevation and temperature corrections, in order',
        keyConcept:
          'The basic runway length is first corrected for elevation at 7 % per 300 m above mean sea level, because thin air reduces lift, thrust and braking performance. The temperature correction is then applied to the already elevation-corrected length at 1 % for each degree by which the airport reference temperature exceeds the standard temperature at that elevation, where the standard temperature is 15 °C minus 0.0065 °C per metre of elevation.',
        pointers: [
          'Apply corrections in the prescribed order: elevation first, then temperature, then check the total against the limitation on total correction.',
          'Standard temperature at elevation h: t_std = 15 − 0.0065 h, with h in metres and t in °C.',
          'Airport reference temperature is the monthly mean of the maximum daily temperatures of the hottest month, averaged with the mean of the same month to date.',
          'Elevation correction is 7 % per 300 m of elevation — that is 2.33 % per 100 m.',
          'Temperature correction is 1 % per degree by which the reference temperature exceeds the standard temperature.',
          'Beyond a specified total correction, the runway length increase must come from other means rather than further correction alone.'
        ],
        formulaOrCode:
          'Elevation correction: +7 % per 300 m above MSL\nStandard temperature: t_std = 15 − 0.0065 h  (°C, h in m)\nTemperature correction: +1 % per °C of (ART − t_std)\nOrder: basic length → elevation → temperature',
        highYieldFacts: [
          'Elevation correction is 7 % per 300 m, applied to the basic runway length before the temperature correction.',
          'The temperature correction is applied to the elevation-corrected length, not to the basic length.',
          'Standard temperature at elevation h is 15 − 0.0065 h °C (the atmospheric lapse rate).',
          'Runway length increases with elevation and with temperature because both reduce air density.',
          'The wind rose determines the orientation of the runway, while the length is governed by the critical aircraft and the corrections above.'
        ],
        examTrap:
          'Applying the temperature correction to the basic length instead of the elevation-corrected length, and computing the temperature difference as (ART − 15) rather than (ART − standard temperature at that elevation).',
        benchmarkExample: {
          question:
            'A runway has a basic length of 2000 m at an elevation of 300 m above mean sea level, where the airport reference temperature is 33.05 °C. Applying the standard ICAO corrections, determine the corrected runway length.',
          options: ['2568 m', '2540 m', '2400 m', '2140 m'],
          correctAnswer: '2568 m',
          stepByStepSolution: [
            'Step 1 — Elevation correction: 7 % per 300 m of elevation, so +7 % of 2000 m = 140 m; corrected length = 2140 m.',
            'Step 2 — Standard temperature at 300 m: t_std = 15 − 0.0065 × 300 = 15 − 1.95 = 13.05 °C.',
            'Step 3 — Temperature difference = 33.05 − 13.05 = 20 °C, giving a correction of +20 %.',
            'Step 4 — Corrected length = 2140 × 1.20 = 2568 m.',
            'Step 5 — Note that 2140 m (elevation only) is one of the options — stopping after the first correction is the designed trap.'
          ],
          takeaway:
            'Each correction is applied to the length produced by the previous one. Order and base value matter as much as the percentages.'
        }
      },
      {
        stepNumber: 3,
        stepTitle: 'Bridges & Tunnels — Waterway, Afflux and Ventilation',
        subtitle: 'Scour depth, afflux and tunnel ventilation requirements',
        keyConcept:
          'A bridge waterway is fixed from the design flood discharge using the regime width relations, and the foundation depth must extend below the maximum scour. Lacey gives the regime scour depth as D = 0.473 (Q/f)^(1/3), where Q is the design discharge in cumecs and f the silt factor. The afflux — the rise in upstream water level caused by the obstruction — is estimated from the velocity through the contracted waterway by the Molesworth formula. Tunnels are designed for the ventilation required by the length, gradient, traffic and method of construction, since natural ventilation alone is inadequate beyond a limited length.',
        pointers: [
          'Lacey silt factor is taken as f = 1.76 √d_mm for the mean particle size in millimetres.',
          'Maximum scour depth is normally taken as twice the regime scour depth, and the foundation is carried below it.',
          'Afflux increases with the square of the velocity through the contracted waterway; it must be kept within safe limits for the upstream reach.',
          'Molesworth afflux formula relates the rise in level to the obstructed velocity and the waterway area.',
          'Tunnel alignment is dictated by the grade, the cover above the crown and the need to avoid unstable strata.',
          'Ventilation requirements increase with length and with traffic density; mechanical ventilation becomes necessary earlier on steeper gradients.'
        ],
        formulaOrCode:
          "Lacey regime scour depth: D = 0.473 (Q / f)^(1/3)\nMean velocity: V = (Q f² / 140)^(1/6)\nMaximum scour depth = 2 D (foundation below this)\nAfflux by Molesworth: h = (V²/2g)[(A/C_A)² − 1]",
        highYieldFacts: [
          'Regime scour depth by Lacey: D = 0.473 (Q/f)^(1/3), with Q in cumecs.',
          'Lacey silt factor f = 1.76 √d_mm links the particle size to the regime condition.',
          'Foundation depth for piers and abutments must be below the maximum scour, commonly taken as twice the regime depth.',
          'The bridge waterway is chosen so that afflux stays within permissible limits for the upstream land and structures.',
          'Tunnel ventilation need grows with length — long tunnels on steep gradients require mechanical ventilation.'
        ],
        examTrap:
          'Using the mean velocity formula when the question asks for scour depth, and forgetting to double the regime depth for maximum scour before setting the foundation level.',
        benchmarkExample: {
          question:
            'A bridge is to be designed for a flood discharge of 1000 cumecs in a regime channel with a silt factor of 1.0. Determine the Lacey regime scour depth.',
          options: ['4.73 m', '9.46 m', '2.37 m', '47.30 m'],
          correctAnswer: '4.73 m',
          stepByStepSolution: [
            'Step 1 — Lacey regime scour depth: D = 0.473 (Q/f)^(1/3).',
            'Step 2 — Q/f = 1000/1.0 = 1000, so (1000)^(1/3) = 10.',
            'Step 3 — D = 0.473 × 10 = 4.73 m.',
            'Step 4 — Maximum scour is taken as 2D = 9.46 m, below which the foundation must be carried.'
          ],
          takeaway:
            'Regime depth and maximum scour are often confused in the options — the foundation depth uses the doubled value, the waterway design uses the regime value.'
        }
      }
    ],
    topicQuestions: [
      {
        id: 'raf-tq-1',
        stem: 'For a broad gauge curve of radius 600 m with a design speed of 90 km/h, what is the equilibrium cant? (Take G = 1750 mm.)',
        options: [
          { id: 'A', text: '186.0 mm' },
          { id: 'B', text: '165.0 mm' },
          { id: 'C', text: '140.0 mm' },
          { id: 'D', text: '93.0 mm' }
        ],
        correctOption: 'A',
        explanation:
          'e = G V²/(127 R) = 1750 × 90²/(127 × 600) = 14 175 000/76 200 = 186.0 mm. The equilibrium cant exceeds the maximum permissible cant on broad gauge (165 mm, offered as option B), so the curve is laid with 165 mm and the balance of 21 mm is cant deficiency.',
        formulaContext: 'e = G V² / (127 R)',
        difficulty: 'MEDIUM',
        sourceType: 'MODELLED',
        topic: 'Railway Track & Geometric Design',
        subtopic: 'Equilibrium cant'
      },
      {
        id: 'raf-tq-2',
        stem: 'In airport runway design, the temperature correction is applied at what rate and to which length?',
        options: [
          { id: 'A', text: '1 % per °C, applied to the elevation-corrected length' },
          { id: 'B', text: '1 % per °C, applied to the basic length' },
          { id: 'C', text: '7 % per °C, applied to the basic length' },
          { id: 'D', text: '0.7 % per °C, applied to the elevation-corrected length' }
        ],
        correctOption: 'A',
        explanation:
          'The temperature correction is 1 % for each degree by which the airport reference temperature exceeds the standard temperature at the elevation, and it is applied to the length already corrected for elevation.',
        formulaContext: 'Temperature correction: +1 % per °C over standard, on elevation-corrected length',
        difficulty: 'MEDIUM',
        sourceType: 'MODELLED',
        topic: 'Airport Planning & Runway Design',
        subtopic: 'Runway length correction'
      },
      {
        id: 'raf-tq-3',
        stem: 'Lacey regime scour depth for a discharge of 8000 cumecs with a silt factor of 1.0 is approximately:',
        options: [
          { id: 'A', text: '9.5 m' },
          { id: 'B', text: '4.7 m' },
          { id: 'C', text: '19.0 m' },
          { id: 'D', text: '2.4 m' }
        ],
        correctOption: 'A',
        explanation:
          'D = 0.473 (Q/f)^(1/3) = 0.473 × (8000)^(1/3) = 0.473 × 20 = 9.46 m. Note that 8000^(1/3) = 20 because 20³ = 8000, so the arithmetic reduces to a clean multiple.',
        formulaContext: 'D = 0.473 (Q/f)^(1/3)',
        difficulty: 'MEDIUM',
        sourceType: 'MODELLED',
        topic: 'Bridges & Tunnels',
        subtopic: 'Lacey scour depth'
      },
      {
        id: 'raf-tq-4',
        stem: 'Which of the following is the primary purpose of providing cant on a railway curve?',
        options: [
          { id: 'A', text: 'To counteract the centrifugal force so the resultant load acts centrally on the sleeper' },
          { id: 'B', text: 'To increase the gauge on curves' },
          { id: 'C', text: 'To reduce the radius of the curve' },
          { id: 'D', text: 'To prevent rail creep on gradients' }
        ],
        correctOption: 'A',
        explanation:
          'Raising the outer rail tilts the track so that the resultant of the weight and the centrifugal force is normal to the sleeper plane, distributing the load evenly across both rails and reducing lateral wear.',
        formulaContext: 'Cant counters centrifugal force: FC = W V² / (127 R)',
        difficulty: 'EASY',
        sourceType: 'MODELLED',
        topic: 'Railway Track & Geometric Design',
        subtopic: 'Purpose of cant'
      }
    ]
  }
];
