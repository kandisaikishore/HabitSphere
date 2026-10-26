# Development, Testing, and Privacy Guide

HabitSphere is a habit-tracking project. The exact screens, persistence layer, and runtime commands are defined by the current source and package manifests.

## Setup

```bash
git clone https://github.com/kandisaikishore/HabitSphere.git
cd HabitSphere
```

Inspect the root and application package manifests, then use their declared install, development, test, and build scripts. Configure any required credentials locally; never commit secrets or real personal habit data.

## Functional test matrix

Where the relevant workflows exist, verify:
- Create, edit, complete, archive, and delete a habit
- Empty titles, invalid recurrence settings, and missing required values
- Repeated completion actions on the same calendar day
- Empty lists, loading states, and recoverable errors
- Refresh/restart behavior at the documented persistence boundary
- Keyboard navigation and mobile layouts

## Dates and streaks

Document the application's rule for assigning a completion to a calendar day. Use deterministic test dates rather than the machine's current date. Cover midnight boundaries, time-zone changes, and daylight-saving transitions where applicable. Repeating a completion action must not inflate streaks unless multiple completions per day are an explicit feature.

## Privacy and data handling

- Store only the personal data needed for the stated habit-tracking features.
- Do not log habit notes or sensitive user-entered text by default.
- If account features exist, test that one user's records cannot be accessed by another user.
- Explain what local or remote persistence is used and what deletion actually removes.

## Pull-request checklist

- [ ] Include reproduction steps and expected behavior.
- [ ] Add tests for success, invalid input, and date boundaries.
- [ ] Run the test/build commands declared by the project manifests.
- [ ] State any checks that could not be run.
- [ ] Keep demo features and persistence limitations explicit.
