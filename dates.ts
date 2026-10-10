import type { DateKey } from "./types";

/** Build a YYYY-MM-DD key from local calendar fields, not UTC. */
export function toLocalDateKey(date: Date = new Date()): DateKey {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function addDays(dateKey: DateKey, amount: number): DateKey {
  const [year, month, day] = dateKey.split("-").map(Number);
  return toLocalDateKey(new Date(year, month - 1, day + amount));
}

export function weekDates(today: DateKey = toLocalDateKey()): DateKey[] {
  const [year, month, day] = today.split("-").map(Number);
  const dayOfWeek = new Date(year, month - 1, day).getDay();
  const monday = addDays(today, -((dayOfWeek + 6) % 7));
  return Array.from({ length: 7 }, (_, index) => addDays(monday, index));
}
