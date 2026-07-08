import React, { useState } from 'react';
import { useAddEditTimetableViewModel } from '../viewmodels/AddEditTimetableViewModel';
import { useNavigation } from '../../navigation/NavigationContext';
import { ChevronLeft, Save, CalendarDays, Shield, Globe, Coffee, AlertTriangle } from 'lucide-react';
import { AppPicker } from '../components/AppPicker';
import { WebsiteRuleEditor } from '../components/WebsiteRuleEditor';
import { BreakSessionEditor } from '../components/BreakSessionEditor';

export const AddEditTimetableScreen: React.FC = () => {
  const { params, goBack } = useNavigation();
  const { timetable, updateField, save, validationError } = useAddEditTimetableViewModel(params?.id);
  const [activeTab, setActiveTab] = useState<'general' | 'apps' | 'websites' | 'breaks'>('general');

  const handleSave = async () => {
    const success = await save();
    if (success) {
      goBack();
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-950 text-slate-100 w-full shadow-2xl overflow-hidden relative">
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <header className="relative z-10 px-6 py-6 flex items-center justify-between border-b border-white/5">
        <button onClick={goBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-white">
          {params?.id ? 'Edit Timetable' : 'New Timetable'}
        </h1>
        <button onClick={handleSave} className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/50">
          <Save className="w-5 h-5 text-white" />
        </button>
      </header>

      {validationError && (
        <div className="relative z-10 m-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <p className="text-sm font-medium text-red-200">{validationError}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="relative z-10 px-4 pt-4 flex overflow-x-auto gap-2 pb-2">
        <TabButton active={activeTab === 'general'} onClick={() => setActiveTab('general')} icon={<CalendarDays className="w-4 h-4"/>} label="General" />
        <TabButton active={activeTab === 'apps'} onClick={() => setActiveTab('apps')} icon={<Shield className="w-4 h-4"/>} label="Apps" />
        <TabButton active={activeTab === 'websites'} onClick={() => setActiveTab('websites')} icon={<Globe className="w-4 h-4"/>} label="Websites" />
        <TabButton active={activeTab === 'breaks'} onClick={() => setActiveTab('breaks')} icon={<Coffee className="w-4 h-4"/>} label="Breaks" />
      </div>

      <main className="relative z-10 flex-1 px-6 pb-8 overflow-y-auto">
        {activeTab === 'general' && (
          <div className="flex flex-col gap-6 py-4">
            <InputField label="Title" value={timetable.title} onChange={(v: string) => updateField('title', v)} placeholder="e.g. Morning Focus" />
            <InputField label="Subject" value={timetable.subject} onChange={(v: string) => updateField('subject', v)} placeholder="e.g. Advanced Calculus" />
            
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Start Time" type="time" value={timetable.startTime} onChange={(v: string) => updateField('startTime', v)} />
              <InputField label="End Time" type="time" value={timetable.endTime} onChange={(v: string) => updateField('endTime', v)} />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Repeat Type</label>
              <select 
                className="bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-indigo-500"
                value={timetable.repeatType}
                onChange={e => updateField('repeatType', e.target.value as any)}
              >
                <option value="none">Once</option>
                <option value="daily">Daily</option>
                <option value="weekdays">Weekdays</option>
                <option value="weekends">Weekends</option>
                <option value="custom">Custom Days</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Theme Color</label>
              <div className="flex gap-3">
                {['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'].map(color => (
                   <button 
                     key={color}
                     onClick={() => updateField('color', color)}
                     className={`w-10 h-10 rounded-full border-2 transition-transform ${timetable.color === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                     style={{ backgroundColor: color }}
                   />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-xl">
              <div>
                <p className="font-bold text-white">Focus Mode</p>
                <p className="text-xs text-slate-400 mt-1">Enforce strict app and website blocking</p>
              </div>
              <Toggle checked={timetable.focusModeEnabled} onChange={(v: boolean) => updateField('focusModeEnabled', v)} />
            </div>
          </div>
        )}

        {activeTab === 'apps' && (
          <div className="py-4">
            <p className="text-sm text-slate-400 mb-4">Select apps allowed during this session. All other apps will be blocked.</p>
            <AppPicker allowedApps={timetable.allowedApps} onChange={apps => updateField('allowedApps', apps)} />
          </div>
        )}

        {activeTab === 'websites' && (
          <div className="py-4">
            <WebsiteRuleEditor 
              mode={timetable.websiteRuleMode} 
              onModeChange={m => updateField('websiteRuleMode', m)} 
              rules={timetable.websiteRules} 
              onRulesChange={r => updateField('websiteRules', r)} 
            />
          </div>
        )}

        {activeTab === 'breaks' && (
          <div className="py-4">
            <BreakSessionEditor 
              breaks={timetable.breakSessions} 
              onChange={b => updateField('breakSessions', b)} 
            />
          </div>
        )}
      </main>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all ${
      active ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
    }`}
  >
    {icon} {label}
  </button>
);

const InputField = ({ label, value, onChange, placeholder, type = "text" }: any) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</label>
    <input 
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-indigo-500 placeholder:text-slate-600 transition-colors"
    />
  </div>
);

const Toggle = ({ checked, onChange }: any) => (
  <div 
    onClick={() => onChange(!checked)}
    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${checked ? 'bg-indigo-500' : 'bg-slate-700'}`}
  >
    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
  </div>
);
