import { t as supabase } from "./client-CoEqkHDN.js";
import { s as fetchPosts, t as fetchComments } from "./api-CfgFj8iz.js";
import { _ as Button, d as initials, g as AvatarImage, h as AvatarFallback, l as formatRelative, m as Avatar, p as Badge, v as useAuth } from "./router-DrXqpvlG.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { a as SectionHeading, i as ListSkeleton, n as EmptyState, r as ErrorState } from "./States-BH6FfLCK.js";
import { t as Textarea } from "./textarea-kko37XEX.js";
import { t as Input } from "./input-B8Q2ztVi.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.js";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, MessageCircle, MessagesSquare, Send } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/community.tsx?tsr-split=component
var postTypes = [
	"all",
	"discussion",
	"question",
	"project",
	"achievement",
	"learning"
];
function CommunityPage() {
	const [type, setType] = useState("all");
	const [sort, setSort] = useState("latest");
	const { user, profile } = useAuth();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const postsQuery = useQuery({
		queryKey: ["posts", {
			type,
			sort
		}],
		queryFn: () => fetchPosts({
			type,
			sort
		})
	});
	const likedQuery = useQuery({
		queryKey: ["likes", user?.id],
		enabled: Boolean(user?.id),
		queryFn: async () => {
			const { data, error } = await supabase.from("likes").select("post_id").eq("user_id", user.id);
			if (error) throw error;
			return (data ?? []).map((row) => row.post_id);
		}
	});
	const createPost = useMutation({
		mutationFn: async ({ content, postType, tags }) => {
			if (!user) throw new Error("Sign in to post.");
			const { error } = await supabase.from("posts").insert({
				author_id: user.id,
				content,
				post_type: postType,
				tags
			});
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			toast.success("Posted to the community");
		},
		onError: (error) => toast.error(error.message)
	});
	const toggleLike = useMutation({
		mutationFn: async (post) => {
			if (!user) throw new Error("Sign in to like posts.");
			if (likedQuery.data?.includes(post.id)) {
				const { error } = await supabase.from("likes").delete().eq("post_id", post.id).eq("user_id", user.id);
				if (error) throw error;
			} else {
				const { error } = await supabase.from("likes").insert({
					post_id: post.id,
					user_id: user.id
				});
				if (error) throw error;
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["likes", user?.id] });
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
		onError: (error) => toast.error(error.message)
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-4xl px-4 py-14 sm:px-6",
		children: [
			/* @__PURE__ */ jsx(SectionHeading, {
				eyebrow: "Community",
				title: "Build in public with people who get it",
				description: "Questions, project launches, wins and lessons learned from the ABTalks network."
			}),
			user ? /* @__PURE__ */ jsx(Card, {
				className: "mt-8 p-5",
				children: /* @__PURE__ */ jsxs("form", {
					onSubmit: (event) => {
						event.preventDefault();
						const form = new FormData(event.currentTarget);
						const content = String(form.get("content") ?? "").trim();
						if (content.length < 5) {
							toast.error("Write a little more before posting.");
							return;
						}
						if (content.length > 2e3) {
							toast.error("Posts are limited to 2000 characters.");
							return;
						}
						const tags = String(form.get("tags") ?? "").split(",").map((tag) => tag.trim()).filter(Boolean).slice(0, 5);
						createPost.mutate({
							content,
							postType: String(form.get("post_type") ?? "discussion"),
							tags
						});
						event.currentTarget.reset();
					},
					className: "space-y-3",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ jsxs(Avatar, {
							className: "h-10 w-10",
							children: [/* @__PURE__ */ jsx(AvatarImage, {
								src: profile?.avatar_url ?? void 0,
								alt: ""
							}), /* @__PURE__ */ jsx(AvatarFallback, { children: initials(profile?.full_name ?? "You") })]
						}), /* @__PURE__ */ jsx(Textarea, {
							name: "content",
							rows: 3,
							maxLength: 2e3,
							placeholder: "Share a win, ask a question, or drop a project link…",
							"aria-label": "Write a post"
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center justify-end gap-3",
						children: [
							/* @__PURE__ */ jsx(Input, {
								name: "tags",
								placeholder: "Tags, comma separated",
								"aria-label": "Post tags",
								className: "w-full sm:w-56"
							}),
							/* @__PURE__ */ jsxs(Select, {
								name: "post_type",
								defaultValue: "discussion",
								children: [/* @__PURE__ */ jsx(SelectTrigger, {
									className: "w-40",
									"aria-label": "Post type",
									children: /* @__PURE__ */ jsx(SelectValue, {})
								}), /* @__PURE__ */ jsx(SelectContent, { children: postTypes.filter((value) => value !== "all").map((value) => /* @__PURE__ */ jsx(SelectItem, {
									value,
									children: value
								}, value)) })]
							}),
							/* @__PURE__ */ jsxs(Button, {
								type: "submit",
								disabled: createPost.isPending,
								children: [/* @__PURE__ */ jsx(Send, { className: "mr-2 h-4 w-4" }), " Post"]
							})
						]
					})]
				})
			}) : /* @__PURE__ */ jsxs(Card, {
				className: "mt-8 flex flex-wrap items-center justify-between gap-3 p-5",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-sm text-muted-foreground",
					children: "Join ABTalks to post, comment and follow other builders."
				}), /* @__PURE__ */ jsx(Button, {
					onClick: () => void navigate({
						to: "/auth",
						search: { mode: "signup" }
					}),
					children: "Create account"
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-8 flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ jsxs(Select, {
					value: type,
					onValueChange: setType,
					children: [/* @__PURE__ */ jsx(SelectTrigger, {
						className: "w-44",
						"aria-label": "Filter posts",
						children: /* @__PURE__ */ jsx(SelectValue, {})
					}), /* @__PURE__ */ jsx(SelectContent, { children: postTypes.map((value) => /* @__PURE__ */ jsx(SelectItem, {
						value,
						children: value === "all" ? "All posts" : value
					}, value)) })]
				}), /* @__PURE__ */ jsxs(Select, {
					value: sort,
					onValueChange: (value) => setSort(value),
					children: [/* @__PURE__ */ jsx(SelectTrigger, {
						className: "w-40",
						"aria-label": "Sort posts",
						children: /* @__PURE__ */ jsx(SelectValue, {})
					}), /* @__PURE__ */ jsxs(SelectContent, { children: [/* @__PURE__ */ jsx(SelectItem, {
						value: "latest",
						children: "Latest"
					}), /* @__PURE__ */ jsx(SelectItem, {
						value: "popular",
						children: "Most liked"
					})] })]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-6 space-y-5",
				children: postsQuery.isLoading ? /* @__PURE__ */ jsx(ListSkeleton, {}) : postsQuery.isError ? /* @__PURE__ */ jsx(ErrorState, { onRetry: () => void postsQuery.refetch() }) : postsQuery.data?.length ? postsQuery.data.map((post) => /* @__PURE__ */ jsx(PostCard, {
					post,
					liked: Boolean(likedQuery.data?.includes(post.id)),
					onLike: () => toggleLike.mutate(post)
				}, post.id)) : /* @__PURE__ */ jsx(EmptyState, {
					icon: /* @__PURE__ */ jsx(MessagesSquare, { className: "h-8 w-8" }),
					title: "No posts yet",
					description: "Be the first to start a conversation."
				})
			})
		]
	});
}
function PostCard({ post, liked, onLike }) {
	const [showComments, setShowComments] = useState(false);
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const commentsQuery = useQuery({
		queryKey: ["comments", post.id],
		enabled: showComments,
		queryFn: () => fetchComments(post.id)
	});
	const addComment = useMutation({
		mutationFn: async (content) => {
			if (!user) throw new Error("Sign in to comment.");
			const { error } = await supabase.from("comments").insert({
				post_id: post.id,
				author_id: user.id,
				content
			});
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["comments", post.id] });
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
		onError: (error) => toast.error(error.message)
	});
	const author = post.profiles;
	return /* @__PURE__ */ jsx(Card, {
		className: "p-5",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex items-start gap-3",
			children: [/* @__PURE__ */ jsxs(Avatar, {
				className: "h-10 w-10",
				children: [/* @__PURE__ */ jsx(AvatarImage, {
					src: author?.avatar_url ?? void 0,
					alt: ""
				}), /* @__PURE__ */ jsx(AvatarFallback, { children: initials(author?.full_name ?? "AB") })]
			}), /* @__PURE__ */ jsxs("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center gap-2 text-sm",
						children: [
							author ? /* @__PURE__ */ jsx(Link, {
								to: "/profile/$username",
								params: { username: author.username },
								className: "font-medium hover:text-primary",
								children: author.full_name
							}) : /* @__PURE__ */ jsx("span", {
								className: "font-medium",
								children: "Community member"
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "text-muted-foreground",
								children: ["· ", formatRelative(post.created_at)]
							}),
							/* @__PURE__ */ jsx(Badge, {
								variant: "outline",
								className: "capitalize",
								children: post.post_type
							})
						]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-3 whitespace-pre-line text-[15px] leading-7 text-foreground/90",
						children: post.content
					}),
					post.tags.length ? /* @__PURE__ */ jsx("div", {
						className: "mt-3 flex flex-wrap gap-1.5",
						children: post.tags.map((tag) => /* @__PURE__ */ jsxs(Badge, {
							variant: "secondary",
							children: ["#", tag]
						}, tag))
					}) : null,
					/* @__PURE__ */ jsxs("div", {
						className: "mt-4 flex items-center gap-4 border-t border-border/60 pt-3 text-sm",
						children: [/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: onLike,
							"aria-pressed": liked,
							className: "inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary",
							children: [/* @__PURE__ */ jsx(Heart, { className: liked ? "h-4 w-4 fill-primary text-primary" : "h-4 w-4" }), post.like_count]
						}), /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => setShowComments((value) => !value),
							className: "inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary",
							children: [/* @__PURE__ */ jsx(MessageCircle, { className: "h-4 w-4" }), post.comment_count]
						})]
					}),
					showComments ? /* @__PURE__ */ jsxs("div", {
						className: "mt-4 space-y-3 border-t border-border/60 pt-4",
						children: [commentsQuery.data?.map((comment) => /* @__PURE__ */ jsxs("div", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ jsxs(Avatar, {
								className: "h-8 w-8",
								children: [/* @__PURE__ */ jsx(AvatarImage, {
									src: comment.profiles?.avatar_url ?? void 0,
									alt: ""
								}), /* @__PURE__ */ jsx(AvatarFallback, { children: initials(comment.profiles?.full_name ?? "AB") })]
							}), /* @__PURE__ */ jsxs("div", {
								className: "rounded-lg bg-secondary/50 px-3 py-2",
								children: [/* @__PURE__ */ jsxs("p", {
									className: "text-xs text-muted-foreground",
									children: [
										comment.profiles?.full_name,
										" · ",
										formatRelative(comment.created_at)
									]
								}), /* @__PURE__ */ jsx("p", {
									className: "mt-1 text-sm",
									children: comment.content
								})]
							})]
						}, comment.id)), user ? /* @__PURE__ */ jsxs("form", {
							className: "flex gap-2",
							onSubmit: (event) => {
								event.preventDefault();
								const input = event.currentTarget.elements.namedItem("comment");
								const value = input.value.trim();
								if (!value) return;
								if (value.length > 500) {
									toast.error("Comments are limited to 500 characters.");
									return;
								}
								addComment.mutate(value);
								input.value = "";
							},
							children: [/* @__PURE__ */ jsx(Input, {
								name: "comment",
								placeholder: "Add a comment",
								"aria-label": "Add a comment"
							}), /* @__PURE__ */ jsx(Button, {
								type: "submit",
								size: "sm",
								disabled: addComment.isPending,
								children: "Reply"
							})]
						}) : null]
					}) : null
				]
			})]
		})
	});
}
//#endregion
export { CommunityPage as component };

//# sourceMappingURL=community-ANKUkVpI.js.map