import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Calculator,
  ChartNoAxesColumn,
  HardHat,
  Receipt,
  Shield,
  Sparkles,
  Truck,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BuildFlow AI — The operating system for construction" },
      {
        name: "description",
        content:
          "Estimating, CRM, project management, equipment, and financials in one AI-native platform built for construction teams.",
      },
      { property: "og:title", content: "BuildFlow AI — The operating system for construction" },
      {
        property: "og:description",
        content:
          "Estimating, CRM, project management, equipment, and financials in one AI-native platform built for construction teams.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: Calculator,
    title: "AI estimating",
    desc: "Drop in a blueprint set and get a defensible labor, material, and risk-scored estimate in minutes.",
  },
  {
    icon: HardHat,
    title: "Project execution",
    desc: "Kanban, Gantt, daily logs, punch lists, and change orders that stay in sync with the field.",
  },
  {
    icon: Users,
    title: "CRM built for bids",
    desc: "Pipeline, call and email history, files, and AI-written account summaries.",
  },
  {
    icon: Receipt,
    title: "Financial control",
    desc: "Invoices, AR/AP, purchase orders, budgets, and a live cash-flow picture.",
  },
  {
    icon: Truck,
    title: "Fleet & equipment",
    desc: "Utilization, maintenance schedules, fuel, and inspection reminders per asset.",
  },
  {
    icon: ChartNoAxesColumn,
    title: "Analytics & forecasting",
    desc: "Win rate, margin trend, productivity, and revenue scenarios you can plan against.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="glass sticky top-0 z-30 border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-6">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" aria-hidden />
          </div>
          <span className="text-sm font-semibold tracking-tight">BuildFlow AI</span>
          <nav className="ml-8 hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#product" className="transition-colors hover:text-foreground">
              Product
            </a>
            <a href="#platform" className="transition-colors hover:text-foreground">
              Platform
            </a>
            <Link to="/app" className="transition-colors hover:text-foreground">
              Live demo
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Button asChild variant="ghost" className="rounded-xl">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild className="rounded-xl">
              <Link to="/signup">Start free</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-6 pb-24 pt-24 sm:pt-32">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-xs font-medium">
            Now with blueprint-native estimating
          </Badge>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            The operating system for construction companies.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            BuildFlow AI replaces the stack of tools between your first bid and your final payment —
            with an assistant that already knows every project, invoice, and daily log.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="h-12 rounded-xl px-6">
              <Link to="/app">
                Explore the dashboard
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-xl px-6">
              <Link to="/signup">Create an account</Link>
            </Button>
          </div>

          <dl className="mt-20 grid gap-10 border-t border-border pt-10 sm:grid-cols-4">
            {[
              ["$4.2B", "Contract value managed"],
              ["31%", "Faster estimate turnaround"],
              ["19.6%", "Average blended margin"],
              ["4.7/5", "Customer satisfaction"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="num text-2xl font-semibold">{v}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{l}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="product" className="border-t border-border bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <h2 className="max-w-xl text-3xl font-semibold tracking-tight">
              Every part of the job, in one place.
            </h2>
            <div className="mt-14 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div key={f.title}>
                  <f.icon className="size-5 text-signal" aria-hidden />
                  <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="platform" className="mx-auto max-w-6xl px-6 py-24">
          <div className="panel flex flex-col items-start gap-6 p-10 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-lg">
              <Shield className="size-5 text-muted-foreground" aria-hidden />
              <h2 className="mt-4 text-2xl font-semibold tracking-tight">
                Enterprise-grade from day one.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                SSO, role-based permissions, audit trails, and SOC 2 controls. Connects to
                QuickBooks, Stripe, Google Calendar, Slack, and the rest of your stack.
              </p>
            </div>
            <Button asChild size="lg" className="h-12 rounded-xl px-6">
              <Link to="/signup">Start free trial</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 BuildFlow AI</p>
          <nav className="flex items-center gap-4" aria-label="Legal">
            <Link to="/legal/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link to="/legal/terms" className="hover:text-foreground">
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
