import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  delta,
  hint,
  icon: Icon,
  className,
}: {
  label: string;
  value: string;
  delta?: number;
  hint?: string;
  icon?: LucideIcon;
  className?: string;
}) {
  const positive = (delta ?? 0) >= 0;
  return (
    <div className={cn("surface group p-5 transition-shadow hover:shadow-lift", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[0.8rem] font-medium text-muted-foreground">{label}</p>
        {Icon ? (
          <span className="rounded-lg bg-secondary p-1.5 text-muted-foreground transition-colors group-hover:text-foreground">
            <Icon className="size-4" aria-hidden />
          </span>
        ) : null}
      </div>
      <p className="num mt-4 text-[1.75rem] leading-none font-semibold">{value}</p>
      <div className="mt-3 flex items-center gap-2 text-xs">
        {typeof delta === "number" ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium",
              positive
                ? "bg-success/10 text-success"
                : "bg-destructive/10 text-destructive",
            )}
          >
            {positive ? (
              <ArrowUpRight className="size-3" aria-hidden />
            ) : (
              <ArrowDownRight className="size-3" aria-hidden />
            )}
            {Math.abs(delta)}%
          </span>
        ) : null}
        {hint ? <span className="text-muted-foreground">{hint}</span> : null}
      </div>
    </div>
  );
}