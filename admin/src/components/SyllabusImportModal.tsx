import React, { useState } from 'react';
import {
  X,
  FileText,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Layers,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  SyllabusBlueprint,
  SyllabusModule,
  parseSyllabusText,
  saveSyllabusBlueprint
} from '@/services/syllabusBlueprintService';
import { useToast } from '@/context/ToastContext';

interface SyllabusImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyllabusSaved: (saved: SyllabusBlueprint) => void;
}

export const SyllabusImportModal: React.FC<SyllabusImportModalProps> = ({
  isOpen,
  onClose,
  onSyllabusSaved
}) => {
  const { success: toastSuccess, error: toastError } = useToast();

  const [mode, setMode] = useState<'smart-paste' | 'manual'>('smart-paste');
  const [rawText, setRawText] = useState('');

  // Syllabus configuration
  const [title, setTitle] = useState('');
  const [examAgency, setExamAgency] = useState('Assam Public Service Commission');
  const [department, setDepartment] = useState('Public Health Engineering Department');
  const [advertNo, setAdvertNo] = useState('');
  const [paper, setPaper] = useState('Paper-II Civil Engineering');
  const [standard, setStandard] = useState('Bachelor Degree Standard');
  const [fullMarks, setFullMarks] = useState(100);
  const [durationMinutes, setDurationMinutes] = useState(120);
  const [totalQuestions, setTotalQuestions] = useState(100);
  const [negativeMarks, setNegativeMarks] = useState(0.25);
  const [branch, setBranch] = useState<'civil' | 'mechanical' | 'electrical' | 'gs' | 'all'>('civil');

  const [modules, setModules] = useState<SyllabusModule[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleParseText = () => {
    if (!rawText.trim()) {
      toastError('Empty Text', 'Please paste syllabus text to parse.');
      return;
    }
    const parsed = parseSyllabusText(rawText);
    setModules(parsed);
    toastSuccess('Parsed Successfully', `Extracted ${parsed.length} syllabus modules.`);
  };

  const handleAddModule = () => {
    const newMod: SyllabusModule = {
      id: `mod-${Date.now()}-${modules.length + 1}`,
      name: `${modules.length + 1}. New Module`,
      description: 'Core concepts and topics',
      topics: ['Topic 1', 'Topic 2'],
      suggestedWeight: 10
    };
    setModules([...modules, newMod]);
  };

  const handleRemoveModule = (modId: string) => {
    setModules(modules.filter((m) => m.id !== modId));
  };

  const handleUpdateModuleName = (modId: string, name: string) => {
    setModules(
      modules.map((m) => (m.id === modId ? { ...m, name } : m))
    );
  };

  const handleAddTopicToModule = (modId: string, topicText: string) => {
    if (!topicText.trim()) return;
    setModules(
      modules.map((m) =>
        m.id === modId ? { ...m, topics: [...m.topics, topicText.trim()] } : m
      )
    );
  };

  const handleRemoveTopic = (modId: string, topicIdx: number) => {
    setModules(
      modules.map((m) =>
        m.id === modId
          ? { ...m, topics: m.topics.filter((_, idx) => idx !== topicIdx) }
          : m
      )
    );
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toastError('Missing Title', 'Please provide a title for the syllabus.');
      return;
    }
    if (modules.length === 0) {
      toastError('No Modules', 'Please add or parse at least one syllabus module.');
      return;
    }

    setIsSaving(true);
    try {
      const blueprint: SyllabusBlueprint = {
        id: `custom-syllabus-${Date.now()}`,
        title: title.trim(),
        examAgency: examAgency.trim(),
        department: department.trim() || undefined,
        advertNo: advertNo.trim() || undefined,
        paper: paper.trim(),
        standard: standard.trim(),
        fullMarks: Number(fullMarks) || 100,
        durationMinutes: Number(durationMinutes) || 120,
        totalQuestions: Number(totalQuestions) || 100,
        negativeMarksPerIncorrect: Number(negativeMarks) || 0.25,
        isOfficial: false,
        branch,
        modules
      };

      const saved = await saveSyllabusBlueprint(blueprint);
      toastSuccess('Syllabus Saved', `"${saved.title}" is now available for mock test creation.`);
      onSyllabusSaved(saved);
      onClose();
    } catch (err) {
      toastError('Save Error', 'Failed to save syllabus blueprint.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl rounded-2xl bg-card border border-line shadow-2xl p-6 my-8 max-h-[90vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-line">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </span>
              <h2 className="font-display font-bold text-base sm:text-lg text-ink">
                Add Examination Syllabus Blueprint
              </h2>
            </div>
            <p className="text-xs text-muted mt-1">
              Ingest or parse an official syllabus. Mock tests can be generated directly based on these modules.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-subtle transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2 border-b border-line pb-3">
          <button
            type="button"
            onClick={() => setMode('smart-paste')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              mode === 'smart-paste'
                ? 'bg-primary text-white shadow-xs'
                : 'text-muted hover:text-ink hover:bg-subtle'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Smart Text / PDF Paste Parser
          </button>
          <button
            type="button"
            onClick={() => setMode('manual')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              mode === 'manual'
                ? 'bg-primary text-white shadow-xs'
                : 'text-muted hover:text-ink hover:bg-subtle'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Structured Module Editor ({modules.length})
          </button>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-ink mb-1">
              Exam Title / Name *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. APSC AE Civil (PHED) Advt. 31/2025"
              className="w-full px-3 py-1.5 rounded-lg border border-line bg-surface text-xs text-ink outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1">
              Exam Agency / Commission
            </label>
            <input
              type="text"
              value={examAgency}
              onChange={(e) => setExamAgency(e.target.value)}
              placeholder="e.g. APSC, UPSC, SSC"
              className="w-full px-3 py-1.5 rounded-lg border border-line bg-surface text-xs text-ink outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1">
              Department / Cadre
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Public Health Engineering"
              className="w-full px-3 py-1.5 rounded-lg border border-line bg-surface text-xs text-ink outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1">
              Advertisement No. &amp; Date
            </label>
            <input
              type="text"
              value={advertNo}
              onChange={(e) => setAdvertNo(e.target.value)}
              placeholder="e.g. Advt. No. 31/2025 dated 09.09.2025"
              className="w-full px-3 py-1.5 rounded-lg border border-line bg-surface text-xs text-ink outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1">
              Discipline / Branch
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value as any)}
              className="w-full px-3 py-1.5 rounded-lg border border-line bg-surface text-xs text-ink outline-none"
            >
              <option value="civil">Civil Engineering</option>
              <option value="mechanical">Mechanical Engineering</option>
              <option value="electrical">Electrical Engineering</option>
              <option value="gs">General Studies / State GK</option>
              <option value="all">Comprehensive</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1">
              Full Marks
            </label>
            <input
              type="number"
              value={fullMarks}
              onChange={(e) => setFullMarks(Number(e.target.value))}
              className="w-full px-3 py-1.5 rounded-lg border border-line bg-surface text-xs text-ink outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1">
              Duration (Minutes)
            </label>
            <input
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full px-3 py-1.5 rounded-lg border border-line bg-surface text-xs text-ink outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1">
              Total Questions (MCQs)
            </label>
            <input
              type="number"
              value={totalQuestions}
              onChange={(e) => setTotalQuestions(Number(e.target.value))}
              className="w-full px-3 py-1.5 rounded-lg border border-line bg-surface text-xs text-ink outline-none"
            />
          </div>
        </div>

        {/* Mode 1: Smart Paste */}
        {mode === 'smart-paste' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-ink">
                Paste Syllabus Text from Notification PDF
              </span>
              <span className="text-[11px] text-muted">
                Detects numbered modules like &ldquo;1. Statics: ... 2. Dynamics: ...&rdquo;
              </span>
            </div>
            <textarea
              rows={8}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste raw syllabus text here, for example:
1. Statics:
Co planer and multi planer system, free body diagrams, centroid second moment of plane figure...
2. Dynamics:
Units and Dimensions, Gravitational and absolute system...
3. Kinematics:
Rectilinear and Curvilinear motion, Relative motion...
4. Kinetics:
Mass moment of inertia, simple harmonic motion...
5. Strength of Materials:
Homogenous and isotropic media, stress and strain elastic constants..."
              className="w-full p-3 rounded-xl border border-line bg-surface text-xs text-ink font-mono outline-none focus:ring-1 focus:ring-primary leading-relaxed"
            />

            <div className="flex items-center justify-between">
              <Button size="sm" variant="primary" onClick={handleParseText}>
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                Parse Syllabus Text
              </Button>
              {modules.length > 0 && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  {modules.length} Modules parsed &amp; ready
                </span>
              )}
            </div>
          </div>
        )}

        {/* Mode 2: Modules & Topics Preview / Editor */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-xs text-ink uppercase tracking-wider">
              Syllabus Modules &amp; Subtopics ({modules.length})
            </h3>
            <Button size="sm" variant="outline" onClick={handleAddModule} className="text-xs">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Module
            </Button>
          </div>

          {modules.length === 0 ? (
            <div className="py-8 text-center border border-dashed rounded-xl text-muted text-xs">
              No modules added yet. Paste text above and click &ldquo;Parse Syllabus Text&rdquo; or click &ldquo;Add Module&rdquo;.
            </div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {modules.map((mod, modIdx) => (
                <Card key={mod.id} flush className="p-3 border-line bg-subtle/30 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={mod.name}
                      onChange={(e) => handleUpdateModuleName(mod.id, e.target.value)}
                      className="font-bold text-xs text-ink bg-transparent border-b border-transparent hover:border-line focus:border-primary outline-none px-1 flex-1"
                    />
                    <div className="flex items-center gap-1">
                      <Badge tone="brand" className="text-[10px]">
                        {mod.topics.length} Topics
                      </Badge>
                      <button
                        onClick={() => handleRemoveModule(mod.id)}
                        className="p-1 rounded text-muted hover:text-danger-text hover:bg-danger/10 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Topics List */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {mod.topics.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-card border border-line text-[11px] text-ink"
                      >
                        <span>{t}</span>
                        <button
                          onClick={() => handleRemoveTopic(mod.id, tIdx)}
                          className="text-muted hover:text-danger-text ml-0.5"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={isSaving || modules.length === 0}
          >
            {isSaving ? 'Saving Blueprint...' : 'Save Syllabus Blueprint'}
          </Button>
        </div>
      </div>
    </div>
  );
};
