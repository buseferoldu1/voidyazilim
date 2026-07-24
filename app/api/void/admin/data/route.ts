import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/void-auth";
import { getSiteContent } from "@/lib/void-content";
import { getLeads } from "@/lib/void-leads";
import { getOrders } from "@/lib/void-orders";

export const runtime = "nodejs";

/** Panelin ihtiyac duydugu tum verileri tek istekte doner. */
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Yetkisiz." }, { status: 401 });
  }
  const [content, leads, orders] = await Promise.all([
    getSiteContent(),
    getLeads(),
    getOrders(),
  ]);
  return NextResponse.json({ ok: true, content, leads, orders });
}
