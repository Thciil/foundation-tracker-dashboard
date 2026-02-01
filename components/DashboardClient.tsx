"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format, differenceInDays, parseISO } from "date-fns";
import type { Foundation } from "@/lib/db";

const statusOptions = [
  "all",
  "research",
  "drafting",
  "submitted",
  "approved",
  "rejected",
  "not_pursuing",
] as const;

type SortKey = "name" | "fit_score" | "application_deadline" | "status";

type Props = {
  foundations: Foundation[];
};

export function DashboardClient({ foundations }: Props) {
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>(
    "all"
  );
  const [fitMin, setFitMin] = useState("0");
  const [rollingOnly, setRollingOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("fit_score");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
    return foundations
      .filter((f) => (statusFilter === "all" ? true : f.status === statusFilter))
      .filter((f) => (rollingOnly ? f.rolling_applications === 1 : true))
      .filter((f) => (fitMin ? (f.fit_score ?? 0) >= Number(fitMin) : true))
      .filter((f) =>
        search.trim().length === 0
          ? true
          : f.name.toLowerCase().includes(search.trim().toLowerCase())
      );
  }, [foundations, statusFilter, rollingOnly, fitMin, search]);

  const sorted = useMemo(() => {
    const items = [...filtered];
    items.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      const aVal = a[sortKey as keyof Foundation];
      const bVal = b[sortKey as keyof Foundation];

      if (sortKey === "application_deadline") {
        const aDate = a.application_deadline
          ? new Date(a.application_deadline).getTime()
          : Number.MAX_SAFE_INTEGER;
        const bDate = b.application_deadline
          ? new Date(b.application_deadline).getTime()
          : Number.MAX_SAFE_INTEGER;
        return (aDate - bDate) * dir;
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return (aVal - bVal) * dir;
      }

      return String(aVal ?? "").localeCompare(String(bVal ?? "")) * dir;
    });
    return items;
  }, [filtered, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  }

  return (
    <div className="space-y-6">
      <section className="bg-white/80 backdrop-blur border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Foundations</h2>
            <p className="text-sm text-slate-500">
              Track outreach, fit, and upcoming deadlines
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <input
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
              placeholder="Search by name"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <select
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as typeof statusOptions[number])
              }
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === "all" ? "All statuses" : status}
                </option>
              ))}
            </select>
            <select
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
              value={fitMin}
              onChange={(event) => setFitMin(event.target.value)}
            >
              {["0", "6", "7", "8", "9"].map((score) => (
                <option key={score} value={score}>
                  {score === "0" ? "Any fit" : `Fit ≥ ${score}`}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={rollingOnly}
                onChange={(event) => setRollingOnly(event.target.checked)}
              />
              Rolling only
            </label>
          </div>
        </div>

        <div className="mt-4 overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="py-3 pr-3">
                  <button
                    className="font-semibold text-slate-600"
                    onClick={() => toggleSort("name")}
                  >
                    Name
                  </button>
                </th>
                <th className="py-3 pr-3">
                  <button
                    className="font-semibold text-slate-600"
                    onClick={() => toggleSort("fit_score")}
                  >
                    Fit score
                  </button>
                </th>
                <th className="py-3 pr-3">
                  <button
                    className="font-semibold text-slate-600"
                    onClick={() => toggleSort("application_deadline")}
                  >
                    Next deadline
                  </button>
                </th>
                <th className="py-3 pr-3">
                  <button
                    className="font-semibold text-slate-600"
                    onClick={() => toggleSort("status")}
                  >
                    Status
                  </button>
                </th>
                <th className="py-3">Focus areas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map((foundation) => {
                const deadline = foundation.application_deadline
                  ? parseISO(foundation.application_deadline)
                  : null;
                const daysLeft = deadline ? differenceInDays(deadline, new Date()) : null;
                const urgencyClass =
                  daysLeft === null
                    ? "text-slate-400"
                    : daysLeft <= 7
                    ? "text-red-600 font-semibold"
                    : daysLeft <= 30
                    ? "text-amber-600 font-semibold"
                    : "text-slate-500";

                return (
                  <tr key={foundation.id} className="hover:bg-slate-50/70">
                    <td className="py-3 pr-3">
                      <Link
                        href={`/foundations/${foundation.id}`}
                        className="font-semibold text-slate-900 hover:text-blue-600"
                      >
                        {foundation.name}
                      </Link>
                      {foundation.rolling_applications === 1 && (
                        <span className="ml-2 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Rolling
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-3">
                      {foundation.fit_score ? (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            foundation.fit_score >= 8
                              ? "bg-emerald-100 text-emerald-700"
                              : foundation.fit_score >= 6
                              ? "bg-amber-100 text-amber-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {foundation.fit_score}/10
                        </span>
                      ) : (
                        <span className="text-slate-400">N/A</span>
                      )}
                    </td>
                    <td className={`py-3 pr-3 ${urgencyClass}`}>
                      {deadline ? format(deadline, "MMM d, yyyy") : "Rolling"}
                      {daysLeft !== null && (
                        <span className="ml-2 text-xs text-slate-400">
                          {daysLeft} days
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${statusTone(
                          foundation.status
                        )}`}
                      >
                        {foundation.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500">
                      {foundation.focus_areas}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function statusTone(status: string) {
  switch (status) {
    case "approved":
      return "bg-emerald-100 text-emerald-700";
    case "submitted":
      return "bg-blue-100 text-blue-700";
    case "drafting":
      return "bg-amber-100 text-amber-700";
    case "rejected":
      return "bg-rose-100 text-rose-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
}
