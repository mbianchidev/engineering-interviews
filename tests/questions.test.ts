import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseReadme, getAllQuestions } from '../lib/parseQuestions';
import { allCategories, allQuestions } from '../lib/questionsData';

test('existing category routes and representative question IDs stay stable', () => {
  const categories = parseReadme();
  for (const id of ['general', 'devops-sre-and-platform-engineering', 'software-engineering']) {
    assert.ok(categories.some(category => category.id === id), `Missing existing category: ${id}`);
  }

  const ids = new Set(getAllQuestions().map(question => question.id));
  for (const id of [
    'what-is-the-difference-between-a-remote-branch-and-a-local-branch',
    'what-is-a-service-level-objective-slo',
    'explain-solid-principles',
    'what-is-the-difference-between-state-and-props-in-react',
  ]) {
    assert.ok(ids.has(id), `Saved responses must still resolve question: ${id}`);
  }
});

test('coding scenarios cover algorithms, concurrency, state, and infrastructure', () => {
  const category = parseReadme().find(category => category.id === 'coding-and-problem-solving');
  assert.ok(category, 'The coding question category must be available');
  for (const name of [
    'Strings and Algorithms',
    'Concurrency and Coordination',
    'APIs and State Machines',
    'Infrastructure Exercises',
  ]) {
    const subcategory = category.subcategories.find(subcategory => subcategory.name === name);
    assert.ok(subcategory, `Missing coding topic: ${name}`);
    assert.ok(subcategory.questions.length >= 10, `${name} must support a complete practice round`);
  }
});

test('observability topics each support a complete practice round', () => {
  const category = parseReadme().find(category => category.id === 'observability');
  assert.ok(category, 'The observability question category must be available');
  for (const name of [
    'OpenTelemetry',
    'Prometheus and PromQL',
    'Grafana and Dashboards',
    'Instrumentation and Telemetry Pipelines',
    'Latency and Performance',
  ]) {
    const subcategory = category.subcategories.find(subcategory => subcategory.name === name);
    assert.ok(subcategory, `Missing observability topic: ${name}`);
    assert.ok(subcategory.questions.length >= 12, `${name} needs practical scenario coverage`);
  }
});

test('SRE and platform engineering include deeper operational questions', () => {
  const category = parseReadme().find(category => category.id === 'devops-sre-and-platform-engineering');
  assert.ok(category);
  const sre = category.subcategories.find(subcategory => subcategory.name === 'Site Reliability Engineering');
  const platform = category.subcategories.find(subcategory => subcategory.name === 'Platform Engineering');
  assert.ok(sre && sre.questions.length >= 30);
  assert.ok(platform && platform.questions.length >= 20);
});

test('question IDs are unique and every question belongs to a valid topic', () => {
  const categories = parseReadme();
  const questions = getAllQuestions();
  assert.equal(new Set(categories.map(category => category.id)).size, categories.length);
  assert.equal(new Set(questions.map(question => question.id)).size, questions.length);

  for (const question of questions) {
    assert.match(question.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(question.text.trim().length > 0);
    const category = categories.find(category => category.name === question.category);
    assert.ok(category, `Unknown category for ${question.id}`);
    if (question.subcategory) {
      assert.ok(category.subcategories.some(subcategory => subcategory.name === question.subcategory));
    }
  }
});

test('generated client data matches the server-side question bank', () => {
  const normalize = (value: unknown) => JSON.parse(JSON.stringify(value));
  assert.deepEqual(allCategories, normalize(parseReadme()));
  assert.deepEqual(allQuestions, normalize(getAllQuestions()));
  assert.ok(allQuestions.length >= 366, 'The expanded bank must retain the original 210 questions');
});
