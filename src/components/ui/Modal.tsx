"use client";

import React, { useEffect } from "react";
import clsx from "clsx";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
};

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    if (isOpen) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative z-10 w-full max-w-3xl rounded-[var(--radius-3)] bg-[var(--card)] p-[var(--space-3)] border border-[var(--panel-border)] shadow-[var(--shadow-2)]">
        <div className="flex items-center justify-between">
          {title ? <h3 className="font-display text-lg text-[var(--text-primary)]">{title}</h3> : null}
          <button aria-label="Close modal" onClick={onClose} className="text-[var(--text-secondary)]">×</button>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
