import { useState, useEffect } from 'react';
import { Timetable } from '../../domain/models/Timetable';
import { TimetableRepository } from '../../domain/repository/TimetableRepository';
import { TimetableRepositoryImpl } from '../../data/repository/TimetableRepositoryImpl';

export function useAddEditTimetableViewModel(id?: string) {
  const repository: TimetableRepository = new TimetableRepositoryImpl();
  
  const [timetable, setTimetable] = useState<Timetable>({
    id: crypto.randomUUID(),
    title: '',
    subject: '',
    description: '',
    icon: 'Book',
    color: '#6366f1',
    startTime: '09:00',
    endTime: '10:00',
    daysOfWeek: [1, 2, 3, 4, 5],
    repeatType: 'weekdays',
    focusModeEnabled: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    allowedApps: [],
    websiteRuleMode: 'blocklist',
    websiteRules: [],
    breakSessions: []
  });
  
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      repository.getTimetable(id).then(data => {
        if (data) setTimetable(data);
      });
    }
  }, [id]);

  const updateField = <K extends keyof Timetable>(field: K, value: Timetable[K]) => {
    setTimetable(prev => ({ ...prev, [field]: value, updatedAt: Date.now() }));
    setValidationError(null);
  };

  const save = async (): Promise<boolean> => {
    if (!timetable.title.trim()) {
      setValidationError("Title cannot be empty");
      return false;
    }
    if (timetable.endTime <= timetable.startTime) {
      setValidationError("End time must be after start time");
      return false;
    }
    
    // Check for overlap logic can be placed here
    
    await repository.saveTimetable(timetable);
    return true;
  };

  return {
    timetable,
    updateField,
    save,
    validationError
  };
}
