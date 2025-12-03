"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TEST_CARDS } from "@/lib/stripe/config";

export default function SubscriptionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showTestCards, setShowTestCards] = useState(false);

  const handleSubscribe = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
      });
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned");
        alert("Failed to start checkout. Please try again.");
      }
    } catch (error) {
      console.error("Error starting checkout:", error);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No portal URL returned");
        alert("Failed to open subscription management. Please try again.");
      }
    } catch (error) {
      console.error("Error opening portal:", error);
      alert("Failed to open subscription management. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isSubscribed = session?.user?.isSubscribed;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-8 text-center">
          {isSubscribed ? "Manage Subscription" : "Upgrade to Premium"}
        </h1>

        {status === "loading" ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-300">Loading...</p>
          </div>
        ) : isSubscribed ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              You&apos;re a Premium Member!
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              You have full access to all question responses and premium features.
            </p>
            <button
              onClick={handleManageSubscription}
              disabled={isLoading}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isLoading ? "Loading..." : "Manage Subscription"}
            </button>
          </div>
        ) : (
          <div className="max-w-xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Premium Access</h2>
                <div className="text-5xl font-bold text-white mb-1">
                  $9.99<span className="text-lg font-normal">/month</span>
                </div>
                <p className="text-blue-100">Cancel anytime</p>
              </div>

              <div className="p-8">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-slate-700 dark:text-slate-300">
                    <span className="text-green-500 mr-3">✓</span>
                    Access to all question responses
                  </li>
                  <li className="flex items-center text-slate-700 dark:text-slate-300">
                    <span className="text-green-500 mr-3">✓</span>
                    Expert-crafted sample answers
                  </li>
                  <li className="flex items-center text-slate-700 dark:text-slate-300">
                    <span className="text-green-500 mr-3">✓</span>
                    Unlimited practice sessions
                  </li>
                  <li className="flex items-center text-slate-700 dark:text-slate-300">
                    <span className="text-green-500 mr-3">✓</span>
                    Progress tracking
                  </li>
                  <li className="flex items-center text-slate-700 dark:text-slate-300">
                    <span className="text-green-500 mr-3">✓</span>
                    New questions added regularly
                  </li>
                </ul>

                {session ? (
                  <button
                    onClick={handleSubscribe}
                    disabled={isLoading}
                    className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                  >
                    {isLoading ? "Loading..." : "Subscribe Now"}
                  </button>
                ) : (
                  <Link
                    href="/auth/signin"
                    className="w-full block text-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                  >
                    Sign In to Subscribe
                  </Link>
                )}

                <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
                  Secure payment powered by Stripe
                </p>
              </div>
            </div>

            {/* Test Cards Section for Development */}
            <div className="mt-8 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6">
              <button
                onClick={() => setShowTestCards(!showTestCards)}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center">
                  <span className="text-amber-600 dark:text-amber-400 text-xl mr-3">🧪</span>
                  <span className="font-medium text-amber-800 dark:text-amber-200">
                    Testing Mode - Test Card Numbers
                  </span>
                </div>
                <span className="text-amber-600 dark:text-amber-400">
                  {showTestCards ? "▼" : "▶"}
                </span>
              </button>
              
              {showTestCards && (
                <div className="mt-4 space-y-3 text-sm">
                  <p className="text-amber-700 dark:text-amber-300 mb-3">
                    Use these test card numbers during checkout (any future expiry date and any 3-digit CVC):
                  </p>
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Successful payment:</span>
                      <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{TEST_CARDS.success}</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Card declined:</span>
                      <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{TEST_CARDS.decline}</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Insufficient funds:</span>
                      <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{TEST_CARDS.insufficientFunds}</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">3D Secure required:</span>
                      <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{TEST_CARDS.authenticationRequired}</code>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
