/**
 * SCRIPT: Export Civil Engineering Theory Knowledge Base to machine-readable JSON
 * Dumps the entire repository, hierarchical branches, and all 5 dedicated banks
 * into public/data/civil_knowledge_base.json for offline and AI agent consumption.
 *
 * Usage: node scripts/export-civil-knowledge-json.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import compiled knowledge base
const {
  ALL_CIVIL_CONCEPTS,
  ALL_CIVIL_SUBJECTS,
  CIVIL_BRANCHES,
  CIVIL_FORMULA_BANK,
  CIVIL_DEFINITION_BANK,
  CIVIL_SYMBOL_UNIT_BANK,
  CIVIL_QUICK_REVISION_BANK,
  CIVIL_CONCEPT_TRAP_BANK
} = await import('../src/data/civilKnowledge/index.ts');

const exportPayload = {
  metadata: {
    title: 'Civil Engineering Digital Textbook & Theory Knowledge Base',
    generatedAt: new Date().toISOString(),
    version: '1.0.0',
    totalBranches: CIVIL_BRANCHES.length,
    totalSubjects: ALL_CIVIL_SUBJECTS.length,
    totalConcepts: ALL_CIVIL_CONCEPTS.length,
    totalFormulas: CIVIL_FORMULA_BANK.length,
    totalDefinitions: CIVIL_DEFINITION_BANK.length,
    totalSymbols: CIVIL_SYMBOL_UNIT_BANK.length,
    totalQuickRevisionFacts: CIVIL_QUICK_REVISION_BANK.length,
    totalConceptTraps: CIVIL_CONCEPT_TRAP_BANK.length
  },
  branches: CIVIL_BRANCHES,
  subjects: ALL_CIVIL_SUBJECTS,
  concepts: ALL_CIVIL_CONCEPTS,
  formulaBank: CIVIL_FORMULA_BANK,
  definitionBank: CIVIL_DEFINITION_BANK,
  symbolUnitBank: CIVIL_SYMBOL_UNIT_BANK,
  quickRevisionBank: CIVIL_QUICK_REVISION_BANK,
  conceptTrapBank: CIVIL_CONCEPT_TRAP_BANK
};

const outputDir = path.resolve(__dirname, '../public/data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, 'civil_knowledge_base.json');
fs.writeFileSync(outputPath, JSON.stringify(exportPayload, null, 2), 'utf-8');

const stats = fs.statSync(outputPath);
console.log(`✓ Civil Knowledge Base exported successfully to ${outputPath}`);
console.log(`  Payload size: ${(stats.size / 1024).toFixed(2)} KB`);
console.log(`  Branches: ${CIVIL_BRANCHES.length}, Concepts: ${ALL_CIVIL_CONCEPTS.length}, Formulas: ${CIVIL_FORMULA_BANK.length}`);
