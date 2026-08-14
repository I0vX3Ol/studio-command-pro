import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, Plus, Sparkles, Users } from "lucide-react";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/app/page-header";
import { Section } from "@/components/app/section";
import { StatCard } from "@/components/app/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { currency, customers, pipelineStages } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/crm")({
  head: () => ({
    meta: [
      { title: "CRM — BuildFlow AI" },
      {
        name: "description",
        content:
          "Track construction customers through a visual pipeline with AI relationship summaries and deal value.",
      },
      { property: "og:title", content: "CRM — BuildFlow AI" },
      {
        property: "og:description",
        content: "Pipeline, contacts and AI relationship intelligence for your clients.",
      },
    ],
  }),
  component: CrmPage,
});

function CrmPage() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(customers[0]!.id);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.contact.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q),
    );
  }, [query]);

  const selected = customers.find((c) => c.id === selectedId) ?? customers[0]!;
  const total = customers.reduce((s, c) => s + c.value, 0);
  const won = customers.filter((c) => c.stage === "Won").reduce((s, c) => s + c.value, 0);

  return (
    <>
      <PageHeader
        title="Customer relationships"
        description="Every account, deal and conversation with AI-written context so nothing falls through."
        actions={
          <>
            <Button variant="outline">
              <Sparkles className="size-4" aria-hidden /> Draft follow-up
            </Button>
            <Button>
              <Plus className="size-4" aria-hidden /> New customer
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pipeline value" value={currency(total)} delta={9.2} icon={Users} />
        <StatCard label="Closed won" value={currency(won)} delta={12.5} hint="this quarter" />
        <StatCard label="Active accounts" value={String(customers.length)} hint="2 at risk" />
        <StatCard label="Avg. deal size" value={currency(total / customers.length)} delta={3.1} />
      </div>

      <Section
        title="Pipeline"
        description="Drag-free overview by stage"
        bodyClassName="p-4 sm:p-6"
      >
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
          {pipelineStages.map((stage) => {
            const items = customers.filter((c) => c.stage === stage);
            return (
              <div key={stage} className="rounded-xl bg-secondary/60 p-3">
                <div className="flex items-center justify-between px-1 pb-3">
                  <p className="text-xs font-semibold tracking-wide uppercase">{stage}</p>
                  <span className="num text-xs text-muted-foreground">{items.length}</span>
                </div>
                <div className="space-y-2">
                  {items.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedId(c.id)}
                      className={cn(
                        "w-full rounded-lg border border-border bg-card p-3 text-left transition-shadow hover:shadow-lift",
                        selectedId === c.id && "ring-2 ring-ring",
                      )}
                    >
                      <p className="truncate text-sm font-medium">{c.name}</p>
                      <p className="num mt-1 text-xs text-muted-foreground">{currency(c.value)}</p>
                    </button>
                  ))}
                  {items.length === 0 ? (
                    <p className="px-1 py-4 text-xs text-muted-foreground">No deals</p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Section
          title="Accounts"
          description={`${filtered.length} of ${customers.length} shown`}
          className="lg:col-span-2"
          action={
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search accounts…"
              className="h-9 w-48"
              aria-label="Search accounts"
            />
          }
          bodyClassName="p-0"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Account</th>
                  <th className="px-6 py-3 font-medium">Contact</th>
                  <th className="px-6 py-3 font-medium">Stage</th>
                  <th className="px-6 py-3 text-right font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className="cursor-pointer border-b border-border/60 last:border-0 hover:bg-secondary/60"
                  >
                    <td className="px-6 py-3">
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.city}</p>
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">{c.contact}</td>
                    <td className="px-6 py-3">
                      <Badge variant="secondary">{c.stage}</Badge>
                    </td>
                    <td className="num px-6 py-3 text-right">{currency(c.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title={selected.name} description={`${selected.stage} · ${selected.health}`}>
          <dl className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="size-4" aria-hidden /> {selected.email}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="size-4" aria-hidden /> {selected.phone}
            </div>
          </dl>
          <div className="mt-5 rounded-xl bg-secondary p-4">
            <p className="flex items-center gap-2 text-xs font-semibold">
              <Sparkles className="size-3.5" aria-hidden /> AI relationship summary
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{selected.summary}</p>
          </div>
          <div className="mt-5 flex gap-2">
            <Button size="sm" className="flex-1">
              Log activity
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              Email
            </Button>
          </div>
        </Section>
      </div>
    </>
  );
}