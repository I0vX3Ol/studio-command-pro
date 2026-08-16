/**
 * Every read and write the BuildFlow app performs against Supabase.
 *
 * All rows are scoped to the caller's organisation by row-level security, and
 * `org_id` is filled in by a database trigger, so nothing here has to know (or
 * be trusted with) the tenant id. When a table is empty the app shows an empty
 * state — it never substitutes sample content for real data.
 */
import { supabase } from "@/lib/supabase";
import { formatDate, formatDateRange, formatShortDate, relativeTime } from "@/lib/format";

/* ------------------------------------------------------------------ types */

export type Customer = {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  city: string;
  value: number;
  status: string;
  since: string;
  summary: string;
};

export type Project = {
  id: string;
  name: string;
  customer: string;
  pm: string;
  progress: number;
  budget: number;
  spent: number;
  due: string;
  startDate: string | null;
  endDate: string | null;
  health: string;
  phase: string;
};

export type Invoice = {
  id: string;
  invoiceId: string;
  customer: string;
  amount: number;
  due: string;
  status: string;
};

export type Deal = { id: string; name: string; value: number; owner: string; stage: string };
export type PipelineStage = { stage: string; deals: Deal[] };

export const DEAL_STAGES = ["New lead", "Qualified", "Estimating", "Proposal sent", "Won"];

export type EquipmentItem = {
  id: string;
  assetTag: string;
  name: string;
  type: string;
  site: string;
  status: string;
  util: number;
  hours: number;
  fuel: number;
  service: string;
  isRental: boolean;
  rentalRate: number | null;
  rentalReturn: string;
};

export type ServiceLog = {
  id: string;
  equipment: string;
  description: string;
  date: string;
  cost: number | null;
  kind: string;
};

export type Employee = {
  id: string;
  name: string;
  role: string;
  crew: string;
  status: string;
  hours: number;
  certs: string[];
  rating: number | null;
};

export type TimeOffEntry = {
  id: string;
  name: string;
  type: string;
  range: string;
  status: string;
};

export type Expense = {
  id: string;
  vendor: string;
  category: string;
  amount: number;
  date: string;
  project: string;
};

export type PurchaseOrder = {
  id: string;
  poNumber: string;
  vendor: string;
  amount: number;
  status: string;
  eta: string;
};

export type EstimateLine = { category: string; amount: number; hours: number };

export type Estimate = {
  id: string;
  number: string;
  project: string;
  customer: string;
  total: number;
  margin: number | null;
  risk: string;
  status: string;
  lineItems: EstimateLine[];
};

export type EstimateRevision = {
  id: string;
  rev: string;
  author: string;
  date: string;
  note: string;
};

export type TaskCard = {
  id: string;
  title: string;
  project: string;
  owner: string;
  tag: string;
  column: string;
};

export type KanbanColumn = { id: string; title: string; cards: TaskCard[] };

export const TASK_COLUMNS = [
  { id: "backlog", title: "Backlog" },
  { id: "scheduled", title: "Scheduled" },
  { id: "progress", title: "In progress" },
  { id: "review", title: "Review" },
  { id: "done", title: "Done" },
];

export type DailyLog = {
  id: string;
  date: string;
  author: string;
  crew: number;
  weather: string;
  note: string;
};

export type ChangeOrder = {
  id: string;
  number: string;
  project: string;
  desc: string;
  amount: number;
  status: string;
};

export type PunchItem = { id: string; item: string; trade: string; status: string; due: string };
export type Milestone = { id: string; name: string; date: string; status: string };
export type DocumentRow = { id: string; name: string; size: string; date: string };

export type ActivityItem = {
  id: string;
  who: string;
  what: string;
  when: string;
  kind: string;
};

export type Integration = {
  id: string;
  name: string;
  category: string;
  desc: string;
  status: string;
  connected: boolean;
};

export type ApiKey = {
  id: string;
  name: string;
  prefix: string;
  created: string;
  lastUsed: string;
};

export type Organization = {
  id: string;
  name: string;
  plan: string;
  seats: number;
  city: string | null;
};

export type Profile = {
  id: string;
  name: string;
  email: string;
  role: string;
  title: string;
  phone: string;
};

export type MonthPoint = {
  month: string;
  monthStart: string;
  invoiced: number;
  collected: number;
  spent: number;
  margin: number;
};

