import React from "react";
import clsx from "clsx";

type Step = { id: string; title: string };

type ProgressStepperProps = {
  steps: Step[];
  currentIndex: number;
  className?: string;
};

export function ProgressStepper({ steps, currentIndex, className }: ProgressStepperProps) {
  return (
    <nav aria-label="Progress" className={clsx("flex items-center gap-3", className)}>
      {steps.map((step, idx) => {
        const isActive = idx === currentIndex;
        const isComplete = idx < currentIndex;

        return (
          <div key={step.id} className="flex items-center gap-3">
            <div
              aria-current={isActive ? "step" : undefined}
              className={clsx(
                "flex h-9 w-9 items-center justify-center rounded-full border",
                isComplete ? "bg-[var(--accent)] text-[var(--text-primary)] border-[var(--accent)]" : isActive ? "bg-[var(--accent-200)] text-[var(--text-primary)] border-[var(--panel-border)]" : "bg-transparent text-[var(--text-secondary)] border-[var(--panel-border)]"
              )}
            >
              <span className="text-sm font-medium">{idx + 1}</span>
            </div>

            <div className="hidden md:block">
              <div className={isActive ? "text-sm font-semibold text-[var(--text-primary)]" : "text-sm text-[var(--text-secondary)]"}>{step.title}</div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}

export default ProgressStepper;
