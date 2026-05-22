# AI Spend Audit

Lightweight SaaS scaffold that helps teams audit AI tool spend. Implemented with the App Router, TypeScript, TailwindCSS, React Hook Form + Zod, Zustand (persist), and optional MongoDB-backed sharing.

Quick start

- Install dependencies:

```bash
npm install
```

- Local dev server:

```bash
npm run dev
```

- Production build:

```bash
npm run build
npm start
```

Tests

- Unit tests run with Vitest:

```bash
npm run test
```

Environment variables

See `.env.example` for the canonical list. Important variables:
- `MONGODB_URI` and `MONGODB_DB` — required for DB-backed share/results and lead capture. If `MONGODB_URI` is not set the app will render a safe "Snapshot unavailable" fallback for share routes.
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_REPLY_TO_EMAIL` — email notifications (optional, required for email flow).
- `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SHARE_BASE_URL` — used to construct public links.

Files changed during stabilization
- `src/features/audit/audit-spend-form.tsx` — fixed hydration/persist loop and numeric registration
- `src/app/results/page.tsx` — added results route shell
- `src/app/share/[id]/page.tsx` — added DB error handling and graceful fallback
- `tsconfig.json` — added `ignoreDeprecations` to silence TS deprecation diagnostics

Notes

- The app uses the Next.js version declared in `package.json` in this workspace. Confirm that CI/staging uses a compatible Node and Next.js version.
- For production readiness, wire a real MongoDB URI and an email provider; the app will not crash without them but DB-backed features will show fallbacks.
