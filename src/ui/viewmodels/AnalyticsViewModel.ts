import { useState, useEffect } from 'react';
import { AnalyticsRepositoryImpl } from '../../data/repository/AnalyticsRepositoryImpl';
import { FocusScoreCalculator } from '../../services/analytics/FocusScoreCalculator';
import { AchievementManager } from '../../services/analytics/AchievementManager';
import { InsightsGenerator } from '../../services/analytics/InsightsGenerator';
import { DailyStats, Achievement, AIInsight, FocusSessionLog } from '../../domain/models/Analytics';

export function useAnalyticsViewModel() {
  const [dailyStats, setDailyStats] = useState<DailyStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [totalSessions, setTotalSessions] = useState(0);

  const repo = new AnalyticsRepositoryImpl();
  const scoreCalculator = new FocusScoreCalculator(repo);
  const achievementManager = new AchievementManager(repo);
  const insightsGenerator = new InsightsGenerator(repo);

  const loadData = async () => {
    // Generate dummy data if empty for demo purposes
    let sessions = await repo.getSessions();
    if (sessions.length === 0) {
       await seedMockData(repo);
       sessions = await repo.getSessions();
    }
    
    setTotalSessions(sessions.length);

    await achievementManager.initializeAchievements();
    await achievementManager.checkAchievements();
    
    const dateString = new Date().toISOString().split('T')[0];
    await scoreCalculator.calculateAndSaveDailyScore(dateString);
    
    const stats = await repo.getDailyStats(dateString);
    setDailyStats(stats);
    
    const achs = await repo.getAchievements();
    setAchievements(achs);
    
    const generatedInsights = await insightsGenerator.generateInsights();
    setInsights(generatedInsights);
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    dailyStats,
    achievements,
    insights,
    totalSessions,
    refresh: loadData
  };
}

async function seedMockData(repo: AnalyticsRepositoryImpl) {
  const dateString = new Date().toISOString().split('T')[0];
  await repo.logSession({ id: '1', timetableId: '1', subjectName: 'Math', startTime: Date.now() - 3600000, endTime: Date.now(), durationMs: 3600000, status: 'Completed' });
  await repo.logSession({ id: '2', timetableId: '2', subjectName: 'Physics', startTime: Date.now() - 7200000, endTime: Date.now() - 3600000, durationMs: 3600000, status: 'Completed' });
  
  await repo.saveDailyStats({
    dateString,
    totalStudyTimeMs: 7200000,
    completedSessions: 2,
    missedSessions: 0,
    blockedAppAttempts: 3,
    blockedWebsiteAttempts: 1,
    speechUnlocks: 0,
    focusScore: 85
  });
}