export type WeekPoint = { week: string; weekStart: string; planned: number; actual: number };

export type Dashboard = {
  months: MonthPoint[];
  weeks: WeekPoint[];
  projectionBase: number;
  kpis: {
    revenueThisMonth: number;
    revenueLastMonth: number;
    openEstimates: number;
    projectsInProgress: number;
    projectsCompleted: number;
    overdueAmount: number;
    overdueCount: number;
    scheduledService: number;
    openPunchItems: number;
    activeEquipment: number;
    avgUtilization: number;
    fuelMonth: number;
    headcount: number;
    customers: number;
  };
  analytics: {
    winRate: number | null;
    avgProjectValue: number;
    leadConversion: number | null;
    openPipelineValue: number;
    backlogValue: number;
    changeOrderValue: number;
  };
  deadlines: { title: string; date: string; owner: string; source: string }[];
};

export const EMPTY_DASHBOARD: Dashboard = {
  months: [],
  weeks: [],
  projectionBase: 0,
  kpis: {
    revenueThisMonth: 0,
    revenueLastMonth: 0,
    openEstimates: 0,
    projectsInProgress: 0,
    projectsCompleted: 0,
    overdueAmount: 0,
    overdueCount: 0,
    scheduledService: 0,
    openPunchItems: 0,
    activeEquipment: 0,
    avgUtilization: 0,
    fuelMonth: 0,
    headcount: 0,
    customers: 0,
  },
  analytics: {
    winRate: null,
    avgProjectValue: 0,
    leadConversion: null,
    openPipelineValue: 0,
    backlogValue: 0,
    changeOrderValue: 0,
  },
  deadlines: [],
};

/* -------------------------------------------------------------- utilities */

type Row = Record<string, unknown>;

async function selectAll(view: string, select = "*", orderBy = "created_at"): Promise<Row[]> {
  const { data, error } = await supabase
    .from(view)
    .select(select)
    .order(orderBy, { ascending: false });
  if (error) {
    console.error(`Failed to load ${view}:`, error.message);
    return [];
  }
  return (data ?? []) as unknown as Row[];
}

const str = (v: unknown, fallback = "—") => (typeof v === "string" && v ? v : fallback);
const num = (v: unknown, fallback = 0) => (typeof v === "number" ? v : fallback);
const relatedName = (v: unknown) =>
  v && typeof v === "object" && "name" in (v as Row) ? str((v as Row)["name"]) : "—";

/* ------------------------------------------------------------- dashboard */

export async function fetchDashboard(): Promise<Dashboard> {
  const { data, error } = await supabase.rpc("buildflow_dashboard");
  if (error || !data || (data as Row)["error"]) {
    if (error) console.error("Failed to load dashboard metrics:", error.message);
    return EMPTY_DASHBOARD;
  }
  return data as unknown as Dashboard;
}

/** Trailing-average projection with an explicit band. Always labelled as a projection. */
export function buildForecast(dashboard: Dashboard) {
  const base = dashboard.projectionBase;
  if (!base) return [];
  const now = new Date();
  return Array.from({ length: 4 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i + 1, 1);
    return {
      month: d.toLocaleDateString("en-US", { month: "short" }),
      low: Math.round(base * 0.85),
      base: Math.round(base),
      high: Math.round(base * 1.15),
    };
  });
}

/* ------------------------------------------------------------- customers */

function toCustomer(r: Row): Customer {
  return {
    id: String(r["id"]),
    name: str(r["name"]),
    contact: str(r["contact_name"]),
    email: str(r["email"]),
    phone: str(r["phone"]),
    city: str(r["city"]),
    value: num(r["lifetime_value"]),
    status: str(r["status"], "Active"),
    since: String(new Date(String(r["created_at"])).getFullYear()),
    summary: str(r["notes"], ""),
  };
}

export async function fetchCustomers(): Promise<Customer[]> {
  return (await selectAll("buildflow_customers")).map(toCustomer);
}

export async function createCustomer(input: {
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  city?: string;
  status?: string;
}): Promise<Customer> {
  const { data, error } = await supabase
    .from("buildflow_customers")
    .insert({ status: "Prospect", ...input })
    .select("*")
    .single();
  if (error) throw error;
  return toCustomer(data as Row);
}

