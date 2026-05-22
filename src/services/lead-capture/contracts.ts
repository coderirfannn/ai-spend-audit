export interface LeadCaptureInput {
  email: string;
  name?: string;
  company?: string;
  auditId?: string;
}

export interface LeadCaptureResult {
  leadId: string;
  capturedAt: string;
}
