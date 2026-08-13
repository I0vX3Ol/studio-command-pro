export const org = {
  name: "Northline Construction Group",
  plan: "Scale",
  seats: 42,
  seatsUsed: 31,
};

export const currentUser = {
  name: "Avery Sloane",
  email: "avery@northline.build",
  role: "Operations Director",
  initials: "AS",
};

export const currency = (n: number, digits = 0) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });

export const kpis = [
  { label: "Revenue this month", value: 1284500, delta: 12.4, format: "currency" as const },
  { label: "Open estimates", value: 38, delta: 6.1, format: "number" as const },
  { label: "Projects in progress", value: 17, delta: -2.3, format: "number" as const },
  { label: "Jobs completed", value: 64, delta: 9.8, format: "number" as const },
  { label: "Invoices overdue", value: 214300, delta: -4.2, format: "currency" as const },
  { label: "Upcoming inspections", value: 9, delta: 0, format: "number" as const },
];

export const revenueSeries = [
  { month: "Jan", revenue: 742000, forecast: 720000 },
  { month: "Feb", revenue: 811000, forecast: 790000 },
  { month: "Mar", revenue: 905000, forecast: 880000 },
  { month: "Apr", revenue: 868000, forecast: 910000 },
  { month: "May", revenue: 1024000, forecast: 980000 },
  { month: "Jun", revenue: 1132000, forecast: 1060000 },
  { month: "Jul", revenue: 1201000, forecast: 1150000 },
  { month: "Aug", revenue: 1284500, forecast: 1220000 },
];

export const completionSeries = [
  { week: "W1", planned: 12, actual: 10 },
  { week: "W2", planned: 24, actual: 22 },
  { week: "W3", planned: 38, actual: 35 },
  { week: "W4", planned: 51, actual: 52 },
  { week: "W5", planned: 63, actual: 61 },
  { week: "W6", planned: 74, actual: 76 },
  { week: "W7", planned: 86, actual: 84 },
  { week: "W8", planned: 96, actual: 95 },
];

export const weather = {
  location: "Denver, CO",
  temp: 78,
  condition: "Partly cloudy",
  wind: 8,
  precip: 10,
  forecast: [
    { day: "Thu", hi: 78, lo: 56, condition: "Clear" },
    { day: "Fri", hi: 81, lo: 58, condition: "Clear" },
    { day: "Sat", hi: 72, lo: 54, condition: "Rain" },
    { day: "Sun", hi: 69, lo: 51, condition: "Storms" },
    { day: "Mon", hi: 75, lo: 55, condition: "Cloudy" },
  ],
};

export type Customer = {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  city: string;
  value: number;
  status: "Active" | "Prospect" | "Dormant";
  since: string;
  summary: string;
};

export const customers: Customer[] = [
  {
    id: "cus_ridge",
    name: "Ridgeline Properties",
    contact: "Dana Whitfield",
    email: "dana@ridgeline.co",
    phone: "(303) 555-0142",
    city: "Boulder, CO",
    value: 2840000,
    status: "Active",
    since: "2021",
    summary:
      "Repeat commercial developer, 6 projects delivered. Pays in 18 days on average. Sensitive to schedule slips; prefers weekly Friday updates.",
  },
  {
    id: "cus_harbor",
    name: "Harbor & Vine Hospitality",
    contact: "Miles Okafor",
    email: "miles@harborvine.com",
    phone: "(720) 555-0119",
    city: "Denver, CO",
    value: 1420000,
    status: "Active",
    since: "2022",
    summary:
      "Restaurant group expanding to 4 new locations. High change-order volume — margin protection requires strict scope documentation.",
  },
  {
    id: "cus_meridian",
    name: "Meridian Health Systems",
    contact: "Priya Raghavan",
    email: "praghavan@meridianhs.org",
    phone: "(303) 555-0188",
    city: "Aurora, CO",
    value: 3960000,
    status: "Active",
    since: "2019",
    summary:
      "Largest account by contract value. Requires OSHA documentation packets per phase and infection-control protocols on all interior work.",
  },
  {
    id: "cus_kestrel",
    name: "Kestrel Industrial",
    contact: "Tom Vasquez",
    email: "tvasquez@kestrelind.com",
    phone: "(970) 555-0173",
    city: "Fort Collins, CO",
    value: 890000,
    status: "Prospect",
    since: "2026",
    summary:
      "Warehouse retrofit RFP in review. Win probability estimated at 62% — competitor bid is 4% lower but timeline is 3 weeks longer.",
  },
  {
    id: "cus_alpine",
    name: "Alpine Civic Trust",
    contact: "Rae Lindqvist",
    email: "rae@alpinecivic.org",
    phone: "(719) 555-0155",
    city: "Colorado Springs, CO",
    value: 610000,
    status: "Dormant",
    since: "2020",
    summary:
      "Municipal grant cycle paused. Re-engage in Q1 when capital budgets reopen; prior work was a library envelope restoration.",
  },
];

