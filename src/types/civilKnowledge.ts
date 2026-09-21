/**
 * CIVIL ENGINEERING THEORY KNOWLEDGE BASE — TYPE DEFINITIONS
 * Digital Textbook, Searchable Formula Bank, Definition Bank,
 * Symbol & Unit Bank, Quick Revision Bank, and Concept Trap Bank.
 */

export type CivilDifficultyLevel =
  | 'FUNDAMENTAL'
  | 'INTERMEDIATE'
  | 'ADVANCED'
  | 'GATE_IES'
  | 'STATE_AE_JE';

export type CivilBranchId =
  | 'structural-mechanics'
  | 'geotechnical'
  | 'water-resources'
  | 'environmental'
  | 'transportation'
  | 'geomatics-management';

export type DiagramFormat = 'ASCII' | 'SVG' | 'MERMAID' | 'HTML';

export interface CopyableDiagram {
  id: string;
  title: string;
  format: DiagramFormat;
  content: string;
  caption: string;
  asciiAlternative?: string;
}

export interface CodeProvision {
  standard: string; // e.g. 'IS 456:2000', 'IS 800:2007', 'IRC:37:2018'
  clauseOrTable: string; // e.g. 'Cl. 38.1', 'Table 19', 'Sec. 4.2'
  title: string;
  provisionText: string;
  isMandatory: boolean;
  notes?: string;
}

export interface WorkedNumericalExample {
  id: string;
  title: string;
  problemStatement: string;
  givenData: Record<string, string>;
  governingFormulas: string[];
  stepByStepSolution: string[];
  finalAnswer: string;
  answerUnit: string;
  takeaway: string;
  examProvenance?: string;
}

export interface VariableDefinition {
  symbol: string;
  name: string;
  siUnit: string;
  dimensionalFormula: string; // e.g. '[M L^-1 T^-2]'
  typicalRange?: string;
  notes?: string;
}

export interface StandardConstant {
  symbol: string;
  name: string;
  value: string;
  unit: string;
}

export interface FormulaBankItem {
  id: string;
  name: string;
  formulaLatex: string;
  plainText: string;
  subject: string;
  topic: string;
  branch: string;
  variables: VariableDefinition[];
  conditionsOfApplicability: string[];
  standardConstants?: StandardConstant[];
  codeRef?: string;
  derivationSummary?: string;
  difficulty: CivilDifficultyLevel;
}

export interface DefinitionBankItem {
  id: string;
  term: string;
  formalDefinition: string;
  context: string;
  subject: string;
  topic: string;
  branch: string;
  codeReference?: string;
  keyKeywords: string[];
}

export interface SymbolUnitItem {
  id: string;
  symbol: string;
  name: string;
  siUnit: string;
  dimensionalFormula: string;
  subject: string;
  typicalContext: string;
}

export interface QuickRevisionItem {
  id: string;
  subject: string;
  topic: string;
  branch: string;
  highYieldFact: string;
  examSignificance: 'CRITICAL' | 'HIGH' | 'MODERATE';
  tags: string[];
  codeClause?: string;
}

export interface ConceptTrapItem {
  id: string;
  subject: string;
  topic: string;
  branch: string;
  trapTitle: string;
  commonMistake: string;
  correctConcept: string;
  whyCandidatesFail: string;
  examTrapExample?: string;
  preventionRule: string;
}

export interface CivilKnowledgeConcept {
  id: string;
  slug: string;
  title: string;
  branchId: CivilBranchId;
  branchName: string;
  subject: string;
  unit: string;
  chapter: string;
  topic: string;
  subtopic: string;
  difficulty: CivilDifficultyLevel;
  keywords: string[];
  
  // Detailed Theory & Textbook content
  theory: {
    summary: string;
    definitions: string[];
    principlesAndLaws: string[];
    governingAssumptions: string[];
    detailedExplanation: string;
    derivationSteps?: string[];
    standardProcedures?: string[];
    applications: string[];
    limitations: string[];
    comparisons?: {
      aspect: string;
      itemA: { label: string; value: string };
      itemB: { label: string; value: string };
    }[];
  };

  // Associated Visuals & Codes
  diagrams: CopyableDiagram[];
  formulas: FormulaBankItem[];
  codeProvisions: CodeProvision[];
  workedExamples: WorkedNumericalExample[];
  conceptTraps: ConceptTrapItem[];
  quickRevisionFacts: string[];

  // Knowledge Graph & Cross-linking
  prerequisites: string[];
  relatedConceptSlugs: string[];
  downstreamApplications: string[];
}

export interface CivilKnowledgeChapter {
  id: string;
  chapterNumber: number;
  title: string;
  subject: string;
  unit: string;
  overview: string;
  conceptSlugs: string[];
}

export interface CivilKnowledgeUnit {
  id: string;
  unitNumber: number;
  title: string;
  subject: string;
  chapters: CivilKnowledgeChapter[];
}

export interface CivilKnowledgeSubject {
  id: string;
  name: string;
  branchId: CivilBranchId;
  branchName: string;
  description: string;
  weightageRank: number;
  totalConcepts: number;
  units: CivilKnowledgeUnit[];
  standardCodes: string[];
}

export interface CivilKnowledgeBranch {
  id: CivilBranchId;
  name: string;
  description: string;
  iconName: string;
  subjects: CivilKnowledgeSubject[];
}

export interface KnowledgeSearchFilters {
  query?: string;
  branchId?: CivilBranchId | 'all';
  subject?: string | 'all';
  difficulty?: CivilDifficultyLevel | 'all';
  codeStandard?: string | 'all';
  hasWorkedExamples?: boolean;
  hasCodeProvisions?: boolean;
}

export interface KnowledgeSearchResult {
  concept: CivilKnowledgeConcept;
  matchScore: number;
  matchedField: 'title' | 'theory' | 'formula' | 'code' | 'keyword';
  snippet: string;
}
