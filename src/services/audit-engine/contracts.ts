export type AuditSeverity = "low" | "medium" | "high" | "critical";
export type AuditCategory = "tracking" | "attribution" | "waste" | "anomaly" | "opportunity";

export interface AuditInput {
  companyName: string;
  websiteUrl?: string;
  platformIds?: string[];
  spendWindowDays?: number;
}

export interface AuditFinding {
  category: AuditCategory;
  severity: AuditSeverity;
  title: string;
  detail: string;
}

export interface AuditResult {
  score: number;
  findings: AuditFinding[];
  generatedAt: string;
}
