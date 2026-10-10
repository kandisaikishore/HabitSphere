import type { DateKey, Habit } from "./types";
import { currentStreak, longestStreak } from "./streaks";

interface Props {
  habit: Habit;
  doneDates: DateKey[];
  week: DateKey[];
  today: DateKey;
  onToggleToday: () => void;
  onDelete: () => void;
}

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export function HabitCard({ habit, doneDates, week, today, onToggleToday, onDelete }: Props) {
  const done = new Set(doneDates);
  const isDoneToday = done.has(today);

  return (
    <li className="card">
      <div className="card-top">
        <button
          className={\`check \${isDoneToday ? "on" : ""}\`}
          onClick={onToggleToday}
          aria-pressed={isDoneToday}
          aria-label={\`\${habit.name}: \${isDoneToday ? "done" : "not done"} today\`}
        >
          {isDoneToday ? "✓" : ""}
        </button>
        <div className="card-info">
          <h3>{habit.icon} {habit.name}</h3>
          <p className="streaks">🔥 {currentStreak(doneDates, today)} day streak · best {longestStreak(doneDates)}</p>
        </div>
        <button className="delete" aria-label={\`Delete \${habit.name}\`} onClick={() => { if (window.confirm(\`Delete "\${habit.name}" and its history?\`)) onDelete(); }}>✕</button>
      </div>
      <div className="week" aria-label="This week">
        {week.map((date, i) => <div key={date} className="day"><span className="day-label">{DAY_LABELS[i]}</span><span className={\`dot \${done.has(date) ? "filled" : ""} \${date === today ? "today" : ""}\`}/></div>)}
      </div>
    </li>
  );
}
