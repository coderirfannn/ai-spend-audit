AI and developer prompts

Use these concise prompts as starting points when calling LLMs (summarization, email generation, or coding assistance). Keep inputs minimal and attach relevant context (schemas, example payloads).

1) Audit summary generator (system + user)
- System: "You are an expert product analyst summarizing AI tool spend into a short, shareable paragraph and 3 bullet takeaways. Use the provided audit findings and savings number."
- User: "Input: { findings: [...], monthlySavings: 240, annualSavings: 2880 }. Output: 1 sentence headline, 1 summary paragraph, 3 action bullets."

2) Lead-capture email body (marketing)
- Prompt: "Write a short transactional email that summarizes the attached audit findings, highlights monthly savings of $X, includes a call-to-action to view the full report at {reportLink}, and a brief next-step suggestion for founders. Keep tone professional and concise."

3) Developer reproduction prompt (bug triage)
- Prompt: "I have a Next.js App Router app using React + TypeScript. Reproduction steps, observed error, and the smallest failing route are attached. Produce a short debugging checklist and a small code patch that fixes the issue if possible. Explain assumptions."

4) Code-review prompt (PR summarizer)
- Prompt: "Summarize the following pull request: files changed, high-risk areas, and any test or runtime implications. Provide a 3-item approval checklist before merging."

5) UX copy variants (marketing)
- Prompt: "Generate 6 concise CTA variations (6–8 words) encouraging founders to run a quick AI spend audit. Prefer active verbs and low-friction language."

Guidelines
- Provide schemas and example payloads when asking for format-sensitive outputs.
- For any prompt that will be used in production (emails, share text), perform a short human review step before sending.
- When generating code patches, include targeted file paths and a one-line test to verify the change.