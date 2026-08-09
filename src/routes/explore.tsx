import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Compass, Search } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventCard } from "@/components/events/EventCard";
import { CardGridSkeleton, EmptyState, SectionHeading } from "@/components/common/States";
import { fetchEvents, fetchProfiles, fetchResources } from "@/lib/api";
import { formatDuration, initials } from "@/lib/format";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore events, people & resources | ABTalks" },
      {
        name: "description",
        content:
          "Search across ABTalks events, community members and learning resources to find exactly what you need next.",
      },
      { property: "og:title", content: "Explore events, people & resources | ABTalks" },
      {
        property: "og:description",
        content: "Search events, members and learning resources across ABTalks.",
      },
    ],
  }),
  component: ExplorePage,
});

function ExplorePage() {
  const [search, setSearch] = useState("");

  const eventsQuery = useQuery({
    queryKey: ["explore-events", search],
    queryFn: () => fetchEvents({ search, limit: 9 }),
  });
  const peopleQuery = useQuery({
    queryKey: ["explore-people", search],
    queryFn: () => fetchProfiles({ search, limit: 12 }),
  });
  const resourcesQuery = useQuery({
    queryKey: ["explore-resources", search],
    queryFn: () => fetchResources({ search, limit: 12 }),
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Explore"
        title="One search across the whole community"
        description="Events, members and learning resources — all in one place."
      />

      <div className="relative mt-8 max-w-xl">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Try 'AI', 'React' or a name"
          aria-label="Search ABTalks"
          className="h-12 pl-9"
        />
      </div>

      <Tabs defaultValue="events" className="mt-10">
        <TabsList>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="people">People</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="mt-8">
          {eventsQuery.isLoading ? (
            <CardGridSkeleton count={3} />
          ) : eventsQuery.data?.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {eventsQuery.data.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <EmptyState icon={<Compass className="h-8 w-8" />} title="No events found" />
          )}
        </TabsContent>

        <TabsContent value="people" className="mt-8">
          {peopleQuery.data?.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {peopleQuery.data.map((person) => (
                <Card key={person.id} className="card-hover flex flex-col gap-3 p-5">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={person.avatar_url ?? undefined} alt="" />
                      <AvatarFallback>{initials(person.full_name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{person.full_name}</p>
                      <p className="truncate text-sm text-muted-foreground">@{person.username}</p>
                    </div>
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {person.headline ?? person.bio}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {person.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <Button asChild variant="outline" size="sm" className="mt-auto">
                    <Link to="/profile/$username" params={{ username: person.username }}>
                      View profile
                    </Link>
                  </Button>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState icon={<Compass className="h-8 w-8" />} title="No members found" />
          )}
        </TabsContent>

        <TabsContent value="resources" className="mt-8">
          {resourcesQuery.data?.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {resourcesQuery.data.map((resource) => (
                <Card key={resource.id} className="card-hover flex flex-col gap-3 p-5">
                  <Badge variant="secondary" className="w-fit capitalize">
                    {resource.difficulty}
                  </Badge>
                  <h3 className="text-base font-semibold leading-snug">{resource.title}</h3>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {resource.description}
                  </p>
                  <p className="mt-auto text-xs text-muted-foreground">
                    {resource.technology} · {formatDuration(resource.estimated_minutes)}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState icon={<Compass className="h-8 w-8" />} title="No resources found" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
