import type { KnowledgeModule, MCQQuestion } from '../types';
import { TOPIC_KNOWLEDGE_MODULES } from '../data/topicKnowledge';

/* ========================================================================
 * PROMP.txt §7-9, §11-14, §42-44, §48, §52
 * Knowledge Discovery & Research Engine
 * ======================================================================== */

/* -------------------------------------------------------------------------- */
/*  Types                                                                   */
/* -------------------------------------------------------------------------- */

/** PROMP.txt §11 & §10 — Universal Knowledge Entity */
export interface KnowledgeEntity {
  id: string;
  subject: string;
  domain: string;
  topic: string;
  subtopic: string;
  entity_type:
    | 'concept'
    | 'definition'
    | 'theory'
    | 'principle'
    | 'law'
    | 'theorem'
    | 'formula'
    | 'equation'
    | 'rule'
    | 'process'
    | 'method'
    | 'event'
    | 'person'
    | 'date'
    | 'place'
    | 'classification'
    | 'property'
    | 'characteristic'
    | 'application'
    | 'example'
    | 'exception'
    | 'assumption'
    | 'limitation'
    | 'cause'
    | 'effect'
    | 'relationship'
    | 'fact'
    | 'terminology';
  title: string;
  content: string;
  definitions: string[];
  principles: string[];
  laws: string[];
  theories: string[];
  formulas: string[];
  rules: string[];
  facts: string[];
  assumptions: string[];
  limitations: string[];
  applications: string[];
  examples: string[];
  exceptions: string[];
  misconceptions: string[];
  prerequisites: string[];
  relationships: string[];
  sources: Array<{
    title: string;
    url: string;
    publisher: string;
    source_type: string;
    verified: boolean;
  }>;
  verification_status:
    | 'verified'
    | 'supported'
    | 'inferred'
    | 'unverified'
    | 'conflicting'
    | 'needs_review';
  created_at: string;
  updated_at: string;
  version: number;
}

/** PROMP.txt §12 — Knowledge Graph Relationship */
export interface KnowledgeRelationship {
  sourceId: string;
  targetId: string;
  type:
    | 'prerequisite_of'
    | 'depends_on'
    | 'related_to'
    | 'part_of'
    | 'explains'
    | 'applied_in'
    | 'contrasts_with'
    | 'derived_from'
    | 'tested_by';
}

/** PROMP.txt §42 & §14 — Knowledge Audit */
export interface KnowledgeAudit {
  subject: string;
  domain: string;
  topic: string;
  knowledgeCount: number;
  theorySteps: number;
  questionsCount: number;
  missingTheory: boolean;
  missingQuestions: boolean;
  conflicts: string[];
  hasHard: boolean;
}

/** PROMP.txt §44 — Auto-gap item */
export interface AutoGap {
  priority: number;
  subject: string;
  topic: string;
  gap: string;
}

/* -------------------------------------------------------------------------- */
/*  Factory: buildKnowledgeEntity                                             */
/* -------------------------------------------------------------------------- */

/**
 * Factory function conforming to PROMP.txt §11.
 * Creates a KnowledgeEntity from a partial input with sensible defaults.
 */
export function buildKnowledgeEntity(
  input: Partial<KnowledgeEntity> & { id: string; subject: string; domain: string; topic: string; title: string; content: string }
): KnowledgeEntity {
  const now = new Date().toISOString();
  return {
    id: input.id,
    subject: input.subject,
    domain: input.domain,
    topic: input.topic,
    subtopic: input.subtopic ?? '',
    entity_type: input.entity_type ?? 'concept',
    title: input.title,
    content: input.content,
    definitions: input.definitions ?? [],
    principles: input.principles ?? [],
    laws: input.laws ?? [],
    theories: input.theories ?? [],
    formulas: input.formulas ?? [],
    rules: input.rules ?? [],
    facts: input.facts ?? [],
    assumptions: input.assumptions ?? [],
    limitations: input.limitations ?? [],
    applications: input.applications ?? [],
    examples: input.examples ?? [],
    exceptions: input.exceptions ?? [],
    misconceptions: input.misconceptions ?? [],
    prerequisites: input.prerequisites ?? [],
    relationships: input.relationships ?? [],
    sources: input.sources ?? [],
    verification_status: input.verification_status ?? 'needs_review',
    created_at: input.created_at ?? now,
    updated_at: input.updated_at ?? now,
    version: input.version ?? 1,
  };
}

/* -------------------------------------------------------------------------- */
/*  Knowledge Graph: buildKnowledgeGraph                                      */
/* -------------------------------------------------------------------------- */

/**
 * PROMP.txt §12 — Creates relationships between entities based on
 * shared subjects, shared topics, and prerequisite links.
 */
