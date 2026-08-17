/**
 * BuildFlow plan catalogue — safe for the client bundle.
 *
 * Contains only slugs, ordering and entitlement rules. The mapping from a plan
 * to its Stripe price id lives in `src/server/billing/plans.ts` and is read
 * from the Worker env, so no price id or key is ever shipped to the browser.
 *
 * TanStack Start's import-protection plugin blocks `src/server/**` from client
 * code, which is why this split exists rather than one shared module.
 */

export const APP_KEY = "buildflow" as const;

/** Appended after the account's "NEXUDEL" prefix on card statements. */
export const STATEMENT_DESCRIPTOR_SUFFIX = "BUILDFLOW";

export const PLANS = ["starter", "professional", "enterprise"] as const;
export type Plan = (typeof PLANS)[number];

export function isPlan(value: string): value is Plan {
  return (PLANS as readonly string[]).includes(value);
}

/**
 * Subscription statuses that should unlock paid features.
 *
 * `trialing` counts. `past_due` deliberately counts too: the card failed but
 * Stripe is still retrying, and locking someone out of the product they are
 * mid-way through paying for is a good way to guarantee they churn. `unpaid`
 * and `canceled` do not.
 */
export const ENTITLING_STATUSES = ["active", "trialing", "past_due"] as const;

export function isEntitled(status: string | null | undefined): boolean {
  return !!status && (ENTITLING_STATUSES as readonly string[]).includes(status);
}

/** Plan ordering, for "requires Professional or above" style checks. */
const RANK: Record<Plan, number> = { starter: 1, professional: 2, enterprise: 3 };

export function planAtLeast(plan: string | null | undefined, minimum: Plan): boolean {
  if (!plan || !isPlan(plan)) return false;
  return RANK[plan] >= RANK[minimum];
}
