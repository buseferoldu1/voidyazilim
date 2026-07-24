import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/void-auth";
import { deleteLead } from "@/lib/void-leads";

export const runtime = "nodejs";

/** Bir mesaji siler. Yalnizca oturum sahibi. */
export async function DELETE(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Yetkisiz." }, { status: 401 });
  }

  let body: { id?: unknown };
  try {
    body = (await req.json()) as { id?: unknown };
  } catch {
    return NextResponse.json(
      { ok: false, error: "Geçersiz istek." },
      { status: 400 }
    );
  }

  const id = typeof body.id === "string" ? body.id : "";
  if (!id) {
    return NextResponse.json(
      { ok: false, error: "Mesaj kimliği gerekli." },
      { status: 422 }
    );
  }

  const ok = await deleteLead(id);
  return NextResponse.json(
    ok ? { ok: true } : { ok: false, error: "Mesaj silinemedi." },
    { status: ok ? 200 : 500 }
  );
}
