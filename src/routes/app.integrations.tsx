import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader, Section, StatCard } from "@/components/shell/primitives";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { integrations as seedIntegrations } from "@/lib/mock-data";
import { Plug, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/app/integrations")({
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
  component: IntegrationsPage,
});

function IntegrationsPage() {
  const [items, setItems] = useState(seedIntegrations.map((i) => ({ ...i })));
  const [query, setQuery] = useState("");

  const connectedCount = items.filter((i) => i.connected).length;

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

  function toggle(name: string) {
    setItems((prev) =>
      prev.map((i) => {
        if (i.name !== name) return i;
        const next = !i.connected;
        toast.success(`${i.name} ${next ? "connected" : "disconnected"}`);
        return { ...i, connected: next };
      }),
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Workspace"
        title="Integrations"
        description="Connect the tools your team already uses. Data syncs automatically once connected."
        actions={
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => toast.success("Integration directory opened")}
          >
            <Plug className="size-4" />
            Browse all
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Connected"
          value={String(connectedCount)}
          hint={`of ${items.length} available`}
        />
        <StatCard label="Categories" value={String(new Set(items.map((i) => i.category)).size)} />
        <StatCard label="Data synced today" value="12,480" hint="Records across apps" />
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
                <li key={i.name} className="flex items-center gap-4 px-6 py-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-muted text-sm font-semibold">
                    {i.name.slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{i.name}</p>
                      {i.connected ? (
                        <Badge
                          variant="outline"
                          className="rounded-full border-success/30 bg-transparent text-success"
                        >
                          Connected
                        </Badge>
                      ) : null}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{i.desc}</p>
                  </div>
                  <Switch
                    checked={i.connected}
                    onCheckedChange={() => toggle(i.name)}
                    aria-label={`${i.connected ? "Disconnect" : "Connect"} ${i.name}`}
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
