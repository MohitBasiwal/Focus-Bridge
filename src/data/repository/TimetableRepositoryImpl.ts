import { Timetable } from '../../domain/models/Timetable';
import { TimetableRepository } from '../../domain/repository/TimetableRepository';

const STORAGE_KEY = 'focus_bridge_timetables';

export class TimetableRepositoryImpl implements TimetableRepository {
  private getStorage(): Timetable[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private setStorage(data: Timetable[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  async getTimetables(): Promise<Timetable[]> {
    return this.getStorage();
  }

  async getTimetable(id: string): Promise<Timetable | null> {
    const items = this.getStorage();
    return items.find(t => t.id === id) || null;
  }

  async saveTimetable(timetable: Timetable): Promise<void> {
    const items = this.getStorage();
    const index = items.findIndex(t => t.id === timetable.id);
    if (index >= 0) {
      items[index] = timetable;
    } else {
      items.push(timetable);
    }
    this.setStorage(items);
  }

  async deleteTimetable(id: string): Promise<void> {
    let items = this.getStorage();
    items = items.filter(t => t.id !== id);
    this.setStorage(items);
  }
}
