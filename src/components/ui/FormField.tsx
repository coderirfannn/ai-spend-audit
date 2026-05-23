import React from "react";
import clsx from "clsx";

type FormFieldProps = {
  id?: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function FormField({ id, label, description, error, children, className }: FormFieldProps) {
  return (
    <div className={clsx("flex flex-col", className)}>
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-[var(--text-primary)]">
          {label}
        </label>
      ) : null}

      <div className="mt-2">{children}</div>

      {description ? <p className="mt-2 text-sm text-[var(--text-secondary)]">{description}</p> : null}
      {error ? <p className="mt-2 text-sm text-[var(--danger)]">{error}</p> : null}
    </div>
  );
}

export default FormField;
