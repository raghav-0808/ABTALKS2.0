import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Github, Globe, MapPin } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ListSkeleton } from "@/components/common/States";
import { fetchFollowCounts, fetchPosts, fetchProfileByUsername } from "@/lib/api";
import { formatRelative, initials } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/profile/$username")({
  loader: async ({ params }) => ({ profile: await fetchProfileByUsername(params.username) }),
  head: ({ loaderData }) => {
    const profile = loaderData?.profile;
    const title = profile ? `${profile.full_name} (@${profile.username}) | ABTalks` : "Profile | ABTalks";
    const description =
      profile?.headline ?? profile?.bio ?? "An ABTalks community member profile.";
    return {
      meta: [
        { title },
        { name: "description", content: description.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: description.slice(0, 155) },
      ],
    };
  },
  component: ProfilePage,
});

function ProfilePage() {
  const { username } = Route.useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ["profile", username],
    queryFn: () => fetchProfileByUsername(username),
  });
  const profile = profileQuery.data;

  const postsQuery = useQuery({
    queryKey: ["profile-posts", profile?.id],
    enabled: Boolean(profile?.id),
    queryFn: () => fetchPosts({ authorId: profile!.id }),
  });

  const countsQuery = useQuery({
    queryKey: ["follow-counts", profile?.id],
    enabled: Boolean(profile?.id),
    queryFn: () => fetchFollowCounts(profile!.id),
  });

  const followingQuery = useQuery({
    queryKey: ["is-following", profile?.id, user?.id],
    enabled: Boolean(profile?.id && user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("follows")
        .select("follower_id, following_id")
        .eq("follower_id", user!.id)
        .eq("following_id", profile!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const toggleFollow = useMutation({
    mutationFn: async () => {
      if (!user || !profile) throw new Error("Sign in to follow members.");
      if (followingQuery.data) {
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("follower_id", user.id)
          .eq("following_id", profile.id);
        if (error) throw error;
        return "unfollowed" as const;
      }
      const { error } = await supabase
        .from("follows")
        .insert({ follower_id: user.id, following_id: profile.id });
      if (error) throw error;
      await supabase.from("notifications").insert({
        user_id: profile.id,
        type: "follow",
        title: "You have a new follower",
        body: "Someone from the community started following you.",
        link: `/profile/${profile.username}`,
      });
      return "followed" as const;
    },
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: ["is-following"] });
      void queryClient.invalidateQueries({ queryKey: ["follow-counts"] });
      toast.success(result === "followed" ? "Following" : "Unfollowed");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (profileQuery.isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-14">
        <Skeleton className="h-32 w-full rounded-xl" />
        <ListSkeleton count={3} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold">Member not found</h1>
        <Button asChild className="mt-6">
          <Link to="/explore">Explore the community</Link>
        </Button>
      </div>
    );
  }

  const isSelf = user?.id === profile.id;

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <Card className="p-6 sm:p-8">
        <div className="flex flex-wrap items-start gap-5">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile.avatar_url ?? undefined} alt="" />
            <AvatarFallback className="text-lg">{initials(profile.full_name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl font-semibold">{profile.full_name}</h1>
            <p className="text-muted-foreground">@{profile.username}</p>
            {profile.headline ? <p className="mt-2 text-sm">{profile.headline}</p> : null}
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
              {profile.location ? (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {profile.location}
                </span>
              ) : null}
              {profile.github_url ? (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 hover:text-primary"
                >
                  <Github className="h-4 w-4" aria-hidden="true" /> GitHub
                </a>
              ) : null}
              {profile.website_url ? (
                <a
                  href={profile.website_url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 hover:text-primary"
                >
                  <Globe className="h-4 w-4" aria-hidden="true" /> Website
                </a>
              ) : null}
            </div>
          </div>
          {!isSelf && user ? (
            <Button
              variant={followingQuery.data ? "secondary" : "default"}
              onClick={() => toggleFollow.mutate()}
              disabled={toggleFollow.isPending}
            >
              {followingQuery.data ? "Following" : "Follow"}
            </Button>
          ) : null}
        </div>

        {profile.bio ? <p className="mt-6 text-[15px] leading-7">{profile.bio}</p> : null}

        {profile.skills.length ? (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {profile.skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        ) : null}

        <div className="mt-6 flex gap-6 border-t border-border/60 pt-4 text-sm">
          <span>
            <strong>{countsQuery.data?.followers ?? 0}</strong>{" "}
            <span className="text-muted-foreground">followers</span>
          </span>
          <span>
            <strong>{countsQuery.data?.following ?? 0}</strong>{" "}
            <span className="text-muted-foreground">following</span>
          </span>
          <span>
            <strong>{postsQuery.data?.length ?? 0}</strong>{" "}
            <span className="text-muted-foreground">posts</span>
          </span>
        </div>
      </Card>

      <h2 className="mt-10 text-xl font-semibold">Recent activity</h2>
      <div className="mt-4 space-y-4">
        {postsQuery.isLoading ? (
          <ListSkeleton count={2} />
        ) : postsQuery.data?.length ? (
          postsQuery.data.map((post) => (
            <Card key={post.id} className="p-5">
              <p className="text-xs text-muted-foreground">
                {post.post_type} · {formatRelative(post.created_at)}
              </p>
              <p className="mt-2 whitespace-pre-line text-[15px] leading-7">{post.content}</p>
            </Card>
          ))
        ) : (
          <EmptyState title="No posts yet" description="This member hasn't posted anything." />
        )}
      </div>
    </div>
  );
}
