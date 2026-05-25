import { describe, expect, test } from "vitest";
import { generateFounderSummary } from "../../src/services/summary/summary-service";

describe("generateFounderSummary", () => {
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

    expect(summary.generatedBy).toBe("fallback");
    expect(summary.bullets.length).toBeGreaterThan(0);
    expect(summary.headline.length).toBeGreaterThan(0);
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

    expect(summary.generatedBy).toBe("ai");
    expect(summary.headline).toBe("Founder summary");
    expect(summary.bullets).toHaveLength(2);
  });
});