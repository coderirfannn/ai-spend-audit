export const heroStats = [
  { value: "$12k", label: "average recoverable annual spend" },
  { value: "5 min", label: "to get a first-pass audit" },
  { value: "100%", label: "transparent findings you can share" },
] as const;

export const benefits = [
  {
    title: "Find duplicate subscriptions fast",
    description: "Spot overlapping AI tools, idle seats, and plans that no longer match team usage.",
  },
  {
    title: "See waste before it compounds",
    description: "Catch small monthly leaks early so founder burn stays under control as teams scale.",
  },
  {
    title: "Turn spend into decisions",
    description: "Get a clean read on what to keep, downgrade, consolidate, or cancel.",
  },
] as const;

export const howItWorks = [
  {
    step: "01",
    title: "Connect your AI stack",
    description: "List the tools your team uses, from seat-based apps to usage-based APIs.",
  },
  {
    step: "02",
    title: "Run the audit engine",
    description: "The audit engine checks overlap, underuse, and patterns that signal avoidable spend.",
  },
  {
    step: "03",
    title: "Review savings actions",
    description: "See a prioritized plan with the quickest wins and highest-confidence cuts first.",
  },
] as const;

export const supportedTools = ["Cursor", "Claude", "ChatGPT", "Copilot", "Gemini"] as const;

export const faqs = [
  {
    question: "What does the audit look for?",
    answer:
      "We focus on duplicated tools, unused seats, overlapping workflows, and signals that point to wasted AI spend.",
  },
  {
    question: "Is this for early-stage teams only?",
    answer:
      "No. It is designed for founders and operators who want a fast, high-trust view of AI spend across small or growing teams.",
  },
  {
    question: "Do I need to upload sensitive data?",
    answer:
      "The landing experience is positioned for a lightweight audit flow, so the first step stays simple and low-friction.",
  },
  {
    question: "Can I share the results with my team?",
    answer:
      "Yes. The product architecture includes a public share route for clean, shareable result snapshots.",
  },
] as const;