import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/ai/")({
  head: () => ({
    meta: [
      { title: "ABTalks AI assistant" },
      {
        name: "description",
        content: "Ask the ABTalks assistant what to learn, which event to join and how to prepare.",
      },
      { property: "og:title", content: "ABTalks AI assistant" },
      { property: "og:description", content: "Your AI mentor for events, learning and careers." },
    ],
  }),
  component: AiIndex,
});

function AiIndex() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    void (async () => {
      const { data: existing } = await supabase
        .from("chat_threads")
        .select("id")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1);
      let threadId = existing?.[0]?.id as string | undefined;
      if (!threadId) {
        const { data: created } = await supabase
          .from("chat_threads")
          .insert({ user_id: user.id, title: "New conversation" })
          .select("id")
          .single();
        threadId = created?.id as string | undefined;
      }
      if (!cancelled && threadId) {
        void navigate({ to: "/ai/$threadId", params: { threadId }, replace: true });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, navigate]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-primary" aria-label="Loading your conversation" />
    </div>
  );
}
