import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { isEntitled, planAtLeast, type Plan } from "@/lib/plans";

/**
 * Subscription state for the signed-in user's organisation.
 *
 * Reads `public.buildflow_subscriptions`, a security_invoker view over
 * `buildflow.subscriptions`. RLS restricts rows to the caller's org, and the
 * view deliberately omits Stripe identifiers — the client only needs to know
 * which plan is active and until when.
 *
 * Note this is a *convenience* gate. It decides what UI to render; it is not
 * what protects the data. Row Level Security does that, and it applies whether
 * or not this hook is consulted.
 */

export type SubscriptionRow = {
  id: string;
  org_id: string;
  plan: string;
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
};

export function useSubscription() {
  const { user, loading: authLoading } = useAuth();

  const query = useQuery({
    queryKey: ["subscription", user?.id],
    enabled: !!user,
    staleTime: 60_000,
    queryFn: async (): Promise<SubscriptionRow | null> => {
      const { data, error } = await supabase
        .from("buildflow_subscriptions")
        .select("id, org_id, plan, status, current_period_end, cancel_at_period_end")
        // Newest first, so a resubscribe supersedes an old cancelled row.
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return (data as SubscriptionRow | null) ?? null;
    },
  });

  const subscription = query.data ?? null;

  return {
    subscription,
    /** True while we genuinely do not know yet — used to avoid gate flicker. */
    loading: authLoading || query.isPending,
    entitled: isEntitled(subscription?.status),
    plan: subscription?.plan ?? null,
    /** e.g. hasPlan("professional") for "Professional or above". */
    hasPlan: (minimum: Plan) =>
      isEntitled(subscription?.status) && planAtLeast(subscription?.plan, minimum),
  };
}

/** Starts Stripe Checkout for a plan and redirects the browser to it. */
export async function startCheckout(plan: Plan): Promise<void> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Please sign in again to continue.");

  const res = await fetch("/api/billing/checkout", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ plan }),
  });

  const body = (await res.json().catch(() => ({}))) as { url?: string; error?: string };

  if (!res.ok || !body.url) {
    throw new Error(body.error ?? "Could not start checkout. Please try again.");
  }

  window.location.assign(body.url);
}
