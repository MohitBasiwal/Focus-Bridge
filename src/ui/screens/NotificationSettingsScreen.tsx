import React, { useState, useEffect } from 'react';
import { useNavigation } from '../../navigation/NavigationContext';
import { ChevronLeft, Bell, BellOff, Volume2, Vibrate, Moon, Download, Calendar } from 'lucide-react';
import { SettingsRepositoryImpl } from '../../data/repository/SettingsRepositoryImpl';
import { NotificationSettings } from '../../domain/models/Settings';
import { MaterialCard } from '../components/MaterialCard';
import { NotificationManager } from '../../services/notifications/NotificationManager';

export const NotificationSettingsScreen: React.FC = () => {
  const { navigate } = useNavigation();
  const repo = new SettingsRepositoryImpl();
  
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  useEffect(() => {
    repo.getNotificationSettings().then(setSettings);
    setHasPermission(Notification.permission === 'granted');
  }, []);

  const updateSetting = <K extends keyof NotificationSettings>(key: K, value: NotificationSettings[K]) => {
    if (settings) {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      repo.saveNotificationSettings(newSettings);
    }
  };

  const requestPermission = async () => {
    const granted = await NotificationManager.requestPermission();
    setHasPermission(granted);
    if (granted) {
      NotificationManager.showNotification("Focus Bridge", { body: "Notifications enabled successfully!" });
    }
  };

  if (!settings) return null;

  return (
    <div className="flex flex-col min-h-full bg-slate-950 text-slate-100 w-full overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <header className="relative z-10 px-6 py-6 flex items-center gap-4 border-b border-white/5">
        <button onClick={() => navigate('settings')} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold text-white flex-1">Smart Notifications</h1>
        <button onClick={() => navigate('automation_status')} className="text-xs font-bold text-indigo-400 bg-indigo-400/10 px-3 py-1.5 rounded-xl hover:bg-indigo-400/20 transition-colors">
          Automation
        </button>
      </header>

      <main className="relative z-10 flex-1 px-6 py-6 overflow-y-auto flex flex-col gap-6">
        
        {!hasPermission && (
          <MaterialCard className="p-4 border-amber-500/30 bg-amber-500/10">
            <div className="flex items-center gap-3">
              <BellOff className="w-6 h-6 text-amber-400" />
              <div className="flex-1">
                <h3 className="font-bold text-amber-100">Notifications Disabled</h3>
                <p className="text-xs text-amber-200/70">Focus Bridge needs permission to remind you about study sessions.</p>
              </div>
              <button onClick={requestPermission} className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-xl font-bold text-sm">
                Enable
              </button>
            </div>
          </MaterialCard>
        )}

        <section>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">General</h2>
          <div className="flex flex-col gap-3">
            <MaterialCard className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="font-bold">Enable Reminders</h3>
                  <p className="text-xs text-slate-400">Smart notifications for sessions</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={settings.enableReminders} onChange={e => updateSetting('enableReminders', e.target.checked)} />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
              </label>
            </MaterialCard>

            <MaterialCard className="p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h3 className="font-bold">Reminder Times</h3>
                    <p className="text-xs text-slate-400">Minutes before session</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {[5, 10, 15, 30].map(time => (
                  <button 
                    key={time}
                    onClick={() => {
                      const times = settings.reminderTimes.includes(time) 
                        ? settings.reminderTimes.filter(t => t !== time)
                        : [...settings.reminderTimes, time];
                      updateSetting('reminderTimes', times);
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                      settings.reminderTimes.includes(time) ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400'
                    }`}
                  >
                    {time}m
                  </button>
                ))}
              </div>
            </MaterialCard>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Quiet Hours</h2>
          <div className="flex flex-col gap-3">
            <MaterialCard className="p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5 text-violet-400" />
                  <div>
                    <h3 className="font-bold">Enable Quiet Hours</h3>
                    <p className="text-xs text-slate-400">Mute non-essential notifications</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={settings.quietHoursEnabled} onChange={e => updateSetting('quietHoursEnabled', e.target.checked)} />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                </label>
              </div>

              {settings.quietHoursEnabled && (
                <div className="flex items-center gap-4 pt-2 border-t border-white/5">
                  <div className="flex-1">
                    <label className="text-xs text-slate-400 block mb-1">Start Time</label>
                    <input 
                      type="time" 
                      value={settings.quietHoursStart}
                      onChange={e => updateSetting('quietHoursStart', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-white outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-slate-400 block mb-1">End Time</label>
                    <input 
                      type="time" 
                      value={settings.quietHoursEnd}
                      onChange={e => updateSetting('quietHoursEnd', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-white outline-none"
                    />
                  </div>
                </div>
              )}
            </MaterialCard>
          </div>
        </section>

      </main>
    </div>
  );
};
