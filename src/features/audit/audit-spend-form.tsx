"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { auditFormSchema, defaultAuditFormValues, supportedAuditTools, type AuditFormValues } from "@/schemas/audit-form";
import { useAuditFormStore } from "@/stores/use-audit-form-store";
import { ProgressStepper } from "@/components/ui/ProgressStepper";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

const toolOptions = supportedAuditTools;

function FieldError({ message }: { message: string | undefined }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm text-rose-300">{message}</p>;
}

export function AuditSpendForm() {
  const router = useRouter();
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const draft = useAuditFormStore((state) => state.draft);
  const hydrated = useAuditFormStore((state) => state.hydrated);
  const setDraft = useAuditFormStore((state) => state.setDraft);
  const resetDraft = useAuditFormStore((state) => state.resetDraft);

  const form = useForm<z.input<typeof auditFormSchema>, undefined, z.output<typeof auditFormSchema>>({
    resolver: zodResolver(auditFormSchema),
    defaultValues: draft,
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tools",
  });

  useEffect(() => {
    void useAuditFormStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (hydrated) {
      form.reset(draft);
    }
  }, [form, hydrated]);

  useEffect(() => {
    const subscription = form.watch((values) => {
      if (!hydrated) {
        return;
      }

      const parsed = auditFormSchema.safeParse(values);
      if (parsed.success) {
        setDraft(parsed.data);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, hydrated, setDraft]);

  const handleAddTool = () => {
    append({
      tool: "Cursor",
      plan: "",
      monthlySpend: 0,
      seats: 1,
    });
  };

  const handleReset = () => {
    resetDraft();
    form.reset(defaultAuditFormValues);
  };

  const onSubmit = form.handleSubmit((values) => {
    const parsed = auditFormSchema.safeParse(values);
    if (parsed.success) {
      setSaveState("saving");
      setDraft(parsed.data);
      setSaveState("saved");
      // Debug: confirm handler fired in browser
      // eslint-disable-next-line no-console
      console.log("Audit form submitted", parsed.data);
      void router.push("/results");
    }
  });

  if (!hydrated) {
    return (
      <Card className="space-y-4 p-6 sm:p-8">
        <LoadingSkeleton width="30%" height={14} />
        <LoadingSkeleton width="60%" height={28} />
        <LoadingSkeleton width="100%" height={14} />
        <div className="grid gap-4 lg:grid-cols-2">
          <LoadingSkeleton width="100%" height={44} />
          <LoadingSkeleton width="100%" height={44} />
        </div>
      </Card>
    );
  }
  return (
    <form
      onSubmit={onSubmit}
      onKeyDown={(e) => {
        const tag = (e.target as HTMLElement).tagName;
        if (e.key === "Enter" && tag !== "TEXTAREA") {
          e.preventDefault();
        }
      }}
      className="space-y-6 rounded-[var(--radius-3)] border border-[var(--panel-border)] bg-[var(--card)] p-[var(--space-3)]"
      aria-busy={saveState === "saving"}
    >
      {/* Stepper */}
      <div className="flex items-center justify-between gap-4">
        <ProgressStepper steps={[{ id: 'tools', title: 'Tools' }, { id: 'usage', title: 'Usage' }, { id: 'team', title: 'Team' }, { id: 'review', title: 'Review' }]} currentIndex={0} />
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]" aria-live="polite">
          {saveState === "idle" ? "Draft ready" : saveState === "saving" ? "Saving..." : "Saved locally"}
        </p>
      </div>

      {/* Note: To preserve business logic we keep existing fields but the UI should be replaced progressively with per-step rendering in future iterations. */}

      <div className="grid gap-6 lg:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-[var(--text-secondary)]">Team size</span>
          <input type="number" min={1} inputMode="numeric" {...form.register("teamSize", { valueAsNumber: true })} className="mt-2 w-full rounded-[var(--radius-2)] border border-[var(--panel-border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition-[border-color,box-shadow] duration-[var(--motion-default)] focus-visible:border-[var(--focus-ring)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]" placeholder="12" aria-invalid={Boolean(form.formState.errors.teamSize?.message)} />
          <FieldError message={form.formState.errors.teamSize?.message} />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[var(--text-secondary)]">Primary use case</span>
          <input type="text" {...form.register("primaryUseCase")} className="mt-2 w-full rounded-[var(--radius-2)] border border-[var(--panel-border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition-[border-color,box-shadow] duration-[var(--motion-default)] focus-visible:border-[var(--focus-ring)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]" placeholder="Product development, content, support..." aria-invalid={Boolean(form.formState.errors.primaryUseCase?.message)} />
          <FieldError message={form.formState.errors.primaryUseCase?.message} />
        </label>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl text-[var(--text-primary)]">AI tools</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">Add every tool your team is paying for or actively using.</p>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={handleAddTool}>Add another tool</Button>
        </div>

        <FieldError message={form.formState.errors.tools?.message} />

        <div className="mt-4 space-y-4">
          {fields.map((field, index) => (
            <article key={field.id} className="rounded-[var(--radius-2)] border border-[var(--panel-border)] bg-[var(--surface)] p-4">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-display text-lg text-[var(--text-primary)]">Tool {index + 1}</h3>
                {fields.length > 1 ? (
                  <button type="button" onClick={() => remove(index)} className="text-sm text-[var(--text-secondary)]">Remove</button>
                ) : null}
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <label className="block">
                  <span className="text-sm text-[var(--text-secondary)]">Tool</span>
                  <select {...form.register(`tools.${index}.tool`)} className="mt-2 w-full rounded-[var(--radius-2)] border border-[var(--panel-border)] bg-[var(--card)] px-3 py-2 text-[var(--text-primary)] outline-none transition-[border-color,box-shadow] duration-[var(--motion-default)] focus-visible:border-[var(--focus-ring)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]" defaultValue={field.tool} aria-invalid={Boolean(form.formState.errors.tools?.[index]?.tool?.message)}>
                    {toolOptions.map((tool) => (
                      <option key={tool} value={tool}>{tool}</option>
                    ))}
                  </select>
                  <FieldError message={form.formState.errors.tools?.[index]?.tool?.message} />
                </label>

                <label className="block">
                  <span className="text-sm text-[var(--text-secondary)]">Plan</span>
                  <input type="text" {...form.register(`tools.${index}.plan`)} className="mt-2 w-full rounded-[var(--radius-2)] border border-[var(--panel-border)] bg-[var(--card)] px-3 py-2 text-[var(--text-primary)] outline-none transition-[border-color,box-shadow] duration-[var(--motion-default)] focus-visible:border-[var(--focus-ring)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]" placeholder="Pro, Team, Enterprise..." aria-invalid={Boolean(form.formState.errors.tools?.[index]?.plan?.message)} />
                  <FieldError message={form.formState.errors.tools?.[index]?.plan?.message} />
                </label>

                <label className="block">
                  <span className="text-sm text-[var(--text-secondary)]">Monthly spend</span>
                  <input type="number" min={0} step="0.01" inputMode="decimal" {...form.register(`tools.${index}.monthlySpend`, { valueAsNumber: true })} className="mt-2 w-full rounded-[var(--radius-2)] border border-[var(--panel-border)] bg-[var(--card)] px-3 py-2 text-[var(--text-primary)] outline-none transition-[border-color,box-shadow] duration-[var(--motion-default)] focus-visible:border-[var(--focus-ring)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]" placeholder="120" aria-invalid={Boolean(form.formState.errors.tools?.[index]?.monthlySpend?.message)} />
                  <FieldError message={form.formState.errors.tools?.[index]?.monthlySpend?.message} />
                </label>

                <label className="block">
                  <span className="text-sm text-[var(--text-secondary)]">Seats</span>
                  <input type="number" min={1} step={1} inputMode="numeric" {...form.register(`tools.${index}.seats`, { valueAsNumber: true })} className="mt-2 w-full rounded-[var(--radius-2)] border border-[var(--panel-border)] bg-[var(--card)] px-3 py-2 text-[var(--text-primary)] outline-none transition-[border-color,box-shadow] duration-[var(--motion-default)] focus-visible:border-[var(--focus-ring)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]" placeholder="5" aria-invalid={Boolean(form.formState.errors.tools?.[index]?.seats?.message)} />
                  <FieldError message={form.formState.errors.tools?.[index]?.seats?.message} />
                </label>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" variant="ghost" size="md" onClick={handleReset}>Reset draft</Button>

        <Button type="submit" size="md" isLoading={saveState === "saving"}>Save audit draft</Button>
      </div>
    </form>
  );
}