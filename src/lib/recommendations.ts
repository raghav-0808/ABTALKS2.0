import type { AbEvent, LearningResource, Post, Profile } from "@/lib/types";

/**
 * Lightweight, transparent recommendation engine.
 *
 * Every recommendation is a weighted score built from signals we already store:
 *   - the interests a member picked during onboarding
 *   - the categories/tags of the content
 *   - popularity and recency
 *
 * The scoring functions are deliberately pure so they can later be swapped for
 * a trained model without touching any UI code.
 */

export interface Scored<T> {
  item: T;
  score: number;
  reason: string;
}

function normalise(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function overlap(interests: string[], candidates: string[]) {
  const set = new Set(interests.map(normalise));
  return candidates.filter((candidate) => set.has(normalise(candidate)));
}

export function rankEvents(
  events: AbEvent[],
  interests: string[],
  limit = 4,
): Scored<AbEvent>[] {
  const now = Date.now();
  return events
    .map((event) => {
      const matches = overlap(interests, [event.category, ...event.tags]);
      const daysAway = Math.max(
        1,
        (new Date(event.starts_at).getTime() - now) / (1000 * 60 * 60 * 24),
      );
      const score =
        matches.length * 10 + Math.min(event.participant_count, 200) / 40 + 12 / daysAway;
      return {
        item: event,
        score,
        reason: matches.length
          ? `Matches your interest in ${matches[0]}`
          : "Popular with the community",
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function rankResources(
  resources: LearningResource[],
  interests: string[],
  limit = 4,
): Scored<LearningResource>[] {
  return resources
    .map((resource) => {
      const matches = overlap(interests, [resource.category, resource.technology]);
      const difficultyBoost =
        resource.difficulty === "beginner" ? 2 : resource.difficulty === "intermediate" ? 1 : 0;
      return {
        item: resource,
        score: matches.length * 10 + difficultyBoost,
        reason: matches.length
          ? `Because you follow ${matches[0]}`
          : "A community favourite to start with",
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function rankPosts(posts: Post[], interests: string[], limit = 5): Scored<Post>[] {
  return posts
    .map((post) => {
      const matches = overlap(interests, post.tags);
      const ageHours = (Date.now() - new Date(post.created_at).getTime()) / 3_600_000;
      return {
        item: post,
        score: matches.length * 8 + post.like_count * 0.5 + Math.max(0, 48 - ageHours) / 10,
        reason: matches.length ? `Tagged ${matches[0]}` : "Trending in the community",
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function rankPeople(
  people: Profile[],
  interests: string[],
  excludeId?: string,
  limit = 4,
): Scored<Profile>[] {
  return people
    .filter((person) => person.id !== excludeId)
    .map((person) => {
      const matches = overlap(interests, person.skills);
      return {
        item: person,
        score: matches.length * 10 + person.skills.length * 0.2,
        reason: matches.length ? `Works with ${matches[0]}` : "Active community member",
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
