# HabitSphere: Course Content

A beginner-to-deployed course built around **HabitSphere**, a minimalist, friction-free habit tracker focused on visual progression and behavioral science.

**Contents**

1. [Curriculum Outline (4 Phases)](#1-curriculum-outline-4-phases)
2. [Lesson: Understanding State Management](#2-lesson-understanding-state-management)
3. [Capstone Project Guide](#3-capstone-project-guide)

---

# 1. Curriculum Outline (4 Phases)

**Suggested stack:** React + TypeScript, built as an installable web app (PWA). One codebase covers the web and, through wrappers like Capacitor, the app stores.
**Suggested pacing:** about 10 weeks, roughly 5-6 hours per week.

## Phase 1: Core Fundamentals

*Duration: ~2 weeks · Micro-project: Static Habit Card*

### Learning Objectives

- Explain how HTML structure, CSS styling, and JavaScript behavior fit together
- Declare and use variables (`const`, `let`) and basic data types (string, number, boolean, object)
- Build layouts with Flexbox and CSS Grid
- Break a UI into reusable components and pass data in as props
- Apply basic visual design: spacing, typography, color contrast, and a minimalist design system (colors and spacing as variables)
- Use dev tools, Git, and a code editor

### Micro-Project: Static Habit Card

Build a single, polished habit card from a provided design mockup.

**It must include:**

- Habit name, emoji or icon, and a "current streak" number
- A 7-day row of dots showing a hardcoded completion pattern
- A responsive layout that works on phone and desktop widths
- A `HabitCard` component that takes its data from props, rendered three times with different data

**Mastery check:** The card matches the mockup within a stated tolerance, uses no magic numbers (design tokens only), and passes an accessibility checklist (contrast, semantic HTML, alt text).

## Phase 2: Intermediate Mastery

*Duration: ~3 weeks · Micro-project: Dynamic Habit Toggle List*

### Learning Objectives

- Manage component state with `useState` and understand why state changes trigger re-renders
- Handle events (clicks, form input) and update state immutably
- Render lists dynamically with `.map()` and keys
- Use `useEffect` for side effects, and know when not to
- Read and write `localStorage` safely (JSON serialization, parse errors, empty-storage fallback)
- Write small pure functions for logic (e.g., "is this habit done today?") and test them
- Lift state up and structure data flow across components
- Debug state bugs systematically

### Micro-Project: Dynamic Habit Toggle List

A working list of habits the user can add, complete, and delete, with data that survives a page refresh.

**It must include:**

- An "add habit" input with validation (no empty or duplicate names)
- A tap-to-toggle completion state for today, with instant visual feedback
- A completion counter ("3 of 5 done today")
- Persistence through `localStorage`, with graceful handling of corrupted or missing data
- A custom `useLocalStorage` hook extracted from the component logic

**Mastery check:** Refreshing the page preserves state, empty and error states are handled, and at least 5 unit tests cover the core logic functions.

## Phase 3: The Capstone Blueprint

*Duration: ~3 weeks · Deliverable: HabitSphere core build*

This phase shifts from guided exercises to architecture. Students plan before they code.

### Learning Objectives

- **Data modeling:** Design a relational schema for habits and logs, and justify the choices
- **Streak algorithms:** Implement current streak, longest streak, and completion rate with correct handling of time zones, missed days, and non-daily schedules
- **Data visualization:** Build progress charts (weekly bars, a 12-week heatmap, a streak ring) and choose the right chart for the data
- **Behavioral design:** Apply habit-formation principles to UI decisions: low-friction logging, immediate reward feedback, and compassionate handling of broken streaks
- **Architecture:** Separate the data layer, logic layer, and UI layer so the storage backend can change later
- **Testing:** Write test cases for edge cases (midnight rollover, daylight saving, backfilled entries)

### Suggested Data Model

| Table | Key Fields |
|---|---|
| `habits` | `id`, `name`, `icon`, `color`, `frequency` (daily or specific weekdays), `created_at`, `archived_at` |
| `habit_logs` | `id`, `habit_id` (FK), `date` (local calendar date, stored as `YYYY-MM-DD`), `completed`, `note` (optional) |

Use one log row per habit per date, enforced with a unique constraint. Store local calendar dates rather than UTC timestamps, since most streak bugs come from time zones.

### Core Algorithm Lessons

1. **Current streak:** Walk backward from today across scheduled days and stop at the first miss. Today being incomplete shouldn't break the streak until the day ends.
2. **Longest streak:** Make a single pass over sorted log dates.
3. **Completion rate:** Count completed days over scheduled days in a window.
4. **Grace mechanics (stretch):** Add a "streak freeze" or "never miss twice" rule.

### Capstone Build Milestones

- **Week 7:** Schema, data layer (IndexedDB or SQLite via a lightweight wrapper), and the habit CRUD screens
- **Week 8:** Streak engine with full test coverage, plus the daily check-in view
- **Week 9:** Progress screen with charts, and a polished empty-state, onboarding, and celebration experience

**Mastery check:** The student produces an architecture document (schema diagram and component map) *before* building. The finished app passes a streak edge-case test suite, and a user can log a habit in two taps or fewer.

## Phase 4: Production & Deployment

*Duration: ~2 weeks · Deliverable: Live, installable HabitSphere*

### Learning Objectives

- **Deploy:** Ship to the web with a static host (Vercel, Netlify, or Cloudflare Pages) with CI/CD from a Git repo
- **Package:** Make the app installable with a web manifest and service worker, and explain the path to the Play Store and App Store using Capacitor
- **Optimize:** Measure with Lighthouse and fix what it finds: code splitting, lazy-loaded charts, image optimization, and caching strategy. Target a Performance score of 90 or higher
- **Notify:** Implement local reminders (scheduled notifications through the Notifications API, or Capacitor Local Notifications on native), including permission-request UX that explains the value before asking
- **Work offline:** Make the app fully usable without a connection
- **Operate:** Add basic error monitoring and understand environment configuration and versioning

### Micro-Project: Ship It

Take HabitSphere from "works on my machine" to a public, installable app.

**It must include:**

- A live URL with HTTPS and automatic deploys on merge to `main`
- An installable PWA that works offline
- A per-habit daily reminder time, set by the user, that triggers a local notification
- A Lighthouse report showing Performance ≥ 90 and Accessibility ≥ 95
- A short README and a 2-minute demo video

**Mastery check:** A peer, not the student, installs the app on their phone, creates a habit, receives a reminder, and logs it, without help.

## Platform Design Notes

- **Assessment:** Each phase ends with a rubric-graded micro-project. Consider a gating rule so students must pass before advancing.
- **Scaffolding:** Phase 1 uses heavy hand-holding, Phase 2 uses hints, and Phases 3 and 4 use specs only. The reduction in support is deliberate.
- **Motivation:** Because the capstone is about habits, you can run the course itself on streaks and visual progress. Students experience the product's thesis while learning to build it.

---

# 2. Lesson: Understanding State Management

### How HabitSphere remembers if a habit was checked today

**Time:** 20 minutes · **Level:** Beginner · **You need:** Phase 1 finished (components and props)

## The Big Idea: A Whiteboard on Your Fridge

Picture a whiteboard on your fridge. It lists your habits. Next to each one is a box.

You drink water. You walk to the fridge. You put a tick in the box.

Now look at the board. It **remembers**. The tick stays there. You can walk away and come back. It is still there.

That whiteboard is **state**.

**State is the information your app remembers right now.**

Here is the key rule:

> When the board changes, everyone who looks at it sees the new version.

In your app, the screen is the person looking at the board. When state changes, the screen updates itself. You do not redraw anything by hand.

### A Second Picture: The Light Switch

A light switch has two positions: **on** and **off**. The switch *remembers* which one it is in. Click it, and the room changes.

A habit works the same way:

| Switch | Habit |
|---|---|
| Off | Not done today |
| On | Done today |

One small piece of memory. Two possible values. That is state.

## Why This Matters for HabitSphere

Think about the moment a user taps **"Drink Water."**

Many things must change at once:

1. The checkbox turns green.
2. The "3 of 5 done today" counter becomes "4 of 5."
3. The streak number goes up by one.
4. The progress ring fills a little more.

Without state, you would write code to find and fix each of these by hand. That is slow. It breaks easily. You will forget one.

With state, you change **one thing**: the habit is now done. Everything else follows.

**One change in memory. Many updates on screen.**

This is why HabitSphere feels instant. And instant feedback is the heart of good habit design. A fast reward makes people want to come back tomorrow.

## Your First State: Code You Can Copy

We use a React tool called `useState`. It gives you two things:

- **The current value** (what the app remembers)
- **A setter function** (the only safe way to change it)

```jsx
import { useState } from "react";

export default function HabitToggle() {
  // Memory: is the habit done today? Starts as false.
  const [isDone, setIsDone] = useState(false);

  return (
    <div>
      <h2>💧 Drink Water</h2>

      <button onClick={() => setIsDone(!isDone)}>
        {isDone ? "✅ Done today" : "⬜ Not done yet"}
      </button>
    </div>
  );
}
```

### Read It Line by Line

- `useState(false)` creates the memory. The starting value is `false`.
- `isDone` is the value. Read it any time.
- `setIsDone` is the setter. Use it to change the value.
- `!isDone` means "the opposite." True becomes false. False becomes true.
- When the setter runs, React redraws the button. You do nothing extra.

### Two Rules to Remember

1. **Never change state directly.** Writing `isDone = true` does not work. Always use the setter.
2. **Changing state redraws the screen.** That is the magic.

### Try It

Change the code so the button also shows a number: how many times you tapped it. Hint: you need a second `useState`.

## Quick Recap

- **State** is what your app remembers right now.
- A **setter** is the only safe way to change it.
- When state changes, the **screen updates by itself**.
- For HabitSphere, one tap changes one value. The checkbox, counter, and streak all follow.

## Check Your Understanding

Get all 3 right before you move on.

**Question 1.** In the fridge whiteboard analogy, what does the whiteboard represent?

- A. The screen the user sees
- B. State: the information the app remembers right now
- C. The button the user taps
- D. The internet connection

**Question 2.** A user taps "Drink Water" and the checkbox, counter, and streak all update. Why is state helpful here?

- A. You change one value, and the screen updates everything that depends on it
- B. You must write separate code to update each part by hand
- C. State stops the user from tapping twice
- D. State saves the habit to the cloud

**Question 3.** Which line correctly changes the `isDone` state to its opposite?

- A. `isDone = !isDone`
- B. `setIsDone(!isDone)`
- C. `useState(!isDone)`
- D. `isDone.change()`

<details>
<summary>Answer key</summary>

1. **B.** The whiteboard holds the information that stays remembered. That is state. The screen is like the person looking at the board.
2. **A.** State lets you change one thing. React then redraws every part of the screen that uses it.
3. **B.** Always use the setter function, here `setIsDone`. Changing the variable directly does not tell React to redraw the screen.

</details>

---

# 3. Capstone Project Guide

**The pitch:** A minimalist routine tracker. Open it, tap a habit, see your streak grow. No accounts. No clutter. Two taps or fewer to log anything.

**Prerequisites:** Phase 1 (layouts, components) and Phase 2 (state, `localStorage`, pure functions).

## 3.1 Feature Roadmap

### MVP: Must Build

| # | Feature | What "done" looks like |
|---|---|---|
| 1 | **Add habit** | Name input with validation. No empty names. No duplicates (case-insensitive). |
| 2 | **Delete habit** | Confirmation step. Deleting a habit also deletes its logs. |
| 3 | **Check / uncheck for today** | One tap toggles. The UI updates instantly. Unchecking undoes the log cleanly. |
| 4 | **Streak counter** | Shows the current streak and the longest streak per habit. Updates the moment you check. |
| 5 | **Weekly progress view** | A 7-day view per habit (Mon-Sun) plus an overall "this week" completion percentage. |
| 6 | **Persistence** | All data survives a page refresh. |

### Out of Scope for MVP

Do not build these until all six features above are done and tested:

- User accounts and cloud sync
- Non-daily schedules (e.g., Mon/Wed/Fri only)
- Reminders (that's Phase 4)
- Editing past days (backfill)
- Themes and sharing

### Success Criteria

- A new user can add a habit and log it in **under 10 seconds**
- Streak numbers are **always correct** (see the test suite in Milestone 4)
- Works on a 360px-wide phone screen

## 3.2 Data Schema

Keep it small. Two objects, one link.

```
┌─────────────────────────┐          ┌─────────────────────────────┐
│          Habit          │          │        CompletionLog        │
├─────────────────────────┤          ├─────────────────────────────┤
│ id          string (PK) │◄────┐    │ id        string (PK)       │
│ name        string      │     │    │ habitId   string (FK) ──────┼──┐
│ icon        string      │     └────┼─────────────────────────────┤  │
│ createdAt   YYYY-MM-DD  │  1 : many│ date      "YYYY-MM-DD"      │  │
└─────────────────────────┘          └─────────────────────────────┘  │
        ▲                                                             │
        └─────────────────────────────────────────────────────────────┘
```

**Relationship:** One `Habit` has many `CompletionLog` entries. Each log belongs to exactly one habit.

### Rules to Follow

1. **A log row means "done."** No row means "not done." Unchecking deletes the row.
2. **One log per habit per date.** Never allow two rows with the same `habitId` + `date`.
3. **Dates are local calendar strings** (`"2026-10-10"`), never UTC timestamps. This prevents most streak bugs.
4. **Deleting a habit deletes its logs.** No orphans.

### Example Data

```json
{
  "habits": [
    { "id": "h1", "name": "Drink Water", "icon": "💧", "createdAt": "2026-10-01" }
  ],
  "logs": [
    { "id": "l1", "habitId": "h1", "date": "2026-10-08" },
    { "id": "l2", "habitId": "h1", "date": "2026-10-09" },
    { "id": "l3", "habitId": "h1", "date": "2026-10-10" }
  ]
}
```

This habit has a current streak of **3**.

## 3.3 Implementation Milestones

Build in order. Each stage must work before you start the next.

### Stage 1: Skeleton and Data Layer

**Build:** Project setup. Define the `Habit` and `CompletionLog` types. Write storage functions (`loadData`, `saveData`) with safe fallbacks for empty or corrupted storage.
**Done when:** You can save and load a hardcoded habit across refreshes.

### Stage 2: Habit Management

**Build:** The habit list screen. Add form with validation. Delete with confirmation (cascade delete logs).
**Done when:** You can add, see, and delete habits. Refreshing keeps them.

### Stage 3: Daily Check-In and Date Utilities

**Build:** A `toLocalDateKey()` helper (see Pitfall 1). The check/uncheck toggle that adds or removes today's log. Prevent duplicate logs.
**Done when:** Tapping toggles the state instantly. Refreshing keeps today's checks.

### Stage 4: Streak Engine

**Build:** Pure functions: `currentStreak`, `longestStreak`. Write the test suite *first* (see Pitfalls). Connect the results to the UI.
**Done when:** All edge-case tests pass and the streak number changes the moment you tap.

### Stage 5: Weekly Progress and Polish

**Build:** The 7-day dot or bar view per habit. A weekly completion percentage. Empty states, a small celebration at streak milestones (3, 7, 30), and a mobile layout pass.
**Done when:** A peer can use it on their phone without instructions.

## 3.4 Common Pitfalls and Debugging

### Pitfall 1: The "Wrong Day" Bug (Timezones)

**Symptom:** A user logs a habit at 11 PM. It appears on *tomorrow's* date. Or the streak breaks for no reason.

**Cause:** `new Date().toISOString()` returns **UTC**, not local time. Late at night, UTC is already the next day in some timezones.

**Fix:** Build the date string from *local* parts.

```js
function toLocalDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
```

Use this one function everywhere. Never call `toISOString()` for a habit date.

**Test it:** Mock the time to 11:30 PM and 12:30 AM. Check that the date key matches the local calendar day.

### Pitfall 2: "My Streak Reset to Zero in the Morning"

**Symptom:** It's 8 AM. The user logged yesterday and the day before. The app shows a streak of **0**.

**Cause:** The code starts counting from *today*. Today is not checked yet, so it stops immediately.

**Fix:** Today is "still open." If today is not done, start counting from **yesterday**. Only a missed *past* day breaks the streak.

```js
function currentStreak(doneDates, today = toLocalDateKey()) {
  const done = new Set(doneDates);
  let cursor = done.has(today) ? today : addDays(today, -1);
  let streak = 0;

  while (done.has(cursor)) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}
```

**Test it:**

| Logs | Today | Expected |
|---|---|---|
| Oct 8, 9 | Oct 10 | **2** (today still open) |
| Oct 8, 9, 10 | Oct 10 | **3** |
| Oct 7, 8 | Oct 10 | **0** (Oct 9 missed) |
| none | Oct 10 | **0** |

### Pitfall 3: The Daylight Saving Time Skip

**Symptom:** Around a clock change, a streak breaks or jumps by one. Two days seem to be the same day, or a day vanishes.

**Cause:** Code that moves back a day by subtracting `24 * 60 * 60 * 1000` milliseconds. On a DST day, a day is 23 or 25 hours long.

**Fix:** Do **calendar math**, not millisecond math. Let `Date` handle the day rollover.

```js
function addDays(dateKey, n) {
  const [y, m, d] = dateKey.split("-").map(Number);
  return toLocalDateKey(new Date(y, m - 1, d + n));
}
```

`new Date(2026, 9, 10 + 1)` correctly rolls over month ends and year ends too.

**Test it:** Run `addDays` across a DST change date for your region, across Oct 31 → Nov 1, and across Dec 31 → Jan 1. Each should move by exactly one calendar day.

### Bonus Checklist: Streak Test Suite

Write these before you finish Stage 4:

- [ ] No logs gives 0
- [ ] Only today logged gives 1
- [ ] A gap in the middle resets the streak
- [ ] Duplicate log dates don't double-count
- [ ] Logs in unsorted order still give the right answer
- [ ] Longest streak is kept even after the current one breaks
- [ ] Month and year boundaries count correctly

## 3.5 Submission Checklist

- [ ] All 6 MVP features work
- [ ] Data persists across refresh
- [ ] Streak tests pass
- [ ] No console errors
- [ ] README with a screenshot and setup steps
- [ ] A peer completes the "add habit, check it, see streak" task unaided
