import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { connectToDatabase, ShareResultModel } from "@/services/database";

function money(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function getPublicBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_SHARE_BASE_URL?.trim() || process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000";

  return baseUrl.replace(/\/$/, "");
}

type ShareSnapshot = {
  shareId: string;
  tools: Array<{
    tool: string;
    plan: string;
    spend: number;
    seats: number;
  }>;
  recommendations: Array<{
    tool: string;
    recommendedTool: string;
    recommendedPlan: string;
    rationale: string;
    monthlySpend: number;
    monthlySavings: number;
    annualSavings: number;
    alternatives: string[];
  }>;
  savings: {
    monthlySavings: number;
    annualSavings: number;
    monthlySpend: number;
    annualSpend: number;
  };
  summary: {
    headline: string;
    subheadline: string;
    bullets: string[];
    ctaHint: string;
  };
};

async function getShareReport(id: string): Promise<ShareSnapshot | null> {
  await connectToDatabase();

  return (await ShareResultModel.findOne().where("shareId").equals(id).lean()) as ShareSnapshot | null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const report = await getShareReport(id);
  const baseUrl = getPublicBaseUrl();
  const title = report ? `${report.summary.headline} | AI Spend Audit` : "Shared Audit | AI Spend Audit";
  const description = report
    ? `${report.summary.subheadline} Savings: ${money(report.savings.monthlySavings)} monthly and ${money(report.savings.annualSavings)} annual.`
    : "Review a shared AI spend audit snapshot with savings, recommendations, and tool usage details.";
  const url = `${baseUrl}/share/${id}`;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url,
      siteName: "AI Spend Audit",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

interface SharePageProps {
  params: Promise<{ id: string }>;
}

export default async function SharePage({ params }: SharePageProps) {
  const { id } = await params;
  const report = await getShareReport(id);

  if (!report) {
    notFound();
  }

  return (
    <main className="relative mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-12 lg:py-16">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl sm:p-8 lg:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200/80">Share snapshot</p>
        <h1 className="mt-4 max-w-4xl font-display text-4xl tracking-tight text-white sm:text-5xl">
          {report.summary.headline}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          {report.summary.subheadline}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-medium text-slate-300">Monthly savings</p>
            <p className="mt-2 font-display text-3xl text-white sm:text-4xl">{money(report.savings.monthlySavings)}</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-medium text-slate-300">Annual savings</p>
            <p className="mt-2 font-display text-3xl text-white sm:text-4xl">{money(report.savings.annualSavings)}</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-medium text-slate-300">Current spend</p>
            <p className="mt-2 font-display text-3xl text-white sm:text-4xl">{money(report.savings.monthlySpend)}</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-medium text-slate-300">Projected annual spend</p>
            <p className="mt-2 font-display text-3xl text-white sm:text-4xl">{money(report.savings.annualSpend)}</p>
          </div>
        </div>

        <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-slate-950/45 p-5 backdrop-blur-xl sm:p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200/80">Tools reviewed</p>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {report.tools.map((tool) => (
              <article key={`${tool.tool}-${tool.plan}`} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-xl text-white">{tool.tool}</h2>
                    <p className="mt-1 text-sm text-slate-300">Plan: {tool.plan}</p>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">
                    {tool.seats} seats
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-300">Monthly spend: <span className="font-semibold text-white">{money(tool.spend)}</span></p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-slate-950/45 p-5 backdrop-blur-xl sm:p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200/80">Recommendations</p>
          <div className="mt-4 space-y-4">
            {report.recommendations.map((recommendation) => (
              <article key={recommendation.tool} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="font-display text-xl text-white">{recommendation.tool}</h2>
                    <p className="mt-1 text-sm text-slate-300">
                      Move to <span className="font-semibold text-white">{recommendation.recommendedTool}</span> · {recommendation.recommendedPlan}
                    </p>
                  </div>
                  <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">
                    Save {money(recommendation.monthlySavings)} / mo
                  </div>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-300">{recommendation.rationale}</p>
                {recommendation.alternatives.length ? (
                  <p className="mt-3 text-sm text-slate-400">
                    Alternatives: {recommendation.alternatives.join(", ")}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-slate-950/45 p-5 backdrop-blur-xl sm:p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200/80">Public summary</p>
          <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">{report.summary.ctaHint}</p>
          <ul className="mt-5 space-y-3">
            {report.summary.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-3 text-sm leading-7 text-slate-300 sm:text-base">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-300" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/results"
            className="inline-flex items-center justify-center rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
          >
            View results
          </Link>
          <Link
            href="/audit"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Back to audit
          </Link>
        </div>

        <p className="mt-6 text-xs uppercase tracking-[0.2em] text-slate-500">Snapshot ID: {id}</p>
      </section>
    </main>
  );
}
