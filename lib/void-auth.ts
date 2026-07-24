import crypto from "crypto";
import { cookies } from "next/headers";

/**
 * VOID admin paneli icin hafif, sunucu tarafli oturum.
 *
 * Sifre dogrulanunca HMAC-SHA256 ile imzalanmis bir cerez verilir; her istekte
 * imza ve son kullanma tarihi kontrol edilir. Harici bir oturum deposu
 * gerektirmez (stateless).
 *
 * Ortam degiskenleri (opsiyonel ama uretimde onerilir):
 *  - ADMIN_PASSWORD: giris sifresi. Tanimli degilse asagidaki varsayilan.
 *  - ADMIN_SECRET:   cerez imzalama anahtari. Tanimli degilse sabit bir
 *                    varsayilan kullanilir (uretimde mutlaka override edin).
 */

const DEFAULT_PASSWORD = "Berkdrkl123*";
const DEFAULT_SECRET = "void-yazilim-admin-2026-degistir-beni";
const COOKIE_NAME = "void_admin";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 saat

function getPassword(): string {
  return process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD;
}

function getSecret(): string {
  return process.env.ADMIN_SECRET || DEFAULT_SECRET;
}

/** Sabit sureli string karsilastirmasi (zamanlama saldirilarina karsi). */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export function verifyPassword(input: string): boolean {
  return safeEqual(input, getPassword());
}

function sign(payload: string): string {
  return crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
}

/** exp.imza formatinda bir oturum jetonu uretir. */
function createToken(): string {
  const exp = String(Date.now() + SESSION_TTL_MS);
  return `${exp}.${sign(exp)}`;
}

function isTokenValid(token: string | undefined): boolean {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;
  if (!safeEqual(sig, sign(exp))) return false;
  const expNum = Number(exp);
  return Number.isFinite(expNum) && Date.now() < expNum;
}

/** Basarili girisin ardindan oturum cerezini ayarlar. */
export async function startSession(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, createToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

/** Oturumu sonlandirir (cerezi siler). */
export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** Gecerli istegin oturumu var mi? */
export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return isTokenValid(store.get(COOKIE_NAME)?.value);
}
