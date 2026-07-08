import React from 'react';
import { useNavigation } from '../../navigation/NavigationContext';
import { useParagraphManagementViewModel } from '../viewmodels/ParagraphManagementViewModel';
import { ChevronLeft, Database, RefreshCw, CheckCircle2, Server, BookOpen } from 'lucide-react';
import { MaterialCard } from '../components/MaterialCard';

export const ParagraphManagementScreen: React.FC = () => {
  const { goBack } = useNavigation();
  const { 
    stats, 
    preferredCategories, 
    ALL_CATEGORIES, 
    toggleCategory, 
    isSyncing, 
    forceSync 
  } = useParagraphManagementViewModel();

  return (
    <div className="flex flex-col min-h-full bg-slate-950 text-slate-100 w-full shadow-2xl overflow-hidden relative">
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-emerald-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <header className="relative z-10 px-6 py-6 flex items-center gap-4 border-b border-white/5">
        <button onClick={goBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-white flex-1">Paragraph Engine</h1>
      </header>

      <main className="relative z-10 flex-1 px-6 py-6 overflow-y-auto flex flex-col gap-6">
        
        {/* Offline Storage Stats */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Offline Library</h2>
            <button 
              onClick={forceSync}
              disabled={isSyncing}
              className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${isSyncing ? 'border-emerald-500/30 text-emerald-500/50 cursor-not-allowed' : 'border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10'}`}
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Cloud'}
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <MaterialCard className="p-4 flex flex-col gap-1 items-start">
              <Database className="w-5 h-5 text-indigo-400 mb-1" />
              <p className="text-2xl font-bold text-white">{stats?.totalParagraphs || 0}</p>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Paragraphs</p>
            </MaterialCard>
            
            <MaterialCard className="p-4 flex flex-col gap-1 items-start">
              <Server className="w-5 h-5 text-emerald-400 mb-1" />
              <p className="text-sm font-bold text-white mt-1">
                {stats?.lastSyncTime ? new Date(stats.lastSyncTime).toLocaleDateString() : 'Never'}
              </p>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Last Synced</p>
            </MaterialCard>
          </div>
        </section>

        {/* Preferred Categories */}
        <section>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Reading Topics</h2>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Select the categories you prefer for your speech unlock challenges.
          </p>
          
          <div className="flex flex-wrap gap-2">
            {ALL_CATEGORIES.map(category => {
              const isSelected = preferredCategories.includes(category);
              return (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                    isSelected 
                      ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3 h-3" />}
                  {category}
                  {stats?.categories[category] ? <span className="ml-1 opacity-50 font-normal">({stats.categories[category]})</span> : ''}
                </button>
              );
            })}
          </div>
        </section>

      </main>
    </div>
  );
};
