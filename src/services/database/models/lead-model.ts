import "server-only";

import { Schema, model, models, type InferSchemaType } from "mongoose";

const leadSchema = new Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    teamSize: { type: Number, required: true, min: 1 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export type LeadDocument = InferSchemaType<typeof leadSchema>;

export const LeadModel = models.Lead ?? model("Lead", leadSchema);