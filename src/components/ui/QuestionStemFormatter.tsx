import React from 'react';
import { Columns, CheckCircle2, ListChecks, HelpCircle } from 'lucide-react';

export interface QuestionStemFormatterProps {
  stem: string;
  compact?: boolean;
  className?: string;
}

export interface MatchPair {
  leftId: string;
  leftText: string;
  rightId: string;
  rightText: string;
}

export interface ParsedMatchQuestion {
  instruction: string;
  col1Header: string;
  col2Header: string;
  pairs: MatchPair[];
  promptText: string;
}

export interface ParsedMarkdownTable {
  headers: string[];
  rows: string[][];
  beforeText?: string;
  afterText?: string;
}

export interface ParsedStatement {
  label: string;
  text: string;
}

export interface ParsedStatementQuestion {
  introLines: string[];
  statements: ParsedStatement[];
  promptText: string;
}

/**
 * Robust parser for "Match the following" question patterns.
 * Supports:
 * - Multiline two-column format (e.g. "a. Item    1. Item")
 * - Sequential list format (List-I ... List-II ...)
 * - Flattened inline format (e.g. "a. Item 1. Item b. Item 2. Item")
 */
export function parseMatchQuestion(stem: string): ParsedMatchQuestion | null {
  if (!stem || typeof stem !== 'string') return null;
  if (!/match/i.test(stem)) return null;

  let text = stem.trim();

  // 1. Extract trailing code prompt (e.g. "Select the correct answer using the codes given below:")
  let promptText = '';
  const promptRegex = /(?:Select\s+the\s+correct\s+(?:answer|code)|Choose\s+the\s+correct\s+code|Using\s+the\s+codes?\s+given\s+below|Codes\s*:)[\s\S]*$/i;
  const promptMatch = text.match(promptRegex);
  if (promptMatch && promptMatch.index !== undefined) {
    promptText = promptMatch[0].trim();
    text = text.slice(0, promptMatch.index).trim();
  }

  // 2. Extract leading instruction
  let instruction = '';
  const introMatch = text.match(/^(Match\s+the\s+following[^\n:]*[:\n]|Match\s+List[^\n:]*[:\n])/i);
  if (introMatch) {
    instruction = introMatch[0].replace(/[:\n]+$/, '').trim();
    text = text.slice(introMatch[0].length).trim();
  } else if (/^Match/i.test(text)) {
    const colonIdx = text.indexOf(':');
    if (colonIdx !== -1 && colonIdx < 120) {
      instruction = text.slice(0, colonIdx).trim();
      text = text.slice(colonIdx + 1).trim();
    }
  }

  // 3. Extract Column / List headers if present on top
  let col1Header = 'List I';
  let col2Header = 'List II';

  const colHeaderMatch = text.match(/^(Column[- ]?I|List[- ]?I(?:\s*\([^)]*\))?)\s{2,}(Column[- ]?II|List[- ]?II(?:\s*\([^)]*\))?)/i);
  if (colHeaderMatch) {
    col1Header = colHeaderMatch[1].trim();
    col2Header = colHeaderMatch[2].trim();
    text = text.slice(colHeaderMatch[0].length).trim();
  }

  // 4. Pattern A: Sequential lists (List-I ... List-II ...)
  const list1Match = text.match(/(?:List[- ]?I|Column[- ]?I)(?:\s*\([^)]*\))?[\s:]+([\s\S]*?)(?=(?:List[- ]?II|Column[- ]?II))/i);
  const list2Match = text.match(/(?:List[- ]?II|Column[- ]?II)(?:\s*\([^)]*\))?[\s:]+([\s\S]*)$/i);
  if (list1Match && list2Match) {
    const l1Items = list1Match[1].trim().split('\n').map((l) => l.trim()).filter(Boolean);
    const l2Items = list2Match[1].trim().split('\n').map((l) => l.trim()).filter(Boolean);

    if (l1Items.length >= 2 && l2Items.length >= 2) {
      const maxRows = Math.min(l1Items.length, l2Items.length);
      const seqPairs: MatchPair[] = [];
      for (let i = 0; i < maxRows; i++) {
        const m1 = l1Items[i].match(/^([a-eA-E]|\([a-eA-E]\))[.)]?\s*(.*)$/);
        const m2 = l2Items[i].match(/^([1-5]|[ivxLCDM]+|\([1-5ivx]+\))[.)]?\s*(.*)$/i);
        seqPairs.push({
          leftId: m1 ? m1[1].replace(/[().]/g, '').trim() : String.fromCharCode(97 + i),
          leftText: m1 ? m1[2].trim() : l1Items[i],
          rightId: m2 ? m2[1].replace(/[().]/g, '').trim() : String(i + 1),
          rightText: m2 ? m2[2].trim() : l2Items[i]
        });
      }
      return {
        instruction: instruction || 'Match the following:',
        col1Header,
        col2Header,
        pairs: seqPairs,
        promptText
      };
    }
  }

  // 5. Pattern B: Newline-separated lines where each line has both left & right
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const linePairs: MatchPair[] = [];

  for (const line of lines) {
    const headerLine = line.match(/^(Column[- ]?I|List[- ]?I(?:\s*\([^)]*\))?)\s{2,}(Column[- ]?II|List[- ]?II(?:\s*\([^)]*\))?)$/i);
    if (headerLine) {
      col1Header = headerLine[1].trim();
      col2Header = headerLine[2].trim();
      continue;
    }

    const m = line.match(/^([a-eA-E]|\([a-eA-E]\))[.)]?\s+(.*?)\s{2,}([1-5]|[ivxLCDM]+|\([1-5ivx]+\))[.)]?\s+(.*)$/i);
    if (m) {
      linePairs.push({
        leftId: m[1].replace(/[().]/g, '').trim(),
        leftText: m[2].trim(),
        rightId: m[3].replace(/[().]/g, '').trim(),
        rightText: m[4].trim()
      });
    } else {
      const mRelaxed = line.match(/^([a-eA-E]|\([a-eA-E]\))[.)]?\s+(.*?)\s+([1-5]|\([1-5]\))[.)]\s+(.*)$/);
      if (mRelaxed) {
        linePairs.push({
          leftId: mRelaxed[1].replace(/[().]/g, '').trim(),
          leftText: mRelaxed[2].trim(),
          rightId: mRelaxed[3].replace(/[().]/g, '').trim(),
          rightText: mRelaxed[4].trim()
        });
      }
    }
  }

  if (linePairs.length >= 2) {
    return {
      instruction: instruction || 'Match the following:',
      col1Header,
      col2Header,
      pairs: linePairs,
      promptText
    };
  }

  // 6. Pattern C: Inline flattened string (e.g. from OCR single-line output)
  const rowRegex = /(?:^|\s+)([a-eA-E]|\([a-eA-E]\))[.)]\s+/g;
  const splits: { label: string; content: string }[] = [];
  let m: RegExpExecArray | null;
  let lastIdx = 0;
  let lastLabel = '';

  while ((m = rowRegex.exec(text)) !== null) {
    if (lastLabel) {
      splits.push({ label: lastLabel, content: text.slice(lastIdx, m.index).trim() });
    }
    lastLabel = m[1].replace(/[().]/g, '');
    lastIdx = rowRegex.lastIndex;
  }
  if (lastLabel) {
    splits.push({ label: lastLabel, content: text.slice(lastIdx).trim() });
  }

  if (splits.length >= 2) {
    const inlinePairs: MatchPair[] = [];
    for (const s of splits) {
      const numMatch = s.content.match(/\s+([1-5]|[ivxLCDM]+|\([1-5ivx]+\))[.)]?\s+/i);
      if (numMatch && numMatch.index !== undefined) {
        inlinePairs.push({
          leftId: s.label,
          leftText: s.content.slice(0, numMatch.index).trim(),
          rightId: numMatch[1].replace(/[().]/g, '').trim(),
          rightText: s.content.slice(numMatch.index + numMatch[0].length).trim()
        });
      }
    }

    if (inlinePairs.length >= 2) {
      return {
        instruction: instruction || 'Match the following:',
        col1Header,
        col2Header,
        pairs: inlinePairs,
        promptText
      };
    }
  }

  return null;
}

