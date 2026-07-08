import { AnalyticsRepository } from '../../domain/repository/AnalyticsRepository';
import { AIInsight } from '../../domain/models/Analytics';

export class InsightsGenerator {
  constructor(private repo: AnalyticsRepository) {}

  async generateInsights(): Promise<AIInsight[]> {
    const dailyStats = await this.repo.getAllDailyStats();
    const sessions = await this.repo.getSessions();
    const distractions = await this.repo.getDistractionAttempts();
    
    const insights: AIInsight[] = [];
    
    if (dailyStats.length > 0) {
      // Basic logic for generating insights based on mocked AI patterns
      const lastStat = dailyStats[dailyStats.length - 1];
      
      if (lastStat.focusScore > 80) {
        insights.push({
          id: `ins_1_${Date.now()}`,
          text: `Your focus improved significantly today with a score of ${lastStat.focusScore}!`,
          type: 'Positive',
          timestamp: Date.now()
        });
      }

      const totalDistractions = distractions.length;
      if (totalDistractions > 10) {
        insights.push({
          id: `ins_2_${Date.now()}`,
          text: `You attempted to open distractions ${totalDistractions} times recently. Consider enabling strict blocking.`,
          type: 'Constructive',
          timestamp: Date.now()
        });
      }

      if (sessions.length > 5) {
         insights.push({
          id: `ins_3_${Date.now()}`,
          text: `You study most effectively in the evenings based on your session completion rates.`,
          type: 'Informative',
          timestamp: Date.now()
        });
      }
      
      // Default insight if none generated
      if (insights.length === 0) {
        insights.push({
          id: `ins_def_${Date.now()}`,
          text: `Completing one more session today will extend your current streak.`,
          type: 'Informative',
          timestamp: Date.now()
        });
      }
    } else {
        insights.push({
          id: `ins_def_0_${Date.now()}`,
          text: `Welcome! Start a focus session to generate personalized AI insights.`,
          type: 'Informative',
          timestamp: Date.now()
        });
    }

    await this.repo.saveInsights(insights);
    return insights;
  }
}
