"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Sparkles,
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
    icon: Sparkles,
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
  currentTab?: "home" | "learn" | "stickers" | "profile";
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
          className={`sticky top-0 z-40 bg-[#5A3720]/95 backdrop-blur-md border-b-4 border-[#422816] shadow-[0px_4px_0px_rgba(0,0,0,0.35)] ${className}`}
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">
            {/* Left: Brand Identity */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2.5 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE9A8]"
                aria-label="Margam Home"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[2px] bg-[#422816] border-2 border-[#7A4B2A] shadow-[2px_2px_0px_rgba(0,0,0,0.4)] flex items-center justify-center shrink-0">
                  <Logo className="w-6 h-6" ariaLabel="Margam Logo" />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-extrabold text-lg sm:text-xl text-[#FFE9A8] tracking-wider leading-none drop-shadow-[2px_2px_0px_#422816]">
                    MARGAM
                  </span>
                  <span className="text-[9px] font-heading font-bold text-[#FFB36B] leading-tight hidden sm:block mt-0.5">
                    Voxel Realm • Classes 6–10
                  </span>
                </div>
              </Link>

              {/* Class Scope Badge */}
              {profile && (
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 border-2 border-[#422816] bg-[#5DAA3A] text-[10px] font-heading font-extrabold text-[#FFF7E6] shadow-[2px_2px_0px_rgba(0,0,0,0.4)]">
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
                const isActive = active === item.id;
                const localizedLabel = item.label[currentLang] || item.label.en;

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`min-h-[44px] px-3.5 py-2 text-xs font-heading font-extrabold flex items-center gap-2 rounded-[2px] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE9A8] ${
                      isActive
                        ? "bg-gradient-to-b from-[#5DAA3A] to-[#2F6B22] text-[#FFF7E6] border-2 border-[#204514] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4),2px_2px_0px_rgba(0,0,0,0.35)]"
                        : "text-[#FFF7E6] hover:text-[#FFE9A8] hover:bg-[#7A4B2A]/70"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#FFE9A8]" : "text-[#6EB5FF]"}`} aria-hidden="true" />
                    <span>{localizedLabel}</span>
                  </Link>
                );
              })}

              {/* Subtle Teacher Portal link for educators on desktop */}
              <Link
                href="/teacher"
                className="min-h-[44px] px-2.5 py-2 text-xs font-heading font-bold text-[#E5D7BE] hover:text-[#FFE9A8] hover:bg-[#7A4B2A]/50 rounded-[2px] transition-all flex items-center gap-1.5 ml-1"
                title="Teacher Hub"
              >
                <Users className="w-3.5 h-3.5 text-[#FFE9A8]" aria-hidden="true" />
                <span className="text-[11px]">Teacher</span>
              </Link>
            </nav>

            {/* Right: Sound, Streak, Level Chip & Language Switcher */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Gamification Pills (Tablet & Desktop) */}
              {profile && (
                <div className="hidden sm:flex items-center gap-2">
                  {/* Streak Pill */}
                  {profile.streak && profile.streak.current > 0 && (
                    <div
                      className="flex items-center gap-1 px-2 py-1 bg-[#422816] border-2 border-[#7A4B2A] text-xs font-heading font-extrabold text-[#FFB36B] shadow-[2px_2px_0px_rgba(0,0,0,0.35)] select-none"
                      title={`${profile.streak.current} day study streak`}
                    >
                      <Flame className="w-3.5 h-3.5 text-[#FFB36B] fill-[#FFB36B]" aria-hidden="true" />
                      <span>{profile.streak.current}d</span>
                    </div>
                  )}

                  {/* Level & Rank Pill */}
                  {levelInfo && (
                    <div
                      className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-[#422816] border-2 border-[#7A4B2A] text-xs font-heading font-extrabold text-[#FFE9A8] shadow-[2px_2px_0px_rgba(0,0,0,0.35)] select-none"
                      title={`Level ${levelInfo.level} • ${levelInfo.rank.name} Rank`}
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
                className="min-h-[44px] min-w-[44px] p-2 bg-[#422816] border-2 border-[#7A4B2A] rounded-[2px] text-[#FFF7E6] hover:text-[#FFE9A8] shadow-[2px_2px_0px_rgba(0,0,0,0.35)] flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE9A8]"
                aria-label={soundOn ? "Mute Game Audio" : "Enable Game Audio (8-bit synth sound effects)"}
                title={soundOn ? "Sound: ON" : "Sound: OFF"}
              >
                {soundOn ? (
                  <Volume2 className="w-4 h-4 text-[#5DAA3A]" aria-hidden="true" />
                ) : (
                  <VolumeX className="w-4 h-4 text-[#D9D9D9]/70" aria-hidden="true" />
                )}
              </button>

              {/* Multilingual Switcher (EN | हिन्दी | తెలుగు) */}
              {onLanguageChange && (
                <div
                  className="flex items-center bg-[#422816] p-0.5 sm:p-1 border-2 border-[#7A4B2A] rounded-[2px] shadow-[2px_2px_0px_rgba(0,0,0,0.35)]"
                  role="group"
                  aria-label="Select Interface Language"
                >
                  <button
                    type="button"
                    data-l="en"
                    onClick={() => onLanguageChange("en")}
                    className={`min-h-[38px] min-w-[34px] sm:min-w-[38px] px-1.5 sm:px-2 text-xs font-bold rounded-[2px] transition-all cursor-pointer ${
                      currentLang === "en"
                        ? "bg-[#FFE9A8] text-[#2B1B0F] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.9)]"
                        : "text-[#FFF7E6] hover:text-[#FFE9A8]"
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
                        ? "bg-[#FFE9A8] text-[#2B1B0F] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.9)]"
                        : "text-[#FFF7E6] hover:text-[#FFE9A8]"
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
                        ? "bg-[#FFE9A8] text-[#2B1B0F] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.9)]"
                        : "text-[#FFF7E6] hover:text-[#FFE9A8]"
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
          className="hidden md:flex lg:hidden fixed left-0 top-16 bottom-0 w-20 z-40 bg-[#5A3720] border-r-4 border-[#422816] shadow-[4px_0px_0px_rgba(0,0,0,0.35)] flex-col items-center py-4 gap-3 select-none"
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
                className={`w-16 min-h-[56px] p-2 flex flex-col items-center justify-center gap-1 rounded-[2px] transition-all no-underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE9A8] ${
                  isActive
                    ? "bg-gradient-to-b from-[#5DAA3A] to-[#2F6B22] text-[#FFF7E6] border-2 border-[#204514] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4),2px_2px_0px_rgba(0,0,0,0.35)]"
                    : "text-[#FFF7E6] hover:text-[#FFE9A8] hover:bg-[#7A4B2A]/70"
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[#FFE9A8]" : "text-[#6EB5FF]"}`} aria-hidden="true" />
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
          className="md:hidden fixed left-0 right-0 bottom-0 z-40 bg-[#5A3720] border-t-4 border-[#422816] shadow-[0px_-4px_0px_rgba(0,0,0,0.35)] pb-[env(safe-area-inset-bottom,0px)]"
        >
          <div className="flex w-full h-16 min-h-[64px] max-w-[600px] mx-auto">
            {NAV_ITEMS.map((item) => {
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
                      ? "bg-[#5DAA3A] text-[#FFF7E6] border-t-4 border-t-[#FFE9A8] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4)]"
                      : "text-[#FFF7E6] hover:text-[#FFE9A8] hover:bg-[#7A4B2A]/60"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span className="font-heading font-extrabold text-[10px] leading-normal text-center truncate max-w-full">
                    {localizedLabel}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}

export default Navigation;

