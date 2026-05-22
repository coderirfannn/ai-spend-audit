import "server-only";

import { Resend } from "resend";
import type { EmailMessage, EmailSendResult, LeadCaptureEmailInput } from "./contracts";

function money(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY environment variable.");
  }

  return new Resend(apiKey);
}

function getFromAddress(): string {
  const fromAddress = process.env.RESEND_FROM_EMAIL;
  if (!fromAddress) {
    throw new Error("Missing RESEND_FROM_EMAIL environment variable.");
  }

  return fromAddress;
}

function getReplyToAddress(): string | undefined {
  return process.env.RESEND_REPLY_TO_EMAIL?.trim() || undefined;
}

function buildHtmlPayload(input: LeadCaptureEmailInput): string {
  return `
    <div style="font-family: Inter, Arial, sans-serif; background:#020617; color:#f8fafc; padding:24px;">
      <div style="max-width:640px;margin:0 auto;border:1px solid rgba(255,255,255,0.12);border-radius:24px;padding:28px;background:rgba(15,23,42,0.92);">
        <p style="text-transform:uppercase;letter-spacing:.18em;font-size:12px;color:#bae6fd;margin:0 0 12px;">AI Spend Audit</p>
        <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;">Your audit report is ready</h1>
        <p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:#cbd5e1;">${input.auditSummary}</p>
        <div style="margin:0 0 20px;padding:18px;border-radius:18px;background:rgba(255,255,255,0.04);">
          <p style="margin:0 0 8px;font-size:14px;color:#94a3b8;">Monthly savings</p>
          <p style="margin:0;font-size:30px;font-weight:700;color:#ffffff;">${money(input.monthlySavings)}</p>
        </div>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#cbd5e1;">Open the full report: <a href="${input.reportLink}" style="color:#7dd3fc;text-decoration:none;">${input.reportLink}</a></p>
        <p style="margin:0;font-size:14px;line-height:1.7;color:#94a3b8;">Captured for ${input.company} • ${input.role} • Team size ${input.teamSize}</p>
      </div>
    </div>
  `;
}

function buildTextPayload(input: LeadCaptureEmailInput): string {
  return [
    "AI Spend Audit",
    "Your audit report is ready.",
    input.auditSummary,
    `Monthly savings: ${money(input.monthlySavings)}`,
    `Report: ${input.reportLink}`,
    `Company: ${input.company}`,
    `Role: ${input.role}`,
    `Team size: ${input.teamSize}`,
  ].join("\n\n");
}

export async function sendEmail(message: EmailMessage): Promise<EmailSendResult> {
  const resend = getResendClient();
  const from = getFromAddress();
  const replyTo = getReplyToAddress();
  const emailPayload: any = {
    from,
    to: message.to,
    subject: message.subject,
  };

  if (message.html) {
    emailPayload.html = message.html;
  }

  if (message.text) {
    emailPayload.text = message.text;
  }

  if (replyTo) {
    emailPayload.replyTo = replyTo;
  }

  const response = await resend.emails.send(emailPayload);

  if (response.error) {
    throw new Error(response.error.message);
  }

  return {
    messageId: response.data?.id ?? "queued",
    queued: true,
  };
}

export async function sendLeadCaptureEmail(input: LeadCaptureEmailInput): Promise<EmailSendResult> {
  const subject = input.highSavings ? "High-savings AI spend audit" : "Your AI spend audit summary";

  return sendEmail({
    to: input.email,
    subject,
    html: buildHtmlPayload(input),
    text: buildTextPayload(input),
  });
}