/**
 * Parser for markdown tables embedded in question stems
 */
export function parseMarkdownTable(stem: string): ParsedMarkdownTable | null {
  if (!stem.includes('|')) return null;

  const lines = stem.split('\n');
  const tableLineIndices: number[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      tableLineIndices.push(i);
    }
  }

  if (tableLineIndices.length < 3) return null; // Needs header, separator, at least 1 row

  // Verify contiguous table lines
  const startIdx = tableLineIndices[0];
  const endIdx = tableLineIndices[tableLineIndices.length - 1];
  if (endIdx - startIdx + 1 !== tableLineIndices.length) return null;

  const tableLines = lines.slice(startIdx, endIdx + 1);
  const headerLine = tableLines[0];
  const sepLine = tableLines[1];

  if (!sepLine.includes('---')) return null;

  const headers = headerLine
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean);

  const rows: string[][] = [];
  for (let i = 2; i < tableLines.length; i++) {
    const cells = tableLines[i]
      .split('|')
      .map((s) => s.trim())
      .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
    if (cells.length > 0) {
      rows.push(cells);
    }
  }

  if (rows.length === 0) return null;

  const beforeText = lines.slice(0, startIdx).join('\n').trim();
  const afterText = lines.slice(endIdx + 1).join('\n').trim();

  return {
    headers,
    rows,
    beforeText: beforeText || undefined,
    afterText: afterText || undefined
  };
}

