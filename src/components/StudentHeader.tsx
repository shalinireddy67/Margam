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
    <header className="sticky top-3 z-50 max-w-[1240px] mx-auto px-3 sm:px-6 w-full transition-all">
      <div className="glass-panel px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4 shadow-[0_8px_32px_rgba(16,42,18,0.1)] border border-white/70">
        {/* Left: Brand + Back or Grade Scope */}
        <div className="flex items-center gap-3">
          {backHref ? (
            <Link
              href={backHref}
              className="inline-flex items-center justify-center min-h-[38px] gap-2 text-xs font-heading font-bold text-emerald-950 hover:text-emerald-900 py-1.5 px-3 bg-white/75 hover:bg-white border border-white/80 rounded-xl shadow-xs transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">{backLabel}</span>
            </Link>
          ) : (
            <Link
              href="/"
              className="flex items-center min-h-[44px] gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-sm border border-white/60 flex items-center justify-center text-white">
                <Logo className="w-5 h-5 text-white" ariaLabel="Margam" />
              </div>
              <span className="font-heading font-extrabold text-base sm:text-lg text-emerald-950 tracking-wider">
                MARGAM
              </span>
            </Link>
          )}

          {profile && (
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-emerald-900/10">
              <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-heading font-bold bg-emerald-100/90 text-emerald-900 border border-emerald-300 rounded-full shadow-xs">
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
                className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50/90 border border-emerald-200/80 rounded-xl text-xs font-heading font-bold text-emerald-800 shadow-xs select-none"
                title={`${levelInfo?.rank.name} Rank • Level ${levelInfo?.level} (${profile.xp || 0} XP)`}
              >
                <span>{levelInfo?.rank.badge}</span>
                <span className="hidden sm:inline">{levelInfo?.rank.name}</span>
                <span>Lv {levelInfo?.level}</span>
              </div>

              {/* Streak Flame Pill */}
              {profile.streak && profile.streak.current > 0 && (
                <div
                  className="flex items-center gap-1 px-2 py-1 bg-amber-50/90 border border-amber-200/80 rounded-xl text-xs font-heading font-bold text-amber-800 shadow-xs select-none"
                  title={`${profile.streak.current} day study streak`}
                >
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" aria-hidden="true" />
                  <span>{profile.streak.current}d</span>
                </div>
              )}
            </div>
          )}

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="min-h-[38px] min-w-[38px] p-2 bg-white/70 hover:bg-white/90 border border-white/80 rounded-xl text-emerald-950 shadow-xs flex items-center justify-center transition-all cursor-pointer"
            aria-label={soundOn ? "Mute Game Audio" : "Enable Game Audio"}
            title={soundOn ? "Sound: ON" : "Sound: OFF"}
          >
            {soundOn ? (
              <Volume2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" aria-hidden="true" />
            )}
          </button>

          {/* Language Switcher */}
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
        </div>
      </div>
    </header>
  );
}
