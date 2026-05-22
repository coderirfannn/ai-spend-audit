"use client";

import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { auditFormSchema, defaultAuditFormValues, supportedAuditTools, type AuditFormValues } from "@/schemas/audit-form";
import { useAuditFormStore } from "@/stores/use-audit-form-store";

const toolOptions = supportedAuditTools;

function FieldError({ message }: { message: string | undefined }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm text-rose-300">{message}</p>;
}

export function AuditSpendForm() {
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
  }, [draft, form, hydrated]);

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
      setDraft(parsed.data);
    }
  });

  if (!hydrated) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-sm text-slate-300 backdrop-blur-xl sm:p-8">
        Loading your saved audit draft...
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl sm:p-8 lg:p-10">
      <div className="grid gap-6 lg:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-200">Team size</span>
          <input
            type="number"
            min={1}
            inputMode="numeric"
            {...form.register("teamSize", { valueAsNumber: true })}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white shadow-inner shadow-black/20 outline-none transition focus:border-sky-300"
            placeholder="12"
          />
          <FieldError message={form.formState.errors.teamSize?.message} />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-200">Primary use case</span>
          <input
            type="text"
            {...form.register("primaryUseCase")}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white shadow-inner shadow-black/20 outline-none transition focus:border-sky-300"
            placeholder="Product development, content, support..."
          />
          <FieldError message={form.formState.errors.primaryUseCase?.message} />
        </label>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl text-white">AI tools</h2>
            <p className="mt-1 text-sm text-slate-300">Add every tool your team is paying for or actively using.</p>
          </div>
          <button
            type="button"
            onClick={handleAddTool}
            className="inline-flex items-center justify-center rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sm font-semibold text-sky-100 transition hover:bg-sky-400/20"
          >
            Add another tool
          </button>
        </div>

        <FieldError message={form.formState.errors.tools?.message} />

        <div className="space-y-4">
          {fields.map((field, index) => (
            <article key={field.id} className="rounded-[1.75rem] border border-white/10 bg-slate-950/45 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-display text-lg text-white">Tool {index + 1}</h3>
                {fields.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-sm font-medium text-slate-300 transition hover:text-white"
                  >
                    Remove
                  </button>
                ) : null}
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-200">Tool</span>
                  <select
                    {...form.register(`tools.${index}.tool`)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white shadow-inner shadow-black/20 outline-none transition focus:border-sky-300"
                    defaultValue={field.tool}
                  >
                    {toolOptions.map((tool) => (
                      <option key={tool} value={tool}>
                        {tool}
                      </option>
                    ))}
                  </select>
                  <FieldError message={form.formState.errors.tools?.[index]?.tool?.message} />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-200">Plan</span>
                  <input
                    type="text"
                    {...form.register(`tools.${index}.plan`)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white shadow-inner shadow-black/20 outline-none transition focus:border-sky-300"
                    placeholder="Pro, Team, Enterprise..."
                  />
                  <FieldError message={form.formState.errors.tools?.[index]?.plan?.message} />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-200">Monthly spend</span>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    inputMode="decimal"
                    {...form.register(`tools.${index}.monthlySpend`, { valueAsNumber: true })}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white shadow-inner shadow-black/20 outline-none transition focus:border-sky-300"
                    placeholder="120"
                  />
                  <FieldError message={form.formState.errors.tools?.[index]?.monthlySpend?.message} />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-200">Seats</span>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    inputMode="numeric"
                    {...form.register(`tools.${index}.seats`, { valueAsNumber: true })}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white shadow-inner shadow-black/20 outline-none transition focus:border-sky-300"
                    placeholder="5"
                  />
                  <FieldError message={form.formState.errors.tools?.[index]?.seats?.message} />
                </label>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Reset draft
        </button>

        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
        >
          Save audit draft
        </button>
      </div>
    </form>
  );
}