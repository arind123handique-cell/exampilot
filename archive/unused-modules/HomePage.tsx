import React, { useState, useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  BookOpen, GraduationCap, Target, Timer, Archive, Bot,
  ArrowRight, Clock, Flame, Trophy, Zap, Star, TrendingUp,
  BookMarked, Compass, Lightbulb, ShieldCheck, CalendarDays,
  Sparkles, Brain, ChevronRight, Play
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useToast } from '../context/ToastContext';
import { Counter } from '../components/animated/Counter';
import { SUPPORTED_EXAMS } from '../data/mockData';

const features = [
  {
    id: 'study-plan',
    icon: Compass,
    title: 'Study Plan',
    desc: 'Personalized daily goals and milestones',
    color: '#6366F1',
    gradient: 'from-indigo-500/20 to-indigo-600/5'
  },
  {
    id: 'syllabus',
    icon: BookOpen,
    title: 'Syllabus Explorer',
    desc: 'Explore weighted topics by exam',
    color: '#0891B2',
    gradient: 'from-cyan-500/20 to-cyan-600/5'
  },
  {
    id: 'mcq-practice',
    icon: Target,
    title: 'Practice MCQs',
    desc: 'Adaptive question banks with instant feedback',
    color: '#10B981',
    gradient: 'from-emerald-500/20 to-emerald-600/5'
  },
  {
    id: 'mock-test',
    icon: Timer,
    title: 'Mock Tests',
    desc: 'Full-length simulated exams under timed conditions',
    color: '#F59E0B',
    gradient: 'from-amber-500/20 to-amber-600/5'
  },
  {
    id: 'pyq',
    icon: Archive,
    title: 'PYQ Archive',
    desc: 'Previous year papers with detailed solutions',
    color: '#EC4899',
    gradient: 'from-pink-500/20 to-pink-600/5'
  },
  {
    id: 'ai-tutor',
    icon: Brain,
    title: 'AI Tutor',
    desc: 'Syllabus-grounded explanations powered by AI',
    color: '#8B5CF6',
    gradient: 'from-violet-500/20 to-violet-600/5'
  }
];

const stats = [
  { label: 'Questions Solved', value: 12847, suffix: '', prefix: '' },
  { label: 'Accuracy Rate', value: 87, suffix: '%', prefix: '' },
  { label: 'Current Streak', value: 14, suffix: ' days', prefix: '' },
  { label: 'Mocks Taken', value: 23, suffix: '', prefix: '' }
];

