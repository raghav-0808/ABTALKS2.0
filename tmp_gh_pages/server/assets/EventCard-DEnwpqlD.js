import { c as formatEventTime, p as Badge, s as formatEventDate } from "./router-DJAHCQz5.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { CalendarDays, MapPin, Users, Video } from "lucide-react";
//#region src/components/events/EventCard.tsx
var typeLabels = {
	hackathon: "Hackathon",
	workshop: "Workshop",
	talk: "Tech talk",
	webinar: "Webinar",
	meetup: "Meetup"
};
function EventCard({ event }) {
	return /* @__PURE__ */ jsx(Card, {
		className: "card-hover group overflow-hidden border-border/70 bg-card p-0",
		children: /* @__PURE__ */ jsxs(Link, {
			to: "/events/$slug",
			params: { slug: event.slug },
			className: "block focus-visible:outline-none",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "relative aspect-[16/9] overflow-hidden bg-muted",
				children: [event.banner_url ? /* @__PURE__ */ jsx("img", {
					src: event.banner_url,
					alt: `Banner for ${event.title}`,
					loading: "lazy",
					className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
				}) : null, /* @__PURE__ */ jsx("div", {
					className: "absolute left-3 top-3 flex gap-2",
					children: /* @__PURE__ */ jsx(Badge, {
						className: "bg-background/85 text-foreground backdrop-blur",
						children: typeLabels[event.event_type] ?? event.event_type
					})
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "space-y-3 p-5",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ jsx(CalendarDays, {
							className: "h-3.5 w-3.5",
							"aria-hidden": "true"
						}), /* @__PURE__ */ jsxs("span", { children: [
							formatEventDate(event.starts_at),
							" · ",
							formatEventTime(event.starts_at)
						] })]
					}),
					/* @__PURE__ */ jsx("h3", {
						className: "line-clamp-2 text-lg font-semibold leading-snug",
						children: event.title
					}),
					/* @__PURE__ */ jsx("p", {
						className: "line-clamp-2 text-sm text-muted-foreground",
						children: event.summary
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "inline-flex items-center gap-1.5",
							children: [event.is_online ? /* @__PURE__ */ jsx(Video, {
								className: "h-3.5 w-3.5",
								"aria-hidden": "true"
							}) : /* @__PURE__ */ jsx(MapPin, {
								className: "h-3.5 w-3.5",
								"aria-hidden": "true"
							}), event.is_online ? "Online" : event.location]
						}), /* @__PURE__ */ jsxs("span", {
							className: "inline-flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ jsx(Users, {
									className: "h-3.5 w-3.5",
									"aria-hidden": "true"
								}),
								event.participant_count,
								" joined"
							]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between border-t border-border/60 pt-3",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs text-muted-foreground",
							children: event.organizer
						}), /* @__PURE__ */ jsx("span", {
							className: "text-sm font-medium text-primary transition-transform group-hover:translate-x-0.5",
							children: "View details →"
						})]
					})
				]
			})]
		})
	});
}
//#endregion
export { EventCard as t };
