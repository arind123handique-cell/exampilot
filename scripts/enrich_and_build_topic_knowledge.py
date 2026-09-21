import json

# Read civil questions
with open('src/data/civilQuestions.ts', 'r', encoding='utf-8') as f:
    civil_raw = f.read()

# Read GS questions
with open('src/data/generalStudiesQuestions.ts', 'r', encoding='utf-8') as f:
    gs_raw = f.read()

def parse_ts_array(raw_text):
    start = raw_text.find('= [') + 2
    end = raw_text.rfind('];')
    if end == -1:
        end = raw_text.rfind(']')
    else:
        end += 1
    json_str = raw_text[start:end]
    return json.loads(json_str)

civil_qs = parse_ts_array(civil_raw)
gs_qs = parse_ts_array(gs_raw)

def to_topic_q(q):
    return {
        "id": q["id"],
        "stem": q["stem"],
        "options": q["options"],
        "correctOption": q["correctOption"],
        "explanation": q.get("explanation", ""),
        "formulaContext": q.get("formulaContext"),
        "difficulty": q.get("difficulty", "MEDIUM"),
        "examSource": q.get("pyqExam") or q.get("referenceSource") or "APSC AE / GATE Standard",
        "topic": q.get("topic"),
        "subtopic": q.get("subtopic")
    }

civil_by_id = {q["id"]: to_topic_q(q) for q in civil_qs}
gs_by_id = {q["id"]: to_topic_q(q) for q in gs_qs}

# Read existing modules
with open('src/data/topicKnowledge.ts', 'r', encoding='utf-8') as f:
    tk_text = f.read()

sig = 'export const TOPIC_KNOWLEDGE_MODULES: KnowledgeModule[] = '
start = tk_text.find(sig) + len(sig)
end = tk_text.rfind('];') + 1
modules = json.loads(tk_text[start:end])

# Define Question Mappings for all modules
q_mapping = {
    "civil-rcc": [f"ce-q-{i:03d}" for i in range(1, 14)] + ["ce-q-015"], # 14 Qs
    "civil-prestressed": ["ce-q-014", "ce-q-001", "ce-q-002", "ce-q-003", "ce-q-012"], # 5 Qs
    "civil-structural-analysis": [f"ce-q-{i:03d}" for i in range(16, 28)], # 12 Qs
    "civil-som": [f"ce-q-{i:03d}" for i in range(28, 38)], # 10 Qs
    "civil-geotech": [f"ce-q-{i:03d}" for i in range(38, 53)], # 15 Qs
    "civil-fluids": [f"ce-q-{i:03d}" for i in range(53, 65)], # 12 Qs
    "civil-hydrology-irrigation": ["ce-q-061", "ce-q-062", "ce-q-063", "ce-q-064", "ce-q-057", "ce-q-058"], # 6 Qs
    "civil-env": [f"ce-q-{i:03d}" for i in range(65, 75)], # 10 Qs
    "civil-surveying": [f"ce-q-{i:03d}" for i in range(75, 83)], # 8 Qs
    "civil-transport": [f"ce-q-{i:03d}" for i in range(83, 91)], # 8 Qs
    "civil-steel": [f"ce-q-{i:03d}" for i in range(91, 96)] + ["ce-q-027"], # 6 Qs
    "civil-bldg-materials": ["ce-q-096", "ce-q-097", "ce-q-098", "ce-q-007", "ce-q-012"], # 5 Qs
    "civil-cpm-pert": ["ce-q-099", "ce-q-100", "ce-q-083", "ce-q-075"], # 4 Qs
    "civil-estimating-costing": [], # Has its own 4 questions already in tk
    "gs-polity": [f"gs-q-{i:03d}" for i in range(1, 19)], # 18 Qs
    "gs-india-history": [f"gs-q-{i:03d}" for i in range(19, 37)], # 18 Qs
    "gs-assam-geography": [f"gs-q-{i:03d}" for i in range(37, 53)], # 16 Qs
    "gs-economy": [f"gs-q-{i:03d}" for i in range(53, 67)], # 14 Qs
    "gs-science": [f"gs-q-{i:03d}" for i in range(67, 81)], # 14 Qs
    "gs-assam-history": [f"gs-q-{i:03d}" for i in range(81, 91)], # 10 Qs
    "gs-aptitude": [f"gs-q-{i:03d}" for i in range(91, 101)], # 10 Qs
}

