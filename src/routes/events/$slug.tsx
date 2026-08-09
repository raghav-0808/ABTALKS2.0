import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Video,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/common/States";
import { fetchEventBySlug } from "@/lib/api";
import { formatEventDate, formatEventTime, initials, isPastDate } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useBookmarks } from "@/hooks/useBookmarks";

export const Route = createFileRoute("/events/$slug")({
  loader: async ({ params }) => {
    const event = await fetchEventBySlug(params.slug);
    return { event };
  },
  head: ({ loaderData }) => {
    const event = loaderData?.event;
    const title = event ? `${event.title} | ABTalks` : "Event | ABTalks";
    const description =
      event?.summary ?? "Discover technology events, hackathons and workshops on ABTalks.";
    return {
      meta: [
        { title },
        { name: "description", content: description.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: description.slice(0, 155) },
        ...(event?.banner_url
          ? [
              { property: "og:image", content: event.banner_url },
              { name: "twitter:image", content: event.banner_url },
            ]
          : []),
      ],
    };
  },
  errorComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <ErrorState message="We couldn't load this event." />
    </div>
  ),
  component: EventDetail,
});

function EventDetail() {
  const { slug } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isSaved, toggle } = useBookmarks();

  const eventQuery = useQuery({
    queryKey: ["event", slug],
    queryFn: () => fetchEventBySlug(slug),
  });
  const event = eventQuery.data;

  const registrationQuery = useQuery({
    queryKey: ["registration", event?.id, user?.id],
    enabled: Boolean(event?.id && user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_registrations")
        .select("id")
        .eq("event_id", event!.id)
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const register = useMutation({
    mutationFn: async () => {
      if (!user || !event) throw new Error("Sign in to register for this event.");
      if (registrationQuery.data) {
        const { error } = await supabase
          .from("event_registrations")
          .delete()
          .eq("id", registrationQuery.data.id);
        if (error) throw error;
        return "cancelled" as const;
      }
      const { error } = await supabase
        .from("event_registrations")
        .insert({ event_id: event.id, user_id: user.id });
      if (error) throw error;
      await supabase.from("notifications").insert({
        user_id: user.id,
        type: "event",
        title: `You're registered for ${event.title}`,
        body: `${formatEventDate(event.starts_at)} · ${formatEventTime(event.starts_at)}`,
        link: `/events/${event.slug}`,
      });
      return "registered" as const;
    },
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: ["registration"] });
      void queryClient.invalidateQueries({ queryKey: ["event", slug] });
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success(result === "registered" ? "You're in! See you there." : "Registration cancelled");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (eventQuery.isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-14">
        <Skeleton className="aspect-[21/9] w-full rounded-xl" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold">Event not found</h1>
        <p className="mt-2 text-muted-foreground">This event may have been removed.</p>
        <Button asChild className="mt-6">
          <Link to="/events">Browse all events</Link>
        </Button>
      </div>
    );
  }

  const isRegistered = Boolean(registrationQuery.data);
  const spotsLeft = Math.max(0, event.capacity - event.participant_count);
  const past = isPastDate(event.starts_at);

  return (
    <article className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/events"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> All events
      </Link>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border/70">
        {event.banner_url ? (
          <img
            src={event.banner_url}
            alt={`Banner for ${event.title}`}
            className="aspect-[21/9] w-full object-cover"
          />
        ) : null}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{event.event_type}</Badge>
            <Badge variant="outline">{event.category}</Badge>
            {past ? <Badge variant="outline">Past event</Badge> : null}
          </div>
          <h1 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">{event.title}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{event.summary}</p>

          <div className="prose-invert mt-8 max-w-none whitespace-pre-line text-[15px] leading-7 text-foreground/90">
            {event.description}
          </div>

          {event.agenda?.length ? (
            <section className="mt-10">
              <h2 className="text-xl font-semibold">Agenda</h2>
              <ol className="mt-4 space-y-3">
                {event.agenda.map((item) => (
                  <li
                    key={`${item.time}-${item.title}`}
                    className="flex gap-4 rounded-lg border border-border/60 bg-card/60 p-4"
                  >
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                      <Clock className="h-4 w-4" aria-hidden="true" />
                      {item.time}
                    </span>
                    <span className="text-sm text-foreground/90">{item.title}</span>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          {event.event_speakers?.length ? (
            <section className="mt-10">
              <h2 className="text-xl font-semibold">Speakers</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {event.event_speakers.map((speaker) => (
                  <Card key={speaker.id} className="flex items-center gap-3 p-4">
                    <Avatar>
                      <AvatarImage src={speaker.avatar_url ?? undefined} alt="" />
                      <AvatarFallback>{initials(speaker.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{speaker.name}</p>
                      <p className="text-sm text-muted-foreground">{speaker.title}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          ) : null}

          {event.requirements?.length ? (
            <section className="mt-10">
              <h2 className="text-xl font-semibold">What to bring</h2>
              <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted-foreground">
                {event.requirements.map((requirement) => (
                  <li key={requirement}>{requirement}</li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="space-y-4 p-6">
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />
                {formatEventDate(event.starts_at)}
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
                {formatEventTime(event.starts_at)} – {formatEventTime(event.ends_at)}
              </p>
              <p className="flex items-center gap-2">
                {event.is_online ? (
                  <Video className="h-4 w-4 text-primary" aria-hidden="true" />
                ) : (
                  <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                )}
                {event.location}
              </p>
              <p className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" aria-hidden="true" />
                {event.participant_count} registered · {spotsLeft} spots left
              </p>
            </div>

            <div className="space-y-2 border-t border-border/60 pt-4">
              {user ? (
                <Button
                  className="w-full"
                  variant={isRegistered ? "secondary" : "default"}
                  onClick={() => register.mutate()}
                  disabled={register.isPending || (!isRegistered && spotsLeft === 0)}
                >
                  {isRegistered
                    ? "Cancel registration"
                    : spotsLeft === 0
                      ? "Event full"
                      : "Register now"}
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => void navigate({ to: "/auth", search: { mode: "signup" } })}
                >
                  Sign in to register
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  user
                    ? toggle("event", event.id)
                    : void navigate({ to: "/auth", search: { mode: "login" } })
                }
              >
                {isSaved("event", event.id) ? (
                  <BookmarkCheck className="mr-2 h-4 w-4" />
                ) : (
                  <Bookmark className="mr-2 h-4 w-4" />
                )}
                {isSaved("event", event.id) ? "Saved" : "Save event"}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">Organised by {event.organizer}</p>
          </Card>
        </aside>
      </div>
    </article>
  );
}
