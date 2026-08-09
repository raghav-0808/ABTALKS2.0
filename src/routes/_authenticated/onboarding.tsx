import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, Loader2, Sparkle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchInterests, fetchUserInterests, saveUserInterests } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({
    meta: [
      { title: "Personalise your feed | ABTalks" },
      {
        name: "description",
        content: "Pick the technologies you care about so ABTalks can recommend the right events.",
      },
      { property: "og:title", content: "Personalise your feed | ABTalks" },
      { property: "og:description", content: "Choose your interests to personalise ABTalks." },
    ],
  }),
  component: Onboarding,
});

function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const interestsQuery = useQuery({ queryKey: ["interests"], queryFn: fetchInterests });
  const mineQuery = useQuery({
    queryKey: ["user-interests", user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => fetchUserInterests(user!.id),
  });

  useEffect(() => {
    if (mineQuery.data?.length) setSelected(mineQuery.data.map((interest) => interest.id));
  }, [mineQuery.data]);

  function toggle(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  }

  async function handleSave() {
    if (!user) return;
    if (selected.length < 3) {
      toast.error("Pick at least three interests so we can personalise properly.");
      return;
    }
    setSaving(true);
    try {
      await saveUserInterests(user.id, selected);
      toast.success("Your feed is personalised");
      await navigate({ to: "/dashboard" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save your interests");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="hero-glow min-h-[calc(100vh-4rem)] px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Step 1 of 1
        </p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">What are you into?</h1>
        <p className="mt-3 text-muted-foreground">
          Choose at least three topics. We use these to recommend events, learning resources and
          people worth following.
        </p>

        <Card className="mt-8 p-6">
          {interestsQuery.isLoading ? (
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: 12 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-32 rounded-full" />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {interestsQuery.data?.map((interest) => {
                const isSelected = selected.includes(interest.id);
                return (
                  <button
                    key={interest.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => toggle(interest.id)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all",
                      isSelected
                        ? "border-primary bg-primary/15 text-foreground"
                        : "border-border bg-secondary/40 text-muted-foreground hover:border-primary/50 hover:text-foreground",
                    )}
                  >
                    {isSelected ? (
                      <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                    ) : (
                      <Sparkle className="h-4 w-4 opacity-60" aria-hidden="true" />
                    )}
                    {interest.name}
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-6">
            <p className="text-sm text-muted-foreground">{selected.length} selected</p>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => void navigate({ to: "/dashboard" })}>
                Skip for now
              </Button>
              <Button onClick={() => void handleSave()} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save and continue
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
