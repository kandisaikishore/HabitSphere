import { describe, expect, it } from "vitest";
import { addDays, toLocalDateKey, weekDates } from "./dates";
import { currentStreak, longestStreak, weeklyCompletion } from "./streaks";

describe("toLocalDateKey", () => {
  it("uses local calendar parts, not UTC", () => {
    expect(toLocalDateKey(new Date(2026, 9, 10, 23, 30))).toBe("2026-10-10");
    expect(toLocalDateKey(new Date(2026, 9, 11, 0, 30))).toBe("2026-10-11");
  });
});

describe("addDays", () => {
  it("rolls over month and year boundaries", () => {
    expect(addDays("2026-10-31", 1)).toBe("2026-11-01");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });
});

describe("weekDates", () => {
  it("returns Monday to Sunday", () => {
    // 2026-10-10 is a Saturday
    expect(weekDates("2026-10-10")).toEqual([
      "2026-10-05", "2026-10-06", "2026-10-07", "2026-10-08",
      "2026-10-09", "2026-10-10", "2026-10-11",
    ]);
  });
  it("treats Sunday as the end of the week", () => {
    expect(weekDates("2026-10-11")[0]).toBe("2026-10-05");
  });
});

describe("currentStreak", () => {
  const today = "2026-10-10";
  it("is 0 with no logs", () => {
    expect(currentStreak([], today)).toBe(0);
  });
  it("is 1 when only today is logged", () => {
    expect(currentStreak([today], today)).toBe(1);
  });
  it("keeps the streak when today is still open", () => {
    expect(currentStreak(["2026-10-08", "2026-10-09"], today)).toBe(2);
  });
  it("counts today when it is done", () => {
    expect(currentStreak(["2026-10-08", "2026-10-09", today], today)).toBe(3);
  });
  it("resets after a missed past day", () => {
    expect(currentStreak(["2026-10-07", "2026-10-08"], today)).toBe(0);
  });
  it("stops at a gap in the middle", () => {
    expect(currentStreak(["2026-10-06", "2026-10-08", "2026-10-09", today], today)).toBe(3);
  });
  it("does not double-count duplicates", () => {
    expect(currentStreak([today, today, "2026-10-09"], today)).toBe(2);
  });
  it("counts across a month boundary", () => {
    expect(currentStreak(["2026-10-30", "2026-10-31", "2026-11-01"], "2026-11-01")).toBe(3);
  });
});

describe("longestStreak", () => {
  it("is 0 with no logs", () => {
    expect(longestStreak([])).toBe(0);
  });
  it("handles unsorted input", () => {
    expect(longestStreak(["2026-10-09", "2026-10-07", "2026-10-08"])).toBe(3);
  });
  it("keeps the best run after the current one breaks", () => {
    const logs = ["2026-10-01", "2026-10-02", "2026-10-03", "2026-10-08"];
    expect(longestStreak(logs)).toBe(3);
  });
  it("ignores duplicates", () => {
    expect(longestStreak(["2026-10-01", "2026-10-01"])).toBe(1);
  });
});

describe("weeklyCompletion", () => {
  const week = weekDates("2026-10-08"); // Thursday
  it("counts only days up to today", () => {
    // Mon-Thu elapsed (4 days), 2 done
    expect(weeklyCompletion(["2026-10-05", "2026-10-08"], week, "2026-10-08")).toBe(50);
  });
  it("is 0 with no logs", () => {
    expect(weeklyCompletion([], week, "2026-10-08")).toBe(0);
  });
});
