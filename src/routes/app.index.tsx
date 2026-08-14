import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  CalendarClock,
  CheckCircle2,
  CloudSun,
  FileText,
  HardHat,
  Receipt,
  Sparkles,
  TrendingUp,
  Truck,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeader } from "@/components/app/page-header";
import { Section } from "@/components/app/section";
import { StatCard } from "@/components/app/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  activity,
  completionSeries,
  currency,
  deadlines,
  employees,
  equipment,
  revenueSeries,
} from "@/lib/mock-data";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Dashboard — BuildFlow AI" },
      {
        name: "description",
        content:
          "Revenue, estimates, active projects, field crews and AI activity for your construction business at a glance.",
      },
      { property: "og:title", content: "Dashboard — BuildFlow AI" },
      {
        property: "og:description",
        content: "Live operating picture for revenue, projects, crews and equipment.",
      },
    ],
  }),
  component: Dashboard,
});

const axis = {
  stroke: "var(--muted-foreground)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
};

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="surface px-3 py-2 text-xs">
      <p className="font-medium">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="num mt-1 text-muted-foreground">
          {p.name}: {typeof p.value === "number" && p.value > 1000 ? currency(p.value) : p.value}
        </p>
      ))}
    </div>
  );
}

function Dashboard() {
  return (
    <>
      <PageHeader
        title="Good morning, Dana"
        description="Thursday, August 13 · Northbeam Construction is pacing 13% ahead of forecast this month."
        actions={
          <>
            <Button variant="outline">
              <FileText className="size-4" aria-hidden /> Export report
            </Button>
            <Button>
              <Sparkles className="size-4" aria-hidden /> New AI estimate
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Revenue this month" value={currency(784000)} delta={13.4} hint="vs. forecast" icon={TrendingUp} />
        <StatCard label="Open estimates" value="14" delta={4.2} hint="$3.1M pipeline" icon={FileText} />
        <StatCard label="Projects in progress" value="9" hint="2 in punch list" icon={HardHat} />
        <StatCard label="Invoices overdue" value={currency(280500)} delta={-8.1} hint="2 invoices" icon={Receipt} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Section
          title="Revenue"
          description="Actual vs. forecast, last 8 months"
          className="lg:col-span-2"
          action={<Badge variant="secondary">+13.4% MoM</Badge>}
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ left: -12, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" {...axis} />
                <YAxis {...axis} tickFormatter={(v) => `$${Math.round(v / 1000)}k`} width={54} />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#rev)"
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  name="Forecast"
                  stroke="var(--muted-foreground)"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <div className="space-y-6">
          <Section title="Today on site" description="Ballard, WA · 8:00 AM">
            <div className="flex items-center gap-4">
              <CloudSun className="size-10 text-warning" aria-hidden />
              <div>
                <p className="num text-3xl font-semibold">72°</p>
                <p className="text-xs text-muted-foreground">Partly cloudy · 8% precipitation</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs">
              {["Fri 74°", "Sat 69°", "Sun 66°"].map((d) => (
                <div key={d} className="rounded-lg bg-secondary py-2 font-medium">
                  {d}
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              No weather holds expected. Concrete pour window is clear through Saturday.
            </p>
          </Section>

          <Section title="Crew status" description="Live clock-in data">
            <ul className="space-y-3">
              {employees.slice(0, 4).map((e) => (
                <li key={e.id} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{e.name}</span>
                  <Badge
                    variant={e.status === "PTO" ? "outline" : "secondary"}
                    className={e.status === "On site" ? "text-success" : undefined}
                  >
                    {e.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Section title="Project completion" description="Planned vs. actual milestones" className="lg:col-span-2">
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={completionSeries} margin={{ left: -18, right: 8, top: 8 }}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="week" {...axis} />
                <YAxis {...axis} width={40} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="planned" name="Planned" stroke="var(--muted-foreground)" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="actual" name="Actual" stroke="var(--chart-3)" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Equipment utilization" description="Fleet of 24 assets">
          <ul className="space-y-4">
            {equipment.map((e) => (
              <li key={e.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium">
                    <Truck className="size-4 text-muted-foreground" aria-hidden />
                    {e.tag}
                  </span>
                  <span className="num text-xs text-muted-foreground">{e.util}%</span>
                </div>
                <Progress value={e.util} className="mt-2 h-1.5" />
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Section title="Recent activity" description="Customers, crews and AI" className="lg:col-span-2">
          <ul className="space-y-5">
            {activity.map((a) => (
              <li key={a.id} className="flex gap-3">
                <span className="mt-0.5 rounded-lg bg-secondary p-1.5 text-muted-foreground">
                  {a.kind === "ai" ? (
                    <Sparkles className="size-3.5" aria-hidden />
                  ) : a.kind === "client" ? (
                    <Activity className="size-3.5" aria-hidden />
                  ) : (
                    <CheckCircle2 className="size-3.5" aria-hidden />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{a.who}</span>{" "}
                    <span className="text-muted-foreground">{a.what}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{a.when}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Upcoming deadlines" description="Next 3 weeks">
          <ul className="space-y-4">
            {deadlines.map((d) => (
              <li key={d.id} className="flex items-start gap-3">
                <CalendarClock
                  className={
                    d.urgency === "high"
                      ? "mt-0.5 size-4 text-destructive"
                      : d.urgency === "med"
                        ? "mt-0.5 size-4 text-warning"
                        : "mt-0.5 size-4 text-muted-foreground"
                  }
                  aria-hidden
                />
                <div>
                  <p className="text-sm font-medium">{d.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.when} · {d.owner}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </>
  );
}
