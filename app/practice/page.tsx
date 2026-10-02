'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import PageHeader from '../components/PageHeader';
import Icon from '../components/Icon';
import { countCategoryQuestions } from '@/lib/topicPresentation';
import { allQuestions, allCategories } from '@/lib/questionsData';
import { saveResponse, deleteResponse, clearAllResponses } from '@/lib/responseStorage';
import { saveEvaluation, getAllEvaluations, clearAllEvaluations, SelfEvaluation } from '@/lib/evaluationStorage';
import { addViewedQuestion, getViewedQuestionsCount, clearAllViewedQuestions } from '@/lib/viewedQuestionsStorage';

interface Question {
  id: string;
  text: string;
  category: string;
  subcategory?: string;
}

const TIMER_DURATION = 300; // 5 minutes in seconds
const QUESTIONS_PER_ROUND = 10;
const MIN_QUESTIONS_TO_START = 10;

type PracticeMode = 'easy' | 'standard' | 'hard';

const modes = [
  { id: 'easy', label: 'Easy', icon: 'layers', description: 'No time limit' },
  { id: 'standard', label: 'Standard', icon: 'timer', description: 'Timer + extra time rolls over' },
  { id: 'hard', label: 'Hard', icon: 'spark', description: 'Timer only, no rollover' },
] as const;

const dimensions = [
  { key: 'confidence', label: 'Confidence', description: 'How comfortable were you explaining your thinking?' },
  { key: 'effectiveness', label: 'Effectiveness', description: 'How clearly did you get your point across?' },
  { key: 'knowledge', label: 'Knowledge', description: 'How well did you understand the topics?' },
] as const;

