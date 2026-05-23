import React from "react";
import clsx from "clsx";

type StatCardProps = {
  label: string;
  value: React.ReactNode;
  className?: string;
};

export function StatCard({ label, value, className }: StatCardProps) {
  return (
    <div className={clsx("rounded-[var(--radius-2)] border border-[var(--panel-border)] bg-[var(--card)] p-4", className)}>
      <p className="text-sm text-[var(--text-secondary)]">{label}</p>
      <div className="mt-2 font-display text-2xl text-[var(--text-primary)]">{value}</div>
    </div>
  );
}

export default StatCard;
