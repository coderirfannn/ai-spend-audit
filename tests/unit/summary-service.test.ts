import test from "node:test";
import assert from "node:assert/strict";
import { generateFounderSummary } from "../../src/services/summary/summary-service";

test("falls back when the summary provider fails", async () => {
  const summary = await generateFounderSummary(
    {
      tools: [{ tool: "Copilot", plan: "Pro", spend: 40, seats: 2 }],
      recommendations: [
        {
          tool: "Copilot",
          recommendedTool: "Copilot",
          recommendedPlan: "Free",
          rationale: "Downgrade opportunity detected.",
          monthlySpend: 20,
          monthlySavings: 20,
          annualSavings: 240,
          alternatives: ["Cursor"],
        },
      ],
      savings: { monthlySavings: 20, annualSavings: 240 },
    },
    async () => {
      throw new Error("provider failed");
    }
  );

  assert.equal(summary.generatedBy, "fallback");
  assert.equal(summary.bullets.length > 0, true);
  assert.ok(summary.headline.length > 0);
});

test("uses AI provider output when valid", async () => {
  const summary = await generateFounderSummary(
    {
      tools: [{ tool: "Cursor", plan: "Business", spend: 100, seats: 5 }],
      recommendations: [],
      savings: { monthlySavings: 0, annualSavings: 0 },
    },
    async () => ({
      headline: "Founder summary",
      subheadline: "Concise and shareable",
      bullets: ["One", "Two"],
      ctaHint: "Review stack",
    })
  );

  assert.equal(summary.generatedBy, "ai");
  assert.equal(summary.headline, "Founder summary");
  assert.equal(summary.bullets.length, 2);
});