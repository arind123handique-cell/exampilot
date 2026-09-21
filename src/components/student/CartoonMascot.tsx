import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, Lightbulb, Heart, PartyPopper, RefreshCw, Smile } from 'lucide-react';

export type MascotCharacter = 'owl' | 'fox' | 'bunny';
export type MascotState = 'welcoming' | 'thinking' | 'celebrating' | 'cheer_up' | 'finished' | 'idle';

interface CartoonMascotProps {
  character?: MascotCharacter;
  state?: MascotState;
  customMessage?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSpeechBubble?: boolean;
  interactive?: boolean;
  onCharacterChange?: (character: MascotCharacter) => void;
}

const MASCOT_MESSAGES: Record<MascotState, string[]> = {
  welcoming: [
    "Welcome aboard, Superstar! Ready to conquer your exam goals today? ✨",
    "Hey friend! Every practice question brings you closer to your dream rank! 🚀",
    "Great to see you! Put on your thinking cap and let's shine! 🌟"
  ],
  thinking: [
    "Take your time and read the statements carefully! You got this! 🧠",
    "Eliminate the wrong options first — trust your instincts! 💡",
    "Deep breath! You know this concept inside out! 🎯"
  ],
  celebrating: [
    "WOOHOO! Spot on! Brilliant answer, you're on fire! 🔥🎉",
    "YES! +1 mark secured! You're crushing this test! 🌟",
    "Magnificent! That's how a future topper solves questions! 🚀"
  ],
  cheer_up: [
    "No worries at all! Great effort — review the solution below to level up! 💪",
    "Mistakes are just stepping stones to mastery! Keep flying high! 🌈",
    "Don't sweat it! Take note of this concept and keep moving forward! 💫"
  ],
  finished: [
    "Exam Complete! Take a bow, Champion — you did fantastic! 🏆",
    "Spectacular dedication! Let's review your score and celebrate! 🥳",
    "Awesome job finishing the test! Your hard work is paying off! 🌟"
  ],
  idle: [
    "I'm right here cheering for you! Let's solve some questions! 🦉",
    "Consistency is your superpower! Keep up the momentum! 🚀",
    "Believe in yourself — you're destined for success! ✨"
  ]
};

