import { SecurityEvent } from '../models/Security';

export interface SecurityRepository {
  getHistory(): Promise<SecurityEvent[]>;
  logEvent(event: SecurityEvent): Promise<void>;
  clearHistory(): Promise<void>;
}
