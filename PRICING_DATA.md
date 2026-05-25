# Pricing Data

This file documents the pricing assumptions used by the local audit engine. The values stay intentionally simple so the audit can give a clear answer without pretending to know more than it does.

## Tool catalog assumptions

- Cursor: Hobby, Pro, Business, Enterprise
- Copilot: Free, Pro, Business, Enterprise
- Claude: Free, Pro, Team, Max
- ChatGPT: Free, Plus, Team, Pro
- OpenAI API: Pay-as-you-go, Growth, Scale
- Anthropic API: Pay-as-you-go, Growth, Scale
- Gemini: Free, Advanced, Business, Enterprise
- Windsurf: Free, Pro, Teams, Enterprise

## How the audit uses pricing

- Seat waste is estimated by comparing team size against active seats.
- Same-vendor downgrade opportunities use the previous lower-priced plan tier.
- Use-case alternatives select cheaper tools that better match the stated workflow.
- Annual savings are modeled as monthly savings times 12.

## Important caveats

- These are heuristic pricing inputs, not live vendor API prices.
- Some recommendations are directional, not exact billing replacements.
- If vendor pricing changes, this file and the audit engine catalog should be updated together.

## Source of truth

- `src/services/audit-engine/catalog.ts`
- `src/services/audit-engine/engine.ts`
