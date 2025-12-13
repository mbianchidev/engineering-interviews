// Utility functions for tracking all viewed questions across sessions

const VIEWED_QUESTIONS_KEY = 'interview-viewed-questions';

export interface ViewedQuestionsStorage {
  questionIds: string[];
}

// Get all viewed question IDs from local storage
export function getAllViewedQuestions(): string[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(VIEWED_QUESTIONS_KEY);
    const data: ViewedQuestionsStorage = stored ? JSON.parse(stored) : { questionIds: [] };
    return data.questionIds || [];
  } catch (error) {
    console.error('Error reading viewed questions from local storage:', error);
    return [];
  }
}

// Add a question to the viewed list (if not already there)
export function addViewedQuestion(questionId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const viewedQuestions = getAllViewedQuestions();
    
    // Only add if not already in the list
    if (!viewedQuestions.includes(questionId)) {
      viewedQuestions.push(questionId);
      const data: ViewedQuestionsStorage = { questionIds: viewedQuestions };
      localStorage.setItem(VIEWED_QUESTIONS_KEY, JSON.stringify(data));
    }
  } catch (error) {
    console.error('Error saving viewed question to local storage:', error);
  }
}

// Get count of unique viewed questions
export function getViewedQuestionsCount(): number {
  return getAllViewedQuestions().length;
}

// Clear all viewed questions
export function clearAllViewedQuestions(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(VIEWED_QUESTIONS_KEY);
  } catch (error) {
    console.error('Error clearing viewed questions from local storage:', error);
  }
}
