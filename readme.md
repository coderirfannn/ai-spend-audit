# AI Spend Audit Architecture

Production-ready SaaS scaffold for a Next.js 15 App Router application using TypeScript, Tailwind, shadcn, MongoDB Atlas, Mongoose, Zustand persist, Zod, and Resend.

## Core Routes

- `/` landing experience
- `/audit` audit intake flow
- `/results` results experience
- `/share/[id]` public share page

## Folder Strategy

Feature-first organization keeps domain logic together and separates it from route shells, shared UI, services, and infrastructure concerns.

```text
src/
  app/
    (marketing)/
    audit/
    results/
    share/[id]/
  features/
    landing/
    audit/
    results/
    share/
  services/
    audit-engine/
    summary/
    lead-capture/
    email/
  components/
    ui/
    shared/
  lib/
  config/
  env/
  hooks/
  stores/
  schemas/
  types/
  styles/

tests/
  unit/
  integration/
  e2e/
  fixtures/
```

## Service Layer

- `audit-engine`: computes audit findings and scoring
- `summary`: transforms findings into concise results copy
- `lead-capture`: validates and persists lead submissions
- `email`: sends transactional and follow-up email

## Environment Structure

Use a single `.env.example` as the source of truth for runtime configuration and keep validation logic in `src/env/`.

## TypeScript

`tsconfig.json` is set up for strict mode and safer compiler defaults so the eventual implementation can stay predictable as the codebase grows.
