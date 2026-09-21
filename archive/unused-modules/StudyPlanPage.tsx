import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStudyPlan, updateDailyGoal } from '../services/firestore';
import { StudyPlan, DailyGoal } from '../types';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  Circle,
  PlayCircle,
  BookOpen,
  ArrowUpRight,
  Flame,
  Target,
  TrendingUp,
  CalendarDays,
  Flag,
  Timer,
  ListChecks
} from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge, BadgeTone } from '../components/ui/Badge';
import { StatTile } from '../components/ui/StatTile';
import { ProgressRing } from '../components/ui/ProgressRing';
import { PageSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../context/ToastContext';
import { cx } from '../utils/cn';

interface StudyPlanPageProps {
  onNavigateToPractice: () => void;
  onNavigateToSyllabus: () => void;
}

const GOAL_TONES: Record<DailyGoal['type'], BadgeTone> = {
  PRACTICE: 'brand',
  READING: 'info',
  MOCK: 'warning',
  REVISION: 'success'
};

export const StudyPlanPage: React.FC<StudyPlanPageProps> = ({
  onNavigateToPractice,
  onNavigateToSyllabus
}) => {
  const { user } = useAuth();
  const { success: toastSuccess } = useToast();
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      if (user) {
        const p = await getStudyPlan(user.uid, user.preferences.examId);
        setPlan(p);
      }
      setLoading(false);
    };
    fetchPlan();
  }, [user]);

  const handleToggleGoal = async (goal: DailyGoal) => {
    if (!user || !plan) return;
    const nextStatus: DailyGoal['status'] =
      goal.status === 'COMPLETED' ? 'PENDING' : goal.status === 'PENDING' ? 'IN_PROGRESS' : 'COMPLETED';

    // Optimistic update so the list responds instantly, then reconcile.
    setPlan({
      ...plan,
      dailyGoals: plan.dailyGoals.map((g) => (g.id === goal.id ? { ...g, status: nextStatus } : g))
    });

    try {
      const updatedGoals = await updateDailyGoal(user.uid, goal.id, nextStatus, user.preferences.examId);
      setPlan((current) => (current ? { ...current, dailyGoals: updatedGoals } : current));
      toastSuccess(
        nextStatus === 'COMPLETED' ? 'Goal completed!' : nextStatus === 'IN_PROGRESS' ? 'Goal in progress' : 'Goal reset',
        goal.title
      );
    } catch {
      // revert on failure
      setPlan((current) =>
        current ? { ...current, dailyGoals: current.dailyGoals.map((g) => (g.id === goal.id ? { ...g, status: goal.status } : g)) } : current
      );
    }
  };

  if (loading) {
    return <PageSkeleton />;
  }

  if (!plan) {
    return (
      <EmptyState
        className="mx-auto mt-10 max-w-xl"
        icon={<CalendarDays className="h-5 w-5" />}
        title="No study plan for this exam yet"
        description="Plans are generated against your target exam and diagnostic. Pick an exam in the sidebar, or start practising now — your results shape the schedule."
        actionLabel="Start practice"
        onAction={onNavigateToPractice}
        secondaryLabel="Browse syllabus"
        onSecondary={onNavigateToSyllabus}
      />
    );
  }

  const goals = plan.dailyGoals;
  const completedGoals = goals.filter((g) => g.status === 'COMPLETED');
  const progressPercent = goals.length
    ? Math.round((completedGoals.length / goals.length) * 100)
    : 0;
  const plannedMinutes = goals.reduce((total, goal) => total + goal.minutes, 0);
  const doneMinutes = completedGoals.reduce((total, goal) => total + goal.minutes, 0);
  const stats = user?.stats;

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* ------------------------------ Header ------------------------------ */}
      <Card className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="brand" size="md" icon={<Sparkles className="h-3 w-3" />}>
              Adaptive plan
            </Badge>
            <span className="text-xs font-medium text-muted">{user?.preferences.examName}</span>
            {user?.preferences.targetYear && (
              <span className="text-xs text-muted-faint">
                • {user.preferences.targetYear} cycle
              </span>
            )}
          </div>
          <h2 className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
            {user?.displayName ? `Let's go, ${user.displayName.split(' ')[0]}` : 'Your study trajectory'}
          </h2>
          <p className="max-w-xl text-xs leading-relaxed text-muted">
            Sequenced from high-yield topic weightage and your last diagnostic. Toggle a task to move it
            from pending → in progress → done.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button size="sm" onClick={onNavigateToPractice} icon={<PlayCircle className="h-3.5 w-3.5" />}>
              Resume practice
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={onNavigateToSyllabus}
              icon={<BookOpen className="h-3.5 w-3.5" />}
            >
              Syllabus explorer
            </Button>
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-4">
          <ProgressRing
            value={progressPercent}
            size={104}
            thickness={9}
            tone={progressPercent >= 80 ? 'success' : 'brand'}
            caption={`${completedGoals.length}/${goals.length} done`}
          />
          <div className="hidden space-y-2 sm:block">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                Minutes today
              </div>
              <div className="font-display text-lg font-bold tabular-nums text-ink">
                {doneMinutes}
                <span className="text-sm font-medium text-muted"> / {plannedMinutes}</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                Weekly target
              </div>
              <div className="font-display text-lg font-bold tabular-nums text-ink">
                {plan.weeklyTargetHours}
                <span className="text-sm font-medium text-muted"> hrs</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ------------------------------ Metrics ------------------------------ */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          label="Streak"
          value={stats?.studyStreakDays ?? 1}
          unit="days"
          icon={<Flame className="h-3.5 w-3.5" />}
          tone="warning"
          hint="Keep one task a day to protect it"
        />
        <StatTile
          label="Readiness"
          value={`${stats?.readinessScore ?? 0}%`}
          icon={<Target className="h-3.5 w-3.5" />}
          tone="brand"
          progress={stats?.readinessScore ?? 0}
          hint="Weighted across syllabus coverage"
        />
        <StatTile
          label="Accuracy"
          value={`${stats?.accuracyRate ?? 0}%`}
          icon={<TrendingUp className="h-3.5 w-3.5" />}
          tone="success"
          progress={stats?.accuracyRate ?? 0}
          hint={`${stats?.questionsAttempted ?? 0} questions attempted`}
        />
        <StatTile
          label="Study hours"
          value={stats?.totalStudyHours ?? 0}
          unit="hrs"
          icon={<Clock className="h-3.5 w-3.5" />}
          tone="neutral"
          hint="Logged across practice and mocks"
        />
      </div>

      {/* --------------------------- AI advisory --------------------------- */}
      <div className="flex items-start gap-3 rounded-2xl border border-primary-fixed-dim bg-gradient-to-r from-primary-fixed/80 via-card to-info-surface/80 p-4">
        <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm shadow-primary/25">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-ink">Pacing advisory</span>
            <Badge tone="danger">High yield</Badge>
          </div>
          <p className="text-xs leading-relaxed text-ink-soft">
            Reinforced concrete shear and limit-state flexure carry{' '}
            <strong className="font-semibold text-ink">28% of Technical Paper II</strong> in recent cycles.
            Hold a daily spaced-revision slot so development-length formulas stay retrievable.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* ------------------------ Today's goals ------------------------ */}
        <Card className="lg:col-span-2" flush>
          <div className="p-4 sm:p-5">
            <CardHeader
              title="Today's targets"
              subtitle="Tap a row to advance its status"
              icon={<ListChecks className="h-4 w-4" />}
              action={
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onNavigateToPractice}
                  iconRight={<ArrowUpRight className="h-3.5 w-3.5" />}
                >
                  Practice
                </Button>
              }
              className="mb-3"
            />

            {goals.length === 0 ? (
              <EmptyState
                icon={<CalendarDays className="h-5 w-5" />}
                title="No targets scheduled yet"
                description="Generate a plan or jump straight into practice — your progress feeds tomorrow's schedule."
                actionLabel="Start practice"
                onAction={onNavigateToPractice}
                secondaryLabel="Open syllabus"
                onSecondary={onNavigateToSyllabus}
              />
            ) : (
              <ul className="space-y-2">
                {goals.map((goal) => {
                  const isCompleted = goal.status === 'COMPLETED';
                  const isInProgress = goal.status === 'IN_PROGRESS';
                  return (
                    <li key={goal.id}>
                      <button
                        onClick={() => handleToggleGoal(goal)}
                        aria-label={`${goal.title} — mark as ${
                          isCompleted ? 'pending' : isInProgress ? 'completed' : 'in progress'
                        }`}
                        className={cx(
                          'flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition',
                          isCompleted
                            ? 'border-line bg-subtle/70'
                            : isInProgress
                            ? 'border-primary/40 bg-primary-fixed/50'
                            : 'border-line bg-card hover:border-line-strong hover:bg-subtle/50'
                        )}
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <span className="flex-shrink-0">
                            {isCompleted ? (
                              <CheckCircle2 className="h-5 w-5 text-success" />
                            ) : isInProgress ? (
                              <PlayCircle className="h-5 w-5 text-primary" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-faint" />
                            )}
                          </span>
                          <span className="min-w-0">
                            <span
                              className={cx(
                                'block truncate text-xs font-semibold',
                                isCompleted ? 'text-muted line-through' : 'text-ink'
                              )}
                            >
                              {goal.title}
                            </span>
                            <span className="mt-0.5 flex items-center gap-2 text-[11px] text-muted">
                              <span className="truncate font-medium text-muted">{goal.subject}</span>
                              <span aria-hidden="true">•</span>
                              <span className="flex flex-shrink-0 items-center gap-1 tabular-nums">
                                <Timer className="h-3 w-3" />
                                {goal.minutes}m
                              </span>
                            </span>
                          </span>
                        </span>

                        <Badge tone={isCompleted ? 'neutral' : GOAL_TONES[goal.type]}>
                          {goal.type}
                        </Badge>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Quick launchers */}
          <div className="grid grid-cols-1 gap-3 border-t border-line bg-subtle/50 p-4 sm:grid-cols-2 sm:p-5">
            <button
              onClick={onNavigateToSyllabus}
              className="card-interactive rounded-xl border border-line bg-card p-3.5 text-left"
            >
              <BookOpen className="h-5 w-5 text-primary" />
              <div className="mt-2 font-display text-xs font-semibold text-ink">
                Syllabus breakdown
              </div>
              <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
                Weighted topics, clause-level detail and revision summaries.
              </p>
            </button>
            <button
              onClick={onNavigateToPractice}
              className="card-interactive rounded-xl border border-line bg-card p-3.5 text-left"
            >
              <PlayCircle className="h-5 w-5 text-success-text" />
              <div className="mt-2 font-display text-xs font-semibold text-ink">
                Instant 10-question drill
              </div>
              <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
                Timed set with instant solutions and trap explanations.
              </p>
            </button>
          </div>
        </Card>

        {/* -------------------------- Milestones -------------------------- */}
        <Card flush>
          <div className="p-4 sm:p-5">
            <CardHeader
              title="Phases & milestones"
              subtitle="Long-range pacing to exam day"
              icon={<Flag className="h-4 w-4" />}
              className="mb-4"
            />

            {plan.milestones.length === 0 ? (
              <EmptyState
                icon={<Flag className="h-5 w-5" />}
                title="No milestones yet"
                description="Milestones appear once a plan has been generated for your target cycle."
              />
            ) : (
              <ol className="space-y-4">
                {plan.milestones.map((milestone) => (
                  <li
                    key={milestone.id}
                    className="relative border-l-2 border-line pl-5 last:border-transparent last:pb-0"
                  >
                    <span
                      className={cx(
                        'absolute -left-[9px] top-0 flex h-4 w-4 items-center justify-center rounded-full border-2 bg-card',
                        milestone.completed
                          ? 'border-success-border bg-success'
                          : milestone.progressPercent > 0
                          ? 'border-primary'
                          : 'border-line-strong'
                      )}
                    >
                      {milestone.completed && <CheckCircle2 className="h-3 w-3 text-white" />}
                    </span>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-faint">
                          {milestone.dateRange}
                        </span>
                        <span className="text-xs font-semibold tabular-nums text-ink-soft">
                          {milestone.progressPercent}%
                        </span>
                      </div>
                      <h4 className="font-display text-xs font-semibold text-ink">
                        {milestone.title}
                      </h4>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-subtle-strong">
                        <div
                          className={cx(
                            'h-full rounded-full transition-all duration-500',
                            milestone.completed ? 'bg-success' : 'bg-primary'
                          )}
                          style={{ width: `${milestone.progressPercent}%` }}
                        />
                      </div>
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {milestone.targetTopics.map((topic, index) => (
                          <span
                            key={`${milestone.id}-${index}`}
                            className="rounded-md border border-line bg-subtle px-1.5 py-0.5 text-[10px] font-medium text-muted"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
