import type { AuditEngineResult, AuditRecommendation } from "@/services/audit-engine/contracts";

export interface SummaryInput {
  tools: Array<{
    tool: string;
    plan: string;
    spend: number;
    seats: number;
  }>;
  recommendations: AuditRecommendation[];
  savings: Pick<AuditEngineResult, "monthlySavings" | "annualSavings">;
}

export interface SummaryOutput {
  headline: string;
  subheadline: string;
  bullets: string[];
  ctaHint: string;
  generatedBy: "ai" | "fallback";
}

export interface SummaryPromptBundle {
  systemPrompt: string;
  userPrompt: string;
}

export interface SummaryProviderResponse {
  headline: string;
  subheadline: string;
  bullets: string[];
  ctaHint?: string;
}

export type SummaryProvider = (input: SummaryInput, prompts: SummaryPromptBundle) => Promise<SummaryProviderResponse>;
