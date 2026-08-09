import { t as supabase } from "./client-DJ-fbq50.js";
import { v as useAuth } from "./router-DM-zNBLU.js";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { jsx } from "react/jsx-runtime";
import { Loader2 } from "lucide-react";
//#region src/routes/_authenticated/ai/index.tsx?tsr-split=component
function AiIndex() {
	const { user } = useAuth();
	const navigate = useNavigate();
	useEffect(() => {
		if (!user) return;
		let cancelled = false;
		(async () => {
			const { data: existing } = await supabase.from("chat_threads").select("id").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(1);
			let threadId = existing?.[0]?.id;
			if (!threadId) {
				const { data: created } = await supabase.from("chat_threads").insert({
					user_id: user.id,
					title: "New conversation"
				}).select("id").single();
				threadId = created?.id;
			}
			if (!cancelled && threadId) navigate({
				to: "/ai/$threadId",
				params: { threadId },
				replace: true
			});
		})();
		return () => {
			cancelled = true;
		};
	}, [user, navigate]);
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-[60vh] items-center justify-center",
		children: /* @__PURE__ */ jsx(Loader2, {
			className: "h-6 w-6 animate-spin text-primary",
			"aria-label": "Loading your conversation"
		})
	});
}
//#endregion
export { AiIndex as component };
