"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bot,
  CircleUserRound,
  Database,
  Inbox,
  LayoutDashboard,
  Network,
  Settings2,
  UsersRound,
  Home,
  MapPinned,
  HeartPulse
} from "lucide-react";
import { getTranslation } from "@/lib/translations";

interface SidebarNavProps {
  currentLang?: "en" | "th";
  isCollapsed?: boolean;
  isAdmin?: boolean;
}

export default function SidebarNav({
  currentLang = "en",
  isCollapsed = false,
  isAdmin: initialIsAdmin = false
}: SidebarNavProps) {
  const pathname = usePathname() || "/";
  const t = getTranslation(currentLang);
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin);

  useEffect(() => {
    setIsAdmin(initialIsAdmin);
  }, [initialIsAdmin]);

  useEffect(() => {
    try {
      const cookies = document.cookie;
      const hasAdmin =
        cookies.includes("admin_session=true") ||
        cookies.includes("user_role=ADMIN");
      if (hasAdmin !== isAdmin) {
        setIsAdmin(hasAdmin);
      }
    } catch {}
  }, [pathname, isAdmin]);

  const publicNavItems = [
    { href: "/", label: t.overview, icon: Home },
    { href: "/dashboard", label: t.dashboard, icon: LayoutDashboard },
    { href: "/wellness", label: t.wellness, icon: HeartPulse },
    { href: "/robots", label: t.robots, icon: Bot },
    { href: "/map", label: t.map, icon: MapPinned },
    { href: "/network", label: t.network, icon: Network },
    { href: "/analytics", label: t.analytics, icon: BarChart3 },
    { href: "/contributions", label: t.contributors, icon: UsersRound }
  ];

  const adminNavItems = [
    {
      href: "/admin",
      label: currentLang === "th" ? "คอนโซลผู้ดูแล (Admin)" : "Admin Console",
      icon: Settings2
    },
    { href: "/data-pulls", label: t.dataPulls, icon: Inbox },
    { href: "/database", label: t.database, icon: Database }
  ];

  const profileNavItem = {
    href: "/profile",
    label: t.profile,
    icon: CircleUserRound
  };

  const navItems = [
    ...publicNavItems,
    ...(isAdmin ? adminNavItems : []),
    profileNavItem
  ];

  return (
    <nav className={`nav ${isCollapsed ? "collapsed" : ""}`} aria-label="Primary">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/admin"
            ? pathname.startsWith("/admin")
            : item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link 
            key={item.href} 
            href={item.href} 
            className={`${isActive ? "active" : ""} ${isCollapsed ? "collapsed" : ""}`}
            title={item.label}
            aria-label={item.label}
            data-tooltip={item.label}
          >
            <Icon size={17} aria-hidden="true" className="nav-icon" />
            {!isCollapsed && <span className="nav-label">{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