export async function updateCustomer(id: string, patch: Record<string, unknown>) {
  const { error } = await supabase.from("buildflow_customers").update(patch).eq("id", id);
  if (error) throw error;
}

/* -------------------------------------------------------------- projects */

function toProject(r: Row): Project {
  return {
    id: String(r["id"]),
    name: str(r["name"]),
    customer: relatedName(r["buildflow_customers"]),
    pm: str(r["pm"]),
    progress: num(r["progress"]),
    budget: num(r["budget"]),
    spent: num(r["spent"]),
    due: formatDate(r["end_date"] as string | null),
    startDate: (r["start_date"] as string | null) ?? null,
    endDate: (r["end_date"] as string | null) ?? null,
    health: str(r["health"], "On track"),
    phase: str(r["phase"]),
  };
}

export async function fetchProjects(): Promise<Project[]> {
  return (await selectAll("buildflow_projects", "*, buildflow_customers(name)")).map(toProject);
}

export async function createProject(input: {
  name: string;
  customer_id?: string;
  status?: string;
  budget?: number;
}): Promise<Project> {
  const { data, error } = await supabase
    .from("buildflow_projects")
    .insert({ status: "Planning", progress: 0, spent: 0, health: "On track", ...input })
    .select("*, buildflow_customers(name)")
    .single();
  if (error) throw error;
  return toProject(data as Row);
}

/** A schedule view built from real project start and end dates. */
export function buildGantt(projects: Project[], weeks: number) {
  const dated = projects.filter((p) => p.startDate && p.endDate);
  if (dated.length === 0) return [];
  const origin = Math.min(...dated.map((p) => new Date(p.startDate!).getTime()));
  const week = 7 * 24 * 60 * 60 * 1000;
  return dated.map((p) => {
    const start = Math.floor((new Date(p.startDate!).getTime() - origin) / week);
    const span = Math.max(
      1,
      Math.round((new Date(p.endDate!).getTime() - new Date(p.startDate!).getTime()) / week),
    );
    return {
      name: p.name,
      phase: p.phase,
      start: Math.max(0, Math.min(start, weeks - 1)),
      span: Math.min(span, weeks - Math.max(0, Math.min(start, weeks - 1))),
    };
  });
}

/* -------------------------------------------------------------- invoices */

const INVOICE_STATUS: Record<string, string> = {
  draft: "Draft",
  sent: "Sent",
  paid: "Paid",
  overdue: "Overdue",
};

function toInvoice(r: Row): Invoice {
  const raw = str(r["status"], "sent").toLowerCase();
  const due = r["due_date"] as string | null;
  const overdue = raw !== "paid" && due != null && new Date(due) < new Date();
  return {
    id: String(r["id"]),
    invoiceId: str(r["invoice_number"], String(r["id"]).slice(0, 8).toUpperCase()),
    customer: relatedName(r["buildflow_customers"]),
    amount: num(r["amount"]),
    due: formatDate(due),
    status: overdue ? "Overdue" : (INVOICE_STATUS[raw] ?? "Sent"),
  };
}

export async function fetchInvoices(): Promise<Invoice[]> {
  return (await selectAll("buildflow_invoices", "*, buildflow_customers(name)")).map(toInvoice);
}

export async function createInvoice(input: {
  customer_id?: string;
  project_id?: string;
  amount: number;
  due_date?: string;
  invoice_number?: string;
}): Promise<Invoice> {
  const { data, error } = await supabase
    .from("buildflow_invoices")
    .insert({ status: "draft", ...input })
    .select("*, buildflow_customers(name)")
    .single();
  if (error) throw error;
  return toInvoice(data as Row);
}

export async function markInvoicePaid(id: string) {
  const { error } = await supabase
    .from("buildflow_invoices")
    .update({ status: "paid" })
    .eq("id", id);
  if (error) throw error;
}

/* ----------------------------------------------------------------- deals */

export async function fetchPipeline(): Promise<PipelineStage[]> {
  const deals: Deal[] = (await selectAll("buildflow_deals")).map((r) => ({
    id: String(r["id"]),
    name: str(r["name"]),
    value: num(r["value"]),
    owner: str(r["owner"], ""),
    stage: str(r["stage"], "New lead"),
  }));
  return DEAL_STAGES.map((stage) => ({ stage, deals: deals.filter((d) => d.stage === stage) }));
}