export default function PracticePage() {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [timer, setTimer] = useState(TIMER_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [usedQuestions, setUsedQuestions] = useState<Set<string>>(new Set());
  const [response, setResponse] = useState('');
  const [questionsInRound, setQuestionsInRound] = useState(0);
  const [extraTime, setExtraTime] = useState(0);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('standard');
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
  const [selectedSubtopics, setSelectedSubtopics] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const skipQuestionRef = useRef<(() => void) | null>(null);

  // Build a unique key for each subtopic
  const getSubtopicKey = (categoryId: string, subcategoryId: string | null) => {
    return subcategoryId ? `${categoryId}::${subcategoryId}` : `${categoryId}::__general__`;
  };

  // Filter questions based on selected subtopics
  const filteredQuestions = useMemo(() => {
    if (selectedSubtopics.size === 0) {
      return allQuestions;
    }

    return allQuestions.filter(question => {
      const category = allCategories.find(c => c.name === question.category);
      if (!category) return false;

      if (question.subcategory) {
        const subcategory = category.subcategories.find(s => s.name === question.subcategory);
        if (subcategory) {
          return selectedSubtopics.has(getSubtopicKey(category.id, subcategory.id));
        }
      } else {
        // General questions (no subcategory)
        return selectedSubtopics.has(getSubtopicKey(category.id, null));
      }
      return false;
    });
  }, [selectedSubtopics]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const toggleSubtopic = (categoryId: string, subcategoryId: string | null) => {
    const key = getSubtopicKey(categoryId, subcategoryId);
    setSelectedSubtopics(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const selectAllInCategory = (categoryId: string) => {
    const category = allCategories.find(c => c.id === categoryId);
    if (!category) return;

    setSelectedSubtopics(prev => {
      const next = new Set(prev);
      // Add general questions if any
      if (category.questions.length > 0) {
        next.add(getSubtopicKey(categoryId, null));
      }
      // Add all subcategories
      category.subcategories.forEach(sub => {
        next.add(getSubtopicKey(categoryId, sub.id));
      });
      return next;
    });
  };

  const deselectAllInCategory = (categoryId: string) => {
    const category = allCategories.find(c => c.id === categoryId);
    if (!category) return;

    setSelectedSubtopics(prev => {
      const next = new Set(prev);
      next.delete(getSubtopicKey(categoryId, null));
      category.subcategories.forEach(sub => {
        next.delete(getSubtopicKey(categoryId, sub.id));
      });
      return next;
    });
  };

  const isCategoryFullySelected = (categoryId: string) => {
    const category = allCategories.find(c => c.id === categoryId);
    if (!category) return false;

    let totalSubtopics = category.subcategories.length;
    if (category.questions.length > 0) totalSubtopics++;

    let selectedCount = 0;
    if (category.questions.length > 0 && selectedSubtopics.has(getSubtopicKey(categoryId, null))) {
      selectedCount++;
    }
    category.subcategories.forEach(sub => {
      if (selectedSubtopics.has(getSubtopicKey(categoryId, sub.id))) {
        selectedCount++;
      }
    });

    return selectedCount === totalSubtopics && totalSubtopics > 0;
  };

  const isCategoryPartiallySelected = (categoryId: string) => {
    const category = allCategories.find(c => c.id === categoryId);
    if (!category) return false;

    let selectedCount = 0;
    if (category.questions.length > 0 && selectedSubtopics.has(getSubtopicKey(categoryId, null))) {
      selectedCount++;
    }
    category.subcategories.forEach(sub => {
      if (selectedSubtopics.has(getSubtopicKey(categoryId, sub.id))) {
        selectedCount++;
      }
    });

    return selectedCount > 0 && !isCategoryFullySelected(categoryId);
  };

  const selectAll = () => {
    setSelectedSubtopics(() => {
      const next = new Set<string>();
      allCategories.forEach(category => {
        if (category.questions.length > 0) {
          next.add(getSubtopicKey(category.id, null));
        }
        category.subcategories.forEach(sub => {
          next.add(getSubtopicKey(category.id, sub.id));
        });
      });
      return next;
    });
  };

  const deselectAll = () => {
    setSelectedSubtopics(new Set());
  };

  // Load previous evaluations on mount
  useEffect(() => {
    setPreviousEvaluations(getAllEvaluations());
    setTotalViewedQuestions(getViewedQuestionsCount());
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    // Easy mode: no timer
    if (practiceMode === 'easy') {
      return;
    }

    if (isActive) {
      interval = setInterval(() => {
        // First, countdown the main timer
        if (timer > 0) {
          setTimer(seconds => seconds - 1);
        } 
        // When main timer reaches 0, start using extra time (only in standard mode)
        else if (extraTime > 0 && practiceMode === 'standard') {
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
  }, [isActive, timer, extraTime, practiceMode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getRandomQuestion = () => {
    if (filteredQuestions.length === 0) return;

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
    if (usedQuestions.size >= filteredQuestions.length) {
      setUsedQuestions(new Set());
    }

    // Find a question that hasn't been used
    const availableQuestions = filteredQuestions.filter(q => !usedQuestions.has(q.id));
    
    let newQuestion: Question;
    if (availableQuestions.length === 0) {
      // All questions used, reset and pick from all
      setUsedQuestions(new Set());
      const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
      newQuestion = filteredQuestions[randomIndex];
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

    // Add any remaining time to extra time pool (only in standard mode)
    if (timer > 0 && questionsInRound > 0 && practiceMode === 'standard') {
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
      clearAllViewedQuestions(); // Also clear viewed questions count
      setResponse('');
      setTotalViewedQuestions(0);
      alert('All responses and viewed questions have been cleared.');
    }
  };

  const handleClearEvaluations = () => {
    if (window.confirm('Are you sure you want to delete all your self-evaluations? This action cannot be undone.')) {
      clearAllEvaluations();
      setPreviousEvaluations([]);
      alert('All evaluations have been cleared.');
    }
  };

  return (
    <div className="page-width content-page practice-page">
      <PageHeader
        eyebrow="A little rehearsal goes a long way"
        title="Practice Mode"
        description={`Work through ${QUESTIONS_PER_ROUND} questions, one at a time. Choose your pace and topics, then take a moment to reflect on the round.`}
      />

      {showEvaluation ? (
        <section className="panel evaluation-panel">
          <div className="evaluation-heading">
            <span className="icon-tile"><Icon name="check" /></span>
            <h2>Round Complete!</h2>
            <p>You&apos;ve completed {QUESTIONS_PER_ROUND} questions. How did it go?</p>
          </div>
          <div className="rating-fields">
            {dimensions.map(({ key, label, description }) => (
              <fieldset key={key} className="rating-field">
                <legend>{label} (1-5){evaluation[key] === null && ' *'}</legend>
                <p>{description}</p>
                <div className="rating-options">
                  {[1, 2, 3, 4, 5].map(value => (
                    <button
                      key={value}
                      onClick={() => setEvaluation(prev => ({ ...prev, [key]: value }))}
                      className="rating-button"
                      aria-label={`${label}: ${value} of 5`}
                      aria-pressed={evaluation[key] === value}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
          <button onClick={handleSubmitEvaluation} className="button button-primary button-wide">
            Submit Evaluation &amp; Start New Round<Icon name="arrow" />
          </button>
          {dimensions.some(({ key }) => evaluation[key] === null) && (
            <p className="validation-note">* Please rate all three categories before submitting</p>
          )}
        </section>
      ) : !currentQuestion ? (
        <>
          <div className="practice-setup">
            <section className="panel">
              <div className="settings-heading">
                <div><h2>Select Practice Mode</h2><p>Same questions. A different kind of pressure.</p></div>
                <span className="tag">{QUESTIONS_PER_ROUND} questions / round</span>
              </div>
              <div className="mode-grid">
                {modes.map(({ id, label, icon, description }) => (
                  <button key={id} onClick={() => setPracticeMode(id)} className="mode-option" aria-pressed={practiceMode === id}>
                    <span className="mode-option-top"><Icon name={icon} />{practiceMode === id && <Icon name="check" />}</span>
                    <h3>{label}</h3>
                    <p>{description}</p>
                  </button>
                ))}
              </div>
            </section>

            <section className="panel">
              <div className="settings-heading">
                <div><h2>Select Topics to Practice</h2><p>Leave topics unselected to use the full question bank.</p></div>
                <div className="button-row">
                  <button onClick={selectAll} className="button button-secondary button-small">Select All</button>
                  <button onClick={deselectAll} className="button button-secondary button-small">Clear All</button>
                </div>
              </div>
              <div className="selection-summary" aria-live="polite">
                <p>{selectedSubtopics.size === 0
                  ? `All ${allQuestions.length} questions selected (no filter applied)`
                  : `${filteredQuestions.length} questions selected from ${selectedSubtopics.size} sub-topic${selectedSubtopics.size !== 1 ? 's' : ''}`}</p>
                {selectedSubtopics.size > 0 && filteredQuestions.length < MIN_QUESTIONS_TO_START && (
                  <p className="validation-note">Select at least {MIN_QUESTIONS_TO_START} questions to start practicing</p>
                )}
              </div>
              <div className="topic-selector">
                {allCategories.map(category => {
                  const isExpanded = expandedCategories.has(category.id);
                  const isFullySelected = isCategoryFullySelected(category.id);
                  const isPartiallySelected = isCategoryPartiallySelected(category.id);

                  return (
                    <div key={category.id} className="category-choice">
                      <div className="category-choice-heading">
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className="expand-category"
                          aria-expanded={isExpanded}
                          aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${category.name}`}
                        >
                          <Icon name="chevron" className={`chevron${isExpanded ? ' is-open' : ''}`} />
                        </button>
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={isFullySelected}
                            ref={el => { if (el) el.indeterminate = isPartiallySelected; }}
                            onChange={() => {
                              if (isFullySelected || isPartiallySelected) deselectAllInCategory(category.id);
                              else selectAllInCategory(category.id);
                            }}
                            aria-label={`Select all in ${category.name}`}
                          />
                          <span className="choice-name">{category.name}</span>
                          <span className="choice-count">{countCategoryQuestions(category)} questions</span>
                        </label>
                      </div>
                      {isExpanded && (
                        <div className="subcategory-choices">
                          {category.questions.length > 0 && (
                            <label className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={selectedSubtopics.has(getSubtopicKey(category.id, null))}
                                onChange={() => toggleSubtopic(category.id, null)}
                                aria-label={`Select General Questions in ${category.name}`}
                              />
                              <span className="choice-name">General Questions</span>
                              <span className="choice-count">{category.questions.length}</span>
                            </label>
                          )}
                          {category.subcategories.map(subcategory => (
                            <label key={subcategory.id} className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={selectedSubtopics.has(getSubtopicKey(category.id, subcategory.id))}
                                onChange={() => toggleSubtopic(category.id, subcategory.id)}
                                aria-label={`Select ${subcategory.name}`}
                              />
                              <span className="choice-name">{subcategory.name}</span>
                              <span className="choice-count">{subcategory.questions.length}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="setup-actions">
              <button
                onClick={handleStartNewRound}
                disabled={selectedSubtopics.size > 0 && filteredQuestions.length < MIN_QUESTIONS_TO_START}
                className="button button-primary"
              >
                Start Practicing<Icon name="arrow" />
              </button>
              <button onClick={handleClearAllResponses} className="button button-danger">Clear All Responses</button>
            </div>
          </div>

          {previousEvaluations.length > 0 && (
            <section className="history-section">
              <div className="history-toolbar">
                <button
                  onClick={() => setShowPreviousEvaluations(!showPreviousEvaluations)}
                  className="text-button"
                  aria-expanded={showPreviousEvaluations}
                >
                  {showPreviousEvaluations ? 'Hide ' : ''}Previous Evaluations ({previousEvaluations.length})
                </button>
                {showPreviousEvaluations && (
                  <button onClick={handleClearEvaluations} className="button button-danger button-small">Clear All Evaluations</button>
                )}
              </div>
              {showPreviousEvaluations && (
                <div className="history-list">
                  {previousEvaluations.slice().reverse().map(evalItem => (
                    <article key={evalItem.timestamp} className="panel">
                      <div className="history-heading">
                        <h3>Round {evalItem.roundNumber}</h3>
                        <time dateTime={new Date(evalItem.timestamp).toISOString()}>
                          {new Date(evalItem.timestamp).toLocaleDateString()} {new Date(evalItem.timestamp).toLocaleTimeString()}
                        </time>
                      </div>
                      <div className="evaluation-stats">
                        {dimensions.map(({ key, label }) => (
                          <div key={key}><p>{label}</p><strong>{evalItem[key]}</strong><span>/5</span></div>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}
        </>
      ) : (
        <div className="active-practice">
          <section className="panel">
            <div className="round-heading">
              <div>
                <div className="question-context">
                  <span className="tag tag-accent">{currentQuestion.subcategory || currentQuestion.category}</span>
                  {currentQuestion.subcategory && <span className="tag">{currentQuestion.category}</span>}
                </div>
                <p className="round-position">Question {questionsInRound} / {QUESTIONS_PER_ROUND}</p>
                <progress className="round-progress" value={questionsInRound} max={QUESTIONS_PER_ROUND} aria-label="Round progress" />
              </div>
              <div className="timer">
                {practiceMode === 'easy' ? (
                  <><p className="timer-value">∞</p><p className="timer-label">No time limit</p></>
                ) : (
                  <>
                    <p className={`timer-value${timer === 0 && extraTime > 0 ? ' timer-extra' : timer <= 60 && extraTime === 0 ? ' timer-low' : ''}`}>
                      {formatTime(timer === 0 && extraTime > 0 ? extraTime : timer)}
                    </p>
                    <p className="timer-label">Time remaining</p>
                    {timer > 0 && extraTime > 0 && practiceMode === 'standard' && (
                      <p className="extra-time">+{formatTime(extraTime)} extra time available</p>
                    )}
                  </>
                )}
              </div>
            </div>
            <h2 className="active-question">{currentQuestion.text}</h2>
            <div className="practice-response">
              <div className="field-heading">
                <label htmlFor="response">Your Response:</label>
                {response.trim() && (
                  <button onClick={handleClearResponse} className="button button-danger button-small">Clear Response</button>
                )}
              </div>
              <textarea
                id="response"
                value={response}
                onChange={e => setResponse(e.target.value)}
                onBlur={handleSaveResponse}
                placeholder="Type your answer here... (auto-saves)"
                className="response-input"
              />
              <p className="field-note">Saved in this browser when you leave the text box or switch questions.</p>
            </div>
          </section>
          <div className="button-row practice-actions">
            <button onClick={skipQuestion} className="button button-secondary">Skip</button>
            <button onClick={skipQuestion} className="button button-primary">Next Question<Icon name="arrow" /></button>
          </div>
          <p className="progress-note">Progress: {totalViewedQuestions} / {allQuestions.length} questions viewed</p>
        </div>
      )}
    </div>
  );
}
