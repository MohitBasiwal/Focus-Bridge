import React from 'react';
import { useNavigation } from '../../navigation/NavigationContext';
import { useAnalyticsViewModel } from '../viewmodels/AnalyticsViewModel';
import { ChevronLeft, Target, TrendingUp, Award, BrainCircuit, Activity, Clock } from 'lucide-react';
import { MaterialCard } from '../components/MaterialCard';
import { motion } from 'motion/react';

export const AnalyticsDashboardScreen: React.FC = () => {
  const { goBack, navigate } = useNavigation();
  const { dailyStats, achievements, insights, totalSessions } = useAnalyticsViewModel();

  if (!dailyStats) return null;

  return (
    <div className="flex flex-col min-h-full bg-slate-950 text-slate-100 w-full shadow-2xl overflow-hidden relative">
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-violet-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <header className="relative z-10 px-6 py-6 flex items-center gap-4 border-b border-white/5 lg:hidden">
        <button onClick={goBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-white flex-1">Analytics Engine</h1>
      </header>
      
      {/* Header for LG */}
      <header className="hidden lg:flex relative z-10 px-6 py-8 items-center justify-between border-b border-white/5">
        <h1 className="text-3xl font-bold tracking-tight text-white">Analytics Engine</h1>
      </header>

      <main className="relative z-10 flex-1 px-6 py-6 overflow-y-auto flex flex-col gap-6">
        
        {/* Focus Score Overview */}
        <section>
          <MaterialCard 
            className="p-6 flex flex-col items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
            onClick={() => navigate('focus_score')}
          >
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Current Focus Score</h2>
            <div className="relative w-32 h-32 flex items-center justify-center mb-2">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/10" />
                <motion.circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  strokeLinecap="round"
                  className="text-violet-500"
                  initial={{ strokeDasharray: '0 283' }}
                  animate={{ strokeDasharray: `${(dailyStats.focusScore / 100) * 283} 283` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-white">{dailyStats.focusScore}</span>
              </div>
            </div>
            <p className="text-sm font-medium text-violet-300 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> Top 10% this week
            </p>
          </MaterialCard>
        </section>

        {/* Quick Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <MaterialCard className="p-4 flex flex-col gap-1 items-start">
             <Clock className="w-5 h-5 text-indigo-400 mb-1" />
             <p className="text-2xl font-bold text-white">{Math.floor(dailyStats.totalStudyTimeMs / 3600000)}h</p>
             <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Today's Focus</p>
          </MaterialCard>
          <MaterialCard className="p-4 flex flex-col gap-1 items-start">
             <TrendingUp className="w-5 h-5 text-emerald-400 mb-1" />
             <p className="text-2xl font-bold text-white">7</p>
             <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Current Streak</p>
          </MaterialCard>
          <MaterialCard className="p-4 flex flex-col gap-1 items-start">
             <Target className="w-5 h-5 text-emerald-400 mb-1" />
             <p className="text-2xl font-bold text-white">{dailyStats.completedSessions}</p>
             <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Completed</p>
          </MaterialCard>
          <MaterialCard className="p-4 flex flex-col gap-1 items-start">
             <Activity className="w-5 h-5 text-rose-400 mb-1" />
             <p className="text-2xl font-bold text-white">{dailyStats.blockedAppAttempts + dailyStats.blockedWebsiteAttempts}</p>
             <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Distractions Blocked</p>
          </MaterialCard>
          <MaterialCard className="p-4 flex flex-col gap-1 items-start">
             <Target className="w-5 h-5 text-rose-400 mb-1" />
             <p className="text-2xl font-bold text-white">{dailyStats.missedSessions}</p>
             <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Missed Sessions</p>
          </MaterialCard>
          <MaterialCard 
            className="p-4 flex flex-col gap-1 items-start cursor-pointer hover:bg-white/20 transition-colors"
            onClick={() => navigate('achievements')}
          >
             <Award className="w-5 h-5 text-amber-400 mb-1" />
             <p className="text-2xl font-bold text-white">{achievements.filter(a => a.isUnlocked).length}</p>
             <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Achievements</p>
          </MaterialCard>
        </section>
        
        <section>
          <button 
            onClick={() => navigate('study_history')}
            className="w-full bg-white/5 border border-white/10 p-4 rounded-[24px] flex justify-between items-center hover:bg-white/10 transition-colors"
          >
            <span className="font-bold text-white">View Full Study Reports</span>
            <ChevronLeft className="w-5 h-5 text-slate-400 transform rotate-180" />
          </button>
        </section>

        {/* AI Insights */}
        <section>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-violet-400" /> AI Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {insights.map(insight => (
              <MaterialCard key={insight.id} className="p-4 h-full">
                <p className="text-sm font-medium text-slate-300 leading-relaxed">
                  "{insight.text}"
                </p>
              </MaterialCard>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};
