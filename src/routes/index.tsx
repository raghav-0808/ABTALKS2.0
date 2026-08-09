import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Bot,
  Compass,
  Flame,
  MessageSquare,
  Sparkle,
  TrendingUp,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EventCard } from "@/components/events/EventCard";
import { HeroNetwork } from "@/components/home/HeroNetwork";
import { CardGridSkeleton, ErrorState, SectionHeading } from "@/components/common/States";
import { fetchEvents, fetchPosts, fetchProfiles } from "@/lib/api";
import { formatRelative, initials } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ABTalks — Where Ideas Meet Intelligence" },
      {
        name: "description",
        content:
          "Discover technology events, hackathons, workshops, learning resources and a community of builders — with an AI assistant that personalises it all.",
      },
      { property: "og:title", content: "ABTalks — Where Ideas Meet Intelligence" },
      {
        property: "og:description",
        content:
          "Discover people, events, knowledge and opportunities shaping the next generation of technology.",
      },
    ],
  }),
  component: Home,
});

const topics = [
  { name: "Artificial Intelligence", slug: "Artificial Intelligence" },
  { name: "Web Development", slug: "Web Development" },
  { name: "Java", slug: "Java" },
  { name: "React", slug: "React" },
  { name: "Cloud", slug: "Cloud" },
  { name: "Cybersecurity", slug: "Cybersecurity" },
  { name: "Blockchain", slug: "Blockchain" },
  { name: "Data Science", slug: "Data Science" },
];

function Home() {
  const eventsQuery = useQuery({
    queryKey: ["home-events"],
    queryFn: () => fetchEvents({ sort: "soonest", limit: 6 }),
  });
  const postsQuery = useQuery({
    queryKey: ["home-posts"],
    queryFn: () => fetchPosts({ sort: "popular", limit: 4 }),
  });
  const peopleQuery = useQuery({
    queryKey: ["home-people"],
    queryFn: () => fetchProfiles({ limit: 6 }),
  });

  return (
    <div>
      {/* Hero */}
      <section className="hero-glow relative overflow-hidden">
        <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-28">
          <div className="animate-rise">
            <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1">
              <Sparkle className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              AI-powered technology community
            </Badge>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.05] sm:text-6xl">
              Where Ideas Meet <span className="text-gradient">Intelligence.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Discover people, events, knowledge and opportunities shaping the next generation of
              technology.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/explore">
                  Explore ABTalks <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/auth" search={{ mode: "signup" }}>
                  Join the Community
                </Link>
              </Button>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-border/60 pt-6">
              {[
                { label: "Upcoming events", value: "10+" },
                { label: "Learning resources", value: "15+" },
                { label: "Community members", value: "10+" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                    {stat.label}
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-semibold">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="animate-rise">
            <HeroNetwork />
          </div>
        </div>
      </section>

      {/* Featured events */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="Featured"
          title="Events worth clearing your calendar for"
          description="Hackathons, workshops, tech talks, webinars and meetups from across the community."
          action={
            <Button variant="ghost" asChild>
              <Link to="/events">
                All events <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          }
        />
        <div className="mt-8">
          {eventsQuery.isLoading ? (
            <CardGridSkeleton />
          ) : eventsQuery.isError ? (
            <ErrorState onRetry={() => void eventsQuery.refetch()} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {eventsQuery.data?.map((event) => <EventCard key={event.id} event={event} />)}
            </div>
          )}
        </div>
      </section>

      {/* Trending topics */}
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <SectionHeading
          eyebrow="Trending"
          title="Topics moving fastest right now"
          description="Jump straight into the events, posts and resources tagged with what you care about."
        />
        <div className="mt-8 flex flex-wrap gap-3">
          {topics.map((topic) => (
            <Link
              key={topic.name}
              to="/explore"
              search={{ q: topic.slug }}
              className="card-hover surface-panel inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium"
            >
              <TrendingUp className="h-4 w-4 text-primary" aria-hidden="true" />
              {topic.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Community */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="Community"
          title="The people behind the ideas"
          description="Active members, trending discussions and the builders shaping the platform."
          action={
            <Button variant="ghost" asChild>
              <Link to="/community">
                Open the feed <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          }
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Card className="p-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <Flame className="h-4 w-4 text-primary" aria-hidden="true" /> Trending discussions
            </h3>
            <ul className="mt-4 divide-y divide-border/60">
              {postsQuery.data?.map((post) => (
                <li key={post.id} className="py-4 first:pt-0 last:pb-0">
                  <Link to="/community" className="group block">
                    <p className="line-clamp-2 font-medium transition-colors group-hover:text-primary">
                      {post.title ?? post.content.slice(0, 90)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      @{post.profiles?.username} · {post.like_count} likes ·{" "}
                      {post.comment_count} comments · {formatRelative(post.created_at)}
                    </p>
                  </Link>
                </li>
              ))}
              {!postsQuery.isLoading && !postsQuery.data?.length ? (
                <li className="py-4 text-sm text-muted-foreground">No discussions yet.</li>
              ) : null}
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <Users className="h-4 w-4 text-primary" aria-hidden="true" /> Active members
            </h3>
            <ul className="mt-4 space-y-4">
              {peopleQuery.data?.map((person) => (
                <li key={person.id}>
                  <Link
                    to="/profile/$username"
                    params={{ username: person.username }}
                    className="group flex items-center gap-3"
                  >
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage src={person.avatar_url ?? undefined} alt="" />
                      <AvatarFallback>{initials(person.full_name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium transition-colors group-hover:text-primary">
                        {person.full_name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {person.headline ?? `@${person.username}`}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      {/* AI */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <Card className="hero-glow relative overflow-hidden border-primary/25 p-8 sm:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <Badge variant="secondary" className="gap-1.5 rounded-full">
                <Bot className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> ABTalks AI
              </Badge>
              <h2 className="mt-5 text-3xl font-semibold sm:text-4xl">
                Your AI-powered technology companion.
              </h2>
              <p className="mt-4 max-w-xl text-muted-foreground">
                ABTalks AI knows the platform. Ask it anything and it will point you at the right
                event, the right resource and the right people.
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "Recommend events that match your interests",
                  "Suggest learning resources and a study order",
                  "Help you find communities and people to follow",
                  "Answer questions about ABTalks and what to learn next",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Sparkle className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button size="lg" className="mt-8" asChild>
                <Link to="/ai">
                  Ask ABTalks AI <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <Card className="bg-background/60 p-5 backdrop-blur">
              <div className="space-y-4 text-sm">
                <div className="flex justify-end">
                  <p className="max-w-[85%] rounded-2xl bg-primary px-4 py-2.5 text-primary-foreground">
                    Find me upcoming AI events.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Bot className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <p className="text-muted-foreground">
                    The Build With AI Hackathon runs next week in Hyderabad, and the Data Science
                    webinar covers taking models to production. Want me to compare them?
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </Card>
      </section>

      {/* Final CTA */}
      <section className="mx-auto w-full max-w-5xl px-4 py-20 text-center sm:px-6">
        <MessageSquare className="mx-auto h-8 w-8 text-primary" aria-hidden="true" />
        <h2 className="mt-6 text-3xl font-semibold sm:text-4xl">
          Your next opportunity could start here.
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg" asChild>
            <Link to="/community">
              <Compass className="mr-2 h-4 w-4" /> Explore Community
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/auth" search={{ mode: "signup" }}>
              Create Account
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
