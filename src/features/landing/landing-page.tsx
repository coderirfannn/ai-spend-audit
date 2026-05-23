import Link from "next/link";
import { benefits, faqs, heroStats, howItWorks, supportedTools } from "./content";
import { Section } from "@/components/ui/Section";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TrustSystemSection } from "@/components/shared/trust-system-section";

function ToolBadge({ name }: { name: (typeof supportedTools)[number] }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-[var(--radius-2)] border border-[var(--panel-border)] bg-[var(--card)] px-3 py-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-2)] bg-[var(--surface)] text-sm font-semibold text-[var(--text-primary)]">{name.slice(0, 1)}</div>
      <span className="text-sm font-medium text-[var(--text-secondary)]">{name}</span>
    </div>
  );
}

export function LandingPage() {
  return (
    <main>
      <Section>
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4 rounded-[var(--radius-2)] border border-[var(--panel-border)] bg-[var(--card)] px-[var(--space-2)] py-2 text-sm text-[var(--text-secondary)]">
            <span className="font-semibold text-[var(--text-primary)]">AI Spend Audit</span>
            <span>Built for founders & engineering teams</span>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge className="px-3 py-1" tone="muted">See hidden AI savings instantly</Badge>

              <h1 className="mt-6 max-w-3xl font-display" style={{ fontSize: 'clamp(2rem, 4.5vw, var(--type-xxl))', lineHeight: 'var(--leading-xxl)' }}>
                AI spend is growing faster than teams realize.
              </h1>

              <p className="mt-6 max-w-2xl text-base text-[var(--text-secondary)]" style={{ lineHeight: 'var(--leading-md)' }}>
                Find duplicate tools, idle seats, and hidden pricing leaks.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/audit" className="inline-flex items-center justify-center rounded-[var(--radius-2)] bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--accent-400)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]">
                  Audit My Spend
                </Link>
                <a href="#how-it-works" className="inline-flex items-center justify-center rounded-[var(--radius-2)] border border-[var(--panel-border)] bg-transparent px-6 py-3 text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--card)]">
                  How it works
                </a>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {heroStats.map((stat) => (
                  <StatCard key={stat.label} label={stat.label} value={stat.value} />
                ))}
              </div>
            </div>

            <div>
              <Card>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-secondary)]">Audit preview</p>
                    <p className="mt-2 font-display text-3xl text-[var(--text-primary)]">$18,400</p>
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">Projected annual savings from duplicate seats and unused plans.</p>
                  </div>

                  <div className="hidden md:flex flex-col gap-3">
                    <div className="rounded-[var(--radius-2)] border border-[var(--panel-border)] bg-[var(--surface)] p-3">
                      <p className="text-xs text-[var(--text-secondary)]">High-risk tools</p>
                      <p className="mt-1 font-semibold text-[var(--text-primary)]">3</p>
                    </div>
                    <div className="rounded-[var(--radius-2)] border border-[var(--panel-border)] bg-[var(--surface)] p-3">
                      <p className="text-xs text-[var(--text-secondary)]">Low-usage seats</p>
                      <p className="mt-1 font-semibold text-[var(--text-primary)]">11</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <svg width="100%" height="48" viewBox="0 0 200 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M0 36 C40 10,80 20,120 12 C160 4,200 28,240 18" stroke="var(--accent)" strokeWidth="2" fill="transparent" />
                  </svg>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Section>

      <Section eyebrow="Supported tools" title="Works across the tools your team already uses" description="Start with the products that are shaping your team’s spend.">
        <div className="mt-6 flex flex-wrap gap-3">
          {supportedTools.map((tool) => (
            <ToolBadge key={tool} name={tool} />
          ))}
        </div>
      </Section>

      <Section eyebrow="Benefits" title="A sharper picture of AI spend, without the spreadsheet grind">
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {benefits.map((b) => (
            <Card key={b.title} className="transition-transform hover:-translate-y-1">
              <h3 className="font-display text-lg text-[var(--text-primary)]">{b.title}</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{b.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="how-it-works" eyebrow="How it works" title="Three steps from AI sprawl to clear savings" description="Low-friction audit flow with clear next actions.">
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {howItWorks.map((item) => (
            <Card key={item.step} className="p-6">
              <p className="text-sm font-semibold text-[var(--accent-muted)]">{item.step}</p>
              <h4 className="mt-2 font-display text-lg text-[var(--text-primary)]">{item.title}</h4>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{item.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section eyebrow="FAQ" title="Common questions before you start" description="Answers that reduce friction and reinforce trust for first-time visitors.">
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {faqs.map((faq) => (
            <details key={faq.question} className="group rounded-[var(--radius-2)] border border-[var(--panel-border)] bg-[var(--card)] p-6">
              <summary className="cursor-pointer list-none font-display text-lg text-[var(--text-primary)] outline-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {faq.question}
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--panel-border)] text-[var(--text-secondary)]">+</span>
                </span>
              </summary>
              <p className="mt-4 max-w-xl text-sm text-[var(--text-secondary)]">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Section>

      <TrustSystemSection
        title="How the audit works"
        description="A practical methodology designed to be easy to review, easy to share, and explicit about what is and is not being estimated."
      />

      <Section>
        <div className="mx-auto max-w-3xl text-center rounded-[var(--radius-3)] border border-[var(--panel-border)] bg-[var(--card)] p-[var(--space-3)]">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--accent-muted)]">CTA</p>
          <h2 className="mt-3 font-display text-2xl text-[var(--text-primary)]">Stop the leak before it becomes a habit.</h2>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">Run the audit, see the savings, and decide what to cut with confidence.</p>
          <div className="mt-6">
            <Link href="/audit" className="inline-flex items-center justify-center rounded-[var(--radius-2)] bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--text-primary)]">Audit My Spend</Link>
          </div>
        </div>
      </Section>
    </main>
  );
}