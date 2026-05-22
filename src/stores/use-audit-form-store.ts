"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultAuditFormValues, type AuditFormValues } from "@/schemas/audit-form";

function isSameDraft(left: AuditFormValues, right: AuditFormValues): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

interface AuditFormStore {
  draft: AuditFormValues;
  hydrated: boolean;
  setDraft: (draft: AuditFormValues) => void;
  resetDraft: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useAuditFormStore = create<AuditFormStore>()(
  persist(
    (set) => ({
      draft: defaultAuditFormValues,
      hydrated: false,
      setDraft: (draft) => set((state) => (isSameDraft(state.draft, draft) ? {} : { draft })),
      resetDraft: () => set((state) => (isSameDraft(state.draft, defaultAuditFormValues) ? {} : { draft: defaultAuditFormValues })),
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: "ai-spend-audit-form",
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);