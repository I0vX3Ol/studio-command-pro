import { createFileRoute, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { PageHeader, Section, StatCard, StatusPill } from "@/components/shell/primitives";
import { axisProps, ChartTooltip } from "@/components/shell/chart-bits";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { initials } from "@/lib/format";
import type { Employee, TimeOffEntry } from "@/lib/remote-data";
import { createEmployee, fetchEmployees, fetchTimeOff } from "@/lib/remote-data";
import { UserPlus } from "lucide-react";

export const Route = createFileRoute("/app/team")({
  loader: async () => {
    const [employees, timeOff] = await Promise.all([fetchEmployees(), fetchTimeOff()]);
    return { employees, timeOff };
  },
  head: () => ({
    meta: [
      { title: "Team — BuildFlow AI" },
      {
        name: "description",
        content:
          "Employee directory, roles and permissions, time tracking, certifications, and performance.",
      },
      { property: "og:title", content: "Team — BuildFlow AI" },
      {
        property: "og:description",
        content: "Directory, time tracking, certifications, and crew performance.",
      },
    ],
  }),
  component: TeamPage,
});

function TeamPage() {
  const router = useRouter();
  const { employees, timeOff } = Route.useLoaderData() as {
    employees: Employee[];
    timeOff: TimeOffEntry[];
  };

  const hoursSeries = Object.entries(
    employees.reduce<Record<string, number>>((acc, e) => {
      const crew = e.crew === "—" ? "Unassigned" : e.crew;
      acc[crew] = (acc[crew] ?? 0) + e.hours;
      return acc;
    }, {}),
  ).map(([crew, hours]) => ({ crew, hours }));

  const totalHours = employees.reduce((sum, e) => sum + e.hours, 0);
  const onSite = employees.filter((e) => e.status === "On site").length;
  const certified = employees.filter((e) => e.certs.length > 0).length;

  const handleInvite = async () => {
    try {
      await createEmployee({ name: "New team member" });
      toast.success("Team member added — open their record to fill in the details.");
      await router.invalidate();
    } catch (err) {
      toast.error("Couldn't add team member", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="Team"
        description="Who's on site, what they're certified for, and how the crews are performing."
        actions={
          <Button className="rounded-xl" onClick={handleInvite}>
            <UserPlus className="size-4" />
            Invite employee
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Team members" value={String(employees.length)} />
        <StatCard label="Scheduled hours" value={totalHours.toLocaleString()} hint="Per week" />
        <StatCard label="On site now" value={String(onSite)} />
        <StatCard
          label="Certified"
          value={String(certified)}
          hint={`of ${employees.length} tracked`}
        />
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
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  No team members yet.
                </TableCell>
              </TableRow>
            ) : null}
            {employees.map((e) => (
              <TableRow key={e.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="text-[10px]">{initials(e.name)}</AvatarFallback>
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
                      <Badge key={c} variant="secondary" className="rounded-full text-[10px]">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="num text-right">{e.rating ?? "—"}</TableCell>
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
                <Bar
                  dataKey="hours"
                  fill="var(--color-chart-1)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Time off requests" padded={false}>
          <ul className="divide-y divide-border">
            {timeOff.length === 0 ? (
              <li className="px-6 py-8 text-center text-sm text-muted-foreground">
                No requests outstanding.
              </li>
            ) : null}
            {timeOff.map((t) => (
              <li key={t.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.type} · {t.range}
                  </p>
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-lg"
                  onClick={() => toast.success("Permissions opened")}
                >
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
            <Button
              variant="outline"
              className="mt-4 rounded-xl"
              onClick={() => toast.success("Provider list opened")}
            >
              Connect payroll
            </Button>
          </div>
        </Section>
      </div>
    </>
  );
}
