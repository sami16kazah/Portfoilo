import type { Metadata } from "next";
import { requireAdmin } from "@/lib/apiUtils";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminCheck = await requireAdmin();

  if (!adminCheck.ok) {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <AdminSidebar userEmail={adminCheck.user.email} />
      <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 pt-20 md:pt-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
