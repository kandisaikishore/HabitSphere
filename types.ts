/** Local calendar day key, formatted YYYY-MM-DD. */
export type DateKey = string;
export interface Habit { id: string; name: string; icon: string; createdAt: DateKey; }
export interface CompletionLog { id: string; habitId: string; date: DateKey; }
export interface AppData { habits: Habit[]; logs: CompletionLog[]; }
