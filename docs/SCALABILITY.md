# Scalability baseline

HabitSphere is a user-facing habit-tracking application. Scale it based on data volume and concurrent use, rather than adding infrastructure before measuring demand.

## Priorities
- Keep habit reads and writes scoped to the authenticated user and use pagination for long histories.
- Use indexed database lookups for user, habit, completion date, and schedule fields if a persistent database is added.
- Define recurrence and streak calculations using explicit timezone/date rules; test daylight-saving and month/year boundaries.
- Keep interactive UI responsive by avoiding repeated full-history recalculation; summarize on the server or memoize measured hot paths as needed.
- Configure structured errors, request timeouts, health checks, and production-safe logs for any API service.
- Add automated build, unit, and end-to-end workflow checks before scaling deployment replicas.

## Measure before scaling
Record p95 latency, error rate, CPU/memory, database query time, and bundle size. Load-test habit creation/completion, dashboard history, and concurrent writes with representative fixtures.

## Deployment gates
- [ ] Data isolation is verified for every user-scoped endpoint.
- [ ] Recurrence/streak edge cases are covered by tests.
- [ ] Backup/export and retention expectations are documented.
- [ ] Health checks, logs, and deploy rollback are verified.
- [ ] Capacity assumptions and load-test results are recorded.

This document is an action plan, not evidence of completed load testing or production capacity.