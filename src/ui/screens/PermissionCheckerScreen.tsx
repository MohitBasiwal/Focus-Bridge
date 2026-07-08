import React, { useState, useEffect } from 'react';
import { useNavigation } from '../../navigation/NavigationContext';
import { ChevronLeft, ShieldAlert, CheckCircle2, AlertTriangle, Accessibility, Battery, Bell, Mic } from 'lucide-react';
import { MaterialCard } from '../components/MaterialCard';
import { NotificationManager } from '../../services/notifications/NotificationManager';

export const PermissionCheckerScreen: React.FC = () => {
  const { goBack } = useNavigation();

  const [permissions, setPermissions] = useState({
    notifications: false,
    microphone: false,
  });

  useEffect(() => {
    // Check Notification permission
    setPermissions(prev => ({
      ...prev,
      notifications: Notification.permission === 'granted'
    }));

    // Check Microphone permission
    navigator.mediaDevices?.getUserMedia({ audio: true })
      .then(() => setPermissions(prev => ({ ...prev, microphone: true })))
      .catch(() => setPermissions(prev => ({ ...prev, microphone: false })));
  }, []);

  const requestNotification = async () => {
    const granted = await NotificationManager.requestPermission();
    if (granted) {
      setPermissions(prev => ({ ...prev, notifications: true }));
    }
  };

  const requestMicrophone = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissions(prev => ({ ...prev, microphone: true }));
    } catch (e) {
      alert("Microphone permission denied. Please allow it in your browser settings.");
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-950 text-slate-100 w-full overflow-hidden relative">
      <header className="relative z-10 px-6 py-6 flex items-center gap-4 border-b border-white/5">
        <button onClick={goBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold text-white flex-1">Permission Center</h1>
      </header>

      <main className="relative z-10 flex-1 px-6 py-6 overflow-y-auto flex flex-col gap-6">
        <p className="text-sm text-slate-400 mb-2">
          Focus Bridge requires certain permissions to function effectively.
        </p>

        <PermissionItem 
          title="Notifications"
          icon={<Bell className="w-6 h-6 text-amber-400" />}
          description="Needed for study session reminders and streak alerts."
          isGranted={permissions.notifications}
          onRequest={requestNotification}
        />

        <PermissionItem 
          title="Microphone"
          icon={<Mic className="w-6 h-6 text-indigo-400" />}
          description="Needed for Speech Unlock challenges to disable Focus Mode."
          isGranted={permissions.microphone}
          onRequest={requestMicrophone}
        />

        <PermissionItem 
          title="Accessibility Service"
          icon={<Accessibility className="w-6 h-6 text-emerald-400" />}
          description="Required to block distracting apps and websites automatically."
          isGranted={true}
          isSimulated={true}
        />

        <PermissionItem 
          title="Usage Access"
          icon={<ShieldAlert className="w-6 h-6 text-rose-400" />}
          description="Needed to detect which apps you are currently using."
          isGranted={true}
          isSimulated={true}
        />

        <PermissionItem 
          title="Battery Optimization"
          icon={<Battery className="w-6 h-6 text-cyan-400" />}
          description="Exempt the app to prevent Android from killing background workers."
          isGranted={false}
          isSimulated={true}
          isOptional={true}
        />

      </main>
    </div>
  );
};

const PermissionItem = ({ title, description, icon, isGranted, isSimulated, isOptional, onRequest }: any) => {
  return (
    <MaterialCard className={`p-4 border ${isGranted ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-amber-500/30 bg-amber-500/5'}`}>
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-white flex items-center gap-2">
              {title}
              {isOptional && <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">Optional</span>}
            </h3>
            {isGranted ? (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Granted</span>
            ) : (
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Missing</span>
            )}
          </div>
          <p className="text-xs text-slate-400 mb-3">{description}</p>
          
          {!isGranted && (
            <button 
              onClick={onRequest}
              disabled={isSimulated}
              className={`text-xs font-bold px-4 py-2 rounded-lg transition-colors ${
                isSimulated ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-white text-slate-900 hover:bg-slate-200'
              }`}
            >
              {isSimulated ? 'Go to Android Settings' : 'Grant Permission'}
            </button>
          )}
        </div>
      </div>
    </MaterialCard>
  );
};