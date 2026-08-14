import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { KeyRound, Plug, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/app/page-header";
import { Section } from "@/components/app/section";
import { StatCard } from "@/components/app/stat-card";
import { EmptyState } from "@/components/app/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { integrations } from "@/lib/mock-data";

export const Route = createFileRoute("/app/integrations")({
  head: () => ({
    meta: [
      { title: "Integrations — BuildFlow AI" },
      {
        name: "description",
        content:
          "Connect QuickBooks, Stripe, Slack, Drive and AI providers so estimating, invoicing and field data stay in sync.",
      },
      { property: "og:title", content: "Integrations — BuildFlow AI" },
      {
        property: "og:description",
        content: "Accounting, payments, scheduling, storage and AI providers in one place.",
      },
    ],
  }),
  component: IntegrationsPage,
});

const webhooks = [
  { event: "invoice.paid", target: "https://hooks.northbeam.co/billing", status: "Healthy" },
  { event: "project.status_changed", target: "https://hooks.northbeam.co/ops", status: "Healthy" },
  { event: "estimate.approved", target: "https://hooks.northbeam.co/crm", status: "Retrying" },
];

function IntegrationsPage() {
  const [query, setQuery] = useState("");
  const [connected, setConnected] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(integrations.map((i) => [i.name, i.connected])),
  );

  const categories = useMemo(
    () => Array.from(new Set(integrations.map((i) => i.category))),
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return integrations;
    return integrations.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        i.blurb.toLowerCase().includes(q),
    );
  }, [query]);

  const activeCount = Object.values(connected).filter(Boolean).length;

  const toggle = (name: string) => {
    setConnected((prev) => {
      const next = !prev[name];
      toast.success(next ? `${name} connected` : `${name} disconnected`);
      return { ...prev, [name]: next };
    });
  };

  return (
    <>
      <PageHeader
        title="Integrations"
        description="Wire BuildFlow into the tools your office and field crews already run."
        actions={
          <>
            <Button variant="outline">
              <KeyRound className="size-4" aria-hidden /> API keys
            </Button>
            <Button onClick={() => toast.success("Sync started across connected apps")}>
              <RefreshCw className="size-4" aria-hidden /> Sync all
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Connected apps" value={String(activeCount)} icon={Plug} />
        <StatCard label="Available" value={String(integrations.length)} hint="Across 7 categories" />
        <StatCard label="Records synced (24h)" value="18,402" delta={3.1} />
        <StatCard label="Failed events" value="1" hint="estimate.approved retrying" />
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search integrations…"
          aria-label="Search integrations"
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Plug}
          title="No integrations match"
          description="Try a different app name or category — or request one from our team."
          action={<Button variant="outline" onClick={() => setQuery("")}>Clear search</Button>}
        />
      ) : (
        categories
          .filter((c) => filtered.some((i) => i.category === c))
          .map((category) => (
            <Section key={category} title={category} description={`${category} tools`}>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filtered
                  .filter((i) => i.category === category)
                  .map((i) => (
                    <div key={i.name} className="rounded-xl border border-border p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">{i.name}</p>
                          <Badge variant="secondary" className="mt-1.5">
                            {connected[i.name] ? "Connected" : "Not connected"}
                          </Badge>
                        </div>
                        <Switch
                          checked={Boolean(connected[i.name])}
                          onCheckedChange={() => toggle(i.name)}
                          aria-label={`Toggle ${i.name}`}
                        />
                      </div>
                      <p className="mt-3 text-xs text-muted-foreground">{i.blurb}</p>
                    </div>
                  ))}
              </div>
            </Section>
          ))
      )}

      <Section title="Webhooks" description="Outbound events delivered to your systems">
        <ul className="divide-y divide-border text-sm">
          {webhooks.map((w) => (
            <li key={w.event} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <p className="num font-medium">{w.event}</p>
                <p className="num truncate text-xs text-muted-foreground">{w.target}</p>
              </div>
              <Badge variant={w.status === "Healthy" ? "secondary" : "destructive"}>{w.status}</Badge>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
