import { createFileRoute } from "@tanstack/react-router";
import { Fuel, Plus, Truck, Wrench } from "lucide-react";

import { PageHeader } from "@/components/app/page-header";
import { Section } from "@/components/app/section";
import { StatCard } from "@/components/app/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { equipment } from "@/lib/mock-data";

export const Route = createFileRoute("/app/equipment")({
  head: () => ({
    meta: [
      { title: "Equipment — BuildFlow AI" },
      {
        name: "description",
        content:
          "Fleet tracking for excavators, lifts and trucks: utilization, fuel, service windows and site assignment.",
      },
      { property: "og:title", content: "Equipment — BuildFlow AI" },
      {
        property: "og:description",
        content: "Utilization, fuel levels and maintenance windows across the fleet.",
      },
    ],
  }),
  component: EquipmentPage,
});

function EquipmentPage() {
  const avgUtil = Math.round(equipment.reduce((s, e) => s + e.util, 0) / equipment.length);

  return (
    <>
      <PageHeader
        title="Equipment & fleet"
        description="Where every asset is, how hard it is working and what breaks next."
        actions={
          <Button>
            <Plus className="size-4" aria-hidden /> Add asset
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Assets tracked" value="24" icon={Truck} />
        <StatCard label="Avg. utilization" value={`${avgUtil}%`} delta={4.6} />
        <StatCard label="In maintenance" value="1" hint="Kenworth T880" icon={Wrench} />
        <StatCard label="Fuel spend MTD" value="$12,200" delta={-6.3} icon={Fuel} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {equipment.map((e) => (
          <div key={e.id} className="surface p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold">{e.name}</h3>
                <p className="num text-xs text-muted-foreground">
                  {e.tag} · {e.site}
                </p>
              </div>
              <Badge
                variant={e.status === "Maintenance" ? "destructive" : "secondary"}
                className={e.status === "Active" ? "text-success" : undefined}
              >
                {e.status}
              </Badge>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Utilization</span>
                  <span className="num">{e.util}%</span>
                </div>
                <Progress value={e.util} className="mt-1.5 h-1.5" />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Fuel</span>
                  <span className="num">{e.fuel}%</span>
                </div>
                <Progress value={e.fuel} className="mt-1.5 h-1.5" />
              </div>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-3 text-xs">
              <div>
                <dt className="text-muted-foreground">Engine hours</dt>
                <dd className="num mt-0.5 font-medium">{e.hours.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Next service</dt>
                <dd className="num mt-0.5 font-medium">{e.service}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      <Section title="Maintenance schedule" description="Predicted from engine hours and duty cycle">
        <ul className="divide-y divide-border text-sm">
          {equipment.map((e) => (
            <li key={e.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div>
                <p className="font-medium">{e.name}</p>
                <p className="text-xs text-muted-foreground">
                  {e.status === "Maintenance" ? "In shop — hydraulic service" : "Preventive service"}
                </p>
              </div>
              <span className="num text-xs text-muted-foreground">{e.service}</span>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}