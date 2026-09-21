// NOTE: This file preserves backwards compatibility. The app now supports universal exams
// (any exam hierarchy) via universalTaxonomy.ts — see PROMP.txt §4-6 for the universal taxonomy spec.

import { SyllabusTopic, MCQQuestion, MockTest, PYQPaper, DailyGoal, StudyMilestone } from '../types';
import { CIVIL_ENGINEERING_QUESTIONS as CIVIL_CORE_QUESTIONS } from './civilQuestions';
import { GENERAL_STUDIES_QUESTIONS as GS_CORE_QUESTIONS } from './generalStudiesQuestions';
import { ASSAM_DWR_2026_QUESTIONS } from './assamDwr2026Questions';
import { AE_WRD_2025_QUESTIONS } from './aewrd2025Questions';
import { UTO_2025_QUESTIONS } from './uto2025Questions';
import { NUMERICAL_CIVIL_QUESTIONS } from './numericalQuestions';
import { CIVIL_IES_APSC_QUESTIONS } from './civilIesApscBank';

import { STATEMENT_BASED_QUESTIONS } from './statementQuestions';
import { CPM_PERT_QUESTIONS } from './cpmPertQuestions';
import { EXAMVEDA_SOIL_QUESTIONS } from './soilMechanicsExamvedaBank';
import { APSC_PHED_AE_CIVIL_2025_QUESTIONS } from './apscPhedAeCivilMock';
import { APSC_PHED_AE_GS_2025_QUESTIONS } from './apscPhedAeGsMock';
// Papers imported by the PYQ exporter (pyq-inbox/import-pyq.bat). Regenerated on
// every run; the placeholder exports empty arrays, so this import is always safe.
import { GENERATED_PYQ_PAPERS, GENERATED_PYQ_MOCK_TESTS } from './pyq/generated';

export const GENERAL_STUDIES_QUESTIONS: MCQQuestion[] = [
  ...GS_CORE_QUESTIONS,
  ...ASSAM_DWR_2026_QUESTIONS,
  ...APSC_PHED_AE_GS_2025_QUESTIONS
];

export {
  GS_CORE_QUESTIONS,
  ASSAM_DWR_2026_QUESTIONS,
  AE_WRD_2025_QUESTIONS,
  UTO_2025_QUESTIONS,
  NUMERICAL_CIVIL_QUESTIONS,
  CIVIL_IES_APSC_QUESTIONS,
  STATEMENT_BASED_QUESTIONS,
  CPM_PERT_QUESTIONS,
  EXAMVEDA_SOIL_QUESTIONS,
  APSC_PHED_AE_CIVIL_2025_QUESTIONS,
  APSC_PHED_AE_GS_2025_QUESTIONS
};

/**
 * Civil paper pool = comprehensive multi-branch APSC/UPSC ESE question bank,
 * plus ExamVeda Soil Mechanics bank, plus CPM & PERT bank, plus numerical bank, plus statement-based MCQs,
 * plus the official AE WRD 2025 and UTO 2025 papers.
 */
export const CIVIL_ENGINEERING_QUESTIONS: MCQQuestion[] = [
  ...CIVIL_CORE_QUESTIONS,
  ...CIVIL_IES_APSC_QUESTIONS,
  ...NUMERICAL_CIVIL_QUESTIONS,
  ...STATEMENT_BASED_QUESTIONS,
  ...CPM_PERT_QUESTIONS,
  ...EXAMVEDA_SOIL_QUESTIONS,
  ...AE_WRD_2025_QUESTIONS,
  ...UTO_2025_QUESTIONS,
  ...APSC_PHED_AE_CIVIL_2025_QUESTIONS
];

export const ALL_QUESTIONS: MCQQuestion[] = [
  ...CIVIL_ENGINEERING_QUESTIONS,
  ...GENERAL_STUDIES_QUESTIONS
];

export const SUPPORTED_EXAMS = [
  {
    id: 'apsc-dwr-2026',
    name: 'Assam DWR Paper II (GS & English)',
    advtNumber: 'EAM/DWR/II/25/11',
    category: 'State PSC / Assam Government',
    color: '#0D9488',
    totalMarks: 100,
    durationHours: 2,
    description: 'Official 11/01/2026 Examination for Water Resources Department: General Studies & General English (100 Questions).'
  },
  {
    id: 'apsc-ae-wrd-2025',
    name: 'AE (Civil) — Water Resources Dept 2025',
    advtNumber: 'EAC/DWR/II/25/8',
    category: 'State PSC Engineering',
    color: '#0D9488',
    totalMarks: 100,
    durationHours: 2,
    description: 'Official 2025 AE (Civil) Paper II — Water Resources Department Technical Paper (100 Questions).'
  },
  {
    id: 'apsc-uto-2025',
    name: 'UTO Civil Engineering 2025',
    advtNumber: 'TOU/CE/DAUH/25/10',
    category: 'State PSC Engineering',
    color: '#0EA5E9',
    totalMarks: 100,
    durationHours: 2,
    description: 'Official 16/11/2025 UTO (Civil Engineering) Technical Paper (100 Questions).'
  },
  {
    id: 'apsc-ae-civil',
    name: 'APSC Assistant Engineer (Civil)',
    advtNumber: 'Advt 31/2025',
    category: 'State PSC Engineering',
    color: '#4F46E5',
    totalMarks: 200,
    durationHours: 2,
    description: 'Assam Public Service Commission Assistant Engineer (Civil) under PWD / WRD / PHED.'
  },
  {
    id: 'upsc-cse',
    name: 'UPSC Civil Services Examination',
    advtNumber: 'CSE Prelims 2026',
    category: 'Central Civil Services',
    color: '#0284C7',
    totalMarks: 400,
    durationHours: 4,
    description: 'Union Public Service Commission Preliminary Examination (GS Paper I & CSAT).'
  },
  {
    id: 'ssc-cgl',
    name: 'SSC Combined Graduate Level',
    advtNumber: 'CGL Tier I & II',
    category: 'Staff Selection Commission',
    color: '#059669',
    totalMarks: 200,
    durationHours: 1,
    description: 'Tier-1 computer based objective exam covering Quantitative Aptitude, Reasoning, and General Awareness.'
  },
  {
    id: 'gate-ce',
    name: 'GATE Civil Engineering',
    advtNumber: 'GATE 2026',
    category: 'National Engineering Entrance',
    color: '#7C3AED',
    totalMarks: 100,
    durationHours: 3,
    description: 'Graduate Aptitude Test in Engineering for M.Tech admissions and PSU recruitments.'
  }
];

