import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 sm:px-8 lg:px-12 lg:py-20">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200/80">404</p>
        <h1 className="mt-4 font-display text-3xl tracking-tight text-white sm:text-4xl">Page not found</h1>
        <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
          The requested route doesn’t exist. Return to the dashboard or open the audit flow.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
          >
            Go home
          </Link>
          <Link
            href="/audit"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Open audit
          </Link>
        </div>
      </section>
    </main>
  );
}