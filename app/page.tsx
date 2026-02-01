import { listFoundations, getStats, getUpcomingDeadlines } from "@/lib/queries";

export const dynamic = "force-dynamic";
import { StatsCards } from "@/components/StatsCards";
import { DashboardClient } from "@/components/DashboardClient";
import { DeadlineList } from "@/components/DeadlineList";
import { PipelineCharts } from "@/components/PipelineCharts";

export default function Home() {
  const foundations = listFoundations();
  const stats = getStats();
  const deadlines = getUpcomingDeadlines(90);

  return (
    <main className="min-h-screen px-4 py-8 md:px-8 lg:px-12">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900">
          Foundation Tracker
        </h1>
        <p className="text-slate-500 mt-2">
          A snapshot of your Nordic foundation pipeline
        </p>
      </header>

      <StatsCards summary={stats} />

      <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <DashboardClient foundations={foundations} />
        <div className="space-y-6">
          <DeadlineList deadlines={deadlines} />
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Quick tips</h3>
            <ul className="mt-3 text-sm text-slate-600 space-y-2">
              <li>Prioritize high-fit foundations with deadlines &lt; 30 days.</li>
              <li>Use outreach templates to kickstart personalized emails.</li>
              <li>Keep notes updated after each conversation.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <PipelineCharts foundations={foundations} />
      </div>
    </main>
  );
}
