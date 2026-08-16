import {
  LayoutDashboard,
  Users,
  Calculator,
  HardHat,
  Truck,
  UsersRound,
  Receipt,
  ChartNoAxesColumn,
  PanelsTopLeft,
  Plug,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = { label: string; to: string; icon: LucideIcon; hint: string };

export const navGroups: { group: string; items: NavItem[] }[] = [
  {
    group: "Overview",
    items: [
      { label: "Dashboard", to: "/app", icon: LayoutDashboard, hint: "Company pulse" },
      {
        label: "Analytics",
        to: "/app/analytics",
        icon: ChartNoAxesColumn,
        hint: "Performance & forecasting",
      },
    ],
  },
  {
    group: "Revenue",
    items: [
      { label: "CRM", to: "/app/crm", icon: Users, hint: "Customers & pipeline" },
      {
        label: "AI Estimating",
        to: "/app/estimating",
        icon: Calculator,
        hint: "Takeoffs & proposals",
      },
      { label: "Financials", to: "/app/financials", icon: Receipt, hint: "Invoices, AR/AP, cash" },
    ],
  },
  {
    group: "Operations",
    items: [
      { label: "Projects", to: "/app/projects", icon: HardHat, hint: "Boards, schedule, logs" },
      { label: "Equipment", to: "/app/equipment", icon: Truck, hint: "Fleet & maintenance" },
      { label: "Team", to: "/app/team", icon: UsersRound, hint: "People & time" },
    ],
  },
  {
    group: "Workspace",
    items: [
      { label: "Client Portal", to: "/app/portal", icon: PanelsTopLeft, hint: "What clients see" },
      { label: "Integrations", to: "/app/integrations", icon: Plug, hint: "Connected apps" },
      { label: "Settings", to: "/app/settings", icon: Settings, hint: "Profile, billing, keys" },
    ],
  },
];

export const allNavItems = navGroups.flatMap((g) => g.items);
