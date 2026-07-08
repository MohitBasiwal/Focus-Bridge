export interface FocusSessionLog {
  id: string;
  timetableId: string;
  subjectName: string;
  startTime: number;
  endTime: number;
  durationMs: number;
  status: 'Completed' | 'Missed' | 'Partial';
}

export interface DistractionAttempt {
  id: string;
  timestamp: number;
  type: 'App' | 'Website';
  targetName: string; // app name or domain
}

export interface DailyStats {
  dateString: string; // YYYY-MM-DD
  totalStudyTimeMs: number;
  completedSessions: number;
  missedSessions: number;
  blockedAppAttempts: number;
  blockedWebsiteAttempts: number;
  speechUnlocks: number;
  focusScore: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: number;
  progress: number; // 0.0 to 1.0
}

export interface AIInsight {
  id: string;
  text: string;
  type: 'Positive' | 'Constructive' | 'Informative';
  timestamp: number;
}
