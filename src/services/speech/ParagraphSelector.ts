import { Paragraph, Category } from '../../domain/models/Paragraph';
import { ParagraphRepository } from '../../domain/repository/ParagraphRepository';

export class ParagraphSelector {
  constructor(private repository: ParagraphRepository) {}

  async selectForChallenge(): Promise<Paragraph | null> {
    // 1. Get preferred categories
    let preferred = await this.repository.getPreferredCategories();
    
    // 2. Fetch paragraphs matching categories (or all if none preferred)
    let candidates = await this.repository.getParagraphsByCategory(preferred);
    
    if (candidates.length === 0) {
      candidates = await this.repository.getAllParagraphs();
    }
    if (candidates.length === 0) return null;

    // 3. Avoid recently used
    const history = await this.repository.getHistory();
    const recentlyUsedIds = new Set(
      history
        .sort((a, b) => b.usedAt - a.usedAt)
        .slice(0, Math.min(10, Math.floor(candidates.length / 2))) // avoid last 10 or half of available
        .map(h => h.paragraphId)
    );

    const unusedCandidates = candidates.filter(p => !recentlyUsedIds.has(p.id));

    // Fallback to all candidates if we ran out of unused ones
    const finalCandidates = unusedCandidates.length > 0 ? unusedCandidates : candidates;

    // 4. Random selection
    const randomIndex = Math.floor(Math.random() * finalCandidates.length);
    const selected = finalCandidates[randomIndex];

    return selected;
  }
}
