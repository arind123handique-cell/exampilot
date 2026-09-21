import React from 'react';
import { cx } from '../../utils/cn';
import { motion } from 'framer-motion';

export type BadgeTone =
  | 'neutral'
  | 'subtle'
  | 'brand'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';
type BadgeSize = 'xs' | 'sm' | 'md';

interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  size?: BadgeSize;
  icon?: React.ReactNode;
  /** Force uppercase + letter-spacing. Off for sentence-case content like "Accuracy 33%". */
  caps?: boolean;
  /** Hairline border in the tone's colour. Off for flat, borderless chips. */
  bordered?: boolean;
  className?: string;
  /** Adds animated pulse glow for "new" badges */
  isNew?: boolean;
}

const CARTOON_TONES: Record<BadgeTone, string> = {
  neutral: 'badge-cartoon--coral',
  subtle: 'badge-cartoon--turquoise',
  brand: 'badge-cartoon--purple',
  success: 'badge-cartoon--mint',
  warning: 'badge-cartoon--yellow',
  danger: 'badge-cartoon--coral',
  info: 'badge-cartoon--sky'
};

const FILLS: Record<BadgeTone, string> = {
  neutral: 'bg-subtle text-muted',
  subtle: 'bg-subtle-strong text-ink-soft',
  brand: 'bg-primary-fixed text-primary',
  success: 'bg-success-surface text-success-text',
  warning: 'bg-warning-surface text-warning-text',
  danger: 'bg-danger-surface text-danger-text',
  info: 'bg-info-surface text-info-text'
};

const BORDERS: Record<BadgeTone, string> = {
  neutral: 'border-line',
  subtle: 'border-line-strong',
  brand: 'border-primary-fixed-dim',
  success: 'border-success-border',
  warning: 'border-warning-border',
  danger: 'border-danger-border',
  info: 'border-info-border'
};

const SIZES: Record<BadgeSize, string> = {
  xs: 'gap-0.5 px-1.5 py-0.5 text-[9px]',
  sm: 'gap-1 px-2 py-0.5 text-[10px]',
  md: 'gap-1 px-2.5 py-1 text-[11px]'
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  tone = 'neutral',
  size = 'sm',
  icon,
  caps = true,
  bordered = true,
  className,
  isNew = false
}) => (
  <motion.span
    className={cx(
      'inline-flex items-center whitespace-nowrap rounded-full font-extrabold',
      FILLS[tone],
      SIZES[size],
      caps && 'uppercase tracking-wide',
      bordered && cx('border', BORDERS[tone]),
      isNew && 'badge-cartoon badge-cartoon--new',
      className
    )}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
  >
    {icon}
    {children}
  </motion.span>
);

export const WeightageBadge: React.FC<{ weightage: string; className?: string }> = ({
  weightage,
  className
}) => {
  const map: Record<string, { tone: BadgeTone; label: string }> = {
    HIGH_YIELD: { tone: 'danger', label: 'High Yield' },
    CORE: { tone: 'brand', label: 'Core' },
    MEDIUM: { tone: 'warning', label: 'Medium' },
    LOW: { tone: 'neutral', label: 'Low' }
  };
  const entry = map[weightage] ?? { tone: 'neutral' as BadgeTone, label: weightage };
  return (
    <Badge tone={entry.tone} className={className}>
      {entry.label}
    </Badge>
  );
};

export const StatusBadge: React.FC<{
  value: string;
  toneMap: Record<string, BadgeTone>;
  label?: (value: string) => string;
  size?: BadgeSize;
  className?: string;
}> = ({ value, toneMap, label, size = 'xs', className }) => (
  <Badge tone={toneMap[value] ?? 'neutral'} size={size} className={className}>
    {label ? label(value) : value.replace(/_/g, ' ')}
  </Badge>
);
