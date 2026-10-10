import type { DateKey } from "./types";
import { addDays, toLocalDateKey } from "./dates";

export function currentStreak(doneDates: DateKey[], today: DateKey = toLocalDateKey()): number {
  const done = new Set(doneDates);
  let cursor = done.has(today) ? today : addDays(today, -1);
  let streak = 0;
  while (done.has(cursor)) { streak++; cursor = addDays(cursor, -1); }
  return streak;
}

export function longestStreak(doneDates: DateKey[]): number {
  const sorted = [...new Set(doneDates)].sort();
  let best = 0;
  let run = 0;
  let previous: DateKey | null = null;
  for (const date of sorted) {
    run = previous !== null && addDays(previous, 1) === date ? run + 1 : 1;
    best = Math.max(best, run);
    previous = date;
  }
  return best;
}

export function weeklyCompletion(doneDates: DateKey[], week: DateKey[], today: DateKey = toLocalDateKey()): number {
  const done = new Set(doneDates);
  const elapsed = week.filter((date) => date <= today);
  if (!elapsed.length) return 0;
  return Math.round((elapsed.filter((date) => done.has(date)).length / elapsed.length) * 100);
}
