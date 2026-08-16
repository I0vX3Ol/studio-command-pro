import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader, Section, StatusPill } from "@/components/shell/primitives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  changeOrders,
  currency,
  dailyLogs,
  ganttTasks,
  kanbanColumns,
  milestones,
  projects,
  punchList,
} from "@/lib/mock-data";
import { Camera, Plus } from "lucide-react";

export const Route = createFileRoute("/app/projects")({
  head: () => ({
    meta: [
      { title: "Projects — BuildFlow AI" },
      {
        name: "description",
        content:
          "Kanban, Gantt, daily logs, milestones, change orders, and punch lists for every active job.",
      },
      { property: "og:title", content: "Projects — BuildFlow AI" },
      {
        property: "og:description",
        content: "Boards, schedules, daily logs, and change orders in one workspace.",
      },
    ],
  }),
  component: ProjectsPage,
});

const WEEKS = 15;

function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="Projects"
        description="Seventeen active jobs. Two need attention this week."
        actions={
          <Button className="rounded-xl" onClick={() => toast.success("New project created")}>
            <Plus className="size-4" />
            New project
          </Button>
        }
      />

      <Section title="Active projects" padded={false}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>PM</TableHead>
              <TableHead className="w-48">Progress</TableHead>
              <TableHead className="text-right">Budget</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Health</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.phase}</p>
                </TableCell>
                <TableCell className="text-muted-foreground">{p.customer}</TableCell>
                <TableCell className="text-muted-foreground">{p.pm}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Progress value={p.progress} className="h-1.5" />
                    <span className="num text-xs text-muted-foreground">{p.progress}%</span>
                  </div>
                </TableCell>
                <TableCell className="num text-right">
                  {currency(p.spent)}
                  <span className="text-muted-foreground"> / {currency(p.budget)}</span>
                </TableCell>
                <TableCell className="text-muted-foreground">{p.due}</TableCell>
                <TableCell>
                  <StatusPill status={p.health} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <Tabs defaultValue="board" className="space-y-6">
        <TabsList className="rounded-xl">
          <TabsTrigger value="board" className="rounded-lg">
            Board
          </TabsTrigger>
          <TabsTrigger value="schedule" className="rounded-lg">
            Schedule
          </TabsTrigger>
          <TabsTrigger value="logs" className="rounded-lg">
            Daily logs
          </TabsTrigger>
          <TabsTrigger value="orders" className="rounded-lg">
            Change orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="board">
          <div className="grid gap-4 lg:grid-cols-5">
            {kanbanColumns.map((col) => (
              <div key={col.id} className="panel p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{col.title}</p>
                  <Badge variant="secondary" className="rounded-full">
                    {col.cards.length}
                  </Badge>
                </div>
                <ul className="mt-4 space-y-3">
                  {col.cards.map((c) => (
                    <li
                      key={c.id}
                      className="rounded-xl border border-border bg-background p-3 transition-shadow hover:shadow-soft"
                    >
                      <p className="text-sm font-medium leading-snug">{c.title}</p>
                      <p className="mt-1.5 text-xs text-muted-foreground">{c.project}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <Badge variant="outline" className="rounded-full text-[10px]">
                          {c.tag}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">{c.owner}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Section title="Gantt — Meridian Wing C" description="15-week rolling window">
            <div className="min-w-[640px] space-y-2 overflow-x-auto">
              <div className="grid grid-cols-[180px_1fr] items-center">
                <span />
                <div
                  className="grid"
                  style={{ gridTemplateColumns: `repeat(${WEEKS}, minmax(0,1fr))` }}
                >
                  {Array.from({ length: WEEKS }).map((_, i) => (
                    <span key={i} className="text-center text-[10px] text-muted-foreground">
                      {i + 1}
                    </span>
                  ))}
                </div>
              </div>
              {ganttTasks.map((t) => (
                <div key={t.name} className="grid grid-cols-[180px_1fr] items-center gap-2">
                  <span className="truncate text-xs text-muted-foreground">{t.name}</span>
                  <div
                    className="grid gap-px"
                    style={{ gridTemplateColumns: `repeat(${WEEKS}, minmax(0,1fr))` }}
                  >
                    <div
                      className="h-6 rounded-md bg-primary/85"
                      style={{ gridColumn: `${t.start + 1} / span ${t.span}` }}
                      title={`${t.name} · ${t.phase}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <div className="grid gap-6 md:grid-cols-2">
            <Section title="Milestones" padded={false}>
              <ul className="divide-y divide-border">
                {milestones.map((m) => (
                  <li key={m.name} className="flex items-center justify-between px-6 py-4">
                    <div>
                      <p className="text-sm font-medium">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.date}</p>
                    </div>
                    <StatusPill status={m.status} />
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Punch list" padded={false}>
              <ul className="divide-y divide-border">
                {punchList.map((p) => (
                  <li key={p.item} className="flex items-center justify-between px-6 py-4">
                    <div>
                      <p className="text-sm font-medium">{p.item}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.trade} · due {p.due}
                      </p>
                    </div>
                    <StatusPill status={p.status} />
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Section title="Daily logs" className="lg:col-span-2" padded={false}>
              <ul className="divide-y divide-border">
                {dailyLogs.map((l) => (
                  <li key={l.date} className="px-6 py-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold">{l.date}</p>
                      <p className="text-xs text-muted-foreground">
                        {l.author} · {l.crew} crew · {l.weather}
                      </p>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{l.note}</p>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Jobsite photos" description="Latest uploads">
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex aspect-square items-center justify-center rounded-lg border border-border bg-muted/50"
                  >
                    <Camera className="size-4 text-muted-foreground" aria-hidden />
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="mt-4 w-full rounded-xl"
                onClick={() => toast.success("Photo upload started")}
              >
                Upload photos
              </Button>
            </Section>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <Section title="Change orders" padded={false}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {changeOrders.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="num font-medium">{c.id}</TableCell>
                    <TableCell>{c.project}</TableCell>
                    <TableCell className="text-muted-foreground">{c.desc}</TableCell>
                    <TableCell className="num text-right">{currency(c.amount)}</TableCell>
                    <TableCell>
                      <StatusPill status={c.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Section>
        </TabsContent>
      </Tabs>
    </>
  );
}
