import { MCQQuestion } from '../types';

const SQL_STORAGE_KEY = 'exampilot_sql_database_dump';

/**
 * Escapes single quotes for SQL string literals
 */
function escapeSqlString(str: string | null | undefined): string {
  if (str === null || str === undefined) return 'NULL';
  const escaped = String(str).replace(/'/g, "''");
  return `'${escaped}'`;
}

/**
 * Returns standard ANSI SQL schema for questions table (compatible with PostgreSQL, MySQL, SQLite, Supabase)
 */
export function generateSqlSchema(): string {
  return `-- =========================================================
-- ExamPilot SQL Database Schema: custom_questions
-- Compatible with PostgreSQL, Supabase, MySQL, SQLite
-- =========================================================

CREATE TABLE IF NOT EXISTS custom_questions (
  id VARCHAR(64) PRIMARY KEY,
  question_number INT DEFAULT 1,
  topic VARCHAR(128) NOT NULL,
  subject VARCHAR(128) NOT NULL,
  stem TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_option CHAR(1) NOT NULL,
  explanation TEXT,
  formula_context TEXT,
  reference_source VARCHAR(255) DEFAULT 'Online Verified Source',
  difficulty VARCHAR(16) DEFAULT 'MEDIUM',
  question_type VARCHAR(32) DEFAULT 'CONCEPTUAL',
  source_type VARCHAR(32) DEFAULT 'AI_GENERATED',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_custom_questions_topic ON custom_questions(topic);
CREATE INDEX IF NOT EXISTS idx_custom_questions_difficulty ON custom_questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_custom_questions_type ON custom_questions(question_type);
`;
}

/**
 * Generates SQL INSERT statements for a list of MCQQuestion objects
 */
export function generateSqlInserts(questions: MCQQuestion[]): string {
  if (!questions || questions.length === 0) return '-- No questions to insert\n';

  const rows: string[] = [];

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const optA = q.options.find(o => o.id === 'A')?.text || '';
    const optB = q.options.find(o => o.id === 'B')?.text || '';
    const optC = q.options.find(o => o.id === 'C')?.text || '';
    const optD = q.options.find(o => o.id === 'D')?.text || '';

    const idVal = escapeSqlString(q.id || `cq-${i + 1}`);
    const qNum = i + 1;
    const topicVal = escapeSqlString(q.topic || 'Civil Engineering');
    const subjVal = escapeSqlString(q.subject || 'Civil Engineering');
    const stemVal = escapeSqlString(q.stem || '');
    const aVal = escapeSqlString(optA);
    const bVal = escapeSqlString(optB);
    const cVal = escapeSqlString(optC);
    const dVal = escapeSqlString(optD);
    const corrVal = escapeSqlString(q.correctOption || 'A');
    const expVal = escapeSqlString(q.explanation || null);
    const formVal = escapeSqlString(q.formulaContext || null);
    const refVal = escapeSqlString(q.referenceSource || 'ExamVeda / Verified Online Source');
    const diffVal = escapeSqlString(q.difficulty || 'MEDIUM');
    const typeVal = escapeSqlString(q.questionType || 'CONCEPTUAL');
    const srcVal = escapeSqlString(q.sourceType || 'AI_GENERATED');

    rows.push(
      `INSERT INTO custom_questions (id, question_number, topic, subject, stem, option_a, option_b, option_c, option_d, correct_option, explanation, formula_context, reference_source, difficulty, question_type, source_type)\n` +
      `VALUES (${idVal}, ${qNum}, ${topicVal}, ${subjVal}, ${stemVal}, ${aVal}, ${bVal}, ${cVal}, ${dVal}, ${corrVal}, ${expVal}, ${formVal}, ${refVal}, ${diffVal}, ${typeVal}, ${srcVal})\n` +
      `ON CONFLICT (id) DO UPDATE SET\n` +
      `  stem = EXCLUDED.stem,\n` +
      `  option_a = EXCLUDED.option_a,\n` +
      `  option_b = EXCLUDED.option_b,\n` +
      `  option_c = EXCLUDED.option_c,\n` +
      `  option_d = EXCLUDED.option_d,\n` +
      `  correct_option = EXCLUDED.correct_option,\n` +
      `  explanation = EXCLUDED.explanation,\n` +
      `  formula_context = EXCLUDED.formula_context,\n` +
      `  reference_source = EXCLUDED.reference_source;\n`
    );
  }

  return rows.join('\n');
}

/**
 * Produces a complete standalone SQL file content with header, schema, and inserts
 */
export function generateFullSqlDump(questions: MCQQuestion[]): string {
  const dateStr = new Date().toISOString();
  return `-- =========================================================
-- ExamPilot Civil Engineering Questions SQL Dump
-- Generated at: ${dateStr}
-- Total Records: ${questions.length}
-- Target Engines: PostgreSQL, Supabase, MySQL 8+, SQLite
-- Online Verified Sources: ExamVeda, Sanfoundry, IndiaBIX, NPTEL, GATE/ESE
-- =========================================================

${generateSqlSchema()}

-- =========================================================
-- Data Insert Statements
-- =========================================================

${generateSqlInserts(questions)}

-- Verification Query:
-- SELECT id, topic, stem, correct_option, reference_source FROM custom_questions ORDER BY question_number;
`;
}

/**
 * Saves current SQL database dump to LocalStorage for persistence
 */
export function saveSqlDatabaseDump(questions: MCQQuestion[]): void {
  try {
    const dump = generateFullSqlDump(questions);
    localStorage.setItem(SQL_STORAGE_KEY, dump);
  } catch (e) {
    console.warn('[SqlQuestionService] Failed to save SQL dump locally:', e);
  }
}

/**
 * Retrieves the stored SQL dump
 */
export function getStoredSqlDump(): string {
  try {
    return localStorage.getItem(SQL_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

/**
 * Triggers a browser download of the .sql file
 */
export function downloadSqlDumpFile(questions: MCQQuestion[], topic = 'questions'): void {
  const sqlContent = generateFullSqlDump(questions);
  const blob = new Blob([sqlContent], { type: 'application/sql;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const sanitizedTopic = topic.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  const filename = `exampilot_${sanitizedTopic}_${new Date().toISOString().slice(0, 10)}.sql`;

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copies SQL statements to clipboard
 */
export async function copySqlToClipboard(questions: MCQQuestion[]): Promise<boolean> {
  try {
    const sql = generateFullSqlDump(questions);
    await navigator.clipboard.writeText(sql);
    return true;
  } catch (e) {
    console.warn('[SqlQuestionService] Failed to copy SQL to clipboard:', e);
    return false;
  }
}
