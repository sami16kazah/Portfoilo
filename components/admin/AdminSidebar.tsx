"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaProjectDiagram,
  FaCode,
  FaUser,
  FaImages,
  FaSignOutAlt,
  FaGraduationCap,
  FaBook,
  FaCertificate,
  FaBriefcase,
  FaShieldAlt,
  FaExternalLinkAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { signOutAction } from "@/app/lib/actions";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: FaHome },
  { name: "Profile & Bio", href: "/admin/profile", icon: FaUser },
  { name: "Jobs & Experience", href: "/admin/jobs", icon: FaBriefcase },
  { name: "Projects & Demos", href: "/admin/projects", icon: FaProjectDiagram },
  { name: "Skills & Cloud", href: "/admin/skills", icon: FaCode },
  { name: "Published Books", href: "/admin/books", icon: FaBook },
  { name: "Education", href: "/admin/education", icon: FaGraduationCap },
  { name: "Certifications", href: "/admin/certifications", icon: FaCertificate },
  { name: "Photo Gallery", href: "/admin/photos", icon: FaImages },
  { name: "Security", href: "/admin/security", icon: FaShieldAlt },
];

export default function AdminSidebar({ userEmail }: { userEmail?: string }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-gray-800 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Portfolio Studio
          </h2>
          {userEmail && (
            <p className="text-xs text-slate-400 mt-1 truncate max-w-[185px]" title={userEmail}>
              {userEmail}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="md:hidden text-slate-300 hover:text-white p-1.5"
          aria-label="Close navigation menu"
        >
          <FaTimes />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                isActive
                  ? "bg-emerald-600 text-white shadow"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="text-base shrink-0" />
              <span className="font-medium truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-800 space-y-1.5">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm text-cyan-300 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <span>View Live Portfolio</span>
          <FaExternalLinkAlt className="text-xs" />
        </Link>

        <form action={signOutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <FaSignOutAlt />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="md:hidden fixed top-0 inset-x-0 h-14 bg-gray-900 text-white z-40 px-4 flex items-center justify-between border-b border-gray-800">
        <span className="font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Portfolio Studio
        </span>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-slate-200 hover:bg-gray-800"
          aria-label="Open navigation menu"
        >
          <FaBars />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setMobileOpen(false)}
        >
          <aside
            className="w-64 bg-gray-900 text-white h-full flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:flex w-64 bg-gray-900 text-white min-h-screen flex-col fixed left-0 top-0 z-30">
        {sidebarContent}
      </aside>
    </>
  );
}
