export class ParagraphVerifier {
  static normalizeWord(word: string): string {
    return word.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  static verifyNextWord(expectedWord: string, spokenWord: string): boolean {
    return this.normalizeWord(expectedWord) === this.normalizeWord(spokenWord);
  }
}