# Module enrichment metadata
metadata = {
    "civil-rcc": {
        "unitName": "Structural Engineering",
        "codeClause": "IS 456:2000 Clause 38.1",
        "confidencePercent": 68,
        "masteredStatus": "In Progress",
        "diagramType": "rcc",
        "subtopicList": ["Limit State Philosophy & Strain Compatibility", "Rectangular & Flanged Beams", "Shear & Bond Detailing", "Axial Compression Members (Columns)", "Isolated Footings & Retaining Walls"],
        "comparisonGrid": {
            "titleLeft": "Concrete Characteristics",
            "tagLeft": "γm = 1.50",
            "valueLeft": "fcd = 0.45 fck",
            "descLeft": "Accounts for 0.67 factor for size effect in structures, then divided by partial safety factor of 1.50.",
            "titleRight": "Steel Reinforcement",
            "tagRight": "γm = 1.15",
            "valueRight": "fsd = 0.87 fy",
            "descRight": "Strict quality control in industrial manufacture allows a lower partial safety factor compared to site-cast concrete."
        },
        "callouts": {
            "corePostulate": "Maximum compressive strain in concrete at the outer compression fiber in bending is taken as 0.0035, irrespective of concrete grade.",
            "corePostulateRef": "IS 456:2000 Cl. 38.1(b)",
            "examTrap": "Do not confuse characteristic strength fck (5% tolerance) with design strength 0.45 fck in stress block calculations. 0.67 is structural reduction!",
            "examTrapRef": "Frequently asked in APSC 2018, 2020",
            "testedRatios": [
                {"label": "Fe 250 (Mild Steel):", "value": "xu,max / d = 0.53"},
                {"label": "Fe 415 (HYSD):", "value": "xu,max / d = 0.48"},
                {"label": "Fe 500 (TMT):", "value": "xu,max / d = 0.46"}
            ],
            "numericalShortcut": {
                "formula": "Mu,lim = Q · fck · b · d²",
                "note": "Where Q = 0.148 for Fe 250, 0.138 for Fe 415, and 0.133 for Fe 500. Master these coefficients to skip 90-second manual derivation during paper."
            }
        },
        "aiTutorPrompts": [
            {"question": "Why is the concrete design strength taken as 0.45 fck instead of 0.67 fck?", "answerPreview": "Characteristic cylinder strength is 0.8 fck (cube). Size effect reduces strength in structures to 0.67 fck. Applying partial safety factor γc = 1.5 gives 0.67/1.5 = 0.446 ≈ 0.45 fck."},
            {"question": "What happens if xu exceeds xu,max in a beam design?", "answerPreview": "The section becomes over-reinforced. Concrete reaches failure strain (0.0035) before steel yields, causing sudden brittle failure without warning. IS 456 mandates limiting moment to Mu,lim."},
            {"question": "How is development length Ld calculated?", "answerPreview": "Ld = (0.87 * fy * phi) / (4 * tau_bd). For deformed bars (HYSD), tau_bd is increased by 60%. For compression, it is increased by 25%."}
        ]
    },
    "civil-prestressed": {
        "unitName": "Structural Engineering",
        "codeClause": "IS 1343:2012 Cl. 6, 19",
        "confidencePercent": 55,
        "masteredStatus": "Needs Practice",
        "diagramType": "rcc",
        "subtopicList": ["Prestressing Systems (Freyssinet, Magnel, Gifford-Udall)", "Losses of Prestress (Elastic, Creep, Shrinkage, Relaxation)", "Load Balancing Parabolic Profile", "End Block Anchorage Zone Stresses"],
        "comparisonGrid": {
            "titleLeft": "Pre-Tensioning System",
            "tagLeft": "Losses ≈ 18%",
            "valueLeft": "fci ≥ 40 MPa",
            "descLeft": "Tendons tensioned before concrete is placed; stress transferred purely through bond length. High initial strength required.",
            "titleRight": "Post-Tensioning System",
            "tagRight": "Losses ≈ 15%",
            "valueRight": "fci ≥ 30 MPa",
            "descRight": "Tendons jacked through ducts against hardened concrete; anchored mechanically by wedges or bearing plates."
        },
        "callouts": {
            "corePostulate": "Loss of prestress due to elastic shortening occurs in pre-tensioning always; in post-tensioning it occurs ONLY if tendons are tensioned sequentially one by one.",
            "corePostulateRef": "IS 1343:2012 Cl. 19.5.2",
            "examTrap": "In load balancing, an upward parabolic tendon provides a uniform upward load w_up = 8 P e / L². Do not forget that eccentricity e is measured at midspan!",
            "examTrapRef": "APSC AE 2020 & GATE Civil",
            "testedRatios": [
                {"label": "Elastic Shortening Loss (Pre):", "value": "m · fc = (Es / Ec) · fc"},
                {"label": "Shrinkage Strain (Pre-tensioned):", "value": "0.0003"},
                {"label": "Shrinkage Strain (Post-tensioned):", "value": "0.0002 / log10(t + 2)"}
            ],
            "numericalShortcut": {
                "formula": "Friction & Wobble Loss = P0 · (mu · alpha + k · x)",
                "note": "Where mu = coefficient of friction, alpha = cumulative angle change, and k = wobble factor per meter length."
            }
        },
        "aiTutorPrompts": [
            {"question": "How does the load balancing method work for parabolic tendons?", "answerPreview": "A parabolic tendon with sag e under prestress P exerts an upward uniform force w = 8 P e / L². If designed to equal the dead load, the beam is free from bending moments and deflection under self-weight."},
            {"question": "What causes anchorage slip loss?", "answerPreview": "When the prestressing jack releases, the wedges slide slightly into the duct before gripping, causing loss Delta L. Loss in stress = (Delta L * Es) / L."}
        ]
    },
    "civil-structural-analysis": {
        "unitName": "Structural Engineering",
        "codeClause": "Matrix & Energy Methods / IS 875",
        "confidencePercent": 45,
        "masteredStatus": "Weak Area",
        "diagramType": "som",
        "subtopicList": ["Static (Ds) & Kinematic (Dk) Indeterminacy", "Moment Distribution Method (Hardy Cross)", "Slope Deflection Equations", "Influence Line Diagrams & Muller-Breslau Principle", "Three-Hinged vs Two-Hinged Arches"],
        "comparisonGrid": {
            "titleLeft": "Force / Flexibility Method",
            "tagLeft": "Unknowns = Ds",
            "valueLeft": "Compatibility Equations",
            "descLeft": "Best suited when static indeterminacy is low (e.g. propped cantilever Ds=1). Matrix flexibility [F] used.",
            "titleRight": "Displacement / Stiffness Method",
            "tagRight": "Unknowns = Dk",
            "valueRight": "Equilibrium Equations",
            "descRight": "Best suited for modern computer analysis (FEA). Unknowns are nodal displacements. Matrix stiffness [K] used."
        },
        "callouts": {
            "corePostulate": "Muller-Breslau principle states that the influence line for any internal stress resultant is proportional to the deflected shape obtained by removing that restraint and applying a unit displacement.",
            "corePostulateRef": "Structural Analysis Theorem",
            "examTrap": "In a three-hinged parabolic arch under full UDL, bending moment is ZERO at every section! In a two-hinged arch, horizontal thrust is H = (integral M y dx) / (integral y² dx).",
            "examTrapRef": "GATE & State AE Favorite",
            "testedRatios": [
                {"label": "Carry Over Factor (Far End Fixed):", "value": "+0.50"},
                {"label": "Carry Over Factor (Far End Hinged):", "value": "0.00"},
                {"label": "Bending Stiffness (Far End Fixed):", "value": "4EI / L"},
                {"label": "Bending Stiffness (Far End Hinged):", "value": "3EI / L"}
            ],
            "numericalShortcut": {
                "formula": "Kinematic Indeterminacy (Plane Frame) = 3j - r + m_axial",
                "note": "Neglecting axial deformation reduces Dk significantly: Dk = 3j - r - m."
            }
        },
        "aiTutorPrompts": [
            {"question": "How do you apply the Muller-Breslau principle to draw ILD?", "answerPreview": "To obtain the ILD for any stress resultant (shear, moment, reaction), remove the corresponding constraint and introduce a unit deformation. The resulting deflected shape is the ILD to some scale."},
            {"question": "What is Castigliano's Second Theorem?", "answerPreview": "The partial derivative of total strain energy with respect to a concentrated load gives the deflection in the direction of that load: Delta_i = dU / dP_i."}
        ]
    },
    "civil-som": {
        "unitName": "Structural Engineering",
        "codeClause": "Mechanics of Deformable Solids",
        "confidencePercent": 80,
        "masteredStatus": "Mastered",
        "diagramType": "som",
        "subtopicList": ["Elastic Constants (E, G, K, mu)", "Mohr's Circle & Principal Stresses", "SFD & BMD for Determinate Beams", "Bending & Shear Stresses in Sections", "Torsion of Circular Shafts", "Euler's Column Buckling"],
        "comparisonGrid": {
            "titleLeft": "Pure Bending Theory",
            "tagLeft": "Bernoulli-Euler",
            "valueLeft": "σ / y = M / I = E / R",
            "descLeft": "Stresses vary linearly across the beam depth with zero stress at the neutral axis. Plane sections remain plane.",
            "titleRight": "Torsion of Shafts",
            "tagRight": "Coulomb Theory",
            "valueRight": "T / J = τ / r = Gθ / L",
            "descRight": "Shear stress varies linearly from zero at center to maximum at outer radius. Polar moment of inertia J = pi*D^4 / 32."
        },
        "callouts": {
            "corePostulate": "Relationships between elastic constants: E = 2G(1 + mu) = 3K(1 - 2mu) = 9KG / (3K + G). For isotropic materials, Poisson's ratio mu lies between 0 and 0.5.",
            "corePostulateRef": "Elasticity Fundamentals",
            "examTrap": "In a rectangular section, max shear stress is 1.5 * tau_avg at the neutral axis. In a triangular section, max shear stress is 1.5 * tau_avg at h/2, NOT at the neutral axis (h/3)!",
            "examTrapRef": "APSC AE 2018, SSC JE 2021",
            "testedRatios": [
                {"label": "Columns Both Ends Hinged:", "value": "Le = 1.0 L"},
                {"label": "Columns Both Ends Fixed:", "value": "Le = 0.5 L (design 0.65L)"},
                {"label": "One Fixed, One Free:", "value": "Le = 2.0 L"},
                {"label": "One Fixed, One Hinged:", "value": "Le = 0.707 L (design 0.8L)"}
            ],
            "numericalShortcut": {
                "formula": "Euler Buckling Load Pcr = (pi² · E · I) / Le²",
                "note": "Euler formula applies only to long/slender columns where slenderness ratio lambda > 89 for mild steel."
            }
        },
        "aiTutorPrompts": [
            {"question": "How do you find the center and radius of Mohr's Circle?", "answerPreview": "Center is at ((sigma_x + sigma_y)/2, 0). Radius is R = sqrt(((sigma_x - sigma_y)/2)^2 + tau_xy^2). The maximum in-plane shear stress equals the radius R."},
            {"question": "What is the core or kern of a section?", "answerPreview": "The region within which a compressive load can act without causing any tensile stresses anywhere in the cross-section. For a rectangle b x d, kern is a rhombus with diagonals b/3 and d/3."}
        ]
    },
    "civil-geotech": {
        "unitName": "Geotechnical Engineering",
        "codeClause": "IS 1498, IS 2720, IS 6403",
        "confidencePercent": 55,
        "masteredStatus": "In Progress",
        "diagramType": "geotech",
        "subtopicList": ["Three-Phase Soil Relationships (e, n, w, S, G)", "Plasticity Chart & USCS/IS Classification", "Darcy's Law, Permeability & Seepage", "Terzaghi 1D Consolidation Theory", "Mohr-Coulomb Shear Strength & Triaxial", "Rankine & Coulomb Earth Pressure", "Terzaghi Bearing Capacity & Pile Groups"],
        "comparisonGrid": {
            "titleLeft": "Active Earth Pressure",
            "tagLeft": "Wall moves OUT",
            "valueLeft": "Ka = (1 - sinφ) / (1 + sinφ)",
            "descLeft": "Minimum lateral earth pressure developed when retaining wall deflects away from the retained backfill.",
            "titleRight": "Passive Earth Pressure",
            "tagRight": "Wall pushes IN",
            "valueRight": "Kp = (1 + sinφ) / (1 - sinφ) = 1/Ka",
            "descRight": "Maximum lateral earth resistance developed when retaining structure is forced into the soil mass."
        },
        "callouts": {
            "corePostulate": "Terzaghi's effective stress principle: total stress sigma = sigma' + u. All physical responses (compression, shearing resistance, consolidation) depend strictly on effective stress sigma'.",
            "corePostulateRef": "Terzaghi Soil Mechanics",
            "examTrap": "Quick sand condition is NOT a type of soil! It is a hydraulic boiling phenomenon in cohesionless sands when upward hydraulic gradient reaches critical value icr = (G - 1) / (1 + e) ≈ 1.0.",
            "examTrapRef": "APSC AE 2020 & ESE",
            "testedRatios": [
                {"label": "A-line Plasticity Equation:", "value": "IP = 0.73 · (wL - 20)"},
                {"label": "Compression Index (Undisturbed):", "value": "Cc = 0.009 · (wL - 10)"},
                {"label": "Converse-Labarre Pile Efficiency:", "value": "eta = 1 - theta(n-1)m + m-1..."},
                {"label": "Safe Bearing Capacity:", "value": "q_safe = (q_net_ult / FOS) + gamma*Df"}
            ],
            "numericalShortcut": {
                "formula": "Terzaghi Strip Footing qu = c · Nc + q · Nq + 0.5 · gamma · B · Ngamma",
                "note": "For circular footings multiply c*Nc by 1.3 and gamma*B*Ngamma by 0.6. For square footings multiply c*Nc by 1.3 and gamma*B*Ngamma by 0.8."
            }
        },
        "aiTutorPrompts": [
            {"question": "How do you distinguish between clays and silts on the plasticity chart?", "answerPreview": "Plot the soil with (Liquid Limit, Plasticity Index). Points plotting ABOVE the A-line (IP = 0.73(wL - 20)) are inorganic clays (CL, CI, CH). Points BELOW the A-line are silts (ML, MI, MH) or organic soils."},
            {"question": "What is the difference between direct shear test and triaxial test?", "answerPreview": "In direct shear, failure plane is predetermined horizontally and stress distribution is non-uniform with no pore pressure control. In triaxial, failure occurs along the weakest natural plane with precise pore pressure measurement (UU, CU, CD)."}
        ]
    },
    "civil-fluids": {
        "unitName": "Water Resources & Fluid Mechanics",
        "codeClause": "Fluid Mechanics & Hydraulics Handbook",
        "confidencePercent": 62,
        "masteredStatus": "In Progress",
        "diagramType": "fluids",
        "subtopicList": ["Fluid Properties & Newton's Law of Viscosity", "Hydrostatic Pressure, Buoyancy & Metacenter", "Continuity & Velocity Potential / Stream Function", "Bernoulli Equation & Flow Measurement (Venturi/Orifice)", "Pipe Flow Friction (Darcy-Weisbach & Moody)", "Open Channel Flow & Hydraulic Jump"],
        "comparisonGrid": {
            "titleLeft": "Laminar Pipe Flow",
            "tagLeft": "Re < 2000",
            "valueLeft": "f = 64 / Re",
            "descLeft": "Viscous forces dominate; parabolic velocity profile u = u_max(1 - r²/R²); maximum velocity is exactly 2 times average velocity.",
            "titleRight": "Turbulent Pipe Flow",
            "tagRight": "Re > 4000",
            "valueRight": "1/√f = 2 log(R/k) + 1.74",
            "descRight": "Inertia forces dominate; flat logarithmic / 1/7th power velocity profile; friction factor depends on relative pipe roughness."
        },
        "callouts": {
            "corePostulate": "For stable equilibrium of a submerged body, center of buoyancy B must lie above center of gravity G. For a floating body, metacentric height GM = (I / V) - BG must be positive.",
            "corePostulateRef": "Fluid Statics Principles",
            "examTrap": "Piezometric head is the sum of pressure head and elevation datum head (p/gamma + z). The Hydraulic Gradient Line (HGL) represents piezometric head, NOT total head!",
            "examTrapRef": "GATE & PSC Trap",
            "testedRatios": [
                {"label": "Hydraulic Jump Sequent Depth:", "value": "y2/y1 = 0.5 · (√(1 + 8Fr1²) - 1)"},
                {"label": "Energy Loss in Hydraulic Jump:", "value": "ΔE = (y2 - y1)³ / (4 · y1 · y2)"},
                {"label": "Most Efficient Rectangular Channel:", "value": "R = y / 2  (Width B = 2y)"},
                {"label": "Most Efficient Trapezoidal Channel:", "value": "R = y / 2  (Side slope 60°)"}
            ],
            "numericalShortcut": {
                "formula": "Critical Depth in Rectangular Channel yc = (q² / g)^(1/3)",
                "note": "At critical flow, Froude number Fr = 1.0, and specific energy is minimum: E_min = 1.5 yc."
            }
        },
        "aiTutorPrompts": [
            {"question": "What is the physical meaning of stream function psi and velocity potential phi?", "answerPreview": "Equipotential lines (phi = const) and streamlines (psi = const) intersect orthogonally everywhere. The difference between two streamlines equals the volumetric flow rate per unit thickness: q = psi2 - psi1."},
            {"question": "How do you calculate the head loss in sudden enlargement?", "answerPreview": "Loss due to sudden expansion is h_e = (v1 - v2)^2 / (2g). If expanding into a large reservoir (v2 = 0), exit loss = v1^2 / (2g)."}
        ]
    },
    "civil-hydrology-irrigation": {
        "unitName": "Water Resources & Fluid Mechanics",
        "codeClause": "IS 6512:1984, CWC Guidelines",
        "confidencePercent": 50,
        "masteredStatus": "Needs Practice",
        "diagramType": "fluids",
        "subtopicList": ["Hydrologic Cycle, Precipitation & Infiltration Indices (phi, W)", "Sherman's Unit Hydrograph & S-Curve Technique", "Canal Design: Lacey's Regime vs Kennedy Silt Theory", "Gravity Dam Stability & Elementary Profile", "Diversion Headworks & Khosla's Independent Variables"],
        "comparisonGrid": {
            "titleLeft": "Kennedy's Silt Theory",
            "tagLeft": "Bed Eddies Only",
            "valueLeft": "vc = 0.55 · m · y^0.64",
            "descLeft": "Assumes silt is held in suspension only by vertical eddies generated from the horizontal canal bed. Critical velocity ratio m used.",
            "titleRight": "Lacey's Regime Theory",
            "tagRight": "All Wetted Perimeter",
            "valueRight": "v = (f²·q / 140)^(1/6)",
            "descRight": "Assumes silt-supporting eddies are generated from the entire wetted perimeter. P = 4.75 √Q, S = f^(5/3) / (3340 Q^(1/6))."
        },
        "callouts": {
            "corePostulate": "A Unit Hydrograph represents the direct runoff hydrograph resulting from 1 cm (or 1 unit) of effective rainfall occurring uniformly over a catchment at a constant rate during a specified duration.",
            "corePostulateRef": "Sherman (1932)",
            "examTrap": "Duty D (ha/cumec) and Delta Δ (meters) relationship is Δ = (8.64 · B) / D, where B is the base period in days. Delta is MAXIMUM at the head of the main canal!",
            "examTrapRef": "APSC AE & SSC JE",
            "testedRatios": [
                {"label": "Lacey's Silt Factor:", "value": "f = 1.76 · √d_mm"},
                {"label": "Lacey's Wetted Perimeter:", "value": "P = 4.75 · √Q"},
                {"label": "Lacey's Hydraulic Radius:", "value": "R = (5/2) · (v² / f)"},
                {"label": "Gravity Dam Elementary Base:", "value": "B = H / √(G - c)"}
            ],
            "numericalShortcut": {
                "formula": "Khosla's Exit Gradient GE = (H / d) · (1 / (pi · √lambda))",
                "note": "Where lambda = (1 + √(1 + alpha²)) / 2 and alpha = b / d. To prevent piping, exit gradient must be safe (e.g. 1/5 to 1/6 for fine sand)."
            }
        },
        "aiTutorPrompts": [
            {"question": "How do you derive an S-curve from a Unit Hydrograph?", "answerPreview": "An S-curve is formed by adding a series of identical Unit Hydrographs of duration D spaced at intervals of D. It gives the continuous equilibrium runoff under constant 1 cm/D rainfall rate."},
            {"question": "What are the causes of waterlogging in agricultural soils?", "answerPreview": "Over-irrigation, seepage from unlined canals, inadequate surface/subsurface drainage, and obstruction of natural drainage pathways raise the water table into the root zone, suffocating crops."}
        ]
    },
    "civil-env": {
        "unitName": "Environmental Engineering",
        "codeClause": "IS 10500:2012, CPHEEO Manual",
        "confidencePercent": 28,
        "masteredStatus": "Weak Area",
        "diagramType": "env",
        "subtopicList": ["Water Quality Standards (IS 10500:2012)", "Stokes' Law & Discrete Settling in Clarifiers", "Rapid Sand vs Slow Sand Filters", "Disinfection Chemistry & Breakpoint Chlorination", "BOD Kinetics & Streeter-Phelps DO Sag", "Activated Sludge Process (F/M, SVI, theta_c)", "Air Pollution & Plume Behavior"],
        "comparisonGrid": {
            "titleLeft": "Slow Sand Filter",
            "tagLeft": "Biological Purification",
            "valueLeft": "Rate: 100 - 200 L/hr/m²",
            "descLeft": "Requires no chemical coagulants; relies on biologically active Schmutzdecke layer; cleaned by scraping sand surface.",
            "titleRight": "Rapid Sand Filter",
            "tagRight": "Mechanical Interception",
            "valueRight": "Rate: 3000 - 6000 L/hr/m²",
            "descRight": "Requires chemical coagulation & flocculation pretreatment; coarse sand media; cleaned by high-pressure backwashing."
        },
        "callouts": {
            "corePostulate": "IS 10500:2012 standards: Fluoride permissible limit is 1.0 mg/L (> 1.5 causes dental/skeletal fluorosis); Nitrate limit is 45 mg/L (> 45 causes infant blue baby disease); Arsenic is 0.01 mg/L.",
            "corePostulateRef": "IS 10500:2012 Drinking Water Specification",
            "examTrap": "Standard BOD is evaluated at 20°C over 5 days: BOD5 = (DO_initial - DO_final) * Dilution Factor. BOD5 is roughly 68% of ultimate carbonaceous BOD (L0).",
            "examTrapRef": "APSC AE 2020 & GATE Civil",
            "testedRatios": [
                {"label": "Stokes Settling Velocity:", "value": "vs = g(rho_s - rho)d² / (18 mu)"},
                {"label": "Surface Overflow Rate (SOR):", "value": "v0 = Q / A_surface"},
                {"label": "Sludge Volume Index (SVI):", "value": "SVI = (settled volume in mL) / MLSS (g)"},
                {"label": "Good Settling Sludge:", "value": "SVI between 50 and 150 mL/g"}
            ],
            "numericalShortcut": {
                "formula": "Streeter-Phelps Critical Deficit Dc = (K1 / K2) · L0 · e^(-K1 · tc)",
                "note": "Occurs when rate of microbial deoxygenation equals rate of atmospheric reaeration. Downstream point is most critical for aquatic survival."
            }
        },
        "aiTutorPrompts": [
            {"question": "What is breakpoint chlorination?", "answerPreview": "Adding chlorine to water first oxidizes reducing compounds, then reacts with ammonia to form chloramines. At the breakpoint, all chloramines are completely oxidized. Any chlorine added past this point appears as free residual chlorine (HOCl + OCl-)."},
            {"question": "Explain plume dispersion patterns based on environmental lapse rate (ELR).", "answerPreview": "Superadiabatic (ELR > DALR) produces Looping; Neutral produces Coning; Subadiabatic/Inversion produces Fanning; Inversion below stack and unstable above produces Lofting (safest for ground); Unstable below and inversion above produces Fumigation (most hazardous)."}
        ]
    },
    "civil-transport": {
        "unitName": "Transportation Engineering",
        "codeClause": "IRC:73-1980, IRC:37-2018, IRC:58-2015",
        "confidencePercent": 40,
        "masteredStatus": "Needs Practice",
        "diagramType": "highway",
        "subtopicList": ["Camber, Right of Way & Kerbs", "Sight Distances (SSD, OSD, ISD)", "Horizontal Curves & Superelevation (e + f = v² / 127R)", "Transition Spiral Curves & Widening", "Flexible Pavements (CBR & IRC 37)", "Rigid Pavements (Westergaard Stresses & IRC 58)", "Traffic Studies & Webster Traffic Signals"],
        "comparisonGrid": {
            "titleLeft": "Flexible Pavements (IRC 37)",
            "tagLeft": "Layered Deflection",
            "valueLeft": "CBR & Cumulative Axles",
            "descLeft": "Load transferred by grain-to-grain contact pressure down to subgrade; low flexural strength; repairs easy; life 15 years.",
            "titleRight": "Rigid Pavements (IRC 58)",
            "tagRight": "Slab Flexural Action",
            "valueRight": "Westergaard Modulus k",
            "descRight": "High flexural strength slab action; wheel load + temperature warping stresses critical; dowel and tie bars at joints; life 30-40 years."
        },
        "callouts": {
            "corePostulate": "Maximum permissible superelevation as per IRC 73: 7% for plain and rolling terrain, 10% for hilly roads not bound by snow, and 4% for urban roads with frequent intersections.",
            "corePostulateRef": "IRC:73-1980 Geometric Design",
            "examTrap": "Stopping Sight Distance SSD = 0.278 V t + V² / (254(f ± 0.01n)). For two-way traffic on a single-lane road, minimum design sight distance is 2 * SSD!",
            "examTrapRef": "APSC AE 2018, 2020",
            "testedRatios": [
                {"label": "Mechanical Widening:", "value": "Wm = n · l² / (2 · R)"},
                {"label": "Psychological Widening:", "value": "Wps = V / (9.5 · √R)"},
                {"label": "Equilibrium Superelevation:", "value": "e_eq = V² / (127 · R)  (f = 0)"},
                {"label": "Camber for Heavy Rain (Bituminous):", "value": "2.5% (1 in 40)"}
            ],
            "numericalShortcut": {
                "formula": "Webster Optimum Signal Cycle C0 = (1.5 · L + 5) / (1 - Y)",
                "note": "Where L is total lost time per cycle and Y = sum of (qi / si) for critical approaches. Minimizes total delay to vehicles."
            }
        },
        "aiTutorPrompts": [
            {"question": "How is superelevation designed for mixed traffic conditions in India?", "answerPreview": "Per IRC, design for 75% of design speed neglecting friction: e = (0.75 V)^2 / (127 R) = V^2 / (225 R). If e <= 0.07, provide this value. If e > 0.07, cap at 0.07 and check lateral friction f."},
            {"question": "What is the critical combination of stresses in rigid pavement design?", "answerPreview": "During summer mid-day: Wheel load stress at edge + Warping stress (tension at bottom) = Maximum edge stress. During winter midnight: Corner wheel load + Warping stress = Maximum corner stress."}
        ]
    },
    "civil-surveying": {
        "unitName": "Surveying & Geomatics",
        "codeClause": "Survey of India Specifications",
        "confidencePercent": 70,
        "masteredStatus": "Mastered",
        "diagramType": "survey",
        "subtopicList": ["Survey Principles (Whole to Part) & Chain Errors", "Compass Traversing, WCB/QB & Declination", "Levelling: Collimation vs Rise-Fall & Reciprocal", "Contouring Characteristics & Interpolation", "Theodolite Traverse & Bowditch Rule", "Simple Circular & Vertical Curves", "Total Station, GNSS & GIS Applications"],
        "comparisonGrid": {
            "titleLeft": "Height of Instrument Method",
            "tagLeft": "Faster Computation",
            "valueLeft": "HI = RL + BS",
            "descLeft": "Rapid arithmetic for multiple intermediate sights; check: ΣBS - ΣFS = Last RL - First RL. No check on intermediate sights.",
            "titleRight": "Rise and Fall Method",
            "tagRight": "Complete Check",
            "valueRight": "ΣRise - ΣFall = ΔRL",
            "descRight": "Calculates every point relative to preceding point; checks all readings including intermediate sights: ΣBS - ΣFS = ΣRise - ΣFall = Last RL - First RL."
        },
        "callouts": {
            "corePostulate": "Combined correction for earth curvature and atmospheric refraction is C = 0.0673 * d² (meters), where d is distance in kilometers. This correction is ALWAYS subtractive from the staff reading.",
            "corePostulateRef": "Levelling Physics",
            "examTrap": "Reciprocal levelling completely eliminates errors due to curvature, collimation tilt, and average refraction, but does NOT eliminate variations in refraction between shots!",
            "examTrapRef": "APSC AE 2020",
            "testedRatios": [
                {"label": "Curvature Correction:", "value": "Cc = -0.0785 · d² (m)"},
                {"label": "Refraction Correction:", "value": "Cr = +0.0112 · d² (m)"},
                {"label": "Tacheometric Multiplying Const:", "value": "k = f / i = 100"},
                {"label": "Tacheometric Additive Const:", "value": "c = f + d = 0 (analytic)"}
            ],
            "numericalShortcut": {
                "formula": "Bowditch Correction to Latitude = e_L · (l / Sigma_l)",
                "note": "Applicable when linear and angular measurements are of equal precision. Transit rule is used when angular measurements are more precise."
            }
        },
        "aiTutorPrompts": [
            {"question": "How do you correct for local attraction in compass surveying?", "answerPreview": "Find a line whose fore bearing and back bearing differ by exactly 180 degrees. The stations at its ends are free from local attraction. Use these unaffected stations to correct successive bearings in the traverse."},
            {"question": "What are the key contour characteristics for cliffs and valleys?", "answerPreview": "Contours forming V-shapes with the apex pointing uphill represent a Valley line (stream). U-shapes pointing downhill indicate a Ridge line. Contours crossing each other indicate an Overhanging Cliff or Cave."}
        ]
    },
    "civil-steel": {
        "unitName": "Structural Engineering",
        "codeClause": "IS 800:2007 LSM",
        "confidencePercent": 20,
        "masteredStatus": "Weak Area",
        "diagramType": "som",
        "subtopicList": ["Limit State Design Philosophy (IS 800:2007)", "Bolted Connections (Bearing & HSFG)", "Fillet & Butt Welds (Throat Thickness t = ks)", "Tension Members & Shear Lag Effect", "Compression Members & Lacing / Battening Rules", "Plastic Analysis: Shape Factors & Collapse Mechanisms"],
        "comparisonGrid": {
            "titleLeft": "Lacing System (IS 800 Cl. 7.6)",
            "tagLeft": "Transverse Shear 2.5%",
            "valueLeft": "λ_lace ≤ 145",
            "descLeft": "Inclined bars at 40° to 70°; designed for transverse shear equal to 2.5% of axial column load.",
            "titleRight": "Battening System (IS 800 Cl. 7.7)",
            "tagRight": "Bending & Shear",
            "valueRight": "Effective λ + 10%",
            "descRight": "Horizontal plates connecting column components; effective slenderness of column is increased by 10% to account for shear deformation."
        },
        "callouts": {
            "corePostulate": "Effective throat thickness of fillet weld is t = k * s, where k = 0.70 for angle between fusion faces 60° to 90°. Fillet weld is always designed for shear on effective throat area.",
            "corePostulateRef": "IS 800:2007 Cl. 10.5.3",
            "examTrap": "Maximum slenderness ratio lambda = L/r limits per IS 800 Table 3: Tension member with wind/earthquake reversal = 350; Compression flange of beam = 300; Compression member under dead/live load = 180.",
            "examTrapRef": "APSC AE 2020 & SSC JE",
            "testedRatios": [
                {"label": "Shape Factor (Diamond Section):", "value": "S = 2.00"},
                {"label": "Shape Factor (Triangular Section):", "value": "S = 2.34"},
                {"label": "Shape Factor (Circular Section):", "value": "S = 1.70"},
                {"label": "Shape Factor (Rectangular Section):", "value": "S = 1.50"},
                {"label": "Shape Factor (I-Section):", "value": "S = 1.12 to 1.15"}
            ],
            "numericalShortcut": {
                "formula": "Plastic Collapse Load (SSB with Point Load W) Wc = 4 · Mp / L",
                "note": "For fixed beam with central point load Wc = 8 Mp / L. For fixed beam with uniform load w_c = 16 Mp / L²."
            }
        },
        "aiTutorPrompts": [
            {"question": "What is the shear lag effect in tension members?", "answerPreview": "When an angle section is connected through only one leg, the connected leg carries stress directly while the unconnected leg lags behind in taking stress. IS 800 accounts for this via net effective area Anet = A1 + A2 * k."},
            {"question": "What are High Strength Friction Grip (HSFG) bolts?", "answerPreview": "HSFG bolts (Grade 8.8 or 10.9) are tightened to a pre-determined high tension. Load is transmitted purely through friction between the clamping contact surfaces, preventing any bearing or slip at working loads."}
        ]
    },
    "civil-bldg-materials": {
        "unitName": "Construction Management & Building Materials",
        "codeClause": "IS 10262:2019, IS 269:2015, IS 383:2016",
        "confidencePercent": 75,
        "masteredStatus": "Mastered",
        "diagramType": "rcc",
        "subtopicList": ["Cement Chemistry & Bogue's Compounds (C3S, C2S, C3A, C4AF)", "Physical Testing of Cement (Vicat, Le Chatelier, Autoclave)", "Concrete Workability: Slump, Compaction Factor & Vee-Bee", "Bulking of Sand & Aggregate Grading", "Chemical Admixtures (Plasticizers, Retarders, Accelerators)", "Concrete Mix Proportioning (IS 10262:2019)"],
        "comparisonGrid": {
            "titleLeft": "Tricalcium Silicate (C3S)",
            "tagLeft": "50% to 60% of OPC",
            "valueLeft": "Rapid Hydration",
            "descLeft": "Responsible for early strength development (7-day strength); produces high early heat of hydration; best for rapid-hardening cements.",
            "titleRight": "Dicalcium Silicate (C2S)",
            "tagRight": "15% to 25% of OPC",
            "valueRight": "Progressive Strength",
            "descRight": "Hydrates very slowly; responsible for progressive long-term strength gain after 28 days; low heat of hydration; highly resistant to chemical attack."
        },
        "callouts": {
            "corePostulate": "Standard consistency of cement is determined by Vicat apparatus using a 10 mm diameter plunger penetrating to a depth of 33-35 mm from the top (5-7 mm from bottom) of the Vicat mold.",
            "corePostulateRef": "IS 4031 (Part 4)",
            "examTrap": "Le Chatelier apparatus measures soundness due to UNBURNT FREE LIME only (limit <= 10 mm). Unsoundness due to MAGNESIA must be measured using the Autoclave test (limit <= 0.8%)!",
            "examTrapRef": "APSC AE 2018 & SSC JE",
            "testedRatios": [
                {"label": "Initial Setting Time (OPC):", "value": "≥ 30 minutes"},
                {"label": "Final Setting Time (OPC):", "value": "≤ 600 minutes (10 hrs)"},
                {"label": "Bulking of Sand (Peak):", "value": "15% - 30% at 4% - 5% moisture"},
                {"label": "Target Mean Strength:", "value": "f'ck = fck + 1.65 · s"}
            ],
            "numericalShortcut": {
                "formula": "Compaction Factor = (Mass of partially compacted concrete) / (Mass of fully compacted concrete)",
                "note": "Compaction factor values: 0.85 (low workability), 0.92 (medium workability), 0.95 (high workability). More precise than slump for dry mixes."
            }
        },
        "aiTutorPrompts": [
            {"question": "Why does sand show bulking at 4-5% moisture?", "answerPreview": "Moisture creates thin surface-tension meniscus films around sand particles that push grains apart, increasing bulk volume by up to 30%. When completely flooded, the meniscus films break and volume returns to normal."},
            {"question": "How do superplasticizers increase workability without adding water?", "answerPreview": "Superplasticizers (polycarboxylate ethers) disperse cement particle flocs through electrostatic repulsion and steric hindrance, freeing trapped water to lubricate the mix."}
        ]
    },
    "civil-cpm-pert": {
        "unitName": "Construction Management & Building Materials",
        "codeClause": "IS 14580, CPWD Works Manual",
        "confidencePercent": 60,
        "masteredStatus": "In Progress",
        "diagramType": "som",
        "subtopicList": ["Network Logic, Dummy Activities & Fulkerson's Rule", "Critical Path Method (CPM): Total, Free & Independent Float", "PERT Probabilistic 3-Time Estimates & Variance", "Normal Distribution Probability of Schedule Completion", "Project Crashing, Cost Slopes & Optimum Duration"],
        "comparisonGrid": {
            "titleLeft": "Critical Path Method (CPM)",
            "tagLeft": "Deterministic",
            "valueLeft": "Activity-Oriented",
            "descLeft": "Single time estimate; used in construction and repetitive infrastructure projects; emphasis on time-cost trade-off and crashing.",
            "titleRight": "PERT",
            "tagRight": "Probabilistic",
            "valueRight": "Event-Oriented",
            "descRight": "Three time estimates (to, tm, tp); beta distribution of activity times; used for R&D and non-repetitive projects where durations are uncertain."
        },
        "callouts": {
            "corePostulate": "Critical path is the longest sequence of activities connecting the project start to completion; all activities on the critical path have ZERO total float.",
            "corePostulateRef": "Operations Research Standards",
            "examTrap": "Total Float (LF_j - ES_i - t_ij) affects preceding and succeeding activities; Free Float (ES_j - ES_i - t_ij) affects ONLY succeeding activities; Independent Float affects neither!",
            "examTrapRef": "GATE & State AE Favorite",
            "testedRatios": [
                {"label": "PERT Expected Time:", "value": "te = (to + 4 · tm + tp) / 6"},
                {"label": "PERT Standard Deviation:", "value": "sigma = (tp - to) / 6"},
                {"label": "PERT Variance:", "value": "sigma² = ((tp - to) / 6)²"},
                {"label": "Cost Slope Formula:", "value": "Cost Slope = (Cc - Cn) / (Tn - Tc)"}
            ],
            "numericalShortcut": {
                "formula": "Standard Normal Deviate Z = (Ts - Te) / sigma_critical_path",
                "note": "Look up Z in standard normal table: Z = 0 -> 50% probability; Z = +1 -> 84.1% probability; Z = +2 -> 97.7% probability."
            }
        },
        "aiTutorPrompts": [
            {"question": "How do you decide which activity to crash first in project compression?", "answerPreview": "Always crash critical activities only (non-critical crashing wastes money without reducing project duration), starting with the critical activity that has the MINIMUM cost slope."},
            {"question": "What are the rules for dummy activities in network diagrams?", "answerPreview": "Dummies have zero duration and consume zero resources. They are used exclusively to maintain grammatical network logic and prevent multiple activities from sharing identical start and finish nodes."}
        ]
    },
    "civil-estimating-costing": {
        "unitName": "Construction Management & Building Materials",
        "codeClause": "IS 1200 (Part 1-28), CPWD Valuation Manual",
        "confidencePercent": 65,
        "masteredStatus": "In Progress",
        "diagramType": "rcc",
        "subtopicList": ["Centerline vs Longwall-Shortwall Estimating", "IS 1200 Rules for Deductions in Plastering & Masonry", "Detailed Rate Analysis & Labor Constants", "Tenders, Contracts & Earnest Money Deposit (EMD)", "Valuation: Sinking Fund, Scrap Value & Capitalized Value"],
        "comparisonGrid": {
            "titleLeft": "Centerline Method",
            "tagLeft": "Rapid Calculation",
            "valueLeft": "L_net = L_total - n · (t / 2)",
            "descLeft": "Total centerline of all walls calculated; for each T-junction, subtract half wall thickness (t/2); no deduction for L-corners.",
            "titleRight": "Longwall-Shortwall Method",
            "tagRight": "CPWD Standard",
            "valueRight": "Out-to-Out & In-to-In",
            "descRight": "Longwall length increases by wall thickness at each footing step; shortwall length decreases by wall thickness; precise and step-wise."
        },
        "callouts": {
            "corePostulate": "Under IS 1200 (Part XII), for plastering openings up to 0.5 m², NO deduction is made and no addition is made for jambs/soffits. For openings between 0.5 m² and 3.0 m², deduction is made for one face only.",
            "corePostulateRef": "IS 1200:1992 Method of Measurement",
            "examTrap": "Scrap value represents dismantled structural material value at the end of life (conventionally taken as 10% of total construction cost). Salvage value is the asset value without dismantling!",
            "examTrapRef": "CPWD Valuation & State PSC",
            "testedRatios": [
                {"label": "Earnest Money Deposit (EMD):", "value": "1% to 2% of estimate"},
                {"label": "Security Deposit (SD):", "value": "10% of tender amount"},
                {"label": "Contingencies Allowance:", "value": "3% to 5% of cost"},
                {"label": "Work-Charged Establishment:", "value": "1.5% to 2%"}
            ],
            "numericalShortcut": {
                "formula": "Annual Sinking Fund Installment I = (S · i) / ((1 + i)^n - 1)",
                "note": "Where S is the net replacement amount needed (Total cost - Scrap value), i is the rate of interest, and n is utility life in years."
            }
        },
        "aiTutorPrompts": [
            {"question": "How do deductions work for masonry openings as per IS 1200?", "answerPreview": "No deduction is made for openings up to 0.1 m2, ends of beams/lintels up to 500 cm2 cross-section, or bed plates/wall plates up to 10 cm depth."},
            {"question": "What is the difference between item rate contracts and percentage rate contracts?", "answerPreview": "In item rate contracts, contractors quote specific unit rates for individual schedule items. In percentage rate contracts, contractors quote a single uniform percentage above or below the official schedule of rates (CPWD SOR)."}
        ]
    },
    "gs-polity": {
        "unitName": "Indian Polity & Governance",
        "codeClause": "Constitution of India Art. 1 - 395",
        "confidencePercent": 72,
        "masteredStatus": "Mastered",
        "diagramType": "polity",
        "subtopicList": ["Preamble & Basic Structure Doctrine", "Fundamental Rights (Articles 12-35) & Writs (Art. 32 & 226)", "Directive Principles of State Policy & Fundamental Duties", "Union & State Executive (President, PM, Governor, CM)", "Supreme Court & High Courts Jurisdiction", "73rd/74th Constitutional Amendments & Sixth Schedule ADCs in Assam"],
        "comparisonGrid": {
            "titleLeft": "Supreme Court Writs (Art. 32)",
            "tagLeft": "Fundamental Right Itself",
            "valueLeft": "Enforcement of FRs Only",
            "descLeft": "Article 32 is called the 'Heart and Soul' of the Constitution by Dr. B.R. Ambedkar; Supreme Court cannot refuse to grant relief for FR violations.",
            "titleRight": "High Court Writs (Art. 226)",
            "tagRight": "Discretionary Jurisdiction",
            "valueRight": "FRs + Any Other Purpose",
            "descRight": "Article 226 gives wider jurisdiction than Art. 32, allowing High Courts to issue writs for both Fundamental Rights and common legal rights."
        },
        "callouts": {
            "corePostulate": "The 42nd Amendment Act 1976 amended the Preamble by adding three words: 'Socialist', 'Secular', and 'Integrity'. The Preamble has been amended only once in Indian constitutional history.",
            "corePostulateRef": "42nd Constitutional Amendment Act, 1976",
            "examTrap": "Sixth Schedule applies ONLY to tribal areas in four Northeastern states: Assam, Meghalaya, Tripura, and Mizoram (AMTM). It does NOT apply to Manipur, Nagaland, or Arunachal Pradesh!",
            "examTrapRef": "APSC CCE & AE 2020",
            "testedRatios": [
                {"label": "Assam 6th Schedule Councils:", "value": "BTC, KAAC, and DHAC"},
                {"label": "ADC Council Members:", "value": "30 members (26 elected, 4 nominated)"},
                {"label": "Anti-Defection Law:", "value": "10th Schedule (52nd Amendment 1985)"},
                {"label": "Right to Education:", "value": "Article 21A (86th Amendment 2002)"}
            ],
            "numericalShortcut": {
                "formula": "Emergency Articles: 352 (National) -> 356 (State) -> 360 (Financial)",
                "note": "Grounds for National Emergency: War, External Aggression, Armed Rebellion. The 44th Amendment 1978 substituted 'Armed Rebellion' for 'Internal Disturbance'."
            }
        },
        "aiTutorPrompts": [
            {"question": "What is the Kesavananda Bharati basic structure doctrine?", "answerPreview": "In 1973, a 13-judge bench ruled that while Parliament can amend any part of the Constitution under Article 368, it cannot destroy or alter the 'basic structure' (e.g. supremacy of constitution, secularism, separation of powers, judicial review)."},
            {"question": "What are the 5 types of constitutional writs?", "answerPreview": "1. Habeas Corpus (release illegal detainee), 2. Mandamus (command official to perform duty), 3. Prohibition (halt lower court proceedings), 4. Certiorari (quash lower court order), 5. Quo-Warranto (prevent usurping public office)."}
        ]
    },
    "gs-assam-history": {
        "unitName": "Assam History, Art & Culture",
        "codeClause": "Assam Buranjis & DHAS Archives",
        "confidencePercent": 65,
        "masteredStatus": "In Progress",
        "diagramType": "assam",
        "subtopicList": ["Ancient Kamarupa: Varman Dynasty & Bhaskaravarman", "Establishment of Ahom Rule by Chaolung Sukaphaa (1228 AD)", "Ahom Administration: Paik System & Khel Organization", "Battle of Saraighat (1671 AD) & Lachit Borphukan", "Srimanta Sankardeva, Neo-Vaishnavite Movement & Sattriya Culture", "Treaty of Yandabo (1826 AD) & British Annexation", "Peasant Uprisings: Phulaguri Dhawa (1861) & Patharughat (1894)"],
        "comparisonGrid": {
            "titleLeft": "Battle of Saraighat (1671 AD)",
            "tagLeft": "Naval Warfare",
            "valueLeft": "Lachit Borphukan vs Ram Singh",
            "descLeft": "Decisive naval encounter on the Brahmaputra; Lachit Borphukan used combined earthen ramparts and guerilla river flotillas to rout the Mughal forces.",
            "titleRight": "Battle of Itakhuli (1682 AD)",
            "tagRight": "Final Expulsion",
            "valueRight": "Dihingia Alun Barbarua",
            "descRight": "Ended Mughal ambitions in Assam permanently; pushed Mughal boundary westward to the Manas river, where it remained until British annexation."
        },
        "callouts": {
            "corePostulate": "Chaolung Sukaphaa crossed the Patkai range and entered Assam in 1228 AD, establishing the first Ahom capital at Charaideo in 1253 AD and commencing six centuries of unbroken dynasty rule.",
            "corePostulateRef": "Ahom Buranjis",
            "examTrap": "Phulaguri Dhawa (October 1861) in Nagaon district was the FIRST peasant uprising against British rule in Assam, triggered by bans on betel-nut cultivation and proposed opium taxation. Patharughat was in 1894!",
            "examTrapRef": "APSC CCE & State Exams",
            "testedRatios": [
                {"label": "Ahom Paik Unit (Got):", "value": "4 paiks (reduced to 3 by Momai Tamuli)"},
                {"label": "Treaty of Yandabo Signed:", "value": "24 February 1826"},
                {"label": "Neo-Vaishnavism Founder:", "value": "Srimanta Sankardeva (1449 - 1568)"},
                {"label": "First Ahom Ruler to Accept Hinduism:", "value": "Jayadhwaj Singha"}
            ],
            "numericalShortcut": {
                "formula": "Assam Peasant Revolts Chronology: Phulaguri (1861) -> Patharughat (1894)",
                "note": "Patharughat in Darrang is remembered as the 'Jallianwala Bagh of Assam' where over 140 peasants protesting British land taxes were killed in police firing."
            }
        },
        "aiTutorPrompts": [
            {"question": "How was the Ahom Paik system structured?", "answerPreview": "Every male subject between 15 and 50 was a Paik. Initially, 4 paiks formed a 'Got' (later 3). One paik from each Got rendered mandatory state service (army, dyke building, irrigation) in rotation while the remaining members tended his agricultural land."},
            {"question": "What is the significance of Srimanta Sankardeva's Sattra institution?", "answerPreview": "Sattras are democratic socio-religious and cultural monasteries propagating Ekasarana Dharma. They house the Namghar (prayer hall) and serve as preservation centers for Sattriya dance, Borgeet, Ankiya Naat, and mask making."}
        ]
    },
    "gs-india-history": {
        "unitName": "Indian & World History",
        "codeClause": "National Archives & NCERT History",
        "confidencePercent": 58,
        "masteredStatus": "In Progress",
        "diagramType": "polity",
        "subtopicList": ["Indus Valley Civilization & Town Planning", "Mauryan Empire & Ashoka's Edicts", "Gupta Golden Age & Classical Literature", "Mughal Administration & Mansabdari System", "1857 Revolt: Key Leaders & Suppression", "INC Formation & Moderates vs Extremists", "Gandhian Movements (NCM, CDM, Quit India)"],
        "comparisonGrid": {
            "titleLeft": "Non-Cooperation Movement",
            "tagLeft": "1920 - 1922",
            "valueLeft": "Boycott of Titles & Courts",
            "descLeft": "Launched following Rowlatt Act & Jallianwala Bagh massacre; called off by Mahatma Gandhi after violent Chauri Chaura incident in February 1922.",
            "titleRight": "Civil Disobedience Movement",
            "tagRight": "1930 - 1934",
            "valueRight": "Defiance of Salt Law",
            "descRight": "Initiated with historic Dandi March from Sabarmati to Dandi (March 12 - April 6, 1930); direct defiance of colonial laws and refusal to pay land revenue."
        },
        "callouts": {
            "corePostulate": "Government of India Act 1935 established Provincial Autonomy, abolished Dyarchy in the provinces, and provided the primary structural framework for the 1950 Indian Constitution.",
            "corePostulateRef": "GoI Act 1935",
            "examTrap": "The Indian National Congress was founded in December 1885 at Bombay by retired civil servant A.O. Hume. W.C. Bonnerjee presided over the first session, NOT A.O. Hume!",
            "examTrapRef": "Modern Indian History Standards",
            "testedRatios": [
                {"label": "Jallianwala Bagh Massacre:", "value": "13 April 1919 (General Dyer)"},
                {"label": "Poona Pact Signed:", "value": "24 September 1932 (Gandhi & Ambedkar)"},
                {"label": "Quit India Resolution Passed:", "value": "8 August 1942 (Gowalia Tank, Bombay)"},
                {"label": "Cabinet Mission Arrived:", "value": "March 1946 (Pethick-Lawrence, Cripps, Alexander)"}
            ],
            "numericalShortcut": {
                "formula": "Key Gandhian Satyagrahas: Champaran (1917) -> Ahmedabad (1918) -> Kheda (1918)",
                "note": "Champaran was India's first civil disobedience against tinkathia indigo system; Ahmedabad mill strike was first hunger strike; Kheda was first non-cooperation."
            }
        },
        "aiTutorPrompts": [
            {"question": "What was the Cabinet Mission Grouping Scheme and why did Assam oppose it?", "answerPreview": "The 1946 Cabinet Mission proposed grouping provinces: Group C comprised Bengal and Assam. Gopinath Bordoloi vehemently opposed this because it would force Assam into a Muslim-majority grouping, stripping its indigenous cultural identity. He persuaded Gandhi and the Congress Working Committee to reject it."},
            {"question": "What were the main causes of the Revolt of 1857?", "answerPreview": "Military discontent (greased cartridges with cow and pig fat), political annexation policies (Lord Dalhousie's Doctrine of Lapse), economic exploitation of traditional artisans and peasants, and socio-religious interference by colonial authorities."}
        ]
    },
    "gs-assam-geography": {
        "unitName": "Geography of India & Assam",
        "codeClause": "Survey of India & Assam Forest Dept",
        "confidencePercent": 75,
        "masteredStatus": "Mastered",
        "diagramType": "assam",
        "subtopicList": ["Physiographic Divisions: Karbi Hills, Barail & Brahmaputra Valley", "Brahmaputra River Basin & North/South Bank Tributaries", "Monsoons of India & Flood Hydrology of Assam", "7 National Parks of Assam & UNESCO Sites", "Deepor Beel Ramsar Wetland & Biodiversity", "Forest Cover, Soils & Mineral Resources"],
        "comparisonGrid": {
            "titleLeft": "North-Bank Tributaries",
            "tagLeft": "Himalayan Glacier Origin",
            "valueLeft": "Subansiri, Jia Bharali, Manas",
            "descLeft": "Torrential mountain courses; carry massive boulder and silt loads; steep gradient; cause extensive seasonal flooding and braiding.",
            "titleRight": "South-Bank Tributaries",
            "tagRight": "Meghalaya & Naga Hills",
            "valueRight": "Dhansiri, Kopili, Kulsi",
            "descRight": "Rain-fed streams; gentler gradients; deep meandering channels; carry less coarse sediment compared to north-bank tributaries."
        },
        "callouts": {
            "corePostulate": "Assam has 7 National Parks: Kaziranga (UNESCO World Heritage), Manas (UNESCO World Heritage & Tiger Reserve), Nameri, Orang (Rajiv Gandhi), Dibru-Saikhowa, Raimona (declared 2021), and Dihing Patkai (Amazon of the East, declared 2021).",
            "corePostulateRef": "Assam Forest Department Records",
            "examTrap": "Deepor Beel is the ONLY Ramsar site (wetland of international importance) in Assam, located southwest of Guwahati in Kamrup Metropolitan district.",
            "examTrapRef": "APSC CCE 2022 & 2023",
            "testedRatios": [
                {"label": "Kaziranga Rhino Population:", "value": "Hosts > 70% of world's Great One-horned Rhinos"},
                {"label": "Largest Inhabited River Island:", "value": "Majuli (Guinness Record)"},
                {"label": "Smallest Inhabited River Island:", "value": "Umananda (Peacock Island, Guwahati)"},
                {"label": "Longest River Bridge in India:", "value": "Bhupen Hazarika Setu (Dhola-Sadiya, 9.15 km)"}
            ],
            "numericalShortcut": {
                "formula": "Brahmaputra Origin: Chemayungdung Glacier (Tibet) -> Yarlung Tsangpo -> Siang/Dihang -> Brahmaputra",
                "note": "At Kobo near Sadiya, the Siang joins the Dibang and Lohit to officially form the river Brahmaputra."
            }
        },
        "aiTutorPrompts": [
            {"question": "Why does the Brahmaputra river cause chronic recurrent floods in Assam?", "answerPreview": "High rainfall during South-West monsoons (> 250 cm), fragile seismically active young Himalayan catchment generating colossal sediment loads (over 400 million tonnes/year), shallow braided riverbed, narrow bottlenecks at Pandu, and inadequate drainage gradients."},
            {"question": "What are the key wildlife species protected in Raimona and Dihing Patkai National Parks?", "answerPreview": "Raimona National Park (Kokrajhar) is famous for the endemic Golden Langur. Dihing Patkai (Dibrugarh & Tinsukia) is India's largest lowland rainforest, harboring the Hoolock Gibbon, Slow Loris, White-winged Wood Duck, and wild elephants."}
        ]
    },
    "gs-economy": {
        "unitName": "Economy & Development",
        "codeClause": "Economic Survey & Assam Budget 2024-25",
        "confidencePercent": 48,
        "masteredStatus": "Needs Practice",
        "diagramType": "economy",
        "subtopicList": ["National Income Accounting: GDP, GVA, NNP & Real vs Nominal", "Inflation Indices: CPI vs WPI & Monetary Policy Committee", "Fiscal Policy: Revenue, Fiscal & Primary Deficit (FRBM Act)", "Five Year Plans & NITI Aayog Governance", "Assam Petroleum Industry (Digboi, Numaligarh)", "Assam Tea Industry & Coal Reserves", "Assam State Budget Initiatives (Orunodoi, Asom Mala)"],
        "comparisonGrid": {
            "titleLeft": "Consumer Price Index (CPI)",
            "tagLeft": "Retail Inflation",
            "valueLeft": "Target: 4% ± 2%",
            "descLeft": "Measures price changes of basket of goods and services purchased by households; base year 2012; official metric used by RBI MPC.",
            "titleRight": "Wholesale Price Index (WPI)",
            "tagRight": "Wholesale / Producer",
            "valueRight": "Goods Only (No Services)",
            "descRight": "Measures price changes at wholesale level; base year 2011-12; weighted towards manufactured products, primary articles, and fuel."
        },
        "callouts": {
            "corePostulate": "Digboi in Tinsukia district of Assam is Asia's oldest operating oil refinery and the birthplace of the Indian petroleum industry (first commercial oil drilled in 1889, commissioned in 1901).",
            "corePostulateRef": "Indian Petroleum History",
            "examTrap": "Primary Deficit = Fiscal Deficit - Interest Payments. A zero primary deficit means that government borrowing is used ENTIRELY to service interest payments on past debt!",
            "examTrapRef": "State PSC & UPSC Civil Services",
            "testedRatios": [
                {"label": "Assam Share in India's Tea:", "value": "> 50% of national production"},
                {"label": "Numaligarh Refinery Expansion:", "value": "From 3 MMTPA to 9 MMTPA"},
                {"label": "FRBM Act Fiscal Deficit Limit:", "value": "Target of 3% of GDP"},
                {"label": "First Five-Year Plan Model:", "value": "Harrod-Domar Growth Model"}
            ],
            "numericalShortcut": {
                "formula": "Monetary Policy Transmission: Repo Rate Up -> Bank Lending Rates Up -> Credit Growth Down -> Inflation Cools",
                "note": "Repo rate is the rate at which RBI lends short-term funds to commercial banks against government securities."
            }
        },
        "aiTutorPrompts": [
            {"question": "What is the difference between Gross Domestic Product (GDP) and Gross Value Added (GVA)?", "answerPreview": "GDP = GVA + Taxes on Products - Subsidies on Products. GVA measures output from the producer side across sectors (Agriculture, Industry, Services), whereas GDP measures total economic output from the expenditure side."},
            {"question": "What are the major socio-economic schemes in Assam's latest budget?", "answerPreview": "1. Orunodoi 2.0 (monthly direct benefit cash transfer to women heads of underprivileged families), 2. Asom Mala (comprehensive state highway upgradation), 3. Nijut Moina scheme (financial assistance to girls for pursuing higher education to eliminate child marriage), 4. Mukhya Mantri Lok Sevak Asoni."}
        ]
    },
    "gs-science": {
        "unitName": "Science & Technology",
        "codeClause": "NCERT Science & ISRO Mission Archives",
        "confidencePercent": 65,
        "masteredStatus": "In Progress",
        "diagramType": "env",
        "subtopicList": ["Optics: Reflection, Refraction & Total Internal Reflection", "Newton's Laws of Motion & Gravitation", "Chemistry: Acids, Bases, pH & Corrosion Prevention", "Cell Biology, Organ Systems & Communicable Diseases", "Ecology: Biomagnification & Ozone Layer Depletion", "ISRO Space Missions (Chandrayaan, Aditya-L1, Gaganyaan)"],
        "comparisonGrid": {
            "titleLeft": "Total Internal Reflection (TIR)",
            "tagLeft": "Optical Fibers & Mirages",
            "valueLeft": "θ_i > θ_critical",
            "descLeft": "Occurs when light travels from a denser to a rarer optical medium and angle of incidence exceeds critical angle; 100% of light energy is reflected.",
            "titleRight": "Refraction of Light",
            "tagRight": "Snell's Law",
            "valueRight": "n1 · sin θ1 = n2 · sin θ2",
            "descRight": "Bending of light wavefront caused by change in propagation velocity as light passes across an interface between differing optical media."
        },
        "callouts": {
            "corePostulate": "Biomagnification refers to the progressive increase in the concentration of toxic, non-biodegradable persistent chemicals (such as DDT and methylmercury) at each successive trophic level in an ecological food chain.",
            "corePostulateRef": "Ecological Principles",
            "examTrap": "Myopia (short-sightedness, image focused in front of retina) is corrected by a CONCAVE (diverging) lens. Hypermetropia (far-sightedness, image behind retina) is corrected by a CONVEX (converging) lens!",
            "examTrapRef": "General Science PSC Standards",
            "testedRatios": [
                {"label": "Power of Lens Formula:", "value": "P = 1 / f (in meters), unit: Diopter (D)"},
                {"label": "Ozone Layer Location:", "value": "Stratosphere (15 km - 35 km altitude)"},
                {"label": "Chandrayaan-3 Landing Site:", "value": "Shiv Shakti Point (Lunar South Pole)"},
                {"label": "Aditya-L1 Target Orbit:", "value": "Halo Orbit around Sun-Earth L1 Lagrangian Point"}
            ],
            "numericalShortcut": {
                "formula": "Snell's Law of Refraction: sin i / sin r = v1 / v2 = n2 / n1",
                "note": "Critical angle equation for total internal reflection: sin(theta_c) = 1 / n, where n is the refractive index of the denser medium."
            }
        },
        "aiTutorPrompts": [
            {"question": "How does an optical fiber transmit communication signals?", "answerPreview": "Optical fibers consist of a high refractive index glass core surrounded by a lower refractive index cladding. Light pulses introduced at an angle exceeding the critical angle undergo continuous Total Internal Reflection (TIR) with minimal attenuation over long distances."},
            {"question": "What is the Montreal Protocol and why was it enacted?", "answerPreview": "The Montreal Protocol (1987) is an international treaty designed to protect the stratospheric ozone layer by phasing out the production of Chlorofluorocarbons (CFCs) and Halons, which release catalytic chlorine radicals that destroy ozone molecules."}
        ]
    },
    "gs-aptitude": {
        "unitName": "Quantitative Aptitude & Reasoning",
        "codeClause": "Standard Mathematical Reasoning Framework",
        "confidencePercent": 82,
        "masteredStatus": "Mastered",
        "diagramType": "som",
        "subtopicList": ["Number Systems, Divisibility Rules & HCF/LCM", "Percentages, Successive Discounts & Profit-Loss", "Simple vs Compound Interest Formulas", "Time, Speed, Distance & Relative Velocity", "Time and Work, Unitary Method & Pipes-Cisterns", "Logical Syllogisms & Direction Sense"],
        "comparisonGrid": {
            "titleLeft": "Simple Interest (SI)",
            "tagLeft": "Linear Growth",
            "valueLeft": "SI = (P · R · T) / 100",
            "descLeft": "Interest is calculated solely on original principal each year; interest amount remains constant throughout the loan term.",
            "titleRight": "Compound Interest (CI)",
            "tagRight": "Exponential Growth",
            "valueRight": "A = P · (1 + R/100)^T",
            "descRight": "Interest is added back to principal at compounding intervals; interest earns interest; 2-year difference between CI and SI is P*(R/100)²."
        },
        "callouts": {
            "corePostulate": "For any two numbers A and B: Product of the two numbers is equal to the product of their HCF and LCM: A * B = HCF(A, B) * LCM(A, B).",
            "corePostulateRef": "Number Theory Fundamentals",
            "examTrap": "If speed increases by a fraction x/y, the time taken for the same travel distance decreases by x / (x + y), NOT by x/y!",
            "examTrapRef": "Speed-Time Aptitude Trap",
            "testedRatios": [
                {"label": "Difference CI - SI (2 Years):", "value": "D2 = P · (R / 100)²"},
                {"label": "Difference CI - SI (3 Years):", "value": "D3 = P · (R/100)² · (3 + R/100)"},
                {"label": "Price Increase R% -> Consumption Cut:", "value": "(R / (100 + R)) · 100%"},
                {"label": "Relative Speed (Opposite Direction):", "value": "S1 + S2"}
            ],
            "numericalShortcut": {
                "formula": "Time & Work: If A does work in 'a' days and B in 'b' days, together they take (a · b) / (a + b) days",
                "note": "For three workers A, B, C: Time together = (a · b · c) / (ab + bc + ca) days."
            }
        },
        "aiTutorPrompts": [
            {"question": "How do you quickly solve upstream and downstream boat speed problems?", "answerPreview": "Speed in still water = (Downstream speed + Upstream speed) / 2. Speed of stream current = (Downstream speed - Upstream speed) / 2."},
            {"question": "What is the shortcut for successive percentage changes of +a% and +b%?", "answerPreview": "Net percentage change = (a + b + (a * b) / 100)%. For a discount of d1% and d2%, effective discount is (d1 + d2 - (d1 * d2) / 100)%."}
        ]
    }
}

