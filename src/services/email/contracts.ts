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
