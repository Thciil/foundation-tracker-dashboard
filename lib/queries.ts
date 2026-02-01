import { getDb, Foundation } from "./db";
import { ensureSeeded } from "./seed";

export interface FoundationFilters {
  status?: string;
  fitMin?: number;
  rolling?: boolean;
}

export function listFoundations(filters: FoundationFilters = {}): Foundation[] {
  ensureSeeded();
  const db = getDb();

  let query = "SELECT * FROM foundations WHERE 1=1";
  const params: (string | number)[] = [];

  if (filters.status) {
    query += " AND status = ?";
    params.push(filters.status);
  }

  if (filters.fitMin) {
    query += " AND fit_score >= ?";
    params.push(filters.fitMin);
  }

  if (filters.rolling !== undefined) {
    query += " AND rolling_applications = ?";
    params.push(filters.rolling ? 1 : 0);
  }

  query += " ORDER BY fit_score DESC NULLS LAST, application_deadline ASC NULLS LAST";

  return db.prepare(query).all(...params) as Foundation[];
}

export function getFoundation(id: number): Foundation | undefined {
  ensureSeeded();
  const db = getDb();
  return db.prepare("SELECT * FROM foundations WHERE id = ?").get(id) as
    | Foundation
    | undefined;
}

export function updateFoundationStatus(id: number, status: string) {
  const db = getDb();
  const stmt = db.prepare(
    `
    UPDATE foundations
    SET status = ?
    WHERE id = ?
  `
  );
  return stmt.run(status, id);
}

export function updateFoundation(
  id: number,
  data: Partial<{
    status: string;
    fit_score: number | null;
    notes: string | null;
    application_deadline: string | null;
  }>
) {
  const db = getDb();
  const updates: string[] = [];
  const params: (string | number | null)[] = [];

  if (data.status) {
    updates.push("status = ?");
    params.push(data.status);
  }

  if (data.fit_score !== undefined) {
    updates.push("fit_score = ?");
    params.push(data.fit_score);
  }

  if (data.notes !== undefined) {
    updates.push("notes = ?");
    params.push(data.notes);
  }

  if (data.application_deadline !== undefined) {
    updates.push("application_deadline = ?");
    params.push(data.application_deadline);
  }

  if (updates.length === 0) {
    return { changes: 0 } as { changes: number };
  }

  params.push(id);

  const stmt = db.prepare(`
    UPDATE foundations
    SET ${updates.join(", ")}
    WHERE id = ?
  `);

  return stmt.run(...params);
}

export function getStats() {
  ensureSeeded();
  const db = getDb();

  const total = db.prepare("SELECT COUNT(*) as count FROM foundations").get() as
    | { count: number }
    | undefined;

  const byStatus = db
    .prepare(
      `
    SELECT status, COUNT(*) as count
    FROM foundations
    GROUP BY status
  `
    )
    .all() as { status: string; count: number }[];

  const avgFitScore = db
    .prepare(
      `
    SELECT AVG(fit_score) as avg
    FROM foundations
    WHERE fit_score IS NOT NULL
  `
    )
    .get() as { avg: number | null };

  const highFit = db
    .prepare(
      `
    SELECT COUNT(*) as count
    FROM foundations
    WHERE fit_score >= 8
  `
    )
    .get() as { count: number };

  const upcomingDeadlines = db
    .prepare(
      `
    SELECT COUNT(*) as count
    FROM foundations
    WHERE application_deadline IS NOT NULL
    AND date(application_deadline) >= date('now')
    AND date(application_deadline) <= date('now', '+90 days')
  `
    )
    .get() as { count: number };

  return {
    total: total?.count ?? 0,
    highFit: highFit.count,
    avgFitScore: avgFitScore.avg,
    upcomingDeadlines: upcomingDeadlines.count,
    byStatus,
  };
}

export function getUpcomingDeadlines(days = 90): Foundation[] {
  ensureSeeded();
  const db = getDb();
  const stmt = db.prepare(
    `
    SELECT * FROM foundations
    WHERE application_deadline IS NOT NULL
    AND date(application_deadline) >= date('now')
    AND date(application_deadline) <= date('now', '+' || ? || ' days')
    ORDER BY application_deadline ASC
  `
  );

  return stmt.all(days) as Foundation[];
}
