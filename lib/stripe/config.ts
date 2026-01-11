import Stripe from "stripe";

// Server-side Stripe client - lazily initialized
// This prevents build errors when STRIPE_SECRET_KEY is not set
let stripeInstance: Stripe | null = null;

export function getStripeServer(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    stripeInstance = new Stripe(secretKey, {
      apiVersion: "2025-11-17.clover",
      typescript: true,
    });
  }
  return stripeInstance;
}

// For backwards compatibility - will throw if not configured
export const stripe = {
  get checkout() { return getStripeServer().checkout; },
  get billingPortal() { return getStripeServer().billingPortal; },
  get webhooks() { return getStripeServer().webhooks; },
};

// Stripe configuration
export const STRIPE_CONFIG = {
  // Price ID for monthly subscription (set in environment variables)
  monthlyPriceId: process.env.STRIPE_MONTHLY_PRICE_ID ?? "",
  // Success and cancel URLs for Checkout
  successUrl: `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/subscription/success`,
  cancelUrl: `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/subscription/cancel`,
  // Webhook secret for verifying Stripe events
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
};

// Test card numbers for development (Stripe test mode)
// These cards can be used when Stripe is in test mode
export const TEST_CARDS = {
  success: "4242424242424242", // Successful payment
  decline: "4000000000000002", // Card declined
  insufficientFunds: "4000000000009995", // Insufficient funds
  expiredCard: "4000000000000069", // Expired card
  authenticationRequired: "4000002500003155", // Requires authentication
};

// Format amount for display (cents to dollars)
export function formatAmount(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
