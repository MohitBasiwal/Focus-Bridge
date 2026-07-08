import React from 'react';
import { useNavigation } from '../../navigation/NavigationContext';
import { useSecurityCenterViewModel } from '../viewmodels/SecurityCenterViewModel';
import { ChevronLeft, Shield, CheckCircle, XCircle, Trash2, ShieldAlert } from 'lucide-react';
import { MaterialCard } from '../components/MaterialCard';

export const SecurityCenterScreen: React.FC = () => {
  const { goBack } = useNavigation();
  const { history, clearHistory } = useSecurityCenterViewModel();

  return (
    <div className="flex flex-col min-h-full bg-slate-950 text-slate-100 w-full shadow-2xl overflow-hidden relative">
      <header className="relative z-10 px-6 py-6 flex items-center gap-4 border-b border-white/5">
        <button onClick={goBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-white flex-1">Security Center</h1>
        {history.length > 0 && (
          <button onClick={clearHistory} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-slate-400 hover:text-white">
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </header>

      <main className="relative z-10 flex-1 px-6 py-6 overflow-y-auto flex flex-col gap-6">
        
        {/* Tamper Status */}
        <section>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Tamper Monitor</h2>
          <MaterialCard className="p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm text-white flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Accessibility Service
              </span>
              <span className="text-xs text-emerald-400 font-bold uppercase">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm text-white flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Usage Access
              </span>
              <span className="text-xs text-emerald-400 font-bold uppercase">Active</span>
            </div>
            <div className="flex items-center justify-between opacity-50">
              <span className="font-medium text-sm text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" /> Battery Optimization
              </span>
              <span className="text-xs text-amber-400 font-bold uppercase">Ignored</span>
            </div>
          </MaterialCard>
        </section>

        {/* Security Log */}
        <section>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Security Log</h2>
          {history.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No security events recorded yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {history.map((event, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{event.action}</span>
                    <span className="text-xs text-slate-400">
                      {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Shield className="w-3 h-3" /> {event.puzzleType}
                    </span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${
                      event.result === 'Success' ? 'text-emerald-400' :
                      event.result === 'Failure' ? 'text-rose-400' : 'text-slate-400'
                    }`}>
                      {event.result}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
};
