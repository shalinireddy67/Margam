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
  Compass,
  Target,
} from "lucide-react";
import { SupportedLanguage, LearnerProfile } from "@/lib/types";
import { Logo } from "@/components/ui";
import { isSoundEnabled, setSoundEnabled, playPopSound } from "@/lib/sound";
import { getLevelProgress } from "@/lib/xp-config";

export interface NavItemConfig {
  id: "home" | "learn" | "practice" | "diagnostic" | "profile" | "stickers";
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
    href: "/student",
    icon: Home,
  },
  {
    id: "learn",
    label: { en: "Learn", hi: "सीखें", te: "నేర్చుకోండి" },
    href: "/student/learn",
    icon: Sparkles,
  },
  {
    id: "practice",
    label: { en: "Practice", hi: "अभ्यास", te: "అభ్యాసం" },
    href: "/student/practice",
    icon: Compass,
  },
  {
    id: "diagnostic",
    label: { en: "Diagnose", hi: "निदान", te: "రోగనిర్ధారణ" },
    href: "/student/diagnostic",
    icon: Target,
  },
  {
    id: "profile",
    label: { en: "Profile", hi: "प्रोफ़ाइल", te: "ప్రొఫైల్" },
    href: "/student/profile",
    icon: User,
  },
] as const;

