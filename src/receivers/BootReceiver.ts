import { ReminderEngine } from '../services/notifications/ReminderEngine';
import { AutomationEngine } from '../services/automation/AutomationEngine';
import { NotificationManager } from '../services/notifications/NotificationManager';

/**
 * Web equivalent of Android's BootReceiver.
 * Restores necessary background workers and automation when the app loads.
 */
export class BootReceiver {
  static async onBoot() {
    console.log("[BootReceiver] Initializing background engines...");
    
    // Request permission if not already done (Optional: might want to do this on user interaction instead)
    // NotificationManager.requestPermission(); 
    
    // Start Reminder Engine (Session Scheduler, Notifications)
    ReminderEngine.getInstance().start();
    
    // Start Automation Engine (Focus Mode toggles)
    AutomationEngine.getInstance().start();
    
    console.log("[BootReceiver] All engines started successfully.");
  }
}
