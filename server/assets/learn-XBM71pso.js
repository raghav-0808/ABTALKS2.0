import { u as fetchResources } from "./api-CfgFj8iz.js";
import { _ as Button, o as formatDuration, p as Badge, v as useAuth } from "./router-DrXqpvlG.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { a as SectionHeading, n as EmptyState, r as ErrorState, t as CardGridSkeleton } from "./States-BH6FfLCK.js";
import { t as useBookmarks } from "./useBookmarks-4W4HRVXi.js";
import { t as Input } from "./input-B8Q2ztVi.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.js";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Bookmark, BookmarkCheck, Clock, ExternalLink, Search } from "lucide-react";
//#region src/routes/learn.tsx?tsr-split=component
var difficulties = [
	"all",
	"beginner",
	"intermediate",
	"advanced"
];
function LearnPage() {
	const [search, setSearch] = useState("");
	const [difficulty, setDifficulty] = useState("all");
	const { user } = useAuth();
	const { isSaved, toggle } = useBookmarks();
	const resourcesQuery = useQuery({
		queryKey: ["resources", {
			search,
			difficulty
		}],
		queryFn: () => fetchResources({
			search,
			difficulty
		})
	});
	const grouped = (resourcesQuery.data ?? []).reduce((accumulator, resource) => {
		const bucket = accumulator[resource.category] ?? [];
		bucket.push(resource);
		accumulator[resource.category] = bucket;
		return accumulator;
	}, {});
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8",
		children: [
			/* @__PURE__ */ jsx(SectionHeading, {
				eyebrow: "Learn",
				title: "Structured paths, not random links",
				description: "Every resource is tagged by technology, difficulty and time so you always know what to pick up next."
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-8 grid gap-3 rounded-xl border border-border/70 bg-card/60 p-4 sm:grid-cols-[minmax(0,1fr)_12rem]",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "relative",
					children: [/* @__PURE__ */ jsx(Search, {
						className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground",
						"aria-hidden": "true"
					}), /* @__PURE__ */ jsx(Input, {
						value: search,
						onChange: (event) => setSearch(event.target.value),
						placeholder: "Search resources",
						"aria-label": "Search learning resources",
						className: "pl-9"
					})]
				}), /* @__PURE__ */ jsxs(Select, {
					value: difficulty,
					onValueChange: setDifficulty,
					children: [/* @__PURE__ */ jsx(SelectTrigger, {
						"aria-label": "Filter by difficulty",
						children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Difficulty" })
					}), /* @__PURE__ */ jsx(SelectContent, { children: difficulties.map((value) => /* @__PURE__ */ jsx(SelectItem, {
						value,
						children: value === "all" ? "All levels" : value
					}, value)) })]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-10 space-y-12",
				children: resourcesQuery.isLoading ? /* @__PURE__ */ jsx(CardGridSkeleton, {}) : resourcesQuery.isError ? /* @__PURE__ */ jsx(ErrorState, { onRetry: () => void resourcesQuery.refetch() }) : Object.keys(grouped).length === 0 ? /* @__PURE__ */ jsx(EmptyState, {
					icon: /* @__PURE__ */ jsx(BookOpen, { className: "h-8 w-8" }),
					title: "No resources found",
					description: "Try a different search term or difficulty level."
				}) : Object.entries(grouped).map(([category, resources]) => /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", {
					className: "text-xl font-semibold",
					children: category
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
					children: resources?.map((resource) => /* @__PURE__ */ jsxs(Card, {
						className: "card-hover flex flex-col gap-3 p-5",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ jsx(Badge, {
									variant: "secondary",
									className: "capitalize",
									children: resource.difficulty
								}), user ? /* @__PURE__ */ jsx("button", {
									type: "button",
									"aria-label": isSaved("resource", resource.id) ? "Remove from saved" : "Save resource",
									onClick: () => toggle("resource", resource.id),
									className: "text-muted-foreground transition-colors hover:text-primary",
									children: isSaved("resource", resource.id) ? /* @__PURE__ */ jsx(BookmarkCheck, { className: "h-4 w-4 text-primary" }) : /* @__PURE__ */ jsx(Bookmark, { className: "h-4 w-4" })
								}) : null]
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "text-base font-semibold leading-snug",
								children: resource.title
							}),
							/* @__PURE__ */ jsx("p", {
								className: "line-clamp-3 flex-1 text-sm text-muted-foreground",
								children: resource.description
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center gap-1.5",
									children: [/* @__PURE__ */ jsx(Clock, {
										className: "h-3.5 w-3.5",
										"aria-hidden": "true"
									}), formatDuration(resource.estimated_minutes)]
								}), /* @__PURE__ */ jsx("span", { children: resource.technology })]
							}),
							/* @__PURE__ */ jsx(Button, {
								asChild: true,
								variant: "outline",
								size: "sm",
								children: /* @__PURE__ */ jsxs("a", {
									href: resource.url,
									target: "_blank",
									rel: "noreferrer noopener",
									children: ["Open resource", /* @__PURE__ */ jsx(ExternalLink, {
										className: "ml-2 h-3.5 w-3.5",
										"aria-hidden": "true"
									})]
								})
							})
						]
					}, resource.id))
				})] }, category))
			})
		]
	});
}
//#endregion
export { LearnPage as component };

//# sourceMappingURL=learn-XBM71pso.js.map