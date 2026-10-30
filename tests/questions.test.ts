import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { parseQuestionBank, getAllQuestions, type Subcategory } from '../lib/parseQuestions';
import { allCategories, allQuestions } from '../lib/questionsData';
import { getTopicPresentation } from '../lib/topicPresentation';

test('question parsing uses legacy.md independently of the README landing page', t => {
  const readFile = t.mock.method(fs, 'readFileSync', () => [
    '# Intro',
    '- Ignore this introduction',
    '# Synthetic category',
    '## Synthetic subtopic',
    '- How would you test a synthetic service?',
    '# Outro',
    '- Ignore this closing question',
  ].join('\n'));

  assert.deepEqual(parseQuestionBank(), [{
    id: 'synthetic-category',
    name: 'Synthetic category',
    questions: [],
    subcategories: [{
      id: 'synthetic-subtopic',
      name: 'Synthetic subtopic',
      questions: [{
        id: 'how-would-you-test-a-synthetic-service',
        text: 'How would you test a synthetic service?',
        category: 'Synthetic category',
        subcategory: 'Synthetic subtopic',
      }],
    }],
  }]);
  assert.deepEqual(readFile.mock.calls.map(call => call.arguments[0]), [
    path.join(process.cwd(), 'legacy.md'),
  ]);
});

test('existing category routes and representative question IDs stay stable', () => {
  const categories = parseQuestionBank();
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

test('system design includes complete scenarios and an open-ended video starting point', () => {
  const category = parseQuestionBank().find(category => category.id === 'system-design');
  assert.ok(category, 'The system design category must be available');
  assert.equal(category.name, 'System Design');
  assert.equal(getTopicPresentation(category.id).label, 'System design');

  for (const text of [
    'Design a service where organizers publish events and customers browse them, check availability, and buy tickets. Organizers should be able to manage their events and track sales. Most events receive steady traffic, but a popular release can attract many buyers at once. Decide what the first version should support, explain your assumptions, and shape the system around them. Discuss how you would balance a smooth buying experience, accurate availability, reliability, and cost.',
    'Design a service that lets customers track deliveries handled by different shipping companies. Customers should see a package’s current status and history, and receive notifications about important changes. Support teams also need enough information to investigate delivery problems. Shipping partners vary in how quickly and reliably they provide updates. Define what you would promise customers, then explain how you would organize the service and handle growth without making the initial design unnecessarily complicated.',
    'Design an online store where customers browse and search for products, check prices and availability, add items to a cart, place orders, and track their purchases. Store staff need to manage the catalog, inventory, and orders. The store usually receives steady traffic, but promotions can cause sudden spikes. Prices and stock levels can change while customers are shopping. Decide what the first version should support and clarify your assumptions about scale and business rules. Explain how you would organize the service, how information moves through it, and the tradeoffs between customer experience, accuracy, reliability, and cost. Describe what you would deliberately keep simple and what might need to change as the business grows. Follow-up to introduce during the mock: A payment succeeds, but checkout times out before the customer receives confirmation. They try again. What should happen, and how would you investigate if they report a problem?',
    'Design a YouTube-style video service. Start with only a client, a video element, and a PostgreSQL database. Enrich this starting point with the components and connections you consider necessary. Decide what the first version should support, clarify your assumptions, and explain how your design works and the tradeoffs behind your choices.',
  ]) {
    assert.ok(
      category.questions.some(question => question.text === text),
      `Missing complete system design case: ${text}`,
    );
  }
});

test('coding scenarios cover algorithms, concurrency, state, and infrastructure', () => {
  const category = parseQuestionBank().find(category => category.id === 'coding-and-problem-solving');
  assert.ok(category, 'The coding question category must be available');
  for (const name of [
    'Strings and Algorithms',
    'Concurrency and Coordination',
    'APIs and State Machines',
    'Infrastructure Exercises',
  ]) {
    const subcategory: Subcategory | undefined = category.subcategories.find(subcategory => subcategory.name === name);
    assert.ok(subcategory, `Missing coding topic: ${name}`);
    assert.ok(subcategory.questions.length >= 10, `${name} must support a complete practice round`);
  }
});

test('observability topics each support a complete practice round', () => {
  const category = parseQuestionBank().find(category => category.id === 'observability');
  assert.ok(category, 'The observability question category must be available');
  for (const name of [
    'OpenTelemetry',
    'Prometheus and PromQL',
    'Grafana and Dashboards',
    'Instrumentation and Telemetry Pipelines',
    'Latency and Performance',
  ]) {
    const subcategory: Subcategory | undefined = category.subcategories.find(subcategory => subcategory.name === name);
    assert.ok(subcategory, `Missing observability topic: ${name}`);
    assert.ok(subcategory.questions.length >= 12, `${name} needs practical scenario coverage`);
  }
});

test('retail observability challenge is available in topic browsing and practice', () => {
  const text = 'A growing retail startup sells inexpensive, everyday products online. Customers are reporting service slowdowns, and the engineering team is starting an OpenTelemetry project to improve visibility and performance. The team is growing quickly, and onboarding new engineers is a challenge. Its stack includes Java, Node.js, PostgreSQL, Apache Kafka, and a self-hosted three-node Kubernetes cluster, with Grafana, Jaeger, and the ELK stack for observability. It needs a robust, future-proof SaaS solution to manage its OpenTelemetry data, prioritizing open standards, excellent usability, competitive pricing, and data security. Design an OpenTelemetry-based observability approach to investigate service slowdowns across this stack. Explain how it would fit the existing environment and how you would evaluate a SaaS solution against the requirements. Discuss the trade-offs, including what you would keep or replace in the current setup and how new engineers would get started.';
  const category = parseQuestionBank().find(category => category.id === 'observability');
  const subcategory = category?.subcategories.find(subcategory => subcategory.id === 'opentelemetry');
  const question = subcategory?.questions.find(question => question.text === text);

  assert.ok(question, 'The complete engineering challenge must appear on the Observability topic page');
  assert.equal(question.category, 'Observability');
  assert.equal(question.subcategory, 'OpenTelemetry');
  assert.deepEqual(
    allQuestions.find(candidate => candidate.id === question.id),
    question,
    'Practice rounds must use the same complete challenge as topic browsing',
  );
});

test('SRE and platform engineering include deeper operational questions', () => {
  const category = parseQuestionBank().find(category => category.id === 'devops-sre-and-platform-engineering');
  assert.ok(category);
  const sre = category.subcategories.find(subcategory => subcategory.name === 'Site Reliability Engineering');
  const platform = category.subcategories.find(subcategory => subcategory.name === 'Platform Engineering');
  assert.ok(sre && sre.questions.length >= 30);
  assert.ok(platform && platform.questions.length >= 20);
});

test('question IDs are unique and every question belongs to a valid topic', () => {
  const categories = parseQuestionBank();
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
  assert.deepEqual(allCategories, normalize(parseQuestionBank()));
  assert.deepEqual(allQuestions, normalize(getAllQuestions()));
  assert.ok(allQuestions.length >= 366, 'The expanded bank must retain the original 210 questions');
});
