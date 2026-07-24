import { neon } from "@neondatabase/serverless";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

/**
 * VOID siparis/odeme kayitlari.
 *
 * Odeme altyapisi (iyzico) daha sonra baglanacak; bu katman siparisleri
 * olusturur, listeler ve durumlarini gunceller. iyzico entegrasyonu
 * app/api/void/checkout icinde isaretlenmis noktaya eklenir.
 *
 * Kalicilik leads/content ile ayni desende: DATABASE_URL varsa Postgres,
 * yoksa data/void-orders.json.
 */

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const ORDERS_FILE = path.join(process.cwd(), "data", "void-orders.json");

export type OrderStatus = "pending" | "paid" | "cancelled" | "refunded";

export interface VoidOrder {
  id: string;
  plan: string;
  amount: number; // kurus/kr degil, TL tam sayi/ondalik
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  note: string;
  status: OrderStatus;
  createdAt: string;
}

export interface NewOrderInput {
  plan: string;
  amount: number;
  currency?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  note?: string;
}

let schemaReady = false;

async function ensureSchema() {
  if (schemaReady || !DATABASE_URL) return;
  const sql = neon(DATABASE_URL);
  await sql`
    CREATE TABLE IF NOT EXISTS void_orders (
      id TEXT PRIMARY KEY,
      plan TEXT NOT NULL,
      amount NUMERIC NOT NULL,
      currency TEXT NOT NULL DEFAULT 'TRY',
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT,
      note TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  schemaReady = true;
}

function newId(): string {
  return `ord_${Date.now().toString(36)}${crypto.randomBytes(4).toString("hex")}`;
}

// --- Dosya yardimcilari -----------------------------------------------------

async function readFileOrders(): Promise<VoidOrder[]> {
  try {
    const raw = await fs.readFile(ORDERS_FILE, "utf8");
    const list = JSON.parse(raw);
    return Array.isArray(list) ? (list as VoidOrder[]) : [];
  } catch {
    return [];
  }
}

async function writeFileOrders(list: VoidOrder[]): Promise<void> {
  await fs.mkdir(path.dirname(ORDERS_FILE), { recursive: true });
  await fs.writeFile(ORDERS_FILE, JSON.stringify(list, null, 2), "utf8");
}

// --- Genel API --------------------------------------------------------------

export async function createOrder(input: NewOrderInput): Promise<VoidOrder> {
  const order: VoidOrder = {
    id: newId(),
    plan: input.plan,
    amount: input.amount,
    currency: input.currency || "TRY",
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone || "",
    note: input.note || "",
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  if (DATABASE_URL) {
    try {
      const sql = neon(DATABASE_URL);
      await ensureSchema();
      await sql`
        INSERT INTO void_orders
          (id, plan, amount, currency, customer_name, customer_email, customer_phone, note, status, created_at)
        VALUES
          (${order.id}, ${order.plan}, ${order.amount}, ${order.currency},
           ${order.customerName}, ${order.customerEmail}, ${order.customerPhone},
           ${order.note}, ${order.status}, ${order.createdAt})
      `;
      return order;
    } catch (err) {
      console.error("[VOID] Siparis DB yazma hatasi, dosyaya dusuluyor:", err);
    }
  }

  const list = await readFileOrders();
  list.push(order);
  await writeFileOrders(list);
  return order;
}

export async function getOrders(): Promise<VoidOrder[]> {
  if (DATABASE_URL) {
    try {
      const sql = neon(DATABASE_URL);
      await ensureSchema();
      const rows = (await sql`
        SELECT id, plan, amount, currency, customer_name, customer_email,
               customer_phone, note, status, created_at
        FROM void_orders ORDER BY created_at DESC
      `) as Record<string, unknown>[];
      return rows.map((r) => ({
        id: String(r.id),
        plan: String(r.plan),
        amount: Number(r.amount),
        currency: String(r.currency),
        customerName: String(r.customer_name),
        customerEmail: String(r.customer_email),
        customerPhone: String(r.customer_phone ?? ""),
        note: String(r.note ?? ""),
        status: String(r.status) as OrderStatus,
        createdAt:
          r.created_at instanceof Date
            ? r.created_at.toISOString()
            : String(r.created_at),
      }));
    } catch (err) {
      console.error("[VOID] Siparis DB okuma hatasi:", err);
    }
  }
  const list = await readFileOrders();
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<boolean> {
  if (DATABASE_URL) {
    try {
      const sql = neon(DATABASE_URL);
      await ensureSchema();
      await sql`UPDATE void_orders SET status = ${status} WHERE id = ${id}`;
      return true;
    } catch (err) {
      console.error("[VOID] Siparis durum guncelleme hatasi:", err);
    }
  }
  const list = await readFileOrders();
  const idx = list.findIndex((o) => o.id === id);
  if (idx === -1) return false;
  list[idx].status = status;
  await writeFileOrders(list);
  return true;
}
