import { t as supabase } from "./client-DJ-fbq50.js";
import { _ as Button } from "./router-DM-zNBLU.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Input } from "./input-B8Q2ztVi.js";
import { t as Label } from "./label-DBD1bRRP.js";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
//#region src/routes/reset-password.tsx?tsr-split=component
function ResetPassword() {
	const navigate = useNavigate();
	const [ready, setReady] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	useEffect(() => {
		const { data } = supabase.auth.onAuthStateChange((event, session) => {
			if (event === "PASSWORD_RECOVERY" || session) setReady(true);
		});
		supabase.auth.getSession().then(({ data: sessionData }) => {
			if (sessionData.session) setReady(true);
		});
		return () => data.subscription.unsubscribe();
	}, []);
	async function handleSubmit(event) {
		event.preventDefault();
		const password = String(new FormData(event.currentTarget).get("password") ?? "");
		const parsed = z.string().min(8, "Password must be at least 8 characters").safeParse(password);
		if (!parsed.success) {
			setError(parsed.error.issues[0]?.message ?? "Invalid password");
			return;
		}
		setError(null);
		setLoading(true);
		const { error: updateError } = await supabase.auth.updateUser({ password });
		setLoading(false);
		if (updateError) {
			toast.error(updateError.message);
			return;
		}
		toast.success("Password updated");
		await navigate({ to: "/dashboard" });
	}
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16",
		children: /* @__PURE__ */ jsxs(Card, {
			className: "w-full max-w-md p-8",
			children: [/* @__PURE__ */ jsx("h1", {
				className: "text-2xl font-semibold",
				children: "Set a new password"
			}), ready ? /* @__PURE__ */ jsxs("form", {
				className: "mt-6 space-y-4",
				onSubmit: handleSubmit,
				children: [/* @__PURE__ */ jsxs("div", {
					className: "space-y-1.5",
					children: [
						/* @__PURE__ */ jsx(Label, {
							htmlFor: "password",
							children: "New password"
						}),
						/* @__PURE__ */ jsx(Input, {
							id: "password",
							name: "password",
							type: "password",
							autoComplete: "new-password"
						}),
						error ? /* @__PURE__ */ jsx("p", {
							className: "text-xs text-destructive",
							children: error
						}) : null
					]
				}), /* @__PURE__ */ jsxs(Button, {
					type: "submit",
					className: "w-full",
					disabled: loading,
					children: [loading && /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Update password"]
				})]
			}) : /* @__PURE__ */ jsx("p", {
				className: "mt-4 text-sm text-muted-foreground",
				children: "Open this page from the reset link in your email. Waiting for a valid recovery session…"
			})]
		})
	});
}
//#endregion
export { ResetPassword as component };
