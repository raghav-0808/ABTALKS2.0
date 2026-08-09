import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, MessagesSquare, ShieldAlert, Users } from "lucide-react";

import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/common/States";
import { fetchEvents, fetchPosts, fetchProfiles } from "@/lib/api";
import { formatEventDate } from "@/lib/format";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin overview | ABTalks" },
      { name: "description", content: "Community health metrics for ABTalks organisers." },
      { property: "og:title", content: "Admin overview | ABTalks" },
      { property: "og:description", content: "Community health metrics for ABTalks organisers." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { isAdmin } = useAuth();
  const eventsQuery = useQuery({ queryKey: ["events", "all"], queryFn: () => fetchEvents() });
  const postsQuery = useQuery({ queryKey: ["posts", "all"], queryFn: () => fetchPosts({ limit: 50 }) });
  const peopleQuery = useQuery({ queryKey: ["profiles", "all"], queryFn: () => fetchProfiles({ limit: 100 }) });

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <ShieldAlert className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden="true" />
        <h1 className="mt-4 text-2xl font-semibold">Admins only</h1>
        <p className="mt-2 text-muted-foreground">
          This area is limited to ABTalks organisers.
        </p>
      </div>
    );
  }

  const stats = [
    { label: "Members", value: peopleQuery.data?.length ?? 0, icon: Users },
    { label: "Events", value: eventsQuery.data?.length ?? 0, icon: CalendarDays },
    { label: "Posts", value: postsQuery.data?.length ?? 0, icon: MessagesSquare },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <SectionHeading eyebrow="Admin" title="Community overview" />

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <stat.icon className="h-5 w-5 text-primary" aria-hidden="true" />
            <p className="mt-3 text-3xl font-semibold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </Card>
        ))}
      </div>

      <h2 className="mt-12 text-xl font-semibold">Upcoming events by registrations</h2>
      <div className="mt-4 space-y-3">
        {(eventsQuery.data ?? []).slice(0, 8).map((event) => (
          <Card key={event.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <p className="font-medium">{event.title}</p>
              <p className="text-sm text-muted-foreground">{formatEventDate(event.starts_at)}</p>
            </div>
            <p className="text-sm">
              <strong>{event.participant_count}</strong>
              <span className="text-muted-foreground"> / {event.capacity} registered</span>
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
