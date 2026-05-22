# App Router Shell

This folder owns routing and composition only.

## Planned routes

- `(marketing)/page.tsx` -> `/`
- `audit/page.tsx` -> `/audit`
- `results/page.tsx` -> `/results`
- `share/[id]/page.tsx` -> `/share/[id]`

## Notes

- Keep route files thin.
- Put domain logic in `src/features/`.
- Put reusable server concerns in `src/services/`.
- Keep shared UI in `src/components/`.
