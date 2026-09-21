import React, { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  ShieldCheck,
  Server,
  Database,
  RefreshCw,
  Trash2,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Users,
  Check,
  HelpCircle,
  ExternalLink,
  HardDrive,
  Cpu,
  LogOut,
  Sparkles
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ConfirmationModal } from '../ConfirmationModal';
import {
  ADMIN_ROLES,
  AdminRoleType,
  AdminRoleDefinition,
  getCurrentAdminRole,
  setCurrentAdminRole
} from '@/services/adminRoleService';
import { isFirebaseConfigured, db } from '@/firebase/config';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { notifyDataSync } from '@/services/questionBankSyncService';
import { AdminSectionId } from '../AdminSidebar';

interface SettingsSectionProps {
  currentRole: AdminRoleDefinition;
  onChangeRole: (role: AdminRoleType) => void;
  onLockSession: () => void;
  onNavigate: (section: AdminSectionId) => void;
  onShowToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  currentRole,
  onChangeRole,
  onLockSession,
  onNavigate,
  onShowToast
}) => {
  // Confirmation modals
  const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);
  const [isResetScoresModalOpen, setIsResetScoresModalOpen] = useState(false);
  const [isResetQuestionsModalOpen, setIsResetQuestionsModalOpen] = useState(false);

  // Cloud Firestore health state
  const [cloudStatus, setCloudStatus] = useState<'checking' | 'connected' | 'offline'>('checking');
  const [collectionsInfo, setCollectionsInfo] = useState<{
    users: number;
    publishedPapers: number;
    questions: number;
    latencyMs: number;
  }>({
    users: 0,
    publishedPapers: 0,
    questions: 0,
    latencyMs: 0
  });

  const checkCloudHealth = async () => {
    setCloudStatus('checking');
    if (!isFirebaseConfigured || !db) {
      setCloudStatus('offline');
      return;
    }

    const start = performance.now();
    try {
      // Test read with timeout
      const q = query(collection(db, 'questions'), limit(1));
      const snap = await Promise.race([
        getDocs(q),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Cloud timeout')), 3000))
      ]);
      const latency = Math.round(performance.now() - start);

      setCloudStatus('connected');
      setCollectionsInfo(prev => ({
        ...prev,
        questions: snap.size,
        latencyMs: latency
      }));
    } catch (err) {
      console.warn('[Settings] Cloud health check error:', err);
      setCloudStatus('offline');
    }
  };

  useEffect(() => {
    checkCloudHealth();
  }, []);

  const handleRoleSelect = (roleType: AdminRoleType) => {
    onChangeRole(roleType);
    if (onShowToast) {
      onShowToast(`Active role changed to ${ADMIN_ROLES[roleType].title}`, 'success');
    }
  };

  const handlePurgeLocalCache = () => {
    try {
      // Refresh memory & sync triggers
      notifyDataSync('all');
      setIsPurgeModalOpen(false);
      if (onShowToast) {
        onShowToast('Local application cache and sync buffers refreshed successfully.', 'success');
      }
    } catch (e) {
      if (onShowToast) onShowToast('Failed to clear cache.', 'error');
    }
  };

  const handleResetStudentScores = () => {
    try {
      // Clear local student records
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('exampilot_student_records_')) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
      localStorage.removeItem('exampilot_active_user');

      notifyDataSync('users');
      setIsResetScoresModalOpen(false);
      if (onShowToast) {
        onShowToast('Local student test records and attempts have been reset.', 'success');
      }
    } catch (err) {
      if (onShowToast) onShowToast('Error resetting student records.', 'error');
    }
  };

  const handleResetCustomQuestions = () => {
    try {
      localStorage.removeItem('exampilot_custom_questions_bank');
      notifyDataSync('questions');
      setIsResetQuestionsModalOpen(false);
      if (onShowToast) {
        onShowToast('Custom questions cache cleared from local browser.', 'success');
      }
    } catch (err) {
      if (onShowToast) onShowToast('Error resetting custom questions.', 'error');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface border border-line p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold font-display text-ink flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary" />
            Settings & Security Governance
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Role-based access permissions, Cloud Firestore health, security locks, and local cache controls
          </p>
        </div>

        <Button size="sm" variant="outline" onClick={onLockSession} className="text-xs text-rose-500 hover:text-rose-600">
          <LogOut className="w-3.5 h-3.5 mr-1" />
          Lock Admin Session
        </Button>
      </div>

      {/* SECTION 1: ROLE-BASED ACCESS CONTROL (RBAC) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-ink flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-500" />
              Role-Based Access Control (RBAC)
            </h3>
            <p className="text-xs text-muted">
              Select or simulate an administrative role to test modular permissions across the portal
            </p>
          </div>
          <Badge tone="brand" className="text-xs">
            Current: {currentRole.title}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.keys(ADMIN_ROLES) as AdminRoleType[]).map(key => {
            const role = ADMIN_ROLES[key];
            const isSelected = currentRole.id === role.id;

            return (
              <div
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-primary/5 border-primary shadow-sm ring-1 ring-primary'
                    : 'bg-card border-line hover:border-muted-faint hover:bg-subtle/30'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-bold text-sm text-ink">{role.title}</span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted mb-4">{role.description}</p>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-line text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Manage Question Bank:</span>
                    <span className={role.permissions.canEditQuestions ? 'text-emerald-500 font-semibold' : 'text-muted-faint'}>
                      {role.permissions.canEditQuestions ? 'Allowed' : 'Denied'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Publish CBT Tests:</span>
                    <span className={role.permissions.canPublishTests ? 'text-emerald-500 font-semibold' : 'text-muted-faint'}>
                      {role.permissions.canPublishTests ? 'Allowed' : 'Denied'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Configure AI & Models:</span>
                    <span className={role.permissions.canConfigureAi ? 'text-emerald-500 font-semibold' : 'text-muted-faint'}>
                      {role.permissions.canConfigureAi ? 'Allowed' : 'Denied'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Manage Candidates:</span>
                    <span className={role.permissions.canManageUsers ? 'text-emerald-500 font-semibold' : 'text-muted-faint'}>
                      {role.permissions.canManageUsers ? 'Allowed' : 'Denied'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: CLOUD & BACKEND DIAGNOSTICS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-ink flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-500" />
              Cloud Backend & Connectivity
            </h3>
            <p className="text-xs text-muted">
              Live status of Google Cloud Firestore, Firebase Authentication, and client synchronization
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={checkCloudHealth} className="text-xs">
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Check Connection
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 border-line space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted">Firestore Database</span>
              <Badge tone={cloudStatus === 'connected' ? 'success' : cloudStatus === 'checking' ? 'warning' : 'danger'}>
                {cloudStatus === 'connected' ? 'Online' : cloudStatus === 'checking' ? 'Connecting...' : 'Offline / Local'}
              </Badge>
            </div>
            <div className="text-xl font-bold font-display text-ink">
              {cloudStatus === 'connected' ? `${collectionsInfo.latencyMs} ms` : 'Local Fallback'}
            </div>
            <p className="text-[11px] text-muted">
              {cloudStatus === 'connected'
                ? 'Direct WebSocket connection to Cloud Firestore is active and responsive.'
                : 'Running in zero-latency offline-first mode via browser localStorage.'}
            </p>
          </Card>

          <Card className="p-5 border-line space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted">Firebase Authentication</span>
              <Badge tone={isFirebaseConfigured ? 'success' : 'default'}>
                {isFirebaseConfigured ? 'Configured' : 'Dev Anonymous'}
              </Badge>
            </div>
            <div className="text-xl font-bold font-display text-ink">
              {isFirebaseConfigured ? 'Production' : 'Anonymous Mode'}
            </div>
            <p className="text-[11px] text-muted">
              Controls candidate identity, cloud progress backups, and role claim evaluation.
            </p>
          </Card>

          <Card className="p-5 border-line space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted">Real-Time Sync Engine</span>
              <Badge tone="brand">Active</Badge>
            </div>
            <div className="text-xl font-bold font-display text-ink">Multi-Tab Sync</div>
            <p className="text-[11px] text-muted">
              Broadcasts question bank updates, test edits and candidate attempts across all open browser windows.
            </p>
          </Card>
        </div>
      </div>

      {/* SECTION 3: SYSTEM PASSCODE & AUTHENTICATION */}
      <div className="space-y-4">
        <div>
          <h3 className="font-bold text-base text-ink flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-500" />
            Admin Passcode & Gate Security
          </h3>
          <p className="text-xs text-muted">
            Protection layer guarding admin features and examination editing
          </p>
        </div>

        <Card className="p-5 border-line space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-semibold text-sm text-ink block">Session Gate Status</span>
              <p className="text-xs text-muted mt-0.5">
                Current browser window holds an authenticated administrator session token.
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={onLockSession} className="text-xs">
              <Lock className="w-3.5 h-3.5 mr-1 text-amber-500" />
              Lock Session Now
            </Button>
          </div>

          <div className="p-3.5 rounded-xl bg-subtle/50 border border-line text-xs text-muted space-y-1">
            <div className="flex items-center gap-2 text-ink font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Environment Passcode Configuration
            </div>
            <p className="text-[11px]">
              The admin passcode is evaluated against <code className="px-1 py-0.5 bg-card rounded border border-line">VITE_ADMIN_PASSCODE_SHA256</code> or <code className="px-1 py-0.5 bg-card rounded border border-line">VITE_ADMIN_PASSCODE</code>. If unconfigured in local development, it defaults to <code className="px-1 py-0.5 bg-card rounded border border-line">admin2026</code>.
            </p>
          </div>
        </Card>
      </div>

      {/* SECTION 4: DATA MANAGEMENT & DANGER ZONE */}
      <div className="space-y-4">
        <div>
          <h3 className="font-bold text-base text-ink flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            Data Maintenance & Danger Zone
          </h3>
          <p className="text-xs text-muted">
            Purge cached questions, refresh sync subscriptions, or reset local student test attempts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 border-line space-y-3 flex flex-col justify-between">
            <div>
              <span className="font-semibold text-sm text-ink block">Refresh Cache & Broadcast</span>
              <p className="text-xs text-muted mt-1">
                Forces a clean broadcast across all open browser tabs and re-queries the question pool.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs"
              onClick={() => setIsPurgeModalOpen(true)}
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Refresh Sync
            </Button>
          </Card>

          <Card className="p-5 border-rose-500/20 bg-rose-500/5 space-y-3 flex flex-col justify-between">
            <div>
              <span className="font-semibold text-sm text-ink block">Reset Student Records</span>
              <p className="text-xs text-muted mt-1">
                Deletes all local mock test submissions, scores, and candidate accuracy records in this browser.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs text-rose-600 border-rose-500/30 hover:bg-rose-500/10"
              onClick={() => setIsResetScoresModalOpen(true)}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Reset Student Scores
            </Button>
          </Card>

          <Card className="p-5 border-rose-500/20 bg-rose-500/5 space-y-3 flex flex-col justify-between">
            <div>
              <span className="font-semibold text-sm text-ink block">Purge Custom Questions</span>
              <p className="text-xs text-muted mt-1">
                Clears custom AI generated questions stored locally in the browser question bank.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs text-rose-600 border-rose-500/30 hover:bg-rose-500/10"
              onClick={() => setIsResetQuestionsModalOpen(true)}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Purge Custom Bank
            </Button>
          </Card>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={isPurgeModalOpen}
        onClose={() => setIsPurgeModalOpen(false)}
        onConfirm={handlePurgeLocalCache}
        title="Refresh Local Cache"
        message="This will re-synchronize the question bank and broadcast an update across all open ExamPilot tabs. No questions will be deleted."
        confirmText="Refresh Now"
        tone="primary"
      />

      <ConfirmationModal
        isOpen={isResetScoresModalOpen}
        onClose={() => setIsResetScoresModalOpen(false)}
        onConfirm={handleResetStudentScores}
        title="Reset Student Test Attempts"
        message="Are you sure you want to delete all locally stored candidate test submissions and score history? This action cannot be undone."
        confirmText="Yes, Reset Scores"
        tone="danger"
      />

      <ConfirmationModal
        isOpen={isResetQuestionsModalOpen}
        onClose={() => setIsResetQuestionsModalOpen(false)}
        onConfirm={handleResetCustomQuestions}
        title="Purge Custom Question Bank"
        message="Are you sure you want to remove all custom questions from this browser's local cache? Standard syllabus questions from mockData will remain intact."
        confirmText="Yes, Purge Bank"
        tone="danger"
      />
    </div>
  );
};
