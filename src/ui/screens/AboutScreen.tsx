import React from 'react';
import { useNavigation } from '../../navigation/NavigationContext';
import { ChevronLeft, Info, Heart, Shield, Code, ExternalLink } from 'lucide-react';
import { MaterialCard } from '../components/MaterialCard';

export const AboutScreen: React.FC = () => {
  const { goBack } = useNavigation();

  return (
    <div className="flex flex-col min-h-full bg-slate-950 text-slate-100 w-full overflow-hidden relative">
      <header className="relative z-10 px-6 py-6 flex items-center gap-4 border-b border-white/5">
        <button onClick={goBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold text-white flex-1">About Focus Bridge</h1>
      </header>

      <main className="relative z-10 flex-1 px-6 py-6 overflow-y-auto flex flex-col gap-6">
        
        <div className="flex flex-col items-center justify-center py-6">
          <div className="w-24 h-24 rounded-3xl bg-indigo-500/20 flex items-center justify-center mb-4 border border-indigo-500/30">
            <Shield className="w-12 h-12 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Focus Bridge</h2>
          <p className="text-xs text-slate-400 mt-1">Version 1.0.0 (Production)</p>
          <p className="text-xs text-indigo-400 mt-2 font-medium">Empowering your study sessions.</p>
        </div>

        <section>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Privacy First</h2>
          <MaterialCard className="p-4 flex gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">Local Data Storage</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your timetables, analytics, and usage patterns are stored locally on your device. 
                We do not upload your data to external servers without your explicit consent.
              </p>
            </div>
          </MaterialCard>
        </section>

        <section>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Open Source & Licenses</h2>
          <div className="flex flex-col gap-2">
            {[
              { name: 'React', url: 'https://reactjs.org' },
              { name: 'Tailwind CSS', url: 'https://tailwindcss.com' },
              { name: 'Lucide Icons', url: 'https://lucide.dev' },
              { name: 'Framer Motion', url: 'https://www.framer.com/motion/' },
            ].map(lib => (
              <a key={lib.name} href={lib.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-white/5 hover:bg-white/10 transition-colors border border-white/10 p-4 rounded-2xl group">
                <div className="flex items-center gap-3">
                  <Code className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                  <span className="font-medium text-sm text-white">{lib.name}</span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
              </a>
            ))}
          </div>
        </section>
        
        <section className="mt-4 text-center">
          <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
            Made with <Heart className="w-3 h-3 text-rose-500" /> for students everywhere
          </p>
          <p className="text-[10px] text-slate-600 mt-2">
            © {new Date().getFullYear()} Focus Bridge. All rights reserved.
          </p>
        </section>

      </main>
    </div>
  );
};