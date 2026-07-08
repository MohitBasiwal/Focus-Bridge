import { useState, useEffect, useRef } from 'react';
import { useNavigation } from '../../navigation/NavigationContext';
import { securityManager } from '../../services/security/SecurityManager';
import { PuzzleEngine, NumberSequencePuzzleData } from '../../services/security/PuzzleEngine';
import { SecurityRepositoryImpl } from '../../data/repository/SecurityRepositoryImpl';

export function usePuzzleViewModel() {
  const { goBack } = useNavigation();
  const [puzzleData, setPuzzleData] = useState<NumberSequencePuzzleData | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(45);
  const [error, setError] = useState<string | null>(null);
  const startTime = useRef(Date.now());
  const repo = new SecurityRepositoryImpl();

  useEffect(() => {
    setPuzzleData(PuzzleEngine.generatePuzzle('Number Sequence', securityManager.getDifficulty()));
    startTime.current = Date.now();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleFailure('Time ran out!');
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const selectOption = async (index: number) => {
    if (selectedIndices.includes(index) || error) return;
    
    const newSelected = [...selectedIndices, index];
    setSelectedIndices(newSelected);
    
    if (puzzleData) {
      const selectedValue = puzzleData.options[index];
      const expectedValue = puzzleData.sequence[newSelected.length - 1];
      
      if (selectedValue !== expectedValue) {
        setError('Incorrect sequence!');
        setTimeout(() => {
          handleFailure('Wrong Answer');
        }, 1000);
        return;
      }
      
      if (newSelected.length === puzzleData.sequence.length) {
        await handleSuccess();
      }
    }
  };

  const handleSuccess = async () => {
    securityManager.recordSuccess();
    const timeTaken = Date.now() - startTime.current;
    
    const actionName = securityManager.getPendingActionName();
    
    await repo.logEvent({
      id: Math.random().toString(),
      timestamp: Date.now(),
      action: actionName || 'Unknown',
      puzzleType: 'Number Sequence',
      result: 'Success',
      timeTakenMs: timeTaken
    });
    
    securityManager.executePendingAction();
    
    // For actions that do not replace the route, we explicitly go back.
    if (actionName === 'Disable Website Blocking') {
      goBack();
    }
  };

  const handleFailure = async (reason: string) => {
    securityManager.recordFailure();
    const timeTaken = Date.now() - startTime.current;
    await repo.logEvent({
      id: Math.random().toString(),
      timestamp: Date.now(),
      action: securityManager.getPendingActionName() || 'Unknown',
      puzzleType: 'Number Sequence',
      result: 'Failure',
      timeTakenMs: timeTaken
    });
    
    securityManager.clearPendingAction();
    goBack();
  };
  
  const handleCancel = async () => {
    const timeTaken = Date.now() - startTime.current;
    await repo.logEvent({
      id: Math.random().toString(),
      timestamp: Date.now(),
      action: securityManager.getPendingActionName() || 'Unknown',
      puzzleType: 'Number Sequence',
      result: 'Cancelled',
      timeTakenMs: timeTaken
    });
    securityManager.clearPendingAction();
    goBack();
  }

  return {
    puzzleData,
    selectedIndices,
    timeLeft,
    error,
    selectOption,
    handleCancel,
    actionName: securityManager.getPendingActionName()
  };
}
