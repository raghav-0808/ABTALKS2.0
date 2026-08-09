import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookmarkX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState, ListSkeleton, SectionHeading } from "@/components/common/States";
import { EventCard } from "@/components/events/EventCard";
import { fetchEvents, fetchResources } from "@/lib/api";
import { useBookmarks } from "@/hooks/useBookmarks";

export const Route = createFileRoute("/_authenticated/saved")({
  head: () => ({
    meta: [
      { title: "Saved items | ABTalks" },
      { name: "description", content: "Events and learning resources you saved for later on ABTalks." },
      { property: "og:title", content: "Saved items | ABTalks" },
      { property: "og:description", content: "Your saved ABTalks events and resources." },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const { bookmarks, isLoading, toggle } = useBookmarks();
  const eventsQuery = useQuery({ queryKey: ["events", "all"], queryFn: () => fetchEvents() });
  const resourcesQuery = useQuery({ queryKey: ["resources", "all"], queryFn: () => fetchResources() });

  const savedEventIds = bookmarks.filter((row) => row.item_type === "event").map((row) => row.item_id);
  const savedResourceIds = bookmarks
    .filter((row) => row.item_type === "resource")
    .map((row) => row.item_id);

  const events = (eventsQuery.data ?? []).filter((event) => savedEventIds.includes(event.id));
  const resources = (resourcesQuery.data ?? []).filter((resource) =>
    savedResourceIds.includes(resource.id),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <SectionHeading eyebrow="Library" title="Saved for later" />

      {isLoading ? (
        <div className="mt-8">
          <ListSkeleton count={3} />
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={<BookmarkX className="h-8 w-8" />}
            title="Nothing saved yet"
            description="Bookmark events and resources to find them here."
            action={
              <Button asChild className="mt-2">
                <Link to="/events">Browse events</Link>
              </Button>
            }
          />
        </div>
      ) : (
        <div className="mt-10 space-y-12">
          {events.length ? (
            <section>
              <h2 className="text-xl font-semibold">Events</h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          ) : null}

          {resources.length ? (
            <section>
              <h2 className="text-xl font-semibold">Resources</h2>
              <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {resources.map((resource) => (
                  <Card key={resource.id} className="flex flex-col gap-3 p-5">
                    <h3 className="font-medium">{resource.title}</h3>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {resource.description}
                    </p>
                    <div className="mt-auto flex gap-2">
                      <Button asChild size="sm" variant="outline">
                        <a href={resource.url} target="_blank" rel="noreferrer noopener">
                          Open
                        </a>
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => toggle("resource", resource.id)}>
                        Remove
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}
