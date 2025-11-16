import Link from 'next/link';
import { parseReadme } from '@/lib/parseQuestions';

export default function TopicsPage() {
  const categories = parseReadme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-8">
          Browse Topics
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const totalQuestions = category.questions.length + 
              category.subcategories.reduce((sum, sub) => sum + sub.questions.length, 0);

            return (
              <Link
                key={category.id}
                href={`/topics/${category.id}`}
                className="group p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-500"
              >
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {category.name}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {totalQuestions} question{totalQuestions !== 1 ? 's' : ''}
                </p>
                {category.subcategories.length > 0 && (
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    {category.subcategories.length} subtopic{category.subcategories.length !== 1 ? 's' : ''}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
