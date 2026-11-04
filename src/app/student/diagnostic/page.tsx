"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Target,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldAlert,
  GitBranch,
  BookOpen,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { LearnerProfile, SupportedLanguage } from "@/lib/types";
import {
  getActiveProfile,
  createLearnerProfile,
} from "@/lib/storage";
import { syncClassProgression } from "@/lib/progression";
import {
  getChaptersByClass,
  canTakeChapterDiagnostic,
  getConceptsByChapter,
} from "@/lib/curriculum";

export default function DiagnosticHubPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>("en");

  useEffect(() => {
    const active = getActiveProfile();
    if (!active || !active.selectedClass) {
      router.replace("/student/select-class");
      return;
    }
    const synced = syncClassProgression(active);
    setProfile(synced);
    setIsLoaded(true);
  }, [router]);

  useEffect(() => {
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  if (!isLoaded || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-800">
        <div className="glass-panel p-6 rounded-2xl text-center shadow-lg border border-white/70">
          <div className="w-8 h-8 border-3 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="font-heading text-xs text-cyan-950">Opening quick check...</p>
        </div>
      </div>
    );
  }

  const studyClass = (profile.studyClass || profile.selectedClass || 10) as 6 | 7 | 8 | 9 | 10;
  const chapters = getChaptersByClass(studyClass);

  return (
    <div className="min-h-screen text-slate-800 flex flex-col justify-between">
      {/* Top Floating Glass Navigation */}
      <Navigation
        currentTab="diagnostic"
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        profile={profile}
        showTopBar={true}
      />

      {/* Main Diagnostic Content */}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full flex-1 space-y-6 has-mobile-nav">
        
        {/* Diagnostic Header */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/80 shadow-[0_12px_40px_rgba(16,42,18,0.1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-100/90 border border-cyan-300 text-[10px] font-heading font-extrabold text-cyan-900 uppercase tracking-wide">
                Chapter Placement
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/80 border border-white text-[10px] font-heading font-bold text-slate-700">
                Class {studyClass} Mathematics
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-emerald-950">
              Chapter quick checks
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 font-sans max-w-xl">
              Quick checks show how well you know earlier topics. Scoring 70% or higher opens all chapter lessons.
            </p>
          </div>

          <Link
            href="/student/learn"
            className="py-2.5 px-4 rounded-xl bg-white/80 hover:bg-white text-emerald-900 font-heading font-bold text-xs flex items-center gap-1.5 border border-white shadow-xs transition-colors shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>View all lessons</span>
          </Link>
        </div>

        {/* Chapter Diagnostic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapters.map((chapter) => {
            const hasDiagnostic = canTakeChapterDiagnostic(chapter.id);
            const chapterConcepts = getConceptsByChapter(chapter.id);

            return (
              <div
                key={chapter.id}
                className={`glass-panel p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                  hasDiagnostic
                    ? "border-cyan-400/80 hover:scale-[1.01] shadow-xs"
                    : "border-slate-200/80 bg-white/60 opacity-80"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-900">
                      Chapter {chapter.chapterNumber}
                    </span>
                    {hasDiagnostic ? (
                      <span className="text-[10px] font-heading font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Quick check ready
                      </span>
                    ) : (
                      <span className="text-[10px] font-heading font-bold text-slate-500">
                        Learn Direct
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading font-extrabold text-base text-emerald-950">
                    {chapter.name[currentLang] || chapter.name.en}
                  </h3>
                  <p className="text-xs text-slate-600 font-sans">
                    {chapterConcepts.length} Concepts in this chapter syllabus.
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/60">
                  {hasDiagnostic ? (
                    <Link
                      href={`/student/diagnostic/${chapter.id}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-heading font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                    >
                      <Target className="w-3.5 h-3.5" />
                      <span>Start check</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <Link
                      href="/student/learn"
                      className="w-full py-2 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-heading font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Go to lessons</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-[1200px] mx-auto px-4 my-6 text-center text-xs font-sans font-medium text-emerald-950/70">
        Margam • Adaptive Mathematics for NCERT Classes 6–10
      </footer>
    </div>
  );
}

