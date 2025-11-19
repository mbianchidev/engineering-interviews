'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { allQuestions } from '@/lib/questionsData';
import { getResponse, saveResponse, deleteResponse } from '@/lib/responseStorage';

interface Question {
  id: string;
  text: string;
  category: string;
  subcategory?: string;
}

export default function PracticePage() {
  const [questions] = useState<Question[]>(allQuestions);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [usedQuestions, setUsedQuestions] = useState<Set<string>>(new Set());
  const [response, setResponse] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setTimer((seconds) => seconds + 1);
      }, 1000);
    } else if (!isActive && timer !== 0) {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getRandomQuestion = () => {
    if (questions.length === 0) return;

    // Save current response before switching questions (only if not empty)
    if (currentQuestion && response.trim()) {
      saveResponse(currentQuestion.id, response);
    }

    // If all questions have been used, reset
    if (usedQuestions.size >= questions.length) {
      setUsedQuestions(new Set());
    }

    // Find a question that hasn't been used
    const availableQuestions = questions.filter(q => !usedQuestions.has(q.id));
    
    if (availableQuestions.length === 0) {
      // All questions used, reset and pick from all
      setUsedQuestions(new Set());
      const randomIndex = Math.floor(Math.random() * questions.length);
      const newQuestion = questions[randomIndex];
      setCurrentQuestion(newQuestion);
      setUsedQuestions(new Set([newQuestion.id]));
      setResponse(''); // Clear the text box for new question
    } else {
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      const newQuestion = availableQuestions[randomIndex];
      setCurrentQuestion(newQuestion);
      setUsedQuestions(prev => new Set([...prev, newQuestion.id]));
      setResponse(''); // Clear the text box for new question
    }

    setTimer(0);
    setIsActive(true);
  };

  const skipQuestion = () => {
    // Save current response before skipping (only if not empty)
    if (currentQuestion && response.trim()) {
      saveResponse(currentQuestion.id, response);
    }
    getRandomQuestion();
  };

  const handleSaveResponse = () => {
    if (currentQuestion) {
      saveResponse(currentQuestion.id, response);
    }
  };

  const handleClearResponse = () => {
    if (currentQuestion) {
      deleteResponse(currentQuestion.id);
      setResponse('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-8 text-center">
          Practice Mode
        </h1>

        {!currentQuestion ? (
          <div className="text-center space-y-8">
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Test your knowledge with random questions. A timer will start when you begin.
            </p>
            <button
              onClick={getRandomQuestion}
              disabled={questions.length === 0}
              className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Practicing
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium mb-2">
                    {currentQuestion.subcategory || currentQuestion.category}
                  </span>
                  {currentQuestion.subcategory && (
                    <span className="inline-block ml-2 px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-xs">
                      {currentQuestion.category}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-slate-900 dark:text-slate-100 font-mono">
                    {formatTime(timer)}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Time elapsed
                  </div>
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <p className="text-2xl text-slate-900 dark:text-slate-100 leading-relaxed">
                  {currentQuestion.text}
                </p>
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <label 
                    htmlFor="response" 
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Your Response:
                  </label>
                  {response.trim() && (
                    <button
                      onClick={handleClearResponse}
                      className="text-xs px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800 rounded transition-colors"
                    >
                      Clear Response
                    </button>
                  )}
                </div>
                <textarea
                  id="response"
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  onBlur={handleSaveResponse}
                  placeholder="Type your answer here... (auto-saves)"
                  className="w-full h-48 px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-y"
                />
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  💾 Your response is automatically saved to local storage when you type or switch questions
                </p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={skipQuestion}
                className="px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100 font-semibold rounded-lg transition-colors"
              >
                Skip Question →
              </button>
            </div>

            <div className="text-center text-sm text-slate-500 dark:text-slate-400">
              Progress: {usedQuestions.size} / {questions.length} questions viewed
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
