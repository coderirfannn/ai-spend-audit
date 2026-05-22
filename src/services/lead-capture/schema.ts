import { z } from "zod";

const persistedToolSchema = z.object({
  tool: z.string().trim().min(1),
  plan: z.string().trim().min(1),
  spend: z.coerce.number().min(0),
  seats: z.coerce.number().int().positive(),
});

export const leadCaptureRequestSchema = z.object({
  lead: z.object({
    email: z.string().trim().email("Enter a valid email address."),
    company: z.string().trim().min(1, "Company is required."),
    role: z.string().trim().min(1, "Role is required."),
    teamSize: z.coerce.number().int().positive("Team size must be greater than 0."),
    summary: z.string().trim().min(1, "Summary is required."),
    monthlySavings: z.coerce.number().min(0, "Monthly savings must be non-negative."),
    honeypot: z.string().optional(),
    submittedAt: z.coerce.number().positive("Submitted timestamp is required."),
  }),
  audit: z.object({
    tools: z.array(persistedToolSchema).min(1),
    recommendations: z.array(
      z.object({
        tool: z.string().trim().min(1),
        recommendedTool: z.string().trim().min(1),
        recommendedPlan: z.string().trim().min(1),
        rationale: z.string().trim().min(1),
        monthlySpend: z.coerce.number().min(0),
        monthlySavings: z.coerce.number().min(0),
        annualSavings: z.coerce.number().min(0),
        alternatives: z.array(z.string().trim().min(1)),
      })
    ),
    savings: z.object({
      monthlySpend: z.coerce.number().min(0),
      annualSpend: z.coerce.number().min(0),
      monthlySavings: z.coerce.number().min(0),
      annualSavings: z.coerce.number().min(0),
    }),
    summary: z.object({
      headline: z.string().trim().min(1),
      subheadline: z.string().trim().min(1),
      bullets: z.array(z.string().trim().min(1)),
      ctaHint: z.string().trim().min(1),
      generatedBy: z.enum(["ai", "fallback"]),
    }),
  }),
});

export type LeadCaptureRequest = z.infer<typeof leadCaptureRequestSchema>;