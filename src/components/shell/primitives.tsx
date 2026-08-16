import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-5 pb-2 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl space-y-2">
        {eyebrow ? (
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-2xl font-semibold sm:text-[28px]">{title}</h1>
        {description ? (
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function Section({
  title,
  description,
  actions,
  children,
  className,
  padded = true,
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section className={cn("panel overflow-hidden", className)}>
      {title ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
          <div>
            <h2 className="text-sm font-semibold">{title}</h2>
            {description ? (
              <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {actions}
        </div>
      ) : null}
      <div className={cn(padded && "p-6")}>{children}</div>
    </section>
  );
}

export function StatCard({
  label,
  value,
  delta,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  delta?: number | undefined;
  hint?: string | undefined;
  icon?: LucideIcon | undefined;
}) {
  const up = (delta ?? 0) >= 0;
  return (
    <div className="panel group p-5 transition-shadow duration-300 hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        {Icon ? <Icon className="size-4 text-muted-foreground/70" aria-hidden /> : null}
      </div>
      <p className="num mt-4 text-2xl font-semibold">{value}</p>
      <div className="mt-2 flex items-center gap-2 text-xs">
        {delta !== undefined ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 font-medium",
              delta === 0 ? "text-muted-foreground" : up ? "text-success" : "text-destructive",
            )}
          >
            {delta !== 0 &&
              (up ? (
                <ArrowUpRight className="size-3.5" aria-hidden />
              ) : (
                <ArrowDownRight className="size-3.5" aria-hidden />
              ))}
            {delta === 0 ? "No change" : `${Math.abs(delta).toFixed(1)}%`}
          </span>
        ) : null}
        {hint ? <span className="text-muted-foreground">{hint}</span> : null}
      </div>
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border px-6 py-14 text-center">
      <div className="flex size-11 items-center justify-center rounded-full bg-muted">
        <Icon className="size-5 text-muted-foreground" aria-hidden />
      </div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const tone: Record<string, string> = {
    "On track": "border-success/30 text-success",
    Complete: "border-success/30 text-success",
    Approved: "border-success/30 text-success",
    Paid: "border-success/30 text-success",
    Active: "border-success/30 text-success",
    Connected: "border-success/30 text-success",
    Closed: "border-success/30 text-success",
    "In use": "border-success/30 text-success",
    "At risk": "border-warning/40 text-warning",
    Pending: "border-warning/40 text-warning",
    "In review": "border-warning/40 text-warning",
    "In progress": "border-warning/40 text-warning",
    Partial: "border-warning/40 text-warning",
    Service: "border-warning/40 text-warning",
    Delayed: "border-destructive/30 text-destructive",
    Overdue: "border-destructive/30 text-destructive",
    Rejected: "border-destructive/30 text-destructive",
    High: "border-destructive/30 text-destructive",
    Medium: "border-warning/40 text-warning",
    Low: "border-success/30 text-success",
  };
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full bg-transparent font-medium",
        tone[status] ?? "text-muted-foreground",
      )}
    >
      {status}
    </Badge>
  );
}

export function CardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="panel space-y-3 p-6">
      <Skeleton className="h-4 w-32" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-9 w-full" />
      ))}
    </div>
  );
}
