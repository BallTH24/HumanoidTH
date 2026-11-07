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
  Newspaper,
  Send,
  Settings2,
  UsersRound,
  Home,
  MapPinned,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  HeartPulse
} from "lucide-react";
import { getTranslation } from "@/lib/translations";
import LanguageSelector from "@/app/components/LanguageSelector";
import ModeToggle from "@/components/navigation/ModeToggle";

interface SidebarProps {
  currentLang?: "en" | "th";
  className?: string;
  defaultCollapsed?: boolean;
}

export default function Sidebar({
  currentLang = "en",
  className = "",
  defaultCollapsed = false
}: SidebarProps) {
  const pathname = usePathname() || "/";
  const t = getTranslation(currentLang);

  // Initialize with defaultCollapsed for SSR hydration safety
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  // Restore user preference from localStorage on mount and listen to keyboard shortcut
  useEffect(() => {
    try {
      const saved = localStorage.getItem("humanoidth_sidebar_collapsed");
      if (saved !== null) {
        setIsCollapsed(saved === "true");
      }
    } catch {
      // Ignore errors in sandboxed/restricted iframe environments
    }

    // Keyboard shortcut: Ctrl+B or Cmd+B to toggle sidebar
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        const target = e.target as HTMLElement;
        if (
          target &&
          (target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            target.isContentEditable)
        ) {
          return;
        }
        e.preventDefault();
        setIsCollapsed((prev) => {
          const next = !prev;
          try {
            localStorage.setItem("humanoidth_sidebar_collapsed", String(next));
          } catch {}
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("humanoidth_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  };

  const navItems = [
    { href: "/", label: t.overview, icon: Home },
    { href: "/dashboard", label: t.dashboard, icon: LayoutDashboard },
    { href: "/data-pulls", label: t.dataPulls, icon: Inbox },
    { href: "/map", label: t.map, icon: MapPinned },
    { href: "/network", label: t.network, icon: Network },
    { href: "/perspectives", label: t.perspectives, icon: Newspaper },
    { href: "/wellness", label: t.wellness, icon: HeartPulse },
    { href: "/robots", label: t.robots, icon: Bot },
    { href: "/inventory", label: t.inventory, icon: Package },
    { href: "/contributions", label: t.contributors, icon: UsersRound },
    { href: "/analytics", label: t.analytics, icon: BarChart3 },
    { href: "/database", label: t.database, icon: Database },
    { href: "/submit-data", label: t.submit, icon: Send },
    { href: "/admin", label: t.admin, icon: Settings2 },
    { href: "/profile", label: t.profile, icon: CircleUserRound }
  ];

  return (
    <aside
      suppressHydrationWarning
      className={`sidebar relative transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20 collapsed is-collapsed" : "w-64"
      } ${className}`.trim()}
      aria-label="Primary Navigation"
      data-collapsed={isCollapsed}
    >
      {/* Floating Collapse Toggle on Sidebar's Right Border */}
      <button
        type="button"
        suppressHydrationWarning
        onClick={toggleCollapse}
        className={`sidebar-toggle-btn ${isCollapsed ? "collapsed" : ""}`}
        aria-label={isCollapsed ? "Expand sidebar (Ctrl+B)" : "Collapse sidebar (Ctrl+B)"}
        title={isCollapsed ? "Expand sidebar (Ctrl+B)" : "Collapse sidebar (Ctrl+B)"}
      >
        {isCollapsed ? (
          <PanelLeftOpen
            size={14}
            className="sidebar-toggle-icon"
            aria-hidden="true"
          />
        ) : (
          <PanelLeftClose
            size={14}
            className="sidebar-toggle-icon"
            aria-hidden="true"
          />
        )}
      </button>

      {/* Header: Brand Logo */}
      <div className={`sidebar-header ${isCollapsed ? "collapsed" : ""}`}>
        <div className={`brand-logo-container ${isCollapsed ? "collapsed" : ""}`}>
          {isCollapsed ? (
            <Link
              href="/"
              className="brand-emblem-link"
              title="Thailand Humanoid Atlas"
              aria-label="Thailand Humanoid Atlas"
            >
              <div className="brand-emblem-wrap">
                <img
                  src="/logo-emblem.png"
                  alt="Thailand Humanoid Atlas Emblem"
                  className="brand-emblem"
                  width={44}
                  height={44}
                />
              </div>
            </Link>
          ) : (
            <Link
              href="/"
              className="brand-logo-link"
              title="Thailand Humanoid Atlas"
              aria-label="Thailand Humanoid Atlas"
            >
              <img
                src="/logo.png"
                alt="Thailand Humanoid Atlas"
                className="brand-logo"
              />
            </Link>
          )}
        </div>
      </div>

      {/* Nav Menu */}
      <div
        className="sidebar-nav-container"
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          paddingRight: isCollapsed ? "0" : "4px"
        }}
      >
        <nav className={`nav ${isCollapsed ? "collapsed" : ""}`} aria-label="Primary">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname.startsWith("/admin")
                : pathname === item.href;

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
      </div>

      {/* Footer: User Mode Toggle & Language Selector */}
      <div
        className={`sidebar-footer ${isCollapsed ? "collapsed" : ""}`}
        style={{
          paddingTop: "14px",
          borderTop: "1px solid #14352a",
          marginTop: "auto",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          alignItems: isCollapsed ? "center" : "stretch"
        }}
      >
        <div style={{ display: "flex", justifyContent: isCollapsed ? "center" : "center", width: "100%" }}>
          <ModeToggle isCollapsed={isCollapsed} />
        </div>
        <LanguageSelector currentLang={currentLang} isCollapsed={isCollapsed} />
      </div>
    </aside>
  );
}
