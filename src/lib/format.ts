import { format, formatDistanceToNow, isPast } from "date-fns";

export function formatEventDate(iso: string) {
  return format(new Date(iso), "EEE, d MMM yyyy");
}

export function formatEventTime(iso: string) {
  return format(new Date(iso), "h:mm a");
}

export function formatRelative(iso: string) {
  return formatDistanceToNow(new Date(iso), { addSuffix: true });
}

export function isPastDate(iso: string) {
  return isPast(new Date(iso));
}

export function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.round((minutes / 60) * 10) / 10;
  if (hours < 24) return `${hours} hr`;
  return `${Math.round(hours / 8)} days of study`;
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function greeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
