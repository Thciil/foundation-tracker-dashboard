import { Foundation } from "./db";

export function generateEmailBody(
  foundation: Foundation,
  projectName: string
): string {
  const focus = foundation.focus_areas || "youth development";

  return `Dear ${foundation.name} Team,

I'm writing to introduce ${projectName}, a project that aligns closely with ${foundation.name}'s mission around ${focus}.

[PROJECT SUMMARY - 2-3 sentences about what you're doing and why it matters]

Example:
"The Panna World Championship brings together 150+ young athletes (ages 16-25) from 30+ countries for a week-long celebration of street football culture. Beyond competition, it's a platform for youth leadership, cultural exchange, and community building—creating pathways for young people often excluded from traditional sports structures."

[ALIGNMENT WITH FOUNDATION - Why this fits their mission]

Example focus areas:
${focus
  .split(",")
  .map((f) => `- ${f.trim()}: [explain how your project addresses this]`)
  .join("\n")}

[ASK]
We are seeking [AMOUNT] DKK to [SPECIFIC USE - e.g., "cover venue costs and participant scholarships"]. This investment would enable us to [IMPACT - e.g., "provide 30 free entry slots for youth from underserved communities"].

[CLOSING]
I'd welcome the opportunity to discuss how ${projectName} could partner with ${foundation.name} to achieve our shared goals around ${focus}.

Thank you for considering this request. I'm happy to provide additional materials or answer any questions.

Best regards,
Kristoffer Raun
Founder, Pannahouse
[contact info]

---

[ATTACHMENTS TO INCLUDE]
- Project description (1-2 pages)
- Budget breakdown
- Impact metrics from past years
- Team bios
- Photos/videos from previous events
${foundation.url ? `\nFoundation application portal: ${foundation.url}` : ""}`;
}

export function generateOutreachTemplate(
  foundation: Foundation,
  projectName: string
) {
  return {
    subject: `Partnership Opportunity: ${projectName}`,
    body: generateEmailBody(foundation, projectName),
  };
}
