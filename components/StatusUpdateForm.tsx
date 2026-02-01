"use client";

import { useState } from "react";
import type { Foundation } from "@/lib/db";

const statusOptions = [
  "research",
  "drafting",
  "submitted",
  "approved",
  "rejected",
  "not_pursuing",
] as const;

export function StatusUpdateForm({ foundation }: { foundation: Foundation }) {
  const [status, setStatus] = useState(foundation.status);
  const [deadline, setDeadline] = useState(
    foundation.application_deadline ?? ""
  );
  const [notes, setNotes] = useState(foundation.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await fetch(`/api/foundations/${foundation.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, application_deadline: deadline, notes }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Update status</h3>
      <div className="mt-4 space-y-3">
        <label className="block text-sm text-slate-500">
          Status
          <select
            className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 bg-white"
            value={status}
            onChange={(event) => setStatus(event.target.value as Foundation["status"])}
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm text-slate-500">
          Next deadline
          <input
            type="date"
            className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2"
            value={deadline}
            onChange={(event) => setDeadline(event.target.value)}
          />
        </label>
        <label className="block text-sm text-slate-500">
          Notes
          <textarea
            rows={4}
            className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save updates"}
          </button>
          {saved && <span className="text-sm text-emerald-600">Saved</span>}
        </div>
      </div>
    </div>
  );
}
