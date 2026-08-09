import { t as supabase } from "./client-DJ-fbq50.js";
import { _ as Button, a as Route } from "./router-DM-zNBLU.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Input } from "./input-B8Q2ztVi.js";
import { t as Label } from "./label-DBD1bRRP.js";
import { i as TabsTrigger, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.js";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, Hexagon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
//#region src/routes/auth.tsx?tsr-split=component
var signupSchema = z.object({
	fullName: z.string().trim().min(2, "Please enter your full name").max(80),
	username: z.string().trim().min(3, "Username must be at least 3 characters").max(24).regex(/^[a-z0-9_]+$/, "Use lowercase letters, numbers and underscores only"),
	email: z.string().trim().email("Enter a valid email address").max(255),
	password: z.string().min(8, "Password must be at least 8 characters").max(72)
});
var loginSchema = z.object({
	email: z.string().trim().email("Enter a valid email address"),
	password: z.string().min(1, "Enter your password")
});
function AuthPage() {
	const { mode } = Route.useSearch();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({});
	function setMode(next) {
		setErrors({});
		navigate({
			to: "/auth",
			search: { mode: next }
		});
	}
	async function handleSignup(event) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		const parsed = signupSchema.safeParse({
			fullName: form.get("fullName"),
			username: String(form.get("username") ?? "").toLowerCase(),
			email: form.get("email"),
			password: form.get("password")
		});
		if (!parsed.success) {
			setErrors(Object.fromEntries(parsed.error.issues.map((issue) => [String(issue.path[0]), issue.message])));
			return;
		}
		setErrors({});
		setLoading(true);
		const { error } = await supabase.auth.signUp({
			email: parsed.data.email,
			password: parsed.data.password,
			options: {
				emailRedirectTo: `${window.location.origin}/dashboard`,
				data: {
					full_name: parsed.data.fullName,
					username: parsed.data.username
				}
			}
		});
		setLoading(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success("Welcome to ABTalks! Let's personalise your feed.");
		await navigate({ to: "/onboarding" });
	}
	async function handleLogin(event) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		const parsed = loginSchema.safeParse({
			email: form.get("email"),
			password: form.get("password")
		});
		if (!parsed.success) {
			setErrors(Object.fromEntries(parsed.error.issues.map((issue) => [String(issue.path[0]), issue.message])));
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
	async function handleForgot(event) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		const email = String(form.get("email") ?? "").trim();
		if (!z.string().email().safeParse(email).success) {
			setErrors({ email: "Enter a valid email address" });
			return;
		}
		setErrors({});
		setLoading(true);
		const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
		setLoading(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success("If that email exists, a reset link is on its way.");
	}
	async function handleGoogle() {
		setLoading(true);
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: { redirectTo: window.location.origin }
		});
		setLoading(false);
		if (error) {
			toast.error("Google sign-in failed. Please try again.");
			return;
		}
	}
	return /* @__PURE__ */ jsx("div", {
		className: "hero-glow flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16",
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-md",
			children: [/* @__PURE__ */ jsxs(Link, {
				to: "/",
				className: "mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }), " Back to home"]
			}), /* @__PURE__ */ jsxs(Card, {
				className: "p-6 sm:p-8",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(Hexagon, {
						className: "h-6 w-6 text-primary",
						"aria-hidden": "true"
					}), /* @__PURE__ */ jsx("span", {
						className: "font-display text-lg font-semibold",
						children: "ABTalks"
					})]
				}), mode === "forgot" ? /* @__PURE__ */ jsxs(Fragment, { children: [
					/* @__PURE__ */ jsx("h1", {
						className: "mt-6 text-2xl font-semibold",
						children: "Reset your password"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Enter your email and we'll send you a secure reset link."
					}),
					/* @__PURE__ */ jsxs("form", {
						className: "mt-6 space-y-4",
						onSubmit: handleForgot,
						children: [/* @__PURE__ */ jsx(Field, {
							label: "Email",
							name: "email",
							type: "email",
							error: errors["email"]
						}), /* @__PURE__ */ jsxs(Button, {
							type: "submit",
							className: "w-full",
							disabled: loading,
							children: [loading && /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Send reset link"]
						})]
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setMode("login"),
						className: "mt-4 w-full text-sm text-muted-foreground hover:text-primary",
						children: "Back to login"
					})
				] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
					/* @__PURE__ */ jsx("h1", {
						className: "mt-6 text-2xl font-semibold",
						children: mode === "signup" ? "Join ABTalks" : "Welcome back"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: mode === "signup" ? "Create an account to register for events and personalise your feed." : "Sign in to continue building with the community."
					}),
					/* @__PURE__ */ jsx(Tabs, {
						value: mode,
						onValueChange: (value) => setMode(value),
						className: "mt-6",
						children: /* @__PURE__ */ jsxs(TabsList, {
							className: "grid w-full grid-cols-2",
							children: [/* @__PURE__ */ jsx(TabsTrigger, {
								value: "login",
								children: "Login"
							}), /* @__PURE__ */ jsx(TabsTrigger, {
								value: "signup",
								children: "Sign up"
							})]
						})
					}),
					mode === "signup" ? /* @__PURE__ */ jsxs("form", {
						className: "mt-6 space-y-4",
						onSubmit: handleSignup,
						children: [
							/* @__PURE__ */ jsx(Field, {
								label: "Full name",
								name: "fullName",
								autoComplete: "name",
								error: errors["fullName"]
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Username",
								name: "username",
								autoComplete: "username",
								placeholder: "e.g. rohan_builds",
								error: errors["username"]
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Email",
								name: "email",
								type: "email",
								autoComplete: "email",
								error: errors["email"]
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Password",
								name: "password",
								type: "password",
								autoComplete: "new-password",
								error: errors["password"]
							}),
							/* @__PURE__ */ jsxs(Button, {
								type: "submit",
								className: "w-full",
								disabled: loading,
								children: [loading && /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Create account"]
							})
						]
					}) : /* @__PURE__ */ jsxs("form", {
						className: "mt-6 space-y-4",
						onSubmit: handleLogin,
						children: [
							/* @__PURE__ */ jsx(Field, {
								label: "Email",
								name: "email",
								type: "email",
								autoComplete: "email",
								error: errors["email"]
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Password",
								name: "password",
								type: "password",
								autoComplete: "current-password",
								error: errors["password"]
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setMode("forgot"),
								className: "text-sm text-muted-foreground hover:text-primary",
								children: "Forgot password?"
							}),
							/* @__PURE__ */ jsxs(Button, {
								type: "submit",
								className: "w-full",
								disabled: loading,
								children: [loading && /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Sign in"]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "my-6 flex items-center gap-3",
						children: [
							/* @__PURE__ */ jsx("span", { className: "h-px flex-1 bg-border" }),
							/* @__PURE__ */ jsx("span", {
								className: "text-xs uppercase tracking-wide text-muted-foreground",
								children: "or"
							}),
							/* @__PURE__ */ jsx("span", { className: "h-px flex-1 bg-border" })
						]
					}),
					/* @__PURE__ */ jsx(Button, {
						variant: "outline",
						className: "w-full",
						onClick: () => void handleGoogle(),
						disabled: loading,
						children: "Continue with Google"
					})
				] })]
			})]
		})
	});
}
function Field({ label, name, type = "text", error, ...rest }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-1.5",
		children: [
			/* @__PURE__ */ jsx(Label, {
				htmlFor: name,
				children: label
			}),
			/* @__PURE__ */ jsx(Input, {
				id: name,
				name,
				type,
				"aria-invalid": Boolean(error),
				"aria-describedby": error ? `${name}-error` : void 0,
				...rest
			}),
			error ? /* @__PURE__ */ jsx("p", {
				id: `${name}-error`,
				className: "text-xs text-destructive",
				children: error
			}) : null
		]
	});
}
//#endregion
export { AuthPage as component };
