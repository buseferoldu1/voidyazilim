import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/void-auth";
import {
  getSiteContent,
  saveSiteContent,
  DEFAULT_CONTENT,
  type SiteContent,
} from "@/lib/void-content";

export const runtime = "nodejs";

/** Yayindaki icerik (herkese acik degil; panel icin, oturum gerektirir). */
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Yetkisiz." }, { status: 401 });
  }
  const content = await getSiteContent();
  return NextResponse.json({ ok: true, content });
}

/** Tam icerigi kaydeder. Yalnizca oturum sahibi. */
export async function PUT(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Yetkisiz." }, { status: 401 });
  }

  let incoming: unknown;
  try {
    incoming = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Geçersiz istek." },
      { status: 400 }
    );
  }

  if (typeof incoming !== "object" || incoming === null) {
    return NextResponse.json(
      { ok: false, error: "Geçersiz içerik." },
      { status: 422 }
    );
  }

  // Gelen icerigi varsayilanlarin ustune koy; eksik/bozuk alanlar tolere edilir.
  const merged = { ...DEFAULT_CONTENT, ...(incoming as Partial<SiteContent>) };
  const method = await saveSiteContent(merged as SiteContent);

  if (method === "none") {
    return NextResponse.json(
      { ok: false, error: "İçerik kaydedilemedi." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, method, content: merged });
}
