import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Clock } from 'lucide-react';

interface TimerProps {
  initialSeconds: number;
  onTimeUp?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Timer: React.FC<TimerProps> = ({
  initialSeconds,
  onTimeUp,
  size = 'md',
  className = ''
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [previousSecond, setPreviousSecond] = useState(initialSeconds);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isRunning, setIsRunning] = useState(true);

  const isLow = seconds < 60 && seconds > 0;
  const isExpired = seconds <= 0;

  const getColor = useCallback(() => {
    if (seconds <= 0) return '#ef4444';
    if (seconds < 60) return '#f59e0b';
    return '#10b981';
  }, [seconds]);

  const color = getColor();

  // Timer tick
  useEffect(() => {
    if (!isRunning || isExpired) return;
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, isExpired, onTimeUp]);

  // Confetti when timer reaches 0
  useEffect(() => {
    if (seconds === 0 && !showConfetti) {
      setShowConfetti(true);
      try {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#10b981', '#f59e0b', '#ef4444', '#6366f1']
        });
      } catch (e) {
        console.warn('Confetti error:', e);
      }
    }
  }, [seconds, showConfetti]);

  // Track previous second for scale animation
  useEffect(() => {
    if (seconds !== previousSecond && seconds > 0) {
      setPreviousSecond(seconds);
    }
  }, [seconds, previousSecond]);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const sizeClasses = {
    sm: 'text-lg px-3 py-1',
    md: 'text-xl px-4 py-2',
    lg: 'text-3xl px-6 py-3'
  };

  return (
    <div className={`inline-flex items-center gap-2 relative ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={seconds}
          className={`${sizeClasses[size]} rounded-xl border font-mono font-bold tabular-nums flex items-center gap-2 transition-colors duration-300 ${
            isExpired
              ? 'bg-danger-surface border-danger-border text-danger-text'
              : isLow
              ? 'bg-warning-surface border-warning-border text-warning-text'
              : 'bg-success-surface border-success-border text-success-text'
          }`}
          style={{ borderColor: isExpired ? undefined : color }}
          animate={
            isLow && seconds > 0
              ? { x: [0, -4, 4, -4, 4, 0], transition: { duration: 0.4 } }
              : {}
          }
        >
          <Clock className="w-4 h-4 flex-shrink-0" />
          <motion.span
            key={seconds}
            initial={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 0.2 }}
          >
            {formatTime(seconds)}
          </motion.span>
        </motion.div>
      </AnimatePresence>

      {/* Animated ticking indicator */}
      {seconds > 0 && !isExpired && (
        <motion.div
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: color }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [1, 0.5, 1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}

      {/* Confetti overlay */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none overflow-visible"
          >
            <span className="text-2xl animate-bounce">🎉</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Timer;