export function buildKnowledgeGraph(entities: KnowledgeEntity[]): KnowledgeRelationship[] {
  const relationships: KnowledgeRelationship[] = [];
  const seen = new Set<string>();

  const addRel = (
    sourceId: string,
    targetId: string,
    type: KnowledgeRelationship['type']
  ): void => {
    const key = `${sourceId}->${targetId}:${type}`;
    if (sourceId !== targetId && !seen.has(key)) {
      seen.add(key);
      relationships.push({ sourceId, targetId, type });
    }
  };

  for (let i = 0; i < entities.length; i += 1) {
    const a = entities[i];
    for (let j = i + 1; j < entities.length; j += 1) {
      const b = entities[j];

      // Prerequisite relationship from explicit prerequisites
      if (a.prerequisites.includes(b.title) || a.prerequisites.includes(b.subject)) {
        addRel(b.id, a.id, 'prerequisite_of');
      }
      if (b.prerequisites.includes(a.title) || b.prerequisites.includes(a.subject)) {
        addRel(a.id, b.id, 'prerequisite_of');
      }

      // Same subject + different topics → related_to
      if (a.subject === b.subject && a.topic !== b.topic) {
        addRel(a.id, b.id, 'related_to');
      }

      // Same subject → part_of same domain
      if (a.subject === b.subject) {
        addRel(a.id, b.id, 'part_of');
        addRel(b.id, a.id, 'part_of');
      }

      // Shared source → related_to
      const sharedSources = a.sources.filter((sA) =>
        b.sources.some((sB) => sB.title === sA.title)
      );
      if (sharedSources.length > 0 && a.id !== b.id) {
        addRel(a.id, b.id, 'derived_from');
      }
    }
  }

  // Add explains / applied_in for theory-like → application-like entities
  for (const entity of entities) {
    if (entity.entity_type === 'theory' || entity.entity_type === 'law') {
      for (const other of entities) {
        if (other.entity_type === 'example' || other.entity_type === 'application') {
          if (other.prerequisites.includes(entity.title) || other.subject === entity.subject) {
            addRel(entity.id, other.id, 'applied_in');
            addRel(entity.id, other.id, 'explains');
          }
        }
      }
    }
    if (entity.entity_type === 'definition') {
      for (const other of entities) {
        if (other.prerequisites.includes(entity.title) || entity.prerequisites.includes(other.title)) {
          addRel(entity.id, other.id, 'explains');
        }
      }
    }
    if (entity.entity_type === 'formula') {
      for (const other of entities) {
        if (other.entity_type === 'law' || other.entity_type === 'theory') {
          if (other.subject === entity.subject) {
            addRel(entity.id, other.id, 'derived_from');
            addRel(other.id, entity.id, 'tested_by');
          }
        }
      }
    }
  }

  return relationships;
}

/* -------------------------------------------------------------------------- */
/*  Knowledge Audit: auditKnowledgeCoverage                                   */
/* -------------------------------------------------------------------------- */

/**
 * PROMP.txt §42 & §14 — Audits knowledge coverage across modules and questions.
 * Identifies missing theory, missing questions, conflicts, and completeness gaps.
 */
export function auditKnowledgeCoverage(
  modules: KnowledgeModule[],
  questions: MCQQuestion[]
): KnowledgeAudit[] {
  const audits: KnowledgeAudit[] = [];

  // Build a lookup of questions by subject+topic for quick access
  const questionMap = new Map<string, { count: number; difficulties: string[]; hasHard: boolean }>();
  for (const q of questions) {
    const key = `${q.subject}||${q.topic}`;
    const existing = questionMap.get(key) ?? { count: 0, difficulties: [], hasHard: false };
    existing.count += 1;
    existing.difficulties.push(q.difficulty);
    if (q.difficulty === 'HARD') existing.hasHard = true;
    questionMap.set(key, existing);
  }

  for (const module of modules) {
    const key = `${module.subject}||${module.title}`;
    const qInfo = questionMap.get(key) ?? { count: 0, difficulties: [], hasHard: false };

    const conflicts: string[] = [];

    // Check for conflicting verification statuses in entity-like data
    if (module.confidencePercent !== undefined && module.confidencePercent < 50) {
      conflicts.push(`Low confidence (${module.confidencePercent}%) for ${module.title}`);
    }

    const theorySteps = module.steps.length;
    const questionsCount = qInfo.count;
    const missingTheory = module.steps.length === 0 && module.fullDescription === undefined;
    const missingQuestions = questionsCount === 0;

    audits.push({
      subject: module.subject,
      domain: module.category === 'civil' ? 'Civil Engineering' : 'General Studies',
      topic: module.title,
      knowledgeCount: module.steps.length + (module.subtopicList?.length ?? 0),
      theorySteps,
      questionsCount,
      missingTheory,
      missingQuestions,
      conflicts,
      hasHard: qInfo.hasHard,
    });
  }

  // Also audit GS modules and any remaining modules not in questionMap
  const gsModules = modules.filter((m) => m.category === 'gs');
  for (const module of gsModules) {
    const existing = audits.find(
      (a) => a.subject === module.subject && a.topic === module.title
    );
    if (!existing) {
      const key = `${module.subject}||${module.title}`;
      const qInfo = questionMap.get(key) ?? { count: 0, difficulties: [], hasHard: false };
      audits.push({
        subject: module.subject,
        domain: 'General Studies',
        topic: module.title,
        knowledgeCount: module.steps.length + (module.subtopicList?.length ?? 0),
        theorySteps: module.steps.length,
        questionsCount: qInfo.count,
        missingTheory: module.steps.length === 0,
        missingQuestions: qInfo.count === 0,
        conflicts: [],
        hasHard: qInfo.hasHard,
      });
    }
  }

  return audits;
}

