# Scalability and capacity plan

## Application performance
- Paginate habit history and activity feeds; enforce a server-side maximum page size.
- Query only fields required by each screen and avoid repeated per-item database lookups.
- Add indexes only after reviewing measured query plans and read/write patterns.
- Debounce client-side search and avoid duplicate in-flight requests for the same view.
- Lazy-load non-critical screens and split large frontend routes where the build tool supports it.

## Reliability and concurrency
- Persist user and habit state in shared durable storage rather than process memory.
- Make streak/record updates transactional and idempotent to prevent duplicate submissions.
- Use UTC timestamps internally and define the user-facing timezone policy.
- Apply request limits, bounded timeouts, and safe retry behavior.
- Keep health/liveness separate from readiness and dependency checks.

## Observability and validation
Track p95/p99 API latency, request and error rates, database saturation, slow queries, and frontend bundle size. Test simultaneous updates, duplicate submissions, large histories, and dependency failures using isolated test data.

## Release gates
- [ ] Pagination and input limits exist for large collections.
- [ ] Concurrent updates preserve invariants.
- [ ] Database migrations and backup/restore are documented.
- [ ] CI tests and production build pass.
- [ ] Capacity changes are supported by a reproducible load-test report.

This is a readiness plan, not a claim that load testing has been performed.
