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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { currency, estimateBreakdown, estimateRevisions, estimates } from "@/lib/mock-data";
import { FileUp, Mail, Send, Sparkles, UploadCloud } from "lucide-react";

export const Route = createFileRoute("/app/estimating")({
  head: () => ({
    meta: [
      { title: "AI Estimating — BuildFlow AI" },
      {
        name: "description",
        content: "Upload blueprints and generate labor, material, and risk-scored estimates with branded proposals.",
      },
      { property: "og:title", content: "AI Estimating — BuildFlow AI" },
      { property: "og:description", content: "Blueprint-native takeoffs, risk scoring, and branded proposals." },
    ],
  }),
  component: EstimatingPage,
});

function EstimatingPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [markup, setMarkup] = useState([18]);
  const cost = estimateBreakdown.reduce((s, b) => s + b.amount, 0);
  const pct = markup[0] ?? 18;
  const price = Math.round(cost * (1 + pct / 100));

  const analyze = () => {
    setAnalyzing(true);
    window.setTimeout(() => {
      setAnalyzing(false);
      toast.success("Blueprint parsed — 214 quantities extracted");
    }, 1400);
  };

  return (
    <>
      <PageHeader
        eyebrow="Revenue"
        title="AI Estimating"
        description="Turn a blueprint set into a defensible, risk-scored estimate and a branded proposal."
        actions={
          <>
            <Button variant="outline" className="rounded-xl" onClick={() => toast.success("PDF exported")}>
              <FileUp className="size-4" />
              Export PDF
            </Button>
            <Button className="rounded-xl" onClick={() => toast.success("Proposal sent to customer")}>
              <Send className="size-4" />
              Send proposal
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Estimated cost" value={currency(cost)} hint="All categories" />
        <StatCard label="Sell price" value={currency(price)} hint={`${pct}% markup`} />
        <StatCard label="Gross profit" value={currency(price - cost)} delta={pct / 2} />
        <StatCard label="Risk score" value="Medium" hint="Steel escalation exposure" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Section title="Documents" description="Blueprints, PDFs, and site photos" className="lg:col-span-1">
          <button
            onClick={analyze}
            className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 transition-colors hover:bg-accent"
          >
            <UploadCloud className="size-6 text-muted-foreground" aria-hidden />
            <p className="mt-3 text-sm font-medium">Upload blueprint set</p>
            <p className="mt-1 text-xs text-muted-foreground">PDF, DWG, JPG · up to 250 MB</p>
          </button>

          {analyzing ? (
            <div className="mt-5 space-y-3">
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="size-3.5 text-signal" aria-hidden />
                Reading sheets and extracting quantities…
              </p>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ) : (
            <ul className="mt-5 space-y-2 text-sm">
              {["A-101 → A-118 architectural.pdf", "S-201 structural.pdf", "Site photos (18)"].map((f) => (
                <li key={f} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                  <span className="truncate pr-3 text-muted-foreground">{f}</span>
                  <StatusPill status="Complete" />
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Cost breakdown" description="AI-generated labor and material takeoff" className="lg:col-span-2">
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={estimateBreakdown} margin={{ left: -8, right: 8, top: 8 }}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="category" {...axisProps} />
                <YAxis {...axisProps} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                <ChartTooltip />
                <Bar dataKey="amount" fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} maxBarSize={56} />
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
              <Slider id="markup" value={markup} onValueChange={setMarkup} min={5} max={40} step={1} />
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

        <Section title="Risk assessment" description="Weighted by scope, schedule, and market">
          <div className="space-y-5">
            {[
              ["Material escalation", 68],
              ["Schedule compression", 42],
              ["Scope ambiguity", 55],
              ["Subcontractor coverage", 24],
            ].map(([label, v]) => (
              <div key={label as string}>
                <div className="flex items-center justify-between text-sm">
                  <span>{label}</span>
                  <span className="num text-muted-foreground">{v}</span>
                </div>
                <Progress value={v as number} className="mt-2 h-1.5" />
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              <Sparkles className="size-3.5 text-signal" aria-hidden />
              AI recommendation
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              Add a 4% steel escalation allowance and clarify site access on sheet A-104 before issuing. That
              moves the risk score from Medium to Low and protects roughly $34,000 of margin.
            </p>
          </div>
        </Section>

        <Section title="Revision history" padded={false}>
          <ul className="divide-y divide-border">
            {estimateRevisions.map((r) => (
              <li key={r.rev} className="px-6 py-4">
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
          <Button variant="outline" size="sm" className="rounded-lg" onClick={() => toast.success("Emailed to customer")}>
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
            {estimates.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="num font-medium">{e.id}</TableCell>
                <TableCell>{e.project}</TableCell>
                <TableCell className="text-muted-foreground">{e.customer}</TableCell>
                <TableCell className="num text-right">{currency(e.total)}</TableCell>
                <TableCell className="num text-right">{e.margin}%</TableCell>
                <TableCell><StatusPill status={e.risk} /></TableCell>
                <TableCell><StatusPill status={e.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>
    </>
  );
}
