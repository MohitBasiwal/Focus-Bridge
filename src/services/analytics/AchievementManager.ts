import { AnalyticsRepository } from '../../domain/repository/AnalyticsRepository';
import { Achievement } from '../../domain/models/Analytics';

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_session', title: 'First Focus Session', description: 'Complete your first focus session.', icon: '🎯', isUnlocked: false, progress: 0 },
  { id: 'streak_7', title: '7-Day Streak', description: 'Maintain a 7-day focus streak.', icon: '🔥', isUnlocked: false, progress: 0 },
  { id: '100_hours', title: '100 Hours Studied', description: 'Accumulate 100 hours of focus time.', icon: '🎓', isUnlocked: false, progress: 0 },
  { id: '100_sessions', title: '100 Completed Sessions', description: 'Complete 100 focus sessions.', icon: '✅', isUnlocked: false, progress: 0 },
  { id: 'perfect_week', title: 'Perfect Week', description: 'Achieve a Focus Score above 90 every day for a week.', icon: '⭐', isUnlocked: false, progress: 0 },
];

export class AchievementManager {
  constructor(private repo: AnalyticsRepository) {}

  async initializeAchievements() {
    const existing = await this.repo.getAchievements();
    if (existing.length === 0) {
      await this.repo.saveAchievements(INITIAL_ACHIEVEMENTS);
    } else {
      // Merge new achievements if any
      const existingIds = new Set(existing.map(a => a.id));
      const missing = INITIAL_ACHIEVEMENTS.filter(a => !existingIds.has(a.id));
      if (missing.length > 0) {
        await this.repo.saveAchievements([...existing, ...missing]);
      }
    }
  }

  async checkAchievements() {
    const achievements = await this.repo.getAchievements();
    const sessions = await this.repo.getSessions();
    const dailyStats = await this.repo.getAllDailyStats();

    let updated = false;

    // First Session
    const firstSession = achievements.find(a => a.id === 'first_session');
    if (firstSession && !firstSession.isUnlocked && sessions.length > 0) {
      firstSession.isUnlocked = true;
      firstSession.progress = 1;
      firstSession.unlockedAt = Date.now();
      updated = true;
    }

    // 100 Sessions
    const hundredSessions = achievements.find(a => a.id === '100_sessions');
    if (hundredSessions && !hundredSessions.isUnlocked) {
      const completed = sessions.filter(s => s.status === 'Completed').length;
      hundredSessions.progress = Math.min(completed / 100, 1);
      if (hundredSessions.progress === 1) {
        hundredSessions.isUnlocked = true;
        hundredSessions.unlockedAt = Date.now();
      }
      updated = true;
    }
    
    // 100 Hours
    const hundredHours = achievements.find(a => a.id === '100_hours');
    if (hundredHours && !hundredHours.isUnlocked) {
      const totalMs = sessions.filter(s => s.status === 'Completed').reduce((acc, s) => acc + s.durationMs, 0);
      const hours = totalMs / (1000 * 60 * 60);
      hundredHours.progress = Math.min(hours / 100, 1);
      if (hundredHours.progress === 1) {
        hundredHours.isUnlocked = true;
        hundredHours.unlockedAt = Date.now();
      }
      updated = true;
    }

    if (updated) {
      await this.repo.saveAchievements(achievements);
    }
  }
}
