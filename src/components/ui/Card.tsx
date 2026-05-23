import React from "react";
import clsx from "clsx";

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  tone?: "default" | "muted" | "accent";
};

export function Card({ children, className, tone = "default", ...rest }: CardProps) {
  const toneMap: Record<string, string> = {
    default: "bg-[var(--card)] border border-[var(--panel-border)]",
    muted: "bg-[var(--surface)] border border-[var(--border-2)]",
    accent: "bg-[var(--accent-200)] border border-[var(--panel-border)]",
  };

  return (
    <div
      {...rest}
      className={clsx(
        "rounded-[var(--radius-3)] p-[var(--space-3)] shadow-[var(--shadow-1)] transition-[transform,box-shadow,border-color,background-color] duration-[var(--motion-default)] ease-[var(--motion-ease)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-2)]",
        toneMap[tone],
        className
      )}
      style={{ boxShadow: "var(--shadow-1)" }}
    >
      {children}
    </div>
  );
}

export default Card;