# Now enrich existing modules
enriched_modules = []
for m in modules:
    m_id = m["id"]
    # attach questions
    if m_id in q_mapping:
        if m_id == "civil-estimating-costing":
            pass # already has topicQuestions
        else:
            q_ids = q_mapping[m_id]
            if m["category"] == "civil":
                m["topicQuestions"] = [civil_by_id[qid] for qid in q_ids if qid in civil_by_id]
            else:
                m["topicQuestions"] = [gs_by_id[qid] for qid in q_ids if qid in gs_by_id]
    
    # attach metadata
    if m_id in metadata:
        for k, v in metadata[m_id].items():
            m[k] = v
            
    enriched_modules.append(m)

# Now add missing modules: civil-transport, gs-science, gs-aptitude
existing_ids = [m["id"] for m in enriched_modules]

if "civil-transport" not in existing_ids:
    trans_m = {
        "id": "civil-transport",
        "title": "Highway & Transportation Engineering: Geometric Design & Pavements",
        "subject": "Highway & Transportation Engineering",
        "category": "civil",
        "readTime": "16 min read",
        "weightage": "HIGH_YIELD",
        "icon": "Compass",
        "summary": "Geometric design per IRC 73 (camber, SSD, OSD, superelevation), flexible pavement design per IRC 37, rigid pavements per IRC 58, and Webster traffic signal timing.",
        "prerequisites": ["Surveying", "Geotechnical Engineering"],
        "standardReferences": ["IRC:73-1980", "IRC:37-2018", "IRC:58-2015"],
        "practiceQuestionIds": q_mapping["civil-transport"],
        "steps": [
            {
                "stepNumber": 1,
                "stepTitle": "Highway Geometric Design & Cross-Section",
                "subtitle": "Camber, lane widths, and sight distance criteria",
                "keyConcept": "Geometric design ensures safe and comfortable vehicular transit at design speed. Camber provides lateral drainage to prevent hydroplaning; Sight distance provides safe stopping and overtaking sight lines.",
                "formulaOrCode": "SSD = 0.278 V t + \\frac{V^2}{254(f \\pm 0.01n)} \\quad ; \\quad e + f = \\frac{V^2}{127 R}",
                "highYieldFacts": [
                    "Reaction time for stopping sight distance (SSD) per PIEV theory is 2.5 seconds.",
                    "Reaction time for overtaking sight distance (OSD) is 2.0 seconds.",
                    "Intermediate Sight Distance (ISD) is taken as twice the Stopping Sight Distance (2 * SSD).",
                    "Maximum superelevation: 7% for plain/rolling terrain, 10% for hilly terrain, 4% for urban roads."
                ],
                "examTrap": "For a two-way two-lane road, sight distance required is SSD. For a two-way single-lane road, minimum required sight distance is 2 * SSD!",
                "benchmarkExample": {
                    "question": "Calculate the stopping sight distance for a design speed of 80 km/h on a level road with coefficient of friction 0.35 and reaction time 2.5 s.",
                    "options": ["102.5 m", "127.6 m", "145.2 m", "168.0 m"],
                    "correctAnswer": "127.6 m",
                    "stepByStepSolution": [
                        "Step 1: Lag distance = 0.278 * V * t = 0.278 * 80 * 2.5 = 55.6 m.",
                        "Step 2: Braking distance = V² / (254 * f) = (80)² / (254 * 0.35) = 6400 / 88.9 = 72.0 m.",
                        "Step 3: Total SSD = 55.6 + 72.0 = 127.6 m."
                    ],
                    "takeaway": "SSD = Lag Distance + Braking Distance."
                },
                "pointers": [
                    "Reaction time for stopping sight distance (SSD) per PIEV theory is 2.5 seconds.",
                    "Reaction time for overtaking sight distance (OSD) is 2.0 seconds.",
                    "Intermediate Sight Distance (ISD) is taken as twice the Stopping Sight Distance (2 * SSD).",
                    "Maximum superelevation: 7% for plain/rolling terrain, 10% for hilly terrain, 4% for urban roads."
                ]
            },
            {
                "stepNumber": 2,
                "stepTitle": "Pavement Design: Flexible (IRC 37) vs Rigid (IRC 58)",
                "subtitle": "CBR method, cumulative standard axles, and Westergaard stresses",
                "keyConcept": "Flexible pavements distribute wheel loads by grain-to-grain contact across layers; thickness is designed using California Bearing Ratio (CBR) and cumulative standard axles (CSA). Rigid pavements distribute load through slab flexural action; thickness is determined by Westergaard wheel load and temperature warping stresses.",
                "formulaOrCode": "N = \\frac{365 \\cdot [(1+r)^n - 1] \\cdot A \\cdot D \\cdot F}{r} \\quad ; \\quad \\sigma_c = \\frac{3 P}{h^2} \\left[1 - \\left(\\frac{a\\sqrt{2}}{l}\\right)^{0.6}\\right]",
                "highYieldFacts": [
                    "IRC 37 designs flexible pavements based on horizontal tensile strain at bottom of bituminous layer and vertical compressive strain on subgrade.",
                    "Radius of relative stiffness in rigid pavements: l = [E h³ / (12 (1 - mu²) k)]^(1/4).",
                    "Critical stress combination in rigid pavement: Summer mid-day = Edge load stress + Warping stress.",
                    "Dowel bars transfer shear across transverse expansion joints; tie bars hold longitudinal joints together."
                ],
                "examTrap": "Dowel bars are designed for shear transfer and must be bonded on one half and debonded (greased) on the other half to allow expansion. Tie bars are fully bonded deformed bars!",
                "benchmarkExample": {
                    "question": "In a rigid pavement, what is the purpose of providing tie bars across longitudinal joints?",
                    "options": [
                        "To transfer wheel loads from one slab to another",
                        "To prevent two adjacent slabs from opening apart or separating laterally",
                        "To absorb temperature warping moments",
                        "To allow thermal expansion along the road length"
                    ],
                    "correctAnswer": "To prevent two adjacent slabs from opening apart or separating laterally",
                    "stepByStepSolution": [
                        "Step 1: Check IS & IRC guidelines for rigid pavement joints.",
                        "Step 2: Dowel bars transfer wheel loads across transverse joints.",
                        "Step 3: Tie bars are deformed steel bars designed purely in tension to tie two adjacent slabs together across longitudinal joints."
                    ],
                    "takeaway": "Dowel bars = Shear load transfer (transverse joints); Tie bars = Tension restraint (longitudinal joints)."
                },
                "pointers": [
                    "IRC 37 designs flexible pavements based on horizontal tensile strain at bottom of bituminous layer and vertical compressive strain on subgrade.",
                    "Radius of relative stiffness in rigid pavements: l = [E h³ / (12 (1 - mu²) k)]^(1/4).",
                    "Critical stress combination in rigid pavement: Summer mid-day = Edge load stress + Warping stress.",
                    "Dowel bars transfer shear across transverse expansion joints; tie bars hold longitudinal joints together."
                ]
            }
        ],
        "topicQuestions": [civil_by_id[qid] for qid in q_mapping["civil-transport"] if qid in civil_by_id]
    }
    for k, v in metadata["civil-transport"].items():
        trans_m[k] = v
    enriched_modules.append(trans_m)

