# HabitSphere compatibility testing

## Runtime and browser matrix

| Area | Coverage | Automated check |
| --- | --- | --- |
| Node.js | 20 LTS and 22 LTS | CI matrix: clean install, unit tests, TypeScript check, production build |
| Dependency reproducibility | npm lockfile required | `npm ci` fails when the lockfile is missing or out of sync |
| Date handling | Local calendar keys, month/year boundaries, Monday-first weeks | Vitest date and streak tests |
| Browser storage | Empty, malformed, blocked, duplicate and stale records | Vitest storage tests |
| Responsive layout | Small phones (320–390 px), phones, tablets, desktop | CSS breakpoints and manual browser/device validation |
| Accessibility | Keyboard focus, labels, pressed state, reduced motion | Existing accessible controls and manual keyboard/screen-reader validation |
| Production hosting | Static Vite output from `dist/` | Build artifact check; deployed URL smoke test must be run after hosting is configured |

## Compatibility rules

- Use Node.js 20 or 22 and install from the committed lockfile with `npm ci`.
- Preserve local-calendar date keys (`YYYY-MM-DD`) instead of UTC timestamps for daily check-ins.
- Treat browser storage as unavailable or untrusted: corrupted JSON, denied access and quota errors must not crash the UI.
- Validate all supported viewport sizes, keyboard navigation, contrast, focus indicators and reduced-motion preferences in a real browser before calling the UI accessibility-tested.
- Do not claim the local AI Coach calls an external model. It is currently a local demo experience.
- The application persists to the current browser profile only; it does not provide cross-device synchronization.

## Deployment checklist

1. Configure the static host to build with `npm ci && npm test && npm run build`.
2. Publish the `dist/` directory.
3. Open the deployed URL and confirm HTTP success, CSS/JS asset loading, dashboard rendering, create/check/uncheck/delete flows and reload persistence.
4. Repeat the smoke test at a narrow mobile viewport and a desktop viewport.
5. Confirm the hosting provider's deployment is marked successful and record the deployed URL.

The GitHub workflow covers clean dependency installation, unit tests, TypeScript validation, and production bundling. It does not itself provide a real-browser or deployed-environment test.
