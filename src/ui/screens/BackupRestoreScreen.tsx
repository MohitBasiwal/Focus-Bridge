import React, { useRef } from 'react';
import { useNavigation } from '../../navigation/NavigationContext';
import { ChevronLeft, Download, Upload, AlertCircle } from 'lucide-react';
import { MaterialCard } from '../components/MaterialCard';

export const BackupRestoreScreen: React.FC = () => {
  const { goBack } = useNavigation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('focus_bridge_')) {
        data[key] = localStorage.getItem(key) || '';
      }
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focus_bridge_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result as string;
        const data = JSON.parse(result);
        
        let importedCount = 0;
        for (const [key, value] of Object.entries(data)) {
          if (key.startsWith('focus_bridge_') && typeof value === 'string') {
            localStorage.setItem(key, value);
            importedCount++;
          }
        }
        
        alert(`Successfully restored ${importedCount} items. App will reload to apply changes.`);
        window.location.reload();
      } catch (err) {
        alert("Failed to parse backup file. Please ensure it is a valid JSON backup.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-950 text-slate-100 w-full overflow-hidden relative">
      <header className="relative z-10 px-6 py-6 flex items-center gap-4 border-b border-white/5">
        <button onClick={goBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold text-white flex-1">Backup & Restore</h1>
      </header>

      <main className="relative z-10 flex-1 px-6 py-6 overflow-y-auto flex flex-col gap-6">
        
        <MaterialCard className="p-6">
          <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4">
            <Download className="w-6 h-6 text-indigo-400" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Export Data</h2>
          <p className="text-xs text-slate-400 mb-6">
            Save a copy of your timetables, settings, website rules, and achievements to a JSON file.
          </p>
          <button 
            onClick={handleExport}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl transition-colors"
          >
            Export Backup
          </button>
        </MaterialCard>

        <MaterialCard className="p-6">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
            <Upload className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Import Data</h2>
          <p className="text-xs text-slate-400 mb-6">
            Restore your app data from a previously exported JSON file. This will overwrite current data.
          </p>
          
          <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl flex gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="text-[10px] text-amber-200/80 leading-relaxed">
              Importing a backup will overwrite your current Focus Bridge data. Ensure you have exported your current data if you wish to keep it.
            </p>
          </div>

          <input 
            type="file" 
            accept=".json" 
            ref={fileInputRef} 
            onChange={handleImport} 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-colors text-slate-900"
          >
            Select Backup File
          </button>
        </MaterialCard>

      </main>
    </div>
  );
};