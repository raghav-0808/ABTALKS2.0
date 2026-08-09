import { Link } from "@tanstack/react-router";
import { CalendarDays, MapPin, Users, Video } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatEventDate, formatEventTime } from "@/lib/format";
import type { AbEvent } from "@/lib/types";

const typeLabels: Record<string, string> = {
  hackathon: "Hackathon",
  workshop: "Workshop",
  talk: "Tech talk",
  webinar: "Webinar",
  meetup: "Meetup",
};

export function EventCard({ event }: { event: AbEvent }) {
  return (
    <Card className="card-hover group overflow-hidden border-border/70 bg-card p-0">
      <Link
        to="/events/$slug"
        params={{ slug: event.slug }}
        className="block focus-visible:outline-none"
      >
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          {event.banner_url ? (
            <img
              src={event.banner_url}
              alt={`Banner for ${event.title}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : null}
          <div className="absolute left-3 top-3 flex gap-2">
            <Badge className="bg-background/85 text-foreground backdrop-blur">
              {typeLabels[event.event_type] ?? event.event_type}
            </Badge>
          </div>
        </div>
        <div className="space-y-3 p-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              {formatEventDate(event.starts_at)} · {formatEventTime(event.starts_at)}
            </span>
          </div>
          <h3 className="line-clamp-2 text-lg font-semibold leading-snug">{event.title}</h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">{event.summary}</p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              {event.is_online ? (
                <Video className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {event.is_online ? "Online" : event.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              {event.participant_count} joined
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-border/60 pt-3">
            <span className="text-xs text-muted-foreground">{event.organizer}</span>
            <span className="text-sm font-medium text-primary transition-transform group-hover:translate-x-0.5">
              View details →
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
}