export const pipeline = [
  {
    stage: "New lead",
    deals: [
      { name: "Sable Row Townhomes", value: 480000, owner: "J. Park" },
      { name: "Cottonwood Clinic", value: 720000, owner: "M. Reyes" },
    ],
  },
  {
    stage: "Qualified",
    deals: [
      { name: "Kestrel Warehouse Retrofit", value: 890000, owner: "A. Sloane" },
      { name: "Vine St. Kitchen Build", value: 310000, owner: "J. Park" },
    ],
  },
  {
    stage: "Estimating",
    deals: [
      { name: "Meridian Wing C", value: 2100000, owner: "D. Osei" },
      { name: "Harbor Rooftop Bar", value: 540000, owner: "M. Reyes" },
    ],
  },
  {
    stage: "Proposal sent",
    deals: [{ name: "Ridgeline Block 7", value: 1650000, owner: "A. Sloane" }],
  },
  {
    stage: "Won",
    deals: [{ name: "Meridian Imaging Suite", value: 980000, owner: "D. Osei" }],
  },
];

export type Project = {
  id: string;
  name: string;
  customer: string;
  pm: string;
  progress: number;
  budget: number;
  spent: number;
  due: string;
  health: "On track" | "At risk" | "Delayed";
  phase: string;
};

export const projects: Project[] = [
  {
    id: "prj_alpha",
    name: "Project Alpha — Meridian Wing C",
    customer: "Meridian Health Systems",
    pm: "Dele Osei",
    progress: 68,
    budget: 2100000,
    spent: 1372000,
    due: "Nov 14, 2026",
    health: "On track",
    phase: "Rough-in",
  },
  {
    id: "prj_block7",
    name: "Ridgeline Block 7",
    customer: "Ridgeline Properties",
    pm: "Avery Sloane",
    progress: 41,
    budget: 1650000,
    spent: 742000,
    due: "Jan 09, 2027",
    health: "At risk",
    phase: "Structure",
  },
  {
    id: "prj_rooftop",
    name: "Harbor Rooftop Bar",
    customer: "Harbor & Vine Hospitality",
    pm: "Mara Reyes",
    progress: 84,
    budget: 540000,
    spent: 498000,
    due: "Sep 22, 2026",
    health: "On track",
    phase: "Finishes",
  },
  {
    id: "prj_imaging",
    name: "Meridian Imaging Suite",
    customer: "Meridian Health Systems",
    pm: "Dele Osei",
    progress: 22,
    budget: 980000,
    spent: 168000,
    due: "Mar 30, 2027",
    health: "Delayed",
    phase: "Demolition",
  },
  {
    id: "prj_kitchen",
    name: "Vine St. Kitchen Build",
    customer: "Harbor & Vine Hospitality",
    pm: "Jae Park",
    progress: 95,
    budget: 310000,
    spent: 291000,
    due: "Aug 29, 2026",
    health: "On track",
    phase: "Punch list",
  },
];

export const kanbanColumns = [
  {
    id: "backlog",
    title: "Backlog",
    cards: [
      { id: "k1", title: "Order curtain wall glazing", project: "Block 7", owner: "AS", tag: "Procurement" },
      { id: "k2", title: "Confirm elevator inspection slot", project: "Wing C", owner: "DO", tag: "Compliance" },
    ],
  },
  {
    id: "scheduled",
    title: "Scheduled",
    cards: [
      { id: "k3", title: "Pour level 3 slab", project: "Block 7", owner: "MR", tag: "Field" },
      { id: "k4", title: "MEP coordination walk", project: "Wing C", owner: "DO", tag: "Field" },
      { id: "k5", title: "Hood install + balance", project: "Vine St.", owner: "JP", tag: "Subs" },
    ],
  },
  {
    id: "progress",
    title: "In progress",
    cards: [
      { id: "k6", title: "Rooftop railing fabrication", project: "Rooftop Bar", owner: "MR", tag: "Subs" },
      { id: "k7", title: "Med-gas rough-in", project: "Wing C", owner: "DO", tag: "Field" },
    ],
  },
  {
    id: "review",
    title: "Review",
    cards: [{ id: "k8", title: "Change order #14 pricing", project: "Rooftop Bar", owner: "AS", tag: "Finance" }],
  },
  {
    id: "done",
    title: "Done",
    cards: [
      { id: "k9", title: "Fire alarm pre-test", project: "Vine St.", owner: "JP", tag: "Compliance" },
      { id: "k10", title: "Site fence relocation", project: "Block 7", owner: "MR", tag: "Field" },
    ],
  },
];

