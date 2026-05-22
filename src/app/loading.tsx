export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-12 lg:py-16" aria-busy="true" aria-live="polite">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl sm:p-8 lg:p-10">
        <div className="h-3 w-24 rounded-full bg-white/10" />
        <div className="mt-5 h-12 w-3/4 rounded-2xl bg-white/10" />
        <div className="mt-4 h-5 w-full rounded-full bg-white/10" />
        <div className="mt-3 h-5 w-5/6 rounded-full bg-white/10" />

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="h-28 rounded-[1.5rem] bg-white/5" />
          <div className="h-28 rounded-[1.5rem] bg-white/5" />
          <div className="h-28 rounded-[1.5rem] bg-white/5" />
          <div className="h-28 rounded-[1.5rem] bg-white/5" />
        </div>
      </section>
    </main>
  );
}