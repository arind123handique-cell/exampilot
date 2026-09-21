import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, GraduationCap, Pencil, Target } from 'lucide-react';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const LOTTIE_URL = 'https://lottie.host/6b5e1f3c/learning.json';

interface OnboardingHeroProps {
  className?: string;
}

const features = [
  {
    icon: BookOpen,
    title: 'MCQ Practice',
    desc: 'Adaptive question banks with instant feedback',
    color: '#6366F1'
  },
  {
    icon: GraduationCap,
    title: 'Mock Tests',
    desc: 'Full-length simulated exams under timed conditions',
    color: '#0891B2'
  },
  {
    icon: Sparkles,
    title: 'AI Tutor',
    desc: 'Syllabus-grounded explanations powered by AI',
    color: '#F59E0B'
  }
];

const AnimatedSvgCharacter: React.FC = () => (
  <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto">
    <motion.g animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
      <circle cx="100" cy="80" r="30" fill="#6366F1" opacity="0.15" />
      <rect x="65" y="55" width="70" height="55" rx="12" fill="#6366F1" />
      <rect x="75" y="65" width="25" height="8" rx="3" fill="#818CF8" opacity="0.6" />
      <rect x="75" y="80" width="20" height="6" rx="2" fill="#818CF8" opacity="0.4" />
      <rect x="75" y="92" width="25" height="6" rx="2" fill="#818CF8" opacity="0.4" />
      <line x1="90" y1="110" x2="90" y2="130" stroke="#6366F1" strokeWidth="3" strokeLinecap="round" />
      <line x1="100" y1="110" x2="100" y2="135" stroke="#6366F1" strokeWidth="3" strokeLinecap="round" />
      <line x1="110" y1="110" x2="110" y2="130" stroke="#6366F1" strokeWidth="3" strokeLinecap="round" />
    </motion.g>
    <motion.circle
      cx="160" cy="40" r="6"
      fill="#F59E0B"
      animate={{ y: [0, -12, 0], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.circle
      cx="40" cy="50" r="4"
      fill="#10B981"
      animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
    />
    <motion.circle
      cx="180" cy="120" r="5"
      fill="#EC4899"
      animate={{ y: [0, -15, 0], opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
    />
    <motion.circle
      cx="30" cy="140" r="3"
      fill="#8B5CF6"
      animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
    />
    <motion.line
      x1="30" y1="140" x2="50" y2="155"
      stroke="#8B5CF6" strokeWidth="1.5" opacity="0.4"
      animate={{ opacity: [0.2, 0.6, 0.2] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  </svg>
);

export const OnboardingHero: React.FC<OnboardingHeroProps> = ({ className = '' }) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <div ref={sectionRef} className={`relative w-full overflow-hidden ${className}`}>
      {/* Floating decorative stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${5 + (i * 8.3) % 90}%`,
              top: `${10 + (i * 7.1) % 80}%`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.3, 0.8, 0.3],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          >
            <Sparkles className="w-3 h-3 text-primary/40" fill="currentColor" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-fixed text-primary text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Driven Study Engine
              </div>
            </motion.div>

            <motion.h1
              className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-ink leading-tight"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              Welcome to <span className="text-primary">ExamPilot</span>
              <br />
              <span className="text-muted">AI-Powered Prep</span>
            </motion.h1>

            <motion.p
              className="text-lg text-muted leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="typing-cursor">
                Master your exam with intelligent study plans, adaptive MCQs, and real-time AI tutoring.
              </span>
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
              >
                <Target className="w-4 h-4" />
                Get Started Free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-card text-ink border border-line rounded-xl font-semibold text-sm hover:border-line-strong transition-colors"
              >
                <Pencil className="w-4 h-4" />
                See How It Works
              </motion.button>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              className="flex gap-8 pt-4"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {[
                { label: 'Questions', value: '50K+' },
                { label: 'Students', value: '12K+' },
                { label: 'Accuracy', value: '94%' },
              ].map((stat, i) => (
                <div key={stat.label} className="text-center">
                  <div className="font-display text-2xl font-bold text-ink">{stat.value}</div>
                  <div className="text-xs text-muted">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Animation / Illustration */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative">
              <motion.div
                className="w-72 h-72 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 flex items-center justify-center backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <AnimatedSvgCharacter />
              </motion.div>
              {/* Decorative rings */}
              <motion.div
                className="absolute -top-4 -right-4 w-16 h-16 rounded-full border-2 border-primary/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute -bottom-2 -left-6 w-12 h-12 rounded-full border-2 border-primary/15"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="group p-5 rounded-2xl bg-card border border-line hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer"
                whileHover={{ scale: 1.05, rotate: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h4 className="font-display font-semibold text-sm text-ink mb-1">{feature.title}</h4>
                <p className="text-xs text-muted leading-relaxed">{feature.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingHero;
