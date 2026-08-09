import { t as supabase } from "./client-CoEqkHDN.js";
import { v as useAuth } from "./router-DJAHCQz5.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
//#region src/hooks/useBookmarks.ts
function useBookmarks() {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const query = useQuery({
		queryKey: ["bookmarks", user?.id],
		enabled: Boolean(user?.id),
		queryFn: async () => {
			const { data, error } = await supabase.from("bookmarks").select("id, item_type, item_id, created_at").eq("user_id", user.id).order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const toggle = useMutation({
		mutationFn: async ({ type, id }) => {
			if (!user) throw new Error("You need an account to save items.");
			const existing = query.data?.find((row) => row.item_type === type && row.item_id === id);
			if (existing) {
				const { error } = await supabase.from("bookmarks").delete().eq("id", existing.id);
				if (error) throw error;
				return "removed";
			}
			const { error } = await supabase.from("bookmarks").insert({
				user_id: user.id,
				item_type: type,
				item_id: id
			});
			if (error) throw error;
			return "added";
		},
		onSuccess: (result) => {
			queryClient.invalidateQueries({ queryKey: ["bookmarks", user?.id] });
			toast.success(result === "added" ? "Saved to your library" : "Removed from saved");
		},
		onError: (error) => toast.error(error.message)
	});
	return {
		bookmarks: query.data ?? [],
		isLoading: query.isLoading,
		isSaved: (type, id) => Boolean(query.data?.some((row) => row.item_type === type && row.item_id === id)),
		toggle: (type, id) => toggle.mutate({
			type,
			id
		}),
		isToggling: toggle.isPending
	};
}
//#endregion
export { useBookmarks as t };
