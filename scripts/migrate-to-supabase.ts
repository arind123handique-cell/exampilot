/**
 * ExamPilot Supabase Migration Script
 *
 * Extracts all curated questions, official paper MCQs, answers, and explanations
 * across all branches and modules, generates SQL/JSON dumps, and bulk-uploads
 * them to Supabase PostgreSQL.
 *
 * Usage:
 *   npx tsx scripts/migrate-to-supabase.ts [--dry-run] [--upload]
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import {
  ALL_QUESTIONS,
  CIVIL_ENGINEERING_QUESTIONS,
  GENERAL_STUDIES_QUESTIONS,
  MOCK_TESTS
} from '../src/data/mockData';
import { MCQQuestion } from '../src/types';

// Collect questions from all mock test sections as well (to capture any section-specific questions)
const sectionQuestions: MCQQuestion[] = [];
for (const mock of MOCK_TESTS) {
  for (const sec of mock.sections) {
    if (Array.isArray(sec.questions)) {
      sectionQuestions.push(...sec.questions);
    }
  }
}

// Deduplicate questions by ID
const questionMap = new Map<string, MCQQuestion>();

[
  ...ALL_QUESTIONS,
  ...CIVIL_ENGINEERING_QUESTIONS,
  ...GENERAL_STUDIES_QUESTIONS,
  ...sectionQuestions
].forEach((q) => {
  if (q && q.id && q.stem) {
    questionMap.set(q.id, q);
  }
});

const allQuestions = Array.from(questionMap.values());

console.log('===============================================================');
console.log('          EXAMPILOT SUPABASE QUESTION MIGRATION                ');
console.log('===============================================================');
console.log(`Total unique questions found: ${allQuestions.length}`);

// Breakdown by subject
const subjectCounts: Record<string, number> = {};
for (const q of allQuestions) {
  const subj = q.subject || 'Uncategorized';
  subjectCounts[subj] = (subjectCounts[subj] || 0) + 1;
}

console.log('\nBreakdown by Subject:');
for (const [subj, count] of Object.entries(subjectCounts).sort((a, b) => b[1] - a[1])) {
  console.log(`  • ${subj}: ${count} questions`);
}

// Ensure dumps directory exists
const dumpDir = path.resolve(process.cwd(), 'supabase', 'dumps');
if (!fs.existsSync(dumpDir)) {
  fs.mkdirSync(dumpDir, { recursive: true });
}

// 1. Generate JSON dump
const jsonDumpPath = path.join(dumpDir, 'questions_dump.json');
fs.writeFileSync(jsonDumpPath, JSON.stringify(allQuestions, null, 2), 'utf-8');
console.log(`\n✓ Exported JSON dataset: ${jsonDumpPath} (${(fs.statSync(jsonDumpPath).size / 1024).toFixed(1)} KB)`);

// 2. Generate SQL INSERT dump
function escapeSql(str: any): string {
  if (str === null || str === undefined) return 'NULL';
  if (typeof str === 'object') return `'${JSON.stringify(str).replace(/'/g, "''")}'::jsonb`;
  const val = String(str).replace(/'/g, "''");
  return `'${val}'`;
}

const sqlLines: string[] = [];
sqlLines.push('-- =============================================================================');
sqlLines.push('-- ExamPilot Bulk Questions Seed Data');
sqlLines.push(`-- Generated: ${new Date().toISOString()}`);
sqlLines.push(`-- Total Records: ${allQuestions.length}`);
sqlLines.push('-- =============================================================================\n');

for (const q of allQuestions) {
  const optA = q.options?.find((o) => o.id === 'A')?.text || '';
  const optB = q.options?.find((o) => o.id === 'B')?.text || '';
  const optC = q.options?.find((o) => o.id === 'C')?.text || '';
  const optD = q.options?.find((o) => o.id === 'D')?.text || '';

  sqlLines.push(
    `INSERT INTO public.questions (` +
      `id, exam_id, question_number, subject, topic, subtopic, stem, options, ` +
      `option_a, option_b, option_c, option_d, correct_option, explanation, ` +
      `formula_context, solution_steps, reference_source, difficulty, question_type, source_type, pyq_year, pyq_exam` +
    `) VALUES (` +
      `${escapeSql(q.id)}, ` +
      `${escapeSql(q.examId || null)}, ` +
      `${q.questionNumber || 1}, ` +
      `${escapeSql(q.subject)}, ` +
      `${escapeSql(q.topic)}, ` +
      `${escapeSql(q.subtopic || null)}, ` +
      `${escapeSql(q.stem)}, ` +
      `${escapeSql(q.options || [])}, ` +
      `${escapeSql(optA)}, ` +
      `${escapeSql(optB)}, ` +
      `${escapeSql(optC)}, ` +
      `${escapeSql(optD)}, ` +
      `${escapeSql(q.correctOption || 'A')}, ` +
      `${escapeSql(q.explanation || '')}, ` +
      `${escapeSql(q.formulaContext || null)}, ` +
      `${escapeSql(q.solutionSteps || null)}, ` +
      `${escapeSql(q.referenceSource || null)}, ` +
      `${escapeSql(q.difficulty || 'MEDIUM')}, ` +
      `${escapeSql(q.questionType || 'CONCEPTUAL')}, ` +
      `${escapeSql(q.sourceType || 'OFFICIAL_EXAM')}, ` +
      `${q.pyqYear ? Number(q.pyqYear) : 'NULL'}, ` +
      `${escapeSql(q.pyqExam || null)}` +
    `) ON CONFLICT (id) DO UPDATE SET ` +
      `stem = EXCLUDED.stem, ` +
      `options = EXCLUDED.options, ` +
      `option_a = EXCLUDED.option_a, ` +
      `option_b = EXCLUDED.option_b, ` +
      `option_c = EXCLUDED.option_c, ` +
      `option_d = EXCLUDED.option_d, ` +
      `correct_option = EXCLUDED.correct_option, ` +
      `explanation = EXCLUDED.explanation, ` +
      `formula_context = EXCLUDED.formula_context, ` +
      `updated_at = NOW();`
  );
}

const sqlDumpPath = path.join(dumpDir, 'questions_inserts.sql');
fs.writeFileSync(sqlDumpPath, sqlLines.join('\n'), 'utf-8');
console.log(`✓ Exported SQL INSERT script: ${sqlDumpPath} (${(fs.statSync(sqlDumpPath).size / 1024).toFixed(1)} KB)`);

// 3. Check for Direct Supabase Upload
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (process.argv.includes('--upload') && supabaseUrl && supabaseKey) {
  console.log(`\nConnecting to Supabase at: ${supabaseUrl}`);
  const client = createClient(supabaseUrl, supabaseKey);

  async function uploadBatch() {
    const batchSize = 100;
    let uploadedCount = 0;

    for (let i = 0; i < allQuestions.length; i += batchSize) {
      const chunk = allQuestions.slice(i, i + batchSize).map((q) => {
        const optA = q.options?.find((o) => o.id === 'A')?.text || '';
        const optB = q.options?.find((o) => o.id === 'B')?.text || '';
        const optC = q.options?.find((o) => o.id === 'C')?.text || '';
        const optD = q.options?.find((o) => o.id === 'D')?.text || '';

        return {
          id: q.id,
          exam_id: q.examId || null,
          question_number: q.questionNumber || 1,
          subject: q.subject,
          topic: q.topic,
          subtopic: q.subtopic || null,
          stem: q.stem,
          options: q.options || [],
          option_a: optA,
          option_b: optB,
          option_c: optC,
          option_d: optD,
          correct_option: q.correctOption || 'A',
          explanation: q.explanation || '',
          formula_context: q.formulaContext || null,
          solution_steps: q.solutionSteps || null,
          reference_source: q.referenceSource || null,
          difficulty: q.difficulty || 'MEDIUM',
          question_type: q.questionType || 'CONCEPTUAL',
          source_type: q.sourceType || 'OFFICIAL_EXAM',
          pyq_year: q.pyqYear || null,
          pyq_exam: q.pyqExam || null,
          updated_at: new Date().toISOString()
        };
      });

      const { error } = await client.from('questions').upsert(chunk, { onConflict: 'id' });
      if (error) {
        console.error(`  ✗ Batch ${i + 1} - ${i + chunk.length} failed:`, error.message);
      } else {
        uploadedCount += chunk.length;
        console.log(`  ✓ Uploaded batch: ${uploadedCount} / ${allQuestions.length} records`);
      }
    }

    console.log(`\n✓ Upload complete! ${uploadedCount} questions saved to Supabase.`);

    // Upload Mock Tests to custom_mock_tests table
    console.log(`\nSyncing ${MOCK_TESTS.length} Mock Tests to custom_mock_tests table...`);
    const mockRows = MOCK_TESTS.map((m) => ({
      id: m.id,
      exam_id: m.examId || 'general',
      title: m.title,
      paper_name: m.paperName || m.title,
      duration_minutes: m.durationMinutes || 120,
      total_marks: m.totalMarks || 100,
      negative_marks_per_incorrect: m.negativeMarksPerIncorrect || 0.25,
      sections: m.sections || [],
      published_at: new Date().toISOString(),
      published_by: 'admin',
      source: 'official-blueprint'
    }));

    const { error: mockErr } = await client.from('custom_mock_tests').upsert(mockRows, { onConflict: 'id' });
    if (mockErr) {
      console.warn('  ✗ Failed to sync custom_mock_tests:', mockErr.message);
    } else {
      console.log(`  ✓ Synced ${mockRows.length} tests to custom_mock_tests table.`);
    }

    // Upload Papers to published_papers table
    console.log(`\nSyncing ${MOCK_TESTS.length} Papers to published_papers table...`);
    const paperRows = MOCK_TESTS.map((m) => ({
      id: m.id,
      exam_id: m.examId || 'general',
      exam_name: m.title,
      year: 2025,
      paper_type: m.paperName || 'Objective CBT Paper',
      total_questions: (m.sections || []).reduce((acc: number, s: any) => acc + (s.totalQuestions || s.questions?.length || 0), 0),
      download_available: true,
      frequency_tags: ['official', 'syllabus-blueprint'],
      questions: (m.sections || []).flatMap((s: any) => s.questions || []),
      published_at: new Date().toISOString(),
      published_by: 'admin',
      source: 'official-blueprint'
    }));

    const { error: paperErr } = await client.from('published_papers').upsert(paperRows, { onConflict: 'id' });
    if (paperErr) {
      console.warn('  ✗ Failed to sync published_papers:', paperErr.message);
    } else {
      console.log(`  ✓ Synced ${paperRows.length} papers to published_papers table.`);
    }
  }

  uploadBatch().catch((err) => {
    console.error('Upload failed:', err);
  });
} else {
  console.log('\n[Info] To upload directly via CLI:');
  console.log('  1. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env');
  console.log('  2. Run: npx tsx scripts/migrate-to-supabase.ts --upload');
  console.log('  Or copy and execute supabase/dumps/questions_inserts.sql in the Supabase SQL Editor.');
}
