import { ReactNode } from "react";

export type StatsSummary = {
  total: number;
  highFit: number;
  avgFitScore: number | null;
  upcomingDeadlines: number;
};

export function StatsCards({ summary }: { summary: StatsSummary }) {
  const cards: { label: string; value: ReactNode; hint: string }[] = [
    {
      label: "Total foundations",
      value: summary.total,
      hint: "All tracked prospects",
    },
    {
      label: "High fit (8-10)",
      value: summary.highFit,
      hint: "Strong strategic matches",
    },
    {
      label: "Avg fit score",
      value: summary.avgFitScore ? summary.avgFitScore.toFixed(1) : "N/A",
      hint: "Quality of pipeline",
    },
    {
      label: "Deadlines (90d)",
      value: summary.upcomingDeadlines,
      hint: "Upcoming submissions",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm"
        >
          <p className="text-sm text-slate-500">{card.label}</p>
          <p className="text-2xl font-semibold text-slate-900 mt-2">
            {card.value}
          </p>
          <p className="text-xs text-slate-400 mt-2">{card.hint}</p>
        </div>
      ))}
    </section>
  );
}
