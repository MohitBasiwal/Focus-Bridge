import { Difficulty } from '../../domain/models/Security';
import { SecurityRepositoryImpl } from '../../data/repository/SecurityRepositoryImpl';

export class SecurityManager {
  private failedAttempts = 0;
  private pendingActionCallback: (() => void) | null = null;
  private pendingActionName: string | null = null;

  public getDifficulty(): Difficulty {
    if (this.failedAttempts >= 3) return 'Hard';
    if (this.failedAttempts >= 1) return 'Medium';
    return 'Easy';
  }

  public recordSuccess() {
    this.failedAttempts = 0;
  }

  public recordFailure() {
    this.failedAttempts++;
  }

  public setPendingAction(name: string, callback: () => void) {
    this.pendingActionName = name;
    this.pendingActionCallback = callback;
  }

  public executePendingAction() {
    if (this.pendingActionCallback) {
      this.pendingActionCallback();
    }
    this.clearPendingAction();
  }

  public clearPendingAction() {
    this.pendingActionCallback = null;
    this.pendingActionName = null;
  }
  
  public getPendingActionName() {
    return this.pendingActionName;
  }
}

export const securityManager = new SecurityManager();
