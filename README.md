# HabitSphere

A minimalist, friction-free habit tracker. Tap to check off a habit, watch your streak grow.

## Features (MVP)

- Add habits (validated, no duplicates) and delete them (logs are removed too)
- Check / uncheck today with one tap
- Current streak and best streak per habit
- Weekly progress: a Mon-Sun dot row per habit and an overall percentage
- Data persists in `localStorage`

## Run it

```bash
npm install
npm run dev      # start the dev server
npm test         # run the streak test suite
npm run build    # type-check and build for production
```

## Project structure

```
src/
  types.ts                 Habit, CompletionLog, AppData
  lib/
    dates.ts               toLocalDateKey, addDays, weekDates
    streaks.ts             currentStreak, longestStreak, weeklyCompletion
    streaks.test.ts        edge-case tests (timezone, gaps, month boundaries)
    storage.ts             safe localStorage load/save
  hooks/useHabits.ts       state + add / delete / toggle actions
  components/
    AddHabitForm.tsx
    HabitCard.tsx
  App.tsx
```

## Data model

```
Habit (1) ───< (many) CompletionLog
id, name, icon, createdAt     id, habitId, date "YYYY-MM-DD"
```

- A log row means "done". No row means "not done".
- One log per habit per date.
- Dates are local calendar strings, never UTC.

## Rules this codebase follows

1. Use `toLocalDateKey()` for every habit date. Never `toISOString()`.
2. Use `addDays()` for date math. Never subtract milliseconds.
3. Today is "still open": it never breaks a streak until the day ends.

## Next steps (course Phases 3-4)

- Move storage to IndexedDB or SQLite behind the same hook
- Add a 12-week heatmap and a streak ring
- Make it an installable PWA with offline support
- Add local reminder notifications
- Deploy with CI/CD
