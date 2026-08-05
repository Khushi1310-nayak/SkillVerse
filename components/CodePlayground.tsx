import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, Terminal, AlertTriangle } from 'lucide-react';

interface CodePlaygroundProps {
  initialCode: string;
}

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

export const CodePlayground: React.FC<CodePlaygroundProps> = ({ initialCode }) => {
  const [code, setCode] = useState(initialCode);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [error, setError] = useState<RuntimeError | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [srcDoc, setSrcDoc] = useState('');
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const terminalContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of terminal inside container only without moving page viewport
  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [logs, error]);

  const handleExecute = () => {
    setLogs([]);
    setError(null);
    setIsExecuting(true);

    // Build standard sandboxed html context
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <script>
            // Overwrite console methods to forward to parent window
            window.console = {
              log: function(...args) {
                const formatted = args.map(arg => {
                  if (arg === null) return 'null';
                  if (arg === undefined) return 'undefined';
                  if (typeof arg === 'object') {
                    try {
                      return JSON.stringify(arg, null, 2);
                    } catch (e) {
                      return String(arg);
                    }
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

            // Catch any compilation/uncaught exceptions
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
              // Execute user code
              ${code}
              // Signal success
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

    // Guard against infinite loop scenarios with a 4-second timeout limit
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsExecuting(false);
      setLogs(prev => [...prev, { type: 'error', message: 'Execution timed out (possible infinite loop detected).' }]);
    }, 4000);
  };

  const handleReset = () => {
    setCode(initialCode);
    setLogs([]);
    setError(null);
    setIsExecuting(false);
    setSrcDoc('');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
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
          <span className="text-xs font-mono text-textMuted font-semibold tracking-wide select-none">sandbox.js</span>
        </div>
        
        <div className="flex items-center gap-3">
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
          height="250px"
          defaultLanguage="javascript"
          language="javascript"
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

      {/* Sandbox IFrame */}
      {isExecuting && srcDoc && (
        <iframe
          ref={iframeRef}
          style={{ display: 'none' }}
          sandbox="allow-scripts"
          srcDoc={srcDoc}
          title="Sandbox Execution Environment"
        />
      )}

      {/* Output Terminal */}
      <div className="bg-[#050911] p-5 font-mono text-xs text-[#a9b2c3] border-t border-black/25 dark:border-white/5 shadow-inner">
        {/* Terminal Header */}
        <div className="flex items-center gap-2 mb-3 text-textMuted select-none border-b border-white/5 pb-2">
          <Terminal size={14} className="text-primaryLight" />
          <span className="font-bold uppercase tracking-wider text-[10px]">Console Output</span>
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
                    at line {error.line - 17} {/* Adjust line offset inside HTML template */}
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
  );
};
