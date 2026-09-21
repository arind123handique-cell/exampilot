import React, { useMemo, useState } from 'react';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge, StatusBadge } from '../ui/Badge';
import { StatTile } from '../ui/StatTile';
import { EmptyState } from '../ui/EmptyState';
import { cx as cn } from '../../utils/cn';
import type { MCQQuestion } from '../../types';
import { CIVIL_ENGINEERING_QUESTIONS, GENERAL_STUDIES_QUESTIONS } from '../../data/mockData';
import { TOPIC_KNOWLEDGE_MODULES } from '../../data/topicKnowledge';
import {
  RECIPES,
  generateQuestionSet,
  type GenerationReport
} from '../../services/mcqFactoryService';
import { getLastAiError } from '../../services/geminiService';
import {
  buildCoverageReport,
  topGenerationRequests,
  summariseCoverage,
  type GenerationRequest
} from '../../services/curriculumBlueprint';

interface QuestionFactoryPanelProps {
  /** Stems already in play, so a generated set cannot repeat them. */
  existingStems?: string[];
  onQuestionsGenerated?: (questions: MCQQuestion[]) => void;
  className?: string;
}

const COUNT_OPTIONS = [5, 10, 15];

const DIFFICULTY_TONES: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
  EASY: 'success',
  MEDIUM: 'warning',
  HARD: 'danger'
};

/**
 * The "generate more questions" surface.
 *
 * Deliberately not a free-text prompt box. A generator asked for "10 more MCQs"
 * quietly over-produces whatever is easiest and leaves the thin subjects thin,
 * so the panel starts from the blueprint: it shows where the bank is short, and
 * generates against a chosen gap. Two layers run behind the button — the
 * deterministic numerical recipes, whose answers are computed rather than
 * written, and the AI drafter when a key is configured. Every candidate is
 * validated before it is shown, and the report states which path actually ran.
 */
