import React, { Component, ErrorInfo } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';
import { MaterialCard } from './MaterialCard';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 p-6 justify-center items-center">
          <MaterialCard className="p-8 max-w-md w-full flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center mb-6">
              <AlertOctagon className="w-8 h-8 text-rose-400" />
            </div>
            <h1 className="text-xl font-bold text-white mb-2">Something went wrong</h1>
            <p className="text-sm text-slate-400 mb-6">
              Focus Bridge encountered an unexpected error. But don't worry, your data is safe.
            </p>
            
            <div className="bg-slate-900 rounded-xl p-4 w-full text-left overflow-auto mb-8 border border-white/5">
              <code className="text-[10px] text-rose-300 font-mono">
                {this.state.error?.toString()}
              </code>
            </div>

            <button 
              onClick={() => {
                // @ts-ignore
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl transition-colors flex justify-center items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Restart App
            </button>
          </MaterialCard>
        </div>
      );
    }

    // @ts-ignore
    return this.props.children;
  }
}
