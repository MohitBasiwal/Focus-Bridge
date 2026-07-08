import { useState, useEffect } from 'react';
import { Timetable } from '../../domain/models/Timetable';
import { TimetableRepository } from '../../domain/repository/TimetableRepository';
import { TimetableRepositoryImpl } from '../../data/repository/TimetableRepositoryImpl';

export function useTimetableListViewModel() {
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming'>('all');
  const repository: TimetableRepository = new TimetableRepositoryImpl();

  const load = async () => {
    const data = await repository.getTimetables();
    setTimetables(data);
  };

  useEffect(() => {
    load();
  }, []);

  const filteredTimetables = timetables.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (filter === 'today') {
      const today = new Date().getDay();
      matchesFilter = t.daysOfWeek.includes(today);
    }
    
    return matchesSearch && matchesFilter;
  });

  return {
    timetables: filteredTimetables,
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    reload: load
  };
}
