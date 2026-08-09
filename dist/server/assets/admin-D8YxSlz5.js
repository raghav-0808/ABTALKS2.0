import { l as fetchProfiles, r as fetchEvents, s as fetchPosts } from "./api-C3XzEiEJ.js";
import { s as formatEventDate, v as useAuth } from "./router-DM-zNBLU.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { a as SectionHeading } from "./States-BH6FfLCK.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, MessagesSquare, ShieldAlert, Users } from "lucide-react";
//#region src/routes/_authenticated/admin.tsx?tsr-split=component
function AdminPage() {
	const { isAdmin } = useAuth();
	const eventsQuery = useQuery({
		queryKey: ["events", "all"],
		queryFn: () => fetchEvents()
	});
	const postsQuery = useQuery({
		queryKey: ["posts", "all"],
		queryFn: () => fetchPosts({ limit: 50 })
	});
	const peopleQuery = useQuery({
		queryKey: ["profiles", "all"],
		queryFn: () => fetchProfiles({ limit: 100 })
	});
	if (!isAdmin) return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-2xl px-4 py-24 text-center",
		children: [
			/* @__PURE__ */ jsx(ShieldAlert, {
				className: "mx-auto h-10 w-10 text-muted-foreground",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "mt-4 text-2xl font-semibold",
				children: "Admins only"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-2 text-muted-foreground",
				children: "This area is limited to ABTalks organisers."
			})
		]
	});
	const stats = [
		{
			label: "Members",
			value: peopleQuery.data?.length ?? 0,
			icon: Users
		},
		{
			label: "Events",
			value: eventsQuery.data?.length ?? 0,
			icon: CalendarDays
		},
		{
			label: "Posts",
			value: postsQuery.data?.length ?? 0,
			icon: MessagesSquare
		}
	];
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-6xl px-4 py-14 sm:px-6",
		children: [
			/* @__PURE__ */ jsx(SectionHeading, {
				eyebrow: "Admin",
				title: "Community overview"
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-8 grid gap-5 sm:grid-cols-3",
				children: stats.map((stat) => /* @__PURE__ */ jsxs(Card, {
					className: "p-6",
					children: [
						/* @__PURE__ */ jsx(stat.icon, {
							className: "h-5 w-5 text-primary",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-3 text-3xl font-semibold",
							children: stat.value
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted-foreground",
							children: stat.label
						})
					]
				}, stat.label))
			}),
			/* @__PURE__ */ jsx("h2", {
				className: "mt-12 text-xl font-semibold",
				children: "Upcoming events by registrations"
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-4 space-y-3",
				children: (eventsQuery.data ?? []).slice(0, 8).map((event) => /* @__PURE__ */ jsxs(Card, {
					className: "flex flex-wrap items-center justify-between gap-3 p-5",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
						className: "font-medium",
						children: event.title
					}), /* @__PURE__ */ jsx("p", {
						className: "text-sm text-muted-foreground",
						children: formatEventDate(event.starts_at)
					})] }), /* @__PURE__ */ jsxs("p", {
						className: "text-sm",
						children: [/* @__PURE__ */ jsx("strong", { children: event.participant_count }), /* @__PURE__ */ jsxs("span", {
							className: "text-muted-foreground",
							children: [
								" / ",
								event.capacity,
								" registered"
							]
						})]
					})]
				}, event.id))
			})
		]
	});
}
//#endregion
export { AdminPage as component };