if "gs-science" not in existing_ids:
    sci_m = {
        "id": "gs-science",
        "title": "General Science & Technology: Physics, Chemistry, Biology & Space Missions",
        "subject": "General Science & Technology",
        "category": "gs",
        "readTime": "14 min read",
        "weightage": "MEDIUM",
        "icon": "Activity",
        "summary": "Core concepts across Optics, Mechanics, Acids & Bases, Cell Biology, Environmental Ecology (biomagnification, ozone), and landmark ISRO space missions.",
        "prerequisites": ["Secondary School Science"],
        "standardReferences": ["NCERT Class 9-12 Science", "ISRO Mission Updates"],
        "practiceQuestionIds": q_mapping["gs-science"],
        "steps": [
            {
                "stepNumber": 1,
                "stepTitle": "Physics Fundamentals: Optics & Mechanics",
                "subtitle": "Light propagation, lenses, TIR, and Newton's laws",
                "keyConcept": "Optics principles govern optical fiber communications, eye corrections, and atmospheric phenomena like mirages. Total Internal Reflection occurs when light travels from denser to rarer medium at an incident angle greater than the critical angle.",
                "formulaOrCode": "n_1 \\sin \\theta_1 = n_2 \\sin \\theta_2 \\quad ; \\quad P = \\frac{1}{f} \\text{ (Diopters)}",
                "highYieldFacts": [
                    "Optical fibers transmit data by continuous Total Internal Reflection (TIR) through high refractive index silica core.",
                    "Myopia (nearsightedness) is corrected using a concave (diverging) lens.",
                    "Hypermetropia (farsightedness) is corrected using a convex (converging) lens.",
                    "Acceleration due to gravity g is maximum at the poles and minimum at the equator."
                ],
                "examTrap": "Do not confuse dispersion with total internal reflection. A rainbow is formed by a combination of refraction, dispersion, and internal reflection within raindrops.",
                "benchmarkExample": {
                    "question": "A person cannot clearly see objects situated closer than 50 cm. What lens power is required to enable reading at the normal near point of 25 cm?",
                    "options": ["+2.0 D", "+1.5 D", "-2.0 D", "+4.0 D"],
                    "correctAnswer": "+2.0 D",
                    "stepByStepSolution": [
                        "Step 1: Lens formula: 1/f = 1/v - 1/u.",
                        "Step 2: Object distance u = -25 cm = -0.25 m. Image distance v = -50 cm = -0.50 m.",
                        "Step 3: 1/f = -1/0.50 - (-1/0.25) = -2.0 + 4.0 = +2.0 D."
                    ],
                    "takeaway": "Presbyopia/Hypermetropia correction requires positive diopter (convex) lens."
                },
                "pointers": [
                    "Optical fibers transmit data by continuous Total Internal Reflection (TIR) through high refractive index silica core.",
                    "Myopia (nearsightedness) is corrected using a concave (diverging) lens.",
                    "Hypermetropia (farsightedness) is corrected using a convex (converging) lens.",
                    "Acceleration due to gravity g is maximum at the poles and minimum at the equator."
                ]
            }
        ],
        "topicQuestions": [gs_by_id[qid] for qid in q_mapping["gs-science"] if qid in gs_by_id]
    }
    for k, v in metadata["gs-science"].items():
        sci_m[k] = v
    enriched_modules.append(sci_m)

