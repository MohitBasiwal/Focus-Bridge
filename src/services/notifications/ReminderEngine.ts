import { TimetableRepositoryImpl } from '../../data/repository/TimetableRepositoryImpl';
import { SettingsRepositoryImpl } from '../../data/repository/SettingsRepositoryImpl';
import { NotificationManager } from './NotificationManager';
import { Timetable } from '../../domain/models/Timetable';

const MOTIVATIONAL_MESSAGES = [
  "Every focused minute builds your future.",
  "Discipline today creates freedom tomorrow.",
  "Stay focused. Small efforts become big achievements.",
  "Your future self will thank you for this.",
  "Push through the resistance. Greatness awaits.",
  "One step at a time. Keep going."
];

export class ReminderEngine {
  private static instance: ReminderEngine;
  private timer: NodeJS.Timeout | null = null;
  private timetableRepo = new TimetableRepositoryImpl();
  private settingsRepo = new SettingsRepositoryImpl();
  
  // Track notified events to avoid spamming
  private notifiedEvents = new Set<string>();

  static getInstance(): ReminderEngine {
    if (!this.instance) {
      this.instance = new ReminderEngine();
    }
    return this.instance;
  }

  start() {
    if (this.timer) return;
    this.timer = setInterval(() => this.checkReminders(), 60000); // Check every minute
    this.checkReminders(); // Check immediately
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private async checkReminders() {
    const settings = await this.settingsRepo.getNotificationSettings();
    if (!settings.enableReminders) return;

    const now = new Date();
    
    // Check quiet hours
    if (settings.quietHoursEnabled) {
      const isQuiet = this.isWithinQuietHours(now, settings.quietHoursStart, settings.quietHoursEnd);
      if (isQuiet) return; // Suppress notifications
    }

    const timetables = await this.timetableRepo.getTimetables();
    const todayDay = now.getDay();

    const todaySessions = timetables.filter(t => t.daysOfWeek.includes(todayDay));

    for (const session of todaySessions) {
      this.processSession(session, now, settings.reminderTimes);
    }
    
    // Check Streak
    this.checkStreak(todaySessions, now);
  }

  private processSession(session: Timetable, now: Date, reminderTimes: number[]) {
    const startTime = this.parseTime(session.startTime, now);
    const endTime = this.parseTime(session.endTime, now);
    const halfwayTime = new Date((startTime.getTime() + endTime.getTime()) / 2);
    
    const diffMins = (startTime.getTime() - now.getTime()) / 60000;
    const isOver = now.getTime() > endTime.getTime();
    const isOngoing = now.getTime() >= startTime.getTime() && now.getTime() <= endTime.getTime();

    // 1. Advance Reminders
    for (const min of reminderTimes) {
      if (diffMins > 0 && diffMins <= min && diffMins > min - 1) {
        this.notify(
          `${session.id}-remind-${min}-${now.getDate()}`,
          `Upcoming: ${session.title}`,
          `Starts in ${min} minutes. ${this.getRandomMessage()}`
        );
      }
    }

    // 2. Start
    if (diffMins <= 0 && diffMins > -1) {
      this.notify(
        `${session.id}-start-${now.getDate()}`,
        `Session Started: ${session.title}`,
        `Time to focus! ${this.getRandomMessage()}`
      );
    }

    // 3. Halfway (for long sessions, say > 30 mins)
    const durationMins = (endTime.getTime() - startTime.getTime()) / 60000;
    if (durationMins > 30) {
      const halfDiffMins = (halfwayTime.getTime() - now.getTime()) / 60000;
      if (halfDiffMins <= 0 && halfDiffMins > -1) {
        this.notify(
          `${session.id}-halfway-${now.getDate()}`,
          `Halfway there: ${session.title}`,
          "You're doing great! Keep the momentum going."
        );
      }
    }

    // 4. Ending soon (5 mins before)
    const endDiffMins = (endTime.getTime() - now.getTime()) / 60000;
    if (endDiffMins > 0 && endDiffMins <= 5 && endDiffMins > 4) {
      this.notify(
        `${session.id}-endsoon-${now.getDate()}`,
        `Wrapping up: ${session.title}`,
        "5 minutes left. Finish strong!"
      );
    }

    // 5. Ended
    if (endDiffMins <= 0 && endDiffMins > -1) {
      this.notify(
        `${session.id}-ended-${now.getDate()}`,
        `Session Completed: ${session.title}`,
        "Great job! Take a well-deserved break."
      );
    }
  }

  private checkStreak(todaySessions: Timetable[], now: Date) {
    if (todaySessions.length === 0) return;
    
    // Check if it's evening and they haven't started (Simulated logic for "daily streak about to break")
    if (now.getHours() === 20 && now.getMinutes() === 0) {
      this.notify(
        `streak-warning-${now.getDate()}`,
        "Streak at risk!",
        "Complete one more session today to keep your streak alive."
      );
    }
  }

  private notify(id: string, title: string, body: string) {
    if (this.notifiedEvents.has(id)) return;
    this.notifiedEvents.add(id);
    NotificationManager.showNotification(title, { body, icon: '/icon.png' });
  }

  private isWithinQuietHours(now: Date, start: string, end: string): boolean {
    const startTime = this.parseTime(start, now);
    const endTime = this.parseTime(end, now);
    
    // Handle overnight quiet hours (e.g. 22:00 to 07:00)
    if (startTime > endTime) {
      return now >= startTime || now <= endTime;
    }
    return now >= startTime && now <= endTime;
  }

  private parseTime(time: string, now: Date): Date {
    const [h, m] = time.split(':').map(Number);
    const d = new Date(now);
    d.setHours(h, m, 0, 0);
    return d;
  }

  private getRandomMessage(): string {
    return MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
  }
}