export interface NavigationProps {
  currentTab?: "home" | "learn" | "practice" | "diagnostic" | "profile" | "stickers";
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
    if (pathname === "/student" || pathname === "/student/") active = "home";
    else if (pathname.startsWith("/student/learn") || pathname.startsWith("/lesson") || pathname.startsWith("/learn")) active = "learn";
    else if (pathname.startsWith("/student/practice") || pathname.startsWith("/student/worksheet")) active = "practice";
    else if (pathname.startsWith("/student/diagnostic") || pathname.startsWith("/student/test")) active = "diagnostic";
    else if (pathname.startsWith("/student/profile") || pathname.startsWith("/student/select-class") || pathname.startsWith("/student/reset-class")) active = "profile";
    else if (pathname.startsWith("/student/stickers")) active = "stickers";
    else active = "home";
  }

  const levelInfo = profile ? getLevelProgress(profile.xp || 0) : null;

  return (
    <>
      {/* ================================================================= */}
      {/* DESKTOP & TABLET FLOATING FROSTED GLASS TOP NAVBAR                */}
      {/* ================================================================= */}
      {showTopBar && (
        <header
          aria-label="Primary navigation"
          className={`sticky top-3 z-50 max-w-[1200px] mx-auto px-3 sm:px-6 w-full ${className}`}
        >
          <div className="glass-panel px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4 shadow-[0_8px_32px_rgba(16,42,18,0.1)] border border-white/70">
            {/* Left: Brand Identity */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <Link
                href="/"
                className="flex items-center gap-2 min-h-[44px] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl"
                aria-label="Margam Home"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-sm border border-white/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Logo className="w-4 h-4 sm:w-5 sm:h-5 text-white" ariaLabel="Margam Logo" />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-extrabold text-base sm:text-lg text-emerald-950 tracking-wider leading-none">
                    MARGAM
                  </span>
                  <span className="text-[9px] font-sans font-bold text-emerald-700 leading-tight hidden lg:block mt-0.5">
                    NCERT Math • Classes 6–10
                  </span>
                </div>
              </Link>

              {/* Class Scope Badge */}
              {profile && (
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100/90 border border-emerald-300 text-[10px] font-heading font-extrabold text-emerald-900 shadow-xs">
                  Class {profile.selectedClass}
                </span>
              )}
            </div>

            {/* Center: Desktop/Laptop Navigation Links (hidden on mobile, uses bottom nav) */}
            <nav
              className="hidden md:flex items-center gap-1 lg:gap-1.5"
              aria-label="Primary navigation"
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
                    className={`min-h-[38px] px-2.5 lg:px-3 py-1.5 text-xs font-heading font-bold flex items-center gap-1.5 rounded-xl transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-xs border border-emerald-400/50"
                        : "text-emerald-950/80 hover:text-emerald-950 hover:bg-white/60"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-emerald-700"}`} aria-hidden="true" />
                    <span>{localizedLabel}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right: Sound, Streak, Level Chip & Language Switcher */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Gamification Pills (desktop only) */}
              {profile && (
                <div className="hidden xl:flex items-center gap-1.5">
                  {/* Streak Pill */}
                  {profile.streak && profile.streak.current > 0 && (
                    <div
                      className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50/90 border border-amber-200/80 text-xs font-heading font-bold text-amber-800 shadow-xs select-none"
                      title={`${profile.streak.current} day study streak`}
                    >
                      <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" aria-hidden="true" />
                      <span>{profile.streak.current}d</span>
                    </div>
                  )}

                  {/* Level & Rank Pill */}
                  {levelInfo && (
                    <div
                      className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50/90 border border-emerald-200/80 text-xs font-heading font-bold text-emerald-800 shadow-xs select-none"
                      title={`Level ${levelInfo.level} • ${levelInfo.rank.name} Rank`}
                    >
                      <span>{levelInfo.rank.badge}</span>
                      <span>Lv {levelInfo.level}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Sound Toggle Button */}
              <button
                type="button"
                onClick={toggleSound}
                className="min-h-[36px] min-w-[36px] p-2 bg-white/70 hover:bg-white border border-white/80 rounded-xl text-emerald-950 shadow-xs flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
                aria-label={soundOn ? "Mute Audio" : "Enable Audio"}
                title={soundOn ? "Sound: ON" : "Sound: OFF"}
              >
                {soundOn ? (
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                )}
              </button>

              {/* Multilingual Switcher (EN | हि/हिन्दी | తె/తెలుగు) */}
              {onLanguageChange && (
                <div
                  className="flex items-center bg-white/60 p-0.5 border border-white/80 rounded-xl shadow-xs"
                  role="group"
                  aria-label="Select Interface Language"
                >
                  <button
                    type="button"
                    data-l="en"
                    onClick={() => onLanguageChange("en")}
                    className={`min-h-[32px] min-w-[28px] sm:min-w-[34px] px-1.5 sm:px-2 text-[11px] sm:text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      currentLang === "en"
                        ? "bg-emerald-600 text-white shadow-xs font-extrabold"
                        : "text-emerald-950/70 hover:text-emerald-950 hover:bg-white/50"
                    }`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    data-l="hi"
                    onClick={() => onLanguageChange("hi")}
                    className={`min-h-[32px] min-w-[28px] sm:min-w-[38px] px-1.5 sm:px-2 text-[11px] sm:text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      currentLang === "hi"
                        ? "bg-emerald-600 text-white shadow-xs font-extrabold"
                        : "text-emerald-950/70 hover:text-emerald-950 hover:bg-white/50"
                    }`}
                  >
                    <span className="sm:hidden">हि</span>
                    <span className="hidden sm:inline">हिन्दी</span>
                  </button>
                  <button
                    type="button"
                    data-l="te"
                    onClick={() => onLanguageChange("te")}
                    className={`min-h-[32px] min-w-[28px] sm:min-w-[38px] px-1.5 sm:px-2 text-[11px] sm:text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      currentLang === "te"
                        ? "bg-emerald-600 text-white shadow-xs font-extrabold"
                        : "text-emerald-950/70 hover:text-emerald-950 hover:bg-white/50"
                    }`}
                  >
                    <span className="sm:hidden">తె</span>
                    <span className="hidden sm:inline">తెలుగు</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      {/* ================================================================= */}
      {/* MOBILE FLOATING BOTTOM NAVIGATION BAR (< 768px)                   */}
      {/* ================================================================= */}
      <nav
        aria-label="Mobile navigation"
        className="mobile-bottom-nav md:hidden"
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
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl min-w-[50px] min-h-[44px] transition-all cursor-pointer ${
                isActive
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-emerald-950/70 hover:text-emerald-950 hover:bg-white/60"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-emerald-700"}`} aria-hidden="true" />
              <span className="text-[10px] font-heading font-bold mt-0.5 leading-none tracking-tight">
                {localizedLabel}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export default Navigation;
