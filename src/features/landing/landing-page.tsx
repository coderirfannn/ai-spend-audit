import Link from "next/link";
import { benefits, faqs, heroStats, howItWorks, supportedTools } from "./content";

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200/80">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl tracking-tight text-white sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">{description}</p>
    </div>
  );
}

function LogoBadge({ name }: { name: (typeof supportedTools)[number] }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] backdrop-blur-xl">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-900/80 text-sm font-semibold text-white">
        {name.slice(0, 1)}
      </div>
      <span className="text-sm font-medium text-slate-200">{name}</span>
    </div>
  );
}

export function LandingPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.9),transparent_22%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/50 to-transparent" />

      <section className="relative mx-auto max-w-7xl px-6 pb-20 pt-8 sm:px-8 lg:px-12 lg:pb-28 lg:pt-14">
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 backdrop-blur-xl sm:px-5">
          <span className="font-semibold text-white">AI Spend Audit</span>
          <span>Built for founder-led teams shipping fast.</span>
        </div>

        <div className="mt-10 grid gap-10 lg:mt-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sm font-medium text-sky-100 backdrop-blur-xl">
              See hidden AI savings instantly
            </div>
            <h1 className="mt-6 max-w-3xl font-display text-5xl tracking-tight text-white sm:text-6xl lg:text-7xl">
              Stop Overspending on AI Tools
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Get a high-trust audit of your AI stack, uncover duplicate spend, and see exactly where you can cut waste without slowing the team down.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/audit"
                className="inline-flex items-center justify-center rounded-full bg-sky-400 px-6 py-3.5 text-sm font-semibold text-slate-950 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-sky-300"
              >
                Audit My Spend
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-xl transition-colors duration-200 hover:bg-white/10"
              >
                How it works
              </Link>
            </div>

            <dl className="mt-10 grid gap-4 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                  <dt className="font-display text-2xl text-white">{stat.value}</dt>
                  <dd className="mt-1 text-sm leading-6 text-slate-300">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-sky-400/10 blur-3xl" />
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur-2xl sm:p-8">
              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200/70">Audit preview</p>
                <div className="mt-4 space-y-4">
                  <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/10 p-4">
                    <p className="text-sm font-medium text-emerald-100">Potential savings</p>
                    <p className="mt-2 font-display text-4xl text-white">$18,400</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">Projected annual savings from duplicate seats and unused plans.</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-slate-400">High-risk tools</p>
                      <p className="mt-2 text-2xl font-semibold text-white">3</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-slate-400">Low-usage seats</p>
                      <p className="mt-2 text-2xl font-semibold text-white">11</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="Benefits"
          title="A sharper picture of AI spend, without the spreadsheet grind"
          description="Designed to give founders confidence fast: what is working, what is redundant, and what can be optimized right away."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {benefits.map((benefit) => (
            <article key={benefit.title} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-transform duration-200 hover:-translate-y-1">
              <h3 className="font-display text-xl text-white">{benefit.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{benefit.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="How it works"
          title="Three steps from AI sprawl to clear savings"
          description="A simple flow for cold Product Hunt traffic: low friction, obvious value, and a clear next action."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {howItWorks.map((item) => (
            <article key={item.step} className="rounded-[1.75rem] border border-white/10 bg-slate-900/55 p-6 backdrop-blur-xl">
              <p className="text-sm font-semibold tracking-[0.18em] text-sky-200/80">{item.step}</p>
              <h3 className="mt-4 font-display text-xl text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="Supported AI tools"
          title="Works across the tools founders already use"
          description="Make the audit immediately relevant by starting with the products already shaping your team’s spend."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {supportedTools.map((tool) => (
            <LogoBadge key={tool} name={tool} />
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="FAQ"
          title="Common questions before you start"
          description="Answers that reduce friction and reinforce trust for first-time visitors."
        />
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {faqs.map((faq) => (
            <details key={faq.question} className="group rounded-[1.5rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <summary className="cursor-pointer list-none font-display text-lg text-white outline-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {faq.question}
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:pb-28">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(14,165,233,0.16),rgba(15,23,42,0.82))] p-8 shadow-[0_24px_80px_rgba(2,6,23,0.35)] backdrop-blur-2xl sm:p-10 lg:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-100/80">CTA</p>
            <h2 className="mt-4 font-display text-3xl tracking-tight text-white sm:text-5xl">
              Stop the leak before it becomes a habit.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-200/90 sm:text-lg">
              Run the audit, see the savings, and decide what to cut with confidence.
            </p>
            <div className="mt-8">
              <Link
                href="/audit"
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-slate-950 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Audit My Spend
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}