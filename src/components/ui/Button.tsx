"use client";

import React from "react";
import clsx from "clsx";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "neutral" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", isLoading = false, className, children, disabled, ...rest }, ref) => {
    const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-[var(--radius-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] transition-[transform,background-color,border-color,color,box-shadow] duration-[var(--motion-default)] ease-[var(--motion-ease)] enabled:hover:-translate-y-0.5 enabled:active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60";
    const sizeMap: Record<string, string> = {
      sm: "px-3 py-1.5 text-sm h-[36px]",
      md: "px-5 py-2 text-sm h-[44px]",
      lg: "px-6 py-3 text-base h-[52px]",
    };

    const variantMap: Record<string, string> = {
      primary: `bg-[var(--accent)] text-[var(--text-primary)] hover:bg-[var(--accent-400)] focus:ring-[var(--focus-ring)]`,
      ghost: `bg-transparent border border-[var(--panel-border)] text-[var(--text-primary)] hover:bg-[var(--card)] focus:ring-[var(--focus-ring)]`,
      neutral: `bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--card)] focus:ring-[var(--focus-ring)]`,
      danger: `bg-[var(--danger)] text-white hover:brightness-90 focus:ring-[var(--danger)]`,
    };

    return (
      <button
        {...rest}
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        className={clsx(base, sizeMap[size], variantMap[variant], className)}
      >
        {isLoading ? <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden /> : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
