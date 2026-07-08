import { AnalyticsRepository } from '../../domain/repository/AnalyticsRepository';
import { DailyStats } from '../../domain/models/Analytics';

export class FocusScoreCalculator {
  constructor(private repo: AnalyticsRepository) {}

  async calculateAndSaveDailyScore(dateString: string): Promise<number> {
    const stats = await this.repo.getDailyStats(dateString);
    
    // Base score is 50
    let score = 50;

    // Positive factors
    score += stats.completedSessions * 5;
    score += Math.floor(stats.totalStudyTimeMs / (1000 * 60 * 60)) * 2; // +2 per hour

    // Negative factors
    score -= stats.missedSessions * 3;
    score -= stats.blockedAppAttempts * 1;
    score -= stats.blockedWebsiteAttempts * 1;
    score -= stats.speechUnlocks * 2; // Unlocks indicate breaking focus, maybe penalize a bit

    // Clamp between 0 and 100
    score = Math.max(0, Math.min(100, score));
    
    // Over time, we'd also incorporate streak logic, but keeping it per-day for simplicity here.

    stats.focusScore = score;
    await this.repo.saveDailyStats(stats);
    return score;
  }
}
