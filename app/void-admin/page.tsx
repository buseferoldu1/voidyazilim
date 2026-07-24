import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/void-auth";
import { getSiteContent } from "@/lib/void-content";
import { getLeads } from "@/lib/void-leads";
import { getOrders } from "@/lib/void-orders";
import AdminDashboard from "@/components/admin/admin-dashboard";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata = {
  title: "VOID Yönetim Paneli",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!(await isAuthenticated())) {
    redirect("/void-admin/login");
  }

  const [content, leads, orders] = await Promise.all([
    getSiteContent(),
    getLeads(),
    getOrders(),
  ]);

  return <AdminDashboard initialContent={content} initialLeads={leads} initialOrders={orders} />;
}
