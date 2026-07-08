export type PuzzleType = 'Number Sequence' | 'Pattern Memory';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface SecurityEvent {
  id: string;
  timestamp: number;
  action: string;
  puzzleType: PuzzleType;
  result: 'Success' | 'Failure' | 'Cancelled';
  timeTakenMs: number;
}
