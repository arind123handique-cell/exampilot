# -*- coding: utf-8 -*-
"""
Full generation script for 100 Civil Engineering Questions.
"""
import json
import os

# We'll read scripts/generate_civil_100.py questions first
from generate_civil_100 import civil_questions

remaining_civil = [
    # Fluid Mechanics & Hydraulics (53 - 64)
    {
        "qNum": 53,
        "subject": "Fluid Mechanics & Hydraulics",
        "topic": "Fluid Properties",
        "subtopic": "Kinematic Viscosity Units",
        "stem": "The CGS unit of kinematic viscosity is 'Stokes'. 1 Stokes is equal to:",
        "options": ["1 cm²/s (or 10⁻⁴ m²/s)", "1 m²/s", "10⁻³ m²/s", "1 N·s/m²"],
        "correct": "A",
        "formula": "1 Stokes = 1 cm²/s = 10⁻⁴ m²/s; Kinematic viscosity ν = μ / ρ",
        "explanation": "Kinematic viscosity is dynamic viscosity divided by fluid density (ν = μ / ρ) with dimensions [L² T⁻¹]. In SI units it is m²/s, and in CGS units 1 cm²/s = 1 Stokes = 10⁻⁴ m²/s. 1 Poise = 0.1 N·s/m² = 0.1 Pa·s.",
        "ref": "Fluid Mechanics by Frank M. White",
        "diff": "EASY",
        "year": 2024
    },
    {
        "qNum": 54,
        "subject": "Fluid Mechanics & Hydraulics",
        "topic": "Hydrostatics",
        "subtopic": "Center of Pressure",
        "stem": "The center of pressure for a vertical rectangular plane surface of width b and depth d submerged vertically in water with its top edge in the free surface lies at a depth of:",
        "options": ["d / 2", "2d / 3", "3d / 4", "d / 3"],
        "correct": "B",
        "formula": "hc = h̄ + IG / (A · h̄) = d/2 + (b d³ / 12) / ((b d) · (d/2)) = d/2 + d/6 = 2d/3",
        "explanation": "From the hydrostatic pressure formula for vertical submerged surfaces, hc = h̄ + IG/(A·h̄). Substituting h̄ = d/2, IG = bd³/12, and A = bd gives hc = d/2 + d/6 = 2/3 d.",
        "ref": "Hydraulics & Fluid Mechanics by Modi & Seth",
        "diff": "EASY",
        "year": 2023
    },
    {
        "qNum": 55,
        "subject": "Fluid Mechanics & Hydraulics",
        "topic": "Buoyancy and Floatation",
        "subtopic": "Metacentric Height & Stability",
        "stem": "For a floating body to be in stable equilibrium, its metacentric height (GM) must be:",
        "options": ["Positive (Metacenter M lies above center of gravity G)", "Zero (Metacenter M coincides with G)", "Negative (Metacenter M lies below G)", "Infinite"],
        "correct": "A",
        "formula": "GM = BM - BG > 0 for stable equilibrium",
        "explanation": "A floating body is in stable equilibrium when GM > 0 (M lies above G), neutral when GM = 0 (M coincides with G), and unstable when GM < 0 (M lies below G, producing an upsetting moment).",
        "ref": "Fluid Mechanics by A.K. Jain",
        "diff": "EASY",
        "year": 2022
    },
    {
        "qNum": 56,
        "subject": "Fluid Mechanics & Hydraulics",
        "topic": "Fluid Kinematics",
        "subtopic": "Continuity Equation",
        "stem": "The general continuity equation for steady, 3D incompressible flow in Cartesian coordinates is:",
        "options": ["∂u/∂x + ∂v/∂y + ∂w/∂z = 0", "u · ∂u/∂x + v · ∂v/∂y + w · ∂w/∂z = 0", "∂u/∂x - ∂v/∂y + ∂w/∂z = 0", "∂²u/∂x² + ∂²v/∂y² + ∂²w/∂z² = 0"],
        "correct": "A",
        "formula": "∇ · V = ∂u/∂x + ∂v/∂y + ∂w/∂z = 0",
        "explanation": "Conservation of mass for a fluid with constant density ρ leads to the divergence of velocity vector being zero: div(V) = ∂u/∂x + ∂v/∂y + ∂w/∂z = 0.",
        "ref": "Fluid Mechanics by Som & Biswas",
        "diff": "EASY",
        "year": 2024
    },
    {
        "qNum": 57,
        "subject": "Fluid Mechanics & Hydraulics",
        "topic": "Fluid Dynamics",
        "subtopic": "HGL and TEL Relationship",
        "stem": "The vertical distance between the Total Energy Line (TEL) and Hydraulic Gradient Line (HGL) at any cross-section of a pipe flow represents the:",
        "options": ["Pressure head (p / γ)", "Velocity head (v² / 2g)", "Datum head (z)", "Friction head loss (hf)"],
        "correct": "B",
        "formula": "TEL - HGL = v² / (2g)",
        "explanation": "Total Energy Line = p/γ + z + v²/2g. Hydraulic Gradient Line = p/γ + z. The difference between TEL and HGL is strictly the kinetic velocity head v² / (2g).",
        "ref": "Fluid Mechanics by Fox & McDonald",
        "diff": "EASY",
        "year": 2021
    },
    {
        "qNum": 58,
        "subject": "Fluid Mechanics & Hydraulics",
        "topic": "Flow Measurement",
        "subtopic": "Venturimeter Discharge Coefficient",
        "stem": "The coefficient of discharge (Cd) for a standard venturimeter typically ranges between:",
        "options": ["0.60 to 0.65", "0.70 to 0.75", "0.80 to 0.85", "0.96 to 0.98"],
        "correct": "D",
        "formula": "Cd(venturi) ≈ 0.96 - 0.98 vs Cd(orifice) ≈ 0.60 - 0.65",
        "explanation": "Due to smooth streamlined gradual convergence and divergence in a venturimeter, boundary layer separation and eddy losses are minimal, yielding Cd = 0.96 to 0.98. Orifice meters have sudden contraction with vena contracta, giving Cd ≈ 0.60 - 0.65.",
        "ref": "Hydraulics and Fluid Mechanics by Modi & Seth",
        "diff": "EASY",
        "year": 2023
    },
    {
        "qNum": 59,
        "subject": "Fluid Mechanics & Hydraulics",
        "topic": "Pipe Flow",
        "subtopic": "Darcy-Weisbach Equation",
        "stem": "The head loss due to friction in a pipe of length L, diameter D, carrying fluid at average velocity v is given by the Darcy-Weisbach equation as:",
        "options": ["hf = f · L · v² / (2 · g · D)", "hf = 4 · f · L · v / (2 · g · D)", "hf = f · L · v / (g · D)", "hf = f · L² · v / (2 · g · D)"],
        "correct": "A",
        "formula": "hf = f · L · v² / (2 · g · D) [where f is Darcy friction factor]",
        "explanation": "The Darcy-Weisbach equation is hf = f · L · v² / (2 g D). If Fanning friction factor f' is used, hf = 4 f' L v² / (2 g D), where f = 4 f'.",
        "ref": "Fluid Mechanics by Yunus A. Cengel",
        "diff": "EASY",
        "year": 2024
    },
    {
        "qNum": 60,
        "subject": "Fluid Mechanics & Hydraulics",
        "topic": "Laminar Flow in Pipes",
        "subtopic": "Hagen-Poiseuille Velocity Distribution",
        "stem": "In fully developed laminar flow through a circular pipe, the ratio of maximum centerline velocity (umax) to average cross-sectional velocity (vavg) is:",
        "options": ["1.25", "1.50", "2.00", "2.50"],
        "correct": "C",
        "formula": "umax = 2 · vavg (Circular Pipe); umax = 1.5 · vavg (Parallel Plates)",
        "explanation": "Velocity distribution across a circular pipe is parabolic: u(r) = umax · (1 - r²/R²). Integrating over the cross-section yields vavg = umax / 2, meaning maximum centerline velocity is exactly twice the average velocity (umax = 2 vavg).",
        "ref": "Fluid Mechanics by Streeter & Wylie",
        "diff": "EASY",
        "year": 2022
    },
    {
        "qNum": 61,
        "subject": "Fluid Mechanics & Hydraulics",
        "topic": "Open Channel Flow",
        "subtopic": "Manning's Formula",
        "stem": "In SI units, Manning's equation for uniform flow velocity (V) in an open channel of hydraulic radius R and bed slope S is:",
        "options": ["V = (1 / n) · R^(2/3) · S^(1/2)", "V = (1 / n) · R^(1/2) · S^(2/3)", "V = n · R^(2/3) · S^(1/2)", "V = (1 / n) · R^(3/4) · S^(1/2)"],
        "correct": "A",
        "formula": "V = (1 / n) · R^(2/3) · S^(1/2)",
        "explanation": "Robert Manning's empirical formula for uniform flow velocity is V = (1/n) · R^(2/3) · S^(1/2), where n is Manning's roughness coefficient, R is hydraulic radius (Area / Wetted Perimeter), and S is longitudinal bed slope.",
        "ref": "Flow in Open Channels by K. Subramanya",
        "diff": "EASY",
        "year": 2024
    },
    {
        "qNum": 62,
        "subject": "Fluid Mechanics & Hydraulics",
        "topic": "Open Channel Flow",
        "subtopic": "Critical Depth in Rectangular Channel",
        "stem": "For a rectangular open channel carrying discharge q per unit width, the critical depth (yc) is given by:",
        "options": ["yc = (q² / g)^(1/3)", "yc = (q / g)^(1/2)", "yc = (q² / g)^(1/2)", "yc = (q / g²)^(1/3)"],
        "correct": "A",
        "formula": "yc = (q² / g)^(1/3); Froude number Fr = 1 at critical depth",
        "explanation": "At critical flow condition, specific energy is minimum for a given discharge, giving Froude number Fr = v / √(g yc) = 1. Substituting v = q / yc leads directly to yc³ = q² / g => yc = (q² / g)^(1/3). Minimum specific energy Emin = 1.5 yc.",
        "ref": "Open Channel Hydraulics by Ven Te Chow",
        "diff": "EASY",
        "year": 2023
    },
    {
        "qNum": 63,
        "subject": "Fluid Mechanics & Hydraulics",
        "topic": "Open Channel Flow",
        "subtopic": "Hydraulic Jump Sequent Depths",
        "stem": "The relationship between pre-jump depth (y1) and post-jump sequent depth (y2) in a horizontal rectangular channel with initial Froude number Fr1 is:",
        "options": ["y2 / y1 = 0.5 · [√(1 + 8 · Fr1²) - 1]", "y2 / y1 = 0.5 · [√(1 + 8 · Fr1²) + 1]", "y2 / y1 = √(1 + 8 · Fr1²)", "y2 / y1 = 0.5 · [√(1 + 4 · Fr1²) - 1]"],
        "correct": "A",
        "formula": "y2 / y1 = 0.5 · [√(1 + 8 · Fr1²) - 1] (Belanger equation)",
        "explanation": "Applying momentum equation across the hydraulic jump in a rectangular channel yields Belanger's equation: y2 / y1 = 0.5 · (√(1 + 8 Fr1²) - 1). Energy loss in jump is ΔE = (y2 - y1)³ / (4 y1 y2).",
        "ref": "Flow in Open Channels by K. Subramanya",
        "diff": "MEDIUM",
        "year": 2024
    },
    {
        "qNum": 64,
        "subject": "Fluid Mechanics & Hydraulics",
        "topic": "Hydraulic Machines",
        "subtopic": "Specific Speed of Turbines",
        "stem": "The specific speed (Ns) of a hydraulic turbine generating power P under head H at rotational speed N is defined as:",
        "options": ["Ns = N · √P / H^(5/4)", "Ns = N · √P / H^(3/4)", "Ns = N · √Q / H^(3/4)", "Ns = N · P² / H^(5/4)"],
        "correct": "A",
        "formula": "Ns(turbine) = N · √P / H^(5/4); Ns(pump) = N · √Q / H^(3/4)",
        "explanation": "Turbine specific speed is Ns = N √P / H^(5/4). For Pelton wheel: Ns = 10-35 (low). For Francis turbine: Ns = 60-300 (medium). For Kaplan turbine: Ns = 300-1000 (high specific speed under low head).",
        "ref": "Hydraulic Machines by Jagdish Lal",
        "diff": "EASY",
        "year": 2021
    },

    # Environmental Engineering (65 - 74)
    {
        "qNum": 65,
        "subject": "Environmental Engineering",
        "topic": "Water Demand",
        "subtopic": "Population Forecasting Methods",
        "stem": "Which population forecasting method is most suitable for an old, mature, and densely populated city that has reached its saturation stage?",
        "options": ["Arithmetical increase method", "Geometrical increase method", "Incremental increase method", "Decreasing rate of growth method"],
        "correct": "A",
        "formula": "Pn = P0 + n · x̄",
        "explanation": "Arithmetical increase method assumes a constant rate of population growth (dP/dt = constant) and is suitable for old, large, established cities nearing saturation. Geometrical increase method is suited for rapidly developing young cities.",
        "ref": "Water Supply Engineering by S.K. Garg",
        "diff": "EASY",
        "year": 2024
    },
    {
        "qNum": 66,
        "subject": "Environmental Engineering",
        "topic": "Water Quality Standards",
        "subtopic": "Fluoride Limits per IS 10500",
        "stem": "As per IS 10500:2012, what is the acceptable limit and permissible limit in the absence of alternate source for Fluoride in drinking water?",
        "options": ["1.0 mg/L and 1.5 mg/L respectively", "0.5 mg/L and 1.0 mg/L respectively", "1.5 mg/L and 2.5 mg/L respectively", "0.05 mg/L and 0.1 mg/L respectively"],
        "correct": "A",
        "formula": "Acceptable limit = 1.0 mg/L; Max permissible = 1.5 mg/L",
        "explanation": "Under IS 10500:2012, acceptable Fluoride limit is 1.0 mg/L (prevents dental cavities). If fluoride exceeds 1.5 mg/L, it causes dental fluorosis (mottling of teeth) and skeletal fluorosis.",
        "ref": "IS 10500:2012 Drinking Water Specification",
        "diff": "EASY",
        "year": 2023
    },
    {
        "qNum": 67,
        "subject": "Environmental Engineering",
        "topic": "Water Treatment",
        "subtopic": "Alum Coagulation Chemistry",
        "stem": "When filter alum [Al2(SO4)3 · 18 H2O] is added as a coagulant to water containing bicarbonate alkalinity, it forms an insoluble gelatinous precipitate of:",
        "options": ["Aluminium hydroxide [Al(OH)3]", "Aluminium oxide [Al2O3]", "Calcium sulphate [CaSO4]", "Aluminium carbonate [Al2(CO3)3]"],
        "correct": "A",
        "formula": "Al2(SO4)3 + 3 Ca(HCO3)2 -> 2 Al(OH)3 ↓ + 3 CaSO4 + 6 CO2",
        "explanation": "Alum reacts with calcium bicarbonate natural alkalinity in water to produce aluminium hydroxide Al(OH)3 floc precipitate, which traps and sweeps colloidal turbidity. It releases CO2, which increases acidity and decreases water pH.",
        "ref": "Environmental Engineering by Peavy, Rowe & Tchobanoglous",
        "diff": "MEDIUM",
        "year": 2024
    },
    {
        "qNum": 68,
        "subject": "Environmental Engineering",
        "topic": "Water Treatment",
        "subtopic": "Sedimentation Tank Overflow Rate",
        "stem": "In a continuous flow horizontal sedimentation tank of length L, width B, and depth H treating discharge Q, the surface overflow rate (SOR or Vo) is:",
        "options": ["Vo = Q / (B · L)", "Vo = Q / (B · H)", "Vo = Q / (L · H)", "Vo = Q / (B · L · H)"],
        "correct": "A",
        "formula": "Vo = Q / (B · L) = Q / Plan Area",
        "explanation": "Surface overflow rate (SOR) is defined as discharge divided by plan surface area: Vo = Q / (B · L). Particles having settling velocity Vs ≥ Vo are 100% removed, while particles with Vs < Vo have removal efficiency η = (Vs / Vo) · 100%.",
        "ref": "Water Supply Engineering by B.C. Punmia",
        "diff": "EASY",
        "year": 2022
    },
    {
        "qNum": 69,
        "subject": "Environmental Engineering",
        "topic": "Filtration",
        "subtopic": "Rapid vs Slow Sand Filters",
        "stem": "Compared to a slow sand filter, a rapid sand filter has a rate of filtration that is approximately:",
        "options": ["30 times higher (3000 - 6000 L/m²/hr vs 100 - 200 L/m²/hr)", "Equal", "10 times lower", "2 times higher"],
        "correct": "A",
        "formula": "Rapid Sand Filter rate = 3000 - 6000 L/hr/m²; Slow Sand Filter = 100 - 200 L/hr/m²",
        "explanation": "Rapid sand filters use coarser sand (effective size 0.45 - 0.70 mm) and operate at filtration rates of 3000 to 6000 L/m²/hr (about 30 times faster than slow sand filters). They require chemical coagulation pretreatment and backwashing.",
        "ref": "Water and Wastewater Technology by Hammer",
        "diff": "EASY",
        "year": 2024
    },
    {
        "qNum": 70,
        "subject": "Environmental Engineering",
        "topic": "Disinfection",
        "subtopic": "Breakpoint Chlorination",
        "stem": "In water treatment, 'Breakpoint Chlorination' signifies the point where:",
        "options": ["All chlorine added is completely absorbed without any residual", "All combined chlorine (chloramines) and organic matter are oxidized, and free available residual chlorine begins to appear", "Water pipes break due to high chemical corrosion", "Chlorine demand reaches infinity"],
        "correct": "B",
        "formula": "Breakpoint: Free available chlorine (HOCl + OCl⁻) appears linearly with dosage",
        "explanation": "Up to the breakpoint, applied chlorine is consumed oxidising reducing compounds and forming chloramines. At the dip (breakpoint), chloramines are completely destroyed by oxidation. Beyond breakpoint, added chlorine appears as free residual chlorine (HOCl and OCl⁻).",
        "ref": "Water Supply Engineering by S.K. Garg",
        "diff": "MEDIUM",
        "year": 2023
    },
    {
        "qNum": 71,
        "subject": "Environmental Engineering",
        "topic": "Wastewater Characteristics",
        "subtopic": "BOD 5-Day Kinetics",
        "stem": "The 5-day Biochemical Oxygen Demand (BOD5) at 20°C of domestic wastewater is approximately what percentage of its ultimate carbonaceous BOD (L0)?",
        "options": ["50%", "68%", "85%", "99%"],
        "correct": "B",
        "formula": "BOD5 = L0 · (1 - 10^(-k · 5)) ≈ 0.68 · L0 for k = 0.1 day⁻¹ (base 10)",
        "explanation": "Using first-order deoxygenation kinetics with standard deoxygenation constant k = 0.10 day⁻¹ (base 10) at 20°C: BOD5 = L0 · (1 - 10^(-0.1 · 5)) = L0 · (1 - 10^-0.5) = L0 · (1 - 0.316) ≈ 0.684 · L0 (approximately 68%).",
        "ref": "Wastewater Engineering by Metcalf & Eddy",
        "diff": "EASY",
        "year": 2024
    },
    {
        "qNum": 72,
        "subject": "Environmental Engineering",
        "topic": "Sewer Design",
        "subtopic": "Self-Cleansing Velocity",
        "stem": "To prevent deposition of suspended solids and silting in sanitary sewers, the minimum self-cleansing velocity recommended is approximately:",
        "options": ["0.20 to 0.30 m/s", "0.60 to 0.75 m/s", "2.5 to 3.0 m/s", "5.0 m/s"],
        "correct": "B",
        "formula": "Vmin = 0.60 - 0.75 m/s; Vmax (non-scouring) = 2.5 - 3.0 m/s",
        "explanation": "A minimum flow velocity of 0.60 m/s at present peak flow (and 0.75 m/s at design full flow) is required to scour silt and organic debris. Maximum velocity is limited to 2.5 - 3.0 m/s to prevent abrasive erosion of sewer pipes.",
        "ref": "Manual on Sewerage & Sewage Treatment (CPHEEO)",
        "diff": "EASY",
        "year": 2023
    },
    {
        "qNum": 73,
        "subject": "Environmental Engineering",
        "topic": "Biological Treatment",
        "subtopic": "Activated Sludge Process (ASP) F/M Ratio",
        "stem": "In a conventional Activated Sludge Process (ASP), the food-to-microorganism ratio (F/M ratio) expressed in kg BOD per day per kg MLSS is typically maintained between:",
        "options": ["0.2 to 0.4", "0.01 to 0.05", "1.0 to 2.0", "5.0 to 10.0"],
        "correct": "A",
        "formula": "F/M = (Q · S0) / (V · X) ≈ 0.2 to 0.4 day⁻¹",
        "explanation": "In conventional aeration tanks, F/M ratio is maintained around 0.2 to 0.4 kg BOD/kg MLSS/day with a sludge retention time (sludge age) of 5 to 15 days, ensuring stable bio-oxidation and good sludge settling.",
        "ref": "Wastewater Engineering by Metcalf & Eddy",
        "diff": "MEDIUM",
        "year": 2022
    },
    {
        "qNum": 74,
        "subject": "Environmental Engineering",
        "topic": "Onsite Sanitation",
        "subtopic": "Septic Tank Detention Time",
        "stem": "As per IS 2470, the liquid detention period for standard domestic septic tanks is usually designed for:",
        "options": ["2 to 4 hours", "12 to 24 hours", "3 to 5 days", "7 to 10 days"],
        "correct": "B",
        "formula": "Septic tank detention period = 12 - 24 hours",
        "explanation": "IS 2470 recommends a liquid detention time of 12 to 24 hours (commonly 24 hours) to allow solids settling, flotation of scum, and initiation of anaerobic sludge digestion.",
        "ref": "IS 2470 (Part 1):1985 Code of Practice for Septic Tanks",
        "diff": "EASY",
        "year": 2024
    },

    # Surveying & Geomatics (75 - 82)
    {
        "qNum": 75,
        "subject": "Surveying & Geomatics",
        "topic": "Principles of Surveying",
        "subtopic": "Whole to Part Principle",
        "stem": "The fundamental principle of 'working from whole to part' is adopted in surveying primarily to:",
        "options": ["Distribute work among more surveyors", "Prevent accumulation of local errors and localize measurement errors", "Minimize the number of instruments required", "Survey the perimeter before taking any inside readings"],
        "correct": "B",
        "formula": "Working from whole to part localizes errors and prevents catastrophic error propagation",
        "explanation": "By establishing a primary, highly accurate network of major control points covering the entire area first and then filling in minor details, errors occurring in minor measurements remain confined locally and do not magnify.",
        "ref": "Surveying Vol. 1 by B.C. Punmia",
        "diff": "EASY",
        "year": 2024
    },
    {
        "qNum": 76,
        "subject": "Surveying & Geomatics",
        "topic": "Linear Measurements",
        "subtopic": "Sag Correction for Tape",
        "stem": "The correction for sag in a surveying tape suspended between two supports is:",
        "options": ["Always additive (+)", "Always subtractive (-)", "Positive or negative depending on pull applied", "Zero for steel tapes"],
        "correct": "B",
        "formula": "Cs = - W² · L / (24 · P²)",
        "explanation": "A suspended tape sags into a catenary curve, so the curved distance along the tape is always longer than the true straight chord distance between supports. The measured distance is too long, so the sag correction is ALWAYS negative (-).",
        "ref": "Surveying Vol. 1 by K.R. Arora",
        "diff": "EASY",
        "year": 2023
    },
    {
        "qNum": 77,
        "subject": "Surveying & Geomatics",
        "topic": "Compass Surveying",
        "subtopic": "Local Attraction Detection",
        "stem": "In compass surveying, a line is confirmed to be free from local attraction if the difference between its Fore Bearing (FB) and Back Bearing (BB) is exactly:",
        "options": ["90°", "180°", "270°", "360°"],
        "correct": "B",
        "formula": "|FB - BB| = 180°",
        "explanation": "For any line AB, the back bearing and fore bearing must differ by exactly 180° if both station A and station B are free from magnetic disturbances (local attraction).",
        "ref": "Surveying and Levelling by N.N. Basak",
        "diff": "EASY",
        "year": 2022
    },
    {
        "qNum": 78,
        "subject": "Surveying & Geomatics",
        "topic": "Levelling",
        "subtopic": "Arithmetical Checks in Levelling",
        "stem": "Which of the following arithmetical checks is applicable to both Height of Instrument (HI) method and Rise & Fall method of levelling?",
        "options": ["Σ BS - Σ FS = Last RL - First RL", "Σ Rise - Σ Fall = Last RL - First RL", "Σ BS - Σ FS = Σ Rise - Σ Fall = Last RL - First RL", "Σ IS - Σ FS = Last RL - First RL"],
        "correct": "A",
        "formula": "Σ BS - Σ FS = Last RL - First RL (universal check)",
        "explanation": "The check Σ BS - Σ FS = Last RL - First RL applies to both methods. The Rise and Fall method has the complete three-part check: Σ BS - Σ FS = Σ Rise - Σ Fall = Last RL - First RL, making it superior for checking intermediate sights.",
        "ref": "Surveying by Duggal",
        "diff": "EASY",
        "year": 2024
    },
    {
        "qNum": 79,
        "subject": "Surveying & Geomatics",
        "topic": "Levelling",
        "subtopic": "Curvature and Refraction Correction",
        "stem": "In precise levelling over a sight distance of d (in km), the combined correction for curvature and refraction (in meters) is given by:",
        "options": ["C = -0.0673 · d²", "C = +0.0785 · d²", "C = -0.0112 · d²", "C = -0.0562 · d²"],
        "correct": "A",
        "formula": "C = Cc + Cr = -0.0785 d² + 0.0112 d² = -0.0673 d² (m)",
        "explanation": "Earth's curvature increases staff reading (Cc = -0.0785 d²), while atmospheric refraction bends light downward decreasing staff reading (Cr = +0.0112 d² = Cc/7). Combined correction is C = -0.0673 d² meters.",
        "ref": "Higher Surveying by A.M. Chandra",
        "diff": "EASY",
        "year": 2023
    },
    {
        "qNum": 80,
        "subject": "Surveying & Geomatics",
        "topic": "Contouring",
        "subtopic": "Contour Characteristics",
        "stem": "Contour lines can cross each other only in the rare case of:",
        "options": ["A vertical cliff", "An overhanging cliff or a natural cave", "A ridge line", "A saddle point"],
        "correct": "B",
        "formula": "Contours cross each other ONLY at overhanging cliffs and caves",
        "explanation": "Contour lines can never cross or intersect except in the case of an overhanging cliff or a cave where two different elevations occur at the same plan coordinates. In a vertical cliff, contour lines unite to form a single line.",
        "ref": "Surveying by Punmia",
        "diff": "EASY",
        "year": 2021
    },
    {
        "qNum": 81,
        "subject": "Surveying & Geomatics",
        "topic": "Theodolite & Traverse",
        "subtopic": "Bowditch's Rule",
        "stem": "Bowditch's rule for balancing a closed traverse is applied when:",
        "options": ["Linear measurements and angular measurements are of equal precision", "Angular measurements are more precise than linear measurements", "Linear measurements are more precise than angular measurements", "Only astronomical bearings are observed"],
        "correct": "A",
        "formula": "Correction to Latitude = (Total Latitude Error) · (Length of side / Perimeter of traverse)",
        "explanation": "Bowditch's (compass) rule assumes that accidental errors in linear measurements are proportional to √L and in angular measurements are proportional to 1/√L. It balances traverse by distributing errors in latitude and departure proportional to side lengths.",
        "ref": "Surveying Vol. 2 by Punmia",
        "diff": "EASY",
        "year": 2024
    },
    {
        "qNum": 82,
        "subject": "Surveying & Geomatics",
        "topic": "Curves",
        "subtopic": "Degree of Curve Definition",
        "stem": "For a 30-meter chord or arc definition, the degree of circular curve (D in degrees) is related to radius of curve (R in meters) by:",
        "options": ["D = 1718.9 / R", "D = 1145.9 / R", "D = 572.9 / R", "D = 2000 / R"],
        "correct": "A",
        "formula": "D = 1718.9 / R (for 30m chain); D = 1145.9 / R (for 20m chain)",
        "explanation": "For an arc length of 30 m: Arc = R · (D · π / 180) => 30 = R · D · 0.017453 => D = 30 / (0.017453 · R) = 1718.87 / R ≈ 1719 / R. For 20m arc, D = 1146 / R.",
        "ref": "Surveying by Kanetkar & Kulkarni",
        "diff": "EASY",
        "year": 2023
    },

    # Highway & Transportation (83 - 90)
    {
        "qNum": 83,
        "subject": "Highway & Transportation Engineering",
        "topic": "Highway Planning",
        "subtopic": "Nagpur Road Plan Pattern",
        "stem": "The First 20-Year Road Development Plan (Nagpur Road Plan 1943-1963) recommended which road network pattern for India?",
        "options": ["Star and Grid pattern", "Radial and Circular pattern", "Hexagonal pattern", "Gridiron pattern"],
        "correct": "A",
        "formula": "Target road density = 16 km per 100 sq km area",
        "explanation": "Nagpur Road Congress classified roads into NH, SH, MDR, ODR, and VR, adopting the 'Star and Grid' pattern with an overall target road density of 16 km / 100 km².",
        "ref": "Highway Engineering by Khanna & Justo",
        "diff": "EASY",
        "year": 2024
    },
    {
        "qNum": 84,
        "subject": "Highway & Transportation Engineering",
        "topic": "Geometric Design",
        "subtopic": "Stopping Sight Distance (SSD)",
        "stem": "As per IRC guidelines, what is the design perception-reaction time (t) assumed in the calculation of Stopping Sight Distance (SSD) under PIEV theory?",
        "options": ["2.5 seconds", "2.0 seconds", "1.5 seconds", "0.75 seconds"],
        "correct": "A",
        "formula": "SSD = 0.278 · v · t + v² / (254 · f); t = 2.5 s",
        "explanation": "IRC recommends a perception-reaction time of 2.5 seconds for SSD calculations based on PIEV (Perception, Intellection, Emotion, Volition) theory. For Overtaking Sight Distance (OSD), reaction time is taken as 2.0 seconds.",
        "ref": "IRC:73-1980 Geometric Design Standards",
        "diff": "EASY",
        "year": 2023
    },
    {
        "qNum": 85,
        "subject": "Highway & Transportation Engineering",
        "topic": "Geometric Design",
        "subtopic": "Super-elevation for Mixed Traffic",
        "stem": "As per IRC recommendations for mixed traffic on plain and rolling terrain, super-elevation (e) is designed by neglecting lateral friction and considering what percentage of design speed (V)?",
        "options": ["75% of design speed (e = V² / 225 R)", "100% of design speed (e = V² / 127 R)", "50% of design speed", "90% of design speed"],
        "correct": "A",
        "formula": "e = (0.75 V)² / (127 R) = V² / (225 R)",
        "explanation": "To accommodate slow-moving bullock carts and fast motor vehicles on Indian roads, IRC designs super-elevation to fully counter centrifugal force at 75% of design speed (f = 0): e = (0.75 V)² / (127 R) = V² / (225 R). Maximum e is capped at 7% for plain/rolling terrain.",
        "ref": "Highway Engineering by Khanna & Justo",
        "diff": "EASY",
        "year": 2024
    },
    {
        "qNum": 86,
        "subject": "Highway & Transportation Engineering",
        "topic": "Geometric Design",
        "subtopic": "Maximum Super-elevation Limits",
        "stem": "As per IRC, what is the maximum permissible super-elevation (emax) on horizontal curves in plain and rolling terrain?",
        "options": ["7.0% (1 in 14.3)", "10.0% (1 in 10)", "4.0% (1 in 25)", "12.0% (1 in 8.3)"],
        "correct": "A",
        "formula": "emax = 7% (plain/rolling), 10% (hilly without snow), 4% (urban with frequent intersections)",
        "explanation": "IRC caps super-elevation at 7% (0.07) for plain and rolling terrain. In hilly terrain not bound by snow, it is 10%. In urban areas with frequent intersections, it is limited to 4% to prevent toppling of slow tall vehicles.",
        "ref": "IRC:73 Guidelines",
        "diff": "EASY",
        "year": 2022
    },
    {
        "qNum": 87,
        "subject": "Highway & Transportation Engineering",
        "topic": "Geometric Design",
        "subtopic": "Extra Widening on Curves",
        "stem": "The total extra widening (We) required on a two-lane horizontal curve of radius R with wheelbase l and design speed V (in km/h) is:",
        "options": ["We = (n · l² / (2 · R)) + (V / (9.5 · √R))", "We = (n · l / (2 · R)) + (V / (225 · R))", "We = (n · l² / R) + (V / (9.5 · √R))", "We = n · l² / (2 · R)"],
        "correct": "A",
        "formula": "We = Wm + Wps = (n · l² / (2 · R)) + (V / (9.5 · √R))",
        "explanation": "Total extra widening consists of Mechanical widening (off-tracking of rear axle Wm = n l² / 2R) plus Psychological widening (for driver ease and transverse clearances Wps = V / 9.5 √R).",
        "ref": "Highway Engineering by Kadiyali",
        "diff": "EASY",
        "year": 2024
    },
    {
        "qNum": 88,
        "subject": "Highway & Transportation Engineering",
        "topic": "Geometric Design",
        "subtopic": "Ideal Transition Curve",
        "stem": "The ideal shape of a transition curve adopted in Indian highway engineering practice is:",
        "options": ["Clothoid (Euler's Spiral)", "Cubic Parabola", "Lemniscate", "Circular Arc"],
        "correct": "A",
        "formula": "Transition curve: Radius R is inversely proportional to length L (L · R = Constant)",
        "explanation": "IRC recommends the Euler spiral (clothoid) because the rate of change of centrifugal acceleration is strictly uniform throughout, and radius decreases linearly with curve length from infinity to circular radius R.",
        "ref": "Highway Engineering by Khanna & Justo",
        "diff": "EASY",
        "year": 2021
    },
    {
        "qNum": 89,
        "subject": "Highway & Transportation Engineering",
        "topic": "Pavement Materials",
        "subtopic": "California Bearing Ratio (CBR) Test",
        "stem": "In the standard CBR test on subgrade soil, what is the standard load on crushed stone corresponding to 2.5 mm plunger penetration?",
        "options": ["1370 kg (13.44 kN)", "2055 kg (20.15 kN)", "1000 kg (9.81 kN)", "3000 kg (29.43 kN)"],
        "correct": "A",
        "formula": "Standard load at 2.5 mm = 1370 kg (70 kg/cm²); Standard load at 5.0 mm = 2055 kg (105 kg/cm²)",
        "explanation": "CBR (%) = (Test load / Standard load) · 100. The standard loads on high quality crushed stone are 1370 kg for 2.5 mm penetration and 2055 kg for 5.0 mm penetration. Usually CBR at 2.5 mm is higher and taken as design CBR.",
        "ref": "IS 2720 (Part 16) CBR Test Code",
        "diff": "MEDIUM",
        "year": 2024
    },
    {
        "qNum": 90,
        "subject": "Highway & Transportation Engineering",
        "topic": "Pavement Design",
        "subtopic": "Flexible vs Rigid Pavements",
        "stem": "Wheel load stresses in a flexible pavement are transferred to underlying layers predominantly through:",
        "options": ["Grain-to-grain contact pressure distribution", "Slab flexural bending action", "Shear membrane action only", "Tension in bitumen layers"],
        "correct": "A",
        "formula": "Flexible pavement: Grain-to-grain contact; Rigid pavement: Slab flexural rigidity",
        "explanation": "Flexible pavements distribute concentrated wheel loads downward over larger areas through inter-granular particle contact and friction, reducing stress intensity. Rigid pavements (PQC) carry loads through flexural slab action.",
        "ref": "IRC:37-2018 Guidelines for Flexible Pavement Design",
        "diff": "EASY",
        "year": 2023
    },

    # Steel Structures (91 - 95)
    {
        "qNum": 91,
        "subject": "Design of Steel Structures",
        "topic": "General Design Requirements",
        "subtopic": "Partial Safety Factors in IS 800:2007",
        "stem": "As per IS 800:2007 Table 5, the partial safety factor for material strength against yielding (γm0) and against ultimate tensile strength (γm1) are:",
        "options": ["1.10 and 1.25 respectively", "1.15 and 1.50 respectively", "1.25 and 1.10 respectively", "1.00 and 1.25 respectively"],
        "correct": "A",
        "formula": "γm0 = 1.10 (yielding); γm1 = 1.25 (ultimate tension / rupture)",
        "explanation": "Per IS 800:2007 Table 5, resistance governed by yielding of cross-section uses γm0 = 1.10; resistance governed by ultimate rupture at net section uses γm1 = 1.25; shop welds use γmw = 1.25, and field welds use γmw = 1.50.",
        "ref": "IS 800:2007 Table 5",
        "diff": "EASY",
        "year": 2024
    },
    {
        "qNum": 92,
        "subject": "Design of Steel Structures",
        "topic": "Tension Members",
        "subtopic": "Net Section Rupture & Shear Lag",
        "stem": "When a single angle tension member is connected to a gusset plate by only one leg, the phenomenon causing non-uniform stress distribution across the angle section is known as:",
        "options": ["Shear lag effect", "P-Delta effect", "Wobble effect", "Poisson expansion"],
        "correct": "A",
        "formula": "Tdn = 0.9 · Anc · fu / γm1 + β · Ago · fy / γm0 (IS 800 Cl. 6.3.3)",
        "explanation": "Because tensile load is transferred through the connected leg, the outstanding leg does not participate fully at the connection. The resulting non-uniform tensile stress concentration is called the 'Shear Lag Effect'.",
        "ref": "Design of Steel Structures by S.K. Duggal",
        "diff": "EASY",
        "year": 2023
    },
    {
        "qNum": 93,
        "subject": "Design of Steel Structures",
        "topic": "Compression Members",
        "subtopic": "Maximum Slenderness Ratio Limits",
        "stem": "As per IS 800:2007 Table 3, what is the maximum permissible slenderness ratio (λ = kL/r) for a member carrying compressive loads resulting from dead loads and superimposed live loads?",
        "options": ["180", "250", "300", "350"],
        "correct": "A",
        "formula": "λmax = 180 (Dead Load + Imposed Load compression)",
        "explanation": "IS 800 Table 3 specifies: A member carrying compressive loads from dead loads and imposed loads shall have slenderness ratio λ ≤ 180. For wind/earthquake compression, λ ≤ 250. For members acting solely in tension (hangers), λ ≤ 400.",
        "ref": "IS 800:2007 Table 3",
        "diff": "EASY",
        "year": 2022
    },
    {
        "qNum": 94,
        "subject": "Design of Steel Structures",
        "topic": "Welded Connections",
        "subtopic": "Effective Throat Thickness of Fillet Weld",
        "stem": "For a standard fillet weld with an angle between fusion faces of 90°, the effective throat thickness (t) is related to leg size (s) by:",
        "options": ["t = 0.70 · s", "t = 0.50 · s", "t = 0.60 · s", "t = 1.00 · s"],
        "correct": "A",
        "formula": "t = k · s, where k = 0.70 for 60°-90° fusion angle",
        "explanation": "Per IS 800:2007 Clause 10.5.3, effective throat thickness is t = k · s. For angles between fusion faces: 60°-90°: k = 0.70; 91°-100°: k = 0.65; 101°-106°: k = 0.60; 107°-113°: k = 0.55; 114°-120°: k = 0.50.",
        "ref": "IS 800:2007 Cl. 10.5.3",
        "diff": "EASY",
        "year": 2024
    },
    {
        "qNum": 95,
        "subject": "Design of Steel Structures",
        "topic": "Bolted Connections",
        "subtopic": "Minimum Pitch and Edge Distance",
        "stem": "As per IS 800:2007, the minimum pitch distance between centers of fasteners shall not be less than:",
        "options": ["2.5 times the nominal diameter of fastener (2.5 d)", "1.5 times the diameter", "3.0 times the diameter", "50 mm"],
        "correct": "A",
        "formula": "pmin = 2.5 · d",
        "explanation": "Clause 10.2.2 of IS 800 specifies that the distance between centers of fasteners (pitch) shall not be less than 2.5 times the nominal diameter of the fastener to avoid bearing failure between adjacent holes.",
        "ref": "IS 800:2007 Cl. 10.2.2",
        "diff": "EASY",
        "year": 2021
    },

    # Building Materials & Construction Management (96 - 100)
    {
        "qNum": 96,
        "subject": "Building Materials & Construction Management",
        "topic": "Cement & Concrete",
        "subtopic": "Bogue Compounds Hydration",
        "stem": "Which Bogue compound in Portland cement is responsible for early strength development within the first 7 to 14 days?",
        "options": ["Tricalcium Silicate (C3S - Alite)", "Dicalcium Silicate (C2S - Belite)", "Tricalcium Aluminate (C3A - Celite)", "Tetracalcium Aluminoferrite (C4AF - Felite)"],
        "correct": "A",
        "formula": "C3S imparts early strength; C2S imparts progressive late strength after 28 days",
        "explanation": "C3S (Alite, 3CaO·SiO2) hydrates rapidly and contributes to early strength up to 14 days. C2S hydrates slowly and imparts progressive long-term strength. C3A causes flash setting and produces the highest heat of hydration.",
        "ref": "Concrete Technology by M.S. Shetty",
        "diff": "EASY",
        "year": 2024
    },
    {
        "qNum": 97,
        "subject": "Building Materials & Construction Management",
        "topic": "Cement Testing",
        "subtopic": "Setting Times of OPC per IS 4031",
        "stem": "As per Indian Standards, the initial and final setting times for Ordinary Portland Cement (OPC) shall be:",
        "options": ["Not less than 30 minutes and not more than 600 minutes (10 hours)", "Not less than 60 minutes and not more than 300 minutes", "Not less than 15 minutes and not more than 120 minutes", "Not less than 45 minutes and not more than 720 minutes"],
        "correct": "A",
        "formula": "Initial setting ≥ 30 mins; Final setting ≤ 600 mins (10 hrs) (Vicat apparatus)",
        "explanation": "Per IS 269 and IS 4031: Initial setting time (measured with 1 mm square needle) must be ≥ 30 minutes. Final setting time (measured with annular collar needle) must be ≤ 600 minutes (10 hours).",
        "ref": "IS 269:2015 Specification for OPC",
        "diff": "EASY",
        "year": 2023
    },
    {
        "qNum": 98,
        "subject": "Building Materials & Construction Management",
        "topic": "Concrete Technology",
        "subtopic": "Workability Measurement",
        "stem": "For very low workability concrete (such as stiff dry mixes used for road roller-compacted concrete), the most appropriate test is:",
        "options": ["Vee-Bee consistometer test", "Slump cone test", "Compacting factor test", "Flow table test"],
        "correct": "A",
        "formula": "Very low workability: Vee-Bee test (time in seconds); High workability: Slump test",
        "explanation": "Slump test is unreliable for dry/lean mixes. Compacting factor test is suitable for low-to-medium workability. Vee-Bee consistometer measures the time (in seconds) required for vibration to transform a conical slump into a flat surface, ideal for stiff dry mixes.",
        "ref": "Concrete Technology by Gambhir",
        "diff": "MEDIUM",
        "year": 2022
    },
    {
        "qNum": 99,
        "subject": "Building Materials & Construction Management",
        "topic": "Network Analysis (CPM/PERT)",
        "subtopic": "Expected Time Duration in PERT",
        "stem": "In PERT analysis, given optimistic time (to), most likely time (tm), and pessimistic time (tp), the expected activity time (te) assuming a Beta distribution is:",
        "options": ["te = (to + 4 · tm + tp) / 6", "te = (to + tm + tp) / 3", "te = (to + 2 · tm + tp) / 4", "te = (to + 6 · tm + tp) / 8"],
        "correct": "A",
        "formula": "te = (to + 4 · tm + tp) / 6; Variance σ² = ((tp - to) / 6)²",
        "explanation": "PERT assumes a Beta probability distribution for activity duration. The weighted mean is te = (to + 4 tm + tp) / 6, and standard deviation is σ = (tp - to) / 6.",
        "ref": "Project Management with CPM/PERT by Punmia & Khandelwal",
        "diff": "EASY",
        "year": 2024
    },
    {
        "qNum": 100,
        "subject": "Building Materials & Construction Management",
        "topic": "CPM Project Scheduling",
        "subtopic": "Total Float Definition",
        "stem": "In Critical Path Method (CPM), the 'Total Float' of an activity represents:",
        "options": ["The maximum time by which an activity can be delayed without delaying project completion date", "The time by which an activity can be delayed without delaying the start of succeeding activity", "The float that affects preceding activities only", "The minimum contingency reserve duration"],
        "correct": "A",
        "formula": "Total Float = LFT - EFT = LST - EST; Free Float = EST(j) - EFT(ij)",
        "explanation": "Total Float is the total margin of time available to delay an activity without extending the project completion deadline. Free float delays neither the project nor succeeding activities. Critical activities have Total Float = 0.",
        "ref": "Construction Planning & Management by U.K. Shrivastava",
        "diff": "EASY",
        "year": 2023
    }
]

