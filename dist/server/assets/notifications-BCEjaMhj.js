import { t as supabase } from "./client-DJ-fbq50.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { o as fetchNotifications } from "./api-C3XzEiEJ.js";
import { _ as Button, l as formatRelative, v as useAuth } from "./router-DM-zNBLU.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { a as SectionHeading, i as ListSkeleton, n as EmptyState } from "./States-BH6FfLCK.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BellOff, Check } from "lucide-react";
//#region src/routes/_authenticated/notifications.tsx?tsr-split=component
function NotificationsPage() {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const notificationsQuery = useQuery({
		queryKey: ["notifications", user?.id],
		enabled: Boolean(user?.id),
		queryFn: () => fetchNotifications(user.id)
	});
	const markAllRead = useMutation({
		mutationFn: async () => {
			const { error } = await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id).eq("is_read", false);
			if (error) throw error;
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] })
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-3xl px-4 py-14 sm:px-6",
		children: [/* @__PURE__ */ jsx(SectionHeading, {
			eyebrow: "Activity",
			title: "Notifications",
			action: /* @__PURE__ */ jsxs(Button, {
				variant: "outline",
				size: "sm",
				onClick: () => markAllRead.mutate(),
				children: [/* @__PURE__ */ jsx(Check, { className: "mr-2 h-4 w-4" }), " Mark all read"]
			})
		}), /* @__PURE__ */ jsx("div", {
			className: "mt-8 space-y-3",
			children: notificationsQuery.isLoading ? /* @__PURE__ */ jsx(ListSkeleton, { count: 3 }) : notificationsQuery.data?.length ? notificationsQuery.data.map((notification) => /* @__PURE__ */ jsxs(Card, {
				className: cn("p-5", !notification.is_read && "border-primary/40 bg-primary/5"),
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "font-medium",
						children: notification.title
					}),
					notification.body ? /* @__PURE__ */ jsx("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: notification.body
					}) : null,
					/* @__PURE__ */ jsx("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: formatRelative(notification.created_at)
					})
				]
			}, notification.id)) : /* @__PURE__ */ jsx(EmptyState, {
				icon: /* @__PURE__ */ jsx(BellOff, { className: "h-8 w-8" }),
				title: "You're all caught up",
				description: "Register for an event or follow someone to start getting updates."
			})
		})]
	});
}
//#endregion
export { NotificationsPage as component };
