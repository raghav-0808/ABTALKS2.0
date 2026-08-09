import { t as cn } from "./utils-C_uf36nf.js";
import { a as fetchInterests, d as fetchUserInterests, f as saveUserInterests } from "./api-C3XzEiEJ.js";
import { _ as Button, v as useAuth } from "./router-DM-zNBLU.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Skeleton } from "./skeleton-D9W9wFsj.js";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { Check, Loader2, Sparkle } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/_authenticated/onboarding.tsx?tsr-split=component
function Onboarding() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [selected, setSelected] = useState([]);
	const [saving, setSaving] = useState(false);
	const interestsQuery = useQuery({
		queryKey: ["interests"],
		queryFn: fetchInterests
	});
	const mineQuery = useQuery({
		queryKey: ["user-interests", user?.id],
		enabled: Boolean(user?.id),
		queryFn: () => fetchUserInterests(user.id)
	});
	useEffect(() => {
		if (mineQuery.data?.length) setSelected(mineQuery.data.map((interest) => interest.id));
	}, [mineQuery.data]);
	function toggle(id) {
		setSelected((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
	}
	async function handleSave() {
		if (!user) return;
		if (selected.length < 3) {
			toast.error("Pick at least three interests so we can personalise properly.");
			return;
		}
		setSaving(true);
		try {
			await saveUserInterests(user.id, selected);
			toast.success("Your feed is personalised");
			await navigate({ to: "/dashboard" });
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Could not save your interests");
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ jsx("div", {
		className: "hero-glow min-h-[calc(100vh-4rem)] px-4 py-16 sm:px-6",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-3xl",
			children: [
				/* @__PURE__ */ jsx("p", {
					className: "text-xs font-semibold uppercase tracking-[0.18em] text-primary",
					children: "Step 1 of 1"
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "mt-3 text-3xl font-semibold sm:text-4xl",
					children: "What are you into?"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-3 text-muted-foreground",
					children: "Choose at least three topics. We use these to recommend events, learning resources and people worth following."
				}),
				/* @__PURE__ */ jsxs(Card, {
					className: "mt-8 p-6",
					children: [interestsQuery.isLoading ? /* @__PURE__ */ jsx("div", {
						className: "flex flex-wrap gap-3",
						children: Array.from({ length: 12 }).map((_, index) => /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-32 rounded-full" }, index))
					}) : /* @__PURE__ */ jsx("div", {
						className: "flex flex-wrap gap-3",
						children: interestsQuery.data?.map((interest) => {
							const isSelected = selected.includes(interest.id);
							return /* @__PURE__ */ jsxs("button", {
								type: "button",
								"aria-pressed": isSelected,
								onClick: () => toggle(interest.id),
								className: cn("inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all", isSelected ? "border-primary bg-primary/15 text-foreground" : "border-border bg-secondary/40 text-muted-foreground hover:border-primary/50 hover:text-foreground"),
								children: [isSelected ? /* @__PURE__ */ jsx(Check, {
									className: "h-4 w-4 text-primary",
									"aria-hidden": "true"
								}) : /* @__PURE__ */ jsx(Sparkle, {
									className: "h-4 w-4 opacity-60",
									"aria-hidden": "true"
								}), interest.name]
							}, interest.id);
						})
					}), /* @__PURE__ */ jsxs("div", {
						className: "mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-6",
						children: [/* @__PURE__ */ jsxs("p", {
							className: "text-sm text-muted-foreground",
							children: [selected.length, " selected"]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ jsx(Button, {
								variant: "ghost",
								onClick: () => void navigate({ to: "/dashboard" }),
								children: "Skip for now"
							}), /* @__PURE__ */ jsxs(Button, {
								onClick: () => void handleSave(),
								disabled: saving,
								children: [saving && /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Save and continue"]
							})]
						})]
					})]
				})
			]
		})
	});
}
//#endregion
export { Onboarding as component };
