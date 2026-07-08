import React from 'react';
import { useNavigation } from '../../navigation/NavigationContext';
import { Calendar, BarChart2, Settings, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { navigate, currentRoute } = useNavigation();

  // Hide nav on certain immersive screens
  const hideNav = ['speech_challenge', 'puzzle_screen', 'blocking_screen', 'add_timetable', 'edit_timetable', 'paragraph_management', 'onboarding'].includes(currentRoute);

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'timetable_list', label: 'Timetable', icon: Calendar },
    { id: 'analytics_dashboard', label: 'Analytics', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 overflow-hidden relative">
      
      {/* Background Blurs for whole app */}
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-600/30 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-cyan-600/30 rounded-full blur-[100px] pointer-events-none z-0"></div>
      
      {!hideNav && (
        <>
          {/* Expanded Navigation Drawer (lg+) */}
          <nav className="hidden lg:flex flex-col w-64 bg-slate-900/50 backdrop-blur-xl border-r border-white/10 z-20">
            <div className="p-6">
              <h1 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/50">
                  <span className="text-white text-xs font-semibold">FB</span>
                </span>
                Focus Bridge
              </h1>
            </div>
            <div className="flex flex-col gap-2 px-4 flex-1">
              {navItems.map(item => {
                const isActive = currentRoute === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id as any)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive ? 'bg-indigo-500/20 text-indigo-300 font-bold' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Medium Navigation Rail (md) */}
          <nav className="hidden md:flex lg:hidden flex-col w-20 bg-slate-900/50 backdrop-blur-xl border-r border-white/10 z-20 items-center py-6">
            <div className="mb-8">
              <span className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/50">
                <span className="text-white text-sm font-semibold">FB</span>
              </span>
            </div>
            <div className="flex flex-col gap-4 flex-1 w-full px-2">
              {navItems.map(item => {
                const isActive = currentRoute === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id as any)}
                    className={`flex flex-col items-center justify-center py-3 rounded-xl transition-all ${
                      isActive ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-bold">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10 items-center">
        <div className={`w-full h-full max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto flex flex-col relative ${!hideNav ? 'pb-20 md:pb-0' : ''}`}>
          {children}
        </div>
      </main>

      {/* Compact Bottom Navigation (sm) */}
      {!hideNav && (
        <nav className="md:hidden absolute bottom-0 w-full px-6 py-4 bg-slate-950/80 backdrop-blur-xl border-t border-white/10 z-20">
          <div className="flex justify-between items-center h-14 gap-2">
            {navItems.map(item => {
              const isActive = currentRoute === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id as any)}
                  className={`flex-1 flex flex-col items-center justify-center h-full rounded-2xl transition-all ${
                    isActive ? 'bg-indigo-500/20 text-indigo-300 shadow-lg shadow-indigo-500/10' : 'text-slate-400 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}

    </div>
  );
};
