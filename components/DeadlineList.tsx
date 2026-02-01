import { format, differenceInDays, parseISO } from "date-fns";
import type { Foundation } from "@/lib/db";

export function DeadlineList({ deadlines }: { deadlines: Foundation[] }) {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Deadline alerts</h3>
          <p className="text-sm text-slate-500">
            Color-coded by urgency
          </p>
        </div>
        <span className="text-xs text-slate-400">Next 90 days</span>
      </div>
      <div className="mt-4 space-y-3">
        {deadlines.length === 0 && (
          <p className="text-sm text-slate-400">No upcoming deadlines.</p>
        )}
        {deadlines.map((foundation) => {
          const date = parseISO(foundation.application_deadline!);
          const daysLeft = differenceInDays(date, new Date());
          const tone =
            daysLeft <= 7
              ? "border-red-200 bg-red-50 text-red-700"
              : daysLeft <= 30
              ? "border-amber-200 bg-amber-50 text-amber-700"
              : "border-slate-200 bg-slate-50 text-slate-600";

          return (
            <div
              key={foundation.id}
              className={`border rounded-xl p-3 flex flex-col gap-1 ${tone}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">{foundation.name}</span>
                <span className="text-xs font-semibold">
                  {daysLeft} days
                </span>
              </div>
              <span className="text-xs">
                {format(date, "MMM d, yyyy")} • {foundation.status}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
