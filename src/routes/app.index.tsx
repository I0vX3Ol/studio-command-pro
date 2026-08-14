import { createFileRoute } from "@tanstack/react-router";
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
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader, Section, StatCard, StatusPill } from "@/components/shell/primitives";
import {
  activity,
  completionSeries,
  currency,
  deadlines,
  employees,
  equipment,
  kpis,
  revenueSeries,
  weather,
} from "@/lib/mock-data";
import { CloudSun, Download, Plus, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Dashboard — BuildFlow AI" },
      { name: "description", content: "Revenue, projects, crews, equipment, and AI activity at a glance." },
      { property: "og:title", content: "Dashboard — BuildFlow AI" },
      { property: "og:description", content: "Revenue, projects, crews, equipment, and AI activity at a glance." },
    ],
  }),
  component: Dashboard,
});

const axis = {
  stroke: "var(--color-muted-foreground)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
};

function ChartTooltip() {
  return (
    <Tooltip
      cursor={{ stroke: "var(--color-border)" }}
      contentStyle={{
        background: "var(--color-popover)",
        border: "1px solid var(--color-border)",
        borderRadius: 12,
        fontSize: 12,
        boxShadow: "var(--elevation-lift)",
        color: "var(--color-popover-foreground)",
      }}
    />
  );
}

function Dashboard() {
  return (
    <>
      <PageHeader
        eyebrow="Thursday, August 13"
        title="Good afternoon, Avery"
        description="Northline is tracking 4.2% ahead of forecast this month. Two invoices need escalation today."
        actions={
          <>
            <Button variant="outline" className="rounded-xl">
              <Download className="size-4" />
              Export
            </Button>
            <Button className="rounded-xl">
              <Plus className="size-4" />
              New project
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {kpis.map((k) => (
          <StatCard
            key={k.label}
            label={k.label}
            value={k.format === "currency" ? currency(k.value) : String(k.value)}
            delta={k.delta}
            hint="vs. last month"
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Section
          className="lg:col-span-2"
          title="Revenue vs. forecast"
          description="Trailing eight months, recognized revenue"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ left: -12, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" {...axis} />
                <YAxis {...axis} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                <ChartTooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  fill="url(#rev)"
                />
                <Area
                  type="monotone"
                  dataKey="forecast"
                  stroke="var(--color-chart-2)"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fill="none"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Jobsite conditions" description={weather.location}>
          <div className="flex items-start justify-between">
            <div>
              <p className="num text-4xl font-semibold">{weather.temp}°</p>
              <p className="mt-1 text-sm text-muted-foreground">{weather.condition}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                Wind {weather.wind} mph · {weather.precip}% precip
              </p>
            </div>
            <CloudSun className="size-9 text-signal" aria-hidden />
          </div>
          <ul className="mt-6 space-y-3 border-t border-border pt-5">
            {weather.forecast.map((d) => (
              <li key={d.day} className="flex items-center justify-between text-sm">
                <span className="w-10 text-muted-foreground">{d.day}</span>
                <span className="text-muted-foreground">{d.condition}</span>
                <span className="num">
                  {d.hi}° / {d.lo}°
                </span>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Section title="Project completion" description="Planned vs. actual, current quarter" className="lg:col-span-2">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={completionSeries} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="week" {...axis} />
                <YAxis {...axis} unit="%" />
                <ChartTooltip />
                <Line type="monotone" dataKey="planned" stroke="var(--color-chart-5)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="actual" stroke="var(--color-chart-3)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Equipment utilization" description="Top assets this week">
          <ul className="space-y-5">
            {equipment.slice(0, 4).map((e) => (
              <li key={e.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate pr-3 font-medium">{e.name}</span>
                  <span className="num text-muted-foreground">{e.util}%</span>
                </div>
                <Progress value={e.util} className="mt-2 h-1.5" />
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Section title="Recent activity" description="Customers, team, and AI" className="lg:col-span-2" padded={false}>
          <ul className="divide-y divide-border">
            {activity.map((a, i) => (
              <li key={i} className="flex items-start gap-3 px-6 py-4">
                {a.kind === "ai" ? (
                  <div className="mt-0.5 flex size-7 items-center justify-center rounded-full bg-muted">
                    <Sparkles className="size-3.5 text-signal" aria-hidden />
                  </div>
                ) : (
                  <Avatar className="mt-0.5 size-7">
                    <AvatarFallback className="text-[10px]">
                      {a.who
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <p className="flex-1 text-sm leading-relaxed">
                  <span className="font-medium">{a.who}</span>{" "}
                  <span className="text-muted-foreground">{a.what}</span>
                </p>
                <span className="whitespace-nowrap text-xs text-muted-foreground">{a.when}</span>
              </li>
            ))}
          </ul>
        </Section>

        <div className="space-y-6">
          <Section title="Upcoming deadlines" padded={false}>
            <ul className="divide-y divide-border">
              {deadlines.map((d) => (
                <li key={d.title} className="flex items-center gap-3 px-6 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{d.title}</p>
                    <p className="text-xs text-muted-foreground">{d.date}</p>
                  </div>
                  <StatusPill status={d.urgency === "urgent" ? "Overdue" : d.urgency === "soon" ? "Pending" : "On track"} />
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Crew status" padded={false}>
            <ul className="divide-y divide-border">
              {employees.slice(0, 5).map((e) => (
                <li key={e.name} className="flex items-center gap-3 px-6 py-3">
                  <Avatar className="size-7">
                    <AvatarFallback className="text-[10px]">
                      {e.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{e.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{e.role}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{e.status}</span>
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </div>
    </>
  );
}
