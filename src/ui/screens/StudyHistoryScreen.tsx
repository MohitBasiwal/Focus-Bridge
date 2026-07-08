import React, { useState } from 'react';
import { useNavigation } from '../../navigation/NavigationContext';
import { useAnalyticsViewModel } from '../viewmodels/AnalyticsViewModel';
import { ChevronLeft, Calendar as CalendarIcon, FileText } from 'lucide-react';
import { MaterialCard } from '../components/MaterialCard';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, YAxis } from 'recharts';

const weeklyData = [
  { day: 'Mon', hours: 4 },
  { day: 'Tue', hours: 3 },
  { day: 'Wed', hours: 6 },
  { day: 'Thu', hours: 4.5 },
  { day: 'Fri', hours: 5 },
  { day: 'Sat', hours: 2 },
  { day: 'Sun', hours: 3 },
];

export const StudyHistoryScreen: React.FC = () => {
  const { goBack } = useNavigation();
  const { dailyStats } = useAnalyticsViewModel();
  const [tab, setTab] = useState<'Weekly' | 'Monthly'>('Weekly');

  return (
    <div className="flex flex-col min-h-full bg-slate-950 text-slate-100 w-full shadow-2xl overflow-hidden relative">
      <header className="relative z-10 px-6 py-6 flex items-center gap-4 border-b border-white/5">
        <button onClick={goBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-white flex-1">Study Reports</h1>
      </header>

      <div className="px-6 py-4 border-b border-white/5 flex gap-2">
        <button 
          onClick={() => setTab('Weekly')}
          className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${tab === 'Weekly' ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400'}`}
        >
          Weekly
        </button>
        <button 
          onClick={() => setTab('Monthly')}
          className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${tab === 'Monthly' ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400'}`}
        >
          Monthly
        </button>
      </div>

      <main className="relative z-10 flex-1 px-6 py-6 overflow-y-auto flex flex-col gap-6 pb-20">
        {tab === 'Weekly' ? (
          <section className="flex flex-col gap-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" /> This Week's Summary
            </h2>
            
            <MaterialCard className="p-4 h-64">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Study Hours</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  <Bar dataKey="hours" fill="#6366f1" radius={[4, 4, 0, 0]} animationDuration={1500} />
                </BarChart>
              </ResponsiveContainer>
            </MaterialCard>

            <MaterialCard className="p-5 flex flex-col gap-3">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-sm text-slate-400">Study Hours</span>
                <span className="font-bold text-white text-lg">{dailyStats ? Math.floor(dailyStats.totalStudyTimeMs / 3600000) : 0}h</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-sm text-slate-400">Focus Score Trend</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">+5%</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-sm text-slate-400">Most Productive Day</span>
                <span className="font-bold text-white">Wednesday</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Distractions Blocked</span>
                <span className="font-bold text-rose-400">{dailyStats ? dailyStats.blockedAppAttempts + dailyStats.blockedWebsiteAttempts : 0}</span>
              </div>
            </MaterialCard>
            <MaterialCard className="p-4 bg-indigo-500/10 border-indigo-500/20">
              <p className="text-sm text-indigo-300 font-medium flex items-start gap-2">
                <FileText className="w-5 h-5 flex-shrink-0 mt-0.5" />
                "Great consistency this week. You struggled slightly on Tuesday, but recovered strong. Keep it up!"
              </p>
            </MaterialCard>
          </section>
        ) : (
          <section className="flex flex-col gap-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" /> This Month's Summary
            </h2>
            <MaterialCard className="p-5 flex flex-col gap-3">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-sm text-slate-400">Total Study Time</span>
                <span className="font-bold text-white text-lg">42h</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-sm text-slate-400">Longest Streak</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">12 Days</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-sm text-slate-400">Top Subject</span>
                <span className="font-bold text-white">Mathematics</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Unlock Challenges</span>
                <span className="font-bold text-amber-400">14</span>
              </div>
            </MaterialCard>
            <MaterialCard className="p-4 bg-indigo-500/10 border-indigo-500/20">
              <p className="text-sm text-indigo-300 font-medium flex items-start gap-2">
                <FileText className="w-5 h-5 flex-shrink-0 mt-0.5" />
                "You are maintaining a strong Focus Score average of 82. Consider taking longer breaks on weekends."
              </p>
            </MaterialCard>
          </section>
        )}
      </main>
    </div>
  );
};
