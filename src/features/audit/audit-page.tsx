import { AuditSpendForm } from "./audit-spend-form";

export function AuditPage() {
  return (
    <main className="relative mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200/80">Audit form</p>
        <h1 className="mt-4 font-display text-4xl tracking-tight text-white sm:text-5xl">Capture every AI tool in one pass</h1>
        <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">
          Add multiple tools, compare plans and spend, and keep the draft saved across refreshes while you work.
        </p>
      </div>

      <div className="mt-10">
        <AuditSpendForm />
      </div>
    </main>
  );
}