export async function createDeal(input: {
  name: string;
  value?: number;
  owner?: string;
  stage?: string;
}) {
  const { error } = await supabase.from("buildflow_deals").insert(input);
  if (error) throw error;
}

export async function moveDeal(id: string, stage: string) {
  const { error } = await supabase.from("buildflow_deals").update({ stage }).eq("id", id);
  if (error) throw error;
}

/* ------------------------------------------------------------- equipment */

export async function fetchEquipment(): Promise<EquipmentItem[]> {
  return (await selectAll("buildflow_equipment")).map((r) => ({
    id: String(r["id"]),
    assetTag: str(r["asset_tag"], String(r["id"]).slice(0, 8).toUpperCase()),
    name: str(r["name"]),
    type: str(r["type"]),
    site: str(r["site"]),
    status: str(r["status"], "Idle"),
    util: num(r["utilization"]),
    hours: num(r["hours"]),
    fuel: num(r["fuel_gallons"]),
    service: formatShortDate(r["next_service_date"] as string | null),
    isRental: r["is_rental"] === true,
    rentalRate: typeof r["rental_rate_monthly"] === "number" ? r["rental_rate_monthly"] : null,
    rentalReturn: formatShortDate(r["rental_return_date"] as string | null),
  }));
}

export async function createEquipment(input: { name: string; type?: string; site?: string }) {
  const { error } = await supabase.from("buildflow_equipment").insert(input);
  if (error) throw error;
}

export async function fetchServiceLogs(): Promise<ServiceLog[]> {
  const rows = await selectAll(
    "buildflow_equipment_service_logs",
    "*, buildflow_equipment(name)",
    "service_date",
  );
  return rows.map((r) => ({
    id: String(r["id"]),
    equipment: relatedName(r["buildflow_equipment"]),
    description: str(r["description"]),
    date: formatShortDate(r["service_date"] as string | null),
    cost: typeof r["cost"] === "number" ? r["cost"] : null,
    kind: str(r["kind"], "completed"),
  }));
}

/* ---------------------------------------------------------------- people */

export async function fetchEmployees(): Promise<Employee[]> {
  return (await selectAll("buildflow_employees")).map((r) => ({
    id: String(r["id"]),
    name: str(r["name"]),
    role: str(r["role"]),
    crew: str(r["crew"]),
    status: str(r["status"], "Office"),
    hours: num(r["weekly_hours"]),
    certs: Array.isArray(r["certifications"]) ? (r["certifications"] as string[]) : [],
    rating: typeof r["rating"] === "number" ? r["rating"] : null,
  }));
}

export async function createEmployee(input: { name: string; role?: string; crew?: string }) {
  const { error } = await supabase.from("buildflow_employees").insert(input);
  if (error) throw error;
}

export async function fetchTimeOff(): Promise<TimeOffEntry[]> {
  const rows = await selectAll("buildflow_time_off", "*, buildflow_employees(name)", "start_date");
  return rows.map((r) => ({
    id: String(r["id"]),
    name: relatedName(r["buildflow_employees"]),
    type: str(r["type"]),
    range: formatDateRange(r["start_date"] as string | null, r["end_date"] as string | null),
    status: str(r["status"], "Pending"),
  }));
}

/* ------------------------------------------------------------- money out */

export async function fetchExpenses(): Promise<Expense[]> {
  const rows = await selectAll("buildflow_expenses", "*, buildflow_projects(name)", "spent_on");
  return rows.map((r) => ({
    id: String(r["id"]),
    vendor: str(r["vendor"]),
    category: str(r["category"]),
    amount: num(r["amount"]),
    date: formatShortDate(r["spent_on"] as string | null),
    project: relatedName(r["buildflow_projects"]),
  }));
}

export async function fetchPurchaseOrders(): Promise<PurchaseOrder[]> {
  return (await selectAll("buildflow_purchase_orders")).map((r) => ({
    id: String(r["id"]),
    poNumber: str(r["po_number"], String(r["id"]).slice(0, 8).toUpperCase()),
    vendor: str(r["vendor"]),
    amount: num(r["amount"]),
    status: str(r["status"], "Issued"),
    eta: formatShortDate(r["eta"] as string | null),
  }));
}

/* ------------------------------------------------------------ estimating */

