import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
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
import { allNavItems } from "@/lib/nav";
import { useTheme } from "@/lib/theme";
import { FileText, MessageSquare, Moon, Plus, Sun, UserPlus } from "lucide-react";

export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return { open, setOpen };
}

export function CommandPalette({
  open,
  setOpen,
  onAskAI,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  onAskAI: () => void;
}) {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();

  const run = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages, actions, records…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          {allNavItems.map((item) => (
            <CommandItem
              key={item.to}
              value={`${item.label} ${item.hint}`}
              onSelect={() => run(() => navigate({ to: item.to }))}
            >
              <item.icon className="size-4" />
              <span>{item.label}</span>
              <span className="ml-auto text-xs text-muted-foreground">{item.hint}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => run(onAskAI)}>
            <MessageSquare className="size-4" />
            Ask BuildFlow AI
            <CommandShortcut>⌘J</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => run(() => toast.success("New estimate started"))}>
            <Plus className="size-4" />
            New estimate
          </CommandItem>
          <CommandItem onSelect={() => run(() => toast.success("Invoice draft created"))}>
            <FileText className="size-4" />
            Create invoice
          </CommandItem>
          <CommandItem onSelect={() => run(() => toast.success("Invite sent"))}>
            <UserPlus className="size-4" />
            Invite teammate
          </CommandItem>
          <CommandItem onSelect={() => run(toggle)}>
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            Switch to {theme === "dark" ? "light" : "dark"} mode
            <CommandShortcut>⌘\</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
