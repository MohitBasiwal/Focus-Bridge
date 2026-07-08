import { PuzzleType, Difficulty } from '../../domain/models/Security';

export interface NumberSequencePuzzleData {
  type: 'Number Sequence';
  sequence: number[];
  options: number[];
}

export class PuzzleEngine {
  static generatePuzzle(type: PuzzleType, difficulty: Difficulty): NumberSequencePuzzleData {
    let count = 5;
    if (difficulty === 'Medium') count = 7;
    if (difficulty === 'Hard') count = 9;

    const sequence: number[] = [];
    while (sequence.length < count) {
      const num = Math.floor(Math.random() * 99) + 1;
      if (!sequence.includes(num)) {
        sequence.push(num);
      }
    }

    const sortedSequence = [...sequence].sort((a, b) => a - b);
    const options = [...sortedSequence].sort(() => Math.random() - 0.5);

    return {
      type: 'Number Sequence',
      sequence: sortedSequence,
      options
    };
  }
}
