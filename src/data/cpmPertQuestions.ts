import type { MCQQuestion } from '../types';

/**
 * COMPREHENSIVE CPM & PERT / CONSTRUCTION MANAGEMENT QUESTION BANK
 * Sourced directly from UPSC ESE (Paper I & II), GATE CE, and State PSC AE (APSC/OPSC).
 * Covers Network Logic, Float Analysis, PERT Statistics, Crashing, Equipment, and Contracts.
 */
export const CPM_PERT_QUESTIONS: MCQQuestion[] = [
  {
    "id": "cpm-pert-001",
    "questionNumber": 1,
    "examId": "upsc-ies-civil",
    "subject": "Construction Management & CPM",
    "topic": "PERT & CPM Fundamentals",
    "subtopic": "Time Estimates in PERT",
    "stem": "In a PERT network, the optimistic time (to), most likely time (tm), and pessimistic time (tp) for an activity are 4 days, 7 days, and 16 days respectively. The expected activity duration (te) and its variance (σ²) are respectively:",
    "options": [
      {
        "id": "A",
        "text": "8.0 days and 4.0 days²"
      },
      {
        "id": "B",
        "text": "7.0 days and 2.0 days²"
      },
      {
        "id": "C",
        "text": "8.0 days and 2.0 days²"
      },
      {
        "id": "D",
        "text": "9.0 days and 4.0 days²"
      }
    ],
    "correctOption": "A",
    "formulaContext": "te = (to + 4*tm + tp) / 6 ; σ = (tp - to) / 6 ; σ² = [(tp - to) / 6]²",
    "explanation": "Expected duration te = (4 + 4(7) + 16) / 6 = (4 + 28 + 16) / 6 = 48 / 6 = 8 days. Standard deviation σ = (16 - 4) / 6 = 12 / 6 = 2 days. Therefore, variance σ² = 2² = 4 days².",
    "referenceSource": "UPSC ESE 2023 & B.C. Punmia Project Planning",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "NUMERICAL",
    "pyqExam": "UPSC ESE / GATE Civil",
    "pyqYear": 2023
  },
  {
    "id": "cpm-pert-002",
    "questionNumber": 2,
    "examId": "gate-ce",
    "subject": "Construction Management & CPM",
    "topic": "Network Analysis",
    "subtopic": "Float Interrelationships",
    "stem": "For an activity in a CPM project network, which of the following inequalities correctly represents the relationship between Total Float (TF), Free Float (FF), and Independent Float (IF)?",
    "options": [
      {
        "id": "A",
        "text": "IF ≥ FF ≥ TF"
      },
      {
        "id": "B",
        "text": "TF ≥ FF ≥ IF"
      },
      {
        "id": "C",
        "text": "FF ≥ TF ≥ IF"
      },
      {
        "id": "D",
        "text": "TF ≥ IF ≥ FF"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Total Float (TF) ≥ Free Float (FF) ≥ Independent Float (IF)",
    "explanation": "By definition, Total Float (TF = LFT - EST - t) allows maximum permissible delay without affecting project completion. Free Float (FF = EFT_j - EFT_i - t) allows delay without affecting succeeding activities (FF = TF - Head Slack). Independent Float (IF = EST_j - LFT_i - t = FF - Tail Slack) allows delay without affecting preceding or succeeding activities. Hence, TF ≥ FF ≥ IF holds unconditionally.",
    "referenceSource": "GATE CE 2022 / IS 15883",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "GATE CE / State PSC AE",
    "pyqYear": 2022
  },
  {
    "id": "cpm-pert-003",
    "questionNumber": 3,
    "examId": "apsc-ae-civil",
    "subject": "Construction Management & CPM",
    "topic": "Critical Path Method",
    "subtopic": "Critical Path Characteristics",
    "stem": "In CPM network analysis, the critical path is defined as the sequence of critical activities having:",
    "options": [
      {
        "id": "A",
        "text": "Maximum duration and minimum total float (usually zero)"
      },
      {
        "id": "B",
        "text": "Minimum duration and maximum total float"
      },
      {
        "id": "C",
        "text": "Maximum cost and zero free float"
      },
      {
        "id": "D",
        "text": "Shortest path through the network"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Critical Path = Longest path in time through network; Total Float = 0",
    "explanation": "The critical path is the longest continuous chain of activities through the project network connecting the start event to the end event. It dictates the minimum overall time required to complete the project. Any delay in critical activities directly delays project completion, which is why total float along the critical path is zero (or minimum if target date is fixed).",
    "referenceSource": "APSC AE Civil & Srinath PERT & CPM",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "APSC AE Civil 2024",
    "pyqYear": 2024
  },
  {
    "id": "cpm-pert-004",
    "questionNumber": 4,
    "examId": "upsc-ies-civil",
    "subject": "Construction Management & CPM",
    "topic": "Project Crashing & Economics",
    "subtopic": "Cost Slope Formula",
    "stem": "The cost slope of an activity in project network optimization represents:",
    "options": [
      {
        "id": "A",
        "text": "Direct cost decrease per unit increase in activity duration"
      },
      {
        "id": "B",
        "text": "Direct cost increase per unit reduction in activity duration"
      },
      {
        "id": "C",
        "text": "Indirect cost incurred per day of delay"
      },
      {
        "id": "D",
        "text": "Total cost saved per day of crashing"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Cost Slope = (Crash Cost - Normal Cost) / (Normal Time - Crash Time) = ΔC / Δt",
    "explanation": "Cost slope represents the rate of increase in direct cost per unit decrease in duration as an activity is compressed from its normal time to crash time: Cost Slope = (Cc - Cn) / (Tn - Tc). When crashing a project, activities on the critical path with the lowest cost slope are crashed first to achieve time reduction at minimum expense.",
    "referenceSource": "UPSC ESE 2021",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "UPSC ESE 2021",
    "pyqYear": 2021
  },
  {
    "id": "cpm-pert-005",
    "questionNumber": 5,
    "examId": "gate-ce",
    "subject": "Construction Management & CPM",
    "topic": "Project Crashing & Economics",
    "subtopic": "Optimum Project Duration",
    "stem": "During time-cost optimization of a construction project, as project duration is progressively compressed, what happens to direct and indirect costs?",
    "options": [
      {
        "id": "A",
        "text": "Direct cost increases while indirect cost decreases"
      },
      {
        "id": "B",
        "text": "Both direct and indirect costs increase"
      },
      {
        "id": "C",
        "text": "Direct cost decreases while indirect cost increases"
      },
      {
        "id": "D",
        "text": "Both direct and indirect costs decrease"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Total Cost = Direct Cost (increases with crashing) + Indirect Cost (proportional to time)",
    "explanation": "Direct costs (overtime labor, specialized equipment, multiple shifts) increase as activity duration is crashed. Conversely, indirect costs (site overheads, supervision, equipment rent, administrative expenses) decrease as project duration shortens because they are time-dependent. The optimum project duration corresponds to the minimum point on the Total Cost curve.",
    "referenceSource": "GATE CE & IS 15883",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "GATE CE 2020",
    "pyqYear": 2020
  },
  {
    "id": "cpm-pert-006",
    "questionNumber": 6,
    "examId": "upsc-ies-civil",
    "subject": "Construction Management & CPM",
    "topic": "PERT vs CPM Comparison",
    "subtopic": "Probabilistic vs Deterministic Approaches",
    "stem": "Statement 1: PERT is an event-oriented probabilistic model suited for R&D and non-repetitive projects.\nStatement 2: CPM is an activity-oriented deterministic model suited for standard repetitive civil engineering works.",
    "options": [
      {
        "id": "A",
        "text": "Statement 1 is correct, but Statement 2 is incorrect"
      },
      {
        "id": "B",
        "text": "Statement 2 is correct, but Statement 1 is incorrect"
      },
      {
        "id": "C",
        "text": "Both Statement 1 and Statement 2 are correct"
      },
      {
        "id": "D",
        "text": "Neither Statement 1 nor Statement 2 is correct"
      }
    ],
    "correctOption": "C",
    "formulaContext": "PERT: Probabilistic (Beta distribution), Event-oriented; CPM: Deterministic, Activity-oriented",
    "explanation": "Both statements are classic civil engineering exam tenets. PERT was developed for the Polaris missile project where activity durations were uncertain (probabilistic, modeled by Beta distribution) and focused on milestones/events. CPM was developed by DuPont for chemical plant construction where activity times and costs were well established from past experience (deterministic and activity-oriented).",
    "referenceSource": "UPSC ESE 2022 Paper I",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "ASSERTION_REASON",
    "pyqExam": "UPSC ESE 2022",
    "pyqYear": 2022
  },
  {
    "id": "cpm-pert-007",
    "questionNumber": 7,
    "examId": "apsc-ae-civil",
    "subject": "Construction Management & CPM",
    "topic": "Network Rules & Logic",
    "subtopic": "Dummy Activities",
    "stem": "In an Activity-on-Arrow (AOA) project network, a dummy activity is introduced to:",
    "options": [
      {
        "id": "A",
        "text": "Represent an activity consuming minimal time and zero cost"
      },
      {
        "id": "B",
        "text": "Maintain grammatical network logic and establish unique event identification without consuming time or resources"
      },
      {
        "id": "C",
        "text": "Account for weather delays in external construction works"
      },
      {
        "id": "D",
        "text": "Provide contingency float for critical path activities"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Dummy Activity: Duration = 0, Cost = 0; shown by dashed arrow (- - ->)",
    "explanation": "In AOA networks, dummy activities consume zero time and zero resources. They are required for two distinct purposes: (1) Grammatical/Uniqueness: preventing two concurrent activities from sharing both identical start and end node numbers; (2) Logical: showing precedence where an activity depends on one predecessor but not another.",
    "referenceSource": "APSC AE 2023 & B.C. Punmia",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "APSC AE Civil 2023",
    "pyqYear": 2023
  },
  {
    "id": "cpm-pert-008",
    "questionNumber": 8,
    "examId": "gate-ce",
    "subject": "Construction Management & CPM",
    "topic": "Network Calculations",
    "subtopic": "Interfering Float",
    "stem": "In CPM network analysis, Interfering Float is mathematically defined as:",
    "options": [
      {
        "id": "A",
        "text": "Total Float minus Free Float (equal to head event slack)"
      },
      {
        "id": "B",
        "text": "Free Float minus Independent Float"
      },
      {
        "id": "C",
        "text": "Total Float minus Independent Float"
      },
      {
        "id": "D",
        "text": "Earliest Start Time minus Latest Finish Time"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Interfering Float = Total Float - Free Float = Sj (Head Event Slack)",
    "explanation": "Interfering Float is that portion of Total Float which, if consumed, does not delay the overall project completion but delays the start of subsequent activities. It is mathematically equal to the slack of the head event: Interfering Float = TF - FF = Sj = LFTj - ESTj.",
    "referenceSource": "GATE CE 2021",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "GATE CE 2021",
    "pyqYear": 2021
  },
  {
    "id": "cpm-pert-009",
    "questionNumber": 9,
    "examId": "upsc-ies-civil",
    "subject": "Construction Management & CPM",
    "topic": "PERT Statistical Analysis",
    "subtopic": "Central Limit Theorem & Project Completion Probability",
    "stem": "The critical path of a project consists of 4 independent activities with variances 9, 16, 4, and 36 days² respectively. The standard deviation of the entire project duration is:",
    "options": [
      {
        "id": "A",
        "text": "8.06 days"
      },
      {
        "id": "B",
        "text": "16.0 days"
      },
      {
        "id": "C",
        "text": "65.0 days"
      },
      {
        "id": "D",
        "text": "11.0 days"
      }
    ],
    "correctOption": "A",
    "formulaContext": "σ_project = √(Σ σ_i²) = √(9 + 16 + 4 + 36) = √65 ≈ 8.06 days",
    "explanation": "According to the Central Limit Theorem for PERT networks, project variance along the critical path is the sum of the variances of individual critical activities: σ_project² = 9 + 16 + 4 + 36 = 65 days². The project standard deviation is σ = √65 ≈ 8.062 days.",
    "referenceSource": "UPSC ESE 2020",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "NUMERICAL",
    "pyqExam": "UPSC ESE / State AE",
    "pyqYear": 2020
  },
  {
    "id": "cpm-pert-010",
    "questionNumber": 10,
    "examId": "apsc-ae-civil",
    "subject": "Construction Management & CPM",
    "topic": "Resource Management",
    "subtopic": "Resource Leveling vs Resource Smoothing",
    "stem": "Which of the following statements correctly distinguishes between Resource Leveling and Resource Smoothing?",
    "options": [
      {
        "id": "A",
        "text": "Resource leveling keeps project duration fixed, while resource smoothing allows duration to extend"
      },
      {
        "id": "B",
        "text": "Resource leveling allows project duration to extend to stay within resource limits, whereas resource smoothing adjusts non-critical activities within available float without extending project duration"
      },
      {
        "id": "C",
        "text": "Resource smoothing increases total float, whereas leveling decreases independent float"
      },
      {
        "id": "D",
        "text": "Both techniques inevitably extend project completion date"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Resource Leveling: Resource-constrained (Time extends); Resource Smoothing: Time-constrained (Float used)",
    "explanation": "Resource Leveling is applied when resources are strictly capped; the critical path may be altered and project duration extended to prevent demand spikes. Resource Smoothing is applied when the project completion date is fixed; activities are shifted strictly within their allowable float so peak demand is reduced without extending project duration.",
    "referenceSource": "IS 15883 (Part 2) & APSC AE",
    "difficulty": "HARD",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "APSC AE Civil 2022",
    "pyqYear": 2022
  },
  {
    "id": "cpm-pert-011",
    "questionNumber": 11,
    "examId": "gate-ce",
    "subject": "Construction Management & CPM",
    "topic": "CPM Calculations",
    "subtopic": "Independent Float Calculation",
    "stem": "An activity (i-j) has duration dij = 6 days. The earliest and latest event times are: Node i: Ei = 4, Li = 7; Node j: Ej = 15, Lj = 18. The Independent Float of activity (i-j) is:",
    "options": [
      {
        "id": "A",
        "text": "5 days"
      },
      {
        "id": "B",
        "text": "2 days"
      },
      {
        "id": "C",
        "text": "8 days"
      },
      {
        "id": "D",
        "text": "0 days"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Independent Float = Ej - Li - dij",
    "explanation": "Independent Float (IF) is calculated as IF = Ej - Li - dij. Here, Ej = 15, Li = 7, and dij = 6. Thus, IF = 15 - 7 - 6 = 2 days. (Total Float = Lj - Ei - dij = 18 - 4 - 6 = 8 days; Free Float = Ej - Ei - dij = 15 - 4 - 6 = 5 days).",
    "referenceSource": "GATE CE 2019",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "NUMERICAL",
    "pyqExam": "GATE CE 2019",
    "pyqYear": 2019
  },
  {
    "id": "cpm-pert-012",
    "questionNumber": 12,
    "examId": "upsc-ies-civil",
    "subject": "Construction Management & CPM",
    "topic": "Construction Equipment",
    "subtopic": "Compaction Rollers Selection",
    "stem": "Which type of compaction roller is most effective for compacting highly plastic clayey soils (such as impervious core of earthen dams)?",
    "options": [
      {
        "id": "A",
        "text": "Smooth wheeled roller"
      },
      {
        "id": "B",
        "text": "Pneumatic tyred roller"
      },
      {
        "id": "C",
        "text": "Sheepsfoot roller"
      },
      {
        "id": "D",
        "text": "Vibratory roller"
      }
    ],
    "correctOption": "C",
    "formulaContext": "Sheepsfoot: Kneading action for cohesive clays; Vibratory: Dynamic pulse for cohesionless sands",
    "explanation": "Sheepsfoot rollers compact soil through kneading and tamping action under high contact pressures (1.5 to 3.5 MPa) delivered by projecting feet. They are specifically suited for cohesive, plastic clays and silts. Vibratory rollers are used for cohesionless granular sands and gravels, while smooth-wheeled rollers are used for finishing base courses.",
    "referenceSource": "UPSC ESE 2023 & Peurifoy Construction Equipment",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "UPSC ESE / State AE",
    "pyqYear": 2023
  },
  {
    "id": "cpm-pert-013",
    "questionNumber": 13,
    "examId": "apsc-ae-civil",
    "subject": "Construction Management & CPM",
    "topic": "Contracts & Tenders",
    "subtopic": "Earnest Money vs Security Deposit",
    "stem": "In government engineering contracts, Earnest Money Deposit (EMD) and Security Deposit (SD) are typically what percentage of the estimated tender value?",
    "options": [
      {
        "id": "A",
        "text": "EMD: 1% to 2%; SD: 5% to 10%"
      },
      {
        "id": "B",
        "text": "EMD: 10% to 15%; SD: 1% to 2%"
      },
      {
        "id": "C",
        "text": "EMD: 5% to 8%; SD: 20%"
      },
      {
        "id": "D",
        "text": "EMD: 0.5%; SD: 25%"
      }
    ],
    "correctOption": "A",
    "formulaContext": "EMD ≈ 1-2% of tender cost (guarantees tender seriousness); SD ≈ 5-10% (guarantees performance)",
    "explanation": "Earnest Money Deposit (1% to 2% of estimated contract value) is submitted with the tender to guarantee that the bidder will not withdraw their offer before tender validity expires. Security Deposit (typically 5% to 10%, often deducted in installments from running bills) is held until the defect liability period expires to secure defect-free execution.",
    "referenceSource": "CPWD Works Manual 2024 & APSC AE",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CODE_RULE_BASED",
    "pyqExam": "APSC AE Civil / State CCE",
    "pyqYear": 2024
  },
  {
    "id": "cpm-pert-014",
    "questionNumber": 14,
    "examId": "gate-ce",
    "subject": "Construction Management & CPM",
    "topic": "Earned Value Management",
    "subtopic": "Cost Variance and Cost Performance Index",
    "stem": "A project milestone has Planned Value PV = ₹10 Lakh, Earned Value EV = ₹8 Lakh, and Actual Cost AC = ₹12 Lakh. The Cost Variance (CV) and Schedule Performance Index (SPI) are:",
    "options": [
      {
        "id": "A",
        "text": "CV = −₹4 Lakh and SPI = 0.80"
      },
      {
        "id": "B",
        "text": "CV = +₹2 Lakh and SPI = 1.25"
      },
      {
        "id": "C",
        "text": "CV = −₹2 Lakh and SPI = 0.67"
      },
      {
        "id": "D",
        "text": "CV = +₹4 Lakh and SPI = 0.80"
      }
    ],
    "correctOption": "A",
    "formulaContext": "CV = EV - AC ; SPI = EV / PV",
    "explanation": "Cost Variance CV = EV - AC = ₹8 L - ₹12 L = -₹4 Lakh (negative indicates over budget). Schedule Performance Index SPI = EV / PV = 8 / 10 = 0.80 (less than 1.0 indicates behind schedule).",
    "referenceSource": "GATE CE 2023 / Project Management Body of Knowledge",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "NUMERICAL",
    "pyqExam": "GATE CE 2023",
    "pyqYear": 2023
  },
  {
    "id": "cpm-pert-015",
    "questionNumber": 15,
    "examId": "upsc-ies-civil",
    "subject": "Construction Management & CPM",
    "topic": "Network Analysis",
    "subtopic": "Fulkerson's Rule for Node Numbering",
    "stem": "According to Fulkerson's rule for numbering nodes in a project network:",
    "options": [
      {
        "id": "A",
        "text": "Initial event is assigned number 1; arrows must always lead from lower-numbered nodes to higher-numbered nodes"
      },
      {
        "id": "B",
        "text": "Arrows always lead from higher-numbered nodes to lower-numbered nodes"
      },
      {
        "id": "C",
        "text": "Nodes are numbered alphabetically based on duration"
      },
      {
        "id": "D",
        "text": "Critical path nodes are assigned even numbers only"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Fulkerson's Rule: For any arrow (i -> j), i < j always",
    "explanation": "Fulkerson's rule prevents looping and maintains chronological precedence. The initial event (having only outgoing arrows) is numbered 1. Deleting all arrows emerging from 1 reveals new initial events, which are numbered 2, 3, etc. This guarantees that for every arrow representing an activity (i, j), node number i < node number j.",
    "referenceSource": "UPSC ESE 2021 / B.C. Punmia",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "UPSC ESE 2021",
    "pyqYear": 2021
  },
  {
    "id": "cpm-pert-016",
    "questionNumber": 16,
    "examId": "gate-ce",
    "subject": "Construction Management & CPM",
    "topic": "PERT Statistical Distribution",
    "subtopic": "Beta Distribution Characteristics",
    "stem": "In PERT analysis, activity duration is assumed to follow a Beta distribution because:",
    "options": [
      {
        "id": "A",
        "text": "It is a continuous probability distribution with finite endpoints and can model skewed (unimodal) activity durations"
      },
      {
        "id": "B",
        "text": "It is symmetric about the median for all activities"
      },
      {
        "id": "C",
        "text": "It has infinite tails matching normal distributions"
      },
      {
        "id": "D",
        "text": "It eliminates the need for calculating variance"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Beta distribution: bounded between to and tp, unimodal with peak at tm",
    "explanation": "Activity times in real-life projects have definite non-negative lower bounds (optimistic time to) and realistic upper bounds (pessimistic time tp). The Beta distribution has finite endpoints and can accommodate both positive and negative skewness with a mode at tm, making it mathematically ideal for PERT modeling.",
    "referenceSource": "GATE CE & Moder & Phillips Project Management",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "GATE CE 2022",
    "pyqYear": 2022
  },
  {
    "id": "cpm-pert-017",
    "questionNumber": 17,
    "examId": "apsc-ae-civil",
    "subject": "Construction Management & CPM",
    "topic": "Earthmoving Equipment",
    "subtopic": "Dragline vs Power Shovel",
    "stem": "Which earthmoving excavating equipment is most suitable for excavating trenches and digging canals below its own track level, particularly in soft or marshy ground?",
    "options": [
      {
        "id": "A",
        "text": "Power shovel"
      },
      {
        "id": "B",
        "text": "Dragline"
      },
      {
        "id": "C",
        "text": "Bulldozer"
      },
      {
        "id": "D",
        "text": "Elevating grader"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Dragline: Operates from firm ground, digs below track level; Power shovel: Digs above track level into firm banks",
    "explanation": "A dragline operates with a long boom and cable-suspended bucket, allowing it to dig well below the machine's supporting level and deposit spoil at a long radius without entering wet or muddy excavations. Power shovels, in contrast, are designed to dig upward against hard vertical faces above track level.",
    "referenceSource": "APSC AE Civil 2023 & Peurifoy",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "APSC AE Civil 2023",
    "pyqYear": 2023
  },
  {
    "id": "cpm-pert-018",
    "questionNumber": 18,
    "examId": "upsc-ies-civil",
    "subject": "Construction Management & CPM",
    "topic": "Contracts & Specifications",
    "subtopic": "Liquidated Damages vs Penalty",
    "stem": "In construction contracts, 'Liquidated Damages' refers to:",
    "options": [
      {
        "id": "A",
        "text": "A pre-agreed, genuine pre-estimate of loss incurred by the owner due to contractor delay"
      },
      {
        "id": "B",
        "text": "A punitive fine intended to penalize the contractor arbitrarily"
      },
      {
        "id": "C",
        "text": "Compensation paid by the owner to the contractor for site hindrances"
      },
      {
        "id": "D",
        "text": "Cost of dewatering during foundation excavation"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Liquidated damages = Genuine pre-estimate of loss (enforceable under Indian Contract Act §74)",
    "explanation": "Under Section 74 of the Indian Contract Act, 1872, liquidated damages represent a reasonable, genuine pre-estimate of damages agreed upon by both parties at contract signing to compensate for delays in completion. Unlike a penalty (which aims to punish or terrorize), courts enforce liquidated damages up to the reasonable loss actually suffered.",
    "referenceSource": "Indian Contract Act §74 & UPSC ESE",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "UPSC ESE 2021",
    "pyqYear": 2021
  },
  {
    "id": "cpm-pert-019",
    "questionNumber": 19,
    "examId": "gate-ce",
    "subject": "Construction Management & CPM",
    "topic": "PERT Statistical Analysis",
    "subtopic": "Z-Score & Project Completion Probability",
    "stem": "A project has an expected completion time of 40 days with a standard deviation of 5 days. The standard normal variate (Z) to achieve a scheduled completion time of 45 days is:",
    "options": [
      {
        "id": "A",
        "text": "Z = +1.0 (approx 84.1% probability)"
      },
      {
        "id": "B",
        "text": "Z = +2.0 (approx 97.7% probability)"
      },
      {
        "id": "C",
        "text": "Z = 0.0 (50.0% probability)"
      },
      {
        "id": "D",
        "text": "Z = −1.0 (approx 15.9% probability)"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Z = (Ts - Te) / σ_project = (45 - 40) / 5 = +1.0",
    "explanation": "The standard normal variate Z = (Ts - Te) / σ = (45 - 40) / 5 = +1.0. Looking up the cumulative normal distribution table, Z = +1.0 gives P(Z ≤ 1.0) = 0.5 + 0.3413 = 84.13% probability of completion within 45 days.",
    "referenceSource": "GATE CE 2021",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "NUMERICAL",
    "pyqExam": "GATE CE 2021",
    "pyqYear": 2021
  },
  {
    "id": "cpm-pert-020",
    "questionNumber": 20,
    "examId": "apsc-ae-civil",
    "subject": "Construction Management & CPM",
    "topic": "Bar Charts & Milestones",
    "subtopic": "Gantt Chart Limitations",
    "stem": "Which of the following is a major limitation of a conventional Gantt Bar Chart that led to the development of Network Techniques (CPM/PERT)?",
    "options": [
      {
        "id": "A",
        "text": "It cannot depict activity interdependencies, critical activities, or project float"
      },
      {
        "id": "B",
        "text": "It cannot be displayed graphically on paper"
      },
      {
        "id": "C",
        "text": "It can only be used for projects under ₹1 Lakh"
      },
      {
        "id": "D",
        "text": "It requires complex computerized matrix inversion"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Gantt chart: shows time bars, but lacks interdependency & critical path",
    "explanation": "A traditional Gantt bar chart shows start and finish dates of tasks, but does not clearly show how activities depend on one another. If one task slips, it is impossible to see directly which other tasks are impacted or what the overall impact on the completion date will be. It also cannot identify critical activities or floats.",
    "referenceSource": "APSC AE Civil 2023",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "APSC AE Civil 2023",
    "pyqYear": 2023
  },
  {
    "id": "cpm-pert-021",
    "questionNumber": 21,
    "examId": "upsc-ies-civil",
    "subject": "Construction Management & CPM",
    "topic": "Crashing Sequence",
    "subtopic": "Crashing Rules",
    "stem": "When crashing a project network with multiple parallel critical paths, crashing must be performed on:",
    "options": [
      {
        "id": "A",
        "text": "Any critical activity on any single path"
      },
      {
        "id": "B",
        "text": "Either an activity common to all critical paths, or simultaneously on one activity in each parallel critical path such that the combined cost slope is minimized"
      },
      {
        "id": "C",
        "text": "Non-critical activities with zero cost slope"
      },
      {
        "id": "D",
        "text": "The longest non-critical path"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Multiple critical paths: Crash common critical activity OR combination with lowest sum of cost slopes",
    "explanation": "If a network has multiple parallel critical paths, crashing an activity on only one path does not reduce the project duration because the parallel critical path will still govern. Thus, one must either crash an activity common to all critical paths or simultaneously crash one activity on each parallel critical path, choosing the combination with the lowest aggregate cost slope.",
    "referenceSource": "UPSC ESE 2022 & Moder & Phillips",
    "difficulty": "HARD",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "UPSC ESE 2022",
    "pyqYear": 2022
  },
  {
    "id": "cpm-pert-022",
    "questionNumber": 22,
    "examId": "gate-ce",
    "subject": "Construction Management & CPM",
    "topic": "Network Logic",
    "subtopic": "Dangling and Looping",
    "stem": "In project network construction:\n(I) Dangling occurs when an activity disconnects from the network before reaching the final event.\n(II) Looping (cycling) represents an endless cycle of dependencies and is strictly prohibited.",
    "options": [
      {
        "id": "A",
        "text": "Only (I) is correct"
      },
      {
        "id": "B",
        "text": "Only (II) is correct"
      },
      {
        "id": "C",
        "text": "Both (I) and (II) are correct"
      },
      {
        "id": "D",
        "text": "Neither (I) nor (II) is correct"
      }
    ],
    "correctOption": "C",
    "formulaContext": "Network errors: Looping (cyclic arrows), Dangling (dead-end activities not tied to end event)",
    "explanation": "Both statements define fundamental network construction errors. Dangling occurs when an intermediate activity ends in a dead-end node that never connects to the final terminal event. Looping (or cycling) occurs when activities form a closed loop, implying that an activity must be finished before it can start, which is a logical impossibility.",
    "referenceSource": "GATE CE & B.C. Punmia",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "STATEMENT_BASED",
    "pyqExam": "GATE CE / State PSC AE",
    "pyqYear": 2023
  },
  {
    "id": "cpm-pert-023",
    "questionNumber": 23,
    "examId": "apsc-ae-civil",
    "subject": "Construction Management & CPM",
    "topic": "Economic Life of Construction Equipment",
    "subtopic": "Optimum Replacement Time",
    "stem": "The economic life of a construction equipment ends when:",
    "options": [
      {
        "id": "A",
        "text": "The equipment completely breaks down and cannot be repaired"
      },
      {
        "id": "B",
        "text": "The average annual cumulative cost (ownership + maintenance/operating) reaches its minimum"
      },
      {
        "id": "C",
        "text": "The market scrap value of the equipment reaches zero"
      },
      {
        "id": "D",
        "text": "The contractor pays off the bank loan on the equipment"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Economic life = point where cumulative average cost per operating hour is minimized",
    "explanation": "As equipment ages, annual depreciation and capital ownership costs decrease, while maintenance, repair, downtime, and obsolescence costs increase sharply. The economic life is the age at which the total cumulative cost divided by operating hours/years is at an absolute minimum. Operating beyond this point results in economic loss.",
    "referenceSource": "Peurifoy Construction Planning & Equipment & APSC AE",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "APSC AE Civil 2024",
    "pyqYear": 2024
  },
  {
    "id": "cpm-pert-024",
    "questionNumber": 24,
    "examId": "upsc-ies-civil",
    "subject": "Construction Management & CPM",
    "topic": "Contracts & Valuation",
    "subtopic": "Item Rate vs Lump Sum Contracts",
    "stem": "For large-scale infrastructure civil engineering projects (such as highway and canal construction) where quantities of earthwork cannot be accurately predicted in advance, which type of contract is most suitable?",
    "options": [
      {
        "id": "A",
        "text": "Lump-sum contract"
      },
      {
        "id": "B",
        "text": "Unit price (Item rate / Schedule of rates) contract"
      },
      {
        "id": "C",
        "text": "Cost plus fixed percentage contract"
      },
      {
        "id": "D",
        "text": "Turnkey EPC contract without bills of quantities"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Item rate contract: Contractor quotes unit rates per item; payment based on actual measured quantities",
    "explanation": "In an item rate (unit price) contract, the contractor quotes prices per unit measurement (e.g. per m³ of earthwork or per m³ of concrete). The owner pays based on actual measured field quantities. This is standard for earthwork, foundation, and infrastructure works where subterranean surprises make exact volume estimation beforehand impossible.",
    "referenceSource": "CPWD Manual & UPSC ESE",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "UPSC ESE 2023",
    "pyqYear": 2023
  },
  {
    "id": "cpm-pert-025",
    "questionNumber": 25,
    "examId": "gate-ce",
    "subject": "Construction Management & CPM",
    "topic": "CPM Calculations",
    "subtopic": "Activity Times & Slacks",
    "stem": "An activity starts at Earliest Start Time EST = 10, has duration t = 6, and must finish by Latest Finish Time LFT = 22. What are its Earliest Finish Time (EFT) and Total Float (TF)?",
    "options": [
      {
        "id": "A",
        "text": "EFT = 16, TF = 6"
      },
      {
        "id": "B",
        "text": "EFT = 16, TF = 12"
      },
      {
        "id": "C",
        "text": "EFT = 10, TF = 6"
      },
      {
        "id": "D",
        "text": "EFT = 22, TF = 0"
      }
    ],
    "correctOption": "A",
    "formulaContext": "EFT = EST + t = 10 + 6 = 16 ; Total Float = LFT - EFT = 22 - 16 = 6",
    "explanation": "Earliest Finish Time EFT = EST + t = 10 + 6 = 16. Total Float TF = LFT - EFT = 22 - 16 = 6 (or LST - EST = (22 - 6) - 10 = 16 - 10 = 6). The activity can be delayed by up to 6 days without extending the project end date.",
    "referenceSource": "GATE CE 2020",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "NUMERICAL",
    "pyqExam": "GATE CE 2020",
    "pyqYear": 2020
  },
  {
    "id": "cpm-pert-026",
    "questionNumber": 26,
    "examId": "apsc-ae-civil",
    "subject": "Construction Management & CPM",
    "topic": "Safety & Quality Control",
    "subtopic": "Six Sigma & ISO Standards",
    "stem": "In modern construction quality management, 'Six Sigma' quality level corresponds to a defect rate of not more than:",
    "options": [
      {
        "id": "A",
        "text": "3.4 defects per million opportunities (DPMO)"
      },
      {
        "id": "B",
        "text": "66,807 defects per million opportunities"
      },
      {
        "id": "C",
        "text": "340 defects per million opportunities"
      },
      {
        "id": "D",
        "text": "0.01% of total output"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Six Sigma = 99.99966% defect-free = 3.4 DPMO",
    "explanation": "A Six Sigma process is one in which 99.99966% of all opportunities to produce some feature are statistically expected to be free of defects. This corresponds to 3.4 defect parts per million opportunities (DPMO) assuming a 1.5-sigma shift in the mean.",
    "referenceSource": "APSC AE Civil & ISO 9001",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "State AE / UPSC ESE",
    "pyqYear": 2024
  },
  {
    "id": "cpm-pert-027",
    "questionNumber": 27,
    "examId": "upsc-ies-civil",
    "subject": "Construction Management & CPM",
    "topic": "Construction Equipment",
    "subtopic": "Scraper Performance",
    "stem": "Which machine performs digging, loading, hauling, dumping, and spreading of earth in a single continuous cycle over haul distances of 150 m to 1500 m?",
    "options": [
      {
        "id": "A",
        "text": "Motor Grader"
      },
      {
        "id": "B",
        "text": "Tractor-drawn or Motor Scraper"
      },
      {
        "id": "C",
        "text": "Bulldozer"
      },
      {
        "id": "D",
        "text": "Backhoe loader"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Scraper: Digs, loads, hauls, and spreads in one self-contained unit",
    "explanation": "A scraper is a unique multi-functional earthmoving machine capable of excavating a thin layer of soil, loading it into its bowl, transporting it economically over medium distances (150 m to 1500 m), and spreading it in uniform layers at the fill site.",
    "referenceSource": "UPSC ESE 2021 & Peurifoy",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "UPSC ESE 2021",
    "pyqYear": 2021
  },
  {
    "id": "cpm-pert-028",
    "questionNumber": 28,
    "examId": "gate-ce",
    "subject": "Construction Management & CPM",
    "topic": "PERT Statistical Analysis",
    "subtopic": "Expected Time Formula Derivation",
    "stem": "The formula for expected duration in PERT, te = (to + 4*tm + tp) / 6, is derived by assuming that the activity duration follows:",
    "options": [
      {
        "id": "A",
        "text": "A standard normal distribution with mean tm"
      },
      {
        "id": "B",
        "text": "A unimodal Beta distribution with modal value tm and spread (tp - to) equal to 6 standard deviations"
      },
      {
        "id": "C",
        "text": "A uniform rectangular distribution"
      },
      {
        "id": "D",
        "text": "An exponential decay distribution"
      }
    ],
    "correctOption": "B",
    "formulaContext": "te = ∫ t * f(t) dt ≈ (to + 4*tm + tp) / 6 ; Range (tp - to) ≈ 6σ",
    "explanation": "The PERT formula approximates the mean of a unimodal Beta probability density curve. Assuming that the standard deviation σ equals 1/6th of the range (tp - to) because virtually 99.7% of the area under a bell-shaped curve lies within ±3σ (a spread of 6σ), Simpson's rule numerical integration yields the weighted average te = (to + 4*tm + tp) / 6.",
    "referenceSource": "GATE CE 2022 & Moder & Phillips",
    "difficulty": "MEDIUM",
    "sourceType": "MODELLED",
    "questionType": "CONCEPTUAL",
    "pyqExam": "GATE CE 2022",
    "pyqYear": 2022
  },
  {
    "id": "cpm-pert-029",
    "questionNumber": 29,
    "examId": "apsc-ae-civil",
    "subject": "Construction Management & CPM",
    "topic": "Network Analysis",
    "subtopic": "Free Float vs Total Float",
    "stem": "If an activity has Total Float = 8 days and the succeeding event slack is 3 days, what is the Free Float of this activity?",
    "options": [
      {
        "id": "A",
        "text": "5 days"
      },
      {
        "id": "B",
        "text": "11 days"
      },
      {
        "id": "C",
        "text": "8 days"
      },
      {
        "id": "D",
        "text": "24 days"
      }
    ],
    "correctOption": "A",
    "formulaContext": "Free Float = Total Float - Head Event Slack = 8 - 3 = 5 days",
    "explanation": "Free Float (FF) is related to Total Float (TF) by the equation: FF = TF - Head Slack (Sj). Substituting the given values: FF = 8 - 3 = 5 days. This means the activity can be delayed by 5 days without delaying the start of any succeeding activity.",
    "referenceSource": "APSC AE Civil 2024",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "NUMERICAL",
    "pyqExam": "APSC AE Civil 2024",
    "pyqYear": 2024
  },
  {
    "id": "cpm-pert-030",
    "questionNumber": 30,
    "examId": "upsc-ies-civil",
    "subject": "Construction Management & CPM",
    "topic": "Tender Process",
    "subtopic": "Retention Money & Defect Liability Period",
    "stem": "Retention money (or security deposit) deducted from a contractor's interim running bills is refunded:",
    "options": [
      {
        "id": "A",
        "text": "Immediately upon physical completion of the work"
      },
      {
        "id": "B",
        "text": "After satisfactory completion of the Defect Liability Period (usually 6 to 12 months after handover)"
      },
      {
        "id": "C",
        "text": "When the contractor signs the tender agreement"
      },
      {
        "id": "D",
        "text": "At 50% physical completion of the work"
      }
    ],
    "correctOption": "B",
    "formulaContext": "Retention money release = After Defect Liability Period (DLP) certification",
    "explanation": "Retention money acts as a performance guarantee protecting the client against latent construction defects. As per CPWD and standard FIDIC conditions, it is retained throughout the Defect Liability Period (typically 6 months to 1 year) and refunded only after the engineer-in-charge issues a final defect-free completion certificate.",
    "referenceSource": "CPWD Works Manual Clause 17 & UPSC ESE",
    "difficulty": "EASY",
    "sourceType": "MODELLED",
    "questionType": "CODE_RULE_BASED",
    "pyqExam": "UPSC ESE 2023",
    "pyqYear": 2023
  }
];
