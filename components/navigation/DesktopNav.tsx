"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Camera, ClipboardList, User, Home } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { useAuth } from "@/contexts/AuthContext";

export function DesktopNav() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/learn", label: "Learn", icon: BookOpen },
    { href: "/search", label: "Search", icon: BookOpen },
    { href: "/scanner", label: "Scanner", icon: Camera },
    { href: "/journal", label: "Journal", icon: ClipboardList },
    { href: "/profile", label: "Profile", icon: User },
  ];

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/auth/login";
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white p-6 fixed h-full">
      <div className="mb-8">
        <BrandLogo />
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-emerald-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-700 pt-6">
        {user ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-sm font-bold">
                {user.email?.[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link
            href="/auth/login"
            className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>
    </aside>
  );
}