# Combine all 100 civil questions
all_civil = civil_questions + remaining_civil
print(f"Total civil questions combined: {len(all_civil)}")

# Format into TypeScript
ts_questions = []
for q in all_civil:
    opt_objs = []
    for i, opt in enumerate(q["options"]):
        opt_id = chr(65 + i)
        # Check if already has id or is pure text
        if isinstance(opt, dict):
            opt_objs.append(opt)
        else:
            opt_objs.append({"id": opt_id, "text": opt})
            
    ts_questions.append({
        "id": f"ce-q-{q['qNum']:03d}",
        "questionNumber": q["qNum"],
        "examId": "apsc-ae-civil",
        "subject": q["subject"],
        "topic": q["topic"],
        "subtopic": q.get("subtopic", ""),
        "stem": q["stem"],
        "options": opt_objs,
        "correctOption": q["correct"],
        "formulaContext": q.get("formula", None),
        "explanation": q["explanation"],
        "referenceSource": q.get("ref", "Standard Reference / Code"),
        "difficulty": q.get("diff", "MEDIUM"),
        "pyqYear": q.get("year", 2024),
        "pyqExam": f"Testbook Model / APSC AE Civil {q.get('year', 2024)}"
    })

ts_content = f"""import {{ MCQQuestion }} from '../types';

/**
 * Complete Bank of 100 AI-Calibrated Questions for Civil Engineering (Paper II)
 * Modeled after Testbook, State PSC (APSC AE), GATE & ESE Standards.
 */
export const CIVIL_ENGINEERING_QUESTIONS: MCQQuestion[] = {json.dumps(ts_questions, indent=2, ensure_ascii=False)};
"""

with open('src/data/civilQuestions.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print("Saved src/data/civilQuestions.ts successfully!")
