export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-12 lg:py-16" aria-busy="true" aria-live="polite">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto h-4 w-28 rounded-full bg-white/10" />
        <div className="mx-auto mt-4 h-10 w-4/5 rounded-2xl bg-white/10" />
        <div className="mx-auto mt-4 h-5 w-full rounded-full bg-white/10" />
      </div>
      <section className="mt-10 space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl sm:p-8 lg:p-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-24 rounded-2xl bg-white/5" />
          <div className="h-24 rounded-2xl bg-white/5" />
        </div>
        <div className="grid gap-4">
          <div className="h-32 rounded-[1.75rem] bg-white/5" />
          <div className="h-32 rounded-[1.75rem] bg-white/5" />
        </div>
      </section>
    </main>
  );
}