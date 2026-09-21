import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Play,
  Layers,
  Trash2,
  Plus,
  Edit3,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { QuestionStemFormatter } from '../ui/QuestionStemFormatter';
import { useToast } from '../../context/ToastContext';
import { MCQQuestion, PYQPaper, MockTest } from '../../types';
import { hasLiveAi, getGeminiApiKey } from '../../services/geminiService';
import {
  parseExamPdfWithGemini,
  parseRawExamText,
  readFileAsBase64,
  ExamPaperMeta
} from '../../services/pdfParserService';
import { publishAdminPaper } from '../../services/adminPaperService';

interface PdfPaperIngestorProps {
  onPaperPublished?: (paper: PYQPaper, mock: MockTest) => void;
  onOpenTest?: (mock: MockTest) => void;
}

export const PdfPaperIngestor: React.FC<PdfPaperIngestorProps> = ({
  onPaperPublished,
  onOpenTest
}) => {
  const { success: toastSuccess, error: toastError } = useToast();

  // Mode: Upload PDF or Paste Text
  const [inputMode, setInputMode] = useState<'pdf' | 'text'>('pdf');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState('');

  // Paper Metadata
  const [meta, setMeta] = useState<ExamPaperMeta>({
    examName: 'Assam DWR (Water Resources) Paper II',
    year: 2026,
    paperType: 'Paper II (General Studies & General English — 100 Questions)',
    subject: 'General Studies',
    durationMinutes: 120,
    totalMarks: 100,
    negativeMarksPerIncorrect: 0.25
  });

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStatus, setProgressStatus] = useState('');
  const [extractedQuestions, setExtractedQuestions] = useState<MCQQuestion[]>([]);
  const [isPublished, setIsPublished] = useState(false);
  const [publishedMock, setPublishedMock] = useState<MockTest | null>(null);

  // Question editing modal / accordion
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setIsPublished(false);
      // Pre-fill exam name if file matches
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      if (nameWithoutExt.length > 5) {
        setMeta((prev) => ({ ...prev, examName: nameWithoutExt }));
      }
    }
  };

  const handleProcess = async () => {
    if (inputMode === 'pdf') {
      if (!selectedFile) {
        toastError('No PDF selected', 'Please choose an examination PDF file to upload.');
        return;
      }
      if (!hasLiveAi()) {
        toastError('Gemini Key Required', 'Please configure your Gemini API Key in the top right to use Multimodal OCR.');
        return;
      }

      setIsProcessing(true);
      setProgressStatus('Reading PDF file...');
      try {
        const { base64, mimeType } = await readFileAsBase64(selectedFile);
        const questions = await parseExamPdfWithGemini(base64, mimeType, meta, (status) => {
          setProgressStatus(status);
        });
        setExtractedQuestions(questions);
        setIsPublished(false);
        toastSuccess('Extraction complete', `Successfully extracted ${questions.length} questions from PDF!`);
      } catch (err: any) {
        console.error('PDF parsing error:', err);
        toastError('Extraction failed', err.message || 'Could not parse questions from PDF');
      } finally {
        setIsProcessing(false);
      }
    } else {
      if (!rawText.trim()) {
        toastError('No text provided', 'Please paste the examination question text.');
        return;
      }
      setIsProcessing(true);
      setProgressStatus('Parsing raw text...');
      try {
        const questions = parseRawExamText(rawText, meta);
        if (questions.length === 0) {
          throw new Error('Could not identify any questions. Check format: "1. Question stem... A) ... B) ... Answer: A"');
        }
        setExtractedQuestions(questions);
        setIsPublished(false);
        toastSuccess('Parsing complete', `Successfully parsed ${questions.length} questions!`);
      } catch (err: any) {
        toastError('Parsing error', err.message || 'Failed to parse text');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleUpdateQuestion = (index: number, updated: MCQQuestion) => {
    setExtractedQuestions((prev) => {
      const copy = [...prev];
      copy[index] = updated;
      return copy;
    });
  };

  const handleDeleteQuestion = (index: number) => {
    setExtractedQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddQuestion = () => {
    const nextNum = extractedQuestions.length + 1;
    const newQ: MCQQuestion = {
      id: `pyq-admin-${Date.now()}-q${String(nextNum).padStart(3, '0')}`,
      questionNumber: nextNum,
      stem: 'New question statement...',
      options: [
        { id: 'A', text: 'First option' },
        { id: 'B', text: 'Second option' },
        { id: 'C', text: 'Third option' },
        { id: 'D', text: 'Fourth option' }
      ],
      correctOption: 'A',
      explanation: 'Official explanation for this question.',
      subject: meta.subject,
      topic: meta.examName,
      difficulty: 'MEDIUM',
      questionType: 'CONCEPTUAL',
      sourceType: 'PYQ',
      pyqYear: meta.year,
      examId: meta.examId || 'custom-pyq'
    };
    setExtractedQuestions((prev) => [...prev, newQ]);
    setExpandedIndex(extractedQuestions.length);
  };

  const handlePublish = async () => {
    if (extractedQuestions.length === 0) {
      toastError('No questions', 'Extract or add questions before publishing.');
      return;
    }

    const timestamp = Date.now();
    const slug = meta.examName.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 20);
    const paperId = `pyq-${slug}-${meta.year}-${timestamp}`;
    const mockId = `mock-${slug}-${meta.year}-${timestamp}`;

    const publishedPaper: PYQPaper = {
      id: paperId,
      examName: meta.examName,
      year: meta.year,
      paperType: meta.paperType,
      totalQuestions: extractedQuestions.length,
      downloadAvailable: true,
      frequencyTags: [
        `${meta.subject} (100%)`,
        'Official State PYQ',
        'Verified Answer Keys'
      ],
      questions: extractedQuestions
    };

    const publishedMock: MockTest = {
      id: mockId,
      title: `${meta.examName} (${meta.year}) Official Mock`,
      examId: slug,
      paperName: meta.paperType,
      durationMinutes: meta.durationMinutes,
      totalMarks: meta.totalMarks || extractedQuestions.length,
      negativeMarksPerIncorrect: meta.negativeMarksPerIncorrect,
      sections: [
        {
          id: 'sec-all',
          name: `${meta.subject} — All Questions`,
          totalQuestions: extractedQuestions.length,
          questions: extractedQuestions
        }
      ]
    };

    try {
      await publishAdminPaper(publishedPaper, publishedMock);
      setIsPublished(true);
      setPublishedMock(publishedMock);
      toastSuccess('Paper Published!', `"${meta.examName}" is now available in Mock Tests & PYQ Archive.`);
      onPaperPublished?.(publishedPaper, publishedMock);
    } catch (err: any) {
      console.error('Publish error:', err);
      toastError('Publish failed', err.message || 'Could not save to database');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Banner */}
      <Card flush className="p-6 bg-gradient-to-r from-indigo-900/10 via-card to-card border-indigo-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge tone="brand" size="md">
                Admin Paper Digitizer
              </Badge>
              <span className="text-xs text-muted-faint">•</span>
              <span className="text-xs text-muted font-medium">Gemini Multimodal OCR Engine</span>
            </div>
            <h1 className="font-display font-bold text-xl sm:text-2xl text-ink">
              Previous Year Paper PDF Parser & Mock Test Generator
            </h1>
            <p className="text-xs text-muted max-w-2xl">
              Upload scanned official question papers in PDF or image format. Gemini AI performs high-accuracy OCR, extracts all MCQs, options, and solutions, and publishes them straight to the Student Mock Test and PYQ Archive database.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setInputMode('pdf')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                inputMode === 'pdf'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-subtle text-muted hover:text-ink'
              }`}
            >
              Upload PDF
            </button>
            <button
              onClick={() => setInputMode('text')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                inputMode === 'text'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-subtle text-muted hover:text-ink'
              }`}
            >
              Paste Text / OCR
            </button>
          </div>
        </div>
      </Card>

      {/* Paper Metadata & Upload Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload & Input Zone */}
        <Card flush className="p-5 lg:col-span-2 space-y-5">
          <h2 className="font-display font-bold text-sm text-ink flex items-center gap-2">
            <Upload className="w-4 h-4 text-indigo-500" />
            <span>1. Document Source</span>
          </h2>

          {inputMode === 'pdf' ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-line hover:border-indigo-500/50 hover:bg-indigo-50/5 dark:hover:bg-indigo-950/10 rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,image/png,image/jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-sm text-ink">
                  {selectedFile ? selectedFile.name : 'Click to select exam paper PDF'}
                </p>
                <p className="text-xs text-muted mt-1">
                  {selectedFile
                    ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB · Click to change file`
                    : 'Supports scanned or typed exam papers (PDF, PNG, JPG)'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink">Paste Question Paper Text</label>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                rows={8}
                placeholder="Paste OCR text here (e.g. 1. Who established the Ahom Kingdom? A) Sukapha B) Suhungmung C) Rudra Singha D) Gadadhar Singha Answer: A)..."
                className="w-full p-3.5 rounded-xl border border-line bg-surface text-xs font-mono text-ink placeholder:text-muted-faint focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
              />
            </div>
          )}

          {/* Action Button */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-muted">
              {isProcessing && (
                <div className="flex items-center gap-2 text-indigo-500 font-medium">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{progressStatus}</span>
                </div>
              )}
            </div>

            <Button
              onClick={handleProcess}
              disabled={isProcessing || (inputMode === 'pdf' && !selectedFile)}
              icon={<Sparkles className="w-4 h-4 text-warning" />}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
            >
              {isProcessing ? 'AI Processing...' : 'Extract Questions with Gemini AI'}
            </Button>
          </div>
        </Card>

        {/* Paper Details Form */}
        <Card flush className="p-5 space-y-4">
          <h2 className="font-display font-bold text-sm text-ink flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            <span>2. Paper Details</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-ink mb-1">Exam Name / Title</label>
              <input
                type="text"
                value={meta.examName}
                onChange={(e) => setMeta({ ...meta, examName: e.target.value })}
                className="w-full h-8.5 px-3 rounded-lg border border-line bg-surface text-ink text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-ink mb-1">Year</label>
                <input
                  type="number"
                  value={meta.year}
                  onChange={(e) => setMeta({ ...meta, year: Number(e.target.value) })}
                  className="w-full h-8.5 px-3 rounded-lg border border-line bg-surface text-ink text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-ink mb-1">Subject</label>
                <input
                  type="text"
                  value={meta.subject}
                  onChange={(e) => setMeta({ ...meta, subject: e.target.value })}
                  placeholder="e.g. General Studies, Civil Eng"
                  className="w-full h-8.5 px-3 rounded-lg border border-line bg-surface text-ink text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-ink mb-1">Paper Type / Subtitle</label>
              <input
                type="text"
                value={meta.paperType}
                onChange={(e) => setMeta({ ...meta, paperType: e.target.value })}
                className="w-full h-8.5 px-3 rounded-lg border border-line bg-surface text-ink text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-line">
              <div>
                <label className="block text-[11px] font-semibold text-ink mb-1">Duration</label>
                <input
                  type="number"
                  value={meta.durationMinutes}
                  onChange={(e) => setMeta({ ...meta, durationMinutes: Number(e.target.value) })}
                  className="w-full h-8.5 px-2.5 rounded-lg border border-line bg-surface text-ink text-xs focus:border-indigo-500 focus:outline-none"
                />
                <span className="text-[10px] text-muted-faint">minutes</span>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-ink mb-1">Total Marks</label>
                <input
                  type="number"
                  value={meta.totalMarks}
                  onChange={(e) => setMeta({ ...meta, totalMarks: Number(e.target.value) })}
                  className="w-full h-8.5 px-2.5 rounded-lg border border-line bg-surface text-ink text-xs focus:border-indigo-500 focus:outline-none"
                />
                <span className="text-[10px] text-muted-faint">marks</span>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-ink mb-1">Negative Penalty</label>
                <input
                  type="number"
                  step="0.05"
                  value={meta.negativeMarksPerIncorrect}
                  onChange={(e) => setMeta({ ...meta, negativeMarksPerIncorrect: Number(e.target.value) })}
                  className="w-full h-8.5 px-2.5 rounded-lg border border-line bg-surface text-ink text-xs focus:border-indigo-500 focus:outline-none"
                />
                <span className="text-[10px] text-muted-faint">per wrong</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Success Published Alert */}
      {isPublished && publishedMock && (
        <div className="p-4 rounded-2xl bg-success-surface border border-success-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-success-text flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-xs text-success-text">
                Exam Paper Published Successfully!
              </h4>
              <p className="text-[11px] text-ink-soft">
                All {extractedQuestions.length} questions have been written to the database. Students can now take this mock exam or practice it in the PYQ archive.
              </p>
            </div>
          </div>
          {onOpenTest && (
            <Button
              size="sm"
              onClick={() => onOpenTest(publishedMock)}
              iconRight={<Play className="w-3.5 h-3.5" />}
              className="bg-success text-white shadow-sm"
            >
              Test in CBT Mode
            </Button>
          )}
        </div>
      )}

      {/* Extracted Questions Review & Editor */}
      {extractedQuestions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="font-display font-bold text-base text-ink flex items-center gap-2">
                <span>Extracted Questions ({extractedQuestions.length})</span>
                <Badge tone="success" size="sm">
                  Verified Schema
                </Badge>
              </h3>
              <p className="text-xs text-muted">
                Review, edit stems, correct answers, or explanations before publishing to the database.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleAddQuestion} icon={<Plus className="w-3.5 h-3.5" />}>
                Add Question
              </Button>
              <Button
                size="sm"
                onClick={handlePublish}
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
                icon={<CheckCircle2 className="w-3.5 h-3.5" />}
              >
                Publish to Database & Mock Tests
              </Button>
            </div>
          </div>

          {/* Question List Accordion */}
          <div className="space-y-3">
            {extractedQuestions.map((q, idx) => {
              const isExpanded = expandedIndex === idx;
              return (
                <Card flush className="p-4 space-y-3 transition" key={q.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono font-bold text-[10px]">
                        Q.{idx + 1}
                      </span>
                      <span className="font-semibold text-ink-soft">{q.subject}</span>
                      <span className="text-muted-faint">•</span>
                      <span className="text-muted">{q.topic}</span>
                      <span className="px-2 py-0.5 rounded-full bg-success-surface text-success-text font-bold text-[10px]">
                        Key: ({q.correctOption})
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                        className="p-1 rounded text-muted hover:text-ink transition"
                        title={isExpanded ? 'Collapse' : 'Edit question'}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(idx)}
                        className="p-1 rounded text-muted hover:text-danger-text transition"
                        title="Delete question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <QuestionStemFormatter stem={q.stem} compact />

                  {/* Expanded Edit Form */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-line space-y-3 text-xs animate-fadeIn">
                      <div>
                        <label className="block font-semibold text-ink mb-1">Question Stem</label>
                        <textarea
                          value={q.stem}
                          onChange={(e) => handleUpdateQuestion(idx, { ...q, stem: e.target.value })}
                          rows={2}
                          className="w-full p-2.5 rounded-lg border border-line bg-surface text-xs text-ink focus:border-indigo-500 focus:outline-none"
                        />
                      </div>

                      {/* Options A, B, C, D */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, oIdx) => {
                          const isCorrect = opt.id === q.correctOption;
                          return (
                            <div
                              key={opt.id}
                              className={`p-2 rounded-lg border flex items-center gap-2 ${
                                isCorrect
                                  ? 'border-success-border bg-success-surface/40'
                                  : 'border-line bg-surface'
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => handleUpdateQuestion(idx, { ...q, correctOption: opt.id })}
                                className={`w-6 h-6 rounded-md font-mono font-bold text-xs flex items-center justify-center transition ${
                                  isCorrect
                                    ? 'bg-success text-white'
                                    : 'bg-subtle-strong text-muted hover:text-ink'
                                }`}
                                title="Click to set as correct answer"
                              >
                                {opt.id}
                              </button>
                              <input
                                type="text"
                                value={opt.text}
                                onChange={(e) => {
                                  const updatedOpts = [...q.options];
                                  updatedOpts[oIdx] = { ...opt, text: e.target.value };
                                  handleUpdateQuestion(idx, { ...q, options: updatedOpts });
                                }}
                                className="flex-1 bg-transparent border-none text-xs text-ink focus:outline-none"
                              />
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      <div>
                        <label className="block font-semibold text-ink mb-1">Explanation / Solution</label>
                        <textarea
                          value={q.explanation}
                          onChange={(e) => handleUpdateQuestion(idx, { ...q, explanation: e.target.value })}
                          rows={2}
                          className="w-full p-2.5 rounded-lg border border-line bg-surface text-xs text-ink focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
