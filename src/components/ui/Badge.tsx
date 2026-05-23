import React from "react";
import clsx from "clsx";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "default" | "success" | "warning" | "danger" | "muted";
};

export function Badge({ tone = "default", className, children, ...rest }: BadgeProps) {
  const toneMap: Record<string, string> = {
    default: "bg-[var(--card)] text-[var(--text-primary)] border border-[var(--panel-border)]",
    success: "bg-[var(--success)] text-white",
    warning: "bg-[var(--warning)] text-white",
    danger: "bg-[var(--danger)] text-white",
    muted: "bg-transparent text-[var(--text-secondary)] border border-[var(--panel-border)]",
  };

  return (
    <span {...rest} className={clsx("inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold", toneMap[tone], className)}>
      {children}
    </span>
  );
}

export default Badge;
