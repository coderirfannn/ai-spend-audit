"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { auditEngine } from "@/services/audit-engine";
import { buildFallbackSummary } from "@/services/summary/fallback";
import { useAuditFormStore } from "@/stores/use-audit-form-store";
import { LeadCaptureForm } from "./lead-capture-form";

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
    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <p className="text-sm font-medium text-slate-300">{label}</p>
      <p className="mt-2 font-display text-3xl text-white sm:text-4xl">{value}</p>
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
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200/80">Results</p>
            <h1 className="mt-4 font-display text-4xl tracking-tight text-white sm:text-5xl">Your AI spend summary</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              A shareable, rule-based summary of your current spend, recommended changes, and expected savings.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <ClipboardButton text={shareText} label="Copy summary" />
            <Link
              href="/audit"
              className="inline-flex items-center justify-center rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
            >
              Back to audit
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <ResultStat label="Monthly savings" value={money(result.monthlySavings)} />
          <ResultStat label="Annual savings" value={money(result.annualSavings)} />
          <ResultStat label="Current monthly spend" value={money(result.monthlySpend)} />
          <ResultStat label="Projected annual spend" value={money(result.annualSpend)} />
        </div>

        {summary ? (
          <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-slate-950/45 p-5 backdrop-blur-xl sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200/80">Founder summary</p>
                <h2 className="mt-3 font-display text-2xl text-white sm:text-3xl">{summary.headline}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">{summary.subheadline}</p>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">
                {summary.generatedBy === "ai" ? "AI generated" : "Fallback template"}
              </div>
            </div>
            <ul className="mt-5 space-y-3">
              {summary.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3 text-sm leading-7 text-slate-300 sm:text-base">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-300" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm font-medium text-slate-200">{summary.ctaHint}</p>
          </div>
        ) : null}

        {summary ? (
          <div className="mt-8">
            <LeadCaptureForm
              result={result}
              summary={summary}
              teamSize={draft.teamSize}
              tools={draft.tools.map((tool) => ({
                tool: tool.tool,
                plan: tool.plan,
                spend: tool.monthlySpend,
                seats: tool.seats,
              }))}
            />
          </div>
        ) : null}

        {showCredexConsultation ? (
          <div className="mt-8 rounded-[1.75rem] border border-amber-300/20 bg-amber-300/10 p-5 backdrop-blur-xl sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-100/90">Credex consultation</p>
            <h2 className="mt-3 font-display text-2xl text-white">Savings above $500 monthly deserve a deeper review</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-amber-50/90 sm:text-base">
              You have enough savings potential to justify a structured consultation on consolidation, pricing, and rollout strategy.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/audit"
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Book Credex consultation
              </Link>
            </div>
          </div>
        ) : null}

        {showOptimizedState ? (
          <div className="mt-8 rounded-[1.75rem] border border-emerald-300/20 bg-emerald-300/10 p-5 backdrop-blur-xl sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100/90">Optimized state</p>
            <h2 className="mt-3 font-display text-2xl text-white">Your current setup is already efficient</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-emerald-50/90 sm:text-base">
              Savings are under $100 monthly, so the dashboard is optimized for a light-touch review instead of aggressive downsells.
            </p>
          </div>
        ) : null}

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {result.recommendations.map((recommendation, index) => {
            const finding = result.findings.find((item) => item.tool === recommendation.tool) ?? null;

            return (
              <article key={`${recommendation.tool}-${index}`} className="rounded-[1.75rem] border border-white/10 bg-slate-950/45 p-5 backdrop-blur-xl sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-200/80">{recommendation.tool}</p>
                    <h3 className="mt-2 font-display text-2xl text-white">{recommendation.recommendedTool}</h3>
                    <p className="mt-1 text-sm text-slate-300">Recommendation: {recommendation.recommendedPlan}</p>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white">
                    Savings {money(recommendation.monthlySavings)} / mo
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Current plan</p>
                    <p className="mt-2 text-base font-medium text-white">{draft.tools[index]?.plan || recommendation.recommendedPlan}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Recommendation</p>
                    <p className="mt-2 text-base font-medium text-white">
                      {recommendation.recommendedTool} · {recommendation.recommendedPlan}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Reason</p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{recommendation.rationale}</p>
                </div>

                {finding ? (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Savings detail</p>
                    <p className="mt-2 text-sm leading-7 text-slate-300">
                      {money(finding.monthlySavings)} monthly and {money(finding.annualSavings)} annual savings from {finding.title.toLowerCase()}.
                    </p>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>

        <div className="mt-10 rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200/80">Shareable summary</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Copy a concise, professional summary that can be pasted into Slack, email, or a founder update.
              </p>
            </div>
            <ClipboardButton text={shareText} label="Copy share text" />
          </div>
        </div>
      </section>
    </main>
  );
}