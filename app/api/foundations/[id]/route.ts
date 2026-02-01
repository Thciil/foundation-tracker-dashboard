import { NextResponse } from "next/server";
import { getFoundation, updateFoundation } from "@/lib/queries";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const foundation = getFoundation(Number(id));
  if (!foundation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(foundation);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const result = updateFoundation(Number(id), body);
  if (result.changes === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const foundation = getFoundation(Number(id));
  return NextResponse.json({ ok: true, foundation });
}
