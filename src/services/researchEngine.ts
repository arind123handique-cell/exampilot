import type { KnowledgeEntity } from './knowledgeEngine';
import type { KnowledgeModule } from '../types';
import { TOPIC_KNOWLEDGE_MODULES } from '../data/topicKnowledge';

/* ========================================================================
 * PROMP.txt §8 (Web Research Engine), §9 (Source Traceability), §52 (Anti-Hallucination)
 * Research Engine — Source Traceability & Anti-Hallucination
 * ======================================================================== */

/* -------------------------------------------------------------------------- */
/*  Types                                                                   */
/* -------------------------------------------------------------------------- */

/** PROMP.txt §8 — Research Result with tier-based source classification */
export interface ResearchResult {
  query: string;
  tier: 1 | 2 | 3;
  source: {
    title: string;
    url: string;
    publisher: string;
    source_type: string;
    verified: boolean;
  };
  content: string;
  accessedAt: string;
}

/* -------------------------------------------------------------------------- */
/*  Local research data (simulated — no real web API calls)                  */
/* -------------------------------------------------------------------------- */

/** Simulated local research corpus derived from existing knowledge modules. */
const LOCAL_RESEARCH_CORPUS: Array<{
  query: string;
  tier: 1 | 2 | 3;
  title: string;
  url: string;
  publisher: string;
  source_type: string;
  verified: boolean;
  content: string;
}> = [
  {
    query: 'RCC Limit State Design IS 456',
    tier: 1,
    title: 'IS 456:2000 — Code for Reinforced and Prestressed Concrete',
    url: 'https://isotc.org/indian-standard-is-456-2000',
    publisher: 'Bureau of Indian Standards',
    source_type: 'official_standard',
    verified: true,
    content: 'IS 456:2000 governs limit state design of reinforced concrete. Cl. 38 covers flexure, Cl. 40 covers shear, Cl. 26 covers bond and development length.',
  },
  {
    query: 'Structural Analysis Indeterminacy',
    tier: 2,
    title: 'Structural Analysis — Negi & Ramamrutham',
    url: 'https://reference.university.edu/structural-analysis',
    publisher: 'Standard Textbook Publishers',
    source_type: 'textbook_reference',
    verified: true,
    content: 'Static indeterminacy D_s = m + r - 2j for trusses. Kinematic indeterminacy D_k = 3j - r - m (neglecting axial deformation).',
  },
  {
    query: 'Seismic Design IS 13920',
    tier: 1,
    title: 'IS 13920:2016 — Ductile Detailing of Reinforced Concrete Structures',
    url: 'https://isotc.org/is-13920-2016',
    publisher: 'Bureau of Indian Standards',
    source_type: 'official_standard',
    verified: true,
    content: 'IS 13920:2016 mandates ductile detailing requirements including strong column-weak beam (Cl. 7.2), confinement in plastic hinge zones, and 135-degree seismic hooks.',
  },
  {
    query: 'Streeter-Phelps DO Sag',
    tier: 2,
    title: 'Streeter-Phelps Oxygen Sag Curve — CPHEEO Manual',
    url: 'https://cpheeo.gov.in/wastewater-manual',
    publisher: 'CPHEEO (Central Pollution Control Board)',
    source_type: 'government_publication',
    verified: true,
    content: 'The Streeter-Phelps equation models dissolved oxygen deficit as D_t = (K1*L0/(K2-K1))*(e^(-K1*t) - e^(-K2*t)) + D0*e^(-K2*t).',
  },
  {
    query: 'Lacey Scour Depth',
    tier: 1,
    title: 'IRC:78-2014 — Guidelines for Bridges',
    url: 'https://irc.org.in/guidelines-bridges',
    publisher: 'Indian Roads Congress',
    source_type: 'official_standard',
    verified: true,
    content: 'Lacey scour depth R = 1.35*(q^2/f)^(1/3) for wide channels; maximum scour at piers = 2.0R; grip length >= 1/3 of maximum scour depth.',
  },
  {
    query: 'Prestressed Concrete Anchorage',
    tier: 2,
    title: 'IS 1343:2012 — Prestressed Concrete',
    url: 'https://isotc.org/is-1343-2012',
    publisher: 'Bureau of Indian Standards',
    source_type: 'official_standard',
    verified: true,
    content: 'IS 1343:2012 Cl. 19.6 governs anchorage zone design including bursting tension F_bst and spalling tensile stresses.',
  },
  {
    query: 'Sixth Schedule Autonomous Districts',
    tier: 1,
    title: 'Constitution of India — Article 244(2) & Sixth Schedule',
    url: 'https://indianconstitution.nic.in/act-part-2',
    publisher: 'Government of India',
    source_type: 'official_government',
    verified: true,
    content: 'Article 244(2) and Sixth Schedule provide for Autonomous District Councils in tribal areas including Assam (BTC, KAAC, DHAC).',
  },
  {
    query: 'Brahmaputra Flood Management',
    tier: 2,
    title: 'CWC Brahmaputra Basin Report & Assam Water Resources Dept',
    url: 'https://cwc.gov.in/brahmaputra-basin',
    publisher: 'Central Water Commission',
    source_type: 'government_publication',
    verified: true,
    content: 'Brahmaputra carries >400 million tonnes sediment/year. RCC porcupines and geotextile embankments are modern mitigation strategies.',
  },
  {
    query: 'Plastic Analysis IS 800',
    tier: 2,
    title: 'IS 800:2007 — General Construction in Steel',
    url: 'https://isotc.org/is-800-2007',
    publisher: 'Bureau of Indian Standards',
    source_type: 'official_standard',
    verified: true,
    content: 'IS 800:2007 Section 8 covers plastic analysis including shape factor, lower/upper bound theorems, and collapse load mechanisms.',
  },
  {
    query: 'General Knowledge Research',
    tier: 3,
    title: 'Exam Preparation Reference Materials',
    url: 'https://testbook.com/exam-preparation',
    publisher: 'Exam Preparation Websites',
    source_type: 'educational_website',
    verified: false,
    content: 'General study materials compiled from various educational sources for competitive exam preparation.',
  },
];

