import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('SkillVerse ErrorBoundary caught an exception:', error, errorInfo);
    
    // Auto-reload window if a dynamic chunk load failed due to PWA cache mismatch
    if (error.message && (error.message.includes('Failed to fetch dynamically imported module') || error.message.includes('Importing a module script failed'))) {
      const storageKey = 'chunk_reload_' + window.location.pathname;
      const reloaded = sessionStorage.getItem(storageKey);
      if (!reloaded) {
        sessionStorage.setItem(storageKey, 'true');
        window.location.reload();
      }
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full py-16 flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
          <div className="bg-glass border border-red-500/20 p-8 rounded-3xl backdrop-blur-md max-w-md w-full shadow-2xl flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-textMain mb-2">Something went wrong</h3>
            <p className="text-textMuted text-sm mb-6 leading-relaxed">
              {this.state.error?.message || 'An unexpected error occurred while loading this view.'}
            </p>
            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-main text-white font-semibold text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-all cursor-pointer"
            >
              <RefreshCw size={16} />
              Reload View
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
