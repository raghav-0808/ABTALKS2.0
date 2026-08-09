import { l as fetchProfiles, r as fetchEvents, s as fetchPosts } from "./api-CfgFj8iz.js";
import { _ as Button, d as initials, g as AvatarImage, h as AvatarFallback, l as formatRelative, m as Avatar, p as Badge } from "./router-DrXqpvlG.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { a as SectionHeading, r as ErrorState, t as CardGridSkeleton } from "./States-BH6FfLCK.js";
import { t as EventCard } from "./EventCard-CKDkXU1_.js";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Bot, Compass, Flame, MessageSquare, Sparkle, TrendingUp, Users } from "lucide-react";
//#region src/components/home/HeroNetwork.tsx
var nodes = [
	{
		id: "ai",
		label: "AI",
		x: 50,
		y: 18,
		r: 26
	},
	{
		id: "web",
		label: "Web",
		x: 18,
		y: 40,
		r: 22
	},
	{
		id: "cloud",
		label: "Cloud",
		x: 82,
		y: 38,
		r: 22
	},
	{
		id: "java",
		label: "Java",
		x: 28,
		y: 76,
		r: 20
	},
	{
		id: "sec",
		label: "Security",
		x: 72,
		y: 78,
		r: 20
	},
	{
		id: "hub",
		label: "You",
		x: 50,
		y: 52,
		r: 30
	}
];
var edges = [
	["hub", "ai"],
	["hub", "web"],
	["hub", "cloud"],
	["hub", "java"],
	["hub", "sec"],
	["ai", "cloud"],
	["web", "java"],
	["cloud", "sec"]
];
var byId = Object.fromEntries(nodes.map((node) => [node.id, node]));
function HeroNetwork() {
	const [active, setActive] = useState(null);
	return /* @__PURE__ */ jsxs("div", {
		className: "relative mx-auto aspect-square w-full max-w-lg",
		children: [/* @__PURE__ */ jsx("div", { className: "animate-orbit absolute inset-6 rounded-full bg-primary/10 blur-3xl" }), /* @__PURE__ */ jsxs("svg", {
			viewBox: "0 0 100 100",
			role: "img",
			"aria-label": "An interactive network of ABTalks community topics connected to you",
			className: "relative h-full w-full",
			children: [edges.map(([from, to]) => {
				const a = byId[from];
				const b = byId[to];
				const highlighted = active === from || active === to;
				return /* @__PURE__ */ jsx("line", {
					x1: a.x,
					y1: a.y,
					x2: b.x,
					y2: b.y,
					stroke: "currentColor",
					strokeWidth: highlighted ? .7 : .35,
					className: highlighted ? "text-primary transition-all" : "text-border transition-all"
				}, `${from}-${to}`);
			}), nodes.map((node) => {
				const isActive = active === node.id;
				const isHub = node.id === "hub";
				return /* @__PURE__ */ jsxs("g", {
					tabIndex: 0,
					role: "button",
					"aria-label": `${node.label} community`,
					onMouseEnter: () => setActive(node.id),
					onMouseLeave: () => setActive(null),
					onFocus: () => setActive(node.id),
					onBlur: () => setActive(null),
					className: "cursor-pointer outline-none",
					children: [/* @__PURE__ */ jsx("circle", {
						cx: node.x,
						cy: node.y,
						r: node.r / 3.2,
						className: isHub ? "fill-primary/25 stroke-primary" : isActive ? "fill-accent/25 stroke-accent" : "fill-card stroke-border",
						strokeWidth: .5
					}), /* @__PURE__ */ jsx("text", {
						x: node.x,
						y: node.y + 1.2,
						textAnchor: "middle",
						className: "pointer-events-none fill-foreground text-[3px] font-medium",
						children: node.label
					})]
				}, node.id);
			})]
		})]
	});
}
//#endregion
//#region src/routes/index.tsx?tsr-split=component
var topics = [
	{
		name: "Artificial Intelligence",
		slug: "Artificial Intelligence"
	},
	{
		name: "Web Development",
		slug: "Web Development"
	},
	{
		name: "Java",
		slug: "Java"
	},
	{
		name: "React",
		slug: "React"
	},
	{
		name: "Cloud",
		slug: "Cloud"
	},
	{
		name: "Cybersecurity",
		slug: "Cybersecurity"
	},
	{
		name: "Blockchain",
		slug: "Blockchain"
	},
	{
		name: "Data Science",
		slug: "Data Science"
	}
];
function Home() {
	const eventsQuery = useQuery({
		queryKey: ["home-events"],
		queryFn: () => fetchEvents({
			sort: "soonest",
			limit: 6
		})
	});
	const postsQuery = useQuery({
		queryKey: ["home-posts"],
		queryFn: () => fetchPosts({
			sort: "popular",
			limit: 4
		})
	});
	const peopleQuery = useQuery({
		queryKey: ["home-people"],
		queryFn: () => fetchProfiles({ limit: 6 })
	});
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsxs("section", {
			className: "hero-glow relative overflow-hidden",
			children: [/* @__PURE__ */ jsx("div", {
				className: "grid-lines pointer-events-none absolute inset-0",
				"aria-hidden": "true"
			}), /* @__PURE__ */ jsxs("div", {
				className: "relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-28",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "animate-rise",
					children: [
						/* @__PURE__ */ jsxs(Badge, {
							variant: "secondary",
							className: "gap-1.5 rounded-full px-3 py-1",
							children: [/* @__PURE__ */ jsx(Sparkle, {
								className: "h-3.5 w-3.5 text-primary",
								"aria-hidden": "true"
							}), "AI-powered technology community"]
						}),
						/* @__PURE__ */ jsxs("h1", {
							className: "mt-6 text-4xl font-semibold leading-[1.05] sm:text-6xl",
							children: ["Where Ideas Meet ", /* @__PURE__ */ jsx("span", {
								className: "text-gradient",
								children: "Intelligence."
							})]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-6 max-w-xl text-lg text-muted-foreground",
							children: "Discover people, events, knowledge and opportunities shaping the next generation of technology."
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-8 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ jsx(Button, {
								size: "lg",
								asChild: true,
								children: /* @__PURE__ */ jsxs(Link, {
									to: "/explore",
									children: ["Explore ABTalks ", /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })]
								})
							}), /* @__PURE__ */ jsx(Button, {
								size: "lg",
								variant: "outline",
								asChild: true,
								children: /* @__PURE__ */ jsx(Link, {
									to: "/auth",
									search: { mode: "signup" },
									children: "Join the Community"
								})
							})]
						}),
						/* @__PURE__ */ jsx("dl", {
							className: "mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-border/60 pt-6",
							children: [
								{
									label: "Upcoming events",
									value: "10+"
								},
								{
									label: "Learning resources",
									value: "15+"
								},
								{
									label: "Community members",
									value: "10+"
								}
							].map((stat) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
								className: "text-xs uppercase tracking-wide text-muted-foreground",
								children: stat.label
							}), /* @__PURE__ */ jsx("dd", {
								className: "mt-1 font-display text-2xl font-semibold",
								children: stat.value
							})] }, stat.label))
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "animate-rise",
					children: /* @__PURE__ */ jsx(HeroNetwork, {})
				})]
			})]
		}),
		/* @__PURE__ */ jsxs("section", {
			className: "mx-auto w-full max-w-7xl px-4 py-16 sm:px-6",
			children: [/* @__PURE__ */ jsx(SectionHeading, {
				eyebrow: "Featured",
				title: "Events worth clearing your calendar for",
				description: "Hackathons, workshops, tech talks, webinars and meetups from across the community.",
				action: /* @__PURE__ */ jsx(Button, {
					variant: "ghost",
					asChild: true,
					children: /* @__PURE__ */ jsxs(Link, {
						to: "/events",
						children: ["All events ", /* @__PURE__ */ jsx(ArrowRight, { className: "ml-1.5 h-4 w-4" })]
					})
				})
			}), /* @__PURE__ */ jsx("div", {
				className: "mt-8",
				children: eventsQuery.isLoading ? /* @__PURE__ */ jsx(CardGridSkeleton, {}) : eventsQuery.isError ? /* @__PURE__ */ jsx(ErrorState, { onRetry: () => void eventsQuery.refetch() }) : /* @__PURE__ */ jsx("div", {
					className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
					children: eventsQuery.data?.map((event) => /* @__PURE__ */ jsx(EventCard, { event }, event.id))
				})
			})]
		}),
		/* @__PURE__ */ jsxs("section", {
			className: "mx-auto w-full max-w-7xl px-4 py-10 sm:px-6",
			children: [/* @__PURE__ */ jsx(SectionHeading, {
				eyebrow: "Trending",
				title: "Topics moving fastest right now",
				description: "Jump straight into the events, posts and resources tagged with what you care about."
			}), /* @__PURE__ */ jsx("div", {
				className: "mt-8 flex flex-wrap gap-3",
				children: topics.map((topic) => /* @__PURE__ */ jsxs(Link, {
					to: "/explore",
					search: { q: topic.slug },
					className: "card-hover surface-panel inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium",
					children: [/* @__PURE__ */ jsx(TrendingUp, {
						className: "h-4 w-4 text-primary",
						"aria-hidden": "true"
					}), topic.name]
				}, topic.name))
			})]
		}),
		/* @__PURE__ */ jsxs("section", {
			className: "mx-auto w-full max-w-7xl px-4 py-16 sm:px-6",
			children: [/* @__PURE__ */ jsx(SectionHeading, {
				eyebrow: "Community",
				title: "The people behind the ideas",
				description: "Active members, trending discussions and the builders shaping the platform.",
				action: /* @__PURE__ */ jsx(Button, {
					variant: "ghost",
					asChild: true,
					children: /* @__PURE__ */ jsxs(Link, {
						to: "/community",
						children: ["Open the feed ", /* @__PURE__ */ jsx(ArrowRight, { className: "ml-1.5 h-4 w-4" })]
					})
				})
			}), /* @__PURE__ */ jsxs("div", {
				className: "mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]",
				children: [/* @__PURE__ */ jsxs(Card, {
					className: "p-6",
					children: [/* @__PURE__ */ jsxs("h3", {
						className: "flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground",
						children: [/* @__PURE__ */ jsx(Flame, {
							className: "h-4 w-4 text-primary",
							"aria-hidden": "true"
						}), " Trending discussions"]
					}), /* @__PURE__ */ jsxs("ul", {
						className: "mt-4 divide-y divide-border/60",
						children: [postsQuery.data?.map((post) => /* @__PURE__ */ jsx("li", {
							className: "py-4 first:pt-0 last:pb-0",
							children: /* @__PURE__ */ jsxs(Link, {
								to: "/community",
								className: "group block",
								children: [/* @__PURE__ */ jsx("p", {
									className: "line-clamp-2 font-medium transition-colors group-hover:text-primary",
									children: post.title ?? post.content.slice(0, 90)
								}), /* @__PURE__ */ jsxs("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: [
										"@",
										post.profiles?.username,
										" · ",
										post.like_count,
										" likes ·",
										" ",
										post.comment_count,
										" comments · ",
										formatRelative(post.created_at)
									]
								})]
							})
						}, post.id)), !postsQuery.isLoading && !postsQuery.data?.length ? /* @__PURE__ */ jsx("li", {
							className: "py-4 text-sm text-muted-foreground",
							children: "No discussions yet."
						}) : null]
					})]
				}), /* @__PURE__ */ jsxs(Card, {
					className: "p-6",
					children: [/* @__PURE__ */ jsxs("h3", {
						className: "flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground",
						children: [/* @__PURE__ */ jsx(Users, {
							className: "h-4 w-4 text-primary",
							"aria-hidden": "true"
						}), " Active members"]
					}), /* @__PURE__ */ jsx("ul", {
						className: "mt-4 space-y-4",
						children: peopleQuery.data?.map((person) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
							to: "/profile/$username",
							params: { username: person.username },
							className: "group flex items-center gap-3",
							children: [/* @__PURE__ */ jsxs(Avatar, {
								className: "h-10 w-10 border border-border",
								children: [/* @__PURE__ */ jsx(AvatarImage, {
									src: person.avatar_url ?? void 0,
									alt: ""
								}), /* @__PURE__ */ jsx(AvatarFallback, { children: initials(person.full_name) })]
							}), /* @__PURE__ */ jsxs("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ jsx("p", {
									className: "truncate text-sm font-medium transition-colors group-hover:text-primary",
									children: person.full_name
								}), /* @__PURE__ */ jsx("p", {
									className: "truncate text-xs text-muted-foreground",
									children: person.headline ?? `@${person.username}`
								})]
							})]
						}) }, person.id))
					})]
				})]
			})]
		}),
		/* @__PURE__ */ jsx("section", {
			className: "mx-auto w-full max-w-7xl px-4 py-16 sm:px-6",
			children: /* @__PURE__ */ jsx(Card, {
				className: "hero-glow relative overflow-hidden border-primary/25 p-8 sm:p-12",
				children: /* @__PURE__ */ jsxs("div", {
					className: "grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]",
					children: [/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsxs(Badge, {
							variant: "secondary",
							className: "gap-1.5 rounded-full",
							children: [/* @__PURE__ */ jsx(Bot, {
								className: "h-3.5 w-3.5 text-primary",
								"aria-hidden": "true"
							}), " ABTalks AI"]
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "mt-5 text-3xl font-semibold sm:text-4xl",
							children: "Your AI-powered technology companion."
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-4 max-w-xl text-muted-foreground",
							children: "ABTalks AI knows the platform. Ask it anything and it will point you at the right event, the right resource and the right people."
						}),
						/* @__PURE__ */ jsx("ul", {
							className: "mt-6 grid gap-3 sm:grid-cols-2",
							children: [
								"Recommend events that match your interests",
								"Suggest learning resources and a study order",
								"Help you find communities and people to follow",
								"Answer questions about ABTalks and what to learn next"
							].map((item) => /* @__PURE__ */ jsxs("li", {
								className: "flex items-start gap-2 text-sm text-muted-foreground",
								children: [/* @__PURE__ */ jsx(Sparkle, {
									className: "mt-0.5 h-4 w-4 shrink-0 text-primary",
									"aria-hidden": "true"
								}), item]
							}, item))
						}),
						/* @__PURE__ */ jsx(Button, {
							size: "lg",
							className: "mt-8",
							asChild: true,
							children: /* @__PURE__ */ jsxs(Link, {
								to: "/ai",
								children: ["Ask ABTalks AI ", /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })]
							})
						})
					] }), /* @__PURE__ */ jsx(Card, {
						className: "bg-background/60 p-5 backdrop-blur",
						children: /* @__PURE__ */ jsxs("div", {
							className: "space-y-4 text-sm",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex justify-end",
								children: /* @__PURE__ */ jsx("p", {
									className: "max-w-[85%] rounded-2xl bg-primary px-4 py-2.5 text-primary-foreground",
									children: "Find me upcoming AI events."
								})
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-start gap-2",
								children: [/* @__PURE__ */ jsx(Bot, {
									className: "mt-1 h-4 w-4 shrink-0 text-primary",
									"aria-hidden": "true"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-muted-foreground",
									children: "The Build With AI Hackathon runs next week in Hyderabad, and the Data Science webinar covers taking models to production. Want me to compare them?"
								})]
							})]
						})
					})]
				})
			})
		}),
		/* @__PURE__ */ jsxs("section", {
			className: "mx-auto w-full max-w-5xl px-4 py-20 text-center sm:px-6",
			children: [
				/* @__PURE__ */ jsx(MessageSquare, {
					className: "mx-auto h-8 w-8 text-primary",
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "mt-6 text-3xl font-semibold sm:text-4xl",
					children: "Your next opportunity could start here."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-8 flex flex-wrap justify-center gap-3",
					children: [/* @__PURE__ */ jsx(Button, {
						size: "lg",
						asChild: true,
						children: /* @__PURE__ */ jsxs(Link, {
							to: "/community",
							children: [/* @__PURE__ */ jsx(Compass, { className: "mr-2 h-4 w-4" }), " Explore Community"]
						})
					}), /* @__PURE__ */ jsx(Button, {
						size: "lg",
						variant: "outline",
						asChild: true,
						children: /* @__PURE__ */ jsx(Link, {
							to: "/auth",
							search: { mode: "signup" },
							children: "Create Account"
						})
					})]
				})
			]
		})
	] });
}
//#endregion
export { Home as component };

//# sourceMappingURL=routes-CvGb1f8k.js.map