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

  const levelInfo = profile ? getLevelProgress(profile.xp || 0) : null;

  return (
    <>
      {/* ================================================================= */}
      {/* DESKTOP-FIRST FLOATING FROSTED GLASS TOP NAVBAR                   */}
      {/* ================================================================= */}
      {showTopBar && (
        <header
          aria-label="Primary navigation"
          className={`sticky top-3 z-50 max-w-[1240px] mx-auto px-3 sm:px-6 w-full ${className}`}
        >
          <div className="glass-panel px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3 shadow-[0_8px_32px_rgba(16,42,18,0.12)] border border-white/70">
            {/* Left: Brand Identity */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2.5 min-h-[44px] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl"
                aria-label="Margam Home"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-sm border border-white/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Logo className="w-5 h-5 text-white" ariaLabel="Margam Logo" />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-extrabold text-base sm:text-lg text-emerald-950 tracking-wider leading-none">
                    MARGAM
                  </span>
                  <span className="text-[9px] font-sans font-bold text-emerald-700 leading-tight hidden sm:block mt-0.5">
                    Adaptive Math Realm • Classes 6–10
                  </span>
                </div>
              </Link>

              {/* Class Scope Badge */}
              {profile && (
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-100/90 border border-emerald-300 text-[10px] font-heading font-extrabold text-emerald-900 shadow-xs">
                  Class {profile.selectedClass}
                </span>
              )}
            </div>

            {/* Center: Desktop Navigation Links */}
            <nav
              className="flex items-center gap-1 sm:gap-1.5"
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
                    className={`min-h-[40px] px-2.5 sm:px-3.5 py-1.5 text-xs font-heading font-extrabold flex items-center gap-1.5 sm:gap-2 rounded-xl transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-sm border border-emerald-400/50"
                        : "text-emerald-950/80 hover:text-emerald-950 hover:bg-white/60"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-emerald-700"}`} aria-hidden="true" />
                    <span className="hidden md:inline">{localizedLabel}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right: Sound, Streak, Level Chip & Language Switcher */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Gamification Pills */}
              {profile && (
                <div className="hidden lg:flex items-center gap-2">
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
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50/90 border border-emerald-200/80 text-xs font-heading font-bold text-emerald-800 shadow-xs select-none"
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
                className="min-h-[38px] min-w-[38px] p-2 bg-white/70 hover:bg-white/90 border border-white/80 rounded-xl text-emerald-950 shadow-xs flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
                aria-label={soundOn ? "Mute Game Audio" : "Enable Game Audio (8-bit synth sound effects)"}
                title={soundOn ? "Sound: ON" : "Sound: OFF"}
              >
                {soundOn ? (
                  <Volume2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400" aria-hidden="true" />
                )}
              </button>

              {/* Multilingual Switcher (EN | हिन्दी | తెలుగు) */}
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
                    className={`min-h-[34px] min-w-[32px] sm:min-w-[36px] px-1.5 sm:px-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
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
                    className={`min-h-[34px] min-w-[36px] sm:min-w-[40px] px-1.5 sm:px-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      currentLang === "hi"
                        ? "bg-emerald-600 text-white shadow-xs font-extrabold"
                        : "text-emerald-950/70 hover:text-emerald-950 hover:bg-white/50"
                    }`}
                  >
                    हिन्दी
                  </button>
                  <button
                    type="button"
                    data-l="te"
                    onClick={() => onLanguageChange("te")}
                    className={`min-h-[34px] min-w-[36px] sm:min-w-[40px] px-1.5 sm:px-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      currentLang === "te"
                        ? "bg-emerald-600 text-white shadow-xs font-extrabold"
                        : "text-emerald-950/70 hover:text-emerald-950 hover:bg-white/50"
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
    </>
  );
}

export default Navigation;
