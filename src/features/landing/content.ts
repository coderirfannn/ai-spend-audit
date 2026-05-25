export const heroStats = [
  { value: "$12k", label: "rough annual spend teams usually miss" },
  { value: "5 min", label: "to get a first look" },
  { value: "plain English", label: "so the findings are easy to share" },
] as const;

export const benefits = [
  {
    title: "Catch duplicate subscriptions",
    description: "See overlapping tools, forgotten seats, and plans that no longer fit how the team works.",
  },
  {
    title: "Notice waste before it adds up",
    description: "Small monthly leaks are easy to ignore until they start showing up in the burn rate.",
  },
  {
    title: "Turn spend into a short to-do list",
    description: "Get a clear read on what to keep, downgrade, consolidate, or cut.",
  },
] as const;

export const howItWorks = [
  {
    step: "01",
    title: "List the tools you already pay for",
    description: "Add the seat-based apps and usage-based APIs your team actually touches.",
  },
  {
    step: "02",
    title: "Run the audit",
    description: "The engine looks for overlap, underuse, and other easy-to-miss spend.",
  },
  {
    step: "03",
    title: "Review the next move",
    description: "You get a short list of the fastest wins and the cuts that look safest.",
  },
] as const;

export const supportedTools = ["Cursor", "Claude", "ChatGPT", "Copilot", "Gemini"] as const;

export const faqs = [
  {
    question: "What does the audit look for?",
    answer:
      "Mostly duplicated tools, unused seats, overlapping workflows, and the kind of spend that keeps slipping through reviews.",
  },
  {
    question: "Is this for early-stage teams only?",
    answer:
      "No. It is useful for early-stage teams, but it also works for larger groups that want a quick read on AI spend.",
  },
  {
    question: "Do I need to upload sensitive data?",
    answer:
      "No sensitive upload is required to get started. The first step stays lightweight on purpose.",
  },
  {
    question: "Can I share the results with my team?",
    answer:
      "Yes. The results page includes a public share link so you can send the report to the team.",
  },
] as const;