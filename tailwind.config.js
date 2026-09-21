/** @type {import('tailwindcss').Config} */

/**
 * Design System v2 — token-driven theming.
 *
 * Semantic tokens are CSS custom properties (see `src/index.css`) defined as
 * space-separated RGB channels so Tailwind can still apply opacity modifiers,
 * e.g. `bg-card/60`, `text-ink/80`. Every token resolves differently in light
 * and dark mode, so components never hard-code a raw colour again.
 *
 * Prefer: bg-card · bg-canvas · bg-subtle · text-ink · text-muted · border-line
 * Legacy keys (surface / academic / primary) are kept so existing screens keep
 * compiling while they migrate.
 */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        /* ---- semantic surfaces ---- */
        canvas: 'rgb(var(--bg-canvas) / <alpha-value>)',
        card: 'rgb(var(--bg-surface) / <alpha-value>)',
        raised: 'rgb(var(--bg-raised) / <alpha-value>)',
        subtle: {
          DEFAULT: 'rgb(var(--bg-subtle) / <alpha-value>)',
          strong: 'rgb(var(--bg-subtle-2) / <alpha-value>)'
        },

        /* ---- inverted panels (code blocks, dark CTAs, overlays' content) ---- */
        inverse: {
          DEFAULT: 'rgb(var(--bg-inverse) / <alpha-value>)',
          hover: 'rgb(var(--bg-inverse-hover) / <alpha-value>)',
          line: 'rgb(var(--line-inverse) / <alpha-value>)'
        },

        /* ---- semantics ---- */
        line: {
          DEFAULT: 'rgb(var(--line) / <alpha-value>)',
          strong: 'rgb(var(--line-strong) / <alpha-value>)'
        },
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          soft: 'rgb(var(--ink-2) / <alpha-value>)'
        },
        muted: {
          DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
          faint: 'rgb(var(--muted-faint) / <alpha-value>)'
        },

        /* ---- brand ---- */
        primary: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          dark: 'rgb(var(--accent-strong) / <alpha-value>)',
          light: 'rgb(var(--accent-light) / <alpha-value>)',
          fixed: 'rgb(var(--accent-soft) / <alpha-value>)',
          'fixed-dim': 'rgb(var(--accent-soft-line) / <alpha-value>)',
          container: 'rgb(var(--accent) / <alpha-value>)',
          'on-container': 'rgb(var(--accent-soft-line) / <alpha-value>)'
        },

        /* ---- legacy aliases (retained for migration) ---- */
        surface: {
          DEFAULT: 'rgb(var(--bg-canvas) / <alpha-value>)',
          bright: 'rgb(var(--bg-surface) / <alpha-value>)',
          dim: 'rgb(var(--bg-subtle-2) / <alpha-value>)',
          lowest: 'rgb(var(--bg-surface) / <alpha-value>)',
          low: 'rgb(var(--bg-subtle) / <alpha-value>)',
          container: 'rgb(var(--bg-subtle) / <alpha-value>)',
          high: 'rgb(var(--bg-subtle-2) / <alpha-value>)',
          highest: 'rgb(var(--bg-subtle-2) / <alpha-value>)',
          variant: 'rgb(var(--bg-subtle-2) / <alpha-value>)'
        },
        'on-surface': {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          variant: 'rgb(var(--muted) / <alpha-value>)',
        },
        academic: {
          ink: 'rgb(var(--ink) / <alpha-value>)',
          muted: 'rgb(var(--muted) / <alpha-value>)',
          border: 'rgb(var(--line) / <alpha-value>)',
          'border-subtle': 'rgb(var(--line-strong) / <alpha-value>)',
          card: 'rgb(var(--bg-surface) / <alpha-value>)'
        },
        success: {
          DEFAULT: '#10b981',
          surface: 'rgb(var(--ok-soft) / <alpha-value>)',
          border: 'rgb(var(--ok-line) / <alpha-value>)',
          text: 'rgb(var(--ok-ink) / <alpha-value>)'
        },
        warning: {
          DEFAULT: '#f59e0b',
          surface: 'rgb(var(--warn-soft) / <alpha-value>)',
          border: 'rgb(var(--warn-line) / <alpha-value>)',
          text: 'rgb(var(--warn-ink) / <alpha-value>)'
        },
        danger: {
          DEFAULT: '#f43f5e',
          surface: 'rgb(var(--bad-soft) / <alpha-value>)',
          border: 'rgb(var(--bad-line) / <alpha-value>)',
          text: 'rgb(var(--bad-ink) / <alpha-value>)'
        },
        info: {
          DEFAULT: '#0ea5e9',
          surface: 'rgb(var(--info-soft) / <alpha-value>)',
          border: 'rgb(var(--info-line) / <alpha-value>)',
          text: 'rgb(var(--info-ink) / <alpha-value>)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Geist', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      borderRadius: {
        'sm': '0.25rem',
        'DEFAULT': '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
      },
      spacing: {
        'space-xs': '0.25rem',
        'space-sm': '0.5rem',
        'space-md': '1rem',
        'space-lg': '1.5rem',
        'space-xl': '2.5rem',
      },
      boxShadow: {
        'card': '0 1px 2px 0 rgb(var(--shadow) / 0.06), 0 1px 3px 0 rgb(var(--shadow) / 0.04)',
        'card-hover': '0 8px 24px -12px rgb(var(--shadow) / 0.28)',
        'pop': '0 16px 40px -16px rgb(var(--shadow) / 0.35)'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' }
        },
        fireFlicker: {
          '0%, 100%': { transform: 'scaleY(1) scaleX(1)', opacity: '1' },
          '25%': { transform: 'scaleY(1.15) scaleX(0.9)', opacity: '0.9' },
          '50%': { transform: 'scaleY(0.95) scaleX(1.05)', opacity: '1' },
          '75%': { transform: 'scaleY(1.1) scaleX(0.92)', opacity: '0.85' }
        },
        confettiDrop: {
          '0%': { transform: 'translateY(-100vh) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' }
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        wobble: {
          '0%': { transform: 'translateX(0) rotate(0deg)' },
          '15%': { transform: 'translateX(-25%) rotate(-5deg)' },
          '30%': { transform: 'translateX(20%) rotate(5deg)' },
          '45%': { transform: 'translateX(-15%) rotate(-3deg)' },
          '60%': { transform: 'translateX(10%) rotate(3deg)' },
          '75%': { transform: 'translateX(-5%) rotate(0deg)' },
          '100%': { transform: 'translateX(0) rotate(0deg)' }
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        },
        floatCoin: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-8px) rotate(5deg)' },
          '50%': { transform: 'translateY(0) rotate(-5deg)' },
          '75%': { transform: 'translateY(-4px) rotate(3deg)' }
        },
        shine: {
          '0%': { left: '-100%' },
          '50%, 100%': { left: '100%' }
        },
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        levelUpBounce: {
          '0%': { transform: 'scale(0) rotate(-180deg)', opacity: '0' },
          '50%': { transform: 'scale(1.2) rotate(10deg)', opacity: '1' },
          '70%': { transform: 'scale(0.95) rotate(-5deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' }
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.22s cubic-bezier(0.22, 1, 0.36, 1) both',
        shimmer: 'shimmer 1.6s infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'fire-flicker': 'fireFlicker 0.6s ease-in-out infinite',
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        wobble: 'wobble 0.6s ease-in-out',
        'gradient-shift': 'gradientShift 3s ease infinite',
        'float-coin': 'floatCoin 2s ease-in-out infinite',
        shine: 'shine 2s infinite',
        'count-up': 'countUp 0.4s cubic-bezier(0.22, 1, 0.36, 1) both',
        'level-up-bounce': 'levelUpBounce 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-in-left': 'slideInLeft 0.3s cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.22, 1, 0.36, 1) both'
      }
    },
  },
  plugins: [],
}
