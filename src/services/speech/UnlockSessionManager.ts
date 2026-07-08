export class UnlockSessionManager {
  private unlockEndTime: number | null = null;
  private timerId: ReturnType<typeof setTimeout> | null = null;

  public unlockFor(minutes: number = 5) {
    this.unlockEndTime = Date.now() + minutes * 60 * 1000;
    if (this.timerId) clearTimeout(this.timerId);
    this.timerId = setTimeout(() => {
      this.lock();
    }, minutes * 60 * 1000);
    console.log(`UnlockSessionManager: Unlocked for ${minutes} minutes.`);
  }

  public lock() {
    this.unlockEndTime = null;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    console.log("UnlockSessionManager: Locked.");
  }

  public isUnlocked(): boolean {
    if (this.unlockEndTime === null) return false;
    if (Date.now() > this.unlockEndTime) {
      this.lock();
      return false;
    }
    return true;
  }

  public getRemainingTimeMs(): number {
    if (!this.isUnlocked()) return 0;
    return Math.max(0, this.unlockEndTime! - Date.now());
  }
}

export const unlockSessionManager = new UnlockSessionManager();
