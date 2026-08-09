import { l as fetchProfiles, r as fetchEvents, u as fetchResources } from "./api-C3XzEiEJ.js";
import { _ as Button, d as initials, g as AvatarImage, h as AvatarFallback, m as Avatar, o as formatDuration, p as Badge } from "./router-DM-zNBLU.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { a as SectionHeading, n as EmptyState, t as CardGridSkeleton } from "./States-BH6FfLCK.js";
import { t as EventCard } from "./EventCard-BMm_NQ1g.js";
import { t as Input } from "./input-B8Q2ztVi.js";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.js";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { Compass, Search } from "lucide-react";
//#region src/routes/explore.tsx?tsr-split=component
function ExplorePage() {
	const [search, setSearch] = useState("");
	const eventsQuery = useQuery({
		queryKey: ["explore-events", search],
		queryFn: () => fetchEvents({
			search,
			limit: 9
		})
	});
	const peopleQuery = useQuery({
		queryKey: ["explore-people", search],
		queryFn: () => fetchProfiles({
			search,
			limit: 12
		})
	});
	const resourcesQuery = useQuery({
		queryKey: ["explore-resources", search],
		queryFn: () => fetchResources({
			search,
			limit: 12
		})
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8",
		children: [
			/* @__PURE__ */ jsx(SectionHeading, {
				eyebrow: "Explore",
				title: "One search across the whole community",
				description: "Events, members and learning resources — all in one place."
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative mt-8 max-w-xl",
				children: [/* @__PURE__ */ jsx(Search, {
					className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground",
					"aria-hidden": "true"
				}), /* @__PURE__ */ jsx(Input, {
					value: search,
					onChange: (event) => setSearch(event.target.value),
					placeholder: "Try 'AI', 'React' or a name",
					"aria-label": "Search ABTalks",
					className: "h-12 pl-9"
				})]
			}),
			/* @__PURE__ */ jsxs(Tabs, {
				defaultValue: "events",
				className: "mt-10",
				children: [
					/* @__PURE__ */ jsxs(TabsList, { children: [
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "events",
							children: "Events"
						}),
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "people",
							children: "People"
						}),
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "resources",
							children: "Resources"
						})
					] }),
					/* @__PURE__ */ jsx(TabsContent, {
						value: "events",
						className: "mt-8",
						children: eventsQuery.isLoading ? /* @__PURE__ */ jsx(CardGridSkeleton, { count: 3 }) : eventsQuery.data?.length ? /* @__PURE__ */ jsx("div", {
							className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
							children: eventsQuery.data.map((event) => /* @__PURE__ */ jsx(EventCard, { event }, event.id))
						}) : /* @__PURE__ */ jsx(EmptyState, {
							icon: /* @__PURE__ */ jsx(Compass, { className: "h-8 w-8" }),
							title: "No events found"
						})
					}),
					/* @__PURE__ */ jsx(TabsContent, {
						value: "people",
						className: "mt-8",
						children: peopleQuery.data?.length ? /* @__PURE__ */ jsx("div", {
							className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
							children: peopleQuery.data.map((person) => /* @__PURE__ */ jsxs(Card, {
								className: "card-hover flex flex-col gap-3 p-5",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ jsxs(Avatar, {
											className: "h-12 w-12",
											children: [/* @__PURE__ */ jsx(AvatarImage, {
												src: person.avatar_url ?? void 0,
												alt: ""
											}), /* @__PURE__ */ jsx(AvatarFallback, { children: initials(person.full_name) })]
										}), /* @__PURE__ */ jsxs("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ jsx("p", {
												className: "truncate font-medium",
												children: person.full_name
											}), /* @__PURE__ */ jsxs("p", {
												className: "truncate text-sm text-muted-foreground",
												children: ["@", person.username]
											})]
										})]
									}),
									/* @__PURE__ */ jsx("p", {
										className: "line-clamp-2 text-sm text-muted-foreground",
										children: person.headline ?? person.bio
									}),
									/* @__PURE__ */ jsx("div", {
										className: "flex flex-wrap gap-1.5",
										children: person.skills.slice(0, 3).map((skill) => /* @__PURE__ */ jsx(Badge, {
											variant: "secondary",
											children: skill
										}, skill))
									}),
									/* @__PURE__ */ jsx(Button, {
										asChild: true,
										variant: "outline",
										size: "sm",
										className: "mt-auto",
										children: /* @__PURE__ */ jsx(Link, {
											to: "/profile/$username",
											params: { username: person.username },
											children: "View profile"
										})
									})
								]
							}, person.id))
						}) : /* @__PURE__ */ jsx(EmptyState, {
							icon: /* @__PURE__ */ jsx(Compass, { className: "h-8 w-8" }),
							title: "No members found"
						})
					}),
					/* @__PURE__ */ jsx(TabsContent, {
						value: "resources",
						className: "mt-8",
						children: resourcesQuery.data?.length ? /* @__PURE__ */ jsx("div", {
							className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
							children: resourcesQuery.data.map((resource) => /* @__PURE__ */ jsxs(Card, {
								className: "card-hover flex flex-col gap-3 p-5",
								children: [
									/* @__PURE__ */ jsx(Badge, {
										variant: "secondary",
										className: "w-fit capitalize",
										children: resource.difficulty
									}),
									/* @__PURE__ */ jsx("h3", {
										className: "text-base font-semibold leading-snug",
										children: resource.title
									}),
									/* @__PURE__ */ jsx("p", {
										className: "line-clamp-2 text-sm text-muted-foreground",
										children: resource.description
									}),
									/* @__PURE__ */ jsxs("p", {
										className: "mt-auto text-xs text-muted-foreground",
										children: [
											resource.technology,
											" · ",
											formatDuration(resource.estimated_minutes)
										]
									})
								]
							}, resource.id))
						}) : /* @__PURE__ */ jsx(EmptyState, {
							icon: /* @__PURE__ */ jsx(Compass, { className: "h-8 w-8" }),
							title: "No resources found"
						})
					})
				]
			})
		]
	});
}
//#endregion
export { ExplorePage as component };
