import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, Users, Database, Layers, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { getMasterQuestionPool } from '@/services/adminMockMakerService';
import { getAllStudentProfilesWithScores, StudentProfileSummary } from '@/services/studentTelemetryService';
import { getAllCombinedMockTests } from '@/services/adminPaperService';
import { MOCK_TESTS } from '@/data/mockData';
import { MCQQuestion, MockTest } from '@/types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: string, payload?: any) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [students, setStudents] = useState<StudentProfileSummary[]>([]);
  const [mockTests, setMockTests] = useState<MockTest[]>([]);

  useEffect(() => {
    if (isOpen) {
      setQuestions(getMasterQuestionPool());
      getAllStudentProfilesWithScores().then(setStudents).catch(() => {});
      setMockTests(getAllCombinedMockTests(MOCK_TESTS));
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard shortcut ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase().trim();

    const matchingStudents = students.filter(
      (s) =>
        s.displayName?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.uid?.toLowerCase().includes(q)
    ).slice(0, 5);

    const matchingTests = mockTests.filter(
      (m) =>
        m.title?.toLowerCase().includes(q) ||
        m.paperName?.toLowerCase().includes(q) ||
        m.examId?.toLowerCase().includes(q)
    ).slice(0, 5);

    const matchingQuestions = questions.filter(
      (item) =>
        item.stem?.toLowerCase().includes(q) ||
        item.id?.toLowerCase().includes(q) ||
        item.subject?.toLowerCase().includes(q) ||
        item.topic?.toLowerCase().includes(q)
    ).slice(0, 6);

    return {
      students: matchingStudents,
      tests: matchingTests,
      questions: matchingQuestions,
      totalCount: matchingStudents.length + matchingTests.length + matchingQuestions.length
    };
  }, [query, students, mockTests, questions]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl bg-card border border-line shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-scaleIn">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-line bg-surface">
          <Search className="w-5 h-5 text-primary flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions, students, mock tests, topics... (ESC to close)"
            className="w-full bg-transparent text-sm text-ink placeholder:text-muted-faint focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-muted hover:text-ink transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-4 space-y-5 divide-y divide-line/60">
          {!results && (
            <div className="py-12 text-center space-y-2 text-muted">
              <Search className="w-8 h-8 text-muted-faint mx-auto" />
              <p className="text-xs font-semibold text-ink">Type to search across ExamPilot</p>
              <p className="text-[11px] text-muted-faint">
                Quick jump to candidates, question stems, subjects, or CBT test suites.
              </p>
            </div>
          )}

          {results && results.totalCount === 0 && (
            <div className="py-12 text-center space-y-2 text-muted">
              <p className="text-xs font-semibold text-ink">No matching results found for "{query}"</p>
              <p className="text-[11px] text-muted-faint">Try checking spelling or search with fewer keywords.</p>
            </div>
          )}

          {/* Students Group */}
          {results && results.students.length > 0 && (
            <div className="space-y-2 pt-2 first:pt-0">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted uppercase tracking-wider">
                <Users className="w-3.5 h-3.5 text-primary" />
                <span>Students & Aspirants ({results.students.length})</span>
              </div>
              <div className="space-y-1">
                {results.students.map((std) => (
                  <button
                    key={std.uid}
                    onClick={() => {
                      onClose();
                      onNavigate('students', { selectedStudentUid: std.uid });
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-subtle transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {std.displayName?.charAt(0).toUpperCase() || 'S'}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-ink group-hover:text-primary transition truncate">
                          {std.displayName}
                        </div>
                        <div className="text-[11px] text-muted truncate">{std.email} · {std.targetExam}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-muted group-hover:text-primary group-hover:translate-x-0.5 transition flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mock Tests Group */}
          {results && results.tests.length > 0 && (
            <div className="space-y-2 pt-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                <span>Mock Tests ({results.tests.length})</span>
              </div>
              <div className="space-y-1">
                {results.tests.map((test) => (
                  <button
                    key={test.id}
                    onClick={() => {
                      onClose();
                      onNavigate('mock-tests', { selectedMockId: test.id });
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-subtle transition flex items-center justify-between group"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="text-xs font-semibold text-ink group-hover:text-primary transition truncate">
                        {test.title}
                      </div>
                      <div className="text-[11px] text-muted truncate">
                        {test.durationMinutes}m · {test.sections.reduce((acc, s) => acc + s.questions.length, 0)} MCQs · {test.totalMarks} Marks
                      </div>
                    </div>
                    <Badge size="sm" tone="neutral">Test</Badge>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Questions Group */}
          {results && results.questions.length > 0 && (
            <div className="space-y-2 pt-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted uppercase tracking-wider">
                <Database className="w-3.5 h-3.5 text-success" />
                <span>Question Bank ({results.questions.length})</span>
              </div>
              <div className="space-y-1">
                {results.questions.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      onClose();
                      onNavigate('question-bank', { questionId: q.id });
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-subtle transition flex items-center justify-between group"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="text-xs text-ink group-hover:text-primary transition line-clamp-1">
                        {q.stem}
                      </div>
                      <div className="text-[10px] text-muted-faint mt-0.5">
                        {q.subject} · {q.topic} · <span className="font-mono">{q.id}</span>
                      </div>
                    </div>
                    <Badge size="sm" tone={q.difficulty === 'HARD' ? 'danger' : q.difficulty === 'MEDIUM' ? 'warning' : 'success'}>
                      {q.difficulty}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-line bg-subtle/50 text-[10px] text-muted flex items-center justify-between">
          <span>Search questions, candidates & tests</span>
          <span className="font-mono">Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
