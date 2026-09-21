import React from 'react';
import { motion } from 'framer-motion';
import { cx } from '../../utils/cn';

interface ChartCardProps {
  type: 'bar' | 'pie' | 'line';
  data: Array<{ label: string; value: number; color: string }>;
  title?: string;
  subtitle?: string;
  className?: string;
  animateOnLoad?: boolean;
}

const ChartCard: React.FC<ChartCardProps> = ({
  type,
  data,
  title,
  subtitle,
  className,
  animateOnLoad = true
}) => {
  const hasData = data && data.length > 0;

  return (
    <motion.div
      className={cx('card-cartoon rounded-2xl border p-6', className)}
      initial={animateOnLoad ? { opacity: 0, y: 20 } : false}
      animate={animateOnLoad ? { opacity: 1, y: 0 } : {}}
      transition={animateOnLoad ? { duration: 0.6, ease: 'easeOut' } : {}}
    >
      <div className="flex items-center justify-between mb-5">
        {title && (
          <h3 className="font-display font-semibold text-ink text-lg">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-xs text-muted-soft">{subtitle}</p>
        )}
      </div>

      {hasData && type === 'bar' && (
        <div className="space-y-3">
          {data.map((item, i) => (
            <motion.div
              key={item.label}
              className="flex items-baseline gap-2"
              initial={animateOnLoad ? { x: -20, opacity: 0 } : false}
              animate={animateOnLoad ? { x: 0, opacity: 1 } : {}}
              transition={animateOnLoad ? { duration: 0.5, delay: i * 0.1, ease: 'easeOut' } : {}}
            >
              <div className="w-20 text-right text-[10px] text-muted font-mono">
                {item.value}%
              </div>
              <div className="flex-1 h-6 rounded-full bg-subtle-strong overflow-hidden">
                <div
                  className="h-full rounded-lg"
                  style={{ width: `${item.value}%`, backgroundColor: item.color }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {hasData && type === 'pie' && (
        <div>
          <div className="flex flex-wrap gap-2">
            {data.map((item, i) => (
              <motion.div
                key={item.label}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                style={{ backgroundColor: item.color }}
              >
                {item.label.split(' ')[0].substring(0, 1)}
              </motion.div>
            ))}
          </div>
          <div className="mt-3 text-[10px] text-muted">
            {data.map((item) => `${item.label}: ${item.value}%`).join(' | ')}
          </div>
        </div>
      )}

      {hasData && type === 'line' && (
        <div>
          <svg className="w-full h-32" aria-label="Performance trend">
            <path
              d={data
                .map(
                  (item, i) =>
                    `M${(i / (data.length - 1)) * 100},${30 - (item.value / 100) * 30}${
                      i < data.length - 1 ? 'C' : ''
                    }${((i + 1) / (data.length - 1)) * 100},${
                      30 - ((item.value + (data[i + 1]?.value ?? item.value)) / 100) * 30
                    }`
                )
                .join('')}
              fill="none"
              stroke={data[0]?.color || '#6366f1'}
              strokeWidth={2}
            />
            <g stroke="var(--line-strong)" strokeWidth="1">
              {data.map((item, i) => (
                <circle
                  key={item.label}
                  cx={(i / (data.length - 1)) * 100}
                  cy={30 - (item.value / 100) * 30}
                  r={4}
                  fill={item.color}
                />
              ))}
            </g>
          </svg>
          <div className="mt-2 text-[10px] text-muted">
            {data.map((item, i) => `${item.label}: ${item.value}%`).join(' | ')}
          </div>
        </div>
      )}

      {!hasData && (
        <p className="text-muted-soft text-xs text-center py-8">
          No data available for this chart
        </p>
      )}
    </motion.div>
  );
};

export default ChartCard;