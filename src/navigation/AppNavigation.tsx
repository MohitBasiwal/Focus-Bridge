import React from 'react';
import { DashboardScreen } from '../ui/screens/DashboardScreen';
import { TimetableListScreen } from '../ui/screens/TimetableListScreen';
import { AddEditTimetableScreen } from '../ui/screens/AddEditTimetableScreen';
import { BlockingScreen } from '../ui/screens/BlockingScreen';
import { SettingsScreen } from '../ui/screens/SettingsScreen';
import { SpeechChallengeScreen } from '../ui/screens/SpeechChallengeScreen';
import { ParagraphManagementScreen } from '../ui/screens/ParagraphManagementScreen';
import { PuzzleScreen } from '../ui/screens/PuzzleScreen';
import { SecurityCenterScreen } from '../ui/screens/SecurityCenterScreen';
import { AnalyticsDashboardScreen } from '../ui/screens/AnalyticsDashboardScreen';
import { FocusScoreScreen } from '../ui/screens/FocusScoreScreen';
import { AchievementsScreen } from '../ui/screens/AchievementsScreen';
import { StudyHistoryScreen } from '../ui/screens/StudyHistoryScreen';
import { NotificationSettingsScreen } from '../ui/screens/NotificationSettingsScreen';
import { AutomationStatusScreen } from '../ui/screens/AutomationStatusScreen';
import { OnboardingScreen } from '../ui/screens/OnboardingScreen';
import { PermissionCheckerScreen } from '../ui/screens/PermissionCheckerScreen';
import { BackupRestoreScreen } from '../ui/screens/BackupRestoreScreen';
import { AboutScreen } from '../ui/screens/AboutScreen';
import { NavigationProvider, useNavigation } from './NavigationContext';
import { AppShell } from '../ui/components/AppShell';

const Router = () => {
  const { currentRoute } = useNavigation();
  
  return (
    <AppShell>
      {currentRoute === 'onboarding' && <OnboardingScreen />}
      {currentRoute === 'dashboard' && <DashboardScreen />}
      {currentRoute === 'timetable_list' && <TimetableListScreen />}
      {currentRoute === 'add_timetable' && <AddEditTimetableScreen />}
      {currentRoute === 'edit_timetable' && <AddEditTimetableScreen />}
      {currentRoute === 'blocking_screen' && <BlockingScreen />}
      {currentRoute === 'settings' && <SettingsScreen />}
      {currentRoute === 'notification_settings' && <NotificationSettingsScreen />}
      {currentRoute === 'automation_status' && <AutomationStatusScreen />}
      {currentRoute === 'speech_challenge' && <SpeechChallengeScreen />}
      {currentRoute === 'paragraph_management' && <ParagraphManagementScreen />}
      {currentRoute === 'puzzle_screen' && <PuzzleScreen />}
      {currentRoute === 'security_center' && <SecurityCenterScreen />}
      {currentRoute === 'permission_checker' && <PermissionCheckerScreen />}
      {currentRoute === 'analytics_dashboard' && <AnalyticsDashboardScreen />}
      {currentRoute === 'focus_score' && <FocusScoreScreen />}
      {currentRoute === 'achievements' && <AchievementsScreen />}
      {currentRoute === 'study_history' && <StudyHistoryScreen />}
      {currentRoute === 'backup_restore' && <BackupRestoreScreen />}
      {currentRoute === 'about' && <AboutScreen />}
      {/* Fallbacks */}
      {currentRoute === 'analytics' && <AnalyticsDashboardScreen />}
    </AppShell>
  );
};

export const AppNavigation: React.FC = () => {
  return (
    <NavigationProvider>
      <Router />
    </NavigationProvider>
  );
};
