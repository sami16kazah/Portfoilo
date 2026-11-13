import type { Metadata } from "next";
import { requireAdmin } from "@/lib/apiUtils";
import { ensureSyncedForAdmin } from "@/lib/syncDefaults";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminMuiThemeProvider from "@/components/admin/AdminMuiThemeProvider";

export const metadata: Metadata = {
  title: "Portfolio Studio · Admin",
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

  if (adminCheck.ok) {
    try {
      await ensureSyncedForAdmin();
    } catch (error) {
      console.warn("Admin initial defaults sync skipped:", error);
    }
  }

  return (
    <AdminMuiThemeProvider>
      <div className="min-h-screen bg-[#070B14] text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
        {adminCheck.ok ? (
          <div className="flex flex-col md:flex-row min-h-screen">
            <AdminSidebar userEmail={adminCheck.user.email} />
            <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 lg:p-10 bg-grid-pattern">
              <div className="max-w-7xl mx-auto">{children}</div>
            </main>
          </div>
        ) : (
          <div className="min-h-screen bg-grid-pattern">{children}</div>
        )}
      </div>
    </AdminMuiThemeProvider>
  );
}
