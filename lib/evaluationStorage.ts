// Utility functions for managing self-evaluations in local storage

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

// Get all evaluations from local storage
export function getAllEvaluations(): SelfEvaluation[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(EVALUATION_STORAGE_KEY);
    const data: EvaluationStorage = stored ? JSON.parse(stored) : { evaluations: [] };
    return data.evaluations || [];
  } catch (error) {
    console.error('Error reading evaluations from local storage:', error);
    return [];
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
    
    evaluations.push(newEvaluation);
    
    const data: EvaluationStorage = { evaluations };
    localStorage.setItem(EVALUATION_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving evaluation to local storage:', error);
  }
}

// Clear all evaluations
export function clearAllEvaluations(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(EVALUATION_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing evaluations from local storage:', error);
  }
}
