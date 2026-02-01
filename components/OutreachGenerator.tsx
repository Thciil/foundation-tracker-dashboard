"use client";

import { useState } from "react";

export function OutreachGenerator({ foundationId }: { foundationId: number }) {
  const [projectName, setProjectName] = useState("Panna World Championship 2026");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    const response = await fetch(`/api/foundations/${foundationId}/outreach`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectName }),
    });
    const data = await response.json();
    setSubject(data.subject);
    setBody(data.body);
    setLoading(false);
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Outreach email</h3>
      <p className="text-sm text-slate-500">
        Generate a tailored outreach template
      </p>
      <div className="mt-4 space-y-3">
        <label className="block text-sm text-slate-500">
          Project name
          <input
            className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2"
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
          />
        </label>
        <button
          onClick={handleGenerate}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg font-semibold"
        >
          {loading ? "Generating..." : "Generate outreach"}
        </button>
        {(subject || body) && (
          <div className="space-y-3">
            <div>
              <p className="text-xs uppercase text-slate-400">Subject</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">
                {subject}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-400">Body</p>
              <pre className="mt-1 whitespace-pre-wrap text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3">
                {body}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
