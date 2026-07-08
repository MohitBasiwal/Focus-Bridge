import React from 'react';
import { useNavigation } from '../../navigation/NavigationContext';
import { useAnalyticsViewModel } from '../viewmodels/AnalyticsViewModel';
import { ChevronLeft, TrendingUp, TrendingDown, Target, Zap, Shield, AlertTriangle } from 'lucide-react';
import { MaterialCard } from '../components/MaterialCard';

export const FocusScoreScreen: React.FC = () => {
  const { goBack } = useNavigation();
  const { dailyStats } = useAnalyticsViewModel();

  if (!dailyStats) return null;

  return (
    <div className="flex flex-col min-h-full bg-slate-950 text-slate-100 w-full shadow-2xl overflow-hidden relative">
      <header className="relative z-10 px-6 py-6 flex items-center gap-4 border-b border-white/5">
        <button onClick={goBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-white flex-1">Focus Score Breakdown</h1>
      </header>

      <main className="relative z-10 flex-1 px-6 py-6 overflow-y-auto flex flex-col gap-6">
        
        <div className="text-center mb-4">
          <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-violet-400 to-indigo-600 mb-2">
            {dailyStats.focusScore}
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Base Score: 50</p>
        </div>

        <section>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Positive Factors</h2>
          <div className="flex flex-col gap-3">
            <MaterialCard className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-white text-sm">Completed Sessions</span>
              </div>
              <span className="text-emerald-400 font-bold">+{dailyStats.completedSessions * 5}</span>
            </MaterialCard>
            <MaterialCard className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-white text-sm">Hours Studied</span>
              </div>
              <span className="text-emerald-400 font-bold">+{Math.floor(dailyStats.totalStudyTimeMs / 3600000) * 2}</span>
            </MaterialCard>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Negative Factors</h2>
          <div className="flex flex-col gap-3">
            <MaterialCard className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span className="font-bold text-white text-sm">Missed Sessions</span>
              </div>
              <span className="text-rose-400 font-bold">-{dailyStats.missedSessions * 3}</span>
            </MaterialCard>
            <MaterialCard className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-rose-400" />
                <span className="font-bold text-white text-sm">Distractions Blocked</span>
              </div>
              <span className="text-rose-400 font-bold">-{dailyStats.blockedAppAttempts + dailyStats.blockedWebsiteAttempts}</span>
            </MaterialCard>
          </div>
        </section>
        
        <p className="text-xs text-slate-500 text-center mt-4">
          Focus Score is calculated daily based on your consistency and discipline. Maximum score is 100.
        </p>

      </main>
    </div>
  );
};
