import { useNavigate } from "@tanstack/react-router";
import { Moon, Sparkles, Sun } from "lucide-react";
import { toast } from "sonner";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { navItems } from "@/components/app/nav";
import { useTheme } from "@/lib/theme";

export function CommandPalette({
  open,
  onOpenChange,
  onAskAi,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAskAi: () => void;
}) {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();

  const run = (fn: () => void) => {
    onOpenChange(false);
    fn();
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search pages, records and actions…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          {navItems.map((item) => (
            <CommandItem
              key={item.to}
              value={item.label}
              onSelect={() => run(() => navigate({ to: item.to }))}
            >
              <item.icon className="size-4" aria-hidden />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem value="Ask BuildFlow AI" onSelect={() => run(onAskAi)}>
            <Sparkles className="size-4" aria-hidden />
            Ask BuildFlow AI
            <CommandShortcut>⌘J</CommandShortcut>
          </CommandItem>
          <CommandItem
            value="New estimate"
            onSelect={() => run(() => navigate({ to: "/app/estimating" }))}
          >
            <Sparkles className="size-4" aria-hidden />
            New AI estimate
          </CommandItem>
          <CommandItem
            value="Create invoice"
            onSelect={() =>
              run(() => {
                navigate({ to: "/app/financials" });
                toast.success("Draft invoice created", { description: "INV-2437 · unassigned" });
              })
            }
          >
            <Sparkles className="size-4" aria-hidden />
            Create invoice
          </CommandItem>
          <CommandItem value="Toggle theme" onSelect={() => run(toggle)}>
            {theme === "dark" ? (
              <Sun className="size-4" aria-hidden />
            ) : (
              <Moon className="size-4" aria-hidden />
            )}
            Toggle {theme === "dark" ? "light" : "dark"} mode
            <CommandShortcut>⌘\</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}