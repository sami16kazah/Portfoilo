"use client";

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
  FaCertificate
} from "react-icons/fa";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: FaHome },
  { name: "Projects", href: "/admin/projects", icon: FaProjectDiagram },
  { name: "Skills", href: "/admin/skills", icon: FaCode },
  { name: "Education", href: "/admin/education", icon: FaGraduationCap },
  { name: "Certifications", href: "/admin/certifications", icon: FaCertificate },
  { name: "Books", href: "/admin/books", icon: FaBook },
  { name: "Profile", href: "/admin/profile", icon: FaUser },
  { name: "Photos", href: "/admin/photos", icon: FaImages },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Admin Panel
        </h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? "bg-blue-600 text-white shadow-lg" 
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="text-xl" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <form action="/api/auth/signout" method="POST">
             <button  className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                <FaSignOutAlt />
                <span>Sign Out</span>
             </button>
        </form>
      </div>
    </aside>
  );
}
