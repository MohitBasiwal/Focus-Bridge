export class NotificationManager {
  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notification');
      return false;
    }
    
    if (Notification.permission === 'granted') {
      return true;
    }
    
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    
    return false;
  }

  static async showNotification(title: string, options?: NotificationOptions) {
    if (!('Notification' in window)) return;
    
    if (Notification.permission === 'granted') {
      try {
        const registration = await navigator.serviceWorker?.getRegistration();
        if (registration && 'showNotification' in registration) {
          registration.showNotification(title, options);
        } else {
          new Notification(title, options);
        }
      } catch (e) {
        new Notification(title, options);
      }
    }
  }
}
