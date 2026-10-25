import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';
import {
  saveResponse, getResponse, deleteResponse, clearAllResponses,
} from '../lib/responseStorage';
import {
  addViewedQuestion, getAllViewedQuestions, getViewedQuestionsCount, clearAllViewedQuestions,
} from '../lib/viewedQuestionsStorage';
import {
  saveEvaluation, getAllEvaluations, clearAllEvaluations,
} from '../lib/evaluationStorage';
import { subscribeToStorage } from '../lib/browserStorageEvents';

class MockStorage implements Storage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');

beforeEach(() => {
  Object.defineProperty(globalThis, 'window', { value: new EventTarget(), configurable: true });
  Object.defineProperty(globalThis, 'localStorage', { value: new MockStorage(), configurable: true });
});

afterEach(() => {
  if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow);
  else Reflect.deleteProperty(globalThis, 'window');
  if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage);
  else Reflect.deleteProperty(globalThis, 'localStorage');
});

test('responses retain the existing storage key and can be saved, edited, and cleared', () => {
  saveResponse('synthetic-question', 'A synthetic practice response');
  assert.equal(getResponse('synthetic-question'), 'A synthetic practice response');
  assert.ok(localStorage.getItem('interview-question-responses'));
  saveResponse('synthetic-question', 'An edited response');
  assert.equal(getResponse('synthetic-question'), 'An edited response');
  deleteResponse('synthetic-question');
  assert.equal(getResponse('synthetic-question'), '');
  saveResponse('another-synthetic-question', 'Another response');
  clearAllResponses();
  assert.equal(getResponse('another-synthetic-question'), '');
});

test('viewed question tracking counts unique questions and retains its storage key', () => {
  addViewedQuestion('synthetic-question');
  addViewedQuestion('synthetic-question');
  addViewedQuestion('another-synthetic-question');
  assert.equal(getViewedQuestionsCount(), 2);
  assert.deepEqual(getAllViewedQuestions(), ['synthetic-question', 'another-synthetic-question']);
  assert.ok(localStorage.getItem('interview-viewed-questions'));
  clearAllViewedQuestions();
  assert.equal(getViewedQuestionsCount(), 0);
});

test('round evaluations retain ratings, order, and the existing storage key', () => {
  saveEvaluation({ confidence: 2, effectiveness: 3, knowledge: 4 });
  saveEvaluation({ confidence: 4, effectiveness: 5, knowledge: 3 });
  const evaluations = getAllEvaluations();
  assert.equal(evaluations.length, 2);
  assert.equal(evaluations[0].roundNumber, 1);
  assert.equal(evaluations[1].roundNumber, 2);
  assert.equal(evaluations[0].confidence, 2);
  assert.equal(evaluations[1].effectiveness, 5);
  assert.ok(localStorage.getItem('interview-practice-evaluations'));
  clearAllEvaluations();
  assert.deepEqual(getAllEvaluations(), []);
});

test('evaluation snapshots stay stable until the stored data changes', () => {
  const empty = getAllEvaluations();
  assert.equal(getAllEvaluations(), empty);

  saveEvaluation({ confidence: 2, effectiveness: 3, knowledge: 4 });
  const saved = getAllEvaluations();
  assert.notEqual(saved, empty);
  assert.deepEqual(empty, []);
  assert.equal(getAllEvaluations(), saved);

  saveEvaluation({ confidence: 4, effectiveness: 5, knowledge: 3 });
  assert.equal(saved.length, 1);
  assert.equal(getAllEvaluations().length, 2);

  clearAllEvaluations();
  const cleared = getAllEvaluations();
  assert.deepEqual(cleared, []);
  assert.equal(getAllEvaluations(), cleared);
});

test('practice storage changes notify listeners in the same tab', t => {
  let changes = 0;
  const onChange = () => { changes++; };
  const unsubscribe = subscribeToStorage(onChange);
  t.after(unsubscribe);

  saveEvaluation({ confidence: 2, effectiveness: 3, knowledge: 4 });
  assert.equal(changes, 1);
  clearAllEvaluations();
  assert.equal(changes, 2);
  addViewedQuestion('synthetic-question');
  assert.equal(changes, 3);
  addViewedQuestion('synthetic-question');
  assert.equal(changes, 3);
  clearAllViewedQuestions();
  assert.equal(changes, 4);

  window.dispatchEvent(new Event('storage'));
  assert.equal(changes, 5);
  unsubscribe();
  saveEvaluation({ confidence: 4, effectiveness: 5, knowledge: 3 });
  window.dispatchEvent(new Event('storage'));
  assert.equal(changes, 5);
});
