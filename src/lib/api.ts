import { supabase } from "@/integrations/supabase/client";
import type {
  AbEvent,
  Comment,
  EventWithSpeakers,
  Interest,
  LearningResource,
  Notification,
  Post,
  Profile,
} from "@/lib/types";

/** Central data-access layer. Every page reads the database through these helpers. */

export async function fetchEvents(params?: {
  search?: string;
  category?: string;
  type?: string;
  sort?: "soonest" | "popular" | "latest";
  limit?: number;
}): Promise<AbEvent[]> {
  let query = supabase.from("events").select("*");
  if (params?.search) {
    query = query.or(`title.ilike.%${params.search}%,summary.ilike.%${params.search}%`);
  }
  if (params?.category && params.category !== "all") query = query.eq("category", params.category);
  if (params?.type && params.type !== "all") query = query.eq("event_type", params.type);

  if (params?.sort === "popular") query = query.order("participant_count", { ascending: false });
  else if (params?.sort === "latest") query = query.order("created_at", { ascending: false });
  else query = query.order("starts_at", { ascending: true });

  if (params?.limit) query = query.limit(params.limit);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as AbEvent[];
}

export async function fetchEventBySlug(slug: string): Promise<EventWithSpeakers | null> {
  const { data, error } = await supabase
    .from("events")
    .select("*, event_speakers(*)")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as EventWithSpeakers | null) ?? null;
}

export async function fetchPosts(params?: {
  search?: string;
  type?: string;
  tag?: string;
  authorId?: string;
  sort?: "latest" | "popular";
  limit?: number;
}): Promise<Post[]> {
  let query = supabase.from("posts").select("*, profiles:author_id(*)");
  if (params?.search) query = query.ilike("content", `%${params.search}%`);
  if (params?.type && params.type !== "all") query = query.eq("post_type", params.type);
  if (params?.tag) query = query.contains("tags", [params.tag]);
  if (params?.authorId) query = query.eq("author_id", params.authorId);
  query =
    params?.sort === "popular"
      ? query.order("like_count", { ascending: false })
      : query.order("created_at", { ascending: false });
  if (params?.limit) query = query.limit(params.limit);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Post[];
}

export async function fetchComments(postId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("*, profiles:author_id(*)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Comment[];
}

export async function fetchResources(params?: {
  search?: string;
  category?: string;
  difficulty?: string;
  limit?: number;
}): Promise<LearningResource[]> {
  let query = supabase.from("learning_resources").select("*");
  if (params?.search) {
    query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`);
  }
  if (params?.category && params.category !== "all") query = query.eq("category", params.category);
  if (params?.difficulty && params.difficulty !== "all") {
    query = query.eq("difficulty", params.difficulty);
  }
  query = query.order("created_at", { ascending: true });
  if (params?.limit) query = query.limit(params.limit);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as LearningResource[];
}

export async function fetchProfiles(params?: { search?: string; limit?: number }): Promise<Profile[]> {
  let query = supabase.from("profiles").select("*");
  if (params?.search) {
    query = query.or(`full_name.ilike.%${params.search}%,username.ilike.%${params.search}%`);
  }
  query = query.order("created_at", { ascending: true });
  if (params?.limit) query = query.limit(params.limit);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Profile[];
}

export async function fetchProfileByUsername(username: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();
  if (error) throw error;
  return (data as Profile | null) ?? null;
}

export async function fetchInterests(): Promise<Interest[]> {
  const { data, error } = await supabase.from("interests").select("*").order("name");
  if (error) throw error;
  return (data ?? []) as Interest[];
}

export async function fetchUserInterests(userId: string): Promise<Interest[]> {
  const { data, error } = await supabase
    .from("user_interests")
    .select("interests(*)")
    .eq("user_id", userId);
  if (error) throw error;
  return ((data ?? []) as { interests: Interest }[]).map((row) => row.interests).filter(Boolean);
}

export async function saveUserInterests(userId: string, interestIds: string[]) {
  const { error: deleteError } = await supabase
    .from("user_interests")
    .delete()
    .eq("user_id", userId);
  if (deleteError) throw deleteError;
  if (interestIds.length === 0) return;
  const { error } = await supabase
    .from("user_interests")
    .insert(interestIds.map((interest_id) => ({ user_id: userId, interest_id })));
  if (error) throw error;
}

export async function fetchNotifications(userId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data ?? []) as Notification[];
}

export async function createNotification(input: {
  userId: string;
  type: string;
  title: string;
  body?: string;
  link?: string;
}) {
  await supabase.from("notifications").insert({
    user_id: input.userId,
    type: input.type,
    title: input.title,
    body: input.body ?? null,
    link: input.link ?? null,
  });
}

export async function fetchFollowCounts(userId: string) {
  const [{ count: followers }, { count: following }] = await Promise.all([
    supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("following_id", userId),
    supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", userId),
  ]);
  return { followers: followers ?? 0, following: following ?? 0 };
}