/* -------------------------------------------------------------------------- */
/*  Auto Gap Detection: detectAutoGaps                                        */
/* -------------------------------------------------------------------------- */

/**
 * PROMP.txt §44 — Automatic Gap Detection with priority ordering.
 *
 * Priority order:
 * 1. syllabus topics with no knowledge
 * 2. incomplete topics
 * 3. concepts without reliable sources
 * 4. concepts without questions
 * 5. concepts with only easy questions
 * 6. concepts lacking hard questions
 * 7. duplicate-heavy areas
 * 8. weak user concepts
 */
export function detectAutoGaps(audits: KnowledgeAudit[]): AutoGap[] {
  const gaps: AutoGap[] = [];

  for (const audit of audits) {
    // Priority 1: syllabus topics with no knowledge
    if (audit.knowledgeCount === 0) {
      gaps.push({
        priority: 1,
        subject: audit.subject,
        topic: audit.topic,
        gap: 'Syllabus topic has no knowledge entities — complete coverage required',
      });
      continue;
    }

    // Priority 2: incomplete topics (missing theory OR missing questions)
    if (audit.missingTheory || audit.missingQuestions) {
      const parts: string[] = [];
      if (audit.missingTheory) parts.push('missing theory/steps');
      if (audit.missingQuestions) parts.push('missing questions');
      gaps.push({
        priority: 2,
        subject: audit.subject,
        topic: audit.topic,
        gap: `Incomplete topic: ${parts.join(', ')}`,
      });
      continue;
    }

    // Priority 3-4 handled by validateEntity-level checks; here we flag low coverage
    if (audit.theorySteps < 2 && audit.questionsCount < 3) {
      gaps.push({
        priority: 3,
        subject: audit.subject,
        topic: audit.topic,
        gap: 'Concept has insufficient knowledge and few questions — needs expansion',
      });
      continue;
    }

    // Priority 5: concepts with only easy questions
    if (audit.questionsCount > 0 && !audit.hasHard) {
      gaps.push({
        priority: 5,
        subject: audit.subject,
        topic: audit.topic,
        gap: 'Concept has only easy questions — needs MEDIUM/HARD items',
      });
      continue;
    }

    // Priority 6: concepts lacking hard questions
    if (audit.questionsCount >= 3 && !audit.hasHard) {
      gaps.push({
        priority: 6,
        subject: audit.subject,
        topic: audit.topic,
        gap: 'Concept has questions but lacks HARD difficulty — exam readiness gap',
      });
      continue;
    }
  }

  // Sort by priority then subject/topic
  gaps.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    if (a.subject !== b.subject) return a.subject.localeCompare(b.subject);
    return a.topic.localeCompare(b.topic);
  });

  return gaps;
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Returns the canonical TOPIC_KNOWLEDGE_MODULES array for use by other services.
 */
export function getKnowledgeModules(): KnowledgeModule[] {
  return TOPIC_KNOWLEDGE_MODULES;
}

/**
 * Extracts unique subjects from all knowledge modules.
 */
export function getSubjectList(modules?: KnowledgeModule[]): string[] {
  const data = modules ?? TOPIC_KNOWLEDGE_MODULES;
  return Array.from(new Set(data.map((m) => m.subject)));
}

/**
 * Extracts unique domains (categories) from all knowledge modules.
 */
export function getDomainList(modules?: KnowledgeModule[]): string[] {
  const data = modules ?? TOPIC_KNOWLEDGE_MODULES;
  return Array.from(new Set(data.map((m) => m.category)));
}
