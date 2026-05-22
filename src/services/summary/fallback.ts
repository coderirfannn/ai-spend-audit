import type { SummaryInput, SummaryOutput } from "./contracts";

function money(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function buildToolList(input: SummaryInput): string {
  return input.tools
    .map((tool) => `${tool.tool} ${tool.plan} (${money(tool.spend)}/mo, ${tool.seats} seats)`)
    .join(", ");
}

export function buildFallbackSummary(input: SummaryInput): SummaryOutput {
  const topRecommendation = input.recommendations[0];
  const toolList = buildToolList(input);
  const headline = input.savings.monthlySavings > 500 ? "Meaningful savings are on the table" : "Your AI stack has clear optimization signals";
  const subheadline = `We reviewed ${input.tools.length} tools and identified ${money(input.savings.monthlySavings)} in monthly savings, or ${money(input.savings.annualSavings)} annually.`;

  const bullets = [
    `Current stack: ${toolList}.`,
    topRecommendation
      ? `Highest-priority move: ${topRecommendation.recommendedTool} on ${topRecommendation.recommendedPlan} with ${money(topRecommendation.monthlySavings)} monthly savings.`
      : "No clear recommendation surfaced from the available inputs.",
    input.recommendations.some((recommendation) => recommendation.alternatives.length > 0)
      ? `Alternative tools worth reviewing: ${input.recommendations.flatMap((recommendation) => recommendation.alternatives).slice(0, 3).join(", ")}.`
      : "The current setup looks reasonably aligned with the stated use case.",
  ];

  return {
    headline,
    subheadline,
    bullets,
    ctaHint: input.savings.monthlySavings > 500 ? "Book a deeper review to capture the larger savings opportunity." : "Keep the stack lean and revisit when usage changes.",
    generatedBy: "fallback",
  };
}