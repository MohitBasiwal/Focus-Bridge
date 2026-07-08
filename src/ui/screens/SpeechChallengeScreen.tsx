import React, { useState } from 'react';
import { useNavigation } from '../../navigation/NavigationContext';
import { useSpeechChallengeViewModel } from '../viewmodels/SpeechChallengeViewModel';
import { Mic, MicOff, AlertCircle, CheckCircle, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';

export const SpeechChallengeScreen: React.FC = () => {
  const { goBack } = useNavigation();
  const [success, setSuccess] = useState(false);

  const handleSuccess = () => {
    setSuccess(true);
    setTimeout(() => {
      goBack(); // Go back to original app or dashboard
    }, 3000);
  };

  const handleFailure = () => {
    // Handled in VM, UI will show error automatically
  };

  const {
    words,
    currentIndex,
    isListening,
    error,
    permissionStatus,
    startListening,
    stopListening
  } = useSpeechChallengeViewModel(handleSuccess, handleFailure);

  if (success) {
    return (
      <div className="flex flex-col min-h-full bg-slate-950 text-slate-100 w-full overflow-hidden relative items-center justify-center">
        <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center"
        >
          <CheckCircle className="w-24 h-24 text-emerald-400 mb-6" />
          <h1 className="text-3xl font-bold text-white mb-2">Challenge Complete</h1>
          <p className="text-emerald-300 font-medium text-lg">Focus unlocked for 5 minutes.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-slate-950 text-slate-100 w-full overflow-hidden relative">
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      
      <header className="relative z-10 px-6 py-6 flex items-center justify-between border-b border-white/5">
        <h1 className="text-xl font-bold tracking-tight text-white">Speech Challenge</h1>
        <button onClick={goBack} className="text-slate-400 font-bold text-sm hover:text-white transition-colors">Cancel</button>
      </header>

      <main className="relative z-10 flex-1 px-6 py-6 flex flex-col h-full">
        <p className="text-sm text-slate-400 font-medium mb-6">
          Read the following paragraph clearly. Every word must be spoken in order. Skipping words or pausing for more than 5 seconds will restart the challenge.
        </p>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-rose-500/20 border border-rose-500/50 p-4 rounded-2xl mb-6 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <p className="text-sm font-medium text-rose-200">{error}</p>
          </motion.div>
        )}

        <div className="flex-1 bg-white/5 border border-white/10 rounded-[32px] p-6 mb-6 overflow-y-auto">
          <p className="text-xl leading-relaxed font-medium">
            {words.map((word, idx) => {
              const isPassed = idx < currentIndex;
              const isCurrent = idx === currentIndex;
              return (
                <span 
                  key={idx}
                  className={`transition-colors duration-300 ${isPassed ? 'text-emerald-400' : isCurrent ? 'text-white bg-indigo-500/50 rounded px-2 py-0.5' : 'text-slate-500'} mr-1.5 inline-block`}
                >
                  {word}
                </span>
              );
            })}
          </p>
        </div>

        <div className="flex flex-col gap-4 items-center w-full">
            <>
              <div className="text-sm font-medium text-slate-400 mb-2">
                {permissionStatus === 'denied' ? 'Microphone Access Denied' : isListening ? 'Listening...' : 'Tap to Start'}
              </div>
              
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={isListening ? stopListening : startListening}
                className="relative w-24 h-24 rounded-full flex items-center justify-center outline-none transition-colors"
              >
                {isListening && (
                  <>
                    <motion.div 
                      className="absolute inset-0 rounded-full bg-indigo-500/20"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    />
                    <motion.div 
                      className="absolute inset-0 rounded-full bg-indigo-500/30"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                    />
                  </>
                )}
                <div className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                  isListening ? 'bg-indigo-500 text-white shadow-indigo-500/50' : 'bg-white/10 text-slate-400 hover:bg-white/20'
                }`}>
                  {isListening ? <Volume2 className="w-8 h-8 animate-pulse" /> : <Mic className="w-8 h-8" />}
                </div>
              </motion.button>
            </>
        </div>
      </main>
    </div>
  );
};
