export const currency = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const org = {
  name: "Northbeam Construction",
  plan: "Scale",
  seats: 42,
};

export const user = {
  name: "Dana Whitfield",
  email: "dana@northbeam.co",
  role: "Operations Director",
  initials: "DW",
};

export const revenueSeries = [
  { month: "Jan", revenue: 412000, forecast: 400000, cost: 288000 },
  { month: "Feb", revenue: 448000, forecast: 430000, cost: 301000 },
  { month: "Mar", revenue: 521000, forecast: 470000, cost: 349000 },
  { month: "Apr", revenue: 498000, forecast: 505000, cost: 336000 },
  { month: "May", revenue: 604000, forecast: 545000, cost: 392000 },
  { month: "Jun", revenue: 662000, forecast: 590000, cost: 421000 },
  { month: "Jul", revenue: 715000, forecast: 640000, cost: 448000 },
  { month: "Aug", revenue: 784000, forecast: 690000, cost: 471000 },
];

export const completionSeries = [
  { week: "W1", planned: 12, actual: 10 },
  { week: "W2", planned: 18, actual: 17 },
  { week: "W3", planned: 26, actual: 22 },
  { week: "W4", planned: 34, actual: 33 },
  { week: "W5", planned: 44, actual: 41 },
  { week: "W6", planned: 52, actual: 54 },
];

export const customers = [
  {
    id: "c1",
    name: "Harborview Development",
    contact: "Marcus Lee",
    email: "marcus@harborview.com",
    phone: "(206) 555-0148",
    city: "Seattle, WA",
    stage: "Proposal",
    value: 840000,
    health: "Strong",
    summary:
      "Repeat commercial client, 4 projects delivered on time. Sensitive to schedule slippage; prefers weekly Friday updates. Expansion likely in Q4 for the Pier 9 retrofit.",
  },
  {
    id: "c2",
    name: "Alder & Stone Homes",
    contact: "Priya Raman",
    email: "priya@alderstone.com",
    phone: "(415) 555-0192",
    city: "Portland, OR",
    stage: "Negotiation",
    value: 312000,
    health: "At risk",
    summary:
      "Price sensitive after two change orders. Decision maker wants a fixed-fee option. Recommend a 6% markup with a contingency line item.",
  },
  {
    id: "c3",
    name: "Cedar Ridge Schools",
    contact: "Tom Alvarez",
    email: "talvarez@cedarridge.org",
    phone: "(503) 555-0110",
    city: "Bend, OR",
    stage: "Won",
    value: 1240000,
    health: "Strong",
    summary:
      "Public bid won on schedule confidence. Compliance documentation is the critical path—OSHA and prevailing wage reporting due monthly.",
  },
  {
    id: "c4",
    name: "Vantage Logistics",
    contact: "Ellen Ford",
    email: "ellen@vantagelog.com",
    phone: "(602) 555-0177",
    city: "Phoenix, AZ",
    stage: "Qualified",
    value: 96000,
    health: "Warm",
    summary:
      "Inbound lead from referral. Needs a warehouse dock retrofit before November. Budget unconfirmed.",
  },
  {
    id: "c5",
    name: "Marin Hospitality Group",
    contact: "Jules Okafor",
    email: "jules@maringroup.com",
    phone: "(628) 555-0133",
    city: "San Rafael, CA",
    stage: "New",
    value: 458000,
    health: "Warm",
    summary: "Boutique hotel renovation. Design still in flux; estimate should include allowances.",
  },
];

export const pipelineStages = ["New", "Qualified", "Proposal", "Negotiation", "Won"] as const;

export const projects = [
  {
    id: "p1",
    name: "Pier 9 Retrofit",
    client: "Harborview Development",
    pm: "R. Chen",
    progress: 72,
    status: "In progress",
    budget: 1_450_000,
    spent: 1_012_000,
    due: "Sep 30",
  },
  {
    id: "p2",
    name: "Cedar Ridge STEM Wing",
    client: "Cedar Ridge Schools",
    pm: "A. Novak",
    progress: 38,
    status: "In progress",
    budget: 2_100_000,
    spent: 764_000,
    due: "Dec 12",
  },
  {
    id: "p3",
    name: "Alder Townhomes B2",
    client: "Alder & Stone Homes",
    pm: "M. Sato",
    progress: 91,
    status: "Punch list",
    budget: 880_000,
    spent: 812_000,
    due: "Aug 22",
  },
  {
    id: "p4",
    name: "Vantage Dock 14",
    client: "Vantage Logistics",
    pm: "R. Chen",
    progress: 12,
    status: "Planning",
    budget: 240_000,
    spent: 18_000,
    due: "Nov 04",
  },
];

