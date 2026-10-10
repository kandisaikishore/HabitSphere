import type { DateKey } from "../types";

/** Build a YYYY-MM-DD string from LOCAL date parts. Never use toISOString() for habit dates. */
export function toLocalDateKey(date: Date = new Date()): DateKey {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Move a date key by n calendar days. Uses calendar math, so DST is safe. */
export function addDays(dateKey: DateKey, n: number): DateKey {
  const [y, m, d] = dateKey.split("-").map(Number);
  return toLocalDateKey(new Date(y, m - 1, d + n));
}

/** The 7 date keys of the week (Monday to Sunday) that contains `today`. */
export function weekDates(today: DateKey = toLocalDateKey()): DateKey[] {
  const [y, m, d] = today.split("-").map(Number);
  const dayOfWeek = new Date(y, m - 1, d).getDay(); // 0 = Sunday
  const offsetToMonday = (dayOfWeek + 6) % 7;
  const monday = addDays(today, -offsetToMonday);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}
