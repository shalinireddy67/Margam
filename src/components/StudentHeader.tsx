"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Volume2, VolumeX, Flame } from "lucide-react";
import { SupportedLanguage, LearnerProfile } from "@/lib/types";
import { Logo } from "@/components/ui";
// Sound effects disabled per accessibility guidelines
import { getLevelProgress } from "@/lib/xp-config";

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
  
  const levelInfo = profile ? getLevelProgress(profile.xp || 0) : null;
  const gradeNames: Record<number, string> = {
    6: "Class 6 • Ganita Prakash",
    7: "Class 7 • Ganita Prakash",
    8: "Class 8 • Ganita Prakash",
    9: "Class 9 • Ganita Manjari",
    10: "Class 10 • Mathematics",
  };

  return (
    <header className="sticky top-3 z-50 max-w-[1200px] mx-auto px-3 sm:px-6 w-full transition-all">
      <div
        data-panel="student-header"
        className="bg-[#232634]/92 text-[#F3E3BC] px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4 border-[3px] border-[#1E1610] shadow-[3px_3px_0px_#1E1610] rounded-xs"
      >
        {/* Left: Brand + Back or Grade Scope */}
        <div className="flex items-center gap-2 sm:gap-3">
          {backHref ? (
            <Link
              href={backHref}
              className="inline-flex items-center justify-center min-h-[38px] gap-1.5 text-xs font-heading font-extrabold text-[#1E1610] py-1.5 px-3 bg-[#E8CF9C] hover:bg-[#F3E3BC] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] rounded-xs transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#1E1610] shrink-0" />
              <span className="hidden sm:inline">{backLabel}</span>
              <span className="sm:hidden">Back</span>
            </Link>
          ) : (
            <Link
              href="/"
              className="flex items-center min-h-[44px] gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F4FB5] rounded-xs"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xs bg-[#6DB33F] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] flex items-center justify-center text-[#1E1610] shrink-0">
                <Logo className="w-4 h-4 sm:w-5 sm:h-5 text-[#1E1610]" ariaLabel="Margam" />
              </div>
              <span className="font-heading font-extrabold text-base sm:text-lg text-[#F3E3BC] tracking-wider">
                MARGAM
              </span>
            </Link>
          )}

          {profile && (
            <div className="hidden md:flex items-center gap-2 pl-3 border-l-2 border-[#1E1610]/40">
              <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-heading font-extrabold bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610] shadow-[1px_1px_0px_#1E1610] rounded-xs">
                {gradeNames[profile.selectedClass] || `Class ${profile.selectedClass}`}
              </span>
            </div>
          )}
        </div>

        {/* Right: Streak, Level Tier HUD, & Language Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {profile && (
            <div className="hidden sm:flex items-center gap-1.5">
              {/* Streak: plain wording */}
              {profile.streak && profile.streak.current > 0 && (
                <div
                  className="flex items-center gap-1 px-2.5 py-1 bg-[#E8CF9C] border-2 border-[#1E1610] rounded-xs text-xs font-heading font-extrabold text-[#D1362B] shadow-[1px_1px_0px_#1E1610] select-none"
                  title={`${profile.streak.current} ${profile.streak.current === 1 ? "day in a row" : "days in a row"}`}
                >
                  <Flame className="w-3.5 h-3.5 text-[#D1362B] fill-[#D1362B]" aria-hidden="true" />
                  <span className="hidden md:inline">
                    {profile.streak.current} {profile.streak.current === 1 ? "day in a row" : "days in a row"}
                  </span>
                  <span className="md:hidden">{profile.streak.current}d</span>
                </div>
              )}

              {/* Tool Tier Level & XP bar */}
              {levelInfo && (
                <div
                  className="flex items-center gap-2 px-2.5 py-1 bg-[#18120C] border-2 border-[#1E1610] rounded-xs text-xs font-heading font-extrabold text-[#F3E3BC] shadow-[1px_1px_0px_#1E1610] select-none"
                  title={`${levelInfo.rank.name} level • ${levelInfo.progressPercent}% to next level`}
                >
                  <span className="text-sm select-none" aria-hidden="true">{levelInfo.rank.badge}</span>
                  <span className="text-[#F2C230]">{levelInfo.rank.name} level</span>
                  <div
                    className="w-14 h-2 bg-[#232634] border border-[#1E1610] overflow-hidden"
                    role="progressbar"
                    aria-valuenow={levelInfo.progressPercent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${levelInfo.rank.name} level progression: ${levelInfo.progressPercent}%`}
                  >
                    <div
                      className="h-full bg-[#6DB33F] transition-all duration-300"
                      style={{ width: `${levelInfo.progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Language Switcher */}
          <div
            className="flex items-center bg-[#D9B87A] p-0.5 border-2 border-[#1E1610] rounded-xs shadow-[2px_2px_0px_#1E1610]"
            role="group"
            aria-label="Select Interface Language"
          >
            <button
              type="button"
              data-l="en"
              onClick={() => onLanguageChange("en")}
              className={`min-h-[32px] min-w-[28px] sm:min-w-[34px] px-1.5 sm:px-2 text-[11px] sm:text-xs font-bold rounded-xs transition-all cursor-pointer ${
                currentLang === "en"
                  ? "bg-[#F2C230] text-[#1E1610] border border-[#1E1610] shadow-[1px_1px_0px_#1E1610] font-extrabold"
                  : "text-[#1E1610] hover:bg-[#E8CF9C]"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              data-l="hi"
              onClick={() => onLanguageChange("hi")}
              className={`min-h-[32px] min-w-[28px] sm:min-w-[38px] px-1.5 sm:px-2 text-[11px] sm:text-xs font-bold rounded-xs transition-all cursor-pointer ${
                currentLang === "hi"
                  ? "bg-[#F2C230] text-[#1E1610] border border-[#1E1610] shadow-[1px_1px_0px_#1E1610] font-extrabold"
                  : "text-[#1E1610] hover:bg-[#E8CF9C]"
              }`}
            >
              <span className="sm:hidden">हि</span>
              <span className="hidden sm:inline">हिन्दी</span>
            </button>
            <button
              type="button"
              data-l="te"
              onClick={() => onLanguageChange("te")}
              className={`min-h-[32px] min-w-[28px] sm:min-w-[38px] px-1.5 sm:px-2 text-[11px] sm:text-xs font-bold rounded-xs transition-all cursor-pointer ${
                currentLang === "te"
                  ? "bg-[#F2C230] text-[#1E1610] border border-[#1E1610] shadow-[1px_1px_0px_#1E1610] font-extrabold"
                  : "text-[#1E1610] hover:bg-[#E8CF9C]"
              }`}
            >
              <span className="sm:hidden">తె</span>
              <span className="hidden sm:inline">తెలుగు</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