export const ganttTasks = [
  { name: "Sitework & excavation", start: 0, span: 3, phase: "Site" },
  { name: "Foundations", start: 2, span: 3, phase: "Structure" },
  { name: "Structural steel", start: 4, span: 4, phase: "Structure" },
  { name: "Envelope & glazing", start: 7, span: 3, phase: "Envelope" },
  { name: "MEP rough-in", start: 8, span: 4, phase: "MEP" },
  { name: "Interior finishes", start: 11, span: 3, phase: "Finishes" },
  { name: "Commissioning & punch", start: 13, span: 2, phase: "Closeout" },
];

export const milestones = [
  { name: "Foundation sign-off", date: "Sep 04, 2026", status: "Complete" },
  { name: "Steel topping out", date: "Oct 12, 2026", status: "Complete" },
  { name: "Envelope dry-in", date: "Nov 20, 2026", status: "In progress" },
  { name: "Substantial completion", date: "Feb 06, 2027", status: "Upcoming" },
];

export const dailyLogs = [
  {
    date: "Aug 13, 2026",
    author: "Mara Reyes",
    crew: 18,
    weather: "78°F partly cloudy",
    note: "Level 3 deck prepped for pour. Rebar inspection passed at 10:20. Two hoist delays totaling 45 minutes.",
  },
  {
    date: "Aug 12, 2026",
    author: "Dele Osei",
    crew: 24,
    weather: "81°F clear",
    note: "Med-gas rough-in 60% complete on the east corridor. Delivered 42 door frames; 3 damaged and flagged for return.",
  },
  {
    date: "Aug 11, 2026",
    author: "Jae Park",
    crew: 9,
    weather: "74°F showers",
    note: "Punch list walk with owner rep. 31 items logged, 12 closed same day. Hood balancing scheduled for Thursday.",
  },
];

export const changeOrders = [
  { id: "CO-014", project: "Harbor Rooftop Bar", desc: "Upgraded railing spec to 316 stainless", amount: 28400, status: "Pending" },
  { id: "CO-013", project: "Meridian Wing C", desc: "Additional isolation room dampers", amount: 61200, status: "Approved" },
  { id: "CO-012", project: "Ridgeline Block 7", desc: "Rock excavation overage", amount: 47800, status: "Approved" },
  { id: "CO-011", project: "Vine St. Kitchen", desc: "Grease interceptor relocation", amount: -6400, status: "Rejected" },
];

export const punchList = [
  { item: "Touch-up paint, corridor 2B", trade: "Painting", status: "Open", due: "Aug 18" },
  { item: "Replace scratched door hardware", trade: "Doors", status: "Open", due: "Aug 19" },
  { item: "Recaulk window sills, west face", trade: "Glazing", status: "In review", due: "Aug 21" },
  { item: "Balance VAV boxes floor 3", trade: "Mechanical", status: "Closed", due: "Aug 08" },
];

export const equipment = [
  { id: "EQ-1042", name: "CAT 320 Excavator", type: "Heavy", site: "Block 7", status: "In use", util: 86, hours: 4120, service: "Sep 02", fuel: 412 },
  { id: "EQ-2210", name: "Genie S-65 Boom Lift", type: "Aerial", site: "Wing C", status: "In use", util: 71, hours: 1860, service: "Aug 24", fuel: 138 },
  { id: "EQ-3391", name: "Bobcat T76 Track Loader", type: "Compact", site: "Yard", status: "Idle", util: 34, hours: 2540, service: "Oct 11", fuel: 96 },
  { id: "EQ-4407", name: "Multiquip 45kW Generator", type: "Power", site: "Rooftop Bar", status: "In use", util: 62, hours: 980, service: "Sep 19", fuel: 260 },
  { id: "EQ-5518", name: "JLG 1055 Telehandler", type: "Lift", site: "Block 7", status: "Service", util: 12, hours: 3310, service: "Aug 15", fuel: 188 },
];

