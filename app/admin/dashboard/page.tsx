import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/apiUtils";
import DashboardOverviewClient from "@/components/admin/DashboardOverviewClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) {
    redirect("/admin/login?reason=session_expired");
  }

  return <DashboardOverviewClient />;
}
