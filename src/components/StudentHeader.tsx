"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, ArrowLeft, AlertTriangle } from "lucide-react";
import { SupportedLanguage, LearnerProfile } from "@/lib/types";
import { Logo } from "@/components/ui";

interface StudentHeaderProps {
  profile: LearnerProfile | null;
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  backHref?: string;
  backLabel?: string;
}

export default function StudentHeader({
  profile,
  currentLang,
  onLanguageChange,
  backHref,
  backLabel = "Back to Learning Path",
}: StudentHeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const gradeNames: Record<number, string> = {
    6: "Class 6 • Ganita Prakash",
    7: "Class 7 • Ganita Prakash",
    8: "Class 8 • Ganita Prakash",
    9: "Class 9 • Ganita Manjari",
    10: "Class 10 • Mathematics",
  };

  return (
    <header className="sticky top-0 z-40 bg-[#173B19]/95 backdrop-blur-md border-b-3 border-[#315B2A] shadow-[0px_4px_0px_#102610] transition-all">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand + Back or Grade Scope */}
        <div className="flex items-center gap-3">
          {backHref ? (
            <Link
              href={backHref}
              className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] gap-2 text-xs font-heading text-[#F2F0DF] hover:text-[#79B82A] py-1.5 px-3 bg-[#102610] border-2 border-[#315B2A] shadow-[2px_2px_0px_#102610] active:translate-x-0.5 active:translate-y-0.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{backLabel}</span>
            </Link>
          ) : (
            <Link
              href="/"
              className="flex items-center min-h-[48px] gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B834]"
            >
              <Logo className="w-8 h-8 rounded-none border-2 border-[#102610] shadow-[2px_2px_0px_#102610]" ariaLabel="Margam" />
              <span className="font-heading font-extrabold text-lg sm:text-xl text-[#79B82A] tracking-wider drop-shadow-[2px_2px_0px_#102610]">
                MARGAM
              </span>
            </Link>
          )}

          {profile && (
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l-2 border-[#315B2A]">
              <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-heading font-bold bg-[#4F8A24] text-[#F2F0DF] border-2 border-[#102610] shadow-[2px_2px_0px_#102610]">
                {gradeNames[profile.selectedClass] || `Class ${profile.selectedClass}`}
              </span>
            </div>
          )}
        </div>

        {/* Right: Language Switcher & Profile Details */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Language Switcher */}
          <div className="shrink-0 flex items-center gap-1 bg-[#102610] p-1 border-2 border-[#315B2A] shadow-[2px_2px_0px_#102610]">
            <button
              type="button"
              data-l="en"
              onClick={() => onLanguageChange("en")}
              className={`shrink-0 min-h-[38px] min-w-[38px] flex items-center justify-center px-2 py-1 text-xs font-bold transition-all ${
                currentLang === "en"
                  ? "bg-[#79B82A] text-[#102610] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4)]"
                  : "text-[#D8D8D0] hover:text-[#F2F0DF]"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              data-l="hi"
              onClick={() => onLanguageChange("hi")}
              className={`shrink-0 min-h-[38px] min-w-[44px] flex items-center justify-center px-2 py-1 text-xs font-bold transition-all ${
                currentLang === "hi"
                  ? "bg-[#79B82A] text-[#102610] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4)]"
                  : "text-[#D8D8D0] hover:text-[#F2F0DF]"
              }`}
            >
              हिन्दी
            </button>
            <button
              type="button"
              data-l="te"
              onClick={() => onLanguageChange("te")}
              className={`shrink-0 min-h-[38px] min-w-[44px] flex items-center justify-center px-2 py-1 text-xs font-bold transition-all ${
                currentLang === "te"
                  ? "bg-[#79B82A] text-[#102610] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4)]"
                  : "text-[#D8D8D0] hover:text-[#F2F0DF]"
              }`}
            >
              తెలుగు
            </button>
          </div>

          {/* Profile Badge & Menu */}
          {profile && (
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="shrink-0 flex items-center justify-center gap-2 min-h-[42px] p-2 sm:px-3 bg-[#4F8A24] hover:bg-[#5E9E2C] border-2 border-[#102610] shadow-[2px_2px_0px_#102610] text-xs font-heading font-bold text-[#F2F0DF] active:translate-x-0.5 active:translate-y-0.5 transition-colors cursor-pointer"
                aria-expanded={showProfileMenu}
                aria-label="Learner Profile Menu"
              >
                <div className="w-5 h-5 bg-[#173B19] border border-[#102610] flex items-center justify-center text-[#79B82A] shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate text-[11px]">{profile.name}</span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-[#173B19] border-3 border-[#4F8A24] shadow-[6px_6px_0px_#102610] p-3.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="pb-2.5 mb-2.5 border-b-2 border-[#315B2A]">
                    <p className="text-xs font-heading font-bold text-[#79B82A]">{profile.name}</p>
                    <p className="text-xs text-[#D8D8D0] mt-1 font-bold">
                      Realm: Class {profile.selectedClass}
                    </p>
                    <p className="text-[10px] text-[#E5B834] font-heading mt-1">
                      Difficulty Level {profile.currentDifficulty} / 3
                    </p>
                  </div>

                  <Link
                    href="/login"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 w-full p-2 text-xs font-bold text-[#F2F0DF] hover:bg-[#315B2A] border border-[#315B2A] transition-colors mb-1.5"
                  >
                    <User className="w-3.5 h-3.5 text-[#79B82A] shrink-0" />
                    <span>Cloud Sync / Sign In</span>
                  </Link>

                  <Link
                    href="/student/reset-class"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 w-full p-2 text-xs font-bold text-[#D9453D] hover:bg-[#D9453D]/20 border border-[#D9453D]/40 transition-colors"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-[#D9453D] shrink-0" />
                    <span>Switch Class / Reset Realm</span>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
