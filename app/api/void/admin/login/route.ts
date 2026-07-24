import { NextResponse } from "next/server";
import { verifyPassword, startSession } from "@/lib/void-auth";

export const runtime = "nodejs";

/** Basit hiz sinirlama: IP basina kisa sureli deneme sayaci (surec omru). */
const attempts = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 8;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now - rec.ts > WINDOW_MS) {
    attempts.set(ip, { count: 1, ts: now });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_ATTEMPTS;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Çok fazla deneme. Lütfen biraz bekleyin." },
      { status: 429 }
    );
  }

  let password = "";
  try {
    const body = (await req.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json(
      { ok: false, error: "Geçersiz istek." },
      { status: 400 }
    );
  }

  if (!verifyPassword(password)) {
    return NextResponse.json(
      { ok: false, error: "Hatalı şifre." },
      { status: 401 }
    );
  }

  await startSession();
  return NextResponse.json({ ok: true });
}
