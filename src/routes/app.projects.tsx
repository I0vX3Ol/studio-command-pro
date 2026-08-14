import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, HardHat, Plus } from "lucide-react";

import { PageHeader } from "@/components/app/page-header";
import { Section } from "@/components/app/section";
import { StatCard } from "@/components/app/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { currency, kanban, projects } from "@/lib/mock-data";

export const Route = createFileRoute("/app/projects")({
  head: () => ({
    meta: [
      { title: "Projects — BuildFlow AI" },
      {
        name: "description",
        content:
          "Project portfolio with budgets, progress, task board and schedule for every active jobsite.",
      },
      { property: "og:title", content: "Projects — BuildFlow AI" },
      {
        property: "og:description",
        content: "Budgets, progress and task boards across every active jobsite.",
      },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const budget = projects.reduce((s, p) => s + p.budget, 0);
  const spent = projects.reduce((s, p) => s + p.spent, 0);

  return (
    <>
      <PageHeader
        title="Projects"
        description="Portfolio health across every active jobsite — budget, progress and critical path."
        actions={
          <Button>
            <Plus className="size-4" aria-hidden /> New project
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active projects" value={String(projects.length)} icon={HardHat} />
        <StatCard label="Total budget" value={currency(budget)} delta={6.4} />
        <StatCard label="Committed" value={currency(spent)} hint={`${Math.round((spent / budget) * 100)}% of budget`} />
        <StatCard label="On schedule" value="3 of 4" delta={-2.5} hint="1 at risk" />
      </div>

      <Tabs defaultValue="portfolio">
        <TabsList>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="board">Task board</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="mt-6 grid gap-4 md:grid-cols-2">
          {projects.map((p) => (
            <div key={p.id} className="surface p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold">{p.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {p.client} · PM {p.pm}
                  </p>
                </div>
                <Badge variant={p.status === "Planning" ? "outline" : "secondary"}>{p.status}</Badge>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span className="num">{p.progress}%</span>
                </div>
                <Progress value={p.progress} className="mt-2 h-1.5" />
              </div>
              <dl className="mt-5 grid grid-cols-3 gap-3 text-xs">
                <div>
                  <dt className="text-muted-foreground">Budget</dt>
                  <dd className="num mt-0.5 font-medium">{currency(p.budget)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Spent</dt>
                  <dd className="num mt-0.5 font-medium">{currency(p.spent)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Due</dt>
                  <dd className="num mt-0.5 font-medium">{p.due}</dd>
                </div>
              </dl>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="board" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {kanban.map((col) => (
              <div key={col.key} className="rounded-xl bg-secondary/60 p-3">
                <div className="flex items-center justify-between px-1 pb-3">
                  <p className="text-xs font-semibold tracking-wide uppercase">{col.title}</p>
                  <span className="num text-xs text-muted-foreground">{col.cards.length}</span>
                </div>
                <div className="space-y-2">
                  {col.cards.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-lg border border-border bg-card p-3 transition-shadow hover:shadow-lift"
                    >
                      <p className="text-sm font-medium">{c.title}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge variant="outline" className="text-[0.65rem]">
                          {c.tag}
                        </Badge>
                        <span className="grid size-6 place-items-center rounded-full bg-secondary text-[0.6rem] font-semibold">
                          {c.who}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="mt-6">
          <Section title="Gantt overview" description="Relative duration by project">
            <ul className="space-y-5">
              {projects.map((p, i) => (
                <li key={p.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{p.name}</span>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarDays className="size-3.5" aria-hidden /> {p.due}
                    </span>
                  </div>
                  <div className="mt-2 h-3 rounded-full bg-secondary">
                    <div
                      className="h-3 rounded-full bg-primary/80"
                      style={{ marginLeft: `${i * 8}%`, width: `${Math.max(p.progress, 18)}%` }}
                    />
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