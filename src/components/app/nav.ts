import {
  BarChart3,
  Boxes,
  Building2,
  CreditCard,
  FolderKanban,
  LayoutDashboard,
  Plug,
  Settings,
  Sparkles,
  Users,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = { label: string; to: string; icon: LucideIcon; group: string };

export const navItems: NavItem[] = [
  { label: "Dashboard", to: "/app", icon: LayoutDashboard, group: "Workspace" },
  { label: "CRM", to: "/app/crm", icon: Users, group: "Workspace" },
  { label: "AI Estimating", to: "/app/estimating", icon: Sparkles, group: "Workspace" },
  { label: "Projects", to: "/app/projects", icon: FolderKanban, group: "Workspace" },
  { label: "Equipment", to: "/app/equipment", icon: Boxes, group: "Operations" },
  { label: "Team", to: "/app/team", icon: UsersRound, group: "Operations" },
  { label: "Financials", to: "/app/financials", icon: CreditCard, group: "Operations" },
  { label: "Analytics", to: "/app/analytics", icon: BarChart3, group: "Insights" },
  { label: "Client Portal", to: "/app/portal", icon: Building2, group: "Insights" },
  { label: "Integrations", to: "/app/integrations", icon: Plug, group: "Configure" },
  { label: "Settings", to: "/app/settings", icon: Settings, group: "Configure" },
];

export const navGroups = ["Workspace", "Operations", "Insights", "Configure"] as const;