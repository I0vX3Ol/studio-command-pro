import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader, Section, StatCard, StatusPill } from "@/components/shell/primitives";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { currency } from "@/lib/format";
import type { Customer, DocumentRow, Invoice, Project } from "@/lib/remote-data";
import { fetchCustomers, fetchDocuments, fetchInvoices, fetchProjects } from "@/lib/remote-data";
import { Download, ExternalLink, FileText } from "lucide-react";

export const Route = createFileRoute("/app/portal")({
  loader: async () => {
    const [customers, projects, invoices, documents] = await Promise.all([
      fetchCustomers(),
      fetchProjects(),
      fetchInvoices(),
      fetchDocuments(true),
    ]);
    return { customers, projects, invoices, documents };
  },
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
  const { customers, projects, invoices, documents } = Route.useLoaderData() as {
    customers: Customer[];
    projects: Project[];
    invoices: Invoice[];
    documents: DocumentRow[];
  };

  const defaultClient =
    customers.find((c) => projects.some((p) => p.customer === c.name))?.name ??
    customers[0]?.name ??
    "";
  const [client, setClient] = useState(defaultClient);

  const clientProjects = projects.filter((p) => p.customer === client);
  const clientInvoices = invoices.filter((i) => i.customer === client);
  const openBalance = clientInvoices
    .filter((i) => i.status !== "Paid")
    .reduce((s, i) => s + i.amount, 0);

  return (
    <>
      <PageHeader
        eyebrow="Workspace"
        title="Client Portal"
        description={
          client
            ? `A preview of what ${client} sees when they log in. Everything here is read-only for the client.`
            : "Add a customer to preview the client-facing portal."
        }
        actions={
          <>
            <select
              aria-label="Preview portal as customer"
              className="h-9 rounded-xl border border-border bg-background px-3 text-sm"
              value={client}
              onChange={(e) => setClient(e.target.value)}
            >
              {customers.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => toast.info("Client-facing portal links are not enabled yet.")}
            >
              <ExternalLink className="size-4" />
              Open live portal
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
        <StatCard label="Documents shared" value={String(documents.length)} />
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
            {documents.length === 0 ? (
              <li className="px-6 py-8 text-center text-sm text-muted-foreground">
                Nothing shared with clients yet.
              </li>
            ) : null}
            {documents.map((doc) => (
              <li key={doc.id} className="flex items-center gap-3 px-6 py-4">
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
            {clientInvoices.length === 0 ? (
              <li className="px-6 py-8 text-center text-sm text-muted-foreground">
                No invoices for this client.
              </li>
            ) : null}
            {clientInvoices.map((inv) => (
              <li key={inv.id} className="flex items-center gap-3 px-6 py-4">
                <div className="min-w-0 flex-1">
                  <p className="num text-sm font-medium">{inv.invoiceId}</p>
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
                    onClick={() => toast.success(`Payment link sent for ${inv.invoiceId}`)}
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
