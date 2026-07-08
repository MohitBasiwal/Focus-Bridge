import { Timetable } from '../models/Timetable';

export interface TimetableRepository {
  getTimetables(): Promise<Timetable[]>;
  getTimetable(id: string): Promise<Timetable | null>;
  saveTimetable(timetable: Timetable): Promise<void>;
  deleteTimetable(id: string): Promise<void>;
}
