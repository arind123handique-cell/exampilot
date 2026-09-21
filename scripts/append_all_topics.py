# -*- coding: utf-8 -*-
"""
Combines all modules from build_full_knowledge_base with extra_modules
and writes complete topicKnowledge.ts cleanly.
"""
import json
import importlib.util

# Import modules from build_full_knowledge_base
spec = importlib.util.spec_from_file_location("base", "d:/PROJECTS APP/EXAMPILOT/scripts/build_full_knowledge_base.py")
base = importlib.util.module_from_spec(spec)
spec.loader.exec_module(base)

existing = list(base.modules)

# Now read extra_modules defined below
extra_modules = [
    # -------------------------------------------------------------
    # CIVIL: Fluid Mechanics & Hydraulics
    # -------------------------------------------------------------
    {
        "id": "civil-fluids",
        "title": "Fluid Mechanics & Open Channel Flow",
        "subject": "Fluid Mechanics & Hydraulics",
        "category": "civil",
        "readTime": "16 min read",
        "weightage": "HIGH_YIELD",
        "icon": "Droplets",
        "summary": "Fluid statics, hydrostatic thrust, Bernoulli equation, boundary layer theory, Darcy-Weisbach pipe friction, Manning open channel hydraulics, and hydraulic jumps.",
        "prerequisites": ["Engineering Mechanics", "Calculus"],
        "standardReferences": ["Modi & Seth", "Subramanya Open Channel Flow"],
        "practiceQuestionIds": ["civil-18", "civil-19", "civil-20", "civil-21"],
        "steps": [
            {
                "stepNumber": 1,
                "stepTitle": "Hydrostatic Forces & Center of Pressure",
                "subtitle": "Total thrust on submerged plane surfaces and depth of center of pressure",
                "keyConcept": "Hydrostatic pressure increases linearly with depth (p = rho * g * h). Total hydrostatic thrust on a submerged plane surface equals pressure at centroid times area: F = rho * g * A * h_bar. Center of pressure always lies BELOW the centroid.",
                "formulaOrCode": "h_{cp} = \\bar{h} + \\frac{I_G \\sin^2 \\theta}{A \\bar{h}} \\quad ; \\quad F = \\rho g A \\bar{h}",
                "highYieldFacts": [
                    "For a vertical surface (theta = 90 deg): h_cp = h_bar + I_G / (A * h_bar).",
                    "For a vertical rectangular plate of height d with top edge at free surface: h_cp = 2/3 d.",
                    "For a vertical triangle with base at free surface: h_cp = d / 2; with vertex at surface: h_cp = 3/4 d.",
                    "Metacentric height GM = BM - BG = (I / V) - BG. For stable equilibrium of floating bodies, GM > 0 (M must be above G)."
                ],
                "examTrap": "Center of pressure NEVER lies above the centroid for submerged plane surfaces. As depth increases, h_cp approaches h_bar asymptotically.",
                "benchmarkExample": {
                    "question": "A vertical rectangular sluice gate of width 2 m and height 3 m has its top edge at the water surface. Find the depth of the center of pressure.",
                    "options": ["1.5 m", "2.0 m", "2.25 m", "2.5 m"],
                    "correctAnswer": "2.0 m",
                    "stepByStepSolution": [
                        "Step 1: Centroid is at mid-depth: h_bar = 3 / 2 = 1.5 m.",
                        "Step 2: For a vertical rectangle with top edge at surface: h_cp = (2/3) * d.",
                        "Step 3: h_cp = (2/3) * 3 = 2.0 m."
                    ],
                    "takeaway": "Vertical rectangle with top at free surface: h_cp = 2/3 * depth."
                }
            },
            {
                "stepNumber": 2,
                "stepTitle": "Bernoulli Equation, Pipe Friction & Losses",
                "subtitle": "Conservation of energy, Darcy-Weisbach formula, and minor losses",
                "keyConcept": "Bernoulli's theorem states that along a streamline of an inviscid, incompressible, steady flow, total mechanical energy (pressure + velocity + datum heads) is constant. In real pipes, energy is lost due to boundary friction and geometry changes.",
                "formulaOrCode": "\\frac{p_1}{\\rho g} + \\frac{v_1^2}{2g} + z_1 = \\frac{p_2}{\\rho g} + \\frac{v_2^2}{2g} + z_2 + h_f \\quad ; \\quad h_f = \\frac{f L v^2}{2 g D}",
                "highYieldFacts": [
                    "For laminar flow in circular pipes (Re < 2000): Darcy friction factor f = 64 / Re.",
                    "Fanning friction coefficient f' = f / 4 = 16 / Re.",
                    "Head loss at sudden expansion: h_L = (v_1 - v_2)^2 / (2g).",
                    "Head loss at pipe entrance: h_L = 0.5 v^2 / (2g); at pipe exit: h_L = v^2 / (2g)."
                ],
                "examTrap": "Check whether the question uses Darcy friction factor 'f' (h_f = fLv²/2gD) or Chezy/Fanning coefficient 'f'' (h_f = 4f'Lv²/2gD). Darcy f is 4 times Fanning f'.",
                "benchmarkExample": {
                    "question": "In laminar flow through a pipe, what is the value of the Darcy friction factor f when Reynolds number is 1600?",
                    "options": ["0.01", "0.02", "0.04", "0.08"],
                    "correctAnswer": "0.04",
                    "stepByStepSolution": [
                        "Step 1: Formula for Darcy friction factor in laminar flow: f = 64 / Re.",
                        "Step 2: Substitute Re = 1600: f = 64 / 1600 = 4 / 100 = 0.04."
                    ],
                    "takeaway": "Laminar Darcy f = 64 / Re; Fanning f' = 16 / Re."
                }
            },
            {
                "stepNumber": 3,
                "stepTitle": "Open Channel Flow & Hydraulic Jumps",
                "subtitle": "Manning's equation, critical flow, and jump energy dissipation",
                "keyConcept": "Open channel flow has a free surface subject to atmospheric pressure. The flow is classified by Froude number Fr: subcritical (Fr < 1), critical (Fr = 1), and supercritical (Fr > 1). A hydraulic jump is a rapid transition from supercritical to subcritical flow.",
                "formulaOrCode": "Fr = \\frac{v}{\\sqrt{g y}} \\quad ; \\quad \\frac{y_2}{y_1} = \\frac{1}{2}\\left(\\sqrt{1 + 8 Fr_1^2} - 1\\right) \\quad ; \\quad \\Delta E = \\frac{(y_2 - y_1)^3}{4 y_1 y_2}",
                "highYieldFacts": [
                    "At critical flow (Fr = 1): Specific energy E is minimum for a given discharge; discharge is maximum for a given specific energy.",
                    "Critical depth in rectangular channel: y_c = (q^2 / g)^(1/3); Minimum specific energy E_min = 1.5 y_c.",
                    "Hydraulic jump occurs ONLY when upstream flow is supercritical (Fr_1 > 1).",
                    "Belanger's equation relates conjugate/sequent depths y_1 and y_2."
                ],
                "examTrap": "Sequent depths (or conjugate depths) belong to hydraulic jumps with equal specific force. Alternate depths belong to equal specific energy. Do not interchange them!",
                "benchmarkExample": {
                    "question": "In a rectangular channel, what is the minimum specific energy E_min for critical depth y_c = 2.0 m?",
                    "options": ["2.0 m", "2.5 m", "3.0 m", "4.0 m"],
                    "correctAnswer": "3.0 m",
                    "stepByStepSolution": [
                        "Step 1: In a rectangular channel at critical flow, E_min = y_c + v_c^2 / (2g) = y_c + y_c / 2 = 1.5 y_c.",
                        "Step 2: E_min = 1.5 * 2.0 = 3.0 m."
                    ],
                    "takeaway": "Rectangular channel: E_min = 1.5 * y_c."
                }
            }
        ]
    },

    # -------------------------------------------------------------
    # CIVIL: Environmental Engineering & Water Treatment
    # -------------------------------------------------------------
    {
        "id": "civil-env",
        "title": "Environmental Engineering: Water Treatment & BOD",
        "subject": "Environmental Engineering",
        "category": "civil",
        "readTime": "16 min read",
        "weightage": "HIGH_YIELD",
        "icon": "Activity",
        "summary": "Water quality parameters, plain sedimentation, coagulation-flocculation, rapid sand filtration, disinfection, BOD kinetics, activated sludge, and sewer design.",
        "prerequisites": ["Chemistry", "Fluid Mechanics"],
        "standardReferences": ["S.K. Garg Environmental Engineering", "Peavy & Rowe"],
        "practiceQuestionIds": ["civil-22", "civil-23", "civil-24", "civil-25"],
        "steps": [
            {
                "stepNumber": 1,
                "stepTitle": "Water Quality Parameters & Permissible Limits (IS 10500)",
                "subtitle": "Turbidity, hardness, fluorides, nitrates, and MPN coliforms",
                "keyConcept": "Potable water must meet Indian Standard IS 10500:2012 specifications for physical, chemical, and bacteriological standards to safeguard public health.",
                "formulaOrCode": "\\text{Total Hardness (mg/L as } CaCO_3) = 2.5 [Ca^{2+}] + 4.12 [Mg^{2+}]",
                "highYieldFacts": [
                    "Fluoride: Desirable = 1.0 mg/L; Max = 1.5 mg/L (Deficiency causes dental caries; excess causes skeletal fluorosis).",
                    "Nitrate: Permissible limit = 45 mg/L (Excess causes Methemoglobinemia or 'Blue Baby Disease' in infants).",
                    "Turbidity limit: 1 NTU (acceptable), 5 NTU (cause for rejection). Measured by Nephelometer.",
                    "E. Coli coliform in 100 mL treated drinking water must be ZERO (undetectable)."
                ],
                "examTrap": "Blue Baby syndrome is caused by excess NITRATE (> 45 mg/L), NOT nitrite or ammonia.",
                "benchmarkExample": {
                    "question": "What is the permissible limit of nitrate in drinking water per IS 10500?",
                    "options": ["10 mg/L", "20 mg/L", "45 mg/L", "100 mg/L"],
                    "correctAnswer": "45 mg/L",
                    "stepByStepSolution": [
                        "Step 1: Check IS 10500 standards for nitrate (NO3-).",
                        "Step 2: Acceptable limit is 45 mg/L with no relaxation allowed."
                    ],
                    "takeaway": "Nitrate limit = 45 mg/L; Fluoride = 1.0 - 1.5 mg/L; Arsenic = 0.01 mg/L."
                }
            },
            {
                "stepNumber": 2,
                "stepTitle": "Water Treatment Train: Sedimentation, Coagulation & Filtration",
                "subtitle": "Stokes law settling, alum chemistry, and rapid sand backwashing",
                "keyConcept": "Surface water undergoes aeration -> coagulation & flocculation (alum) -> sedimentation -> rapid sand filtration -> chlorination. Settling of discrete particles is governed by Stokes' Law.",
                "formulaOrCode": "v_s = \\frac{g (G - 1) d^2}{18 \\nu} \\quad ; \\quad \\text{Surface Overflow Rate } (SOR) = \\frac{Q}{A_s}",
                "highYieldFacts": [
                    "Particles with settling velocity v_s >= SOR are 100% removed in an ideal sedimentation tank.",
                    "Common coagulant: Alum (Al2(SO4)3 . 18 H2O); optimal pH range = 6.5 to 8.5.",
                    "Rapid Sand Filter filtration rate: 3,000 to 6,000 L/m²/hour (approx 30 times faster than Slow Sand Filter).",
                    "Slow Sand Filter cleans via bacterial biological layer known as 'Schmutzdecke'; requires scraping top layer."
                ],
                "examTrap": "In an ideal sedimentation tank, removal efficiency depends ONLY on surface overflow rate (Q / A_s) and is completely independent of tank depth!",
                "benchmarkExample": {
                    "question": "In an ideal sedimentation tank, the percentage removal of discrete particles depends on:",
                    "options": ["Depth of tank", "Surface overflow rate", "Length of tank only", "Volume of tank"],
                    "correctAnswer": "Surface overflow rate",
                    "stepByStepSolution": [
                        "Step 1: Fraction removed f = v_s / v_0 = v_s / (Q / A_s).",
                        "Step 2: Here A_s is surface area (L * B).",
                        "Step 3: Depth 'H' cancels out in retention time calculations."
                    ],
                    "takeaway": "Sedimentation removal efficiency depends on Surface Overflow Rate (Q/A_s), NOT depth."
                }
            },
            {
                "stepNumber": 3,
                "stepTitle": "BOD Kinetics & Biological Wastewater Treatment",
                "subtitle": "First-order deoxygenation, 5-day BOD, and Activated Sludge Process",
                "keyConcept": "Biochemical Oxygen Demand (BOD) measures the oxygen consumed by microorganisms while decomposing biodegradable organic matter. Standard laboratory test is 5-day BOD at 20 degrees Celsius (BOD_5).",
                "formulaOrCode": "BOD_t = L_0 (1 - 10^{-k t}) \\quad ; \\quad \\text{or } BOD_t = L_0 (1 - e^{-k' t}) \\quad ; \\quad BOD_5 \\approx 0.68 L_0",
                "highYieldFacts": [
                    "BOD_5 at 20 deg C equals approximately 68% (or two-thirds) of ultimate BOD (L_0).",
                    "Chemical Oxygen Demand (COD) > BOD always, because COD oxidizes both biodegradable and non-biodegradable organics using strong dichromate reagent.",
                    "F/M ratio (Food-to-Microorganism) in conventional Activated Sludge Process = 0.2 to 0.4 day^-1.",
                    "Sludge Volume Index (SVI) between 80 and 150 mL/g indicates good settling characteristics."
                ],
                "examTrap": "BOD rate constant 'k' depends on temperature: k_T = k_20 * (1.047)^(T - 20). It increases at higher temperatures, meaning oxygen is consumed faster!",
                "benchmarkExample": {
                    "question": "If the 5-day BOD of a wastewater sample at 20°C is 200 mg/L and BOD_5 is 68% of ultimate BOD, what is the ultimate BOD (L_0)?",
                    "options": ["240 mg/L", "294 mg/L", "320 mg/L", "400 mg/L"],
                    "correctAnswer": "294 mg/L",
                    "stepByStepSolution": [
                        "Step 1: BOD_5 = 0.68 * L_0.",
                        "Step 2: L_0 = 200 / 0.68 = 294.1 mg/L = ~294 mg/L."
                    ],
                    "takeaway": "Ultimate BOD L_0 = BOD_5 / 0.68."
                }
            }
        ]
    },

    # -------------------------------------------------------------
    # CIVIL: Surveying & Geomatics
    # -------------------------------------------------------------
    {
        "id": "civil-surveying",
        "title": "Surveying & Geomatics: Levelling, Curves & Total Station",
        "subject": "Surveying & Geomatics",
        "category": "civil",
        "readTime": "15 min read",
        "weightage": "CORE",
        "icon": "Crosshair",
        "summary": "Principles of surveying, differential and reciprocal levelling, tacheometric surveying, horizontal and vertical curves, Total Station, and GPS/GIS fundamentals.",
        "prerequisites": ["Basic Trigonometry", "Geometry"],
        "standardReferences": ["B.C. Punmia Surveying Vol I & II", "Duggal"],
        "practiceQuestionIds": ["civil-26", "civil-27", "civil-28", "civil-29"],
        "steps": [
            {
                "stepNumber": 1,
                "stepTitle": "Fundamental Principles & Differential Levelling",
                "subtitle": "Working from whole to part, curvature/refraction corrections, and reciprocal levelling",
                "keyConcept": "The two fundamental principles of surveying are: (1) Work from whole to part (to prevent accumulation of errors), and (2) Locate a point by at least two independent measurements. In levelling, curvature makes objects appear lower, while refraction makes them appear higher.",
                "formulaOrCode": "C_c = -0.0785 d^2 \\quad ; \\quad C_r = +0.0112 d^2 \\quad ; \\quad C_{combined} = -0.0673 d^2 \\text{ (in meters, } d \\text{ in km)}",
                "highYieldFacts": [
                    "Combined correction for curvature and refraction: C = 0.0673 * d² (subtractive from staff reading).",
                    "Distance to visible horizon: d = sqrt(h / 0.0673) = 3.855 * sqrt(h) (with h in meters, d in km).",
                    "Reciprocal levelling eliminates: (1) Curvature error, (2) Refraction error (if readings are simultaneous), and (3) Collimation axis tilt error.",
                    "In Rise and Fall method, an independent arithmetic check is available on intermediate sights: Sigma BS - Sigma FS = Sigma Rise - Sigma Fall = Last RL - First RL."
                ],
                "examTrap": "Reciprocal levelling eliminates curvature, refraction, and collimation error, but does NOT eliminate errors due to staff non-verticality or graduation defects!",
                "benchmarkExample": {
                    "question": "What is the combined curvature and refraction correction for a sight distance of 2 km?",
                    "options": ["0.135 m", "0.269 m", "0.314 m", "0.538 m"],
                    "correctAnswer": "0.269 m",
                    "stepByStepSolution": [
                        "Step 1: Formula: C = 0.0673 * d^2.",
                        "Step 2: d = 2 km => d^2 = 4.",
                        "Step 3: C = 0.0673 * 4 = 0.2692 m = 0.269 m (subtractive)."
                    ],
                    "takeaway": "Combined correction = 0.0673 * d² meters."
                }
            },
            {
                "stepNumber": 2,
                "stepTitle": "Tacheometry, Curves & Total Station",
                "subtitle": "Stadia constants, degree of curve, and electronic distance measurement (EDM)",
                "keyConcept": "Tacheometry determines horizontal distance and elevations optically using stadia hairs without chaining. Modern Total Stations integrate electronic theodolite, EDM, and microprocessor data storage.",
                "formulaOrCode": "D = k \\cdot s + c = \\left(\\frac{f}{i}\\right) s + (f + d) \\quad ; \\quad R = \\frac{1719}{D^\\circ} \\text{ (for 30m chord)}",
                "highYieldFacts": [
                    "For an anallatic telescope, the multiplying constant k = f / i = 100, and additive constant c = (f + d) = 0.",
                    "Degree of curve for 30 m chain: R = 1718.9 / D = ~1719 / D.",
                    "Degree of curve for 20 m chain: R = 1146 / D.",
                    "Total Station uses phase shift or pulse time-of-flight infrared laser to measure slope distances with millimeter precision."
                ],
                "examTrap": "Anallatic lens makes additive constant ZERO (c = 0), so distance simplifies strictly to D = 100 * s.",
                "benchmarkExample": {
                    "question": "What is the radius of a 3-degree curve based on a 30-meter chord?",
                    "options": ["382 m", "573 m", "860 m", "1146 m"],
                    "correctAnswer": "573 m",
                    "stepByStepSolution": [
                        "Step 1: Radius formula for 30 m chord: R = 1719 / D.",
                        "Step 2: R = 1719 / 3 = 573 m."
                    ],
                    "takeaway": "30 m chord: R = 1719 / D; 20 m chord: R = 1146 / D."
                }
            }
        ]
    },

    # -------------------------------------------------------------
    # CIVIL: Design of Steel Structures (IS 800:2007)
    # -------------------------------------------------------------
    {
        "id": "civil-steel",
        "title": "Design of Steel Structures & IS 800:2007 LSM",
        "subject": "Design of Steel Structures",
        "category": "civil",
        "readTime": "16 min read",
        "weightage": "HIGH_YIELD",
        "icon": "Wrench",
        "summary": "Limit state design of steel per IS 800:2007, high-strength friction grip (HSFG) bolts, fillet welds, plastic analysis, and member design.",
        "prerequisites": ["Strength of Materials", "Structural Analysis"],
        "standardReferences": ["IS 800:2007", "N. Subramanian Steel Structures"],
        "practiceQuestionIds": ["civil-30", "civil-31", "civil-32", "civil-33"],
        "steps": [
            {
                "stepNumber": 1,
                "stepTitle": "Bolted & Welded Connections",
                "subtitle": "Bearing bolts, HSFG slip-critical bolts, and fillet weld throat thickness",
                "keyConcept": "Connections are designed for ultimate limit states. Bearing bolts resist force via shear and bearing on plate. HSFG bolts clamp plates together with high pretension, resisting shear entirely by interface friction without slip.",
                "formulaOrCode": "t_t = k \\cdot s = 0.7 s \\text{ (for 90}^\\circ\\text{ fusion angle)} \\quad ; \\quad f_{wd} = \\frac{f_u}{\\sqrt{3} \\gamma_{mw}}",
                "highYieldFacts": [
                    "Design strength of fillet weld per unit length: P_dw = (f_u / (sqrt(3) * gamma_mw)) * t_t.",
                    "Partial safety factor for shop welds gamma_mw = 1.25; for field welds gamma_mw = 1.50.",
                    "Effective throat thickness t_t = k * s, where k = 0.70 for fusion angle 60-90 degrees.",
                    "Minimum pitch of bolts = 2.5 * nominal diameter d.",
                    "Minimum edge distance = 1.5 * hole diameter d_0 (for machine flame cut edges); 1.7 * d_0 (for hand flame cut edges)."
                ],
                "examTrap": "Safety factor for field welds is 1.50 (20% higher than shop weld 1.25), reducing field weld strength!",
                "benchmarkExample": {
                    "question": "For a 10 mm fillet weld connecting plates in a workshop (gamma_mw = 1.25, f_u = 410 MPa), what is the effective throat thickness?",
                    "options": ["5.0 mm", "7.0 mm", "8.5 mm", "10.0 mm"],
                    "correctAnswer": "7.0 mm",
                    "stepByStepSolution": [
                        "Step 1: Effective throat thickness t_t = k * size.",
                        "Step 2: For standard 90-degree weld, k = 0.70.",
                        "Step 3: t_t = 0.70 * 10 mm = 7.0 mm."
                    ],
                    "takeaway": "Throat thickness = 0.7 * weld size."
                }
            },
            {
                "stepNumber": 2,
                "stepTitle": "Plastic Analysis & Shape Factor",
                "subtitle": "Plastic hinges, collapse mechanisms, and section shape factors",
                "keyConcept": "Plastic theory relies on the ductility of structural steel. When the entire cross section yields under flexure, a plastic hinge forms with moment capacity M_p = Z_p * f_y. The ratio of plastic section modulus to elastic modulus is the Shape Factor.",
                "formulaOrCode": "\\text{Shape Factor } S = \\frac{M_p}{M_y} = \\frac{Z_p}{Z_e} \\quad ; \\quad W_c = \\text{Collapse Load via Virtual Work}",
                "highYieldFacts": [
                    "Shape factor for Rectangular section = 1.50.",
                    "Shape factor for Solid circular section = 1.70 (16 / 3pi).",
                    "Shape factor for Diamond/Rhombus = 2.0.",
                    "Shape factor for standard I-section (major axis) = 1.12 to 1.15.",
                    "Number of plastic hinges required for complete collapse = D_s + 1."
                ],
                "examTrap": "Shape factor represents reserve plastic strength. An I-section has the lowest shape factor (~1.14) because most material is already situated in extreme flanges!",
                "benchmarkExample": {
                    "question": "What is the shape factor for a solid circular steel cross-section?",
                    "options": ["1.15", "1.50", "1.70", "2.00"],
                    "correctAnswer": "1.70",
                    "stepByStepSolution": [
                        "Step 1: Z_p for solid circle = d^3 / 6.",
                        "Step 2: Z_e for solid circle = pi * d^3 / 32.",
                        "Step 3: Shape factor = (d^3 / 6) / (pi * d^3 / 32) = 32 / (6 * pi) = 1.697 = ~1.70."
                    ],
                    "takeaway": "Shape Factors: Diamond (2.0) > Circle (1.70) > Triangle (2.34) > Rectangle (1.50) > I-Section (1.14)."
                }
            }
        ]
    },

    # -------------------------------------------------------------
    # CIVIL: Construction Planning & CPM/PERT
    # -------------------------------------------------------------
    {
        "id": "civil-cpm-pert",
        "title": "Construction Planning: CPM, PERT & Building Materials",
        "subject": "Construction Management",
        "category": "civil",
        "readTime": "15 min read",
        "weightage": "CORE",
        "icon": "Briefcase",
        "summary": "Network diagramming, Critical Path Method (CPM), floats, PERT probabilistic distribution, crashing, cement chemistry, and contracts.",
        "prerequisites": ["Basic Mathematics", "Management Concepts"],
        "standardReferences": ["B.C. Punmia Project Planning", "Duggal Building Materials"],
        "practiceQuestionIds": ["civil-34", "civil-35", "civil-36"],
        "steps": [
            {
                "stepNumber": 1,
                "stepTitle": "CPM vs PERT & Activity Times",
                "subtitle": "Deterministic vs probabilistic models, critical path, and beta distribution",
                "keyConcept": "CPM is activity-oriented and deterministic, suitable for repetitive construction projects. PERT is event-oriented and probabilistic, suitable for R&D projects where durations are uncertain, modeled by Beta Distribution.",
                "formulaOrCode": "t_e = \\frac{t_o + 4 t_m + t_p}{6} \\quad ; \\quad \\sigma = \\frac{t_p - t_o}{6} \\quad ; \\quad V = \\sigma^2",
                "highYieldFacts": [
                    "Critical path is the longest path through the network; it dictates minimum project completion time.",
                    "Total Float TF = LST - EST = LFT - EFT (measures delay without affecting overall project completion).",
                    "Free Float FF = EST of successor - EFT of current activity (delay without affecting successor start).",
                    "Independent Float IF = EST of successor - LFT of predecessor - duration.",
                    "Hierarchy: Total Float >= Free Float >= Independent Float."
                ],
                "examTrap": "Total float affects the whole project. Free float affects only the succeeding activity. Independent float affects neither preceding nor succeeding activities.",
                "benchmarkExample": {
                    "question": "An activity in PERT has optimistic time 4 days, most likely 7 days, and pessimistic 16 days. What is its expected duration t_e?",
                    "options": ["7.5 days", "8.0 days", "9.0 days", "10.0 days"],
                    "correctAnswer": "8.0 days",
                    "stepByStepSolution": [
                        "Step 1: Formula: t_e = (t_o + 4*t_m + t_p) / 6.",
                        "Step 2: t_e = (4 + 4*7 + 16) / 6 = (4 + 28 + 16) / 6.",
                        "Step 3: t_e = 48 / 6 = 8.0 days."
                    ],
                    "takeaway": "PERT expected time t_e = (t_o + 4t_m + t_p) / 6."
                }
            }
        ]
    },

    # -------------------------------------------------------------
    # GENERAL STUDIES: History of India
    # -------------------------------------------------------------
    {
        "id": "gs-india-history",
        "title": "History of India: Ancient, Medieval & Freedom Struggle",
        "subject": "Indian History",
        "category": "gs",
        "readTime": "20 min read",
        "weightage": "HIGH_YIELD",
        "icon": "BookOpen",
        "summary": "Indus Valley Civilization, Vedic period, Mauryan Empire, Gupta Golden Age, Delhi Sultanate, Mughal architecture, 1857 Revolt, and the Indian National Movement (1885–1947).",
        "prerequisites": ["Basic Social Science"],
        "standardReferences": ["Bipan Chandra: India's Struggle for Independence", "Spectrum Modern India", "NCERT"],
        "practiceQuestionIds": ["gs-16", "gs-17", "gs-18", "gs-19"],
        "steps": [
            {
                "stepNumber": 1,
                "stepTitle": "Ancient India: Harappa to Guptas",
                "subtitle": "Urban planning, Ashokan edicts, and classical golden age",
                "keyConcept": "The Indus Valley Civilization was an advanced Bronze Age urban culture characterized by grid-pattern streets, Great Bath (Mohenjo-daro), and maritime trade (Lothal dockyard). The Mauryan Empire under Ashoka introduced Dhamma edicts, and the Gupta era represented a classical age in science and literature.",
                "formulaOrCode": "\\text{Harappa (1921: Dayaram Sahni)} \\to \\text{Mohenjo-daro (1922: R.D. Banerjee)} \\to \\text{Ashoka (261 BCE Kalinga)}",
                "highYieldFacts": [
                    "Lothal (Gujarat) had the world's earliest known tidal dockyard.",
                    "Ashoka's Kalinga War (261 BCE, Rock Edict XIII) led him to renounce Digvijaya in favor of Dhammavijaya.",
                    "Chandragupta II (Vikramaditya) patronized the Navaratnas, including Kalidasa, Varahamihira, and Amarasimha.",
                    "Aryabhata composed 'Aryabhatiya' establishing the earth rotates on its axis and calculating pi."
                ],
                "examTrap": "Rock Edict XIII describes the sorrow of the Kalinga War, NOT Rock Edict I or Pillar Edicts.",
                "benchmarkExample": {
                    "question": "Which Major Rock Edict of Emperor Ashoka describes his conquest and tragic remorse over the Kalinga War?",
                    "options": ["Major Rock Edict V", "Major Rock Edict VIII", "Major Rock Edict X", "Major Rock Edict XIII"],
                    "correctAnswer": "Major Rock Edict XIII",
                    "stepByStepSolution": [
                        "Step 1: Major Rock Edict XIII explicitly details the slaughter, deportations, and Ashoka's profound grief after Kalinga in 261 BCE.",
                        "Step 2: It records his conversion from warfare to Dhamma."
                    ],
                    "takeaway": "Ashoka's Kalinga War = Major Rock Edict XIII."
                }
            },
            {
                "stepNumber": 2,
                "stepTitle": "Indian Freedom Movement (1885–1947)",
                "subtitle": "Founding of INC, Partition of Bengal, Non-Cooperation, and Quit India",
                "keyConcept": "The Indian National Congress was founded in 1885 by A.O. Hume. The national movement progressed from Moderates (prayer, petition) to Extremists (Swadeshi 1905) to the mass Gandhian era (Non-Cooperation 1920, Civil Disobedience 1930, Quit India 1942).",
                "formulaOrCode": "1885 \\text{ (INC)} \\to 1905 \\text{ (Swadeshi)} \\to 1920 \\text{ (NCM)} \\to 1930 \\text{ (Dandi)} \\to 1942 \\text{ (Quit India)}",
                "highYieldFacts": [
                    "First President of INC was W.C. Bonnerjee (Bombay, Dec 1885; 72 delegates).",
                    "1905: Partition of Bengal by Lord Curzon sparked the Swadeshi and Boycott Movement.",
                    "1916: Lucknow Pact united Moderates and Extremists, and INC with Muslim League.",
                    "1930: Dandi March (12 March to 6 April 1930) broke the Salt Law, launching Civil Disobedience.",
                    "1942: Gandhi gave the clarion call 'Do or Die' at the Gowalia Tank maidan, Bombay."
                ],
                "examTrap": "Gandhi presided over ONLY ONE session of the Indian National Congress: the 1924 Belgaum session!",
                "benchmarkExample": {
                    "question": "In which session did Mahatma Gandhi serve as the President of the Indian National Congress?",
                    "options": ["1920 Calcutta", "1924 Belgaum", "1929 Lahore", "1931 Karachi"],
                    "correctAnswer": "1924 Belgaum",
                    "stepByStepSolution": [
                        "Step 1: Mahatma Gandhi was elected INC President only once.",
                        "Step 2: This occurred at the 39th session held in Belgaum (Karnataka) in December 1924."
                    ],
                    "takeaway": "Mahatma Gandhi = 1924 Belgaum Session only."
                }
            }
        ]
    },

    # -------------------------------------------------------------
    # GENERAL STUDIES: Indian & Assam Economy
    # -------------------------------------------------------------
    {
        "id": "gs-economy",
        "title": "Indian & Assam Economy: Macroeconomics & State Resources",
        "subject": "Economy & Development",
        "category": "gs",
        "readTime": "16 min read",
        "weightage": "CORE",
        "icon": "TrendingUp",
        "summary": "National income accounting, RBI monetary policy instruments, GST framework, and key sectors of Assam's economy (Tea industry, Digboi petroleum, agriculture, Muga silk).",
        "prerequisites": ["Basic Economics"],
        "standardReferences": ["Ramesh Singh: Indian Economy", "Assam Economic Survey"],
        "practiceQuestionIds": ["gs-20", "gs-21", "gs-22"],
        "steps": [
            {
                "stepNumber": 1,
                "stepTitle": "Monetary Policy & Fiscal Architecture",
                "subtitle": "Repo rate, CRR, SLR, FRBM Act, and Goods & Services Tax",
                "keyConcept": "Monetary policy is governed by the Reserve Bank of India (RBI) through policy rates to control liquidity and maintain inflation targets (4% +/- 2%). Fiscal policy is managed by the Union and State governments via taxation and expenditure.",
                "formulaOrCode": "\\text{Repo Rate: Rate at which RBI lends short-term to banks against government collateral}",
                "highYieldFacts": [
                    "Cash Reserve Ratio (CRR): Percentage of net demand and time liabilities (NDTL) banks must hold in cash with RBI without earning interest.",
                    "Statutory Liquidity Ratio (SLR): Percentage banks must invest in approved government securities, gold, or cash.",
                    "GST (101st Amendment Act, 2016): One nation, one tax destination-based consumption tax.",
                    "Assam was the FIRST state in India to ratify the GST Bill (August 2016)."
                ],
                "examTrap": "Assam was the FIRST state in the entire country to pass the GST Constitutional Amendment Bill in its legislative assembly!",
                "benchmarkExample": {
                    "question": "Which was the first state in India to ratify the GST Constitutional Amendment Act in 2016?",
                    "options": ["Gujarat", "Assam", "Maharashtra", "Bihar"],
                    "correctAnswer": "Assam",
                    "stepByStepSolution": [
                        "Step 1: Following parliamentary passage of the 122nd Constitutional Amendment Bill,",
                        "Step 2: The Assam Legislative Assembly ratified it on 12 August 2016, becoming the first state in India to do so."
                    ],
                    "takeaway": "Assam = 1st State to ratify GST Act (August 2016)."
                }
            },
            {
                "stepNumber": 2,
                "stepTitle": "Economy of Assam: Tea, Petroleum & Handloom",
                "subtitle": "Assam tea output, Digboi refinery (Asia's oldest), and Muga silk GI tag",
                "keyConcept": "Assam contributes over 50% of India's total tea production. Digboi in Tinsukia district is Asia's oldest operating oil refinery (commissioned 1901). Assam's golden Muga silk holds a Geographical Indication (GI) tag.",
                "formulaOrCode": "\\text{Assam Tea Output} > 50\\% \\text{ of India's National Tea Production}",
                "highYieldFacts": [
                    "Robert Bruce discovered wild tea plants in Assam in 1823.",
                    "Digboi Refinery: First oil well in Asia drilled in 1889; refinery established in 1901.",
                    "Assam has 4 oil refineries: Digboi (1901), Guwahati/Noonmati (1962), Bongaigaon (1979), Numaligarh (1999).",
                    "Muga Silk ('Antheraea assamensis'): Golden-yellow endemic silk produced only in Assam; received GI tag in 2007."
                ],
                "examTrap": "The first public sector refinery in independent India was Guwahati (Noonmati) Refinery, inaugurated on 1 Jan 1962 with Romanian collaboration. Digboi was set up earlier in 1901 under British rule.",
                "benchmarkExample": {
                    "question": "Asia's oldest operating oil refinery, commissioned in 1901, is located in which town of Assam?",
                    "options": ["Bongaigaon", "Numaligarh", "Digboi", "Guwahati"],
                    "correctAnswer": "Digboi",
                    "stepByStepSolution": [
                        "Step 1: Oil was discovered in Digboi in 1889.",
                        "Step 2: The Assam Oil Company established the Digboi refinery in 1901.",
                        "Step 3: It remains the world's oldest continuously operating oil well and refinery."
                    ],
                    "takeaway": "Digboi = Asia's oldest refinery (1901); Numaligarh = Accord Refinery."
                }
            }
        ]
    }
]

# Merge avoiding duplicates
existing_ids = {m['id'] for m in existing}
for m in extra_modules:
    if m['id'] not in existing_ids:
        existing.append(m)

ts_code = '''import { KnowledgeModule } from '../types';

export const TOPIC_KNOWLEDGE_MODULES: KnowledgeModule[] = ''' + json.dumps(existing, indent=2) + ''';

export const CIVIL_KNOWLEDGE_MODULES = TOPIC_KNOWLEDGE_MODULES.filter(m => m.category === 'civil');
export const GS_KNOWLEDGE_MODULES = TOPIC_KNOWLEDGE_MODULES.filter(m => m.category === 'gs');
'''

with open('d:/PROJECTS APP/EXAMPILOT/src/data/topicKnowledge.ts', 'w', encoding='utf-8') as f:
    f.write(ts_code)

print("SUCCESS! Generated complete topicKnowledge.ts with", len(existing), "modules!")
