import { SpeechRepository } from '../../domain/repository/SpeechRepository';
import { ParagraphRepositoryImpl } from './ParagraphRepositoryImpl';
import { ParagraphSelector } from '../../services/speech/ParagraphSelector';

export class SpeechRepositoryImpl implements SpeechRepository {
  private paragraphRepo = new ParagraphRepositoryImpl();
  private selector = new ParagraphSelector(this.paragraphRepo);

  async getRandomParagraph(): Promise<string> {
    const selected = await this.selector.selectForChallenge();
    if (selected) {
      await this.paragraphRepo.recordUsage(selected.id);
      return selected.content;
    }
    return "Failed to load reading challenge paragraph.";
  }
}
