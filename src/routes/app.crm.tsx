import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader, Section, StatusPill } from "@/components/shell/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { currency, customers, pipeline } from "@/lib/mock-data";
import {
  FileText,
  Image as ImageIcon,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Sparkles,
  UploadCloud,
} from "lucide-react";

export const Route = createFileRoute("/app/crm")({
  head: () => ({
    meta: [
      { title: "CRM — BuildFlow AI" },
      {
        name: "description",
        content: "Customer profiles, lead pipeline, notes, tasks, and AI account summaries.",
      },
      { property: "og:title", content: "CRM — BuildFlow AI" },
      {
        property: "og:description",
        content: "Customer profiles, lead pipeline, and AI account summaries.",
      },
    ],
  }),
  component: CRMPage,
});

function CRMPage() {
  const [selectedId, setSelectedId] = useState(customers[0]!.id);
  const [query, setQuery] = useState("");
  const selected = customers.find((c) => c.id === selectedId)!;
  const filtered = customers.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <PageHeader
        eyebrow="Revenue"
        title="CRM"
        description="Every account, conversation, and open opportunity in one record."
        actions={
          <Button className="rounded-xl" onClick={() => toast.success("New customer form opened")}>
            <Plus className="size-4" />
            Add customer
          </Button>
        }
      />

      <Tabs defaultValue="accounts" className="space-y-6">
        <TabsList className="rounded-xl">
          <TabsTrigger value="accounts" className="rounded-lg">
            Accounts
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="rounded-lg">
            Pipeline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <Section padded={false}>
              <div className="border-b border-border p-3">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search accounts"
                    aria-label="Search accounts"
                    className="h-10 rounded-xl pl-9"
                  />
                </div>
              </div>
              <ul className="max-h-[520px] overflow-y-auto">
                {filtered.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => setSelectedId(c.id)}
                      className={`flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-accent ${
                        c.id === selectedId ? "bg-accent" : ""
                      }`}
                    >
                      <Avatar className="size-8">
                        <AvatarFallback className="text-[10px]">
                          {c.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{c.name}</p>
                        <p className="num truncate text-xs text-muted-foreground">
                          {currency(c.value)}
                        </p>
                      </div>
                      <StatusPill status={c.status} />
                    </button>
                  </li>
                ))}
              </ul>
            </Section>

            <div className="space-y-6">
              <Section>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">{selected.name}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {selected.contact} · Customer since {selected.since}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Mail className="size-3.5" />
                        {selected.email}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="size-3.5" />
                        {selected.phone}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="size-3.5" />
                        {selected.city}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Lifetime value</p>
                    <p className="num text-2xl font-semibold">{currency(selected.value)}</p>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4">
                  <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    <Sparkles className="size-3.5 text-signal" aria-hidden />
                    AI account summary
                  </p>
                  <p className="mt-2 text-sm leading-relaxed">{selected.summary}</p>
                </div>
              </Section>

              <div className="grid gap-6 md:grid-cols-2">
                <Section title="Timeline" padded={false}>
                  <ul className="divide-y divide-border">
                    {[
                      { t: "Call · 14 min", d: "Discussed Block 7 glazing lead time", w: "Today" },
                      { t: "Email", d: "Sent revised schedule of values", w: "Aug 11" },
                      { t: "Site visit", d: "Owner walkthrough with Mara", w: "Aug 06" },
                      { t: "Proposal", d: "EST-3309 delivered", w: "Aug 02" },
                    ].map((e) => (
                      <li key={e.t + e.w} className="px-6 py-3.5">
                        <p className="text-sm font-medium">{e.t}</p>
                        <p className="text-xs text-muted-foreground">
                          {e.d} · {e.w}
                        </p>
                      </li>
                    ))}
                  </ul>
                </Section>

                <Section title="Notes & tasks">
                  <Textarea placeholder="Add a note…" className="min-h-24 rounded-xl" />
                  <div className="mt-3 flex justify-end">
                    <Button
                      size="sm"
                      className="rounded-lg"
                      onClick={() => toast.success("Note saved")}
                    >
                      Save note
                    </Button>
                  </div>
                  <ul className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
                    <li className="flex items-center justify-between">
                      <span>Send updated insurance certificate</span>
                      <StatusPill status="Pending" />
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Schedule Q4 planning call</span>
                      <StatusPill status="Complete" />
                    </li>
                  </ul>
                </Section>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Section title="Files & photos">
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-10 text-center">
                    <UploadCloud className="size-5 text-muted-foreground" aria-hidden />
                    <p className="mt-2 text-sm text-muted-foreground">Drag files or photos here</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 rounded-lg"
                      onClick={() => toast.success("Upload started")}
                    >
                      Browse files
                    </Button>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <FileText className="size-4 text-muted-foreground" />
                      Contract — executed.pdf
                    </li>
                    <li className="flex items-center gap-2">
                      <ImageIcon className="size-4 text-muted-foreground" />
                      Site photos — Aug 11 (24)
                    </li>
                  </ul>
                </Section>

                <Section title="Location">
                  <div
                    className="flex h-56 items-center justify-center rounded-xl border border-border bg-muted/50"
                    role="img"
                    aria-label={`Map placeholder for ${selected.city}`}
                  >
                    <div className="text-center">
                      <MapPin className="mx-auto size-5 text-muted-foreground" aria-hidden />
                      <p className="mt-2 text-sm text-muted-foreground">{selected.city}</p>
                      <p className="text-xs text-muted-foreground">Map integration placeholder</p>
                    </div>
                  </div>
                </Section>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-5">
            {pipeline.map((col) => (
              <div key={col.stage} className="panel p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{col.stage}</p>
                  <Badge variant="secondary" className="rounded-full">
                    {col.deals.length}
                  </Badge>
                </div>
                <p className="num mt-1 text-xs text-muted-foreground">
                  {currency(col.deals.reduce((s, d) => s + d.value, 0))}
                </p>
                <ul className="mt-4 space-y-3">
                  {col.deals.map((d) => (
                    <li
                      key={d.name}
                      className="rounded-xl border border-border bg-background p-3 transition-shadow hover:shadow-soft"
                    >
                      <p className="text-sm font-medium leading-snug">{d.name}</p>
                      <p className="num mt-1.5 text-xs text-muted-foreground">
                        {currency(d.value)}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">{d.owner}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Section title="Call & email history" padded={false}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="text-right">When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  ["Call", "Ridgeline Properties", "Glazing lead time", "Today, 9:12 AM"],
                  ["Email", "Kestrel Industrial", "Retrofit RFP clarification", "Yesterday"],
                  ["Call", "Meridian Health Systems", "Wing C inspection window", "Aug 11"],
                  ["Email", "Harbor & Vine", "CO-014 pricing", "Aug 10"],
                ].map((r) => (
                  <TableRow key={r.join()}>
                    <TableCell className="font-medium">{r[0]}</TableCell>
                    <TableCell>{r[1]}</TableCell>
                    <TableCell className="text-muted-foreground">{r[2]}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{r[3]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Section>
        </TabsContent>
      </Tabs>
    </>
  );
}
