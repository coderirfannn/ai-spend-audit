"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 sm:px-8 lg:px-12 lg:py-20">
      <section className="rounded-[2rem] border border-rose-300/20 bg-rose-300/10 p-6 backdrop-blur-2xl sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-100/80">Something went wrong</p>
        <h1 className="mt-4 font-display text-3xl tracking-tight text-white sm:text-4xl">We couldn’t render this page</h1>
        <p className="mt-4 text-sm leading-7 text-rose-50/90 sm:text-base">
          The app caught an unexpected error and kept the failure contained. You can retry safely without losing the rest of the experience.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            Try again
          </button>
        </div>
      </section>
    </main>
  );
}