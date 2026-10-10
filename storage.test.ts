import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { loadData, saveData } from "./storage";
import type { AppData } from "./types";

const KEY = "habitsphere:v1";
const sample: AppData = {
  habits: [{ id: "h1", name: "Read", icon: "📚", createdAt: "2026-10-10" }],
  logs: [{ id: "l1", habitId: "h1", date: "2026-10-10" }],
};

describe("storage", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it("returns empty data when no saved record exists", () => {
    expect(loadData()).toEqual({ habits: [], logs: [] });
  });

  it("round-trips saved data", () => {
    saveData(sample);
    expect(JSON.parse(localStorage.getItem(KEY) || "null")).toEqual(sample);
    expect(loadData()).toEqual(sample);
  });

  it("recovers from malformed JSON", () => {
    localStorage.setItem(KEY, "{broken");
    expect(loadData()).toEqual({ habits: [], logs: [] });
  });

  it("rejects a parsed object without habit and log arrays", () => {
    localStorage.setItem(KEY, JSON.stringify({ habits: {}, logs: [] }));
    expect(loadData()).toEqual({ habits: [], logs: [] });
  });

  it("keeps working if localStorage writes fail", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("storage blocked");
    });
    expect(() => saveData(sample)).not.toThrow();
  });

  it("keeps working if localStorage reads fail", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage blocked");
    });
    expect(loadData()).toEqual({ habits: [], logs: [] });
  });
});
