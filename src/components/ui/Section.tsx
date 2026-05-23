import React from "react";
import clsx from "clsx";

type SectionProps = {
  eyebrow?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

export function Section({ eyebrow, title, description, children, className }: SectionProps) {
  return (
    <section className={clsx("mx-auto max-w-7xl px-[var(--space-2)] py-[var(--space-4)]", className)}>
      <div className="mx-auto max-w-3xl text-center">
        {eyebrow ? <p className="text-sm font-semibold uppercase tracking-wide text-[var(--accent-muted)]">{eyebrow}</p> : null}
        {title ? <h2 className="mt-3 font-display text-3xl text-[var(--text-primary)]">{title}</h2> : null}
        {description ? <p className="mt-4 text-base text-[var(--text-secondary)]">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export default Section;
