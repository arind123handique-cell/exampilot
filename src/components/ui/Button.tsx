import React from 'react';
import { cx } from '../../utils/cn';
import { motion } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'btn-cartoon btn-cartoon--primary',
  secondary: 'btn-cartoon btn-cartoon--secondary',
  outline: 'btn-cartoon btn-cartoon--outline',
  ghost: 'btn-cartoon btn-cartoon--ghost',
  danger: 'btn-cartoon btn-cartoon--primary',
  success: 'btn-cartoon btn-cartoon--secondary'
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-xs gap-1.5 rounded-2xl',
  md: 'h-12 px-5 text-sm gap-2 rounded-2xl',
  lg: 'h-14 px-7 text-sm gap-2.5 rounded-2xl font-extrabold',
  icon: 'h-11 w-11 justify-center rounded-2xl'
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  type = 'button',
  onClick,
  ...rest
}) => {
  // NOTE: this button used to fire confetti on EVERY click — including "Cancel",
  // "Sign In" and navigation. That made the celebration meaningless and added
  // jank mid-exam. Confetti is now fired deliberately at the moments that earn it
  // (e.g. a submitted mock test in StudentPortal).
  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      className={cx(
        'inline-flex items-center justify-center font-extrabold transition',
        'disabled:cursor-not-allowed disabled:opacity-50 active:scale-95',
        VARIANT_CLASS[variant],
        SIZE_CLASS[size],
        fullWidth && 'w-full',
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      {...(rest as any)}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        icon
      )}
      {children}
      {iconRight}
    </motion.button>
  );
};
