import type { Foundation } from "@/lib/db";
import { format, parseISO } from "date-fns";

export function FoundationSummary({ foundation }: { foundation: Foundation }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-900">
          {foundation.name}
        </h1>
        <p className="text-sm text-slate-500">{foundation.focus_areas}</p>
        {foundation.url && (
          <a
            href={foundation.url}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            {foundation.url}
          </a>
        )}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs text-slate-400 uppercase">Status</p>
          <p className="text-sm font-semibold text-slate-900">
            {foundation.status}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase">Fit score</p>
          <p className="text-sm font-semibold text-slate-900">
            {foundation.fit_score ? `${foundation.fit_score}/10` : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase">Next deadline</p>
          <p className="text-sm font-semibold text-slate-900">
            {foundation.application_deadline
              ? format(parseISO(foundation.application_deadline), "MMM d, yyyy")
              : foundation.rolling_applications
              ? "Rolling"
              : "Not set"}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase">Grant range</p>
          <p className="text-sm font-semibold text-slate-900">
            {foundation.grant_min || foundation.grant_max
              ? foundation.grant_min && foundation.grant_max
                ? `${foundation.grant_min.toLocaleString()} - ${foundation.grant_max.toLocaleString()} DKK`
                : foundation.grant_min
                ? `${foundation.grant_min.toLocaleString()}+ DKK`
                : `Up to ${foundation.grant_max?.toLocaleString()} DKK`
              : "Not specified"}
          </p>
        </div>
      </div>
      {foundation.notes && (
        <div className="mt-6">
          <p className="text-xs text-slate-400 uppercase">Notes</p>
          <p className="mt-2 text-sm text-slate-700 whitespace-pre-line">
            {foundation.notes}
          </p>
        </div>
      )}
    </div>
  );
}
