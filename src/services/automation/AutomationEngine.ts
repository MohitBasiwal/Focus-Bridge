import { TimetableRepositoryImpl } from '../../data/repository/TimetableRepositoryImpl';
import { Timetable } from '../../domain/models/Timetable';

export interface ActiveSessionContext {
  session: Timetable;
  isBreak: boolean;
}

export class AutomationEngine {
  private static instance: AutomationEngine;
  private timer: NodeJS.Timeout | null = null;
  private timetableRepo = new TimetableRepositoryImpl();
  
  private activeContext: ActiveSessionContext | null = null;
  private listeners: ((context: ActiveSessionContext | null) => void)[] = [];

  static getInstance(): AutomationEngine {
    if (!this.instance) {
      this.instance = new AutomationEngine();
    }
    return this.instance;
  }

  start() {
    if (this.timer) return;
    this.timer = setInterval(() => this.checkAutomation(), 10000); // Check every 10s for more precision
    this.checkAutomation();
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  subscribe(listener: (context: ActiveSessionContext | null) => void) {
    this.listeners.push(listener);
    listener(this.activeContext);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private async checkAutomation() {
    const timetables = await this.timetableRepo.getTimetables();
    const now = new Date();
    const todayDay = now.getDay();
    
    const todaySessions = timetables.filter(t => t.daysOfWeek.includes(todayDay) && t.focusModeEnabled);

    let currentSession: Timetable | null = null;
    let isCurrentlyBreak = false;

    for (const session of todaySessions) {
      const startTime = this.parseTime(session.startTime, now);
      const endTime = this.parseTime(session.endTime, now);
      
      if (now >= startTime && now <= endTime) {
        currentSession = session;
        // Check breaks
        for (const b of session.breakSessions) {
          const bStart = this.parseTime(b.startTime, now);
          const bEnd = this.parseTime(b.endTime, now);
          if (now >= bStart && now <= bEnd) {
            isCurrentlyBreak = true;
            break;
          }
        }
        break; // Assume one active session at a time
      }
    }

    const prevSessionId = this.activeContext?.session?.id;
    const newSessionId = currentSession?.id;
    const prevBreak = this.activeContext?.isBreak;

    if (prevSessionId !== newSessionId || prevBreak !== isCurrentlyBreak) {
      this.activeContext = currentSession ? { session: currentSession, isBreak: isCurrentlyBreak } : null;
      this.notifyListeners();
    }
  }

  private notifyListeners() {
    for (const listener of this.listeners) {
      listener(this.activeContext);
    }
  }

  private parseTime(time: string, now: Date): Date {
    const [h, m] = time.split(':').map(Number);
    const d = new Date(now);
    d.setHours(h, m, 0, 0);
    return d;
  }
}
