import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader, Section, StatCard, StatusPill } from "@/components/shell/primitives";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { equipment } from "@/lib/mock-data";
import { MapPin, Plus, QrCode } from "lucide-react";

export const Route = createFileRoute("/app/equipment")({
  head: () => ({
    meta: [
      { title: "Equipment — BuildFlow AI" },
      {
        name: "description",
        content: "Fleet inventory, utilization, maintenance schedules, fuel tracking, and inspection reminders.",
      },
      { property: "og:title", content: "Equipment — BuildFlow AI" },
      { property: "og:description", content: "Track utilization, maintenance, fuel, and rentals across the fleet." },
    ],
  }),
  component: EquipmentPage,
});

function EquipmentPage() {
  const avgUtil = Math.round(equipment.reduce((s, e) => s + e.util, 0) / equipment.length);

  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="Equipment"
        description="Fleet health, utilization, and everything due for service."
        actions={
          <>
            <Button variant="outline" className="rounded-xl" onClick={() => toast.success("QR scanner ready")}>
              <QrCode className="size-4" />
              QR lookup
            </Button>
            <Button className="rounded-xl" onClick={() => toast.success("Asset form opened")}>
              <Plus className="size-4" />
              Add asset
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Assets tracked" value={String(equipment.length * 9)} delta={3.2} />
        <StatCard label="Average utilization" value={`${avgUtil}%`} delta={5.4} />
        <StatCard label="Due for service" value="4" delta={-1.1} hint="Next 30 days" />
        <StatCard label="Fuel spend (MTD)" value="$7,420" delta={-2.8} />
      </div>

      <Section title="Fleet inventory" padded={false}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Site</TableHead>
              <TableHead className="w-40">Utilization</TableHead>
              <TableHead className="text-right">Hours</TableHead>
              <TableHead className="text-right">Fuel (gal)</TableHead>
              <TableHead>Next service</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {equipment.map((e) => (
              <TableRow key={e.id}>
                <TableCell>
                  <p className="font-medium">{e.name}</p>
                  <p className="num text-xs text-muted-foreground">{e.id}</p>
                </TableCell>
                <TableCell className="text-muted-foreground">{e.type}</TableCell>
                <TableCell className="text-muted-foreground">{e.site}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Progress value={e.util} className="h-1.5" />
                    <span className="num text-xs text-muted-foreground">{e.util}%</span>
                  </div>
                </TableCell>
                <TableCell className="num text-right">{e.hours.toLocaleString()}</TableCell>
                <TableCell className="num text-right">{e.fuel}</TableCell>
                <TableCell className="text-muted-foreground">{e.service}</TableCell>
                <TableCell><StatusPill status={e.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Section title="Maintenance schedule" padded={false}>
          <ul className="divide-y divide-border">
            {[
              ["JLG 1055 Telehandler", "Hydraulic service", "Aug 15"],
              ["Genie S-65 Boom Lift", "Annual inspection", "Aug 24"],
              ["CAT 320 Excavator", "500-hour service", "Sep 02"],
              ["Multiquip Generator", "Oil & filter", "Sep 19"],
            ].map(([name, task, date]) => (
              <li key={name} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium">{name}</p>
                  <p className="text-xs text-muted-foreground">{task}</p>
                </div>
                <span className="text-xs text-muted-foreground">{date}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Service history" padded={false}>
          <ul className="divide-y divide-border">
            {[
              ["EQ-1042", "Track tension adjustment", "Jul 28 · $840"],
              ["EQ-2210", "Boom sensor replacement", "Jul 14 · $2,150"],
              ["EQ-3391", "Hydraulic hose repair", "Jun 30 · $620"],
              ["EQ-4407", "Coolant flush", "Jun 12 · $310"],
            ].map(([id, desc, meta]) => (
              <li key={`${id}-${desc}`} className="px-6 py-4">
                <p className="num text-xs text-muted-foreground">{id}</p>
                <p className="text-sm font-medium">{desc}</p>
                <p className="text-xs text-muted-foreground">{meta}</p>
              </li>
            ))}
          </ul>
        </Section>

        <div className="space-y-6">
          <Section title="GPS locations">
            <div
              className="flex h-40 items-center justify-center rounded-xl border border-border bg-muted/50"
              role="img"
              aria-label="Fleet GPS map placeholder"
            >
              <div className="text-center">
                <MapPin className="mx-auto size-5 text-muted-foreground" aria-hidden />
                <p className="mt-2 text-xs text-muted-foreground">GPS tracking placeholder</p>
              </div>
            </div>
          </Section>

          <Section title="Rental tracking" padded={false}>
            <ul className="divide-y divide-border">
              {[
                ["Skyjack SJ3219 Scissor", "Returns Aug 22 · $1,140/mo"],
                ["Wacker Neuson Plate", "Returns Sep 04 · $380/mo"],
              ].map(([name, meta]) => (
                <li key={name} className="px-6 py-4">
                  <p className="text-sm font-medium">{name}</p>
                  <p className="text-xs text-muted-foreground">{meta}</p>
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </div>
    </>
  );
}
