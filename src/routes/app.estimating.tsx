import { createFileRoute } from "@tanstack/react-router";
import { FileUp, Loader2, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/app/page-header";
import { Section } from "@/components/app/section";
import { StatCard } from "@/components/app/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { currency, estimates } from "@/lib/mock-data";

export const Route = createFileRoute("/app/estimating")({
  head: () => ({
    meta: [
      { title: "AI Estimating — BuildFlow AI" },
      {
        name: "description",
        content:
          "Generate construction estimates from blueprints and scope notes with AI takeoffs and risk scoring.",
      },
      { property: "og:title", content: "AI Estimating — BuildFlow AI" },
      {
        property: "og:description",
        content: "Blueprint takeoffs, line-item pricing and risk scoring in minutes.",
      },
    ],
  }),
  component: EstimatingPage,
});

const lineItems = [
  { div: "03", name: "Concrete — slab on grade", qty: "4,200 sf", unit: 11.4, total: 47_880 },
  { div: "05", name: "Structural steel erection", qty: "62 tons", unit: 3_180, total: 197_160 },
  { div: "06", name: "Rough carpentry", qty: "1 ls", unit: 62_400, total: 62_400 },
  { div: "23", name: "HVAC rough-in", qty: "1 ls", unit: 148_500, total: 148_500 },
  { div: "26", name: "Electrical distribution", qty: "1 ls", unit: 121_900, total: 121_900 },
];

function EstimatingPage() {
  const [scope, setScope] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const subtotal = lineItems.reduce((s, l) => s + l.total, 0);
  const overhead = Math.round(subtotal * 0.09);
  const profit = Math.round(subtotal * 0.12);

  const generate = () => {
    setBusy(true);
    setDone(false);
    window.setTimeout(() => {
      setBusy(false);
      setDone(true);
      toast.success("Estimate generated", { description: "42 pages analyzed · 5 divisions priced" });
    }, 1400);
  };

  return (
    <>
      <PageHeader
        title="AI estimating"
        description="Upload drawings or describe the scope — BuildFlow produces a priced takeoff with risk scoring."
        actions={
          <Button variant="outline">
            <FileUp className="size-4" aria-hidden /> Upload blueprints
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Estimates this month" value="14" delta={22.4} icon={Sparkles} />
        <StatCard label="Avg. turnaround" value="18 min" delta={-41.2} hint="was 9 hours" />
        <StatCard label="Bid win rate" value="46%" delta={5.1} />
        <StatCard label="Pipeline priced" value={currency(2_160_500)} delta={8.8} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Section title="Scope input" description="Describe the job or paste a spec section">
          <Textarea
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            rows={8}
            placeholder="e.g. 4,200 sf warehouse dock retrofit, two new overhead doors, structural steel headers, new panel and lighting…"
          />
          <Button className="mt-4 w-full" onClick={generate} disabled={busy}>
            {busy ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Wand2 className="size-4" aria-hidden />
            )}
            {busy ? "Analyzing…" : "Generate estimate"}
          </Button>
          <div className="mt-5 rounded-xl bg-secondary p-4 text-xs text-muted-foreground">
            Historical cost data from 128 completed Northbeam projects is used to price each line
            item, then adjusted for region, season and crew productivity.
          </div>
        </Section>

        <Section
          title="Generated takeoff"
          description="CSI divisions with unit pricing"
          className="lg:col-span-2"
          bodyClassName="p-0"
          action={done ? <Badge variant="secondary">Draft ready</Badge> : null}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Div</th>
                  <th className="px-6 py-3 font-medium">Line item</th>
                  <th className="px-6 py-3 font-medium">Qty</th>
                  <th className="px-6 py-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((l) => (
                  <tr key={l.div} className="border-b border-border/60">
                    <td className="num px-6 py-3 text-muted-foreground">{l.div}</td>
                    <td className="px-6 py-3 font-medium">{l.name}</td>
                    <td className="num px-6 py-3 text-muted-foreground">{l.qty}</td>
                    <td className="num px-6 py-3 text-right">{currency(l.total)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="text-sm">
                <tr>
                  <td colSpan={3} className="px-6 py-2 text-muted-foreground">
                    Subtotal
                  </td>
                  <td className="num px-6 py-2 text-right">{currency(subtotal)}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="px-6 py-2 text-muted-foreground">
                    Overhead (9%)
                  </td>
                  <td className="num px-6 py-2 text-right">{currency(overhead)}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="px-6 py-2 text-muted-foreground">
                    Profit (12%)
                  </td>
                  <td className="num px-6 py-2 text-right">{currency(profit)}</td>
                </tr>
                <tr className="border-t border-border">
                  <td colSpan={3} className="px-6 py-3 font-semibold">
                    Bid total
                  </td>
                  <td className="num px-6 py-3 text-right font-semibold">
                    {currency(subtotal + overhead + profit)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Section>
      </div>

      <Section title="Recent estimates" description="Risk score reflects scope volatility and margin exposure">
        <ul className="space-y-5">
          {estimates.map((e) => (
            <li key={e.id} className="flex flex-wrap items-center gap-4">
              <div className="min-w-48 flex-1">
                <p className="text-sm font-medium">{e.project}</p>
                <p className="num text-xs text-muted-foreground">
                  {e.id} · {e.client}
                </p>
              </div>
              <div className="w-40">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Risk</span>
                  <span className="num">{e.risk}%</span>
                </div>
                <Progress value={e.risk} className="mt-1.5 h-1.5" />
              </div>
              <span className="num w-28 text-right text-sm font-medium">{currency(e.total)}</span>
              <Badge variant="outline">{e.status}</Badge>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}