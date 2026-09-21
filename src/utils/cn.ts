/**
 * Minimal class-name joiner — filters falsy values so conditional classes stay
 * readable: `cx('p-4', isActive && 'bg-card')`.
 */
export const cx = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(' ');
