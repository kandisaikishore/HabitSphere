import type { DateKey } from "../types";
import { addDays, toLocalDateKey } from "./dates";

/**
 * Current streak: consecutive done days ending today.
 * Today is "still open": if it is not done yet, start counting from yesterday.
 */
export function currentStreak(
  doneDates: DateKey[],
  today: DateKey = toLocalDateKey(),
): number {
  const done = new Set(doneDates);
  let cursor = done.has(today) ? today : addDays(today, -1);
  let streak = 0;

  while (done.has(cursor)) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

/** Longest run of consecutive done days. Ignores duplicates and input order. */
export function longestStreak(doneDates: DateKey[]): number {
  const sorted = [...new Set(doneDates)].sort();
  let best = 0;
  let run = 0;
  let prev: DateKey | null = null;

  for (const date of sorted) {
    run = prev !== null && addDays(prev, 1) === date ? run + 1 : 1;
    best = Math.max(best, run);
    prev = date;
  }
  return best;
}

/** Percent (0-100) of days done, counting only days up to and including today. */
export function weeklyCompletion(
  doneDates: DateKey[],
  week: DateKey[],
  today: DateKey = toLocalDateKey(),
): number {
  const done = new Set(doneDates);
  const elapsed = week.filter((d) => d <= today);
  if (elapsed.length === 0) return 0;
  const doneCount = elapsed.filter((d) => done.has(d)).length;
  return Math.round((doneCount / elapsed.length) * 100);
}
