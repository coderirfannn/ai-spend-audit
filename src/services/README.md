# Service Layer

These modules are reserved for server-side and cross-feature business logic.

## Planned services

- `audit-engine/`: compute findings, score, and normalization
- `summary/`: convert audit output into concise copy
- `lead-capture/`: validate and persist captured leads
- `email/`: send transactional email via Resend

## Boundary rule

Services should be framework-agnostic where possible and expose stable contracts that features can consume.
