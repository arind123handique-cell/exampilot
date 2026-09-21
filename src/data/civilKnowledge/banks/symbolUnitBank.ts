import type { SymbolUnitItem } from '../../../types/civilKnowledge';

export const CIVIL_SYMBOL_UNIT_BANK: SymbolUnitItem[] = [
  {
    id: 'sym-001',
    symbol: 'sigma',
    name: 'Normal Stress (Direct / Bending)',
    siUnit: 'N/m^2 (Pa) or MPa (N/mm^2)',
    dimensionalFormula: '[M L^-1 T^-2]',
    subject: 'Strength of Materials',
    typicalContext: 'sigma = P/A (direct) or sigma = M*y / I (bending)'
  },
  {
    id: 'sym-002',
    symbol: 'tau',
    name: 'Shear Stress (Torsional / Transverse)',
    siUnit: 'N/m^2 (Pa) or MPa',
    dimensionalFormula: '[M L^-1 T^-2]',
    subject: 'Strength of Materials',
    typicalContext: 'tau = T*r / J (torsion) or tau = V*A*y_bar / (I*b) (beam shear)'
  },
  {
    id: 'sym-003',
    symbol: 'E',
    name: 'Young\'s Modulus of Elasticity',
    siUnit: 'N/m^2 (Pa) or GPa',
    dimensionalFormula: '[M L^-1 T^-2]',
    subject: 'Strength of Materials',
    typicalContext: 'E_steel = 200 GPa = 2 x 10^5 MPa; E_concrete = 5000 sqrt(fck) MPa'
  },
  {
    id: 'sym-004',
    symbol: 'G',
    name: 'Modulus of Rigidity / Shear Modulus',
    siUnit: 'N/m^2 (Pa) or GPa',
    dimensionalFormula: '[M L^-1 T^-2]',
    subject: 'Strength of Materials',
    typicalContext: 'G = E / [2 (1 + nu)]; for steel G ≈ 77 - 80 GPa'
  },
  {
    id: 'sym-005',
    symbol: 'K',
    name: 'Bulk Modulus of Elasticity',
    siUnit: 'N/m^2 (Pa) or GPa',
    dimensionalFormula: '[M L^-1 T^-2]',
    subject: 'Strength of Materials',
    typicalContext: 'K = E / [3 (1 - 2 nu)]; volumetric stress over volumetric strain'
  },
  {
    id: 'sym-006',
    symbol: 'I',
    name: 'Area Moment of Inertia (Second Moment of Area)',
    siUnit: 'm^4 or mm^4',
    dimensionalFormula: '[L^4]',
    subject: 'Structural Analysis',
    typicalContext: 'I_rect = b*d^3 / 12 (about centroidal neutral axis)'
  },
  {
    id: 'sym-007',
    symbol: 'Z',
    name: 'Section Modulus',
    siUnit: 'm^3 or mm^3',
    dimensionalFormula: '[L^3]',
    subject: 'Strength of Materials',
    typicalContext: 'Z = I / y_max; M_capacity = Z * sigma_allowable'
  },
  {
    id: 'sym-008',
    symbol: 'k',
    name: 'Coefficient of Permeability (Hydraulic Conductivity)',
    siUnit: 'm/s or cm/s',
    dimensionalFormula: '[L T^-1]',
    subject: 'Geotechnical Engineering',
    typicalContext: 'Darcy\'s law: v = k * i; coarse gravel k > 1 cm/s, clean clay k < 10^-7 cm/s'
  },
  {
    id: 'sym-009',
    symbol: 'C_v',
    name: 'Coefficient of Consolidation',
    siUnit: 'm^2/s or cm^2/s',
    dimensionalFormula: '[L^2 T^-1]',
    subject: 'Geotechnical Engineering',
    typicalContext: 'Terzaghi 1D consolidation: C_v = k / (m_v * gamma_w); Time factor T_v = C_v * t / d^2'
  },
  {
    id: 'sym-010',
    symbol: 'mu',
    name: 'Dynamic Viscosity (Absolute Viscosity)',
    siUnit: 'Pa·s (N·s/m^2) or Poise (1 Poise = 0.1 Pa·s)',
    dimensionalFormula: '[M L^-1 T^-1]',
    subject: 'Fluid Mechanics & Hydraulics',
    typicalContext: 'Newton\'s law of viscosity: tau = mu * (du/dy)'
  },
  {
    id: 'sym-011',
    symbol: 'nu_visc',
    name: 'Kinematic Viscosity',
    siUnit: 'm^2/s or Stoke (1 Stoke = 10^-4 m^2/s)',
    dimensionalFormula: '[L^2 T^-1]',
    subject: 'Fluid Mechanics & Hydraulics',
    typicalContext: 'nu = mu / rho; Reynolds number Re = V*D / nu'
  },
  {
    id: 'sym-012',
    symbol: 'n',
    name: 'Manning\'s Roughness Coefficient',
    siUnit: 's / m^(1/3)',
    dimensionalFormula: '[L^-1/3 T]',
    subject: 'Fluid Mechanics & Hydraulics',
    typicalContext: 'V = (1/n) * R^(2/3) * S^(1/2); smooth concrete n ≈ 0.013, natural river n ≈ 0.035'
  },
  {
    id: 'sym-013',
    symbol: 'C_chezy',
    name: 'Chezy\'s Friction Coefficient',
    siUnit: 'm^(1/2) / s',
    dimensionalFormula: '[L^1/2 T^-1]',
    subject: 'Fluid Mechanics & Hydraulics',
    typicalContext: 'V = C * sqrt(R * S); C = (1/n) * R^(1/6)'
  },
  {
    id: 'sym-014',
    symbol: 'q_unit',
    name: 'Discharge per Unit Width (Unit Flow)',
    siUnit: 'm^2 / s (m^3/s per m width)',
    dimensionalFormula: '[L^2 T^-1]',
    subject: 'Fluid Mechanics & Hydraulics',
    typicalContext: 'Critical depth y_c = (q^2 / g)^(1/3)'
  },
  {
    id: 'sym-015',
    symbol: 'k_modulus',
    name: 'Modulus of Subgrade Reaction',
    siUnit: 'MN/m^3 or N/cm^3 (kg/cm^3)',
    dimensionalFormula: '[M L^-2 T^-2]',
    subject: 'Transportation Engineering',
    typicalContext: 'Westergaard rigid pavement slab design: k = p / delta (from 75 cm dia plate load test)'
  },

  /* ==========================================================================
     BHAVIKATTI: BASIC CIVIL ENGINEERING SYMBOLS & UNITS
     ========================================================================== */
  {
    id: 'sym-bhav-001',
    symbol: 'RF',
    name: 'Representative Fraction',
    siUnit: 'Dimensionless ratio (e.g. 1:50,000)',
    dimensionalFormula: '[1]',
    subject: 'Surveying & Geomatics',
    typicalContext: 'RF = Map Distance / Ground Distance; 1 cm = 1 km -> RF = 1 / 100,000'
  },
  {
    id: 'sym-bhav-002',
    symbol: 'HI',
    name: 'Height of Instrument (Collimation Level)',
    siUnit: 'm (meters above MSL)',
    dimensionalFormula: '[L]',
    subject: 'Surveying & Geomatics',
    typicalContext: 'HI = RL of Benchmark + Backsight; ground RL = HI - Staff Reading'
  },
  {
    id: 'sym-bhav-003',
    symbol: 'K_a',
    name: 'Rankine Active Earth Pressure Coefficient',
    siUnit: 'Dimensionless ratio',
    dimensionalFormula: '[1]',
    subject: 'Foundation Engineering',
    typicalContext: 'Ka = (1 - sin phi) / (1 + sin phi); Rankine foundation depth H_min = (p/w) * Ka^2'
  },
  {
    id: 'sym-bhav-004',
    symbol: 'A_h',
    name: 'Design Horizontal Seismic Coefficient',
    siUnit: 'Dimensionless coefficient',
    dimensionalFormula: '[1]',
    subject: 'Building Construction & Planning',
    typicalContext: 'IS 1893:2016: Ah = (Z / 2) * (I / R) * (Sa / g); governs earthquake base shear'
  },
  {
    id: 'sym-bhav-005',
    symbol: 'V_B',
    name: 'Total Design Seismic Base Shear',
    siUnit: 'kN or N',
    dimensionalFormula: '[M L T^-2]',
    subject: 'Building Construction & Planning',
    typicalContext: 'VB = Ah * W; total lateral inertia force acting at structure base during an earthquake'
  },
  {
    id: 'sym-bhav-006',
    symbol: 'CI',
    name: 'Contour Interval',
    siUnit: 'm (meters)',
    dimensionalFormula: '[L]',
    subject: 'Surveying & Geomatics',
    typicalContext: 'Constant vertical distance between successive contours on a topographic map'
  }
];
