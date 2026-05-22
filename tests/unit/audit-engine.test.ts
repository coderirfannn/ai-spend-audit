import { describe, expect, it } from "vitest";
import { analyzeAuditSpend } from "../../src/services/audit-engine";

describe("auditEngine", () => {
  it("detects plan downgrade opportunities", () => {
    const result = analyzeAuditSpend({
      teamSize: 4,
      useCase: "finance ops",
      tools: [
        {
          tool: "Cursor",
          plan: "Business",
          spend: 95,
          seats: 4,
        },
      ],
    });

    expect(result.recommendations[0]?.recommendedTool).toBe("Cursor");
    expect(result.recommendations[0]?.recommendedPlan).toBe("Pro");
    expect(result.findings.some((finding) => finding.type === "downgrade-plan")).toBe(true);
    expect(result.monthlySavings).toBeGreaterThan(0);
  });

  it("calculates annual savings as monthly savings multiplied by twelve", () => {
    const result = analyzeAuditSpend({
      teamSize: 2,
      useCase: "analysis",
      tools: [
        {
          tool: "Cursor",
          plan: "Business",
          spend: 120,
          seats: 2,
        },
      ],
    });

    expect(result.monthlySavings).toBeGreaterThan(0);
    expect(result.annualSavings).toBe(result.monthlySavings * 12);
    expect(result.annualSpend).toBe(result.monthlySpend * 12);
  });

  it("returns a no-saving state when the current setup is already minimal", () => {
    const result = analyzeAuditSpend({
      teamSize: 1,
      useCase: "unknown workflow",
      tools: [
        {
          tool: "Cursor",
          plan: "Hobby",
          spend: 0,
          seats: 1,
        },
      ],
    });

    expect(result.monthlySavings).toBe(0);
    expect(result.annualSavings).toBe(0);
    expect(result.findings).toHaveLength(0);
    expect(result.recommendations[0]?.recommendedTool).toBe("Cursor");
    expect(result.recommendations[0]?.recommendedPlan).toBe("Hobby");
  });

  it("suggests an alternative recommendation when a better tool fits the use case", () => {
    const result = analyzeAuditSpend({
      teamSize: 2,
      useCase: "writing and research",
      tools: [
        {
          tool: "Cursor",
          plan: "Business",
          spend: 120,
          seats: 2,
        },
      ],
    });

    expect(result.recommendations[0]?.recommendedTool).toBe("Claude");
    expect(result.recommendations[0]?.recommendedPlan).toBe("Starter");
    expect(result.findings.some((finding) => finding.type === "use-case-alternative")).toBe(true);
  });

  it("credits savings from right-sizing overprovisioned seats", () => {
    const result = analyzeAuditSpend({
      teamSize: 4,
      useCase: "unknown workflow",
      tools: [
        {
          tool: "Cursor",
          plan: "Hobby",
          spend: 80,
          seats: 8,
        },
      ],
    });

    expect(result.findings.some((finding) => finding.type === "right-size-seats")).toBe(true);
    expect(result.monthlySavings).toBe(40);
    expect(result.annualSavings).toBe(480);
  });
});