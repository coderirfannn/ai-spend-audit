"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TrustSystemSection } from "@/components/shared/trust-system-section";
import dynamic from "next/dynamic";
import { auditEngine } from "@/services/audit-engine";
import { buildFallbackSummary } from "@/services/summary/fallback";
import { useAuditFormStore } from "@/stores/use-audit-form-store";

const LeadCaptureForm = dynamic(() => import("./lead-capture-form").then((module) => module.LeadCaptureForm), {
  ssr: false,
  loading: () => (
    <Card>
      <p className="text-sm font-semibold text-[var(--text-secondary)]">Lead capture</p>
      <div className="mt-4 space-y-3">
        <div className="h-10 rounded-[var(--radius-2)] bg-[var(--surface)] animate-pulse" />
        <div className="h-10 rounded-[var(--radius-2)] bg-[var(--surface)] animate-pulse" />
        <div className="h-10 rounded-[var(--radius-2)] bg-[var(--surface)] animate-pulse" />
      </div>
    </Card>
  ),
});

function money(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function ClipboardButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
    >
      {copied ? "Copied" : label}
    </button>
  );
}

function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-2)] border border-[var(--panel-border)] bg-[var(--card)] p-[var(--space-3)]">
      <p className="text-sm font-medium text-[var(--text-secondary)]">{label}</p>
      <p className="mt-2 font-display text-3xl text-[var(--text-primary)] sm:text-4xl">{value}</p>
    </div>
  );
}

