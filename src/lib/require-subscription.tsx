import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/lib/subscription";
import type { Plan } from "@/lib/plans";

/**
 * Gate for paid areas of the app.
 *
 * Like RequireAuth, this is a UI gate rather than a security boundary — the
 * data itself is protected by Row Level Security, and the subscriptions table
 * is writable only by the Stripe webhook's service role, so a user cannot grant
 * themselves a plan by any client-side means.
 *
 * Renders an upgrade prompt rather than redirecting, so the person can see what
 * they are missing and act on it in place.
 */
export function RequireSubscription({
  children,
  minimumPlan,
  feature,
}: {
  children: React.ReactNode;
  /** Omit to require any entitling plan. */
  minimumPlan?: Plan;
  /** Named in the upgrade prompt, e.g. "AI document analysis". */
  feature?: string;
}) {
  const { loading, entitled, hasPlan, plan } = useSubscription();

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
      </div>
    );
  }

  const allowed = minimumPlan ? hasPlan(minimumPlan) : entitled;
  if (allowed) return <>{children}</>;

  const needsUpgrade = entitled && minimumPlan;

  return (
    <div className="flex min-h-[40vh] items-center justify-center p-6">
      <div className="max-w-md rounded-lg border border-border bg-card p-8 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
          <Lock className="size-5 text-muted-foreground" aria-hidden="true" />
        </div>

        <h2 className="mt-4 text-lg font-semibold">
          {needsUpgrade ? "Upgrade to continue" : "Subscription required"}
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          {feature ? `${feature} is` : "This area is"}{" "}
          {needsUpgrade ? (
            <>
              part of the {minimumPlan} plan. Your organisation is currently on {plan}.
            </>
          ) : (
            <>available on any paid BuildFlow plan.</>
          )}
        </p>

        <Button asChild className="mt-6">
          <Link to="/app/settings">{needsUpgrade ? "See plans" : "Choose a plan"}</Link>
        </Button>
      </div>
    </div>
  );
}