/**
 * Parser for Statement-based questions
 */
export function parseStatementQuestion(stem: string): ParsedStatementQuestion | null {
  const isStatement = /Statement\s*(?:[1-5]|[IVXLCDM]+|\([1-5IVXLCDM]+\))|\bStatement\s*1\b/i.test(stem) ||
    (/Consider\s+the\s+following\s+statements/i.test(stem) && /\b(?:1|2|\(i\)|\(ii\))\./i.test(stem));

  if (!isStatement) return null;

  const lines = stem.split('\n').map((l) => l.trim()).filter(Boolean);
  const introLines: string[] = [];
  const statements: ParsedStatement[] = [];
  let promptText = '';

  for (const line of lines) {
    const stmtMatch = line.match(/^(Statement\s*\d+|Statement\s*\([IVXLCDM]+\)|\d+\.|\([IVXLCDM]+\))\s*[:\.]?\s*(.*)$/i);
    const promptMatch = line.match(/^(Which\s+(?:of\s+the\s+above|one\s+of\s+the\s+following|of\s+the\s+statements|of\s+these).+)/i);

    if (stmtMatch) {
      statements.push({
        label: stmtMatch[1].replace(/\.$/, ''),
        text: stmtMatch[2]
      });
    } else if (promptMatch) {
      promptText = promptMatch[1];
    } else if (statements.length === 0) {
      introLines.push(line);
    } else {
      if (statements.length > 0 && !promptText) {
        statements[statements.length - 1].text += ' ' + line;
      } else {
        promptText = promptText ? promptText + ' ' + line : line;
      }
    }
  }

  if (statements.length >= 2) {
    return {
      introLines,
      statements,
      promptText
    };
  }

  return null;
}

/**
 * Universal Question Stem Formatter Component
 * - Automatically renders "Match the following" questions into beautiful, responsive comparison tables.
 * - Formats markdown tables with clean Tailwind data tables.
 * - Formats Statement-based questions with distinct statement cards.
 * - Preserves multiline paragraphs and clean typography for standard stems.
 */
