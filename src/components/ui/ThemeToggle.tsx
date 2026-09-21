import React, { useEffect, useRef, useState } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme, ThemePreference } from '../../context/ThemeContext';
import { cx } from '../../utils/cn';

const OPTIONS: Array<{ id: ThemePreference; label: string; icon: React.ReactNode }> = [
  { id: 'light', label: 'Light', icon: <Sun className="h-3.5 w-3.5" /> },
  { id: 'dark', label: 'Dark', icon: <Moon className="h-3.5 w-3.5" /> },
  { id: 'system', label: 'System', icon: <Monitor className="h-3.5 w-3.5" /> }
];

/** Compact segmented theme switch — sits in the app header. */
export const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const { preference, setPreference, theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={cx('relative', className)}>
      <button
        type="button"
        onClick={toggle}
        onContextMenu={(event) => {
          event.preventDefault();
          setOpen(true);
        }}
        /* Menu-button pattern: ArrowDown opens the full light/dark/system menu
           so keyboard users can reach the 'system' option, not just toggle. */
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            setOpen(true);
          }
        }}
        aria-label={`Switch theme (currently ${theme})`}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-card text-muted transition hover:border-line-strong hover:text-ink"
      >
        {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-1.5 w-40 animate-fadeIn rounded-xl border border-line bg-raised p-1 shadow-pop"
        >
          {OPTIONS.map((option) => (
            <button
              key={option.id}
              role="menuitemradio"
              aria-checked={preference === option.id}
              onClick={() => {
                setPreference(option.id);
                setOpen(false);
              }}
              className={cx(
                'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium transition',
                preference === option.id
                  ? 'bg-primary-fixed text-primary'
                  : 'text-ink-soft hover:bg-subtle'
              )}
            >
              {option.icon}
              <span className="flex-1 text-left">{option.label}</span>
              {preference === option.id && <Check className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
