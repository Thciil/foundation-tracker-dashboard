import { getDb } from "./db";

interface FoundationSeed {
  name: string;
  url: string;
  focus_areas: string;
  grant_min?: number;
  grant_max?: number;
  application_deadline?: string;
  rolling_applications: boolean;
  fit_score: number;
  notes: string;
}

const foundations: FoundationSeed[] = [
  {
    name: "Nordea-fonden",
    url: "https://nordeafonden.dk",
    focus_areas: "Youth development, Outdoor activities, Participation",
    rolling_applications: true,
    fit_score: 9,
    notes:
      "72-hour pre-qualification response time. Focus on \"Børn og unge godt på vej\", \"Ud i det fri\", \"Lyst til at deltage\". Simple pre-qualification form → full application if approved. Strong fit for youth participation + outdoor/active culture.",
  },
  {
    name: "Lauritzen Fonden",
    url: "https://lauritzenfonden.com",
    focus_areas:
      "Vulnerable youth, Culture and community participation, Education pathways",
    application_deadline: "2026-06-21",
    rolling_applications: false,
    fit_score: 9,
    notes:
      "Quarterly deadlines: Jan 11, Apr 26, Jun 21, Oct 4. Focuses on \"beskyttende og forebyggende faktor\" (protective and preventive factors) through culture, community, play, movement. ~800 applications/year. PERFECT FIT for vulnerable youth + culture mission.",
  },
  {
    name: "TrygFonden",
    url: "https://tryghed.dk",
    focus_areas: "Safety and security for vulnerable youth, Community building",
    rolling_applications: true,
    fit_score: 7,
    notes:
      "Requires alignment with \"tryghed\" (safety/security) mission. Position Panna as creating safe belonging spaces for youth excluded from traditional sports. Major projects (research and implementation).",
  },
  {
    name: "Bikubenfonden",
    url: "https://www.bikubenfonden.dk",
    focus_areas:
      "Youth empowerment, Art in public spaces, Vulnerable youth, Decision-making power",
    rolling_applications: false,
    fit_score: 8,
    notes:
      'Programs: "En Vej til Alle" (43,000 youth not in education/work), "Unges beslutningskraft" (youth decision-making). Focus on complex problems, youth voice, letting youth define needs. Possibly invitation-only or strategic partnerships rather than open applications. Worth exploring partnership angle.',
  },
  {
    name: "Augustinus Fonden",
    url: "https://augustinusfonden.dk",
    focus_areas:
      "Culture preservation, Performing arts, Cultural heritage, Social causes for vulnerable people",
    rolling_applications: false,
    fit_score: 6,
    notes:
      "One of Denmark's major culture foundations. Primary focus on traditional culture/arts and cultural heritage. Possible fit through \"culture as development tool\" angle for vulnerable youth. Worth exploring but not top priority.",
  },
  {
    name: "Lokale og Anlægsfonden",
    url: "https://lokaleanlaegsfonden.dk",
    focus_areas: "Grassroots sports, Facilities, Youth programs",
    rolling_applications: false,
    fit_score: 8,
    notes:
      "Part of DKK 94.8 million annual budget for sports. Major funder of organized grassroots sports in Denmark. Good fit for youth sports + facility/event support.",
  },
  {
    name: "Nordic Culture Fund",
    url: "https://nordiskkulturfond.org",
    focus_areas: "Cross-Nordic cultural collaborations",
    rolling_applications: false,
    fit_score: 7,
    notes:
      "Requires Nordic collaboration element. Good fit for international cultural event with Nordic reach. Project-based grants, 2026 deadlines to be announced.",
  },
  {
    name: "Egmont Fonden",
    url: "https://www.egmontfonden.dk",
    focus_areas: "Children and youth welfare, Social initiatives",
    rolling_applications: false,
    fit_score: 8,
    notes:
      "One of Denmark's largest foundations. Focus on children and youth welfare, social initiatives. Annual grants of 400+ million DKK. Research application process and deadlines.",
  },
  {
    name: "Frimodt-Heineke Fonden",
    url: "https://www.frimh.dk",
    focus_areas: "Youth development, Education, Social welfare",
    rolling_applications: false,
    fit_score: 7,
    notes:
      "Focus on youth development, education, social welfare. Research specific application requirements and deadlines.",
  },
  {
    name: "DGI (Danske Gymnastik- og Idrætsforeninger)",
    url: "https://www.dgi.dk",
    focus_areas: "Sport, Movement, Community, Facilities",
    rolling_applications: false,
    fit_score: 8,
    notes:
      "National sports organization. Multiple funding programs for sport and movement initiatives. Research specific programs for street sports / alternative sports.",
  },
];

export function seedDatabase() {
  const db = getDb();

  const stmt = db.prepare(`
    INSERT INTO foundations (
      name, url, focus_areas, grant_min, grant_max,
      application_deadline, rolling_applications, fit_score, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  foundations.forEach((f) => {
    try {
      stmt.run(
        f.name,
        f.url,
        f.focus_areas,
        f.grant_min || null,
        f.grant_max || null,
        f.application_deadline || null,
        f.rolling_applications ? 1 : 0,
        f.fit_score,
        f.notes
      );
    } catch (error) {
      if (error instanceof Error && !error.message.includes("UNIQUE")) {
        throw error;
      }
    }
  });
}

export function ensureSeeded() {
  const db = getDb();
  const count = db
    .prepare("SELECT COUNT(*) as count FROM foundations")
    .get() as { count: number };

  if (count.count === 0) {
    seedDatabase();
  }
}
