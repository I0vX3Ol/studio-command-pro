/**
 * Server-side plan → Stripe price mapping.
 *
 * Price ids come from the Worker env rather than source, so the same build can
 * point at test-mode prices without a code change, and nothing price-related
 * ever reaches the client bundle.
 *
 * Live price ids (Stripe account acct_1U5VNTQvnGDiWSOu):
 *   starter       price_1U5Y7JQvnGDiWSOu1QnI1lKp   $149/mo
 *   professional  price_1U5Y7cQvnGDiWSOuVg2fDUKN   $299/mo
 *   enterprise    price_1U5Y7zQvnGDiWSOuqLoY10we   $599/mo
 *
 * The pure catalogue (slugs, ranks, entitling statuses) lives in
 * `src/lib/plans.ts` because the client needs it too.
 */

import type { Plan } from "@/lib/plans";

export type PlanEnv = {
  STRIPE_PRICE_STARTER?: string;
  STRIPE_PRICE_PROFESSIONAL?: string;
  STRIPE_PRICE_ENTERPRISE?: string;
};

/** Maps a requested plan to its configured Stripe price id. */
export function priceIdForPlan(env: PlanEnv, plan: Plan): string | undefined {
  switch (plan) {
    case "starter":
      return env.STRIPE_PRICE_STARTER;
    case "professional":
      return env.STRIPE_PRICE_PROFESSIONAL;
    case "enterprise":
      return env.STRIPE_PRICE_ENTERPRISE;
  }
}

/** Reverse lookup, so the webhook can record which plan was bought. */
export function planForPriceId(env: PlanEnv, priceId: string | undefined): Plan | undefined {
  if (!priceId) return undefined;
  if (priceId === env.STRIPE_PRICE_STARTER) return "starter";
  if (priceId === env.STRIPE_PRICE_PROFESSIONAL) return "professional";
  if (priceId === env.STRIPE_PRICE_ENTERPRISE) return "enterprise";
  return undefined;
}
