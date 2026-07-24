import { neon } from "@neondatabase/serverless";
import { promises as fs } from "fs";
import path from "path";

/**
 * VOID Yazilim iletisim formu basvurulari icin bagimsiz, hafif kalicilik.
 * Cicekci veri deposundan (lib/store.ts) ayridir; kendi tablosunu kullanir.
 *
 * Iki mod:
 *  - Postgres (DATABASE_URL varsa): `void_leads` tablosuna INSERT. Kalicidir.
 *  - Dosya (aksi halde): data/void-leads.json. Yerel gelistirme icin.
 *
 * saveLead asla hata firlatmaz; her durumda basvuruyu en azindan sunucu
 * gunlugune yazar, boylece istek akisi bozulmaz.
 */

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const LEADS_FILE = path.join(process.cwd(), "data", "void-leads.json");

export interface VoidLead {
  // Silme icin kararli anahtar. DB modunda satirin sayisal id'si, dosya
  // modunda receivedAt (yeterince benzersiz). saveLead sirasinda uretilmez;
  // getLeads okurken doldurulur.
  id?: string;
  name: string;
  email: string;
  company: string;
  budget: string;
  message: string;
  receivedAt: string;
}

// Tablo yalnizca ilk yazimda bir kez olusturulur (surec omru boyunca).
let schemaReady = false;

async function saveToDatabase(lead: VoidLead): Promise<boolean> {
  if (!DATABASE_URL) return false;
  try {
    const sql = neon(DATABASE_URL);
    if (!schemaReady) {
      await sql`
        CREATE TABLE IF NOT EXISTS void_leads (
          id BIGSERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          company TEXT,
          budget TEXT,
          message TEXT NOT NULL,
          received_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      schemaReady = true;
    }
    await sql`
      INSERT INTO void_leads (name, email, company, budget, message, received_at)
      VALUES (${lead.name}, ${lead.email}, ${lead.company}, ${lead.budget}, ${lead.message}, ${lead.receivedAt})
    `;
    return true;
  } catch (err) {
    console.error("[VOID] Veritabanina kayit başarısız, dosyaya düşülüyor:", err);
    return false;
  }
}

async function saveToFile(lead: VoidLead): Promise<boolean> {
  try {
    let list: VoidLead[] = [];
    try {
      list = JSON.parse(await fs.readFile(LEADS_FILE, "utf8"));
      if (!Array.isArray(list)) list = [];
    } catch {
      // Dosya henuz yok; yeni liste ile baslanir.
    }
    list.push(lead);
    await fs.mkdir(path.dirname(LEADS_FILE), { recursive: true });
    await fs.writeFile(LEADS_FILE, JSON.stringify(list, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("[VOID] Dosyaya kayit başarısız:", err);
    return false;
  }
}

/** Basvuruyu kalici hale getirir. Kullanilan yontemi doner. */
export async function saveLead(
  lead: VoidLead
): Promise<"db" | "file" | "log"> {
  if (await saveToDatabase(lead)) return "db";
  if (await saveToFile(lead)) return "file";
  console.log("[VOID] Basvuru (yalnizca gunluk):", lead);
  return "log";
}

/**
 * Tum basvurulari (en yeni ustte) doner. Admin paneli icin.
 * DATABASE_URL varsa DB'den, yoksa yerel dosyadan okur.
 */
export async function getLeads(): Promise<VoidLead[]> {
  if (DATABASE_URL) {
    try {
      const sql = neon(DATABASE_URL);
      await sql`
        CREATE TABLE IF NOT EXISTS void_leads (
          id BIGSERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          company TEXT,
          budget TEXT,
          message TEXT NOT NULL,
          received_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      const rows = (await sql`
        SELECT id, name, email, company, budget, message, received_at
        FROM void_leads ORDER BY received_at DESC
      `) as Record<string, unknown>[];
      return rows.map((r) => ({
        id: String(r.id),
        name: String(r.name),
        email: String(r.email),
        company: String(r.company ?? ""),
        budget: String(r.budget ?? ""),
        message: String(r.message),
        receivedAt:
          r.received_at instanceof Date
            ? r.received_at.toISOString()
            : String(r.received_at),
      }));
    } catch (err) {
      console.error("[VOID] Basvuru DB okuma hatasi:", err);
    }
  }
  try {
    const list = JSON.parse(await fs.readFile(LEADS_FILE, "utf8"));
    if (Array.isArray(list)) {
      return (list as VoidLead[])
        .slice()
        .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt))
        // Dosya modunda kararli anahtar receivedAt'tir.
        .map((l) => ({ ...l, id: l.receivedAt }));
    }
  } catch {
    // Dosya yoksa bos liste.
  }
  return [];
}

/**
 * Bir basvuruyu siler. DB modunda sayisal id ile, dosya modunda receivedAt
 * ile eslesir (getLeads bu id'yi doldurur). Silinip silinmedigini doner.
 */
export async function deleteLead(id: string): Promise<boolean> {
  if (DATABASE_URL) {
    try {
      const sql = neon(DATABASE_URL);
      const numeric = Number(id);
      if (!Number.isFinite(numeric)) return false;
      await sql`DELETE FROM void_leads WHERE id = ${numeric}`;
      return true;
    } catch (err) {
      console.error("[VOID] Basvuru silme hatasi:", err);
      return false;
    }
  }
  try {
    const raw = JSON.parse(await fs.readFile(LEADS_FILE, "utf8"));
    if (!Array.isArray(raw)) return false;
    const next = (raw as VoidLead[]).filter((l) => l.receivedAt !== id);
    await fs.writeFile(LEADS_FILE, JSON.stringify(next, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("[VOID] Basvuru dosyadan silme hatasi:", err);
    return false;
  }
}
