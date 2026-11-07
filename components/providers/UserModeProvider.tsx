"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserMode = "general" | "expert";

interface UserModeContextType {
  mode: UserMode;
  isExpert: boolean;
  isGeneral: boolean;
  setMode: (mode: UserMode) => void;
  toggleMode: () => void;
}

const UserModeContext = createContext<UserModeContextType>({
  mode: "general",
  isExpert: false,
  isGeneral: true,
  setMode: () => {},
  toggleMode: () => {}
});

const STORAGE_KEY = "humanoidth_user_mode";

export function UserModeProvider({ children }: { children: ReactNode }) {
  // Initialize with "general" for hydration consistency across SSR and client
  const [mode, setModeState] = useState<UserMode>("general");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "general" || saved === "expert") {
        setModeState(saved);
      }
    } catch {
      // Storage access might be restricted in sandboxed environments
    }
  }, []);

  const setMode = (newMode: UserMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem(STORAGE_KEY, newMode);
    } catch {}
  };

  const toggleMode = () => {
    const next = mode === "general" ? "expert" : "general";
    setMode(next);
  };

  const isExpert = mode === "expert";
  const isGeneral = mode === "general";

  return (
    <UserModeContext.Provider value={{ mode, isExpert, isGeneral, setMode, toggleMode }}>
      {children}
    </UserModeContext.Provider>
  );
}

export function useUserMode() {
  const context = useContext(UserModeContext);
  if (!context) {
    throw new Error("useUserMode must be used within a UserModeProvider");
  }
  return context;
}
