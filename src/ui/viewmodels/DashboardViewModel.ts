import { useState, useEffect } from 'react';
import { SessionRepository } from '../../domain/repository/SessionRepository';
import { SessionRepositoryImpl } from '../../data/repository/SessionRepositoryImpl';

// Placeholder for MVVM Architecture - Presentation Layer
export function useDashboardViewModel() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simple DI simulation
  const repository: SessionRepository = new SessionRepositoryImpl();

  useEffect(() => {
    async function load() {
      const data = await repository.getTodaySessions();
      setSessions(data);
      setIsLoading(false);
    }
    load();
  }, []);

  return {
    sessions,
    isLoading
  };
}
