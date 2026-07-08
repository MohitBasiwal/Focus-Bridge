export type Category = 'Science' | 'Technology' | 'Space' | 'History' | 'Geography' | 'Nature' | 'Psychology' | 'Health' | 'Business' | 'Current Affairs' | 'Biography' | 'Philosophy';

export interface Paragraph {
  id: string;
  title: string;
  content: string;
  category: Category;
  wordCount: number;
}

export interface ParagraphHistory {
  paragraphId: string;
  usedAt: number;
}

export interface ParagraphStats {
  totalParagraphs: number;
  categories: Record<string, number>;
  lastSyncTime: number | null;
}
