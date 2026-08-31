import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, Terminal, AlertTriangle, Share2, ArrowLeft, Loader2, Sparkles, Wifi } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { firestoreService } from '../../services/firestoreService';
import { PairSession } from '../../types';
import { ActivePeers } from './ActivePeers';
import { SessionShareModal } from './SessionShareModal';

interface LogEntry {
  type: 'log' | 'error' | 'warn';
  message: string;
}

interface RuntimeError {
  message: string;
  line?: number;
  col?: number;
  stack?: string;
}

interface SerializedOutput {
  logs: LogEntry[];
  error: RuntimeError | null;
}

export const CollaborativePlayground: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, appUser } = useAuthContext();
  const { showToast } = useToast();

  const [session, setSession] = useState<PairSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [error, setError] = useState<RuntimeError | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [srcDoc, setSrcDoc] = useState('');
  const [showShareModal, setShowShareModal] = useState<boolean>(!!(location.state as any)?.autoOpenShare);
  const [isDark] = useState(document.documentElement.classList.contains('dark'));

  // Debounce and feedback-loop guard refs
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastLocalEditTimeRef = useRef<number>(0);
  const codeRef = useRef<string>('');
  codeRef.current = code;

  const currentUserId = user?.uid || '';
  const currentUsername = appUser?.username || user?.displayName || 'Anonymous Learner';
  const currentPhotoURL = user?.photoURL || appUser?.photoURL || '';

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const executionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const terminalContainerRef = useRef<HTMLDivElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal container on new output
  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [logs, error]);

  // Join session and set up Firestore real-time listener
  useEffect(() => {
    if (!roomId) {
      navigate('/playground');
      return;
    }

    if (!user) {
      setLoading(false);
      return;
    }

    let isSubscribed = true;

    // Join the session
    firestoreService
      .joinPairSession(roomId, user.uid, currentUsername, currentPhotoURL)
      .catch((err) => {
        console.error('Error joining session:', err);
        showToast({ message: 'Failed to join pair session', type: 'error' });
      });

    // Subscribe to session updates
    const unsubscribe = firestoreService.subscribeToPairSession(roomId, (updatedSession) => {
      if (!isSubscribed) return;

      if (!updatedSession) {
        setLoading(false);
        showToast({ message: 'Pair session not found or has ended.', type: 'error' });
        navigate('/playground');
        return;
      }

      setSession(updatedSession);
      setLoading(false);

      // Handle remote code updates with feedback loop guard
      const now = Date.now();
      const isMyOwnEdit = updatedSession.lastEditedBy === user.uid;
      const isRecentLocalEdit = now - lastLocalEditTimeRef.current < 1000;

      // Only update local editor if code was changed by peer and local user isn't in mid-type
      if (!isMyOwnEdit && !isRecentLocalEdit && updatedSession.code !== codeRef.current) {
        setCode(updatedSession.code);
      } else if (codeRef.current === '' && updatedSession.code) {
        // Initial load of session code
        setCode(updatedSession.code);
      }

      // Handle shared output updates from Firestore
      if (updatedSession.output) {
        try {
          const parsedOutput: SerializedOutput = JSON.parse(updatedSession.output);
          setLogs(parsedOutput.logs || []);
          setError(parsedOutput.error || null);
        } catch {
          // Fallback if output is plain text
          setLogs([{ type: 'log', message: updatedSession.output }]);
          setError(null);
        }
      }
    });

    // Cleanup on unmount or tab close
    const handleBeforeUnload = () => {
      if (roomId && user?.uid) {
        firestoreService.leavePairSession(roomId, user.uid).catch(console.error);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      isSubscribed = false;
      window.removeEventListener('beforeunload', handleBeforeUnload);
      unsubscribe();
      if (roomId && user?.uid) {
        firestoreService.leavePairSession(roomId, user.uid).catch(console.error);
      }
    };
  }, [roomId, user?.uid, currentUsername, currentPhotoURL, navigate, showToast]);

  // Debounced code change handler (400-600ms)
  const handleCodeChange = (newVal: string | undefined) => {
    const updatedCode = newVal || '';
    setCode(updatedCode);
    lastLocalEditTimeRef.current = Date.now();

    if (!roomId || !user?.uid) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      firestoreService
        .updatePairSessionCode(roomId, user.uid, updatedCode)
        .catch((err) => console.error('Error syncing pair session code:', err));
    }, 500);
  };

  // Sandboxed code execution message listener
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'console-log') {
        setLogs((prev) => {
          const updated = [...prev, { type: 'log' as const, message: data.message }];
          if (roomId) {
            firestoreService.updatePairSessionOutput(
              roomId,
              JSON.stringify({ logs: updated, error: null } as SerializedOutput)
            ).catch(console.error);
          }
          return updated;
        });
      } else if (data.type === 'console-warn') {
        setLogs((prev) => {
          const updated = [...prev, { type: 'warn' as const, message: data.message }];
          if (roomId) {
            firestoreService.updatePairSessionOutput(
              roomId,
              JSON.stringify({ logs: updated, error: null } as SerializedOutput)
            ).catch(console.error);
          }
          return updated;
        });
      } else if (data.type === 'console-error') {
        setLogs((prev) => {
          const updated = [...prev, { type: 'error' as const, message: data.message }];
          if (roomId) {
            firestoreService.updatePairSessionOutput(
              roomId,
              JSON.stringify({ logs: updated, error: null } as SerializedOutput)
            ).catch(console.error);
          }
          return updated;
        });
      } else if (data.type === 'runtime-error') {
        setIsExecuting(false);
        const runtimeErr: RuntimeError = {
          message: data.message,
          line: data.line,
          col: data.col,
          stack: data.stack,
        };
        setError(runtimeErr);
        if (roomId) {
          firestoreService.updatePairSessionOutput(
            roomId,
            JSON.stringify({ logs, error: runtimeErr } as SerializedOutput)
          ).catch(console.error);
        }
      } else if (data.type === 'execution-success') {
        setIsExecuting(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [roomId, logs]);

  // Local execution trigger
  const handleExecute = () => {
    setLogs([]);
    setError(null);
    setIsExecuting(true);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <script>
            window.console = {
              log: function(...args) {
                const formatted = args.map(arg => {
                  if (arg === null) return 'null';
                  if (arg === undefined) return 'undefined';
                  if (typeof arg === 'object') {
                    try { return JSON.stringify(arg, null, 2); } catch (e) { return String(arg); }
                  }
                  return String(arg);
                }).join(' ');
                window.parent.postMessage({ type: 'console-log', message: formatted }, '*');
              },
              error: function(...args) {
                const formatted = args.join(' ');
                window.parent.postMessage({ type: 'console-error', message: formatted }, '*');
              },
              warn: function(...args) {
                const formatted = args.join(' ');
                window.parent.postMessage({ type: 'console-warn', message: formatted }, '*');
              }
            };

            window.onerror = function(message, source, lineno, colno, errorObj) {
              window.parent.postMessage({
                type: 'runtime-error',
                message: errorObj ? errorObj.message : message,
                line: lineno,
                col: colno,
                stack: errorObj ? errorObj.stack : ''
              }, '*');
              return true;
            };
          </script>
        </head>
        <body>
          <script>
            try {
              ${code}
              window.parent.postMessage({ type: 'execution-success' }, '*');
            } catch (err) {
              window.parent.postMessage({
                type: 'runtime-error',
                message: err.message,
                stack: err.stack
              }, '*');
            }
          </script>
        </body>
      </html>
    `;

    setSrcDoc(htmlContent);

    if (executionTimeoutRef.current) clearTimeout(executionTimeoutRef.current);
    executionTimeoutRef.current = setTimeout(() => {
      setIsExecuting(false);
      const timeoutLog: LogEntry = { type: 'error', message: 'Execution timed out (possible infinite loop).' };
      setLogs((prev) => {
        const updated = [...prev, timeoutLog];
        if (roomId) {
          firestoreService.updatePairSessionOutput(
            roomId,
            JSON.stringify({ logs: updated, error: null } as SerializedOutput)
          ).catch(console.error);
        }
        return updated;
      });
    }, 4000);
  };

  const handleReset = () => {
    const defaultSnippet = '// Write collaborative JavaScript code here\nconsole.log("Hello, Pair Partner!");\n';
    setCode(defaultSnippet);
    setLogs([]);
    setError(null);
    setIsExecuting(false);
    setSrcDoc('');
    if (roomId && user?.uid) {
      firestoreService.updatePairSessionCode(roomId, user.uid, defaultSnippet).catch(console.error);
      firestoreService.updatePairSessionOutput(roomId, '').catch(console.error);
    }
  };

  const handleLeaveSession = () => {
    if (roomId && user?.uid) {
      firestoreService.leavePairSession(roomId, user.uid).catch(console.error);
    }
    navigate('/playground');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1d]">
        <div className="flex flex-col items-center gap-4 bg-glass border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
          <Loader2 className="animate-spin text-primaryLight w-10 h-10" />
          <p className="text-white font-medium text-sm">Connecting to Pair Session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1d] p-4">
        <div className="bg-glass border border-white/10 rounded-3xl p-8 max-w-md text-center shadow-2xl backdrop-blur-xl space-y-4">
          <h2 className="text-xl font-bold text-white">Login Required</h2>
          <p className="text-sm text-textMuted">
            You need to be signed in to join this collaborative pair programming session.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-2.5 rounded-xl bg-gradient-main text-white font-bold text-sm shadow-lg shadow-primary/25"
          >
            Go to Home & Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-textMain pt-20 pb-12 px-4 md:px-8">
      {/* Session Top Bar */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-glass border border-white/10 rounded-3xl p-5 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLeaveSession}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-textMuted hover:text-white transition-all"
              title="Leave Pair Session"
              aria-label="Leave Pair Session"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary/20 text-primaryLight text-xs font-bold uppercase tracking-wider border border-primary/30">
                  <Wifi size={11} className="animate-pulse text-emerald-400" /> Live Pair Room
                </span>
                <span className="text-xs text-textMuted font-mono">
                  Room: {roomId?.slice(0, 8)}...
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-display font-bold text-white flex items-center gap-2">
                Pair Programming Playground <Sparkles size={18} className="text-primaryLight" />
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {/* Active Peers Presence Avatars */}
            {session && (
              <ActivePeers
                participants={session.participants || []}
                currentUserId={currentUserId}
              />
            )}

            {/* Share Invite Link Button */}
            <button
              type="button"
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary/15 hover:bg-primary/25 border border-primary/30 text-primaryLight text-xs font-bold transition-all shadow-sm"
              title="Invite Partner to Session"
            >
              <Share2 size={13} />
              Share Link
            </button>
          </div>
        </div>
      </div>

      {/* Main Collaborative Code Editor & Terminal Card */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-glass border border-black/25 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
          {/* Editor Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5 mr-2">
                <div className="w-3 h-3 rounded-full bg-[#ef4444] opacity-80" />
                <div className="w-3 h-3 rounded-full bg-[#eab308] opacity-80" />
                <div className="w-3 h-3 rounded-full bg-[#22c55e] opacity-80" />
              </div>
              <span className="text-xs font-mono text-textMuted font-semibold tracking-wide select-none">
                pair-session.js
              </span>
              {session?.lastEditedBy && session.lastEditedBy !== currentUserId && (
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 animate-fade-in">
                  Partner editing
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-textMuted hover:text-textMain hover:bg-black/5 dark:hover:bg-white/5 rounded-lg border border-black/10 dark:border-white/5 font-medium transition-all"
                title="Reset code"
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

          {/* Monaco Editor */}
          <div className="relative border-b border-black/10 dark:border-white/5 bg-[#1e1e1e]">
            <Editor
              height="380px"
              defaultLanguage="javascript"
              language="javascript"
              value={code}
              onChange={handleCodeChange}
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
                padding: { top: 12, bottom: 12 },
              }}
            />
          </div>

          {/* Sandboxed Iframe */}
          {isExecuting && srcDoc && (
            <iframe
              ref={iframeRef}
              style={{ display: 'none' }}
              sandbox="allow-scripts"
              srcDoc={srcDoc}
              title="Pair Session Sandbox Execution"
            />
          )}

          {/* Shared Terminal Output */}
          <div className="bg-[#050911] p-5 font-mono text-xs text-[#a9b2c3] shadow-inner">
            <div className="flex items-center justify-between mb-3 text-textMuted select-none border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-primaryLight" />
                <span className="font-bold uppercase tracking-wider text-[10px]">
                  Shared Console Output
                </span>
              </div>
              <span className="text-[10px] text-textMuted/60 italic">
                Output synchronizes in real time
              </span>
            </div>

            <div
              ref={terminalContainerRef}
              className="space-y-2 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar"
            >
              {logs.length === 0 && !error && (
                <div className="text-textMuted/60 italic select-none">
                  Click "Run Code" to execute script and share live output with your partner.
                </div>
              )}
              {logs.map((log, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 ${
                    log.type === 'error'
                      ? 'text-red-400'
                      : log.type === 'warn'
                      ? 'text-yellow-400'
                      : 'text-emerald-400'
                  }`}
                >
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
                        at line {error.line - 17}
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
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && roomId && (
        <SessionShareModal
          sessionId={roomId}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};
