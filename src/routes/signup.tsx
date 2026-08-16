import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/components/shell/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your workspace — BuildFlow AI" },
      {
        name: "description",
        content:
          "Start a free BuildFlow AI trial and run estimating, projects, and finances in one place.",
      },
      { property: "og:title", content: "Create your workspace — BuildFlow AI" },
      {
        property: "og:description",
        content:
          "Start a free BuildFlow AI trial and run estimating, projects, and finances in one place.",
      },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signUp({
      email,
      password,
      fullName: `${firstName} ${lastName}`.trim(),
      company,
    });
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    toast.success("Workspace created — welcome to BuildFlow AI");
    navigate({ to: "/app" });
  };

  return (
    <AuthShell
      title="Create your workspace"
      description="14 days free. No card required. Invite your whole crew."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-5">
        {error && (
          <p
            role="alert"
            className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </p>
        )}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="first">First name</Label>
            <Input
              id="first"
              required
              className="h-11 rounded-xl"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last">Last name</Label>
            <Input
              id="last"
              required
              className="h-11 rounded-xl"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            required
            className="h-11 rounded-xl"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            type="email"
            required
            className="h-11 rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={8}
            className="h-11 rounded-xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">At least 8 characters.</p>
        </div>
        <Button type="submit" disabled={loading} className="h-11 w-full rounded-xl">
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          Create workspace
        </Button>
      </form>
    </AuthShell>
  );
}
