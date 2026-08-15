import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { navGroups } from "@/lib/nav";
import { activity, currentUser, org } from "@/lib/mock-data";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CommandPalette, useCommandPalette } from "@/components/shell/command-palette";
import { AIPanel, useAIPanel } from "@/components/shell/ai-panel";
import { Bell, Menu, Moon, Search, Sparkles, Sun } from "lucide-react";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="space-y-7 px-3 py-2" aria-label="Primary">
      {navGroups.map((group) => (
        <div key={group.group}>
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {group.group}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === "/app" }}
                  onClick={onNavigate}
                  className="group flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  activeProps={{
                    className: "bg-sidebar-accent font-medium text-sidebar-accent-foreground",
                  }}
                >
                  <item.icon className="size-4 shrink-0 opacity-70" aria-hidden />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function AppLayout() {
  const palette = useCommandPalette();
  const ai = useAIPanel();
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="flex h-16 items-center gap-2.5 px-6">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" aria-hidden />
          </div>
          <span className="text-sm font-semibold tracking-tight">BuildFlow AI</span>
        </div>
        <div className="flex-1 overflow-y-auto pb-6">
          <SidebarNav />
        </div>
        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-xl bg-sidebar-accent p-3">
            <p className="text-xs font-medium">{org.name}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {org.plan} plan · {org.seatsUsed}/{org.seats} seats
            </p>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="glass sticky top-0 z-20 flex h-16 items-center gap-3 border-b px-4 sm:px-6">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Open navigation"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetTitle className="px-6 py-5 text-sm">BuildFlow AI</SheetTitle>
              <SidebarNav onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>

          <button
            onClick={() => palette.setOpen(true)}
            className="flex h-9 flex-1 items-center gap-2 rounded-xl border border-border bg-surface px-3 text-sm text-muted-foreground transition-colors hover:bg-accent sm:max-w-sm"
          >
            <Search className="size-4" aria-hidden />
            <span className="truncate">Search or jump to…</span>
            <kbd className="ml-auto hidden rounded border border-border px-1.5 py-0.5 text-[10px] sm:inline">
              ⌘K
            </kbd>
          </button>

          <div className="ml-auto flex items-center gap-1.5">
            <Button
              variant="outline"
              className="hidden rounded-xl sm:inline-flex"
              onClick={() => ai.setOpen(true)}
            >
              <Sparkles className="size-4" aria-hidden />
              Ask AI
              <kbd className="ml-1 rounded border border-border px-1.5 py-0.5 text-[10px]">⌘J</kbd>
            </Button>
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
                  <Bell className="size-4" />
                  <span className="absolute right-2 top-2 size-1.5 rounded-full bg-signal" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between px-3 py-2.5">
                  <p className="text-sm font-semibold">Notifications</p>
                  <button
                    className="text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => toast.success("All notifications marked as read")}
                  >
                    Mark all read
                  </button>
                </div>
                <DropdownMenuSeparator className="my-0" />
                <ul className="max-h-80 overflow-y-auto py-1">
                  {activity.slice(0, 5).map((a, i) => (
                    <li key={i}>
                      <Link
                        to="/app"
                        className="flex flex-col gap-0.5 px-3 py-2.5 text-sm hover:bg-accent"
                      >
                        <span className="leading-snug">
                          <span className="font-medium">{a.who}</span>{" "}
                          <span className="text-muted-foreground">{a.what}</span>
                        </span>
                        <span className="text-xs text-muted-foreground">{a.when}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button aria-label="Account menu" className="ml-1 rounded-full">
                  <Avatar className="size-8">
                    <AvatarFallback className="text-xs">{currentUser.initials}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <p className="text-sm font-medium">{currentUser.name}</p>
                  <p className="text-xs font-normal text-muted-foreground">{currentUser.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/app/settings">Profile settings</Link>
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
        </header>

        <main id="main" className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-8 sm:py-10">
          <div key={pathname} className="animate-rise space-y-8">
            <Outlet />
          </div>
        </main>
      </div>

      <CommandPalette
        open={palette.open}
        setOpen={palette.setOpen}
        onAskAI={() => ai.setOpen(true)}
      />
      <AIPanel open={ai.open} setOpen={ai.setOpen} />

      <Button
        onClick={() => ai.setOpen(true)}
        size="icon"
        className={cn("fixed bottom-6 right-6 z-20 size-12 rounded-full shadow-float sm:hidden")}
        aria-label="Ask BuildFlow AI"
      >
        <Sparkles className="size-5" />
      </Button>
    </div>
  );
}
