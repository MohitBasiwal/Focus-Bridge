export class ParagraphValidator {
  /**
   * Validates if a paragraph meets the required criteria for speech recognition.
   */
  static isValid(text: string): boolean {
    if (!text || text.trim().length === 0) return false;

    const words = text.trim().split(/\s+/);
    
    // Check length (ideal: 250-350, relaxed for demo)
    if (words.length < 50 || words.length > 500) return false;

    // Reject difficult symbols, equations, URLs, emojis
    const invalidPattern = /[#@$%^&*_+<>{}\[\]\\|~]|https?:\/\//i;
    if (invalidPattern.test(text)) return false;

    // Check for excessive numbers
    const numberCount = words.filter(w => /^\d+$/.test(w)).length;
    if (numberCount > words.length * 0.05) return false; // More than 5% numbers

    return true;
  }

  static getWordCount(text: string): number {
    return text.trim().split(/\s+/).length;
  }
}
