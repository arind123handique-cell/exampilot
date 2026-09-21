import React from 'react';
import { cx } from '../../utils/cn';
import { Card } from './Card';

export type StatTone = 'brand' | 'success' | 'warning' | 'danger' | 'neutral';

interface StatTileProps {
  label: string;
  value: React.ReactNode;
  unit?: string;
  hint?: string;
  icon?: React.ReactNode;
  tone?: StatTone;
  /** Optional 0–100 progress rendered as a hairline bar under the value. */
  progress?: number;
  className?: string;
}

const TONE_ICON: Record<StatTone, string> = {
  brand: 'bg-primary-fixed text-primary',
  success: 'bg-success-surface text-success-text',
  warning: 'bg-warning-surface text-warning-text',
  danger: 'bg-danger-surface text-danger-text',
  neutral: 'bg-subtle text-muted'
};

const TONE_BAR: Record<StatTone, string> = {
  brand: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  neutral: 'bg-muted'
};

/** Compact, scannable metric card — the building block of every dashboard. */
export const StatTile: React.FC<StatTileProps> = ({
  label,
  value,
  unit,
  hint,
  icon,
  tone = 'brand',
  progress,
  className
}) => (
  <Card className={cx('flex flex-col gap-2.5', className)}>
    <div className="flex items-start justify-between gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</span>
      {icon && (
        <span className={cx('flex h-7 w-7 items-center justify-center rounded-lg', TONE_ICON[tone])}>
          {icon}
        </span>
      )}
    </div>

    <div className="flex items-baseline gap-1">
      <span className="font-display text-xl font-bold tabular-nums text-ink sm:text-2xl">{value}</span>
      {unit && <span className="text-xs font-medium text-muted">{unit}</span>}
    </div>

    {typeof progress === 'number' && (
      <div className="h-1 w-full overflow-hidden rounded-full bg-subtle-strong">
        <div
          className={cx('h-full rounded-full transition-all duration-500', TONE_BAR[tone])}
          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        />
      </div>
    )}

    {hint && <p className="text-[11px] leading-snug text-muted-faint">{hint}</p>}
  </Card>
);
