Overview

This repository follows a feature-first architecture that separates UI shells (App Router pages) from domain features, services, and shared UI primitives.

Key folders
- `src/app` — App Router route shells and global layout/metadata.
- `src/features` — Feature modules containing composable UI and page-level logic (landing, audit, results).
- `src/components` — Shared UI and `ui` primitives (design system pieces).
- `src/services` — Service layer (audit engine, summary, lead-capture, email, database models).
- `src/lib` — infrastructure helpers (e.g., `mongodb.ts` connection wrapper).
- `src/stores` — client state (Zustand) and persistence middleware.
- `src/schemas` — shared Zod schemas and default values for forms.
- `tests` — unit/integration/e2e test fixtures.

Data and rendering flow
- Audit form: client component (`use client`) inside feature `audit`. Uses React Hook Form + Zod for validation and Zustand for draft persistence to localStorage.
- Persist: `use-audit-form-store.ts` holds `draft` and `hydrated` state. The form hydrates once then watches updates and writes the draft when hydrated.
- Lead capture: `/api/lead-capture` validates input then calls `captureLeadAndSendEmail` which persists lead + audit snapshot to MongoDB and sends email via Resend.
- Share page: Server-rendered route (`src/app/share/[id]/page.tsx`) queries `ShareResultModel` via the `connectToDatabase()` helper.

Database connectivity
- `src/lib/mongodb.ts` provides a small mongoose connection wrapper with an in-memory global cache to avoid reconnect storms in serverless environments.
- Behavior: throws when required env vars (`MONGODB_URI`, `MONGODB_DB`) are missing. The app now catches DB connectivity errors at the share page and renders a graceful fallback.

State & client/server split
- By default pages are server components; interactive pieces explicitly use `"use client"`.
- Keep heavy logic that requires server resources (DB lookups, email sends) in `services/` and server routes.

Operational notes
- The share and lead-capture features require a working MongoDB Atlas (or compatible) connection string; without it those routes render fallbacks instead of failing the whole app.
- Keep sensitive secrets in environment variables and provisioning vaults (do not commit them to Git).

Extensibility
- `audit-engine` can be expanded to call external AI services (LLMs) to produce summaries; keep those calls server-side and rate-limited.
- Tests: add CI steps to run `npm run test` and `npm run build` for PR validation.