import { t as supabase } from "./client-CoEqkHDN.js";
//#region src/lib/api.ts
/** Central data-access layer. Every page reads the database through these helpers. */
async function fetchEvents(params) {
	let query = supabase.from("events").select("*");
	if (params?.search) query = query.or(`title.ilike.%${params.search}%,summary.ilike.%${params.search}%`);
	if (params?.category && params.category !== "all") query = query.eq("category", params.category);
	if (params?.type && params.type !== "all") query = query.eq("event_type", params.type);
	if (params?.sort === "popular") query = query.order("participant_count", { ascending: false });
	else if (params?.sort === "latest") query = query.order("created_at", { ascending: false });
	else query = query.order("starts_at", { ascending: true });
	if (params?.limit) query = query.limit(params.limit);
	const { data, error } = await query;
	if (error) throw error;
	return data ?? [];
}
async function fetchEventBySlug(slug) {
	const { data, error } = await supabase.from("events").select("*, event_speakers(*)").eq("slug", slug).maybeSingle();
	if (error) throw error;
	return data ?? null;
}
async function fetchPosts(params) {
	let query = supabase.from("posts").select("*, profiles:author_id(*)");
	if (params?.search) query = query.ilike("content", `%${params.search}%`);
	if (params?.type && params.type !== "all") query = query.eq("post_type", params.type);
	if (params?.tag) query = query.contains("tags", [params.tag]);
	if (params?.authorId) query = query.eq("author_id", params.authorId);
	query = params?.sort === "popular" ? query.order("like_count", { ascending: false }) : query.order("created_at", { ascending: false });
	if (params?.limit) query = query.limit(params.limit);
	const { data, error } = await query;
	if (error) throw error;
	return data ?? [];
}
async function fetchComments(postId) {
	const { data, error } = await supabase.from("comments").select("*, profiles:author_id(*)").eq("post_id", postId).order("created_at", { ascending: true });
	if (error) throw error;
	return data ?? [];
}
async function fetchResources(params) {
	let query = supabase.from("learning_resources").select("*");
	if (params?.search) query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`);
	if (params?.category && params.category !== "all") query = query.eq("category", params.category);
	if (params?.difficulty && params.difficulty !== "all") query = query.eq("difficulty", params.difficulty);
	query = query.order("created_at", { ascending: true });
	if (params?.limit) query = query.limit(params.limit);
	const { data, error } = await query;
	if (error) throw error;
	return data ?? [];
}
async function fetchProfiles(params) {
	let query = supabase.from("profiles").select("*");
	if (params?.search) query = query.or(`full_name.ilike.%${params.search}%,username.ilike.%${params.search}%`);
	query = query.order("created_at", { ascending: true });
	if (params?.limit) query = query.limit(params.limit);
	const { data, error } = await query;
	if (error) throw error;
	return data ?? [];
}
async function fetchProfileByUsername(username) {
	const { data, error } = await supabase.from("profiles").select("*").eq("username", username).maybeSingle();
	if (error) throw error;
	return data ?? null;
}
async function fetchInterests() {
	const { data, error } = await supabase.from("interests").select("*").order("name");
	if (error) throw error;
	return data ?? [];
}
async function fetchUserInterests(userId) {
	const { data, error } = await supabase.from("user_interests").select("interests(*)").eq("user_id", userId);
	if (error) throw error;
	return (data ?? []).map((row) => row.interests).filter(Boolean);
}
async function saveUserInterests(userId, interestIds) {
	const { error: deleteError } = await supabase.from("user_interests").delete().eq("user_id", userId);
	if (deleteError) throw deleteError;
	if (interestIds.length === 0) return;
	const { error } = await supabase.from("user_interests").insert(interestIds.map((interest_id) => ({
		user_id: userId,
		interest_id
	})));
	if (error) throw error;
}
async function fetchNotifications(userId) {
	const { data, error } = await supabase.from("notifications").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(50);
	if (error) throw error;
	return data ?? [];
}
async function fetchFollowCounts(userId) {
	const [{ count: followers }, { count: following }] = await Promise.all([supabase.from("follows").select("*", {
		count: "exact",
		head: true
	}).eq("following_id", userId), supabase.from("follows").select("*", {
		count: "exact",
		head: true
	}).eq("follower_id", userId)]);
	return {
		followers: followers ?? 0,
		following: following ?? 0
	};
}
//#endregion
export { fetchInterests as a, fetchProfileByUsername as c, fetchUserInterests as d, saveUserInterests as f, fetchFollowCounts as i, fetchProfiles as l, fetchEventBySlug as n, fetchNotifications as o, fetchEvents as r, fetchPosts as s, fetchComments as t, fetchResources as u };
