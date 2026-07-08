import React from 'react';
import { useTimetableListViewModel } from '../viewmodels/TimetableListViewModel';
import { useNavigation } from '../../navigation/NavigationContext';
import { MaterialCard } from '../components/MaterialCard';
import { Plus, Search, ChevronLeft, Calendar } from 'lucide-react';
import { securityManager } from '../../services/security/SecurityManager';

export const TimetableListScreen: React.FC = () => {
  const { timetables, searchQuery, setSearchQuery, filter, setFilter } = useTimetableListViewModel();
  const { navigate, replace, goBack } = useNavigation();

  const handleEditTimetable = (id: string) => {
    securityManager.setPendingAction('Edit Timetable', () => {
      replace('edit_timetable', { id });
    });
    navigate('puzzle_screen');
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-950 text-slate-100 w-full shadow-2xl overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-600/30 rounded-full blur-[100px] pointer-events-none"></div>
      
      <header className="relative z-10 px-6 py-6 flex items-center gap-4 lg:hidden">
        <button onClick={goBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-2xl font-bold tracking-tight text-white flex-1">Timetables</h1>
        <button onClick={() => navigate('add_timetable')} className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/50">
          <Plus className="w-6 h-6 text-white" />
        </button>
      </header>
      
      {/* Header for LG */}
      <header className="hidden lg:flex relative z-10 px-6 py-8 items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-white">Timetables</h1>
        <button onClick={() => navigate('add_timetable')} className="h-10 px-6 rounded-full bg-indigo-500 hover:bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/50 font-bold transition-colors">
          <Plus className="w-5 h-5 mr-2" /> Add Session
        </button>
      </header>

      <div className="relative z-10 px-6 pb-4 flex flex-col gap-4">
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search subject or title..." 
            className="bg-transparent border-none outline-none text-white w-full placeholder:text-slate-500 text-sm"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {['all', 'today', 'upcoming'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold capitalize whitespace-nowrap transition-colors ${filter === f ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400 border border-white/10'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {timetables.length === 0 ? (
        <main className="relative z-10 flex-1 px-6 pb-6 overflow-y-auto flex flex-col items-center justify-center text-center opacity-50">
          <Calendar className="w-12 h-12 mb-4 text-indigo-400" />
          <p className="font-medium text-lg">No timetables found</p>
          <p className="text-sm">Tap + to create your first focus session</p>
        </main>
      ) : (
        <main className="relative z-10 flex-1 px-6 pb-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 content-start">
          {timetables.map(t => (
            <MaterialCard 
              key={t.id} 
              onClick={() => handleEditTimetable(t.id)}
              className="py-5"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }}></div>
                  <h3 className="font-bold text-lg text-white">{t.title}</h3>
                </div>
                {t.focusModeEnabled && (
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-md border border-indigo-500/30">Focus</span>
                )}
              </div>
              <p className="text-sm text-slate-400 font-medium mb-3">{t.subject}</p>
              
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
                <span>{t.startTime} - {t.endTime}</span>
                <span>{t.repeatType}</span>
              </div>
            </MaterialCard>
          ))}
        </main>
      )}
    </div>
  );
};
