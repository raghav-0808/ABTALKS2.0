import { r as fetchEvents, u as fetchResources } from "./api-C3XzEiEJ.js";
import { _ as Button } from "./router-DM-zNBLU.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { a as SectionHeading, i as ListSkeleton, n as EmptyState } from "./States-BH6FfLCK.js";
import { t as EventCard } from "./EventCard-BMm_NQ1g.js";
import { t as useBookmarks } from "./useBookmarks-CFAgYCO3.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { BookmarkX } from "lucide-react";
//#region src/routes/_authenticated/saved.tsx?tsr-split=component
function SavedPage() {
	const { bookmarks, isLoading, toggle } = useBookmarks();
	const eventsQuery = useQuery({
		queryKey: ["events", "all"],
		queryFn: () => fetchEvents()
	});
	const resourcesQuery = useQuery({
		queryKey: ["resources", "all"],
		queryFn: () => fetchResources()
	});
	const savedEventIds = bookmarks.filter((row) => row.item_type === "event").map((row) => row.item_id);
	const savedResourceIds = bookmarks.filter((row) => row.item_type === "resource").map((row) => row.item_id);
	const events = (eventsQuery.data ?? []).filter((event) => savedEventIds.includes(event.id));
	const resources = (resourcesQuery.data ?? []).filter((resource) => savedResourceIds.includes(resource.id));
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-6xl px-4 py-14 sm:px-6",
		children: [/* @__PURE__ */ jsx(SectionHeading, {
			eyebrow: "Library",
			title: "Saved for later"
		}), isLoading ? /* @__PURE__ */ jsx("div", {
			className: "mt-8",
			children: /* @__PURE__ */ jsx(ListSkeleton, { count: 3 })
		}) : bookmarks.length === 0 ? /* @__PURE__ */ jsx("div", {
			className: "mt-8",
			children: /* @__PURE__ */ jsx(EmptyState, {
				icon: /* @__PURE__ */ jsx(BookmarkX, { className: "h-8 w-8" }),
				title: "Nothing saved yet",
				description: "Bookmark events and resources to find them here.",
				action: /* @__PURE__ */ jsx(Button, {
					asChild: true,
					className: "mt-2",
					children: /* @__PURE__ */ jsx(Link, {
						to: "/events",
						children: "Browse events"
					})
				})
			})
		}) : /* @__PURE__ */ jsxs("div", {
			className: "mt-10 space-y-12",
			children: [events.length ? /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", {
				className: "text-xl font-semibold",
				children: "Events"
			}), /* @__PURE__ */ jsx("div", {
				className: "mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
				children: events.map((event) => /* @__PURE__ */ jsx(EventCard, { event }, event.id))
			})] }) : null, resources.length ? /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", {
				className: "text-xl font-semibold",
				children: "Resources"
			}), /* @__PURE__ */ jsx("div", {
				className: "mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: resources.map((resource) => /* @__PURE__ */ jsxs(Card, {
					className: "flex flex-col gap-3 p-5",
					children: [
						/* @__PURE__ */ jsx("h3", {
							className: "font-medium",
							children: resource.title
						}),
						/* @__PURE__ */ jsx("p", {
							className: "line-clamp-2 text-sm text-muted-foreground",
							children: resource.description
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-auto flex gap-2",
							children: [/* @__PURE__ */ jsx(Button, {
								asChild: true,
								size: "sm",
								variant: "outline",
								children: /* @__PURE__ */ jsx("a", {
									href: resource.url,
									target: "_blank",
									rel: "noreferrer noopener",
									children: "Open"
								})
							}), /* @__PURE__ */ jsx(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => toggle("resource", resource.id),
								children: "Remove"
							})]
						})
					]
				}, resource.id))
			})] }) : null]
		})]
	});
}
//#endregion
export { SavedPage as component };
