"use client";

import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";

type TrustSystemSectionProps = {
  title: string;
  description: string;
  includeCTA?: boolean;
};

export function TrustSystemSection({ title, description, includeCTA = false }: TrustSystemSectionProps) {
  return (
    <Section eyebrow="Trust system" title={title} description={description}>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent-muted)]">Audit methodology</p>
          <div className="mt-3 space-y-3 text-sm text-[var(--text-secondary)]">
            <p>
              <span className="font-semibold text-[var(--text-primary)]">Pricing logic:</span> we use the plan, spend, seat count, and plan fit to compare current costs against lower-friction alternatives.
            </p>
            <p>
              <span className="font-semibold text-[var(--text-primary)]">Savings logic:</span> savings are estimated from duplicate tools, unused seats, and downgrade opportunities, then summarized as monthly and annual impact.
            </p>
            <p>
              <span className="font-semibold text-[var(--text-primary)]">Limitations:</span> this is a rule-based audit, so it does not inspect private account data, billing APIs, or actual product usage unless the user provides it.
            </p>
          </div>
        </Card>

        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent-muted)]">Security & transparency</p>
          <div className="mt-3 space-y-3 text-sm text-[var(--text-secondary)]">
            <p>
              <span className="font-semibold text-[var(--text-primary)]">Security note:</span> the audit is designed to work with only the information you enter. No API keys are required.
            </p>
            <p>
              <span className="font-semibold text-[var(--text-primary)]">Data handling:</span> form drafts persist locally in your browser via Zustand. Submitted lead data is only used to generate and deliver the audit report.
            </p>
            <p>
              <span className="font-semibold text-[var(--text-primary)]">Transparency:</span> recommendations are shown with the current state, proposed change, and rationale so teams can review the audit before taking action.
            </p>
          </div>
          {includeCTA ? <p className="mt-4 text-sm font-medium text-[var(--text-primary)]">Built for founder review, procurement review, and engineering review.</p> : null}
        </Card>
      </div>
    </Section>
  );
}
