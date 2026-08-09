import { t as supabase } from "./client-CoEqkHDN.js";
import { c as fetchProfileByUsername, i as fetchFollowCounts, s as fetchPosts } from "./api-CfgFj8iz.js";
import { _ as Button, d as initials, g as AvatarImage, h as AvatarFallback, l as formatRelative, m as Avatar, p as Badge, r as Route, v as useAuth } from "./router-DrXqpvlG.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Skeleton } from "./skeleton-D9W9wFsj.js";
import { i as ListSkeleton, n as EmptyState } from "./States-BH6FfLCK.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Github, Globe, MapPin } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/profile/$username.tsx?tsr-split=component
function ProfilePage() {
	const { username } = Route.useParams();
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const profileQuery = useQuery({
		queryKey: ["profile", username],
		queryFn: () => fetchProfileByUsername(username)
	});
	const profile = profileQuery.data;
	const postsQuery = useQuery({
		queryKey: ["profile-posts", profile?.id],
		enabled: Boolean(profile?.id),
		queryFn: () => fetchPosts({ authorId: profile.id })
	});
	const countsQuery = useQuery({
		queryKey: ["follow-counts", profile?.id],
		enabled: Boolean(profile?.id),
		queryFn: () => fetchFollowCounts(profile.id)
	});
	const followingQuery = useQuery({
		queryKey: [
			"is-following",
			profile?.id,
			user?.id
		],
		enabled: Boolean(profile?.id && user?.id),
		queryFn: async () => {
			const { data, error } = await supabase.from("follows").select("follower_id, following_id").eq("follower_id", user.id).eq("following_id", profile.id).maybeSingle();
			if (error) throw error;
			return data;
		}
	});
	const toggleFollow = useMutation({
		mutationFn: async () => {
			if (!user || !profile) throw new Error("Sign in to follow members.");
			if (followingQuery.data) {
				const { error } = await supabase.from("follows").delete().eq("follower_id", user.id).eq("following_id", profile.id);
				if (error) throw error;
				return "unfollowed";
			}
			const { error } = await supabase.from("follows").insert({
				follower_id: user.id,
				following_id: profile.id
			});
			if (error) throw error;
			await supabase.from("notifications").insert({
				user_id: profile.id,
				type: "follow",
				title: "You have a new follower",
				body: "Someone from the community started following you.",
				link: `/profile/${profile.username}`
			});
			return "followed";
		},
		onSuccess: (result) => {
			queryClient.invalidateQueries({ queryKey: ["is-following"] });
			queryClient.invalidateQueries({ queryKey: ["follow-counts"] });
			toast.success(result === "followed" ? "Following" : "Unfollowed");
		},
		onError: (error) => toast.error(error.message)
	});
	if (profileQuery.isLoading) return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-4xl space-y-6 px-4 py-14",
		children: [/* @__PURE__ */ jsx(Skeleton, { className: "h-32 w-full rounded-xl" }), /* @__PURE__ */ jsx(ListSkeleton, { count: 3 })]
	});
	if (!profile) return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-3xl px-4 py-20 text-center",
		children: [/* @__PURE__ */ jsx("h1", {
			className: "text-2xl font-semibold",
			children: "Member not found"
		}), /* @__PURE__ */ jsx(Button, {
			asChild: true,
			className: "mt-6",
			children: /* @__PURE__ */ jsx(Link, {
				to: "/explore",
				children: "Explore the community"
			})
		})]
	});
	const isSelf = user?.id === profile.id;
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-4xl px-4 py-14 sm:px-6",
		children: [
			/* @__PURE__ */ jsxs(Card, {
				className: "p-6 sm:p-8",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-start gap-5",
						children: [
							/* @__PURE__ */ jsxs(Avatar, {
								className: "h-20 w-20",
								children: [/* @__PURE__ */ jsx(AvatarImage, {
									src: profile.avatar_url ?? void 0,
									alt: ""
								}), /* @__PURE__ */ jsx(AvatarFallback, {
									className: "text-lg",
									children: initials(profile.full_name)
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ jsx("h1", {
										className: "font-display text-2xl font-semibold",
										children: profile.full_name
									}),
									/* @__PURE__ */ jsxs("p", {
										className: "text-muted-foreground",
										children: ["@", profile.username]
									}),
									profile.headline ? /* @__PURE__ */ jsx("p", {
										className: "mt-2 text-sm",
										children: profile.headline
									}) : null,
									/* @__PURE__ */ jsxs("div", {
										className: "mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground",
										children: [
											profile.location ? /* @__PURE__ */ jsxs("span", {
												className: "inline-flex items-center gap-1.5",
												children: [/* @__PURE__ */ jsx(MapPin, {
													className: "h-4 w-4",
													"aria-hidden": "true"
												}), profile.location]
											}) : null,
											profile.github_url ? /* @__PURE__ */ jsxs("a", {
												href: profile.github_url,
												target: "_blank",
												rel: "noreferrer noopener",
												className: "inline-flex items-center gap-1.5 hover:text-primary",
												children: [/* @__PURE__ */ jsx(Github, {
													className: "h-4 w-4",
													"aria-hidden": "true"
												}), " GitHub"]
											}) : null,
											profile.website_url ? /* @__PURE__ */ jsxs("a", {
												href: profile.website_url,
												target: "_blank",
												rel: "noreferrer noopener",
												className: "inline-flex items-center gap-1.5 hover:text-primary",
												children: [/* @__PURE__ */ jsx(Globe, {
													className: "h-4 w-4",
													"aria-hidden": "true"
												}), " Website"]
											}) : null
										]
									})
								]
							}),
							!isSelf && user ? /* @__PURE__ */ jsx(Button, {
								variant: followingQuery.data ? "secondary" : "default",
								onClick: () => toggleFollow.mutate(),
								disabled: toggleFollow.isPending,
								children: followingQuery.data ? "Following" : "Follow"
							}) : null
						]
					}),
					profile.bio ? /* @__PURE__ */ jsx("p", {
						className: "mt-6 text-[15px] leading-7",
						children: profile.bio
					}) : null,
					profile.skills.length ? /* @__PURE__ */ jsx("div", {
						className: "mt-5 flex flex-wrap gap-1.5",
						children: profile.skills.map((skill) => /* @__PURE__ */ jsx(Badge, {
							variant: "secondary",
							children: skill
						}, skill))
					}) : null,
					/* @__PURE__ */ jsxs("div", {
						className: "mt-6 flex gap-6 border-t border-border/60 pt-4 text-sm",
						children: [
							/* @__PURE__ */ jsxs("span", { children: [
								/* @__PURE__ */ jsx("strong", { children: countsQuery.data?.followers ?? 0 }),
								" ",
								/* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground",
									children: "followers"
								})
							] }),
							/* @__PURE__ */ jsxs("span", { children: [
								/* @__PURE__ */ jsx("strong", { children: countsQuery.data?.following ?? 0 }),
								" ",
								/* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground",
									children: "following"
								})
							] }),
							/* @__PURE__ */ jsxs("span", { children: [
								/* @__PURE__ */ jsx("strong", { children: postsQuery.data?.length ?? 0 }),
								" ",
								/* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground",
									children: "posts"
								})
							] })
						]
					})
				]
			}),
			/* @__PURE__ */ jsx("h2", {
				className: "mt-10 text-xl font-semibold",
				children: "Recent activity"
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-4 space-y-4",
				children: postsQuery.isLoading ? /* @__PURE__ */ jsx(ListSkeleton, { count: 2 }) : postsQuery.data?.length ? postsQuery.data.map((post) => /* @__PURE__ */ jsxs(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ jsxs("p", {
						className: "text-xs text-muted-foreground",
						children: [
							post.post_type,
							" · ",
							formatRelative(post.created_at)
						]
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-2 whitespace-pre-line text-[15px] leading-7",
						children: post.content
					})]
				}, post.id)) : /* @__PURE__ */ jsx(EmptyState, {
					title: "No posts yet",
					description: "This member hasn't posted anything."
				})
			})
		]
	});
}
//#endregion
export { ProfilePage as component };

//# sourceMappingURL=_username-B2VBbwNy.js.map