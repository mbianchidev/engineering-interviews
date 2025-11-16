import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Engineering Interview Practice
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Prepare for your next technical interview with curated questions across various engineering topics.
          </p>

          <div className="pt-8 grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link
              href="/topics"
              className="group p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-500"
            >
              <div className="text-4xl mb-4">📚</div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Browse by Topic
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Explore questions organized by categories like DevOps, Backend, Frontend, and more.
              </p>
            </Link>

            <Link
              href="/practice"
              className="group p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-500"
            >
              <div className="text-4xl mb-4">🎯</div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Start Practicing
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Get random questions and practice with a timer to simulate real interview conditions.
              </p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
