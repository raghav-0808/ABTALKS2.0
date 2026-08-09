import { r as fetchEvents } from "./api-CfgFj8iz.js";
import { a as SectionHeading, n as EmptyState, r as ErrorState, t as CardGridSkeleton } from "./States-BH6FfLCK.js";
import { t as EventCard } from "./EventCard-DEnwpqlD.js";
import { t as Input } from "./input-B8Q2ztVi.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.js";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { CalendarSearch, Search } from "lucide-react";
//#region src/routes/events/index.tsx?tsr-split=component
var categories = [
	"all",
	"AI & ML",
	"Web Development",
	"Cloud & DevOps",
	"Cybersecurity",
	"Data Science",
	"Product & Design",
	"Career"
];
var types = [
	"all",
	"hackathon",
	"workshop",
	"talk",
	"webinar",
	"meetup"
];
function EventsPage() {
	const [search, setSearch] = useState("");
	const [category, setCategory] = useState("all");
	const [type, setType] = useState("all");
	const [sort, setSort] = useState("soonest");
	const eventsQuery = useQuery({
		queryKey: ["events", {
			search,
			category,
			type,
			sort
		}],
		queryFn: () => fetchEvents({
			search,
			category,
			type,
			sort
		})
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8",
		children: [
			/* @__PURE__ */ jsx(SectionHeading, {
				eyebrow: "Events",
				title: "Find your next build weekend",
				description: "Hackathons, hands-on workshops, tech talks and meetups — filtered to what you care about."
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-8 grid gap-3 rounded-xl border border-border/70 bg-card/60 p-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "relative sm:col-span-2 lg:col-span-1",
						children: [/* @__PURE__ */ jsx(Search, {
							className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground",
							"aria-hidden": "true"
						}), /* @__PURE__ */ jsx(Input, {
							value: search,
							onChange: (event) => setSearch(event.target.value),
							placeholder: "Search events",
							"aria-label": "Search events",
							className: "pl-9"
						})]
					}),
					/* @__PURE__ */ jsxs(Select, {
						value: category,
						onValueChange: setCategory,
						children: [/* @__PURE__ */ jsx(SelectTrigger, {
							"aria-label": "Filter by category",
							children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Category" })
						}), /* @__PURE__ */ jsx(SelectContent, { children: categories.map((value) => /* @__PURE__ */ jsx(SelectItem, {
							value,
							children: value === "all" ? "All categories" : value
						}, value)) })]
					}),
					/* @__PURE__ */ jsxs(Select, {
						value: type,
						onValueChange: setType,
						children: [/* @__PURE__ */ jsx(SelectTrigger, {
							"aria-label": "Filter by event type",
							children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Type" })
						}), /* @__PURE__ */ jsx(SelectContent, { children: types.map((value) => /* @__PURE__ */ jsx(SelectItem, {
							value,
							children: value === "all" ? "All formats" : value
						}, value)) })]
					}),
					/* @__PURE__ */ jsxs(Select, {
						value: sort,
						onValueChange: (value) => setSort(value),
						children: [/* @__PURE__ */ jsx(SelectTrigger, {
							"aria-label": "Sort events",
							children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Sort" })
						}), /* @__PURE__ */ jsxs(SelectContent, { children: [
							/* @__PURE__ */ jsx(SelectItem, {
								value: "soonest",
								children: "Starting soonest"
							}),
							/* @__PURE__ */ jsx(SelectItem, {
								value: "popular",
								children: "Most popular"
							}),
							/* @__PURE__ */ jsx(SelectItem, {
								value: "latest",
								children: "Recently added"
							})
						] })]
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-10",
				children: eventsQuery.isLoading ? /* @__PURE__ */ jsx(CardGridSkeleton, {}) : eventsQuery.isError ? /* @__PURE__ */ jsx(ErrorState, { onRetry: () => void eventsQuery.refetch() }) : eventsQuery.data?.length ? /* @__PURE__ */ jsx("div", {
					className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
					children: eventsQuery.data.map((event) => /* @__PURE__ */ jsx(EventCard, { event }, event.id))
				}) : /* @__PURE__ */ jsx(EmptyState, {
					icon: /* @__PURE__ */ jsx(CalendarSearch, { className: "h-8 w-8" }),
					title: "No events match those filters",
					description: "Try widening your search or clearing a filter."
				})
			})
		]
	});
}
//#endregion
export { EventsPage as component };
