import { NextResponse } from "next/server";
import { endSession } from "@/lib/void-auth";

export const runtime = "nodejs";

export async function POST() {
  await endSession();
  return NextResponse.json({ ok: true });
}