export async function fetchEstimates(): Promise<Estimate[]> {
  const rows = await selectAll("buildflow_estimates", "*, buildflow_customers(name)");
  return rows.map((r) => ({
    id: String(r["id"]),
    number: str(r["estimate_number"], String(r["id"]).slice(0, 8).toUpperCase()),
    project: str(r["project_name"]),
    customer: relatedName(r["buildflow_customers"]),
    total: num(r["total"]),
    margin: typeof r["margin"] === "number" ? r["margin"] : null,
    risk: str(r["risk"]),
    status: str(r["status"], "Draft"),
    lineItems: Array.isArray(r["line_items"]) ? (r["line_items"] as EstimateLine[]) : [],
  }));
}

export async function createEstimate(input: { project_name: string; total?: number }) {
  const { error } = await supabase.from("buildflow_estimates").insert(input);
  if (error) throw error;
}

export async function fetchEstimateRevisions(): Promise<EstimateRevision[]> {
  return (await selectAll("buildflow_estimate_revisions")).map((r) => ({
    id: String(r["id"]),
    rev: str(r["revision"]),
    author: str(r["author"]),
    date: formatShortDate(r["created_at"] as string),
    note: str(r["note"], ""),
  }));
}

/* ----------------------------------------------------------------- field */

export async function fetchTaskBoard(): Promise<KanbanColumn[]> {
  const rows = await selectAll("buildflow_tasks", "*, buildflow_projects(name)", "position");
  const cards: TaskCard[] = rows.map((r) => ({
    id: String(r["id"]),
    title: str(r["title"]),
    project: relatedName(r["buildflow_projects"]),
    owner: str(r["owner"], ""),
    tag: str(r["tag"], ""),
    column: str(r["column_key"], "backlog"),
  }));
  return TASK_COLUMNS.map((col) => ({ ...col, cards: cards.filter((c) => c.column === col.id) }));
}

export async function moveTask(id: string, column: string) {
  const { error } = await supabase
    .from("buildflow_tasks")
    .update({
      column_key: column,
      completed_at: column === "done" ? new Date().toISOString() : null,
    })
    .eq("id", id);
  if (error) throw error;
}

export async function createTask(input: {
  title: string;
  column_key?: string;
  project_id?: string;
}) {
  const { error } = await supabase.from("buildflow_tasks").insert(input);
  if (error) throw error;
}

export async function fetchDailyLogs(): Promise<DailyLog[]> {
  return (await selectAll("buildflow_daily_logs", "*", "log_date")).map((r) => ({
    id: String(r["id"]),
    date: formatDate(r["log_date"] as string | null),
    author: str(r["author"]),
    crew: num(r["crew_count"]),
    weather: str(r["weather"], ""),
    note: str(r["note"], ""),
  }));
}

export async function createDailyLog(input: {
  note: string;
  author?: string;
  crew_count?: number;
  weather?: string;
}) {
  const { error } = await supabase.from("buildflow_daily_logs").insert(input);
  if (error) throw error;
}

export async function fetchChangeOrders(): Promise<ChangeOrder[]> {
  const rows = await selectAll("buildflow_change_orders", "*, buildflow_projects(name)");
  return rows.map((r) => ({
    id: String(r["id"]),
    number: str(r["co_number"], String(r["id"]).slice(0, 8).toUpperCase()),
    project: relatedName(r["buildflow_projects"]),
    desc: str(r["description"]),
    amount: num(r["amount"]),
    status: str(r["status"], "Pending"),
  }));
}

export async function fetchPunchList(): Promise<PunchItem[]> {
  return (await selectAll("buildflow_punch_list", "*", "due_date")).map((r) => ({
    id: String(r["id"]),
    item: str(r["item"]),
    trade: str(r["trade"]),
    status: str(r["status"], "Open"),
    due: formatShortDate(r["due_date"] as string | null),
  }));
}

export async function fetchMilestones(): Promise<Milestone[]> {
  return (await selectAll("buildflow_milestones", "*", "due_date")).reverse().map((r) => ({
    id: String(r["id"]),
    name: str(r["name"]),
    date: formatDate(r["due_date"] as string | null),
    status: str(r["status"], "Upcoming"),
  }));
}

/* -------------------------------------------------- documents & activity */

