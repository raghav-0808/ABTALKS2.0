import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Bookmark, BookmarkCheck, Clock, ExternalLink, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardGridSkeleton, EmptyState, ErrorState, SectionHeading } from "@/components/common/States";
import { fetchResources } from "@/lib/api";
import { formatDuration } from "@/lib/format";
import { useAuth } from "@/hooks/useAuth";
import { useBookmarks } from "@/hooks/useBookmarks";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learning paths & resources | ABTalks" },
      {
        name: "description",
        content:
          "Curated learning paths for AI, web development, cloud, security and data — sorted by difficulty and time to complete.",
      },
      { property: "og:title", content: "Learning paths & resources | ABTalks" },
      {
        property: "og:description",
        content: "Curated technology learning paths from the ABTalks community.",
      },
    ],
  }),
  component: LearnPage,
});

const difficulties = ["all", "beginner", "intermediate", "advanced"];

function LearnPage() {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const { user } = useAuth();
  const { isSaved, toggle } = useBookmarks();

  const resourcesQuery = useQuery({
    queryKey: ["resources", { search, difficulty }],
    queryFn: () => fetchResources({ search, difficulty }),
  });

  const grouped = (resourcesQuery.data ?? []).reduce<Record<string, typeof resourcesQuery.data>>(
    (accumulator, resource) => {
      const bucket = accumulator[resource.category] ?? [];
      bucket.push(resource);
      accumulator[resource.category] = bucket;
      return accumulator;
    },
    {},
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Learn"
        title="Structured paths, not random links"
        description="Every resource is tagged by technology, difficulty and time so you always know what to pick up next."
      />

      <div className="mt-8 grid gap-3 rounded-xl border border-border/70 bg-card/60 p-4 sm:grid-cols-[minmax(0,1fr)_12rem]">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search resources"
            aria-label="Search learning resources"
            className="pl-9"
          />
        </div>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger aria-label="Filter by difficulty">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            {difficulties.map((value) => (
              <SelectItem key={value} value={value}>
                {value === "all" ? "All levels" : value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-10 space-y-12">
        {resourcesQuery.isLoading ? (
          <CardGridSkeleton />
        ) : resourcesQuery.isError ? (
          <ErrorState onRetry={() => void resourcesQuery.refetch()} />
        ) : Object.keys(grouped).length === 0 ? (
          <EmptyState
            icon={<BookOpen className="h-8 w-8" />}
            title="No resources found"
            description="Try a different search term or difficulty level."
          />
        ) : (
          Object.entries(grouped).map(([category, resources]) => (
            <section key={category}>
              <h2 className="text-xl font-semibold">{category}</h2>
              <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {resources?.map((resource) => (
                  <Card key={resource.id} className="card-hover flex flex-col gap-3 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <Badge variant="secondary" className="capitalize">
                        {resource.difficulty}
                      </Badge>
                      {user ? (
                        <button
                          type="button"
                          aria-label={
                            isSaved("resource", resource.id) ? "Remove from saved" : "Save resource"
                          }
                          onClick={() => toggle("resource", resource.id)}
                          className="text-muted-foreground transition-colors hover:text-primary"
                        >
                          {isSaved("resource", resource.id) ? (
                            <BookmarkCheck className="h-4 w-4 text-primary" />
                          ) : (
                            <Bookmark className="h-4 w-4" />
                          )}
                        </button>
                      ) : null}
                    </div>
                    <h3 className="text-base font-semibold leading-snug">{resource.title}</h3>
                    <p className="line-clamp-3 flex-1 text-sm text-muted-foreground">
                      {resource.description}
                    </p>
                    <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                        {formatDuration(resource.estimated_minutes)}
                      </span>
                      <span>{resource.technology}</span>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <a href={resource.url} target="_blank" rel="noreferrer noopener">
                        Open resource
                        <ExternalLink className="ml-2 h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    </Button>
                  </Card>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
