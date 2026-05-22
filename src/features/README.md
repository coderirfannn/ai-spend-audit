# Feature-First Pattern

Each feature owns its UI, local state, schemas, and view-level orchestration.

## Intended boundaries

- `landing/`: hero, social proof, CTA flow
- `audit/`: audit intake, step flow, validation state
- `results/`: results presentation and next-step actions
- `share/`: public share presentation and metadata

## Rule of thumb

If logic is specific to one product surface, keep it inside that feature instead of moving it into a generic shared folder too early.
