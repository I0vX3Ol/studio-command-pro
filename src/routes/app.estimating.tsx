import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { PageHeader, Section, StatCard, StatusPill } from "@/components/shell/primitives";
import { axisProps, ChartTooltip } from "@/components/shell/chart-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { currency } from "@/lib/format";
import type { DocumentRow, Estimate, EstimateRevision } from "@/lib/remote-data";
import { fetchDocuments, fetchEstimateRevisions, fetchEstimates } from "@/lib/remote-data";
import { FileUp, Mail, Send, Sparkles, UploadCloud } from "lucide-react";

export const Route = createFileRoute("/app/estimating")({
  loader: async () => {
    const [estimates, revisions, documents] = await Promise.all([
      fetchEstimates(),
      fetchEstimateRevisions(),
      fetchDocuments(),
    ]);
    return { estimates, revisions, documents };
  },
  head: () => ({
    meta: [
      { title: "AI Estimating — BuildFlow AI" },
      {
        name: "description",
        content:
          "Upload blueprints and generate labor, material, and risk-scored estimates with branded proposals.",
      },
      { property: "og:title", content: "AI Estimating — BuildFlow AI" },
      {
        property: "og:description",
        content: "Blueprint-native takeoffs, risk scoring, and branded proposals.",
      },
    ],
  }),
  component: EstimatingPage,
});

function EstimatingPage() {
  const { estimates, revisions, documents } = Route.useLoaderData() as {
    estimates: Estimate[];
    revisions: EstimateRevision[];
    documents: DocumentRow[];
  };
  const [selectedId, setSelectedId] = useState(estimates[0]?.id ?? "");
  const selected = estimates.find((e) => e.id === selectedId) ?? estimates[0];
  const estimateBreakdown = selected?.lineItems ?? [];

  const [markup, setMarkup] = useState([18]);
  const cost = estimateBreakdown.reduce((sum, b) => sum + b.amount, 0);
  const pct = markup[0] ?? 18;
  const price = Math.round(cost * (1 + pct / 100));

  return (
    <>
      <PageHeader
        eyebrow="Revenue"
        title="AI Estimating"
        description="Turn a blueprint set into a defensible, risk-scored estimate and a branded proposal."
        actions={
          <>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => toast.success("PDF exported")}
            >
              <FileUp className="size-4" />
              Export PDF
            </Button>
            <Button
              className="rounded-xl"
              onClick={() => toast.success("Proposal sent to customer")}
            >
              <Send className="size-4" />
              Send proposal
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Estimated cost" value={currency(cost)} hint="All categories" />
        <StatCard label="Sell price" value={currency(price)} hint={`${pct}% markup`} />
        <StatCard label="Gross profit" value={currency(price - cost)} />
        <StatCard
          label="Risk score"
          value={selected?.risk ?? "—"}
          hint={selected ? selected.project : "No estimate selected"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Section
          title="Documents"
          description="Blueprints, PDFs, and site photos"
          className="lg:col-span-1"
        >
          <div className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-border py-12">
            <UploadCloud className="size-6 text-muted-foreground" aria-hidden />
            <p className="mt-3 text-sm font-medium">Blueprint takeoff is not available yet</p>
            <p className="mt-1 px-6 text-center text-xs text-muted-foreground">
              Attach drawings to a project and they will appear here.
            </p>
          </div>

          <ul className="mt-5 space-y-2 text-sm">
            {documents.length === 0 ? (
              <li className="py-4 text-center text-xs text-muted-foreground">
                No documents uploaded yet.
              </li>
            ) : null}
            {documents.slice(0, 6).map((f) => (
              <li
                key={f.id}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
              >
                <span className="truncate pr-3 text-muted-foreground">{f.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{f.size}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section
          title="Cost breakdown"
          description="Labour, material and subcontract lines on this estimate"
          className="lg:col-span-2"
        >
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={estimateBreakdown} margin={{ left: -8, right: 8, top: 8 }}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="category" {...axisProps} />
                <YAxis {...axisProps} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                <ChartTooltip />
                <Bar
                  dataKey="amount"
                  fill="var(--color-chart-1)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={56}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Hours</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {estimateBreakdown.map((b) => (
                <TableRow key={b.category}>
                  <TableCell className="font-medium">{b.category}</TableCell>
                  <TableCell className="num text-right text-muted-foreground">
                    {b.hours ? b.hours.toLocaleString() : "—"}
                  </TableCell>
                  <TableCell className="num text-right">{currency(b.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Section title="Profit & markup calculator">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="cost">Total cost</Label>
              <Input id="cost" readOnly value={currency(cost)} className="num h-11 rounded-xl" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="markup">Markup</Label>
                <span className="num text-sm">{pct}%</span>
              </div>
              <Slider
                id="markup"
                value={markup}
                onValueChange={setMarkup}
                min={5}
                max={40}
                step={1}
              />
            </div>
            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Sell price</span>
                <span className="num font-semibold">{currency(price)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Gross profit</span>
                <span className="num font-semibold">{currency(price - cost)}</span>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Risk assessment" description="Recorded against the selected estimate">
          {selected ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Recorded risk</span>
                <StatusPill status={selected.risk} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Margin</span>
                <span className="num">{selected.margin != null ? `${selected.margin}%` : "—"}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <StatusPill status={selected.status} />
              </div>
              <p className="pt-2 text-xs leading-relaxed text-muted-foreground">
                Risk is whatever you record on the estimate. Automated scoring is not switched on
                yet — set it from the estimate record as your scope firms up.
              </p>
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Create an estimate to track risk.
            </p>
          )}
        </Section>

        <Section title="Revision history" padded={false}>
          <ul className="divide-y divide-border">
            {revisions.length === 0 ? (
              <li className="px-6 py-8 text-center text-sm text-muted-foreground">
                No revisions recorded.
              </li>
            ) : null}
            {revisions.map((r) => (
              <li key={r.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <p className="num text-sm font-semibold">{r.rev}</p>
                  <span className="text-xs text-muted-foreground">{r.date}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{r.author}</p>
                <p className="mt-2 text-sm leading-relaxed">{r.note}</p>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <Section
        title="All estimates"
        actions={
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg"
            onClick={() => toast.info("Emailing estimates is not enabled yet.")}
          >
            <Mail className="size-4" />
            Email customer
          </Button>
        }
        padded={false}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Estimate</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Margin</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {estimates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  No estimates yet.
                </TableCell>
              </TableRow>
            ) : null}
            {estimates.map((e) => (
              <TableRow key={e.id} onClick={() => setSelectedId(e.id)} className="cursor-pointer">
                <TableCell className="num font-medium">{e.number}</TableCell>
                <TableCell>{e.project}</TableCell>
                <TableCell className="text-muted-foreground">{e.customer}</TableCell>
                <TableCell className="num text-right">{currency(e.total)}</TableCell>
                <TableCell className="num text-right">
                  {e.margin != null ? `${e.margin}%` : "—"}
                </TableCell>
                <TableCell>
                  <StatusPill status={e.risk} />
                </TableCell>
                <TableCell>
                  <StatusPill status={e.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>
    </>
  );
}
