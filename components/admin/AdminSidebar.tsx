"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Drawer, IconButton } from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Code as CodeIcon,
  AutoAwesome as SkillIcon,
  MenuBook as BookIcon,
  School as SchoolIcon,
  Verified as CertIcon,
  PhotoLibrary as PhotoIcon,
  Shield as SecurityIcon,
  OpenInNew as OpenIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { signOutAction } from "@/app/lib/actions";

const navItems = [
  { href: "/admin/dashboard", label: "Studio Overview", icon: <DashboardIcon fontSize="small" /> },
  { href: "/admin/profile", label: "Identity & Bio", icon: <PersonIcon fontSize="small" /> },
  { href: "/admin/jobs", label: "Jobs & Experience", icon: <WorkIcon fontSize="small" /> },
  { href: "/admin/projects", label: "Projects & Demos", icon: <CodeIcon fontSize="small" /> },
  { href: "/admin/skills", label: "Skills & Cloud", icon: <SkillIcon fontSize="small" /> },
  { href: "/admin/books", label: "Published Books", icon: <BookIcon fontSize="small" /> },
  { href: "/admin/education", label: "Education", icon: <SchoolIcon fontSize="small" /> },
  { href: "/admin/certifications", label: "Certifications", icon: <CertIcon fontSize="small" /> },
  { href: "/admin/photos", label: "Photo Gallery", icon: <PhotoIcon fontSize="small" /> },
  { href: "/admin/security", label: "Security & Session", icon: <SecurityIcon fontSize="small" /> },
];

export default function AdminSidebar({ userEmail }: { userEmail?: string }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#060A14] text-slate-100 w-68 border-r border-slate-800/90">
      <div className="p-5 border-b border-slate-800/90">
        <div className="flex items-center gap-3">
          <img
            src="/assets/images/sami.jpg"
            alt="Sami Kazah"
            className="h-10 w-10 rounded-xl object-cover object-top border border-emerald-500/40 shrink-0"
          />
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-emerald-400">
              Portfolio Studio
            </div>
            <div className="text-base font-bold tracking-tight text-white truncate">
              Sami Kazah Admin
            </div>
          </div>
        </div>
        {userEmail && (
          <div className="mt-3 px-2.5 py-1.5 rounded-xl bg-[#0D1322] border border-slate-800 text-[11px] text-slate-300 truncate flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="truncate">{userEmail}</span>
          </div>
        )}
      </div>

      <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/35 shadow-sm"
                  : "text-slate-300 hover:bg-slate-800/70 hover:text-white border border-transparent"
              }`}
            >
              <span className={active ? "text-emerald-400" : "text-slate-400"}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800/90 space-y-2.5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#0D1322] border border-slate-800 hover:border-cyan-400/50 text-xs font-semibold text-cyan-300 transition-colors"
        >
          <span>View Live Portfolio</span>
          <OpenIcon sx={{ fontSize: 15 }} />
        </Link>
        <form action={signOutAction}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-950/50 hover:bg-rose-900/70 border border-rose-500/30 text-xs font-semibold text-rose-200 transition-colors cursor-pointer"
          >
            <LogoutIcon sx={{ fontSize: 15 }} />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-[#060A14]/95 backdrop-blur-md border-b border-slate-800 text-white">
        <div className="flex items-center gap-2.5">
          <img
            src="/assets/images/sami.jpg"
            alt="Sami Kazah"
            className="h-8 w-8 rounded-lg object-cover object-top border border-emerald-500/40"
          />
          <div>
            <span className="text-[10px] uppercase tracking-widest text-emerald-400 block leading-none">
              Portfolio Studio
            </span>
            <span className="font-bold text-sm text-white">Sami Kazah Admin</span>
          </div>
        </div>
        <IconButton
          onClick={() => setMobileOpen(true)}
          sx={{ color: "#E2E8F0" }}
          aria-label="Open menu"
        >
          <MenuIcon />
        </IconButton>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: "#060A14",
            borderRight: "1px solid #1E293B",
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block shrink-0 sticky top-0 h-screen">
        {sidebarContent}
      </aside>
    </>
  );
}
