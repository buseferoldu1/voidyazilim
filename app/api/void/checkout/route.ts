import { NextResponse } from "next/server";
import { createOrder } from "@/lib/void-orders";

export const runtime = "nodejs";

/**
 * Odeme baslatma ucu.
 *
 * Su an: gelen paket/musteri bilgisiyle "pending" bir siparis olusturur ve
 * admin panelinde gorunur. Gercek tahsilat henuz baglanmadi.
 *
 * iyzico entegrasyonu (SONRA):
 *   1. `npm i iyzipay` (veya iyzico REST API'sini fetch ile cagirin).
 *   2. Asagida isaretlenen "IYZICO" bloguna Checkout Form / 3DS baslatmayi ekleyin;
 *      IYZICO_API_KEY ve IYZICO_SECRET_KEY ortam degiskenlerinden okunur.
 *   3. iyzico callback'i icin /api/void/checkout/callback route'u ekleyip
 *      basarili odemede updateOrderStatus(order.id, "paid") cagirin.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asString(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Geçersiz istek." },
      { status: 400 }
    );
  }

  const plan = asString(body.plan);
  const customerName = asString(body.customerName);
  const customerEmail = asString(body.customerEmail);
  const customerPhone = asString(body.customerPhone);
  const note = asString(body.note);
  const amount = Number(body.amount);

  const errors: Record<string, string> = {};
  if (plan.length < 2) errors.plan = "Paket seçiniz.";
  if (customerName.length < 2) errors.customerName = "Ad soyad giriniz.";
  if (!EMAIL_RE.test(customerEmail)) errors.customerEmail = "Geçerli e-posta giriniz.";
  if (!Number.isFinite(amount) || amount <= 0) errors.amount = "Geçerli tutar giriniz.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const order = await createOrder({
    plan,
    amount,
    currency: asString(body.currency) || "TRY",
    customerName,
    customerEmail,
    customerPhone,
    note,
  });

  // ---------------------------------------------------------------------
  // IYZICO ENTEGRASYON NOKTASI
  // Burada iyzico Checkout Form baslatilip donen `paymentPageUrl` client'a
  // iletilecek. Ornek:
  //   const iyzico = new Iyzipay({ apiKey, secretKey, uri });
  //   const result = await iyzico.checkoutFormInitialize.create({ ... , price: amount, ... });
  //   return NextResponse.json({ ok: true, orderId: order.id, paymentPageUrl: result.paymentPageUrl });
  // ---------------------------------------------------------------------

  return NextResponse.json({
    ok: true,
    orderId: order.id,
    status: order.status,
    // paymentPageUrl: null,  // iyzico baglaninca doldurulacak
    message:
      "Talebiniz alındı. Ödeme altyapısı (iyzico) yakında aktif olacak; ekibimiz sizinle iletişime geçecek.",
  });
}
