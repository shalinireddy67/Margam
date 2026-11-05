"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Flame } from "lucide-react";
import { SupportedLanguage, LearnerProfile } from "@/lib/types";
import { Logo } from "@/components/ui";
import { getLevelProgress } from "@/lib/xp-config";
import { useLanguage } from "@/contexts/LanguageContext";

interface StudentHeaderProps {
  profile: LearnerProfile | null;
  currentLang?: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  backHref?: string;
  backLabel?: string;
}

export default function StudentHeader({
  profile,
  currentLang,
  onLanguageChange,
  backHref,
  backLabel,
}: StudentHeaderProps) {
  const { lang: contextLang, setLang: contextSetLang, t } = useLanguage();
  const activeLang = currentLang || contextLang || "en";
  const handleLanguageChange = onLanguageChange || contextSetLang;

  const defaultBackLabel = t("lesson.backToLessons");
  const effectiveBackLabel = backLabel || defaultBackLabel;

  const levelInfo = profile ? getLevelProgress(profile.xp || 0) : null;
  const gradeBookNames: Record<number, string> = {
    6: "Ganita Prakash",
    7: "Ganita Prakash",
    8: "Ganita Prakash",
    9: "Ganita Manjari",
    10: "Mathematics",
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
              <span className="hidden sm:inline">{effectiveBackLabel}</span>
              <span className="sm:hidden">{t("common.back")}</span>
            </Link>
          ) : (
            <Link
              href={profile ? "/student" : "/"}
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
                {t("home.classBadge", { grade: profile.selectedClass || 10 })} •{" "}
                {gradeBookNames[profile.selectedClass || 10] || "NCERT"}
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
                  title={t(
                    profile.streak.current === 1
                      ? "nav.streakDays"
                      : "nav.streakDaysPlural",
                    { count: profile.streak.current }
                  )}
                >
                  <Flame className="w-3.5 h-3.5 text-[#D1362B] fill-[#D1362B]" aria-hidden="true" />
                  <span className="hidden md:inline">
                    {t(
                      profile.streak.current === 1
                        ? "nav.streakDays"
                        : "nav.streakDaysPlural",
                      { count: profile.streak.current }
                    )}
                  </span>
                  <span className="md:hidden">{profile.streak.current}d</span>
                </div>
              )}

              {/* Tool Tier Level & XP bar */}
              {levelInfo && (
                <div
                  className="flex items-center gap-2 px-2.5 py-1 bg-[#18120C] border-2 border-[#1E1610] rounded-xs text-xs font-heading font-extrabold text-[#F3E3BC] shadow-[1px_1px_0px_#1E1610] select-none"
                  title={`${levelInfo.rank.name} • ${levelInfo.progressPercent}%`}
                >
                  <span className="text-sm select-none" aria-hidden="true">{levelInfo.rank.badge}</span>
                  <span className="text-[#F2C230]">{levelInfo.rank.name}</span>
                  <div
                    className="w-14 h-2 bg-[#232634] border border-[#1E1610] overflow-hidden"
                    role="progressbar"
                    aria-valuenow={levelInfo.progressPercent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${levelInfo.rank.name} progression: ${levelInfo.progressPercent}%`}
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
            className="flex items-center bg-[#161822]/85 p-1 border-2 border-[#1E1610] rounded-[2px] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.6)] gap-1"
            role="group"
            aria-label={t("common.selectLanguage")}
          >
            <button
              type="button"
              data-l="en"
              onClick={() => handleLanguageChange("en")}
              className={`min-h-[30px] sm:min-h-[32px] px-2 text-[11px] sm:text-xs font-heading font-extrabold rounded-[2px] transition-all cursor-pointer ${
                activeLang === "en"
                  ? "bg-[#F2C230] text-[#1E1610] border-2 border-[#1E1610] shadow-[inset_1px_1px_0px_#FFF2CC,1px_1px_0px_#10121A]"
                  : "bg-[#2B3042]/85 hover:bg-[#3B425A] text-[#D9B87A] hover:text-[#F3E3BC] border border-[#1E1610]"
              }`}
            >
              <span className="hidden sm:inline">English</span>
              <span className="sm:hidden">EN</span>
            </button>
            <button
              type="button"
              data-l="hi"
              onClick={() => handleLanguageChange("hi")}
              className={`min-h-[30px] sm:min-h-[32px] px-2 text-xs font-heading font-bold rounded-[2px] transition-all cursor-pointer ${
                activeLang === "hi"
                  ? "bg-[#F2C230] text-[#1E1610] border-2 border-[#1E1610] shadow-[inset_1px_1px_0px_#FFF2CC,1px_1px_0px_#10121A]"
                  : "bg-[#2B3042]/85 hover:bg-[#3B425A] text-[#D9B87A] hover:text-[#F3E3BC] border border-[#1E1610]"
              }`}
            >
              हिंदी
            </button>
            <button
              type="button"
              data-l="te"
              onClick={() => handleLanguageChange("te")}
              className={`min-h-[30px] sm:min-h-[32px] px-2 text-xs font-heading font-bold rounded-[2px] transition-all cursor-pointer ${
                activeLang === "te"
                  ? "bg-[#F2C230] text-[#1E1610] border-2 border-[#1E1610] shadow-[inset_1px_1px_0px_#FFF2CC,1px_1px_0px_#10121A]"
                : "bg-[#2B3042]/85 hover:bg-[#3B425A] text-[#D9B87A] hover:text-[#F3E3BC] border border-[#1E1610]"
              }`}
            >
              తెలుగు
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
