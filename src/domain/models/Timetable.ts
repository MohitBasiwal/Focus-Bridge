export type RepeatType = 'daily' | 'weekdays' | 'weekends' | 'custom' | 'none';
export type WebsiteRuleMode = 'allowlist' | 'blocklist';

export interface AppModel {
  packageName: string;
  appName: string;
  iconUrl?: string;
}

export interface WebsiteRule {
  id: string;
  domain: string;
}

export interface BreakSession {
  id: string;
  title: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  notes?: string;
}

export interface Timetable {
  id: string;
  title: string;
  subject: string;
  description?: string;
  icon: string;
  color: string;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  daysOfWeek: number[]; // 0 = Sunday, 1 = Monday, etc.
  repeatType: RepeatType;
  focusModeEnabled: boolean;
  createdAt: number;
  updatedAt: number;
  
  allowedApps: AppModel[];
  websiteRuleMode: WebsiteRuleMode;
  websiteRules: WebsiteRule[];
  breakSessions: BreakSession[];
}
