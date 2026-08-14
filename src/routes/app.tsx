import { Link, Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { Bell, Menu, Moon, Search, Sparkles, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";

import { AiPanel } from "@/components/app/ai-panel";
import { CommandPalette } from "@/components/app/command-palette";
import { navGroups, navItems } from "@/components/app/nav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { org, user } from "@/lib/mock-data";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Workspace — BuildFlow AI" },
      {
        name: "description",
        content:
          "The BuildFlow AI workspace: projects, estimating, financials and field operations in one console.",
      },
    ],
  }),
  component: AppLayout,
});

function AppLayout() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const { theme, toggle } = useTheme();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setMobileNav(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      } else if (meta && e.key.toLowerCase() === "j") {
        e.preventDefault();
        setAiOpen((v) => !v);
      } else if (meta && e.key === "\\") {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-60 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      {mobileNav ? (
        <div
          className="fixed inset-0 z-40 bg-foreground/30 lg:hidden"
          onClick={() => setMobileNav(false)}
          aria-hidden
        />
      ) : null}

      <Sidebar open={mobileNav} onClose={() => setMobileNav(false)} pathname={pathname} />

      <div className="lg:pl-[16.5rem]">
        <header className="glass sticky top-0 z-30 border-b border-border">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileNav(true)}
              aria-label="Open navigation"
            >
              <Menu className="size-4" aria-hidden />
            </Button>

            <button
              onClick={() => setPaletteOpen(true)}
              className="group flex h-9 flex-1 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:bg-secondary sm:max-w-md"
            >
              <Search className="size-4" aria-hidden />
              <span className="truncate">Search projects, invoices, people…</span>
              <kbd className="num ml-auto hidden rounded border border-border px-1.5 py-0.5 text-[0.65rem] sm:inline">
                ⌘K
              </kbd>
            </button>

            <div className="ml-auto flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex"
                onClick={() => setAiOpen(true)}
              >
                <Sparkles className="size-4" aria-hidden />
                Ask AI
                <kbd className="num ml-1 text-[0.65rem] text-muted-foreground">⌘J</kbd>
              </Button>
              <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle color theme">
                {theme === "dark" ? (
                  <Sun className="size-4" aria-hidden />
                ) : (
                  <Moon className="size-4" aria-hidden />
                )}
              </Button>
              <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
                <Bell className="size-4" aria-hidden />
                <span className="absolute top-2 right-2 size-1.5 rounded-full bg-destructive" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="ml-1 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-secondary text-xs font-semibold">
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs font-normal text-muted-foreground">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/app/settings">Profile settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/app/settings">Organization</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/app/settings">Billing</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/login">Sign out</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main id="main" key={pathname} className="animate-rise px-4 py-8 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-[80rem] space-y-8">
            <Outlet />
          </div>
        </main>
      </div>

      <Button
        onClick={() => setAiOpen(true)}
        size="icon"
        className="fixed right-5 bottom-5 z-40 size-12 rounded-full shadow-lift sm:hidden"
        aria-label="Open BuildFlow AI"
      >
        <Sparkles className="size-5" aria-hidden />
      </Button>

      <AiPanel open={aiOpen} onClose={() => setAiOpen(false)} />
      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        onAskAi={() => setAiOpen(true)}
      />
    </div>
  );
}

function Sidebar({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  return (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-[16.5rem] flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex h-16 items-center gap-2.5 px-5">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            B
          </span>
          <span className="text-sm font-semibold tracking-tight">BuildFlow AI</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto lg:hidden"
          onClick={onClose}
          aria-label="Close navigation"
        >
          <X className="size-4" aria-hidden />
        </Button>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {navGroups.map((group) => (
          <div key={group}>
            <p className="px-3 pb-2 text-[0.68rem] font-semibold tracking-wider text-muted-foreground uppercase">
              {group}
            </p>
            <ul className="space-y-0.5">
              {navItems
                .filter((i) => i.group === group)
                .map((item) => {
                  const active = item.to === "/app" ? pathname === "/app" : pathname.startsWith(item.to);
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          active
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                        )}
                      >
                        <item.icon className="size-4" aria-hidden />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-sidebar-border p-3">
        <div className="rounded-xl bg-card p-4">
          <p className="text-xs font-medium">{org.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {org.plan} plan · {org.seats} seats
          </p>
          <Link
            to="/app/settings"
            className="mt-3 inline-flex text-xs font-medium text-primary hover:underline"
          >
            Manage subscription
          </Link>
        </div>
      </div>
    </nav>
  );
}