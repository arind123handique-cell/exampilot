import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, CornerDownLeft, ArrowUp, ArrowDown, Moon, Sun, Sparkles } from 'lucide-react';
import { ActiveTab, ALL_NAV_ITEMS } from './navConfig';
import { cx } from '../../utils/cn';
import { useTheme } from '../../context/ThemeContext';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: ActiveTab) => void;
}

interface Command {
  id: string;
  label: string;
  group: string;
  hint?: string;
  icon: React.ReactNode;
  run: () => void;
}

/**
 * ⌘K / Ctrl+K palette. Keyboard-first navigation is the fastest way to make a
 * ten-module app feel small — and it is nearly free to build.
 */
export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const { theme, toggle } = useTheme();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const trapRef = useFocusTrap(isOpen);


  const commands: Command[] = useMemo(() => {
    const nav: Command[] = ALL_NAV_ITEMS.map((item) => {
      const Icon = item.icon;
      return {
        id: `nav-${item.id}`,
        label: item.label,
        group: 'Navigation',
        hint: item.desc,
        icon: <Icon className="h-4 w-4" />,
        run: () => onNavigate(item.id)
      };
    });

    return [
      ...nav,
      {
        id: 'theme-toggle',
        label: theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
        group: 'Appearance',
        hint: 'Theme preference',
        icon: theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />,
        run: toggle
      }
    ];
  }, [onNavigate, theme, toggle]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((command) =>
      `${command.label} ${command.group} ${command.hint ?? ''}`.toLowerCase().includes(q)
    );
  }, [commands, query]);

  // Reset + focus on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      const timer = window.setTimeout(() => inputRef.current?.focus(), 20);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => setActiveIndex(0), [query]);

  if (!isOpen) return null;

  const runCommand = (command?: Command) => {
    if (!command) return;
    command.run();
    onClose();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % Math.max(results.length, 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + results.length) % Math.max(results.length, 1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      runCommand(results[activeIndex]);
    }
  };

  // Keep the highlighted row in view while arrowing through results
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  let lastGroup = '';

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm"
      onMouseDown={onClose}
      role="presentation"
    >
      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onMouseDown={(event) => event.stopPropagation()}
        onKeyDown={handleKeyDown}
        className="w-full max-w-lg animate-fadeIn overflow-hidden rounded-2xl border border-line bg-raised shadow-pop"
      >
        <div className="flex items-center gap-2.5 border-b border-line px-4 py-3">
          <Search className="h-4 w-4 flex-shrink-0 text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Jump to a module or action…"
            aria-label="Search modules and actions"
            className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted-faint"
          />
          <kbd className="hidden sm:inline-flex rounded border border-line bg-subtle px-1.5 py-0.5 text-[10px] font-semibold text-muted">
            Esc
          </kbd>
        </div>

        <div ref={listRef} className="scroll-slim max-h-[52vh] overflow-y-auto p-1.5">
          {results.length === 0 && (
            <div className="flex flex-col items-center gap-1 px-4 py-8 text-center">
              <Sparkles className="h-4 w-4 text-muted" />
              <p className="text-xs font-medium text-ink-soft">No matches</p>
              <p className="text-[11px] text-muted">Try “mock”, “tutor”, “syllabus” or “dark”.</p>
            </div>
          )}

          {results.map((command, index) => {
            const showGroupHeader = command.group !== lastGroup;
            lastGroup = command.group;
            const Icon = command.icon;

            return (
              <React.Fragment key={command.id}>
                {showGroupHeader && (
                  <div className="px-2.5 pb-1 pt-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-faint">
                    {command.group}
                  </div>
                )}
                <button
                  data-index={index}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => runCommand(command)}
                  className={cx(
                    'flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition',
                    index === activeIndex ? 'bg-primary-fixed text-primary' : 'text-ink-soft'
                  )}
                >
                  <span
                    className={cx(
                      'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border',
                      index === activeIndex
                        ? 'border-primary-fixed-dim bg-card text-primary'
                        : 'border-line bg-subtle text-muted'
                    )}
                  >
                    {Icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold">{command.label}</span>
                    {command.hint && (
                      <span className="block truncate text-[11px] text-muted">{command.hint}</span>
                    )}
                  </span>
                  {index === activeIndex && <CornerDownLeft className="h-3.5 w-3.5 flex-shrink-0" />}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-line bg-subtle/60 px-4 py-2">
          <div className="flex items-center gap-3 text-[10px] font-medium text-muted">
            <span className="flex items-center gap-1">
              <ArrowUp className="h-3 w-3" />
              <ArrowDown className="h-3 w-3" />
              navigate
            </span>
            <span className="flex items-center gap-1">
              <CornerDownLeft className="h-3 w-3" />
              open
            </span>
          </div>
          <span className="text-[10px] font-semibold text-muted-faint">ExamPilot AI</span>
        </div>
      </div>
    </div>
  );
};
