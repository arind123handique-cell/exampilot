import type { FormulaBankItem } from '../../../types/civilKnowledge';

export const CIVIL_FORMULA_BANK: FormulaBankItem[] = [
  /* ==========================================================================
     BRANCH 1: STRUCTURAL MECHANICS & DESIGN
     ========================================================================== */
  {
    id: 'f-som-001',
    name: 'Euler Critical Buckling Load',
    formulaLatex: 'P_{cr} = \\frac{\\pi^2 E I}{L_e^2}',
    plainText: 'P_cr = (pi^2 * E * I) / (L_e^2)',
    subject: 'Strength of Materials',
    topic: 'Columns & Struts',
    branch: 'Structural & Mechanics',
    variables: [
      { symbol: 'P_cr', name: 'Critical Buckling Load', siUnit: 'N', dimensionalFormula: '[M L T^-2]', typicalRange: '10 kN - 5000 kN' },
      { symbol: 'E', name: 'Modulus of Elasticity', siUnit: 'N/m^2 (Pa)', dimensionalFormula: '[M L^-1 T^-2]', typicalRange: '2 x 10^11 Pa (Steel)' },
      { symbol: 'I', name: 'Least Moment of Inertia', siUnit: 'm^4', dimensionalFormula: '[L^4]' },
      { symbol: 'L_e', name: 'Effective Length', siUnit: 'm', dimensionalFormula: '[L]' }
    ],
    conditionsOfApplicability: [
      'Valid only for long, slender columns where failure occurs by elastic buckling (not crushing)',
      'Column material is homogeneous, isotropic and obeys Hooke\'s law',
      'Column axis is perfectly straight initially and load is purely axial',
      'Self-weight of column is neglected'
    ],
    standardConstants: [
      { symbol: 'E_steel', name: 'Steel Elastic Modulus', value: '200000', unit: 'MPa' }
    ],
    codeRef: 'IS 800:2007 Cl. 7.1.2',
    derivationSummary: 'Derived from Euler-Bernoulli beam differential equation: d2y/dx2 + (P/EI)y = 0 with sinusoidal boundary modes.',
    difficulty: 'INTERMEDIATE'
  },
  {
    id: 'f-som-002',
    name: 'Flexure Formula (Pure Bending)',
    formulaLatex: '\\frac{M}{I} = \\frac{\\sigma}{y} = \\frac{E}{R}',
    plainText: 'M / I = sigma / y = E / R',
    subject: 'Strength of Materials',
    topic: 'Bending Stresses in Beams',
    branch: 'Structural & Mechanics',
    variables: [
      { symbol: 'M', name: 'Bending Moment at section', siUnit: 'N·m', dimensionalFormula: '[M L^2 T^-2]' },
      { symbol: 'I', name: 'Moment of Inertia about neutral axis', siUnit: 'm^4', dimensionalFormula: '[L^4]' },
      { symbol: 'sigma', name: 'Bending stress at distance y from NA', siUnit: 'N/m^2 (Pa)', dimensionalFormula: '[M L^-1 T^-2]' },
      { symbol: 'y', name: 'Distance from neutral axis', siUnit: 'm', dimensionalFormula: '[L]' },
      { symbol: 'E', name: 'Young\'s Modulus', siUnit: 'N/m^2', dimensionalFormula: '[M L^-1 T^-2]' },
      { symbol: 'R', name: 'Radius of curvature of neutral surface', siUnit: 'm', dimensionalFormula: '[L]' }
    ],
    conditionsOfApplicability: [
      'Plane transverse sections before bending remain plane after bending (Bernoulli hypothesis)',
      'Beam is subjected to pure bending without shear or axial force',
      'Material obeys Hooke\'s law with equal E in tension and compression',
      'Beam is initially straight with constant cross-section'
    ],
    codeRef: 'IS 456:2000 Cl. 38.1',
    derivationSummary: 'From longitudinal strain compatibility eps = y / R combined with uniaxial stress-strain sigma = E * eps.',
    difficulty: 'FUNDAMENTAL'
  },
  {
    id: 'f-som-003',
    name: 'Torsion Formula for Circular Shafts',
    formulaLatex: '\\frac{T}{J} = \\frac{\\tau}{r} = \\frac{G \\theta}{L}',
    plainText: 'T / J = tau / r = (G * theta) / L',
    subject: 'Strength of Materials',
    topic: 'Torsion of Shafts',
    branch: 'Structural & Mechanics',
    variables: [
      { symbol: 'T', name: 'Twisting Moment / Torque', siUnit: 'N·m', dimensionalFormula: '[M L^2 T^-2]' },
      { symbol: 'J', name: 'Polar Moment of Inertia (pi*d^4/32 for solid)', siUnit: 'm^4', dimensionalFormula: '[L^4]' },
      { symbol: 'tau', name: 'Shear stress at radius r', siUnit: 'N/m^2 (Pa)', dimensionalFormula: '[M L^-1 T^-2]' },
      { symbol: 'r', name: 'Radial distance from axis', siUnit: 'm', dimensionalFormula: '[L]' },
      { symbol: 'G', name: 'Shear Modulus / Modulus of Rigidity', siUnit: 'N/m^2', dimensionalFormula: '[M L^-1 T^-2]' },
      { symbol: 'theta', name: 'Angle of twist', siUnit: 'rad', dimensionalFormula: '[1]' },
      { symbol: 'L', name: 'Length of shaft', siUnit: 'm', dimensionalFormula: '[L]' }
    ],
    conditionsOfApplicability: [
      'Shaft is circular (solid or hollow) - non-circular shafts warp and violate plane section assumption',
      'Torque is uniform along the length without axial force',
      'Material is elastic and shear stress does not exceed proportional limit'
    ],
    codeRef: 'IS 800:2007 Cl. 8.2',
    derivationSummary: 'From shear strain gamma = r * (dtheta/dx) combined with Hooke\'s law for shear tau = G * gamma.',
    difficulty: 'FUNDAMENTAL'
  },
  {
    id: 'f-rcc-001',
    name: 'Limiting Neutral Axis Depth (LSM)',
    formulaLatex: 'x_{u,max} = \\frac{0.0035}{0.0035 + \\frac{0.87 f_y}{E_s}} \\cdot d',
    plainText: 'xu_max / d = 0.0035 / (0.0035 + 0.87*fy / Es)',
    subject: 'Reinforced Concrete Structures',
    topic: 'Limit State of Collapse — Flexure',
    branch: 'Structural & Mechanics',
    variables: [
      { symbol: 'xu_max', name: 'Limiting depth of neutral axis', siUnit: 'mm', dimensionalFormula: '[L]' },
      { symbol: 'd', name: 'Effective depth of section', siUnit: 'mm', dimensionalFormula: '[L]' },
      { symbol: 'fy', name: 'Characteristic yield strength of steel', siUnit: 'N/mm^2 (MPa)', dimensionalFormula: '[M L^-1 T^-2]' },
      { symbol: 'Es', name: 'Modulus of elasticity of steel', siUnit: 'N/mm^2', dimensionalFormula: '[M L^-1 T^-2]' }
    ],
    conditionsOfApplicability: [
      'Concrete strain at ultimate failure reaches 0.0035',
      'Steel strain at yield reaches 0.002 + 0.87*fy / Es',
      'Prevents over-reinforced brittle compression failures'
    ],
    standardConstants: [
      { symbol: 'Es', name: 'Modulus of Elasticity of Reinforcing Steel', value: '200000', unit: 'MPa' },
      { symbol: 'Fe250_ratio', name: 'xu_max / d for Fe 250', value: '0.53', unit: '-' },
      { symbol: 'Fe415_ratio', name: 'xu_max / d for Fe 415', value: '0.48', unit: '-' },
      { symbol: 'Fe500_ratio', name: 'xu_max / d for Fe 500', value: '0.46', unit: '-' }
    ],
    codeRef: 'IS 456:2000 Cl. 38.1 Note',
    derivationSummary: 'From linear strain diagram across the cross-section by similar triangles.',
    difficulty: 'INTERMEDIATE'
  },
  {
    id: 'f-rcc-002',
    name: 'Limiting Moment of Resistance of Singly Reinforced Section',
    formulaLatex: 'M_{u,lim} = 0.36 f_{ck} b x_{u,max} \\left(d - 0.42 x_{u,max}\\right) = Q f_{ck} b d^2',
    plainText: 'Mu_lim = 0.36 * fck * b * xu_max * (d - 0.42 * xu_max) = Q * fck * b * d^2',
    subject: 'Reinforced Concrete Structures',
    topic: 'Flexural Analysis & Design',
    branch: 'Structural & Mechanics',
    variables: [
      { symbol: 'Mu_lim', name: 'Limiting Factored Moment of Resistance', siUnit: 'N·mm', dimensionalFormula: '[M L^2 T^-2]' },
      { symbol: 'fck', name: 'Characteristic Compressive Strength of Concrete', siUnit: 'N/mm^2', dimensionalFormula: '[M L^-1 T^-2]' },
      { symbol: 'b', name: 'Width of beam', siUnit: 'mm', dimensionalFormula: '[L]' },
      { symbol: 'd', name: 'Effective depth of beam', siUnit: 'mm', dimensionalFormula: '[L]' },
      { symbol: 'Q', name: 'Moment resistance factor (0.148 for Fe250, 0.138 for Fe415, 0.133 for Fe500)', siUnit: '-', dimensionalFormula: '[1]' }
    ],
    conditionsOfApplicability: [
      'Limit State Design as per IS 456:2000',
      'Compressive stress block is parabolic-rectangular with area 0.36 fck * xu and CG at 0.42 xu from top fiber'
    ],
    codeRef: 'IS 456:2000 Cl. 38.1 & G-1.1',
    difficulty: 'INTERMEDIATE'
  },
  {
    id: 'f-rcc-003',
    name: 'Development Length of Reinforcing Bars',
    formulaLatex: 'L_d = \\frac{\\phi \\sigma_s}{4 \\tau_{bd}} = \\frac{0.87 f_y \\phi}{4 \\tau_{bd}}',
    plainText: 'Ld = (phi * 0.87 * fy) / (4 * tau_bd)',
    subject: 'Reinforced Concrete Structures',
    topic: 'Bond & Anchorage',
    branch: 'Structural & Mechanics',
    variables: [
      { symbol: 'Ld', name: 'Development length', siUnit: 'mm', dimensionalFormula: '[L]' },
      { symbol: 'phi', name: 'Nominal diameter of bar', siUnit: 'mm', dimensionalFormula: '[L]' },
      { symbol: 'fy', name: 'Yield strength of steel', siUnit: 'N/mm^2', dimensionalFormula: '[M L^-1 T^-2]' },
      { symbol: 'tau_bd', name: 'Design bond stress in tension', siUnit: 'N/mm^2', dimensionalFormula: '[M L^-1 T^-2]' }
    ],
    conditionsOfApplicability: [
      'Value of tau_bd increases by 60% for deformed (HYSD) bars conforming to IS 1786',
      'Value of tau_bd increases by 25% for bars in compression'
    ],
    codeRef: 'IS 456:2000 Cl. 26.2.1',
    derivationSummary: 'Force in bar at ultimate stress P = (pi/4)*phi^2 * (0.87*fy) resisted by perimeter bond force F = pi*phi*Ld*tau_bd.',
    difficulty: 'FUNDAMENTAL'
  },

  /* ==========================================================================
     BRANCH 2: GEOTECHNICAL ENGINEERING & FOUNDATIONS
     ========================================================================== */
  {
    id: 'f-geo-001',
    name: 'Soil Phase Relationship (e · S = w · G)',
    formulaLatex: 'e \\cdot S = w \\cdot G',
    plainText: 'e * S = w * G',
    subject: 'Geotechnical Engineering',
    topic: 'Soil Properties & Phase Relationships',
    branch: 'Geotechnical & Foundations',
    variables: [
      { symbol: 'e', name: 'Void ratio (V_v / V_s)', siUnit: '-', dimensionalFormula: '[1]', typicalRange: '0.3 - 1.5' },
      { symbol: 'S', name: 'Degree of saturation (V_w / V_v)', siUnit: '- (0 to 1)', dimensionalFormula: '[1]' },
      { symbol: 'w', name: 'Water content (W_w / W_s)', siUnit: '- or %', dimensionalFormula: '[1]' },
      { symbol: 'G', name: 'Specific gravity of soil solids', siUnit: '-', dimensionalFormula: '[1]', typicalRange: '2.60 - 2.75' }
    ],
    conditionsOfApplicability: [
      'Universal fundamental relationship for any soil mass containing solids, water, and air'
    ],
    derivationSummary: 'From definitions: w = W_w / W_s = (V_w * gamma_w) / (V_s * G * gamma_w) = (V_w / V_s) / G = (S * V_v / V_s) / G = (S * e) / G.',
    difficulty: 'FUNDAMENTAL'
  },
  {
    id: 'f-geo-002',
    name: 'Terzaghi Ultimate Bearing Capacity for Strip Footing',
    formulaLatex: 'q_{ult} = c N_c + q N_q + 0.5 \\gamma B N_\\gamma',
    plainText: 'q_ult = c * Nc + gamma * Df * Nq + 0.5 * gamma * B * Ngamma',
    subject: 'Foundation Engineering',
    topic: 'Shallow Foundations Bearing Capacity',
    branch: 'Geotechnical & Foundations',
    variables: [
      { symbol: 'q_ult', name: 'Ultimate bearing capacity', siUnit: 'kN/m^2 (kPa)', dimensionalFormula: '[M L^-1 T^-2]' },
      { symbol: 'c', name: 'Cohesion of soil', siUnit: 'kN/m^2', dimensionalFormula: '[M L^-1 T^-2]' },
      { symbol: 'q', name: 'Effective surcharge at foundation base (gamma * Df)', siUnit: 'kN/m^2', dimensionalFormula: '[M L^-1 T^-2]' },
      { symbol: 'gamma', name: 'Unit weight of soil below foundation', siUnit: 'kN/m^3', dimensionalFormula: '[M L^-2 T^-2]' },
      { symbol: 'B', name: 'Width of footing', siUnit: 'm', dimensionalFormula: '[L]' },
      { symbol: 'Nc, Nq, Ngamma', name: 'Terzaghi bearing capacity factors (functions of internal friction angle phi)', siUnit: '-', dimensionalFormula: '[1]' }
    ],
    conditionsOfApplicability: [
      'Shallow foundation: Depth D_f <= Width B',
      'General shear failure in dense sand or stiff clay',
      'Base of footing is rough, shear resistance above foundation level is replaced by equivalent surcharge q = gamma * D_f',
      'For circular footing: q_ult = 1.3 c Nc + q Nq + 0.3 gamma B Ngamma',
      'For square footing: q_ult = 1.3 c Nc + q Nq + 0.4 gamma B Ngamma'
    ],
    codeRef: 'IS 6403:1981 Cl. 5.1',
    difficulty: 'INTERMEDIATE'
  },
  {
    id: 'f-geo-003',
    name: 'Rankine Active Earth Pressure Coefficient',
    formulaLatex: 'K_a = \\frac{1 - \\sin\\phi}{1 + \\sin\\phi} = \\tan^2\\left(45^\\circ - \\frac{\\phi}{2}\\right)',
    plainText: 'Ka = (1 - sin(phi)) / (1 + sin(phi)) = tan^2(45 - phi/2)',
    subject: 'Foundation Engineering',
    topic: 'Lateral Earth Pressure',
    branch: 'Geotechnical & Foundations',
    variables: [
      { symbol: 'Ka', name: 'Rankine Active earth pressure coefficient', siUnit: '-', dimensionalFormula: '[1]', typicalRange: '0.25 - 0.35' },
      { symbol: 'phi', name: 'Angle of internal friction of backfill soil', siUnit: 'degrees', dimensionalFormula: '[1]', typicalRange: '28° - 40°' }
    ],
    conditionsOfApplicability: [
      'Retaining wall yields away from the backfill soil',
      'Backfill is cohesionless, homogeneous, dry, and has a horizontal ground surface',
      'Back of the wall is smooth and vertical'
    ],
    derivationSummary: 'From Mohr-Coulomb failure envelope touching the active stress circle with sigma_v = sigma_1 (major) and sigma_h = sigma_3 (minor).',
    difficulty: 'FUNDAMENTAL'
  },

  /* ==========================================================================
     BRANCH 3: WATER RESOURCES & FLUID MECHANICS
     ========================================================================== */
  {
    id: 'f-fluids-001',
    name: 'Manning Uniform Flow Velocity in Open Channels',
    formulaLatex: 'V = \\frac{1}{n} R^{2/3} S_0^{1/2}',
    plainText: 'V = (1 / n) * R^(2/3) * S_0^(1/2)',
    subject: 'Fluid Mechanics & Hydraulics',
    topic: 'Open Channel Flow',
    branch: 'Water Resources & Fluids',
    variables: [
      { symbol: 'V', name: 'Mean flow velocity', siUnit: 'm/s', dimensionalFormula: '[L T^-1]' },
      { symbol: 'n', name: 'Manning roughness coefficient', siUnit: 's/m^(1/3)', dimensionalFormula: '[L^-1/3 T]', typicalRange: '0.012 - 0.035' },
      { symbol: 'R', name: 'Hydraulic radius (Area / Wetted Perimeter = A / P)', siUnit: 'm', dimensionalFormula: '[L]' },
      { symbol: 'S_0', name: 'Longitudinal bed slope', siUnit: '- (dimensionless)', dimensionalFormula: '[1]' }
    ],
    conditionsOfApplicability: [
      'Steady, uniform turbulent flow in open channels',
      'In SI units, the dimensional coefficient is 1.0 (in US customary units it is 1.486)'
    ],
    codeRef: 'IS 10430:2000 Cl. 4.2',
    difficulty: 'FUNDAMENTAL'
  },
  {
    id: 'f-fluids-002',
    name: 'Bélanger Sequent Depth Ratio for Hydraulic Jump',
    formulaLatex: '\\frac{y_2}{y_1} = \\frac{1}{2} \\left(\\sqrt{1 + 8 Fr_1^2} - 1\\right)',
    plainText: 'y2 / y1 = 0.5 * (sqrt(1 + 8 * Fr1^2) - 1)',
    subject: 'Fluid Mechanics & Hydraulics',
    topic: 'Rapidly Varied Flow (Hydraulic Jump)',
    branch: 'Water Resources & Fluids',
    variables: [
      { symbol: 'y1', name: 'Pre-jump initial depth (supercritical)', siUnit: 'm', dimensionalFormula: '[L]' },
      { symbol: 'y2', name: 'Post-jump sequent depth (subcritical)', siUnit: 'm', dimensionalFormula: '[L]' },
      { symbol: 'Fr1', name: 'Upstream Froude number (V1 / sqrt(g*y1)) > 1', siUnit: '-', dimensionalFormula: '[1]' }
    ],
    conditionsOfApplicability: [
      'Horizontal, prismatic rectangular channel',
      'Boundary friction over the short length of the jump is negligible',
      'Hydrostatic pressure distribution before and after the jump'
    ],
    derivationSummary: 'From momentum conservation: Specific force F1 = F2 => q^2/(g*y1) + y1^2/2 = q^2/(g*y2) + y2^2/2.',
    difficulty: 'INTERMEDIATE'
  },
  {
    id: 'f-fluids-003',
    name: 'Head Loss in Hydraulic Jump',
    formulaLatex: '\\Delta E_L = \\frac{(y_2 - y_1)^3}{4 y_1 y_2}',
    plainText: 'Delta_E = (y2 - y1)^3 / (4 * y1 * y2)',
    subject: 'Fluid Mechanics & Hydraulics',
    topic: 'Energy Dissipation in Jumps',
    branch: 'Water Resources & Fluids',
    variables: [
      { symbol: 'Delta_E', name: 'Energy dissipation / Head loss', siUnit: 'm', dimensionalFormula: '[L]' },
      { symbol: 'y1', name: 'Upstream initial depth', siUnit: 'm', dimensionalFormula: '[L]' },
      { symbol: 'y2', name: 'Downstream sequent depth', siUnit: 'm', dimensionalFormula: '[L]' }
    ],
    conditionsOfApplicability: [
      'Horizontal rectangular channel with free surface'
    ],
    difficulty: 'INTERMEDIATE'
  },
  {
    id: 'f-hydro-001',
    name: 'Duty, Delta, and Base Period Relationship',
    formulaLatex: '\\Delta = \\frac{8.64 \\cdot B}{D}',
    plainText: 'Delta = (8.64 * B) / D',
    subject: 'Hydrology & Irrigation',
    topic: 'Crop Water Requirements',
    branch: 'Water Resources & Fluids',
    variables: [
      { symbol: 'Delta', name: 'Total depth of water required by crop during base period', siUnit: 'm', dimensionalFormula: '[L]' },
      { symbol: 'B', name: 'Base period of the crop', siUnit: 'days', dimensionalFormula: '[T]' },
      { symbol: 'D', name: 'Duty of water', siUnit: 'hectares/cumec (ha/m^3/s)', dimensionalFormula: '[L^-1 T]' }
    ],
    conditionsOfApplicability: [
      '1 cumec flowing continuously for B days provides (1 * 86400 * B) m^3 of water spread over D hectares'
    ],
    derivationSummary: 'Volume = 1 m^3/s * 86400 s/day * B days = 86400 B m^3. Area = D ha = D * 10^4 m^2. Delta = Volume/Area = 8.64 B / D meters.',
    difficulty: 'FUNDAMENTAL'
  },

  /* ==========================================================================
     BRANCH 4: ENVIRONMENTAL ENGINEERING
     ========================================================================== */
  {
    id: 'f-env-001',
    name: 'First-Order Biochemical Oxygen Demand (BOD) Kinetics',
    formulaLatex: 'y_t = L_0 \\left(1 - e^{-k_e t}\\right) = L_0 \\left(1 - 10^{-K_D t}\\right)',
    plainText: 'y_t = L_0 * (1 - 10^(-K_D * t))',
    subject: 'Environmental Engineering',
    topic: 'Wastewater Quality & BOD',
    branch: 'Environmental & Sanitary',
    variables: [
      { symbol: 'y_t', name: 'BOD exerted at time t (e.g. 5 days)', siUnit: 'mg/L (g/m^3)', dimensionalFormula: '[M L^-3]' },
      { symbol: 'L_0', name: 'Ultimate carbonaceous BOD (at t -> inf)', siUnit: 'mg/L', dimensionalFormula: '[M L^-3]' },
      { symbol: 'K_D', name: 'Deoxygenation rate constant (base 10)', siUnit: 'day^-1', dimensionalFormula: '[T^-1]', typicalRange: '0.10 day^-1 at 20°C' },
      { symbol: 't', name: 'Incubation period (typically 5 days)', siUnit: 'days', dimensionalFormula: '[T]' }
    ],
    conditionsOfApplicability: [
      'Applies to stage 1 carbonaceous BOD exertion before nitrification kicks in (typically <= 8-10 days)'
    ],
    standardConstants: [
      { symbol: 'K_20', name: 'Standard base-10 rate constant at 20°C', value: '0.10', unit: 'day^-1' },
      { symbol: 'theta_arrhenius', name: 'Temperature coefficient for K_T = K_20 * theta^(T-20)', value: '1.047', unit: '-' }
    ],
    codeRef: 'CPHEEO Wastewater Manual Ch. 3',
    difficulty: 'FUNDAMENTAL'
  },

  /* ==========================================================================
     BRANCH 5: TRANSPORTATION & HIGHWAY ENGINEERING
     ========================================================================== */
  {
    id: 'f-trans-001',
    name: 'Stopping Sight Distance (SSD) on Level Ground',
    formulaLatex: 'SSD = 0.278 V t_r + \\frac{V^2}{254 f}',
    plainText: 'SSD = 0.278 * V * t_r + V^2 / (254 * f)',
    subject: 'Transportation Engineering',
    topic: 'Highway Geometric Design',
    branch: 'Transportation & Highways',
    variables: [
      { symbol: 'SSD', name: 'Stopping sight distance', siUnit: 'm', dimensionalFormula: '[L]' },
      { symbol: 'V', name: 'Design speed', siUnit: 'km/h', dimensionalFormula: '[L T^-1]' },
      { symbol: 't_r', name: 'Perception-reaction time (PIEV theory = 2.5 seconds per IRC:73)', siUnit: 's', dimensionalFormula: '[T]' },
      { symbol: 'f', name: 'Coefficient of longitudinal friction between tyre and road', siUnit: '-', dimensionalFormula: '[1]', typicalRange: '0.35 - 0.40' }
    ],
    conditionsOfApplicability: [
      'Two-way traffic on single lane road requires 2 * SSD',
      'For longitudinal gradient (+n% or -n%): SSD = 0.278 V t_r + V^2 / [254 (f ± 0.01 n)]'
    ],
    standardConstants: [
      { symbol: 't_IRC', name: 'IRC Reaction Time', value: '2.5', unit: 's' }
    ],
    codeRef: 'IRC:73-1980 Cl. 6.2 & IRC:86-1983',
    difficulty: 'FUNDAMENTAL'
  },
  {
    id: 'f-trans-002',
    name: 'Super-Elevation Equation (Horizontal Curves)',
    formulaLatex: 'e + f = \\frac{v^2}{g R} = \\frac{V^2}{127 R}',
    plainText: 'e + f = V^2 / (127 * R)',
    subject: 'Transportation Engineering',
    topic: 'Highway Geometric Design',
    branch: 'Transportation & Highways',
    variables: [
      { symbol: 'e', name: 'Rate of super-elevation (tan theta)', siUnit: '-', dimensionalFormula: '[1]' },
      { symbol: 'f', name: 'Coefficient of lateral friction (max 0.15 per IRC)', siUnit: '-', dimensionalFormula: '[1]' },
      { symbol: 'V', name: 'Design speed in km/h', siUnit: 'km/h', dimensionalFormula: '[L T^-1]' },
      { symbol: 'R', name: 'Radius of horizontal circular curve', siUnit: 'm', dimensionalFormula: '[L]' }
    ],
    conditionsOfApplicability: [
      'Maximum super-elevation as per IRC:73: 7% (0.07) for plain & rolling terrain; 10% (0.10) for hilly roads bound with snow',
      'Design of super-elevation for mixed traffic (IRC rule): Neglect lateral friction (f=0) and design for 75% of design speed: e = (0.75 V)^2 / (127 R) = V^2 / (225 R)'
    ],
    codeRef: 'IRC:73-1980 Cl. 6.3',
    difficulty: 'FUNDAMENTAL'
  },

  /* ==========================================================================
     BRANCH 6: GEOMATICS, SURVEYING & CPM/PERT
     ========================================================================== */
  {
    id: 'f-surv-001',
    name: 'Combined Curvature and Refraction Correction in Leveling',
    formulaLatex: 'C_{comb} = -0.0673 \\cdot d^2',
    plainText: 'C_comb = -0.0673 * d^2 (in meters, for d in kilometers)',
    subject: 'Surveying & Geomatics',
    topic: 'Leveling & Curvature Corrections',
    branch: 'Geomatics, Materials & Management',
    variables: [
      { symbol: 'C_comb', name: 'Combined correction (always subtractive from staff reading)', siUnit: 'm', dimensionalFormula: '[L]' },
      { symbol: 'd', name: 'Sight distance', siUnit: 'km', dimensionalFormula: '[L]' }
    ],
    conditionsOfApplicability: [
      'Curvature correction C_c = -d^2 / (2R) = -0.0785 d^2 (subtractive)',
      'Refraction correction C_r = +1/7 C_c = +0.0112 d^2 (additive)',
      'Combined correction C_comb = C_c + C_r = -0.0673 d^2 meters'
    ],
    codeRef: 'Survey of India Leveling Manual',
    difficulty: 'FUNDAMENTAL'
  },
  {
    id: 'f-cpm-001',
    name: 'PERT Expected Activity Duration & Variance',
    formulaLatex: 't_e = \\frac{t_o + 4 t_m + t_p}{6} \\quad ; \\quad \\sigma^2 = \\left(\\frac{t_p - t_o}{6}\\right)^2',
    plainText: 'te = (to + 4*tm + tp) / 6 ; sigma^2 = ((tp - to) / 6)^2',
    subject: 'Construction Management & Estimating',
    topic: 'Network Scheduling (PERT)',
    branch: 'Geomatics, Materials & Management',
    variables: [
      { symbol: 'te', name: 'Expected / Mean activity duration', siUnit: 'days or hours', dimensionalFormula: '[T]' },
      { symbol: 'to', name: 'Optimistic time estimate (best possible outcome)', siUnit: 'days', dimensionalFormula: '[T]' },
      { symbol: 'tm', name: 'Most likely time estimate (modal value)', siUnit: 'days', dimensionalFormula: '[T]' },
      { symbol: 'tp', name: 'Pessimistic time estimate (worst possible outcome)', siUnit: 'days', dimensionalFormula: '[T]' },
      { symbol: 'sigma', name: 'Standard deviation of activity duration', siUnit: 'days', dimensionalFormula: '[T]' }
    ],
    conditionsOfApplicability: [
      'Follows Beta distribution (mean = (to + 4tm + tp)/6 and standard deviation = (tp - to)/6)'
    ],
    difficulty: 'FUNDAMENTAL'
  },

  /* ==========================================================================
     BHAVIKATTI: BASIC CIVIL ENGINEERING & MATERIALS FORMULAS
     ========================================================================== */
  {
    id: 'f-bhav-001',
    name: 'Rankine Minimum Depth of Foundation',
    formulaLatex: 'H_{min} = \\frac{p}{w} \\left(\\frac{1 - \\sin\\phi}{1 + \\sin\\phi}\\right)^2',
    plainText: 'H_min = (p / w) * ((1 - sin(phi)) / (1 + sin(phi)))^2',
    subject: 'Foundation Engineering',
    topic: 'Foundation Dimensions & Depth',
    branch: 'Geotechnical & Foundations',
    variables: [
      { symbol: 'H_min', name: 'Minimum depth of foundation', siUnit: 'm', dimensionalFormula: '[L]', typicalRange: 'min 0.9 m' },
      { symbol: 'p', name: 'Safe bearing capacity of soil (SBC)', siUnit: 'kN/m^2', dimensionalFormula: '[M L^-1 T^-2]' },
      { symbol: 'w', name: 'Unit weight of soil (gamma)', siUnit: 'kN/m^3', dimensionalFormula: '[M L^-2 T^-2]' },
      { symbol: 'phi', name: 'Angle of repose / internal friction of soil', siUnit: 'degrees', dimensionalFormula: '[1]' }
    ],
    conditionsOfApplicability: [
      'Applicable for cohesionless soils. In practice, minimum depth is never kept less than 0.9 m below ground level.'
    ],
    codeRef: 'IS 1904:2021 & Bhavikatti Ch. 7',
    difficulty: 'FUNDAMENTAL'
  },
  {
    id: 'f-bhav-002',
    name: 'Tape Pull (Tension) Correction',
    formulaLatex: 'C_p = \\frac{(P - P_0) L}{A E}',
    plainText: 'Cp = ((P - P0) * L) / (A * E)',
    subject: 'Surveying & Geomatics',
    topic: 'Tape Corrections in Chaining',
    branch: 'Geomatics, Materials & Management',
    variables: [
      { symbol: 'Cp', name: 'Pull correction (+ve if P > P0, -ve if P < P0)', siUnit: 'm', dimensionalFormula: '[L]' },
      { symbol: 'P', name: 'Pull applied in field during measurement', siUnit: 'N', dimensionalFormula: '[M L T^-2]' },
      { symbol: 'P0', name: 'Standard pull at which tape was calibrated', siUnit: 'N', dimensionalFormula: '[M L T^-2]' },
      { symbol: 'L', name: 'Measured length', siUnit: 'm', dimensionalFormula: '[L]' },
      { symbol: 'A', name: 'Cross-sectional area of tape', siUnit: 'm^2 or mm^2', dimensionalFormula: '[L^2]' },
      { symbol: 'E', name: 'Young\'s modulus of tape material', siUnit: 'N/m^2 or N/mm^2', dimensionalFormula: '[M L^-1 T^-2]' }
    ],
    conditionsOfApplicability: [
      'Steel and invar tapes subjected to tension different from standardization pull'
    ],
    codeRef: 'Bhavikatti Ch. 12',
    difficulty: 'FUNDAMENTAL'
  },
  {
    id: 'f-bhav-003',
    name: 'Tape Temperature Correction',
    formulaLatex: 'C_t = L \\cdot \\alpha \\cdot (T_m - T_0)',
    plainText: 'Ct = L * alpha * (Tm - T0)',
    subject: 'Surveying & Geomatics',
    topic: 'Tape Corrections in Chaining',
    branch: 'Geomatics, Materials & Management',
    variables: [
      { symbol: 'Ct', name: 'Temperature correction (+ve if Tm > T0, -ve if Tm < T0)', siUnit: 'm', dimensionalFormula: '[L]' },
      { symbol: 'L', name: 'Measured length', siUnit: 'm', dimensionalFormula: '[L]' },
      { symbol: 'alpha', name: 'Coefficient of thermal expansion of tape material', siUnit: '/°C', dimensionalFormula: '[Theta^-1]' },
      { symbol: 'Tm', name: 'Mean field temperature during measurement', siUnit: '°C', dimensionalFormula: '[Theta]' },
      { symbol: 'T0', name: 'Standardization temperature', siUnit: '°C', dimensionalFormula: '[Theta]' }
    ],
    conditionsOfApplicability: [
      'Steel tape alpha ≈ 1.12 x 10^-5 /°C; Invar tape alpha ≈ 1.2 x 10^-6 /°C (10x lower)'
    ],
    codeRef: 'Bhavikatti Ch. 12',
    difficulty: 'FUNDAMENTAL'
  },
  {
    id: 'f-bhav-004',
    name: 'Tape Slope Correction',
    formulaLatex: 'C_{sl} = -\\frac{h^2}{2 L} = -L(1 - \\cos\\theta)',
    plainText: 'C_sl = - (h^2) / (2 * L) = - L * (1 - cos(theta))',
    subject: 'Surveying & Geomatics',
    topic: 'Tape Corrections in Chaining',
    branch: 'Geomatics, Materials & Management',
    variables: [
      { symbol: 'C_sl', name: 'Slope correction (always subtractive / negative)', siUnit: 'm', dimensionalFormula: '[L]' },
      { symbol: 'h', name: 'Elevation difference between the two ends', siUnit: 'm', dimensionalFormula: '[L]' },
      { symbol: 'L', name: 'Measured sloping distance', siUnit: 'm', dimensionalFormula: '[L]' },
      { symbol: 'theta', name: 'Angle of slope with horizontal', siUnit: 'degrees', dimensionalFormula: '[1]' }
    ],
    conditionsOfApplicability: [
      'Measurement of horizontal distance along sloping ground. Always negative because sloping length > horizontal length.'
    ],
    codeRef: 'Bhavikatti Ch. 12',
    difficulty: 'FUNDAMENTAL'
  },
  {
    id: 'f-bhav-005',
    name: 'Tape Sag Correction',
    formulaLatex: 'C_s = -\\frac{1}{24} \\left(\\frac{W}{P}\\right)^2 L = -\\frac{w^2 L^3}{24 P^2}',
    plainText: 'Cs = - (1 / 24) * (W / P)^2 * L',
    subject: 'Surveying & Geomatics',
    topic: 'Tape Corrections in Chaining',
    branch: 'Geomatics, Materials & Management',
    variables: [
      { symbol: 'Cs', name: 'Sag correction (always subtractive / negative)', siUnit: 'm', dimensionalFormula: '[L]' },
      { symbol: 'W', name: 'Total weight of tape suspended between supports (W = w * L)', siUnit: 'N', dimensionalFormula: '[M L T^-2]' },
      { symbol: 'P', name: 'Applied pull in field', siUnit: 'N', dimensionalFormula: '[M L T^-2]' },
      { symbol: 'L', name: 'Span length between supports', siUnit: 'm', dimensionalFormula: '[L]' }
    ],
    conditionsOfApplicability: [
      'When tape is suspended between end supports forming a catenary. If suspended in n equal spans: Cs = n * (1/24) * (W_span/P)^2 * L_span.'
    ],
    codeRef: 'Bhavikatti Ch. 12',
    difficulty: 'INTERMEDIATE'
  },
  {
    id: 'f-bhav-006',
    name: 'Normal Tension Formula (Pull Balances Sag)',
    formulaLatex: 'P_n = \\frac{0.204 W \\sqrt{A E}}{\\sqrt{P_n - P_0}}',
    plainText: 'Pn = (0.204 * W * sqrt(A * E)) / sqrt(Pn - P0)',
    subject: 'Surveying & Geomatics',
    topic: 'Tape Corrections in Chaining',
    branch: 'Geomatics, Materials & Management',
    variables: [
      { symbol: 'Pn', name: 'Normal tension (pull at which Cp = Cs, net error = 0)', siUnit: 'N', dimensionalFormula: '[M L T^-2]' },
      { symbol: 'W', name: 'Total weight of tape', siUnit: 'N', dimensionalFormula: '[M L T^-2]' },
      { symbol: 'A', name: 'Cross-sectional area of tape', siUnit: 'm^2', dimensionalFormula: '[L^2]' },
      { symbol: 'E', name: 'Young\'s modulus of tape', siUnit: 'N/m^2', dimensionalFormula: '[M L^-1 T^-2]' },
      { symbol: 'P0', name: 'Standard pull', siUnit: 'N', dimensionalFormula: '[M L T^-2]' }
    ],
    conditionsOfApplicability: [
      'Equating pull correction Cp to sag correction Cs so they neutralize each other. Solved by trial and error.'
    ],
    codeRef: 'Bhavikatti Ch. 12 Eq. 12.9',
    difficulty: 'ADVANCED'
  },
  {
    id: 'f-bhav-007',
    name: 'Reciprocal Leveling True Elevation Difference',
    formulaLatex: 'H = \\frac{(h_a - h_b) + (h_a\' - h_b\')}{2}',
    plainText: 'H = ((ha - hb) + (ha\' - hb\')) / 2',
    subject: 'Surveying & Geomatics',
    topic: 'Leveling Across Obstacles',
    branch: 'Geomatics, Materials & Management',
    variables: [
      { symbol: 'H', name: 'True difference in elevation between stations A and B', siUnit: 'm', dimensionalFormula: '[L]' },
      { symbol: 'ha', name: 'Staff reading on A with level placed near A', siUnit: 'm', dimensionalFormula: '[L]' },
      { symbol: 'hb', name: 'Staff reading on B with level placed near A', siUnit: 'm', dimensionalFormula: '[L]' },
      { symbol: 'ha\'', name: 'Staff reading on A with level placed near B', siUnit: 'm', dimensionalFormula: '[L]' },
      { symbol: 'hb\'', name: 'Staff reading on B with level placed near B', siUnit: 'm', dimensionalFormula: '[L]' }
    ],
    conditionsOfApplicability: [
      'Eliminates: 1. Collimation error of instrument, 2. Earth curvature error, 3. Atmospheric refraction error.'
    ],
    codeRef: 'Bhavikatti Ch. 15 Eq. 15.1',
    difficulty: 'INTERMEDIATE'
  },
  {
    id: 'f-bhav-008',
    name: 'Simpson\'s 1/3rd Rule for Irregular Areas',
    formulaLatex: 'A = \\frac{d}{3} \\left[(O_0 + O_n) + 4\\sum O_{odd} + 2\\sum O_{even}\\right]',
    plainText: 'A = (d / 3) * [(O_0 + O_n) + 4 * (O1 + O3 + ...) + 2 * (O2 + O4 + ...)]',
    subject: 'Surveying & Geomatics',
    topic: 'Areas and Volumes Computation',
    branch: 'Geomatics, Materials & Management',
    variables: [
      { symbol: 'A', name: 'Total enclosed boundary area', siUnit: 'm^2', dimensionalFormula: '[L^2]' },
      { symbol: 'd', name: 'Common regular interval between offset ordinates', siUnit: 'm', dimensionalFormula: '[L]' },
      { symbol: 'O0, On', name: 'First and last offset ordinates', siUnit: 'm', dimensionalFormula: '[L]' },
      { symbol: 'O_odd', name: 'Odd-numbered ordinates (O1, O3, O5, ...)', siUnit: 'm', dimensionalFormula: '[L]' },
      { symbol: 'O_even', name: 'Even-numbered ordinates (O2, O4, O6, ...)', siUnit: 'm', dimensionalFormula: '[L]' }
    ],
    conditionsOfApplicability: [
      'Requires an ODD number of ordinates (EVEN number of segments). Boundary curve assumed parabolic.'
    ],
    codeRef: 'Bhavikatti Ch. 18 Eq. 18.6',
    difficulty: 'FUNDAMENTAL'
  },
  {
    id: 'f-bhav-009',
    name: 'Amsler Planimeter Area Equation',
    formulaLatex: 'A = M \\cdot (F - I \\pm 10 N + C)',
    plainText: 'A = M * (F - I + 10*N + C)',
    subject: 'Surveying & Geomatics',
    topic: 'Planimeter Area Measurement',
    branch: 'Geomatics, Materials & Management',
    variables: [
      { symbol: 'A', name: 'Area of the plan / map', siUnit: 'cm^2 or m^2', dimensionalFormula: '[L^2]' },
      { symbol: 'M', name: 'Multiplying constant (area per revolution of roller, typically 100 cm^2)', siUnit: 'cm^2', dimensionalFormula: '[L^2]' },
      { symbol: 'F', name: 'Final reading of the integrating disc, drum and vernier', siUnit: '-', dimensionalFormula: '[1]' },
      { symbol: 'I', name: 'Initial reading of planimeter', siUnit: '-', dimensionalFormula: '[1]' },
      { symbol: 'N', name: 'Number of completed revolutions of dial disc (+ve if clockwise, -ve if anticlockwise)', siUnit: '-', dimensionalFormula: '[1]' },
      { symbol: 'C', name: 'Zero circle constant (added ONLY when anchor point is placed INSIDE the figure)', siUnit: '-', dimensionalFormula: '[1]' }
    ],
    conditionsOfApplicability: [
      'Tracer moved clockwise around boundary. Constant C is zero when anchor point is outside the boundary.'
    ],
    codeRef: 'Bhavikatti Ch. 18 Eq. 18.7',
    difficulty: 'INTERMEDIATE'
  },
  {
    id: 'f-bhav-010',
    name: 'Prismoidal Formula for Earthwork Volume',
    formulaLatex: 'V = \\frac{d}{3} \\left[(A_0 + A_n) + 4\\sum A_{odd} + 2\\sum A_{even}\\right]',
    plainText: 'V = (d / 3) * [(A_0 + A_n) + 4 * (A1 + A3 + ...) + 2 * (A2 + A4 + ...)]',
    subject: 'Surveying & Geomatics',
    topic: 'Volume of Earthwork',
    branch: 'Geomatics, Materials & Management',
    variables: [
      { symbol: 'V', name: 'Volume of earthwork (cut or fill)', siUnit: 'm^3', dimensionalFormula: '[L^3]' },
      { symbol: 'd', name: 'Distance between consecutive cross-sections', siUnit: 'm', dimensionalFormula: '[L]' },
      { symbol: 'A0, An', name: 'Cross-sectional areas at first and last stations', siUnit: 'm^2', dimensionalFormula: '[L^2]' },
      { symbol: 'A_odd', name: 'Cross-sectional areas at odd stations (A1, A3, ...)', siUnit: 'm^2', dimensionalFormula: '[L^2]' },
      { symbol: 'A_even', name: 'Cross-sectional areas at even stations (A2, A4, ...)', siUnit: 'm^2', dimensionalFormula: '[L^2]' }
    ],
    conditionsOfApplicability: [
      'Number of segments n must be even. More accurate than trapezoidal formula because prismoidal assumes parabolic variation.'
    ],
    codeRef: 'Bhavikatti Ch. 18 Eq. 18.11',
    difficulty: 'FUNDAMENTAL'
  },
  {
    id: 'f-bhav-011',
    name: 'Earthwork Volume from Spot Levels (Borrow Pit)',
    formulaLatex: 'V = \\frac{A}{4} \\left(\\sum h_1 + 2\\sum h_2 + 3\\sum h_3 + 4\\sum h_4\\right)',
    plainText: 'V = (A / 4) * (Sigma h1 + 2*Sigma h2 + 3*Sigma h3 + 4*Sigma h4)',
    subject: 'Surveying & Geomatics',
    topic: 'Borrow Pit & Basement Excavation',
    branch: 'Geomatics, Materials & Management',
    variables: [
      { symbol: 'V', name: 'Total volume of excavation', siUnit: 'm^3', dimensionalFormula: '[L^3]' },
      { symbol: 'A', name: 'Plan area of a single grid square/rectangle', siUnit: 'm^2', dimensionalFormula: '[L^2]' },
      { symbol: 'h1', name: 'Depths of excavation occurring only once (corner of outer boundary)', siUnit: 'm', dimensionalFormula: '[L]' },
      { symbol: 'h2', name: 'Depths of excavation shared by 2 adjacent grid squares', siUnit: 'm', dimensionalFormula: '[L]' },
      { symbol: 'h3', name: 'Depths of excavation shared by 3 grid squares', siUnit: 'm', dimensionalFormula: '[L]' },
      { symbol: 'h4', name: 'Depths of excavation common to 4 meeting grid squares', siUnit: 'm', dimensionalFormula: '[L]' }
    ],
    conditionsOfApplicability: [
      'Grid of uniform rectangular or square meshes. For triangular grids: V = (A/3) * (Sigma h1 + 2 Sigma h2 + 3 Sigma h3 + 6 Sigma h6).'
    ],
    codeRef: 'Bhavikatti Ch. 18 Eq. 18.12',
    difficulty: 'INTERMEDIATE'
  },
  {
    id: 'f-bhav-012',
    name: 'Staircase Rise and Tread Empirical Comfort Rule',
    formulaLatex: '2 R + T = 550 \\text{ to } 600 \\text{ mm}',
    plainText: '2*R + T = 550 to 600 mm (Rise R: 150-175 mm, Tread T: 250-300 mm)',
    subject: 'Building Construction & Planning',
    topic: 'Stairs & Vertical Circulation',
    branch: 'Geomatics, Materials & Management',
    variables: [
      { symbol: 'R', name: 'Rise of step (vertical height)', siUnit: 'mm', dimensionalFormula: '[L]', typicalRange: '150 - 175 mm (Residential), 120 - 150 mm (Public)' },
      { symbol: 'T', name: 'Tread / Going of step (horizontal depth)', siUnit: 'mm', dimensionalFormula: '[L]', typicalRange: '250 mm (Residential), 270 - 300 mm (Public)' }
    ],
    conditionsOfApplicability: [
      'Max steps per flight: 12 to 14, min steps per flight: 3. Headroom clearance >= 2.1 m. Handrail height: 850 to 900 mm.'
    ],
    codeRef: 'NBC:2016 & Bhavikatti Ch. 8 Sec. 8.11',
    difficulty: 'FUNDAMENTAL'
  },
  {
    id: 'f-bhav-013',
    name: 'Tacheometric Distance Equation',
    formulaLatex: 'D = k \\cdot s + c = \\left(\\frac{f}{i}\\right) s + (f + d)',
    plainText: 'D = k * s + c = (f / i) * s + (f + d)',
    subject: 'Surveying & Geomatics',
    topic: 'Tacheometry & Optical Distance',
    branch: 'Geomatics, Materials & Management',
    variables: [
      { symbol: 'D', name: 'Horizontal distance from instrument station to staff', siUnit: 'm', dimensionalFormula: '[L]' },
      { symbol: 'k', name: 'Multiplying constant (f / i = 100 for anallactic lens)', siUnit: '-', dimensionalFormula: '[1]' },
      { symbol: 's', name: 'Staff intercept (top hair reading minus bottom hair reading)', siUnit: 'm', dimensionalFormula: '[L]' },
      { symbol: 'c', name: 'Additive constant (f + d = 0 for anallactic lens)', siUnit: 'm', dimensionalFormula: '[L]' }
    ],
    conditionsOfApplicability: [
      'Horizontal line of sight with staff held vertical. For inclined line of sight at angle theta: D = k * s * cos^2(theta) + c * cos(theta).'
    ],
    codeRef: 'Bhavikatti Ch. 12 & 16',
    difficulty: 'FUNDAMENTAL'
  }
];

