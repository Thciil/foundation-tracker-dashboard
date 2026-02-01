import { NextResponse } from "next/server";
import { getFoundation } from "@/lib/queries";
import { generateOutreachTemplate } from "@/lib/outreach";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const foundation = getFoundation(Number(params.id));
  if (!foundation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const projectName =
    typeof body.projectName === "string" && body.projectName.trim().length > 0
      ? body.projectName
      : "Panna World Championship 2026";

  const template = generateOutreachTemplate(foundation, projectName);
  return NextResponse.json(template);
}
