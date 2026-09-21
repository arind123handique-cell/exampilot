import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Flame, Sparkles, Award, TrendingUp, Trophy, Star, CalendarDays, Target, BookOpen } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  target?: string;
  earned?: boolean;
}

interface GamificationProps {
  studyStreak?: number;
  questionsSolved?: number;
  accuracyRate?: number;
  readinessScore?: number;
  totalStudyHours?: number;
  examName?: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-question',
    name: 'First Question',
    description: 'Answer your first MCQ',
    icon: Star,
    target: 'Attempt 1 question'
  },
  {
    id: 'streak-3',
    name: 'Study Streak',
    description: '3 consecutive days studying',
    icon: Flame,
    target: '3 days'
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: '7 consecutive days studying',
    icon: Flame,
    target: '7 days'
  },
  {
    id: 'streak-30',
    name: 'Monthly Master',
    description: '30 consecutive days studying',
    icon: CalendarDays,
    target: '30 days'
  },
  {
    id: 'accuracy-80',
    name: 'High Scorer',
    description: '80% accuracy in a mock test',
    icon: Target,
    target: '80% accuracy'
  },
  {
    id: 'mock-complete',
    name: 'Mock Champion',
    description: 'Complete a full-length mock test',
    icon: Trophy,
    target: '1 mock test'
  },
  {
    id: 'perfect-score',
    name: 'Perfect Score',
    description: '100% in a mock test',
    icon: Sparkles,
    target: '100% score'
  },
  {
    id: '100-questions',
    name: 'Dedicated Learner',
    description: 'Solved 100 questions',
    icon: BookOpen,
    target: '100 questions'
  }
];

export const Gamification: React.FC<GamificationProps> = ({
  studyStreak = 0,
  questionsSolved = 0,
  accuracyRate = 0,
  readinessScore = 0,
  totalStudyHours = 0,
  examName = 'ExamPilot'
}) => {
  const [earnedAchievements, setEarnedAchievements] = useState<Set<string>>(new Set());
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [level, setLevel] = useState(1);
  const xp = questionsSolved * 10 + studyStreak * 5 + Math.round(accuracyRate) * 2;
  const xpToNext = Math.pow(level, 2) * 100;

  useEffect(() => {
    // Check achievements
    const newEarned = new Set(earnedAchievements);
    const check = (ach: Achievement) => {
      if (newEarned.has(ach.id)) return;
      let met = false;
      switch (ach.id) {
        case 'first-question': met = questionsSolved >= 1; break;
        case 'streak-3': met = studyStreak >= 3; break;
        case 'streak-7': met = studyStreak >= 7; break;
        case 'streak-30': met = studyStreak >= 30; break;
        case 'accuracy-80': met = accuracyRate >= 80; break;
        case 'mock-complete': met = questionsSolved > 0; break;
        case 'perfect-score': met = accuracyRate >= 100; break;
        case '100-questions': met = questionsSolved >= 100; break;
      }
      if (met) newEarned.add(ach.id);
    };
    ACHIEVEMENTS.forEach(check);
    setEarnedAchievements(newEarned);

    // Level up logic
    const newLevel = Math.floor(xp / 100) + 1;
    if (newLevel > level) setLevel(newLevel);
  }, [studyStreak, questionsSolved, accuracyRate]);

  const handleLevelUp = () => {
    setShowLevelUp(true);
    setTimeout(() => setShowLevelUp(false), 3000);
    try {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA']
      });
    } catch {}
  };

  return (
    <div className="space-y-5" aria-label="Gamification dashboard">
      {/* XP & Level Bar */}
      <div className="card-cartoon border-primary text-primary p-5 rounded-2xl">
        <div className="flex items-center gap-3 mb-3">
          <Trophy className="w-6 h-6 text-primary" />
          <div>
            <div className="font-display font-bold text-lg text-primary">Level {level}</div>
            <div className="text-xs text-muted">Current level</div>
          </div>
        </div>

        <div className="h-2 rounded-full bg-subtle-strong overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary/80"
            style={{ width: `${Math.min(100, Math.max(0, (xp / xpToNext) * 100))}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted mt-2">
          <span>{xp} XP</span>
          <span>Lvl {level} → {xpToNext - xp} XP remaining</span>
        </div>
      </div>

      {/* Streak Counter */}
      <div className="card-cartoon border-success text-success p-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-success animate-fire-flicker" />
          <div>
            <div className="font-display font-bold text-2xl text-success">{studyStreak}</div>
            <div className="text-muted text-xs">day streak</div>
          </div>
        </div>
        <p className="text-xs text-success mt-1" onClick={() => window.alert(`🔥 Keep the streak going! Current: ${studyStreak} days`)}>
          🔥 On a {studyStreak}-day streak! Keep going!
        </p>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-2 gap-3 pt-3">
        {ACHIEVEMENTS.map((ach) => {
          const isEarned = earnedAchievements.has(ach.id);
          const met = ach.id === 'first-question'
            ? questionsSolved >= 1
            : ach.id === 'streak-3'
            ? studyStreak >= 3
            : ach.id === 'streak-7'
            ? studyStreak >= 7
            : ach.id === 'streak-30'
            ? studyStreak >= 30
            : ach.id === 'accuracy-80'
            ? accuracyRate >= 80
            : ach.id === 'mock-complete'
            ? questionsSolved > 0
            : ach.id === 'perfect-score'
            ? accuracyRate >= 100
            : ach.id === '100-questions'
            ? questionsSolved >= 100
            : false;
          return (
            <motion.div
              key={ach.id}
              className={`p-3 rounded-xl bg-subtle border ${
                earnedAchievements.has(ach.id) ? 'border-success' : 'border-line'
              } ${isEarned ? 'animate-pulse-glow' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`w-6 h-6 rounded-xl flex items-center justify-center mb-2 ${
                earnedAchievements.has(ach.id) ? 'bg-success/20 text-success' : 'text-muted'
              }`}>
                {React.createElement(ach.icon, { className: 'w-5 h-5' })}
              </div>
              <h5 className={`font-display font-semibold text-sm ${
                earnedAchievements.has(ach.id) ? 'text-success' : 'text-ink'
              }`}>
                {ach.name}
              </h5>
              <p className="text-[10px] text-muted-soft line-clamp-2">{ach.description}</p>
              <p className="text-[10px] text-ink-soft mt-1">
                {met ? '✓ Earned' : `Target: ${ach.target ?? ''}`}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Level Up Celebration */}
      {showLevelUp && (
        <AnimatePresence mode="wait">
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-primary-fixed text-white rounded-3xl p-8 text-center max-w-md animate-bounce"
              transition={{ type: "tween", duration: 0.8 }}
            >
              <Trophy className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
              <div className="text-4xl font-bold mb-2">LEVEL UP!</div>
              <div className="text-lg mb-4">You reached level {level}</div>
              <p className="text-muted mb-6">Congratulations!</p>
              <div
                onClick={() => handleLevelUp()}
                className="w-16 h-16 rounded-full bg-white/20 mx-auto text-white flex items-center justify-center text-3xl"
              >
                ✨
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

/* Fire flicker animation */
const style = document.createElement('style');
style.textContent = `
  @keyframes fire-flicker {
    0%, 100% { opacity: 0.8; transform: translateY(0); }
    50% { opacity: 1; transform: translateY(-4px); }
  }
`;
document.head.appendChild(style);

export default Gamification;