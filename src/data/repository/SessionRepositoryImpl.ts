import { Session, SessionRepository } from '../../domain/repository/SessionRepository';

// Placeholder for Data Layer implementing Domain Repository
export class SessionRepositoryImpl implements SessionRepository {
  async getTodaySessions(): Promise<Session[]> {
    return [];
  }

  async saveSession(session: Session): Promise<void> {
    console.log('Session saved', session);
  }
}
