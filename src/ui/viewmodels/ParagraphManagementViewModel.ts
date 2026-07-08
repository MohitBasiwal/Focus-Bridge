import { useState, useEffect } from 'react';
import { ParagraphStats, Category } from '../../domain/models/Paragraph';
import { ParagraphRepositoryImpl } from '../../data/repository/ParagraphRepositoryImpl';
import { ParagraphSyncWorker } from '../../services/speech/ParagraphSyncWorker';

export function useParagraphManagementViewModel() {
  const repository = new ParagraphRepositoryImpl();
  const syncWorker = new ParagraphSyncWorker(repository);

  const [stats, setStats] = useState<ParagraphStats | null>(null);
  const [preferredCategories, setPreferredCategories] = useState<Category[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const ALL_CATEGORIES: Category[] = [
    'Science', 'Technology', 'Space', 'History', 'Geography', 'Nature', 
    'Psychology', 'Health', 'Business', 'Current Affairs', 'Biography', 'Philosophy'
  ];

  const load = async () => {
    const [st, cats] = await Promise.all([
      repository.getStats(),
      repository.getPreferredCategories()
    ]);
    setStats(st);
    setPreferredCategories(cats);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleCategory = async (category: Category) => {
    let newCats = [...preferredCategories];
    if (newCats.includes(category)) {
      newCats = newCats.filter(c => c !== category);
    } else {
      newCats.push(category);
    }
    await repository.setPreferredCategories(newCats);
    setPreferredCategories(newCats);
  };

  const forceSync = async () => {
    setIsSyncing(true);
    await syncWorker.sync();
    await load();
    setIsSyncing(false);
  };

  return {
    stats,
    preferredCategories,
    ALL_CATEGORIES,
    toggleCategory,
    isSyncing,
    forceSync
  };
}
