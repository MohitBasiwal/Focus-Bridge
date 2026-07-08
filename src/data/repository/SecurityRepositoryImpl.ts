import { SecurityRepository } from '../../domain/repository/SecurityRepository';
import { SecurityEvent } from '../../domain/models/Security';

const STORAGE_KEY = 'focus_bridge_security_history';

export class SecurityRepositoryImpl implements SecurityRepository {
  async getHistory(): Promise<SecurityEvent[]> {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  async logEvent(event: SecurityEvent): Promise<void> {
    const history = await this.getHistory();
    history.unshift(event);
    if (history.length > 200) history.pop();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }

  async clearHistory(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
  }
}
