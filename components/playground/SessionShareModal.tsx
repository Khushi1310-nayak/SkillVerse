import React, { useState } from 'react';
import { X, Link2, Check, Users } from 'lucide-react';

interface SessionShareModalProps {
  sessionId: string;
  onClose: () => void;
}

export const SessionShareModal: React.FC<SessionShareModalProps> = ({
  sessionId,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  // HashRouter uses /#/ routing — the shareable link must include the hash.
  const sessionUrl = `${window.location.origin}/#/pair-session/${sessionId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sessionUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that block clipboard API without a user gesture
      const el = document.createElement('textarea');
      el.value = sessionUrl;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    // Overlay — same pattern as CodePlayground.tsx Save/Snippets modals
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-glass border border-black/20 dark:border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
              <Users size={15} className="text-primaryLight" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-textMain">
                Pair Session Started
              </h3>
              <p className="text-[11px] text-textMuted">
                Share this link with your pair partner
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close share modal"
            className="text-textMuted hover:text-textMain transition-colors p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
          >
            <X size={16} />
          </button>
        </div>

        {/* Session URL display */}
        <div className="mb-4">
          <label className="text-[11px] font-bold text-textMuted uppercase tracking-wider block mb-2">
            Session Link
          </label>
          <div className="flex items-center gap-2 bg-black/10 dark:bg-white/5 border border-black/15 dark:border-white/10 rounded-xl px-3 py-2.5">
            <Link2 size={13} className="text-primaryLight shrink-0" />
            <span className="text-xs font-mono text-textMuted truncate flex-1 select-all">
              {sessionUrl}
            </span>
          </div>
        </div>

        {/* Copy button */}
        <button
          id="pair-session-copy-link-btn"
          type="button"
          onClick={handleCopy}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-primaryLight ${
            copied
              ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
              : 'bg-gradient-main hover:shadow-lg hover:shadow-primary/25 text-white'
          }`}
        >
          {copied ? (
            <>
              <Check size={15} />
              Copied to clipboard!
            </>
          ) : (
            <>
              <Link2 size={15} />
              Copy Link
            </>
          )}
        </button>

        {/* Informational note */}
        <p className="mt-4 text-[11px] text-textMuted/70 text-center leading-relaxed">
          Your partner must be logged in to join. Code syncs within a short
          delay after each person stops typing.
        </p>
      </div>
    </div>
  );
};
