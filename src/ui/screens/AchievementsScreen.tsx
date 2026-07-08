import React from 'react';
import { useNavigation } from '../../navigation/NavigationContext';
import { useAnalyticsViewModel } from '../viewmodels/AnalyticsViewModel';
import { ChevronLeft, Lock } from 'lucide-react';
import { MaterialCard } from '../components/MaterialCard';

export const AchievementsScreen: React.FC = () => {
  const { goBack } = useNavigation();
  const { achievements } = useAnalyticsViewModel();

  return (
    <div className="flex flex-col min-h-full bg-slate-950 text-slate-100 w-full shadow-2xl overflow-hidden relative">
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-amber-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <header className="relative z-10 px-6 py-6 flex items-center gap-4 border-b border-white/5">
        <button onClick={goBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-white flex-1">Achievements</h1>
      </header>

      <main className="relative z-10 flex-1 px-6 py-6 overflow-y-auto flex flex-col gap-4">
        
        {achievements.map(achievement => (
          <MaterialCard key={achievement.id} className={`p-5 flex items-start gap-4 ${achievement.isUnlocked ? 'bg-amber-500/10 border-amber-500/30' : 'opacity-60'}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${achievement.isUnlocked ? 'bg-amber-500/20' : 'bg-white/5'}`}>
              {achievement.isUnlocked ? achievement.icon : <Lock className="w-5 h-5 text-slate-500" />}
            </div>
            <div className="flex-1">
              <h3 className={`font-bold text-sm mb-1 ${achievement.isUnlocked ? 'text-amber-400' : 'text-slate-300'}`}>
                {achievement.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                {achievement.description}
              </p>
              
              {!achievement.isUnlocked && (
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-amber-500/50 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, achievement.progress * 100)}%` }}
                  />
                </div>
              )}
              {achievement.isUnlocked && achievement.unlockedAt && (
                <span className="text-[10px] font-bold text-amber-500/50 uppercase tracking-wider">
                  Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </MaterialCard>
        ))}

      </main>
    </div>
  );
};