export const QuestionStemFormatter: React.FC<QuestionStemFormatterProps> = ({
  stem,
  compact = false,
  className = ''
}) => {
  if (!stem) return null;

  // 1. Check for "Match the following"
  const matchData = parseMatchQuestion(stem);
  if (matchData) {
    return (
      <div className={`space-y-3 text-left ${className}`}>
        {/* Instruction Line */}
        <div className="flex items-center gap-2">
          <Columns className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
          <p className={`font-semibold text-ink ${compact ? 'text-xs' : 'text-sm sm:text-base'}`}>
            {matchData.instruction}
          </p>
        </div>

        {/* Tabular Comparison Grid */}
        <div className="overflow-hidden rounded-xl border border-line bg-card shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line bg-subtle text-muted uppercase font-bold text-[10px] sm:text-[11px] tracking-wider">
                <th className="py-2.5 px-3 sm:px-4 w-1/2 border-r border-line">
                  {matchData.col1Header}
                </th>
                <th className="py-2.5 px-3 sm:px-4 w-1/2">
                  {matchData.col2Header}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {matchData.pairs.map((p, idx) => (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    idx % 2 === 0 ? 'bg-card' : 'bg-surface/50'
                  } hover:bg-subtle/40`}
                >
                  {/* Left item */}
                  <td className="py-2.5 px-3 sm:px-4 border-r border-line align-middle">
                    <div className="flex items-center gap-2.5">
                      <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-mono font-bold text-xs flex items-center justify-center">
                        {p.leftId}
                      </span>
                      <span className={`text-ink font-medium leading-relaxed ${compact ? 'text-xs' : 'text-xs sm:text-sm'}`}>
                        {p.leftText}
                      </span>
                    </div>
                  </td>

                  {/* Right item */}
                  <td className="py-2.5 px-3 sm:px-4 align-middle">
                    <div className="flex items-center gap-2.5">
                      <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-mono font-bold text-xs flex items-center justify-center">
                        {p.rightId}
                      </span>
                      <span className={`text-ink font-medium leading-relaxed ${compact ? 'text-xs' : 'text-xs sm:text-sm'}`}>
                        {p.rightText}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Closing Code Prompt */}
        {matchData.promptText && (
          <div className="flex items-center gap-2 text-xs font-semibold text-primary dark:text-primary-fixed pt-1">
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{matchData.promptText}</span>
          </div>
        )}
      </div>
    );
  }

  // 2. Check for Markdown Tables
  const mdTable = parseMarkdownTable(stem);
  if (mdTable) {
    return (
      <div className={`space-y-3 text-left ${className}`}>
        {mdTable.beforeText && (
          <p className={`font-medium text-ink leading-relaxed whitespace-pre-line ${compact ? 'text-xs' : 'text-sm sm:text-base'}`}>
            {mdTable.beforeText}
          </p>
        )}

        <div className="overflow-hidden rounded-xl border border-line bg-card shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line bg-subtle text-muted uppercase font-bold text-[10px] sm:text-[11px] tracking-wider">
                {mdTable.headers.map((h, i) => (
                  <th key={i} className="py-2.5 px-3 sm:px-4 border-r border-line last:border-r-0">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {mdTable.rows.map((row, rIdx) => (
                <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-card' : 'bg-surface/50'}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className={`py-2 px-3 sm:px-4 border-r border-line last:border-r-0 text-ink font-medium ${compact ? 'text-xs' : 'text-xs sm:text-sm'}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {mdTable.afterText && (
          <p className={`font-semibold text-primary dark:text-primary-fixed leading-relaxed pt-1 ${compact ? 'text-xs' : 'text-xs sm:text-sm'}`}>
            {mdTable.afterText}
          </p>
        )}
      </div>
    );
  }

  // 3. Check for Statement Questions
  const stmtData = parseStatementQuestion(stem);
  if (stmtData) {
    return (
      <div className={`space-y-3 text-left ${className}`}>
        {stmtData.introLines.length > 0 && (
          <p className={`font-medium text-ink leading-relaxed ${compact ? 'text-xs' : 'text-sm sm:text-base'}`}>
            {stmtData.introLines.join(' ')}
          </p>
        )}

        <div className={`space-y-2 ${compact ? 'my-2' : 'my-3'}`}>
          {stmtData.statements.map((st, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 dark:bg-primary/10 transition-colors shadow-2xs ${
                compact ? 'p-2 text-xs' : 'p-3 sm:p-3.5 text-xs sm:text-sm'
              }`}
            >
              <span className="flex-shrink-0 rounded-md bg-primary px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-white shadow-xs">
                {st.label}
              </span>
              <span className="text-ink leading-relaxed flex-1 font-normal pt-0.5">
                {st.text}
              </span>
            </div>
          ))}
        </div>

        {stmtData.promptText && (
          <div className={`font-semibold text-primary dark:text-primary-fixed leading-relaxed pt-0.5 ${compact ? 'text-xs' : 'text-xs sm:text-sm'}`}>
            {stmtData.promptText}
          </div>
        )}
      </div>
    );
  }

  // 4. Default: Standard question with clean multiline spacing
  return (
    <p className={`font-medium text-ink leading-relaxed whitespace-pre-line text-left ${compact ? 'text-xs' : 'text-sm sm:text-base'} ${className}`}>
      {stem}
    </p>
  );
};

export default QuestionStemFormatter;
