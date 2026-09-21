import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Target,
  Flame,
  Award,
  ArrowRight,
  Sparkles,
  Activity,
  Brain,
  Shield,
  Clock,
  BookOpen,
  BarChart3,
  Radar,
  Zap,
  RefreshCw,
  CalendarDays,
  Layers
} from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge, BadgeTone } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { StatTile } from '../components/ui/StatTile';
import { ProgressRing } from '../components/ui/ProgressRing';
import { EmptyState } from '../components/ui/EmptyState';
import { cx } from '../utils/cn';
import { calculateSubjectMastery, generateStudyPlan, generateRemediationPlan } from '../services/curriculumBlueprint';
import { TestSubmission, StudyPlanItem, RemediationItem } from '../types';

type SubjectStatus = 'MASTERED' | 'STRONG' | 'ON_TRACK' | 'NEEDS_REVIEW' | 'CRITICAL';

const STATUS_TONES: Record<SubjectStatus, BadgeTone> = {
  MASTERED: 'success',
  STRONG: 'brand',
  ON_TRACK: 'info',
  NEEDS_REVIEW: 'warning',
  CRITICAL: 'danger'
};

interface SubjectBreakdownItem {
  subject: string;
  score: number;
  status: SubjectStatus;
  bar: string;
}

interface WeakSpotItem {
  topic: string;
  subject: string;
  accuracy: string;
  frequency: string;
}