if "gs-aptitude" not in existing_ids:
    apt_m = {
        "id": "gs-aptitude",
        "title": "Quantitative Aptitude & Mental Ability: Percentages, Profit/Loss & Reasoning",
        "subject": "Quantitative Aptitude & Reasoning",
        "category": "gs",
        "readTime": "15 min read",
        "weightage": "MEDIUM",
        "icon": "Crosshair",
        "summary": "Arithmetic shortcuts for percentages, profit-loss, simple & compound interest, speed-time-distance, time-work, and logical deduction.",
        "prerequisites": ["Basic Arithmetic"],
        "standardReferences": ["Standard Quantitative Reasoning Handbook"],
        "practiceQuestionIds": q_mapping["gs-aptitude"],
        "steps": [
            {
                "stepNumber": 1,
                "stepTitle": "Arithmetic Shortcuts: Percentages & Interest",
                "subtitle": "Product constancy, compound interest difference, and successive discount",
                "keyConcept": "Percentages and fractions provide rapid computation tools for PSC prelims. The difference between Compound Interest and Simple Interest over 2 years simplifies to P * (R/100)².",
                "formulaOrCode": "D_2 = P \\cdot \\left(\\frac{R}{100}\\right)^2 \\quad ; \\quad \\text{Net} = a + b + \\frac{ab}{100}",
                "highYieldFacts": [
                    "If price of an article rises by R%, consumption reduction to keep expenditure constant is (R / (100 + R)) * 100%.",
                    "Difference between CI and SI for 2 years is P * (R/100)².",
                    "Difference between CI and SI for 3 years is P * (R/100)² * (3 + R/100).",
                    "Two successive discounts of d1% and d2% equal an effective discount of (d1 + d2 - d1*d2/100)%."
                ],
                "examTrap": "If speed increases by 25% (1/4), time taken decreases by 1/(4+1) = 1/5 = 20%, NOT by 25%!",
                "benchmarkExample": {
                    "question": "The difference between simple interest and compound interest compounded annually on a sum of money for 2 years at 10% per annum is Rs. 65. What is the principal sum?",
                    "options": ["Rs. 5,500", "Rs. 6,000", "Rs. 6,500", "Rs. 7,200"],
                    "correctAnswer": "Rs. 6,500",
                    "stepByStepSolution": [
                        "Step 1: Formula for 2-year CI - SI difference: D2 = P * (R/100)².",
                        "Step 2: 65 = P * (10/100)² = P * (1/100).",
                        "Step 3: P = 65 * 100 = Rs. 6,500."
                    ],
                    "takeaway": "Direct exam shortcut: P = D2 * (100 / R)²."
                },
                "pointers": [
                    "If price of an article rises by R%, consumption reduction to keep expenditure constant is (R / (100 + R)) * 100%.",
                    "Difference between CI and SI for 2 years is P * (R/100)².",
                    "Difference between CI and SI for 3 years is P * (R/100)² * (3 + R/100).",
                    "Two successive discounts of d1% and d2% equal an effective discount of (d1 + d2 - d1*d2/100)%."
                ]
            }
        ],
        "topicQuestions": [gs_by_id[qid] for qid in q_mapping["gs-aptitude"] if qid in gs_by_id]
    }
    for k, v in metadata["gs-aptitude"].items():
        apt_m[k] = v
    enriched_modules.append(apt_m)

print(f"Total modules to write: {len(enriched_modules)}")
for m in enriched_modules:
    tq_len = len(m.get("topicQuestions", []))
    print(f"  {m['id']} ({m['category']}): {tq_len} questions mapped. unit={m.get('unitName')}")

# Write to src/data/topicKnowledge.ts
ts_content = f"""import {{ KnowledgeModule }} from '../types';

export const TOPIC_KNOWLEDGE_MODULES: KnowledgeModule[] = {json.dumps(enriched_modules, indent=2)};

export const CIVIL_KNOWLEDGE_MODULES = TOPIC_KNOWLEDGE_MODULES.filter(m => m.category === 'civil');
export const GS_KNOWLEDGE_MODULES = TOPIC_KNOWLEDGE_MODULES.filter(m => m.category === 'gs');
"""

with open('src/data/topicKnowledge.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print("Successfully wrote updated src/data/topicKnowledge.ts!")
