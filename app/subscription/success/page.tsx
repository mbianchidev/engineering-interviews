"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
        Welcome to Premium!
      </h1>
      <p className="text-slate-600 dark:text-slate-300 mb-6">
        Your subscription is now active. You have full access to all premium features including expert-crafted sample answers for all interview questions.
      </p>
      
      {sessionId && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Session ID: {sessionId}
        </p>
      )}

      <div className="space-y-4">
        <Link
          href="/practice"
          className="w-full block px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Start Practicing →
        </Link>
        <Link
          href="/topics"
          className="w-full block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Browse Topics
        </Link>
        <Link
          href="/"
          className="w-full block px-8 py-4 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100 font-semibold rounded-xl transition-all duration-300"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
