import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/shell/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2 } from "lucide-react";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset your password — BuildFlow AI" },
      {
        name: "description",
        content: "Request a secure password reset link for your BuildFlow AI account.",
      },
      { property: "og:title", content: "Reset your password — BuildFlow AI" },
      {
        property: "og:description",
        content: "Request a secure password reset link for your BuildFlow AI account.",
      },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 700);
  };

  return (
    <AuthShell
      title={sent ? "Check your inbox" : "Reset your password"}
      description={
        sent
          ? "If an account exists for that address, a secure reset link is on its way. It expires in 30 minutes."
          : "Enter the email tied to your workspace and we'll send a reset link."
      }
      footer={
        <Link
          to="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Back to log in
        </Link>
      }
    >
      {sent ? (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
          <CheckCircle2 className="size-5 text-success" aria-hidden />
          <p className="text-sm text-muted-foreground">Reset link sent.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Work email</Label>
            <Input id="email" type="email" required className="h-11 rounded-xl" />
          </div>
          <Button type="submit" disabled={loading} className="h-11 w-full rounded-xl">
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            Send reset link
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
