# -*- coding: utf-8 -*-
"""
Build Complete Civil Engineering Suite with:
- Full descriptions
- Detailed pointers
- Syllabus coverage
- Governing formulas
- Exam traps
- Benchmark examples
- Interactive Topic Questions with step-by-step solutions
"""
import json
import importlib.util

# Load base modules
spec = importlib.util.spec_from_file_location("base", "d:/PROJECTS APP/EXAMPILOT/scripts/append_all_topics.py")
base = importlib.util.module_from_spec(spec)
spec.loader.exec_module(base)

# Load full curriculum modules
spec2 = importlib.util.spec_from_file_location("curriculum", "d:/PROJECTS APP/EXAMPILOT/scripts/generate_full_curriculum.py")
curr = importlib.util.module_from_spec(spec2)
spec2.loader.exec_module(curr)

all_modules = list(curr.full_list)

# Now define Estimating, Costing & Valuation
estimating_module = {
    "id": "civil-estimating-costing",
    "title": "Estimating, Costing & Valuation: Methods & Contracts",
    "subject": "Estimating & Costing",
    "category": "civil",
    "readTime": "18 min read",
    "weightage": "CORE",
    "icon": "Briefcase",
    "summary": "Building estimating methods (center line, long-short wall), rate analysis, standard specifications, valuation (sinking fund, depreciation, capitalized value), and contracts.",
    "fullDescription": "Estimating, Costing, and Valuation bridges structural engineering with financial execution. It deals with quantitative takeoff, rate analysis based on CPWD/State PWD schedules, depreciation valuation methods, and standard contract tendering procedures.",
    "syllabusCoverage": [
        "Methods of Building Estimation (Center Line Method, Long Wall-Short Wall Method)",
        "Units of Measurement per IS 1200 (Excavation, Concrete, Formwork, Brickwork, Plastering, Steel)",
        "Analysis of Rates (Labor Constants, Material Constants, Contractor Profit 10%, Water Charges 1.5%)",
        "Valuation Principles (Capitalized Value, Year's Purchase, Scrap Value, Salvage Value)",
        "Depreciation Methods (Straight Line Method, Constant Percentage Method, Sinking Fund Method)",
        "Contracts & Tendering (Lump Sum, Item Rate, Percentage Rate, Cost Plus, EMD 1-2%, Security Deposit 10%)"
    ],
    "prerequisites": ["Building Construction", "Basic Economics"],
    "standardReferences": ["IS 1200 Method of Measurement", "B.N. Dutta Estimating and Costing in Civil Engineering", "CPWD Works Manual"],
    "practiceQuestionIds": ["ce-ec-1", "ce-ec-2", "ce-ec-3", "ce-ec-4"],
    "steps": [
        {
            "stepNumber": 1,
            "stepTitle": "Methods of Building Measurement & IS 1200 Rules",
            "subtitle": "Center line method, Long wall-Short wall method, and deduction rules",
            "keyConcept": "In the Center Line Method, total center line length of walls is calculated and multiplied by width and height for quantity takeoff. When walls intersect (T-junctions), half the wall thickness (d/2) must be subtracted from the total center line length for EACH junction to avoid double-counting.",
            "pointers": [
                "Center line reduction for T-junction: Net length = Total centerline length - (N * d / 2), where N is number of T-junctions and d is wall thickness.",
                "For an L-junction (corner): NO reduction is made (corners fit exactly).",
                "For a cross junction (X-junction): Subtract 2 * (d / 2) = d.",
                "Long Wall-Short Wall Method: Long wall length out-to-out = Center line length + 2 * (d / 2) = C/L + d. Short wall in-to-in = C/L - d.",
                "IS 1200 Deductions for Masonry Openings: (1) No deduction for openings up to 0.1 m² (1000 cm²); (2) Deduction for openings 0.1 m² to 0.5 m² for masonry only (no deduction for lintel bearing); (3) For openings > 0.5 m², full deduction made for both face and lintel bearing."
            ],
            "formulaOrCode": "\\text{Net Length (C/L)} = L_{\\text{total}} - \\left(N_{\\text{T-junctions}} \\times \\frac{d}{2}\\right) \\quad ; \\quad L_{\\text{Long}} = L_{cl} + d \\quad ; \\quad L_{\\text{Short}} = L_{cl} - d",
            "highYieldFacts": [
                "Plastering deductions per IS 1200: No deduction for opening < 0.5 m²; 50% deduction for opening 0.5 m² to 3 m² (deducted from one face only); 100% deduction for opening > 3 m² (deducted from both faces, jambs added).",
                "Units of measurement: Earthwork in excavation = m³; Brickwork in superstructure = m³; Half-brick wall / partition wall = m²; Damp Proof Course (DPC) = m²; Steel reinforcement = quintals / tonnes.",
                "Standard dry mortar required for 1 m³ of brick masonry = 0.30 m³ (~30%)."
            ],
            "examTrap": "For L-corners, reduction is ZERO. Only T-junctions require (d/2) reduction. If there are 2 T-junctions, subtract 2 * (d/2) = d.",
            "benchmarkExample": {
                "question": "In a building plan, the total centerline length of 30 cm thick walls is 50 m. If the plan contains 4 T-junctions, what is the net length used for estimating masonry?",
                "options": ["48.8 m", "49.4 m", "50.0 m", "50.6 m"],
                "correctAnswer": "49.4 m",
                "stepByStepSolution": [
                    "Step 1: Formula: Net length = Total length - (N * d / 2).",
                    "Step 2: N = 4 T-junctions, wall thickness d = 30 cm = 0.30 m.",
                    "Step 3: Reduction = 4 * (0.30 / 2) = 4 * 0.15 = 0.60 m.",
                    "Step 4: Net length = 50.0 - 0.60 = 49.4 m."
                ],
                "takeaway": "Net C/L = Total C/L - N * (d/2) = 50 - 4*(0.15) = 49.4 m."
            }
        },
        {
            "stepNumber": 2,
            "stepTitle": "Valuation, Depreciation & Sinking Fund",
            "subtitle": "Capitalized value, year's purchase, straight line vs sinking fund depreciation",
            "keyConcept": "Valuation determines the present financial worth of an engineering asset. Capitalized value is the capital sum that would fetch the net annual income if invested at the prevailing rate of interest. Sinking fund is the periodic reserve deposited into an interest-bearing account to recover the replacement cost at the end of the structure's economic life.",
            "pointers": [
                "Year's Purchase (YP): The capital amount required to produce Re 1 as net annual income: YP = 100 / Rate of interest = 1 / i.",
                "Capitalized Value (CV): CV = Net Annual Income * Year's Purchase = Net Income / i.",
                "Net Annual Income = Gross Annual Income - Outgoings (Taxes, repairs 10-15%, management, sinking fund).",
                "Scrap Value: Value of dismantled material at the end of utility life (typically 10% of total cost).",
                "Salvage Value: Value of asset at end of life without being dismantled (can be positive or zero).",
                "Annual Sinking Fund Deposit: I_s = (S * i) / [ (1 + i)^n - 1 ], where S = Total replacement cost - Scrap value.",
                "Straight Line Depreciation: Annual depreciation D = (Original Cost C - Scrap Value S) / Useful Life n."
            ],
            "formulaOrCode": "CV = \\frac{\\text{Net Annual Income}}{i} \\quad ; \\quad YP = \\frac{1}{i} \\quad ; \\quad I_s = \\frac{S \\cdot i}{(1 + i)^n - 1}",
            "highYieldFacts": [
                "Scrap value is usually assumed to be 10% of the original construction cost.",
                "Constant Percentage Method (Declining Balance): Value decreases at a constant rate p = 1 - (S / C)^(1/n). It CANNOT be used when scrap value S = 0.",
                "Outgoings typically range between 20% and 30% of gross rent."
            ],
            "examTrap": "Constant percentage depreciation method FAILS if scrap value S is zero because (0 / C)^(1/n) equals zero and p becomes 100% in the first year!",
            "benchmarkExample": {
                "question": "A property produces a net annual income of Rs 60,000. If the prevailing market rate of interest is 6% per annum, calculate the capitalized value of the property.",
                "options": ["Rs 3,60,000", "Rs 6,00,000", "Rs 10,00,000", "Rs 12,00,000"],
                "correctAnswer": "Rs 10,00,000",
                "stepByStepSolution": [
                    "Step 1: Formula for Capitalized Value: CV = Net Income / Rate of interest (i).",
                    "Step 2: i = 6% = 0.06.",
                    "Step 3: CV = 60,000 / 0.06 = 1,000,000 = Rs 10,00,000."
                ],
                "takeaway": "Capitalized Value = Net Annual Income / interest rate = 60,000 / 0.06 = Rs 10 Lakhs."
            }
        }
    ],
    "topicQuestions": [
        {
            "id": "ce-ec-q1",
            "stem": "While calculating the centerline length of walls for an excavation estimate, what deduction is made for each T-junction of wall thickness 't'?",
            "options": [
                {"id": "A", "text": "No deduction is made"},
                {"id": "B", "text": "Deduction of half the wall thickness (t / 2)"},
                {"id": "C", "text": "Deduction of full wall thickness (t)"},
                {"id": "D", "text": "Deduction of twice the wall thickness (2t)"}
            ],
            "correctOption": "B",
            "formulaContext": "\\text{Reduction per T-junction} = \\frac{t}{2}",
            "explanation": "At a T-junction, the cross wall joins the main wall. Because the centerline of the main wall already accounts for its half-thickness, exactly half the thickness of the intersecting wall (t/2) is deducted for each T-junction to prevent duplicate measurement.",
            "difficulty": "EASY",
            "examSource": "SSC JE / CPWD Standards"
        },
        {
            "id": "ce-ec-q2",
            "stem": "As per IS 1200, no deduction is made for openings in plastering measurements when the opening area does not exceed:",
            "options": [
                {"id": "A", "text": "0.1 m²"},
                {"id": "B", "text": "0.5 m²"},
                {"id": "C", "text": "1.0 m²"},
                {"id": "D", "text": "3.0 m²"}
            ],
            "correctOption": "B",
            "formulaContext": "\\text{Opening } \\le 0.5 \\text{ m}^2 \\implies \\text{No deduction for plastering}",
            "explanation": "According to IS 1200 (Part XII), for openings up to 0.5 m², no deduction is made for plastering, and at the same time, no addition is made for jambs, sills, and soffits. For openings between 0.5 m² and 3.0 m², deduction is made for one face only.",
            "difficulty": "MEDIUM",
            "examSource": "State AE / GATE Testbook"
        },
        {
            "id": "ce-ec-q3",
            "stem": "The scrap value of a building is generally assumed to be what percentage of its original construction cost?",
            "options": [
                {"id": "A", "text": "2% to 3%"},
                {"id": "B", "text": "5%"},
                {"id": "C", "text": "10%"},
                {"id": "D", "text": "20%"}
            ],
            "correctOption": "C",
            "formulaContext": "\\text{Scrap Value } (S) = 10\\% \\text{ of Total Capital Cost}",
            "explanation": "Scrap value represents the salvage value of dismantled components (bricks, steel, timber) at the end of its functional life, net of dismantling costs. Standard valuation convention takes scrap value as 10% of the original construction cost.",
            "difficulty": "EASY",
            "examSource": "CPWD Valuation Manual / ESE"
        },
        {
            "id": "ce-ec-q4",
            "stem": "The Earnest Money Deposit (EMD) submitted by a contractor along with the tender document is typically what percentage of the estimated project cost?",
            "options": [
                {"id": "A", "text": "1% to 2%"},
                {"id": "B", "text": "5%"},
                {"id": "C", "text": "10%"},
                {"id": "D", "text": "15%"}
            ],
            "correctOption": "A",
            "formulaContext": "\\text{EMD} = 1\\% \\text{ to } 2\\% \\quad ; \\quad \\text{Security Deposit} = 10\\%",
            "explanation": "Earnest Money Deposit (EMD) is deposited as a guarantee that the bidder will not withdraw their offer before tender validity expires. Standard public works convention fixes EMD at 1% to 2% of the estimated cost. Security deposit (10%) is deducted after tender award.",
            "difficulty": "EASY",
            "examSource": "State PWD / Testbook"
        }
    ]
}