export const INITIAL_SYLLABUS_TOPICS: SyllabusTopic[] = [
  {
    id: 'rcc-limit-state',
    code: 'CE-01',
    subject: 'Reinforced Concrete Structures',
    title: 'Limit State Design of RCC Members',
    weightage: 'HIGH_YIELD',
    expectedMarks: 28,
    completedSubtopics: 4,
    totalSubtopics: 6,
    overview: 'Design fundamentals per IS 456:2000, singly and doubly reinforced beams, flanged sections, shear, and bond.',
    subtopics: [
      { id: 'ls-assumptions', title: 'Philosophy & Assumptions of Limit State of Collapse', completed: true, notesCount: 5, pyqCount: 18, masteryLevel: 90 },
      { id: 'ls-flexure', title: 'Analysis of Singly Reinforced Rectangular Beams', completed: true, notesCount: 7, pyqCount: 24, masteryLevel: 85 },
      { id: 'ls-doubly', title: 'Doubly Reinforced Beams & Limiting Depth of Neutral Axis', completed: true, notesCount: 4, pyqCount: 14, masteryLevel: 78 },
      { id: 'ls-shear', title: 'Design for Shear, Diagonal Tension & Minimum Shear Stirrups', completed: true, notesCount: 6, pyqCount: 22, masteryLevel: 82 },
      { id: 'ls-bond', title: 'Development Length, Anchorage & Lap Splices (Cl. 26.2)', completed: false, notesCount: 3, pyqCount: 12, masteryLevel: 45 },
      { id: 'ls-columns', title: 'Short Axial Columns & Minimum Eccentricity Checks', completed: false, notesCount: 4, pyqCount: 16, masteryLevel: 30 }
    ]
  },
  {
    id: 'structural-analysis',
    code: 'CE-02',
    subject: 'Structural Analysis',
    title: 'Determinate & Indeterminate Structures',
    weightage: 'HIGH_YIELD',
    expectedMarks: 24,
    completedSubtopics: 3,
    totalSubtopics: 5,
    overview: 'Degree of static & kinematic indeterminacy, Moment Distribution Method, Slope Deflection, and Influence Lines.',
    subtopics: [
      { id: 'sa-indeterminacy', title: 'Static (Ds) and Kinematic (Dk) Indeterminacy in Trusses and Frames', completed: true, notesCount: 6, pyqCount: 26, masteryLevel: 95 },
      { id: 'sa-energy', title: 'Energy Theorems: Castigliano’s Theorems & Unit Load Method', completed: true, notesCount: 4, pyqCount: 19, masteryLevel: 70 },
      { id: 'sa-moment-dist', title: 'Moment Distribution Method: Stiffness, Carry-over & Distribution Factor', completed: true, notesCount: 8, pyqCount: 21, masteryLevel: 80 },
      { id: 'sa-ild', title: 'Müller-Breslau Principle & Influence Line Diagrams for Girders', completed: false, notesCount: 5, pyqCount: 15, masteryLevel: 50 },
      { id: 'sa-cables-arches', title: 'Three-Hinged & Two-Hinged Arches, Cable Tensions', completed: false, notesCount: 3, pyqCount: 10, masteryLevel: 25 }
    ]
  },
  {
    id: 'soil-mechanics',
    code: 'CE-03',
    subject: 'Geotechnical Engineering',
    title: 'Soil Mechanics & Foundation Engineering',
    weightage: 'HIGH_YIELD',
    expectedMarks: 26,
    completedSubtopics: 2,
    totalSubtopics: 5,
    overview: 'Phase relationships, compaction, consolidation theory, shear strength, and Terzaghi’s bearing capacity.',
    subtopics: [
      { id: 'ge-phase-diagram', title: 'Three-Phase Soil System, Void Ratio, Porosity & Unit Weights', completed: true, notesCount: 5, pyqCount: 30, masteryLevel: 92 },
      { id: 'ge-seepage', title: 'Permeability, Darcy’s Law, Flow Nets & Piping Failure', completed: true, notesCount: 4, pyqCount: 17, masteryLevel: 75 },
      { id: 'ge-consolidation', title: 'Terzaghi’s 1D Consolidation Theory & Coefficient of Consolidation', completed: false, notesCount: 6, pyqCount: 23, masteryLevel: 55 },
      { id: 'ge-shear', title: 'Mohr-Coulomb Failure Envelope, Direct Shear & Triaxial Tests', completed: false, notesCount: 5, pyqCount: 20, masteryLevel: 40 },
      { id: 'ge-foundations', title: 'Terzaghi Bearing Capacity Factors & Meyerhof Modifications', completed: false, notesCount: 4, pyqCount: 14, masteryLevel: 20 }
    ]
  },
  {
    id: 'fluid-mechanics',
    code: 'CE-04',
    subject: 'Fluid Mechanics & Hydraulics',
    title: 'Fluid Kinematics, Dynamics & Open Channels',
    weightage: 'MEDIUM',
    expectedMarks: 18,
    completedSubtopics: 2,
    totalSubtopics: 4,
    overview: 'Hydrostatic pressure, Bernoulli’s theorem, laminar & turbulent pipe flows, hydraulic jump in open channels.',
    subtopics: [
      { id: 'fm-hydrostatics', title: 'Hydrostatic Force on Submerged Planes & Center of Pressure', completed: true, notesCount: 3, pyqCount: 15, masteryLevel: 88 },
      { id: 'fm-bernoulli', title: 'Euler’s Equation, Bernoulli Theorem & Venturimeter Applications', completed: true, notesCount: 5, pyqCount: 18, masteryLevel: 80 },
      { id: 'fm-pipe-flow', title: 'Darcy-Weisbach Equation, Minor Losses & Hydraulic Gradient Line', completed: false, notesCount: 4, pyqCount: 12, masteryLevel: 45 },
      { id: 'fm-open-channel', title: 'Specific Energy Curve, Critical Depth & Froude Number Hydraulics', completed: false, notesCount: 5, pyqCount: 16, masteryLevel: 35 }
    ]
  },
  {
    id: 'environmental-engg',
    code: 'CE-05',
    subject: 'Environmental Engineering',
    title: 'Water Treatment & Waste Water Quality',
    weightage: 'MEDIUM',
    expectedMarks: 16,
    completedSubtopics: 1,
    totalSubtopics: 4,
    overview: 'Water quality standards, sedimentation, filtration, disinfection, BOD kinetics, activated sludge process.',
    subtopics: [
      { id: 'env-water-demand', title: 'Design Periods, Population Forecasting & Drinking Water Standards', completed: true, notesCount: 3, pyqCount: 11, masteryLevel: 85 },
      { id: 'env-treatment', title: 'Coagulation, Flocculation, Rapid Sand Filter & Breakpoint Chlorination', completed: false, notesCount: 6, pyqCount: 19, masteryLevel: 50 },
      { id: 'env-bod', title: 'First Order BOD Kinetics, Ultimate BOD & Temperature Coefficients', completed: false, notesCount: 4, pyqCount: 15, masteryLevel: 40 },
      { id: 'env-sewage', title: 'Sewer Hydraulics, Manning’s Formula & Self-Cleansing Velocities', completed: false, notesCount: 3, pyqCount: 9, masteryLevel: 30 }
    ]
  },
  // GS Syllabus Modules
  {
    id: 'gs-polity',
    code: 'GS-01',
    subject: 'General Studies',
    title: 'Indian Polity, Governance & Constitution',
    weightage: 'HIGH_YIELD',
    expectedMarks: 36,
    completedSubtopics: 3,
    totalSubtopics: 5,
    overview: 'Preamble, Fundamental Rights, DPSP, Parliament, Judiciary, Constitutional bodies and amendments.',
    subtopics: [
      { id: 'pol-rights', title: 'Fundamental Rights (Articles 14-32) & Writs', completed: true, notesCount: 8, pyqCount: 32, masteryLevel: 92 },
      { id: 'pol-dpsp', title: 'Directive Principles & Fundamental Duties', completed: true, notesCount: 5, pyqCount: 22, masteryLevel: 85 },
      { id: 'pol-exec', title: 'President, Governor & Emergency Powers', completed: true, notesCount: 7, pyqCount: 25, masteryLevel: 80 },
      { id: 'pol-parl', title: 'Parliamentary Procedures, Money Bills & Joint Sittings', completed: false, notesCount: 6, pyqCount: 28, masteryLevel: 55 },
      { id: 'pol-local', title: '73rd & 74th Amendments, Panchayati Raj', completed: false, notesCount: 4, pyqCount: 18, masteryLevel: 40 }
    ]
  },
  {
    id: 'gs-history',
    code: 'GS-02',
    subject: 'General Studies',
    title: 'Indian History & National Freedom Struggle',
    weightage: 'HIGH_YIELD',
    expectedMarks: 36,
    completedSubtopics: 3,
    totalSubtopics: 4,
    overview: 'Ancient, medieval, and modern freedom struggle from 1857 to 1947.',
    subtopics: [
      { id: 'hist-ancient', title: 'Indus Valley Civilization, Vedic Era & Buddhism/Jainism', completed: true, notesCount: 6, pyqCount: 24, masteryLevel: 90 },
      { id: 'hist-medieval', title: 'Delhi Sultanate & Mughal Administration', completed: true, notesCount: 5, pyqCount: 20, masteryLevel: 75 },
      { id: 'hist-revolt', title: 'Revolt of 1857 & Socio-Religious Reformers', completed: true, notesCount: 7, pyqCount: 26, masteryLevel: 88 },
      { id: 'hist-national', title: 'Gandhian Era, Non-Cooperation, Dandi & Quit India', completed: false, notesCount: 9, pyqCount: 35, masteryLevel: 60 }
    ]
  }
];