export const employees = [
  { name: "Dele Osei", role: "Senior Project Manager", crew: "Healthcare", status: "On site", hours: 38, certs: ["OSHA 30", "CHC"], rating: 4.9 },
  { name: "Mara Reyes", role: "Superintendent", crew: "Commercial", status: "On site", hours: 42, certs: ["OSHA 30", "First Aid"], rating: 4.8 },
  { name: "Jae Park", role: "Project Manager", crew: "Hospitality", status: "Remote", hours: 36, certs: ["OSHA 10"], rating: 4.6 },
  { name: "Luis Ferrer", role: "Foreman", crew: "Concrete", status: "On site", hours: 44, certs: ["OSHA 30", "Rigging"], rating: 4.7 },
  { name: "Nina Alvarez", role: "Estimator", crew: "Preconstruction", status: "Office", hours: 40, certs: ["LEED AP"], rating: 4.9 },
  { name: "Grant Whitmore", role: "Safety Manager", crew: "Company-wide", status: "PTO", hours: 0, certs: ["OSHA 500", "CHST"], rating: 4.8 },
];

export const timeOff = [
  { name: "Grant Whitmore", type: "Vacation", range: "Aug 10 – Aug 17", status: "Approved" },
  { name: "Nina Alvarez", type: "Personal", range: "Aug 26", status: "Pending" },
  { name: "Luis Ferrer", type: "Sick", range: "Aug 04", status: "Approved" },
];

export const invoices = [
  { id: "INV-2041", customer: "Meridian Health Systems", amount: 412000, due: "Aug 02, 2026", status: "Overdue" },
  { id: "INV-2038", customer: "Ridgeline Properties", amount: 286000, due: "Aug 20, 2026", status: "Sent" },
  { id: "INV-2035", customer: "Harbor & Vine Hospitality", amount: 94500, due: "Aug 28, 2026", status: "Sent" },
  { id: "INV-2029", customer: "Meridian Health Systems", amount: 331000, due: "Jul 30, 2026", status: "Paid" },
  { id: "INV-2024", customer: "Alpine Civic Trust", amount: 58200, due: "Jul 12, 2026", status: "Overdue" },
];

export const expenses = [
  { vendor: "Front Range Concrete", category: "Materials", amount: 128400, date: "Aug 11", project: "Block 7" },
  { vendor: "Summit Mechanical", category: "Subcontractor", amount: 214000, date: "Aug 09", project: "Wing C" },
  { vendor: "Rocky Mountain Rentals", category: "Equipment", amount: 18600, date: "Aug 08", project: "Rooftop Bar" },
  { vendor: "Bluebird Fuel", category: "Fuel", amount: 7420, date: "Aug 07", project: "Company-wide" },
];

export const purchaseOrders = [
  { id: "PO-8841", vendor: "Glasscraft Systems", amount: 342000, status: "Issued", eta: "Sep 08" },
  { id: "PO-8837", vendor: "Summit Mechanical", amount: 214000, status: "Partial", eta: "Aug 25" },
  { id: "PO-8829", vendor: "Front Range Concrete", amount: 128400, status: "Received", eta: "Delivered" },
];

export const cashFlow = [
  { month: "Apr", inflow: 890000, outflow: 742000 },
  { month: "May", inflow: 1024000, outflow: 861000 },
  { month: "Jun", inflow: 1132000, outflow: 918000 },
  { month: "Jul", inflow: 1201000, outflow: 1042000 },
  { month: "Aug", inflow: 1284500, outflow: 1096000 },
];

export const estimates = [
  { id: "EST-3312", project: "Kestrel Warehouse Retrofit", customer: "Kestrel Industrial", total: 890000, margin: 18.4, risk: "Medium", status: "Draft" },
  { id: "EST-3309", project: "Meridian Wing C — Phase 2", customer: "Meridian Health Systems", total: 2100000, margin: 21.2, risk: "Low", status: "Sent" },
  { id: "EST-3301", project: "Harbor Rooftop Bar", customer: "Harbor & Vine", total: 540000, margin: 15.1, risk: "High", status: "Approved" },
];

