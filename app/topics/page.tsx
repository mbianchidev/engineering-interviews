import Link from 'next/link';
import { parseReadme } from '@/lib/parseQuestions';
import { countCategoryQuestions, getTopicPresentation } from '@/lib/topicPresentation';
import PageHeader from '../components/PageHeader';
import Icon from '../components/Icon';

export default function TopicsPage() {
  const categories = parseReadme();

  return (
    <div className="page-width content-page">
      <PageHeader
        eyebrow="The question bank"
        title="Browse Topics"
        description="Start with what you know. Spend a little longer on what you don't. Each topic has open-ended questions, not answer keys."
      />
      <div className="topic-grid">
        {categories.map(category => {
          const totalQuestions = countCategoryQuestions(category);
          const { icon, description } = getTopicPresentation(category.id);

          return (
            <Link key={category.id} href={`/topics/${category.id}`} className="topic-card">
              <div className="topic-card-heading">
                <span className="icon-tile"><Icon name={icon} /></span>
                <Icon name="diagonal" className="topic-arrow" />
              </div>
              <h2>{category.name}</h2>
              <p>{description}</p>
              <div className="topic-card-meta">
                <span><strong>{totalQuestions}</strong> question{totalQuestions !== 1 ? 's' : ''}</span>
                {category.subcategories.length > 0 && (
                  <span>{category.subcategories.length} subtopic{category.subcategories.length !== 1 ? 's' : ''}</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
