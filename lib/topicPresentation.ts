import type { IconName } from '../app/components/Icon';
import type { Category } from './parseQuestions';

const presentation: Record<string, { icon: IconName; description: string; label: string }> = {
  general: {
    icon: 'code',
    label: 'Fundamentals',
    description: 'The foundations: Git, networking, Linux, and virtualization.',
  },
  'devops-sre-and-platform-engineering': {
    icon: 'layers',
    label: 'Platforms & reliability',
    description: 'Build, ship, and operate systems. From containers to incident response.',
  },
  'software-engineering': {
    icon: 'code',
    label: 'Software engineering',
    description: 'APIs, data, architecture, and the frontend. Explain the choices behind your code.',
  },
  observability: {
    icon: 'activity',
    label: 'Observability',
    description: 'Follow the signals. OpenTelemetry, Prometheus, Grafana, and the long tail.',
  },
  'coding-and-problem-solving': {
    icon: 'spark',
    label: 'Coding & problem solving',
    description: 'Reason through algorithms, concurrency, state machines, and infrastructure exercises.',
  },
};

export function getTopicPresentation(id: string) {
  return presentation[id] ?? {
    icon: 'layers' as const,
    label: 'Engineering',
    description: 'Explore the questions and work through your reasoning.',
  };
}

export function countCategoryQuestions(category: Category): number {
  return category.questions.length +
    category.subcategories.reduce((sum, subcategory) => sum + subcategory.questions.length, 0);
}
