import { AnalyticsRepository } from '../../domain/repository/AnalyticsRepository';
import { FocusSessionLog, DistractionAttempt, DailyStats, Achievement, AIInsight } from '../../domain/models/Analytics';

export class AnalyticsRepositoryImpl implements AnalyticsRepository {
  private getStorage<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private setStorage(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  async getSessions(): Promise<FocusSessionLog[]> {
    return this.getStorage<FocusSessionLog>('focus_bridge_sessions');
  }

  async logSession(session: FocusSessionLog): Promise<void> {
    const sessions = await this.getSessions();
    sessions.push(session);
    this.setStorage('focus_bridge_sessions', sessions);
  }

  async getDistractionAttempts(): Promise<DistractionAttempt[]> {
    return this.getStorage<DistractionAttempt>('focus_bridge_distractions');
  }

  async logDistractionAttempt(attempt: DistractionAttempt): Promise<void> {
    const attempts = await this.getDistractionAttempts();
    attempts.push(attempt);
    this.setStorage('focus_bridge_distractions', attempts);
  }

  async getDailyStats(dateString: string): Promise<DailyStats> {
    const all = await this.getAllDailyStats();
    return all.find(s => s.dateString === dateString) || this.createEmptyDailyStats(dateString);
  }

  async getAllDailyStats(): Promise<DailyStats[]> {
    return this.getStorage<DailyStats>('focus_bridge_daily_stats');
  }

  async saveDailyStats(stats: DailyStats): Promise<void> {
    let all = await this.getAllDailyStats();
    const idx = all.findIndex(s => s.dateString === stats.dateString);
    if (idx >= 0) {
      all[idx] = stats;
    } else {
      all.push(stats);
    }
    this.setStorage('focus_bridge_daily_stats', all);
  }

  async getAchievements(): Promise<Achievement[]> {
    return this.getStorage<Achievement>('focus_bridge_achievements');
  }

  async saveAchievements(achievements: Achievement[]): Promise<void> {
    this.setStorage('focus_bridge_achievements', achievements);
  }

  async getInsights(): Promise<AIInsight[]> {
    return this.getStorage<AIInsight>('focus_bridge_insights');
  }

  async saveInsights(insights: AIInsight[]): Promise<void> {
    this.setStorage('focus_bridge_insights', insights);
  }

  private createEmptyDailyStats(dateString: string): DailyStats {
    return {
      dateString,
      totalStudyTimeMs: 0,
      completedSessions: 0,
      missedSessions: 0,
      blockedAppAttempts: 0,
      blockedWebsiteAttempts: 0,
      speechUnlocks: 0,
      focusScore: 50 // Base score
    };
  }
}
