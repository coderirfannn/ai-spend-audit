import { ResultsPage as ResultsDashboardPage } from "@/features/results/results-page";

export const metadata = {
  title: "Audit Results | AI Spend Audit",
  description: "Review your saved AI spend audit summary.",
};

export default function ResultsRoutePage() {
  return <ResultsDashboardPage />;
}
