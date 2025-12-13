'use client';

import { useState, useEffect } from 'react';
import { getResponse, saveResponse, deleteResponse } from '@/lib/responseStorage';
import { getAllViewedQuestions } from '@/lib/viewedQuestionsStorage';

interface QuestionItemProps {
  questionId: string;
  questionText: string;
  index: number;
}

export default function QuestionItem({ questionId, questionText, index }: QuestionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [response, setResponse] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [isViewed, setIsViewed] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setResponse(getResponse(questionId));
    const viewedQuestions = getAllViewedQuestions();
    setIsViewed(viewedQuestions.includes(questionId));
  }, [questionId]);

  const hasResponse = isClient && response.length > 0;

  const handleSaveResponse = () => {
    saveResponse(questionId, response);
  };

  const handleClearResponse = () => {
    deleteResponse(questionId);
    setResponse('');
  };

  return (
    <li className="bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <span className="font-medium text-slate-700 dark:text-slate-300 mr-2">
              {index + 1}.
            </span>
            <span className="text-slate-900 dark:text-slate-100">
              {questionText}
            </span>
          </div>
          <div className="flex items-center gap-2 ml-4">
            {isViewed && (
              <span className="text-lg" title="Viewed in practice mode">
                👀
              </span>
            )}
            {hasResponse && (
              <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                ✓ Answered
              </span>
            )}
            <span className="text-slate-400 dark:text-slate-500">
              {isExpanded ? '▲' : '▼'}
            </span>
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-slate-200 dark:border-slate-600 pt-4">
          <div className="flex justify-between items-center mb-2">
            <label 
              htmlFor={`response-${questionId}`}
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
            id={`response-${questionId}`}
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            onBlur={handleSaveResponse}
            placeholder="Type your answer here... (auto-saves)"
            className="w-full h-32 px-3 py-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-y"
          />
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            💾 Auto-saves when you finish typing
          </p>
        </div>
      )}
    </li>
  );
}