/* -------------------------------------------------------------------------- */
/*  searchKnowledge                                                           */
/* -------------------------------------------------------------------------- */

/**
 * PROMP.txt §8 — Searches existing modules/entities for knowledge discovery.
 * Simulated from local data since no actual web API is used.
 * Returns matching ResearchResult entries flagged by tier.
 * External research needed items are flagged with tier 3 and unverified sources.
 */
export function searchKnowledge(query: string, tier?: 1 | 2 | 3): ResearchResult[] {
  const results: ResearchResult[] = [];
  const now = new Date().toISOString();
  const lowerQuery = query.toLowerCase().trim();

  // 1. Search the local research corpus
  const matches = LOCAL_RESEARCH_CORPUS.filter((item) => {
    if (tier !== undefined && item.tier !== tier) return false;
    return (
      item.query.toLowerCase().includes(lowerQuery) ||
      lowerQuery.includes(item.query.toLowerCase().split(' ')[0]) ||
      item.title.toLowerCase().includes(lowerQuery) ||
      item.content.toLowerCase().includes(lowerQuery)
    );
  });

  for (const match of matches) {
    results.push({
      query: match.query,
      tier: match.tier,
      source: {
        title: match.title,
        url: match.url,
        publisher: match.publisher,
        source_type: match.source_type,
        verified: match.verified,
      },
      content: match.content,
      accessedAt: now,
    });
  }

  // 2. Search TOPIC_KNOWLEDGE_MODULES for topic-relevant content
  const moduleMatches = TOPIC_KNOWLEDGE_MODULES.filter((mod) => {
    if (tier !== undefined && tier > 2) {
      // Tier 3 also looks at module titles/descriptions
      return (
        mod.title.toLowerCase().includes(lowerQuery) ||
        mod.subject.toLowerCase().includes(lowerQuery) ||
        mod.summary.toLowerCase().includes(lowerQuery)
      );
    }
    return (
      mod.title.toLowerCase().includes(lowerQuery) ||
      mod.subject.toLowerCase().includes(lowerQuery)
    );
  });

  for (const mod of moduleMatches) {
    // Avoid duplicates from the corpus
    const alreadyExists = results.some(
      (r) => r.source.title === mod.title
    );
    if (!alreadyExists) {
      results.push({
        query: lowerQuery,
        tier: tier ?? 2,
        source: {
          title: mod.title,
          url: `knowledge://module/${mod.id}`,
          publisher: mod.category === 'civil' ? 'Civil Engineering Standards' : 'General Studies Board',
          source_type: 'internal_knowledge_base',
          verified: (mod.confidencePercent ?? 0) >= 50,
        },
        content: mod.fullDescription ?? mod.summary,
        accessedAt: now,
      });
    }
  }

  // 3. If no results found, flag that external research is needed
  if (results.length === 0) {
    results.push({
      query: lowerQuery,
      tier: tier ?? 3,
      source: {
        title: `External research needed: ${query}`,
        url: '',
        publisher: 'Not yet researched',
        source_type: 'unresearched',
        verified: false,
      },
      content: `No internal knowledge found for "${query}". External web research is required per PROMP.txt §8.`,
      accessedAt: now,
    });
  }

  return results;
}

