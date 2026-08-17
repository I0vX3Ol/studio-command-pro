import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader, Section, StatCard } from "@/components/shell/primitives";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import type { Integration } from "@/lib/remote-data";
import { fetchIntegrations, setIntegrationStatus } from "@/lib/remote-data";
import { Plug, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { RequireSubscription } from "@/lib/require-subscription";

export const Route = createFileRoute("/app/integrations")({
  loader: () => fetchIntegrations(),
  head: () => ({
    meta: [
      { title: "Integrations — BuildFlow AI" },
      {
        name: "description",
        content:
          "Connect accounting, payments, scheduling, messaging, and AI providers to your workspace.",
      },
      { property: "og:title", content: "Integrations — BuildFlow AI" },
      {
        property: "og:description",
        content: "Accounting, payments, scheduling, files, and AI — all connected.",
      },
    ],
  }),
  component: () => (
    <RequireSubscription feature="Integrations" minimumPlan="enterprise">
      <IntegrationsPage />
    </RequireSubscription>
  ),
});

function IntegrationsPage() {
  const loaded = Route.useLoaderData() as Integration[];
  const [items, setItems] = useState<Integration[]>(loaded);
  const [query, setQuery] = useState("");

  const requestedCount = items.filter((i) => i.status === "requested").length;

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? items.filter(
          (i) => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q),
        )
      : items;
    const map = new Map<string, typeof items>();
    for (const item of filtered) {
      const list = map.get(item.category) ?? [];
      list.push(item);
      map.set(item.category, list);
    }
    return Array.from(map.entries());
  }, [items, query]);

  async function toggle(item: Integration) {
    const next = item.status === "requested" ? "available" : "requested";
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: next } : i)));
    try {
      await setIntegrationStatus(item.id, next);
      toast.success(
        next === "requested"
          ? `${item.name} queued — we'll email you when the connector is live.`
          : `${item.name} removed from your setup queue.`,
      );
    } catch (err) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
      toast.error("Couldn't save that change", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Workspace"
        title="Integrations"
        description="Tell us which tools you want wired up. Connectors are being rolled out one at a time — flagging one here puts your workspace in the queue."
        actions={
          <Button variant="outline" className="rounded-xl" onClick={() => setQuery("")}>
            <Plug className="size-4" />
            Show all
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Requested"
          value={String(requestedCount)}
          hint={`of ${items.length} in the catalogue`}
        />
        <StatCard label="Categories" value={String(new Set(items.map((i) => i.category)).size)} />
        <StatCard label="Live connectors" value="0" hint="Rolling out soon" />
      </div>

      <div className="relative max-w-sm">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search integrations…"
          className="rounded-xl pl-9"
          aria-label="Search integrations"
        />
      </div>

      {grouped.length === 0 ? (
        <Section>
          <p className="py-6 text-center text-sm text-muted-foreground">
            No integrations match “{query}”.
          </p>
        </Section>
      ) : (
        grouped.map(([category, list]) => (
          <Section key={category} title={category} padded={false}>
            <ul className="divide-y divide-border">
              {list.map((i) => (
                <li key={i.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-muted text-sm font-semibold">
                    {i.name.slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{i.name}</p>
                      {i.status === "requested" ? (
                        <Badge variant="outline" className="rounded-full">
                          Setup requested
                        </Badge>
                      ) : null}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{i.desc}</p>
                  </div>
                  <Switch
                    checked={i.status === "requested"}
                    onCheckedChange={() => void toggle(i)}
                    aria-label={`${i.status === "requested" ? "Remove" : "Request"} ${i.name} setup`}
                  />
                </li>
              ))}
            </ul>
          </Section>
        ))
      )}
    </>
  );
}
