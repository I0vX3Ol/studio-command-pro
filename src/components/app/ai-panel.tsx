import { Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { aiAnswers, aiSuggestions } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Msg = { id: number; role: "user" | "ai"; text: string };

const answerFor = (q: string) =>
  aiAnswers[q.trim().toLowerCase()] ??
  `Here's what I found across Northbeam's workspace for “${q.trim()}”. I cross-referenced 4 active projects, 128 documents and 36 months of financial history. Ask me to draft the follow-up, generate the document, or push this to a task and I'll handle it.`;

export function AiPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 0,
      role: "ai",
      text: "Good morning, Dana. Revenue is pacing 13% ahead of forecast, but two invoices crossed 30 days overdue. Want me to draft the collection emails?",
    },
  ]);
  const [value, setValue] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const ask = (q: string) => {
    if (!q.trim()) return;
    setMessages((m) => [...m, { id: Date.now(), role: "user", text: q }]);
    setValue("");
    setThinking(true);
    window.setTimeout(() => {
      setThinking(false);
      setMessages((m) => [...m, { id: Date.now() + 1, role: "ai", text: answerFor(q) }]);
    }, 850);
  };

  return (
    <aside
      aria-label="BuildFlow AI assistant"
      aria-hidden={!open}
      className={cn(
        "fixed inset-y-0 right-0 z-50 flex w-full max-w-[26rem] flex-col border-l border-border bg-card transition-transform duration-300 ease-out",
        open ? "translate-x-0 shadow-lift" : "pointer-events-none translate-x-full",
      )}
    >
      <header className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="rounded-lg bg-accent p-1.5 text-accent-foreground">
            <Sparkles className="size-4" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold">BuildFlow AI</p>
            <p className="text-xs text-muted-foreground">Company-wide context · live</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close assistant">
          <X className="size-4" aria-hidden />
        </Button>
      </header>

      <ScrollArea className="flex-1">
        <div className="space-y-4 p-5">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "animate-rise max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                m.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground",
              )}
            >
              {m.text}
            </div>
          ))}
          {thinking ? (
            <div className="space-y-2 rounded-2xl bg-secondary p-4">
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-3 w-3/5" />
              <Skeleton className="h-3 w-2/5" />
            </div>
          ) : null}
          <div ref={endRef} />
        </div>
      </ScrollArea>

      <div className="border-t border-border p-4">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {aiSuggestions.slice(0, 5).map((s) => (
            <button
              key={s}
              onClick={() => ask(s)}
              className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            ask(value);
          }}
        >
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ask about anything in your company…"
            aria-label="Ask BuildFlow AI"
          />
          <Button type="submit" size="icon" aria-label="Send message">
            <Send className="size-4" aria-hidden />
          </Button>
        </form>
      </div>
    </aside>
  );
}