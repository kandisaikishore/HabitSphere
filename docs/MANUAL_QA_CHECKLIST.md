# Manual QA Checklist

Use this checklist before releasing HabitSphere. Run it against the deployed build and record any failures as GitHub issues.

## Core habit flows
- [ ] Create a habit with a valid name.
- [ ] Confirm empty or whitespace-only names are rejected with a clear message.
- [ ] Edit a habit and verify the updated details persist after refresh.
- [ ] Mark a habit complete for today and verify the completion state.
- [ ] Undo a completion, then confirm the state remains correct after refresh.
- [ ] Delete a habit only after confirming the intended habit is removed.
- [ ] Verify streak and progress values after completing and un-completing habits.

## Persistence and recovery
- [ ] Refresh the page and confirm saved habits and completion logs remain available.
- [ ] Test with empty browser storage and confirm the app loads without crashing.
- [ ] Test malformed or stale saved data in a non-production test profile; confirm the app recovers safely.
- [ ] Confirm duplicate completion actions do not create duplicate same-day logs.

## Responsive and accessibility checks
- [ ] Test a narrow mobile viewport (320–375 px) and check for horizontal overflow.
- [ ] Test a tablet viewport and a desktop viewport.
- [ ] Navigate interactive controls using the keyboard; check visible focus indicators.
- [ ] Verify form fields have accessible labels and buttons have meaningful names.
- [ ] Check text contrast and ensure important feedback is not communicated by color alone.

## Release smoke checks
- [ ] Run `npm ci`.
- [ ] Run the test script defined in `package.json`.
- [ ] Run the type-check script, if configured.
- [ ] Run the production build.
- [ ] Open the deployed URL and verify the main screen loads without console errors.
- [ ] Verify one create/complete/refresh flow on the deployed build.

## Defect reporting
For each failure, open a GitHub issue with:
- Environment (browser, OS, viewport, and deployment URL)
- Preconditions and steps to reproduce
- Expected result and actual result
- Screenshot or console output when useful
- Severity and whether the issue blocks release

Do not mark a check as passed unless it was actually executed.
