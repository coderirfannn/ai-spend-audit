import test from "node:test";
import assert from "node:assert/strict";
import { analyzeAuditSpend } from "../../src/services/audit-engine";

test("detects overprovisioning and same-vendor downgrade opportunities", () => {
  const result = analyzeAuditSpend({
    teamSize: 4,
    useCase: "developer productivity",
    tools: [
      {
        tool: "Copilot",
        plan: "Business",
        spend: 95,
        seats: 8,
      },
    ],
  });

  assert.equal(result.monthlySpend, 95);
  assert.ok(result.monthlySavings > 0);
  assert.ok(result.findings.some((finding) => finding.type === "right-size-seats"));
  assert.ok(result.findings.some((finding) => finding.type === "downgrade-plan"));
});

test("suggests alternatives aligned to use case", () => {
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

  assert.ok(result.recommendations[0]?.recommendedTool !== "Cursor");
  assert.ok(result.recommendations[0]?.alternatives.length > 0);
  assert.ok(result.monthlySavings >= 0);
});