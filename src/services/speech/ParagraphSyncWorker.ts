import { ParagraphRepository } from '../../domain/repository/ParagraphRepository';
import { Paragraph, Category } from '../../domain/models/Paragraph';
import { ParagraphValidator } from './ParagraphValidator';

export class ParagraphSyncWorker {
  constructor(private repository: ParagraphRepository) {}

  /**
   * Simulates a background worker fetching new paragraphs from a remote server.
   */
  async sync(): Promise<{ success: boolean; newCount: number }> {
    try {
      console.log("ParagraphSyncWorker: Starting sync...");
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate remote data
      const remoteData: Paragraph[] = [
        {
          id: 'p-4',
          title: 'The Psychology of Habits',
          category: 'Psychology',
          content: "Habits are the invisible architecture of our daily lives. Research in psychology shows that a significant portion of our actions are not the result of conscious choices, but rather automatic routines. These routines form a habit loop, consisting of a cue, a routine, and a reward. Understanding this loop is essential for anyone looking to change their behavior. By identifying the triggers that initiate a habit, we can begin to replace negative routines with positive ones. Over time, consistent practice reshapes our neural pathways, making the new behavior automatic. Whether it is improving focus, adopting a healthier lifestyle, or learning a new skill, mastering the psychology of habits provides a powerful framework for personal growth and lasting change.",
          wordCount: ParagraphValidator.getWordCount("Habits are the invisible architecture of our daily lives. Research in psychology shows that a significant portion of our actions are not the result of conscious choices, but rather automatic routines. These routines form a habit loop, consisting of a cue, a routine, and a reward. Understanding this loop is essential for anyone looking to change their behavior. By identifying the triggers that initiate a habit, we can begin to replace negative routines with positive ones. Over time, consistent practice reshapes our neural pathways, making the new behavior automatic. Whether it is improving focus, adopting a healthier lifestyle, or learning a new skill, mastering the psychology of habits provides a powerful framework for personal growth and lasting change.")
        }
      ];

      const existing = await this.repository.getAllParagraphs();
      const existingIds = new Set(existing.map(p => p.id));
      
      const newParagraphs = remoteData.filter(p => !existingIds.has(p.id) && ParagraphValidator.isValid(p.content));
      
      if (newParagraphs.length > 0) {
        await this.repository.saveParagraphs([...existing, ...newParagraphs]);
      }

      await this.repository.updateSyncTime(Date.now());
      
      console.log(`ParagraphSyncWorker: Sync complete. Added ${newParagraphs.length} new paragraphs.`);
      return { success: true, newCount: newParagraphs.length };
    } catch (e) {
      console.error("ParagraphSyncWorker: Sync failed", e);
      return { success: false, newCount: 0 };
    }
  }
}
