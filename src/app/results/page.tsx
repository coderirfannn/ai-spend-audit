import Link from "next/link";

export const metadata = {
  title: "Audit Results | AI Spend Audit",
  description: "Review your saved AI spend audit summary.",
};

export default function ResultsPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10 sm:px-8 lg:px-12 lg:py-16">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl sm:p-8 lg:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200/80">Results</p>
        <h1 className="mt-4 font-display text-4xl tracking-tight text-white sm:text-5xl">Your AI spend summary</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          This route is wired and production-safe. Connect your audit engine output here to display savings, overlap,
          and optimization recommendations.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/audit"
            className="inline-flex items-center justify-center rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
          >
            Back to audit
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Go to home
          </Link>
        </div>
      </section>
    </main>
  );
}
