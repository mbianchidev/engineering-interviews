import type { NextAuthOptions, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

// Extend the Session type to include subscription info
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      isSubscribed: boolean;
      subscriptionStatus?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    isSubscribed: boolean;
    subscriptionStatus?: string;
  }
}

// In-memory store for subscription status (in production, use a database)
// This is a simple implementation for demo purposes
export const subscriptionStore = new Map<string, { status: string; customerId?: string }>();

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],
  callbacks: {
    async jwt({ token, user }): Promise<JWT> {
      if (user) {
        token.id = user.id;
      }
      // Check subscription status from store
      const subscription = subscriptionStore.get(token.email ?? "");
      token.isSubscribed = subscription?.status === "active";
      token.subscriptionStatus = subscription?.status;
      return token;
    },
    async session({ session, token }): Promise<Session> {
      if (session.user) {
        session.user.id = token.id;
        session.user.isSubscribed = token.isSubscribed;
        session.user.subscriptionStatus = token.subscriptionStatus;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
