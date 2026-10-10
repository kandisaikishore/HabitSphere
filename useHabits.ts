import { useCallback, useEffect, useState } from "react";
import type { AppData, DateKey } from "./types";
import { toLocalDateKey } from "./dates";
import { loadData, saveData } from "./storage";

const MAX_NAME_LENGTH = 40;

export function useHabits() {
  const [data, setData] = useState<AppData>(loadData);
  useEffect(() => { saveData(data); }, [data]);

  const addHabit = useCallback((rawName: string, icon = "✨"): string | null => {
    const name = rawName.trim();
    if (!name) return "Give your habit a name.";
    if (name.length > MAX_NAME_LENGTH) return `Keep it under ${MAX_NAME_LENGTH} characters.`;
    if (data.habits.some((habit) => habit.name.toLowerCase() === name.toLowerCase())) return "You already have that habit.";
    setData((previous) => ({ ...previous, habits: [...previous.habits, { id: crypto.randomUUID(), name, icon, createdAt: toLocalDateKey() }] }));
    return null;
  }, [data.habits]);

  const deleteHabit = useCallback((habitId: string) => {
    setData((previous) => ({ habits: previous.habits.filter((habit) => habit.id !== habitId), logs: previous.logs.filter((log) => log.habitId !== habitId) }));
  }, []);

  const toggleDay = useCallback((habitId: string, date: DateKey = toLocalDateKey()) => {
    setData((previous) => {
      const exists = previous.logs.some((log) => log.habitId === habitId && log.date === date);
      return { ...previous, logs: exists ? previous.logs.filter((log) => !(log.habitId === habitId && log.date === date)) : [...previous.logs, { id: crypto.randomUUID(), habitId, date }] };
    });
  }, []);

  return { habits: data.habits, logs: data.logs, addHabit, deleteHabit, toggleDay };
}
