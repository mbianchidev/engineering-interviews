// Utility functions for managing self-evaluations in local storage

import { notifyStorageChange } from './browserStorageEvents';

const EVALUATION_STORAGE_KEY = 'interview-practice-evaluations';

export interface SelfEvaluation {
  confidence: number; // 1-5 scale
  effectiveness: number; // 1-5 scale
  knowledge: number; // 1-5 scale
  timestamp: number;
  roundNumber: number;
}

export interface EvaluationStorage {
  evaluations: SelfEvaluation[];
}

const EMPTY_EVALUATIONS: SelfEvaluation[] = [];
// External-store snapshots must retain their identity until storage changes.
let cachedStored: string | null | undefined;
let cachedEvaluations = EMPTY_EVALUATIONS;

// Get all evaluations from local storage
export function getAllEvaluations(): SelfEvaluation[] {
  if (typeof window === 'undefined') return EMPTY_EVALUATIONS;
  
  try {
    const stored = localStorage.getItem(EVALUATION_STORAGE_KEY);
    if (stored === cachedStored) return cachedEvaluations;
    const data: EvaluationStorage = stored ? JSON.parse(stored) : { evaluations: [] };
    cachedEvaluations = data.evaluations || EMPTY_EVALUATIONS;
    cachedStored = stored;
    return cachedEvaluations;
  } catch (error) {
    console.error('Error reading evaluations from local storage:', error);
    return EMPTY_EVALUATIONS;
  }
}

// Save a new evaluation
export function saveEvaluation(evaluation: Omit<SelfEvaluation, 'timestamp' | 'roundNumber'>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const evaluations = getAllEvaluations();
    const roundNumber = evaluations.length + 1;
    
    const newEvaluation: SelfEvaluation = {
      ...evaluation,
      timestamp: Date.now(),
      roundNumber,
    };
    
    const data: EvaluationStorage = { evaluations: [...evaluations, newEvaluation] };
    localStorage.setItem(EVALUATION_STORAGE_KEY, JSON.stringify(data));
    notifyStorageChange();
  } catch (error) {
    console.error('Error saving evaluation to local storage:', error);
  }
}

// Clear all evaluations
export function clearAllEvaluations(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(EVALUATION_STORAGE_KEY);
    notifyStorageChange();
  } catch (error) {
    console.error('Error clearing evaluations from local storage:', error);
  }
}