const somQuestions = CIVIL_IES_APSC_QUESTIONS.filter(q => q.subject === 'Strength of Materials');
const bmQuestions = CIVIL_IES_APSC_QUESTIONS.filter(q => q.subject === 'Building Materials & Construction');
const saQuestions = CIVIL_IES_APSC_QUESTIONS.filter(q => q.subject === 'Structural Analysis');
const rccQuestions = CIVIL_IES_APSC_QUESTIONS.filter(q => q.subject === 'Reinforced Concrete Structures');
const steelQuestions = CIVIL_IES_APSC_QUESTIONS.filter(q => q.subject === 'Design of Steel Structures');
const geoQuestions = CIVIL_IES_APSC_QUESTIONS.filter(q => q.subject === 'Geotechnical Engineering');
const fmQuestions = CIVIL_IES_APSC_QUESTIONS.filter(q => q.subject === 'Fluid Mechanics & Hydraulics');
const hydroQuestions = CIVIL_IES_APSC_QUESTIONS.filter(q => q.subject === 'Hydrology & Irrigation');
const envQuestions = CIVIL_IES_APSC_QUESTIONS.filter(q => q.subject === 'Environmental Engineering');
const transQuestions = CIVIL_IES_APSC_QUESTIONS.filter(q => q.subject === 'Transportation Engineering');
const surQuestions = CIVIL_IES_APSC_QUESTIONS.filter(q => q.subject === 'Surveying & Geomatics');
const cpmQuestions = CIVIL_IES_APSC_QUESTIONS.filter(q => q.subject === 'Construction Management & Estimating');

