import type { AuditFinding } from "@/services/audit-engine/contracts";

export interface SummaryInput {
  auditId: string;
  findings: AuditFinding[];
}

export interface SummaryOutput {
  title: string;
  bullets: string[];
  ctaHint?: string;
}
