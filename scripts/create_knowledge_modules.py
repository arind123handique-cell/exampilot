# Python script to generate comprehensive Knowledge Modules for ExamPilot AI
import json

modules = [
    # -------------------------------------------------------------
    # CIVIL ENGINEERING MODULES
    # -------------------------------------------------------------
    {
        "id": "civil-rcc-is456",
        "title": "RCC Limit State Design & IS 456:2000",
        "subject": "Reinforced Concrete Structures",
        "category": "civil",
        "readTime": "15 min read",
        "weightage": "HIGH_YIELD",
        "icon": "Building2",
        "summary": "Limit state design philosophy, rectangular and flanged beams, shear design, bond and anchorage, torsion, and serviceability deflection checks under IS 456:2000.",
        "prerequisites": ["Basic Mechanics of Solids", "Concrete Technology"],
        "standardReferences": ["IS 456:2000 Cl. 38 & 39", "SP 16 Design Aids"],
        "practiceQuestionIds": ["civil-1", "civil-2", "civil-3", "civil-4", "civil-5", "civil-6"],
        "steps": [
            {
                "stepNumber": 1,
                "stepTitle": "Limit State Philosophy & Stress Block Parameters",
                "subtitle": "Foundational assumptions and rectangular stress distribution",
                "keyConcept": "IS 456:2000 adopts the Limit State Method (LSM) which ensures safety at ultimate load and serviceability during working life. The concrete compressive stress block is assumed parabolic up to 0.002 strain and uniform rectangular up to ultimate strain of 0.0035 in flexure.",
                "formulaOrCode": "C = 0.36 f_ck b x_u \\quad \\text{acting at } 0.42 x_u \\text{ from extreme compression fiber}\\nT = 0.87 f_y A_{st} \\quad \\text{acting at tension centroid}",
                "highYieldFacts": [
                    "Maximum compressive strain in concrete in bending is 0.0035.",
                    "Maximum compressive strain in direct axial compression is 0.002.",
                    "Tensile strain in steel at failure must not be less than: (0.87 f_y / E_s) + 0.002.",
                    "Limiting depth of neutral axis (x_u,max / d): Fe 250 = 0.53, Fe 415 = 0.48, Fe 500 = 0.46."
                ],
                "examTrap": "Candidates often confuse balanced section parameters between LSM and WSM. In LSM, x_u,max / d depends ONLY on the grade of steel (f_y) and is completely independent of the grade of concrete (f_ck).",
                "benchmarkExample": {
                    "question": "For a singly reinforced beam of width 250 mm and effective depth 450 mm using M25 concrete and Fe 415 steel, calculate the limiting moment of resistance (M_u,lim).",
                    "options": ["115.3 kN·m", "140.2 kN·m", "165.7 kN·m", "190.5 kN·m"],
                    "correctAnswer": "140.2 kN·m",
                    "stepByStepSolution": [
                        "Step 1: Identify limiting factor for Fe 415: x_u,max / d = 0.48.",
                        "Step 2: Limiting neutral axis: x_u,max = 0.48 * 450 = 216 mm.",
                        "Step 3: Lever arm: j*d = d - 0.42 * x_u,max = 450 - (0.42 * 216) = 359.28 mm.",
                        "Step 4: M_u,lim = 0.36 * f_ck * b * x_u,max * (d - 0.42 x_u,max) = 0.36 * 25 * 250 * 216 * 359.28 = 140.2 * 10^6 N·mm = 140.2 kN·m."
                    ],
                    "takeaway": "Direct shortcut for Fe 415: M_u,lim = 0.138 * f_ck * b * d^2."
                }
            },
            {
                "stepNumber": 2,
                "stepTitle": "Shear, Diagonal Tension & Stirrup Design",
                "subtitle": "Mechanics of shear transfer, nominal shear stress, and minimum shear steel",
                "keyConcept": "Diagonal tension creates 45-degree cracks in concrete near supports where shear force is maximum. Concrete resists nominal shear stress tau_c, and any excess shear (V_us = V_u - tau_c * b * d) must be carried by vertical or inclined shear reinforcement.",
                "formulaOrCode": "\\tau_v = \\frac{V_u}{b d} \\le \\tau_{c,max} \\quad ; \\quad V_{us} = \\frac{0.87 f_y A_{sv} d}{s_v}",
                "highYieldFacts": [
                    "If tau_v < 0.5 tau_c, no shear reinforcement is theoretically required, but minimum shear reinforcement is still mandatory in beams.",
                    "If 0.5 tau_c <= tau_v <= tau_c, provide nominal/minimum stirrups per formula.",
                    "Minimum shear reinforcement formula: (A_sv / (b * s_v)) >= 0.4 / (0.87 f_y).",
                    "Maximum spacing of vertical stirrups is minimum of 0.75 d or 300 mm."
                ],
                "examTrap": "If nominal shear stress tau_v exceeds tau_c,max, no amount of stirrups can save the section. The beam must be redesigned by increasing depth or width to prevent brittle compression shear crushing.",
                "benchmarkExample": {
                    "question": "What is the maximum permissible shear stress tau_c,max for M20 grade concrete per IS 456:2000?",
                    "options": ["2.5 N/mm²", "2.8 N/mm²", "3.1 N/mm²", "3.5 N/mm²"],
                    "correctAnswer": "2.8 N/mm²",
                    "stepByStepSolution": [
                        "Step 1: Check Table 20 of IS 456:2000 for maximum shear stress tau_c,max.",
                        "Step 2: Values: M15 = 2.5 N/mm², M20 = 2.8 N/mm², M25 = 3.1 N/mm², M30 = 3.5 N/mm², M35 = 3.7 N/mm², M40+ = 4.0 N/mm².",
                        "Step 3: For M20 concrete, tau_c,max is 2.8 N/mm²."
                    ],
                    "takeaway": "tau_c,max is approximately 0.62 * sqrt(f_ck) in limit state design."
                }
            },
            {
                "stepNumber": 3,
                "stepTitle": "Bond, Anchorage & Development Length",
                "subtitle": "Transfer of forces between steel and concrete without slippage",
                "keyConcept": "Development length L_d is the minimum embedment length required to develop the full design yield stress in reinforcement through surface adhesion and mechanical interlock.",
                "formulaOrCode": "L_d = \\frac{\\phi \\sigma_s}{4 \\tau_{bd}} = \\frac{\\phi (0.87 f_y)}{4 \\tau_{bd}}",
                "highYieldFacts": [
                    "Design bond stress tau_bd in tension for plain bars in M20 concrete is 1.2 N/mm².",
                    "For Deformed bars (HYSD/TMT Fe 415/500), increase tau_bd by 60%.",
                    "For bars in Compression, increase tau_bd by 25%.",
                    "When both deformed bars and compression apply, multiply by 1.6 * 1.25 = 2.0.",
                    "A 90-degree standard bend anchorage value equals 8 * phi (or 4 * phi per 45-degree angle)."
                ],
                "examTrap": "When calculating L_d for HYSD bars in compression, candidates often forget that the 60% and 25% increments are multiplicative, not additive!",
                "benchmarkExample": {
                    "question": "Calculate development length L_d for a 16 mm diameter Fe 415 deformed bar in tension embedded in M20 concrete (tau_bd for plain bar = 1.2 N/mm²).",
                    "options": ["560 mm", "650 mm", "752 mm", "920 mm"],
                    "correctAnswer": "752 mm",
                    "stepByStepSolution": [
                        "Step 1: Design bond stress for HYSD: tau_bd = 1.2 * 1.6 = 1.92 N/mm².",
                        "Step 2: Steel design stress = 0.87 * 415 = 361.05 N/mm².",
                        "Step 3: L_d = (16 * 361.05) / (4 * 1.92) = 5776.8 / 7.68 = 752.18 mm = ~752 mm."
                    ],
                    "takeaway": "As a rule of thumb, for Fe 415 and M20 concrete, L_d is approximately 47 * phi in tension."
                }
            },
            {
                "stepNumber": 4,
                "stepTitle": "Serviceability & Deflection Control",
                "subtitle": "Basic span-to-effective depth ratios and modification factors",
                "keyConcept": "Vertical deflection of beams is controlled without rigorous calculations by adhering to basic span-to-effective depth ratios specified in Cl. 23.2.1 of IS 456:2000 for spans up to 10 m.",
                "formulaOrCode": "\\frac{\\text{Span}}{d} \\le \\text{Basic Ratio} \\times k_t \\times k_c \\times k_f",
                "highYieldFacts": [
                    "Cantilever beam basic span/depth ratio = 7.",
                    "Simply supported beam basic ratio = 20.",
                    "Continuous beam basic ratio = 26.",
                    "For spans > 10 m, multiply by (10 / Span in meters), except for cantilevers.",
                    "Modification factor k_t depends on steel area and service stress f_s = 0.58 * f_y * (A_st,req / A_st,prov)."
                ],
                "examTrap": "For spans greater than 10 meters, the reduction factor (10 / span) does NOT apply to cantilever beams because deflection is calculated using exact structural methods.",
                "benchmarkExample": {
                    "question": "A continuous reinforced concrete beam has a clear span of 8 meters. What is the minimum effective depth required for deflection control if the modification factor is 1.25?",
                    "options": ["200 mm", "246 mm", "310 mm", "350 mm"],
                    "correctAnswer": "246 mm",
                    "stepByStepSolution": [
                        "Step 1: Basic span/depth ratio for continuous beam = 26.",
                        "Step 2: Allowable span/d = 26 * 1.25 = 32.5.",
                        "Step 3: Minimum d = Span / 32.5 = 8000 mm / 32.5 = 246.15 mm = ~246 mm."
                    ],
                    "takeaway": "Always remember: Basic ratios: Cantilever = 7, Simply Supported = 20, Continuous = 26."
                }
            }
        ]
    },
    {
        "id": "civil-som-mechanics",
        "title": "Strength of Materials: Stress, Mohr's Circle & Buckling",
        "subject": "Strength of Materials",
        "category": "civil",
        "readTime": "18 min read",
        "weightage": "HIGH_YIELD",
        "icon": "Layers",
        "summary": "Complex stresses, Mohr's circle of strain and stress, pure bending and shear stress distributions, torsion of shafts, and Euler's column buckling theory.",
        "prerequisites": ["Engineering Mechanics", "Calculus"],
        "standardReferences": ["Gere & Timoshenko Mechanics of Materials", "Bansal SOM"],
        "practiceQuestionIds": ["civil-7", "civil-8", "civil-9", "civil-10", "civil-11"],
        "steps": [
            {
                "stepNumber": 1,
                "stepTitle": "Principal Stresses & Mohr's Circle",
                "subtitle": "Transformation of 2D stress state and maximum shear stress plane",
                "keyConcept": "At any point in a stressed body, there exist planes on which shear stress is zero; these are principal planes, and normal stresses acting on them are principal stresses. Mohr's circle graphically represents normal and shear stresses across any inclined plane.",
                "formulaOrCode": "\\sigma_{1,2} = \\frac{\\sigma_x + \\sigma_y}{2} \\pm \\sqrt{\\left(\\frac{\\sigma_x - \\sigma_y}{2}\\right)^2 + \\tau_{xy}^2} \\quad ; \\quad \\tau_{max} = \\frac{\\sigma_1 - \\sigma_2}{2}",
                "highYieldFacts": [
                    "Center of Mohr's circle is always at ((sigma_x + sigma_y)/2, 0).",
                    "Radius of Mohr's circle equals maximum in-plane shear stress tau_max.",
                    "The plane of maximum shear stress is inclined at 45 degrees to the principal planes.",
                    "Normal stress on planes of maximum shear stress is (sigma_1 + sigma_2) / 2.",
                    "Sum of normal stresses on any two mutually perpendicular planes is invariant: sigma_x + sigma_y = sigma_1 + sigma_2."
                ],
                "examTrap": "Maximum absolute shear stress in a 3D state is max(|sigma_1 - sigma_2|/2, |sigma_2 - sigma_3|/2, |sigma_3 - sigma_1|/2). In pure biaxial tension (sigma_1 > 0, sigma_2 > 0, sigma_3 = 0), tau_abs,max is sigma_1 / 2, not (sigma_1 - sigma_2) / 2!",
                "benchmarkExample": {
                    "question": "At a point in a stressed material, sigma_x = 80 MPa, sigma_y = -20 MPa, and tau_xy = 0. Find the maximum shear stress.",
                    "options": ["30 MPa", "50 MPa", "60 MPa", "100 MPa"],
                    "correctAnswer": "50 MPa",
                    "stepByStepSolution": [
                        "Step 1: Since tau_xy = 0, sigma_x and sigma_y are already principal stresses: sigma_1 = 80 MPa, sigma_2 = -20 MPa.",
                        "Step 2: Maximum in-plane shear stress tau_max = (sigma_1 - sigma_2) / 2.",
                        "Step 3: tau_max = [80 - (-20)] / 2 = 100 / 2 = 50 MPa."
                    ],
                    "takeaway": "When one principal stress is tensile and the other compressive, their magnitudes ADD UP in the shear stress numerator."
                }
            },
            {
                "stepNumber": 2,
                "stepTitle": "Pure Bending & Shear Stress Distribution",
                "subtitle": "Flexural formula, section modulus, and cross-sectional shear patterns",
                "keyConcept": "Bending stress varies linearly from zero at the neutral axis to maximum at the extreme fibers. Shear stress varies parabolically across rectangular and I-sections, reaching maximum at the neutral axis for symmetric cross-sections.",
                "formulaOrCode": "\\frac{M}{I} = \\frac{\\sigma}{y} = \\frac{E}{R} \\quad ; \\quad \\tau = \\frac{V Q}{I b}",
                "highYieldFacts": [
                    "For a rectangular section: tau_max = 1.5 * tau_avg (at neutral axis).",
                    "For a circular solid section: tau_max = (4/3) * tau_avg = 1.33 * tau_avg.",
                    "For a triangular section: tau_max = 1.5 * tau_avg (occurring at h/2 from vertex, whereas NA is at 2h/3 from vertex). At NA, tau = (4/3) * tau_avg.",
                    "In an I-beam, the web carries 85% to 90% of total shear force, while flanges carry over 85% of bending moment."
                ],
                "examTrap": "In a triangular cross-section, maximum shear stress does NOT occur at the neutral axis! It occurs at mid-height (h/2 from base or vertex), where tau_max = 1.5 tau_avg. At the neutral axis (h/3 from base), shear stress is 1.33 tau_avg.",
                "benchmarkExample": {
                    "question": "A beam of rectangular cross section 100 mm x 200 mm is subjected to a shear force of 40 kN. What is the maximum shear stress in the beam?",
                    "options": ["2.0 MPa", "3.0 MPa", "4.5 MPa", "6.0 MPa"],
                    "correctAnswer": "3.0 MPa",
                    "stepByStepSolution": [
                        "Step 1: Cross-sectional area A = 100 * 200 = 20,000 mm².",
                        "Step 2: Average shear stress tau_avg = V / A = 40,000 N / 20,000 mm² = 2.0 N/mm² = 2.0 MPa.",
                        "Step 3: For rectangular section, maximum shear stress at neutral axis is tau_max = 1.5 * tau_avg = 1.5 * 2.0 = 3.0 MPa."
                    ],
                    "takeaway": "Rectangle: tau_max = 1.5 * tau_avg; Circle: tau_max = 1.33 * tau_avg; Triangle mid-depth: tau_max = 1.5 * tau_avg."
                }
            },
            {
                "stepNumber": 3,
                "stepTitle": "Euler's Column Buckling & Effective Length",
                "subtitle": "Critical load, slenderness ratio, and end condition factors",
                "keyConcept": "Long slender columns fail by elastic buckling rather than direct crushing. Euler's critical load depends directly on flexural rigidity EI and inversely on the square of effective length L_e.",
                "formulaOrCode": "P_{cr} = \\frac{\\pi^2 E I}{(L_e)^2} = \\frac{\\pi^2 E A}{\\lambda^2} \\quad \\text{where } \\lambda = \\frac{L_e}{r_{min}}",
                "highYieldFacts": [
                    "Both ends hinged: L_e = L (Ratio P_cr = P).",
                    "Both ends fixed: L_e = L / 2 (Ratio P_cr = 4P).",
                    "One end fixed, other hinged: L_e = L / sqrt(2) = 0.707 L (Ratio P_cr = 2P).",
                    "One end fixed, other free (cantilever): L_e = 2 L (Ratio P_cr = P / 4).",
                    "Euler's formula is valid only when slenderness ratio lambda exceeds critical slenderness ratio (lambda >= pi * sqrt(E / f_y))."
                ],
                "examTrap": "Questions frequently ask for the ratio of critical load when end conditions change from 'both hinged' to 'both fixed'. The critical load increases by 4 times (not 2 times) because L_e is halved and load is inversely proportional to L_e squared!",
                "benchmarkExample": {
                    "question": "A column of length L has both ends hinged with Euler buckling load P. If both ends are now firmly fixed, what is the new Euler buckling load?",
                    "options": ["2 P", "4 P", "8 P", "16 P"],
                    "correctAnswer": "4 P",
                    "stepByStepSolution": [
                        "Step 1: For both ends hinged: L_e1 = L, P_cr1 = pi^2 * E * I / L^2 = P.",
                        "Step 2: For both ends fixed: L_e2 = L / 2.",
                        "Step 3: P_cr2 = pi^2 * E * I / (L / 2)^2 = 4 * (pi^2 * E * I / L^2) = 4 P."
                    ],
                    "takeaway": "Euler Buckling load hierarchy: Fixed-Fixed (4P) > Fixed-Hinged (2P) > Hinged-Hinged (1P) > Fixed-Free (0.25P)."
                }
            }
        ]
    },
    {
        "id": "civil-geotech-soil",
        "title": "Geotechnical Engineering: Consolidation & Shear Strength",
        "subject": "Geotechnical Engineering",
        "category": "civil",
        "readTime": "16 min read",
        "weightage": "HIGH_YIELD",
        "icon": "Mountain",
        "summary": "Soil phase diagrams, permeability, Terzaghi's 1D consolidation theory, Mohr-Coulomb shear criteria, Rankine earth pressures, and bearing capacity.",
        "prerequisites": ["Fluid Mechanics", "Mechanics of Materials"],
        "standardReferences": ["Terzaghi Soil Mechanics", "IS 1892 & IS 6403 Bearing Capacity"],
        "practiceQuestionIds": ["civil-12", "civil-13", "civil-14", "civil-15", "civil-16"],
        "steps": [
            {
                "stepNumber": 1,
                "stepTitle": "Soil Phase Relations & Index Properties",
                "subtitle": "Void ratio, porosity, saturation, and water content derivations",
                "keyConcept": "Soil is a three-phase system composed of solid particles, water, and air voids. The fundamental identity connecting soil moisture and unit weight is S * e = w * G.",
                "formulaOrCode": "S \\cdot e = w \\cdot G \\quad ; \\quad \\gamma = \\frac{G + S e}{1 + e} \\gamma_w \\quad ; \\quad n = \\frac{e}{1 + e}",
                "highYieldFacts": [
                    "Void ratio 'e' can exceed 1 (e > 0), whereas porosity 'n' is strictly 0 < n < 1 (or 0% to 100%).",
                    "Submerged unit weight gamma_sub = gamma_sat - gamma_w = ((G - 1) / (1 + e)) * gamma_w.",
                    "Plasticity Index I_p = Liquid Limit (w_L) - Plastic Limit (w_p).",
                    "A-line equation on plasticity chart: I_p = 0.73 * (w_L - 20). Soils above are inorganic clays (C); below are silts (M) or organic clays (O)."
                ],
                "examTrap": "When classifying cohesive soils on Casagrande's chart, if 4 <= I_p <= 7 and falls near the A-line, it is given dual symbol CL-ML, not just CL.",
                "benchmarkExample": {
                    "question": "A fully saturated soil sample has a water content of 20% and specific gravity of soil solids G = 2.70. What is its void ratio?",
                    "options": ["0.45", "0.54", "0.62", "0.75"],
                    "correctAnswer": "0.54",
                    "stepByStepSolution": [
                        "Step 1: Saturated soil means degree of saturation S = 1.0 (100%).",
                        "Step 2: Use phase equation: S * e = w * G.",
                        "Step 3: 1.0 * e = 0.20 * 2.70 = 0.54.",
                        "Step 4: Void ratio e = 0.54."
                    ],
                    "takeaway": "Always verify S * e = w * G first whenever three of the parameters are given."
                }
            },
            {
                "stepNumber": 2,
                "stepTitle": "Terzaghi's 1D Consolidation Theory",
                "subtitle": "Dissipation of excess pore water pressure and ultimate settlement calculation",
                "keyConcept": "Consolidation is time-dependent settlement caused by gradual expulsion of water from pores under sustained static load in saturated cohesive soils. Terzaghi's differential equation describes the rate of pore pressure dissipation.",
                "formulaOrCode": "\\frac{\\partial u}{\\partial t} = c_v \\frac{\\partial^2 u}{\\partial z^2} \\quad ; \\quad S_f = \\frac{C_c H_0}{1 + e_0} \\log_{10}\\left(\\frac{\\sigma'_0 + \\Delta \\sigma'}{\\sigma'_0}\\right)",
                "highYieldFacts": [
                    "Time factor T_v = (c_v * t) / (d^2).",
                    "Drainage path length 'd': For two-way drainage (permeable top & bottom), d = H/2. For one-way drainage (impermeable rock at base), d = H.",
                    "Because T_v proportional to t / d^2, a clay layer with one-way drainage takes 4 TIMES longer to consolidate than two-way drainage!",
                    "Compression index for normally consolidated clays: C_c = 0.009 * (w_L - 10)."
                ],
                "examTrap": "Drainage distance is squared! If two-way drainage changes to one-way drainage, time required for the same degree of consolidation quadruples (t_one-way = 4 * t_two-way), not doubles.",
                "benchmarkExample": {
                    "question": "A clay layer of thickness 4 m with double drainage undergoes 50% consolidation in 1 year. If the layer has single drainage with impermeable bedrock at bottom, how many years will it take for the same 50% consolidation?",
                    "options": ["1 year", "2 years", "4 years", "8 years"],
                    "correctAnswer": "4 years",
                    "stepByStepSolution": [
                        "Step 1: Time factor T_v is constant for identical degree of consolidation (50%).",
                        "Step 2: t is proportional to d^2.",
                        "Step 3: Double drainage: d_1 = H / 2 = 2 m. Single drainage: d_2 = H = 4 m.",
                        "Step 4: t_2 = t_1 * (d_2 / d_1)^2 = 1 * (4 / 2)^2 = 1 * 4 = 4 years."
                    ],
                    "takeaway": "Single drainage takes 4 times longer than double drainage for the same consolidation degree."
                }
            },
            {
                "stepNumber": 3,
                "stepTitle": "Mohr-Coulomb Shear Strength & Lateral Earth Pressure",
                "subtitle": "Cohesion, angle of internal friction, and active/passive Rankine states",
                "keyConcept": "Soil resists shear through particle interlocking and friction plus inter-particle cohesion: tau_f = c + sigma_n * tan(phi). In lateral earth pressures, active state occurs as the wall moves away from backfill, mobilizing full shear strength with minimum pressure.",
                "formulaOrCode": "\\tau_f = c' + \\sigma'_n \\tan \\phi' \\quad ; \\quad K_a = \\frac{1 - \\sin \\phi}{1 + \\sin \\phi} = \\tan^2(45^\\circ - \\phi/2) \\quad ; \\quad K_p = \\frac{1}{K_a}",
                "highYieldFacts": [
                    "For purely cohesive clay (phi = 0): K_a = K_p = 1.",
                    "Critical depth of unsupported vertical cut in purely cohesive soil: H_c = 4c / (gamma * sqrt(K_a)) = 4c / gamma.",
                    "Depth of tension crack in cohesive soil: z_0 = 2c / (gamma * sqrt(K_a)).",
                    "Net lateral pressure is zero at depth z_0, and total active thrust is zero at depth 2 * z_0.",
                    "Passive earth pressure is significantly larger than active pressure (K_p = 1 / K_a)."
                ],
                "examTrap": "Do not confuse depth of tension crack (z_0 = 2c/gamma) with depth of unsupported vertical cut (H_c = 4c/gamma). An unsupported cut can stand up to twice the tension crack depth!",
                "benchmarkExample": {
                    "question": "For a sandy backfill with angle of internal friction phi = 30 degrees, determine Rankine's active earth pressure coefficient K_a and passive coefficient K_p.",
                    "options": ["K_a = 0.5, K_p = 2.0", "K_a = 0.333, K_p = 3.0", "K_a = 0.25, K_p = 4.0", "K_a = 0.67, K_p = 1.5"],
                    "correctAnswer": "K_a = 0.333, K_p = 3.0",
                    "stepByStepSolution": [
                        "Step 1: Formula for K_a = (1 - sin phi) / (1 + sin phi).",
                        "Step 2: For phi = 30 degrees, sin(30) = 0.5.",
                        "Step 3: K_a = (1 - 0.5) / (1 + 0.5) = 0.5 / 1.5 = 1/3 = 0.333.",
                        "Step 4: K_p = 1 / K_a = 3.0."
                    ],
                    "takeaway": "For phi = 30 degrees, K_a is always 1/3 and K_p is always 3. This is the most frequently tested angle in exams."
                }
            }
        ]
    },
    {
        "id": "civil-transportation-irc",
        "title": "Transportation Engineering & IRC Geometric Design",
        "subject": "Transportation Engineering",
        "category": "civil",
        "readTime": "15 min read",
        "weightage": "HIGH_YIELD",
        "icon": "Compass",
        "summary": "Highway geometric alignment per IRC 73, Stopping Sight Distance (SSD), Overtaking Sight Distance (OSD), super-elevation, transition curves, and CBR pavement design.",
        "prerequisites": ["Surveying", "Fluid Mechanics"],
        "standardReferences": ["IRC: 73-1980 Geometric Design", "IRC: 37 Pavement Design"],
        "practiceQuestionIds": ["civil-17", "civil-18", "civil-19", "civil-20"],
        "steps": [
            {
                "stepNumber": 1,
                "stepTitle": "Stopping Sight Distance (SSD) & Reaction Time",
                "subtitle": "Lag distance, braking distance, and longitudinal friction per IRC 73",
                "keyConcept": "Stopping Sight Distance (SSD) is the minimum visible distance ahead required for an alert driver travelling at design speed to bring the vehicle to a complete stop before hitting a stationary object (object height = 0.15 m, driver eye height = 1.2 m).",
                "formulaOrCode": "SSD = v t + \\frac{v^2}{2 g f} = 0.278 V t + \\frac{V^2}{254 (f \\pm n)}",
                "highYieldFacts": [
                    "IRC standard perception-reaction time for SSD is t = 2.5 seconds (based on PIEV theory).",
                    "Coefficient of longitudinal friction 'f' decreases from 0.40 (at 20 km/h) to 0.35 (at 100 km/h).",
                    "Intermediate Sight Distance (ISD) = 2 * SSD (used when OSD cannot be provided).",
                    "Headlight Sight Distance (HSD) for night driving = SSD.",
                    "On descending gradient (-n%), braking distance increases: denominator becomes 254 * (f - n/100)."
                ],
                "examTrap": "Reaction time for SSD is 2.5 seconds, but reaction time for OSD (Overtaking Sight Distance) is 2.0 seconds per IRC guidelines!",
                "benchmarkExample": {
                    "question": "Calculate the stopping sight distance for a design speed of 80 km/h on a level road assuming reaction time 2.5 s and friction coefficient f = 0.35.",
                    "options": ["95.4 m", "127.6 m", "154.2 m", "175.8 m"],
                    "correctAnswer": "127.6 m",
                    "stepByStepSolution": [
                        "Step 1: Lag distance = 0.278 * V * t = 0.278 * 80 * 2.5 = 55.6 m.",
                        "Step 2: Braking distance = V^2 / (254 * f) = 80^2 / (254 * 0.35) = 6400 / 88.9 = 71.99 m = ~72 m.",
                        "Step 3: Total SSD = 55.6 + 72.0 = 127.6 m."
                    ],
                    "takeaway": "SSD = Lag Distance (0.278*V*t) + Braking Distance (V^2 / 254*f)."
                }
            },
            {
                "stepNumber": 2,
                "stepTitle": "Super-elevation & Curve Radius",
                "subtitle": "Counteracting centrifugal force, maximum limits, and equilibrium speed",
                "keyConcept": "To counteract outward centrifugal force on a horizontal curve, the outer edge of pavement is elevated above the inner edge. Super-elevation 'e' is limited to prevent slow-moving vehicles from toppling inward.",
                "formulaOrCode": "e + f = \\frac{V^2}{127 R} \\quad ; \\quad e_{design} = \\frac{V^2}{225 R} \\quad \\text{(neglecting 75% of design speed for friction)}",
                "highYieldFacts": [
                    "Maximum super-elevation per IRC: Plain & rolling terrain = 7% (0.07).",
                    "Maximum super-elevation for Hilly terrain not bound by snow = 10% (0.10).",
                    "Maximum super-elevation for Hilly terrain bound by snow = 7% (0.07).",
                    "Maximum super-elevation for Urban roads with frequent intersections = 4% (0.04).",
                    "Minimum lateral friction factor f_lat = 0.15."
                ],
                "examTrap": "When designing super-elevation per IRC steps: Step 1 uses 75% speed (e = V^2 / 225R). If e <= 0.07, accept that value. If e > 0.07, fix e = 0.07 and check friction: f = (V^2 / 127R) - 0.07. If f > 0.15, design speed must be restricted!",
                "benchmarkExample": {
                    "question": "A highway curve with radius 300 m has a design speed of 60 km/h. Calculate the required super-elevation neglecting lateral friction per IRC guidelines.",
                    "options": ["0.035", "0.053", "0.070", "0.082"],
                    "correctAnswer": "0.053",
                    "stepByStepSolution": [
                        "Step 1: IRC formula for mixed traffic (75% speed): e = V^2 / (225 * R).",
                        "Step 2: e = 60^2 / (225 * 300) = 3600 / 67,500 = 0.0533.",
                        "Step 3: Since 0.0533 <= 0.07 (7%), design super-elevation e = 0.053 (5.3%)."
                    ],
                    "takeaway": "Always use e = V^2 / 225R for initial design of super-elevation under IRC rules."
                }
            }
        ]
    },

    # -------------------------------------------------------------
    # GENERAL STUDIES MODULES
    # -------------------------------------------------------------
    {
        "id": "gs-assam-history",
        "title": "History & Heritage of Assam: Ahom Era & Freedom Movement",
        "subject": "Assam History & Heritage",
        "category": "gs",
        "readTime": "20 min read",
        "weightage": "HIGH_YIELD",
        "icon": "Crown",
        "summary": "Ancient Pragjyotisha-Kamarupa, the 600-year Ahom Kingdom (1228–1826), Battle of Saraighat, Paik system, Treaty of Yandabo, and Assam's vanguard role in India's Freedom Struggle.",
        "prerequisites": ["General Indian History overview"],
        "standardReferences": ["Edward Gait: A History of Assam", "Dr. S.L. Baruah: Comprehensive History of Assam"],
        "practiceQuestionIds": ["gs-1", "gs-2", "gs-3", "gs-4", "gs-5"],
        "steps": [
            {
                "stepNumber": 1,
                "stepTitle": "Pre-Ahom Kamarupa & Ancient Dynasties",
                "subtitle": "Pragjyotisha, Varman dynasty, and Kumar Bhaskaravarman",
                "keyConcept": "Ancient Assam was known as Pragjyotisha in the Epics and Kamarupa in classical Sanskrit literature (Allahabad Pillar Inscription of Samudragupta mentions Kamarupa as a frontier kingdom). The Varman dynasty (4th-7th century CE) established sovereignty, peaking under Kumar Bhaskaravarman.",
                "formulaOrCode": "\\text{Dynastic Sequence: Varman } \\to \\text{Salasthambha (Mlechha) } \\to \\text{Pala Dynasty}",
                "highYieldFacts": [
                    "Pushyavarman was the founder of the Varman dynasty (~350 CE).",
                    "Kumar Bhaskaravarman was a close ally of King Harshavardhana of Kannauj and hosted Chinese Buddhist pilgrim Hiuen Tsang (Xuanzang) in 643 CE.",
                    "Hiuen Tsang recorded Kamarupa in his travelogue 'Si-Yu-Ki', noting flourishing education, silk weaving, and temple architecture.",
                    "Narakasura and his son Bhagadatta (who fought on the Kaurava side in Mahabharata) are regarded as legendary rulers of Pragjyotisha."
                ],
                "examTrap": "Candidates often confuse the two kings who were contemporaries: Kumar Bhaskaravarman was contemporary to Harshavardhana of Kannauj, NOT Chandragupta Maurya.",
                "benchmarkExample": {
                    "question": "Which Chinese pilgrim visited Kamarupa in the 7th century during the reign of Kumar Bhaskaravarman?",
                    "options": ["Fa-Hien", "Hiuen Tsang (Xuanzang)", "I-Tsing", "Song Yun"],
                    "correctAnswer": "Hiuen Tsang (Xuanzang)",
                    "stepByStepSolution": [
                        "Step 1: Identify reign of Kumar Bhaskaravarman (first half of 7th century CE).",
                        "Step 2: Xuanzang (Hiuen Tsang) travelled in India during Harshavardhana's reign (629-645 CE).",
                        "Step 3: At the invitation of Bhaskaravarman, Hiuen Tsang visited Kamarupa in 643 CE and described the country in 'Si-Yu-Ki'."
                    ],
                    "takeaway": "Hiuen Tsang = 7th Century, Kumar Bhaskaravarman & Harshavardhana contemporary."
                }
            },
            {
                "stepNumber": 2,
                "stepTitle": "The Ahom Kingdom (1228–1826) & Administrative System",
                "subtitle": "Sukapha's arrival, Paik System, Buranjis, and administrative hierarchy",
                "keyConcept": "Chaolung Sukapha, a Shan/Tai prince from Mong Mao, crossed the Patkai hills and entered the Brahmaputra Valley in 1228 CE, establishing his capital at Charaideo in 1253. The Ahoms ruled for nearly 600 years through their unique administrative, economic, and military system known as the Paik system.",
                "formulaOrCode": "\\text{Paik Structure: 4 Paiks (later 3) = 1 Got} \\quad ; \\quad 20 \\text{ Paiks} = \\text{Bora}, \\quad 100 = \\text{Saikia}, \\quad 1000 = \\text{Hazarika}",
                "highYieldFacts": [
                    "Chaolung Sukapha arrived in 1228 CE; established capital at Charaideo (now a UNESCO World Heritage Site).",
                    "Paik System: Every able-bodied adult male (aged 15 to 50) was registered as a Paik, providing compulsory state labor and military service in rotation.",
                    "Officers hierarchy: Bora (20 paiks), Saikia (100 paiks), Hazarika (1,000 paiks), Phukan / Rajkhowa (larger administrative commands).",
                    "Council of Ministers: Patra Mantris (Borgohain, Burhagohain, Barpatragohain created by Suhungmung).",
                    "Buranjis: Official state historical chronicles written in Ahom and Assamese language."
                ],
                "examTrap": "The office of Barpatragohain was NOT created by Sukapha. It was added as the third premier councilor by King Suhungmung (Dihingia Raja) in the early 16th century.",
                "benchmarkExample": {
                    "question": "Which Ahom king introduced the third minister position 'Barpatragohain' in the council of ministers?",
                    "options": ["Chaolung Sukapha", "Suhungmung (Dihingia Raja)", "Pratap Singha", "Rudra Singha"],
                    "correctAnswer": "Suhungmung (Dihingia Raja)",
                    "stepByStepSolution": [
                        "Step 1: The original council established by Sukapha included only Borgohain and Burhagohain.",
                        "Step 2: King Suhungmung expanded the kingdom significantly and established Barpatragohain as the 3rd minister.",
                        "Step 3: Suhungmung also adopted the Hindu title 'Swarganarayan' and introduced the Saka Era into royal coins."
                    ],
                    "takeaway": "Suhungmung: Created Barpatragohain, defeated Kacharis, introduced Saka era."
                }
            },
            {
                "stepNumber": 3,
                "stepTitle": "Lachit Borphukan & The Battle of Saraighat (1671)",
                "subtitle": "Mughal invasion under Ram Singh, river warfare, and defense of Kamrup",
                "keyConcept": "The Battle of Saraighat (1671) was the greatest naval confrontation on the Brahmaputra River between the Mughal imperial fleet led by Raja Ram Singh I of Amber and the Ahom armed forces led by General Lachit Borphukan, preserving Assam's sovereignty.",
                "formulaOrCode": "\\text{Saraighat (1671): Ahom Naval Guerrilla Strategy} > \\text{Mughal Heavy Artillery & Cavalry}",
                "highYieldFacts": [
                    "King Chakradhwaj Singha appointed Lachit as Borphukan (governor and military commander of Lower Assam).",
                    "Lachit constructed earthen ramparts (Garhs) and stockades along Guwahati, including the Itakhuli fort.",
                    "Famous quote: 'Dexot koi Momai dangor nohoi' (My uncle is not greater than my motherland), uttered after beheading his maternal uncle for dereliction of duty on the ramparts.",
                    "Ahom naval warfare utilized light, agile Bachari boats suited to the treacherous Brahmaputra currents, routing the heavier Mughal vessels.",
                    "Lachit Maidam is situated at Hoolungapara near Jorhat."
                ],
                "examTrap": "Mir Jumla's invasion occurred in 1662-63 during Jayadhwaj Singha's reign (resulting in the Treaty of Ghilajharighat). Saraighat occurred in 1671 under Chakradhwaj Singha / Udayaditya Singha. Do not confuse the two!",
                "benchmarkExample": {
                    "question": "Who was the Ahom King during the historic Battle of Saraighat in 1671?",
                    "options": ["Jayadhwaj Singha", "Chakradhwaj Singha", "Rudra Singha", "Gadadhar Singha"],
                    "correctAnswer": "Chakradhwaj Singha",
                    "stepByStepSolution": [
                        "Step 1: Chakradhwaj Singha resolved to liberate Guwahati from Mughal occupation and appointed Lachit Borphukan in 1667.",
                        "Step 2: The war concluded with the decisive naval battle of Saraighat in 1671.",
                        "Step 3: Chakradhwaj Singha passed away shortly before the final climax, succeeded by Udayaditya Singha, but the war planning and appointment were under Chakradhwaj Singha."
                    ],
                    "takeaway": "Chakradhwaj Singha inspired the reconquest; Lachit Borphukan executed the military strategy."
                }
            },
            {
                "stepNumber": 4,
                "stepTitle": "British Annexation & Freedom Movement in Assam",
                "subtitle": "Treaty of Yandabo (1826), peasant uprisings, and national movement martyrs",
                "keyConcept": "Following the devastating Burmese invasions (Maanor Din), the British expelled the Burmese and annexed Assam under the Treaty of Yandabo on 24 February 1826. Assam actively mobilized in 1857, agrarian peasant revolts, Non-Cooperation, and Quit India 1942.",
                "formulaOrCode": "1826 \\text{ (Treaty of Yandabo)} \\to 1858 \\text{ (Maniram Dewan)} \\to 1861 \\text{ (Phulaguri)} \\to 1894 \\text{ (Patharughat)} \\to 1942 \\text{ (Quit India)}",
                "highYieldFacts": [
                    "Treaty of Yandabo (24 Feb 1826) ended the First Anglo-Burmese War and handed Assam to the British East India Company.",
                    "Maniram Dewan and Piyali Baruah were hanged on 26 February 1858 in Jorhat for conspiring in the 1857 revolt.",
                    "Phulaguri Dhawa (1861): First organized peasant uprising against the British ban on poppy cultivation and proposed betel nut tax.",
                    "Patharughat Battle / Revolt (1894) in Darrang district: Over 140 peasants martyred when British police fired on peaceful Raij-Mels protesting exorbitant land revenues (termed Assam's Jallianwala Bagh).",
                    "Kanaklata Barua (17-year-old) and Mukunda Kakati were martyred on 20 September 1942 while attempting to hoist the tricolour at Gohpur police station during the Quit India movement.",
                    "Kushal Konwar: The only martyr in India who was executed by hanging during the Quit India Movement (15 June 1943 at Jorhat Jail)."
                ],
                "examTrap": "Kushal Konwar was the ONLY martyr in the entire country who was hanged during the Quit India movement of 1942, falsely accused of train derailment at Sarupathar.",
                "benchmarkExample": {
                    "question": "Which peasant movement in Assam that took place in 1894 is often referred to as the 'Jallianwala Bagh of Assam'?",
                    "options": ["Phulaguri Dhawa", "Patharughat Peasant Uprising", "Rangiya Revolt", "Lachima Uprising"],
                    "correctAnswer": "Patharughat Peasant Uprising",
                    "stepByStepSolution": [
                        "Step 1: In 1894 at Patharughat (Darrang district), thousands of peasants gathered in a Raij-Mel to protest 70-80% land revenue hikes.",
                        "Step 2: Deputy Commissioner J.R. Berington ordered unprovoked firing, killing 140 peasants.",
                        "Step 3: Due to the scale of unarmed civilian sacrifice, it is commemorated as the Jallianwala Bagh of Assam."
                    ],
                    "takeaway": "Patharughat (1894) = Land tax protest & 'Assam's Jallianwala Bagh'; Phulaguri (1861) = First peasant uprising."
                }
            }
        ]
    },
    {
        "id": "gs-india-geography",
        "title": "Geography of India & Assam: Physiography & Drainage",
        "subject": "Geography of India & Assam",
        "category": "gs",
        "readTime": "18 min read",
        "weightage": "HIGH_YIELD",
        "icon": "MapPin",
        "summary": "Physiographic divisions of India, the Indian Monsoon system, drainage basins of the Brahmaputra and Barak rivers, Assam hills, protected areas, and rich biodiversity.",
        "prerequisites": ["Basic Physical Geography"],
        "standardReferences": ["Majid Husain: Geography of India", "D.R. Khullar"],
        "practiceQuestionIds": ["gs-6", "gs-7", "gs-8", "gs-9", "gs-10"],
        "steps": [
            {
                "stepNumber": 1,
                "stepTitle": "Physiography of Assam & North-East India",
                "subtitle": "Brahmaputra Valley, Barak Valley, and Karbi-Barail highlands",
                "keyConcept": "Assam is divided into three distinct physiographic units: (1) The Brahmaputra Valley in the north, (2) The Barak (Surma) Valley in the south, and (3) The Central Assam Hills (Karbi Anglong and Dima Hasao) separating the two valleys.",
                "formulaOrCode": "\\text{Total Area of Assam} = 78,438 \\text{ km}^2 \\quad (\\sim 2.39\\% \\text{ of India's geographical area})",
                "highYieldFacts": [
                    "Brahmaputra Valley extends ~720 km in length from Sadiya in the east to Dhubri in the west.",
                    "Barak Valley comprises three districts: Cachar, Karimganj, and Hailakandi.",
                    "The Karbi Anglong plateau is geologically an extension of the ancient Indian Peninsular Shield (Shillong Plateau), not young fold mountains!",
                    "Barail Range is the highest mountain range in Assam, connecting the Meghalaya Plateau with the Naga Hills.",
                    "Highest peak of Assam is 'Laike' peak in the Barail Range (~1,959 m)."
                ],
                "examTrap": "Karbi Anglong and the Meghalaya Plateau are NOT part of the Himalayas; they are ancient fragments of the Gondwanaland Peninsular Block separated by the Malda Gap!",
                "benchmarkExample": {
                    "question": "Geologically, the Karbi Anglong and Meghalaya Plateau are an extension of which physiographic division of India?",
                    "options": ["The Northern Himalayas", "The Peninsular Deccan Shield", "The Indo-Gangetic Plains", "The Coastal Plains"],
                    "correctAnswer": "The Peninsular Deccan Shield",
                    "stepByStepSolution": [
                        "Step 1: Geologists classify the Shillong Plateau and Karbi Hills as horsts of the Archaean gneissic complex.",
                        "Step 2: They were separated from the Chota Nagpur Plateau during the Himalayan collision by downfaulting (Garo-Rajmahal Gap or Malda Gap).",
                        "Step 3: Hence, they belong to the ancient Peninsular Shield."
                    ],
                    "takeaway": "Karbi Anglong and Shillong Plateau = Ancient Peninsular Shield (Gondwanaland), NOT the Himalayas."
                }
            },
            {
                "stepNumber": 2,
                "stepTitle": "River Brahmaputra & Its Tributaries",
                "subtitle": "Origins as Yarlung Tsangpo, major north/south bank tributaries, and Majuli Island",
                "keyConcept": "The Brahmaputra originates from the Chemayungdung glacier near Lake Manasarovar in Tibet as the Yarlung Tsangpo. It cuts through the Himalayas at Namcha Barwa forming the Great Bend and enters Arunachal Pradesh as the Siang/Dihang, becoming the Brahmaputra after joining the Dibang and Lohit at Kobo.",
                "formulaOrCode": "\\text{Brahmaputra Length} \\approx 2,880 \\text{ km (916 km in India)} \\quad ; \\quad \\text{Braided River with sandbars (Chars)}",
                "highYieldFacts": [
                    "North-Bank Tributaries (snow-fed, high sediment): Subansiri (largest), Kameng (Jia Bharali), Manas, Beki, Sankosh, Puthimari, Pagladiya.",
                    "South-Bank Tributaries (rain-fed): Burhi Dihing, Disang, Dikhow, Dhansiri (South), Kopili, Kulsi, Krishnai.",
                    "Subansiri is the largest tributary of the Brahmaputra River.",
                    "Majuli: The world's largest inhabited freshwater river island, formed between the Brahmaputra and Kherkutia Xuti (an anabranch joined by Subansiri). First river island district in India (2016).",
                    "National Waterway 1 (NW-1) is Ganga-Bhagirathi-Hooghly; National Waterway 2 (NW-2) is the Brahmaputra River from Sadiya to Dhubri (891 km)."
                ],
                "examTrap": "Be very clear on North-Bank vs South-Bank tributaries: Subansiri, Jia Bharali, and Manas flow from the north (Himalayas). Dhansiri, Dikhow, Kopili, and Burhi Dihing flow from the south.",
                "benchmarkExample": {
                    "question": "Which of the following is the largest tributary of the Brahmaputra River in terms of discharge and basin area?",
                    "options": ["Manas", "Subansiri", "Burhi Dihing", "Kopili"],
                    "correctAnswer": "Subansiri",
                    "stepByStepSolution": [
                        "Step 1: The Subansiri ('Gold River') originates in Tibet and flows through Arunachal Pradesh and Assam.",
                        "Step 2: It contributes over 8% of the total flow of the Brahmaputra River, making it the single largest tributary.",
                        "Step 3: Manas and Kopili are also significant, but smaller than Subansiri."
                    ],
                    "takeaway": "Subansiri = Largest tributary; NW-2 = Sadiya to Dhubri on Brahmaputra (891 km)."
                }
            },
            {
                "stepNumber": 3,
                "stepTitle": "Protected Areas & National Parks of Assam",
                "subtitle": "The 7 National Parks, UNESCO World Heritage Sites, and biodiversity hotspots",
                "keyConcept": "Assam hosts 7 National Parks and two UNESCO Natural World Heritage Sites (Kaziranga and Manas). Assam ranks 3rd in India in terms of number of national parks (after Madhya Pradesh and Andaman & Nicobar).",
                "formulaOrCode": "7 \\text{ National Parks: Kaziranga, Manas, Dibru-Saikhowa, Nameri, Orang, Raimona (6th), Dihing Patkai (7th)}",
                "highYieldFacts": [
                    "Kaziranga National Park: Declared World Heritage Site in 1985; home to two-thirds of the world's Great One-Horned Rhinoceros (Rhinoceros unicornis); Tiger Reserve (2006).",
                    "Manas National Park: Declared World Heritage Site in 1985; Biosphere Reserve; Project Tiger and Project Elephant reserve; home to Pygmy Hog and Golden Langur.",
                    "Raimona National Park (6th NP, notified June 2021) in Kokrajhar (Bodoland) - famous for Golden Langur.",
                    "Dihing Patkai National Park (7th NP, notified June 2021) - known as 'The Amazon of the East' (rainforest with wild elephants and seven wild cat species).",
                    "Orang National Park: Known as the 'Mini Kaziranga' due to identical rhino landscape.",
                    "Deepor Beel: Only Ramsar Wetland site in Assam (designated 2002), located southwest of Guwahati."
                ],
                "examTrap": "Deepor Beel is the ONLY Ramsar site in Assam. Son Beel in Karimganj is the largest tectonic lake/wetland in Assam, but it is not yet a designated Ramsar site.",
                "benchmarkExample": {
                    "question": "Which National Park in Assam is famously known as the 'Amazon of the East'?",
                    "options": ["Dibru-Saikhowa", "Nameri", "Dihing Patkai", "Raimona"],
                    "correctAnswer": "Dihing Patkai",
                    "stepByStepSolution": [
                        "Step 1: Dihing Patkai is a vast contiguous stretch of lowland tropical rainforest located in Dibrugarh and Tinsukia districts.",
                        "Step 2: Because of its dense canopy and rich biodiversity, it is referred to as the 'Amazon of the East'.",
                        "Step 3: It was upgraded to Assam's 7th National Park in June 2021."
                    ],
                    "takeaway": "Dihing Patkai = 7th NP / 'Amazon of the East'; Raimona = 6th NP; Deepor Beel = Only Ramsar site."
                }
            }
        ]
    },
    {
        "id": "gs-india-polity",
        "title": "Indian Polity: Constitution, Fundamental Rights & 6th Schedule",
        "subject": "Indian Polity & Governance",
        "category": "gs",
        "readTime": "16 min read",
        "weightage": "HIGH_YIELD",
        "icon": "ShieldCheck",
        "summary": "Preamble philosophy, Fundamental Rights vs DPSP, Parliament and State Legislatures, Judicial Review, Emergency powers, and the 6th Schedule Autonomous District Councils.",
        "prerequisites": ["Basic Political Science"],
        "standardReferences": ["M. Laxmikanth: Indian Polity", "D.D. Basu"],
        "practiceQuestionIds": ["gs-11", "gs-12", "gs-13", "gs-14", "gs-15"],
        "steps": [
            {
                "stepNumber": 1,
                "stepTitle": "Fundamental Rights (Articles 12–35) & Judicial Writs",
                "subtitle": "Enforceability, Article 32, and the 5 prerogative constitutional writs",
                "keyConcept": "Part III of the Constitution guarantees six Fundamental Rights to citizens against state arbitrary action. Dr. B.R. Ambedkar described Article 32 (Right to Constitutional Remedies) as the 'Heart and Soul of the Constitution' empowering the Supreme Court (Art 32) and High Courts (Art 226) to issue prerogative writs.",
                "formulaOrCode": "\\text{5 Writs: Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo-Warranto}",
                "highYieldFacts": [
                    "Habeas Corpus ('To have the body of'): Issued against illegal detention by both public and private entities.",
                    "Mandamus ('We command'): Directs a public official to perform statutory duty; CANNOT be issued against the President, Governor, or private individuals.",
                    "Certiorari ('To be certified'): Quashes an illegal order passed by a lower court/tribunal exceeding jurisdiction.",
                    "Right to Property was deleted from Fundamental Rights by the 44th Amendment Act (1978) and made a legal right under Article 300A.",
                    "Articles 20 and 21 CANNOT be suspended even during a National Emergency (Article 352)."
                ],
                "examTrap": "The writ jurisdiction of High Courts under Article 226 is WIDER than that of the Supreme Court under Article 32, because High Courts can issue writs for both Fundamental Rights and ordinary legal rights!",
                "benchmarkExample": {
                    "question": "Which Fundamental Rights cannot be suspended even during the proclamation of a National Emergency under Article 352?",
                    "options": ["Articles 14 and 19", "Articles 19 and 20", "Articles 20 and 21", "Articles 21 and 22"],
                    "correctAnswer": "Articles 20 and 21",
                    "stepByStepSolution": [
                        "Step 1: The 44th Constitutional Amendment Act 1978 introduced safeguards against executive abuse.",
                        "Step 2: It enacted that the right to protection in respect of conviction for offences (Article 20) and right to life and personal liberty (Article 21) can never be suspended during any emergency.",
                        "Step 3: Therefore, Articles 20 and 21 remain active under all circumstances."
                    ],
                    "takeaway": "Articles 20 & 21 are non-derogable even during wartime or national emergency."
                }
            },
            {
                "stepNumber": 2,
                "stepTitle": "Sixth Schedule & Autonomous District Councils",
                "subtitle": "Tribal governance in Assam, Meghalaya, Tripura, and Mizoram (AMTM)",
                "keyConcept": "The Sixth Schedule of the Indian Constitution provides for the administration of tribal areas in four northeastern states: Assam, Meghalaya, Tripura, and Mizoram (mnemonic: AMTM). It grants legislative, administrative, and judicial autonomy through Autonomous District Councils (ADCs).",
                "formulaOrCode": "\\text{Sixth Schedule States} = \\text{Assam, Meghalaya, Tripura, Mizoram (AMTM)} \\ne \\text{Nagaland, Manipur}",
                "highYieldFacts": [
                    "3 Autonomous Councils in Assam under 6th Schedule: (1) Bodoland Territorial Council (BTC), (2) Dima Hasao Autonomous Council, (3) Karbi Anglong Autonomous Council.",
                    "Each Autonomous District Council consists of not more than 30 members (26 elected by adult suffrage and 4 nominated by the Governor).",
                    "ADCs have power to make laws on land allotment, forests, village councils, inheritance, and social customs (subject to Governor's assent).",
                    "Acts of Parliament or Assam Legislature do not automatically apply to Sixth Schedule areas unless the Governor directs with modifications."
                ],
                "examTrap": "Manipur and Nagaland are NOT covered under the Sixth Schedule! (Nagaland has special provisions under Article 371A; Manipur under 371C). Sixth Schedule applies strictly to AMTM.",
                "benchmarkExample": {
                    "question": "Which of the following northeastern states is NOT governed under the Sixth Schedule of the Indian Constitution?",
                    "options": ["Assam", "Meghalaya", "Manipur", "Mizoram"],
                    "correctAnswer": "Manipur",
                    "stepByStepSolution": [
                        "Step 1: The Sixth Schedule applies exclusively to four states: Assam, Meghalaya, Tripura, and Mizoram (AMTM).",
                        "Step 2: Manipur is not in the Sixth Schedule; its hill areas are governed through Hill Areas Committee under Article 371C.",
                        "Step 3: Hence, Manipur is the correct answer."
                    ],
                    "takeaway": "Mnemonic: AMTM = Assam, Meghalaya, Tripura, Mizoram. Manipur & Nagaland are not 6th Schedule."
                }
            }
        ]
    }
]

# Write topicKnowledge.ts
ts_code = '''import { KnowledgeModule } from '../types';

export const TOPIC_KNOWLEDGE_MODULES: KnowledgeModule[] = ''' + json.dumps(modules, indent=2) + ''';

export const CIVIL_KNOWLEDGE_MODULES = TOPIC_KNOWLEDGE_MODULES.filter(m => m.category === 'civil');
export const GS_KNOWLEDGE_MODULES = TOPIC_KNOWLEDGE_MODULES.filter(m => m.category === 'gs');
'''

with open('d:/PROJECTS APP/EXAMPILOT/src/data/topicKnowledge.ts', 'w', encoding='utf-8') as f:
    f.write(ts_code)

print("Generated src/data/topicKnowledge.ts successfully with", len(modules), "comprehensive modules!")