// Full Civil Engineering Mock Test (Authentic UPSC ESE & APSC AE Bank)
export const MOCK_TEST_CIVIL_100: MockTest = {
  id: 'mock-civil-100',
  title: 'APSC AE Civil Engineering Full Mock Exam (Paper II)',
  examId: 'apsc-ae-civil',
  paperName: 'Civil Engineering Paper II — Technical Paper (UPSC ESE & APSC AE Standards)',
  durationMinutes: 120,
  totalMarks: 200,
  negativeMarksPerIncorrect: 0.25,
  sections: [
    {
      id: 'sec-som',
      name: `Part 1: Strength of Materials & Mechanics (${somQuestions.length} Questions)`,
      totalQuestions: somQuestions.length,
      questions: somQuestions
    },
    {
      id: 'sec-bm-steel',
      name: `Part 2: Building Materials & Steel Structures (${bmQuestions.length + steelQuestions.length} Questions)`,
      totalQuestions: bmQuestions.length + steelQuestions.length,
      questions: [...bmQuestions, ...steelQuestions]
    },
    {
      id: 'sec-rcc-sa',
      name: `Part 3: RCC & Structural Analysis (${rccQuestions.length + saQuestions.length} Questions)`,
      totalQuestions: rccQuestions.length + saQuestions.length,
      questions: [...rccQuestions, ...saQuestions]
    },
    {
      id: 'sec-geotech',
      name: `Part 4: Geotechnical & Foundation Engineering (${geoQuestions.length} Questions)`,
      totalQuestions: geoQuestions.length,
      questions: geoQuestions
    },
    {
      id: 'sec-water',
      name: `Part 5: Fluid Mechanics, Open Channels & Hydrology / Irrigation (${fmQuestions.length + hydroQuestions.length} Questions)`,
      totalQuestions: fmQuestions.length + hydroQuestions.length,
      questions: [...fmQuestions, ...hydroQuestions]
    },
    {
      id: 'sec-env-trans',
      name: `Part 6: Environmental & Transportation Engineering (${envQuestions.length + transQuestions.length} Questions)`,
      totalQuestions: envQuestions.length + transQuestions.length,
      questions: [...envQuestions, ...transQuestions]
    },
    {
      id: 'sec-sur-cpm',
      name: `Part 7: Surveying & Construction Management (${surQuestions.length + cpmQuestions.length} Questions)`,
      totalQuestions: surQuestions.length + cpmQuestions.length,
      questions: [...surQuestions, ...cpmQuestions]
    }
  ]
};

// Official 2025 Assam AE (Civil) WRD Paper II Mock Exam (EAC/DWR/II/25/8, Series A)
export const MOCK_TEST_AE_WRD_2025: MockTest = {
  id: 'mock-ae-wrd-2025',
  title: 'AE (Civil) WRD 2025: Official Paper II (Technical)',
  examId: 'apsc-ae-wrd-2025',
  paperName: 'AE (Civil) — Water Resources Department Paper II (EAC/DWR/II/25/8, Series A)',
  durationMinutes: 120,
  totalMarks: 100,
  negativeMarksPerIncorrect: 0.25,
  sections: [
    {
      id: 'sec-ae-wrd-2025-full',
      name: 'Technical Paper — Q1 to Q100',
      totalQuestions: 100,
      questions: AE_WRD_2025_QUESTIONS.slice(0, 100)
    }
  ]
};

// Official 2025 UTO (Civil Engineering) Paper Mock Exam (TOU/CE/DAUH/25/10)
export const MOCK_TEST_UTO_2025: MockTest = {
  id: 'mock-uto-2025',
  title: 'UTO Civil 2025: Official Technical Paper',
  examId: 'apsc-uto-2025',
  paperName: 'UTO (Civil Engineering) Paper — TOU/CE/DAUH/25/10 (16/11/2025, Series A)',
  durationMinutes: 120,
  totalMarks: 100,
  negativeMarksPerIncorrect: 0.25,
  sections: [
    {
      id: 'sec-uto-2025-full',
      name: 'Technical Paper — Q1 to Q100',
      totalQuestions: 100,
      questions: UTO_2025_QUESTIONS.slice(0, 100)
    }
  ]
};

// Full 100-Question Official Assam DWR 2026 Paper II Mock Exam
export const MOCK_TEST_DWR_2026: MockTest = {
  id: 'mock-dwr-2026',
  title: 'Assam DWR 2026: General Studies & General English (Paper II)',
  examId: 'apsc-dwr-2026',
  paperName: 'Assam DWR Paper II (11/01/2026 Series A Official Examination)',
  durationMinutes: 120,
  totalMarks: 100,
  negativeMarksPerIncorrect: 0.25,
  sections: [
    {
      id: 'sec-dwr-history-heritage',
      name: 'Part 1: Ancient & Medieval History, Heritage & Assam Art (Q1-48)',
      totalQuestions: 48,
      questions: ASSAM_DWR_2026_QUESTIONS.slice(0, 48)
    },
    {
      id: 'sec-dwr-aptitude-english',
      name: 'Part 2: Aptitude, Mental Ability & General English (Q49-62)',
      totalQuestions: 14,
      questions: ASSAM_DWR_2026_QUESTIONS.slice(48, 62)
    },
    {
      id: 'sec-dwr-polity-ca',
      name: 'Part 3: Indian Polity, Northeast & Current Affairs (Q63-86)',
      totalQuestions: 24,
      questions: ASSAM_DWR_2026_QUESTIONS.slice(62, 86)
    },
    {
      id: 'sec-dwr-env-geography',
      name: 'Part 4: Environment, Science & Assam Geography (Q87-100)',
      totalQuestions: 14,
      questions: ASSAM_DWR_2026_QUESTIONS.slice(86, 100)
    }
  ]
};

