/**
 * Cross-domain routing helper for ExamPilot Student & Admin Portals
 */

export function getAdminDomainUrl(): string {
  if (typeof window === 'undefined') return 'https://admin.exampilot.ai';

  // 1. Explicit env override (e.g. set in Cloudflare or .env)
  if (import.meta.env.VITE_ADMIN_URL) {
    return import.meta.env.VITE_ADMIN_URL as string;
  }

  const { hostname, protocol } = window.location;

  // 2. Local development: Student is on 3000, Admin is on 3001
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${protocol}//${hostname}:3001`;
  }

  // 3. If running on a preview or staging subdomain
  if (hostname.includes('exampilot')) {
    if (hostname.startsWith('admin.')) return window.location.origin;
    return `${protocol}//admin.${hostname.replace(/^(app|study|www)\./, '')}`;
  }

  // Default production admin domain
  return 'https://admin.exampilot.ai';
}

export function getStudentDomainUrl(): string {
  if (typeof window === 'undefined') return 'https://exampilot.ai';

  // 1. Explicit env override
  if (import.meta.env.VITE_STUDENT_URL) {
    return import.meta.env.VITE_STUDENT_URL as string;
  }

  const { hostname, protocol } = window.location;

  // 2. Local development: Admin is on 3001, Student is on 3000
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${protocol}//${hostname}:3000`;
  }

  // 3. Subdomain cleanup (remove admin. prefix)
  if (hostname.startsWith('admin.')) {
    return `${protocol}//${hostname.replace(/^admin\./, '')}`;
  }

  // Default production student domain
  return 'https://exampilot.ai';
}
