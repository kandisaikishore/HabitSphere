# HabitSphere

[![Repository](https://img.shields.io/badge/GitHub-Repository-181717?logo=github)](https://github.com/saikishore2410/HabitSphere) [![Issues](https://img.shields.io/github/issues/saikishore2410/HabitSphere)](https://github.com/saikishore2410/HabitSphere/issues) [![Last Commit](https://img.shields.io/github/last-commit/saikishore2410/HabitSphere)](https://github.com/saikishore2410/HabitSphere/commits/main)

> HabitSphere helps users check off daily habits, track streaks, and see progress across the week. The current app stores habit data in the browser.

## At a glance

- **Purpose:** Understand the problem and supported workflows from the feature and scope sections below.
- **Setup:** Follow the project-specific steps in **Getting started** or **Run locally**; verify commands against the current source and package scripts.
- **Configuration:** Keep API keys, database passwords, tokens, and user data out of commits. Use local environment variables for secrets.
- **Quality:** Run the available build, tests, and lint checks before proposing changes.



**A lightweight, local-first habit tracker for building routines and reviewing consistency.**

HabitSphere helps users check off daily habits, track streaks, and see progress across the week. The current app stores habit data in the browser.

## Features

- Create habits with validation for blank names, duplicates, and long names
- Check or uncheck today's completion with one tap
- Track current and best streaks
- Review Monday–Sunday completion history for each habit
- See daily progress and weekly consistency
- Delete habits with confirmation
- Persist data in browser `localStorage`
- Handle unavailable or malformed local storage safely

## Tech stack

- React
- TypeScript
- Vite

## Requirements

- Node.js 20+

## Quick start

```bash
git clone https://github.com/saikishore2410/HabitSphere.git
cd HabitSphere
npm install
npm run dev
```

## Quality checks

```bash
npm test
npm run lint
npm run build
```

Confirm the current `package.json` scripts if any command is unavailable in your branch.

## Data and limitations

Habit history is stored locally in the current browser. It does not automatically synchronize across devices or accounts. Use the demo workspace to evaluate the interface; add backend persistence and account controls if multi-device usage is required.

## Contributing

For bug reports, provide steps to reproduce. Include tests for streak calculation, date boundaries, and persistence changes.

## License

No license is specified. Add a `LICENSE` file to define reuse terms.