import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Lightbulb,
  Brain,
  Code2,
  Bug,
  AlertCircle,
} from 'lucide-react';
import { InspectionResult, InspectionIssue } from '../../services/codeInspectorService';
import { useToast } from '../../contexts/ToastContext';

interface AICodeInspectorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  result: InspectionResult | null;
  isAnalyzing: boolean;
  onApplyRefactoredCode: (refactoredCode: string) => void;
  language?: string;
  problemTitle?: string;
}

export const AICodeInspectorDrawer: React.FC<AICodeInspectorDrawerProps> = ({
  isOpen,
  onClose,
  result,
  isAnalyzing,
  onApplyRefactoredCode,
  language = 'javascript',
  problemTitle,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const { showToast } = useToast();

  // Lock main body scroll when drawer is open to prevent overlapping scrollbars
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    showToast({ message: 'Refactored code copied to clipboard!', type: 'success' });
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleApplyCode = (code: string) => {
    onApplyRefactoredCode(code);
    showToast({ message: 'Refactored code applied to editor!', type: 'success' });
    onClose();
  };

  const getIssueBadge = (type: InspectionIssue['type']) => {
    switch (type) {
      case 'bug':
        return {
          color: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
          label: 'Bug',
          icon: <Bug size={13} className="text-rose-400" />,
        };
      case 'performance':
        return {
          color: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
          label: 'Performance',
          icon: <Zap size={13} className="text-amber-400" />,
        };
      case 'anti-pattern':
      default:
        return {
          color: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
          label: 'Anti-Pattern',
          icon: <AlertCircle size={13} className="text-purple-400" />,
        };
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Slide-out Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-2xl bg-[#090d16] border-l border-white/10 text-textMain shadow-2xl flex flex-col h-full z-10"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02] shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-primaryLight/30 to-purple-500/20 border border-primaryLight/30 text-primaryLight">
                  <Sparkles size={22} className="animate-pulse" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold flex items-center gap-2">
                    AI Code Inspector
                  </h2>
                  <p className="text-xs text-textMuted mt-0.5">
                    {problemTitle ? `Problem: ${problemTitle}` : 'Code Quality & Complexity Inspection'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-textMuted hover:text-textMain hover:bg-white/10 border border-white/10 bg-white/5 transition-all flex items-center gap-1.5 text-xs font-semibold shrink-0 shadow-sm"
                aria-label="Close Drawer"
              >
                <X size={18} />
                <span>Close</span>
              </button>
            </div>

            {/* Content Area with customized padding to avoid scrollbar touch */}
            <div className="flex-1 overflow-y-auto pl-6 pr-4 py-6 space-y-6 custom-scrollbar">
              {isAnalyzing ? (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primaryLight animate-spin" />
                    <Brain className="absolute inset-0 m-auto text-primaryLight animate-pulse" size={24} />
                  </div>
                  <h3 className="mt-6 text-lg font-bold font-display">Inspecting Code Quality</h3>
                  <p className="mt-2 text-sm text-textMuted max-w-sm">
                    Analyzing Big-O complexity, scanning for anti-patterns and performance issues, and preparing refactored code...
                  </p>
                </div>
              ) : !result ? (
                <div className="py-16 flex flex-col items-center justify-center text-center text-textMuted">
                  <AlertTriangle size={36} className="text-amber-400 mb-3" />
                  <p className="text-sm font-medium">No inspection result available.</p>
                  <p className="text-xs mt-1">Click "Inspect & Refactor" to analyze code.</p>
                </div>
              ) : (
                <>
                  {/* 1. Big-O Complexity Assessment */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-textMuted flex items-center gap-1.5">
                        <Zap size={14} className="text-amber-400" /> Complexity Assessment
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Time Complexity */}
                      <div className="bg-black/30 border border-white/10 rounded-xl p-4">
                        <div className="text-xs text-textMuted">Time Complexity</div>
                        <div className="text-2xl font-mono font-bold text-amber-400 mt-1">
                          {result.metrics.timeComplexity}
                        </div>
                      </div>

                      {/* Space Complexity */}
                      <div className="bg-black/30 border border-white/10 rounded-xl p-4">
                        <div className="text-xs text-textMuted">Space Complexity</div>
                        <div className="text-2xl font-mono font-bold text-cyan-400 mt-1">
                          {result.metrics.spaceComplexity}
                        </div>
                      </div>
                    </div>

                    {/* Complexity Explanation */}
                    {result.metrics.explanation && (
                      <div className="text-xs text-textMain/90 bg-white/5 rounded-xl p-3.5 border border-white/5 leading-relaxed">
                        <span className="font-semibold text-primaryLight">Explanation: </span>
                        {result.metrics.explanation}
                      </div>
                    )}
                  </div>

                  {/* 2. Detected Issues */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-textMuted uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle size={14} className="text-rose-400" /> Code Issues ({result.issues.length})
                    </h3>

                    {result.issues.length === 0 ? (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3 text-xs text-emerald-300">
                        <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                        <span>No critical issues or anti-patterns detected! Your solution looks clean.</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {result.issues.map((issue, idx) => {
                          const badge = getIssueBadge(issue.type);
                          return (
                            <div
                              key={idx}
                              className="border border-white/10 rounded-xl p-4 space-y-2 bg-black/40"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {badge.icon}
                                  <span
                                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider border ${badge.color}`}
                                  >
                                    {badge.label}
                                  </span>
                                </div>
                                {issue.line !== undefined && (
                                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/60 text-textMuted border border-white/10">
                                    Line {issue.line}
                                  </span>
                                )}
                              </div>

                              <p className="text-xs text-textMain/90 leading-relaxed font-medium">
                                {issue.description}
                              </p>

                              {issue.suggestion && (
                                <p className="text-xs text-emerald-300/90 leading-relaxed bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                                  <strong className="text-emerald-400 font-semibold">Suggestion: </strong>
                                  {issue.suggestion}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* 3. Refactored Code */}
                  {result.refactoredCode && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-textMuted uppercase tracking-wider flex items-center gap-1.5">
                          <Code2 size={14} className="text-emerald-400" /> Refactored Code ({language})
                        </h3>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyCode(result.refactoredCode!)}
                            className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-textMain flex items-center gap-1 transition-colors"
                          >
                            {copiedCode ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                            {copiedCode ? 'Copied' : 'Copy'}
                          </button>
                          <button
                            onClick={() => handleApplyCode(result.refactoredCode!)}
                            className="px-3 py-1 rounded-lg bg-gradient-main text-white text-xs font-semibold flex items-center gap-1 shadow-md hover:shadow-primary/30 transition-all"
                          >
                            <Sparkles size={13} /> Apply to Editor
                          </button>
                        </div>
                      </div>

                      <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/60">
                        <pre className="p-4 text-xs font-mono text-emerald-400/90 overflow-x-auto leading-relaxed">
                          <code>{result.refactoredCode}</code>
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* 4. Actionable Hints */}
                  {result.hints && result.hints.length > 0 && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Lightbulb size={14} /> Progressive Hints & Tips
                      </h4>
                      <ul className="space-y-2">
                        {result.hints.map((hint, i) => (
                          <li key={i} className="text-xs text-textMain/90 flex items-start gap-2 leading-relaxed">
                            <span className="text-amber-400 font-bold text-[11px]">•</span>
                            <span>{hint}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer Actions */}
            {result && !isAnalyzing && (
              <div className="p-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between shrink-0">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-textMuted hover:text-textMain transition-colors"
                >
                  Close
                </button>
                {result.refactoredCode && (
                  <button
                    onClick={() => handleApplyCode(result.refactoredCode!)}
                    className="px-5 py-2 rounded-xl bg-gradient-main text-white text-xs font-bold flex items-center gap-2 shadow-lg hover:shadow-primary/40 transition-all"
                  >
                    <Sparkles size={16} /> Apply Refactored Solution
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

