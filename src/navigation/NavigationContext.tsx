import React, { createContext, useContext, useState } from 'react';

type Route = 'onboarding' | 'dashboard' | 'timetable_list' | 'add_timetable' | 'edit_timetable' | 'analytics' | 'settings' | 'notification_settings' | 'automation_status' | 'blocking_screen' | 'speech_challenge' | 'paragraph_management' | 'puzzle_screen' | 'security_center' | 'analytics_dashboard' | 'focus_score' | 'achievements' | 'study_history' | 'backup_restore' | 'about' | 'permission_checker';

interface NavigationContextType {
  currentRoute: Route;
  navigate: (route: Route, params?: any) => void;
  replace: (route: Route, params?: any) => void;
  params: any;
  goBack: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialRoute: Route = localStorage.getItem('onboarding_complete') === 'true' ? 'dashboard' : 'onboarding';
  const [history, setHistory] = useState<{route: Route, params: any}[]>([{ route: initialRoute, params: {} }]);
  
  const current = history[history.length - 1];

  const navigate = (route: Route, params: any = {}) => {
    setHistory(prev => [...prev, { route, params }]);
  };

  const replace = (route: Route, params: any = {}) => {
    setHistory(prev => {
      const newHistory = [...prev];
      newHistory[newHistory.length - 1] = { route, params };
      return newHistory;
    });
  };

  const goBack = () => {
    if (history.length > 1) {
      setHistory(prev => prev.slice(0, -1));
    }
  };

  return (
    <NavigationContext.Provider value={{ currentRoute: current.route, navigate, replace, params: current.params, goBack }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error('useNavigation must be used within NavigationProvider');
  return context;
};
