import { useState, useEffect, useRef, useCallback } from 'react';
import { SpeechRepository } from '../../domain/repository/SpeechRepository';
import { SpeechRepositoryImpl } from '../../data/repository/SpeechRepositoryImpl';
import { unlockSessionManager } from '../../services/speech/UnlockSessionManager';
import { ReadingProgressTracker } from '../../services/speech/ReadingProgressTracker';

// Web Speech API interfaces
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}
interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: any) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
}

let cachedParagraph: string | null = null;
const repository: SpeechRepository = new SpeechRepositoryImpl();

export function useSpeechChallengeViewModel(onSuccess: () => void, onFailure: () => void) {
  const [words, setWords] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');

  const progressTracker = useRef(new ReadingProgressTracker()).current;
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSpokenIndexRef = useRef<number>(0);
  
  const loadParagraph = useCallback(async () => {
    if (!cachedParagraph) {
      cachedParagraph = await repository.getRandomParagraph();
    }
    progressTracker.initialize(cachedParagraph);
    setWords(progressTracker.getWords());
    setCurrentIndex(progressTracker.getCurrentIndex());
    lastSpokenIndexRef.current = 0;
    setError(null);
  }, [progressTracker]);

  useEffect(() => {
    loadParagraph();
  }, [loadParagraph]);

  const resetPauseTimer = useCallback(() => {
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
    }
    pauseTimerRef.current = setTimeout(() => {
      handleFailure("Paused for more than 5 seconds. Challenge restarted.");
    }, 5000);
  }, []);

  const clearPauseTimer = useCallback(() => {
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
  }, []);

  const handleFailure = useCallback((msg: string) => {
    clearPauseTimer();
    stopListening();
    setError(msg);
    progressTracker.reset();
    setCurrentIndex(progressTracker.getCurrentIndex());
    lastSpokenIndexRef.current = 0;
    onFailure();
  }, [clearPauseTimer, progressTracker, onFailure]);

  const handleSuccess = useCallback(() => {
    clearPauseTimer();
    stopListening();
    cachedParagraph = null; // Clear for next session
    unlockSessionManager.unlockFor(5);
    onSuccess();
  }, [clearPauseTimer, onSuccess]);

  const processSpeech = useCallback((transcript: string) => {
    const spokenWords = transcript.split(/\s+/).filter(w => w.length > 0);
    if (spokenWords.length === 0) return;

    let failed = false;

    // We only process new words from the transcript (interim results can accumulate)
    // To keep it simple, we just feed the transcript to the tracker.
    // The ReadingProgressTracker processes one word at a time.
    // To handle continuous/interim results safely without double counting,
    // we should process the transcript from scratch against the current expected word,
    // or keep track of how many words we've successfully processed in this chunk.
    // Let's reset the tracker to the last known good index before this transcript burst,
    // then process the whole transcript.
    progressTracker.setCurrentIndex(lastSpokenIndexRef.current);
    
    for (const spoken of spokenWords) {
      if (progressTracker.isComplete()) break;
      const success = progressTracker.processSpokenWord(spoken);
      if (!success) {
        failed = true;
        break;
      }
    }

    if (failed) {
      handleFailure("Words skipped or spoken out of order. Challenge restarted.");
    } else {
      const newIndex = progressTracker.getCurrentIndex();
      setCurrentIndex(newIndex);
      
      if (progressTracker.isComplete()) {
        handleSuccess();
      } else {
        resetPauseTimer();
      }
    }
  }, [progressTracker, handleFailure, handleSuccess, resetPauseTimer]);

  const startListening = useCallback(() => {
    if (isListening) return;
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported on this device.");
      setPermissionStatus('denied');
      setIsListening(false);
      return;
    }

    setError(null);
    lastSpokenIndexRef.current = progressTracker.getCurrentIndex();

    const recognition = new SpeechRecognition() as SpeechRecognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setPermissionStatus('granted');
      resetPauseTimer();
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      
      const transcript = finalTranscript || interimTranscript;
      processSpeech(transcript.trim());
      
      if (finalTranscript) {
        // Once final, update our base index
        lastSpokenIndexRef.current = progressTracker.getCurrentIndex();
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event);
      if (event.error === 'not-allowed') {
        setPermissionStatus('denied');
        setError("Microphone access denied. Cannot proceed without microphone.");
        setIsListening(false);
      } else {
        setError(`Speech error: ${event.error}. Challenge restarted.`);
        handleFailure(`Speech error: ${event.error}. Challenge restarted.`);
      }
    };

    recognition.onend = () => {
      if (permissionStatus === 'denied') return; // Do not auto-restart if denied/simulating
      setIsListening(false);
      clearPauseTimer();
      // If we stopped unexpectedly and not complete, we might want to restart
      if (!progressTracker.isComplete() && isListening) {
        // Auto-restart listening if it drops
        try {
          recognition.start();
        } catch(e) {}
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (e) {
      console.error("Failed to start recognition", e);
      setPermissionStatus('denied');
      setError("Microphone access failed.");
      setIsListening(false);
    }
  }, [isListening, permissionStatus, processSpeech, resetPauseTimer, clearPauseTimer, handleFailure, progressTracker]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    clearPauseTimer();
  }, [clearPauseTimer]);

  // Restart on exit
  useEffect(() => {
    return () => {
      stopListening();
      // Side effect: if unmounting and not complete, challenge is lost
    };
  }, [stopListening]);

  // Auto start
  useEffect(() => {
    if (!isListening && permissionStatus !== 'denied') {
      startListening();
    }
  }, [isListening, permissionStatus, startListening]);

  return {
    words,
    currentIndex,
    isListening,
    error,
    permissionStatus,
    startListening,
    stopListening,
    loadParagraph
  };
}

