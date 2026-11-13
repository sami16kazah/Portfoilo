import type { Metadata } from "next";
import AdminMuiThemeProvider from "@/components/admin/AdminMuiThemeProvider";

export const metadata: Metadata = {
  title: "Initial Admin Setup · Portfolio Studio",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminMuiThemeProvider>
      <div className="min-h-screen bg-[#070B14] text-slate-100 bg-grid-pattern">
        {children}
      </div>
    </AdminMuiThemeProvider>
  );
}
