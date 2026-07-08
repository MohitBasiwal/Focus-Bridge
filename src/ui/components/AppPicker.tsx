import React, { useState } from 'react';
import { AppModel } from '../../domain/models/Timetable';
import { Search, Check } from 'lucide-react';

const MOCK_APPS = [
  { packageName: 'com.android.chrome', appName: 'Chrome' },
  { packageName: 'com.google.android.youtube', appName: 'YouTube' },
  { packageName: 'com.whatsapp', appName: 'WhatsApp' },
  { packageName: 'com.instagram.android', appName: 'Instagram' },
  { packageName: 'com.google.android.apps.docs', appName: 'Google Docs' },
  { packageName: 'com.microsoft.office.word', appName: 'Word' },
];

export const AppPicker: React.FC<{ allowedApps: AppModel[], onChange: (apps: AppModel[]) => void }> = ({ allowedApps, onChange }) => {
  const [search, setSearch] = useState('');

  const filteredApps = MOCK_APPS.filter(a => a.appName.toLowerCase().includes(search.toLowerCase()));

  const toggleApp = (app: { packageName: string; appName: string }) => {
    const exists = allowedApps.find(a => a.packageName === app.packageName);
    if (exists) {
      onChange(allowedApps.filter(a => a.packageName !== app.packageName));
    } else {
      onChange([...allowedApps, app]);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2">
        <Search className="w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search apps..." 
          className="bg-transparent border-none outline-none text-white w-full placeholder:text-slate-500 text-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      
      <div className="flex flex-col gap-2">
        {filteredApps.map(app => {
          const isSelected = !!allowedApps.find(a => a.packageName === app.packageName);
          return (
            <div 
              key={app.packageName}
              onClick={() => toggleApp(app)}
              className={`flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer ${
                isSelected ? 'bg-indigo-500/20 border-indigo-500/50' : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <span className="font-medium text-sm text-white">{app.appName}</span>
              {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};
