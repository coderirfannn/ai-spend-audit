"use client";

import React from "react";
import clsx from "clsx";

type ToastProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  onClose?: () => void;
};

export function Toast({ title, description, onClose }: ToastProps) {
  return (
    <div role="status" className="fixed bottom-6 right-6 w-[320px] rounded-[var(--radius-2)] border border-[var(--panel-border)] bg-[var(--card)] p-4 shadow-[var(--shadow-2)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          {title ? <div className="font-semibold text-[var(--text-primary)]">{title}</div> : null}
          {description ? <div className="mt-1 text-sm text-[var(--text-secondary)]">{description}</div> : null}
        </div>
        <button aria-label="Close" onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          ×
        </button>
      </div>
    </div>
  );
}

export default Toast;
