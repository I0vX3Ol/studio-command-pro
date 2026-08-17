# Billing (Stripe)

Subscription billing for BuildFlow. Runs entirely on the Cloudflare Worker; the
browser never sees a key, a price id, or a Stripe API call.

## Endpoints

| Route | Method | Auth | Purpose |
| --- | --- | --- | --- |
| `/api/billing/checkout` | POST | Supabase access token (Bearer) | Creates a Stripe Checkout Session, returns `{ url }` |
| `/api/billing/webhook` | POST | Stripe signature | Updates `buildflow.subscriptions` |

Both are mounted from `src/server.ts`, ahead of the SSR router. TanStack Start
1.168 only exposes server logic through `createServerFn` RPC, which Stripe
cannot post to — it has its own wire protocol and would mangle the raw body that
signature verification depends on. The Worker `fetch` entry is the correct place
for plain HTTP endpoints, and it is also where `env` (and therefore the secrets)
is available.

## Required Worker bindings

Set as **GitHub Actions secrets**; `.github/workflows/deploy.yml` pushes them to
the Worker on every production deploy via `wrangler secret put`. They are never
committed and never inlined into the client (only `VITE_*` vars are).

| Binding | Secret? | Value |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | **yes** | `sk_live_…` from the Stripe dashboard |
| `STRIPE_WEBHOOK_SECRET` | **yes** | `whsec_…` from the webhook endpoint |
| `SUPABASE_SERVICE_ROLE_KEY` | **yes** | Supabase service role key — bypasses RLS |
| `SUPABASE_URL` | no | Reuses the existing `VITE_SUPABASE_URL` secret |
| `STRIPE_PRICE_STARTER` | no | `price_1U5Y7JQvnGDiWSOu1QnI1lKp` |
| `STRIPE_PRICE_PROFESSIONAL` | no | `price_1U5Y7cQvnGDiWSOuVg2fDUKN` |
| `STRIPE_PRICE_ENTERPRISE` | no | `price_1U5Y7zQvnGDiWSOuqLoY10we` |
| `APP_ORIGIN` | no | Set in the workflow to `https://buildflow.nexudel.com` |

For local development, copy `.dev.vars.example` to `.dev.vars` (gitignored).

## Stripe webhook setup

Point a webhook endpoint at `https://buildflow.nexudel.com/api/billing/webhook`
subscribed to exactly these events:

- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

Then copy its signing secret into the `STRIPE_WEBHOOK_SECRET` GitHub secret.

## Security model

**The database is the source of truth, and only Stripe can change it.**

- `buildflow.subscriptions` grants `authenticated` **SELECT only**, and has a
  SELECT-only RLS policy scoped to the caller's org. There is no INSERT/UPDATE
  path for a logged-in user, so nobody can grant themselves a paid plan.
- The webhook writes using the service role, which bypasses RLS.
- `public.buildflow_subscriptions` is a `security_invoker` view that omits the
  Stripe customer and subscription ids — the client only needs the plan, the
  status and the period end.
- The checkout endpoint accepts a **plan slug**, never a price id. Accepting a
  client-supplied price would let anyone subscribe at a price of their choosing.
- The org is resolved server-side from the verified access token, never taken
  from the request body.
- Webhook signatures are verified against the raw body with HMAC-SHA256 and a
  constant-time compare, with a 5-minute tolerance to block replay.
- `RequireSubscription` is a **UI gate**, not a security boundary. Row Level
  Security protects the data whether or not the component is rendered.

## Entitlement rules

`active`, `trialing` and `past_due` unlock paid features. `past_due` is
deliberately included: the card failed but Stripe is still retrying, and cutting
off access mid-dunning is a reliable way to turn a recoverable payment into a
cancellation. `canceled`, `unpaid` and `incomplete` do not entitle.

Plans are ranked `starter < professional < enterprise` so a route can require
"Professional or above" via `minimumPlan`.
