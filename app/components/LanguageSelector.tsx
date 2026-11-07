"use client";

import { useTransition } from "react";
import { setLanguage } from "../actions";

interface LanguageSelectorProps {
  currentLang: "en" | "th";
  isCollapsed?: boolean;
}

export default function LanguageSelector({ currentLang, isCollapsed = false }: LanguageSelectorProps) {
  const [isPending, startTransition] = useTransition();

  const handleLangChange = (lang: "en" | "th") => {
    if (lang === currentLang) return;
    startTransition(async () => {
      await setLanguage(lang);
    });
  };

  return (
    <div
      suppressHydrationWarning
      className={`lang-selector ${isCollapsed ? "collapsed" : ""} ${isPending ? "loading" : ""}`}
    >
      <button
        type="button"
        suppressHydrationWarning
        onClick={() => handleLangChange("en")}
        className={currentLang === "en" ? "active" : ""}
        aria-label="English"
        title="English"
        disabled={isPending}
      >
        <span className="flag">🇬🇧</span>
        {!isCollapsed && <span className="lang-text">EN</span>}
      </button>
      <button
        type="button"
        suppressHydrationWarning
        onClick={() => handleLangChange("th")}
        className={currentLang === "th" ? "active" : ""}
        aria-label="ภาษาไทย"
        title="ภาษาไทย"
        disabled={isPending}
      >
        <span className="flag">🇹🇭</span>
        {!isCollapsed && <span className="lang-text">TH</span>}
      </button>
    </div>
  );
}
