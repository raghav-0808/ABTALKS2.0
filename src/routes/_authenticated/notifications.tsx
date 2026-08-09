import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BellOff, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState, ListSkeleton, SectionHeading } from "@/components/common/States";
import { fetchNotifications } from "@/lib/api";
import { formatRelative } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications | ABTalks" },
      { name: "description", content: "Event reminders, follows and replies from the ABTalks community." },
      { property: "og:title", content: "Notifications | ABTalks" },
      { property: "og:description", content: "Your ABTalks activity notifications." },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: ["notifications", user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => fetchNotifications(user!.id),
  });

  const markAllRead = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user!.id)
        .eq("is_read", false);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <SectionHeading
        eyebrow="Activity"
        title="Notifications"
        action={
          <Button variant="outline" size="sm" onClick={() => markAllRead.mutate()}>
            <Check className="mr-2 h-4 w-4" /> Mark all read
          </Button>
        }
      />

      <div className="mt-8 space-y-3">
        {notificationsQuery.isLoading ? (
          <ListSkeleton count={3} />
        ) : notificationsQuery.data?.length ? (
          notificationsQuery.data.map((notification) => (
            <Card
              key={notification.id}
              className={cn("p-5", !notification.is_read && "border-primary/40 bg-primary/5")}
            >
              <p className="font-medium">{notification.title}</p>
              {notification.body ? (
                <p className="mt-1 text-sm text-muted-foreground">{notification.body}</p>
              ) : null}
              <p className="mt-2 text-xs text-muted-foreground">
                {formatRelative(notification.created_at)}
              </p>
            </Card>
          ))
        ) : (
          <EmptyState
            icon={<BellOff className="h-8 w-8" />}
            title="You're all caught up"
            description="Register for an event or follow someone to start getting updates."
          />
        )}
      </div>
    </div>
  );
}
