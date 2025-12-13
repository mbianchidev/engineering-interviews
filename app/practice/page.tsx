'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { allQuestions } from '@/lib/questionsData';
import { saveResponse, deleteResponse, clearAllResponses } from '@/lib/responseStorage';
import { saveEvaluation, getAllEvaluations, SelfEvaluation } from '@/lib/evaluationStorage';
import { addViewedQuestion, getViewedQuestionsCount } from '@/lib/viewedQuestionsStorage';

interface Question {
  id: string;
  text: string;
  category: string;
  subcategory?: string;
}

const TIMER_DURATION = 300; // 5 minutes in seconds
const QUESTIONS_PER_ROUND = 10;

export default function PracticePage() {
  const [questions] = useState<Question[]>(allQuestions);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [timer, setTimer] = useState(TIMER_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [usedQuestions, setUsedQuestions] = useState<Set<string>>(new Set());
  const [response, setResponse] = useState('');
  const [questionsInRound, setQuestionsInRound] = useState(0);
  const [extraTime, setExtraTime] = useState(0);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [evaluation, setEvaluation] = useState<{
    confidence: number | null;
    effectiveness: number | null;
    knowledge: number | null;
  }>({
    confidence: null,
    effectiveness: null,
    knowledge: null,
  });
  const [previousEvaluations, setPreviousEvaluations] = useState<SelfEvaluation[]>([]);
  const [showPreviousEvaluations, setShowPreviousEvaluations] = useState(false);
  const [totalViewedQuestions, setTotalViewedQuestions] = useState(0);

  const skipQuestionRef = useRef<(() => void) | null>(null);

  // Load previous evaluations on mount
  useEffect(() => {
    setPreviousEvaluations(getAllEvaluations());
    setTotalViewedQuestions(getViewedQuestionsCount());
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        // First, countdown the main timer
        if (timer > 0) {
          setTimer(seconds => seconds - 1);
        } 
        // When main timer reaches 0, start using extra time
        else if (extraTime > 0) {
          setExtraTime(prev => prev - 1);
        }
        // When both are 0, auto-skip
        else {
          if (skipQuestionRef.current) {
            skipQuestionRef.current();
          }
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timer, extraTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getRandomQuestion = () => {
    if (questions.length === 0) return;

    // Check if we've completed a round
    if (questionsInRound >= QUESTIONS_PER_ROUND) {
      setShowEvaluation(true);
      setIsActive(false);
      return;
    }

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
    
    let newQuestion: Question;
    if (availableQuestions.length === 0) {
      // All questions used, reset and pick from all
      setUsedQuestions(new Set());
      const randomIndex = Math.floor(Math.random() * questions.length);
      newQuestion = questions[randomIndex];
      setUsedQuestions(new Set([newQuestion.id]));
    } else {
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      newQuestion = availableQuestions[randomIndex];
      setUsedQuestions(prev => new Set([...prev, newQuestion.id]));
    }

    // Clear the text box for new question
    setResponse('');

    // Track that this question has been viewed (for lifetime stats)
    addViewedQuestion(newQuestion.id);
    setTotalViewedQuestions(getViewedQuestionsCount());
    
    setCurrentQuestion(newQuestion);

    // Add any remaining time to extra time pool (only count time from base timer)
    if (timer > 0 && questionsInRound > 0) {
      setExtraTime(prev => prev + timer);
    }
    
    // Always reset timer to standard duration
    setTimer(TIMER_DURATION);
    setIsActive(true);
    setQuestionsInRound(prev => prev + 1);
  };

  const skipQuestion = () => {
    // Save current response before skipping (only if not empty)
    if (currentQuestion && response.trim()) {
      saveResponse(currentQuestion.id, response);
    }
    getRandomQuestion();
  };

  // Update ref whenever skipQuestion changes
  useEffect(() => {
    skipQuestionRef.current = skipQuestion;
  });

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

  const handleSubmitEvaluation = () => {
    // Validate that all evaluations are filled
    if (evaluation.confidence === null || evaluation.effectiveness === null || evaluation.knowledge === null) {
      alert('Please rate all three categories before submitting.');
      return;
    }

    saveEvaluation({
      confidence: evaluation.confidence,
      effectiveness: evaluation.effectiveness,
      knowledge: evaluation.knowledge,
    });
    
    // Reload evaluations to show the new one
    setPreviousEvaluations(getAllEvaluations());
    
    // Reset for new round
    setShowEvaluation(false);
    setQuestionsInRound(0);
    setExtraTime(0);
    setUsedQuestions(new Set());
    setCurrentQuestion(null);
    setTimer(TIMER_DURATION);
    setIsActive(false);
    setEvaluation({
      confidence: null,
      effectiveness: null,
      knowledge: null,
    });
  };

  const handleStartNewRound = () => {
    setQuestionsInRound(0);
    setExtraTime(0);
    setUsedQuestions(new Set());
    getRandomQuestion();
  };

  const handleClearAllResponses = () => {
    if (window.confirm('Are you sure you want to delete all your recorded answers? This action cannot be undone.')) {
      clearAllResponses();
      setResponse('');
      alert('All responses have been cleared.');
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

        {showEvaluation ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 text-center">
              Round Complete! 🎉
            </h2>
            <p className="text-center text-slate-600 dark:text-slate-300">
              You&apos;ve completed {QUESTIONS_PER_ROUND} questions. Please evaluate yourself:
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Confidence (1-5) {evaluation.confidence === null && <span className="text-red-600 dark:text-red-400">*</span>}
                </label>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      onClick={() => setEvaluation(prev => ({ ...prev, confidence: val }))}
                      className={`w-12 h-12 rounded-lg font-semibold transition-all ${
                        evaluation.confidence === val
                          ? 'bg-blue-600 text-white scale-110'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Effectiveness (1-5) {evaluation.effectiveness === null && <span className="text-red-600 dark:text-red-400">*</span>}
                </label>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      onClick={() => setEvaluation(prev => ({ ...prev, effectiveness: val }))}
                      className={`w-12 h-12 rounded-lg font-semibold transition-all ${
                        evaluation.effectiveness === val
                          ? 'bg-green-600 text-white scale-110'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Knowledge (1-5) {evaluation.knowledge === null && <span className="text-red-600 dark:text-red-400">*</span>}
                </label>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      onClick={() => setEvaluation(prev => ({ ...prev, knowledge: val }))}
                      className={`w-12 h-12 rounded-lg font-semibold transition-all ${
                        evaluation.knowledge === val
                          ? 'bg-purple-600 text-white scale-110'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmitEvaluation}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Submit Evaluation & Start New Round
            </button>
            {(evaluation.confidence === null || evaluation.effectiveness === null || evaluation.knowledge === null) && (
              <p className="text-sm text-red-600 dark:text-red-400 text-center">
                * Please rate all three categories before submitting
              </p>
            )}
          </div>
        ) : !currentQuestion ? (
          <div className="text-center space-y-8">
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Test your knowledge with random questions. Each round has {QUESTIONS_PER_ROUND} questions with 5 minutes per question.
            </p>
            <p className="text-md text-slate-500 dark:text-slate-400">
              Finish questions early? Your extra time rolls over to the next question!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleStartNewRound}
                disabled={questions.length === 0}
                className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Practicing
              </button>
              
              <button
                onClick={handleClearAllResponses}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Clear All Responses
              </button>
            </div>

            {previousEvaluations.length > 0 && (
              <div className="mt-8">
                <button
                  onClick={() => setShowPreviousEvaluations(!showPreviousEvaluations)}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  {showPreviousEvaluations ? '▼ Hide' : '▶'} Previous Evaluations ({previousEvaluations.length})
                </button>
                
                {showPreviousEvaluations && (
                  <div className="mt-4 space-y-4 max-w-3xl mx-auto">
                    {previousEvaluations.slice().reverse().map((evalItem) => (
                      <div 
                        key={evalItem.timestamp}
                        className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 text-left"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                            Round {evalItem.roundNumber}
                          </h3>
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            {new Date(evalItem.timestamp).toLocaleDateString()} {new Date(evalItem.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Confidence</p>
                            <div className="flex items-center">
                              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{evalItem.confidence}</span>
                              <span className="text-sm text-slate-500 dark:text-slate-500 ml-1">/5</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Effectiveness</p>
                            <div className="flex items-center">
                              <span className="text-2xl font-bold text-green-600 dark:text-green-400">{evalItem.effectiveness}</span>
                              <span className="text-sm text-slate-500 dark:text-slate-500 ml-1">/5</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Knowledge</p>
                            <div className="flex items-center">
                              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{evalItem.knowledge}</span>
                              <span className="text-sm text-slate-500 dark:text-slate-500 ml-1">/5</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
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
                  <div className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                    Question {questionsInRound} / {QUESTIONS_PER_ROUND}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-bold font-mono ${
                    timer === 0 && extraTime > 0 
                      ? 'text-green-600 dark:text-green-400'  // Green when using extra time
                      : timer <= 60 && extraTime === 0 
                        ? 'text-red-600 dark:text-red-400'  // Red when low and no extra time
                        : 'text-slate-900 dark:text-slate-100'  // Normal color
                  }`}>
                    {formatTime(timer === 0 && extraTime > 0 ? extraTime : timer)}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Time remaining
                  </div>
                  {timer > 0 && extraTime > 0 && (
                    <div className="text-sm text-green-600 dark:text-green-400 mt-1 font-semibold">
                      +{formatTime(extraTime)} extra time available
                    </div>
                  )}
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
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100 text-sm font-medium rounded-lg transition-colors"
              >
                Skip
              </button>
              <button
                onClick={skipQuestion}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                Next Question →
              </button>
            </div>

            <div className="text-center text-sm text-slate-500 dark:text-slate-400">
              Progress: {totalViewedQuestions} / {questions.length} questions viewed
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
