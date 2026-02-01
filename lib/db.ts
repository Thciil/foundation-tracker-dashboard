import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "foundations.db");

export interface Foundation {
  id: number;
  name: string;
  url: string | null;
  focus_areas: string | null;
  grant_min: number | null;
  grant_max: number | null;
  application_deadline: string | null; // ISO date string
  rolling_applications: number; // 0/1
  fit_score: number | null; // 1-10
  status: "research" | "drafting" | "submitted" | "approved" | "rejected" | "not_pursuing";
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: number;
  foundation_id: number;
  project_name: string;
  amount_requested: number | null;
  submission_date: string | null;
  decision_date: string | null;
  status: "draft" | "submitted" | "pending" | "approved" | "rejected";
  outcome: string | null;
  notes: string | null;
  created_at: string;
}

export interface FollowUp {
  id: number;
  foundation_id: number;
  follow_up_date: string; // ISO date string
  action: string;
  completed: number; // 0/1
  notes: string | null;
  created_at: string;
}

export function initDatabase(): Database.Database {
  const db = new Database(DB_PATH);
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS foundations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      url TEXT,
      focus_areas TEXT,
      grant_min INTEGER,
      grant_max INTEGER,
      application_deadline TEXT,
      rolling_applications BOOLEAN DEFAULT 0,
      fit_score INTEGER CHECK (fit_score >= 1 AND fit_score <= 10),
      status TEXT DEFAULT 'research' CHECK (status IN ('research', 'drafting', 'submitted', 'approved', 'rejected', 'not_pursuing')),
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      foundation_id INTEGER NOT NULL,
      project_name TEXT NOT NULL,
      amount_requested INTEGER,
      submission_date TEXT,
      decision_date TEXT,
      status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'pending', 'approved', 'rejected')),
      outcome TEXT,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (foundation_id) REFERENCES foundations(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS follow_ups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      foundation_id INTEGER NOT NULL,
      follow_up_date TEXT NOT NULL,
      action TEXT NOT NULL,
      completed BOOLEAN DEFAULT 0,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (foundation_id) REFERENCES foundations(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_foundations_status ON foundations(status);
    CREATE INDEX IF NOT EXISTS idx_foundations_fit_score ON foundations(fit_score);
    CREATE INDEX IF NOT EXISTS idx_foundations_deadline ON foundations(application_deadline);
    CREATE INDEX IF NOT EXISTS idx_follow_ups_date ON follow_ups(follow_up_date);
    CREATE INDEX IF NOT EXISTS idx_follow_ups_completed ON follow_ups(completed);
  `);

  db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_foundations_timestamp 
    AFTER UPDATE ON foundations
    BEGIN
      UPDATE foundations SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
  `);

  return db;
}

export function getDb(): Database.Database {
  return initDatabase();
}
