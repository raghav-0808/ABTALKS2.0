import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EventCard } from "@/components/events/EventCard";
import { CardGridSkeleton, SectionHeading } from "@/components/common/States";
import { fetchEvents, fetchPosts, fetchProfiles, fetchResources, fetchUserInterests } from "@/lib/api";
import { rankEvents, rankPeople, rankPosts, rankResources } from "@/lib/recommendations";
import { greeting, formatRelative } from "@/lib/format";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Your dashboard | ABTalks" },
      {
        name: "description",
        content: "Personalised event, learning and community recommendations based on your interests.",
      },
      { property: "og:title", content: "Your dashboard | ABTalks" },
      { property: "og:description", content: "Your personalised ABTalks recommendations." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user, profile } = useAuth();

  const interestsQuery = useQuery({
    queryKey: ["user-interests", user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => fetchUserInterests(user!.id),
  });
  const interestNames = (interestsQuery.data ?? []).map((interest) => interest.name);

  const eventsQuery = useQuery({ queryKey: ["events", "all"], queryFn: () => fetchEvents() });
  const resourcesQuery = useQuery({ queryKey: ["resources", "all"], queryFn: () => fetchResources() });
  const postsQuery = useQuery({ queryKey: ["posts", "all"], queryFn: () => fetchPosts({ limit: 20 }) });
  const peopleQuery = useQuery({ queryKey: ["profiles", "all"], queryFn: () => fetchProfiles({ limit: 20 }) });

  const events = rankEvents(eventsQuery.data ?? [], interestNames, 3);
  const resources = rankResources(resourcesQuery.data ?? [], interestNames, 3);
  const posts = rankPosts(postsQuery.data ?? [], interestNames, 4);
  const people = rankPeople(peopleQuery.data ?? [], interestNames, user?.id, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {greeting()}
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
            {profile?.full_name ?? "Welcome back"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {interestNames.length
              ? `Recommendations tuned to ${interestNames.slice(0, 3).join(", ")}`
              : "Add a few interests to unlock personalised recommendations."}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/onboarding">Edit interests</Link>
        </Button>
      </div>

      <section className="mt-12">
        <SectionHeading
          eyebrow="For you"
          title="Events worth your weekend"
          action={
            <Button asChild variant="ghost">
              <Link to="/events">All events</Link>
            </Button>
          }
        />
        <div className="mt-6">
          {eventsQuery.isLoading ? (
            <CardGridSkeleton count={3} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map(({ item, reason }) => (
                <div key={item.id} className="space-y-2">
                  <EventCard event={item} />
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    {reason}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="mt-14 grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="text-xl font-semibold">Keep learning</h2>
          <div className="mt-4 space-y-3">
            {resources.map(({ item, reason }) => (
              <Card key={item.id} className="p-5">
                <Badge variant="secondary" className="capitalize">
                  {item.difficulty}
                </Badge>
                <h3 className="mt-2 font-medium">{item.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
                <p className="mt-3 text-xs text-primary">{reason}</p>
              </Card>
            ))}
          </div>
          <Button asChild variant="ghost" className="mt-4">
            <Link to="/learn">Browse all resources</Link>
          </Button>
        </section>

        <section>
          <h2 className="text-xl font-semibold">From the community</h2>
          <div className="mt-4 space-y-3">
            {posts.map(({ item }) => (
              <Card key={item.id} className="p-5">
                <p className="text-xs text-muted-foreground">
                  {item.profiles?.full_name ?? "Member"} · {formatRelative(item.created_at)}
                </p>
                <p className="mt-2 line-clamp-3 text-sm">{item.content}</p>
              </Card>
            ))}
          </div>
          <Button asChild variant="ghost" className="mt-4">
            <Link to="/community">Open the feed</Link>
          </Button>
        </section>
      </div>

      <section className="mt-14">
        <h2 className="text-xl font-semibold">People to follow</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-3">
          {people.map(({ item, reason }) => (
            <Card key={item.id} className="p-5">
              <p className="font-medium">{item.full_name}</p>
              <p className="text-sm text-muted-foreground">@{item.username}</p>
              <p className="mt-2 text-xs text-primary">{reason}</p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link to="/profile/$username" params={{ username: item.username }}>
                  View profile
                </Link>
              </Button>
            </Card>
          ))}
        </div>
      </section>

      <Card className="mt-14 flex flex-wrap items-center justify-between gap-4 p-6">
        <div className="flex items-center gap-3">
          <CalendarDays className="h-5 w-5 text-primary" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            Ask the ABTalks assistant what to learn or attend next.
          </p>
        </div>
        <Button asChild>
          <Link to="/ai">Open AI assistant</Link>
        </Button>
      </Card>
    </div>
  );
}
