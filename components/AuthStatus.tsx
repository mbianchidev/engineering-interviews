"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2">
        <div className="animate-pulse bg-slate-200 dark:bg-slate-700 h-8 w-20 rounded-lg"></div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt={session.user.name || "User"}
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          <span className="text-sm text-slate-600 dark:text-slate-300 hidden sm:inline">
            {session.user?.name || session.user?.email}
          </span>
          {session.user?.isSubscribed && (
            <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full font-medium">
              Premium
            </span>
          )}
        </div>
        <Link
          href="/subscription"
          className="text-sm px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
        >
          {session.user?.isSubscribed ? "Manage" : "Upgrade"}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-sm px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => signIn()}
        className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
      >
        Sign In
      </button>
    </div>
  );
}
