import { d as fetchUserInterests, l as fetchProfiles, r as fetchEvents, s as fetchPosts, u as fetchResources } from "./api-CfgFj8iz.js";
import { _ as Button, l as formatRelative, p as Badge, u as greeting, v as useAuth } from "./router-DJAHCQz5.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { a as SectionHeading, t as CardGridSkeleton } from "./States-BH6FfLCK.js";
import { t as EventCard } from "./EventCard-DEnwpqlD.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Sparkles } from "lucide-react";
//#region src/lib/recommendations.ts
function normalise(value) {
	return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}
function overlap(interests, candidates) {
	const set = new Set(interests.map(normalise));
	return candidates.filter((candidate) => set.has(normalise(candidate)));
}
function rankEvents(events, interests, limit = 4) {
	const now = Date.now();
	return events.map((event) => {
		const matches = overlap(interests, [event.category, ...event.tags]);
		const daysAway = Math.max(1, (new Date(event.starts_at).getTime() - now) / 864e5);
		return {
			item: event,
			score: matches.length * 10 + Math.min(event.participant_count, 200) / 40 + 12 / daysAway,
			reason: matches.length ? `Matches your interest in ${matches[0]}` : "Popular with the community"
		};
	}).sort((a, b) => b.score - a.score).slice(0, limit);
}
function rankResources(resources, interests, limit = 4) {
	return resources.map((resource) => {
		const matches = overlap(interests, [resource.category, resource.technology]);
		const difficultyBoost = resource.difficulty === "beginner" ? 2 : resource.difficulty === "intermediate" ? 1 : 0;
		return {
			item: resource,
			score: matches.length * 10 + difficultyBoost,
			reason: matches.length ? `Because you follow ${matches[0]}` : "A community favourite to start with"
		};
	}).sort((a, b) => b.score - a.score).slice(0, limit);
}
function rankPosts(posts, interests, limit = 5) {
	return posts.map((post) => {
		const matches = overlap(interests, post.tags);
		const ageHours = (Date.now() - new Date(post.created_at).getTime()) / 36e5;
		return {
			item: post,
			score: matches.length * 8 + post.like_count * .5 + Math.max(0, 48 - ageHours) / 10,
			reason: matches.length ? `Tagged ${matches[0]}` : "Trending in the community"
		};
	}).sort((a, b) => b.score - a.score).slice(0, limit);
}
function rankPeople(people, interests, excludeId, limit = 4) {
	return people.filter((person) => person.id !== excludeId).map((person) => {
		const matches = overlap(interests, person.skills);
		return {
			item: person,
			score: matches.length * 10 + person.skills.length * .2,
			reason: matches.length ? `Works with ${matches[0]}` : "Active community member"
		};
	}).sort((a, b) => b.score - a.score).slice(0, limit);
}
//#endregion
//#region src/routes/_authenticated/dashboard.tsx?tsr-split=component
function Dashboard() {
	const { user, profile } = useAuth();
	const interestNames = (useQuery({
		queryKey: ["user-interests", user?.id],
		enabled: Boolean(user?.id),
		queryFn: () => fetchUserInterests(user.id)
	}).data ?? []).map((interest) => interest.name);
	const eventsQuery = useQuery({
		queryKey: ["events", "all"],
		queryFn: () => fetchEvents()
	});
	const resourcesQuery = useQuery({
		queryKey: ["resources", "all"],
		queryFn: () => fetchResources()
	});
	const postsQuery = useQuery({
		queryKey: ["posts", "all"],
		queryFn: () => fetchPosts({ limit: 20 })
	});
	const peopleQuery = useQuery({
		queryKey: ["profiles", "all"],
		queryFn: () => fetchProfiles({ limit: 20 })
	});
	const events = rankEvents(eventsQuery.data ?? [], interestNames, 3);
	const resources = rankResources(resourcesQuery.data ?? [], interestNames, 3);
	const posts = rankPosts(postsQuery.data ?? [], interestNames, 4);
	const people = rankPeople(peopleQuery.data ?? [], interestNames, user?.id, 3);
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("p", {
						className: "text-xs font-semibold uppercase tracking-[0.18em] text-primary",
						children: greeting()
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "mt-2 font-display text-3xl font-semibold sm:text-4xl",
						children: profile?.full_name ?? "Welcome back"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-2 text-muted-foreground",
						children: interestNames.length ? `Recommendations tuned to ${interestNames.slice(0, 3).join(", ")}` : "Add a few interests to unlock personalised recommendations."
					})
				] }), /* @__PURE__ */ jsx(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ jsx(Link, {
						to: "/onboarding",
						children: "Edit interests"
					})
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "mt-12",
				children: [/* @__PURE__ */ jsx(SectionHeading, {
					eyebrow: "For you",
					title: "Events worth your weekend",
					action: /* @__PURE__ */ jsx(Button, {
						asChild: true,
						variant: "ghost",
						children: /* @__PURE__ */ jsx(Link, {
							to: "/events",
							children: "All events"
						})
					})
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-6",
					children: eventsQuery.isLoading ? /* @__PURE__ */ jsx(CardGridSkeleton, { count: 3 }) : /* @__PURE__ */ jsx("div", {
						className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
						children: events.map(({ item, reason }) => /* @__PURE__ */ jsxs("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ jsx(EventCard, { event: item }), /* @__PURE__ */ jsxs("p", {
								className: "flex items-center gap-1.5 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ jsx(Sparkles, {
									className: "h-3.5 w-3.5 text-primary",
									"aria-hidden": "true"
								}), reason]
							})]
						}, item.id))
					})
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-14 grid gap-10 lg:grid-cols-2",
				children: [/* @__PURE__ */ jsxs("section", { children: [
					/* @__PURE__ */ jsx("h2", {
						className: "text-xl font-semibold",
						children: "Keep learning"
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-4 space-y-3",
						children: resources.map(({ item, reason }) => /* @__PURE__ */ jsxs(Card, {
							className: "p-5",
							children: [
								/* @__PURE__ */ jsx(Badge, {
									variant: "secondary",
									className: "capitalize",
									children: item.difficulty
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "mt-2 font-medium",
									children: item.title
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 line-clamp-2 text-sm text-muted-foreground",
									children: item.description
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-3 text-xs text-primary",
									children: reason
								})
							]
						}, item.id))
					}),
					/* @__PURE__ */ jsx(Button, {
						asChild: true,
						variant: "ghost",
						className: "mt-4",
						children: /* @__PURE__ */ jsx(Link, {
							to: "/learn",
							children: "Browse all resources"
						})
					})
				] }), /* @__PURE__ */ jsxs("section", { children: [
					/* @__PURE__ */ jsx("h2", {
						className: "text-xl font-semibold",
						children: "From the community"
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-4 space-y-3",
						children: posts.map(({ item }) => /* @__PURE__ */ jsxs(Card, {
							className: "p-5",
							children: [/* @__PURE__ */ jsxs("p", {
								className: "text-xs text-muted-foreground",
								children: [
									item.profiles?.full_name ?? "Member",
									" · ",
									formatRelative(item.created_at)
								]
							}), /* @__PURE__ */ jsx("p", {
								className: "mt-2 line-clamp-3 text-sm",
								children: item.content
							})]
						}, item.id))
					}),
					/* @__PURE__ */ jsx(Button, {
						asChild: true,
						variant: "ghost",
						className: "mt-4",
						children: /* @__PURE__ */ jsx(Link, {
							to: "/community",
							children: "Open the feed"
						})
					})
				] })]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "mt-14",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-xl font-semibold",
					children: "People to follow"
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-4 grid gap-5 sm:grid-cols-3",
					children: people.map(({ item, reason }) => /* @__PURE__ */ jsxs(Card, {
						className: "p-5",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "font-medium",
								children: item.full_name
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "text-sm text-muted-foreground",
								children: ["@", item.username]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-2 text-xs text-primary",
								children: reason
							}),
							/* @__PURE__ */ jsx(Button, {
								asChild: true,
								variant: "outline",
								size: "sm",
								className: "mt-4",
								children: /* @__PURE__ */ jsx(Link, {
									to: "/profile/$username",
									params: { username: item.username },
									children: "View profile"
								})
							})
						]
					}, item.id))
				})]
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "mt-14 flex flex-wrap items-center justify-between gap-4 p-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ jsx(CalendarDays, {
						className: "h-5 w-5 text-primary",
						"aria-hidden": "true"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-sm text-muted-foreground",
						children: "Ask the ABTalks assistant what to learn or attend next."
					})]
				}), /* @__PURE__ */ jsx(Button, {
					asChild: true,
					children: /* @__PURE__ */ jsx(Link, {
						to: "/ai",
						children: "Open AI assistant"
					})
				})]
			})
		]
	});
}
//#endregion
export { Dashboard as component };