// Full 100-Question General Studies Mock Test
export const MOCK_TEST_GS_100: MockTest = {
  id: 'mock-gs-100',
  title: 'General Studies Full Mock Exam — Paper I (100 Questions)',
  examId: 'upsc-cse',
  paperName: 'General Studies Paper I — Civil Services / State PSC',
  durationMinutes: 120,
  totalMarks: 200,
  negativeMarksPerIncorrect: 0.25,
  sections: [
    {
      id: 'sec-gs-polity',
      name: 'Part 1: Indian Polity & Constitution (Q1-18)',
      totalQuestions: 18,
      questions: GS_CORE_QUESTIONS.slice(0, 18)
    },
    {
      id: 'sec-gs-history',
      name: 'Part 2: Indian History & National Movement (Q19-36)',
      totalQuestions: 18,
      questions: GS_CORE_QUESTIONS.slice(18, 36)
    },
    {
      id: 'sec-gs-geo',
      name: 'Part 3: Geography & Ecology (Q37-52)',
      totalQuestions: 16,
      questions: GS_CORE_QUESTIONS.slice(36, 52)
    },
    {
      id: 'sec-gs-econ',
      name: 'Part 4: Indian Economy & Development (Q53-66)',
      totalQuestions: 14,
      questions: GS_CORE_QUESTIONS.slice(52, 66)
    },
    {
      id: 'sec-gs-sci',
      name: 'Part 5: General Science & Modern Tech (Q67-80)',
      totalQuestions: 14,
      questions: GS_CORE_QUESTIONS.slice(66, 80)
    },
    {
      id: 'sec-gs-state',
      name: 'Part 6: State GK & Northeast Region (Q81-90)',
      totalQuestions: 10,
      questions: GS_CORE_QUESTIONS.slice(80, 90)
    },
    {
      id: 'sec-gs-apt',
      name: 'Part 7: Quantitative Aptitude & Reasoning (Q91-100)',
      totalQuestions: 10,
      questions: GS_CORE_QUESTIONS.slice(90, 100)
    }
  ]
};

// Full UPSC ESE / IES Civil Engineering Advanced Mock Exam
export const MOCK_TEST_IES_CIVIL: MockTest = {
  id: 'mock-ies-civil',
  title: 'UPSC ESE / IES Civil Engineering Technical Mock Exam',
  examId: 'upsc-ies-civil',
  paperName: 'Civil Engineering Objective Paper — UPSC ESE / Testbook Pattern',
  durationMinutes: 120,
  totalMarks: 200,
  negativeMarksPerIncorrect: 0.33,
  sections: [
    {
      id: 'sec-ies-advanced',
      name: 'All Branches: Multi-Statement & High-Yield Analysis',
      totalQuestions: CIVIL_IES_APSC_QUESTIONS.length,
      questions: CIVIL_IES_APSC_QUESTIONS
    }
  ]
};

// Official APSC AE (PHED) Paper-I General Studies Mock Exam (Advt. 31/2025)
export const MOCK_TEST_APSC_PHED_AE_GS_2025: MockTest = {
  id: 'mock-apsc-phed-ae-gs-2025',
  title: 'APSC AE (PHED) Paper-I General Studies Official Mock Exam (Advt. 31/2025)',
  examId: 'apsc-phed-ae-gs-2025',
  paperName: 'PAPER-I GENERAL STUDIES — Bachelor Degree Standard (100 MCQs)',
  durationMinutes: 120,
  totalMarks: 100,
  negativeMarksPerIncorrect: 0.25,
  sections: [
    {
      id: 'sec-apsc-phed-gs-current',
      name: 'Unit I: Current Events of National & International importance (Q1-12)',
      totalQuestions: 12,
      questions: APSC_PHED_AE_GS_2025_QUESTIONS.slice(0, 12)
    },
    {
      id: 'sec-apsc-phed-gs-history',
      name: 'Unit II: History of India & History of Assam (Q13-27)',
      totalQuestions: 15,
      questions: APSC_PHED_AE_GS_2025_QUESTIONS.slice(12, 27)
    },
    {
      id: 'sec-apsc-phed-gs-geo',
      name: 'Unit III: World Geography including India & Assam (Q28-42)',
      totalQuestions: 15,
      questions: APSC_PHED_AE_GS_2025_QUESTIONS.slice(27, 42)
    },
    {
      id: 'sec-apsc-phed-gs-econ',
      name: 'Unit IV: Indian Economy, Indian National Movements (Q43-56)',
      totalQuestions: 14,
      questions: APSC_PHED_AE_GS_2025_QUESTIONS.slice(42, 56)
    },
    {
      id: 'sec-apsc-phed-gs-mental',
      name: 'Unit V: Mental Ability (Q57-68)',
      totalQuestions: 12,
      questions: APSC_PHED_AE_GS_2025_QUESTIONS.slice(56, 68)
    },
    {
      id: 'sec-apsc-phed-gs-scitech',
      name: 'Unit VI: Role and Impact of Science and Technology in India (Q69-78)',
      totalQuestions: 10,
      questions: APSC_PHED_AE_GS_2025_QUESTIONS.slice(68, 78)
    },
    {
      id: 'sec-apsc-phed-gs-polity',
      name: 'Unit VII: Indian Polity, Political System in India (Q79-90)',
      totalQuestions: 12,
      questions: APSC_PHED_AE_GS_2025_QUESTIONS.slice(78, 90)
    },
    {
      id: 'sec-apsc-phed-gs-culture',
      name: 'Unit VIII: Indian Culture (Q91-100)',
      totalQuestions: 10,
      questions: APSC_PHED_AE_GS_2025_QUESTIONS.slice(90, 100)
    }
  ]
};

