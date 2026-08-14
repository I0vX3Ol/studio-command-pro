import { createFileRoute } from "@tanstack/react-router";
import { Download, Gauge, Percent, Smile, Trophy } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
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
import { Button } from "@/components/ui/button";
import { analytics, completionSeries, currency, marginSeries, revenueSeries } from "@/lib/mock-data";

export const Route = createFileRoute("/app/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — BuildFlow AI" },
      {
        name: "description",
        content:
          "Win rate, margin by sector, productivity and forecast accuracy across your construction business.",
      },
      { property: "og:title", content: "Analytics — BuildFlow AI" },
      {
        property: "og:description",
        content: "Win rate, margins and productivity benchmarks with AI commentary.",
      },
    ],
  }),
  component: AnalyticsPage,
});

const axis = {
  stroke: "var(--muted-foreground)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
};

const chartColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];

function AnalyticsPage() {
  return (
    <>
      <PageHeader
        title="Analytics"
        description="Where the business makes money, where it leaks, and what the next quarter looks like."
        actions={
          <Button variant="outline">
            <Download className="size-4" aria-hidden /> Export CSV
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Bid win rate" value={`${analytics.winRate}%`} delta={5.1} icon={Trophy} />
        <StatCard label="Avg. project value" value={currency(analytics.avgProject)} delta={7.3} />
        <StatCard label="Gross margin" value={`${analytics.margin}%`} delta={1.8} icon={Percent} />
        <StatCard
          label="Client satisfaction"
          value={`${analytics.satisfaction} / 5`}
          delta={2.2}
          icon={Smile}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Section title="Margin by sector" description="Trailing twelve months" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marginSeries} margin={{ left: -18, right: 8, top: 8 }}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" {...axis} />
                <YAxis {...axis} width={40} tickFormatter={(v) => `${v}%`} />
                <Tooltip cursor={{ fill: "var(--secondary)" }} />
                <Bar dataKey="margin" name="Margin %" radius={[6, 6, 0, 0]}>
                  {marginSeries.map((_, i) => (
                    <Cell key={i} fill={chartColors[i % chartColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Operating metrics" description="Against company targets">
          <ul className="space-y-5 text-sm">
            {[
              { label: "Lead conversion", value: analytics.leadConversion, target: 35 },
              { label: "Crew productivity", value: analytics.productivity, target: 90 },
              { label: "Forecast accuracy", value: 93, target: 95 },
              { label: "Change order recovery", value: 71, target: 80 },
            ].map((m) => (
              <li key={m.label}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{m.label}</span>
                  <span className="num text-xs text-muted-foreground">
                    {m.value}% / {m.target}%
                  </span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-secondary">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${Math.min(m.value, 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Forecast accuracy" description="Revenue vs. forecast">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueSeries} margin={{ left: -12, right: 8, top: 8 }}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" {...axis} />
                <YAxis {...axis} width={54} tickFormatter={(v) => `$${Math.round(v / 1000)}k`} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="revenue" name="Actual" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  name="Forecast"
                  stroke="var(--muted-foreground)"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Milestone throughput" description="Planned vs. delivered">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={completionSeries} margin={{ left: -18, right: 8, top: 8 }}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="week" {...axis} />
                <YAxis {...axis} width={40} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="planned" name="Planned" stroke="var(--muted-foreground)" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="actual" name="Actual" stroke="var(--chart-3)" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Section>
      </div>

      <Section title="AI commentary" description="Generated from this quarter's data">
        <div className="flex gap-3">
          <Gauge className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
          <p className="text-sm text-muted-foreground">
            Margin is up 1.8 points on the back of commercial work, but residential is dragging the
            blend down to 19%. Rework on Alder B2 accounts for roughly $61K of the gap. Win rate
            improved after estimate turnaround dropped below 24 hours — every additional day of delay
            correlates with a 6% drop in award probability.
          </p>
        </div>
      </Section>
    </>
  );
}