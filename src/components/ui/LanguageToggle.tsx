"use client";

import React from "react";
import type { SupportedLanguage } from "@/lib/types";

export type Language = SupportedLanguage;

export interface LanguageToggleProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  className?: string;
}

const languages: { code: Language; label: string; ariaLabel: string }[] = [
  { code: "en", label: "EN", ariaLabel: "English" },
  { code: "hi", label: "हिन्दी", ariaLabel: "हिन्दी (Hindi)" },
  { code: "te", label: "తెలుగు", ariaLabel: "తెలుగు (Telugu)" },
];

export function LanguageToggle({
  currentLang,
  onLanguageChange,
  className = "",
}: LanguageToggleProps) {
  return (
    <div
      role="group"
      aria-label="Language selection"
      className={`inline-flex border-3 border-[#422816] rounded-[2px] bg-[#5A3720] shadow-[2px_2px_0px_rgba(0,0,0,0.35)] overflow-hidden ${className}`.trim()}
    >
      {languages.map(({ code, label, ariaLabel }) => {
        const isActive = currentLang === code;
        return (
          <button
            key={code}
            type="button"
            data-l={code}
            aria-label={ariaLabel}
            aria-pressed={isActive}
            onClick={() => onLanguageChange(code)}
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
            className={`
              min-w-[48px] min-h-[48px] px-2 py-1
              font-bold text-xs select-none
              border-0 rounded-none cursor-pointer
              flex items-center justify-center
              ${code !== "en" ? "border-l-2 border-[#422816]" : ""}
              ${isActive
                ? "bg-[#FFE9A8] text-[#2B1B0F] shadow-[inset_1px_1px_0px_#FFFFFF]"
                : "bg-transparent text-[#FFF7E6] hover:bg-[#7A4B2A]"
              }
            `.trim()}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default LanguageToggle;
