'use client';

import { useState, useSyncExternalStore } from 'react';
import { getResponse, saveResponse, deleteResponse } from '@/lib/responseStorage';
import { getAllViewedQuestions } from '@/lib/viewedQuestionsStorage';
import Icon from '../../components/Icon';

interface QuestionItemProps {
  questionId: string;
  questionText: string;
  index: number;
}

function subscribeToStorage(onChange: () => void) {
  window.addEventListener('storage', onChange);
  return () => window.removeEventListener('storage', onChange);
}

export default function QuestionItem({ questionId, questionText, index }: QuestionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const savedResponse = useSyncExternalStore(subscribeToStorage, () => getResponse(questionId), () => '');
  const isViewed = useSyncExternalStore(
    subscribeToStorage, () => getAllViewedQuestions().includes(questionId), () => false,
  );
  const [draft, setDraft] = useState<string | null>(null);
  const response = draft ?? savedResponse;
  const hasResponse = response.length > 0;

  const handleSaveResponse = () => {
    saveResponse(questionId, response);
  };

  const handleClearResponse = () => {
    deleteResponse(questionId);
    setDraft('');
  };

  return (
    <li className={`question-item${isExpanded ? ' is-expanded' : ''}`}>
      <button
        type="button"
        className="question-trigger"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls={`answer-${questionId}`}
      >
        <span className="question-number">{String(index + 1).padStart(2, '0')}</span>
        <span className="question-text">
          {questionText}
          {(isViewed || hasResponse) && (
            <span className="question-badges">
              {isViewed && <span className="status-badge" title="Viewed in practice mode">Viewed</span>}
              {hasResponse && <span className="status-badge status-answered"><Icon name="check" />Answered</span>}
            </span>
          )}
        </span>
        <Icon name="chevron" className={isExpanded ? 'chevron is-open' : 'chevron'} />
      </button>
      <div id={`answer-${questionId}`} hidden={!isExpanded} className="response-panel">
        <div className="field-heading">
          <label htmlFor={`response-${questionId}`}>Your Response:</label>
          {response.trim() && (
            <button onClick={handleClearResponse} className="button button-danger button-small">Clear Response</button>
          )}
        </div>
        <textarea
          id={`response-${questionId}`}
          value={response}
          onChange={e => setDraft(e.target.value)}
          onBlur={handleSaveResponse}
          placeholder="Type your answer here... (auto-saves)"
          className="response-input"
        />
        <p className="field-note">Auto-saves when you leave the text box. Stored only in this browser.</p>
      </div>
    </li>
  );
}
