"use client";

import React from "react";
import type { SupportedLanguage } from "@/lib/types";

export type Language = SupportedLanguage;

export interface LanguageToggleProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  className?: string;
}

const languages: { code: Language; label: string; shortLabel: string; ariaLabel: string }[] = [
  { code: "en", label: "English", shortLabel: "EN", ariaLabel: "English" },
  { code: "hi", label: "हिंदी", shortLabel: "हिंदी", ariaLabel: "हिंदी (Hindi)" },
  { code: "te", label: "తెలుగు", shortLabel: "తెలుగు", ariaLabel: "తెలుగు (Telugu)" },
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
      className={`inline-flex bg-[#EFE8D8] p-0.5 sm:p-1 border-2 border-[#1E1610] rounded-[3px] shadow-[inset_1px_1px_2px_rgba(30,22,16,0.1)] gap-0.5 sm:gap-1 overflow-hidden ${className}`.trim()}
    >
      {languages.map(({ code, label, shortLabel, ariaLabel }) => {
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
              min-h-[32px] sm:min-h-[36px] px-2 sm:px-2.5
              text-[11px] sm:text-xs font-heading select-none
              rounded-[2px] cursor-pointer transition-all
              flex items-center justify-center
              ${
                isActive
                  ? "bg-[#F2C230] text-[#1E1610] font-extrabold border-2 border-[#1E1610] shadow-[inset_1px_1px_0px_#FFF2CC,1px_1px_0px_#1E1610]"
                  : "bg-[#FAF6EC] hover:bg-[#E2D6C0] text-[#1E1610] font-bold border border-[#1E1610]/70 hover:border-[#1E1610]"
              }
            `.trim()}
          >
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
}

export default LanguageToggle;
