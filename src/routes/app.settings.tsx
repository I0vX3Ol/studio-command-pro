import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader, Section, StatusPill } from "@/components/shell/primitives";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { apiKeys, currentUser, org } from "@/lib/mock-data";
import { Copy, KeyRound, Plus } from "lucide-react";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — BuildFlow AI" },
      {
        name: "description",
        content:
          "Manage your profile, organization, billing, API keys, and notification preferences.",
      },
      { property: "og:title", content: "Settings — BuildFlow AI" },
      {
        property: "og:description",
        content: "Profile, organization, billing, API keys, and notifications.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Workspace"
        title="Settings"
        description="Manage your profile, organization, billing, and access."
      />

      <Tabs defaultValue="profile" className="gap-6">
        <TabsList className="w-full justify-start overflow-x-auto rounded-xl">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="api">API keys</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <ProfileTab />
        </TabsContent>
        <TabsContent value="organization" className="space-y-6">
          <OrganizationTab />
        </TabsContent>
        <TabsContent value="billing" className="space-y-6">
          <BillingTab />
        </TabsContent>
        <TabsContent value="api" className="space-y-6">
          <ApiKeysTab />
        </TabsContent>
        <TabsContent value="notifications" className="space-y-6">
          <NotificationsTab />
        </TabsContent>
      </Tabs>
    </>
  );
}

function ProfileTab() {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [role, setRole] = useState(currentUser.role);

  return (
    <Section title="Profile" description="This information is visible to your teammates.">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarFallback className="text-lg">{currentUser.initials}</AvatarFallback>
          </Avatar>
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => toast.success("Photo upload opened")}
          >
            Change photo
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="name" label="Full name" value={name} onChange={setName} />
          <Field id="email" label="Email" type="email" value={email} onChange={setEmail} />
          <Field id="role" label="Role" value={role} onChange={setRole} />
        </div>
        <div className="flex justify-end">
          <Button className="rounded-xl" onClick={() => toast.success("Profile saved")}>
            Save changes
          </Button>
        </div>
      </div>
    </Section>
  );
}

function OrganizationTab() {
  const [orgName, setOrgName] = useState(org.name);

  return (
    <>
      <Section title="Organization" description="Company details and plan.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="org-name" label="Organization name" value={orgName} onChange={setOrgName} />
          <div className="space-y-2">
            <Label>Plan</Label>
            <div className="flex h-9 items-center gap-2">
              <StatusPill status="Active" />
              <span className="text-sm text-muted-foreground">{org.plan} plan</span>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button className="rounded-xl" onClick={() => toast.success("Organization saved")}>
            Save changes
          </Button>
        </div>
      </Section>

      <Section title="Seats" description="Team members using BuildFlow AI.">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {org.seatsUsed} of {org.seats} seats used
          </span>
          <span className="num font-medium">{Math.round((org.seatsUsed / org.seats) * 100)}%</span>
        </div>
        <Progress value={(org.seatsUsed / org.seats) * 100} className="mt-3 h-1.5" />
        <div className="mt-5">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => toast.success("Invite dialog opened")}
          >
            <Plus className="size-4" />
            Invite teammate
          </Button>
        </div>
      </Section>
    </>
  );
}

function BillingTab() {
  return (
    <>
      <Section title="Current plan" description="Billed annually.">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Scale</p>
            <p className="num mt-1 text-3xl font-semibold">
              $1,200<span className="text-base font-normal text-muted-foreground">/mo</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Renews Mar 04, 2027 · {org.seats} seats
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => toast.success("Plan comparison opened")}
            >
              Change plan
            </Button>
            <Button className="rounded-xl" onClick={() => toast.success("Billing portal opened")}>
              Manage billing
            </Button>
          </div>
        </div>
      </Section>

      <Section title="Payment method" padded={false}>
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-12 items-center justify-center rounded-md border border-border bg-muted text-xs font-semibold">
              VISA
            </div>
            <div>
              <p className="text-sm font-medium">Visa ending 4242</p>
              <p className="text-xs text-muted-foreground">Expires 08 / 28</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-lg"
            onClick={() => toast.success("Update card opened")}
          >
            Update
          </Button>
        </div>
      </Section>

      <Section title="Invoices" padded={false}>
        <ul className="divide-y divide-border">
          {[
            { date: "Aug 04, 2026", amount: "$1,200.00", status: "Paid" },
            { date: "Jul 04, 2026", amount: "$1,200.00", status: "Paid" },
            { date: "Jun 04, 2026", amount: "$1,200.00", status: "Paid" },
          ].map(({ date, amount, status }) => (
            <li key={date} className="flex items-center justify-between px-6 py-4">
              <span className="text-sm">{date}</span>
              <div className="flex items-center gap-4">
                <span className="num text-sm text-muted-foreground">{amount}</span>
                <StatusPill status={status} />
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-lg"
                  onClick={() => toast.success("Receipt downloaded")}
                >
                  Receipt
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

function ApiKeysTab() {
  return (
    <Section
      title="API keys"
      description="Use these to authenticate requests to the BuildFlow API."
      padded={false}
      actions={
        <Button
          size="sm"
          className="rounded-lg"
          onClick={() => toast.success("New API key generated")}
        >
          <Plus className="size-4" />
          Create key
        </Button>
      }
    >
      <ul className="divide-y divide-border">
        {apiKeys.map((key) => (
          <li key={key.name} className="flex items-center gap-4 px-6 py-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <KeyRound className="size-4 text-muted-foreground" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{key.name}</p>
              <p className="num text-xs text-muted-foreground">
                {key.prefix}•••••••••••• · created {key.created} · last used {key.lastUsed}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-lg"
              aria-label={`Copy ${key.name} key`}
              onClick={() => toast.success("Key copied to clipboard")}
            >
              <Copy className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-lg text-destructive hover:text-destructive"
              onClick={() => toast.success(`${key.name} key revoked`)}
            >
              Revoke
            </Button>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function NotificationsTab() {
  const prefs = [
    {
      id: "overdue",
      label: "Overdue invoices",
      desc: "Alert me when an invoice becomes overdue.",
      on: true,
    },
    {
      id: "risk",
      label: "AI risk flags",
      desc: "Notify me when BuildFlow AI detects a project slip risk.",
      on: true,
    },
    {
      id: "co",
      label: "Change orders",
      desc: "Email me when a client approves or rejects a change order.",
      on: true,
    },
    {
      id: "digest",
      label: "Daily log digest",
      desc: "Send a summary of jobsite activity each evening.",
      on: false,
    },
    {
      id: "inspections",
      label: "Inspection reminders",
      desc: "Remind me 24 hours before scheduled inspections.",
      on: true,
    },
  ];

  return (
    <Section title="Notifications" description="Choose what BuildFlow AI sends you." padded={false}>
      <ul className="divide-y divide-border">
        {prefs.map((p) => (
          <li key={p.id} className="flex items-center justify-between gap-4 px-6 py-4">
            <div className="min-w-0">
              <Label htmlFor={`pref-${p.id}`} className="text-sm font-medium">
                {p.label}
              </Label>
              <p className="text-xs text-muted-foreground">{p.desc}</p>
            </div>
            <Switch
              id={`pref-${p.id}`}
              defaultChecked={p.on}
              onCheckedChange={(v) => toast.success(`${p.label} ${v ? "enabled" : "disabled"}`)}
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl"
      />
    </div>
  );
}