// Official APSC AE Civil (PHED) Paper-II Mock Exam (Advt. 31/2025)
export const MOCK_TEST_APSC_PHED_AE_CIVIL_2025: MockTest = {
  id: 'mock-apsc-phed-ae-civil-2025',
  title: 'APSC AE (Civil) PHED Paper-II Official Mock Exam (Advt. 31/2025)',
  examId: 'apsc-phed-ae-civil-2025',
  paperName: 'PAPER-II CIVIL ENGINEERING — Bachelor Degree Standard (100 MCQs)',
  durationMinutes: 120,
  totalMarks: 100,
  negativeMarksPerIncorrect: 0.25,
  sections: [
    {
      id: 'sec-apsc-phed-statics',
      name: 'Module 1: Statics (Q1-10)',
      totalQuestions: 10,
      questions: APSC_PHED_AE_CIVIL_2025_QUESTIONS.slice(0, 10)
    },
    {
      id: 'sec-apsc-phed-dynamics',
      name: 'Module 2: Dynamics (Q11-18)',
      totalQuestions: 8,
      questions: APSC_PHED_AE_CIVIL_2025_QUESTIONS.slice(10, 18)
    },
    {
      id: 'sec-apsc-phed-kinematics',
      name: 'Module 3: Kinematics (Q19-26)',
      totalQuestions: 8,
      questions: APSC_PHED_AE_CIVIL_2025_QUESTIONS.slice(18, 26)
    },
    {
      id: 'sec-apsc-phed-kinetics',
      name: 'Module 4: Kinetics (Q27-36)',
      totalQuestions: 10,
      questions: APSC_PHED_AE_CIVIL_2025_QUESTIONS.slice(26, 36)
    },
    {
      id: 'sec-apsc-phed-som',
      name: 'Module 5: Strength of Materials (Q37-56)',
      totalQuestions: 20,
      questions: APSC_PHED_AE_CIVIL_2025_QUESTIONS.slice(36, 56)
    },
    {
      id: 'sec-apsc-phed-soil',
      name: 'Module 6: Soil Mechanics (Q57-72)',
      totalQuestions: 16,
      questions: APSC_PHED_AE_CIVIL_2025_QUESTIONS.slice(56, 72)
    },
    {
      id: 'sec-apsc-phed-fluids',
      name: 'Module 7: Fluid Mechanics (Q73-88)',
      totalQuestions: 16,
      questions: APSC_PHED_AE_CIVIL_2025_QUESTIONS.slice(72, 88)
    },
    {
      id: 'sec-apsc-phed-surveying',
      name: 'Module 8: Surveying (Q89-100)',
      totalQuestions: 12,
      questions: APSC_PHED_AE_CIVIL_2025_QUESTIONS.slice(88, 100)
    }
  ]
};

export const MOCK_TESTS: MockTest[] = [
  // Official Syllabus Mock Tests
  MOCK_TEST_APSC_PHED_AE_GS_2025,
  MOCK_TEST_APSC_PHED_AE_CIVIL_2025,
  // Imported PYQ papers come first so a freshly added paper is prominent.
  ...GENERATED_PYQ_MOCK_TESTS,
  MOCK_TEST_AE_WRD_2025,
  MOCK_TEST_UTO_2025,
  MOCK_TEST_DWR_2026,
  MOCK_TEST_CIVIL_100,
  MOCK_TEST_GS_100
];

/**
 * Canonical subject taxonomy — single source of truth for grouping questions.
 *
 * Every question bank uses its own raw `subject` strings (e.g. "RCC Structures"
 * vs "Reinforced Concrete Structures", "Fluid Mechanics" vs
 * "Fluid Mechanics & Hydraulics"). These groups map ALL known raw subjects to
 * nine stable buckets so subject-wise banks, practice filters and custom mock
 * creation never mix in unrelated questions via loose keyword matching.
 */
export interface SubjectGroup {
  id: string;
  label: string;
  shortLabel: string;
  /** Exact raw `subject` values belonging to this group (matched case-insensitively). */
  subjects: string[];
  /** Fallback substring matchers over "subject + topic + subtopic" (all lowercase). */
  topicKeywords?: string[];
}

