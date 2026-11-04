"use client";

import React, { useState } from "react";
import Link from "next/navigation";
import { usePathname } from "next/navigation";
import {
  Compass,
  BookOpen,
  Trophy,
  User,
  Users,
  Volume2,
  VolumeX,
  Flame,
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import { LearnerProfile, SupportedLanguage } from "@/lib/types";
import { getLevelProgress } from "@/lib/xp-config";

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
    label: { en: "Home", hi: "मुख्य", te: "హోమ్" },
    icon: Compass,
  },
  {
    id: "diagnostic",
    href: "/student/diagnostic",
    label: { en: "Quick Check", hi: "जाँच", te: "తనిఖీ" },
    icon: BookOpen,
  },
  {
    id: "stickers",
    href: "/student/stickers",
    label: { en: "Stickers", hi: "स्टीकर", te: "స్టిక్కర్లు" },
    icon: Trophy,
  },
  {
    id: "profile",
    href: "/student/profile",
    label: { en: "Profile", hi: "प्रोफ़ाइल", te: "ప్రొఫైల్" },
    icon: User,
  },
];

export function Navigation({
  currentTab,
  currentLang = "en",
  onLanguageChange,
  profile,
  active,
  className = "",
  showTopBar = true,
}: NavigationProps) {
  const activeTab = currentTab || active;
  const pathname = usePathname() || "";
  const [soundOn, setSoundOn] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("margam_sound_enabled") !== "false";
    }
    return true;
  });

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("margam_sound_enabled", String(next));
    }
  };

  const isAssessment =
    pathname.includes("/student/diagnostic") ||
    pathname.includes("/student/test");

  const levelInfo = profile ? getLevelProgress(profile.xp || 0) : null;

  return (
    <>
      {/* ================================================================= */}
      {/* 1. TOP HEADER (HUD / Night Panel, Parchment Text, NO Backdrop)    */}
      {/* ================================================================= */}
      {showTopBar && (
        <header
          aria-label="Desktop top navigation"
          data-panel="top-hud"
          className={`sticky top-0 z-40 bg-[#232634]/92 text-[#F3E3BC] border-b-[3px] border-[#1E1610] shadow-[0px_3px_0px_#1E1610] ${className}`}
        >
          <div className="max-w-[1200px] mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-3">
            {/* Left: Brand Identity */}
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href="/"
                className="flex items-center gap-2 sm:gap-2.5 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F4FB5]"
                aria-label="Margam Home"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xs bg-[#6DB33F] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] flex items-center justify-center shrink-0">
                  <Logo className="w-5 h-5 sm:w-6 sm:h-6 text-[#1E1610]" ariaLabel="Margam Logo" />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-extrabold text-sm sm:text-lg text-[#F3E3BC] tracking-wider leading-none">
                    MARGAM
                  </span>
                  <span className="text-[10px] font-sans font-bold text-[#D9B87A] leading-tight hidden sm:block mt-0.5">
                    Classes 6–10
                  </span>
                </div>
              </a>

              {/* Class Scope Badge */}
              {profile && (
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 border-2 border-[#1E1610] bg-[#6DB33F] text-[10px] font-heading font-extrabold text-[#1E1610] shadow-[2px_2px_0px_#1E1610]">
                  Class {profile.selectedClass}
                </span>
              )}
            </div>

            {/* Center: Desktop Navigation Links (>=1024px only) */}
            <nav
              className="hidden lg:flex items-center gap-1.5"
              aria-label="Desktop primary navigation"
            >
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const localizedLabel = item.label[currentLang] || item.label.en;

                return (
                  <a
                    key={item.id}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`min-h-[44px] px-3.5 py-2 text-xs font-heading font-extrabold flex items-center gap-2 rounded-xs transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F4FB5] ${
                      isActive
                        ? "bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610]"
                        : "text-[#F3E3BC] hover:text-[#1E1610] hover:bg-[#E8CF9C]"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#1E1610]" : "text-[#78BDE8]"}`} aria-hidden="true" />
                    <span>{localizedLabel}</span>
                  </a>
                );
              })}

              {/* Teacher Portal link */}
              <a
                href="/teacher"
                className="min-h-[44px] px-2.5 py-2 text-xs font-heading font-bold text-[#F3E3BC] hover:text-[#1E1610] hover:bg-[#E8CF9C] rounded-xs transition-all flex items-center gap-1.5 ml-1"
                title="Teacher Hub"
              >
                <Users className="w-3.5 h-3.5 text-[#78BDE8]" aria-hidden="true" />
                <span className="text-[11px]">Teacher</span>
              </a>
            </nav>

            {/* Right: Streak, Level Tier HUD, and Multilingual Switcher */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {profile && (
                <div className="flex items-center gap-2">
                  {/* Streak: plain wording */}
                  {profile.streak && profile.streak.current > 0 && (
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1 bg-[#E8CF9C] border-2 border-[#1E1610] text-xs font-sans font-extrabold text-[#D1362B] shadow-[2px_2px_0px_#1E1610] select-none"
                      title={`${profile.streak.current} ${profile.streak.current === 1 ? "day in a row" : "days in a row"}`}
                    >
                      <Flame className="w-3.5 h-3.5 text-[#D1362B] fill-[#D1362B]" aria-hidden="true" />
                      <span className="hidden sm:inline">
                        {profile.streak.current} {profile.streak.current === 1 ? "day in a row" : "days in a row"}
                      </span>
                      <span className="sm:hidden">{profile.streak.current}d</span>
                    </div>
                  )}

                  {/* Level as tool tier + XP bar */}
                  {levelInfo && (
                    <div
                      className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-[#18120C] border-2 border-[#1E1610] text-xs font-heading font-extrabold text-[#F3E3BC] shadow-[2px_2px_0px_#1E1610] select-none"
                      title={`${levelInfo.rank.name} level • ${levelInfo.progressPercent}% to next level`}
                    >
                      <span className="text-sm select-none" aria-hidden="true">{levelInfo.rank.badge}</span>
                      <span className="text-[#F2C230]">{levelInfo.rank.name} level</span>
                      <div
                        className="w-16 h-2 bg-[#232634] border border-[#1E1610] overflow-hidden"
                        role="progressbar"
                        aria-valuenow={levelInfo.progressPercent}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${levelInfo.rank.name} level XP progression: ${levelInfo.progressPercent}%`}
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

              {/* Multilingual Switcher (EN | हिन्दी | తెలుగు) */}
              {onLanguageChange && (
                <div
                  className="flex items-center bg-[#D9B87A] p-0.5 sm:p-1 border-2 border-[#1E1610] rounded-xs shadow-[2px_2px_0px_#1E1610]"
                  role="group"
                  aria-label="Select Interface Language"
                >
                  <button
                    type="button"
                    data-l="en"
                    onClick={() => onLanguageChange("en")}
                    className={`min-h-[34px] sm:min-h-[38px] min-w-[30px] sm:min-w-[38px] px-1 sm:px-2 text-[11px] sm:text-xs font-bold rounded-xs transition-all cursor-pointer ${
                      currentLang === "en"
                        ? "bg-[#F2C230] text-[#1E1610] border border-[#1E1610] shadow-[1px_1px_0px_#1E1610]"
                        : "text-[#1E1610] hover:bg-[#E8CF9C]"
                    }`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    data-l="hi"
                    onClick={() => onLanguageChange("hi")}
                    className={`min-h-[38px] min-w-[38px] sm:min-w-[42px] px-1.5 sm:px-2 text-xs font-bold rounded-xs transition-all cursor-pointer ${
                      currentLang === "hi"
                        ? "bg-[#F2C230] text-[#1E1610] border border-[#1E1610] shadow-[1px_1px_0px_#1E1610]"
                        : "text-[#1E1610] hover:bg-[#E8CF9C]"
                    }`}
                  >
                    हिन्दी
                  </button>
                  <button
                    type="button"
                    data-l="te"
                    onClick={() => onLanguageChange("te")}
                    className={`min-h-[38px] min-w-[38px] sm:min-w-[42px] px-1.5 sm:px-2 text-xs font-bold rounded-xs transition-all cursor-pointer ${
                      currentLang === "te"
                        ? "bg-[#F2C230] text-[#1E1610] border border-[#1E1610] shadow-[1px_1px_0px_#1E1610]"
                        : "text-[#1E1610] hover:bg-[#E8CF9C]"
                    }`}
                  >
                    తెలుగు
                  </button>
                </div>
              )}
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
          className="hidden md:flex lg:hidden fixed left-0 top-16 bottom-0 w-20 z-40 bg-[#232634]/92 text-[#F3E3BC] border-r-[3px] border-[#1E1610] shadow-[3px_0px_0px_#1E1610] flex-col items-center py-4 gap-3 select-none"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const localizedLabel = item.label[currentLang] || item.label.en;

            return (
              <a
                key={item.id}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`w-16 min-h-[56px] p-2 flex flex-col items-center justify-center gap-1 rounded-xs transition-all no-underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F4FB5] ${
                  isActive
                    ? "bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610]"
                    : "text-[#F3E3BC] hover:text-[#1E1610] hover:bg-[#E8CF9C]"
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[#1E1610]" : "text-[#78BDE8]"}`} aria-hidden="true" />
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
          className="md:hidden fixed left-0 right-0 bottom-0 z-40 bg-[#232634]/95 text-[#F3E3BC] border-t-[3px] border-[#1E1610] shadow-[0px_-3px_0px_#1E1610] pb-[env(safe-area-inset-bottom,0px)]"
        >
          <div className="flex w-full h-16 min-h-[64px] max-w-[600px] mx-auto">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const localizedLabel = item.label[currentLang] || item.label.en;

              return (
                <a
                  key={item.id}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex-1 min-h-[48px] h-full flex flex-col items-center justify-center gap-1 no-underline select-none transition-colors px-1 ${
                    isActive
                      ? "bg-[#6DB33F] text-[#1E1610] border-t-4 border-t-[#F2C230] font-heading font-extrabold"
                      : "text-[#F3E3BC] hover:text-[#1E1610] hover:bg-[#E8CF9C]"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span className="font-heading font-bold text-[10px] leading-normal text-center truncate max-w-full">
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
