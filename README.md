# HabitSphere

HabitSphere is a lightweight, local-first habit tracker built with React, TypeScript and Vite. Track daily check-ins, monitor streaks, and review weekly consistency.

## Current features

- First-run sample workspace with six editable example habits and illustrative check-in history; deleting all habits remains empty on future visits.
- Create habits with validation (blank names, duplicate names and names longer than 40 characters are rejected).
- Check or uncheck today's completion with one tap.
- See each habit's current streak, best streak, and Monday–Sunday completion row.
- Review overall daily progress and weekly consistency.
- Delete a habit with confirmation; its completion history is removed with it.
- Persist data in browser `localStorage`; malformed or blocked storage fails safely and does not crash the app.

## Requirements

- Node.js 20 or later (Node.js 20 is used in CI).
- npm.

## Run locally

```bash
npm ci
npm run dev
```

## Quality checks

```bash
npm test
npm run build
```

The production build runs TypeScript checking before Vite bundling. GitHub Actions runs unit tests and the production build on pushes and pull requests targeting `main`. A passing workflow is evidence for automated unit/build checks; it does not replace browser, accessibility, security, or end-to-end testing.

## Deploy

### Lovable

1. Import the GitHub repository into Lovable after the workspace has enough credits.
2. Verify the build and tests in the editor.
3. Publish from Lovable and smoke-test the published URL on desktop and mobile.

### Static hosting (Vite)

Use any static host that supports Node-based builds (for example, Netlify, Vercel static output or GitHub Pages).

- Build command: `npm ci && npm test && npm run build`
- Output directory: `dist`
- No server-side environment variables are required for the current local-first version.

For GitHub Pages deployments to a non-root path, configure Vite's `base` option for that repository path before deployment.

## Data and privacy

The current app stores habits only in the current browser profile using `localStorage`. Data is not synced across devices and can be lost if browser storage is cleared. There is no account-based backup in the current version. Export/import and cloud sync should be implemented explicitly before promising them.

## Date and streak rules

- Habit date keys are local calendar dates (`YYYY-MM-DD`), not UTC timestamps.
- Calendar arithmetic uses `addDays()` to avoid daylight-saving millisecond errors.
- Today is still an open day: a missed check-in today does not break a streak until the following day.
- Completion logs should be unique per habit and date.

## Project layout

The repository currently contains the component and utility source files at the root. `App.tsx` imports from `./hooks` and `./lib`, and `index.html` loads `/src/main.tsx`; make sure the source files are organised into the expected `src/` layout before the production build is considered verified.

## Test coverage

- Date formatting in local time, month/year boundaries and Monday-based weeks.
- Current and longest streaks, duplicate logs, missing-day gaps and weekly completion.
- Local storage round trips, malformed data and read/write exceptions.

## Planned improvements

- More expressive dashboard, filters and custom schedules.
- Mobile-first navigation and accessible interaction polish.
- Calendar history, progress insights and optional reminders.
- PWA/offline improvements and cross-device sync only with a deliberate backend/auth design.