export const CartoonMascot: React.FC<CartoonMascotProps> = ({
  character = 'owl',
  state = 'idle',
  customMessage,
  className = '',
  size = 'md',
  showSpeechBubble = true,
  interactive = true,
  onCharacterChange
}) => {
  // Pip the Owl is ExamPilot's fixed, permanent cartoon mascot companion
  const [activeChar] = useState<MascotCharacter>('owl');
  const [quoteIdx, setQuoteIdx] = useState(0);

  const cycleMessage = () => {
    setQuoteIdx((prev) => (prev + 1) % 3);
  };

  const handlePipClick = () => {
    if (!interactive) return;
    cycleMessage();
    onCharacterChange?.('owl');
  };

  const message = customMessage || MASCOT_MESSAGES[state][quoteIdx % MASCOT_MESSAGES[state].length];

  // Mobile & iPad optimized size scale map
  const sizeMap = {
    sm: { svg: 'w-12 h-12 sm:w-14 sm:h-14', bubble: 'text-[11px] max-w-[160px] sm:max-w-[200px] p-2' },
    md: { svg: 'w-16 h-16 sm:w-22 sm:h-22', bubble: 'text-xs max-w-[190px] sm:max-w-[260px] p-2 sm:p-2.5' },
    lg: { svg: 'w-22 h-22 sm:w-28 sm:h-28', bubble: 'text-xs sm:text-sm max-w-[220px] sm:max-w-[300px] p-2.5 sm:p-3' }
  };

  const currentSize = sizeMap[size];

  // State color themes
  const bubbleTone = {
    welcoming: 'from-amber-400/20 to-orange-400/20 border-amber-400/40 text-amber-950 dark:text-amber-100',
    thinking: 'from-sky-400/20 to-indigo-400/20 border-sky-400/40 text-sky-950 dark:text-sky-100',
    celebrating: 'from-emerald-400/20 to-teal-400/20 border-emerald-400/40 text-emerald-950 dark:text-emerald-100',
    cheer_up: 'from-pink-400/20 to-rose-400/20 border-pink-400/40 text-pink-950 dark:text-pink-100',
    finished: 'from-yellow-400/20 to-amber-500/20 border-yellow-400/40 text-amber-950 dark:text-amber-100',
    idle: 'from-indigo-400/20 to-purple-400/20 border-indigo-400/40 text-indigo-950 dark:text-indigo-100'
  }[state];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Mascot Cartoon Avatar */}
      <motion.div
        className={`relative cursor-pointer select-none ${currentSize.svg} flex-shrink-0`}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={handlePipClick}
        title="Tap Pip for motivation!"
      >
        {/* State Particle Effects */}
        {state === 'celebrating' && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute -top-3 -right-2 text-yellow-400 drop-shadow-md z-10"
          >
            <PartyPopper className="w-6 h-6 animate-bounce" />
          </motion.div>
        )}

        {state === 'thinking' && (
          <motion.div
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: -5, opacity: 1 }}
            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1 }}
            className="absolute -top-3 left-1/2 -translate-x-1/2 text-amber-400 drop-shadow-md z-10"
          >
            <Lightbulb className="w-5 h-5 fill-amber-300" />
          </motion.div>
        )}

        {state === 'finished' && (
          <motion.div
            initial={{ rotate: -15 }}
            animate={{ rotate: [ -15, 15, -15 ] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-3 -left-2 text-yellow-500 drop-shadow-md z-10"
          >
            <Trophy className="w-6 h-6 fill-yellow-400 text-yellow-600" />
          </motion.div>
        )}

        {/* ──────── SVG CARTOON CHARACTERS ──────── */}
        <AnimatePresence mode="wait">
          {activeChar === 'owl' && (
            <motion.svg
              key="owl"
              initial={{ scale: 0.8, rotate: -5, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.8, rotate: 5, opacity: 0 }}
              viewBox="0 0 100 100"
              className="w-full h-full drop-shadow-lg"
            >
              <defs>
                <linearGradient id="owlBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#3730a3" />
                </linearGradient>
                <linearGradient id="owlBellyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="100%" stopColor="#fde047" />
                </linearGradient>
                <linearGradient id="gogglesGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
              </defs>

              {/* Pilot Owl Body */}
              <motion.ellipse
                cx="50"
                cy="56"
                rx="32"
                ry="36"
                fill="url(#owlBodyGrad)"
                animate={state === 'celebrating' ? { y: [0, -6, 0] } : { y: [0, -2, 0] }}
                transition={{ repeat: Infinity, duration: state === 'celebrating' ? 0.6 : 2, ease: 'easeInOut' }}
              />

              {/* Owl Ear Tufts */}
              <polygon points="26,26 36,40 18,38" fill="#4338ca" />
              <polygon points="74,26 64,40 82,38" fill="#4338ca" />

              {/* Belly Feathers */}
              <ellipse cx="50" cy="64" rx="20" ry="24" fill="url(#owlBellyGrad)" />
              {/* Feathers markings */}
              <path d="M 44 56 Q 50 60 56 56" stroke="#ca8a04" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 42 64 Q 50 68 58 64" stroke="#ca8a04" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 45 72 Q 50 76 55 72" stroke="#ca8a04" strokeWidth="2" fill="none" strokeLinecap="round" />

              {/* Pilot Goggles Strap */}
              <rect x="22" y="38" width="56" height="5" rx="2" fill="#78350f" />
              {/* Goggles Left Lens */}
              <circle cx="37" cy="40" r="14" fill="#d97706" />
              <circle cx="37" cy="40" r="11" fill="url(#gogglesGrad)" />
              <ellipse cx="34" cy="37" rx="4" ry="2" fill="white" opacity="0.8" />
              {/* Goggles Right Lens */}
              <circle cx="63" cy="40" r="14" fill="#d97706" />
              <circle cx="63" cy="40" r="11" fill="url(#gogglesGrad)" />
              <ellipse cx="60" cy="37" rx="4" ry="2" fill="white" opacity="0.8" />

              {/* Cartoon Eyes */}
              <motion.circle
                cx="37"
                cy="40"
                r="6"
                fill="#0f172a"
                animate={state === 'thinking' ? { x: [0, 2, -2, 0] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <circle cx="35" cy="38" r="2.5" fill="white" />
              <motion.circle
                cx="63"
                cy="40"
                r="6"
                fill="#0f172a"
                animate={state === 'thinking' ? { x: [0, 2, -2, 0] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <circle cx="61" cy="38" r="2.5" fill="white" />

              {/* Beak */}
              <polygon points="46,47 54,47 50,56" fill="#f97316" />

              {/* Aviator Red Scarf */}
              <path d="M 32 74 C 40 79, 60 79, 68 74 L 70 80 C 60 86, 40 86, 30 80 Z" fill="#ef4444" />
              <motion.path
                d="M 62 76 C 68 84, 76 86, 78 94 L 70 96 C 66 88, 62 82, 60 77 Z"
                fill="#dc2626"
                animate={{ rotate: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              />

              {/* Left Wing (Waving if celebrating/welcoming) */}
              <motion.path
                d="M 22 50 Q 8 60 18 72 Q 24 64 25 56 Z"
                fill="#4338ca"
                animate={
                  state === 'celebrating' || state === 'welcoming'
                    ? { rotate: [0, -25, 0], originX: '22px', originY: '50px' }
                    : {}
                }
                transition={{ repeat: Infinity, duration: 0.8 }}
              />

              {/* Right Wing */}
              <motion.path
                d="M 78 50 Q 92 60 82 72 Q 76 64 75 56 Z"
                fill="#4338ca"
                animate={
                  state === 'celebrating'
                    ? { rotate: [0, 25, 0], originX: '78px', originY: '50px' }
                    : {}
                }
                transition={{ repeat: Infinity, duration: 0.8 }}
              />

              {/* Little Cute Orange Feet */}
              <ellipse cx="40" cy="92" rx="6" ry="3" fill="#f97316" />
              <ellipse cx="60" cy="92" rx="6" ry="3" fill="#f97316" />
            </motion.svg>
          )}

          {activeChar === 'fox' && (
            <motion.svg
              key="fox"
              initial={{ scale: 0.8, rotate: 5, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.8, rotate: -5, opacity: 0 }}
              viewBox="0 0 100 100"
              className="w-full h-full drop-shadow-lg"
            >
              <defs>
                <linearGradient id="foxOrange" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fb923c" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
              </defs>

              {/* Fox Big Ears */}
              <polygon points="20,18 42,40 18,48" fill="#ea580c" />
              <polygon points="23,24 38,40 22,44" fill="#fef08a" />
              <polygon points="80,18 58,40 82,48" fill="#ea580c" />
              <polygon points="77,24 62,40 78,44" fill="#fef08a" />

              {/* Fox Head & Cheeks */}
              <motion.ellipse
                cx="50"
                cy="54"
                rx="34"
                ry="28"
                fill="url(#foxOrange)"
                animate={state === 'celebrating' ? { y: [0, -6, 0] } : { y: [0, -2, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              />
              {/* White Cheek Tufts */}
              <path d="M 20 54 Q 35 68 50 72 Q 35 78 18 64 Z" fill="#ffffff" />
              <path d="M 80 54 Q 65 68 50 72 Q 65 78 82 64 Z" fill="#ffffff" />

              {/* Big Expressive Cartoon Eyes */}
              <ellipse cx="38" cy="48" rx="6" ry="8" fill="#1e293b" />
              <circle cx="36" cy="45" r="2.5" fill="#ffffff" />
              <circle cx="39" cy="51" r="1" fill="#ffffff" />

              <ellipse cx="62" cy="48" rx="6" ry="8" fill="#1e293b" />
              <circle cx="60" cy="45" r="2.5" fill="#ffffff" />
              <circle cx="63" cy="51" r="1" fill="#ffffff" />

              {/* Cute Little Button Nose */}
              <ellipse cx="50" cy="62" rx="4" ry="3" fill="#0f172a" />
              <path d="M 46 66 Q 50 70 54 66" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />

              {/* Fluffy Bushy Tail */}
              <motion.path
                d="M 74 68 C 96 60, 98 84, 82 92 C 76 90, 70 82, 72 74 Z"
                fill="#ea580c"
                animate={{ rotate: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
              />
              <path d="M 86 86 C 94 80, 94 72, 88 68 C 84 76, 82 82, 86 86 Z" fill="#ffffff" />

              {/* Smart Glasses */}
              <circle cx="38" cy="48" r="10" stroke="#4f46e5" strokeWidth="2.5" fill="none" />
              <circle cx="62" cy="48" r="10" stroke="#4f46e5" strokeWidth="2.5" fill="none" />
              <path d="M 48 48 L 52 48" stroke="#4f46e5" strokeWidth="2.5" />
            </motion.svg>
          )}

          {activeChar === 'bunny' && (
            <motion.svg
              key="bunny"
              initial={{ scale: 0.8, rotate: -5, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.8, rotate: 5, opacity: 0 }}
              viewBox="0 0 100 100"
              className="w-full h-full drop-shadow-lg"
            >
              <defs>
                <linearGradient id="bunnyPink" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f472b6" />
                  <stop offset="100%" stopColor="#db2777" />
                </linearGradient>
              </defs>

              {/* Long Floppy Bouncy Ears */}
              <motion.ellipse
                cx="34"
                cy="22"
                rx="8"
                ry="20"
                fill="#ffffff"
                stroke="#e2e8f0"
                strokeWidth="1.5"
                animate={{ rotate: [-6, 6, -6] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              />
              <ellipse cx="34" cy="22" rx="4" ry="14" fill="#fbcfe8" />

              <motion.ellipse
                cx="66"
                cy="22"
                rx="8"
                ry="20"
                fill="#ffffff"
                stroke="#e2e8f0"
                strokeWidth="1.5"
                animate={{ rotate: [6, -6, 6] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              />
              <ellipse cx="66" cy="22" rx="4" ry="14" fill="#fbcfe8" />

              {/* Bunny Round Head */}
              <motion.ellipse
                cx="50"
                cy="56"
                rx="30"
                ry="28"
                fill="#ffffff"
                stroke="#e2e8f0"
                strokeWidth="1.5"
                animate={state === 'celebrating' ? { y: [0, -8, 0] } : { y: [0, -2, 0] }}
                transition={{ repeat: Infinity, duration: state === 'celebrating' ? 0.5 : 2 }}
              />

              {/* Cute Rosy Blushing Cheeks */}
              <ellipse cx="30" cy="58" rx="5" ry="3" fill="#f472b6" opacity="0.6" />
              <ellipse cx="70" cy="58" rx="5" ry="3" fill="#f472b6" opacity="0.6" />

              {/* Big Anime Eyes */}
              <ellipse cx="38" cy="50" rx="5" ry="7" fill="#0f172a" />
              <circle cx="36" cy="47" r="2.5" fill="#ffffff" />
              <ellipse cx="62" cy="50" rx="5" ry="7" fill="#0f172a" />
              <circle cx="60" cy="47" r="2.5" fill="#ffffff" />

              {/* Heart Nose & Smile */}
              <polygon points="48,58 52,58 50,61" fill="#ec4899" />
              <path d="M 46 62 Q 50 66 54 62" stroke="#0f172a" strokeWidth="1.5" fill="none" strokeLinecap="round" />

              {/* Cute Astronaut / Pilot Ribbon */}
              <rect x="44" y="76" width="12" height="6" rx="2" fill="url(#bunnyPink)" />
              <polygon points="40,79 44,76 44,82" fill="#db2777" />
              <polygon points="60,79 56,76 56,82" fill="#db2777" />
            </motion.svg>
          )}
        </AnimatePresence>

        {/* Mascot Name Badge Tag */}
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.2 rounded-full bg-slate-900/85 dark:bg-slate-100 text-white dark:text-slate-900 text-[9px] font-bold shadow-xs">
          Pip 🦉
        </div>
      </motion.div>

      {/* Mascot Speech Bubble */}
      {showSpeechBubble && (
        <motion.div
          key={message}
          initial={{ opacity: 0, scale: 0.9, x: -6 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          className={`relative rounded-2xl border bg-gradient-to-r ${bubbleTone} shadow-sm backdrop-blur ${currentSize.bubble} cursor-pointer select-none flex-1 min-w-0`}
          onClick={cycleMessage}
          title="Click to hear another cheering thought from Pip!"
        >
          {/* Speech bubble pointer notch */}
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-r-[8px] border-r-current opacity-30" />
          <p className="font-semibold leading-tight sm:leading-snug break-words">
            {message}
          </p>
        </motion.div>
      )}
    </div>
  );
};
