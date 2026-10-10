import { useHabits } from "./hooks/useHabits";
import { toLocalDateKey, weekDates } from "./lib/dates";
import { weeklyCompletion } from "./lib/streaks";
import { AddHabitForm } from "./components/AddHabitForm";
import { HabitCard } from "./components/HabitCard";

export default function App() {
  const { habits, logs, addHabit, deleteHabit, toggleDay } = useHabits();
  const today = toLocalDateKey();
  const week = weekDates(today);

  const datesFor = (habitId: string) =>
    logs.filter((l) => l.habitId === habitId).map((l) => l.date);

  const doneToday = habits.filter((h) => datesFor(h.id).includes(today)).length;
  const weeklyAverage =
    habits.length === 0
      ? 0
      : Math.round(
          habits.reduce((sum, h) => sum + weeklyCompletion(datesFor(h.id), week, today), 0) /
            habits.length,
        );

  return (
    <main className="app">
      <header>
        <h1>HabitSphere</h1>
        {habits.length > 0 && (
          <p className="summary">
            {doneToday} of {habits.length} done today · {weeklyAverage}% this week
          </p>
        )}
      </header>

      <AddHabitForm onAdd={(name) => addHabit(name)} />

      {habits.length === 0 ? (
        <p className="empty">No habits yet. Add one above and tap to check it off.</p>
      ) : (
        <ul className="list">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              doneDates={datesFor(habit.id)}
              week={week}
              today={today}
              onToggleToday={() => toggleDay(habit.id, today)}
              onDelete={() => deleteHabit(habit.id)}
            />
          ))}
        </ul>
      )}
    </main>
  );
}
