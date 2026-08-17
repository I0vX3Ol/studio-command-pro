import { createFileRoute, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader, Section, StatCard, StatusPill } from "@/components/shell/primitives";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { currency } from "@/lib/format";
import type { Dashboard, EquipmentItem, ServiceLog } from "@/lib/remote-data";
import {
  createEquipment,
  fetchDashboard,
  fetchEquipment,
  fetchServiceLogs,
} from "@/lib/remote-data";
import { MapPin, Plus } from "lucide-react";
import { RequireSubscription } from "@/lib/require-subscription";

export const Route = createFileRoute("/app/equipment")({
  loader: async () => {
    const [equipment, serviceLogs, dashboard] = await Promise.all([
      fetchEquipment(),
      fetchServiceLogs(),
      fetchDashboard(),
    ]);
    return { equipment, serviceLogs, dashboard };
  },
  head: () => ({
    meta: [
      { title: "Equipment — BuildFlow AI" },
      {
        name: "description",
        content:
          "Fleet inventory, utilization, maintenance schedules, fuel tracking, and inspection reminders.",
      },
      { property: "og:title", content: "Equipment — BuildFlow AI" },
      {
        property: "og:description",
        content: "Track utilization, maintenance, fuel, and rentals across the fleet.",
      },
    ],
  }),
  component: () => (
    <RequireSubscription feature="Equipment tracking" minimumPlan="professional">
      <EquipmentPage />
    </RequireSubscription>
  ),
});

function EquipmentPage() {
  const router = useRouter();
  const { equipment, serviceLogs, dashboard } = Route.useLoaderData() as {
    equipment: EquipmentItem[];
    serviceLogs: ServiceLog[];
    dashboard: Dashboard;
  };
  const upcomingService = serviceLogs.filter((l) => l.kind === "scheduled");
  const serviceHistory = serviceLogs.filter((l) => l.kind !== "scheduled");
  const rentals = equipment.filter((e) => e.isRental);

  const handleAddAsset = async () => {
    try {
      await createEquipment({ name: "New asset" });
      toast.success("Asset added — open its record to fill in the details.");
      await router.invalidate();
    } catch (err) {
      toast.error("Couldn't add asset", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="Equipment"
        description="Fleet health, utilization, and everything due for service."
        actions={
          <>
            <Button className="rounded-xl" onClick={handleAddAsset}>
              <Plus className="size-4" />
              Add asset
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Assets tracked" value={String(equipment.length)} />
        <StatCard label="Average utilization" value={`${dashboard.kpis.avgUtilization}%`} />
        <StatCard
          label="Due for service"
          value={String(dashboard.kpis.scheduledService)}
          hint="Next 30 days"
        />
        <StatCard label="Fuel spend (MTD)" value={currency(dashboard.kpis.fuelMonth)} />
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
                  <p className="num text-xs text-muted-foreground">{e.assetTag}</p>
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
                <TableCell>
                  <StatusPill status={e.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Section title="Maintenance schedule" padded={false}>
          <ul className="divide-y divide-border">
            {upcomingService.length === 0 ? (
              <li className="px-6 py-8 text-center text-sm text-muted-foreground">
                Nothing scheduled yet.
              </li>
            ) : (
              upcomingService.map((l) => (
                <li key={l.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="text-sm font-medium">{l.equipment}</p>
                    <p className="text-xs text-muted-foreground">{l.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{l.date}</span>
                </li>
              ))
            )}
          </ul>
        </Section>

        <Section title="Service history" padded={false}>
          <ul className="divide-y divide-border">
            {serviceHistory.length === 0 ? (
              <li className="px-6 py-8 text-center text-sm text-muted-foreground">
                No service recorded yet.
              </li>
            ) : (
              serviceHistory.map((l) => (
                <li key={l.id} className="px-6 py-4">
                  <p className="num text-xs text-muted-foreground">{l.equipment}</p>
                  <p className="text-sm font-medium">{l.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {l.date}
                    {l.cost != null ? ` · ${currency(l.cost)}` : ""}
                  </p>
                </li>
              ))
            )}
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
              {rentals.length === 0 ? (
                <li className="px-6 py-8 text-center text-sm text-muted-foreground">
                  No rentals on hire.
                </li>
              ) : (
                rentals.map((e) => (
                  <li key={e.id} className="px-6 py-4">
                    <p className="text-sm font-medium">{e.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Returns {e.rentalReturn}
                      {e.rentalRate != null ? ` · ${currency(e.rentalRate)}/mo` : ""}
                    </p>
                  </li>
                ))
              )}
            </ul>
          </Section>
        </div>
      </div>
    </>
  );
}
