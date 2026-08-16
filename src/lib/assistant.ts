/**
 * The workspace assistant.
 *
 * Every answer is computed from the signed-in organisation's own rows at the
 * moment the question is asked. There is no language model behind this and it
 * never invents a figure — if the data isn't there, it says so.
 */
import { currency } from "@/lib/format";
import {
  fetchDashboard,
  fetchEquipment,
  fetchEstimates,
  fetchInvoices,
  fetchProjects,
} from "@/lib/remote-data";

export const assistantSuggestions = [
  "Show overdue invoices",
  "Summarize my projects",
  "What's due soon?",
  "How are margins tracking?",
  "Equipment status",
  "Estimate pipeline",
];

function list(lines: string[]): string {
  return lines.map((l) => `• ${l}`).join("\n");
}

export async function answer(prompt: string): Promise<string> {
  const q = prompt.toLowerCase();

  if (q.includes("overdue") || q.includes("unpaid") || q.includes("receivab")) {
    const invoices = await fetchInvoices();
    const overdue = invoices.filter((i) => i.status === "Overdue");
    if (overdue.length === 0) {
      const outstanding = invoices.filter((i) => i.status !== "Paid");
      return outstanding.length === 0
        ? "Nothing outstanding — every invoice on file is paid."
        : `Nothing is past due. ${outstanding.length} invoice${outstanding.length === 1 ? " is" : "s are"} still open, worth ${currency(outstanding.reduce((s, i) => s + i.amount, 0))}.`;
    }
    const total = overdue.reduce((s, i) => s + i.amount, 0);
    return `${overdue.length} invoice${overdue.length === 1 ? " is" : "s are"} past due, worth ${currency(total)}.\n\n${list(
      overdue.map((i) => `${i.invoiceId} — ${i.customer} — ${currency(i.amount)}, due ${i.due}`),
    )}`;
  }

  if (q.includes("project") || q.includes("summar")) {
    const projects = await fetchProjects();
    if (projects.length === 0) return "You have no projects yet.";
    const spent = projects.reduce((s, p) => s + p.spent, 0);
    const budget = projects.reduce((s, p) => s + p.budget, 0);
    const atRisk = projects.filter((p) => p.health !== "On track");
    return `${projects.length} project${projects.length === 1 ? "" : "s"} on the books. ${currency(spent)} spent against ${currency(budget)} of budget.\n\n${list(
      projects
        .slice(0, 6)
        .map((p) => `${p.name} — ${p.progress}% complete, ${p.health}, due ${p.due}`),
    )}${atRisk.length > 0 ? `\n\n${atRisk.length} not marked on track.` : ""}`;
  }

  if (q.includes("due") || q.includes("deadline") || q.includes("upcoming")) {
    const dashboard = await fetchDashboard();
    if (dashboard.deadlines.length === 0) return "Nothing scheduled in the next stretch.";
    return `Next up:\n\n${list(
      dashboard.deadlines
        .slice(0, 8)
        .map(
          (d) =>
            `${new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} — ${d.title} (${d.owner})`,
        ),
    )}`;
  }

  if (q.includes("margin") || q.includes("profit") || q.includes("cash")) {
    const dashboard = await fetchDashboard();
    const withData = dashboard.months.filter((m) => m.collected > 0);
    if (withData.length === 0)
      return "No payments recorded yet, so there is nothing to calculate a margin from. Mark an invoice paid and this fills in.";
    const latest = withData.at(-1)!;
    return `Latest full picture — ${latest.month}: ${currency(latest.collected)} collected, ${currency(latest.spent)} spent, ${latest.margin}% margin.\n\n${list(
      withData.map(
        (m) => `${m.month}: ${currency(m.collected)} in, ${currency(m.spent)} out, ${m.margin}%`,
      ),
    )}`;
  }

  if (q.includes("equipment") || q.includes("fleet") || q.includes("asset")) {
    const equipment = await fetchEquipment();
    if (equipment.length === 0) return "No equipment on file yet.";
    return `${equipment.length} asset${equipment.length === 1 ? "" : "s"} tracked.\n\n${list(
      equipment.map((e) => `${e.name} — ${e.status}, ${e.util}% utilised, service ${e.service}`),
    )}`;
  }

  if (q.includes("estimate") || q.includes("bid") || q.includes("proposal")) {
    const estimates = await fetchEstimates();
    if (estimates.length === 0) return "No estimates yet.";
    const open = estimates.filter((e) => e.status === "Draft" || e.status === "Sent");
    return `${estimates.length} estimate${estimates.length === 1 ? "" : "s"}, ${open.length} still open, worth ${currency(open.reduce((s, e) => s + e.total, 0))}.\n\n${list(
      estimates.map(
        (e) =>
          `${e.number} — ${e.project} — ${currency(e.total)}${e.margin != null ? ` at ${e.margin}%` : ""} (${e.status})`,
      ),
    )}`;
  }

  return "I can pull from the projects, estimates, invoices, equipment and deadlines in your workspace. Try asking about overdue invoices, project status, upcoming deadlines, margins, equipment, or estimates.";
}
