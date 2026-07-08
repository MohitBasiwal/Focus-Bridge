import { Paragraph, Category, ParagraphHistory, ParagraphStats } from '../models/Paragraph';

export interface ParagraphRepository {
  getAllParagraphs(): Promise<Paragraph[]>;
  getParagraphsByCategory(categories: Category[]): Promise<Paragraph[]>;
  getParagraphById(id: string): Promise<Paragraph | null>;
  saveParagraphs(paragraphs: Paragraph[]): Promise<void>;
  
  getHistory(): Promise<ParagraphHistory[]>;
  recordUsage(paragraphId: string): Promise<void>;
  
  getPreferredCategories(): Promise<Category[]>;
  setPreferredCategories(categories: Category[]): Promise<void>;
  
  getStats(): Promise<ParagraphStats>;
  updateSyncTime(time: number): Promise<void>;
}
