import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-6 py-10 sm:px-12">
        <Link to="/" className="flex w-fit items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" aria-hidden />
          </div>
          <span className="text-sm font-semibold tracking-tight">BuildFlow AI</span>
        </Link>

        <div className="flex flex-1 items-center">
          <div className="mx-auto w-full max-w-sm animate-rise py-12">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            <div className="mt-8">{children}</div>
            {footer ? <div className="mt-8 text-sm text-muted-foreground">{footer}</div> : null}
          </div>
        </div>
      </div>

      <aside className="hidden flex-col justify-between border-l border-border bg-surface px-12 py-14 lg:flex">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Trusted by builders
        </p>
        <blockquote className="max-w-md">
          <p className="text-2xl font-medium leading-snug tracking-tight">
            “We cut estimate turnaround from nine days to two, and our margin went up four points in
            a single quarter.”
          </p>
          <footer className="mt-6 text-sm text-muted-foreground">
            Dana Whitfield · VP Construction, Ridgeline Properties
          </footer>
        </blockquote>
        <dl className="grid grid-cols-3 gap-6">
          {[
            ["$4.2B", "Managed"],
            ["19.6%", "Avg margin"],
            ["SOC 2", "Type II"],
          ].map(([v, l]) => (
            <div key={l}>
              <dt className="num text-lg font-semibold">{v}</dt>
              <dd className="text-xs text-muted-foreground">{l}</dd>
            </div>
          ))}
        </dl>
      </aside>
    </div>
  );
}
