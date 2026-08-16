import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
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
import { currency, delta, initials } from "@/lib/format";
import type { ActivityItem, Dashboard, Employee, EquipmentItem } from "@/lib/remote-data";
import {
  fetchActivity,
  fetchDashboard,
  fetchEmployees,
  fetchEquipment,
  fetchProfile,
} from "@/lib/remote-data";
import type { Profile } from "@/lib/remote-data";
import { Download, Plus, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/")({
  loader: async () => {
    const [dashboard, activity, equipment, employees, profile] = await Promise.all([
      fetchDashboard(),
      fetchActivity(),
      fetchEquipment(),
      fetchEmployees(),
      fetchProfile(),
    ]);
    return { dashboard, activity, equipment, employees, profile };
  },
  head: () => ({
    meta: [
      { title: "Dashboard — BuildFlow AI" },
      {
        name: "description",
        content: "Revenue, projects, crews, equipment, and AI activity at a glance.",
      },
      { property: "og:title", content: "Dashboard — BuildFlow AI" },
      {
        property: "og:description",
        content: "Revenue, projects, crews, equipment, and AI activity at a glance.",
      },
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
  const navigate = useNavigate();
  const { dashboard, activity, equipment, employees, profile } = Route.useLoaderData() as {
    dashboard: Dashboard;
    activity: ActivityItem[];
    equipment: EquipmentItem[];
    employees: Employee[];
    profile: Profile | null;
  };
  const { kpis: k, months, weeks, deadlines } = dashboard;

  const revenueSeries = months.map((m) => ({
    month: m.month,
    revenue: m.collected,
    forecast: m.invoiced,
  }));
  const completionSeries = weeks;

  const kpis = [
    {
      label: "Collected this month",
      value: currency(k.revenueThisMonth),
      delta: delta(k.revenueThisMonth, k.revenueLastMonth),
    },
    { label: "Open estimates", value: String(k.openEstimates) },
    { label: "Projects in progress", value: String(k.projectsInProgress) },
    { label: "Projects completed", value: String(k.projectsCompleted) },
    {
      label: "Overdue receivables",
      value: currency(k.overdueAmount),
      hint: `${k.overdueCount} invoice${k.overdueCount === 1 ? "" : "s"}`,
    },
    { label: "Service due (30d)", value: String(k.scheduledService) },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = profile?.name?.split(" ")[0] ?? "there";

  return (
    <>
      <PageHeader
        eyebrow={new Date().toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
        title={`${greeting}, ${firstName}`}
        description={
          k.overdueCount > 0
            ? `${k.overdueCount} invoice${k.overdueCount === 1 ? "" : "s"} past due, worth ${currency(k.overdueAmount)}.`
            : "Nothing past due. Here is where the business stands today."
        }
        actions={
          <>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => toast.info("Dashboard export is not enabled yet.")}
            >
              <Download className="size-4" />
              Export
            </Button>
            <Button className="rounded-xl" onClick={() => void navigate({ to: "/app/projects" })}>
              <Plus className="size-4" />
              New project
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {kpis.map((kpi) => (
          <StatCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Section
          className="lg:col-span-2"
          title="Collected vs. invoiced"
          description="Collected vs. invoiced, trailing eight months"
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

        <Section title="Today" description="Open work across the business">
          <ul className="space-y-4">
            {[
              ["Open punch items", String(k.openPunchItems)],
              ["Equipment tracked", String(k.activeEquipment)],
              ["Average utilisation", `${k.avgUtilization}%`],
              ["Team members", String(k.headcount)],
              ["Customers", String(k.customers)],
            ].map(([label, value]) => (
              <li key={label} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="num font-medium">{value}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Section
          title="Task delivery"
          description="Due vs. completed, trailing eight weeks"
          className="lg:col-span-2"
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={completionSeries} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="week" {...axis} />
                <YAxis {...axis} allowDecimals={false} />
                <ChartTooltip />
                <Line
                  type="monotone"
                  dataKey="planned"
                  stroke="var(--color-chart-5)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="var(--color-chart-3)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Equipment utilization" description="Top assets this week">
          <ul className="space-y-5">
            {equipment.length === 0 ? (
              <li className="py-4 text-center text-sm text-muted-foreground">
                No equipment tracked yet.
              </li>
            ) : null}
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
        <Section
          title="Recent activity"
          description="Customers, team, and AI"
          className="lg:col-span-2"
          padded={false}
        >
          <ul className="divide-y divide-border">
            {activity.length === 0 ? (
              <li className="px-6 py-8 text-center text-sm text-muted-foreground">
                Nothing has happened in this workspace yet.
              </li>
            ) : null}
            {activity.map((a) => (
              <li key={a.id} className="flex items-start gap-3 px-6 py-4">
                {a.kind === "ai" ? (
                  <div className="mt-0.5 flex size-7 items-center justify-center rounded-full bg-muted">
                    <Sparkles className="size-3.5 text-signal" aria-hidden />
                  </div>
                ) : (
                  <Avatar className="mt-0.5 size-7">
                    <AvatarFallback className="text-[10px]">{initials(a.who)}</AvatarFallback>
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
              {deadlines.length === 0 ? (
                <li className="px-6 py-8 text-center text-sm text-muted-foreground">
                  Nothing scheduled.
                </li>
              ) : null}
              {deadlines.slice(0, 6).map((d) => (
                <li
                  key={`${d.source}-${d.title}-${d.date}`}
                  className="flex items-center gap-3 px-6 py-3.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{d.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(d.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      · {d.owner}
                    </p>
                  </div>
                  <StatusPill
                    status={
                      new Date(d.date).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000
                        ? "Pending"
                        : "On track"
                    }
                  />
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Crew status" padded={false}>
            <ul className="divide-y divide-border">
              {employees.length === 0 ? (
                <li className="px-6 py-8 text-center text-sm text-muted-foreground">
                  No team members yet.
                </li>
              ) : null}
              {employees.slice(0, 5).map((e) => (
                <li key={e.id} className="flex items-center gap-3 px-6 py-3">
                  <Avatar className="size-7">
                    <AvatarFallback className="text-[10px]">{initials(e.name)}</AvatarFallback>
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
