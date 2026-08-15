import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { PageHeader, Section, StatCard } from "@/components/shell/primitives";
import { axisProps, ChartTooltip } from "@/components/shell/chart-bits";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  analytics,
  completionSeries,
  currency,
  forecastSeries,
  marginSeries,
  projects,
  revenueSeries,
} from "@/lib/mock-data";
import { Download, Star } from "lucide-react";

export const Route = createFileRoute("/app/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — BuildFlow AI" },
      {
        name: "description",
        content:
          "Win rates, margins, productivity, and AI-assisted revenue forecasting across the business.",
      },
      { property: "og:title", content: "Analytics — BuildFlow AI" },
      {
        property: "og:description",
        content: "Performance, margins, and forecasting for the whole operation.",
      },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Analytics"
        description="Performance, profitability, and forecasting across every project and crew."
        actions={
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => toast.success("Analytics export queued")}
          >
            <Download className="size-4" />
            Export report
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Win rate"
          value={`${analytics.winRate}%`}
          delta={2.9}
          hint="Trailing 90 days"
        />
        <StatCard
          label="Avg. project value"
          value={currency(analytics.avgProjectValue)}
          delta={4.5}
        />
        <StatCard label="Lead conversion" value={`${analytics.leadConversion}%`} delta={1.8} />
        <StatCard
          label="Blended margin"
          value={`${analytics.margin}%`}
          delta={3.4}
          hint="Up from 16.2%"
        />
        <StatCard
          label="Crew productivity"
          value={`${analytics.productivity}%`}
          delta={1.2}
          hint="Of planned output"
        />
        <StatCard
          label="Client satisfaction"
          value={`${analytics.satisfaction} / 5`}
          delta={0.6}
          icon={Star}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Section
          className="lg:col-span-2"
          title="Revenue forecast"
          description="Recognized revenue vs. AI-modeled forecast"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ left: -12, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="an-rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" {...axisProps} />
                <YAxis {...axisProps} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                <ChartTooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  fill="url(#an-rev)"
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

        <Section title="Gross margin trend" description="Blended, trailing six months">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={marginSeries} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" {...axisProps} />
                <YAxis {...axisProps} unit="%" domain={[14, 22]} />
                <ChartTooltip />
                <Line
                  type="monotone"
                  dataKey="margin"
                  stroke="var(--color-chart-3)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Section
          className="lg:col-span-2"
          title="Next-quarter revenue forecast"
          description="AI projection with low / base / high scenarios"
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecastSeries} margin={{ left: -12, right: 8, top: 8 }}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" {...axisProps} />
                <YAxis {...axisProps} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                <ChartTooltip />
                <Bar dataKey="low" fill="var(--color-chart-4)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="base" fill="var(--color-chart-1)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="high" fill="var(--color-chart-2)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Project completion" description="Planned vs. actual, current quarter">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={completionSeries} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="week" {...axisProps} />
                <YAxis {...axisProps} unit="%" />
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
      </div>

      <Section title="Profitability by project" description="Budget utilization and margin health">
        <ul className="space-y-5">
          {projects.map((p) => {
            const used = Math.round((p.spent / p.budget) * 100);
            return (
              <li key={p.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate pr-3 font-medium">{p.name}</span>
                  <span className="num text-muted-foreground">
                    {currency(p.spent)} / {currency(p.budget)}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <Progress value={used} className="h-1.5" />
                  <span className="num w-10 text-right text-xs text-muted-foreground">{used}%</span>
                </div>
              </li>
            );
          })}
        </ul>
      </Section>
    </>
  );
}
