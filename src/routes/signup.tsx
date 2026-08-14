import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/components/shell/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your workspace — BuildFlow AI" },
      {
        name: "description",
        content: "Start a free BuildFlow AI trial and run estimating, projects, and finances in one place.",
      },
      { property: "og:title", content: "Create your workspace — BuildFlow AI" },
      {
        property: "og:description",
        content: "Start a free BuildFlow AI trial and run estimating, projects, and finances in one place.",
      },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    window.setTimeout(() => {
      toast.success("Workspace created — welcome to BuildFlow AI");
      navigate({ to: "/app" });
    }, 800);
  };

  return (
    <AuthShell
      title="Create your workspace"
      description="14 days free. No card required. Invite your whole crew."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="first">First name</Label>
            <Input id="first" required className="h-11 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last">Last name</Label>
            <Input id="last" required className="h-11 rounded-xl" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input id="company" required className="h-11 rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" required className="h-11 rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required className="h-11 rounded-xl" />
          <p className="text-xs text-muted-foreground">At least 12 characters.</p>
        </div>
        <Button type="submit" disabled={loading} className="h-11 w-full rounded-xl">
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          Create workspace
        </Button>
      </form>
    </AuthShell>
  );
}
