// Utility functions for managing question responses in local storage

const STORAGE_KEY = 'interview-question-responses';

export interface QuestionResponse {
  questionId: string;
  response: string;
  timestamp: number;
}

export interface ResponseStorage {
  [questionId: string]: QuestionResponse;
}

// Get all responses from local storage
export function getAllResponses(): ResponseStorage {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error reading from local storage:', error);
    return {};
  }
}

// Get response for a specific question
export function getResponse(questionId: string): string {
  const responses = getAllResponses();
  return responses[questionId]?.response || '';
}

// Save response for a specific question
export function saveResponse(questionId: string, response: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const responses = getAllResponses();
    responses[questionId] = {
      questionId,
      response,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
  } catch (error) {
    console.error('Error saving to local storage:', error);
  }
}

// Delete response for a specific question
export function deleteResponse(questionId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const responses = getAllResponses();
    delete responses[questionId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
  } catch (error) {
    console.error('Error deleting from local storage:', error);
  }
}

// Clear all responses
export function clearAllResponses(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing local storage:', error);
  }
}
