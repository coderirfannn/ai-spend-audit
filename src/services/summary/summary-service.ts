import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { SummaryInput, SummaryOutput, SummaryProvider, SummaryProviderResponse } from "./contracts";
import { buildFallbackSummary } from "./fallback";

function loadPrompt(fileName: string): string {
  return readFileSync(join(process.cwd(), "src", "services", "summary", "prompts", fileName), "utf8").trim();
}

function interpolateUserPrompt(template: string, input: SummaryInput): string {
  return template
    .replace("{{TOOLS}}", JSON.stringify(input.tools))
    .replace("{{RECOMMENDATIONS}}", JSON.stringify(input.recommendations))
    .replace("{{MONTHLY_SAVINGS}}", String(input.savings.monthlySavings))
    .replace("{{ANNUAL_SAVINGS}}", String(input.savings.annualSavings));
}

export async function generateFounderSummary(input: SummaryInput, provider?: SummaryProvider): Promise<SummaryOutput> {
  const prompts = {
    systemPrompt: loadPrompt("system.md"),
    userPrompt: interpolateUserPrompt(loadPrompt("user.md"), input),
  };

  if (!provider) {
    return buildFallbackSummary(input);
  }

  try {
    const response: SummaryProviderResponse = await provider(input, prompts);

    return {
      headline: response.headline.trim() || buildFallbackSummary(input).headline,
      subheadline: response.subheadline.trim() || buildFallbackSummary(input).subheadline,
      bullets: response.bullets.length > 0 ? response.bullets.slice(0, 5) : buildFallbackSummary(input).bullets,
      ctaHint: response.ctaHint?.trim() || buildFallbackSummary(input).ctaHint,
      generatedBy: "ai",
    };
  } catch {
    return buildFallbackSummary(input);
  }
}

export const summaryService = {
  generateFounderSummary,
  buildFallbackSummary,
};