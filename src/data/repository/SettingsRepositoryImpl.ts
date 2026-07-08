import { SettingsRepository } from '../../domain/repository/SettingsRepository';
import { NotificationSettings, DEFAULT_NOTIFICATION_SETTINGS } from '../../domain/models/Settings';

export class SettingsRepositoryImpl implements SettingsRepository {
  private readonly KEY = 'focus_bridge_notification_settings';

  async getNotificationSettings(): Promise<NotificationSettings> {
    const data = localStorage.getItem(this.KEY);
    if (data) {
      return { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(data) };
    }
    return DEFAULT_NOTIFICATION_SETTINGS;
  }

  async saveNotificationSettings(settings: NotificationSettings): Promise<void> {
    localStorage.setItem(this.KEY, JSON.stringify(settings));
  }
}
