import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Heart, MessageCircle, MessagesSquare, Send } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState, ErrorState, ListSkeleton, SectionHeading } from "@/components/common/States";
import { fetchComments, fetchPosts } from "@/lib/api";
import { formatRelative, initials } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Post } from "@/lib/types";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community feed | ABTalks" },
      {
        name: "description",
        content:
          "Share projects, ask questions and celebrate wins with students, developers and founders in the ABTalks community.",
      },
      { property: "og:title", content: "Community feed | ABTalks" },
      { property: "og:description", content: "Share projects and ask questions on ABTalks." },
    ],
  }),
  component: CommunityPage,
});

const postTypes = ["all", "discussion", "question", "project", "achievement", "learning"];

function CommunityPage() {
  const [type, setType] = useState("all");
  const [sort, setSort] = useState<"latest" | "popular">("latest");
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const postsQuery = useQuery({
    queryKey: ["posts", { type, sort }],
    queryFn: () => fetchPosts({ type, sort }),
  });

  const likedQuery = useQuery({
    queryKey: ["likes", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase.from("likes").select("post_id").eq("user_id", user!.id);
      if (error) throw error;
      return (data ?? []).map((row) => row.post_id as string);
    },
  });

  const createPost = useMutation({
    mutationFn: async ({
      content,
      postType,
      tags,
    }: {
      content: string;
      postType: string;
      tags: string[];
    }) => {
      if (!user) throw new Error("Sign in to post.");
      const { error } = await supabase
        .from("posts")
        .insert({ author_id: user.id, content, post_type: postType, tags });
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Posted to the community");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const toggleLike = useMutation({
    mutationFn: async (post: Post) => {
      if (!user) throw new Error("Sign in to like posts.");
      const liked = likedQuery.data?.includes(post.id);
      if (liked) {
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("post_id", post.id)
          .eq("user_id", user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("likes")
          .insert({ post_id: post.id, user_id: user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["likes", user?.id] });
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <SectionHeading
        eyebrow="Community"
        title="Build in public with people who get it"
        description="Questions, project launches, wins and lessons learned from the ABTalks network."
      />

      {user ? (
        <Card className="mt-8 p-5">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              const content = String(form.get("content") ?? "").trim();
              if (content.length < 5) {
                toast.error("Write a little more before posting.");
                return;
              }
              if (content.length > 2000) {
                toast.error("Posts are limited to 2000 characters.");
                return;
              }
              const tags = String(form.get("tags") ?? "")
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean)
                .slice(0, 5);
              createPost.mutate({
                content,
                postType: String(form.get("post_type") ?? "discussion"),
                tags,
              });
              event.currentTarget.reset();
            }}
            className="space-y-3"
          >
            <div className="flex gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={profile?.avatar_url ?? undefined} alt="" />
                <AvatarFallback>{initials(profile?.full_name ?? "You")}</AvatarFallback>
              </Avatar>
              <Textarea
                name="content"
                rows={3}
                maxLength={2000}
                placeholder="Share a win, ask a question, or drop a project link…"
                aria-label="Write a post"
              />
            </div>
            <div className="flex flex-wrap items-center justify-end gap-3">
              <Input
                name="tags"
                placeholder="Tags, comma separated"
                aria-label="Post tags"
                className="w-full sm:w-56"
              />
              <Select name="post_type" defaultValue="discussion">
                <SelectTrigger className="w-40" aria-label="Post type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {postTypes
                    .filter((value) => value !== "all")
                    .map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button type="submit" disabled={createPost.isPending}>
                <Send className="mr-2 h-4 w-4" /> Post
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <Card className="mt-8 flex flex-wrap items-center justify-between gap-3 p-5">
          <p className="text-sm text-muted-foreground">
            Join ABTalks to post, comment and follow other builders.
          </p>
          <Button onClick={() => void navigate({ to: "/auth", search: { mode: "signup" } })}>
            Create account
          </Button>
        </Card>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-44" aria-label="Filter posts">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {postTypes.map((value) => (
              <SelectItem key={value} value={value}>
                {value === "all" ? "All posts" : value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(value) => setSort(value as typeof sort)}>
          <SelectTrigger className="w-40" aria-label="Sort posts">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="popular">Most liked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 space-y-5">
        {postsQuery.isLoading ? (
          <ListSkeleton />
        ) : postsQuery.isError ? (
          <ErrorState onRetry={() => void postsQuery.refetch()} />
        ) : postsQuery.data?.length ? (
          postsQuery.data.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              liked={Boolean(likedQuery.data?.includes(post.id))}
              onLike={() => toggleLike.mutate(post)}
            />
          ))
        ) : (
          <EmptyState
            icon={<MessagesSquare className="h-8 w-8" />}
            title="No posts yet"
            description="Be the first to start a conversation."
          />
        )}
      </div>
    </div>
  );
}

function PostCard({
  post,
  liked,
  onLike,
}: {
  post: Post;
  liked: boolean;
  onLike: () => void;
}) {
  const [showComments, setShowComments] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const commentsQuery = useQuery({
    queryKey: ["comments", post.id],
    enabled: showComments,
    queryFn: () => fetchComments(post.id),
  });

  const addComment = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error("Sign in to comment.");
      const { error } = await supabase
        .from("comments")
        .insert({ post_id: post.id, author_id: user.id, content });
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["comments", post.id] });
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const author = post.profiles;

  return (
    <Card className="p-5">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={author?.avatar_url ?? undefined} alt="" />
          <AvatarFallback>{initials(author?.full_name ?? "AB")}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {author ? (
              <Link
                to="/profile/$username"
                params={{ username: author.username }}
                className="font-medium hover:text-primary"
              >
                {author.full_name}
              </Link>
            ) : (
              <span className="font-medium">Community member</span>
            )}
            <span className="text-muted-foreground">· {formatRelative(post.created_at)}</span>
            <Badge variant="outline" className="capitalize">
              {post.post_type}
            </Badge>
          </div>
          <p className="mt-3 whitespace-pre-line text-[15px] leading-7 text-foreground/90">
            {post.content}
          </p>
          {post.tags.length ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>
          ) : null}

          <div className="mt-4 flex items-center gap-4 border-t border-border/60 pt-3 text-sm">
            <button
              type="button"
              onClick={onLike}
              aria-pressed={liked}
              className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary"
            >
              <Heart className={liked ? "h-4 w-4 fill-primary text-primary" : "h-4 w-4"} />
              {post.like_count}
            </button>
            <button
              type="button"
              onClick={() => setShowComments((value) => !value)}
              className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary"
            >
              <MessageCircle className="h-4 w-4" />
              {post.comment_count}
            </button>
          </div>

          {showComments ? (
            <div className="mt-4 space-y-3 border-t border-border/60 pt-4">
              {commentsQuery.data?.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.profiles?.avatar_url ?? undefined} alt="" />
                    <AvatarFallback>
                      {initials(comment.profiles?.full_name ?? "AB")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg bg-secondary/50 px-3 py-2">
                    <p className="text-xs text-muted-foreground">
                      {comment.profiles?.full_name} · {formatRelative(comment.created_at)}
                    </p>
                    <p className="mt-1 text-sm">{comment.content}</p>
                  </div>
                </div>
              ))}
              {user ? (
                <form
                  className="flex gap-2"
                  onSubmit={(event) => {
                    event.preventDefault();
                    const input = event.currentTarget.elements.namedItem(
                      "comment",
                    ) as HTMLInputElement;
                    const value = input.value.trim();
                    if (!value) return;
                    if (value.length > 500) {
                      toast.error("Comments are limited to 500 characters.");
                      return;
                    }
                    addComment.mutate(value);
                    input.value = "";
                  }}
                >
                  <Input name="comment" placeholder="Add a comment" aria-label="Add a comment" />
                  <Button type="submit" size="sm" disabled={addComment.isPending}>
                    Reply
                  </Button>
                </form>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
