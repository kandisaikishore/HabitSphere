import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadData, saveData } from "./storage";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(String(key), String(value)); }
}

const KEY = "habitsphere:v1";
const storage = new MemoryStorage();

describe("compatibility and persisted-data resilience", () => {
  beforeEach(() => {
    storage.clear();
    vi.stubGlobal("localStorage", storage);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("drops logs for deleted habits and deduplicates same-day check-ins", () => {
    storage.setItem(KEY, JSON.stringify({
      habits: [{ id: "habit-1", name: "Read", icon: "📚", createdAt: "2026-10-01" }],
      logs: [
        { id: "log-1", habitId: "habit-1", date: "2026-10-10" },
        { id: "log-2", habitId: "habit-1", date: "2026-10-10" },
        { id: "log-3", habitId: "deleted-habit", date: "2026-10-10" },
      ],
    }));

    const data = loadData();
    expect(data.logs).toHaveLength(1);
    expect(data.logs[0]).toMatchObject({ habitId: "habit-1", date: "2026-10-10" });
  });

  it("does not throw when localStorage is missing", () => {
    vi.stubGlobal("localStorage", undefined);
    expect(loadData()).toEqual({ habits: [], logs: [] });
    expect(() => saveData({ habits: [], logs: [] })).not.toThrow();
  });

  it("rejects logs with malformed date keys", () => {
    storage.setItem(KEY, JSON.stringify({
      habits: [{ id: "habit-1", name: "Read", icon: "📚", createdAt: "2026-10-01" }],
      logs: [{ id: "log-1", habitId: "habit-1", date: "not-a-date" }],
    }));
    expect(loadData().logs).toEqual([]);
  });
});
