export default function Loading() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10 sm:px-8 lg:px-12 lg:py-16" aria-busy="true" aria-live="polite">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl sm:p-8 lg:p-10">
        <div className="h-4 w-28 rounded-full bg-white/10" />
        <div className="mt-4 h-10 w-2/3 rounded-2xl bg-white/10" />
        <div className="mt-4 h-5 w-full rounded-full bg-white/10" />
        <div className="mt-8 flex flex-wrap gap-3">
          <div className="h-11 w-36 rounded-full bg-white/10" />
          <div className="h-11 w-36 rounded-full bg-white/10" />
        </div>
      </section>
    </main>
  );
}