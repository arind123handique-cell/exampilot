import React from 'react';
import { cx } from '../../utils/cn';

interface ProgressRingProps {
  /** 0–100 */
  value: number;
  size?: number;
  thickness?: number;
  label?: React.ReactNode;
  caption?: React.ReactNode;
  tone?: 'brand' | 'success' | 'warning' | 'danger';
  className?: string;
}

const STROKES: Record<NonNullable<ProgressRingProps['tone']>, string> = {
  brand: 'rgb(var(--accent))',
  success: '#4ECDC4',
  warning: '#FFE66D',
  danger: '#FF6B6B'
};

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  size = 96,
  thickness = 8,
  label,
  caption,
  tone = 'brand',
  className
}) => {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (clamped / 100) * circumference;

  return (
    <div className={cx('inline-flex flex-col items-center', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgb(var(--bg-subtle-2))"
            strokeWidth={thickness}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={STROKES[tone]}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference - dash}`}
            className="transition-[stroke-dasharray] duration-700 ease-out progress-ring-ring"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {label ?? (
            <span className="font-display text-lg font-bold tabular-nums text-ink">{clamped}%</span>
          )}
        </div>
        <div
          className="absolute inset-0 flex items-center justify-center progress-ring-dot"
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: STROKES[tone],
            top: '50%',
            left: `calc(50% + ${radius * Math.cos(Math.PI / 2) - 4}px)`,
            transform: 'translateY(-50%)'
          }}
        />
      </div>
      {caption && <span className="mt-1.5 text-[11px] font-semibold text-muted">{caption}</span>}
    </div>
  );
};
