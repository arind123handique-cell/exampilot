import React, { useState, useEffect, useMemo } from 'react';
import {
  Database,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Download,
  Upload,
  RefreshCw,
  Eye,
  CheckCircle2,
  X,
  FileCode,
  BookOpen,
  ChevronRight,
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ConfirmationModal } from '../ConfirmationModal';
import { getMasterQuestionPool } from '@/services/adminMockMakerService';
import { saveCustomQuestions } from '@/services/customQuestionDb';
import { CIVIL_SUBJECTS } from '@/services/universalTaxonomy';
import { MCQQuestion, MCQOption } from '@/types';
import { useToast } from '@/context/ToastContext';

export const QuestionBankSection: React.FC = () => {
  const { success: toastSuccess, error: toastError } = useToast();
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [selectedSourceType, setSelectedSourceType] = useState<string>('ALL');
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Modals
  const [inspectingQuestion, setInspectingQuestion] = useState<MCQQuestion | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<MCQQuestion | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<MCQQuestion | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');

  const loadData = () => {
    setLoading(true);
    try {
      const pool = getMasterQuestionPool();
      setQuestions(pool);
    } catch (err) {
      console.error('Failed to load questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Available subjects from taxonomy and database
  const availableSubjects = useMemo(() => {
    const subjects = new Set<string>();
    questions.forEach((q) => {
      if (q.subject) subjects.add(q.subject);
    });
    return Array.from(subjects).sort();
  }, [questions]);

  // Available topics for selected subject
  const availableTopics = useMemo(() => {
    if (selectedSubject === 'ALL') return [];
    const topics = new Set<string>();
    questions
      .filter((q) => q.subject === selectedSubject)
      .forEach((q) => {
        if (q.topic) topics.add(q.topic);
      });
    return Array.from(topics).sort();
  }, [questions, selectedSubject]);

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    let list = [...questions];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.stem?.toLowerCase().includes(q) ||
          item.id?.toLowerCase().includes(q) ||
          item.topic?.toLowerCase().includes(q) ||
          item.explanation?.toLowerCase().includes(q)
      );
    }

    if (selectedSubject !== 'ALL') {
      list = list.filter((item) => item.subject === selectedSubject);
    }

    if (selectedTopic !== 'ALL') {
      list = list.filter((item) => item.topic === selectedTopic);
    }

    if (selectedDifficulty !== 'ALL') {
      list = list.filter((item) => item.difficulty === selectedDifficulty);
    }

    if (selectedSourceType !== 'ALL') {
      list = list.filter((item) => (item.sourceType || 'PYQ') === selectedSourceType);
    }

    return list;
  }, [questions, searchQuery, selectedSubject, selectedTopic, selectedDifficulty, selectedSourceType]);

  const paginatedQuestions = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredQuestions.slice(startIndex, startIndex + pageSize);
  }, [filteredQuestions, page, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / pageSize));

  // Save / Update question
  const handleSaveQuestion = async (q: MCQQuestion) => {
    try {
      await saveCustomQuestions([q], 'admin');
      loadData();
      setEditingQuestion(null);
      setIsCreatingNew(false);
      toastSuccess('Question Saved', 'Question updated in database and synchronized.');
    } catch (err) {
      toastError('Save Error', 'Could not save question.');
    }
  };

  // Duplicate question
  const handleDuplicate = async (q: MCQQuestion) => {
    const copy: MCQQuestion = {
      ...q,
      id: `custom-q-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      stem: `${q.stem} (Variant)`
    };
    await saveCustomQuestions([copy], 'admin');
    loadData();
    toastSuccess('Question Duplicated', 'Variant created in question bank.');
  };

  // Delete question
  const handleDeleteConfirm = async () => {
    if (!questionToDelete) return;
    try {
      const raw = localStorage.getItem('exampilot_custom_questions_bank');
      if (raw) {
        const parsed = JSON.parse(raw);
        const filtered = parsed.filter((q: MCQQuestion) => q.id !== questionToDelete.id);
        localStorage.setItem('exampilot_custom_questions_bank', JSON.stringify(filtered));
      }
      setQuestions((prev) => prev.filter((q) => q.id !== questionToDelete.id));
      toastSuccess('Question Deleted', 'Removed from local question bank.');
    } catch {
      toastError('Delete Failed', 'Could not delete question.');
    } finally {
      setQuestionToDelete(null);
    }
  };

  // Bulk JSON Import
  const handleBulkImport = async () => {
    try {
      const parsed = JSON.parse(importJsonText);
      const items = Array.isArray(parsed) ? parsed : [parsed];

      const valid = items.filter(
        (it) => it && it.stem && it.options && it.correctOption
      ) as MCQQuestion[];

      if (valid.length === 0) {
        toastError('Validation Notice', 'No valid questions found in JSON payload.');
        return;
      }

      await saveCustomQuestions(valid, 'admin');
      loadData();
      setIsImportModalOpen(false);
      setImportJsonText('');
      toastSuccess('Bulk Import Success', `Imported ${valid.length} questions into Question Bank.`);
    } catch (err) {
      toastError('Invalid JSON', 'Please verify your JSON format and retry.');
    }
  };

  // Export JSON
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredQuestions, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `exampilot_questions_${selectedSubject.toLowerCase()}_${Date.now()}.json`);
    dlAnchorElem.click();
    toastSuccess('Export Complete', `Exported ${filteredQuestions.length} questions.`);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Action Toolbar */}
      <Card flush className="p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                placeholder="Search by question stem, topic, or keyword..."
                className="w-full h-9 pl-9 pr-3 rounded-xl border border-line bg-surface text-xs text-ink placeholder:text-muted-faint focus:border-primary focus:outline-none"
              />
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={loadData}
              title="Refresh questions from database"
              iconLeft={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
            >
              Sync
            </Button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              onClick={() => {
                setEditingQuestion({
                  id: `custom-q-${Date.now()}`,
                  questionNumber: questions.length + 1,
                  examId: 'apsc-ae-civil',
                  subject: selectedSubject !== 'ALL' ? selectedSubject : 'Strength of Materials',
                  topic: selectedTopic !== 'ALL' ? selectedTopic : 'Stress & Strain',
                  stem: '',
                  options: [
                    { id: 'A', text: '' },
                    { id: 'B', text: '' },
                    { id: 'C', text: '' },
                    { id: 'D', text: '' }
                  ],
                  correctOption: 'A',
                  explanation: '',
                  difficulty: 'MEDIUM',
                  sourceType: 'MODELLED'
                });
                setIsCreatingNew(true);
              }}
              iconLeft={<Plus className="w-3.5 h-3.5" />}
            >
              Add Question
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsImportModalOpen(true)}
              iconLeft={<Upload className="w-3.5 h-3.5" />}
            >
              Import JSON
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleExportJson}
              iconLeft={<Download className="w-3.5 h-3.5" />}
            >
              Export ({filteredQuestions.length})
            </Button>
          </div>
        </div>

        {/* Hierarchical Filters: Subject, Topic, Difficulty, Source */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-line/60 text-xs">
          {/* Subject Selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted uppercase">Subject Domain</label>
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setSelectedTopic('ALL');
                setPage(1);
              }}
              className="w-full h-8 px-2 rounded-lg border border-line bg-surface text-xs text-ink"
            >
              <option value="ALL">All Subjects ({questions.length})</option>
              {availableSubjects.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* Topic Selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted uppercase">Syllabus Topic</label>
            <select
              value={selectedTopic}
              disabled={selectedSubject === 'ALL' || availableTopics.length === 0}
              onChange={(e) => { setSelectedTopic(e.target.value); setPage(1); }}
              className="w-full h-8 px-2 rounded-lg border border-line bg-surface text-xs text-ink disabled:opacity-50"
            >
              <option value="ALL">All Topics in {selectedSubject}</option>
              {availableTopics.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted uppercase">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => { setSelectedDifficulty(e.target.value); setPage(1); }}
              className="w-full h-8 px-2 rounded-lg border border-line bg-surface text-xs text-ink"
            >
              <option value="ALL">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>

          {/* Source Provenance */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted uppercase">Provenance</label>
            <select
              value={selectedSourceType}
              onChange={(e) => { setSelectedSourceType(e.target.value); setPage(1); }}
              className="w-full h-8 px-2 rounded-lg border border-line bg-surface text-xs text-ink"
            >
              <option value="ALL">All Provenance</option>
              <option value="PYQ">Official PYQ Paper</option>
              <option value="MODELLED">Modelled Standard</option>
              <option value="AI_GENERATED">AI Synthesized</option>
              <option value="TEMPLATE_GENERATED">Template Recipe</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Questions Roster Table */}
      <Card flush className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-line bg-subtle/50 text-[10px] font-bold text-muted uppercase tracking-wider">
                <th className="py-3 px-4 w-12">#</th>
                <th className="py-3 px-3">Question Stem</th>
                <th className="py-3 px-3">Subject / Topic</th>
                <th className="py-3 px-3">Key</th>
                <th className="py-3 px-3">Difficulty</th>
                <th className="py-3 px-3">Provenance</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted">
                    <RefreshCw className="w-6 h-6 text-primary animate-spin mx-auto mb-2" />
                    <p className="text-xs font-semibold">Loading question bank...</p>
                  </td>
                </tr>
              ) : paginatedQuestions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted">
                    <Database className="w-8 h-8 text-muted-faint mx-auto mb-2" />
                    <p className="text-xs font-semibold text-ink">No questions match your filter</p>
                    <p className="text-[11px] text-muted-faint">Try resetting subject or keyword search filters.</p>
                  </td>
                </tr>
              ) : (
                paginatedQuestions.map((q, idx) => (
                  <tr key={q.id || idx} className="hover:bg-subtle/40 transition group">
                    <td className="py-3 px-4 font-mono text-[11px] text-muted-faint">
                      {(page - 1) * pageSize + idx + 1}
                    </td>
                    <td className="py-3 px-3 font-medium text-ink max-w-md">
                      <div className="line-clamp-2 leading-relaxed">{q.stem}</div>
                      <div className="text-[10px] text-muted-faint font-mono mt-0.5">{q.id}</div>
                    </td>
                    <td className="py-3 px-3 text-ink-soft">
                      <div className="font-semibold text-ink truncate max-w-[150px]">{q.subject}</div>
                      <div className="text-[10px] text-muted-faint truncate max-w-[150px]">{q.topic}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="w-6 h-6 rounded bg-success-surface border border-success-border text-success-text font-bold text-xs flex items-center justify-center">
                        {q.correctOption}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <Badge size="sm" tone={q.difficulty === 'HARD' ? 'danger' : q.difficulty === 'MEDIUM' ? 'warning' : 'success'}>
                        {q.difficulty}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-semibold text-muted bg-subtle px-2 py-0.5 rounded border border-line">
                        {q.sourceType || 'PYQ'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setInspectingQuestion(q)}
                          className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-subtle transition"
                          title="Inspect full stem, options, and explanation"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingQuestion(q);
                            setIsCreatingNew(false);
                          }}
                          className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-subtle transition"
                          title="Edit question text and answers"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(q)}
                          className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-subtle transition"
                          title="Duplicate as variant"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setQuestionToDelete(q)}
                          className="p-1.5 rounded-lg text-muted hover:text-danger-text hover:bg-danger/10 transition"
                          title="Delete from question bank"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-line bg-subtle/30 flex items-center justify-between text-xs flex-wrap gap-3">
          <div className="text-muted">
            Showing <strong>{paginatedQuestions.length}</strong> of <strong>{filteredQuestions.length}</strong> questions
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-line bg-surface text-muted hover:text-ink disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-line bg-surface text-muted hover:text-ink disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </Card>

      {/* Inspect Question Modal */}
      {inspectingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-xl rounded-2xl bg-card border border-line shadow-2xl p-6 my-8 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-line">
              <div>
                <span className="text-[10px] font-mono text-muted">{inspectingQuestion.id}</span>
                <div className="flex items-center gap-2 mt-1">
                  <Badge size="sm" tone="brand">{inspectingQuestion.subject}</Badge>
                  <Badge size="sm" tone="neutral">{inspectingQuestion.topic}</Badge>
                  <Badge size="sm" tone={inspectingQuestion.difficulty === 'HARD' ? 'danger' : 'warning'}>
                    {inspectingQuestion.difficulty}
                  </Badge>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => setInspectingQuestion(null)}>
                Close
              </Button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="font-bold text-muted uppercase text-[10px] mb-1">Question Stem</div>
                <p className="p-3 rounded-xl bg-subtle text-ink font-medium leading-relaxed">
                  {inspectingQuestion.stem}
                </p>
              </div>

              {/* 4 Choices */}
              <div className="space-y-1.5">
                <div className="font-bold text-muted uppercase text-[10px]">Options</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {inspectingQuestion.options.map((opt) => {
                    const isCorrect = opt.id === inspectingQuestion.correctOption;
                    return (
                      <div
                        key={opt.id}
                        className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                          isCorrect
                            ? 'bg-success-surface border-success-border text-success-text font-semibold'
                            : 'bg-surface border-line text-muted'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center ${
                          isCorrect ? 'bg-success text-white' : 'bg-subtle text-muted'
                        }`}>
                          {opt.id}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Explanation */}
              <div>
                <div className="font-bold text-muted uppercase text-[10px] mb-1">Detailed Explanation</div>
                <p className="p-3 rounded-xl bg-subtle text-muted leading-relaxed">
                  {inspectingQuestion.explanation || 'No explanation provided.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Create Question Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-2xl rounded-2xl bg-card border border-line shadow-2xl p-6 my-8 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <h3 className="font-display font-bold text-base text-ink">
                {isCreatingNew ? 'Add New Question' : 'Edit Question'}
              </h3>
              <button onClick={() => setEditingQuestion(null)} className="p-1 text-muted hover:text-ink">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-ink">Subject</label>
                  <input
                    type="text"
                    value={editingQuestion.subject}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, subject: e.target.value })}
                    className="w-full h-8 px-2.5 rounded-lg border border-line bg-surface text-ink text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-ink">Topic</label>
                  <input
                    type="text"
                    value={editingQuestion.topic}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, topic: e.target.value })}
                    className="w-full h-8 px-2.5 rounded-lg border border-line bg-surface text-ink text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-ink">Question Stem *</label>
                <textarea
                  rows={3}
                  value={editingQuestion.stem}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, stem: e.target.value })}
                  placeholder="Enter the complete question problem or statement..."
                  className="w-full p-2.5 rounded-xl border border-line bg-surface text-ink text-xs focus:border-primary focus:outline-none"
                />
              </div>

              {/* 4 Options */}
              <div className="space-y-2">
                <label className="font-semibold text-ink">Options (Click letter to set Answer Key)</label>
                {editingQuestion.options.map((opt, oIdx) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingQuestion({ ...editingQuestion, correctOption: opt.id })}
                      className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center transition ${
                        editingQuestion.correctOption === opt.id
                          ? 'bg-success text-white'
                          : 'bg-subtle text-muted hover:bg-subtle/80'
                      }`}
                      title="Set as correct answer"
                    >
                      {opt.id}
                    </button>
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => {
                        const nextOptions = [...editingQuestion.options];
                        nextOptions[oIdx] = { ...opt, text: e.target.value };
                        setEditingQuestion({ ...editingQuestion, options: nextOptions });
                      }}
                      placeholder={`Option ${opt.id} text...`}
                      className="flex-1 h-8 px-2.5 rounded-lg border border-line bg-surface text-xs text-ink"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-ink">Explanation & Solution</label>
                <textarea
                  rows={2}
                  value={editingQuestion.explanation}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                  placeholder="Step-by-step reasoning or mathematical proof..."
                  className="w-full p-2.5 rounded-xl border border-line bg-surface text-ink text-xs focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-line">
              <Button size="sm" variant="outline" onClick={() => setEditingQuestion(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => handleSaveQuestion(editingQuestion)}>
                Save Question
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk JSON Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-2xl rounded-2xl bg-card border border-line shadow-2xl p-6 my-8 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <h3 className="font-display font-bold text-base text-ink">Bulk Question Import (JSON)</h3>
              <button onClick={() => setIsImportModalOpen(false)} className="p-1 text-muted hover:text-ink">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-muted">
              Paste an array of questions in JSON format. Each object must have <code>stem</code>, <code>options</code> ([A, B, C, D]), <code>correctOption</code>, and <code>explanation</code>.
            </p>

            <textarea
              rows={12}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder={`[\n  {\n    "stem": "What is the Poisson ratio of ideal concrete?",\n    "options": [\n      {"id": "A", "text": "0.10 to 0.20"},\n      {"id": "B", "text": "0.25 to 0.35"},\n      {"id": "C", "text": "0.40 to 0.50"},\n      {"id": "D", "text": "0.00"}\n    ],\n    "correctOption": "A",\n    "subject": "Building Materials",\n    "topic": "Concrete",\n    "difficulty": "EASY",\n    "explanation": "Standard Poisson ratio of structural concrete ranges between 0.10 and 0.20 per IS 456."\n  }\n]`}
              className="w-full p-3 rounded-xl border border-line bg-surface font-mono text-xs text-ink focus:border-primary focus:outline-none"
            />

            <div className="flex justify-end gap-2 pt-3 border-t border-line">
              <Button size="sm" variant="outline" onClick={() => setIsImportModalOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleBulkImport}>
                Parse & Insert Questions
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(questionToDelete)}
        onClose={() => setQuestionToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Question?"
        message={`Are you sure you want to permanently delete question "${questionToDelete?.id}"? This action cannot be undone.`}
        confirmText="Delete Question"
        tone="danger"
      />
    </div>
  );
};
