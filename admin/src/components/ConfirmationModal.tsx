import React from 'react';
import { AlertTriangle, Trash2, X, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  tone?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  tone = 'danger',
  isLoading = false
}) => {
  if (!isOpen) return null;

  const toneConfig = {
    danger: {
      icon: Trash2,
      iconBg: 'bg-danger/10 text-danger-text border-danger/20',
      confirmClass: 'bg-danger hover:bg-danger/90 text-white'
    },
    warning: {
      icon: AlertTriangle,
      iconBg: 'bg-warning/10 text-warning-text border-warning/20',
      confirmClass: 'bg-amber-600 hover:bg-amber-700 text-white'
    },
    primary: {
      icon: CheckCircle2,
      iconBg: 'bg-primary/10 text-primary border-primary/20',
      confirmClass: 'bg-primary hover:bg-primary/90 text-white'
    }
  }[tone];

  const IconComponent = toneConfig.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl bg-card border border-line shadow-2xl p-6 space-y-5 animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-muted hover:text-ink hover:bg-subtle transition"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl border flex-shrink-0 ${toneConfig.iconBg}`}>
            <IconComponent className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 flex-1 pr-4">
            <h3 className="font-display font-bold text-base text-ink">{title}</h3>
            <p className="text-xs text-muted leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-line">
          <Button variant="outline" size="sm" onClick={onClose}>
            {cancelText}
          </Button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition disabled:opacity-50 ${toneConfig.confirmClass}`}
          >
            {isLoading ? 'Processing…' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
