import { z } from "zod";

export const supportedAuditTools = [
  "Cursor",
  "Copilot",
  "Claude",
  "ChatGPT",
  "OpenAI API",
  "Anthropic API",
  "Gemini",
  "Windsurf",
] as const;

const spendToolEntrySchema = z.object({
  tool: z.enum(supportedAuditTools, {
    message: "Select a supported AI tool.",
  }),
  plan: z.string().trim().min(1, "Plan is required."),
  monthlySpend: z.coerce.number().positive("Monthly spend must be greater than 0."),
  seats: z.coerce.number().int("Seats must be a whole number.").positive("Seats must be greater than 0."),
});

export const auditFormSchema = z.object({
  tools: z.array(spendToolEntrySchema).min(1, "Add at least one tool."),
  teamSize: z.coerce.number().int("Team size must be a whole number.").positive("Team size must be greater than 0."),
  primaryUseCase: z.string().trim().min(1, "Primary use case is required."),
});

export type SpendToolEntry = z.infer<typeof spendToolEntrySchema>;
export type AuditFormValues = z.infer<typeof auditFormSchema>;

export const defaultAuditFormValues: AuditFormValues = {
  tools: [
    {
      tool: "Cursor",
      plan: "",
      monthlySpend: 0,
      seats: 1,
    },
  ],
  teamSize: 1,
  primaryUseCase: "",
};