export const kanban = [
  {
    key: "backlog",
    title: "Backlog",
    cards: [
      { id: "k1", title: "Permit resubmittal — Dock 14", tag: "Compliance", who: "MS" },
      { id: "k2", title: "Site survey scheduling", tag: "Field", who: "RC" },
    ],
  },
  {
    key: "progress",
    title: "In progress",
    cards: [
      { id: "k3", title: "Structural steel erection", tag: "Pier 9", who: "AN" },
      { id: "k4", title: "MEP rough-in coordination", tag: "Cedar Ridge", who: "MS" },
      { id: "k5", title: "Change order #14 pricing", tag: "Alder", who: "DW" },
    ],
  },
  {
    key: "review",
    title: "Review",
    cards: [{ id: "k6", title: "Punch list walkthrough", tag: "Alder", who: "RC" }],
  },
  {
    key: "done",
    title: "Done",
    cards: [
      { id: "k7", title: "Foundation pour — Zone A", tag: "Cedar Ridge", who: "AN" },
      { id: "k8", title: "Safety orientation Q3", tag: "Team", who: "DW" },
    ],
  },
];

export const equipment = [
  {
    id: "e1",
    name: "CAT 336 Excavator",
    tag: "EX-336-04",
    site: "Pier 9",
    status: "Active",
    hours: 4820,
    util: 84,
    service: "Sep 12",
    fuel: 78,
  },
  {
    id: "e2",
    name: "Genie S-65 Boom Lift",
    tag: "BL-65-11",
    site: "Cedar Ridge",
    status: "Active",
    hours: 1290,
    util: 61,
    service: "Oct 02",
    fuel: 44,
  },
  {
    id: "e3",
    name: "Kenworth T880 Dump",
    tag: "TR-880-02",
    site: "Yard",
    status: "Maintenance",
    hours: 92400,
    util: 12,
    service: "Aug 18",
    fuel: 21,
  },
  {
    id: "e4",
    name: "Skyjack Scissor Lift",
    tag: "SL-19-07",
    site: "Alder B2",
    status: "Rented out",
    hours: 640,
    util: 92,
    service: "Nov 21",
    fuel: 66,
  },
];

export const employees = [
  {
    id: "u1",
    name: "Rosa Chen",
    role: "Senior PM",
    crew: "Commercial",
    status: "On site",
    hours: 38,
    certs: ["OSHA 30", "CPR"],
    perf: 96,
  },
  {
    id: "u2",
    name: "Andre Novak",
    role: "Superintendent",
    crew: "Institutional",
    status: "On site",
    hours: 42,
    certs: ["OSHA 30", "Rigging"],
    perf: 91,
  },
  {
    id: "u3",
    name: "Mei Sato",
    role: "Project Engineer",
    crew: "Residential",
    status: "Office",
    hours: 36,
    certs: ["OSHA 10"],
    perf: 88,
  },
  {
    id: "u4",
    name: "Devin Brooks",
    role: "Foreman",
    crew: "Civil",
    status: "PTO",
    hours: 0,
    certs: ["OSHA 30", "Forklift"],
    perf: 84,
  },
  {
    id: "u5",
    name: "Lena Ortiz",
    role: "Estimator",
    crew: "Preconstruction",
    status: "Office",
    hours: 40,
    certs: ["LEED AP"],
    perf: 93,
  },
];

export const invoices = [
  { id: "INV-2418", client: "Harborview Development", amount: 184_000, due: "Aug 02", status: "Overdue" },
  { id: "INV-2422", client: "Cedar Ridge Schools", amount: 96_500, due: "Aug 09", status: "Overdue" },
  { id: "INV-2431", client: "Alder & Stone Homes", amount: 42_300, due: "Aug 21", status: "Sent" },
  { id: "INV-2436", client: "Vantage Logistics", amount: 18_000, due: "Aug 28", status: "Draft" },
  { id: "INV-2402", client: "Marin Hospitality Group", amount: 210_000, due: "Jul 30", status: "Paid" },
];

export const expenses = [
  { id: "x1", vendor: "Pacific Steel Supply", category: "Materials", amount: 128_400, date: "Aug 09" },
  { id: "x2", vendor: "Union Labor Payroll", category: "Labor", amount: 342_800, date: "Aug 08" },
  { id: "x3", vendor: "Northwest Fuel Co.", category: "Fuel", amount: 12_200, date: "Aug 06" },
  { id: "x4", vendor: "SafeSite Rentals", category: "Equipment", amount: 26_500, date: "Aug 03" },
];

export const estimates = [
  { id: "EST-1093", project: "Pier 9 Retrofit", client: "Harborview", total: 1_452_000, risk: 22, status: "Sent" },
  { id: "EST-1096", project: "Dock 14 Retrofit", client: "Vantage", total: 246_500, risk: 48, status: "Draft" },
  { id: "EST-1099", project: "Hotel Lobby Reno", client: "Marin Group", total: 462_000, risk: 61, status: "In review" },
];

