"use client";

import Link from "next/link";
import AuthStatus from "./AuthStatus";

export default function Header() {
  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link 
            href="/"
            className="text-xl font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Engineering Interviews
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/topics"
              className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors hidden sm:inline"
            >
              Topics
            </Link>
            <Link
              href="/practice"
              className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors hidden sm:inline"
            >
              Practice
            </Link>
            <AuthStatus />
          </nav>
        </div>
      </div>
    </header>
  );
}
