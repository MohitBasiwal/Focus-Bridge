import { Paragraph, Category, ParagraphHistory, ParagraphStats } from '../../domain/models/Paragraph';
import { ParagraphRepository } from '../../domain/repository/ParagraphRepository';
import { ParagraphValidator } from '../../services/speech/ParagraphValidator';

const STORAGE_KEY_PARAGRAPHS = 'focus_bridge_paragraphs';
const STORAGE_KEY_HISTORY = 'focus_bridge_paragraph_history';
const STORAGE_KEY_CATEGORIES = 'focus_bridge_preferred_categories';
const STORAGE_KEY_SYNC_TIME = 'focus_bridge_paragraph_sync_time';

const INITIAL_PARAGRAPHS: Paragraph[] = [
  {
    id: 'p-1',
    title: 'The Mystery of Black Holes',
    category: 'Space',
    content: "The vast expanse of the cosmos has always fascinated humanity. From the earliest stargazers to modern astronomers using powerful telescopes, our quest to understand the universe remains unquenchable. Galaxies stretch out like cosmic dust, each containing billions of stars, and perhaps, countless worlds. The sheer scale of space challenges our comprehension, yet it inspires us to reach further. As we explore the mysteries of black holes, dark matter, and cosmic radiation, we realize how much is still unknown. Every new discovery opens up a myriad of questions, pushing the boundaries of science and technology. Our journey into space is not just about exploring the physical universe, but also about understanding our place within it.",
    wordCount: 110
  },
  {
    id: 'p-2',
    title: 'The Evolution of AI',
    category: 'Technology',
    content: "Artificial intelligence has rapidly evolved from a theoretical concept to a transformative force in our daily lives. Machine learning algorithms now power everything from personalized recommendations to autonomous vehicles. As AI systems become more sophisticated, they are capable of performing complex tasks with unprecedented accuracy and speed. However, this rapid advancement also brings significant ethical and societal challenges. Questions about data privacy, algorithmic bias, and the future of work are hotly debated. It is crucial for developers, policymakers, and society at large to collaborate and ensure that AI technologies are designed and deployed responsibly. Balancing innovation with ethical considerations will be key to harnessing the full potential of artificial intelligence for the betterment of humanity.",
    wordCount: 109
  },
  {
    id: 'p-3',
    title: 'Coral Reef Ecosystems',
    category: 'Nature',
    content: "The natural world is an intricate web of ecosystems, each supporting a diverse array of flora and fauna. From the dense Amazon rainforest to the vibrant coral reefs, biodiversity is the cornerstone of a healthy planet. Every species, no matter how small, plays a vital role in maintaining the delicate balance of its environment. Unfortunately, human activities such as deforestation, pollution, and climate change pose severe threats to these ecosystems. Conservation efforts are more critical than ever to protect endangered species and restore degraded habitats. By promoting sustainable practices and raising awareness about environmental issues, we can help preserve the rich tapestry of life on Earth for future generations.",
    wordCount: 111
  }
];

export class ParagraphRepositoryImpl implements ParagraphRepository {
  constructor() {
    this.initializeDefaults();
  }

  private initializeDefaults() {
    if (!localStorage.getItem(STORAGE_KEY_PARAGRAPHS)) {
      this.setStorage(STORAGE_KEY_PARAGRAPHS, INITIAL_PARAGRAPHS);
    }
    if (!localStorage.getItem(STORAGE_KEY_CATEGORIES)) {
      this.setStorage(STORAGE_KEY_CATEGORIES, ['Science', 'Technology', 'Space', 'Nature']);
    }
  }

  private getStorage<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  private setStorage(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  async getAllParagraphs(): Promise<Paragraph[]> {
    return this.getStorage<Paragraph[]>(STORAGE_KEY_PARAGRAPHS) || [];
  }

  async getParagraphsByCategory(categories: Category[]): Promise<Paragraph[]> {
    const all = await this.getAllParagraphs();
    if (categories.length === 0) return all;
    return all.filter(p => categories.includes(p.category));
  }

  async getParagraphById(id: string): Promise<Paragraph | null> {
    const all = await this.getAllParagraphs();
    return all.find(p => p.id === id) || null;
  }

  async saveParagraphs(paragraphs: Paragraph[]): Promise<void> {
    const existing = await this.getAllParagraphs();
    const map = new Map(existing.map(p => [p.id, p]));
    
    for (const p of paragraphs) {
      if (ParagraphValidator.isValid(p.content)) {
         map.set(p.id, p);
      }
    }
    this.setStorage(STORAGE_KEY_PARAGRAPHS, Array.from(map.values()));
  }

  async getHistory(): Promise<ParagraphHistory[]> {
    return this.getStorage<ParagraphHistory[]>(STORAGE_KEY_HISTORY) || [];
  }

  async recordUsage(paragraphId: string): Promise<void> {
    const history = await this.getHistory();
    history.push({ paragraphId, usedAt: Date.now() });
    
    // Keep only last 100 entries to prevent infinite growth
    if (history.length > 100) {
       history.shift();
    }
    
    this.setStorage(STORAGE_KEY_HISTORY, history);
  }

  async getPreferredCategories(): Promise<Category[]> {
    return this.getStorage<Category[]>(STORAGE_KEY_CATEGORIES) || [];
  }

  async setPreferredCategories(categories: Category[]): Promise<void> {
    this.setStorage(STORAGE_KEY_CATEGORIES, categories);
  }

  async getStats(): Promise<ParagraphStats> {
    const all = await this.getAllParagraphs();
    const categories: Record<string, number> = {};
    
    for (const p of all) {
      categories[p.category] = (categories[p.category] || 0) + 1;
    }

    return {
      totalParagraphs: all.length,
      categories,
      lastSyncTime: this.getStorage<number>(STORAGE_KEY_SYNC_TIME)
    };
  }

  async updateSyncTime(time: number): Promise<void> {
    this.setStorage(STORAGE_KEY_SYNC_TIME, time);
  }
}
