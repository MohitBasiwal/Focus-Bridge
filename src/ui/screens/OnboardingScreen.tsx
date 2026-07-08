import React, { useState } from 'react';
import { useNavigation } from '../../navigation/NavigationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, BookOpen, Clock, Lock, CheckCircle2, ChevronRight, Accessibility, ShieldAlert, Bell } from 'lucide-react';

export const OnboardingScreen: React.FC = () => {
  const { replace } = useNavigation();
  const [step, setStep] = useState(0);

  const completeOnboarding = () => {
    localStorage.setItem('onboarding_complete', 'true');
    replace('dashboard');
  };

  const steps = [
    <WelcomeStep onNext={() => setStep(1)} />,
    <CategoriesStep onNext={() => setStep(2)} />,
    <PermissionsStep onNext={completeOnboarding} />
  ];

  return (
    <div className="flex flex-col min-h-full bg-slate-950 text-slate-100 w-full overflow-hidden relative">
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="flex-1 flex flex-col pt-12 pb-8 px-6 relative z-10">
        
        {/* Progress Bar */}
        <div className="w-full flex gap-2 mb-8">
          {[0, 1, 2].map(idx => (
            <div key={idx} className="h-1 flex-1 rounded-full bg-white/10 overflow-hidden">
              <motion.div 
                className="h-full bg-indigo-500"
                initial={{ width: '0%' }}
                animate={{ width: step >= idx ? '100%' : '0%' }}
                transition={{ duration: 0.3 }}
              />
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            {steps[step]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const WelcomeStep = ({ onNext }: { onNext: () => void }) => (
  <div className="flex flex-col flex-1">
    <div className="flex-1 flex flex-col justify-center items-center text-center">
      <div className="w-24 h-24 rounded-3xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(99,102,241,0.2)]">
        <Shield className="w-12 h-12 text-indigo-400" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-4 text-white">Welcome to<br/>Focus Bridge</h1>
      <p className="text-slate-400 text-sm leading-relaxed max-w-[280px]">
        The intelligent study companion that automatically blocks distractions and builds your discipline through smart timetables.
      </p>

      <div className="mt-12 flex flex-col gap-4 w-full max-w-[280px] text-left">
        <FeatureItem icon={<Clock className="w-5 h-5 text-emerald-400"/>} title="Automated Focus" desc="Schedules enable Focus Mode automatically." />
        <FeatureItem icon={<Lock className="w-5 h-5 text-rose-400"/>} title="Smart Blocking" desc="Block apps and websites during study." />
        <FeatureItem icon={<BookOpen className="w-5 h-5 text-amber-400"/>} title="Speech Unlock" desc="Read a paragraph to bypass locks." />
      </div>
    </div>
    
    <button 
      onClick={onNext}
      className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors mt-8"
    >
      Get Started <ChevronRight className="w-5 h-5" />
    </button>
  </div>
);

const FeatureItem = ({ icon, title, desc }: any) => (
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="text-sm font-bold text-white">{title}</h3>
      <p className="text-[10px] text-slate-400">{desc}</p>
    </div>
  </div>
);

const CategoriesStep = ({ onNext }: { onNext: () => void }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const cats = ['Mathematics', 'Science', 'Literature', 'History', 'Programming', 'Language', 'Arts'];

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 flex flex-col pt-8">
        <h2 className="text-2xl font-bold text-white mb-2">What are you studying?</h2>
        <p className="text-sm text-slate-400 mb-8">Select categories to personalize your experience. You can add more later.</p>

        <div className="flex flex-wrap gap-3">
          {cats.map(cat => (
            <button
              key={cat}
              onClick={() => {
                if (selected.includes(cat)) setSelected(selected.filter(c => c !== cat));
                else setSelected([...selected, cat]);
              }}
              className={`px-4 py-3 rounded-xl text-sm font-bold transition-all border ${
                selected.includes(cat) 
                  ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' 
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      
      <button 
        onClick={onNext}
        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors mt-8"
      >
        Continue <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

const PermissionsStep = ({ onNext }: { onNext: () => void }) => (
  <div className="flex flex-col flex-1">
    <div className="flex-1 flex flex-col pt-8">
      <h2 className="text-2xl font-bold text-white mb-2">Almost Ready</h2>
      <p className="text-sm text-slate-400 mb-8">Focus Bridge needs a few permissions to automate your study sessions securely.</p>

      <div className="flex flex-col gap-4">
        <PermissionCard 
          icon={<Accessibility className="w-6 h-6 text-emerald-400" />}
          title="Accessibility Service"
          desc="To monitor active apps and block distractions."
        />
        <PermissionCard 
          icon={<ShieldAlert className="w-6 h-6 text-rose-400" />}
          title="Usage Access"
          desc="To gather study analytics and detect tampers."
        />
        <PermissionCard 
          icon={<Bell className="w-6 h-6 text-amber-400" />}
          title="Notifications"
          desc="To remind you before sessions start."
        />
      </div>
      
      <div className="mt-8 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-center">
        <p className="text-xs text-indigo-300 font-medium">
          You can grant these in the Permission Center later.
        </p>
      </div>
    </div>
    
    <button 
      onClick={onNext}
      className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors mt-8"
    >
      Complete Setup <CheckCircle2 className="w-5 h-5" />
    </button>
  </div>
);

const PermissionCard = ({ icon, title, desc }: any) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4 items-center">
    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="flex-1">
      <h3 className="text-sm font-bold text-white">{title}</h3>
      <p className="text-[10px] text-slate-400">{desc}</p>
    </div>
  </div>
);