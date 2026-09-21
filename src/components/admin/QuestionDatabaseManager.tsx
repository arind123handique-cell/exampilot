import React, { useState, useMemo } from 'react';
import {
  Database,
  Search,
  Filter,
  RefreshCw,
  CloudUpload,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Flame,
  Layers,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { QuestionStemFormatter } from '../ui/QuestionStemFormatter';
import { useToast } from '../../context/ToastContext';
import {
  ALL_QUESTIONS,
  CIVIL_ENGINEERING_QUESTIONS,
  GENERAL_STUDIES_QUESTIONS,
  PYQ_PAPERS
} from '../../data/mockData';
import { ASSAM_DWR_2026_QUESTIONS } from '../../data/assamDwr2026Questions';
import { getAdminPublishedPapers } from '../../services/adminPaperService';
import { seedFirestoreQuestions } from '../../services/firestore';
import { isFirebaseConfigured } from '../../firebase/config';
import { MCQQuestion, PYQPaper } from '../../types';
import { useRealtimeSync } from '../../services/questionBankSyncService';

export const QuestionDatabaseManager: React.FC = () => {
  const { success: toastSuccess, error: toastError } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedSource, setSelectedSource] = useState<string>('ALL');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Combine static and dynamic questions with real-time reactive sync
  const [adminPapers, setAdminPapers] = useState<PYQPaper[]>(() => getAdminPublishedPapers());

  useRealtimeSync(['questions', 'papers', 'mocks', 'all'], () => {
    setAdminPapers(getAdminPublishedPapers());
  });

  const adminQuestions = useMemo(() => {
    return adminPapers.flatMap((p) => p.questions);
  }, [adminPapers]);

  const allBankQuestions: MCQQuestion[] = useMemo(() => {
    const seen = new Set<string>();
    const list: MCQQuestion[] = [];
    [...adminQuestions, ...ALL_QUESTIONS].forEach((q) => {
      if (!seen.has(q.id)) {
        seen.add(q.id);
        list.push(q);
      }
    });
    return list;
  }, [adminQuestions]);

  const filteredQuestions = useMemo(() => {
    return allBankQuestions.filter((q) => {
      const matchesSearch =
        !searchQuery ||
        q.stem.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSubject =
        selectedSubject === 'ALL' ||
        q.subject.toLowerCase() === selectedSubject.toLowerCase();

      const matchesSource =
        selectedSource === 'ALL' ||
        (selectedSource === 'PYQ' && q.sourceType === 'PYQ') ||
        (selectedSource === 'DWR' && q.id.includes('dwr')) ||
        (selectedSource === 'ADMIN' && (q.id.includes('admin') || q.id.includes('pyq-')));

      return matchesSearch && matchesSubject && matchesSource;
    });
  }, [allBankQuestions, searchQuery, selectedSubject, selectedSource]);

  const subjects = useMemo(() => {
    return ['ALL', ...Array.from(new Set(allBankQuestions.map((q) => q.subject)))];
  }, [allBankQuestions]);

  const handleSyncFirestore = async () => {
    setIsSyncing(true);
    setSyncStatus('Connecting to Cloud Firestore...');
    try {
      const res = await seedFirestoreQuestions();
      if (res.success) {
        toastSuccess('Cloud Sync Complete', `Synced ${res.count} questions to Cloud Firestore!`);
        setSyncStatus(`Successfully synced ${res.count} questions to Firestore collection: questions`);
      } else {
        toastError('Sync Failed', 'Firebase is not connected or credentials are missing.');
        setSyncStatus('Firestore sync failed: Check Firebase configuration.');
      }
    } catch (err: any) {
      toastError('Sync Error', err.message || 'Error pushing questions');
      setSyncStatus(`Sync error: ${err.message || err}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <Card flush className="p-6 bg-gradient-to-r from-slate-900/10 via-card to-card border-slate-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge tone="brand" size="md">
                Master Question Repository
              </Badge>
              <span className="text-xs text-muted-faint">•</span>
              <span className="text-xs text-muted font-medium">Cloud & Local Storage Store</span>
            </div>
            <h1 className="font-display font-bold text-xl sm:text-2xl text-ink mt-1">
              Question Bank & Database Manager
            </h1>
            <p className="text-xs text-muted mt-0.5">
              Inspect all questions currently available in ExamPilot, verify schemas, and synchronize to Cloud Firestore.
            </p>
          </div>

          <Button
            onClick={handleSyncFirestore}
            disabled={isSyncing}
            icon={<CloudUpload className="w-4 h-4" />}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 flex-shrink-0"
          >
            {isSyncing ? 'Syncing...' : 'Sync to Cloud Firestore'}
          </Button>
        </div>
      </Card>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card flush className="p-4 space-y-1">
          <div className="text-[10px] uppercase font-bold text-muted-faint">Total Questions</div>
          <div className="font-display font-bold text-2xl text-indigo-600 dark:text-indigo-400">
            {allBankQuestions.length}
          </div>
          <div className="text-[10px] text-muted">Ready for tests & mock engine</div>
        </Card>

        <Card flush className="p-4 space-y-1">
          <div className="text-[10px] uppercase font-bold text-muted-faint">Assam DWR 2026</div>
          <div className="font-display font-bold text-2xl text-warning-text">
            {ASSAM_DWR_2026_QUESTIONS.length}
          </div>
          <div className="text-[10px] text-muted">100% Official verified paper</div>
        </Card>

        <Card flush className="p-4 space-y-1">
          <div className="text-[10px] uppercase font-bold text-muted-faint">Civil Engineering</div>
          <div className="font-display font-bold text-2xl text-primary">
            {CIVIL_ENGINEERING_QUESTIONS.length}
          </div>
          <div className="text-[10px] text-muted">Across 12 technical branches</div>
        </Card>

        <Card flush className="p-4 space-y-1">
          <div className="text-[10px] uppercase font-bold text-muted-faint">Admin Uploaded</div>
          <div className="font-display font-bold text-2xl text-emerald-600 dark:text-emerald-400">
            {adminQuestions.length}
          </div>
          <div className="text-[10px] text-muted">{adminPapers.length} custom published papers</div>
        </Card>
      </div>

      {syncStatus && (
        <div className="p-3.5 rounded-xl bg-subtle border border-line text-xs flex items-center justify-between text-ink-soft">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-500" />
            {syncStatus}
          </span>
          <button onClick={() => setSyncStatus(null)} className="text-muted hover:text-ink">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search */}
      <Card flush className="p-4 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-muted-faint absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions by keyword, topic, formula, or ID..."
            className="w-full h-9 pl-9 pr-3 rounded-xl border border-line bg-surface text-xs text-ink placeholder-muted-faint focus:border-indigo-500 focus:outline-none transition"
          />
        </div>

        {/* Source and Subject Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] font-semibold text-muted">Filter Source:</span>
          {['ALL', 'PYQ', 'DWR', 'ADMIN'].map((src) => (
            <button
              key={src}
              onClick={() => setSelectedSource(src)}
              className={`px-2.5 py-1 rounded-md transition font-medium text-[11px] ${
                selectedSource === src
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-subtle text-muted hover:text-ink'
              }`}
            >
              {src === 'ALL' ? 'All Sources' : src === 'DWR' ? 'Assam DWR 2026' : src}
            </button>
          ))}

          <span className="text-muted-faint mx-1">•</span>

          <span className="text-[11px] font-semibold text-muted">Subject:</span>
          <div className="inline-flex gap-1 overflow-x-auto max-w-full">
            {subjects.slice(0, 8).map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-2.5 py-1 rounded-md transition font-medium text-[11px] whitespace-nowrap ${
                  selectedSubject === sub
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-subtle text-muted hover:text-ink'
                }`}
              >
                {sub === 'ALL' ? 'All Subjects' : sub}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Questions Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>Showing {filteredQuestions.length} of {allBankQuestions.length} database questions</span>
          <span>Indexed & ready for CBT testing</span>
        </div>

        <div className="space-y-2">
          {filteredQuestions.slice(0, 40).map((q, idx) => (
            <Card flush className="p-4 space-y-2 hover:border-line-strong transition" key={q.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-bold">
                      {q.id}
                    </span>
                    <span className="font-semibold text-ink-soft">{q.subject}</span>
                    <span className="text-muted-faint">•</span>
                    <span className="text-muted">{q.topic}</span>
                    {q.pyqYear && (
                      <span className="px-1.5 py-0.2 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 text-[10px] font-bold">
                        {q.pyqYear} PYQ
                      </span>
                    )}
                  </div>
                  <div className="pt-1">
                    <QuestionStemFormatter stem={q.stem} compact />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="px-2.5 py-1 rounded-lg bg-success-surface text-success-text font-bold text-xs">
                    Key: {q.correctOption}
                  </span>
                </div>
              </div>

              {/* Options Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px] pt-1">
                {q.options.map((opt) => (
                  <div
                    key={opt.id}
                    className={`px-2 py-1 rounded border truncate ${
                      opt.id === q.correctOption
                        ? 'bg-success-surface border-success-border text-success-text font-semibold'
                        : 'bg-subtle border-line text-ink-soft'
                    }`}
                  >
                    <strong>{opt.id}:</strong> {opt.text}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
