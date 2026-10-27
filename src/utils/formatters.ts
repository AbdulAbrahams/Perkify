import type { LoyaltyTransaction } from "../types/models";

export function getInitials(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "?";
}

export function getFirstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || "there";
}

export function formatTransactionDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const dayLabel = isToday
    ? "Today"
    : date.toDateString() === yesterday.toDateString()
      ? "Yesterday"
      : new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date);
  const time = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(date);
  return `${dayLabel} · ${time}`;
}

export function formatPoints(value: number): string {
  return `${value > 0 ? "+" : ""}${value.toLocaleString()} pts`;
}

export function getTransactionTone(transaction: LoyaltyTransaction): "positive" | "negative" {
  return transaction.pointsDelta >= 0 ? "positive" : "negative";
}
