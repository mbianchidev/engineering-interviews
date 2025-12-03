"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "There is a problem with the server configuration. Please contact support.";
      case "AccessDenied":
        return "Access was denied. You may not have permission to sign in.";
      case "Verification":
        return "The verification token has expired or has already been used.";
      case "OAuthSignin":
        return "Error occurred during OAuth sign in. Please try again.";
      case "OAuthCallback":
        return "Error occurred during OAuth callback. Please try again.";
      case "OAuthCreateAccount":
        return "Could not create OAuth account. Please try again.";
      case "EmailCreateAccount":
        return "Could not create email account. Please try again.";
      case "Callback":
        return "Error during callback. Please try again.";
      case "OAuthAccountNotLinked":
        return "This email is already associated with another account.";
      case "EmailSignin":
        return "Error sending email. Please try again.";
      case "CredentialsSignin":
        return "Invalid credentials. Please check your email and password.";
      case "SessionRequired":
        return "Please sign in to access this page.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Authentication Error
        </h1>
        <p className="text-red-600 dark:text-red-400">
          {getErrorMessage(error)}
        </p>
      </div>

      <div className="space-y-4">
        <Link
          href="/auth/signin"
          className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200"
        >
          Try Again
        </Link>
        <Link
          href="/"
          className="w-full flex items-center justify-center px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100 rounded-lg font-medium transition-all duration-200"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <ErrorContent />
        </Suspense>
      </div>
    </div>
  );
}
