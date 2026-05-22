export type AuditRecommendationType =
  | "right-size-seats"
  | "downgrade-plan"
  | "consolidate-vendor"
  | "use-case-alternative";

export type AuditFindingSeverity = "low" | "medium" | "high";

export interface AuditToolInput {
  tool: string;
  plan: string;
  spend: number;
  seats: number;
}

export interface AuditEngineInput {
  tools: AuditToolInput[];
  teamSize: number;
  useCase: string;
}

export interface AuditFinding {
  tool: string;
  type: AuditRecommendationType;
  severity: AuditFindingSeverity;
  title: string;
  detail: string;
  monthlySavings: number;
  annualSavings: number;
}

export interface AuditRecommendation {
  tool: string;
  recommendedTool: string;
  recommendedPlan: string;
  rationale: string;
  monthlySpend: number;
  monthlySavings: number;
  annualSavings: number;
  alternatives: string[];
}

export interface AuditEngineResult {
  monthlySpend: number;
  annualSpend: number;
  monthlySavings: number;
  annualSavings: number;
  reasoning: string[];
  findings: AuditFinding[];
  recommendations: AuditRecommendation[];
}
