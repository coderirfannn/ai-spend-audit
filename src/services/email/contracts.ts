export interface EmailMessage {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

export interface EmailSendResult {
  messageId: string;
  queued: boolean;
}

export interface LeadCaptureEmailInput {
  email: string;
  company: string;
  role: string;
  teamSize: number;
  auditSummary: string;
  monthlySavings: number;
  reportLink: string;
  highSavings: boolean;
}
