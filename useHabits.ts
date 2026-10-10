import { useCallback, useEffect, useState } from "react";
import type { AppData, DateKey } from "../types";
import { toLocalDateKey } from "../lib/dates";
import { loadData, saveData } from "../lib/storage";

const MAX_NAME_LENGTH = 40;

export function useHabits() {
  const [data, setData] = useState<AppData>(loadData);

  useEffect(() => {
    saveData(data);
  }, [data]);

  /** Returns an error message, or null on success. */
  const addHabit = useCallback(
    (rawName: string, icon = "✨"): string | null => {
      const name = rawName.trim();
      if (!name) return "Give your habit a name.";
      if (name.length > MAX_NAME_LENGTH) return `Keep it under ${MAX_NAME_LENGTH} characters.`;
      if (data.habits.some((h) => h.name.toLowerCase() === name.toLowerCase())) {
        return "You already have that habit.";
      }
      setData((prev) => ({
        ...prev,
        habits: [
          ...prev.habits,
          { id: crypto.randomUUID(), name, icon, createdAt: toLocalDateKey() },
        ],
      }));
      return null;
    },
    [data.habits],
  );

  /** Deleting a habit also deletes its logs (no orphans). */
  const deleteHabit = useCallback((habitId: string) => {
    setData((prev) => ({
      habits: prev.habits.filter((h) => h.id !== habitId),
      logs: prev.logs.filter((l) => l.habitId !== habitId),
    }));
  }, []);

  /** Check or uncheck a day. One log per habit per date, never duplicated. */
  const toggleDay = useCallback((habitId: string, date: DateKey = toLocalDateKey()) => {
    setData((prev) => {
      const exists = prev.logs.some((l) => l.habitId === habitId && l.date === date);
      return {
        ...prev,
        logs: exists
          ? prev.logs.filter((l) => !(l.habitId === habitId && l.date === date))
          : [...prev.logs, { id: crypto.randomUUID(), habitId, date }],
      };
    });
  }, []);

  return { habits: data.habits, logs: data.logs, addHabit, deleteHabit, toggleDay };
}
