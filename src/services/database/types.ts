export interface PersistedTool {
  tool: string;
  plan: string;
  spend: number;
  seats: number;
}

export interface PersistedRecommendation {
  tool: string;
  recommendedTool: string;
  recommendedPlan: string;
  rationale: string;
  monthlySpend: number;
  monthlySavings: number;
  annualSavings: number;
  alternatives: string[];
}

export interface PersistedSummary {
  headline: string;
  subheadline: string;
  bullets: string[];
  ctaHint: string;
  generatedBy: "ai" | "fallback";
}

export interface PersistedSavings {
  monthlySpend: number;
  annualSpend: number;
  monthlySavings: number;
  annualSavings: number;
}