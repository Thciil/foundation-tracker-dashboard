# Foundation Tracker Dashboard

Web dashboard for the Foundation Tracker CLI, built with Next.js 15, TypeScript, Tailwind CSS, and SQLite (better-sqlite3).

## Features
- Dashboard with sortable/filterable foundation table
- Foundation detail page with full information display
- Outreach email generator
- Status updates (research → submitted → approved/rejected)
- Deadline warnings (color-coded by urgency)
- Pipeline analytics (status breakdown + fit score distribution)

## Getting Started

### 1) Install dependencies
```bash
npm install
```

### 2) Configure environment
```bash
cp .env.example .env
```

### 3) Run the app
```bash
npm run dev
```

Open http://localhost:3000

## Data + Seeding
- SQLite database lives in `data/foundations.db`.
- On first run, the database is created and seeded with 10 Danish/Nordic foundations (from the original CLI seed data).

## Deployment (Vercel)
This project is ready for Vercel deployment:
- Uses Next.js App Router
- SQLite stored in `data/` (ensure a persistent volume if needed)
- Set `OPENAI_API_KEY` (not required for current features)

## Project Structure
```
app/                 # Next.js routes
components/          # UI components
lib/                 # DB + logic (schema, queries, seed, outreach generator)
data/                # SQLite database
```
