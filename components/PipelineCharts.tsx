"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { Foundation } from "@/lib/db";

const COLORS = ["#2563eb", "#f59e0b", "#10b981", "#ef4444", "#64748b"];

export function PipelineCharts({ foundations }: { foundations: Foundation[] }) {
  const statusCounts = foundations.reduce<Record<string, number>>((acc, f) => {
    acc[f.status] = (acc[f.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const fitBuckets = [
    { name: "9-10", min: 9, max: 10 },
    { name: "7-8", min: 7, max: 8 },
    { name: "5-6", min: 5, max: 6 },
    { name: "1-4", min: 1, max: 4 },
  ];

  const fitData = fitBuckets.map((bucket) => ({
    name: bucket.name,
    value: foundations.filter((f) =>
      f.fit_score ? f.fit_score >= bucket.min && f.fit_score <= bucket.max : false
    ).length,
  }));

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Status breakdown</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={90}>
                {statusData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">
          Fit score distribution
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fitData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
