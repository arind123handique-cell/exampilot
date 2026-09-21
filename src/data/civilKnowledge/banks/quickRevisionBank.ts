import type { QuickRevisionItem } from '../../../types/civilKnowledge';

export const CIVIL_QUICK_REVISION_BANK: QuickRevisionItem[] = [
  {
    id: 'qr-som-001',
    subject: 'Strength of Materials',
    topic: 'Elastic Constants Relationships',
    branch: 'Structural & Mechanics',
    highYieldFact: 'The 4 fundamental elastic constant relationships: E = 2G(1 + nu) = 3K(1 - 2nu) = 9KG / (3K + G). If Poisson\'s ratio nu = 0.25, E / G = 2.50 and E / K = 1.50.',
    examSignificance: 'CRITICAL',
    tags: ['elastic constants', 'E G K nu', 'UPSC ESE', 'APSC AE']
  },
  {
    id: 'qr-som-002',
    subject: 'Strength of Materials',
    topic: 'Shear Stress Distribution in Sections',
    branch: 'Structural & Mechanics',
    highYieldFact: 'For a rectangular beam, tau_max = 1.5 * tau_avg at the neutral axis. For a circular beam, tau_max = 4/3 * tau_avg (1.33 tau_avg). For a triangular section, tau_max = 1.5 * tau_avg at h/2 from vertex (neutral axis is at 2h/3 from vertex where tau = 1.33 tau_avg). For a diamond section, tau_max = 1.125 tau_avg at 3h/8 from top.',
    examSignificance: 'CRITICAL',
    tags: ['shear stress distribution', 'tau_max', 'triangular beam']
  },
  {
    id: 'qr-rcc-001',
    subject: 'Reinforced Concrete Structures',
    topic: 'Minimum Concrete Grades as per IS 456:2000',
    branch: 'Structural & Mechanics',
    highYieldFact: 'As per IS 456 Table 5: Minimum concrete grade for Plain Concrete (PCC) in Mild exposure is M15, and for Moderate is M15. For Reinforced Concrete (RCC), minimum grade is M20 for Mild, M25 for Moderate, M30 for Severe, M35 for Very Severe, and M40 for Extreme exposure.',
    examSignificance: 'CRITICAL',
    tags: ['IS 456 Table 5', 'exposure conditions', 'minimum grade', 'APSC AE']
  },
  {
    id: 'qr-rcc-002',
    subject: 'Reinforced Concrete Structures',
    topic: 'Limiting Neutral Axis Depth Ratios (IS 456)',
    branch: 'Structural & Mechanics',
    highYieldFact: 'Limiting neutral axis depth ratio xu_max / d: Fe 250 -> 0.53 ; Fe 415 -> 0.48 ; Fe 500 -> 0.46 ; Fe 550 -> 0.44.',
    examSignificance: 'CRITICAL',
    codeClause: 'IS 456:2000 Cl. 38.1',
    tags: ['xu_max', 'neutral axis', 'Fe 415', 'Fe 500']
  },
  {
    id: 'qr-steel-001',
    subject: 'Design of Steel Structures',
    topic: 'Maximum Slenderness Ratio Limits (IS 800:2007)',
    branch: 'Structural & Mechanics',
    highYieldFact: 'As per IS 800 Table 3: Member carrying compressive loads from dead load & superimposed load -> max lambda = 180. Member carrying tension loads -> max lambda = 400. Member subjected to compressive forces resulting from wind/earthquake forces -> max lambda = 250. Tension member subject to reversal of direct stress due to wind/earthquake -> max lambda = 350.',
    examSignificance: 'CRITICAL',
    codeClause: 'IS 800:2007 Table 3',
    tags: ['slenderness ratio', 'IS 800 Table 3', 'compression members']
  },
  {
    id: 'qr-geo-001',
    subject: 'Geotechnical Engineering',
    topic: 'Soil Classification & Plasticity Chart',
    branch: 'Geotechnical & Foundations',
    highYieldFact: 'A-Line in Casagrande Plasticity Chart: Ip = 0.73 (wL - 20). Soils plotting above the A-Line are Inorganic Clays (CL, CI, CH). Soils plotting below the A-Line are Silts (ML, MI, MH) or Organic soils (OL, OI, OH). For liquid limit wL < 35% (low compressibility), 35-50% (intermediate), > 50% (high compressibility). The U-Line represents the upper bound: Ip = 0.9 (wL - 8).',
    examSignificance: 'CRITICAL',
    codeClause: 'IS 1498:1970',
    tags: ['plasticity chart', 'A-line', 'clay vs silt']
  },
  {
    id: 'qr-geo-002',
    subject: 'Geotechnical Engineering',
    topic: 'Consolidation Settlement Formula',
    branch: 'Geotechnical & Foundations',
    highYieldFact: 'Primary consolidation settlement for normally consolidated clay: S_f = [C_c * H_0 / (1 + e_0)] * log10[(sigma_0\' + delta_sigma\') / sigma_0\']. Compression index Cc for undisturbed clay can be estimated as Cc = 0.009 (wL - 10) (Skempton\'s formula), and for remolded clay Cc = 0.007 (wL - 10).',
    examSignificance: 'HIGH',
    tags: ['consolidation', 'settlement', 'compression index']
  },
  {
    id: 'qr-fluids-001',
    subject: 'Fluid Mechanics & Hydraulics',
    topic: 'Most Economical Open Channel Sections',
    branch: 'Water Resources & Fluids',
    highYieldFact: 'Most economical sections: 1. Rectangular: bed width b = 2y, hydraulic radius R = y/2. 2. Trapezoidal: half-regular hexagon, side slope 60° to horizontal (m = 1/sqrt(3)), top width T = 4y/sqrt(3), hydraulic radius R = y/2. 3. Triangular: side slope 45° with vertical (m = 1, vertex angle 90°), hydraulic radius R = y / (2 sqrt(2)).',
    examSignificance: 'CRITICAL',
    tags: ['most economical channel', 'trapezoidal', 'triangular', 'APSC AE']
  },
  {
    id: 'qr-env-001',
    subject: 'Environmental Engineering',
    topic: 'Drinking Water Standards (IS 10500:2012)',
    branch: 'Environmental & Sanitary',
    highYieldFact: 'IS 10500:2012 Key Water Quality Limits (Acceptable / Permissible in absence of alternate source): Turbidity: 1 / 5 NTU ; TDS: 500 / 2000 mg/L ; Total Hardness: 200 / 600 mg/L as CaCO3 ; Chlorides: 250 / 1000 mg/L ; Fluoride: 1.0 / 1.5 mg/L (dental fluorosis > 1.5, bone fluorosis > 3.0) ; Nitrate: 45 / No relaxation mg/L (blue baby disease / methemoglobinemia) ; Iron: 1.0 / No relaxation mg/L.',
    examSignificance: 'CRITICAL',
    codeClause: 'IS 10500:2012 Table 1 & 2',
    tags: ['IS 10500', 'fluoride', 'nitrate', 'hardness']
  },
  {
    id: 'qr-trans-001',
    subject: 'Transportation Engineering',
    topic: 'Maximum Super-Elevation Rates as per IRC:73',
    branch: 'Transportation & Highways',
    highYieldFact: 'Maximum allowable super-elevation (e_max): Plain and rolling terrain = 7% (0.07). Hilly terrain not bound with snow = 10% (0.10). Urban road sections with frequent intersections = 4% (0.04). Minimum super-elevation should equal the camber of the road surface.',
    examSignificance: 'CRITICAL',
    codeClause: 'IRC:73-1980 Cl. 6.3',
    tags: ['IRC:73', 'super-elevation', 'plain terrain 7%', 'hilly 10%']
  },
  {
    id: 'qr-surv-001',
    subject: 'Surveying & Geomatics',
    topic: 'Magnetic Declination & Bearing Conversions',
    branch: 'Geomatics, Materials & Management',
    highYieldFact: 'True Bearing = Magnetic Bearing ± Magnetic Declination (Add East declination, Subtract West declination). Remember: "East is Least (subtract if finding MB from TB, but add to MB to get TB) and West is Best". Magnetic dip at equator is 0° and at magnetic poles is 90°.',
    examSignificance: 'HIGH',
    tags: ['magnetic declination', 'true bearing', 'magnetic dip']
  },

  /* ==========================================================================
     BHAVIKATTI: BASIC CIVIL ENGINEERING HIGH-YIELD FACTS
     ========================================================================== */
  {
    id: 'qr-bhav-001',
    subject: 'Building Materials & Concrete Technology',
    topic: 'Building Stone Crushing Strengths',
    branch: 'Geomatics, Materials & Management',
    highYieldFact: 'Crushing strength hierarchy of engineering stones (Bhavikatti Table 1.1): Trap (300-350 N/mm²) > Basalt (153-189) > Granite (104-140) > Slate (70-210) > Marble (72) > Sandstone (65) > Limestone (55) > Laterite (1.8-3.2 N/mm²). Minimum crushing strength for good building stone is 100 N/mm².',
    examSignificance: 'CRITICAL',
    tags: ['stone crushing strength', 'granite', 'basalt', 'trap', 'APSC AE']
  },
  {
    id: 'qr-bhav-002',
    subject: 'Building Materials & Concrete Technology',
    topic: 'Standard Brick Dimensions & Absorption Limits',
    branch: 'Geomatics, Materials & Management',
    highYieldFact: 'Standard modular brick size is 190 x 90 x 90 mm (nominal 200 x 100 x 100 mm with mortar). Traditional non-modular Indian brick is 230 x 115 x 75 mm (9" x 4.5" x 3"). Per IS 1077: First Class brick >= 10.5 MPa (water absorption <= 20%); Second Class >= 7.0 MPa (absorption <= 22%); Third Class >= 3.5 MPa (absorption <= 25%).',
    examSignificance: 'CRITICAL',
    codeClause: 'IS 1077:1992 Cl. 4.2',
    tags: ['modular brick', 'water absorption', 'IS 1077', 'first class brick']
  },
  {
    id: 'qr-bhav-003',
    subject: 'Building Materials & Concrete Technology',
    topic: 'Standard Physical Testing of Portland Cement',
    branch: 'Geomatics, Materials & Management',
    highYieldFact: 'Vicat apparatus consistency: 10 mm plunger penetrating 33-35 mm from top. Initial setting time: 1 mm square needle, min 30 minutes. Final setting time: 5 mm annular collar, max 600 minutes (10 hours). Soundness: Le Chatelier expansion <= 10 mm (detects free lime only); Autoclave expansion <= 0.8% (detects both lime and magnesia).',
    examSignificance: 'CRITICAL',
    codeClause: 'IS 269:2015 & IS 4031',
    tags: ['Vicat apparatus', 'setting time', 'Le Chatelier', 'autoclave', 'soundness']
  },
  {
    id: 'qr-bhav-004',
    subject: 'Building Construction & Planning',
    topic: 'Safe Bearing Capacity (SBC) Standard Values',
    branch: 'Geomatics, Materials & Management',
    highYieldFact: 'Standard Safe Bearing Capacity (SBC) hierarchy (Bhavikatti Table 7.1): Igneous rocks (granite, basalt) = 3300 kN/m²; Sedimentary rocks (limestone, sandstone) = 1650 kN/m²; Hard compact gravel = 450 kN/m²; Medium coarse sand = 250 kN/m²; Soft clay = 100 kN/m²; Black cotton soil = 50 kN/m².',
    examSignificance: 'CRITICAL',
    codeClause: 'Bhavikatti Table 7.1 & IS 1904',
    tags: ['safe bearing capacity', 'SBC table', 'igneous rock', 'black cotton soil']
  },
  {
    id: 'qr-bhav-005',
    subject: 'Building Construction & Planning',
    topic: 'Staircase Geometric Comfort Rules & Spans',
    branch: 'Geomatics, Materials & Management',
    highYieldFact: 'Staircase comfort rule: 2 * Rise + Tread = 550 to 600 mm. Rise + Tread = 400 to 450 mm. Stair pitch must be 25° to 40°. Minimum headroom clearance = 2.1 m. Number of treads = Number of risers - 1. King post truss span <= 8 m; Queen post truss span 8 to 12 m; Howe truss 6 to 30 m; Pratt truss 6 to 100 m.',
    examSignificance: 'CRITICAL',
    codeClause: 'NBC 2016 Part 3 & Bhavikatti Ch. 10',
    tags: ['staircase', 'rise and tread', 'headroom 2.1m', 'king post', 'queen post']
  },
  {
    id: 'qr-bhav-006',
    subject: 'Surveying & Geomatics',
    topic: 'Simpson\'s 1/3rd Rule Parabolic Boundary Conditions',
    branch: 'Geomatics, Materials & Management',
    highYieldFact: 'Simpson\'s 1/3rd rule [A = (d/3)*(E + 4*Odd + 2*Even)] can ONLY be applied when the number of strips/divisions is EVEN, which requires that the total number of ordinates is strictly ODD. Prismoidal formula always gives less volume than the trapezoidal formula for convex ground profiles (Cp = V_trap - V_prism > 0).',
    examSignificance: 'CRITICAL',
    tags: ['Simpsons rule', 'odd ordinates', 'prismoidal volume', 'prismoidal correction']
  },
  {
    id: 'qr-bhav-007',
    subject: 'Surveying & Geomatics',
    topic: 'Lehman\'s Rules for Plane Table Three-Point Problem',
    branch: 'Geomatics, Materials & Management',
    highYieldFact: 'Lehman\'s rules for solving the Three-Point Problem: 1. Distance of point p from each ray is proportional to the distance of instrument from ground station; 2. Point p lies on same side of all rays; 3. If instrument is inside the great triangle ABC, p lies inside the triangle of error. If instrument lies on the circumscribed circle passing through A, B, C (danger circle), resection is indeterminate!',
    examSignificance: 'HIGH',
    tags: ['plane table', 'Lehmans rules', 'three-point problem', 'danger circle']
  },
  {
    id: 'qr-bhav-008',
    subject: 'Building Construction & Planning',
    topic: 'Indian Seismic Zonation & Zone Factors (IS 1893:2016)',
    branch: 'Geomatics, Materials & Management',
    highYieldFact: 'India is divided into 4 seismic zones (Zone I does not exist): Zone II (Low, Z = 0.10), Zone III (Moderate, Z = 0.16), Zone IV (Severe, Z = 0.24), Zone V (Very Severe, Z = 0.36). SMRF response reduction factor R = 5; OMRF R = 3. Horizontal seismic coefficient Ah = (Z/2)*(I/R)*(Sa/g). Base shear VB = Ah * W.',
    examSignificance: 'CRITICAL',
    codeClause: 'IS 1893:2016 Cl. 6.4.2',
    tags: ['seismic zones', 'zone factor', 'base shear', 'IS 1893', 'APSC AE']
  }
];
