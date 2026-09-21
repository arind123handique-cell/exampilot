import React from 'react';
import { cx } from '../../utils/cn';
import { Button } from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  /** Second, lower-emphasis path out of the empty state. */
  secondaryLabel?: string;
  onSecondary?: () => void;
  className?: string;
}

/**
 * Every empty surface should say what is missing and offer one obvious next
 * action — never a blank panel.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  className
}) => (
  <div
    className={cx(
      'flex flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong bg-subtle/60 px-6 py-10 text-center',
      className
    )}
  >
    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-card text-primary shadow-card">
      {icon}
    </div>
    <h3 className="font-display text-sm font-semibold text-ink">{title}</h3>
    <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted">{description}</p>
    {(actionLabel || secondaryLabel) && (
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {actionLabel && onAction && (
          <Button size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
        {secondaryLabel && onSecondary && (
          <Button size="sm" variant="ghost" onClick={onSecondary}>
            {secondaryLabel}
          </Button>
        )}
      </div>
    )}
  </div>
);
