import type { DefinitionBankItem } from '../../../types/civilKnowledge';

export const CIVIL_DEFINITION_BANK: DefinitionBankItem[] = [
  {
    id: 'def-som-001',
    term: 'Modulus of Resilience',
    formalDefinition: 'The maximum strain energy per unit volume that a material can absorb without undergoing any permanent plastic deformation (i.e. up to the elastic limit).',
    context: 'Calculated as the area under the stress-strain curve up to the proportional/elastic limit: U_r = sigma_y^2 / (2E).',
    subject: 'Strength of Materials',
    topic: 'Strain Energy & Impact Loading',
    branch: 'Structural & Mechanics',
    keyKeywords: ['strain energy', 'elastic limit', 'resilience', 'proof resilience']
  },
  {
    id: 'def-som-002',
    term: 'Poisson\'s Ratio (nu)',
    formalDefinition: 'The ratio of transverse (lateral) strain to longitudinal (axial) strain within the elastic limit for a body subjected to uniaxial loading.',
    context: 'nu = - (lateral strain) / (longitudinal strain). For engineering materials, nu ranges between 0 (cork) and 0.5 (rubber / saturated undrained clay). For concrete, nu ≈ 0.15 - 0.20; for structural steel, nu ≈ 0.28 - 0.33.',
    subject: 'Strength of Materials',
    topic: 'Elastic Constants & Hooke\'s Law',
    branch: 'Structural & Mechanics',
    keyKeywords: ['lateral strain', 'axial strain', 'elastic constant']
  },
  {
    id: 'def-rcc-001',
    term: 'Characteristic Strength of Concrete (fck)',
    formalDefinition: 'The compressive strength of concrete below which not more than 5 percent of the test results are expected to fall.',
    context: 'Evaluated by testing 150 mm standard cubes at 28 days of standard curing: fck = f_target - 1.65 * sigma.',
    subject: 'Reinforced Concrete Structures',
    topic: 'Concrete Grades & Quality Control',
    branch: 'Structural & Mechanics',
    codeReference: 'IS 456:2000 Cl. 6.1.1 & Table 2',
    keyKeywords: ['5 percent', '28 days', '150 mm cube', 'target mean strength']
  },
  {
    id: 'def-geo-001',
    term: 'Effective Stress Principle (Terzaghi)',
    formalDefinition: 'The portion of total stress carried exclusively by the solid soil skeleton at grain-to-grain contact points, which uniquely controls all volume changes (compression/consolidation) and shear strength of soils.',
    context: 'sigma\' = sigma - u, where sigma is total stress and u is pore water pressure. Neutral stress (pore pressure) acts equally in all directions and does not produce shear strength.',
    subject: 'Geotechnical Engineering',
    topic: 'Effective Stress & Pore Water Pressure',
    branch: 'Geotechnical & Foundations',
    codeReference: 'Karl Terzaghi 1925',
    keyKeywords: ['grain contact', 'pore water pressure', 'shear strength', 'consolidation']
  },
  {
    id: 'def-geo-002',
    term: 'Critical Hydraulic Gradient (i_cr)',
    formalDefinition: 'The upward hydraulic gradient at which the seepage pressure of upward percolating water exactly balances the submerged (buoyant) unit weight of the soil, reducing effective stress to zero.',
    context: 'i_cr = (G - 1) / (1 + e) = (gamma_sub / gamma_w). When i >= i_cr, cohesionless soil loses all shear strength and flows like a viscous liquid (Quick Sand Condition / Boiling).',
    subject: 'Geotechnical Engineering',
    topic: 'Seepage & Quicksand Phenomenon',
    branch: 'Geotechnical & Foundations',
    keyKeywords: ['seepage force', 'zero effective stress', 'boiling', 'piping']
  },
  {
    id: 'def-fluids-001',
    term: 'Froude Number (Fr)',
    formalDefinition: 'A dimensionless number representing the ratio of inertial forces to gravitational forces in a fluid flow with a free surface.',
    context: 'Fr = V / sqrt(g * D), where D = A / T is hydraulic depth. Categorizes open channel flow into subcritical (Fr < 1, tranquil flow governed by downstream control), critical (Fr = 1, minimum specific energy), and supercritical (Fr > 1, shooting/rapid flow governed by upstream control).',
    subject: 'Fluid Mechanics & Hydraulics',
    topic: 'Open Channel Flow Principles',
    branch: 'Water Resources & Fluids',
    keyKeywords: ['gravity force', 'inertia', 'subcritical', 'supercritical']
  },
  {
    id: 'def-fluids-002',
    term: 'Sequent Depths (Conjugate Depths)',
    formalDefinition: 'The two different depths of flow (supercritical y1 and subcritical y2) that possess the exact same specific force (F = q^2/(gy) + y^2/2) on either side of a hydraulic jump.',
    context: 'Must not be confused with alternate depths, which correspond to the same specific energy (E). In a jump, energy is dissipated (E1 > E2), but momentum/specific force is conserved (F1 = F2).',
    subject: 'Fluid Mechanics & Hydraulics',
    topic: 'Hydraulic Jump Mechanics',
    branch: 'Water Resources & Fluids',
    keyKeywords: ['specific force', 'momentum conservation', 'hydraulic jump']
  },
  {
    id: 'def-env-001',
    term: 'Biochemical Oxygen Demand (BOD5 at 20°C)',
    formalDefinition: 'The amount of dissolved oxygen (in mg/L) consumed by aerobic microorganisms during the biochemical oxidation and stabilization of decomposable organic matter in water over a 5-day incubation period at 20°C.',
    context: 'Standard laboratory measure of wastewater pollutional strength. Governed by first-order kinetics: BOD_t = L_0 * (1 - 10^(-K_D * t)).',
    subject: 'Environmental Engineering',
    topic: 'Wastewater Quality Parameters',
    branch: 'Environmental & Sanitary',
    codeReference: 'IS 3025 (Part 44) & CPHEEO Manual',
    keyKeywords: ['dissolved oxygen', 'aerobic microorganisms', 'organic matter', '5 days']
  },
  {
    id: 'def-trans-001',
    term: 'Stopping Sight Distance (SSD)',
    formalDefinition: 'The minimum distance visible along the road surface ahead of a driver traveling at design speed, sufficient to enable the vehicle to come safely to a complete halt before colliding with a stationary obstacle on the carriageway.',
    context: 'SSD = Lag distance (distance covered during PIEV reaction time) + Braking distance (V^2 / 2gf). Specified by IRC:73 assuming driver eye height = 1.2 m and object height = 0.15 m above road surface.',
    subject: 'Transportation Engineering',
    topic: 'Highway Geometric Design',
    branch: 'Transportation & Highways',
    codeReference: 'IRC:73-1980 Cl. 6.1',
    keyKeywords: ['sight distance', 'PIEV theory', 'braking distance', 'eye height 1.2m']
  },
  {
    id: 'def-cpm-001',
    term: 'Total Float (TF)',
    formalDefinition: 'The total amount of time by which the completion of an activity can be delayed without delaying the scheduled completion date of the entire project.',
    context: 'TF = L_j - E_i - t_ij. For any activity lying on the critical path, Total Float is zero (or minimum), and the critical path is the longest duration sequence of zero-float activities.',
    subject: 'Construction Management & Estimating',
    topic: 'Project Scheduling (CPM)',
    branch: 'Geomatics, Materials & Management',
    keyKeywords: ['float', 'critical path', 'latest finish', 'earliest start']
  },

  /* ==========================================================================
     BHAVIKATTI: BASIC CIVIL ENGINEERING DEFINITIONS
     ========================================================================== */
  {
    id: 'def-bhav-001',
    term: 'Safe Bearing Capacity (SBC)',
    formalDefinition: 'The maximum gross contact pressure that the supporting soil foundation stratum can safely support without risk of shear failure or exceeding permissible differential settlement.',
    context: 'Evaluated by dividing ultimate bearing capacity by a factor of safety (typically 2.5 to 3.0). Standard values range from 50 kN/m² (black cotton soil) to 3300 kN/m² (hard igneous rock).',
    subject: 'Building Construction & Planning',
    topic: 'Foundation Engineering',
    branch: 'Geomatics, Materials & Management',
    codeReference: 'IS 1904:1986 & Bhavikatti Table 7.1',
    keyKeywords: ['safe bearing capacity', 'shear failure', 'settlement', 'factor of safety']
  },
  {
    id: 'def-bhav-002',
    term: 'Queen Closer',
    formalDefinition: 'A portion of a standard brick obtained by cutting the brick longitudinally into two equal halves (measuring 190 x 45 x 90 mm in modular dimensions).',
    context: 'Placed immediately next to the corner quoin header in each heading course of English and Flemish brick bonds to break continuous vertical joints and establish a minimum 1/4-brick lap.',
    subject: 'Building Construction & Planning',
    topic: 'Brick Masonry Bonds',
    branch: 'Geomatics, Materials & Management',
    codeReference: 'IS 2212:1991 & Bhavikatti Ch. 9',
    keyKeywords: ['queen closer', 'quoin header', 'lap', 'brick bond', 'vertical joint']
  },
  {
    id: 'def-bhav-003',
    term: 'Height of Instrument (HI)',
    formalDefinition: 'The actual elevation (Reduced Level) of the horizontal line of collimation of a leveling instrument telescope above the datum plane.',
    context: 'Computed as HI = RL of Benchmark + Backsight (BS). Intermediate Sights (IS) and Foresights (FS) are subtracted directly from HI to determine ground Reduced Levels: RL = HI - FS.',
    subject: 'Surveying & Geomatics',
    topic: 'Spirit Leveling',
    branch: 'Geomatics, Materials & Management',
    codeReference: 'Survey of India Manual & Bhavikatti Ch. 15',
    keyKeywords: ['height of instrument', 'line of collimation', 'backsight', 'reduced level']
  },
  {
    id: 'def-bhav-004',
    term: 'Reciprocal Leveling',
    formalDefinition: 'A specialized leveling field operation conducted from both opposite banks of an impassable obstacle (river, deep ravine) to determine true elevation differences without balancing sight distances.',
    context: 'By averaging the apparent height differences observed from both stations [H = 0.5 * (delta_h1 + delta_h2)], instrumental collimation error, earth curvature, and atmospheric refraction are mathematically eliminated.',
    subject: 'Surveying & Geomatics',
    topic: 'Leveling Across Obstacles',
    branch: 'Geomatics, Materials & Management',
    codeReference: 'Bhavikatti Ch. 15 Sec. 15.11',
    keyKeywords: ['reciprocal leveling', 'collimation error', 'curvature correction', 'refraction']
  },
  {
    id: 'def-bhav-005',
    term: 'Zero Circle (Planimeter)',
    formalDefinition: 'The specific circle traced by an Amsler Polar Planimeter tracing point when the plane of the integrating measuring wheel passes continuously through the fixed anchor pole, causing zero roller wheel rotation.',
    context: 'When tracing the perimeter of this circle, the roller wheel skids purely without revolving, recording zero area change. If the anchor point lies inside the boundary, the zero circle area (M * C) must be added to the recorded area.',
    subject: 'Surveying & Geomatics',
    topic: 'Area Computation & Planimeters',
    branch: 'Geomatics, Materials & Management',
    codeReference: 'Bhavikatti Ch. 18 Sec. 18.7',
    keyKeywords: ['zero circle', 'planimeter', 'anchor point', 'circle of correction', 'roller wheel']
  },
  {
    id: 'def-bhav-006',
    term: 'Autoclaved Aerated Concrete (AAC)',
    formalDefinition: 'A lightweight precast cellular concrete produced by introducing fine aluminium powder into a slurry of cement, lime, fly ash, and water, generating microscopic hydrogen gas bubbles that expand the matrix prior to high-pressure steam autoclave curing.',
    context: 'Possesses dry density of 300 to 800 kg/m³ (one-third that of conventional concrete), compressive strength 3.0 to 4.5 MPa, superior thermal insulation (k = 0.16 W/m-K), and 4-hour fire resistance rating.',
    subject: 'Building Materials & Concrete Technology',
    topic: 'Special Concretes',
    branch: 'Geomatics, Materials & Management',
    codeReference: 'IS 2185 (Part 3) & Bhavikatti Ch. 4',
    keyKeywords: ['cellular concrete', 'aluminium powder', 'autoclave', 'fly ash', 'lightweight']
  },
  {
    id: 'def-bhav-007',
    term: 'Ferrocement',
    formalDefinition: 'A composite structural material comprising a thin shell (10 to 30 mm) of rich cement mortar (1:2 to 1:3 ratio) reinforced with closely spaced multiple layers of fine, flexible galvanized woven or welded wire mesh.',
    context: 'Exhibits high tensile strength, high ductility, superior crack arrest, and watertightness. Widely used for prefabricated water storage tanks, grain silos, parabolic domes, and boat hulls.',
    subject: 'Building Materials & Concrete Technology',
    topic: 'Special Concretes',
    branch: 'Geomatics, Materials & Management',
    codeReference: 'ACI 549R & Bhavikatti Ch. 4 Sec. 4.6',
    keyKeywords: ['ferrocement', 'wire mesh', 'thin shell', 'crack arrest', 'water tank']
  },
  {
    id: 'def-bhav-008',
    term: 'Seismic Base Isolation',
    formalDefinition: 'A passive earthquake protection technique that uncouples a building superstructure from its substructure using horizontally flexible elastomeric or sliding bearings, shifting the fundamental vibration period beyond the dominant seismic frequency range.',
    context: 'By increasing natural period from ~0.5 s to > 2.5 s, ground shaking accelerations transmitted to upper floors and contents are reduced by up to 75%, preventing inter-storey drift and non-structural damage.',
    subject: 'Building Construction & Planning',
    topic: 'Disaster Resistant Buildings',
    branch: 'Geomatics, Materials & Management',
    codeReference: 'IS 1893:2016 & Bhavikatti Ch. 20 Sec. 20.9',
    keyKeywords: ['base isolation', 'elastomeric bearing', 'natural period', 'lead rubber bearing', 'earthquake']
  }
];
