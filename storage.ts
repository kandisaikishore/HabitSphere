import type { AppData } from "./types";

const STORAGE_KEY = "habitsphere:v1";

function isAppData(value: unknown): value is AppData {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  if (!Array.isArray(candidate.habits) || !Array.isArray(candidate.logs)) return false;
  const habitsValid = candidate.habits.every((habit) => {
    if (typeof habit !== "object" || habit === null) return false;
    const item = habit as Record<string, unknown>;
    return typeof item.id === "string" && typeof item.name === "string" && typeof item.icon === "string" && typeof item.createdAt === "string";
  });
  const logsValid = candidate.logs.every((log) => {
    if (typeof log !== "object" || log === null) return false;
    const item = log as Record<string, unknown>;
    return typeof item.id === "string" && typeof item.habitId === "string" && typeof item.date === "string";
  });
  return habitsValid && logsValid;
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { habits: [], logs: [] };
    const parsed: unknown = JSON.parse(raw);
    if (!isAppData(parsed)) return { habits: [], logs: [] };
    const validHabitIds = new Set(parsed.habits.map((habit) => habit.id));
    const uniqueLogs = new Map<string, AppData["logs"][number]>();
    for (const log of parsed.logs) {
      if (!validHabitIds.has(log.habitId) || !/^\d{4}-\d{2}-\d{2}$/.test(log.date)) continue;
      uniqueLogs.set(`${log.habitId}:${log.date}`, log);
    }
    return { habits: parsed.habits, logs: [...uniqueLogs.values()] };
  } catch {
    return { habits: [], logs: [] };
  }
}

export function saveData(data: AppData): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* Browser storage may be blocked or full. */ }
}
