export type EventType = "hackathon" | "workshop" | "talk" | "webinar" | "meetup";
export type Difficulty = "beginner" | "intermediate" | "advanced";
export type PostType =
  | "discussion"
  | "question"
  | "project"
  | "achievement"
  | "learning"
  | "event";
export type BookmarkItemType = "event" | "post" | "resource";

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  headline: string | null;
  location: string | null;
  skills: string[];
  github_url: string | null;
  website_url: string | null;
  created_at: string;
}

export interface Interest {
  id: string;
  slug: string;
  name: string;
  category: string;
}

export interface AgendaItem {
  time: string;
  title: string;
}

export interface EventSpeaker {
  id: string;
  event_id: string;
  name: string;
  title: string;
  avatar_url: string | null;
}

export interface AbEvent {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: string;
  event_type: EventType;
  banner_url: string | null;
  starts_at: string;
  ends_at: string;
  location: string;
  is_online: boolean;
  organizer: string;
  capacity: number;
  participant_count: number;
  tags: string[];
  agenda: AgendaItem[];
  requirements: string[];
  created_at: string;
}

export interface EventWithSpeakers extends AbEvent {
  event_speakers: EventSpeaker[];
}

export interface Post {
  id: string;
  author_id: string;
  title: string | null;
  content: string;
  post_type: PostType;
  tags: string[];
  like_count: number;
  comment_count: number;
  created_at: string;
  profiles?: Profile | null;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  profiles?: Profile | null;
}

export interface LearningResource {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: string;
  technology: string;
  estimated_minutes: number;
  resource_type: string;
  url: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export interface ChatThread {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}
