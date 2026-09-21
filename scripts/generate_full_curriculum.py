# -*- coding: utf-8 -*-
"""
Full Civil Engineering Curriculum & General Studies Knowledge Generator
Generates comprehensive descriptions, detailed pointers, governing formulas,
examination traps, and fully solved questions for all Civil Engineering topics.
"""
import json

modules = [
    # =========================================================================
    # 1. BUILDING MATERIALS & CONCRETE TECHNOLOGY
    # =========================================================================
    {
        "id": "civil-bldg-materials",
        "title": "Building Materials: Cement, Concrete & Masonry",
        "subject": "Building Materials & Construction",
        "category": "civil",
        "readTime": "22 min read",
        "weightage": "HIGH_YIELD",
        "icon": "Layers",
        "summary": "Chemical composition of cement, Bogue's compounds, Vicat and Le-Chatelier tests, concrete mix design, Abram's w/c law, workability, aggregates, bricks, and timber.",
        "fullDescription": "Building Materials and Concrete Technology forms the foundation of all civil engineering construction and represents 12-15% of questions in competitive exams (GATE, ESE, SSC JE, State PSCs). Understanding the chemical kinetics of Bogue compounds, hydration heat, workability measurement, aggregate gradation, and durability criteria is crucial for civil engineers.",
        "syllabusCoverage": [
            "Portland Cement Chemistry (C3S, C2S, C3A, C4AF, Bogue Compounds)",
            "Field & Laboratory Tests on Cement (Fineness, Consistency, Setting Time, Soundness, Compressive Strength)",
            "Types of Cement (OPC, Rapid Hardening, Low Heat, Blast Furnace Slag, PPC, Sulfate Resisting)",
            "Concrete Technology & Workability (Slump Test, Compaction Factor, Vee-Bee Consistometer, Flow Table)",
            "Water-Cement Ratio & Abram's Law, Compressive & Flexural Strength (f_cr = 0.7 sqrt(f_ck))",
            "Coarse & Fine Aggregates (Fineness Modulus, Flakiness & Elongation Indices, Abrasion, Bulking of Sand)",
            "Common Bricks & Clay Products (Class I, II, III, Water Absorption, Efflorescence, Compressive Strength)",
            "Timber & Wood Products (Structure, Defects, Seasoning, Preservation, Plywood, Veneers)"
        ],
        "prerequisites": ["Engineering Chemistry", "Basic Materials Science"],
        "standardReferences": ["IS 269:2015 OPC", "IS 456:2000 Concrete", "IS 383 Aggregates", "M.S. Shetty Concrete Technology"],
        "practiceQuestionIds": ["ce-bm-1", "ce-bm-2", "ce-bm-3", "ce-bm-4"],
        "steps": [
            {
                "stepNumber": 1,
                "stepTitle": "Portland Cement Chemistry & Bogue's Compounds",
                "subtitle": "Tricalcium silicate, Dicalcium silicate, Tricalcium aluminate, and Gypsum kinetics",
                "keyConcept": "When raw materials (calcareous and argillaceous) are fused at 1400-1500°C in a rotary kiln, four principal chemical compounds known as Bogue's Compounds are formed: C3S (Alite), C2S (Belite), C3A (Celite), and C4AF (Felite). Gypsum (CaSO4.2H2O) is interground at 2-3% during final clinker milling specifically to retard flash setting by reacting with C3A.",
                "pointers": [
                    "Decreasing order of compound percentage in OPC: C3S (45-55%) > C2S (20-30%) > C3A (8-12%) > C4AF (6-10%).",
                    "C3S (Alite) hydrates rapidly, responsible for early strength development (first 7 to 28 days) and has high heat of hydration (~500 J/g).",
                    "C2S (Belite) hydrates slowly, responsible for progressive ultimate long-term strength (after 28 days to years); produces lowest heat of hydration (~260 J/g).",
                    "C3A (Celite) reacts fastest with water within 24 hours, generates highest heat of hydration (~865 J/g); susceptible to sulfate attack.",
                    "C4AF (Felite) has poorest cementing value, responsible for dark grayish color of cement, lowest heat generation (~420 J/g).",
                    "Gypsum (2-3%) forms calcium sulfo-aluminate crystals on C3A particle surfaces, preventing instant flash setting."
                ],
                "formulaOrCode": "\\text{Bogue Formulae:}\\quad C_3S = 4.071(CaO) - 7.600(SiO_2) - 6.718(Al_2O_3) - 1.430(Fe_2O_3) - 2.852(SO_3)",
                "highYieldFacts": [
                    "Heat of hydration order: C3A (865 J/g) > C3S (500 J/g) > C4AF (420 J/g) > C2S (260 J/g).",
                    "Rate of hydration order: C4AF > C3A > C3S > C2S.",
                    "Rate of early strength development: C3A > C3S > C4AF > C2S.",
                    "Ultimate strength contribution: C2S = C3S (equal ultimate strength, but C2S takes 1 year to reach it)."
                ],
                "examTrap": "Do not confuse rate of hydration (C4AF fastest) with heat of hydration (C3A highest)! Also note that Rapid Hardening Cement is manufactured by increasing C3S content and grinding finer, NOT by adding CaCl2.",
                "benchmarkExample": {
                    "question": "Which Bogue compound is primarily responsible for the ultimate long-term strength of Portland cement after 28 days?",
                    "options": ["Tricalcium silicate (C3S)", "Dicalcium silicate (C2S)", "Tricalcium aluminate (C3A)", "Tetracalcium aluminoferrite (C4AF)"],
                    "correctAnswer": "Dicalcium silicate (C2S)",
                    "stepByStepSolution": [
                        "Step 1: Understand strength evolution across curing age.",
                        "Step 2: C3S hydrates rapidly and achieves maximum strength contribution in the first 7 to 28 days.",
                        "Step 3: C2S hydrates slowly and steadily, continuing strength gain from 28 days up to several years.",
                        "Step 4: Therefore, progressive ultimate long-term strength is attributed to C2S (Belite)."
                    ],
                    "takeaway": "Early strength = C3S; Long-term progressive strength = C2S; Flash set = C3A."
                }
            },
            {
                "stepNumber": 2,
                "stepTitle": "Standard Laboratory Tests on Cement",
                "subtitle": "Vicat apparatus, Le-Chatelier mold, Autoclave test, and fineness measurement",
                "keyConcept": "Standard testing of cement enforces rigorous consistency, setting time, and volumetric soundness controls prior to site utilization.",
                "pointers": [
                    "Standard Consistency (P): Tested using Vicat apparatus with a 10 mm diameter plunger. Defined as moisture percentage when plunger penetrates 33-35 mm from top (5-7 mm from bottom) of standard Vicat mold.",
                    "Initial Setting Time: Tested using Vicat needle (1 mm square). Water added = 0.85 P. Must not be less than 30 minutes for OPC.",
                    "Final Setting Time: Tested using Vicat needle with annular collar (5 mm diameter). Water added = 0.85 P. Must not exceed 600 minutes (10 hours) for OPC.",
                    "Soundness Test (Free Lime): Measured using Le-Chatelier split-cylinder mold. Expansion must not exceed 10 mm for OPC.",
                    "Soundness Test (Magnesia + Lime): Autoclave test is mandatory if Magnesia content exceeds 3%. Expansion must not exceed 0.8%.",
                    "Fineness Test: Sieve method (90 micron sieve, residue must not exceed 10% for OPC, 5% for RHC) or Blaine air-permeability apparatus (specific surface >= 225 m2/kg for OPC, >= 325 m2/kg for RHC)."
                ],
                "formulaOrCode": "\\text{Water for Setting Time} = 0.85 P \\quad ; \\quad \\text{Water for Soundness} = 0.78 P \\quad ; \\quad \\text{Water for Compressive Strength} = \\frac{P}{4} + 3.0 \\%",
                "highYieldFacts": [
                    "Le-Chatelier test measures uncombined free lime only; it CANNOT detect excess Magnesia soundness.",
                    "Autoclave test measures unsoundness due to both Magnesia and Lime.",
                    "Standard sand used for compressive strength testing in India is Ennore Sand (IS 650) in 1:3 ratio with cement.",
                    "Vicat plunger dimensions: 10 mm diameter, 50 mm length; needle: 1 mm square."
                ],
                "examTrap": "Water percentage for tests: Consistency = P; Setting Time = 0.85 P; Soundness = 0.78 P; Compressive strength of mortar cubes = (P/4 + 3.0)%. Candidates often confuse 0.85P and 0.78P!",
                "benchmarkExample": {
                    "question": "If standard consistency of a cement sample is P = 30%, calculate the quantity of water required for preparing the paste for the Le-Chatelier soundness test.",
                    "options": ["21.0%", "23.4%", "25.5%", "27.0%"],
                    "correctAnswer": "23.4%",
                    "stepByStepSolution": [
                        "Step 1: Identify standard water requirement formula for Le-Chatelier soundness test: Water = 0.78 P.",
                        "Step 2: Given P = 30%.",
                        "Step 3: Water = 0.78 * 30% = 23.4%."
                    ],
                    "takeaway": "Soundness water = 0.78 P; Setting time water = 0.85 P."
                }
            },
            {
                "stepNumber": 3,
                "stepTitle": "Concrete Properties, Workability & Abram's Law",
                "subtitle": "Slump test values, compaction factor, Vee-Bee time, and strength relationships",
                "keyConcept": "Concrete workability describes the ease with which fresh concrete can be mixed, placed, compacted, and finished without segregation or bleeding. Hardened concrete strength is governed by Abram's Law, which asserts strength depends inversely and strictly on water-cement ratio for fully compacted mixes.",
                "pointers": [
                    "Abram's Law: Compressive strength S = A / B^(w/c), where A and B are empirical constants.",
                    "Flexural Strength (Modulus of Rupture): f_cr = 0.7 * sqrt(f_ck) MPa per IS 456:2000 Cl. 6.2.2.",
                    "Short-term Modulus of Elasticity of Concrete: E_c = 5000 * sqrt(f_ck) MPa per IS 456:2000.",
                    "Long-term Modulus of Elasticity accounting for creep: E_ce = E_c / (1 + theta), where theta is creep coefficient (2.2 at 7 days, 1.6 at 28 days, 1.1 at 1 year).",
                    "Slump Test: Standard frustum cone (bottom dia 200 mm, top dia 100 mm, height 300 mm) compacted in 4 layers with 25 tamping strokes each. Types of slump: True slump, Shear slump (indicates lack of cohesion), Collapse slump.",
                    "Compaction Factor Test: Highly sensitive for low to very low workability mixes. Ratio of weight of partially compacted concrete to fully compacted concrete (ranges 0.75 to 0.95).",
                    "Vee-Bee Consistometer: Expressed in Vee-Bee seconds; ideal for dry, very low workability mixes (stiff concrete for pavement roller compaction)."
                ],
                "formulaOrCode": "f_{cr} = 0.7 \\sqrt{f_{ck}} \\quad ; \\quad E_c = 5000 \\sqrt{f_{ck}} \\quad ; \\quad \\text{Compaction Factor} = \\frac{W_{\\text{partial}}}{W_{\\text{fully}}}",
                "highYieldFacts": [
                    "1% air voids in compacted concrete reduces compressive strength by approximately 5% to 6%!",
                    "Creep coefficient theta: 7 days = 2.2; 28 days = 1.6; 1 year = 1.1.",
                    "Bulking of fine aggregate is maximum (up to 20-30% volume increase) at 4% to 5% moisture content due to surface tension menisci pushing particles apart. Completely submerged sand exhibits ZERO bulking.",
                    "Standard slump values: Mass concrete = 25-50 mm; Normal beams/slabs = 50-100 mm; Heavily reinforced sections/pumped concrete = 100-150 mm."
                ],
                "examTrap": "In IS 456:1978, E_c was 5700 sqrt(f_ck). In IS 456:2000, it was revised to 5000 sqrt(f_ck). Always use 5000 sqrt(f_ck) for current exams!",
                "benchmarkExample": {
                    "question": "What is the characteristic flexural tensile strength (modulus of rupture) of M25 grade concrete as per IS 456:2000?",
                    "options": ["2.5 N/mm²", "3.5 N/mm²", "4.2 N/mm²", "5.0 N/mm²"],
                    "correctAnswer": "3.5 N/mm²",
                    "stepByStepSolution": [
                        "Step 1: Formula for modulus of rupture: f_cr = 0.7 * sqrt(f_ck).",
                        "Step 2: For M25 concrete, f_ck = 25 N/mm².",
                        "Step 3: f_cr = 0.7 * sqrt(25) = 0.7 * 5 = 3.5 N/mm²."
                    ],
                    "takeaway": "f_cr = 0.7 * sqrt(f_ck); for M25 it is exactly 3.5 N/mm²."
                }
            }
        ],
        "topicQuestions": [
            {
                "id": "ce-bm-q1",
                "stem": "Gypsum is added to cement during the clinker grinding manufacturing process in order to:",
                "options": [
                    {"id": "A", "text": "Accelerate the early 3-day compressive strength"},
                    {"id": "B", "text": "Prevent flash setting by retarding initial hydration of C3A"},
                    {"id": "C", "text": "Impart distinct greenish gray color to the cement"},
                    {"id": "D", "text": "Increase the heat of hydration for cold weather concreting"}
                ],
                "correctOption": "B",
                "formulaContext": "C_3A + 3 CaSO_4 \\cdot 2H_2O + 26 H_2O \\to \\text{Ettringite}",
                "explanation": "Gypsum (CaSO4.2H2O) is added at 2% to 3% during clinker grinding. It reacts rapidly with tricalcium aluminate (C3A) to form insoluble ettringite crystals on grain surfaces, retarding hydration and preventing instantaneous flash setting.",
                "difficulty": "EASY",
                "examSource": "SSC JE & Testbook Civil Question Bank"
            },
            {
                "id": "ce-bm-q2",
                "stem": "The bulking of fine sand reaches its maximum volume increase when the moisture content is approximately:",
                "options": [
                    {"id": "A", "text": "1% to 2%"},
                    {"id": "B", "text": "4% to 5%"},
                    {"id": "C", "text": "8% to 10%"},
                    {"id": "D", "text": "14% to 16%"}
                ],
                "correctOption": "B",
                "formulaContext": "\\text{Bulking } \\% = \\frac{V_1 - V_2}{V_2} \\times 100",
                "explanation": "Bulking of sand is caused by moisture forming thin films around sand grains, where surface tension pushes grains apart. Maximum volume expansion (up to 20-30%) occurs at 4% to 5% moisture content. At higher moisture (>10%), films break down and bulking vanishes completely.",
                "difficulty": "MEDIUM",
                "examSource": "APSC AE Civil 2024 / ESE"
            },
            {
                "id": "ce-bm-q3",
                "stem": "For testing the compressive strength of cement in accordance with IS 4031, what is the specified size of the cement-sand mortar cube?",
                "options": [
                    {"id": "A", "text": "50.0 mm"},
                    {"id": "B", "text": "70.6 mm (Area = 50 cm²)"},
                    {"id": "C", "text": "100.0 mm"},
                    {"id": "D", "text": "150.0 mm"}
                ],
                "correctOption": "B",
                "formulaContext": "\\text{Face Area } = 7.06 \\text{ cm} \\times 7.06 \\text{ cm} \\approx 50 \\text{ cm}^2",
                "explanation": "Cement compressive strength is evaluated using 70.6 mm mortar cubes (1:3 cement to Ennore sand ratio). A 70.6 mm cube has a face area of exactly 50 cm² (5000 mm²). 150 mm cubes are used for concrete testing, NOT cement mortar testing.",
                "difficulty": "EASY",
                "examSource": "GATE / SSC JE Testbook"
            },
            {
                "id": "ce-bm-q4",
                "stem": "As per IS 456:2000, what is the short-term static modulus of elasticity of M36 grade concrete?",
                "options": [
                    {"id": "A", "text": "25,000 MPa"},
                    {"id": "B", "text": "28,500 MPa"},
                    {"id": "C", "text": "30,000 MPa"},
                    {"id": "D", "text": "36,000 MPa"}
                ],
                "correctOption": "C",
                "formulaContext": "E_c = 5000 \\sqrt{f_{ck}} = 5000 \\sqrt{36} = 30,000 \\text{ MPa}",
                "explanation": "Clause 6.2.3.1 of IS 456:2000 gives short term static modulus of elasticity Ec = 5000 * sqrt(fck). For M36 concrete: Ec = 5000 * sqrt(36) = 5000 * 6 = 30,000 N/mm² = 30,000 MPa.",
                "difficulty": "EASY",
                "examSource": "IS 456 Standard Benchmark"
            }
        ]
    },

    # =========================================================================
    # 2. HYDROLOGY & WATER RESOURCES ENGINEERING
    # =========================================================================
    {
        "id": "civil-hydrology-irrigation",
        "title": "Hydrology & Water Resources: Hydrographs & Canal Design",
        "subject": "Hydrology & Irrigation Engineering",
        "category": "civil",
        "readTime": "20 min read",
        "weightage": "HIGH_YIELD",
        "icon": "Droplets",
        "summary": "Hydrologic cycle, Unit Hydrographs, S-curves, Duty-Delta-Base period, canal design (Lacey's vs Kennedy's theories), and gravity dam stability.",
        "fullDescription": "Hydrology and Irrigation Engineering deals with rainfall-runoff estimation, flood routing, crop water requirements, design of stable unlined canals in alluvial soils, and stability analysis of hydraulic structures. It accounts for 10-12% of civil engineering competitive exams.",
        "syllabusCoverage": [
            "Hydrologic Cycle, Precipitation & Rain Gauge Networks (Arithmetic Mean, Thiessen Polygon, Isohyetal Method)",
            "Infiltration Indices (Phi-index, W-index, Horton Equation)",
            "Runoff & Hydrograph Analysis (Base Flow Separation, Unit Hydrograph Theory, S-Curve Method, Synthetic UH)",
            "Water Requirements of Crops (Duty, Delta, Base Period, Consumptive Use, Irrigation Efficiencies)",
            "Canal Design in Alluvial Soils (Kennedy's Silt Theory vs Lacey's Regime Theory)",
            "Gravity Dams (Forces, Elementary & Practical Profiles, Failure Modes, Factor of Safety)",
            "Seepage Below Hydraulic Structures (Bligh Creep Theory, Lane Weighted Creep, Khosla Theory of Independent Variables)"
        ],
        "prerequisites": ["Fluid Mechanics", "Open Channel Hydraulics"],
        "standardReferences": ["Subramanya Engineering Hydrology", "S.K. Garg Irrigation Engineering & Hydraulic Structures", "Lacey's Regime Papers"],
        "practiceQuestionIds": ["ce-hy-1", "ce-hy-2", "ce-hy-3", "ce-hy-4"],
        "steps": [
            {
                "stepNumber": 1,
                "stepTitle": "Crop Water Requirements: Duty, Delta & Base Period",
                "subtitle": "Fundamental relationships, Kor watering, Paleo irrigation, and water efficiencies",
                "keyConcept": "Duty (D) is the area of crop in hectares that can be irrigated by a continuous discharge of 1 cumec throughout the base period (B days). Delta (Delta) is total depth of water required by the crop over its base period. The core mathematical identity connects volume of water supplied to area irrigated.",
                "pointers": [
                    "Core Formula: Delta (meters) = (8.64 * B) / D, where B is in days and D is in hectares/cumec.",
                    "If Delta is expressed in centimeters: Delta (cm) = (864 * B) / D.",
                    "Duty increases downstream: Duty is lowest at canal head/divergence and highest at the farmer's field (outlet) because water conveyance losses decrease towards the tail end.",
                    "Paleo Irrigation: First watering applied to land before sowing crop seeds to prepare moist seedbeds.",
                    "Kor Watering: First watering given to a crop when plants are a few centimeters high; requires maximum depth in minimum time (Kor depth and Kor period determine design canal capacity!).",
                    "Consumptive Irrigation Requirement (CIR) = Consumptive use (Cu) - Effective rainfall (Re)."
                ],
                "formulaOrCode": "\\Delta (m) = \\frac{8.64 \\times B (\\text{days})}{D (\\text{ha/cumec})} \\quad ; \\quad \\Delta (cm) = \\frac{864 \\times B}{D} \\quad ; \\quad CIR = C_u - R_e",
                "highYieldFacts": [
                    "Rice has the highest Delta (~120 cm; base period ~120 days; duty ~860 ha/cumec).",
                    "Sugarcane has highest total water requirement (~180 cm; base period 360 days).",
                    "1 cumec-day of water = 1 m3/s * 86,400 s = 86,400 m3 = 8.64 hectare-meters.",
                    "Water conveyance efficiency eta_c = (Water delivered to field / Water diverted into canal) * 100."
                ],
                "examTrap": "Duty is inversely proportional to Delta. Where water losses are high (canal head), Duty is minimum. At the field outlet, Duty is maximum. Do not reverse this!",
                "benchmarkExample": {
                    "question": "A crop with a base period of 120 days requires a total depth of water (Delta) of 96 cm. Find the duty of canal water at the field outlet in hectares/cumec.",
                    "options": ["860 ha/cumec", "1080 ha/cumec", "1200 ha/cumec", "1440 ha/cumec"],
                    "correctAnswer": "1080 ha/cumec",
                    "stepByStepSolution": [
                        "Step 1: Formula for Delta in cm: Delta = (864 * B) / D.",
                        "Step 2: Rearrange for Duty D: D = (864 * B) / Delta.",
                        "Step 3: Substitute values: D = (864 * 120) / 96.",
                        "Step 4: D = 103,680 / 96 = 1080 ha/cumec."
                    ],
                    "takeaway": "Duty D = 864 * B / Delta(cm) = 864 * 120 / 96 = 1080 ha/cumec."
                }
            },
            {
                "stepNumber": 2,
                "stepTitle": "Lacey's Regime Theory vs Kennedy's Silt Theory",
                "subtitle": "Regime conditions, silt factor, wetted perimeter, and bed slope formulas",
                "keyConcept": "Kennedy assumed silt is held in suspension only by vertical eddies generated from the canal bed (neglecting side friction). Gerald Lacey established that silt is generated from the whole wetted perimeter (bed and sides), formulating empirical relationships for true regime channels where silt charge and silt grade are in equilibrium.",
                "pointers": [
                    "Lacey's Silt Factor: f = 1.76 * sqrt(d_mm), where d_mm is average particle diameter in mm.",
                    "Regime Velocity: V = [ (Q * f^2) / 140 ]^(1/6).",
                    "Hydraulic Radius: R = (5/2) * (V^2 / f).",
                    "Wetted Perimeter: P = 4.75 * sqrt(Q). Note: Lacey's wetted perimeter depends strictly on discharge Q and is completely independent of silt factor f!",
                    "Regime Bed Slope: S = [ f^(5/3) ] / [ 3340 * Q^(1/6) ].",
                    "Lacey's Regime states: Initial regime (only bed slope adjusts), True regime (slope, perimeter, and depth adjust freely), Final regime (channel reaches ultimate equilibrium)."
                ],
                "formulaOrCode": "f = 1.76 \\sqrt{d_{mm}} \\quad ; \\quad P = 4.75 \\sqrt{Q} \\quad ; \\quad V = \\left(\\frac{Q f^2}{140}\\right)^{1/6} \\quad ; \\quad S = \\frac{f^{5/3}}{3340 Q^{1/6}}",
                "highYieldFacts": [
                    "Lacey's wetted perimeter P = 4.75 * sqrt(Q) is independent of silt factor f.",
                    "Lacey's cross section in regime is semi-elliptical in shape (approaching parabolic).",
                    "Kennedy used Kutter's formula for velocity, whereas Lacey derived independent flow equations.",
                    "For standard medium silt (d = 0.32 mm), Lacey's silt factor f = 1.0."
                ],
                "examTrap": "Candidates frequently think wetted perimeter depends on silt factor. It does NOT! P = 4.75 sqrt(Q). Silt factor affects velocity, depth, and bed slope, but NOT perimeter.",
                "benchmarkExample": {
                    "question": "Calculate the wetted perimeter of a stable regime channel carrying a discharge of 64 cumecs as per Lacey's theory.",
                    "options": ["19.0 m", "28.5 m", "38.0 m", "47.5 m"],
                    "correctAnswer": "38.0 m",
                    "stepByStepSolution": [
                        "Step 1: Formula for wetted perimeter: P = 4.75 * sqrt(Q).",
                        "Step 2: Q = 64 cumecs => sqrt(64) = 8.",
                        "Step 3: P = 4.75 * 8 = 38.0 m."
                    ],
                    "takeaway": "P = 4.75 * sqrt(Q) = 4.75 * 8 = 38 m."
                }
            },
            {
                "stepNumber": 3,
                "stepTitle": "Unit Hydrograph Theory & S-Curve Synthesis",
                "subtitle": "Sherman's principles of linearity, time invariance, and derivation of longer/shorter durations",
                "keyConcept": "A Unit Hydrograph (UH) is the direct runoff hydrograph (DRH) resulting from 1 cm (or 1 mm) of excess rainfall occurring uniformly over the entire watershed at a constant rate for a specified unit duration D hours. It obeys two fundamental postulates: Linear Response (proportionality) and Time Invariance.",
                "pointers": [
                    "Linearity Postulate: If rainfall excess of depth R cm occurs in D hours, direct runoff ordinates equal R * (UH ordinates).",
                    "Time Invariance: Runoff response for a given rainfall pattern is identical whenever it occurs.",
                    "Area Under Unit Hydrograph: Volume under DRH = Area of catchment A * 1 cm rainfall excess = 10,000 * A m3.",
                    "S-Curve Hydrograph: Represents continuous cumulative direct runoff generated from a continuous rainfall excess of 1 cm every D hours. Equilibrium discharge S_e = 2.778 * A / D (cumecs, with A in km2, D in hours).",
                    "To convert a D-hour UH to a T-hour UH: Use S-curve method by lagging S-curve by T hours and multiplying ordinate differences by (D / T)."
                ],
                "formulaOrCode": "V = 0.01 \\times A \\text{ (m}^3\\text{)} \\quad ; \\quad S_e = \\frac{2.778 \\times A (\\text{km}^2)}{D (\\text{hr})} \\quad ; \\quad UH_{T} = \\frac{D}{T} (S_t - S_{t-T})",
                "highYieldFacts": [
                    "Unit Hydrograph is valid only for catchments between 50 km2 and 5000 km2. For smaller catchments (<50 km2), overland flow dominates. For larger (>5000 km2), spatial rainfall uniformity breaks down.",
                    "Base flow must always be deducted from flood hydrograph to obtain Direct Runoff Hydrograph (DRH).",
                    "Peak of UH is inversely related to unit duration D (shorter duration produces sharper, higher peak)."
                ],
                "examTrap": "The Unit Hydrograph accounts ONLY for Direct Runoff (surface runoff + interflow). Base flow is NOT part of the Unit Hydrograph and must be subtracted before analysis!",
                "benchmarkExample": {
                    "question": "A 4-hour unit hydrograph of a catchment of area 360 km² has a peak of 60 m³/s. What is the total volume of direct runoff represented by this unit hydrograph?",
                    "options": ["1.8 × 10^6 m³", "3.6 × 10^6 m³", "7.2 × 10^6 m³", "14.4 × 10^6 m³"],
                    "correctAnswer": "3.6 × 10^6 m³",
                    "stepByStepSolution": [
                        "Step 1: By definition, a unit hydrograph represents 1 cm (0.01 m) of rainfall excess over the entire catchment.",
                        "Step 2: Catchment Area A = 360 km² = 360 * 10^6 m².",
                        "Step 3: Volume V = Depth * Area = 0.01 m * (360 * 10^6 m²) = 3.60 * 10^6 m³."
                    ],
                    "takeaway": "Direct runoff volume for 1 cm UH is always Area(m²) * 0.01 m."
                }
            }
        ],
        "topicQuestions": [
            {
                "id": "ce-hy-q1",
                "stem": "In an irrigation canal, as water flows from the main canal headworks towards the field outlet, the Duty of water:",
                "options": [
                    {"id": "A", "text": "Decreases progressively due to seepage losses"},
                    {"id": "B", "text": "Increases progressively because transmission losses reduce downstream"},
                    {"id": "C", "text": "Remains constant throughout the canal network"},
                    {"id": "D", "text": "Depends only on the silt factor of the river bed"}
                ],
                "correctOption": "B",
                "formulaContext": "\\text{Duty } D = \\frac{\\text{Area Irrigated}}{\\text{Discharge Supplied}} \\quad (\\text{ha/cumec})",
                "explanation": "Duty is the area irrigated per unit discharge. At the canal head, discharge includes large losses (seepage, evaporation) incurred in transit; hence Duty is minimum. At the field outlet, less water is wasted in conveyance, so 1 cumec irrigates a larger area; hence Duty is maximum.",
                "difficulty": "MEDIUM",
                "examSource": "Testbook Model / SSC JE"
            },
            {
                "id": "ce-hy-q2",
                "stem": "According to Lacey's regime theory for alluvial channels, the wetted perimeter P of a channel carrying discharge Q is given by:",
                "options": [
                    {"id": "A", "text": "P = 2.50 sqrt(Q)"},
                    {"id": "B", "text": "P = 4.75 sqrt(Q)"},
                    {"id": "C", "text": "P = 3.34 Q^(1/6)"},
                    {"id": "D", "text": "P = 4.75 (Q / f)^(1/2)"}
                ],
                "correctOption": "B",
                "formulaContext": "P = 4.75 \\sqrt{Q}",
                "explanation": "Lacey's regime equation for wetted perimeter is P = 4.75 * sqrt(Q). Crucially, wetted perimeter depends only on discharge Q and is completely independent of the silt factor f.",
                "difficulty": "EASY",
                "examSource": "GATE / ESE Standard"
            },
            {
                "id": "ce-hy-q3",
                "stem": "The Unit Hydrograph theory developed by L.K. Sherman is based on the fundamental assumptions of:",
                "options": [
                    {"id": "A", "text": "Non-linear response and time variance"},
                    {"id": "B", "text": "Linear response and time invariance"},
                    {"id": "C", "text": "Constant base flow and parabolic infiltration"},
                    {"id": "D", "text": "Turbulent surface storage and spatial heterogeneity"}
                ],
                "correctOption": "B",
                "formulaContext": "Q(t) = \\int R(\\tau) h(t - \\tau) d\\tau \\quad (\\text{Linear Convolution})",
                "explanation": "Sherman's unit hydrograph theory relies on two core postulates: (1) Linear response (principle of proportionality and superposition) and (2) Time invariance (basin runoff characteristics do not change over time).",
                "difficulty": "EASY",
                "examSource": "APSC AE Civil / ESE"
            },
            {
                "id": "ce-hy-q4",
                "stem": "The elementary profile of a concrete gravity dam with zero uplift pressure subjected to water head H and specific gravity G is a right triangle of base width:",
                "options": [
                    {"id": "A", "text": "B = H / sqrt(G)"},
                    {"id": "B", "text": "B = H / G"},
                    {"id": "C", "text": "B = H * sqrt(G)"},
                    {"id": "D", "text": "B = 2H / sqrt(G)"}
                ],
                "correctOption": "A",
                "formulaContext": "B_{min} = \\frac{H}{\\sqrt{G}} \\quad (\\text{Without uplift}) \\quad ; \\quad B_{min} = \\frac{H}{\\sqrt{G - 1}} \\quad (\\text{With full uplift})",
                "explanation": "For zero tension at the heel under reservoir full condition without uplift, the resultant force passes through the downstream middle-third point: B = H / sqrt(G). When full uplift is considered, base width increases to B = H / sqrt(G - 1).",
                "difficulty": "MEDIUM",
                "examSource": "Testbook Civil / GATE"
            }
        ]
    },

    # =========================================================================
    # 3. PRESTRESSED CONCRETE (IS 1343:2012)
    # =========================================================================
    {
        "id": "civil-prestressed",
        "title": "Prestressed Concrete: Systems, Losses & Load Balancing",
        "subject": "Prestressed Concrete",
        "category": "civil",
        "readTime": "18 min read",
        "weightage": "MEDIUM",
        "icon": "Layers",
        "summary": "High-strength materials, pre-tensioning vs post-tensioning, Freyssinet and Magnel systems, 6 types of prestress loss, and Lin's load balancing concept.",
        "fullDescription": "Prestressed Concrete introduces engineered compressive stresses into concrete prior to service loads to neutralize tensile bending stresses. IS 1343:2012 governs prestressed structural members used in long-span bridges, flyovers, and industrial roof girders.",
        "syllabusCoverage": [
            "Principles & Philosophy of Prestressing (High strength concrete M30/M40+, High tensile steel 1500-1800 MPa)",
            "Pre-tensioning (Hoyer System) vs Post-tensioning (Freyssinet, Magnel-Blaton, Gifford-Udall, Lee-McCall)",
            "Losses of Prestress: Elastic Shortening, Friction & Wobble Effect, Anchorage Slip",
            "Time-Dependent Losses: Creep of Concrete, Shrinkage of Concrete, Relaxation of Steel",
            "Stress Calculations at Transfer and Service Loads (Kern points, P/A +/- Pe/Z +/- M/Z)",
            "Lin's Load Balancing Concept (Parabolic, Bent, and Straight Tendons)"
        ],
        "prerequisites": ["Mechanics of Materials", "RCC IS 456"],
        "standardReferences": ["IS 1343:2012 Prestressed Concrete", "N. Krishna Raju Prestressed Concrete", "T.Y. Lin Design of Prestressed Concrete"],
        "practiceQuestionIds": ["ce-psc-1", "ce-psc-2", "ce-psc-3"],
        "steps": [
            {
                "stepNumber": 1,
                "stepTitle": "Materials & Systems of Prestressing",
                "subtitle": "High-tensile wire strands, Hoyer system, and mechanical anchorages",
                "keyConcept": "Prestressing requires high-strength concrete (minimum M40 for pre-tensioning, M30 for post-tensioning per IS 1343) and high-tensile steel (f_u = 1500 to 1800 MPa). Mild steel cannot be used because prestress losses (~150 to 200 MPa) would completely wipe out any prestrain!",
                "pointers": [
                    "Pre-tensioning: Tendons tensioned against external abutments BEFORE concrete is poured. Prestress transferred entirely by BOND stress when concrete cures.",
                    "Post-tensioning: Tendons inserted in ducts and tensioned AFTER concrete achieves strength. Prestress transferred through end anchorages.",
                    "Freyssinet System: Uses conical central female cone and male grooved plug wedging 12 to 24 high-tensile wires simultaneously.",
                    "Magnel-Blaton System: Uses flat steel wedge plates holding pairs of wires in sandwich plates.",
                    "Lee-McCall System: Uses high-strength alloy steel bars with threaded nut anchorages (no friction loss in straight bar).",
                    "Gifford-Udall System: Single wire tensioning system using split conical wedges."
                ],
                "formulaOrCode": "\\text{Minimum Concrete Grade (IS 1343:2012):}\\quad \\text{Pre-tensioned} \\ge M40 \\quad ; \\quad \\text{Post-tensioned} \\ge M30",
                "highYieldFacts": [
                    "Mild steel CANNOT be used in prestressing because creep and shrinkage losses (~15-20%) exceed total elastic strain of mild steel!",
                    "Transmission length in pre-tensioned members is embedment length needed to develop full prestress by bond (typically 50 to 100 bar diameters).",
                    "Prestressing reduces diagonal tension shear cracks by creating horizontal compression that flattens principal stress trajectories."
                ],
                "examTrap": "Minimum concrete grade: Pre-tensioned = M40; Post-tensioned = M30. Candidates often reverse these two numbers!",
                "benchmarkExample": {
                    "question": "What is the minimum grade of concrete permitted by IS 1343:2012 for post-tensioned prestressed concrete members?",
                    "options": ["M20", "M25", "M30", "M40"],
                    "correctAnswer": "M30",
                    "stepByStepSolution": [
                        "Step 1: Check IS 1343:2012 requirements for concrete grades.",
                        "Step 2: For pre-tensioned concrete, minimum grade is M40.",
                        "Step 3: For post-tensioned concrete, minimum grade is M30."
                    ],
                    "takeaway": "Minimum grade: Pre-tensioned = M40; Post-tensioned = M30."
                }
            },
            {
                "stepNumber": 2,
                "stepTitle": "The 6 Losses of Prestress",
                "subtitle": "Immediate losses (elastic, friction, slip) and time-dependent losses (creep, shrinkage, relaxation)",
                "keyConcept": "Prestressing force decreases over time due to 6 distinct mechanisms. Total loss is typically 18-20% in pre-tensioned members and 15-18% in post-tensioned members.",
                "pointers": [
                    "Loss due to Elastic Shortening: Loss = m * f_c (where m = E_s / E_c is modular ratio, f_c is concrete stress at tendon level). For post-tensioned members tensioned simultaneously, elastic shortening loss is ZERO!",
                    "Loss due to Friction & Wobble: P_x = P_0 * (1 - mu * alpha - k * x), where mu is curvature friction coefficient, alpha is angular change, k is wobble coefficient.",
                    "Loss due to Anchorage Slip: Loss = (Delta_L / L) * E_s.",
                    "Loss due to Creep of Concrete: Loss = m * theta * f_c (where theta is creep coefficient).",
                    "Loss due to Shrinkage of Concrete: Loss = epsilon_cs * E_s. For pre-tensioned: epsilon_cs = 0.0003; for post-tensioned: epsilon_cs = 0.0002 / log10(t + 2).",
                    "Loss due to Relaxation of Steel: 2% to 5% of initial prestress depending on initial stress ratio."
                ],
                "formulaOrCode": "\\text{Elastic Loss} = m f_c \\quad ; \\quad \\text{Slip Loss} = \\frac{\\Delta L}{L} E_s \\quad ; \\quad \\text{Shrinkage Loss} = \\epsilon_{cs} E_s",
                "highYieldFacts": [
                    "Elastic shortening loss occurs in PRE-TENSIONED members, but is ZERO in post-tensioned members if all cables are tensioned simultaneously!",
                    "Friction loss occurs ONLY in post-tensioned members with curved ducts; ZERO in straight pre-tensioned wires.",
                    "Anchorage slip occurs ONLY in post-tensioned members; ZERO in pre-tensioned members."
                ],
                "examTrap": "Which losses occur ONLY in post-tensioned? Friction loss and Anchorage slip loss! Which occurs ONLY in pre-tensioning? Elastic shortening (when post-tensioned cables are tensioned all at once).",
                "benchmarkExample": {
                    "question": "A post-tensioned cable of length 30 m experiences an anchorage slip of 3 mm at the jacking end. If Es = 200 GPa, what is the loss of stress due to anchorage slip?",
                    "options": ["10 MPa", "20 MPa", "30 MPa", "40 MPa"],
                    "correctAnswer": "20 MPa",
                    "stepByStepSolution": [
                        "Step 1: Formula for loss of stress: Delta_sigma = (Delta_L / L) * E_s.",
                        "Step 2: Delta_L = 3 mm, L = 30 m = 30,000 mm.",
                        "Step 3: Strain loss = 3 / 30,000 = 1 / 10,000 = 0.0001.",
                        "Step 4: Stress loss = 0.0001 * (200,000 N/mm²) = 20 N/mm² = 20 MPa."
                    ],
                    "takeaway": "Slip loss = (Delta_L / L) * E_s = (3 / 30000) * 200,000 = 20 MPa."
                }
            },
            {
                "stepNumber": 3,
                "stepTitle": "Lin's Load Balancing Concept",
                "subtitle": "Equivalent upward transverse forces from curved and draped tendons",
                "keyConcept": "T.Y. Lin introduced the elegant concept that a draped or parabolic prestressing tendon exerts a continuous upward vertical force along its span that can directly counterbalance downward gravitational external loads, transforming the beam into an axial compression member under balanced load.",
                "pointers": [
                    "Parabolic Cable with sag 'e': Upward uniform load exerted by tendon is w_up = (8 * P * e) / L².",
                    "If external load w_ext exactly equals w_up, the section is subjected to pure axial compression with zero bending moment everywhere!",
                    "Bent Tendon with central eccentricity 'e': Exerts an upward concentrated load at the kink point: W_up = (4 * P * e) / L.",
                    "Under balanced load condition, net deflection at midspan is identically ZERO."
                ],
                "formulaOrCode": "w_{up} = \\frac{8 P e}{L^2} \\quad (\\text{Parabolic Cable}) \\quad ; \\quad W_{up} = \\frac{4 P e}{L} \\quad (\\text{Bent Cable at Midspan})",
                "highYieldFacts": [
                    "When w_ext = w_up, the beam behaves as an axially loaded column with uniform stress f = P / A.",
                    "Resultant concrete stress at any fiber: f = (P/A) +/- (P*e/Z) -/+ (M_dead/Z) -/+ (M_live/Z).",
                    "Kern distance for rectangular section (b x D): k_top = k_bottom = D / 6."
                ],
                "examTrap": "In w_up = 8Pe / L², 'e' is the central sag/eccentricity measured from the chord connecting the cable ends, NOT the total depth of the beam!",
                "benchmarkExample": {
                    "question": "A prestressed concrete beam of span 10 m carries a parabolic tendon with prestressing force P = 500 kN and central sag e = 100 mm (0.1 m). What is the upward balanced load w_up?",
                    "options": ["2 kN/m", "4 kN/m", "8 kN/m", "10 kN/m"],
                    "correctAnswer": "4 kN/m",
                    "stepByStepSolution": [
                        "Step 1: Formula for upward load: w_up = (8 * P * e) / L².",
                        "Step 2: P = 500 kN, e = 0.1 m, L = 10 m.",
                        "Step 3: w_up = (8 * 500 * 0.1) / (10)² = 400 / 100 = 4.0 kN/m."
                    ],
                    "takeaway": "w_up = 8 P e / L² = 8 * 500 * 0.1 / 100 = 4.0 kN/m."
                }
            }
        ],
        "topicQuestions": [
            {
                "id": "ce-psc-q1",
                "stem": "Which of the following prestress losses occurs strictly in post-tensioned concrete and NEVER in pre-tensioned concrete?",
                "options": [
                    {"id": "A", "text": "Loss due to shrinkage of concrete"},
                    {"id": "B", "text": "Loss due to creep of concrete"},
                    {"id": "C", "text": "Loss due to anchorage slip"},
                    {"id": "D", "text": "Loss due to relaxation of steel"}
                ],
                "correctOption": "C",
                "formulaContext": "\\text{Slip Loss } = \\frac{\\Delta L}{L} E_s",
                "explanation": "Anchorage slip occurs when the jacking device releases the tendon and mechanical wedges slide into the anchorage crosshead. Pre-tensioned members transfer force purely through bond adhesion without end mechanical anchorages; hence slip loss is non-existent.",
                "difficulty": "EASY",
                "examSource": "GATE / ESE / Testbook"
            },
            {
                "id": "ce-psc-q2",
                "stem": "In Lin's load balancing method, a parabolic cable with central sag 'e' and prestressing force 'P' over a span 'L' exerts an upward uniform load equal to:",
                "options": [
                    {"id": "A", "text": "w = 4 P e / L²"},
                    {"id": "B", "text": "w = 8 P e / L²"},
                    {"id": "C", "text": "w = 12 P e / L²"},
                    {"id": "D", "text": "w = 16 P e / L²"}
                ],
                "correctOption": "B",
                "formulaContext": "w_{up} = \\frac{8 P e}{L^2}",
                "explanation": "A parabolic cable profile follows y = 4e/L² * x(L - x). Second derivative gives curvature d²y/dx² = -8e/L². By cable statics, upward vertical force is w = P * d²y/dx² = 8Pe / L².",
                "difficulty": "EASY",
                "examSource": "IS 1343 / State PSC Model"
            },
            {
                "id": "ce-psc-q3",
                "stem": "High-strength steel is mandatory in prestressed concrete members primarily because:",
                "options": [
                    {"id": "A", "text": "It has a much higher modulus of elasticity than mild steel"},
                    {"id": "B", "text": "It provides chemical corrosion resistance against aggressive environments"},
                    {"id": "C", "text": "It can sustain high initial strain so that inevitable prestress losses do not eliminate prestressing"},
                    {"id": "D", "text": "It has lower thermal expansion than concrete"}
                ],
                "correctOption": "C",
                "formulaContext": "\\Delta \\epsilon_{loss} = \\epsilon_{creep} + \\epsilon_{shrinkage} \\approx 0.0008",
                "explanation": "Total strain loss due to creep, shrinkage, and relaxation is roughly 0.0008. If mild steel were used (yield strain ~0.0012), 70% to 100% of prestress would disappear. High-tensile steel (yield strain ~0.008) loses only 10-15% of its initial strain.",
                "difficulty": "MEDIUM",
                "examSource": "Testbook Civil Questions"
            }
        ]
    }
]

