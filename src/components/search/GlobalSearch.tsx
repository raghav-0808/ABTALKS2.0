import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, CalendarDays, MessageSquare, Users } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { fetchEvents, fetchPosts, fetchProfiles, fetchResources } from "@/lib/api";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalSearch({ open, onOpenChange }: Props) {
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(term.trim()), 250);
    return () => clearTimeout(timer);
  }, [term]);

  const { data, isFetching } = useQuery({
    queryKey: ["global-search", debounced],
    enabled: open && debounced.length > 1,
    queryFn: async () => {
      const [events, people, posts, resources] = await Promise.all([
        fetchEvents({ search: debounced, limit: 4 }),
        fetchProfiles({ search: debounced, limit: 4 }),
        fetchPosts({ search: debounced, limit: 4 }),
        fetchResources({ search: debounced, limit: 4 }),
      ]);
      return { events, people, posts, resources };
    },
  });

  function go(to: string) {
    onOpenChange(false);
    setTerm("");
    void navigate({ to });
  }

  const hasResults =
    (data?.events.length ?? 0) +
      (data?.people.length ?? 0) +
      (data?.posts.length ?? 0) +
      (data?.resources.length ?? 0) >
    0;

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search events, people, posts and resources..."
        value={term}
        onValueChange={setTerm}
      />
      <CommandList>
        {debounced.length < 2 ? (
          <CommandEmpty>Type at least two characters to search.</CommandEmpty>
        ) : isFetching && !hasResults ? (
          <CommandEmpty>Searching…</CommandEmpty>
        ) : !hasResults ? (
          <CommandEmpty>No results for “{debounced}”.</CommandEmpty>
        ) : null}

        {data?.events.length ? (
          <CommandGroup heading="Events">
            {data.events.map((event) => (
              <CommandItem key={event.id} onSelect={() => go(`/events/${event.slug}`)}>
                <CalendarDays className="mr-2 h-4 w-4" />
                {event.title}
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}

        {data?.people.length ? (
          <CommandGroup heading="People">
            {data.people.map((person) => (
              <CommandItem key={person.id} onSelect={() => go(`/profile/${person.username}`)}>
                <Users className="mr-2 h-4 w-4" />
                {person.full_name} · @{person.username}
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}

        {data?.posts.length ? (
          <CommandGroup heading="Posts">
            {data.posts.map((post) => (
              <CommandItem key={post.id} onSelect={() => go("/community")}>
                <MessageSquare className="mr-2 h-4 w-4" />
                <span className="truncate">{post.title ?? post.content.slice(0, 70)}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}

        {data?.resources.length ? (
          <CommandGroup heading="Learning resources">
            {data.resources.map((resource) => (
              <CommandItem key={resource.id} onSelect={() => go("/learn")}>
                <BookOpen className="mr-2 h-4 w-4" />
                {resource.title}
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}
      </CommandList>
    </CommandDialog>
  );
}
