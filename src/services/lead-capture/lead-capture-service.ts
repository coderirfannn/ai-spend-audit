import "server-only";

import { randomUUID } from "node:crypto";
import { connectToDatabase, AuditModel, LeadModel, ShareResultModel } from "@/services/database";
import type { PersistedRecommendation, PersistedSavings, PersistedSummary, PersistedTool } from "@/services/database/types";
import type { LeadCaptureEmailInput } from "@/services/email/contracts";
import { sendLeadCaptureEmail } from "@/services/email/resend";
import type { LeadCaptureError, LeadCaptureInput, LeadCaptureResult } from "./contracts";

const MINIMUM_DWELL_TIME_MS = 2500;
const DUPLICATE_SUPPRESSION_WINDOW_MS = 1000 * 60 * 60 * 24;

function createError(code: LeadCaptureError["code"], message: string): LeadCaptureError {
  return { code, message };
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function money(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function buildSummaryText(summary: string, monthlySavings: number, reportLink: string): string {
  return `${summary} Monthly savings: ${money(monthlySavings)}. Report: ${reportLink}`;
}

export async function captureLeadAndSendEmail(
  input: LeadCaptureInput,
  payload: {
    tools: PersistedTool[];
    recommendations: PersistedRecommendation[];
    savings: PersistedSavings;
    summary: PersistedSummary;
  }
): Promise<LeadCaptureResult | LeadCaptureError> {
  const email = normalizeEmail(input.email);
  const company = input.company.trim();
  const role = input.role.trim();

  if (!email || !company || !role || !input.summary) {
    return createError("invalid_payload", "Missing required lead capture fields.");
  }

  if (input.honeypot?.trim()) {
    return createError("spam_detected", "Submission rejected.");
  }

  if (!Number.isFinite(input.submittedAt) || Date.now() - input.submittedAt < MINIMUM_DWELL_TIME_MS) {
    return createError("spam_detected", "Submission rejected.");
  }

  await connectToDatabase();

  const recentDuplicate = await LeadModel.findOne()
    .where("email")
    .equals(email)
    .where("company")
    .equals(company)
    .where("createdAt")
    .gte(Date.now() - DUPLICATE_SUPPRESSION_WINDOW_MS)
    .lean();

  if (recentDuplicate) {
    return createError("duplicate_submission", "A recent submission already exists for this lead.");
  }

  const lead = await LeadModel.create({
    email,
    company,
    role,
    teamSize: input.teamSize,
  });

  const shareId = randomUUID();
  const reportLink = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/share/${shareId}`;
  const audit = (await AuditModel.create({
    tools: payload.tools,
    recommendations: payload.recommendations,
    savings: payload.savings,
    summary: payload.summary,
  })) as { _id: unknown };

  await ShareResultModel.create({
    auditId: audit._id,
    shareId,
    tools: payload.tools,
    recommendations: payload.recommendations,
    savings: payload.savings,
    summary: payload.summary,
  });

  try {
    const emailInput: LeadCaptureEmailInput = {
      email,
      company,
      role,
      teamSize: input.teamSize,
      auditSummary: buildSummaryText(input.summary, input.monthlySavings, reportLink),
      monthlySavings: input.monthlySavings,
      reportLink,
      highSavings: input.monthlySavings > 500,
    };

    await sendLeadCaptureEmail(emailInput);
    return {
      leadId: String(lead._id),
      shareId,
      reportLink,
      notificationQueued: true,
      capturedAt: new Date().toISOString(),
    };
  } catch {
    return {
      leadId: String(lead._id),
      shareId,
      reportLink,
      notificationQueued: false,
      capturedAt: new Date().toISOString(),
    };
  }
}