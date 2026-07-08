import { ParagraphVerifier } from './ParagraphVerifier';

export class ReadingProgressTracker {
  private words: string[] = [];
  private currentIndex: number = 0;

  public initialize(paragraph: string) {
    this.words = paragraph.split(/\s+/).filter(w => w.length > 0);
    this.currentIndex = 0;
  }

  public getWords(): string[] {
    return this.words;
  }

  public getCurrentIndex(): number {
    return this.currentIndex;
  }

  public processSpokenWord(spokenWord: string): boolean {
    if (this.isComplete()) return false;
    
    const expected = this.words[this.currentIndex];
    if (ParagraphVerifier.verifyNextWord(expected, spokenWord)) {
      this.currentIndex++;
      return true;
    }
    
    return false; // Failed verification
  }

  public isComplete(): boolean {
    return this.words.length > 0 && this.currentIndex >= this.words.length;
  }

  public reset() {
    this.currentIndex = 0;
  }
}
