import type { AuditToolInput } from "./contracts";

export interface PlanTier {
  name: string;
  monthlyPrice: number;
}

export interface ToolCatalogEntry {
  vendor: string;
  plans: PlanTier[];
  useCases: string[];
}

export const toolCatalog = {
  Cursor: {
    vendor: "Cursor",
    plans: [
      { name: "Hobby", monthlyPrice: 0 },
      { name: "Pro", monthlyPrice: 20 },
      { name: "Business", monthlyPrice: 40 },
      { name: "Enterprise", monthlyPrice: 100 },
    ],
    useCases: ["coding", "developer productivity", "pair programming"],
  },
  Copilot: {
    vendor: "GitHub Copilot",
    plans: [
      { name: "Free", monthlyPrice: 0 },
      { name: "Pro", monthlyPrice: 10 },
      { name: "Business", monthlyPrice: 19 },
      { name: "Enterprise", monthlyPrice: 39 },
    ],
    useCases: ["coding", "developer productivity", "code review"],
  },
  Claude: {
    vendor: "Anthropic Claude",
    plans: [
      { name: "Free", monthlyPrice: 0 },
      { name: "Pro", monthlyPrice: 20 },
      { name: "Team", monthlyPrice: 25 },
      { name: "Max", monthlyPrice: 100 },
    ],
    useCases: ["writing", "research", "analysis", "customer support"],
  },
  ChatGPT: {
    vendor: "OpenAI ChatGPT",
    plans: [
      { name: "Free", monthlyPrice: 0 },
      { name: "Plus", monthlyPrice: 20 },
      { name: "Team", monthlyPrice: 25 },
      { name: "Pro", monthlyPrice: 200 },
    ],
    useCases: ["writing", "research", "analysis", "operations"],
  },
  "OpenAI API": {
    vendor: "OpenAI API",
    plans: [
      { name: "Pay-as-you-go", monthlyPrice: 0 },
      { name: "Growth", monthlyPrice: 50 },
      { name: "Scale", monthlyPrice: 250 },
    ],
    useCases: ["api", "automation", "workflow automation", "product integration"],
  },
  "Anthropic API": {
    vendor: "Anthropic API",
    plans: [
      { name: "Pay-as-you-go", monthlyPrice: 0 },
      { name: "Growth", monthlyPrice: 50 },
      { name: "Scale", monthlyPrice: 250 },
    ],
    useCases: ["api", "automation", "workflow automation", "product integration"],
  },
  Gemini: {
    vendor: "Google Gemini",
    plans: [
      { name: "Free", monthlyPrice: 0 },
      { name: "Advanced", monthlyPrice: 20 },
      { name: "Business", monthlyPrice: 30 },
      { name: "Enterprise", monthlyPrice: 60 },
    ],
    useCases: ["writing", "research", "analysis", "search"],
  },
  Windsurf: {
    vendor: "Windsurf",
    plans: [
      { name: "Free", monthlyPrice: 0 },
      { name: "Pro", monthlyPrice: 15 },
      { name: "Teams", monthlyPrice: 30 },
      { name: "Enterprise", monthlyPrice: 90 },
    ],
    useCases: ["coding", "developer productivity", "pair programming"],
  },
} as const satisfies Record<string, ToolCatalogEntry>;

export type SupportedToolName = keyof typeof toolCatalog;

const useCaseToolMap: Record<string, SupportedToolName[]> = {
  coding: ["Cursor", "Copilot", "Windsurf"],
  "developer productivity": ["Cursor", "Copilot", "Windsurf"],
  "pair programming": ["Cursor", "Copilot", "Windsurf"],
  writing: ["Claude", "ChatGPT", "Gemini"],
  research: ["Claude", "ChatGPT", "Gemini"],
  analysis: ["Claude", "ChatGPT", "Gemini"],
  operations: ["ChatGPT", "Claude"],
  support: ["Claude", "ChatGPT"],
  api: ["OpenAI API", "Anthropic API", "Gemini"],
  automation: ["OpenAI API", "Anthropic API", "Gemini"],
  "workflow automation": ["OpenAI API", "Anthropic API", "Gemini"],
  "product integration": ["OpenAI API", "Anthropic API", "Gemini"],
  search: ["Gemini", "ChatGPT", "Claude"],
};

export function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

export function getPlanIndex(tool: string, plan: string): number {
  const catalog = toolCatalog[tool as SupportedToolName];
  if (!catalog) {
    return -1;
  }

  const normalizedPlan = normalizeText(plan);
  return catalog.plans.findIndex((candidate) => normalizeText(candidate.name) === normalizedPlan);
}

export function getCatalogEntry(tool: string): ToolCatalogEntry | undefined {
  return toolCatalog[tool as SupportedToolName];
}

export function getCheaperPlan(tool: string, plan: string): PlanTier | null {
  const catalog = getCatalogEntry(tool);
  if (!catalog) {
    return null;
  }

  const currentIndex = getPlanIndex(tool, plan);
  if (currentIndex <= 0) {
    return null;
  }

  return catalog.plans[currentIndex - 1] ?? null;
}

export function getUseCaseAlternatives(useCase: string, currentTool?: string): SupportedToolName[] {
  const normalizedUseCase = normalizeText(useCase);
  const keywords = Object.keys(useCaseToolMap).filter((keyword) => normalizedUseCase.includes(keyword));
  const alternatives = keywords.flatMap((keyword) => useCaseToolMap[keyword] ?? []);

  const uniqueAlternatives = alternatives.filter((tool, index, array) => array.indexOf(tool) === index);

  if (!currentTool) {
    return uniqueAlternatives;
  }

  return uniqueAlternatives.filter((tool) => tool !== currentTool);
}

export function getCheapestAlternativeTool(useCase: string, currentTool?: string): SupportedToolName | null {
  const alternatives = getUseCaseAlternatives(useCase, currentTool);
  if (alternatives.length === 0) {
    return null;
  }

  return alternatives.reduce<SupportedToolName | null>((best, candidate) => {
    if (!best) {
      return candidate;
    }

    const bestPrice = toolCatalog[best].plans.find((planTier) => planTier.monthlyPrice > 0)?.monthlyPrice ?? Number.POSITIVE_INFINITY;
    const candidatePrice = toolCatalog[candidate].plans.find((planTier) => planTier.monthlyPrice > 0)?.monthlyPrice ?? Number.POSITIVE_INFINITY;

    return candidatePrice < bestPrice ? candidate : best;
  }, null);
}

export function estimateToolSpend(tool: SupportedToolName, seats: number): number {
  const catalog = toolCatalog[tool];
  const starterPrice = catalog.plans.find((tier) => tier.monthlyPrice > 0)?.monthlyPrice ?? 0;
  return starterPrice * Math.max(1, seats);
}

export function validateAuditToolInput(tool: AuditToolInput): void {
  if (!tool.tool.trim()) {
    throw new TypeError("tool is required");
  }

  if (!tool.plan.trim()) {
    throw new TypeError("plan is required");
  }

  if (!Number.isFinite(tool.spend) || tool.spend < 0) {
    throw new TypeError("spend must be a non-negative number");
  }

  if (!Number.isInteger(tool.seats) || tool.seats < 1) {
    throw new TypeError("seats must be a positive integer");
  }
}