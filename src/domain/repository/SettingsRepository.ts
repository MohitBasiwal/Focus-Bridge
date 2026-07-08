import { NotificationSettings, DEFAULT_NOTIFICATION_SETTINGS } from '../models/Settings';

export interface SettingsRepository {
  getNotificationSettings(): Promise<NotificationSettings>;
  saveNotificationSettings(settings: NotificationSettings): Promise<void>;
}
