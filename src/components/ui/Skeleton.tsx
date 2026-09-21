import React from 'react';
import { cx } from '../../utils/cn';

interface SkeletonProps {
  className?: string;
  /** Convenience shorthand for text lines. */
  lines?: number;
}

/** Shimmering placeholder — use instead of a bare spinner on content surfaces. */
export const Skeleton: React.FC<SkeletonProps> = ({ className, lines }) => {
  if (lines && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cx(
              'relative h-3 overflow-hidden rounded-full bg-subtle-strong',
              index === lines - 1 && 'w-2/3',
              className
            )}
          >
            <Shimmer />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cx('relative overflow-hidden rounded-lg bg-subtle-strong', className)}>
      <Shimmer />
    </div>
  );
};

const Shimmer: React.FC = () => (
  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/25 to-transparent" />
);

/** Ready-made dashboards-width skeleton so pages do not hand-roll one. */
export const PageSkeleton: React.FC = () => (
  <div className="space-y-5" aria-busy="true" aria-live="polite">
    <Skeleton className="h-28 w-full rounded-2xl" />
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-24 rounded-2xl" />
      ))}
    </div>
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Skeleton className="h-64 rounded-2xl lg:col-span-2" />
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  </div>
);
