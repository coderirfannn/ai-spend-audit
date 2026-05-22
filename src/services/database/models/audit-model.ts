import "server-only";

import { Schema, model, models, type InferSchemaType } from "mongoose";
import type { PersistedRecommendation, PersistedSavings, PersistedSummary, PersistedTool } from "../types";

const toolSchema = new Schema<PersistedTool>(
  {
    tool: { type: String, required: true, trim: true },
    plan: { type: String, required: true, trim: true },
    spend: { type: Number, required: true, min: 0 },
    seats: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const recommendationSchema = new Schema<PersistedRecommendation>(
  {
    tool: { type: String, required: true, trim: true },
    recommendedTool: { type: String, required: true, trim: true },
    recommendedPlan: { type: String, required: true, trim: true },
    rationale: { type: String, required: true, trim: true },
    monthlySpend: { type: Number, required: true, min: 0 },
    monthlySavings: { type: Number, required: true, min: 0 },
    annualSavings: { type: Number, required: true, min: 0 },
    alternatives: { type: [String], required: true, default: [] },
  },
  { _id: false }
);

const savingsSchema = new Schema<PersistedSavings>(
  {
    monthlySpend: { type: Number, required: true, min: 0 },
    annualSpend: { type: Number, required: true, min: 0 },
    monthlySavings: { type: Number, required: true, min: 0 },
    annualSavings: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const summarySchema = new Schema<PersistedSummary>(
  {
    headline: { type: String, required: true, trim: true },
    subheadline: { type: String, required: true, trim: true },
    bullets: { type: [String], required: true, default: [] },
    ctaHint: { type: String, required: true, trim: true },
    generatedBy: { type: String, required: true, enum: ["ai", "fallback"] },
  },
  { _id: false }
);

const auditSchema = new Schema(
  {
    tools: { type: [toolSchema], required: true, default: [] },
    recommendations: { type: [recommendationSchema], required: true, default: [] },
    savings: { type: savingsSchema, required: true },
    summary: { type: summarySchema, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export type AuditDocument = InferSchemaType<typeof auditSchema>;

export const AuditModel = models.Audit ?? model("Audit", auditSchema);