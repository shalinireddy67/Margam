"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Volume2, VolumeX, Flame } from "lucide-react";
import { SupportedLanguage, LearnerProfile } from "@/lib/types";
import { Logo } from "@/components/ui";
import { isSoundEnabled, setSoundEnabled, playPopSound } from "@/lib/sound";
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

  const levelInfo = profile ? getLevelProgress(profile.xp || 0) : null;
  const gradeNames: Record<number, string> = {
    6: "Class 6 • Ganita Prakash",
    7: "Class 7 • Ganita Prakash",
    8: "Class 8 • Ganita Prakash",
    9: "Class 9 • Ganita Manjari",
    10: "Class 10 • Mathematics",
  };

  return (
    <header className="sticky top-0 z-40 bg-[#5A3720]/95 backdrop-blur-md border-b-4 border-[#422816] shadow-[0px_4px_0px_rgba(0,0,0,0.35)] transition-all">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand + Back or Grade Scope */}
        <div className="flex items-center gap-3">
          {backHref ? (
            <Link
              href={backHref}
              className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] gap-2 text-xs font-heading text-[#FFF7E6] hover:text-[#FFE9A8] py-1.5 px-3 bg-[#422816] border-2 border-[#7A4B2A] rounded-[2px] shadow-[2px_2px_0px_rgba(0,0,0,0.35)] active:translate-x-0.5 active:translate-y-0.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-[#FFE9A8]" />
              <span className="hidden sm:inline">{backLabel}</span>
            </Link>
          ) : (
            <Link
              href="/"
              className="flex items-center min-h-[48px] gap-2.5 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#FFE9A8]"
            >
              <div className="w-8 h-8 rounded-[2px] border-2 border-[#422816] bg-[#7A4B2A] shadow-[2px_2px_0px_rgba(0,0,0,0.35)] flex items-center justify-center">
                <Logo className="w-full h-full" ariaLabel="Margam" />
              </div>
              <span className="font-heading font-extrabold text-lg sm:text-xl text-[#FFE9A8] tracking-wider drop-shadow-[2px_2px_0px_#2B1B0F]">
                MARGAM
              </span>
            </Link>
          )}

          {profile && (
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l-2 border-[#7A4B2A]">
              <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-heading font-bold bg-gradient-to-b from-[#5DAA3A] to-[#2F6B22] text-[#FFF7E6] border-2 border-[#204514] rounded-[2px] shadow-[2px_2px_0px_rgba(0,0,0,0.35)]">
                {gradeNames[profile.selectedClass] || `Class ${profile.selectedClass}`}
              </span>
            </div>
          )}
        </div>

        {/* Right: Sound Toggle, Streak, Level, & Language Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          {profile && (
            <div className="hidden xs:flex items-center gap-1.5">
              {/* Level & Rank Pill */}
              <div
                className="flex items-center gap-1 px-2.5 py-1 bg-[#422816] border-2 border-[#7A4B2A] rounded-[2px] text-xs font-heading font-bold text-[#FFE9A8] shadow-[2px_2px_0px_rgba(0,0,0,0.35)]"
                title={`${levelInfo?.rank.name} Rank • Level ${levelInfo?.level} (${profile.xp || 0} XP)`}
              >
                <span>{levelInfo?.rank.badge}</span>
                <span className="hidden sm:inline">{levelInfo?.rank.name}</span>
                <span>Lv {levelInfo?.level}</span>
              </div>

              {/* Streak Flame Pill */}
              <div
                className="flex items-center gap-1 px-2 py-1 bg-[#422816] border-2 border-[#7A4B2A] rounded-[2px] text-xs font-heading font-bold text-[#FFB36B] shadow-[2px_2px_0px_rgba(0,0,0,0.35)]"
                title={`Daily Streak: ${profile.streak?.current || 0} days`}
              >
                <Flame className="w-3.5 h-3.5 text-[#FF8A3D] fill-[#FF8A3D]" />
                <span>{profile.streak?.current || 0}</span>
              </div>
            </div>
          )}

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label={soundOn ? "Mute sound effects" : "Enable sound effects"}
            title={soundOn ? "Sound Effects: ON" : "Sound Effects: OFF"}
            className={`min-h-[38px] min-w-[38px] px-2 flex items-center justify-center text-xs font-bold rounded-[2px] border-2 transition-all cursor-pointer ${
              soundOn
                ? "bg-[#5DAA3A] text-[#FFE9A8] border-[#204514] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4),2px_2px_0px_rgba(0,0,0,0.35)]"
                : "bg-[#422816] text-[#A68A72] border-[#7A4B2A] hover:text-[#FFE9A8] shadow-[2px_2px_0px_rgba(0,0,0,0.35)]"
            }`}
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-[#FFE9A8]" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Language Switcher */}
          <div className="shrink-0 flex items-center gap-1 bg-[#422816] p-1 border-2 border-[#7A4B2A] rounded-[2px] shadow-[2px_2px_0px_rgba(0,0,0,0.35)]">
            <button
              type="button"
              data-l="en"
              onClick={() => onLanguageChange("en")}
              className={`shrink-0 min-h-[38px] min-w-[38px] flex items-center justify-center px-2 py-1 text-xs font-bold rounded-[2px] transition-all ${
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
              className={`shrink-0 min-h-[38px] min-w-[44px] flex items-center justify-center px-2 py-1 text-xs font-bold rounded-[2px] transition-all ${
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
              className={`shrink-0 min-h-[38px] min-w-[44px] flex items-center justify-center px-2 py-1 text-xs font-bold rounded-[2px] transition-all ${
                currentLang === "te"
                  ? "bg-[#FFE9A8] text-[#2B1B0F] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.9)]"
                  : "text-[#FFF7E6] hover:text-[#FFE9A8]"
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
