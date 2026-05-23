"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { SummaryOutput } from "@/services/summary/contracts";
import type { AuditEngineResult } from "@/services/audit-engine/contracts";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

const leadCaptureFormSchema = z.object({
  email: z.string().trim().email("Enter a valid work email."),
  company: z.string().trim().min(1, "Company is required."),
  role: z.string().trim().min(1, "Role is required."),
  honeypot: z.string().optional(),
});

type LeadCaptureFormValues = z.infer<typeof leadCaptureFormSchema>;

type LeadCaptureFormProps = {
  result: AuditEngineResult;
  summary: SummaryOutput;
  teamSize: number;
  tools: Array<{ tool: string; plan: string; spend: number; seats: number }>;
};

function money(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function LeadCaptureForm({ result, summary, teamSize, tools }: LeadCaptureFormProps) {
  const [submittedAt] = useState(() => Date.now());
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [reportLink, setReportLink] = useState<string | null>(null);

  const isHighSavings = result.monthlySavings > 500;

  const form = useForm<LeadCaptureFormValues>({
    resolver: zodResolver(leadCaptureFormSchema),
    defaultValues: {
      email: "",
      company: "",
      role: "",
      honeypot: "",
    },
    mode: "onBlur",
  });

  const ctaLabel = useMemo(() => {
    if (status === "submitting") {
      return "Sending...";
    }

    return isHighSavings ? "Get high-savings report" : "Email me the report";
  }, [isHighSavings, status]);

  const onSubmit = form.handleSubmit(async (values) => {
    setStatus("submitting");
    setMessage(null);

    try {
      const response = await fetch("/api/lead-capture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lead: {
            email: values.email,
            company: values.company,
            role: values.role,
            teamSize,
            summary: summary.subheadline,
            monthlySavings: result.monthlySavings,
            honeypot: values.honeypot,
            submittedAt,
          },
          audit: {
            tools,
            recommendations: result.recommendations,
            savings: {
              monthlySpend: result.monthlySpend,
              annualSpend: result.annualSpend,
              monthlySavings: result.monthlySavings,
              annualSavings: result.annualSavings,
            },
            summary,
          },
        }),
      });

      const payload = (await response.json()) as
        | { ok: true; data: { reportLink: string; notificationQueued: boolean } }
        | { ok: false; message?: string };

      if (!response.ok || !payload.ok) {
        setStatus("error");
        setMessage(payload.ok ? "Unable to capture the lead right now." : payload.message ?? "Unable to capture the lead right now.");
        return;
      }

      setStatus("success");
      setReportLink(payload.data.reportLink);
      setMessage(payload.data.notificationQueued ? "Report emailed successfully." : "Lead saved. Email delivery will retry or can be triggered again later.");
    } catch {
      setStatus("error");
      setMessage("Unable to submit the form right now.");
    }
  });

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent-muted)]">Lead capture</p>
          <h2 className="mt-3 font-display text-2xl text-[var(--text-primary)] sm:text-3xl">
            Send the audit to your inbox
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
            Capture the report after the audit only. We’ll store the lead, email the summary, and create a shareable report link.
          </p>
        </div>

        <div className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${isHighSavings ? "border-[var(--warning)]/20 bg-[var(--warning)]/10 text-[var(--warning)]" : "border-[var(--success)]/20 bg-[var(--success)]/10 text-[var(--success)]"}`}>
          {isHighSavings ? "High savings notification" : "Standard report email"}
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-6 grid gap-4 lg:grid-cols-3" aria-busy={status === "submitting"} aria-live="polite">
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
          {...form.register("honeypot")}
        />

        <label className="block lg:col-span-1">
          <span className="text-sm font-medium text-[var(--text-primary)]">Email</span>
          <input
            type="email"
            autoComplete="email"
            {...form.register("email")}
            className="mt-2 w-full rounded-[var(--radius-2)] border border-[var(--panel-border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition-[border-color,box-shadow,transform] duration-[var(--motion-default)] focus-visible:border-[var(--focus-ring)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
            placeholder="founder@company.com"
            aria-invalid={Boolean(form.formState.errors.email?.message)}
          />
          <p className="mt-2 text-sm text-[var(--danger)]">{form.formState.errors.email?.message}</p>
        </label>

        <label className="block lg:col-span-1">
          <span className="text-sm font-medium text-[var(--text-primary)]">Company</span>
          <input
            type="text"
            autoComplete="organization"
            {...form.register("company")}
            className="mt-2 w-full rounded-[var(--radius-2)] border border-[var(--panel-border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition-[border-color,box-shadow,transform] duration-[var(--motion-default)] focus-visible:border-[var(--focus-ring)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
            placeholder="Acme Inc."
            aria-invalid={Boolean(form.formState.errors.company?.message)}
          />
          <p className="mt-2 text-sm text-[var(--danger)]">{form.formState.errors.company?.message}</p>
        </label>

        <label className="block lg:col-span-1">
          <span className="text-sm font-medium text-[var(--text-primary)]">Role</span>
          <input
            type="text"
            autoComplete="organization-title"
            {...form.register("role")}
            className="mt-2 w-full rounded-[var(--radius-2)] border border-[var(--panel-border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition-[border-color,box-shadow,transform] duration-[var(--motion-default)] focus-visible:border-[var(--focus-ring)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
            placeholder="Founder"
            aria-invalid={Boolean(form.formState.errors.role?.message)}
          />
          <p className="mt-2 text-sm text-[var(--danger)]">{form.formState.errors.role?.message}</p>
        </label>

        <div className="lg:col-span-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[var(--text-secondary)]">Monthly savings: <span className="font-semibold text-[var(--text-primary)]">{money(result.monthlySavings)}</span></p>
          <Button
            type="submit"
            isLoading={status === "submitting"}
          >
            {ctaLabel}
          </Button>
        </div>

        {message ? (
          <div role={status === "error" ? "alert" : "status"} className={`lg:col-span-3 rounded-[var(--radius-2)] border p-4 text-sm ${status === "error" ? "border-[var(--danger)]/20 bg-[var(--danger)]/10 text-[var(--text-primary)]" : "border-[var(--success)]/20 bg-[var(--success)]/10 text-[var(--text-primary)]"}`}>
            <div className="flex items-start gap-3">
              {status === "submitting" ? <LoadingSkeleton width={12} height={12} rounded="full" /> : null}
              <div>
                <p>{message}</p>
                {reportLink ? (
                  <div className="mt-2">
                    <a href={reportLink} className="font-semibold text-[var(--text-primary)] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]">
                      Open report link
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </form>
    </Card>
  );
}