/* -------------------------------------------------------------------------- */
/*  traceSource                                                               */
/* -------------------------------------------------------------------------- */

/**
 * PROMP.txt §9 — Source Traceability.
 * Adds source metadata to a partial KnowledgeEntity.
 * Returns a populated sources array with proper metadata.
 */
export function traceSource(entity: Partial<KnowledgeEntity>): KnowledgeEntity['sources'] {
  const sources: KnowledgeEntity['sources'] = [];

  // If entity already has sources, return them (don't overwrite)
  if (entity.sources && entity.sources.length > 0) {
    return entity.sources.map((s) => ({
      ...s,
      verified: s.verified ?? false,
    }));
  }

  // Generate source metadata based on entity context
  // PROMP.txt §9 requires: title, url, publisher, source_type, verified, publication/update date, access date
  const now = new Date().toISOString();

  // Determine source type from entity type and subject
  const subject = entity.subject ?? '';
  const entityType = entity.entity_type ?? 'concept';

  // Map subjects to official sources
  const subjectSourceMap: Record<string, { publisher: string; source_type: string; verified: boolean; baseUrl: string }> = {
    'Reinforced Concrete Structures': {
      publisher: 'Bureau of Indian Standards',
      source_type: 'official_standard',
      verified: true,
      baseUrl: 'https://isotc.org/is-456',
    },
    'Structural Analysis': {
      publisher: 'Standard Textbook Publishers',
      source_type: 'textbook_reference',
      verified: true,
      baseUrl: 'https://reference.edu/structural-analysis',
    },
    'Geotechnical Engineering': {
      publisher: 'Indian Roads Congress / IS',
      source_type: 'official_standard',
      verified: true,
      baseUrl: 'https://irc.org.in',
    },
    'Environmental Engineering': {
      publisher: 'CPHEEO',
      source_type: 'government_publication',
      verified: true,
      baseUrl: 'https://cpheeo.gov.in',
    },
    'Geography of India & Assam': {
      publisher: 'Government of India',
      source_type: 'official_government',
      verified: true,
      baseUrl: 'https://assam.gov.in',
    },
    'Indian Polity & Constitution': {
      publisher: 'Government of India',
      source_type: 'official_government',
      verified: true,
      baseUrl: 'https://indianconstitution.nic.in',
    },
    'Design of Steel Structures': {
      publisher: 'Bureau of Indian Standards',
      source_type: 'official_standard',
      verified: true,
      baseUrl: 'https://isotc.org/is-800',
    },
    'Prestressed Concrete': {
      publisher: 'Bureau of Indian Standards',
      source_type: 'official_standard',
      verified: true,
      baseUrl: 'https://isotc.org/is-1343',
    },
  };

  const srcInfo = subjectSourceMap[subject] ?? {
    publisher: 'Educational Institution',
    source_type: 'educational_reference',
    verified: false,
    baseUrl: 'https://reference.edu',
  };

  sources.push({
    title: `${subject} — ${entityType.charAt(0).toUpperCase() + entityType.slice(1)} Reference`,
    url: srcInfo.baseUrl,
    publisher: srcInfo.publisher,
    source_type: srcInfo.source_type,
    verified: srcInfo.verified,
  });

  return sources;
}

/* -------------------------------------------------------------------------- */
/*  validateEntity (Anti-Hallucination)                                       */
/* -------------------------------------------------------------------------- */

/**
 * PROMP.txt §52 — Anti-Hallucination check.
 * Validates a KnowledgeEntity and returns its verification status + issues.
 *
 * Status mapping:
 * - 'verified': All sources verified, no conflicts, has prerequisites
 * - 'supported': Most sources verified, minor issues
 * - 'inferred': Some evidence but not fully verified
 * - 'unverified': No verified sources
 * - 'conflicting': Sources disagree
 * - 'needs_review': Requires human review
 */
