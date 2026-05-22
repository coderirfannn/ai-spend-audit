import Link from "next/link";
import { notFound } from "next/navigation";
import { connectToDatabase, ShareResultModel } from "@/services/database";

function money(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export const metadata = {
  title: "Shared Audit | AI Spend Audit",
  description: "Review a shared AI spend audit snapshot.",
};

interface SharePageProps {
  params: Promise<{ id: string }>;
}

export default async function SharePage({ params }: SharePageProps) {
  const { id } = await params;
  await connectToDatabase();
  const report = (await ShareResultModel.findOne().where("shareId").equals(id).lean()) as
    | {
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
        };
      }
    | null;

  if (!report) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 sm:px-8 lg:px-12 lg:py-16">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl sm:p-8 lg:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200/80">Share snapshot</p>
        <h1 className="mt-4 font-display text-4xl tracking-tight text-white sm:text-5xl">Shared audit link</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          Snapshot ID: <span className="font-semibold text-white">{id}</span>
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
            <p className="text-sm font-medium text-slate-300">Monthly spend</p>
            <p className="mt-2 font-display text-3xl text-white sm:text-4xl">{money(report.savings.monthlySpend)}</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-medium text-slate-300">Annual spend</p>
            <p className="mt-2 font-display text-3xl text-white sm:text-4xl">{money(report.savings.annualSpend)}</p>
          </div>
        </div>

        <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-slate-950/45 p-5 backdrop-blur-xl sm:p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200/80">Founder summary</p>
          <h2 className="mt-3 font-display text-2xl text-white sm:text-3xl">{report.summary.headline}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">{report.summary.subheadline}</p>
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
      </section>
    </main>
  );
}
