import { useEffect, useRef, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { answer, assistantSuggestions } from "@/lib/assistant";
import { ArrowUp, Sparkles } from "lucide-react";

type Message = { role: "user" | "ai"; text: string };

export function useAIPanel() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return { open, setOpen };
}

export function AIPanel({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [value, setValue] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setValue("");
    setThinking(true);
    void answer(text)
      .then((reply) => setMessages((m) => [...m, { role: "ai", text: reply }]))
      .catch(() =>
        setMessages((m) => [
          ...m,
          { role: "ai", text: "I couldn't reach your workspace data just now. Try again." },
        ]),
      )
      .finally(() => setThinking(false));
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-6 py-5">
          <SheetTitle className="flex items-center gap-2 text-base">
            <Sparkles className="size-4 text-signal" aria-hidden />
            Workspace assistant
          </SheetTitle>
          <SheetDescription>
            Answers are calculated live from your own projects, estimates, invoices and equipment.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="space-y-4 px-6 py-6">
            {messages.length === 0 && !thinking ? (
              <div className="space-y-4">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Suggested
                </p>
                <div className="flex flex-wrap gap-2">
                  {assistantSuggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                    : "max-w-[92%] rounded-2xl rounded-bl-md border border-border bg-surface px-4 py-3 text-sm leading-relaxed animate-rise"
                }
              >
                {m.text}
              </div>
            ))}

            {thinking ? (
              <div className="max-w-[92%] space-y-2 rounded-2xl border border-border bg-surface px-4 py-3">
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ) : null}
            <div ref={endRef} />
          </div>
        </ScrollArea>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(value);
          }}
          className="flex items-center gap-2 border-t border-border p-4"
        >
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ask anything about your company…"
            aria-label="Ask BuildFlow AI"
            className="h-11 rounded-xl"
          />
          <Button
            type="submit"
            size="icon"
            className="size-11 shrink-0 rounded-xl"
            aria-label="Send"
          >
            <ArrowUp className="size-4" />
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
