import { Timetable, AppModel } from '../../domain/models/Timetable';
import { TimetableRepository } from '../../domain/repository/TimetableRepository';
import { TimetableRepositoryImpl } from '../../data/repository/TimetableRepositoryImpl';
import { websiteBlockingManager } from '../websiteblocking/WebsiteBlockingManager';
import { unlockSessionManager } from '../speech/UnlockSessionManager';

/**
 * Simulated Accessibility Service / Background Engine
 * In a real Android environment, this would extend AccessibilityService.
 */
export class FocusService {
  private repository: TimetableRepository;
  private checkInterval: ReturnType<typeof setInterval> | null = null;
  private isFocusActive: boolean = false;
  private currentActiveTimetable: Timetable | null = null;

  constructor() {
    this.repository = new TimetableRepositoryImpl();
  }

  public startService() {
    console.log("FocusService: Starting accessibility monitoring...");
    // Simulate continuous monitoring (e.g., checking foreground app)
    this.checkInterval = setInterval(() => this.evaluateFocusState(), 5000);
    this.evaluateFocusState();
  }

  public stopService() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }

  private async evaluateFocusState() {
    const timetables = await this.repository.getTimetables();
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    let active = null;

    for (const timetable of timetables) {
      if (!timetable.focusModeEnabled) continue;
      
      // Check day
      if (!timetable.daysOfWeek.includes(currentDay) && timetable.repeatType !== 'none') {
        continue;
      }

      // Check time
      if (currentTime >= timetable.startTime && currentTime <= timetable.endTime) {
        active = timetable;
        break;
      }
    }

    if (active) {
      if (!this.isFocusActive) {
        console.log(`FocusService: Focus Mode ACTIVATED for session: ${active.title}`);
        this.isFocusActive = true;
        this.currentActiveTimetable = active;
        this.showPersistentNotification(active);
      }
    } else {
      if (this.isFocusActive) {
        console.log("FocusService: Focus Mode DEACTIVATED.");
        this.isFocusActive = false;
        this.currentActiveTimetable = null;
        this.hidePersistentNotification();
      }
    }
  }

  /**
   * Simulate a foreground app change event.
   * If the app is not in the allowed list of the active timetable, block it.
   */
  public onForegroundAppChanged(appPackageName: string, appName: string): boolean {
    if (!this.isFocusActive || !this.currentActiveTimetable) return true; // Allowed
    if (unlockSessionManager.isUnlocked()) return true; // Temporarily unlocked

    // Always allow essential system apps (simulated)
    const essentialApps = ['com.android.launcher', 'com.android.systemui', 'com.android.phone', 'com.focusbridge.app'];
    if (essentialApps.includes(appPackageName)) return true;

    // Check if app is explicitly allowed in current timetable
    const isAllowed = this.currentActiveTimetable.allowedApps.some(a => a.packageName === appPackageName);

    if (!isAllowed) {
      console.warn(`FocusService: BLOCKED app ${appName} (${appPackageName})`);
      this.triggerAppBlockingScreen(appName, this.currentActiveTimetable);
      return false; // Blocked
    }

    return true; // Allowed
  }

  /**
   * Simulate URL changing event from Accessibility Service scanning browser nodes.
   */
  public onUrlChanged(packageName: string, url: string): boolean {
    if (!this.isFocusActive || !this.currentActiveTimetable) return true;
    if (unlockSessionManager.isUnlocked()) return true; // Temporarily unlocked

    if (websiteBlockingManager.isBrowser(packageName)) {
      const isAllowed = websiteBlockingManager.evaluateUrl(url, this.currentActiveTimetable);
      if (!isAllowed) {
         console.warn(`FocusService: BLOCKED website ${url}`);
         this.triggerWebsiteBlockingScreen(url, this.currentActiveTimetable);
         return false;
      }
    }
    return true;
  }

  private triggerAppBlockingScreen(appName: string, session: Timetable) {
    // In a real app, this would start an Activity with FLAG_ACTIVITY_NEW_TASK
    console.log("FocusService: Launching BlockingScreen Activity for App", appName);
  }

  private triggerWebsiteBlockingScreen(url: string, session: Timetable) {
    // In a real app, this would start an Activity with FLAG_ACTIVITY_NEW_TASK
    console.log("FocusService: Launching BlockingScreen Activity for Website", url);
  }

  private showPersistentNotification(session: Timetable) {
    // In a real app, this builds an ongoing Foreground Service Notification
    console.log(`[Notification] Focus Bridge Active: ${session.title}`);
  }

  private hidePersistentNotification() {
    console.log(`[Notification] Focus Bridge Stopped`);
  }
}

// Export a singleton instance
export const focusServiceInstance = new FocusService();
