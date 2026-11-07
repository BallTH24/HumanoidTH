import Link from "next/link";
import { CircleUserRound } from "lucide-react";
import ModeToggle from "./ModeToggle";

export default function MobileHeader() {
  return (
    <header className="mobile-header">
      <Link href="/" className="mobile-brand">
        <img src="/logo.png" alt="Thailand Humanoid Atlas Logo" className="mobile-logo-img" />
        <span className="mobile-title">THAILAND HUMANOID ATLAS</span>
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto" }}>
        <ModeToggle compact />
        <Link href="/profile" className="mobile-profile">
          <CircleUserRound size={22} className="profile-icon" />
        </Link>
      </div>
    </header>
  );
}