const activities = [
  { action: 'Completed', target: 'Reinforced Concrete Structures', time: '2 hours ago', icon: Target, color: '#10B981' },
  { action: 'Scored', target: '85% on Mock Test - Civil', time: '5 hours ago', icon: Trophy, color: '#F59E0B' },
  { action: 'Studied', target: 'General Studies - Polity', time: '1 day ago', icon: BookOpen, color: '#6366F1' },
  { action: 'Asked', target: 'AI Tutor: Shear Force Diagrams', time: '2 days ago', icon: Bot, color: '#8B5CF6' },
  { action: 'Revised', target: 'Fluid Mechanics Basics', time: '3 days ago', icon: Sparkles, color: '#EC4899' }
];

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { success } = useToast();
  const [clickedFeature, setClickedFeature] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: '-100px' });

  const handleFeatureClick = (id: string) => {
    setClickedFeature(id);
    success(`Navigating to ${features.find(f => f.id === id)?.title}`, 'Opening feature now...');
    setTimeout(() => setClickedFeature(null), 2000);
  };

  const handleDailyChallenge = () => {
    success('Daily Challenge Started!', 'You have 30 minutes to complete this challenge.');
  };

  return (
    <div className="min-h-screen">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <motion.div
          className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl blob-float-1"
        />
        <motion.div
          className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-3xl blob-float-2"
        />
        <motion.div
          className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full bg-violet-500/5 blur-3xl blob-float-3"
        />
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative z-10 pt-8 pb-16">
        <motion.div
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-fixed text-primary text-xs font-semibold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Welcome back{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}! 🎯
          </motion.div>

          <motion.h1
            className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-ink mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Your Study Journey,
            <br />
            <span className="text-primary">Powered by AI</span>
          </motion.h1>

          <motion.p
            className="text-lg text-muted leading-relaxed max-w-2xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Get personalized study plans, adaptive practice questions, and real-time AI tutoring
            tailored to your target examination.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button variant="primary" size="lg" iconRight={<ArrowRight className="w-4 h-4" />}>
              Start Studying
            </Button>
            <Button variant="outline" size="lg" iconRight={<Play className="w-4 h-4" />}>
              Explore Syllabus
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="w-1 h-8 bg-primary rounded-full" />
          <h2 className="font-display text-2xl font-bold text-ink">Features</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                className={`group p-6 rounded-2xl bg-card border border-line hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer relative overflow-hidden ${clickedFeature === feature.id ? 'ring-2 ring-primary/30' : ''}`}
                style={{ background: `linear-gradient(135deg, ${feature.color}08 0%, transparent 100%)` }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ scale: 1.05, rotate: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFeatureClick(feature.id)}
              >
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-5" style={{ backgroundColor: feature.color }}>
                  <motion.div
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="w-full h-full rounded-full"
                    style={{ backgroundColor: feature.color }}
                  />
                </div>
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform relative z-10"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <Icon className="w-7 h-7" style={{ color: feature.color }} />
                </div>
                <h3 className="font-display font-semibold text-ink mb-1 relative z-10">{feature.title}</h3>
                <p className="text-sm text-muted leading-relaxed relative z-10">{feature.desc}</p>
                <div className="flex items-center gap-1 mt-3 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                  <span>Explore</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Quick Stats Bar */}
      <section ref={statsRef} className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-card border border-line rounded-2xl p-8 shadow-card">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="font-display text-3xl sm:text-4xl font-bold text-ink mb-1">
                  {statsInView ? (
                    <Counter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                  ) : (
                    <span>0{stat.suffix}</span>
                  )}
                </div>
                <div className="text-sm text-muted">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Challenge Card */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="relative bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 sm:p-10 text-white overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0, 0.5, 0],
                  y: [0, -30, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              >
                <Star className="w-2 h-2 text-white/30" fill="currentColor" />
              </motion.div>
            ))}
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold mb-3">
                <Flame className="w-3.5 h-3.5" />
                Daily Challenge
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2">
                🔥 Challenge of the Day
              </h2>
              <p className="text-white/70 text-sm max-w-lg">
                Test your knowledge with a curated set of 10 questions. Complete it to earn bonus streak points and climb the leaderboard!
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="font-display text-3xl font-bold">30</div>
                <div className="text-xs text-white/60">Minutes</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <div className="font-display text-3xl font-bold">10</div>
                <div className="text-xs text-white/60">Questions</div>
              </div>
              <motion.div>
                <Button
                  variant="secondary"
                  className="bg-white text-primary border-transparent hover:bg-white/90"
                  onClick={handleDailyChallenge}
                >
                  Start Challenge
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Recent Activity Feed */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="w-1 h-8 bg-primary rounded-full" />
          <h2 className="font-display text-2xl font-bold text-ink">Recent Activity</h2>
          <Sparkles className="w-4 h-4 text-primary" />
        </motion.div>

        <div className="space-y-3">
          {activities.map((activity, i) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-line hover:border-line-strong transition-colors cursor-pointer"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ scale: 1.01 }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${activity.color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: activity.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-ink">
                    <span className="text-primary">{activity.action}</span>{' '}
                    {activity.target}
                  </div>
                  <div className="text-xs text-muted">{activity.time}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-faint flex-shrink-0" />
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Exam Selector Quick Access */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="w-1 h-8 bg-primary rounded-full" />
          <h2 className="font-display text-2xl font-bold text-ink">Target Exams</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SUPPORTED_EXAMS.map((exam, i) => (
            <motion.div
              key={exam.id}
              className="p-4 rounded-xl bg-card border border-line hover:border-primary/30 transition-all cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: exam.color }}
                />
                <span className="font-display font-semibold text-sm text-ink">{exam.name}</span>
              </div>
              <span className="text-xs text-muted">{exam.advtNumber}</span>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-subtle-strong text-muted">
                  {exam.category}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-fixed text-primary">
                  {exam.totalMarks} Marks
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
