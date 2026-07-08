import { FocusSessionLog, DistractionAttempt, DailyStats, Achievement, AIInsight } from '../models/Analytics';

export interface AnalyticsRepository {
  getSessions(): Promise<FocusSessionLog[]>;
  logSession(session: FocusSessionLog): Promise<void>;
  
  getDistractionAttempts(): Promise<DistractionAttempt[]>;
  logDistractionAttempt(attempt: DistractionAttempt): Promise<void>;
  
  getDailyStats(dateString: string): Promise<DailyStats>;
  getAllDailyStats(): Promise<DailyStats[]>;
  saveDailyStats(stats: DailyStats): Promise<void>;
  
  getAchievements(): Promise<Achievement[]>;
  saveAchievements(achievements: Achievement[]): Promise<void>;
  
  getInsights(): Promise<AIInsight[]>;
  saveInsights(insights: AIInsight[]): Promise<void>;
}
