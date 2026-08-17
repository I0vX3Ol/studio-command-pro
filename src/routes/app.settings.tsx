import { createFileRoute, useRouter } from "@tanstack/react-router";
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
import { initials } from "@/lib/format";
import type { ApiKey, Organization, Profile } from "@/lib/remote-data";
import {
  createApiKey,
  fetchApiKeys,
  fetchEmployees,
  fetchOrganization,
  fetchProfile,
  revokeApiKey,
  updateOrganization,
  updateProfile,
} from "@/lib/remote-data";
import { Copy, KeyRound, Plus } from "lucide-react";
import { BillingPanel } from "@/components/billing/billing-panel";

export const Route = createFileRoute("/app/settings")({
  loader: async () => {
    const [profile, org, apiKeys, employees] = await Promise.all([
      fetchProfile(),
      fetchOrganization(),
      fetchApiKeys(),
      fetchEmployees(),
    ]);
    return { profile, org, apiKeys, seatsUsed: employees.length };
  },
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
  const { profile } = Route.useLoaderData() as { profile: Profile | null };
  const [name, setName] = useState(profile?.name ?? "");
  const [email, setEmail] = useState(profile?.email ?? "");
  const [role, setRole] = useState(profile?.title ?? "");

  const save = async () => {
    try {
      await updateProfile({ full_name: name, title: role });
      toast.success("Profile saved");
    } catch (err) {
      toast.error("Couldn't save profile", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  return (
    <Section title="Profile" description="This information is visible to your teammates.">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarFallback className="text-lg">{initials(name)}</AvatarFallback>
          </Avatar>
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => toast.info("Avatar uploads are not enabled yet.")}
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
          <Button className="rounded-xl" onClick={() => void save()}>
            Save changes
          </Button>
        </div>
      </div>
    </Section>
  );
}

function OrganizationTab() {
  const { org, seatsUsed } = Route.useLoaderData() as {
    org: Organization | null;
    seatsUsed: number;
  };
  const [orgName, setOrgName] = useState(org?.name ?? "");
  const seats = org?.seats ?? 0;
  const seatPct = seats > 0 ? Math.min(100, Math.round((seatsUsed / seats) * 100)) : 0;

  const saveOrg = async () => {
    try {
      await updateOrganization({ name: orgName });
      toast.success("Organization saved");
    } catch (err) {
      toast.error("Couldn't save organisation", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  return (
    <>
      <Section title="Organization" description="Company details and plan.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="org-name" label="Organization name" value={orgName} onChange={setOrgName} />
          <div className="space-y-2">
            <Label>Plan</Label>
            <div className="flex h-9 items-center gap-2">
              <StatusPill status="Active" />
              <span className="text-sm text-muted-foreground">{org?.plan ?? "Starter"} plan</span>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button className="rounded-xl" onClick={() => void saveOrg()}>
            Save changes
          </Button>
        </div>
      </Section>

      <Section title="Seats" description="Team members using BuildFlow AI.">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {seatsUsed} of {seats} seats used
          </span>
          <span className="num font-medium">{seatPct}%</span>
        </div>
        <Progress value={seatPct} className="mt-3 h-1.5" />
        <div className="mt-5">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => toast.info("Teammate invitations are not enabled yet.")}
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
  return <BillingPanel />;
}

function ApiKeysTab() {
  const router = useRouter();
  const { apiKeys } = Route.useLoaderData() as { apiKeys: ApiKey[] };

  const create = async () => {
    try {
      const key = await createApiKey("New key");
      await navigator.clipboard.writeText(key.secret).catch(() => undefined);
      toast.success("Key created and copied to your clipboard", {
        description: "This is the only time the full key is shown.",
        duration: 10000,
      });
      await router.invalidate();
    } catch (err) {
      toast.error("Couldn't create key", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  const revoke = async (key: ApiKey) => {
    try {
      await revokeApiKey(key.id);
      toast.success(`${key.name} revoked`);
      await router.invalidate();
    } catch (err) {
      toast.error("Couldn't revoke key", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  return (
    <Section
      title="API keys"
      description="Use these to authenticate requests to the BuildFlow API."
      padded={false}
      actions={
        <Button size="sm" className="rounded-lg" onClick={() => void create()}>
          <Plus className="size-4" />
          Create key
        </Button>
      }
    >
      <ul className="divide-y divide-border">
        {apiKeys.length === 0 ? (
          <li className="px-6 py-8 text-center text-sm text-muted-foreground">
            No keys yet. The full key is shown once, at creation.
          </li>
        ) : null}
        {apiKeys.map((key) => (
          <li key={key.id} className="flex items-center gap-4 px-6 py-4">
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
              size="sm"
              className="rounded-lg text-destructive hover:text-destructive"
              onClick={() => void revoke(key)}
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
