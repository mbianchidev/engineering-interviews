import { parseReadme } from '@/lib/parseQuestions';
import { notFound } from 'next/navigation';
import { countCategoryQuestions, getTopicPresentation } from '@/lib/topicPresentation';
import PageHeader from '../../components/PageHeader';
import QuestionItem from './QuestionItem';

export default async function CategoryPage({ params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = await params;
  const categories = parseReadme();
  const category = categories.find(c => c.id === categoryId);

  if (!category) {
    notFound();
  }

  return (
    <div className="page-width content-page reading-width">
      <PageHeader
        eyebrow="Go a little deeper"
        title={category.name}
        description={getTopicPresentation(category.id).description}
        backHref="/topics"
        backLabel="Back to Topics"
      />
      <div className="category-summary">
        <span className="tag">{countCategoryQuestions(category)} questions</span>
        <p>Open a question to write your response. It stays in this browser.</p>
      </div>
      <div className="question-sections">
        {category.questions.length > 0 && (
          <section className="topic-section">
            <div className="section-heading">
              <h2>General Questions</h2>
              <span className="section-count">{category.questions.length} questions</span>
            </div>
            <ul className="question-list">
              {category.questions.map((question, index) => (
                <QuestionItem key={question.id} questionId={question.id} questionText={question.text} index={index} />
              ))}
            </ul>
          </section>
        )}
        {category.subcategories.map(subcategory => (
          <section key={subcategory.id} className="topic-section">
            <div className="section-heading">
              <h2>{subcategory.name}</h2>
              <span className="section-count">{subcategory.questions.length} questions</span>
            </div>
            <ul className="question-list">
              {subcategory.questions.map((question, index) => (
                <QuestionItem key={question.id} questionId={question.id} questionText={question.text} index={index} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

export function generateStaticParams() {
  const categories = parseReadme();
  return categories.map((category) => ({
    categoryId: category.id,
  }));
}
