import React, { useState } from 'react';
import { useNavigation } from '../../navigation/NavigationContext';
import { ChevronLeft, Globe, BookOpen, ShieldCheck, DownloadCloud, Info, AlertTriangle } from 'lucide-react';
import { MaterialCard } from '../components/MaterialCard';
import { securityManager } from '../../services/security/SecurityManager';

export const SettingsScreen: React.FC = () => {
  const { goBack, navigate } = useNavigation();
  const [websiteBlockingEnabled, setWebsiteBlockingEnabled] = useState(true);

  const handleWebsiteBlockingToggle = (checked: boolean) => {
    if (!checked) {
      // Disabling requires security check
      securityManager.setPendingAction('Disable Website Blocking', () => {
        setWebsiteBlockingEnabled(false);
      });
      navigate('puzzle_screen');
    } else {
      // Enabling is allowed freely
      setWebsiteBlockingEnabled(true);
    }
  };

  const browsers = [
    'Google Chrome',
    'Brave Browser',
    'Mozilla Firefox',
    'Microsoft Edge',
    'Samsung Internet',
    'Opera'
  ];

  return (
    <div className="flex flex-col min-h-full bg-slate-950 text-slate-100 w-full shadow-2xl overflow-hidden relative">
      <header className="relative z-10 px-6 py-6 flex items-center gap-4 border-b border-white/5">
        <button onClick={goBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-2xl font-bold tracking-tight text-white flex-1">Settings</h1>
      </header>

      <main className="relative z-10 flex-1 px-6 py-6 overflow-y-auto flex flex-col gap-8">
        
        <section>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Security Center</h2>
          <MaterialCard 
            className="py-5 hover:bg-white/20 transition-colors cursor-pointer"
            onClick={() => navigate('security_center')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <span className="font-bold text-white block">Security & Tampers</span>
                <span className="text-xs text-slate-400">View history and alerts</span>
              </div>
            </div>
          </MaterialCard>
        </section>

        <section>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Reading Engine</h2>
          <MaterialCard 
            className="py-5 hover:bg-white/20 transition-colors cursor-pointer"
            onClick={() => navigate('paragraph_management')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="font-bold text-white block">Paragraph Engine</span>
                <span className="text-xs text-slate-400">Manage offline library & topics</span>
              </div>
            </div>
          </MaterialCard>
        </section>

        <section>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Smart Notifications</h2>
          <MaterialCard 
            className="py-5 hover:bg-white/20 transition-colors cursor-pointer"
            onClick={() => navigate('notification_settings')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Globe className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="font-bold text-white block">Reminders & Automation</span>
                <span className="text-xs text-slate-400">Quiet hours, session alerts</span>
              </div>
            </div>
          </MaterialCard>
        </section>

        <section>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Website Blocking</h2>
          <MaterialCard className="py-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-indigo-400" />
                <span className="font-bold text-white">Website Blocking Engine</span>
              </div>
              <Toggle checked={websiteBlockingEnabled} onChange={handleWebsiteBlockingToggle} />
            </div>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              When enabled, the Accessibility Service will detect URLs and block websites based on the rules of your active timetable.
            </p>
          </MaterialCard>
        </section>

        <section>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Supported Browsers</h2>
          <div className="flex flex-col gap-2">
             {browsers.map(b => (
               <div key={b} className="flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-2xl">
                 <span className="font-medium text-sm text-white">{b}</span>
                 <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-400"></div>
                 </div>
               </div>
             ))}
          </div>
          <p className="text-xs text-slate-500 mt-4 text-center">More browsers can be supported in future modules.</p>
        </section>
      <section className="mt-8">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">About</h2>
          <MaterialCard 
            className="py-5 hover:bg-white/20 transition-colors cursor-pointer"
            onClick={() => navigate('about')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-500/20 flex items-center justify-center">
                <Info className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <span className="font-bold text-white block">About Focus Bridge</span>
                <span className="text-xs text-slate-400">Version, Developer, Privacy Policy</span>
              </div>
            </div>
          </MaterialCard>
        </section>
      </main>
    </div>
  );
};

const Toggle = ({ checked, onChange }: any) => (
  <div 
    onClick={() => onChange(!checked)}
    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${checked ? 'bg-indigo-500' : 'bg-slate-700'}`}
  >
    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
  </div>
);
