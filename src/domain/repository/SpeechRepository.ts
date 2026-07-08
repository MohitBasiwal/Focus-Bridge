export interface SpeechRepository {
  getRandomParagraph(): Promise<string>;
}