export const estimateBreakdown = [
  { category: "Labor", amount: 318000, hours: 4240 },
  { category: "Materials", amount: 402000, hours: 0 },
  { category: "Equipment", amount: 76000, hours: 0 },
  { category: "Subcontractors", amount: 214000, hours: 0 },
  { category: "General conditions", amount: 58000, hours: 0 },
];

export const estimateRevisions = [
  { rev: "R3", author: "Nina Alvarez", date: "Aug 12", note: "Applied 4% steel escalation, tightened crew loading" },
  { rev: "R2", author: "BuildFlow AI", date: "Aug 10", note: "Auto-extracted 214 quantities from blueprint set A-101 → A-118" },
  { rev: "R1", author: "Nina Alvarez", date: "Aug 08", note: "Initial takeoff from owner-provided PDF" },
];

export const activity = [
  { who: "Dana Whitfield", what: "approved change order CO-012", when: "12 min ago", kind: "customer" as const },
  { who: "BuildFlow AI", what: "flagged a 9-day slip risk on Meridian Imaging Suite", when: "44 min ago", kind: "ai" as const },
  { who: "Mara Reyes", what: "uploaded 24 jobsite photos to Block 7", when: "1 hr ago", kind: "team" as const },
  { who: "BuildFlow AI", what: "drafted a follow-up email to Kestrel Industrial", when: "2 hr ago", kind: "ai" as const },
  { who: "Miles Okafor", what: "paid INV-2029 · $331,000", when: "4 hr ago", kind: "customer" as const },
  { who: "Nina Alvarez", what: "published estimate EST-3309 to the client portal", when: "Yesterday", kind: "team" as const },
];

export const deadlines = [
  { title: "Meridian Wing C — envelope dry-in", date: "Nov 20", owner: "DO", urgency: "normal" as const },
  { title: "Block 7 permit renewal", date: "Aug 19", owner: "AS", urgency: "urgent" as const },
  { title: "Rooftop Bar final inspection", date: "Sep 09", owner: "MR", urgency: "normal" as const },
  { title: "Q3 tax filing package", date: "Sep 15", owner: "AS", urgency: "soon" as const },
];

export const analytics = {
  winRate: 46.8,
  avgProjectValue: 812000,
  leadConversion: 31.4,
  satisfaction: 4.7,
  productivity: 92,
  margin: 19.6,
};

export const marginSeries = [
  { month: "Mar", margin: 16.2 },
  { month: "Apr", margin: 17.4 },
  { month: "May", margin: 18.1 },
  { month: "Jun", margin: 18.9 },
  { month: "Jul", margin: 19.2 },
  { month: "Aug", margin: 19.6 },
];

export const forecastSeries = [
  { month: "Sep", low: 1180000, base: 1320000, high: 1460000 },
  { month: "Oct", low: 1220000, base: 1390000, high: 1550000 },
  { month: "Nov", low: 1260000, base: 1440000, high: 1640000 },
  { month: "Dec", low: 1190000, base: 1370000, high: 1580000 },
];

export const integrations = [
  { name: "QuickBooks", category: "Accounting", connected: true, desc: "Sync invoices, expenses, and the chart of accounts." },
  { name: "Stripe", category: "Payments", connected: true, desc: "Collect card and ACH payments from the client portal." },
  { name: "Google Calendar", category: "Scheduling", connected: true, desc: "Two-way sync for crew and inspection scheduling." },
  { name: "Outlook", category: "Scheduling", connected: false, desc: "Sync calendars and log email threads to customers." },
  { name: "Microsoft Teams", category: "Communication", connected: false, desc: "Post project alerts to channels." },
  { name: "Slack", category: "Communication", connected: true, desc: "Daily log digests and overdue-invoice alerts." },
  { name: "Dropbox", category: "Files", connected: false, desc: "Mirror project folders and photo archives." },
  { name: "Google Drive", category: "Files", connected: true, desc: "Attach drawings and proposals from Drive." },
  { name: "OneDrive", category: "Files", connected: false, desc: "Sync closeout document packages." },
  { name: "Twilio", category: "Messaging", connected: true, desc: "SMS reminders for inspections and crew dispatch." },
  { name: "SendGrid", category: "Messaging", connected: true, desc: "Transactional email for proposals and invoices." },
  { name: "OpenAI", category: "AI", connected: true, desc: "Powers estimating extraction and drafting." },
  { name: "Anthropic", category: "AI", connected: true, desc: "Powers long-document analysis and risk review." },
];

