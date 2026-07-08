export interface NotificationSettings {
  enableReminders: boolean;
  reminderTimes: number[]; // e.g. [15, 5] minutes before
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // "22:00"
  quietHoursEnd: string; // "07:00"
  dailySummary: boolean;
  weeklySummary: boolean;
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enableReminders: true,
  reminderTimes: [15, 5],
  soundEnabled: true,
  vibrationEnabled: true,
  quietHoursEnabled: false,
  quietHoursStart: "22:00",
  quietHoursEnd: "07:00",
  dailySummary: true,
  weeklySummary: true,
};