export const SUBJECT_GROUPS: SubjectGroup[] = [
  {
    id: 'general-studies',
    label: 'General Studies & Assam GK',
    shortLabel: 'General Studies',
    subjects: [
      'General Studies',
      'General English',
      'General Mental Ability',
      'Assam & Northeast Development',
      'Assam Geography & Economy',
      'Assam History & Culture',
      'General Science & Technology',
      'Geography & Ecology',
      'Indian Economy & Development',
      'Indian History & National Movement',
      'Indian Polity & Constitution',
      'Quantitative Aptitude & Reasoning',
      'State General Knowledge (Assam & NE)',
      'I. Current Events of National & International importance',
      'II. History of India & History of Assam',
      'III. World Geography including India & Assam',
      'IV. Indian Economy, Indian National Movements',
      'V. Mental Ability',
      'VI. Role and Impact of Science and Technology in India',
      'VII. Indian Polity, Political System in India',
      'VIII. Indian Culture'
    ]
  },
  {
    id: 'hydraulics-water',
    label: 'Hydraulics & Water Resources',
    shortLabel: 'Hydraulics',
    subjects: [
      'Fluid Mechanics',
      'Fluid Mechanics & Hydraulics',
      'Hydrology',
      'Hydrology & Irrigation',
      'Hydrology & Irrigation Engineering',
      'Irrigation Engineering',
      'Water Resources / Hydrology',
      'Water Resources Engineering'
    ],
    topicKeywords: ['open channel', 'pipe flow', 'hydraulic jump', 'specific energy', 'chezy', 'manning']
  },
  {
    id: 'structures',
    label: 'Structures (SOM / RCC / Steel)',
    shortLabel: 'Structures',
    subjects: [
      'Strength of Materials',
      'Structural Analysis',
      'Reinforced Concrete Structures',
      'RCC Structures',
      'Prestressed Concrete',
      'Design of Steel Structures',
      'Steel Structures'
    ]
  },
  {
    id: 'geotechnical',
    label: 'Geotechnical & Foundation',
    shortLabel: 'Geotechnical',
    subjects: [
      'Geotechnical Engineering',
      'Soil Mechanics',
      'Foundation Engineering'
    ]
  },
  {
    id: 'transportation',
    label: 'Transportation Engineering',
    shortLabel: 'Transportation',
    subjects: [
      'Highway Engineering',
      'Highway & Transportation Engineering',
      'Traffic Engineering',
      'Transportation Engineering'
    ]
  },
  {
    id: 'environmental',
    label: 'Environmental Engineering',
    shortLabel: 'Environmental',
    subjects: [
      'Environmental Engineering',
      'Water Supply Engineering'
    ]
  },
  {
    id: 'materials',
    label: 'Building Materials & Concrete',
    shortLabel: 'Materials',
    subjects: [
      'Building Materials',
      'Building Materials & Construction',
      'Building Materials & Construction Management',
      'Concrete Technology',
      'Building Construction'
    ]
  },
  {
    id: 'surveying',
    label: 'Surveying & Geomatics',
    shortLabel: 'Surveying',
    subjects: [
      'Surveying',
      'Surveying & Geomatics'
    ]
  },
  {
    id: 'construction-mgmt',
    label: 'Construction Management & CPM',
    shortLabel: 'Const. Mgmt',
    subjects: [
      'Construction Management',
      'Construction Management & CPM',
      'Construction Management & Estimating',
      'Estimation & Costing',
      'Estimating & Costing'
    ]
  }
];

const normalizeSubjectText = (s: string | undefined): string => (s || '').trim().toLowerCase();

/** Resolve the canonical subject-group id for a question (exact subject match first). */
export function getSubjectGroupId(q: Pick<MCQQuestion, 'subject' | 'topic'> & { subtopic?: string }): string {
  const subj = normalizeSubjectText(q.subject);
  for (const g of SUBJECT_GROUPS) {
    if (g.subjects.some((s) => s.toLowerCase() === subj)) return g.id;
  }
  const haystack = `${normalizeSubjectText(q.subject)} ${normalizeSubjectText(q.topic)} ${normalizeSubjectText(q.subtopic)}`;
  for (const g of SUBJECT_GROUPS) {
    if ((g.topicKeywords || []).some((k) => haystack.includes(k))) return g.id;
  }
  return 'other';
}

/** All questions in a canonical subject group (exact matching — no cross-subject leakage). */
export function getQuestionsBySubjectGroup(groupId: string, pool: MCQQuestion[] = ALL_QUESTIONS): MCQQuestion[] {
  return pool.filter((q) => getSubjectGroupId(q) === groupId);
}

/** Question counts per subject group (plus `other` for unmapped subjects). */
export function getSubjectGroupCounts(pool: MCQQuestion[] = ALL_QUESTIONS): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const q of pool) {
    const gid = getSubjectGroupId(q);
    counts[gid] = (counts[gid] || 0) + 1;
  }
  return counts;
}

/** One ready-to-take MockTest per subject group (subject banks, kept out of MOCK_TESTS). */
export const SUBJECT_GROUP_TESTS: MockTest[] = SUBJECT_GROUPS.map((g) => {
  const questions = getQuestionsBySubjectGroup(g.id);
  return {
    id: `mock-subject-${g.id}`,
    title: `${g.label} — Subject Bank`,
    examId: 'subject-bank',
    paperName: `${g.label} Subject Bank`,
    durationMinutes: Math.max(10, questions.length),
    totalMarks: questions.length,
    negativeMarksPerIncorrect: 0.25,
    sections: [
      {
        id: `sec-subject-${g.id}`,
        name: g.label,
        totalQuestions: questions.length,
        questions
      }
    ]
  };
});

export const INITIAL_DAILY_GOALS: DailyGoal[] = [
  {
    id: 'goal-1',
    title: 'RCC: Minimum Shear Reinforcement & Spacing Rules',
    subject: 'RCC Structures',
    topicId: 'rcc-limit-state',
    minutes: 45,
    status: 'COMPLETED',
    type: 'READING'
  },
  {
    id: 'goal-2',
    title: 'Solve 25 Testbook PYQs on Static & Kinematic Indeterminacy',
    subject: 'Structural Analysis',
    topicId: 'structural-analysis',
    minutes: 40,
    status: 'IN_PROGRESS',
    type: 'PRACTICE'
  },
  {
    id: 'goal-3',
    title: 'Review Terzaghi 1D Consolidation Formulae Sheet',
    subject: 'Geotechnical Engg',
    topicId: 'soil-mechanics',
    minutes: 30,
    status: 'PENDING',
    type: 'REVISION'
  },
  {
    id: 'goal-4',
    title: 'Polity: Preamble, Fundamental Rights & Writs Revision',
    subject: 'General Studies',
    topicId: 'gs-polity',
    minutes: 45,
    status: 'PENDING',
    type: 'READING'
  },
  {
    id: 'goal-5',
    title: 'APSC AE 2024 Technical Paper II Sectional Mock Drill',
    subject: 'Comprehensive',
    topicId: 'mock-test',
    minutes: 60,
    status: 'PENDING',
    type: 'MOCK'
  }
];

