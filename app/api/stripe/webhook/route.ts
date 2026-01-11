import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe, STRIPE_CONFIG } from "@/lib/stripe/config";
import { subscriptionStore } from "@/lib/auth/options";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_CONFIG.webhookSecret
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${errorMessage}`);
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerEmail = session.customer_email;
      
      if (customerEmail) {
        // Update subscription status
        subscriptionStore.set(customerEmail, {
          status: "active",
          customerId: session.customer as string,
        });
        console.log(`Subscription activated for ${customerEmail}`);
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      
      // Find customer email by customerId
      for (const [email, data] of subscriptionStore.entries()) {
        if (data.customerId === customerId) {
          subscriptionStore.set(email, {
            status: subscription.status,
            customerId,
          });
          console.log(`Subscription updated for ${email}: ${subscription.status}`);
          break;
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      
      // Find and update customer subscription status
      for (const [email, data] of subscriptionStore.entries()) {
        if (data.customerId === customerId) {
          subscriptionStore.set(email, {
            status: "canceled",
            customerId,
          });
          console.log(`Subscription canceled for ${email}`);
          break;
        }
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;
      
      // Find and update customer subscription status
      for (const [email, data] of subscriptionStore.entries()) {
        if (data.customerId === customerId) {
          subscriptionStore.set(email, {
            status: "past_due",
            customerId,
          });
          console.log(`Payment failed for ${email}`);
          break;
        }
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
