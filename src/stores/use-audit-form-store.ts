"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultAuditFormValues, type AuditFormValues } from "@/schemas/audit-form";

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
      setDraft: (draft) => set({ draft }),
      resetDraft: () => set({ draft: defaultAuditFormValues }),
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