import React from 'react';
import { usePuzzleViewModel } from '../viewmodels/PuzzleViewModel';
import { Shield, Clock, X, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { MaterialCard } from '../components/MaterialCard';

export const PuzzleScreen: React.FC = () => {
  const { 
    puzzleData, 
    selectedIndices, 
    timeLeft, 
    error,
    selectOption, 
    handleCancel,
    actionName 
  } = usePuzzleViewModel();

  if (!puzzleData) return null;

  return (
    <div className="flex flex-col min-h-full bg-slate-950 text-slate-100 w-full shadow-2xl overflow-hidden relative">
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-rose-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <header className="relative z-10 px-6 py-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-rose-400" />
          <h1 className="text-xl font-bold tracking-tight text-white">Security Check</h1>
        </div>
        <button onClick={handleCancel} className="text-slate-400 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>
      </header>

      <main className="relative z-10 flex-1 px-6 py-6 overflow-y-auto flex flex-col gap-6">
        <div className="text-center mb-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Protected Action</h2>
          <p className="text-xl font-bold text-white">{actionName || 'Sensitive Action'}</p>
        </div>

        <MaterialCard className="p-6 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4 text-rose-400 font-bold">
            <Clock className="w-5 h-5" />
            <span className="text-2xl tabular-nums">{timeLeft}s</span>
          </div>
          
          <p className="text-slate-300 font-medium text-center mb-8">
            Tap the numbers in <strong className="text-white">ascending order</strong> to unlock this action.
          </p>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-rose-500/20 border border-rose-500/50 p-3 rounded-xl mb-6 flex items-center gap-2 w-full justify-center"
            >
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span className="text-sm font-bold text-rose-200">{error}</span>
            </motion.div>
          )}

          <div className="grid grid-cols-3 gap-4 w-full">
            {puzzleData.options.map((num, idx) => {
              const isSelected = selectedIndices.includes(idx);
              const isLastSelected = selectedIndices[selectedIndices.length - 1] === idx;
              
              return (
                <motion.button
                  key={idx}
                  whileTap={!isSelected ? { scale: 0.9 } : {}}
                  onClick={() => selectOption(idx)}
                  disabled={isSelected || !!error}
                  className={`
                    h-16 rounded-2xl flex items-center justify-center text-2xl font-bold transition-all
                    ${isSelected 
                      ? (error && isLastSelected ? 'bg-rose-500 text-white' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50') 
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'}
                  `}
                >
                  {num}
                </motion.button>
              );
            })}
          </div>
        </MaterialCard>
      </main>
    </div>
  );
};