# Append estimating module if not already in all_modules
if not any(m['id'] == estimating_module['id'] for m in all_modules):
    all_modules.append(estimating_module)

# Now check all civil modules and make sure every civil module has fullDescription, syllabusCoverage, and pointers
for m in all_modules:
    if m['category'] == 'civil':
        if 'fullDescription' not in m or not m['fullDescription']:
            m['fullDescription'] = f"Comprehensive module covering fundamental and advanced concepts of {m['title']} tailored for competitive civil engineering examinations (GATE, ESE, SSC JE, State AE/JE). Includes key principles, governing IS/IRC code formulas, exam traps, and benchmark problems."
        if 'syllabusCoverage' not in m or not m['syllabusCoverage']:
            m['syllabusCoverage'] = [
                f"Core Principles of {m['subject']}",
                "Governing Specifications & Code Clauses",
                "High-Yield Problem Solving & Formula Derivations",
                "Previous Year Questions (PYQs) & Exam Pitfalls"
            ]
        # ensure every step has pointers
        for st in m['steps']:
            if 'pointers' not in st or not st['pointers']:
                st['pointers'] = st.get('highYieldFacts', [])

# Write back to topicKnowledge.ts
ts_code = '''import { KnowledgeModule } from '../types';

export const TOPIC_KNOWLEDGE_MODULES: KnowledgeModule[] = ''' + json.dumps(all_modules, indent=2) + ''';

export const CIVIL_KNOWLEDGE_MODULES = TOPIC_KNOWLEDGE_MODULES.filter(m => m.category === 'civil');
export const GS_KNOWLEDGE_MODULES = TOPIC_KNOWLEDGE_MODULES.filter(m => m.category === 'gs');
'''

with open('d:/PROJECTS APP/EXAMPILOT/src/data/topicKnowledge.ts', 'w', encoding='utf-8') as f:
    f.write(ts_code)

print("SUCCESS: Generated complete civil suite with", len(all_modules), "total modules!")
print("Civil modules count:", len([m for m in all_modules if m['category'] == 'civil']))
print("GS modules count:", len([m for m in all_modules if m['category'] == 'gs']))