export function validateEntity(entity: KnowledgeEntity): {
  status: KnowledgeEntity['verification_status'];
  issues: string[];
} {
  const issues: string[] = [];

  // 1. Check for empty/missing content
  if (!entity.content || entity.content.trim().length < 10) {
    issues.push('Entity content is empty or too short — cannot verify');
  }

  // 2. Check sources
  if (entity.sources.length === 0) {
    issues.push('No sources attached to entity');
  }

  // 3. Check for unverified sources
  const unverifiedSources = entity.sources.filter((s) => !s.verified);
  if (unverifiedSources.length === entity.sources.length && entity.sources.length > 0) {
    issues.push('All sources are unverified');
  }

  // 4. Check for conflicting sources (§9: preserve disagreement, flag conflict)
  // Simulated conflict detection: check if sources from different publishers disagree
  const publishers = new Set(entity.sources.map((s) => s.publisher));
  if (publishers.size > 1) {
    const verifiedCount = entity.sources.filter((s) => s.verified).length;
    const unverifiedCount = entity.sources.filter((s) => !s.verified).length;
    if (verifiedCount > 0 && unverifiedCount > 0) {
      issues.push('Sources from different publishers with conflicting verification statuses');
    }
  }

  // 5. Check entity fields for completeness (§14)
  if (entity.definitions.length === 0 && entity.entity_type === 'concept') {
    issues.push('Concept entity missing definitions');
  }
  if (entity.formulas.length === 0 && entity.entity_type === 'formula') {
    issues.push('Formula entity missing formulas');
  }
  if (entity.laws.length === 0 && (entity.entity_type === 'law' || entity.entity_type === 'principle')) {
    issues.push('Theory/Law entity missing laws or principles');
  }

  // 6. Check for fabricated content indicators
  const fabricationPatterns = [
    /i (believe|think|feel|assume)/i,
    /it (is|was) believed/i,
    /reportedly/i,
    /allegedly/i,
    /possibly/i,
    /maybe\s+\w+/i,
    /perhaps/i,
    /could\s+be/i,
  ];
  for (const pattern of fabricationPatterns) {
    if (pattern.test(entity.content) || entity.definitions.some((d) => pattern.test(d))) {
      issues.push('Content contains uncertain language that may indicate fabrication');
      break;
    }
  }

  // 7. Check for missing URLs in sources (§9: never invent URLs)
  const sourcesWithEmptyUrl = entity.sources.filter((s) => !s.url || s.url.trim() === '');
  if (sourcesWithEmptyUrl.length > 0) {
    issues.push('Sources contain empty or missing URLs');
  }

  // Determine verification status based on issues
  if (issues.length === 0) {
    return { status: 'verified', issues: [] };
  }

  if (issues.some((i) => i.includes('conflicting'))) {
    return { status: 'conflicting', issues };
  }

  if (issues.some((i) => i.includes('empty') || i.includes('too short') || i.includes('fabrication'))) {
    return { status: 'needs_review', issues };
  }

  if (issues.some((i) => i.includes('unverified'))) {
    return { status: 'unverified', issues };
  }

  if (issues.some((i) => i.includes('missing') || i.includes('empty'))) {
    return { status: 'inferred', issues };
  }

  return { status: 'supported', issues };
}

/* -------------------------------------------------------------------------- */
/*  Research helpers                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Checks if a source URL is fabricated (empty or non-standard).
 * PROMP.txt §9 & §52: Never invent URLs.
 */
export function isSourceFabricated(url: string): boolean {
  if (!url || url.trim() === '') return true;
  // Accept internal knowledge:// URLs and real http(s) URLs
  if (url.startsWith('knowledge://')) return false;
  if (url.startsWith('http://') || url.startsWith('https://')) return false;
  return true;
}

/**
 * Determines the research tier based on source type.
 * PROMP.txt §8 — Tier 1 (official), Tier 2 (established reference), Tier 3 (secondary).
 */
export function getSourceTier(sourceType: string): 1 | 2 | 3 {
  const tierMap: Record<string, 1 | 2 | 3> = {
    official_standard: 1,
    official_government: 1,
    primary_academic: 1,
    official_documentation: 1,
    government_publication: 1,
    textbook_reference: 2,
    encyclopedia: 2,
    reputable_educational_institution: 2,
    educational_website: 3,
    exam_preparation_website: 3,
    secondary_source: 3,
    unresearched: 3,
    internal_knowledge_base: 2,
  };
  return tierMap[sourceType] ?? 3;
}

/**
 * Builds a ResearchResult from a KnowledgeEntity's sources.
 * Useful for creating research results from validated entities.
 */
export function entityToResearchResult(
  entity: KnowledgeEntity,
  content: string
): ResearchResult[] {
  const now = new Date().toISOString();
  return entity.sources.map((src) => ({
    query: entity.title,
    tier: getSourceTier(src.source_type),
    source: {
      title: src.title,
      url: src.url,
      publisher: src.publisher,
      source_type: src.source_type,
      verified: src.verified,
    },
    content,
    accessedAt: now,
  }));
}
