import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SUPPORTED_EXAMS } from '../data/mockData';
import { CheckCircle2, ArrowRight, BookOpen, Clock, Calendar, Trophy, Sparkles } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { OnboardingHero } from '../components/animated/OnboardingHero';

interface OnboardingPageProps {
  onComplete: () => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const { user, updatePreferences } = useAuth();
  const { success: toastSuccess } = useToast();

  const [selectedExamId, setSelectedExamId] = useState(user?.preferences.examId || 'apsc-ae-civil');
  const [targetYear, setTargetYear] = useState(user?.preferences.targetYear || 2026);
  const [dailyHours, setDailyHours] = useState(user?.preferences.dailyHoursGoal || 4);
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>(
    user?.preferences.level || 'intermediate'
  );
  const [saving, setSaving] = useState(false);

  const selectedExam = SUPPORTED_EXAMS.find((e) => e.id === selectedExamId) || SUPPORTED_EXAMS[0];

  const handleFinish = async () => {
    setSaving(true);
    try {
      await updatePreferences({
        examId: selectedExam.id as any,
        examName: selectedExam.name,
        advtNumber: selectedExam.advtNumber,
        targetYear,
        dailyHoursGoal: dailyHours,
        level,
        onboarded: true
      });
      toastSuccess('Trajectory saved', `${selectedExam.name} • ${dailyHours}h/day • ${targetYear}`);
      onComplete();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8 animate-fadeIn relative">
      <AnimatedBackground />
      <OnboardingHero />

      {/* Banner */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-primary/15 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-indigo-100">
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            AI-Driven Study Calibration
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">
            Configure Your Exam Trajectory
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 font-normal">
            Calibrate the syllabus engine, question difficulty, and spaced repetition schedule to your specific competitive examination.
          </p>
        </div>
      </div>

      {/* Step 1: Select Examination */}
      <Card flush className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-semibold text-ink text-sm sm:text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-fixed text-primary text-xs font-bold flex items-center justify-center">1</span>
              Select Target Examination
            </h3>
            <p className="text-xs text-muted mt-0.5">Syllabus structure and PYQ repository will map directly to this selection.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {SUPPORTED_EXAMS.map((exam) => {
            const isSelected = selectedExamId === exam.id;
            return (
              <div
                key={exam.id}
                onClick={() => setSelectedExamId(exam.id as any)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-primary bg-primary-fixed shadow-sm'
                    : 'border-line hover:border-line-strong bg-card'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-semibold text-sm text-ink truncate">
                        {exam.name}
                      </h4>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />}
                    </div>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-subtle-strong text-ink-soft">
                      {exam.advtNumber}
                    </span>
                    <p className="text-xs text-muted leading-relaxed mt-1 line-clamp-2">
                      {exam.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Step 2: Target Year & Daily Hours */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Target Year */}
        <Card flush className="p-6 space-y-4">
          <h3 className="font-display font-semibold text-ink text-sm flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary-fixed text-primary text-xs font-bold flex items-center justify-center">2</span>
            Target Examination Cycle
          </h3>
          <p className="text-xs text-muted">Select when you intend to sit for the examination.</p>
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            {[2025, 2026, 2027].map((yr) => (
              <button
                key={yr}
                onClick={() => setTargetYear(yr)}
                className={`py-3 px-2 rounded-xl text-center border-2 font-display text-xs font-bold transition ${
                  targetYear === yr
                    ? 'border-primary bg-primary-fixed text-primary'
                    : 'border-line hover:border-line-strong text-ink-soft bg-card'
                }`}
              >
                <Calendar className="w-4 h-4 mx-auto mb-1 text-muted-faint" />
                {yr} Cycle
              </button>
            ))}
          </div>
        </Card>

        {/* Daily Study Commitment */}
        <Card flush className="p-6 space-y-4">
          <h3 className="font-display font-semibold text-ink text-sm flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary-fixed text-primary text-xs font-bold flex items-center justify-center">3</span>
            Daily Study Target
          </h3>
          <p className="text-xs text-muted">Determines daily goal generation and milestone pacing.</p>
          <div className="grid grid-cols-4 gap-2 pt-2">
            {[2, 4, 6, 8].map((hrs) => (
              <button
                key={hrs}
                onClick={() => setDailyHours(hrs)}
                className={`py-3 px-1 rounded-xl text-center border-2 font-display text-xs font-bold transition ${
                  dailyHours === hrs
                    ? 'border-primary bg-primary-fixed text-primary'
                    : 'border-line hover:border-line-strong text-ink-soft bg-card'
                }`}
              >
                <Clock className="w-4 h-4 mx-auto mb-1 text-muted-faint" />
                {hrs} Hours
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Step 3: Preparation Level */}
      <Card flush className="p-6 space-y-4">
        <h3 className="font-display font-semibold text-ink text-sm flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary-fixed text-primary text-xs font-bold flex items-center justify-center">4</span>
          Current Preparation Baseline
        </h3>
        <p className="text-xs text-muted">The AI tutor will adjust question difficulty and technical explanations accordingly.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {[
            { id: 'beginner', title: 'Foundational', desc: 'Starting fresh or revisiting core technical theories.' },
            { id: 'intermediate', title: 'Moderate / Revising', desc: 'Completed standard textbooks; focusing on high-yield PYQs and mocks.' },
            { id: 'advanced', title: 'Exam Ready / Ranker', desc: 'Seeking edge cases, speed enhancement and high accuracy drills.' }
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => setLevel(item.id as any)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                level === item.id
                  ? 'border-primary bg-primary-fixed'
                  : 'border-line hover:border-line-strong bg-card'
              }`}
            >
              <h5 className="font-display font-semibold text-xs text-ink mb-1">{item.title}</h5>
              <p className="text-[11px] text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Submit Action Dock */}
      <Card flush className="flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="text-xs text-muted">
          Target: <strong className="text-ink font-semibold">{selectedExam.name}</strong> • {dailyHours}h/day • {targetYear}
        </div>
        <Button onClick={handleFinish} loading={saving} iconRight={<ArrowRight className="w-4 h-4" />} className="shadow-md shadow-primary/25">
          Generate Personalized Plan
        </Button>
      </Card>
    </div>
  );
};
