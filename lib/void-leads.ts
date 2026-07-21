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
