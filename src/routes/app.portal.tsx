import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader, Section, StatCard, StatusPill } from "@/components/shell/primitives";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { currency, invoices, portalDocuments, projects } from "@/lib/mock-data";
import { Download, ExternalLink, FileText } from "lucide-react";

export const Route = createFileRoute("/app/portal")({
  head: () => ({
    meta: [
      { title: "Client Portal — BuildFlow AI" },
      {
        name: "description",
        content:
          "Preview the branded portal your clients see — project progress, documents, and invoices.",
      },
      { property: "og:title", content: "Client Portal — BuildFlow AI" },
      {
        property: "og:description",
        content: "The branded, client-facing view of progress, documents, and billing.",
      },
    ],
  }),
  component: PortalPage,
});

function PortalPage() {
  const clientProjects = projects.filter((p) => p.customer === "Meridian Health Systems");
  const clientInvoices = invoices.filter((i) => i.customer === "Meridian Health Systems");
  const openBalance = clientInvoices
    .filter((i) => i.status !== "Paid")
    .reduce((s, i) => s + i.amount, 0);

  return (
    <>
      <PageHeader
        eyebrow="Workspace"
        title="Client Portal"
        description="A preview of what Meridian Health Systems sees when they log in. Everything here is read-only for the client."
        actions={
          <>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => toast.success("Portal opened in a new tab")}
            >
              <ExternalLink className="size-4" />
              Open live portal
            </Button>
            <Button className="rounded-xl" onClick={() => toast.success("Client invitation sent")}>
              Invite client
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Shared projects"
          value={String(clientProjects.length)}
          hint="Visible to client"
        />
        <StatCard label="Open balance" value={currency(openBalance)} hint="Awaiting payment" />
        <StatCard label="Documents shared" value={String(portalDocuments.length)} />
      </div>

      <Section title="Project progress" description="Live status the client can follow">
        <ul className="space-y-6">
          {clientProjects.map((p) => (
            <li key={p.id}>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.phase} · Due {p.due}
                  </p>
                </div>
                <StatusPill status={p.health} />
              </div>
              <div className="mt-3 flex items-center gap-3">
                <Progress value={p.progress} className="h-1.5" />
                <span className="num w-10 text-right text-xs text-muted-foreground">
                  {p.progress}%
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Shared documents" padded={false}>
          <ul className="divide-y divide-border">
            {portalDocuments.map((doc) => (
              <li key={doc.name} className="flex items-center gap-3 px-6 py-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <FileText className="size-4 text-muted-foreground" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.size} · {doc.date}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg"
                  aria-label={`Download ${doc.name}`}
                  onClick={() => toast.success(`Downloading ${doc.name}`)}
                >
                  <Download className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Invoices" description="What the client can pay online" padded={false}>
          <ul className="divide-y divide-border">
            {clientInvoices.map((inv) => (
              <li key={inv.id} className="flex items-center gap-3 px-6 py-4">
                <div className="min-w-0 flex-1">
                  <p className="num text-sm font-medium">{inv.id}</p>
                  <p className="text-xs text-muted-foreground">Due {inv.due}</p>
                </div>
                <span className="num text-sm">{currency(inv.amount)}</span>
                {inv.status === "Paid" ? (
                  <Badge
                    variant="outline"
                    className="rounded-full border-success/30 bg-transparent text-success"
                  >
                    Paid
                  </Badge>
                ) : (
                  <Button
                    size="sm"
                    className="h-8 rounded-lg"
                    onClick={() => toast.success(`Payment link sent for ${inv.id}`)}
                  >
                    Pay now
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </>
  );
}
