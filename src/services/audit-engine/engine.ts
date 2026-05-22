import type {
  AuditEngineInput,
  AuditEngineResult,
  AuditFinding,
  AuditRecommendation,
  AuditToolInput,
  AuditRecommendationType,
  AuditFindingSeverity,
} from "./contracts";
import {
  estimateToolSpend,
  getCheaperPlan,
  getCheapestAlternativeTool,
  getCatalogEntry,
  getPlanIndex,
  getUseCaseAlternatives,
  normalizeText,
  validateAuditToolInput,
  type SupportedToolName,
} from "./catalog";

function currency(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function severityForSavings(monthlySavings: number): AuditFindingSeverity {
  if (monthlySavings >= 500) {
    return "high";
  }

  if (monthlySavings >= 100) {
    return "medium";
  }

  return "low";
}

function summarizeUseCaseAlternatives(useCase: string, currentTool: string): string[] {
  return getUseCaseAlternatives(useCase, currentTool).slice(0, 3);
}

function buildToolRecommendation(tool: AuditToolInput, teamSize: number, useCase: string): { recommendation: AuditRecommendation; findings: AuditFinding[]; reasoning: string[]; optimizedMonthlySpend: number } {
  validateAuditToolInput(tool);

  const catalogEntry = getCatalogEntry(tool.tool);
  const currentPlanIndex = getPlanIndex(tool.tool, tool.plan);
  const cheaperPlan = getCheaperPlan(tool.tool, tool.plan);
  const useCaseAlternative = getCheapestAlternativeTool(useCase, tool.tool);
  const useCaseAlternatives = summarizeUseCaseAlternatives(useCase, tool.tool);

  const normalizedSeatCount = Math.max(1, Math.min(tool.seats, teamSize));
  const seatReductionFactor = normalizedSeatCount / tool.seats;
  const rightSizedMonthlySpend = tool.spend * seatReductionFactor;

  let optimizedMonthlySpend = tool.spend;
  let selectedRecommendationType: AuditRecommendationType = "consolidate-vendor";
  let selectedRecommendationPlan = tool.plan;
  let selectedRecommendationTool = tool.tool;
  const reasoning: string[] = [];
  const findings: AuditFinding[] = [];

  if (tool.seats > teamSize) {
    optimizedMonthlySpend = Math.min(optimizedMonthlySpend, rightSizedMonthlySpend);
    selectedRecommendationType = "right-size-seats";
    reasoning.push(
      `${tool.tool} is overprovisioned: ${tool.seats} paid seats for a ${teamSize}-person team can be reduced to ${normalizedSeatCount} seats.`
    );
    findings.push({
      tool: tool.tool,
      type: "right-size-seats",
      severity: severityForSavings(tool.spend - rightSizedMonthlySpend),
      title: "Right-size seats",
      detail: `Reduce ${tool.tool} from ${tool.seats} seats to ${normalizedSeatCount} seats to cut waste.`,
      monthlySavings: Math.max(0, tool.spend - rightSizedMonthlySpend),
      annualSavings: Math.max(0, tool.spend - rightSizedMonthlySpend) * 12,
    });
  }

  if (catalogEntry && currentPlanIndex >= 0 && cheaperPlan && currentPlanIndex > 0) {
    const currentPlan = catalogEntry.plans[currentPlanIndex];
    if (!currentPlan) {
      return { recommendation: {
        tool: tool.tool,
        recommendedTool: tool.tool,
        recommendedPlan: tool.plan,
        rationale: `No catalog match was found for ${tool.tool} ${tool.plan}.`,
        monthlySpend: tool.spend,
        monthlySavings: 0,
        annualSavings: 0,
        alternatives: summarizeUseCaseAlternatives(useCase, tool.tool),
      }, findings, reasoning: reasoning.length > 0 ? reasoning : [`No catalog match was found for ${tool.tool} ${tool.plan}.`], optimizedMonthlySpend: tool.spend };
    }
    const currentPlanPrice = currentPlan.monthlyPrice;
    const cheaperPlanPrice = cheaperPlan.monthlyPrice;
    const planDowngradeFactor = currentPlanPrice > 0 ? cheaperPlanPrice / currentPlanPrice : 1;
    const planDowngradeMonthlySpend = tool.spend * planDowngradeFactor;

    if (planDowngradeMonthlySpend < optimizedMonthlySpend) {
      optimizedMonthlySpend = planDowngradeMonthlySpend;
      selectedRecommendationType = "downgrade-plan";
      selectedRecommendationPlan = cheaperPlan.name;
      reasoning.push(
        `${tool.tool} ${tool.plan} has a cheaper same-vendor option: ${cheaperPlan.name} is a better fit for a lower-seat team.`
      );
    }

    findings.push({
      tool: tool.tool,
      type: "downgrade-plan",
      severity: severityForSavings(Math.max(0, tool.spend - planDowngradeMonthlySpend)),
      title: "Compare same-vendor plans",
      detail: `${tool.tool} ${tool.plan} can likely be downgraded to ${cheaperPlan.name}.`,
      monthlySavings: Math.max(0, tool.spend - planDowngradeMonthlySpend),
      annualSavings: Math.max(0, tool.spend - planDowngradeMonthlySpend) * 12,
    });
  }

  if (useCaseAlternative) {
    const alternativeMonthlySpend = estimateToolSpend(useCaseAlternative, normalizedSeatCount);
    if (alternativeMonthlySpend < optimizedMonthlySpend) {
      optimizedMonthlySpend = alternativeMonthlySpend;
      selectedRecommendationType = "use-case-alternative";
      selectedRecommendationTool = useCaseAlternative;
      selectedRecommendationPlan = "Starter";
      reasoning.push(
        `${tool.tool} does not look like the cheapest fit for ${normalizeText(useCase)}. ${useCaseAlternative} is a lower-cost alternative.`
      );
    }

    findings.push({
      tool: tool.tool,
      type: "use-case-alternative",
      severity: severityForSavings(Math.max(0, tool.spend - alternativeMonthlySpend)),
      title: "Suggest alternative tools based on use case",
      detail: `${useCaseAlternative} is better aligned to ${useCase}.`,
      monthlySavings: Math.max(0, tool.spend - alternativeMonthlySpend),
      annualSavings: Math.max(0, tool.spend - alternativeMonthlySpend) * 12,
    });
  }

  if (reasoning.length === 0) {
    reasoning.push(`${tool.tool} does not show a strong rule-based optimization signal with the current inputs.`);
  }

  const monthlySavings = Math.max(0, tool.spend - optimizedMonthlySpend);
  const annualSavings = monthlySavings * 12;

  const recommendation: AuditRecommendation = {
    tool: tool.tool,
    recommendedTool: selectedRecommendationTool,
    recommendedPlan: selectedRecommendationPlan,
    rationale: reasoning.join(" "),
    monthlySpend: optimizedMonthlySpend,
    monthlySavings,
    annualSavings,
    alternatives: useCaseAlternatives,
  };

  return { recommendation, findings, reasoning, optimizedMonthlySpend };
}

export function analyzeAuditSpend(input: AuditEngineInput): AuditEngineResult {
  if (!Number.isInteger(input.teamSize) || input.teamSize < 1) {
    throw new TypeError("teamSize must be a positive integer");
  }

  if (!input.useCase.trim()) {
    throw new TypeError("useCase is required");
  }

  if (input.tools.length === 0) {
    throw new TypeError("At least one tool is required");
  }

  const recommendations: AuditRecommendation[] = [];
  const findings: AuditFinding[] = [];
  let totalMonthlySpend = 0;
  let totalOptimizedMonthlySpend = 0;

  for (const tool of input.tools) {
    validateAuditToolInput(tool);
    totalMonthlySpend += tool.spend;

    const analysis = buildToolRecommendation(tool, input.teamSize, input.useCase);
    recommendations.push(analysis.recommendation);
    findings.push(...analysis.findings);
    totalOptimizedMonthlySpend += analysis.optimizedMonthlySpend;
  }

  const monthlySavings = Math.max(0, totalMonthlySpend - totalOptimizedMonthlySpend);
  const annualSavings = monthlySavings * 12;

  const reasoning = recommendations.map((recommendation) => recommendation.rationale);

  return {
    monthlySpend: totalMonthlySpend,
    annualSpend: totalMonthlySpend * 12,
    monthlySavings,
    annualSavings,
    reasoning,
    findings,
    recommendations,
  };
}

export const auditEngine = {
  analyzeAuditSpend,
  getUseCaseAlternatives,
  getCheapestAlternativeTool,
  estimateToolSpend,
  currency,
};
