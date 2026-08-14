import { createFileRoute } from "@tanstack/react-router";
import { Banknote, Plus, Receipt, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { PageHeader } from "@/components/app/page-header";
import { Section } from "@/components/app/section";
import { StatCard } from "@/components/app/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { currency, expenses, invoices, revenueSeries } from "@/lib/mock-data";

export const Route = createFileRoute("/app/financials")({
  head: () => ({
    meta: [
      { title: "Financials — BuildFlow AI" },
      {
        name: "description",
        content:
          "Invoices, expenses, cash flow and margin tracking for every construction project.",
      },
      { property: "og:title", content: "Financials — BuildFlow AI" },
      {
        property: "og:description",
        content: "Receivables, expenses and cash flow in one ledger.",
      },
    ],
  }),
  component: FinancialsPage,
});

const axis = {
  stroke: "var(--muted-foreground)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
};

function CashTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="surface px-3 py-2 text-xs">
      <p className="font-medium">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="num mt-1 text-muted-foreground">
          {p.name}: {currency(p.value)}
        </p>
      ))}
    </div>
  );
}

const statusTone: Record<string, string> = {
  Paid: "text-success",
  Overdue: "text-destructive",
};

function FinancialsPage() {
  const outstanding = invoices
    .filter((i) => i.status !== "Paid")
    .reduce((s, i) => s + i.amount, 0);
  const overdue = invoices.filter((i) => i.status === "Overdue").reduce((s, i) => s + i.amount, 0);
  const spend = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <>
      <PageHeader
        title="Financials"
        description="Receivables, job costs and cash position — reconciled with your accounting system."
        actions={
          <>
            <Button variant="outline">
              <Receipt className="size-4" aria-hidden /> Record expense
            </Button>
            <Button>
              <Plus className="size-4" aria-hidden /> New invoice
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Outstanding AR" value={currency(outstanding)} delta={-4.2} icon={Banknote} />
        <StatCard label="Overdue" value={currency(overdue)} delta={-8.1} hint="2 invoices" />
        <StatCard label="Expenses MTD" value={currency(spend)} delta={2.9} icon={Receipt} />
        <StatCard label="Gross margin" value="27.4%" delta={1.8} icon={TrendingUp} />
      </div>

      <Section title="Revenue vs. cost" description="Last 8 months">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueSeries} margin={{ left: -12, right: 8, top: 8 }}>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" {...axis} />
              <YAxis {...axis} tickFormatter={(v) => `$${Math.round(v / 1000)}k`} width={54} />
              <Tooltip cursor={{ fill: "var(--secondary)" }} content={<CashTooltip />} />
              <Bar dataKey="revenue" name="Revenue" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cost" name="Cost" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Section title="Invoices" description="Accounts receivable" className="lg:col-span-2" bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Invoice</th>
                  <th className="px-6 py-3 font-medium">Client</th>
                  <th className="px-6 py-3 font-medium">Due</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((i) => (
                  <tr key={i.id} className="border-b border-border/60 last:border-0">
                    <td className="num px-6 py-3 font-medium">{i.id}</td>
                    <td className="px-6 py-3 text-muted-foreground">{i.client}</td>
                    <td className="num px-6 py-3 text-muted-foreground">{i.due}</td>
                    <td className="px-6 py-3">
                      <Badge variant="secondary" className={statusTone[i.status]}>
                        {i.status}
                      </Badge>
                    </td>
                    <td className="num px-6 py-3 text-right">{currency(i.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Recent expenses" description="Job costed automatically">
          <ul className="space-y-4">
            {expenses.map((e) => (
              <li key={e.id} className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{e.vendor}</p>
                  <p className="text-xs text-muted-foreground">
                    {e.category} · {e.date}
                  </p>
                </div>
                <span className="num text-sm">{currency(e.amount)}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </>
  );
}