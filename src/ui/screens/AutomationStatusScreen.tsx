import React, { useState, useEffect } from 'react';
import { useNavigation } from '../../navigation/NavigationContext';
import { ChevronLeft, Zap, CheckCircle2, Circle } from 'lucide-react';
import { AutomationEngine, ActiveSessionContext } from '../../services/automation/AutomationEngine';
import { MaterialCard } from '../components/MaterialCard';

export const AutomationStatusScreen: React.FC = () => {
  const { goBack } = useNavigation();
  const [activeContext, setActiveContext] = useState<ActiveSessionContext | null>(null);

  useEffect(() => {
    const unsubscribe = AutomationEngine.getInstance().subscribe(setActiveContext);
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col min-h-full bg-slate-950 text-slate-100 w-full overflow-hidden relative">
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-emerald-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <header className="relative z-10 px-6 py-6 flex items-center gap-4 border-b border-white/5">
        <button onClick={goBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold text-white flex-1">Automation Engine</h1>
      </header>

      <main className="relative z-10 flex-1 px-6 py-6 overflow-y-auto flex flex-col gap-6">
        
        <MaterialCard className="p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 relative">
            <Zap className="w-8 h-8 text-emerald-400" />
            <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-900"></div>
          </div>
          <h2 className="text-lg font-bold">Engine is Active</h2>
          <p className="text-sm text-slate-400 mt-2">
            The Automation Engine is currently monitoring your schedule and will automatically toggle Focus Mode based on your timetables.
          </p>
        </MaterialCard>

        <section>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Current Status</h2>
          
          {activeContext ? (
            <MaterialCard className="p-4 border-indigo-500/30 bg-indigo-500/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <span className="text-2xl">{activeContext.session.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-indigo-100">{activeContext.session.title}</h3>
                  <p className="text-xs text-indigo-300/70">
                    {activeContext.isBreak ? 'Taking a break' : 'Focus Mode active'}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded-lg">
                    {activeContext.session.startTime} - {activeContext.session.endTime}
                  </span>
                </div>
              </div>
            </MaterialCard>
          ) : (
            <MaterialCard className="p-4 flex items-center justify-center py-8">
              <div className="text-center opacity-50">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                <p className="text-sm font-medium">No active sessions right now.</p>
                <p className="text-xs">Automation will engage at your next scheduled time.</p>
              </div>
            </MaterialCard>
          )}

        </section>

        <section>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Background Workers</h2>
          <div className="flex flex-col gap-3">
            {[
              { title: 'Session Scheduler', status: 'Running' },
              { title: 'Reminder Engine', status: 'Running' },
              { title: 'Daily Reset', status: 'Pending 00:00' },
              { title: 'Analytics Sync', status: 'Idle' },
            ].map(worker => (
              <div key={worker.title} className="flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Circle className="w-2 h-2 fill-emerald-400 text-emerald-400" />
                  <span className="font-medium text-sm text-white">{worker.title}</span>
                </div>
                <span className="text-xs font-mono text-slate-400">{worker.status}</span>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};
