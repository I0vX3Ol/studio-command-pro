import { useState } from "react";
import { Check, ExternalLink, Loader2 } from "lucide-react";
import { Section } from "@/components/shell/primitives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  cancelSubscription,
  openBillingPortal,
  resumeSubscription,
  startCheckout,
  useCheckoutReturn,
  useSubscription,
} from "@/lib/subscription";
import { PLANS, type Plan } from "@/lib/plans";

/**
 * Plan selection and current subscription state.
 *
 * Prices here are display copy only — the amount actually charged comes from
 * the Stripe price id configured on the Worker. The checkout endpoint takes a
 * plan slug and looks the price up server-side, so the browser can never
 * influence what it is billed.
 */

const PLAN_COPY: Record<Plan, { name: string; price: string; seats: string; features: string[] }> =
  {
    starter: {
      name: "Starter",
      price: "$149",
      seats: "Up to 5 seats",
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
      features: [
        "Everything in Professional",
        "Integrations",
        "API access",
        "Audit logs",
        "Dedicated onboarding",
      ],
    },
  };

const STATUS_LABEL: Record<string, string> = {
  active: "Active",
  trialing: "Trial",
  past_due: "Payment overdue",
  canceled: "Cancelled",
  unpaid: "Unpaid",
  incomplete: "Incomplete",
};

export function BillingPanel() {
  const { subscription, loading, entitled, plan } = useSubscription();
  const { settling } = useCheckoutReturn();
  const [pending, setPending] = useState<Plan | null>(null);
  const [busy, setBusy] = useState<"cancel" | "resume" | "portal" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const run = async (kind: "cancel" | "resume" | "portal") => {
    setError(null);
    setNotice(null);
    setBusy(kind);
    try {
      if (kind === "portal") {
        await openBillingPortal();
        return;
      }
      if (kind === "cancel") {
        await cancelSubscription();
        setNotice("Your plan will end when the current period does. You keep access until then.");
      } else {
        await resumeSubscription();
        setNotice("Your subscription will continue as normal.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(null);
    }
  };

  const onSubscribe = async (next: Plan) => {
    setError(null);
    setPending(next);
    try {
      await startCheckout(next);
      // startCheckout navigates away on success.
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start checkout.");
      setPending(null);
    }
  };

  return (
    <>
      <Section title="Current plan">
        {loading ? (
          <p className="text-sm text-muted-foreground">Checking your subscription…</p>
        ) : subscription ? (
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={entitled ? "default" : "secondary"}>
              {STATUS_LABEL[subscription.status] ?? subscription.status}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {PLAN_COPY[plan as Plan]?.name ?? plan}
            </span>
            {subscription.current_period_end && (
              <span className="text-sm text-muted-foreground">
                · {subscription.cancel_at_period_end ? "ends" : "renews"}{" "}
                <time dateTime={subscription.current_period_end}>
                  {new Date(subscription.current_period_end).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </span>
            )}
            {subscription.status === "past_due" && (
              <p className="w-full text-sm text-muted-foreground">
                We could not take the last payment. Your access stays on while Stripe retries.
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No active subscription. Choose a plan below to unlock BuildFlow.
          </p>
        )}

        {settling && (
          <p role="status" className="mt-3 text-sm text-muted-foreground">
            Payment received — activating your subscription. This usually takes a few seconds.
          </p>
        )}

        {notice && (
          <p role="status" className="mt-3 text-sm font-medium">
            {notice}
          </p>
        )}

        {entitled && subscription && (
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="rounded-xl"
              disabled={busy !== null}
              onClick={() => run("portal")}
            >
              {busy === "portal" ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Opening…
                </>
              ) : (
                "Manage payment method"
              )}
            </Button>

            {subscription.cancel_at_period_end ? (
              <Button
                variant="outline"
                className="rounded-xl"
                disabled={busy !== null}
                onClick={() => run("resume")}
              >
                {busy === "resume" ? "Resuming…" : "Resume subscription"}
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="rounded-xl"
                disabled={busy !== null}
                onClick={() => run("cancel")}
              >
                {busy === "cancel" ? "Cancelling…" : "Cancel subscription"}
              </Button>
            )}
          </div>
        )}
      </Section>

      <Section title="Plans">
        {error && (
          <p role="alert" className="mb-4 text-sm font-medium text-destructive">
            {error}
          </p>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          {PLANS.map((key) => {
            const copy = PLAN_COPY[key];
            const isCurrent = entitled && plan === key;

            return (
              <div key={key} className="flex flex-col rounded-xl border border-border p-5">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-semibold">{copy.name}</h3>
                  {isCurrent && <Badge variant="outline">Current</Badge>}
                </div>

                <p className="mt-2">
                  <span className="text-2xl font-semibold">{copy.price}</span>
                  <span className="text-sm text-muted-foreground"> / month</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{copy.seats}</p>

                <ul className="mt-4 flex-1 space-y-2">
                  {copy.features.map((feature) => (
                    <li key={feature} className="flex gap-2 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="mt-5 w-full rounded-xl"
                  variant={isCurrent ? "outline" : "default"}
                  disabled={isCurrent || pending !== null || loading}
                  onClick={() => onSubscribe(key)}
                >
                  {pending === key ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                      Redirecting…
                    </>
                  ) : isCurrent ? (
                    "Current plan"
                  ) : (
                    <>
                      {entitled ? "Switch to" : "Choose"} {copy.name}
                      <ExternalLink className="size-4" aria-hidden="true" />
                    </>
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Payments are handled by Stripe — we never see your card details. Charges appear on your
          statement as <strong>NEXUDEL* BUILDFLOW</strong>.
        </p>
      </Section>
    </>
  );
}