export const apiKeys = [
  { name: "Production", prefix: "bf_live_9f2c", created: "Mar 04, 2026", lastUsed: "2 min ago" },
  { name: "Staging", prefix: "bf_test_41ab", created: "Jun 18, 2026", lastUsed: "3 days ago" },
];

export const portalDocuments = [
  { name: "Wing C — Proposal R3.pdf", size: "4.2 MB", date: "Aug 12" },
  { name: "Schedule of Values.xlsx", size: "218 KB", date: "Aug 09" },
  { name: "Insurance Certificate.pdf", size: "96 KB", date: "Jul 28" },
];

export const aiSuggestions = [
  "Show overdue invoices",
  "Summarize Project Alpha",
  "Generate a proposal",
  "Estimate this blueprint",
  "Create tomorrow's schedule",
  "Write customer follow-up email",
  "Analyze profit margins",
  "Find missing documents",
  "Predict project delays",
];

export function aiAnswer(prompt: string): string {
  const q = prompt.toLowerCase();
  if (q.includes("overdue"))
    return "You have 2 overdue invoices totaling $470,200. INV-2041 (Meridian Health Systems, $412,000) is 11 days past due — their average payment lag is 18 days, so this is atypical. INV-2024 (Alpine Civic Trust, $58,200) is 32 days past due and the account is dormant. Recommended: escalate Meridian to Priya Raghavan and send a final notice to Alpine.";
  if (q.includes("alpha") || q.includes("summarize"))
    return "Project Alpha (Meridian Wing C) is 68% complete and on track for Nov 14. Spend is $1.37M of a $2.1M budget — 3 points under the earned-value curve. Open risks: med-gas rough-in is trailing by 4 days and 3 damaged door frames need reorder. Change orders total $61,200, all approved. Next milestone is envelope dry-in on Nov 20.";
  if (q.includes("proposal"))
    return "Drafted a branded proposal for Kestrel Warehouse Retrofit at $890,000 with an 18.4% margin. It includes scope narrative, schedule of values, a 14-week timeline, and your standard exclusions. Ready to export as PDF or send to tvasquez@kestrelind.com.";
  if (q.includes("blueprint") || q.includes("estimate"))
    return "Parsed 18 sheets (A-101 → A-118) and extracted 214 quantities. Labor: 4,240 hours / $318,000. Materials: $402,000. Equipment: $76,000. Subs: $214,000. Risk score: Medium — driven by steel escalation and an unclear site access detail on sheet A-104.";
  if (q.includes("schedule"))
    return "Tomorrow's schedule: 18 crew on Block 7 (level 3 pour, 6:00 AM start — 40% rain probability after 2 PM, recommend an early pour), 24 crew on Wing C (med-gas rough-in + MEP coordination walk at 10:00), 9 crew on Vine St. (hood balancing). Telehandler EQ-5518 is in service, so the Block 7 lift plan uses EQ-2210.";
  if (q.includes("email") || q.includes("follow"))
    return "Draft ready: a warm follow-up to Tom Vasquez referencing the retrofit RFP, restating your 3-week schedule advantage, and offering a site walk Tuesday or Thursday. Tone is concise and non-pushy. Want me to send it through SendGrid?";
  if (q.includes("margin") || q.includes("profit"))
    return "Blended margin is 19.6%, up 3.4 points over six months. Healthcare work carries 21.2%; hospitality trails at 15.1% because of change-order absorption on the Rooftop Bar. Tightening scope documentation on hospitality bids would add an estimated $84,000 annually.";
  if (q.includes("document") || q.includes("missing"))
    return "4 documents are missing: signed CO-014 (Rooftop Bar), the updated COI for Summit Mechanical (expired Aug 01), lien waivers for PO-8829, and the elevator inspection certificate for Wing C. I can request all four by email.";
  if (q.includes("delay") || q.includes("predict"))
    return "Meridian Imaging Suite has a 9-day slip risk (72% confidence) driven by demolition sequencing and a pending abatement clearance. Ridgeline Block 7 shows a 4-day risk tied to glazing lead time. All other active projects are within tolerance.";
  return "I can pull from every project, estimate, invoice, and daily log in your workspace. Try asking about overdue invoices, a project summary, margin analysis, or tomorrow's schedule.";
}
