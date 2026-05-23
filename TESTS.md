Quick test guide

Unit tests
- Location: `tests/unit/` and `tests/fixtures/`
- Run once:

```bash
npm run test
```

Development watch

```bash
npm run test:watch
```

Build validation
- Validate typechecking and build before merging to main:

```bash
npm run build
```

What to add (recommendations)
- Add lightweight e2e smoke tests (Playwright or Cypress) that:
  - Start the app in a test environment
  - Walk the landing and audit pages
  - Add tools, save draft, reload, and assert persistence
- Add CI jobs that run:
  - `npm ci`
  - `npm run test`
  - `npm run build`

Test data guidance
- Keep test fixtures deterministic and small.
- For DB-backed tests, prefer an in-memory MongoDB (mongodb-memory-server) or a disposable test database with teardown.

Notes
- There are existing unit test files under `tests/unit/`; expand coverage around  `audit-engine`, `summary`, and `lead-capture` service logic. 