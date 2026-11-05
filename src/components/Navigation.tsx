"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  Award,
  User,
  Volume2,
  VolumeX,
  Flame,
  Users,
} from "lucide-react";
import { SupportedLanguage, LearnerProfile } from "@/lib/types";
import { Logo } from "@/components/ui";
import { isSoundEnabled, setSoundEnabled, playPopSound } from "@/lib/sound";
import { getLevelProgress } from "@/lib/xp-config";

export interface NavItemConfig {
  id: "home" | "learn" | "stickers" | "profile";
  label: {
    en: string;
    hi: string;
    te: string;
  };
  href: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
}

export const NAV_ITEMS: readonly NavItemConfig[] = [
  {
    id: "home",
    label: { en: "Home", hi: "होम", te: "హోమ్" },
    href: "/",
    icon: Home,
  },
  {
    id: "learn",
    label: { en: "Learn", hi: "सीखें", te: "నేర్చుకోండి" },
    href: "/student",
    icon: BookOpen,
  },
  {
    id: "stickers",
    label: { en: "Badges", hi: "बैज", te: "బ్యాడ్జ్‌లు" },
    href: "/student/stickers",
    icon: Award,
  },
  {
    id: "profile",
    label: { en: "Profile", hi: "प्रोफ़ाइल", te: "ప్రొఫైల్" },
    href: "/student/select-class",
    icon: User,
  },
] as const;

export interface NavigationProps {
  currentTab?: "home" | "learn" | "stickers" | "profile" | "diagnostic" | "practice" | string;
  currentLang?: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  profile?: LearnerProfile | null;
  showTopBar?: boolean;
  className?: string;
}

