import React from "react";
import clsx from "clsx";

type EmptyStateProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div className={clsx("rounded-[var(--radius-3)] border border-[var(--panel-border)] bg-[var(--card)] p-[var(--space-3)] text-center", className)}>
      <h3 className="font-display text-xl text-[var(--text-primary)]">{title}</h3>
      {description ? <p className="mt-2 text-sm text-[var(--text-secondary)]">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export default EmptyState;
