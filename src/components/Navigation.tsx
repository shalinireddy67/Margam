"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  Compass,
  BookOpen,
  Trophy,
  User,
  Users,
  Flame,
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import { SupportedLanguage } from "@/lib/types";
import { getLevelProgress } from "@/lib/xp-config";
import { useLanguage } from "@/contexts/LanguageContext";

export interface NavigationProps {
  currentTab?: string;
  currentLang?: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  profile?: any;
  active?: string;
  className?: string;
  showTopBar?: boolean;
}

const NAV_ITEMS = [
  {
    id: "learn",
    href: "/student",
    labelKey: "nav.home",
    icon: Compass,
  },
  {
    id: "diagnostic",
    href: "/student/diagnostic",
    labelKey: "nav.diagnostic",
    icon: BookOpen,
  },
  {
    id: "stickers",
    href: "/student/stickers",
    labelKey: "nav.stickers",
    icon: Trophy,
  },
  {
    id: "profile",
    href: "/student/profile",
    labelKey: "nav.profile",
    icon: User,
  },
];

export function Navigation({
  currentTab,
  currentLang,
  onLanguageChange,
  profile,
  active,
  className = "",
  showTopBar = true,
}: NavigationProps) {
  const { lang: contextLang, setLang: contextSetLang, t } = useLanguage();
  const activeLang: SupportedLanguage = currentLang || contextLang || "en";
  const handleLanguageChange = onLanguageChange || contextSetLang;

  const activeTab = currentTab || active;
  const pathname = usePathname() || "";

  const isAssessment =
    pathname.includes("/student/diagnostic") ||
    pathname.includes("/student/test");

  const levelInfo = profile ? getLevelProgress(profile.xp || 0) : null;

  return (
    <>
      {/* ================================================================= */}
      {/* 1. TOP HEADER (HUD / Night Panel, Parchment Text, Translucent)     */}
      {/* ================================================================= */}
      {showTopBar && (
        <header
          aria-label={t("nav.skipToContent")}
          data-panel="top-hud"
          className={`sticky top-0 z-40 bg-[#181B26]/96 text-[#F3E3BC] border-b-[3px] border-[#120F0C] shadow-[0px_3px_0px_#10121A] backdrop-blur-[3px] ${className}`}
        >
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[68px] flex items-center justify-between gap-4">
            {/* Left: Brand Identity */}
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href="/"
                className="flex items-center gap-2 sm:gap-2.5 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F4FB5]"
                aria-label="Margam Home"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-[2px] bg-[#6DB33F] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] flex items-center justify-center shrink-0">
                  <Logo className="w-5 h-5 sm:w-6 sm:h-6 text-[#1E1610]" ariaLabel="Margam Logo" />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-extrabold text-sm sm:lg text-[#F3E3BC] tracking-wider leading-none">
                    MARGAM
                  </span>
                  <span className="text-[10px] font-sans font-bold text-[#D9B87A] leading-tight hidden sm:block mt-0.5">
                    Classes 6–10
                  </span>
                </div>
              </a>

              {/* Class Scope Badge */}
              {profile && (
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 border-2 border-[#1E1610] bg-[#6DB33F] text-[10px] font-heading font-extrabold text-[#1E1610] shadow-[2px_2px_0px_#1E1610] rounded-[2px]">
                  {t("home.classBadge", { grade: profile.selectedClass || 10 })}
                </span>
              )}
            </div>

            {/* Center: Desktop Navigation Links (>=1024px only) */}
            <nav
              className="hidden lg:flex items-center gap-3.5 xl:gap-5"
              aria-label="Desktop primary navigation"
            >
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const localizedLabel = t(item.labelKey);

                return (
                  <a
                    key={item.id}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`min-h-[42px] px-4 py-2 text-xs font-heading font-extrabold tracking-wide flex items-center gap-2 rounded-[2px] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F4FB5] ${
                      isActive
                        ? "bg-[#5FA334] text-[#120F0C] border-2 border-[#120F0C] shadow-[inset_0px_2px_0px_#8EDB49,2px_2px_0px_#10121A] cursor-default"
                        : "bg-[#262A3B] hover:bg-[#343A52] text-[#F3E3BC] hover:text-[#FFE9A8] border-2 border-[#120F0C] shadow-[2px_2px_0px_#10121A] hover:shadow-[3px_3px_0px_#10121A] hover:-translate-y-0.5 active:translate-y-[1px] active:shadow-[1px_1px_0px_#10121A]"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#120F0C]" : "text-[#F2C230]"}`} aria-hidden="true" />
                    <span>{localizedLabel}</span>
                  </a>
                );
              })}

              {/* Teacher Portal link */}
              <a
                href="/teacher"
                className="min-h-[42px] px-3.5 py-2 text-xs font-heading font-extrabold tracking-wide bg-[#23314E] hover:bg-[#304368] text-[#78BDE8] hover:text-[#A6D5F7] border-2 border-[#120F0C] shadow-[2px_2px_0px_#10121A] hover:shadow-[3px_3px_0px_#10121A] hover:-translate-y-0.5 active:translate-y-[1px] active:shadow-[1px_1px_0px_#10121A] rounded-[2px] transition-all flex items-center gap-2 ml-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F4FB5]"
                title={t("nav.teacherHub")}
              >
                <Users className="w-3.5 h-3.5 text-[#78BDE8]" aria-hidden="true" />
                <span className="text-xs">{t("nav.teacherHub")}</span>
              </a>
            </nav>

            {/* Right: Streak, Level Tier HUD, and Multilingual Switcher */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {profile && (
                <div className="flex items-center gap-2">
                  {/* Streak: plain wording */}
                  {profile.streak && profile.streak.current > 0 && (
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1 bg-[#E8CF9C] border-2 border-[#1E1610] text-xs font-sans font-extrabold text-[#D1362B] shadow-[2px_2px_0px_#1E1610] rounded-[2px] select-none"
                      title={t(
                        profile.streak.current === 1
                          ? "nav.streakDays"
                          : "nav.streakDaysPlural",
                        { count: profile.streak.current }
                      )}
                    >
                      <Flame className="w-3.5 h-3.5 text-[#D1362B] fill-[#D1362B]" aria-hidden="true" />
                      <span className="hidden sm:inline">
                        {t(
                          profile.streak.current === 1
                            ? "nav.streakDays"
                            : "nav.streakDaysPlural",
                          { count: profile.streak.current }
                        )}
                      </span>
                      <span className="sm:hidden">{profile.streak.current}d</span>
                    </div>
                  )}

                  {/* Level as tool tier + XP bar */}
                  {levelInfo && (
                    <div
                      className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-[#18120C] border-2 border-[#1E1610] rounded-[2px] text-xs font-heading font-extrabold text-[#F3E3BC] shadow-[2px_2px_0px_#1E1610] select-none"
                      title={`${levelInfo.rank.name} • ${levelInfo.progressPercent}%`}
                    >
                      <span className="text-sm select-none" aria-hidden="true">{levelInfo.rank.badge}</span>
                      <span className="text-[#F2C230]">{levelInfo.rank.name}</span>
                      <div
                        className="w-16 h-2 bg-[#232634] border border-[#1E1610] overflow-hidden rounded-[1px]"
                        role="progressbar"
                        aria-valuenow={levelInfo.progressPercent}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${levelInfo.rank.name} XP progression: ${levelInfo.progressPercent}%`}
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

              {/* Multilingual Switcher (English | हिंदी | తెలుగు) */}
              <div
                className="flex items-center bg-[#181B26] p-1 border-2 border-[#120F0C] rounded-[2px] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.6)] gap-1"
                role="group"
                aria-label={t("common.selectLanguage")}
              >
                <button
                  type="button"
                  data-l="en"
                  onClick={() => handleLanguageChange("en")}
                  className={`min-h-[32px] sm:min-h-[34px] px-2 sm:px-2.5 text-[11px] sm:text-xs font-heading font-extrabold rounded-[2px] transition-all cursor-pointer ${
                    activeLang === "en"
                      ? "bg-[#F2C230] text-[#120F0C] border-2 border-[#120F0C] shadow-[inset_0px_1px_0px_#FFF2CC,1px_1px_0px_#10121A]"
                      : "bg-[#262A3B] hover:bg-[#343A52] text-[#D9B87A] hover:text-[#F3E3BC] border border-[#120F0C]"
                  }`}
                >
                  <span className="hidden sm:inline">English</span>
                  <span className="sm:hidden">EN</span>
                </button>
                <button
                  type="button"
                  data-l="hi"
                  onClick={() => handleLanguageChange("hi")}
                  className={`min-h-[32px] sm:min-h-[34px] px-2 sm:px-2.5 text-xs font-heading font-bold rounded-[2px] transition-all cursor-pointer ${
                    activeLang === "hi"
                      ? "bg-[#F2C230] text-[#120F0C] border-2 border-[#120F0C] shadow-[inset_0px_1px_0px_#FFF2CC,1px_1px_0px_#10121A]"
                      : "bg-[#262A3B] hover:bg-[#343A52] text-[#D9B87A] hover:text-[#F3E3BC] border border-[#120F0C]"
                  }`}
                >
                  हिंदी
                </button>
                <button
                  type="button"
                  data-l="te"
                  onClick={() => handleLanguageChange("te")}
                  className={`min-h-[32px] sm:min-h-[34px] px-2 sm:px-2.5 text-xs font-heading font-bold rounded-[2px] transition-all cursor-pointer ${
                    activeLang === "te"
                      ? "bg-[#F2C230] text-[#120F0C] border-2 border-[#120F0C] shadow-[inset_0px_1px_0px_#FFF2CC,1px_1px_0px_#10121A]"
                      : "bg-[#262A3B] hover:bg-[#343A52] text-[#D9B87A] hover:text-[#F3E3BC] border border-[#120F0C]"
                  }`}
                >
                  తెలుగు
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* ================================================================= */}
      {/* 2. TABLET LEFT RAIL (768px to 1023px: Semi-opaque night panel)    */}
      {/* ================================================================= */}
      {!isAssessment && (
        <aside
          aria-label="Tablet navigation rail"
          data-panel="tablet-rail"
          className="hidden md:flex lg:hidden fixed left-0 top-16 sm:top-[68px] bottom-0 w-20 z-40 bg-[#181B26]/96 text-[#F3E3BC] border-r-[3px] border-[#120F0C] shadow-[3px_0px_0px_#10121A] backdrop-blur-[3px] flex-col items-center py-4 gap-3 select-none"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const localizedLabel = t(item.labelKey);

            return (
              <a
                key={item.id}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`w-16 min-h-[56px] p-2 flex flex-col items-center justify-center gap-1 rounded-[2px] transition-all no-underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F4FB5] ${
                  isActive
                    ? "bg-[#5FA334] text-[#120F0C] border-2 border-[#120F0C] shadow-[inset_1px_1px_0px_#8EDB49,2px_2px_0px_#10121A]"
                    : "bg-[#262A3B] hover:bg-[#343A52] text-[#F3E3BC] hover:text-[#FFE9A8] border-2 border-[#120F0C] shadow-[2px_2px_0px_#10121A]"
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[#1E1610]" : "text-[#F2C230]"}`} aria-hidden="true" />
                <span className="text-[10px] font-heading font-extrabold text-center leading-tight truncate max-w-[60px]">
                  {localizedLabel}
                </span>
              </a>
            );
          })}
        </aside>
      )}

      {/* ================================================================= */}
      {/* 3. MOBILE BOTTOM TAB BAR (<768px: Semi-opaque night panel)        */}
      {/* ================================================================= */}
      {!isAssessment && (
        <nav
          aria-label="Mobile bottom navigation"
          data-panel="mobile-bottom-nav"
          className="md:hidden fixed left-0 right-0 bottom-0 z-40 bg-[#181B26]/96 text-[#F3E3BC] border-t-[3px] border-[#120F0C] shadow-[0px_-3px_0px_#10121A] backdrop-blur-[3px] pb-[env(safe-area-inset-bottom,0px)]"
        >
          <div className="flex w-full h-16 min-h-[64px] max-w-[600px] mx-auto p-1.5 gap-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const localizedLabel = t(item.labelKey);

              return (
                <a
                  key={item.id}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex-1 min-h-[48px] h-full flex flex-col items-center justify-center gap-1 no-underline select-none transition-colors px-1 rounded-[2px] ${
                    isActive
                      ? "bg-[#5FA334] text-[#120F0C] border-2 border-[#120F0C] shadow-[inset_0px_2px_0px_#8EDB49,1px_1px_0px_#10121A] font-heading font-extrabold"
                      : "bg-[#262A3B] text-[#F3E3BC] hover:bg-[#343A52] hover:text-[#FFE9A8] border border-[#120F0C] font-heading font-bold"
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[#1E1610]" : "text-[#F2C230]"}`} aria-hidden="true" />
                  <span className="font-heading font-extrabold text-[10px] leading-normal text-center truncate max-w-full">
                    {localizedLabel}
                  </span>
                </a>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}

export default Navigation;
