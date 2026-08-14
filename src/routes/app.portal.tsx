import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, Download, FileText, MessageSquare, Share2 } from "lucide-react";

import { PageHeader } from "@/components/app/page-header";
import { Section } from "@/components/app/section";
import { StatCard } from "@/components/app/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { currency, invoices, projects } from "@/lib/mock-data";

export const Route = createFileRoute("/app/portal")({
  head: () => ({
    meta: [
      { title: "Client Portal — BuildFlow AI" },
      {
        name: "description",
        content:
          "The branded client view: live project progress, shared documents, approvals and one-click invoice payment.",
      },
      { property: "og:title", content: "Client Portal — BuildFlow AI" },
      {
        property: "og:description",
        content: "Preview exactly what your clients see: progress, documents and payments.",
      },
    ],
  }),
  component: PortalPage,
});

const documents = [
  { name: "Pier 9 — Structural drawings rev C", size: "18.2 MB", when: "Aug 09" },
  { name: "Change order #14 — signed", size: "412 KB", when: "Aug 07" },
  { name: "August progress photos", size: "64.8 MB", when: "Aug 05" },
  { name: "Cedar Ridge — schedule update", size: "1.1 MB", when: "Aug 02" },
];

const approvals = [
  { title: "Change order #15 — glazing upgrade", amount: 42_800, status: "Awaiting client" },
  { title: "Allowance reconciliation — millwork", amount: 12_400, status: "Awaiting client" },
  { title: "Substitution request — roof membrane", amount: 0, status: "Approved" },
];

const messages = [
  { who: "Harborview Development", text: "Can we walk the dock deck Thursday morning?", when: "2h ago" },
  { who: "Cedar Ridge Schools", text: "Board approved the STEM wing signage package.", when: "Yesterday" },
  { who: "Alder & Stone Homes", text: "Punch list items 4 and 7 look resolved.", when: "2d ago" },
];

function PortalPage() {
  const outstanding = invoices
    .filter((i) => i.status !== "Paid")
    .reduce((s, i) => s + i.amount, 0);

  return (
    <>
      <PageHeader
        title="Client portal"
        description="A branded, read-only workspace where clients track progress, sign approvals and pay."
        actions={
          <>
            <Button variant="outline">
              <Share2 className="size-4" aria-hidden /> Copy portal link
            </Button>
            <Button>Preview as client</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active portals" value="4" hint="One per client" />
        <StatCard label="Outstanding balance" value={currency(outstanding)} delta={-8.4} icon={CreditCard} />
        <StatCard label="Pending approvals" value="2" icon={FileText} />
        <StatCard label="Client messages" value="3" hint="Unread this week" icon={MessageSquare} />
      </div>

      <Section title="Project progress" description="Exactly what the client sees on their home screen">
        <ul className="space-y-5">
          {projects.map((p) => (
            <li key={p.id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.client} · PM {p.pm}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{p.status}</Badge>
                  <span className="num text-xs text-muted-foreground">Due {p.due}</span>
                </div>
              </div>
              <Progress value={p.progress} className="mt-2 h-1.5" />
            </li>
          ))}
        </ul>
      </Section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section
          title="Shared documents"
          description="Drawings, photos and signed paperwork"
          action={
            <Button variant="ghost" size="sm">
              <Download className="size-4" aria-hidden /> Export all
            </Button>
          }
        >
          <ul className="divide-y divide-border text-sm">
            {documents.map((d) => (
              <li key={d.name} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate font-medium">{d.name}</p>
                  <p className="num text-xs text-muted-foreground">{d.size}</p>
                </div>
                <span className="num shrink-0 text-xs text-muted-foreground">{d.when}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Approvals" description="Change orders and requests waiting on a signature">
          <ul className="divide-y divide-border text-sm">
            {approvals.map((a) => (
              <li key={a.title} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate font-medium">{a.title}</p>
                  <p className="num text-xs text-muted-foreground">
                    {a.amount ? currency(a.amount) : "No cost impact"}
                  </p>
                </div>
                <Badge variant={a.status === "Approved" ? "secondary" : "outline"}>{a.status}</Badge>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Client payments" description="Invoices visible in the portal">
          <ul className="divide-y divide-border text-sm">
            {invoices.map((i) => (
              <li key={i.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="num truncate font-medium">{i.id}</p>
                  <p className="truncate text-xs text-muted-foreground">{i.client}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="num font-medium">{currency(i.amount)}</span>
                  <Badge
                    variant={
                      i.status === "Overdue" ? "destructive" : i.status === "Paid" ? "secondary" : "outline"
                    }
                  >
                    {i.status}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Client messages" description="Threads started from the portal">
          <ul className="space-y-4 text-sm">
            {messages.map((m) => (
              <li key={m.who} className="rounded-xl bg-secondary/60 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{m.who}</p>
                  <span className="text-xs text-muted-foreground">{m.when}</span>
                </div>
                <p className="mt-1.5 text-muted-foreground">{m.text}</p>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </>
  );
}
