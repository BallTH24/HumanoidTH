"use client";

import React from "react";
import { User, Activity } from "lucide-react";
import { useUserMode } from "@/components/providers/UserModeProvider";

interface ModeToggleProps {
  compact?: boolean;
  isCollapsed?: boolean;
  className?: string;
}

export default function ModeToggle({
  compact = false,
  isCollapsed = false,
  className = ""
}: ModeToggleProps) {
  const { mode, isExpert, setMode, toggleMode } = useUserMode();

  if (isCollapsed) {
    return (
      <button
        type="button"
        suppressHydrationWarning
        onClick={toggleMode}
        className={`mode-toggle-collapsed ${isExpert ? "mode-expert" : "mode-general"} ${className}`.trim()}
        aria-label={isExpert ? "Switch to General mode (Caregiver)" : "Switch to Expert mode (Researcher)"}
        title={isExpert ? "Active: Expert Mode (Click for General)" : "Active: General Mode (Click for Expert)"}
        data-mode={mode}
      >
        {isExpert ? (
          <Activity size={17} className="mode-icon-pulse text-amber-400" aria-hidden="true" />
        ) : (
          <User size={17} className="text-emerald-400" aria-hidden="true" />
        )}
      </button>
    );
  }

  if (compact) {
    return (
      <div
        suppressHydrationWarning
        className={`mode-toggle-compact ${className}`.trim()}
        role="group"
        aria-label="User View Mode Toggle"
      >
        <button
          type="button"
          suppressHydrationWarning
          onClick={() => setMode("general")}
          className={`mode-btn ${!isExpert ? "active" : ""}`}
          aria-pressed={!isExpert}
          title="General Mode: Simplified Caregiver View"
        >
          <User size={14} aria-hidden="true" />
          <span className="mode-label">General</span>
        </button>
        <button
          type="button"
          suppressHydrationWarning
          onClick={() => setMode("expert")}
          className={`mode-btn ${isExpert ? "active" : ""}`}
          aria-pressed={isExpert}
          title="Expert Mode: Researcher & Telemetry View"
        >
          <Activity size={14} aria-hidden="true" />
          <span className="mode-label">Expert</span>
        </button>
      </div>
    );
  }

  return (
    <div
      suppressHydrationWarning
      className={`mode-toggle-full ${className}`.trim()}
      role="group"
      aria-label="User View Mode Toggle"
    >
      <button
        type="button"
        suppressHydrationWarning
        onClick={() => setMode("general")}
        className={`mode-tab ${!isExpert ? "active-general" : ""}`}
        aria-pressed={!isExpert}
        title="General / Caregiver Mode: Simplified language, clean cards, reduced cognitive load"
      >
        <User size={15} aria-hidden="true" />
        <span className="mode-text">General</span>
      </button>
      <button
        type="button"
        suppressHydrationWarning
        onClick={() => setMode("expert")}
        className={`mode-tab ${isExpert ? "active-expert" : ""}`}
        aria-pressed={isExpert}
        title="Expert / Researcher Mode: Full telemetry stats, Godspeed & RoSAS metrics, citations, raw data"
      >
        <Activity size={15} aria-hidden="true" />
        <span className="mode-text">Expert</span>
      </button>
    </div>
  );
}
