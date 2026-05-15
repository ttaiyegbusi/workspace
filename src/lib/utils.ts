import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
  return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase();
}

export function timeAgo(dateISO: string) {
  const date = new Date(dateISO);
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDate(dateISO: string) {
  return new Date(dateISO).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(dateISO: string) {
  return new Date(dateISO).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Strict validation: the domain part of the email must equal "gmail.com".
 * Per the share modal's requirement: the Share CTA stays disabled until
 * the address is a Gmail address.
 *
 * Examples:
 *   tope@gmail.com         → true
 *   tope@gmail.co          → false
 *   tope@gmail.com.uk      → false (domain is "gmail.com.uk", not "gmail.com")
 *   tope@notgmail.com      → false (domain is "notgmail.com")
 *   not.an.email           → false
 */
export function isGmail(email: string): boolean {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) return false;
  const at = trimmed.lastIndexOf("@");
  if (at <= 0 || at === trimmed.length - 1) return false;
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  if (!local || domain !== "gmail.com") return false;
  // Local part can't contain whitespace
  if (/\s/.test(local)) return false;
  return true;
}