export const activity = [
  { id: "a1", who: "Rosa Chen", what: "approved Change Order #14", when: "12m ago", kind: "project" },
  { id: "a2", who: "BuildFlow AI", what: "flagged 3 invoices past 30 days", when: "38m ago", kind: "ai" },
  { id: "a3", who: "Harborview Development", what: "viewed proposal EST-1093", when: "1h ago", kind: "client" },
  { id: "a4", who: "BuildFlow AI", what: "generated material takeoff from 42 blueprint pages", when: "2h ago", kind: "ai" },
  { id: "a5", who: "Mei Sato", what: "uploaded 18 jobsite photos", when: "3h ago", kind: "project" },
  { id: "a6", who: "BuildFlow AI", what: "predicted 4-day delay risk on Cedar Ridge", when: "5h ago", kind: "ai" },
];

export const deadlines = [
  { id: "d1", title: "Cedar Ridge permit renewal", when: "Tomorrow", owner: "A. Novak", urgency: "high" },
  { id: "d2", title: "Pier 9 structural inspection", when: "Aug 15", owner: "R. Chen", urgency: "med" },
  { id: "d3", title: "Alder B2 final walkthrough", when: "Aug 22", owner: "M. Sato", urgency: "med" },
  { id: "d4", title: "Q3 OSHA training window closes", when: "Aug 30", owner: "HR", urgency: "low" },
];

export const integrations = [
  { name: "QuickBooks", category: "Accounting", connected: true, blurb: "Two-way sync for invoices, expenses, and the chart of accounts." },
  { name: "Stripe", category: "Payments", connected: true, blurb: "Collect card and ACH payments directly from client invoices." },
  { name: "Google Calendar", category: "Scheduling", connected: true, blurb: "Push crew schedules and inspections to field calendars." },
  { name: "Outlook", category: "Scheduling", connected: false, blurb: "Sync meetings and email threads to customer timelines." },
  { name: "Microsoft Teams", category: "Communication", connected: false, blurb: "Route project alerts into channel-based workflows." },
  { name: "Slack", category: "Communication", connected: true, blurb: "Daily log digests and overdue invoice alerts." },
  { name: "Dropbox", category: "Storage", connected: false, blurb: "Mirror drawings and submittals to shared folders." },
  { name: "Google Drive", category: "Storage", connected: true, blurb: "Attach Drive documents to projects and estimates." },
  { name: "OneDrive", category: "Storage", connected: false, blurb: "Enterprise document sync with retention policies." },
  { name: "Twilio", category: "Messaging", connected: false, blurb: "SMS crew dispatch and customer appointment reminders." },
  { name: "SendGrid", category: "Messaging", connected: true, blurb: "Transactional email for proposals and receipts." },
  { name: "OpenAI", category: "AI", connected: true, blurb: "Powers estimating, summaries, and document extraction." },
  { name: "Anthropic", category: "AI", connected: true, blurb: "Long-context reasoning over specs and contracts." },
];

export const analytics = {
  winRate: 46,
  avgProject: 612_000,
  leadConversion: 31,
  satisfaction: 4.7,
  margin: 27.4,
  productivity: 88,
};

export const marginSeries = [
  { name: "Commercial", margin: 31 },
  { name: "Institutional", margin: 24 },
  { name: "Residential", margin: 19 },
  { name: "Civil", margin: 28 },
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

export const aiAnswers: Record<string, string> = {
  "show overdue invoices":
    "2 invoices are past due for a combined $280,500. INV-2418 (Harborview, $184,000) is 11 days late — their AP contact typically pays within 3 days of a nudge. INV-2422 (Cedar Ridge, $96,500) is 4 days late and blocked on a missing lien waiver.",
  "summarize project alpha":
    "Pier 9 Retrofit is 72% complete and tracking 4 days ahead of the baseline. $1.01M of the $1.45M budget is committed, projecting a 24.7% margin. The single risk is the Sept 15 structural inspection; steel erection must close out by Sept 11.",
  "analyze profit margins":
    "Blended margin is 27.4%, up 1.8 pts quarter over quarter. Commercial leads at 31%; Residential trails at 19% driven by rework on Alder B2. Cutting change-order turnaround from 9 to 4 days would recover roughly $84K annually.",
  "predict project delays":
    "Cedar Ridge STEM Wing carries a 62% probability of a 4-day slip: MEP rough-in is 3 days behind and the inspector's next window is Sept 2. Mitigation — add a second electrical crew Thursday and pre-stage the panel schedule.",
};