import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, Hexagon, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

const searchSchema = z.object({
  mode: z.enum(["login", "signup", "forgot"]).catch("login"),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign in or join ABTalks" },
      {
        name: "description",
        content:
          "Create your ABTalks account to register for events, save learning resources and get personalised recommendations.",
      },
      { property: "og:title", content: "Sign in or join ABTalks" },
      { property: "og:description", content: "Join the ABTalks technology community." },
    ],
  }),
  component: AuthPage,
});

const signupSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(80),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(24)
    .regex(/^[a-z0-9_]+$/, "Use lowercase letters, numbers and underscores only"),
  email: z.string().trim().email("Enter a valid email address").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function setMode(next: "login" | "signup" | "forgot") {
    setErrors({});
    void navigate({ to: "/auth", search: { mode: next } });
  }

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = signupSchema.safeParse({
      fullName: form.get("fullName"),
      username: String(form.get("username") ?? "").toLowerCase(),
      email: form.get("email"),
      password: form.get("password"),
    });
    if (!parsed.success) {
      setErrors(
        Object.fromEntries(
          parsed.error.issues.map((issue) => [String(issue.path[0]), issue.message]),
        ),
      );
      return;
    }
    setErrors({});
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { full_name: parsed.data.fullName, username: parsed.data.username },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome to ABTalks! Let's personalise your feed.");
    await navigate({ to: "/onboarding" });
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = loginSchema.safeParse({
      email: form.get("email"),
      password: form.get("password"),
    });
    if (!parsed.success) {
      setErrors(
        Object.fromEntries(
          parsed.error.issues.map((issue) => [String(issue.path[0]), issue.message]),
        ),
      );
      return;
    }
    setErrors({});
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Signed in");
    await navigate({ to: "/dashboard" });
  }

  async function handleForgot(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    if (!z.string().email().safeParse(email).success) {
      setErrors({ email: "Enter a valid email address" });
      return;
    }
    setErrors({});
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("If that email exists, a reset link is on its way.");
  }

  async function handleGoogle() {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setLoading(false);
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    await navigate({ to: "/dashboard" });
  }

  return (
    <div className="hero-glow flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <Card className="p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Hexagon className="h-6 w-6 text-primary" aria-hidden="true" />
            <span className="font-display text-lg font-semibold">ABTalks</span>
          </div>

          {mode === "forgot" ? (
            <>
              <h1 className="mt-6 text-2xl font-semibold">Reset your password</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter your email and we'll send you a secure reset link.
              </p>
              <form className="mt-6 space-y-4" onSubmit={handleForgot}>
                <Field label="Email" name="email" type="email" error={errors["email"]} />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send reset link
                </Button>
              </form>
              <button
                type="button"
                onClick={() => setMode("login")}
                className="mt-4 w-full text-sm text-muted-foreground hover:text-primary"
              >
                Back to login
              </button>
            </>
          ) : (
            <>
              <h1 className="mt-6 text-2xl font-semibold">
                {mode === "signup" ? "Join ABTalks" : "Welcome back"}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {mode === "signup"
                  ? "Create an account to register for events and personalise your feed."
                  : "Sign in to continue building with the community."}
              </p>

              <Tabs
                value={mode}
                onValueChange={(value) => setMode(value as "login" | "signup")}
                className="mt-6"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign up</TabsTrigger>
                </TabsList>
              </Tabs>

              {mode === "signup" ? (
                <form className="mt-6 space-y-4" onSubmit={handleSignup}>
                  <Field
                    label="Full name"
                    name="fullName"
                    autoComplete="name"
                    error={errors["fullName"]}
                  />
                  <Field
                    label="Username"
                    name="username"
                    autoComplete="username"
                    placeholder="e.g. rohan_builds"
                    error={errors["username"]}
                  />
                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    error={errors["email"]}
                  />
                  <Field
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    error={errors["password"]}
                  />
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create account
                  </Button>
                </form>
              ) : (
                <form className="mt-6 space-y-4" onSubmit={handleLogin}>
                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    error={errors["email"]}
                  />
                  <Field
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    error={errors["password"]}
                  />
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Forgot password?
                  </button>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign in
                  </Button>
                </form>
              )}

              <div className="my-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs uppercase tracking-wide text-muted-foreground">or</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => void handleGoogle()}
                disabled={loading}
              >
                Continue with Google
              </Button>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
  ...rest
}: {
  label: string;
  name: string;
  type?: string;
  error?: string | undefined;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        {...rest}
      />
      {error ? (
        <p id={`${name}-error`} className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
