import type { AppData } from "../types";

const STORAGE_KEY = "habitsphere:v1";
const EMPTY: AppData = { habits: [], logs: [] };

function isAppData(value: unknown): value is AppData {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return Array.isArray(v.habits) && Array.isArray(v.logs);
}

/** Safe load: returns empty data if storage is missing, blocked, or corrupted. */
export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    return isAppData(parsed) ? parsed : EMPTY;
  } catch {
    return EMPTY;
  }
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or blocked. The app keeps working in memory.
  }
}
