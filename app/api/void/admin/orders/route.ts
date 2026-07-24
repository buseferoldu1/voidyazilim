import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/void-auth";
import { updateOrderStatus, type OrderStatus } from "@/lib/void-orders";

export const runtime = "nodejs";

const VALID: OrderStatus[] = ["pending", "paid", "cancelled", "refunded"];

/** Siparis durumunu gunceller. Yalnizca oturum sahibi. */
export async function PATCH(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Yetkisiz." }, { status: 401 });
  }

  let body: { id?: unknown; status?: unknown };
  try {
    body = (await req.json()) as { id?: unknown; status?: unknown };
  } catch {
    return NextResponse.json(
      { ok: false, error: "Geçersiz istek." },
      { status: 400 }
    );
  }

  const id = typeof body.id === "string" ? body.id : "";
  const status = body.status as OrderStatus;
  if (!id || !VALID.includes(status)) {
    return NextResponse.json(
      { ok: false, error: "Geçersiz sipariş/durum." },
      { status: 422 }
    );
  }

  const ok = await updateOrderStatus(id, status);
  return NextResponse.json(
    ok ? { ok: true } : { ok: false, error: "Sipariş bulunamadı." },
    { status: ok ? 200 : 404 }
  );
}
