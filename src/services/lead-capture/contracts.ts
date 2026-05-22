export interface LeadCaptureInput {
  email: string;
  company: string;
  role: string;
  teamSize: number;
  summary: string;
  monthlySavings: number;
  honeypot?: string | undefined;
  submittedAt: number;
}

export interface LeadCaptureResult {
  leadId: string;
  shareId: string;
  reportLink: string;
  notificationQueued: boolean;
  capturedAt: string;
}

export interface LeadCaptureError {
  code: "invalid_payload" | "spam_detected" | "duplicate_submission" | "database_error" | "email_error";
  message: string;
}
