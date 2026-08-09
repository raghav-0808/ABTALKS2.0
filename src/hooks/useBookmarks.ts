import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { BookmarkItemType } from "@/lib/types";

export interface BookmarkRow {
  id: string;
  item_type: BookmarkItemType;
  item_id: string;
  created_at: string;
}

export function useBookmarks() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["bookmarks", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async (): Promise<BookmarkRow[]> => {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("id, item_type, item_id, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as BookmarkRow[];
    },
  });

  const toggle = useMutation({
    mutationFn: async ({ type, id }: { type: BookmarkItemType; id: string }) => {
      if (!user) throw new Error("You need an account to save items.");
      const existing = query.data?.find((row) => row.item_type === type && row.item_id === id);
      if (existing) {
        const { error } = await supabase.from("bookmarks").delete().eq("id", existing.id);
        if (error) throw error;
        return "removed" as const;
      }
      const { error } = await supabase
        .from("bookmarks")
        .insert({ user_id: user.id, item_type: type, item_id: id });
      if (error) throw error;
      return "added" as const;
    },
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: ["bookmarks", user?.id] });
      toast.success(result === "added" ? "Saved to your library" : "Removed from saved");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return {
    bookmarks: query.data ?? [],
    isLoading: query.isLoading,
    isSaved: (type: BookmarkItemType, id: string) =>
      Boolean(query.data?.some((row) => row.item_type === type && row.item_id === id)),
    toggle: (type: BookmarkItemType, id: string) => toggle.mutate({ type, id }),
    isToggling: toggle.isPending,
  };
}