export async function fetchDocuments(portalOnly = false): Promise<DocumentRow[]> {
  let query = supabase
    .from("buildflow_documents")
    .select("*")
    .order("created_at", { ascending: false });
  if (portalOnly) query = query.eq("portal_visible", true);
  const { data, error } = await query;
  if (error) {
    console.error("Failed to load documents:", error.message);
    return [];
  }
  return ((data ?? []) as Row[]).map((r) => ({
    id: String(r["id"]),
    name: str(r["name"]),
    size: num(r["size_bytes"]) ? `${Math.round(num(r["size_bytes"]) / 1024)} KB` : "—",
    date: formatShortDate(r["created_at"] as string),
  }));
}

export async function fetchActivity(): Promise<ActivityItem[]> {
  return (await selectAll("buildflow_activity")).slice(0, 12).map((r) => ({
    id: String(r["id"]),
    who: str(r["actor"]),
    what: str(r["action"]),
    when: relativeTime(r["created_at"] as string),
    kind: str(r["kind"], "team"),
  }));
}

export async function logActivity(actor: string, action: string, kind = "team") {
  await supabase.from("buildflow_activity").insert({ actor, action, kind });
}

/* --------------------------------------------------- integrations & keys */

export async function fetchIntegrations(): Promise<Integration[]> {
  await supabase.rpc("buildflow_sync_integration_catalogue");
  return (await selectAll("buildflow_integrations", "*", "provider")).map((r) => ({
    id: String(r["id"]),
    name: str(r["provider"]),
    category: str(r["category"]),
    desc: str(r["description"], ""),
    status: str(r["status"], "available"),
    connected: str(r["status"]) === "connected",
  }));
}

export async function setIntegrationStatus(id: string, status: string) {
  const { error } = await supabase
    .from("buildflow_integrations")
    .update({ status, connected_at: status === "connected" ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) throw error;
}

export async function fetchApiKeys(): Promise<ApiKey[]> {
  return (await selectAll("buildflow_api_keys"))
    .filter((r) => r["revoked_at"] == null)
    .map((r) => ({
      id: String(r["id"]),
      name: str(r["name"]),
      prefix: str(r["prefix"]),
      created: formatDate(r["created_at"] as string),
      lastUsed: r["last_used_at"] ? relativeTime(r["last_used_at"] as string) : "Never used",
    }));
}

/** Returns the plaintext secret exactly once — it is never stored or retrievable again. */
export async function createApiKey(name: string, env: "live" | "test" = "live") {
  const { data, error } = await supabase.rpc("buildflow_create_api_key", {
    p_name: name,
    p_env: env,
  });
  if (error) throw error;
  return data as { id: string; name: string; prefix: string; secret: string };
}

export async function revokeApiKey(id: string) {
  const { error } = await supabase.rpc("buildflow_revoke_api_key", { p_id: id });
  if (error) throw error;
}

/* ------------------------------------------------ organisation & profile */

export async function fetchOrganization(): Promise<Organization | null> {
  const { data, error } = await supabase.from("buildflow_organizations").select("*").maybeSingle();
  if (error || !data) return null;
  const r = data as Row;
  return {
    id: String(r["id"]),
    name: str(r["name"]),
    plan: str(r["plan"], "Starter"),
    seats: num(r["seats"], 5),
    city: (r["city"] as string | null) ?? null,
  };
}

export async function updateOrganization(patch: Record<string, unknown>) {
  const { data: org } = await supabase.from("buildflow_organizations").select("id").maybeSingle();
  if (!org) return;
  const { error } = await supabase
    .from("buildflow_organizations")
    .update(patch)
    .eq("id", (org as Row)["id"] as string);
  if (error) throw error;
}

export async function fetchProfile(): Promise<Profile | null> {
  const { data, error } = await supabase.from("buildflow_profiles").select("*").maybeSingle();
  if (error || !data) return null;
  const r = data as Row;
  return {
    id: String(r["id"]),
    name: str(r["full_name"], str(r["email"])),
    email: str(r["email"]),
    role: str(r["role"], "member"),
    title: str(r["title"], ""),
    phone: str(r["phone"], ""),
  };
}

export async function updateProfile(patch: Record<string, unknown>) {
  const { data: me } = await supabase.auth.getUser();
  if (!me.user) return;
  const { error } = await supabase.from("buildflow_profiles").update(patch).eq("id", me.user.id);
  if (error) throw error;
}
