import React, { useState, useEffect } from 'react';
import { useNavigation } from '../../navigation/NavigationContext';
import { ShieldAlert, Unlock, Clock, Globe } from 'lucide-react';
import { motion } from 'motion/react';

export const BlockingScreen: React.FC = () => {
  const { goBack, params, navigate } = useNavigation();
  const [timeLeft, setTimeLeft] = useState('45:00');
  
  const blockedApp = params?.appName;
  const blockedWebsite = params?.websiteDomain;
  const sessionName = params?.sessionName || 'Advanced Calculus';
  
  const title = blockedWebsite ? `${blockedWebsite} Blocked` : `${blockedApp || 'App'} Blocked`;
  const subtitle = blockedWebsite 
    ? 'This website is unavailable during your current study session.' 
    : 'This app is unavailable during your current study session.';

  useEffect(() => {
    // Simulated countdown
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const [min, sec] = prev.split(':').map(Number);
        if (min === 0 && sec === 0) return '00:00';
        if (sec === 0) return `${String(min - 1).padStart(2, '0')}:59`;
        return `${String(min).padStart(2, '0')}:${String(sec - 1).padStart(2, '0')}`;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleUnlock = () => {
    navigate('speech_challenge');
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-950 text-slate-100 w-full overflow-hidden relative">
      {/* Intense Background Blurs for Block Screen */}
      <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-rose-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="w-24 h-24 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-rose-500/20"
        >
          {blockedWebsite ? (
            <Globe className="w-12 h-12 text-rose-400" />
          ) : (
            <ShieldAlert className="w-12 h-12 text-rose-400" />
          )}
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
          <p className="text-slate-400 font-medium mb-8">{subtitle}</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 mb-8"
        >
          <p className="text-sm text-indigo-300 font-bold uppercase tracking-widest mb-2">Active Session</p>
          <h2 className="text-xl font-bold text-white mb-6">{sessionName}</h2>
          
          <div className="flex items-center justify-center gap-3 text-emerald-400">
            <Clock className="w-6 h-6" />
            <span className="text-4xl font-bold tabular-nums">{timeLeft}</span>
          </div>
          <p className="text-xs text-slate-500 font-semibold uppercase mt-2">Remaining</p>
        </motion.div>
      </main>

      <footer className="relative z-10 p-6 flex flex-col gap-4">
        <button 
          onClick={handleUnlock}
          className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-[24px] py-4 font-bold text-lg flex items-center justify-center gap-3 transition-all"
        >
          <Unlock className="w-5 h-5" />
          Unlock for 5 Minutes
        </button>
        <button 
          onClick={goBack}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-[24px] py-4 font-bold text-lg transition-all shadow-lg shadow-indigo-500/20"
        >
          Return to {blockedWebsite ? 'Allowed Apps' : 'Focus'}
        </button>
      </footer>
    </div>
  );
};