export const ProgressAnalyticsPage: React.FC<{ onLaunchWeakDrill: () => void }> = ({
  onLaunchWeakDrill
}) => {
  const { user } = useAuth();

  const readinessScore = user?.stats.readinessScore || 0;
  const questionsAttempted = user?.stats.questionsAttempted || 0;
  const accuracyRate = user?.stats.accuracyRate || 0;
  const studyStreak = user?.stats.studyStreakDays || 1;
  const totalHours = user?.stats.totalStudyHours || 0;

  // Adaptive learning state
  const [masteryScores, setMasteryScores] = useState<Record<string, number>>({});
  const [subjectBreakdown, setSubjectBreakdown] = useState<SubjectBreakdownItem[]>([]);
  const [weakSpots, setWeakSpots] = useState<WeakSpotItem[]>([]);
  const [studyPlan, setStudyPlan] = useState<StudyPlanItem[]>([]);
  const [remediationItems, setRemediationItems] = useState<RemediationItem[]>([]);
  const [showMastery, setShowMastery] = useState(true);
  const [showStudyPlan, setShowStudyPlan] = useState(false);
  const [showAdaptiveTracker, setShowAdaptiveTracker] = useState(false);

  // Calculate telemetry & mastery on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const { getTestSubmissions, getPracticeAttempts } = await import('../services/firestore');
        const [submissions, attempts] = await Promise.all([
          getTestSubmissions(user?.uid || 'guest'),
          getPracticeAttempts(user?.uid || 'guest')
        ]);

        const mastery = calculateSubjectMastery(submissions);
        setMasteryScores(mastery);

        // Aggregate dynamic subject metrics
        const subCounts: Record<string, { correct: number; total: number }> = {};
        const topicCounts: Record<string, { subject: string; correct: number; total: number }> = {};

        attempts.forEach((att) => {
          const s = att.subject || 'General Studies';
          subCounts[s] = subCounts[s] || { correct: 0, total: 0 };
          subCounts[s].total += 1;
          if (att.isCorrect) subCounts[s].correct += 1;

          const t = att.topic || s;
          topicCounts[t] = topicCounts[t] || { subject: s, correct: 0, total: 0 };
          topicCounts[t].total += 1;
          if (att.isCorrect) topicCounts[t].correct += 1;
        });

        submissions.forEach((sub) => {
          const s = 'Mock Test Technical';
          subCounts[s] = subCounts[s] || { correct: 0, total: 0 };
          subCounts[s].total += sub.totalAttempted;
          subCounts[s].correct += sub.correctCount;
        });

        const computedBreakdown: SubjectBreakdownItem[] = Object.entries(subCounts).map(([subject, stats]) => {
          const score = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
          let status: SubjectStatus = 'ON_TRACK';
          let bar = 'bg-info';
          if (score >= 85) { status = 'MASTERED'; bar = 'bg-success'; }
          else if (score >= 70) { status = 'STRONG'; bar = 'bg-primary'; }
          else if (score >= 50) { status = 'ON_TRACK'; bar = 'bg-info'; }
          else if (score >= 35) { status = 'NEEDS_REVIEW'; bar = 'bg-warning'; }
          else { status = 'CRITICAL'; bar = 'bg-danger'; }

          return { subject, score, status, bar };
        });

        const computedWeak: WeakSpotItem[] = Object.entries(topicCounts)
          .filter(([, stat]) => stat.total >= 1 && (stat.correct / stat.total) < 0.7)
          .map(([topic, stat]) => ({
            topic,
            subject: stat.subject,
            accuracy: `${Math.round((stat.correct / stat.total) * 100)}%`,
            frequency: stat.total >= 3 ? 'High Exam Frequency' : 'Moderate Frequency'
          }))
          .slice(0, 5);

        setSubjectBreakdown(computedBreakdown);
        setWeakSpots(computedWeak);
      } catch (err) {
        console.warn('Analytics loading fallback:', err);
      }
    };
    loadData();
  }, [user]);

  // Generate study plan
  const handleGenerateStudyPlan = () => {
    const plan = generateStudyPlan(new Date('2026-12-31'), 90, 4, 'intermediate');
    setStudyPlan(plan);
    setShowStudyPlan(true);
  };

  // Generate remediation
  const handleGenerateRemediation = () => {
    const plan = generateRemediationPlan(
      weakSpots.length > 0 ? weakSpots.map(w => w.topic) : ['Core Fundamental Concepts', 'High-Yield Numerical Practice']
    );
    setRemediationItems(plan);
    setShowAdaptiveTracker(true);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* ------------------------------ Header ------------------------------ */}
      <Card className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="brand" size="md" icon={<Activity className="h-3 w-3" />}>
              Diagnostic intelligence
            </Badge>
            <span className="text-xs font-medium text-muted">{user?.preferences.examName}</span>
          </div>
          <h2 className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
            Progress &amp; exam readiness
          </h2>
          <p className="max-w-xl text-xs leading-relaxed text-muted">
            Readiness is modelled from speed, accuracy and syllabus weightage — not from hours spent.
          </p>
          <div className="pt-1">
            <Button
              size="sm"
              onClick={onLaunchWeakDrill}
              iconRight={<ArrowRight className="h-3.5 w-3.5" />}
            >
              Launch weak-spot drill
            </Button>
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-4">
          <ProgressRing
            value={readinessScore}
            size={112}
            thickness={9}
            tone={readinessScore >= 70 ? 'success' : readinessScore >= 50 ? 'brand' : 'danger'}
            caption="Exam readiness"
          />
          <div className="hidden space-y-1.5 sm:block">
            <Badge tone="success" size="md" icon={<TrendingUp className="h-3 w-3" />}>
              +8% vs cutoff
            </Badge>
            <p className="max-w-[11rem] text-[11px] leading-snug text-muted">
              Projected cutoff for this cycle is <strong className="text-ink">68%</strong>.
            </p>
          </div>
        </div>
      </Card>

      {/* ------------------------------ Metrics ------------------------------ */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          label="Readiness"
          value={`${readinessScore}%`}
          icon={<Target className="h-3.5 w-3.5" />}
          tone="brand"
          progress={readinessScore}
          hint="Weighted across attempted topics"
        />
        <StatTile
          label="Questions solved"
          value={questionsAttempted}
          icon={<CheckCircle2 className="h-3.5 w-3.5" />}
          tone="success"
          hint="Across 12 syllabus modules"
        />
        <StatTile
          label="Accuracy"
          value={`${accuracyRate}%`}
          icon={<Award className="h-3.5 w-3.5" />}
          tone="brand"
          progress={accuracyRate}
          hint="Top 15th percentile benchmark"
        />
        <StatTile
          label="Streak & time"
          value={studyStreak}
          unit="days"
          icon={<Flame className="h-3.5 w-3.5" />}
          tone="warning"
          hint={`${totalHours} study hours logged`}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* --------------------- Subject competency --------------------- */}
        <Card>
          <CardHeader
            title="Subject competency"
            subtitle={user?.preferences.examName || 'Exam Blueprint'}
            icon={<Activity className="h-4 w-4" />}
          />

          {subjectBreakdown.length === 0 ? (
            <EmptyState
              icon={<BarChart3 className="h-5 w-5" />}
              title="No subject competency data yet"
              description="Solve practice questions or take mock tests to calibrate your syllabus accuracy."
              actionLabel="Start practice drill"
              onAction={onLaunchWeakDrill}
            />
          ) : (
            <div className="space-y-4">
              {subjectBreakdown.map((item) => (
                <div key={item.subject} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-xs font-medium text-ink">{item.subject}</span>
                    <span className="flex flex-shrink-0 items-center gap-2">
                      <Badge tone={STATUS_TONES[item.status]}>
                        {item.status.replace('_', ' ')}
                      </Badge>
                      <span className="w-9 text-right text-xs font-bold tabular-nums text-ink">
                        {item.score}%
                      </span>
                    </span>
                  </div>
                  <div
                    className="h-1.5 w-full overflow-hidden rounded-full bg-subtle-strong"
                    role="progressbar"
                    aria-valuenow={item.score}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${item.subject} competency`}
                  >
                    <div
                      className={cx('h-full rounded-full transition-all duration-500', item.bar)}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* ---------------------- Weak spot triage ---------------------- */}
        <Card>
          <CardHeader
            title="Prioritized weak spots"
            subtitle="Ranked by error frequency and syllabus yield"
            icon={<AlertTriangle className="h-4 w-4" />}
            action={
              weakSpots.length > 0 ? (
                <Badge tone="danger">{weakSpots.length} critical</Badge>
              ) : undefined
            }
          />

          {weakSpots.length === 0 ? (
            <EmptyState
              icon={<Sparkles className="h-5 w-5" />}
              title="No weak spots detected"
              description="Once you have attempted a few drills, under-performing topics will surface here with a one-tap remediation drill."
              actionLabel="Start a drill"
              onAction={onLaunchWeakDrill}
            />
          ) : (
            <>
              <p className="mb-3 text-xs leading-relaxed text-muted">
                Focusing on these {weakSpots.length} areas yields the highest expected score boost.
              </p>

              <ul className="space-y-3">
                {weakSpots.map((spot) => (
                  <li
                    key={spot.topic}
                    className="card-interactive space-y-1.5 rounded-xl border border-line bg-subtle/50 p-3.5 hover:bg-subtle"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                        {spot.subject}
                      </span>
                      <Badge tone="danger">Accuracy {spot.accuracy}</Badge>
                    </div>
                    <h4 className="font-display text-xs font-semibold leading-snug text-ink">
                      {spot.topic}
                    </h4>
                    <div className="flex items-center justify-between gap-2 pt-0.5">
                      <span className="text-[11px] text-muted">Frequency: {spot.frequency}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={onLaunchWeakDrill}
                        iconRight={<ArrowRight className="h-3 w-3" />}
                      >
                        Drill
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>
      </div>

      {/* ------------------------------ Subject Mastery ------------------------------ */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Subject mastery"
            subtitle="Adaptive intelligence engine"
            icon={<Brain className="h-4 w-4" />}
            action={
              <Button size="sm" variant="ghost" onClick={() => setShowMastery(!showMastery)} iconRight={<RefreshCw className="h-3 w-3" />}>
                Refresh
              </Button>
            }
          />

          {showMastery && (
            <div className="space-y-4">
              {Object.entries(masteryScores).length > 0 ? (
                Object.entries(masteryScores).map(([subject, score]) => (
                  <div key={subject} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate text-xs font-medium text-ink">{subject}</span>
                      <span className={`w-9 text-right text-xs font-bold tabular-nums ${score >= 70 ? 'text-success-text' : score >= 50 ? 'text-warning-text' : 'text-danger-text'}`}>
                        {score}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-subtle-strong" role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100}>
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${score >= 70 ? 'bg-success' : score >= 50 ? 'bg-warning' : 'bg-danger'}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState icon={<BarChart3 className="h-5 w-5" />} title="No mastery data yet" description="Attempt mock tests to build your subject mastery profile." actionLabel="Take a mock" onAction={() => window.location.reload()} />
              )}
            </div>
          )}
        </Card>

        {/* ---------------------- Adaptive Learning Progress ---------------------- */}
        <Card>
          <CardHeader
            title="Adaptive learning progress"
            subtitle="AI-driven improvement tracking"
            icon={<Sparkles className="h-4 w-4" />}
            action={
              <Badge tone="brand">{Object.keys(masteryScores).length} subjects</Badge>
            }
          />

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-subtle border border-line">
                <div className="text-[10px] uppercase font-bold text-muted-faint">Accuracy Trend</div>
                <div className="font-display font-bold text-lg text-ink mt-1">{accuracyRate}%</div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-success-text" />
                  <span className="text-[10px] text-success-text">+8% this cycle</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-subtle border border-line">
                <div className="text-[10px] uppercase font-bold text-muted-faint">Speed Index</div>
                <div className="font-display font-bold text-lg text-ink mt-1">{Math.round(questionsAttempted / Math.max(studyStreak, 1))}/day</div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-success-text" />
                  <span className="text-[10px] text-success-text">Improving</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Button size="sm" variant="outline" onClick={handleGenerateRemediation} icon={<Shield className="w-3.5 h-3.5" />}>
                Remediation Plan
              </Button>
              <Button size="sm" variant="outline" onClick={handleGenerateStudyPlan} icon={<CalendarDays className="w-3.5 h-3.5" />}>
                Study Plan
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowAdaptiveTracker(!showAdaptiveTracker)} icon={<Activity className="w-3.5 h-3.5" />}>
                Tracker
              </Button>
            </div>

            {showAdaptiveTracker && remediationItems.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-ink flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-warning" /> AI Remediation Path
                </h4>
                {remediationItems.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-subtle/50 border border-line text-xs">
                    <span className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${
                      item.type === 'theory' ? 'bg-info-surface text-info-text' :
                      item.type === 'medium' ? 'bg-brand text-brand-text' :
                      item.type === 'hard' ? 'bg-danger-surface text-danger-text' :
                      item.type === 'mini-test' ? 'bg-warning-surface text-warning-text' :
                      'bg-success-surface text-success-text'
                    }`}>{idx + 1}</span>
                    <div>
                      <span className="font-semibold text-ink">{item.phase}</span>
                      <p className="text-[10px] text-muted">{item.questions} questions — {item.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* ------------------------------ Study Plan Integration ------------------------------ */}
      {showStudyPlan && studyPlan.length > 0 && (
        <Card flush className="p-5 sm:p-6">
          <CardHeader
            title="AI Study Plan"
            subtitle="Adaptive learning → Practice → Revision → Mock Tests"
            icon={<CalendarDays className="h-4 w-4" />}
            action={
              <Button size="sm" variant="ghost" onClick={() => setShowStudyPlan(false)}>Close</Button>
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {studyPlan.slice(0, 6).map((week) => (
              <div key={week.week} className="p-4 rounded-xl bg-subtle border border-line space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Week {week.week}</span>
                  <Badge tone="brand">{week.hours}h</Badge>
                </div>
                <h4 className="font-display text-xs font-semibold text-ink">{week.focus}</h4>
                <ul className="space-y-1">
                  {week.activities.map((act, idx) => (
                    <li key={idx} className="text-[11px] text-ink-soft flex items-start gap-1">
                      <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                      {act}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
