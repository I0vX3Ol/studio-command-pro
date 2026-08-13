import { Tooltip } from "recharts";

export const axisProps = {
  stroke: "var(--color-muted-foreground)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
} as const;

export function ChartTooltip() {
  return (
    <Tooltip
      cursor={{ fill: "var(--color-muted)", stroke: "var(--color-border)" }}
      contentStyle={{
        background: "var(--color-popover)",
        border: "1px solid var(--color-border)",
        borderRadius: 12,
        fontSize: 12,
        boxShadow: "var(--elevation-lift)",
        color: "var(--color-popover-foreground)",
      }}
    />
  );
}
