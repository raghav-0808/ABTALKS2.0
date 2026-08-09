import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarSearch, Search } from "lucide-react";

import { EventCard } from "@/components/events/EventCard";
import { CardGridSkeleton, EmptyState, ErrorState, SectionHeading } from "@/components/common/States";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchEvents } from "@/lib/api";

export const Route = createFileRoute("/events/")({
  head: () => ({
    meta: [
      { title: "Tech events, hackathons & workshops | ABTalks" },
      {
        name: "description",
        content:
          "Browse upcoming hackathons, workshops, tech talks and meetups from the ABTalks community and register in one click.",
      },
      { property: "og:title", content: "Tech events, hackathons & workshops | ABTalks" },
      {
        property: "og:description",
        content: "Browse upcoming hackathons, workshops and tech talks on ABTalks.",
      },
    ],
  }),
  component: EventsPage,
});

const categories = [
  "all",
  "AI & ML",
  "Web Development",
  "Cloud & DevOps",
  "Cybersecurity",
  "Data Science",
  "Product & Design",
  "Career",
];

const types = ["all", "hackathon", "workshop", "talk", "webinar", "meetup"];

function EventsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState<"soonest" | "popular" | "latest">("soonest");

  const eventsQuery = useQuery({
    queryKey: ["events", { search, category, type, sort }],
    queryFn: () => fetchEvents({ search, category, type, sort }),
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Events"
        title="Find your next build weekend"
        description="Hackathons, hands-on workshops, tech talks and meetups — filtered to what you care about."
      />

      <div className="mt-8 grid gap-3 rounded-xl border border-border/70 bg-card/60 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search events"
            aria-label="Search events"
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger aria-label="Filter by category">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((value) => (
              <SelectItem key={value} value={value}>
                {value === "all" ? "All categories" : value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger aria-label="Filter by event type">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {types.map((value) => (
              <SelectItem key={value} value={value}>
                {value === "all" ? "All formats" : value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(value) => setSort(value as typeof sort)}>
          <SelectTrigger aria-label="Sort events">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="soonest">Starting soonest</SelectItem>
            <SelectItem value="popular">Most popular</SelectItem>
            <SelectItem value="latest">Recently added</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-10">
        {eventsQuery.isLoading ? (
          <CardGridSkeleton />
        ) : eventsQuery.isError ? (
          <ErrorState onRetry={() => void eventsQuery.refetch()} />
        ) : eventsQuery.data?.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {eventsQuery.data.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<CalendarSearch className="h-8 w-8" />}
            title="No events match those filters"
            description="Try widening your search or clearing a filter."
          />
        )}
      </div>
    </div>
  );
}
