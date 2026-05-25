# AI Spend Audit

AI Spend Audit is a Next.js 15 App Router application that helps founders and engineering teams figure out where their AI spend is going and what they can trim.

## What it does

- Audits seat-based and usage-based AI tool spend
- Points out duplicate tools, overprovisioned seats, and easy downgrade opportunities
- Persists the draft locally in the browser with Zustand
- Generates shareable result snapshots when database and email providers are configured
- Includes a public landing page, audit flow, results dashboard, and share route

## Key routes

- `/` - marketing landing page
- `/audit` - audit intake form
- `/results` - computed spend audit results
- `/share/[id]` - public share snapshot
- `/api/lead-capture` - lead capture and report delivery endpoint

## Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- React Hook Form + Zod
- Zustand persist
- Mongoose
- Resend

## Scripts

```bash
npm install
npm run dev
npm run build
npm run test
npm run test:watch
npm start
```

## Environment

See `.env.example` for the full list. Important variables:

- `MONGODB_URI` and `MONGODB_DB`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `RESEND_REPLY_TO_EMAIL`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SHARE_BASE_URL`

## Docs

- [Architecture](ARCHITECTURE.md)
- [Tests](TESTS.md)
- [Prompts](PROMPTS.md)
- [Pricing data](PRICING_DATA.md)
- [GTM](GTM.md)
- [Economics](ECONOMICS.md)
- [Metrics](METRICS.md)
- [Landing copy](LANDING_COPY.md)
- [User interviews](USER_INTERVIEWS.md)
- [Devlog](DEVLOG.md)
- [Reflection](REFLECTION.md)

## Notes

The repository already includes a legacy lowercase `readme.md`. This file is the canonical README expected by the workspace requirements.
