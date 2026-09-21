import type {
  CivilKnowledgeConcept,
  CivilKnowledgeSubject,
  CivilKnowledgeBranch,
  KnowledgeSearchFilters,
  KnowledgeSearchResult,
  FormulaBankItem,
  DefinitionBankItem,
  SymbolUnitItem,
  QuickRevisionItem,
  ConceptTrapItem
} from '../types/civilKnowledge';

import {
  ALL_CIVIL_CONCEPTS,
  ALL_CIVIL_SUBJECTS,
  CIVIL_BRANCHES,
  CONCEPT_MAP_BY_SLUG,
  CONCEPTS_BY_SUBJECT_MAP,
  CONCEPTS_BY_BRANCH_MAP,
  CIVIL_FORMULA_BANK,
  CIVIL_DEFINITION_BANK,
  CIVIL_SYMBOL_UNIT_BANK,
  CIVIL_QUICK_REVISION_BANK,
  CIVIL_CONCEPT_TRAP_BANK
} from '../data/civilKnowledge';

/**
 * High-Performance Search and Retrieval Service for the Civil Engineering Theory Knowledge Base.
 */
export class CivilKnowledgeService {
  /**
   * Search all concepts with keyword, branch, subject, and difficulty filters.
   */
  public static searchConcepts(filters: KnowledgeSearchFilters): KnowledgeSearchResult[] {
    const query = filters.query?.trim().toLowerCase() || '';
    const queryTokens = query.split(/\s+/).filter(Boolean);

    let candidates = ALL_CIVIL_CONCEPTS;

    if (filters.branchId && filters.branchId !== 'all') {
      candidates = candidates.filter((c) => c.branchId === filters.branchId);
    }

    if (filters.subject && filters.subject !== 'all') {
      candidates = candidates.filter((c) => c.subject === filters.subject);
    }

    if (filters.difficulty && filters.difficulty !== 'all') {
      candidates = candidates.filter((c) => c.difficulty === filters.difficulty);
    }

    if (filters.codeStandard && filters.codeStandard !== 'all') {
      candidates = candidates.filter((c) =>
        c.codeProvisions.some((p) => p.standard.toLowerCase().includes(filters.codeStandard!.toLowerCase()))
      );
    }

    if (filters.hasWorkedExamples) {
      candidates = candidates.filter((c) => c.workedExamples.length > 0);
    }

    if (filters.hasCodeProvisions) {
      candidates = candidates.filter((c) => c.codeProvisions.length > 0);
    }

    if (!query) {
      return candidates.map((concept) => ({
        concept,
        matchScore: 1,
        matchedField: 'title',
        snippet: concept.theory.summary
      }));
    }

    const results: KnowledgeSearchResult[] = [];

    for (const concept of candidates) {
      let score = 0;
      let matchedField: KnowledgeSearchResult['matchedField'] = 'theory';
      let snippet = concept.theory.summary;

      const titleLower = concept.title.toLowerCase();
      const summaryLower = concept.theory.summary.toLowerCase();
      const keywordsLower = concept.keywords.map((k) => k.toLowerCase()).join(' ');
      const formulasLower = concept.formulas.map((f) => f.name.toLowerCase() + ' ' + f.plainText.toLowerCase()).join(' ');
      const codesLower = concept.codeProvisions.map((cp) => cp.standard.toLowerCase() + ' ' + cp.clauseOrTable.toLowerCase() + ' ' + cp.title.toLowerCase()).join(' ');

      // Exact title match
      if (titleLower.includes(query)) {
        score += 100;
        matchedField = 'title';
        snippet = concept.title;
      }

      // Keyword match
      if (keywordsLower.includes(query)) {
        score += 50;
        matchedField = 'keyword';
        snippet = `Keywords: ${concept.keywords.join(', ')}`;
      }

      // Formula match
      if (formulasLower.includes(query)) {
        score += 40;
        matchedField = 'formula';
        const matchedF = concept.formulas.find((f) => f.name.toLowerCase().includes(query) || f.plainText.toLowerCase().includes(query));
        if (matchedF) snippet = `${matchedF.name}: ${matchedF.plainText}`;
      }

      // Code match
      if (codesLower.includes(query)) {
        score += 35;
        matchedField = 'code';
        const matchedCode = concept.codeProvisions.find((cp) => cp.standard.toLowerCase().includes(query) || cp.title.toLowerCase().includes(query));
        if (matchedCode) snippet = `${matchedCode.standard} ${matchedCode.clauseOrTable}: ${matchedCode.title}`;
      }

      // Token matching across theory
      for (const token of queryTokens) {
        if (titleLower.includes(token)) score += 20;
        if (keywordsLower.includes(token)) score += 10;
        if (summaryLower.includes(token)) score += 8;
        if (formulasLower.includes(token)) score += 6;
        if (codesLower.includes(token)) score += 5;
      }

      if (score > 0) {
        results.push({
          concept,
          matchScore: score,
          matchedField,
          snippet
        });
      }
    }

    return results.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Look up a single concept by slug.
   */
  public static getConceptBySlug(slug: string): CivilKnowledgeConcept | undefined {
    return CONCEPT_MAP_BY_SLUG.get(slug);
  }

  /**
   * Search the Formula Bank.
   */
  public static searchFormulas(query: string = '', subject?: string): FormulaBankItem[] {
    const q = query.trim().toLowerCase();
    return CIVIL_FORMULA_BANK.filter((f) => {
      if (subject && subject !== 'all' && f.subject !== subject) return false;
      if (!q) return true;
      return (
        f.name.toLowerCase().includes(q) ||
        f.plainText.toLowerCase().includes(q) ||
        f.topic.toLowerCase().includes(q) ||
        f.variables.some((v) => v.symbol.toLowerCase().includes(q) || v.name.toLowerCase().includes(q)) ||
        (f.codeRef && f.codeRef.toLowerCase().includes(q))
      );
    });
  }

  /**
   * Search the Definition Bank.
   */
  public static searchDefinitions(query: string = '', subject?: string): DefinitionBankItem[] {
    const q = query.trim().toLowerCase();
    return CIVIL_DEFINITION_BANK.filter((d) => {
      if (subject && subject !== 'all' && d.subject !== subject) return false;
      if (!q) return true;
      return (
        d.term.toLowerCase().includes(q) ||
        d.formalDefinition.toLowerCase().includes(q) ||
        d.topic.toLowerCase().includes(q) ||
        d.keyKeywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }

  /**
   * Search the Symbol & Unit Bank.
   */
  public static searchSymbols(query: string = '', subject?: string): SymbolUnitItem[] {
    const q = query.trim().toLowerCase();
    return CIVIL_SYMBOL_UNIT_BANK.filter((s) => {
      if (subject && subject !== 'all' && s.subject !== subject) return false;
      if (!q) return true;
      return (
        s.symbol.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.siUnit.toLowerCase().includes(q) ||
        s.dimensionalFormula.toLowerCase().includes(q) ||
        s.typicalContext.toLowerCase().includes(q)
      );
    });
  }

  /**
   * Search the Quick Revision Bank.
   */
  public static searchQuickRevision(query: string = '', subject?: string): QuickRevisionItem[] {
    const q = query.trim().toLowerCase();
    return CIVIL_QUICK_REVISION_BANK.filter((qr) => {
      if (subject && subject !== 'all' && qr.subject !== subject) return false;
      if (!q) return true;
      return (
        qr.highYieldFact.toLowerCase().includes(q) ||
        qr.topic.toLowerCase().includes(q) ||
        qr.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }

  /**
   * Search the Concept Trap & Mistake Bank.
   */
  public static searchConceptTraps(query: string = '', subject?: string): ConceptTrapItem[] {
    const q = query.trim().toLowerCase();
    return CIVIL_CONCEPT_TRAP_BANK.filter((t) => {
      if (subject && subject !== 'all' && t.subject !== subject) return false;
      if (!q) return true;
      return (
        t.trapTitle.toLowerCase().includes(q) ||
        t.commonMistake.toLowerCase().includes(q) ||
        t.correctConcept.toLowerCase().includes(q) ||
        t.preventionRule.toLowerCase().includes(q) ||
        t.topic.toLowerCase().includes(q)
      );
    });
  }

  /**
   * Get cross-linked related concepts for navigation.
   */
  public static getRelatedConcepts(slug: string): CivilKnowledgeConcept[] {
    const concept = CONCEPT_MAP_BY_SLUG.get(slug);
    if (!concept || !concept.relatedConceptSlugs) return [];
    return concept.relatedConceptSlugs
      .map((s) => CONCEPT_MAP_BY_SLUG.get(s))
      .filter((c): c is CivilKnowledgeConcept => Boolean(c));
  }

  /**
   * Aggregate statistics about the knowledge repository.
   */
  public static getKnowledgeBaseStats() {
    let totalWorkedExamples = 0;
    let totalCodeProvisions = 0;
    let totalDiagrams = 0;

    ALL_CIVIL_CONCEPTS.forEach((c) => {
      totalWorkedExamples += c.workedExamples.length;
      totalCodeProvisions += c.codeProvisions.length;
      totalDiagrams += c.diagrams.length;
    });

    return {
      totalBranches: CIVIL_BRANCHES.length,
      totalSubjects: ALL_CIVIL_SUBJECTS.length,
      totalConcepts: ALL_CIVIL_CONCEPTS.length,
      totalFormulas: CIVIL_FORMULA_BANK.length,
      totalDefinitions: CIVIL_DEFINITION_BANK.length,
      totalSymbols: CIVIL_SYMBOL_UNIT_BANK.length,
      totalQuickRevisionFacts: CIVIL_QUICK_REVISION_BANK.length,
      totalConceptTraps: CIVIL_CONCEPT_TRAP_BANK.length,
      totalWorkedExamples,
      totalCodeProvisions,
      totalDiagrams
    };
  }

  /**
   * Get all branches.
   */
  public static getBranches(): CivilKnowledgeBranch[] {
    return CIVIL_BRANCHES;
  }

  /**
   * Generate textbook context for AI Tutor explanations and question generation.
   */
  public static getConceptAiContext(slug: string): string {
    const concept = CONCEPT_MAP_BY_SLUG.get(slug);
    if (!concept) return '';

    let text = `# ${concept.title}\n`;
    text += `Branch: ${concept.branchName} | Subject: ${concept.subject} | Unit: ${concept.unit}\n\n`;
    text += `## Summary\n${concept.theory.summary}\n\n`;

    if (concept.theory.definitions.length > 0) {
      text += `## Definitions\n${concept.theory.definitions.map((d) => `- ${d}`).join('\n')}\n\n`;
    }

    if (concept.theory.principlesAndLaws.length > 0) {
      text += `## Governing Principles & Laws\n${concept.theory.principlesAndLaws.map((p) => `- ${p}`).join('\n')}\n\n`;
    }

    if (concept.formulas.length > 0) {
      text += `## Governing Formulas\n`;
      for (const f of concept.formulas) {
        text += `### ${f.name}\nLaTeX: $${f.formulaLatex}$\nPlain text: \`${f.plainText}\`\n`;
        text += `Variables:\n`;
        for (const v of f.variables) {
          text += `- ${v.symbol} (${v.name}): SI Unit [${v.siUnit}], Dimensions: ${v.dimensionalFormula}\n`;
        }
      }
      text += '\n';
    }

    if (concept.codeProvisions.length > 0) {
      text += `## Indian Standard Code Provisions\n`;
      for (const cp of concept.codeProvisions) {
        text += `- **${cp.standard} ${cp.clauseOrTable}** (${cp.title}): ${cp.provisionText}\n`;
      }
      text += '\n';
    }

    return text;
  }
}