# Read existing modules
with open('d:/PROJECTS APP/EXAMPILOT/src/data/topicKnowledge.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Load existing
import importlib.util
spec = importlib.util.spec_from_file_location("base", "d:/PROJECTS APP/EXAMPILOT/scripts/append_all_topics.py")
base = importlib.util.module_from_spec(spec)
spec.loader.exec_module(base)

full_list = list(base.existing)

# Merge new modules
existing_ids = {m['id'] for m in full_list}
for m in modules:
    if m['id'] in existing_ids:
        # update existing with richer pointers & topic questions
        for idx, ex in enumerate(full_list):
            if ex['id'] == m['id']:
                full_list[idx] = m
    else:
        full_list.append(m)

ts_code = '''import { KnowledgeModule } from '../types';

export const TOPIC_KNOWLEDGE_MODULES: KnowledgeModule[] = ''' + json.dumps(full_list, indent=2) + ''';

export const CIVIL_KNOWLEDGE_MODULES = TOPIC_KNOWLEDGE_MODULES.filter(m => m.category === 'civil');
export const GS_KNOWLEDGE_MODULES = TOPIC_KNOWLEDGE_MODULES.filter(m => m.category === 'gs');
'''

with open('d:/PROJECTS APP/EXAMPILOT/src/data/topicKnowledge.ts', 'w', encoding='utf-8') as f:
    f.write(ts_code)

print("Generated full curriculum in src/data/topicKnowledge.ts with", len(full_list), "comprehensive modules!")
