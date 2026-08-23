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
/**
 * Intended card-statement descriptor for this app.
 *
 * Not sent with the Checkout Session: Stripe does not accept
 * `subscription_data.statement_descriptor` and rejects the whole request
 * if you try. For subscriptions this must be configured on the Stripe
 * Product instead. Kept here as the single source of truth for what that
 * value should be.
 */
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

/**
 * Display copy for each plan — the single source for both the public pricing
 * section and the in-app billing panel.
 *
 * Shared deliberately: when these lived only in the billing panel, the
 * marketing site showed no prices at all, and any future edit would have had to
 * be made in two places for them to agree. The `price` strings are display only
 * — the amount actually charged always comes from the Stripe price id
 * configured on the Worker, never from anything the browser holds.
 */
export const PLAN_COPY: Record<
  Plan,
  { name: string; price: string; seats: string; tagline: string; features: string[] }
> = {
  starter: {
    name: "Starter",
    price: "$149",
    seats: "Up to 5 seats",
    tagline: "For small crews running a handful of jobs at a time.",
    features: [
      "Projects and scheduling",
      "CRM and customers",
      "Invoicing and expenses",
      "Daily logs and punch lists",
      "Email support",
    ],
  },
  professional: {
    name: "Professional",
    price: "$299",
    seats: "Up to 25 seats",
    tagline: "For contractors who need estimating and change orders under control.",
    features: [
      "Everything in Starter",
      "Estimating and revisions",
      "Change orders",
      "Equipment and service logs",
      "Financials and analytics",
    ],
  },
  enterprise: {
    name: "Enterprise",
    price: "$599",
    seats: "Unlimited seats",
    tagline: "For multi-crew businesses that need integrations and audit trails.",
    features: [
      "Everything in Professional",
      "Integrations",
      "API access",
      "Audit logs",
      "Dedicated onboarding",
    ],
  },
};
