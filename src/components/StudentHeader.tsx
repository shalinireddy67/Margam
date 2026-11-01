"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Compass, User, Globe, AlertTriangle, ArrowLeft } from "lucide-react";
import { SupportedLanguage, LearnerProfile } from "@/lib/types";

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
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const gradeNames: Record<number, string> = {
    6: "Class 6 • Ganita Prakash",
    7: "Class 7 • Ganita Prakash",
    8: "Class 8 • Ganita Prakash",
    9: "Class 9 • Ganita Manjari",
    10: "Class 10 • Mathematics",
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand + Back or Grade Scope */}
        <div className="flex items-center gap-3">
          {backHref ? (
            <Link
              href={backHref}
              className="inline-flex items-center justify-center min-h-[48px] min-w-[48px] gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground py-2 px-3 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">{backLabel}</span>
            </Link>
          ) : (
            <Link
              href="/"
              className="flex items-center min-h-[48px] gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-soft">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-heading font-extrabold text-xl text-foreground tracking-tight">
                Margam
              </span>
            </Link>
          )}

          {profile && (
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-border">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-foreground border border-slate-200">
                {gradeNames[profile.selectedClass] || `Class ${profile.selectedClass}`}
              </span>
            </div>
          )}
        </div>

        {/* Right: Language Switcher & Profile Details */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => onLanguageChange("en")}
              className={`min-h-[48px] min-w-[48px] flex items-center justify-center px-2 py-2 rounded-lg text-xs font-bold transition-all ${
                currentLang === "en" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange("hi")}
              className={`min-h-[48px] min-w-[48px] flex items-center justify-center px-2 py-2 rounded-lg text-xs font-bold transition-all ${
                currentLang === "hi" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              हिन्दी
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange("te")}
              className={`min-h-[48px] min-w-[48px] flex items-center justify-center px-2 py-2 rounded-lg text-xs font-bold transition-all ${
                currentLang === "te" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              తెలుగు
            </button>
          </div>

          {/* Profile Badge & Menu */}
          {profile && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 min-h-[48px] py-1.5 px-3 rounded-xl bg-white hover:bg-slate-50 border border-border text-xs font-semibold text-foreground transition-colors"
                aria-expanded={showProfileMenu}
                aria-label="Learner Profile Menu"
              >
                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="max-w-[100px] truncate">{profile.name}</span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-border p-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="pb-2.5 mb-2.5 border-b border-border">
                    <p className="text-xs font-bold text-foreground">{profile.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      Locked to Class {profile.selectedClass}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Adaptive Difficulty: Level {profile.currentDifficulty} / 3
                    </p>
                  </div>

                  <Link
                    href="/login"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 w-full p-2 rounded-xl text-xs font-semibold text-primary hover:bg-primary/5 transition-colors mb-1"
                  >
                    <User className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>Cloud Sync / Sign In</span>
                  </Link>

                  <Link
                    href="/student/reset-class"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 w-full p-2 rounded-xl text-xs font-semibold text-amber-700 hover:bg-amber-50 transition-colors"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Reset Class / Switch Grade</span>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
