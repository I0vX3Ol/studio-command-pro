import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, CreditCard, Moon, Shield, Sun } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/app/page-header";
import { Section } from "@/components/app/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { currency, org, user } from "@/lib/mock-data";
import { useTheme } from "@/lib/theme";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — BuildFlow AI" },
      {
        name: "description",
        content:
          "Manage your profile, company details, notification rules, plan and billing for BuildFlow AI.",
      },
      { property: "og:title", content: "Settings — BuildFlow AI" },
      {
        property: "og:description",
        content: "Profile, organization, notifications, security and billing controls.",
      },
    ],
  }),
  component: SettingsPage,
});

const notifications = [
  { id: "invoice", label: "Overdue invoice alerts", hint: "Daily digest at 8:00am", on: true },
  { id: "logs", label: "Daily field log summaries", hint: "Sent when crews close out", on: true },
  { id: "estimates", label: "Estimate approvals", hint: "Instant push and email", on: true },
  { id: "fleet", label: "Equipment maintenance windows", hint: "72 hours before service", on: false },
  { id: "weekly", label: "Weekly performance recap", hint: "Mondays with forecast deltas", on: false },
];

function SettingsPage() {
  const { theme, toggle } = useTheme();
  const [prefs, setPrefs] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(notifications.map((n) => [n.id, n.on])),
  );

  return (
    <>
      <PageHeader
        title="Settings"
        description="Profile, company, notifications, security and billing for your workspace."
        actions={<Button onClick={() => toast.success("Settings saved")}>Save changes</Button>}
      />

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Section title="Your profile" description="How teammates and clients see you">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" defaultValue={user.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Work email</Label>
                <Input id="email" type="email" defaultValue={user.email} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" defaultValue={user.role} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Mobile</Label>
                <Input id="phone" defaultValue="(415) 555-0184" />
              </div>
            </div>
          </Section>

          <Section title="Appearance" description="Theme applies to this device">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Dark mode</p>
                <p className="text-xs text-muted-foreground">Toggle anytime with ⌘\</p>
              </div>
              <Button variant="outline" onClick={toggle}>
                {theme === "dark" ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
                {theme === "dark" ? "Switch to light" : "Switch to dark"}
              </Button>
            </div>
          </Section>

          <Section title="Security" description="Protect your account and API access">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">Two-factor authentication</p>
                  <p className="text-xs text-muted-foreground">Authenticator app enabled</p>
                </div>
                <Badge variant="secondary" className="text-success">Active</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">Active sessions</p>
                  <p className="text-xs text-muted-foreground">3 devices · last from San Francisco, CA</p>
                </div>
                <Button variant="outline" onClick={() => toast.success("Signed out of other devices")}>
                  <Shield className="size-4" aria-hidden /> Sign out others
                </Button>
              </div>
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="organization" className="space-y-6">
          <Section title="Company details" description="Shown on estimates, invoices and the client portal">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="org">Company name</Label>
                <Input id="org" defaultValue={org.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license">Contractor license</Label>
                <Input id="license" defaultValue="CA-1042887" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Head office</Label>
                <Input id="address" defaultValue="1200 Embarcadero, San Francisco, CA" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="markup">Default markup</Label>
                <Input id="markup" defaultValue="18%" />
              </div>
            </div>
          </Section>

          <Section title="Seats" description="Manage who has access to the workspace">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="num text-sm font-medium">{org.seats} seats on the {org.plan} plan</p>
                <p className="text-xs text-muted-foreground">
                  Field crews use free mobile check-in seats.
                </p>
              </div>
              <Button variant="outline" onClick={() => toast.success("Invite sent")}>
                <Building2 className="size-4" aria-hidden /> Invite teammate
              </Button>
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Section title="Alert rules" description="Choose what reaches your inbox and phone">
            <ul className="divide-y divide-border">
              {notifications.map((n) => (
                <li key={n.id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{n.label}</p>
                    <p className="text-xs text-muted-foreground">{n.hint}</p>
                  </div>
                  <Switch
                    checked={Boolean(prefs[n.id])}
                    onCheckedChange={(v) => setPrefs((p) => ({ ...p, [n.id]: v }))}
                    aria-label={n.label}
                  />
                </li>
              ))}
            </ul>
          </Section>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Section title="Plan" description="Billing renews monthly">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">{org.plan} · {currency(4_620)}/mo</p>
                <p className="text-xs text-muted-foreground">
                  {org.seats} seats · unlimited projects · AI estimating included
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Compare plans</Button>
                <Button onClick={() => toast.success("Billing portal opened")}>
                  <CreditCard className="size-4" aria-hidden /> Manage billing
                </Button>
              </div>
            </div>
          </Section>

          <Section title="Invoices" description="Your BuildFlow subscription history">
            <ul className="divide-y divide-border text-sm">
              {[
                { id: "BF-2026-08", date: "Aug 01", amount: 4_620, status: "Paid" },
                { id: "BF-2026-07", date: "Jul 01", amount: 4_620, status: "Paid" },
                { id: "BF-2026-06", date: "Jun 01", amount: 4_290, status: "Paid" },
              ].map((b) => (
                <li key={b.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="num font-medium">{b.id}</p>
                    <p className="num text-xs text-muted-foreground">{b.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="num font-medium">{currency(b.amount)}</span>
                    <Badge variant="secondary">{b.status}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        </TabsContent>
      </Tabs>
    </>
  );
}
