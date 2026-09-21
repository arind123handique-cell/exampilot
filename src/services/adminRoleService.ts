/**
 * ROLE-BASED ACCESS CONTROL (RBAC) FOR ADMIN PORTAL
 *
 * Supported Roles:
 * - Super Admin: Full system privileges, user deletion, AI keys, test publishing
 * - Question Admin: Question Bank CRUD, bulk import/export, quality control
 * - Test Admin: Mock Test creator, subhead editing, publication control
 * - Content Admin: AI Topic Ingestion, PDF OCR, curriculum curation
 * - Analyst: Read-only telemetry, results analysis, and reports
 */

export type AdminRoleType = 'super_admin' | 'question_admin' | 'test_admin' | 'content_admin' | 'analyst';

export interface AdminRoleDefinition {
  id: AdminRoleType;
  title: string;
  badgeTone: 'brand' | 'accent' | 'success' | 'warning' | 'neutral';
  description: string;
  permissions: {
    canManageUsers: boolean;
    canDeleteData: boolean;
    canConfigureAi: boolean;
    canPublishTests: boolean;
    canEditQuestions: boolean;
    canExportReports: boolean;
    canViewAnalytics: boolean;
  };
}

export const ADMIN_ROLES: Record<AdminRoleType, AdminRoleDefinition> = {
  super_admin: {
    id: 'super_admin',
    title: 'Super Administrator',
    badgeTone: 'brand',
    description: 'Unrestricted master access: telemetry, publishing, question banks, AI keys, and user management.',
    permissions: {
      canManageUsers: true,
      canDeleteData: true,
      canConfigureAi: true,
      canPublishTests: true,
      canEditQuestions: true,
      canExportReports: true,
      canViewAnalytics: true
    }
  },
  question_admin: {
    id: 'question_admin',
    title: 'Question Bank Admin',
    badgeTone: 'accent',
    description: 'Direct authoring, bulk import/export, taxonomy assignment, and quality control.',
    permissions: {
      canManageUsers: false,
      canDeleteData: false,
      canConfigureAi: false,
      canPublishTests: false,
      canEditQuestions: true,
      canExportReports: true,
      canViewAnalytics: true
    }
  },
  test_admin: {
    id: 'test_admin',
    title: 'Test & CBT Admin',
    badgeTone: 'success',
    description: 'Custom mock test construction, subheads scheduling, and live paper publishing.',
    permissions: {
      canManageUsers: false,
      canDeleteData: false,
      canConfigureAi: false,
      canPublishTests: true,
      canEditQuestions: true,
      canExportReports: true,
      canViewAnalytics: true
    }
  },
  content_admin: {
    id: 'content_admin',
    title: 'AI Content Director',
    badgeTone: 'warning',
    description: 'PDF OCR ingestion, syllabus expansion, AI question generation, and prompt tuning.',
    permissions: {
      canManageUsers: false,
      canDeleteData: false,
      canConfigureAi: true,
      canPublishTests: true,
      canEditQuestions: true,
      canExportReports: true,
      canViewAnalytics: true
    }
  },
  analyst: {
    id: 'analyst',
    title: 'Assessment Analyst',
    badgeTone: 'neutral',
    description: 'Read-only telemetry audits, score distributions, mistake diagnostics, and CSV exports.',
    permissions: {
      canManageUsers: false,
      canDeleteData: false,
      canConfigureAi: false,
      canPublishTests: false,
      canEditQuestions: false,
      canExportReports: true,
      canViewAnalytics: true
    }
  }
};

const ROLE_STORAGE_KEY = 'exampilot_active_admin_role';

export function getActiveAdminRole(): AdminRoleDefinition {
  try {
    const saved = localStorage.getItem(ROLE_STORAGE_KEY);
    if (saved && (saved in ADMIN_ROLES)) {
      return ADMIN_ROLES[saved as AdminRoleType];
    }
  } catch {}
  return ADMIN_ROLES.super_admin;
}

export function setActiveAdminRole(roleId: AdminRoleType): void {
  localStorage.setItem(ROLE_STORAGE_KEY, roleId);
  window.dispatchEvent(new CustomEvent('exampilot_admin_role_changed', { detail: roleId }));
}

export const getCurrentAdminRole = getActiveAdminRole;
export const setCurrentAdminRole = setActiveAdminRole;

