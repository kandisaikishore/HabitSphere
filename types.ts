/** A date string in local time, e.g. "2026-10-10". Never UTC. */
export type DateKey = string;

export interface Habit {
  id: string;
  name: string;
  icon: string;
  createdAt: DateKey;
}

/** A row means "done". No row means "not done". */
export interface CompletionLog {
  id: string;
  habitId: string;
  date: DateKey;
}

export interface AppData {
  habits: Habit[];
  logs: CompletionLog[];
}
