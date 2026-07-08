import { useState, useEffect } from 'react';
import { SecurityEvent } from '../../domain/models/Security';
import { SecurityRepositoryImpl } from '../../data/repository/SecurityRepositoryImpl';

export function useSecurityCenterViewModel() {
  const [history, setHistory] = useState<SecurityEvent[]>([]);
  const repo = new SecurityRepositoryImpl();

  const loadHistory = async () => {
    const data = await repo.getHistory();
    setHistory(data);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const clearHistory = async () => {
    await repo.clearHistory();
    setHistory([]);
  };

  return {
    history,
    clearHistory
  };
}
