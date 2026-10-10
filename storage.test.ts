import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { loadData, saveData } from "./storage";
import type { AppData } from "./types";

// Vitest is configured to use the Node environment. Provide a small Storage
// implementation so storage logic can be tested without adding jsdom.
class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.has(key) ? this.values.get(key)! : null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(String(key), String(value)); }
}

const KEY = "habitsphere:v1";
const memoryStorage = new MemoryStorage();
const sample: AppData = {
  habits: [{ id: "h1", name: "Read", icon: "📚", createdAt: "2026-10-10" }],
  logs: [{ id: "l1", habitId: "h1", date: "2026-10-10" }],
};

describe("storage", () => {
  beforeEach(() => {
    memoryStorage.clear();
    vi.stubGlobal("localStorage", memoryStorage);
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("returns empty data when no saved record exists", () => {
    expect(loadData()).toEqual({ habits: [], logs: [] });
  });

  it("round-trips saved data", () => {
    saveData(sample);
    expect(JSON.parse(memoryStorage.getItem(KEY) || "null")).toEqual(sample);
    expect(loadData()).toEqual(sample);
  });

  it("recovers from malformed JSON", () => {
    memoryStorage.setItem(KEY, "{broken");
    expect(loadData()).toEqual({ habits: [], logs: [] });
  });

  it("rejects a parsed object without habit and log arrays", () => {
    memoryStorage.setItem(KEY, JSON.stringify({ habits: {}, logs: [] }));
    expect(loadData()).toEqual({ habits: [], logs: [] });
  });

  it("keeps working if storage writes fail", () => {
    vi.spyOn(memoryStorage, "setItem").mockImplementation(() => {
      throw new Error("storage blocked");
    });
    expect(() => saveData(sample)).not.toThrow();
  });

  it("keeps working if storage reads fail", () => {
    vi.spyOn(memoryStorage, "getItem").mockImplementation(() => {
      throw new Error("storage blocked");
    });
    expect(loadData()).toEqual({ habits: [], logs: [] });
  });
});
