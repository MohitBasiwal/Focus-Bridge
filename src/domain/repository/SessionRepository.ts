// Placeholder for Clean Architecture - Domain Layer
export interface Session {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  isCompleted: boolean;
}

export interface SessionRepository {
  getTodaySessions(): Promise<Session[]>;
  saveSession(session: Session): Promise<void>;
}
