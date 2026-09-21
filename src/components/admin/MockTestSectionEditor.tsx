import React, { useState, useEffect } from 'react';
import {
  Layers,
  Edit2,
  Trash2,
  Plus,
  Save,
  Check,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Clock,
  Sparkles,
  ArrowLeft,
  Eye,
  AlertCircle
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../../context/ToastContext';
import { MockTest, MockSection, MCQQuestion } from '../../types';
import {
  getAllCombinedMockTests,
  updateAdminPublishedMockTest,
  fetchAndSyncMockTests
} from '../../services/adminPaperService';
import { MOCK_TESTS } from '../../data/mockData';
import { useRealtimeSync } from '../../services/questionBankSyncService';
import { QuestionStemFormatter } from '../ui/QuestionStemFormatter';

interface MockTestSectionEditorProps {
  onBack?: () => void;
  selectedMockId?: string;
  onLaunchMock?: (mock: MockTest) => void;
}

export const MockTestSectionEditor: React.FC<MockTestSectionEditorProps> = ({
  onBack,
  selectedMockId,
  onLaunchMock
}) => {
  const { success: toastSuccess, error: toastError } = useToast();

  const [availableMocks, setAvailableMocks] = useState<MockTest[]>(() =>
    getAllCombinedMockTests(MOCK_TESTS)
  );
  const [activeMockId, setActiveMockId] = useState<string>(() => {
    if (selectedMockId && availableMocks.some((m) => m.id === selectedMockId)) {
      return selectedMockId;
    }
    return availableMocks[0]?.id || '';
  });

  // Working copy of current mock test being edited
  const [currentMock, setCurrentMock] = useState<MockTest | null>(null);

  // Editing state for section names (sub-heads)
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [tempSectionName, setTempSectionName] = useState<string>('');

  // Expanded sections accordion
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // Editing state for individual question
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [questionFormData, setQuestionFormData] = useState<Partial<MCQQuestion> | null>(null);

  // Deletion modals state
  const [sectionToDelete, setSectionToDelete] = useState<{ id: string; name: string } | null>(null);
  const [questionToDelete, setQuestionToDelete] = useState<{ sectionId: string; questionId: string; qIndex: number } | null>(null);

  // Saving state
  const [isSaving, setIsSaving] = useState(false);

  // Sync available mocks in real time
  const refreshMocks = async () => {
    try {
      const updated = await fetchAndSyncMockTests(MOCK_TESTS);
      setAvailableMocks(updated);
    } catch {
      setAvailableMocks(getAllCombinedMockTests(MOCK_TESTS));
    }
  };

  useRealtimeSync(['mocks', 'papers', 'all'], () => {
    refreshMocks();
  });

  useEffect(() => {
    refreshMocks();
  }, []);

  // Load selected mock into working state only when activeMockId changes
  useEffect(() => {
    const target = availableMocks.find((m) => m.id === activeMockId);
    if (target) {
      setCurrentMock(JSON.parse(JSON.stringify(target)));
      if (target.sections?.[0]?.id) {
        setExpandedSections({ [target.sections[0].id]: true });
      }
    }
  }, [activeMockId]);

  const toggleSectionExpand = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // ── Sub-head (Section) Name Renaming ──
  const handleStartRenameSection = (sec: MockSection, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSectionId(sec.id);
    setTempSectionName(sec.name);
  };

  const handleSaveRenameSection = async (sectionId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMock || !tempSectionName.trim()) return;

    const updatedSections = currentMock.sections.map((s) =>
      s.id === sectionId ? { ...s, name: tempSectionName.trim() } : s
    );

    const updatedMock: MockTest = {
      ...currentMock,
      sections: updatedSections
    };

    setCurrentMock(updatedMock);
    setAvailableMocks((prev) => prev.map((m) => (m.id === updatedMock.id ? updatedMock : m)));
    setEditingSectionId(null);

    try {
      await updateAdminPublishedMockTest(updatedMock);
      toastSuccess('Sub-head Renamed', `Section updated to "${tempSectionName.trim()}".`);
    } catch {
      toastSuccess('Sub-head Renamed', `Section updated in editor.`);
    }
  };

  // ── Add New Sub-head (Section) ──
  const handleAddNewSection = async () => {
    if (!currentMock) return;
    const newSecNum = currentMock.sections.length + 1;
    const newSection: MockSection = {
      id: `sec-${Date.now()}`,
      name: `Part ${newSecNum}: New Subject Sub-head`,
      totalQuestions: 0,
      questions: []
    };

    const updatedMock: MockTest = {
      ...currentMock,
      sections: [...currentMock.sections, newSection]
    };

    setCurrentMock(updatedMock);
    setAvailableMocks((prev) => prev.map((m) => (m.id === updatedMock.id ? updatedMock : m)));
    setExpandedSections((prev) => ({ ...prev, [newSection.id]: true }));
    setEditingSectionId(newSection.id);
    setTempSectionName(newSection.name);

    try {
      await updateAdminPublishedMockTest(updatedMock);
      toastSuccess('Sub-head Added', 'New section added and saved.');
    } catch {
      toastSuccess('Sub-head Added', 'Enter the new section name.');
    }
  };

  // ── Trigger Delete Sub-head ──
  const handleDeleteSection = (sectionId: string, sectionName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentMock) return;
    setSectionToDelete({ id: sectionId, name: sectionName });
  };

  // ── Confirm Delete Sub-head with Auto-Persistence ──
  const confirmDeleteSection = async () => {
    if (!currentMock || !sectionToDelete) return;
    const { id: sectionId, name: sectionName } = sectionToDelete;

    let updatedSections: MockSection[] = currentMock.sections.filter((s) => s.id !== sectionId);
    if (updatedSections.length === 0) {
      updatedSections = [
        {
          id: `sec-${Date.now()}`,
          name: 'Part 1: General Core',
          totalQuestions: 0,
          questions: []
        }
      ];
    }

    const newTotalQ = updatedSections.reduce((acc, s) => acc + s.questions.length, 0);
    const updatedMock: MockTest = {
      ...currentMock,
      sections: updatedSections,
      totalMarks: newTotalQ > 0 ? newTotalQ : currentMock.totalMarks
    };

    setCurrentMock(updatedMock);
    setAvailableMocks((prev) => prev.map((m) => (m.id === updatedMock.id ? updatedMock : m)));
    setSectionToDelete(null);

    try {
      await updateAdminPublishedMockTest(updatedMock);
      toastSuccess('Sub-head Deleted', `"${sectionName}" has been deleted and changes saved.`);
    } catch (err: any) {
      console.warn('Auto-save error:', err);
      toastSuccess('Sub-head Deleted', `"${sectionName}" removed from editor.`);
    }
  };

  // ── Trigger Delete Individual Question ──
  const handleDeleteQuestion = (sectionId: string, questionId: string, qIndex: number) => {
    if (!currentMock) return;
    setQuestionToDelete({ sectionId, questionId, qIndex });
  };

  // ── Confirm Delete Question with Auto-Persistence ──
  const confirmDeleteQuestion = async () => {
    if (!currentMock || !questionToDelete) return;
    const { sectionId, questionId } = questionToDelete;

    const updatedSections = currentMock.sections.map((sec) => {
      if (sec.id !== sectionId) return sec;
      const newQuestions = sec.questions.filter((q) => q.id !== questionId);
      return {
        ...sec,
        totalQuestions: newQuestions.length,
        questions: newQuestions
      };
    });

    const newTotalQ = updatedSections.reduce((acc, s) => acc + s.questions.length, 0);
    const updatedMock: MockTest = {
      ...currentMock,
      sections: updatedSections,
      totalMarks: newTotalQ > 0 ? newTotalQ : currentMock.totalMarks
    };

    setCurrentMock(updatedMock);
    setAvailableMocks((prev) => prev.map((m) => (m.id === updatedMock.id ? updatedMock : m)));
    setQuestionToDelete(null);

    try {
      await updateAdminPublishedMockTest(updatedMock);
      toastSuccess('Question Deleted', 'MCQ deleted and changes saved.');
    } catch (err: any) {
      toastSuccess('Question Deleted', 'MCQ removed from editor.');
    }
  };

  // ── Start Editing Question ──
  const handleStartEditQuestion = (q: MCQQuestion) => {
    setEditingQuestionId(q.id);
    setQuestionFormData(JSON.parse(JSON.stringify(q)));
  };

  // ── Save Question Changes ──
  const handleSaveQuestionChanges = async (sectionId: string) => {
    if (!currentMock || !questionFormData || !editingQuestionId) return;

    const updatedSections = currentMock.sections.map((sec) => {
      if (sec.id !== sectionId) return sec;
      return {
        ...sec,
        questions: sec.questions.map((q) =>
          q.id === editingQuestionId ? ({ ...q, ...questionFormData } as MCQQuestion) : q
        )
      };
    });

    const updatedMock: MockTest = {
      ...currentMock,
      sections: updatedSections
    };

    setCurrentMock(updatedMock);
    setAvailableMocks((prev) => prev.map((m) => (m.id === updatedMock.id ? updatedMock : m)));
    setEditingQuestionId(null);
    setQuestionFormData(null);

    try {
      await updateAdminPublishedMockTest(updatedMock);
      toastSuccess('Question Updated', 'Changes saved permanently.');
    } catch {
      toastSuccess('Question Updated', 'Changes updated in editor.');
    }
  };

  // ── Add New Question to Sub-head ──
  const handleAddQuestionToSection = (sectionId: string) => {
    if (!currentMock) return;

    const targetSec = currentMock.sections.find((s) => s.id === sectionId);
    const qNum = (targetSec?.questions.length || 0) + 1;

    const newQ: MCQQuestion = {
      id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      questionNumber: qNum,
      examId: currentMock.examId || 'mock-exam',
      topic: currentMock.title || 'Technical Studies',
      stem: 'New question statement... (Supports standard text, statement 1 & 2, or match the following)',
      options: [
        { id: 'A', text: 'First option statement' },
        { id: 'B', text: 'Second option statement' },
        { id: 'C', text: 'Third option statement' },
        { id: 'D', text: 'Fourth option statement' }
      ],
      correctOption: 'A',
      explanation: 'Official detailed explanation and reference clause.',
      subject: currentMock.title || 'Technical & General Studies',
      difficulty: 'MEDIUM',
      questionType: 'CONCEPTUAL'
    };

    const updatedSections = currentMock.sections.map((sec) => {
      if (sec.id !== sectionId) return sec;
      const updatedQs = [...sec.questions, newQ];
      return {
        ...sec,
        totalQuestions: updatedQs.length,
        questions: updatedQs
      };
    });

    setCurrentMock({
      ...currentMock,
      sections: updatedSections
    });

    setExpandedSections((prev) => ({ ...prev, [sectionId]: true }));
    handleStartEditQuestion(newQ);
    toastSuccess('Question Added', 'Edit the new question details below.');
  };

  // ── Commit All Changes to Persistent Storage & Cloud ──
  const handleSaveEntireMock = async () => {
    if (!currentMock) return;
    setIsSaving(true);
    try {
      // Recompute total questions
      const totalQ = currentMock.sections.reduce((acc, s) => acc + s.questions.length, 0);
      const mockToSave: MockTest = {
        ...currentMock,
        sections: currentMock.sections.map((s) => ({
          ...s,
          totalQuestions: s.questions.length
        }))
      };

      await updateAdminPublishedMockTest(mockToSave);
      toastSuccess('Mock Test Saved!', `"${mockToSave.title}" has been updated with ${totalQ} questions across ${mockToSave.sections.length} sub-heads.`);
    } catch (err: any) {
      console.error('Failed to save mock test:', err);
      toastError('Save Failed', err.message || 'Could not update mock test.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!currentMock) {
    return (
      <div className="p-8 text-center text-muted">
        Loading Mock Test Editor...
      </div>
    );
  }

  const totalQuestionsCount = currentMock.sections.reduce((acc, s) => acc + s.questions.length, 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn">
      {/* ── Top Header Banner ── */}
      <Card flush className="p-6 bg-gradient-to-r from-indigo-500/10 via-card to-card border-indigo-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-1 rounded-lg text-muted hover:text-ink hover:bg-subtle transition mr-1"
                  title="Go back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <Badge tone="brand" size="md">
                Sub-heads &amp; MCQ Editor
              </Badge>
              <span className="text-xs text-muted-faint">•</span>
              <span className="text-xs text-muted font-medium">Real-Time Exam Authoring</span>
            </div>
            <h1 className="font-display font-bold text-xl sm:text-2xl text-ink mt-1">
              Mock Test Sub-heads &amp; Questions Manager
            </h1>
            <p className="text-xs text-muted">
              Rename section sub-heads, inspect questions and MCQs, modify answer keys and explanations, or delete questions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onLaunchMock && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onLaunchMock(currentMock)}
                icon={<Eye className="w-3.5 h-3.5" />}
              >
                Preview CBT
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleSaveEntireMock}
              disabled={isSaving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20"
              icon={<Save className="w-3.5 h-3.5" />}
            >
              {isSaving ? 'Saving Changes...' : 'Save Mock Test'}
            </Button>
          </div>
        </div>
      </Card>

      {/* ── Mock Test Selector & Meta Settings ── */}
      <Card flush className="p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 w-full sm:w-auto space-y-1">
            <label className="text-xs font-bold text-ink">Select Mock Test to Edit</label>
            <select
              value={activeMockId}
              onChange={(e) => setActiveMockId(e.target.value)}
              className="w-full sm:max-w-md h-10 px-3 rounded-xl border border-line bg-surface text-xs font-semibold text-ink focus:border-indigo-500 focus:outline-none"
            >
              {availableMocks.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title} ({m.sections?.length || 0} Sub-heads · {m.durationMinutes}m)
                </option>
              ))}
            </select>
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-4 text-xs">
            <div className="text-right">
              <div className="text-muted text-[11px]">Sub-heads (Sections)</div>
              <div className="font-bold font-display text-base text-indigo-600 dark:text-indigo-400">
                {currentMock.sections.length}
              </div>
            </div>
            <div className="text-right">
              <div className="text-muted text-[11px]">Total MCQs</div>
              <div className="font-bold font-display text-base text-ink">
                {totalQuestionsCount}
              </div>
            </div>
            <div className="text-right">
              <div className="text-muted text-[11px]">Duration</div>
              <div className="font-bold font-display text-base text-ink">
                {currentMock.durationMinutes}m
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Sub-heads (Sections) Accordion List ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-base text-ink flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Section Sub-heads in "{currentMock.title}"</span>
          </h2>
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddNewSection}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Add New Sub-head
          </Button>
        </div>

        {currentMock.sections.map((section, secIdx) => {
          const isExpanded = !!expandedSections[section.id];
          const isEditingName = editingSectionId === section.id;

          return (
            <Card flush key={section.id} className="border-line-strong overflow-hidden shadow-xs">
              {/* Sub-head Header Bar */}
              <div
                onClick={() => toggleSectionExpand(section.id)}
                className="flex items-center justify-between p-4 bg-subtle/50 hover:bg-subtle cursor-pointer transition select-none flex-wrap gap-2"
              >
                <div className="flex items-center gap-3 flex-1 min-w-[240px]">
                  <button className="text-muted hover:text-ink transition">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  {/* Sub-head Name display or inline edit */}
                  {isEditingName ? (
                    <form
                      onSubmit={(e) => handleSaveRenameSection(section.id, e)}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 flex-1 max-w-lg"
                    >
                      <input
                        type="text"
                        autoFocus
                        value={tempSectionName}
                        onChange={(e) => setTempSectionName(e.target.value)}
                        placeholder="Enter sub-head name..."
                        className="flex-1 h-8 px-2.5 rounded-lg border border-indigo-500 bg-surface text-xs font-bold text-ink focus:outline-none"
                      />
                      <Button size="sm" type="submit" className="bg-indigo-600 text-white">
                        <Check className="w-3 h-3 mr-1" /> Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        type="button"
                        onClick={() => setEditingSectionId(null)}
                      >
                        Cancel
                      </Button>
                    </form>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-ink">{section.name}</span>
                      <button
                        onClick={(e) => handleStartRenameSection(section, e)}
                        className="p-1 rounded-md text-muted hover:text-indigo-600 hover:bg-indigo-500/10 transition"
                        title="Rename sub-head name"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                    {section.questions.length} Questions
                  </span>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddQuestionToSection(section.id)}
                    icon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Add Question
                  </Button>

                  <button
                    onClick={(e) => handleDeleteSection(section.id, section.name, e)}
                    className="p-1.5 rounded-lg text-muted hover:text-danger-text hover:bg-danger-surface transition"
                    title="Delete this sub-head"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Sub-head Questions List */}
              {isExpanded && (
                <div className="p-4 space-y-4 border-t border-line bg-canvas/40">
                  {section.questions.length === 0 ? (
                    <div className="py-8 text-center space-y-2 border border-dashed rounded-xl">
                      <p className="text-xs text-muted">No questions inside this sub-head yet.</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddQuestionToSection(section.id)}
                      >
                        Add First Question
                      </Button>
                    </div>
                  ) : (
                    section.questions.map((q, qIndex) => {
                      const isEditingThisQ = editingQuestionId === q.id;

                      if (isEditingThisQ && questionFormData) {
                        return (
                          <Card flush key={q.id} className="p-5 border-indigo-500/40 bg-card shadow-md space-y-4">
                            <div className="flex items-center justify-between border-b border-line pb-2">
                              <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400">
                                Editing Question #{qIndex + 1}
                              </span>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setEditingQuestionId(null);
                                    setQuestionFormData(null);
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-indigo-600 text-white"
                                  onClick={() => handleSaveQuestionChanges(section.id)}
                                  icon={<Check className="w-3 h-3" />}
                                >
                                  Update Question
                                </Button>
                              </div>
                            </div>

                            {/* Stem Form */}
                            <div>
                              <label className="block text-xs font-semibold text-ink mb-1">
                                Question Stem / Statement
                              </label>
                              <textarea
                                rows={3}
                                value={questionFormData.stem || ''}
                                onChange={(e) =>
                                  setQuestionFormData({ ...questionFormData, stem: e.target.value })
                                }
                                className="w-full p-2.5 rounded-xl border border-line bg-surface text-xs text-ink focus:border-indigo-500 focus:outline-none"
                              />
                            </div>

                            {/* Options A, B, C, D */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {(['A', 'B', 'C', 'D'] as const).map((optId) => {
                                const currentOpt = questionFormData.options?.find((o) => o.id === optId);
                                const isCorrect = questionFormData.correctOption === optId;

                                return (
                                  <div
                                    key={optId}
                                    className={`p-2.5 rounded-xl border transition ${
                                      isCorrect
                                        ? 'border-emerald-500 bg-emerald-500/10'
                                        : 'border-line bg-surface'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between mb-1.5">
                                      <span className="font-bold text-xs">Option {optId}</span>
                                      <label className="flex items-center gap-1 text-[11px] font-semibold cursor-pointer">
                                        <input
                                          type="radio"
                                          name={`correct-${q.id}`}
                                          checked={isCorrect}
                                          onChange={() =>
                                            setQuestionFormData({
                                              ...questionFormData,
                                              correctOption: optId
                                            })
                                          }
                                        />
                                        <span className={isCorrect ? 'text-emerald-600 font-bold' : 'text-muted'}>
                                          Correct Answer Key
                                        </span>
                                      </label>
                                    </div>
                                    <input
                                      type="text"
                                      value={currentOpt?.text || ''}
                                      onChange={(e) => {
                                        const newOpts = (questionFormData.options || []).map((o) =>
                                          o.id === optId ? { ...o, text: e.target.value } : o
                                        );
                                        setQuestionFormData({ ...questionFormData, options: newOpts });
                                      }}
                                      className="w-full h-8 px-2.5 rounded-lg border border-line bg-canvas text-xs text-ink focus:border-indigo-500 focus:outline-none"
                                    />
                                  </div>
                                );
                              })}
                            </div>

                            {/* Explanation */}
                            <div>
                              <label className="block text-xs font-semibold text-ink mb-1">
                                Official Answer Explanation &amp; References
                              </label>
                              <textarea
                                rows={2}
                                value={questionFormData.explanation || ''}
                                onChange={(e) =>
                                  setQuestionFormData({ ...questionFormData, explanation: e.target.value })
                                }
                                placeholder="Explain why the option is correct and cite governing standards..."
                                className="w-full p-2.5 rounded-xl border border-line bg-surface text-xs text-ink focus:border-indigo-500 focus:outline-none"
                              />
                            </div>
                          </Card>
                        );
                      }

                      // Normal Question View
                      return (
                        <div
                          key={q.id}
                          className="p-4 rounded-xl border border-line bg-card hover:border-line-strong transition space-y-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2.5">
                              <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center flex-shrink-0">
                                {qIndex + 1}
                              </span>
                              <div className="space-y-1">
                                <QuestionStemFormatter stem={q.stem} />
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <button
                                onClick={() => handleStartEditQuestion(q)}
                                className="p-1.5 rounded-lg text-muted hover:text-indigo-600 hover:bg-indigo-500/10 transition"
                                title="Edit question, options, answer key, or explanation"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteQuestion(section.id, q.id, qIndex)}
                                className="p-1.5 rounded-lg text-muted hover:text-danger-text hover:bg-danger-surface transition"
                                title="Delete question from sub-head"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Options grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-line/50 text-xs">
                            {q.options.map((opt) => {
                              const isCorrect = opt.id === q.correctOption;
                              return (
                                <div
                                  key={opt.id}
                                  className={`p-2 rounded-lg border text-xs flex items-start gap-2 ${
                                    isCorrect
                                      ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100 font-semibold'
                                      : 'border-line/40 bg-surface/50 text-muted'
                                  }`}
                                >
                                  <span
                                    className={`w-4 h-4 rounded text-[10px] font-bold flex items-center justify-center flex-shrink-0 ${
                                      isCorrect
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-subtle text-muted'
                                    }`}
                                  >
                                    {opt.id}
                                  </span>
                                  <span className="flex-1">{opt.text}</span>
                                  {isCorrect && (
                                    <span className="text-[10px] font-bold text-emerald-600">✓ Correct</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Explanation Accordion preview */}
                          {q.explanation && (
                            <div className="p-2.5 rounded-lg bg-subtle/60 text-xs text-muted space-y-0.5">
                              <span className="font-semibold text-ink text-[11px] block">
                                Official Solution &amp; Working Notes:
                              </span>
                              <p className="text-[11px] leading-relaxed">{q.explanation}</p>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* ── Sub-head Deletion Confirmation Modal ── */}
      {sectionToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-line rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-ink">Delete Sub-head?</h3>
                <p className="text-xs text-muted">This will remove the entire section from the mock test.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-subtle/70 border border-line text-xs space-y-1">
              <span className="text-muted block text-[11px] uppercase font-bold">Sub-head to be deleted:</span>
              <span className="font-semibold text-ink text-sm block">"{sectionToDelete.name}"</span>
              <p className="text-[11px] text-muted mt-1">
                All questions belonging to this sub-head will also be removed. This change saves immediately.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSectionToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={confirmDeleteSection}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-600/20"
              >
                Yes, Delete Sub-head
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Question Deletion Confirmation Modal ── */}
      {questionToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-line rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-ink">Delete MCQ Question?</h3>
                <p className="text-xs text-muted">Question #{questionToDelete.qIndex + 1} will be removed.</p>
              </div>
            </div>

            <p className="text-xs text-muted">
              Are you sure you want to permanently remove this question from the sub-head? This change saves immediately.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuestionToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={confirmDeleteQuestion}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-600/20"
              >
                Yes, Delete Question
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default MockTestSectionEditor;
