import React, { useState } from 'react';
import { Share2, Check, Link2 } from 'lucide-react';
import { Button } from './Button';
import { useToast } from '../../context/ToastContext';

interface ShareButtonProps {
  url?: string;
  title?: string;
  text?: string;
  variant?: 'ghost' | 'outline' | 'secondary';
  size?: 'sm' | 'md';
  label?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  url,
  title,
  text,
  variant = 'ghost',
  size = 'sm',
  label = 'Share',
}) => {
  const { success, error } = useToast();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = url || window.location.href;
    const shareTitle = title || document.title;
    const shareText = text || '';

    // Native share if available (mobile)
    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
        success('Shared successfully');
        return;
      } catch (e: any) {
        if (e?.name === 'AbortError') return;
        // fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      success('Link copied', shareUrl);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      error('Could not copy link', 'Copy it from the address bar.');
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleShare}
      icon={copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
      aria-label="Share this page"
    >
      {copied ? 'Copied!' : label}
    </Button>
  );
};

export const CopyLinkButton: React.FC<{ url?: string; size?: 'sm' | 'md' }> = ({ url, size = 'sm' }) => {
  const { success } = useToast();
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    const u = url || window.location.href;
    await navigator.clipboard.writeText(u);
    setCopied(true);
    success('Link copied');
    window.setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={handle}
      aria-label="Copy link"
      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line bg-card px-2.5 text-xs font-medium text-muted hover:bg-subtle hover:text-ink"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-success-text" /> : <Link2 className="h-3.5 w-3.5" />}
      {copied ? 'Copied' : 'Copy link'}
    </button>
  );
};