export function Navigation({
  currentTab,
  currentLang = "en",
  onLanguageChange,
  profile,
  showTopBar = true,
  className = "",
}: NavigationProps) {
  const pathname = usePathname() || "";
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    setSoundOn(isSoundEnabled());
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playPopSound();
  };

  // Derive active tab automatically from route if not explicitly passed
  let active = currentTab;
  if (!active) {
    if (pathname.includes("/stickers")) active = "stickers";
    else if (pathname.includes("/lesson") || pathname === "/student") active = "learn";
    else if (pathname.includes("/select-class") || pathname.includes("/reset-class")) active = "profile";
    else active = "home";
  }

  // Diagnostic / Assessment pages keep full focus without navigation bars
  const isAssessment =
    pathname.includes("/student/diagnostic") ||
    pathname.includes("/student/test");

  const levelInfo = profile ? getLevelProgress(profile.xp || 0) : null;

  return (
    <>
      {/* ================================================================= */}
      {/* 1. TOP HEADER (Responsive: Mobile 56px, Tablet 64px, Desktop 64px)*/}
      {/* ================================================================= */}
      {showTopBar && (
        <header
          aria-label="Desktop top navigation"
          className={`sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b-[3px] border-[#2B1B0F] shadow-[0px_3px_0px_rgba(43,27,15,0.1)] ${className}`}
        >
          <div className="max-w-[1200px] mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-3">
            {/* Left: Brand Identity */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 sm:gap-2.5 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6EB5FF]"
                aria-label="Margam Home"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-[2px] bg-[#5DAA3A] border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] flex items-center justify-center shrink-0">
                  <Logo className="w-5 h-5 sm:w-6 sm:h-6" ariaLabel="Margam Logo" />
                </div>
                <div className="flex flex-col">
                  <span className="font-pixel text-sm sm:text-lg text-[#2B1B0F] tracking-wider leading-none">
                    MARGAM
                  </span>
                  <span className="text-[10px] font-sans font-bold text-[#7A4B2A] leading-tight hidden sm:block mt-0.5">
                    Maths for Classes 6-10
                  </span>
                </div>
              </Link>

              {/* Class Scope Badge */}
              {profile && (
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 border-2 border-[#2B1B0F] bg-[#5DAA3A] text-[10px] font-sans font-extrabold text-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F]">
                  Class {profile.selectedClass}
                </span>
              )}
            </div>

            {/* Center: Desktop Navigation Links (>=1024px only) */}
            <nav
              className="hidden lg:flex items-center gap-1.5"
              aria-label="Desktop primary navigation"
            >
              {profile ? (
                <>
                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = active === item.id;
                    const localizedLabel = item.label[currentLang] || item.label.en;

                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={`min-h-[44px] px-3.5 py-2 text-xs font-heading font-extrabold flex items-center gap-2 rounded-[2px] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6EB5FF] ${
                          isActive
                            ? "bg-[#5DAA3A] text-[#2B1B0F] border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F]"
                            : "text-[#2B1B0F] hover:text-[#2B1B0F] hover:bg-[#F4C542]/20"
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#2B1B0F]" : "text-[#1E6F8C]"}`} aria-hidden="true" />
                        <span>{localizedLabel}</span>
                      </Link>
                    );
                  })}

                  {/* Subtle Teacher link on desktop */}
                  <Link
                    href="/teacher"
                    className="min-h-[44px] px-2.5 py-2 text-xs font-heading font-bold text-[#2B1B0F] hover:bg-[#F4C542]/20 rounded-[2px] transition-all flex items-center gap-1.5 ml-1"
                    title="Teacher"
                  >
                    <Users className="w-3.5 h-3.5 text-[#1E6F8C]" aria-hidden="true" />
                    <span className="text-[11px]">Teacher</span>
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login?role=student"
                    className="min-h-[40px] px-3.5 py-2 text-xs font-heading font-bold text-[#2B1B0F] bg-[#FFF7E6] hover:bg-[#F4C542]/20 border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] rounded-[2px] transition-all flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6EB5FF]"
                  >
                    <span>Student sign in</span>
                  </Link>
                  <Link
                    href="/login?role=teacher"
                    className="min-h-[40px] px-3.5 py-2 text-xs font-heading font-bold text-[#2B1B0F] bg-white hover:bg-[#F4C542]/20 border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] rounded-[2px] transition-all flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6EB5FF]"
                  >
                    <span>Teacher sign in</span>
                  </Link>
                </div>
              )}
            </nav>

            {/* Right: Sound, Streak, Level Chip & Language Switcher */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* Gamification Pills (Tablet & Desktop) */}
              {profile && (
                <div className="hidden sm:flex items-center gap-2">
                  {/* Streak Pill */}
                  {profile.streak && profile.streak.current > 0 && (
                    <div
                      className="flex items-center gap-1.5 px-2 py-1 bg-[#FFF7E6] border-2 border-[#2B1B0F] text-xs font-sans font-extrabold text-[#7A4B2A] shadow-[2px_2px_0px_#2B1B0F] select-none"
                      title={`${profile.streak.current} days in a row`}
                    >
                      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" aria-hidden="true">
                        <rect x="5" y="1" width="2" height="2" fill="#B8322B" />
                        <rect x="4" y="3" width="4" height="3" fill="#E5A823" />
                        <rect x="3" y="6" width="6" height="4" fill="#B8322B" />
                        <rect x="5" y="7" width="2" height="2" fill="#F4C542" />
                      </svg>
                      <span>{profile.streak.current} days in a row</span>
                    </div>
                  )}

                  {/* Level & Rank Pill */}
                  {levelInfo && (
                    <div
                      className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-[#FFF7E6] border-2 border-[#2B1B0F] text-xs font-sans font-extrabold text-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] select-none"
                      title={`Level ${levelInfo.level}, ${levelInfo.rank.name} rank`}
                    >
                      <span>{levelInfo.rank.badge}</span>
                      <span className="hidden xl:inline">{levelInfo.rank.name}</span>
                      <span>Lv {levelInfo.level}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Sound Toggle Button */}
              <button
                type="button"
                onClick={toggleSound}
                className="min-h-[38px] min-w-[38px] sm:min-h-[44px] sm:min-w-[44px] p-1.5 sm:p-2 bg-[#FFFFFF] border-2 border-[#2B1B0F] rounded-[2px] text-[#2B1B0F] hover:bg-[#F4C542]/20 shadow-[2px_2px_0px_#2B1B0F] flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6EB5FF]"
                aria-label={soundOn ? "Mute Game Audio" : "Enable Game Audio (8-bit synth sound effects)"}
                title={soundOn ? "Sound: ON" : "Sound: OFF"}
              >
                {soundOn ? (
                  <Volume2 className="w-4 h-4 text-[#5DAA3A]" aria-hidden="true" />
                ) : (
                  <VolumeX className="w-4 h-4 text-[#8B8B8B]" aria-hidden="true" />
                )}
              </button>

              {/* Multilingual Switcher (EN | हिन्दी | తెలుగు) */}
              {onLanguageChange && (
                <div
                  className="flex items-center bg-[#FFF7E6] p-0.5 sm:p-1 border-2 border-[#2B1B0F] rounded-[2px] shadow-[2px_2px_0px_#2B1B0F]"
                  role="group"
                  aria-label="Select Interface Language"
                >
                  <button
                    type="button"
                    data-l="en"
                    onClick={() => onLanguageChange("en")}
                    className={`min-h-[34px] sm:min-h-[38px] min-w-[30px] sm:min-w-[38px] px-1 sm:px-2 text-[11px] sm:text-xs font-bold rounded-[2px] transition-all cursor-pointer ${
                      currentLang === "en"
                        ? "bg-[#F4C542] text-[#2B1B0F] border border-[#2B1B0F] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.9)]"
                        : "text-[#2B1B0F] hover:bg-[#F4C542]/20"
                    }`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    data-l="hi"
                    onClick={() => onLanguageChange("hi")}
                    className={`min-h-[38px] min-w-[38px] sm:min-w-[42px] px-1.5 sm:px-2 text-xs font-bold rounded-[2px] transition-all cursor-pointer ${
                      currentLang === "hi"
                        ? "bg-[#F4C542] text-[#2B1B0F] border border-[#2B1B0F] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.9)]"
                        : "text-[#2B1B0F] hover:bg-[#F4C542]/20"
                    }`}
                  >
                    हिन्दी
                  </button>
                  <button
                    type="button"
                    data-l="te"
                    onClick={() => onLanguageChange("te")}
                    className={`min-h-[38px] min-w-[38px] sm:min-w-[42px] px-1.5 sm:px-2 text-xs font-bold rounded-[2px] transition-all cursor-pointer ${
                      currentLang === "te"
                        ? "bg-[#F4C542] text-[#2B1B0F] border border-[#2B1B0F] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.9)]"
                        : "text-[#2B1B0F] hover:bg-[#F4C542]/20"
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
      {/* 2. TABLET LEFT RAIL (768px to 1023px only: Collapsed Rail)        */}
      {/* ================================================================= */}
      {!isAssessment && (
        <aside
          aria-label="Tablet navigation rail"
          className="hidden md:flex lg:hidden fixed left-0 top-16 bottom-0 w-20 z-40 bg-[#FFFFFF] border-r-[3px] border-[#2B1B0F] shadow-[3px_0px_0px_rgba(43,27,15,0.1)] flex-col items-center py-4 gap-3 select-none"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            const localizedLabel = item.label[currentLang] || item.label.en;

            return (
              <Link
                key={item.id}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`w-16 min-h-[56px] p-2 flex flex-col items-center justify-center gap-1 rounded-[2px] transition-all no-underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6EB5FF] ${
                  isActive
                    ? "bg-[#5DAA3A] text-[#2B1B0F] border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F]"
                    : "text-[#2B1B0F] hover:bg-[#F4C542]/20"
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[#2B1B0F]" : "text-[#1E6F8C]"}`} aria-hidden="true" />
                <span className="text-[10px] font-heading font-extrabold text-center leading-tight truncate max-w-[60px]">
                  {localizedLabel}
                </span>
              </Link>
            );
          })}
        </aside>
      )}

      {/* ================================================================= */}
      {/* 3. MOBILE BOTTOM TAB BAR (<768px only: 64px height, safe-area)   */}
      {/* ================================================================= */}
      {!isAssessment && (
        <nav
          aria-label="Mobile bottom navigation"
          className="md:hidden fixed left-0 right-0 bottom-0 z-40 bg-[#FFFFFF] border-t-[3px] border-[#2B1B0F] shadow-[0px_-3px_0px_rgba(43,27,15,0.1)] pb-[env(safe-area-inset-bottom,0px)]"
        >
          <div className="flex w-full h-16 min-h-[64px] max-w-[600px] mx-auto">
            {profile ? (
              NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.id;
                const localizedLabel = item.label[currentLang] || item.label.en;

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex-1 min-h-[48px] h-full flex flex-col items-center justify-center gap-1 no-underline select-none transition-colors px-1 ${
                      isActive
                        ? "bg-[#5DAA3A] text-[#2B1B0F] border-t-4 border-t-[#F4C542] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4)] font-bold"
                        : "text-[#2B1B0F] hover:bg-[#F4C542]/20"
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
                    <span className="font-sans font-bold text-[10px] leading-normal text-center truncate max-w-full">
                      {localizedLabel}
                    </span>
                  </Link>
                );
              })
            ) : (
              <>
                <Link
                  href="/"
                  className="flex-1 min-h-[48px] h-full flex flex-col items-center justify-center gap-1 no-underline select-none text-[#2B1B0F] hover:bg-[#F4C542]/20 px-1"
                >
                  <Home className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span className="font-sans font-bold text-[10px] leading-normal text-center truncate max-w-full">
                    Home
                  </span>
                </Link>
                <Link
                  href="/login?role=student"
                  className="flex-1 min-h-[48px] h-full flex flex-col items-center justify-center gap-1 no-underline select-none text-[#2B1B0F] hover:bg-[#F4C542]/20 px-1"
                >
                  <User className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span className="font-sans font-bold text-[10px] leading-normal text-center truncate max-w-full">
                    Student sign in
                  </span>
                </Link>
                <Link
                  href="/login?role=teacher"
                  className="flex-1 min-h-[48px] h-full flex flex-col items-center justify-center gap-1 no-underline select-none text-[#2B1B0F] hover:bg-[#F4C542]/20 px-1"
                >
                  <Users className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span className="font-sans font-bold text-[10px] leading-normal text-center truncate max-w-full">
                    Teacher sign in
                  </span>
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </>
  );
}

export default Navigation;

