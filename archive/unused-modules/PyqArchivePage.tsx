import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { PYQ_PAPERS } from '../data/mockData';
import { getAllCombinedPapers } from '../services/adminPaperService';
import {
  Archive,
  Calendar,
  Filter,
  CheckCircle2,
  ChevronRight,
  Flame,
  Download,
  BookOpen,
  ArrowRight,
  Search,
  Layers
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ShareButton } from '../components/ui/ShareButton';

export const PyqArchivePage: React.FC<{ onStartPyqPractice: (paper?: typeof PYQ_PAPERS[0]) => void }> = ({
  onStartPyqPractice
}) => {
  const { user } = useAuth();
  const [papers, setPapers] = useState(() => getAllCombinedPapers(PYQ_PAPERS));
  const [selectedPaperId, setSelectedPaperId] = useState<string>(() => papers[0]?.id || PYQ_PAPERS[0].id);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');

  useEffect(() => {
    const handleUpdate = () => {
      const updated = getAllCombinedPapers(PYQ_PAPERS);
      setPapers(updated);
    };
    window.addEventListener('exampilot_papers_updated', handleUpdate);
    return () => window.removeEventListener('exampilot_papers_updated', handleUpdate);
  }, []);

  const currentPaper = papers.find((p) => p.id === selectedPaperId) || papers[0] || PYQ_PAPERS[0];

  const subjects = ['ALL', ...Array.from(new Set(currentPaper.questions.map((q) => q.subject)))];

  const filteredQuestions = currentPaper.questions.filter((q) => {
    const matchesSubject = selectedSubject === 'ALL' || q.subject === selectedSubject;
    const matchesSearch =
      q.stem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">
      {/* Top Banner */}
      <Card flush className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary font-bold text-[10px] uppercase tracking-wider">
              {papers.reduce((n, p) => n + p.totalQuestions, 0)} Verified Question Bank
            </span>
            <span className="text-xs text-muted-faint">•</span>
            <span className="text-xs text-muted font-medium">{user?.preferences.examName}</span>
          </div>
          <h1 className="font-display font-bold text-xl sm:text-2xl text-ink">
            Previous Year Question (PYQ) Repository
          </h1>
          <p className="text-xs text-muted mt-1">
            Browse complete 100-question papers for Assam DWR 2026, Civil Engineering (Paper II), and General Studies (Paper I) with official answer keys.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <ShareButton label="Share PYQ" size="sm" variant="outline" />
          <Button onClick={() => onStartPyqPractice(currentPaper)} iconRight={<ArrowRight className="w-4 h-4" />} className="shadow-md shadow-primary/20">
            Practice 100 Q Drill
          </Button>
        </div>
      </Card>

      {/* Paper Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {papers.map((paper) => {
          const isSelected = selectedPaperId === paper.id;
          return (
            <button
              key={paper.id}
              onClick={() => {
                setSelectedPaperId(paper.id);
                setExpandedQuestionId(null);
                setSelectedSubject('ALL');
              }}
              className={`p-4 rounded-xl border-2 text-left transition ${
                isSelected
                  ? 'border-primary bg-primary-fixed shadow-2xs'
                  : 'border-line hover:border-line-strong bg-card'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-sm text-ink">{paper.year} Paper</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-primary" />}
              </div>
              <p className="text-xs text-ink font-semibold mt-1 truncate">{paper.examName}</p>
              <p className="text-[11px] text-muted truncate">{paper.paperType}</p>
              <div className="flex items-center gap-1 text-[10px] text-primary font-bold mt-2">
                <Flame className="w-3 h-3 text-warning-text" />
                <span>{paper.totalQuestions} Questions</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Frequency Heatmap Callout */}
      <Card flush className="p-5 space-y-3">
        <h3 className="font-display font-semibold text-xs text-ink uppercase tracking-wider flex items-center gap-2">
          <Flame className="w-4 h-4 text-warning-text" />
          <span>{currentPaper.year} Exam Topic Weightage Distribution</span>
        </h3>
        <div className="flex flex-wrap gap-2 pt-1">
          {currentPaper.frequencyTags.map((tag, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 rounded-xl bg-subtle border border-line text-ink-soft text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </Card>

      {/* Filter & Search Bar */}
      <Card flush className="p-4 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-muted-faint absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search within this paper (e.g. Limit State, Article 21, Terzaghi, Bernoulli)..."
            className="w-full h-9 pl-9 pr-3 rounded-xl border border-line text-xs text-ink placeholder-muted-faint focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
          />
        </div>

        {/* Subject Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1 rounded-lg whitespace-nowrap font-medium transition ${
                selectedSubject === sub
                  ? 'bg-primary text-white font-semibold'
                  : 'bg-subtle-strong text-ink-soft hover:bg-line'
              }`}
            >
              {sub === 'ALL' ? 'All Subjects' : sub}
            </button>
          ))}
        </div>
      </Card>

      {/* Questions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>Showing {filteredQuestions.length} of {currentPaper.questions.length} questions</span>
          <span>Verified per Official Key & Standards</span>
        </div>

        <div className="space-y-3">
          {filteredQuestions.map((q) => {
            const isExpanded = expandedQuestionId === q.id;
            return (
              <Card flush className="p-5 space-y-3 transition" key={q.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded bg-primary-fixed text-primary font-mono text-[10px] font-bold">
                        Q.{q.questionNumber}
                      </span>
                      <span className="font-semibold text-ink-soft">{q.subject}</span>
                      <span className="text-muted-faint">•</span>
                      <span className="text-muted">{q.topic}</span>
                    </div>
                    <p className="font-display font-medium text-sm text-ink leading-relaxed pt-1">
                      {q.stem}
                    </p>
                  </div>

                  <button
                    onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                    className="px-3 py-1.5 rounded-lg border border-line hover:bg-subtle text-xs font-semibold text-primary flex items-center gap-1 flex-shrink-0"
                  >
                    <span>{isExpanded ? 'Hide Solution' : 'View Key'}</span>
                  </button>
                </div>

                {/* Expanded Solution */}
                {isExpanded && (
                  <div className="p-4 rounded-xl bg-subtle border border-line space-y-3 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt) => (
                        <div
                          key={opt.id}
                          className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                            opt.id === q.correctOption
                              ? 'bg-success-surface border-success-border text-success-text font-semibold'
                              : 'bg-card border-line text-ink-soft'
                          }`}
                        >
                          <span className="w-5 h-5 rounded font-mono font-bold text-center leading-5 text-[11px] bg-subtle-strong">
                            {opt.id}
                          </span>
                          <span>{opt.text}</span>
                        </div>
                      ))}
                    </div>

                    <div className="text-xs text-ink-soft whitespace-pre-line leading-relaxed pt-2 border-t border-line">
                      <strong>Official Explanation:</strong> {q.explanation}
                    </div>

                    {q.formulaContext && (
                      <div className="p-2.5 rounded bg-card border border-line text-xs font-mono text-ink">
                        Formula / Law: <strong>{q.formulaContext}</strong>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
