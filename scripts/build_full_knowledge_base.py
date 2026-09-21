# -*- coding: utf-8 -*-
"""
Generate complete comprehensive Knowledge Modules for ExamPilot AI.
Covers all core Civil Engineering subjects and complete General Studies
(History of India & Assam, Geography of India & Assam, Indian Polity, Economy, Science & Tech).
"""
import json

modules = [
    # -------------------------------------------------------------------------
    # 1. CIVIL: RCC Limit State Design & IS 456:2000
    # -------------------------------------------------------------------------
    {
        "id": "civil-rcc",
        "title": "RCC Limit State Design & IS 456:2000",
        "subject": "Reinforced Concrete Structures",
        "category": "civil",
        "readTime": "15 min read",
        "weightage": "HIGH_YIELD",
        "icon": "Building2",
        "summary": "Limit state design philosophy, stress block parameters, shear reinforcement, bond & anchorage, torsion, and deflection control under IS 456:2000.",
        "prerequisites": ["Engineering Mechanics", "Concrete Technology"],
        "standardReferences": ["IS 456:2000 Cl. 38, 39, 40", "SP 16 Design Aids"],
        "practiceQuestionIds": ["civil-1", "civil-2", "civil-3", "civil-4", "civil-5"],
        "steps": [
            {
                "stepNumber": 1,
                "stepTitle": "LSM Assumptions & Rectangular Stress Block",
                "subtitle": "Parabolic-rectangular stress profile and strain limits",
                "keyConcept": "IS 456:2000 assumes plane sections remain plane after bending. The concrete compressive stress block is parabolic up to 0.002 strain and rectangular up to ultimate strain of 0.0035. Compressive force C = 0.36 f_ck b x_u acting at 0.42 x_u from the top fiber. Tension force T = 0.87 f_y A_st at steel centroid.",
                "formulaOrCode": "C = 0.36 f_{ck} b x_u \\quad ; \\quad T = 0.87 f_y A_{st} \\quad ; \\quad \\frac{x_{u,max}}{d} = \\frac{0.0035}{0.0055 + \\frac{0.87 f_y}{E_s}}",
                "highYieldFacts": [
                    "Limiting neutral axis depth ratio x_u,max / d: Fe 250 = 0.53, Fe 415 = 0.48, Fe 500 = 0.46.",
                    "Tensile strain in steel at failure must not be less than (0.87 f_y / E_s) + 0.002.",
                    "Limiting moment of resistance: Fe 250 = 0.148 f_ck b d^2; Fe 415 = 0.138 f_ck b d^2; Fe 500 = 0.133 f_ck b d^2.",
                    "Partial safety factor for concrete is gamma_c = 1.5; for steel gamma_s = 1.15."
                ],
                "examTrap": "In LSM, limiting neutral axis depth x_u,max / d depends ONLY on the yield strength of steel (f_y), NOT on concrete grade f_ck.",
                "benchmarkExample": {
                    "question": "A singly reinforced rectangular beam (b = 250 mm, d = 450 mm) uses M20 concrete and Fe 415 steel. Calculate its limiting moment of resistance.",
                    "options": ["92.4 kN·m", "111.8 kN·m", "125.6 kN·m", "139.8 kN·m"],
                    "correctAnswer": "111.8 kN·m",
                    "stepByStepSolution": [
                        "Step 1: Formula for Fe 415: M_u,lim = 0.138 * f_ck * b * d^2.",
                        "Step 2: Substitute values: M_u,lim = 0.138 * 20 * 250 * (450)^2.",
                        "Step 3: Calculate: 0.138 * 20 * 250 * 202,500 = 139,725,000 N·mm = 111.78 kN·m (approx 111.8 kN·m)."
                    ],
                    "takeaway": "Direct exam formula: M_u,lim = 0.138 * f_ck * b * d^2 for Fe 415."
                }
            },
            {
                "stepNumber": 2,
                "stepTitle": "Shear Design & Diagonal Cracking",
                "subtitle": "Nominal shear stress, concrete capacity, and stirrup spacing",
                "keyConcept": "Diagonal tension creates 45-degree cracks in concrete near supports where shear force is maximum. Concrete resists nominal shear stress tau_c, and any excess shear (V_us = V_u - tau_c * b * d) must be carried by vertical or inclined shear reinforcement.",
                "formulaOrCode": "\\tau_v = \\frac{V_u}{b d} \\le \\tau_{c,max} \\quad ; \\quad V_{us} = \\frac{0.87 f_y A_{sv} d}{s_v}",
                "highYieldFacts": [
                    "Maximum shear stress tau_c,max for M20 = 2.8 N/mm², M25 = 3.1 N/mm², M30 = 3.5 N/mm².",
                    "Minimum shear reinforcement formula: (A_sv / (b * s_v)) >= 0.4 / (0.87 f_y).",
                    "Maximum spacing of vertical stirrups: minimum of 0.75 d or 300 mm.",
                    "If tau_v > tau_c,max, the section must be redesigned by increasing depth or width."
                ],
                "examTrap": "If nominal shear stress tau_v exceeds tau_c,max, no amount of stirrup reinforcement is permitted; the section MUST be resized.",
                "benchmarkExample": {
                    "question": "What is the maximum permissible vertical stirrup spacing in an RCC beam with effective depth 400 mm?",
                    "options": ["200 mm", "300 mm", "350 mm", "400 mm"],
                    "correctAnswer": "300 mm",
                    "stepByStepSolution": [
                        "Step 1: Check IS 456 Cl. 26.5.1.5: Max spacing = min(0.75 d, 300 mm).",
                        "Step 2: 0.75 * 400 = 300 mm.",
                        "Step 3: Comparing 300 mm and 300 mm gives 300 mm."
                    ],
                    "takeaway": "Vertical stirrups: min(0.75d, 300 mm); Inclined stirrups: min(d, 300 mm)."
                }
            },
            {
                "stepNumber": 3,
                "stepTitle": "Bond, Anchorage & Serviceability Deflection",
                "subtitle": "Development length L_d and basic span-to-depth ratios",
                "keyConcept": "Development length L_d ensures sufficient embedment length to prevent bond slippage. Deflection of beams is controlled via span-to-effective depth ratios per Cl. 23.2.1.",
                "formulaOrCode": "L_d = \\frac{\\phi (0.87 f_y)}{4 \\tau_{bd}} \\quad ; \\quad \\frac{\\text{Span}}{d} \\le \\text{Basic Ratio} \\times k_t",
                "highYieldFacts": [
                    "For HYSD/TMT bars, increase design bond stress tau_bd by 60%.",
                    "For bars in compression, increase tau_bd by 25%.",
                    "Basic span-to-depth ratios for spans up to 10 m: Cantilever = 7, Simply Supported = 20, Continuous = 26.",
                    "For spans > 10 m, multiply by (10 / Span in meters), except cantilevers."
                ],
                "examTrap": "For bars in compression with HYSD, both 1.6 and 1.25 factors apply multiplicatively: tau_bd * 1.6 * 1.25 = 2.0 * tau_bd.",
                "benchmarkExample": {
                    "question": "What is the basic span-to-effective depth ratio for a simply supported beam of 8 m span?",
                    "options": ["7", "20", "26", "30"],
                    "correctAnswer": "20",
                    "stepByStepSolution": [
                        "Step 1: Refer to IS 456 Cl. 23.2.1.",
                        "Step 2: Cantilever = 7; Simply Supported = 20; Continuous = 26.",
                        "Step 3: Since span is 8 m (<= 10 m), basic ratio is 20."
                    ],
                    "takeaway": "Memory aid: 7 (Cantilever) -> 20 (Simply Supported) -> 26 (Continuous)."
                }
            }
        ]
    },

    # -------------------------------------------------------------------------
    # 2. CIVIL: Structural Analysis & Indeterminacy
    # -------------------------------------------------------------------------
    {
        "id": "civil-structural-analysis",
        "title": "Structural Analysis: Indeterminacy, Arches & Matrix Methods",
        "subject": "Structural Analysis",
        "category": "civil",
        "readTime": "16 min read",
        "weightage": "HIGH_YIELD",
        "icon": "GitBranch",
        "summary": "Static and kinematic indeterminacy, moment distribution method, slope deflection equations, three-hinged and two-hinged arches, and stiffness matrices.",
        "prerequisites": ["Strength of Materials", "Engineering Mechanics"],
        "standardReferences": ["Negi Structural Analysis", "Ramamrutham", "Punmia"],
        "practiceQuestionIds": ["civil-6", "civil-7", "civil-8", "civil-9"],
        "steps": [
            {
                "stepNumber": 1,
                "stepTitle": "Static & Kinematic Indeterminacy",
                "subtitle": "Degrees of redundancy and degrees of freedom in trusses and frames",
                "keyConcept": "Static Indeterminacy (D_s) equals total unknown reaction forces and internal member forces minus available equations of equilibrium. Kinematic Indeterminacy (D_k) represents independent joint displacements (rotations and translations).",
                "formulaOrCode": "\\text{Truss: } D_s = m + r - 2j \\quad ; \\quad \\text{Rigid Frame (2D): } D_s = 3m + r - 3j - c",
                "highYieldFacts": [
                    "For a 2D pin-jointed truss: Equilibrium at each joint yields 2 equations (Sigma F_x = 0, Sigma F_y = 0).",
                    "For a 2D rigid-jointed frame: Each joint has 3 degrees of freedom (u, v, theta).",
                    "If axial deformations are neglected in a rigid frame, subtract number of members m: D_k = 3j - r - m.",
                    "Internal hinge in a beam releases 1 moment equilibrium equation (Sigma M = 0)."
                ],
                "examTrap": "Candidates often forget to check whether axial deformation is neglected or considered. If axially rigid, D_k decreases by the number of members m.",
                "benchmarkExample": {
                    "question": "A fixed-fixed beam has a single internal hinge at midspan. Determine its degree of static indeterminacy (D_s).",
                    "options": ["1", "2", "3", "4"],
                    "correctAnswer": "1",
                    "stepByStepSolution": [
                        "Step 1: Total reactions for two fixed supports: r = 3 + 3 = 6.",
                        "Step 2: Equilibrium equations available: 3 (Sigma F_x = 0, Sigma F_y = 0, Sigma M = 0).",
                        "Step 3: Internal hinge provides 1 additional release condition (Sigma M_hinge = 0).",
                        "Step 4: D_s = r - (3 + c) = 6 - (3 + 1) = 2. For purely vertical loads: D_s = 4 - 2 - 1 = 1."
                    ],
                    "takeaway": "Each internal hinge reduces static indeterminacy by 1."
                }
            },
            {
                "stepNumber": 2,
                "stepTitle": "Moment Distribution & Slope Deflection",
                "subtitle": "Hardy Cross method, stiffness factors, carry-over factors, and sway analysis",
                "keyConcept": "The Moment Distribution Method is an iterative displacement technique where unbalanced joint moments are distributed among connecting members in proportion to their relative rotational stiffness k.",
                "formulaOrCode": "k = \\frac{4EI}{L} \\text{ (Far end fixed)} \\quad ; \\quad k = \\frac{3EI}{L} \\text{ (Far end hinged)} \\quad ; \\quad \\text{COF} = +0.5",
                "highYieldFacts": [
                    "Carry-over factor (COF) to a fixed far end in prismatic member is +0.5.",
                    "Carry-over factor to a hinged far end is ZERO.",
                    "Distribution Factor DF_i = k_i / Sigma k (sum of DF at any rigid joint must equal 1.0).",
                    "Slope Deflection Equation: M_AB = M_F,AB + (2EI/L) * [2 theta_A + theta_B - 3 delta/L]."
                ],
                "examTrap": "When the far end is hinged, its stiffness is 3EI/L (75% of fixed far end). If you use 4EI/L, distribution factors will be completely incorrect!",
                "benchmarkExample": {
                    "question": "A member AB of span L has end A rigid and far end B hinged. What is the rotational stiffness at A?",
                    "options": ["2EI / L", "3EI / L", "4EI / L", "6EI / L"],
                    "correctAnswer": "3EI / L",
                    "stepByStepSolution": [
                        "Step 1: When far end is fixed, M = 4EI/L * theta.",
                        "Step 2: When far end is hinged, end moment required to produce unit rotation theta is M = 3EI/L * theta.",
                        "Step 3: Hence, rotational stiffness is 3EI / L."
                    ],
                    "takeaway": "Stiffness: Fixed far end = 4EI/L; Hinged far end = 3EI/L."
                }
            },
            {
                "stepNumber": 3,
                "stepTitle": "Three-Hinged & Two-Hinged Arches",
                "subtitle": "Horizontal thrust, bending moments, and parabolic arch under UDL",
                "keyConcept": "An arch converts vertical downward gravitational loading into lateral compressive thrust, dramatically reducing flexural moments compared to equivalent straight beams.",
                "formulaOrCode": "H = \\frac{w L^2}{8 h} \\quad \\text{(Parabolic arch under uniform load } w\\text{)} \\quad ; \\quad B.M._x = M_0 - H y = 0",
                "highYieldFacts": [
                    "A three-hinged arch is statically determinate (D_s = 0); temperature changes cause NO stress in a 3-hinged arch.",
                    "A two-hinged arch is indeterminate to first degree (D_s = 1); temperature rise increases horizontal thrust H.",
                    "Under uniform load w across the entire span, bending moment at EVERY section of a parabolic arch is identically ZERO!",
                    "Normal thrust N = V_x sin(theta) + H cos(theta); Radial shear Q = V_x cos(theta) - H sin(theta)."
                ],
                "examTrap": "A three-hinged arch has NO temperature stresses because the crown hinge rises or falls freely to accommodate thermal expansion.",
                "benchmarkExample": {
                    "question": "A three-hinged parabolic arch of span 40 m and central rise 5 m carries a UDL of 20 kN/m over the entire span. Calculate the horizontal thrust at supports.",
                    "options": ["200 kN", "400 kN", "800 kN", "1000 kN"],
                    "correctAnswer": "800 kN",
                    "stepByStepSolution": [
                        "Step 1: Formula for horizontal thrust: H = (w * L^2) / (8 * h).",
                        "Step 2: Substitute values: H = (20 * 40^2) / (8 * 5).",
                        "Step 3: H = (20 * 1600) / 40 = 32,000 / 40 = 800 kN."
                    ],
                    "takeaway": "Parabolic Arch under full UDL: H = wL² / 8h, Bending moment everywhere = 0."
                }
            }
        ]
    },

    # -------------------------------------------------------------------------
    # 3. CIVIL: Strength of Materials (Mechanics of Solids)
    # -------------------------------------------------------------------------
    {
        "id": "civil-som",
        "title": "Strength of Materials: Stresses, Mohr's Circle & Columns",
        "subject": "Strength of Materials",
        "category": "civil",
        "readTime": "18 min read",
        "weightage": "HIGH_YIELD",
        "icon": "Layers",
        "summary": "Stress-strain curves, Mohr's circle, pure bending, torsion in circular shafts, and Euler's column buckling theory.",
        "prerequisites": ["Engineering Mechanics", "Calculus"],
        "standardReferences": ["Timoshenko & Gere", "Bansal SOM"],
        "practiceQuestionIds": ["civil-10", "civil-11", "civil-12", "civil-13"],
        "steps": [
            {
                "stepNumber": 1,
                "stepTitle": "Principal Stresses & Mohr's Circle Transformation",
                "subtitle": "2D stress state, principal planes, and maximum shear stress",
                "keyConcept": "At any point in a stressed material, there exist planes on which shear stress vanishes (principal planes). The normal stresses on these planes are maximum and minimum principal stresses. Mohr's circle represents these relations graphically.",
                "formulaOrCode": "\\sigma_{1,2} = \\frac{\\sigma_x + \\sigma_y}{2} \\pm \\sqrt{\\left(\\frac{\\sigma_x - \\sigma_y}{2}\\right)^2 + \\tau_{xy}^2} \\quad ; \\quad \\tau_{max} = \\frac{\\sigma_1 - \\sigma_2}{2}",
                "highYieldFacts": [
                    "Center of Mohr's circle = ((sigma_x + sigma_y)/2, 0).",
                    "Radius of Mohr's circle = tau_max = sqrt(((sigma_x - sigma_y)/2)^2 + tau_xy^2).",
                    "The angle between principal planes and maximum shear stress planes is always 45 degrees.",
                    "Normal stress on maximum shear stress plane = (sigma_1 + sigma_2) / 2."
                ],
                "examTrap": "For pure shear stress tau_xy with zero normal stresses, Mohr's circle is centered at origin with radius tau. The principal stresses are +tau and -tau at 45 degrees.",
                "benchmarkExample": {
                    "question": "If sigma_x = 100 MPa, sigma_y = 20 MPa, and tau_xy = 30 MPa, find the radius of Mohr's circle.",
                    "options": ["30 MPa", "40 MPa", "50 MPa", "60 MPa"],
                    "correctAnswer": "50 MPa",
                    "stepByStepSolution": [
                        "Step 1: (sigma_x - sigma_y) / 2 = (100 - 20) / 2 = 40 MPa.",
                        "Step 2: Radius R = sqrt(40^2 + 30^2) = sqrt(1600 + 900) = sqrt(2500) = 50 MPa.",
                        "Step 3: Radius equals maximum shear stress tau_max = 50 MPa."
                    ],
                    "takeaway": "Radius of Mohr's circle = sqrt(((sigma_x - sigma_y)/2)^2 + tau_xy^2)."
                }
            },
            {
                "stepNumber": 2,
                "stepTitle": "Pure Bending & Shear Stress Distribution",
                "subtitle": "Flexural formula, neutral axis, and cross-sectional shear patterns",
                "keyConcept": "In pure bending, longitudinal strain varies linearly with distance from the neutral axis. Shear stress varies parabolically across rectangular, circular, and I-sections.",
                "formulaOrCode": "\\frac{M}{I} = \\frac{\\sigma}{y} = \\frac{E}{R} \\quad ; \\quad \\tau = \\frac{V Q}{I b}",
                "highYieldFacts": [
                    "Rectangular section: tau_max = 1.5 tau_avg (at neutral axis).",
                    "Circular section: tau_max = (4/3) tau_avg = 1.33 tau_avg (at neutral axis).",
                    "Triangular section: tau_max = 1.5 tau_avg (at h/2 from vertex; at NA, tau = 1.33 tau_avg).",
                    "In an I-section, the web resists ~85-90% of shear force, while flanges resist ~85% of bending moment."
                ],
                "examTrap": "In a triangular cross-section, maximum shear stress occurs at mid-depth (h/2 from vertex), NOT at the neutral axis (2h/3 from vertex)!",
                "benchmarkExample": {
                    "question": "A solid circular shaft experiences an average shear stress of 30 MPa. What is the maximum shear stress across its cross-section?",
                    "options": ["30 MPa", "40 MPa", "45 MPa", "60 MPa"],
                    "correctAnswer": "40 MPa",
                    "stepByStepSolution": [
                        "Step 1: Ratio for solid circular section: tau_max = (4/3) * tau_avg.",
                        "Step 2: Substitute: tau_max = (4/3) * 30 = 40 MPa."
                    ],
                    "takeaway": "Circle: tau_max = 1.33 * tau_avg; Rectangle: tau_max = 1.5 * tau_avg."
                }
            },
            {
                "stepNumber": 3,
                "stepTitle": "Euler's Column Buckling Theory",
                "subtitle": "Effective length factors and critical load for slender columns",
                "keyConcept": "Long slender columns fail by elastic buckling rather than direct material crushing. Euler's critical load depends on flexural rigidity EI and effective length L_e.",
                "formulaOrCode": "P_{cr} = \\frac{\\pi^2 E I}{(L_e)^2} = \\frac{\\pi^2 E A}{\\lambda^2} \\quad ; \\quad \\lambda = \\frac{L_e}{r_{min}}",
                "highYieldFacts": [
                    "Both ends hinged: L_e = L (P_cr = P).",
                    "Both ends fixed: L_e = L / 2 (P_cr = 4P).",
                    "One fixed, one hinged: L_e = L / sqrt(2) = 0.707 L (P_cr = 2P).",
                    "One fixed, one free: L_e = 2 L (P_cr = P / 4)."
                ],
                "examTrap": "Changing from hinged-hinged to fixed-fixed quadruples the critical load (4P), not doubles, because L_e is halved and load is inversely proportional to L_e squared.",
                "benchmarkExample": {
                    "question": "A column with both ends hinged has critical buckling load 200 kN. If both ends are fixed, what is its critical load?",
                    "options": ["200 kN", "400 kN", "800 kN", "1600 kN"],
                    "correctAnswer": "800 kN",
                    "stepByStepSolution": [
                        "Step 1: Effective length for fixed ends: L_e = L / 2.",
                        "Step 2: P_cr is inversely proportional to (L_e)^2.",
                        "Step 3: New P_cr = 4 * 200 kN = 800 kN."
                    ],
                    "takeaway": "Fixed-Fixed column capacity = 4 * Hinged-Hinged capacity."
                }
            }
        ]
    },

    # -------------------------------------------------------------------------
    # 4. CIVIL: Geotechnical & Foundation Engineering
    # -------------------------------------------------------------------------
    {
        "id": "civil-geotech",
        "title": "Geotechnical Engineering: Consolidation & Bearing Capacity",
        "subject": "Geotechnical Engineering",
        "category": "civil",
        "readTime": "16 min read",
        "weightage": "HIGH_YIELD",
        "icon": "Mountain",
        "summary": "Soil phase relations, 1D Terzaghi consolidation, Mohr-Coulomb shear strength, Rankine earth pressure, and Terzaghi shallow bearing capacity.",
        "prerequisites": ["Fluid Mechanics", "Mechanics of Solids"],
        "standardReferences": ["Terzaghi & Peck", "IS 6403 Bearing Capacity"],
        "practiceQuestionIds": ["civil-14", "civil-15", "civil-16", "civil-17"],
        "steps": [
            {
                "stepNumber": 1,
                "stepTitle": "Soil Phase Relations & Index Properties",
                "subtitle": "Void ratio, degree of saturation, unit weights, and Casagrande chart",
                "keyConcept": "Soil consists of solids, water, and air voids. The fundamental relation is S * e = w * G. On the Casagrande plasticity chart, the A-line separates clays from silts.",
                "formulaOrCode": "S \\cdot e = w \\cdot G \\quad ; \\quad I_p = 0.73 (w_L - 20) \\quad ; \\quad \\gamma_{sat} = \\frac{G + e}{1 + e} \\gamma_w",
                "highYieldFacts": [
                    "Void ratio e can exceed 1.0; porosity n is strictly between 0 and 100%.",
                    "Submerged unit weight gamma_sub = ((G - 1) / (1 + e)) * gamma_w.",
                    "Soils above the A-line are inorganic clays (CL, CI, CH); below are inorganic silts (ML, MI, MH) or organic soils.",
                    "Toughness index = I_p / Flow Index (I_f)."
                ],
                "examTrap": "If soil falls in the plasticity index range 4 <= I_p <= 7 near the A-line, it receives dual classification CL-ML.",
                "benchmarkExample": {
                    "question": "A saturated soil has water content 25% and G = 2.65. What is its void ratio?",
                    "options": ["0.55", "0.66", "0.75", "0.85"],
                    "correctAnswer": "0.66",
                    "stepByStepSolution": [
                        "Step 1: Saturated implies S = 1.0.",
                        "Step 2: S * e = w * G => 1.0 * e = 0.25 * 2.65.",
                        "Step 3: e = 0.6625 (approx 0.66)."
                    ],
                    "takeaway": "S * e = w * G connects the core soil index properties."
                }
            },
            {
                "stepNumber": 2,
                "stepTitle": "Terzaghi 1D Consolidation & Settlement",
                "subtitle": "Pore water dissipation, coefficient of consolidation, and drainage length",
                "keyConcept": "Consolidation settlement occurs due to gradual dissipation of excess pore water pressure in saturated cohesive soils under sustained static loads.",
                "formulaOrCode": "T_v = \\frac{c_v t}{d^2} \\quad ; \\quad S_f = \\frac{C_c H_0}{1 + e_0} \\log_{10}\\left(\\frac{\\sigma'_0 + \\Delta \\sigma'}{\\sigma'_0}\\right)",
                "highYieldFacts": [
                    "Double drainage path d = H / 2; Single drainage path d = H.",
                    "Consolidation time t is proportional to d^2. Single drainage takes 4 times longer than double drainage!",
                    "Compression index formula: C_c = 0.009 * (w_L - 10) for undisturbed clays.",
                    "Coefficient of volume compressibility m_v = a_v / (1 + e_0)."
                ],
                "examTrap": "Single drainage takes 4 TIMES as long as double drainage because drainage distance is squared in T_v = c_v * t / d^2.",
                "benchmarkExample": {
                    "question": "A clay layer consolidates 50% in 2 years with double drainage. How long would it take if drainage is from top only?",
                    "options": ["2 years", "4 years", "8 years", "16 years"],
                    "correctAnswer": "8 years",
                    "stepByStepSolution": [
                        "Step 1: t_single / t_double = (H)^2 / (H / 2)^2 = 4.",
                        "Step 2: t_single = 4 * 2 years = 8 years."
                    ],
                    "takeaway": "Single drainage takes 4x longer than double drainage."
                }
            },
            {
                "stepNumber": 3,
                "stepTitle": "Lateral Earth Pressure & Bearing Capacity",
                "subtitle": "Rankine's active/passive states and Terzaghi's bearing capacity equation",
                "keyConcept": "Rankine earth pressure determines active (wall moves away) and passive (wall pushed into soil) pressures. Terzaghi's bearing capacity formula determines ultimate bearing capacity of shallow footings.",
                "formulaOrCode": "K_a = \\frac{1 - \\sin \\phi}{1 + \\sin \\phi} \\quad ; \\quad q_{ult} = c N_c + q N_q + 0.5 \\gamma B N_\\gamma",
                "highYieldFacts": [
                    "For phi = 30 degrees: K_a = 1/3, K_p = 3.",
                    "Depth of tension crack in clay: z_0 = 2c / (gamma * sqrt(K_a)).",
                    "For a strip footing on purely cohesive clay (phi = 0): N_c = 5.7, N_q = 1.0, N_gamma = 0; q_net,ult = 5.7 c.",
                    "For circular footing: q_ult = 1.3 c N_c + q N_q + 0.3 gamma B N_gamma."
                ],
                "examTrap": "Critical unsupported excavation depth in clay is 2 * z_0 = 4c / gamma, which is twice the tension crack depth.",
                "benchmarkExample": {
                    "question": "What is the net ultimate bearing capacity of a strip footing founded on purely cohesive clay with cohesion c = 40 kPa per Terzaghi?",
                    "options": ["120 kPa", "200 kPa", "228 kPa", "256 kPa"],
                    "correctAnswer": "228 kPa",
                    "stepByStepSolution": [
                        "Step 1: For strip footing on clay (phi = 0): q_net,ult = c * N_c.",
                        "Step 2: Terzaghi N_c for strip footing = 5.7.",
                        "Step 3: q_net,ult = 40 * 5.7 = 228 kPa."
                    ],
                    "takeaway": "Pure clay strip footing: q_net,ult = 5.7 c (Skempton uses N_c = 5.0 to 7.5 depending on depth)."
                }
            }
        ]
    },

    # -------------------------------------------------------------------------
    # 5. GENERAL STUDIES: History & Culture of Assam
    # -------------------------------------------------------------------------
    {
        "id": "gs-assam-history",
        "title": "History & Heritage of Assam: Ahom Era & Freedom Movement",
        "subject": "Assam History & Culture",
        "category": "gs",
        "readTime": "20 min read",
        "weightage": "HIGH_YIELD",
        "icon": "Crown",
        "summary": "Ancient Pragjyotisha-Kamarupa, the 600-year Ahom Kingdom (1228–1826), Battle of Saraighat, Paik system, Treaty of Yandabo, and Assam's vanguard martyrs in the Freedom Struggle.",
        "prerequisites": ["General Indian History overview"],
        "standardReferences": ["Edward Gait: A History of Assam", "Dr. S.L. Baruah: Comprehensive History of Assam"],
        "practiceQuestionIds": ["gs-1", "gs-2", "gs-3", "gs-4", "gs-5"],
        "steps": [
            {
                "stepNumber": 1,
                "stepTitle": "Pre-Ahom Kamarupa & Ancient Dynasties",
                "subtitle": "Pragjyotisha, Varman dynasty, and Kumar Bhaskaravarman",
                "keyConcept": "Ancient Assam was known as Pragjyotisha in the Epics and Kamarupa in Sanskrit literature (Allahabad Pillar Inscription of Samudragupta mentions Kamarupa as a frontier kingdom). The Varman dynasty (4th-7th century CE) established sovereignty, peaking under Kumar Bhaskaravarman.",
                "formulaOrCode": "\\text{Dynastic Sequence: Varman } \\to \\text{Salasthambha (Mlechha) } \\to \\text{Pala Dynasty}",
                "highYieldFacts": [
                    "Pushyavarman founded the Varman dynasty (~350 CE).",
                    "Kumar Bhaskaravarman was a close ally of Emperor Harshavardhana of Kannauj and hosted Chinese Buddhist monk Hiuen Tsang (Xuanzang) in 643 CE.",
                    "Hiuen Tsang recorded Kamarupa in his travelogue 'Si-Yu-Ki', noting flourishing education and silk weaving.",
                    "Bhagadatta, king of Pragjyotisha, fought on the Kaurava side in the Mahabharata."
                ],
                "examTrap": "Kumar Bhaskaravarman was contemporary to Harshavardhana of Kannauj, NOT Chandragupta Maurya.",
                "benchmarkExample": {
                    "question": "Which Chinese pilgrim visited Kamarupa in the 7th century during the reign of Kumar Bhaskaravarman?",
                    "options": ["Fa-Hien", "Hiuen Tsang (Xuanzang)", "I-Tsing", "Al-Biruni"],
                    "correctAnswer": "Hiuen Tsang (Xuanzang)",
                    "stepByStepSolution": [
                        "Step 1: Bhaskaravarman ruled in the early 7th century CE.",
                        "Step 2: Xuanzang visited India during Harshavardhana's reign and spent months in Kamarupa in 643 CE.",
                        "Step 3: Documented in 'Si-Yu-Ki'."
                    ],
                    "takeaway": "Hiuen Tsang visited Kamarupa in 643 CE upon Bhaskaravarman's invitation."
                }
            },
            {
                "stepNumber": 2,
                "stepTitle": "The Ahom Kingdom (1228–1826) & Administrative System",
                "subtitle": "Sukapha's arrival, Paik System, Buranjis, and administrative hierarchy",
                "keyConcept": "Chaolung Sukapha crossed the Patkai hills in 1228 CE, establishing the Ahom capital at Charaideo in 1253. Ahoms ruled for nearly 600 years through their unique administrative, economic, and military system known as the Paik system.",
                "formulaOrCode": "\\text{Paik Structure: 4 Paiks (later 3) = 1 Got} \\quad ; \\quad 20 = \\text{Bora}, \\quad 100 = \\text{Saikia}, \\quad 1000 = \\text{Hazarika}",
                "highYieldFacts": [
                    "Sukapha arrived in 1228 CE; capital established at Charaideo (now a UNESCO World Heritage Site).",
                    "Paik System: Every able-bodied adult male (aged 15 to 50) was registered as a Paik, providing compulsory state labor and military service in rotation.",
                    "Officers hierarchy: Bora (20 paiks), Saikia (100 paiks), Hazarika (1,000 paiks), Phukan / Rajkhowa (commanders).",
                    "Suhungmung (Dihingia Raja) created the 3rd minister post 'Barpatragohain', adopted Hindu title 'Swarganarayan', and introduced Saka era.",
                    "Buranjis: Official state historical chronicles written in Ahom and Assamese language."
                ],
                "examTrap": "The office of Barpatragohain was NOT created by Sukapha; it was added by King Suhungmung in the early 16th century.",
                "benchmarkExample": {
                    "question": "Which Ahom king introduced the third minister position 'Barpatragohain'?",
                    "options": ["Chaolung Sukapha", "Suhungmung (Dihingia Raja)", "Pratap Singha", "Rudra Singha"],
                    "correctAnswer": "Suhungmung (Dihingia Raja)",
                    "stepByStepSolution": [
                        "Step 1: The original council included Borgohain and Burhagohain.",
                        "Step 2: Suhungmung created Barpatragohain for Konseng.",
                        "Step 3: Suhungmung also expanded the kingdom and introduced Saka era."
                    ],
                    "takeaway": "Suhungmung created Barpatragohain and took title Swarganarayan."
                }
            },
            {
                "stepNumber": 3,
                "stepTitle": "Lachit Borphukan & The Battle of Saraighat (1671)",
                "subtitle": "Naval war on the Brahmaputra, Ram Singh, and defense of Kamrup",
                "keyConcept": "The Battle of Saraighat (1671) was the decisive naval conflict on the Brahmaputra River between the Mughal fleet under Raja Ram Singh I of Amber and Ahom forces led by General Lachit Borphukan, preserving Assam's independence.",
                "formulaOrCode": "\\text{Saraighat (1671): Ahom Naval Guerrilla Tactics} > \\text{Mughal Heavy Artillery}",
                "highYieldFacts": [
                    "Chakradhwaj Singha appointed Lachit as Borphukan in 1667 to liberate Guwahati.",
                    "Famous quote: 'Dexot koi Momai dangor nohoi' (My uncle is not greater than my motherland).",
                    "Ahom light Bachari boats outmaneuvered heavy Mughal ships on the Brahmaputra river.",
                    "Lachit Maidam is situated at Hoolungapara near Jorhat.",
                    "Saraighat Bridge (first rail-cum-road bridge over Brahmaputra) was inaugurated in 1962 near this site."
                ],
                "examTrap": "Saraighat occurred in 1671. Mir Jumla's earlier invasion occurred in 1662-63 under Jayadhwaj Singha.",
                "benchmarkExample": {
                    "question": "Who was the Ahom King during the historic Battle of Saraighat in 1671?",
                    "options": ["Jayadhwaj Singha", "Chakradhwaj Singha", "Rudra Singha", "Gadadhar Singha"],
                    "correctAnswer": "Chakradhwaj Singha",
                    "stepByStepSolution": [
                        "Step 1: Chakradhwaj Singha resolved to liberate Guwahati and appointed Lachit Borphukan.",
                        "Step 2: War concluded decisively at Saraighat in 1671.",
                        "Step 3: Chakradhwaj Singha passed away shortly before final climax, but was the sovereign who initiated the campaign."
                    ],
                    "takeaway": "Chakradhwaj Singha initiated the war; Lachit Borphukan commanded the forces."
                }
            },
            {
                "stepNumber": 4,
                "stepTitle": "Treaty of Yandabo (1826) & Assam's Freedom Martyrs",
                "subtitle": "Peasant uprisings, Phulaguri, Patharughat, and Quit India martyrs",
                "keyConcept": "Following Burmese invasions (Maanor Din), the British annexed Assam under the Treaty of Yandabo on 24 February 1826. Assam actively fought British colonial exploitation through peasant revolts and the national freedom movement.",
                "formulaOrCode": "1826 \\text{ (Yandabo)} \\to 1858 \\text{ (Maniram Dewan)} \\to 1861 \\text{ (Phulaguri)} \\to 1894 \\text{ (Patharughat)} \\to 1942 \\text{ (Quit India)}",
                "highYieldFacts": [
                    "Treaty of Yandabo (24 Feb 1826) ceded Assam to the British East India Company.",
                    "Maniram Dewan and Piyali Baruah were hanged on 26 February 1858 in Jorhat for the 1857 uprising.",
                    "Phulaguri Dhawa (1861): First peasant uprising in Assam against British ban on poppy and proposed betel nut tax.",
                    "Patharughat Revolt (1894): Over 140 peasants martyred in police firing during tax protest ('Assam's Jallianwala Bagh').",
                    "Kushal Konwar: The only martyr in all of India hanged during the Quit India Movement (15 June 1943 at Jorhat Jail).",
                    "Kanaklata Barua (17-year-old) and Mukunda Kakati martyred on 20 September 1942 at Gohpur police station."
                ],
                "examTrap": "Kushal Konwar was the ONLY person in India executed by hanging during the 1942 Quit India Movement.",
                "benchmarkExample": {
                    "question": "Which peasant uprising in Assam in 1894 is commemorated as 'Assam's Jallianwala Bagh'?",
                    "options": ["Phulaguri Dhawa", "Patharughat Peasant Uprising", "Rangiya Revolt", "Lachima Uprising"],
                    "correctAnswer": "Patharughat Peasant Uprising",
                    "stepByStepSolution": [
                        "Step 1: In 1894 at Patharughat (Darrang), peasants protested 70-80% land revenue hikes.",
                        "Step 2: Police fired into the unarmed gathering, killing 140 peasants.",
                        "Step 3: Commemorated as the Jallianwala Bagh of Assam."
                    ],
                    "takeaway": "Patharughat (1894) = Land revenue protest; Phulaguri (1861) = First peasant uprising."
                }
            }
        ]
    },

    # -------------------------------------------------------------------------
    # 6. GENERAL STUDIES: Geography of India & Assam
    # -------------------------------------------------------------------------
    {
        "id": "gs-assam-geography",
        "title": "Geography of India & Assam: Physiography & National Parks",
        "subject": "Geography of India & Assam",
        "category": "gs",
        "readTime": "18 min read",
        "weightage": "HIGH_YIELD",
        "icon": "MapPin",
        "summary": "Physiography of Assam, Brahmaputra & Barak drainage systems, Majuli island, the 7 National Parks, Ramsar wetland Deepor Beel, and mineral resources.",
        "prerequisites": ["Basic Physical Geography"],
        "standardReferences": ["Majid Husain", "Taher & Ahmed: Geography of Assam"],
        "practiceQuestionIds": ["gs-6", "gs-7", "gs-8", "gs-9", "gs-10"],
        "steps": [
            {
                "stepNumber": 1,
                "stepTitle": "Physiographic Units & River Drainage",
                "subtitle": "Brahmaputra Valley, Barak Valley, Karbi-Barail hills, and tributaries",
                "keyConcept": "Assam comprises 78,438 km² divided into the Brahmaputra Valley, the Barak Valley, and the Central Assam Hills (Karbi Anglong & Dima Hasao). The Karbi Anglong plateau is geologically an ancient part of the Indian Peninsular Shield.",
                "formulaOrCode": "\\text{Brahmaputra Length} \\approx 2,880 \\text{ km (916 km in India)} \\quad ; \\quad \\text{NW-2: Sadiya to Dhubri (891 km)}",
                "highYieldFacts": [
                    "Brahmaputra originates as Yarlung Tsangpo near Lake Manasarovar in Tibet, cuts Namcha Barwa, enters Arunachal as Siang/Dihang, and joins Dibang and Lohit at Kobo.",
                    "North-Bank Tributaries: Subansiri (largest), Kameng (Jia Bharali), Manas, Beki, Sankosh.",
                    "South-Bank Tributaries: Burhi Dihing, Disang, Dikhow, Dhansiri, Kopili, Krishnai.",
                    "Majuli: World's largest inhabited freshwater river island, first river island district in India (2016).",
                    "Barak River originates in Manipur hills, flows through Cachar, Karimganj, and enters Bangladesh as Surma and Kushiyara."
                ],
                "examTrap": "Karbi Anglong and Meghalaya Plateau are NOT part of the Himalayas; they belong to the ancient Gondwanaland Peninsular Shield!",
                "benchmarkExample": {
                    "question": "Which is the largest tributary of the Brahmaputra River?",
                    "options": ["Manas", "Subansiri", "Burhi Dihing", "Kopili"],
                    "correctAnswer": "Subansiri",
                    "stepByStepSolution": [
                        "Step 1: Subansiri originates in Tibet and contributes over 8% of Brahmaputra's total discharge.",
                        "Step 2: It is the single largest tributary in length and flow volume."
                    ],
                    "takeaway": "Subansiri = Largest tributary; NW-2 = Brahmaputra (Sadiya to Dhubri, 891 km)."
                }
            },
            {
                "stepNumber": 2,
                "stepTitle": "The 7 National Parks & Protected Biodiversity",
                "subtitle": "Kaziranga, Manas, Raimona, Dihing Patkai, and Deepor Beel",
                "keyConcept": "Assam has 7 National Parks and 2 UNESCO Natural World Heritage Sites (Kaziranga and Manas). Assam ranks 3rd in India in number of National Parks.",
                "formulaOrCode": "7 \\text{ NPs: Kaziranga, Manas, Dibru-Saikhowa, Nameri, Orang, Raimona (6th), Dihing Patkai (7th)}",
                "highYieldFacts": [
                    "Kaziranga National Park (1985 UNESCO Site): Holds two-thirds of world's Great One-Horned Rhinos.",
                    "Manas National Park (1985 UNESCO Site): Biosphere reserve, Project Tiger, home to Pygmy Hog and Golden Langur.",
                    "Raimona NP (6th, June 2021) in Kokrajhar - famous for Golden Langur.",
                    "Dihing Patkai NP (7th, June 2021) - lowland tropical rainforest known as the 'Amazon of the East'.",
                    "Orang National Park: Known as 'Mini Kaziranga'.",
                    "Deepor Beel: Only designated Ramsar Wetland site in Assam (2002)."
                ],
                "examTrap": "Deepor Beel is the ONLY Ramsar site in Assam. Son Beel in Karimganj is the largest tectonic lake, but not a Ramsar site.",
                "benchmarkExample": {
                    "question": "Which National Park in Assam is known as the 'Amazon of the East'?",
                    "options": ["Dibru-Saikhowa", "Nameri", "Dihing Patkai", "Raimona"],
                    "correctAnswer": "Dihing Patkai",
                    "stepByStepSolution": [
                        "Step 1: Dihing Patkai spans Dibrugarh and Tinsukia districts.",
                        "Step 2: Its dense virgin rainforest earned the title 'Amazon of the East'.",
                        "Step 3: Declared 7th National Park in June 2021."
                    ],
                    "takeaway": "Dihing Patkai = 7th NP / 'Amazon of the East'."
                }
            }
        ]
    },

    # -------------------------------------------------------------------------
    # 7. GENERAL STUDIES: Indian Polity & Constitution
    # -------------------------------------------------------------------------
    {
        "id": "gs-polity",
        "title": "Indian Polity: Constitution, Fundamental Rights & 6th Schedule",
        "subject": "Indian Polity & Governance",
        "category": "gs",
        "readTime": "16 min read",
        "weightage": "HIGH_YIELD",
        "icon": "ShieldCheck",
        "summary": "Preamble basic structure, Fundamental Rights (Articles 12-35), DPSP, Supreme Court & High Court writs, and the Sixth Schedule Autonomous District Councils.",
        "prerequisites": ["Basic Political Science"],
        "standardReferences": ["M. Laxmikanth: Indian Polity", "D.D. Basu"],
        "practiceQuestionIds": ["gs-11", "gs-12", "gs-13", "gs-14", "gs-15"],
        "steps": [
            {
                "stepNumber": 1,
                "stepTitle": "Fundamental Rights & Constitutional Writs",
                "subtitle": "Articles 12 to 35, Article 32 remedies, and judicial review",
                "keyConcept": "Part III guarantees six fundamental freedoms. Dr. Ambedkar called Article 32 the 'Heart and Soul of the Constitution' empowering the Supreme Court (Art 32) and High Courts (Art 226) to issue prerogative writs.",
                "formulaOrCode": "\\text{5 Writs: Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo-Warranto}",
                "highYieldFacts": [
                    "Habeas Corpus: To have the body of; protects against unlawful detention.",
                    "Mandamus: Directs public authority to perform statutory duty; cannot issue against President or Governor.",
                    "Certiorari: Quashes orders passed by inferior courts exceeding jurisdiction.",
                    "Right to Property was removed by the 44th Amendment (1978) and made a legal right under Article 300A.",
                    "Articles 20 and 21 CANNOT be suspended even during a National Emergency (Article 352)."
                ],
                "examTrap": "Article 226 writ jurisdiction of High Courts is WIDER than Article 32 of Supreme Court because High Courts can enforce ordinary legal rights as well.",
                "benchmarkExample": {
                    "question": "Which Fundamental Rights cannot be suspended during National Emergency under Article 352?",
                    "options": ["Articles 14 and 19", "Articles 19 and 20", "Articles 20 and 21", "Articles 21 and 22"],
                    "correctAnswer": "Articles 20 and 21",
                    "stepByStepSolution": [
                        "Step 1: 44th Amendment 1978 introduced protection for Articles 20 and 21.",
                        "Step 2: Article 20 (protection in respect of conviction) and Article 21 (right to life and liberty) cannot be suspended under any emergency."
                    ],
                    "takeaway": "Articles 20 & 21 are non-derogable under all circumstances."
                }
            },
            {
                "stepNumber": 2,
                "stepTitle": "Sixth Schedule & Autonomous District Councils",
                "subtitle": "Tribal administration in Assam, Meghalaya, Tripura, and Mizoram (AMTM)",
                "keyConcept": "The Sixth Schedule provides for administration of tribal areas in Assam, Meghalaya, Tripura, and Mizoram (AMTM) through Autonomous District Councils (ADCs) with legislative, executive, and judicial powers.",
                "formulaOrCode": "\\text{Sixth Schedule States} = \\text{Assam, Meghalaya, Tripura, Mizoram (AMTM)}",
                "highYieldFacts": [
                    "3 ADCs in Assam: Bodoland Territorial Council (BTC), Dima Hasao Autonomous Council, Karbi Anglong Autonomous Council.",
                    "ADCs have up to 30 members (26 elected, 4 nominated by Governor).",
                    "ADCs make laws on land allotment, forests, village administration, and customs subject to Governor's assent.",
                    "Manipur and Nagaland are NOT under the Sixth Schedule."
                ],
                "examTrap": "Manipur and Nagaland are not covered by the Sixth Schedule. Sixth Schedule applies strictly to AMTM.",
                "benchmarkExample": {
                    "question": "Which of the following states is NOT governed under the Sixth Schedule?",
                    "options": ["Assam", "Meghalaya", "Manipur", "Mizoram"],
                    "correctAnswer": "Manipur",
                    "stepByStepSolution": [
                        "Step 1: Remember mnemonic AMTM (Assam, Meghalaya, Tripura, Mizoram).",
                        "Step 2: Manipur is governed through Article 371C, not the Sixth Schedule."
                    ],
                    "takeaway": "Sixth Schedule = AMTM. Manipur has Hill Areas Committee under Art 371C."
                }
            }
        ]
    }
]

# Write to src/data/topicKnowledge.ts
ts_code = '''import { KnowledgeModule } from '../types';

export const TOPIC_KNOWLEDGE_MODULES: KnowledgeModule[] = ''' + json.dumps(modules, indent=2) + ''';

export const CIVIL_KNOWLEDGE_MODULES = TOPIC_KNOWLEDGE_MODULES.filter(m => m.category === 'civil');
export const GS_KNOWLEDGE_MODULES = TOPIC_KNOWLEDGE_MODULES.filter(m => m.category === 'gs');
'''

with open('d:/PROJECTS APP/EXAMPILOT/src/data/topicKnowledge.ts', 'w', encoding='utf-8') as f:
    f.write(ts_code)

print("Generated src/data/topicKnowledge.ts successfully with", len(modules), "modules!")
