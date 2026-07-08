import React, { useState, useEffect } from 'react';
import { MaterialCard } from '../components/MaterialCard';
import { Calendar, BarChart2, Settings, Clock, Target, Award, ShieldAlert, Globe, Unlock } from 'lucide-react';
import { motion } from 'motion/react';

import { useNavigation } from '../../navigation/NavigationContext';
import { unlockSessionManager } from '../../services/speech/UnlockSessionManager';
import { useAnalyticsViewModel } from '../viewmodels/AnalyticsViewModel';

export const DashboardScreen: React.FC = () => {
  const { navigate } = useNavigation();
  const [unlockRemaining, setUnlockRemaining] = useState(0);
  const { dailyStats } = useAnalyticsViewModel();

  useEffect(() => {
    setUnlockRemaining(unlockSessionManager.getRemainingTimeMs());
    const timer = setInterval(() => {
      setUnlockRemaining(unlockSessionManager.getRemainingTimeMs());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-full w-full relative">
      {/* Top App Bar */}
      <header className="relative z-10 px-6 py-8 flex justify-between items-center lg:hidden">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <span className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/50">
              <Award className="w-5 h-5 text-white" />
            </span>
            Focus Bridge
          </h1>
          <p className="text-slate-400 mt-1 text-sm font-medium">Digital Discipline</p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 p-1.5 pr-4 rounded-full">
          <div className="w-8 h-8 rounded-full bg-indigo-400/20 flex items-center justify-center">
            <span className="text-white text-xs font-semibold">FB</span>
          </div>
        </div>
      </header>

      {/* Header for LG */}
      <header className="hidden lg:flex relative z-10 px-6 py-8 items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          Overview
        </h1>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 px-6 pb-6 overflow-y-auto flex flex-col gap-6">

        
        {unlockRemaining > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-emerald-500/20 border border-emerald-500/50 p-6 rounded-[32px] flex flex-col items-center justify-center shadow-lg shadow-emerald-500/10">
              <Unlock className="w-8 h-8 text-emerald-400 mb-2" />
              <p className="text-emerald-300 font-bold uppercase tracking-widest text-xs mb-1">Focus Unlocked</p>
              <p className="text-white text-4xl font-bold tabular-nums">
                {String(Math.floor(unlockRemaining / 60000)).padStart(2, '0')}:
                {String(Math.floor((unlockRemaining % 60000) / 1000)).padStart(2, '0')}
              </p>
            </div>
          </motion.div>
        )}

        {/* Focus Score */}
        {dailyStats && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <MaterialCard className="flex flex-col items-center justify-center py-8">
              <div className="relative w-32 h-32 flex items-center justify-center mb-6">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-indigo-400" strokeDasharray="364" strokeDashoffset={364 - (dailyStats.focusScore / 100) * 364} strokeLinecap="round" />
                </svg>
                <div className="text-center">
                  <span className="text-4xl font-bold block leading-none text-white">{dailyStats.focusScore}</span>
                  <span className="text-[10px] uppercase tracking-widest text-indigo-300 font-bold mt-1 block">Focus Score</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-white">
                {dailyStats.focusScore >= 80 ? 'Excellent Momentum' : 
                 dailyStats.focusScore >= 50 ? 'Steady Progress' : 'Needs Improvement'}
              </h3>
            </MaterialCard>
          </motion.div>
        )}

        {/* Stats Grid */}
        {dailyStats && (
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <MaterialCard className="py-6 flex flex-col items-center text-center justify-between">
              <div className="flex w-full justify-between items-start mb-2">
                <div className="bg-emerald-400/20 p-2.5 rounded-2xl mx-auto">
                  <Target className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-medium mb-1">Today's Sessions</p>
                <p className="text-3xl font-bold text-white">{dailyStats.completedSessions}</p>
              </div>
            </MaterialCard>
            
            <MaterialCard className="py-6 flex flex-col items-center text-center justify-between">
              <div className="flex w-full justify-between items-start mb-2">
                <div className="bg-amber-400/20 p-2.5 rounded-2xl mx-auto">
                  <Clock className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-medium mb-1">Today's Focus Time</p>
                <p className="text-3xl font-bold text-white">{Math.floor(dailyStats.totalStudyTimeMs / 3600000)}h</p>
              </div>
            </MaterialCard>
          </motion.div>
        )}

        {/* Next Session */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4 mt-2">
            <h3 className="text-lg font-bold text-white">Up Next</h3>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="w-2 h-10 bg-indigo-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-bold text-white">Advanced Mathematics</p>
                <p className="text-xs text-slate-500 uppercase font-semibold">14:00 - 15:30 • 90 min</p>
              </div>
              <button 
                onClick={() => navigate('blocking_screen', { appName: 'Instagram', sessionName: 'Advanced Mathematics' })}
                className="w-10 h-10 rounded-full bg-rose-500/20 hover:bg-rose-500/40 transition-colors flex items-center justify-center flex-shrink-0 cursor-pointer border border-rose-500/30"
                title="Test App Block"
              >
                <ShieldAlert className="w-4 h-4 text-rose-400" />
              </button>
              <button 
                onClick={() => navigate('blocking_screen', { websiteDomain: 'youtube.com', sessionName: 'Advanced Mathematics' })}
                className="w-10 h-10 rounded-full bg-rose-500/20 hover:bg-rose-500/40 transition-colors flex items-center justify-center flex-shrink-0 cursor-pointer border border-rose-500/30"
                title="Test Website Block"
              >
                <Globe className="w-4 h-4 text-rose-400" />
              </button>
            </div>
          </div>
        </motion.div>

      </main>

    </div>
  );
};
