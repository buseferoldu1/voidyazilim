import { NextResponse } from "next/server";
import { saveLead } from "@/lib/void-leads";

export const runtime = "nodejs";

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  budget?: unknown;
  message?: unknown;
  // Bal kupu (bot) alani: doldurulmussa istek sessizce reddedilir.
  website?: unknown;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asString(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

export async function POST(req: Request) {
  let body: ContactPayload;
  try {
    body = (await req.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Geçersiz istek." },
      { status: 400 }
    );
  }

  // Bal kupu dolduysa bot kabul edip basarili gorunumu don (spam engelleme).
  if (asString(body.website)) {
    return NextResponse.json({ ok: true, message: "Teşekkürler!" });
  }

  const name = asString(body.name);
  const email = asString(body.email);
  const company = asString(body.company);
  const budget = asString(body.budget);
  const message = asString(body.message);

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Lütfen adınızı girin.";
  if (!EMAIL_RE.test(email)) errors.email = "Geçerli bir e-posta girin.";
  if (message.length < 10)
    errors.message = "Mesaj en az 10 karakter olmalı.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  // Basvuruyu kalici hale getir. Neon Postgres varsa oraya, yoksa dosyaya
  // yazilir; her iki durumda da hata istek akisini bozmaz. E-posta/CRM
  // entegrasyonu icin saveLead sonrasi ideal noktadir.
  const stored = await saveLead({
    name,
    email,
    company: company || "-",
    budget: budget || "-",
    message,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({
    ok: true,
    stored,
    message: "Mesajınız alındı. En kısa sürede size dönüş yapacağız.",
  });
}
