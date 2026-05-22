import "server-only";

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
  try {
    const prompts = {
      systemPrompt: loadPrompt("system.md"),
      userPrompt: interpolateUserPrompt(loadPrompt("user.md"), input),
    };

    if (!provider) {
      return buildFallbackSummary(input);
    }

    const response: SummaryProviderResponse = await provider(input, prompts);
    const fallback = buildFallbackSummary(input);
    const bullets = Array.isArray(response.bullets) && response.bullets.length > 0 ? response.bullets.slice(0, 5) : fallback.bullets;

    return {
      headline: response.headline?.trim() || fallback.headline,
      subheadline: response.subheadline?.trim() || fallback.subheadline,
      bullets,
      ctaHint: response.ctaHint?.trim() || fallback.ctaHint,
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