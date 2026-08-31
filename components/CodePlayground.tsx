import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, Terminal, AlertTriangle, Save, FolderOpen, Trash2, X, Loader2, Send, Users, Eye } from 'lucide-react';
import { storageService } from '../services/storageService';
import { firestoreService } from '../services/firestoreService';
import { useAuthContext } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { SavedSnippet } from '../types';
import { AlgorithmCanvas } from './AlgorithmCanvas';
import { VisualizerToolbar } from './VisualizerToolbar';
import { parseVisualizerState, type VisualizerSnapshot } from '../utils/visualizerStateParser';
import { executeCode, type ExecutionLog } from '../utils/codeExecutor';

interface CodePlaygroundProps {
  initialCode: string;
  language?: string;
  height?: string;
  onRequestReview?: (code: string, language: string) => Promise<void>;
  isReviewSubmitting?: boolean;
}

interface RuntimeError {
  message: string;
  line?: number;
  col?: number;
  stack?: string;
}

export const CodePlayground: React.FC<CodePlaygroundProps> = ({
  initialCode,
  language = 'javascript',
  height = '360px',
  onRequestReview,
  isReviewSubmitting = false,
}) => {
  const [code, setCode] = useState(initialCode);
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [error, setError] = useState<RuntimeError | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  // Visualizer states
  const [visualizerMode, setVisualizerMode] = useState(false);
  const [visualizerSnapshots, setVisualizerSnapshots] = useState<VisualizerSnapshot[]>([]);
  const [visualizerStep, setVisualizerStep] = useState(0);
  const [visualizerSpeed, setVisualizerSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [visualizerError, setVisualizerError] = useState<string | null>(null);

  const [savedSnippets, setSavedSnippets] = useState<SavedSnippet[]>([]);
  const [showSnippetsPanel, setShowSnippetsPanel] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [snippetNameDraft, setSnippetNameDraft] = useState('');
  const [isStartingPairSession, setIsStartingPairSession] = useState(false);

  const navigate = useNavigate();
  const { user, appUser } = useAuthContext();
  const { showToast } = useToast();

  const handleStartPairSession = async () => {
    const effectiveUserId = user?.uid || appUser?.uid;
    if (!effectiveUserId) {
      showToast({ message: 'Please log in to start a pair programming session.', type: 'error' });
      return;
    }
    setIsStartingPairSession(true);
    try {
      const username = appUser?.username || user?.displayName || 'Learner';
      const session = await firestoreService.createPairSession(
        effectiveUserId,
        username,
        code || initialCode,
        language || 'javascript'
      );

      if (effectiveUserId) {
        firestoreService.getActiveQuestDefinitions().then((quests) => {
          return Promise.all(quests.map(async (quest) => {
            const objective = quest.objectives.find((item) => item.type === 'pair-session');
            if (!objective) return null;
            return firestoreService.recordQuestObjectiveProgress(effectiveUserId, quest.id, objective.id, 1);
          }));
        }).catch(console.error);

        firestoreService.getActiveCommunityBoss().then((boss) => {
          if (boss?.id) {
            return firestoreService.incrementCommunityBossProgress(boss.id, 1);
          }
        }).catch(console.error);
      }

      navigate(`/pair-session/${session.id}`, { state: { autoOpenShare: true } });
    } catch (err) {
      console.error('Error starting pair session:', err);
      showToast({ message: 'Failed to start pair programming session.', type: 'error' });
    } finally {
      setIsStartingPairSession(false);
    }
  };

  useEffect(() => {
    setSavedSnippets(storageService.getSavedSnippets());
  }, []);

  const handleSaveSnippet = () => {
    const name = snippetNameDraft.trim();
    if (!name) return;
    storageService.saveSnippet(name, language || 'javascript', code);
    setSavedSnippets(storageService.getSavedSnippets());
    setSnippetNameDraft('');
    setShowSaveDialog(false);
  };

  const handleLoadSnippet = (snippet: SavedSnippet) => {
    setCode(snippet.code);
    setShowSnippetsPanel(false);
  };

  const handleDeleteSnippet = (id: string) => {
    setSavedSnippets(storageService.deleteSnippet(id));
  };

  const terminalContainerRef = useRef<HTMLDivElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of terminal inside container only without moving page viewport
  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [logs, error]);

  const handleExecute = async () => {
    setLogs([]);
    setError(null);
    setIsExecuting(true);
    setExecutionTime(null);

    try {
      const result = await executeCode(code, language);
      setLogs(result.logs);
      setError(result.error || null);
      setExecutionTime(result.durationMs);
    } catch (err: any) {
      setError({ message: err?.message || 'Execution error' });
      setLogs([{ type: 'error', message: `Execution failed: ${err?.message || 'Unknown error'}` }]);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleReset = () => {
    setCode(initialCode);
    setLogs([]);
    setError(null);
    setIsExecuting(false);
    setExecutionTime(null);
  };

  const clampStep = (value: number, total: number) => {
    if (total <= 0) return 0;
    return Math.min(Math.max(value, 0), total - 1);
  };

  const handleVisualizerPlay = () => {
    if (visualizerSnapshots.length === 0) return;
    if (visualizerStep >= visualizerSnapshots.length - 1) {
      setVisualizerStep(0);
    }
    setIsPlaying(true);
  };

  const handleVisualizerPause = () => {
    setIsPlaying(false);
  };

  const handleVisualizerStepForward = () => {
    setIsPlaying(false);
    setVisualizerStep((prev) => clampStep(prev + 1, visualizerSnapshots.length));
  };

  const handleVisualizerStepBackward = () => {
    setIsPlaying(false);
    setVisualizerStep((prev) => clampStep(prev - 1, visualizerSnapshots.length));
  };

  useEffect(() => {
    if (!visualizerMode) {
      setVisualizerSnapshots([]);
      setVisualizerStep(0);
      setVisualizerError(null);
      setIsPlaying(false);
      return;
    }

    const parsed = parseVisualizerState(code);
    setVisualizerSnapshots(parsed.snapshots);
    setVisualizerError(parsed.unsupportedReason ?? null);
    setVisualizerStep((prev) => clampStep(prev, parsed.snapshots.length || 0));
    setIsPlaying(false);
  }, [code, visualizerMode]);

  useEffect(() => {
    if (!visualizerMode || !isPlaying || visualizerSnapshots.length === 0) return;

    const intervalMs = Math.max(250, 1200 / visualizerSpeed);
    const intervalId = window.setInterval(() => {
      setVisualizerStep((prev) => {
        if (prev >= visualizerSnapshots.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => window.clearInterval(intervalId);
  }, [visualizerMode, isPlaying, visualizerSpeed, visualizerSnapshots]);

  const getEditorLanguage = (lang?: string): string => {
    const l = (lang || '').toLowerCase().trim();
    if (l.includes('python') || l === 'py') return 'python';
    if (l.includes('java') && !l.includes('script')) return 'java';
    if (l.includes('typescript') || l === 'ts') return 'typescript';
    if (l.includes('c++') || l.includes('cpp')) return 'cpp';
    if (l === 'c' || l === 'c-programming' || l.startsWith('c-')) return 'c';
    if (l.includes('go') || l.includes('golang')) return 'go';
    if (l.includes('rust')) return 'rust';
    if (l.includes('kotlin') || l === 'kt') return 'kotlin';
    if (l.includes('php')) return 'php';
    if (l.includes('html')) return 'html';
    if (l.includes('css')) return 'css';
    return 'javascript';
  };

  const getEditorFilename = (lang?: string): string => {
    const l = (lang || '').toLowerCase().trim();
    if (l.includes('python') || l === 'py') return 'main.py';
    if (l.includes('java') && !l.includes('script')) return 'Solution.java';
    if (l.includes('typescript') || l === 'ts') return 'index.ts';
    if (l.includes('c++') || l.includes('cpp')) return 'main.cpp';
    if (l === 'c' || l === 'c-programming' || l.startsWith('c-')) return 'main.c';
    if (l.includes('go') || l.includes('golang')) return 'main.go';
    if (l.includes('rust')) return 'main.rs';
    if (l.includes('kotlin') || l === 'kt') return 'Main.kt';
    if (l.includes('php')) return 'index.php';
    if (l.includes('html')) return 'index.html';
    if (l.includes('css')) return 'styles.css';
    return 'sandbox.js';
  };

  return (
    <div className="bg-glass border border-black/25 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 w-full">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-2">
            <div className="w-3 h-3 rounded-full bg-[#ef4444] opacity-80" />
            <div className="w-3 h-3 rounded-full bg-[#eab308] opacity-80" />
            <div className="w-3 h-3 rounded-full bg-[#22c55e] opacity-80" />
          </div>
          <span className="text-xs font-mono text-textMuted font-semibold tracking-wide select-none">
            {getEditorFilename(language)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowSnippetsPanel(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-textMuted hover:text-textMain hover:bg-black/5 dark:hover:bg-white/5 rounded-lg border border-black/10 dark:border-white/5 font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primaryLight"
            title="View saved snippets"
            aria-label="View saved snippets"
          >
            <FolderOpen size={12} />
            My Snippets{savedSnippets.length > 0 ? ` (${savedSnippets.length})` : ''}
          </button>

          <button
            type="button"
            onClick={() => { setSnippetNameDraft(''); setShowSaveDialog(true); }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-textMuted hover:text-textMain hover:bg-black/5 dark:hover:bg-white/5 rounded-lg border border-black/10 dark:border-white/5 font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primaryLight"
            title="Save current code as a snippet"
            aria-label="Save current code as a snippet"
          >
            <Save size={12} />
            Save
          </button>

          <button
            type="button"
            onClick={handleStartPairSession}
            disabled={isStartingPairSession}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-primaryLight bg-primary/10 hover:bg-primary/20 hover:text-white rounded-lg border border-primary/25 font-semibold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primaryLight disabled:opacity-50"
            title="Start a live collaborative pair programming session"
            aria-label="Start Pair Session"
          >
            {isStartingPairSession ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Users size={12} />
            )}
            Pair Program
          </button>

          {onRequestReview && language && (
            <button
              type="button"
              onClick={() => onRequestReview(code, language)}
              disabled={isReviewSubmitting || !code.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary/15 hover:bg-primary/25 disabled:opacity-50 text-primaryLight font-bold rounded-lg border border-primary/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight"
              title="Request peer review for current code"
              aria-label="Request peer review for current code"
            >
              {isReviewSubmitting ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Send size={12} />
              )}
              {isReviewSubmitting ? 'Submitting...' : 'Request Review'}
            </button>
          )}

          <button
            type="button"
            onClick={() => setVisualizerMode((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primaryLight ${
              visualizerMode
                ? 'bg-primary/15 text-primaryLight border-primary/30'
                : 'text-textMuted hover:text-textMain hover:bg-black/5 dark:hover:bg-white/5 border-black/10 dark:border-white/5'
            }`}
            title="Toggle visualizer mode"
          >
            <Eye size={12} />
            Visualizer Mode
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-textMuted hover:text-textMain hover:bg-black/5 dark:hover:bg-white/5 rounded-lg border border-black/10 dark:border-white/5 font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primaryLight"
            title="Reset to original code"
          >
            <RotateCcw size={12} />
            Reset
          </button>

          <button
            type="button"
            onClick={handleExecute}
            disabled={isExecuting}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs bg-gradient-main hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 text-white font-bold rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-primaryLight"
          >
            {isExecuting ? (
              <>
                <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play size={12} fill="currentColor" />
                Run Code
              </>
            )}
          </button>
        </div>
      </div>

      {/* Monaco Editor Component */}
      <div className="relative border-b border-black/10 dark:border-white/5 bg-[#1e1e1e]">
        <Editor
          height={height}
          defaultLanguage={getEditorLanguage(language)}
          language={getEditorLanguage(language)}
          value={code}
          onChange={(val) => setCode(val || '')}
          theme={isDark ? 'vs-dark' : 'light'}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: true,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true,
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
            padding: { top: 12, bottom: 12 }
          }}
        />
      </div>

      {visualizerMode && (
        <div className="border-t border-black/10 dark:border-white/10 bg-[#091121]">
          <VisualizerToolbar
            isPlaying={isPlaying}
            currentStep={visualizerStep}
            totalSteps={visualizerSnapshots.length}
            speed={visualizerSpeed}
            onPlay={handleVisualizerPlay}
            onPause={handleVisualizerPause}
            onStepForward={handleVisualizerStepForward}
            onStepBackward={handleVisualizerStepBackward}
            onSpeedChange={setVisualizerSpeed}
            disabled={visualizerSnapshots.length === 0}
          />

          {visualizerError ? (
            <div className="border-t border-black/10 px-4 py-4 text-sm text-amber-300 dark:border-white/10">
              {visualizerError}
            </div>
          ) : (
            <AlgorithmCanvas
              snapshot={visualizerSnapshots[visualizerStep]}
              currentStep={visualizerStep}
              totalSteps={visualizerSnapshots.length}
            />
          )}
        </div>
      )}

      {/* Output Terminal */}
      <div className="bg-[#050911] p-5 font-mono text-xs text-[#a9b2c3] border-t border-black/25 dark:border-white/5 shadow-inner">
        {/* Terminal Header */}
        <div className="flex items-center justify-between gap-2 mb-3 text-textMuted select-none border-b border-white/5 pb-2">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-primaryLight" />
            <span className="font-bold uppercase tracking-wider text-[10px]">Console Output</span>
            {executionTime !== null && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-sans font-bold border border-emerald-500/20">
                ⚡ {executionTime}ms
              </span>
            )}
          </div>
          {logs.length > 0 && (
            <button
              type="button"
              onClick={() => { setLogs([]); setError(null); }}
              className="text-[10px] text-textMuted hover:text-textMain transition-colors flex items-center gap-1 font-sans"
              title="Clear terminal output"
            >
              <Trash2 size={11} /> Clear
            </button>
          )}
        </div>

        {/* Terminal logs list with ref */}
        <div ref={terminalContainerRef} className="space-y-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
          {logs.length === 0 && !error && (
            <div className="text-textMuted/60 italic select-none">Click "Run Code" to view execution results.</div>
          )}
          {logs.map((log, i) => (
            <div key={i} className={`flex items-start gap-2 ${log.type === 'error' ? 'text-red-400' : log.type === 'warn' ? 'text-yellow-400' : 'text-emerald-400'}`}>
              <span className="opacity-40 select-none">&gt;</span>
              <span className="whitespace-pre-wrap leading-relaxed">{log.message}</span>
            </div>
          ))}

          {error && (
            <div className="text-red-400 bg-red-950/25 p-3 rounded-xl border border-red-500/20 flex gap-2.5 mt-2 animate-fade-in">
              <AlertTriangle size={16} className="shrink-0 mt-0.5 text-red-400" />
              <div className="space-y-1">
                <div className="font-bold text-sm">Runtime Error: {error.message}</div>
                {error.line !== undefined && (
                  <div className="text-[11px] opacity-75 font-semibold">
                    at line {error.line}
                  </div>
                )}
                {error.stack && (
                  <pre className="text-[10px] opacity-60 overflow-x-auto whitespace-pre-wrap max-w-full font-mono mt-1 pt-1 border-t border-red-500/10">
                    {error.stack.split('\n').slice(0, 3).join('\n')}
                  </pre>
                )}
              </div>
            </div>
          )}
          <div ref={terminalEndRef} />
        </div>
      </div>

      {/* Save Snippet Dialog */}
      {showSaveDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowSaveDialog(false)}
        >
          <div
            className="bg-glass border border-black/20 dark:border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-textMain">Save Snippet</h3>
              <button
                type="button"
                onClick={() => setShowSaveDialog(false)}
                aria-label="Close save dialog"
                className="text-textMuted hover:text-textMain"
              >
                <X size={16} />
              </button>
            </div>
            <input
              type="text"
              autoFocus
              value={snippetNameDraft}
              onChange={(e) => setSnippetNameDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSaveSnippet(); }}
              placeholder="Snippet name (e.g. Two Sum solution)"
              className="w-full rounded-xl border border-black/20 dark:border-white/10 bg-white/50 dark:bg-white/5 p-2.5 text-sm text-textMain placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-primaryLight"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowSaveDialog(false)}
                className="px-3 py-1.5 text-xs font-medium text-textMuted hover:text-textMain rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSnippet}
                disabled={!snippetNameDraft.trim()}
                className="px-4 py-1.5 text-xs bg-gradient-main text-white font-bold rounded-lg disabled:opacity-40 transition-all"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Snippets Panel */}
      {showSnippetsPanel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowSnippetsPanel(false)}
        >
          <div
            className="bg-glass border border-black/20 dark:border-white/10 rounded-2xl p-6 w-full max-w-md max-h-[70vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h3 className="text-sm font-bold text-textMain">My Saved Snippets</h3>
              <button
                type="button"
                onClick={() => setShowSnippetsPanel(false)}
                aria-label="Close saved snippets panel"
                className="text-textMuted hover:text-textMain"
              >
                <X size={16} />
              </button>
            </div>

            {savedSnippets.length === 0 ? (
              <p className="text-sm text-textMuted italic">
                No saved snippets yet. Write some code and hit "Save" to keep it here.
              </p>
            ) : (
              <div className="space-y-2 overflow-y-auto custom-scrollbar pr-1">
                {savedSnippets.map((snippet) => (
                  <div
                    key={snippet.id}
                    className="flex items-center justify-between gap-3 bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-3"
                  >
                    <button
                      type="button"
                      onClick={() => handleLoadSnippet(snippet)}
                      className="flex-1 min-w-0 text-left"
                    >
                      <div className="text-sm font-semibold text-textMain truncate">{snippet.name}</div>
                      <div className="text-[11px] text-textMuted">
                        {snippet.language} &middot; {new Date(snippet.updatedAt).toLocaleDateString()}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSnippet(snippet.id)}
                      aria-label={`Delete snippet ${snippet.name}`}
                      className="p-1.5 rounded-lg text-textMuted hover:text-danger hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
