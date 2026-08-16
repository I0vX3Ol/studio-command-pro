import { supabase } from "@/lib/supabase";
import {
  customers as sampleCustomers,
  invoices as sampleInvoices,
  projects as sampleProjects,
} from "@/lib/mock-data";
import type { Customer, Project } from "@/lib/mock-data";

/** Live invoice shape, extending the mock invoice with the fields the real table adds. */
export type Invoice = {
  id: string;
  customer: string;
  amount: number;
  due: string;
  status: string;
};

type CustomerRow = {
  id: string;
  name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  status: string | null;
  lifetime_value: number | null;
  notes: string | null;
  created_at: string;
};

type ProjectRow = {
  id: string;
  name: string;
  status: string | null;
  budget: number | null;
  pm: string | null;
  progress: number | null;
  spent: number | null;
  health: string | null;
  phase: string | null;
  end_date: string | null;
  buildflow_customers: { name: string } | null;
};

type InvoiceRow = {
  id: string;
  invoice_number: string | null;
  amount: number;
  status: string | null;
  due_date: string | null;
  buildflow_customers: { name: string } | null;
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function toCustomer(row: CustomerRow): Customer {
  return {
    id: row.id,
    name: row.name,
    contact: row.contact_name ?? "—",
    email: row.email ?? "—",
    phone: row.phone ?? "—",
    city: row.city ?? "—",
    value: row.lifetime_value ?? 0,
    status: (row.status as Customer["status"]) ?? "Active",
    since: String(new Date(row.created_at).getFullYear()),
    summary: row.notes ?? "",
  };
}

function toProject(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    customer: row.buildflow_customers?.name ?? "—",
    pm: row.pm ?? "—",
    progress: row.progress ?? 0,
    budget: row.budget ?? 0,
    spent: row.spent ?? 0,
    due: formatDate(row.end_date),
    health: (row.health as Project["health"]) ?? "On track",
    phase: row.phase ?? "—",
  };
}

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  sent: "Sent",
  paid: "Paid",
  overdue: "Overdue",
};

function toInvoice(row: InvoiceRow): Invoice {
  const statusKey = (row.status ?? "sent").toLowerCase();
  return {
    id: row.invoice_number ?? row.id.slice(0, 8).toUpperCase(),
    customer: row.buildflow_customers?.name ?? "—",
    amount: row.amount,
    due: formatDate(row.due_date),
    status: STATUS_LABELS[statusKey] ?? row.status ?? "Sent",
  };
}

export async function fetchCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase
    .from("buildflow_customers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data || data.length === 0) {
    if (error) console.warn("Falling back to sample customers:", error.message);
    return sampleCustomers;
  }
  return (data as CustomerRow[]).map(toCustomer);
}

export async function createCustomer(input: {
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  city?: string;
  status?: string;
}) {
  const { data, error } = await supabase
    .from("buildflow_customers")
    .insert({ status: "Prospect", ...input })
    .select("*")
    .single();
  if (error) throw error;
  return toCustomer(data as CustomerRow);
}

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("buildflow_projects")
    .select("*, buildflow_customers(name)")
    .order("created_at", { ascending: false });
  if (error || !data || data.length === 0) {
    if (error) console.warn("Falling back to sample projects:", error.message);
    return sampleProjects;
  }
  return (data as unknown as ProjectRow[]).map(toProject);
}

export async function createProject(input: {
  name: string;
  customer_id?: string;
  status?: string;
  budget?: number;
}) {
  const { data, error } = await supabase
    .from("buildflow_projects")
    .insert({ status: "Planning", progress: 0, spent: 0, health: "On track", ...input })
    .select("*, buildflow_customers(name)")
    .single();
  if (error) throw error;
  return toProject(data as unknown as ProjectRow);
}

export async function fetchInvoices(): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from("buildflow_invoices")
    .select("*, buildflow_customers(name)")
    .order("created_at", { ascending: false });
  if (error || !data || data.length === 0) {
    if (error) console.warn("Falling back to sample invoices:", error.message);
    return sampleInvoices;
  }
  return (data as unknown as InvoiceRow[]).map(toInvoice);
}

export async function createInvoice(input: {
  customer_id?: string;
  project_id?: string;
  amount: number;
  due_date?: string;
  invoice_number?: string;
}) {
  const { data, error } = await supabase
    .from("buildflow_invoices")
    .insert({ status: "draft", ...input })
    .select("*, buildflow_customers(name)")
    .single();
  if (error) throw error;
  return toInvoice(data as unknown as InvoiceRow);
}
