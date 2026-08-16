import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { PageHeader, Section, StatCard, StatusPill } from "@/components/shell/primitives";
import { axisProps, ChartTooltip } from "@/components/shell/chart-bits";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { currency, delta } from "@/lib/format";
import type { Dashboard, Expense, Invoice, PurchaseOrder } from "@/lib/remote-data";
import {
  createInvoice,
  fetchDashboard,
  fetchExpenses,
  fetchInvoices,
  fetchPurchaseOrders,
} from "@/lib/remote-data";
import { Download, Plus } from "lucide-react";

export const Route = createFileRoute("/app/financials")({
  loader: async () => {
    const [invoices, expenses, purchaseOrders, dashboard] = await Promise.all([
      fetchInvoices(),
      fetchExpenses(),
      fetchPurchaseOrders(),
      fetchDashboard(),
    ]);
    return { invoices, expenses, purchaseOrders, dashboard };
  },
  head: () => ({
    meta: [
      { title: "Financials — BuildFlow AI" },
      {
        name: "description",
        content:
          "Invoices, accounts receivable and payable, cash flow, purchase orders, and job costing.",
      },
      { property: "og:title", content: "Financials — BuildFlow AI" },
      { property: "og:description", content: "AR/AP, cash flow, and job costing in one place." },
    ],
  }),
  component: FinancialsPage,
});

function FinancialsPage() {
  const data = Route.useLoaderData() as {
    invoices: Invoice[];
    expenses: Expense[];
    purchaseOrders: PurchaseOrder[];
    dashboard: Dashboard;
  };
  const [invoices, setInvoices] = useState<Invoice[]>(data.invoices);
  const { expenses, purchaseOrders, dashboard } = data;
  const outstanding = invoices.filter((i) => i.status !== "Paid").reduce((s, i) => s + i.amount, 0);
  const outstandingCount = invoices.filter((i) => i.status !== "Paid").length;
  const overdue = invoices.filter((i) => i.status === "Overdue").reduce((s, i) => s + i.amount, 0);
  const collected = dashboard.kpis.revenueThisMonth;
  const thisMonth = dashboard.months.at(-1);
  const lastMonth = dashboard.months.at(-2);
  const monthExpenses = thisMonth?.spent ?? 0;
  const cashFlow = dashboard.months.map((m) => ({
    month: m.month,
    inflow: m.collected,
    outflow: m.spent,
  }));

  const handleNewInvoice = async () => {
    try {
      const created = await createInvoice({ amount: 0 });
      setInvoices((prev) => [created, ...prev]);
      toast.success("Draft invoice created — set customer and amount from its record.");
    } catch (err) {
      toast.error("Couldn't create invoice", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Revenue"
        title="Financials"
        description="Receivables, payables, and cash — reconciled with QuickBooks in near real time."
        actions={
          <>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => toast.success("Statement export queued")}
            >
              <Download className="size-4" />
              Export
            </Button>
            <Button className="rounded-xl" onClick={handleNewInvoice}>
              <Plus className="size-4" />
              New invoice
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Outstanding AR"
          value={currency(outstanding)}
          hint={`Across ${outstandingCount} invoice${outstandingCount === 1 ? "" : "s"}`}
        />
        <StatCard
          label="Overdue"
          value={currency(overdue)}
          hint={
            dashboard.kpis.overdueCount > 0
              ? `${dashboard.kpis.overdueCount} needing escalation`
              : "Nothing past due"
          }
        />
        <StatCard
          label="Collected (MTD)"
          value={currency(collected)}
          delta={delta(collected, dashboard.kpis.revenueLastMonth)}
        />
        <StatCard
          label="Expenses (MTD)"
          value={currency(monthExpenses)}
          delta={delta(monthExpenses, lastMonth?.spent ?? 0)}
        />
      </div>

      <Section title="Cash flow" description="Collected vs. spent, trailing eight months">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cashFlow} margin={{ left: -8, right: 8, top: 8 }}>
              <CartesianGrid stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
              <ChartTooltip />
              <Bar dataKey="inflow" fill="var(--color-chart-1)" radius={[3, 3, 0, 0]} />
              <Bar dataKey="outflow" fill="var(--color-chart-4)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Section>

      <Section title="Invoices" description="Accounts receivable" padded={false}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Due</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="num font-medium">{inv.invoiceId}</TableCell>
                <TableCell className="text-muted-foreground">{inv.customer}</TableCell>
                <TableCell className="text-muted-foreground">{inv.due}</TableCell>
                <TableCell className="num text-right">{currency(inv.amount)}</TableCell>
                <TableCell>
                  <StatusPill status={inv.status} />
                </TableCell>
                <TableCell className="text-right">
                  {inv.status === "Paid" ? (
                    <span className="text-xs text-muted-foreground">Reconciled</span>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 rounded-lg"
                      onClick={() => toast.success(`Reminder sent for ${inv.invoiceId}`)}
                    >
                      Send reminder
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Recent expenses" description="Accounts payable" padded={false}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Project</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.vendor}</TableCell>
                  <TableCell className="text-muted-foreground">{e.category}</TableCell>
                  <TableCell className="text-muted-foreground">{e.project}</TableCell>
                  <TableCell className="num text-right">{currency(e.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>

        <Section title="Purchase orders" padded={false}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>ETA</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseOrders.map((po) => (
                <TableRow key={po.id}>
                  <TableCell className="num font-medium">{po.poNumber}</TableCell>
                  <TableCell className="text-muted-foreground">{po.vendor}</TableCell>
                  <TableCell className="num text-right">{currency(po.amount)}</TableCell>
                  <TableCell className="text-muted-foreground">{po.eta}</TableCell>
                  <TableCell>
                    <StatusPill status={po.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>
      </div>
    </>
  );
}
