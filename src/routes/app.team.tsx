import { createFileRoute } from "@tanstack/react-router";
import { Clock, ShieldCheck, UserPlus, UsersRound } from "lucide-react";

import { PageHeader } from "@/components/app/page-header";
import { Section } from "@/components/app/section";
import { StatCard } from "@/components/app/stat-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { employees } from "@/lib/mock-data";

export const Route = createFileRoute("/app/team")({
  head: () => ({
    meta: [
      { title: "Team — BuildFlow AI" },
      {
        name: "description",
        content:
          "Crew roster, certifications, timesheets and performance for field and office staff.",
      },
      { property: "og:title", content: "Team — BuildFlow AI" },
      {
        property: "og:description",
        content: "Roster, certifications, hours and performance across every crew.",
      },
    ],
  }),
  component: TeamPage,
});

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("");

function TeamPage() {
  const hours = employees.reduce((s, e) => s + e.hours, 0);
  const onSite = employees.filter((e) => e.status === "On site").length;

  return (
    <>
      <PageHeader
        title="Team"
        description="Roster, certifications and weekly hours for every crew member."
        actions={
          <Button>
            <UserPlus className="size-4" aria-hidden /> Invite member
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Headcount" value="42" icon={UsersRound} hint="5 shown" />
        <StatCard label="On site now" value={String(onSite)} icon={Clock} />
        <StatCard label="Hours this week" value={String(hours)} delta={3.4} />
        <StatCard label="Certs expiring" value="2" hint="within 30 days" icon={ShieldCheck} />
      </div>

      <Section title="Roster" description="Crew assignment and weekly performance" bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Member</th>
                <th className="px-6 py-3 font-medium">Crew</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Certifications</th>
                <th className="px-6 py-3 font-medium">Hours</th>
                <th className="w-40 px-6 py-3 font-medium">Performance</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id} className="border-b border-border/60 last:border-0">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback className="bg-secondary text-xs font-semibold">
                          {initials(e.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{e.name}</p>
                        <p className="text-xs text-muted-foreground">{e.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-muted-foreground">{e.crew}</td>
                  <td className="px-6 py-3">
                    <Badge variant={e.status === "PTO" ? "outline" : "secondary"}>{e.status}</Badge>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex flex-wrap gap-1">
                      {e.certs.map((c) => (
                        <Badge key={c} variant="outline" className="text-[0.65rem]">
                          {c}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="num px-6 py-3">{e.hours}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <Progress value={e.perf} className="h-1.5" />
                      <span className="num text-xs text-muted-foreground">{e.perf}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Timesheets" description="Week of Aug 11">
          <ul className="space-y-4">
            {employees.map((e) => (
              <li key={e.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{e.name}</span>
                  <span className="num text-xs text-muted-foreground">{e.hours} / 40 hrs</span>
                </div>
                <Progress value={(e.hours / 40) * 100} className="mt-2 h-1.5" />
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Safety & compliance" description="OSHA and certification tracking">
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 size-4 text-success" aria-hidden />
              <div>
                <p className="font-medium">0 recordable incidents</p>
                <p className="text-xs text-muted-foreground">218 days without a lost-time injury.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 size-4 text-warning" aria-hidden />
              <div>
                <p className="font-medium">2 certifications expiring</p>
                <p className="text-xs text-muted-foreground">
                  D. Brooks (Forklift) and M. Sato (OSHA 10) renew before Sept 9.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 size-4 text-muted-foreground" aria-hidden />
              <div>
                <p className="font-medium">Q3 training window</p>
                <p className="text-xs text-muted-foreground">
                  38 of 42 crew have completed the quarterly toolbox series.
                </p>
              </div>
            </li>
          </ul>
        </Section>
      </div>
    </>
  );
}