export function ResultDashboard() {
  const draft = useAuditFormStore((state) => state.draft);
  const hydrated = useAuditFormStore((state) => state.hydrated);

  useEffect(() => {
    void useAuditFormStore.persist.rehydrate();
  }, []);

  const result = useMemo(() => {
    if (!draft.tools.length || !draft.primaryUseCase.trim()) {
      return null;
    }

    try {
      return auditEngine.analyzeAuditSpend({
        teamSize: draft.teamSize,
        useCase: draft.primaryUseCase,
        tools: draft.tools.map((tool) => ({
          tool: tool.tool,
          plan: tool.plan,
          spend: tool.monthlySpend,
          seats: tool.seats,
        })),
      });
    } catch {
      return null;
    }
  }, [draft]);

  const summary = useMemo(() => {
    if (!result) {
      return null;
    }

    return buildFallbackSummary({
      tools: draft.tools.map((tool) => ({
        tool: tool.tool,
        plan: tool.plan,
        spend: tool.monthlySpend,
        seats: tool.seats,
      })),
      recommendations: result.recommendations,
      savings: {
        monthlySavings: result.monthlySavings,
        annualSavings: result.annualSavings,
      },
    });
  }, [draft.tools, result]);

  if (!hydrated) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-12 lg:py-16">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl sm:p-8 lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200/80">Results</p>
          <h1 className="mt-4 font-display text-4xl tracking-tight text-white sm:text-5xl">Preparing your dashboard</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Restoring the saved audit draft so we can calculate your spend savings.
          </p>
        </section>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-12 lg:py-16">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl sm:p-8 lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200/80">Results</p>
          <h1 className="mt-4 font-display text-4xl tracking-tight text-white sm:text-5xl">No audit data yet</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Run the audit form first so this dashboard can calculate monthly and annual savings.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/audit"
              className="inline-flex items-center justify-center rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
            >
              Go to audit
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const savingsThreshold = result.monthlySavings;
  const showCredexConsultation = savingsThreshold > 500;
  const showOptimizedState = savingsThreshold < 100;
  const shareText = `AI Spend Audit: ${money(result.monthlySavings)} monthly savings, ${money(result.annualSavings)} annual savings.`;

  return (
    <main className="relative mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-12 lg:py-16">
      <section className="space-y-6">
        {/* Savings hero */}
        <Card>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Savings</p>
              <div className="mt-2 flex items-end gap-6">
                <div>
                  <div className="text-4xl font-display text-[var(--text-primary)]">{money(result.monthlySavings)}</div>
                  <p className="text-sm text-[var(--text-secondary)]">Monthly</p>
                </div>
                <div>
                  <div className="text-2xl font-display text-[var(--text-primary)]">{money(result.annualSavings)}</div>
                  <p className="text-sm text-[var(--text-secondary)]">Annual</p>
                </div>
                <div>
                  <Badge tone={summary?.generatedBy === "ai" ? "default" : "muted"}>{summary?.generatedBy === "ai" ? "AI generated" : "Template"}</Badge>
                </div>
              </div>
              <p className="mt-3 text-sm text-[var(--text-secondary)]">{summary?.subheadline}</p>
            </div>

            <div className="flex gap-3">
              <ClipboardButton text={shareText} label="Copy summary" />
              <Link href="/audit" className="inline-flex items-center justify-center rounded-[var(--radius-2)] bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)]">Back to audit</Link>
            </div>
          </div>
        </Card>

        {/* Insights & trends */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <p className="text-sm font-semibold text-[var(--text-secondary)]">Founder summary</p>
            <h3 className="mt-2 font-display text-lg text-[var(--text-primary)]">{summary?.headline}</h3>
            <ul className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
              {summary?.bullets.map((b) => (
                <li key={b} className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-[var(--accent)]" />{b}</li>
              ))}
            </ul>
          </Card>

          <Card>
            <p className="text-sm font-semibold text-[var(--text-secondary)]">Cost trend</p>
            <div className="mt-3 h-20">
              <svg viewBox="0 0 200 40" width="100%" height="100%" preserveAspectRatio="none" aria-hidden>
                {/* simple synthetic trend */}
                <path d={`M0 30 L50 ${20} L100 ${15} L150 ${10} L200 ${12}`} stroke="var(--accent)" strokeWidth="2" fill="none" />
              </svg>
            </div>
          </Card>

          <Card>
            <p className="text-sm font-semibold text-[var(--text-secondary)]">Current spend</p>
            <div className="mt-2 text-lg text-[var(--text-primary)]">{money(result.monthlySpend)} / mo</div>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">Projected annual: {money(result.annualSpend)}</p>
          </Card>
        </div>

        {/* Per-tool accordions */}
        <div>
          <h2 className="font-display text-2xl text-[var(--text-primary)] mt-6">Recommendations & details</h2>
          <div className="mt-4 space-y-3">
            {result.recommendations.map((recommendation, index) => {
              const finding = result.findings.find((item) => item.tool === recommendation.tool) ?? null;

              return (
                <details key={`${recommendation.tool}-${index}`} className="group rounded-[var(--radius-2)] border border-[var(--panel-border)] bg-[var(--card)] p-4">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <div>
                      <p className="text-sm text-[var(--text-secondary)]">{recommendation.tool}</p>
                      <p className="font-medium text-[var(--text-primary)]">{recommendation.recommendedTool} · {recommendation.recommendedPlan}</p>
                    </div>
                    <div className="text-sm font-semibold text-[var(--text-primary)]">{money(recommendation.monthlySavings)}/mo</div>
                  </summary>

                  <div className="mt-3 border-t border-[var(--panel-border)] pt-3 text-sm text-[var(--text-secondary)]">
                    <p className="mb-2">{recommendation.rationale}</p>
                    {finding ? <p className="mb-2">Savings detail: {money(finding.monthlySavings)} monthly / {money(finding.annualSavings)} annual — {finding.title}</p> : null}
                    <div className="flex gap-2 mt-2">
                      <Button variant="ghost" size="sm">Copy recommendation</Button>
                      <Button variant="primary" size="sm">Take action</Button>
                    </div>
                  </div>
                </details>
              );
            })}
          </div>
        </div>

        {/* Actions & shareable summary */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Card>
            <p className="text-sm font-semibold text-[var(--text-secondary)]">Shareable summary</p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">Copy a concise, professional summary that can be pasted into Slack, email, or a founder update.</p>
            <div className="mt-4">
              <ClipboardButton text={shareText} label="Copy share text" />
            </div>
          </Card>

          <div>
            {summary ? (
              <Card>
                <p className="text-sm font-semibold text-[var(--text-secondary)]">Executive summary</p>
                <h4 className="mt-2 font-display text-lg text-[var(--text-primary)]">{summary.headline}</h4>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">{summary.subheadline}</p>
                <div className="mt-4">
                  <LeadCaptureForm
                    result={result}
                    summary={summary}
                    teamSize={draft.teamSize}
                    tools={draft.tools.map((tool) => ({ tool: tool.tool, plan: tool.plan, spend: tool.monthlySpend, seats: tool.seats }))}
                  />
                </div>
              </Card>
            ) : null}
          </div>
        </div>

        <TrustSystemSection
          title="Audit methodology"
          description="The report is explicit about pricing logic, savings logic, limitations, security, and data handling so teams can review the assumptions before taking action."
          includeCTA={true}
        />

        {/* Consultation / optimized state banners */}
        {showCredexConsultation ? (
          <Card>
            <p className="text-sm font-semibold text-[var(--warning)]">Consultation recommended</p>
            <h3 className="mt-2 font-display text-lg text-[var(--text-primary)]">Savings above $500 monthly deserve a deeper review</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">Book a consult to evaluate consolidation, pricing negotiations, or rollout strategy.</p>
            <div className="mt-4">
              <Button variant="primary" size="md">Book consultation</Button>
            </div>
          </Card>
        ) : null}

        {showOptimizedState ? (
          <Card>
            <p className="text-sm font-semibold text-[var(--success)]">Optimized state</p>
            <h3 className="mt-2 font-display text-lg text-[var(--text-primary)]">Your current setup is already efficient</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">Savings are under $100 monthly — a light review is recommended.</p>
          </Card>
        ) : null}
      </section>
    </main>
  );
}