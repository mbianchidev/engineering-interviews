import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, subscriptionStore } from "@/lib/auth/options";
import { stripe } from "@/lib/stripe/config";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "You must be signed in" },
        { status: 401 }
      );
    }

    // Get customer ID from subscription store
    const subscription = subscriptionStore.get(session.user.email);
    
    if (!subscription?.customerId) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 400 }
      );
    }

    // Create Stripe billing portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.customerId,
      return_url: `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/subscription`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Error creating portal session:", error);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}
