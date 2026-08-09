import { t as supabase } from "./client-DJ-fbq50.js";
import { n as fetchEventBySlug } from "./api-C3XzEiEJ.js";
import { _ as Button, c as formatEventTime, d as initials, f as isPastDate, g as AvatarImage, h as AvatarFallback, i as Route, m as Avatar, p as Badge, s as formatEventDate, v as useAuth } from "./router-DM-zNBLU.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Skeleton } from "./skeleton-D9W9wFsj.js";
import { t as useBookmarks } from "./useBookmarks-CFAgYCO3.js";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Bookmark, BookmarkCheck, CalendarDays, Clock, MapPin, Users, Video } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/events/$slug.tsx?tsr-split=component
function EventDetail() {
	const { slug } = Route.useParams();
	const { user } = useAuth();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { isSaved, toggle } = useBookmarks();
	const eventQuery = useQuery({
		queryKey: ["event", slug],
		queryFn: () => fetchEventBySlug(slug)
	});
	const event = eventQuery.data;
	const registrationQuery = useQuery({
		queryKey: [
			"registration",
			event?.id,
			user?.id
		],
		enabled: Boolean(event?.id && user?.id),
		queryFn: async () => {
			const { data, error } = await supabase.from("event_registrations").select("id").eq("event_id", event.id).eq("user_id", user.id).maybeSingle();
			if (error) throw error;
			return data;
		}
	});
	const register = useMutation({
		mutationFn: async () => {
			if (!user || !event) throw new Error("Sign in to register for this event.");
			if (registrationQuery.data) {
				const { error } = await supabase.from("event_registrations").delete().eq("id", registrationQuery.data.id);
				if (error) throw error;
				return "cancelled";
			}
			const { error } = await supabase.from("event_registrations").insert({
				event_id: event.id,
				user_id: user.id
			});
			if (error) throw error;
			await supabase.from("notifications").insert({
				user_id: user.id,
				type: "event",
				title: `You're registered for ${event.title}`,
				body: `${formatEventDate(event.starts_at)} · ${formatEventTime(event.starts_at)}`,
				link: `/events/${event.slug}`
			});
			return "registered";
		},
		onSuccess: (result) => {
			queryClient.invalidateQueries({ queryKey: ["registration"] });
			queryClient.invalidateQueries({ queryKey: ["event", slug] });
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
			toast.success(result === "registered" ? "You're in! See you there." : "Registration cancelled");
		},
		onError: (error) => toast.error(error.message)
	});
	if (eventQuery.isLoading) return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-5xl space-y-6 px-4 py-14",
		children: [
			/* @__PURE__ */ jsx(Skeleton, { className: "aspect-[21/9] w-full rounded-xl" }),
			/* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-2/3" }),
			/* @__PURE__ */ jsx(Skeleton, { className: "h-24 w-full" })
		]
	});
	if (!event) return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-3xl px-4 py-20 text-center",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "text-2xl font-semibold",
				children: "Event not found"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-2 text-muted-foreground",
				children: "This event may have been removed."
			}),
			/* @__PURE__ */ jsx(Button, {
				asChild: true,
				className: "mt-6",
				children: /* @__PURE__ */ jsx(Link, {
					to: "/events",
					children: "Browse all events"
				})
			})
		]
	});
	const isRegistered = Boolean(registrationQuery.data);
	const spotsLeft = Math.max(0, event.capacity - event.participant_count);
	const past = isPastDate(event.starts_at);
	return /* @__PURE__ */ jsxs("article", {
		className: "mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8",
		children: [
			/* @__PURE__ */ jsxs(Link, {
				to: "/events",
				className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }), " All events"]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-6 overflow-hidden rounded-2xl border border-border/70",
				children: event.banner_url ? /* @__PURE__ */ jsx("img", {
					src: event.banner_url,
					alt: `Banner for ${event.title}`,
					className: "aspect-[21/9] w-full object-cover"
				}) : null
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ jsx(Badge, {
								variant: "secondary",
								children: event.event_type
							}),
							/* @__PURE__ */ jsx(Badge, {
								variant: "outline",
								children: event.category
							}),
							past ? /* @__PURE__ */ jsx(Badge, {
								variant: "outline",
								children: "Past event"
							}) : null
						]
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "mt-4 font-display text-3xl font-semibold sm:text-4xl",
						children: event.title
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-3 text-lg text-muted-foreground",
						children: event.summary
					}),
					/* @__PURE__ */ jsx("div", {
						className: "prose-invert mt-8 max-w-none whitespace-pre-line text-[15px] leading-7 text-foreground/90",
						children: event.description
					}),
					event.agenda?.length ? /* @__PURE__ */ jsxs("section", {
						className: "mt-10",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-xl font-semibold",
							children: "Agenda"
						}), /* @__PURE__ */ jsx("ol", {
							className: "mt-4 space-y-3",
							children: event.agenda.map((item) => /* @__PURE__ */ jsxs("li", {
								className: "flex gap-4 rounded-lg border border-border/60 bg-card/60 p-4",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center gap-2 text-sm font-medium text-primary",
									children: [/* @__PURE__ */ jsx(Clock, {
										className: "h-4 w-4",
										"aria-hidden": "true"
									}), item.time]
								}), /* @__PURE__ */ jsx("span", {
									className: "text-sm text-foreground/90",
									children: item.title
								})]
							}, `${item.time}-${item.title}`))
						})]
					}) : null,
					event.event_speakers?.length ? /* @__PURE__ */ jsxs("section", {
						className: "mt-10",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-xl font-semibold",
							children: "Speakers"
						}), /* @__PURE__ */ jsx("div", {
							className: "mt-4 grid gap-4 sm:grid-cols-2",
							children: event.event_speakers.map((speaker) => /* @__PURE__ */ jsxs(Card, {
								className: "flex items-center gap-3 p-4",
								children: [/* @__PURE__ */ jsxs(Avatar, { children: [/* @__PURE__ */ jsx(AvatarImage, {
									src: speaker.avatar_url ?? void 0,
									alt: ""
								}), /* @__PURE__ */ jsx(AvatarFallback, { children: initials(speaker.name) })] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
									className: "font-medium",
									children: speaker.name
								}), /* @__PURE__ */ jsx("p", {
									className: "text-sm text-muted-foreground",
									children: speaker.title
								})] })]
							}, speaker.id))
						})]
					}) : null,
					event.requirements?.length ? /* @__PURE__ */ jsxs("section", {
						className: "mt-10",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-xl font-semibold",
							children: "What to bring"
						}), /* @__PURE__ */ jsx("ul", {
							className: "mt-4 list-inside list-disc space-y-2 text-sm text-muted-foreground",
							children: event.requirements.map((requirement) => /* @__PURE__ */ jsx("li", { children: requirement }, requirement))
						})]
					}) : null
				] }), /* @__PURE__ */ jsx("aside", {
					className: "lg:sticky lg:top-24 lg:self-start",
					children: /* @__PURE__ */ jsxs(Card, {
						className: "space-y-4 p-6",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-3 text-sm",
								children: [
									/* @__PURE__ */ jsxs("p", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ jsx(CalendarDays, {
											className: "h-4 w-4 text-primary",
											"aria-hidden": "true"
										}), formatEventDate(event.starts_at)]
									}),
									/* @__PURE__ */ jsxs("p", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ jsx(Clock, {
												className: "h-4 w-4 text-primary",
												"aria-hidden": "true"
											}),
											formatEventTime(event.starts_at),
											" – ",
											formatEventTime(event.ends_at)
										]
									}),
									/* @__PURE__ */ jsxs("p", {
										className: "flex items-center gap-2",
										children: [event.is_online ? /* @__PURE__ */ jsx(Video, {
											className: "h-4 w-4 text-primary",
											"aria-hidden": "true"
										}) : /* @__PURE__ */ jsx(MapPin, {
											className: "h-4 w-4 text-primary",
											"aria-hidden": "true"
										}), event.location]
									}),
									/* @__PURE__ */ jsxs("p", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ jsx(Users, {
												className: "h-4 w-4 text-primary",
												"aria-hidden": "true"
											}),
											event.participant_count,
											" registered · ",
											spotsLeft,
											" spots left"
										]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-2 border-t border-border/60 pt-4",
								children: [user ? /* @__PURE__ */ jsx(Button, {
									className: "w-full",
									variant: isRegistered ? "secondary" : "default",
									onClick: () => register.mutate(),
									disabled: register.isPending || !isRegistered && spotsLeft === 0,
									children: isRegistered ? "Cancel registration" : spotsLeft === 0 ? "Event full" : "Register now"
								}) : /* @__PURE__ */ jsx(Button, {
									className: "w-full",
									onClick: () => void navigate({
										to: "/auth",
										search: { mode: "signup" }
									}),
									children: "Sign in to register"
								}), /* @__PURE__ */ jsxs(Button, {
									variant: "outline",
									className: "w-full",
									onClick: () => user ? toggle("event", event.id) : void navigate({
										to: "/auth",
										search: { mode: "login" }
									}),
									children: [isSaved("event", event.id) ? /* @__PURE__ */ jsx(BookmarkCheck, { className: "mr-2 h-4 w-4" }) : /* @__PURE__ */ jsx(Bookmark, { className: "mr-2 h-4 w-4" }), isSaved("event", event.id) ? "Saved" : "Save event"]
								})]
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "text-xs text-muted-foreground",
								children: ["Organised by ", event.organizer]
							})
						]
					})
				})]
			})
		]
	});
}
//#endregion
export { EventDetail as component };
