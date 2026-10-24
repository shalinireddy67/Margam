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
  { code: "hi", label: "हि", ariaLabel: "Hindi" },
  { code: "te", label: "తె", ariaLabel: "Telugu" },
];

export function LanguageToggle({
  currentLang,
  onLanguageChange,
  className = "",
}: LanguageToggleProps) {
  return (
    <div
      role="group"
      aria-label="Language"
      className={`inline-flex border-[3px] border-[#111111] rounded-[18px_14px_20px_15px/15px_20px_14px_18px] bg-[#FFFFFF] shadow-[4px_4px_0px_#111111] overflow-hidden ${className}`.trim()}
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
            className={`
              min-w-[48px] min-h-[48px] px-3.5 py-1
              font-heading font-extrabold text-base
              border-0 cursor-pointer select-none
              flex items-center justify-center
              transition-colors
              ${code !== "en" ? "border-l-[2px] border-[#111111]" : ""}
              ${isActive
                ? "bg-[#111111] text-[#FFFFFF]"
                : "bg-transparent text-[#111111] hover:bg-[#FFE14D]/40"
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