export const INITIAL_MILESTONES: StudyMilestone[] = [
  {
    id: 'mile-1',
    title: 'Phase I: Core Structural & Concrete Engineering (100 Q Drill)',
    dateRange: 'Week 1 — Week 3',
    completed: true,
    progressPercent: 100,
    targetTopics: ['Limit State RCC', 'Determinate Trusses', 'Shear & Bond']
  },
  {
    id: 'mile-2',
    title: 'Phase II: Geotechnical & Soil Foundation Mechanics',
    dateRange: 'Week 4 — Week 6',
    completed: false,
    progressPercent: 65,
    targetTopics: ['Permeability & Seepage', 'Consolidation', 'Bearing Capacity']
  },
  {
    id: 'mile-3',
    title: 'Phase III: General Studies (Polity, Modern History & Assam GK)',
    dateRange: 'Week 7 — Week 9',
    completed: false,
    progressPercent: 40,
    targetTopics: ['Constitution Articles', 'Freedom Struggle', 'Assam Rivers & Sanctuaries']
  },
  {
    id: 'mile-4',
    title: 'Phase IV: Full-Length 100-Question Timed Mocks',
    dateRange: 'Week 10 — Exam Day',
    completed: false,
    progressPercent: 0,
    targetTopics: ['Civil 100 Q Mock', 'GS 100 Q Mock', 'Error Log Scrub']
  }
];

export const PYQ_PAPERS: PYQPaper[] = [
  // Papers extracted from pyq-inbox/ (see tools/pyq_exporter).
  ...GENERATED_PYQ_PAPERS,
  {
    id: 'pyq-apsc-dwr-2026',
    examName: 'Assam DWR (Water Resources) Paper II (Series A)',
    year: 2026,
    paperType: 'Paper II (General Studies & General English — 100 Questions)',
    totalQuestions: 100,
    downloadAvailable: true,
    frequencyTags: [
      'Assam History & Art (24%)',
      'Indian Polity & Constitution (16%)',
      'Physical & Assam Geography (18%)',
      'General English (12%)',
      'Current Affairs & Schemes (16%)',
      'Quantitative Aptitude & Reasoning (14%)'
    ],
    questions: ASSAM_DWR_2026_QUESTIONS
  },
  {
    id: 'pyq-ae-wrd-2025',
    examName: 'AE (Civil) — Water Resources Department Paper II (Series A)',
    year: 2025,
    paperType: 'Technical Paper (Civil Engineering — 100 Questions)',
    totalQuestions: 100,
    downloadAvailable: true,
    frequencyTags: ['RCC & Concrete (15%)', 'Soil Mechanics (12%)', 'Fluid Mechanics (12%)', 'Surveying (10%)', 'Transportation (10%)'],
    questions: AE_WRD_2025_QUESTIONS
  },
  {
    id: 'pyq-uto-2025',
    examName: 'UTO (Civil Engineering) — 16/11/2025 Paper (TOU/CE/DAUH/25/10, Series A)',
    year: 2025,
    paperType: 'Technical Paper (Civil Engineering — 100 Questions)',
    totalQuestions: 100,
    downloadAvailable: true,
    frequencyTags: ['Building Materials & Concrete (14%)', 'Structural Analysis (12%)', 'Geotechnical (12%)', 'Environmental (10%)', 'Highway & Railways (10%)'],
    questions: UTO_2025_QUESTIONS
  },
  {
    id: 'pyq-apsc-ce-2024',
    examName: 'APSC AE Civil Engineering (Advt 31/2025 Model)',
    year: 2024,
    paperType: 'Paper II (Technical Subject — 100 Questions)',
    totalQuestions: 100,
    downloadAvailable: true,
    frequencyTags: ['RCC & Concrete (15%)', 'Soil Mechanics (15%)', 'Fluid Mechanics (12%)', 'Structural Analysis (12%)'],
    questions: CIVIL_ENGINEERING_QUESTIONS
  },
  {
    id: 'pyq-gs-2024',
    examName: 'General Studies Paper I (State PSC / APSC Model)',
    year: 2024,
    paperType: 'Paper I (General Studies — 100 Questions)',
    totalQuestions: 100,
    downloadAvailable: true,
    frequencyTags: ['Indian Polity (18%)', 'Modern History (18%)', 'Geography & Environment (16%)', 'Economy (14%)'],
    questions: GENERAL_STUDIES_QUESTIONS
  },
  {
    id: 'pyq-apsc-ce-2023',
    examName: 'APSC AE Civil Engineering',
    year: 2023,
    paperType: 'Paper II (Technical Subject — 100 Questions)',
    totalQuestions: 100,
    downloadAvailable: true,
    frequencyTags: ['Structural Analysis (14%)', 'Transportation (10%)', 'Environmental (10%)', 'Surveying (8%)'],
    questions: CIVIL_ENGINEERING_QUESTIONS
  },
  {
    id: 'pyq-gs-2023',
    examName: 'General Studies Paper I (Civil Services)',
    year: 2023,
    paperType: 'Paper I (General Studies — 100 Questions)',
    totalQuestions: 100,
    downloadAvailable: true,
    frequencyTags: ['Science & Tech (14%)', 'Assam GK (10%)', 'Aptitude & Reasoning (10%)', 'Polity (18%)'],
    questions: GENERAL_STUDIES_QUESTIONS
  }
];
