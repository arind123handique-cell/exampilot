import React from 'react';
import { cx } from '../../utils/cn';
import { motion } from 'framer-motion';

type CardVariant = 'default' | 'raised' | 'interactive' | 'plain';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  /** Removes default padding when the card manages its own layout. */
  flush?: boolean;
  accent?: 'coral' | 'turquoise' | 'yellow' | 'pink' | 'purple' | 'sky' | 'mint' | 'peach';
}

const VARIANTS: Record<CardVariant, string> = {
  default: 'bg-card border-line shadow-card',
  raised: 'bg-raised border-line shadow-pop',
  interactive: 'bg-card border-line shadow-card card-interactive',
  plain: 'bg-subtle border-transparent'
};

const ACCENT_CLASSES: Record<NonNullable<CardProps['accent']>, string> = {
  coral: 'card-cartoon-accent-coral',
  turquoise: 'card-cartoon-accent-turquoise',
  yellow: 'card-cartoon-accent-yellow',
  pink: 'card-cartoon-accent-pink',
  purple: 'card-cartoon-accent-purple',
  sky: 'card-cartoon-accent-sky',
  mint: 'card-cartoon-accent-mint',
  peach: 'card-cartoon-accent-peach'
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', flush = false, className, children, accent, ...rest }, ref) => (
    <motion.div
      ref={ref}
      className={cx(
        'rounded-2xl border card-cartoon',
        VARIANTS[variant],
        accent ? ACCENT_CLASSES[accent] : '',
        !flush && 'p-4 sm:p-5',
        className
      )}
      whileHover={{
        translateX: -2,
        translateY: -2,
        boxShadow: '8px 8px 0px rgba(0, 0, 0, 0.18)'
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 15
      }}
      {...(rest as any)}
    >
      {children}
    </motion.div>
  )
);
Card.displayName = 'Card';

interface CardHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  icon,
  action,
  className
}) => (
  <div className={cx('flex items-start justify-between gap-3 mb-4', className)}>
    <div className="flex items-start gap-2.5 min-w-0">
      {icon && (
        <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-primary">
          {icon}
        </span>
      )}
      <div className="min-w-0">
        <h3 className="font-display text-sm font-semibold text-ink truncate">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
      </div>
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);
