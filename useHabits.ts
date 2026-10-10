import { useCallback, useEffect, useState } from "react";
import type { AppData, DateKey } from "./types";
import { addDays, toLocalDateKey } from "./dates";
import { loadData, saveData } from "./storage";

const MAX_NAME_LENGTH = 40;

type DemoSeedHabit = { id: string; name: string; icon: string; streak: number; doneToday: boolean; olderCadence: number };
const DEMO_HABITS: DemoSeedHabit[] = [
  { id: "demo-morning-exercise", name: "Morning Exercise", icon: "🏋️", streak: 12, doneToday: true, olderCadence: 2 },
  { id: "demo-read-book", name: "Read a Book", icon: "📖", streak: 8, doneToday: true, olderCadence: 2 },
  { id: "demo-drink-water", name: "Drink Water", icon: "💧", streak: 5, doneToday: false, olderCadence: 3 },
  { id: "demo-learn-java", name: "Learn Java", icon: "💻", streak: 10, doneToday: false, olderCadence: 3 },
  { id: "demo-meditate", name: "Meditate", icon: "🧘", streak: 3, doneToday: true, olderCadence: 3 },
  { id: "demo-plan-tomorrow", name: "Plan Tomorrow", icon: "🎯", streak: 4, doneToday: true, olderCadence: 4 },
];

/** Seed a useful, editable first-run workspace so the dashboard matches the product preview. */
function initialData(): AppData {
  const saved = loadData();
  if (saved.habits.length || saved.logs.length) return saved;
  try {
    // Never seed over an existing (even malformed) saved record or when browser storage is unavailable.
    if (localStorage.getItem("habitsphere:v1") !== null) return saved;
  } catch {
    return saved;
  }
  const today = toLocalDateKey();
  const habits = DEMO_HABITS.map(({ id, name, icon }) => ({ id, name, icon, createdAt: today }));
  const logs: AppData["logs"] = [];
  for (const habit of DEMO_HABITS) {
    const streakStart = habit.doneToday ? -(habit.streak - 1) : -habit.streak;
    for (let offset = -27; offset <= 0; offset += 1) {
      const inStreak = offset >= streakStart && (habit.doneToday || offset < 0);
      const olderSample = offset < streakStart && Math.abs(offset) % habit.olderCadence === 0;
      const completed = inStreak || olderSample || (habit.doneToday && offset === 0);
      if (completed) {
        const date = addDays(today, offset);
        logs.push({ id: `${habit.id}-${date}`, habitId: habit.id, date });
      }
    }
  }
  return { habits, logs };
}

export function useHabits() {
  const [data, setData] = useState<AppData>(initialData);
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
