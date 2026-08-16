import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/components/shell/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Loader2, Mail } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — BuildFlow AI" },
      { name: "description", content: "Sign in to your BuildFlow AI construction workspace." },
      { property: "og:title", content: "Log in — BuildFlow AI" },
      {
        property: "og:description",
        content: "Sign in to your BuildFlow AI construction workspace.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"credentials" | "twofactor">("credentials");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setStep("twofactor");
    }, 700);
  };

  const verify = () => {
    setLoading(true);
    window.setTimeout(() => {
      toast.success("Welcome back, Avery");
      navigate({ to: "/app" });
    }, 700);
  };

  if (step === "twofactor") {
    return (
      <AuthShell
        title="Two-factor authentication"
        description="Enter the 6-digit code from your authenticator app to finish signing in."
      >
        <div className="space-y-6">
          <InputOTP maxLength={6} value={code} onChange={setCode}>
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot key={i} index={i} className="size-12 rounded-xl text-base" />
              ))}
            </InputOTPGroup>
          </InputOTP>
          <Button onClick={verify} disabled={loading} className="h-11 w-full rounded-xl">
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            Verify and continue
          </Button>
          <button
            onClick={() => setStep("credentials")}
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Use a different account
          </button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to your BuildFlow AI workspace."
      footer={
        <>
          New to BuildFlow?{" "}
          <Link
            to="/signup"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            type="email"
            required
            defaultValue="avery@northline.build"
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/forgot-password"
              className="text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            required
            defaultValue="password"
            className="h-11 rounded-xl"
          />
        </div>
        <Button type="submit" disabled={loading} className="h-11 w-full rounded-xl">
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          Continue
        </Button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">or</span>
        <Separator className="flex-1" />
      </div>

      <Button
        variant="outline"
        className="h-11 w-full rounded-xl"
        onClick={() => toast.success("Magic link sent to avery@northline.build")}
      >
        <Mail className="size-4" />
        Email me a magic link
      </Button>
    </AuthShell>
  );
}