export const QuestionFactoryPanel: React.FC<QuestionFactoryPanelProps> = ({
  existingStems = [],
  onQuestionsGenerated,
  className
}) => {
  const [selected, setSelected] = useState<GenerationRequest | null>(null);
  const [count, setCount] = useState(10);
  const [running, setRunning] = useState(false);
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [report, setReport] = useState<GenerationReport | null>(null);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  /** Why live AI produced nothing, if it was attempted and failed. */
  const [aiReason, setAiReason] = useState<string | null>(null);

  const coverage = useMemo(
    () =>
      buildCoverageReport({
        questions: CIVIL_ENGINEERING_QUESTIONS,
        modules: TOPIC_KNOWLEDGE_MODULES.filter((module) => module.category === 'civil'),
        recipes: RECIPES.map((recipe) => ({
          subject: recipe.subject,
          topic: recipe.topic,
          subtopic: recipe.subtopic
        }))
      }),
    []
  );

  const requests = useMemo(() => topGenerationRequests(coverage, 6), [coverage]);

  const run = async (request: GenerationRequest | null, requestedCount: number) => {
    setRunning(true);
    setError(null);
    try {
      const result = await generateQuestionSet({
        count: requestedCount,
        seed: Date.now() % 100000,
        subjects: request ? [request.subject] : undefined,
        aiSubject: request?.subject,
        aiTopic: request?.topic,
        existingStems: [...existingStems, ...questions.map((question) => question.stem)]
      });
      setQuestions(result.questions);
      setReport(result.report);
      setRevealed({});
      // Surface the reason instead of silently falling back: a model that was
      // quietly 404-ing for months is exactly what this line exists to prevent.
      setAiReason(result.report.usedLiveAi ? null : getLastAiError());
      if (result.questions.length) onQuestionsGenerated?.(result.questions);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Generation failed');
    } finally {
      setRunning(false);
    }
  };

  const gm = GENERAL_STUDIES_QUESTIONS.length;

  return (
    <Card flush className={cn('p-5 sm:p-6 flex flex-col gap-5', className)}>
      <CardHeader
        title="Question factory"
        subtitle="Generate exam-style MCQs against the topics this paper is actually short of"
        icon={<span className="text-sm">⚙️</span>}
        action={
          <Badge tone={report?.usedLiveAi ? 'success' : 'info'} size="xs">
            {report?.usedLiveAi ? 'Live AI drafting' : 'Verified-recipe mode'}
          </Badge>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile
          label="Bank"
          value={coverage.summary.totalQuestions}
          unit="MCQs"
          hint={`${coverage.summary.totalNumerical} numerical`}
        />
        <StatTile
          label="Vs target"
          value={`${coverage.summary.coveragePercent}%`}
          tone={coverage.summary.coveragePercent < 50 ? 'warning' : 'success'}
          progress={Math.min(100, coverage.summary.coveragePercent)}
          hint={`target ${coverage.summary.targetQuestions}`}
        />
        <StatTile
          label="Recipes"
          value={coverage.summary.totalRecipes}
          unit="templates"
          hint="computed keys"
        />
        <StatTile
          label="No theory"
          value={coverage.summary.subjectsWithoutTheory.length}
          unit="subjects"
          tone={coverage.summary.subjectsWithoutTheory.length ? 'danger' : 'success'}
          hint={`${coverage.summary.blueprintSubjects} in blueprint`}
        />
      </div>

      <p className="text-xs text-muted leading-relaxed">{summariseCoverage(coverage)}</p>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">
            Biggest gaps — pick one to target
          </span>
          {selected && (
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="text-[11px] font-medium text-primary hover:text-primary-dark"
            >
              Clear target
            </button>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          {requests.map((request) => {
            const isSelected = selected?.topic === request.topic && selected?.subject === request.subject;
            return (
              <button
                key={`${request.subject}-${request.topic}`}
                type="button"
                onClick={() => setSelected(request)}
                className={cn(
                  'flex items-start justify-between gap-3 rounded-xl border px-3 py-2 text-left transition',
                  isSelected
                    ? 'border-primary bg-primary-fixed'
                    : 'border-line bg-card hover:bg-subtle'
                )}
              >
                <span className="min-w-0">
                  <span className="block truncate text-xs font-semibold text-ink">{request.topic}</span>
                  <span className="block truncate text-[11px] text-muted">
                    {request.subject} · {request.reason}
                  </span>
                </span>
                <Badge tone={isSelected ? 'brand' : 'neutral'} size="xs" caps={false}>
                  +{request.count}
                </Badge>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 rounded-xl border border-line p-0.5">
          {COUNT_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setCount(option)}
              className={cn(
                'h-7 rounded-lg px-2.5 text-xs font-medium transition',
                count === option ? 'bg-primary text-white' : 'text-muted hover:text-ink'
              )}
            >
              {option}
            </button>
          ))}
        </div>

        <Button
          size="sm"
          loading={running}
          onClick={() => run(selected, selected ? Math.min(count, 15) : count)}
        >
          {selected ? `Generate for ${selected.topic}` : 'Generate a balanced set'}
        </Button>

        {selected && (
          <span className="text-[11px] text-muted">
            Targeting <span className="font-medium text-ink">{selected.subject}</span>
          </span>
        )}
      </div>

      {error && (
        <p className="rounded-xl border border-danger-border bg-danger-surface px-3 py-2 text-xs text-danger-text">
          {error}
        </p>
      )}

      {report && (
        <div className="flex flex-wrap items-center gap-2 border-t border-line pt-3">
          <Badge tone="success" size="xs">{report.produced} produced</Badge>
          <Badge tone="info" size="xs">{report.numerical} numerical</Badge>
          <Badge tone="success" size="xs">{report.fromRecipes} computed key</Badge>
          <Badge tone="brand" size="xs">{report.aiGenerated} AI drafted</Badge>
          <Badge tone={report.rejected ? 'warning' : 'neutral'} size="xs">
            {report.rejected} rejected
          </Badge>
          <span className="text-[11px] text-muted">
            {report.usedLiveAi
              ? 'Model output was validated against the option-integrity rules before display.'
              : aiReason ??
                'No API key configured, so only the verified-recipe layer ran. AI drafting is available in the ingestion studio once a key is set.'}
          </span>
        </div>
      )}

      {questions.length > 0 && (
        <div className="flex flex-col gap-3">
          {questions.map((question, index) => {
            const isRevealed = Boolean(revealed[question.id]);
            const key = question.options.find((option) => option.id === question.correctOption);
            return (
              <div key={question.id} className="rounded-xl border border-line bg-card p-3.5">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-mono text-muted">Q{index + 1}</span>
                  <Badge tone="neutral" size="xs" caps={false}>
                    {question.subject}
                  </Badge>
                  <Badge tone="subtle" size="xs" caps={false}>
                    {question.topic}
                  </Badge>
                  <StatusBadge value={question.difficulty} toneMap={DIFFICULTY_TONES} />
                  {question.questionType === 'NUMERICAL' && (
                    <Badge tone="info" size="xs">
                      NUMERICAL
                    </Badge>
                  )}
                </div>

                <p className="text-sm leading-relaxed text-ink">{question.stem}</p>

                <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {question.options.map((option) => (
                    <div
                      key={option.id}
                      className={cn(
                        'flex items-start gap-2 rounded-lg border px-2.5 py-1.5 text-xs',
                        isRevealed && option.id === question.correctOption
                          ? 'border-success-border bg-success-surface text-success-text'
                          : 'border-line text-ink-soft'
                      )}
                    >
                      <span className="font-mono font-semibold">{option.id}</span>
                      <span className="min-w-0">{option.text}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-2.5 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      setRevealed((current) => ({ ...current, [question.id]: !current[question.id] }))
                    }
                  >
                    {isRevealed ? 'Hide working' : 'Show working'}
                  </Button>
                  {isRevealed && key && (
                    <span className="text-[11px] text-muted">
                      Key <span className="font-semibold text-ink">{key.id}</span>
                    </span>
                  )}
                </div>

                {isRevealed && (
                  <div className="mt-2 flex flex-col gap-2">
                    {question.formulaContext && (
                      <p className="rounded-lg bg-subtle px-2.5 py-1.5 font-mono text-[11px] text-ink-soft">
                        {question.formulaContext}
                      </p>
                    )}
                    <ol className="flex flex-col gap-1 text-xs text-ink-soft">
                      {(question.solutionSteps ?? []).map((step, stepIndex) => (
                        <li key={stepIndex}>{step}</li>
                      ))}
                    </ol>
                    <p className="text-xs text-muted">{question.explanation}</p>
                    {question.referenceSource && (
                      <p className="text-[11px] text-muted-faint">Ref: {question.referenceSource}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {questions.length === 0 && !report && (
        <EmptyState
          icon={<span className="text-base">🧪</span>}
          title="No generated set yet"
          description={`${coverage.summary.totalQuestions} civil MCQs and ${gm} GS MCQs are on file. Pick a gap above to generate practice targeted at it.`}
        />
      )}
    </Card>
  );
};

export default QuestionFactoryPanel;
