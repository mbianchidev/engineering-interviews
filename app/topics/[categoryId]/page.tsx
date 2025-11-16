import Link from 'next/link';
import { parseReadme } from '@/lib/parseQuestions';
import { notFound } from 'next/navigation';

export default async function CategoryPage({ params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = await params;
  const categories = parseReadme();
  const category = categories.find(c => c.id === categoryId);

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link 
            href="/topics"
            className="inline-flex items-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            ← Back to Topics
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-8">
          {category.name}
        </h1>

        <div className="space-y-8">
          {category.questions.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                General Questions
              </h2>
              <ul className="space-y-3">
                {category.questions.map((question, index) => (
                  <li
                    key={question.id}
                    className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                  >
                    <span className="font-medium text-slate-700 dark:text-slate-300 mr-2">
                      {index + 1}.
                    </span>
                    <span className="text-slate-900 dark:text-slate-100">
                      {question.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {category.subcategories.map((subcategory) => (
            <div 
              key={subcategory.id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6"
            >
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                {subcategory.name}
              </h2>
              <ul className="space-y-3">
                {subcategory.questions.map((question, index) => (
                  <li
                    key={question.id}
                    className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                  >
                    <span className="font-medium text-slate-700 dark:text-slate-300 mr-2">
                      {index + 1}.
                    </span>
                    <span className="text-slate-900 dark:text-slate-100">
                      {question.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
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
