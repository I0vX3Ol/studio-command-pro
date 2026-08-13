import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { PageHeader, Section, StatCard, StatusPill } from "@/components/shell/primitives";
import { axisProps, ChartTooltip } from "@/components/shell/chart-bits";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { employees, timeOff } from "@/lib/mock-data";
import { UserPlus } from "lucide-react";

export const Route = createFileRoute("/app/team")({
  head: () => ({
    meta: [
      { title: "Team — BuildFlow AI" },
      {
        name: "description",
        content: "Employee directory, roles and permissions, time tracking, certifications, and performance.",
      },
      { property: "og:title", content: "Team — BuildFlow AI" },
      { property: "og:description", content: "Directory, time tracking, certifications, and crew performance." },
    ],
  }),
  component: TeamPage,
});

const hoursSeries = [
  { crew: "Concrete", hours: 412 },
  { crew: "Healthcare", hours: 528 },
  { crew: "Commercial", hours: 476 },
  { crew: "Hospitality", hours: 288 },
  { crew: "Precon", hours: 160 },
];

function TeamPage() {
  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="Team"
        description="Who's on site, what they're certified for, and how the crews are performing."
        actions={
          <Button className="rounded-xl" onClick={() => toast.success("Invitation sent")}>
            <UserPlus className="size-4" />
            Invite employee
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active employees" value="31" delta={4.1} />
        <StatCard label="Hours this week" value="1,864" delta={2.6} />
        <StatCard label="Certifications expiring" value="3" delta={0} hint="Next 60 days" />
        <StatCard label="Productivity index" value="92" delta={1.8} />
      </div>

      <Section title="Directory" padded={false}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Crew</TableHead>
              <TableHead className="text-right">Hours</TableHead>
              <TableHead>Certifications</TableHead>
              <TableHead className="text-right">Rating</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((e) => (
              <TableRow key={e.name}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="text-[10px]">
                        {e.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{e.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{e.role}</TableCell>
                <TableCell className="text-muted-foreground">{e.crew}</TableCell>
                <TableCell className="num text-right">{e.hours}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1.5">
                    {e.certs.map((c) => (
                      <Badge key={c} variant="secondary" className="rounded-full text-[10px]">{c}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="num text-right">{e.rating}</TableCell>
                <TableCell>
                  <StatusPill status={e.status === "PTO" ? "Pending" : "Active"} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Section title="Hours by crew" description="Current week" className="lg:col-span-2">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hoursSeries} margin={{ left: -12, right: 8, top: 8 }}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="crew" {...axisProps} />
                <YAxis {...axisProps} />
                <ChartTooltip />
                <Bar dataKey="hours" fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Time off requests" padded={false}>
          <ul className="divide-y divide-border">
            {timeOff.map((t) => (
              <li key={t.name + t.range} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.type} · {t.range}</p>
                </div>
                <StatusPill status={t.status} />
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Roles & permissions" padded={false}>
          <ul className="divide-y divide-border">
            {[
              ["Owner", "Full access, billing, and API keys"],
              ["Project manager", "Projects, estimates, customers, and files"],
              ["Field crew", "Daily logs, photos, and time entry"],
              ["Accountant", "Invoices, expenses, and reports"],
            ].map(([role, desc]) => (
              <li key={role} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium">{role}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                <Button variant="ghost" size="sm" className="rounded-lg" onClick={() => toast.success("Permissions opened")}>
                  Edit
                </Button>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Payroll" description="Sync placeholder">
          <div className="rounded-xl border border-dashed border-border p-8 text-center">
            <p className="text-sm font-medium">Payroll provider not connected</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Approved time entries will flow straight into your payroll run.
            </p>
            <Button variant="outline" className="mt-4 rounded-xl" onClick={() => toast.success("Provider list opened")}>
              Connect payroll
            </Button>
          </div>
        </Section>
      </div>
    </>
  );
}
