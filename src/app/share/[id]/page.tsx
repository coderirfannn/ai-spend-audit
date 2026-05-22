import Link from "next/link";

export const metadata = {
  title: "Shared Audit | AI Spend Audit",
  description: "Review a shared AI spend audit snapshot.",
};

interface SharePageProps {
  params: Promise<{ id: string }>;
}

export default async function SharePage({ params }: SharePageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 sm:px-8 lg:px-12 lg:py-16">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl sm:p-8 lg:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200/80">Share snapshot</p>
        <h1 className="mt-4 font-display text-4xl tracking-tight text-white sm:text-5xl">Shared audit link</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          Snapshot ID: <span className="font-semibold text-white">{id}</span>
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
          This dynamic route is active and ready to render public-safe audit summaries for collaborators.
        </p>

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
